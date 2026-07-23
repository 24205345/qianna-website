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
5. 配图放 `public/notes/<slug>/`，正文用相对站点路径引用；勿把闲聊截图当正文插图。

## 大正文写入注意

Supabase MCP `execute_sql` 对超长字符串不稳定：用 **清空字段 + base64 分块 `||` 追加**，中英分字段分别追加，避免半截写入后重复执行导致重复内容（半截时先清空再重跑）。

## 部署

`public/notes/...` 图片与代码改动需 **commit + push** 后 Vercel 才会带上；仅更新 DB 不够。
