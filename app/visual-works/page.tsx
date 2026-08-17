import DrawingsSections from "@/app/_components/traces/DrawingsSections";
import type { Metadata } from "next";
import { visualWorkSections } from "@/app/_data/visual-works";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getSiteNavigationItem,
  getSiteNavigationItems,
} from "@/lib/site/queries";
import { getVisualWorksPageData } from "@/lib/visual-works/queries";

export async function generateMetadata(): Promise<Metadata> {
  const navigationItems = await getSiteNavigationItems();
  const section = getSiteNavigationItem(navigationItems, "visual-works");

  return buildPageMetadata({
    title: section.title,
    description: section.description,
    path: "/visual-works",
  });
}

export default async function VisualWorksPage() {
  const [categories, navigationItems] = await Promise.all([
    getVisualWorksPageData(visualWorkSections),
    getSiteNavigationItems(),
  ]);
  const pageCopy = getSiteNavigationItem(navigationItems, "visual-works");

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <div className="mb-12">
          <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">{pageCopy.label}</p>
          <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">{pageCopy.title}</h1>
          <p className="mt-4 leading-7 text-stone-500">
            {pageCopy.description}
          </p>
        </div>

        <DrawingsSections categories={categories} />
      </main>
    </div>
  );
}
