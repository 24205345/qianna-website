"use client";

import { getImageProps } from "next/image";
import { useState } from "react";
import { isOptimizableImageSource, type PublicImagePattern } from "@/lib/media/image-config";
import { NOTE_IMAGE_SIZES } from "@/lib/media/image-sizes";
import localImageMetadata from "@/lib/notes/local-image-metadata.json";

interface NoteImageProps {
  src?: string;
  alt: string;
  imagePatterns: PublicImagePattern[];
}

const dimensions = localImageMetadata as Record<string, { width: number; height: number }>;

export default function NoteImage({ src, alt, imagePatterns }: NoteImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src) return null;
  const metadata = dimensions[src];
  const optimize = src !== failedSrc && isOptimizableImageSource(src, imagePatterns);
  // Unknown remote aspect ratios must not acquire an invented width/height ratio.
  // getImageProps supplies the responsive URLs; only measured dimensions reach img.
  const optimized = optimize ? getImageProps({
    src, alt, width: metadata?.width ?? 1600, height: metadata?.height ?? 1600,
    sizes: NOTE_IMAGE_SIZES,
  }).props : undefined;

  return (
    // Native img keeps Markdown images with unknown dimensions/external hosts compatible.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={optimized?.src ?? src}
      srcSet={optimized?.srcSet}
      sizes={optimized?.sizes}
      width={metadata?.width}
      height={metadata?.height}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="my-4 h-auto w-full rounded-xl border border-stone-200"
      onError={optimize ? () => setFailedSrc(src) : undefined}
    />
  );
}
