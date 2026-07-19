"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { headingIdFromText } from "@/lib/notes/markdown";

interface NoteMarkdownProps {
  markdown: string;
}

export default function NoteMarkdown({ markdown }: NoteMarkdownProps) {
  const usedIds = new Map<string, number>();

  return (
    <div className="note-prose space-y-5 text-base leading-8 text-stone-600">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => {
            const text = String(children);
            const id = headingIdFromText(text, usedIds);
            return (
              <h2
                id={id}
                className="scroll-mt-24 pt-4 font-serif text-3xl text-stone-900"
              >
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const text = String(children);
            const id = headingIdFromText(text, usedIds);
            return (
              <h3
                id={id}
                className="scroll-mt-24 pt-2 font-serif text-2xl text-stone-900"
              >
                {children}
              </h3>
            );
          },
          p: ({ children }) => <p className="leading-8">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc space-y-2 pl-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 pl-5">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-7">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-stone-800 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-950"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          code: ({ className, children }) => {
            const isBlock = Boolean(className);
            if (isBlock) {
              return (
                <code className="block overflow-x-auto rounded-lg bg-stone-900 px-4 py-3 text-sm text-stone-100">
                  {children}
                </code>
              );
            }
            return (
              <code className="rounded bg-stone-200/70 px-1.5 py-0.5 text-[0.9em] text-stone-800">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-lg bg-stone-900">{children}</pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-stone-300 pl-4 text-stone-500 italic">
              {children}
            </blockquote>
          ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={typeof src === "string" ? src : undefined}
              alt={alt ?? ""}
              className="my-4 w-full rounded-xl border border-stone-200"
            />
          ),
          hr: () => <hr className="border-stone-200" />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
