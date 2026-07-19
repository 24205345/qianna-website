import Link from "next/link";
import { redirect } from "next/navigation";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import ContentStatusBadge from "@/app/admin/_components/ContentStatusBadge";
import VisibilityToggleForm from "@/app/admin/_components/VisibilityToggleForm";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { deleteNoteAction, toggleNoteStatusAction } from "./actions";

interface NoteRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  sort_order: number;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminNotesPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-stone-50 px-6 py-16 text-stone-700">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-serif text-3xl text-stone-900">Notes</h1>
          <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Supabase environment variables are not configured.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("notes")
    .select("id, title, slug, status, published_at, sort_order")
    .order("published_at", { ascending: false, nullsFirst: false });

  const notes = (data ?? []) as NoteRow[];

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-5xl">
        <AdminPageHeader
          title="Notes"
          current="notes"
          actions={
            <Link
              href="/admin/notes/new"
              className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white transition-colors hover:bg-stone-700"
            >
              + New Note
            </Link>
          }
        />

        {error ? (
          <p className="mt-8 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
            Failed to load notes: {error.message}
          </p>
        ) : null}

        <div className="mt-8 overflow-hidden rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Visibility</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-stone-400"
                  >
                    No notes yet. Click New Note to write your first article.
                  </td>
                </tr>
              ) : (
                notes.map((note) => (
                  <tr
                    key={note.id}
                    className="border-b border-stone-100 last:border-0"
                  >
                    <td className="px-4 py-3 text-stone-800">{note.title}</td>
                    <td className="px-4 py-3 text-stone-500">{note.slug}</td>
                    <td className="px-4 py-3 text-stone-500">
                      {formatDate(note.published_at)}
                    </td>
                    <td className="px-4 py-3">
                      <ContentStatusBadge status={note.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <VisibilityToggleForm
                          id={note.id}
                          status={note.status}
                          action={toggleNoteStatusAction}
                        />
                        <Link
                          href={`/admin/notes/${note.id}/edit`}
                          className="text-stone-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <form action={deleteNoteAction.bind(null, note.id)}>
                          <button
                            type="submit"
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </form>
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
