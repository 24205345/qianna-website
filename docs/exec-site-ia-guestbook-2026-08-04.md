# 首页 IA 重组 + Guestbook 执行记录

> 日期：2026-08-04  
> 状态：已完成，已 push

---

## 一、网站结构重组（Traces Hub）

### 首页四板块

**Notes → Projects → Traces → About Me**

| 板块 | 说明 |
|------|------|
| Notes | CMS 驱动，首页列表预览 |
| Projects | 三分类卡片 |
| Traces | Photography / Drawings / Field Notes，Hub 页三 Tab |
| About Me | 摘要卡 + Guestbook 预览（最新 3 条，View all → `/guestbook`） |

### 路由

| 路径 | 说明 |
|------|------|
| `/traces` | Hub 默认 Photography |
| `/traces?tab=drawings` | Drawings |
| `/traces?tab=field-notes` | Field Notes |
| `/photography` 等 | 旧路径保留，复用共享组件 |

### 首页 UI 精简

- Notes / Traces 区块去掉灰色副标题描述
- About Me 去掉右上角 View all（内容本身可点击进入 `/about`）
- About 摘要样式与 Notes 列表一致（border-b 列表项）

### 关键文件

- `app/page.tsx` — 首页四板块
- `app/traces/` — Hub + Tab 导航
- `app/_components/traces/` — 三块内容共享组件
- `app/_data/site-navigation.ts` — fallback 导航
- `supabase/migrations/0012_traces_navigation.sql`

---

## 二、Guestbook（Say hello）

### 功能

- 位置：首页 About Me 下方
- 字段：Name（必填）、Email（可选）、Message（必填）
- 流程：**先审后发** — 提交后 `pending`，后台 Approve 后首页展示
- Email **仅后台可见**，不在公开列表显示

### 内容过滤

| 层级 | 机制 |
|------|------|
| 人工审核 | 默认 pending，后台 Approve / Reject / Delete |
| 敏感词 | 中英文脏话正则 |
| 反垃圾 | 禁止 URL/邮箱出现在正文、重复字符、蜜罐字段 |
| 频率限制 | 同 IP 每小时最多 3 条（RPC `guestbook_is_rate_limited`） |

### 后台审阅

1. 登录 `/admin/login`
2. 顶部导航 → **Guestbook**（`/admin/guestbook`）
3. 查看 `pending` 留言 → **Approve** 通过 / **Reject** 拒绝 / **Delete** 删除
4. Approve 后刷新首页，Say hello 下方可见

### 关键文件

- `app/_components/guestbook/GuestbookSection.tsx` — 前台表单
- `app/guestbook/actions.ts` — Server Action 提交
- `lib/guestbook/validation.ts` — 校验与过滤
- `lib/guestbook/queries.ts` — 已审核留言查询
- `app/admin/guestbook/` — 后台审核页
- `supabase/migrations/0013_guestbook.sql` — 留言表 + RLS
- `supabase/migrations/0014_guestbook_email.sql` — 可选 Email 字段

---

## 三、数据库迁移

按顺序在 Supabase SQL Editor 或 `supabase db push` 执行：

1. `0012_traces_navigation.sql` — Traces 导航
2. `0013_guestbook.sql` — Guestbook 表
3. `0014_guestbook_email.sql` — Email 字段

> 0012、0013 曾通过 MCP 应用到远程；0014 若未执行，提交带 Email 的留言会报错。

---

## 四、验证清单

- [ ] 首页四板块顺序与文案
- [ ] `/traces` 三 Tab 切换
- [ ] 旧 URL `/photography` 等仍可用
- [ ] 留言提交 → 后台 pending → Approve → 首页显示
- [ ] Email 仅后台可见
- [ ] `npm run build` 通过

---

## 五、经验（可复用）

1. **Hub + Tab**：多子模块聚合时，共享组件 + legacy 页复用，比 URL 大迁移成本低。
2. **导航双写**：`site-navigation.ts` fallback + Supabase migration 同步。
3. **公开留言先审后发**：机器过滤 + 人工 Approve，个人站最稳妥。
4. **RLS 与频率限制**：anon 无法直接 COUNT pending，用 `security definer` RPC 做 rate limit。
5. **Next.js 16**：`searchParams` 为 Promise，需 `await`。

---

## 六、相关文档

- [experience-guestbook.md](./experience-guestbook.md) — Guestbook 模块经验
- [cms-migration-checklist.md](./cms-migration-checklist.md) — 全站 CMS 进度
