"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ArrowUpRight, Search, X, ArrowRight, Check, Plus, Box, LayoutGrid, BookOpen, FolderOpen, SlidersHorizontal } from 'lucide-react';
import { DEFAULT_SETTINGS, MATERIALS, getExperiment, getOption } from './curriculum';
import { accentVariables, accentForeground } from './visualTheme';
import { RegionExperiment } from './LabSettings';

const OUTPUT = [
  '问题一：材料中的主要观点是什么？先用自己的话概括，再指出它的依据。',
  '问题二：哪些描述来自观察，哪些属于作者的判断？找出一个可核对的例子。',
  '问题三：还有什么信息会改变你的理解？记录一个需要继续查证的问题。',
];
const subscribeMotion = callback => {
  const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  media?.addEventListener('change', callback);
  return () => media?.removeEventListener('change', callback);
};
const readMotion = () => Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
const subscribeDocument = () => () => {};
const hasDocument = () => true;
const serverDocument = () => false;
const STUDY_TARGETS = {
  columns: '.study-content-workspace', sidebar: '.study-site-layout', collection: '.study-content-workspace',
  type: '.demo-hero', rhythm: '.study-content-workspace', color: '.study-semantic-states', image: '.study-collection',
  tabs: '[data-anatomy="tabs"]', filter: '.study-collection', pagination: '.study-collection', disclosure: '.study-reading-notes',
  validation: '.study-project-form', choice: '.study-choice', combobox: '[data-anatomy="combobox"]',
  overlay: '.study-detail-example', loading: '.study-task', empty: '.study-collection', recovery: '.study-task', stream: '.study-task',
  responsive: '.study-site-layout', sticky: '[data-anatomy="tabs"]', access: '.demo-hero',
};

const panelForLesson = item => ['columns', 'type', 'rhythm', 'disclosure', 'sticky'].includes(item.id) ? 'reading'
  : item.area === 'workspace' ? 'practice' : item.area === 'content' ? 'projects' : null;
const taskKindForLesson = id => ['loading', 'recovery'].includes(id) ? id : 'stream';

export function useLearningLab(onSelectTerm, onReplay) {
  const [lessonId, setLessonId] = useState('regions');
  const [focusRevision, setFocusRevision] = useState(0);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [baseline, setBaseline] = useState(DEFAULT_SETTINGS);
  const [beforeRegion, setBeforeRegion] = useState(null);
  const [screen, setScreen] = useState('auto');
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [scope, setScope] = useState('page');
  const [includeTech, setIncludeTech] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(3);
  const [activePanel, setActivePanel] = useState('projects');
  const [openNote, setOpenNote] = useState(0);
  const [sourceId, setSourceId] = useState(MATERIALS[0].id);
  const [draft, setDraft] = useState({ name: '', url: '', material: '证据帮助读者核对观点。重复出现本身不能证明说法准确。' });
  const [formErrors, setFormErrors] = useState({});
  const [saveState, setSaveState] = useState('idle');
  const [radio, setRadio] = useState('理解题');
  const [checks, setChecks] = useState(['理解题']);
  const [explanation, setExplanation] = useState(true);
  const [job, setJob] = useState({ id: 0, phase: 'idle', kind: 'stream', step: 0, chunks: [] });
  const nextJob = useRef(0);
  const canvasRef = useRef(null);
  const scrollRef = useRef(null);
  const reducedMotion = useSyncExternalStore(subscribeMotion, readMotion, () => false);
  const lesson = getExperiment(lessonId);
  const viewSettings = beforeRegion ? { ...settings, [beforeRegion]: baseline[beforeRegion] } : settings;

  useEffect(() => {
    const node = canvasRef.current;
    if (!node) return;
    const measure = () => {
      const style = window.getComputedStyle(node);
      setCanvasWidth(Math.round(node.offsetWidth));
      setContentWidth(Math.max(0, node.clientWidth - parseFloat(style.paddingLeft || '0') - parseFloat(style.paddingRight || '0')));
    };
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(node);
    const frame = window.requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => { observer?.disconnect(); window.cancelAnimationFrame(frame); window.removeEventListener('resize', measure); };
  }, []);

  useEffect(() => {
    const viewport = scrollRef.current;
    if (!viewport) return;
    viewport.scrollTop = 0;
    const frame = window.requestAnimationFrame(() => {
      const selector = STUDY_TARGETS[lessonId];
      const target = selector && viewport.querySelector(selector);
      if (target) viewport.scrollTop = Math.max(0, target.getBoundingClientRect().top - viewport.getBoundingClientRect().top - 88);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [lessonId, focusRevision]);

  useEffect(() => {
    if (saveState !== 'saving') return;
    const timer = setTimeout(() => setSaveState('saved'), 450);
    return () => clearTimeout(timer);
  }, [saveState]);

  useEffect(() => {
    if (job.phase !== 'running') return;
    const timer = setTimeout(() => setJob(current => {
      if (current.id !== job.id || current.phase !== 'running') return current;
      const step = current.step + 1;
      const chunks = current.kind === 'loading' || (current.kind === 'stream' && current.policy === 'buffered')
        ? (step === 3 ? OUTPUT : []) : OUTPUT.slice(0, step);
      const fails = current.kind === 'recovery' && current.mode !== 'success' && step === 2;
      return { ...current, step, chunks: fails && current.mode === 'retry' ? [] : chunks,
        phase: fails ? 'failed' : step >= 3 ? 'completed' : 'running' };
    }), 650);
    return () => clearTimeout(timer);
  }, [job]);

  const selectLesson = id => {
    const item = getExperiment(id);
    setLessonId(item.id); setFocusRevision(value => value + 1); setBaseline({ ...settings }); setBeforeRegion(null);
    const panel = panelForLesson(item);
    if (panel) setActivePanel(panel);
    onSelectTerm(item.id);
    setJob(current => current.phase === 'running' || current.phase === 'paused' ? { ...current, phase: 'cancelled' } : current);
  };
  const changeSetting = (key, value) => {
    setSettings(current => ({ ...current, [key]: value })); setBeforeRegion(null);
    if (key === 'empty' && value === 'no-results') { setQuery('不存在的资料'); setCategory('全部'); setPage(1); }
    if (key === 'empty' && value === 'ready') { setQuery(''); setCategory('全部'); setPage(1); }
    if (key === 'motion') onReplay();
  };
  const setSearch = value => { setQuery(value); setPage(1); setVisibleCount(3); };
  const setFilter = value => { setCategory(value); setPage(1); setVisibleCount(3); };
  const clearFilters = () => { setQuery(''); setCategory('全部'); setPage(1); setVisibleCount(3); };
  const updateDraft = (key, value) => {
    setDraft(current => ({ ...current, [key]: value }));
    setSaveState('idle');
    setFormErrors(current => ({ ...current, [key]: '' }));
  };
  const errorFor = (key, value) => {
    if (key === 'name') return value.trim() ? '' : '请填写项目名称，方便之后找到它。';
    if (!value.trim()) return '请填写项目链接，例如 https://example.com。';
    try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? '' : '请使用以 https:// 或 http:// 开头的网址。'; }
    catch { return '链接格式不完整，请使用 https://example.com 这样的完整网址。'; }
  };
  const validateOnBlur = key => {
    if (viewSettings.validation === 'blur' && draft[key].trim()) setFormErrors(current => ({ ...current, [key]: errorFor(key, draft[key]) }));
  };
  const saveProject = event => {
    event.preventDefault();
    if (saveState === 'saving') return;
    const errors = { name: errorFor('name', draft.name), url: errorFor('url', draft.url) };
    setFormErrors(errors);
    if (errors.name || errors.url) { event.currentTarget.querySelector(errors.name ? '#study-project-name' : '#study-project-url')?.focus(); return; }
    setSaveState('saving');
  };
  const startJob = (kind = taskKindForLesson(lessonId), retry = false) => {
    if (job.phase === 'running') return;
    setJob({ id: ++nextJob.current, phase: 'running', kind, step: 0, chunks: [],
      policy: viewSettings.stream, mode: retry ? 'success' : viewSettings.recovery, material: draft.material });
  };
  return { lesson, lessonId, settings, viewSettings, beforeRegion, setBeforeRegion,
    captureBaseline: id => { setBaseline(current => ({ ...current, [id]: settings[id] })); setBeforeRegion(null); },
    selectLesson, changeSetting, screen, setScreen, canvasWidth, contentWidth, canvasRef, scrollRef, reducedMotion,
    scope, setScope, includeTech, setIncludeTech, query, setSearch, category, setFilter, sort, setSort, page, setPage,
    visibleCount, setVisibleCount, clearFilters, activePanel, setActivePanel, openNote, setOpenNote,
    sourceId, setSourceId, draft, updateDraft, formErrors, validateOnBlur, saveProject, saveState,
    radio, setRadio, checks, setChecks, explanation, setExplanation, job, startJob,
    pauseJob: () => setJob(current => current.phase === 'running' ? { ...current, phase: 'paused' } : current),
    resumeJob: () => setJob(current => current.phase === 'paused' ? { ...current, phase: 'running' } : current),
    cancelJob: () => setJob(current => ['running', 'paused'].includes(current.phase) ? { ...current, phase: 'cancelled' } : current),
  };
}


export function StudyToolbar({ lab }) {
  return <div className="study-toolbar">
    <div className="study-screen-row"><label>画布宽度 <select aria-label="画布宽度" value={lab.screen} onChange={event => lab.setScreen(event.target.value)}>
      <option value="auto">适应窗口</option><option value="960">桌面 960</option><option value="768">平板 768</option><option value="390">手机 390</option>
    </select></label><span aria-live="polite">{lab.canvasWidth ? `${lab.canvasWidth} px` : '测量中'}</span>
    </div>
  </div>;
}

export function StudyExplanation({ lab, activeTerm, config, onConfig }) {
  if (!activeTerm.lessonId) return null;
  const item = getExperiment(activeTerm.lessonId);
  return <details key={item.id} className="study-explanation"><summary>用途与交互示例<ChevronDown size={13} /></summary>
    <div className="study-region-settings">
      <RegionExperiment lab={lab} item={item} config={config} onConfig={onConfig} />
      <div className="study-region-tools"><button type="button" onClick={() => lab.selectLesson(item.id)}>在预览中定位</button>
        <div role="group" aria-label="当前部位设置对照"><button type="button" aria-pressed={lab.beforeRegion === item.id} onClick={() => lab.setBeforeRegion(item.id)}>修改前</button>
          <button type="button" aria-pressed={lab.beforeRegion !== item.id} onClick={() => lab.setBeforeRegion(null)}>修改后</button>
          <button type="button" onClick={() => lab.captureBaseline(item.id)} title="将当前部位设置保存为修改前">设为对照</button></div>
      </div>
    </div>
    <dl><dt>试一试</dt><dd>{item.observe}</dd><dt>适合什么时候</dt><dd>{item.when}</dd><dt>容易混淆的地方</dt><dd>{item.difference}</dd><dt>操作规则</dt><dd><ul>{item.rules.map(rule => <li key={rule}>{rule}</li>)}</ul></dd></dl>
    <p>当前呈现：{item.title} · {getOption(item, lab.viewSettings).label}</p>
  </details>;
}

export function PromptScopeControls({ lab }) {
  return <div className="study-prompt-options"><label>输出范围<select aria-label="提示词输出范围" value={lab.scope} onChange={event => lab.setScope(event.target.value)}>
    <option value="page">整页需求</option><option value="part">当前部位</option><option value="change">本次调整</option></select></label>
    <label><input type="checkbox" checked={lab.includeTech} onChange={event => lab.setIncludeTech(event.target.checked)} />加入可选技术参数</label>
  </div>;
}

export function studySurfaceStyle(lab, accent, config) {
  const s = lab.viewSettings;
  return {
    ...accentVariables(s.color === 'quiet' ? '#57534e' : accent, config.darkMode),
    width: lab.screen === 'auto' ? '100%' : `${lab.screen}px`, maxWidth: lab.screen === 'auto' ? '100%' : 'none',
    '--study-title-size': s.type === 'flat' ? '23px' : s.type === 'display' ? '42px' : '32px',
    '--study-body-size': s.access === 'large' ? '18px' : '14px',
    '--study-line-height': s.rhythm === 'compact' ? 1.45 : s.rhythm === 'wide' ? 1.65 : 1.9,
    '--study-measure': s.rhythm === 'wide' ? '90ch' : s.rhythm === 'compact' ? '54ch' : '64ch',
    '--study-space': s.rhythm === 'compact' ? '16px' : '24px',
    '--study-accent': s.color === 'quiet' ? '#57534e' : accent,
    '--study-on-accent': accentForeground(s.color === 'quiet' ? '#57534e' : accent),
    '--study-radius': { none: '0px', sm: '6px', md: '12px', lg: '16px', full: '24px' }[config.radius],
  };
}

function PlaceholderCover({ variant = 0 }) {
  const gradient = useId().replace(/:/g, '');
  return <svg className="study-cover" viewBox="0 0 480 300" role="img" aria-label="由画框、圆和线条组成的占位封面">
    <defs><linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--study-accent)" stopOpacity=".2" /><stop offset="1" stopColor="var(--study-accent)" stopOpacity=".02" /></linearGradient></defs>
    <rect width="480" height="300" fill="var(--study-panel)" /><rect width="480" height="300" fill={`url(#${gradient})`} />
    {variant % 3 === 0 ? <>
      <rect x="74" y="45" width="332" height="210" rx="12" fill="var(--study-paper)" stroke="var(--study-line)" />
      <path d="M74 83h332M172 83v172" stroke="var(--study-line)" /><circle cx="94" cy="64" r="4" fill="var(--study-accent)" />
      <rect x="93" y="105" width="60" height="12" rx="4" fill="var(--study-accent)" opacity=".6" />
      <path d="M94 137h52m-52 22h42m-42 22h52M198 113h130m-130 17h80" stroke="var(--study-muted)" strokeWidth="5" opacity=".25" />
      <rect x="198" y="153" width="77" height="73" rx="7" fill="var(--study-accent)" opacity=".15" /><rect x="291" y="153" width="86" height="73" rx="7" fill="var(--study-accent)" opacity=".3" />
    </> : variant % 3 === 1 ? <>
      <circle cx="242" cy="150" r="104" fill="var(--study-accent)" opacity=".12" /><circle cx="242" cy="150" r="69" fill="var(--study-paper)" />
      <rect x="119" y="78" width="162" height="172" rx="9" fill="var(--study-paper)" stroke="var(--study-line)" transform="rotate(-13 200 164)" />
      <rect x="215" y="49" width="150" height="185" rx="9" fill="var(--study-paper)" stroke="var(--study-line)" transform="rotate(10 290 142)" />
      <path d="m245 96 81 14m-85 12 56 10m-61 17 81 14m-85 12 71 12" stroke="var(--study-accent)" strokeWidth="7" opacity=".35" />
    </> : <>
      <rect x="78" y="55" width="324" height="190" rx="12" fill="var(--study-paper)" stroke="var(--study-line)" />
      <path d="M107 210h264M107 166h264M107 122h264M107 78v132" stroke="var(--study-line)" />
      <path d="m110 184 52-22 54 10 54-70 48 22 51-43" fill="none" stroke="var(--study-accent)" strokeWidth="5" strokeLinejoin="round" />
      <circle cx="270" cy="102" r="7" fill="var(--study-accent)" /><circle cx="369" cy="81" r="7" fill="var(--study-accent)" />
    </>}
  </svg>;
}

function SourceCombobox({ sourceId, onSelect }) {
  const selected = MATERIALS.find(item => item.id === sourceId);
  const [search, setSearch] = useState({ source: sourceId, text: selected.title });
  const query = search.source === sourceId ? search.text : selected.title;
  const setQuery = text => setSearch({ source: sourceId, text });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const container = useRef(null);
  const filtered = MATERIALS.filter(item => item.title.includes(query) || item.category.includes(query));
  const candidates = query === selected.title ? MATERIALS : filtered;
  useEffect(() => {
    const outside = event => { if (!container.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  const choose = item => { onSelect(item.id); setQuery(item.title); setOpen(false); setActive(0); };
  return <div className="study-combobox" ref={container} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) { setOpen(false); setQuery(selected.title); }
  }}><label htmlFor="study-source-search">资料来源</label>
    <input id="study-source-search" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls="study-source-list"
      aria-activedescendant={open && candidates[active] ? `source-option-${candidates[active].id}` : undefined}
      value={query} onFocus={() => setOpen(true)} onChange={event => { setQuery(event.target.value); setOpen(true); setActive(0); }}
      onKeyDown={event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); setActive(current => candidates.length ? (current + (event.key === 'ArrowDown' ? 1 : -1) + candidates.length) % candidates.length : 0); }
        if (event.key === 'Enter' && open && candidates[active]) { event.preventDefault(); choose(candidates[active]); }
        if (event.key === 'Escape') { setOpen(false); setQuery(selected.title); }
      }} />
    {open && <ul id="study-source-list" role="listbox" aria-label="资料候选">{candidates.length ? candidates.map((item, index) => <li
      id={`source-option-${item.id}`} key={item.id} role="option" aria-selected={index === active} onPointerDown={event => event.preventDefault()}
      onClick={() => choose(item)}>{item.title}<small>{item.category}</small></li>) : <li>没有匹配资料，请调整关键词。</li>}</ul>}
    <small>已确认：{selected.title}</small>
  </div>;
}

function DetailOverlay({ lab }) {
  const dialog = useRef(null), popover = useRef(null), trigger = useRef(null);
  const anchor = `--study-detail-${useId().replace(/:/g, '')}`;
  const portalReady = useSyncExternalStore(subscribeDocument, hasDocument, serverDocument);
  const mode = lab.viewSettings.overlay;
  const selected = MATERIALS.find(item => item.id === lab.sourceId);
  const close = () => { dialog.current?.close(); popover.current?.hidePopover?.(); trigger.current?.focus(); };
  const body = <><div className="study-detail-heading"><div><small>资料详情</small><h4>{selected.title}</h4></div><button type="button" onClick={close} aria-label="关闭资料详情"><X size={18} /></button></div>
    <p>{selected.summary}</p><dl><dt>分类</dt><dd>{selected.category}</dd><dt>更新时间</dt><dd>{selected.date}</dd></dl><p>这份资料用于当前页面的本地练习。关闭详情后，可继续填写或查看已有结果。</p></>;
  return <div className="study-detail-example"><button type="button" ref={trigger} style={{ anchorName: anchor }} onClick={() => {
    if (mode === 'popover') { if (popover.current?.showPopover) popover.current.showPopover(); else dialog.current?.showModal?.(); }
    else dialog.current?.showModal?.();
  }}>查看资料详情<ArrowUpRight size={14} /></button>
    {portalReady && createPortal(<><dialog ref={dialog} aria-label="资料详情" className={`study-dialog ${mode === 'drawer' ? 'study-drawer' : ''}`} onClose={() => trigger.current?.focus()}
      onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}>
      <div>{body}</div></dialog>
    {mode === 'popover' && <div popover="auto" ref={popover} style={{ positionAnchor: anchor }} className="study-popover" aria-label="资料简要信息">{body}</div>}</>, document.body)}
  </div>;
}

function ProjectForm({ lab, Region, regionProps }) {
  const s = lab.viewSettings;
  return <Region {...regionProps} termId="validation" className="study-form-region"><form className="study-project-form" onSubmit={lab.saveProject} noValidate>
    <div className="study-section-heading"><h4>保存一个项目</h4><small>{s.validation === 'submit' ? '提交时校验' : '离开字段时校验'}</small></div>
    <label htmlFor="study-project-name">项目名称 <span>必填</span></label><input id="study-project-name" value={lab.draft.name}
      aria-invalid={Boolean(lab.formErrors.name)} aria-describedby={lab.formErrors.name ? 'study-name-error' : undefined}
      onBlur={() => lab.validateOnBlur('name')} onChange={event => lab.updateDraft('name', event.target.value)} />
    {lab.formErrors.name && <p id="study-name-error" className="study-error">{lab.formErrors.name}</p>}
    <label htmlFor="study-project-url">项目链接 <span>必填</span></label><input id="study-project-url" type="url" value={lab.draft.url}
      placeholder="https://example.com" aria-invalid={Boolean(lab.formErrors.url)} aria-describedby={lab.formErrors.url ? 'study-url-error' : 'study-url-help'}
      onBlur={() => lab.validateOnBlur('url')} onChange={event => lab.updateDraft('url', event.target.value)} />
    <small id="study-url-help">填写完整网址，便于之后重新打开。</small>{lab.formErrors.url && <p id="study-url-error" className="study-error">{lab.formErrors.url}</p>}
    <button type="submit" className="study-primary" disabled={lab.saveState === 'saving'}>{lab.saveState === 'saving' ? '正在保存…' : '保存项目'}</button>
    <p className="study-save-status" role="status">{lab.saveState === 'saved' ? '本页示例已保存，可以继续编辑。' : lab.saveState === 'saving' ? '保存中，请稍候。' : ''}</p>
  </form></Region>;
}

function ChoiceControls({ lab, Region, regionProps }) {
  const mode = lab.viewSettings.choice;
  return <Region {...regionProps} termId="choice" className="study-choice-region"><fieldset className="study-choice"><legend>{mode === 'switch' ? '解析设置' : '练习题型'}</legend>
    {mode === 'switch' ? <label><input type="checkbox" role="switch" checked={lab.explanation} onChange={event => lab.setExplanation(event.target.checked)} />显示参考解析</label>
      : ['理解题', '对照题', '追问题'].map(label => <label key={label}><input type={mode === 'radio' ? 'radio' : 'checkbox'} name="study-question-type" value={label}
        checked={mode === 'radio' ? lab.radio === label : lab.checks.includes(label)} onChange={() => mode === 'radio' ? lab.setRadio(label) : lab.setChecks(current => current.includes(label) ? current.filter(item => item !== label) : [...current, label])} />{label}</label>)}
    <small aria-live="polite">{mode === 'switch' ? `参考解析：${lab.explanation ? '显示' : '隐藏'}` : `已选：${mode === 'radio' ? lab.radio : lab.checks.join('、') || '尚未选择'}`}</small>
    {mode === 'switch' && lab.explanation && <p>参考解析：先指出材料中的观点，再找到支持它的具体依据。</p>}
  </fieldset></Region>;
}

function TaskFeedback({ lab, Region, regionProps }) {
  const kind = taskKindForLesson(lab.lessonId);
  const job = lab.job, running = job.phase === 'running', paused = job.phase === 'paused';
  const mode = lab.viewSettings.loading;
  const names = { idle: '尚未开始', running: '正在处理', paused: '已暂停，可以继续', failed: '本次处理失败', cancelled: '本次任务已取消', completed: '本次处理完成' };
  return <Region {...regionProps} termId={kind === 'stream' ? 'stream' : kind === 'recovery' ? 'recovery' : 'loading'} className="study-task-region">
    <section className="study-task" aria-label="任务反馈示例"><div className="study-section-heading"><h4>{kind === 'stream' ? '用材料生成练习' : kind === 'recovery' ? '处理与恢复' : '加载资料摘要'}</h4><small>本地演示</small></div>
      <label htmlFor="study-material">你的材料</label><div className="study-task-composer"><textarea id="study-material" value={lab.draft.material} onChange={event => lab.updateDraft('material', event.target.value)} rows={5} />
      <div className="study-task-actions"><button type="button" className="study-primary" disabled={running || paused || !lab.draft.material.trim()} onClick={() => lab.startJob(kind)}>{kind === 'loading' ? '开始加载' : '生成练习'}</button>
        {running && kind === 'stream' && <button type="button" onClick={lab.pauseJob}>暂停生成</button>}
        {paused && <button type="button" onClick={lab.resumeJob}>继续生成</button>}
        {(running || paused) && <button type="button" onClick={lab.cancelJob}>取消任务</button>}
        {job.phase === 'failed' && <button type="button" onClick={() => lab.startJob(kind, true)}>重试本次任务</button>}</div></div>
      <div className={`study-task-result study-state-${job.phase}`} aria-busy={running} aria-live="polite" aria-atomic="false">
        <p className="study-status-name">{names[job.phase]}{running ? ` · 阶段 ${Math.min(job.step + 1, 3)} / 3` : ''}</p>
        {running && kind === 'loading' && mode === 'spinner' && <div className="study-spinner-line"><span className="study-spinner" />正在整理资料，请稍候。</div>}
        {running && kind === 'loading' && mode === 'skeleton' && <div className="study-skeleton" aria-label="结果加载占位"><span /><span /><span /></div>}
        {running && kind === 'loading' && mode === 'progress' && <div><progress max="3" value={job.step} aria-label="资料处理进度" /><small>正在完成本地演示的已知阶段。</small></div>}
        {job.phase === 'failed' && <p className="study-error">模拟处理未完成。材料仍在，可以重试{job.chunks.length ? '；以下为已生成部分，尚不完整。' : '。'}</p>}
        {job.phase === 'cancelled' && <p>{job.chunks.length ? '已停止后续更新。以下保留本次已显示部分，结果尚未完成。' : '已停止后续更新，本次没有可显示的结果。'}</p>}
        {paused && <p>已生成部分保留，点击继续后从当前阶段恢复。</p>}
        {job.chunks.map((text, index) => <p className="study-output-chunk" key={`${job.id}-${index}`}>{text}</p>)}
        {running && kind === 'stream' && job.policy === 'buffered' && <p>正在准备完整结果，完成后一次展示。</p>}
        {job.material && job.material !== lab.draft.material && <p>这次结果使用任务开始时的材料；再次生成会使用你修改后的材料。</p>}
      </div>
    </section></Region>;
}

function Collection({ lab, Region, regionProps }) {
  const s = lab.viewSettings;
  const filterMode = s.filter;
  const filtered = MATERIALS.filter(item => (filterMode === 'search' || lab.category === '全部' || item.category === lab.category)
    && (filterMode === 'category' || `${item.title} ${item.summary}`.includes(lab.query.trim())))
    .sort((a, b) => lab.sort === 'title' ? a.title.localeCompare(b.title, 'zh') : lab.sort === 'oldest' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  const forcedEmpty = lab.lessonId === 'empty' && s.empty === 'empty';
  const totalPages = Math.max(1, Math.ceil(filtered.length / 3));
  const currentPage = Math.min(lab.page, totalPages);
  const visible = s.pagination === 'more' ? filtered.slice(0, lab.visibleCount) : filtered.slice((currentPage - 1) * 3, currentPage * 3);
  const selected = MATERIALS.find(item => item.id === lab.sourceId);
  const read = item => lab.setSourceId(item.id);
  const row = (item, index) => <article key={item.id} className="study-project-card">
    <div className="study-cover-frame"><PlaceholderCover variant={MATERIALS.findIndex(source => source.id === item.id)} /></div>
    <div><small>{item.category} · {item.date}</small><h4>{item.title}</h4><p>{item.summary}</p><button type="button" onClick={() => read(item)}>选择这份资料<ArrowRight size={13} /></button></div>
    <span className="study-project-index">{String(index + 1 + (currentPage - 1) * 3).padStart(2, '0')}</span>
  </article>;
  return <Region {...regionProps} termId={lab.lesson.topic === 'navigation' ? lab.lessonId : 'collection'} className="study-collection-region">
    <section className="study-collection" aria-label="项目资料集合"><div className="study-section-heading"><h4>项目与资料</h4><span>{forcedEmpty ? 0 : filtered.length} 条</span></div>
      <div className="study-filters">{filterMode !== 'category' && <label className="study-search"><Search size={14} /><input aria-label="搜索项目资料" placeholder="搜索标题或摘要" value={lab.query} onChange={event => lab.setSearch(event.target.value)} /></label>}
        {filterMode !== 'search' && <label>分类<select aria-label="资料分类" value={lab.category} onChange={event => lab.setFilter(event.target.value)}>{['全部', '设计', '阅读', '工具'].map(value => <option key={value}>{value}</option>)}</select></label>}
        <label>排序<select aria-label="资料排序" value={lab.sort} onChange={event => { lab.setSort(event.target.value); lab.setPage(1); }}><option value="newest">最新在前</option><option value="oldest">最早在前</option><option value="title">按标题</option></select></label>
      </div>
      {(lab.query || lab.category !== '全部') && <button className="study-clear-filters" type="button" onClick={lab.clearFilters}>清除筛选条件</button>}
      {forcedEmpty || !filtered.length ? <div className="study-empty" role="status"><h4>{forcedEmpty && s.empty === 'empty' ? '把第一份资料放进来' : '没有找到匹配内容'}</h4>
        <p>{forcedEmpty && s.empty === 'empty' ? '添加一份资料，之后就可以搜索、整理并生成练习。' : `保留当前条件：${lab.query || '示例关键词'} / ${lab.category}。可以调整关键词或清除条件。`}</p>
        <button type="button" onClick={() => { lab.clearFilters(); if (lab.lessonId === 'empty') lab.changeSetting('empty', 'ready'); }}>{forcedEmpty && s.empty === 'empty' ? <><Plus size={14} />添加示例资料</> : '清除筛选条件'}</button></div>
        : <>{s.collection === 'table' ? <div className="study-table-scroll"><table><caption className="sr-only">项目资料及更新时间</caption><thead><tr><th scope="col">标题</th><th scope="col">分类</th><th scope="col">更新时间</th><th scope="col">操作</th></tr></thead><tbody>{visible.map(item => <tr key={item.id}><th scope="row">{item.title}</th><td>{item.category}</td><td>{item.date}</td><td><button type="button" onClick={() => read(item)}>选择资料</button></td></tr>)}</tbody></table></div>
          : <div className={`study-projects study-projects-${s.collection}`} data-image-fit={s.image}>{visible.map(row)}</div>}
          <div className="study-pagination">{s.pagination === 'more' ? <><span>已显示 {visible.length} / {filtered.length} 条</span><button type="button" disabled={visible.length >= filtered.length} onClick={() => lab.setVisibleCount(current => current + 3)}>{visible.length >= filtered.length ? '已全部显示' : '加载更多资料'}</button></>
            : <><button type="button" disabled={currentPage === 1} onClick={() => lab.setPage(current => Math.max(1, current - 1))}>上一页</button><span aria-live="polite">第 {currentPage} / {totalPages} 页</span><button type="button" disabled={currentPage >= totalPages} onClick={() => lab.setPage(current => current + 1)}>下一页</button></>}</div>
        </>}
      <div className="study-selected-source"><p aria-live="polite">当前资料：{selected.title}</p><DetailOverlay lab={lab} /></div>
    </section></Region>;
}

function ReadingNotes({ lab, Region, regionProps }) {
  const items = [
    ['如何开始一次阅读？', '先留下一个可以回答的问题，再区分材料中可观察的描述与作者的判断。'],
    ['为什么保留原始依据？', '原始依据让之后的复查有明确入口，也让新的证据能够改变已有判断。'],
    ['什么时候需要继续追问？', '当关键说法缺少依据，或者不同材料之间出现分歧时，把它记成下一次阅读的问题。'],
  ];
  return <Region {...regionProps} termId="disclosure"><section className="study-reading-notes"><h4>阅读时留下的三个问题</h4>{items.map(([title, text], index) => {
    const expanded = lab.viewSettings.disclosure === 'expanded' || lab.openNote === index;
    return <div key={title}><button type="button" aria-expanded={expanded} aria-controls={`study-note-${index}`} onClick={() => lab.setOpenNote(lab.openNote === index ? -1 : index)}>{title}<ChevronDown size={14} className={expanded ? 'study-rotate' : ''} /></button><p id={`study-note-${index}`} hidden={!expanded}>{text}</p></div>;
  })}</section></Region>;
}

export function PreviewSiteLayout({ lab, layout, Region, regionProps, children }) {
  const main = <div key="main" className="study-product-main">{children}</div>;
  const selected = MATERIALS.find(item => item.id === lab.sourceId);
  const current = lab.lessonId === 'regions' ? 'overview' : lab.activePanel;
  const directory = <Region key="directory" {...regionProps} termId="sidebar" className="study-site-directory-region">
    <aside className="study-site-directory demo-panel" aria-label="示例网页目录">
      <div className="study-directory-title"><LayoutGrid size={15} /><span>页面目录</span></div>
      <nav aria-label="网页区域">{[
        ['overview', '页面概览', 'regions', LayoutGrid], ['projects', '项目资料', 'collection', FolderOpen],
        ['reading', '阅读笔记', 'columns', BookOpen], ['practice', '练习工作台', 'validation', SlidersHorizontal],
      ].map(([id, label, lesson, Icon]) => <button type="button" key={id} aria-current={current === id ? 'page' : undefined}
        onClick={event => { event.stopPropagation(); lab.selectLesson(lesson); }}><Icon size={14} />{label}</button>)}</nav>
      <div className="study-directory-source"><small>当前资料</small><strong>{selected.title}</strong><p>{selected.summary}</p></div>
    </aside>
  </Region>;
  const mainFirst = lab.contentWidth > 0 && lab.contentWidth <= 680 && lab.viewSettings.responsive === 'main-first';
  return <div className="study-site-layout" data-layout={layout} data-sidebar={lab.viewSettings.sidebar} data-mobile-order={lab.viewSettings.responsive}>
    {layout === 'dashboard' ? (mainFirst ? [main, directory] : [directory, main]) : [main]}
  </div>;
}

export function LearningWorkspace({ lab, Region, regionProps }) {
  const s = lab.viewSettings;
  const projectsHeading = useRef(null), readingHeading = useRef(null), practiceHeading = useRef(null);
  const selectedSource = MATERIALS.find(item => item.id === lab.sourceId);
  const panels = [['projects', '项目资料', projectsHeading], ['reading', '阅读笔记', readingHeading], ['practice', '练习工作台', practiceHeading]];
  const activatePanel = panel => {
    lab.setActivePanel(panel);
    if (s.tabs === 'anchors') { const target = panels.find(item => item[0] === panel)[2].current; target?.scrollIntoView?.({ block: 'start' }); target?.focus(); }
  };
  const tabs = <Region {...regionProps} termId="tabs"><nav className="study-content-tabs" aria-label={s.tabs === 'tabs' ? '内容页签' : '页内目录'} role={s.tabs === 'tabs' ? 'tablist' : undefined}>
    {panels.map(([id, title], index) => <button type="button" key={id} id={`study-tab-${id}`}
      role={s.tabs === 'tabs' ? 'tab' : undefined} aria-selected={s.tabs === 'tabs' ? lab.activePanel === id : undefined}
      aria-controls={`study-panel-${id}`} tabIndex={s.tabs !== 'tabs' || lab.activePanel === id ? 0 : -1}
      onClick={() => activatePanel(id)} onKeyDown={event => {
        if (s.tabs !== 'tabs' || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault(); const next = event.key === 'Home' ? 'projects' : event.key === 'End' ? 'practice'
          : panels[(index + (event.key === 'ArrowRight' ? 1 : -1) + panels.length) % panels.length][0];
        lab.setActivePanel(next); event.currentTarget.parentElement.querySelector(`#study-tab-${next}`)?.focus();
      }}>{title}</button>)}
  </nav></Region>;
  const collection = <div id="study-panel-projects" role={s.tabs === 'tabs' ? 'tabpanel' : undefined} aria-labelledby="study-tab-projects" hidden={s.tabs === 'tabs' && lab.activePanel !== 'projects'}>
    <h4 ref={projectsHeading} tabIndex={-1} className="sr-only">项目资料</h4><Collection lab={lab} Region={Region} regionProps={regionProps} /></div>;
  const reading = <div id="study-panel-reading" role={s.tabs === 'tabs' ? 'tabpanel' : undefined} aria-labelledby="study-tab-reading" hidden={s.tabs === 'tabs' && lab.activePanel !== 'reading'}>
    <article className="study-article demo-panel"><div className="study-article-meta"><BookOpen size={14} /><span>阅读笔记</span><span>约 2 分钟</span></div>
      <h4 ref={readingHeading} tabIndex={-1} className="study-article-title">带着问题，重新阅读。</h4>
      <p className="study-article-lead">把材料、观点和依据放在一起，让每一次阅读都能留下可继续追问的问题。</p>
      <div className="study-article-visual"><PlaceholderCover variant={1} /></div>
      <h5>从一个具体问题开始</h5><p>有用的笔记不只是复述材料。它帮你留下一个值得回头思考的问题，也提醒你去寻找支持观点的依据。</p>
      <p>先观察，再描述；先说明发生了什么，再判断它意味着什么。把新出现的联系记录下来，也允许之后的证据改变现在的理解。</p>
      <blockquote>当我们能把问题说得更具体，下一次阅读也就有了方向。</blockquote>
      <ReadingNotes lab={lab} Region={Region} regionProps={regionProps} />
    </article></div>;
  const task = <div key="task" className="study-practice-card demo-panel"><TaskFeedback lab={lab} Region={Region} regionProps={regionProps} /></div>;
  const fields = <div key="fields" className="study-practice-card demo-panel"><Region {...regionProps} termId="combobox">{s.combobox === 'native' ? <label className="study-source-select">资料来源<select value={lab.sourceId} onChange={event => lab.setSourceId(event.target.value)}>{MATERIALS.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label> : <SourceCombobox sourceId={lab.sourceId} onSelect={lab.setSourceId} />}</Region>
    <DetailOverlay lab={lab} /><ChoiceControls lab={lab} Region={Region} regionProps={regionProps} /><ProjectForm lab={lab} Region={Region} regionProps={regionProps} /></div>;
  const practice = <div id="study-panel-practice" role={s.tabs === 'tabs' ? 'tabpanel' : undefined} aria-labelledby="study-tab-practice" hidden={s.tabs === 'tabs' && lab.activePanel !== 'practice'}>
    <h4 ref={practiceHeading} tabIndex={-1} className="sr-only">练习工作台</h4>
    {lab.lesson.topic === 'feedback' || lab.lessonId === 'responsive' ? [task, fields] : [fields, task]}
  </div>;
  return <section className="study-content-workspace study-scenario" aria-label="项目与练习">
    <div className="study-workspace-title"><Box size={17} /><h4>项目与练习</h4></div>
    {tabs}
    <Region {...regionProps} termId="columns"><div className="study-reading-layout" data-columns={s.columns}>
      <div className="study-workspace-content">{collection}{reading}{practice}</div>
      <aside className="study-context-panel" aria-label="当前资料与后续操作">
        <div className="study-context-card demo-panel"><div className="study-context-cover"><PlaceholderCover variant={MATERIALS.findIndex(item => item.id === lab.sourceId)} /></div>
          <div className="study-context-body"><span className="study-context-category">{selectedSource.category}</span><h4>{selectedSource.title}</h4><p>{selectedSource.summary}</p>
            <small>更新于 {selectedSource.date}</small><button type="button" className="study-primary" onClick={() => activatePanel('practice')}>用这份资料练习<ArrowRight size={13} /></button></div>
        </div>
        <div className="study-context-next"><h5>接下来可以</h5><button type="button" onClick={() => activatePanel('projects')}>浏览其他资料<ArrowRight size={13} /></button><button type="button" onClick={() => activatePanel('reading')}>回到阅读笔记<ArrowRight size={13} /></button></div>
        {lab.lessonId === 'color' && <StatusExamples />}
      </aside>
    </div></Region>
  </section>;
}

export function LearningScene({ children }) {
  return <div className="study-original-product">
    {children}
    <footer className="study-page-footer"><strong>AcmeUI</strong><span>项目 · 阅读 · 练习 · 组件</span></footer>
  </div>;
}

function StatusExamples() {
  return <section className="study-semantic-states" aria-label="状态颜色对照"><p className="study-semantic-success"><Check size={15} />已保存：内容可继续查看。</p><p className="study-semantic-warning">提醒：这份材料尚未补充来源。</p><p className="study-semantic-error">错误：链接格式不完整，请重新填写。</p></section>;
}
