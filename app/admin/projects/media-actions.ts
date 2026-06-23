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

export async function addProjectMediaAction(projectId: string, formData: FormData) {
  const supabase = await requireUser();

  const file = formData.get("media") as File | null;
  const title = String(formData.get("title") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;

  if (!file || file.size === 0) {
    throw new Error("请选择图片文件");
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `projects/${projectId}/images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (uploadError) throw new Error(`上传失败：${uploadError.message}`);

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { error } = await supabase.from("project_media").insert({
    project_id: projectId,
    type: "image",
    url: urlData.publicUrl,
    title: title || null,
    caption: caption || null,
    sort_order: sortOrder,
  });
  if (error) throw new Error(`保存媒体记录失败：${error.message}`);

  revalidatePath(`/admin/projects/${projectId}/edit`);
  revalidatePath("/projects");
}

export async function deleteProjectMediaAction(projectId: string, mediaId: string) {
  const supabase = await requireUser();

  const { error } = await supabase.from("project_media").delete().eq("id", mediaId);
  if (error) throw new Error(`删除失败：${error.message}`);

  revalidatePath(`/admin/projects/${projectId}/edit`);
  revalidatePath("/projects");
}
