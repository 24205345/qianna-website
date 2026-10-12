# 开发文档索引

> 自用文档，不面向站点访客。对外说明见根目录 [`README.md`](../README.md)。

**Agent 入口：** [`AGENTS.md`](../AGENTS.md) → [`developer-guide.md`](developer-guide.md) · [`architecture.md`](architecture.md)

最后核对：2026-10-12。生产为 Vercel + Supabase Postgres/Auth + Cloudflare R2；原桶迁移已完成；Workbench 表与管理员授权已完成，本地新版上传及保存验收通过，代码待上线。静态媒体与直传改造状态见新增执行记录。核心文档描述现状，日期执行记录保留当时结果与明确的后续说明。

---

## 第一层：每次开发必读

| 文档 | 用途 |
|------|------|
| [`../AGENTS.md`](../AGENTS.md) | Cursor / Agent 常驻规则与约束 |
| [`developer-guide.md`](developer-guide.md) | 项目进度、本地环境、路由速查、文件索引 |
| [`architecture.md`](architecture.md) | 系统架构、分层、数据流、横切能力 |
| [`exec-cms-storage-completion-2026-10-10.md`](exec-cms-storage-completion-2026-10-10.md) | 静态资产、签名直传、Workbench 与分项验收 / 上线状态 |
| [`cms-migration-checklist.md`](cms-migration-checklist.md) | 各 CMS 模块完成度与验证步骤 |
| [`experience-media-storage.md`](experience-media-storage.md) | 当前媒体配置、裂图排查、部署验收与回滚 |

---

## 第二层：按任务查阅

### 站点结构与功能

首页展示图编辑、已执行迁移与真实浏览器验收（代码待发布）：[exec-site-featured-images-2026-10-12.md](exec-site-featured-images-2026-10-12.md)。

| 文档 | 何时读 |
|------|--------|
| [`exec-homepage-editorial-admin-overhaul-2026-09-16.md`](exec-homepage-editorial-admin-overhaul-2026-09-16.md) | 首页策展改版、Notes 富文本升级、Site Settings 实景视口、后台极速渲染优化 |
| [`exec-site-ia-guestbook-2026-08-04.md`](exec-site-ia-guestbook-2026-08-04.md) | 首页四板块、Traces Hub、Guestbook |
| [`exec-homepage-motion-2026-08-17.md`](exec-homepage-motion-2026-08-17.md) | 首页 Hero 动效、涟漪关闭、Reveal 组件 |
| [`exec-admin-about-analytics-2026-08-11.md`](exec-admin-about-analytics-2026-08-11.md) | Admin 侧栏、About 照片、Analytics |
| [`exec-vercel-domain-2026-08-11.md`](exec-vercel-domain-2026-08-11.md) | 自定义域名、Supabase Auth Redirect |
| [`exec-search-console-2026-08-20.md`](exec-search-console-2026-08-20.md) | Search Console 验证、站点地图、Vercel 环境变量 |

### 可复用模式（experience）

| 文档 | 场景 |
|------|------|
| [`experience-admin-sidebar-profile-crop.md`](experience-admin-sidebar-profile-crop.md) | Admin 侧栏、单图 16:9 裁切上传 |
| [`experience-guestbook.md`](experience-guestbook.md) | 留言审核、过滤、RLS、Turnstile |
| [`experience-homepage-motion.md`](experience-homepage-motion.md) | 首页 Hero / Reveal 滚入、grid 卡片动效 |
| [`experience-seo-metadata.md`](experience-seo-metadata.md) | 搜索 title/description、canonical 域名 |
| [`experience-notes-cms.md`](experience-notes-cms.md) | 独立 Notes 模块 |
| [`experience-notes-editor.md`](experience-notes-editor.md) | Notes 编辑器 |
| [`experience-notes-markdown-ui.md`](experience-notes-markdown-ui.md) | Notes Markdown / TOC 前台 |
| [`experience-notes-i18n.md`](experience-notes-i18n.md) | Notes 多语言 |
| [`experience-undergraduate-portfolio.md`](experience-undergraduate-portfolio.md) | 静态作品集导出、翻页与部署 |

### 基础设施与早期改造

| 文档 | 何时读 |
|------|--------|
| [`exec-cloudflare-r2-2026-10-09.md`](exec-cloudflare-r2-2026-10-09.md) | R2 媒体存储适配、线上清点、迁移步骤、回滚和后续直传 |
| [`exec-mcp-storage-2026-10-10.md`](exec-mcp-storage-2026-10-10.md) | MCP、R2 迁移结果、部署验收、本地裂图修复与 Git 交付 |
| [`exec-docs-sync-2026-10-10.md`](exec-docs-sync-2026-10-10.md) | 文档核对依据、修正范围及未完成事项 |
| [`exec-image-performance-2026-10-10.md`](exec-image-performance-2026-10-10.md) | 图片慢加载实测、缓存与取数评估、优化优先级及验收方法 |
| [`exec-image-performance-p1-2026-10-10.md`](exec-image-performance-p1-2026-10-10.md) | 前三项性能优化实现、批量查询对比、本地验证与上线边界 |
| [`exec-notes-i18n-2026-07-24.md`](exec-notes-i18n-2026-07-24.md) | Notes i18n 执行记录 |

### 历史快照（勿当现状）

| 文档 | 说明 |
|------|------|
| [`progress-check-2026-07-19.md`](progress-check-2026-07-19.md) | 2026-07-19 拉代码时的快照；现状以 developer-guide 为准 |
| [`supabase-cms-改造记录.md`](supabase-cms-改造记录.md) | 早期 Phase 0–3；待办、存储与验证状态只适用于当时 |

其他日期 `exec-*` 同样是当次交付快照。沿用旧操作前先查看当前架构与媒体运维；历史“未提交”“需建项目”等不是当前待办。

### Notes 正文（发布到 `/notes` 的草稿，非工程文档）

| 文档 | 说明 |
|------|------|
| [`notes/ai-video-downloader-summarizer.zh.md`](notes/ai-video-downloader-summarizer.zh.md) | AI 视频笔记 |
| [`notes/aliyun-ecs-docker-deploy.md`](notes/aliyun-ecs-docker-deploy.md) | ECS 部署指南 · Workbench 路径（中文） |
| [`notes/aliyun-ecs-docker-deploy.en.md`](notes/aliyun-ecs-docker-deploy.en.md) | 同上（英文） |
| [`notes/aliyun-ecs-baota-docker-deploy.md`](notes/aliyun-ecs-baota-docker-deploy.md) | ECS 部署指南 · 宝塔路径（中文） |
| [`notes/aliyun-ecs-baota-docker-deploy.en.md`](notes/aliyun-ecs-baota-docker-deploy.en.md) | 同上（英文） |

---

## 维护约定（方案 B，不用 Trellis）

| 改了什么 | 写哪里 |
|----------|--------|
| 新模块 / 大改架构 | 更新 `architecture.md` + `developer-guide.md` §2 + `cms-migration-checklist.md` |
| 一次性功能交付 | 新增 `exec-<主题>-<日期>.md` |
| 会反复碰到的坑或模式 | 新增或追加 `experience-<主题>.md` |
| Agent 行为 / 项目级约束 | 更新 `AGENTS.md` |
| 对外站点说明 / 开发入口 | 更新根目录 `README.md`，保持简短并链接工程文档 |
| 存储 / 部署配置 | 同步架构、开发指南、Checklist 和媒体运维；证据另记 `exec-*` |
| 历史记录过时 | 保留当时事实，添加日期边界与当前文档链接 |

**不要**再维护已删除的 `DIRECTORY.md`；路由以 `developer-guide.md` §2 速查表为准。

---

## 本地开发速查

```powershell
$env:Path = "G:\project\.runtimes\node-v24.16.0-win-x64;" + $env:Path
cd G:\project\qianna-website
npm ci
# 按 developer-guide 配置 .env.local
npm run dev
```

应用验证按范围运行：`npm run lint` · `npx tsc --noEmit` · `npm run test:media` · `npm run build`。仅改文档核对链接与 `git diff --check`；commit / push 仅在用户明确要求时执行。

细节见 [`developer-guide.md`](developer-guide.md) §3–§4。

授权完成与实际保存验证：[2026-10-12 CMS 管理员验收](exec-cms-admin-verification-2026-10-12.md)。
