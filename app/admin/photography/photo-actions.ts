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

export async function addPhotoAction(collectionId: string, formData: FormData) {
  const supabase = await requireUser();

  const file = formData.get("photo") as File | null;
  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;

  if (!file || file.size === 0) throw new Error("请选择图片文件");
  if (!title) throw new Error("请填写标题");

  const { data: collection } = await supabase
    .from("photography_collections")
    .select("slug")
    .eq("id", collectionId)
    .single();

  const slug = collection?.slug ?? collectionId;
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `photography/${slug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (uploadError) throw new Error(`上传失败：${uploadError.message}`);

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { error } = await supabase.from("photography_photos").insert({
    collection_id: collectionId,
    url: urlData.publicUrl,
    title,
    date: date || null,
    location: location || null,
    description: description || null,
    sort_order: sortOrder,
  });
  if (error) throw new Error(`保存照片记录失败：${error.message}`);

  revalidatePath(`/admin/photography/${collectionId}/edit`);
  revalidatePath("/photography");
}

export async function deletePhotoAction(collectionId: string, photoId: string) {
  const supabase = await requireUser();

  const { error } = await supabase.from("photography_photos").delete().eq("id", photoId);
  if (error) throw new Error(`删除失败：${error.message}`);

  revalidatePath(`/admin/photography/${collectionId}/edit`);
  revalidatePath("/photography");
}
