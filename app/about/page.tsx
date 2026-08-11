import { getAboutPageContent } from "@/lib/about/queries";
import PageViewTracker from "@/app/_components/analytics/PageViewTracker";

export default async function AboutPage() {
  const content = await getAboutPageContent();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <PageViewTracker contentType="page" contentSlug="about" />
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">About Me</p>
        <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">
          {content.pageTitle}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-600">
          {content.pageDescription}
        </p>

        <section className="mt-16">
          <p className="text-xs tracking-[0.22em] text-stone-500 uppercase">Timeline</p>
          <div className="mt-6 grid gap-4">
            {content.timeline.map((item) => (
              <article
                key={`${item.period}-${item.title}`}
                className="grid gap-4 rounded-2xl border border-stone-200/80 bg-white/70 p-5 md:grid-cols-[8rem_1fr] md:p-6"
              >
                <p className="text-xs tracking-[0.18em] text-stone-400 uppercase">
                  {item.period}
                </p>
                <div>
                  <h2 className="font-serif text-2xl text-stone-900">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-stone-600">{item.description}</p>
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
              {content.workingAcross.map((item) => (
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
              {content.currentFocus}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
