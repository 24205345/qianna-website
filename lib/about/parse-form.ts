import type { AboutTimelineItem } from "@/app/_data/about-page";

export function parseTimelineEntriesFromFormData(formData: FormData): AboutTimelineItem[] {
  const count = Number(formData.get("timeline_count") ?? 0) || 0;

  return Array.from({ length: count }, (_, index) => ({
    period: String(formData.get(`timeline_${index}_period`) ?? "").trim(),
    title: String(formData.get(`timeline_${index}_title`) ?? "").trim(),
    description: String(formData.get(`timeline_${index}_description`) ?? "").trim(),
    sortOrder: Number(formData.get(`timeline_${index}_sort_order`) ?? index) || 0,
  }))
    .filter((item) => item.period && item.title)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/** @deprecated Use parseTimelineEntriesFromFormData for admin forms. */
export function parseTimelineRows(value: FormDataEntryValue | null): AboutTimelineItem[] {
  const text = value == null ? "" : String(value).trim();
  if (!text) return [];

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const parts = line.split("|").map((part) => part.trim());
      return {
        period: parts[0] ?? "",
        title: parts[1] ?? "",
        description: parts[2] ?? "",
        sortOrder: index,
      };
    })
    .filter((item) => item.period && item.title);
}

export function serializeTimelineRows(items: AboutTimelineItem[]): string {
  return items
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => `${item.period}|${item.title}|${item.description}`)
    .join("\n");
}

export function parseTagLines(value: FormDataEntryValue | null): string[] {
  const text = value == null ? "" : String(value).trim();
  if (!text) return [];

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function serializeTagLines(tags: string[]): string {
  return tags.join("\n");
}
