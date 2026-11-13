// A page you can point at, before asking beginners to know design terminology.
const pageParts={
 navigation:{name:['Site navigation','站点导航'],definition:['Links to the main areas of a website. It usually stays consistent as you move between pages.','通往网站不同页面的入口，通常放在顶部。同一个网站的各页面会沿用这组导航。'],everyday:['“The row of links at the very top.”','你平时说的：“页面最上面那排入口。”'],request:['Keep the site name on the left and the main page links on the right. Indicate which page I am on; let the links wrap on small screens.','顶部左边放网站名称，右边放主要页面入口；标出当前页面，手机上空间不足时允许换行。'],boundary:['These are links to other pages, while tabs below change content within this page. This teaching example selects a name rather than navigating away.','站点导航去其他页面，下面的页签切换本页内容。这里是认图示例，点击只查看名称，不跳转。']},
 eyebrow:{name:['Eyebrow / section label','眉标 / 栏目标签'],definition:['A short label above the heading that tells you which category or series the page belongs to.','主标题上方的一小行文字，用来说明内容属于哪个栏目或系列。'],everyday:['“The small line above the big title.”','你平时说的：“大标题上面那一小行字。”'],request:['Place a small, quiet category label above the main heading, aligned to the same left edge. It should explain the section without competing with the title.','在主标题上方放一行小号、灰色的栏目标签，与标题左对齐；说明所属栏目，不抢标题的注意力。'],boundary:['Keep it as supporting information. It should not be the only place that explains what this page is for.','它是辅助信息，不能只靠这一行小字解释整个页面的用途。']},
 title:{name:['Main heading','主标题'],definition:['The most prominent heading on this page. It tells the reader what the page is about.','页面最重要的标题，告诉读者“这一页讲什么”。字号和位置通常比正文更突出。'],everyday:['“The largest line of text.”','你平时说的：“页面上最大、最醒目的那行字。”'],request:['Make the page title the most prominent text, using the existing serif font and left alignment. Let long titles wrap naturally on a phone.','让页面主标题最醒目，沿用网站的衬线字体并左对齐；手机上长标题自然换行，不截断文字。'],boundary:['Use one main heading for this page and smaller section headings below it. A main heading does not need to fill the screen.','本页保留一个主标题，下方板块用次级标题；醒目不等于占满整个屏幕。']},
 intro:{name:['Introduction / deck','导语'],definition:['A short explanation directly below the heading. It helps the reader understand what they can find or do here.','紧接标题的简短说明，补充“这里有什么、你可以做什么”，帮助读者决定是否继续。'],everyday:['“The explanation under the title.”','你平时说的：“标题下面那段介绍。”'],request:['Add a brief introduction below the main heading. Use smaller, quieter body text and explain what the reader can do on this page.','在主标题下面放一段简短导语，用比标题小、颜色稍浅的正文，说明读者可以在这里做什么。'],boundary:['Use real text, keep it brief, and let it wrap. Do not hide essential instructions in tiny text.','用真实内容说明用途，保持简短并自然换行；关键操作说明不能缩成难以阅读的小字。']},
 tabs:{name:['Tabs / category rail','页签 / 分类横轨'],definition:['A row of related categories. Selecting one changes the content below and marks the current choice.','同一页面内的一排分类入口。选择某一项后，下方切换对应内容，并标出当前选中项。'],everyday:['“The row where I switch categories.”','你平时说的：“点一下就能换分类的那一排。”'],request:['Put the categories in a horizontal row above the content. Underline the selected category, switch content in place, and preserve my current input.','内容上方横向排列分类，当前项用深色底线标出；点击后在原位切换内容，保留已输入的信息。'],boundary:['Tabs are not the site navigation. Keep the active category clear for keyboard and touch users too.','页签不同于站点导航；键盘和触屏操作时，也要能判断当前分类。']},
 sidebar:{name:['Sidebar navigation','侧栏导航'],definition:['A list beside the main content that helps you choose a subsection or example.','放在主内容旁边的一组目录，帮助你选择当前栏目下的章节或示例。'],everyday:['“The list down the left side.”','你平时说的：“左边竖着排列的目录。”'],request:['Place a narrow section list to the left of the main content and mark the current item. On a phone, move it above the content so the reading area stays wide.','主内容左边放较窄的侧栏目录，标出当前项；手机上把目录移到内容上方，给正文留出宽度。'],boundary:['A sidebar is a position; it may hold navigation or supporting content. This example uses it for navigation.','侧栏首先指位置，可以放目录，也可以放补充信息；本例放的是导航。']},
 content:{name:['Main content area','主内容区'],definition:['The area for the primary reading or task. Its contents depend on what this page helps someone do.','承担本页主要阅读或操作的区域。文章页放正文，工具页则可能放编辑器、题目或结果。'],everyday:['“The middle area where I actually read or work.”','你平时说的：“中间真正看内容、做事情的地方。”'],request:['Give the main content most of the available width. Put its heading and main action first, group related information, and let the content flow on small screens.','把主要宽度留给主内容区，先展示核心内容和主要操作，相关信息放在一起；小屏按阅读顺序排列。'],boundary:['“Workspace” describes an area for working; “content area” is a broader term. Name the actual task when making a request.','“工作区”强调操作任务，“内容区”更通用；提需求时再说明具体要读什么、做什么。']},
 supporting:{name:['Supporting panel / secondary column','辅助面板 / 次栏'],definition:['Related information beside the main task, such as an explanation, source, or summary. It should support the task without competing with it.','主任务旁边的补充信息，比如解释、参考材料或摘要。它帮助完成任务，视觉上应弱于主内容。'],everyday:['“The explanation on the right.”','你平时说的：“右边那一栏补充说明。”'],request:['Keep supporting information in a narrower right column with a subtle dividing line. On a phone, place it after the main content and keep the reading order clear.','右边用较窄的一栏放补充说明，以细线与主内容分隔；手机上放在主内容之后，保持阅读顺序清楚。'],boundary:['A column describes the layout; a panel describes a related block of content. Do not force a desktop split onto a phone.','“分栏”说的是排列关系，“面板”说的是一组内容；手机上不必硬保留左右双栏。']},
 footer:{name:['Footer','页脚'],definition:['Information at the end of a page, often credits, contact details, or related links.','页面最下方的收尾区域，常放版权、联系信息或补充链接。'],everyday:['“The small information at the bottom.”','你平时说的：“页面最底下的那一块信息。”'],request:['Put a quiet footer after the page content, separated by a fine rule. Let it follow the content rather than covering the reading area.','在全部内容之后放简洁页脚，用细线分隔；让它随内容自然排列，不遮挡阅读区域。'],boundary:['A footer is not automatically fixed to the bottom of the screen. Specify fixed behavior separately if it serves the task.','页脚并不等于固定在屏幕底部；是否固定，需要根据任务单独说明。']}
};

const beginnerQuestions={cta:['Which action should I take next?','下一步应该点哪里？'],footer:['How should this page end?','页面怎样收尾？'],
 anatomy:['What are these parts called?','这些地方叫什么？'],grid:['How should the columns be arranged?','内容怎样分栏？'],workspace:['How does it work on a phone?','手机上怎么操作？'],typography:['Which text should stand out?','哪些文字更醒目？'],rhythm:['How can reading feel easier?','文字怎样更好读？'],scroll:['How does content appear on scroll?','滚动时怎样出现？'],transition:['How should a view change?','切换时怎样过渡？'],button:['How does a button show its state?','按钮怎样表达状态？'],card:['How does an item react to hover?','卡片怎样回应悬停？'],input:['How do I explain an input error?','填错了怎样提示？'],tabs:['How do I switch related content?','怎样切换相关内容？'],accordion:['How can I hide extra detail?','更多内容怎样展开？'],overlay:['How do I open detail on top?','详情怎样浮出来？'],feedback:['How do I confirm an action?','操作后怎样确认？'],ai:['How do I show waiting and results?','等待和结果怎么呈现？']
};
export function questionFor(id){return T(...beginnerQuestions[id])}
const everydayTerms={cta:['“Make it clear what happens when I click.”','“让我知道点下去会做什么。”'],footer:['“Put useful links at the bottom, in clear groups.”','“最下面的链接，分清楚一点。”'],
 grid:['“One column wider than the other.”','“左边大一点，右边窄一点。”'],workspace:['“Let me check the source without losing my answer.”','“一边做题，一边查材料。”'],typography:['“Make the title stand out from the body.”','“标题明显一点，正文安静一点。”'],rhythm:['“Give the text more breathing room.”','“字别挤在一起，段落间留点空。”'],scroll:['“Let this section appear when I reach it.”','“滚到这里时，这段再出现。”'],transition:['“Make the content change gently.”','“切过去时，不要突然跳一下。”'],button:['“Tell me if I can click, or if it is still working.”','“让我知道能不能点、是不是还在处理。”'],card:['“Make this item react when I point at it.”','“鼠标放上去时，给这个条目一点回应。”'],input:['“Tell me what I entered wrong and how to fix it.”','“告诉我哪里填错了，应该怎么改。”'],tabs:['“Switch to another view without leaving this area.”','“在这块区域里换一组内容。”'],accordion:['“Hide the extra explanation until I need it.”','“先收起，想看时再展开。”'],overlay:['“Show the details without leaving this page.”','“不离开这一页，打开详情看看。”'],feedback:['“Tell me what happened after I click.”','“操作完，让我知道发生了什么。”'],ai:['“Tell me if it is still working or already finished.”','“让我分清还在做、做完了，还是失败了。”']
};

export function partButton(id,content,extra=''){
 const attrs=`class="anatomy-part ${extra}"`;
 return studio.inspect?`<button type="button" ${attrs} data-part="${id}" aria-label="${escape(T(...pageParts[id].name))}" aria-pressed="${selectedPart===id}">${content}</button>`:`<div ${attrs} data-region="${id}">${content}</div>`;
}
export function renderAnatomy(){return renderStudioPage()}
export function anatomyDetails(){
 const part=pageParts[selectedPart];
 return [T(...part.definition),T('When the reader opens this page.','读者打开页面时。'),studioPartRequest(selectedPart),T(...part.boundary)];
}
export function selectPagePart(id){
 if(!Object.hasOwn(pageParts,id))return;
 selectedPart=id;
 studio.panel='parts';syncStudioPanel();
 $('canvas').querySelectorAll('[data-part]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.part===id)));
 descriptions();
}
function updatePartFeedback(){
 $('canvas').querySelectorAll('.part-feedback').forEach(el=>el.remove());
 if(current!=='anatomy'||!studio.inspect)return;
 const part=pageParts[selectedPart],feedback=document.createElement('span');
 feedback.className='part-feedback';
 feedback.innerHTML=`<span>${escape(T(...part.definition))}</span><strong>${T('You could say','你可以这样说')}</strong><span>${escape(studioPartRequest(selectedPart))}</span>`;
 $('canvas').querySelector('[data-part][aria-pressed=true]')?.append(feedback);
}
function simpleRequest(){
 const mode=configs[current];
 const requests={
  cta:()=>T(configs.cta==='generic'?'Use “Continue” and “Try” with equal emphasis. Check whether readers can predict the two actions.':configs.cta==='clear'?'Use explicit labels “Generate practice” and “Use sample”. Keep their appearance equal while comparing wording.':'Make “Generate practice” the main action after the material field. Keep “Use sample” secondary. Show validation and completion near the actions, preserving material when the presentation changes.',configs.cta==='generic'?'两个入口用同样样式，分别写“继续”和“试一下”；检查读者能否判断点击后发生什么。':configs.cta==='clear'?'把两个入口明确写为“生成练习”和“使用示例”；先保持相同样式，只比较文字是否清楚。':'材料输入区后突出“生成练习”，“使用示例”作为次要操作；校验与完成提示放在操作附近，切换呈现时保留材料。'),
  footer:()=>T(configs.footer==='flat'?'Place the four supporting links in a wrapping row after the content, separated by a fine rule. Keep the footer in normal flow.':'Group the footer links under “Keep learning” and “About the tool”. Stack groups on a narrow screen and keep the footer after the content without covering it.',configs.footer==='flat'?'在正文之后用细线分隔页脚，四个补充链接横向平铺、空间不足时换行；页脚随内容自然排列。':'页脚链接分成“继续学习”和“了解工具”两组；窄屏上下排列，始终位于内容之后，不覆盖正文。'),
  anatomy:()=>studioPartRequest(selectedPart),
  grid:()=>T({editorial:'Give the main story a wider left column and the supporting text a narrower right column. Keep 24 px between them; stack them on a phone.',equal:'Give the two pieces of content equal column widths with a 24 px gap. Stack them on a phone.',stack:'Put all content in one reading column, main story first and supporting text afterwards.'}[mode],{editorial:'我想让主要内容在左、占更大宽度，补充内容在右、窄一些；两栏间留 24 px，手机上改为上下排列。',equal:'我想让两份内容左右等宽，两栏间留 24 px；手机上改为上下排列。',stack:'我想把内容放在同一栏里，先展示主要内容，再展示补充内容。'}[mode]),
  workspace:()=>T('Keep the question and source side by side on desktop. On a phone, show the question first and let me expand the source without losing my answer.','电脑上题目和材料左右并排；手机上先看题目，按需展开材料，切换时保留已选答案。'),
  typography:()=>T(`Use ${mode==='sans'?'sans-serif':'serif'} headings, more prominent than the body text. ${mode==='large'?'Increase the heading/body size contrast.':'Keep notes smaller and quieter.'} Let long titles wrap.`,`标题用${mode==='sans'?'无衬线字体，笔画简洁':'衬线字体，笔画带有装饰性收笔'}，比正文更醒目；${mode==='large'?'进一步拉开标题与正文的字号差别':'注释再小一些、颜色浅一些'}，长标题自然换行。`),
  rhythm:()=>T(mode==='compact'?'Make the text compact: 1.5 line height and 12 px between paragraphs. Keep the wording.':'Give the text more breathing room: 1.9 line height and 26 px between paragraphs. Keep the wording.',mode==='compact'?'我想让阅读更紧凑：行高用字号的 1.5 倍，段落之间留 12 px，保留原文。':'我想让阅读更舒展：行高用字号的 1.9 倍，段落之间留 26 px，保留原文。'),
  scroll:()=>T(`As I scroll to a section, ${mode==='slide'?'fade it in from 16 px below':'fade it in without moving'} over ${duration} ms. Show it immediately when reduced motion is requested.`,`滚动读到一段内容时，让它在 ${duration} ms 内${mode==='slide'?'从下方 16 px 处逐渐出现并回到原位':'在原位逐渐出现'}，每段只播放一次；减少动态效果时直接显示。`),
  transition:()=>T(`When I switch views, ${mode==='slide'?'fade the new content in from 12 px below':'fade the new content in place'} over ${duration} ms. Keep navigation and focus steady.`,`切换内容时，让新内容在 ${duration} ms 内${mode==='slide'?'从下方 12 px 处上移并逐渐出现':'在原位逐渐出现'}；导航和外框不动，键盘焦点留在原按钮。`),
  button:()=>T('Show when the button is ready, focused, pressed, disabled or busy. A real click in Default should prevent duplicate clicks until the task ends.','按钮要让人看出能否点击、是否正在处理；默认模式点击后显示“正在生成”，完成前不能重复提交，结束后恢复。'),
  card:()=>T(`On hover, lift this item by ${mode} px over ${duration} ms and darken its border. Restore it on pointer leave; use an outline for keyboard focus.`,`鼠标放到卡片上时，在 ${duration} ms 内向上移动 ${mode} px，边框加深；移开后复原，键盘聚焦用轮廓提示。`),
  input:()=>T(`Check the title ${mode==='blur'?'when I leave the field and on submit':'on submit'}. Explain errors below the field and keep what I typed.`,`${mode==='blur'?'离开输入框或提交时':'提交时'}检查标题，填错后在输入框下说明怎么改，保留已经输入的文字。`),
  tabs:()=>T('Switch related content in the same area and underline the selected tab. Keep my draft when I switch back.','点击页签，在同一块区域切换内容，用底线标出当前项；切走再回来时保留草稿。'),
  accordion:()=>T(`Click a heading to reveal or hide its detail. ${mode==='single'?'Opening another should close the previous section.':'Allow several sections to stay open.'}`,`点击标题展开或收起详情；${mode==='single'?'打开另一项时，自动收起上一项':'允许同时展开多项'}。`),
  overlay:()=>T(`Open the source in ${mode==='drawer'?'a panel on the right':'a centered dialog'} over a dimmed background. Close with Esc or the close button, retain the note, and return focus.`,`点击后${mode==='drawer'?'从右边打开一个详情面板':'在屏幕中间打开弹窗'}，背景变暗；按 Esc 或关闭按钮退出，保留备注，键盘焦点回到打开按钮。`),
  feedback:()=>T(`Show a confirmation ${mode==='toast'?'floating near the bottom of the preview':'beside the action'}. Keep it until I dismiss it and do not move keyboard focus.`,`操作后${mode==='toast'?'在预览底部浮出一条提示':'在操作附近显示一条确认信息'}；提示不抢走键盘焦点，由用户手动关闭。`),
  ai:()=>T(`During processing, ${mode==='stream'?'show text as it arrives and mark it incomplete':'show named stages, then the final result'}. Allow pause, retry and cancel; clearly say what was retained.`,`处理时${mode==='stream'?'逐段显示文字，结束前标为部分结果':'先显示正在进行的步骤，完成后再显示全文'}；可以暂停、重试或取消，并明确哪些内容已保留。`)
 };
 return requests[current]();
}
export function updateBeginnerDescription(){
 $('selected-name').textContent=current==='anatomy'?T(...pageParts[selectedPart].name):names(current);
 $('everyday').textContent=current==='anatomy'?T(...pageParts[selectedPart].everyday):T('In everyday words: ','你平时说的：')+T(...everydayTerms[current]);
 $('result-sentence').textContent=simpleRequest();
 if((reduce||media.matches)&&['card','scroll','transition'].includes(current))$('result-sentence').textContent+=T(' Reduced motion is active: show the final state directly without movement.',' 当前已启用减少动态效果：直接显示最终状态，不播放位移或淡入动画。');
 updatePartFeedback();
}

// Show a small set of choices without making beginners open a select to discover them.
// The native select stays in sync as a buildless fallback and for existing integrations.
export function enhanceControls(){
 const select=$('config');if(!select)return;
 const label=select.closest('label'),legend=label.firstChild.textContent;
 label.hidden=true;
 const fieldset=document.createElement('fieldset');fieldset.className='config-choices';
 fieldset.innerHTML=`<legend>${escape(legend)}</legend><div>${[...select.options].map(o=>`<button type="button" data-config="${escape(o.value)}" aria-pressed="${o.selected}" aria-controls="canvas">${escape(o.textContent)}</button>`).join('')}</div>`;
 label.after(fieldset);
}
export function focusConfig(){
 $('controls').querySelector('[data-config][aria-pressed=true]')?.focus();
}
