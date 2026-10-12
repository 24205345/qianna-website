import type { UploadScope } from "./direct-upload-policy";
import { getUploadContentType, validateUploadInput } from "./direct-upload-policy";

async function uploadRequest(body: unknown) {
  const response = await fetch("/api/admin/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Upload request failed.");
  return result;
}
export async function uploadFileDirect(file: File, scope: UploadScope) {
  const input = validateUploadInput({ fileName: file.name, contentType: getUploadContentType(file.name, file.type), size: file.size, scope });
  const prepared = await uploadRequest({ phase: "prepare", ...input });
  if (prepared.provider === "supabase") {
    if (file.size > 4 * 1024 * 1024) throw new Error("Files over 4 MiB require R2 direct upload.");
    return null;
  }
  const put = await fetch(prepared.uploadUrl, { method: "PUT", headers: prepared.headers, body: file });
  if (!put.ok) throw new Error("Direct upload failed. Check your connection and try again.");
  return uploadRequest({ phase: "complete", ticket: prepared.ticket }) as Promise<{ url: string; receipt: string }>;
}
export async function prepareFormUploads(form: FormData, fields: Record<string, UploadScope>) {
  for (const [field, scope] of Object.entries(fields)) {
    const file = form.get(field);
    if (!(file instanceof File)) continue;
    if (!file.size) { form.delete(field); continue; }
    const result = await uploadFileDirect(file, scope);
    if (result) {
      form.delete(field);
      form.set(field + "_upload_receipt", result.receipt);
    }
  }
  return form;
}
