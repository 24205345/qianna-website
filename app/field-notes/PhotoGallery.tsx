"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

interface Photo {
  filename: string;
  title: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  basePath: string;
}

export default function PhotoGallery({ photos, basePath }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goToPrevious = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1);
    }
  }, [selectedIndex, photos.length]);

  const goToNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1);
    }
  }, [selectedIndex, photos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, goToPrevious, goToNext]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <div
            key={photo.filename}
            className="group cursor-pointer overflow-hidden rounded-xl"
            onClick={() => openLightbox(index)}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={`${basePath}/${photo.filename}`}
                alt={photo.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={closeLightbox}>
          <button
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20"
            onClick={closeLightbox}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white/80 hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white/80 hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="flex h-[90vh] w-[95vw] max-w-7xl flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <div className="relative flex-1 w-full max-h-[80vh]">
              <Image
                src={`${basePath}/${photos[selectedIndex].filename}`}
                alt={photos[selectedIndex].title}
                fill
                className="object-contain"
                sizes="95vw"
                priority
              />
            </div>
            <p className="mt-4 text-sm text-white/70">{selectedIndex + 1} / {photos.length}</p>
          </div>
        </div>
      )}
    </>
  );
}
