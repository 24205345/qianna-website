export interface NoteListItem {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string | null;
  tags: string[];
}

export interface NoteDetail extends NoteListItem {
  bodyMarkdown: string;
  coverImageUrl: string | null;
}

/** Static fallback when Supabase is unavailable (empty until CMS content exists). */
export const fallbackNotes: NoteDetail[] = [];
