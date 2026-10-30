# 【AI 开发工作流 · 01】 基建与环境准备：大模型、Coding Agent 与环境配置实践指南

> 💡 **时效性与写作背景（更新日期：2026 年 9 月 21 日）**\
> AI 工具迭代迅速，网上的很多早期经验容易过时，国内开发者也常常在网络代理与外币卡结算环节遇到阻碍。这篇笔记整理了一套务实平缓的配置路径：选好顺手的大模型、配好编辑器、并在动工前立好工程护栏。

先看清整套 AI 开发环境的职责分工：由你定义目标与验收标准，Agent 组织执行，模型、工具与运行环境提供不同能力。下图是全文总览；后面再逐项讨论运行环境、模型、编程工具、MCP、Skills 与工程规约。

[![一条工作流，不同的工具职责 — 模型负责推理，Agent 组织执行，工具连接外部能力，项目规约约束全过程。](https://media.qiannawang.com/notes/workbench-diagrams/v3/environment-toolkit.zh-f71b2a9dc454.webp)](https://media.qiannawang.com/notes/workbench-diagrams/v3/environment-toolkit.zh-f71b2a9dc454.webp)

*模型负责推理，Agent 组织执行，工具连接外部能力，项目规约约束全过程。 [查看原图](https://media.qiannawang.com/notes/workbench-diagrams/v3/environment-toolkit.zh-f71b2a9dc454.webp)*

---

## 1. 按项目需要配置运行环境

Node.js 支持 Web 界面与工具链；产品需要 Python 库或相关处理流程时再配置 Python。按项目实际需要准备运行环境。

- **Node.js（前端呈现与工具宿主）**：负责运行前端框架（React、Next.js）、前端构建工具，同时作为 Model Context Protocol（MCP）插件的运行宿主，为 AI 提供查阅实时文档与操作浏览器的工具底座。
```bash
node -v # 检查版本，建议使用 v20 以上 LTS
npm -v
```
- **Python（模型编排与业务逻辑）**：负责在后台调用大模型接口（DeepSeek、Claude、OpenAI 等）、处理数据库读写与数据计算，并通过清晰的 JSON 数据接口与前端交互。
```bash
python --version # 检查版本，建议 3.11 以上
pip --version
```

界面与处理逻辑的职责需要清楚，即使它们位于同一应用中。

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

选择适合自己的工作入口：AI 编辑器、扩展插件或终端 Agent。

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

- 能否顺利登录，并完成一个代表性任务？
- 能否检查工具权限、文件改动和测试结果？
- 成本和工作方式是否适合自己？先跑通一套，再按任务补充。

---

## 4. 外部工具扩展：MCP 协议工具

[Model Context Protocol (MCP)](https://modelcontextprotocol.io) 连接 Agent 与外部工具、数据。需要当前文档、仓库信息或浏览器检查时，再接入相应能力。

支持 MCP 的 AI 应用（Host）通过内置 MCP Client 与 MCP Server 通信；Server 向应用提供自己支持的工具、资源或提示模板。下图对应本节的接入关系，文档查询、网页抓取与浏览器操作是后面列出的具体例子。角色定义见 [MCP 官方架构说明](https://modelcontextprotocol.io/docs/learn/architecture)。

[![MCP 如何连接 Agent、工具与数据 — Host 内的各 MCP Client 分别连接对应 Server；仅接入任务需要的能力。](https://media.qiannawang.com/notes/workbench-diagrams/v3/environment-mcp.zh-1b94071b3ecc.webp)](https://media.qiannawang.com/notes/workbench-diagrams/v3/environment-mcp.zh-1b94071b3ecc.webp)

*Host 内的各 MCP Client 分别连接对应 Server；仅接入任务需要的能力。 [查看原图](https://media.qiannawang.com/notes/workbench-diagrams/v3/environment-mcp.zh-1b94071b3ecc.webp)*

### 常用 MCP 工具推荐

1. **[Context7 MCP](https://context7.com/)**（最新官方文档）：实时查询各大开源库的最新版本语法，防止模型误用废弃的旧写法；
2. **[Firecrawl MCP](https://www.firecrawl.dev/)**（网页抓取与清洗）：将任意目标网站的技术文档或 GitHub 页面完整抓取，并自动洗成干净规整的 Markdown 文本供模型吸收；
3. **[Playwright MCP](https://playwright.dev/)**（浏览器操控与自测）：让 Agent 能够操控浏览器执行点击、输入和页面截图自查。（*注：目前部分现代 Coding Agent 如 Trae、Cursor 等已原生内置了浏览器预览或交互操控能力，此场景下无需额外挂载该 MCP*）。

**按需发掘更多 MCP**：[MCP 协议生态](https://modelcontextprotocol.io) 是一个开放的标准生态，可根据你的技术栈按需接入——比如直接读写与管理数据库表结构的 [Supabase MCP](https://supabase.com/docs/guides/ai/mcp)、管理仓库拉取与 PR 的 [GitHub MCP](https://github.com/github/github-mcp-server) 等，无需把所有工具一股脑堆在环境里，按需插拔即可。

---

## 5. 专家规约注入：Agent Skills 生态

**Agent Skills** 提供可复用的任务方法与指引。MCP 负责接入工具，Skill 说明如何开展工作。

按任务选择适用的 Skill，并结合项目自身规约使用。

### 常用技能包推荐

通过开源技能索引平台 [The Agent Skills Directory](https://www.skills.sh/) 与终端命令 `npx skills add`，可以为开发环境一键挂载各类专业规范。开工阶段推荐优先配置以下标杆技能：

1. **[`trellis`](https://github.com/mindfold-ai/Trellis)（结构化任务拆解）**：在动手编码前强制先拆解树状任务步骤与验证节点，防止模型一次性修改大量文件导致代码失控。官方开源仓库：[mindfold-ai/Trellis](https://github.com/mindfold-ai/Trellis)（官网：[trytrellis.app](https://trytrellis.app/)）。
   ```bash
   npx skills add trellis
   ```

2. **[`frontend-design`](https://github.com/anthropics/skills)（Anthropic 官方设计标准）**：Anthropic 官方开源的设计总监级技能包（[anthropics/skills](https://github.com/anthropics/skills)）。引导模型关注视觉层次：定制专属的字体搭配、收敛的颜色变量体系、舒适的留白网格以及克制的微动效，根治“AI 廉价感”。
   ```bash
   npx skills add https://github.com/anthropics/skills --skill frontend-design
   ```

3. **[`ui-ux-pro-max-skill`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)（工业级 UI/UX 规则库）**：涵盖多套设计风格、调色体系与组件规范的开源规则库（[nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)），帮助前端界面摆脱平庸模板，贴近专业商业产品的视觉水准。
   ```bash
   npx skills add nextlevelbuilder/ui-ux-pro-max-skill
   ```

需要补充能力时，再到 [The Agent Skills Directory](https://www.skills.sh/) 查找对应技能。

---

## 6. 开工前的工程纪律：建立 Agent Harness

工具准备好后，还需要把项目的改动边界与协作方式写清楚。Agent Harness 在这里体现为可读取的工程约定，以及执行前后的检查。

在写业务代码之前，建议在项目根目录建立 `.cursorrules` 或 `AGENTS.md` 文件，为 AI 立下明确的约束：
1. 严格限制改动范围，禁止随意触碰无关文件；
2. 较复杂的修改必须先输出方案，经确认后再动手编码；
3. 遵循仓库统一的设计变量与技术选型，不擅自引入未经确认的第三方依赖。

协作时，先让 Agent 读取这些约定，明确冲突与缺口，再按已确认的范围执行；交付时检查文件改动和相关验证依据。

至于后续的产品需求界定（Step 02）、前后端 API 契约设计（Step 03）、分步编码调试（Step 04 & 05）以及上线部署（Step 06），我们会在后续章节逐一展开细说。
