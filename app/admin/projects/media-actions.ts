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

export async function addProjectMediaAction(projectId: string, formData: FormData) {
  const supabase = await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;


  const publicUrl = await getFormMediaUrl(supabase, formData, "media", "project-media");
  if (!publicUrl) throw new Error("Please choose an image file.");

  const { error } = await supabase.from("project_media").insert({
    project_id: projectId,
    type: "image",
    url: publicUrl,
    title: title || null,
    caption: caption || null,
    sort_order: sortOrder,
  });
  if (error) throw new Error(`Failed to save media record: ${error.message}`);

  revalidatePath(`/admin/projects/${projectId}/edit`);
  revalidatePath("/projects");
}

export async function deleteProjectMediaAction(projectId: string, mediaId: string) {
  const supabase = await requireUser();

  const { error } = await supabase.from("project_media").delete().eq("id", mediaId);
  if (error) throw new Error(`Delete failed: ${error.message}`);

  revalidatePath(`/admin/projects/${projectId}/edit`);
  revalidatePath("/projects");
}
