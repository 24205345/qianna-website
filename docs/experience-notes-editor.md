# 执行记录：Notes Admin Markdown 分栏编辑器

日期：2026-07-23

## 方案选择

| 方案 | 内容 | 权重 |
|---|---|---|
| A. 增强现有 MD 编辑器 | 分栏预览、工具栏、附件上传、TOC/章节分页、` ```prompt ` 提示词块 | **88** |
| B. TipTap / Milkdown WYSIWYG | 所见即所得，依赖重、风格难对齐前台 | 45 |

**已执行：A**

## 改动摘要

- [`app/admin/notes/NoteForm.tsx`](../app/admin/notes/NoteForm.tsx)：上方标题/摘要/附件；下方左预览、右 Markdown；左侧 Contents 章节分页；工具栏插入 Heading / Prompt / Image / Link / Code
- [`app/admin/notes/actions.ts`](../app/admin/notes/actions.ts)：`uploadNoteAttachmentAction` 上传到 `portfolio-media/notes/attachments/`
- [`app/notes/_components/NoteMarkdown.tsx`](../app/notes/_components/NoteMarkdown.tsx)：` ```prompt ` 渲染为 stone 风格提示词卡片（前台详情页一致）
- New/Edit 页宽改为 `max-w-7xl`

## 用法

1. 工具栏插入内容块，或右侧直接写 Markdown
2. `##` 标题自动进入 Contents，可按章节预览（Section ← / →）
3. 提示词：

````markdown
```prompt
你的提示词内容
```
````

4. 附件上传后自动插入图片 Markdown，可设为 Cover
