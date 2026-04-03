# 个人网站目录结构

> Qianna Wang 个人网站 · Next.js 16.2.1 · TypeScript + Tailwind CSS v4

---

## 页面路由 (`/app`)

| 路径 | 页面 | 状态 |
|------|------|------|
| `/` | 首页 | ✅ 完成 |
| `/about` | 关于页面 | 🔲 占位 |
| `/photography` | 摄影作品集 | ✅ 完成 |
| `/visual-works` | 视觉作品（绘画） | ✅ 完成 |
| `/projects` | 项目作品 | 🔲 占位 |
| `/projects/thesis` | 毕业设计 Thesis | ✅ 完成 |
| `/field-notes` | 游记/实地笔记 | ✅ 完成 |
| `/field-notes/nanjiluo` | 南极洛徒步 | ✅ 完成 |
| `/field-notes/yubeng` | 雨崩徒步 | ✅ 完成 |
| `/field-notes/whitecliffs` | Seven Sisters 徒步 | ✅ 完成 |
| `/field-notes/snowboard` | Superdévoluy 滑雪 | ✅ 完成 |

---

## 静态资源 (`/public`)

```
public/
├── images/
│   └── hero-image.jpg              # 首页封面图
│
├── photography/                    # 摄影照片 (46张)
│   ├── portraits-human-scale/      # 人物与尺度 (10张)
│   ├── architecture-tectonics/     # Getty Center 建筑 (18张)
│   └── venice-biennale/            # 威尼斯建筑双年展 (18张)
│
├── drawings/                       # 绘画作品 (22张)
│   ├── pen-drawing/                # 钢笔画 (6张)
│   ├── pen-and-wash/               # 钢笔淡彩 (10张)
│   └── watercolor/                 # 水彩 (6张)
│
├── projects/                       # 项目素材
│   └── thesis/
│       ├── images/                 # 项目图片 (8张)
│       └── video/                  # 项目视频 (2个)
│
├── field-notes/                    # 游记素材
│   ├── nanjiluo/images/            # 南极洛 (17张)
│   ├── yubeng/images/              # 雨崩 (9张)
│   ├── whitecliffs/images/         # Seven Sisters (11张)
│   └── snowboard/
│       ├── images/                 # 照片 (5张)
│       └── video/                  # 视频 (2个)
│
└── *.svg                           # 图标文件 (备用)
```

---

## 组件复用

| 组件 | 路径 | 使用页面 |
|------|------|----------|
| `PhotoGallery` | `/app/photography/PhotoGallery.tsx` | photography, visual-works |
| `PhotoGallery` | `/app/field-notes/PhotoGallery.tsx` | field-notes 子页面 |
| `ProjectGallery` | `/app/projects/thesis/ProjectGallery.tsx` | thesis |

---

## 设计规范

- **字体**: Geist Sans (正文) + Geist Mono (代码) + Serif (标题)
- **配色**: Stone 暖灰色系 (stone-50 ~ stone-950)
- **布局**: max-w-5xl 容器，响应式断点 md: 768px

---

## Git LFS 配置

大文件通过 Git LFS 管理（`.gitattributes`）：
- `*.mp4` - 视频文件
- `*.mov` - 视频文件

---

## 待完成

- [ ] `/about` 页面内容
- [ ] `/projects` 主页（项目列表）

---

*最后更新: 2026.4.2*
