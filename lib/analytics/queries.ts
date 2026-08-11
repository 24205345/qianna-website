import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type {
  AnalyticsContentType,
  AnalyticsDailyPoint,
  AnalyticsSummary,
  AnalyticsTopItem,
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

function countPvUv(rows: PageViewRow[], since: Date) {
  const filtered = rows.filter((row) => new Date(row.viewed_at) >= since);
  const uv = new Set(filtered.map((row) => row.visitor_hash)).size;
  return { pv: filtered.length, uv };
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

async function fetchRecentViews(days: number): Promise<PageViewRow[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const since = daysAgo(days).toISOString();
  const { data, error } = await supabase
    .from("page_views")
    .select("content_type, content_slug, visitor_hash, viewed_at, duration_seconds")
    .gte("viewed_at", since)
    .order("viewed_at", { ascending: false })
    .limit(10000);

  if (error) {
    console.error("Failed to load page views:", error.message);
    return [];
  }

  return (data ?? []) as PageViewRow[];
}

export async function getAnalyticsDashboardData(days = 30): Promise<{
  summary: AnalyticsSummary;
  daily: AnalyticsDailyPoint[];
  topNotes: AnalyticsTopItem[];
  topProjects: AnalyticsTopItem[];
  topPhotography: AnalyticsTopItem[];
  topPages: AnalyticsTopItem[];
}> {
  const emptySummary: AnalyticsSummary = {
    todayPv: 0,
    weekPv: 0,
    monthPv: 0,
    todayUv: 0,
    weekUv: 0,
    monthUv: 0,
  };

  const rows = await fetchRecentViews(days);
  if (rows.length === 0) {
    return {
      summary: emptySummary,
      daily: [],
      topNotes: [],
      topProjects: [],
      topPhotography: [],
      topPages: [],
    };
  }

  const now = new Date();
  const todayStart = startOfUtcDay(now);
  const weekStart = daysAgo(6);
  const monthStart = daysAgo(days - 1);

  const today = countPvUv(rows, todayStart);
  const week = countPvUv(rows, weekStart);
  const month = countPvUv(rows, monthStart);

  const dailyMap = new Map<string, { pv: number; visitors: Set<string> }>();
  for (let offset = days - 1; offset >= 0; offset -= 1) {
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

  const daily: AnalyticsDailyPoint[] = Array.from(dailyMap.entries()).map(
    ([date, bucket]) => ({
      date,
      pv: bucket.pv,
      uv: bucket.visitors.size,
    })
  );

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
    summary: {
      todayPv: today.pv,
      weekPv: week.pv,
      monthPv: month.pv,
      todayUv: today.uv,
      weekUv: week.uv,
      monthUv: month.uv,
    },
    daily,
    topNotes,
    topProjects,
    topPhotography,
    topPages,
  };
}
