"use client";

import { useTransition } from "react";
import type { ProjectMediaRow } from "@/lib/projects/queries";
import { addProjectMediaAction, deleteProjectMediaAction } from "./media-actions";

interface MediaManagerProps {
  projectId: string;
  media: ProjectMediaRow[];
}

export default function MediaManager({ projectId, media }: MediaManagerProps) {
  const [pending, startTransition] = useTransition();

  return (
    <section className="mt-10 border-t border-stone-200 pt-8">
      <h2 className="font-serif text-xl text-stone-900">项目图片 Project Media</h2>
      <p className="mt-1 text-sm text-stone-500">画廊图片会显示在项目详情页。封面/顶部视频请在上方表单设置。</p>

      {media.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-3">
          {media.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-4 rounded-lg border border-stone-200 bg-white p-3"
            >
              {item.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.title ?? ""} className="h-16 w-24 rounded object-cover" />
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-stone-800">{item.title || "（无标题）"}</p>
                {item.caption ? (
                  <p className="mt-1 line-clamp-2 text-xs text-stone-500">{item.caption}</p>
                ) : null}
                <p className="mt-1 text-xs text-stone-400">排序 {item.sort_order}</p>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await deleteProjectMediaAction(projectId, item.id);
                  })
                }
                className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-stone-500">暂无画廊图片。</p>
      )}

      <form
        action={(formData) =>
          startTransition(async () => {
            await addProjectMediaAction(projectId, formData);
          })
        }
        className="mt-6 flex flex-col gap-3 rounded-lg border border-dashed border-stone-300 bg-stone-50/50 p-4"
      >
        <p className="text-sm font-medium text-stone-700">新增图片</p>
        <input
          name="media"
          type="file"
          accept="image/*"
          required
          className="text-sm"
        />
        <input
          name="title"
          placeholder="图片标题 Title"
          className="rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
        <textarea
          name="caption"
          placeholder="图注说明 Caption（可选）"
          rows={2}
          className="rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
        <input
          name="sort_order"
          type="number"
          defaultValue={media.length}
          placeholder="排序"
          className="rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          className="self-start rounded-md bg-stone-800 px-4 py-2 text-sm text-white hover:bg-stone-700 disabled:opacity-50"
        >
          {pending ? "上传中…" : "上传图片"}
        </button>
      </form>
    </section>
  );
}
