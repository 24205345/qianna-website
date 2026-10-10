# 图片加载性能评估 · 2026-10-10

本次为只读代码、线上页面与基础设施评估；没有修改应用、数据库、Cloudflare 配置或部署。代码基线为 `0064c9f`，现状架构见 [architecture.md](architecture.md)，媒体运维见 [experience-media-storage.md](experience-media-storage.md)。

后续状态：前三项已实现并通过本地构建、回归测试和线上只读查询比较，尚未部署；详见 [第一阶段执行记录](exec-image-performance-p1-2026-10-10.md)。本文下面的测量仍是改造前基线。

## 结论

存在可直接优化的过大图片请求、Notes 原图提前加载、翻页原图与摄影取数串行问题。优先改这些，继续使用现有 Next.js Image + R2 自定义域名。尚无证据证明新增 Worker 是首要解法；单纯转发原图的函数不会减少图片体积，也不会消除客户端到节点的网络波动。

“高性能函数”在本项目应具体指：图片规格选择、公开数据批量查询、有限的相邻图片预取，以及必要时生成并缓存图片变体。普通 React 计算函数不是当前已确认的瓶颈。

## 测量方法与边界

- 浏览器查看生产首页、摄影、ECS Notes 和本科作品集；桌面视口 1920 × 953、DPR 1，读取真实 `currentSrc`、元素宽度及加载属性。
- 公开 HTTP GET 两轮，每批并发 2，单次超时 25 秒；图片使用 `Accept: image/webp`、`q=75`，读取完整响应体和缓存头。未主动清除 CDN 缓存。
- 读取仓库静态图片大小及像素尺寸；Sharp 在内存中生成两个候选 WebP 样本，仅比较体积，没有替换原图或验收画质。
- Cloudflare MCP 只读查询 Smart Tiered Cache 和 Cache Rules；Context7 查询 Next.js 官方文档，并以仓库安装的 Next.js 16.2.1 文档核对 API。Firecrawl 在本会话没有可调用工具。
- 可复现探测脚本及原始 HTTP 样本位于 Git 忽略目录 `.media-migration/performance-probe-2026-10-10.{cjs,json}`；不得把该目录的其他迁移或回滚数据提交到 Git。
- 单机少量样本不代表不同地区、移动网络或真实访客的 p75。工具没有提供浏览器 Performance API，未测得 LCP/INP/CLS；响应头等待时间包含网络连接等开销，不能直接归因为服务端或数据库耗时。未测 GPU/解码热点。

## 确认的发现

### 1. 卡片 `sizes` 与有最大宽度的容器不匹配

| 页面 / 图片 | 实际 CSS 宽度 | 当前请求 `w` | 适合当前 DPR 的候选宽度 |
|---|---:|---:|---:|
| 首页主要项目 | 487px | 1200px | 640px |
| 首页次要项目 | 325px | 828px | 384px |
| 首页雨崩 / Getty | 418px | 1080px | 640px |
| 首页白崖 / 飞行 / 钢笔画 | 265px | 640px | 384px |
| 摄影列表首组 | 299px | 640px | 384px |

首页 `FeaturedProjectsSection` 使用 `58vw` / `42vw`，`VisualFootprintsSection` 使用 `50vw` / `33vw`；摄影列表使用 `33vw`。大屏上容器仍限制宽度，`sizes` 却继续随视口增大。

候选宽度来自现有 Next.js 离散规格；不是固定把所有用户降到这些尺寸。实现应把容器最大宽度、内边距、列间距、媒体断点写进 `sizes`，保留 DPR 2/3 所需高清规格。需要同时核对摄影 `sm` 两列、`lg` 三列的边界，不能仅替换桌面末项。

线上同一原图、同质量的实际响应体对比：

| 图片 | 当前规格 / 字节 | 候选规格 / 字节 | 体积减少 |
|---|---:|---:|---:|
| 雨崩卡片 | 1080 / 59,986 | 640 / 23,524 | 60.8% |
| 白崖卡片 | 640 / 32,302 | 384 / 11,796 | 63.5% |
| The Cat Charmer | 640 / 33,642 | 384 / 13,878 | 58.7% |

两轮每个规格的字节数一致。这些百分比只表示三个样本的传输体积，不是全站或加载时间的降幅。

### 2. Notes 直接加载 PNG 原图，缺少懒加载和响应式规格

`app/notes/_components/NoteMarkdown.tsx` 的图片渲染是普通 `<img>`，没有 `loading`、`decoding`、`srcset` 或尺寸元数据。线上 ECS 文章首次进入、尚未滚动时，9 张图全部已完成加载；可见宽度 816px，原图宽度 933–1674px。仓库这 9 张 PNG 合计 **1,753,685 字节（1.67 MiB）**。

建议正文非首屏图使用懒加载、异步解码，已知本地 / R2 来源采用响应式优化；未知外部 URL 保留兼容，不随意放宽远程图片白名单。通过上传或内容解析获取尺寸 / 比例，减少图加载后的布局跳动。首屏关键图单独判断，避免一律懒加载。

### 3. 作品集翻页仍使用静态高清 JPEG

`PortfolioFlipBook.tsx` 使用普通 `<img>`；跨页图宽 3600px，封面 / 封底宽 1800px。15 张原图合计 **13,561,085 字节（12.93 MiB）**；初始 `eager` 的唯一 URL 为 01、02、03、15，合计 **2,996,397 字节（2.86 MiB）**。这是文件体积清点，不是浏览器首次传输字节的网络记录。

浏览器初始状态：04–14 的懒加载图 `currentSrc` 为空、`naturalWidth=0`；没有证据表明一次下载全部 15 页。跨页左右半页复用同一 URL，不能把两个 DOM 图当成两次完整网络传输。

建议当前跨页与相邻一页按需加载、在空闲时预取下一页，封底按接近时加载；跳转目录要能及时加载目的页。保留原始高清版本供放大 / 下载，展示版本依据实际跨页宽度与 DPR 选择；两半页裁切逻辑保持一致。摄影灯箱可采用相同的有限预取模式，避免预取全图集。

内存编码样本：02.jpg 从 886,560 字节转为 1920px WebP q75 后为 153,768 字节；Notes 第一张截图从 888,411 字节转为 960px WebP q75 后为 18,286 字节。**仅为候选规格的体积实验，文字可读性、细线和高 DPR 画质尚未验收，不作为上线参数。**

### 4. 摄影页面存在逐集合串行取数

`lib/photography/queries.ts` 先获取集合，然后在 `for` 循环中逐一 `await` 照片查询。当前线上 3 个集合意味着该路径通常需要 1 + 3 次串行查询。

建议获取集合后，用 `.in("collection_id", ids)` 一次获取相关照片，按集合分组并维持 `sort_order` 和单集合静态回退语义，减少为两次查询。也可评估关联查询，但需核对 RLS 与关系定义。此改动有望缩短页面返回前的等待，实际收益需要服务端查询计时验证。

`getSiteSettings` / `getSiteNavigationItems` 在 metadata 和页面中重复调用，当前没有显式 React `cache` 包装；这是去重候选，是否已被底层 fetch 去重需要追踪，不能直接断言多发请求。先用请求内去重，跨请求缓存作为独立改造：仅缓存公开数据，不能把读取 cookies 的客户端或管理员数据放进全局共享缓存；配套后台发布后的失效规则。目前没有启用 Cache Components，不能直接照搬 `use cache` 示例。

### 5. 缓存已经工作，但网络存在波动

本轮六个优化规格的 12 个响应中，11 次 `x-vercel-cache=HIT`，另一次第一次 MISS、第二次 HIT；都返回 `public, max-age=31536000, must-revalidate`。本站 `/_next/image` 上的 `cf-cache-status=DYNAMIC` 不等于 Vercel 图片缓存失效。

| 页面 | 两轮响应头等待 | 两轮完整响应 |
|---|---|---|
| 首页 | 1643 / 603ms | 1649 / 881ms |
| 摄影 | 1692 / 744ms | 1695 / 746ms |
| ECS Notes | 987 / 572ms | 1279 / 855ms |
| 作品集 | 522 / 495ms | 527 / 496ms |

HTML 都是私有 / 不缓存响应，说明公开页面缓存有评估空间；不证明所有等待都来自动态渲染。图片也出现小规格第一次比大规格慢的样本，不能用一次测速承诺提速倍数。

此前同会话 R2 Hero 原图请求 `CF-Cache-Status: HIT`；其 408,814 字节已是 WebP，1920px 优化版 394,914 字节，体积仅减少约 3.4%。Hero 应先看首屏时序和移动端规格，不宜继续盲目压缩或把所有卡片提高优先级。

Cloudflare 只读结果：Smart Tiered Cache `off`；`http_request_cache_settings` 没有 entrypoint ruleset。这表示没有该阶段的 Cache Rules，不代表所有缓存机制关闭。R2 的分层缓存能帮助边缘未命中的回源路径，无法解决已经命中的响应向用户传输仍慢的问题。

本地 `.env.local` 的 `DEV_IMAGE_UNOPTIMIZED=true` 会在开发模式直读原图；生产仍使用 Next.js 优化。必须分别报告本地与生产体验。

## 建议执行顺序

| 优先级 | 改造 | 收益依据 / 工作量 |
|---|---|---|
| P1 | 修正首页、摄影和 Field Notes 的容器感知 `sizes`，补缺失项 | 已确认过量规格；低工作量，需多断点 / DPR 画质验收 |
| P1 | Notes 图片按可见性加载，已知来源响应式优化 | 已确认 9 张原图提前加载；低至中工作量，兼容 Markdown 外部来源 |
| P1 | 摄影照片批量取数，评估公共设置请求内去重 | 已确认串行循环；中工作量，保留回退、排序和 RLS |
| P2 | 翻页 / 灯箱展示变体与当前、相邻页预取 | 减少高清原图等待；中工作量，重点验收文字与目录跳转 |
| P2 | 检查并启用 R2 Smart Tiered Cache，评估公开内容缓存 | 适用于边缘 MISS / 动态数据路径；按命中率和时序判断，不全站 Cache Everything |
| P3 | 在现有优化仍不能满足目标时比较 Cloudflare Images / Worker | 需增加图片转换、缓存、规格约束与运维；先做隔离样本比较 |

建议第一轮只实施 P1，然后重复同规格、同浏览器条件的测量。优先编写的函数是公开照片批量获取 / 分组、受限来源的正文图片规格解析；下一轮再考虑有限预取和上传时变体生成。无需为每个模块新建一个云函数。

若使用 Worker，选明确方案：上传时生成版本化 WebP 变体写入 R2，或 Worker + Images binding 动态转换。动态方案必须限制对象来源、宽度、质量与格式，使用包含原图版本和参数的缓存键；避免任意远程 URL 与无限参数。Images binding 的结果不会自动缓存，转换涉及单独计费，需核对当前账户套餐和用量。不能同时让 Next.js 与 Worker 重复转换同一图片。

## 下一轮验收

1. 在 390px、768px、1024px、1920px 等视口和 DPR 1/2 检查 CSS 宽度、`currentSrc` 与画质；列断点无过量请求或模糊图片。
2. 统一浏览器冷 / 暖缓存条件和移动网络模拟，记录 LCP、CLS、图片传输字节、错误率；把页面等待、图片等待、下载、解码分开记录。
3. Notes 下方图不在初始阶段全部下载，滚动后正常显示；中英文切换、外部图片和新上传 R2 图片正常。
4. 翻页首次仅加载需要的展示规格，下一页、快速翻页、跨章节跳转和返回封面正常；相邻预取有数量上限。
5. 记录摄影查询数量和耗时；空集合、单集合错误、排序、发布状态与静态回退保持正确；后台更新后内容及时可见。
6. React / TS 改动按约定跑 lint、类型检查和构建；触及媒体适配器时跑 `npm run test:media`。此次仅评估文档，不声称已完成上述应用改造与验收。

## 官方参考

- [Next.js Image：sizes、loading、preload 与缓存](https://nextjs.org/docs/app/api-reference/components/image)；本次以已安装的 16.2.1 文档核对，`priority` 已被标记弃用。
- [Next.js metadata 与 React cache 去重](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)。
- [R2 自定义域名缓存](https://developers.cloudflare.com/r2/buckets/public-buckets/#caching)。
- [R2 Smart Tiered Cache](https://developers.cloudflare.com/changelog/post/2024-11-20-smart-tiered-cache-for-r2/)。
- [Worker Images binding 与缓存](https://developers.cloudflare.com/images/optimization/binding/)、[Images 计费](https://developers.cloudflare.com/images/pricing/)。
