import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import CategoryForm, { type CategoryFormDefaults } from "../../CategoryForm";
import WorkManager from "../../WorkManager";
import { updateCategoryAction } from "../../actions";
import type { VisualWorkRow } from "@/lib/visual-works/queries";

export default async function EditVisualWorkCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isSupabaseConfigured()) redirect("/admin/visual-works");

  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: category, error } = await supabase
    .from("visual_work_categories")
    .select("id, title, slug, subtitle, description, status, sort_order")
    .eq("id", id)
    .single();

  if (error || !category) notFound();

  const { data: workRows } = await supabase
    .from("visual_works")
    .select("id, url, title, date, description, sort_order")
    .eq("category_id", id)
    .order("sort_order", { ascending: true });

  const works = (workRows ?? []) as VisualWorkRow[];
  const defaults = category as CategoryFormDefaults;
  const updateAction = updateCategoryAction.bind(null, id);

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/admin/visual-works" className="text-sm text-stone-500 hover:text-stone-800">&lt;- Back to List</Link>
        <h1 className="mt-4 font-serif text-3xl text-stone-900">EditVisual WorksCategory</h1>
        <CategoryForm action={updateAction} defaults={defaults} submitLabel="Save Changes" />
        <WorkManager categoryId={id} works={works} />
      </div>
    </div>
  );
}
