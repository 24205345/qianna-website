import Link from "next/link";
import PhotoGallery from "../photography/PhotoGallery";
import { visualWorkSections } from "@/app/_data/visual-works";
import { getVisualWorksPageData } from "@/lib/visual-works/queries";

export default async function VisualWorksPage() {
  const categories = await getVisualWorksPageData(visualWorkSections);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <div className="mb-12">
          <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">Visual Works</p>
          <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">Visual Works</h1>
          <p className="mt-4 leading-7 text-stone-500">
            Drawings, sketches, and paintings — explorations in line, wash, and color.
          </p>
        </div>

        {categories.map((category) => (
          <section key={category.slug} className="mb-16">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-stone-900 md:text-3xl">{category.title}</h2>
                {category.subtitle ? (
                  <p className="mt-2 text-sm text-stone-500">{category.subtitle}</p>
                ) : null}
                {category.description ? (
                  <p className="mt-3 text-sm leading-6 text-stone-600">{category.description}</p>
                ) : null}
              </div>
            </div>

            <PhotoGallery
              photos={category.works.map((work) => ({
                id: work.id,
                url: work.url,
                title: work.title,
                date: work.date,
                description: work.description,
              }))}
            />
          </section>
        ))}

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
