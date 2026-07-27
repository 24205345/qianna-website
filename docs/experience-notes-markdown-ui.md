# 经验：Notes Markdown 表格 / 代码块 / TOC 滚动条

## 场景

长笔记详情里表格挤在一起、代码块要可复制、左侧 TOC 默认滚动条过粗；后续还需要去掉卡片衬底，做成全高「播放列表」式目录轨。

## 做法

1. **TOC 轨（方案 A）**：桌面端 `sticky + h-svh`，上下 `py-7` 留白；去掉白底/边框；`mask-image` 上下渐隐；`justify-content: safe center` 短目录垂直居中，长目录可滚；滚动条 **2px**、轨道拉满列高。
2. **表格**：在 `NoteMarkdown` 自定义 `table/th/td`，`w-full` + `border border-stone-200` + `px-4 py-3`，单元格 `min-width` 避免列挤在一起；外层 `overflow-x-auto` 适配窄屏。
3. **复制**：抽出 `CopyButton`，挂在 `pre`（代码）与 ` ```prompt ` 卡片右上角；`navigator.clipboard` 失败时降级 `textarea` + `execCommand`。

## 注意

- `react-markdown` 的 fenced code 会同时走 `pre` 与 `code`；**外壳只放在 `pre`**：`code` 仅保留 `language-*` class，由 `pre` 识别 `prompt` / 普通代码并各渲染一层 + 一个复制按钮。切勿在 `code` 里再包一层卡片，否则会出现双层嵌套与两个复制图标。
- Admin 预览共用 `NoteMarkdown`，表格与复制按钮会一并生效，通常是期望行为。
- TOC 的 mask / 细滚动条仅在 `lg+` 启用；移动端目录跟在正文后，不做全高 sticky。
