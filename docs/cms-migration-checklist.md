# CMS 全站迁移 Checklist（P1–P4）

> 原则：每步小而可验证，完成一步 commit 一步，不要一次性大改。

---

## 当前进度总览

| 阶段 | 状态 | 说明 |
|---|---|---|
| Phase 0 基础设施 | ✅ | Supabase DB/Storage/Auth、RLS、`.env.local` |
| Projects 列表 CMS | ✅ | `/projects` + `/admin/projects` |
| Projects 媒体 CMS | ✅ | 画廊图、封面、顶部视频已上传 Storage |
| **P1 Projects 详情补完** | ✅ | 动态 `[slug]`、Overview/Details/Intro 视频可编辑 |
| **P2 Photography** | ✅ | 3 系列 46 张、前台读库、后台 CRUD + 迁移脚本 |
| **P3 Visual Works** | ✅ | 3 分类 22 张、前台读库、后台 CRUD + 迁移脚本 |
| **P4 Field Notes** | ✅ | 5 旅程、63 图 + 4 视频、动态 [slug]、双模板 |
| P5 Home/About（可选） | ⬜ | 首页 Hero 仍用 `public/images/hero-image.jpg`，需 `download-home-hero.ps1` |

---

## P1：Projects 详情补完 ✅

### 已完成内容
- [x] 数据库新增：`overview_paragraphs`、`project_details`、`intro_video_url`、`layout_template`
- [x] 灌入 thesis / xicaoshi 现有文字数据
- [x] 详情页改为 `app/projects/[slug]/page.tsx` 动态路由
- [x] 保留两种视觉模板：`thesis` / `xicaoshi`
- [x] 后台表单可编辑 Overview、Project Details、Intro 视频 URL、Layout template

### 验证方式
1. 访问 `/projects/thesis` — 视频、Overview、Details、Google Drive iframe、8 张画廊
2. 访问 `/projects/xicaoshi-red-temple` — 封面、Overview、12 张网格画廊
3. 后台编辑 thesis → 改 Overview 一段文字 → 保存 → 刷新前台确认

### 涉及文件
- `app/projects/[slug]/page.tsx`
- `app/projects/_components/*`
- `lib/projects/queries.ts`、`parse-form.ts`
- `app/admin/projects/ProjectForm.tsx`、`actions.ts`

---

## P2：Photography 模块

### 目标
46 张照片（Getty 18 + Venice 18 + Portraits 10）可在后台管理，前台 `/photography` 从 Supabase 读取。

### 建议表结构（二选一，推荐 A）

**方案 A（推荐）：专用表**
```sql
photography_collections (id, slug, title, description, sort_order)
photography_photos (id, collection_id, url, title, date, location, description, sort_order)
```

**方案 B：复用 projects 模式** — 每个系列当一个 "project"，过于 hack，不推荐。

### 分步 Checklist

| 步骤 | 任务 | 修改文件 | 验证 |
|---|---|---|---|
| P2-1 | 建表 + RLS + GRANT | `supabase/migrations/0002_photography.sql` | Supabase 表可见 |
| P2-2 | 扩展 `migrate:media` 或新建 `migrate:photography` | `scripts/` | 46 张压缩上传成功 |
| P2-3 | 灌入 46 条 photo 记录 + 3 个 collection | SQL 或脚本 | 后台能查到 |
| P2-4 | 前台 `/photography` 改读 Supabase | `app/photography/page.tsx`、`lib/photography/queries.ts` | 页面视觉不变 |
| P2-5 | 后台 `/admin/photography` 列表 + 编辑 | `app/admin/photography/**` | 可改标题/图注 |
| P2-6 | `npm run lint` + `npm run build` | — | 通过 |
| P2-7 | commit | — | — |

**预估**：Agent 5–8h，你验证 1h

---

## P2：Photography 模块 ✅

### 已完成内容
- [x] 建表 `photography_collections` + `photography_photos` + RLS + GRANT
- [x] 灌入 3 个系列元数据（seed-photography.sql）
- [x] 前台 `/photography` 读 Supabase，静态 `_data` 回退
- [x] 后台 `/admin/photography` 系列 CRUD + PhotoManager
- [x] 迁移脚本 `npm run migrate:photography` + 下载脚本 `download-photography-media.ps1`

### 验证方式
1. 若本地无 `public/photography/`：先跑 `scripts/download-photography-media.ps1`
2. 跑 `npm run migrate:photography` 上传 46 张到 Storage
3. 访问 `/photography` — 3 个系列、46 张图、lightbox 正常
4. 后台 `/admin/photography` — 可编辑系列标题、上传/删除照片

### 涉及文件
- `supabase/migrations/0002_photography.sql`
- `lib/photography/queries.ts`
- `app/photography/page.tsx`、`PhotoGallery.tsx`
- `app/admin/photography/**`
- `scripts/migrate-photography.mjs`

---

## P3：Visual Works 模块

### 目标
22 幅作品（pen 6 + pen&wash 10 + watercolor 6），结构比 Photography 更简单（无 location）。

### 分步 Checklist

| 步骤 | 任务 | 修改文件 | 验证 |
|---|---|---|---|
| P3-1 | 建表 `visual_works` + `visual_work_categories` | `supabase/migrations/0003_visual_works.sql` | 表可见 |
| P3-2 | 迁移 22 张图到 Storage | `scripts/migrate-visual-works.mjs` | 上传成功 |
| P3-3 | 前台 `/visual-works` 读 Supabase | `app/visual-works/page.tsx` | 视觉不变 |
| P3-4 | 后台 `/admin/visual-works` | `app/admin/visual-works/**` | 可编辑 |
| P3-5 | lint/build + commit | — | 通过 |

**预估**：Agent 3–5h（大量复制 P2 模式）

---

## P3：Visual Works 模块 ✅

### 已完成内容
- [x] 建表 `visual_work_categories` + `visual_works` + RLS + GRANT
- [x] 前台 `/visual-works` 读 Supabase，静态回退
- [x] 后台 `/admin/visual-works` 分类 CRUD + WorkManager
- [x] `npm run migrate:visual-works` + `download-visual-works-media.ps1`

### 验证方式
1. `scripts/download-visual-works-media.ps1` → `npm run migrate:visual-works`
2. 访问 `/visual-works` — 3 分类、22 张、lightbox 正常
3. 后台 `/admin/visual-works` — 可编辑分类、上传/删除作品

---

## P4：Field Notes 模块 ✅

### 已完成内容
- [x] 建表 `field_notes` + `field_note_media` + RLS + GRANT
- [x] 5 条旅程元数据 + 62 张图 + 4 个 Google Drive 视频写入 Supabase
- [x] 列表 `/field-notes` 读 Supabase，静态 `_data` 回退
- [x] 详情改 `app/field-notes/[slug]` 动态路由
- [x] 双模板：`gallery`（nanjiluo / yubeng / whitecliffs / gliding）+ `narrative`（snowboard）
- [x] 后台 `/admin/field-notes` CRUD + MediaManager（图片 + 视频外链）
- [x] `npm run migrate:field-notes` + `download-field-notes-media.ps1`

### 验证方式
1. `/field-notes` — 5 张卡片
2. `/field-notes/gliding` — 画廊 + 2 个视频 iframe
3. `/field-notes/snowboard` — 叙事区块 + Scroll 提示 + In Motion 视频
4. `/admin/field-notes` — 可编辑旅程与媒体

### 涉及文件
- `supabase/migrations/0004_field_notes.sql`
- `app/_data/field-note-details.ts`
- `lib/field-notes/queries.ts`
- `app/field-notes/[slug]/page.tsx`
- `app/field-notes/_components/GalleryFieldNoteView.tsx`
- `app/field-notes/_components/NarrativeFieldNoteView.tsx`
- `app/admin/field-notes/**`
- `scripts/migrate-field-notes.mjs`

---

## P4（原规划参考）

### 目标
5 条旅程列表 + 5 个详情页，约 63 张图，4 个 Google Drive 视频 iframe（gliding×2、snowboard×2）。

### 建议表结构
```sql
field_notes (id, slug, title, date, location, description, cover_image_url,
             intro_video_urls text[], layout_template, sort_order, status)
field_note_media (id, field_note_id, type, url, title, caption, sort_order)
```

`intro_video_urls` 存多个 Google Drive preview URL（数组）。

### 分步 Checklist

| 步骤 | 任务 | 验证 |
|---|---|---|
| P4-1 | 建表 + RLS | 表可见 |
| P4-2 | 迁移 63 张图（gliding 最大，注意压缩） | Storage 有文件 |
| P4-3 | 灌入 5 条 field_notes + 视频 URL | 数据完整 |
| P4-4 | 列表页 `/field-notes` 读 Supabase | 5 张卡片正常 |
| P4-5 | 详情页改 `app/field-notes/[slug]/page.tsx` 动态路由 | 5 个 URL 全通 |
| P4-6 | 后台 `/admin/field-notes` CRUD + 媒体管理 | 可增删改 |
| P4-7 | lint/build + commit | 通过 |

**预估**：Agent 8–12h，你验证 1–2h

---

## P5：Home / About（可选，低优先级）

| 步骤 | 任务 |
|---|---|
| P5-1 | `site_settings` 单表存 hero_image_url、hero_title、hero_subtitle |
| P5-2 | 压缩上传 16MB hero 图到 Storage |
| P5-3 | 首页 `/` 读 Supabase，About 页同理 |
| P5-4 | 后台 `/admin/site` 简单表单 |

**本地临时方案**：首页 Hero 仍走 `public/images/hero-image.jpg`，运行 `scripts/download-home-hero.ps1` 下载（~16MB）。

**预估**：Agent 2–3h

---

## 全站完成后 Storage 估算

| 模块 | 压缩后大小 |
|---|---|
| Projects（已完成） | ~6 MB |
| Photography | ~15–25 MB |
| Visual Works | ~8–12 MB |
| Field Notes | ~20–35 MB |
| Home Hero | ~0.5–1 MB |
| **合计** | **~50–80 MB**（Supabase 免费 1GB 内） |

---

## 给 Coding Agent 的执行约定

1. **一次只做一个 P 阶段**，P2 完成并验证后再开 P3
2. 每步结束：`npm run lint` → `npm run build` → `git commit`
3. 密钥只放 `.env.local`，不提交 GitHub
4. 媒体迁移用管理员账号登录脚本，不用 service_role
5. 大视频一律 Google Drive / 外链，不上传 Supabase
6. 前台必须保留静态回退（Supabase 未配置时仍能 build）

---

## 推荐下一步

**P1–P4 已完成。** Codex 请优先阅读 `docs/codex-handoff.md`，然后：

1. **收尾 commit**（用户明确要求时）— 分模块提交 P1–P4
2. **P5 Home/About** — 首页 Hero CMS 化（见下方 P5 节）
3. **Vercel 部署** — 配置环境变量并 push

本地开发、sparse-checkout、下载脚本等详见 **`docs/codex-handoff.md` 第 3–4 节**。
