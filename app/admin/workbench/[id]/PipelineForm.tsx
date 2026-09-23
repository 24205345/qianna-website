"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  WorkflowPipeline,
  WorkflowStep,
  AttachedResource,
  ResourceType,
} from "@/lib/workbench/types";
import { updateWorkbenchPipelineAction } from "../actions";

interface PipelineFormProps {
  pipeline: WorkflowPipeline;
  saved?: boolean;
}

const inputClass =
  "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-stone-500";
const labelClass = "block text-sm font-medium text-stone-700";
const helpClass = "mt-1 text-xs leading-5 text-stone-500";

const RESOURCE_TYPES: { value: ResourceType; label: string }[] = [
  { value: "prompt", label: "Prompt / Guardrail" },
  { value: "mcp", label: "MCP Server Config" },
  { value: "skill", label: "Agent Skill" },
  { value: "site", label: "Recommended Site / Tool" },
  { value: "hook", label: "Event Hook / Script" },
];

export default function PipelineForm({ pipeline, saved }: PipelineFormProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "steps">("overview");
  const [steps, setSteps] = useState<WorkflowStep[]>(() => pipeline.steps || []);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeStep = steps[activeStepIndex] || steps[0];

  const handleStepChange = (
    index: number,
    field: keyof WorkflowStep,
    value: unknown
  ) => {
    setSteps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleStepToolsChange = (index: number, toolsString: string) => {
    const tools = toolsString
      .split(/[\n,]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    handleStepChange(index, "tools", tools);
  };

  const addStep = () => {
    const nextNum = String(steps.length + 1).padStart(2, "0");
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      stepNumber: nextNum,
      title: `Step ${nextNum}`,
      subtitle: "",
      tools: [],
      summary: "",
      resources: [],
    };
    setSteps((prev) => [...prev, newStep]);
    setActiveStepIndex(steps.length);
  };

  const removeStep = (index: number) => {
    if (!confirm("Are you sure you want to remove this workflow step?")) return;
    setSteps((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next;
    });
    if (activeStepIndex >= index && activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === steps.length - 1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    setSteps((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
    setActiveStepIndex(targetIndex);
  };

  // Vault Resource handlers
  const addResource = (stepIndex: number) => {
    const newRes: AttachedResource = {
      id: `res-${Date.now()}`,
      type: "prompt",
      title: "New Resource",
      description: "",
      tag: "Curated",
      content: "",
      url: "",
      curatorNote: "",
    };
    setSteps((prev) => {
      const next = [...prev];
      const step = next[stepIndex];
      next[stepIndex] = {
        ...step,
        resources: [...(step.resources || []), newRes],
      };
      return next;
    });
  };

  const handleResourceChange = (
    stepIndex: number,
    resIndex: number,
    field: keyof AttachedResource,
    value: string
  ) => {
    setSteps((prev) => {
      const next = [...prev];
      const step = next[stepIndex];
      const resources = [...(step.resources || [])];
      resources[resIndex] = { ...resources[resIndex], [field]: value };
      next[stepIndex] = { ...step, resources };
      return next;
    });
  };

  const removeResource = (stepIndex: number, resIndex: number) => {
    if (!confirm("Remove this vault resource?")) return;
    setSteps((prev) => {
      const next = [...prev];
      const step = next[stepIndex];
      const resources = [...(step.resources || [])].filter(
        (_, i) => i !== resIndex
      );
      next[stepIndex] = { ...step, resources };
      return next;
    });
  };

  return (
    <form action={updateWorkbenchPipelineAction} className="mt-8">
      <input type="hidden" name="pipeline_id" value={pipeline.id} />
      <input type="hidden" name="steps_json" value={JSON.stringify(steps)} />

      {saved ? (
        <div className="mb-6 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Pipeline and digital vault content updated successfully.
        </div>
      ) : null}

      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === "overview"
              ? "border-b-2 border-stone-900 text-stone-900"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          Pipeline Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("steps")}
          className={`ml-8 pb-3 text-sm font-medium transition-colors ${
            activeTab === "steps"
              ? "border-b-2 border-stone-900 text-stone-900"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          Workflow Steps &amp; Vault ({steps.length})
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" ? (
        <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6 md:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-xl text-stone-900">Basic Information</h2>
              <p className="mt-1 text-sm text-stone-500">
                General details and presentation of this creative pipeline.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="title">
                  Title *
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  defaultValue={pipeline.title}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="english_title">
                  English Subtitle / Full Title
                </label>
                <input
                  id="english_title"
                  name="english_title"
                  defaultValue={pipeline.englishTitle}
                  className={inputClass}
                />
              </div>
            </div>

            <input type="hidden" name="badge" value="" />

            <div>
              <label className={labelClass} htmlFor="summary">
                Summary Description
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={3}
                defaultValue={pipeline.summary}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="core_stack">
                Core Technology Stack (comma-separated)
              </label>
              <input
                id="core_stack"
                name="core_stack"
                defaultValue={pipeline.coreStack.join(", ")}
                className={inputClass}
                placeholder="VS Code, FastAPI, Next.js, Docker"
              />
              <p className={helpClass}>
                Appears as technology stack tags across cards and page headers.
              </p>
            </div>

            <div className="border-t border-stone-200 pt-6">
              <h3 className="font-serif text-lg text-stone-900">Featured Article / Case Study</h3>
              <p className={helpClass}>
                Optional deep-dive article linked at the pipeline level.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass} htmlFor="featured_note_title">
                    Note Title
                  </label>
                  <input
                    id="featured_note_title"
                    name="featured_note_title"
                    defaultValue={pipeline.featuredNote?.title || ""}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="featured_note_href">
                    Link (Href)
                  </label>
                  <input
                    id="featured_note_href"
                    name="featured_note_href"
                    defaultValue={pipeline.featuredNote?.href || ""}
                    className={inputClass}
                    placeholder="/notes/..."
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="featured_note_reading_time">
                    Reading Time
                  </label>
                  <input
                    id="featured_note_reading_time"
                    name="featured_note_reading_time"
                    defaultValue={pipeline.featuredNote?.readingTime || "5 min read"}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Tab 2: Master-Detail Steps & Resources */}
      {activeTab === "steps" ? (
        <div className="mt-6 rounded-xl border border-stone-200 bg-white">
          <div className="flex flex-col md:flex-row">
            {/* Left Sidebar: Steps List */}
            <div className="w-full border-b border-stone-200 p-4 md:w-64 md:border-r md:border-b-0 md:p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
                  Steps ({steps.length})
                </span>
                <button
                  type="button"
                  onClick={addStep}
                  className="rounded border border-stone-300 bg-white px-2 py-1 text-xs text-stone-700 transition-colors hover:bg-stone-50"
                >
                  + Add Step
                </button>
              </div>

              <div className="space-y-1">
                {steps.map((s, idx) => {
                  const isActive = idx === activeStepIndex;
                  return (
                    <div
                      key={s.id}
                      className={`group flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        isActive
                          ? "bg-stone-100 font-medium text-stone-900"
                          : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveStepIndex(idx)}
                        className="flex flex-1 items-center gap-2 truncate text-left"
                      >
                        <span className="shrink-0 text-xs text-stone-400">
                          {s.stepNumber}
                        </span>
                        <span className="truncate">{s.title || `Step ${s.stepNumber}`}</span>
                      </button>

                      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => moveStep(idx, "up")}
                          disabled={idx === 0}
                          className="px-1 text-xs text-stone-400 hover:text-stone-700 disabled:opacity-20"
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveStep(idx, "down")}
                          disabled={idx === steps.length - 1}
                          className="px-1 text-xs text-stone-400 hover:text-stone-700 disabled:opacity-20"
                          title="Move Down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeStep(idx)}
                          className="px-1 text-xs text-red-500 hover:text-red-700"
                          title="Delete Step"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Panel: Selected Step & Vault Detail */}
            <div className="flex-1 p-6 md:p-8">
              {activeStep ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                    <div>
                      <span className="text-xs font-semibold tracking-wider text-stone-400 uppercase">
                        Step {activeStep.stepNumber}
                      </span>
                      <h3 className="font-serif text-xl text-stone-900">
                        {activeStep.title || `Step ${activeStep.stepNumber}`}
                      </h3>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className={labelClass}>Step Number</label>
                      <input
                        value={activeStep.stepNumber}
                        onChange={(e) =>
                          handleStepChange(
                            activeStepIndex,
                            "stepNumber",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Step Title *</label>
                      <input
                        value={activeStep.title}
                        onChange={(e) =>
                          handleStepChange(
                            activeStepIndex,
                            "title",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Subtitle</label>
                      <input
                        value={activeStep.subtitle || ""}
                        onChange={(e) =>
                          handleStepChange(
                            activeStepIndex,
                            "subtitle",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Tooling Chips (comma-separated)
                    </label>
                    <input
                      value={activeStep.tools ? activeStep.tools.join(", ") : ""}
                      onChange={(e) =>
                        handleStepToolsChange(activeStepIndex, e.target.value)
                      }
                      className={inputClass}
                      placeholder="Cursor, Codex, MCP, Skills"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Summary Description</label>
                    <textarea
                      value={activeStep.summary}
                      onChange={(e) =>
                        handleStepChange(
                          activeStepIndex,
                          "summary",
                          e.target.value
                        )
                      }
                      rows={3}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Key Takeaway / Curator Heuristic
                    </label>
                    <textarea
                      value={activeStep.keyTakeaway || ""}
                      onChange={(e) =>
                        handleStepChange(
                          activeStepIndex,
                          "keyTakeaway",
                          e.target.value
                        )
                      }
                      rows={2}
                      className={inputClass}
                      placeholder="Practical takeaway or rule of thumb..."
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Related Note Label</label>
                      <input
                        value={activeStep.relatedNoteLabel || ""}
                        onChange={(e) =>
                          handleStepChange(
                            activeStepIndex,
                            "relatedNoteLabel",
                            e.target.value
                          )
                        }
                        className={inputClass}
                        placeholder="Read Note: ..."
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Related Note Link (Href)</label>
                      <input
                        value={activeStep.relatedNoteHref || ""}
                        onChange={(e) =>
                          handleStepChange(
                            activeStepIndex,
                            "relatedNoteHref",
                            e.target.value
                          )
                        }
                        className={inputClass}
                        placeholder="/notes/..."
                      />
                    </div>
                  </div>

                  {/* Attached Vault Resources */}
                  <div className="border-t border-stone-200 pt-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-serif text-lg text-stone-900">
                          Attached Vault Resources ({activeStep.resources?.length || 0})
                        </h4>
                        <p className={helpClass}>
                          Prompts, MCPs, Agent Skills, recommended sites, and configuration snippets.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addResource(activeStepIndex)}
                        className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                      >
                        + Add Resource
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(!activeStep.resources || activeStep.resources.length === 0) ? (
                        <div className="rounded-lg border border-dashed border-stone-200 p-6 text-center text-xs text-stone-400">
                          No vault resources attached to this step yet. Click &quot;+ Add Resource&quot; to add one.
                        </div>
                      ) : (
                        activeStep.resources.map((res, resIdx) => (
                          <div
                            key={res.id}
                            className="rounded-lg border border-stone-200 bg-stone-50/60 p-4"
                          >
                            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                              <div className="flex items-center gap-3">
                                <select
                                  value={res.type}
                                  onChange={(e) =>
                                    handleResourceChange(
                                      activeStepIndex,
                                      resIdx,
                                      "type",
                                      e.target.value as ResourceType
                                    )
                                  }
                                  className="rounded border border-stone-300 bg-white px-2 py-1 text-xs text-stone-700 outline-none"
                                >
                                  {RESOURCE_TYPES.map((rt) => (
                                    <option key={rt.value} value={rt.value}>
                                      {rt.label}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  value={res.title}
                                  onChange={(e) =>
                                    handleResourceChange(
                                      activeStepIndex,
                                      resIdx,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  className="rounded border border-stone-300 bg-white px-2.5 py-1 text-xs font-medium text-stone-900 outline-none focus:border-stone-500"
                                  placeholder="Resource Title"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  removeResource(activeStepIndex, resIdx)
                                }
                                className="text-xs text-red-500 underline-offset-2 hover:underline"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <div>
                                <label className={labelClass}>Tag / Subtitle</label>
                                <input
                                  value={res.tag || ""}
                                  onChange={(e) =>
                                    handleResourceChange(
                                      activeStepIndex,
                                      resIdx,
                                      "tag",
                                      e.target.value
                                    )
                                  }
                                  className={inputClass}
                                  placeholder="e.g. AI-Native IDE"
                                />
                              </div>
                              <div>
                                <label className={labelClass}>External URL</label>
                                <input
                                  value={res.url || ""}
                                  onChange={(e) =>
                                    handleResourceChange(
                                      activeStepIndex,
                                      resIdx,
                                      "url",
                                      e.target.value
                                    )
                                  }
                                  className={inputClass}
                                  placeholder="https://..."
                                />
                              </div>
                            </div>

                            <div className="mt-3">
                              <label className={labelClass}>Description</label>
                              <textarea
                                value={res.description || ""}
                                onChange={(e) =>
                                  handleResourceChange(
                                    activeStepIndex,
                                    resIdx,
                                    "description",
                                    e.target.value
                                  )
                                }
                                rows={2}
                                className={inputClass}
                              />
                            </div>

                            <div className="mt-3">
                              <label className={labelClass}>
                                Content / Snippet (Code, JSON, Prompt)
                              </label>
                              <textarea
                                value={res.content || ""}
                                onChange={(e) =>
                                  handleResourceChange(
                                    activeStepIndex,
                                    resIdx,
                                    "content",
                                    e.target.value
                                  )
                                }
                                rows={4}
                                className={`${inputClass} font-mono text-xs`}
                                placeholder="Prompt text, MCP config JSON, or terminal commands..."
                              />
                            </div>

                            <div className="mt-3">
                              <label className={labelClass}>Curator Note</label>
                              <input
                                value={res.curatorNote || ""}
                                onChange={(e) =>
                                  handleResourceChange(
                                    activeStepIndex,
                                    resIdx,
                                    "curatorNote",
                                    e.target.value
                                  )
                                }
                                className={inputClass}
                                placeholder="Pro-tip or personal takeaway..."
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* Submit button bar */}
      <div className="mt-6 flex items-center justify-between">
        <Link
          href="/admin/workbench"
          className="text-sm text-stone-500 underline-offset-2 hover:underline"
        >
          ← Cancel and Return
        </Link>
        <button
          type="submit"
          className="rounded-md bg-stone-900 px-5 py-2.5 text-sm text-white transition-colors hover:bg-stone-700"
        >
          Save Pipeline
        </button>
      </div>
    </form>
  );
}
