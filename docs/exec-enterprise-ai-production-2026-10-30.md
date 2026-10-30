# 第八阶段：从个人 Demo 到企业级平台

2026-10-30。本文记录本轮最终交付，取代修改过程中的临时数量与状态描述。交付包括双语章节、Workbench 静态入口、Notes 回退、图集与写作标准；用户已要求将这些更新纳入 Git 并推送。提交与推送结果以 Git 历史为准。

**发布边界：** 本轮没有写入生产 CMS，也没有手动执行生产部署。Git 推送可能触发托管平台的自动构建，不能据此认定 CMS 内容已经发布。生产 Workbench 成功读取 CMS 时使用其完整阶段数组，不会自动追加本地第八阶段。

## 最终内容与入口

- [中文源文](notes/enterprise-ai-production.zh.md)与[英文源文](notes/enterprise-ai-production.en.md)：系列编号 `08`，每种语言各 **9 节、3 幅图、4 张文字表、1 个可复制提示词、8 个官方资料链接**。
- 文章 slug：`enterprise-ai-production`；Workbench 阶段 ID：`step-enterprise-production`；阶段名称：`From Demo to Team Platform`。
- `app/_data/workbench.ts` 在原七个阶段后追加第八阶段，提供 **8 张资源卡**：1 张实施提示词卡、7 张官方参考卡。英文正文与卡片提示词一致；文章入口保留 `from=workbench` 返回约定。
- `app/_data/notes.ts` 引入 `app/_data/enterprise-production.json`。正文首行 H1 用作元数据标题，回退正文不重复渲染 H1。

读者是能够使用 Coding Agent、但尚不熟悉平台工程的产品建设者。先用概念地图建立全貌，再沿“上传视频，生成带时间戳摘要”的同一个案例展开：

| 读者的问题 | 建立的概念 |
| --- | --- |
| 谁能使用、能看到什么？ | 登录、角色、资源归属、团队隔离与数据生命周期 |
| 关闭网页后还能运行吗？ | 异步任务、消息队列、Worker、任务记录与状态查询 |
| 怎样更早拿到有用结果？ | 受理、首 Token、首个有效内容、流式响应与长视频分段汇总 |
| 多人同时使用怎么办？ | 并发、限额、公平调度、背压、瓶颈识别与扩容 |
| 出错后能从哪里继续？ | 检查点、有限重试、幂等、未知结果查证与取消 |
| 怎样持续维护？ | 评估、日志告警、费用、版本发布、备份恢复与责任人 |

最后两节帮助读者决定升级顺序，并把一个真实问题交给 Agent 实施和验收。内容是教学设计，不代表网站或既有视频项目已经实现这些能力，没有虚构速度、成本或生产运行数据。

## 写作标准与版本取舍

[Notes 写作与图文标准](notes-writing-guide.md)成为后续 Notes 的统一入口；根目录 [AGENTS.md](../AGENTS.md)、[文档索引](README.md)、[开发指南](developer-guide.md)与[双语说明](experience-notes-i18n.md)均已关联。

- **先建立概念，再介绍术语。** 按读者问题组织，使用同一个案例解释概念如何配合，并给出可观察的验收结果。
- **保留解释深度，同时允许扫读。** 短段落讲因果；并列项用列表，顺序用编号，映射用两三列表格，协作用图；选择性加粗主题，避免整屏连续长文。
- **图文沿用前三章样式。** 中性灰、细线图标、衬线图题和无衬线标签；图表用于解释关系，不重复包装文字。提示词、代码和规则保持可选择文本。
- **双语与证据同步。** 官方来源紧邻论点；区分建议与实测；同步正文、提示词、图注、回退与资源卡，实际检查桌面及窄屏。

最初的 14 节工程展开稿已移入[中文研究存档](research/enterprise-ai-production-engineering.zh.md)和[英文研究存档](research/enterprise-ai-production-engineering.en.md)，保留深入实现与引用。公开稿采用“概念地图 → 六个方向 → 升级顺序 → Agent 任务”的结构；之后的适度扩写重新组织为分点、加粗、表格与流程图。存档不是当前公开章节，不再将历史章节数量当成当前状态。

## 图集与再生成

当前正文使用三组双语图：

| 图 ID | 解释的问题 |
| --- | --- |
| `production-map` | 从个人 Demo 升级到平台，有哪六个方向？ |
| `production-task-flow` | 网页、服务端、数据库、队列、Worker 与文件如何配合？ |
| `production-video` | 如何利用字幕、有限分段并行和汇总逐步产出结果？ |

`production-boundaries`、`production-recovery`、`production-release` 三组工程图保留编辑源与资产，在清单中标记 `article: false`。整套图集共 26 张 SVG 与对应 WebP：前三章 14 张、第八章当前正文 6 张、工程存档 6 张。内容哈希历史文件保留，本地图片尺寸索引共 27 项。

实际读取并复用 `G:\project\SmartDiagram` 的 Mermaid 清洗器，保存 Mermaid、思维导图 Markdown、SVG、WebP 和清单；网站图像由本仓库原生 SVG 排版与 sharp 导出。没有启动 SmartDiagram 服务或调用其 LLM，也没有修改该仓库。前三章 14 条图像清单与本轮修改前一致。

```powershell
# 只生成第八章；需要本机 SmartDiagram 路径：
node scripts/notes-diagrams/render.mjs --smartdiagram 'G:\project\SmartDiagram' --note enterprise-ai-production
node scripts/notes-diagrams/sync-production-figures.mjs
node scripts/sync-enterprise-production-note.mjs
npm run generate:note-images

# 仅检查同步，不写入正文或 CMS：
node scripts/notes-diagrams/sync-production-figures.mjs --check
node scripts/sync-enterprise-production-note.mjs --check
```

当前图像位于 `public/notes/enterprise-ai-production/` 的真实内容哈希路径，随应用提供静态文件。生成脚本不上传 R2、不写 CMS；图位同步只要求当前正文在用的图。实现与编辑格式详见[图集规范](diagrams/workbench/README.md)及[图文映射](diagrams/workbench/content-map.md)。

## 资料与技术边界

资料核对日期为 2026-10-30。公开稿的 8 个官方来源包括 Supabase RLS、OWASP Prompt Injection、MDN SSE、FFmpeg 分段器、AWS 队列积压与重试、Anthropic Agent 评估与架构实践。使用官方正文核对相关事实；检索接口不可用时，通过只读 HTTP 读取原页面，没有把仅返回状态码视为正文核对通过。链接保留在正文对应论点附近。

明确保留以下边界：

- 登录不等于授权；后台任务、原始文件、摘要与下载都要按当前身份和资源归属判断权限。
- 异步、流式、分段或增加 Worker 本身不证明提速；受理、首个有效内容、完整完成、质量和费用需要分别测量。
- 超时不证明外部操作失败；重试取决于实际接口与幂等契约。检查点不保证外部副作用只发生一次，补偿按业务能力设计。
- Agent、框架、Temperature 0 或更多上下文不单独构成可靠性保证。未保留未经核实的视频时间戳或将面试提问写成统一行业标准。

## 渲染修复与最终验收

`NoteMarkdown.tsx` 原先每次标题渲染都递增 ID，在 React 开发模式重复渲染时可能产生正文 `-2` 后缀，导致目录链接不匹配。增加按 Markdown 节点缓存的 ID：同一节点重复渲染复用 ID，不同同名标题仍得到独立 ID；保留既有样式与标题生成规则。

本轮最终代码和内容检查：

- `npm run lint`、`npx tsc --noEmit`、正文回退及图注同步 `--check` 通过。
- `node --test --test-isolation=none tests/popular-notes.test.mjs tests/image-performance.test.mjs`：11 项通过。使用同进程执行方式避免本机沙箱的子进程限制。
- 双语结构、8 个一致外链、Workbench 提示词同步与阶段资源唯一性核对通过。当前图像的字节哈希、公开副本、尺寸、SVG XML 和配色检查通过；图集与写作规则的本地引用可解析。
- 实际浏览器检查 1280 × 900 桌面及 390 × 844 窄屏：双语各 9 个目录目标存在，三幅图加载正常，整页无横向溢出。新增文字表保持双列；阶段表在自身容器内横向滚动。图像按比例缩放，细节通过原图入口查看。
- 工作台静态预览的第八阶段有 8 张资源卡，文章入口与返回路径正确。复制按钮曾触发，但未成功读回系统剪贴板，不将剪贴板内容核对记为通过。
- 本轮早期执行过生产构建并成功生成 41 个静态路由；之后最终稿的提交前检查为上述 lint、类型、回归测试、同步与页面检查，没有把早期构建当成最终稿重新构建的结果。

本地预览使用隔离数据源验证静态回退，没有连接生产 CMS。验收截图保存在本次可视化目录（如 `chapter08-scannable-permissions.zh.jpg`、`chapter08-background-diagram.zh.jpg`、`chapter08-scannable-mobile.en.jpg`），不纳入 Git 或部署包。

## 后续内容发布

若需要让生产 CMS 入口展示第八章，应先读取现有 Notes slug 和 AI 工作流快照，通过现有管理员机制保存双语字段并追加阶段，保护已有内容与并发编辑，再匿名读回核对。不要用会重建记录的初始化脚本发布日常内容。代码和静态资产的 Git 交付不替代该 CMS 发布步骤。
