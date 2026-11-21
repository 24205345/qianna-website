/** Update only the existing portfolio article; default is a read-only comparison.
 * node --use-env-proxy scripts/publish-portfolio-note.mjs
 * node --use-env-proxy scripts/publish-portfolio-note.mjs --apply --expected-updated-at <timestamp>
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { syncPortfolioNote } from './sync-portfolio-note.mjs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual as equal } from 'node:util';
const root = fileURLToPath(new URL('../', import.meta.url));
syncPortfolioNote({ check: true });
process.loadEnvFile(join(root, '.env.local'));
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (new URL(url).hostname !== 'aqsdwfocoocnzyxopvvg.supabase.co') throw Error('Unexpected CMS project');
const options = { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(30000) }) } };
const anon = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, options);
const note = JSON.parse(readFileSync(join(root, 'app/_data/portfolio-note.json'), 'utf8'));
const patch = { title: note.titleZh, title_en: note.titleEn, excerpt: note.excerptZh, excerpt_en: note.excerptEn, body_markdown: note.bodyMarkdownZh, body_markdown_en: note.bodyMarkdownEn };
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const { data: before, error: re } = await anon.from('notes').select('*').eq('slug', note.slug).eq('status', 'published').single();
if (re || !before?.updated_at) throw Error('Existing published article read failed');
if (!equal(before.tags, note.tags) || before.published_at !== note.publishedAt || before.cover_image_url !== note.coverImageUrl) throw Error('Article metadata changed; update local source metadata first');
const changed = Object.keys(patch).filter(k => !equal(before[k], patch[k]));
const apply = process.argv.includes('--apply');
console.log(JSON.stringify({ mode: apply ? 'apply' : 'read-only comparison', slug: note.slug, updatedAt: before.updated_at, changedFields: changed, desiredHash: hash(patch) }));
if (apply && changed.length) {
  const i = process.argv.indexOf('--expected-updated-at');
  if (i < 0 || process.argv[i + 1] !== before.updated_at) throw Error('Expected timestamp is required and must match the reviewed article');
  const client = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, options);
  try {
    const { data: auth, error: ae } = await client.auth.signInWithPassword({ email: process.env.SUPABASE_ADMIN_EMAIL, password: process.env.SUPABASE_ADMIN_PASSWORD });
    if (ae || auth.user?.is_anonymous || auth.user?.app_metadata?.cms_role !== 'admin') throw Error('CMS administrator authorization failed');
    const dir = join(tmpdir(), 'qianna-portfolio-note-publications');
    mkdirSync(dir, { recursive: true });
    const path = join(dir, new Date().toISOString().replace(/[:.]/g, '-') + '.json');
    const log = { before, patch, desiredHash: hash(patch), saved: false };
    writeFileSync(path, JSON.stringify(log, null, 2));
    const { data: saved, error: we } = await client.from('notes').update(patch).eq('id', before.id).eq('slug', before.slug).eq('status', 'published').eq('updated_at', before.updated_at).select('id,updated_at').single();
    if (we) throw Error('Article update failed or concurrent edit detected: ' + we.message);
    log.saved = true; log.result = saved; writeFileSync(path, JSON.stringify(log, null, 2));
    const { data: after, error: ve } = await anon.from('notes').select('*').eq('id', before.id).single();
    if (ve) throw Error('Anonymous readback failed');
    for (const [k, v] of Object.entries(patch)) if (!equal(after[k], v)) throw Error('Published field mismatch: ' + k);
    for (const [k, v] of Object.entries(before)) if (!(k in patch) && k !== 'updated_at' && !equal(after[k], v)) throw Error('Unexpected metadata change: ' + k);
    log.verifiedAt = new Date().toISOString(); writeFileSync(path, JSON.stringify(log, null, 2));
    console.log(JSON.stringify({ published: true, slug: after.slug, updatedAt: after.updated_at, preservedMetadata: true, backup: path }));
  } finally { await client.auth.signOut({ scope: 'local' }); }
}
