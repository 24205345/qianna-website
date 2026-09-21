export type ResourceType = "prompt" | "mcp" | "skill" | "site" | "hook";

export interface AttachedResource {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  tag?: string;
  content?: string; // Prompt text or MCP configuration snippet
  url?: string; // External documentation or tool link
  curatorNote?: string; // Personal tips, tricks, or best practice guidelines
}

export interface WorkflowStep {
  id: string;
  stepNumber: string; // "01", "02", etc.
  title: string;
  subtitle: string;
  tools: string[]; // e.g. ["Cursor", "FastAPI", "yt-dlp"]
  summary: string;
  relatedNoteHref?: string;
  relatedNoteLabel?: string;
  keyTakeaway?: string;
  resources: AttachedResource[];
}

export interface WorkflowPipeline {
  id: string; // "ai-development" | "spatial-design"
  title: string;
  englishTitle: string;
  badge: string;
  icon: string;
  summary: string;
  coreStack: string[];
  featuredNote?: {
    title: string;
    href: string;
    readingTime: string;
  };
  steps: WorkflowStep[];
}
