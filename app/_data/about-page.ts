export interface AboutTimelineItem {
  period: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface AboutPageContent {
  pageTitle: string;
  pageDescription: string;
  timeline: AboutTimelineItem[];
  workingAcross: string[];
  currentFocus: string;
}

export const fallbackAboutPageContent: AboutPageContent = {
  pageTitle: "Spatial Thinking, AI Products",
  pageDescription:
    "A path from architecture and urban research to SaaS systems and AI product work, focused on turning complex workflows into usable digital tools.",
  timeline: [
    {
      period: "2025-Now",
      title: "AI Product Manager",
      description:
        "Working on digital platform development in the optical display manufacturing industry, focusing on AI product management and platform-based workflows.",
      sortOrder: 0,
    },
    {
      period: "2024-2025",
      title: "Urban Design",
      description:
        "Studied Urban Design at University College London. In the RC15 cluster, researched urban biodiversity mapping through spatial data, visual mapping, and AI-assisted workflows.",
      sortOrder: 1,
    },
    {
      period: "2023-2024",
      title: "SaaS ERP Product Internship",
      description:
        "Worked in a software company serving the FMCG industry, moving from UI design to product management and learning how enterprise workflows become digital tools.",
      sortOrder: 2,
    },
    {
      period: "2018-2023",
      title: "Architecture Design",
      description:
        "Studied Architecture Design at Beijing Jiaotong University (BJTU), building a foundation in spatial design, public life, visual storytelling, and design research.",
      sortOrder: 3,
    },
  ],
  workingAcross: [
    "Spatial systems",
    "Enterprise workflows",
    "Urban data and mapping",
    "Visual communication",
    "AI product development",
  ],
  currentFocus:
    "Today, I am interested in AI products that help people observe, organize, and act on complex information, especially in spatial, industrial, and operational contexts.",
};
