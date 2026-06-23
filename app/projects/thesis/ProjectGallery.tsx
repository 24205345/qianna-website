"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryImage } from "@/app/_data/project-galleries";

interface ProjectGalleryProps {
  images: GalleryImage[];
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
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

  const close = () => setLightboxIndex(null);

  if (images.length === 0) return null;

  return (
    <>
      <section className="border-t border-stone-800">
        <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-18">
          <p className="text-[10px] tracking-[0.26em] text-stone-500 uppercase mb-10">
            Project Gallery
          </p>
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
                  <div className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] text-white/70 opacity-0 backdrop-blur-sm transition-opacity group-hover/img:opacity-100">
                    Click to expand
                  </div>
                </button>
                <div className="flex flex-col justify-center md:pt-4">
                  <p className="text-[10px] tracking-[0.22em] text-stone-600 uppercase">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-serif text-xl text-stone-100 md:text-2xl">
                    {img.title}
                  </h3>
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
          onClick={close}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
          }}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-5 right-5 z-10 rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white md:left-8"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white md:right-8"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <div className="max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage.url}
              alt={activeImage.title}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <p className="text-xs text-white/50">
              {lightboxIndex !== null && (
                <>
                  {String(lightboxIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                </>
              )}
            </p>
            <p className="mt-1 text-sm text-white/80">{activeImage.title}</p>
          </div>
        </div>
      )}
    </>
  );
}
