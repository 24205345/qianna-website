import Link from "next/link";

export interface ProjectFormDefaults {
  title?: string | null;
  slug?: string | null;
  subtitle?: string | null;
  description?: string | null;
  content?: string | null;
  category?: string | null;
  tags?: string[] | null;
  year?: string | null;
  status?: string | null;
  sort_order?: number | null;
  cover_image_url?: string | null;
  hero_video_url?: string | null;
}

interface ProjectFormProps {
  action: (formData: FormData) => Promise<void>;
  defaults?: ProjectFormDefaults;
  submitLabel: string;
}

const inputClass =
  "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-stone-500";
const labelClass = "block text-sm font-medium text-stone-700";

export default function ProjectForm({ action, defaults, submitLabel }: ProjectFormProps) {
  const d = defaults ?? {};

  return (
    <form action={action} className="mt-8 flex flex-col gap-5">
      <div>
        <label className={labelClass} htmlFor="title">
          标题 Title *
        </label>
        <input id="title" name="title" required defaultValue={d.title ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="slug">
          Slug（URL 标识，唯一）*
        </label>
        <input id="slug" name="slug" required defaultValue={d.slug ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="subtitle">
          副标题 Subtitle
        </label>
        <input id="subtitle" name="subtitle" defaultValue={d.subtitle ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="description">
          简介 Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={d.description ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="content">
          正文 Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={8}
          defaultValue={d.content ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="category">
            分类 Category
          </label>
          <input id="category" name="category" defaultValue={d.category ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="year">
            年份 Year
          </label>
          <input id="year" name="year" defaultValue={d.year ?? ""} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="tags">
          标签 Tags（英文逗号分隔）
        </label>
        <input
          id="tags"
          name="tags"
          defaultValue={(d.tags ?? []).join(", ")}
          placeholder="Tag A, Tag B, Tag C"
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="status">
            状态 Status
          </label>
          <select id="status" name="status" defaultValue={d.status ?? "draft"} className={inputClass}>
            <option value="draft">draft（草稿）</option>
            <option value="published">published（已发布）</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="sort_order">
            排序 Sort order
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
        <label className={labelClass} htmlFor="hero_video_url">
          顶部视频 Hero video URL（外链或 Storage 地址；留空则不变）
        </label>
        {d.hero_video_url ? (
          <p className="mt-1 text-xs text-stone-500 break-all">当前：{d.hero_video_url}</p>
        ) : null}
        <input
          id="hero_video_url"
          name="hero_video_url"
          defaultValue={d.hero_video_url ?? ""}
          placeholder="https://..."
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="cover">
          封面图 Cover（上传到 portfolio-media；留空则保持不变）
        </label>
        {d.cover_image_url ? (
          <p className="mt-1 text-xs text-stone-500 break-all">当前：{d.cover_image_url}</p>
        ) : null}
        <input id="cover" name="cover" type="file" accept="image/*" className={`${inputClass} py-1.5`} />
      </div>

      <div className="mt-2 flex items-center gap-4">
        <button
          type="submit"
          className="rounded-md bg-stone-900 px-5 py-2 text-sm text-white transition-colors hover:bg-stone-700"
        >
          {submitLabel}
        </button>
        <Link href="/admin/projects" className="text-sm text-stone-500 hover:text-stone-800">
          取消
        </Link>
      </div>
    </form>
  );
}
