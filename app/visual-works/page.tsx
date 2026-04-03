import Link from "next/link";
import PhotoGallery from "../photography/PhotoGallery";

const penDrawings = [
  { id: "01", filename: "pen_drawing_01.jpg", title: "Pen Drawing I", date: "2019.9.8", description: "Pen and ink drawing." },
  { id: "02", filename: "pen_drawing_02.jpg", title: "Pen Drawing II", date: "2019.9.9", description: "Pen and ink drawing." },
  { id: "03", filename: "pen_drawing_03.jpg", title: "Pen Drawing III", date: "2019.9.15", description: "Pen and ink drawing." },
  { id: "04", filename: "pen_drawing_04.jpg", title: "Pen Drawing IV", date: "2019.9.22", description: "Pen and ink drawing." },
  { id: "05", filename: "pen_drawing_05.jpg", title: "Pen Drawing V", date: "2019.9.25", description: "Pen and ink drawing." },
  { id: "06", filename: "pen_drawing_06.jpg", title: "Pen Drawing VI", date: "2019.9.30", description: "Pen and ink drawing." },
];

const penAndWashDrawings = [
  { id: "01", filename: "pen_and_wash_01.jpg", title: "Pen & Wash I", date: "2019.9.28", description: "Pen drawing with watercolor wash." },
  { id: "02", filename: "pen_and_wash_02.jpg", title: "Pen & Wash II", date: "2019.10.8", description: "Pen drawing with watercolor wash." },
  { id: "03", filename: "pen_and_wash_03.jpg", title: "Pen & Wash III", date: "2019.10.9", description: "Pen drawing with watercolor wash." },
  { id: "04", filename: "pen_and_wash_04.jpg", title: "Pen & Wash IV", date: "2019.10.10", description: "Pen drawing with watercolor wash." },
  { id: "05", filename: "pen_and_wash_05.jpg", title: "Pen & Wash V", date: "2019.11.9", description: "Pen drawing with watercolor wash." },
  { id: "06", filename: "pen_and_wash_06.jpg", title: "Pen & Wash VI", date: "2019.11.11", description: "Pen drawing with watercolor wash." },
  { id: "07", filename: "pen_and_wash_07.jpg", title: "Pen & Wash VII", date: "2020.8.8", description: "Pen drawing with watercolor wash." },
  { id: "08", filename: "pen_and_wash_08.jpg", title: "Pen & Wash VIII", date: "2020.8.11", description: "Pen drawing with watercolor wash." },
  { id: "09", filename: "pen_and_wash_09.jpg", title: "Pen & Wash IX", date: "2020.8.15", description: "Pen drawing with watercolor wash." },
  { id: "10", filename: "pen_and_wash_10.jpg", title: "Pen & Wash X", date: "2020.8.17", description: "Pen drawing with watercolor wash." },
];

const watercolorPaintings = [
  { id: "01", filename: "watercolor_01.jpg", title: "Watercolor I", date: "2019.9.23", description: "Watercolor painting." },
  { id: "02", filename: "watercolor_02.jpg", title: "Watercolor II", date: "2019.9.26", description: "Watercolor painting." },
  { id: "03", filename: "watercolor_03.jpg", title: "Watercolor III", date: "2019.10.18", description: "Watercolor painting." },
  { id: "04", filename: "watercolor_04.jpg", title: "Watercolor IV", date: "2019.10.19", description: "Watercolor painting." },
  { id: "05", filename: "watercolor_05.jpg", title: "Watercolor V", date: "2019.10.20", description: "Watercolor painting." },
  { id: "06", filename: "watercolor_06.jpg", title: "Watercolor VI", date: "2019.11.10", description: "Watercolor painting." },
];

export default function VisualWorksPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">
            Visual Works
          </p>
          <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">
            Visual Works
          </h1>
          <p className="mt-4 leading-7 text-stone-500">
            Drawings, sketches, and paintings — explorations in line, wash, and color.
          </p>
        </div>

        {/* Pen Drawings Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-stone-900 md:text-3xl">
                Pen Drawings
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                6 works · 2019
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Pure line work — the precision of ink capturing form and texture.
              </p>
            </div>
          </div>

          <PhotoGallery photos={penDrawings} basePath="/drawings/pen-drawing" />
        </section>

        {/* Pen & Wash Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-stone-900 md:text-3xl">
                Pen & Wash
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                10 works · 2019-2020
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                The marriage of ink and watercolor — structured lines softened by translucent washes.
              </p>
            </div>
          </div>

          <PhotoGallery photos={penAndWashDrawings} basePath="/drawings/pen-and-wash" />
        </section>

        {/* Watercolor Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-stone-900 md:text-3xl">
                Watercolors
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                6 works · 2019
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Fluid pigments dancing on paper — light, transparency, and atmosphere.
              </p>
            </div>
          </div>

          <PhotoGallery photos={watercolorPaintings} basePath="/drawings/watercolor" />
        </section>

        {/* Navigation */}
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
