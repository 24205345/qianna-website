import Link from "next/link";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import FieldNoteForm from "../FieldNoteForm";
import { createFieldNoteAction } from "../actions";

export default function NewFieldNotePage() {
  if (!isSupabaseConfigured()) redirect("/admin/field-notes");
  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/admin/field-notes" className="text-sm text-stone-500 hover:text-stone-800">&lt;- Back to List</Link>
        <h1 className="mt-4 font-serif text-3xl text-stone-900">New Field Note</h1>
        <FieldNoteForm action={createFieldNoteAction} submitLabel="Create Field Note" />
      </div>
    </div>
  );
}
