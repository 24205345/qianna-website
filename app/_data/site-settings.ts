export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaLabel: string;
  heroImageUrl: string;
  heroImageAlt: string;
}

export const fallbackSiteSettings: SiteSettings = {
  heroTitle: "Qianna Wang",
  heroSubtitle: "Urban design, visual storytelling, and spatial observation.",
  heroCtaLabel: "Enter",
  heroImageUrl: "/images/hero-image.jpg",
  heroImageAlt: "Qianna Wang cover image",
};
