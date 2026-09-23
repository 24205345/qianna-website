"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { WORKBENCH_PIPELINES } from "@/app/_data/workbench";
import type { WorkflowStep } from "@/lib/workbench/types";
import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

function requiredText(value: FormDataEntryValue | null, fallback = ""): string {
  const text = value == null ? "" : String(value).trim();
  return text.length > 0 ? text : fallback;
}

function optionalText(value: FormDataEntryValue | null): string {
  return value == null ? "" : String(value).trim();
}

async function requireUser(supabase: SupabaseServerClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }
}

export async function updateWorkbenchPipelineAction(formData: FormData) {
  const supabase = await createClient();
  await requireUser(supabase);

  const id = requiredText(formData.get("pipeline_id"));
  if (!id) {
    throw new Error("Pipeline ID is required");
  }

  const title = requiredText(formData.get("title"));
  const englishTitle = optionalText(formData.get("english_title"));
  const badge = optionalText(formData.get("badge"));
  const icon = optionalText(formData.get("icon"));
  const summary = optionalText(formData.get("summary"));

  // Core stack: parsed from comma or newline separated string
  const coreStackRaw = optionalText(formData.get("core_stack"));
  const coreStack = coreStackRaw
    ? coreStackRaw
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  // Featured Note
  const featuredNoteTitle = optionalText(formData.get("featured_note_title"));
  const featuredNoteHref = optionalText(formData.get("featured_note_href"));
  const featuredNoteReadingTime = optionalText(formData.get("featured_note_reading_time"));

  const featuredNote =
    featuredNoteTitle && featuredNoteHref
      ? {
          title: featuredNoteTitle,
          href: featuredNoteHref,
          readingTime: featuredNoteReadingTime || "5 min read",
        }
      : null;

  // Steps JSON
  const stepsJsonRaw = optionalText(formData.get("steps_json"));
  let steps: WorkflowStep[] = [];
  if (stepsJsonRaw) {
    try {
      steps = JSON.parse(stepsJsonRaw);
    } catch {
      throw new Error("Invalid steps JSON structure");
    }
  }

  const payload = {
    id,
    title,
    english_title: englishTitle,
    badge,
    icon,
    summary,
    core_stack: coreStack,
    featured_note: featuredNote,
    steps,
  };

  const { error } = await supabase
    .from("workbench_pipelines")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    throw new Error(`Failed to update workbench pipeline: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/workbench");
  revalidatePath("/admin/workbench");
  revalidatePath(`/admin/workbench/${id}`);
  redirect(`/admin/workbench/${id}?saved=true`);
}

export async function syncWorkbenchDefaultsAction() {
  const supabase = await createClient();
  await requireUser(supabase);

  for (let i = 0; i < WORKBENCH_PIPELINES.length; i++) {
    const p = WORKBENCH_PIPELINES[i];
    const { error } = await supabase.from("workbench_pipelines").upsert(
      {
        id: p.id,
        title: p.title,
        english_title: p.englishTitle,
        badge: p.badge,
        icon: "",
        summary: p.summary,
        core_stack: p.coreStack,
        featured_note: p.featuredNote ?? null,
        steps: p.steps,
        sort_order: i,
      },
      { onConflict: "id" }
    );

    if (error) {
      throw new Error(`Failed to sync pipeline ${p.id}: ${error.message}`);
    }
  }

  revalidatePath("/");
  revalidatePath("/workbench");
  revalidatePath("/admin/workbench");
  redirect("/admin/workbench?synced=true");
}
