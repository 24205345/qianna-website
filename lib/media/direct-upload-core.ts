import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";
import { HeadObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createR2Client, getR2PublicUrl } from "./storage-core";
import { validateUploadInput, type UploadScope } from "./direct-upload-policy";

type Env = Record<string, string | undefined>;
export interface UploadTicket {
  version: 1; stage: "pending" | "complete"; userId: string; key: string;
  scope: UploadScope; size: number; contentType: string; expiresAt: number;
}
function mac(payload: string, env: Env) {
  if (!env.R2_SECRET_ACCESS_KEY) throw new Error("Missing R2 upload configuration.");
  const key = createHmac("sha256", env.R2_SECRET_ACCESS_KEY).update("qianna:media-receipt:v1").digest();
  return createHmac("sha256", key).update(payload).digest();
}
export function signUploadTicket(ticket: UploadTicket, env: Env = process.env) {
  const payload = Buffer.from(JSON.stringify(ticket)).toString("base64url");
  return payload + "." + mac(payload, env).toString("base64url");
}
export function verifyUploadTicket(token: string, userId: string, scope?: UploadScope, stage: UploadTicket["stage"] = "complete", env: Env = process.env): UploadTicket {
  if (typeof token !== "string" || token.length > 2048) throw new Error("Invalid upload receipt.");
  const parts = token.split(".");
  const signature = Buffer.from(parts[1] ?? "", "base64url");
  const expected = mac(parts[0], env);
  if (parts.length !== 2 || signature.length !== expected.length || !timingSafeEqual(signature, expected)) throw new Error("Invalid upload receipt.");
  const t = JSON.parse(Buffer.from(parts[0], "base64url").toString()) as UploadTicket;
  if (t.version !== 1 || t.stage !== stage || t.userId !== userId || (scope && t.scope !== scope) ||
      !Number.isFinite(t.expiresAt) || t.expiresAt <= Date.now() ||
      !t.key.startsWith(`uploads/${t.scope}/${userId}/`)) throw new Error("Expired or mismatched upload receipt. Upload again.");
  validateUploadInput({ ...t, fileName: "receipt" });
  return t;
}
export async function prepareDirectUpload(userId: string, input: Parameters<typeof validateUploadInput>[0], env: Env = process.env) {
  const valid = validateUploadInput(input);
  const key = `uploads/${valid.scope}/${userId}/${randomUUID()}.${valid.extension}`;
  const ticket: UploadTicket = { version: 1, stage: "pending", userId, key, scope: valid.scope, size: valid.size, contentType: valid.contentType, expiresAt: Date.now() + 10 * 60_000 };
  const disposition = valid.contentType.startsWith("image/") || valid.contentType === "video/mp4" ? "inline" : "attachment";
  const headers = { "Content-Type": valid.contentType, "If-None-Match": "*", "Cache-Control": "public, max-age=31536000, immutable", "Content-Disposition": disposition, "x-amz-meta-upload-user": userId, "x-amz-meta-upload-scope": valid.scope };
  const client = createR2Client(env);
  try {
    const uploadUrl = await getSignedUrl(client, new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME, Key: key, ContentType: valid.contentType, ContentLength: valid.size,
      IfNoneMatch: "*", CacheControl: "public, max-age=31536000, immutable",
      ContentDisposition: disposition,
      Metadata: { "upload-user": userId, "upload-scope": valid.scope },
    }), { expiresIn: 600, unhoistableHeaders: new Set(["x-amz-meta-upload-user", "x-amz-meta-upload-scope"]), signableHeaders: new Set(["content-type", "content-length", "if-none-match"]) });
    return { provider: "r2" as const, uploadUrl, headers, ticket: signUploadTicket(ticket, env) };
  } finally { client.destroy(); }
}
export async function inspectUploadedObject(ticket: UploadTicket, env: Env = process.env) {
  const client = createR2Client(env);
  try {
    const result = await client.send(new HeadObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: ticket.key }));
    if (result.ContentLength !== ticket.size || result.ContentType !== ticket.contentType ||
        result.Metadata?.["upload-user"] !== ticket.userId || result.Metadata?.["upload-scope"] !== ticket.scope) throw new Error("Uploaded file verification failed.");
    return getR2PublicUrl(ticket.key, env);
  } finally { client.destroy(); }
}
function matchesUploadSignature(bytes: Uint8Array, type: string) {
  const b = Buffer.from(bytes);
  if (type === "image/jpeg") return b.subarray(0, 3).equals(Buffer.from([255,216,255]));
  if (type === "image/png") return b.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if (type === "image/gif") return /^GIF8[79]a/.test(b.toString("ascii", 0, 6));
  if (type === "image/webp") return b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP";
  if (type === "image/avif") return b.toString("ascii", 4, 8) === "ftyp" && /avif|avis/.test(b.toString("ascii", 8, 32));
  if (type === "video/mp4") return b.toString("ascii", 4, 8) === "ftyp";
  if (type === "application/pdf") return b.toString("ascii", 0, 5) === "%PDF-";
  if (type === "application/zip" || type === "application/x-zip-compressed") return b.subarray(0, 2).toString("ascii") === "PK";
  return true;
}
export async function completeDirectUpload(userId: string, token: string, env: Env = process.env) {
  const ticket = verifyUploadTicket(token, userId, undefined, "pending", env);
  let url = await inspectUploadedObject(ticket, env);
  if (ticket.contentType.startsWith("image/") || ["video/mp4", "application/pdf", "application/zip", "application/x-zip-compressed"].includes(ticket.contentType)) {
    const client = createR2Client(env);
    try {
      const response = await client.send(new GetObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: ticket.key, Range: "bytes=0-31" }));
      if (!response.Body || !matchesUploadSignature(await response.Body.transformToByteArray(), ticket.contentType)) throw new Error("File contents do not match the file type.");
    } finally { client.destroy(); }
  }
  if (ticket.scope === "site-hero") {
    const client = createR2Client(env);
    try {
      const response = await client.send(new GetObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: ticket.key }));
      if (!response.Body) throw new Error("Unable to read hero image.");
      const { compressHeroImage } = await import("./compress-hero-image");
      const compressed = await compressHeroImage(Buffer.from(await response.Body.transformToByteArray()));
      ticket.key = `uploads/site-hero/${userId}/${randomUUID()}.webp`;
      ticket.contentType = "image/webp"; ticket.size = compressed.length;
      await client.send(new PutObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: ticket.key, Body: compressed, ContentType: ticket.contentType, IfNoneMatch: "*", CacheControl: "public, max-age=31536000, immutable", Metadata: { "upload-user": userId, "upload-scope": ticket.scope } }));
      url = await inspectUploadedObject(ticket, env);
    } finally { client.destroy(); }
  }
  const receipt = signUploadTicket({ ...ticket, stage: "complete", expiresAt: Date.now() + 24 * 60 * 60_000 }, env);
  return { url, receipt };
}
