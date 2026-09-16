import Link from "next/link";
import type { NoteListItem } from "@/app/_data/notes";
import type { SiteNavigationItem } from "@/lib/site/queries";
import Reveal from "@/app/_components/Reveal";

interface EditorialNotesSectionProps {
  notes: NoteListItem[];
  navigationSection: SiteNavigationItem;
}

function formatNoteDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}`;
  }
  return dateStr.slice(0, 10);
}

export default function EditorialNotesSection({
  notes,
  navigationSection,
}: EditorialNotesSectionProps) {
  return (
    <section className="py-16 md:py-20">
      <Reveal>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.22em] text-stone-500 uppercase">
              Essays & Field Discourse · 03
            </p>
            <h2 className="mt-1 font-serif text-3xl text-stone-900 md:text-4xl">
              {navigationSection.title || "Notes"}
            </h2>
          </div>
          <Link
            href={navigationSection.href || "/notes"}
            className="group inline-flex items-center gap-1.5 text-sm text-stone-600 transition-colors hover:text-stone-900"
          >
            <span>{navigationSection.label || "View all notes"}</span>
            <span className="inline-block no-underline transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </Reveal>

      <div className="mt-10 divide-y divide-stone-200/80">
        {notes.length === 0 ? (
          <Reveal delay={80}>
            <p className="py-8 text-sm text-stone-600">
              New writing and working notes will appear here once published.
            </p>
          </Reveal>
        ) : (
          notes.map((note, index) => {
            const indexFormatted = String(index + 1).padStart(2, "0");
            const formattedDate = formatNoteDate(note.publishedAt);

            return (
              <Reveal key={note.slug} delay={80 + index * 60}>
                <Link
                  href={`/notes/${note.slug}`}
                  className="group block py-7 transition-colors"
                >
                  {/* Title Row */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-normal text-stone-400">
                      [{indexFormatted}]
                    </span>
                    <h3 className="font-serif text-xl text-stone-900 transition-colors group-hover:text-stone-700 md:text-2xl">
                      {note.title}
                    </h3>
                  </div>

                  {/* Excerpt */}
                  {note.excerpt ? (
                    <p className="mt-2.5 text-sm leading-6 text-stone-600 sm:pl-7">
                      {note.excerpt}
                    </p>
                  ) : null}

                  {/* Tags & Date Row */}
                  <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 sm:pl-7">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {note.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-stone-200/60 px-2 py-0.5 text-xs text-stone-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {formattedDate ? (
                      <span className="text-xs text-stone-400">
                        {formattedDate}
                      </span>
                    ) : null}
                  </div>
                </Link>
              </Reveal>
            );
          })
        )}
      </div>
    </section>
  );
}
