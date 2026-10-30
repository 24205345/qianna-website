# Architecture & Contracts 双语内容发布

2026-10-26 开始准备，2026-10-27 完成生产页面验收。

## 交付内容

- [公开文章](https://www.qiannawang.com/notes/architecture-contracts)：中文、英文正文保存于同一条 Notes 记录。
- [Workbench 第三阶段](https://www.qiannawang.com/workbench?pipeline=ai-development#step-architecture)：更新英文摘要、标签、要点、文章入口和六张英文资源卡片。
- [中文源文](notes/architecture-contracts.zh.md)与[英文源文](notes/architecture-contracts.en.md)：八个编号章节，按使用环节放置三个可填槽提示词和一个 ADR 模板。

正文从产品约束出发，比较架构与技术栈，再定义职责、核心流程、交互契约、权限与失败行为，最后通过 Mock、小试验、决策记录和审查交接。延续 Scope & Product Definition 的知识问答工具示例，说明字段、状态、错误、重试和保留边界。

技术栈表列出 Next.js、React / Vue + NestJS、Web + FastAPI、微信原生小程序、Taro 和 uni-app 等候选。保留既有 Java、.NET 等能力作为选项，不默认前后端分离或指定框架。小程序案例分别核查编辑、编译、调试与发布要求，区分 uni-app 和 uni-app x，并明确不同团队经验可能产生不同结论。

文章引用框架官方文档、Taro 官方仓库、uni-app CLI 指南、C4、OpenAPI、MSW、ADR 与 OWASP。2026-10-26 写作时核对主要能力和工具链表述；版本与平台组合仍需读者按项目核查。案例及 20 秒预算等数字是说明写法的假设，不代表已完成产品测试或实测性能。

六张资源卡片为：Compare Architecture & Stack Options、Draft an Interaction Contract、Review Architecture & Contracts、C4 Model: Context & Container Diagrams、OpenAPI: Describe HTTP Interfaces、MSW: Mock Network Interactions。前三张内容与英文正文对应提示词逐字一致；后三张链接出现在正文相关环节。

## 发布与保存

Notes slug 为 `architecture-contracts`，记录 ID 为 `4c9bd632-6dc0-4363-984e-0d54ccabe833`。CMS 正文移除本地文件开头的重复文档标题，页面由现有元数据展示标题。发布通过现有 Supabase CMS 完成，无须部署应用代码即可显示。

沿用仓库本地管理员登录方式，校验服务端 `app_metadata.cms_role=admin` 后写入；未使用 service role。更新 Workbench 前比较发布前内容，并以 `updated_at` 条件保护并发修改。除新增文章及 `ai-development` 的 `step-architecture` 外，其他公开文章、工作流阶段和流水线字段均经过读回比较。

`app/_data/workbench.ts` 的静态回退同步为相同六张英文卡片。未修改渲染组件、数据表结构或权限规则，未执行 commit / push。

以下本地证据保存在已忽略的 `.media-migration/`，不进入 Git 或部署包：

- `architecture-contracts-before-2026-10-26.json`：发布前工作流及公开文章元数据快照。
- `architecture-contracts-published-2026-10-26.json`：发布后匿名读回的工作流、文章正文与元数据。
- `architecture-contracts-page-check-2026-10-27.json`：生产 HTML 验收摘要。

## 验收结果

- 匿名读回逐字段核对中英文正文、元数据和阶段资源，发布状态为 `published`；时间戳按同一时刻比较。
- 中英文各八个连续编号章节、八条分隔线、十八个三级小标题，层级数量对应。样例 JSON 可解析，四个选项 ID 唯一且包含正确答案 ID。
- 公开文章、Workbench 与 Notes 列表均返回 HTTP 200，列表和阶段入口指向新文章。
- 实际生产 HTML 中，文章标题、二三级标题、引述和表格样式类与 Environment & Infrastructure 相同。目录与全部正文锚点对应且不重复。
- 正文包含四个浅色无衬线提示词／模板复制块和一个沿用现有代码样式的 JSON 复制块；页面数据包含对应中文正文。
- Workbench 第三阶段六张资源卡片全部使用英文，旧的单张契约资源已替换，本地静态数据与生产阶段一致。
- `npm run lint`、正文结构检查和 `git diff --check` 通过。

本次页面检查基于实际生产 HTML，未执行浏览器语言切换、剪贴板点击或截图验收；交互继续复用既有组件。文中的技术试验是读者执行建议，网站发布验收没有运行示例产品。
