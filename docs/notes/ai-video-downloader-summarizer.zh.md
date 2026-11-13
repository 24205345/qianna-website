# AI 万能视频下载总结器：用 Cursor 从 0 做出可付费工具

这是一篇实战笔记：记录如何用 Cursor（或任意 Code Agent）做出「跨平台视频下载 + AI 总结 + Stripe 会员」的轻量工具，以及可复用的提示词与关键踩坑经验。

---

## 写在前面

建议按以下顺序推进，避免并行堆叠下载、总结、界面与支付：

1. **跑通核心下载**（yt-dlp），并提交到 Git  
2. **新开对话**扩展 AI 总结（视为新任务，但必须先阅读已有文档与代码）  
3. **优化前端体验**（同屏信息密度、自动触发总结）  
4. **接入支付**（出海优先 Stripe；国内可换支付宝 / 微信支付）  
5. **部署上线**（ECS + Docker Compose，详见第六章）

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

线上采用 **阿里云 ECS + Docker Compose** 方式部署：

1. 在 Linux ECS 上安装 Docker，用项目根目录的 `compose.yaml` 一键启动应用容器  
2. 通过 `.env.docker` / `.env` 注入 API 密钥、数据库与 Stripe 等配置  
3. （可选）用宝塔或 Nginx 反向代理到容器端口，绑定域名并开启 HTTPS  
4. （可选）配置 GitHub Actions，在 `git push` 后自动同步代码并 `docker compose up` 更新服务器  

更完整的步骤（镜像加速、防火墙、健康检查、Stripe 生产 Webhook 等）见另一篇笔记：**[阿里云 ECS 部署教程：Docker Compose 单容器应用](/notes/aliyun-ecs-docker-deploy)**。

---

## 七、后续功能更新

**更新于 2026-11-02。** 前六节保留最初从 0 开发的过程、提示词和操作截图；后续迭代中，项目逐渐扩展为 VidGrab 视频学习助手。下面补充新增功能及其使用方式。

### 7.1 从总结到学习

现在不只支持粘贴链接，也可以**上传本地视频**，处理培训录屏、会议录像和已有素材。一次分析之后，围绕同一段视频继续学习：

| 新增与扩展功能 | 可以怎样使用 |
| --- | --- |
| **结构化总结** | 阅读概览、知识要点和行动建议，再结合章节回看 |
| **思维导图** | 从概念层次理解整段视频，补充线性摘要的阅读方式 |
| **转写与时间定位** | 查找原话，通过章节或字幕时间位置回到播放器 |
| **学习测验** | 根据视频生成题目，提交答案后查看成绩、解析和相关片段 |
| **视频问答** | 围绕当前内容继续追问；回答以流式文字逐步显示 |

[![视频学习流程：输入视频、整理材料、问答测验、回看原片，并按需保存或主动分享。](https://media.qiannawang.com/notes/workbench-diagrams/v3/vidgrab-learning-loop.zh-1bb3e0b4b1ce.webp)](https://media.qiannawang.com/notes/workbench-diagrams/v3/vidgrab-learning-loop.zh-1bb3e0b4b1ce.webp)

*总结、问答和测验围绕同一段视频展开，时间位置帮助回到原片核对。 [查看原图](https://media.qiannawang.com/notes/workbench-diagrams/v3/vidgrab-learning-loop.zh-1bb3e0b4b1ce.webp)*

例如，看完一段产品培训后，可以先读总结，再做测验，最后针对错题回看片段；不必重新从头找答案。

### 7.2 长视频分段处理

长视频需要分别处理**音频转写**与**长文本总结**，不能只是把整段内容一次交给模型：

1. **优先复用字幕：** 对支持的外链读取可用字幕，省去重复语音识别；本地文件或没有字幕时转写音频。
2. **音频分段：** 按供应商的时长、文件大小限制拆分，并限制同时进行的转写请求。
3. **文字分块：** 长转写先分块生成局部笔记，再按原始顺序综合成全片总结。
4. **展示处理进度：** 页面显示当前阶段和已完成的部分转写，减少只有转圈、无法判断进展的等待。

[![长视频处理：可用字幕或分段 ASR 汇成有序转写，短文本直接总结，长文本分块后汇总。](https://media.qiannawang.com/notes/workbench-diagrams/v3/vidgrab-processing.zh-b7491be6c4eb.webp)](https://media.qiannawang.com/notes/workbench-diagrams/v3/vidgrab-processing.zh-b7491be6c4eb.webp)

*分段处理保留原视频顺序，并限制并行数；部分转写是预览，不能当作全片结果。 [查看原图](https://media.qiannawang.com/notes/workbench-diagrams/v3/vidgrab-processing.zh-b7491be6c4eb.webp)*

**使用时注意两个区别：** 总结进度目前通过轮询获取，问答才是 SSE 流式回答；部分 ASR 句级时间是估算定位，不是精确逐词对齐。弱旁白视频还可按配置使用抽帧与视觉分析，效果取决于视觉模型及采样覆盖。

### 7.3 学习记录与社区

为了让内容能够持续积累，增加了账号下的保存与交流：

- **学习记录：** 保存分析结果，之后可以重新打开总结并继续回顾。
- **测验留存：** 试卷写入数据库，登录用户的作答尝试也会保存，方便回看成绩。
- **学习社区：** 用户主动发布适合分享的内容，支持个人主页、评论、点赞和收藏；举报与管理用于维护内容。

**保存个人结果与发布社区是两个动作。** 内部培训材料应先确认分享范围，不能因为完成总结就默认公开。

### 7.4 当前版本的变化

前文“第一期先不接数据库”是起步时的取舍；**当前账号、会员和主要业务记录已使用 PostgreSQL**。媒体文件仍由文件存储管理，部署时需要一起考虑数据库、文件卷和备份。

- **部署组成：** 当前 Compose 包含应用与 PostgreSQL，并引用 `vidgrab-shared` 外部网络；可选 Jeff 服务按部署方式接入。第六节保留上线流程，实际启动以当前 Compose 为准。
- **支付仍为可选：** 内部学习可先使用学习功能；需要会员服务时，再配置原文介绍的 Stripe。费率、开户条件与可用地区应按实际账户核对。
- **任务恢复仍需升级：** 当前后台处理和实时任务状态还在应用进程中；保存了学习结果，不代表服务重启后能自动继续未完成任务。

如果要进一步支持团队长期使用，可接着看[从个人 Demo 到企业级平台](/notes/enterprise-ai-production)，逐项补齐权限、任务可靠性、并发和运营能力。

---

## 附录：提示词索引

| 章节 | 用途 |
| --- | --- |
| 2.2 | 启动下载器项目 |
| 2.4 | 后端 API 设计护栏 |
| 3.2 | 扩展总结能力 |
| 4 | 同屏 UX 优化 |
| 5 | Stripe 会员支付 |
