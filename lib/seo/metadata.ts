import type { Metadata } from "next";
import { buildCanonicalUrl, SITE_NAME } from "./constants";

const MAX_DESCRIPTION = 160;

export function truncateDescription(text: string, max = MAX_DESCRIPTION): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return "";
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
  /** Use for homepage — skip root layout title template suffix. */
  absoluteTitle?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const desc = truncateDescription(description);
  const canonical = buildCanonicalUrl(path);
  const openGraphImages = image
    ? [{ url: image, alt: title }]
    : undefined;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc || undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: desc || undefined,
      url: canonical,
      siteName: SITE_NAME,
      type,
      locale: "en_US",
      ...(openGraphImages ? { images: openGraphImages } : {}),
    },
    twitter: {
      card: openGraphImages ? "summary_large_image" : "summary",
      title,
      description: desc || undefined,
      ...(openGraphImages ? { images: openGraphImages.map((item) => item.url) } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
