import { createClient } from "@/lib/supabase/server";
import { getMediaProvider } from "@/lib/media/storage-core";
import { prepareDirectUpload, completeDirectUpload } from "@/lib/media/direct-upload-core";

export const runtime = "nodejs";
export const maxDuration = 60;
const headers = { "Cache-Control": "private, no-store" };
export async function POST(request: Request) {
  const origins = new Set([new URL(request.url).origin, new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.qiannawang.com").origin]);
  if (!origins.has(request.headers.get("origin") || "")) return Response.json({ error: "Invalid request origin." }, { status: 403, headers });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.is_anonymous) return Response.json({ error: "Please log in." }, { status: 401, headers });
  if (user.app_metadata?.cms_role !== "admin") return Response.json({ error: "CMS admin permission is required. Refresh your login after permission changes." }, { status: 403, headers });
  try {
    const text = await request.text();
    if (text.length > 4096) return Response.json({ error: "Upload metadata is too large." }, { status: 413, headers });
    const input = JSON.parse(text);
    if (input.phase === "prepare") {
      if (getMediaProvider() === "supabase") return Response.json({ provider: "supabase" }, { headers });
      const result = await prepareDirectUpload(user.id, input);
      return Response.json(result, { headers });
    }
    if (input.phase === "complete") return Response.json(await completeDirectUpload(user.id, input.ticket), { headers });
    return Response.json({ error: "Invalid upload phase." }, { status: 400, headers });
  } catch (error) {
    console.error("Media upload request failed:", error instanceof Error ? error.name : "Unknown error");
    return Response.json({ error: "Upload validation failed. Check file type and size, then upload again." }, { status: 400, headers });
  }
}
