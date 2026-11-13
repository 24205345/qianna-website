/** Bundle the editable lab into one immutable, self-contained HTML asset. */
import {readFileSync,writeFileSync} from 'node:fs';
const root=new URL('./ui-prototype-lab/',import.meta.url);
const source=file=>readFileSync(new URL(file,root),'utf8').replace(/\r\n/g,'\n').trim();
const html=source('shell.html').replace('__STYLE__',()=>source('editorial.css')+'\n'+source('studio.css')).replace('__SCRIPT__',()=>source('lab.js').replace('/* PAGE_STUDIES */',()=>source('page-studies.js').replaceAll('export function ','function ')).replace('/* REFERENCE_STUDIES */',()=>source('reference-studies.js').replaceAll('export function ','function ')).replace('/* LESSONS */',()=>source('lessons.js').replaceAll('export function ','function ')).replace('/* ORIENTATION */',()=>source('orientation.js').replaceAll('export function ','function ')).replace('/* STUDIO */',()=>source('studio.js').replaceAll('export function ','function ')))+'\n';
const target=new URL('../public/notes/ui-prototype-ergonomics/interface-lab.html',import.meta.url);
if(process.argv.includes('--check')){
 if(readFileSync(target,'utf8').replace(/\r\n/g,'\n')!==html)throw Error('Lab bundle is stale; run node scripts/build-ui-prototype-lab.mjs');
 console.log('Lab bundle matches its editable sources.');
}else{writeFileSync(target,html);console.log('Built the self-contained interface lab.');}
