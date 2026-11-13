// A presentation setting must not erase the content being used for comparison.
export function captureStudyState(){
 if(current==='cta')return {material:$('cta-material').value,status:$('cta-status').textContent,result:$('cta-result').hidden,invalid:$('cta-material').getAttribute('aria-invalid')};
 if(current==='workspace')return {answer:document.querySelector('[name=study-answer]:checked')?.value,open:$('source-toggle').getAttribute('aria-expanded')==='true',feedback:$('workspace-feedback').textContent};
 if(current==='input')return {value:$('sample-input').value,invalid:$('sample-input').getAttribute('aria-invalid')};
 if(current==='transition')return {view:document.querySelector('[data-view][aria-pressed=true]')?.dataset.view};
 if(current==='feedback')return {shown:!!document.querySelector('.notice')};
 if(current==='ai')return {step,paused,canceled,failed,active:timer!==null,started:$('run-actions').querySelector('[data-action=start]').textContent!==T('Start','开始')};
 return null;
}
export function restoreStudyState(state){
 if(!state)return;
 if(current==='cta'){
  $('cta-material').value=state.material;$('cta-status').textContent=state.status;$('cta-result').hidden=state.result;
  if(state.invalid!==null)$('cta-material').setAttribute('aria-invalid',state.invalid);
 }
 if(current==='workspace'){
  if(state.answer)document.querySelector(`[name=study-answer][value="${state.answer}"]`).checked=true;
  if(state.open)$('source-toggle').click();
  $('workspace-feedback').textContent=state.feedback;
 }
 if(current==='input'){
  $('sample-input').value=state.value;
  if(state.invalid!==null)validate();
 }
 if(current==='transition'&&state.view==='notes')document.querySelector('[data-view=notes]').click();
 if(current==='feedback'&&state.shown)document.querySelector('[data-action=feedback]').click();
 if(current==='ai'&&state.started){
  ({step,paused,canceled,failed}=state);
  if(state.active)schedule();else runUI();
 }
}
