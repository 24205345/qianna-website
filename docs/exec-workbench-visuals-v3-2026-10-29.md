# Workbench v3：中性色与按内容选择图表

2026-10-29。用户要求先核查 SmartDiagram 的实际能力，图表不限于分组方框，按段落需要使用；取消突兀的绿色，参考网上配色并把注意力放回内容。

## 最终改动

| 文章 | 采用的表达 | 删除或改为文字的部分 |
| --- | --- | --- |
| Environment & Infrastructure | 全文职责分支图；Host 内多个 Client 连接对应 MCP Server 的拓扑 | 工程规约已有三条规则，删除重复流程图，保留执行及交付检查说明。 |
| Scope & Product Definition | 起步路径合流；完整 MVP 旅程 | 功能验收／价值验证改为可复制对照表，替代图片及重复说明。 |
| Architecture & Contracts | 技术选型判断及修订回路；可信边界；成功／失败时序 | 保留有必要解释的关系，不新增数量图表。 |

当前为七组双语图，共 14 张 WebP 与对应 SVG，文章图片数分别为 2、2、3。章节、提示词及代码块保留。完整位置与取舍见 [content-map.md](diagrams/workbench/content-map.md)。

## 核查与视觉选择

已查看 SmartDiagram 的架构、当前引擎目录、模板分类、Mindmap／Flow／Infographic 画布输入和导出实现。七个可见图表引擎为 Excalidraw、Mermaid、React Flow、Mindmap、Draw.io、AntV Infographic 和 ECharts。没有数据依据，因此不添加 ECharts 饼图、雷达或百分比图；无需为了多样性使用 3D、漏斗或阶梯。证据路径见 [研究与选型](diagrams/workbench/research-and-selection.md)。

配色查阅 [Radix 灰阶](https://www.radix-ui.com/colors/docs/palette-composition/composing-a-palette)、[色阶用途](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)、[公开色值](https://raw.githubusercontent.com/radix-ui/colors/main/src/light.ts)和 [IBM Color](https://www.ibm.com/design/language/color/)。最终采用白色与纯 Gray：`#ffffff`、`#f9f9f9`、`#d9d9d9`、`#838383`、`#646464`、`#202020`。取消所有绿色和陶土色、彩色标题栏、阴影和装饰外框，以位置、实虚线及文字标注表达含义。

图形不再采用统一三栏卡片。框只用于 Host 包含关系、可信边界或时序替代分支。沿用网站衬线图题、无衬线说明，以及 Lucide 细线图标，保留中文与 Latin 之间的空格。

## 实现与 SmartDiagram 使用边界

- [catalog.mjs](../scripts/notes-diagrams/catalog.mjs) 保留七组双语标题、图注、章节与逻辑；[editorial.mjs](../scripts/notes-diagrams/editorial.mjs) 记录各形式及说明。
- [native-svg.mjs](../scripts/notes-diagrams/native-svg.mjs) 分别排版分支、拓扑、合流、旅程、判断、边界和时序，以适配本站灰阶、字体和标签位置。
- [smart-sources.mjs](../scripts/notes-diagrams/smart-sources.mjs) 保存对应 SmartDiagram 画布接受的 Markdown、React Flow JSON、Draw.io XML、AntV DSL 和 Mermaid。AntV 模板与 `data.sequences` 字段对照实际模板规则。
- [render.mjs](../scripts/notes-diagrams/render.mjs) 实际调用 SmartDiagram 的 Mermaid 清洗器，然后原生 SVG / sharp 导出两倍分辨率 WebP。清单准确说明引擎与来源，不声称由 SmartDiagram 画布自动导出。

未修改 SmartDiagram 或 free-video-downloader；未启动它们的服务，也未调用其 AI API。没有在全部画布里完成导入／编辑实测，源码格式核对不等于浏览器运行验收。

## 发布与验证

- 发布前匿名读取完整公开 Notes 与 `ai-development` Workbench 流水线；确认六份本地正文与线上一致，再生成新正文和回退快照。
- 14 张新图使用 `notes/workbench-diagrams/v3/<id>.<lang>-<hash>.webp`。R2 条件写入禁止覆盖，所有公开资产均返回 200、WebP 内容类型与匹配的 SHA-256。之后再生成结果哈希保持一致。
- 使用现有管理员登录，并校验 `app_metadata.cms_role=admin`；写入前再次比较目标记录，按 `id` 与 `updated_at` 限定更新三个文章的双语正文。
- CMS 回读逐字段比较：六份正文与本地一致，目标文章其余字段、其他全部公开文章及完整 Workbench 流水线未变。
- 本地逐张查看 14 张双语图，修正英文合流图的标题重叠及 MCP Client 标签与线条的相交。SVG / Draw.io XML 解析通过，React Flow 节点／边引用核对通过，全部实际 SVG 颜色来自六个中性色。正文及说明文字的对比度检查通过。
- 六份正文的标题层级和 fenced blocks 与发布前完全一致；14 个图的 URL 均位于预期章节。工程规约无图片残留，Scope 具备双语文字对照表。
- 三个公开页面均返回 200，实际呈现 2、2、3 张图并包含全部中英文新图引用，不再引用 v2 图片。Scope 服务端 HTML 包含实际对照表表头；图片沿用 Next Image 优化与 alt。
- `npm run lint`、`git diff --check` 通过。未修改业务 React／TS、数据库结构、权限、上传模块、静态媒体清单或依赖；未 commit / push。

Work 浏览器设置仍禁用浏览器操作，未完成实际页面截图、窄屏与语言切换巡检，也未通过其他浏览器自动化绕过。当前验证包括原生图像、源文、CMS 及公开 HTML，不能将旧版本页面截图作为 v3 证据。

## 证据与回退

忽略目录 `.media-migration/` 保存 `workbench-visuals-v3-{old-manifest,before,plan,assets,published,local,pages}.json`、发布和检查脚本。快照包含当时的公开 Notes 与流水线，不进入 Git。凭据、签名 URL 同样不提交。

本地移除已停用的 `environment-harness`、`scope-validation` 生成文件及旧配色图标，避免误用。保留旧 R2 对象与历史快照；回退前先比较当前内容，确认没有后续人工编辑，再只恢复目标文章的中英文正文。图片对象始终保持不可变。
