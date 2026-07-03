import Link from "next/link";
import {
  getSiteNavigationItem,
  getSiteNavigationItems,
} from "@/lib/site/queries";

const timeline = [
  {
    period: "2025-Now",
    title: "AI Product Manager",
    description:
      "Working on digital platform development in the optical display manufacturing industry, focusing on AI product management and platform-based workflows.",
  },
  {
    period: "2024-2025",
    title: "Urban Design",
    description:
      "Studied Urban Design at University College London. In the RC15 cluster, researched urban biodiversity mapping through spatial data, visual mapping, and AI-assisted workflows.",
  },
  {
    period: "2023-2024",
    title: "SaaS ERP Product Internship",
    description:
      "Worked in a software company serving the FMCG industry, moving from UI design to product management and learning how enterprise workflows become digital tools.",
  },
  {
    period: "2018-2023",
    title: "Architecture Design",
    description:
      "Studied Architecture Design at Beijing Jiaotong University (BJTU), building a foundation in spatial design, public life, visual storytelling, and design research.",
  },
];

const workingAcross = [
  "Spatial systems",
  "Enterprise workflows",
  "Urban data and mapping",
  "Visual communication",
  "AI product development",
];

export default async function AboutPage() {
  const navigationItems = await getSiteNavigationItems();
  const pageCopy = getSiteNavigationItem(navigationItems, "about");

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">{pageCopy.label}</p>
        <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">{pageCopy.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-600">
          {pageCopy.description}
        </p>

        <section className="mt-16">
          <p className="text-xs tracking-[0.22em] text-stone-500 uppercase">
            Timeline
          </p>
          <div className="mt-6 grid gap-4">
            {timeline.map((item) => (
              <article
                key={item.period}
                className="grid gap-4 rounded-2xl border border-stone-200/80 bg-white/70 p-5 md:grid-cols-[8rem_1fr] md:p-6"
              >
                <p className="text-xs tracking-[0.18em] text-stone-400 uppercase">
                  {item.period}
                </p>
                <div>
                  <h2 className="font-serif text-2xl text-stone-900">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-stone-600">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-8 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-xs tracking-[0.22em] text-stone-500 uppercase">
              Working Across
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {workingAcross.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-stone-300/70 px-3 py-1.5 text-xs tracking-wide text-stone-500"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.22em] text-stone-500 uppercase">
              Current Focus
            </p>
            <p className="mt-5 text-sm leading-7 text-stone-600 md:text-base md:leading-8">
              Today, I am interested in AI products that help people observe,
              organize, and act on complex information, especially in spatial,
              industrial, and operational contexts.
            </p>
          </div>
        </section>

        <div className="mt-16 border-t border-stone-200 pt-8">
          <Link
            href="/"
            className="text-sm text-stone-600 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-900"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
