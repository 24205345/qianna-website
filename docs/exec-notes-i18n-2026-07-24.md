# 执行文档：Notes 四项优化（双语 / 配图 / TOC / 润色）

日期：2026-07-24

## 需求

1. 正文补回有信息量的原文配图  
2. 首页与 Notes 列表默认英文；详情可切 English / 中文  
3. TOC 在左侧并有独立滚动条  
4. 对外展示文案润色（去掉闲聊截图与口语碎念）

## 选定方案

表内英文字段 + 详情客户端语言切换 + `public/notes/<slug>/` 静态配图（权重最高，改动面可控）。

## 已完成

### 数据

- Migration：`title_en` / `excerpt_en` / `body_markdown_en`
- 笔记 `ai-video-downloader-summarizer` 已发布：
  - 中文 body ≈ 7948 字
  - 英文 body ≈ 9912 字
  - `title_en` / `excerpt_en` / cover 已填
  - 含配图路径与 ` ```prompt ` 块

### 代码

- `lib/notes/queries.ts`：列表/首页优先英文
- `NoteDetailView`：中英切换 + 左侧 sticky TOC 独立滚动
- Admin：`NoteForm` / `actions` / edit 页支持英文字段与中英正文切换编辑

### 资源

- `public/notes/ai-video-downloader-summarizer/image001|002|003|010.jpg`

### 文档

- `docs/experience-notes-i18n.md`

## 未做（需你确认）

- **未 commit / 未 push**（本地图片与代码改动上线需要你明确要求）
- 线上 Vercel 在 push 前仍可能看不到新配图与双语 UI

## 建议自测

1. `/` 与 `/notes`：标题/摘要为英文  
2. `/notes/ai-video-downloader-summarizer`：English↔中文切换；左侧 TOC 可独立滚动；配图与 prompt 块正常  
3. Admin 编辑页：可改英文标题/摘要/正文
