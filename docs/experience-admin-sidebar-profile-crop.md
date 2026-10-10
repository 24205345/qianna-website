# Admin 侧栏 + 单图裁切上传经验

> 适用场景：模块较多的 `/admin` 后台；Singleton CMS 字段需上传**固定比例**展示图（如 About 头像、Hero）

2026-10-10 核对：当前布局为 `AdminShell`，生产媒体使用 R2；配置与上传限制见 [媒体运维](experience-media-storage.md)。

---

## Admin 侧栏模式

### 何时用

- 一级入口 ≥ 6 个，顶栏横向滚动或子分类全展开体验差
- Admin 主要桌面使用

### 结构约定

```
app/admin/layout.tsx              → Server layout 壳
app/admin/_components/
  AdminShell.tsx                  → Client：public 页、侧栏折叠与移动端状态
  AdminSidebar.tsx                → Client：usePathname + useSearchParams
  AdminPageHeader.tsx             → 仅 title + actions（nav / sign out 不进 header）
```

### Public 页（无侧栏）

- `/admin/login`
- `/admin/reset-password`

### 二级菜单展开规则

仅当 pathname 匹配父模块时展开子项，例如：

- **Projects**：`/admin/projects*` → 三分类链接（**不要重复 All**，点父级即全部）
- **Traces**：photography / visual-works / field-notes 前缀匹配

### Suspense

`AdminSidebar` 使用 `useSearchParams` 时，外层需 `<Suspense>`（见 `AdminShell`）。

---

## Singleton 单图上传 + 裁切

### 数据模型

在 singleton 表加两列即可，无需独立 media 表：

```sql
profile_image_url text not null default ''
profile_image_alt text not null default '...'
```

对象键：`about/profile-{timestamp}.{ext}`；上传到当前 provider 的 `portfolio-media` 桶，完整公开 URL 写入 singleton 字段。

### Server Action 模式（与 Hero 一致）

```typescript
const uploadedUrl = await uploadProfileImage(supabase, formData.get("profile_image") as File);
const profileImageUrl = uploadedUrl ?? optionalText(formData.get("profile_image_url"));
```

新上传优先；否则保留 URL 字段。

`uploadProfileImage` 内部经 `uploadMediaObject` 上传，Server Action 先调用 `auth.getUser()` 校验。Hero 额外做 sharp 压缩且使用 UUID 新路径；About 在客户端裁切，不能将两者写成完全相同的压缩流程。存储配置失败应报错，删除记录或替换 URL 不会自动清理原对象。

### 前台裁切 UI（react-easy-crop）

| 要点 | 做法 |
|------|------|
| 比例 | `aspect={16/9}` 与前台 `aspect-video` 一致 |
| 裁切框容器 | **`aspect-video`**，不要用 `h-64 w-full`（否则两侧大黑边） |
| 缩放 | `objectFit="cover"` + 滚轮（默认 `zoomWithScroll`） |
| 提交 | Canvas 导出 Blob → `File` → `DataTransfer` 写入 hidden `<input name="profile_image">` |
| 表单 | Server Component 表单可嵌入 Client 裁切组件 |

### 关键文件（About 示例）

- `app/admin/about/ProfilePhotoCropField.tsx`
- `app/admin/about/get-cropped-image.ts`
- `app/_components/about/AboutProfilePhoto.tsx`

---

## 常见坑

1. **裁切框又宽又扁、两侧黑边** → 容器与 crop aspect 不一致
2. **useSearchParams 构建报错** → 缺 Suspense boundary
3. **Projects 下 All 冗余** → 父级链接已是「全部」
4. **首页不该展示 Admin 专用图** → 照片仅 `/about`，首页保持文字摘要
5. **Windows** → 命令不要用 `&&`

---

## 扩展

- Hero / 其他 singleton 图：可复用同一 `ProfilePhotoCropField` 模式，抽成通用 `ImageCropField` + `aspect` prop
- 多图模块（Photography 等）：继续用 MediaManager，不必强行裁切组件
