"use client";

import type { TocHeading } from "@/lib/notes/markdown";

interface NoteTocProps {
  headings: TocHeading[];
  showTitle?: boolean;
  emptyLabel?: string;
}

export default function NoteToc({
  headings,
  showTitle = true,
  emptyLabel = "Add ## headings to build the table of contents",
}: NoteTocProps) {
  return (
    <nav aria-label="Table of contents" className="text-sm">
      {showTitle ? (
        <p className="text-[10px] tracking-[0.22em] text-stone-500 uppercase">
          Contents
        </p>
      ) : null}

      {headings.length === 0 ? (
        <p className={`${showTitle ? "mt-4" : ""} text-xs leading-5 text-stone-400`}>
          {emptyLabel}
        </p>
      ) : (
        <ul
          className={`${showTitle ? "mt-4" : ""} space-y-2.5 border-l border-stone-200`}
        >
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={
                  heading.level === 2
                    ? "block pl-3 text-stone-600 transition-colors hover:text-stone-900"
                    : "block pl-6 text-stone-500 transition-colors hover:text-stone-800"
                }
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
