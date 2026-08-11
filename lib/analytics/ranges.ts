export type AnalyticsRange = "today" | "7d" | "30d" | "365d" | "all";

export const ANALYTICS_RANGE_OPTIONS: {
  value: AnalyticsRange;
  label: string;
}[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "365d", label: "Last year" },
  { value: "all", label: "All time" },
];

export function parseAnalyticsRange(value: string | undefined): AnalyticsRange {
  if (
    value === "today" ||
    value === "7d" ||
    value === "30d" ||
    value === "365d" ||
    value === "all"
  ) {
    return value;
  }
  return "30d";
}

export function getAnalyticsRangeLabel(range: AnalyticsRange): string {
  return (
    ANALYTICS_RANGE_OPTIONS.find((option) => option.value === range)?.label ??
    "Last 30 days"
  );
}

export function getAnalyticsRangeDays(range: AnalyticsRange): number | null {
  switch (range) {
    case "today":
      return 1;
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "365d":
      return 365;
    case "all":
      return null;
  }
}
