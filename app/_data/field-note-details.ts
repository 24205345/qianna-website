import type { Trip } from "./field-notes";

export type FieldNoteLayout = "gallery" | "narrative";

export interface FieldNoteGalleryPhoto {
  filename?: string;
  title: string;
  url?: string;
}

export interface FieldNoteVideo {
  title: string;
  url: string;
}

export interface FieldNoteNarrativeBlock {
  sectionKey: string;
  sectionTitle: string;
  layout: "full_width" | "text_left" | "text_right";
  aspectRatio: "16/9" | "4/3";
  filename?: string;
  url?: string;
  caption?: string;
  footerCaption?: string;
}

export interface FieldNoteDetail {
  slug: string;
  title: string;
  date: string;
  location: string;
  description: string;
  activity: string;
  coverImage: string;
  layoutTemplate: FieldNoteLayout;
  sortOrder: number;
  galleryBasePath: string;
  galleryPhotos: FieldNoteGalleryPhoto[];
  videos?: FieldNoteVideo[];
  videosSectionTitle?: string;
  narrativeBlocks?: FieldNoteNarrativeBlock[];
  showTripDetailsHeading?: boolean;
  showScrollHint?: boolean;
}

function hikeGallery(
  slug: string,
  coverFilename: string,
  hikeCount: number,
  hikePrefix: string,
  titlePrefix: string
): FieldNoteGalleryPhoto[] {
  return [
    { filename: coverFilename, title: "Cover" },
    ...Array.from({ length: hikeCount }, (_, i) => ({
      filename: `${String(i + 1).padStart(2, "0")}_${hikePrefix}_${i + 1}.jpg`,
      title: `${titlePrefix} ${i + 1}`,
    })),
  ];
}

export const fieldNoteDetails: FieldNoteDetail[] = [
  {
    slug: "nanjiluo",
    title: "Hiking in Nanjiluo",
    date: "2024.9.3",
    location: "Nanjiluo, Yunnan, China",
    description: "Alpine lakes and pristine wilderness in one of Yunnan's most remote mountain areas.",
    activity: "Hiking",
    coverImage: "/field-notes/nanjiluo/images/00_nanjiluo_cover.jpg",
    layoutTemplate: "gallery",
    sortOrder: 0,
    galleryBasePath: "/field-notes/nanjiluo/images",
    galleryPhotos: hikeGallery("nanjiluo", "00_nanjiluo_cover.jpg", 16, "nanjiluo_hike", "Hike"),
  },
  {
    slug: "yubeng",
    title: "Hiking in Yubeng Village",
    date: "2024.9.4 – 2024.9.6",
    location: "Yubeng Village, Yunnan, China",
    description:
      "A sacred village beneath Kawagebo Peak — pilgrimage trails through ancient forests and snow-capped vistas.",
    activity: "Hiking",
    coverImage: "/field-notes/yubeng/images/00_yubeng_cover.jpg",
    layoutTemplate: "gallery",
    sortOrder: 1,
    galleryBasePath: "/field-notes/yubeng/images",
    galleryPhotos: hikeGallery("yubeng", "00_yubeng_cover.jpg", 8, "yubeng_hike", "Hike"),
  },
  {
    slug: "whitecliffs",
    title: "Seven Sisters White Cliffs",
    date: "2024.10.13",
    location: "Seven Sisters, East Sussex, UK",
    description:
      "Chalk cliffs rising from the English Channel — rolling downland meets the sea along the South Downs Way.",
    activity: "Hiking",
    coverImage: "/field-notes/whitecliffs/images/00_whitecliffs_cover.jpg",
    layoutTemplate: "gallery",
    sortOrder: 2,
    galleryBasePath: "/field-notes/whitecliffs/images",
    galleryPhotos: hikeGallery("whitecliffs", "00_whitecliffs_cover.jpg", 10, "whitecliffs_hike", "Hike"),
  },
  {
    slug: "gliding",
    title: "First Gliding Experience",
    date: "2024.10.26 – 2024.10.27",
    location: "The Long Mynd, Church Stretton, UK",
    description: "Soaring over the Shropshire Hills — silent flight above rolling moorland and ancient valleys.",
    activity: "Gliding",
    coverImage: "/field-notes/gliding/images/00_gliding_cover.jpg",
    layoutTemplate: "gallery",
    sortOrder: 3,
    galleryBasePath: "/field-notes/gliding/images",
    galleryPhotos: [
      { filename: "00_gliding_cover.jpg", title: "Cover" },
      ...Array.from({ length: 20 }, (_, i) => ({
        filename: `${String(i + 1).padStart(2, "0")}_gliding_flight_${i + 1}.jpg`,
        title: `Flight ${i + 1}`,
      })),
    ],
    videos: [
      {
        title: "Flight Over the Hills",
        url: "https://drive.google.com/file/d/1BKeb-mGGKFlqX9d-4M1UrsQSRON85XEQ/preview",
      },
      {
        title: "Cockpit View",
        url: "https://drive.google.com/file/d/1YdqSn68QnTurM3CDEkBV1Tc27eFqD8YE/preview",
      },
    ],
    videosSectionTitle: "Videos · 2",
  },
  {
    slug: "snowboard",
    title: "Snowboard Days in Superdévoluy",
    date: "2025.3.31 – 2025.4.8",
    location: "Superdévoluy, France",
    description: "Late-season snow, broad ridgelines, carved spring tracks, and a fog-softened return to base.",
    activity: "Snowboarding",
    coverImage: "/field-notes/snowboard/images/00_superdevoluy_cover_map.jpg",
    layoutTemplate: "narrative",
    sortOrder: 4,
    galleryBasePath: "/field-notes/snowboard/images",
    galleryPhotos: [],
    showTripDetailsHeading: true,
    showScrollHint: true,
    narrativeBlocks: [
      {
        sectionKey: "slope",
        sectionTitle: "The Slope",
        layout: "full_width",
        aspectRatio: "16/9",
        filename: "01_superdevoluy_slope_panorama.jpg",
      },
      {
        sectionKey: "alpine_basin",
        sectionTitle: "Alpine Basin",
        layout: "text_left",
        aspectRatio: "4/3",
        filename: "02_superdevoluy_alpine_basin.jpg",
        caption:
          "High above the tree line, the landscape opens into a vast white bowl ringed by peaks. Spring sun softens the snow surface by midday, turning morning corduroy into afternoon slalom.",
      },
      {
        sectionKey: "board_rest",
        sectionTitle: "Board Rest",
        layout: "text_right",
        aspectRatio: "4/3",
        filename: "03_superdevoluy_board_rest_view.jpg",
        caption:
          "A quiet pause on the piste edge. Board planted in the snow, lungs full of cold mountain air — the kind of stillness that only altitude can offer.",
      },
      {
        sectionKey: "spring_chute",
        sectionTitle: "Spring Chute",
        layout: "full_width",
        aspectRatio: "16/9",
        filename: "04_superdevoluy_spring_chute.jpg",
        footerCaption:
          "Late-season conditions brought a mix of powder stashes and spring corn — the last great runs before the thaw.",
      },
    ],
    videos: [
      {
        title: "Ridge Glide",
        url: "https://drive.google.com/file/d/1ZUz-pVkL0zwbX4I-_ndkGHFp_bcdF32q/preview",
      },
      {
        title: "Foggy Base",
        url: "https://drive.google.com/file/d/16BtJI5Cu3gzozP0ymO05EcIs_vO4seQL/preview",
      },
    ],
    videosSectionTitle: "In Motion",
  },
];

export function getFieldNoteDetailBySlug(slug: string): FieldNoteDetail | undefined {
  return fieldNoteDetails.find((n) => n.slug === slug);
}

/** 列表页静态回退（与 trips 一致，可从 details 派生） */
export function getFieldNotesTripsFallback(): Trip[] {
  return fieldNoteDetails.map((note) => ({
    href: `/field-notes/${note.slug}`,
    coverImage: note.coverImage,
    title: note.title,
    date: note.date,
    location: note.location,
    description: note.description,
  }));
}
