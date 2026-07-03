export type SiteNavigationGroup = "section" | "project_category" | "page_link";

export interface SiteNavigationItem {
  itemKey: string;
  group: SiteNavigationGroup;
  label: string;
  title: string;
  description: string;
  href: string;
  sortOrder: number;
}

export const fallbackSiteNavigationItems: SiteNavigationItem[] = [
  {
    itemKey: "projects-preview",
    group: "section",
    label: "View all projects",
    title: "Projects Preview",
    description: "",
    href: "/projects",
    sortOrder: 0,
  },
  {
    itemKey: "thesis-design-research",
    group: "project_category",
    label: "Projects",
    title: "Thesis & Design Research",
    description:
      "Urban systems, public life, and spatial narratives developed through mapping and critical inquiry.",
    href: "/projects?category=thesis-design-research",
    sortOrder: 10,
  },
  {
    itemKey: "architecture-projects",
    group: "project_category",
    label: "Projects",
    title: "Architecture Projects",
    description:
      "Studio and built work shaped by context, material sensitivity, and lived experience.",
    href: "/projects?category=architecture-projects",
    sortOrder: 20,
  },
  {
    itemKey: "digital-product-work",
    group: "project_category",
    label: "Projects",
    title: "Digital Product Work",
    description:
      "Interface concepts translating complex spatial data into clear tools for people and cities.",
    href: "/projects?category=digital-product-work",
    sortOrder: 30,
  },
  {
    itemKey: "photography",
    group: "page_link",
    label: "Photography",
    title: "Quiet urban frames",
    description:
      "A separate collection of observations in light, movement, and place.",
    href: "/photography",
    sortOrder: 40,
  },
  {
    itemKey: "visual-works",
    group: "page_link",
    label: "Visual Works",
    title: "Drawings and sketches",
    description:
      "Studies in form, rhythm, and atmosphere developed by hand and mixed media.",
    href: "/visual-works",
    sortOrder: 50,
  },
  {
    itemKey: "field-notes",
    group: "page_link",
    label: "Field Notes",
    title: "Trails and movement",
    description:
      "Hiking journeys, outdoor routes, and movement-based observation of landscapes.",
    href: "/field-notes",
    sortOrder: 60,
  },
  {
    itemKey: "about",
    group: "page_link",
    label: "About",
    title: "Spatial Thinking, AI Products",
    description:
      "A path from architecture and urban research to SaaS systems and AI product work, focused on turning complex workflows into usable digital tools.",
    href: "/about",
    sortOrder: 70,
  },
];

export function getFallbackNavigationItem(
  itemKey: string
): SiteNavigationItem | undefined {
  return fallbackSiteNavigationItems.find((item) => item.itemKey === itemKey);
}
