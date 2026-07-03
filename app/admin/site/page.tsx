import Link from "next/link";
import { redirect } from "next/navigation";
import {
  fallbackSiteSettings,
  type SiteSettings,
} from "@/app/_data/site-settings";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getSiteNavigationItems } from "@/lib/site/queries";
import { signOutAction } from "@/app/admin/projects/actions";
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
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">
              Admin
            </p>
            <h1 className="mt-2 font-serif text-3xl text-stone-900">Site Settings</h1>
            <p className="mt-2 text-sm text-stone-500">
              Manage homepage Hero copy, entry cards, and linked page headings.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/projects" className="text-sm text-stone-500 hover:text-stone-800">
              Projects
            </Link>
            <Link href="/admin/photography" className="text-sm text-stone-500 hover:text-stone-800">
              Photography
            </Link>
            <Link href="/admin/visual-works" className="text-sm text-stone-500 hover:text-stone-800">
              Visual Works
            </Link>
            <Link href="/admin/field-notes" className="text-sm text-stone-500 hover:text-stone-800">
              Field Notes
            </Link>
            <Link href="/about" className="text-sm text-stone-500 hover:text-stone-800">
              About
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-md border border-stone-300 px-4 py-2 text-sm text-stone-600 hover:bg-stone-100"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

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
