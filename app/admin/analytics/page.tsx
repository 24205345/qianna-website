import { redirect } from "next/navigation";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import AnalyticsDashboard from "@/app/admin/analytics/_components/AnalyticsDashboard";
import { getAnalyticsDashboardData } from "@/lib/analytics/queries";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function AdminAnalyticsPage() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const data = await getAnalyticsDashboardData(30);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <AdminPageHeader title="Analytics" current="analytics" />
        <p className="mt-4 max-w-3xl text-sm leading-6 text-stone-500">
          Page views and unique visitors from first-party analytics. Average duration
          appears once visitors leave a page or gallery section.
        </p>
        <div className="mt-10">
          <AnalyticsDashboard {...data} />
        </div>
      </div>
    </div>
  );
}
