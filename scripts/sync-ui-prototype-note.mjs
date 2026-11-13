/** Local bilingual source → note + targeted Workbench stage. Does not publish. */
import {readFileSync,writeFileSync} from 'node:fs';
const slug='ui-prototype-ergonomics';
const check=process.argv.includes('--check');
const read=lang=>{
 const raw=readFileSync(`docs/notes/${slug}.${lang}.md`,'utf8').replace(/\r\n/g,'\n');
 if(/\{\{(?:figure|lab):/.test(raw))throw Error('Resolve verified asset references first');
 const match=/^# (.+)\n+([\s\S]+)$/.exec(raw);if(!match)throw Error('Source title missing');
 return {title:match[1],body:match[2].trim()};
};
const zh=read('zh'),en=read('en');
const promptSpecs=[
 {section:2,id:'prompt-visual-brief',title:'Visual Brief for One View',description:'Translate references and visual goals into scoped, observable design rules before editing.',tag:'Visual Direction'},
 {section:6,id:'prompt-clickable-prototype',title:'Clickable Prototype from Contracts',description:'Create controllable mock scenarios while preserving established content and components.',tag:'UI Prototype'},
 {section:7,id:'prompt-prototype-review',title:'Prototype Task Review',description:'Review task completion, failure recovery, narrow screens and contract gaps.',tag:'Validation'},
];
function promptForSection(source,section){
 const body=source.body.split(new RegExp(`^## ${section}\\. `,'m'))[1]?.split(/^## /m)[0];
 const blocks=[...(body||'').matchAll(/```prompt\n([\s\S]*?)\n```/g)];
 if(blocks.length!==1)throw Error('Expected one prompt in section '+section);
 return blocks[0][1];
}
for(const [language,source] of [['zh',zh],['en',en]]){
 const blocks=[...source.body.matchAll(/```prompt\n([\s\S]*?)\n```/g)].map(m=>m[1]);
 if(blocks.length!==promptSpecs.length)throw Error('Expected three localized prompts: '+language);
 for(const spec of promptSpecs)promptForSection(source,spec.section);
 for(const block of blocks){
  const hasChinese=/[\u4e00-\u9fff]/.test(block);
  if(hasChinese!==(language==='zh'))throw Error('Prompt language does not match the article: '+language);
 }
}
const excerptZh='从任务流程、信息层次到等待与失败，用知识问答案例设计可点击原型；从视觉参考提取规则，在交互实验室中认识网页部位、比较样式与动效，把效果准确描述给 Agent。';
const excerptEn='Turn tasks into usable prototypes, extract rules from visual references, and use a live interface lab to name page regions, compare styling and motion, and generate a page prompt.';
const note={slug,title:en.title,excerpt:excerptEn,publishedAt:'2026-11-02T08:00:00.000Z',tags:['AI Development','UI Prototype','Interaction Design','Accessibility'],titleZh:zh.title,titleEn:en.title,excerptZh,excerptEn,bodyMarkdownZh:zh.body,bodyMarkdownEn:en.body,coverImageUrl:null};
function save(file,value){const next=JSON.stringify(value,null,2)+'\n';let old;try{old=readFileSync(file,'utf8')}catch(e){if(e.code!=='ENOENT')throw e}if(check){if(old!==next)throw Error('Stale generated file: '+file)}else if(old!==next)writeFileSync(file,next)}
save('app/_data/ui-prototype-note.json',note);
const stageFile='app/_data/ui-prototype-stage.json',stage=JSON.parse(readFileSync(stageFile,'utf8'));
const labUrl=en.body.match(/\]\(([^)\n]+interface-lab[^)\n]*?\.html)\?lang=en\)/)?.[1];
if(!labUrl||!zh.body.includes(labUrl+'?lang=zh'))throw Error('Bilingual lab links must agree');
const references=[
 {id:'site-refero-styles',title:'Refero Styles: Extract Design Rules',description:'Inspect typography, color, spacing and component rules, then write a visual brief for your own project.',tag:'Visual Direction',url:'https://styles.refero.design/',curatorNote:'Extract rules rather than importing an entire brand. These interpreted examples are not official brand source code.'},
 {id:'site-cta-gallery',title:'CTA.gallery: Explain the Next Action',description:'Compare action wording, placement and priority. Leave with a primary action and its resulting states.',tag:'Action Design',url:'https://www.cta.gallery/',curatorNote:'Marketing examples are references, not evidence of conversion gains. Check waiting and failure separately.'},
 {id:'site-footer-design',title:'Footer.design: Organize the Page Ending',description:'Inspect footer typography and link grouping; keep only the routes your readers need.',tag:'Page Structure',url:'https://www.footer.design/',curatorNote:'Keep important task actions in the main area. Gallery access does not grant asset redistribution rights.'},
 {id:'site-scrolltide',title:'Scrolltide: Describe One Motion',description:'Optional advanced reference: isolate one object, then specify its trigger, movement and end state.',tag:'Optional Motion',url:'https://www.scrolltide.co/',curatorNote:'Code and exports may require payment. Check license, touch, reduced motion and performance in your own project.'},
 {id:'site-scroll-shaders',title:'Scroll Shaders: Assess a Background',description:'Optional advanced reference: compare motion intensity and check readability with your own text and a static alternative.',tag:'Optional Background',url:'https://scrollshaders.com/',curatorNote:'Code and exports may require payment. Finished-project use and reusable asset redistribution have different permissions.'},
];
Object.assign(stage,{subtitle:'Task Flows, UI States & Interaction',tools:['Clickable Prototype','Component Patterns','Responsive UI'],summary:'Turn product tasks and API contracts into understandable views, responsive interactions, and recoverable states. Try the interface lab to describe behavior precisely.',relatedNoteHref:`/notes/${slug}`,relatedNoteLabel:en.title,keyTakeaway:'Describe the object, trigger, visible change, and completion rules. Validate one real task and a failure path before replacing mock data with live services.'});
const newIds=['site-interface-lab',...promptSpecs.map(spec=>spec.id),...references.map(r=>r.id)];
stage.resources=stage.resources.filter(r=>!newIds.includes(r.id));
stage.resources.push({id:newIds[0],type:'site',title:'Interface Lab: Try & Describe',description:'Compare four presets, inspect ten page regions, and adjust layout, surface and motion while generating a mixed-language or English page prompt.',tag:'Interactive Reference',url:labUrl+'?lang=en',curatorNote:'Chinese/bilingual controls; English prompt selected by this entry. CSS motion preview, no model calls or persistent settings.'},...promptSpecs.map(({section,...spec})=>({...spec,type:'prompt',content:promptForSection(en,section),curatorNote:section===2?'Adapt the visual direction to existing project rules. This brief does not authorize a full redesign.':'The prompt matches the English chapter. Mock behavior does not establish real service support.'})),...references.map(r=>({...r,type:'site'})));
save(stageFile,stage);
console.log(check?'Chapter 04 bilingual fallback and resources match their sources.':'Updated chapter 04 fallback and resources.');
