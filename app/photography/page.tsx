import PhotographySections from "@/app/_components/traces/PhotographySections";
import PageViewTracker from "@/app/_components/analytics/PageViewTracker";
import type { Metadata } from "next";
import { photographySections } from "@/app/_data/photography";
import { getPhotographyPageData } from "@/lib/photography/queries";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getSiteNavigationItem,
  getSiteNavigationItems,
} from "@/lib/site/queries";

export async function generateMetadata(): Promise<Metadata> {
  const navigationItems = await getSiteNavigationItems();
  const section = getSiteNavigationItem(navigationItems, "photography");

  return buildPageMetadata({
    title: section.title,
    description: section.description,
    path: "/photography",
  });
}

export default async function PhotographyPage() {
  const [collections, navigationItems] = await Promise.all([
    getPhotographyPageData(photographySections),
    getSiteNavigationItems(),
  ]);
  const pageCopy = getSiteNavigationItem(navigationItems, "photography");

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <PageViewTracker contentType="page" contentSlug="photography" />
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <div className="mb-12">
          <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">{pageCopy.label}</p>
          <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">{pageCopy.title}</h1>
          <p className="mt-4 leading-7 text-stone-500">
            {pageCopy.description}
          </p>
        </div>

        <PhotographySections collections={collections} />
      </main>
    </div>
  );
}
