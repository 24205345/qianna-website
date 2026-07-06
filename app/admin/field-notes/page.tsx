import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { deleteFieldNoteAction, toggleFieldNoteStatusAction } from "./actions";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import ContentStatusBadge from "@/app/admin/_components/ContentStatusBadge";
import VisibilityToggleForm from "@/app/admin/_components/VisibilityToggleForm";

interface FieldNoteRow {
  id: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  status: string;
  sort_order: number;
}

export default async function AdminFieldNotesPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-stone-50 px-6 py-16 text-stone-700">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-serif text-3xl text-stone-900">Field Notes</h1>
          <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-700">Supabase environment variables are not configured.</p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("field_notes")
    .select("id, title, slug, date, location, status, sort_order")
    .order("sort_order", { ascending: true });

  const notes = (data ?? []) as FieldNoteRow[];

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-5xl">
        <AdminPageHeader
          title="Field Notes"
          current="field-notes"
          actions={
            <Link
              href="/admin/field-notes/new"
              className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-700"
            >
              + New Field Note
            </Link>
          }
        />

        {error ? <p className="mt-8 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">Failed to load: {error.message}</p> : null}

        <div className="mt-8 overflow-hidden rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Visibility</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-stone-400">No field notes yet. Run migrate:field-notes or click New Field Note.</td></tr>
              ) : (
                notes.map((n) => (
                  <tr key={n.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-4 py-3 text-stone-800">{n.title}</td>
                    <td className="px-4 py-3 text-stone-500">{n.slug}</td>
                    <td className="px-4 py-3 text-stone-500">{n.date}</td>
                    <td className="px-4 py-3"><ContentStatusBadge status={n.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <VisibilityToggleForm
                          id={n.id}
                          status={n.status}
                          action={toggleFieldNoteStatusAction}
                        />
                        <Link href={`/admin/field-notes/${n.id}/edit`} className="text-stone-600 hover:underline">Edit</Link>
                        <form action={deleteFieldNoteAction.bind(null, n.id)}><button type="submit" className="text-red-500 hover:underline">Delete</button></form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
