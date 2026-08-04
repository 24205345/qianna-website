import DrawingsSections from "@/app/_components/traces/DrawingsSections";
import FieldNotesList from "@/app/_components/traces/FieldNotesList";
import PhotographySections from "@/app/_components/traces/PhotographySections";
import { getFieldNotesTripsFallback } from "@/app/_data/field-note-details";
import { photographySections } from "@/app/_data/photography";
import {
  normalizeTracesTab,
  type TracesTab,
} from "@/app/_data/site-navigation";
import { visualWorkSections } from "@/app/_data/visual-works";
import { getFieldNotesList } from "@/lib/field-notes/queries";
import { getPhotographyPageData } from "@/lib/photography/queries";
import {
  getSiteNavigationGroup,
  getSiteNavigationItem,
  getSiteNavigationItems,
} from "@/lib/site/queries";
import { getVisualWorksPageData } from "@/lib/visual-works/queries";
import TracesTabNav from "./_components/TracesTabNav";

const TAB_COPY: Record<TracesTab, string> = {
  photography: "photography",
  drawings: "visual-works",
  "field-notes": "field-notes",
};

export default async function TracesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = normalizeTracesTab(tab);

  const [
    navigationItems,
    photographyCollections,
    drawingCategories,
    fieldTrips,
  ] = await Promise.all([
    getSiteNavigationItems(),
    getPhotographyPageData(photographySections),
    getVisualWorksPageData(visualWorkSections),
    getFieldNotesList(getFieldNotesTripsFallback()),
  ]);

  const tracesSection = getSiteNavigationItem(navigationItems, "traces-preview");
  const traceTabs = getSiteNavigationGroup(navigationItems, "traces_category");
  const activeCopy = getSiteNavigationItem(
    navigationItems,
    TAB_COPY[activeTab]
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <div className="mb-4">
          <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">
            {tracesSection.title}
          </p>
          <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">
            {activeCopy.title}
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-stone-500">
            {tracesSection.description}
          </p>
        </div>

        <TracesTabNav tabs={traceTabs} activeTab={activeTab} />

        <div className="mt-10">
          <p className="mb-8 text-sm leading-6 text-stone-500">
            {activeCopy.description}
          </p>

          {activeTab === "photography" ? (
            <PhotographySections collections={photographyCollections} />
          ) : null}
          {activeTab === "drawings" ? (
            <DrawingsSections categories={drawingCategories} />
          ) : null}
          {activeTab === "field-notes" ? (
            <FieldNotesList trips={fieldTrips} />
          ) : null}
        </div>
      </main>
    </div>
  );
}
