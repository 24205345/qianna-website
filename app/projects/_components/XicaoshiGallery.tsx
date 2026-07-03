"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryImage } from "@/app/_data/project-galleries";

interface XicaoshiGalleryProps {
  images: GalleryImage[];
}

export default function XicaoshiGallery({ images }: XicaoshiGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <section className="border-t border-stone-800">
        <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-18">
          <p className="text-[10px] tracking-[0.26em] text-stone-500 uppercase mb-8">
            Project Gallery · {images.length}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, index) => (
              <div
                key={`${img.url}-${index}`}
                className="group cursor-pointer overflow-hidden rounded-xl bg-stone-900"
                onClick={() => setSelectedIndex(index)}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={img.url}
                    alt={img.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={() => setSelectedIndex(null)}>
          <div className="relative h-[80vh] w-[95vw] max-w-7xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[selectedIndex].url}
              alt={images[selectedIndex].title}
              fill
              className="object-contain"
              sizes="95vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
