import { projects as fallbackProjects } from "@/app/_data/projects";
import { fieldNoteDetails } from "@/app/_data/field-note-details";
import { fallbackNotes } from "@/app/_data/notes";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface SitemapEntry {
  path: string;
  lastModified?: Date;
}

export async function getPublishedProjectEntries(): Promise<SitemapEntry[]> {
  if (!isSupabaseConfigured()) {
    return fallbackProjects.map((project) => ({
      path: `/projects/${project.slug}`,
    }));
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackProjects.map((project) => ({
      path: `/projects/${project.slug}`,
    }));
  }

  return data.map((row) => ({
    path: `/projects/${row.slug}`,
    lastModified: row.updated_at ? new Date(row.updated_at) : undefined,
  }));
}

export async function getPublishedNoteEntries(): Promise<SitemapEntry[]> {
  if (!isSupabaseConfigured()) {
    return fallbackNotes.map((note) => ({
      path: `/notes/${note.slug}`,
      lastModified: note.publishedAt ? new Date(note.publishedAt) : undefined,
    }));
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("slug, published_at, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !data?.length) {
    return fallbackNotes.map((note) => ({
      path: `/notes/${note.slug}`,
      lastModified: note.publishedAt ? new Date(note.publishedAt) : undefined,
    }));
  }

  return data.map((row) => ({
    path: `/notes/${row.slug}`,
    lastModified: row.updated_at
      ? new Date(row.updated_at)
      : row.published_at
        ? new Date(row.published_at)
        : undefined,
  }));
}

export async function getPublishedFieldNoteEntries(): Promise<SitemapEntry[]> {
  if (!isSupabaseConfigured()) {
    return fieldNoteDetails.map((note) => ({
      path: `/field-notes/${note.slug}`,
    }));
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("field_notes")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fieldNoteDetails.map((note) => ({
      path: `/field-notes/${note.slug}`,
    }));
  }

  return data.map((row) => ({
    path: `/field-notes/${row.slug}`,
    lastModified: row.updated_at ? new Date(row.updated_at) : undefined,
  }));
}
