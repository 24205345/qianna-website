import { notFound } from "next/navigation";
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

  return <NoteDetailView note={note} />;
}
