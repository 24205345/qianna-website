import Link from "next/link";
import type { GalleryImage } from "@/app/_data/project-galleries";
import type { ProjectFull } from "@/lib/projects/queries";
import ThesisGallery from "./ThesisGallery";
import { thesisHeroVideoFallback } from "@/app/_data/project-galleries";

interface Props {
  project: ProjectFull;
  galleryImages: GalleryImage[];
}

export default function ThesisProjectView({ project, galleryImages }: Props) {
  const heroVideoSrc = project.hero_video_url ?? thesisHeroVideoFallback;

  return (
    <div className="bg-stone-950 text-stone-100 font-sans">
      <section className="relative h-screen w-full overflow-hidden">
        <video
          src={heroVideoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        <div className="absolute top-6 left-6 z-20 md:top-8 md:left-10">
          <Link href="/projects" className="flex items-center gap-2 text-sm text-stone-300 transition-colors hover:text-stone-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M5 12l7 7M5 12l7-7" /></svg>
            Projects
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pt-20 pb-14 md:px-10 md:pt-24 md:pb-16">
        <p className="text-[10px] tracking-[0.26em] text-stone-500 uppercase">{project.category}</p>
        <h1 className="mt-5 font-serif text-5xl leading-tight text-stone-50 md:text-7xl">{project.title}</h1>
      </section>

      <section className="border-t border-stone-800">
        <div className="mx-auto w-full max-w-5xl px-6 py-12 md:px-10 md:py-14">
          <p className="text-[10px] tracking-[0.26em] text-stone-500 uppercase mb-8">Project Details</p>
          <dl className="grid gap-6 sm:grid-cols-3">
            {project.project_details.map((item) => (
              <div key={item.label}>
                <dt className="text-[10px] tracking-[0.18em] text-stone-500 uppercase mb-2">{item.label}</dt>
                <dd className="text-sm leading-6 text-stone-300">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-stone-800">
        <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-18">
          <p className="text-[10px] tracking-[0.26em] text-stone-500 uppercase mb-8">Project Overview</p>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <div className="hidden md:flex items-start pt-1">
              <span className="font-serif text-7xl leading-none text-stone-800 select-none">01</span>
            </div>
            <div className="space-y-5">
              {project.overview_paragraphs.map((para, i) => (
                <p key={i} className="leading-8 text-stone-400">{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {project.intro_video_url ? (
        <section className="border-t border-stone-800">
          <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-18">
            <p className="text-[10px] tracking-[0.26em] text-stone-500 uppercase mb-8">Project Introduction</p>
            <div className="overflow-hidden rounded-2xl bg-stone-900">
              <iframe
                src={project.intro_video_url}
                allow="autoplay; encrypted-media"
                className="w-full"
                style={{ border: "none", aspectRatio: "16/9" }}
              />
            </div>
          </div>
        </section>
      ) : null}

      <ThesisGallery images={galleryImages} />

      <div className="border-t border-stone-800">
        <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-stone-300">
            ← Back to Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
