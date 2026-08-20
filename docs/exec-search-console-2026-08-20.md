# Google Search Console + Vercel 生产 SEO 配置记录

> 日期：2026-08-20  
> 状态：已完成（域名已验证、站点地图成功、首页已收录）

---

## 一、背景

SEO 代码合并（commit `337dc5d`）后，Google 仍可能显示旧摘要（如 `Create Next App`），且生产 HTML 中 canonical 曾指向 Vercel preview 域名。需在 **Vercel** 与 **Search Console** 侧完成配置，并等待 Google 重新抓取。

---

## 二、两件事别混

| 操作 | 在哪里 | 目的 |
|------|--------|------|
| **环境变量 + Redeploy** | Vercel → Settings → **Environment Variables** | 让网站 metadata / sitemap / canonical 使用 `www.qiannawang.com` |
| **DNS TXT 验证** | vercel.com/**domains** → qiannawang.com → **DNS Records** | 向 Google 证明域名所有权，开通 Search Console |

**不要**在 Project → Settings → **Environments** 里填变量名；**不要**点域名链接（会打开网站），DNS 在团队级 **Domains** 页管理。

---

## 三、Vercel 环境变量

### 路径

`Dashboard` → 项目 `qianna-site` → **Settings** → **Environment Variables**

（若在侧栏看到 Build and Deployment，Environment Variables 在其下或同级 Settings 菜单中。）

### 配置

| Key | Value | Environments |
|-----|-------|--------------|
| `NEXT_PUBLIC_SITE_URL` | `https://www.qiannawang.com` | Production + Preview |

保存后：**Deployments** → 最新 Production → **⋯** → **Redeploy**（变量不会自动应用到旧部署）。

### 验证

查看 https://www.qiannawang.com 网页源代码：

- `<title>` 含 `Portfolio`
- `<link rel="canonical" href="https://www.qiannawang.com/"/>`

---

## 四、Google Search Console 域名验证（DNS TXT）

### 1. 添加资源

Search Console → 添加资源 → **网域** → `qiannawang.com`

### 2. 复制 TXT 值

形如：`google-site-verification=xxxxxxxx`

### 3. 在 Vercel 添加 DNS 记录

**https://vercel.com/domains** → 点击 `qiannawang.com` → **DNS Records** → Add：

| 字段 | 值 |
|------|-----|
| Name | `@` |
| Type | `TXT` |
| Value | 整串 `google-site-verification=...` |
| TTL | 默认（如 60） |

**不要删除**该 TXT，否则可能失去已验证状态。

### 4. 验证

等待 10 分钟～数小时 → Search Console 点 **验证**。

---

## 五、站点地图提交

### 路径

Search Console → **编制索引** → **站点地图**

### 正确填法

域名资源下只填 `sitemap.xml` **可能报错**「站点地图地址无效」。应使用**完整 URL**：

```
https://www.qiannawang.com/sitemap.xml
```

### 成功标准（2026-08-20）

- 状态：**成功**
- 已发现的网页：**19**

`robots.txt` 已含 `Sitemap: https://www.qiannawang.com/sitemap.xml`，即使暂不手动提交，Google 也会 eventually 发现。

---

## 六、网址检查 / 请求编入索引

### 路径

Search Console **顶部搜索框**（不是左侧「网页」报表）→ 输入：

```
https://www.qiannawang.com/
```

### 结果解读

| 显示 | 含义 |
|------|------|
| **网址已收录到 Google** | 已索引；通常**无**「请求编入索引」按钮 |
| 未收录 | 可出现「请求编入索引」 |

左侧 **网页** 报表在新资源下约 **1 天** 后才有统计数据，属正常。

---

## 七、完成后时间预期

| 项目 | 预期 |
|------|------|
| Search Console 报表数据 | 1～3 天 |
| 搜索结果标题/摘要更新 | 数天～数周 |
| 旧 `Create Next App` 消失 | 依赖 Google 缓存，无固定时间 |

---

## 八、关联文档

| 文档 | 用途 |
|------|------|
| [`experience-seo-metadata.md`](experience-seo-metadata.md) | canonical、title 分离、GSC 坑 |
| [`exec-vercel-domain-2026-08-11.md`](exec-vercel-domain-2026-08-11.md) | 域名购买、Production 绑定 |
| [`exec-homepage-motion-2026-08-17.md`](exec-homepage-motion-2026-08-17.md) | 首页动效（同批次上线） |
