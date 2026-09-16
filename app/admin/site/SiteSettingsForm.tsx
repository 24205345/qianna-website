"use client";

import {
  useCallback,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type DragEvent,
  type ClipboardEvent,
} from "react";
import Link from "next/link";
import type { SiteSettings } from "@/app/_data/site-settings";
import type { SiteNavigationItem } from "@/app/_data/site-navigation";
import type { FeaturedProject } from "@/lib/projects/queries";
import type { FeaturedTraceItem } from "@/lib/traces/queries";
import type { NoteListItem } from "@/app/_data/notes";
import type { AboutPageContent } from "@/app/_data/about-page";
import FeaturedProjectsSection from "@/app/_components/home/FeaturedProjectsSection";
import VisualFootprintsSection from "@/app/_components/home/VisualFootprintsSection";
import EditorialNotesSection from "@/app/_components/home/EditorialNotesSection";
import {
  Monitor,
  Smartphone,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Layers,
  FileText,
  SlidersHorizontal,
  FolderKanban,
  Camera,
  PenLine,
  User,
  ArrowUpRight,
} from "lucide-react";

interface SiteSettingsFormProps {
  action: (formData: FormData) => Promise<void>;
  defaults: SiteSettings;
  navigationItems: SiteNavigationItem[];
  featuredProjects?: FeaturedProject[];
  featuredTraces?: FeaturedTraceItem[];
  latestNotes?: NoteListItem[];
  aboutContent?: AboutPageContent;
}

const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-stone-500 focus:ring-1 focus:ring-stone-500 shadow-2xs";
const labelClass = "block text-xs font-semibold tracking-wider text-stone-600 uppercase";
const helpClass = "mt-1.5 text-xs text-stone-400 leading-normal";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type SectionViewKey =
  | "projects"
  | "traces"
  | "notes"
  | "about";

export default function SiteSettingsForm({
  action,
  defaults,
  navigationItems,
  featuredProjects = [],
  featuredTraces = [],
  latestNotes = [],
  aboutContent,
}: SiteSettingsFormProps) {
  const [activeTab, setActiveTab] = useState<"cover" | "navigation">("cover");
  const [activeSection, setActiveSection] = useState<SectionViewKey>("projects");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Reactive state for Live Hero Preview
  const [heroTitle, setHeroTitle] = useState(defaults.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(defaults.heroSubtitle);
  const [heroCtaLabel, setHeroCtaLabel] = useState(defaults.heroCtaLabel);
  const [heroImageAlt, setHeroImageAlt] = useState(defaults.heroImageAlt);
  const [heroImageUrl, setHeroImageUrl] = useState(defaults.heroImageUrl);

  // File upload state & object URL for instant preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(defaults.heroImageUrl);
  const [isDragging, setIsDragging] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Reactive state for Navigation Items
  const [navItems, setNavItems] = useState<SiteNavigationItem[]>(navigationItems);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateNavItem = (
    itemKey: string,
    field: "label" | "title" | "description",
    value: string
  ) => {
    setNavItems((prev) =>
      prev.map((item) =>
        item.itemKey === itemKey ? { ...item, [field]: value } : item
      )
    );
  };

  const applyFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      window.alert("请选择有效的图片文件 (PNG, JPG, WebP)");
      return;
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Sync to hidden file input for standard Server Action submission
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
    }
  }, []);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyFile(file);
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) {
          applyFile(file);
          break;
        }
      }
    }
  };

  const handleRevertImage = () => {
    setSelectedFile(null);
    setPreviewUrl(defaults.heroImageUrl);
    setHeroImageUrl(defaults.heroImageUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isImageChanged =
    selectedFile !== null || previewUrl !== defaults.heroImageUrl;

  // Filtered reactive sections for real-time live preview
  const projectsNav =
    navItems.find((it) => it.itemKey === "projects-preview") ??
    navItems[0];
  const projectCategories = navItems.filter(
    (it) => it.group === "project_category"
  );

  const tracesNav =
    navItems.find((it) => it.itemKey === "traces-preview") ??
    navItems[0];
  const traceCategories = navItems.filter(
    (it) => it.group === "traces_category"
  );

  const notesNav =
    navItems.find((it) => it.itemKey === "notes-preview") ??
    navItems[0];

  const aboutNav =
    navItems.find((it) => it.itemKey === "about") ??
    navItems[0];

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await action(formData);
        });
      }}
      className="flex flex-col gap-6"
    >
      {/* Top Tab Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("cover")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "cover"
                ? "bg-stone-900 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-200/60 hover:text-stone-900"
            }`}
          >
            <Sparkles size={16} />
            <span>首页封面与视觉 (Hero Cover)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("navigation")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "navigation"
                ? "bg-stone-900 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-200/60 hover:text-stone-900"
            }`}
          >
            <Layers size={16} />
            <span>各板块导航与实景视口 (Sections & Live Preview)</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-mono ${
                activeTab === "navigation"
                  ? "bg-stone-700 text-stone-200"
                  : "bg-stone-200 text-stone-600"
              }`}
            >
              4 个板块
            </span>
          </button>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-stone-800 disabled:opacity-50"
        >
          {isPending ? "保存中…" : "保存设置 (Save)"}
        </button>
      </div>

      {/* TAB 1: 首页封面与视觉 (Hero Cover) */}
      <div className={activeTab === "cover" ? "block" : "hidden"}>
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Form Controls (5 columns on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Copywriting Card */}
            <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <FileText size={16} className="text-stone-500" />
                <h3 className="font-serif text-base text-stone-900">
                  封面文字排版
                </h3>
              </div>

              <div>
                <label className={labelClass} htmlFor="hero_title">
                  Hero Title (大标题) *
                </label>
                <input
                  id="hero_title"
                  name="hero_title"
                  required
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className={`${inputClass} font-serif mt-1.5`}
                  placeholder="例如：Qianna Wang"
                />
                <p className={helpClass}>
                  显示在首页封面左下方的衬线大标题，全站核心定位。
                </p>
              </div>

              <div>
                <label className={labelClass} htmlFor="hero_subtitle">
                  Hero Subtitle (副标题 / 定位陈述) *
                </label>
                <textarea
                  id="hero_subtitle"
                  name="hero_subtitle"
                  required
                  rows={3}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className={`${inputClass} mt-1.5 leading-relaxed`}
                  placeholder="一两句话描述您的专业领域与设计研究方向"
                />
                <p className={helpClass}>
                  承接大标题的叙述副标题，支持换行排版。
                </p>
              </div>

              <div>
                <label className={labelClass} htmlFor="hero_cta_label">
                  CTA Label (引导按钮文本) *
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="hero_cta_label"
                    name="hero_cta_label"
                    required
                    value={heroCtaLabel}
                    onChange={(e) => setHeroCtaLabel(e.target.value)}
                    className={`${inputClass} pr-8`}
                    placeholder="Enter"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                    →
                  </span>
                </div>
                <p className={helpClass}>
                  前台会自动在文字后附带动态悬停右箭头（无需手动输入箭头）。
                </p>
              </div>
            </div>

            {/* Media Upload Card */}
            <div
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs flex flex-col gap-4"
              onPaste={handlePaste}
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon size={16} className="text-stone-500" />
                  <h3 className="font-serif text-base text-stone-900">
                    封面视觉媒体
                  </h3>
                </div>
                {isImageChanged ? (
                  <button
                    type="button"
                    onClick={handleRevertImage}
                    className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800"
                  >
                    <RotateCcw size={13} />
                    <span>恢复原图</span>
                  </button>
                ) : null}
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                id="hero_image"
                name="hero_image"
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {/* Modern Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                  isDragging
                    ? "border-stone-900 bg-stone-100/80 scale-[1.01]"
                    : "border-stone-200 bg-stone-50/50 hover:border-stone-400 hover:bg-stone-50"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xs border border-stone-200/80 group-hover:scale-105 transition-transform">
                  <Upload size={20} className="text-stone-600" />
                </div>
                <p className="mt-3 text-xs font-medium text-stone-800">
                  点击选择新图片，或直接将图片拖拽至此
                </p>
                <p className="mt-1 text-[11px] text-stone-400">
                  支持从剪贴板直接粘贴 (Ctrl+V) · 建议 16:9 比例高分辨率图
                </p>
              </div>

              {/* Selected File Status Badge */}
              {selectedFile ? (
                <div className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs">
                  <div className="flex items-center gap-2 truncate text-stone-700">
                    <span className="rounded bg-stone-900 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      新图片待保存
                    </span>
                    <span className="truncate font-mono">{selectedFile.name}</span>
                    <span className="text-stone-400 font-mono">
                      ({formatFileSize(selectedFile.size)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRevertImage();
                    }}
                    className="shrink-0 text-stone-400 hover:text-stone-700 ml-2"
                  >
                    ✕ 取消
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-stone-400 leading-normal">
                  💡 保存时后台将自动采用高质量 WebP 格式压缩并更新至 Supabase 存储桶。
                </p>
              )}

              {/* Collapsible Advanced Options (Image URL & Alt) */}
              <div className="border-t border-stone-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdvanced((prev) => !prev)}
                  className="flex w-full items-center justify-between text-xs text-stone-500 hover:text-stone-800"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <SlidersHorizontal size={13} />
                    <span>高级选项 (图片 URL 与无障碍 Alt)</span>
                  </span>
                  <span>{showAdvanced ? "收起 ▲" : "展开 ▼"}</span>
                </button>

                {showAdvanced ? (
                  <div className="mt-3.5 space-y-3.5 rounded-lg bg-stone-50/60 p-3.5 border border-stone-200/60">
                    <div>
                      <label className={labelClass} htmlFor="hero_image_alt">
                        Image Alt Text (图片无障碍描述) *
                      </label>
                      <input
                        id="hero_image_alt"
                        name="hero_image_alt"
                        required
                        value={heroImageAlt}
                        onChange={(e) => setHeroImageAlt(e.target.value)}
                        className={`${inputClass} mt-1`}
                        placeholder="Qianna Wang cover image"
                      />
                    </div>

                    <div>
                      <label className={labelClass} htmlFor="hero_image_url">
                        Hero Image URL (存储链接) *
                      </label>
                      <input
                        id="hero_image_url"
                        name="hero_image_url"
                        required
                        value={heroImageUrl}
                        onChange={(e) => {
                          setHeroImageUrl(e.target.value);
                          setPreviewUrl(e.target.value);
                        }}
                        className={`${inputClass} font-mono text-xs mt-1`}
                      />
                      <p className={helpClass}>
                        当前指向的公开 Storage 链接。上传新文件会自动替换。
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <input
                      type="hidden"
                      name="hero_image_alt"
                      value={heroImageAlt}
                    />
                    <input
                      type="hidden"
                      name="hero_image_url"
                      value={heroImageUrl}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: 1:1 Live Simulation Viewport (7 columns on desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-3 sticky top-4">
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-2.5 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-stone-700">
                  1:1 封面实景实时渲染 (Live Simulation)
                </span>
              </div>

              {/* Viewport Toggle */}
              <div
                className="inline-flex rounded-lg border border-stone-200 bg-stone-100 p-0.5 text-xs shadow-2xs"
                role="group"
                aria-label="Viewport simulation"
              >
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 transition-all ${
                    previewMode === "desktop"
                      ? "bg-white font-medium text-stone-900 shadow-xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <Monitor size={14} />
                  <span>桌面视口 (16:9)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 transition-all ${
                    previewMode === "mobile"
                      ? "bg-white font-medium text-stone-900 shadow-xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <Smartphone size={14} />
                  <span>移动端 (9:16)</span>
                </button>
              </div>
            </div>

            {/* Simulated Hero Frame */}
            <div className="overflow-hidden rounded-xl border border-stone-300 bg-stone-950 p-3 shadow-md flex items-center justify-center min-h-[460px]">
              {previewMode === "desktop" ? (
                /* Desktop 16:9 Viewport */
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-stone-800 shadow-inner bg-stone-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl || "/images/hero-image.jpg"}
                    alt={heroImageAlt || "Hero preview"}
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
                  />
                  {/* Exact Front-end Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/10" />

                  {/* Simulated Content Layer */}
                  <div className="absolute inset-0 flex items-end p-6 md:p-10">
                    <div className="w-full">
                      <h1 className="font-serif text-3xl md:text-5xl text-stone-50 drop-shadow-sm leading-tight">
                        {heroTitle || "Title"}
                      </h1>
                      <p className="mt-3 max-w-xl text-xs md:text-base leading-relaxed text-stone-100 drop-shadow-sm line-clamp-3">
                        {heroSubtitle || "Subtitle"}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1.5 text-xs md:text-sm text-stone-50 font-medium">
                        <span>{heroCtaLabel || "Enter"}</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute right-3 top-3 rounded bg-black/40 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-stone-300 backdrop-blur-xs">
                    Desktop View
                  </div>
                </div>
              ) : (
                /* Mobile 9:16 Frame */
                <div className="relative aspect-[9/16] w-[260px] overflow-hidden rounded-2xl border-4 border-stone-800 shadow-2xl bg-stone-900">
                  <div className="absolute left-1/2 top-2 z-20 h-3 w-16 -translate-x-1/2 rounded-full bg-stone-800" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl || "/images/hero-image.jpg"}
                    alt={heroImageAlt || "Hero preview"}
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/15" />

                  <div className="absolute inset-0 flex items-end p-5 pb-8">
                    <div className="w-full">
                      <h1 className="font-serif text-2xl text-stone-50 drop-shadow-sm leading-snug">
                        {heroTitle || "Title"}
                      </h1>
                      <p className="mt-2 text-[11px] leading-relaxed text-stone-100 drop-shadow-sm line-clamp-3">
                        {heroSubtitle || "Subtitle"}
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-stone-50 font-medium">
                        <span>{heroCtaLabel || "Enter"}</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-1.5 left-1/2 z-20 h-1 w-20 -translate-x-1/2 rounded-full bg-stone-50/50" />
                </div>
              )}
            </div>

            <p className="text-center text-xs text-stone-400">
              💡 预览实时同步左侧打字变动；保存后前台首页即刻生效。
            </p>
          </div>
        </div>
      </div>

      {/* TAB 2: 各板块导航与实景视口 (Sections & Live Preview) */}
      <div className={activeTab === "navigation" ? "block" : "hidden"}>
        {/* Hidden inputs to guarantee every navigation item is submitted */}
        <input
          type="hidden"
          name="navigation_count"
          value={navItems.length}
        />
        {navItems.map((item, index) => (
          <div key={item.itemKey} className="hidden">
            <input
              type="hidden"
              name={`navigation_${index}_item_key`}
              value={item.itemKey}
            />
            <input
              type="hidden"
              name={`navigation_${index}_group`}
              value={item.group}
            />
            <input
              type="hidden"
              name={`navigation_${index}_label`}
              value={item.label}
            />
            <input
              type="hidden"
              name={`navigation_${index}_title`}
              value={item.title}
            />
            <input
              type="hidden"
              name={`navigation_${index}_description`}
              value={item.description}
            />
            <input
              type="hidden"
              name={`navigation_${index}_href`}
              value={item.href}
            />
            <input
              type="hidden"
              name={`navigation_${index}_sort_order`}
              value={item.sortOrder}
            />
          </div>
        ))}

        {/* Section Picker Pill Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-2.5 shadow-xs mb-6">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveSection("projects")}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                activeSection === "projects"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              <FolderKanban size={14} />
              <span>Selected Works (精选项目板块)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("traces")}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                activeSection === "traces"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              <Camera size={14} />
              <span>Visual Footprints (视觉足迹板块)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("notes")}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                activeSection === "notes"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              <PenLine size={14} />
              <span>Essays & Notes (随笔随记板块)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("about")}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                activeSection === "about"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              <User size={14} />
              <span>About Me (关于我)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-400 pr-2">
            <span>实时图文渲染中</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* 1. Projects Section Studio */}
        {activeSection === "projects" && (
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Form Controls & Photos Panel */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Copywriting Card */}
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <FolderKanban size={16} className="text-stone-500" />
                    <h3 className="font-serif text-base text-stone-900">
                      精选项目板块文案
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">
                    /projects
                  </span>
                </div>

                <div>
                  <label className={labelClass}>
                    Section Title (板块大标题) *
                  </label>
                  <input
                    value={projectsNav.title}
                    onChange={(e) =>
                      updateNavItem(projectsNav.itemKey, "title", e.target.value)
                    }
                    className={`${inputClass} font-serif mt-1.5`}
                    placeholder="Selected Works"
                  />
                  <p className={helpClass}>前台展示在 Curated Index · 01 下方。</p>
                </div>

                <div>
                  <label className={labelClass}>
                    CTA Link Text (右侧跳转文案) *
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      value={projectsNav.label}
                      onChange={(e) =>
                        updateNavItem(
                          projectsNav.itemKey,
                          "label",
                          e.target.value
                        )
                      }
                      className={`${inputClass} pr-8`}
                      placeholder="View all projects"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                      →
                    </span>
                  </div>
                </div>

                {/* Sub-rail Category Filter Tabs */}
                <div className="border-t border-stone-100 pt-3">
                  <label className={labelClass}>
                    分类导航轨标签 (Category Tabs on Sub-rail)
                  </label>
                  <p className={helpClass}>
                    排列在标题右侧/下方的子集筛选导航，点击跳转对应分类。
                  </p>
                  <div className="mt-2.5 space-y-2.5">
                    {projectCategories.map((cat) => (
                      <div
                        key={cat.itemKey}
                        className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50/70 px-3 py-2"
                      >
                        <span className="text-[11px] font-mono text-stone-400 shrink-0">
                          {cat.itemKey.slice(0, 14)}…
                        </span>
                        <input
                          value={cat.title}
                          onChange={(e) =>
                            updateNavItem(cat.itemKey, "title", e.target.value)
                          }
                          className="flex-1 rounded border border-stone-200 bg-white px-2 py-1 text-xs text-stone-800 outline-none focus:border-stone-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Photos Panel */}
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={16} className="text-stone-500" />
                    <h3 className="font-serif text-base text-stone-900">
                      当前前台展示照片 ({featuredProjects.length} 张精选)
                    </h3>
                  </div>
                  <Link
                    href="/admin/projects"
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-900"
                  >
                    <span>管理项目库</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {featuredProjects.map((proj, idx) => (
                    <div
                      key={proj.slug}
                      className="group relative overflow-hidden rounded-lg border border-stone-200 bg-stone-100"
                    >
                      <div className="relative aspect-[16/10] w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={proj.coverImageUrl}
                          alt={proj.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-2 left-2 rounded bg-stone-900/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                          {idx === 0 ? "LEAD 主展图" : "COMPANION 伴随图"}
                        </div>
                      </div>
                      <div className="p-2.5 bg-white">
                        <p className="truncate text-xs font-medium text-stone-800">
                          {proj.title}
                        </p>
                        <p className="truncate text-[11px] text-stone-400 font-mono">
                          {proj.year} · {proj.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-stone-400 leading-normal">
                  💡 项目照片由项目库中的精选状态决定。如需更换封面照片，点击上方「管理项目库」即可编辑对应项目。
                </p>
              </div>
            </div>

            {/* Right Column: 1:1 Live Simulation Viewport */}
            <div className="lg:col-span-7 flex flex-col gap-3 sticky top-4">
              <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-2.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-stone-700">
                    Selected Works 实景 1:1 动态仿真渲染
                  </span>
                </div>

                <div
                  className="inline-flex rounded-lg border border-stone-200 bg-stone-100 p-0.5 text-xs shadow-2xs"
                  role="group"
                >
                  <button
                    type="button"
                    onClick={() => setPreviewMode("desktop")}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 transition-all ${
                      previewMode === "desktop"
                        ? "bg-white font-medium text-stone-900 shadow-xs"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <Monitor size={14} />
                    <span>桌面</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 transition-all ${
                      previewMode === "mobile"
                        ? "bg-white font-medium text-stone-900 shadow-xs"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <Smartphone size={14} />
                    <span>移动端</span>
                  </button>
                </div>
              </div>

              {/* Simulation Sandbox with Links disabled to prevent accidental navigation */}
              <div
                className={`overflow-hidden rounded-xl border border-stone-200 bg-stone-50 p-6 md:p-8 shadow-sm ${
                  previewMode === "mobile"
                    ? "max-w-[390px] mx-auto border-4 border-stone-800 rounded-3xl"
                    : "w-full"
                }`}
                onClickCapture={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest("a")) e.preventDefault();
                }}
              >
                <FeaturedProjectsSection
                  projects={featuredProjects}
                  navigationSection={projectsNav}
                  categories={projectCategories}
                />
              </div>

              <p className="text-center text-xs text-stone-400">
                💡 右侧实景视口包含真实作品照片；修改左侧标题即刻看到前台版面响应。
              </p>
            </div>
          </div>
        )}

        {/* 2. Traces Section Studio */}
        {activeSection === "traces" && (
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Form Controls & Photos Panel */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Copywriting Card */}
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Camera size={16} className="text-stone-500" />
                    <h3 className="font-serif text-base text-stone-900">
                      视觉专栏板块文案
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">
                    /traces
                  </span>
                </div>

                <div>
                  <label className={labelClass}>
                    Section Title (板块大标题) *
                  </label>
                  <input
                    value={tracesNav.title}
                    onChange={(e) =>
                      updateNavItem(tracesNav.itemKey, "title", e.target.value)
                    }
                    className={`${inputClass} font-serif mt-1.5`}
                    placeholder="Traces & Visual Observations"
                  />
                  <p className={helpClass}>
                    前台展示在 Observation Archive · 02 下方。
                  </p>
                </div>

                <div>
                  <label className={labelClass}>
                    CTA Link Text (右侧跳转文案) *
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      value={tracesNav.label}
                      onChange={(e) =>
                        updateNavItem(tracesNav.itemKey, "label", e.target.value)
                      }
                      className={`${inputClass} pr-8`}
                      placeholder="View all traces"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                      →
                    </span>
                  </div>
                </div>

                {/* Sub-rail Category Filter Tabs */}
                <div className="border-t border-stone-100 pt-3">
                  <label className={labelClass}>
                    分类导航轨标签 (Category Tabs)
                  </label>
                  <p className={helpClass}>
                    摄影、手绘与田野笔记三个子维度的分类文案。
                  </p>
                  <div className="mt-2.5 space-y-2.5">
                    {traceCategories.map((cat) => (
                      <div
                        key={cat.itemKey}
                        className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50/70 px-3 py-2"
                      >
                        <span className="text-[11px] font-mono text-stone-400 shrink-0">
                          {cat.itemKey}
                        </span>
                        <input
                          value={cat.title}
                          onChange={(e) =>
                            updateNavItem(cat.itemKey, "title", e.target.value)
                          }
                          className="flex-1 rounded border border-stone-200 bg-white px-2 py-1 text-xs text-stone-800 outline-none focus:border-stone-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Photos Panel */}
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={16} className="text-stone-500" />
                    <h3 className="font-serif text-base text-stone-900">
                      当前前台展示照片 ({featuredTraces.length} 张焦点图)
                    </h3>
                  </div>
                  <Link
                    href="/admin/traces"
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-900"
                  >
                    <span>管理视觉库</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {featuredTraces.slice(0, 6).map((trace, idx) => (
                    <div
                      key={trace.id}
                      className="group relative overflow-hidden rounded-md border border-stone-200 bg-stone-100"
                    >
                      <div className="relative aspect-square w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={trace.imageUrl}
                          alt={trace.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-1 left-1 rounded bg-black/60 px-1 py-0.2 text-[9px] text-white">
                          #{idx + 1}
                        </div>
                      </div>
                      <div className="p-1.5 bg-white">
                        <p className="truncate text-[11px] font-medium text-stone-800">
                          {trace.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-stone-400 leading-normal">
                  💡 包含前台前排 2 张大焦点画框与后排 3 联拼胶卷图。如需增删，请点击「管理视觉库」。
                </p>
              </div>
            </div>

            {/* Right Column: 1:1 Live Simulation Viewport */}
            <div className="lg:col-span-7 flex flex-col gap-3 sticky top-4">
              <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-2.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-stone-700">
                    Visual Footprints 实景 1:1 动态仿真渲染
                  </span>
                </div>

                <div
                  className="inline-flex rounded-lg border border-stone-200 bg-stone-100 p-0.5 text-xs shadow-2xs"
                  role="group"
                >
                  <button
                    type="button"
                    onClick={() => setPreviewMode("desktop")}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 transition-all ${
                      previewMode === "desktop"
                        ? "bg-white font-medium text-stone-900 shadow-xs"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <Monitor size={14} />
                    <span>桌面</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 transition-all ${
                      previewMode === "mobile"
                        ? "bg-white font-medium text-stone-900 shadow-xs"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <Smartphone size={14} />
                    <span>移动端</span>
                  </button>
                </div>
              </div>

              {/* Simulation Sandbox */}
              <div
                className={`overflow-hidden rounded-xl border border-stone-200 bg-stone-50 p-6 md:p-8 shadow-sm ${
                  previewMode === "mobile"
                    ? "max-w-[390px] mx-auto border-4 border-stone-800 rounded-3xl"
                    : "w-full"
                }`}
                onClickCapture={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest("a")) e.preventDefault();
                }}
              >
                <VisualFootprintsSection
                  traces={featuredTraces}
                  navigationSection={tracesNav}
                  categories={traceCategories}
                />
              </div>

              <p className="text-center text-xs text-stone-400">
                💡 完整渲染真实摄影与手绘作品；支持横竖屏自适应排版检验。
              </p>
            </div>
          </div>
        )}

        {/* 3. Notes Section Studio */}
        {activeSection === "notes" && (
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <PenLine size={16} className="text-stone-500" />
                    <h3 className="font-serif text-base text-stone-900">
                      随笔随记板块文案
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">
                    /notes
                  </span>
                </div>

                <div>
                  <label className={labelClass}>
                    Section Title (板块大标题) *
                  </label>
                  <input
                    value={notesNav.title}
                    onChange={(e) =>
                      updateNavItem(notesNav.itemKey, "title", e.target.value)
                    }
                    className={`${inputClass} font-serif mt-1.5`}
                    placeholder="Notes"
                  />
                  <p className={helpClass}>
                    前台展示在 Essays & Field Discourse · 03 下方。
                  </p>
                </div>

                <div>
                  <label className={labelClass}>
                    CTA Link Text (右侧跳转文案) *
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      value={notesNav.label}
                      onChange={(e) =>
                        updateNavItem(notesNav.itemKey, "label", e.target.value)
                      }
                      className={`${inputClass} pr-8`}
                      placeholder="View all notes"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                      →
                    </span>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Description (板块描述)</label>
                  <textarea
                    rows={3}
                    value={notesNav.description}
                    onChange={(e) =>
                      updateNavItem(
                        notesNav.itemKey,
                        "description",
                        e.target.value
                      )
                    }
                    className={`${inputClass} mt-1.5 leading-relaxed`}
                  />
                </div>
              </div>

              {/* Active Notes Panel */}
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-serif text-base text-stone-900">
                    前台最新 3 篇随记
                  </h3>
                  <Link
                    href="/admin/notes"
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-900"
                  >
                    <span>发布/管理随笔</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>

                <ul className="divide-y divide-stone-100">
                  {latestNotes.map((note) => (
                    <li key={note.slug} className="py-2.5">
                      <p className="text-xs font-medium text-stone-800 truncate">
                        {note.title}
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5 truncate">
                        {note.excerpt}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-3 sticky top-4">
              <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-2.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-stone-700">
                    Editorial Notes 实景 1:1 动态仿真渲染
                  </span>
                </div>
              </div>

              <div
                className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50 p-6 md:p-8 shadow-sm"
                onClickCapture={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest("a")) e.preventDefault();
                }}
              >
                <EditorialNotesSection
                  notes={latestNotes}
                  navigationSection={notesNav}
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. About Me Studio */}
        {activeSection === "about" && (
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-stone-500" />
                    <h3 className="font-serif text-base text-stone-900">
                      关于我板块文案
                    </h3>
                  </div>
                  <Link
                    href="/admin/about"
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-900"
                  >
                    <span>编辑履历全文</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>

                <div>
                  <label className={labelClass}>Title (标题)</label>
                  <input
                    value={aboutNav.title}
                    onChange={(e) =>
                      updateNavItem(aboutNav.itemKey, "title", e.target.value)
                    }
                    className={`${inputClass} font-serif mt-1.5`}
                  />
                </div>

                <div>
                  <label className={labelClass}>Description (引导摘要)</label>
                  <textarea
                    rows={4}
                    value={aboutNav.description}
                    onChange={(e) =>
                      updateNavItem(
                        aboutNav.itemKey,
                        "description",
                        e.target.value
                      )
                    }
                    className={`${inputClass} mt-1.5 leading-relaxed`}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-3 sticky top-4">
              <div className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 shadow-xs">
                <span className="text-xs font-medium text-stone-700">
                  About Me 实景 1:1 动态仿真渲染
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50 p-6 md:p-8 shadow-sm">
                <h2 className="font-serif text-3xl text-stone-900 md:text-4xl">
                  About Me
                </h2>
                <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-start">
                  <div className="md:col-span-7">
                    <h3 className="font-serif text-xl text-stone-900 md:text-2xl">
                      {aboutContent?.pageTitle || aboutNav.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {aboutNav.description || aboutContent?.pageDescription}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-5 md:border-l md:border-stone-200/80 md:pl-8">
                    <span className="text-xs tracking-[0.22em] text-stone-500 uppercase">
                      Working Across
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(aboutContent?.workingAcross ?? [
                        "Spatial systems",
                        "Enterprise workflows",
                        "Urban data",
                      ]).map((item: string) => (
                        <span
                          key={item}
                          className="rounded-md bg-stone-100 px-2.5 py-1 text-xs text-stone-600"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
