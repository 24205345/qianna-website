"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { PROJECT_CATEGORIES } from "@/lib/projects/categories";
import { signOutAction } from "@/app/admin/projects/actions";

const TRACES_ITEMS = [
  { label: "Photography", href: "/admin/photography", prefix: "/admin/photography" },
  { label: "Drawings", href: "/admin/visual-works", prefix: "/admin/visual-works" },
  { label: "Field Notes", href: "/admin/field-notes", prefix: "/admin/field-notes" },
] as const;

const TOP_LEVEL = [
  { label: "Site Settings", href: "/admin/site", match: (path: string) => path === "/admin/site" },
  { label: "Notes", href: "/admin/notes", match: (path: string) => path.startsWith("/admin/notes") },
  {
    label: "Projects",
    href: "/admin/projects",
    match: (path: string) => path.startsWith("/admin/projects"),
    children: "projects" as const,
  },
  {
    label: "Traces",
    href: "/admin/photography",
    match: (path: string) =>
      path.startsWith("/admin/photography") ||
      path.startsWith("/admin/visual-works") ||
      path.startsWith("/admin/field-notes"),
    children: "traces" as const,
  },
  { label: "About", href: "/admin/about", match: (path: string) => path === "/admin/about" },
  {
    label: "Guestbook",
    href: "/admin/guestbook",
    match: (path: string) => path === "/admin/guestbook",
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    match: (path: string) => path.startsWith("/admin/analytics"),
  },
];

function primaryClass(isActive: boolean): string {
  return isActive
    ? "block rounded-md bg-stone-900 px-3 py-2 text-sm text-white"
    : "block rounded-md px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900";
}

function subClass(isActive: boolean): string {
  return isActive
    ? "block rounded-md bg-stone-200/80 px-3 py-1.5 text-sm text-stone-900"
    : "block rounded-md px-3 py-1.5 text-sm text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800";
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const projectCategory = searchParams.get("category");

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-stone-200/80 bg-white/90 px-3 py-6 md:w-60">
      <div className="px-3">
        <p className="text-xs tracking-[0.24em] text-stone-400 uppercase">Admin</p>
        <p className="mt-1 font-serif text-lg text-stone-900">Qianna Site</p>
      </div>

      <nav aria-label="Admin navigation" className="mt-8 flex-1 space-y-1">
        {TOP_LEVEL.map((item) => {
          const isActive = item.match(pathname);
          return (
            <div key={item.href}>
              <Link href={item.href} className={primaryClass(isActive)}>
                {item.label}
              </Link>

              {item.children === "projects" && isActive ? (
                <div className="mt-1 ml-2 space-y-0.5 border-l border-stone-200 pl-2">
                  {PROJECT_CATEGORIES.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/admin/projects?category=${category.slug}`}
                      className={subClass(projectCategory === category.slug)}
                      aria-current={
                        projectCategory === category.slug ? "page" : undefined
                      }
                    >
                      {category.title}
                    </Link>
                  ))}
                </div>
              ) : null}

              {item.children === "traces" && isActive ? (
                <div className="mt-1 ml-2 space-y-0.5 border-l border-stone-200 pl-2">
                  {TRACES_ITEMS.map((trace) => (
                    <Link
                      key={trace.href}
                      href={trace.href}
                      className={subClass(pathname.startsWith(trace.prefix))}
                      aria-current={
                        pathname.startsWith(trace.prefix) ? "page" : undefined
                      }
                    >
                      {trace.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <form action={signOutAction} className="mt-6 px-3">
        <button
          type="submit"
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-50"
        >
          Sign Out
        </button>
      </form>
    </aside>
  );
}
