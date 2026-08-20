# SEO / 搜索摘要经验

> 适用场景：Google 搜索结果标题/摘要不对、canonical 指向 preview 域名

---

## 首页 title 与 Hero 文案分离

| 用途 | 来源 | 示例 |
|------|------|------|
| 页面 H1（访客可见） | CMS `site_settings.hero_title` | `Qianna Wang` |
| `<title>` / OG（搜索引擎） | `DEFAULT_SITE_TITLE` | `Qianna Wang \| Urban Design & Spatial Research Portfolio` |
| meta description | `DEFAULT_SITE_DESCRIPTION` | 含 portfolio、urban design 等关键词 |

**不要**把 Hero 副标题直接当 SEO description — 太短，Google 容易从 Notes 正文抓摘要。

首页 `generateMetadata` 使用 `absoluteTitle: true`，避免 root layout 的 `%s · Qianna Wang` 模板重复后缀。

---

## canonical 必须指向正式域名

### 现象

生产 HTML 里出现：

```html
<link rel="canonical" href="https://qianna-site-xxxxx.vercel.app"/>
```

Google 会索引 preview URL，摘要混乱，且与 `www.qiannawang.com` 权重分散。

### 原因

`getSiteUrl()` 在未配置 `NEXT_PUBLIC_SITE_URL` 时误用 `VERCEL_URL`（每次部署不同）。

### 修复（代码）

```ts
if (process.env.VERCEL_ENV === "production") {
  return "https://www.qiannawang.com";
}
```

`buildPageMetadata` 使用 `buildCanonicalUrl(path)` 输出**绝对 URL**。

### 修复（Vercel 环境变量，推荐）

```
NEXT_PUBLIC_SITE_URL=https://www.qiannawang.com
```

Production + Preview 均配置，避免 preview 部署 sitemap/robots 指错域。配置后需 **Redeploy** 才生效。

路径：**Project → Settings → Environment Variables**（不是 Environments 页面）。

---

## Google Search Console 操作要点

完整步骤见 [`exec-search-console-2026-08-20.md`](exec-search-console-2026-08-20.md)。

### DNS TXT 验证域名

- 入口：**vercel.com/domains** → `qiannawang.com` → DNS Records（不是 Project Domains 里点域名链接）
- 添加 `TXT` / Name `@` / Value 为 Google 提供的整串
- **勿删** TXT，否则失去已验证状态

### 站点地图

- 路径：Search Console → 编制索引 → 站点地图
- 域名资源请提交完整 URL：`https://www.qiannawang.com/sitemap.xml`
- 仅填 `sitemap.xml` 可能报「站点地图地址无效」

### 请求编入索引

- 在 **顶部网址检查** 输入 `https://www.qiannawang.com/`
- 若已显示「网址已收录到 Google」，无需再点请求编入索引
- 左侧「网页」报表约 1 天后才有数据

---

## 部署后让 Google 更新

1. 确认线上 `<title>` / `canonical` 正确（View Source 或 Rich Results Test）
2. [Google Search Console](https://search.google.com/search-console) 完成域名验证并提交站点地图（见 exec 文档）
3. 旧摘要（如 `Create Next App`）可能缓存数天～数周，canonical 正确后会逐步替换

---

## 相关文件

| 文件 | 职责 |
|------|------|
| `lib/seo/constants.ts` | 默认 title/description、`getSiteUrl`、`buildCanonicalUrl` |
| `lib/seo/metadata.ts` | `buildPageMetadata` |
| `app/page.tsx` | 首页 SEO metadata（与 Hero H1 分离） |
| `app/layout.tsx` | 根 metadata + WebSite/Person JSON-LD |
| `public/llms.txt` | AI/爬虫可读站点摘要 |
