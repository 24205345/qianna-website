import FieldNotesList from "@/app/_components/traces/FieldNotesList";
import { getFieldNotesTripsFallback } from "@/app/_data/field-note-details";
import { getFieldNotesList } from "@/lib/field-notes/queries";
import {
  getSiteNavigationItem,
  getSiteNavigationItems,
} from "@/lib/site/queries";

export default async function FieldNotesPage() {
  const [fieldTrips, navigationItems] = await Promise.all([
    getFieldNotesList(getFieldNotesTripsFallback()),
    getSiteNavigationItems(),
  ]);
  const pageCopy = getSiteNavigationItem(navigationItems, "field-notes");

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <div className="mb-12">
          <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">{pageCopy.label}</p>
          <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">{pageCopy.title}</h1>
          <p className="mt-6 max-w-3xl leading-8 text-stone-500">{pageCopy.description}</p>
        </div>

        <FieldNotesList trips={fieldTrips} />
      </main>
    </div>
  );
}
