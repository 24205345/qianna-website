import Image from "next/image";
import Link from "next/link";
import type { FeaturedProject } from "@/lib/projects/queries";
import type { SiteNavigationItem } from "@/lib/site/queries";
import Reveal from "@/app/_components/Reveal";

interface FeaturedProjectsSectionProps {
  projects: FeaturedProject[];
  navigationSection: SiteNavigationItem;
  categories: SiteNavigationItem[];
}

export default function FeaturedProjectsSection({
  projects,
  navigationSection,
  categories,
}: FeaturedProjectsSectionProps) {
  const leadProject = projects.find((p) => p.isLead) ?? projects[0];
  const companionProject = projects.find((p) => p !== leadProject);

  return (
    <section className="py-16 md:py-20">
      <Reveal>
        <div>
          <p className="text-xs tracking-[0.22em] text-stone-500 uppercase">
            Curated Index · 01
          </p>
          <h2 className="mt-1 font-serif text-3xl text-stone-900 md:text-4xl">
            {navigationSection.title || "Selected Works"}
          </h2>
        </div>

        {/* Filter by Area & View All in Same Row (Sub-rail with bottom line) */}
        <div className="mt-8 flex flex-col gap-4 border-b border-stone-200/80 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {categories.map((cat) => (
              <Link
                key={cat.itemKey}
                href={cat.href}
                className="-mb-px border-b-2 border-transparent pb-3 text-sm text-stone-500 transition-all hover:border-stone-900 hover:font-medium hover:text-stone-900"
              >
                {cat.title}
              </Link>
            ))}
          </div>

          <Link
            href={navigationSection.href || "/projects"}
            className="group inline-flex shrink-0 items-center gap-1.5 pb-3 text-sm text-stone-600 transition-colors hover:text-stone-900"
          >
            <span>{navigationSection.label || "View all projects"}</span>
            <span className="inline-block no-underline transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </Reveal>

      {/* Editorial Grid: Asymmetric Layout */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Lead Feature: 7 cols */}
        {leadProject ? (
          <Reveal delay={80} className="lg:col-span-7">
            <Link
              href={`/projects/${leadProject.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100/60 p-5 transition-all duration-300 hover:border-stone-300 hover:bg-stone-100/90 md:p-6"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-stone-200/60">
                <Image
                  src={leadProject.coverImageUrl}
                  alt={leadProject.title}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                />
                <div className="absolute top-3 left-3 rounded-full bg-stone-900/75 px-3 py-1 text-xs text-stone-100 backdrop-blur-xs">
                  {leadProject.year}
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-stone-100/90 px-3 py-1 text-xs font-medium tracking-wide text-stone-700 backdrop-blur-xs">
                  FEATURED RESEARCH
                </div>
              </div>

              <div className="mt-6 flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs tracking-[0.2em] text-stone-500 uppercase">
                      {leadProject.category}
                    </span>
                  </div>
                  <h3 className="mt-2 font-serif text-2xl text-stone-900 transition-colors group-hover:text-stone-700 md:text-3xl">
                    {leadProject.title}
                  </h3>
                  {leadProject.subtitle ? (
                    <p className="mt-1 text-xs font-medium text-stone-600">
                      {leadProject.subtitle}
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {leadProject.description}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-1.5 border-t border-stone-200/80 pt-4">
                  {leadProject.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-stone-200/60 px-2 py-0.5 text-xs text-stone-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </Reveal>
        ) : null}

        {/* Companion Feature: 5 cols */}
        {companionProject ? (
          <Reveal delay={160} className="lg:col-span-5">
            <Link
              href={`/projects/${companionProject.slug}`}
              className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100/60 p-5 transition-all duration-300 hover:border-stone-300 hover:bg-stone-100/90 md:p-6"
            >
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  {/* Top Tags Bar */}
                  <div className="flex flex-wrap items-center gap-1.5 border-b border-stone-200/80 pb-4">
                    {companionProject.tags
                      .filter((tag) => tag.toUpperCase() !== "BJTU")
                      .slice(0, 2)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-stone-200/60 px-2 py-0.5 text-xs text-stone-600"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  {/* Text Content */}
                  <div className="mt-5">
                    <span className="text-xs tracking-[0.2em] text-stone-500 uppercase">
                      {companionProject.category}
                    </span>
                    <h3 className="mt-2 font-serif text-2xl text-stone-900 transition-colors group-hover:text-stone-700">
                      {companionProject.title}
                    </h3>
                    {companionProject.subtitle ? (
                      <p className="mt-1 text-xs font-medium text-stone-600">
                        {companionProject.subtitle}
                      </p>
                    ) : null}
                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      {companionProject.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Image Block */}
                <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-xl bg-stone-200/60">
                  <Image
                    src={companionProject.coverImageUrl}
                    alt={companionProject.title}
                    fill
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-stone-900/75 px-3 py-1 text-xs text-stone-100 backdrop-blur-xs">
                    {companionProject.year}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-amber-950/80 px-3 py-1 text-xs font-medium tracking-wide text-amber-100 backdrop-blur-xs">
                    <span>FLIPBOOK</span>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
