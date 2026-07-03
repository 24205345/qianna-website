import type { VisualWorkSection } from "@/app/_data/visual-works";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface VisualWorkItem {
  id: string;
  url: string;
  title: string;
  date: string;
  description: string;
}

export interface VisualWorkCategory {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  sort_order: number;
  works: VisualWorkItem[];
}

export interface VisualWorkRow {
  id: string;
  url: string;
  title: string;
  date: string | null;
  description: string | null;
  sort_order: number;
}

function staticToCategories(sections: VisualWorkSection[]): VisualWorkCategory[] {
  return sections.map((section) => ({
    id: "",
    slug: section.slug,
    title: section.title,
    subtitle: section.subtitle,
    description: section.description ?? null,
    sort_order: section.sort_order,
    works: section.works.map((work) => ({
      id: work.id,
      url: `${section.basePath}/${work.filename}`,
      title: work.title,
      date: work.date,
      description: work.description,
    })),
  }));
}

export async function getVisualWorksPageData(
  fallbackSections: VisualWorkSection[]
): Promise<VisualWorkCategory[]> {
  const fallback = staticToCategories(fallbackSections);

  if (!isSupabaseConfigured()) return fallback;

  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("visual_work_categories")
    .select("id, slug, title, subtitle, description, sort_order")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error || !categories?.length) return fallback;

  const result: VisualWorkCategory[] = [];

  for (const cat of categories) {
    const { data: works, error: worksError } = await supabase
      .from("visual_works")
      .select("id, url, title, date, description, sort_order")
      .eq("category_id", cat.id)
      .order("sort_order", { ascending: true });

    const staticCat = fallback.find((f) => f.slug === cat.slug);
    const mappedWorks: VisualWorkItem[] =
      worksError || !works?.length
        ? (staticCat?.works ?? [])
        : works.map((w) => ({
            id: w.id,
            url: w.url,
            title: w.title,
            date: w.date ?? "",
            description: w.description ?? "",
          }));

    result.push({
      id: cat.id,
      slug: cat.slug,
      title: cat.title,
      subtitle: cat.subtitle,
      description: cat.description,
      sort_order: cat.sort_order,
      works: mappedWorks,
    });
  }

  return result.length > 0 ? result : fallback;
}
