export const ANALYTICS_CONTENT_TYPES = [
  "note",
  "project",
  "photography",
  "page",
] as const;

export type AnalyticsContentType = (typeof ANALYTICS_CONTENT_TYPES)[number];

export interface AnalyticsSummary {
  pv: number;
  uv: number;
}

export interface AnalyticsTrendPoint {
  label: string;
  pv: number;
  uv: number;
}

export interface AnalyticsTopItem {
  contentType: AnalyticsContentType;
  contentSlug: string;
  title: string;
  views: number;
  avgDurationSeconds: number | null;
}
