import type { PhotographySection } from "@/app/_data/photography";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface PhotographyPhoto {
  id: string;
  url: string;
  title: string;
  date: string;
  location?: string;
  description: string;
}

export interface PhotographyCollection {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  sort_order: number;
  photos: PhotographyPhoto[];
}

export interface PhotographyPhotoRow {
  id: string;
  url: string;
  title: string;
  date: string | null;
  location: string | null;
  description: string | null;
  sort_order: number;
}

function staticToCollections(sections: PhotographySection[]): PhotographyCollection[] {
  return sections.map((section) => ({
    id: "",
    slug: section.slug,
    title: section.title,
    subtitle: section.subtitle,
    description: section.description ?? null,
    sort_order: section.sort_order,
    photos: section.photos.map((photo) => ({
      id: photo.id,
      url: `${section.basePath}/${photo.filename}`,
      title: photo.title,
      date: photo.date,
      location: photo.location,
      description: photo.description,
    })),
  }));
}

export async function getPhotographyPageData(
  fallbackSections: PhotographySection[]
): Promise<PhotographyCollection[]> {
  const fallback = staticToCollections(fallbackSections);

  if (!isSupabaseConfigured()) return fallback;

  const supabase = await createClient();
  const { data: collections, error } = await supabase
    .from("photography_collections")
    .select("id, slug, title, subtitle, description, sort_order")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error || !collections?.length) return fallback;

  const result: PhotographyCollection[] = [];

  for (const col of collections) {
    const { data: photos, error: photoError } = await supabase
      .from("photography_photos")
      .select("id, url, title, date, location, description, sort_order")
      .eq("collection_id", col.id)
      .order("sort_order", { ascending: true });

    const staticCol = fallback.find((f) => f.slug === col.slug);
    const mappedPhotos: PhotographyPhoto[] =
      photoError || !photos?.length
        ? (staticCol?.photos ?? [])
        : photos.map((p) => ({
            id: p.id,
            url: p.url,
            title: p.title,
            date: p.date ?? "",
            location: p.location ?? undefined,
            description: p.description ?? "",
          }));

    result.push({
      id: col.id,
      slug: col.slug,
      title: col.title,
      subtitle: col.subtitle,
      description: col.description,
      sort_order: col.sort_order,
      photos: mappedPhotos,
    });
  }

  return result.length > 0 ? result : fallback;
}
