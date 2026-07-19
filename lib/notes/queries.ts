import {
  fallbackNotes,
  type NoteDetail,
  type NoteListItem,
} from "@/app/_data/notes";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

interface NoteRow {
  slug: string;
  title: string;
  excerpt: string | null;
  body_markdown: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  published_at: string | null;
}

function toListItem(note: NoteDetail): NoteListItem {
  return {
    slug: note.slug,
    title: note.title,
    excerpt: note.excerpt,
    publishedAt: note.publishedAt,
    tags: note.tags,
  };
}

function mapListItem(row: NoteRow): NoteListItem {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    publishedAt: row.published_at,
    tags: row.tags ?? [],
  };
}

function mapDetail(row: NoteRow): NoteDetail {
  return {
    ...mapListItem(row),
    bodyMarkdown: row.body_markdown ?? "",
    coverImageUrl: row.cover_image_url,
  };
}

export async function getPublishedNotes(): Promise<NoteListItem[]> {
  if (!isSupabaseConfigured()) {
    return fallbackNotes.map(toListItem);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("slug, title, excerpt, tags, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !data?.length) {
    return fallbackNotes.map(toListItem);
  }

  return (data as NoteRow[]).map(mapListItem);
}

export async function getLatestNotes(limit = 3): Promise<NoteListItem[]> {
  if (!isSupabaseConfigured()) {
    return fallbackNotes.slice(0, limit).map(toListItem);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("slug, title, excerpt, tags, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error || !data?.length) {
    return fallbackNotes.slice(0, limit).map(toListItem);
  }

  return (data as NoteRow[]).map(mapListItem);
}

export async function getNoteBySlug(slug: string): Promise<NoteDetail | null> {
  const fallback = fallbackNotes.find((note) => note.slug === slug) ?? null;

  if (!isSupabaseConfigured()) {
    return fallback;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select(
      "slug, title, excerpt, body_markdown, cover_image_url, tags, published_at"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return fallback;
  }

  return mapDetail(data as NoteRow);
}
