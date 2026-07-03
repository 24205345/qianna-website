import type { Trip } from "@/app/_data/field-notes";
import type {
  FieldNoteDetail,
  FieldNoteGalleryPhoto,
  FieldNoteNarrativeBlock,
  FieldNoteVideo,
  FieldNoteLayout,
} from "@/app/_data/field-note-details";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface FieldNoteMediaRow {
  id: string;
  type: string;
  url: string;
  title: string | null;
  caption: string | null;
  section_key: string | null;
  layout: string | null;
  aspect_ratio: string | null;
  sort_order: number;
}

export interface FieldNoteFull {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  description: string;
  activity: string;
  cover_image_url: string;
  layout_template: FieldNoteLayout;
  galleryPhotos: FieldNoteGalleryPhoto[];
  videos: FieldNoteVideo[];
  videosSectionTitle?: string;
  narrativeBlocks: FieldNoteNarrativeBlock[];
  showTripDetailsHeading: boolean;
  showScrollHint: boolean;
}

function detailToFull(note: FieldNoteDetail): FieldNoteFull {
  return {
    id: "",
    slug: note.slug,
    title: note.title,
    date: note.date,
    location: note.location,
    description: note.description,
    activity: note.activity,
    cover_image_url: note.coverImage,
    layout_template: note.layoutTemplate,
    galleryPhotos: note.galleryPhotos.map((p) => ({
      filename: p.filename,
      title: p.title,
      url: `${note.galleryBasePath}/${p.filename}`,
    })),
    videos: note.videos ?? [],
    videosSectionTitle: note.videosSectionTitle,
    narrativeBlocks: (note.narrativeBlocks ?? []).map((block) => ({
      ...block,
      url: `${note.galleryBasePath}/${block.filename}`,
    })),
    showTripDetailsHeading: note.showTripDetailsHeading ?? false,
    showScrollHint: note.showScrollHint ?? false,
  };
}

export async function getFieldNotesList(fallback: Trip[]): Promise<Trip[]> {
  if (!isSupabaseConfigured()) return fallback;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("field_notes")
    .select("slug, title, date, location, description, cover_image_url, sort_order")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return fallback;

  return data.map((row) => ({
    href: `/field-notes/${row.slug}`,
    coverImage: row.cover_image_url,
    title: row.title,
    date: row.date,
    location: row.location,
    description: row.description,
  }));
}

export async function getFieldNoteBySlug(
  slug: string,
  fallback: FieldNoteDetail
): Promise<FieldNoteFull> {
  const base = detailToFull(fallback);

  if (!isSupabaseConfigured()) return base;

  const supabase = await createClient();
  const { data: note, error } = await supabase
    .from("field_notes")
    .select(
      "id, slug, title, date, location, description, activity, cover_image_url, layout_template"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !note) return base;

  const { data: media } = await supabase
    .from("field_note_media")
    .select("type, url, title, caption, section_key, layout, aspect_ratio, sort_order")
    .eq("field_note_id", note.id)
    .order("sort_order", { ascending: true });

  if (!media?.length) return base;

  const galleryPhotos: FieldNoteGalleryPhoto[] = [];
  const videos: FieldNoteVideo[] = [];
  const narrativeBlocks: FieldNoteNarrativeBlock[] = [];

  for (const row of media) {
    if (row.type === "video_external") {
      videos.push({ title: row.title ?? "", url: row.url });
      continue;
    }

    if (row.section_key) {
      const isSpringChute = row.section_key === "spring_chute";
      narrativeBlocks.push({
        sectionKey: row.section_key,
        sectionTitle: row.title ?? "",
        layout: (row.layout as FieldNoteNarrativeBlock["layout"]) ?? "full_width",
        aspectRatio: (row.aspect_ratio as FieldNoteNarrativeBlock["aspectRatio"]) ?? "16/9",
        url: row.url,
        caption: isSpringChute ? undefined : row.caption ?? undefined,
        footerCaption: isSpringChute ? row.caption ?? undefined : undefined,
      });
      continue;
    }

    galleryPhotos.push({
      title: row.title ?? "",
      url: row.url,
    });
  }

  return {
    id: note.id,
    slug: note.slug,
    title: note.title,
    date: note.date,
    location: note.location,
    description: note.description,
    activity: note.activity ?? fallback.activity,
    cover_image_url: note.cover_image_url,
    layout_template: (note.layout_template as FieldNoteLayout) ?? fallback.layoutTemplate,
    galleryPhotos: galleryPhotos.length > 0 ? galleryPhotos : base.galleryPhotos,
    videos: videos.length > 0 ? videos : base.videos,
    videosSectionTitle: fallback.videosSectionTitle,
    narrativeBlocks: narrativeBlocks.length > 0 ? narrativeBlocks : base.narrativeBlocks,
    showTripDetailsHeading: fallback.showTripDetailsHeading ?? false,
    showScrollHint: fallback.showScrollHint ?? false,
  };
}
