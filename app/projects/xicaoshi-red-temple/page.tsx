import Link from "next/link";
import Image from "next/image";
import ProjectGallery from "./ProjectGallery";

const projectDetails = [
  { label: "Category", value: "Architecture Project" },
  { label: "Year", value: "2023" },
  { label: "Location", value: "Beijing Central Axis, China" },
];

const overviewParagraphs = [
  "In the context of the preservation and renewal of historic cities, and with the Beijing Central Axis world heritage application, old urban areas on the central axis need sustainable development in multiple dimensions.",
  "The design object — Xicaoshi Red Temple block — is located on the east side of the south central axis of Beijing, in the transitional space between 'city' and 'suburb'. On the basis of block design, a typical courtyard is selected for in-depth design as a demonstration for courtyard protection and renewal.",
  "The method of 'urban acupuncture' is proposed — taking relatively small-scale intervention measures at specific nodes of the block, so as to have a positive catalytic effect on social, economic, and environmental problems in a wider range.",
];

export default function XicaoshiRedTemplePage() {
  return (
    <div className="bg-stone-950 text-stone-100 font-sans">
      {/* ── 1. Hero Cover (fullscreen) ── */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/projects/xicaoshi-red-temple/images/00_landscape_cover.jpg"
          alt="Xicaoshi Red Temple cover"
          fill
          priority
          className="object-cover"
        />
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
        <p className="text-[10px] tracking-[0.26em] text-stone-500 uppercase">Architecture Project</p>
        <h1 className="mt-4 font-serif text-5xl text-stone-100 md:text-7xl">Landscape Description</h1>
        <p className="mt-3 text-xl text-stone-400">Block Preservation and Renewal Design</p>
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

      {/* ── 4. Overview ── */}
      <section className="border-t border-stone-800">
        <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-18">
          <p className="text-[10px] tracking-[0.26em] text-stone-500 uppercase mb-8">
            Overview
          </p>
          <div className="max-w-3xl space-y-6">
            {overviewParagraphs.map((p, i) => (
              <p key={i} className="text-sm leading-7 text-stone-300">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Project Gallery ── */}
      <ProjectGallery />

      {/* ── Footer nav ── */}
      <div className="border-t border-stone-800">
        <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-stone-500 underline decoration-stone-700 underline-offset-4 transition-colors hover:text-stone-100"
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
