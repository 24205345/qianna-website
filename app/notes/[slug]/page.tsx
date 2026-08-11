import { notFound } from "next/navigation";
import PageViewTracker from "@/app/_components/analytics/PageViewTracker";
import { getNoteBySlug } from "@/lib/notes/queries";
import NoteDetailView from "../_components/NoteDetailView";

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
