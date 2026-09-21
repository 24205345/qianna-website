# Agent 指南

个人作品集 · [www.qiannawang.com](https://www.qiannawang.com) · Supabase CMS + Next.js 16

**项目细节查 [`docs/developer-guide.md`](docs/developer-guide.md)**；**架构见 [`docs/architecture.md`](docs/architecture.md)**；文档索引见 [`docs/README.md`](docs/README.md)。

---

## Next.js

<!-- BEGIN:nextjs-agent-rules -->
This is NOT the Next.js you know. Read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

- `params` / `searchParams` 可能是 Promise → `await`
- `"use server"` 文件不要 re-export 其他 server action
- `useSearchParams` 需外层 Suspense

---

## 设计规范与呈现模式（核心约束）

- **必须参考网站既有风格和呈现模式**：新增模块或做修改的时候，严禁脱离全站既有设计语言自行臆想设计。必须严格对照首页与全站已确立的杂志策展风格（Curated Editorial Style）及现有典型组件（如 `FeaturedProjectsSection`、`VisualFootprintsSection`、`EditorialNotesSection`）。
- **极简双字体与无等宽约束**：全站首页严禁使用 `font-mono`（消除等宽代码字体的视觉杂波）；大标题统一为精致衬线体 `font-serif`，正文、标签、小角标统一为无衬线体 `font-sans`。
- **板块叙事动线规范**：
  - 眉标格式统一：`Category / Theme · 0X`（`text-xs tracking-[0.22em] text-stone-500 uppercase`），主标题统一为 `mt-1 font-serif text-3xl md:text-4xl text-stone-900`。
  - 分类横轨统一采用带底部分割线的 **Sub-rail 模式**（`border-b border-stone-200/80`）：左侧分类项为 `-mb-px border-b-2 pb-3 text-sm`（激活项为深黑线 `border-stone-900 font-medium text-stone-900`，非激活项为灰色且 hover 悬停指示），右侧对齐 `View all ... →`（严禁默认下划线，hover 仅平滑右移 `translate-x-0.5`）。
- **视觉去噪与控件约束**：严禁私自引入深色药丸胶囊按钮（如黑底圆角按钮）、emoji 图标装饰与嵌套多层复杂容器；卡片统一采用 `rounded-2xl border border-stone-200/80 bg-stone-100/50` 及 `hover:border-stone-300 hover:bg-stone-100/90`，标签统一采用 `rounded-md bg-stone-200/60 px-2 py-0.5 text-xs text-stone-600`。

---

## 通用约定

- 数据：Supabase + `app/_data/*` 静态回退（`isSupabaseConfigured()`）
- 改 React/TS 后跑 `npm run lint`
- **仅用户要求时** commit / push；不提交 `.env.local`
- Windows PowerShell 不用 `&&`

