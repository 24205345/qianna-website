import type { GalleryImage } from "@/app/_data/project-galleries";
import type { ProjectDetailItem } from "@/app/_data/project-details";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface ProjectMediaRow {
  id: string;
  type: string;
  url: string | null;
  title: string | null;
  caption: string | null;
  sort_order: number;
}

export type LayoutTemplate = "default" | "thesis" | "xicaoshi" | "portfolio";

export interface ProjectFull {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string | null;
  cover_image_url: string | null;
  hero_video_url: string | null;
  intro_video_url: string | null;
  overview_paragraphs: string[];
  project_details: ProjectDetailItem[];
  layout_template: LayoutTemplate;
}

export interface ProjectFullFallback {
  title: string;
  subtitle?: string | null;
  category?: string | null;
  cover_image_url?: string | null;
  hero_video_url?: string | null;
  intro_video_url?: string | null;
  overviewParagraphs: string[];
  projectDetails: ProjectDetailItem[];
  layoutTemplate: LayoutTemplate;
}

export async function getProjectFullBySlug(
  slug: string,
  fallback: ProjectFullFallback
): Promise<ProjectFull> {
  const base: ProjectFull = {
    id: "",
    slug,
    title: fallback.title,
    subtitle: fallback.subtitle ?? null,
    category: fallback.category ?? null,
    cover_image_url: fallback.cover_image_url ?? null,
    hero_video_url: fallback.hero_video_url ?? null,
    intro_video_url: fallback.intro_video_url ?? null,
    overview_paragraphs: fallback.overviewParagraphs,
    project_details: fallback.projectDetails,
    layout_template: fallback.layoutTemplate,
  };

  if (!isSupabaseConfigured()) return base;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, subtitle, category, cover_image_url, hero_video_url, intro_video_url, overview_paragraphs, project_details, layout_template"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return base;

  const details = Array.isArray(data.project_details)
    ? (data.project_details as ProjectDetailItem[])
    : fallback.projectDetails;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    subtitle: data.subtitle ?? fallback.subtitle ?? null,
    category: data.category ?? fallback.category ?? null,
    cover_image_url: data.cover_image_url ?? fallback.cover_image_url ?? null,
    hero_video_url: data.hero_video_url ?? fallback.hero_video_url ?? null,
    intro_video_url: data.intro_video_url ?? fallback.intro_video_url ?? null,
    overview_paragraphs:
      data.overview_paragraphs?.length > 0
        ? data.overview_paragraphs
        : fallback.overviewParagraphs,
    project_details: details.length > 0 ? details : fallback.projectDetails,
    layout_template: (data.layout_template as LayoutTemplate) ?? fallback.layoutTemplate,
  };
}

export async function getProjectGallery(
  slug: string,
  fallback: GalleryImage[]
): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured()) return fallback;

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!project) return fallback;

  const { data: media, error } = await supabase
    .from("project_media")
    .select("url, title, caption, sort_order")
    .eq("project_id", project.id)
    .eq("type", "image")
    .order("sort_order", { ascending: true });

  if (error || !media?.length) return fallback;

  return media.map((row) => ({
    url: row.url ?? "",
    title: row.title ?? "",
    caption: row.caption ?? undefined,
  }));
}

/** Returns false when Supabase has the slug but status is not published. Null if Supabase is off. */
export async function isProjectPublished(slug: string): Promise<boolean | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) return null;
  return Boolean(data);
}
