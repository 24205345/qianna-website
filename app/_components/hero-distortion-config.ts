/** Set to true to re-enable WebGL ripple on the homepage hero (dev tuning still available). */
export const HERO_DISTORTION_ENABLED = false;

export interface HeroDistortionConfig {
  waveNumber: number;
  omega: number;
  rippleLife: number;
  falloffScale: number;
  decayRate: number;
  frontSpeed: number;
  frontWidth: number;
  refraction: number;
  ambientStrength: number;
  dropMinDistance: number;
  dropStrength: number;
  speedDropBoost: number;
  velocityGain: number;
  velocityDecay: number;
  mouseSmoothing: number;
  wakeAngle: number;
  wakeSpeedBoost: number;
}

export const MAX_RIPPLE_DROPS = 24;

export type RippleKind = "pebble" | "wake";

export interface RippleDrop {
  x: number;
  y: number;
  birthTime: number;
  strength: number;
  kind: RippleKind;
  dirX: number;
  dirY: number;
  speed: number;
}

export const DEFAULT_HERO_DISTORTION_CONFIG: HeroDistortionConfig = {
  waveNumber: 70,
  omega: 18,
  rippleLife: 3.8,
  falloffScale: 1.4,
  decayRate: 0.85,
  frontSpeed: 0.7,
  frontWidth: 0.08,
  refraction: 0.11,
  ambientStrength: 0.12,
  dropMinDistance: 0.018,
  dropStrength: 2.15,
  speedDropBoost: 3,
  velocityGain: 0.7,
  velocityDecay: 0.9,
  mouseSmoothing: 0.3,
  wakeAngle: 0.68,
  wakeSpeedBoost: 1.1,
};

export const HERO_DISTORTION_STORAGE_KEY = "hero-ripple-v2-config-dev";

export function loadHeroDistortionConfig(): HeroDistortionConfig {
  if (typeof window === "undefined") {
    return DEFAULT_HERO_DISTORTION_CONFIG;
  }

  try {
    const raw = window.localStorage.getItem(HERO_DISTORTION_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_HERO_DISTORTION_CONFIG;
    }

    return {
      ...DEFAULT_HERO_DISTORTION_CONFIG,
      ...(JSON.parse(raw) as Partial<HeroDistortionConfig>),
    };
  } catch {
    return DEFAULT_HERO_DISTORTION_CONFIG;
  }
}

export function saveHeroDistortionConfig(config: HeroDistortionConfig): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(HERO_DISTORTION_STORAGE_KEY, JSON.stringify(config));
}

export const HERO_DISTORTION_PARAM_META: Array<{
  key: keyof HeroDistortionConfig;
  label: string;
  min: number;
  max: number;
  step: number;
}> = [
  { key: "waveNumber", label: "涟漪圈密度", min: 18, max: 70, step: 1 },
  { key: "omega", label: "涟漪扩散速度", min: 8, max: 40, step: 1 },
  { key: "rippleLife", label: "涟漪寿命(秒)", min: 1, max: 6, step: 0.1 },
  { key: "refraction", label: "折射强度", min: 0.04, max: 0.3, step: 0.01 },
  { key: "dropStrength", label: "落点强度", min: 0.3, max: 2.5, step: 0.05 },
  { key: "dropMinDistance", label: "落点最小间距", min: 0.01, max: 0.12, step: 0.005 },
  { key: "speedDropBoost", label: "速度增强落点", min: 0, max: 8, step: 0.25 },
  { key: "falloffScale", label: "外圈衰减", min: 0.4, max: 4, step: 0.1 },
  { key: "decayRate", label: "时间衰减", min: 0.1, max: 1.5, step: 0.05 },
  { key: "frontSpeed", label: "波前扩散", min: 0.4, max: 2.5, step: 0.05 },
  { key: "frontWidth", label: "波前柔和度", min: 0.02, max: 0.2, step: 0.01 },
  { key: "wakeAngle", label: "V尾迹张角", min: 0.3, max: 1.0, step: 0.02 },
  { key: "wakeSpeedBoost", label: "尾迹速度增益", min: 0.5, max: 5, step: 0.1 },
  { key: "ambientStrength", label: "环境微波", min: 0, max: 0.25, step: 0.01 },
  { key: "velocityGain", label: "速度增益", min: 0.1, max: 2, step: 0.05 },
  { key: "velocityDecay", label: "速度衰减", min: 0.75, max: 0.98, step: 0.01 },
  { key: "mouseSmoothing", label: "鼠标平滑", min: 0.04, max: 0.35, step: 0.01 },
];

export function createRippleDrop(
  x: number,
  y: number,
  birthTime: number,
  strength: number,
  options: {
    kind?: RippleKind;
    dirX?: number;
    dirY?: number;
    speed?: number;
  } = {}
): RippleDrop {
  return {
    x,
    y,
    birthTime,
    strength,
    kind: options.kind ?? "pebble",
    dirX: options.dirX ?? 0,
    dirY: options.dirY ?? 0,
    speed: options.speed ?? 0,
  };
}
