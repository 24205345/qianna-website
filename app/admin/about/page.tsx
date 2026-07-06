import Link from "next/link";
import { redirect } from "next/navigation";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import { getAboutPageContent } from "@/lib/about/queries";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import AboutPageForm from "./AboutPageForm";
import { updateAboutPageAction } from "./actions";

export default async function AdminAboutPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-stone-50 px-6 py-16 text-stone-700">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-serif text-3xl text-stone-900">About Page</h1>
          <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Supabase environment variables are not configured. Add them to <code>.env.local</code> and restart.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const defaults = await getAboutPageContent();

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-5xl">
        <AdminPageHeader
          title="About"
          current="about"
          actions={
            <Link
              href="/about"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-stone-300 px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-100"
            >
              Preview
            </Link>
          }
        />

        <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6">
          <AboutPageForm action={updateAboutPageAction} defaults={defaults} />
        </div>
      </div>
    </div>
  );
}
