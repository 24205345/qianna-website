# 交互实验室直接接入记录

日期：2026-11-13。用户要求直接复制提供的 `frontend_prompt_lab.tsx`，只修改风格样式。此前独立制作的三方案作品集实验场不再作为本地入口。

## 实现

- 原文件复制到 `app/notes/ui-prototype-ergonomics/interface-lab/FrontendPromptLab.jsx`。附件不含 TypeScript 类型语法，使用 JSX 接入现有 React、Lucide、Tailwind，不添加运行依赖。
- 保留三栏工作台、四套预设、十个部位词典、全部配置、弹簧参数、预览缩放、标签页、折叠问答、骨架屏、通知和三种提示词视图。语法树提取比对确认 `ANATOMY_TERMS`、`PRESETS`、`OPTIONS`、`THEME_COLORS`、`generatedPrompt` 的初始化代码与附件一致。
- 独立 CSS 在页面内覆盖外壳为 stone 浅底、灰色细线、衬线标题与无衬线正文；保留预览内主题色和明暗等原选项。默认选择原有 Apple 亮色预设，窄屏纵向排列。
- 为 React 兼容将 X-Ray 包装器移到模块顶层，避免每次父组件更新改变组件身份；补充区域键盘选择与滑杆名称。剪贴板完成后才显示成功，拒绝时提供完整选中文本。原全局尺寸规则限定在实验室根元素。
- Next.js 页面等待异步 `searchParams`；英文入口默认显示纯英文提示词，控件保持原中文／双语。`beforeFiles` rewrite 让原 `.html` 地址到达新 React 页面，旧 `demo` 参数不再选择旧示例。隐藏此页的全站悬浮返回按钮。
- 浏览器首次检查发现开发服务阻止来自 `127.0.0.1` 的 HMR 连接，客户端没有完成初始化；按安装版本的 `allowedDevOrigins` 文档仅增加这个本机来源，重载后交互恢复。
- 双语正文使用说明、静态回退和 Workbench 资源说明同步更新；无关章节与五站参考指引保留。

## 验证

- `npm run lint`、`npx tsc --noEmit`。
- `node --test --test-isolation=none tests/frontend-prompt-lab.test.mjs`：5 项通过。覆盖四预设与提示词／预览联动、参数回显、区域键盘选择、样式变化保留标签页与问答状态、骨架屏与通知、英文模式、十条词典，以及剪贴板成功／拒绝。
- `node scripts/sync-ui-prototype-note.mjs --check`：双语正文、静态回退与资源同步。
- 真实浏览器在 1600 px 桌面与 390 px 窄屏检查布局；四预设、滑杆、内嵌标签页和问答、提示词视图、复制已实际操作。窄屏没有页面横向溢出。视觉结果以本轮截图为准。

桌面截图保存为授权可视化目录中的 `interface-lab-source-reskin-desktop.png`；窄屏截图为 `interface-lab-source-reskin-mobile.png`。

五个数据／生成代码块的 SHA-256 前缀，按附件与接入文件分别解析后均相同：

| 代码块 | SHA-256 前缀 |
| --- | --- |
| ANATOMY_TERMS | 113641637f67 |
| PRESETS | 552dfdd69244 |
| OPTIONS | fbd5d287653b |
| THEME_COLORS | f3b4ae0454cb |
| generatedPrompt | 700ee8816690 |

## 交付状态

仅本地代码与回退更新，未 commit、push、部署、上传 R2 或更新 CMS。原 `scripts/ui-prototype-lab/`、自包含 HTML 和 36 项旧版检查保留为历史实现，不用于验证新入口。既有资产收据和单 HTML 发布器对应旧版，不能作为当前 React 页面已发布的证据。
