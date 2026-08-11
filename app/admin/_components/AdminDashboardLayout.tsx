"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/app/admin/_components/AdminSidebar";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/reset-password"];

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardLayout({
  children,
}: AdminDashboardLayoutProps) {
  const pathname = usePathname();
  const isPublicPage = PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path));

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-stone-50 text-stone-700">
      <Suspense
        fallback={
          <aside className="w-56 shrink-0 border-r border-stone-200/80 bg-white/90 md:w-60" />
        }
      >
        <AdminSidebar />
      </Suspense>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
