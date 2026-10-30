import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { diagrams } from './catalog.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const manifest = JSON.parse(readFileSync(`${root}docs/diagrams/workbench/manifest.json`, 'utf8'));
const check = process.argv.includes('--check');
for (const lang of ['zh', 'en']) {
  const file = `${root}docs/notes/enterprise-ai-production.${lang}.md`;
  const current = readFileSync(file, 'utf8');
  let next = current;
  const expected = diagrams.filter(f => f.note === 'enterprise-ai-production' && f.article !== false);
  const figures = manifest.figures.filter(f => f.note === 'enterprise-ai-production' && f.lang === lang && expected.some(d => d.id === f.id));
  if (figures.length !== expected.length || expected.some(d => !figures.some(f => f.id === d.id))) {
    throw new Error(`Missing or unexpected ${lang} production figures`);
  }
  for (const figure of figures) {
    const pattern = new RegExp(`\\[!\\[[^\\n]*\\]\\([^\\n]*\\/${figure.id}\\.${lang}-[a-f0-9]+\\.webp\\)\\]\\([^\\n]*\\)\\r?\\n\\r?\\n\\*[^\\n]*\\*`, 'g');
    if ([...next.matchAll(pattern)].length !== 1) {
      throw new Error(`Missing or duplicate figure block: ${lang}/${figure.id}`);
    }
    const original = lang === 'zh' ? '查看原图' : 'View full-size';
    const block = `[![${figure.title} — ${figure.caption}](${figure.url})](${figure.url})\n\n*${figure.caption} [${original}](${figure.url})*`;
    next = next.replace(pattern, () => block);
  }
  if (next !== current) {
    if (check) throw new Error(`Figure references need syncing: ${file}`);
    writeFileSync(file, next);
  }
}
console.log(check ? 'Production figure references are in sync.' : 'Synced bilingual production figure references.');
