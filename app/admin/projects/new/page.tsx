import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import ProjectForm from "../ProjectForm";
import { createProjectAction } from "../actions";

export default async function NewProjectPage() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/projects");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/admin/projects" className="text-sm text-stone-500 hover:text-stone-800">
          &lt;- Back to List
        </Link>
        <h1 className="mt-4 font-serif text-3xl text-stone-900">New Project</h1>
        <ProjectForm action={createProjectAction} submitLabel="Create Project" />
      </div>
    </div>
  );
}
