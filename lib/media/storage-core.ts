import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { SupabaseClient } from "@supabase/supabase-js";

export const MEDIA_BUCKET = "portfolio-media";
type Environment = Record<string, string | undefined>;

export function getMediaProvider(env: Environment = process.env) {
  const provider = env.MEDIA_STORAGE_PROVIDER?.trim() || "supabase";
  if (provider !== "supabase" && provider !== "r2") {
    throw new Error("MEDIA_STORAGE_PROVIDER must be supabase or r2.");
  }
  return provider;
}

export function validateObjectKey(key: string) {
  if (!key || key.startsWith("/") || key.includes("\\") || /[\x00-\x1f\x7f]/.test(key) ||
      key.split("/").some((part) => !part || part === "." || part === "..")) {
    throw new Error("Invalid media object key.");
  }
  return key;
}

export function getR2PublicBaseUrl(env: Environment = process.env) {
  if (!env.R2_PUBLIC_BASE_URL?.trim()) throw new Error("Missing R2_PUBLIC_BASE_URL.");
  const url = new URL(env.R2_PUBLIC_BASE_URL.trim());
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash ||
      url.hostname.endsWith(".r2.cloudflarestorage.com")) {
    throw new Error("R2_PUBLIC_BASE_URL must be a public HTTPS media URL, without credentials or query parameters.");
  }
  return url.href.replace(/\/+$/, "");
}

export function getR2PublicUrl(key: string, env: Environment = process.env) {
  return `${getR2PublicBaseUrl(env)}/${validateObjectKey(key).split("/").map(encodeURIComponent).join("/")}`;
}

export function createR2Client(env: Environment = process.env) {
  for (const name of ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME"]) {
    if (!env[name]?.trim()) throw new Error(`Missing ${name}.`);
  }
  if (!/^[a-f0-9]{32}$/i.test(env.R2_ACCOUNT_ID!.trim())) throw new Error("Invalid R2_ACCOUNT_ID.");
  getR2PublicBaseUrl(env);
  return new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID!.trim()}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID!.trim(),
      secretAccessKey: env.R2_SECRET_ACCESS_KEY!.trim(),
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
}

export interface UploadMediaOptions {
  contentType?: string;
  upsert?: boolean;
  cacheControl?: string;
}

/** Shared by authenticated Server Actions and local scripts. No credentials in return values. */
export async function uploadMediaObject(
  supabase: SupabaseClient,
  key: string,
  body: File | Blob | Buffer,
  options: UploadMediaOptions = {},
  env: Environment = process.env,
): Promise<string> {
  validateObjectKey(key);
  if (getMediaProvider(env) === "supabase") {
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(key, body, {
      contentType: options.contentType,
      upsert: options.upsert ?? false,
    });
    if (error) throw new Error(`Media upload failed: ${error.message}`);
    return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(key).data.publicUrl;
  }

  const client = createR2Client(env);
  try {
    const buffer = Buffer.isBuffer(body) ? body : Buffer.from(await body.arrayBuffer());
    await client.send(new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME!.trim(),
      Key: key,
      Body: buffer,
      ContentType: options.contentType || "application/octet-stream",
      CacheControl: options.cacheControl || (options.upsert ? "public, max-age=3600" : "public, max-age=31536000, immutable"),
      IfNoneMatch: options.upsert ? undefined : "*",
    }));
    return getR2PublicUrl(key, env);
  } finally {
    client.destroy();
  }
}
