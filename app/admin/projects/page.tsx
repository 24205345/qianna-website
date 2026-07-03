import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { deleteProjectAction, signOutAction } from "./actions";

interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  year: string | null;
  status: string;
  sort_order: number;
}

export default async function AdminProjectsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-stone-50 px-6 py-16 text-stone-700">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-serif text-3xl text-stone-900">Admin</h1>
          <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Supabase environment variables are not configured. Add
            NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to{" "}
            <code>.env.local</code>, then restart.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }

  const { data, error } = await supabase
    .from("projects")
    .select("id, title, slug, category, year, status, sort_order")
    .order("sort_order", { ascending: true });

  const projects = (data ?? []) as ProjectRow[];

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">Admin</p>
            <h1 className="mt-2 font-serif text-3xl text-stone-900">Projects</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/site"
              className="text-sm text-stone-500 hover:text-stone-800"
            >
              Site Settings
            </Link>
            <Link
              href="/admin/photography"
              className="text-sm text-stone-500 hover:text-stone-800"
            >
              Photography
            </Link>
            <Link
              href="/admin/visual-works"
              className="text-sm text-stone-500 hover:text-stone-800"
            >
              Visual Works
            </Link>
            <Link
              href="/admin/field-notes"
              className="text-sm text-stone-500 hover:text-stone-800"
            >
              Field Notes
            </Link>
            <Link
              href="/about"
              className="text-sm text-stone-500 hover:text-stone-800"
            >
              About
            </Link>
            <Link
              href="/admin/projects/new"
              className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white transition-colors hover:bg-stone-700"
            >
              + New Project
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-md border border-stone-300 px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-100"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {error ? (
          <p className="mt-8 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
            Failed to load projects: {error.message}
          </p>
        ) : null}

        <div className="mt-8 overflow-hidden rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Sort order</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-stone-400">
                    No projects yet. Click New Project in the top right.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-4 py-3 text-stone-800">{p.title}</td>
                    <td className="px-4 py-3 text-stone-500">{p.slug}</td>
                    <td className="px-4 py-3 text-stone-500">{p.category}</td>
                    <td className="px-4 py-3 text-stone-500">{p.year}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          p.status === "published"
                            ? "rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700"
                            : "rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500"
                        }
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500">{p.sort_order}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/projects/${p.id}/edit`}
                          className="text-stone-600 underline-offset-2 hover:underline"
                        >
                          Edit
                        </Link>
                        <form action={deleteProjectAction.bind(null, p.id)}>
                          <button
                            type="submit"
                            className="text-red-500 underline-offset-2 hover:underline"
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
