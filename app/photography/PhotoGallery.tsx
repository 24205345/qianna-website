"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

interface Photo {
  id: string;
  filename: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  basePath: string;
}

export default function PhotoGallery({ photos, basePath }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, goToPrevious, goToNext]);

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <article
            key={photo.id}
            className="group cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-100">
              <Image
                src={`${basePath}/${photo.filename}`}
                alt={photo.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="mt-3">
              <h3 className="font-serif text-lg text-stone-900">{photo.title}</h3>
              <p className="mt-1 text-xs text-stone-500">{photo.location}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            onClick={closeLightbox}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Previous button */}
          <button
            className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Next button */}
          <button
            className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Content container */}
          <div
            className="flex h-[92vh] w-[95vw] max-w-7xl flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
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

            {/* Caption - fixed height */}
            <div className="h-[70px] flex flex-col justify-center text-center">
              <h3 className="font-serif text-base text-white">
                {photos[selectedIndex].title}
              </h3>
              <p className="mt-0.5 text-xs text-white/70">
                {photos[selectedIndex].location} · {photos[selectedIndex].date}
              </p>
              <p className="mt-1 text-xs leading-5 text-white/80 line-clamp-2">
                {photos[selectedIndex].description}
              </p>
            </div>
          </div>

          {/* Photo counter */}
          <div className="absolute left-6 top-6 text-sm text-white/60">
            {selectedIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
