import "server-only";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { HomeFeaturedImages } from "./featured-images";
export async function getHomeFeaturedImageSettings(): Promise<{ images: HomeFeaturedImages; error: string | null }> {
  if (!isSupabaseConfigured()) return { images: {}, error: null };
  const supabase = await createClient();
  const { data, error } = await supabase.from("home_featured_images").select("item_key,image_url");
  // Retain original covers when the additive migration is not yet installed.
  if (error || !data) return { images: {}, error: error?.message ?? null };
  return { images: Object.fromEntries(data.filter(row => typeof row.image_url === "string" && row.image_url.length > 0).map(row => [row.item_key, row.image_url])), error: null };
}

export async function getHomeFeaturedImages(): Promise<HomeFeaturedImages> {
  return (await getHomeFeaturedImageSettings()).images;
}
