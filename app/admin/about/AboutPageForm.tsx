import type { AboutPageContent } from "@/app/_data/about-page";
import { serializeTagLines } from "@/lib/about/parse-form";
import TimelineEditor from "./TimelineEditor";

interface AboutPageFormProps {
  action: (formData: FormData) => Promise<void>;
  defaults: AboutPageContent;
}

const inputClass =
  "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-stone-500";
const labelClass = "block text-sm font-medium text-stone-700";
const helpClass = "mt-1 text-xs leading-5 text-stone-500";

export default function AboutPageForm({ action, defaults }: AboutPageFormProps) {
  return (
    <form action={action} className="mt-8 flex flex-col gap-6">
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="font-serif text-xl text-stone-900">Page header</h2>
          <p className="mt-1 text-sm text-stone-500">
            Shown at the top of the About page and on the homepage About card.
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="page_title">
            Page title *
          </label>
          <input
            id="page_title"
            name="page_title"
            required
            defaultValue={defaults.pageTitle}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="page_description">
            Page description *
          </label>
          <textarea
            id="page_description"
            name="page_description"
            required
            rows={3}
            defaultValue={defaults.pageDescription}
            className={inputClass}
          />
        </div>
      </section>

      <section className="flex flex-col gap-5 border-t border-stone-200 pt-6">
        <div>
          <h2 className="font-serif text-xl text-stone-900">Timeline</h2>
          <p className={helpClass}>
            Add each experience as a separate entry. Use Order to control display sequence (smaller numbers appear first).
          </p>
        </div>

        <TimelineEditor initialItems={defaults.timeline} />
      </section>

      <section className="flex flex-col gap-5 border-t border-stone-200 pt-6">
        <div>
          <h2 className="font-serif text-xl text-stone-900">Working Across</h2>
          <p className={helpClass}>One tag per line.</p>
        </div>

        <div>
          <label className={labelClass} htmlFor="working_across_tags">
            Tags
          </label>
          <textarea
            id="working_across_tags"
            name="working_across_tags"
            rows={6}
            defaultValue={serializeTagLines(defaults.workingAcross)}
            className={inputClass}
          />
        </div>
      </section>

      <section className="flex flex-col gap-5 border-t border-stone-200 pt-6">
        <div>
          <h2 className="font-serif text-xl text-stone-900">Current Focus</h2>
        </div>

        <div>
          <label className={labelClass} htmlFor="current_focus">
            Focus paragraph *
          </label>
          <textarea
            id="current_focus"
            name="current_focus"
            required
            rows={4}
            defaultValue={defaults.currentFocus}
            className={inputClass}
          />
        </div>
      </section>

      <button
        type="submit"
        className="rounded-md bg-stone-900 px-5 py-2.5 text-sm text-white hover:bg-stone-700"
      >
        Save About page
      </button>
    </form>
  );
}
