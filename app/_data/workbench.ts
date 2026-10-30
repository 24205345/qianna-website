import type { WorkflowPipeline } from "@/lib/workbench/types";

export const WORKBENCH_PIPELINES: WorkflowPipeline[] = [
  {
    id: "ai-development",
    title: "AI Product & Solo Dev",
    englishTitle: "AI Product & Solo Indie Development",
    badge: "AI Engineering & Indie Hacker",
    icon: "",
    summary:
      "A practical engineering loop from product definition and prototype validation to deployment, bounded AI execution, and enterprise platform operations.",
    coreStack: [
      "VS Code",
      "GitHub Copilot",
      "FastAPI",
      "Next.js",
      "Docker",
      "Stripe",
    ],
    featuredNote: {
      title: "【AI Dev Workflow · 01】 Environment & Infrastructure: A Practical Guide to Models, Agents & Guardrails",
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
        relatedNoteLabel: "Read Note: 【AI Dev Workflow · 01】 Environment & Infrastructure Setup",
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
        "id": "step-requirements",
        "stepNumber": "02",
        "title": "Scope & Product Definition",
        "subtitle": "Two Paths to Product Definition & MVP Scope",
        "tools": [
          "Problem Framing",
          "AI Dialogue",
          "MVP Scoping",
          "Markdown PRD"
        ],
        "summary": "Start with an outline or explore a vague idea through AI dialogue. Clarify the user and core task, examine evidence, and define a complete MVP journey with explicit scope and acceptance criteria.",
        "keyTakeaway": "Use Path A to review an existing outline or Path B to explore an unclear idea. Move between them as needed, then test assumptions and define the smallest complete journey that delivers value.",
        "relatedNoteHref": "/notes/scope-product-definition",
        "relatedNoteLabel": "Read Note: 【AI Dev Workflow · 02】 Scope & Product Definition",
        "resources": [
          {
            "id": "prompt-scope-outline-en",
            "type": "prompt",
            "title": "Review an Initial Outline",
            "description": "Fill in your users, problem, rough journey, evidence, and constraints. Ask AI to challenge the outline and define a testable MVP.",
            "tag": "Path A",
            "content": "You are a product adviser with experience in product analysis and software delivery.\nI have an initial outline. Help me review it, improve it, and define the scope of this version.\n\nProject and stage: [Name; new product or iteration]\nUser and situation: [Who will use it and when]\nCore problem and current approach: [How the task is handled now and what is difficult]\nDesired outcome: [What the user should complete or receive]\nInitial journey and candidate features: [Paste my outline]\nEvidence and materials: [Feedback, observations, research, competitor links, or other materials]\nKnown constraints: [Time, budget, business, data, or operating conditions]\nFor an iteration: [Current behavior, proposed changes, and capabilities to preserve]\n\nPlease:\n1. Restate your understanding of the user, core task, and value. Examine gaps and contradictions.\n2. Distinguish facts, interpretations, and hypotheses. Identify the assumptions that most affect the direction.\n3. Research specific questions where necessary, explaining which findings affect scope.\n4. Define the shortest complete user journey. Divide features into required now, future candidates, and out of scope for now, with reasons.\n5. Write a short PRD with main exceptions, acceptance criteria, and a plan to validate user value.\n6. List questions for the subsequent design and architecture stage.\n\nWorking agreements:\n- Challenge my outline where appropriate. Identify what could be simplified, changed, or dropped.\n- Do not automatically turn candidate features or competitor features into current requirements.\n- If missing information would materially change the user, core value, or scope, ask up to five focused questions first and wait for my answers before settling the affected conclusions.\n- For other uncertainties, state provisional assumptions and continue the parts that can be completed independently.\n- Give sources and checking dates for external research. Mark unverifiable claims for checking; do not invent feedback or data.\n- This task is product definition. Leave detailed technical design and coding for a later stage.\n\nOrganize the output as project understanding and key questions, evidence and assumptions, core journey, scope decisions, a short PRD, and validation and handoff.",
            "curatorNote": "Use when you already have an initial framework. Candidate features remain open to challenge; important gaps should be clarified before settling scope."
          },
          {
            "id": "prompt-scope-explore-en",
            "type": "prompt",
            "title": "Explore a Vague Idea",
            "description": "Start with a rough thought or actual experience. Ask AI one to three questions at a time and compare possible directions before writing requirements.",
            "tag": "Path B",
            "content": "Act as a product exploration partner. Help me gradually clarify what I want to build through a conversation.\nMy idea is still vague. I cannot yet fully define the target user, product form, or features.\n\nCurrent idea or interest: [Describe it in your own words; fragments are fine]\nRelated experience or observation: [A recent difficulty, a work problem, or something you noticed]\nDesired change: [What you hope would become different for yourself or others]\nKnown conditions or preferences: [Fill in what you know, or leave blank]\n\nPlease work with me as follows:\n1. Briefly restate your understanding, then ask only one to three useful questions per turn. Wait for my answers before continuing.\n2. Explore specific experiences, current approaches, difficulties, and desired outcomes. Offer accessible examples when they would help me explain.\n3. Once there is enough context, suggest two or three possible directions. Explain whom each serves, which problem it addresses, and what still needs testing, so I can compare them and respond.\n4. After discussing a topic, briefly summarize what is clear, where we disagree, and provisional assumptions. Let me revise or reject them.\n5. Once we can provisionally describe the user, situation, problem, and desired outcome, prepare a one-page exploration summary. Check that it represents my intention before moving into research and MVP scope.\n\nWorking agreements:\n- Do not begin by asking me to complete a full requirements form or by producing a complete PRD or feature list.\n- Do not present your suggestions as my decisions. Do not invent user needs or market validation.\n- Allow the direction to narrow, change, or be postponed. Mention existing tools if they may already meet the need.\n- Research specific external questions when necessary and give sources. Clearly mark information you cannot verify.\n- Focus on the problem and value at this stage. Leave detailed technology choices and coding for later.\n\nUse my starting information to ask the first round of questions.",
            "curatorNote": "Use when the user, problem, or product form is unclear. You can leave fields blank. Move to scope definition once a provisional scenario and desired outcome are clear."
          },
          {
            "id": "template-scope-prd-en",
            "type": "prompt",
            "title": "Short Product Brief Template",
            "description": "Record the problem, evidence, core journey, scope, acceptance criteria, validation plan, and open decisions in one short document.",
            "tag": "PRD Template",
            "content": "Product or iteration name\n\nBackground and problem\nTarget user:\nTriggering situation:\nCurrent approach and main difficulty:\nEvidence and sources:\n\nCurrent goal\nCore task the user should complete:\nMost important hypothesis to test:\n\nCore journey\nStarting input, main steps, and resulting outcome:\n\nScope and tradeoffs\nIncluded in this version:\nExcluded from this version:\nReasons for exclusion and conditions for reconsideration:\n\nCore requirements and acceptance\nTriggers, inputs, and outputs:\nNormal journey and main exceptions:\nAcceptance criteria and representative examples:\n\nKnown constraints\nRelevant business, data, time, cost, or operating limits:\nConfirmed conditions and provisional assumptions:\n\nValidation plan\nBehavior or feedback to observe:\nHow to test it:\nResults that would lead to continuing, changing, or stopping:\n\nOpen questions\nQuestions that affect scope:\nQuestions for design and development:\n\nDecision log\nWhat changed, why, and which journeys or criteria it affects:",
            "curatorNote": "Use after either starting path has produced a working outline. Separate intended outcomes from evidence, and update the brief when scope changes."
          },
          {
            "id": "skill-scope-doc-coauthoring",
            "type": "skill",
            "title": "doc-coauthoring (Anthropic)",
            "tag": "PRD Writing Skill",
            "description": "Gather context, refine a product brief, and check whether a fresh reader can understand the scope and acceptance criteria.",
            "url": "https://github.com/anthropics/skills/blob/main/skills/doc-coauthoring/SKILL.md",
            "content": "npx skills add https://github.com/anthropics/skills --skill doc-coauthoring",
            "curatorNote": "Useful once notes or an outline exist. For a vague idea, begin with Path B. Use a fresh conversation to uncover missing context in the draft."
          },
          {
            "id": "prompt-scope-research-en",
            "type": "prompt",
            "title": "Research Alternatives & Evidence",
            "tag": "Evidence & Research",
            "description": "Compare up to three existing approaches, check sources, and connect evidence to an explicit scope decision.",
            "content": "Research existing ways to solve the product problem below and help me decide the scope of this version.\n\nUser, situation, and task: [Fill in]\nCurrent approach and difficulty: [Fill in; mark unknowns]\nQuestions or assumptions to investigate: [List one to three]\nCandidate approaches or sources: [Links or material; leave blank if none]\nKnown constraints and scope decision: [Fill in]\n\nPlease:\n1. Compare at most three relevant approaches, including suitable manual methods or general-purpose tools. Explain how each completes the same task.\n2. Record main steps, input requirements, outputs, limits, and implications for the user. Distinguish actual testing, documentation claims, and interpretation.\n3. Give original source links and checking dates for facts that affect the decision. Mark inaccessible or unverifiable information as unknown; do not pretend to have tested a product.\n4. Separate observed facts, interpretations, and hypotheses. Explain which evidence supports or challenges my idea.\n5. Recommend continuing, simplifying, using an existing approach, or postponing. Explain which scope decisions would change and the smallest next validation action.\n\nUse available web research capabilities. Without web access, analyze only the supplied material and list what remains to check.\nDo not invent interviews, user counts, or market data, or automatically turn competitor features into current requirements.\nOutput a comparison, evidence gaps, and recommended tradeoffs. Leave detailed technical design and coding for later.",
            "curatorNote": "Include suitable manual approaches and general-purpose tools. Separate facts, interpretations, and hypotheses; record what remains unknown."
          },
          {
            "id": "prompt-scope-review-en",
            "type": "prompt",
            "title": "Review a Product Brief",
            "tag": "PRD Review",
            "description": "Review a draft for scope gaps, unsupported assumptions, acceptance criteria, and a usable plan to validate user value.",
            "content": "Act as a product reviewer encountering this project for the first time. Review the product definition below.\nJudge only from the supplied material and explicitly mark missing information as unknown.\n\nProduct definition: [Paste the PRD]\nSupporting evidence or appendices: [Paste or link; state if none]\nTime and resource limits for this version: [Fill in; leave blank if unknown]\n\nCheck:\n1. Whether the user, triggering situation, core problem, and desired outcome are specific and consistent.\n2. Whether the MVP forms a complete journey, what could be simplified or deferred, and whether exclusions break the core task.\n3. Which conclusions lack evidence or present hypotheses as facts.\n4. Whether core requirements include executable acceptance criteria, representative examples, and main failure cases.\n5. Whether the validation plan tests user value, with clear conditions for continuing, changing, or stopping.\n6. Whether someone without the earlier conversation can understand the scope and proceed to design.\n\nFor each issue, give its location, specific problem, impact, suggested change, and whether it blocks the next stage.\nSeparate direction-changing gaps from improvements that can wait. Do not mark an item as passed without sufficient evidence.\nAsk at most five key questions about blockers. Do not invent decisions or expand scope on my behalf.\nFinish by judging readiness for the next stage and listing issues that must be resolved first.",
            "curatorNote": "Paste the PRD into a fresh conversation. Resolve direction-changing blockers before handoff, while keeping later improvements visible."
          }
        ]
      },
      {
        "id": "step-architecture",
        "stepNumber": "03",
        "title": "Architecture & Contracts",
        "subtitle": "Product Constraints, Architecture & Interface Contracts",
        "tools": [
          "Architecture Decisions",
          "Data Flow",
          "API Contracts",
          "Mock Validation"
        ],
        "summary": "Translate product requirements into a justified architecture and explicit contracts. Compare technology choices, verify AI proposals, and define data, permissions, and failure behavior before implementation.",
        "keyTakeaway": "Treat AI proposals as candidates. Check platform and toolchain claims, test direction-changing risks, and keep requirements, contracts, mocks, and decisions aligned.",
        "relatedNoteHref": "/notes/architecture-contracts",
        "relatedNoteLabel": "Read Note: 【AI Dev Workflow · 03】 Architecture & Contracts",
        "resources": [
          {
            "id": "prompt-architecture-options-en",
            "type": "prompt",
            "title": "Compare Architecture & Stack Options",
            "tag": "Architecture Selection",
            "description": "Compare up to three approaches against product constraints, existing capabilities, evidence, and maintenance costs.",
            "content": "Compare the architecture and technology choices needed for this stage of the product.\n\nProduct definition and core journey: [Paste the PRD or summary]\nTarget platforms and initial scope: [Web, Mini Program, App, or other]\nExisting product and technical experience: [Codebase, familiar languages, and tools]\nConstraints and measured results: [Time, budget, data, duration, and deployment conditions]\nQuestions to investigate: [Important uncertainties]\n\nPlease:\n1. Extract architecturally significant conditions, separating confirmed requirements, provisional targets, and hypotheses.\n2. Compare at most three feasible options, including suitable existing capabilities. Explain the requirements each meets, development and maintenance costs, and conditions that make it unsuitable.\n3. Distinguish client, server, storage, managed services, and development tools. Explain responsibilities and how they combine.\n4. Give official sources and checking dates for version compatibility, platform capabilities, and tooling limits. Mark unknowns and do not pretend to have run experiments.\n5. Propose the smallest experiment for the risks most likely to change the direction, including inputs, observations, and decision conditions.\n6. Make a conditional recommendation with reasons and triggers for reconsideration, rather than only a list of technologies.\n\nYou may challenge the initial recommendation. Fit the product and existing capabilities; do not default to separate frontend and backend, microservices, a particular framework, or a database.\nIf missing conditions could change the direction, ask at most five key questions and wait for answers before settling affected conclusions.\nProduce an architecture draft at this stage; do not generate a complete project or begin a large refactor.",
            "curatorNote": "Check official documentation for platform and toolchain claims. Keep recommendations conditional until critical experiments are complete."
          },
          {
            "id": "prompt-architecture-contract-en",
            "type": "prompt",
            "title": "Draft an Interaction Contract",
            "tag": "Interface Contract",
            "description": "Define inputs, outputs, states, errors, permissions, and retry behavior for APIs, functions, events, or tasks.",
            "content": "Draft actionable interaction contracts for the core journey using the chosen approach.\n\nProduct definition and acceptance criteria: [Paste]\nResponsibilities and core journey: [Paste]\nConfirmed technical choices and constraints: [Fill in]\nBoundary to coordinate: [HTTP API, function, event, or task]\n\nOutput:\n1. Each interaction's caller, trigger, input and output, field types, required and null rules, units, and legal states.\n2. Normal, boundary, and failure examples, with error codes, user-facing meaning, waiting budgets, and retry behavior.\n3. Where identity and resource permissions are checked, repeated-operation semantics, and state that needs retention.\n4. A contract draft matching the boundary, such as OpenAPI, types, or an event schema, with a validation approach.\n5. Meaning, compatibility requirements, and open questions that examples still leave unresolved.\n\nMatch the current product scope. Do not introduce accounts, payments, queues, or persistence without a requirement.\nCheck structural validity separately from business correctness. Do not treat one successful example as a complete schema.\nAsk key questions first when gaps change core behavior; label other assumptions.\nKeep success results, errors, mocks, and acceptance criteria consistent. Do not implement business code yet.",
            "curatorNote": "A successful JSON example is only one case. Align the contract, validation, mocks, and acceptance criteria."
          },
          {
            "id": "prompt-architecture-review-en",
            "type": "prompt",
            "title": "Review Architecture & Contracts",
            "tag": "Architecture Review",
            "description": "Check responsibilities, technology choices, contracts, and completed experiments against the current product definition.",
            "content": "As a reviewer who did not participate in earlier discussions, assess whether the architecture and contracts can support this version of the product.\n\nProduct definition and acceptance criteria: [Paste]\nResponsibilities, core journey, and technology decisions: [Paste]\nContracts, mock examples, and completed experiments: [Paste or link]\nOpen questions: [Fill in]\n\nCheck:\n1. Whether each core requirement has an owner and important data and states can be traced through the journey.\n2. Whether technology choices fit the platforms, existing capabilities, and constraints, including any unjustified complexity.\n3. Whether contracts cover inputs, outputs, nulls, states, errors, permissions, waiting, repeated operations, and required compatibility.\n4. Whether documents, examples, mocks, and acceptance agree, with structural validation separated from business quality.\n5. Whether AI claims about versions and capabilities have sources or experiment results, and whether unknowns have been presented as conclusions.\n6. Which issues block the next stage and which can proceed with an explicit validation plan.\n\nFor each issue, provide its location, specific problem, impact, recommended action, and whether it blocks progress.\nDo not invent test results or expand scope. Ask at most five questions needing a decision and finish with a conditional handoff judgment.",
            "curatorNote": "Use a fresh conversation. Separate blockers from assumptions that can proceed with an explicit validation plan."
          },
          {
            "id": "site-architecture-c4",
            "type": "site",
            "title": "C4 Model: Context & Container Diagrams",
            "tag": "Architecture Diagrams",
            "description": "Describe the system, its users, external dependencies, and runtime boundaries at a useful level of detail.",
            "url": "https://c4model.com/diagrams",
            "curatorNote": "Choose diagrams that explain current decisions. A C4 container is not specifically a Docker container."
          },
          {
            "id": "site-architecture-openapi",
            "type": "site",
            "title": "OpenAPI: Describe HTTP Interfaces",
            "tag": "API Specification",
            "description": "Use a machine-readable description for HTTP operations, inputs, outputs, and examples.",
            "url": "https://learn.openapis.org/specification/structure.html",
            "curatorNote": "Use a specification version supported by your tools. Internal functions and events may need different contract formats."
          },
          {
            "id": "site-architecture-msw",
            "type": "site",
            "title": "MSW: Mock Network Interactions",
            "tag": "Contract Mocks",
            "description": "Simulate agreed network responses in browser and Node.js development and validation workflows.",
            "url": "https://mswjs.io/docs/",
            "curatorNote": "Include failure cases. Check real integrations separately, and verify platform compatibility before adopting a mocking tool."
          }
        ]
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
        relatedNoteLabel: "Read Note: 【AI Dev Workflow · 07】 Aliyun ECS + Docker Deployment",
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
      {
        id: "step-enterprise-production",
        stepNumber: "08",
        title: "From Demo to Team Platform",
        subtitle: "An Upgrade Map & One Video Case",
        tools: ["Access Control", "Background Jobs", "Streaming", "Monitoring"],
        summary:
          "Use six everyday questions to understand the move from a personal demo to a shared platform. Follow one video-summary tool through permissions, background jobs, faster results, more users, recovery, and ongoing operations.",
        keyTakeaway:
          "Start with a real user problem, learn the concept it calls for, and give a coding agent one concrete upgrade with observable acceptance checks. Build the next capability when users need it.",
        relatedNoteHref: "/notes/enterprise-ai-production",
        relatedNoteLabel: "Read Note: 【AI Dev Workflow · 08】 From Personal Demo to Enterprise Platform",
        resources: [
          {
            id: "prompt-enterprise-readiness",
            type: "prompt",
            title: "Plan and Implement One Platform Upgrade",
            description:
              "Find gaps using the six-part map, then implement one selected improvement with concrete acceptance checks.",
            tag: "Upgrade Task",
            content: `Help me gradually upgrade this personal AI demo into a platform a team can use.

Project and core flow: <project directory, input, processing, output>
Current users: <myself / colleagues / multiple teams / enterprise customers>
Current user problem: <for example: closing the tab loses a long-video task>
Upgrade for this task: <continue in the background; reopen to see status and results>
Data and permission boundaries: <who can access videos, transcripts and summaries; team boundaries>
Budget and constraints: <existing stack, hosting, cost, maintenance capacity>

Inspect the actual code first and explain the current flow in plain language.
Locate gaps across six areas: identity and permissions, background tasks,
response speed, multiple users, failure recovery, and quality and operations.
Separate existing capabilities, missing capabilities, and unknowns.
Explain priorities for the current users; implement only the selected upgrade here.

Propose the smallest useful design and explain the concepts it needs.
Prefer the existing stack; justify new components, alternatives, and maintenance cost.
Implement code and necessary configuration within current authorization,
and check the normal flow and relevant failure paths.
Follow the project's existing authorization requirements for external publishing
or irreversible actions.

Acceptance must address the problem: for example, work survives closing the page,
progress is available on return, registered tasks survive a service restart,
and repeated submission does not repeat the business effect.
For speed improvements, compare first useful output, full completion, cost, and quality.
Do not treat generated code or an unexecuted test plan as verified results.
Report what changed, what you actually verified, and what remains unverified.`,
            curatorNote:
              "Fill in the actual user problem and select one upgrade. Review the changes and verification evidence before choosing the next.",
          },
          {
            id: "site-production-agent-patterns",
            type: "site",
            title: "Anthropic: Building Effective Agents",
            description:
              "Further reading on when a simple model call, workflow, or agent fits the task.",
            tag: "Further Reading",
            url: "https://www.anthropic.com/research/building-effective-agents",
            curatorNote:
              "A shared platform can start simply. Add complexity for an observed need and check whether it helps.",
          },
          {
            id: "site-production-retry-design",
            type: "site",
            title: "AWS: Timeouts, Retries & Backoff with Jitter",
            description:
              "Understand why temporary failures need limited retries and why a timeout can leave an uncertain result.",
            tag: "Reliability",
            url: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
            curatorNote:
              "Useful for the recovery branch: save progress and avoid repeating an external effect.",
          },
          {
            id: "site-production-agent-evals",
            type: "site",
            title: "Anthropic: Demystifying Evals for AI Agents",
            description:
              "Learn to check whether a changed model or prompt makes the product better.",
            tag: "Quality Checks",
            url: "https://www.anthropic.com/research/demystifying-evals-for-ai-agents",
            curatorNote:
              "Begin with representative inputs and specific checks, such as coverage, correct numbers, and valid timestamps.",
          },
          {
            id: "site-production-prompt-injection",
            type: "site",
            title: "OWASP: Prompt Injection",
            description:
              "Learn why text in a video or document must not grant the system extra permissions.",
            tag: "Permissions & Safety",
            url: "https://genai.owasp.org/llmrisk/llm01-prompt-injection/",
            curatorNote:
              "Apply access rules in the server and data layer, including generated summaries and download links.",
          },
          {
            id: "site-production-queue-backlogs",
            type: "site",
            title: "AWS: Avoiding Queue Backlogs",
            description:
              "Understand how waiting work grows when submissions exceed available processing capacity.",
            tag: "Queues & More Users",
            url: "https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/",
            curatorNote:
              "A queue organizes work. Fair scheduling and limits help one long task avoid crowding out everyone else.",
          },
          {
            id: "site-production-media-segments",
            type: "site",
            title: "FFmpeg: Segment Muxer",
            description:
              "Implementation reference for splitting media after you have defined the long-video workflow.",
            tag: "Advanced: Media Segments",
            url: "https://ffmpeg.org/ffmpeg-formats.html#segment",
            curatorNote:
              "Keep original time positions and handle boundaries. Cutting media and organizing chapters are separate jobs.",
          },
          {
            id: "site-production-persistence",
            type: "site",
            title: "LangGraph: Persistence",
            description:
              "One framework example of saving execution progress for later recovery.",
            tag: "Advanced: Saved Progress",
            url: "https://docs.langchain.com/oss/python/langgraph/persistence",
            curatorNote:
              "Understand the recovery concept first. This framework is optional; saved progress alone does not prevent duplicate external actions.",
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
