# Workbench 图表规范

当前版本 **v3，2026-10-29**。用户要求图表形式服从内容，减少重复的分组框，并取消突兀的绿色。前三篇保留七组双语图：职责分支、MCP 拓扑、双路径合流、MVP 旅程、选型判断、可信边界、失败时序。功能验收与价值验证采用可选择的 Markdown 对照表；工程规约保留文字列表。

## 配色与字体

采用 Radix Gray 的中性灰阶，结合本站白底、炭黑文字的既有呈现；配色用途参考 [Radix 灰阶选择](https://www.radix-ui.com/colors/docs/palette-composition/composing-a-palette)、[色阶用途](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)及 [IBM 中性色规范](https://www.ibm.com/design/language/color/)。这些资料提供原则和参考，不意味着采用了它们整套设计系统。

| 用途 | 颜色 | 对应 |
| --- | --- | --- |
| 画布 | `#ffffff` | 与网站白底衔接 |
| 少量分支或节点底纹 | `#f9f9f9` | Radix Gray 2 |
| 分隔线与分组边界 | `#d9d9d9` | Gray 6 |
| 关系与流程连线 | `#838383` | Gray 10 |
| 次级说明 | `#646464` | Gray 11 |
| 主文字与图标 | `#202020` | Gray 12 |

全部为无色相中性色；不使用绿色、陶土色、彩色标题栏、渐变、阴影或装饰性外框。不以灰色深浅编码未经测量的数量。图题 Georgia / SimSun，条目及说明 Arial / Microsoft YaHei；Lucide 线性图标 1.6 单位线宽。

## 先选表达，再选外观

- 职责与能力关联用分支图；系统连接用拓扑；不同起点汇入共同结果用合流图。
- 用户完成任务的顺序用旅程；真正的条件判断画出两个结果和回路；有时间先后的交互用时序图。
- 框只表达真实的包含或可信边界，不再把每段正文包进相同的三栏容器。箭头必须有方向含义，关联分支不强加步骤编号。
- 简单列表不配重复图片；比较问题优先采用可复制的表格。没有数量依据时不画饼图、雷达图、排名或百分比图。
- 标题、正文问题、图中实体与连线必须一致。图不适合所在小节时重画或删除，不能靠过渡文字硬解释。逐项对应见 [content-map.md](content-map.md)。
- 保留必要的前置场景与图注，不机械地在每个二级标题后插图。保留提示词、契约与代码的可选择文本。

## SmartDiagram 的实际用途与边界

已查看 `G:\project\SmartDiagram` 的架构文档、前后端引擎目录、模板规则，以及各画布适配器；选型依据见 [research-and-selection.md](research-and-selection.md)。项目当前提供七类图表引擎，适用范围远不止流程框。

本图集保留可送回相应画布编辑的格式：Markdown 思维导图、React Flow JSON、draw.io XML、AntV Infographic DSL 和 Mermaid。生成时实际调用 SmartDiagram 的 Mermaid 清洗器，保存逻辑源文；网站图像使用本仓库的原生 SVG 排版和 sharp 导出，以控制灰阶、字体和内容位置。**没有启动 SmartDiagram 服务、调用其 LLM，也没有将这些图片冒称为其画布实际导出的结果。** 未修改 SmartDiagram 或 free-video-downloader。

| 图示 | 形式 | SmartDiagram 编辑格式 |
| --- | --- | --- |
| `environment-toolkit` | 职责分支 | Mindmap Markdown |
| `environment-mcp` | MCP 接入拓扑 | Draw.io XML |
| `scope-paths` | 双路径合流 | React Flow JSON |
| `scope-mvp` | 单次练习旅程 | AntV `sequence-timeline-simple` |
| `architecture-decisions` | 判断与修订回路 | Mermaid flowchart |
| `architecture-boundaries` | 可信边界 | Draw.io XML |
| `architecture-failures` | 成功／失败时序 | Mermaid sequenceDiagram |

## 文件与再生成

- [style.json](style.json)：颜色、字体、原则和参考来源。
- [catalog.mjs](../../../scripts/notes-diagrams/catalog.mjs)：双语图题、图注、位置和逻辑。
- [editorial.mjs](../../../scripts/notes-diagrams/editorial.mjs)：形式、说明和适用边界。
- [smart-sources.mjs](../../../scripts/notes-diagrams/smart-sources.mjs)：各引擎编辑格式。
- [native-svg.mjs](../../../scripts/notes-diagrams/native-svg.mjs)：七类原生图形的文字、几何和连线。
- [render.mjs](../../../scripts/notes-diagrams/render.mjs)：导出 SVG / WebP、源码和 [manifest.json](manifest.json)。

统一 1040 单位宽，按内容定高度，WebP 为两倍分辨率。保留中英文字间空格，并检查英文换行和标签与连线。`rendered/` 只保留当前 14 张 WebP 及对应 SVG；`sources/` 保留编辑格式和辅助 Mermaid 逻辑。

```powershell
node scripts/notes-diagrams/render.mjs --smartdiagram 'G:\project\SmartDiagram'
# 仅输出单幅双语预览，不改正式清单：
node scripts/notes-diagrams/render.mjs --smartdiagram 'G:\project\SmartDiagram' --preview scope-paths
```

公开图使用 `notes/workbench-diagrams/v3/<id>.<lang>-<hash>.webp` 独立对象，不覆盖旧图。渲染不会自动上传或写 CMS。

本地看图、源码核对及公开 HTML 检查不代替浏览器页面巡检。当前 Work 设置禁用浏览器操作，未完成 v3 实际页面截图、窄屏或语言切换测试；保留现有原图入口，未声称图片在移动端会自动重排。发布证据及回退方式见 [v3 执行记录](../../exec-workbench-visuals-v3-2026-10-29.md)。
