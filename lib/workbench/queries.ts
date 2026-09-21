import { WORKBENCH_PIPELINES } from "@/app/_data/workbench";
import type { WorkflowPipeline } from "@/lib/workbench/types";

export async function getWorkbenchPipelines(): Promise<WorkflowPipeline[]> {
  // Currently served directly from high-fidelity structured data.
  // In the future (Phase 2), can query Supabase if DB persistence is added.
  return WORKBENCH_PIPELINES;
}

export async function getWorkbenchPipelineById(
  id: string
): Promise<WorkflowPipeline | undefined> {
  const pipelines = await getWorkbenchPipelines();
  return pipelines.find((p) => p.id === id);
}
