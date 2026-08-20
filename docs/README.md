# 开发文档索引

> 自用文档，不面向站点访客。对外说明见根目录 [`README.md`](../README.md)。

**Agent 入口：** [`AGENTS.md`](../AGENTS.md) → [`codex-handoff.md`](codex-handoff.md)

---

## 第一层：每次开发必读

| 文档 | 用途 |
|------|------|
| [`../AGENTS.md`](../AGENTS.md) | Cursor / Agent 常驻规则与约束 |
| [`codex-handoff.md`](codex-handoff.md) | 项目全貌、进度、架构、本地环境、文件索引 |
| [`cms-migration-checklist.md`](cms-migration-checklist.md) | 各 CMS 模块完成度与验证步骤 |

---

## 第二层：按任务查阅

### 站点结构与功能

| 文档 | 何时读 |
|------|--------|
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

### 基础设施与早期改造

| 文档 | 何时读 |
|------|--------|
| [`supabase-cms-改造记录.md`](supabase-cms-改造记录.md) | Phase 0–3、Auth 配置、历史经验条目 |
| [`exec-notes-i18n-2026-07-24.md`](exec-notes-i18n-2026-07-24.md) | Notes i18n 执行记录 |

### 历史快照（勿当现状）

| 文档 | 说明 |
|------|------|
| [`progress-check-2026-07-19.md`](progress-check-2026-07-19.md) | 2026-07-19 拉代码时的快照；现状以 codex-handoff 为准 |

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
| 新模块 / 大改架构 | 更新 `codex-handoff.md` §2 + `cms-migration-checklist.md` |
| 一次性功能交付 | 新增 `exec-<主题>-<日期>.md` |
| 会反复碰到的坑或模式 | 新增或追加 `experience-<主题>.md` |
| Agent 行为 / 项目级约束 | 更新 `AGENTS.md` |
| 对外站点说明 | 仅更新根目录 `README.md`（访客向，保持简短） |

**不要**再维护已删除的 `DIRECTORY.md`；路由以 `codex-handoff.md` §2 速查表为准。

---

## 本地开发速查

```powershell
$env:Path = "G:\node-v24.16.0-win-x64;" + $env:Path
cd G:\project\qianna-website
.\scripts\start-dev.ps1   # 或 npm run dev
```

验证：`npm run lint` · `npm run build`

细节见 [`codex-handoff.md`](codex-handoff.md) §3–§4。
