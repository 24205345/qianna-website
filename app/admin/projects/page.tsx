import Link from "next/link";
import { redirect } from "next/navigation";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import ContentStatusBadge from "@/app/admin/_components/ContentStatusBadge";
import VisibilityToggleForm from "@/app/admin/_components/VisibilityToggleForm";
import {
  PROJECT_CATEGORIES,
  projectBelongsToCategory,
} from "@/lib/projects/categories";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { deleteProjectAction, toggleProjectStatusAction } from "./actions";

interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  year: string | null;
  status: string;
  sort_order: number;
}

function ProjectTable({ projects }: { projects: ProjectRow[] }) {
  if (projects.length === 0) {
    return (
      <p className="px-4 py-6 text-sm text-stone-400">No projects in this category.</p>
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
        <tr>
          <th className="px-4 py-3">Title</th>
          <th className="px-4 py-3">Slug</th>
          <th className="px-4 py-3">Year</th>
          <th className="px-4 py-3">Visibility</th>
          <th className="px-4 py-3">Sort</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((p) => (
          <tr key={p.id} className="border-b border-stone-100 last:border-0">
            <td className="px-4 py-3 text-stone-800">{p.title}</td>
            <td className="px-4 py-3 text-stone-500">{p.slug}</td>
            <td className="px-4 py-3 text-stone-500">{p.year}</td>
            <td className="px-4 py-3">
              <ContentStatusBadge status={p.status} />
            </td>
            <td className="px-4 py-3 text-stone-500">{p.sort_order}</td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-3">
                <VisibilityToggleForm
                  id={p.id}
                  status={p.status}
                  action={toggleProjectStatusAction}
                />
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
        ))}
      </tbody>
    </table>
  );
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

  const grouped = PROJECT_CATEGORIES.map((category) => ({
    category,
    projects: projects.filter(
      (project) =>
        project.category != null &&
        projectBelongsToCategory(project.category, category)
    ),
  }));

  const groupedIds = new Set(
    grouped.flatMap((group) => group.projects.map((project) => project.id))
  );
  const uncategorized = projects.filter((project) => !groupedIds.has(project.id));

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-5xl">
        <AdminPageHeader
          title="Projects"
          current="projects"
          actions={
            <Link
              href="/admin/projects/new"
              className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white transition-colors hover:bg-stone-700"
            >
              + New Project
            </Link>
          }
        />

        {error ? (
          <p className="mt-8 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
            Failed to load projects: {error.message}
          </p>
        ) : null}

        {projects.length === 0 ? (
          <div className="mt-8 overflow-hidden rounded-xl border border-stone-200 bg-white px-4 py-8 text-center text-stone-400">
            No projects yet. Click New Project in the top right.
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-8">
            {grouped.map(({ category, projects: categoryProjects }) => (
              <section
                key={category.slug}
                className="overflow-hidden rounded-xl border border-stone-200 bg-white"
              >
                <div className="border-b border-stone-200 bg-stone-50 px-4 py-3">
                  <h2 className="text-sm font-medium tracking-wide text-stone-800">
                    {category.title}
                  </h2>
                  <p className="mt-1 text-xs text-stone-500">
                    {categoryProjects.length} project
                    {categoryProjects.length === 1 ? "" : "s"}
                  </p>
                </div>
                <ProjectTable projects={categoryProjects} />
              </section>
            ))}

            {uncategorized.length > 0 ? (
              <section className="overflow-hidden rounded-xl border border-amber-200 bg-white">
                <div className="border-b border-amber-200 bg-amber-50 px-4 py-3">
                  <h2 className="text-sm font-medium tracking-wide text-amber-900">
                    Uncategorized
                  </h2>
                  <p className="mt-1 text-xs text-amber-700">
                    These projects do not match the three fixed categories.
                  </p>
                </div>
                <ProjectTable projects={uncategorized} />
              </section>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
