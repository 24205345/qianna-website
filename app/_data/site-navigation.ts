export type SiteNavigationGroup =
  | "section"
  | "project_category"
  | "traces_category"
  | "page_link";

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
    itemKey: "notes-preview",
    group: "section",
    label: "View all notes",
    title: "Notes",
    description:
      "Short notes on learning AI, building tools, and turning ideas into practice.",
    href: "/notes",
    sortOrder: -10,
  },
  {
    itemKey: "projects-preview",
    group: "section",
    label: "View all projects",
    title: "Projects",
    description:
      "Thesis and design research, architecture projects, and digital product work.",
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
    itemKey: "traces-preview",
    group: "section",
    label: "View all traces",
    title: "Traces",
    description:
      "Photography, drawing, and field observation — quiet records of light, form, and movement.",
    href: "/traces",
    sortOrder: 35,
  },
  {
    itemKey: "photography",
    group: "traces_category",
    label: "Photography",
    title: "Quiet urban frames",
    description:
      "A separate collection of observations in light, movement, and place.",
    href: "/traces?tab=photography",
    sortOrder: 40,
  },
  {
    itemKey: "visual-works",
    group: "traces_category",
    label: "Drawings",
    title: "Drawings and sketches",
    description:
      "Studies in form, rhythm, and atmosphere developed by hand and mixed media.",
    href: "/traces?tab=drawings",
    sortOrder: 50,
  },
  {
    itemKey: "field-notes",
    group: "traces_category",
    label: "Field Notes",
    title: "Trails and movement",
    description: "Trails, slopes, and open landscapes.",
    href: "/traces?tab=field-notes",
    sortOrder: 60,
  },
  {
    itemKey: "about",
    group: "section",
    label: "View all",
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

export type TracesTab = "photography" | "drawings" | "field-notes";

export function normalizeTracesTab(tab: string | undefined): TracesTab {
  if (tab === "drawings" || tab === "field-notes") {
    return tab;
  }
  return "photography";
}
