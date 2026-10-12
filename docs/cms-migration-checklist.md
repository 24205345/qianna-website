# CMS 与媒体迁移验收清单

最后更新：2026-10-12。当前状态以本清单和 [开发指南](developer-guide.md) 为准；早期阶段规划见历史执行记录。提交与推送仅在用户明确要求时执行。

## 1. 当前交付状态

| 模块 | 状态 | 实现与验收入口 |
|---|---|---|
| Supabase Postgres / Auth / RLS | 已接入 | 内容与登录保留在 Supabase；本轮新增 Workbench 表，RLS 写入要求服务端管理员标记 |
| Projects | 已完成 | 列表、动态详情、后台；thesis / xicaoshi / portfolio 模板 |
| Photography / Drawings | 已完成 | 46 张照片、22 幅作品；分类与媒体 CRUD |
| Field Notes | 已完成 | 5 旅程、62 张图 + 4 外链视频；gallery / narrative 双模板 |
| Hero / Site Navigation | 已完成 | `site_settings`、`site_navigation_items`、`/admin/site`；上传自动压缩 |
| About | 已完成 | Timeline、16:9 照片裁切；照片仅出现在详情页 |
| Notes | 已完成 | 双语 Markdown、Tiptap、TOC、统一附件上传 |
| Traces / Guestbook | 已完成 | 三 Tab、专项旧路径、留言审核与可选 Turnstile |
| Analytics / Admin | 已完成 | `page_views`、Analytics 面板、`AdminShell` 侧栏布局 |
| Workbench | 生产表与管理员授权完成，本地保存验收通过 | 2 条流程；公开读取通过，RLS 写入需服务端 CMS admin 标记 |
| R2 存量迁移 | 已完成并验收 | 160 文件 / 106,278,846 字节（101.36 MiB），159 行引用；生产 provider 为 `r2` |
| 本地代理 DNS 裂图修复 | 已完成并验收 | 仅 development 的直读开关，首页 8 张图片成功加载 |
| 大文件签名直传 | 代码与 R2 协议验证完成，代码待上线 | 所有上传入口；5.15 MiB 实测，CORS 204 / PUT 200 / 禁止覆盖 412 |
| 静态媒体 | 182 文件已迁移并完整校验，解析代码待上线 | 574.01 MiB；公开 SHA-256 与源一致，原 public 文件保留 |

首页顺序：Hero → Projects → Traces → Notes → Workbench → About + Guestbook。R2 与裂图修复提交：[`0064c9f`](https://github.com/24205345/qianna-website/commit/0064c9f21b44dbb702040ce788320b698fe82c7e)，已推送 `main`。

## 2. 内容模块回归

以下供后续变更验收使用，不表示本次重新执行了全部写操作。初始化脚本不要当作生产测试步骤重跑。

| 模块 | 前台检查 | 后台检查 |
|---|---|---|
| Projects | 分类、状态、详情图廊、portfolio 翻页、MP4 与外链视频 | 文案/状态保存，封面/图廊上传返回 R2 URL |
| Photography / Drawings | 系列、分类、图注、lightbox | 分类和媒体编辑、上传、删除记录 |
| Field Notes | 5 slug、双模板、gliding / snowboard 外链视频 | 封面、section_key / layout / caption 保存 |
| Hero / Site | 图片与文案、板块和相关页眉同步 | 直传后压缩生成 `uploads/site-hero/<user-id>/<uuid>.webp`，保存后刷新首页 |
| About | 详情照片与 Timeline，首页文字摘要 | 16:9 裁切、文案保存 |
| Notes | 双语、表格/代码/图片/附件、TOC、Hidden 不展示 | Tiptap 图片粘贴、双语编辑、附件上传与发布 |
| Guestbook | approved 列表、首页 3 条预览、Turnstile（启用时） | 审核、隐藏、删除 |
| Analytics | 页面浏览事件与路径 | 区间筛选、聚合 |
| Workbench | 生产表与 anon 读取已验证；异常时保留静态回退 | 2026-10-12 真实 Next 保存与生产 RLS 读回通过；不重跑初始化覆盖内容 |

文件索引见 [开发指南 §6](developer-guide.md#6-关键文件索引)，数据流程见 [架构](architecture.md)。

## 3. R2 迁移实际结果

- [x] R2 Standard / APAC `portfolio-media` 创建完成；自定义域名与 TLS active。
- [x] 本桶 Object Read & Write 凭据配置在本地与 Vercel Production，密钥未进入 Git。
- [x] 160 文件复制至 `legacy/portfolio-media/<原对象键>`，源 / S3 GET / 公开 URL 的 SHA-256 一致。
- [x] 159 行并发保护更新，清单状态全为 `applied`；逐行匹配 after 值，扫描字段无原桶 URL 残留。
- [x] 外链、静态路径及未命中原桶 URL 的 Notes 正文保留。
- [x] 先部署双域名版本，再 apply DB，最后切换生产 provider 并重新部署。
- [x] 真实 Notes 后台认证上传返回 R2 URL，内容校验通过；测试文章未提交，测试对象已清理。
- [x] 生产 Next.js 图片请求 200、MP4 Range 206、缓存头验证通过。
- [x] 20 项媒体测试、lint、类型检查、构建通过；迁移提交前再次运行媒体测试。
- [x] Supabase 原对象与正式本地回滚清单保留；2026-10-10 只读复核源仍为 160 对象 / 106,278,846 字节。

数据库改写分布：Projects 2、project_media 20、photography_photos 46、visual_works 22、field_notes 5、field_note_media 62、site_settings 1、about_page_content 1，共 159 行。对象数与行数不是同一口径，也不等于全部业务记录数。实测 101.36 MiB 替代早期 50–80 MB 估算。

证据与部署快照见 [执行记录](exec-mcp-storage-2026-10-10.md)；复制、校验、并发保护与回滚命令见 [R2 步骤](exec-cloudflare-r2-2026-10-09.md)。

## 4. 后续部署与回滚检查

- [ ] 新部署确认 Production 的完整 R2 配置与双域名白名单，Preview 环境单独配置。
- [ ] 观察实际媒体请求与图片加载；页面 HTTP 200 不等于图片正常。
- [ ] 受控备份 `.media-migration/r2-plan.json`，该清单不在 Git 或部署包内。
- [ ] 回滚先暂停编辑并按清单恢复 DB，再切换 provider、部署；迁移后的新上传另行核对。
- [ ] 生产回滚演练尚未执行；已有自动化测试不能写成已做生产演练。

配置、裂图诊断与回滚见 [媒体运维](experience-media-storage.md)。删除业务记录不会自动删除对象；源文件、R2 文件与静态资产清理需独立盘点。

本轮分项证据与授权 / 上线状态见 [剩余迁移执行记录](exec-cms-storage-completion-2026-10-10.md)。

## 5. 待办与执行约定

1. 直传代码和 CORS 已实现并做真实 R2 验证；管理员授权与真实认证保存已验证，新代码待部署后浏览器验收。
2. `0019_workbench_pipelines.sql` 已部署，RLS 写入收紧为 `app_metadata.cms_role=admin`；现有唯一 CMS 账号已授权，Workbench 保存与读回验证通过。
3. 独立处理依赖安全更新与完整回归；资产元数据和引用管理按实际需求推进。
4. 继续 Notes 内容、GSC 与 Analytics 观察。

先读 `AGENTS.md`、架构与开发指南。React/TS 改动运行 lint，媒体逻辑改动运行媒体测试，按范围补充类型检查、构建和浏览器验收。仅明确要求时 commit / push；本地凭据、MCP OAuth 和回滚清单不提交。

## 2026-10-12：首页展示图编辑补充

- [x] Projects / Traces 逐图更换、即时预览、恢复/取消及切换标签保留文件。
- [x] 首页独立覆盖表迁移、管理员 RLS 和稳定身份映射；回执沿用 R2。
- [x] 新增保存/恢复/目标校验/权限/零排序测试，6 项通过。
- [x] 执行 20261012031537_home_featured_images.sql 与 20261012033201_home_featured_images_rls_initplan.sql；真实事务验证普通/匿名拒绝、管理员写入和公开读取。
- [x] 浏览器实测项目、摄影、手绘上传保存、刷新回读、跨标签草稿和恢复；测试数据已清理。
- [x] 修复保存时导航 sort_order=0 被改写的问题，新增回归覆盖。
- [ ] 部署代码并验收正式域名上传与生产图片优化端点。

实际状态见 [首页展示图修复记录](exec-site-featured-images-2026-10-12.md)。
