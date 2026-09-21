import type { Metadata } from "next";
import PageViewTracker from "@/app/_components/analytics/PageViewTracker";
import Reveal from "@/app/_components/Reveal";
import { getWorkbenchPipelines } from "@/lib/workbench/queries";
import { buildPageMetadata } from "@/lib/seo/metadata";
import WorkbenchClient from "./_components/WorkbenchClient";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Workbench · Pipelines & Digital Vault",
    description:
      "A curated archive of creative pipelines, engineering workflows, and digital vault resources across diverse disciplines.",
    path: "/workbench",
  });
}

interface WorkbenchPageProps {
  searchParams?: Promise<{ pipeline?: string }>;
}

export default async function WorkbenchPage({ searchParams }: WorkbenchPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialPipelineId = resolvedSearchParams?.pipeline;
  const pipelines = await getWorkbenchPipelines();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <PageViewTracker contentType="page" contentSlug="workbench" />

      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        {/* Page Top Header - Exactly matching /traces layout */}
        <div className="mb-4">
          <Reveal>
            <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">
              Pipelines & Digital Vault
            </p>
            <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">
              Workbench
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-stone-500">
              A curated archive of creative pipelines, engineering workflows, and digital vault resources across diverse disciplines.
            </p>
          </Reveal>
        </div>

        {/* Main Content Area - Flows directly into Sub-rail */}
        <Reveal delay={80}>
          <WorkbenchClient
            pipelines={pipelines}
            initialPipelineId={initialPipelineId}
          />
        </Reveal>
      </main>
    </div>
  );
}
