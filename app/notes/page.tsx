import Link from "next/link";
import type { Metadata } from "next";
import { getSiteNavigationItem, getSiteNavigationItems } from "@/lib/site/queries";
import { getPublishedNotes } from "@/lib/notes/queries";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const navigationItems = await getSiteNavigationItems();
  const section = getSiteNavigationItem(navigationItems, "notes-preview");

  return buildPageMetadata({
    title: section.title,
    description: section.description,
    path: "/notes",
  });
}

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function NotesPage() {
  const [notes, navigationItems] = await Promise.all([
    getPublishedNotes(),
    getSiteNavigationItems(),
  ]);
  const section = getSiteNavigationItem(navigationItems, "notes-preview");

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">Notes</p>
        <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">
          {section.title}
        </h1>
        {section.description ? (
          <p className="mt-4 max-w-2xl leading-7 text-stone-500">
            {section.description}
          </p>
        ) : null}

        <div className="mt-14 flex flex-col gap-8">
          {notes.length === 0 ? (
            <p className="text-sm text-stone-400">No notes published yet.</p>
          ) : (
            notes.map((note) => {
              const dateLabel = formatDate(note.publishedAt);
              return (
                <Link
                  key={note.slug}
                  href={`/notes/${note.slug}`}
                  className="group border-b border-stone-200/80 pb-8 last:border-0"
                >
                  {dateLabel ? (
                    <p className="text-xs tracking-[0.16em] text-stone-400 uppercase">
                      {dateLabel}
                    </p>
                  ) : null}
                  <h2 className="mt-2 font-serif text-2xl text-stone-900 transition-colors group-hover:text-stone-700 md:text-3xl">
                    {note.title}
                  </h2>
                  {note.excerpt ? (
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500">
                      {note.excerpt}
                    </p>
                  ) : null}
                </Link>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
