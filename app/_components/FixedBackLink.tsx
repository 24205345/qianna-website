"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTION_LABELS: Record<string, string> = {
  projects: "Projects",
  "field-notes": "Field Notes",
};

function getBackLink(pathname: string): { href: string; label: string } | null {
  if (
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth")
  ) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length >= 2) {
    const section = segments[0];
    const sectionLabel = SECTION_LABELS[section];

    if (sectionLabel) {
      return {
        href: `/${section}`,
        label: `← Back to ${sectionLabel}`,
      };
    }
  }

  return { href: "/", label: "← Back to Home" };
}

export default function FixedBackLink() {
  const pathname = usePathname();
  const backLink = getBackLink(pathname);

  if (!backLink) {
    return null;
  }

  return (
    <Link
      href={backLink.href}
      className="fixed bottom-6 left-6 z-40 text-sm text-stone-600 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-900"
      aria-label={backLink.label}
    >
      {backLink.label}
    </Link>
  );
}
