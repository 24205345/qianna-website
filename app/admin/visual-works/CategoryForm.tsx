import StatusSelect from "@/app/admin/_components/StatusSelect";

export interface CategoryFormDefaults {
  title?: string | null;
  slug?: string | null;
  subtitle?: string | null;
  description?: string | null;
  status?: string | null;
  sort_order?: number | null;
}

interface CategoryFormProps {
  action: (formData: FormData) => Promise<void>;
  defaults?: CategoryFormDefaults;
  submitLabel: string;
}

const inputClass =
  "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-stone-500";
const labelClass = "block text-sm font-medium text-stone-700";

export default function CategoryForm({ action, defaults, submitLabel }: CategoryFormProps) {
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
      <div>
        <label className={labelClass} htmlFor="subtitle">Subtitle</label>
        <input id="subtitle" name="subtitle" defaultValue={d.subtitle ?? ""} className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={3} defaultValue={d.description ?? ""} className={inputClass} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="status">Visibility</label>
          <StatusSelect defaultValue={d.status ?? "draft"} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="sort_order">Sort order</label>
          <input id="sort_order" name="sort_order" type="number" defaultValue={d.sort_order ?? 0} className={inputClass} />
        </div>
      </div>
      <button type="submit" className="rounded-md bg-stone-900 px-5 py-2.5 text-sm text-white hover:bg-stone-700">
        {submitLabel}
      </button>
    </form>
  );
}
