# Qianna Wang — Personal Portfolio

Welcome. This is my personal portfolio website — a quiet space to share selected work and a bit of background on how I think about spatial research, visual storytelling, and digital products.

**Live site:** [https://qianna-site.vercel.app](https://qianna-site.vercel.app)

---

## For visitors

If you are here to browse rather than read code, start on the live site. The structure is simple:

| Section | What you'll find |
|--------|-------------------|
| **Home** | An opening image and short introduction |
| **Notes** | Essays and technical notes on tools, workflows, and experiments |
| **Projects** | Thesis and design research, architecture projects, and digital product work |
| **Traces** | Photography, drawings, and field notes — observation through images and sketches |
| **About** | Background, timeline, and how my work connects across disciplines |
| **Guestbook** | A small place to leave a message (messages are reviewed before appearing) |

The site is meant to be read slowly — more like a small archive or journal than a landing page. Projects and image collections link to deeper pages when you want more context.

---

## About this repository

This repo powers the public portfolio above. Content is managed through a private admin area at `/admin` (not linked from the public site). The stack is chosen to keep the front end fast and the editing workflow lightweight:

- **Next.js 16** · **React 19** · **TypeScript** · **Tailwind CSS v4**
- **Supabase** — content storage, auth, and media (`portfolio-media` bucket)
- **Vercel** — hosting, Analytics, and Speed Insights

Static fallbacks in `app/_data/` allow pages to render when Supabase is not configured locally.

---

## Local development

**Requirements:** Node.js 20+, npm

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

On Windows, you can also double-click `start.bat` or run `npm run start:site` to start the dev server and open the browser.

### Environment variables

Copy `.env.local.example` to `.env.local` (never commit secrets):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_ADMIN_EMAIL=
SUPABASE_ADMIN_PASSWORD=
```

### Useful commands

```bash
npm run lint
npm run build
npm run start:site
```

Media migration scripts (`migrate:home`, `migrate:photography`, etc.) upload assets from `public/` to Supabase Storage — see `docs/codex-handoff.md` for sparse-checkout and download script notes.

---

## Documentation

Implementation notes and handoff docs live in [`docs/`](docs/):

| Document | Description |
|----------|-------------|
| [`docs/codex-handoff.md`](docs/codex-handoff.md) | Main developer handoff — architecture, env, pitfalls |
| [`docs/exec-admin-about-analytics-2026-08-11.md`](docs/exec-admin-about-analytics-2026-08-11.md) | Admin sidebar, About profile photo, analytics |
| [`docs/experience-admin-sidebar-profile-crop.md`](docs/experience-admin-sidebar-profile-crop.md) | Reusable patterns for admin nav and image crop upload |
| [`docs/exec-site-ia-guestbook-2026-08-04.md`](docs/exec-site-ia-guestbook-2026-08-04.md) | Homepage structure and guestbook |
| [`docs/cms-migration-checklist.md`](docs/cms-migration-checklist.md) | Supabase CMS migration checklist |

Admin password reset: `/admin/login` → *Forgot password?* — configure Supabase redirect URLs as described in `docs/supabase-cms-改造记录.md`.

---

## Rights

All portfolio content — images, writing, drawings, and project material — belongs to **Qianna Wang** unless otherwise noted. Please do not reuse creative work from this site or repository without permission.
