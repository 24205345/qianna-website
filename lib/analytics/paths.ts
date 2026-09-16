import type { AnalyticsContentType } from "./types";

export function getAnalyticsPublicPath(
  contentType: AnalyticsContentType,
  contentSlug: string
): string {
  switch (contentType) {
    case "note":
      return `/notes/${contentSlug}`;
    case "project":
      return `/projects/${contentSlug}`;
    case "photography":
      return `/photography#${contentSlug}`;
    case "page":
      if (contentSlug === "home") return "/";
      return `/${contentSlug}`;
  }
}

export function getAnalyticsContentLabel(
  contentType: AnalyticsContentType
): string {
  switch (contentType) {
    case "note":
      return "Notes";
    case "project":
      return "Projects";
    case "photography":
      return "Photography";
    case "page":
      return "Pages";
  }
}
