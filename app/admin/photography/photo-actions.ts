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

export async function addPhotoAction(collectionId: string, formData: FormData) {
  const supabase = await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;

  if (!title) throw new Error("Please enter a title.");

  const publicUrl = await getFormMediaUrl(supabase, formData, "photo", "photography");
  if (!publicUrl) throw new Error("Please choose an image file.");

  const { error } = await supabase.from("photography_photos").insert({
    collection_id: collectionId,
    url: publicUrl,
    title,
    date: date || null,
    location: location || null,
    description: description || null,
    sort_order: sortOrder,
  });
  if (error) throw new Error(`Failed to save photo record: ${error.message}`);

  revalidatePath(`/admin/photography/${collectionId}/edit`);
  revalidatePath("/photography");
}

export async function deletePhotoAction(collectionId: string, photoId: string) {
  const supabase = await requireUser();

  const { error } = await supabase.from("photography_photos").delete().eq("id", photoId);
  if (error) throw new Error(`Delete failed: ${error.message}`);

  revalidatePath(`/admin/photography/${collectionId}/edit`);
  revalidatePath("/photography");
}
