import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import * as icons from 'lucide-react';

const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const units=s=>[...s].reduce((n,c)=>n+(/[\u2e80-\uffff]/u.test(c)?1:/[MW@]/u.test(c)?.85:/[il .,':;]/u.test(c)?.28:.55),0);
function wrap(value,max){
 const lines=[];
 for(const paragraph of String(value).split('\n')){
  let line='';
  for(const token of paragraph.match(/[\u2e80-\uffff]|\s+|[^\s\u2e80-\uffff]+/gu)??[]){
   if(line&&units(line+token)>max){lines.push(line.trim());line='';}
   line+=token;
  }
  if(line.trim())lines.push(line.trim());
 }
 return lines;
}

export function drawEditorial(diagram,layout,lang,style){
 const W=1040,c=style.colors,body=style.fonts.body,serif=style.fonts.heading;
 const L=(en,zh)=>lang==='en'?en:zh;
 let markup='',H;
 const add=s=>{markup+=s;};
 function text(value,x,y,{size=17,width=950,color=c.ink,weight=400,align='start',font=body,maxLines=9}={}){
  const lines=wrap(value,width/size);
  if(lines.length>maxLines)throw Error(`Text exceeds ${maxLines} lines: ${lang} ${value}`);
  const left=align==='middle'?x-width/2:x;
  if(left<0||left+width>W+1)throw Error('Text outside canvas: '+value);
  add(`<text x="${x}" y="${y}" text-anchor="${align}" fill="${color}" font-family="${font}" font-size="${size}" font-weight="${weight}">${lines.map((s,i)=>`<tspan x="${x}" dy="${i?size*1.45:0}">${escape(s)}</tspan>`).join('')}</text>`);
  return lines.length*size*1.45;
 }
 function icon(name,x,y,size=26,color=c.ink){
  if(!icons[name])throw Error('Unknown icon '+name);
  add(renderToStaticMarkup(createElement(icons[name],{width:size,height:size,stroke:color,strokeWidth:style.iconStroke})).replace('<svg ',`<svg x="${x}" y="${y}" `));
 }
 const line=(x1,y1,x2,y2,dashed=false,color=c.rule)=>add(`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="1.4" ${dashed?'stroke-dasharray="5 5"':''}/>`);
 function path(d,{dashed=false,arrow=false,both=false,color=c.line}={}){
  add(`<path d="${d}" fill="none" stroke="${color}" stroke-width="1.5" ${dashed?'stroke-dasharray="5 5"':''} ${arrow?'marker-end="url(#arrow)"':''} ${both?'marker-start="url(#arrow-start)" marker-end="url(#arrow)"':''}/>`);
 }
 function box(x,y,w,h,{fill='none',dashed=false,r=4,stroke=c.rule}={}){
  add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" ${dashed?'stroke-dasharray="5 5"':''}/>`);
 }
 function circle(x,y,r=26,fill=c.paper){add(`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${c.rule}"/>`);}
 function foot(value,y){line(24,y,1016,y);text(value,24,y+29,{size:15,color:c.muted,width:992,maxLines:2});H=y+75;}
 text(diagram.title[lang],24,36,{size:24,font:serif,width:992,maxLines:1});
 text(layout.subtitle[lang],24,68,{size:15,color:c.muted,width:992,maxLines:1});

 if(diagram.id==='environment-toolkit'){
  icon('UserRound',66,233,34);text(L('You','你'),83,301,{align:'middle',width:110,size:19,weight:600});
  text(L('Goal + limits\nAcceptance','目标、约束\n与验收'),83,330,{align:'middle',width:145,size:15,color:c.muted});
  circle(350,265,49,c.surface);icon('Workflow',331,246,38);
  text('Agent',350,345,{align:'middle',width:220,size:21,weight:600});
  text(L('Read · plan · act · check','读取 · 规划 · 执行 · 检查'),350,374,{align:'middle',width:230,size:15,color:c.muted});
  path('M150 250H294',{arrow:true});text(L('Define the task','定义任务'),164,235,{size:14,width:130,color:c.muted});
  path('M294 284H150',{dashed:true,arrow:true});text(L('Review evidence','核对交付依据'),164,311,{size:14,width:130,color:c.muted});
  const branches=[
   ['Brain',L('Model','模型'),L('Reason and propose','推理与提出候选')],
   ['Network',L('MCP / tools','MCP / 工具'),L('Read, search and act','读取、检索与执行')],
   ['Terminal',L('Runtime','运行环境'),L('Run the product’s code','运行产品代码')],
   ['BookOpen',L('Skills / project rules','Skills / 项目规约'),L('Methods, scope and checks','方法、范围与检查')]
  ];
  branches.forEach(([name,title,detail],i)=>{
   const y=127+i*96;path(`M400 265C502 265 502 ${y} 601 ${y}`);
   circle(620,y,20);icon(name,609,y-11,22);
   text(title,660,y-3,{size:19,weight:600,width:350});text(detail,660,y+24,{size:16,color:c.muted,width:350});
  });
  foot(layout.footer[lang],453);
 }else if(diagram.id==='environment-mcp'){
  box(24,113,284,350,{stroke:c.line});text(L('AI application / Host','AI 应用 / Host'),44,147,{size:20,weight:600,width:244});
  circle(81,301,28,c.surface);icon('Workflow',66,286,30);text('Agent',81,357,{align:'middle',width:96,size:17,weight:600});
  const rows=[['Context7','FileText',L('Documentation','文档资料')],['Firecrawl','Globe',L('Website content','网页内容')],['Playwright','Monitor',L('Browser actions','浏览器操作')]];
  rows.forEach(([name,glyph,detail],i)=>{
   const y=207+i*105;
   path(`M109 301C146 301 146 ${y} 263 ${y}`);
   text(`MCP Client ${i+1}`,167,i===2?y+29:y-35,{size:14,width:130,color:c.muted});circle(273,y,7,c.surface);
   path(`M283 ${y}H514`,{both:true});text('MCP',389,y-13,{align:'middle',size:14,width:100,color:c.muted});
   circle(550,y,30);icon('Network',536,y-14,28);text(name+' MCP',550,y+53,{align:'middle',size:17,width:220,weight:600});
   path(`M583 ${y}H864`,{both:true});text(L('Access / result','访问 / 结果'),725,y-13,{align:'middle',size:14,width:200,color:c.muted});
   icon(glyph,890,y-16,32);text(detail,906,y+53,{align:'middle',size:17,width:214});
  });
  foot(L('Example connections: each client communicates with its server. Add only needed access and inspect returned results.','示意三条连接：各 Client 与对应 Server 通信。按需授权，并核对返回结果。'),490);
 }else if(diagram.id==='scope-paths'){
  const starts=[L('An initial outline','已有初步框架'),L('A vague idea','只有模糊想法')];
  const actions=[L('Organize and challenge','梳理并质疑假设'),L('Explore real experiences','从真实经历探索')];
  const details=[L('Users, features, constraints, evidence','用户、功能、约束与已有依据'),L('Clarify one uncertainty at a time','通过对话逐步明确未知')];
  [166,336].forEach((y,i)=>{
   circle(50,y,21,c.surface);text(i?'B':'A',50,y+6,{align:'middle',width:40,size:18,weight:600});
   text(starts[i],92,y-3,{size:19,weight:600,width:250});text(details[i],92,y+27,{size:15,color:c.muted,width:250,maxLines:2});
   path(`M349 ${y}H385`,{arrow:true});icon(i?'MessagesSquare':'ListChecks',409,y-34,25);
   text(actions[i],410,y+10,{size:18,width:230,weight:600});line(410,y+31,627,y+31);
   path(`M642 ${y}H677Q690 ${y} 690 ${y+(i?-16:16)}V235Q690 251 707 251H743`,{arrow:true});
  });
  icon('FileCheck2',779,162,35);const titleHeight=text(L('Shared product definition','共同的产品定义'),779,224,{size:20,weight:600,width:237});
  text(L('User + situation\nProblem + desired outcome\nMVP + acceptance + short PRD','用户与场景\n问题与期望结果\nMVP、验收与短 PRD'),779,224+titleHeight+12,{size:16,color:c.muted,width:237,maxLines:5});
  foot(layout.footer[lang],421);
 }else if(diagram.id==='scope-mvp'){
  const steps=[['FileInput',L('Paste material','粘贴材料'),L('Keep the source available','保留原文以便回看')],['Sparkles',L('Generate questions','生成题目'),L('Check structure and relevance','校验结构与材料相关性')],['MessageSquareText',L('Answer + feedback','作答并获得反馈'),L('Explain the answer','给出答案与解释')],['BookOpenCheck',L('Review gaps','回看盲点'),L('Return to the source','回到原文理解')]];
  const xs=[135,390,645,900];
  steps.forEach(([glyph,title,detail],i)=>{
   const x=xs[i];if(i<3)path(`M${x+34} 175H${xs[i+1]-34}`,{arrow:true});
   text('0'+(i+1),x,123,{size:16,align:'middle',width:90,color:c.muted});circle(x,175,30,c.surface);icon(glyph,x-16,159,32);
   text(title,x,244,{size:18,align:'middle',width:215,weight:600,maxLines:2});text(detail,x,289,{size:16,align:'middle',width:215,color:c.muted,maxLines:2});
  });
  path('M930 331V351H107V331',{dashed:true});text(L('One complete practice session','一次完整练习'),520,382,{size:17,align:'middle',width:700});
  foot(layout.footer[lang],415);
 }else if(diagram.id==='architecture-decisions'){
  const inputs=[['SlidersHorizontal',L('Product constraints','产品约束'),L('PRD · platforms · team · resources','PRD、平台、团队与资源')],['GitCompareArrows',L('Compare candidates','比较候选'),L('Same requirements; explicit trade-offs','同一组要求，写清取舍')],['ScanSearch',L('Check the assumptions','核查关键假设'),L('Official docs + a critical experiment','官方文档与最小关键试验')]];
  [32,317,602].forEach((x,i)=>{
   const [glyph,title,detail]=inputs[i];icon(glyph,x,124,27);text(title,x,184,{size:19,weight:600,width:235,maxLines:2});text(detail,x,224,{size:15,color:c.muted,width:235,maxLines:2});
   if(i<2)path(`M${x+246} 166H${x+267}`,{arrow:true});
  });
  path('M714 251V278',{arrow:true});add(`<path d="M714 283L800 333L714 383L628 333Z" fill="${c.surface}" stroke="${c.line}"/>`);
  text(L('Fits the product?','适配产品？'),714,340,{align:'middle',size:17,width:153,weight:600,maxLines:1});
  path('M804 333H858',{arrow:true});text(L('Yes','是'),829,319,{align:'middle',size:14,width:48,color:c.muted});icon('Check',891,286,27);
  text(L('Record the choice','记录决定'),887,344,{size:18,width:145,weight:600,maxLines:2});text(L('Reasons + costs','理由与代价'),887,397,{size:15,width:145,color:c.muted});
  path('M624 333H441V266',{arrow:true,dashed:true});text(L('No · revise candidate','否 · 调整候选'),444,320,{size:15,width:173,color:c.muted,maxLines:2});
  foot(layout.footer[lang],446);
 }else if(diagram.id==='architecture-boundaries'){
  icon('Monitor',53,145,37);text(L('Client','客户端'),53,211,{size:21,weight:600,width:230});
  text(L('Input and progress\nAnswer and review\nKeep input after failure','输入与进度\n作答与回顾\n失败时保留输入'),53,249,{size:17,width:230,color:c.muted});
  text(L('No provider secrets','不保存生成服务密钥'),53,404,{size:15,width:230,weight:600});
  box(366,110,309,345,{dashed:true,stroke:c.line});icon('ShieldCheck',389,133,31);
  text(L('Application server','应用服务端'),389,202,{size:21,width:263,weight:600});
  text(L('Trusted boundary','可信边界'),389,229,{size:15,width:263,color:c.muted});
  const steps=[L('Validate input + access','校验输入与权限'),L('Call with a server secret','使用服务端密钥调用'),L('Validate the output','校验生成结果')];
  steps.forEach((s,i)=>{const y=277+i*66;circle(397,y-6,4,c.ink);if(i<2)path(`M397 ${y+3}V${y+49}`);text(s,416,y,{size:16,width:237,maxLines:2});});
  icon('Cloud',795,145,43);text(L('Generation service','生成服务'),795,222,{size:20,weight:600,width:236,maxLines:2});
  text(L('Candidate content\nMay fail or time out','候选内容\n可能失败或超时'),795,299,{size:17,width:236,color:c.muted});
  path('M289 270H360',{arrow:true});text(L('Input','输入'),323,255,{align:'middle',size:14,width:70,color:c.muted});
  path('M360 426H289',{arrow:true});text(L('Result / error','结果 / 错误'),327,410,{align:'middle',size:13,width:101,color:c.muted});
  path('M681 337H773',{arrow:true});text(L('Generate','请求生成'),725,322,{align:'middle',size:14,width:88,color:c.muted});
  path('M773 401H681',{arrow:true});text(L('Candidate','候选结果'),725,385,{align:'middle',size:14,width:88,color:c.muted});
  foot(layout.footer[lang],480);
 }else if(diagram.id==='architecture-failures'){
  const xs=[145,520,910],glyphs=['Monitor','ShieldCheck','Cloud'];
  layout.lanes.forEach((name,i)=>{icon(glyphs[i],xs[i]-14,111,28);text(name[lang],xs[i],169,{align:'middle',size:18,width:260,weight:600});});
  box(24,344,992,144,{fill:c.surface});box(24,506,992,117);
  xs.forEach(x=>path(`M${x} 187V635`,{dashed:true,color:c.rule}));
  path('M149 222H516',{arrow:true});text(L('Submit material','提交材料'),190,208,{size:16,width:310});
  path('M520 245H552V274H520',{arrow:true});text(L('Validate input + access','校验输入与权限'),568,267,{size:15,width:350,color:c.muted});
  path('M524 316H906',{arrow:true});text(L('Request generation','请求生成题目'),568,302,{size:16,width:330});
  text(L('Success','成功'),39,371,{size:15,width:96,weight:600});
  path('M906 385H524',{arrow:true,dashed:true});text(L('Candidate output','候选内容'),568,373,{size:16,width:330});
  text(L('Check structure + content','校验结构与内容'),542,418,{size:15,width:410,color:c.muted});
  path('M516 458H149',{arrow:true});text(L('Return the checked exercise','返回已校验的练习'),190,446,{size:16,width:320});
  text(L('Failure /\ntimeout','失败 /\n超时'),39,535,{size:15,width:96,weight:600});
  path('M516 551H149',{arrow:true,dashed:true});text(L('Stable error + retry policy','稳定错误与重试规则'),190,538,{size:16,width:320});
  text(L('Keep input; offer an explicit retry','保留输入，提供显式重试'),174,595,{size:15,width:700,color:c.muted});
  foot(layout.footer[lang],651);
 }else throw Error('No neutral layout for '+diagram.id);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc"><title id="title">${escape(diagram.title[lang])}</title><desc id="desc">${escape(diagram.caption[lang])}</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L9 5L1 9Z" fill="${c.line}"/></marker><marker id="arrow-start" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M9 1L1 5L9 9Z" fill="${c.line}"/></marker></defs><rect width="${W}" height="${H}" fill="${c.paper}"/>${markup}</svg>`;
}
