"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { PROJECT_CATEGORIES } from "@/lib/projects/categories";
import { signOutAction } from "@/app/admin/projects/actions";
import { useAdminLayout } from "./AdminShell";

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

function primaryClass(isActive: boolean, collapsed: boolean): string {
  const base = collapsed
    ? "flex items-center justify-center rounded-md px-2 py-2.5 text-sm transition-colors"
    : "block rounded-md px-3 py-2 text-sm transition-colors";

  return isActive
    ? `${base} bg-stone-900 text-white`
    : `${base} text-stone-600 hover:bg-stone-100 hover:text-stone-900`;
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
  const { mobileOpen, setMobileOpen, collapsed, toggleCollapsed } =
    useAdminLayout();

  const widthClass = collapsed ? "w-16" : "w-56 md:w-60";
  const mobileTransformClass = mobileOpen
    ? "translate-x-0"
    : "-translate-x-full lg:translate-x-0";

  function handleNavClick() {
    setMobileOpen(false);
  }

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-stone-900/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        id="admin-sidebar"
        aria-label="Admin navigation"
        className={`fixed inset-y-0 left-0 z-50 flex ${widthClass} flex-col border-r border-stone-200/80 bg-white/95 backdrop-blur-sm transition-[transform,width] duration-200 ${mobileTransformClass}`}
      >
        <div
          className={
            collapsed
              ? "flex flex-col items-center gap-2 border-b border-stone-200 px-2 py-4"
              : "flex items-center justify-between gap-2 border-b border-stone-200 px-4 py-4"
          }
        >
          {!collapsed ? (
            <div>
              <p className="text-xs tracking-[0.24em] text-stone-400 uppercase">
                Admin
              </p>
              <p className="mt-1 font-serif text-lg text-stone-900">Qianna Site</p>
            </div>
          ) : (
            <p className="text-[10px] font-medium tracking-[0.18em] text-stone-500 uppercase">
              Q
            </p>
          )}

          <button
            type="button"
            onClick={toggleCollapsed}
            className="hidden rounded-md border border-stone-300 bg-white px-2 py-1 text-xs text-stone-600 transition-colors hover:bg-stone-100 lg:inline-flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? "»" : "«"}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-md border border-stone-300 bg-white px-2 py-1 text-xs text-stone-600 lg:hidden"
            aria-label="Close navigation"
          >
            Close
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
          <div className={collapsed ? "space-y-1" : "space-y-1"}>
            {TOP_LEVEL.map((item) => {
              const isActive = item.match(pathname);
              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className={primaryClass(isActive, collapsed)}
                    title={collapsed ? item.label : undefined}
                  >
                    {collapsed ? item.label.charAt(0) : item.label}
                  </Link>

                  {!collapsed && item.children === "projects" && isActive ? (
                    <div className="mt-1 ml-2 space-y-0.5 border-l border-stone-200 pl-2">
                      {PROJECT_CATEGORIES.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/admin/projects?category=${category.slug}`}
                          onClick={handleNavClick}
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

                  {!collapsed && item.children === "traces" && isActive ? (
                    <div className="mt-1 ml-2 space-y-0.5 border-l border-stone-200 pl-2">
                      {TRACES_ITEMS.map((trace) => (
                        <Link
                          key={trace.href}
                          href={trace.href}
                          onClick={handleNavClick}
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
          </div>
        </nav>

        <div className="border-t border-stone-200 p-2">
          <form action={signOutAction}>
            <button
              type="submit"
              className={
                collapsed
                  ? "flex w-full items-center justify-center rounded-md border border-stone-300 px-2 py-2 text-xs text-stone-600 transition-colors hover:bg-stone-50"
                  : "w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-50"
              }
              title={collapsed ? "Sign Out" : undefined}
            >
              {collapsed ? "Out" : "Sign Out"}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
