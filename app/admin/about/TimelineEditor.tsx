"use client";

import { useState } from "react";
import type { AboutTimelineItem } from "@/app/_data/about-page";

interface TimelineRow {
  period: string;
  title: string;
  description: string;
}

interface TimelineEditorProps {
  initialItems: AboutTimelineItem[];
}

const inputClass =
  "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-stone-500";
const labelClass = "block text-sm font-medium text-stone-700";

function toRows(items: AboutTimelineItem[]): TimelineRow[] {
  if (items.length === 0) {
    return [{ period: "", title: "", description: "" }];
  }

  return items
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({
      period: item.period,
      title: item.title,
      description: item.description,
    }));
}

export default function TimelineEditor({ initialItems }: TimelineEditorProps) {
  const [items, setItems] = useState<TimelineRow[]>(() => toRows(initialItems));

  function addItem() {
    setItems((current) => [...current, { period: "", title: "", description: "" }]);
  }

  function removeItem(index: number) {
    setItems((current) => {
      const next = current.filter((_, itemIndex) => itemIndex !== index);
      return next.length > 0 ? next : [{ period: "", title: "", description: "" }];
    });
  }

  function updateItem(index: number, field: keyof TimelineRow, value: string) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <input type="hidden" name="timeline_count" value={items.length} />

      {items.map((item, index) => (
        <div
          key={`timeline-entry-${index}`}
          className="rounded-xl border border-stone-200 bg-stone-50/60 p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs tracking-[0.18em] text-stone-500 uppercase">
              Entry {index + 1}
            </p>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-sm text-red-500 underline-offset-2 hover:underline"
            >
              Remove
            </button>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor={`timeline_${index}_period`}>
                  Period *
                </label>
                <input
                  id={`timeline_${index}_period`}
                  name={`timeline_${index}_period`}
                  required
                  value={item.period}
                  onChange={(event) => updateItem(index, "period", event.target.value)}
                  className={inputClass}
                  placeholder="2025-Now"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor={`timeline_${index}_title`}>
                  Title *
                </label>
                <input
                  id={`timeline_${index}_title`}
                  name={`timeline_${index}_title`}
                  required
                  value={item.title}
                  onChange={(event) => updateItem(index, "title", event.target.value)}
                  className={inputClass}
                  placeholder="AI Product Manager"
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor={`timeline_${index}_description`}>
                Description
              </label>
              <textarea
                id={`timeline_${index}_description`}
                name={`timeline_${index}_description`}
                rows={3}
                value={item.description}
                onChange={(event) => updateItem(index, "description", event.target.value)}
                className={inputClass}
                placeholder="What you did during this period..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="self-start rounded-md border border-stone-300 px-4 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-100"
      >
        + Add timeline entry
      </button>
    </div>
  );
}
