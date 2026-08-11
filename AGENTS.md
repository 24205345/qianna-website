# Agent 指南 — qianna-website

个人作品集站点（[www.qiannawang.com](https://www.qiannawang.com)）。对外展示作品与背景；内容经私有 `/admin` CMS 管理。**详细交接见 [`docs/codex-handoff.md`](docs/codex-handoff.md)。**

---

## Next.js（必读）

<!-- BEGIN:nextjs-agent-rules -->
This is NOT the Next.js you know. APIs, conventions, and file structure may differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

- 动态路由：`params` / `searchParams` 可能是 **Promise**，需 `await`
- Server Actions：`"use server"` 文件 **不要 re-export** 其他 server action
- `useSearchParams` 的 Client 组件需外层 **Suspense**

---

## 项目约束

| 项 | 约定 |
|----|------|
| 栈 | Next.js 16 · React 19 · TS · Tailwind v4 · Supabase · Vercel |
| 前台气质 | 安静、编辑感、stone 暖灰；`max-w-5xl`；不要 landing-page 式花哨 |
| Admin UI | **英文**；左侧边栏导航（`AdminSidebar`） |
| 数据 | Supabase 优先；`isSupabaseConfigured()` 失败时回退 `app/_data/*` |
| 媒体 | Bucket `portfolio-media`；大视频用 Google Drive 外链，不上传 Storage |
| Git | **仅用户明确要求时** commit / push |
| Shell | Windows PowerShell — **不要用 `&&`**，用 `;` 或分行 |

---

## 改代码前先读

1. **[`docs/codex-handoff.md`](docs/codex-handoff.md)** — 模块进度、路由、架构、Windows 开发、常见坑
2. **[`docs/README.md`](docs/README.md)** — 文档索引（按任务找 exec / experience）
3. 动到某模块时，对照 **[`docs/cms-migration-checklist.md`](docs/cms-migration-checklist.md)** 相关段落

---

## 架构速记（新模块 / 改 CMS）

```
supabase/migrations/000X_*.sql
app/_data/*.ts              ← 静态回退
lib/<module>/queries.ts     ← isSupabaseConfigured + fallback
app/<module>/page.tsx
app/admin/<module>/**       ← Server Actions + 表单
```

Singleton 内容（Hero、About）：`singleton_key` 表 + `/admin/*` 表单；图片上传参考 `app/admin/site/actions.ts` 或 About 的 `ProfilePhotoCropField`。

---

## 高频文件

| 用途 | 路径 |
|------|------|
| 首页 | `app/page.tsx` |
| Admin 布局 | `app/admin/layout.tsx`, `_components/AdminSidebar.tsx` |
| 项目分类 | `lib/projects/categories.ts` |
| 站点 / 导航文案 | `lib/site/queries.ts`, `app/_data/site-navigation.ts` |
| About | `lib/about/queries.ts`, `app/admin/about/` |
| 埋点 | `app/_components/analytics/PageViewTracker.tsx` |

---

## 完成后（复杂改动）

1. `npm run lint`；改过 React/TS 时注意类型与语法
2. 若改 schema：补 `supabase/migrations/` 并说明是否需 MCP / SQL Editor 执行
3. **值得沉淀时**写文档（见 [`docs/README.md`](docs/README.md) §维护约定）
4. 不主动 commit，除非用户要求

---

## 刻意不做

- 不引入 **Trellis**（本项目用轻量 `docs/` 体系，见 `docs/README.md`）
- 不恢复顶栏 Admin 导航或 Projects 下冗余 **All** 子项
- About 个人照片 **仅 `/about` 展示**，首页 About 卡片不放图
- 不提交 `.env.local`、`.cursor/`、`.next*` 日志
