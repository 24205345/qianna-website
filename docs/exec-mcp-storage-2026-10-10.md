# Supabase / Cloudflare MCP 接入与 R2 生产迁移执行记录

日期：2026-10-10（Asia/Shanghai）。延续 [R2 迁移方案](exec-cloudflare-r2-2026-10-09.md)。

本文记录当次执行与验收快照；后续配置与排障以 [媒体运维](experience-media-storage.md) 和 [架构](architecture.md) 为准。

## 已完成

已将以下服务器添加到当前用户的 Codex 配置 `~/.codex/config.toml`，保留现有配置，并在相同目录备份原文件。配置与 OAuth 凭据不进入项目仓库。

```toml
[mcp_servers.qianna_supabase]
url = "https://mcp.supabase.com/mcp?project_ref=aqsdwfocoocnzyxopvvg"

[mcp_servers.cloudflare_api]
url = "https://mcp.cloudflare.com/mcp"
```

两项均已通过 `codex mcp login` 完成 OAuth；CLI 状态为 `enabled / OAuth`。Cloudflare 最后一次登录限定为账号读取、R2 读取/写入与媒体域名管理相关权限。

## 连接边界

- 当前已有的 Supabase 插件连接列出的项目不包含本站项目，对 `aqsdwfocoocnzyxopvvg` 调用返回无权限。没有操作它列出的其他项目。
- 新增 `qianna_supabase` 采用项目限定的官方远程 MCP。2026-10-10 已成功读取本站 API URL 与 `storage.objects`，确认访问的是 `aqsdwfocoocnzyxopvvg`，160 对象、106,278,846 字节。
- Cloudflare 官方 API MCP 已在当前会话加载并实际调用；已核验账户、zone 和媒体子域名记录。此前配置完成后工具加载有延迟，单独回复“继续”并不保证工具立即出现。
- MCP 授权用于管理平台资源。网站运行及批量文件复制仍需要 R2 S3 Access Key / Secret Access Key；这些不能用 MCP 登录状态替代。
- 本地 `.env.local` 与 Vercel Production 已配置本站 R2 桶、域名和 S3 凭据，`MEDIA_STORAGE_PROVIDER=r2`。数据库和 Auth 保留在 Supabase，没有改动 schema / RLS。

## 迁移完成与验收结果

| 项目 | 实际状态 |
|---|---|
| Cloudflare account | `974b04e5dc1e905600075372288599b8`，当前连接只有该账户 |
| `qiannawang.com` zone | `6a789e8d9d6932c9db36adfca76e9801`，active，属于以上账户 |
| `media.qiannawang.com` DNS | 绑定前精确查询无冲突，已由 R2 自定义域名配置建立；主站记录未改 |
| R2 | 用户已启用订阅；List Buckets 返回成功 |
| 目标桶 | 已创建 `portfolio-media`，Standard / APAC / default jurisdiction，创建时间 `2026-10-10T01:43:05.125Z` |
| 媒体域名绑定 | 已启用 `media.qiannawang.com` 自定义域名，最低 TLS 1.2；域名归属与 SSL 均已确认 active |
| S3 凭据 | 用户操作时确认后通过浏览器创建 `qianna-website-media`，Active，仅本桶 Object Read & Write；本地 S3 访问验证通过 |
| 文件复制 | 160 / 160，106,278,846 字节；S3 GET 与源 SHA-256 全部匹配 |
| 文件公开校验 | 160 / 160 公开 URL 的 SHA-256 与源文件匹配；正式 apply 前再次全量验证 |
| 数据库切换 | 159 / 159 行更新；逐行核对清单 after 值，扫描字段没有残留原桶 URL |
| 上传 provider | 本地和 Vercel Production 均为 `r2`，生产重新部署完成 |
| 真实上传测试 | 统一 helper 的认证上传通过；线上 Notes 编辑器经 `uploadNoteAttachmentAction` 实际上传，返回 R2 URL，S3 / 公开域名字节校验通过。生成的测试对象已清理，没有创建文章 |
| Vercel 项目 | `24205345s-projects/qianna-site`，`prj_G2J2hoE9HzYaytzTGgUqiVlCaIgH`，对应 `www.qiannawang.com`，CLI 已登录并关联 |
| 正式回滚清单 | `.media-migration/r2-plan.json`，160 对象 / 159 引用对象 / 159 applied 行；保存源字段原值和 SHA-256，被 Git 忽略 |
| 当次生产部署快照 | `https://qianna-site-2yf921rr4-24205345s-projects.vercel.app`，当次验收为 READY，关联 `https://www.qiannawang.com`；后续部署可能替换此别名目标 |
| 公开页面 | 首页、About、Projects 及两条详情、Photography、Visual Works、Field Notes 及两条详情、Notes 及文章详情、Traces、Workbench、后台登录页均返回 200 |
| 媒体交付 | 生产 `/_next/image` 处理 R2 图片返回 200；MP4 Range 返回 206、正确 Content-Range / Content-Type；对象长缓存头正确 |
| 源对象保留 | Supabase 仍为 160 对象、106,278,846 字节；R2 清理测试对象后仍为 160 对象 |

**生产迁移已完成。** 用户启用订阅后，使用 MCP 核验账户、创建桶并绑定媒体域名。MCP 不包含 Token 管理权限，因此通过实际登录的浏览器创建以下凭据，最终提交前已获用户“允许”确认：

- 类型：Account API Token；名称：`qianna-website-media`。
- 权限：Object Read & Write，仅 `portfolio-media` 桶；不授予账户管理权限。
- TTL：Forever，供迁移和网站后台持续使用，持有人可随时撤销。
- 本地审核截图：`.media-migration/r2-token-review.png`，没有密钥内容。

浏览器工具与 Computer Use 技能要求创建持久 API 密钥前进行操作时确认；用户已回复“允许”，已提交创建并将 S3 Key 写入本地 `.env.local`。不将凭据放入聊天、日志或 Git。创建结果截图 `.media-migration/r2-token-created.png` 不含密钥值。

已通过官方 Vercel CLI 63.1.2 登录并关联以上现有项目。生产环境补齐 Supabase 公开配置与全部 R2 运行配置，两个 S3 凭据使用 sensitive 类型保存；先以 `supabase` provider 部署双域名兼容版本并验证 Next.js 图片处理，再执行数据库 apply，最后切换 `r2` 并重新部署已上传的代码。没有上传管理员邮箱/密码。新增 `.vercelignore` 明确排除 `.env*`、`.media-migration` 和本机配置目录，部署输入检查确认没有凭据或迁移原始清单。

尝试下载生产配置进行逐值校验时，自动审批拒绝了 `vercel env pull`，原因是整份下载会额外复制生产密钥；该动作没有执行，也没有通过其他方式下载，改用部署构建及实际访问验证配置。

数据库改写分布：Projects 2、project_media 20、photography_photos 46、visual_works 22、field_notes 5、field_note_media 62、site_settings 1、about_page_content 1。外链视频、本地静态路径以及没有原桶 URL 的 Notes 正文保持原值。

本地验收记录：`.media-migration/migration-check.json`、`production-check.json`、`production-upload-check.json`；控制台与生产后台截图：`r2-migrated.png`、`r2-production-upload.png`。浏览器文件选择器因扩展未开启本地文件访问而失败，改用编辑器原有图片粘贴功能完成真实生产上传，没有修改浏览器权限。测试文章未提交，测试图片已删除。

20 项存储 / 迁移测试、lint、TypeScript 检查和生产构建通过。迁移及本地图片修复已提交为 [`0064c9f`](https://github.com/24205345/qianna-website/commit/0064c9f21b44dbb702040ce788320b698fe82c7e)（`feat(media): migrate storage to Cloudflare R2`），2026-10-10 已推送 `origin/main`，提交后工作区干净、本地与远程同步。35 个暂存文件检查未含本地密钥或私有清单，提交前媒体测试再次全数通过。

本地配置、验收截图与回滚清单被 Git 忽略，继续独立保留并需受控备份；本次后续文档核对的未提交改动不包含在上述提交内。

本次也通过 Context7 查询了 Cloudflare R2 官方文档，复核 S3 客户端、桶级凭据和启用订阅流程。Firecrawl 工具仍未出现在当前会话中。

## 后续维护与回滚

1. 保留 Supabase 原对象和正式清单。不要重跑会清空内容的初始化脚本。后续新增媒体走 R2，实际模块仍使用统一上传接口。
2. 回滚先暂停编辑、备份清单，运行 `npm run migrate:r2 -- --rollback`，脚本比较当前值与清单后逐行恢复；如迁移后编辑相同字段则停止人工核对。另将本地和 Vercel provider 改为 `supabase` 并重新部署。切换后新上传需单独核对并保留 R2 对象；开关本身不会恢复已迁移 URL。生产回滚尚未实际演练。
3. 大图 / 视频下一步使用认证后短时签名直传，解决现有 Vercel Server Actions 的 4.5 MB 平台请求体限制。当前 20 MB 应用配置不能扩大平台上限。
4. Workbench 的 `0019` 表缺失是独立问题，前台保留静态回退；本次未部署该 SQL。详情见迁移方案。

遇到授权失效，可重新执行以下命令，并在浏览器完成登录：

```powershell
codex mcp login qianna_supabase
codex mcp login cloudflare_api --scopes "offline_access,user:read,account:read,zone.read,dns.read,dns.write,workers-r2.read,workers-r2.write,workers-r2-bucket-item.read,workers-r2-bucket-item.write,workers-r2.metadata_read"
```

## 本地预览裂图修复（2026-10-10）

用户报告首页封面、Yubeng、White Cliffs 裂图，确认截图来自 `localhost:3000`。三张 R2 原图及生产图片优化请求均返回 200，本地优化请求返回 400。重启后日志明确显示媒体域名被本地代理 DNS 映射为 `127.160.7.161` / `fd00:696e:6974:6578::48:7a2`，触发 Next.js 16 的私网图片源检查；`"url" parameter is not allowed` 也可能表示该检查失败，不能仅凭这条错误认定白名单缺失。

在 `next.config.ts` 增加可选 `DEV_IMAGE_UNOPTIMIZED`，只有 `NODE_ENV=development` 且该变量为 `true` 才让浏览器直接读取图片。当前 `.env.local` 已启用该开关，示例配置默认为 false。生产继续优化图片，`dangerouslyAllowLocalIP` 在两种环境都保持 false。恢复正常公共 DNS 后可关闭本地开关以继续测试图片尺寸优化。

开发服务重启并刷新后，首页全部 8 张图片均 `complete=true` 且 `naturalWidth>0`，原来失败的三张图片已显示。lint、TypeScript 检查及开发 / 生产配置分支核验通过。本次不需要改写数据库或重新复制文件。

## 官方依据

- [Codex MCP 配置与 OAuth](https://developers.openai.com/codex/mcp)
- [Supabase MCP 与 project_ref 范围](https://supabase.com/docs/guides/getting-started/mcp)
- [Cloudflare 自有 MCP 服务](https://developers.cloudflare.com/agents/model-context-protocol/cloudflare/servers-for-cloudflare/)
- [Cloudflare API MCP 官方仓库](https://github.com/cloudflare/mcp)
- [R2 入门与启用订阅](https://developers.cloudflare.com/r2/get-started/)
- [R2 S3 凭据与桶级权限](https://developers.cloudflare.com/r2/api/tokens/)
