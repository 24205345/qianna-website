"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { WorkflowPipeline } from "@/lib/workbench/types";
import WorkflowTimeline from "./WorkflowTimeline";

interface WorkbenchClientProps {
  pipelines: WorkflowPipeline[];
  initialPipelineId?: string;
}

export default function WorkbenchClient({
  pipelines,
  initialPipelineId,
}: WorkbenchClientProps) {
  const [activePipelineId, setActivePipelineId] = useState<string>(() => {
    if (initialPipelineId && pipelines.some((p) => p.id === initialPipelineId)) {
      return initialPipelineId;
    }
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const matchingPipeline = pipelines.find((p) =>
          p.steps.some((s) => s.id === hash)
        );
        if (matchingPipeline) return matchingPipeline.id;
      }
    }
    return pipelines[0]?.id || "ai-development";
  });

  const [activeStepId, setActiveStepId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.location.hash.replace("#", "") || "";
    }
    return "";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScrollToHash = (behavior: ScrollBehavior = "smooth") => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;

      setActiveStepId(hash);

      // Auto-switch pipeline tab if the target step belongs to another pipeline
      const matchingPipeline = pipelines.find((p) =>
        p.steps.some((s) => s.id === hash)
      );
      if (matchingPipeline && matchingPipeline.id !== activePipelineId) {
        setActivePipelineId(matchingPipeline.id);
      }

      const el = document.getElementById(hash);
      if (el) {
        // Position element cleanly near the top (24px below viewport top)
        const yOffset = -24;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior });
      }
    };

    // Immediate alignment
    handleScrollToHash("auto");

    // Progressive alignments to ensure layout and Reveal animations are settled
    const t1 = setTimeout(() => handleScrollToHash("smooth"), 100);
    const t2 = setTimeout(() => handleScrollToHash("smooth"), 300);

    const onHashChange = () => handleScrollToHash("smooth");
    window.addEventListener("hashchange", onHashChange);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [activePipelineId, pipelines]);

  const currentPipeline =
    pipelines.find((p) => p.id === activePipelineId) || pipelines[0];

  return (
    <div className="mt-8">
      {/* 1. Sub-rail: Workflow Switcher Tabs (Strictly following TracesTabNav.tsx & AGENTS.md) */}
      <nav
        className="flex flex-wrap gap-x-6 gap-y-2 border-b border-stone-200/80"
        aria-label="Workflow Pipelines"
      >
        {pipelines.map((pipeline) => {
          const isActive = pipeline.id === activePipelineId;
          return (
            <button
              key={pipeline.id}
              type="button"
              onClick={() => {
                setActivePipelineId(pipeline.id);
                setActiveStepId("");
                if (typeof window !== "undefined") {
                  window.history.replaceState(
                    null,
                    "",
                    `/workbench?pipeline=${pipeline.id}`
                  );
                }
              }}
              className={`pb-3 text-sm transition-all cursor-pointer ${
                isActive
                  ? "-mb-px border-b-2 border-stone-900 font-medium text-stone-900"
                  : "-mb-px border-b-2 border-transparent text-stone-500 hover:border-stone-900 hover:font-medium hover:text-stone-900"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {pipeline.title}
            </button>
          );
        })}
      </nav>

      {/* 2. Active Pipeline Narrative Summary & Related Note Link (Matching /traces description) */}
      {currentPipeline ? (
        <div className="mt-4 mb-8 space-y-2.5">
          {/* Row 1: Narrative Summary */}
          <p className="text-sm leading-6 text-stone-500 max-w-3xl">
            {currentPipeline.summary}
          </p>

          {/* Row 2: Related Note Link */}
          {currentPipeline.featuredNote ? (
            <div>
              <Link
                href={currentPipeline.featuredNote.href}
                className="group inline-flex items-center gap-1.5 text-xs text-stone-500 transition-colors hover:text-stone-900"
              >
                <span className="text-stone-400">Case Study:</span>
                <span className="font-medium text-stone-700 group-hover:text-stone-950">
                  {currentPipeline.featuredNote.title}
                </span>
                <span className="text-stone-400">
                  ({currentPipeline.featuredNote.readingTime})
                </span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* 3. Stepped Workflow Timeline */}
      {currentPipeline ? (
        <div className="pt-2">
          <WorkflowTimeline
            steps={currentPipeline.steps}
            activeStepId={activeStepId}
            onSelectStep={(stepId) => {
              setActiveStepId(stepId);
              const el = document.getElementById(stepId);
              if (el) {
                const yOffset = -24;
                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
              }
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
