import Link from "next/link";
import Image from "next/image";
import type { FieldNoteFull } from "@/lib/field-notes/queries";
import type { FieldNoteNarrativeBlock } from "@/app/_data/field-note-details";

interface Props {
  note: FieldNoteFull;
}

function BackArrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M5 12l7 7M5 12l7-7" />
    </svg>
  );
}

function imageSrc(block: FieldNoteNarrativeBlock): string {
  return block.url ?? "";
}

function NarrativeSection({ block }: { block: FieldNoteNarrativeBlock }) {
  const aspectClass = block.aspectRatio === "4/3" ? "aspect-[4/3]" : "aspect-[16/9]";

  if (block.layout === "full_width") {
    return (
      <section className="border-t border-stone-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-18">
          <p className="text-[10px] tracking-[0.26em] text-stone-400 uppercase mb-8">{block.sectionTitle}</p>
          <div className="overflow-hidden rounded-2xl">
            <div className={`relative ${aspectClass}`}>
              <Image src={imageSrc(block)} alt={block.sectionTitle} fill className="object-cover" />
            </div>
          </div>
          {block.footerCaption ? (
            <p className="mt-6 max-w-2xl text-sm leading-7 text-stone-500 whitespace-nowrap">{block.footerCaption}</p>
          ) : null}
        </div>
      </section>
    );
  }

  const imageBlock = (
    <div className="overflow-hidden rounded-2xl">
      <div className={`relative ${aspectClass}`}>
        <Image src={imageSrc(block)} alt={block.sectionTitle} fill className="object-cover" />
      </div>
    </div>
  );

  const textBlock = (
    <div className="flex items-end">
      <div>
        <p className="text-[10px] tracking-[0.26em] text-stone-400 uppercase mb-4">{block.sectionTitle}</p>
        {block.caption ? <p className="text-sm leading-7 text-stone-600">{block.caption}</p> : null}
      </div>
    </div>
  );

  return (
    <section className="border-t border-stone-200">
      <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-18">
        <div className="grid gap-8 md:grid-cols-2">
          {block.layout === "text_right" ? (
            <>
              <div className="md:order-1 order-2">{imageBlock}</div>
              <div className="flex items-end md:order-2 order-1">{textBlock}</div>
            </>
          ) : (
            <>
              <div>{textBlock}</div>
              <div>{imageBlock}</div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function NarrativeFieldNoteView({ note }: Props) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <section className="relative h-screen w-full overflow-hidden">
        <Image src={note.cover_image_url} alt={note.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />
        <div className="absolute top-6 left-6 z-20 md:top-8 md:left-10">
          <Link href="/field-notes" className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white">
            <BackArrow />
            Field Notes
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-16 md:px-10 md:pb-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-[10px] tracking-[0.26em] text-white/60 uppercase">Field Notes</p>
            <h1 className="mt-4 font-serif text-5xl leading-tight text-white md:text-7xl md:leading-[1.08]">{note.title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">{note.description}</p>
          </div>
        </div>
        {note.showScrollHint ? (
          <div className="absolute bottom-6 right-6 z-20 flex flex-col items-center gap-2 text-white/50 md:bottom-8 md:right-10">
            <span className="text-[10px] tracking-[0.22em] uppercase">Scroll</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-bounce">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        ) : null}
      </section>

      <section className="border-t border-stone-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-12 md:px-10 md:py-14">
          {note.showTripDetailsHeading ? (
            <p className="text-[10px] tracking-[0.26em] text-stone-400 uppercase mb-8">Trip Details</p>
          ) : null}
          <dl className="grid gap-6 sm:grid-cols-3">
            {[
              { label: "Date", value: note.date },
              { label: "Location", value: note.location },
              { label: "Activity", value: note.activity },
            ].map((item) => (
              <div key={item.label}>
                <dt className={`text-[10px] tracking-[0.18em] text-stone-400 uppercase ${note.showTripDetailsHeading ? "mb-2" : ""}`}>
                  {item.label}
                </dt>
                <dd className={`text-sm text-stone-600 ${note.showTripDetailsHeading ? "leading-6" : "mt-2"}`}>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {note.narrativeBlocks.map((block) => (
        <NarrativeSection key={block.sectionKey} block={block} />
      ))}

      {note.videos.length > 0 ? (
        <section className="border-t border-stone-200">
          <div className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-18">
            <p className="text-[10px] tracking-[0.26em] text-stone-400 uppercase mb-8">
              {note.videosSectionTitle ?? "In Motion"}
            </p>
            <div className="space-y-10">
              {note.videos.map((video) => (
                <div key={video.url}>
                  <p className="mb-4 text-sm text-stone-500">{video.title}</p>
                  <div className="overflow-hidden rounded-2xl bg-stone-100">
                    <iframe src={video.url} allow="autoplay; encrypted-media" className="w-full" style={{ border: "none", aspectRatio: "16/9" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="border-t border-stone-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10">
          <Link href="/field-notes" className="inline-flex items-center gap-2 text-sm text-stone-500 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-900">
            <BackArrow />
            Back to Field Notes
          </Link>
        </div>
      </div>
    </div>
  );
}
