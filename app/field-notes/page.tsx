import Link from "next/link";
import Image from "next/image";

const trips = [
  {
    href: "/field-notes/nanjiluo",
    coverImage: "/field-notes/nanjiluo/images/00_nanjiluo_cover.jpg",
    title: "Hiking in Nanjiluo",
    date: "2024.9.3",
    location: "Nanjiluo, Yunnan, China",
    description: "Alpine lakes and pristine wilderness in one of Yunnan's most remote mountain areas.",
  },
  {
    href: "/field-notes/yubeng",
    coverImage: "/field-notes/yubeng/images/00_yubeng_cover.jpg",
    title: "Hiking in Yubeng Village",
    date: "2024.9.4 – 2024.9.6",
    location: "Yubeng Village, Yunnan, China",
    description: "A sacred village beneath Kawagebo Peak — pilgrimage trails through ancient forests and snow-capped vistas.",
  },
  {
    href: "/field-notes/whitecliffs",
    coverImage: "/field-notes/whitecliffs/images/00_whitecliffs_cover.jpg",
    title: "Seven Sisters White Cliffs",
    date: "2024.10.13",
    location: "Seven Sisters, East Sussex, UK",
    description: "Chalk cliffs rising from the English Channel — rolling downland meets the sea along the South Downs Way.",
  },
  {
    href: "/field-notes/gliding",
    coverImage: "/field-notes/gliding/images/00_gliding_cover.jpg",
    title: "First Gliding Experience",
    date: "2024.10.26 – 2024.10.27",
    location: "The Long Mynd, Church Stretton, UK",
    description: "Soaring over the Shropshire Hills — silent flight above rolling moorland and ancient valleys.",
  },
  {
    href: "/field-notes/snowboard",
    coverImage: "/field-notes/snowboard/images/00_superdevoluy_cover_map.jpg",
    title: "Snowboard Days in Superdévoluy",
    date: "2025.3.31 – 2025.4.8",
    location: "Superdévoluy, France",
    description: "Late-season snow, broad ridgelines, carved spring tracks, and a fog-softened return to base.",
  },
];

export default function FieldNotesPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <div className="mb-12">
          <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">Field Notes</p>
          <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">Field Notes</h1>
          <p className="mt-6 max-w-3xl leading-8 text-stone-500">Hiking journeys, outdoor paths, and movement-based observation.</p>
        </div>

        <div className="space-y-10">
          {trips.map((trip) => (
            <Link key={trip.href} href={trip.href} className="group block">
              <article className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={trip.coverImage}
                    alt={trip.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                  />
                </div>
                <div className="px-6 py-6 md:px-8 md:py-7">
                  <h2 className="font-serif text-2xl text-stone-900 md:text-3xl">{trip.title}</h2>
                  <p className="mt-2 text-xs text-stone-400">{trip.location} · {trip.date}</p>
                  <p className="mt-3 text-sm leading-7 text-stone-500">{trip.description}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-16 border-t border-stone-200 pt-8">
          <Link href="/" className="text-sm text-stone-600 underline decoration-stone-300 underline-offset-4 hover:text-stone-900">← Back to Home</Link>
        </div>
      </main>
    </div>
  );
}
