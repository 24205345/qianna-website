# Supabase CMS 改造记录

> 分支：`feature/supabase-cms`
> 目标：把硬编码在页面里的作品集内容迁移到 Supabase，并搭建一个最小后台（admin）用于管理 `projects`。
> 技术栈：Next.js 16.2.1（App Router）+ React 19 + TypeScript + Tailwind v4 + `@supabase/ssr`。

---

## 一、本次自动完成的工作（已 commit，未 push）

改造按 Phase 分阶段进行，每个 Phase 一个本地 commit：

| Phase | 内容 | commit 信息 |
| --- | --- | --- |
| 0 | 创建分支 `feature/supabase-cms` | （分支创建） |
| 1 | 抽离硬编码内容到 `app/_data/` | `refactor: extract hardcoded page content into app/_data modules` |
| 2 | Supabase 脚手架 + SQL + projects 页改造 | `feat: scaffold Supabase clients, schema/storage SQL, and Supabase-backed projects page with static fallback` |
| 3 | 最小后台 admin 脚手架 | `feat: add minimal admin (auth middleware, login, projects CRUD with cover upload)` |

### Phase 1：抽离硬编码内容（纯重构，前台视觉零变化）

将各页面里的 `const` 数据数组抽离到 `app/_data/`，页面改为 `import`，渲染结果/className 完全不变：

- `app/_data/projects.ts` — 导出 `interface Project` 与 `projects`；`app/projects/page.tsx` 改为引用。
- `app/_data/photography.ts` — 导出 `interface Photo` 与 `gettyCenterPhotos` / `veniceBiennalePhotos` / `portraitsPhotos`；`app/photography/page.tsx` 改为引用。
- `app/_data/visual-works.ts` — 导出 `interface VisualWork` 与 `penDrawings` / `penAndWashDrawings` / `watercolorPaintings`；`app/visual-works/page.tsx` 改为引用。
- `app/_data/field-notes.ts` — 导出 `interface Trip` 与 `trips`；`app/field-notes/page.tsx` 改为引用。

> 字段、顺序、文案与原始内容逐字一致；图片仍按字符串路径处理，不依赖真实图片文件存在。

### Phase 2：Supabase 脚手架 + SQL + projects 读取改造

新增 / 修改文件：

- `package.json` — 新增依赖 `@supabase/ssr@^0.12.0`、`@supabase/supabase-js@^2.108.0`（**需用户执行 `npm install` 真正安装**，见下文）。
- `lib/supabase/client.ts` — 浏览器端客户端 `createClient()`（`createBrowserClient`）。
- `lib/supabase/server.ts` — 服务端客户端 `createClient()`（`createServerClient` + Next 16 异步 `cookies()`）；并导出 `isSupabaseConfigured()` 用于判断是否已配置环境变量。
- `.env.local.example` — 环境变量占位模板（无真实值）。
- `.gitignore` — 新增 `!.env.local.example`，使占位模板可被提交，而真实 `.env*` 仍被忽略。
- `supabase/migrations/0001_init.sql` — 建表 + 触发器 + RLS 策略（**仅文件，需用户手动执行**）。
- `supabase/storage-policies.sql` — `portfolio-media` 公开桶的读写策略（**仅文件，需用户手动执行**）。
- `supabase/seed-projects.sql` — 把现有 2 个项目导入 `projects` 表的可选种子脚本（幂等，**仅文件**）。
- `app/projects/page.tsx` — 改为 Server Component，从 Supabase 读取 `status='published'` 的项目，按 `sort_order` 排序；**未配置环境变量或查询出错时回退到 `app/_data/projects.ts` 静态数据**，保证前台始终正常、build 不报错。

> 其余三个模块（photography / visual-works / field-notes）本次**未改动数据源**，仍使用 `app/_data` 静态数据。

### Phase 3：最小后台 admin

- `middleware.ts` — 拦截 `/admin/*`：无登录会话跳 `/admin/login`；已登录访问登录页则跳 `/admin/projects`。**未配置 Supabase 时直接放行**（保证无配置也能构建/运行）。
- `app/admin/login/page.tsx` — 邮箱 + 密码登录（`signInWithPassword`），含错误提示（Client Component）。
- `app/admin/projects/page.tsx` — 列出全部项目（含 draft），提供「新增 / 编辑 / 删除 / 退出登录」入口（Server Component）。
- `app/admin/projects/new/page.tsx`、`app/admin/projects/[id]/edit/page.tsx` — 新增 / 编辑表单页。
- `app/admin/projects/ProjectForm.tsx` — 共用表单组件（title / slug / subtitle / description / content / category / tags / year / status / sort_order + 封面图上传）。
- `app/admin/projects/actions.ts` — Server Actions：`createProjectAction` / `updateProjectAction` / `deleteProjectAction` / `signOutAction`，封面图通过 `supabase.storage` 上传到 `portfolio-media` 后取公开 URL 写入 `cover_image_url`。

---

## 二、数据库表结构（来自 `0001_init.sql`）

### `projects`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid PK，默认 `gen_random_uuid()` | 主键 |
| title | text not null | 标题 |
| slug | text unique not null | URL 标识 |
| subtitle | text | 副标题 |
| description | text | 简介 |
| content | text | 正文 |
| category | text | 分类 |
| tags | text[] | 标签数组 |
| year | text | 年份 |
| cover_image_url | text | 封面图 URL |
| status | text not null default `'draft'`，CHECK in ('draft','published') | 发布状态 |
| sort_order | int not null default 0 | 排序 |
| created_at | timestamptz default now() | 创建时间 |
| updated_at | timestamptz default now() | 更新时间（由触发器维护） |

### `project_media`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid PK，默认 `gen_random_uuid()` | 主键 |
| project_id | uuid → projects(id) ON DELETE CASCADE | 所属项目 |
| type | text，CHECK in ('image','video','pdf') | 媒体类型 |
| url | text | 媒体地址 |
| caption | text | 说明 |
| sort_order | int default 0 | 排序 |
| created_at | timestamptz default now() | 创建时间 |

**RLS 策略**：匿名（anon）只能 `SELECT` `status='published'` 的项目及其媒体；登录用户（authenticated）可读取全部并执行 `INSERT/UPDATE/DELETE`。

---

## 三、如何验证（本地）

> ⚠️ 当前自动化执行环境中 **没有可用的 Node.js / npm**（不在 PATH，磁盘上也未找到），因此 `npm install`、`npm run lint`、`npm run build` **未能在本环境运行**。代码已通过逐文件人工类型/语法复核。请在你本机执行下列命令完成验证。

```powershell
# 在项目根目录 G:\project\qianna-website
npm install        # 安装新依赖 @supabase/ssr、@supabase/supabase-js
npm run lint       # ESLint 检查
npm run build      # 生产构建（未配置 Supabase 时应能通过；前台走静态回退）
npm run dev        # 本地预览
```

- **未配置 Supabase 时**：前台 `/projects` 等页面应与改造前完全一致（走静态回退）；`/admin/*` 中间件放行，访问 `/admin/projects` 会显示「尚未配置」提示。
- **构建若因缺少 `public/` 图片二进制报错**：属已知情况（仓库刻意排除 `public/`），与本次改造无关；类型检查 / lint 应通过。

---

## 四、用户需要手动完成的步骤（让 Supabase 真正联通）

1. **创建 Supabase 项目**：在 <https://supabase.com> 新建 project，记录 Project URL 与 anon public key（Project Settings → API）。
2. **配置本地环境变量**：复制 `.env.local.example` 为 `.env.local`，填入：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=（anon public key）
   ```
   > `.env.local` 已被 `.gitignore` 忽略，不会被提交。切勿把 `service_role` / secret key 放进 `NEXT_PUBLIC_` 变量。
3. **执行建表 SQL**：Supabase 控制台 → SQL Editor → 粘贴并运行 `supabase/migrations/0001_init.sql`。
4. **创建存储桶**：Storage → New bucket → 名称 `portfolio-media` → 勾选 **Public bucket**；建桶后在 SQL Editor 运行 `supabase/storage-policies.sql`。
5. **只建本人账号、关闭公开注册**：
   - Authentication → Providers → Email：保持 Email 登录开启；
   - Authentication → Sign In / Providers（或 Settings）→ 关闭 **Allow new users to sign up**（禁用公开注册）；
   - Authentication → Users → **Add user**，手动创建你自己的管理员邮箱 + 密码（用于 `/admin/login`）。
6. **导入现有 2 个项目（可选）**：在 SQL Editor 运行 `supabase/seed-projects.sql`，即可把 `thesis` 与 `xicaoshi-red-temple` 两个项目写入 `projects`（默认 `published`）。
7. **迁移封面图 / 媒体（可选）**：现有项目封面图位于被排除的 `public/` 目录；如需在 Supabase 展示，可在后台「编辑项目」时把图片上传到 `portfolio-media`，系统会自动写入 `cover_image_url`。
8. **本地验证联通**：`npm run dev`，访问 `/admin/login` 登录 → `/admin/projects` 应能看到项目列表并可增删改；`/projects` 前台应显示来自数据库的 `published` 项目。
9. **Vercel 部署环境变量（推荐）**：在 Vercel 项目 → Settings → Environment Variables 添加 `NEXT_PUBLIC_SUPABASE_URL` 与 `NEXT_PUBLIC_SUPABASE_ANON_KEY`（Production / Preview 均需），重新部署。
   - 若暂未配置，代码会通过 `lib/supabase/public-env.ts` 回退到项目默认 anon 配置，生产环境仍可登录（anon key 本身可公开，安全靠 RLS）。
10. **配置密码重置 Redirect URLs（必做，否则邮件链接只会跳首页）**：
    - Supabase 控制台 → **Authentication** → **URL Configuration**
    - **Site URL**：`https://www.qiannawang.com`（主域名；`qianna-site.vercel.app` 可保留作备用）
    - **Redirect URLs** 追加（每行一条）：
      ```
      https://www.qiannawang.com/auth/callback
      https://www.qiannawang.com/auth/confirm
      https://qiannawang.com/auth/callback
      https://qiannawang.com/auth/confirm
      https://qianna-site.vercel.app/auth/callback
      https://qianna-site.vercel.app/auth/confirm
      http://localhost:3000/auth/callback
      http://localhost:3000/auth/confirm
      ```
    - 保存后，重置邮件才会被站点正确接住并完成换 session。

---

## 四点五、管理员密码重置（`/admin/login`）

> commit：`fix: add Supabase password reset callback flow`（`0f15bdb`）

### 现象

在 Supabase 控制台点 **Send password recovery**，邮件链接若只跳到作品集首页、没有「设新密码」界面，通常是因为：

1. 站点缺少 Supabase Auth 回调路由（`code` / `token_hash` 无人消费）；
2. Supabase **Redirect URLs** 未白名单 `/auth/callback` 与 `/auth/confirm`。

### 正确流程

```
邮件链接（常带 ?code= 落在首页）
  → middleware 或直达 /auth/callback
  → exchangeCodeForSession / verifyOtp，写入 session cookie
  → /admin/reset-password（输入新密码）
  → updateUser({ password })
  → /admin/projects
```

### 相关文件

| 文件 | 作用 |
| --- | --- |
| `app/auth/callback/route.ts` | PKCE：`?code=` 换 session，再 302 到 `next`（默认 `/admin/reset-password`） |
| `app/auth/confirm/route.ts` | 兼容 `token_hash` + `type` 型邮件链接 |
| `app/admin/reset-password/page.tsx` | 设置新密码表单（`updateUser`） |
| `app/admin/login/page.tsx` | 登录 + **Forgot password?**（`resetPasswordForEmail`，`redirectTo` 指向 callback） |
| `middleware.ts` | 首页带 `?code=` / `?token_hash=` 时自动转 callback/confirm；`/admin/reset-password` 与 login 同为未登录可访问页 |

### 三种重置方式

| 方式 | 操作 | 适用 |
| --- | --- | --- |
| **A. 登录页自助** | `/admin/login` 填邮箱 → **Forgot password?** → 收邮件 → 设新密码 | 推荐，走完整 callback |
| **B. Supabase 控制台** | Authentication → Users → 用户 → **Send password recovery** | 需已配置 Redirect URLs + 已部署 callback 代码 |
| **C. 控制台直接改** | Authentication → Users → 用户 → 直接设新密码 | 救急，不依赖邮件 |

### 账号信息在哪查

- **邮箱**：本地 `.env.local` 的 `SUPABASE_ADMIN_EMAIL`，或 Supabase → Authentication → Users
- **密码**：任何地方都**无法查看明文**；只能回忆、查 `.env.local` 是否曾保存 `SUPABASE_ADMIN_PASSWORD`，或走上面三种重置方式

### 本地验证清单

1. Supabase Redirect URLs 已保存（见第四节第 10 步）
2. `npm run dev` 后访问 `/admin/login` → Forgot password → 收邮件
3. 点链接应进入 **Set New Password**，不是首页空白
4. 设完后能登录 `/admin/projects`

---

## 五、后续步骤（Phase 4 / 5，本次未编码）

- **Phase 4**：把 `photography` / `visual-works` / `field-notes` 三个模块也迁移到 Supabase（需要相应的表设计与媒体上传流程），目前仍用 `app/_data` 静态数据。
- **Phase 5**：完善后台体验（表单校验、错误提示 UI、富文本/Markdown 正文、`project_media` 多图管理、图片排序、拖拽上传、登录态过期处理等）。

### 用 `next/image` 显示 Supabase 图片时的注意事项

当前前台列表与后台表单**未用 `next/image` 渲染 Supabase 远程图片**，因此无需改 `next.config`。一旦后续要用 `<Image>` 显示 `portfolio-media` 的公开 URL，需在 `next.config` 增加 `images.remotePatterns`，放行 `*.supabase.co` 域名，否则会报「hostname not configured」。

---

## 六、不建议现在做的事

- **不要把 `public/` 加回 sparse-checkout**：其中是几百 MB 大图二进制，公司网络拉取会失败；本次所有改动都按「图片路径只是字符串」处理。
- **不要在 `NEXT_PUBLIC_` 变量里放 `service_role` / secret key**：这些变量会被打进浏览器端，等于公开泄露。后台的写操作依赖「登录用户 + RLS」，不需要 service key。
- **不要用 `apply_migration` 反复改库**：迭代阶段直接在 SQL Editor 跑 SQL；确定后再纳入迁移文件管理。
- **暂不要一次性迁移全部 4 个模块**：先用 `projects` 跑通「建库 → 后台 → 前台读取」闭环，验证无误后再推进 Phase 4。
- **不要 push 分支**（除非你确认要）：目前所有 commit 仅在本地 `feature/supabase-cms`。

---

## 七、经验沉淀（供同类任务复用）

1. **环境约束先探明再动手**：本仓库是 `--filter=blob:none` + sparse-checkout 且排除 `public/`；改代码时把图片当字符串处理即可，切勿尝试拉取二进制。
2. **Windows / PowerShell**：命令用 `;` 串联，不能用 `&&`。
3. **「先抽离、后接数据源」是低风险路径**：Phase 1 纯重构保证视觉零变化并先行 commit，后续接 Supabase 时只动数据获取层，回退逻辑（`isSupabaseConfigured()` + 静态兜底）让「未配置也能跑」成为默认安全态。
4. **Next 16 细节**：`cookies()` 为异步、动态路由 `params` 为 `Promise`，Server Action 用 `.bind(null, id)` 传参，`@supabase/ssr` 的 middleware「getAll/setAll + getUser()」模式是官方推荐写法（鉴权决策用 `getUser()`，不要用 `getSession()`）。
5. **`.env*` 通配会误伤模板**：`.gitignore` 里 `.env*` 会把 `.env.local.example` 一起忽略，需加 `!.env.local.example` 负向规则。
6. **P1 详情页动态化**：删除静态 `app/projects/thesis/page.tsx` 等，统一走 `[slug]` + `layout_template` 分支渲染；Overview/Details 用 `text[]` + `jsonb` 存库，后台表单用多行文本 + JSON 编辑；`deleteProjectAction` 删除时勿引用 `payload.slug`（delete 无 form payload）。
7. **全站迁移路线图**：见 `docs/cms-migration-checklist.md`（P2–P4 均已完成）。
8. **模块化 CMS 复制模式**：Photography / Visual Works / Field Notes 均按「建表 → queries + _data 回退 → 前台读库 → admin CRUD → migrate + download 脚本」完成；Field Notes 额外用 `layout_template: gallery | narrative` 分支渲染。
9. **首页 Hero 已 CMS 化**：读 `site_settings` + `/admin/site`；本地 sparse-checkout 缺图时跑 `download-home-hero.ps1` + `migrate:home`。
10. **本地 dev 易忘**：`npm run dev` 终端不能关；Node 路径 `G:\node-v24.16.0-win-x64` 需手动加 PATH。
11. **Agent 开发入口**：先读 [`AGENTS.md`](../AGENTS.md)、[`docs/developer-guide.md`](developer-guide.md) 与 [`docs/architecture.md`](architecture.md)；文档索引见 [`docs/README.md`](README.md)。
12. **Projects Preview 导航模式**：首页分类预览卡片适合整卡可点击进入 `/projects?category=...`，而 `View all projects` 进入 `/projects` 汇总。分类定义集中放在 `lib/projects/categories.ts`，用 `matchLabels` 兼容数据库里单复数或历史文案差异，避免在多个页面手写判断。
13. **Projects 汇总页不要重复分类标题**：当项目卡片内已经显示分类标签时，`/projects` 汇总页按时间倒序扁平展示更清爽；只有分类筛选页才需要显示分类标题和说明。
14. **Hero CTA 轻量化**：强视觉首屏上，CTA 不宜做成高对比胶囊按钮。当前首页使用 `Enter →` 文本链接，箭头与内页 `← Back to Home` 使用同类文本字符；下划线透明度降低，hover 只做斜体，避免抢主标题和图片注意力。
15. **Windows 安装 Cursor Skill 的坑**：PowerShell 可能因执行策略拦截 `npm.ps1` / `npx.ps1`。此时用 `G:\node-v24.16.0-win-x64\npm.cmd` / `npx.cmd` 可绕过；用户已安装 `ui-ux-pro-max`，适合做大范围 UI/UX 检查，但像素级微调仍应以截图和现有风格为准。
16. **Home Hero CMS 化**：站点级单例内容用 `site_settings` 单表即可，固定 `singleton_key = 'home'`，比通用 pages 表更轻。首页仍保留 `app/_data/site-settings.ts` 回退，后台 `/admin/site` 只暴露 Hero title/subtitle/CTA/image/alt，避免把首页布局复杂度提前 CMS 化。
17. **大图上传策略**：Next Server Action 默认 body size 较小，后台上传 Hero 图需在 `next.config.ts` 配置 `serverActions.bodySizeLimit`；更稳妥的方式仍是 `npm run migrate:home` 先用 sharp 压缩上传，再在后台微调文案。
18. **Site Navigation Copy CMS**：首页入口卡片与子页页眉共用 `site_navigation_items`；About 页 title/description 走 `about` 项；正文（Timeline、照片等）在 `about_page_content` + `/admin/about`。
19. **内容可见性（draft / published）**：Projects、Photography 合集、Visual Works 分类、Field Notes 均支持 `draft`（前台隐藏）与 `published`（前台可见）。后台列表页可直接点 **Hide / Publish** 切换；编辑页 **Visibility** 下拉也可设置。前台查询与 Supabase RLS 均只暴露 `published`。
20. **About 页 CMS**：`/admin/about` 编辑页头、Timeline、Working Across、Current Focus、**16:9 个人照片**（裁切上传）。Admin **左侧边栏** → About。
21. **生产域名**：`https://www.qiannawang.com`；Supabase Auth Redirect URLs 需同时包含 www、apex 与 vercel.app 备用域（见 `docs/exec-vercel-domain-2026-08-11.md`）。
