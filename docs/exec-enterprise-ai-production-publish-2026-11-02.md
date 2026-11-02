# 第八章与 Workbench 生产发布

2026-11-02。补齐 2026-10-30 Git 交付后尚未执行的 CMS 发布步骤。第八章双语正文和 AI 工作流第八阶段已写入生产，并通过匿名读回及正式站点 HTML 核对。

## 实际发布方式

当前会话没有 Supabase 数据库 MCP 工具。本轮使用项目现有 `@supabase/supabase-js`，通过本地管理员登录取得用户会话，校验服务端 `app_metadata.cms_role=admin` 后，以 HTTPS 写入同一个 Supabase CMS。**这是管理员接口发布，不是 Supabase MCP 写入。** 未修改数据库权限或 schema，凭据没有输出或保存到发布快照中。

代码、图集和写作标准已在提交 [`d85434c`](https://github.com/24205345/qianna-website/commit/d85434cce0babff9d080ad65dc8d014ca625cc2f) 中交付。发布前确认正式站点六张双语配图均返回 `200 image/webp`，本轮不重复部署或上传图片。

## 写入范围与保护

- 项目：`aqsdwfocoocnzyxopvvg`。
- Notes：新建 slug `enterprise-ai-production`，状态 `published`；完整保存双语标题、摘要、正文、标签及封面字段。发布时间采用实际发布时刻，静态回退保留原稿准备日期。
- Workbench：仅更新 `ai-development` 的总摘要，并在当前七阶段后追加 `step-enterprise-production`，包含 8 张资源卡。使用读取到的 `updated_at` 作为并发保护条件。
- 原七阶段逐项保持一致；`spatial-design` 工作流及 AI 工作流其他字段保持一致。没有运行会重建内容的初始化脚本。

先保存生产快照和发布计划，再写完整 Notes 记录，随后追加工作流。快照、计划和操作日志保存在本机临时目录 `qianna-enterprise-cms-20261102/`，不包含登录凭据，不纳入 Git。两个表分别写入；发布日志记录各步骤完成状态，以便发生中断时查证后继续，避免重复新建。

## 验收证据

- 匿名查询可读到已发布 Note，正文与本地最终稿逐字段一致；数据库规范化时间戳按同一时刻核对。
- `ai-development` 共 8 阶段，第八阶段共 8 资源；新增阶段内容与本地版本一致，原七阶段及其他工作流与发布前快照一致。
- 正式文章 `/notes/enterprise-ai-production?from=workbench`、`/notes` 和 `/workbench` 均返回 HTTP 200，前两者包含新文章，工作台包含第八阶段与关联入口。
- 正式文章 HTML 有 9 个唯一标题，9 个目录目标全部对应，4 张文字表及 3 幅当前语言配图；页面数据包含双语内容。6 张配图的本地内容哈希与文件名一致，正式图片地址均可访问。
- 正文回退与图注同步的 `--check` 通过。本轮只发布已验证内容、更新维护文档，没有修改 React / TypeScript 或重新运行生产构建。

这里的正式页面验收为公开 HTTP / HTML 核对，没有将其写成新一轮手机浏览器交互验收；此前桌面与窄屏检查见[内容交付记录](exec-enterprise-ai-production-2026-10-30.md)。

公开入口：[第八章](https://www.qiannawang.com/notes/enterprise-ai-production?from=workbench) · [Workbench](https://www.qiannawang.com/workbench)。

Note ID：`07277620-519e-48c8-9332-9a0d4b86d3b4`。实际发布时间：`2026-11-02T01:42:01.232+00:00`。
