# Guestbook 模块经验

> 适用场景：个人站、About 页、首页底部等**公开留言**功能

---

## 架构选择

| 方案 | 适用 | 权重 |
|------|------|------|
| Supabase 自研 + 人工审核 | 样式统一、数据自有、无第三方依赖 | **9/10** |
| Giscus / Disqus | 快速接入、需 GitHub 或接受第三方 UI | 5/10 |

本项目采用 **Supabase + Server Action + `/admin/guestbook` 审核**。

---

## 数据模型

```sql
guestbook_messages (
  id, author_name, author_email?, message,
  status: pending | approved | rejected,
  ip_hash, created_at
)
```

- **pending 默认**：触发器 `guestbook_force_pending_for_anon` 强制 anon 插入为 pending
- **公开只读 approved**：RLS `guestbook_anon_select_approved`
- **Email 不公开**：前台 query 不 select `author_email`，仅后台展示

---

## 过滤策略（多层）

1. **服务端校验**：长度、邮箱格式、敏感词、URL/邮箱禁止出现在正文
2. **蜜罐字段**：`website` 隐藏域，填写则静默成功（迷惑机器人）
3. **Cloudflare Turnstile**（可选）：配置 `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` 后，提交前需完成真人验证；未配置时本地 dev 行为与旧版一致
4. **IP 频率限制**：`guestbook_is_rate_limited` RPC（security definer）
5. **人工 Approve**：最终把关

> 不要指望纯自动过滤；个人站建议始终保留审核步骤。

---

## 后台操作

| 操作 | 效果 |
|------|------|
| Approve | 首页公开展示 |
| Reject | 不展示，记录保留 |
| Delete | 永久删除 |

入口：`/admin/guestbook`（Admin 侧栏 Guestbook）

---

## Turnstile（可选）

| 文件 | 职责 |
|------|------|
| `lib/guestbook/turnstile.ts` | `getTurnstileSiteKey`、`verifyTurnstileToken`、`isTurnstileEnabled` |
| `app/_components/guestbook/GuestbookTurnstile.tsx` | 加载 Cloudflare script + widget |
| `app/guestbook/actions.ts` | 启用时校验 `turnstileToken` |
| `.env.local.example` | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` |

首页 `GuestbookSection` 通过 `getTurnstileSiteKey()` 传入 site key；两键均配置才启用，否则无 widget、服务端不校验。

---

## 常见坑

1. **RLS 下 rate limit 查不到 pending 行** → 用 security definer RPC
2. **anon 可篡改 status** → BEFORE INSERT 触发器强制 pending
3. **Email 字段 migration 未跑** → insert 报 column 不存在
4. **Windows 命令** → 不要用 `&&` 链式命令

---

## 扩展方向

- 回复功能：可加 `parent_id` 或单独 contact 表
- 自动发布：过滤全过则 `approved`，风险更高，不推荐个人站默认开启
- 通知：Approve 前 Webhook / 邮件提醒有新 pending
