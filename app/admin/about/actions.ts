"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  parseTagLines,
  parseTimelineEntriesFromFormData,
} from "@/lib/about/parse-form";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "portfolio-media";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

function requiredText(value: FormDataEntryValue | null, fallback = ""): string {
  const text = value == null ? "" : String(value).trim();
  return text.length > 0 ? text : fallback;
}

function optionalText(value: FormDataEntryValue | null): string {
  return value == null ? "" : String(value).trim();
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

async function uploadProfileImage(
  supabase: SupabaseServerClient,
  file: File | null
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `about/profile-${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) {
    throw new Error(`Profile image upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function updateAboutPageAction(formData: FormData) {
  const supabase = await requireUser();

  const pageTitle = requiredText(formData.get("page_title"), "About");
  const pageDescription = requiredText(formData.get("page_description"), "");
  const timeline = parseTimelineEntriesFromFormData(formData);
  const workingAcross = parseTagLines(formData.get("working_across_tags"));
  const currentFocus = requiredText(
    formData.get("current_focus"),
    "Today, I am interested in AI products that help people observe, organize, and act on complex information, especially in spatial, industrial, and operational contexts."
  );
  const uploadedProfileUrl = await uploadProfileImage(
    supabase,
    formData.get("profile_image") as File | null
  );
  const profileImageUrl =
    uploadedProfileUrl ?? optionalText(formData.get("profile_image_url"));
  const profileImageAlt = requiredText(
    formData.get("profile_image_alt"),
    "Qianna Wang profile photo"
  );

  const timelineItems = timeline.map((item) => ({
    period: item.period,
    title: item.title,
    description: item.description,
    sort_order: item.sortOrder,
  }));

  const { error: aboutError } = await supabase.from("about_page_content").upsert(
    {
      singleton_key: "about",
      current_focus: currentFocus,
      working_across: workingAcross,
      timeline_items: timelineItems,
      profile_image_url: profileImageUrl,
      profile_image_alt: profileImageAlt,
    },
    { onConflict: "singleton_key" }
  );

  if (aboutError) {
    throw new Error(`Failed to save About page content: ${aboutError.message}`);
  }

  const { error: navigationError } = await supabase
    .from("site_navigation_items")
    .update({
      title: pageTitle,
      description: pageDescription,
    })
    .eq("item_key", "about");

  if (navigationError) {
    throw new Error(`Failed to save About page heading: ${navigationError.message}`);
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/about");
  revalidatePath("/admin/site");
  redirect("/admin/about");
}
