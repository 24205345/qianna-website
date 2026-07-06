"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getNextStatus } from "@/lib/admin/content-status";

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

function buildPayload(formData: FormData) {
  return {
    title: emptyToNull(formData.get("title")) ?? "",
    slug: emptyToNull(formData.get("slug")) ?? "",
    subtitle: emptyToNull(formData.get("subtitle")),
    description: emptyToNull(formData.get("description")),
    status: emptyToNull(formData.get("status")) ?? "draft",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };
}

export async function createCategoryAction(formData: FormData) {
  const supabase = await requireUser();
  const payload = buildPayload(formData);

  const { error } = await supabase.from("visual_work_categories").insert(payload);
  if (error) throw new Error(`Create failed: ${error.message}`);

  revalidatePath("/admin/visual-works");
  revalidatePath("/visual-works");
  redirect("/admin/visual-works");
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const supabase = await requireUser();
  const payload = buildPayload(formData);

  const { error } = await supabase.from("visual_work_categories").update(payload).eq("id", id);
  if (error) throw new Error(`Update failed: ${error.message}`);

  revalidatePath("/admin/visual-works");
  revalidatePath("/visual-works");
  redirect("/admin/visual-works");
}

export async function deleteCategoryAction(id: string) {
  const supabase = await requireUser();

  const { error } = await supabase.from("visual_work_categories").delete().eq("id", id);
  if (error) throw new Error(`Delete failed: ${error.message}`);

  revalidatePath("/admin/visual-works");
  revalidatePath("/visual-works");
}

export async function toggleCategoryStatusAction(id: string) {
  const supabase = await requireUser();

  const { data, error: fetchError } = await supabase
    .from("visual_work_categories")
    .select("status, slug")
    .eq("id", id)
    .single();

  if (fetchError || !data) {
    throw new Error(`Failed to load category: ${fetchError?.message ?? "Not found"}`);
  }

  const { error } = await supabase
    .from("visual_work_categories")
    .update({ status: getNextStatus(data.status) })
    .eq("id", id);

  if (error) {
    throw new Error(`Visibility update failed: ${error.message}`);
  }

  revalidatePath("/admin/visual-works");
  revalidatePath("/visual-works");
}
