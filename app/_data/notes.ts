export interface NoteListItem {
  slug: string;
  /** Display title for list/home (English-first). */
  title: string;
  /** Display excerpt for list/home (English-first). */
  excerpt: string;
  publishedAt: string | null;
  tags: string[];
}

export interface NoteDetail extends NoteListItem {
  titleZh: string;
  titleEn: string;
  excerptZh: string;
  excerptEn: string;
  bodyMarkdownZh: string;
  bodyMarkdownEn: string;
  coverImageUrl: string | null;
}

/** Static fallback when Supabase is unavailable or for local notes. */
export const fallbackNotes: NoteDetail[] = [
  {
    slug: "ai-infrastructure-coding-agents-and-models",
    title:
      "Environment & Infrastructure: A Practical Guide to Models, Agents & Guardrails",
    excerpt:
      "A calm, practical guide (updated September 21, 2026) for setting up an AI engineering stack. Compares mainstream models (Claude Sonnet / Fable, GPT Sol / Astra, Gemini 3.8, DeepSeek-V4, Qwen3.8, Kimi K3), evaluates leading coding agents (Cursor, Trae, Copilot, Claude Code, Cline, Kiro), and establishes foundational workflow guardrails.",
    publishedAt: "2026-09-21T08:00:00.000Z",
    tags: [
      "Environment & Infrastructure",
      "Developer Guide",
      "AI Engineering",
      "Agent Skills",
      "Agent Harness",
      "Coding Agents",
      "LLM Benchmarks",
      "Domestic & Global AI",
    ],
    titleEn:
      "Environment & Infrastructure: A Practical Guide to Models, Agents & Guardrails",
    titleZh:
      "基建与环境准备：大模型、Coding Agent 与环境配置实践指南",
    excerptEn:
      "A practical guide for solo AI developers (updated September 21, 2026). Compares mainstream models and coding agents, covering frictionless billing, practical MCP & Skills ecosystems, and harness guardrails before writing code.",
    excerptZh:
      "AI 独立开发基建与环境准备指南（更新于 2026 年 9 月 21 日）。客观对比主流大模型与 Coding Agent 选型，梳理便捷结算方案、实用 MCP 与 Skills 生态，并在动手编码前立好工程规约。",
    coverImageUrl: null,
    bodyMarkdownEn: `> 💡 **Time-Sensitivity & Context (Written: September 21, 2026)**  
> AI tooling evolves rapidly. Many earlier tutorials reference outdated model releases, while developers often face friction with overseas proxies and credit card verification. This note outlines a calm, practical foundation: selecting reliable models, choosing a comfortable coding agent, and setting up guardrails before writing code.

---

## 1. Why Configure Both Node.js and Python?

When setting up a modern AI engineering stack, configuring both runtimes provides a clean separation of concerns:

- **Node.js (Frontend & Tooling Host)**: Handles user interfaces (React, Next.js), frontend build tooling, and hosts Model Context Protocol (MCP) servers that connect external documentation and browser automation to your AI.
\`\`\`bash
node -v # Check installation (v20+ LTS recommended)
npm -v
\`\`\`
- **Python (Backend Logic & Model Orchestration)**: Dispatches calls to LLM APIs (DeepSeek, Claude, OpenAI), manages database logic, and processes analytical workflows behind clean JSON contracts.
\`\`\`bash
python --version # Check installation (3.11+ recommended)
pip --version
\`\`\`

Keeping UI rendering and backend cognitive computation isolated ensures that changing visual styles never disrupts backend model pipelines.

---

## 2. Mainstream Foundation Models: Overview & Selection

Different models excel at distinct tasks—some specialize in multi-file refactoring, while others offer vast context windows or friction-free local payment. Here is an objective comparison of mainstream options:

### Mainstream Model Comparison

| Model Family | Key Strengths & Typical Scenarios | Cost Reference |
| :--- | :--- | :--- |
| **Claude (Sonnet / Fable 5.1)** (Anthropic) | High logical rigor, dependable instruction-following, and excellent multi-file refactoring. Sonnet is the balanced daily workhorse, while Fable handles long-horizon autonomous tasks. | Pay-per-token API (approx. $3-$15/M tokens) or $20/month subscription. |
| **GPT (GPT-5.6 Sol / GPT-6 Astra)** (OpenAI) | Broad generalist capabilities and fast response times. Sol is a popular everyday coding driver; Astra adds browser and computer-use automation with a 1M context window. | Pay-per-token API or $20/month Plus/Pro subscription. |
| **Gemini (Gemini 3.8 Flash / Pro)** (Google) | Vast native context window (2M tokens) with configurable reasoning depth. Excels at analyzing entire repositories or multi-modal specs in one shot. | Generous free tier via Google AI Studio; low pay-per-token API pricing. |
| **DeepSeek (V4-Pro / V4.1)** (DeepSeek) | High-quality coding intelligence comparable to frontier models, with minimal hallucinations and high accuracy on standard engineering tasks. | Extremely low cost (approx. $0.14-$0.28/M tokens; a few dollars cover extensive usage). |
| **Qwen (Qwen3.8-Max / 27B)** (Alibaba) | Strong bilingual comprehension. The 27B open weights can run completely offline on consumer GPUs (e.g. RTX 4090 or Mac Studio) with zero data leak risks. | Inexpensive cloud API with free trial quotas; $0 running cost when self-hosting open weights. |
| **Kimi (K3 / K2.7 Code)** (Moonshot AI) | High-capacity context (1M tokens) with strong PRD comprehension. Maintains reliable instruction tracking across multi-turn exchanges without degradation. | Inexpensive pay-per-token pricing with free initial trial balance. |
| **GLM (GLM-5.3 / CodeGeeX)** (Zhipu AI) | High throughput speed, tailored for Chinese developer workflows. Offers rapid inline completions and bilingual documentation generation. | Free tier available for basic models; low-cost commercial API. |

---

## 3. Mainstream Coding Agents: Comparison & Practical Pairings

After selecting your model brains, you need a comfortable editor to interface with them. Coding agents range from dedicated AI-native IDEs and official plugins to autonomous terminal tools:

### Mainstream Coding Agent Comparison

| Coding Agent / Tool | Key Strengths & Typical Scenarios | Cost Reference |
| :--- | :--- | :--- |
| **Cursor** | Benchmark AI-native IDE with polished ergonomics. Features instant Tab multi-line predictions and fluid multi-file Composer editing for day-to-day coding velocity. | Free basic tier; Pro subscription is $20/month. |
| **Trae** (ByteDance) | Turnkey AI-native IDE built on standard VS Code ergonomics. Direct connection without proxy hurdles; offers native workspace generation and chat editing. | Free trial access; simple domestic account sign-in. |
| **VS Code + GitHub Copilot** | Official Microsoft & GitHub integration. Dependable inline code completion, stable model toggling, and reliable billing with domestic dual-currency credit cards. | $10/month for individual developers. |
| **Claude Code** (Anthropic) | Anthropic's official terminal CLI agent. Excels at autonomous repo-wide refactoring, running shell commands, executing test suites, and handling Git workflows via natural language. | Tool is free & open; billed per actual Claude API token usage. |
| **VS Code + Cline / Roo Code** | Highly autonomous open-source agent extension. Pure BYOK (Bring Your Own Key) architecture; connects flexibly to DeepSeek, Qwen, or global APIs with full transparency. | Extension is 100% free; users pay only for consumed API tokens. |
| **Kiro** (AWS) | AWS's spec-driven agentic coding platform & IDE. Focuses on formalizing task specs and architecture plans before autonomous agent execution, with multi-step test verification and native MCP support. | Free preview/tier available; AWS account integration with usage-based billing. |

### Practical Stacks & Pairing Advice:
- **Turnkey & Zero-Friction**: Start with **Trae** for an immediate, zero-configuration start without proxy or billing setup.
- **High Autonomy & Cost Efficiency**: Pair **VS Code + Cline** with **DeepSeek-V4** or **Qwen3.8** via domestic APIs (WeChat/Alipay), giving you full agentic multi-file capabilities with minimal expenditure.
- **Reliable Paid Official Stack**: Choose **VS Code + GitHub Copilot** if you prefer a hassle-free monthly subscription supported reliably by domestic dual-currency credit cards.
- **Deep Architecture & Spec-Driven Workflows**: Use **Cursor** for top-tier GUI editing speed, or **Kiro** for spec-driven engineering; use **Claude Code** paired with **Claude (Sonnet / Fable)** for autonomous terminal-driven refactoring.

---

## 4. Extending External Tooling: MCP Tools

Foundation models are confined to their training context—they cannot inspect documentation published this morning or directly access your databases. The [Model Context Protocol (MCP)](https://modelcontextprotocol.io) provides a universal, open-source standard for connecting external tools and live data sources to your AI.

In plain terms: MCP acts as the AI's "**hands and eyes**," solving the question of "**Can it do it?**"—granting the model the ability to scrape web pages, query databases, and execute system commands, providing fresh data "ingredients" for coding.

### Recommended MCP Tools

1. **[Context7 MCP](https://context7.com/) (Live Official Docs)**: Injects live, version-accurate documentation so models avoid deprecated APIs.
2. **[Firecrawl MCP](https://www.firecrawl.dev/) (Web Cleaner)**: Scrapes arbitrary technical docs or GitHub repositories and converts them into pristine Markdown for model context.
3. **[Playwright MCP](https://playwright.dev/) (Browser Automation)**: Enables the agent to launch a browser, automate clicks, and take screenshots for visual layout verification. *(Note: Several modern coding agents like Trae and Cursor now integrate native browser previews, making an external Playwright MCP optional in those setups).*

**Discovering MCPs for Your Stack**: The [Model Context Protocol (MCP)](https://modelcontextprotocol.io) ecosystem is open and modular. Depending on your tech stack, you can plug in [Supabase MCP](https://supabase.com/docs/guides/ai/mcp) for instant database schema queries, [GitHub MCP](https://github.com/github/github-mcp-server) for pull request management, or custom enterprise services—connecting tools on demand without bloating your environment.

---

## 5. Injecting Domain Craftsmanship: Agent Skills Ecosystem

If MCP gives your AI the hands and eyes to gather data (solving "Can it do it?"), **Agent Skills** provide the structured methodology and engineering playbooks—serving as the AI's "**Standard Operating Manual**."

In plain terms: Skills act as the AI's "**expert recipe book**," solving the question of "**How well is it done?**"—preventing the model from improvising uncontrolled, messy architectures or generic, cookie-cutter UI templates.

### Recommended Agent Skills

Using \`npx skills add\` and the open-source registry [The Agent Skills Directory](https://www.skills.sh/), you can inject battle-tested design and architectural heuristics into your environment with a single command. The following three packages are recommended as your initial foundation:

1. **[\`trellis\`](https://github.com/mindfold-ai/Trellis) (Structured Task Scaffold)**: Enforces disciplined planning before coding. The agent outlines a step-by-step task tree and validates each milestone before advancing, preventing chaotic multi-file mistakes. Official repo: [mindfold-ai/Trellis](https://github.com/mindfold-ai/Trellis) (site: [trytrellis.app](https://trytrellis.app/)).
   \`\`\`bash
   npx skills add trellis
   \`\`\`

2. **[\`frontend-design\`](https://github.com/anthropics/skills) (Anthropic Design Philosophy)**: Authored by [Anthropic](https://github.com/anthropics/skills) to cure "AI slop." It guides the model to adopt a Design Lead's mindset: crafting bespoke typography, cohesive CSS variable palettes, balanced whitespace, and subtle micro-interactions.
   \`\`\`bash
   npx skills add https://github.com/anthropics/skills --skill frontend-design
   \`\`\`

3. **[\`ui-ux-pro-max-skill\`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (UI/UX Best Practices)**: An open-source knowledge base ([nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)) of design styles, color palettes, and component guidelines across React, Next.js, and Tailwind to give generated interfaces a refined, professional finish.
   \`\`\`bash
   npx skills add nextlevelbuilder/ui-ux-pro-max-skill
   \`\`\`

**Discovering Skills for Your Stack**: Beyond these foundational sets, [The Agent Skills Directory](https://www.skills.sh/) aggregates a vast collection of community skills spanning testing, state management, and backend optimizations. Explore the directory and plug in new capabilities whenever your workflow calls for them.

---

## 6. Establishing Ground Rules: The Agent Harness

Once your runtimes, models, IDE, and skills are in place, **Step 01: Environment & Infrastructure** is complete.

Before writing feature code, establish clear constraints in a \`.cursorrules\` or \`AGENTS.md\` file:
1. Limit code changes strictly to the task scope;
2. Require the model to present an execution plan for review before modifying files;
3. Adhere to the established repository design tokens and avoid unapproved dependencies.

Detailed implementation workflows—from product scoping (Step 02) and API contracts (Step 03) to iterative debugging (Steps 04 & 05) and deployment (Step 06)—will be unpacked step-by-step in the subsequent chapters.
`,
    bodyMarkdownZh: `> 💡 **时效性与写作背景（更新日期：2026 年 9 月 21 日）**  
> AI 工具迭代迅速，网上的很多早期经验容易过时，国内开发者也常常在网络代理与外币卡结算环节遇到阻碍。这篇笔记整理了一套务实平缓的配置路径：选好顺手的大模型、配好编辑器、并在动工前立好工程护栏。

---

## 1. 为什么需要同时配置 Node.js 与 Python？

搭建现代 AI 开发环境时，同时准备这两种运行环境并不是冗余，而是清晰的职责划分：

- **Node.js（前端呈现与工具宿主）**：负责运行前端框架（React、Next.js）、前端构建工具，同时作为 Model Context Protocol（MCP）插件的运行宿主，为 AI 提供查阅实时文档与操作浏览器的工具底座。
\`\`\`bash
node -v # 检查版本，建议使用 v20 以上 LTS
npm -v
\`\`\`
- **Python（模型编排与业务逻辑）**：负责在后台调用大模型接口（DeepSeek、Claude、OpenAI 等）、处理数据库读写与数据计算，并通过清晰的 JSON 数据接口与前端交互。
\`\`\`bash
python --version # 检查版本，建议 3.11 以上
pip --version
\`\`\`

把“界面交互”与“模型认知计算”分层隔离，以后不论是调整前端样式还是更换底层模型，都不会互相干扰。

---

## 2. 主流大模型选型与特性对比

不同模型在代码逻辑严密性、上下文长度、响应速度以及国内网络与支付支持上各有侧重。以下梳理当前主流模型的实际特点：

### 主流大模型特性一览

| 模型系列 | 核心特点与适用场景 | 费用参考 |
| :--- | :--- | :--- |
| **Claude (Sonnet / Fable 5.1)** (Anthropic) | 逻辑严谨，代码遵循度与多文件重构表现极佳。日常主力推荐 Sonnet，长程复杂工程任务可选 Fable。 | API 按量计费（约 $3-$15/M tokens）或 $20/月订阅。 |
| **GPT (GPT-5.6 Sol / GPT-6 Astra)** (OpenAI) | 综合能力均衡，生态适配度高。日常编码常用 Sol，Astra 则进一步强化了电脑操控与浏览器自动化交互，支持 100 万上下文。 | API 按量计费或 $20/月 Plus/Pro 订阅。 |
| **Gemini (Gemini 3.8 Flash / Pro)** (Google) | 超长上下文（200 万 token）与多模态处理能力突出，支持调节思维深度，适合一次性读入超大代码仓库或完整长文档。 | Google AI Studio 提供充足免费调用配额；商业 API 单价较低。 |
| **DeepSeek (V4-Pro / V4.1)** (深度求索) | 国内高水准模型代表，代码生成能力紧跟海外旗舰，逻辑严密、极少出现严重幻觉。 | 极低（输入约 ¥1-2 / M tokens，充值数元即可调用数十万至数百万 tokens）。 |
| **Qwen (通义千问 3.8-Max / 27B)** (阿里) | 中文理解能力扎实，开源版 27B 支持在消费级显卡（如 RTX 4090 或 Mac）完全离线部署运行。 | 云端 API 单价低且提供免费测试额度；开源版本地部署零调用费用。 |
| **Kimi (K3 / K2.7 Code)** (月之暗面 Moonshot) | 超长上下文（100 万 token）与需求文档（PRD）理解能力突出，多轮对话长记忆稳定，不易发生指令遗忘。 | 按量计费实惠，新注册用户通常提供初始体验额度。 |
| **GLM (GLM-5.3 / CodeGeeX)** (智谱 AI) | 代码生成吞吐速度快，专为中文开发者优化，行间快速补全与中文注释生成表现良好。 | 基础版本提供免费体验额度；商业 API 整体单价较低。 |

---

## 3. 主流 Coding Agent（编程工具）对比

选好模型后，需要一个顺手的编辑器把它串联到工程中。Coding Agent 涵盖了 AI 原生 IDE、官方插件以及终端自动化工具：

### 主流 Coding Agent 特性一览

| 工具 / Agent | 核心特点与适用场景 | 费用参考 |
| :--- | :--- | :--- |
| **Cursor** | 交互打磨成熟的 AI 原生 IDE。Tab 键多行预测补全与 Composer 多文件联动编辑极为流畅，适合追求极致日常编码手感的开发者。 | 基础功能免费；Pro 订阅版 $20/月。 |
| **Trae** (字节跳动) | 国内直连免代理的 AI 原生 IDE，基于 VS Code 交互架构。内置主流模型体验，提供智能工作区搭建与侧边对话编辑模式，开箱即用门槛最低。 | 目前提供免费使用额度；国内账号一键登录。 |
| **VS Code + GitHub Copilot** | 微软官方与 GitHub 深度集成的老牌工具。行间补全精准，支持灵活切换底层主流模型，国内商业银行常规双币信用卡支持好，订阅稳定。 | 个人版 $10/月（支持国内 Visa / MasterCard 双币信用卡）。 |
| **Claude Code** (Anthropic) | Anthropic 推出的终端命令行（CLI）Agent 工具。擅长直接在终端通过自然语言执行全仓库文件审查、长程重构、自动化测试与 Git 操作，适合偏好命令行的工程师。 | 工具本身开源免费；按调用的 Claude 官方 API 消耗计费。 |
| **VS Code + Cline / Roo Code** | 开源高自主度的 Agent 插件。采用纯 BYOK（自带 API Key）机制，支持灵活挂接 DeepSeek、通义千问等国内外各大服务商，改写文件与执行命令透明可控。 | 插件完全免费开源；仅按自身填入的 API 消耗按量付费。 |
| **Kiro** (AWS) | AWS 推出的规范驱动型（Spec-Driven）Agent IDE。核心主打“先立规范与技术设计、再由 Agent 自动执行”，支持跨文件自动任务拆解、测试用例生成与沙盒验证，支持原生 MCP 扩展。 | 提供免费试用/社区版，支持绑定 AWS 账号按需计费。 |

### 实用搭配与选型建议：
- **零门槛极速起步**：直接下载 **Trae**，国内网络完全直连，免去代理和 API 配置烦恼，适合新手的第一站；
- **高自主度与高性价比**：推荐 **VS Code + Cline 插件** 搭配 **DeepSeek-V4** 或 **Qwen3.8**，微信/支付宝按量充值，花很少的费用即可拥有完整的 Agent 自主编码体验；
- **稳定大厂与海外订阅**：推荐 **VS Code + GitHub Copilot**，稳定支持国内常规双币信用卡支付，免去海外账号风控隐患；
- **长程深度重构与规范驱动**：偏好图形界面的推荐 **Cursor** 或 **Kiro**（规范驱动开发）；偏好终端自动化的推荐 **Claude Code**，搭配 **Claude (Sonnet / Fable)** 完成复杂的系统级架构任务。

---

## 4. 外部工具扩展：MCP 协议工具

大模型本身被困在训练好的对话框里，既看不到今天刚发布的库，也摸不到你的数据库。[Model Context Protocol (MCP)](https://modelcontextprotocol.io) 本质上是 Anthropic 发起并开源的标准接口插头，用于为 AI 统一扩展外部工具与数据源。

简单来说：MCP 相当于 AI 的「**手和眼睛**」，解决的是「**能不能做到**」的问题——让 AI 能实时抓取外部网页、能读写数据库、能操控系统工具，为后续编码提供真实的外部“食材”。

### 常用 MCP 工具推荐

1. **[Context7 MCP](https://context7.com/)**（最新官方文档）：实时查询各大开源库的最新版本语法，防止模型误用废弃的旧写法；
2. **[Firecrawl MCP](https://www.firecrawl.dev/)**（网页抓取与清洗）：将任意目标网站的技术文档或 GitHub 页面完整抓取，并自动洗成干净规整的 Markdown 文本供模型吸收；
3. **[Playwright MCP](https://playwright.dev/)**（浏览器操控与自测）：让 Agent 能够操控浏览器执行点击、输入和页面截图自查。（*注：目前部分现代 Coding Agent 如 Trae、Cursor 等已原生内置了浏览器预览或交互操控能力，此场景下无需额外挂载该 MCP*）。

**按需发掘更多 MCP**：[MCP 协议生态](https://modelcontextprotocol.io) 是一个开放的标准生态，可根据你的技术栈按需接入——比如直接读写与管理数据库表结构的 [Supabase MCP](https://supabase.com/docs/guides/ai/mcp)、管理仓库拉取与 PR 的 [GitHub MCP](https://github.com/github/github-mcp-server) 等，无需把所有工具一股脑堆在环境里，按需插拔即可。

---

## 5. 专家规约注入：Agent Skills 生态

如果说上一节的 MCP 负责为 AI 提供手和眼睛（解决“能不能做到”），那么 **Agent Skills** 则是为 AI 注入专业工作流的「**知识包与工作手册**」。

简单来说：Skills 相当于 AI 的「**专业操作手册 / 施工配方**」，解决的是「**做得好不好**」的问题——防止 AI 拿着工具凭感觉自由发挥、写出结构混乱的代码或千篇一律的廉价土味页面。两者配合起来，正好**一个提供食材，一个提供配方**。

### 常用技能包推荐

通过开源技能索引平台 [The Agent Skills Directory](https://www.skills.sh/) 与终端命令 \`npx skills add\`，可以为开发环境一键挂载各类专业规范。开工阶段推荐优先配置以下标杆技能：

1. **[\`trellis\`](https://github.com/mindfold-ai/Trellis)（结构化任务拆解）**：在动手编码前强制先拆解树状任务步骤与验证节点，防止模型一次性修改大量文件导致代码失控。官方开源仓库：[mindfold-ai/Trellis](https://github.com/mindfold-ai/Trellis)（官网：[trytrellis.app](https://trytrellis.app/)）。
   \`\`\`bash
   npx skills add trellis
   \`\`\`

2. **[\`frontend-design\`](https://github.com/anthropics/skills)（Anthropic 官方设计标准）**：Anthropic 官方开源的设计总监级技能包（[anthropics/skills](https://github.com/anthropics/skills)）。引导模型关注视觉层次：定制专属的字体搭配、收敛的颜色变量体系、舒适的留白网格以及克制的微动效，根治“AI 廉价感”。
   \`\`\`bash
   npx skills add https://github.com/anthropics/skills --skill frontend-design
   \`\`\`

3. **[\`ui-ux-pro-max-skill\`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)（工业级 UI/UX 规则库）**：涵盖多套设计风格、调色体系与组件规范的开源规则库（[nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)），帮助前端界面摆脱平庸模板，贴近专业商业产品的视觉水准。
   \`\`\`bash
   npx skills add nextlevelbuilder/ui-ux-pro-max-skill
   \`\`\`

**按需发掘更多 Skills**：除了上述核心规范外，[The Agent Skills Directory](https://www.skills.sh/) 汇集了海量覆盖各类技术栈、自动化测试与垂直领域调优的 Skills，你可以根据项目需要随时检索并在终端执行挂载。

---

## 6. 开工前的工程纪律：建立 Agent Harness

当运行环境、模型、编辑器和技能包就绪后，**第一阶段【基建与环境准备】** 便已搭建完毕。

在写业务代码之前，建议在项目根目录建立 \`.cursorrules\` 或 \`AGENTS.md\` 文件，为 AI 立下明确的约束：
1. 严格限制改动范围，禁止随意触碰无关文件；
2. 较复杂的修改必须先输出方案，经确认后再动手编码；
3. 遵循仓库统一的设计变量与技术选型，不擅自引入未经确认的第三方依赖。

至于后续的产品需求界定（Step 02）、前后端 API 契约设计（Step 03）、分步编码调试（Step 04 & 05）以及上线部署（Step 06），我们会在后续章节逐一展开细说。
`,
  },
];
