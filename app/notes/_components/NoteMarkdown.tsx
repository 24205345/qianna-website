"use client";

import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { headingIdFromText } from "@/lib/notes/markdown";
import CopyButton from "./CopyButton";

interface NoteMarkdownProps {
  markdown: string;
}

const TERMINAL_LANGUAGES = new Set([
  "bash",
  "sh",
  "shell",
  "zsh",
  "powershell",
  "ps1",
  "docker",
  "dockerfile",
]);

function getTextContent(node: unknown): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (typeof node === "object" && node !== null && "props" in node) {
    const props = (node as { props?: { children?: unknown } }).props;
    return getTextContent(props?.children);
  }
  return "";
}

function getFencedLanguage(children: ReactNode): string | null {
  const first = Children.toArray(children).find(isValidElement);
  if (!first) return null;
  const className =
    first.props &&
    typeof first.props === "object" &&
    "className" in first.props
      ? String((first.props as { className?: string }).className ?? "")
      : "";
  return /language-(\w+)/.exec(className)?.[1] ?? null;
}

function isTerminalLanguage(language: string | null): boolean {
  return language != null && TERMINAL_LANGUAGES.has(language);
}

function copyBlockLabel(language: string | null): string | null {
  if (language === "env") return "Environment";
  if (language === "json") return "JSON";
  if (language === "yaml" || language === "yml") return "YAML";
  if (language === "text") return "Text";
  return null;
}

function LightCopyBlock({
  text,
  label,
}: {
  text: string;
  label: string | null;
}) {
  return (
    <aside className="not-prose group relative my-6 rounded-xl border border-stone-200 bg-stone-50 px-5 py-4 pr-14">
      <CopyButton text={text} tone="light" />
      {label ? (
        <p className="text-[10px] tracking-[0.22em] text-stone-400 uppercase">
          {label}
        </p>
      ) : null}
      <pre
        className={
          label
            ? "mt-3 overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-6 text-stone-700"
            : "overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-6 text-stone-700"
        }
      >
        {text}
      </pre>
    </aside>
  );
}

export default function NoteMarkdown({ markdown }: NoteMarkdownProps) {
  const usedIds = new Map<string, number>();

  return (
    <div className="note-prose w-full space-y-5 text-base leading-8 text-stone-600">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => {
            const text = getTextContent(children);
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
            const text = getTextContent(children);
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
            const text = String(children);
            const isBlock = Boolean(className) || text.includes("\n");

            if (isBlock) {
              return <code className={className}>{children}</code>;
            }

            return (
              <code className="rounded bg-stone-200/70 px-1.5 py-0.5 text-[0.9em] text-stone-800">
                {children}
              </code>
            );
          },
          pre: ({ children }) => {
            const language = getFencedLanguage(children);
            const text = getTextContent(children).replace(/\n$/, "");

            if (language === "prompt") {
              return (
                <aside className="not-prose group relative my-6 rounded-xl border border-stone-200 bg-stone-100/80 px-5 py-4 pr-14">
                  <CopyButton text={text} tone="light" />
                  <p className="text-[10px] tracking-[0.22em] text-stone-500 uppercase">
                    Prompt
                  </p>
                  <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-7 text-stone-700">
                    {text}
                  </pre>
                </aside>
              );
            }

            if (isTerminalLanguage(language)) {
              return (
                <div className="group relative my-6 overflow-hidden rounded-lg bg-stone-900">
                  <CopyButton text={text} tone="dark" />
                  <pre className="overflow-x-auto px-4 py-3.5 pr-12 font-mono text-sm leading-6 text-stone-100">
                    {text}
                  </pre>
                </div>
              );
            }

            return (
              <LightCopyBlock text={text} label={copyBlockLabel(language)} />
            );
          },
          table: ({ children }) => (
            <div className="my-6 w-full overflow-x-auto">
              <table className="note-md-table w-full min-w-full border-collapse text-left text-sm leading-6 text-stone-700">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-stone-100/90">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => (
            <th className="border border-stone-200 px-4 py-3 align-top font-medium text-stone-800 whitespace-normal break-words">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-stone-200 px-4 py-3 align-top whitespace-normal break-words">
              {children}
            </td>
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
