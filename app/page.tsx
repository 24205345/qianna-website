import Link from "next/link";
import type { Metadata } from "next";
import PageViewTracker from "@/app/_components/analytics/PageViewTracker";
import HeroImageDistortionClient from "@/app/_components/HeroImageDistortionClient";
import GuestbookSection from "@/app/_components/guestbook/GuestbookSection";
import { getAboutPageContent } from "@/lib/about/queries";
import {
  getApprovedGuestbookMessageCount,
  getApprovedGuestbookMessages,
} from "@/lib/guestbook/queries";
import { getLatestNotes } from "@/lib/notes/queries";
import {
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
} from "@/lib/seo/constants";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getSiteNavigationGroup,
  getSiteNavigationItem,
  getSiteNavigationItems,
  getSiteSettings,
} from "@/lib/site/queries";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildPageMetadata({
    title: settings.heroTitle || DEFAULT_SITE_TITLE,
    description: settings.heroSubtitle || DEFAULT_SITE_DESCRIPTION,
    path: "/",
  });
}

export default async function Home() {
  const [siteSettings, navigationItems, latestNotes, aboutContent, guestbookPreview, guestbookTotal] =
    await Promise.all([
      getSiteSettings(),
      getSiteNavigationItems(),
      getLatestNotes(3),
      getAboutPageContent(),
      getApprovedGuestbookMessages(3),
      getApprovedGuestbookMessageCount(),
    ]);
  const notesSection = getSiteNavigationItem(navigationItems, "notes-preview");
  const projectsSection = getSiteNavigationItem(
    navigationItems,
    "projects-preview"
  );
  const tracesSection = getSiteNavigationItem(navigationItems, "traces-preview");
  const aboutSection = getSiteNavigationItem(navigationItems, "about");
  const projectCategories = getSiteNavigationGroup(
    navigationItems,
    "project_category"
  );
  const traceCategories = getSiteNavigationGroup(
    navigationItems,
    "traces_category"
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <PageViewTracker contentType="page" contentSlug="home" />
      <header className="relative min-h-screen w-full overflow-hidden">
        <HeroImageDistortionClient
          imageUrl={siteSettings.heroImageUrl}
          alt={siteSettings.heroImageAlt}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/42 via-black/18 to-black/8" />
        <div className="pointer-events-none relative z-10 flex min-h-screen items-end">
          <div className="w-full px-4 pb-12 md:px-8 md:pb-16 lg:px-12 lg:pb-18">
            <h1 className="font-serif text-4xl text-stone-50 md:text-6xl">
              {siteSettings.heroTitle}
            </h1>
            <p className="mt-4 ml-1 max-w-2xl text-base leading-7 text-stone-100 md:text-lg">
              {siteSettings.heroSubtitle}
            </p>
            <a
              href="#content"
              className="pointer-events-auto mt-4 ml-1 inline-flex w-fit text-[15px] text-stone-50/80 underline decoration-stone-50/40 underline-offset-4 transition-colors hover:text-stone-50/90 hover:decoration-stone-50/55"
            >
              {siteSettings.heroCtaLabel} →
            </a>
          </div>
        </div>
      </header>

      <main
        id="content"
        className="mx-auto w-full max-w-5xl px-6 py-12 md:px-10 md:py-16"
      >
        <section className="py-14 md:py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl text-stone-900 md:text-4xl">
              {notesSection.title}
            </h2>
            <Link
              href={notesSection.href}
              className="shrink-0 text-sm text-stone-600 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-900"
            >
              {notesSection.label}
            </Link>
          </div>
          <div className="mt-8 flex flex-col gap-6">
            {latestNotes.length === 0 ? (
              <p className="text-sm text-stone-400">
                New notes will appear here once published.
              </p>
            ) : (
              latestNotes.map((note) => (
                <Link
                  key={note.slug}
                  href={`/notes/${note.slug}`}
                  className="group border-b border-stone-200/70 pb-6 last:border-0 last:pb-0"
                >
                  <h3 className="font-serif text-xl text-stone-900 transition-colors group-hover:text-stone-700 md:text-2xl">
                    {note.title}
                  </h3>
                  {note.excerpt ? (
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                      {note.excerpt}
                    </p>
                  ) : null}
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="py-14 md:py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl text-stone-900 md:text-4xl">
              {projectsSection.title}
            </h2>
            <Link
              href={projectsSection.href}
              className="text-sm text-stone-600 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-900"
            >
              {projectsSection.label}
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {projectCategories.map((item) => (
              <Link
                key={item.itemKey}
                href={item.href}
                className="group rounded-2xl border border-stone-200/80 bg-stone-100/70 p-5 transition-colors hover:border-stone-300 hover:bg-stone-100"
              >
                <h3 className="font-serif text-2xl text-stone-900 transition-colors group-hover:text-stone-700">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-stone-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="py-14 md:py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl text-stone-900 md:text-4xl">
              {tracesSection.title}
            </h2>
            <Link
              href={tracesSection.href}
              className="shrink-0 text-sm text-stone-600 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-900"
            >
              {tracesSection.label}
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {traceCategories.map((item) => (
              <Link
                key={item.itemKey}
                href={item.href}
                className="group rounded-2xl border border-stone-200/80 bg-stone-100/70 p-5 transition-colors hover:border-stone-300 hover:bg-stone-100"
              >
                <p className="text-xs tracking-[0.18em] text-stone-500 uppercase">
                  {item.label}
                </p>
                <h3 className="mt-3 font-serif text-2xl text-stone-900 transition-colors group-hover:text-stone-700">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-stone-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section id="about-me" className="py-14 md:py-16">
          <h2 className="font-serif text-3xl text-stone-900 md:text-4xl">
            About Me
          </h2>
          <div className="mt-8 flex flex-col gap-6">
            <Link
              href={aboutSection.href}
              className="group border-b border-stone-200/70 pb-6 last:border-0 last:pb-0"
            >
              <h3 className="font-serif text-xl text-stone-900 transition-colors group-hover:text-stone-700 md:text-2xl">
                {aboutContent.pageTitle}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                {aboutContent.pageDescription}
              </p>
            </Link>
          </div>
          <GuestbookSection
            previewMessages={guestbookPreview}
            totalApprovedCount={guestbookTotal}
          />
        </section>
      </main>

      <footer className="border-t border-stone-300/70 bg-stone-300/35">
        <div className="mx-auto max-w-5xl px-6 pt-12 pb-6 md:px-10 md:pt-14">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_1fr] md:gap-14">
            <div>
              <h2 className="font-serif text-xl text-stone-900">Qianna Wang</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
                Urban design, visual storytelling, and spatial observation.
              </p>
            </div>

            <div className="grid gap-4 text-xs leading-6 text-stone-600">
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-stone-500/80">
                  Email
                </p>
                <a
                  href="mailto:qianqianwang1099@gmail.com"
                  className="text-sm text-stone-700 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-900"
                >
                  qianqianwang1099@gmail.com
                </a>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-stone-500/80">
                  Location
                </p>
                <p className="text-sm text-stone-700">Shenzhen, China</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-stone-500/80">
                  Availability
                </p>
                <p className="text-sm text-stone-700">
                  Open to remote and international opportunities
                </p>
              </div>
            </div>
          </div>
          <p className="mt-10 text-center text-[10px] tracking-[0.08em] text-stone-500/75">
            &copy; 2026 Qianna Wang
          </p>
        </div>
      </footer>
    </div>
  );
}
