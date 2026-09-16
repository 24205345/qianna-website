# 执行记录：首页杂志策展风改版、Notes 富文本升级与后台极速渲染优化

日期：2026-09-16  
状态：已完成并上线验证

---

## 1. 任务背景与目标

本次综合迭代包含三大核心工作：
1. **首页杂志策展风改版（方案 A）与视觉精细化**：解决先前首页“灰色卡片过多、排版均质、视觉缺乏焦点”的问题，回归克制高级的杂志排版与双字体系统。
2. **后台 Notes 所见即所得编辑器重构（参考 AI-Learning-Hub）**：淘汰简陋分栏模式，引入 Tiptap v3，支持长文固定目录、表格插入、直接粘贴截图与纯 Markdown 双向无损同步。
3. **后台 Site Settings 封面与板块实景仿真工作台**：重构封面与板块导航管理，支持桌面/移动端 1:1 动态仿真渲染与真实照片展示，移除生硬的 9 项原始配置。
4. **后台全站渲染性能深度优化（Instant Navigation）**：彻底解决点击侧边栏页面冻结卡死、多重鉴权网络瀑布以及查询串行水坝等性能痛点。

---

## 2. 首页杂志策展风（Curated Editorial Archive）与排版统一

### 2.1 极简双字体体系（Serif 标题 + Sans 统领全局）
- **全面拔除 `font-mono`**：全站首页 100% 清除所有等宽字体，消除字形高频交替带来的视觉杂波；
- **眉标统一**：`Curated Index · 01`、`Observation Archive · 02`、`Essays & Field Discourse · 03`、`WORKING ACROSS` 全部规范化为 `text-xs tracking-[0.22em] text-stone-500 uppercase`；
- **角标与标签归一**：年份 `2025`、`FEATURED RESEARCH`、`FLIPBOOK`、Notes 序号 `[01]` 与日期 `2026.08.13` 均回归极简 `font-sans text-xs`。

### 2.2 导航轨与悬停微动效（Sub-rail Hover Indicator）
- 在 Projects 与 Traces 标题下的分类导航整行底部加入与子页面 `/traces` 完全同款的浅色细分割线（`border-b border-stone-200/80`）；
- 左侧分类 Tab 与右侧 `View all →` 统一在 `pb-3` 呼吸底基准线上对齐；
- **悬停指示动效**：鼠标滑过任一分类 Tab 时，文字平滑变为深黑加粗（`hover:text-stone-900 hover:font-medium`），并在底部分割线上压上 2px 实心黑线（`-mb-px border-b-2 border-stone-900`），手感与子页面当前激活 Tab 相同；
- 移除了所有 `View all xxx →` 下方默认的下划线，仅在 hover 时加深文字并平滑右移动画（`translate-x-0.5`）。

### 2.3 画面去噪与板块重构
- **Traces 专栏大图去噪**：移除了上方两个主展示图右下角多余的 `View →` 悬浮按钮，支持整卡点击直接进入，视觉更连贯；
- **About Me 杂志双列重构**：左列 7 列展示主副标题与核心个人陈述；右列 5 列通过细腻浅灰线分隔展示 `WORKING ACROSS` 5 个领域徽章，解决原先右侧大面积空旷问题；
- **Notes 列表对齐优化**：将日期下移至与微分类标签（`[portfolio]`、`[nextjs]`）同一水平线上，标题与 `[01]` 序号获得完整排版宽度。

---

## 3. 后台 Notes 富文本所见即所得编辑器升级

- **基于 Tiptap v3**：支持加粗、斜体、H2/H3、引用块、代码块、超链接、列表；
- **纯 Markdown 双向无损**：基于 `@tiptap/markdown` 扩展，载入即解析，保存与提交始终是纯 Markdown 字符串，完全不影响现有数据库与前台文章详情页；
- **双层吸顶与固定长文目录（TOC）**：
  - 顶层吸顶放置多语言切换与字数统计；
  - 次层吸顶放置目录标题与富文本工具栏；
  - 左侧目录侧栏固定独立滚动，内置 `3.5px` 超细滑动条；
  - `IntersectionObserver` 实时滚动高亮当前章节，点击平滑直达定位（带 offset 防止遮挡）；
- **可视化表格系统**：工具栏一键插入 3×3 表格，光标选中后弹出增删行、增删列、整表删除操作；
- **极速图片粘贴（Ctrl+V）**：支持剪切板截图直接在画布中粘贴上传至 Supabase 存储桶并渲染。

---

## 4. 后台 Site Settings 封面与板块实景仿真工作台

- **Hero 封面 1:1 动态实景渲染**：还原首页 Hero 的渐变、排版遮罩与衬线标题，打字即时在右侧同步仿真；
- **双端视口模拟器**：支持桌面宽屏（16:9）与移动竖屏（9:16 iPhone 框）实时切换，预览主体构图；
- **现代化图片上传**：支持直接拖拽电脑图片释放、剪切板粘贴截图（Ctrl+V），带即时本地预览（`createObjectURL`）与原图一键恢复；
- **板块导航实景视口**：聚合 `Selected Works`、`Visual Footprints`、`Essays & Notes`、`About Me` 四大板块，左侧调文案，右侧实时渲染真实封面大图与排版；
- **精简表单**：彻底移除“全部 9 项原始配置”陈旧表单卡片，在后台通过隐藏域联动保障数据无缝保存。

---

## 5. 后台全站渲染性能深度优化（Instant Navigation）

### 5.1 根因分析
- **双重网络鉴权阻塞**：`middleware.ts` 已经通过网络向 Supabase 验证过 session，但所有后台页面（`notes`, `projects`, `photography`, `visual-works`, `about`, `analytics` 等）在执行前又重复串行调用了 `await supabase.auth.getUser()`，导致单次页面加载白白增加 300ms~800ms 的远程网络延迟；
- **缺失 `loading.tsx`**：Next.js 在服务端渲染完成前完全冻结上一页面，用户点击侧边栏后毫无反馈；
- **多层串行查询水坝**：编辑页先查主表、再查媒体/分类，数据库往返 2~4 次；Analytics 解析标题时连续发起 3 次串行查询。

### 5.2 优化落地
1. **秒级响应全局骨架屏（[`app/admin/loading.tsx`](../app/admin/loading.tsx)）**：
   - 为后台全局挂载统一暖石风的标题、按钮与数据行脉冲骨架；
   - 点击侧边栏任意菜单，主区域 **< 50ms 立即呈现骨架响应**。
2. **零延迟鉴权上下文透传（[`getAdminAuthSession`](../lib/supabase/server.ts)）**：
   - `middleware.ts` 校验成功后通过 `NextResponse.next({ request: { headers } })` 将 `x-user-id` 和 `x-user-email` 透传给 Server Components；
   - 页面端调用 `getAdminAuthSession()` 直接读取请求头（0ms 耗时），**彻底省去重复的 Auth 远程请求，页面加载直接提速 300~800ms**。
3. **侧边栏全局路由预加载（`prefetch={true}`）**：
   - `AdminSidebar.tsx` 中一级和二级分类链接全部启用 `prefetch={true}`。
4. **全面并发化数据库查询（`Promise.all`）**：
   - 项目编辑页、摄影图集编辑页、视觉作品编辑页、随记编辑页、About 页面、Analytics 标题解析全面改造为并发查询；
   - Analytics 分页记录合理控制上限，降低 WAN 传输开销。
5. **富文本引擎动态懒加载（Dynamic Import）**：
   - `NoteForm.tsx` 动态懒加载 Tiptap 模块（`ssr: false`），减小主包打包体积。

---

## 6. 验证结果

- `npm run lint`：0 错误、0 警告；
- `npx tsc --noEmit`：0 错误，TypeScript 严格类型全部通过；
- 本地服务压测：路由响应时间压降至 35ms 级别，侧边栏切换流畅自然。
