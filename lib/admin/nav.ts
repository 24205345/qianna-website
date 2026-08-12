export type AdminNavKey =
  | "site"
  | "notes"
  | "projects"
  | "photography"
  | "visual-works"
  | "field-notes"
  | "about"
  | "guestbook";

export interface AdminNavItem {
  key: AdminNavKey;
  label: string;
  href: string;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { key: "site", label: "Site Settings", href: "/admin/site" },
  { key: "notes", label: "Notes", href: "/admin/notes" },
  { key: "projects", label: "Projects", href: "/admin/projects" },
  { key: "photography", label: "Photography", href: "/admin/photography" },
  { key: "visual-works", label: "Visual Works", href: "/admin/visual-works" },
  { key: "field-notes", label: "Field Notes", href: "/admin/field-notes" },
  { key: "about", label: "About", href: "/admin/about" },
  { key: "guestbook", label: "Guestbook", href: "/admin/guestbook" },
];

export function resolveAdminNavKey(pathname: string): AdminNavKey | null {
  if (pathname.startsWith("/admin/site")) return "site";
  if (pathname.startsWith("/admin/notes")) return "notes";
  if (pathname.startsWith("/admin/projects")) return "projects";
  if (pathname.startsWith("/admin/photography")) return "photography";
  if (pathname.startsWith("/admin/visual-works")) return "visual-works";
  if (pathname.startsWith("/admin/field-notes")) return "field-notes";
  if (pathname.startsWith("/admin/about")) return "about";
  if (pathname.startsWith("/admin/guestbook")) return "guestbook";
  return null;
}

export function isPublicAdminPath(pathname: string): boolean {
  return (
    pathname === "/admin/login" || pathname === "/admin/reset-password"
  );
}
