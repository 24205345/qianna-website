"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

export async function createCollectionAction(formData: FormData) {
  const supabase = await requireUser();
  const payload = buildPayload(formData);

  const { error } = await supabase.from("photography_collections").insert(payload);
  if (error) throw new Error(`创建失败：${error.message}`);

  revalidatePath("/admin/photography");
  revalidatePath("/photography");
  redirect("/admin/photography");
}

export async function updateCollectionAction(id: string, formData: FormData) {
  const supabase = await requireUser();
  const payload = buildPayload(formData);

  const { error } = await supabase.from("photography_collections").update(payload).eq("id", id);
  if (error) throw new Error(`更新失败：${error.message}`);

  revalidatePath("/admin/photography");
  revalidatePath("/photography");
  redirect("/admin/photography");
}

export async function deleteCollectionAction(id: string) {
  const supabase = await requireUser();

  const { error } = await supabase.from("photography_collections").delete().eq("id", id);
  if (error) throw new Error(`删除失败：${error.message}`);

  revalidatePath("/admin/photography");
  revalidatePath("/photography");
}
