# Notes / Workbench 文档与 Git 交付

2026-10-29 整理，2026-10-30 完成交付核查。根据用户要求，将本次对话中的关联改动统一沉淀并提交到 `main`，推送至既有 GitHub 仓库。此前执行记录中“未提交 / 未推送”描述的是各次内容发布完成时的状态；本记录说明这批文件的统一 Git 交付范围。

## 内容与功能边界

| 内容 | 本次交付 | 生产状态 / 后续 |
| --- | --- | --- |
| Scope & Product Definition | 双路径探索、MVP、PRD、审查与交接；中英文源文、英文 Workbench 资源卡片 | 已通过 CMS 发布；详细过程见 [Scope 记录](exec-scope-product-definition-2026-10-23.md) |
| Architecture & Contracts | 选型与核查、接口契约、Mock、权限、ADR 与双语案例 | 已通过 CMS 发布；见 [Architecture 记录](exec-architecture-contracts-2026-10-27.md) |
| 前三篇文章图文改版 | 七组共 14 张中性灰双语图、SVG / WebP、可编辑源文、图表规范与生成脚本 | 当前生产为 v3；R2 资产与 CMS 正文已发布。v1 / v2 为历史；见 [v3 记录](exec-workbench-visuals-v3-2026-10-29.md) |
| 系列阅读标识 | 四篇双语标题及五处 Workbench 入口统一为 `【AI Dev Workflow · 编号】` / `【AI 开发工作流 · 编号】` | CMS 已发布；编号对应 01、02、03、07 阶段；见 [系列标题记录](exec-workbench-note-series-2026-10-29.md) |
| 按入口返回 | Workbench 的文章链接附带 `from=workbench`，详情返回 Workbench；Notes / 直接入口返回 Notes | 代码纳入本次推送，随应用部署生效 |
| 首页三篇热门 Note | 按全部历史 Note PV 排名；并列按发布日期和 slug；失败回退最新文章 | 代码与 SQL 纳入本次推送，生产 SQL 尚未执行；见 [热门排序记录](exec-home-most-read-notes-2026-10-29.md) |

只更新既有 `origin` 的当前 `main`，不执行数据库初始化、重新上传媒体或覆盖 CMS。推送按现有配置触发 Vercel 部署，但 Git 推送成功本身不代表部署验收完成。

## 可复用维护规则

- **入口上下文**：通过显式 URL 参数保存来源，不使用浏览器历史猜测返回目标；新标签页、刷新和锚点跳转保留来源。站外和 Project 链接不加此标记。`FixedBackLink` 仅在 Note 子组件读取查询参数，并用 `Suspense` 隔离。详见 [Notes 前台经验](experience-notes-markdown-ui.md#详情页返回入口)。
- **系列标题**：维护 CMS 中英文标题，同时同步 Workbench 的精选文章标题、阶段入口标签及本地回退。阶段名称保持英文，序号跟随 Workbench 阶段。详见 [双语与系列标题](experience-notes-i18n.md#workbench-系列标题)。
- **图文匹配**：先判断段落需要表达的关系，再选分支、拓扑、合流、旅程、判断或时序；可复制对照项优先用表格。中性色、字体和图标统一从 [图表规范](diagrams/workbench/README.md) 与 `style.json` 维护。生成与发布分开，保留不可变对象键与 SHA-256。
- **热门排序**：服务端直接聚合数据库全部浏览记录，只返回公开预览；不把访客级统计拉入首页，不硬编码当前前三名。SQL 上线前仍会显示最新文章作为兼容回退，不能将回退视为热门排名已上线。

## 验证与提交范围

现有 TypeScript、八种返回链接组件渲染场景及 SQL / RLS 本地验证均已通过。提交前运行 `npm run build`，Next.js 16.2.1 生产编译、类型检查和 41 个静态页面生成全部通过；仅提示既有 `middleware` 命名已弃用，本轮不改动该无关约定。2026-10-30 最终复核：`npm run lint` 与 `npm run test:notes`（七项测试）通过；14 张图表的本地文件、正文引用、尺寸与 SHA-256 一致，JSON 与 SVG / Draw.io XML 格式有效，19 份维护文档的相对文件链接无缺失。

提交包含正文、图表、规范、生成脚本、应用代码、测试及待执行 SQL。排除 `.env.local`、`.media-migration/`、`.vercel/`、Supabase CLI 临时缓存及任何 OAuth / S3 / 管理员凭据；这些均不应进入 Git 或部署包。

本次生产 SQL 仍需在网站项目 `aqsdwfocoocnzyxopvvg` 执行并匿名读回。当前 Supabase MCP 账号不包含该项目，用户已选择先交付代码和 SQL；本次 commit / push 不改变这一边界。浏览器操作仍受当前 Work 设置限制，生产 HTML 与本地 SQL 验证不替代窄屏、语言切换及点击交互验收。
