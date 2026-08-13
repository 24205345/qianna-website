"""
Extract undergraduate portfolio PDF spreads into public/projects/undergraduate-portfolio/pages/.

Source (edit if your PDF lives elsewhere):
  G:\\出国作品集\\不同专业\\30pages4projects(none-info).pdf

Requires: pip install pymupdf
"""

from __future__ import annotations

from pathlib import Path

import fitz
from PIL import Image, ImageFilter

PDF_PATH = Path(r"G:\出国作品集\不同专业\30pages4projects(none-info).pdf")
OUT_DIR = Path(__file__).resolve().parents[1] / "public" / "projects" / "undergraduate-portfolio" / "pages"
TARGET_WIDTH = 1800
JPEG_QUALITY = 88


def redact_cover_personal_info(cover_path: Path) -> None:
    """Remove name / email / phone block from the cover spread."""
    img = Image.open(cover_path).convert("RGB")
    width, height = img.size
    x0 = int(width * 0.48)
    y0 = int(height * 0.68)
    patch_source = img.crop((int(width * 0.08), y0, x0, height))
    patch_source = patch_source.resize((width - x0, height - y0), Image.Resampling.LANCZOS)
    img.paste(patch_source, (x0, y0))
    softened = img.crop((max(0, x0 - 3), y0, width, height)).filter(ImageFilter.GaussianBlur(radius=0.6))
    img.paste(softened, (max(0, x0 - 3), y0))
    img.save(cover_path, quality=JPEG_QUALITY)


def main() -> None:
    if not PDF_PATH.is_file():
        raise SystemExit(f"PDF not found: {PDF_PATH}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(PDF_PATH)

    for index in range(doc.page_count):
        page_number = index + 1
        page = doc[index]
        target_width = 3600 if page.rect.width > page.rect.height * 1.6 else 1800
        zoom = target_width / page.rect.width
        matrix = fitz.Matrix(zoom, zoom)
        pixmap = page.get_pixmap(matrix=matrix, alpha=False)
        destination = OUT_DIR / f"{page_number:02d}.jpg"
        pixmap.save(str(destination), jpg_quality=JPEG_QUALITY)
        size_kb = destination.stat().st_size // 1024
        print(f"{destination.name}\t{size_kb} KB")

    cover = OUT_DIR / "01.jpg"
    if cover.is_file():
        redact_cover_personal_info(cover)
        print("redacted personal info on 01.jpg")

    print(f"done {doc.page_count} pages -> {OUT_DIR}")


if __name__ == "__main__":
    main()
