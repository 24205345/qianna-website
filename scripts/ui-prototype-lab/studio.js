// The supplied React reference informs the workflow; this buildless implementation
// keeps the existing seventeen studies, offline delivery and editorial site language.
const studioPresets={
 curated:{name:['Curated portfolio','策展作品集'],layout:'editorial',type:'serif',radius:'16',space:'relaxed',hover:'lift'},
 archive:{name:['Visual archive','图像档案'],layout:'gallery',type:'serif',radius:'0',space:'relaxed',hover:'border'},
 index:{name:['Project index','项目索引'],layout:'list',type:'sans',radius:'8',space:'compact',hover:'border'}
};
const studioOptions={
 layout:{name:['Page layout','页面版式'],values:[['editorial','Editorial split','策展分栏'],['gallery','Image gallery','图像网格'],['list','Project list','项目列表']]},
 type:{name:['Heading type','标题字体'],values:[['serif','Serif','衬线'],['sans','Sans serif','无衬线']]},
 radius:{name:['Card corners','卡片圆角'],values:[['0','0 px','0 px'],['8','8 px','8 px'],['16','16 px','16 px']]},
 space:{name:['Content spacing','内容间距'],values:[['relaxed','Generous · 24 px','舒展 · 24 px'],['compact','Compact · 12 px','紧凑 · 12 px']]},
 hover:{name:['Card hover','卡片悬停'],values:[['lift','Lift · 4 px','上移 · 4 px'],['border','Border only','仅边框']]}
};
const studio={...studioPresets.curated,preset:'curated',inspect:true,viewport:'desktop',panel:'style',filter:'all'};
let studioReturnFocus=null;
const studioName=key=>{const field=studioOptions[key];return T(...field.values.find(v=>v[0]===studio[key]).slice(1))};
function studioControl(text,action,selected=false){return studio.inspect?`<span class="${selected?'is-current':''}">${text}</span>`:`<button type="button" data-site="${action}" ${action.startsWith('filter:')?`aria-pressed="${selected}"`:''} class="${selected?'is-current':''}">${text}</button>`}
export function renderStudioToolbar(){
 return `<div class="studio-tools"><div class="studio-presets" role="group" aria-label="${T('Starting layouts','起始方案')}">${Object.entries(studioPresets).map(([id,p])=>`<button type="button" data-preset="${id}" aria-pressed="${studio.preset===id}">${T(...p.name)}</button>`).join('')}</div><div class="studio-view-tools"><button type="button" data-studio-view="desktop" aria-pressed="${studio.viewport==='desktop'}">${T('Desktop','桌面')}</button><button type="button" data-studio-view="phone" aria-pressed="${studio.viewport==='phone'}">${T('Phone','手机')}</button><button type="button" class="studio-inspect" data-studio-inspect aria-pressed="${studio.inspect}">${T(studio.inspect?'Inspect parts':'Try the website',studio.inspect?'认识部位':'体验网页')}</button></div></div>`;
}
export function renderStudioPage(){
 const text=(en,zh)=>T(en,zh),n=(id,en,zh)=>studio.inspect?text(...pageParts[id].name):text(en,zh);
 const projects=[{id:'one',kind:'design',image:'landscape',en:'Project placeholder one',zh:'项目标题占位一',meta:['Design study','设计研究']},{id:'two',kind:'image',image:'poster',en:'Project placeholder two',zh:'项目标题占位二',meta:['Image study','图像练习']},{id:'three',kind:'design',image:'object',en:'Project placeholder three',zh:'项目标题占位三',meta:['Personal project','个人项目']}].filter(p=>studio.filter==='all'||p.kind===studio.filter);
 const cards=projects.map(p=>`<span class="studio-project"><span class="studio-cover art-${p.image}" aria-hidden="true"><span class="art-shape"></span><span class="art-mark">${p.image==='poster'?'Aa':p.image==='object'?'↗':''}</span></span><span class="studio-project-meta">${text(...p.meta)}<span>2026</span></span><span class="studio-project-title">${text(p.en,p.zh)}</span><span class="studio-project-copy">${text('A brief introduction to the project and the question behind it.','这里是一段项目介绍，简要说明作品的方向与核心问题。')}</span>${studioControl(text('Explore project ↗','查看项目 ↗'),'project:'+p.id)}</span>`).join('');
 return `<div class="studio-viewport" data-viewport="${studio.viewport}"><div class="anatomy-page studio-page" data-layout="${studio.layout}" data-type="${studio.type}" data-space="${studio.space}" data-hover="${studio.hover}" data-inspecting="${studio.inspect}" style="--studio-radius:${studio.radius}px;--studio-gap:${studio.space==='relaxed'?24:12}px">
 ${partButton('navigation',`<span class="studio-brand">${studio.inspect?text('This is the site navigation','这是站点导航'):'Portfolio — Studio'}</span><span class="studio-site-links">${studioControl(text('Work','作品'),'go:work',true)}${studioControl(text('About','关于'),'go:about')}${studioControl(text('Contact ↗','联系 ↗'),'go:contact')}</span>`,'studio-nav')}
 <div class="studio-hero"><div class="studio-hero-copy">${partButton('eyebrow',`<span class="studio-eyebrow">${studio.inspect?text('Eyebrow / Section label','这是眉标 / 栏目标签'):text('Independent practice / Selected work','独立实践 / 精选作品')}</span>`)}${partButton('title',`<span class="studio-title" role="heading" aria-level="2">${studio.inspect?text('This is the<br>main heading.','这是主标题。<br>在这里表达主题。'):text('A collection<br>of ideas & work.','项目、图像<br>与日常的练习。')}</span>`)}${partButton('intro',`<span class="studio-intro">${studio.inspect?text('This is the introduction. A short paragraph adds context to the heading and introduces the work below.','这是导语。用一小段文字补充标题，介绍创作方向，也给读者一个继续探索的理由。'):text('A place for project experiments, visual observations and ideas in progress. This is placeholder copy for a portfolio.','这里收录项目尝试、视觉观察与尚在生长的想法。这是一段作品集介绍的占位文字。')}</span>`)}</div><div class="studio-hero-art" aria-hidden="true"><span class="hero-art-page"><span>Form<br>& Field</span><span>Visual studies / 2026</span></span><span class="hero-art-disc"></span><span class="hero-art-caption">Portfolio / Image placeholder</span></div></div>
 ${partButton('tabs',`<span class="studio-category-rail">${[['all','All work','全部作品'],['design','Design studies','设计研究'],['image','Image studies','图像练习']].map(([id,en,zh])=>studioControl(text(en,zh),'filter:'+id,studio.filter===id)).join('')}<span class="studio-rail-end">${text('Selected / 2026','精选 / 2026')}</span></span>`)}
 <div class="studio-content-row" id="studio-work">${partButton('sidebar',`<span class="studio-small-heading">${n('sidebar','In this collection','作品目录')}</span><span class="studio-side-links">${studioControl(text('All projects','全部项目'),'filter:all',studio.filter==='all')}${studioControl(text('Design studies','设计研究'),'filter:design',studio.filter==='design')}${studioControl(text('Image studies','图像练习'),'filter:image',studio.filter==='image')}</span>`)}
 ${partButton('content',`<span class="studio-section-heading"><span>${n('content','Selected projects','精选项目')}</span><span class="studio-count">${String(projects.length).padStart(2,'0')}</span></span><span class="studio-project-grid">${cards}</span>`)}
 ${partButton('supporting',`<span class="studio-small-heading">${n('supporting','Studio notes','关于创作者')}</span><span class="studio-profile" aria-hidden="true"><span></span></span><span class="studio-support-name">${text('A little about this practice','关于这份创作实践')}</span><span class="studio-support-copy">${text('A short biography, a related note or a link to the next conversation. All content here is placeholder material.','这里放一段个人简介、相关说明，或开启下一次交流的入口。文字仅作占位。')}</span>${studioControl(text('Get in touch ↗','联系创作者 ↗'),'go:contact')}`)}
 </div>
 ${partButton('footer',`<span class="studio-footer-title">${n('footer','Let’s make something.','让想法继续发生。')}</span><span class="studio-footer-links">${studioControl(text('Contact','联系'),'contact')}${studioControl(text('Back to top ↑','回到顶部 ↑'),'go:top')}</span><span class="studio-copyright">© 2026 Portfolio Studio · ${text('Placeholder content','示例占位内容')}</span>`,'studio-footer')}
 <p id="studio-site-status" class="studio-site-status" role="status"></p>
 </div></div>`;
}
function studioBrief(){
 const reduced=reduce||media.matches;
 return T(`Build a responsive portfolio page using placeholder copy and original image placeholders. Follow the existing site's editorial style; do not invent project results or real client information.\n\nPage structure\nSite navigation → eyebrow, main heading and introduction → category rail → section navigation, project content and supporting information → footer.\n\nVisual choices\nLayout: ${studioName('layout')}. Heading: ${studioName('type')}; body: sans serif. Card corners: ${studio.radius} px. Content gaps: ${studio.space==='relaxed'?24:12} px. Use a neutral stone palette, fine dividers and a clear primary reading area.\n\nInteraction\nCategory filters update the project collection in place, retain the selected category and show its active state. Project actions open a detail dialog; closing it returns focus to the original action. Contact displays a local example message. ${studio.hover==='lift'&&!reduced?'On devices with a mouse, raise project cards by 4 px on hover over 240 ms.':'Use a border change for hover feedback without movement.'}\n\nResponsive and accessibility\nStack the hero, section navigation, projects and supporting information in reading order on narrow screens. Let long headings wrap. Keep every action accessible by keyboard and touch. Respect reduced motion; inspection overlays and teaching controls are not part of the finished page. Verify filtering, dialog focus, mobile layout and copying before delivery.`,`请制作一个响应式作品集页面，使用占位文案和原创占位图，沿用现有网站的杂志策展风格，不编造真实项目成果或客户信息。\n\n页面结构\n站点导航 → 眉标、主标题与导语 → 分类横轨 → 页内目录、项目内容与辅助信息 → 页脚。\n\n视觉设定\n版式：${studioName('layout')}。标题：${studioName('type')}；正文：无衬线。卡片圆角 ${studio.radius} px，内容间距 ${studio.space==='relaxed'?24:12} px。使用中性灰色系、细分隔线与明确的主次阅读区域。\n\n交互规则\n分类在原位筛选项目，保留当前选择并标出激活状态。点击项目打开详情弹窗，关闭后焦点回到原入口；联系入口显示本地示例提示。${studio.hover==='lift'&&!reduced?'有鼠标的设备上，卡片悬停时在 240 ms 内上移 4 px。':'悬停只改变边框，不播放位移。'}\n\n响应式与可访问性\n窄屏按阅读顺序堆叠首屏、目录、项目和辅助信息，长标题自然换行。操作支持键盘和触屏，尊重减少动态效果设置。认图边框与实验室控件不进入最终页面。交付前检查筛选、弹窗焦点、手机布局和复制结果。`);
}
export function studioPartRequest(id){
 if(id==='title')return T(`Make the page heading the most prominent text, using ${studio.type==='serif'?'serif':'sans-serif'} type and left alignment. Let long headings wrap naturally on a phone.`,`让页面主标题最醒目，使用${studio.type==='serif'?'衬线':'无衬线'}字体并左对齐；手机上长标题自然换行，不截断文字。`);
 if(id==='content')return T(`Use the ${studioName('layout').toLowerCase()} arrangement for the project collection, with ${studio.radius} px card corners and ${studio.space==='relaxed'?24:12} px gaps. Category filters update this collection; a project opens its detail dialog. Stack projects in reading order on a phone.`,`项目区域采用${studioName('layout')}，卡片圆角 ${studio.radius} px、间距 ${studio.space==='relaxed'?24:12} px。分类在原位筛选项目，点击项目打开详情；手机按阅读顺序排列。`);
 if(id==='sidebar'&&studio.layout==='gallery')return T('Place the collection navigation above the image grid as a compact row. Mark the active category and let the row wrap on narrow screens.','把作品目录放在图像网格上方，横向排列并标出当前分类；窄屏允许自然换行。');
 return T(...pageParts[id].request);
}
function syncStudioPanel(){
 const active=current==='anatomy',aside=document.querySelector('.description');$('studio-tabs').hidden=!active;$('studio-parts').hidden=active&&studio.panel!=='parts';$('studio-style').hidden=!active||studio.panel!=='style';$('studio-brief').hidden=!active||studio.panel!=='brief';
 if(active){aside.removeAttribute('aria-labelledby');aside.setAttribute('aria-label',T('Design inspector','设计实验面板'))}else{aside.removeAttribute('aria-label');aside.setAttribute('aria-labelledby','selected-name')}
 if(!active)return;
 $('studio-tabs').setAttribute('aria-label',T('Inspector','实验面板'));
 $('studio-tabs').innerHTML=[['parts','Parts','部位说明'],['style','Styles','调整样式'],['brief','Page brief','整页需求']].map(([id,en,zh])=>`<button type="button" role="tab" id="studio-tab-${id}" data-studio-panel="${id}" aria-controls="${id==='parts'?'studio-parts':'studio-'+id}" aria-selected="${studio.panel===id}" tabindex="${studio.panel===id?0:-1}">${T(en,zh)}</button>`).join('');
 $('studio-parts').setAttribute('role','tabpanel');$('studio-parts').setAttribute('aria-labelledby','studio-tab-parts');$('studio-style').setAttribute('aria-labelledby','studio-tab-style');$('studio-brief').setAttribute('aria-labelledby','studio-tab-brief');
 $('studio-style').innerHTML=`<h2 class="studio-panel-title">${T('Make it your own.','把样子调出来。')}</h2><p class="studio-panel-intro">${T('Change a choice. See the page and its brief update together.','改变一个选项，页面与需求文本会一起更新。')}</p>${Object.entries(studioOptions).map(([key,field])=>`<fieldset class="studio-field"><legend>${T(...field.name)}</legend><div>${field.values.map(([value,en,zh])=>`<button type="button" data-studio-setting="${key}" data-value="${value}" aria-pressed="${studio[key]===value}">${T(en,zh)}</button>`).join('')}</div></fieldset>`).join('')}<button type="button" data-studio-panel="brief" class="studio-see-brief">${T('Review the page brief →','查看当前整页需求 →')}</button>`;
 $('studio-brief').innerHTML=`<h2 class="studio-panel-title">${T('A brief you can use.','把选择变成需求。')}</h2><p class="studio-panel-intro">${T('Includes the whole page, your visual choices and working interactions.','包含整页结构、当前视觉选择与交互规则。')}</p><textarea id="studio-page-prompt" readonly spellcheck="false" aria-label="${T('Page requirements','整页需求文本')}">${escape(studioBrief())}</textarea><button type="button" id="studio-copy-page">${T('Copy page brief','复制整页需求')}</button><p id="studio-copy-status" role="status"></p>`;
}
function refreshStudio(focus){
 const scroll=$('canvas').scrollTop;render();$('canvas').scrollTop=scroll;
 if(focus)document.querySelector(focus)?.focus({preventScroll:true});
}
export function studioAction(event){
 const el=event.target.closest('[data-preset],[data-studio-setting],[data-studio-view],[data-studio-inspect],[data-studio-panel],[data-site]');
 if(!el||current!=='anatomy')return false;
 if(el.dataset.preset){Object.assign(studio,studioPresets[el.dataset.preset],{preset:el.dataset.preset});refreshStudio(`[data-preset="${studio.preset}"]`)}
 else if(el.dataset.studioSetting){const key=el.dataset.studioSetting;if(!studioOptions[key]?.values.some(v=>v[0]===el.dataset.value))return true;studio[key]=el.dataset.value;studio.preset='';refreshStudio(`[data-studio-setting="${key}"][data-value="${studio[key]}"]`)}
 else if(el.dataset.studioView){studio.viewport=el.dataset.studioView;refreshStudio(`[data-studio-view="${studio.viewport}"]`)}
 else if(el.hasAttribute('data-studio-inspect')){studio.inspect=!studio.inspect;refreshStudio('[data-studio-inspect]')}
 else if(el.dataset.studioPanel){studio.panel=el.dataset.studioPanel;syncStudioPanel();document.querySelector(`[role=tab][data-studio-panel="${studio.panel}"]`)?.focus({preventScroll:true})}
 else if(el.dataset.site){
  const [action,id]=el.dataset.site.split(':');
  if(action==='filter'){studio.filter=id;refreshStudio(`[data-site="filter:${id}"]`)}
  if(action==='go'){const target=id==='top'?document.querySelector('.studio-nav'):id==='work'?$('studio-work'):document.querySelector('[data-region="supporting"]');target?.scrollIntoView({block:'nearest',behavior:'instant'})}
  if(action==='contact'||(action==='go'&&id==='contact')){$('studio-site-status').textContent=T('Contact example triggered. No message was sent.','已触发联系示例，没有发送消息。');$('studio-site-status').scrollIntoView({block:'nearest',behavior:'instant'})}
  if(action==='project'){studioReturnFocus=el;$('studio-project-title').textContent=T('Project detail placeholder','项目详情占位');$('studio-project-info').textContent=T('This local example opens a detail view. Replace this paragraph with your project overview, process and images.','这是本地演示的项目详情。正式使用时，把这段文字替换为项目概述、过程与图片。');$('studio-project-close').textContent=T('Close details','关闭详情');$('studio-project-dialog').showModal()}
 }
 return true;
}
document.addEventListener('keydown',event=>{
 if(!event.target.matches('#studio-tabs [role=tab]'))return;
 const ids=['parts','style','brief'],i=ids.indexOf(studio.panel);let next;
 if(event.key==='ArrowRight')next=ids[(i+1)%3];else if(event.key==='ArrowLeft')next=ids[(i+2)%3];else if(event.key==='Home')next=ids[0];else if(event.key==='End')next=ids[2];else return;
 event.preventDefault();studio.panel=next;syncStudioPanel();$('studio-tab-'+next).focus();
});
document.addEventListener('click',async event=>{
 if(event.target.closest('#studio-project-close'))$('studio-project-dialog').close();
 if(!event.target.closest('#studio-copy-page'))return;
 const snapshot=$('studio-page-prompt').value;
 try{await navigator.clipboard.writeText(snapshot);if($('studio-page-prompt')?.value===snapshot)$('studio-copy-status').textContent=T('Copied.','已复制。')}
 catch{if($('studio-page-prompt')?.value!==snapshot)return;$('studio-page-prompt').focus();$('studio-page-prompt').select();$('studio-copy-status').textContent=T('Copy the selected text manually.','请手动复制已选中的文字。')}
});
$('studio-project-dialog').addEventListener('close',()=>{if(studioReturnFocus?.isConnected)studioReturnFocus.focus()});
