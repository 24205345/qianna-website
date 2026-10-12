import manifest from "./public-media-manifest.json";
const assets = manifest.assets as Record<string, { key: string; sha256: string; size: number; contentType: string }>;
/** Resolve only inventoried public files. Routes, external URLs and originals stay intact. */
export function resolvePublicMedia(src: string, baseUrl = process.env.NEXT_PUBLIC_STATIC_MEDIA_BASE_URL || ""): string {
  if (!baseUrl || !src.startsWith("/") || src.startsWith("//") || src.includes("\\")) return src;
  const suffixAt = src.search(/[?#]/);
  const pathname = suffixAt < 0 ? src : src.slice(0, suffixAt);
  let localPath: string;
  try { localPath = decodeURIComponent(pathname); } catch { return src; }
  if (!Object.hasOwn(assets, localPath)) return src;
  const key = assets[localPath].key.split("/").map(encodeURIComponent).join("/");
  return baseUrl.replace(/\/+$/, "") + "/" + key + (suffixAt < 0 ? "" : src.slice(suffixAt));
}
