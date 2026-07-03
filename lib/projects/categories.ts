export interface ProjectCategory {
  slug: string;
  title: string;
  description: string;
  /** 与 projects.category 字段匹配（兼容单复数等写法） */
  matchLabels: string[];
}

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  {
    slug: "thesis-design-research",
    title: "Thesis & Design Research",
    description:
      "Urban systems, public life, and spatial narratives developed through mapping and critical inquiry.",
    matchLabels: ["Thesis & Design Research"],
  },
  {
    slug: "architecture-projects",
    title: "Architecture Projects",
    description:
      "Studio and built work shaped by context, material sensitivity, and lived experience.",
    matchLabels: ["Architecture Project", "Architecture Projects"],
  },
  {
    slug: "digital-product-work",
    title: "Digital Product Work",
    description:
      "Interface concepts translating complex spatial data into clear tools for people and cities.",
    matchLabels: ["Digital Product Work", "Digital Product"],
  },
];

export function getCategoryBySlug(slug: string | undefined): ProjectCategory | undefined {
  if (!slug) return undefined;
  return PROJECT_CATEGORIES.find((c) => c.slug === slug);
}

export function projectBelongsToCategory(
  projectCategory: string,
  category: ProjectCategory
): boolean {
  const normalized = projectCategory.trim().toLowerCase();
  return category.matchLabels.some((label) => label.trim().toLowerCase() === normalized);
}

export function filterProjectsByCategory<T extends { category: string }>(
  projects: T[],
  category: ProjectCategory
): T[] {
  return projects.filter((p) => projectBelongsToCategory(p.category, category));
}

export function groupProjectsByCategory<T extends { category: string }>(
  projects: T[]
): { category: ProjectCategory; projects: T[] }[] {
  return PROJECT_CATEGORIES.map((category) => ({
    category,
    projects: filterProjectsByCategory(projects, category),
  }));
}
