# 第四章正文实际发布 · 2026-11-18

读者仍看到旧内容的原因是：正常配置下文章优先读取 Supabase CMS，2026-11-17 的五站补充只写入源稿和静态回退。此前空 Supabase 配置的预览没有验证实际数据来源。本次修复这一发布遗漏，并删除用户圈出的线框图底部说明。

## 内容与图源

- 中英文正文保留七个二级章节、各三份提示词和三张配图。Footer.design 放在第一节“认识页面的收尾”；Refero Styles 放在第二节的视觉规则；CTA.gallery 放在第三节的操作入口；第三节“五站参考”表衔接 Scrolltide 和 Scroll Shaders 的滚动、动态背景示例。
- 图源 `scripts/notes-diagrams/ui-prototype.mjs` 删除 `ui-reading-order` 的底部说明，中英文同步；画布同时去除分隔线和多余高度，保留提交后反馈的标注。其余图的内容与字节不变。
- 中英文源稿、正文回退、图片及原图入口同步；已运行本地图片尺寸索引生成器，远程图不伪造本地尺寸。

## 发布范围与保护

先定向生成六张章节图，只改变两张线框图；使用 `publish-ui-prototype-assets.mjs --diagrams-only --apply` 上传新哈希对象、公开读回并校验 SHA-256。其余四张图只验证，旧对象及历史 HTML 收据保留。

| 语言 | 新图片 |
| --- | --- |
| 中文 | [ui-reading-order.zh-6e2c9509d7fa.webp](https://media.qiannawang.com/notes/workbench-diagrams/v3/ui-reading-order.zh-6e2c9509d7fa.webp) |
| 英文 | [ui-reading-order.en-cfdde482e12e.webp](https://media.qiannawang.com/notes/workbench-diagrams/v3/ui-reading-order.en-cfdde482e12e.webp) |

CMS 发布器补充应用入口支持，保留旧哈希资产校验分支。已先在浏览器确认线上 React 实验室路径可用，再统一正文与资源地址。默认先保存现有 CMS 全记录和计划，应用时重新核对源摘要、旧数据与 `updated_at`；使用现有管理员登录及 RLS，没有修改权限或 schema。

- 备份与实际应用计划：`C:/Users/U0016735/AppData/Local/Temp/qianna-ui-prototype-publications/2026-11-18T07-52-46-178Z.json`，位于系统临时目录，不进入 Git。
- `notes` 仅变化 `excerpt`、`excerpt_en`、`body_markdown`、`body_markdown_en`。标题、状态、发布日期等元数据保持原值。
- `notes.updated_at`：`2026-11-18T07:53:18.157655+00:00`。
- 第四阶段仅更新资源字段，补齐五站与当前实验室入口，保留原 `prompt-density-ux` 和其他七阶段；`workbench_pipelines.updated_at` 为 `2026-11-18T07:53:19.117098+00:00`。
- 发布后匿名读回逐字段一致。再次运行只读计划，`changedNoteFields` 为空、`stageChanged` 为 false。

## 验证与交付状态

- 正常 `.env.local` 配置下的本地第四章已刷新验证，使用 CMS 正文；没有关闭 Supabase 或改写环境文件。
- [线上第四章](https://www.qiannawang.com/notes/ui-prototype-ergonomics?from=workbench) 已检查中英文新目录、五站正文与实际外链。中文配图通过线上图片优化地址显示新哈希图，底部说明及横线已消失；英文正文引用对应新图。
- 默认桌面 1280 × 720 与手机 390 × 844 检查通过。五站表有三列、五行正文；手机表格局部横向滚动，页面宽 375 px（视口扣除滚动条），没有整页横向溢出。临时视口已恢复。
- `sync-ui-prototype-note.mjs --check`、四个修改脚本的 Node 语法检查通过；图集清单对照 HEAD，只有 `ui-reading-order` 两个语言条目变化。
- 同进程运行媒体与静态媒体测试：22/23 通过。唯一失败是既有静态清单测试硬编码 182 个 public 文件，当前为 196；多出的 14 张第八章图片全部已存在于 HEAD，本次没有修改这些图片、静态别名清单或测试。本次 R2 与迁移保护的 20 项检查均通过。
- 正文发布时内容已同步至 CMS 与 R2；当时没有另行部署应用或新增 Git 提交。后续 Git 保存与推送状态以提交记录为准。

截图位于 `C:/Users/U0016735/.codex/visualizations/2026/11/10/01a1c365-b320-76e1-83df-c1255372cf09/`：`chapter04-published-five-sites-2026-11-18.png`、`chapter04-published-clean-wireframe-2026-11-18.png`、`chapter04-published-five-sites-zh-mobile-2026-11-18.png`、`chapter04-published-five-sites-en-mobile-2026-11-18.png`。这些截图来自实际线上 CMS 阅读页。
