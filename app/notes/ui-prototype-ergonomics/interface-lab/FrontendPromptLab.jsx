"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Sparkles,
  ScanEye,
  Layers,
  Palette,
  Box,
  Zap,
  Copy,
  Check,
  ChevronDown,
  Search,
  ArrowRight,
  Cpu,
  Terminal,
  Play,
  CheckCircle2,
  LayoutGrid,
  Wand2
} from 'lucide-react';

// ==================== 术语解剖词典 (X-Ray Dictionary) ====================
const ANATOMY_TERMS = {
  navbar: {
    id: 'navbar',
    cn: '顶部粘性导航栏',
    en: 'Sticky Navbar / Header',
    category: '布局结构 (Layout)',
    desc: '固定在页面顶部的导航区域，通常包含品牌 Logo、主导航链接（Nav Links）和右侧行动按钮（CTA）。',
    promptEn: 'A sticky top navigation bar with backdrop blur, brand logo on the left, center navigation links, and a primary CTA button on the right.',
    promptCn: '顶部固定粘性导航栏（Sticky Navbar），带有背景毛玻璃模糊效果，左侧放置品牌 Logo，中间为导航链接，右侧配有主行动按钮（CTA）。',
    tailwind: 'sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b'
  },
  announcement: {
    id: 'announcement',
    cn: '胶囊公告徽章',
    en: 'Announcement Pill / Badge',
    category: '微观组件 (Component)',
    desc: '位于主标题上方的胶囊形小标签，用于吸引视线、展示新版本发布或核心亮点。',
    promptEn: 'An interactive announcement pill badge above the main heading with a subtle border, icon, and status tag.',
    promptCn: '位于主标题上方的胶囊形公告徽章（Pill Badge），带细腻边框、前缀图标与状态指示。',
    tailwind: 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium'
  },
  hero: {
    id: 'hero',
    cn: '首屏主视觉区',
    en: 'Hero Section',
    category: '布局结构 (Layout)',
    desc: '用户打开网页第一眼看到的核心区域，包含主标题（Headline）、副标题（Subheadline）和行动召唤按钮组（CTA Group）。',
    promptEn: 'A high-impact Hero Section with a gradient display headline, muted supporting subheadline, dual CTA buttons (primary solid + secondary ghost), and interactive preview showcase.',
    promptCn: '高视觉冲击力的首屏主视觉区（Hero Section），包含大字号主标题、浅色副标题说明、主次双行动按钮（CTA Buttons）以及视觉展示卡片。',
    tailwind: 'py-12 px-6 text-center max-w-4xl mx-auto space-y-6'
  },
  ctaGroup: {
    id: 'ctaGroup',
    cn: '行动召唤按钮组',
    en: 'CTA Button Group (Primary + Ghost)',
    category: '微观组件 (Component)',
    desc: '引导用户核心转化的按钮组合：主按钮（Primary Button）采用高对比实心填充，次按钮（Secondary / Ghost Button）采用描边或透明背景。',
    promptEn: 'Dual Call-to-Action (CTA) button group featuring a high-contrast primary button with hover elevation and a secondary outlined ghost button.',
    promptCn: '双行动召唤按钮组（CTA Group）：左侧为高对比度实心主按钮（带悬停微抬升动效），右侧为描边幽灵次按钮（Ghost Button）。',
    tailwind: 'flex flex-wrap items-center justify-center gap-4'
  },
  statsBar: {
    id: 'statsBar',
    cn: '核心指标数据栏',
    en: 'KPI Metrics / Social Proof Bar',
    category: '布局结构 (Layout)',
    desc: '用醒目的大数字与简短标签展示产品关键指标或用户规模，增强页面信任感（Social Proof）。',
    promptEn: 'A 3-column KPI metrics bar displaying key statistics with large tabular numbers and muted descriptive labels.',
    promptCn: '三列式核心数据指标栏（KPI Metrics Bar），使用大号等宽数字搭配辅助说明文字，建立信任背书。',
    tailwind: 'grid grid-cols-3 gap-4 p-4 border rounded-2xl'
  },
  bentoGrid: {
    id: 'bentoGrid',
    cn: '便当盒不对称网格',
    en: 'Bento Grid Layout',
    category: '布局结构 (Layout)',
    desc: '源自日式便当盒的分格灵感（Apple 与 Linear 常用），通过跨列（col-span）组合不同尺寸的功能卡片，兼具秩序感与视觉节奏。',
    promptEn: 'An asymmetric Bento Grid layout using CSS Grid with varying column spans (col-span-2 and col-span-1) to showcase core product features.',
    promptCn: '不对称便当盒网格布局（Bento Grid），通过跨列大卡片与标准小卡片的组合，错落有致地展示核心特性。',
    tailwind: 'grid grid-cols-1 md:grid-cols-3 gap-4'
  },
  interactiveTabs: {
    id: 'interactiveTabs',
    cn: '分段控制器 / 标签页',
    en: 'Segmented Control / Tabs',
    category: '微观组件 (Component)',
    desc: '允许用户在同一个容器内无缝切换不同视图或内容维度的导航组件。',
    promptEn: 'A pill-style segmented control (Tabs) with active state indicator for switching content panels smoothly.',
    promptCn: '胶囊式分段控制器（Segmented Control / Tabs），带激活高亮滑块，用于在同一区域切换不同内容视图。',
    tailwind: 'inline-flex p-1 rounded-xl bg-slate-100 border'
  },
  accordion: {
    id: 'accordion',
    cn: '手风琴折叠面板',
    en: 'Accordion / Collapsible FAQ',
    category: '微观组件 (Component)',
    desc: '点击标题即可展开或收起详情内容的垂直列表，常用于常见问题（FAQ）或参数设置说明，节省页面纵向空间。',
    promptEn: 'A vertically stacked Accordion component with smooth expand/collapse transitions and rotating chevron icons.',
    promptCn: '垂直堆叠的手风琴折叠面板（Accordion），支持点击展开或收起隐藏详情，配有旋转箭头指示。',
    tailwind: 'divide-y border rounded-2xl overflow-hidden'
  },
  toastPreview: {
    id: 'toastPreview',
    cn: '轻提示通知条',
    en: 'Toast / Snackbar Notification',
    category: '微观组件 (Component)',
    desc: '悬浮在页面角落的非阻塞式轻量反馈提示，操作完成后自动浮现并在几秒后消失，不打断用户当前流程。',
    promptEn: 'A floating Toast notification component with status icon, title, and dismiss button for non-blocking feedback.',
    promptCn: '非阻塞式悬浮轻提示（Toast / Snackbar），带状态图标与操作反馈文案。',
    tailwind: 'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border'
  },
  skeletonCard: {
    id: 'skeletonCard',
    cn: '骨架屏加载占位',
    en: 'Skeleton Loader / Shimmer',
    category: '微观组件 (Component)',
    desc: '在数据尚未加载完成时，用带呼吸闪烁动画（animate-pulse）的灰色色块模拟内容排版轮廓，比单纯转圈（Spinner）体验更好。',
    promptEn: 'A Skeleton loader placeholder card using pulsing gray blocks (animate-pulse) to mimic avatar and text lines during data fetching.',
    promptCn: '骨架屏加载占位符（Skeleton Loader），用带脉冲呼吸动画的色块提前勾勒头像与文本行轮廓，降低用户等待焦虑。',
    tailwind: 'animate-pulse space-y-3 p-4 border rounded-xl'
  }
};

// ==================== 预设配置方案 (Presets) ====================
const PRESETS = [
  {
    id: 'linear-saas',
    name: 'Linear 极客暗黑风',
    badge: 'SaaS 热门',
    config: {
      layout: 'bento',
      designSystem: 'shadcn',
      visualStyle: 'glass',
      themeColor: 'indigo',
      darkMode: true,
      radius: 'lg',
      motionType: 'spring',
      hoverEffect: 'glow',
      stiffness: 260,
      damping: 20,
      showSkeleton: false,
      showToast: true
    }
  },
  {
    id: 'neo-creator',
    name: 'Gumroad 新粗野主义',
    badge: '高辨识度',
    config: {
      layout: 'split',
      designSystem: 'neobrutalism',
      visualStyle: 'brutal',
      themeColor: 'amber',
      darkMode: false,
      radius: 'sm',
      motionType: 'bounce',
      hoverEffect: 'lift',
      stiffness: 400,
      damping: 12,
      showSkeleton: false,
      showToast: true
    }
  },
  {
    id: 'enterprise-clean',
    name: 'AntD 企业级工作台',
    badge: 'B端后台',
    config: {
      layout: 'dashboard',
      designSystem: 'antd',
      visualStyle: 'minimal',
      themeColor: 'blue',
      darkMode: false,
      radius: 'md',
      motionType: 'fade',
      hoverEffect: 'scale',
      stiffness: 200,
      damping: 26,
      showSkeleton: true,
      showToast: true
    }
  },
  {
    id: 'apple-bento',
    name: 'Apple 柔和毛玻璃',
    badge: '产品发布',
    config: {
      layout: 'bento',
      designSystem: 'mui',
      visualStyle: 'soft',
      themeColor: 'emerald',
      darkMode: false,
      radius: 'full',
      motionType: 'stagger',
      hoverEffect: 'tilt',
      stiffness: 180,
      damping: 18,
      showSkeleton: false,
      showToast: false
    }
  }
];

// ==================== 选项配置元数据 ====================
const OPTIONS = {
  layout: [
    {
      value: 'bento',
      label: '便当盒网格',
      en: 'Bento Grid Layout',
      desc: '居中首屏 + 跨列不对称特性卡片，适合现代官网与产品介绍',
      promptEn: 'Use a centered Hero section followed by an asymmetric 3-column Bento Grid layout (mixing col-span-2 and col-span-1 cards).'
    },
    {
      value: 'split',
      label: '左右分栏首屏',
      en: 'Split-Screen Hero',
      desc: '左文右图/交互卡片对称排布，适合强调功能演示的落地页',
      promptEn: 'Use a two-column Split-Screen Hero layout (left column for typography and CTAs, right column for interactive preview showcase).'
    },
    {
      value: 'dashboard',
      label: '侧边栏控制台',
      en: 'Sidebar + Main Workspace',
      desc: '左侧固定导航栏 + 右侧主内容区，适合 SaaS 后台与 AI 工具',
      promptEn: 'Use an application shell layout with a fixed left navigation sidebar and a scrollable main content workspace.'
    }
  ],
  designSystem: [
    {
      value: 'shadcn',
      label: 'shadcn/ui',
      en: 'shadcn/ui (Radix + Tailwind)',
      desc: '当下最火的极简无边框感设计，大量使用细腻 1px 边框与低饱和对比',
      promptEn: 'Follow shadcn/ui design language: subtle 1px borders (border-slate-200/800), zinc/slate neutral palette, clean typography, and minimal shadows.'
    },
    {
      value: 'antd',
      label: 'Ant Design',
      en: 'Ant Design Enterprise',
      desc: '阿里企业级设计规范，间距紧凑、边界清晰、状态反馈极其明确',
      promptEn: 'Follow Ant Design enterprise guidelines: structured card containers, clear primary color highlights, compact spacing, and standardized form controls.'
    },
    {
      value: 'mui',
      label: 'Material UI',
      en: 'Material You (MUI v6)',
      desc: 'Google 设计体系，强调柔和的表面层级（Elevation）与大圆角亲和力',
      promptEn: 'Follow Material Design 3 (Material You) style: tonal surface elevation, generous pill corners, and tactile ripple-like state feedback.'
    },
    {
      value: 'neobrutalism',
      label: 'Neo-Brutalism',
      en: 'Neo-Brutalism (新粗野主义)',
      desc: '纯黑粗边框 + 零模糊硬朗偏移阴影 + 高饱和撞色，极具潮流创作者个性',
      promptEn: 'Follow Neo-Brutalism aesthetic: thick 2px-3px solid black borders, hard non-blurred offset shadows (shadow-[4px_4px_0px_#000]), and bold high-contrast accent colors.'
    }
  ],
  visualStyle: [
    {
      value: 'glass',
      label: '毛玻璃透光',
      en: 'Glassmorphism',
      desc: '半透明背景叠加高斯模糊（backdrop-blur）与微光描边',
      promptEn: 'Apply Glassmorphism surfaces using semi-transparent backgrounds (bg-white/70 or bg-slate-900/60), backdrop-blur-xl, and subtle inner light borders.'
    },
    {
      value: 'minimal',
      label: '瑞士极简留白',
      en: 'Swiss Minimalist',
      desc: '克制装饰，依靠字重对比、网格对齐与充足留白传递高级感',
      promptEn: 'Apply a clean Swiss Minimalist aesthetic with generous whitespace, crisp hairline dividers, and strong typographic hierarchy.'
    },
    {
      value: 'brutal',
      label: '波普硬阴影',
      en: 'Hard Offset Pop',
      desc: '鲜明色块碰撞与复古印刷感硬阴影',
      promptEn: 'Apply bold graphic surfaces with solid fills, high-contrast outlines, and crisp offset drop shadows.'
    },
    {
      value: 'soft',
      label: '柔和弥散渐变',
      en: 'Soft Mesh & Bento',
      desc: '温润的浅色底纹与顶部环境光晕（Ambient Glow）',
      promptEn: 'Apply soft diffused radial gradients in the background with smooth tonal cards and gentle ambient shadows.'
    }
  ],
  motionType: [
    {
      value: 'spring',
      label: '弹簧物理回弹',
      en: 'Spring Physics Entrance',
      desc: '基于刚度（Stiffness）与阻尼（Damping）的自然弹性过渡',
      promptEn: 'Use spring physics animations (Framer Motion type: "spring") for natural, snappy element transitions.'
    },
    {
      value: 'stagger',
      label: '子元素错落入场',
      en: 'Staggered Children Reveal',
      desc: '列表或网格卡片按 80ms 时间差依次向上浮现，极具呼吸感',
      promptEn: 'Implement staggered entrance animations (staggerChildren: 0.08) where cards sequentially fade in and slide up.'
    },
    {
      value: 'bounce',
      label: '活力Q弹缩放',
      en: 'Playful Overshoot Bounce',
      desc: '带有明显超调回弹（Overshoot）的活泼曲线',
      promptEn: 'Use playful overshoot cubic-bezier transitions for energetic micro-interactions.'
    },
    {
      value: 'fade',
      label: '丝滑渐显平移',
      en: 'Smooth Ease-Out Fade',
      desc: '克制稳重的阻尼渐显，适合严肃商业与数据密集型界面',
      promptEn: 'Use subtle, fast ease-out opacity and translateY transitions (200ms) for a distraction-free experience.'
    }
  ],
  hoverEffect: [
    {
      value: 'lift',
      label: '微抬升加深阴影',
      en: 'Hover Lift & Shadow',
      desc: '鼠标悬停时卡片向上浮动 4px 并放大投影（-translate-y-1）'
    },
    {
      value: 'glow',
      label: '聚光灯流光边框',
      en: 'Spotlight Border Glow',
      desc: '鼠标悬停时边框亮起主题色霓虹光晕'
    },
    {
      value: 'scale',
      label: '呼吸感微缩放',
      en: 'Micro Scale (scale-[1.02])',
      desc: '悬停时整体轻微放大 2%，给予直接的点击暗示'
    },
    {
      value: 'tilt',
      label: '3D 视差倾斜',
      en: '3D Perspective Tilt',
      desc: '悬停时产生空间透视旋转感'
    }
  ]
};

const THEME_COLORS = {
  indigo: {
    name: '极客靛蓝 (Indigo)',
    primaryBg: 'bg-indigo-600 hover:bg-indigo-500',
    primaryText: 'text-indigo-600 dark:text-indigo-400',
    lightBg: 'bg-indigo-500/10',
    borderGlow: 'hover:border-indigo-500/60 hover:shadow-indigo-500/20',
    ring: 'ring-indigo-500',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    hex: '#4f46e5'
  },
  emerald: {
    name: '生机翡翠 (Emerald)',
    primaryBg: 'bg-emerald-600 hover:bg-emerald-500',
    primaryText: 'text-emerald-600 dark:text-emerald-400',
    lightBg: 'bg-emerald-500/10',
    borderGlow: 'hover:border-emerald-500/60 hover:shadow-emerald-500/20',
    ring: 'ring-emerald-500',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    hex: '#059669'
  },
  amber: {
    name: '活力琥珀 (Amber)',
    primaryBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    primaryText: 'text-amber-600 dark:text-amber-400',
    lightBg: 'bg-amber-500/15',
    borderGlow: 'hover:border-amber-500/60 hover:shadow-amber-500/20',
    ring: 'ring-amber-500',
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    hex: '#f59e0b'
  },
  blue: {
    name: '科技深蓝 (Blue)',
    primaryBg: 'bg-blue-600 hover:bg-blue-500',
    primaryText: 'text-blue-600 dark:text-blue-400',
    lightBg: 'bg-blue-500/10',
    borderGlow: 'hover:border-blue-500/60 hover:shadow-blue-500/20',
    ring: 'ring-blue-500',
    gradient: 'from-blue-600 via-sky-500 to-indigo-500',
    hex: '#2563eb'
  }
};

  // X-Ray 包装器组件：在透视模式下为页面部位添加可悬停/点击的术语高亮框与不折行角标
function XRayWrapper({ termId, children, className = '', badgeAlign = 'left', xrayMode, activeAnatomyId, setActiveAnatomyId }) {
    const term = ANATOMY_TERMS[termId];
    const isSelected = activeAnatomyId === termId;

    if (!xrayMode) {
      return <div className={className}>{children}</div>;
    }

    const posClass =
      badgeAlign === 'right'
        ? '-top-3 right-3'
        : badgeAlign === 'center'
        ? '-top-3.5 left-1/2 -translate-x-1/2'
        : '-top-3 left-3';

    return (
      <div
        data-anatomy={termId}
        tabIndex={0}
        aria-label={`查看部位：${term.cn}`}
        onKeyDown={(e) => { if (e.target === e.currentTarget && ["Enter", " "].includes(e.key)) { e.preventDefault(); setActiveAnatomyId(termId); } }}
        onClick={(e) => {
          e.stopPropagation();
          setActiveAnatomyId(termId);
        }}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setActiveAnatomyId(termId);
        }}
        className={`relative group/xray cursor-pointer transition-all duration-200 ${className} ${
          isSelected
            ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent rounded-xl z-20'
            : 'hover:ring-1 hover:ring-cyan-400/60 rounded-xl'
        }`}
      >
        {/* 顶部悬浮解剖术语角标（强制单行 whitespace-nowrap 防止竖排挤压） */}
        <div
          className={`absolute ${posClass} z-30 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium whitespace-nowrap shadow-md transition-all pointer-events-none ${
            isSelected
              ? 'bg-cyan-400 text-slate-950 scale-105 opacity-100'
              : 'bg-slate-900/95 text-cyan-300 border border-cyan-500/40 opacity-85 group-hover/xray:opacity-100'
          }`}
        >
          <ScanEye className="w-3 h-3 shrink-0" />
          <span>{term.cn}</span>
          <span className="opacity-75 hidden xl:inline">· {term.en.split('/')[0].trim()}</span>
        </div>
        {children}
      </div>
    );
}

export default function FrontendPromptLab({ initialPromptLanguage = 'mixed' }) {
  // 核心配置状态
  const [config, setConfig] = useState(PRESETS[3].config);
  // 当前选中的预设 ID（用于左栏预设按钮高亮）
  const [activePresetId, setActivePresetId] = useState(PRESETS[3].id);
  // X-Ray 透视解剖模式开关（默认开启，方便小白一眼看到效果）
  const [xrayMode, setXrayMode] = useState(true);
  // 当前悬停或点击锁定的解剖部位
  const [activeAnatomyId, setActiveAnatomyId] = useState('bentoGrid');
  // 动画重播计数器
  const [animKey, setAnimKey] = useState(0);
  // 预览画布内部的交互状态（让画布里的组件真能点！）
  const [previewTab, setPreviewTab] = useState('components');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  // 浏览器视口等比缩放比例（默认 85% 微缩桌面浏览器感，可一键切 75% / 85% / 100%）
  const [viewportScale, setViewportScale] = useState(0.85);
  // 右侧提示词面板语言模式：'mixed' (中英对照结构版) | 'en' (纯英文精准版) | 'glossary' (部位词典速查)
  const [promptTab, setPromptTab] = useState(initialPromptLanguage);
  // 复制反馈状态
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copyTimer = useRef(null);
  const manualCopy = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  // 最近修改的字段（用于触发右侧 Prompt 联动高亮）
  const [lastChangedField, setLastChangedField] = useState(null);

  const updateConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setActivePresetId(null);
    setLastChangedField(key);
    if (['motionType', 'stiffness', 'damping', 'layout'].includes(key)) {
      setAnimKey((k) => k + 1);
    }
  };

  const applyPreset = (preset) => {
    setConfig(preset.config);
    setActivePresetId(preset.id);
    setLastChangedField('preset');
    setAnimKey((k) => k + 1);
  };

  const theme = THEME_COLORS[config.themeColor] || THEME_COLORS.indigo;

  // 根据圆角配置计算类名
  const radiusClass = useMemo(() => {
    const map = {
      none: 'rounded-none',
      sm: 'rounded-md',
      md: 'rounded-xl',
      lg: 'rounded-2xl',
      full: 'rounded-3xl'
    };
    return map[config.radius] || 'rounded-2xl';
  }, [config.radius]);

  const btnRadiusClass = useMemo(() => {
    const map = {
      none: 'rounded-none',
      sm: 'rounded',
      md: 'rounded-lg',
      lg: 'rounded-xl',
      full: 'rounded-full'
    };
    return map[config.radius] || 'rounded-xl';
  }, [config.radius]);

  // 根据组件库与风格计算卡片容器样式
  const getCardStyle = () => {
    const isDark = config.darkMode;
    if (config.designSystem === 'neobrutalism' || config.visualStyle === 'brutal') {
      return `${
        isDark ? 'bg-slate-900 text-white border-white shadow-[4px_4px_0px_#ffffff]' : 'bg-white text-slate-900 border-slate-950 shadow-[4px_4px_0px_#0f172a]'
      } border-2`;
    }
    if (config.visualStyle === 'glass') {
      return `${
        isDark
          ? 'bg-slate-900/65 text-slate-100 border-white/10 shadow-xl shadow-black/20'
          : 'bg-white/75 text-slate-800 border-slate-200/80 shadow-lg shadow-slate-200/50'
      } backdrop-blur-xl border`;
    }
    if (config.designSystem === 'antd') {
      return `${
        isDark ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-white text-slate-800 border-slate-200 shadow-sm'
      } border`;
    }
    return `${
      isDark ? 'bg-slate-900/90 text-slate-100 border-slate-800/80 shadow-md' : 'bg-white text-slate-800 border-slate-200/70 shadow-md shadow-slate-200/40'
    } border`;
  };

  // 根据悬停效果计算类名
  const getHoverClass = () => {
    switch (config.hoverEffect) {
      case 'lift':
        return 'transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl';
      case 'glow':
        return `transition-all duration-300 ${theme.borderGlow} hover:shadow-lg`;
      case 'scale':
        return 'transition-all duration-300 hover:scale-[1.02]';
      case 'tilt':
        return 'transition-all duration-300 hover:[transform:perspective(800px)_rotateX(2deg)_rotateY(-2deg)] hover:shadow-xl';
      default:
        return 'transition-all duration-200';
    }
  };

  // 根据物理参数生成 CSS 过渡近似表现
  const getMotionStyle = (index = 0) => {
    const duration = Math.max(220, Math.min(800, Math.round(650 - config.stiffness * 0.8 + config.damping * 4)));
    const delay = config.motionType === 'stagger' ? index * 90 : 0;
    let easing = 'cubic-bezier(0.16, 1, 0.3, 1)';
    if (config.motionType === 'bounce') {
      easing = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
    } else if (config.motionType === 'spring') {
      const overshoot = Math.max(1.05, Math.min(1.45, 1 + (config.stiffness / 500) * (25 / Math.max(8, config.damping))));
      easing = `cubic-bezier(0.22, ${overshoot.toFixed(2)}, 0.36, 1)`;
    }
    return {
      animation: `labEnter ${duration}ms ${easing} ${delay}ms both`
    };
  };

  // 生成最终结构化 AI 提示词
  const generatedPrompt = useMemo(() => {
    const layoutObj = OPTIONS.layout.find((o) => o.value === config.layout);
    const dsObj = OPTIONS.designSystem.find((o) => o.value === config.designSystem);
    const styleObj = OPTIONS.visualStyle.find((o) => o.value === config.visualStyle);
    const motionObj = OPTIONS.motionType.find((o) => o.value === config.motionType);
    const hoverObj = OPTIONS.hoverEffect.find((o) => o.value === config.hoverEffect);

    const radiusMap = {
      none: 'sharp 0px corners (rounded-none)',
      sm: 'small compact corners (rounded-md / 6px)',
      md: 'balanced medium corners (rounded-xl / 12px)',
      lg: 'generous modern corners (rounded-2xl / 16px)',
      full: 'pill and super-rounded corners (rounded-3xl / rounded-full)'
    };

    if (promptTab === 'en') {
      return `### Role & Tech Stack
Act as a Senior Frontend Engineer & UI/UX Designer. Build a modern, responsive React + Tailwind CSS web page using Lucide icons and Framer Motion.

### 1. Page Architecture & Layout
- **Layout Pattern**: ${layoutObj?.en} — ${layoutObj?.promptEn}
- **Anatomy Sections**:
  1. **Sticky Navbar**: Top navigation with backdrop-blur, brand identity, nav links, and primary CTA.
  2. **Hero Section**: Announcement pill badge above a bold display headline, muted subheadline, and dual CTA button group (Primary solid + Secondary ghost).
  3. **KPI Metrics Bar**: 3-column social proof statistics bar with tabular numbers.
  4. **Feature Bento Grid & Interactive Showcase**: Segmented control tabs, interactive feature cards, and a collapsible FAQ Accordion.
${config.showSkeleton ? '  5. **Loading States**: Include pulsing Skeleton Loader placeholders for async data cards.\n' : ''}${config.showToast ? '  6. **Feedback Layer**: Floating non-blocking Toast notification bar.\n' : ''}
### 2. Component Library & Visual Direction
- **Design System Reference**: ${dsObj?.en} — ${dsObj?.promptEn}
- **Surface Aesthetic**: ${styleObj?.en} — ${styleObj?.promptEn}
- **Color Palette**: ${config.darkMode ? 'Dark Mode (Slate-950 canvas, Slate-900 cards, high-contrast light text)' : 'Light Mode (Clean Slate-50 canvas, pure white surfaces, crisp dark typography)'} with **${theme.name}** (${theme.hex}) as primary accent.
- **Border Radius Token**: Use ${radiusMap[config.radius]}.

### 3. Motion & Micro-Interactions
- **Entrance Animation**: ${motionObj?.en} — ${motionObj?.promptEn}
- **Spring Physics Parameters**: \`{ type: "spring", stiffness: ${config.stiffness}, damping: ${config.damping} }\`
- **Hover Feedback**: Apply **${hoverObj?.en}** (${hoverObj?.desc}) on interactive cards and buttons.`;
    }

    return `# Role: 资深前端架构师与 UI/UX 设计师
请使用 **React + Tailwind CSS + Lucide Icons + Framer Motion** 为我开发一个现代响应式网页。具体页面部位术语、视觉规范与交互要求如下：

## 1. 页面宏观布局与部位构成 (Page Anatomy & Layout)
- **核心布局模式**：${layoutObj?.label}（\`${layoutObj?.en}\`）—— ${layoutObj?.desc}。
- **包含的标准页面部位**：
  - **顶部导航栏 (\`Sticky Navbar\`)**：固定在顶部，带毛玻璃模糊（\`backdrop-blur\`），左侧品牌标识，右侧主行动按钮（\`Primary CTA\`）。
  - **首屏视觉区 (\`Hero Section\`)**：顶部放置胶囊公告徽章（\`Announcement Pill Badge\`），中间为高对比度大标题（\`Display Headline\`）与副标题（\`Subheadline\`），下方配主次双按钮组（\`Primary Button + Ghost Button\`）。
  - **核心指标栏 (\`KPI Metrics Bar\`)**：三列等宽数字统计条，建立数据信任感。
  - **核心内容区 (\`${config.layout === 'bento' ? 'Bento Grid 便当盒网格' : 'Feature Showcase Cards'}\`)**：内置分段控制器标签页（\`Segmented Control Tabs\`）与手风琴折叠问答面板（\`Collapsible Accordion\`）。${config.showSkeleton ? '\n  - **加载占位符 (`Skeleton Loader`)**：为异步数据卡片配备带呼吸动画（`animate-pulse`）的骨架屏。' : ''}${config.showToast ? '\n  - **反馈通知 (`Toast Notification`)**：包含非阻塞式的悬浮轻提示反馈条。' : ''}

## 2. 组件库气质与视觉规范 (Design System & Visual Tokens)
- **组件库设计风格**：参考 **${dsObj?.label}**（\`${dsObj?.en}\`）—— ${dsObj?.desc}。
- **表面质感**：采用 **${styleObj?.label}**（\`${styleObj?.en}\`）。
- **色彩与明暗模式**：${config.darkMode ? '暗黑模式（`Dark Mode`，深邃灰黑背景配微光边框）' : '明亮模式（`Light Mode`，清爽浅灰底色配纯白卡片）'}，主强调色采用 **${theme.name}**（\`${theme.hex}\`）。
- **圆角规范 (\`Border Radius\`)**：全局组件统一采用 \`${radiusMap[config.radius]}\`。

## 3. 动效与微交互参数 (Motion & Micro-interactions)
- **入场动画**：**${motionObj?.label}**（\`${motionObj?.en}\`）。
- **物理弹簧参数**：Framer Motion 配置 \`transition={{ type: "spring", stiffness: ${config.stiffness}, damping: ${config.damping} }}\`。
- **鼠标悬停反馈 (\`Hover State\`)**：所有可交互卡片应用 **${hoverObj?.label}**（\`${hoverObj?.en}\`）。`;
  }, [config, promptTab, theme]);

  const handleCopyPrompt = async () => {
    clearTimeout(copyTimer.current); setCopied(false); setCopyError(false);
    try {
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(generatedPrompt); }
      else {
        const t = document.createElement('textarea'); t.value = generatedPrompt;
        document.body.appendChild(t); t.select();
        try { if (!document.execCommand('copy')) throw new Error('Copy unavailable'); } finally { t.remove(); }
      }
      setCopied(true); copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch { setCopyError(true); }
  };
  useEffect(() => { if (copyError) { manualCopy.current?.focus(); manualCopy.current?.select(); } }, [copyError]);

  const activeTerm = ANATOMY_TERMS[activeAnatomyId] || ANATOMY_TERMS.bentoGrid;

  return (
    <div lang="zh-CN" className="frontend-prompt-lab h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 注入全局无最外层滚动条约束 + 定制暗色/亮色纤细滚动条样式 + 关键帧动画 */}
      <style>{`
        .frontend-prompt-lab { height: 100dvh; margin: 0; }
        @keyframes labEnter {
          0% {
            opacity: 0;
            transform: translateY(22px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        /* 左栏、右栏与暗黑预览画布的纤细科技感滚动条 */
        .lab-scroll-dark {
          scrollbar-width: thin;
          scrollbar-color: rgba(99, 102, 241, 0.35) rgba(15, 23, 42, 0.4);
        }
        .lab-scroll-dark::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .lab-scroll-dark::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.4);
          border-radius: 9999px;
        }
        .lab-scroll-dark::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.45);
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .lab-scroll-dark::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.75);
        }

        /* 亮色预览画布的纤细清爽滚动条 */
        .lab-scroll-light {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.6) rgba(241, 245, 249, 0.7);
        }
        .lab-scroll-light::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .lab-scroll-light::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.7);
          border-radius: 9999px;
        }
        .lab-scroll-light::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.55);
          border-radius: 9999px;
        }
        .lab-scroll-light::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.65);
        }
      `}</style>

      {/* ==================== 顶部实验室总控栏 (清爽极简：左品牌 + 右开关) ==================== */}
      <header className="lab-header shrink-0 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md z-50 px-4 py-2">
        <div className="max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* 左侧品牌（已去掉红框标注的胶囊标签） */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base tracking-tight text-white">
                Frontend Prompt Lab 前端提示词实验室
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                边玩边认网页部位术语 · 实时预览组件库与动效 · 自动编译专业 AI Prompt
              </p>
            </div>
          </div>

          {/* 右侧：X-Ray 开关与动画重播 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setXrayMode(!xrayMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                xrayMode
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <ScanEye className="w-4 h-4" />
              <span>X-Ray 部位透视：{xrayMode ? '已开启' : '已关闭'}</span>
            </button>

            <button
              onClick={() => setAnimKey((k) => k + 1)}
              title="重播入场动效"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span className="hidden sm:inline">重播动画</span>
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 主体三栏工作台 (占满剩余屏幕高度，内部三栏各自独立滚动) ==================== */}
      <main className="lab-workspace flex-1 min-h-0 max-w-[1800px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3.5 p-3 overflow-hidden">
        {/* ==================== 左栏：预设方案 + 参数与术语操作台 (独立滚动条) ==================== */}
        <aside aria-label="配置工作台" className="lab-settings lg:col-span-3 h-full min-h-0 overflow-y-auto lab-scroll-dark space-y-3 pr-1.5 pb-2">
          {/* 顶部新增：经典预设风格方案 (2x2 网格置于左栏最上方) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>经典风格预设 (Presets)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Quick Start</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {PRESETS.map((preset) => {
                const isActive = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 ${
                      isActive
                        ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-sm shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="text-xs font-semibold truncate">{preset.name}</div>
                    <div>
                      <span
                        className={`inline-block text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          isActive
                            ? 'bg-cyan-400/20 text-cyan-300'
                            : 'bg-indigo-500/15 text-indigo-300'
                        }`}
                      >
                        {preset.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 模块 1：页面宏观布局 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>1. 页面宏观布局 (Layout)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Structure</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {OPTIONS.layout.map((item) => {
                const active = config.layout === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => updateConfig('layout', item.value)}
                    className={`text-left p-2.5 rounded-xl border transition-all ${
                      active
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold">{item.label}</span>
                      <span className="text-[10px] font-mono text-indigo-300 truncate">{item.en}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 模块 2：组件库气质与视觉风格 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Palette className="w-4 h-4 text-pink-400" />
                <span>2. 组件库与视觉体系 (Style)</span>
              </div>
              <button
                onClick={() => updateConfig('darkMode', !config.darkMode)}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              >
                {config.darkMode ? '暗色画布' : '亮色画布'}
              </button>
            </div>

            {/* 组件库选择 */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 block">主流组件库气质 (Component Library)</label>
              <div className="grid grid-cols-2 gap-1.5">
                {OPTIONS.designSystem.map((item) => {
                  const active = config.designSystem === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => updateConfig('designSystem', item.value)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        active
                          ? 'bg-pink-500/20 border-pink-500 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 表面质感 */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 block">表面材质感 (Surface Aesthetic)</label>
              <div className="grid grid-cols-2 gap-1.5">
                {OPTIONS.visualStyle.map((item) => {
                  const active = config.visualStyle === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => updateConfig('visualStyle', item.value)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        active
                          ? 'bg-indigo-500/20 border-indigo-400 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">{item.en}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 主题强调色与圆角 */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1.5">主强调色 (Accent)</label>
                <div className="flex items-center gap-2">
                  {Object.entries(THEME_COLORS).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => updateConfig('themeColor', key)}
                      title={val.name}
                      aria-label={val.name}
                      style={{ backgroundColor: val.hex }}
                      className={`w-5 h-5 rounded-full transition-transform ${
                        config.themeColor === key ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1.5">圆角 (Radius)</label>
                <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                  {['none', 'sm', 'md', 'lg', 'full'].map((r) => (
                    <button
                      key={r}
                      onClick={() => updateConfig('radius', r)}
                      className={`flex-1 py-1 text-[10px] font-mono rounded-md transition-all ${
                        config.radius === r ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 模块 3：动效与微交互实验室 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>3. 动效与物理参数 (Motion)</span>
              </div>
              <span className="text-[10px] font-mono text-amber-300">Framer Motion</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {OPTIONS.motionType.map((item) => {
                const active = config.motionType === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => updateConfig('motionType', item.value)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      active
                        ? 'bg-amber-500/20 border-amber-400 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">{item.en}</div>
                  </button>
                );
              })}
            </div>

            {/* 弹簧刚度与阻尼滑块 */}
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 space-y-2">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">弹簧刚度 (Stiffness)</span>
                  <span className="font-mono text-amber-400">{config.stiffness}</span>
                </div>
                <input
                  type="range"
                  aria-label="弹簧刚度"
                  min="80"
                  max="500"
                  step="10"
                  value={config.stiffness}
                  onChange={(e) => updateConfig('stiffness', Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">阻尼系数 (Damping · 越小越弹)</span>
                  <span className="font-mono text-amber-400">{config.damping}</span>
                </div>
                <input
                  type="range"
                  aria-label="阻尼系数"
                  min="8"
                  max="40"
                  step="2"
                  value={config.damping}
                  onChange={(e) => updateConfig('damping', Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            </div>

            {/* 悬停反馈 */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 block">卡片悬停微交互 (Hover Effect)</label>
              <div className="grid grid-cols-2 gap-1.5">
                {OPTIONS.hoverEffect.map((item) => {
                  const active = config.hoverEffect === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => updateConfig('hoverEffect', item.value)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        active
                          ? 'bg-emerald-500/20 border-emerald-400 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">{item.en}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 附加状态组件开关 */}
            <div className="pt-1 flex items-center justify-between gap-2">
              <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showSkeleton}
                  onChange={(e) => updateConfig('showSkeleton', e.target.checked)}
                  className="rounded accent-indigo-500"
                />
                <span>展示骨架屏 (Skeleton)</span>
              </label>
              <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showToast}
                  onChange={(e) => updateConfig('showToast', e.target.checked)}
                  className="rounded accent-indigo-500"
                />
                <span>展示轻提示 (Toast)</span>
              </label>
            </div>
          </div>
        </aside>

        {/* ==================== 中栏：等比例缩小的桌面浏览器展示界面 (占 6 列，内嵌风格适配滚动条) ==================== */}
        <section aria-label="实时网页预览" className="lab-preview lg:col-span-6 h-full min-h-0 flex flex-col gap-2.5 overflow-hidden">
          {/* 顶部：当前选中部位的“解剖透视词典卡片” (固定高度不挤压画布) */}
          <div className="lab-anatomy shrink-0 bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/60 border border-cyan-500/30 rounded-2xl p-3 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-cyan-400 text-slate-950 text-[11px] font-bold flex items-center gap-1">
                  <ScanEye className="w-3 h-3" />
                  部位解剖卡
                </span>
                <h2 className="text-sm font-bold text-white">{activeTerm.cn}</h2>
                <code className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {activeTerm.en}
                </code>
              </div>
              <span className="text-[11px] text-slate-400">{activeTerm.category}</span>
            </div>
            <p className="text-xs text-slate-300 leading-snug mb-1.5">{activeTerm.desc}</p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1.5 border-t border-slate-800/80 text-[11px]">
              <div className="text-emerald-300 font-mono truncate">
                怎么跟 AI 说：“{activeTerm.promptCn}”
              </div>
              <span className="text-slate-400 whitespace-nowrap text-[10px]">
                (悬停或点击下方画布任意区块切换)
              </span>
            </div>
          </div>

          {/* 模拟桌面浏览器窗口外框（等比例微缩视口 + 专属定制滚动条） */}
          <div
            className={`flex-1 min-h-0 rounded-2xl border overflow-hidden transition-colors duration-300 flex flex-col relative shadow-2xl ${
              config.darkMode
                ? 'bg-slate-950 border-slate-800 text-slate-100'
                : 'bg-slate-100 border-slate-300 text-slate-900'
            }`}
          >
            {/* 柔和背景环境光晕 (当选择 glass 或 soft 时凸显) */}
            {(config.visualStyle === 'glass' || config.visualStyle === 'soft') && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                  className={`absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-25 bg-gradient-to-br ${theme.gradient}`}
                />
                <div
                  className={`absolute top-1/2 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 bg-gradient-to-tr ${theme.gradient}`}
                />
              </div>
            )}

            {/* 模拟桌面浏览器顶栏（包含红黄绿窗口键、地址栏、以及等比缩放切换器） */}
            <div
              className={`lab-preview-bar shrink-0 px-4 py-2 border-b flex items-center justify-between gap-2 text-xs z-20 ${
                config.darkMode ? 'bg-slate-900/95 border-slate-800 text-slate-400' : 'bg-slate-200/85 border-slate-300 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <div
                  className={`ml-2 px-2.5 py-0.5 rounded-md font-mono text-[11px] flex items-center gap-1.5 border ${
                    config.darkMode
                      ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                      : 'bg-white/80 border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="opacity-50">https://</span>
                  <span>localhost:3000</span>
                  <span className="opacity-40">·</span>
                  <span className={theme.primaryText}>
                    {OPTIONS.designSystem.find((d) => d.value === config.designSystem)?.label}
                  </span>
                </div>
              </div>

              {/* 浏览器视口等比缩放控制 + 模式状态 */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center p-0.5 rounded-lg border text-[10px] font-mono ${
                    config.darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-300'
                  }`}
                >
                  {[
                    { scale: 0.75, label: '75%' },
                    { scale: 0.85, label: '85%' },
                    { scale: 1, label: '100%' }
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setViewportScale(item.scale)}
                      className={`px-1.5 py-0.5 rounded transition-all ${
                        viewportScale === item.scale
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-500 font-medium">
                  {xrayMode ? '悬停查名称' : '纯净预览'}
                </span>
              </div>
            </div>

            {/* 独立滚动且支持等比例微缩的浏览器视口内容区 */}
            <div
              key={animKey}
              className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative z-10 p-4 sm:p-5 ${
                config.darkMode ? 'lab-scroll-dark' : 'lab-scroll-light'
              }`}
            >
              {/* 等比例微缩容器：采用 CSS zoom 实现真实的桌面网页等比微缩观感并保持精准滚动高度 */}
              <div
                data-preview-page data-dark={config.darkMode} style={{ zoom: viewportScale }}
                className={`mx-auto max-w-[920px] rounded-xl p-4 sm:p-6 space-y-5 transition-all ${
                  config.darkMode
                    ? 'bg-slate-950/60 border border-slate-900'
                    : 'bg-slate-50/90 border border-slate-200/80 shadow-inner'
                }`}
              >
                {/* 1. 顶部粘性导航栏 (Navbar) */}
                <XRayWrapper xrayMode={xrayMode} activeAnatomyId={activeAnatomyId} setActiveAnatomyId={setActiveAnatomyId} termId="navbar">
                  <nav
                    style={getMotionStyle(0)}
                    className={`px-5 py-3 ${radiusClass} ${getCardStyle()} flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-2.5 font-bold text-base">
                      <div className={`w-7 h-7 ${btnRadiusClass} ${theme.primaryBg} flex items-center justify-center text-white text-xs shadow-sm`}>
                        A
                      </div>
                      <span>AcmeUI</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-6 text-xs opacity-80 font-medium">
                      <span className="hover:opacity-100 cursor-pointer">Features</span>
                      <span className="hover:opacity-100 cursor-pointer">Components</span>
                      <span className="hover:opacity-100 cursor-pointer">Pricing</span>
                      <span className="hover:opacity-100 cursor-pointer">Docs</span>
                    </div>
                    <button
                      className={`px-4 py-1.5 text-xs font-semibold text-white ${btnRadiusClass} ${theme.primaryBg} ${getHoverClass()}`}
                    >
                      Get Started
                    </button>
                  </nav>
                </XRayWrapper>

                {/* 根据不同布局切换主体排布 */}
                <div className={config.layout === 'dashboard' ? 'grid grid-cols-12 gap-5' : 'space-y-6'}>
                  {/* 如果是侧边栏控制台布局，渲染左侧边栏 */}
                  {config.layout === 'dashboard' && (
                    <div
                      style={getMotionStyle(1)}
                      className={`col-span-4 sm:col-span-3 p-3.5 ${radiusClass} ${getCardStyle()} space-y-2 h-fit`}
                    >
                      <div className="text-[10px] font-mono uppercase opacity-50 px-2">Sidebar Nav</div>
                      {['Overview', 'Analytics', 'Prompt Lab', 'Settings'].map((nav, idx) => (
                        <div
                          key={nav}
                          className={`px-3 py-2 text-xs font-medium ${btnRadiusClass} flex items-center gap-2 cursor-pointer ${
                            idx === 0 ? `${theme.primaryBg} text-white` : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{nav}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={config.layout === 'dashboard' ? 'col-span-8 sm:col-span-9 space-y-6' : 'space-y-6'}>
                    {/* 2. 首屏主视觉区 (Hero Section) */}
                    <XRayWrapper xrayMode={xrayMode} activeAnatomyId={activeAnatomyId} setActiveAnatomyId={setActiveAnatomyId} termId="hero">
                      <div
                        style={getMotionStyle(1)}
                        className={`p-6 sm:p-8 ${radiusClass} ${getCardStyle()} ${
                          config.layout === 'split'
                            ? 'grid grid-cols-1 sm:grid-cols-12 gap-6 items-center text-left'
                            : 'text-center space-y-5'
                        }`}
                      >
                        <div className={config.layout === 'split' ? 'sm:col-span-7 space-y-4' : 'space-y-4'}>
                          {/* 胶囊公告徽章 */}
                          <div className="pt-2">
                            <XRayWrapper xrayMode={xrayMode} activeAnatomyId={activeAnatomyId} setActiveAnatomyId={setActiveAnatomyId}
                              termId="announcement"
                              badgeAlign={config.layout === 'split' ? 'left' : 'center'}
                              className="inline-block"
                            >
                              <div
                                className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium border ${theme.lightBg} ${theme.primaryText} border-current/20`}
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>v2.4 视觉组件词典上线</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div>
                            </XRayWrapper>
                          </div>

                          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                            先认清每个<span className={theme.primaryText}> 网页部位 </span>，再让 AI 精准写出来
                          </h3>
                          <p className="text-xs sm:text-sm opacity-75 max-w-xl mx-auto leading-relaxed">
                            告别“帮我做个好看的网页”这种模糊指令。用标准的前端组件术语描述布局、材质与弹簧动画。
                          </p>

                          {/* 行动召唤按钮组 (CTA Group) */}
                          <div className="pt-2">
                            <XRayWrapper xrayMode={xrayMode} activeAnatomyId={activeAnatomyId} setActiveAnatomyId={setActiveAnatomyId}
                              termId="ctaGroup"
                              badgeAlign={config.layout === 'split' ? 'left' : 'center'}
                              className="inline-block w-full"
                            >
                              <div
                                className={`flex flex-wrap items-center gap-3.5 pt-2 ${
                                  config.layout === 'split' ? 'justify-start' : 'justify-center'
                                }`}
                              >
                                <button
                                  className={`px-5 py-2.5 text-xs sm:text-sm font-semibold text-white flex items-center gap-2 shadow-md ${btnRadiusClass} ${theme.primaryBg} ${getHoverClass()}`}
                                >
                                  <span>主按钮 (Primary CTA)</span>
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                  className={`px-5 py-2.5 text-xs sm:text-sm font-semibold border ${btnRadiusClass} ${getHoverClass()} ${
                                    config.darkMode
                                      ? 'border-slate-700 hover:bg-slate-800'
                                      : 'border-slate-300 hover:bg-slate-100'
                                  }`}
                                >
                                  次按钮 (Ghost Button)
                                </button>
                              </div>
                            </XRayWrapper>
                          </div>
                        </div>

                        {/* 分栏模式下右侧展示微缩交互卡 */}
                        {config.layout === 'split' && (
                          <div className={`sm:col-span-5 p-5 ${radiusClass} border bg-gradient-to-br ${theme.gradient} text-white shadow-lg space-y-2.5`}>
                            <div className="text-sm font-bold flex items-center justify-between">
                              <span>Split Hero Preview</span>
                              <Cpu className="w-4 h-4" />
                            </div>
                            <p className="text-xs opacity-90 leading-relaxed">
                              左右分栏首屏（Split Hero）非常适合左侧放价值主张文案，右侧直接放产品截图或动态交互演示。
                            </p>
                          </div>
                        )}
                      </div>
                    </XRayWrapper>

                    {/* 3. 核心指标数据栏 (KPI Stats Bar) */}
                    <XRayWrapper xrayMode={xrayMode} activeAnatomyId={activeAnatomyId} setActiveAnatomyId={setActiveAnatomyId} termId="statsBar">
                      <div
                        style={getMotionStyle(2)}
                        className="grid grid-cols-3 gap-4"
                      >
                        {[
                          { num: '42+', label: '标准网页部位术语' },
                          { num: '4 大', label: '主流组件库风格对比' },
                          { num: '100%', label: '实时物理动效预览' }
                        ].map((stat, idx) => (
                          <div
                            key={idx}
                            className={`p-4 text-center ${radiusClass} ${getCardStyle()} ${getHoverClass()}`}
                          >
                            <div className={`text-xl sm:text-2xl font-extrabold font-mono ${theme.primaryText}`}>
                              {stat.num}
                            </div>
                            <div className="text-xs opacity-70 mt-1">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </XRayWrapper>

                    {/* 4. 便当盒不对称网格 (Bento Grid) */}
                    <XRayWrapper xrayMode={xrayMode} activeAnatomyId={activeAnatomyId} setActiveAnatomyId={setActiveAnatomyId} termId="bentoGrid">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* 跨两列的大卡片：内置分段控制器 Tabs */}
                        <div
                          style={getMotionStyle(3)}
                          className={`sm:col-span-2 p-5 ${radiusClass} ${getCardStyle()} ${getHoverClass()} space-y-4`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                            <div>
                              <div className="text-sm font-bold flex items-center gap-2">
                                <Box className={`w-4 h-4 ${theme.primaryText}`} />
                                <span>便当盒主卡 (Bento Span-2 Card)</span>
                              </div>
                              <p className="text-xs opacity-70 mt-0.5">支持跨列排布与内嵌分段控制器切换</p>
                            </div>

                            {/* 分段控制器 Tabs */}
                            <XRayWrapper xrayMode={xrayMode} activeAnatomyId={activeAnatomyId} setActiveAnatomyId={setActiveAnatomyId} termId="interactiveTabs" badgeAlign="right">
                              <div
                                className={`inline-flex p-1 ${btnRadiusClass} border text-xs ${
                                  config.darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                                }`}
                              >
                                {[
                                  { id: 'components', label: '徽章与按钮' },
                                  { id: 'inputs', label: '表单控件' }
                                ].map((t) => (
                                  <button
                                    key={t.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPreviewTab(t.id);
                                    }}
                                    className={`px-3 py-1 ${btnRadiusClass} font-medium transition-all whitespace-nowrap ${
                                      previewTab === t.id
                                        ? `${theme.primaryBg} text-white shadow-sm`
                                        : 'opacity-70 hover:opacity-100'
                                    }`}
                                  >
                                    {t.label}
                                  </button>
                                ))}
                              </div>
                            </XRayWrapper>
                          </div>

                          {previewTab === 'components' ? (
                            <div className="flex flex-wrap items-center gap-2.5 pt-1">
                              <span className={`px-3 py-1 text-xs font-medium ${btnRadiusClass} ${theme.lightBg} ${theme.primaryText}`}>
                                Tag 标签
                              </span>
                              <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/15 text-emerald-500 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                Status Dot 状态点
                              </span>
                              <span className="px-3 py-1 text-xs font-mono rounded border border-current/20 opacity-75">
                                kbd 快捷键 ⌘K
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 pt-1">
                              <div className="relative flex-1">
                                <Search className="w-4 h-4 absolute left-3 top-2.5 opacity-50" />
                                <input
                                  type="text"
                                  readOnly
                                  value="带图标搜索框 (Input with leading icon)"
                                  className={`w-full pl-9 pr-3 py-2 text-xs border bg-transparent ${btnRadiusClass} ${
                                    config.darkMode ? 'border-slate-700' : 'border-slate-300'
                                  }`}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 单列卡片：微交互演示卡 */}
                        <div
                          style={getMotionStyle(4)}
                          className={`p-5 ${radiusClass} ${getCardStyle()} ${getHoverClass()} flex flex-col justify-between space-y-3`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold">悬停动效测试卡</span>
                            <Zap className={`w-4 h-4 ${theme.primaryText}`} />
                          </div>
                          <p className="text-xs opacity-75 leading-relaxed">
                            把鼠标移到这张卡片上，体验你在左侧选择的 <b>{OPTIONS.hoverEffect.find((h) => h.value === config.hoverEffect)?.label}</b>。
                          </p>
                          <div className="text-[11px] font-mono opacity-60">
                            stiffness: {config.stiffness} | damping: {config.damping}
                          </div>
                        </div>
                      </div>
                    </XRayWrapper>

                    {/* 5. 手风琴折叠面板 (Accordion) */}
                    <XRayWrapper xrayMode={xrayMode} activeAnatomyId={activeAnatomyId} setActiveAnatomyId={setActiveAnatomyId} termId="accordion">
                      <div
                        style={getMotionStyle(5)}
                        className={`${radiusClass} ${getCardStyle()} divide-y ${
                          config.darkMode ? 'divide-slate-800' : 'divide-slate-200'
                        }`}
                      >
                        {[
                          {
                            q: '什么是手风琴折叠面板 (Accordion)？',
                            a: '点击标题行展开或折叠隐藏详情的组件，常用于 FAQ 常见问题列表，能避免页面过于冗长。'
                          },
                          {
                            q: '什么是毛玻璃 (Glassmorphism) 与新粗野主义 (Neo-Brutalism)？',
                            a: '毛玻璃使用半透明底色配合 backdrop-blur 背景模糊；新粗野主义则使用 2px 纯黑粗边框和无模糊的硬偏移阴影。'
                          }
                        ].map((item, idx) => {
                          const isOpen = openFaqIndex === idx;
                          return (
                            <div key={idx} className="p-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenFaqIndex(isOpen ? -1 : idx);
                                }}
                                className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold"
                              >
                                <span>{item.q}</span>
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                />
                              </button>
                              {isOpen && (
                                <p className="text-xs opacity-75 mt-2.5 leading-relaxed">{item.a}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </XRayWrapper>

                    {/* 6. 可选展示：骨架屏与 Toast 轻提示 */}
                    {(config.showSkeleton || config.showToast) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {config.showSkeleton && (
                          <XRayWrapper xrayMode={xrayMode} activeAnatomyId={activeAnatomyId} setActiveAnatomyId={setActiveAnatomyId} termId="skeletonCard">
                            <div className={`p-4 ${radiusClass} ${getCardStyle()} space-y-3 animate-pulse`}>
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-slate-500/30" />
                                <div className="space-y-1.5 flex-1">
                                  <div className="h-2.5 w-1/2 rounded bg-slate-500/30" />
                                  <div className="h-2 w-1/3 rounded bg-slate-500/20" />
                                </div>
                              </div>
                              <div className="h-2.5 w-full rounded bg-slate-500/25" />
                              <div className="text-[10px] font-mono opacity-60 text-right">
                                Skeleton Loader (animate-pulse)
                              </div>
                            </div>
                          </XRayWrapper>
                        )}

                        {config.showToast && (
                          <XRayWrapper xrayMode={xrayMode} activeAnatomyId={activeAnatomyId} setActiveAnatomyId={setActiveAnatomyId} termId="toastPreview">
                            <div
                              className={`p-4 ${radiusClass} ${getCardStyle()} flex items-center justify-between gap-2`}
                            >
                              <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                <div>
                                  <div className="text-xs font-bold">Toast 轻提示通知</div>
                                  <div className="text-[11px] opacity-70">配置已实时同步至右侧提示词面板</div>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500">
                                Saved
                              </span>
                            </div>
                          </XRayWrapper>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 右栏：AI 提示词编译器 (占 3 列，内嵌暗色定制滚动条) ==================== */}
        <aside aria-label="提示词与部位词典" className="lab-inspector lg:col-span-3 h-full min-h-0 flex flex-col overflow-hidden">
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-3.5 flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* 顶部切换栏 */}
            <div className="shrink-0 flex flex-col gap-2 pb-2.5 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-xs font-bold text-white">AI 提示词编译器</h2>
                </div>
                {lastChangedField && (
                  <span className="text-[10px] text-emerald-400 font-mono animate-pulse">
                    ● 已更新 {lastChangedField}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                {[
                  { id: 'mixed', label: '中英结构版' },
                  { id: 'en', label: '纯英专业版' },
                  { id: 'glossary', label: '部位词典表' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setPromptTab(tab.id)}
                    className={`py-1 rounded-lg font-medium transition-all text-center ${
                      promptTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {promptTab !== 'glossary' ? (
              <>
                {/* 实时提取的术语胶囊概览 */}
                <div className="shrink-0 py-2.5 border-b border-slate-800/80 space-y-1.5">
                  <div className="text-[10px] text-slate-400">已注入的专业术语 Token：</div>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono">
                      {OPTIONS.layout.find((o) => o.value === config.layout)?.en}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-pink-500/15 text-pink-300 border border-pink-500/30 text-[10px] font-mono">
                      {OPTIONS.designSystem.find((o) => o.value === config.designSystem)?.label}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
                      {OPTIONS.visualStyle.find((o) => o.value === config.visualStyle)?.en}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
                      stiffness:{config.stiffness} / damping:{config.damping}
                    </span>
                  </div>
                </div>

                {/* 生成的 Markdown 提示词内容 (独立暗黑定制滚动条) */}
                <div className="flex-1 min-h-0 overflow-y-auto lab-scroll-dark my-2.5 bg-slate-950 rounded-xl p-3 border border-slate-800/90 font-mono text-[11px] text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
                  {generatedPrompt}
                </div>

                {copyError && <div className="lab-copy-error" role="alert"><p>复制未完成，请手动复制下方已选中的文本。</p><textarea ref={manualCopy} aria-label="手动复制提示词" readOnly value={generatedPrompt} /></div>}

                {/* 底部操作按钮：复制完整提示词 */}
                <div className="shrink-0 pt-1">
                  <button
                    onClick={handleCopyPrompt}
                    className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>已复制到剪贴板！</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>一键复制整页 AI 提示词</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* 部位词典全表模式 (独立暗黑定制滚动条) */
              <div className="flex-1 min-h-0 overflow-y-auto lab-scroll-dark my-2.5 space-y-2 pr-1">
                {Object.values(ANATOMY_TERMS).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setXrayMode(true);
                      setActiveAnatomyId(item.id);
                    }}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      activeAnatomyId === item.id
                        ? 'bg-cyan-500/15 border-cyan-400/60'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white">{item.cn}</span>
                      <code className="text-[10px] font-mono text-cyan-300 truncate">{item.en}</code>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.desc}</p>
                    <div className="mt-1.5 text-[10px] font-mono text-emerald-400 bg-slate-900 px-2 py-1 rounded truncate">
                      {item.tailwind}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
