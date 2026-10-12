# Site Settings 首页展示图编辑修复（2026-10-12）

## 问题与修改

Projects / Traces 的「当前前台展示照片」原来只有展示和管理库链接，不能就地更换；摄影与手绘首页图来自固定配置，管理图库也不能直接修改这些展示位。

现在每张缩略图提供「更换图片」「恢复原图」「取消修改」。选图后缩略图与右侧实景预览同步，顶部保存后生效。文件输入始终挂载，切换板块或 Hero 标签保留待上传文件；保存后以 site_settings.updated_at 重建表单，清除待上传状态。

真实验收发现旧导航解析把 sort_order=0 当作缺省值，导致保存图片时顺带改写排序。现使用 Number.isFinite 保留零与负值，非法数字才回退；新增回归测试。验收产生的排序改动已恢复原值。Hero 上传提示也已改为实际媒体存储描述。

## 数据与权限

- home_featured_images 按 project:<slug> / trace:<id> 保存覆盖 URL；null 恢复原图。首页与后台应用覆盖，项目详情、列表及原图库封面保持原值。
- 只 upsert 发生变化的行；服务端从实际首页数据生成目标白名单，未知/过期目标与恢复/上传冲突报错。
- site-featured 沿用 R2 签名直传、HMAC 回执和对象校验。只允许 JPEG / PNG / WebP / GIF / AVIF，最大 32 MiB。
- anon / authenticated 可读；只有非匿名 app_metadata.cms_role=admin 可 INSERT / UPDATE，不授予 authenticated DELETE。
- 查询失败时首页保留原始图，后台显示读取/迁移错误；写入失败不会显示成功。
- 两项迁移均通过 Supabase CLI migration new 创建，再经 MCP apply_migration 执行；本地版本已对齐真实生产历史：
  - 20261012031537_home_featured_images.sql：创建表、权限、RLS 和更新时间触发器。
  - 20261012033201_home_featured_images_rls_initplan.sql：保持权限语义，以 (select auth.jwt()) 按语句计算 JWT，消除新表 auth_rls_initplan 提示。

## 已完成的真实验收

环境：本地新版 Next.js 预览 + 生产 Supabase 项目 aqsdwfocoocnzyxopvvg + R2 portfolio-media。此结论不等于正式网站已部署新版。

1. 浏览器分别选择现有项目、摄影和手绘素材；切换 Projects / Traces 后草稿仍在，一次点击保存完成三项 R2 上传和真实 Server Action 数据库写入。
2. 刷新页面后缩略图及预览 URL 与数据库一致。匿名 Data API 可读三项覆盖；R2 HEAD 大小、ETag/MD5、上传者及 scope 元数据均匹配源文件；首页 SSR 使用三项覆盖 URL。
3. 浏览器跨板块选择「恢复原图」并保存，三项 image_url 变为 null，首页回到原始来源。随后删除仅本次测试生成且不再被引用的三个对象与三条空覆盖记录；最终覆盖表恢复为空。原图库对象未删除。
4. 实际事务验证普通用户和匿名伪管理员不能写入，非匿名 CMS admin 可插入和恢复，anon 可读；事务回滚。RLS 优化后重跑通过。
5. 原项目与田野笔记封面均与基线一致；Hero 与导航业务字段按基线核对。最终新版浏览器再次保存后，导航零排序仍为 0，所有业务字段与基线一致；开发预览的 5 张缩略图和 5 张实景图全部加载。
6. 新表安全与性能检查无新增未解决提示。既有更新时间函数 search_path、Guestbook / Analytics security definer 暴露、密码保护及其他表性能提示仍是原有事项，未扩大权限来消除提示。

生产预览的 Next 图片优化请求在本机代理环境解析到私有 IP，因而被现有安全策略拒绝。直接 R2 缩略图及上传正常；开发截图使用已存在的 DEV_IMAGE_UNOPTIMIZED 本地开关。不能用开发直读截图代替正式域名优化端点验收，也没有放宽生产私有 IP 防护。

本地证据保存在忽略目录 .media-migration/site-images-live-check-2026-10-12.json；截图为 .media-migration/site-featured-images-fixed-2026-10-12.jpg，不记录密码、会话令牌或签名 URL，不进入 Git。

## 自动检查与发布

- npm run test:site-images：6 项，覆盖稳定身份、混合恢复/上传、未知目标、收据保存、权限/失败和零排序。
- npm run test:uploads：7 项；npm run test:media：20 项。
- 最终 npm run lint、npx tsc --noEmit 与 npm run build 均通过（41/41 预生成页面）；提交前另通过 3 项静态媒体测试和 4 项图片性能测试，相关测试共 40 项。既有 middleware → proxy 提示保留。
- 数据库迁移与真实浏览器保存已完成；用户已要求将本轮迁移与修复提交并推送到 main。正式部署完成状态尚未确认；上线后继续验收正式域名直传、刷新与生产图片优化端点。

回滚代码可恢复旧展示行为，新表可保留。原始媒体、Supabase 源对象和迁移清单保持原样。

## 前期连接阻塞的历史边界

初次验收时匿名读取返回 PGRST205，Supabase MCP OAuth 与浏览器连接均未就绪，因此当时没有执行迁移。按用户 URL 添加 supabase 并刷新 qianna_supabase 授权后，重新加载会话恢复连接；本轮已执行上述两项迁移及真实保存。前期「待迁移」状态已结束，代码部署仍待执行。
