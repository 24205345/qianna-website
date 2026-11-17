/** Behavior checks for the copied React lab; layout is checked in a real browser.
 * Uses the same external jsdom directory as ui-prototype-lab.test.mjs.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const require = createRequire(import.meta.url);
const testRequire = createRequire(join(process.env.UI_LAB_TEST_MODULES || join(tmpdir(), 'qianna-ui-lab-tests'), 'package.json'));
const { JSDOM } = testRequire('jsdom');
const { createElement, act } = require('react');
const ts = require('typescript');
const moduleCache = new Map();
function loadLabModule(path) {
  if (moduleCache.has(path)) return moduleCache.get(path).exports;
  const compiled = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const current = { exports: {} };
  moduleCache.set(path, current);
  const localRequire = name => {
    if (!name.startsWith('.')) return require(name);
    const target = resolve(dirname(path), name);
    return loadLabModule([target, `${target}.jsx`, `${target}.js`].find(existsSync));
  };
  new Function('require', 'module', 'exports', compiled)(localRequire, current, current.exports);
  return current.exports;
}
const labPath = fileURLToPath(new URL('../app/notes/ui-prototype-ergonomics/interface-lab/FrontendPromptLab.jsx', import.meta.url));
const Lab = loadLabModule(labPath).default;
const { EXPERIMENTS, TOPICS, MATERIALS } = loadLabModule(join(dirname(labPath), 'curriculum.js'));
const { resolveAccent, hexToHsl, colorAtHue, accentForeground } = loadLabModule(join(dirname(labPath), 'visualTheme.js'));

async function mount(options = {}) {
  const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: 'http://localhost/lab', pretendToBeVisual: true });
  const keys = ['window', 'document', 'navigator', 'IS_REACT_ACT_ENVIRONMENT'];
  const descriptors = keys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]);
  for (const [key, value] of Object.entries({ window: dom.window, document: dom.window.document, navigator: dom.window.navigator, IS_REACT_ACT_ENVIRONMENT: true })) {
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  let copied = '';
  Object.defineProperty(dom.window.navigator, 'clipboard', { configurable: true, value: { writeText: async text => {
    if (options.copyFails) throw new Error('Clipboard permission denied');
    copied = text;
  } } });
  const { createRoot } = require('react-dom/client');
  const root = createRoot(dom.window.document.getElementById('root'));
  await act(async () => {
    root.render(createElement(Lab, { initialPromptLanguage: options.language || 'mixed' }));
  });
  await act(async () => { await new Promise(resolve => dom.window.requestAnimationFrame(resolve)); });
  const d = dom.window.document;
  return {
    d, dom,
    prompt: () => d.querySelector('.lab-inspector .whitespace-pre-wrap').textContent,
    copied: () => copied,
    async select(selector, value) {
      const node = d.querySelector(selector);
      assert.ok(node, 'Missing select: ' + selector);
      await act(async () => { node.value = value; node.dispatchEvent(new dom.window.Event('change', { bubbles: true })); });
    },
    async fill(selector, value) {
      const node = d.querySelector(selector);
      assert.ok(node, 'Missing input: ' + selector);
      const proto = node.tagName === 'TEXTAREA' ? dom.window.HTMLTextAreaElement.prototype : dom.window.HTMLInputElement.prototype;
      await act(async () => {
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(node, value);
        node.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
      });
    },
    async lesson(id) {
      const item = EXPERIMENTS.find(entry => entry.id === id);
      const previousMode = [...d.querySelectorAll('.lab-inspector button[aria-pressed="true"]')]
        .find(node => ['中英结构版', '纯英专业版'].includes(node.textContent))?.textContent || '中英结构版';
      await this.click('部位词典表');
      await this.fill('[aria-label="查找部位词典"]', item.title);
      const entry = d.querySelector(`[data-knowledge="${id}"]`);
      assert.ok(entry, 'Missing glossary example: ' + id);
      await act(async () => entry.click());
      await this.click(previousMode);
      const details = d.querySelector('.study-explanation');
      if (!details.open) await act(async () => details.querySelector('summary').click());
      assert.ok(d.querySelector(`[data-lesson="${id}"]`), 'Selected comparison should match the glossary region');
    },
    async click(text) {
      const button = [...d.querySelectorAll('button')].find(el => el.textContent.includes(text));
      assert.ok(button, 'Missing button: ' + text);
      await act(async () => button.click());
    },
    async close() {
      await act(async () => root.unmount());
      dom.window.close();
      for (const [key, descriptor] of descriptors) {
        if (descriptor) Object.defineProperty(globalThis, key, descriptor);
        else delete globalThis[key];
      }
    },
  };
}

test('all original presets update the preview, physical parameters and generated prompt together', async () => {
  const p = await mount();
  try {
    for (const [name, word, stiffness, dark] of [
      ['Linear 极客暗黑风', 'shadcn/ui', '260', 'true'],
      ['Gumroad 新粗野主义', 'Split-Screen Hero', '400', 'false'],
      ['AntD 企业级工作台', 'Sidebar + Main Workspace', '200', 'false'],
      ['Apple 柔和毛玻璃', 'Material UI', '180', 'false'],
    ]) {
      await p.click(name);
      assert.ok(p.prompt().includes(word));
      assert.equal(p.d.querySelector('[aria-label="弹簧刚度"]').value, stiffness);
      assert.equal(p.d.querySelector('[data-preview-page]').getAttribute('data-dark'), dark);
      const motion = p.d.querySelector('[data-preview-page]').getAttribute('data-study-motion');
      assert.ok(['fade', 'lift'].includes(motion));
      assert.match(p.d.querySelector('.study-product-nav').style.animation, motion === 'fade' ? /studyFade/ : /labEnter/);
    }
  } finally { await p.close(); }
});

test('anatomy selection and styling preserve the selected preview tab and open FAQ', async () => {
  const p = await mount();
  try {
    await p.click('表单控件');
    const input = p.d.querySelector('.demo-input');
    await p.click('什么是毛玻璃');
    const answer = '毛玻璃使用半透明底色';
    assert.ok(p.d.querySelector('.lab-preview').textContent.includes(answer));
    const navbar = p.d.querySelector('[data-anatomy="navbar"]');
    await act(async () => navbar.dispatchEvent(new p.dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true })));
    assert.equal(p.d.querySelector('.lab-anatomy h2').textContent, '顶部粘性导航栏');
    assert.equal(p.d.querySelector('.demo-input'), input);
    await p.click('纯净实色');
    assert.equal(p.d.querySelector('.demo-input'), input);
    assert.ok(p.d.querySelector('.lab-preview').textContent.includes(answer));
    assert.ok(p.prompt().includes('Plain Solid'));
  } finally { await p.close(); }
});

test('the reference style panel controls appearance while region comparisons stay contextual', async () => {
  const p = await mount();
  try {
    assert.deepEqual([...p.d.querySelectorAll('.lab-settings .setting-section-title > span')].map(node => node.textContent),
      ['经典风格预设', '页面布局', '组件与视觉', '动效与物理参数']);
    assert.equal(p.d.querySelector('.lab-settings [data-lesson]'), null);
    assert.equal(p.d.querySelector('.study-toolbar [aria-label="实验设置对照"]'), null);
    const viewport = p.d.querySelector('.study-preview-scroll');
    viewport.scrollTop = 325;
    const hero = p.d.querySelector('.demo-hero');
    await p.click('Ant Design');
    assert.equal(viewport.scrollTop, 325, 'visual choices must not navigate to another experiment');
    assert.equal(p.d.querySelector('.demo-hero'), hero);
    await p.lesson('validation');
    assert.equal(p.d.querySelectorAll('[data-lesson]').length, 1);
    assert.ok(p.d.querySelector('.lab-inspector [data-lesson="validation"]'));
    assert.equal(p.d.querySelector('#study-panel-practice').hidden, false);
    const input = p.d.querySelector('#study-project-name');
    await p.fill('#study-project-name', '保留当前组件');
    await p.click('离开字段时检查');
    assert.equal(p.d.querySelector('#study-project-name'), input);
    assert.equal(input.value, '保留当前组件');
    assert.equal(p.d.querySelector('.study-task h4').textContent, '用材料生成练习', 'the ordinary practice page should present the generation task directly');
    assert.equal(p.d.querySelector('.study-task-actions').parentElement, p.d.querySelector('.study-task-composer'));
  } finally { await p.close(); }
});

test('custom color and hue changes update the canvas and brief while retaining form drafts', async () => {
  const p = await mount();
  try {
    await p.lesson('validation');
    await p.fill('#study-project-name', '自己的配色实验');
    await p.fill('[aria-label="自定义主色"]', '#b7357e');
    assert.equal(p.d.querySelector('[data-preview-page]').style.getPropertyValue('--study-accent'), '#b7357e');
    assert.ok(p.prompt().includes('#b7357e'));
    assert.equal(p.d.querySelectorAll('.setting-swatches [aria-pressed="true"]').length, 0);
    await p.fill('[aria-label="主色色相"]', '200');
    const changed = p.d.querySelector('[aria-label="自定义主色"]').value;
    assert.equal(hexToHsl(changed).h, 200);
    assert.equal(p.d.querySelector('[data-preview-page]').style.getPropertyValue('--study-accent'), changed);
    assert.ok(p.prompt().includes(changed));
    for (const library of ['shadcn/ui', 'Ant Design', 'Material UI']) {
      await p.click(library);
      for (const finish of ['毛玻璃透光', '纯净实色', '波普硬阴影', '柔和弥散渐变']) {
        await p.click(finish);
        assert.equal(p.d.querySelector('[aria-label="自定义主色"]').value, changed);
        assert.equal(p.d.querySelector('#study-project-name').value, '自己的配色实验');
      }
    }
    await p.click('纯英专业版');
    assert.ok(p.prompt().includes(`accent: ${changed}`));
    assert.ok(p.prompt().includes('retain the selected control geometry and spacing'));
    await p.click('AntD 企业级工作台');
    assert.equal(p.d.querySelector('[aria-label="自定义主色"]').value, '#2563eb');
    assert.ok(p.prompt().includes('#2563eb'));
  } finally { await p.close(); }
});

test('color math preserves saturation and lightness and handles achromatic custom colors', () => {
  assert.equal(resolveAccent({ themeColor: 'custom', customColor: 'invalid' }), '#4f46e5');
  assert.equal(resolveAccent({ themeColor: 'custom', customColor: '#ABCDEF' }), '#abcdef');
  for (const hex of ['#b7357e', '#059669', '#2563eb']) {
    const before = hexToHsl(hex), after = hexToHsl(colorAtHue(hex, 180));
    assert.ok(Math.abs(before.s - after.s) < .01);
    assert.ok(Math.abs(before.l - after.l) < .01);
  }
  assert.equal(hexToHsl(colorAtHue('#808080', 240)).h, 240);
  assert.equal(accentForeground('#ffffff'), '#000000');
  assert.equal(accentForeground('#000000'), '#ffffff');
});

test('optional skeleton and toast appear in both preview and page prompt', async () => {
  const p = await mount();
  try {
    for (const [label, region, word] of [['展示骨架屏', 'skeletonCard', 'Skeleton Loader'], ['展示轻提示', 'toastPreview', 'Toast Notification']]) {
      const checkbox = [...p.d.querySelectorAll('label')].find(el => el.textContent.includes(label)).querySelector('input');
      await act(async () => checkbox.click());
      assert.ok(p.d.querySelector(`[data-anatomy="${region}"]`));
      assert.ok(p.prompt().includes(word));
    }
  } finally { await p.close(); }
});

test('English entry, glossary and clipboard success retain the original prompt modes', async () => {
  const p = await mount({ language: 'en' });
  try {
    assert.ok(p.prompt().startsWith('# Page brief'));
    await p.click('部位词典表');
    assert.equal(p.d.querySelectorAll('[data-knowledge]').length, 34);
    await p.click('中英结构版');
    await p.click('复制整页需求');
    assert.equal(p.copied(), p.prompt());
    assert.ok(p.d.querySelector('.lab-inspector').textContent.includes('已复制到剪贴板'));
  } finally { await p.close(); }
});

test('clipboard rejection offers the complete selected text without reporting success', async () => {
  const p = await mount({ copyFails: true });
  try {
    await p.click('复制整页需求');
    const text = p.d.querySelector('.lab-copy-error textarea');
    assert.equal(text.value, p.prompt());
    assert.equal(p.d.activeElement, text);
    assert.equal(text.selectionEnd, text.value.length);
    assert.equal(p.d.querySelector('.lab-inspector').textContent.includes('已复制到剪贴板'), false);
  } finally { await p.close(); }
});

test('all 24 experiments expose usable choices, rules and an accurate adjustment brief', async () => {
  const p = await mount();
  try {
    assert.equal(TOPICS.length, 6);
    assert.equal(EXPERIMENTS.length, 24);
    const navbar = p.d.querySelector('.study-product-nav'), hero = p.d.querySelector('.demo-hero');
    await p.select('[aria-label="提示词输出范围"]', 'change');
    for (const item of EXPERIMENTS) {
      await p.lesson(item.id);
      assert.equal(p.d.querySelector('[data-lesson][aria-current]').dataset.lesson, item.id);
      assert.equal(p.d.querySelector('.study-product-nav'), navbar, 'experiments must retain the preset navigation');
      assert.equal(p.d.querySelector('.demo-hero'), hero, 'experiments must retain the preset hero');
      for (const choice of item.options) {
        const button = [...p.d.querySelectorAll(`[data-lesson="${item.id}"] button`)].find(node => node.textContent.startsWith(choice.label));
        await act(async () => button.click());
        assert.equal(button.getAttribute('aria-pressed'), 'true');
        assert.ok(p.prompt().includes(choice.request), `${item.id}/${choice.value} should describe its actual decision`);
      }
      assert.ok(p.d.querySelector('.study-explanation').textContent.includes(item.difference));
    }
  } finally { await p.close(); }
});

test('collection searches, filters, sorts, paginates and retains its selected source', async () => {
  const p = await mount();
  try {
    await p.lesson('filter');
    await p.fill('[aria-label="搜索项目资料"]', '不存在的项目');
    assert.ok(p.d.querySelector('.study-empty').textContent.includes('没有找到匹配内容'));
    await p.click('清除筛选条件');
    await p.select('[aria-label="资料分类"]', '设计');
    assert.equal(p.d.querySelectorAll('.study-project-card').length, 2);
    await p.click('清除筛选条件');
    await p.select('[aria-label="资料排序"]', 'oldest');
    assert.equal(p.d.querySelector('.study-project-card h4').textContent, '光与材料');
    await p.click('下一页');
    assert.ok(p.d.querySelector('.study-pagination').textContent.includes('第 2 / 2 页'));
    const selectedTitle = p.d.querySelector('.study-project-card h4').textContent;
    await p.click('选择这份资料');
    assert.ok(p.d.querySelector('.study-selected-source').textContent.includes(selectedTitle));
    await p.lesson('collection');
    await p.click('字段表格');
    assert.equal(p.d.querySelectorAll('tbody tr').length, 3);
    assert.ok(p.d.querySelector('.study-selected-source').textContent.includes(selectedTitle));
    await p.lesson('pagination');
    await p.click('加载更多');
    await p.click('加载更多资料');
    assert.equal(p.d.querySelectorAll('tbody tr').length, MATERIALS.length);
    assert.ok(p.d.querySelector('.study-pagination button').disabled);
  } finally { await p.close(); }
});

test('one preset website retains its header, hero and drafts across section and directory changes', async () => {
  const p = await mount();
  try {
    const navbar = p.d.querySelector('.study-product-nav'), hero = p.d.querySelector('.demo-hero');
    await p.click('Get Started');
    assert.equal(p.d.querySelector('#study-panel-practice').hidden, false);
    const input = p.d.querySelector('#study-project-name');
    await p.fill('#study-project-name', '同一个网页里的项目');
    await p.lesson('filter');
    await p.fill('[aria-label="搜索项目资料"]', '阅读');
    await p.lesson('sidebar');
    await p.click('顶部目录');
    assert.equal(p.d.querySelector('.study-site-layout').dataset.sidebar, 'inline');
    assert.equal(p.d.querySelector('.study-site-layout').dataset.layout, 'dashboard');
    for (const preset of ['Linear 极客暗黑风', 'Gumroad 新粗野主义', 'AntD 企业级工作台', 'Apple 柔和毛玻璃']) {
      await p.click(preset);
      assert.equal(p.d.querySelector('.study-product-nav'), navbar);
      assert.equal(p.d.querySelector('.demo-hero'), hero);
      assert.equal(p.d.querySelector('#study-project-name'), input);
      assert.equal(input.value, '同一个网页里的项目');
      assert.equal(p.d.querySelector('[aria-label="搜索项目资料"]').value, '阅读');
    }
    await p.lesson('responsive');
    await p.click('主任务优先');
    const canvas = p.d.querySelector('[data-preview-page]');
    Object.defineProperty(canvas, 'offsetWidth', { configurable: true, value: 390 });
    Object.defineProperty(canvas, 'clientWidth', { configurable: true, value: 390 });
    await act(async () => p.dom.window.dispatchEvent(new p.dom.window.Event('resize')));
    assert.ok(p.d.querySelector('.study-site-layout').firstElementChild.classList.contains('study-product-main'));
    await p.click('材料优先');
    assert.ok(p.d.querySelector('.study-site-layout').firstElementChild.classList.contains('study-site-directory-region'));
    assert.equal(p.d.querySelector('#study-project-name'), input);
    assert.equal(input.value, '同一个网页里的项目');
  } finally { await p.close(); }
});

test('form validation, comparison and visual edits retain drafts and return focus to the error', async t => {
  const p = await mount();
  try {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    await p.lesson('validation');
    await act(async () => p.d.querySelector('.study-project-form').dispatchEvent(new p.dom.window.Event('submit', { bubbles: true, cancelable: true })));
    assert.equal(p.d.activeElement.id, 'study-project-name');
    assert.equal(p.d.querySelectorAll('.study-project-form [aria-invalid="true"]').length, 2);
    await p.fill('#study-project-name', '自己的原型');
    await p.fill('#study-project-url', 'https://example.com/prototype');
    await p.click('离开字段时检查');
    await act(async () => p.d.querySelector('.setting-motion-switch input').click());
    await p.click('修改前');
    assert.equal(p.d.querySelector('#study-project-name').value, '自己的原型');
    assert.ok(p.prompt().includes('提交时检查项目名称与链接'));
    assert.equal(p.d.querySelector('[data-preview-page]').dataset.studyMotion, 'none', 'a region comparison must not undo the global motion choice');
    await p.click('修改后');
    assert.ok(p.prompt().includes('离开已填写的字段时提供校验反馈'));
    await p.click('Linear 极客暗黑风');
    assert.equal(p.d.querySelector('#study-project-url').value, 'https://example.com/prototype');
    await p.click('保存项目');
    assert.ok(p.d.querySelector('.study-project-form button[type="submit"]').disabled);
    await act(async () => t.mock.timers.tick(450));
    assert.ok(p.d.querySelector('.study-save-status').textContent.includes('本页示例已保存'));
    await p.select('[aria-label="画布宽度"]', '390');
    assert.equal(p.d.querySelector('[data-preview-page]').style.width, '390px');
    await p.click('75%');
    assert.equal(p.d.querySelector('[data-preview-page]').style.width, '390px');
    assert.equal(p.d.querySelector('#study-project-name').value, '自己的原型');
  } finally { t.mock.timers.reset(); await p.close(); }
});

test('selection controls, searchable combobox and keyboard tabs represent different decisions', async () => {
  const p = await mount();
  try {
    await p.lesson('choice');
    await act(async () => p.d.querySelector('input[type="radio"][value="对照题"]').click());
    assert.ok(p.d.querySelector('.study-choice').textContent.includes('已选：对照题'));
    await p.click('多选题型');
    await act(async () => p.d.querySelector('input[type="checkbox"][value="追问题"]').click());
    assert.ok(p.d.querySelector('.study-choice').textContent.includes('理解题、追问题'));
    await p.click('即时设置开关');
    await act(async () => p.d.querySelector('[role="switch"]').click());
    assert.equal(p.d.querySelector('.study-choice > p'), null);
    await p.lesson('combobox');
    await p.click('输入后查找');
    await p.fill('[role="combobox"]', '空间');
    assert.equal(p.d.querySelectorAll('[role="option"]').length, 1);
    await act(async () => p.d.querySelector('[role="combobox"]').dispatchEvent(new p.dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true })));
    assert.ok(p.d.querySelector('.study-combobox > small').textContent.includes('空间与日常'));
    await p.lesson('tabs');
    const tab = p.d.querySelector('[role="tab"][aria-selected="true"]');
    await act(async () => tab.dispatchEvent(new p.dom.window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })));
    assert.equal(p.d.activeElement.id, 'study-tab-reading');
    assert.equal(p.d.querySelector('#study-panel-reading').hidden, false);
    assert.equal(p.d.querySelector('#study-panel-projects').hidden, true);
  } finally { await p.close(); }
});

test('stream pause, cancellation and failed-task retry stop stale updates and retain input', async t => {
  const p = await mount();
  try {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    await p.lesson('stream');
    await p.fill('#study-material', '这是我自己的材料，用于核对原始输入是否保留。');
    await p.click('生成练习');
    await act(async () => t.mock.timers.tick(650));
    assert.equal(p.d.querySelectorAll('.study-output-chunk').length, 1);
    await p.click('暂停生成');
    await act(async () => t.mock.timers.tick(4000));
    assert.equal(p.d.querySelectorAll('.study-output-chunk').length, 1);
    await p.click('继续生成');
    await act(async () => t.mock.timers.tick(650));
    assert.equal(p.d.querySelectorAll('.study-output-chunk').length, 2);
    await p.click('取消任务');
    await act(async () => t.mock.timers.tick(4000));
    assert.equal(p.d.querySelectorAll('.study-output-chunk').length, 2);
    assert.ok(p.d.querySelector('.study-task-result').textContent.includes('尚未完成'));
    await p.lesson('recovery');
    await p.click('保留部分结果');
    await p.click('生成练习');
    await act(async () => t.mock.timers.tick(650));
    await act(async () => t.mock.timers.tick(650));
    assert.equal(p.d.querySelectorAll('.study-output-chunk').length, 2);
    assert.ok(p.d.querySelector('.study-task-result').textContent.includes('本次处理失败'));
    await p.click('重试本次任务');
    for (let i = 0; i < 3; i++) await act(async () => t.mock.timers.tick(650));
    assert.equal(p.d.querySelectorAll('.study-output-chunk').length, 3);
    assert.ok(p.d.querySelector('.study-task-result').textContent.includes('本次处理完成'));
    assert.equal(p.d.querySelector('#study-material').value, '这是我自己的材料，用于核对原始输入是否保留。');
    await p.lesson('stream');
    await p.click('完成后显示');
    await p.click('生成练习');
    await act(async () => t.mock.timers.tick(650));
    assert.equal(p.d.querySelectorAll('.study-output-chunk').length, 0);
    await p.click('取消任务');
    await act(async () => t.mock.timers.tick(4000));
    assert.equal(p.d.querySelectorAll('.study-output-chunk').length, 0);
  } finally { t.mock.timers.reset(); await p.close(); }
});

test('page, region and adjustment scopes stay distinct and technology is opt-in', async () => {
  const p = await mount();
  try {
    assert.ok(p.prompt().includes('项目资料、阅读笔记与练习工作台'));
    assert.equal(p.prompt().includes('输入与表单校验:'), false, 'the initial page brief should not enumerate every unselected experiment');
    assert.ok(p.prompt().includes('保持同一个完整网页'));
    assert.equal(p.d.querySelector('[aria-label="页面场景"]'), null);
    assert.equal(p.prompt().includes('Framer Motion'), false);
    await p.select('[aria-label="提示词输出范围"]', 'part');
    assert.ok(p.prompt().startsWith('# 当前部位'));
    await p.select('[aria-label="提示词输出范围"]', 'change');
    assert.ok(p.prompt().includes('本轮只调整'));
    const technical = p.d.querySelector('.study-prompt-options input[type="checkbox"]');
    await act(async () => technical.click());
    assert.ok(p.prompt().includes('CSS 近似预览'));
    await p.click('纯英专业版');
    assert.ok(p.prompt().startsWith('# Current adjustment'));
    assert.equal(/[\u3400-\u9fff]/u.test(p.prompt()), false);
  } finally { await p.close(); }
});
