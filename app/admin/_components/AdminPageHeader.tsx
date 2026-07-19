import Link from "next/link";
import type { ReactNode } from "react";
import { signOutAction } from "@/app/admin/projects/actions";

export type AdminNavKey =
  | "site"
  | "notes"
  | "projects"
  | "photography"
  | "visual-works"
  | "field-notes"
  | "about";

const NAV_ITEMS: { key: AdminNavKey; label: string; href: string }[] = [
  { key: "site", label: "Site Settings", href: "/admin/site" },
  { key: "notes", label: "Notes", href: "/admin/notes" },
  { key: "projects", label: "Projects", href: "/admin/projects" },
  { key: "photography", label: "Photography", href: "/admin/photography" },
  { key: "visual-works", label: "Visual Works", href: "/admin/visual-works" },
  { key: "field-notes", label: "Field Notes", href: "/admin/field-notes" },
  { key: "about", label: "About", href: "/admin/about" },
];

function navLinkClass(isActive: boolean): string {
  return isActive
    ? "text-sm font-medium text-stone-900"
    : "text-sm text-stone-500 transition-colors hover:text-stone-800";
}

interface AdminPageHeaderProps {
  title: string;
  current: AdminNavKey;
  actions?: ReactNode;
}

export default function AdminPageHeader({
  title,
  current,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs tracking-[0.24em] text-stone-500 uppercase">Admin</p>
        <h1 className="mt-2 font-serif text-3xl text-stone-900">{title}</h1>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2">
        {NAV_ITEMS.map((item) => (
          <Link key={item.key} href={item.href} className={navLinkClass(item.key === current)}>
            {item.label}
          </Link>
        ))}

        {actions}

        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-md border border-stone-300 px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-100"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
