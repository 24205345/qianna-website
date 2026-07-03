"use client";

import { useTransition } from "react";
import type { FieldNoteMediaRow } from "@/lib/field-notes/queries";
import { addFieldNoteMediaAction, deleteFieldNoteMediaAction } from "./media-actions";

interface MediaManagerProps {
  fieldNoteId: string;
  media: FieldNoteMediaRow[];
}

export default function MediaManager({ fieldNoteId, media }: MediaManagerProps) {
  const [pending, startTransition] = useTransition();

  return (
    <section className="mt-10 border-t border-stone-200 pt-8">
      <h2 className="font-serif text-xl text-stone-900">Media</h2>
      <p className="mt-1 text-sm text-stone-500">Gallery images, narrative section images, and Google Drive video links.</p>

      {media.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-3">
          {media.map((item) => (
            <li key={item.id} className="flex items-start gap-4 rounded-lg border border-stone-200 bg-white p-3">
              {item.type === "image" && item.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.title ?? ""} className="h-16 w-24 rounded object-cover" />
              ) : (
                <div className="flex h-16 w-24 items-center justify-center rounded bg-stone-100 text-xs text-stone-500">video</div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-stone-800">{item.title || "Untitled"}</p>
                <p className="text-xs text-stone-400">{item.type}{item.section_key ? ` - ${item.section_key}` : ""}</p>
                {item.caption ? <p className="mt-1 line-clamp-2 text-xs text-stone-500">{item.caption}</p> : null}
              </div>
              <button type="button" disabled={pending} onClick={() => startTransition(async () => { await deleteFieldNoteMediaAction(fieldNoteId, item.id); })} className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50">Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-stone-500">No media yet. Run npm run migrate:field-notes to bulk import.</p>
      )}

      <form action={(formData) => startTransition(async () => { await addFieldNoteMediaAction(fieldNoteId, formData); })} className="mt-6 flex flex-col gap-3 rounded-lg border border-dashed border-stone-300 bg-stone-50/50 p-4">
        <p className="text-sm font-medium text-stone-700">Add Image</p>
        <input name="media_type" type="hidden" value="image" />
        <input name="media" type="file" accept="image/*" className="text-sm" />
        <input name="title" placeholder="Title" className="rounded-md border border-stone-300 px-3 py-2 text-sm" />
        <textarea name="caption" placeholder="Caption / narrative text" rows={2} className="rounded-md border border-stone-300 px-3 py-2 text-sm" />
        <input name="section_key" placeholder="section_key (for narrative pages, e.g. alpine_basin)" className="rounded-md border border-stone-300 px-3 py-2 text-sm" />
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="layout" placeholder="layout: gallery / full_width / text_left / text_right" className="rounded-md border border-stone-300 px-3 py-2 text-sm" />
          <input name="aspect_ratio" placeholder="aspect_ratio: 16/9 or 4/3" className="rounded-md border border-stone-300 px-3 py-2 text-sm" />
        </div>
        <input name="sort_order" type="number" defaultValue={media.length} className="rounded-md border border-stone-300 px-3 py-2 text-sm" />
        <button type="submit" disabled={pending} className="self-start rounded-md bg-stone-800 px-4 py-2 text-sm text-white hover:bg-stone-700 disabled:opacity-50">{pending ? "Uploading..." : "Upload Image"}</button>
      </form>

      <form action={(formData) => startTransition(async () => { formData.set("media_type", "video_external"); await addFieldNoteMediaAction(fieldNoteId, formData); })} className="mt-6 flex flex-col gap-3 rounded-lg border border-dashed border-stone-300 bg-stone-50/50 p-4">
        <p className="text-sm font-medium text-stone-700">Add Google Drive Video</p>
        <input name="video_url" placeholder="https://drive.google.com/file/d/.../preview" required className="rounded-md border border-stone-300 px-3 py-2 text-sm" />
        <input name="title" placeholder="Video title" className="rounded-md border border-stone-300 px-3 py-2 text-sm" />
        <input name="sort_order" type="number" defaultValue={media.length} className="rounded-md border border-stone-300 px-3 py-2 text-sm" />
        <button type="submit" disabled={pending} className="self-start rounded-md bg-stone-800 px-4 py-2 text-sm text-white hover:bg-stone-700 disabled:opacity-50">Add Video</button>
      </form>
    </section>
  );
}
