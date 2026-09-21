import Link from "next/link";
import type { WorkflowStep } from "@/lib/workbench/types";
import ResourceCard from "./ResourceCard";

interface WorkflowTimelineProps {
  steps: WorkflowStep[];
  activeStepId?: string;
  onSelectStep?: (stepId: string) => void;
}

export default function WorkflowTimeline({
  steps,
  activeStepId,
  onSelectStep,
}: WorkflowTimelineProps) {
  return (
    <div className="relative border-l border-stone-200/90 pl-6 md:pl-10 ml-3 md:ml-4 space-y-12 md:space-y-16">
      {steps.map((step) => {
        const isTargeted = activeStepId === step.id;
        return (
          <div
            key={step.id}
            id={step.id}
            className="relative group scroll-mt-6 md:scroll-mt-8"
          >
            {/* Timeline Step Node Indicator */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.history.replaceState(null, "", `#${step.id}`);
                }
                if (onSelectStep) onSelectStep(step.id);
              }}
              className={`absolute -left-[31px] md:-left-[47px] top-0 flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full border text-[11px] md:text-xs font-sans font-medium shadow-xs transition-all duration-300 cursor-pointer ${
                isTargeted
                  ? "border-stone-900 bg-stone-900 text-stone-50 ring-4 ring-stone-900/15 scale-110 shadow-sm"
                  : "border-stone-300 bg-stone-100 text-stone-700 hover:border-stone-500 hover:bg-stone-900 hover:text-stone-50"
              }`}
              title={`Stage ${step.stepNumber}: ${step.title}`}
            >
              {step.stepNumber}
            </button>

            {/* Step Card Content */}
            <div className="space-y-4">
              {/* Header: Title & Subtitle */}
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-serif text-xl md:text-2xl text-stone-900">
                    {step.title}
                  </h3>
                  {isTargeted ? (
                    <span className="inline-flex items-center rounded-md bg-stone-900 px-2 py-0.5 text-[10px] font-sans font-medium text-stone-100 tracking-wide uppercase">
                      Active Stage
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs text-stone-600 tracking-wide">
                  {step.subtitle}
                </p>
              </div>

              {/* Tool Stack Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-medium tracking-wider text-stone-600 uppercase mr-1">
                  Stack:
                </span>
                {step.tools.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center rounded-md bg-stone-200/70 px-2 py-0.5 text-[11px] font-medium text-stone-700 transition-colors hover:bg-stone-300/80"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              {/* Step Narrative & Note Overview Link */}
              {step.relatedNoteHref ? (
                <Link
                  href={step.relatedNoteHref}
                  className="group/note block rounded-xl border border-stone-200/80 bg-stone-100/40 p-4 transition-all hover:border-stone-300 hover:bg-stone-100/80 hover:shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/70 pb-2 mb-2.5">
                    <span className="text-[11px] font-medium tracking-wider text-stone-500 uppercase">
                      Case Note Overview
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-700 group-hover/note:text-stone-950">
                      <span>{step.relatedNoteLabel || "Read Full Note"}</span>
                      <span className="inline-block transition-transform duration-200 group-hover/note:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-stone-700">
                    {step.summary}
                  </p>
                </Link>
              ) : (
                <p className="max-w-3xl text-sm leading-relaxed text-stone-600">
                  {step.summary}
                </p>
              )}

              {/* Attached Resources */}
              {step.resources.length > 0 ? (
                <div className="pt-3">
                  <p className="text-xs font-medium tracking-wider text-stone-600 uppercase mb-3">
                    Attached Vault Resources ({step.resources.length})
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {step.resources.map((res) => (
                      <ResourceCard key={res.id} resource={res} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
