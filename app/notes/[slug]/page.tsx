import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageViewTracker from "@/app/_components/analytics/PageViewTracker";
import { getNoteBySlug } from "@/lib/notes/queries";
import { buildPageMetadata } from "@/lib/seo/metadata";
import NoteDetailView from "../_components/NoteDetailView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);
  if (!note) {
    return buildPageMetadata({
      title: "Note",
      description: "Note on Qianna Wang's portfolio.",
      path: `/notes/${slug}`,
    });
  }

  return buildPageMetadata({
    title: note.title,
    description: note.excerpt ?? note.title,
    path: `/notes/${slug}`,
    image: note.coverImageUrl,
    type: "article",
  });
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);
  if (!note) notFound();

  return (
    <>
      <PageViewTracker contentType="note" contentSlug={slug} />
      <NoteDetailView note={note} />
    </>
  );
}
