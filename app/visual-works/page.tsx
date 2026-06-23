import Link from "next/link";
import PhotoGallery from "../photography/PhotoGallery";
import {
  penDrawings,
  penAndWashDrawings,
  watercolorPaintings,
} from "@/app/_data/visual-works";

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
