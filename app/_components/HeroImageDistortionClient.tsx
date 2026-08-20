"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
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
      <Image
        src={imageUrl}
        alt={alt}
        fill
        priority
        sizes="100vw"
        quality={75}
        className="hero-photo-enter object-cover object-center"
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
