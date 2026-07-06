export type ContentStatus = "draft" | "published";

export function isPublishedStatus(status: string): boolean {
  return status === "published";
}

export function getStatusLabel(status: string): string {
  return isPublishedStatus(status) ? "Visible" : "Hidden";
}

export function getToggleLabel(status: string): string {
  return isPublishedStatus(status) ? "Hide" : "Publish";
}

export function getNextStatus(status: string): ContentStatus {
  return isPublishedStatus(status) ? "draft" : "published";
}

export const STATUS_SELECT_OPTIONS: { value: ContentStatus; label: string }[] = [
  { value: "draft", label: "Hidden (draft)" },
  { value: "published", label: "Visible (published)" },
];
