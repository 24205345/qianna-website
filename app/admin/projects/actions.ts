"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  parseOverviewParagraphs,
  parseProjectDetails,
} from "@/lib/projects/parse-form";

const BUCKET = "portfolio-media";

function emptyToNull(value: FormDataEntryValue | null): string | null {
  const str = value == null ? "" : String(value).trim();
  return str.length > 0 ? str : null;
}

function parseTags(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

function slugifyTitle(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug || "project";
}

async function resolveUniqueProjectSlug(
  supabase: SupabaseServerClient,
  value: string,
  currentProjectId?: string
): Promise<string> {
  const baseSlug = slugifyTitle(value);
  const { data, error } = await supabase
    .from("projects")
    .select("id, slug")
    .ilike("slug", `${baseSlug}%`);

  if (error) {
    throw new Error(`Failed to check project URL: ${error.message}`);
  }

  const usedSlugs = new Set(
    (data ?? [])
      .filter((project) => project.id !== currentProjectId)
      .map((project) => project.slug)
  );

  if (!usedSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;
  while (usedSlugs.has(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseSlug}-${suffix}`;
}

async function requireUser(supabase: SupabaseServerClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }
}

async function uploadCover(
  supabase: SupabaseServerClient,
  file: File | null
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `covers/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) {
    throw new Error(`Cover upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function buildPayload(formData: FormData, coverUrl: string | null, slug: string) {
  const payload: Record<string, unknown> = {
    title: emptyToNull(formData.get("title")) ?? "",
    slug,
    subtitle: emptyToNull(formData.get("subtitle")),
    description: emptyToNull(formData.get("description")),
    content: emptyToNull(formData.get("content")),
    category: emptyToNull(formData.get("category")),
    tags: parseTags(formData.get("tags")),
    year: emptyToNull(formData.get("year")),
    status: emptyToNull(formData.get("status")) ?? "draft",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    hero_video_url: emptyToNull(formData.get("hero_video_url")),
    intro_video_url: emptyToNull(formData.get("intro_video_url")),
    layout_template: emptyToNull(formData.get("layout_template")) ?? "default",
    overview_paragraphs: parseOverviewParagraphs(formData.get("overview_paragraphs")),
    project_details: parseProjectDetails(formData.get("project_details")),
  };
  // Only update cover_image_url when a new cover is uploaded, so existing values are preserved.
  if (coverUrl) {
    payload.cover_image_url = coverUrl;
  }
  return payload;
}

export async function createProjectAction(formData: FormData) {
  const supabase = await createClient();
  await requireUser(supabase);

  const coverUrl = await uploadCover(supabase, formData.get("cover") as File | null);
  const title = emptyToNull(formData.get("title")) ?? "";
  const slug = await resolveUniqueProjectSlug(
    supabase,
    emptyToNull(formData.get("slug")) ?? title
  );
  const payload = buildPayload(formData, coverUrl, slug);

  const { error } = await supabase.from("projects").insert(payload);
  if (error) {
    throw new Error(`Create failed: ${error.message}`);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${payload.slug}`);
  redirect("/admin/projects");
}

export async function updateProjectAction(id: string, formData: FormData) {
  const supabase = await createClient();
  await requireUser(supabase);

  const coverUrl = await uploadCover(supabase, formData.get("cover") as File | null);
  const title = emptyToNull(formData.get("title")) ?? "";
  const slug = await resolveUniqueProjectSlug(
    supabase,
    emptyToNull(formData.get("slug")) ?? title,
    id
  );
  const payload = buildPayload(formData, coverUrl, slug);

  const { error } = await supabase.from("projects").update(payload).eq("id", id);
  if (error) {
    throw new Error(`Update failed: ${error.message}`);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${payload.slug}`);
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: string) {
  const supabase = await createClient();
  await requireUser(supabase);

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
