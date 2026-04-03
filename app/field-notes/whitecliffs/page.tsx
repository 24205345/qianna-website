import Link from "next/link";
import Image from "next/image";
import PhotoGallery from "../PhotoGallery";

const tripDetails = [
  { label: "Date", value: "2024.10.13" },
  { label: "Location", value: "Seven Sisters, East Sussex, UK" },
  { label: "Activity", value: "Hiking" },
];

const photos = [
  { filename: "00_whitecliffs_cover.jpg", title: "Cover" },
  ...Array.from({ length: 10 }, (_, i) => ({ filename: `${(i + 1).toString().padStart(2, '0')}_whitecliffs_hike_${i + 1}.jpg`, title: `Hike ${i + 1}` })),
];

export default function WhitecliffsPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <section className="relative h-screen w-full overflow-hidden">
        <Image src="/field-notes/whitecliffs/images/00_whitecliffs_cover.jpg" alt="White Cliffs cover" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />
        <div className="absolute top-6 left-6 z-20 md:top-8 md:left-10">
          <Link href="/field-notes" className="flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M5 12l7 7M5 12l7-7" /></svg>
            Field Notes
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-16 md:px-10 md:pb-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-[10px] tracking-[0.26em] text-white/60 uppercase">Field Notes</p>
            <h1 className="mt-4 font-serif text-5xl text-white md:text-7xl">Seven Sisters White Cliffs</h1>
            <p className="mt-4 max-w-2xl text-sm text-white/70 whitespace-nowrap">Chalk cliffs rising from the English Channel — rolling downland meets the sea along the South Downs Way.</p>
          </div>
        </div>
      </section>
      <section className="border-t border-stone-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-12 md:px-10">
          <dl className="grid gap-6 sm:grid-cols-3">
            {tripDetails.map((item) => (
              <div key={item.label}>
                <dt className="text-[10px] tracking-[0.18em] text-stone-400 uppercase">{item.label}</dt>
                <dd className="mt-2 text-sm text-stone-600">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="border-t border-stone-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10">
          <p className="text-[10px] tracking-[0.26em] text-stone-400 uppercase mb-8">Photos · 11</p>
          <PhotoGallery photos={photos} basePath="/field-notes/whitecliffs/images" />
        </div>
      </section>
      <div className="border-t border-stone-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10">
          <Link href="/field-notes" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M5 12l7 7M5 12l7-7" /></svg>
            Back to Field Notes
          </Link>
        </div>
      </div>
    </div>
  );
}
