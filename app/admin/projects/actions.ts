"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
    throw new Error(`封面上传失败：${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function buildPayload(formData: FormData, coverUrl: string | null) {
  const payload: Record<string, unknown> = {
    title: emptyToNull(formData.get("title")) ?? "",
    slug: emptyToNull(formData.get("slug")) ?? "",
    subtitle: emptyToNull(formData.get("subtitle")),
    description: emptyToNull(formData.get("description")),
    content: emptyToNull(formData.get("content")),
    category: emptyToNull(formData.get("category")),
    tags: parseTags(formData.get("tags")),
    year: emptyToNull(formData.get("year")),
    status: emptyToNull(formData.get("status")) ?? "draft",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    hero_video_url: emptyToNull(formData.get("hero_video_url")),
  };
  // 仅在本次有上传新封面时才更新 cover_image_url，避免覆盖已有值。
  if (coverUrl) {
    payload.cover_image_url = coverUrl;
  }
  return payload;
}

export async function createProjectAction(formData: FormData) {
  const supabase = await createClient();
  await requireUser(supabase);

  const coverUrl = await uploadCover(supabase, formData.get("cover") as File | null);
  const payload = buildPayload(formData, coverUrl);

  const { error } = await supabase.from("projects").insert(payload);
  if (error) {
    throw new Error(`创建失败：${error.message}`);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function updateProjectAction(id: string, formData: FormData) {
  const supabase = await createClient();
  await requireUser(supabase);

  const coverUrl = await uploadCover(supabase, formData.get("cover") as File | null);
  const payload = buildPayload(formData, coverUrl);

  const { error } = await supabase.from("projects").update(payload).eq("id", id);
  if (error) {
    throw new Error(`更新失败：${error.message}`);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: string) {
  const supabase = await createClient();
  await requireUser(supabase);

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    throw new Error(`删除失败：${error.message}`);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
