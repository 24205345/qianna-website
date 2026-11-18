/** Generate chapter 05 local content only. Never uploads assets or writes CMS. */
import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const check = process.argv.includes('--check');
function output(relative, value) {
  const file = new URL(relative, root);
  let current;
  try { current = readFileSync(file, 'utf8'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  if (current === value) return;
  if (check) throw new Error(`Stale chapter 05 output: ${relative}`);
  writeFileSync(file, value, 'utf8');
}
const figures = JSON.parse(readFileSync(new URL('docs/diagrams/workbench/manifest.json', root), 'utf8')).figures;
function source(lang) {
  const file = `docs/notes/feature-build-scaling.${lang}.md`;
  const original = readFileSync(new URL(file, root), 'utf8').replace(/\r\n/g, '\n');
  const text = original.replace(/<!-- figure:(build-[a-z-]+) -->[\s\S]*?<!-- \/figure:\1 -->|<!-- figure:(build-[a-z-]+) -->/g, (_, existing, fresh) => {
    const id = existing || fresh;
    const f = figures.find(item => item.id === id && item.lang === lang);
    if (!f) throw new Error(`Missing figure: ${id}.${lang}`);
    const label = lang === 'zh' ? '查看原图' : 'View full-size';
    return `<!-- figure:${id} -->\n\n[![${f.title} — ${f.caption}](${f.url})](${f.url})\n\n*${f.caption} [${label}](${f.url})*\n\n<!-- /figure:${id} -->`;
  });
  output(file, text);
  const match = /^# (.+)\n+([\s\S]+)$/.exec(text);
  if (!match) throw new Error(`Missing title: ${lang}`);
  return { title: match[1], body: match[2].replace(/^<!-- \/?figure:[a-z-]+ -->\n*/gm, '').trim() };
}
const zh = source('zh'), en = source('en');
const excerptZh = '先说清这次做什么，提交已有代码后再开发；让 AI 自测，再亲自试用，遇到报错就反馈修复。能用了，再加功能、解决多人使用时的问题。';
const excerptEn = 'Choose the scope and commit existing code before development. Let AI test, try it yourself, and send errors back for repair. Then extend it and address growing demand.';
output('app/_data/feature-build-note.json', JSON.stringify({
  slug: 'feature-build-scaling', title: en.title, excerpt: excerptEn,
  publishedAt: '2026-11-18T00:00:00.000Z',
  tags: ['AI Development', 'MVP', 'Testing', 'Scaling'],
  titleZh: zh.title, titleEn: en.title, excerptZh, excerptEn,
  bodyMarkdownZh: zh.body, bodyMarkdownEn: en.body, coverImageUrl: null,
}, null, 2) + '\n');
const stagePath = 'app/_data/feature-build-stage.json';
const existing = JSON.parse(readFileSync(new URL(stagePath, root), 'utf8'));
const prompts = [...en.body.matchAll(/```prompt\n([\s\S]*?)\n```/g)].map(m => m[1]);
if (prompts.length !== 5) throw new Error('Expected five chapter prompts');
const cards = [
  ['prompt-build-mvp', 'Build a Verifiable MVP', 'MVP Development', 0, 'Turn confirmed requirements, contracts, and prototype states into small implementation steps with explicit verification evidence.'],
  ['prompt-build-repair', 'Investigate a Manual Test Failure', 'Manual Verification', 2, 'Report reproduction steps, expected and actual behavior, and errors; require investigation, regression checks, and a manual retest.'],
  ['prompt-build-extend', 'Extend a Stable Practice Session', 'Feature Expansion', 3, 'Add one related practice question while preserving the original questions, answers, and source-review state.'],
  ['prompt-build-scale', 'Investigate a Scaling Bottleneck', 'Scaling Evidence', 4, 'Establish a reproducible load baseline, locate the delay, and compare a minimal improvement under equivalent conditions.'],
].map(([id, title, tag, index, description]) => ({ id, type: 'prompt', title, tag,
  description, content: prompts[index],
  curatorNote: 'Use the chapter acceptance conditions and report actual checks separately from assumptions.',
}));
output(stagePath, JSON.stringify({
  ...existing, title: 'Feature Build & Scaling', subtitle: 'Working MVP, Manual Verification & Incremental Growth',
  tools: ['Coding Agent', 'Git', 'TDD', 'Browser Testing', 'Load Measurement'],
  summary: excerptEn,
  keyTakeaway: 'Verify the core journey with automated checks and manual use, preserve a baseline, then extend behavior and capacity using measured evidence.',
  relatedNoteHref: '/notes/feature-build-scaling', relatedNoteLabel: `Read Note: ${en.title}`,
  resources: [...cards, ...existing.resources.filter(r => !cards.some(card => card.id === r.id))],
}, null, 2) + '\n');
console.log(check ? 'Chapter 05 sources, figures, fallback, and prompt cards agree.' : 'Synced chapter 05 local sources and entries; CMS and deployment untouched.');
