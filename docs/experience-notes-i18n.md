# 经验：Notes 双语展示（列表英文 + 详情可切换）

新增和修改正文先遵循 [Notes 写作与图文标准](notes-writing-guide.md)；本文维护数据字段与 CMS 行为，不重复维护写作规则。

## 场景

作品集首页/列表面向国际访客，希望默认英文；详情页仍要保留中文原文，并支持切换。

## 方案对比（简要）

| 方案 | 权重 | 说明 |
| --- | --- | --- |
| A. 表内 `title_en` / `excerpt_en` / `body_markdown_en` | **选中（9）** | 与现有 CMS 一致，Admin 可编辑，查询层优先英文即可 |
| B. 独立 `note_translations` 表 | 6 | 更规范，但对单篇笔记过重 |
| C. 仅前端 i18n JSON | 3 | 不适合作者在后台改稿 |

## 做法

1. Migration 增加英文字段；中文仍写在 `title` / `excerpt` / `body_markdown`。
2. 查询层 `mapDetail`：列表/首页的 `title`/`excerpt` **优先英文**，缺省回退中文。
3. 详情页客户端组件持有 `lang`，切换时换标题/摘要/正文与 TOC。
4. TOC 放左侧，`sticky` + 独立 `max-h` + `overflow-y-auto`，与正文滚动分离。
5. 既有配图保留 `public/notes/<slug>/`；后台新图片/附件上传到 R2 并保存完整公开 URL。静态路径不由 R2 脚本改写。

## Workbench 系列标题

Workbench 的 AI 开发工作流文章使用 `【AI 开发工作流 · 01】 原中文标题` / `【AI Dev Workflow · 01】 Original English Title`。编号与 Workbench 阶段一致，不按文章发布日期重新编号；生产关联文章为 01、02、03、04、07、08，05–06 作为后续阶段的编号保留。第四章于 2026-11-02 发布，见[交付记录](exec-ui-prototype-2026-11-02.md)。第八章（From Demo to Team Platform，六分支概念地图与视频案例）于 2026-10-30 完成 Git 交付，2026-11-02 已通过管理员接口发布双语正文与工作流入口，见[内容交付](exec-enterprise-ai-production-2026-10-30.md)和[生产发布记录](exec-enterprise-ai-production-publish-2026-11-02.md)。

系列标识写入 CMS 的 `title` / `title_en`，因此 Notes 列表、首页、详情及 SEO 元数据展示一致。同步 Workbench 的 `relatedNoteLabel` / `featured_note.title`、本地静态标题和正文源文件的文档标题；Workbench 阶段名称继续保持简洁英文。后续新增对应阶段文章时沿用相同格式，避免重复添加前缀。

## 大正文写入注意

第八章以 `docs/notes/enterprise-ai-production.zh.md` / `.en.md` 为正文源。修改后运行 `node scripts/sync-enterprise-production-note.mjs`，生成 `app/_data/enterprise-production.json` 并由 `fallbackNotes` 引入；用 `--check` 检查同步状态。生成时去除首行重复 H1，保留双语标题和摘要。此命令只更新本地回退，不写 CMS；发布时需同时更新 Notes 记录与 `ai-development` 的第八阶段。Workbench 查询成功时使用 CMS 的整个 `steps` 数组，因此仅部署静态回退不会把第八阶段追加到生产工作流。

历史导入曾用分块 SQL。日常通过 Admin 完整保存 Markdown；批量导入先备份并校验完整字段更新，避免清空后追加留下半成品。R2 迁移仅改写指定旧桶 URL，并发保护阻止覆盖计划后已编辑字段。

## 视频项目实践的同步与发布

`ai-video-downloader-summarizer` 的双语源为 `docs/notes/ai-video-downloader-summarizer.zh.md` / `.en.md`。运行 `node scripts/sync-ai-video-note.mjs` 生成 `app/_data/ai-video-note.json`，由 `fallbackNotes` 引入；`--check` 只检查同步。原英文稿此前仅存 CMS，2026-11-02 已纳入本地版本源。

`node scripts/update-ai-video-note-zh.mjs` 默认只读，列出待变字段与当前 `updated_at`；历史脚本名保留，实际已完整发布双语。使用 `--apply --expected-updated-at <已核对的值>` 才写入，要求服务端管理员角色，并在临时目录保存旧记录与拟写内容。更新按 ID 和 `updated_at` 保护并发，随后匿名读回；不改 slug、原发布日期、状态、封面或 Workbench。该脚本不上传媒体、不部署应用，也不执行初始化迁移。

正文新增图先上传并验证公开对象，再发布正文。视频 Note 保留原文、四张操作截图、六段提示词及原摘要和标签，仅在附录前新增第七节。两组新图的四个双语文件已在 R2，原截图位置不变。恢复后双语正文已写入生产 CMS，并与修改前备份逐字核对；见 [2026-11-02 更新记录](exec-ai-video-note-update-2026-11-02.md)。

## 第四章与交互实验室

`ui-prototype-ergonomics` 的中英源稿生成 `app/_data/ui-prototype-note.json`；第四阶段由 `ui-prototype-stage.json` 引入。`node scripts/sync-ui-prototype-note.mjs --check` 核对双语回退、两种正文的提示词语言及英文两段提示词与资源卡一致。中文正文使用中文指令。实验室同一 HTML 支持 `?lang=zh` / `?lang=en`，两份正文分别链接对应语言；十四个示例的复制内容也跟随语言，资源卡沿用英文。

发布方式与维护见 [交互实验室](ui-prototype-lab.md)，本轮实际状态见 [第四章交付记录](exec-ui-prototype-2026-11-02.md)。生产 CMS 成功返回时不会自动采用静态阶段；因此文章和第四阶段需分别同步，保留旧资源及其余七阶段。

## 部署

静态图片和代码需随部署产物发布；R2 文件无需放进 Git。内容更新后仍需 revalidate / 刷新验收。仅用户要求时 commit / push；见 [媒体运维](experience-media-storage.md)。
