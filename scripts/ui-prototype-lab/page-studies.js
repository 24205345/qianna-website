// Page-scale examples share the same language, motion and requirement system as components.
export function studyDetails(){
 const mode=configs[current];
 const grid=T({editorial:'an asymmetric lead story and secondary column',equal:'two equal columns',stack:'a single reading column'}[mode],{editorial:'主次不对称的双栏',equal:'等宽双栏',stack:'单栏阅读'}[mode]);
 return {
  grid:[T('Grid layout defines which story leads and which details support it.','网格布局决定先看到什么，以及主次信息如何分配空间。'),T('Open the page or resize the available viewport.','打开页面，或改变可用宽度。'),T(`Use ${grid}, with a 24 px gap and a shared left edge. Prioritize the lead heading and its introduction.`,`采用${grid}，栏间距 24 px，内容左对齐；优先呈现主标题和导语。`),T('Collapse into source order on a narrow screen. Do not clip long titles or rearrange reading order only for appearance.','窄屏按内容顺序合为单栏；长标题换行，不为外观打乱阅读顺序。')],
  workspace:[T('A workspace keeps the main task and its reference close together.','工作区把主要任务和参考内容放在一起，减少来回查找。'),T('Switch the preview between desktop and mobile; open the source if needed.','切换桌面与手机预览，按需查看材料。'),T('Use a 3:2 split on desktop. On mobile, keep the question first and reveal the source below its entry.','桌面约按 3:2 分配题目与材料；手机优先呈现题目，在查看入口下展开材料。'),T('Retain the chosen answer when the viewport or source visibility changes. Closing the reference must not submit the answer.','切换尺寸、展开或关闭材料时保留选项；关闭参考内容不能触发提交。')],
  typography:[T('Type hierarchy uses family, size and weight to show what matters.','文字层级通过字体、字号和字重表达主次。'),T('Read the same article with a different heading style or type scale.','为同一篇文章切换标题字体或字号层级。'),T(`Use ${mode==='sans'?'sans-serif headings':'serif headings'} in a centered reading column. The heading scales up to ${mode==='large'?'44':'36'} px; body text is ${mode==='large'?'17':'15'} px. Keep notes smaller and quieter.`,`阅读栏居中，标题使用${mode==='sans'?'无衬线':'衬线'}字体，随可用宽度放大至 ${mode==='large'?'44':'36'} px；正文 ${mode==='large'?'17':'15'} px，注释稍小。`),T('These are preview sizes, not universal site tokens. Use the available reading width, wrap only when needed, and keep body text readable.','这些是预览参数，不是全站通用字号；充分使用阅读栏宽度，空间不足时自然换行，正文保持可读。')],
  rhythm:[T('Reading rhythm comes from line height, measure and space between ideas.','阅读节奏由行高、行长和段落之间的留白共同决定。'),T('Compare compact and comfortable settings using the same paragraph.','用同一段文字比较紧凑与舒展的排版。'),T(`Use ${mode==='compact'?'1.5 line height and 12 px paragraph gaps':'1.9 line height and 26 px paragraph gaps'}. Center the reading column, capped at ${lang==='zh'?(mode==='compact'?'36em':'28em'):(mode==='compact'?'72ch':'60ch')}, and align its headings and body.`,`采用${mode==='compact'?'1.5 倍行高、12 px 段间距':'1.9 倍行高、26 px 段间距'}；阅读栏居中，最大行宽 ${mode==='compact'?'36em':'28em'}，标题与正文左边线对齐。`),T('Preserve the text and hierarchy. Column limits are maximums, not fixed widths; they shrink to fit. Check Chinese and English separately.','保留文字与层级；行宽是上限而非固定值，窄屏自动缩小。中英文分别检查，不用空段落撑间距。')],
  scroll:[T('Scroll effects connect a page section appearing with the reader reaching it.','滚动动效把“读到这个位置”和“这段内容出现”联系起来。'),T('Scroll inside the preview until each section enters its viewport; Replay starts over.','在预览内部向下滚动，让章节进入可见区域；“重新体验”从头开始。'),T(`${mode==='slide'?'Fade in and move upward by 16 px':'Fade in without moving'} over ${duration} ms, once per section. Keep the small header fixed inside the preview. The thin line tracks reading position.`,`每个章节首次进入预览时，在 ${duration} ms 内${mode==='slide'?'从下方 16 px 淡入并上移':'原位淡入'}。顶部导航固定在预览内，细线表示阅读位置。`),T('Show all content when reduced motion is requested or observation is unavailable. Never hide required information indefinitely or animate every scroll pixel.','减少动态效果或不支持观察器时直接展示全文；不能让必要信息一直隐藏，也不逐像素跟随滚动抖动。')],
  transition:[T('A view transition explains that related content changed in place.','视图过渡帮助用户理解：内容在原位切换了。'),T('Activate Overview or Notes inside the preview.','点击预览中的“概览”或“笔记”。'),T(`Replace the content in place with ${mode==='slide'?'a 12 px upward fade':'an opacity fade'} lasting ${duration} ms. Keep the navigation and outer frame still.`,`在 ${duration} ms 内用${mode==='slide'?'从下方 12 px 上移并淡入':'透明度淡入'}替换正文，导航和外层框架保持稳定。`),T('Leave focus on the activated navigation button, mark the current view, and skip motion when requested. This local demo does not change the browser route.','焦点留在触发按钮上，标明当前视图；减少动态效果时直接切换。本地演示不修改浏览器路由。')]
 }[current];
}
function studyOptions(label,options,extra=''){
 return `<label>${escape(label)}<select id="config">${options.map(x=>option(...x)).join('')}</select></label>${extra}`;
}
function miniTop(){return `<div class="mini-topline"><span class="mini-brand">${T('Learning notes','学习笔记')}</span><span>${T('Practice / Review','练习 / 回顾')}</span></div>`}
function miniArticle(){return `<div class="mini-kicker">${T('A field note · Learning','实践笔记 · 学习')}</div><h3 class="mini-title">${T('Read for understanding. Return for evidence.','读懂一个观点，回到它的依据。')}</h3><p class="mini-deck">${T('A small practice session turns collected material into questions worth returning to.','把收集的材料变成值得回答的问题，在练习中发现还不理解的部分。')}</p>`}
function miniEvidence(){return `<div class="mini-evidence"><span>${T('From the source','摘自材料')}</span><blockquote>${T('“Evidence gives a reader a way to check a statement.”','“证据让读者能够核对一个说法。”')}</blockquote><p>${T('Read the claim. Find its support. Write your own question.','读到观点 → 找到依据 → 留下自己的问题')}</p></div>`}
function readingBody(){return `<div class="reading-body"><p>${T('A useful summary helps you find the main idea. A useful practice session goes further: it asks you to explain the idea and return to the part of the source that supports it.','一份有用的总结帮助你找到主要观点。一次有用的练习更进一步：让你解释这个观点，并回到材料中找到支持它的部分。')}</p><h3>${T('Leave room to think','为思考留一点空间')}</h3><p>${T('Keep the question and its choices together. Introduce supporting detail only when it is needed, and preserve the answer when the reader opens the source.','把题目与选项放在一起。需要时再展开补充内容；读者打开材料查看依据时，保留已经选择的答案。')}</p><p class="reading-note">${T('A shorter line and a little space can make relationships easier to see. Validate the choice with actual content.','适当的行宽和留白有助于看清内容之间的关系；仍需用真实文字检查是否合适。')}</p></div>`}
export function renderStudy(){
 let html='',controls='';const mode=configs[current];
 if(current==='grid'){
  html=`<div class="mini-page">${miniTop()}<div class="mini-grid ${mode==='equal'?'equal':mode==='stack'?'stack':''}" id="layout-grid"><article>${miniArticle()}${miniEvidence()}<p class="mini-meta">${T('Main story · 5 questions','主要内容 · 5 道问题')}</p></article><article class="mini-secondary"><p class="mini-kicker">${T('On the side','延伸阅读')}</p><h3>${T('A question to keep','留一个问题')}</h3><p>${T('Which part of the material changed your original understanding?','材料中的哪一部分改变了你原来的理解？')}</p><p class="mini-meta">${T('Secondary detail','次要内容')}</p></article></div></div>`;
  controls=studyOptions(T('Column relationship','分栏关系'),[['editorial','Lead + secondary','主次双栏'],['equal','Equal columns','等宽双栏'],['stack','Single column','单栏']]);
 }else if(current==='workspace'){
  html=`<div class="frame-controls"><span>${T('Preview viewport','预览视口')}</span><output id="frame-mode">${T(mode==='mobile'?'Mobile · up to 390 px wide · scroll inside':'Desktop · adapts to available width',mode==='mobile'?'手机 · 最大宽度 390 px · 内部可滚动':'桌面 · 随可用宽度调整')}</output></div><div class="viewport-stage"><div id="study-frame" class="study-frame ${mode==='mobile'?'mobile':''}" tabindex="0" role="region" aria-label="${T('Scrollable workspace preview','可滚动的工作区预览')}"><div class="mini-workspace"><article class="mini-question"><p class="hint">${T('Question 2 of 5','第 2 / 5 题')}</p><h3>${T('What makes a claim trustworthy?','什么让一个观点值得相信？')}</h3><div class="mini-options"><label><input type="radio" name="study-answer" value="a"><span>${T('It appears repeatedly.','它被重复提及。')}</span></label><label><input type="radio" name="study-answer" value="b"><span>${T('It can be checked against evidence.','它可以根据证据核对。')}</span></label></div>${action('study-submit','Check answer','核对答案')} <button type="button" id="source-toggle" class="mini-source-toggle" aria-expanded="false" aria-controls="workspace-source">${T('View source','查看材料')}</button><p id="workspace-feedback" class="hint" role="status" style="margin-top:12px"></p></article><aside id="workspace-source" class="mini-source" data-open="false" ${mode==='mobile'?'hidden':''}><h3>${T('Source material','参考材料')}</h3><p>${T('Evidence gives a reader a way to check a statement. Repetition alone does not establish whether it is accurate.','证据让读者能够核对一个说法。仅凭重复出现，并不能判断这个说法是否准确。')}</p></aside></div></div></div>`;
  controls=studyOptions(T('Preview viewport','预览尺寸'),[['desktop','Desktop','桌面'],['mobile','Mobile','手机']]);
 }else if(current==='typography'||current==='rhythm'){
  html=`<article class="mini-reading ${current==='typography'&&mode==='sans'?'sans':''} ${current==='typography'&&mode==='large'?'large-type':''}" id="reading-study" ${current==='rhythm'?`style="--study-leading:${mode==='compact'?'1.5':'1.9'};--study-space:${mode==='compact'?'12':'26'}px;--study-measure:${lang==='zh'?(mode==='compact'?'36em':'28em'):(mode==='compact'?'72ch':'60ch')}"`:''}>${miniTop()}<div class="reading-column">${miniArticle()}${readingBody()}</div></article>`;
  controls=current==='typography'?studyOptions(T('Heading treatment','标题层次'),[['serif','Serif headings','衬线标题'],['sans','Sans-serif headings','无衬线标题'],['large','Larger contrast','更大的字号对比']]):studyOptions(T('Reading density','阅读密度'),[['comfortable','Comfortable','舒展'],['compact','Compact','紧凑']]);
 }else if(current==='scroll'){
  html=`<div class="preview-scroll" id="scroll-study" data-effect="${mode}" tabindex="0" role="region" aria-label="${T('Scrollable page preview','可滚动的页面预览')}"><div class="scroll-header"><span>${T('Learning journal','学习札记')}</span><div class="scroll-progress" aria-hidden="true"><span id="reading-progress"></span></div></div>${[0,1,2].map((n)=>`<section class="scroll-section"><div class="reveal-item"><span class="mini-kicker">${T(['Start with a question','Find the evidence','Return to practice'][n],['从一个问题开始','找到材料中的依据','回到练习'][n])}</span><h3>${T(['What do you want to understand?','Keep the source within reach.','A useful next step.'][n],['你想理解什么？','让原文触手可及。','留下有用的下一步。'][n])}</h3><p>${T(['Before collecting more material, write down one thing you would like to explain in your own words.','Compare the explanation with its source. Which sentence supports the claim, and what remains uncertain?','Turn the question into a small practice task. Keep your answer so that you can compare it with your next attempt.'][n],['在继续收集材料前，先记下一个你想用自己的话解释清楚的问题。','把解释与原文对照。哪句话支持了这个观点？还有哪些部分不能确定？','把问题变成一个小练习，留下这次的回答，方便与下一次的理解对照。'][n])}</p>${miniEvidence()}</div></section>`).join('')}</div>`;
  controls=studyOptions(T('Entry effect','进入效果'),[['fade','Fade only','原位淡入'],['slide','Fade + upward movement','淡入并上移']],action('study-replay','Replay','重新体验'));
 }else if(current==='transition'){
  html=`<div class="motion-switch-nav" role="group" aria-label="${T('Local views','本地视图')}"><button type="button" data-view="overview" aria-pressed="true">${T('Overview','概览')}</button><button type="button" data-view="notes" aria-pressed="false">${T('Notes','笔记')}</button></div><article id="switch-view" class="switch-view" aria-live="polite">${miniArticle()}${miniEvidence()}</article>`;
  controls=studyOptions(T('Transition style','切换方式'),[['fade','Fade in place','原位淡入'],['slide','Fade + short slide','淡入与短距离位移']],action('study-replay','Replay','重新体验'));
 }
 return {html,controls};
}
function mountStudy(){
 if(previewObserver){previewObserver.disconnect();previewObserver=null}
 if(current==='transition'&&(reduce||media.matches))$('switch-view').className='switch-view';
 if(current==='workspace'&&'ResizeObserver' in window){
  const frame=$('study-frame');
  const active=new ResizeObserver(()=>{
   if(previewObserver!==active||!frame.isConnected)return;
   const w=frame.clientWidth,h=frame.clientHeight;
   $('workspace-source').hidden=(configs.workspace==='mobile'||w<=560)&&$('source-toggle').getAttribute('aria-expanded')!=='true';
   $('frame-mode').textContent=T(`${configs.workspace==='mobile'?'Mobile':'Desktop'} · ${w} × ${h} px · scroll inside`,`${configs.workspace==='mobile'?'手机':'桌面'} · ${w} × ${h} px · 内部可滚动`);
  });
  previewObserver=active;active.observe(frame);
 }
 if(current!=='scroll')return;
 const region=$('scroll-study'),items=[...region.querySelectorAll('.reveal-item')];
 if(observer){observer.disconnect();observer=null}
 const reduced=reduce||media.matches;
 if(reduced||!('IntersectionObserver' in window)){region.classList.remove('has-observer');items.forEach(el=>el.classList.add('in-view'))}
 else{
  region.classList.add('has-observer');items.forEach(el=>el.classList.remove('in-view'));
  const activeObserver=new IntersectionObserver(entries=>{if(observer!==activeObserver)return;for(const e of entries)if(e.isIntersecting){e.target.classList.add('in-view');activeObserver.unobserve(e.target)}},{root:region,threshold:.15});
  observer=activeObserver;
  items.forEach(el=>observer.observe(el));
 }
 function progress(){const total=region.scrollHeight-region.clientHeight;$('reading-progress').style.width=(total>0?Math.min(100,Math.max(0,region.scrollTop/total*100)):0)+'%'}
 region.onscroll=progress;progress();
}
export function pageAction(event){
 if(current==='workspace'){
  if(event.target.closest('#source-toggle')){const b=$('source-toggle'),open=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!open));$('workspace-source').hidden=open;$('workspace-source').dataset.open=String(!open);b.textContent=T(open?'View source':'Hide source',open?'查看材料':'收起材料')}
  if(event.target.closest('[data-action=study-submit]')){const answer=$('canvas').querySelector('input[name=study-answer]:checked');$('workspace-feedback').textContent=answer?T(answer.value==='b'?'Supported by the source.':'Check the source and try again.',answer.value==='b'?'与原文依据一致。':'查看原文依据后再试一次。'):T('Choose an answer first.','请先选择一个答案。')}
 }
 const view=event.target.closest('[data-view]');
 if(current==='transition'&&view){
  const next=view.dataset.view;if(view.getAttribute('aria-pressed')==='true')return;
  $('canvas').querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===view)));
  $('switch-view').innerHTML=next==='overview'?`${miniArticle()}${miniEvidence()}`:`<p class="mini-kicker">${T('Notes from practice','练习笔记')}</p><h3 class="mini-title">${T('Keep the question. Check the source.','保留问题，核对原文。')}</h3>${readingBody()}`;
  $('switch-view').className='switch-view';
  if(!(reduce||media.matches)){void $('switch-view').offsetWidth;$('switch-view').classList.add('animate-'+configs.transition)}
 }
 if(event.target.closest('[data-action=study-replay]')){
  if(current==='scroll'){$('scroll-study').scrollTop=0;mountStudy()}
  else if(current==='transition'){$('switch-view').className='switch-view';if(!(reduce||media.matches)){void $('switch-view').offsetWidth;$('switch-view').classList.add('animate-'+configs.transition)}}
 }
}
