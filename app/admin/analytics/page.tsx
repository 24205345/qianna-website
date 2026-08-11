import { redirect } from "next/navigation";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import AnalyticsDashboard from "@/app/admin/analytics/_components/AnalyticsDashboard";
import AnalyticsRangeNav from "@/app/admin/analytics/_components/AnalyticsRangeNav";
import { parseAnalyticsRange } from "@/lib/analytics/ranges";
import { getAnalyticsDashboardData } from "@/lib/analytics/queries";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
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

  const { range: rangeParam } = await searchParams;
  const range = parseAnalyticsRange(rangeParam);
  const data = await getAnalyticsDashboardData(range);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <AdminPageHeader title="Analytics" current="analytics" />
        <div className="mt-8">
          <AnalyticsRangeNav current={range} />
        </div>
        <div className="mt-8">
          <AnalyticsDashboard {...data} />
        </div>
      </div>
    </div>
  );
}
