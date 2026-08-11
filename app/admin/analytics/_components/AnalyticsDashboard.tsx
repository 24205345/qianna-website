"use client";

import type { AnalyticsRange } from "@/lib/analytics/ranges";
import { getAnalyticsRangeLabel } from "@/lib/analytics/ranges";
import type {
  AnalyticsSummary,
  AnalyticsTopItem,
  AnalyticsTrendPoint,
} from "@/lib/analytics/types";
import { formatDuration } from "@/lib/analytics/visitor";

interface AnalyticsDashboardProps {
  range: AnalyticsRange;
  summary: AnalyticsSummary;
  trend: AnalyticsTrendPoint[];
  topNotes: AnalyticsTopItem[];
  topProjects: AnalyticsTopItem[];
  topPhotography: AnalyticsTopItem[];
  topPages: AnalyticsTopItem[];
}

function SummaryCard({ label, pv, uv }: { label: string; pv: number; uv: number }) {
  return (
    <article className="rounded-2xl border border-stone-200/80 bg-white/80 p-5">
      <p className="text-xs tracking-[0.18em] text-stone-500 uppercase">{label}</p>
      <p className="mt-3 font-serif text-3xl text-stone-900">{pv.toLocaleString()}</p>
      <p className="mt-1 text-sm text-stone-500">{uv.toLocaleString()} unique visitors</p>
    </article>
  );
}

function TrendChart({ trend }: { trend: AnalyticsTrendPoint[] }) {
  const width = 720;
  const height = 220;
  const padding = { top: 16, right: 16, bottom: 28, left: 36 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const maxPv = Math.max(1, ...trend.map((point) => point.pv));

  const points = trend.map((point, index) => {
    const x =
      padding.left +
      (trend.length <= 1 ? innerWidth / 2 : (index / (trend.length - 1)) * innerWidth);
    const y = padding.top + innerHeight - (point.pv / maxPv) * innerHeight;
    return { ...point, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const tickIndexes =
    trend.length <= 6
      ? trend.map((_, index) => index)
      : [0, Math.floor(trend.length / 2), trend.length - 1];

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[720px] w-full">
        {[0, 0.5, 1].map((ratio) => {
          const y = padding.top + innerHeight * (1 - ratio);
          return (
            <g key={ratio}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="#e7e5e4"
                strokeWidth="1"
              />
              <text x="4" y={y + 4} fill="#a8a29e" fontSize="11">
                {Math.round(maxPv * ratio)}
              </text>
            </g>
          );
        })}

        <path d={linePath} fill="none" stroke="#44403c" strokeWidth="2.5" />

        {points.map((point) => (
          <circle key={point.label} cx={point.x} cy={point.y} r="3.5" fill="#44403c" />
        ))}

        {tickIndexes.map((index) => {
          const point = points[index];
          if (!point) return null;
          return (
            <text
              key={point.label}
              x={point.x}
              y={height - 6}
              textAnchor="middle"
              fill="#78716c"
              fontSize="11"
            >
              {point.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function TopList({ title, items }: { title: string; items: AnalyticsTopItem[] }) {
  const maxViews = Math.max(1, ...items.map((item) => item.views));

  return (
    <section className="rounded-2xl border border-stone-200/80 bg-white/80 p-5">
      <h2 className="font-serif text-xl text-stone-900">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-stone-400">No data yet.</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {items.map((item, index) => (
            <li key={`${item.contentType}-${item.contentSlug}`}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="min-w-0 truncate text-sm text-stone-800">
                  {index + 1}. {item.title}
                </p>
                <p className="shrink-0 text-xs text-stone-400">
                  {item.views} views · {formatDuration(item.avgDurationSeconds)}
                </p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-stone-700"
                  style={{ width: `${(item.views / maxViews) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function AnalyticsDashboard({
  range,
  summary,
  trend,
  topNotes,
  topProjects,
  topPhotography,
  topPages,
}: AnalyticsDashboardProps) {
  const rangeLabel = getAnalyticsRangeLabel(range);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <SummaryCard
          label={`${rangeLabel} · page views`}
          pv={summary.pv}
          uv={summary.uv}
        />
        <article className="rounded-2xl border border-stone-200/80 bg-white/80 p-5">
          <p className="text-xs tracking-[0.18em] text-stone-500 uppercase">
            {rangeLabel} · unique visitors
          </p>
          <p className="mt-3 font-serif text-3xl text-stone-900">
            {summary.uv.toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-stone-500">Distinct visitors in range</p>
        </article>
      </div>

      <section className="rounded-2xl border border-stone-200/80 bg-white/80 p-5">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-serif text-xl text-stone-900">Traffic trend</h2>
          <p className="text-xs text-stone-400">PV</p>
        </div>
        {trend.length === 0 ? (
          <p className="text-sm text-stone-400">No traffic recorded yet.</p>
        ) : (
          <TrendChart trend={trend} />
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <TopList title="Top Notes" items={topNotes} />
        <TopList title="Top Projects" items={topProjects} />
        <TopList title="Top Photography galleries" items={topPhotography} />
        <TopList title="Top pages" items={topPages} />
      </div>
    </div>
  );
}
