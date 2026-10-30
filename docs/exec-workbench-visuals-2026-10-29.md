# Workbench 前三篇图文改版

2026-10-29。正文及图片已经发布到生产 CMS / R2，无须部署应用代码。

> 同日后续：用户否决了本次图表的默认布局。当前线上图集已由[第二版执行记录](exec-workbench-visuals-v2-2026-10-29.md)中的原生 SVG 设计替换；本文件及其中的窄屏截图仅保留第一版执行事实。

## 内容与视觉

为前三篇文章各制作三幅图，每幅分别提供中文、英文版本，共 18 张网站交付图片。

| 文章 | 图示内容 | 正文源文 |
| --- | --- | --- |
| [Environment & Infrastructure](https://www.qiannawang.com/notes/ai-infrastructure-coding-agents-and-models) | 工具职责、任务执行时序、最小开工检查 | [中文](notes/environment-infrastructure.zh.md) · [English](notes/environment-infrastructure.en.md) |
| [Scope & Product Definition](https://www.qiannawang.com/notes/scope-product-definition) | 两条起步路径合流、MVP 完整流程、功能验收与价值验证 | [中文](notes/scope-product-definition.zh.md) · [English](notes/scope-product-definition.en.md) |
| [Architecture & Contracts](https://www.qiannawang.com/notes/architecture-contracts) | 选型与验证、职责及可信边界、成功与失败时序 | [中文](notes/architecture-contracts.zh.md) · [English](notes/architecture-contracts.en.md) |

暖白、炭灰、鼠尾草绿与浅陶土组成共用配色；标题、细线 Lucide 图标、分隔线和留白使用同一套参数。没有测量依据的内容不制作排名或数量图。图表解释关系，契约字段和可复制提示词保留为正文。

风格基准见 [图表规范](diagrams/workbench/README.md)与 [style.json](diagrams/workbench/style.json)。[manifest.json](diagrams/workbench/manifest.json) 记录图源、尺寸、哈希和公开 URL；同时保留可编辑 Mermaid 源码、SVG、两倍分辨率 WebP 和九个图标文件。

精简重复的路径表、职责表、文字流程及部分解释。与发布前相比，排除 fenced code blocks 和新增图注后，普通正文的非空白字符减少约：Environment 中英均 12%，Scope 均 8%，Architecture 英文 10%、中文 9%。这不是整篇文章的总字数降幅。各语言的所有 fenced blocks 和 H2/H3 标题顺序逐项比较一致，精确契约与 PRD 仍可复制。

Environment 的模型和价格等资料沿用原文 2026-09-21 的时间边界；本次为图文编辑，不表示重新核查了全部工具资料。

## SmartDiagram 的实际使用

读取 `G:\project\SmartDiagram` 的架构、MermaidCanvas 与清洗器代码，直接调用该项目的 `normalizeMermaidCode`、`stabilizeMermaidFlowchartEdgeLabels`，并按其 Mermaid 初始化与渲染方式输出。Mermaid 固定为该项目版本 `11.13.0`；清洗器源码哈希已写入清单。

图的内容依据文章编排。没有启动 SmartDiagram 完整 Web/API 服务，也未调用其 AI 生成接口；该检出目录缺少本地配置与运行依赖。本次没有修改 SmartDiagram。网站侧 [catalog.mjs](../scripts/notes-diagrams/catalog.mjs) 保存图示内容，[render.mjs](../scripts/notes-diagrams/render.mjs) 提供可重复的主题渲染与导出流程，运行方式见图表规范。

## 发布范围

- Scope 和 Architecture 只修改 `body_markdown`、`body_markdown_en`；更新前逐字段比较快照，并以 `updated_at` 保护并发修改。
- Environment 原先只有静态回退，本次新增同 slug 的公开 CMS 文章，ID 为 `31414b7d-2a23-43bf-abea-08c6d6e7100e`。标题、摘要、标签、原发布时间沿用回退记录，保留原排序时间。静态回退本身未改动。
- 使用既有管理员登录，并检查 `app_metadata.cms_role=admin`；未使用 service role。匿名读回验证发布结果。
- 图片写入既有 R2，路径为 `notes/workbench-diagrams/v1/<id>.<lang>-<hash>.webp`。不可变对象使用内容哈希命名，上传禁止覆盖已有对象，公开读回校验 SHA-256。架构职责图在最终复核时去掉了一条多余连线，两个旧版本对象保留。
- Workbench 流水线、资源卡片和其他文章逐字段比较未改变。未改应用渲染、存储权限或上传逻辑；未 commit / push。

## 验证与边界

- `npm run lint` 通过。无 React/TS 业务变更，不涉及媒体迁移或上传代码。
- 三个生产文章地址均返回 HTTP 200；每页服务端 HTML 呈现三张图，并包含六个中英文图表 URL；图片通过现有 Next Image 渲染，提供 alt 与原图链接。
- 18 个最终公开 WebP 均返回 HTTP 200，内容类型为 WebP，SHA-256 与本地交付文件一致。
- CMS 回读的六份双语正文与本地文件完全一致；Scope、Architecture 的其余元数据和所有原有其他公开文章、流水线均保持一致。
- 实际 IAB 窄屏中查看了 Scope 中文首图，确认现有 Markdown / Next Image 可以显示新图；保存了 [页面截图](diagrams/workbench/published-scope-mobile.zh.png)。本次后续用户设置禁用了本地浏览器操作，未完成全部文章、语言的浏览器逐图巡检，也未进行桌面视口验收；不得将公开 HTTP / CMS 检查表述为完整浏览器验收。
- 本地查看图集并修正英文词间距、SVG 文本、双路径布局、分组标题与连线。图片采用独立双语版本，窄屏提供原图入口。

本地证据位于已忽略的 `.media-migration/`：`workbench-visuals-before-2026-10-29.json`、`environment-fallback-before-2026-10-29.json`、`workbench-visuals-plan-2026-10-29.json`、`workbench-visuals-assets-2026-10-29.json`、`workbench-visuals-composition-2026-10-29.json`、`workbench-visuals-published-2026-10-29.json`、`workbench-visuals-page-check-2026-10-29.json`。不提交凭据、签名上传地址或操作快照。

回退时需先比较当前 CMS 正文与本次发布快照；仅恢复本次改动的两组正文。Environment 如需恢复回退路径，先保存新增文章再将其移出公开状态。R2 对象保持不变，避免破坏已有访问与缓存。
