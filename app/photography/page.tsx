import Link from "next/link";
import PhotoGallery from "./PhotoGallery";
import { photographySections } from "@/app/_data/photography";
import { getPhotographyPageData } from "@/lib/photography/queries";

export default async function PhotographyPage() {
  const collections = await getPhotographyPageData(photographySections);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <div className="mb-12">
          <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">Photography</p>
          <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">Photography</h1>
          <p className="mt-4 leading-7 text-stone-500">
            Quiet urban frames — a collection of observations in light, movement, and place.
          </p>
        </div>

        {collections.map((collection) => (
          <section key={collection.slug} className="mb-16">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-stone-900 md:text-3xl">{collection.title}</h2>
                {collection.subtitle ? (
                  <p className="mt-2 text-sm text-stone-500">{collection.subtitle}</p>
                ) : null}
                {collection.description ? (
                  <p className="mt-3 text-sm leading-6 text-stone-600">{collection.description}</p>
                ) : null}
              </div>
            </div>

            <PhotoGallery
              photos={collection.photos.map((photo) => ({
                id: photo.id,
                url: photo.url,
                title: photo.title,
                date: photo.date,
                location: photo.location,
                description: photo.description,
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
