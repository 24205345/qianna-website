import type { GalleryImage } from "@/app/_data/project-galleries";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface ProjectMediaRow {
  id: string;
  type: string;
  url: string | null;
  title: string | null;
  caption: string | null;
  sort_order: number;
}

export interface ProjectDetailRow {
  id: string;
  slug: string;
  cover_image_url: string | null;
  hero_video_url: string | null;
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetailRow | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, slug, cover_image_url, hero_video_url")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return data as ProjectDetailRow;
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
