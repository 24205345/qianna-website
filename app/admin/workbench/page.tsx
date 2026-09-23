import Link from "next/link";
import { redirect } from "next/navigation";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import { getWorkbenchPipelines } from "@/lib/workbench/queries";
import {
  getAdminAuthSession,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

interface AdminWorkbenchPageProps {
  searchParams: Promise<{ synced?: string }>;
}

export default async function AdminWorkbenchPage({
  searchParams,
}: AdminWorkbenchPageProps) {
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

  const params = await searchParams;
  const isSynced = params?.synced === "true";

  const pipelines = await getWorkbenchPipelines();

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-5xl">
        <AdminPageHeader title="Workbench" />

        {isSynced ? (
          <div className="mt-4 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Default workbench pipelines and curated digital vault resources have been successfully synced.
          </div>
        ) : null}

        <div className="mt-8 overflow-hidden rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Pipeline</th>
                <th className="px-4 py-3">Core Stack</th>
                <th className="px-4 py-3">Steps</th>
                <th className="px-4 py-3">Vault Items</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pipelines.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-stone-400">
                    No workbench pipelines found.
                  </td>
                </tr>
              ) : (
                pipelines.map((pipeline) => {
                  const totalResources = pipeline.steps.reduce(
                    (acc, step) => acc + (step.resources?.length || 0),
                    0
                  );

                  return (
                    <tr
                      key={pipeline.id}
                      className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50"
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-stone-900">
                          {pipeline.title}
                        </div>
                        {pipeline.englishTitle ? (
                          <div className="text-xs text-stone-500">
                            {pipeline.englishTitle}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex max-w-xs flex-wrap gap-1">
                          {pipeline.coreStack.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="rounded bg-stone-100 px-1.5 py-0.5 text-[11px] text-stone-600"
                            >
                              {tech}
                            </span>
                          ))}
                          {pipeline.coreStack.length > 4 ? (
                            <span className="text-[11px] text-stone-400">
                              +{pipeline.coreStack.length - 4}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-stone-600">
                        {pipeline.steps.length} Steps
                      </td>
                      <td className="px-4 py-3.5 text-stone-600">
                        {totalResources} Items
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          href={`/admin/workbench/${pipeline.id}`}
                          className="text-stone-600 underline-offset-2 hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-stone-400">
          Manage creative pipelines, sequential engineering steps, and attached digital vault resources.
        </p>
      </div>
    </div>
  );
}
