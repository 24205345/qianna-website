import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface GuestbookMessage {
  id: string;
  authorName: string;
  message: string;
  createdAt: string;
}

interface GuestbookRow {
  id: string;
  author_name: string;
  message: string;
  created_at: string;
}

function mapGuestbookRow(row: GuestbookRow): GuestbookMessage {
  return {
    id: row.id,
    authorName: row.author_name,
    message: row.message,
    createdAt: row.created_at,
  };
}

export async function getApprovedGuestbookMessages(
  limit = 20
): Promise<GuestbookMessage[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guestbook_messages")
    .select("id, author_name, message, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to load guestbook messages:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapGuestbookRow(row as GuestbookRow));
}
