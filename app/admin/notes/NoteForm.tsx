"use client";

import { useState } from "react";
import StatusSelect from "@/app/admin/_components/StatusSelect";
import NoteMarkdown from "@/app/notes/_components/NoteMarkdown";

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

const inputClass =
  "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-stone-500";
const labelClass = "block text-sm font-medium text-stone-700";
const helpClass = "mt-1 text-xs leading-5 text-stone-500";

export default function NoteForm({
  action,
  defaults,
  submitLabel,
}: NoteFormProps) {
  const d = defaults ?? {};
  const [bodyMarkdown, setBodyMarkdown] = useState(d.body_markdown ?? "");
  const [showPreview, setShowPreview] = useState(false);

  return (
    <form action={action} className="mt-8 flex flex-col gap-5">
      <div>
        <label className={labelClass} htmlFor="title">
          Title *
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={d.title ?? ""}
          className={inputClass}
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
        <p className={helpClass}>
          URL path under /notes/. Leave blank on create to auto-generate.
        </p>
      </div>

      <div>
        <label className={labelClass} htmlFor="excerpt">
          Excerpt *{" "}
          <span className="font-normal text-stone-400">
            (homepage short summary, max ~160 chars)
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
        <p className={helpClass}>Keep this brief — it appears on the homepage Notes section.</p>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <label className={labelClass} htmlFor="body_markdown">
            Body (Markdown) *
          </label>
          <button
            type="button"
            onClick={() => setShowPreview((value) => !value)}
            className="text-xs text-stone-500 underline decoration-stone-300 underline-offset-2 hover:text-stone-800"
          >
            {showPreview ? "Edit Markdown" : "Preview"}
          </button>
        </div>
        {showPreview ? (
          <div className="mt-2 rounded-md border border-stone-200 bg-white p-4">
            <NoteMarkdown markdown={bodyMarkdown || "_Nothing to preview yet._"} />
          </div>
        ) : (
          <textarea
            id="body_markdown"
            name="body_markdown"
            required
            rows={18}
            value={bodyMarkdown}
            onChange={(event) => setBodyMarkdown(event.target.value)}
            className={`${inputClass} font-mono text-[13px] leading-6`}
            placeholder={"## Section\n\nWrite your note in Markdown..."}
          />
        )}
        {showPreview ? (
          <input type="hidden" name="body_markdown" value={bodyMarkdown} />
        ) : null}
        <p className={helpClass}>
          Use ## / ### headings — they become the table of contents on the note page.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
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
        <p className={helpClass}>Comma-separated. Optional for now.</p>
      </div>

      <div>
        <label className={labelClass} htmlFor="cover_image_url">
          Cover image URL
        </label>
        <input
          id="cover_image_url"
          name="cover_image_url"
          defaultValue={d.cover_image_url ?? ""}
          className={inputClass}
          placeholder="https://..."
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-stone-900 px-5 py-2.5 text-sm text-white hover:bg-stone-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
