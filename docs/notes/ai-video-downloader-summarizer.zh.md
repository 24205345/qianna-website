# AI 万能视频下载总结器：用 Cursor 从 0 做出可付费工具

这是一篇实战笔记：记录如何用 Cursor（或任意 Code Agent）做出「跨平台视频下载 + AI 总结 + Stripe 会员」的轻量工具，以及可复用的提示词与关键踩坑经验。

---

## 写在前面

建议按以下顺序推进，避免并行堆叠下载、总结、界面与支付：

1. **跑通核心下载**（yt-dlp），并提交到 Git  
2. **新开对话**扩展 AI 总结（视为新任务，但必须先阅读已有文档与代码）  
3. **优化前端体验**（同屏信息密度、自动触发总结）  
4. **接入支付**（出海优先 Stripe；国内可换支付宝 / 微信支付）  
5. **部署上线**（本章仍待补充）

工具类产品的常见策略是：**先抓住核心功能，再谈扩展**。对本项目而言，核心是稳定、可靠地完成视频下载。

---

## 一、环境准备

可使用 Cursor，也可使用其他 Code Agent。若使用 Cursor，开工前建议先配置网络与 MCP。

### 1.1 Cursor 网络

在公司代理或 VPN 环境下，HTTP/2 有时会出现直连失败。可在 Cursor 的 **Network** 设置中，将 **HTTP Compatibility Mode** 切换为 **HTTP/1.1**，再通过代理使用高级模型。

![Cursor Network settings: switch HTTP Compatibility Mode to HTTP/1.1](/notes/ai-video-downloader-summarizer/image001.jpg)

### 1.2 先接入 MCP

开工前添加 MCP Servers，有助于提高查文档与抓取网页的准确度：

| 服务 | 作用 | 官网 |
| --- | --- | --- |
| **Firecrawl** | 自动抓取并理解网页内容 | [https://www.firecrawl.dev/](https://www.firecrawl.dev/) |
| **Context7** | 获取较新的技术文档 | [https://context7.com/](https://context7.com/) |

![MCP Servers panel with Context7 and Firecrawl enabled](/notes/ai-video-downloader-summarizer/image002.jpg)

在官网注册并获取 API Key 后，写入 Cursor 的 MCP 配置：

![MCP configuration JSON with API key placeholders](/notes/ai-video-downloader-summarizer/image003.jpg)

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "YOUR_API_KEY"
      }
    },
    "firecrawl": {
      "url": "https://mcp.firecrawl.dev/YOUR_API_KEY/v2/mcp"
    }
  }
}
```

### 1.3 可选：Skills

可补充 UI 相关 skill 以辅助界面落地，例如 [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)：

```bash
uipro init --ai cursor --global
# Install to ~/.cursor/skills/
```

---

## 二、需求分析与方案设计

### 2.1 先想清楚再写代码

| 维度 | 问题 | 本项目的回答 |
| --- | --- | --- |
| 目标用户 | 谁会用？ | 需要下载 / 保存视频的普通用户与内容创作者 |
| 核心价值 | 解决什么问题？ | 跨平台、少限制地下载视频，减少手工操作 |
| 产品形态 | 如何呈现？ | Web，兼容手机与电脑 |
| 技术可行性 | 能否实现？ | 基于 yt-dlp，路径成熟 |
| 扩展空间 | 后续加什么？ | 视频总结、字幕翻译、付费能力等 |

开工前建议先明确三点：

1. **前端气质**：突出实用价值，服务付费转化。  
2. **是否需要后端**：需要；第一期可不接数据库，保持轻量。  
3. **多平台下载策略**：优先复用 [yt-dlp](https://github.com/yt-dlp/yt-dlp)，避免自行承担全平台解析风险。

### 2.2 启动提示词（需求 + 人工方案）

```prompt
你是一名专业工程师，正在构建 Universal Video Downloader（万能视频下载器）。
工作流程：提出方案 → 等待人工确认 → 分步实现 → 自测 → 请求验收。

## 需求
1) 用户：需要下载/保存视频的普通用户与内容创作者
2) 核心价值：跨平台视频下载，减少手工操作
3) 产品形态：适配手机与电脑的 Web 应用
4) 可行性：基于 yt-dlp 构建
5) 扩展：总结、字幕翻译、付费能力（先完成核心下载）

## 人工约束
1) 前端应突出实用价值与付费转化
2) 需要后端，但 v1 保持轻量（暂不接数据库）
3) 优先复用现有开源下载能力（yt-dlp）

## 护栏
1) UI 应有辨识度；Apple.com 可作为清晰度的参考
2) 基于人工方案，提出你的方案，然后等待确认
3) 优先封装 yt-dlp，不要重写各平台解析器
```

### 2.3 开发节奏

- 先用 Plan 模式确认方案，再统一 Build  
- 先完成核心下载，跑通后再扩展  
- 架构建议：前后端分离，生产环境单端口托管

```text
Frontend: Vue 3 in browser
        ↕  HTTP /api/*
Backend: FastAPI (Uvicorn)
  ├─ Parse / download (yt-dlp + thin platform adapters)
  ├─ AI summary / ASR / Q&A
  └─ Serve frontend/dist (single port 8000 in production)
```

### 2.4 为什么选择 FastAPI

| Framework | Performance | Dev speed | Learning cost | Fit |
| --- | --- | --- | --- | --- |
| FastAPI | High | High | Low | API services, lightweight tools |
| Flask | Medium | High | Low | Simple web apps |
| Django | Medium | Medium | High | Large full-stack systems |

同一套后端可被多个前端复用。对本项目即：不同客户端都调用同一个 `POST /api/summarize`。

后端设计建议遵守：

```prompt
API 设计要点：

1) 保持响应结构稳定，例如：
{
  "task_id": "abc",
  "status": "done",
  "summary": "...",
  "chapters": [{ "start": 155, "title": "第二节" }]
}

2) 前后端不同源时配置 CORS。

3) 用鉴权保护接口（Session/JWT、API Key、SSO、角色）。

4) 密钥与计费逻辑只放后端。
记住：一个后端，多个前端。
```

---

## 三、视频总结功能

### 3.1 顺序很重要

扩展总结能力前，务必：

1. 完成核心下载  
2. 提交到 Git  
3. 新开对话，并要求先阅读已有文档与源码

建议沉淀：项目介绍、已完成功能、技术架构、关键 API。  
竞品可参考 [bibigpt.co](https://bibigpt.co/)、[NoteGPT](https://notegpt.io/cn/bilibili-summarizer)、NotebookLM 等，目标是找差异化，而不是照搬。

### 3.2 扩展总结的提示词

```prompt
你正在扩展 Universal Video Downloader。
核心下载已可用。在提出改动前，先分析现有文档与代码。

## 目标
增加 AI 视频总结，便于快速学习与内容回顾。

## 材料
- @项目文档
- @当前代码库

## 任务
竞品调研 → 方案设计 → 实现

## 护栏
编码前，不清楚的地方先向人工确认。

从竞品调研开始：
- https://bibigpt.co/
- https://notegpt.io/cn/bilibili-summarizer
- NotebookLM
```

编码前可再加三条约束：

```prompt
1) 用 Context7 与联网搜索获取最新文档；避免过时 API
2) 优先增量改动；不要破坏现有下载流程
3) 请求验收前先自测端到端

开始开发。
```

### 3.3 模型与密钥

验证链路时可先用 DeepSeek 等低成本模型。  
上传到 GitHub 前，务必将密钥放入 `.env` / `local.env`，并加入 `.gitignore`。

### 3.4 播放与章节跳转

章节时间戳应能驱动播放器跳转：

![Sequence diagram: chapter click seeks the video player](/notes/ai-video-downloader-summarizer/image010.jpg)

```text
User clicks chapter 02:35
  → SummaryPanel emit seek(155)
  → HomeView calls VideoPlayer.seekTo(155)
  → video.currentTime = 155

First enter:
  VideoPlayer → prepare(url|file_id)
  ← { src, type }
  → load and play
```

部分平台存在播放限制，需要按平台单独调试，不能假设「下载成功即可播放」。

---

## 四、前端体验优化

| Direction | Practice | In this project |
| --- | --- | --- |
| Fewer clicks | Auto-trigger next step | Auto-summarize after parse |
| Higher density | Show related content together | Video info + summary side by side |
| Progressive disclosure | Core first, details later | Hide decorative hero after results |
| Responsive layout | Device-specific layout | Stack vertically on mobile |
| Feedback | Loading / disabled states | Block duplicate summary clicks |

界面改动建议拆成小步，并及时推送到 Git，便于回退。

```prompt
你正在优化 Universal Video Downloader 的用户体验。
下载与总结已可用。先分析现有文档/代码。

## 目标
把视频信息与总结放在同一屏。
解析视频后自动开始总结，减少一次点击。

## 护栏
UI 改动前，不清楚的需求先确认。
```

---

## 五、支付功能（Stripe）

面向全球用户时，常见对比如下：

| Dimension | Stripe | Alipay | WeChat Pay |
| --- | --- | --- | --- |
| Coverage | 46+ countries | Mostly China | Mostly China |
| Integration | Simple, strong docs/SDK | Medium, business credentials | Medium, business credentials |
| Testing | Mature sandbox + CLI | Limited sandbox | Limited sandbox |
| Currencies | 135+ | RMB-first | RMB-first |
| Fees | ~2.9% + $0.30 | ~0.6% | ~0.6% |
| Fit | Global / SaaS / indie tools | Domestic commerce | Domestic social commerce |

全球用户优先 Stripe；国内用户可优先支付宝 / 微信支付。

```prompt
为 Universal Video Downloader 增加会员结账能力。

技术栈偏好：Stripe。
用 Context7 查阅最新 Stripe 文档。
优先保证支付安全与幂等性。
引导首次集成 Stripe 的开发者，用 stripe listen 完成本地测试。
```

Webhook 用于在支付完成后主动通知服务端更新会员状态。本地开发可用 `stripe listen` 转发到：

`http://127.0.0.1:8000/api/billing/webhook`

建议监听：`checkout.session.completed`、`customer.subscription.updated/deleted`、`invoice.payment_failed`。

安全要点：密钥仅存后端环境变量；Webhook 必须验签；会员状态以服务端写库为准。

---

## 六、部署上线

待更新。后续建议补充：构建产物、环境变量清单、域名与 HTTPS、Stripe 生产 Webhook、监控与回滚。

---

## 附录：提示词索引

| 章节 | 用途 |
| --- | --- |
| 2.2 | 启动下载器项目 |
| 2.4 | 后端 API 设计护栏 |
| 3.2 | 扩展总结能力 |
| 4 | 同屏 UX 优化 |
| 5 | Stripe 会员支付 |
