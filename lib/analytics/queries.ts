import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  getAnalyticsRangeDays,
  type AnalyticsRange,
} from "@/lib/analytics/ranges";
import type {
  AnalyticsContentType,
  AnalyticsSummary,
  AnalyticsTopItem,
  AnalyticsTrendPoint,
} from "@/lib/analytics/types";

interface PageViewRow {
  content_type: AnalyticsContentType;
  content_slug: string;
  visitor_hash: string;
  viewed_at: string;
  duration_seconds: number | null;
}

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

function daysAgo(days: number): Date {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return startOfUtcDay(date);
}

function formatDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatMonthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function getRangeStart(range: AnalyticsRange): Date | null {
  switch (range) {
    case "today":
      return startOfUtcDay(new Date());
    case "7d":
      return daysAgo(6);
    case "30d":
      return daysAgo(29);
    case "365d":
      return daysAgo(364);
    case "all":
      return null;
  }
}

function countPvUv(rows: PageViewRow[]) {
  const uv = new Set(rows.map((row) => row.visitor_hash)).size;
  return { pv: rows.length, uv };
}

function averageDuration(rows: PageViewRow[]): number | null {
  const durations = rows
    .map((row) => row.duration_seconds)
    .filter((value): value is number => typeof value === "number" && value > 0);

  if (durations.length === 0) return null;
  return Math.round(
    durations.reduce((sum, value) => sum + value, 0) / durations.length
  );
}

async function resolveTitles(
  items: { contentType: AnalyticsContentType; contentSlug: string }[]
): Promise<Map<string, string>> {
  const titles = new Map<string, string>();
  if (!isSupabaseConfigured() || items.length === 0) return titles;

  const supabase = await createClient();
  const noteSlugs = items
    .filter((item) => item.contentType === "note")
    .map((item) => item.contentSlug);
  const projectSlugs = items
    .filter((item) => item.contentType === "project")
    .map((item) => item.contentSlug);
  const photographySlugs = items
    .filter((item) => item.contentType === "photography")
    .map((item) => item.contentSlug);

  if (noteSlugs.length > 0) {
    const { data } = await supabase
      .from("notes")
      .select("slug, title")
      .in("slug", noteSlugs);
    for (const row of data ?? []) {
      titles.set(`note:${row.slug}`, row.title);
    }
  }

  if (projectSlugs.length > 0) {
    const { data } = await supabase
      .from("projects")
      .select("slug, title")
      .in("slug", projectSlugs);
    for (const row of data ?? []) {
      titles.set(`project:${row.slug}`, row.title);
    }
  }

  if (photographySlugs.length > 0) {
    const { data } = await supabase
      .from("photography_collections")
      .select("slug, title")
      .in("slug", photographySlugs);
    for (const row of data ?? []) {
      titles.set(`photography:${row.slug}`, row.title);
    }
  }

  const pageLabels: Record<string, string> = {
    home: "Home",
    traces: "Traces",
    about: "About",
    guestbook: "Guestbook",
    photography: "Photography",
  };

  for (const item of items) {
    if (item.contentType !== "page") continue;
    titles.set(`page:${item.contentSlug}`, pageLabels[item.contentSlug] ?? item.contentSlug);
  }

  return titles;
}

async function fetchPageViews(range: AnalyticsRange): Promise<PageViewRow[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const rangeStart = getRangeStart(range);

  let query = supabase
    .from("page_views")
    .select("content_type, content_slug, visitor_hash, viewed_at, duration_seconds")
    .order("viewed_at", { ascending: false });

  if (rangeStart) {
    query = query.gte("viewed_at", rangeStart.toISOString());
  }

  const limit = range === "all" ? 50000 : 10000;
  const { data, error } = await query.limit(limit);

  if (error) {
    console.error("Failed to load page views:", error.message);
    return [];
  }

  return (data ?? []) as PageViewRow[];
}

function buildTrend(rows: PageViewRow[], range: AnalyticsRange): AnalyticsTrendPoint[] {
  if (rows.length === 0) return [];

  if (range === "today") {
    const buckets = new Map<string, { pv: number; visitors: Set<string> }>();
    for (let hour = 0; hour < 24; hour += 1) {
      buckets.set(String(hour).padStart(2, "0"), { pv: 0, visitors: new Set() });
    }

    for (const row of rows) {
      const hour = String(new Date(row.viewed_at).getUTCHours()).padStart(2, "0");
      const bucket = buckets.get(hour);
      if (!bucket) continue;
      bucket.pv += 1;
      bucket.visitors.add(row.visitor_hash);
    }

    return Array.from(buckets.entries()).map(([label, bucket]) => ({
      label: `${label}:00`,
      pv: bucket.pv,
      uv: bucket.visitors.size,
    }));
  }

  const spanDays =
    range === "all"
      ? Math.max(
          1,
          Math.ceil(
            (Date.now() - new Date(rows[rows.length - 1].viewed_at).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : getAnalyticsRangeDays(range) ?? 30;

  const bucketMonthly = range === "365d" || (range === "all" && spanDays > 120);

  if (bucketMonthly) {
    const buckets = new Map<string, { pv: number; visitors: Set<string> }>();
    for (const row of rows) {
      const key = formatMonthKey(new Date(row.viewed_at));
      const bucket = buckets.get(key) ?? { pv: 0, visitors: new Set() };
      bucket.pv += 1;
      bucket.visitors.add(row.visitor_hash);
      buckets.set(key, bucket);
    }

    return Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, bucket]) => ({
        label,
        pv: bucket.pv,
        uv: bucket.visitors.size,
      }));
  }

  const dayCount = range === "all" ? Math.min(spanDays, 90) : spanDays;
  const dailyMap = new Map<string, { pv: number; visitors: Set<string> }>();

  for (let offset = dayCount - 1; offset >= 0; offset -= 1) {
    const day = daysAgo(offset);
    dailyMap.set(formatDayKey(day), { pv: 0, visitors: new Set() });
  }

  for (const row of rows) {
    const key = formatDayKey(new Date(row.viewed_at));
    const bucket = dailyMap.get(key);
    if (!bucket) continue;
    bucket.pv += 1;
    bucket.visitors.add(row.visitor_hash);
  }

  return Array.from(dailyMap.entries()).map(([label, bucket]) => ({
    label: label.slice(5),
    pv: bucket.pv,
    uv: bucket.visitors.size,
  }));
}

export async function getAnalyticsDashboardData(range: AnalyticsRange = "30d"): Promise<{
  range: AnalyticsRange;
  summary: AnalyticsSummary;
  trend: AnalyticsTrendPoint[];
  topNotes: AnalyticsTopItem[];
  topProjects: AnalyticsTopItem[];
  topPhotography: AnalyticsTopItem[];
  topPages: AnalyticsTopItem[];
}> {
  const emptySummary: AnalyticsSummary = { pv: 0, uv: 0 };
  const rows = await fetchPageViews(range);

  if (rows.length === 0) {
    return {
      range,
      summary: emptySummary,
      trend: [],
      topNotes: [],
      topProjects: [],
      topPhotography: [],
      topPages: [],
    };
  }

  const summary = countPvUv(rows);
  const trend = buildTrend(rows, range);

  async function buildTopItems(
    contentType: AnalyticsContentType,
    limit: number
  ): Promise<AnalyticsTopItem[]> {
    const grouped = new Map<string, PageViewRow[]>();

    for (const row of rows) {
      if (row.content_type !== contentType) continue;
      const list = grouped.get(row.content_slug) ?? [];
      list.push(row);
      grouped.set(row.content_slug, list);
    }

    const sorted = Array.from(grouped.entries())
      .map(([contentSlug, groupRows]) => ({
        contentSlug,
        views: groupRows.length,
        avgDurationSeconds: averageDuration(groupRows),
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);

    const titles = await resolveTitles(
      sorted.map((item) => ({ contentType, contentSlug: item.contentSlug }))
    );

    return sorted.map((item) => ({
      contentType,
      contentSlug: item.contentSlug,
      title:
        titles.get(`${contentType}:${item.contentSlug}`) ?? item.contentSlug,
      views: item.views,
      avgDurationSeconds: item.avgDurationSeconds,
    }));
  }

  const [topNotes, topProjects, topPhotography, topPages] = await Promise.all([
    buildTopItems("note", 5),
    buildTopItems("project", 5),
    buildTopItems("photography", 5),
    buildTopItems("page", 5),
  ]);

  return {
    range,
    summary,
    trend,
    topNotes,
    topProjects,
    topPhotography,
    topPages,
  };
}
