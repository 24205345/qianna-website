import { notFound, redirect } from "next/navigation";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import { getWorkbenchPipelineById } from "@/lib/workbench/queries";
import {
  getAdminAuthSession,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import PipelineForm from "./PipelineForm";

interface AdminPipelineEditPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

export default async function AdminPipelineEditPage({
  params,
  searchParams,
}: AdminPipelineEditPageProps) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-stone-50 px-6 py-16 text-stone-700">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-serif text-3xl text-stone-900">Workbench</h1>
          <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Supabase environment variables are not configured. Add them to{" "}
            <code>.env.local</code> and restart.
          </p>
        </div>
      </div>
    );
  }

  const user = await getAdminAuthSession();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const { saved } = await searchParams;

  const pipeline = await getWorkbenchPipelineById(id);
  if (!pipeline) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-5xl">
        <AdminPageHeader title={`Edit: ${pipeline.title}`} />

        <PipelineForm pipeline={pipeline} saved={saved === "true"} />
      </div>
    </div>
  );
}
