"use client";

import { Sparkles, Layers, Palette, Zap } from 'lucide-react';
import { resolveAccent, hexToHsl, colorAtHue } from './visualTheme';

function SettingsSection({ id, title, en, icon: Icon, children }) {
  return <section className="setting-section" data-setting-topic={id} aria-labelledby={'setting-heading-' + id}>
    <h3 id={'setting-heading-' + id} className="setting-section-title"><Icon size={15} aria-hidden="true" />
      <span>{title}</span><small>{en}</small></h3>
    <div className="setting-section-content">{children}</div>
  </section>;
}

export function SettingChoices({ options, value, onChange, columns = 2, descriptions = false }) {
  return <div className={'setting-choices' + (descriptions ? ' setting-layout-choices' : '')} style={{ '--setting-columns': columns }}>
    {options.map(item => <button type="button" key={item.value} className="setting-choice"
      aria-pressed={value === item.value} title={item.desc} onClick={() => onChange(item.value)}>
      <span>{item.label}</span>{item.en && <small>{item.en}</small>}{descriptions && <p>{item.desc}</p>}
    </button>)}
  </div>;
}

function SettingField({ label, en, children, ...props }) {
  return <fieldset className="setting-field" {...props}>
    <legend><span>{label}</span>{en && <small>{en}</small>}</legend>{children}
  </fieldset>;
}

// Detailed comparisons belong to the selected preview region, not the global style panel.
export function RegionExperiment({ lab, item, config, onConfig }) {
  const change = value => {
    if (lab.lessonId !== item.id) lab.selectLesson(item.id);
    lab.changeSetting(item.id, value);
    if (['sidebar', 'responsive'].includes(item.id)) onConfig('layout', 'dashboard', { replay: false });
    if (item.id === 'motion' && value !== 'none') {
      onConfig('motionType', value === 'fade' ? 'fade' : config.motionType === 'fade' ? 'spring' : config.motionType, { replay: false });
    }
  };
  return <SettingField label={item.title} en={item.en} data-lesson={item.id} aria-current="step">
    <SettingChoices options={item.options} value={lab.viewSettings[item.id]} onChange={change} />
  </SettingField>;
}

export default function LabSettings({ lab, config, presets, options, colors, activePresetId, onPreset, onConfig }) {
  const field = (key, label, en, columns = 2, change = value => onConfig(key, value)) =>
    <SettingField label={label} en={en}><SettingChoices options={options[key]} value={config[key]} onChange={change} columns={columns} /></SettingField>;
  const motionDisabled = lab.reducedMotion || lab.viewSettings.access === 'reduced' || lab.viewSettings.motion === 'none';
  const accent = resolveAccent(config), hue = hexToHsl(accent).h;
  return <div className="lab-reference-settings">
    <h2 className="sr-only">风格与动效设置</h2>
    <SettingsSection id="presets" title="经典风格预设" en="Presets" icon={Sparkles}>
      <SettingChoices options={presets.map(item => ({ value: item.id, label: item.name, en: item.badge }))} value={activePresetId}
        onChange={id => onPreset(presets.find(item => item.id === id))} />
    </SettingsSection>
    <SettingsSection id="layout" title="页面布局" en="Layout" icon={Layers}>
      <SettingChoices options={options.layout} value={config.layout} onChange={value => onConfig('layout', value)} columns={1} descriptions />
    </SettingsSection>
    <SettingsSection id="visual" title="组件与视觉" en="Style" icon={Palette}>
      {field('designSystem', '组件库风格', 'Controls & spacing')}
      {field('visualStyle', '表面材质', 'Fill & texture')}
      <SettingField label="画布明暗" en="Appearance"><SettingChoices value={config.darkMode} onChange={value => onConfig('darkMode', value)} options={[
        { value: false, label: '亮色画布', en: 'Light' }, { value: true, label: '暗色画布', en: 'Dark' },
      ]} /></SettingField>
      <SettingField label="主强调色" en="Accent"><div className="setting-swatches">{Object.entries(colors).map(([key, item]) => <button
        key={key} type="button" aria-label={item.name} title={item.name} aria-pressed={config.themeColor === key}
        onClick={() => onConfig('themeColor', key)}><span style={{ background: item.hex }} /></button>)}</div>
        <div className="setting-custom-color"><label><input type="color" aria-label="自定义主色" value={accent}
          onInput={event => onConfig('customColor', event.currentTarget.value)}
          onChange={event => onConfig('customColor', event.target.value)} /><span>自定义</span></label><output aria-label="当前主色">{accent.toUpperCase()}</output></div>
        <input className="setting-hue" type="range" aria-label="主色色相" aria-valuetext={hue + '°'} min="0" max="359" step="1"
          value={hue} style={{ '--hue-thumb': accent }} onChange={event => onConfig('customColor', colorAtHue(accent, event.target.value))} />
      </SettingField>
      <SettingField label="圆角" en="Radius"><SettingChoices columns={5} options={['none', 'sm', 'md', 'lg', 'full'].map(value => ({ value, label: value }))}
        value={config.radius} onChange={value => onConfig('radius', value)} /></SettingField>
    </SettingsSection>
    <SettingsSection id="motion" title="动效与物理参数" en="Motion" icon={Zap}>
      <div className="setting-checks setting-motion-switch"><label><input type="checkbox" checked={lab.viewSettings.motion !== 'none'}
        onChange={event => lab.changeSetting('motion', event.target.checked ? config.motionType === 'fade' ? 'fade' : 'lift' : 'none')} />启用页面动效</label></div>
      {field('motionType', '入场方式', 'Entrance', 2, value => { onConfig('motionType', value, { replay: false }); lab.changeSetting('motion', value === 'fade' ? 'fade' : 'lift'); })}
      <SettingField label="弹簧参数" en="Spring" disabled={motionDisabled || config.motionType !== 'spring'}>
        <div className="setting-ranges">{[
          { key: 'stiffness', label: '弹簧刚度', en: 'Stiffness', min: 80, max: 500, step: 10 },
          { key: 'damping', label: '阻尼系数', en: 'Damping', min: 8, max: 40, step: 2 },
        ].map(item => <label key={item.key}><span>{item.label}<small>{item.en}</small><output>{config[item.key]}</output></span>
          <input type="range" aria-label={item.label} min={item.min} max={item.max} step={item.step} value={config[item.key]}
            onChange={event => onConfig(item.key, Number(event.target.value))} /></label>)}</div>
      </SettingField>
      {field('hoverEffect', '卡片悬停', 'Hover')}
      <SettingField label="附加组件" en="Components"><div className="setting-checks">
        <label><input type="checkbox" checked={config.showSkeleton} onChange={event => onConfig('showSkeleton', event.target.checked)} />展示骨架屏 (Skeleton)</label>
        <label><input type="checkbox" checked={config.showToast} onChange={event => onConfig('showToast', event.target.checked)} />展示轻提示 (Toast)</label>
      </div></SettingField>
    </SettingsSection>
  </div>;
}
