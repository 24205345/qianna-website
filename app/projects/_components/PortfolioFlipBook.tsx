"use client";

import HTMLFlipBook from "react-pageflip";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { GalleryImage } from "@/app/_data/project-galleries";
import type { PortfolioSection } from "@/app/_data/portfolio-sections";
import {
  PORTFOLIO_SINGLE_RATIO,
  PORTFOLIO_SPREAD_COUNT,
  buildPortfolioFlipLeaves,
  flipIndexToSpread,
  spreadToFlipIndex,
  type PortfolioFlipLeaf,
} from "@/lib/projects/portfolio-flip-pages";

interface PortfolioFlipBookProps {
  images: GalleryImage[];
  sections: PortfolioSection[];
  projectTitle: string;
  projectCategory: string | null;
}

type FlipBookHandle = {
  pageFlip: () => {
    flip: (page: number, corner?: "top" | "bottom") => void;
    flipNext: (corner?: "top" | "bottom") => void;
    flipPrev: (corner?: "top" | "bottom") => void;
  };
};

function useBookPageSize(containerRef: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ pageWidth: 640, pageHeight: 452 });

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      const availW = rect.width;
      const availH = rect.height;
      if (availW <= 0 || availH <= 0) return;

      let pageH = availH;
      let pageW = pageH * PORTFOLIO_SINGLE_RATIO;

      if (pageW * 2 > availW) {
        pageW = availW / 2;
        pageH = pageW / PORTFOLIO_SINGLE_RATIO;
      }

      setSize({
        pageWidth: Math.max(280, Math.floor(pageW)),
        pageHeight: Math.max(198, Math.floor(pageH)),
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);

  return size;
}

const FlipLeaf = forwardRef<HTMLDivElement, { leaf: PortfolioFlipLeaf }>(
  function FlipLeaf({ leaf }, ref) {
    if (leaf.kind === "single") {
      return (
        <div
          ref={ref}
          className="h-full w-full overflow-hidden bg-stone-100"
          data-density="hard"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={leaf.src}
            alt={leaf.alt}
            className="h-full w-full object-contain"
            draggable={false}
            loading="eager"
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="h-full w-full overflow-hidden bg-stone-100"
        data-density="soft"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={leaf.src}
          alt={leaf.alt}
          className="h-full max-w-none select-none"
          style={{
            width: "200%",
            objectFit: "cover",
            objectPosition: leaf.side === "left" ? "left center" : "right center",
            marginLeft: leaf.side === "right" ? "-100%" : undefined,
          }}
          draggable={false}
          loading={leaf.spread <= 3 ? "eager" : "lazy"}
        />
      </div>
    );
  }
);

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  );
}

export default function PortfolioFlipBook({
  images,
  sections,
  projectTitle,
  projectCategory,
}: PortfolioFlipBookProps) {
  const bookRef = useRef<FlipBookHandle>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [flipIndex, setFlipIndex] = useState(0);
  const { pageWidth, pageHeight } = useBookPageSize(stageRef);

  const leaves = useMemo(() => buildPortfolioFlipLeaves(images), [images]);
  const currentSpread = flipIndexToSpread(flipIndex);

  const flipPrev = useCallback(() => {
    bookRef.current?.pageFlip().flipPrev("bottom");
  }, []);

  const flipNext = useCallback(() => {
    bookRef.current?.pageFlip().flipNext("bottom");
  }, []);

  const jumpToSpread = useCallback((spread: number) => {
    bookRef.current?.pageFlip().flip(spreadToFlipIndex(spread), "bottom");
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") flipPrev();
      if (event.key === "ArrowRight") flipNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flipNext, flipPrev]);

  if (leaves.length === 0) return null;

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-stone-950 font-sans text-stone-100">
      <header className="z-10 shrink-0 border-b border-stone-800 bg-stone-950/95 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-5xl px-6 py-6 md:px-10 md:py-8">
          <p className="text-[10px] tracking-[0.26em] text-stone-500 uppercase">
            {projectCategory ?? "Architecture Project"}
          </p>
          <h1 className="mt-4 font-serif text-5xl text-stone-100 md:text-7xl">{projectTitle}</h1>

          <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {sections.map((section) => {
              const isActive =
                currentSpread >= section.startPage && currentSpread <= section.endPage;

              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => jumpToSpread(section.startPage)}
                  className={`text-sm transition-colors ${
                    isActive
                      ? "text-stone-200"
                      : "text-stone-500 hover:text-stone-300"
                  }`}
                >
                  {section.title}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="relative min-h-0 flex-1">
        <div
          ref={stageRef}
          className="absolute inset-0 flex items-center justify-center px-2 py-2 md:px-4"
        >
          <HTMLFlipBook
            ref={bookRef}
            className="portfolio-flip-book shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
            style={{}}
            width={pageWidth}
            height={pageHeight}
            size="fixed"
            minWidth={pageWidth}
            maxWidth={pageWidth}
            minHeight={pageHeight}
            maxHeight={pageHeight}
            drawShadow
            flippingTime={900}
            usePortrait={false}
            startZIndex={0}
            autoSize={false}
            maxShadowOpacity={0.55}
            showCover
            mobileScrollSupport={false}
            clickEventForward={false}
            useMouseEvents
            swipeDistance={30}
            showPageCorners
            disableFlipByClick={false}
            startPage={0}
            onFlip={(event: { data: number }) => setFlipIndex(event.data)}
          >
            {leaves.map((leaf) => (
              <FlipLeaf
                key={`${leaf.spread}-${leaf.kind === "spread-half" ? leaf.side : "single"}`}
                leaf={leaf}
              />
            ))}
          </HTMLFlipBook>
        </div>
      </main>

      <footer className="z-10 shrink-0 border-t border-stone-800 bg-stone-950/95 px-6 py-4 backdrop-blur-sm md:px-10">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-5">
          <button
            type="button"
            onClick={flipPrev}
            disabled={flipIndex <= 0}
            aria-label="Previous spread"
            className="rounded-full bg-stone-900/80 p-2.5 text-stone-400 transition-colors hover:bg-stone-800 hover:text-stone-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronIcon direction="left" />
          </button>
          <p className="min-w-[4.5rem] text-center text-sm text-stone-500">
            {String(currentSpread).padStart(2, "0")} / {String(PORTFOLIO_SPREAD_COUNT).padStart(2, "0")}
          </p>
          <button
            type="button"
            onClick={flipNext}
            disabled={flipIndex >= leaves.length - 1}
            aria-label="Next spread"
            className="rounded-full bg-stone-900/80 p-2.5 text-stone-400 transition-colors hover:bg-stone-800 hover:text-stone-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </footer>
    </div>
  );
}
