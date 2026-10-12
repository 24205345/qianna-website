"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFormMediaUrl } from "@/lib/media/form-upload";

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

  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;

  if (!title) throw new Error("Please enter a title.");

  const publicUrl = await getFormMediaUrl(supabase, formData, "work", "visual-work");
  if (!publicUrl) throw new Error("Please choose an image file.");

  const { error } = await supabase.from("visual_works").insert({
    category_id: categoryId,
    url: publicUrl,
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
