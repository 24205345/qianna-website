import {
  fallbackSiteSettings,
  type SiteSettings,
} from "@/app/_data/site-settings";
import {
  fallbackSiteNavigationItems,
  getFallbackNavigationItem,
  type SiteNavigationGroup,
  type SiteNavigationItem,
} from "@/app/_data/site-navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

interface SiteSettingsRow {
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_cta_label: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
}

interface SiteNavigationRow {
  item_key: string;
  item_group: SiteNavigationGroup;
  label: string | null;
  title: string | null;
  description: string | null;
  href: string | null;
  sort_order: number | null;
}

function mapSiteSettings(row: SiteSettingsRow | null): SiteSettings {
  return {
    heroTitle: row?.hero_title ?? fallbackSiteSettings.heroTitle,
    heroSubtitle: row?.hero_subtitle ?? fallbackSiteSettings.heroSubtitle,
    heroCtaLabel: row?.hero_cta_label ?? fallbackSiteSettings.heroCtaLabel,
    heroImageUrl: row?.hero_image_url ?? fallbackSiteSettings.heroImageUrl,
    heroImageAlt: row?.hero_image_alt ?? fallbackSiteSettings.heroImageAlt,
  };
}

function mapSiteNavigationItem(row: SiteNavigationRow): SiteNavigationItem {
  const fallback = getFallbackNavigationItem(row.item_key);

  return {
    itemKey: row.item_key,
    group: row.item_group,
    label: row.label ?? fallback?.label ?? "",
    title: row.title ?? fallback?.title ?? "",
    description: row.description ?? fallback?.description ?? "",
    href: row.href ?? fallback?.href ?? "#",
    sortOrder: row.sort_order ?? fallback?.sortOrder ?? 0,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) {
    return fallbackSiteSettings;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select(
      "hero_title, hero_subtitle, hero_cta_label, hero_image_url, hero_image_alt"
    )
    .eq("singleton_key", "home")
    .maybeSingle();

  if (error) {
    return fallbackSiteSettings;
  }

  return mapSiteSettings(data as SiteSettingsRow | null);
}

export async function getSiteNavigationItems(): Promise<SiteNavigationItem[]> {
  if (!isSupabaseConfigured()) {
    return fallbackSiteNavigationItems;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_navigation_items")
    .select("item_key, item_group, label, title, description, href, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) {
    return fallbackSiteNavigationItems;
  }

  const itemsByKey = new Map(
    (data as SiteNavigationRow[]).map((row) => [
      row.item_key,
      mapSiteNavigationItem(row),
    ])
  );

  return fallbackSiteNavigationItems
    .map((fallback) => itemsByKey.get(fallback.itemKey) ?? fallback)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getSiteNavigationItem(
  items: SiteNavigationItem[],
  itemKey: string
): SiteNavigationItem {
  return (
    items.find((item) => item.itemKey === itemKey) ??
    getFallbackNavigationItem(itemKey) ??
    fallbackSiteNavigationItems[0]
  );
}

export function getSiteNavigationGroup(
  items: SiteNavigationItem[],
  group: SiteNavigationGroup
): SiteNavigationItem[] {
  return items
    .filter((item) => item.group === group)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
