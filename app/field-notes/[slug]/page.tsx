import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getFieldNoteDetailBySlug, fieldNoteDetails } from "@/app/_data/field-note-details";
import { getFieldNoteBySlug } from "@/lib/field-notes/queries";
import { buildPageMetadata } from "@/lib/seo/metadata";
import GalleryFieldNoteView from "../_components/GalleryFieldNoteView";
import NarrativeFieldNoteView from "../_components/NarrativeFieldNoteView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fallback = getFieldNoteDetailBySlug(slug);
  if (!fallback) {
    return buildPageMetadata({
      title: "Field Note",
      description: "Field note on Qianna Wang's portfolio.",
      path: `/field-notes/${slug}`,
    });
  }

  const note = await getFieldNoteBySlug(slug, fallback);
  return buildPageMetadata({
    title: note.title,
    description: note.description ?? note.title,
    path: `/field-notes/${slug}`,
    image: note.cover_image_url,
  });
}

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
