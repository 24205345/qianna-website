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
      className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-b border-stone-200/80"
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
            className={`pb-3 text-sm transition-colors ${
              isActive
                ? "-mb-px border-b-2 border-stone-900 font-medium text-stone-900"
                : "text-stone-500 hover:text-stone-800"
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
