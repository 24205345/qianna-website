# Scope and Product Definition 章节发布记录

发布于 2026-10-23，生产数据库记录时间为 10:33 UTC，即北京时间 18:33。

## 发布内容

- [中英文文章](https://www.qiannawang.com/notes/scope-product-definition)：沿用 Notes 的 English / 中文切换。
- [Workbench 对应阶段](https://www.qiannawang.com/workbench?pipeline=ai-development#step-requirements)：更新阶段摘要、标签、要点和关联文章入口。
- 6 张可复制资源卡片：路径 A 已有框架的中英文提示词、路径 B 模糊想法探索的中英文提示词，以及中英文短 PRD 模板。

两条路径可单独使用、前后衔接或局部往返。正文包含问题与用户定义、调研、MVP 取舍、验收、PRD、提示词及开发交接，共八个主章节。

## 本地内容

- [中文正文](notes/scope-product-definition.zh.md)
- [英文正文](notes/scope-product-definition.en.md)
- `app/_data/workbench.ts` 的 `step-requirements` 已同步为相同内容，供静态回退及默认内容初始化使用。

文章通过现有 CMS 数据表发布，不依赖应用代码部署。中英文正文写入同一条 `notes` 记录；slug 为 `scope-product-definition`，记录 ID 为 `bb7a3f5c-35a4-4fbf-8ede-27d76ed48d1f`。本地 Markdown 保留文档标题，CMS 正文移除重复标题，由详情页元数据展示标题。

PRD 模板使用纯文本标签，避免网站现有目录提取器将代码块中的 Markdown 标题误列为文章目录。

## 发布方式

当前 Supabase MCP 所连接账号无权访问本网站的 Supabase 项目。实际发布沿用仓库已有的本地脚本认证方式，使用 `.env.local` 中的管理员账号登录，校验服务端 `app_metadata.cms_role=admin` 后，通过 Supabase Data API 写入。

未使用 service role，未更改表结构、RLS、权限或其他工作流阶段。更新 Workbench 前读取最新记录，并用 `updated_at` 条件防止覆盖并发修改。原始公开内容快照保存在已忽略的 `.media-migration/scope-product-definition-before-2026-10-23.json`，不进入 Git 或部署包。

## 验收

- 通过匿名客户端逐字段读回中英文正文、元数据和阶段资源，确认与准备内容一致；发布状态为 `published`。
- 与发布前快照比较，其他工作流阶段保持一致。
- 生产文章详情、Notes 列表和 Workbench 请求均返回 HTTP 200，页面响应包含新标题、文章链接和六张资源卡片。
- 文章响应包含两种语言的内容、五张英文正文表格和四个正文复制按钮。
- `npm run lint` 通过；本地静态阶段数据与已发布资源逐字段比较一致，文档格式与链接检查通过。
- 浏览器自动化连接超时，未完成语言切换和剪贴板复制的交互点击验收；上述页面检查基于实际生产 HTML 响应。

本次不执行 commit 或 push。

## 2026-10-26 展示语言调整

根据 Workbench 统一英文展示的要求，Scope 阶段资源区改为三张英文卡片：Review an Initial Outline、Explore a Vague Idea 和 Short Product Brief Template。标签简化为 Path A、Path B 和 PRD Template，移除重复的语言标记。生产 CMS 与本地静态回退同步更新；文章中英文正文及语言切换保持不变，中文提示词和模板仍可在文章中文模式中复制。

通过匿名客户端读回并比较，确认资源列表符合预期，其他工作流阶段及文章双语正文保持原值。

## 2026-10-26 正文格式对齐

参照 Environment & Infrastructure 的正文结构，Scope 中英文统一使用 `## 1.` 至 `## 8.` 的章节编号，章间加入细分隔线，三级小标题保持不编号。英文标题使用与参考文相同的标题大小写，路径小标题用冒号分隔标签与主题，开篇增加背景引述格式。

两篇文章复用现有 NoteDetailView 与 NoteMarkdown：页面标题、二级标题、三级标题均沿用既有衬线层级，正文和表格沿用既有样式。Scope 的四处自然语言模板及提示词由 `text` 标记改为 `prompt`，使用现有浅色无衬线提示词块并保留复制按钮。

本次只更新 Scope 的中英文 Markdown 正文和本地正文文件；逐段校验正文及四个复制块内容未变。文章元数据、Environment 原文及 Workbench 流程均保持不变。修改前快照保存到已忽略的 `.media-migration/scope-format-before-2026-10-26.json`。

生产 Scope 与 Environment 页面均返回 HTTP 200。对实际 HTML 比较，页面标题、二三级标题、表格、引述与分隔线使用相同样式类；Scope 显示八个连续编号章节、八条分隔线和四个 `font-sans` 复制块。中文正文格式也已读回确认。本次浏览器连接超时，未完成截图验收；未修改应用代码，无需运行应用构建。

## 2026-10-26 实用资源与完整示例

保留八节正文结构，在第六节补充知识问答工具的完整短 PRD 示例，串联问题、假设、流程、范围取舍、验收、约束、验证与交接。明确示例未经真实用户验证，长度、试用人数与继续条件仅用于说明写法。

第七节调整为按任务选择工具与提示词，增加任务对照表、Anthropic doc-coauthoring 的用途、官方来源、安装命令和独立对话读者检查方法，并补充“调研现有方案与证据”“审查产品定义”两份可填槽提示词。Skill 作为可选协作工具，提示词可独立使用；联网能力沿用第一阶段，不在第二阶段重复列出 Firecrawl。

中英文正文同步发布。Workbench 对应阶段由三张扩展为六张英文资源卡片：保留路径 A、路径 B、短 PRD 模板，增加 doc-coauthoring、Research Alternatives & Evidence、Review a Product Brief。本地静态回退与生产 CMS 同步；保留既有标题层级、分隔线和浅色无衬线提示词样式。

发布仍使用管理员登录、服务端角色检查和 `updated_at` 并发条件，仅写入 Scope 正文与对应阶段。发布前快照位于已忽略的 `.media-migration/scope-toolkit-before-2026-10-26.json`；发布后读回快照为 `.media-migration/scope-toolkit-published-2026-10-26.json`。匿名读回确认正文与本地一致、文章元数据及其他阶段未变；本地结构检查确认双语各八个编号章节、八条分隔线、六个自然语言复制块和一个安装命令块。`npm run lint` 与 `git diff --check` 通过。

公开文章与 Workbench 请求均返回 HTTP 200。实际 HTML 确认英文正文八个连续编号章节、六个浅色无衬线提示词复制块、新增示例与 Skill 链接；页面数据包含对应中文内容。Scope 资源区六张卡片均为英文，未重复出现 Firecrawl。验收摘要保存在 `.media-migration/scope-toolkit-page-check-2026-10-26.json`。本次未进行浏览器交互或截图验收；复制块继续复用现有组件。

## 2026-10-26 阅读顺序与重复内容梳理

针对第一节与第七节重复出现路径 A/B 的问题，将文章统一为“选择起点 → 明确问题 → 补充依据 → 划定 MVP → 定义验收 → 整理 PRD → 审查修订 → 决定下一步并交接”的八节流程。路径 A/B 的说明与提示词合并在第一节，各只保留一个目录标题；调研提示词归入第三节，doc-coauthoring 归入第六节。移除原第七节的重复任务导航表，压缩重复的路径说明，并补充开篇阅读指引。

第七节专门审查初稿、处理批注及同步修订；第八节根据剩余问题区分进入架构、先做可行性试验、返回探索或暂缓，并说明交接材料。保留完整 PRD 示例及全部七个复制块的原始内容（六个自然语言块与一个安装命令），Workbench 六张英文卡片无须修改。

中英文正文通过管理员认证和时间戳条件同步发布。发布前后快照为 `.media-migration/scope-structure-before-2026-10-26.json` 与 `.media-migration/scope-structure-published-2026-10-26.json`。匿名读回确认双语正文与本地一致、文章元数据及整个 Workbench 流程未变、六张资源内容仍可在正文找到。实际公开页面 HTTP 200，目录与正文锚点逐项一致，路径 A/B 各只出现一个正文小标题，六个浅色无衬线复制块按章节分布为 `2, 0, 1, 0, 0, 1, 2, 0`，页面数据包含新版中文内容。验收摘要为 `.media-migration/scope-structure-page-check-2026-10-26.json`。

本轮仅修改正文与执行记录，`git diff --check` 通过，无需重复运行应用构建或 lint。未进行浏览器交互及截图验收，未 commit / push。

## 2026-10-26 衔接与验证表述精修

继续通读后，统一第二节与完整 PRD 示例的痛点表述：自学者需要发现具体的理解盲点，重读缺少明确反馈、手工编题耗力。第三节补充真实用户交流和观察的用途，说明联网比较现有方案后仍可能需要验证用户行为。第五节将口头使用意愿与实际再次使用分开，并说明验证计划需要写明参与者、任务、观察行为、回看时间和决定条件。第七节区分待验证假设与不完整的验证计划，明确文档审查不能代替用户证据。

中英文同步发布，保留八节目录、全部复制块及 Workbench 六张资源卡片。发布前后快照为 `.media-migration/scope-editorial-before-2026-10-26.json` 与 `.media-migration/scope-editorial-published-2026-10-26.json`。匿名读回确认与本地一致，文章元数据和 Workbench 未变；公开文章 HTTP 200，实际响应包含双语精修内容、八个章节和六个浅色提示词块。仅修改正文和执行记录，`git diff --check` 通过；未进行浏览器交互或截图验收，未 commit / push。
