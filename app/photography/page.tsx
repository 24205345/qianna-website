import Image from "next/image";
import Link from "next/link";
import PhotoGallery from "./PhotoGallery";
import {
  gettyCenterPhotos,
  veniceBiennalePhotos,
  portraitsPhotos,
} from "@/app/_data/photography";

export default function PhotographyPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">
            Photography
          </p>
          <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">
            Photography
          </h1>
          <p className="mt-4 leading-7 text-stone-500">
            Quiet urban frames — a collection of observations in light, movement, and place.
          </p>
        </div>

        {/* Portraits & Human Scale Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-stone-900 md:text-3xl">
                Portraits & Human Scale
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                10 photos · 2025
              </p>
            </div>
          </div>

          <PhotoGallery photos={portraitsPhotos} basePath="/photography/portraits-human-scale" />
        </section>

        {/* Architecture Tectonics Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-stone-900 md:text-3xl">
                Architecture Tectonics
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                18 photos · 2025
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Richard Meier's modernist masterpiece — a symphony of travertine, light, and geometric precision perched above Los Angeles.
              </p>
            </div>
          </div>

          <PhotoGallery photos={gettyCenterPhotos} basePath="/photography/architecture-tectonics" />
        </section>

        {/* Venice Architecture Biennale Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-stone-900 md:text-3xl">
                Venice Architecture Biennale 2025
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                18 photos · June 2025
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                The world's most influential architectural exhibition — pavilions, installations, and spatial experiments across Giardini and Arsenale.
              </p>
            </div>
          </div>

          <PhotoGallery photos={veniceBiennalePhotos} basePath="/photography/venice-biennale" />
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
