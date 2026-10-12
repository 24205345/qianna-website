import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { verifyUploadTicket, inspectUploadedObject } from "./direct-upload-core";
import type { UploadScope } from "./direct-upload-policy";
import { getUploadContentType, validateUploadInput } from "./direct-upload-policy";
import { uploadMediaObject, getMediaProvider } from "./storage-core";

export async function getFormMediaUrl(supabase: SupabaseClient, form: FormData, field: string, scope: UploadScope): Promise<string | null> {
  const receipt = form.get(field + "_upload_receipt");
  const file = form.get(field);
  if (!(typeof receipt === "string" && receipt) && (!(file instanceof File) || file.size === 0)) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.is_anonymous) throw new Error("Please log in.");
  if (typeof receipt === "string" && receipt) {
    if (user.app_metadata?.cms_role !== "admin") throw new Error("CMS admin permission is required.");
    return inspectUploadedObject(verifyUploadTicket(receipt, user.id, scope));
  }
  if (!(file instanceof File) || file.size === 0) return null;
  if (getMediaProvider() === "r2") throw new Error("Please use direct upload before saving.");
  if (file.size > 4 * 1024 * 1024) throw new Error("Large files require R2 direct upload.");
  const valid = validateUploadInput({ fileName: file.name, size: file.size, contentType: getUploadContentType(file.name, file.type), scope });
  if (scope === "site-hero") {
    const { compressHeroImage } = await import("./compress-hero-image");
    const compressed = await compressHeroImage(Buffer.from(await file.arrayBuffer()));
    return uploadMediaObject(supabase, `uploads/site-hero/${user.id}/${randomUUID()}.webp`, compressed, { contentType: "image/webp" });
  }
  return uploadMediaObject(supabase, `uploads/${scope}/${user.id}/${randomUUID()}.${valid.extension}`, file, { contentType: valid.contentType });
}
