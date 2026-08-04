import PhotoGallery from "@/app/photography/PhotoGallery";
import type { PhotographyCollection } from "@/lib/photography/queries";

interface PhotographySectionsProps {
  collections: PhotographyCollection[];
}

export default function PhotographySections({
  collections,
}: PhotographySectionsProps) {
  return (
    <>
      {collections.map((collection) => (
        <section key={collection.slug} className="mb-16 last:mb-0">
          <div className="mb-8">
            <h2 className="font-serif text-2xl text-stone-900 md:text-3xl">
              {collection.title}
            </h2>
            {collection.subtitle ? (
              <p className="mt-2 text-sm text-stone-500">{collection.subtitle}</p>
            ) : null}
            {collection.description ? (
              <p className="mt-3 text-sm leading-6 text-stone-600">
                {collection.description}
              </p>
            ) : null}
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
    </>
  );
}
