export interface VisualWork {
  id: string;
  filename: string;
  title: string;
  date: string;
  description: string;
}

export const penDrawings: VisualWork[] = [
  { id: "01", filename: "pen_drawing_01.jpg", title: "Pen Drawing I", date: "2019.9.8", description: "Pen and ink drawing." },
  { id: "02", filename: "pen_drawing_02.jpg", title: "Pen Drawing II", date: "2019.9.9", description: "Pen and ink drawing." },
  { id: "03", filename: "pen_drawing_03.jpg", title: "Pen Drawing III", date: "2019.9.15", description: "Pen and ink drawing." },
  { id: "04", filename: "pen_drawing_04.jpg", title: "Pen Drawing IV", date: "2019.9.22", description: "Pen and ink drawing." },
  { id: "05", filename: "pen_drawing_05.jpg", title: "Pen Drawing V", date: "2019.9.25", description: "Pen and ink drawing." },
  { id: "06", filename: "pen_drawing_06.jpg", title: "Pen Drawing VI", date: "2019.9.30", description: "Pen and ink drawing." },
];

export const penAndWashDrawings: VisualWork[] = [
  { id: "01", filename: "pen_and_wash_01.jpg", title: "Pen & Wash I", date: "2019.9.28", description: "Pen drawing with watercolor wash." },
  { id: "02", filename: "pen_and_wash_02.jpg", title: "Pen & Wash II", date: "2019.10.8", description: "Pen drawing with watercolor wash." },
  { id: "03", filename: "pen_and_wash_03.jpg", title: "Pen & Wash III", date: "2019.10.9", description: "Pen drawing with watercolor wash." },
  { id: "04", filename: "pen_and_wash_04.jpg", title: "Pen & Wash IV", date: "2019.10.10", description: "Pen drawing with watercolor wash." },
  { id: "05", filename: "pen_and_wash_05.jpg", title: "Pen & Wash V", date: "2019.11.9", description: "Pen drawing with watercolor wash." },
  { id: "06", filename: "pen_and_wash_06.jpg", title: "Pen & Wash VI", date: "2019.11.11", description: "Pen drawing with watercolor wash." },
  { id: "07", filename: "pen_and_wash_07.jpg", title: "Pen & Wash VII", date: "2020.8.8", description: "Pen drawing with watercolor wash." },
  { id: "08", filename: "pen_and_wash_08.jpg", title: "Pen & Wash VIII", date: "2020.8.11", description: "Pen drawing with watercolor wash." },
  { id: "09", filename: "pen_and_wash_09.jpg", title: "Pen & Wash IX", date: "2020.8.15", description: "Pen drawing with watercolor wash." },
  { id: "10", filename: "pen_and_wash_10.jpg", title: "Pen & Wash X", date: "2020.8.17", description: "Pen drawing with watercolor wash." },
];

export const watercolorPaintings: VisualWork[] = [
  { id: "01", filename: "watercolor_01.jpg", title: "Watercolor I", date: "2019.9.23", description: "Watercolor painting." },
  { id: "02", filename: "watercolor_02.jpg", title: "Watercolor II", date: "2019.9.26", description: "Watercolor painting." },
  { id: "03", filename: "watercolor_03.jpg", title: "Watercolor III", date: "2019.10.18", description: "Watercolor painting." },
  { id: "04", filename: "watercolor_04.jpg", title: "Watercolor IV", date: "2019.10.19", description: "Watercolor painting." },
  { id: "05", filename: "watercolor_05.jpg", title: "Watercolor V", date: "2019.10.20", description: "Watercolor painting." },
  { id: "06", filename: "watercolor_06.jpg", title: "Watercolor VI", date: "2019.11.10", description: "Watercolor painting." },
];

export interface VisualWorkSection {
  slug: string;
  title: string;
  subtitle: string;
  description?: string | null;
  sort_order: number;
  basePath: string;
  works: VisualWork[];
}

export const visualWorkSections: VisualWorkSection[] = [
  {
    slug: "pen-drawing",
    title: "Pen Drawings",
    subtitle: "6 works · 2019",
    description: "Pure line work — the precision of ink capturing form and texture.",
    sort_order: 0,
    basePath: "/drawings/pen-drawing",
    works: penDrawings,
  },
  {
    slug: "pen-and-wash",
    title: "Pen & Wash",
    subtitle: "10 works · 2019-2020",
    description:
      "The marriage of ink and watercolor — structured lines softened by translucent washes.",
    sort_order: 1,
    basePath: "/drawings/pen-and-wash",
    works: penAndWashDrawings,
  },
  {
    slug: "watercolor",
    title: "Watercolors",
    subtitle: "6 works · 2019",
    description: "Fluid pigments dancing on paper — light, transparency, and atmosphere.",
    sort_order: 2,
    basePath: "/drawings/watercolor",
    works: watercolorPaintings,
  },
];
