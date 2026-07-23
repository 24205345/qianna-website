import {
  fallbackNotes,
  type NoteDetail,
  type NoteListItem,
} from "@/app/_data/notes";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

interface NoteRow {
  slug: string;
  title: string;
  title_en: string | null;
  excerpt: string | null;
  excerpt_en: string | null;
  body_markdown: string | null;
  body_markdown_en: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  published_at: string | null;
}

function pickEnglish(primary: string | null | undefined, fallback: string): string {
  const value = primary?.trim();
  return value ? value : fallback;
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

function mapDetail(row: NoteRow): NoteDetail {
  const titleZh = row.title;
  const titleEn = pickEnglish(row.title_en, titleZh);
  const excerptZh = row.excerpt ?? "";
  const excerptEn = pickEnglish(row.excerpt_en, excerptZh);
  const bodyZh = row.body_markdown ?? "";
  const bodyEn = pickEnglish(row.body_markdown_en, bodyZh);

  return {
    slug: row.slug,
    // List/home always prefer English.
    title: titleEn,
    excerpt: excerptEn,
    titleZh,
    titleEn,
    excerptZh,
    excerptEn,
    bodyMarkdownZh: bodyZh,
    bodyMarkdownEn: bodyEn,
    coverImageUrl: row.cover_image_url,
    publishedAt: row.published_at,
    tags: row.tags ?? [],
  };
}

const DETAIL_SELECT =
  "slug, title, title_en, excerpt, excerpt_en, body_markdown, body_markdown_en, cover_image_url, tags, published_at";

export async function getPublishedNotes(): Promise<NoteListItem[]> {
  if (!isSupabaseConfigured()) {
    return fallbackNotes.map(toListItem);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select(DETAIL_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !data?.length) {
    return fallbackNotes.map(toListItem);
  }

  return (data as NoteRow[]).map((row) => toListItem(mapDetail(row)));
}

export async function getLatestNotes(limit = 3): Promise<NoteListItem[]> {
  if (!isSupabaseConfigured()) {
    return fallbackNotes.slice(0, limit).map(toListItem);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select(DETAIL_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error || !data?.length) {
    return fallbackNotes.slice(0, limit).map(toListItem);
  }

  return (data as NoteRow[]).map((row) => toListItem(mapDetail(row)));
}

export async function getNoteBySlug(slug: string): Promise<NoteDetail | null> {
  const fallback = fallbackNotes.find((note) => note.slug === slug) ?? null;

  if (!isSupabaseConfigured()) {
    return fallback;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select(DETAIL_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return fallback;
  }

  return mapDetail(data as NoteRow);
}
