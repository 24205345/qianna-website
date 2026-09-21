"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Reveal from "@/app/_components/Reveal";
import type { WorkflowPipeline } from "@/lib/workbench/types";

interface WorkbenchSectionProps {
  pipelines: WorkflowPipeline[];
}

export default function WorkbenchSection({ pipelines }: WorkbenchSectionProps) {
  const [activePipelineId, setActivePipelineId] = useState<string>(
    pipelines[0]?.id || "ai-development"
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const activePipeline =
    pipelines.find((p) => p.id === activePipelineId) || pipelines[0];

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
  };

  useEffect(() => {
    checkScroll();
    const timer = setTimeout(checkScroll, 100);
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        clearTimeout(timer);
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
    return () => clearTimeout(timer);
  }, [activePipelineId]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const itemEl = scrollContainerRef.current.querySelector("a");
    const itemWidth = itemEl ? itemEl.offsetWidth : 240;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -itemWidth : itemWidth,
      behavior: "smooth",
    });
  };

  if (!activePipeline) return null;

  return (
    <section id="workbench" className="py-16 md:py-20">
      <Reveal>
        <div>
          <p className="text-xs tracking-[0.22em] text-stone-500 uppercase">
            Pipelines & Digital Vault · 04
          </p>
          <h2 className="mt-1 font-serif text-3xl text-stone-900 md:text-4xl">
            Workbench
          </h2>
        </div>

        {/* Sub-rail: Pipelines Switcher & View All in Same Row (Matching Projects & Traces) */}
        <div className="mt-8 flex flex-col gap-4 border-b border-stone-200/80 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {pipelines.map((pipeline) => {
              const isActive = pipeline.id === activePipelineId;
              return (
                <button
                  key={pipeline.id}
                  type="button"
                  onClick={() => {
                    setActivePipelineId(pipeline.id);
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({
                        left: 0,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className={`-mb-px border-b-2 pb-3 text-sm transition-all cursor-pointer ${
                    isActive
                      ? "border-stone-900 font-medium text-stone-900"
                      : "border-transparent text-stone-500 hover:border-stone-900 hover:font-medium hover:text-stone-900"
                  }`}
                >
                  {pipeline.title}
                </button>
              );
            })}
          </div>

          <Link
            href="/workbench"
            className="group inline-flex shrink-0 items-center gap-1.5 pb-3 text-sm text-stone-600 transition-colors hover:text-stone-900"
          >
            <span>Explore all workflows</span>
            <span className="inline-block no-underline transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </Reveal>

      {/* Narrative Lead Card / Overview (Direct link to /workbench) */}
      <div className="mt-8">
        <Reveal delay={80}>
          <Link
            href={`/workbench?pipeline=${activePipeline.id}`}
            className="group block rounded-2xl border border-stone-200/80 bg-stone-100/50 p-6 md:p-8 transition-all duration-300 hover:border-stone-400 hover:bg-stone-100/80 cursor-pointer"
          >
            <div>
              <h3 className="font-serif text-xl text-stone-900 md:text-2xl transition-colors group-hover:text-stone-700">
                {activePipeline.englishTitle || activePipeline.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone-600 max-w-3xl">
                {activePipeline.summary}
              </p>
            </div>
          </Link>
        </Reveal>
      </div>

      {/* Stepped Workflow Horizontal Timeline (No outer box, simple connected timeline rail) */}
      <div className="mt-10">
        <Reveal delay={120}>
          <div className="relative group/carousel">
            {/* Left Button - Always visible, disabled when at start */}
            <button
              type="button"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              className={`absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border bg-white/95 shadow-md backdrop-blur-xs transition-all ${
                canScrollLeft
                  ? "border-stone-200/90 text-stone-700 hover:border-stone-400 hover:bg-white hover:shadow-lg active:scale-95 cursor-pointer opacity-100"
                  : "border-stone-200/50 text-stone-300 opacity-30 cursor-not-allowed"
              }`}
              aria-label="Previous stages"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Right Button - Always visible, disabled when at end */}
            <button
              type="button"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              className={`absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border bg-white/95 shadow-md backdrop-blur-xs transition-all ${
                canScrollRight
                  ? "border-stone-200/90 text-stone-700 hover:border-stone-400 hover:bg-white hover:shadow-lg active:scale-95 cursor-pointer opacity-100"
                  : "border-stone-200/50 text-stone-300 opacity-30 cursor-not-allowed"
              }`}
              aria-label="Next stages"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Horizontal Timeline Track */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-1"
            >
              {activePipeline.steps.map((step, index) => {
                const isFirst = index === 0;
                const isLast = index === activePipeline.steps.length - 1;
                return (
                  <Link
                    key={step.id}
                    href={`/workbench?pipeline=${activePipeline.id}#${step.id}`}
                    className="group relative flex w-[260px] sm:w-1/2 md:w-1/3 lg:w-1/4 shrink-0 snap-start flex-col"
                  >
                    {/* Timeline Node & Connector Line - Centered */}
                    <div className="relative flex items-center justify-center">
                      {/* Connector Line behind Circle */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 h-px transition-colors ${
                          isFirst
                            ? "left-1/2 right-0 bg-stone-200 group-hover:bg-stone-400"
                            : isLast
                            ? "left-0 right-1/2 bg-stone-200 group-hover:bg-stone-400"
                            : "left-0 right-0 bg-stone-200 group-hover:bg-stone-400"
                        }`}
                      />

                      {/* Step Number (Frameless) */}
                      <span className="relative z-10 bg-stone-50 px-2.5 text-xs font-medium tracking-widest text-stone-400 transition-colors group-hover:text-stone-900">
                        {step.stepNumber}
                      </span>
                    </div>

                    {/* Step Information (Centered under the icon with comfortable inter-stage spacing) */}
                    <div className="mt-3.5 flex flex-1 flex-col items-center px-4 text-center sm:px-5 md:px-6">
                      <h4 className="font-serif text-base text-stone-900 transition-colors group-hover:text-stone-600 line-clamp-1">
                        {step.title}
                      </h4>

                      <p className="mt-2 text-xs leading-5 text-stone-600 line-clamp-3">
                        {step.summary}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
