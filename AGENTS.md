# Agent 指南

个人作品集 · [www.qiannawang.com](https://www.qiannawang.com) · Supabase CMS + Next.js 16

**项目细节一律查 [`docs/codex-handoff.md`](docs/codex-handoff.md)**；文档索引见 [`docs/README.md`](docs/README.md)。

---

## Next.js

<!-- BEGIN:nextjs-agent-rules -->
This is NOT the Next.js you know. Read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

- `params` / `searchParams` 可能是 Promise → `await`
- `"use server"` 文件不要 re-export 其他 server action
- `useSearchParams` 需外层 Suspense

---

## 通用约定

- 数据：Supabase + `app/_data/*` 静态回退（`isSupabaseConfigured()`）
- 改 React/TS 后跑 `npm run lint`
- **仅用户要求时** commit / push；不提交 `.env.local`
- Windows PowerShell 不用 `&&`
