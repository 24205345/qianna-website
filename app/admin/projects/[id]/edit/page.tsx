import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import ProjectForm, { type ProjectFormDefaults } from "../../ProjectForm";
import MediaManager from "../../MediaManager";
import { updateProjectAction } from "../../actions";
import type { ProjectMediaRow } from "@/lib/projects/queries";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/projects");
  }

  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }

  const { data: project, error } = await supabase
    .from("projects")
    .select(
      "id, title, slug, subtitle, description, content, category, tags, year, status, sort_order, cover_image_url, hero_video_url, intro_video_url, layout_template, overview_paragraphs, project_details"
    )
    .eq("id", id)
    .single();

  if (error || !project) {
    notFound();
  }

  const defaults = project as ProjectFormDefaults;
  const updateAction = updateProjectAction.bind(null, id);

  const { data: mediaRows } = await supabase
    .from("project_media")
    .select("id, type, url, title, caption, sort_order")
    .eq("project_id", id)
    .eq("type", "image")
    .order("sort_order", { ascending: true });

  const media = (mediaRows ?? []) as ProjectMediaRow[];

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/admin/projects" className="text-sm text-stone-500 hover:text-stone-800">
          &lt;- Back to List
        </Link>
        <h1 className="mt-4 font-serif text-3xl text-stone-900">Edit Project</h1>
        <ProjectForm action={updateAction} defaults={defaults} submitLabel="Save Changes" />
        <MediaManager projectId={id} media={media} />
      </div>
    </div>
  );
}
