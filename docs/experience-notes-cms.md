# 经验：独立 Notes 模块（Markdown + TOC）

## 场景

需要在作品集里写「学习/教程」长文，与 Projects 案例页（图廊/视频模板）形态不同；Admin 里三类 Project 混在一起也不好区分。

## 做法

1. **独立表 `notes`**，不要硬塞进 `projects.content_type`。
2. 首页用 **`site_navigation_items` 的 `section` 项**（`notes-preview`），与 `projects-preview` **并列**，渲染在上方；不要做成第四张 project category 卡。
3. 首页只展示 **title + 短 excerpt**；详情页再用 Markdown + h2/h3 TOC。
4. Admin **左侧栏** 单独 **Notes**；Projects 分类在侧栏 Projects 子菜单筛选。

## 注意

- `getSiteNavigationItems()` 以 `app/_data/site-navigation.ts` 的 fallback 列表为合并基准；新导航 key **必须写入 fallback**，否则即使数据库有记录也不会出现在前台。
- TOC 的 heading `id` 生成逻辑要与 Markdown 渲染组件共用同一套 slug 规则，否则锚点对不上。
- 中文标题自动 slug 可能退化成 `note`；后台应提示手动填写英文 slug。
