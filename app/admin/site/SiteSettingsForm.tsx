import type { SiteSettings } from "@/app/_data/site-settings";
import type { SiteNavigationItem } from "@/app/_data/site-navigation";

interface SiteSettingsFormProps {
  action: (formData: FormData) => Promise<void>;
  defaults: SiteSettings;
  navigationItems: SiteNavigationItem[];
}

const inputClass =
  "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-stone-500";
const labelClass = "block text-sm font-medium text-stone-700";
const helpClass = "mt-1 text-xs leading-5 text-stone-500";

export default function SiteSettingsForm({
  action,
  defaults,
  navigationItems,
}: SiteSettingsFormProps) {
  return (
    <form action={action} className="mt-8 flex flex-col gap-5">
      <div>
        <label className={labelClass} htmlFor="hero_title">
          Hero title *
        </label>
        <input
          id="hero_title"
          name="hero_title"
          required
          defaultValue={defaults.heroTitle}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="hero_subtitle">
          Hero subtitle *
        </label>
        <textarea
          id="hero_subtitle"
          name="hero_subtitle"
          required
          rows={3}
          defaultValue={defaults.heroSubtitle}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="hero_cta_label">
          CTA label *
        </label>
        <input
          id="hero_cta_label"
          name="hero_cta_label"
          required
          defaultValue={defaults.heroCtaLabel}
          className={inputClass}
        />
        <p className={helpClass}>The page automatically appends a right arrow after this label.</p>
      </div>

      <div>
        <label className={labelClass} htmlFor="hero_image_url">
          Hero image URL *
        </label>
        <input
          id="hero_image_url"
          name="hero_image_url"
          required
          defaultValue={defaults.heroImageUrl}
          className={inputClass}
        />
        <p className={helpClass}>
          Enter a public Supabase Storage URL. Uploading a new image will replace this field.
        </p>
      </div>

      <div>
        <label className={labelClass} htmlFor="hero_image_alt">
          Image alt text *
        </label>
        <input
          id="hero_image_alt"
          name="hero_image_alt"
          required
          defaultValue={defaults.heroImageAlt}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="hero_image">
          Upload new Hero image (optional)
        </label>
        <input
          id="hero_image"
          name="hero_image"
          type="file"
          accept="image/*"
          className="mt-1 w-full text-sm text-stone-600 file:mr-4 file:rounded-md file:border-0 file:bg-stone-900 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-stone-700"
        />
        <p className={helpClass}>
          Use a compressed image when possible. Large images can also be uploaded with <code>npm run migrate:home</code>.
        </p>
      </div>

      {defaults.heroImageUrl ? (
        <div>
          <p className={labelClass}>Current Hero image preview</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={defaults.heroImageUrl}
            alt={defaults.heroImageAlt}
            className="mt-2 aspect-video w-full rounded-xl border border-stone-200 object-cover"
          />
        </div>
      ) : null}

      <div className="mt-4 border-t border-stone-200 pt-6">
        <h2 className="font-serif text-2xl text-stone-900">
          Homepage Cards & Page Headings
        </h2>
        <p className={helpClass}>
          These entries power the homepage cards and the linked page headings.
          The link target is fixed to avoid broken navigation.
        </p>
      </div>

      <input
        type="hidden"
        name="navigation_count"
        value={navigationItems.length}
      />
      <div className="flex flex-col gap-5">
        {navigationItems.map((item, index) => (
          <fieldset
            key={item.itemKey}
            className="rounded-xl border border-stone-200 bg-stone-50/60 p-4"
          >
            <input
              type="hidden"
              name={`navigation_${index}_item_key`}
              value={item.itemKey}
            />
            <input
              type="hidden"
              name={`navigation_${index}_group`}
              value={item.group}
            />
            <input
              type="hidden"
              name={`navigation_${index}_href`}
              value={item.href}
            />
            <input
              type="hidden"
              name={`navigation_${index}_sort_order`}
              value={item.sortOrder}
            />

            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <legend className="font-serif text-lg text-stone-900">
                  {item.title}
                </legend>
                <p className={helpClass}>{item.href}</p>
              </div>
              <span className="rounded-full bg-stone-200 px-2.5 py-1 text-[11px] uppercase tracking-wide text-stone-500">
                {item.group.replace("_", " ")}
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor={`navigation_${index}_label`}>
                  Label *
                </label>
                <input
                  id={`navigation_${index}_label`}
                  name={`navigation_${index}_label`}
                  required
                  defaultValue={item.label}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor={`navigation_${index}_title`}>
                  Title *
                </label>
                <input
                  id={`navigation_${index}_title`}
                  name={`navigation_${index}_title`}
                  required
                  defaultValue={item.title}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={labelClass} htmlFor={`navigation_${index}_description`}>
                Description
              </label>
              <textarea
                id={`navigation_${index}_description`}
                name={`navigation_${index}_description`}
                rows={3}
                defaultValue={item.description}
                className={inputClass}
              />
            </div>
          </fieldset>
        ))}
      </div>

      <button
        type="submit"
        className="rounded-md bg-stone-900 px-5 py-2.5 text-sm text-white hover:bg-stone-700"
      >
        Save Site Settings
      </button>
    </form>
  );
}
