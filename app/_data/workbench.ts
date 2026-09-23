import type { WorkflowPipeline } from "@/lib/workbench/types";

export const WORKBENCH_PIPELINES: WorkflowPipeline[] = [
  {
    id: "ai-development",
    title: "AI Product & Solo Dev",
    englishTitle: "AI Product & Solo Indie Development",
    badge: "AI Engineering & Indie Hacker",
    icon: "",
    summary:
      "An agile, deliverable-first engineering loop: from agent guardrails and core path validation to split-screen UX ergonomics and containerized production deployment.",
    coreStack: [
      "VS Code",
      "GitHub Copilot",
      "FastAPI",
      "Next.js",
      "Docker",
      "Stripe",
    ],
    featuredNote: {
      title: "Environment & Infrastructure: A Practical Guide to Models, Agents & Guardrails",
      href: "/notes/ai-infrastructure-coding-agents-and-models",
      readingTime: "10 min read",
    },
    steps: [
      {
        id: "step-env",
        stepNumber: "01",
        title: "Environment & Infrastructure",
        subtitle: "Environment & Infrastructure Setup",
        tools: [
          "Cursor",
          "Codex",
          "VS Code",
          "MCP",
          "Skills",
        ],
        summary:
          "Set up a high-velocity solo engineering stack: selecting the optimal IDE/Agent tools (Cursor, Codex, VS Code), leveraging the skills.sh registry (trellis, frontend-design, ui-ux-pro-max), and integrating real-time MCPs (Context7, Firecrawl, Playwright).",
        keyTakeaway:
          "Equip your workspace with the right tools: pick an AI-native editor (Cursor, Codex, VS Code), connect live external data and browser controls via MCPs, and install architecture and design rules via skills.sh to maximize solo engineering agility.",
        relatedNoteHref: "/notes/ai-infrastructure-coding-agents-and-models",
        relatedNoteLabel: "Read Note: Environment & Infrastructure Setup",
        resources: [
          {
            id: "site-cursor",
            type: "site",
            title: "Cursor AI-Native IDE",
            description:
              "Benchmark AI-native code editor known for fluid multi-line Tab predictive autocomplete and Composer multi-file refactoring.",
            tag: "AI-Native IDE",
            url: "https://www.cursor.com/",
            content: `// Visit official website: https://www.cursor.com/
// Key capabilities:
// 1. Tab predictive multi-line completion: instant next-edit suggestions from codebase context
// 2. Composer multi-file editing: Cmd/Ctrl + I for full-project smart refactoring
// 3. One-click migration: seamless import of all VS Code extensions, keybindings, and settings`,
            curatorNote: "The most fluid daily AI coding editor for Tab completions and multi-file Composer refactoring.",
          },
          {
            id: "site-codex",
            type: "site",
            title: "OpenAI Codex (Desktop & CLI)",
            description:
              "Collaborative coding platform and agent tool by OpenAI. Supports managing concurrent development tasks on desktop alongside a terminal CLI with sandboxed execution.",
            tag: "Coding Agent Platform",
            url: "https://chatgpt.com/codex",
            content: `# Codex CLI quick installation (Windows PowerShell):
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"

# Or install globally via npm:
npm install -g @openai/codex

# Launch Codex interactive mode:
codex`,
            curatorNote: "Official OpenAI multi-agent collaborative coding platform with local sandbox execution.",
          },
          {
            id: "site-vscode-copilot",
            type: "site",
            title: "VS Code + GitHub Copilot (Pro)",
            description:
              "The industry-standard development environment and AI pair programming foundation. Copilot Pro ($10/mo) supports Claude and GPT frontier models with inline completions, chat, and agentic workflows.",
            tag: "IDE & Agent Host",
            url: "https://code.visualstudio.com/",
            content: `// VS Code + GitHub Copilot engineering setup:
// 1. Ecosystem: Vast extension marketplace, rich community troubleshooting, and reliable tooling
// 2. Model flexibility: Copilot Pro unlocks frontier models (Claude 3.7 Sonnet, GPT-4o)
// 3. Accessibility: Straightforward $10/month subscription accessible with standard international credit cards
// 4. Integration: Inline completions (Tab), Chat, and Agent editing deeply embedded in a single editor`,
            curatorNote: "Lowest onboarding friction and most extensible daily driver for solo developers.",
          },
          {
            id: "site-skills-directory",
            type: "site",
            title: "The Agent Skills Directory (skills.sh)",
            description:
              "Authoritative index and directory for open-source Agent skills. Discover categorized skills across full-stack engineering, automated testing, and design heuristics, installable via terminal in seconds.",
            tag: "Skills Ecosystem Directory",
            url: "https://www.skills.sh/",
            content: `// Browse skills directory: https://www.skills.sh/
// Terminal installation syntax:
npx skills add <skill-name-or-repo>

// Examples:
npx skills add trellis
npx skills add https://github.com/anthropics/skills --skill frontend-design`,
            curatorNote: "The premier discovery hub and package registry for the emerging Agent Skills ecosystem.",
          },
          {
            id: "mcp-context7",
            type: "mcp",
            title: "Context7 MCP Server",
            description:
              "Fetches up-to-date, version-specific library documentation and examples directly into AI coding agents, preventing deprecated or hallucinated APIs.",
            tag: "Code Documentation MCP",
            url: "https://context7.com/",
            content: JSON.stringify(
              {
                mcpServers: {
                  context7: {
                    url: "https://mcp.context7.com/mcp",
                    headers: {
                      CONTEXT7_API_KEY: "YOUR_API_KEY",
                    },
                  },
                },
              },
              null,
              2
            ),
            curatorNote: "Essential pre-flight tool to prevent agents from relying on deprecated library signatures.",
          },
          {
            id: "mcp-firecrawl",
            type: "mcp",
            title: "Firecrawl MCP Server",
            description:
              "Crawls and converts web content into clean, LLM-ready markdown. Bridges web documentation with agent workflows.",
            tag: "Web Extraction MCP",
            url: "https://www.firecrawl.dev/",
            content: JSON.stringify(
              {
                mcpServers: {
                  firecrawl: {
                    url: "https://mcp.firecrawl.dev/YOUR_API_KEY/v2/mcp",
                  },
                },
              },
              null,
              2
            ),
            curatorNote: "Ideal for ingesting GitHub docs, competitor landing pages, or long-form API guides into agent context.",
          },
          {
            id: "mcp-playwright",
            type: "mcp",
            title: "Playwright Browser Automation MCP",
            description:
              "Open-source browser automation framework simulating real user interactions (click, type, navigate) for E2E testing and autonomous agent evaluation.",
            tag: "Browser Automation MCP",
            url: "https://playwright.dev/",
            content: JSON.stringify(
              {
                mcpServers: {
                  playwright: {
                    command: "npx",
                    args: ["-y", "@modelcontextprotocol/server-playwright"],
                  },
                },
              },
              null,
              2
            ),
            curatorNote: "Enables autonomous agent UI testing and verification, dramatically reducing manual QA overhead.",
          },
          {
            id: "skill-trellis",
            type: "skill",
            title: "trellis (Task Planning & Structured Scaffold)",
            description:
              "Specification-driven task breakdown skill. Enforces structured task trees and validation checkpoints before touching code, preventing model hallucination and uncontrolled diffs.",
            tag: "Task Planning Skill",
            url: "https://github.com/mindfold-ai/Trellis",
            content: `# Install Trellis task scaffold via terminal:
npx skills add trellis`,
            curatorNote: "Essential scaffolding for multi-file refactoring that keeps agents disciplined and grounded.",
          },
          {
            id: "skill-frontend-design",
            type: "skill",
            title: "frontend-design (Anthropic Official Design Guidelines)",
            description:
              "Anthropic's official design skill for frontend craft. Directs models toward distinct visual hierarchy, typography pairing, curated color palettes, and deliberate whitespace to avoid generic AI aesthetics.",
            tag: "Frontend Design Skill",
            url: "https://github.com/anthropics/skills",
            content: `# Install Anthropic official frontend design guidelines:
npx skills add https://github.com/anthropics/skills --skill frontend-design`,
            curatorNote: "Internalized design leadership heuristics for building bespoke, high-craft web interfaces.",
          },
          {
            id: "skill-ui-ux-pro-max",
            type: "skill",
            title: "ui-ux-pro-max-skill (Production UI/UX Rules & Heuristics)",
            description:
              "Production-grade UI/UX rulebook covering design systems, 160+ curated palettes, and component patterns to elevate interfaces beyond generic templates.",
            tag: "UI/UX Heuristics Skill",
            url: "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill",
            content: `# Install UI/UX heuristics library with 50+ styles and 160+ color palettes:
npx skills add nextlevelbuilder/ui-ux-pro-max-skill`,
            curatorNote: "Comprehensive handbook of color theory, typography scale, and layout ergonomics.",
          },
        ],
      },
      {
        id: "step-requirements",
        stepNumber: "02",
        title: "Scope & Product Definition",
        subtitle: "Requirements & Scope Definition",
        tools: ["Perplexity", "NotebookLM", "Markdown PRD"],
        summary:
          "Avoid premature feature bloat. Define target users, core utility, and product boundaries to ship a razor-sharp MVP.",
        keyTakeaway:
          "Establish three principles before coding: 1) Clarify UI tone and aesthetics; 2) Defer databases in v1 to validate core loops fast; 3) Reuse battle-tested open-source libraries (e.g. yt-dlp) rather than writing custom parsers.",
        resources: [
          {
            id: "prompt-init-guardrail",
            type: "prompt",
            title: "Kickoff Guardrail (Scope & Human-in-the-Loop Protocol)",
            description:
              "Constrains the agent to propose solutions, wait for human confirmation, execute incrementally, self-test, and request review.",
            tag: "Project Kickoff",
            content: `You are a senior engineer building Universal Video Downloader.
Workflow: Propose solution → Await human sign-off → Step-by-step implementation → Self-test → Request acceptance.

## Scope & Requirements
1) Target Users: General users and creators who need to save/archive video content.
2) Core Utility: Cross-platform video retrieval with minimal manual friction.
3) Surface: Responsive Web app optimized for mobile and desktop viewports.
4) Feasibility: Build on top of yt-dlp.
5) Future: Summarization, transcript translation, monetization (prioritize core download loop first).

## Human Constraints
1) Frontend must highlight core value and subscription conversion clearly.
2) Backend required, but keep v1 stateless (no database yet).
3) Reuse open-source tooling (yt-dlp) rather than rewriting custom platform parsers.

## Guardrails
1) High UI craft; reference Apple.com for clarity and typography hierarchy.
2) Propose architecture choices and wait for confirmation before touching code.
3) Wrap yt-dlp cleanly; do not reinvent platform scrapers.`,
            curatorNote: "Enforce strict human-in-the-loop checkpoints to prevent runaway code changes and premature architectural complexity.",
          },
          {
            id: "site-bibigpt",
            type: "site",
            title: "BibiGPT & NoteGPT",
            description: "Benchmark AI video summarizer product used to evaluate feature differentiation.",
            tag: "Benchmarking",
            url: "https://bibigpt.co/",
            curatorNote: "Analyze how mature competitors organize split-screen information density, timestamp scrubbing, and conversion paths.",
          },
        ],
      },
      {
        id: "step-architecture",
        stepNumber: "03",
        title: "Architecture & Contracts",
        subtitle: "Architecture & Interface Specification",
        tools: ["FastAPI", "Uvicorn", "Architecture Diagram"],
        summary:
          "Decouple frontend and backend with mock APIs. Choose FastAPI for performance and developer velocity; enforce unified schemas for multi-agent workflows.",
        keyTakeaway:
          "Enforce 'one backend, multiple frontends'. Keep secrets and billing strictly on the server, and maintain strict, versioned API response contracts.",
        resources: [
          {
            id: "prompt-api-spec",
            type: "prompt",
            title: "API Contract & Security Guardrail Prompt",
            description: "Constrains agents to deterministic schema responses, CORS rules, and server-side authentication.",
            tag: "API Contract",
            content: `API Architecture Guidelines:

1) Maintain deterministic response structures, e.g.:
{
  "task_id": "abc",
  "status": "done",
  "summary": "...",
  "chapters": [{ "start": 155, "title": "Chapter 2" }]
}

2) Configure explicit CORS origins for decoupled frontend-backend setups.
3) Protect endpoints with standard authentication (Session/JWT, API Key, SSO, RBAC).
4) Keep private keys, secrets, and monetization logic strictly server-side.
Rule of thumb: One unified backend, multiple decoupled clients.`,
            curatorNote: "Anchor your agent with this API contract prompt before generating any new server endpoints.",
          },
        ],
      },
      {
        id: "step-ui-prototype",
        stepNumber: "04",
        title: "UI Prototype & Ergonomics",
        subtitle: "UI Prototype & High-Density UX",
        tools: ["Tailwind CSS", "Vue 3", "Responsive Grid"],
        summary:
          "Optimize for fewer clicks and higher information density. Craft real-time responsive split-screen layouts tailored for AI interactions.",
        keyTakeaway:
          "Progressive Disclosure: collapse decorative hero sections once results arrive, giving prime viewport real estate to core deliverables.",
        resources: [
          {
            id: "prompt-density-ux",
            type: "prompt",
            title: "Split-Screen Density & Auto-Trigger UX Prompt",
            description: "Guides agents to consolidate fragmented panels onto a single screen and automate next-action triggers.",
            tag: "UX Refinement",
            content: `You are optimizing the UX of Universal Video Downloader.
Download and summarization are functional. Review existing code and PRD first.

## Objective
Present video metadata and summary notes side-by-side on the same viewport.
Automatically initiate AI summary after video resolution completes, saving one click.

## Guardrails
Confirm ambiguous UX requirements before writing code. Commit modifications in small, atomic Git steps.`,
            curatorNote: "Pairs with responsive CSS grids: vertical stack on mobile, dual-column split on desktop.",
          },
        ],
      },
      {
        id: "step-development",
        stepNumber: "05",
        title: "Feature Build & Scaling",
        subtitle: "Iterative Engineering & Expansion",
        tools: ["yt-dlp", "Claude 3.7", "Git"],
        summary:
          "Execute disciplined incremental delivery: isolate agent runs with Git, spin up fresh context threads, and benchmark edge cases.",
        keyTakeaway:
          "Start fresh context threads for new features. Require agents to read existing documentation first to avoid regressing verified core paths.",
        resources: [
          {
            id: "prompt-expand-summary",
            type: "prompt",
            title: "Incremental Feature Expansion & Benchmarking Prompt",
            description: "Safely integrates LLM video summarization and chaptering without regressing core download reliability.",
            tag: "Feature Expansion",
            content: `You are expanding Universal Video Downloader.
Core download is stable. Before proposing edits, inspect current documentation and codebase.

## Goal
Add AI video summarization for rapid learning and content review.

## Context Sources
- @project-docs
- @current-codebase

## Tasks
Competitive analysis → Architecture RFC → Implementation

## Guardrails
1) Use Context7 and live search for up-to-date documentation; avoid deprecated APIs.
2) Prioritize additive, non-breaking modifications to the existing download pipeline.
3) Self-test end-to-end user journeys before requesting human review.`,
            curatorNote: "Use cost-effective models during prototype validation, and keep API keys strictly in environment variables.",
          },
        ],
      },
      {
        id: "step-data-storage",
        stepNumber: "06",
        title: "Persistence & Storage",
        subtitle: "Persistence, Storage & Cloudflare R2",
        tools: ["PostgreSQL", "Supabase", "Cloudflare R2", "Redis"],
        summary:
          "Evolve from a stateless MVP to Supabase for relational data/auth and Cloudflare R2 for zero-egress media object storage.",
        keyTakeaway:
          "Store only media URLs in your relational database. Offload heavy video files and assets to Cloudflare R2 for zero-egress bandwidth costs.",
        resources: [
          {
            id: "site-cloudflare-r2",
            type: "site",
            title: "Cloudflare R2 Object Storage",
            description: "High-performance S3-compatible object storage with 10 GB free monthly tier and zero egress bandwidth fees.",
            tag: "Object Storage",
            url: "https://www.cloudflare.com/developer-platform/r2/",
            curatorNote: "Best cost-saving infrastructure for global media delivery, complete with custom domain binding.",
          },
          {
            id: "site-supabase",
            type: "site",
            title: "Supabase Database & Auth",
            description: "Turnkey managed PostgreSQL with Row Level Security (RLS), instant Auth, and real-time subscriptions.",
            tag: "Database / Auth",
            url: "https://supabase.com/",
            curatorNote: "Eliminates database DevOps, replication overhead, and custom auth server maintenance.",
          },
        ],
      },
      {
        id: "step-monetization-deploy",
        stepNumber: "07",
        title: "Monetization & Deployment",
        subtitle: "Monetization (Stripe) & Docker Deployment",
        tools: ["Stripe", "Docker Compose", "Aliyun ECS", "Nginx"],
        summary:
          "Integrate global checkout via Stripe, process webhooks idempotently, and deploy via Docker Compose behind an Nginx reverse proxy.",
        keyTakeaway:
          "Stripe security checklist: Never expose secret keys client-side; verify webhook signatures in production; enforce entitlement state strictly from database truth.",
        relatedNoteHref: "/notes/aliyun-ecs-docker-deploy",
        relatedNoteLabel: "Read Note: Aliyun ECS + Docker Deployment",
        resources: [
          {
            id: "prompt-stripe-integration",
            type: "prompt",
            title: "Stripe Subscription Checkout & Webhook Security Prompt",
            description: "Guides agents to enforce payment security, webhook verification, and local stripe-listen debugging.",
            tag: "Payment Integration",
            content: `Integrate subscription billing for Universal Video Downloader.

Stack preference: Stripe.
Reference latest Stripe documentation via Context7.
Prioritize payment idempotency and security.
Guide developers through local webhook testing with stripe listen.
Handle essential events: checkout.session.completed, customer.subscription.updated/deleted, invoice.payment_failed.
Security mandate: Store secret keys exclusively in backend env; verify all incoming webhook signatures.`,
            curatorNote: "Test locally using `stripe listen --forward-to localhost:8000/webhook` before touching staging environments.",
          },
        ],
      },
    ],
  },
  {
    id: "spatial-design",
    title: "Computational Architecture",
    englishTitle: "Computational Architecture & Spatial Design",
    badge: "Spatial Research & Parametric Design",
    icon: "",
    summary:
      "An end-to-end design research pipeline: from multi-source geospatial data harvesting and parametric form generation to analytical drawings and portfolio publication.",
    coreStack: [
      "QGIS",
      "Rhino 8",
      "Grasshopper",
      "Midjourney",
      "V-Ray",
      "Photoshop",
      "InDesign",
    ],
    featuredNote: {
      title: "Between Destinations: Spatial Computation & London Mood Mapping",
      href: "/projects/thesis",
      readingTime: "Design Research",
    },
    steps: [
      {
        id: "step-site-analysis",
        stepNumber: "01",
        title: "Geospatial Data & Context",
        subtitle: "Site Context & Spatial Multi-Source Data",
        tools: ["QGIS", "Python", "OpenStreetMap", "Satellite Imagery"],
        summary:
          "Harvest building footprints, road networks, and topography via open GIS and vector maps to establish macro spatial frameworks.",
        keyTakeaway:
          "Leverage Overpass Turbo with Overpass QL queries to batch-extract clean GeoJSON and Shapefile vector geometries for any site bounding box.",
        relatedNoteHref: "/projects/thesis",
        relatedNoteLabel: "Read Case Study: Between Destinations · Spatial Computation",
        resources: [
          {
            id: "site-overpass-turbo",
            type: "site",
            title: "Overpass Turbo (OSM Extraction Engine)",
            description: "Web-based data filtering and extraction engine for OpenStreetMap vector geometries.",
            tag: "GIS / OpenData",
            url: "https://overpass-turbo.eu/",
            curatorNote: "Export precise building footprints, parcel boundaries, and street centerlines instantly with bounding box queries.",
          },
          {
            id: "prompt-urban-context",
            type: "prompt",
            title: "Urban Context & Zoning Morphology Analysis Prompt",
            description: "Analyzes urban historical evolution, pedestrian flow dynamics, and spatial conflicts.",
            tag: "Spatial Research",
            content: `You are a senior urban researcher and spatial planning strategist.
Based on the following geographic coordinates, historical background, and zoning typology, conduct a multi-scale spatial analysis:

1) Macro Positioning: Role within urban axes, transit networks, and ecological corridors;
2) Micro Morphology: Evaluation of block scale, building density, and pedestrian permeability;
3) Spatial Tensions: Existing traffic severance, public vitality voids, or access bottlenecks;
4) Design Interventions: 3 inspired, site-specific tactical spatial interventions.`,
            curatorNote: "Combine with satellite imagery and GIS raster layers for rigorous contextual research.",
          },
        ],
      },
      {
        id: "step-concept-ideation",
        stepNumber: "02",
        title: "Concept & Spatial Moodboard",
        subtitle: "Concept Ideation & Spatial Moodboard",
        tools: ["Midjourney", "Morpholio Trace", "Physical Sketch"],
        summary:
          "Explore light, materiality, and volumetric relationships through generative visual models and hand perspective sketches to converge design intent.",
        keyTakeaway:
          "Control architectural camera viewpoints (eye-level perspective, axonometric view) and material finishes precisely in generative prompts to avoid generic imagery.",
        resources: [
          {
            id: "prompt-mj-spatial",
            type: "prompt",
            title: "Spatial Atmosphere & Material Finish Generative Prompt",
            description: "Precise architectural camera perspective, soft ambient daylight, and tactile rammed-earth/timber materiality.",
            tag: "Generative Moodboard",
            content: `Architectural eye-level perspective photography of a contemporary public cultural pavilion, rammed earth and fair-faced concrete walls, large timber glazed curtain wall, warm diffused afternoon sunlight casting subtle soft shadows on travertine floor, minimalist spatial atmosphere, shot on Hasselblad 50mm, photorealistic, architectural digest editorial style --ar 16:9 --v 6.1 --style raw`,
            curatorNote: "Parameters like --style raw and --ar 16:9 maximize physical authenticity and documentary realism.",
          },
        ],
      },
      {
        id: "step-parametric-modeling",
        stepNumber: "03",
        title: "Parametric Logic & Modeling",
        subtitle: "Parametric Modeling & Computational Form",
        tools: ["Rhino 8", "Grasshopper", "LunchBox", "Ladybug"],
        summary:
          "Abstract spatial design into geometric and topological rule engines in Grasshopper to simulate daylighting performance and circulation.",
        keyTakeaway:
          "Maintain clean visual clustering and color annotations in Grasshopper canvas. Group primary sliders together for seamless multi-iteration benchmarking and material takeoffs.",
        resources: [
          {
            id: "skill-gh-solar",
            type: "skill",
            title: "Grasshopper Solar Microclimate & Louvre Optimization",
            description: "Ladybug Tools workflow for daylight factor computation and solar radiation heat analysis.",
            tag: "Computational Logic",
            content: `# Core Computational Workflow:
1. Import EPW climate data to calculate SunPath trajectories
2. Compute cumulative facade incident radiation over target seasons
3. Remap radiation matrix to louvre rotation angles (0° - 75°)
4. Generate holistic solar performance evaluation curves`,
            curatorNote: "Translates intuitive design concepts into quantifiable environmental metrics, elevating client presentations.",
          },
        ],
      },
      {
        id: "step-visualization",
        stepNumber: "04",
        title: "Rendering & Visual Storytelling",
        subtitle: "Rendering & Visual Storytelling",
        tools: ["V-Ray", "Enscape", "Adobe Photoshop", "Adobe Illustrator"],
        summary:
          "Move from clay spatial models to collage narratives. Harmonize tonal grading and linework while staging figures and vegetation for spatial vitality.",
        keyTakeaway:
          "Axonometric perspective sections remain the most compelling visual medium for articulating vertical circulation and tectonic construction details simultaneously.",
        resources: [
          {
            id: "site-nonscandinavia",
            type: "site",
            title: "Nonscandinavia (Scale Figures & Entourage Library)",
            description: "High-resolution cutout silhouettes and entourage figures representing global cultural diversity.",
            tag: "Rendering Asset",
            url: "https://www.nonscandinavia.com/",
            curatorNote: "Replaces monotonous scale figures with culturally rich, everyday human narratives that bring architecture to life.",
          },
        ],
      },
      {
        id: "step-portfolio-publishing",
        stepNumber: "05",
        title: "Curation & Monograph",
        subtitle: "Curation, Layout & Portfolio Publishing",
        tools: ["Adobe InDesign", "Figma", "Typography"],
        summary:
          "Synthesize design research, drawings, and theoretical discourse into a cohesive, publication-grade portfolio monograph.",
        keyTakeaway:
          "Deliberate negative space and typography pacing matter more than overcrowding the page. Keep captions concise and let drawings lead.",
        resources: [
          {
            id: "prompt-design-statement",
            type: "prompt",
            title: "Design Statement Academic Curation & Refinement Prompt",
            description: "Transforms raw design sketches and concept logs into a critically structured, publication-grade design statement.",
            tag: "Academic Curation",
            content: `You are a senior academic editor for top-tier architectural monographs and design journals.
Review and restructure the following project Design Statement:

Guidelines:
1) Precise, restrained prose avoiding hollow buzzwords; focus on tectonic assembly, spatial dialogue, and material tactility;
2) Provide a 120-word executive English Abstract alongside a concise summary;
3) Extract 3 curated architectural Keywords.`,
            curatorNote: "Perfect for refining exhibition panel narratives or opening statements in competitive monograph submissions.",
          },
        ],
      },
    ],
  },
];
