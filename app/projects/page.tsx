import Link from "next/link";

const projects = [
  {
    slug: "thesis",
    category: "Thesis & Design Research",
    title: "Between Destinations",
    description:
      "The project investigates the emotional costs of London's public transport system using geospatial analysis and wearable GSR sensors, proposing a dual intervention of a mobile app and a parasitic architectural system to redefine urban mobility and social interaction.",
    tags: ["Emotional Costs", "Geospatial Analysis", "Parasitic Architecture"],
    year: "2025",
  },
  {
    slug: "xicaoshi-red-temple",
    category: "Architecture Project",
    title: "Landscape Description",
    description:
      "Block preservation and renewal design for Xicaoshi Red Temple block on Beijing's central axis, using urban acupuncture strategy for sustainable micro-renewal of historic urban areas.",
    tags: ["Urban Acupuncture", "Heritage Preservation", "Micro-renewal"],
    year: "2023",
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      {/* back to home */}
      <div className="mx-auto w-full max-w-5xl px-6 pt-8 md:px-10 md:pt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-stone-800"
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
          Back to Home
        </Link>
      </div>

      <main className="mx-auto w-full max-w-5xl px-6 py-12 md:px-10 md:py-16">
        {/* header */}
        <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">Projects</p>
        <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">Projects</h1>
        <p className="mt-4 max-w-2xl leading-7 text-stone-500">
          Thesis and design research, architecture projects, and digital product work.
        </p>

        {/* project list */}
        <div className="mt-14 flex flex-col gap-6">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100/60 p-7 transition-colors hover:bg-stone-100 md:p-9"
            >
              {/* category + year */}
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] tracking-[0.22em] text-stone-500 uppercase">
                  {project.category}
                </p>
                <p className="text-xs text-stone-400">{project.year}</p>
              </div>

              {/* title */}
              <h2 className="mt-4 font-serif text-3xl text-stone-900 transition-colors group-hover:text-stone-700 md:text-4xl">
                {project.title}
              </h2>

              {/* description */}
              <p className="mt-3 text-sm leading-6 text-stone-500 line-clamp-2">
                {project.description}
              </p>

              {/* tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-stone-300/70 px-3 py-1 text-[11px] tracking-wide text-stone-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* arrow */}
              <div className="mt-6 flex items-center gap-1.5 text-sm text-stone-500 transition-colors group-hover:text-stone-800">
                <span>View project</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="translate-x-0 transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
