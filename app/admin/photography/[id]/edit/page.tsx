import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import CollectionForm, { type CollectionFormDefaults } from "../../CollectionForm";
import PhotoManager from "../../PhotoManager";
import { updateCollectionAction } from "../../actions";
import type { PhotographyPhotoRow } from "@/lib/photography/queries";

export default async function EditPhotographyCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isSupabaseConfigured()) redirect("/admin/photography");

  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: collection, error } = await supabase
    .from("photography_collections")
    .select("id, title, slug, subtitle, description, status, sort_order")
    .eq("id", id)
    .single();

  if (error || !collection) notFound();

  const { data: photoRows } = await supabase
    .from("photography_photos")
    .select("id, url, title, date, location, description, sort_order")
    .eq("collection_id", id)
    .order("sort_order", { ascending: true });

  const photos = (photoRows ?? []) as PhotographyPhotoRow[];
  const defaults = collection as CollectionFormDefaults;
  const updateAction = updateCollectionAction.bind(null, id);

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/admin/photography" className="text-sm text-stone-500 hover:text-stone-800">
          &lt;- Back to List
        </Link>
        <h1 className="mt-4 font-serif text-3xl text-stone-900">Edit Photography Collection</h1>
        <CollectionForm action={updateAction} defaults={defaults} submitLabel="Save Changes" />
        <PhotoManager collectionId={id} photos={photos} />
      </div>
    </div>
  );
}
