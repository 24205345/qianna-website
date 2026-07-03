"use client";

import { useTransition } from "react";
import type { PhotographyPhotoRow } from "@/lib/photography/queries";
import { addPhotoAction, deletePhotoAction } from "./photo-actions";

interface PhotoManagerProps {
  collectionId: string;
  photos: PhotographyPhotoRow[];
}

export default function PhotoManager({ collectionId, photos }: PhotoManagerProps) {
  const [pending, startTransition] = useTransition();

  return (
    <section className="mt-10 border-t border-stone-200 pt-8">
      <h2 className="font-serif text-xl text-stone-900">Photos</h2>
      <p className="mt-1 text-sm text-stone-500">Photos appear in the matching /photography collection section.</p>

      {photos.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-3">
          {photos.map((item) => (
            <li key={item.id} className="flex items-start gap-4 rounded-lg border border-stone-200 bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.title} className="h-16 w-24 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-stone-800">{item.title}</p>
                {item.location ? <p className="mt-0.5 text-xs text-stone-500">{item.location}</p> : null}
                {item.description ? (
                  <p className="mt-1 line-clamp-2 text-xs text-stone-500">{item.description}</p>
                ) : null}
                <p className="mt-1 text-xs text-stone-400">Sort order {item.sort_order}</p>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await deletePhotoAction(collectionId, item.id);
                  })
                }
                className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-stone-500">No photos yet. Run npm run migrate:photography to bulk import, or upload manually below.</p>
      )}

      <form
        action={(formData) =>
          startTransition(async () => {
            await addPhotoAction(collectionId, formData);
          })
        }
        className="mt-6 flex flex-col gap-3 rounded-lg border border-dashed border-stone-300 bg-stone-50/50 p-4"
      >
        <p className="text-sm font-medium text-stone-700">Add Photo</p>
        <input name="photo" type="file" accept="image/*" required className="text-sm" />
        <input name="title" placeholder="Title *" required className="rounded-md border border-stone-300 px-3 py-2 text-sm" />
        <input name="date" placeholder="Date (e.g. 2025.10.6)" className="rounded-md border border-stone-300 px-3 py-2 text-sm" />
        <input name="location" placeholder="Location" className="rounded-md border border-stone-300 px-3 py-2 text-sm" />
        <textarea name="description" placeholder="Description" rows={2} className="rounded-md border border-stone-300 px-3 py-2 text-sm" />
        <input name="sort_order" type="number" defaultValue={photos.length} placeholder="Sort order" className="rounded-md border border-stone-300 px-3 py-2 text-sm" />
        <button type="submit" disabled={pending} className="self-start rounded-md bg-stone-800 px-4 py-2 text-sm text-white hover:bg-stone-700 disabled:opacity-50">
          {pending ? "Uploading..." : "Upload Photo"}
        </button>
      </form>
    </section>
  );
}
