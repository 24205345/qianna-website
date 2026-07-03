import Link from "next/link";
import Image from "next/image";
import { getFieldNotesTripsFallback } from "@/app/_data/field-note-details";
import { getFieldNotesList } from "@/lib/field-notes/queries";
import {
  getSiteNavigationItem,
  getSiteNavigationItems,
} from "@/lib/site/queries";

export default async function FieldNotesPage() {
  const [fieldTrips, navigationItems] = await Promise.all([
    getFieldNotesList(getFieldNotesTripsFallback()),
    getSiteNavigationItems(),
  ]);
  const pageCopy = getSiteNavigationItem(navigationItems, "field-notes");

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <div className="mb-12">
          <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">{pageCopy.label}</p>
          <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">{pageCopy.title}</h1>
          <p className="mt-6 max-w-3xl leading-8 text-stone-500">{pageCopy.description}</p>
        </div>

        <div className="space-y-10">
          {fieldTrips.map((trip) => (
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
