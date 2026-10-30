// Editable formats accepted by SmartDiagram's actual canvas adapters.
// Native SVG is the website presentation; these sources do not claim a browser export.
import {conceptBranches} from './concept-map.mjs';
const xml=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/\n/g,'&#10;');
function drawio(nodes,edges){
 const cells=nodes.map(n=>`<mxCell id="${n.id}" value="${xml(n.label)}" style="${n.group?'swimlane;startSize=38;horizontal=1;':'rounded=0;'}whiteSpace=wrap;html=0;fillColor=#ffffff;strokeColor=#838383;fontColor=#202020;fontFamily=Arial;fontSize=16;" vertex="1" parent="${n.parent??'1'}"><mxGeometry x="${n.x}" y="${n.y}" width="${n.w??190}" height="${n.h??66}" as="geometry"/></mxCell>`).join('');
 const links=edges.map((e,i)=>`<mxCell id="edge${i}" value="${xml(e.label??'')}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#838383;endArrow=classic;${e.both?'startArrow=classic;':''}fontColor=#646464;" edge="1" parent="1" source="${e.from}" target="${e.to}"><mxGeometry relative="1" as="geometry"/></mxCell>`).join('');
 return `<mxfile><diagram name="Workbench"><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells}${links}</root></mxGraphModel></diagram></mxfile>`;
}
export function smartSource(d,lang,mermaid){
 const L=(en,zh)=>lang==='en'?en:zh;
 if(d.id==='production-map')return {engine:'mindmap',extension:'mindmap.md',code:`# ${L('Team-ready AI product','个人 Demo 到团队平台')}\n${conceptBranches.map(b=>`## ${b.question[lang]}\n${b.terms[lang].split('\n').map(t=>`### ${t}`).join('\n')}`).join('\n')}`};
 if(d.id==='environment-toolkit')return {engine:'mindmap',extension:'mindmap.md',code:`# Agent\n## ${L('You: goal, constraints, acceptance','你：目标、约束与验收')}\n## ${L('Model: reason and propose','模型：推理与候选')}\n## ${L('MCP / tools: read, search, act','MCP / 工具：读取、检索、执行')}\n## ${L('Runtime: run product code','运行环境：运行产品代码')}\n## ${L('Skills / project rules: methods, scope, checks','Skills / 项目规约：方法、范围、检查')}`};
 if(d.id==='environment-mcp'){
  const nodes=[{id:'host',label:L('AI application / Host','AI 应用 / Host'),x:20,y:40,w:285,h:370,group:true}];
  const edges=[];
  ['Context7','Firecrawl','Playwright'].forEach((name,i)=>{
   nodes.push({id:'client'+i,label:'MCP Client '+(i+1),x:85,y:70+i*100,w:170,h:55,parent:'host'});
   nodes.push({id:'server'+i,label:name+' MCP',x:450,y:110+i*100});
   nodes.push({id:'data'+i,label:[L('Documentation','文档资料'),L('Website content','网页内容'),L('Browser actions','浏览器操作')][i],x:780,y:110+i*100});
   edges.push({from:'client'+i,to:'server'+i,label:'MCP',both:true},{from:'server'+i,to:'data'+i,both:true});
  });
  return {engine:'drawio',extension:'drawio',code:drawio(nodes,edges)};
 }
 if(d.id==='scope-paths'){
  const labels=[L('An initial outline','已有初步框架'),L('A vague idea','只有模糊想法'),L('Organize and challenge','梳理并质疑假设'),L('Explore real experiences','从真实经历探索'),L('Shared product definition\nUser, situation, problem, outcome, MVP, acceptance','共同的产品定义\n用户、场景、问题、结果、MVP 与验收')];
  const coords=[[30,80],[30,300],[360,80],[360,300],[730,190]];
  const nodes=labels.map((label,i)=>({id:'n'+i,type:'default',data:{label},position:{x:coords[i][0],y:coords[i][1]},style:{background:'#ffffff',border:'1px solid #838383',color:'#202020',width:i===4?260:230}}));
  const edges=[[0,2],[1,3],[2,4],[3,4]].map(([s,t],i)=>({id:'e'+i,source:'n'+s,target:'n'+t,type:'smoothstep',markerEnd:{type:'arrowclosed'},style:{stroke:'#838383'}}));
  return {engine:'flow',extension:'flow.json',code:JSON.stringify({nodes,edges},null,2)};
 }
 if(d.id==='scope-mvp'){
  const steps=[[L('Paste material','粘贴材料'),L('Keep the source','保留原文')],[L('Generate questions','生成题目'),L('Check structure and relevance','校验结构与材料相关性')],[L('Answer and feedback','作答与反馈'),L('Explain the answer','给出答案与解释')],[L('Review gaps','回看盲点'),L('Return to the source','回到原文理解')]];
  return {engine:'infographic',extension:'infographic',code:`infographic sequence-timeline-simple\ndata\n  title ${d.title[lang]}\n  sequences\n${steps.map(([label,desc])=>`    - label ${label}\n      desc ${desc}`).join('\n')}\ntheme\n  palette\n    - #202020\n    - #646464\n    - #838383\n    - #202020`};
 }
 if(d.id==='architecture-boundaries'){
  const nodes=[{id:'client',label:L('Client\nInput, answer, review, recovery\nNo server secrets','客户端\n输入、作答、回顾与恢复\n不保存服务端密钥'),x:20,y:90,w:235,h:170},{id:'server',label:L('Trusted application server','可信的应用服务端'),x:370,y:25,w:310,h:340,group:true},{id:'checks',label:L('Validate input and access\nCall with server secret\nValidate output','校验输入与权限\n使用服务端密钥调用\n校验生成结果'),parent:'server',x:30,y:70,w:250,h:230},{id:'external',label:L('Generation service\nCandidate content\nMay fail or time out','生成服务\n候选内容\n可能失败或超时'),x:810,y:90,w:210,h:170}];
  return {engine:'drawio',extension:'drawio',code:drawio(nodes,[{from:'client',to:'checks',label:L('Input / result','输入 / 结果'),both:true},{from:'checks',to:'external',label:L('Generate / candidate','请求生成 / 候选'),both:true}])};
 }
 return {engine:'mermaid',extension:'mmd',code:mermaid};
}
