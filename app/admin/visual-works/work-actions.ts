"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "portfolio-media";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

export async function addWorkAction(categoryId: string, formData: FormData) {
  const supabase = await requireUser();

  const file = formData.get("work") as File | null;
  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;

  if (!file || file.size === 0) throw new Error("Please choose an image file.");
  if (!title) throw new Error("Please enter a title.");

  const { data: category } = await supabase
    .from("visual_work_categories")
    .select("slug")
    .eq("id", categoryId)
    .single();

  const slug = category?.slug ?? categoryId;
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `visual-works/${slug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { error } = await supabase.from("visual_works").insert({
    category_id: categoryId,
    url: urlData.publicUrl,
    title,
    date: date || null,
    description: description || null,
    sort_order: sortOrder,
  });
  if (error) throw new Error(`Failed to save work record: ${error.message}`);

  revalidatePath(`/admin/visual-works/${categoryId}/edit`);
  revalidatePath("/visual-works");
}

export async function deleteWorkAction(categoryId: string, workId: string) {
  const supabase = await requireUser();

  const { error } = await supabase.from("visual_works").delete().eq("id", workId);
  if (error) throw new Error(`Delete failed: ${error.message}`);

  revalidatePath(`/admin/visual-works/${categoryId}/edit`);
  revalidatePath("/visual-works");
}
