import PhotoGallery from "./PhotoGallery";
import { photographySections } from "@/app/_data/photography";
import { getPhotographyPageData } from "@/lib/photography/queries";
import {
  getSiteNavigationItem,
  getSiteNavigationItems,
} from "@/lib/site/queries";

export default async function PhotographyPage() {
  const [collections, navigationItems] = await Promise.all([
    getPhotographyPageData(photographySections),
    getSiteNavigationItems(),
  ]);
  const pageCopy = getSiteNavigationItem(navigationItems, "photography");

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <div className="mb-12">
          <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">{pageCopy.label}</p>
          <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">{pageCopy.title}</h1>
          <p className="mt-4 leading-7 text-stone-500">
            {pageCopy.description}
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

      </main>
    </div>
  );
}
