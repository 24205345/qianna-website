import PhotoGallery from "@/app/photography/PhotoGallery";
import type { VisualWorkCategory } from "@/lib/visual-works/queries";

interface DrawingsSectionsProps {
  categories: VisualWorkCategory[];
}

export default function DrawingsSections({ categories }: DrawingsSectionsProps) {
  return (
    <>
      {categories.map((category) => (
        <section key={category.slug} className="mb-16 last:mb-0">
          <div className="mb-8">
            <h2 className="font-serif text-2xl text-stone-900 md:text-3xl">
              {category.title}
            </h2>
            {category.subtitle ? (
              <p className="mt-2 text-sm text-stone-500">{category.subtitle}</p>
            ) : null}
            {category.description ? (
              <p className="mt-3 text-sm leading-6 text-stone-600">
                {category.description}
              </p>
            ) : null}
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
    </>
  );
}
