import type { Metadata } from "next";
import AdminShell from "./_components/AdminShell";
import { SITE_NAME } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: {
    default: `Admin · ${SITE_NAME}`,
    template: `%s · Admin · ${SITE_NAME}`,
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
