/** Single-page spread ratio (cover / back) */
export const PORTFOLIO_SINGLE_RATIO = 1800 / 1273;

/** Total spreads in the undergraduate portfolio export (cover + 13 doubles + back) */
export const PORTFOLIO_SPREAD_COUNT = 15;

/** Flip-book page count: cover + 13 spreads × 2 + back */
export const PORTFOLIO_FLIP_PAGE_COUNT = 1 + (PORTFOLIO_SPREAD_COUNT - 2) * 2 + 1;

export type PortfolioFlipLeaf =
  | { kind: "single"; spread: number; src: string; alt: string; hard: true }
  | { kind: "spread-half"; spread: number; src: string; alt: string; side: "left" | "right" };

export function buildPortfolioFlipLeaves(
  images: { url: string; title: string }[]
): PortfolioFlipLeaf[] {
  if (images.length === 0) return [];

  const leaves: PortfolioFlipLeaf[] = [
    {
      kind: "single",
      spread: 1,
      src: images[0].url,
      alt: images[0].title,
      hard: true,
    },
  ];

  for (let spread = 2; spread <= images.length - 1; spread += 1) {
    const image = images[spread - 1];
    leaves.push(
      {
        kind: "spread-half",
        spread,
        src: image.url,
        alt: `${image.title} (left)`,
        side: "left",
      },
      {
        kind: "spread-half",
        spread,
        src: image.url,
        alt: `${image.title} (right)`,
        side: "right",
      }
    );
  }

  const back = images[images.length - 1];
  leaves.push({
    kind: "single",
    spread: images.length,
    src: back.url,
    alt: back.title,
    hard: true,
  });

  return leaves;
}

export function flipIndexToSpread(flipIndex: number): number {
  if (flipIndex <= 0) return 1;
  if (flipIndex >= PORTFOLIO_FLIP_PAGE_COUNT - 1) return PORTFOLIO_SPREAD_COUNT;
  return Math.floor((flipIndex - 1) / 2) + 2;
}

export function spreadToFlipIndex(spread: number): number {
  if (spread <= 1) return 0;
  if (spread >= PORTFOLIO_SPREAD_COUNT) return PORTFOLIO_FLIP_PAGE_COUNT - 1;
  return (spread - 2) * 2 + 1;
}
