"use client";

import { useState } from "react";
import {
  DEFAULT_HERO_DISTORTION_CONFIG,
  HERO_DISTORTION_PARAM_META,
  type HeroDistortionConfig,
  saveHeroDistortionConfig,
} from "./hero-distortion-config";

interface HeroDistortionTunerProps {
  config: HeroDistortionConfig;
  onChange: (config: HeroDistortionConfig) => void;
}

export default function HeroDistortionTuner({
  config,
  onChange,
}: HeroDistortionTunerProps) {
  const [isOpen, setIsOpen] = useState(true);

  function updateParam<K extends keyof HeroDistortionConfig>(
    key: K,
    value: HeroDistortionConfig[K]
  ) {
    const next = { ...config, [key]: value };
    onChange(next);
    saveHeroDistortionConfig(next);
  }

  function resetConfig() {
    onChange(DEFAULT_HERO_DISTORTION_CONFIG);
    saveHeroDistortionConfig(DEFAULT_HERO_DISTORTION_CONFIG);
  }

  function copyConfig() {
    void navigator.clipboard.writeText(JSON.stringify(config, null, 2));
  }

  return (
    <div className="pointer-events-auto fixed right-4 top-4 z-[80] w-[min(92vw,22rem)] rounded-xl border border-stone-700/80 bg-stone-950/92 p-3 text-stone-100 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.18em] text-stone-400 uppercase">
            Dev Only
          </p>
          <p className="text-sm font-medium">封面涟漪调试器</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="rounded-md border border-stone-600 px-2 py-1 text-xs text-stone-300 hover:bg-stone-800"
        >
          {isOpen ? "收起" : "展开"}
        </button>
      </div>

      {isOpen ? (
        <div className="mt-3 max-h-[70vh] space-y-3 overflow-y-auto pr-1">
          {HERO_DISTORTION_PARAM_META.map((param) => (
            <label key={param.key} className="block text-xs text-stone-300">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span>{param.label}</span>
                <span className="font-mono text-[11px] text-stone-400">
                  {config[param.key].toFixed(4)}
                </span>
              </div>
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={config[param.key]}
                onChange={(event) =>
                  updateParam(param.key, Number(event.target.value))
                }
                className="w-full accent-stone-200"
              />
            </label>
          ))}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={resetConfig}
              className="flex-1 rounded-md border border-stone-600 px-3 py-2 text-xs hover:bg-stone-800"
            >
              重置默认
            </button>
            <button
              type="button"
              onClick={copyConfig}
              className="flex-1 rounded-md border border-stone-600 px-3 py-2 text-xs hover:bg-stone-800"
            >
              复制 JSON
            </button>
          </div>

          <p className="text-[11px] leading-5 text-stone-500">
            滑动：Kelvin V 形尾迹；点击：同心圆落水。仅开发环境显示。
          </p>
        </div>
      ) : null}
    </div>
  );
}
