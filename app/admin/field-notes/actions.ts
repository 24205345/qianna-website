"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "portfolio-media";

function emptyToNull(value: FormDataEntryValue | null): string | null {
  const str = value == null ? "" : String(value).trim();
  return str.length > 0 ? str : null;
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

async function uploadCover(supabase: Awaited<ReturnType<typeof createClient>>, file: File | null) {
  if (!file || file.size === 0) return null;
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `field-notes/covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw new Error(`封面上传失败：${error.message}`);
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

function buildPayload(formData: FormData, coverUrl: string | null) {
  const payload: Record<string, unknown> = {
    title: emptyToNull(formData.get("title")) ?? "",
    slug: emptyToNull(formData.get("slug")) ?? "",
    date: emptyToNull(formData.get("date")) ?? "",
    location: emptyToNull(formData.get("location")) ?? "",
    description: emptyToNull(formData.get("description")) ?? "",
    activity: emptyToNull(formData.get("activity")),
    layout_template: emptyToNull(formData.get("layout_template")) ?? "gallery",
    status: emptyToNull(formData.get("status")) ?? "draft",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };
  if (coverUrl) payload.cover_image_url = coverUrl;
  return payload;
}

export async function createFieldNoteAction(formData: FormData) {
  const supabase = await requireUser();
  const coverUrl = await uploadCover(supabase, formData.get("cover") as File | null);
  const payload = buildPayload(formData, coverUrl);
  if (!payload.cover_image_url) throw new Error("请上传封面图");

  const { error } = await supabase.from("field_notes").insert(payload);
  if (error) throw new Error(`创建失败：${error.message}`);

  revalidatePath("/admin/field-notes");
  revalidatePath("/field-notes");
  redirect("/admin/field-notes");
}

export async function updateFieldNoteAction(id: string, formData: FormData) {
  const supabase = await requireUser();
  const coverUrl = await uploadCover(supabase, formData.get("cover") as File | null);
  const payload = buildPayload(formData, coverUrl);

  const { error } = await supabase.from("field_notes").update(payload).eq("id", id);
  if (error) throw new Error(`更新失败：${error.message}`);

  revalidatePath("/admin/field-notes");
  revalidatePath("/field-notes");
  revalidatePath(`/field-notes/${payload.slug}`);
  redirect("/admin/field-notes");
}

export async function deleteFieldNoteAction(id: string) {
  const supabase = await requireUser();
  const { error } = await supabase.from("field_notes").delete().eq("id", id);
  if (error) throw new Error(`删除失败：${error.message}`);

  revalidatePath("/admin/field-notes");
  revalidatePath("/field-notes");
}
