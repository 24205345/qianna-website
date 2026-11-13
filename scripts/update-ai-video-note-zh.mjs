/**
 * Publish the complete bilingual VidGrab note. Default is a read-only plan.
 * node scripts/sync-ai-video-note.mjs
 * node scripts/update-ai-video-note-zh.mjs [--apply] [--expected-updated-at <timestamp>]
 * No initialization, table recreation, workflow reset, or media upload.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
const root = fileURLToPath(new URL('../', import.meta.url));
const sync = spawnSync(process.execPath, [join(root, 'scripts/sync-ai-video-note.mjs'), '--check'], { encoding: 'utf8' });
if (sync.status !== 0) throw new Error(sync.stderr || 'Local source check failed');
process.loadEnvFile(join(root, '.env.local'));
if (new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname !== 'aqsdwfocoocnzyxopvvg.supabase.co') throw new Error('Unexpected CMS project');
const note = JSON.parse(readFileSync(join(root, 'app/_data/ai-video-note.json'), 'utf8'));
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, options);
try {
  const { data: auth, error: ae } = await client.auth.signInWithPassword({ email: process.env.SUPABASE_ADMIN_EMAIL, password: process.env.SUPABASE_ADMIN_PASSWORD });
  if (ae || auth.user?.is_anonymous || auth.user?.app_metadata?.cms_role !== 'admin') throw new Error('CMS administrator authorization failed');
  const { data: current, error: re } = await client.from('notes').select('*').eq('slug', note.slug).single();
  if (re || !current.updated_at) throw new Error('Existing note read failed');
  const patch = { title: note.titleZh, title_en: note.titleEn, excerpt: note.excerptZh, excerpt_en: note.excerptEn, body_markdown: note.bodyMarkdownZh, body_markdown_en: note.bodyMarkdownEn, tags: note.tags };
  const changed = Object.keys(patch).filter(key => !isDeepStrictEqual(patch[key], current[key]));
  const expectedIndex = process.argv.indexOf('--expected-updated-at');
  const expected = expectedIndex === -1 ? undefined : process.argv[expectedIndex + 1];
  if (expectedIndex !== -1 && (!expected || expected !== current.updated_at)) throw new Error('CMS changed since the reviewed snapshot; refresh the plan');
  console.log(JSON.stringify({ slug: note.slug, updated_at: current.updated_at, changedFields: changed, mode: process.argv.includes('--apply') ? 'apply' : 'read-only plan' }));
  if (!process.argv.includes('--apply') || changed.length === 0) process.exitCode = 0;
  else {
    const dir = join(tmpdir(), 'qianna-video-note-publications'); mkdirSync(dir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const log = { readAt: new Date().toISOString(), before: current, patch, saved: false };
    const file = join(dir, stamp + '.json');
    writeFileSync(file, JSON.stringify(log, null, 2));
    const { data: updated, error: we } = await client.from('notes').update(patch).eq('id', current.id).eq('updated_at', current.updated_at).select('id,updated_at').single();
    if (we) throw new Error('Publication failed or concurrent edit detected: ' + we.message);
    log.saved = true; log.result = updated; writeFileSync(file, JSON.stringify(log, null, 2));
    const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, options);
    const { data: verified, error: ve } = await anon.from('notes').select('*').eq('id', current.id).single();
    if (ve) throw new Error('Anonymous readback failed after publication');
    for (const [key, value] of Object.entries(patch)) if (!isDeepStrictEqual(verified[key], value)) throw new Error('Published field mismatch: ' + key);
    for (const [key, value] of Object.entries(current)) if (!(key in patch) && key !== 'updated_at' && !isDeepStrictEqual(verified[key], value)) throw new Error('Unexpected metadata change: ' + key);
    log.verifiedAt = new Date().toISOString(); writeFileSync(file, JSON.stringify(log, null, 2));
    console.log('Published and anonymously verified both languages; slug, original publication date, status, cover, and other metadata preserved.');
  }
} finally { await client.auth.signOut(); }
