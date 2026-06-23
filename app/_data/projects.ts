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
    slug: "xicaoshi-red-temple",
    category: "Architecture Project",
    title: "Landscape Description",
    description:
      "Block preservation and renewal design for Xicaoshi Red Temple block on Beijing's central axis, using urban acupuncture strategy for sustainable micro-renewal of historic urban areas.",
    tags: ["Urban Acupuncture", "Heritage Preservation", "Micro-renewal"],
    year: "2023",
  },
];
