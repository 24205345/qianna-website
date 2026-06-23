export interface Trip {
  href: string;
  coverImage: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export const trips: Trip[] = [
  {
    href: "/field-notes/nanjiluo",
    coverImage: "/field-notes/nanjiluo/images/00_nanjiluo_cover.jpg",
    title: "Hiking in Nanjiluo",
    date: "2024.9.3",
    location: "Nanjiluo, Yunnan, China",
    description: "Alpine lakes and pristine wilderness in one of Yunnan's most remote mountain areas.",
  },
  {
    href: "/field-notes/yubeng",
    coverImage: "/field-notes/yubeng/images/00_yubeng_cover.jpg",
    title: "Hiking in Yubeng Village",
    date: "2024.9.4 – 2024.9.6",
    location: "Yubeng Village, Yunnan, China",
    description: "A sacred village beneath Kawagebo Peak — pilgrimage trails through ancient forests and snow-capped vistas.",
  },
  {
    href: "/field-notes/whitecliffs",
    coverImage: "/field-notes/whitecliffs/images/00_whitecliffs_cover.jpg",
    title: "Seven Sisters White Cliffs",
    date: "2024.10.13",
    location: "Seven Sisters, East Sussex, UK",
    description: "Chalk cliffs rising from the English Channel — rolling downland meets the sea along the South Downs Way.",
  },
  {
    href: "/field-notes/gliding",
    coverImage: "/field-notes/gliding/images/00_gliding_cover.jpg",
    title: "First Gliding Experience",
    date: "2024.10.26 – 2024.10.27",
    location: "The Long Mynd, Church Stretton, UK",
    description: "Soaring over the Shropshire Hills — silent flight above rolling moorland and ancient valleys.",
  },
  {
    href: "/field-notes/snowboard",
    coverImage: "/field-notes/snowboard/images/00_superdevoluy_cover_map.jpg",
    title: "Snowboard Days in Superdévoluy",
    date: "2025.3.31 – 2025.4.8",
    location: "Superdévoluy, France",
    description: "Late-season snow, broad ridgelines, carved spring tracks, and a fog-softened return to base.",
  },
];
