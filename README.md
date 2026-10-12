# Qianna Wang — Personal Portfolio

Welcome. This is my personal portfolio website — a quiet space to share selected work and a bit of background on how I think about spatial research, visual storytelling, and digital products.

**Live site:** [https://www.qiannawang.com](https://www.qiannawang.com)  
*(Also reachable at [qiannawang.com](https://qiannawang.com) — redirects to www.)*

---

## Explore

| Section | What you'll find |
|--------|-------------------|
| **Home** | An opening image, selected projects, traces, notes, and creative workflows |
| **Notes** | Essays and technical notes on tools, workflows, and experiments |
| **Projects** | Thesis and design research, architecture projects, and digital product work |
| **Traces** | Photography, drawings, and field notes — observation through images and sketches |
| **Workbench** | Creative pipelines, tools, and resources behind the work |
| **About** | Background, timeline, and how my work connects across disciplines |
| **Guestbook** | A small place to leave a message (messages are reviewed before appearing) |

The site is meant to be read slowly — more like a small archive or journal than a landing page. Projects and image collections link to deeper pages when you want more context.

---

## Built with

Next.js 16.2.1, React 19.2.4, TypeScript, and Tailwind CSS v4. Vercel hosts the site; Supabase provides Postgres and authentication for the private CMS. Public media is served from Cloudflare R2 through `media.qiannawang.com`. Static media is resolved through a verified manifest, with local files retained for rollback. External video links are also supported.

The R2 migration completed on October 10, 2026: 160 files were verified and 159 database rows updated. Supabase source files are retained for rollback. The Workbench table is now deployed with two pipelines; edits require the server-managed CMS admin role. The existing CMS account was authorized on October 12, 2026, and authenticated upload and save checks passed against the local code and production database. Another 182 static files (574.01 MiB) have been copied and verified through the public domain. Direct R2 uploads and the static-media rollout are tracked in the [completion record](docs/exec-cms-storage-completion-2026-10-10.md); these code changes have not yet been deployed.

The code includes responsive image sizes matched to the page containers, lazy-loaded Notes images, and batch photo queries. See the [image performance implementation record](docs/exec-image-performance-p1-2026-10-10.md) for validation and rollout status.

Home section covers can now be edited individually from Site Settings, with instant preview and restoration of the original cover. The database migrations were applied on October 12, 2026; browser upload, refresh, cross-section drafts, and restore checks passed against local code and the production database/R2. See the [implementation record](docs/exec-site-featured-images-2026-10-12.md); code rollout is pending.

## Development

Use Node.js 24, install dependencies with `npm ci`, and copy `.env.local.example` to `.env.local`. Follow the [developer guide](docs/developer-guide.md#3-本地开发windows) to configure Supabase and media storage before running `npm run dev`.

```powershell
npm run lint
npx tsc --noEmit
npm run test:media
npm run test:performance
npm run test:uploads
npm run test:site-images
npm run test:static-media
npm run build
```

See the [documentation index](docs/README.md), [architecture](docs/architecture.md), and [migration execution record](docs/exec-mcp-storage-2026-10-10.md). Keep credentials and local rollback journals outside Git.

---

## Rights

All portfolio content — images, writing, drawings, and project material — belongs to **Qianna Wang** unless otherwise noted. Please do not reuse creative work from this site or repository without permission.
