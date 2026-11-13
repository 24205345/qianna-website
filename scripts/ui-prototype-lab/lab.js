'use strict';
const $=id=>document.getElementById(id);
const groups=[{id:'basics',en:'Know the page',zh:'认识页面',items:['anatomy']},{id:'layout',en:'Arrange content',zh:'安排布局',items:['grid','workspace','footer']},{id:'type',en:'Style the text',zh:'调整文字',items:['typography','rhythm']},{id:'motion',en:'Add motion',zh:'体验动效',items:['scroll','transition']},{id:'components',en:'Try components',zh:'操作组件',items:['cta','button','card','input','tabs','accordion','overlay','feedback','ai']}];
const ids=groups.flatMap(g=>g.items);
const groupFor=id=>groups.find(g=>g.items.includes(id));
const params=new URLSearchParams(location.search);
const lang=params.get('lang')==='zh'?'zh':'en';
let current=ids.includes(params.get('demo'))?params.get('demo'):'anatomy';
let selectedPart='title';
let duration=240,reduce=false,timer=null,observer=null,previewObserver=null,step=0,paused=false,canceled=false,failed=false,tab=0,returnFocus=null;
const media=matchMedia('(prefers-reduced-motion: reduce)');
const configs={cta:'priority',footer:'grouped',grid:'editorial',workspace:'desktop',typography:'serif',rhythm:'comfortable',scroll:'slide',transition:'fade',button:'default',card:'4',input:'blur',tabs:'0',accordion:'single',overlay:'modal',feedback:'inline',ai:'stream'};
const T=(en,zh)=>lang==='zh'?zh:en;
const labels={cta:['Call to action','行动入口'],footer:['Footer links','页脚链接'],anatomy:['Anatomy of a page','页面的组成'],grid:['Editorial grid','内容网格'],workspace:['Split workspace','分屏工作区'],typography:['Type hierarchy','文字层级'],rhythm:['Reading rhythm','阅读节奏'],scroll:['Scroll & reveal','滚动与进入'],transition:['View transitions','视图切换'],button:['Button','按钮'],card:['Card','卡片'],input:['Input','输入框'],tabs:['Tabs','标签页'],accordion:['Accordion','折叠面板'],overlay:['Modal & drawer','弹窗与抽屉'],feedback:['Feedback','操作反馈'],ai:['AI results','AI 结果']};
const names=id=>T(...labels[id]);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const option=(value,en,zh)=>`<option value="${value}" ${configs[current]===value?'selected':''}>${escape(T(en,zh))}</option>`;
const action=(id,en,zh,disabled=false)=>`<button type="button" data-action="${id}" ${disabled?'disabled':''}>${escape(T(en,zh))}</button>`;
function stop(){if(timer!==null){clearInterval(timer);clearTimeout(timer);timer=null}if(observer){observer.disconnect();observer=null}if(previewObserver){previewObserver.disconnect();previewObserver=null}}
function url(){const q=new URLSearchParams({lang,demo:current});history.replaceState(null,'',location.pathname+'?'+q)}
function motion(){document.documentElement.classList.toggle('reduced',reduce||media.matches);document.documentElement.style.setProperty('--duration',duration+'ms');$('motion-note').textContent=media.matches?T('Your system requests reduced motion.','系统已启用减少动态效果。'):T('Example timings, not task completion times.','这里调整的是过渡时长，不是任务处理速度。')}
/* PAGE_STUDIES */
/* REFERENCE_STUDIES */
/* LESSONS */
/* ORIENTATION */
/* STUDIO */
function descriptions(){
 $('copy-status').textContent='';
 const d=duration+' ms',r=reduce||media.matches;
 const data=(current==='anatomy'?anatomyDetails():referenceDetails()||studyDetails())||{
 button:[T('A button needs visible states, not just a label.','按钮除了文字，还要表达当前能不能操作。'),T('In Default, hover, press, focus with Tab, or click. Other selections show state snapshots.','默认模式下悬停、按下、用 Tab 聚焦或点击；其他选项展示状态快照。'),T('Use background and outline changes; prevent duplicate activation while loading. The default click simulates a 1.2-second task.','用底色、轮廓区分状态；加载中防止重复操作。默认模式点击后模拟 1.2 秒任务。'),T('After a real operation, restore the label and allow another attempt. The Loading snapshot stays until you select another state.','真实操作结束后恢复按钮；选中的“加载中”快照则保留到你切换其他状态。')],
 card:[T('A card groups one item and its main action.','卡片把一个条目及其主要操作放在一起。'),T('Hover with a pointer, or focus with a keyboard.','指针悬停，或用键盘聚焦。'),T(`Raise by ${configs.card} px over ${d}, with a darker border. Keyboard focus uses an outline.`,`在 ${d} 内上移 ${configs.card} px，边框加深；键盘聚焦用轮廓提示。`),T('Return on pointer leave. Touch activation opens the item directly.','移出后复原；触屏直接激活条目，不依赖悬停。')],
 input:[T('An input explains what to enter and how to correct it.','输入框需要解释填什么，以及怎样改错。'),configs.input==='blur'?T('Validate after leaving the field, and on submit.','离开输入框或提交时校验。'):T('Validate on submit; clear an existing error once corrected.','提交时校验；已有错误在改正后清除。'),T('Keep the entered value; show a textual error below the field.','保留已填内容，在下方显示文字错误。'),T('Require at least 3 non-space characters. This is local demo validation.','至少输入 3 个非空白字符；这里只演示本地校验。')],
 tabs:[T('Tabs switch between related views in the same place.','标签页在同一区域切换相关内容。'),T('Click, or use Left/Right and Home/End after focus.','点击，或聚焦后用左右方向键、Home / End 切换。'),T('Underline the selected tab; replace the panel without moving the page.','当前项增加底线，在原位切换内容。'),T('Keep the draft when switching tabs. Selected and keyboard-focused are different states.','切换后保留草稿；选中和键盘聚焦是两种状态。')],
 accordion:[T('An accordion hides secondary detail until requested.','折叠面板按需展开次要信息。'),T('Activate the section heading with click, Enter or Space.','点击标题，或用 Enter / Space 激活。'),T('Toggle the body and expansion indicator.','切换正文和展开指示。'),configs.accordion==='single'?T('Opening another section closes the previous one. All may be closed.','打开另一项时关闭前一项，也允许全部收起。'):T('Several sections may remain open.','允许同时展开多项。')],
 overlay:[T('A modal interrupts the task; a drawer puts detail at the side. Both examples are modal here.','弹窗用于需要关注的操作，抽屉在侧边提供详情；这里两者都阻止操作背景。'),T('Click Open.','点击“打开”。'),configs.overlay==='drawer'?T('Show a right-side drawer over a dimmed backdrop.','从右侧显示抽屉，背景覆盖遮罩。'):T('Show a centered dialog over a dimmed backdrop.','居中显示弹窗，背景覆盖遮罩。'),T('Focus stays inside; Esc, backdrop or Close dismisses it. Return focus to the opener. Keep the draft until this page is reloaded.','焦点留在浮层内；Esc、遮罩或关闭按钮退出，并回到打开按钮。草稿仅保留到本页刷新前。')],
 feedback:[T('Feedback confirms what happened without guessing.','反馈用来说明发生了什么，不能把处理中写成成功。'),T('Click Show feedback.','点击“显示反馈”。'),configs.feedback==='toast'?T('Show a dismissible toast without moving keyboard focus.','显示可手动关闭的提示，不移动键盘焦点。'):T('Show a status message beside the operation.','在操作附近显示状态说明。'),T('No automatic disappearance. This confirms a simulation, not a saved server record.','不自动消失；这里只确认模拟操作，没有保存服务器记录。')],
 ai:[T('AI output needs distinct running, partial, completed and failed states.','AI 结果要区分处理中、部分结果、完成和失败。'),T('Start the local simulation.','开始本地模拟。'),configs.ai==='stream'?T('Reveal local text in four chunks and mark it partial until the end.','把本地文字分四段展示，结束前标为“部分结果”。'):T('Show four named processing stages, then the complete result.','展示四个具名阶段，最后显示完整结果。'),T('Pause/resume, simulated failure and cancellation retain partial output. Retry starts a new simulation. No real request is sent.','暂停、模拟失败和取消都保留部分结果；重试重新开始模拟，不发送真实请求。')]
 }[current];
 $('plain').textContent=data[0];$('facts').innerHTML=data.slice(1).map((v,i)=>`<li><strong>${T(['When it happens','What changes','What to preserve'][i],['什么时候发生','具体怎样变化','还要保留什么'][i])}</strong><span>${escape(v)}</span></li>`).join('');
 const state=current==='button'?T(' State to demonstrate: ',' 演示状态：')+T(configs.button,({default:'默认',hover:'悬停',pressed:'按下',focus:'键盘聚焦',disabled:'禁用',loading:'加载中'})[configs.button]):'';
 $('prompt').value=T(`Update the existing ${names(current).toLowerCase()} pattern. Preserve unrelated content, screenshots and working behavior.\n\nTrigger: ${data[1]}\nChange: ${data[2]}${state}\nCompletion and boundaries: ${data[3]}\n\nUse a ${d} visual transition only where this study calls for motion; static layout and type changes do not need animation. This does not change request duration. ${r?'Disable motion; use a static border/status instead.':'Respect prefers-reduced-motion and provide a static alternative.'}\nSupport keyboard and touch. Do not rely on color alone. Preserve unrelated site styles; apply the selected layout, typography or motion only within this scope. Implement only this change, then verify default, active, disabled/error and narrow-screen states as applicable. Report what was actually checked.`,`请调整现有界面的“${names(current)}”，保留无关正文、截图与已正常工作的行为。\n\n触发：${data[1]}\n变化：${data[2]}${state}\n结束与边界：${data[3]}\n\n本示例需要动效时，视觉过渡时长为 ${d}；静态布局与排版调整无需添加动画，过渡时长也不代表请求耗时。${r?'关闭动态位移，用静态边框或状态文字替代。':'尊重 prefers-reduced-motion，提供静态替代。'}\n支持键盘与触屏，不能只靠颜色表达状态。仅调整本例指定的样式和行为，沿用其余站点规范。本次只实现这一项改动，按适用情况检查默认、操作中、禁用／错误与窄屏状态，说明实际验证了什么。`);
 updateBeginnerDescription();
 $('prompt').value=T(`What I want: ${$('result-sentence').textContent}\n\n`,`我想要的效果：${$('result-sentence').textContent}\n\n`)+$('prompt').value;
 if(current==='anatomy')$('prompt').value=$('prompt').value.replace(names(current),T(...pageParts[selectedPart].name));
}
function render(){
 stop();step=0;paused=false;canceled=false;failed=false;tab=0;
 document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.title=T('Interface Lab · Workbench 04','界面交互实验室 · 工作流 04');
 $('title').textContent=T('The interface lab.','界面交互实验室');$('intro').textContent=T('No design experience needed. Point to a part of the page, learn its name, then try changing it.','不需要懂设计。先认出页面上的各个部分，再动手调整，把想要的效果说清楚。');
 $('catalog-label').textContent=T('What would you like to change?','你想了解什么？');
 $('sentence-label').textContent=T('You could say','你可以这样说');$('rules-label').textContent=T('Details and boundaries','展开细节与边界');
 $('groups').setAttribute('aria-label',T('Topics','主题'));$('groups').innerHTML=groups.map(g=>`<button type="button" data-group="${g.id}" aria-pressed="${groupFor(current)===g}">${escape(T(g.en,g.zh))}</button>`).join('');
 $('duration-label').textContent=T('Transition','过渡时长');$('duration').setAttribute('aria-label',T('Transition duration','过渡时长'));$('reduce-label').textContent=T('Reduce motion','减少动态效果');motion();
 document.querySelector('.layout').classList.toggle('anatomy-layout',current==='anatomy');
 document.querySelector('.catalog').hidden=current==='anatomy';
 $('navigation').setAttribute('aria-label',T('Examples','示例选择'));$('navigation').innerHTML=current==='anatomy'?'':groupFor(current).items.map(id=>`<button type="button" data-demo="${id}" aria-current="${current===id}"><span>${escape(questionFor(id))}</span><small>${escape(names(id))}</small></button>`).join('');
 document.querySelector('.preview').setAttribute('aria-label',names(current));$('prompt-label').textContent=T('Read the complete request','查看完整需求文本');$('copy').textContent=T('Copy the request','复制这份需求');$('copy-status').textContent='';
 let html='',controls='';
 if(current==='anatomy'){html=renderAnatomy();controls=renderStudioToolbar()
 }else if(current==='cta'||current==='footer'){({html,controls}=renderReference())
 }else if(groupFor(current).id!=='components'){({html,controls}=renderStudy())
 }else if(current==='button'){
  const state=configs.button,busy=state==='loading';html=`<button type="button" class="demo-button" id="sample-button" data-state="${state}" ${state==='disabled'||busy?'disabled':''} aria-busy="${busy}">${busy?'<span class="spinner" aria-hidden="true"></span>':''}${T(busy?'Generating…':'Generate quiz',busy?'正在生成…':'生成测验')}</button><p class="hint">${T('Choose a simulated state, then try real hover, focus and click in Default.','可以选择模拟状态；切回默认后，试试真正的悬停、聚焦和点击。')}</p>`;
  controls=`<label>${T('Simulated state','模拟状态')}<select id="config">${[['default','Default','默认'],['hover','Hover','悬停'],['pressed','Pressed','按下'],['focus','Keyboard focus','键盘聚焦'],['disabled','Disabled','禁用'],['loading','Loading','加载中']].map(x=>option(...x)).join('')}</select></label>`;
 }else if(current==='card'){
  document.documentElement.style.setProperty('--lift','-'+configs.card+'px');html=`<button class="sample-card" id="sample-card" type="button"><strong>${T('A short practice session','一次简短的练习')}</strong><span>${T('5 questions · Based on your material','5 道题 · 基于你的材料')}</span></button><p id="card-status" role="status" class="hint"></p>`;controls=`<label>${T('Lift distance','上移距离')}<select id="config">${['2','4','8'].map(n=>option(n,n+' px',n+' px')).join('')}</select></label>${action('replay','Preview lift','预览位移')}`;
 }else if(current==='input'){
  html=`<form id="sample-form" novalidate><label class="field" for="sample-input">${T('Practice title','练习标题')}<input id="sample-input" name="title" aria-describedby="input-help input-error" maxlength="80" autocomplete="off"></label><p id="input-help" class="hint">${T('At least 3 non-space characters.','至少 3 个非空白字符。')}</p><p id="input-error" class="error" role="status"></p><button type="submit" style="margin-top:18px">${T('Continue','继续')}</button></form>`;controls=`<label>${T('When to validate','校验时机')}<select id="config">${option('blur','Blur + submit','离开输入框与提交')}${option('submit','Submit','提交')}</select></label>`;
 }else if(current==='tabs'){
  html=`<div role="tablist" class="tabs" aria-label="${T('Practice views','练习视图')}">${[T('Questions','题目'),T('Source','材料')].map((s,i)=>`<button role="tab" id="tab-${i}" aria-controls="panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" type="button">${s}</button>`).join('')}</div><div class="panel" role="tabpanel" id="panel-0" aria-labelledby="tab-0"><label class="field">${T('Your draft answer','你的回答草稿')}<input id="answer-draft" placeholder="${T('Type, switch, then come back','先输入，再切走，回来看看')}" autocomplete="off"></label></div><div class="panel" role="tabpanel" id="panel-1" aria-labelledby="tab-1" hidden>${T('Source: evidence lets readers check a claim. Repetition alone does not establish accuracy.','材料：证据让读者核对一个说法；重复出现本身不能证明说法准确。')}</div>`;
 }else if(current==='accordion'){
  html=`<p class="hint">${T('Review after submission · Answer: check against evidence','提交后的回顾 · 答案：根据证据核对')}</p>`+[T('Why this answer?','为什么选这个答案？'),T('View source evidence','查看原文依据')].map((title,i)=>`<div class="accordion-item"><button type="button" id="acc-${i}" aria-expanded="false" aria-controls="acc-body-${i}"><span>${title}</span><span aria-hidden="true">+</span></button><div class="accordion-body" id="acc-body-${i}" hidden>${T(i?'Source: evidence gives a reader a way to check a statement. Repetition alone does not establish accuracy.':'A claim is more trustworthy when you can check its supporting evidence. Repetition is not enough.',i?'原文：证据让读者能够核对一个说法。仅凭重复出现，并不能判断它是否准确。':'能核对支持观点的依据，才更有理由相信这个观点。重复出现本身还不够。')}</div></div>`).join('');controls=`<label>${T('Expansion rule','展开规则')}<select id="config">${option('single','One at a time','每次一项')}${option('multiple','Multiple','允许多项')}</select></label>`;
 }else if(current==='overlay'){
  html=`<p>${T('Inspect the source without leaving your current question.','不离开当前题目，查看材料详情。')}</p>${action('open-dialog','Open source','打开材料')}<p class="hint">${T('Try Tab, Shift+Tab, Escape and the backdrop.','试试 Tab、Shift+Tab、Esc 和点击遮罩。')}</p>`;controls=`<label>${T('Presentation','呈现形式')}<select id="config">${option('modal','Centered modal','居中弹窗')}${option('drawer','Right drawer','右侧抽屉')}</select></label>`;
 }else if(current==='feedback'){
  html=`${action('feedback','Show feedback','显示反馈')}<div id="feedback-slot"></div>`;controls=`<label>${T('Placement','反馈位置')}<select id="config">${option('inline','Inline','操作附近')}${option('toast','Toast','浮动提示')}</select></label>`;
 }else{html=`<div><span class="status" id="run-status" role="status">${T('Ready to simulate','等待开始模拟')}</span><div class="progress" role="progressbar" id="progress" aria-label="${T('Simulation steps','模拟步骤')}" aria-valuemin="0" aria-valuemax="4" aria-valuenow="0"><span id="bar" style="width:0%"></span></div><span id="partial" class="badge">${T('No result yet','暂无结果')}</span><div class="result" id="result"></div></div><div class="actions" id="run-actions">${action('start','Start','开始')}${action('pause','Pause','暂停',true)}${action('fail','Simulate failure','模拟失败',true)}${action('cancel','Cancel','取消',true)}</div>`;controls=`<label>${T('Result presentation','结果呈现')}<select id="config">${option('stream','Streaming chunks','分段流式展示')}${option('stages','Named stages','具名阶段')}</select></label>`;}
 document.querySelector('.toolbar').hidden=!['button','card','ai','scroll','transition'].includes(current);
 $('canvas').classList.toggle('page-study',current==='cta'||groupFor(current).id!=='components');$('canvas').innerHTML=html;$('controls').innerHTML=controls;enhanceControls();descriptions();mountStudy();syncStudioPanel();url();
}
function validate(submit=false){const input=$('sample-input'),valid=input.value.replace(/\s/g,'').length>=3;input.setAttribute('aria-invalid',String(!valid));$('input-error').textContent=valid?(submit?T('Valid in this simulation. Nothing was saved.','本地校验通过，没有保存数据。'):''):T('Enter at least 3 non-space characters.','请输入至少 3 个非空白字符。');if(submit&&!valid)input.focus();return valid}
function switchTab(n,focus){tab=n;for(let i=0;i<2;i++){const el=$('tab-'+i);el.setAttribute('aria-selected',String(i===n));el.tabIndex=i===n?0:-1;$('panel-'+i).hidden=i!==n;}if(focus)$('tab-'+n).focus()}
const chunks=()=>[T('First, identify the main claim.\n','首先，找出材料的主要观点。\n'),T('Then locate supporting evidence.\n','然后，定位支持观点的证据。\n'),T('Compare exceptions and limitations.\n','接着，比较例外与限制。\n'),T('Finally, turn the material into practice questions.','最后，把材料变成练习问题。')];
function runUI(){
 const focused=document.activeElement?.closest('#run-actions button')?.dataset.action;
 const done=step===4,active=timer!==null;
 $('run-status').textContent=failed?T(step?'Failed · partial output retained':'Failed · no output yet',step?'失败 · 保留部分结果':'失败 · 暂无已生成内容'):canceled?T(step?'Canceled · partial output retained':'Canceled · no output yet',step?'已取消 · 保留部分结果':'已取消 · 暂无已生成内容'):done?T('Complete · simulation only','已完成 · 仅模拟'):paused?T('Paused','已暂停'):T(['Preparing material','Reading material','Organizing notes','Checking result'][step],['准备材料','读取材料','整理笔记','检查结果'][step]);
 $('progress').setAttribute('aria-valuenow',String(step));$('bar').style.width=step*25+'%';$('partial').textContent=done?T('Complete result','完整结果'):step?T('Partial result','部分结果'):T('No result yet','暂无结果');
 $('result').textContent=configs.ai==='stream'||done?chunks().slice(0,step).join(''):T('The final text appears after all stages.','全部阶段结束后展示正文。');
 $('run-actions').innerHTML=action('start',failed||canceled?'Retry from start':'Restart',failed||canceled?'从头重试':'重新开始',active)+action('pause',paused?'Resume':'Pause',paused?'继续':'暂停',done||failed||canceled)+action('fail','Simulate failure','模拟失败',!active)+action('cancel','Cancel','取消',done||failed||canceled);
 if(focused){const button=$('run-actions').querySelector('[data-action="'+focused+'"]');(button&&!button.disabled?button:$('run-actions').querySelector('button:not(:disabled)'))?.focus()}
}
function schedule(){stop();timer=setInterval(()=>{if(document.hidden)return;step++;if(step>=4)stop();runUI()},1000);runUI()}
document.addEventListener('click',event=>{
 if(studioAction(event))return;
 const part=event.target.closest('[data-part]');if(part){selectPagePart(part.dataset.part);return}
 const choice=event.target.closest('[data-config]');if(choice){$('config').value=choice.dataset.config;$('config').dispatchEvent(new Event('change',{bubbles:true}));return}
 const group=event.target.closest('[data-group]');if(group){current=groups.find(g=>g.id===group.dataset.group).items[0];render();$('groups').querySelector('[aria-pressed=true]').focus();return}
 pageAction(event);referenceAction(event);
 const nav=event.target.closest('[data-demo]');if(nav){current=nav.dataset.demo;render();$('navigation').querySelector('[aria-current=true]').focus();return}
 if(event.target.closest('#sample-button')){const b=$('sample-button');b.disabled=true;b.setAttribute('aria-busy','true');b.textContent=T('Generating…','正在生成…');stop();timer=setTimeout(()=>{timer=null;b.disabled=false;b.setAttribute('aria-busy','false');b.textContent=T('Generate quiz','生成测验')},1200)}
 if(event.target.closest('#sample-card'))$('card-status').textContent=T('Item activated in this simulation.','已在模拟中激活条目。');
 const a=event.target.closest('[data-action]')?.dataset.action;if(a==='replay'){stop();$('sample-card').classList.add('play');timer=setTimeout(()=>{$('sample-card')?.classList.remove('play');timer=null},duration+600)}
 if(a==='open-dialog'){returnFocus=event.target.closest('button');$('dialog').classList.toggle('drawer',configs.overlay==='drawer');$('dialog-title').textContent=T('Source material','材料详情');$('dialog-info').textContent=T('Source: evidence lets a reader check a claim; repetition alone does not establish accuracy. Your note remains after closing and reopening, and is cleared on reload.','原文：证据让读者核对说法；重复出现不能证明它准确。下方备注关闭后再打开仍保留，刷新清除。');$('dialog-label').textContent=T('Reading note','阅读备注');$('close-dialog').textContent=T('Close','关闭');$('dialog').showModal()}
 if(event.target.closest('#close-dialog'))$('dialog').close();
 if(a==='feedback'){$('feedback-slot').innerHTML=`<div class="notice ${configs.feedback==='toast'?'toast':''}" role="status">${action('dismiss','Close','关闭')}${T('Simulation complete. No server data was saved.','模拟操作完成，没有保存服务器数据。')}</div>`}
 if(a==='dismiss'){$('feedback-slot').replaceChildren();$('canvas').querySelector('[data-action=feedback]').focus()}
 const accordion=event.target.closest('[id^="acc-"]');if(accordion&&accordion.matches('button')){const open=accordion.getAttribute('aria-expanded')==='true';if(configs.accordion==='single')for(let i=0;i<2;i++){$('acc-'+i).setAttribute('aria-expanded','false');$('acc-'+i).lastElementChild.textContent='+';$('acc-body-'+i).hidden=true}accordion.setAttribute('aria-expanded',String(!open));accordion.lastElementChild.textContent=open?'+':'−';$(accordion.getAttribute('aria-controls')).hidden=open}
 const targetTab=event.target.closest('[role=tab]');if(targetTab)switchTab(Number(targetTab.id.slice(-1)),false);
 if(current==='ai'){if(a==='start'){stop();step=0;paused=canceled=failed=false;schedule()}if(a==='pause'){paused=!paused;if(paused){stop();runUI()}else schedule()}if(a==='fail'||a==='cancel'){stop();failed=a==='fail';canceled=a==='cancel';paused=false;runUI()}}
});
document.addEventListener('change',event=>{if(event.target.id==='config'){const state=captureStudyState();configs[current]=event.target.value;render();restoreStudyState(state);focusConfig()}if(event.target.id==='reduce'){reduce=event.target.checked;motion();descriptions();mountStudy()}});
$('duration').addEventListener('input',e=>{duration=Number(e.target.value);$('duration-value').textContent=duration+' ms';motion();descriptions()});
document.addEventListener('focusout',e=>{if(e.target.id==='sample-input'&&configs.input==='blur')validate()});
document.addEventListener('input',e=>{if(e.target.id==='sample-input'&&e.target.getAttribute('aria-invalid')==='true')validate()});
document.addEventListener('submit',e=>{if(e.target.id==='sample-form'){e.preventDefault();validate(true)}});
document.addEventListener('keydown',e=>{if(current==='tabs'&&e.target.getAttribute('role')==='tab'){let n=tab;if(e.key==='ArrowRight')n=(tab+1)%2;else if(e.key==='ArrowLeft')n=(tab+1)%2;else if(e.key==='Home')n=0;else if(e.key==='End')n=1;else return;e.preventDefault();switchTab(n,true)}});
$('dialog').addEventListener('click',e=>{if(e.target!==$('dialog'))return;const r=$('dialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('dialog').close()});
$('dialog').addEventListener('close',()=>returnFocus?.isConnected&&returnFocus.focus());
$('copy').addEventListener('click',async()=>{const snapshot=$('prompt').value;try{await navigator.clipboard.writeText(snapshot);if($('prompt').value!==snapshot)return;$('copy-status').textContent=T('Copied.','已复制。')}catch{if($('prompt').value!==snapshot)return;$('prompt-details').open=true;$('prompt').focus();$('prompt').select();$('copy-status').textContent=T('Select the text and copy manually.','请手动复制已选中的文字。')}});
media.addEventListener('change',()=>{motion();descriptions();mountStudy()});window.addEventListener('pagehide',stop);render();
