import { resolvePublicMedia } from "@/lib/media/public-media";
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
      url: resolvePublicMedia(`${section.basePath}/${photo.filename}`),
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
  const photosByCollection = new Map<string, PhotographyPhoto[]>();
  const collectionIds = collections.map((col) => col.id);

  // Batch all published collections. Pagination prevents the REST row cap from
  // silently truncating a growing gallery; today's 46 photos fit in one request.
  let offset = 0;
  while (true) {
    const { data: photos, error: photoError, count } = await supabase
      .from("photography_photos")
      .select("id, collection_id, url, title, date, location, description, sort_order", { count: "exact" })
      .in("collection_id", collectionIds)
      .order("collection_id", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true })
      .range(offset, offset + 999);

    if (photoError) {
      photosByCollection.clear();
      break;
    }
    for (const photo of photos ?? []) {
      const group = photosByCollection.get(photo.collection_id) ?? [];
      group.push({
        id: photo.id, url: photo.url, title: photo.title, date: photo.date ?? "",
        location: photo.location ?? undefined, description: photo.description ?? "",
      });
      photosByCollection.set(photo.collection_id, group);
    }
    offset += photos?.length ?? 0;
    if (!photos?.length || count === null || offset >= count) break;
  }

  for (const col of collections) {
    const staticCol = fallback.find((f) => f.slug === col.slug);
    const collectionPhotos = photosByCollection.get(col.id);
    const mappedPhotos: PhotographyPhoto[] =
      collectionPhotos?.length ? collectionPhotos : (staticCol?.photos ?? []);

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
