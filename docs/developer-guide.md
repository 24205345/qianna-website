# 开发者指南（qianna-website）

> **Agent / 开发者第一份必读。** 常驻规则见根目录 [`AGENTS.md`](../AGENTS.md)；**系统架构**见 [`architecture.md`](architecture.md)；文档索引见 [`docs/README.md`](README.md)。
>
> 项目路径：`G:\project\qianna-website`  
> 分支：`main`（CMS 主线与 R2 生产迁移已完成；Workbench 表待部署）<br>
> 最后更新：2026-10-10<br>
> 生产域名：**https://www.qiannawang.com**

---

## 1. 项目是什么

Next.js 16.2.1 + React 19 + TypeScript + Tailwind v4 **个人作品集网站**（对外分享作品与背景；内容通过私有 `/admin` 管理）。

- GitHub：`24205345/qianna-website`
- Supabase Project ID：`aqsdwfocoocnzyxopvvg`
- 生产媒体：Cloudflare R2 `portfolio-media` → `https://media.qiannawang.com`；Supabase 同名源桶保留回滚。
- 新增统一 Cloudflare R2 媒体接口，2026-10-10 生产已切换 R2；未指定 provider 的环境仍默认 Supabase。迁移方案见 [`exec-cloudflare-r2-2026-10-09.md`](exec-cloudflare-r2-2026-10-09.md)，完成证据见 [`exec-mcp-storage-2026-10-10.md`](exec-mcp-storage-2026-10-10.md)。

---

## 2. CMS 进度（截至 2026-10-10）

| 模块 | 状态 | 前台 | 后台 | 迁移 / 备注 |
|---|---|---|---|---|
| Projects 列表+媒体+详情 | ✅ | `/projects`, `/projects/[slug]` | `/admin/projects` | `npm run migrate:media`；0017 portfolio flipbook；编辑页 Promise.all 并发 |
| Photography | ✅ | `/photography` | `/admin/photography` | `npm run migrate:photography`；编辑页 Promise.all 并发 |
| Visual Works | ✅ | `/visual-works` | `/admin/visual-works` | `npm run migrate:visual-works`；编辑页 Promise.all 并发 |
| Field Notes | ✅ | `/field-notes`, `/field-notes/[slug]` | `/admin/field-notes` | `npm run migrate:field-notes`；编辑页 Promise.all 并发 |
| **Traces Hub** | ✅ | `/traces`（Tab）+ 旧路径 | 侧栏 Traces 子项 | `0012_traces_navigation.sql` |
| **Home Hero** | ✅ | `/` | `/admin/site` | `migrate:home` / `recompress:home`；1:1 双端实景模拟器 |
| **Site Navigation Copy** | ✅ | `/`, linked page headings | `/admin/site` | 4 大板块实景图文工作台；废弃生硬 9 项配置表单 |
| **About** | ✅ | `/about`（16:9 个人照片 + Timeline） | `/admin/about` | `0007` + `0016_about_profile_image.sql`；并发查询 |
| **Notes** | ✅ | `/notes`, `/notes/[slug]` | `/admin/notes` | Tiptap v3 + Markdown 存储 + 双语正文 + TOC；图片/附件走统一存储接口 |
| **Guestbook** | ✅ | 首页 About Me 下预览 3 条 | `/admin/guestbook` | Turnstile；`0013` / `0014` |
| **Analytics** | ✅ | 全站 `PageViewTracker` | `/admin/analytics` | `0015_page_views.sql`；标题并发解析与大拉取优化 |
| **首页策展改版** | ✅ | 双字体 Serif/Sans、Sub-rail 细线与悬浮指示、无下划线 | — | 见 `exec-homepage-editorial-admin-overhaul-2026-09-16.md` |
| **后台极速渲染** | ✅ | — | `/admin/*` | 全局 `loading.tsx` 骨架屏 + Header 鉴权透传 + 路由 prefetch |
| **SEO** | ✅ | canonical / JSON-LD / sitemap | — | GSC 已验证；见 `experience-seo-metadata.md` |
| **Workbench** | 前台静态回退；后台待部署表 | `/workbench` | `/admin/workbench` | 仓库已有 0019；2026-10-10 只读复核表仍不存在 |
| **R2 媒体适配** | 生产已迁移，验收通过 | `media.qiannawang.com` | 所有上传入口 | 160 文件 / 159 行；`npm run migrate:r2` 支持回滚 |

Admin 导航：Projects → Traces → Notes → Workbench → About → Guestbook → Site Settings → Analytics；Projects / Traces 有二级菜单。当前布局为 `AdminShell`，导航来源为 `AdminSidebar.tsx`。

Supabase 数据量（2026-10-10 只读复核）：
- `photography_photos`: 46
- `visual_works`: 22
- `field_notes`: 5；`field_note_media`: 66 行（62 图 + 4 外链视频）
- R2 正式清单：160 文件，106,278,846 字节（101.36 MiB），159 行 `applied`；迁移代码及裂图修复已提交推送为 [`0064c9f`](https://github.com/24205345/qianna-website/commit/0064c9f21b44dbb702040ce788320b698fe82c7e)。

详细 checklist：`docs/cms-migration-checklist.md`

### 前台路由速查

| 路径 | 说明 |
|------|------|
| `/` | Hero → Selected Works → Traces → Notes → Workbench → About Me + Guestbook |
| `/notes`, `/notes/[slug]` | 笔记列表与详情 |
| `/projects`, `/projects/[slug]` | 项目汇总与详情 |
| `/traces` | Traces Hub（Photography / Drawings / Field Notes Tab） |
| `/photography`, `/visual-works`, `/field-notes`, `/field-notes/[slug]` | 专项列表与详情，旧路径保留 |
| `/workbench` | 工作流与资源；当前使用静态回退 |
| `/about` | About 页（标题、描述、16:9 照片、Timeline） |
| `/guestbook` | 留言簿完整列表 |
| `/admin/*` | 私有 CMS（login / reset-password 无侧栏） |

---

## 2.1 前台 UX 要点与视觉呈现规范（核心准则）

完整 IA 见 `docs/exec-site-ia-guestbook-2026-08-04.md`；视觉策展改版详见 `docs/exec-homepage-editorial-admin-overhaul-2026-09-16.md`。关键约定：

- **核心原则：新增模块或者做修改的时候要参考网站的既有风格和呈现模式**，严禁脱离全站既有设计语言自行臆想设计；
- **首页策展叙事动线**：
  - `01` **Selected Works (Projects)** → `02` **Traces** → `03` **Notes** → `04` **Workbench** → **About Me**（含 Guestbook 预览）；
- **极简双字体与去噪规范**：
  - **首页 100% 严禁出现 `font-mono`**（拔除等宽代码字体的视觉杂波）；大标题统一使用精致衬线体 `font-serif`，正文、标签、小角标统一使用无衬线体 `font-sans`；
- **板块头部与 Sub-rail 导航横轨统一**：
  - 眉标格式统一：`Category / Theme · 0X`（`text-xs tracking-[0.22em] text-stone-500 uppercase`）；
  - 主标题格式统一：`mt-1 font-serif text-3xl md:text-4xl text-stone-900`；
  - 分类横轨统一采用 **Sub-rail 细分割线模式**（`border-b border-stone-200/80`）：左侧分类项为 `-mb-px border-b-2 pb-3 text-sm`（激活项为深黑实线 `border-stone-900 font-medium text-stone-900`，非激活项为浅灰且 hover 悬停加黑指示），右侧对齐 `View all ... →`（**严禁默认下划线**，hover 仅平滑右移 `translate-x-0.5`）；
- **卡片容器与控件约束**：
  - 卡片统一采用 `rounded-2xl border border-stone-200/80 bg-stone-100/50 p-4~p-6`，hover 统一过渡到 `border-stone-300 bg-stone-100/90`；
  - 标签统一采用 `rounded-md bg-stone-200/60 px-2 py-0.5 text-xs text-stone-600`（或 `rounded-md bg-stone-100 px-2.5 py-1 text-xs text-stone-600`）；
  - **严禁私自引入深色药丸胶囊按钮（如黑底圆角按钮）、emoji 图标装饰与多层内嵌复杂容器**；
- Projects 分类：`lib/projects/categories.ts`（`matchLabels` 兼容历史文案）；
- 首页 project 卡片 → `/projects?category=...`；View all → `/projects`（按 year 扁平排序）；
- Hero CTA：轻量 `Enter →` 文字链，非胶囊按钮；
- About 照片 **只在 `/about`**，首页 About 卡片仅文字摘要；
- Admin：**左侧边栏**；Projects 子菜单无 All；About 照片 16:9 裁切（`react-easy-crop`）；
- 站点气质：安静、编辑感、stone 暖灰；大改 UI 前可参考 `ui-ux-pro-max` skill，但以截图与现有风格为准。

历史逐条变更见各 `docs/exec-*.md`，此处不再堆叠。

---

## 3. 本地开发（Windows）

### 3.1 Node 路径

公司电脑 Node 不在默认 PATH，每次开新终端需：

```powershell
$env:Path = "G:\project\.runtimes\node-v24.16.0-win-x64;" + $env:Path
cd G:\project\qianna-website
node --version
npm ci
```

项目媒体脚本使用 Node 24 的原生 TypeScript stripping 和 `parseEnv`。其他机器使用自己的 Node 24 安装路径即可。

### 3.2 启动网站

完成 §3.3 配置后，推荐手动运行 `npm run dev` 并保持终端运行。也可使用仓库现有启动器：

```powershell
.\scripts\start-dev.ps1
# 或
npm run start:site
```

启动器检测依赖后启动开发服务并打开 **http://localhost:3000**；服务已在运行时只打开浏览器。`scripts/start-dev.ps1` 仍含旧 Node 路径 `G:\node-v24.16.0-win-x64`，使用前先按 §3.1 设置当前 PATH。

手动启动：

```powershell
npm run dev
```

### 3.3 环境变量

复制 `.env.local.example` → `.env.local`（已在 gitignore，勿提交）：

```
NEXT_PUBLIC_SITE_URL=https://www.qiannawang.com
NEXT_PUBLIC_SUPABASE_URL=https://aqsdwfocoocnzyxopvvg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
MEDIA_STORAGE_PROVIDER=r2
R2_ACCOUNT_ID=<Cloudflare Account ID>
R2_BUCKET_NAME=portfolio-media
R2_PUBLIC_BASE_URL=https://media.qiannawang.com
R2_ACCESS_KEY_ID=<仅限本桶的 Access Key ID>
R2_SECRET_ACCESS_KEY=<Secret Access Key>
DEV_IMAGE_UNOPTIMIZED=false
```

以上为复现当前 R2 环境的配置；模板仍以 `supabase` 为默认 provider。只需浏览页面时应配置 `R2_PUBLIC_BASE_URL` 以允许远程图片，不需要 R2 写入凭据；使用后台上传或 R2 迁移脚本时才需要完整 S3 配置。

`SUPABASE_ADMIN_EMAIL` / `SUPABASE_ADMIN_PASSWORD` 仅供本地迁移脚本登录，不能提交或放到 Vercel；不用 service_role。Guestbook 的 Turnstile 配置见模板。

`lib/supabase/public-env.ts` 内置本站公开连接回退。省略变量不会禁用数据库；要验证未配置分支，在测试环境显式将 URL / key 都置空，并核对对应模块的回退行为。

本地代理 DNS 将媒体域名解析为私网地址时，可设 `DEV_IMAGE_UNOPTIMIZED=true` 后重启开发服务。仅 development 使用浏览器直读图片，生产优化不受影响；具体排查见 [媒体运维](experience-media-storage.md#3-裂图排查)。

### 3.4 验证命令

图片第一阶段优化见 [执行记录](exec-image-performance-p1-2026-10-10.md)。新增 / 替换 `public/notes` 图片后运行 `npm run generate:note-images` 更新真实尺寸；`npm run build` 的 prebuild 会自动刷新。修改首页或图集布局时同步 `lib/media/image-sizes.ts`；Notes 公开图源规则与 Next.js 配置共用 `lib/media/image-config.ts`。

```powershell
npm run lint
npx tsc --noEmit
npm run test:media
npm run test:performance
npm run build
```

PowerShell 分行执行，不用 `&&`。仅改文档时检查链接与 `git diff --check`；无需因文档更新重跑应用构建。React/TS 改动运行 lint；存储/迁移改动运行媒体测试，并按影响补充类型检查、构建与浏览器验收。

---

## 4. 静态资产、sparse-checkout 与初始化脚本

普通 clone 会包含已跟踪的 `public/` 资产；2026-10-10 本地 `core.sparseCheckout=false`，`public/` 有 188 个已跟踪文件。历史开发曾使用 sparse-checkout，只有此类检出或实际缺文件时才需要下载脚本。

### 现象

- 本地静态 URL 返回 404 → 核对 `public/` 路径、文件大小写与检出范围
- migrate 脚本报 `缺少文件: public/...`
- 页面能打开但图片 404

### 缺文件时补下载

先核对实际失败 URL。生产 Hero 等 CMS 图片已经指向 R2；R2 200 而本地 `/_next/image` 400 时按 §9 排查，不能用初始化脚本解决。下面的 `migrate:*` 命令用于新环境初始化，可能删除并重建媒体行或覆盖文案；不要在现有生产库上当作验收步骤重跑。

| 模块 | 下载脚本 | 迁移命令 |
|---|---|---|
| Home Hero (~16MB) | `scripts/download-home-hero.ps1` | `npm run migrate:home` |
| Projects | `scripts/download-project-media.ps1` | `npm run migrate:media` |
| Photography (46) | `scripts/download-photography-media.ps1` | `npm run migrate:photography` |
| Visual Works (22) | `scripts/download-visual-works-media.ps1` | `npm run migrate:visual-works` |
| Field Notes | `scripts/download-field-notes-media.ps1` | `npm run migrate:field-notes` |

```powershell
cd G:\project\qianna-website
.\scripts\download-home-hero.ps1          # 首页封面
.\scripts\download-photography-media.ps1  # 示例：其他模块同理
```

GitHub raw 下载偶发 EOF（尤其 gliding 大图），失败文件单独重试并确认完整。R2 存量迁移使用 `migrate:r2` 的正式清单流程，见 [执行步骤](exec-cloudflare-r2-2026-10-09.md#5-正式迁移顺序)。本次未迁移 `/notes/...` 等静态路径，也未清理 Git 中的大图。

---

## 5. 架构说明

CMS 四层模式、数据流、Auth / SEO / Analytics / 媒体管线等**稳定架构**已独立成文：

→ **[`docs/architecture.md`](architecture.md)**

新模块开发前先读 §6「CMS 模块模式」；改完架构级能力时同步更新该文件。

---

## 6. 关键文件索引

### 数据库迁移（0001–0019 摘要）

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
                         0019 workbench_pipelines（生产待部署）
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
app/_data/workbench.ts
app/_data/site-settings.ts, site-navigation.ts, about-page.ts, notes.ts
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
lib/workbench/queries.ts
lib/traces/queries.ts
```

### Admin 入口（侧栏）

```
/admin/login          /admin/notes
/admin/site           /admin/projects
/admin/about          /admin/photography  (Traces)
/admin/guestbook      /admin/visual-works (Traces)
/admin/analytics      /admin/field-notes  (Traces)
/admin/workbench      /admin/workbench/[id]
```

布局：`app/admin/layout.tsx` → `AdminShell` + `AdminSidebar`

### 媒体存储与迁移

```text
lib/media/storage.ts                 server-only 上传入口
lib/media/storage-core.ts            provider / S3 / URL / 缓存
scripts/lib/media-upload.mjs         初始化脚本上传适配
scripts/migrate-storage-to-r2.mjs     清点、计划、复制、校验、apply、rollback
scripts/lib/r2-migration.mjs          字段白名单、URL 改写、并发保护
tests/media-storage.test.mjs         上传接口测试
tests/r2-migration.test.mjs           迁移与回滚测试
next.config.ts                       图片源白名单、本地开发直读开关
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
当前这 4 个视频保留 Google Drive 外链。Projects 的已有 MP4 对象已迁移到 R2。大文件后台签名直传尚未实现，不要把应用 `20mb` 配置当作 Vercel 平台上传上限。

`field_note_media` 叙事区块字段：`section_key`, `layout`, `aspect_ratio`, `caption`  
snowboard 的 `spring_chute` 区块：`caption` 存 footer 文案（见 `queries.ts` 解析逻辑）。

---

## 8. 首页 Hero（已 CMS 化）

- 数据表：`site_settings`（`singleton_key = 'home'`）
- 前台：`lib/site/queries.ts` → `HeroImageDistortionClient`（`next/image`，`priority`）
- 压缩：`lib/media/compress-hero-image.ts`（1920px WebP q75）；Storage 约 **399KB**
- 后台：`/admin/site` 上传时自动压缩，写入 R2 `site/home-hero-<uuid>.webp`；URL 保存到 `site_settings`
- 初始化与定向重压：`migrate:home` / `recompress:home` 使用可覆盖路径，需先核对目标库与 provider，不能作为日常裂图修复步骤

初始化脚本需要本地源图；已经使用 R2 CMS URL 的页面不依赖本地 Hero 原图。

---

## 9. 已知问题与经验

| 问题 | 原因 | 解决 |
|---|---|---|
| localhost 打不开 | dev server 未运行 | `npm run dev`，保持终端开着 |
| 原图 200，本地优化 400，生产正常 | 代理 DNS 解析成私网地址，或本地配置未重载 | 查 dev 日志与 DNS；代理场景启用 `DEV_IMAGE_UNOPTIMIZED=true` 后重启，见 [媒体运维](experience-media-storage.md) |
| `/_next/image` 报 URL 不允许 | 媒体域名/路径白名单缺失，或私网源检查失败 | 核对 `R2_PUBLIC_BASE_URL`、实际请求 URL 和日志；配置修改后重启/重新部署 |
| 本地静态图片 404 | 文件确实缺失或路径大小写错误 | 核对 `public/` 与 sparse-checkout，必要时补下载 |
| permission denied for table | 缺 GRANT | migration 里补 GRANT（见 0001 注释） |
| migrate 登录失败 | 密码错 / 末尾漏字符 | 检查 `.env.local` SUPABASE_ADMIN_PASSWORD |
| 重置密码邮件跳首页 | 缺 callback 路由或未配 Redirect URLs | 主域名 `https://www.qiannawang.com` 的 callback 需写入 Supabase；见 `docs/exec-vercel-domain-2026-08-11.md` |
| 忘记管理员密码 | Supabase Auth 无明文可查 | `/admin/login` → Forgot password；或 Supabase Users 直接改密 |
| build 失败 use server re-export | photography actions 曾 re-export signOutAction | 从 `@/app/admin/projects/actions` 直接 import |
| Next 16 params | 动态路由 params 是 Promise | `const { slug } = await params` |
| 公司网络 git clone 失败 | 大 binary | sparse-checkout + raw 下载脚本 |
| Google 摘要仍显示 Create Next App | 缺生产 SEO metadata / GSC 未更新 | 见 `experience-seo-metadata.md`、`exec-search-console-2026-08-20.md` |

---

## 10. 下一步（2026-10-10）

R2 迁移已完成。后续按独立任务推进：

1. **部署维护**：后续部署检查生产页面、图片优化和后台上传；保存正式回滚清单与 Supabase 原文件。
2. **大文件直传**：认证后签名 PUT + 上传完成验证 + DB 写入，解决 Server Actions 的 Vercel 请求体限制；仍需实现。
3. **Workbench**：部署并验证 `0019_workbench_pipelines.sql`，检查 RLS/GRANT、后台保存与前台读库；目前仅静态回退正常。
4. **依赖与内容**：单独处理依赖安全更新、Notes 发文、GSC 与 Analytics；媒体资产清理需先做引用盘点和备份。

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
分支：main（R2 生产迁移已完成；Workbench 表待部署）

先核对 git status、当前文档和相关代码，再执行目标；按改动范围验证。仅明确要求时 commit/push。
```

---

## 13. package.json scripts 一览

```json
"dev": "next dev",
"start:site": "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/start-dev.ps1",
"build": "next build",
"start": "next start",
"lint": "eslint",
"test:media": "node --test tests/media-storage.test.mjs tests/r2-migration.test.mjs",
"migrate:r2": "node scripts/migrate-storage-to-r2.mjs",
"migrate:media": "node scripts/migrate-project-media.mjs",
"migrate:home": "node scripts/migrate-home-hero.mjs",
"recompress:home": "node scripts/recompress-home-hero.mjs",
"migrate:photography": "node --experimental-strip-types scripts/migrate-photography.mjs",
"migrate:visual-works": "node --experimental-strip-types scripts/migrate-visual-works.mjs",
"migrate:field-notes": "node --experimental-strip-types scripts/migrate-field-notes.mjs"
```

`--experimental-strip-types` 用于初始化脚本直接 import `app/_data/*.ts`。`migrate:r2 -- --help` 显示六阶段命令；不带参数默认生成计划，已有正式清单不可覆盖。运维验收不要执行初始化脚本。
