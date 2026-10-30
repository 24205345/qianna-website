# Workbench Note 系列标题

2026-10-29 已通过现有 CMS 发布，并核对生产 HTML。

## 标题规则与范围

中文使用 `【AI 开发工作流 · 编号】 原标题`，英文使用 `【AI Dev Workflow · 编号】 Original Title`。编号对应 Workbench 的 AI Product & Solo Dev 阶段；04–06 尚未关联文章，保留阶段编号，不将部署文章重排为 04。

| 阶段 | 文章 |
| --- | --- |
| 01 | [Environment & Infrastructure](https://www.qiannawang.com/notes/ai-infrastructure-coding-agents-and-models) |
| 02 | [Scope & Product Definition](https://www.qiannawang.com/notes/scope-product-definition) |
| 03 | [Architecture & Contracts](https://www.qiannawang.com/notes/architecture-contracts) |
| 07 | [Aliyun ECS Deployment Guide](https://www.qiannawang.com/notes/aliyun-ecs-docker-deploy) |

更新四条 `notes` 的 `title` / `title_en`、四个阶段的 `relatedNoteLabel` 及工作流的 `featured_note.title`。Workbench 继续显示英文，阶段名称保持原值。同步 `app/_data/workbench.ts`、已有 `app/_data/notes.ts` 回退标题和八份中英文正文源文件的首行文档标题。正文源文件第一行以外的内容未变。

## 发布与核对

使用仓库既有的管理员登录方式，验证服务端 `app_metadata.cms_role=admin` 后写入，更新条件包含原记录 `updated_at`。未使用 service role，未修改表结构、权限、文章 slug、正文、图表、摘要或发布日期。

匿名读回全部公开文章及两条 Workbench 工作流，逐字段比较：仅四篇双语标题、五处文章入口标题及对应更新时间发生变化。其他文章与 Computational Architecture 工作流保持原值。

生产首页、Notes 列表、Workbench 及四个详情页全部返回 HTTP 200。实际 HTML 已核对四篇文章的英文主标题、SEO 标题、中文标题数据、canonical URL，以及列表和 Workbench 的系列前缀；首页显示的关联文章也使用新标题。本轮为 HTML 与数据核对，未运行浏览器交互验收。

本地静态回退和 Workbench 入口标题与发布计划一致；`npm run lint`、`git diff --check` 通过。本次为 CMS 内容更新，线上已生效，无需应用部署；既有导航代码改动仍为本地状态，未执行 commit / push。

发布前快照、计划、读回及页面核对记录保存在已忽略的 `.media-migration/workbench-note-series-2026-10-29-*.json`，不进入 Git 或部署包。后续维护规则见 [Notes 双语展示](experience-notes-i18n.md#workbench-系列标题)。
