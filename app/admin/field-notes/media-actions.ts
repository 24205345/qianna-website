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

export async function addFieldNoteMediaAction(fieldNoteId: string, formData: FormData) {
  const supabase = await requireUser();

  const mediaType = String(formData.get("media_type") ?? "image");
  const title = String(formData.get("title") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  const sectionKey = String(formData.get("section_key") ?? "").trim();
  const layout = String(formData.get("layout") ?? "").trim();
  const aspectRatio = String(formData.get("aspect_ratio") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;
  const videoUrl = String(formData.get("video_url") ?? "").trim();


  if (mediaType === "video_external") {
    if (!videoUrl) throw new Error("Please enter a video URL.");
    const { error } = await supabase.from("field_note_media").insert({
      field_note_id: fieldNoteId,
      type: "video_external",
      url: videoUrl,
      title: title || null,
      sort_order: sortOrder,
    });
    if (error) throw new Error(error.message);
  } else {
    const publicUrl = await getFormMediaUrl(supabase, formData, "media", "field-media");
    if (!publicUrl) throw new Error("Please choose an image file.");
    const { error } = await supabase.from("field_note_media").insert({
      field_note_id: fieldNoteId,
      type: "image",
      url: publicUrl,
      title: title || null,
      caption: caption || null,
      section_key: sectionKey || null,
      layout: layout || (sectionKey ? null : "gallery"),
      aspect_ratio: aspectRatio || null,
      sort_order: sortOrder,
    });
    if (error) throw new Error(error.message);
  }

  revalidatePath(`/admin/field-notes/${fieldNoteId}/edit`);
  revalidatePath("/field-notes");
}

export async function deleteFieldNoteMediaAction(fieldNoteId: string, mediaId: string) {
  const supabase = await requireUser();
  const { error } = await supabase.from("field_note_media").delete().eq("id", mediaId);
  if (error) throw new Error(`Delete failed: ${error.message}`);

  revalidatePath(`/admin/field-notes/${fieldNoteId}/edit`);
  revalidatePath("/field-notes");
}
