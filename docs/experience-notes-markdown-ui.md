# 经验：Notes Markdown 表格 / 代码块 / TOC 滚动条

## 场景

长笔记详情里表格挤在一起、代码块要可复制、左侧 TOC 默认滚动条过粗。

## 做法

1. **TOC**：容器加 `note-toc-scroll`，用 `scrollbar-width: thin` + WebKit `width: 3px`，颜色用 stone-300，与站点灰系一致。
2. **表格**：在 `NoteMarkdown` 自定义 `table/th/td`，`w-full` + `border border-stone-200` + `px-4 py-3`，单元格 `min-width` 避免列挤在一起；外层 `overflow-x-auto` 适配窄屏。
3. **复制**：抽出 `CopyButton`，挂在 `pre`（代码）与 ` ```prompt ` 卡片右上角；`navigator.clipboard` 失败时降级 `textarea` + `execCommand`。

## 注意

- `react-markdown` 的 fenced code 会同时走 `pre` 与 `code`；`prompt` 在 `code` 里渲染整块 `aside`，`pre` 需识别后直接透传，避免双重外壳。
- Admin 预览共用 `NoteMarkdown`，表格与复制按钮会一并生效，通常是期望行为。
