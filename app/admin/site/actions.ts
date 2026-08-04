"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SiteNavigationGroup } from "@/app/_data/site-navigation";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "portfolio-media";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

function requiredText(value: FormDataEntryValue | null, fallback: string): string {
  const text = value == null ? "" : String(value).trim();
  return text.length > 0 ? text : fallback;
}

function optionalText(value: FormDataEntryValue | null): string {
  return value == null ? "" : String(value).trim();
}

function parseNavigationGroup(value: FormDataEntryValue | null): SiteNavigationGroup {
  if (
    value === "section" ||
    value === "project_category" ||
    value === "traces_category" ||
    value === "page_link"
  ) {
    return value;
  }

  return "page_link";
}

function parseNavigationItems(formData: FormData) {
  const count = Number(formData.get("navigation_count") ?? 0) || 0;

  return Array.from({ length: count }, (_, index) => {
    const itemKey = requiredText(
      formData.get(`navigation_${index}_item_key`),
      `item-${index}`
    );

    return {
      item_key: itemKey,
      item_group: parseNavigationGroup(formData.get(`navigation_${index}_group`)),
      label: requiredText(formData.get(`navigation_${index}_label`), itemKey),
      title: requiredText(formData.get(`navigation_${index}_title`), itemKey),
      description: optionalText(formData.get(`navigation_${index}_description`)),
      href: requiredText(formData.get(`navigation_${index}_href`), "#"),
      sort_order: Number(formData.get(`navigation_${index}_sort_order`) ?? index) || index,
    };
  });
}

async function requireUser(supabase: SupabaseServerClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }
}

async function uploadHeroImage(
  supabase: SupabaseServerClient,
  file: File | null
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `site/home-hero-${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) {
    throw new Error(`Hero image upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function updateSiteSettingsAction(formData: FormData) {
  const supabase = await createClient();
  await requireUser(supabase);

  const uploadedUrl = await uploadHeroImage(
    supabase,
    formData.get("hero_image") as File | null
  );

  const payload = {
    singleton_key: "home",
    hero_title: requiredText(formData.get("hero_title"), "Qianna Wang"),
    hero_subtitle: requiredText(
      formData.get("hero_subtitle"),
      "Urban design, visual storytelling, and spatial observation."
    ),
    hero_cta_label: requiredText(formData.get("hero_cta_label"), "Enter"),
    hero_image_url:
      uploadedUrl ??
      requiredText(formData.get("hero_image_url"), "/images/hero-image.jpg"),
    hero_image_alt: requiredText(
      formData.get("hero_image_alt"),
      "Qianna Wang cover image"
    ),
  };

  const { error } = await supabase
    .from("site_settings")
    .upsert(payload, { onConflict: "singleton_key" });
  if (error) {
    throw new Error(`Failed to save site settings: ${error.message}`);
  }

  const navigationItems = parseNavigationItems(formData);
  if (navigationItems.length > 0) {
    const { error: navigationError } = await supabase
      .from("site_navigation_items")
      .upsert(navigationItems, { onConflict: "item_key" });

    if (navigationError) {
      throw new Error(`Failed to save navigation copy: ${navigationError.message}`);
    }
  }

  revalidatePath("/");
  revalidatePath("/notes");
  revalidatePath("/projects");
  revalidatePath("/traces");
  revalidatePath("/photography");
  revalidatePath("/visual-works");
  revalidatePath("/field-notes");
  revalidatePath("/about");
  revalidatePath("/admin/site");
  revalidatePath("/admin/about");
  redirect("/admin/site");
}
