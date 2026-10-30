import {productionDiagrams} from './production-figures.mjs';
import {videoDiagrams} from './video-figure.mjs';
import {conceptDiagrams} from './concept-map.mjs';
import {taskDiagrams} from './task-flow.mjs';
// Logical sources and article placements for the retained figures.
const pair=(en,zh)=>({en,zh});
export const diagrams=[
  ...conceptDiagrams,
  ...taskDiagrams,
  ...productionDiagrams,
  ...videoDiagrams,
  {
    id:"environment-toolkit",note:"environment-infrastructure",icon:"Layers",
    title:pair("One workflow, different responsibilities","一条工作流，不同的工具职责"),
    caption:pair("Models reason; agents coordinate; tools act; project rules constrain the work.","模型负责推理，Agent 组织执行，工具连接外部能力，项目规约约束全过程。"),
    anchor:pair("Start with the responsibilities across the development environment:","先看清整套 AI 开发环境的职责分工："),
    code:lang=>lang==='en'?`
flowchart LR
 U["You: goal and acceptance"] --> A["Agent"]
 A -.-> U
 A --- M["Model: reason"]
 A --- T["MCP / tools: act"]
 A --- R["Runtime: run code"]
 A --- P["Skills / rules: methods and scope"]
`:`
flowchart LR
 U["你：目标与验收"] --> A["Agent"]
 A -.-> U
 A --- M["模型：推理"]
 A --- T["MCP / 工具：执行"]
 A --- R["运行环境：运行代码"]
 A --- P["Skills / 规约：方法与范围"]
`
  },
  {
    id:"environment-mcp",note:"environment-infrastructure",icon:"Network",
    title:pair("How MCP connects an agent to tools and data","MCP 如何连接 Agent、工具与数据"),
    caption:pair("The host connects each MCP client to its corresponding server; add only the capabilities a task needs.","Host 内的各 MCP Client 分别连接对应 Server；仅接入任务需要的能力。"),
    anchor:pair("## 4. Extending External Tooling: MCP Tools","## 4. 外部工具扩展：MCP 协议工具"),
    code:lang=>lang==='en'?`
flowchart LR
 subgraph HOST["AI application / Host"]
 C1["MCP Client 1"]
 C2["MCP Client 2"]
 C3["MCP Client 3"]
 end
 C1 <--> S1["Context7 MCP"]
 C2 <--> S2["Firecrawl MCP"]
 C3 <--> S3["Playwright MCP"]
 S1 <--> D["Documentation"]
 S2 <--> W["Website content"]
 S3 <--> B["Browser actions"]
`:`
flowchart LR
 subgraph HOST["AI application / Host"]
 C1["MCP Client 1"]
 C2["MCP Client 2"]
 C3["MCP Client 3"]
 end
 C1 <--> S1["Context7 MCP"]
 C2 <--> S2["Firecrawl MCP"]
 C3 <--> S3["Playwright MCP"]
 S1 <--> D["文档资料"]
 S2 <--> W["网页内容"]
 S3 <--> B["浏览器操作"]
`
  },
  {
    id:"scope-paths",note:"scope-product-definition",icon:"GitBranch",
    title:pair("Two ways to reach a clear problem","两条起点，汇入同一份产品定义"),
    caption:pair("An outline and an open conversation are complementary starting points. Revisit uncertain parts as evidence changes.","已有框架与对话探索可以互补；新证据出现时，回到仍不确定的部分。"),
    anchor:pair("## 1. Choose a Path Based on How Clear the Idea Is","## 1. 根据想法的清晰程度选择路径"),
    code:lang=>lang==='en'?`
flowchart TB
 A["An initial outline"] --> B["Path A<br/>Organize and challenge"]
 C["A vague idea"] --> D["Path B<br/>Explore real experiences"]
 B --> E["User + situation<br/>Problem + desired outcome"]
 D --> E
 E --> F["Research, scope, acceptance"]
 F --> G["Short PRD"]
`:`
flowchart TB
 A["已有初步框架"] --> B["路径 A<br/>梳理并质疑假设"]
 C["只有模糊想法"] --> D["路径 B<br/>从真实经历探索"]
 B --> E["用户 + 场景<br/>问题 + 期望结果"]
 D --> E
 E --> F["调研、范围与验收"]
 F --> G["短 PRD"]
`
  },
  {
    id:"scope-mvp",note:"scope-product-definition",icon:"Route",
    title:pair("MVP keeps the whole value journey","MVP 保留完整的价值流程"),
    caption:pair("Example: a single practice session. History, richer inputs, and social features need separate justification.","示例仅验证单次练习；历史记录、更多输入方式与社交功能另行判断。"),
    anchor:pair("## 4. Define the MVP Around a Complete Journey","## 4. 沿完整流程划定 MVP"),
    code:lang=>lang==='en'?`
flowchart TB
 A["Paste material"] --> B["Generate questions"]
 B --> C["Answer + get feedback"]
 C --> D["Review gaps + source"]
 D -.-> E["Consider separately<br/>Files / history / sharing"]
 F["Recover from failure<br/>Keep input + offer retry"] -.-> B
`:`
flowchart TB
 A["粘贴材料"] --> B["生成题目"]
 B --> C["作答并获得反馈"]
 C --> D["回看盲点与原文"]
 D -.-> E["另行判断<br/>文件、历史、分享"]
 F["失败后仍能继续<br/>保留输入，允许重试"] -.-> B
`
  },
  {
    id:"architecture-decisions",note:"architecture-contracts",icon:"Compass",
    title:pair("Turn an AI proposal into a decision","把 AI 建议变成有依据的决定"),
    caption:pair("A recommendation stays provisional until its direction-changing assumptions are checked.","影响方向的假设未核实前，推荐方案仍是候选。"),
    anchor:pair("## 2. Compare Architecture and Technology Choices Against Constraints","## 2. 根据约束比较架构与技术栈"),
    code:lang=>lang==='en'?`
flowchart TB
 A["PRD + platform + team constraints"] --> B["Compare a few feasible options"]
 B --> C["Check official version docs"]
 C --> D["Run the smallest critical experiment"]
 D --> E{"Fits the product?"}
 E --> F["Yes: record choice + trade-offs"]
 E --> G["No: revise the candidate"]
 G -.-> B
`:`
flowchart TB
 A["PRD、目标平台与团队约束"] --> B["比较少量可行方案"]
 B --> C["核对对应版本官方文档"]
 C --> D["做最小的关键试验"]
 D --> E{"适配产品需求？"}
 E --> F["适配：记录决定与代价"]
 E --> G["不适配：调整候选方案"]
 G -.-> B
`
  },
  {
    id:"architecture-boundaries",note:"architecture-contracts",icon:"ShieldCheck",
    title:pair("Name the responsibility boundaries","先明确职责与可信边界"),
    caption:pair("The application server can live in the same full-stack app. This is a responsibility map, not a microservice prescription.","应用服务端可以位于同一全栈应用内；图示表达职责，不要求拆成微服务。"),
    anchor:pair("## 3. Define Responsibilities and Trace the Core Journey","## 3. 划清职责并追踪核心流程"),
    code:lang=>lang==='en'?`
flowchart TB
 A["Client<br/>Input, state, answers, review"] --> B
 subgraph SERVER["Trusted application server"]
 B["Validate input + permissions"] --> C["Call generation with server secret"]
 D["Check output + return result"]
 end
 C --> E["External generation service<br/>Returns candidate content"]
 E --> D
 D --> F["Client receives checked result"]
`:`
flowchart TB
 A["客户端<br/>输入、状态、作答与回顾"] --> B
 subgraph SERVER["可信的应用服务端"]
 B["校验输入与权限"] --> C["用服务端密钥调用生成"]
 D["校验输出并返回结果"]
 end
 C --> E["外部生成服务<br/>返回候选内容"]
 E --> D
 D --> F["客户端获得已校验结果"]
`
  },
  {
    id:"architecture-failures",note:"architecture-contracts",icon:"MessagesSquare",
    title:pair("The contract includes the failure path","契约也要包含失败后的交互"),
    caption:pair("Illustrative synchronous flow. A timeout ends the wait; it does not prove upstream work has stopped.","同步示例：超时结束本次等待，并不代表上游任务已取消。"),
    anchor:pair("## 5. Agree on Permissions and Failure Behavior","## 5. 约定权限与失败行为"),
    code:lang=>lang==='en'?`
sequenceDiagram
 participant C as Client
 participant S as Server
 participant G as Generator
 C->>S: Submit material
 S->>S: Validate input / permissions
 S->>G: Request questions
 alt Valid output
 G-->>S: Candidate questions
 S->>S: Check structure + content
 S-->>C: Exercise
 else Failure / timeout
 S-->>C: Stable error + retry policy
 Note over C: Keep input and offer retry
 end
`:`
sequenceDiagram
 participant C as 客户端
 participant S as 服务端
 participant G as 生成服务
 C->>S: 提交材料
 S->>S: 校验输入与权限
 S->>G: 请求生成题目
 alt 输出符合要求
 G-->>S: 候选题目
 S->>S: 校验结构与内容
 S-->>C: 返回练习
 else 失败或超时
 S-->>C: 稳定错误与重试规则
 Note over C: 保留输入，显式重试
 end
`
  }
];
