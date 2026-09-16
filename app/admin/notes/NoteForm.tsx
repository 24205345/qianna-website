"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
} from "react";
import dynamic from "next/dynamic";
import StatusSelect from "@/app/admin/_components/StatusSelect";
import { extractTocFromMarkdown } from "@/lib/notes/markdown";
import { uploadNoteAttachmentAction } from "./actions";

const NoteWysiwygEditor = dynamic(
  () => import("./_components/NoteWysiwygEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 w-full animate-pulse items-center justify-center rounded-xl border border-stone-200 bg-white/60 p-6 text-xs text-stone-400">
        正在加载富文本排版引擎...
      </div>
    ),
  }
);

export interface NoteFormDefaults {
  title?: string | null;
  title_en?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  excerpt_en?: string | null;
  body_markdown?: string | null;
  body_markdown_en?: string | null;
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

export default function NoteForm({
  action,
  defaults,
  submitLabel,
}: NoteFormProps) {
  const d = defaults ?? {};
  const [editorLang, setEditorLang] = useState<"zh" | "en">("zh");
  const [bodyMarkdown, setBodyMarkdown] = useState(d.body_markdown ?? "");
  const [bodyMarkdownEn, setBodyMarkdownEn] = useState(
    d.body_markdown_en ?? ""
  );
  const [attachments, setAttachments] = useState<AttachmentItem[]>(() =>
    d.cover_image_url
      ? [{ url: d.cover_image_url, fileName: "cover" }]
      : []
  );
  const [coverUrl, setCoverUrl] = useState(d.cover_image_url ?? "");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, startUpload] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeBody = editorLang === "en" ? bodyMarkdownEn : bodyMarkdown;
  const setActiveBody =
    editorLang === "en" ? setBodyMarkdownEn : setBodyMarkdown;

  const toc = useMemo(
    () => extractTocFromMarkdown(activeBody),
    [activeBody]
  );

  const [activeHeadingIdx, setActiveHeadingIdx] = useState<number | null>(null);

  function insertImageMarkdown(url: string, fileName: string) {
    const alt = fileName.replace(/\.[^.]+$/, "") || "image";
    setActiveBody((prev) => `${prev ? prev + "\n\n" : ""}![${alt}](${url})\n\n`);
  }

  function scrollToHeading(text: string, index?: number) {
    if (typeof index === "number") {
      setActiveHeadingIdx(index);
    }
    const headings = document.querySelectorAll(".tiptap h2, .tiptap h3");
    if (
      typeof index === "number" &&
      headings[index] &&
      headings[index].textContent?.trim() === text.trim()
    ) {
      headings[index].scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    for (const h of headings) {
      if (h.textContent?.trim() === text.trim()) {
        h.scrollIntoView({ behavior: "smooth", block: "center" });
        break;
      }
    }
  }

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(".tiptap h2, .tiptap h3")
    );
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topVisible = visible.reduce((prev, curr) =>
            prev.boundingClientRect.top < curr.boundingClientRect.top
              ? prev
              : curr
          );
          const idx = headings.indexOf(topVisible.target as HTMLElement);
          if (idx !== -1) {
            setActiveHeadingIdx(idx);
          }
        }
      },
      {
        rootMargin: "-92px 0px -70% 0px",
        threshold: [0, 1],
      }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [activeBody]);

  async function handleUploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadNoteAttachmentAction(formData);
    setAttachments((prev) => {
      if (prev.some((item) => item.url === result.url)) return prev;
      return [...prev, result];
    });
    if (!coverUrl) {
      setCoverUrl(result.url);
    }
    return result.url;
  }

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadError(null);
    startUpload(async () => {
      try {
        await handleUploadImage(file);
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Upload failed."
        );
      }
    });
  }

  return (
    <form action={action} className="mt-8 flex flex-col gap-6">
      <input type="hidden" name="body_markdown" value={bodyMarkdown} />
      <input type="hidden" name="body_markdown_en" value={bodyMarkdownEn} />
      <input type="hidden" name="cover_image_url" value={coverUrl} />

      {/* Meta */}
      <section className="grid gap-5 lg:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="title">
            Title (中文) *
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={d.title ?? ""}
            className={inputClass}
            placeholder="中文标题"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="title_en">
            Title (English)
          </label>
          <input
            id="title_en"
            name="title_en"
            defaultValue={d.title_en ?? ""}
            className={inputClass}
            placeholder="English title for list / home"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="excerpt">
            Summary (中文) *{" "}
            <span className="font-normal text-stone-400">
              (max ~160 chars)
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
            placeholder="中文摘要"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="excerpt_en">
            Summary (English){" "}
            <span className="font-normal text-stone-400">
              (homepage / list)
            </span>
          </label>
          <textarea
            id="excerpt_en"
            name="excerpt_en"
            rows={2}
            maxLength={160}
            defaultValue={d.excerpt_en ?? ""}
            className={inputClass}
            placeholder="English excerpt for homepage and list"
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
      <section className="rounded-xl border border-stone-200 bg-white shadow-xs">
        <div className="lg:sticky lg:top-0 z-30 flex min-h-[46px] flex-wrap items-center justify-between gap-3 border-b border-stone-200 bg-stone-50/95 px-4 py-2 backdrop-blur-sm rounded-t-xl">
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="inline-flex rounded-md border border-stone-300 bg-white p-0.5 text-xs shadow-xs"
              role="group"
              aria-label="Editor language"
            >
              <button
                type="button"
                onClick={() => setEditorLang("zh")}
                className={
                  editorLang === "zh"
                    ? "rounded px-3 py-1 font-medium text-stone-900 bg-stone-100 shadow-xs"
                    : "rounded px-3 py-1 text-stone-500 hover:text-stone-800 transition-colors"
                }
              >
                中文正文
              </button>
              <button
                type="button"
                onClick={() => setEditorLang("en")}
                className={
                  editorLang === "en"
                    ? "rounded px-3 py-1 font-medium text-stone-900 bg-stone-100 shadow-xs"
                    : "rounded px-3 py-1 text-stone-500 hover:text-stone-800 transition-colors"
                }
              >
                English body
              </button>
            </div>
            <span className="text-xs text-stone-400">
              {editorLang === "zh"
                ? "当前正在编辑中文版本"
                : "Currently editing English version"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-500">
            <span>{activeBody.length} 字符</span>
            <span>·</span>
            <span>{toc.length} 个章节</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[15rem_minmax(0,1fr)] items-start">
          {/* TOC / outline */}
          <aside className="border-b border-stone-200 bg-stone-50/40 lg:border-b-0 lg:border-r lg:sticky lg:top-[46px] lg:self-start lg:h-[calc(100vh-46px)] lg:flex lg:flex-col">
            <div className="flex shrink-0 h-[46px] items-center justify-between border-b border-stone-200 bg-stone-50/90 px-4">
              <p className="text-[10px] tracking-[0.2em] font-semibold text-stone-500 uppercase">
                Contents
              </p>
              <span className="text-[11px] text-stone-400 font-mono">
                {toc.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 toc-scrollbar">
              {toc.length === 0 ? (
                <p className="p-2 text-xs leading-5 text-stone-400">
                  在正文中使用 ## 或 ### 自动生成目录导航
                </p>
              ) : (
                <ul className="space-y-1 text-xs">
                  {toc.map((heading, idx) => (
                    <li key={`${heading.id}-${idx}`}>
                      <button
                        type="button"
                        onClick={() => scrollToHeading(heading.text, idx)}
                        className={`w-full text-left truncate rounded py-1 px-2 transition-colors ${
                          activeHeadingIdx === idx
                            ? "bg-stone-200/90 font-medium text-stone-900 shadow-2xs"
                            : heading.level === 3
                            ? "pl-3.5 text-stone-500 text-[11px] hover:bg-stone-200/50"
                            : "font-medium text-stone-700 hover:bg-stone-200/50"
                        }`}
                        title={heading.text}
                      >
                        {heading.level === 3 ? "↳ " : "• "}
                        {heading.text}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          {/* Wysiwyg Editor */}
          <div className="min-w-0 min-h-[36rem] flex flex-col">
            <NoteWysiwygEditor
              value={activeBody}
              onChange={setActiveBody}
              onUploadImage={handleUploadImage}
              placeholder="直接在此书写笔记正文，排版所见即所得。支持加粗、标题、列表、表格与截图直接粘贴…"
            />
          </div>
        </div>

        <div className="border-t border-stone-100 bg-stone-50/50 px-4 py-2.5 text-xs leading-5 text-stone-500 flex flex-wrap items-center justify-between gap-2 rounded-b-xl">
          <span>
            💡 提示：支持直接从剪切板粘贴截图（Ctrl+V）；工具栏支持一键插入表格并增删行列；点击右上角「Markdown 源码」可随时切换查看原生格式。
          </span>
        </div>
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
