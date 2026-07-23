"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getNextStatus } from "@/lib/admin/content-status";
import {
  emptyToNull,
  parseTags,
  slugifyNoteTitle,
  truncateExcerpt,
} from "@/lib/notes/parse-form";
import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

async function resolveUniqueNoteSlug(
  supabase: SupabaseServerClient,
  value: string,
  currentNoteId?: string
): Promise<string> {
  const baseSlug = slugifyNoteTitle(value);
  const { data, error } = await supabase
    .from("notes")
    .select("id, slug")
    .ilike("slug", `${baseSlug}%`);

  if (error) {
    throw new Error(`Failed to check note URL: ${error.message}`);
  }

  const usedSlugs = new Set(
    (data ?? [])
      .filter((note) => note.id !== currentNoteId)
      .map((note) => note.slug)
  );

  if (!usedSlugs.has(baseSlug)) return baseSlug;

  let suffix = 2;
  while (usedSlugs.has(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }
  return `${baseSlug}-${suffix}`;
}

function revalidateNotePaths(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/notes");
  revalidatePath("/admin/notes");
  if (slug) {
    revalidatePath(`/notes/${slug}`);
  }
}

async function buildPayload(
  supabase: SupabaseServerClient,
  formData: FormData,
  currentNoteId?: string,
  previousStatus?: string | null,
  previousPublishedAt?: string | null
) {
  const title = emptyToNull(formData.get("title")) ?? "";
  const requestedSlug = emptyToNull(formData.get("slug"));
  const slug = await resolveUniqueNoteSlug(
    supabase,
    requestedSlug || title,
    currentNoteId
  );
  const status = emptyToNull(formData.get("status")) ?? "draft";
  const excerpt = truncateExcerpt(emptyToNull(formData.get("excerpt")) ?? "");

  let publishedAt = previousPublishedAt ?? null;
  if (status === "published") {
    publishedAt = previousPublishedAt ?? new Date().toISOString();
  } else if (previousStatus === "published" && status === "draft") {
    publishedAt = previousPublishedAt ?? null;
  }

  return {
    title,
    slug,
    excerpt,
    body_markdown: emptyToNull(formData.get("body_markdown")) ?? "",
    cover_image_url: emptyToNull(formData.get("cover_image_url")),
    tags: parseTags(formData.get("tags")),
    status,
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    published_at: status === "published" ? publishedAt : publishedAt,
  };
}

export async function createNoteAction(formData: FormData) {
  const supabase = await requireUser();
  const payload = await buildPayload(supabase, formData);

  if (!payload.title) {
    throw new Error("Title is required.");
  }

  const { error } = await supabase.from("notes").insert(payload);
  if (error) throw new Error(`Create failed: ${error.message}`);

  revalidateNotePaths(payload.slug);
  redirect("/admin/notes");
}

export async function updateNoteAction(id: string, formData: FormData) {
  const supabase = await requireUser();

  const { data: existing, error: fetchError } = await supabase
    .from("notes")
    .select("status, published_at, slug")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    throw new Error(`Failed to load note: ${fetchError?.message ?? "Not found"}`);
  }

  const payload = await buildPayload(
    supabase,
    formData,
    id,
    existing.status,
    existing.published_at
  );

  if (!payload.title) {
    throw new Error("Title is required.");
  }

  const { error } = await supabase.from("notes").update(payload).eq("id", id);
  if (error) throw new Error(`Update failed: ${error.message}`);

  revalidateNotePaths(payload.slug);
  if (existing.slug !== payload.slug) {
    revalidatePath(`/notes/${existing.slug}`);
  }
  redirect("/admin/notes");
}

export async function deleteNoteAction(id: string) {
  const supabase = await requireUser();

  const { data } = await supabase
    .from("notes")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw new Error(`Delete failed: ${error.message}`);

  revalidateNotePaths(data?.slug ?? null);
}

export async function toggleNoteStatusAction(id: string) {
  const supabase = await requireUser();

  const { data, error: fetchError } = await supabase
    .from("notes")
    .select("status, slug, published_at")
    .eq("id", id)
    .single();

  if (fetchError || !data) {
    throw new Error(`Failed to load note: ${fetchError?.message ?? "Not found"}`);
  }

  const nextStatus = getNextStatus(data.status);
  const update: { status: string; published_at?: string | null } = {
    status: nextStatus,
  };

  if (nextStatus === "published" && !data.published_at) {
    update.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from("notes").update(update).eq("id", id);
  if (error) {
    throw new Error(`Visibility update failed: ${error.message}`);
  }

  revalidateNotePaths(data.slug);
}

const BUCKET = "portfolio-media";

/** Upload an image/file for Notes editor; returns public URL for Markdown insert. */
export async function uploadNoteAttachmentAction(
  formData: FormData
): Promise<{ url: string; fileName: string }> {
  const supabase = await requireUser();
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    throw new Error("Please choose a file to upload.");
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const safeName = file.name.replace(/[^\w.\-]+/g, "-").slice(0, 80);
  const path = `notes/attachments/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}-${safeName || `file.${ext}`}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, fileName: file.name };
}
