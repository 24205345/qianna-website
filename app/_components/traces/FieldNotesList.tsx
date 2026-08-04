import Link from "next/link";
import Image from "next/image";

export interface FieldNoteTripCard {
  href: string;
  title: string;
  location: string;
  date: string;
  description: string;
  coverImage: string;
}

interface FieldNotesListProps {
  trips: FieldNoteTripCard[];
}

export default function FieldNotesList({ trips }: FieldNotesListProps) {
  return (
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
              <h2 className="font-serif text-2xl text-stone-900 md:text-3xl">
                {trip.title}
              </h2>
              <p className="mt-2 text-xs text-stone-400">
                {trip.location} · {trip.date}
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-500">
                {trip.description}
              </p>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
