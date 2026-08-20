# Vercel 自定义域名配置记录

> 日期：2026-08-11  
> 状态：已完成  
> 主域名：**https://www.qiannawang.com**

---

## 一、域名信息

| 域名 | 用途 |
|------|------|
| `www.qiannawang.com` | **主站** — Connect to **Production** |
| `qiannawang.com` | 根域名 — 自动 **Redirect** 到 `www`（Vercel recommended） |
| `qianna-site.vercel.app` | Vercel 默认域名，仍可用作备用 |

域名在 Vercel 购买；账号级列表：[vercel.com/domains](https://vercel.com/domains)  
项目绑定：Project → **Settings → Domains**

---

## 二、添加域名时的正确选项

### ✅ 主域名应这样配

1. **Add Domain** 输入 `qiannawang.com`
2. 勾选 **Redirect apex domains to www (recommended)**  
   → 会同时添加 `qiannawang.com` + `www.qiannawang.com`
3. 选 **Connect to an environment**
4. 环境选 **Production**
5. **Add 2 Domains**

### ❌ 不要这样配

| 错误 | 原因 |
|------|------|
| 主域名选 **Redirect to Another Domain** | 网站不会直接展示，只会跳转 |
| 主域名连 **Preview** | 会指向预览部署，不是正式站 |
| Redirect 不填目标 | 会报 `Select a redirect destination` |

---

## 三、两个选项的含义

### Connect to an environment

访问该域名 → **直接打开**对应环境的网站。

| 环境 | 含义 |
|------|------|
| **Production** | `main` 分支的正式部署 — **作品集用这个** |
| **Preview** | PR / 分支的临时预览 |

### Redirect to Another Domain

访问该域名 → **跳转到另一个 URL**（如旧域名、或 `apex → www`）。

| 类型 | 含义 |
|------|------|
| 307 Temporary | 临时跳转 |
| 308 Permanent | 永久跳转（SEO 权重转给目标） |

根域名 → `www` 的重定向由 Vercel 勾选 recommended 后自动处理，无需手动再配。

---

## 四、添加后检查

1. Domains 列表状态为 **Valid Configuration**
2. 浏览器打开 https://www.qiannawang.com 能正常访问
3. https://qiannawang.com 自动跳到 `www`

DNS 生效通常几分钟到几小时；Vercel 购买的域名一般自动配好记录。

---

## 五、关联配置（建议核对）

### Supabase Auth Redirect URLs

若 Admin 登录 / 密码重置邮件链接异常，在 Supabase → **Authentication → URL Configuration** 补充：

```
Site URL: https://www.qiannawang.com

Redirect URLs:
https://www.qiannawang.com/auth/callback
https://www.qiannawang.com/auth/confirm
https://qiannawang.com/auth/callback
https://qiannawang.com/auth/confirm
https://qianna-site.vercel.app/auth/callback
https://qianna-site.vercel.app/auth/confirm
```

（保留 vercel.app 便于备用域名调试。）

### 对外分享

README、名片、作品集链接统一用：**https://www.qiannawang.com**

### SEO / Search Console（2026-08-20 补充）

| 项 | 说明 |
|----|------|
| 环境变量 | `NEXT_PUBLIC_SITE_URL=https://www.qiannawang.com`（Project → Settings → Environment Variables） |
| DNS TXT | vercel.com/domains → qiannawang.com → DNS Records（GSC 域名验证） |
| 站点地图 | GSC 提交 `https://www.qiannawang.com/sitemap.xml` |

详见 [`exec-search-console-2026-08-20.md`](exec-search-console-2026-08-20.md)。

---

## 六、常见位置速查

| 想看什么 | 去哪里 |
|----------|--------|
| 买到的所有域名 | Dashboard → **Domains** 或 vercel.com/domains |
| 项目绑了哪些域名 | Project → Settings → **Domains** |
| 购买 / 续费账单 | Account Settings → **Billing** |

---

## 七、相关文档

| 文档 | 用途 |
|------|------|
| `README.md` | 对外 Live site 链接 |
| `docs/supabase-cms-改造记录.md` §4.5 | Auth Redirect URLs 详细说明 |
| `docs/developer-guide.md` | 开发者指南入口 |
