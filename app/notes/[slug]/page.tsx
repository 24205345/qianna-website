import { notFound } from "next/navigation";
import { extractTocFromMarkdown } from "@/lib/notes/markdown";
import { getNoteBySlug } from "@/lib/notes/queries";
import NoteMarkdown from "../_components/NoteMarkdown";
import NoteToc from "../_components/NoteToc";

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

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);
  if (!note) notFound();

  const toc = extractTocFromMarkdown(note.bodyMarkdown);
  const dateLabel = formatDate(note.publishedAt);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">Note</p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-stone-900 md:text-5xl">
          {note.title}
        </h1>
        {dateLabel ? (
          <p className="mt-4 text-sm text-stone-400">{dateLabel}</p>
        ) : null}
        {note.excerpt ? (
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-500">
            {note.excerpt}
          </p>
        ) : null}

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-start">
          <article>
            <NoteMarkdown markdown={note.bodyMarkdown} />
          </article>

          <aside className="lg:sticky lg:top-24">
            <details className="rounded-xl border border-stone-200 bg-white/70 p-4 lg:hidden">
              <summary className="cursor-pointer text-sm text-stone-600">
                Contents
              </summary>
              <div className="mt-4">
                <NoteToc headings={toc} showTitle={false} />
              </div>
            </details>
            <div className="hidden lg:block">
              <NoteToc headings={toc} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
