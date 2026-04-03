"use client";

import Image from "next/image";
import { useState } from "react";

const projectImages = [
  { filename: "01_site_analysis.jpg", title: "Site Analysis" },
  { filename: "02_current_situation_analysis.png", title: "Current Situation Analysis" },
  { filename: "03_landscape_rendering.jpg", title: "Landscape Rendering" },
  { filename: "04_planning_guidelines.jpg", title: "Planning Guidelines" },
  { filename: "05_important_node_updates.png", title: "Important Node Updates" },
  { filename: "07_courtyard_location_analysis.jpg", title: "Courtyard Location Analysis" },
  { filename: "08_current_situation.png", title: "Current Situation of Courtyard" },
  { filename: "09_morphological_evolution.png", title: "Morphological Evolution Process" },
  { filename: "10_analysis_chart.png", title: "Analysis Chart" },
  { filename: "11_profile_view.jpg", title: "Profile View" },
  { filename: "12_ground_floor_plan.jpg", title: "Ground Floor Plan" },
  { filename: "13_exploded_axonometric.jpg", title: "Exploded Axonometric" },
];

const basePath = "/projects/xicaoshi-red-temple/images";

export default function ProjectGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? projectImages.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === projectImages.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  return (
    <>
      <section className="border-t border-stone-800">
        <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-18">
          <p className="text-[10px] tracking-[0.26em] text-stone-500 uppercase mb-8">
            Project Gallery · {projectImages.length}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projectImages.map((img, index) => (
              <div
                key={img.filename}
                className="group cursor-pointer overflow-hidden rounded-xl bg-stone-900"
                onClick={() => openLightbox(index)}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={`${basePath}/${img.filename}`}
                    alt={img.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-[10px] text-white/70 opacity-0 transition-opacity group-hover:opacity-100">
                    {img.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
        >
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
          <div
            className="flex h-[90vh] w-[95vw] max-w-7xl flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex-1 w-full max-h-[80vh]">
              <Image
                src={`${basePath}/${projectImages[selectedIndex].filename}`}
                alt={projectImages[selectedIndex].title}
                fill
                className="object-contain"
                sizes="95vw"
                priority
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-white/80">{projectImages[selectedIndex].title}</p>
              <p className="mt-1 text-xs text-white/50">{selectedIndex + 1} / {projectImages.length}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
