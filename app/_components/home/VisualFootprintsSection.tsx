import Image from "next/image";
import Link from "next/link";
import type { FeaturedTraceItem } from "@/lib/traces/queries";
import type { SiteNavigationItem } from "@/lib/site/queries";
import Reveal from "@/app/_components/Reveal";

interface VisualFootprintsSectionProps {
  traces: FeaturedTraceItem[];
  navigationSection: SiteNavigationItem;
  categories: SiteNavigationItem[];
}

export default function VisualFootprintsSection({
  traces,
  navigationSection,
  categories,
}: VisualFootprintsSectionProps) {
  // Split into a lead pair and a secondary trio for rhythm
  const primaryPair = traces.slice(0, 2);
  const secondaryTrio = traces.slice(2, 5);

  return (
    <section className="py-16 md:py-20">
      <Reveal>
        <div>
          <p className="text-xs tracking-[0.22em] text-stone-500 uppercase">
            Observation Archive · 02
          </p>
          <h2 className="mt-1 font-serif text-3xl text-stone-900 md:text-4xl">
            {navigationSection.title || "Traces & Visual Observations"}
          </h2>
        </div>

        {/* Sub-collections Filter & View All in Same Row (Sub-rail with bottom line) */}
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
            href={navigationSection.href || "/traces"}
            className="group inline-flex shrink-0 items-center gap-1.5 pb-3 text-sm text-stone-600 transition-colors hover:text-stone-900"
          >
            <span>{navigationSection.label || "View all traces"}</span>
            <span className="inline-block no-underline transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </Reveal>

      {/* Row 1: Two wide atmospheric focus frames */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {primaryPair.map((item, idx) => (
          <Reveal key={item.id} delay={80 + idx * 80}>
            <Link
              href={item.href}
              className="group block overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100/50 p-4 transition-all duration-300 hover:border-stone-300 hover:bg-stone-100/90 md:p-5"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-stone-200/60">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3 rounded-full bg-stone-900/70 px-2.5 py-0.5 text-xs text-stone-100 backdrop-blur-xs">
                  {item.category}
                </div>
                <div className="absolute right-3 bottom-3 left-3 text-stone-100">
                  <p className="text-xs tracking-wide text-stone-200 uppercase">
                    {item.location} · {item.date}
                  </p>
                  <h3 className="mt-1 font-serif text-lg text-stone-50 drop-shadow-xs md:text-xl">
                    {item.title}
                  </h3>
                </div>
              </div>
              {item.caption ? (
                <p className="mt-3 text-xs leading-5 text-stone-500">
                  {item.caption}
                </p>
              ) : null}
            </Link>
          </Reveal>
        ))}
      </div>

      {/* Row 2: Triptych (3 balanced visual tiles) */}
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {secondaryTrio.map((item, idx) => (
          <Reveal key={item.id} delay={160 + idx * 70}>
            <Link
              href={item.href}
              className="group block overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100/50 p-3.5 transition-all duration-300 hover:border-stone-300 hover:bg-stone-100/90 md:p-4"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-200/60">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-2.5 left-2.5 rounded-full bg-stone-900/70 px-2 py-0.5 text-xs text-stone-100 backdrop-blur-xs">
                  {item.category}
                </div>
                <div className="absolute right-2.5 bottom-2.5 left-2.5 text-stone-100">
                  <p className="text-xs tracking-wide text-stone-200 uppercase">
                    {item.location}
                  </p>
                  <h3 className="mt-0.5 font-serif text-sm font-medium text-stone-50 drop-shadow-xs">
                    {item.title}
                  </h3>
                </div>
              </div>
              {item.caption ? (
                <p className="mt-2.5 text-xs leading-5 text-stone-500 line-clamp-1">
                  {item.caption}
                </p>
              ) : null}
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
