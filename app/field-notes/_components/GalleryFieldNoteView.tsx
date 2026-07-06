import Image from "next/image";
import type { FieldNoteFull } from "@/lib/field-notes/queries";
import FieldNotePhotoGallery from "../PhotoGallery";

interface Props {
  note: FieldNoteFull;
}

export default function GalleryFieldNoteView({ note }: Props) {
  const galleryPhotos = note.galleryPhotos.map((p, i) => ({
    filename: p.filename,
    title: p.title,
    url: p.url,
    id: String(i),
  }));

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <section className="relative h-screen w-full overflow-hidden">
        <Image src={note.cover_image_url} alt={note.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-16 md:px-10 md:pb-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-[10px] tracking-[0.26em] text-white/60 uppercase">Field Notes</p>
            <h1 className="mt-4 font-serif text-5xl text-white md:text-7xl">{note.title}</h1>
            <p className="mt-4 max-w-2xl text-sm text-white/70">{note.description}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-12 md:px-10">
          <dl className="grid gap-6 sm:grid-cols-3">
            <div>
              <dt className="text-[10px] tracking-[0.18em] text-stone-400 uppercase">Date</dt>
              <dd className="mt-2 text-sm text-stone-600">{note.date}</dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-[0.18em] text-stone-400 uppercase">Location</dt>
              <dd className="mt-2 text-sm text-stone-600">{note.location}</dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-[0.18em] text-stone-400 uppercase">Activity</dt>
              <dd className="mt-2 text-sm text-stone-600">{note.activity}</dd>
            </div>
          </dl>
        </div>
      </section>

      {galleryPhotos.length > 0 ? (
        <section className="border-t border-stone-200">
          <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10">
            <p className="text-[10px] tracking-[0.26em] text-stone-400 uppercase mb-8">
              Photos · {galleryPhotos.length}
            </p>
            <FieldNotePhotoGallery photos={galleryPhotos} />
          </div>
        </section>
      ) : null}

      {note.videos.length > 0 ? (
        <section className="border-t border-stone-200">
          <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10">
            <p className="text-[10px] tracking-[0.26em] text-stone-400 uppercase mb-8">
              {note.videosSectionTitle ?? `Videos · ${note.videos.length}`}
            </p>
            <div className="space-y-10">
              {note.videos.map((video) => (
                <div key={video.url}>
                  <p className="mb-4 text-sm text-stone-500">{video.title}</p>
                  <div className="overflow-hidden rounded-2xl bg-stone-100">
                    <iframe
                      src={video.url}
                      allow="autoplay; encrypted-media"
                      className="w-full"
                      style={{ border: "none", aspectRatio: "16/9" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
