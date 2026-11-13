/** DOM behavior checks; not browser layout, native focus trapping or accessibility certification.
 * Test dependency: npm install --prefix "$env:TEMP/qianna-ui-lab-tests" --no-save --package-lock=false jsdom@30.1.3
 * Override its module directory with UI_LAB_TEST_MODULES when needed.
 */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
const require=createRequire(join(process.env.UI_LAB_TEST_MODULES||join(tmpdir(),'qianna-ui-lab-tests'),'package.json'));
const {JSDOM,VirtualConsole}=require('jsdom');
const html=readFileSync(new URL('../public/notes/ui-prototype-ergonomics/interface-lab.html',import.meta.url),'utf8');
function page(query='?lang=en&demo=button',systemReduced=false,withObserver=false){
 const timers=new Map(),errors=[],observers=[],resizeObservers=[];let next=0,copied='';
 const virtualConsole=new VirtualConsole();virtualConsole.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://example.test/lab.html'+query,runScripts:'dangerously',pretendToBeVisual:true,virtualConsole,beforeParse(w){
  // jsdom has no native dialog implementation; test our open/close hooks only.
  w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};
  w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'))};
  w.matchMedia=()=>({matches:systemReduced,addEventListener(){}});
  if(withObserver)w.IntersectionObserver=class{
   constructor(callback){this.callback=callback;this.targets=[];this.disconnected=false;observers.push(this)}
   observe(el){this.targets.push(el)}unobserve(el){this.targets=this.targets.filter(x=>x!==el)}disconnect(){this.disconnected=true}
  };
  if(withObserver)w.ResizeObserver=class{
   constructor(callback){this.callback=callback;this.disconnected=false;resizeObservers.push(this)}
   observe(el){this.target=el}disconnect(){this.disconnected=true}
  };
  w.setInterval=fn=>{timers.set(++next,{fn,repeat:true});return next};w.setTimeout=fn=>{timers.set(++next,{fn,repeat:false});return next};
  w.clearTimeout=w.clearInterval=id=>timers.delete(id);
  w.fetch=()=>{throw Error('Unexpected network call')};
  Object.defineProperty(w.navigator,'clipboard',{configurable:true,value:{writeText:async value=>{copied=value}}});
 }});
 const d=dom.window.document,$=s=>d.querySelector(s),click=s=>{assert.ok($(s),'Missing '+s);$(s).click()},change=(s,value)=>{const el=$(s);el.value=value;el.dispatchEvent(new dom.window.Event('change',{bubbles:true}))};
 return {dom,d,$,click,change,errors,timers,observers,resizeObservers,get copied(){return copied},choose:id=>{const group={anatomy:'basics',cta:'components',footer:'layout',grid:'layout',workspace:'layout',typography:'type',rhythm:'type',scroll:'motion',transition:'motion'}[id]||'components';if(id==='anatomy'){click('[data-group=basics]');return}if(!d.querySelector(`[data-demo="${id}"]`))click(`[data-group="${group}"]`);click(`[data-demo="${id}"]`)},tick:()=>{for(const [id,t] of [...timers]){if(!t.repeat)timers.delete(id);t.fn()}},close:()=>dom.window.close()};
}
test('all seventeen studies render in both languages; invalid links fall back to the page introduction',()=>{
 for(const lang of ['en','zh']){const p=page('?lang='+lang+'&demo=missing');assert.equal(p.$('.preview').getAttribute('aria-label'),lang==='en'?'Anatomy of a page':'页面的组成');for(const id of ['anatomy','cta','footer','grid','workspace','typography','rhythm','scroll','transition','button','card','input','tabs','accordion','overlay','feedback','ai']){p.choose(id);assert.ok(p.$('#canvas').textContent.trim());assert.ok(p.$('#prompt').value.length>200);assert.ok(p.dom.window.location.search.includes('demo='+id))}assert.deepEqual(p.errors,[]);p.close()}
});

test('CTA wording and priority change independently while preserving material, results and control focus',()=>{
 for(const lang of ['en','zh']){
  const p=page('?lang='+lang+'&demo=cta');
  p.$('#cta-material').value='My material';p.click('#cta-generate');
  const status=p.$('#cta-status').textContent;
  for(const mode of ['generic','clear','priority']){
   p.click(`[data-config=${mode}]`);
   assert.equal(p.$('.cta-study').dataset.treatment,mode);
   assert.equal(p.$('#cta-material').value,'My material');assert.equal(p.$('#cta-result').hidden,false);
   assert.equal(p.$('#cta-status').textContent,status);assert.equal(p.d.activeElement.dataset.config,mode);
   assert.equal(p.$('#cta-generate').textContent,lang==='zh'?(mode==='generic'?'继续':'生成练习'):(mode==='generic'?'Continue':'Generate practice'));
   assert.match(p.$('#result-sentence').textContent,mode==='generic'?/继续|Continue/:/生成练习|Generate practice/);
  }
  assert.deepEqual(p.errors,[]);p.close();
 }
});

test('CTA validates empty material, retains the error across treatments and distinguishes sample use from completion',()=>{
 const p=page('?lang=zh&demo=cta');p.$('#cta-material').value=' ';p.click('#cta-generate');
 assert.equal(p.d.activeElement.id,'cta-material');assert.equal(p.$('#cta-material').getAttribute('aria-invalid'),'true');
 assert.equal(p.$('#cta-result').hidden,true);p.change('#config','clear');
 assert.equal(p.$('#cta-material').value,' ');assert.equal(p.$('#cta-material').getAttribute('aria-invalid'),'true');
 p.click('#cta-sample');assert.equal(p.$('#cta-material').getAttribute('aria-invalid'),'false');assert.equal(p.$('#cta-result').hidden,true);
 assert.match(p.$('#cta-status').textContent,/已填入/);p.click('#cta-generate');assert.equal(p.$('#cta-result').hidden,false);
 assert.match(p.$('#cta-status').textContent,/固定示例题/);assert.deepEqual(p.errors,[]);p.close();
});

test('footer grouping retains the same routes, updates the request and returns focus to the linked section',()=>{
 for(const lang of ['en','zh']){
  const p=page('?lang='+lang+'&demo=footer');
  const routes=()=>[...p.d.querySelectorAll('[data-footer-link]')].map(a=>[a.getAttribute('href'),a.textContent]);
  const original=routes();p.click('[data-config=flat]');assert.deepEqual(routes(),original);
  assert.match(p.$('#result-sentence').textContent,/平铺|wrapping row/);assert.equal(p.$('.example-footer nav h4'),null);
  p.click('[data-config=grouped]');assert.deepEqual(routes(),original);assert.equal(p.d.querySelectorAll('.example-footer nav h4').length,2);
  assert.match(p.$('#prompt').value,/继续学习|Keep learning/);
  p.click('[data-footer-link=source]');assert.equal(p.d.activeElement.id,'footer-source');
  assert.match(p.dom.window.location.search,/demo=footer/);assert.ok(p.$('#footer-status').textContent.length>5);
  assert.deepEqual(p.errors,[]);p.close();
 }
});

test('loading prevents duplicate activation and leaving a pattern clears pending callbacks',()=>{
 const p=page();p.click('#sample-button');assert.equal(p.$('#sample-button').disabled,true);assert.equal(p.timers.size,1);p.click('#sample-button');assert.equal(p.timers.size,1);p.tick();assert.equal(p.$('#sample-button').disabled,false);p.click('#sample-button');p.choose('card');assert.equal(p.timers.size,0);assert.deepEqual(p.errors,[]);p.close();
});
test('invalid input remains present and is corrected without losing the value',()=>{
 const p=page();p.choose('input');p.$('#sample-input').value=' a ';p.$('#sample-form').requestSubmit();assert.equal(p.$('#sample-input').getAttribute('aria-invalid'),'true');assert.equal(p.$('#sample-input').value,' a ');assert.equal(p.d.activeElement.id,'sample-input');p.$('#sample-input').value='abc';p.$('#sample-input').dispatchEvent(new p.dom.window.Event('input',{bubbles:true}));assert.equal(p.$('#sample-input').getAttribute('aria-invalid'),'false');assert.equal(p.$('#input-error').textContent,'');p.close();
});
test('tab keyboard selection preserves an answer draft and roving tab index',()=>{
 const p=page();p.choose('tabs');p.$('#answer-draft').value='keep this';p.$('#tab-0').dispatchEvent(new p.dom.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));assert.equal(p.$('#panel-0').hidden,true);assert.equal(p.d.activeElement.id,'tab-1');assert.equal(p.$('#tab-0').tabIndex,-1);p.$('#tab-1').dispatchEvent(new p.dom.window.KeyboardEvent('keydown',{key:'Home',bubbles:true}));assert.equal(p.$('#answer-draft').value,'keep this');assert.equal(p.$('#panel-0').hidden,false);p.close();
});
test('accordion single and multiple expansion rules agree with the controls',()=>{
 const p=page();p.choose('accordion');p.click('#acc-0');p.click('#acc-1');assert.equal(p.$('#acc-body-0').hidden,true);assert.equal(p.$('#acc-body-1').hidden,false);p.change('#config','multiple');p.click('#acc-0');p.click('#acc-1');assert.equal(p.$('#acc-body-0').hidden,false);assert.equal(p.$('#acc-body-1').hidden,false);p.close();
});
test('dialog hooks retain the draft and return focus (native dialog API stubbed)',()=>{
 const p=page();p.choose('overlay');p.click('[data-action=open-dialog]');assert.equal(p.$('#dialog').open,true);p.$('#draft').value='keep note';p.click('#close-dialog');p.$('#dialog').dispatchEvent(new p.dom.window.Event('close'));assert.equal(p.d.activeElement.dataset.action,'open-dialog');p.click('[data-action=open-dialog]');assert.equal(p.$('#draft').value,'keep note');p.close();
});
test('feedback is dismissible, toast uses floating placement, and does not steal focus',()=>{
 const p=page();p.choose('feedback');p.change('#config','toast');p.$('[data-action=feedback]').focus();p.click('[data-action=feedback]');assert.ok(p.$('.notice.toast'));assert.equal(p.d.activeElement.dataset.action,'feedback');p.click('[data-action=dismiss]');assert.equal(p.$('.notice'),null);p.close();
});
test('AI simulation preserves partial output on pause, failure and cancel; retry resets it',()=>{
 const p=page();p.choose('ai');p.click('[data-action=start]');p.tick();const partial=p.$('#result').textContent;assert.ok(partial);p.$('[data-action=pause]').focus();p.click('[data-action=pause]');assert.equal(p.timers.size,0);assert.equal(p.$('#result').textContent,partial);assert.equal(p.d.activeElement.dataset.action,'pause');p.click('[data-action=pause]');p.click('[data-action=fail]');assert.match(p.$('#run-status').textContent,/Failed/);assert.equal(p.$('#result').textContent,partial);p.click('[data-action=start]');assert.equal(p.$('#result').textContent,'');p.tick();p.click('[data-action=cancel]');assert.equal(p.$('#result').textContent,partial);assert.equal(p.timers.size,0);p.click('[data-action=start]');for(let i=0;i<4;i++)p.tick();assert.match(p.$('#partial').textContent,/Complete/);assert.equal(p.$('#progress').getAttribute('aria-valuenow'),'4');assert.equal(p.timers.size,0);assert.deepEqual(p.errors,[]);p.close();
});
test('switching patterns or leaving the page cancels active AI work',()=>{
 const p=page();p.choose('ai');p.click('[data-action=start]');p.choose('input');assert.equal(p.timers.size,0);p.choose('ai');p.click('[data-action=start]');p.dom.window.dispatchEvent(new p.dom.window.Event('pagehide'));assert.equal(p.timers.size,0);p.close();
});
test('motion preferences and duration are represented in the copied requirement',async()=>{
 const p=page('?demo=card',true);assert.equal(p.d.documentElement.classList.contains('reduced'),true);p.$('#duration').value='400';p.$('#duration').dispatchEvent(new p.dom.window.Event('input',{bubbles:true}));assert.match(p.$('#prompt').value,/400 ms/);assert.match(p.$('#prompt').value,/Disable motion/);p.click('#copy');await new Promise(setImmediate);assert.equal(p.copied,p.$('#prompt').value);assert.match(p.$('#copy-status').textContent,/Copied/);p.close();
});
test('clipboard failure offers manual copying instead of a false success',async()=>{
 const p=page();Object.defineProperty(p.dom.window.navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied')}}});p.click('#copy');await new Promise(setImmediate);await new Promise(setImmediate);assert.match(p.$('#copy-status').textContent,/manually/);assert.equal(p.d.activeElement.id,'prompt');p.close();
});
test('page-scale controls change the actual structure and copied requirement together',()=>{
 const p=page('?lang=en&demo=grid');
 p.change('#config','stack');assert.ok(p.$('#layout-grid').classList.contains('stack'));assert.match(p.$('#prompt').value,/single reading column/);
 p.change('#config','equal');assert.ok(p.$('#layout-grid').classList.contains('equal'));assert.match(p.$('#prompt').value,/two equal columns/);
 p.choose('typography');p.change('#config','sans');assert.ok(p.$('#reading-study').classList.contains('sans'));assert.match(p.$('#prompt').value,/sans-serif headings/);
 p.change('#config','large');assert.ok(p.$('#reading-study').classList.contains('large-type'));assert.match(p.$('#prompt').value,/44 px/);
 p.choose('rhythm');p.change('#config','compact');assert.equal(p.$('#reading-study').style.getPropertyValue('--study-leading'),'1.5');assert.match(p.$('#prompt').value,/12 px/);
 assert.deepEqual(p.errors,[]);p.close();
});
test('workspace keeps the selected answer across viewport changes and source disclosure',()=>{
 const p=page('?lang=zh&demo=workspace');p.click('input[value=b]');p.change('#config','mobile');assert.ok(p.$('#study-frame').classList.contains('mobile'));assert.equal(p.$('input[value=b]').checked,true);assert.equal(p.$('#workspace-source').hidden,true);p.click('#source-toggle');assert.equal(p.$('#workspace-source').hidden,false);p.click('#source-toggle');assert.equal(p.$('input[value=b]').checked,true);p.click('[data-action=study-submit]');assert.match(p.$('#workspace-feedback').textContent,/一致/);p.change('#config','desktop');assert.equal(p.$('input[value=b]').checked,true);p.close();
});
test('view switching keeps navigation focus and respects reduced motion',()=>{
 const p=page('?lang=en&demo=transition');p.$('[data-view=notes]').focus();p.click('[data-view=notes]');assert.equal(p.d.activeElement.dataset.view,'notes');assert.equal(p.$('[data-view=notes]').getAttribute('aria-pressed'),'true');assert.ok(p.$('#switch-view').classList.contains('animate-fade'));p.change('#config','slide');p.$('#reduce').checked=true;p.$('#reduce').dispatchEvent(new p.dom.window.Event('change',{bubbles:true}));p.click('[data-view=notes]');assert.equal(p.$('#switch-view').className,'switch-view');p.close();
});
test('scroll content remains visible when observation is unavailable or motion is reduced',()=>{
 for(const reduced of [false,true]){const p=page('?lang=zh&demo=scroll',reduced);assert.equal(p.$('#scroll-study').classList.contains('has-observer'),false);assert.equal(p.d.querySelectorAll('.reveal-item.in-view').length,3);p.change('#config','fade');assert.match(p.$('#prompt').value,/原位淡入/);p.click('[data-action=study-replay]');assert.equal(p.$('#scroll-study').scrollTop,0);assert.deepEqual(p.errors,[]);p.close()}
});
test('Chinese prompts use Chinese instructions for every study and every setting',()=>{
 const p=page('?lang=zh');
 for(const id of ['grid','workspace','typography','rhythm','scroll','transition','button','card','input','tabs','accordion','overlay','feedback','ai']){
  p.choose(id);const values=[...(p.$('#config')?.options||[])].map(o=>o.value);
  for(const value of values.length?values:[null]){if(value!==null)p.change('#config',value);assert.match(p.$('#prompt').value,/请调整现有/);assert.match(p.$('#prompt').value,/触发：/);assert.doesNotMatch(p.$('#prompt').value,/Trigger:|Completion and boundaries:|Update the existing|Please|State to demonstrate/);assert.ok(p.$('#prompt').value.match(/[\u4e00-\u9fff]/g).length>80)}
 }
 assert.deepEqual(p.errors,[]);p.close();
});
test('the requirement preview is collapsed initially and opens for manual copy fallback',async()=>{
 const p=page('?lang=zh&demo=grid');assert.equal(p.$('#prompt-details').open,false);Object.defineProperty(p.dom.window.navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied')}}});p.click('#copy');await new Promise(setImmediate);assert.equal(p.$('#prompt-details').open,true);assert.equal(p.d.activeElement.id,'prompt');assert.equal(p.$('.toolbar').hidden,true);p.choose('scroll');assert.equal(p.$('.toolbar').hidden,false);p.close();
});
test('scroll reveals once and ignores callbacks queued before leaving the study',()=>{
 const p=page('?lang=en&demo=scroll',false,true),observer=p.observers[0],item=observer.targets[0];
 assert.ok(p.$('#scroll-study').classList.contains('has-observer'));assert.equal(item.classList.contains('in-view'),false);
 observer.callback([{target:item,isIntersecting:true}]);assert.equal(item.classList.contains('in-view'),true);assert.equal(observer.targets.includes(item),false);
 p.choose('grid');assert.equal(observer.disconnected,true);assert.doesNotThrow(()=>observer.callback([{target:item,isIntersecting:true}]));assert.deepEqual(p.errors,[]);p.close();
});

test('changing presentation preserves the working content instead of resetting the lesson',()=>{
 const p=page('?demo=input');p.$('#sample-input').value='my working draft';p.change('#config','submit');assert.equal(p.$('#sample-input').value,'my working draft');
 p.choose('workspace');p.change('#config','mobile');p.click('input[value=b]');p.click('#source-toggle');p.click('[data-action=study-submit]');const feedback=p.$('#workspace-feedback').textContent;p.change('#config','desktop');assert.equal(p.$('input[value=b]').checked,true);assert.equal(p.$('#source-toggle').getAttribute('aria-expanded'),'true');assert.equal(p.$('#workspace-feedback').textContent,feedback);
 p.choose('transition');p.click('[data-view=notes]');p.change('#config','slide');assert.equal(p.$('[data-view=notes]').getAttribute('aria-pressed'),'true');
 p.choose('feedback');p.click('[data-action=feedback]');p.change('#config','toast');assert.ok(p.$('.notice.toast'));
 p.choose('ai');p.click('[data-action=start]');p.tick();p.click('[data-action=pause]');p.change('#config','stages');assert.match(p.$('#run-status').textContent,/Paused/);assert.equal(p.$('#progress').getAttribute('aria-valuenow'),'1');p.change('#config','stream');assert.match(p.$('#result').textContent,/First/);assert.equal(p.timers.size,0);
 assert.deepEqual(p.errors,[]);p.close();
});

test('mobile workspace has a bounded scrollable viewport and an explicit size label',()=>{
 const p=page('?lang=zh&demo=workspace');p.change('#config','mobile');assert.ok(p.$('.viewport-stage #study-frame.mobile'));assert.equal(p.$('#study-frame').getAttribute('role'),'region');assert.equal(p.$('#study-frame').tabIndex,0);assert.match(p.$('#frame-mode').textContent,/390 px/);assert.equal(p.$('#workspace-source').hidden,true);p.click('#source-toggle');assert.equal(p.$('#workspace-source').dataset.open,'true');p.click('#source-toggle');assert.equal(p.$('#workspace-source').dataset.open,'false');assert.equal(p.$('#workspace-source').hidden,true);p.close();
});

test('failure before the first AI chunk does not claim to retain nonexistent output',()=>{
 const p=page('?lang=zh&demo=ai');p.$('[data-action=start]').focus();p.click('[data-action=start]');assert.equal(p.d.activeElement.dataset.action,'pause');p.click('[data-action=fail]');assert.match(p.$('#run-status').textContent,/暂无已生成内容/);assert.equal(p.$('#result').textContent,'');assert.equal(p.d.activeElement.dataset.action,'start');p.close();
});

test('workspace reports actual dimensions and restores the source when a narrow viewport grows',()=>{
 const p=page('?lang=zh&demo=workspace',false,true),observer=p.resizeObservers[0],frame=p.$('#study-frame');
 let width=390;Object.defineProperty(frame,'clientWidth',{get:()=>width});Object.defineProperty(frame,'clientHeight',{value:520});observer.callback();
 assert.match(p.$('#frame-mode').textContent,/390 × 520 px/);assert.equal(p.$('#workspace-source').hidden,true);
 p.click('#source-toggle');assert.equal(p.$('#workspace-source').hidden,false);p.click('#source-toggle');assert.equal(p.$('#workspace-source').hidden,true);
 width=800;observer.callback();assert.equal(p.$('#workspace-source').hidden,false);assert.match(p.$('#frame-mode').textContent,/800 × 520 px/);
 p.choose('grid');assert.equal(observer.disconnected,true);assert.doesNotThrow(()=>observer.callback());assert.deepEqual(p.errors,[]);p.close();
});

test('a first visit begins with a named page rather than an unexplained layout selector',()=>{
 for(const lang of ['en','zh']){const p=page('?lang='+lang);assert.equal(p.$('[data-group=basics]').getAttribute('aria-pressed'),'true');assert.equal(p.d.querySelectorAll('[data-part]').length,9);assert.equal(p.$('[data-part=title]').getAttribute('aria-pressed'),'true');assert.equal(p.$('#selected-name').textContent,lang==='en'?'Main heading':'主标题');assert.equal(p.$('.toolbar').hidden,true);assert.equal(p.$('#config'),null);assert.equal(p.$('.catalog').hidden,true);assert.equal(p.$('#navigation').children.length,0);assert.ok(p.$('.layout').classList.contains('anatomy-layout'));assert.equal(p.d.querySelectorAll('.studio-cover').length,3);p.choose('grid');assert.equal(p.$('.catalog').hidden,false);assert.ok(p.$('[data-demo=workspace]'));assert.equal(p.$('.layout').classList.contains('anatomy-layout'),false);p.choose('anatomy');assert.equal(p.$('.catalog').hidden,true);assert.deepEqual(p.errors,[]);p.close()}
});

test('every page area updates its name, plain explanation, inline feedback and copied request in both languages',async()=>{
 for(const lang of ['en','zh']){const p=page('?lang='+lang+'&demo=anatomy');for(const id of ['navigation','eyebrow','title','intro','tabs','sidebar','content','supporting','footer']){
  p.click(`[data-part=${id}]`);
  assert.equal(p.d.querySelectorAll('[data-part][aria-pressed=true]').length,1);
  assert.equal(p.$('#selected-name').textContent,p.$(`[data-part=${id}]`).getAttribute('aria-label'));
  assert.ok(p.$('#plain').textContent.length>25);
  assert.ok(p.$('#everyday').textContent.length>10);
  assert.ok(p.$(`[data-part=${id}] .part-feedback`).textContent.includes(p.$('#plain').textContent));
  assert.ok(p.$('#prompt').value.includes(p.$('#result-sentence').textContent));
  p.click('#copy');await new Promise(setImmediate);assert.equal(p.copied,p.$('#prompt').value);
 }assert.deepEqual(p.errors,[]);p.close()}
});

test('visible configuration choices preserve answers, reflect the native value and keep focus after render',()=>{
 const p=page('?lang=zh&demo=workspace');p.click('input[value=b]');p.click('[data-action=study-submit]');p.click('[data-config=mobile]');assert.equal(p.$('#config').value,'mobile');assert.equal(p.$('input[value=b]').checked,true);assert.match(p.$('#workspace-feedback').textContent,/一致/);assert.equal(p.$('[data-config=mobile]').getAttribute('aria-pressed'),'true');assert.equal(p.d.activeElement.dataset.config,'mobile');p.choose('grid');p.click('[data-config=equal]');assert.ok(p.$('#layout-grid').classList.contains('equal'));assert.match(p.$('#result-sentence').textContent,/左右等宽/);assert.ok(p.$('#prompt').value.includes(p.$('#result-sentence').textContent));p.close();
});

test('the short request follows duration and reduced motion instead of contradicting the detailed request',()=>{
 const p=page('?lang=zh&demo=card');p.click('[data-config="8"]');p.$('#duration').value='400';p.$('#duration').dispatchEvent(new p.dom.window.Event('input',{bubbles:true}));assert.match(p.$('#result-sentence').textContent,/400 ms/);assert.match(p.$('#result-sentence').textContent,/8 px/);p.$('#reduce').checked=true;p.$('#reduce').dispatchEvent(new p.dom.window.Event('change',{bubbles:true}));assert.match(p.$('#result-sentence').textContent,/不播放位移/);assert.ok(p.$('#prompt').value.includes(p.$('#result-sentence').textContent));assert.deepEqual(p.errors,[]);p.close();
});


test('portfolio presets change the page and its complete brief together, in both languages',()=>{
 for(const lang of ['en','zh']){const p=page('?lang='+lang+'&demo=anatomy');
  for(const [preset,layout,radius] of [['archive','gallery','0'],['index','list','8'],['curated','editorial','16']]){
   p.click(`[data-preset=${preset}]`);assert.equal(p.$('.studio-page').dataset.layout,layout);assert.equal(p.$('.studio-page').style.getPropertyValue('--studio-radius'),radius+'px');assert.match(p.$('#studio-page-prompt').value,new RegExp(radius+' px'));assert.equal(p.d.activeElement.dataset.preset,preset);
  }
  p.click('[data-studio-setting=radius][data-value="8"]');assert.equal(p.$('[data-preset][aria-pressed=true]'),null);assert.equal(p.d.activeElement.dataset.value,'8');assert.ok(p.$('#studio-page-prompt').value.includes('8 px'));assert.deepEqual(p.errors,[]);p.close();
 }
});

test('website mode filters projects and retains the filter across presentation and viewport changes',()=>{
 const p=page('?lang=zh&demo=anatomy');p.click('[data-studio-inspect]');assert.equal(p.$('[data-part]'),null);assert.equal(p.d.querySelectorAll('[data-region]').length,9);p.click('[data-site="filter:image"]');assert.equal(p.d.querySelectorAll('.studio-project').length,1);assert.match(p.$('.studio-project-title').textContent,/占位二/);p.click('[data-preset=index]');assert.equal(p.d.querySelectorAll('.studio-project').length,1);p.click('[data-studio-view=phone]');assert.equal(p.$('.studio-viewport').dataset.viewport,'phone');assert.equal(p.$('[data-site="filter:image"]').getAttribute('aria-pressed'),'true');p.click('[data-studio-inspect]');assert.equal(p.d.querySelectorAll('[data-part]').length,9);assert.equal(p.d.querySelectorAll('.studio-project').length,1);assert.deepEqual(p.errors,[]);p.close();
});

test('portfolio project dialog closes and restores focus, and contact does not make a network call',()=>{
 const p=page('?lang=zh&demo=anatomy');p.dom.window.HTMLElement.prototype.scrollIntoView=function(){};p.click('[data-studio-inspect]');const trigger=p.$('[data-site="project:one"]');trigger.click();assert.equal(p.$('#studio-project-dialog').open,true);p.click('#studio-project-close');assert.equal(p.$('#studio-project-dialog').open,false);assert.equal(p.d.activeElement,trigger);p.click('[data-site=contact]');assert.match(p.$('#studio-site-status').textContent,/没有发送|不会发送/);assert.deepEqual(p.errors,[]);p.close();
});

test('inspection selects a part panel and inspector tabs support keyboard navigation',()=>{
 const p=page('?lang=zh&demo=anatomy');assert.equal(p.$('#studio-style').hidden,false);p.click('[data-part=footer]');assert.equal(p.$('#studio-parts').hidden,false);assert.equal(p.$('#studio-style').hidden,true);p.$('#studio-tab-parts').dispatchEvent(new p.dom.window.KeyboardEvent('keydown',{key:'End',bubbles:true}));assert.equal(p.$('#studio-brief').hidden,false);assert.equal(p.d.activeElement.id,'studio-tab-brief');p.choose('grid');assert.equal(p.$('#studio-tabs').hidden,true);assert.equal(p.$('#studio-parts').hidden,false);assert.deepEqual(p.errors,[]);p.close();
});

test('whole page clipboard waits for success and offers manual selection on rejection',async()=>{
 const p=page('?lang=zh&demo=anatomy');p.click('[data-studio-panel=brief]');p.click('#studio-copy-page');await new Promise(setImmediate);assert.equal(p.copied,p.$('#studio-page-prompt').value);assert.match(p.$('#studio-copy-status').textContent,/已复制/);p.dom.window.navigator.clipboard.writeText=async()=>{throw Error('denied')};p.click('#studio-copy-page');await new Promise(setImmediate);assert.equal(p.d.activeElement.id,'studio-page-prompt');assert.match(p.$('#studio-copy-status').textContent,/手动复制/);assert.deepEqual(p.errors,[]);p.close();
});

test('whole page requirements honor reduced motion and stay aligned with selected styles',()=>{
 const p=page('?lang=zh&demo=anatomy',true);assert.match(p.$('#studio-page-prompt').value,/不播放位移/);assert.doesNotMatch(p.$('#studio-page-prompt').value,/240 ms/);p.click('[data-studio-setting=layout][data-value=gallery]');p.click('[data-studio-setting=space][data-value=compact]');assert.equal(p.$('.studio-page').dataset.layout,'gallery');assert.match(p.$('#studio-page-prompt').value,/图像网格/);assert.match(p.$('#studio-page-prompt').value,/12 px/);assert.deepEqual(p.errors,[]);p.close();
});

test('part requirements follow heading type and the current project arrangement',()=>{
 const p=page('?lang=zh&demo=anatomy');p.click('[data-studio-setting=type][data-value=sans]');p.click('[data-part=title]');assert.match(p.$('#result-sentence').textContent,/无衬线/);assert.ok(p.$('#prompt').value.includes(p.$('#result-sentence').textContent));p.click('[data-studio-panel=style]');p.click('[data-studio-setting=layout][data-value=gallery]');p.click('[data-part=sidebar]');assert.match(p.$('#result-sentence').textContent,/上方/);p.click('[data-part=content]');assert.match(p.$('#result-sentence').textContent,/图像网格/);assert.match(p.$('#result-sentence').textContent,/16 px/);assert.deepEqual(p.errors,[]);p.close();
});
