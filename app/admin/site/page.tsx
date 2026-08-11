import { redirect } from "next/navigation";
import {
  fallbackSiteSettings,
  type SiteSettings,
} from "@/app/_data/site-settings";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getSiteNavigationItems } from "@/lib/site/queries";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import SiteSettingsForm from "./SiteSettingsForm";
import { updateSiteSettingsAction } from "./actions";

interface SiteSettingsRow {
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_cta_label: string | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
}

function mapDefaults(row: SiteSettingsRow | null): SiteSettings {
  return {
    heroTitle: row?.hero_title ?? fallbackSiteSettings.heroTitle,
    heroSubtitle: row?.hero_subtitle ?? fallbackSiteSettings.heroSubtitle,
    heroCtaLabel: row?.hero_cta_label ?? fallbackSiteSettings.heroCtaLabel,
    heroImageUrl: row?.hero_image_url ?? fallbackSiteSettings.heroImageUrl,
    heroImageAlt: row?.hero_image_alt ?? fallbackSiteSettings.heroImageAlt,
  };
}

export default async function AdminSitePage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-stone-50 px-6 py-16 text-stone-700">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-serif text-3xl text-stone-900">Site Settings</h1>
          <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Supabase environment variables are not configured. Add them to <code>.env.local</code> and restart.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("site_settings")
    .select(
      "hero_title, hero_subtitle, hero_cta_label, hero_image_url, hero_image_alt"
    )
    .eq("singleton_key", "home")
    .maybeSingle();

  const defaults = mapDefaults(data as SiteSettingsRow | null);
  const navigationItems = await getSiteNavigationItems();

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-5xl">
        <AdminPageHeader title="Site Settings" />

        {error ? (
          <p className="mt-8 rounded-md bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
            Failed to load site settings: {error.message}
            <br />
            If this is the first time enabling P5/P6, run these migrations in
            the Supabase SQL Editor first:{" "}
            <code>supabase/migrations/0005_site_settings.sql</code> and{" "}
            <code>supabase/migrations/0006_site_navigation_items.sql</code>.
          </p>
        ) : null}

        <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6">
          <SiteSettingsForm
            action={updateSiteSettingsAction}
            defaults={defaults}
              navigationItems={navigationItems}
          />
        </div>
      </div>
    </div>
  );
}
