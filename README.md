# Qianna Wang Portfolio

A personal portfolio website for Qianna Wang, focused on urban design, architecture research, photography, visual works, and field notes. The site is built with Next.js and backed by a lightweight Supabase CMS so portfolio content can be managed from a private admin interface.

## What This Site Includes

- A full-screen editorial homepage with project category entry points.
- Project listing and dynamic project detail pages.
- Photography, visual works, and field notes sections.
- A private `/admin` area for managing CMS content.
- Supabase-backed data with local static fallbacks, so the public site can still render when Supabase is not configured.

## Tech Stack

- [Next.js](https://nextjs.org/) 16 App Router
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Supabase](https://supabase.com/) Database, Auth, and Storage
- [Sharp](https://sharp.pixelplumbing.com/) for media migration scripts

## Project Structure

```text
app/                         Next.js routes and UI
app/admin/                   Private CMS pages
app/_data/                   Static fallback data
lib/*/queries.ts             Supabase query helpers with fallbacks
supabase/migrations/         Database schema migrations
scripts/                     Media download and migration scripts
docs/                        Implementation notes and handoff docs
```

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.local.example .env.local
```

Fill in the Supabase values if you want CMS-backed content:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_ADMIN_EMAIL=
SUPABASE_ADMIN_PASSWORD=
```

Only use the public anon key in `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Never place a Supabase `service_role` key in a client-exposed variable.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev                  # Start the local dev server
npm run start:site           # Windows helper: start dev server and open browser
npm run lint                 # Run ESLint
npm run build                # Create a production build
npm run migrate:media        # Upload project media to Supabase
npm run migrate:photography  # Upload photography media and records
npm run migrate:visual-works # Upload visual works media and records
npm run migrate:field-notes  # Upload field notes media and records
```

## Supabase Setup

The schema lives in `supabase/migrations/` and should be applied in order:

```text
0001_init.sql
0002_photography.sql
0003_visual_works.sql
0004_field_notes.sql
```

The public storage bucket used by the site is:

```text
portfolio-media
```

The admin area relies on Supabase Auth. Create the admin user manually in Supabase and disable public sign-ups if this is a personal portfolio deployment.

## Media Notes

Large original media files are not all stored directly in this working tree. If local images are missing, run the relevant download script first:

```powershell
.\scripts\download-home-hero.ps1
.\scripts\download-photography-media.ps1
.\scripts\download-visual-works-media.ps1
.\scripts\download-field-notes-media.ps1
```

Then run the matching migration script if you want to upload media into Supabase Storage.

## Deployment

The project is designed to deploy on Vercel or any platform that supports Next.js.

Required production environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Add the admin-only migration credentials only in trusted local environments. They are not required for the public website to render.

## Documentation

For implementation details, see:

- `docs/codex-handoff.md` for development context and current CMS status.
- `docs/cms-migration-checklist.md` for migration progress.
- `docs/supabase-cms-改造记录.md` for notes and lessons learned.

## License

This repository contains a personal portfolio and original creative work. Please do not reuse images, writing, or project content without permission.
