import Image from "next/image";

interface AboutProfilePhotoProps {
  imageUrl: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function AboutProfilePhoto({
  imageUrl,
  alt,
  className = "",
  priority = false,
}: AboutProfilePhotoProps) {
  const frameClass = `aspect-video w-full overflow-hidden rounded-2xl ${className}`;

  if (!imageUrl) {
    return (
      <div
        className={`${frameClass} border border-dashed border-stone-300/80 bg-stone-100/60`}
        aria-label="Profile photo placeholder"
      >
        <div className="flex h-full items-center justify-center px-4 text-center">
          <span className="text-[10px] tracking-[0.28em] text-stone-400 uppercase">
            Photo
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${frameClass} relative border border-stone-200/80 bg-stone-100`}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 960px"
        className="object-cover"
      />
    </div>
  );
}
