# Codex 交接文档（qianna-website Supabase CMS）

> **给 Codex 的第一份必读文档。** 读完本文即可继续开发，无需翻完整对话历史。
>
> 项目路径：`G:\project\qianna-website`  
> 分支：`main`（P1–P5 代码已完成，Home Hero 已接入轻量 CMS）  
> 最后更新：2026-07-03

---

## 1. 项目是什么

Next.js 16.2.1 + React 19 + TypeScript + Tailwind v4 个人作品集网站，正在从**硬编码 + public 静态资源**升级为 **Supabase 轻量 CMS**（网页端 `/admin/*` 管理内容）。

- GitHub：`24205345/qianna-website`
- Supabase Project ID：`aqsdwfocoocnzyxopvvg`
- Storage Bucket：`portfolio-media`（公开读）

---

## 2. CMS 进度（截至 2026-07-03）

| 模块 | 状态 | 前台 | 后台 | 迁移脚本 |
|---|---|---|---|---|
| Projects 列表+媒体+详情 | ✅ | `/projects`, `/projects/[slug]` | `/admin/projects` | `npm run migrate:media` |
| Photography | ✅ | `/photography` | `/admin/photography` | `npm run migrate:photography` |
| Visual Works | ✅ | `/visual-works` | `/admin/visual-works` | `npm run migrate:visual-works` |
| Field Notes | ✅ | `/field-notes`, `/field-notes/[slug]` | `/admin/field-notes` | `npm run migrate:field-notes` |
| **Home Hero** | ✅ | `/` | `/admin/site` | `npm run migrate:home` |
| **Site Navigation Copy** | ✅ | `/`, linked page headings | `/admin/site` | SQL migration |
| **About** | ⬜ 正文占位 | `/about` | `/admin/site` 管理页眉 | — |

Supabase 数据量（已验证）：
- `photography_photos`: 46
- `visual_works`: 22
- `field_notes`: 5；`field_note_media`: 62 图 + 4 视频

详细 checklist：`docs/cms-migration-checklist.md`

---

## 2.1 2026-07-03 前台 UX / 导航调整

### 首页 Projects Preview

- `app/page.tsx` 的三个 Projects Preview 卡片已改成整卡可点击，分别进入 `/projects?category=thesis-design-research`、`/projects?category=architecture-projects`、`/projects?category=digital-product-work`。
- `View all projects` 保持进入 `/projects`，用于查看所有分类项目。
- 分类元数据集中在 `lib/projects/categories.ts`，其中 `matchLabels` 用于兼容 Supabase / 静态数据里的分类文本差异，例如 `Architecture Project` 与 `Architecture Projects`。

### Projects 汇总页

- `/projects?category=...`：显示某个分类下的项目，标题区保留分类名称和说明。
- `/projects`：不再按分类标题块分组，直接按 `year` 从近到远扁平排列；分类信息保留在每张项目卡片顶部的小标签里。
- 排序函数会从 `year` 字符串里提取四位年份，兼容 `2025`、`2020-2021` 一类文本。

### 首页 Hero Enter

- Hero CTA 从白色胶囊按钮改成轻量文字链接 `Enter →`。
- 箭头使用文本字符，和内页 `← Back to Home` 的视觉语言一致，只是方向相反。
- `Enter` 为 `text-[15px]`，带较浅下划线；hover 时文字变斜体。
- 副标题和 `Enter` 都加了相同小缩进，且与标题之间的垂直间距保持一致。

### P5 Home Hero CMS

- 新增 `site_settings` 单行表（`singleton_key = 'home'`），用于管理首页 Hero title / subtitle / CTA / image URL / alt。
- 首页 `app/page.tsx` 通过 `lib/site/queries.ts` 读取 Supabase；未配置或查询失败时回退 `app/_data/site-settings.ts`。
- 新增 `/admin/site`，可编辑首页 Hero 文案、图片 URL，并可上传新图片到 `portfolio-media/site/`。
- 新增 `npm run migrate:home`，用于把本地 `public/images/hero-image.jpg` 压缩为 WebP 后上传到 Storage，并写入 `site_settings.hero_image_url`。

### P5.5 Site Navigation Copy CMS

- 新增 `site_navigation_items` 表，对应迁移文件 `supabase/migrations/0006_site_navigation_items.sql`。
- `0006_site_navigation_items.sql` 已在 Supabase 项目中执行并验证：`site_navigation_items` RLS 已开启，默认 8 条首页/子页面文案已插入。
- `app/_data/site-navigation.ts` 提供静态回退；未配置 Supabase 或表未创建时，首页和子页面仍使用原始默认文案。
- `/admin/site` 的 Homepage Cards & Page Headings 区域可编辑首页入口卡片和对应子页面页眉。
- 首页 project 分类卡片和 `/projects?category=...` 页眉共用同一行数据；Photography / Visual Works / Field Notes / About 入口卡片和对应页面页眉也共用同一行数据。
- `href` 不开放编辑，避免误改导致导航断链；只开放 `label`、`title`、`description`。

### Admin UI Language

- `/admin/*` 后台可见 UI 文案已统一为英文，包括页面标题、顶部导航、表格表头、表单字段、按钮、空状态和 Server Action 错误消息。
- 后续新增后台页面时保持英文 UI，避免同一管理界面混用中文/英文；内部文档仍可继续中文记录。
- `/admin/projects` 的 `Category` 使用固定三类下拉，来源于 `lib/projects/categories.ts`；不要改回自由输入，否则前台 `/projects?category=...` 筛选容易因拼写不一致失效。
- `/admin/projects` 的项目 URL 由标题自动生成：新增项目时 `slug` 可留空，Server Action 会生成小写短横线 URL，并在重复时自动追加 `-2`、`-3`。编辑旧项目时默认保留已有 URL，避免破坏已经公开的链接。

### UI/UX Skill

- 用户已全局安装 `ui-ux-pro-max` 到 `C:\Users\U0016735\.cursor\skills\ui-ux-pro-max\SKILL.md`。
- 重启 Cursor 后可作为 UI 检查辅助；它更适合大范围设计系统/落地页评审。当前网站的细节调整仍应以用户截图、现有作品集气质和轻量克制风格为准。

---

## 3. 本地开发（Windows 必读）

### 3.1 Node 路径

公司电脑 Node 不在默认 PATH，每次开新终端需：

```powershell
$env:Path = "G:\node-v24.16.0-win-x64;" + $env:Path
cd G:\project\qianna-website
```

### 3.2 启动网站（一键）

**推荐：双击项目根目录 `start.bat`**，或在 PowerShell：

```powershell
.\scripts\start-dev.ps1
# 或
npm run start:site
```

脚本会：新开窗口跑 `npm run dev` → 等待就绪 → 自动打开 **http://localhost:3000**。  
若服务器已在运行，则只打开浏览器。

手动启动：

```powershell
npm run dev
```

### 3.3 环境变量

复制 `.env.local.example` → `.env.local`（已在 gitignore，勿提交）：

```
NEXT_PUBLIC_SUPABASE_URL=https://aqsdwfocoocnzyxopvvg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_ADMIN_EMAIL=<管理员邮箱>
SUPABASE_ADMIN_PASSWORD=<管理员密码>
```

迁移脚本用 `SUPABASE_ADMIN_*` 登录，**不要用 service_role**。

### 3.4 验证命令

```powershell
npm run lint
npm run build
```

PowerShell **不要用 `&&`** 串联命令，用 `;` 或分行。

---

## 4. sparse-checkout 与 public/ 大图（高频坑）

仓库使用 **sparse-checkout**，`public/` 里的大图**默认不在本地**。

### 现象

- 首页封面空白 → 缺 `public/images/hero-image.jpg`
- migrate 脚本报 `缺少文件: public/...`
- 页面能打开但图片 404

### 解决：先 download 再 migrate

| 模块 | 下载脚本 | 迁移命令 |
|---|---|---|
| Home Hero (~16MB) | `scripts/download-home-hero.ps1` | `npm run migrate:home` |
| Projects | `scripts/download-project-media.ps1` | `npm run migrate:media` |
| Photography (46) | `scripts/download-photography-media.ps1` | `npm run migrate:photography` |
| Visual Works (22) | `scripts/download-visual-works-media.ps1` | `npm run migrate:visual-works` |
| Field Notes (63) | `scripts/download-field-notes-media.ps1` | `npm run migrate:field-notes` |

```powershell
cd G:\project\qianna-website
.\scripts\download-home-hero.ps1          # 首页封面
.\scripts\download-photography-media.ps1  # 示例：其他模块同理
npm run migrate:home
npm run migrate:photography
```

GitHub raw 下载偶发 EOF（尤其 gliding 大图），**失败文件单独重试**后再跑 migrate。

---

## 5. 架构模式（复制此模式做 P5 / 新模块）

每个 CMS 模块统一四层：

```
supabase/migrations/000X_*.sql     → 建表 + RLS + GRANT（MCP apply_migration 或 SQL Editor）
app/_data/*.ts                     → 静态回退数据（build 无 Supabase 也能过）
lib/<module>/queries.ts            → isSupabaseConfigured() + 查库 + fallback
app/<module>/page.tsx              → Server Component 调 queries
app/admin/<module>/**              → CRUD + MediaManager + Server Actions
scripts/migrate-<module>.mjs       → sharp 压缩 → Storage → 写 DB
scripts/download-*-media.ps1       → 从 GitHub raw 拉 public 文件
```

### 前台回退约定

`isSupabaseConfigured()` 为 false，或查询失败/空结果 → 使用 `app/_data` 静态数据，**页面视觉不变**。

### 后台约定

- `middleware.ts` 保护 `/admin/*`
- 封面/图片上传 → `portfolio-media` bucket → `getPublicUrl`
- Server Actions 末尾 `revalidatePath`
- **`"use server"` 文件不能 re-export 其他 server action**（会 build 失败）

---

## 6. 关键文件索引

### 数据库迁移（按顺序）

```
supabase/migrations/0001_init.sql          projects + project_media
supabase/migrations/0002_photography.sql
supabase/migrations/0003_visual_works.sql
supabase/migrations/0004_field_notes.sql
supabase/migrations/0005_site_settings.sql
```

### 动态路由详情页

```
app/projects/[slug]/page.tsx               layout: thesis | xicaoshi
app/field-notes/[slug]/page.tsx            layout: gallery | narrative
```

Field Notes 视图组件：
- `app/field-notes/_components/GalleryFieldNoteView.tsx`
- `app/field-notes/_components/NarrativeFieldNoteView.tsx`

### 静态回退数据

```
app/_data/projects.ts
app/_data/project-details.ts
app/_data/project-galleries.ts
app/_data/photography.ts          (+ photographySections)
app/_data/visual-works.ts         (+ visualWorkSections)
app/_data/field-notes.ts
app/_data/field-note-details.ts   （含 5 条旅程完整元数据，迁移脚本 import）
```

### 查询层

```
lib/projects/queries.ts
lib/photography/queries.ts
lib/visual-works/queries.ts
lib/field-notes/queries.ts
lib/site/queries.ts
```

### Admin 入口

```
/admin/login
/admin/projects
/admin/photography
/admin/visual-works
/admin/field-notes
/admin/site
```

---

## 7. Field Notes 特殊说明

5 个 slug：`nanjiluo` | `yubeng` | `whitecliffs` | `gliding` | `snowboard`

| slug | layout_template | 特点 |
|---|---|---|
| nanjiluo, yubeng, whitecliffs | `gallery` | Hero + Trip Details + PhotoGallery |
| gliding | `gallery` | 同上 + 2 个 Google Drive 视频 |
| snowboard | `narrative` | Hero + Scroll 提示 + 图文叙事区块 + 2 视频 |

视频 URL 格式：`https://drive.google.com/file/d/{ID}/preview`  
**大视频不上传 Supabase**，只存外链。

`field_note_media` 叙事区块字段：`section_key`, `layout`, `aspect_ratio`, `caption`  
snowboard 的 `spring_chute` 区块：`caption` 存 footer 文案（见 `queries.ts` 解析逻辑）。

---

## 8. 首页 Hero（当前未 CMS 化）

```tsx
// app/page.tsx
src="/images/hero-image.jpg"   → public/images/hero-image.jpg (~16MB)
```

本地必须有该文件，否则首页只有文字没有封面。  
P5 可选：建 `site_settings` 表 + 压缩上传 Supabase + `/admin/site`。

---

## 9. 已知问题与经验

| 问题 | 原因 | 解决 |
|---|---|---|
| localhost 打不开 | dev server 未运行 | `npm run dev`，保持终端开着 |
| 首页封面空白 | 缺 hero-image.jpg | `.\scripts\download-home-hero.ps1` + 强刷 Ctrl+Shift+R |
| permission denied for table | 缺 GRANT | migration 里补 GRANT（见 0001 注释） |
| migrate 登录失败 | 密码错 / 末尾漏字符 | 检查 `.env.local` SUPABASE_ADMIN_PASSWORD |
| build 失败 use server re-export | photography actions 曾 re-export signOutAction | 从 `@/app/admin/projects/actions` 直接 import |
| Next 16 params | 动态路由 params 是 Promise | `const { slug } = await params` |
| 公司网络 git clone 失败 | 大 binary | sparse-checkout + raw 下载脚本 |

---

## 10. Codex 推荐下一步

### 优先级 A：收尾与提交

1. `git status` 确认 P1–P4 全部改动
2. `npm run lint` + `npm run build`
3. 本地目视：首页、`/projects/thesis`、`/photography`、`/field-notes/snowboard`
4. **分模块 commit**（用户明确要求再 commit）：
   - `feat(projects): dynamic slug detail pages and CMS fields`
   - `feat(photography): Supabase CMS module`
   - `feat(visual-works): Supabase CMS module`
   - `feat(field-notes): Supabase CMS with gallery/narrative templates`

### 优先级 B：P5 Home / About（可选）

1. `site_settings` 单表（hero_image_url, hero_title, hero_subtitle, about 字段）
2. 压缩上传 hero → Storage
3. `app/page.tsx` 读 Supabase + fallback
4. `/admin/site` 简单表单

### 优先级 C：部署

1. Vercel 环境变量：`NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. `next.config.ts` 已配置 Supabase Storage `remotePatterns`
3. push 分支 → Vercel 部署

### 优先级 D：安全

- 迁移完成后在 Supabase 重置管理员密码（曾在对话中暴露）
- 确认 Sign Up 已关闭，仅手动创建管理员

---

## 11. 相关文档

| 文档 | 用途 |
|---|---|
| `docs/codex-handoff.md` | **本文 — Codex 入口** |
| `docs/cms-migration-checklist.md` | P1–P5 分阶段 checklist |
| `docs/supabase-cms-改造记录.md` | 早期 Phase 0–3 改造记录 + 经验 |
| `DIRECTORY.md` | 页面路由与 public 目录结构 |
| `AGENTS.md` | Next.js 16 特殊约定（读 node_modules/next/dist/docs/） |

---

## 12. 给 Codex 的开场 Prompt 模板

复制以下内容作为新会话第一条消息：

```
请阅读 G:\project\qianna-website\docs\codex-handoff.md，然后继续 qianna-website Supabase CMS 工作。

当前状态：P1–P4 已完成（Projects / Photography / Visual Works / Field Notes），本地 dev 在 feature/supabase-cms 分支。

请先：
1. 读 docs/codex-handoff.md 和 docs/cms-migration-checklist.md
2. 跑 npm run lint 和 npm run build 确认通过
3. 告诉我 git status 里有哪些未提交改动

然后执行：[在此填写你的目标，例如 P5 Home CMS / commit / 部署 Vercel]
```

---

## 13. package.json scripts 一览

```json
"dev": "next dev",
"start:site": "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/start-dev.ps1",
"build": "next build",
"lint": "eslint",
"migrate:media": "node scripts/migrate-project-media.mjs",
"migrate:photography": "node --experimental-strip-types scripts/migrate-photography.mjs",
"migrate:visual-works": "node --experimental-strip-types scripts/migrate-visual-works.mjs",
"migrate:field-notes": "node --experimental-strip-types scripts/migrate-field-notes.mjs"
```

`--experimental-strip-types` 用于 migrate 脚本直接 import `app/_data/*.ts`。
