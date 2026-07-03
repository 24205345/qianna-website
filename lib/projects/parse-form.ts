import type { ProjectDetailItem } from "@/app/_data/project-details";

/** Overview：段落之间用空行分隔 */
export function parseOverviewParagraphs(raw: FormDataEntryValue | null): string[] {
  if (!raw) return [];
  return String(raw)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Project Details：每行格式 Label|Value */
export function parseProjectDetails(raw: FormDataEntryValue | null): ProjectDetailItem[] {
  if (!raw) return [];
  return String(raw)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const sep = line.indexOf("|");
      if (sep === -1) return { label: line, value: "" };
      return {
        label: line.slice(0, sep).trim(),
        value: line.slice(sep + 1).trim(),
      };
    });
}

export function serializeProjectDetails(items: ProjectDetailItem[] | null | undefined): string {
  if (!items?.length) return "";
  return items.map((item) => `${item.label}|${item.value}`).join("\n");
}

export function serializeOverviewParagraphs(paragraphs: string[] | null | undefined): string {
  if (!paragraphs?.length) return "";
  return paragraphs.join("\n\n");
}
