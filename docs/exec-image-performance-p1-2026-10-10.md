# 图片性能第一阶段实施 · 2026-10-10

基于 [评估记录](exec-image-performance-2026-10-10.md) 实施前三项。状态：代码与本地生产构建验证完成，本记录随实现提交到 Git；Vercel 上线结果仍需另行验收。没有改数据库结构、RLS、媒体对象或 Cloudflare 配置；翻页预取和 Worker 不在本轮范围。

## 改动

1. **容器感知的响应式图片规格**：`lib/media/image-sizes.ts` 集中记录现有 max-w-5xl / max-w-6xl 容器、内边距、卡片内边距、网格间距和断点。用于首页项目 / Traces、Photography、Field Notes 图集及列表；Gallery Field Note 的全屏封面明确使用 `100vw`，将弃用的 `priority` 改为 `preload`。布局、质量、图源及高 DPR 候选规格保留。未来改变这些布局时同步修改 sizes。
2. **Notes 正文图**：`NoteImage.tsx` 使用 `getImageProps` 为本地和已配置公共媒体路径生成响应式 src/srcset，原生 img 保留未知比例与外部来源兼容，统一 lazy / async。静态图使用真实 width/height，避免未知图片被强制为假定比例；未知远程图仍需未来补充尺寸元数据才能预留精确空间。优化请求失败时回退原图。只把公开图片规则传入客户端，不传 S3 / Supabase 私密凭据。
3. **配置共用**：`lib/media/image-config.ts` 同时供 next.config 与 Notes 来源判断使用，沿用既有 Supabase 公共路径及 R2 HTTPS / 主机 / 路径 / 查询参数限制；外部链接原样 lazy 加载，不扩展优化器白名单。排除协议相对 URL、凭据 URL 和优化器自身路径。
4. **本地图片尺寸清单**：新增 `scripts/generate-note-image-metadata.mjs` 和 `lib/notes/local-image-metadata.json`，现有 13 张图均已测量。`npm run generate:note-images` 可手动更新，`prebuild` 自动刷新；新增或替换 public/notes 图片后，本地开发也应执行一次。只读取图片尺寸，不改原图内容。
5. **摄影批量查询**：获取已发布集合后，照片用 `.in("collection_id", ids)` 一次批量取数，按集合分组；按 collection_id、sort_order、id 确定稳定顺序。使用 exact count 与 range 分页，按实际返回条数递增偏移，避免接口上限导致图库截断。当前 46 张图只需一次照片查询；失败或空集合保留对应静态回退，集合元数据仍来自 CMS。

## 验证

- `npm run lint`：通过。ESLint 排除了已由 Git / Vercel 忽略的本地 `.media-migration/**` 证据目录。
- `npx tsc --noEmit`：通过；生产构建也包含 TypeScript 检查。
- `npm run build`：通过，预构建测量 13 张本地 Notes 图。现有 middleware → proxy 弃用警告仍存在，本次未改认证链路。
- `npm run test:performance`：4 项通过，覆盖可优化来源边界、批量取数 / 发布过滤、较低 API 行上限分页、查询失败与未配置回退。
- `npm run test:media`：20 项通过；首次沙箱运行受子进程 EPERM 限制，提升权限重跑后通过。
- 用现有公开 Supabase 连接只读对比旧版与新版实际返回：3 个集合分别 10 / 18 / 18 张，共 46 张，结果完全相同；该函数 REST 请求由 4 次降至 2 次。未写入线上数据。
- 本地生产构建（临时 localhost:3005）浏览器验证：1920px / DPR 1 时，项目主图 487px 选择 w640，副图 325px 选择 w384；摄影 299px 选择 w384。首页查看了 390、768、1024、1920px 断点，浏览器覆盖尺寸已恢复；390px 重新进入后项目图选择 w384。
- Notes 初始 9 张图中仅 1 张加载，另外 8 张未触发；全部具备 lazy / async / 真实静态尺寸。中英文切换正常；跳转到 8.4 后最后两张图均成功显示，优化请求为 w828。
- 浏览器实测为 DPR 1；srcset 保留高 DPR 规格，DPR 2/3 人工画质对比和真实移动网络 LCP 尚未完成，不据此声称全站加载时间降幅。

## 环境限制与上线验收

本机代理仍将 media.qiannawang.com 解析到私网地址；**本地 production 模式的 R2 优化请求被 Next.js 私网源保护拒绝**，因此本次不能声称本地生产预览的所有 R2 图均显示成功。Notes 的本地图优化显示已验证；R2 的请求规格与公开数据已核对。既有 development 模式 `DEV_IMAGE_UNOPTIMIZED=true` 继续有效，没有开启 `dangerouslyAllowLocalIP`。此环境问题见 [媒体运维](experience-media-storage.md)。

后续部署当前代码后，应检查生产首页 / 图集 / Notes 真实加载、远程新上传图与外部图片兼容，并在固定冷 / 暖缓存和移动网络条件下比较 LCP、CLS、下载字节和错误率。确认原图回退不持续掩盖优化器配置错误。当前没有启用新跨请求数据缓存，不需要增加后台缓存失效逻辑。

本地只读证据位于 Git 忽略目录 `.media-migration/p1-live-query-check.json` 及临时预览日志。保留迁移回滚清单，不提交该目录。

## 相关文档

[架构](architecture.md) · [开发指南](developer-guide.md) · [评估](exec-image-performance-2026-10-10.md) · [Next.js Image 官方文档](https://nextjs.org/docs/app/api-reference/components/image) · [Supabase in 查询](https://supabase.com/docs/reference/javascript/in)
