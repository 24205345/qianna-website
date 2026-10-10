"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadMediaObject } from "@/lib/media/storage";

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

  const file = formData.get("photo") as File | null;
  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;

  if (!file || file.size === 0) throw new Error("Please choose an image file.");
  if (!title) throw new Error("Please enter a title.");

  const { data: collection } = await supabase
    .from("photography_collections")
    .select("slug")
    .eq("id", collectionId)
    .single();

  const slug = collection?.slug ?? collectionId;
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `photography/${slug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const publicUrl = await uploadMediaObject(supabase, path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });

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
