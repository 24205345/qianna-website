import { notFound, redirect } from "next/navigation";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { updateNoteAction } from "../../actions";
import NoteForm from "../../NoteForm";

interface NoteRow {
  id: string;
  title: string;
  title_en: string | null;
  slug: string;
  excerpt: string;
  excerpt_en: string | null;
  body_markdown: string;
  body_markdown_en: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  status: string;
  sort_order: number;
}

export default async function AdminEditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/notes");
  }

  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("notes")
    .select(
      "id, title, title_en, slug, excerpt, excerpt_en, body_markdown, body_markdown_en, cover_image_url, tags, status, sort_order"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const note = data as NoteRow;

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader title="Edit Note" current="notes" />
        <NoteForm
          action={updateNoteAction.bind(null, note.id)}
          submitLabel="Save Note"
          defaults={{
            title: note.title,
            title_en: note.title_en,
            slug: note.slug,
            excerpt: note.excerpt,
            excerpt_en: note.excerpt_en,
            body_markdown: note.body_markdown,
            body_markdown_en: note.body_markdown_en,
            cover_image_url: note.cover_image_url,
            tags: note.tags,
            status: note.status,
            sort_order: note.sort_order,
          }}
        />
      </div>
    </div>
  );
}
