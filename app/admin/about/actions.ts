"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  parseTagLines,
  parseTimelineEntriesFromFormData,
} from "@/lib/about/parse-form";
import { createClient } from "@/lib/supabase/server";

function requiredText(value: FormDataEntryValue | null, fallback = ""): string {
  const text = value == null ? "" : String(value).trim();
  return text.length > 0 ? text : fallback;
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
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

  const timelineItems = timeline.map((item, index) => ({
    period: item.period,
    title: item.title,
    description: item.description,
    sort_order: index,
  }));

  const { error: aboutError } = await supabase.from("about_page_content").upsert(
    {
      singleton_key: "about",
      current_focus: currentFocus,
      working_across: workingAcross,
      timeline_items: timelineItems,
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
