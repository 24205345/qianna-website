/** Sync the portfolio case study locally. Never writes to CMS or uploads media. */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
export function syncPortfolioNote({ check = false } = {}) {
function source(lang) {
  const text = readFileSync(new URL(`docs/notes/building-qianna-portfolio.${lang}.md`, root), 'utf8').replace(/\r\n/g, '\n');
  const match = /^# (.+)\n+([\s\S]+)$/.exec(text);
  if (!match) throw Error(`Missing title: ${lang}`);
  if ((text.match(/^```/gm) || []).length % 2) throw Error(`Unclosed code fence: ${lang}`);
  if (/^# /m.test(match[2])) throw Error(`Duplicate main title: ${lang}`);
  return { title: match[1], body: match[2].trim(), sections: text.match(/^## .+$/gm) || [] };
}
const zh = source('zh'), en = source('en');
if (zh.sections.length !== 12 || en.sections.length !== 12) throw Error('The approved revision has 12 main sections in each language');
for (const lang of ['zh', 'en']) {
  const text = readFileSync(new URL(`docs/notes/building-qianna-portfolio.${lang}.md`, root), 'utf8');
  if ((text.match(/^### /gm) || []).length !== 35) throw Error(`Expected 35 subsections: ${lang}`);
  if ((text.match(/^```prompt/gm) || []).length !== 2) throw Error(`Expected two localized prompts: ${lang}`);
  for (const reference of ['Awwwards', 'Godly', 'siteInspire', 'Behance', 'Dribbble', 'Readymag', 'Cargo', 'Mobbin']) {
    if (!text.includes(reference)) throw Error(`Missing reference: ${lang} / ${reference}`);
  }
}
const excerptZh = '从静态展示起步，分享如何确定个人网站的内容与风格、借助 AI 逐步搭建，再按实际需要增加后台、文件存储与日常维护。';
const excerptEn = 'Starting with a simple showcase: choosing content and style, building with AI, and adding editing, file storage, and maintenance as real needs emerge.';
const note = {
  slug: 'building-qianna-portfolio', title: en.title, excerpt: excerptEn,
  publishedAt: '2026-08-13T09:32:39.148+00:00',
  tags: ['portfolio', 'nextjs', 'supabase', 'vercel', 'cms', 'seo', 'architecture'],
  titleZh: zh.title, titleEn: en.title, excerptZh, excerptEn,
  bodyMarkdownZh: zh.body, bodyMarkdownEn: en.body, coverImageUrl: null,
};
const path = new URL('app/_data/portfolio-note.json', root);
const expected = JSON.stringify(note, null, 2) + '\n';
let current;
try { current = readFileSync(path, 'utf8'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
if (current !== expected) {
  if (check) throw Error('Portfolio note fallback differs from its Markdown sources');
  writeFileSync(path, expected);
}
console.log(check ? 'Portfolio note: bilingual sources and fallback agree; 12 main sections, 35 subsections, two localized prompts, and all eight references per language.' : 'Synced bilingual portfolio note locally; CMS and deployment untouched.');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  syncPortfolioNote({ check: process.argv.includes('--check') });
}
