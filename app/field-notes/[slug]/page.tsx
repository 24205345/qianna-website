import { notFound } from "next/navigation";
import { getFieldNoteDetailBySlug, fieldNoteDetails } from "@/app/_data/field-note-details";
import { getFieldNoteBySlug } from "@/lib/field-notes/queries";
import GalleryFieldNoteView from "../_components/GalleryFieldNoteView";
import NarrativeFieldNoteView from "../_components/NarrativeFieldNoteView";

export default async function FieldNoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fallback = getFieldNoteDetailBySlug(slug);

  if (!fallback) {
    notFound();
  }

  const note = await getFieldNoteBySlug(slug, fallback);

  if (note.layout_template === "narrative") {
    return <NarrativeFieldNoteView note={note} />;
  }

  return <GalleryFieldNoteView note={note} />;
}

export function generateStaticParams() {
  return fieldNoteDetails.map((note) => ({ slug: note.slug }));
}
