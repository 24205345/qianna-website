# 第四章参考站正文补充 · 2026-11-17

2026-11-18 补记：以下为当日的本地交付记录。五站正文现已同步到 CMS，中英文阅读页已验证；线框图底部说明也已删除并发布新图，见 [实际发布与验收记录](exec-ui-prototype-cms-fix-2026-11-18.md)。

用户要求先提交并推送当前实验室版本，再把截图中的五站参考建议写进第四章正文。按此顺序完成，正文补充保留在本地工作区。

## 提交与发布状态

- 实验室扩充与参考操作台：`5c4b22c4434f10c829610dfb1884b5188c0a7284`，`feat(workbench): expand interface lab and restore reference controls`，已推送至 `origin/main`。
- 提交包含此前工作区的 14 个相关文件，不包含环境文件、凭据或迁移收据。
- 随后的本次正文与维护记录：尚未再次提交或推送。
- 已同步中英文源稿与 `app/_data/ui-prototype-note.json`；未写入 CMS、R2。
- 未检查托管平台的自动部署结果，Git 推送不等于 CMS 正文已经更新。

## 正文安排

保留原有章节顺序、Refero 与 CTA 的具体介绍，以及三份提示词和三张配图。增量补充到两个位置：

- 第一节增加“认识页面的收尾”：用 Footer.design 解释页脚的职责、链接分组、桌面与手机的排列，并给出练习工具的需求句。主要操作继续跟随各自任务。
- 第三节补充“看到效果 → 知道名称 → 理解哪里能调整 → 写成自己的需求”的观察路径。
- “带着问题找参考”整合五站对照表，把读者遇到的问题、参考入口与应该带走的需求对应起来。
- 滚动示例区分进入视口后播放一次与持续跟随滚动，补充结束、回滚、触屏与减少动态效果的处理。
- 动态背景示例说明如何用实际文字比较颜色、速度、强度与注意力，并为练习内容保留静态呈现和替代状态。

网站介绍来自本次在浏览器中查看的公开页面；练习工具的布局与行为建议属于本章教学示例，不代表参考站点的产品结论。

| 参考 | 正文用途 |
| :--- | :--- |
| [Refero Styles](https://styles.refero.design/) | 从字体、配色、间距与组件提取视觉规则，整理为视觉说明或 DESIGN.md |
| [CTA.gallery](https://www.cta.gallery/) | 观察动作文案、位置和主次，写清点击后的等待与结果 |
| [Footer.design](https://www.footer.design/) | 理解页脚的信息分组与页面收尾 |
| [Scrolltide](https://www.scrolltide.co/) | 进阶观察局部滚动效果，逐次比较一个变化 |
| [Scroll Shaders](https://scrollshaders.com/) | 进阶观察动态背景的可读性与静态替代 |

不采用帖子中的资源数量或价格作为选择依据；未下载、嵌入或再分发这些站点的模板与代码。

## 检查结果

提交前已通过 `npm run lint`、`npx tsc --noEmit`、15 项实验室行为检查和章节同步检查。本次后续只修改 Markdown 与生成的正文回退，没有再次修改 React / TypeScript。

- `node scripts/sync-ui-prototype-note.mjs --check`：通过。
- `git diff --check`：通过。
- 对照已提交版本逐项比较：中英文各 3 份原始提示词、3 张原始配图、7 个二级章节标题内容均未变化；五站入口均存在。
- 实际浏览器：1440 × 960 桌面检查中文页脚与参考表；390 × 844 手机检查中英文对应内容。五站表均为 3 列、5 行正文；表格在手机局部横向滚动，整页没有横向溢出。桌面测得页面宽度与视口宽度同为 1425 px，手机同为 375 px（扣除滚动条）。
- 中文目录新增页脚入口与参考入口均可定位；英文新增标题与五站链接同步。

截图位于本机会话产物目录 `C:/Users/U0016735/.codex/visualizations/2026/11/10/01a1c365-b320-76e1-83df-c1255372cf09/`：`chapter04-footer-desktop.png`、`chapter04-five-reference-guide-desktop.png`、`chapter04-five-reference-guide-mobile.png`、`chapter04-reference-guide-en-mobile.png`。

## 本地预览说明

预览入口为 `http://127.0.0.1:3000/notes/ui-prototype-ergonomics?from=workbench`。为显示尚未写入 CMS 的本地正文，开发进程临时使用空的公开 Supabase 配置，使文章查询读取静态回退；没有改动 `.env.local` 或线上配置。

该预览进程的访问统计 Server Action 仍尝试创建 Supabase 客户端，因此开发指示器记录一条缺少配置的错误。正文与语言切换正常；本次未改动统计功能，也未将此预览视为 CMS 或统计链路验证。
