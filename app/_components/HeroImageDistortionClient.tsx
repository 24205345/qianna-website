"use client";

import dynamic from "next/dynamic";
import { HERO_DISTORTION_ENABLED } from "./hero-distortion-config";

const HeroImageDistortion = dynamic(() => import("./HeroImageDistortion"), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0 animate-pulse bg-stone-800/35"
      aria-hidden
    />
  ),
});

interface HeroImageDistortionClientProps {
  imageUrl: string;
  alt: string;
}

function HeroStaticImage({
  imageUrl,
  alt,
}: HeroImageDistortionClientProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Plain img keeps LCP simple while ripple is disabled. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={alt}
        className="hero-photo-enter absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
      />
    </div>
  );
}

export default function HeroImageDistortionClient({
  imageUrl,
  alt,
}: HeroImageDistortionClientProps) {
  if (!HERO_DISTORTION_ENABLED) {
    return <HeroStaticImage imageUrl={imageUrl} alt={alt} />;
  }

  return <HeroImageDistortion imageUrl={imageUrl} alt={alt} />;
}
