import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import * as icons from 'lucide-react';
import {diagrams} from './catalog.mjs';
import {editorial} from './editorial.mjs';
import {drawEditorial} from './native-svg.mjs';
import {smartSource} from './smart-sources.mjs';

const args=Object.fromEntries(process.argv.slice(2).reduce((all,v,i,a)=>i%2===0?[...all,[v.replace(/^--/,''),a[i+1]]]:all,[]));
if(!args.smartdiagram)throw Error('Pass --smartdiagram <checkout>');
const smartPath=path.join(args.smartdiagram,'apps/web/src/shared/lib/mermaidSanitizer.ts');
const {normalizeMermaidCode,stabilizeMermaidFlowchartEdgeLabels}=await import(pathToFileURL(smartPath));
const root='docs/diagrams/workbench';
const style=JSON.parse(readFileSync(root+'/style.json','utf8'));
const out=args.preview?'.media-migration/visual-v3-preview':root+'/rendered';mkdirSync(out,{recursive:true});
const previous=args.note?JSON.parse(readFileSync(root+'/manifest.json','utf8')).figures.filter(f=>f.note!==args.note):[];
const manifest=[...previous];
const selected=diagrams.filter(d=>(!args.preview||d.id===args.preview)&&(!args.note||d.note===args.note));
if(!selected.length)throw Error('No diagrams match the requested note or preview');
for(const diagram of selected){
 for(const lang of ['en','zh']){
  let source=normalizeMermaidCode(diagram.code(lang));source=stabilizeMermaidFlowchartEdgeLabels(source)||source;
  const basename=diagram.id+'.'+lang;
  const editable=smartSource(diagram,lang,source);
  if(!args.preview){
   writeFileSync(root+'/sources/'+basename+'.mmd',source+'\n');
   if(editable.extension!=='mmd')writeFileSync(root+'/sources/'+basename+'.'+editable.extension,editable.code+'\n');
  }
  const svg=drawEditorial(diagram,editorial[diagram.id],lang,style);
  writeFileSync(out+'/'+basename+'.svg',svg);
  const info=await sharp(Buffer.from(svg),{density:144}).webp({quality:94,effort:5}).toFile(out+'/'+basename+'.webp');
  const sha256=createHash('sha256').update(readFileSync(out+'/'+basename+'.webp')).digest('hex');
  const objectKey=`notes/workbench-diagrams/v3/${basename}-${sha256.slice(0,12)}.webp`;
  const localUrl=`/notes/${diagram.note}/${basename}-${sha256.slice(0,12)}.webp`;
  if(diagram.localAsset&&!args.preview){
   mkdirSync('public/notes/'+diagram.note,{recursive:true});
   copyFileSync(out+'/'+basename+'.webp','public'+localUrl);
  }
  const delivery=diagram.localAsset?{delivery:'local',url:localUrl}:{objectKey,url:'https://media.qiannawang.com/'+objectKey};
  manifest.push({id:diagram.id,note:diagram.note,lang,...(diagram.article===false?{article:false}:{}),form:editorial[diagram.id].form,smartdiagramEngine:editable.engine,title:diagram.title[lang],caption:diagram.caption[lang],source:'sources/'+basename+'.'+editable.extension,logic:'sources/'+basename+'.mmd',svg:'rendered/'+basename+'.svg',image:'rendered/'+basename+'.webp',width:info.width,height:info.height,sha256,...delivery});
  console.log(basename+' '+info.width+'×'+info.height);
 }
}
if(!args.preview){
 mkdirSync(root+'/icons',{recursive:true});
 const names=new Set([...diagrams.map(d=>d.icon), 'UserRound','Workflow','Brain','Network','Terminal','BookOpen','FileText','Globe','Monitor','ListChecks','MessagesSquare','FileCheck2','FileInput','Sparkles','MessageSquareText','BookOpenCheck','SlidersHorizontal','GitCompareArrows','ScanSearch','Check','ShieldCheck','Cloud','Users','Gauge','Activity']);
 for(const name of names)writeFileSync(root+'/icons/'+name+'.svg',renderToStaticMarkup(createElement(icons[name],{width:32,height:32,stroke:style.colors.ink,strokeWidth:style.iconStroke}))+'\n');
 writeFileSync(root+'/manifest.json',JSON.stringify({styleVersion:3,engine:'Native neutral SVG; SmartDiagram-compatible mindmap, flow, drawio, infographic and Mermaid sources',normalizerSHA256:createHash('sha256').update(readFileSync(smartPath)).digest('hex'),figures:manifest},null,2)+'\n');
}
