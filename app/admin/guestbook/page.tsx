import { redirect } from "next/navigation";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  approveGuestbookMessageAction,
  deleteGuestbookMessageAction,
  rejectGuestbookMessageAction,
} from "./actions";

interface GuestbookAdminRow {
  id: string;
  author_name: string;
  author_email: string | null;
  message: string;
  status: string;
  created_at: string;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusClass(status: string): string {
  if (status === "approved") return "bg-emerald-50 text-emerald-700";
  if (status === "rejected") return "bg-stone-100 text-stone-500";
  return "bg-amber-50 text-amber-700";
}

export default async function AdminGuestbookPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-stone-50 px-6 py-16 text-stone-700">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-serif text-3xl text-stone-900">Guestbook</h1>
          <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Supabase environment variables are not configured.
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

  const { data, error } = await supabase
    .from("guestbook_messages")
    .select("id, author_name, author_email, message, status, created_at")
    .order("created_at", { ascending: false });

  const messages = (data ?? []) as GuestbookAdminRow[];

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-5xl">
        <AdminPageHeader title="Guestbook" current="guestbook" />

        <p className="mt-6 max-w-3xl text-sm leading-6 text-stone-500">
          Review public notes left on the homepage About section. Only approved
          messages are visible to visitors.
        </p>

        {error ? (
          <p className="mt-8 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
            Failed to load guestbook: {error.message}
          </p>
        ) : null}

        <div className="mt-8 space-y-4">
          {messages.length === 0 ? (
            <p className="rounded-xl border border-stone-200 bg-white px-4 py-6 text-sm text-stone-500">
              No guestbook messages yet.
            </p>
          ) : (
            messages.map((entry) => (
              <article
                key={entry.id}
                className="rounded-xl border border-stone-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-stone-900">
                      {entry.author_name}
                    </p>
                    {entry.author_email ? (
                      <a
                        href={`mailto:${entry.author_email}`}
                        className="mt-1 block text-xs text-stone-500 underline decoration-stone-300 underline-offset-2 transition-colors hover:text-stone-700"
                      >
                        {entry.author_email}
                      </a>
                    ) : null}
                    <p className="mt-1 text-xs text-stone-400">
                      {formatDate(entry.created_at)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusClass(entry.status)}`}
                  >
                    {entry.status}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-stone-700">
                  {entry.message}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.status !== "approved" ? (
                    <form action={approveGuestbookMessageAction}>
                      <input type="hidden" name="id" value={entry.id} />
                      <button
                        type="submit"
                        className="rounded-md bg-stone-900 px-3 py-1.5 text-xs text-white transition-colors hover:bg-stone-700"
                      >
                        Approve
                      </button>
                    </form>
                  ) : null}
                  {entry.status !== "rejected" ? (
                    <form action={rejectGuestbookMessageAction}>
                      <input type="hidden" name="id" value={entry.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-stone-300 px-3 py-1.5 text-xs text-stone-600 transition-colors hover:bg-stone-50"
                      >
                        Reject
                      </button>
                    </form>
                  ) : null}
                  <form action={deleteGuestbookMessageAction}>
                    <input type="hidden" name="id" value={entry.id} />
                    <button
                      type="submit"
                      className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600 transition-colors hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
