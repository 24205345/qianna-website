# 开发者指南（qianna-website）

> **Agent / 开发者第一份必读。** 常驻规则见根目录 [`AGENTS.md`](../AGENTS.md)；**系统架构**见 [`architecture.md`](architecture.md)；文档索引见 [`docs/README.md`](README.md)。
>
> 项目路径：`G:\project\qianna-website`  
> 分支：`main`（CMS P1–P11 已完成）  
> 最后更新：2026-08-20  
> 生产域名：**https://www.qiannawang.com**

---

## 1. 项目是什么

Next.js 16.2.1 + React 19 + TypeScript + Tailwind v4 **个人作品集网站**（对外分享作品与背景；内容通过私有 `/admin` 管理）。

- GitHub：`24205345/qianna-website`
- Supabase Project ID：`aqsdwfocoocnzyxopvvg`
- Storage Bucket：`portfolio-media`（公开读）

---

## 2. CMS 进度（截至 2026-08-20）

| 模块 | 状态 | 前台 | 后台 | 迁移 / 备注 |
|---|---|---|---|---|
| Projects 列表+媒体+详情 | ✅ | `/projects`, `/projects/[slug]` | `/admin/projects` | `npm run migrate:media`；0017 portfolio flipbook |
| Photography | ✅ | `/photography` | `/admin/photography` | `npm run migrate:photography` |
| Visual Works | ✅ | `/visual-works` | `/admin/visual-works` | `npm run migrate:visual-works` |
| Field Notes | ✅ | `/field-notes`, `/field-notes/[slug]` | `/admin/field-notes` | `npm run migrate:field-notes` |
| **Traces Hub** | ✅ | `/traces`（Tab）+ 旧路径 | 侧栏 Traces 子项 | `0012_traces_navigation.sql` |
| **Home Hero** | ✅ | `/` | `/admin/site` | `migrate:home` / `recompress:home`；`next/image` |
| **Site Navigation Copy** | ✅ | `/`, linked page headings | `/admin/site` | `0006_site_navigation_items.sql` |
| **About** | ✅ | `/about`（16:9 个人照片 + Timeline） | `/admin/about` | `0007` + `0016_about_profile_image.sql` |
| **Notes** | ✅ | `/notes`, `/notes/[slug]` | `/admin/notes` | `0010_notes.sql` |
| **Guestbook** | ✅ | 首页 About Me 下预览 3 条 | `/admin/guestbook` | Turnstile；`0013` / `0014` |
| **Analytics** | ✅ | 全站 `PageViewTracker` | `/admin/analytics` | `0015_page_views.sql` |
| **首页动效** | ✅ | Hero Ken Burns + Reveal 滚入 | — | 涟漪默认关闭；见 `experience-homepage-motion.md` |
| **SEO** | ✅ | canonical / JSON-LD / sitemap | — | GSC 已验证；见 `experience-seo-metadata.md` |

Admin 导航：**左侧边栏** + Projects / Traces 二级嵌套，详见 `docs/exec-admin-about-analytics-2026-08-11.md`。

Supabase 数据量（已验证）：
- `photography_photos`: 46
- `visual_works`: 22
- `field_notes`: 5；`field_note_media`: 62 图 + 4 视频

详细 checklist：`docs/cms-migration-checklist.md`

### 前台路由速查

| 路径 | 说明 |
|------|------|
| `/` | 首页（Notes → Projects → Traces → About Me + Guestbook 预览） |
| `/notes`, `/notes/[slug]` | 笔记列表与详情 |
| `/projects`, `/projects/[slug]` | 项目汇总与详情 |
| `/traces` | Traces Hub（Photography / Drawings / Field Notes Tab） |
| `/photography`, `/visual-works`, `/field-notes/[slug]` | 旧路径保留 |
| `/about` | About 页（标题、描述、16:9 照片、Timeline） |
| `/guestbook` | 留言簿完整列表 |
| `/admin/*` | 私有 CMS（login / reset-password 无侧栏） |

---

## 2.1 前台 UX 要点（摘要）

完整 IA 见 `docs/exec-site-ia-guestbook-2026-08-04.md`。关键约定：

- 首页顺序：**Notes → Projects → Traces → About Me**（Guestbook 预览 3 条）
- Projects 分类：`lib/projects/categories.ts`（`matchLabels` 兼容历史文案）
- 首页 project 卡片 → `/projects?category=...`；View all → `/projects`（按 year 扁平排序）
- Hero CTA：轻量 `Enter →` 文字链，非胶囊按钮
- About 照片 **只在 `/about`**，首页 About 卡片仅文字摘要
- Admin：**左侧边栏**；Projects 子菜单无 All；About 照片 16:9 裁切（`react-easy-crop`）
- 站点气质：安静、编辑感、stone 暖灰；大改 UI 前可参考 `ui-ux-pro-max` skill，但以截图与现有风格为准

历史逐条变更见各 `docs/exec-*.md`，此处不再堆叠。

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

脚本会：检测 `package-lock.json` 变更时自动 `npm install` → 新开窗口跑 `npm run dev` → 等待就绪 → 自动打开 **http://localhost:3000**。  
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

## 5. 架构说明

CMS 四层模式、数据流、Auth / SEO / Analytics / 媒体管线等**稳定架构**已独立成文：

→ **[`docs/architecture.md`](architecture.md)**

新模块开发前先读 §6「CMS 模块模式」；改完架构级能力时同步更新该文件。

---

## 6. 关键文件索引

### 数据库迁移（0001–0018 摘要）

```
0001 init (projects)     0009 projects preview copy
0002 photography         0010 notes
0003 visual_works        0011 notes i18n
0004 field_notes         0012 traces navigation
0005 site_settings       0013 guestbook
0006 site_navigation     0014 guestbook email
0007 about_page_content  0015 page_views (analytics)
0008 projects preview    0016 about profile_image
                         0017 undergraduate_portfolio
                         0018 hide_xicaoshi_project
```

完整文件见 `supabase/migrations/`。

### 动态路由详情页

```
app/projects/[slug]/page.tsx               layout: thesis | xicaoshi | portfolio
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
lib/about/queries.ts
lib/notes/queries.ts
lib/guestbook/queries.ts
lib/analytics/queries.ts
```

### Admin 入口（侧栏）

```
/admin/login          /admin/notes
/admin/site           /admin/projects
/admin/about          /admin/photography  (Traces)
/admin/guestbook      /admin/visual-works (Traces)
/admin/analytics      /admin/field-notes  (Traces)
```

布局：`app/admin/layout.tsx` → `AdminDashboardLayout` + `AdminSidebar`

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

## 8. 首页 Hero（已 CMS 化）

- 数据表：`site_settings`（`singleton_key = 'home'`）
- 前台：`lib/site/queries.ts` → `HeroImageDistortionClient`（`next/image`，`priority`）
- 压缩：`lib/media/compress-hero-image.ts`（1920px WebP q75）；Storage 约 **399KB**
- 后台：`/admin/site` 上传时自动压缩；存量重压：`npm run recompress:home`
- 首次迁移：`scripts/download-home-hero.ps1` → `npm run migrate:home`

本地 sparse-checkout 若无 `public/images/hero-image.jpg`，跑 download 脚本后再 migrate；否则 migrate 会报错。

---

## 9. 已知问题与经验

| 问题 | 原因 | 解决 |
|---|---|---|
| localhost 打不开 | dev server 未运行 | `npm run dev`，保持终端开着 |
| 首页封面空白 | 缺 hero-image.jpg | `.\scripts\download-home-hero.ps1` + 强刷 Ctrl+Shift+R |
| permission denied for table | 缺 GRANT | migration 里补 GRANT（见 0001 注释） |
| migrate 登录失败 | 密码错 / 末尾漏字符 | 检查 `.env.local` SUPABASE_ADMIN_PASSWORD |
| 重置密码邮件跳首页 | 缺 callback 路由或未配 Redirect URLs | 主域名 `https://www.qiannawang.com` 的 callback 需写入 Supabase；见 `docs/exec-vercel-domain-2026-08-11.md` |
| 忘记管理员密码 | Supabase Auth 无明文可查 | `/admin/login` → Forgot password；或 Supabase Users 直接改密 |
| build 失败 use server re-export | photography actions 曾 re-export signOutAction | 从 `@/app/admin/projects/actions` 直接 import |
| Next 16 params | 动态路由 params 是 Promise | `const { slug } = await params` |
| 公司网络 git clone 失败 | 大 binary | sparse-checkout + raw 下载脚本 |
| Google 摘要仍显示 Create Next App | 缺生产 SEO metadata / GSC 未更新 | 见 `experience-seo-metadata.md`、`exec-search-console-2026-08-20.md` |

---

## 10. 推荐下一步（2026-08-20 现状）

CMS 与前台主线已完成。常见后续：

1. **内容**：在 `/admin/notes` 发笔记；各模块 Publish 内容
2. **监控**：GSC 观察收录与摘要；`/admin/analytics` 看访问
3. **验证**：`npm run lint` + `npm run build`；目视 `/`、`/about`
4. **可选增强**：Hero 裁切 UI 复用 About 的 `ProfilePhotoCropField`；Markdown 编辑器升级

---

## 11. 相关文档

完整索引见 **[`docs/README.md`](README.md)**。核心文件：

| 文档 | 用途 |
|---|---|
| [`AGENTS.md`](../AGENTS.md) | Agent 常驻规则（Cursor 自动读取） |
| [`docs/architecture.md`](architecture.md) | 系统架构、分层、横切能力 |
| [`docs/developer-guide.md`](developer-guide.md) | **本文**（进度、环境、索引） |
| [`docs/cms-migration-checklist.md`](cms-migration-checklist.md) | 模块 checklist |
| `docs/exec-*.md` | 单次功能执行记录 |
| `docs/experience-*.md` | 可复用模式 |
| [`README.md`](../README.md) | 对外访客说明（保持简短） |

---

## 12. 新会话开场 Prompt 模板

```
请先读 AGENTS.md、docs/developer-guide.md 和 docs/architecture.md，然后继续 qianna-website 开发。

生产站：https://www.qiannawang.com
分支：main（CMS 已完成）

请先：lint/build（如需要）→ git status → 再执行我的目标。
```

---

## 13. package.json scripts 一览

```json
"dev": "next dev",
"start:site": "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/start-dev.ps1",
"build": "next build",
"start": "next start",
"lint": "eslint",
"migrate:media": "node scripts/migrate-project-media.mjs",
"migrate:home": "node scripts/migrate-home-hero.mjs",
"recompress:home": "node scripts/recompress-home-hero.mjs",
"migrate:photography": "node --experimental-strip-types scripts/migrate-photography.mjs",
"migrate:visual-works": "node --experimental-strip-types scripts/migrate-visual-works.mjs",
"migrate:field-notes": "node --experimental-strip-types scripts/migrate-field-notes.mjs"
```

`--experimental-strip-types` 用于 migrate 脚本直接 import `app/_data/*.ts`。
