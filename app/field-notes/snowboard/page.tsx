import Link from "next/link";
import Image from "next/image";

const tripDetails = [
  { label: "Date", value: "2025.3.31 – 2025.4.8" },
  { label: "Location", value: "Superdévoluy, France" },
  { label: "Activity", value: "Snowboarding" },
];

export default function SnowboardPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      {/* ── 1. Hero Cover (fullscreen) ── */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/field-notes/snowboard/images/00_superdevoluy_cover_map.jpg"
          alt="Superdévoluy cover map"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />

        {/* Back link */}
        <div className="absolute top-6 left-6 z-20 md:top-8 md:left-10">
          <Link
            href="/field-notes"
            className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
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
            Field Notes
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-16 md:px-10 md:pb-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-[10px] tracking-[0.26em] text-white/60 uppercase">
              Field Notes
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-tight text-white md:text-7xl md:leading-[1.08]">
              Snowboard Days in Superdévoluy
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
              Late-season snow, broad ridgelines, carved spring tracks, and a fog-softened return to base.
            </p>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 right-6 z-20 flex flex-col items-center gap-2 text-white/50 md:bottom-8 md:right-10">
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

      {/* ── 2. Trip Details ── */}
      <section className="border-t border-stone-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-12 md:px-10 md:py-14">
          <p className="text-[10px] tracking-[0.26em] text-stone-400 uppercase mb-8">
            Trip Details
          </p>
          <dl className="grid gap-6 sm:grid-cols-3">
            {tripDetails.map((item) => (
              <div key={item.label}>
                <dt className="text-[10px] tracking-[0.18em] text-stone-400 uppercase mb-2">
                  {item.label}
                </dt>
                <dd className="text-sm leading-6 text-stone-600">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 3. Panorama ── */}
      <section className="border-t border-stone-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-18">
          <p className="text-[10px] tracking-[0.26em] text-stone-400 uppercase mb-8">
            The Slope
          </p>
          <div className="overflow-hidden rounded-2xl">
            <div className="relative aspect-[16/9]">
              <Image
                src="/field-notes/snowboard/images/01_superdevoluy_slope_panorama.jpg"
                alt="Slope panorama"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Alpine Basin ── */}
      <section className="border-t border-stone-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-18">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex items-end">
              <div>
                <p className="text-[10px] tracking-[0.26em] text-stone-400 uppercase mb-4">
                  Alpine Basin
                </p>
                <p className="text-sm leading-7 text-stone-600">
                  High above the tree line, the landscape opens into a vast white bowl ringed by peaks. Spring sun softens the snow surface by midday, turning morning corduroy into afternoon slalom.
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/field-notes/snowboard/images/02_superdevoluy_alpine_basin.jpg"
                  alt="Alpine basin"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Board Rest View ── */}
      <section className="border-t border-stone-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-18">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl md:order-1 order-2">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/field-notes/snowboard/images/03_superdevoluy_board_rest_view.jpg"
                  alt="Board rest view"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex items-end md:order-2 order-1">
              <div>
                <p className="text-[10px] tracking-[0.26em] text-stone-400 uppercase mb-4">
                  Board Rest
                </p>
                <p className="text-sm leading-7 text-stone-600">
                  A quiet pause on the piste edge. Board planted in the snow, lungs full of cold mountain air — the kind of stillness that only altitude can offer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Spring Chute ── */}
      <section className="border-t border-stone-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-18">
          <p className="text-[10px] tracking-[0.26em] text-stone-400 uppercase mb-8">
            Spring Chute
          </p>
          <div className="overflow-hidden rounded-2xl">
            <div className="relative aspect-[16/9]">
              <Image
                src="/field-notes/snowboard/images/04_superdevoluy_spring_chute.jpg"
                alt="Spring chute"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-stone-500 whitespace-nowrap">
            Late-season conditions brought a mix of powder stashes and spring corn — the last great runs before the thaw.
          </p>
        </div>
      </section>

      {/* ── 7. Videos ── */}
      <section className="border-t border-stone-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-18">
          <p className="text-[10px] tracking-[0.26em] text-stone-400 uppercase mb-8">
            In Motion
          </p>
          <div className="space-y-10">
            <div>
              <p className="mb-4 text-sm text-stone-500">Ridge Glide</p>
              <div className="overflow-hidden rounded-2xl bg-stone-100">
                <video
                  src="/field-notes/snowboard/video/05_superdevoluy_ridge_glide.mp4"
                  controls
                  playsInline
                  className="w-full"
                />
              </div>
            </div>
            <div>
              <p className="mb-4 text-sm text-stone-500">Foggy Base</p>
              <div className="overflow-hidden rounded-2xl bg-stone-100">
                <video
                  src="/field-notes/snowboard/video/06_superdevoluy_foggy_base.mp4"
                  controls
                  playsInline
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer nav ── */}
      <div className="border-t border-stone-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10">
          <Link
            href="/field-notes"
            className="inline-flex items-center gap-2 text-sm text-stone-500 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-900"
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
            Back to Field Notes
          </Link>
        </div>
      </div>
    </div>
  );
}
