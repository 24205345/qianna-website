import type { GalleryImage } from "@/app/_data/project-galleries";
import { undergraduatePortfolioSections } from "@/app/_data/portfolio-sections";
import type { ProjectFull } from "@/lib/projects/queries";
import PortfolioFlipBook from "./PortfolioFlipBook";

interface Props {
  project: ProjectFull;
  galleryImages: GalleryImage[];
}

export default function PortfolioProjectView({ project, galleryImages }: Props) {
  return (
    <PortfolioFlipBook
      images={galleryImages}
      sections={undergraduatePortfolioSections}
      projectTitle={project.title}
      projectCategory={project.category}
    />
  );
}
