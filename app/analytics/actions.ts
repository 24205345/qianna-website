"use server";

import { createClient } from "@/lib/supabase/server";
import {
  hashVisitorId,
  isValidAnalyticsContentType,
  isValidVisitorId,
} from "@/lib/analytics/visitor";

export async function recordPageViewStart(input: {
  visitorId: string;
  contentType: string;
  contentSlug: string;
  path: string;
}): Promise<{ viewId: string } | null> {
  if (
    !isValidVisitorId(input.visitorId) ||
    !isValidAnalyticsContentType(input.contentType) ||
    !input.contentSlug.trim() ||
    !input.path.trim()
  ) {
    return null;
  }

  const supabase = await createClient();
  const visitorHash = hashVisitorId(input.visitorId);

  const { data, error } = await supabase.rpc("record_page_view_start", {
    p_visitor_hash: visitorHash,
    p_content_type: input.contentType,
    p_content_slug: input.contentSlug.trim(),
    p_path: input.path.trim().slice(0, 500),
  });

  if (error) {
    console.error("record_page_view_start failed:", error.message);
    return null;
  }

  if (typeof data !== "string") return null;
  return { viewId: data };
}

export async function recordPageViewEnd(input: {
  viewId: string;
  visitorId: string;
  durationSeconds: number;
}): Promise<void> {
  if (
    !isValidVisitorId(input.visitorId) ||
    !input.viewId ||
    input.durationSeconds < 1 ||
    input.durationSeconds > 86400
  ) {
    return;
  }

  const supabase = await createClient();
  const visitorHash = hashVisitorId(input.visitorId);

  const { error } = await supabase.rpc("record_page_view_end", {
    p_view_id: input.viewId,
    p_visitor_hash: visitorHash,
    p_duration_seconds: Math.round(input.durationSeconds),
  });

  if (error) {
    console.error("record_page_view_end failed:", error.message);
  }
}
