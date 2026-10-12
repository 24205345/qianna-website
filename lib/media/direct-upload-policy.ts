export const UPLOAD_SCOPES = ["project-cover", "project-media", "project-video", "photography", "visual-work", "field-cover", "field-media", "about-profile", "site-hero", "site-featured", "note-attachment"] as const;
export type UploadScope = typeof UPLOAD_SCOPES[number];
const imageTypes: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" };
const attachmentTypes: Record<string, string> = { ...imageTypes, "application/pdf": "pdf", "application/octet-stream": "bin", "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx", "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx", "application/zip": "zip", "application/x-zip-compressed": "zip", "text/plain": "txt", "text/markdown": "md", "text/csv": "csv", "video/mp4": "mp4", "audio/mpeg": "mp3" };
export function validateUploadInput(input: { scope: string; size: number; contentType: string; fileName: string }) {
  if (!UPLOAD_SCOPES.includes(input.scope as UploadScope)) throw new Error("Unsupported upload scope.");
  const types = input.scope === "project-video" ? { "video/mp4": "mp4" } : input.scope === "note-attachment" ? attachmentTypes : imageTypes;
  const extension = types[input.contentType as keyof typeof types];
  if (typeof extension !== "string") throw new Error("Unsupported file type. Use JPEG, PNG, WebP, GIF, AVIF or a supported Notes attachment.");
  const maxSize = input.contentType.startsWith("video/") ? 256 * 1024 * 1024 : 32 * 1024 * 1024;
  if (!Number.isSafeInteger(input.size) || input.size <= 0 || input.size > maxSize) throw new Error("File exceeds the upload limit (images / attachments: 32 MiB; MP4: 256 MiB).");
  if (typeof input.fileName !== "string" || !input.fileName || input.fileName.length > 255) throw new Error("Invalid file name.");
  return { ...input, scope: input.scope as UploadScope, extension };
}

export function getUploadContentType(fileName: string, reportedType: string) {
  if (reportedType) return reportedType;
  const extension = fileName.split(".").pop()?.toLowerCase();
  const types: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", gif: "image/gif", pdf: "application/pdf", zip: "application/zip", txt: "text/plain", md: "text/markdown", csv: "text/csv", mp4: "video/mp4", mp3: "audio/mpeg" };
  return extension && Object.hasOwn(types, extension) ? types[extension] : "application/octet-stream";
}
