# CMS / R2 剩余改造执行记录

日期：2026-10-10。后续：2026-10-12 管理员授权与认证保存已完成，见 [授权验收记录](exec-cms-admin-verification-2026-10-12.md)。以下记录保留 2026-10-10 当时的验证范围。仓库起点 `1d051c9`，GitHub 主分支只读核对与本地起点一致。本轮代码尚未提交或部署；生产数据库和 R2 配置的实际变更另列。

## 1. 范围与状态

| 项目 | 状态 |
|---|---|
| Workbench `0019` | 生产已部署；2 条流程，7 / 5 步；anon 读取验证通过 |
| Workbench 写权限 | RLS 仅允许服务端 `app_metadata.cms_role=admin`；现有账号授权待用户确认 |
| 大文件直传 | 代码完成，所有后台媒体入口接入；真实 R2 上传测试通过 |
| 静态媒体 | 182 文件 / 601,898,269 字节（574.01 MiB）；逐文件迁移与公开 SHA-256 校验完成，解析代码待上线 |
| 发布 | 本轮未 commit / push；需在最终校验后部署代码，不能把远端配置完成视作代码上线 |

## 2. 大文件直传

浏览器调用 `POST /api/admin/media`，服务端使用 `auth.getUser()` 和服务端管理员标记验证会话，拒绝匿名用户与跨站来源。文件大小/类型按 scope 校验，服务端生成 UUID 对象键，签名 10 分钟内有效。浏览器直接 PUT 到 R2，Vercel 只收 JSON 元数据。

签名包含 Content-Type、Content-Length、If-None-Match 及请求中实际发送的缓存、下载方式和归属元数据头。归属元数据通过签名 header 传递；R2 不应依赖被 hoist 到 query 的元数据来做完成验证。完成阶段 HEAD 核验大小、类型、用户与 scope；图片、MP4、PDF、ZIP 额外核对文件头。Hero 读回原文件，压缩为 1920px WebP q75，生成新对象。

完成收据通过用途隔离的 HMAC 签名，绑定用户、scope、对象、类型、大小与有效期；保存表单时再次验证收据和 R2 HEAD，拒绝客户端自行拼接 URL。收据有效期 24 小时。新键为 `uploads/<scope>/<user-id>/<uuid>.<ext>`，对象不可覆盖，缓存一年。

接入 Projects 封面 / 图廊 / hero 与 intro MP4、Photography、Drawings、Field Notes 封面 / 媒体、About 裁切照片、Site Hero、Notes 附件与编辑器粘贴。图片和普通附件上限 32 MiB，MP4 上限 256 MiB。Supabase provider 的小文件兼容回退上限 4 MiB，Hero 压缩保留。

`MediaUploadForm` 保存失败时保留表单输入，上传期间禁止重复提交；图廊成功后清空表单。上传成功但内容保存失败的对象及 Hero 原文件不会自动删除；不要用旧回滚清单覆盖迁移后的新上传。

真实测试：5,398,480 字节 JPEG，CORS OPTIONS 204、PUT 200、完成验证通过、重复 PUT 412。对象已清理；证据 `.media-migration/direct-upload-live-check.json`（忽略文件）。这项测试验证 R2 协议和文件核验；尚未完成获得管理员标记后的后台端到端保存。

## 3. 静态媒体

`npm run migrate:static-media` 默认只清点；`--apply` 上传并校验。覆盖 public 中 182 个 JPEG / PNG / WebP / GIF / AVIF / MP4 / PDF 文件；6 个 SVG UI 资产继续本地交付。

内容相同且 SHA-256 相同的旧对象可复用；当前 1 个复用、181 个新对象。其余对象使用 `static/<sha256>/<filename>`，上传有 If-None-Match 和 SHA-256 校验。R2 一次只允许一个非默认校验头，不同时发送 Content-MD5 和 SHA-256。HEAD 比较单次 PUT 的 ETag/MD5 与大小，公开地址按 1 MiB Range 重建完整 SHA-256；已验证的断点在 HEAD 核对后复用。并发受控、失败停止新操作并等待在途操作结束。

本地代理下脚本使用 `NODE_USE_ENV_PROXY=1`；设置超时与有限重试。进度、计划、最终证据使用独立的 `.media-migration/static-media-*.json`，原正式 `r2-plan.json` 不覆盖。只在所有资产验证成功后写入 `lib/media/public-media-manifest.json`。

`resolvePublicMedia()` 仅替换清单中的真实文件；页面路由、外链和未知路径保持原样。用于静态回退、翻页、图集及 Notes 图片；Notes 原路径维度信息保留。数据库正文仍可保留本地别名，不做无必要的正文重写。源 public 文件保留。

`STATIC_MEDIA_PROVIDER` 可独立设为 `local` / `r2`，默认跟随 `MEDIA_STORAGE_PROVIDER`。Next 配置只向浏览器注入公开域名，不注入 R2 凭据。静态交付回退：设 `STATIC_MEDIA_PROVIDER=local` 并重新构建 / 部署，CMS 已有 R2 引用仍照常读取。

## 4. Workbench 与审批

旧迁移脚本对所有 authenticated 用户开放写入，被自动审批拒绝。已改成 `auth.jwt()->app_metadata->cms_role` 必须为 admin，生产迁移通过。SELECT 供公开内容读取，写入仍需 RLS；没有授予任意登录用户写入权限。

为现有唯一 CMS 账号设置管理员标记的操作被自动审批单独拒绝，原因是需要对具体账号的持久授权。已向用户提出准确的账号与权限确认；未通过其他工具绕过。授权后重新登录 / 刷新 token，再做后台保存与前台读取回归。

已有 advisor 项（更新时间触发器 search_path、原 Guestbook / Analytics security definer 接口及泄漏密码保护）独立处理；未通过关闭 RLS 或扩大 authenticated 权限消除告警。

## 5. 验证与发布

- 已通过：20 项原媒体迁移测试、4 项图片性能测试、6 项直传安全 / 附件兼容测试、3 项静态媒体测试，共 33 项；lint 与类型检查通过。
- 静态清单 182 条全部匹配源文件 SHA-256 / 大小，共 601,898,269 字节；公开校验证据生成于 2026-10-10T10:30:54.370Z。1 条复用，181 条新对象。
- 浏览器：首页 8 / 8 图片加载成功；作品集 28 个图像元素（15 个跨页）全部加载，Next spread 从 01 / 15 切到 02 / 15；Notes 英文文章 4 / 4 图片在进入视口后加载；Drawings 22 / 22 加载。开发预览启用了本地直读开关，不能据此替代上线后 Next 图片优化端点验收。
- 本地上传 API：合法 Origin 未登录返回 401，跨站 Origin 返回 403；获得管理员标记后的真实 CMS 保存仍待验收。
- 开发预览观察到既有 Notes 标题重复渲染产生的 hydration 提示及浏览器翻译扩展注入属性提示；图片加载与清单校验正常，未将该提示误写为迁移故障。
- 最终 `npm run build` 通过：Next.js 16.2.1 编译、TypeScript、41 / 41 预生成页面完成；随后 `tsc --noEmit` 通过。保留既有 middleware → proxy 弃用提示。新代码未提交或部署。
- R2 CORS 当前只允许正式域名与 localhost 3000 / 3005；Headers 精确覆盖签名 PUT 所需字段。Preview 部署须单独添加准确 origin，不能用全域通配符代替。
- 本轮不删除 public 文件、Supabase 原对象、旧回滚清单或生产内容。

## 6. 依据

使用 Supabase 技能核对 [changelog](https://supabase.com/changelog.md) 和 MCP [RLS 文档](https://supabase.com/docs/guides/database/postgres/row-level-security)。Next Route Handlers 依据安装版本的 `node_modules/next/dist/docs/`。Context7 获取 [R2 presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/) 与 [S3 compatibility](https://developers.cloudflare.com/r2/api/s3/api/)，Cloudflare MCP 检索并应用 bucket CORS。Firecrawl 插件尚未连接，本轮未声称使用该服务。

相关：[媒体运维](experience-media-storage.md)、[CMS 验收清单](cms-migration-checklist.md)、[架构](architecture.md)、[开发指南](developer-guide.md)。

## 2026-10-12 后续完成状态

管理员授权及实际 CMS 保存已完成，见 [管理员验收](exec-cms-admin-verification-2026-10-12.md)。首页展示图表及 RLS 优化已迁移，浏览器真实项目/摄影/手绘直传、跨板块草稿、刷新和恢复通过；见 [首页图执行记录](exec-site-featured-images-2026-10-12.md)。前文待授权/待保存是当轮历史状态。新版代码仍待部署，正式域名优化端点与上传验收保留为待办。
