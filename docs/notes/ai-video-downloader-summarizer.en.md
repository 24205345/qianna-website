# Building an AI Video Downloader & Summarizer with Cursor

A practical build log: how to use Cursor (or any coding agent) to ship a lightweight product for cross-platform video download, AI summarization, and Stripe membership—plus reusable prompts and the pitfalls that matter in production.

---

## Overview

Ship in this order. Avoid stacking download, summary, UI polish, and payments all at once:

1. **Make download work** with yt-dlp, then commit to Git  
2. **Open a fresh chat** for summarization (new task, but grounded in existing docs/code)  
3. **Improve UX** (same-screen density, auto-trigger summary)  
4. **Add payments** (Stripe for global users; Alipay/WeChat for China-first audiences)  
5. **Deploy** (ECS + Docker Compose—see Section 6)

For tool products, the reliable pattern is: **core capability first, expansion second**. Here, the core is a trustworthy download pipeline.

---

## 1. Environment setup

Cursor works well, and so do other coding agents. With Cursor specifically, configure networking and MCP before implementation.

### 1.1 Cursor networking

Corporate proxies and VPNs can break HTTP/2. In Cursor **Network** settings, switch **HTTP Compatibility Mode** to **HTTP/1.1**, then continue through the proxy.

![Cursor Network settings: switch HTTP Compatibility Mode to HTTP/1.1](/notes/ai-video-downloader-summarizer/image001.jpg)

### 1.2 Connect MCP first

MCP servers improve documentation lookup and web extraction:

| Service | Role | Site |
| --- | --- | --- |
| **Firecrawl** | Crawl and understand web pages | [https://www.firecrawl.dev/](https://www.firecrawl.dev/) |
| **Context7** | Fetch fresher technical docs | [https://context7.com/](https://context7.com/) |

![MCP Servers panel with Context7 and Firecrawl enabled](/notes/ai-video-downloader-summarizer/image002.jpg)

Register, get API keys, then paste them into Cursor MCP config:

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

### 1.3 Optional skills

UI skills can help with interface quality, for example [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill):

```bash
uipro init --ai cursor --global
# Install to ~/.cursor/skills/
```

---

## 2. Requirements and design

### 2.1 Decide before coding

| Dimension | Question | Answer in this project |
| --- | --- | --- |
| Audience | Who is it for? | Users and creators who need to download/save videos |
| Core value | What pain does it remove? | Cross-platform download with less manual work |
| Form | How is it delivered? | Web, mobile + desktop |
| Feasibility | Can it be built? | Yes, via yt-dlp |
| Expansion | What comes later? | Summaries, translation, paid plans |

Three early decisions:

1. **Frontend tone**: practical, conversion-oriented.  
2. **Backend**: required; v1 can stay DB-free and lightweight.  
3. **Download strategy**: reuse [yt-dlp](https://github.com/yt-dlp/yt-dlp) instead of owning every platform parser.

### 2.2 Bootstrap prompt

```prompt
You are a professional engineer building Universal Video Downloader.
Workflow: propose a plan → wait for human confirmation → implement step by step → self-test → request acceptance.

## Requirements
1) Users: people who need to download/save videos, including creators
2) Core value: cross-platform video download with less manual work
3) Form factor: web app for mobile and desktop
4) Feasibility: build on yt-dlp
5) Expansion: summarization, subtitle translation, paid features
   (finish core download first)

## Human constraints
1) Frontend should emphasize practical value and monetization
2) Backend is required, but keep v1 lightweight (no database yet)
3) Prefer existing open-source download capability (yt-dlp)

## Guardrails
1) UI should feel distinctive; Apple.com is a useful reference for clarity
2) Build on the human plan, propose your own plan, then wait for confirmation
3) Prefer wrapping yt-dlp over reinventing platform parsers
```

### 2.3 Delivery cadence

- Confirm architecture in Plan mode before a full Build  
- Finish download first; expand only after it is stable  
- Prefer separated frontend/backend with one production port

```text
Frontend: Vue 3 in browser
        ↕  HTTP /api/*
Backend: FastAPI (Uvicorn)
  ├─ Parse / download (yt-dlp + thin platform adapters)
  ├─ AI summary / ASR / Q&A
  └─ Serve frontend/dist (single port 8000 in production)
```

### 2.4 Why FastAPI

| Framework | Performance | Dev speed | Learning cost | Fit |
| --- | --- | --- | --- | --- |
| FastAPI | High | High | Low | API services, lightweight tools |
| Flask | Medium | High | Low | Simple web apps |
| Django | Medium | Medium | High | Large full-stack systems |

One backend can serve many clients. In this product, every frontend can call the same `POST /api/summarize`.

```prompt
API design notes:

1) Keep response shapes stable, e.g.
{
  "task_id": "abc",
  "status": "done",
  "summary": "...",
  "chapters": [{ "start": 155, "title": "Section 2" }]
}

2) Configure CORS when frontend and backend are on different origins.

3) Protect endpoints with auth (sessionl JWT, API key, SSO, roles).

4) Keep secrets and billing logic on the backend.
Remember: one backend, many frontends.
```

---

## 3. Video summarization

### 3.1 Keep the sequence

Before building summarization:

1. Finish core download  
2. Commit to Git  
3. Start a new chat and require a full read of existing docs/code

Document at least: product overview, finished features, architecture, and key APIs.  
Useful references: [bibigpt.co](https://bibigpt.co/), [NoteGPT](https://notegpt.io/cn/bilibili-summarizer), NotebookLM—study differentiation, not copies.

### 3.2 Summarization prompts

```prompt
You are extending Universal Video Downloader.
Core download already works. Analyze existing docs and code before proposing changes.

## Goal
Add AI video summarization for faster learning and content review.

## Materials
- @project docs
- @current codebase

## Task
Competitor research → solution design → implementation

## Guardrails
Confirm anything unclear with a human before coding.

Start with competitor research:
- https://bibigpt.co/
- https://notegpt.io/cn/bilibili-summarizer
- NotebookLM
```

Before coding:

```prompt
1) Use Context7 and web search for up-to-date docs; avoid outdated APIs
2) Prefer additive changes; do not break existing download flows
3) Self-verify end-to-end before asking for acceptance

Start development.
```

### 3.3 Models and secrets

DeepSeek is enough for early verification.  
Before pushing to GitHub, store keys in `.env` / `local.env` and keep them out of git.

### 3.4 Playback and chapter seak

Chapter timestamps should control the player:

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

Some platforms need dedicated playback work. Successful download does not always mean reliable playback.

---

## 4. Frontend UX

| Direction | Practice | In this project |
| --- | --- | --- |
| Fewer clicks | Auto-trigger next step | Auto-summarize after parse |
| Higher density | Show related content together | Video info + summary side by side |
| Progressive disclosure | Core first, details later | Hide decorative hero after results |
| Responsive layout | Device-specific layout | Stack vertically on mobile |
| Feedback | Lodaing / disabled states | Block duplicate summary clicks |

Split UI changes into small steps and push often so regressions are easy to revert.

```prompt
You are improving Universal Video Downloader UX.
Download and summary already work. Analyze existing docs/code first.

## Goal
Put video information and summary on the same screen.
After parsing a video, automatically start summarization to remove one extra click.

## Guardrail
Confirm unclear requirements before making UI changes.
```

---

## 5. Payments with Stripe

| Dimension | Stripe | Alipay | WeChat Pay |
| --- | --- | --- | --- |
| Coverage | 46+ countries | Mostly China | Mostly China |
| Integration | Simple, strong docs/SDK | Medium, business credentials | Medium, business credentials |
| Testing | Mature sandbox + CLI | Limited sandbox | Limited sandbox |
| Currencies | 135+ | RMB-first | RMB-first |
| Fees | ~2.9% + $0.30 | ~0.6% | ~0.6% |
| Fit | Global / SaaS / indie tools | Domestic commerce | Domestic social commerce |

Choose Stripe for global audiences; Alipay/WeChat are often simpler for China-first products.

```prompt
Add membership checkout to Universal Video Downloader.

Stack preference: Stripe.
Use Context7 for the latest Stripe docs.
Prioritize payment security and idempotency.
Guide a first-time Stripe integrator through local testing with stripe listen.
```

Webhooks notify your backend after payment events. Locally, use `stripe listen``to forward events to:

`http://127.0.0.1:8000/api/billing/webhook`

Listen for `checkout.session.completed`, `customer.subscription.updated/deleted`, and `invoice.payment_failed`.

Security checklist: secrets stay server-side; verify webhook signatures; treat server-written membership state as source of truth.

---

## 6. Deployment

Production uses **Alibaba Cloud ECS + Docker Compose**:

1. Install Docker on Linux ECS and start the app with the repo's `compose.yaml`
2. Inject API keys, database, and Stripe settings via `.env.docker` / `.env`
3. *(Optional)* Put Baota or Nginx in front of the container port for domain + HTTPS
4. *(Optional)* Wire GitHub Actions to rsync and `docker compose up` on `git push`

For the full walkthrough (mirror tuning, firewall, health checks, production webhooks, etc.), see **[Aliyun ECS Deployment Guide: Docker Compose Single-Container Apps](/notes/aliyun-ecs-docker-deploy)**.

---

## 7. Feature updates

**Updated November 2, 2026.** Sections 1–6 retain the original build process, prompts, and operation screenshots. Subsequent iterations have expanded the project into VidGrab, a video learning assistant. This section adds the newer features and explains how to use them.

### 7.1 From summaries to learning

Alongside video links, users can now **upload local videos**, including training recordings, meetings, and existing material. After analysis, they can continue learning around the same video:

| Added or expanded feature | How to use it |
| --- | --- |
| **Structured summaries** | Read an overview, key points, and actionable takeaways, then revisit chapters |
| **Mind maps** | Understand the hierarchy of concepts alongside the linear summary |
| **Transcript and time navigation** | Find original wording and return to the player through chapter or transcript positions |
| **Learning quizzes** | Generate questions, submit answers, and review scores, explanations, and related passages |
| **Video Q&A** | Ask follow-up questions about the current content and receive streamed text |

[![Video learning workflow: input, structured material, questions and quizzes, source review, and optional saving or explicit sharing.](https://media.qiannawang.com/notes/workbench-diagrams/v3/vidgrab-learning-loop.en-397392627a66.webp)](https://media.qiannawang.com/notes/workbench-diagrams/v3/vidgrab-learning-loop.en-397392627a66.webp)

*Summaries, questions, and quizzes stay connected to the same video; time positions help return to the source. [View full-size](https://media.qiannawang.com/notes/workbench-diagrams/v3/vidgrab-learning-loop.en-397392627a66.webp)*

For a product-training recording, a learner can read the summary, take a quiz, and revisit passages related to incorrect answers without searching the entire video again.

### 7.2 Processing long videos

Long videos need separate handling for **audio transcription** and **long-text synthesis**, rather than one request containing everything:

1. **Reuse captions first:** obtain available captions for supported links to avoid unnecessary speech recognition. Transcribe audio for uploaded files or videos without captions.
2. **Split audio:** respect provider duration and file-size limits, with bounded concurrent transcription requests.
3. **Organize long text:** produce notes for individual chunks, restore their original order, and synthesize a full-video result.
4. **Show progress:** display the current stage and completed transcript portions instead of an unexplained spinner.

[![Long-video processing: captions or segmented ASR become an ordered transcript, followed by direct synthesis or chunked notes and a final summary.](https://media.qiannawang.com/notes/workbench-diagrams/v3/vidgrab-processing.en-6a10acb874ad.webp)](https://media.qiannawang.com/notes/workbench-diagrams/v3/vidgrab-processing.en-6a10acb874ad.webp)

*Segments retain their video order and concurrency is bounded. Partial transcripts are previews, not full-video results. [View full-size](https://media.qiannawang.com/notes/workbench-diagrams/v3/vidgrab-processing.en-6a10acb874ad.webp)*

**Two distinctions matter in use:** summary progress currently uses polling, while Q&A uses SSE streaming. Some ASR sentence timestamps are estimates for navigation, not precise word alignment. Weakly narrated videos can also use configured frame sampling and visual analysis, depending on the available vision model and sampling coverage.

### 7.3 Learning history and community

Accounts now support retaining results and discussing suitable material:

- **Learning history:** save an analysis and reopen its summary for later review.
- **Quiz records:** persist generated quizzes and signed-in users' attempts for reviewing scores.
- **Learning community:** explicitly publish material, with profiles, comments, likes, and favorites; reports and moderation support content maintenance.

**Saving a personal result and publishing a post are separate actions.** Confirm the audience for internal training material before sharing; finishing a summary does not imply publication.

### 7.4 Changes in the current version

The earlier choice to keep v1 database-free describes the starting point. **Current accounts, membership, and core business records use PostgreSQL.** Media remains in file storage, so deployment and backups need to cover both database records and file volumes.

- **Deployment:** current Compose includes the application and PostgreSQL and references the external `vidgrab-shared` network. Connect optional Jeff according to the deployment arrangement. Section 6 retains the original launch process; use current Compose for the actual services.
- **Payments remain optional:** an internal learning deployment can start with learning features. Configure the original Stripe integration when membership is needed, checking actual account fees, eligibility, and available regions.
- **Task recovery needs further work:** background execution and live task state still reside in the application process. Saved learning results do not mean unfinished work automatically resumes after a restart.

For a service that a team will rely on, continue with [From Personal Demo to Enterprise Platform](/notes/enterprise-ai-production) to address permissions, reliable tasks, concurrency, and operations incrementally.

---

## Appendix: prompt index

| Section | Purpose |
| --- | --- |
| 2.2 | Bootstrap the downloader |
| 2.4 | Backend API guardrails |
| 3.2 | Summarization expansion |
| 4 | Same-screen UX |
| 5 | Stripe membership |
