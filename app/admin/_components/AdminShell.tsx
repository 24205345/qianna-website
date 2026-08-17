"use client";

import { Suspense, createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

const STORAGE_KEY = "admin-sidebar-collapsed";
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/reset-password"];

interface AdminLayoutContextValue {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextValue | null>(null);

export function useAdminLayout() {
  const value = useContext(AdminLayoutContext);
  if (!value) {
    throw new Error("useAdminLayout must be used within AdminShell");
  }
  return value;
}

interface AdminShellProps {
  children: ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileState, setMobileState] = useState({ path: pathname, open: false });
  const mobileOpen =
    mobileState.path === pathname ? mobileState.open : false;
  const setMobileOpen = useCallback((open: boolean) => {
    setMobileState({ path: pathname, open });
  }, [pathname]);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  const contextValue = useMemo<AdminLayoutContextValue>(
    () => ({
      mobileOpen,
      setMobileOpen,
      collapsed,
      toggleCollapsed: () => {
        setCollapsed((prev) => {
          const next = !prev;
          try {
            window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
          } catch {
            // ignore
          }
          return next;
        });
      },
    }),
    [mobileOpen, collapsed, setMobileOpen]
  );

  const isPublicPage = PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path));
  if (isPublicPage) {
    return <>{children}</>;
  }

  const mainOffsetClass = collapsed ? "lg:pl-16" : "lg:pl-56 xl:pl-60";

  return (
    <AdminLayoutContext.Provider value={contextValue}>
      <div className="min-h-screen bg-stone-50 text-stone-700">
        <Suspense
          fallback={
            <aside className="fixed inset-y-0 left-0 z-50 w-56 border-r border-stone-200/80 bg-white/90 md:w-60" />
          }
        >
          <AdminSidebar />
        </Suspense>

        <div
          className={`flex min-h-screen flex-col transition-[padding] duration-200 ${mainOffsetClass}`}
        >
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-stone-200 bg-stone-50/95 px-4 py-3 backdrop-blur-sm lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 transition-colors hover:bg-stone-100"
              aria-expanded={mobileOpen}
            >
              Menu
            </button>
            <p className="text-xs tracking-[0.2em] text-stone-500 uppercase">
              Admin
            </p>
          </header>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
}
