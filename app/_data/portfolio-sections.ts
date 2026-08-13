export interface PortfolioSection {
  key: string;
  title: string;
  startPage: number;
  endPage: number;
}

export const undergraduatePortfolioSections: PortfolioSection[] = [
  { key: "cover", title: "Cover", startPage: 1, endPage: 1 },
  {
    key: "fifteen-minute-community",
    title: "Fifteen-Minute Community",
    startPage: 2,
    endPage: 5,
  },
  {
    key: "floating-high-rise",
    title: "Floating High-Rise",
    startPage: 6,
    endPage: 8,
  },
  {
    key: "historic-block-renewal",
    title: "Historic Block Renewal",
    startPage: 9,
    endPage: 11,
  },
  {
    key: "urban-insertion",
    title: "Urban Insertion",
    startPage: 12,
    endPage: 14,
  },
  { key: "other-works", title: "Other Works", startPage: 15, endPage: 15 },
];
