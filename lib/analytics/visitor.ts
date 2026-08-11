import { createHash } from "node:crypto";
import type { AnalyticsContentType } from "@/lib/analytics/types";

export const VISITOR_COOKIE_NAME = "qn_vid";
export const VISITOR_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function hashVisitorId(visitorId: string): string {
  return createHash("sha256").update(`analytics:${visitorId}`).digest("hex");
}

export function isValidVisitorId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export function isValidAnalyticsContentType(
  value: string
): value is AnalyticsContentType {
  return (
    value === "note" ||
    value === "project" ||
    value === "photography" ||
    value === "page"
  );
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds <= 0) return "—";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return remainder > 0 ? `${minutes}m ${remainder}s` : `${minutes}m`;
}
