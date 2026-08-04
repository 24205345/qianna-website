import Link from "next/link";
import type { TracesTab } from "@/app/_data/site-navigation";
import type { SiteNavigationItem } from "@/app/_data/site-navigation";

interface TracesTabNavProps {
  tabs: SiteNavigationItem[];
  activeTab: TracesTab;
}

export default function TracesTabNav({ tabs, activeTab }: TracesTabNavProps) {
  return (
    <nav
      className="mt-8 flex flex-wrap gap-2 border-b border-stone-200/80 pb-4"
      aria-label="Traces categories"
    >
      {tabs.map((tab) => {
        const tabKey = tab.href.includes("tab=drawings")
          ? "drawings"
          : tab.href.includes("tab=field-notes")
            ? "field-notes"
            : "photography";
        const isActive = tabKey === activeTab;

        return (
          <Link
            key={tab.itemKey}
            href={tab.href}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              isActive
                ? "bg-stone-900 text-stone-50"
                : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
