import Link from "next/link";
import ProjectGallery from "./ProjectGallery";

const projectDetails = [
  { label: "Programme", value: "Urban Design MArch" },
  { label: "Cluster", value: "RC15" },
  {
    label: "Students",
    value: "Bor-En Huang, Qianqian Wang, Shanshan Gao",
  },
];

const overviewParagraphs = [
  "The project investigates the hidden emotional costs embedded in London's public transport system. While efficient on the surface, the network imposes overlooked burdens on its most dependent users, such as long commutes, cognitive fatigue, and emotional strain. These impacts are rarely addressed in transport planning, yet they deepen urban inequality.",
  "Using geospatial analysis, public transport accessibility level (PTAL) mapping, and wearable GSR sensors, the group mapped emotional stress across transit journeys in Stratford (East London), revealing unequal experiential geographies, and how, for many, public transport is not a path to opportunity but a mechanism of urban injustice.",
  "In response, the project proposes a dual intervention: a mobile app that tracks users' emotional states in transit, offering a live affective overview of the network and suggesting neurodiverse routes; and a parasitic architectural system embedded in multimodal hubs, offering spaces from quiet rest to collective events, in a process that transforms commuting into civic time and reimagines mobility as a shared spatial practice of care.",
];

export default function ThesisPage() {
  return (
    <div className="bg-stone-950 text-stone-100 font-sans">
      {/* ── 1. Hero Video (fullscreen) ── */}
      <section className="relative h-screen w-full overflow-hidden">
        <iframe
          src="https://drive.google.com/file/d/1joJd34gPQ_bt23fcfRuxdXbv08hteVaK/preview"
          allow="autoplay; encrypted-media"
          className="absolute inset-0 h-full w-full"
          style={{ border: "none" }}
        />
        {/* dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

        {/* nav back link */}
        <div className="absolute top-6 left-6 z-20 md:top-8 md:left-10">
          <Link
            href="/projects"
            className="flex items-center gap-2 text-sm text-stone-300 transition-colors hover:text-stone-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M5 12l7 7M5 12l7-7" />
            </svg>
            Projects
          </Link>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400">
          <span className="text-[10px] tracking-[0.22em] uppercase">Scroll</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-bounce"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ── 2. Title ── */}
      <section className="mx-auto w-full max-w-5xl px-6 pt-20 pb-14 md:px-10 md:pt-24 md:pb-16">
        <p className="text-[10px] tracking-[0.26em] text-stone-500 uppercase">
          Thesis &amp; Design Research
        </p>
        <h1 className="mt-5 font-serif text-5xl leading-tight text-stone-50 md:text-7xl md:leading-[1.08]">
          Between Destinations
        </h1>
      </section>

      {/* ── 3. Project Details ── */}
      <section className="border-t border-stone-800">
        <div className="mx-auto w-full max-w-5xl px-6 py-12 md:px-10 md:py-14">
          <p className="text-[10px] tracking-[0.26em] text-stone-500 uppercase mb-8">
            Project Details
          </p>
          <dl className="grid gap-6 sm:grid-cols-3">
            {projectDetails.map((item) => (
              <div key={item.label}>
                <dt className="text-[10px] tracking-[0.18em] text-stone-500 uppercase mb-2">
                  {item.label}
                </dt>
                <dd className="text-sm leading-6 text-stone-300">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 4. Project Overview ── */}
      <section className="border-t border-stone-800">
        <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-18">
          <p className="text-[10px] tracking-[0.26em] text-stone-500 uppercase mb-8">
            Project Overview
          </p>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            {/* left: decorative label */}
            <div className="hidden md:flex items-start pt-1">
              <span className="font-serif text-7xl leading-none text-stone-800 select-none">
                01
              </span>
            </div>
            {/* right: paragraphs */}
            <div className="space-y-5">
              {overviewParagraphs.map((para, i) => (
                <p key={i} className="leading-8 text-stone-400">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Intro Video ── */}
      <section className="border-t border-stone-800">
        <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-18">
          <p className="text-[10px] tracking-[0.26em] text-stone-500 uppercase mb-8">
            Project Introduction
          </p>
          <div className="overflow-hidden rounded-2xl bg-stone-900">
            <iframe
              src="https://drive.google.com/file/d/1YvNuMVlKYizcHRTqBWhPklIDExRCMYHk/preview"
              allow="autoplay; encrypted-media"
              className="w-full"
              style={{ border: "none", aspectRatio: "16/9" }}
            />
          </div>
        </div>
      </section>

      {/* ── 6. Project Gallery ── */}
      <ProjectGallery />

      {/* ── Footer nav ── */}
      <div className="border-t border-stone-800">
        <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-stone-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M5 12l7 7M5 12l7-7" />
            </svg>
            Back to Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
