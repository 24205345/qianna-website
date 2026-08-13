import Link from "next/link";
import type { ProjectDetailItem } from "@/app/_data/project-details";
import { PROJECT_CATEGORIES } from "@/lib/projects/categories";
import {
  serializeOverviewParagraphs,
  serializeProjectDetails,
} from "@/lib/projects/parse-form";
import StatusSelect from "@/app/admin/_components/StatusSelect";

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
  intro_video_url?: string | null;
  layout_template?: string | null;
  overview_paragraphs?: string[] | null;
  project_details?: ProjectDetailItem[] | null;
}

interface ProjectFormProps {
  action: (formData: FormData) => Promise<void>;
  defaults?: ProjectFormDefaults;
  submitLabel: string;
}

const inputClass =
  "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-stone-500";
const labelClass = "block text-sm font-medium text-stone-700";
const helpClass = "mt-1 text-xs leading-5 text-stone-500";

function getCategorySelectValue(category: string | null | undefined): string {
  if (!category) return PROJECT_CATEGORIES[0]?.title ?? "";

  const normalized = category.trim().toLowerCase();
  const matchedCategory = PROJECT_CATEGORIES.find((item) =>
    item.matchLabels.some((label) => label.trim().toLowerCase() === normalized)
  );

  return matchedCategory?.title ?? category;
}

export default function ProjectForm({ action, defaults, submitLabel }: ProjectFormProps) {
  const d = defaults ?? {};

  return (
    <form action={action} className="mt-8 flex flex-col gap-5">
      <div>
        <label className={labelClass} htmlFor="title">
          Title *
        </label>
        <input id="title" name="title" required defaultValue={d.title ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="slug">
          Project URL
        </label>
        <input
          id="slug"
          name="slug"
          readOnly
          defaultValue={d.slug ?? ""}
          placeholder="Generated from the title when saved"
          className={`${inputClass} bg-stone-100 text-stone-500`}
        />
        <p className={helpClass}>
          The URL is generated automatically from the title, for example:
          /projects/urban-park-study.
        </p>
      </div>

      <div>
        <label className={labelClass} htmlFor="subtitle">
          Subtitle
        </label>
        <input id="subtitle" name="subtitle" defaultValue={d.subtitle ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="description">
          Description
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
          Content
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
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={getCategorySelectValue(d.category)}
            className={inputClass}
          >
            {PROJECT_CATEGORIES.map((category) => (
              <option key={category.slug} value={category.title}>
                {category.title}
              </option>
            ))}
          </select>
          <p className={helpClass}>
            This controls which filtered Projects page the item appears in.
          </p>
        </div>
        <div>
          <label className={labelClass} htmlFor="year">
            Year
          </label>
          <input id="year" name="year" defaultValue={d.year ?? ""} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="tags">
          Tags (comma-separated)
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
            Visibility
          </label>
          <StatusSelect defaultValue={d.status ?? "draft"} className={inputClass} />
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
        <label className={labelClass} htmlFor="layout_template">
          Layout template
        </label>
        <select
          id="layout_template"
          name="layout_template"
          defaultValue={d.layout_template ?? "default"}
          className={inputClass}
        >
          <option value="default">default</option>
          <option value="thesis">thesis (hero video + intro iframe)</option>
          <option value="xicaoshi">xicaoshi (hero cover + grid gallery)</option>
          <option value="portfolio">portfolio (Issuu-style vertical spreads)</option>
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="project_details">
          Project details (one row per Label|Value)
        </label>
        <textarea
          id="project_details"
          name="project_details"
          rows={4}
          defaultValue={serializeProjectDetails(d.project_details ?? undefined)}
          placeholder="Programme|Urban Design MArch"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="overview_paragraphs">
          Overview (separate paragraphs with a blank line)
        </label>
        <textarea
          id="overview_paragraphs"
          name="overview_paragraphs"
          rows={8}
          defaultValue={serializeOverviewParagraphs(d.overview_paragraphs ?? undefined)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="intro_video_url">
          Intro video URL (Google Drive preview or iframe URL)
        </label>
        <input
          id="intro_video_url"
          name="intro_video_url"
          defaultValue={d.intro_video_url ?? ""}
          placeholder="https://drive.google.com/file/d/.../preview"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="hero_video_url">
          Hero video URL (external or Storage URL; leave blank to keep current)
        </label>
        {d.hero_video_url ? (
          <p className="mt-1 text-xs text-stone-500 break-all">Current: {d.hero_video_url}</p>
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
          Cover image (uploads to portfolio-media; leave blank to keep current)
        </label>
        {d.cover_image_url ? (
          <p className="mt-1 text-xs text-stone-500 break-all">Current: {d.cover_image_url}</p>
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
          Cancel
        </Link>
      </div>
    </form>
  );
}
