import { redirect } from "next/navigation";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { createNoteAction } from "../actions";
import NoteForm from "../NoteForm";

export default async function AdminNewNotePage() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/notes");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader title="New Note" current="notes" />
        <NoteForm action={createNoteAction} submitLabel="Create Note" />
      </div>
    </div>
  );
}
