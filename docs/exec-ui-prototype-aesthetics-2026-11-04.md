# 第四章视觉说明补充 · 2026-11-04

## 来源与范围

用户提供 Anthropic 官方 [Prompting for frontend aesthetics](https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics)。本轮直接读取全文，采用其按设计维度描述、给出参考和限定单次调整范围的方法；以知识问答工具重新组织教学示例，没有复制原提示词，也没有把字体名单、字号比例、背景效果写成通用规则。

这是第四章正文的增量补充；独立实验室、图表和其他文章没有修改。

- 第二节增加“先约定视觉方向”：四方面视觉要求对照表、中文字体与既有设计规范的边界，以及一份可复制的视觉说明提示词。
- 第三节增加“一次聚焦一个维度”：固定内容／状态／视口基线，限定修改范围，再对照检查任务是否仍可完成。
- 双语各增加一段提示词。原七个二级章节、三张配图及两段原提示词逐项比较保留。
- Workbench 新增 `prompt-visual-brief`；全部旧资源和阶段其他属性不变。

## 同步与检查

`sync-ui-prototype-note.mjs` 从固定数量的顺序映射改为按第二、六、七节定位三段提示词，防止前置新增内容把旧资源错配。发布器采用相同资源 ID 范围，保留其余资源。

- 中英文语言检查、三段提示词与 Workbench 映射、生成回退同步通过。
- `npm run lint`、脚本语法检查、`git diff --check` 通过。
- 开工稿及同步／发布脚本备份位于系统临时目录 `qianna-ui-visual-brief-20261104`。
- 写入计划逐项核对 CMS 旧稿与开工稿一致；其他七阶段、全部旧资源及 Note 元数据保持不变。

## 发布状态

已更新 [正式第四章](https://www.qiannawang.com/notes/ui-prototype-ergonomics?from=workbench) 与 [Workbench](https://www.qiannawang.com/workbench)，匿名读回与正式 HTTP 内容核验通过。

- Note `updated_at=2026-11-04T02:09:53.479134+00:00`。
- Workbench `updated_at=2026-11-04T02:09:55.932673+00:00`。
- 发布计划及旧记录：系统临时目录 `qianna-ui-prototype-publications/2026-11-04T02-08-45-745Z.json`。

Supabase MCP 只读查询仍返回无权限；Node 默认连接又遇到 DNS 失败。使用原有管理员发布脚本，加系统临时目录内限定当前 CMS 域名的 HTTPS 传输适配完成发布。凭据只经内存和标准输入传递，没有保存到文件、终端或 Git。不是 MCP 写入，没有变更鉴权、权限、数据库结构或项目运行依赖。

本地源、回退和维护文档已同步；未部署应用、上传新媒体、commit 或 push。本轮只做正文与资源同步，没有完成或替代[上轮待进行的真实浏览器检查](exec-ui-prototype-audit-2026-11-03.md)。
