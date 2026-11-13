/** Targeted chapter-04 publication. Default creates a read-only plan in TEMP.
 * Apply only that reviewed plan: --apply --plan <path>. No migrations or application deployment.
 */
import {createClient} from '@supabase/supabase-js';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {isDeepStrictEqual as equal} from 'node:util';
const slug='ui-prototype-ergonomics';
const note=JSON.parse(readFileSync('app/_data/ui-prototype-note.json','utf8'));
const localStage=JSON.parse(readFileSync('app/_data/ui-prototype-stage.json','utf8'));
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const desiredHash=digest({note,localStage});
// A local preview link must not silently replace the published, immutable resource.
const lab=JSON.parse(readFileSync(`docs/notes/${slug}.assets.json`,'utf8')).assets.find(a=>a.id==='interface-lab');
if(!lab||createHash('sha256').update(readFileSync(`public/notes/${slug}/interface-lab.html`)).digest('hex')!==lab.sha256||!note.bodyMarkdownZh.includes(lab.url+'?lang=zh')||!note.bodyMarkdownEn.includes(lab.url+'?lang=en')||!localStage.resources.some(r=>r.id==='site-interface-lab'&&r.url===lab.url+'?lang=en'))throw Error('Publish the current lab asset, verify its receipt, update both article links, then resync before CMS publication.');
process.loadEnvFile('.env.local');
if(new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname!=='aqsdwfocoocnzyxopvvg.supabase.co')throw Error('Unexpected CMS destination');
const options={auth:{persistSession:false,autoRefreshToken:false}};
const client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,options);
const anon=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,options);
const patch={title:note.titleZh,title_en:note.titleEn,excerpt:note.excerptZh,excerpt_en:note.excerptEn,body_markdown:note.bodyMarkdownZh,body_markdown_en:note.bodyMarkdownEn,tags:note.tags};
try{
 const {data:auth,error:ae}=await client.auth.signInWithPassword({email:process.env.SUPABASE_ADMIN_EMAIL,password:process.env.SUPABASE_ADMIN_PASSWORD});
 if(ae||auth.user?.app_metadata?.cms_role!=='admin')throw Error('CMS administrator authorization failed');
 const {data:current,error:ne}=await client.from('notes').select('*').eq('slug',slug).maybeSingle();
 const {data:pipeline,error:pe}=await client.from('workbench_pipelines').select('*').eq('id','ai-development').single();
 if(ne||pe||!pipeline?.updated_at)throw Error('CMS read failed');
 const matches=pipeline.steps.filter(s=>s.id==='step-ui-prototype');
 if(matches.length!==1||pipeline.steps.length!==8)throw Error('Unexpected pipeline shape');
 const oldStage=matches[0],ours=new Set(['site-interface-lab','prompt-visual-brief','prompt-clickable-prototype','prompt-prototype-review','site-refero-styles','site-cta-gallery','site-footer-design','site-scrolltide','site-scroll-shaders']);
 const target={...oldStage,...localStage,resources:[...oldStage.resources.filter(r=>!ours.has(r.id)),...localStage.resources.filter(r=>ours.has(r.id))]};
 const steps=pipeline.steps.map(s=>s.id===target.id?target:s);
 const changedNote=Object.keys(patch).filter(k=>!equal(patch[k],current?.[k]));
 const stageChanged=!equal(steps,pipeline.steps);
 const dir=join(tmpdir(),'qianna-ui-prototype-publications');mkdirSync(dir,{recursive:true});
 const pi=process.argv.indexOf('--plan'),planFile=pi<0?null:process.argv[pi+1];
 if(!process.argv.includes('--apply')){
  const path=join(dir,new Date().toISOString().replace(/[:.]/g,'-')+'.json');
  writeFileSync(path,JSON.stringify({desiredHash,beforeNote:current,beforePipeline:pipeline,patch,steps,createdAt:new Date().toISOString()},null,2));
  console.log(JSON.stringify({mode:'read-only plan',plan:path,noteExists:!!current,changedNoteFields:changedNote,stageChanged,preservedOtherStages:7,preservedExistingResources:oldStage.resources.filter(r=>!ours.has(r.id)).map(r=>r.id)},null,2));
 }else{
  if(!planFile)throw Error('Supply --plan from a reviewed read-only run');
  const plan=JSON.parse(readFileSync(planFile,'utf8'));
  if(plan.desiredHash!==desiredHash||!equal(plan.beforeNote,current)||!equal(plan.beforePipeline,pipeline)||!equal(plan.steps,steps))throw Error('Sources or CMS changed since plan creation; refresh the plan');
  let saved=current;
  if(changedNote.length){
   const query=current?client.from('notes').update(patch).eq('id',current.id).eq('updated_at',current.updated_at):client.from('notes').insert({...patch,slug,status:'published',published_at:note.publishedAt});
   const {data,error}=await query.select('*').single();if(error)throw Error('Note publication failed: '+error.message);saved=data;
   plan.noteSaved={id:saved.id,updated_at:saved.updated_at};writeFileSync(planFile,JSON.stringify(plan,null,2));
  }
  if(stageChanged){const {data,error}=await client.from('workbench_pipelines').update({steps}).eq('id',pipeline.id).eq('updated_at',pipeline.updated_at).select('updated_at').single();if(error)throw Error('Workbench concurrent edit or write failure: '+error.message);plan.pipelineSaved=data;writeFileSync(planFile,JSON.stringify(plan,null,2))}
  const {data:readNote,error:re}=await anon.from('notes').select('*').eq('slug',slug).single();
  const {data:readPipeline,error:we}=await anon.from('workbench_pipelines').select('*').eq('id',pipeline.id).single();
  if(re||we)throw Error('Anonymous readback failed');
  for(const [k,v] of Object.entries(patch))if(!equal(readNote[k],v))throw Error('Published note mismatch: '+k);
  if(current)for(const [k,v] of Object.entries(current))if(!(k in patch)&&k!=='updated_at'&&!equal(readNote[k],v))throw Error('Unexpected note metadata change: '+k);
  if(!equal(readPipeline.steps,steps))throw Error('Workbench readback mismatch');
  for(const [k,v] of Object.entries(pipeline))if(k!=='steps'&&k!=='updated_at'&&!equal(readPipeline[k],v))throw Error('Unexpected pipeline metadata change');
  plan.verifiedAt=new Date().toISOString();writeFileSync(planFile,JSON.stringify(plan,null,2));
  console.log(JSON.stringify({published:true,slug,noteUpdatedAt:readNote.updated_at,pipelineUpdatedAt:readPipeline.updated_at,preservedOtherStages:7,preservedExistingResources:true},null,2));
 }
}finally{await client.auth.signOut()}
