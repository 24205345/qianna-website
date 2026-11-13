/** Generate the bilingual VidGrab fallback from Markdown. Never writes the CMS. */
import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
function source(lang) {
  const text = readFileSync(new URL(`docs/notes/ai-video-downloader-summarizer.${lang}.md`, root), 'utf8').replace(/\r\n/g, '\n');
  const match = /^# (.+)\n+([\s\S]+)$/.exec(text);
  if (!match) throw new Error('Missing source title: ' + lang);
  return { title: match[1], body: match[2].trim() };
}
const zh = source('zh'), en = source('en');
const note = {
  slug: 'ai-video-downloader-summarizer', title: en.title,
  excerpt: 'A practical path from yt-dlp download to AI summary and Stripe membership—with reusable prompts and the decisions that keep the build on track.',
  publishedAt: '2026-07-23T15:24:05.351265+00:00',
  tags: ['AI', 'Cursor', 'yt-dlp', 'Stripe', 'FastAPI'],
  titleZh: zh.title, titleEn: en.title,
  excerptZh: '用 Cursor 做出「视频下载 + AI 总结 + Stripe 会员」的完整路径：提示词可复制，顺序可照做，并补齐从下载到支付的关键断点。',
  excerptEn: 'A practical path from yt-dlp download to AI summary and Stripe membership—with reusable prompts and the decisions that keep the build on track.',
  bodyMarkdownZh: zh.body, bodyMarkdownEn: en.body, coverImageUrl: null,
};
const file = new URL('app/_data/ai-video-note.json', root);
const next = JSON.stringify(note, null, 2) + '\n';
let old;
try { old = readFileSync(file, 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
if (process.argv.includes('--check')) {
  if (old !== next) throw new Error('VidGrab fallback is stale. Run node scripts/sync-ai-video-note.mjs');
  console.log('VidGrab fallback matches both Markdown sources.');
} else if (old !== next) {
  writeFileSync(file, next);
  console.log('Updated app/_data/ai-video-note.json');
} else console.log('VidGrab fallback is already up to date.');
