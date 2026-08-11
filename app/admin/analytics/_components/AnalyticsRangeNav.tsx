import Link from "next/link";
import {
  ANALYTICS_RANGE_OPTIONS,
  type AnalyticsRange,
} from "@/lib/analytics/ranges";

interface AnalyticsRangeNavProps {
  current: AnalyticsRange;
}

function linkClass(isActive: boolean): string {
  return isActive
    ? "rounded-full bg-stone-900 px-3 py-1.5 text-sm text-white"
    : "rounded-full px-3 py-1.5 text-sm text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900";
}

export default function AnalyticsRangeNav({ current }: AnalyticsRangeNavProps) {
  return (
    <nav className="flex flex-wrap gap-2">
      {ANALYTICS_RANGE_OPTIONS.map((option) => (
        <Link
          key={option.value}
          href={`/admin/analytics?range=${option.value}`}
          className={linkClass(option.value === current)}
        >
          {option.label}
        </Link>
      ))}
    </nav>
  );
}
