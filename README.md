# Qianna Wang Portfolio

Personal portfolio website for Qianna Wang, presenting selected work across urban design, architecture research, photography, visual works, and field notes.

## Live Site

Visit the portfolio here:

[https://qianna-site.vercel.app](https://qianna-site.vercel.app)

## About the Portfolio

This site is designed as a quiet editorial space for spatial research, visual storytelling, and observation-based creative work. It brings together academic projects, design research, image collections, sketches, travel notes, and landscape studies in one browsable archive.

## Explore

- **Projects**: thesis research, architecture projects, and digital product work.
- **Photography**: urban frames, movement, light, portraits, and place-based observations.
- **Visual Works**: drawings, sketches, pen-and-wash studies, and watercolor pieces.
- **Field Notes**: hiking journeys, outdoor routes, and landscape observations.
- **About**: background, approach, and the way research informs design decisions.

## Built With

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Supabase](https://supabase.com/) for the lightweight private CMS
- [Vercel](https://vercel.com/) for deployment

## Development

Install dependencies and start the local server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For CMS-backed content, configure Supabase environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_ADMIN_EMAIL=
SUPABASE_ADMIN_PASSWORD=
```

Common scripts:

```bash
npm run lint
npm run build
npm run start:site
```

## Notes

The public portfolio is backed by a private `/admin` CMS for managing projects, media collections, field notes, homepage text, and site navigation copy. Local static fallbacks are included so the site can still render when Supabase is not configured.

**Admin password reset:** use `/admin/login` → *Forgot password?*, or configure Supabase Redirect URLs (`/auth/callback`, `/auth/confirm`) as documented in `docs/supabase-cms-改造记录.md` §4.5.

Implementation notes live in `docs/`.

## Rights

All portfolio content, images, writing, drawings, and project material belong to Qianna Wang unless otherwise noted. Please do not reuse creative work from this repository without permission.
