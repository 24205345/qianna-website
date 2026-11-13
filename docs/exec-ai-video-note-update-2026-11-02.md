# VidGrab 视频 Note 更新记录

**纠正说明：首次处理将增量补充扩大为整篇重写，并移除原截图引用，已按用户反馈撤回。最终恢复中英文完整原文、四张原图、六段提示词及原摘要标签，仅在附录前增加第七节。**

日期：2026-11-02。目标是按 `G:\project\free-video-downloader` 当前实现更新既有 [Building an AI Video Downloader & Summarizer with Cursor](https://www.qiannawang.com/notes/ai-video-downloader-summarizer)，保留开发案例主线，修正过时的架构、存储和部署说明。

## 内容与证据

目标项目复核版本为 `9c5732155e9df733476f5c1ca7c2b8975ac0932d`。只读取代码和公开配置样例；没有修改该项目，没有读取其未跟踪的 `.env`，没有启动模型、支付或视频处理任务。仓库没有 `.codegraph/`，按普通源文件核对。

| 内容 | 核对位置与结论 |
| --- | --- |
| 产品范围 | `frontend/src/views/`、`backend/ai_routes.py` 与社区路由：下载及本地上传、总结、章节、导图、转写、问答、测验、历史和社区 |
| 业务持久化 | `backend/auth_service.py`、`backend/membership_db.py`、`backend/repo.py`：当前主路径为 PostgreSQL，旧 SQLite 文件不能代表现状 |
| 任务执行 | `backend/main.py`、`backend/summary_tasks.py`：FastAPI BackgroundTasks、进程内实时状态；启动时将未完成分析标记为中断，不具备自动恢复执行 |
| 长视频 | `backend/transcript.py`、`backend/cloud_asr.py`：可用字幕优先、配置相关 ASR 回退、有限并行分段；部分句级时间由文字长度估算 |
| 文本综合 | `backend/summarizer.py`：14,000 字符直接处理阈值、约 6,000 字符分块、默认三路有限并行，按编号恢复顺序后汇总 |
| 视觉 | `backend/vision_transcript.py`、`backend/transcript.py`：弱旁白抽帧与配置相关音画融合，不等同完整逐帧理解 |
| 测验 | `backend/ai_routes.py`、`backend/repo.py`：试卷已持久化并有缓存，登录用户作答尝试写库；不是只存在内存 |
| 响应 | `frontend/src/views/HomeView.vue`：总结约 1.5 秒轮询；`frontend/src/api.js` 与问答路由：SSE 问答，区分进度、首个有效结果和完整完成 |
| 支付 | `backend/billing_routes.py`：可选 Stripe Checkout、签名验证、事件记录及 Portal；不把事件表当作已验证的并发幂等保证 |
| 部署 | `Dockerfile`、`compose.yaml`：Vue 构建后由 FastAPI 托管，另有 PostgreSQL 16、数据卷、外部 `vidgrab-shared` 网络与可选 Jeff 接法 |

项目 README / 架构文档存在旧 SQLite、测验只在内存、视觉默认开启等过时描述，本次正文以实际路由和存储调用为准。没有将线程池、数据库结果或模块存在推断为持久队列、自动恢复、企业租户隔离或实测提速。

官方参考核对了 [FastAPI BackgroundTasks](https://fastapi.tiangolo.com/tutorial/background-tasks/)、[Stripe Webhooks](https://docs.stripe.com/webhooks) 和 [Docker Compose 网络](https://docs.docker.com/compose/how-tos/networking/)，公开页面返回 HTTP 200。原文历史内容原样保留；当前实现、部署及支付条件的差异只在新增第七节说明。

## 本地源与图文

- 双语源：[中文](notes/ai-video-downloader-summarizer.zh.md)、[英文](notes/ai-video-downloader-summarizer.en.md)。原有章节、四张操作截图、六段提示词及所有步骤完整保留；仅新增第七节及两幅说明图。
- 增补位置：原附录前。第七节分为学习功能、长视频分段、学习记录与社区、当前版本变化；不改动原开发叙事和截图位置。
- [同步脚本](../scripts/sync-ai-video-note.mjs)从源稿生成 `app/_data/ai-video-note.json`，去除正文重复 H1，加入静态 `fallbackNotes`；`--check` 检查双语一致。
- 新增 `vidgrab-learning-loop` 和 `vidgrab-processing`，中英文各一张。复用中性灰、1040 单位画布、原生 SVG 排版和两倍 WebP 导出；实际调用 SmartDiagram Mermaid 清洗器，没有调用其 LLM 或冒称画布导出。
- 编辑源、SVG、WebP 和哈希保存在[图集](diagrams/workbench/README.md)；原 26 条清单记录逐项与 HEAD 比较不变，新增 4 条，总计 30 张。保留旧文章图片文件，未覆盖历史 R2 对象。

四个新 R2 对象为清单中的哈希文件：学习闭环 EN `397392627a66`、ZH `1bb3e0b4b1ce`，处理流程 EN `6a10acb874ad`、ZH `b7491be6c4eb`。公开 HTTP 读取的完整 SHA-256 与本地 WebP、清单完全一致。Node 直连曾超时，改用 AWS SDK 生成的短期签名请求，经 Python requests 上传并校验；签名只经进程内存传递，不进入仓库、文档或资产回执。

## CMS 发布

当前会话没有可调用的 Supabase MCP。实际通道是现有 Supabase JS 客户端和管理员登录，校验服务端 `app_metadata.cms_role=admin` 后更新既有记录，未把本地或 Git 更新称作线上发布。

- 记录 ID：`d8943b70-93b3-46b1-959f-f2e18af06360`；slug：`ai-video-downloader-summarizer`。
- [发布脚本](../scripts/update-ai-video-note-zh.mjs)沿用历史文件名，已改为双语完整发布；默认只读，显式 `--apply` 才写入，可用 `--expected-updated-at` 固定已核对的版本。
- 写前将原记录及拟写字段保存到系统临时目录 `qianna-video-note-publications/`；更新使用 ID 与 `updated_at` 并发保护，再匿名读回比对全部拟写字段和未改元数据。
- 最终摘要和标签已恢复备份值，正文只增加第七节；保留原 slug、状态、封面和发布日期 `2026-07-23T15:24:05.351265+00:00`，未改 Workbench。
- 最终 CMS `updated_at` 为 `2026-11-02T07:26:24.558566+00:00`；再次运行默认只读计划返回 `changedFields: []`。

## 验收与交付状态

| 检查 | 结果 |
| --- | --- |
| 双语源与生成回退 | `node scripts/sync-ai-video-note.mjs --check` 通过 |
| 语法与差异 | 发布脚本、图表模块 `node --check`；`git diff --check` 通过 |
| 工程检查 | `npm run lint`、`npx tsc --noEmit` 通过 |
| 相关既有测试 | `node --test --test-isolation=none tests/popular-notes.test.mjs tests/image-performance.test.mjs`，11 项通过 |
| 相邻文章保护 | 第八章图注同步和正文回退的两个 `--check` 均通过；原 26 条图集清单不变 |
| 正式 HTTP | Note、Notes 列表和 3 个文内站内链接返回 200；恢复后 Note 含原正文及新增第七节，原英文摘要已恢复 |
| 公开媒体 | 四张 R2 图片返回 200，完整 SHA-256 与本地一致 |
| 实际浏览器 | 首轮重写曾检查桌面与窄屏；恢复后另行核对正式页面原章节、操作截图、新增第七节和双语切换，不沿用重写版的节数与表格数 |

窄屏图片按比例缩放，较小标签通过原图入口查看；不宣称图内结构会重排。桌面与窄屏均确认中英文图片实际加载完成。浏览器临时视口已恢复，正式 Note 保留为可打开的结果页。

本次完成本地源稿、静态回退、文档与图集，且 R2 和生产 CMS 已发布；没有执行应用部署，新增静态回退需随后续应用版本部署才在无 CMS 环境生效。本次文章更新没有新增 Git commit / push。项目运行性能、各平台视频下载、ASR 质量、真实支付与租户隔离未在本轮做端到端运行验收，正文没有将其写成实测完成。

## 用户纠正后的恢复核对

- 备份来自系统临时目录 `qianna-video-note-20261102/before.json`；中文与 Git HEAD 原稿一致。删除唯一新增第七节后，匿名读回的中英文正文与备份逐字相等（首尾空白归一）。
- 四张原图 `image001/002/003/010.jpg` 的引用、顺序与位置不变，六段原提示词逐项一致；原摘要、标题、标签、封面、状态和发布日期与备份相同。
- 四张原图从正式网站 GET 均返回 HTTP 200、图片类型正确。新流程图只在 7.1、7.2 使用，不替代操作截图。
- `notes-writing-guide.md` 已明确补充功能默认增量编辑，保留步骤、代码、提示词及截图；没有明确重写授权，不重构全文。
- 本次只修正文、同步脚本常量、图表放置元数据及维护文档；不改网站渲染逻辑，不新增应用部署或 Git 提交。
