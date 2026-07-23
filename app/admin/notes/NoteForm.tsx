"use client";

import {
  useMemo,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
} from "react";
import StatusSelect from "@/app/admin/_components/StatusSelect";
import NoteMarkdown from "@/app/notes/_components/NoteMarkdown";
import {
  extractTocFromMarkdown,
  splitMarkdownSections,
} from "@/lib/notes/markdown";
import { uploadNoteAttachmentAction } from "./actions";

export interface NoteFormDefaults {
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  body_markdown?: string | null;
  cover_image_url?: string | null;
  tags?: string[] | null;
  status?: string | null;
  sort_order?: number | null;
}

interface NoteFormProps {
  action: (formData: FormData) => Promise<void>;
  defaults?: NoteFormDefaults;
  submitLabel: string;
}

interface AttachmentItem {
  url: string;
  fileName: string;
}

const inputClass =
  "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-stone-500";
const labelClass = "block text-sm font-medium text-stone-700";
const helpClass = "mt-1 text-xs leading-5 text-stone-500";
const toolBtnClass =
  "rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-xs text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900";

const SNIPPETS = {
  heading: "## Section title\n\n",
  prompt: "```prompt\nPaste your prompt here…\n```\n\n",
  link: "[link text](https://)\n",
  code: "```ts\n// code\n```\n\n",
  image: "![description](https://)\n\n",
  quote: "> Note\n\n",
} as const;

export default function NoteForm({
  action,
  defaults,
  submitLabel,
}: NoteFormProps) {
  const d = defaults ?? {};
  const [bodyMarkdown, setBodyMarkdown] = useState(d.body_markdown ?? "");
  const [attachments, setAttachments] = useState<AttachmentItem[]>(() =>
    d.cover_image_url
      ? [{ url: d.cover_image_url, fileName: "cover" }]
      : []
  );
  const [coverUrl, setCoverUrl] = useState(d.cover_image_url ?? "");
  const [activeSectionId, setActiveSectionId] = useState<string | "all">("all");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, startUpload] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toc = useMemo(
    () => extractTocFromMarkdown(bodyMarkdown),
    [bodyMarkdown]
  );
  const sections = useMemo(
    () => splitMarkdownSections(bodyMarkdown),
    [bodyMarkdown]
  );

  const previewMarkdown = useMemo(() => {
    if (activeSectionId === "all") return bodyMarkdown;
    return (
      sections.find((section) => section.id === activeSectionId)?.markdown ??
      bodyMarkdown
    );
  }, [activeSectionId, bodyMarkdown, sections]);

  const activeIndex =
    activeSectionId === "all"
      ? -1
      : sections.findIndex((section) => section.id === activeSectionId);

  function insertSnippet(snippet: string) {
    const el = textareaRef.current;
    if (!el) {
      setBodyMarkdown((prev) => `${prev}${snippet}`);
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next =
      bodyMarkdown.slice(0, start) + snippet + bodyMarkdown.slice(end);
    setBodyMarkdown(next);

    requestAnimationFrame(() => {
      el.focus();
      const caret = start + snippet.length;
      el.setSelectionRange(caret, caret);
    });
  }

  function insertImageMarkdown(url: string, fileName: string) {
    const alt = fileName.replace(/\.[^.]+$/, "") || "image";
    insertSnippet(`![${alt}](${url})\n\n`);
  }

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadError(null);
    const formData = new FormData();
    formData.set("file", file);

    startUpload(async () => {
      try {
        const result = await uploadNoteAttachmentAction(formData);
        setAttachments((prev) => {
          if (prev.some((item) => item.url === result.url)) return prev;
          return [...prev, result];
        });
        if (!coverUrl) {
          setCoverUrl(result.url);
        }
        insertImageMarkdown(result.url, result.fileName);
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Upload failed."
        );
      }
    });
  }

  function goToSection(sectionId: string | "all") {
    setActiveSectionId(sectionId);
    if (sectionId === "all") {
      previewRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    requestAnimationFrame(() => {
      const target = previewRef.current?.querySelector(`#${CSS.escape(sectionId)}`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        previewRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  function goPrevSection() {
    if (sections.length === 0) return;
    if (activeSectionId === "all") {
      goToSection(sections[0].id);
      return;
    }
    if (activeIndex <= 0) {
      goToSection("all");
      return;
    }
    goToSection(sections[activeIndex - 1].id);
  }

  function goNextSection() {
    if (sections.length === 0) return;
    if (activeSectionId === "all") {
      goToSection(sections[0].id);
      return;
    }
    if (activeIndex >= sections.length - 1) return;
    goToSection(sections[activeIndex + 1].id);
  }

  return (
    <form action={action} className="mt-8 flex flex-col gap-6">
      <input type="hidden" name="body_markdown" value={bodyMarkdown} />
      <input type="hidden" name="cover_image_url" value={coverUrl} />

      {/* Meta */}
      <section className="grid gap-5 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <label className={labelClass} htmlFor="title">
            Title *
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={d.title ?? ""}
            className={inputClass}
            placeholder="Note title"
          />
        </div>

        <div className="lg:col-span-2">
          <label className={labelClass} htmlFor="excerpt">
            Summary *{" "}
            <span className="font-normal text-stone-400">
              (homepage excerpt, max ~160 chars)
            </span>
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            required
            rows={2}
            maxLength={160}
            defaultValue={d.excerpt ?? ""}
            className={inputClass}
            placeholder="One or two concise sentences for the homepage."
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={d.slug ?? ""}
            className={inputClass}
            placeholder="auto-generated from title if left blank"
          />
          <p className={helpClass}>URL under /notes/. Prefer English slug.</p>
        </div>

        <div>
          <label className={labelClass} htmlFor="tags">
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            defaultValue={(d.tags ?? []).join(", ")}
            className={inputClass}
            placeholder="AI, tutorial, product"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="status">
            Visibility
          </label>
          <StatusSelect
            defaultValue={d.status ?? "draft"}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="sort_order">
            Sort order
          </label>
          <input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={d.sort_order ?? 0}
            className={inputClass}
          />
        </div>
      </section>

      {/* Attachments */}
      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-stone-700">Attachments</p>
            <p className={helpClass}>
              Upload images into Storage, then insert as Markdown. First image
              can be used as cover.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
            <button
              type="button"
              className={toolBtnClass}
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? "Uploading…" : "+ Add image"}
            </button>
          </div>
        </div>

        {uploadError ? (
          <p className="mt-3 text-sm text-red-600">{uploadError}</p>
        ) : null}

        {attachments.length > 0 ? (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {attachments.map((item) => (
              <li
                key={item.url}
                className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs"
              >
                <span className="truncate text-stone-600">{item.fileName}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    className="text-stone-500 underline-offset-2 hover:underline"
                    onClick={() => insertImageMarkdown(item.url, item.fileName)}
                  >
                    Insert
                  </button>
                  <button
                    type="button"
                    className="text-stone-500 underline-offset-2 hover:underline"
                    onClick={() => setCoverUrl(item.url)}
                  >
                    {coverUrl === item.url ? "Cover" : "Set cover"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-xs text-stone-400">No attachments yet.</p>
        )}
      </section>

      {/* Editor */}
      <section className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 bg-stone-50 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={toolBtnClass}
              onClick={() => insertSnippet(SNIPPETS.heading)}
            >
              Heading
            </button>
            <button
              type="button"
              className={toolBtnClass}
              onClick={() => insertSnippet(SNIPPETS.prompt)}
            >
              Prompt
            </button>
            <button
              type="button"
              className={toolBtnClass}
              onClick={() => insertSnippet(SNIPPETS.image)}
            >
              Image
            </button>
            <button
              type="button"
              className={toolBtnClass}
              onClick={() => insertSnippet(SNIPPETS.link)}
            >
              Link
            </button>
            <button
              type="button"
              className={toolBtnClass}
              onClick={() => insertSnippet(SNIPPETS.code)}
            >
              Code
            </button>
            <button
              type="button"
              className={toolBtnClass}
              onClick={() => insertSnippet(SNIPPETS.quote)}
            >
              Quote
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className={toolBtnClass} onClick={goPrevSection}>
              ← Section
            </button>
            <button type="button" className={toolBtnClass} onClick={goNextSection}>
              Section →
            </button>
            <button
              type="button"
              className={toolBtnClass}
              onClick={() => goToSection("all")}
            >
              All
            </button>
          </div>
        </div>

        <div className="grid border-b border-stone-200 lg:grid-cols-[13rem_minmax(0,1fr)]">
          {/* TOC / pages */}
          <aside className="border-b border-stone-200 bg-stone-50/80 p-4 lg:border-b-0 lg:border-r">
            <p className="text-[10px] tracking-[0.22em] text-stone-500 uppercase">
              Contents
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => goToSection("all")}
                  className={
                    activeSectionId === "all"
                      ? "text-left font-medium text-stone-900"
                      : "text-left text-stone-500 transition-colors hover:text-stone-800"
                  }
                >
                  Full document
                </button>
              </li>
              {sections.length === 0 ? (
                <li className="text-xs text-stone-400">
                  Add ## headings to build pages.
                </li>
              ) : (
                sections.map((section) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => goToSection(section.id)}
                      className={
                        activeSectionId === section.id
                          ? "text-left font-medium text-stone-900"
                          : "text-left text-stone-500 transition-colors hover:text-stone-800"
                      }
                    >
                      {section.title}
                    </button>
                  </li>
                ))
              )}
            </ul>
            {toc.some((heading) => heading.level === 3) ? (
              <div className="mt-5 border-t border-stone-200 pt-4">
                <p className="text-[10px] tracking-[0.22em] text-stone-400 uppercase">
                  Subheadings
                </p>
                <ul className="mt-2 space-y-1.5 text-xs">
                  {toc
                    .filter((heading) => heading.level === 3)
                    .map((heading) => (
                      <li key={heading.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSectionId("all");
                            requestAnimationFrame(() => {
                              previewRef.current
                                ?.querySelector(`#${CSS.escape(heading.id)}`)
                                ?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                            });
                          }}
                          className="text-left text-stone-500 transition-colors hover:text-stone-800"
                        >
                          {heading.text}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            ) : null}
            {sections.length > 0 ? (
              <p className="mt-4 text-[11px] text-stone-400">
                Page{" "}
                {activeSectionId === "all"
                  ? "—"
                  : `${Math.max(activeIndex, 0) + 1} / ${sections.length}`}
              </p>
            ) : null}
          </aside>

          {/* Split: preview | input */}
          <div className="grid min-h-[32rem] lg:grid-cols-2">
            <div className="flex min-h-[20rem] flex-col border-b border-stone-200 lg:border-b-0 lg:border-r">
              <div className="border-b border-stone-100 px-4 py-2">
                <p className="text-[10px] tracking-[0.18em] text-stone-400 uppercase">
                  Preview
                  {activeSectionId !== "all"
                    ? ` · ${
                        sections.find((s) => s.id === activeSectionId)?.title ??
                        ""
                      }`
                    : ""}
                </p>
              </div>
              <div
                ref={previewRef}
                className="min-h-0 flex-1 overflow-y-auto bg-stone-50/40 px-5 py-5"
              >
                {previewMarkdown.trim() ? (
                  <NoteMarkdown markdown={previewMarkdown} />
                ) : (
                  <p className="text-sm text-stone-400">
                    Preview updates as you write on the right.
                  </p>
                )}
              </div>
            </div>

            <div className="flex min-h-[20rem] flex-col">
              <div className="border-b border-stone-100 px-4 py-2">
                <p className="text-[10px] tracking-[0.18em] text-stone-400 uppercase">
                  Markdown
                </p>
              </div>
              <textarea
                ref={textareaRef}
                value={bodyMarkdown}
                onChange={(event) => setBodyMarkdown(event.target.value)}
                className="min-h-[20rem] flex-1 resize-none border-0 bg-white px-4 py-4 font-mono text-[13px] leading-6 text-stone-800 outline-none focus:ring-0"
                placeholder={
                  "## Getting started\n\nWrite in Markdown.\n\n```prompt\nYour reusable prompt…\n```\n"
                }
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        <p className="px-4 py-3 text-xs leading-5 text-stone-500">
          Tip: use{" "}
          <code className="rounded bg-stone-100 px-1">##</code> for sections /
          TOC pages. Prompt blocks use{" "}
          <code className="rounded bg-stone-100 px-1">```prompt</code> fences —
          they render in the same stone style on the public note page.
        </p>
      </section>

      <button
        type="submit"
        className="rounded-md bg-stone-900 px-5 py-2.5 text-sm text-white transition-colors hover:bg-stone-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
