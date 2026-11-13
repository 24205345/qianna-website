/** Behavior checks for the copied React lab; layout is checked in a real browser.
 * Uses the same external jsdom directory as ui-prototype-lab.test.mjs.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const require = createRequire(import.meta.url);
const testRequire = createRequire(join(process.env.UI_LAB_TEST_MODULES || join(tmpdir(), 'qianna-ui-lab-tests'), 'package.json'));
const { JSDOM } = testRequire('jsdom');
const { createElement, act } = require('react');
const ts = require('typescript');
const source = readFileSync(new URL('../app/notes/ui-prototype-ergonomics/interface-lab/FrontendPromptLab.jsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const componentModule = { exports: {} };
new Function('require', 'module', 'exports', compiled)(require, componentModule, componentModule.exports);
const Lab = componentModule.exports.default;

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
  await act(async () => root.render(createElement(Lab, { initialPromptLanguage: options.language || 'mixed' })));
  const d = dom.window.document;
  return {
    d, dom,
    prompt: () => d.querySelector('.lab-inspector .whitespace-pre-wrap').textContent,
    copied: () => copied,
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
    }
  } finally { await p.close(); }
});

test('anatomy selection and styling preserve the selected preview tab and open FAQ', async () => {
  const p = await mount();
  try {
    await p.click('表单控件');
    const input = p.d.querySelector('.lab-preview input');
    await p.click('什么是毛玻璃');
    const answer = '毛玻璃使用半透明底色';
    assert.ok(p.d.querySelector('.lab-preview').textContent.includes(answer));
    const navbar = p.d.querySelector('[data-anatomy="navbar"]');
    await act(async () => navbar.dispatchEvent(new p.dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true })));
    assert.equal(p.d.querySelector('.lab-anatomy h2').textContent, '顶部粘性导航栏');
    assert.equal(p.d.querySelector('.lab-preview input'), input);
    await p.click('瑞士极简留白');
    assert.equal(p.d.querySelector('.lab-preview input'), input);
    assert.ok(p.d.querySelector('.lab-preview').textContent.includes(answer));
    assert.ok(p.prompt().includes('Swiss Minimalist'));
  } finally { await p.close(); }
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
    assert.ok(p.prompt().startsWith('### Role & Tech Stack'));
    await p.click('部位词典表');
    assert.equal(p.d.querySelectorAll('.lab-inspector code').length, 10);
    await p.click('中英结构版');
    await p.click('一键复制整页');
    assert.equal(p.copied(), p.prompt());
    assert.ok(p.d.querySelector('.lab-inspector').textContent.includes('已复制到剪贴板'));
  } finally { await p.close(); }
});

test('clipboard rejection offers the complete selected text without reporting success', async () => {
  const p = await mount({ copyFails: true });
  try {
    await p.click('一键复制整页');
    const text = p.d.querySelector('.lab-copy-error textarea');
    assert.equal(text.value, p.prompt());
    assert.equal(p.d.activeElement, text);
    assert.equal(text.selectionEnd, text.value.length);
    assert.equal(p.d.querySelector('.lab-inspector').textContent.includes('已复制到剪贴板'), false);
  } finally { await p.close(); }
});
