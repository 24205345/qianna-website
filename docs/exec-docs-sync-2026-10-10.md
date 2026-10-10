# R2 迁移后文档同步记录

日期：2026-10-10（Asia/Shanghai）。代码核对基线：[`0064c9f`](https://github.com/24205345/qianna-website/commit/0064c9f21b44dbb702040ce788320b698fe82c7e)。本次更新工程文档与 README，不改应用逻辑或云端数据。

## 1. 核对依据

- 当前 package.json、next.config.ts、公开环境模块、上传接口、Admin actions、初始化/R2 迁移脚本、首页、Workbench 查询和侧栏代码。
- 正式 `.media-migration/r2-plan.json` 聚合：160 文件、106,278,846 字节，159 行均为 applied，跳过缺失的 Workbench 表；原始字段与清单不进入文档或 Git。
- 本次项目限定 Supabase MCP 只读复核：源桶仍为 160 对象 / 106,278,846 字节，Workbench 表不存在；摄影 46、绘画 22、旅程 5、旅程媒体 66 行。
- Git 确认迁移已推送；当前 core.sparseCheckout=false，public/ 有 188 个已跟踪资产。
- Context7 查询 R2 官方资料；直接 HTTPS 核对 [Supabase changelog](https://supabase.com/changelog.md)、[R2 Public buckets](https://developers.cloudflare.com/r2/buckets/public-buckets/) 与 [Vercel Functions limits](https://vercel.com/docs/functions/limitations)。Firecrawl 当前仍无可调用工具。
- Next.js 16.2.1 随包文档：remotePatterns、unoptimized、私网源保护、默认 WebP 和 priority 弃用说明。

## 2. 更新范围

| 文档 | 变更 |
|---|---|
| README / AGENTS | Workbench、技术栈、R2 状态、开发入口、上传接口与清单保护 |
| 架构 | 生产 R2 数据流、Supabase 职责、静态资产、缓存、配置与回滚 |
| 开发指南 | 10 月状态、首页顺序、Node 路径、R2 配置、真实回退行为、脚本索引 |
| CMS Checklist | 合并重复规划，用实际交付、回归步骤、回滚与待办替代旧估算 |
| R2 / MCP 执行记录 | 首次迁移阶段值、部署快照、commit / push 与回滚边界 |
| 媒体运维经验 | 新增统一配置、裂图诊断、代理 DNS 开关、部署验收与回滚步骤 |
| 经验与历史记录 | 修正布局、Hero 路径、Notes 上传与静态部署；历史记录链接现状 |
| ECS Notes 中英文草稿 | 仅同步本站技术栈说明，未修改通用操作，未发布至线上 Notes |

## 3. 纠正的关键事实

1. 生产已切换 R2；接口默认 supabase 不代表生产仍使用 Supabase。
2. 160 为文件数、159 为改写行数；Field Notes 媒体 66 行，其中 62 图片 URL 切换、4 外链视频保留。
3. 普通 clone 包含静态资产；sparse-checkout 为可选方式。本次保留 public/ 与外链，不能直接删 Git 图片。
4. public-env.ts 有公开连接回退；删除 .env.local 不等于离线，静态默认数据也不是生产实时镜像。
5. 当次本地裂图来自代理 DNS 私网解析；开关只影响 development，生产继续优化，未开放私网源。
6. 初始化脚本可能重建记录，不能日常验收；migrate:r2 才执行存量复制、字段切换与清单回滚。
7. 真实生产上传验收覆盖 Notes；其他入口使用共用接口，不等于全部逐一做了真实生产上传测试。
8. 大文件签名直传、Workbench 表部署与生产回滚演练尚未完成。

## 4. 验证与交付边界

本次按纯文档改动检查本地链接/锚点、命令与 package scripts、配置与清单数量，并运行 git diff --check。20 项测试、lint、类型检查及构建结果引用前一轮迁移验收，不冒充本轮重新运行。

最终检查：扫描 33 份 Markdown，144 个本地链接（含锚点）均通过，当前工程命令均存在于 package scripts；29 个新增/修改文件全部为 Markdown，未发现已配置的本地秘密值，`git diff --check` 通过。外部链接记录了 40 处引用，未声称对所有外链逐一做可达性检测。

云端数据和环境配置未修改；历史部署 URL 只记为当次快照。本次文档同步不包含在 0064c9f 内，随后续图片性能第一阶段实现一起提交；见 [执行记录](exec-image-performance-p1-2026-10-10.md)。

待办见 [CMS 清单](cms-migration-checklist.md#5-待办与执行约定)；日常配置和排障查 [媒体运维](experience-media-storage.md)。
