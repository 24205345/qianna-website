# CMS 管理员授权与保存验收

日期：2026-10-12。续接 [剩余迁移执行记录](exec-cms-storage-completion-2026-10-10.md)。用户明确允许为现有唯一 CMS 登录账号添加服务端 `cms_role=admin`。本轮代码仍未 commit / push 或部署。

## 授权结果

项目 `aqsdwfocoocnzyxopvvg` 的唯一非匿名账号已添加 `app_metadata.cms_role=admin`，原 provider / providers 元数据保留。仅更新已确认账号，执行条件包含账号 ID、非匿名、原元数据一致和用户总数为 1。返回 1 行且标记为 admin。

项目 MCP 的 OAuth 刷新失败，另一 Supabase 连接的只读查询也因连接权限失败；使用已有登录会话的 Supabase Dashboard SQL Editor 完成授权。此前自动审批拒绝的账号授权，在这次明确同意前未执行；本轮操作依据新的用户授权。

新登录会话的用户信息与 JWT 均确认包含管理员标记。已有后台会话需要重新登录后再编辑。权限来自服务端 app_metadata，未使用用户可修改的 user_metadata，也未放宽 RLS。

## 实际验收

| 检查 | 结果 |
|---|---|
| 管理员会话 | Auth 登录成功，getUser 返回指定账号；JWT 标记为 admin |
| 认证直传 | 本地新版 `/api/admin/media` prepare / complete 均返回 200；真实 5,398,480 字节 JPEG PUT 200 |
| 签名收据保存 | 执行实际 createProjectAction 代码，认证、收据与 R2 HEAD 核验通过，生产 Supabase 中临时 draft 的 cover URL 与上传返回值一致 |
| Workbench 保存 | 精确选择带 pipeline_id 的编辑表单，执行本地 Next Server Action HTTP POST；303 到 saved=true，生产数据库读回一致 |
| 业务内容 | Workbench title、summary、steps、core_stack、featured_note 与 sort_order 保持原值；正常保存更新 updated_at |
| 清理 | 临时 draft 与 R2 对象删除并读回确认；测试会话以 local scope 退出 |

Project 动作验证执行真实动作代码与生产 RLS / R2；测试环境对 Next 的 revalidatePath 和 redirect 使用兼容桩，因此不把它表述为浏览器表单点击回归。Workbench 则执行了实际 Next HTTP 动作。正式部署后的浏览器上传、刷新和生产图片优化端点仍须验收。

验证过程中首次 HTTP 表单定位误选了全站退出登录表单；已有会话可能需要重登。已限定到带 pipeline_id 的 Workbench 编辑表单，重新登录后验证通过；最终清理只退出测试会话。

证据保存在忽略目录：
- `.media-migration/cms-admin-live-check-2026-10-12.json`
- `.media-migration/cms-role-admin-2026-10-12.jpg`

不保存密码、会话令牌或签名上传 URL；证据不进入 Git。

## 修复与验证

Photography 和 Drawings 的旧校验仍要求原始 File。直传成功后，客户端移除文件并提交签名收据，该校验会错误阻止保存。移除两处旧文件校验，统一由 getFormMediaUrl 验证收据或小文件回退；无媒体仍拒绝保存。

新增回归测试覆盖这两个保存入口的收据表单和缺失媒体错误。完整媒体测试 34 项通过，lint 通过。生产构建通过（Next.js 16.2.1、41 / 41 预生成页面），随后 tsc --noEmit 通过；保留既有 middleware → proxy 弃用提示。

## 发布边界

数据库账号授权已经生效；生产 Workbench 表和 R2 静态对象已完成前轮迁移。新直传、静态清单解析及本次校验修复的代码仍待提交与部署。不能将本地新版验收写成生产新版已上线。用户未在本轮要求 commit / push，因此未执行。

依据：[Supabase RLS 文档](https://supabase.com/docs/guides/database/postgres/row-level-security)明确区分 app_metadata 与 user_metadata，并说明 JWT 需刷新后反映权限变更；[更新记录](https://supabase.com/changelog.md)核对至 2026-10-12，未发现影响本轮实现的新增变更。

## 2026-10-12 提交交付

用户后续明确要求 git commit & push，本轮直传、静态媒体交付、首页图修复、迁移文件与文档纳入 main 提交。发布完成状态另行确认，不能由提交成功推断生产部署已完成。
