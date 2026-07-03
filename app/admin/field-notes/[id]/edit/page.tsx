import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import FieldNoteForm, { type FieldNoteFormDefaults } from "../../FieldNoteForm";
import MediaManager from "../../MediaManager";
import { updateFieldNoteAction } from "../../actions";
import type { FieldNoteMediaRow } from "@/lib/field-notes/queries";

export default async function EditFieldNotePage({ params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) redirect("/admin/field-notes");

  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: note, error } = await supabase
    .from("field_notes")
    .select("id, title, slug, date, location, description, activity, layout_template, status, sort_order, cover_image_url")
    .eq("id", id)
    .single();

  if (error || !note) notFound();

  const { data: mediaRows } = await supabase
    .from("field_note_media")
    .select("id, type, url, title, caption, section_key, layout, aspect_ratio, sort_order")
    .eq("field_note_id", id)
    .order("sort_order", { ascending: true });

  const media = (mediaRows ?? []) as FieldNoteMediaRow[];
  const updateAction = updateFieldNoteAction.bind(null, id);

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/admin/field-notes" className="text-sm text-stone-500 hover:text-stone-800">&lt;- Back to List</Link>
        <h1 className="mt-4 font-serif text-3xl text-stone-900">Edit Field Note</h1>
        <FieldNoteForm action={updateAction} defaults={note as FieldNoteFormDefaults} submitLabel="Save Changes" />
        <MediaManager fieldNoteId={id} media={media} />
      </div>
    </div>
  );
}
