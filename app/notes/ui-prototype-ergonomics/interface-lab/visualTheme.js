// These are illustrative CSS treatments, not installed component libraries.
export const LIBRARY_TREATMENTS = {
  shadcn: { cn: '细边框、克制阴影、中等控件间距', en: 'Fine borders, restrained elevation, regular controls' },
  antd: { cn: '紧凑控件、小圆角、清晰分组', en: 'Compact controls, small corners, structured groups' },
  mui: { cn: '宽松控件、色调填充、层次阴影', en: 'Roomy controls, tonal fills, layered elevation' },
  neobrutalism: { cn: '粗描边、硬阴影、醒目控件', en: 'Heavy outlines, hard shadows, bold controls' },
};
export const SURFACE_TREATMENTS = {
  glass: { cn: '半透明填充与背景模糊', en: 'Translucent fill and backdrop blur' },
  minimal: { cn: '纯色填充，减少表面装饰', en: 'Opaque fill with minimal decoration' },
  brutal: { cn: '实色填充与偏移投影', en: 'Solid fill and offset shadows' },
  soft: { cn: '柔和色调与弥散光影', en: 'Soft tint and diffused light' },
};

const PRESET_ACCENTS = { indigo: '#4f46e5', emerald: '#059669', amber: '#f59e0b', blue: '#2563eb' };
export function resolveAccent(config) {
  return config.themeColor === 'custom' && /^#[\da-f]{6}$/i.test(config.customColor || '')
    ? config.customColor.toLowerCase() : PRESET_ACCENTS[config.themeColor] || PRESET_ACCENTS.indigo;
}

export function hexToHsl(hex) {
  const [r, g, b] = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  const l = (max + min) / 2;
  let h = 0;
  if (delta) h = (max === r ? (g - b) / delta + (g < b ? 6 : 0) : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4) * 60;
  return { h: Math.round(h) % 360, s: delta ? delta / (1 - Math.abs(2 * l - 1)) : 0, l };
}

export function colorAtHue(hex, hue) {
  const { s: saturation, l: lightness } = hexToHsl(hex);
  const s = saturation || .75, l = saturation ? lightness : .48;
  const c = (1 - Math.abs(2 * l - 1)) * s, h = Number(hue) / 60;
  const x = c * (1 - Math.abs(h % 2 - 1)), m = l - c / 2;
  const rgb = h < 1 ? [c, x, 0] : h < 2 ? [x, c, 0] : h < 3 ? [0, c, x] : h < 4 ? [0, x, c] : h < 5 ? [x, 0, c] : [c, 0, x];
  return '#' + rgb.map(value => Math.round((value + m) * 255).toString(16).padStart(2, '0')).join('');
}

function luminance(hex) {
  const channels = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255)
    .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}
export function accentForeground(hex) {
  const value = luminance(hex);
  return (value + .05) / .05 > 1.05 / (value + .05) ? '#000000' : '#ffffff';
}
export function accentVariables(hex, dark = false) {
  const hsl = hexToHsl(hex);
  const ink = dark ? '#f5f5f4' : '#292524';
  const paper = dark ? '#191a1d' : '#fdfdfc';
  const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
  return {
    '--demo-accent': hex,
    '--demo-on-accent': accentForeground(hex),
    '--demo-accent-text': contrast(hex, paper) >= 4.5 ? hex : `color-mix(in srgb, ${hex} 35%, ${ink})`,
    '--demo-accent-next': hsl.s ? colorAtHue(hex, (hsl.h + 38) % 360) : hex,
  };
}
