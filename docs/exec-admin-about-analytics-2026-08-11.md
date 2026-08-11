# Admin 侧栏 + About 头像 + Analytics 执行记录

> 日期：2026-08-11  
> 状态：已完成，已 push（`64f4550` 及此前 analytics 相关 commit）

---

## 一、背景与目标

Admin 后台模块增多（Site / Notes / Projects / Traces / About / Guestbook / Analytics），原顶栏横向导航拥挤，子分类全摊出不符合使用习惯。同时 About 页需要个人照片展示，且上传前应支持 16:9 裁切，避免事先手动调整尺寸。

---

## 二、Admin 左侧边栏

### 方案对比

| 方案 | 说明 | 权重 |
|------|------|------|
| **左侧固定边栏** | 一级 + 二级嵌套，内容区在右 | **9/10** ✓ |
| 可折叠顶栏 + 抽屉 | 移动端友好，admin 以桌面为主 | 6/10 |

### 实现

| 文件 | 职责 |
|------|------|
| `app/admin/layout.tsx` | 挂载 `AdminDashboardLayout` |
| `app/admin/_components/AdminDashboardLayout.tsx` | flex 布局；login / reset-password 不显示侧栏 |
| `app/admin/_components/AdminSidebar.tsx` | 一级导航 + Projects / Traces 子项；底部 Sign Out |
| `app/admin/_components/AdminPageHeader.tsx` | 精简为 title + actions |

### 导航结构

```
Site Settings
Notes
Projects          → 三分类（无 All，点 Projects 即全部）
Traces            → Photography / Drawings / Field Notes
About
Guestbook
Analytics
[Sign Out]
```

### 删除的旧组件

- `AdminNav.tsx`
- `AdminProjectsSubNav.tsx`
- `AdminTracesSubNav.tsx`

---

## 三、About 个人照片

### 前台

- **首页**：不显示照片，仅标题 + 描述摘要
- **`/about`**：标题与描述下方、Timeline 之前，**16:9 横屏**占位或照片
- 组件：`app/_components/about/AboutProfilePhoto.tsx`

### 后台

- `/admin/about` → **Profile photo** 区块
- URL 输入 + 文件上传（`portfolio-media/about/profile-*`）
- 裁切：`ProfilePhotoCropField.tsx` + `react-easy-crop`
  - 固定 16:9
  - 裁切框容器 `aspect-video`（避免两侧黑边）
  - 滚轮缩放，无 Zoom 滑条
  - Apply crop → 写入隐藏 `profile_image` file input → 随表单提交

### 数据库

迁移 `0016_about_profile_image.sql`：

```sql
profile_image_url text not null default ''
profile_image_alt text not null default 'Qianna Wang profile photo'
```

表：`about_page_content`（singleton_key = `about`）

### 数据流

```
getAboutPageContent()
  ├── site_navigation_items (about) → pageTitle, pageDescription
  └── about_page_content → timeline, workingAcross, currentFocus, profileImage*
```

---

## 四、Analytics（同批次近期功能）

| 项 | 说明 |
|----|------|
| 表 | `page_views`（`0015_page_views.sql`） |
| 埋点 | `PageViewTracker` — PV / UV（Cookie `qn_vid` + hash）/ 停留时长 |
| 后台 | `/admin/analytics?range=today\|7d\|30d\|365d\|all` |
| 监控 | Vercel Speed Insights（`app/layout.tsx`） |

---

## 五、依赖变更

```json
"react-easy-crop": "^5.x"
```

`scripts/start-dev.ps1`：`package-lock.json` 变更时自动 `npm install`。

---

## 六、验证清单

- [ ] `/admin/login` 无侧栏
- [ ] Projects 子分类高亮与 `?category=` 一致
- [ ] Traces 子项在 photography / visual-works / field-notes 路由下正确高亮
- [ ] `/about` 无图时显示虚线占位；有图时 16:9 展示
- [ ] Admin 上传 → 裁切 → Save → 前台刷新可见
- [ ] `/admin/analytics` 有数据时图表正常

---

## 七、相关文档

| 文档 | 用途 |
|------|------|
| `docs/experience-admin-sidebar-profile-crop.md` | 侧栏 + 单图裁切上传模式（可复用） |
| `docs/experience-guestbook.md` | Guestbook 审核与过滤 |
| `docs/exec-site-ia-guestbook-2026-08-04.md` | 首页 IA + Guestbook 初版 |
