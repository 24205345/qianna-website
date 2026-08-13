/** 详情页画廊静态回退数据（Supabase 未配置或查询失败时使用） */

export interface GalleryImage {
  url: string;
  title: string;
  caption?: string;
}

export const thesisGalleryFallback: GalleryImage[] = [
  {
    url: "/projects/thesis/images/01_Transport Gaps.jpg",
    title: "Transport Gaps",
    caption:
      "This analysis examines transport infrastructure to uncover regional disparities and shifts over time. By identifying gaps in urban functionality, it highlights where services fall short and where interventions are most needed.",
  },
  {
    url: "/projects/thesis/images/02_Facility Services Analysis.jpg",
    title: "Facility Services Analysis",
    caption:
      "The study examines transportation infrastructure to reveal regional disparities and shifts over time. By highlighting gaps in urban functionality, it provides insight into where improvements are needed for more balanced city access.",
  },
  {
    url: "/projects/thesis/images/03_Sensing Transport.jpg",
    title: "Sensing Transport",
    caption:
      "Using the four most common routes in the monitored community, this analysis captures and compares travel experiences across different transport modes, revealing how mobility shapes daily routines and perceptions of the city.",
  },
  {
    url: "/projects/thesis/images/04_T-Distributed Stochastic Neighbor Embedding (t-SNE) Spatial Clusters.jpg",
    title: "t-SNE Spatial Clusters",
    caption:
      "By compressing multi-vector data into 3D space with t-distributed Stochastic Neighbor Embedding (t-SNE), zones of similar negative experiences cluster together. These patterns form the basis for spatial growth.",
  },
  {
    url: "/projects/thesis/images/05_Principles of Data Collection.jpg",
    title: "Principles of Data Collection",
    caption:
      "Wearable devices capture shifts in physiological activity as people move through the city. By measuring skin potential changes triggered by perception, they reveal how urban environments affect the body and shape lived experience.",
  },
  {
    url: "/projects/thesis/images/06_Data Translation and Skeleton Generation.jpg",
    title: "Data Translation and Skeleton Generation",
    caption:
      "Growth locations and skeletal structures are translated from two-dimensional data via the wool algorithm, then combined with site characteristics and visible construction zones to generate the parasitic structures.",
  },
  {
    url: "/projects/thesis/images/07_Strategic Overview.jpg",
    title: "Strategic Overview",
    caption:
      "This project uses sensors to explore hidden issues of urban mobility. Through data analysis and spatial translation, it creates parasitic spaces that amplify human perception and reconnect people with the city in a dynamic, symbiotic way.",
  },
  {
    url: "/projects/thesis/images/08_Rendering and Possibility.jpg",
    title: "Rendering and Possibility",
    caption:
      "Human perception resonates with the urban fabric, blurring the line between observer and environment. Through sensory exchange, people and cities co-transform, creating a feedback loop where space is continually redefined.",
  },
];

export const xicaoshiGalleryFallback: GalleryImage[] = [
  { url: "/projects/xicaoshi-red-temple/images/01_site_analysis.jpg", title: "Site Analysis" },
  { url: "/projects/xicaoshi-red-temple/images/02_current_situation_analysis.png", title: "Current Situation Analysis" },
  { url: "/projects/xicaoshi-red-temple/images/03_landscape_rendering.jpg", title: "Landscape Rendering" },
  { url: "/projects/xicaoshi-red-temple/images/04_planning_guidelines.jpg", title: "Planning Guidelines" },
  { url: "/projects/xicaoshi-red-temple/images/05_important_node_updates.png", title: "Important Node Updates" },
  { url: "/projects/xicaoshi-red-temple/images/07_courtyard_location_analysis.jpg", title: "Courtyard Location Analysis" },
  { url: "/projects/xicaoshi-red-temple/images/08_current_situation.png", title: "Current Situation of Courtyard" },
  { url: "/projects/xicaoshi-red-temple/images/09_morphological_evolution.png", title: "Morphological Evolution Process" },
  { url: "/projects/xicaoshi-red-temple/images/10_analysis_chart.png", title: "Analysis Chart" },
  { url: "/projects/xicaoshi-red-temple/images/11_profile_view.jpg", title: "Profile View" },
  { url: "/projects/xicaoshi-red-temple/images/12_ground_floor_plan.jpg", title: "Ground Floor Plan" },
  { url: "/projects/xicaoshi-red-temple/images/13_exploded_axonometric.jpg", title: "Exploded Axonometric" },
];

export const thesisHeroVideoFallback = "/projects/thesis/video/01_hero_video.mp4";
export const xicaoshiCoverFallback = "/projects/xicaoshi-red-temple/images/00_landscape_cover.jpg";
export const undergraduatePortfolioCoverFallback =
  "/projects/undergraduate-portfolio/pages/01.jpg";

const undergraduatePortfolioPageCount = 15;

export const undergraduatePortfolioGalleryFallback: GalleryImage[] = Array.from(
  { length: undergraduatePortfolioPageCount },
  (_, index) => {
    const page = String(index + 1).padStart(2, "0");
    return {
      url: `/projects/undergraduate-portfolio/pages/${page}.jpg`,
      title: `Spread ${page}`,
    };
  }
);
