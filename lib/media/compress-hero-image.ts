import sharp from "sharp";
import {
  HERO_IMAGE_MAX_WIDTH,
  HERO_IMAGE_WEBP_QUALITY,
} from "./hero-image";

export async function compressHeroImage(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .rotate()
    .resize({ width: HERO_IMAGE_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: HERO_IMAGE_WEBP_QUALITY })
    .toBuffer();
}
