import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/constants";
import {
  getPublishedFieldNoteEntries,
  getPublishedNoteEntries,
  getPublishedProjectEntries,
} from "@/lib/seo/sitemap-data";

const STATIC_PATHS = [
  "/",
  "/about",
  "/notes",
  "/projects",
  "/traces",
  "/photography",
  "/visual-works",
  "/field-notes",
  "/guestbook",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [projects, notes, fieldNotes] = await Promise.all([
    getPublishedProjectEntries(),
    getPublishedNoteEntries(),
    getPublishedFieldNoteEntries(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const dynamicEntries: MetadataRoute.Sitemap = [...projects, ...notes, ...fieldNotes].map(
    (entry) => ({
      url: `${siteUrl}${entry.path}`,
      lastModified: entry.lastModified,
      changeFrequency: entry.path.startsWith("/notes/") ? "monthly" : "yearly",
      priority: entry.path.startsWith("/notes/") ? 0.6 : 0.8,
    })
  );

  return [...staticEntries, ...dynamicEntries];
}
