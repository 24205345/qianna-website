export const SITE_NAME = "Qianna Wang";

/** Shown in Google results & social cards — include name + portfolio keywords. */
export const DEFAULT_SITE_TITLE =
  "Qianna Wang | Urban Design & Spatial Research Portfolio";

export const DEFAULT_SITE_DESCRIPTION =
  "Personal portfolio of Qianna Wang — urban design, architecture research, visual storytelling, photography, and AI product work. Projects, notes, and spatial traces.";

const PRODUCTION_SITE_URL = "https://www.qiannawang.com";

/** Canonical production URL; override via NEXT_PUBLIC_SITE_URL. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  // Production must never use VERCEL_URL — it is per-deployment and breaks canonical/OG.
  if (process.env.VERCEL_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return PRODUCTION_SITE_URL;
}

export function buildCanonicalUrl(path: string): string {
  const siteUrl = getSiteUrl();
  if (path === "/" || path === "") {
    return `${siteUrl}/`;
  }
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
