import Link from "next/link";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import CollectionForm from "../CollectionForm";
import { createCollectionAction } from "../actions";

export default function NewPhotographyCollectionPage() {
  if (!isSupabaseConfigured()) redirect("/admin/photography");

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/admin/photography" className="text-sm text-stone-500 hover:text-stone-800">
          &lt;- Back to List
        </Link>
        <h1 className="mt-4 font-serif text-3xl text-stone-900">New Photography Collection</h1>
        <CollectionForm action={createCollectionAction} submitLabel="Create Collection" />
      </div>
    </div>
  );
}
