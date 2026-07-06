import Link from "next/link";
import { projects as staticProjects, type Project } from "@/app/_data/projects";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  filterProjectsByCategory,
  getCategoryBySlug,
} from "@/lib/projects/categories";
import {
  getSiteNavigationItem,
  getSiteNavigationItems,
} from "@/lib/site/queries";

async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return staticProjects;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("slug, category, title, description, tags, year")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) {
    return staticProjects;
  }

  return (data ?? []).map((row) => ({
    slug: row.slug,
    category: row.category ?? "",
    title: row.title,
    description: row.description ?? "",
    tags: row.tags ?? [],
    year: row.year ?? "",
  }));
}

function getProjectSortYear(project: Project): number {
  const years = project.year.match(/\d{4}/g);
  return years ? Math.max(...years.map(Number)) : 0;
}

function sortProjectsByYearDesc(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const yearDiff = getProjectSortYear(b) - getProjectSortYear(a);
    return yearDiff || a.title.localeCompare(b.title);
  });
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100/60 p-7 transition-colors hover:bg-stone-100 md:p-9"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-[10px] tracking-[0.22em] text-stone-500 uppercase">
          {project.category}
        </p>
        <p className="text-xs text-stone-400">{project.year}</p>
      </div>
      <h2 className="mt-4 font-serif text-3xl text-stone-900 transition-colors group-hover:text-stone-700 md:text-4xl">
        {project.title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-stone-500 line-clamp-2">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-stone-300/70 px-3 py-1 text-[11px] tracking-wide text-stone-500"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-1.5 text-sm text-stone-500 transition-colors group-hover:text-stone-800">
        <span>View project</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="translate-x-0 transition-transform group-hover:translate-x-1"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;
  const activeCategory = getCategoryBySlug(categorySlug);
  const [projects, navigationItems] = await Promise.all([
    getProjects(),
    getSiteNavigationItems(),
  ]);
  const sortedProjects = sortProjectsByYearDesc(projects);
  const activeCategoryCopy = activeCategory
    ? getSiteNavigationItem(navigationItems, activeCategory.slug)
    : null;

  const isFiltered = Boolean(activeCategory);
  const filteredProjects = activeCategory
    ? filterProjectsByCategory(sortedProjects, activeCategory)
    : sortedProjects;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 py-12 md:px-10 md:py-16">
        <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">Projects</p>

        {isFiltered && activeCategory ? (
          <>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-serif text-4xl text-stone-900 md:text-5xl">
                              {activeCategoryCopy?.title ?? activeCategory.title}
                </h1>
                <p className="mt-4 max-w-2xl leading-7 text-stone-500">
                              {activeCategoryCopy?.description ??
                                activeCategory.description}
                </p>
              </div>
              <Link
                href="/projects"
                className="text-sm text-stone-600 underline decoration-stone-300 underline-offset-4 hover:text-stone-900"
              >
                View all projects
              </Link>
            </div>

            <div className="mt-14 flex flex-col gap-6">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-100/50 px-6 py-10 text-center text-sm text-stone-500">
                  No projects in this category yet.
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-4 font-serif text-4xl text-stone-900 md:text-5xl">Projects</h1>
            <p className="mt-4 max-w-2xl leading-7 text-stone-500">
              Thesis and design research, architecture projects, and digital product work.
            </p>

            <div className="mt-14 flex flex-col gap-6">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-100/50 px-6 py-10 text-center text-sm text-stone-500">
                  No projects yet.
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
