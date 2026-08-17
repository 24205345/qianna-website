export const SITE_NAME = "Qianna Wang";

export const DEFAULT_SITE_TITLE =
  "Qianna Wang — Spatial Research & Design Portfolio";

export const DEFAULT_SITE_DESCRIPTION =
  "Personal portfolio of Qianna Wang — spatial research, urban design, visual storytelling, and AI product work.";

/** Canonical production URL; override locally via NEXT_PUBLIC_SITE_URL. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://www.qiannawang.com";
}
