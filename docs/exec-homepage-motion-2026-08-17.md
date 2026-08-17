# 首页 Hero 动效 + 涟漪关闭 执行记录

> 日期：2026-08-17  
> 状态：已完成

---

## 一、背景与目标

首页 Hero 原有 WebGL 水面涟漪（`HeroImageDistortion`）视觉效果好，但与整体「安静、作品集气质」及后续文字/模块进场动效难以统一；且 WebGL chunk 增加首屏 JS 体积。

目标：

1. **暂时关闭**涟漪，改为静态 Hero 照片 + 轻量 CSS 进场
2. **统一动效语言**：Hero 照片 Ken Burns、文字 stagger、下方四板块滚入
3. **尊重** `prefers-reduced-motion`
4. **保留**涟漪代码与 dev Tuner，一行开关可恢复

---

## 二、方案对比

| 方案 | 说明 | 权重 |
|------|------|------|
| **A. CSS Reveal + Hero 轻量动效** | 纯 CSS 首屏 + IO 滚入，无 WebGL | **9/10** ✓ |
| B. 仅 Hero 文字 stagger | 实现快，但与 section 节奏不统一 | 6/10 |
| C. 保留涟漪 + 叠加动效 | 视觉冲突、性能差 | 4/10 |

---

## 三、涟漪关闭

| 文件 | 改动 |
|------|------|
| `app/_components/hero-distortion-config.ts` | `HERO_DISTORTION_ENABLED = false` |
| `app/_components/HeroImageDistortionClient.tsx` | 关闭时渲染静态 `<img>`，不 dynamic import WebGL |
| `app/_components/HeroImageDistortion.tsx` | `shouldUseDistortion()` 读取开关 |

**恢复涟漪：** 将 `HERO_DISTORTION_ENABLED` 改为 `true`（dev 下 Tuner 仍可用）。

---

## 四、Hero 进场动效

定义于 `app/globals.css`：

| Class | 效果 |
|-------|------|
| `.hero-photo-enter` | 1.2s fade + scale 1.03→1（Ken Burns） |
| `.hero-text-enter` | 0.7s fade-up |
| `.hero-text-enter-delay-1/2` | 副标题、CTA stagger 0.1s / 0.2s |

Hero 文字在 `app/page.tsx`（Server Component）直接挂 class，**不依赖 JS**，利于 LCP。

---

## 五、Scroll Reveal 组件

**文件：** `app/_components/Reveal.tsx`

- Intersection Observer，`threshold: 0.12`，`rootMargin: 0px 0px -5% 0px`
- 支持 `delay`（ms）做列表/卡片 stagger
- **`Reveal` wrapper + 卡片 Link `block h-full`**：避免 inline 背景裂开，同时不触发 React 19 ref lint
- 自定义组件（如 `GuestbookSection`）仍用外层 `div` 包裹

### 卡片「裂开」坑（已修复）

`Reveal` 外包 `div` 后，内部 `<Link>` 不再是 grid 子项，默认 `display: inline`，背景/圆角**按行分段绘制**，出现上下两块圆角矩形。

**修复：**

1. 卡片 Link 加 `block h-full`
2. `Reveal` 对 `Link` 使用 `cloneElement`，保持 grid 直接子项关系

详见 [`experience-homepage-motion.md`](experience-homepage-motion.md)。

---

## 六、首页 section 覆盖

| Section | 动效 |
|---------|------|
| Notes | 标题 Reveal；每条 note stagger +70ms |
| Projects | 标题 Reveal；三卡片 stagger |
| Traces | 同上 |
| About + Guestbook | 标题 → 摘要 → Guestbook 依次 Reveal |

Admin 页面不做动效。

---

## 七、验证

```powershell
npm run lint
npm run dev
```

- 首页 Hero 照片缓慢 zoom-in，标题/副标题/CTA 依次出现
- 滚动至 Projects/Traces，卡片为**完整圆角块**（非裂开）
- 系统开启「减少动态效果」时，全部 instant 显示
- 涟漪关闭：无 canvas，Network 无 WebGL chunk

---

## 八、关联改动（同批 commit）

- **Guestbook Turnstile**（可选）：`lib/guestbook/turnstile.ts`、`GuestbookTurnstile.tsx`；见 [`experience-guestbook.md`](experience-guestbook.md) §Turnstile
