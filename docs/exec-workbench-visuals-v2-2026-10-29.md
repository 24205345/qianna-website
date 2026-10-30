# Workbench 图表第二版：模块分组与原生 SVG

> 历史执行记录。当前图集已由 [v3：中性色与按内容选形式](exec-workbench-visuals-v3-2026-10-29.md) 取代；以下保留 v2 各轮处理及其局限。

2026-10-29，替换生产中前三篇文章的全部 18 张中英文图片。

## 改版依据

用户认为第一版默认流程图外观不合适，提供了 `G:\project\free-video-downloader` 及 VidGrab 架构截图作为样式参考。读取该项目 `docs/系统架构与技术全景.md` 的原生 SVG：重点借鉴分组模块、独立标题栏、条目名称与说明的层级、紧凑布局，以及模块之间的关键连线。没有复制该项目的红色配色、动画、阴影、emoji、数据或产品专属内容。

第二版沿用本站暖白、炭灰、石色与灰绿基调。灰绿标题栏突出主流程或核心职责，普通模块采用浅石色；条目名称加粗，说明以次级文字展示，细线 Lucide 图标与文字基线对齐。图题使用 Georgia / SimSun，正文 Arial / Microsoft YaHei。

## 当前交付

| 文章 | 采用的布局 |
| --- | --- |
| Environment & Infrastructure | 工具职责分栏、MCP 连接架构、工程规约落实流程（后两组经同日语义核查重画，见文末） |
| Scope & Product Definition | 双路径合流、四步 MVP 流程、功能与价值双栏比较 |
| Architecture & Contracts | 约束／候选／核查流程、三方职责模块、含失败分支的时序图 |

图示保持一图一问题，不把全部内容强制画成同一种流程。画布统一 1040 单位宽，高度按构图确定；原生 SVG 与两倍分辨率 WebP 同步保留。源码和公开地址见 [manifest.json](diagrams/workbench/manifest.json)，后续复用标准见[图表规范](diagrams/workbench/README.md)。

SmartDiagram 现在用于逻辑源码清洗与 DSL 留存。最终 SVG 采用手工坐标排版，并非 Mermaid 默认布局渲染；清单中的引擎描述已相应更新。未修改 SmartDiagram 或 free-video-downloader，也未启动这两个项目的服务。

维护入口：

- [catalog.mjs](../scripts/notes-diagrams/catalog.mjs)：原有逻辑、图题、图注和文章位置。
- [editorial.mjs](../scripts/notes-diagrams/editorial.mjs)：双语模块、条目及不同构图。
- [native-svg.mjs](../scripts/notes-diagrams/native-svg.mjs)：原生 SVG 排版、文本换行、标题和条目溢出检查。
- [render.mjs](../scripts/notes-diagrams/render.mjs)：保存逻辑源码、导出图集与 Lucide 图标清单，无须浏览器渲染环境。

## 发布与核对

- 写入前重新匿名读取三篇文章及完整公开 Notes、Workbench 流水线快照。确认六份本地正文与线上完全一致，再只替换新旧图片 URL；所有提示词、代码块与正文内容保持不变。
- R2 使用 `notes/workbench-diagrams/v2/<id>.<lang>-<hash>.webp` 新对象。上传禁止覆盖已有文件，最终 18 张公开图均返回 200、WebP 内容类型且 SHA-256 匹配。保留第一版对象用于回退。
- 使用现有管理员登录，校验服务端 `app_metadata.cms_role=admin`。发布前再次比较快照，并用 `id` 和 `updated_at` 条件更新三篇的中英文正文。
- CMS 回读逐字段比较：六份正文与本地一致，目标文章其余元数据、其他公开文章和整个 Workbench 流水线均未改变。
- 三个生产文章地址均返回 200；每页服务端呈现三张图片，包含六个中英文新图 URL，使用现有 Next Image 与 alt。URL 变更使新图有独立缓存键。
- 本地查看中英文图集与典型单图，检查文字换行、层级、边框、箭头与关键分支。渲染时的标题和条目边界检查通过；重新生成后全部 18 个哈希一致。
- `npm run lint` 和 `git diff --check` 通过。未改业务组件、数据模型、存储权限、上传代码或项目依赖；未 commit / push。

当前 Work 设置仍禁用本地浏览器操作，本次没有完成新版的实际页面截图与多端、双语切换巡检。该限制未通过原生 Chrome 或其他自动化方式绕过。当前可交付的是新版图像及线上内容校验；第一版截图不能证明第二版外观。

本次查阅 Supabase changelog 和 update 参考；使用既有 SDK 的受限行更新方式，无新的 Supabase 功能或权限变更。

## 证据与回退

忽略目录 `.media-migration/` 保留：

- `workbench-visuals-v2-before.json`：本次发布前的公开文章与流水线。
- `workbench-visuals-v2-plan.json`：三条文章的双语正文变更。
- `workbench-visuals-v2-assets.json`：18 个公开图像哈希及状态。
- `workbench-visuals-v2-published.json`：发布后回读。
- `workbench-visuals-v2-pages.json`：三个公开页面的 HTTP / 图像引用核查。
- `workbench-visuals-v1-final-manifest.json`：旧图 URL 与哈希。

回退前比较当前正文与本次发布快照，避免覆盖后续人工修改；确认后只恢复三篇的双语正文图片引用。R2 对象保持不可变。上述快照、登录凭据和签名上传 URL 均不进入 Git。

## 同日后续：图表位置与正文衔接

用户指出 Environment 的整套工具职责图放在 Node.js / Python 小节中，与标题和后续正文不匹配。已在中英文正文中把该图移到全文开头导读之后，作为六个配置主题的总览；第一节改为“按项目需要配置运行环境”，避免标题暗示两个运行时都必须安装。

同时复核九组图的语义位置：MCP 流程图先解释工具接入在任务中的作用，开工检查先说明检查目的；Scope 的路径图放在路径说明后，MVP 图放在案例目标后，验收对比放在两类概念说明后；Architecture 的选型图补充导读，职责图放在假设案例引入后，失败时序放在失败处理小节。修正已删除表格后残留的“按下表整理”表述。

本次只调整正文位置、过渡和一个二级标题，图片对象与 URL 不变，不重新上传 R2。六份正文中的 fenced blocks 和图片 URL 集合比较一致。CMS 更新前后快照为 `.media-migration/workbench-figure-placement-{before,plan,published}.json`；目标文章其余元数据、其他文章及 Workbench 流水线回读保持一致。公开页面核查还检查环境总览图位于第一个二级标题之前。实际浏览器检查仍受前述设置限制。

## 同日再次修正：图示内容必须直接解释小节

用户继续指出 MCP 小节配图仍在讲“理解任务／执行行动／验证交付”，与 MCP 接入主题不匹配。上轮只移动图片并补充过渡文字，没有解决图本身的内容错配；上节关于 MCP 和开工检查的处理是历史记录，不作为当前合格依据。再次核查还发现第 6 节工程纪律配的是运行环境检查图。

本次重新绘制两组中英文图，共四张，沿用 v2 颜色、字体、模块及线条规范：

- `environment-mcp`：AI 应用 Host 内含 MCP Client，通过 Server 接入工具与数据，标明调用和返回。Context7、Firecrawl、Playwright 对应后文列出的三个例子；图注说明一条连接只是示意，Host 可接多个 Server。角色关系核对 [MCP 官方架构](https://modelcontextprotocol.io/docs/learn/architecture)，正文保留出处。
- `environment-harness`：写明范围、计划及技术约束，执行前读取并应用，交付时检查 diff、验证依据和未解决问题。该图放在三条工程规则和执行说明之后。

九组图的主题、正文位置、所回答的问题及适用边界记录在 [content-map.md](diagrams/workbench/content-map.md)。其余七组的 14 张图片哈希未变；移除本地两个废弃 ID 的生成文件，旧 R2 对象与发布快照保留用于回退。

发布与核查结果：

- 只修改 Environment 的中英文正文、图注和必要衔接。CMS 发布前再次比较整条记录，并以 `id` / `updated_at` 限制更新；回读确认目标其他字段、其余全部公开文章及完整 Workbench 流水线未变。
- 四个新 R2 对象均为独立内容哈希路径，上传禁止覆盖。公开读取均返回 200、WebP 类型及匹配的 SHA-256。
- 六份正文共 18 个图片位置均在各自预期小节；所有 fenced blocks 与发布前一致。三个生产页面均为 200、各呈现三张图并包含六个双语图片地址；Environment 图序为总览、MCP、工程规约，不再引用旧错配图。
- 本地逐张查看四张新图，确认标题、条目、连线和换行。实际页面截图与窄屏巡检仍受 Work 浏览器设置限制，未声称完成。
- 本轮脚本修改后的 `npm run lint` 与 `git diff --check` 通过。

本轮证据保存于忽略目录 `.media-migration/workbench-semantic-figures-{before,plan,assets,published,sections,pages}.json`。回退时仅在确认无后续编辑后恢复 Environment 双语正文；不删除公开媒体对象。未 commit / push。
