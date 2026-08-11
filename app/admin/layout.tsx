import AdminDashboardLayout from "@/app/admin/_components/AdminDashboardLayout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
