import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const projectTracks = [
    {
      title: "Thesis & Design Research",
      description:
        "Urban systems, public life, and spatial narratives developed through mapping and critical inquiry.",
    },
    {
      title: "Architecture Projects",
      description:
        "Studio and built work shaped by context, material sensitivity, and lived experience.",
    },
    {
      title: "Digital Product Work",
      description:
        "Interface concepts translating complex spatial data into clear tools for people and cities.",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <header className="relative min-h-screen w-full overflow-hidden">
        <Image
          src="/images/hero-image.jpg"
          alt="Qianna Wang cover image"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/42 via-black/18 to-black/8" />
        <div className="relative z-10 flex min-h-screen items-end">
          <div className="w-full px-4 pb-12 md:px-8 md:pb-16 lg:px-12 lg:pb-18">
            <h1 className="font-serif text-4xl text-stone-50 md:text-6xl">
              Qianna Wang
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-stone-100 md:text-lg">
              Urban design, visual storytelling, and spatial observation.
            </p>
            <a
              href="#content"
              className="mt-6 inline-flex w-fit items-center justify-center rounded-full border border-stone-100/70 bg-stone-50/90 px-6 py-3 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-50"
            >
              Enter
            </a>
          </div>
        </div>
      </header>

      <main
        id="content"
        className="mx-auto w-full max-w-5xl px-6 py-12 md:px-10 md:py-16"
      >
        <section className="py-14 md:py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl text-stone-900 md:text-4xl">
              Projects Preview
            </h2>
            <Link
              href="/projects"
              className="text-sm text-stone-600 underline decoration-stone-300 underline-offset-4"
            >
              View all projects
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {projectTracks.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-stone-200/80 bg-stone-100/70 p-5"
              >
                <h3 className="font-serif text-2xl text-stone-900">{item.title}</h3>
                <p className="mt-3 leading-7 text-stone-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 pb-8 md:grid-cols-2">
          <Link
            href="/photography"
            className="rounded-2xl border border-stone-200/80 bg-stone-100/70 p-6 transition-colors hover:bg-stone-100"
          >
            <p className="text-xs tracking-[0.18em] text-stone-500 uppercase">
              Photography
            </p>
            <h3 className="mt-3 font-serif text-3xl text-stone-900">
              Quiet urban frames
            </h3>
            <p className="mt-3 leading-7 text-stone-600">
              A separate collection of observations in light, movement, and
              place.
            </p>
          </Link>

          <Link
            href="/visual-works"
            className="rounded-2xl border border-stone-200/80 bg-stone-100/70 p-6 transition-colors hover:bg-stone-100"
          >
            <p className="text-xs tracking-[0.18em] text-stone-500 uppercase">
              Visual Works
            </p>
            <h3 className="mt-3 font-serif text-3xl text-stone-900">
              Drawings and sketches
            </h3>
            <p className="mt-3 leading-7 text-stone-600">
              Studies in form, rhythm, and atmosphere developed by hand and
              mixed media.
            </p>
          </Link>

          <Link
            href="/field-notes"
            className="rounded-2xl border border-stone-200/80 bg-stone-100/70 p-6 transition-colors hover:bg-stone-100"
          >
            <p className="text-xs tracking-[0.18em] text-stone-500 uppercase">
              Field Notes
            </p>
            <h3 className="mt-3 font-serif text-3xl text-stone-900">
              Trails and movement
            </h3>
            <p className="mt-3 leading-7 text-stone-600">
              Hiking journeys, outdoor routes, and movement-based observation of
              landscapes.
            </p>
          </Link>

          <Link
            href="/about"
            className="rounded-2xl border border-stone-200/80 bg-stone-100/70 p-6 transition-colors hover:bg-stone-100"
          >
            <p className="text-xs tracking-[0.18em] text-stone-500 uppercase">
              About
            </p>
            <h3 className="mt-3 font-serif text-3xl text-stone-900">
              Background and approach
            </h3>
            <p className="mt-3 leading-7 text-stone-600">
              Architecture training, urban design direction, and how research
              translates into design decisions.
            </p>
          </Link>
        </section>

      </main>

      <footer className="border-t border-stone-300/70 bg-stone-300/35">
        <div className="mx-auto max-w-5xl px-6 pt-12 pb-6 md:px-10 md:pt-14">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_1fr] md:gap-14">
            <div>
              <h2 className="font-serif text-xl text-stone-900">Qianna Wang</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
                Urban design, visual storytelling, and spatial observation.
              </p>
            </div>

            <div className="grid gap-4 text-xs leading-6 text-stone-600">
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-stone-500/80">
                  Email
                </p>
                <a
                  href="mailto:qianqianwang1099@gmail.com"
                  className="text-sm text-stone-700 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-900"
                >
                  qianqianwang1099@gmail.com
                </a>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-stone-500/80">
                  Location
                </p>
                <p className="text-sm text-stone-700">Shenzhen, China</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-stone-500/80">
                  Availability
                </p>
                <p className="text-sm text-stone-700">
                  Open to remote and international opportunities
                </p>
              </div>
            </div>
          </div>
          <p className="mt-10 text-center text-[10px] tracking-[0.08em] text-stone-500/75">
            &copy; 2026 Qianna Wang
          </p>
        </div>
      </footer>
    </div>
  );
}
