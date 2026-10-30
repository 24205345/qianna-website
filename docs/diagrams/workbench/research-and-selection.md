# SmartDiagram 能力核查与图表选型

2026-10-29，针对用户“形式不限于方框、少用颜色、图文匹配”的反馈。

## 查看了什么

读取 SmartDiagram 的 `AGENTS.md`、`smartdiagram_architecture.md`、README，以及当前实现：

- `apps/api-diagram/app/agents/catalog.py`：任务与引擎对应。
- `apps/web/src/shared/lib/config/diagramAgents.ts`：七个可见图表引擎和两个隐藏 HTML artifact 类型。
- `apps/web/src/features/diagram/ui/{MindmapCanvas,FlowCanvas,InfographicCanvas}.tsx`：实际输入格式、布局及导出方式。
- `apps/api-diagram/app/agents/infographic_agent.py` 与 `app/data/template_syntax.py`：模板按数量、比较、层级、列表、关系与顺序分类；其中 `sequence-timeline-simple` 使用 `data.sequences`。

CodeGraph 目录只有 `.gitignore`，CLI 报告没有可用索引，因此按其提示回退到定向读取，没有建立或修改索引。

## 能力与取舍

| 引擎 | 项目中的能力 | 本轮判断 |
| --- | --- | --- |
| Excalidraw | 白板、草图、低保真关系 | 不采用手绘抖动，保持网站现有线性图标与排版。 |
| Mermaid | 流程、时序、甘特和 UML | 用于条件判断及失败时序的可编辑逻辑。没有日期依赖计划，不加甘特。 |
| React Flow | 节点关系、流程和 DAG | 用于两条起点合流；节点位置与边的方向保存为 JSON。 |
| Mindmap | Markdown 层级，经 markmap 解析再供 mind-elixir 展示 | 适合全文职责概览，图形使用分支而非三栏卡片。 |
| Draw.io | 架构、拓扑与资源关系 | 用于 MCP 连接与可信边界，框表示实际包含关系。 |
| AntV Infographic | compare、hierarchy、list、relation、sequence 与 chart 模板 | 选时间线式 sequence 表达完整旅程；不用炫目的 3D、阶梯或漏斗形状暗示数量递减。 |
| ECharts | 柱、线、饼等数量图表 | 原文没有测量数据，不为展示能力添加虚构图表。 |

七组图并非追求七种外形：每一组都有不同的具体关系问题。两处仅重复正文的图改成列表或可复制的表格。SmartDiagram 模板是候选形式，仍需按文章内容审核。

## 配色参考与本网站决定

[Radix](https://www.radix-ui.com/colors/docs/palette-composition/composing-a-palette) 区分纯灰与带色相的灰；为了减少颜色干扰，采用纯 Gray。[色阶用途](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)区分背景、边线和文字，当前六个中性色按用途分工，具体色值来自[公开色板源码](https://raw.githubusercontent.com/radix-ui/colors/main/src/light.ts)和本站白底。[IBM](https://www.ibm.com/design/language/color/) 的灰阶与黑白基础作为补充参考，未复制其品牌蓝或整套配色。

不再以绿色表示主模块或通过状态。成功／失败用文字、实虚线及分支位置表达，数量图的渐变色阶不挪用于概念图。字体继续贴近网站衬线图题与无衬线说明的组合。

本轮交付为原生 SVG 静态插图，并保留对应引擎的编辑源码。没有启动 SmartDiagram 的浏览器服务或调用其 AI 生成接口；格式结构核对不等于已经在全部画布中完成导入和编辑实测。
