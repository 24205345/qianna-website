"use client";

import { useMemo, useState } from "react";
import type { NoteDetail } from "@/app/_data/notes";
import { extractTocFromMarkdown } from "@/lib/notes/markdown";
import NoteMarkdown from "./NoteMarkdown";
import NoteToc from "./NoteToc";

type Lang = "en" | "zh";

interface NoteDetailViewProps {
  note: NoteDetail;
}

function formatDate(value: string | null, lang: Lang): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function NoteDetailView({ note }: NoteDetailViewProps) {
  const [lang, setLang] = useState<Lang>("en");

  const title = lang === "en" ? note.titleEn : note.titleZh;
  const excerpt = lang === "en" ? note.excerptEn : note.excerptZh;
  const body = lang === "en" ? note.bodyMarkdownEn : note.bodyMarkdownZh;
  const toc = useMemo(() => extractTocFromMarkdown(body), [body]);
  const dateLabel = formatDate(note.publishedAt, lang);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <main className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10 md:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">
            Note
          </p>
          <div
            className="inline-flex rounded-md border border-stone-300 bg-white p-0.5 text-xs"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => setLang("en")}
              className={
                lang === "en"
                  ? "rounded px-3 py-1.5 font-medium text-stone-900 bg-stone-100"
                  : "rounded px-3 py-1.5 text-stone-500 transition-colors hover:text-stone-800"
              }
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang("zh")}
              className={
                lang === "zh"
                  ? "rounded px-3 py-1.5 font-medium text-stone-900 bg-stone-100"
                  : "rounded px-3 py-1.5 text-stone-500 transition-colors hover:text-stone-800"
              }
            >
              中文
            </button>
          </div>
        </div>

        <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-stone-900 md:text-5xl">
          {title}
        </h1>
        {dateLabel ? (
          <p className="mt-4 text-sm text-stone-400">{dateLabel}</p>
        ) : null}
        {excerpt ? (
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-500">
            {excerpt}
          </p>
        ) : null}

        <div className="mt-12 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
          <aside className="order-2 lg:order-1">
            <div className="rounded-xl border border-stone-200 bg-white/80 p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
              <NoteToc
                headings={toc}
                showTitle
                emptyLabel={
                  lang === "zh"
                    ? "添加二级标题后将显示目录"
                    : "Add ## headings to build the table of contents"
                }
              />
            </div>
          </aside>

          <article className="order-1 min-w-0 lg:order-2">
            <NoteMarkdown markdown={body} />
          </article>
        </div>
      </main>
    </div>
  );
}
