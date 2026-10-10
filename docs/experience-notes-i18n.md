# 经验：Notes 双语展示（列表英文 + 详情可切换）

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

## 大正文写入注意

历史导入曾用分块 SQL。日常通过 Admin 完整保存 Markdown；批量导入先备份并校验完整字段更新，避免清空后追加留下半成品。R2 迁移仅改写指定旧桶 URL，并发保护阻止覆盖计划后已编辑字段。

## 部署

静态图片和代码需随部署产物发布；R2 文件无需放进 Git。内容更新后仍需 revalidate / 刷新验收。仅用户要求时 commit / push；见 [媒体运维](experience-media-storage.md)。
