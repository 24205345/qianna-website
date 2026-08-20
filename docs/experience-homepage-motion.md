# 首页动效与 Reveal 组件经验

> 适用场景：作品集首页 Hero 进场、section 滚入、grid 卡片 stagger

---

## 分层原则

| 区域 | 技术 | 原因 |
|------|------|------|
| Hero 首屏（照片 + 文字） | **纯 CSS** `@keyframes` |  above-the-fold，不阻塞 LCP，SSR 友好 |
| 下方 section / 卡片 | **`Reveal` + Intersection Observer** | 进入视口再动画，减少无效计算 |

始终提供 `@media (prefers-reduced-motion: reduce)` 覆盖，使 opacity/transform 立即到位。

---

## Reveal 组件

**路径：** `app/_components/Reveal.tsx`

```tsx
<Reveal delay={80}>
  <Link href="..." className="group block h-full rounded-2xl border ...">
    ...
  </Link>
</Reveal>
```

### Props

| Prop | 说明 |
|------|------|
| `delay` | 进入视口后的 animation-delay（ms），用于 stagger |
| `className` | 与动效 class 合并到子元素或 wrapper |

### 实现要点

2. **能合并则合并（可选）**：若 wrapper 会破坏 grid，给内部 Link 加 `block h-full` 即可；不必 cloneElement 挂 ref（易触发 React 19 lint）

---

## Grid 卡片背景「裂开」

### 现象

Projects / Traces 卡片变成上下两块圆角矩形，标题行中间有一条缝。

### 原因

1. 动效组件外包 `<div>`，`<Link>` 不再是 grid 的直接子元素
2. `<a>` 默认 `display: inline`，`background` + `border-radius` 按**行盒**分段绘制

### 修复 checklist

- [ ] 卡片 Link 加 `block`（grid 卡片再加 `h-full`）
- [ ] Reveal 对 grid 卡片传 `className="h-full"`，内部 Link 用 `block h-full`

---

## Hero 涟漪开关

```ts
// app/_components/hero-distortion-config.ts
export const HERO_DISTORTION_ENABLED = false;
```

- `false`：`HeroImageDistortionClient` 只渲染静态图 + CSS Ken Burns，**不加载** WebGL bundle
- `true`：恢复涟漪；dev 下仍有 `HeroDistortionTuner`
- 另有自动降级：`prefers-reduced-motion`、`pointer: coarse` 时不启用 WebGL

---

## CSS 类速查（globals.css）

| Class | 用途 |
|-------|------|
| `hero-photo-enter` | Hero 照片 fade + 轻 Ken Burns |
| `hero-text-enter` | Hero 文字 fade-up |
| `hero-text-enter-delay-1/2` | stagger |
| `reveal-hidden` / `reveal-visible` | 滚入前/后（由 Reveal 切换） |

---

## 扩展时注意

- **不要在 Admin** 加 Reveal（操作效率优先）
- 其他列表页若要复用，直接 import `Reveal`；列表项 stagger 用 `delay={80 + index * 70}` 一类公式
- 动效时长保持克制（0.6–1.2s），ease-out，与 stone 色系站型一致

---

## Hero 封面图加载

| 层级 | 做法 |
|------|------|
| 前台 | `next/image` + `fill` + `priority` + `sizes="100vw"` — Vercel 按视口宽度输出 WebP/AVIF |
| 后台上传 | `compressHeroImage` → WebP 1920px / q75 → `site/home-hero.webp` |
| 重新迁移 | `npm run migrate:home`（需本地 `public/images/hero-image.jpg`） |

勿用裸 `<img src={supabaseUrl}>` 加载全尺寸 Storage 文件（LCP 慢）。

常量：`lib/media/hero-image.ts` · 压缩：`lib/media/compress-hero-image.ts`
