/** Chapter 05 only. Default backs up CMS and prepares a plan in TEMP.
 * --apply --plan <path> applies the unchanged plan with updated_at protection.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { isDeepStrictEqual as equal } from 'node:util';
const slug = 'feature-build-scaling';
const note = JSON.parse(readFileSync('app/_data/feature-build-note.json', 'utf8'));
const localStage = JSON.parse(readFileSync('app/_data/feature-build-stage.json', 'utf8'));
const assets = JSON.parse(readFileSync(`docs/notes/${slug}.assets.json`, 'utf8')).assets;
if (assets.length !== 6 || localStage.id !== 'step-development' || note.slug !== slug) throw Error('Unexpected local content');
for (const a of assets) {
  if (createHash('sha256').update(readFileSync(a.file)).digest('hex') !== a.sha256 || !note[a.lang === 'zh' ? 'bodyMarkdownZh' : 'bodyMarkdownEn'].includes(`](${a.url})`)) throw Error('Article does not use the verified assets');
}
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const desiredHash = digest({ note, localStage });
process.loadEnvFile('.env.local');
if (new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname !== 'aqsdwfocoocnzyxopvvg.supabase.co') throw Error('Unexpected CMS destination');
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, options);
const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, options);
const patch = { title: note.titleZh, title_en: note.titleEn, excerpt: note.excerptZh, excerpt_en: note.excerptEn, body_markdown: note.bodyMarkdownZh, body_markdown_en: note.bodyMarkdownEn, tags: note.tags };
try {
  const { data: auth, error: ae } = await client.auth.signInWithPassword({ email: process.env.SUPABASE_ADMIN_EMAIL, password: process.env.SUPABASE_ADMIN_PASSWORD });
  if (ae || auth.user?.is_anonymous || auth.user?.app_metadata?.cms_role !== 'admin') throw Error('CMS administrator authorization failed');
  const { data: current, error: ne } = await client.from('notes').select('*').eq('slug', slug).maybeSingle();
  const { data: pipeline, error: pe } = await client.from('workbench_pipelines').select('*').eq('id', 'ai-development').single();
  const { data: otherPipelines, error: oe } = await client.from('workbench_pipelines').select('*').neq('id', 'ai-development');
  if (ne || pe || oe || !pipeline?.updated_at) throw Error('CMS read failed');
  const matches = pipeline.steps.filter(s => s.id === localStage.id);
  if (matches.length !== 1 || pipeline.steps.length !== 8) throw Error('Unexpected pipeline shape');
  const oldStage = matches[0], ours = new Set(localStage.resources.map(r => r.id));
  const resources = [...localStage.resources, ...oldStage.resources.filter(r => !ours.has(r.id))];
  const legacy = oldStage.resources.find(r => r.id === 'prompt-expand-summary');
  if (legacy) resources[resources.findIndex(r => r.id === legacy.id)] = legacy;
  const target = { ...oldStage, ...localStage, resources };
  const steps = pipeline.steps.map(s => s.id === target.id ? target : s);
  const changedNote = Object.keys(patch).filter(k => !equal(patch[k], current?.[k]));
  const stageChanged = !equal(steps, pipeline.steps);
  const dir = join(tmpdir(), 'qianna-feature-build-publications'); mkdirSync(dir, { recursive: true });
  const pi = process.argv.indexOf('--plan'), planFile = pi < 0 ? null : process.argv[pi + 1];
  if (!process.argv.includes('--apply')) {
    const path = join(dir, new Date().toISOString().replace(/[:.]/g, '-') + '.json');
    writeFileSync(path, JSON.stringify({ desiredHash, beforeNote: current, beforePipeline: pipeline, otherPipelines, patch, steps, createdAt: new Date().toISOString() }, null, 2));
    console.log(JSON.stringify({ mode: 'read-only plan', plan: path, noteExists: !!current, changedNoteFields: changedNote, stageChanged, preservedOtherStages: 7, preservedLegacyResource: !!legacy, resourceCount: resources.length }, null, 2));
  } else {
    if (!planFile) throw Error('Supply --plan from a read-only run');
    const plan = JSON.parse(readFileSync(planFile, 'utf8'));
    if (plan.desiredHash !== desiredHash || !equal(plan.beforeNote, current) || !equal(plan.beforePipeline, pipeline) || !equal(plan.otherPipelines, otherPipelines) || !equal(plan.steps, steps)) throw Error('Sources or CMS changed since plan creation');
    if (changedNote.length) {
      const query = current ? client.from('notes').update(patch).eq('id', current.id).eq('updated_at', current.updated_at) : client.from('notes').insert({ ...patch, slug, status: 'published', published_at: new Date().toISOString(), cover_image_url: note.coverImageUrl });
      const { data, error } = await query.select('*').single();
      if (error) throw Error('Note publication failed: ' + error.message);
      plan.noteSaved = { id: data.id, updated_at: data.updated_at }; writeFileSync(planFile, JSON.stringify(plan, null, 2));
    }
    if (stageChanged) {
      const { data, error } = await client.from('workbench_pipelines').update({ steps }).eq('id', pipeline.id).eq('updated_at', pipeline.updated_at).select('updated_at').single();
      if (error) throw Error('Workbench publication failed: ' + error.message);
      plan.pipelineSaved = data; writeFileSync(planFile, JSON.stringify(plan, null, 2));
    }
    const { data: readNote, error: re } = await anon.from('notes').select('*').eq('slug', slug).single();
    const { data: readPipeline, error: we } = await anon.from('workbench_pipelines').select('*').eq('id', pipeline.id).single();
    const { data: readOthers, error: be } = await client.from('workbench_pipelines').select('*').neq('id', pipeline.id);
    if (re || we || be || readNote?.status !== 'published') throw Error('Published readback failed');
    for (const [k, v] of Object.entries(patch)) if (!equal(readNote[k], v)) throw Error('Published field mismatch: ' + k);
    if (current) for (const [k, v] of Object.entries(current)) if (!(k in patch) && k !== 'updated_at' && !equal(readNote[k], v)) throw Error('Unexpected note metadata change: ' + k);
    if (!equal(readPipeline.steps, steps) || !equal(readOthers, otherPipelines)) throw Error('Workbench readback mismatch');
    for (const [k, v] of Object.entries(pipeline)) if (k !== 'steps' && k !== 'updated_at' && !equal(readPipeline[k], v)) throw Error('Unexpected pipeline metadata change: ' + k);
    plan.verifiedAt = new Date().toISOString(); writeFileSync(planFile, JSON.stringify(plan, null, 2));
    console.log(JSON.stringify({ published: true, slug, noteUpdatedAt: readNote.updated_at, pipelineUpdatedAt: readPipeline.updated_at, preservedOtherStages: 7, preservedOtherPipelines: true, resourceCount: resources.length }, null, 2));
  }
} finally { await client.auth.signOut(); }
