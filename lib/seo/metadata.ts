import type { Metadata } from "next";
import { SITE_NAME } from "./constants";

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
}

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
}: PageMetadataInput): Metadata {
  const desc = truncateDescription(description);
  const openGraphImages = image
    ? [{ url: image, alt: title }]
    : undefined;

  return {
    title,
    description: desc || undefined,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description: desc || undefined,
      url: path,
      siteName: SITE_NAME,
      type,
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
