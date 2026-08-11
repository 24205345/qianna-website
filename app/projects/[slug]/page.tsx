import { notFound } from "next/navigation";
import PageViewTracker from "@/app/_components/analytics/PageViewTracker";
import {
  thesisGalleryFallback,
  xicaoshiGalleryFallback,
} from "@/app/_data/project-galleries";
import { thesisDetailFallback, xicaoshiDetailFallback } from "@/app/_data/project-details";
import type { ProjectFullFallback } from "@/lib/projects/queries";
import { getProjectFullBySlug, getProjectGallery } from "@/lib/projects/queries";
import ThesisProjectView from "../_components/ThesisProjectView";
import XicaoshiProjectView from "../_components/XicaoshiProjectView";

const SLUG_CONFIG: Record<
  string,
  { fallback: ProjectFullFallback; galleryFallback: typeof thesisGalleryFallback }
> = {
  thesis: {
    fallback: {
      title: "Between Destinations",
      category: "Thesis & Design Research",
      overviewParagraphs: thesisDetailFallback.overviewParagraphs,
      projectDetails: thesisDetailFallback.projectDetails,
      layoutTemplate: "thesis",
      intro_video_url: thesisDetailFallback.introVideoUrl,
    },
    galleryFallback: thesisGalleryFallback,
  },
  "xicaoshi-red-temple": {
    fallback: {
      title: "Landscape Description",
      subtitle: "Block Preservation and Renewal Design",
      category: "Architecture Project",
      overviewParagraphs: xicaoshiDetailFallback.overviewParagraphs,
      projectDetails: xicaoshiDetailFallback.projectDetails,
      layoutTemplate: "xicaoshi",
      intro_video_url: xicaoshiDetailFallback.introVideoUrl,
    },
    galleryFallback: xicaoshiGalleryFallback,
  },
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = SLUG_CONFIG[slug];

  if (!config) {
    notFound();
  }

  const [project, galleryImages] = await Promise.all([
    getProjectFullBySlug(slug, config.fallback),
    getProjectGallery(slug, config.galleryFallback),
  ]);

  if (project.layout_template === "thesis") {
    return (
      <>
        <PageViewTracker contentType="project" contentSlug={slug} />
        <ThesisProjectView project={project} galleryImages={galleryImages} />
      </>
    );
  }

  if (project.layout_template === "xicaoshi") {
    return (
      <>
        <PageViewTracker contentType="project" contentSlug={slug} />
        <XicaoshiProjectView project={project} galleryImages={galleryImages} />
      </>
    );
  }

  notFound();
}
