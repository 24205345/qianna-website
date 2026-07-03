"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryImage } from "@/app/_data/project-galleries";

interface ThesisGalleryProps {
  images: GalleryImage[];
}

export default function ThesisGallery({ images }: ThesisGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const activeImage = lightboxIndex !== null ? images[lightboxIndex] : null;

  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1);
    }
  };

  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === images.length - 1 ? 0 : lightboxIndex + 1);
    }
  };

  if (images.length === 0) return null;

  return (
    <>
      <section className="border-t border-stone-800">
        <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-18">
          <p className="text-[10px] tracking-[0.26em] text-stone-500 uppercase mb-10">Project Gallery</p>
          <div className="flex flex-col gap-16">
            {images.map((img, i) => (
              <article
                key={`${img.url}-${i}`}
                className="grid gap-5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start"
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="group/img relative cursor-zoom-in overflow-hidden rounded-xl bg-stone-900 text-left"
                >
                  <Image
                    src={img.url}
                    alt={img.title}
                    width={1200}
                    height={0}
                    sizes="(max-width: 768px) 100vw, 832px"
                    className="h-auto w-full object-contain transition-transform duration-500 group-hover/img:scale-[1.02]"
                  />
                </button>
                <div className="flex flex-col justify-center md:pt-4">
                  <p className="text-[10px] tracking-[0.22em] text-stone-600 uppercase">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-serif text-xl text-stone-100 md:text-2xl">{img.title}</h3>
                  {img.caption ? (
                    <p className="mt-3 text-sm leading-7 text-stone-400">{img.caption}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-stone-200 hover:bg-black/70"
            aria-label="Previous image"
          >
            ‹
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={activeImage.url} alt={activeImage.title} className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-stone-200 hover:bg-black/70"
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
