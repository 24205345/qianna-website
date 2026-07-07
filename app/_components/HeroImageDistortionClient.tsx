"use client";

import dynamic from "next/dynamic";

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

export default function HeroImageDistortionClient({
  imageUrl,
  alt,
}: HeroImageDistortionClientProps) {
  return <HeroImageDistortion imageUrl={imageUrl} alt={alt} />;
}
