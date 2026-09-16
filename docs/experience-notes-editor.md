# 执行记录：Notes 所见即所得富文本编辑器升级（参考 AI-Learning-Hub）

最后更新：2026-09-16（原 2026-07-23 方案 A 演进升级）

## 演进背景

原“左侧预览 + 右侧裸 `<textarea>`”在处理长篇技术笔记和表格时排版复杂度高、上下文跳转割裂。现基于现代 Headless 引擎 **Tiptap v3** 完成了现代化所见即所得重构，同时保持底层纯 Markdown 存储与零数据破坏。

## 核心架构与特性

1. **所见即所得与 Markdown 双向零破坏转换**：
   - 依赖：`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/markdown`, `@tiptap/extension-table*`, `@tiptap/extension-image`, `@tiptap/extension-link`；
   - 载入时以 Markdown 形式喂入，编辑中实时渲染排版；提交与保存时通过 `editor.storage.markdown.getMarkdown()` 导出纯净 Markdown；
   - 完美兼容现有数据库、前台 `/notes/[slug]` 渲染与静态回退数据；
   - 保留“Markdown 源码”双向切换开关，可随时切回代码模式微调。

2. **向下滚动固定布局与独立长文目录（TOC）**：
   - **双层吸顶布局**：
     - 顶层（`top: 0`）：中英多语言切换器、语言切换提示与实时字数/章节统计；
     - 次层（`top: 46px`）：左侧对齐 `Contents [章节数]`，右侧平齐对齐富文本工具栏；
   - **TOC 侧栏独立滚动**：高度固定为 `h-[calc(100vh-46px)]`，内置 `3.5px` 超细暖石色滑动条，长文目录浏览自如；
   - **视口高亮与精准直达**：`IntersectionObserver` 监听当前所在章节自动高亮；点击章节自动平滑滚动直达（`scroll-margin-top: 104px` 防止被工具栏遮挡）。

3. **可视化表格支持**：
   - 工具栏一键插入 3×3 结构化表格；
   - 光标处于表格内时，工具栏浮现专属增删行/增删列/删表控制按钮，告别手写 Markdown 管道符。

4. **极速图片插入与截图粘贴（Ctrl+V）**：
   - 原生监听粘贴事件与拖拽事件，剪切板截图直接 `Ctrl+V` 即可上传至 Supabase Storage（`portfolio-media/notes/attachments/`）并在光标处插入渲染。

5. **性能优化**：
   - `NoteForm.tsx` 采用 `next/dynamic(..., { ssr: false })` 对编辑器进行异步懒加载，避免重型依赖拖慢初始渲染。
