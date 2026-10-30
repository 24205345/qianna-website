# 首页 Notes 按浏览量展示三篇

2026-10-29：代码与 SQL 已完成本地验证。按用户选择，本轮不执行生产 SQL，不部署应用，未 commit / push。

后续 Git 交付：用户随后明确要求整理文档并 commit / push，本文件、代码、测试与待执行 SQL 纳入 [统一交付](exec-notes-workbench-delivery-2026-10-29.md)。SQL 尚未在生产执行；推送触发应用部署后仍使用最新文章回退，直到 SQL 完成并核对真实排名。

## 展示与取数

首页 Notes 从最新三篇改为累计浏览量最高的三篇，继续复用 `EditorialNotesSection` 的标题、摘要、标签、日期与版式。Notes 列表页仍保留原有顺序。

排名使用现有 `page_views` 的 Note PV：只计 `content_type = 'note'`，按文章 slug 汇总全部历史记录，不限最近 30 天，也不先拉取 1,000 条再截断计算。只选 `status = 'published'` 的文章；并列时按发布日期倒序、slug 升序稳定排列。零浏览文章可在不足三篇时补足，空发布日期放在同浏览量的有日期文章后。

`lib/notes/queries.ts` 新增 `getMostViewedNotes(3)`，调用数据库汇总查询并沿用英文优先、中文回退的标题和摘要。请求上限为 12；RPC 不存在或统计请求失败时回退到最新文章，避免首页整个板块出错。成功返回空数组时保留空状态，不把静态文章混入真实空榜单。

## 待执行 SQL

迁移文件由 Supabase CLI `migration new home_most_viewed_notes` 创建：

[`20261029101219_home_most_viewed_notes.sql`](../supabase/migrations/20261029101219_home_most_viewed_notes.sql)

函数 `public.get_most_viewed_notes(p_limit integer default 3)` 只返回已发布文章的七个公开预览字段，不返回浏览量、访客哈希、访问路径、访问时间或原始统计行。它是有意开放给匿名访客的有限只读排名接口，因此不能套用要求登录用户的鉴权条件。读取私有统计采用 `SECURITY DEFINER`，使用固定空 `search_path`、全限定表名、显式发布状态过滤和最多 12 行的限制；撤销默认 `PUBLIC` 执行权，再仅授权 `anon` / `authenticated`。既有表的权限和 RLS 不变，无需 service role 或管理员密码进入应用。

现有 `(content_type, content_slug, viewed_at desc)` 索引可支持每篇文章的计数。没有增加写入触发器、冗余计数表或定时刷新任务，原有浏览记录与去重逻辑保持原状。

## 本地验证

- `npm run lint`、`npx tsc --noEmit --incremental false`、`git diff --check` 通过。
- 新增 `tests/popular-notes.test.mjs`，七项测试验证 RPC 顺序、公开预览映射、双语回退、空榜单、缺少迁移、网络异常、静态回退和参数边界；入口为 `npm run test:notes`。沙箱禁止测试运行器创建子进程时，可用 Node 24 的 `node --test --test-isolation=none tests/popular-notes.test.mjs`。
- 在临时 PGlite 0.5.13 / PostgreSQL 18.6 中实际执行 SQL 两次，验证可重复运行；构造超过 Data API 默认行数上限的统计，检查累计排名、其他内容类型排除、草稿与无对应文章的统计排除、并列顺序、零浏览、空日期和限制参数。新增浏览后排名立即更新。
- 模拟 `anon` 验证能执行排名函数、不能直接读取 `page_views`、不能查询草稿；未授权角色不能执行函数。返回结果仅包含七个公开预览字段。
- 通过现有管理员登录，仅用 `head + count: exact` 读回生产各篇公开文章的累计 PV，未拉取访客明细。此次快照的前三名为 Architecture & Contracts、个人作品集建站实录、Scope & Product Definition，说明按浏览量会与当前最新三篇有所区别。

临时运行时、验证脚本与快照保存在已忽略的 `.media-migration/`，不进入 Git 或部署包；PGlite 不属于项目依赖。上述 SQL 验证不代表生产 Supabase 验收，也未执行线上浏览器交互测试。

## 上线顺序

1. 将 Supabase 连接切换到网站项目 `aqsdwfocoocnzyxopvvg`，执行这份 SQL；也可以在该项目的 SQL Editor 执行同一文件。当前 MCP 账号的可访问项目列表不包含此项目，本轮已按用户要求停留在代码与 SQL 交付。
2. 用匿名客户端调用 `get_most_viewed_notes`，与后台累计 PV 排名核对，确认只返回公开预览字段；运行项目安全 Advisor 检查新增接口。
3. 发布应用代码，再核对首页 Notes 三篇的顺序、链接、英文标题与窄屏显示。SQL 未执行时，代码会继续显示最新文章作为回退，不能把这种状态认定为热门排序已上线。
