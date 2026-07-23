export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugifyHeading(text: string): string {
  const slug = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return slug || "section";
}

/** Extract h2/h3 headings from markdown for TOC navigation. */
export function extractTocFromMarkdown(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const usedIds = new Map<string, number>();

  for (const line of markdown.split(/\r?\n/)) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/#+\s*$/, "").trim();
    if (!text) continue;

    let id = slugifyHeading(text);
    const count = usedIds.get(id) ?? 0;
    usedIds.set(id, count + 1);
    if (count > 0) {
      id = `${id}-${count + 1}`;
    }

    headings.push({ id, text, level });
  }

  return headings;
}

export function headingIdFromText(
  text: string,
  usedIds: Map<string, number>
): string {
  let id = slugifyHeading(text);
  const count = usedIds.get(id) ?? 0;
  usedIds.set(id, count + 1);
  if (count > 0) {
    id = `${id}-${count + 1}`;
  }
  return id;
}

export interface MarkdownSection {
  id: string;
  title: string;
  markdown: string;
}

/** Split markdown into pages by ## headings for editor pagination. */
export function splitMarkdownSections(markdown: string): MarkdownSection[] {
  const lines = markdown.split(/\r?\n/);
  const usedIds = new Map<string, number>();
  const sections: MarkdownSection[] = [];

  let currentTitle = "Introduction";
  let currentId = headingIdFromText(currentTitle, usedIds);
  let buffer: string[] = [];

  const pushCurrent = () => {
    const body = buffer.join("\n").trim();
    if (!body && sections.length === 0 && currentTitle === "Introduction") {
      buffer = [];
      return;
    }
    sections.push({
      id: currentId,
      title: currentTitle,
      markdown:
        currentTitle === "Introduction" && !body.startsWith("#")
          ? body
          : `## ${currentTitle}\n\n${body}`.trim(),
    });
    buffer = [];
  };

  for (const line of lines) {
    const match = /^##\s+(.+)$/.exec(line.trim());
    if (match) {
      pushCurrent();
      currentTitle = match[1].replace(/#+\s*$/, "").trim() || "Section";
      currentId = headingIdFromText(currentTitle, usedIds);
      continue;
    }
    buffer.push(line);
  }

  pushCurrent();

  if (sections.length === 0) {
    return [
      {
        id: "introduction",
        title: "Introduction",
        markdown: markdown.trim() || "",
      },
    ];
  }

  return sections;
}
