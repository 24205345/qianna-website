const p=(en,zh)=>({en,zh});
export const uiPrototypeDiagrams=[
 {id:'ui-task-pages',note:'ui-prototype-ergonomics',icon:'Monitor',title:p('One task, four interface moments','一个任务，四个界面时刻'),caption:p('Views follow the task; they need not become four separate URLs.','界面围绕任务展开，不要求拆成四个独立网址。'),code:lang=>lang==='en'?`flowchart LR
 I["Provide material"] --> G["Generate practice"] --> A["Answer questions"] --> R["Review feedback"]
 G --> E["Failure: keep input and retry"]
 R --> S["Inspect source, then return"] --> A
`:`flowchart LR
 I["提供材料"] --> G["生成练习"] --> A["回答题目"] --> R["查看反馈"]
 G --> E["失败：保留输入并重试"]
 R --> S["查看原文后返回"] --> A
`},
 {id:'ui-reading-order',note:'ui-prototype-ergonomics',icon:'ListChecks',title:p('Give the next action a clear place','让下一步操作有清楚的位置'),caption:p('A wireframe for the answering state. Explanations appear after submission.','作答状态的线框示意；答案解释在提交之后出现。'),code:lang=>lang==='en'?`flowchart TD
 H["Title and progress"] --> Q["Question and choices"] --> B["Submit answer"]
 Q -.-> S["Optional source drawer"]
 B --> F["Feedback and explanation"]
`:`flowchart TD
 H["标题与进度"] --> Q["题目与选项"] --> B["提交答案"]
 Q -.-> S["按需打开材料抽屉"]
 B --> F["反馈与解释"]
`},
 {id:'ui-responsive-order',note:'ui-prototype-ergonomics',icon:'Monitor',title:p('Keep the task order across screen sizes','屏幕变了，任务顺序不变'),caption:p('A secondary source panel can move into a drawer; preserve the current answer.','次要材料面板可以收进抽屉；当前作答不能因切换而丢失。'),code:lang=>lang==='en'?`flowchart TD
 T["Answer first, source on demand"] --> D["Desktop: question plus source panel"]
 T --> M["Mobile: question plus source drawer"]
 D --> V["Same answer state and reading order"]
 M --> V
`:`flowchart TD
 T["先作答，按需查材料"] --> D["桌面：题目与材料并排"]
 T --> M["手机：题目与材料抽屉"]
 D --> V["保留同一作答状态与阅读顺序"]
 M --> V
`}
];
export const uiPrototypeEditorial={
 'ui-task-pages':{form:'task journey with recovery branches',subtitle:p('Start from what the person is trying to finish.','先明确用户要完成什么，再决定页面和控件。'),footer:p('Generation failure keeps the material; source review returns to the same answer.','生成失败保留材料；查看原文后回到同一份作答。')},
 'ui-reading-order':{form:'annotated wireframe',subtitle:p('Primary action, optional detail, and conditional feedback.','区分主要操作、按需查看的细节和有条件出现的反馈。')},
 'ui-responsive-order':{form:'responsive layout comparison',subtitle:p('Change the arrangement without changing the user’s task.','调整布局，不改变用户正在完成的任务。'),footer:p('Check a narrow viewport, long content, keyboard focus, and closing the source view.','检查窄屏、长内容、键盘焦点，以及关闭材料后能否继续作答。')}
};
export function drawUiPrototype(diagram,layout,lang,canvas){
 const {L,c,text,icon,line,path,box,circle,foot}=canvas;
 if(diagram.id==='ui-task-pages'){
  const nodes=[['FileInput',L('Provide material','提供材料'),L('Paste text / upload','粘贴文字 / 上传')],['Workflow',L('Generate practice','生成练习'),L('Status and cancellation','状态说明与取消')],['ListChecks',L('Answer questions','回答题目'),L('Keep the current draft','保留当前作答')],['BookOpenCheck',L('Review feedback','查看反馈'),L('Explain after submission','提交后展示解释')]];
  nodes.forEach(([glyph,title,detail],i)=>{const x=125+i*263;circle(x,156,27,c.surface);icon(glyph,x-14,142,28);text(title,x,216,{align:'middle',width:230,size:19,weight:600,maxLines:1});text(detail,x,247,{align:'middle',width:235,size:15,color:c.muted});if(i<3)path(`M${x+40} 156H${x+223}`,{arrow:true})});
  path('M388 274V315H125V357',{arrow:true});text(L('Failure','生成失败'),180,305,{width:150,size:14,color:c.muted});box(30,358,245,74,{fill:c.surface});text(L('Keep input and retry','保留输入并重试'),152,403,{align:'middle',width:225,size:17});
  path('M914 274V315H651V357',{arrow:true});box(528,358,245,74,{fill:c.surface});text(L('Inspect source','按需查看原文'),650,403,{align:'middle',width:225,size:17});path('M773 395H805V275H680',{dashed:true,arrow:true});
  foot(layout.footer[lang],475);
 }else if(diagram.id==='ui-reading-order'){
  box(110,106,650,416,{r:10});text(L('Retrieval practice','知识问答练习'),140,145,{size:22,width:430,font:'Georgia, SimSun, serif'});text(L('Question 2 of 5','第 2 / 5 题'),140,179,{size:14,color:c.muted,width:400});line(140,198,730,198);
  text(L('Which claim is supported by the source?','哪一个观点有材料中的证据支持？'),140,236,{size:19,width:570});
  [L('Choice A: an unsupported generalization','选项 A：没有依据的概括'),L('Choice B: a claim grounded in the excerpt','选项 B：由原文片段支持的结论'),L('Choice C: an unrelated statement','选项 C：与材料无关的说法')].forEach((s,i)=>{circle(150,284+i*48,7);text(s,171,290+i*48,{width:550,size:16})});
  box(140,428,190,48,{fill:c.surface,r:5});text(L('Submit answer','提交答案'),235,459,{align:'middle',width:170,size:17});text(L('View source →','查看材料 →'),520,458,{width:210,size:15,color:c.muted});
  path('M761 145H795');text(L('1  Orient','1  知道在哪'),811,151,{width:205,size:16,weight:600});path('M761 284H795');text(L('2  Answer','2  完成作答'),811,290,{width:205,size:16,weight:600});path('M761 453H795');text(L('3  Continue','3  推进任务'),811,459,{width:205,size:16,weight:600});
  text(L('After submission: feedback and explanation appear below the question.','提交之后：在题目下方呈现反馈与解释。'),140,553,{width:750,size:16,color:c.muted});
  return 588;
 }else{
  text(L('Desktop','桌面'),40,124,{width:500,size:21,weight:600});box(40,147,580,305,{r:8});box(60,168,325,261,{fill:c.surface});box(401,168,198,261);text(L('Question + answer','题目与作答'),82,206,{width:280,size:20});text(L('Primary task','主要任务'),82,237,{width:275,size:15,color:c.muted});text(L('Source','参考材料'),420,206,{width:160,size:19});text(L('Optional detail','按需查阅'),420,237,{width:160,size:15,color:c.muted});line(83,270,357,270);line(83,300,357,300);box(83,355,150,42,{fill:c.paper});text(L('Submit','提交'),103,383,{width:120,size:16});
  text(L('Mobile','手机'),725,124,{width:280,size:21,weight:600});box(725,147,272,385,{r:15});text(L('Question + answer','题目与作答'),747,195,{width:230,size:19});text(L('Same draft','同一份草稿'),747,226,{width:230,size:15,color:c.muted});line(747,261,975,261);line(747,292,975,292);box(747,331,228,43,{fill:c.surface});text(L('Submit','提交'),767,360,{width:180,size:16});text(L('View source →','查看材料 →'),747,417,{width:230,size:16});text(L('Open a drawer; return here.','打开抽屉，关闭后回到这里。'),747,465,{width:230,size:15,color:c.muted,maxLines:2});
  foot(layout.footer[lang],576);
 }
}
