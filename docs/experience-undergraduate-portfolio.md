# 经验：本科作品集 Issuu 式展示

## 场景

要把 InDesign 导出的 PDF 作品集（如 `30pages4projects(none-info).pdf`）放到网站 **Architecture Projects** 下，阅读体验接近 **Issuu**：纵向连续翻页，而不是拆成散图网格。

## 方案对比

| 方案 | 权重 | 说明 |
| --- | --- | --- |
| A. PDF 导出为 JPG + `portfolio` 翻页布局（`react-pageflip`） | **9** | 封面即第一页；拖拽/点击翻页；可本地静态回退 |
| B. 内嵌 PDF.js / iframe | 6 | 实现快，但 80MB PDF 太重，移动端体验差 |
| C. 外链 Issuu | 4 | 依赖第三方，与站点视觉不统一 |

## 做法

1. **源文件**：用户路径可能是 PDF 而非文件夹；本机为 `G:\出国作品集\不同专业\30pages4projects(none-info).pdf`（15 个 spread，对应 4 个项目 + 封面 + Other Works）。
2. **导出**：`python scripts/extract-undergraduate-portfolio.py`（PyMuPDF）→ `public/projects/undergraduate-portfolio/pages/01.jpg` …
3. **前台**：`layout_template: portfolio` → 封面/封底单页 + 中间对页（3600px spread 拆左右）→ `react-pageflip` landscape 翻书；全屏居中自适应。
4. **导出**：PDF 第 1/15 页宽 841pt（单页），第 2–14 页宽 1683pt（对页）；脚本按页宽分别导出 1800 / 3600。
5. **部署**：spread 图片需 **commit + push** 后 Vercel 才能访问；仅写 DB 不够。

## 注意

- `(none-info)` 版仍可能在 PDF 文本层留联系方式；若需彻底匿名，应在 InDesign 重新导出或修 PDF。
- 与现有 `xicaoshi-red-temple` 可能内容重叠（同一课题不同呈现）；列表里保留两个入口即可。
- sparse-checkout 环境用 `scripts/download-project-media.ps1` 拉取 `undergraduate-portfolio/pages/*.jpg`。
