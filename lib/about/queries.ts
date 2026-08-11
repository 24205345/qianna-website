import {
  fallbackAboutPageContent,
  type AboutPageContent,
  type AboutTimelineItem,
} from "@/app/_data/about-page";
import { getSiteNavigationItem, getSiteNavigationItems } from "@/lib/site/queries";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

interface AboutPageContentRow {
  current_focus: string | null;
  working_across: string[] | null;
  timeline_items: AboutTimelineItem[] | null;
  profile_image_url: string | null;
  profile_image_alt: string | null;
}

function mapTimelineItems(raw: unknown): AboutTimelineItem[] {
  if (!Array.isArray(raw)) {
    return fallbackAboutPageContent.timeline;
  }

  const items = raw
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const period = typeof row.period === "string" ? row.period : "";
      const title = typeof row.title === "string" ? row.title : "";
      const description = typeof row.description === "string" ? row.description : "";
      const sortOrder =
        typeof row.sortOrder === "number"
          ? row.sortOrder
          : typeof row.sort_order === "number"
            ? row.sort_order
            : index;

      if (!period || !title) return null;

      return { period, title, description, sortOrder };
    })
    .filter((item): item is AboutTimelineItem => item !== null);

  return items.length > 0 ? items.sort((a, b) => a.sortOrder - b.sortOrder) : fallbackAboutPageContent.timeline;
}

function mapAboutPageContent(
  row: AboutPageContentRow | null,
  pageTitle: string,
  pageDescription: string
): AboutPageContent {
  return {
    pageTitle,
    pageDescription,
    profileImageUrl: row?.profile_image_url ?? fallbackAboutPageContent.profileImageUrl,
    profileImageAlt: row?.profile_image_alt ?? fallbackAboutPageContent.profileImageAlt,
    timeline: mapTimelineItems(row?.timeline_items),
    workingAcross:
      row?.working_across && row.working_across.length > 0
        ? row.working_across
        : fallbackAboutPageContent.workingAcross,
    currentFocus: row?.current_focus ?? fallbackAboutPageContent.currentFocus,
  };
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  const navigationItems = await getSiteNavigationItems();
  const aboutNav = getSiteNavigationItem(navigationItems, "about");

  if (!isSupabaseConfigured()) {
    return {
      ...fallbackAboutPageContent,
      pageTitle: aboutNav.title,
      pageDescription: aboutNav.description,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("about_page_content")
    .select("current_focus, working_across, timeline_items, profile_image_url, profile_image_alt")
    .eq("singleton_key", "about")
    .maybeSingle();

  if (error) {
    return {
      ...fallbackAboutPageContent,
      pageTitle: aboutNav.title,
      pageDescription: aboutNav.description,
    };
  }

  return mapAboutPageContent(
    data as AboutPageContentRow | null,
    aboutNav.title,
    aboutNav.description
  );
}
