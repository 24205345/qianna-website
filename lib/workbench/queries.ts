import { WORKBENCH_PIPELINES } from "@/app/_data/workbench";
import type { WorkflowPipeline, WorkflowStep } from "@/lib/workbench/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

interface WorkbenchPipelineRow {
  id: string;
  title: string;
  english_title: string;
  badge: string;
  icon: string;
  summary: string;
  core_stack: string[] | null;
  featured_note: {
    title: string;
    href: string;
    readingTime: string;
  } | null;
  steps: WorkflowStep[] | null;
  sort_order: number;
}

function mapPipelineRow(row: WorkbenchPipelineRow): WorkflowPipeline {
  return {
    id: row.id,
    title: row.title,
    englishTitle: row.english_title || "",
    badge: row.badge || "",
    icon: row.icon || "",
    summary: row.summary || "",
    coreStack: Array.isArray(row.core_stack) ? row.core_stack : [],
    featuredNote: row.featured_note ?? undefined,
    steps: Array.isArray(row.steps) ? row.steps : [],
  };
}

export async function getWorkbenchPipelines(): Promise<WorkflowPipeline[]> {
  if (!isSupabaseConfigured()) {
    return WORKBENCH_PIPELINES;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("workbench_pipelines")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return WORKBENCH_PIPELINES;
    }

    return (data as WorkbenchPipelineRow[]).map(mapPipelineRow);
  } catch {
    return WORKBENCH_PIPELINES;
  }
}

export async function getWorkbenchPipelineById(
  id: string
): Promise<WorkflowPipeline | undefined> {
  const pipelines = await getWorkbenchPipelines();
  const found = pipelines.find((p) => p.id === id);
  if (found) return found;

  // Fallback to static code default
  return WORKBENCH_PIPELINES.find((p) => p.id === id);
}
