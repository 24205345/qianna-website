/** Immutable chapter-04 assets only. Default: local plan; --apply uploads and verifies. */
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {HeadObjectCommand,PutObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {createR2Client,getR2PublicUrl} from '../lib/media/storage-core.ts';
const slug='ui-prototype-ergonomics';
const hash=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
const figures=JSON.parse(readFileSync('docs/diagrams/workbench/manifest.json','utf8')).figures.filter(f=>f.note===slug);
if(figures.length!==6)throw Error('Expected three bilingual diagrams');
const assets=figures.map(f=>({id:f.id,lang:f.lang,file:'docs/diagrams/workbench/'+f.image,key:f.objectKey,sha256:f.sha256,contentType:'image/webp'}));
const file=`public/notes/${slug}/interface-lab.html`,sha256=hash(file);
assets.push({id:'interface-lab',file,key:`notes/${slug}/interface-lab-${sha256.slice(0,12)}.html`,sha256,contentType:'text/html; charset=utf-8'});
for(const a of assets){if(hash(a.file)!==a.sha256||!/^notes\/(workbench-diagrams\/v3\/ui-|ui-prototype-ergonomics\/interface-lab-)/.test(a.key))throw Error('Asset identity mismatch')}
if(!process.argv.includes('--apply')){console.log(JSON.stringify(assets.map(({id,lang,file,key})=>({id,lang,file,key})),null,2));}
else{
 process.loadEnvFile('.env.local');
 if(process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/,'')!=='https://media.qiannawang.com')throw Error('Unexpected media destination');
 const client=createR2Client();
 try{
  const transfers=[];
  for(const a of assets){
   const props={Bucket:process.env.R2_BUCKET_NAME,Key:a.key};
   transfers.push({...a,url:getR2PublicUrl(a.key),head:await getSignedUrl(client,new HeadObjectCommand(props),{expiresIn:600}),put:await getSignedUrl(client,new PutObjectCommand({...props,ContentType:a.contentType,ContentLength:readFileSync(a.file).length,CacheControl:'public, max-age=31536000, immutable',IfNoneMatch:'*'}),{expiresIn:600,signableHeaders:new Set(['content-type','content-length','if-none-match'])})});
  }
  // Python transport avoids the local Node DNS proxy; signed URLs stay in stdin only.
  const code=`import sys,json,hashlib,requests
s=requests.Session()
for a in json.load(sys.stdin):
 r=s.head(a['head'],timeout=30)
 if r.status_code==404:
  with open(a['file'],'rb') as f: payload=f.read()
  r=s.put(a['put'],data=payload,headers={'Content-Type':a['contentType'],'Cache-Control':'public, max-age=31536000, immutable','If-None-Match':'*'},timeout=60)
  if r.status_code not in (200,204,412): raise RuntimeError('Asset upload failed: '+str(r.status_code))
 elif r.status_code!=200: raise RuntimeError('Asset HEAD failed: '+str(r.status_code))
 r=s.get(a['url'],timeout=30)
 if r.status_code!=200 or hashlib.sha256(r.content).hexdigest()!=a['sha256']: raise RuntimeError('Public asset verification failed')
 if a['contentType'].startswith('text/html') and not r.headers.get('content-type','').startswith('text/html'): raise RuntimeError('HTML delivery type mismatch')
 print(a['id']+' '+a.get('lang','')+' verified')
`;
  const result=spawnSync('python',['-c',code],{input:JSON.stringify(transfers),encoding:'utf8',maxBuffer:100000});
  if(result.status!==0)throw Error('Asset transfer or readback failed; no receipt written. '+(result.stderr||'').split('\n').filter(l=>l.startsWith('RuntimeError:')).join(' '));
  console.log(result.stdout.trim());
  writeFileSync(`docs/notes/${slug}.assets.json`,JSON.stringify({verifiedAt:new Date().toISOString(),assets:transfers.map(({id,lang,file,key,sha256,contentType,url})=>({id,lang,file,key,sha256,contentType,url}))},null,2)+'\n');
 }finally{client.destroy()}
}
