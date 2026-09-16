import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface FeaturedTraceItem {
  id: string;
  slug?: string;
  title: string;
  location: string;
  category: "Field Note" | "Photography" | "Drawing";
  date: string;
  caption?: string;
  imageUrl: string;
  href: string;
}

const FALLBACK_FEATURED_TRACES: FeaturedTraceItem[] = [
  {
    id: "trace-yubeng",
    slug: "yubeng",
    title: "Hiking in Yubeng Village",
    location: "Yunnan, China",
    category: "Field Note",
    date: "2024",
    caption: "Pilgrimage trails beneath Kawagebo Peak",
    imageUrl: "/field-notes/yubeng/images/00_yubeng_cover.jpg",
    href: "/field-notes/yubeng",
  },
  {
    id: "trace-getty",
    title: "Travertine Curve",
    location: "Los Angeles, USA",
    category: "Photography",
    date: "2025",
    caption: "Warm light on travertine stone & geometry",
    imageUrl: "/photography/architecture-tectonics/01_getty_travertine_curve.jpg",
    href: "/photography",
  },
  {
    id: "trace-whitecliffs",
    slug: "whitecliffs",
    title: "Seven Sisters White Cliffs",
    location: "East Sussex, UK",
    category: "Field Note",
    date: "2024",
    caption: "Rolling downland meets the English Channel",
    imageUrl: "/field-notes/whitecliffs/images/00_whitecliffs_cover.jpg",
    href: "/field-notes/whitecliffs",
  },
  {
    id: "trace-gliding",
    slug: "gliding",
    title: "First Gliding Flight",
    location: "The Long Mynd, UK",
    category: "Field Note",
    date: "2024",
    caption: "Silent soaring over ancient Shropshire valleys",
    imageUrl: "/field-notes/gliding/images/00_gliding_cover.jpg",
    href: "/field-notes/gliding",
  },
  {
    id: "trace-drawing",
    title: "Spatial Pen Drawings",
    location: "Studio Archive",
    category: "Drawing",
    date: "2023–2024",
    caption: "Observation through line, rhythm, and grain",
    imageUrl: "/drawings/pen-drawing/pen_drawing_01.jpg",
    href: "/visual-works",
  },
];

export async function getFeaturedTraces(): Promise<FeaturedTraceItem[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_FEATURED_TRACES;
  }

  try {
    const supabase = await createClient();

    // Query published field notes for real cover URLs
    const { data: fieldNotes } = await supabase
      .from("field_notes")
      .select("slug, title, location, date, cover_image_url")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .limit(3);

    // Merge Supabase cover image URLs if available
    const merged = FALLBACK_FEATURED_TRACES.map((item) => {
      if (item.category === "Field Note" && item.slug && fieldNotes?.length) {
        const found = fieldNotes.find((fn) => fn.slug === item.slug);
        if (found?.cover_image_url) {
          return {
            ...item,
            imageUrl: found.cover_image_url,
            title: found.title || item.title,
            location: found.location || item.location,
          };
        }
      }
      return item;
    });

    return merged;
  } catch {
    return FALLBACK_FEATURED_TRACES;
  }
}
