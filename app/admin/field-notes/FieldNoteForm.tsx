import StatusSelect from "@/app/admin/_components/StatusSelect";

export interface FieldNoteFormDefaults {
  title?: string | null;
  slug?: string | null;
  date?: string | null;
  location?: string | null;
  description?: string | null;
  activity?: string | null;
  layout_template?: string | null;
  status?: string | null;
  sort_order?: number | null;
  cover_image_url?: string | null;
}

interface FieldNoteFormProps {
  action: (formData: FormData) => Promise<void>;
  defaults?: FieldNoteFormDefaults;
  submitLabel: string;
}

const inputClass =
  "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-stone-500";
const labelClass = "block text-sm font-medium text-stone-700";

export default function FieldNoteForm({ action, defaults, submitLabel }: FieldNoteFormProps) {
  const d = defaults ?? {};

  return (
    <form action={action} className="mt-8 flex flex-col gap-5">
      <div>
        <label className={labelClass} htmlFor="title">Title *</label>
        <input id="title" name="title" required defaultValue={d.title ?? ""} className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="slug">Slug *</label>
        <input id="slug" name="slug" required defaultValue={d.slug ?? ""} className={inputClass} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="date">Date *</label>
          <input id="date" name="date" required defaultValue={d.date ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="activity">Activity</label>
          <input id="activity" name="activity" defaultValue={d.activity ?? ""} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="location">Location *</label>
        <input id="location" name="location" required defaultValue={d.location ?? ""} className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="description">Description *</label>
        <textarea id="description" name="description" required rows={3} defaultValue={d.description ?? ""} className={inputClass} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="layout_template">Layout template</label>
          <select id="layout_template" name="layout_template" defaultValue={d.layout_template ?? "gallery"} className={inputClass}>
            <option value="gallery">gallery (gallery + optional video)</option>
            <option value="narrative">narrative (narrative sections)</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="status">Visibility</label>
          <StatusSelect defaultValue={d.status ?? "draft"} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="sort_order">Sort order</label>
        <input id="sort_order" name="sort_order" type="number" defaultValue={d.sort_order ?? 0} className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="cover">Cover image</label>
        {d.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={d.cover_image_url} alt="Current cover" className="mb-2 h-24 rounded object-cover" />
        ) : null}
        <input id="cover" name="cover" type="file" accept="image/*" className="mt-1 text-sm" />
      </div>
      <button type="submit" className="rounded-md bg-stone-900 px-5 py-2.5 text-sm text-white hover:bg-stone-700">{submitLabel}</button>
    </form>
  );
}
