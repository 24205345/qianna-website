export interface NoteListItem {
  slug: string;
  /** Display title for list/home (English-first). */
  title: string;
  /** Display excerpt for list/home (English-first). */
  excerpt: string;
  publishedAt: string | null;
  tags: string[];
}

export interface NoteDetail extends NoteListItem {
  titleZh: string;
  titleEn: string;
  excerptZh: string;
  excerptEn: string;
  bodyMarkdownZh: string;
  bodyMarkdownEn: string;
  coverImageUrl: string | null;
}

/** Static fallback when Supabase is unavailable. */
export const fallbackNotes: NoteDetail[] = [];
