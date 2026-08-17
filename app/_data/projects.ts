export interface Project {
  slug: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  year: string;
}

export const projects: Project[] = [
  {
    slug: "thesis",
    category: "Thesis & Design Research",
    title: "Between Destinations",
    description:
      "The project investigates the emotional costs of London's public transport system using geospatial analysis and wearable GSR sensors, proposing a dual intervention of a mobile app and a parasitic architectural system to redefine urban mobility and social interaction.",
    tags: ["Emotional Costs", "Geospatial Analysis", "Parasitic Architecture"],
    year: "2025",
  },
  {
    slug: "undergraduate-portfolio",
    category: "Architecture Project",
    title: "Selected Works",
    description:
      "Undergraduate architectural portfolio from Beijing Jiaotong University (2019–2023), featuring four studio projects presented as full-page spreads.",
    tags: ["BJTU", "Architecture Design", "Portfolio"],
    year: "2019–2023",
  },
];
