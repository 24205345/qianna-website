# 媒体存储配置、验收与排障

最后更新：2026-10-10。当前架构见 [architecture.md](architecture.md)，正式迁移证据见 [exec-mcp-storage-2026-10-10.md](exec-mcp-storage-2026-10-10.md)。

## 1. 当前存储模式

Supabase 提供 Postgres、Auth 和 RLS；生产公开文件使用 Cloudflare R2 `portfolio-media`，交付地址为 `https://media.qiannawang.com`。业务表仍保存公开 URL。新版使用清单解析 `public/` 媒体别名并保留源文件；Google Drive 外链继续使用原路径。新版交付与直传代码尚未部署，实际分项状态见 [剩余迁移执行记录](exec-cms-storage-completion-2026-10-10.md)。

已部署版本的后台上传经认证的 Server Action 调用 `lib/media/storage.ts`，核心实现为 `storage-core.ts`。本轮新版改为认证的 JSON API 签名、浏览器 PUT 和 Server Action 收据核验，详见下文。`MEDIA_STORAGE_PROVIDER` 未指定时默认 `supabase`；生产显式设置 `r2`。R2 配置不完整或上传失败会报错，不会静默写入另一端。

迁移已复制 160 文件，更新 159 行；`.media-migration/r2-plan.json` 保存原字段、目标字段、SHA-256 与状态。清单、两端对象和后续新上传需要共同保留，不能只保留代码。

## 2. 环境与缓存

| 配置 | 用途 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | CMS 公开连接；访问权限仍由 Auth / RLS 控制 |
| `MEDIA_STORAGE_PROVIDER=r2` | 新上传写入 R2；不自动改写已有 URL |
| `STATIC_MEDIA_PROVIDER` | 可选 local / r2；默认跟随上传 provider，构建时决定静态文件公开 URL |
| `R2_PUBLIC_BASE_URL=https://media.qiannawang.com` | 公开 URL 生成及 Next.js 图片白名单；浏览页面也需要配置 |
| `R2_ACCOUNT_ID` / `R2_BUCKET_NAME` | 服务端 S3 目标 |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | 仅本桶 Object Read & Write，服务端保存 |
| `DEV_IMAGE_UNOPTIMIZED=false` | 默认仍优化；本地代理 DNS 故障时可设 true，仅 development 生效 |
| `SUPABASE_ADMIN_EMAIL` / `SUPABASE_ADMIN_PASSWORD` | 仅本地迁移脚本登录，不部署 |

`R2_PUBLIC_BASE_URL` 必须是无用户名、密码、查询参数或 fragment 的 HTTPS 交付地址。私有 S3 endpoint `<account>.r2.cloudflarestorage.com` 用于 API 调用，不用于业务公开 URL。自定义域名提供生产公开访问；`r2.dev` 仅适合开发测试，官方说明见 [Public buckets](https://developers.cloudflare.com/r2/buckets/public-buckets/)。

新文件默认长缓存 1 年、`immutable`，新增对象使用 `If-None-Match: *` 防止覆盖。替换文件产生新 URL。既有初始化脚本允许覆盖确定路径，缓存为 1 小时。数据库删除动作不会自动清理存储对象，孤立对象清理需另行审查引用。

本地 `.env.local`、Vercel Sensitive 配置与 MCP OAuth 是不同层次：OAuth 用于管理云资源，应用仍需要 S3 凭据。Production / Preview 环境分别配置，修改 provider 或图片白名单后重新部署；本地修改后重启服务。

## 3. 裂图排查

先从浏览器实际失败的图片 URL 开始，分别检查原始 URL、`/_next/image`、生产与本地环境，记录状态码和开发服务日志。

| 现象 | 核对与处理 |
|---|---|
| 原图 404 | 核对对象键、大小写、URL 编码及 R2 清单；静态路径则核对 `public/` 文件 |
| 原图 401 / 403 | 核对公开域名绑定、访问规则和 URL 类型；不能把私有 S3 API 地址当图片地址 |
| 原图 200，优化请求 400 | 核对 `R2_PUBLIC_BASE_URL`、remotePatterns 的域名/路径/查询参数及 Next 日志 |
| 生产优化 200，本地优化 400 | 核对本地配置是否重载和 DNS 是否被代理映射为私网地址 |
| 新图仍显示旧内容 | 使用新对象 URL，检查缓存头与 CMS 字段是否保存；不要覆盖 immutable 对象 |
| 本地静态路径 404 | 普通 clone 包含已跟踪资产；使用 sparse-checkout 时才核对检出范围并补下载 |

2026-10-10 的 Hero / Yubeng / White Cliffs 故障：原图和生产优化均 200，本地优化 400，日志显示媒体域名解析为私网地址。`"url" parameter is not allowed` 也可能来自私网源检查，不能只凭这条错误认定白名单缺失。

代理 DNS 场景在 `.env.local` 设置 `DEV_IMAGE_UNOPTIMIZED=true` 并重启服务，让开发浏览器直接读取公开原图。代码只在 development 启用；生产继续图片优化。没有启用 `dangerouslyAllowLocalIP`，仍使用 Next 默认私网保护。恢复公共 DNS 后设回 false，并重新验证本地优化请求。

本次修复已验证首页全部 8 张图片 `complete=true` 且 `naturalWidth>0`。这是当次验收结果，后续新增内容仍需重新检查。

## 4. 部署与上传验收

1. 核对部署目标为 `24205345s-projects/qianna-site`，域名为 `www.qiannawang.com`；确认目标环境有完整 R2 配置。
2. 检查首页、About、Projects 详情、Photography、Drawings、Field Notes、Notes 和后台预览。页面 HTTP 200 不能证明图片已加载，需观察实际请求和图片尺寸。
3. 检查至少一张 R2 原图和生产 `/_next/image`。视频存在时验证 Range 请求返回 206 及正确 Content-Range / Content-Type。
4. 登录后台测试真实上传，确认返回的是 R2 公开 URL、前台能够读取。测试内容不得混入正式文章，完成后清理测试记录与对象。
5. 修改存储代码时运行 `npm run test:media`、lint、类型检查及按范围需要的构建。仅改文档核对链接、命令与 Git diff。

新版后台使用 `/api/admin/media` 获取 10 分钟签名 PUT，文件直接传 R2；完成核验后，Server Actions 只传文本与签名收据。图片 / 附件 32 MiB、MP4 256 MiB；真实 5.15 MiB 测试通过。CORS 必须包含所有实际发送的签名头，归属元数据不应 hoist 到 query。代码未上线前仍使用旧流程；Vercel 的 4.5 MB 请求体上限仍有效，应用 `bodySizeLimit: "20mb"` 不能扩大它，见 [Vercel Functions limits](https://vercel.com/docs/functions/limitations)。

上传返回 403 时区分 API 的 CMS admin 标记与 R2 的签名 / CORS 错误；完成核验失败则检查 HEAD 的大小、类型和上传归属元数据。Preview 必须加准确 origin；不能开放所有来源。保存失败保留表单输入，未引用的对象另行盘点。

## 5. 迁移与回滚

静态资产使用 `npm run migrate:static-media`（默认只读）或 `-- --apply`（上传与验证）。本地代理可设 `$env:NODE_USE_ENV_PROXY = "1"`。源文件与独立进度记录保留；仅全部验证通过后发布清单。静态交付回退使用 `STATIC_MEDIA_PROVIDER=local` 并重建，不改写 CMS 已有 R2 URL。

原桶存量迁移使用 `migrate:r2` 六阶段；完整首次操作顺序见 [R2 执行步骤](exec-cloudflare-r2-2026-10-09.md#5-正式迁移顺序)。当前已完成迁移，不要重新生成或覆盖正式清单。

`migrate:media`、`migrate:photography`、`migrate:visual-works`、`migrate:field-notes` 是初始化脚本，可能删除并重建媒体记录；`migrate:home` 和 `recompress:home` 会更新 Hero，不属于只读验收。

如确需回滚：

1. 暂停 CMS 编辑及上传，备份正式清单并核对目标项目。另列出切换后的新上传与相关编辑，原清单不覆盖这些变化。
2. 执行 `npm run migrate:r2 -- --rollback`。若使用自定义清单，所有命令需带同一 `--manifest` 路径。脚本比较当前值，仅恢复仍匹配的字段；遇到冲突停止并逐条核对。
3. 本地和 Vercel provider 改回 `supabase`，重新部署。开关只影响后续上传，不能代替数据库 URL 回滚。
4. 验证页面、优化图片和真实上传；保留 R2 对象，尤其是切换后新增内容，不要立即删除任一端文件。

正式清单包含原始 CMS 值，被 Git 与部署包忽略。需在仓库外另做受控备份；GitHub 上的提交无法替代该清单。

## 首页板块展示图覆盖

/admin/site 的 Projects / Traces 支持逐图设置首页覆盖，scope 为 site-featured，使用同一 R2 签名直传协议、文件上限和回执校验。home_featured_images 仅保存 project:<slug> / trace:<id> 与公开 URL，null 恢复原图。原图库、项目详情资源和对象不删除。生产两项新迁移已执行；浏览器真实上传、刷新、跨标签与恢复测试通过，代码待部署。新环境按迁移历史应用表结构及 RLS 查询优化；当前执行状态和验收步骤见 [记录](exec-site-featured-images-2026-10-12.md)。
