# 进度检查记录（2026-07-19）

> **历史快照**：记录当时拉代码后的状态，**不代表当前进度**。  
> 最新状态请以 `docs/developer-guide.md` 与 `docs/cms-migration-checklist.md` 为准（截至 2026-08-11 已含 Notes / Traces / Guestbook / Analytics / Admin 侧栏 / 自定义域名等）。

> 本机路径：`D:\projects\personal_website`  
> 远程：`https://github.com/24205345/qianna-website.git`  
> 分支：`main` @ `64e0bb7`（已与 `origin/main` 同步）

---

## 1. 拉取结果

- 本地原先落后远程 **28 commits**，已 `git pull` 完成 fast-forward。
- 工作区干净；本地曾有 **筑建 ERP** 草稿，已暂存为 `stash@{0}: local zhujian-erp WIP`（远程未包含该项目）。
- 本机尚无 `.env.local`（仅有 `.env.local.example`），CMS 联调前需配置。

---

## 2. 当时进度（2026-07-19 快照）

| 模块 | 状态 | 说明 |
|---|---|---|
| Phase 0 基础设施 | ✅ | Supabase Auth / RLS / Storage / middleware |
| Projects 列表 + 媒体 + 动态详情 | ✅ | `/projects`、`/projects/[slug]`、`/admin/projects` |
| Photography | ✅ | `/photography` + `/admin/photography` |
| Visual Works | ✅ | `/visual-works` + `/admin/visual-works` |
| Field Notes | ✅ | `/field-notes/[slug]` + 双模板 |
| Home Hero CMS | ✅ | `/admin/site` |
| Site Navigation Copy | ✅ | `site_navigation_items` |
| About CMS（原 P6） | ✅ | 当时已完成 timeline；后续已加个人照片裁切（2026-08） |
| 线上部署 | ✅ | 现为 [www.qiannawang.com](https://www.qiannawang.com) |

**结论（历史）**：截至 2026-07-19，CMS P1–P6 与前台体验收尾已基本完成。此后又完成 Notes、Traces Hub、Guestbook、Analytics、Admin 侧栏、About 照片、自定义域名等，见较新 exec 文档。

---

## 3. 明显缺口

1. **数字产品项目「筑建 ERP」未进远程**：静态数据与 seed 仅有 `thesis`、`xicaoshi-red-temple`；详情页 `SLUG_CONFIG` 也只注册这两套模板。
2. **本机未配 Supabase 环境变量**，无法直接验证 `/admin` 与线上一致的数据流。
3. ~~**`docs/cms-migration-checklist.md` / `developer-guide.md` 未反映 About 已完成**~~ → 已于 2026-08-11 同步更新。

---

## 4. 方案对比与选择

| 方案 | 内容 | 权重 |
|---|---|---|
| **A. 补全数字产品项目（筑建 ERP）** | 新增 CMS 条目 + 详情模板（或复用现有 layout）+ 原型图上传；消化 stash 草稿 | **85** |
| **B. 本机联调 + 文档同步** | 配 `.env.local`、lint/build、更新 checklist；暂不推新内容 | **55** |

**执行选择：优先 A（内容缺口对作品集完整度影响更大）；B 作为 A 的前置/强制配套（先配环境再改）。**

---

## 5. 建议下一步（可执行顺序）

1. 从另一台电脑或密码管理器拷贝 `.env.local`（参考 `.env.local.example`）。
2. `npm install` → `npm run lint` → `npm run build`。
3. 决定筑建 ERP 详情视觉：新建 `digital` 模板，或先复用 `xicaoshi`/`thesis` 其一再迭代。
4. 后台 `/admin/projects` 新建项目（Category = Digital Product），上传原型图；补静态 fallback（`app/_data/*`）与 `SLUG_CONFIG`。
5. 更新 `docs/cms-migration-checklist.md`：将 P6 标为 ✅。
6. 需要时再处理 `git stash`（对比远程架构后选择性合并，勿直接 `stash pop` 硬套旧静态页）。

---

## 6. 经验

- 跨电脑协作时，**以 `git log` + 最新代码为准**，交接文档可能滞后于 About / Hero 等后续提交。
- 本仓库详情页依赖 **slug → layout 白名单**；新项目不能只写后台数据，还必须注册 fallback / 模板，否则 `notFound()`。
- 本地 WIP（stash）与远程 CMS 架构已分叉，合并前要按「后台数据 + 动态 `[slug]`」重做，而不是恢复旧硬编码路由页。
