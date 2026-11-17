/* The Jolly Bean Café: re-layout original working game into playable illustrated interface. */
(()=>{
'use strict';
if(window.__jbcVintageReady)return;
function init(){
 const q=s=>document.querySelector(s), app=q('#app'),layout=q('.layout'),left=q('.left-rail'),main=q('.main-column'),scene=q('#scene'),bench=q('.workbench');
 if(!app||!layout||!left||!main||!scene||!bench||q('.jbc-showcase'))return;
 window.__jbcVintageReady=true;layout.classList.add('jbc-layout');
 const order=left.querySelector('.order-panel');
 const dayPanel=left.querySelector('.day-panel');
 const stats=left.querySelector('.panel:not(.order-panel):not(.notes-panel)');
 const notes=left.querySelector('.notes-panel');
 const showcase=document.createElement('div');showcase.className='jbc-showcase';showcase.setAttribute('aria-label','咖啡馆角色与顾客');
 layout.insertBefore(showcase,left);showcase.append(order,scene);
 if(dayPanel){order.appendChild(dayPanel);dayPanel.classList.add('jbc-day-panel')}
 const workspace=document.createElement('div');workspace.className='jbc-workspace';
 layout.insertBefore(workspace,main);
 const nav=document.createElement('nav');nav.className='jbc-menu';nav.setAttribute('aria-label','咖啡馆菜单');
 nav.innerHTML='<div class="jbc-menu-head">✦ THE MENU ✦</div><button type="button" class="jbc-primary" data-jbc="recipe">☕ 配方制作</button><button type="button" data-jbc="customer">👒 顾客信息</button><button type="button" data-jbc="research">🌋 火山研发</button><button type="button" data-jbc="journal">📖 咖啡手册</button><button type="button" data-jbc="notes">⚙️ 操作指南</button>';
 workspace.append(nav,bench);
 if(stats){const liveBars=stats.querySelector('#stat-bars');const liveProcess=stats.querySelector('#process-state');stats.classList.add('jbc-preview-panel');stats.innerHTML='<div class="jbc-preview-header">✦ 当前饮品 · YOUR CREATION ✦</div><div class="jbc-drink-title" id="jbc-drink-title">一杯等待诞生的咖啡</div><div class="jbc-preview-stage"><div class="jbc-glow"></div><div class="jbc-glass" id="jbc-glass"><div class="jbc-liquid" id="jbc-liquid"></div><div class="jbc-foam" id="jbc-foam"></div><div class="jbc-ice" id="jbc-ice"></div></div><div class="jbc-spark">✦</div></div><div class="jbc-preview-status" id="jbc-preview-status">调整食材和工艺，杯中效果会随之变化。</div><div id="stat-bars"></div><div id="process-state" class="jbc-preview-status">尚未加工</div>';
 if(liveBars)stats.querySelector('#stat-bars').replaceWith(liveBars);if(liveProcess)stats.querySelector('#process-state').replaceWith(liveProcess);
 const submitMirror=document.createElement('button');submitMirror.type='button';submitMirror.className='jbc-serve';submitMirror.id='jbc-serve';submitMirror.textContent='☕ 交给顾客品尝';submitMirror.addEventListener('click',()=>q('#submit-btn')?.click());stats.appendChild(submitMirror);
 const originalSubmit=q('#submit-btn');if(originalSubmit){const sync=()=>{submitMirror.disabled=originalSubmit.disabled};sync();new MutationObserver(sync).observe(originalSubmit,{attributes:true,attributeFilter:['disabled']})}
 bench.append(stats);
 }
 if(notes){notes.classList.add('jbc-notes-flyout');workspace.insertAdjacentElement('afterend',notes)}
 const ingredientPanel=bench.querySelector('.bench-col');
 const stationPanel=bench.querySelectorAll('.bench-col')[1];
 const cats=document.createElement('div');cats.className='jbc-categories';cats.innerHTML=[['all','全部'],['base','咖啡基底'],['flavor','风味调味'],['other','冰奶其他']].map(([id,name])=>`<button type="button" data-cat="${id}" aria-pressed="${id==='all'}">${name}</button>`).join('');
 ingredientPanel?.querySelector('.bench-head')?.insertAdjacentElement('afterend',cats);
 const shortcuts=document.createElement('div');shortcuts.className='jbc-machine-shortcuts';shortcuts.innerHTML=[['grindy','⚙️','研磨'],['steam','☕','萃取'],['chill','❄️','冷却'],['shaker','🥁','摇制']].map(([id,icon,name])=>`<button type="button" data-station="${id}" aria-pressed="${id==='steam'}"><span>${icon}</span>${name}</button>`).join('');
 stationPanel?.querySelector('.machine-title')?.insertAdjacentElement('afterend',shortcuts);
 let chosenCat='all';const categories={all:['beans','water','ice','milk','vanilla','citrus','soda','liqueur'],base:['beans','water'],flavor:['vanilla','citrus','liqueur'],other:['ice','milk','soda']};
 function filterIngredients(){q('#ingredients')?.querySelectorAll('.ing').forEach(node=>{const id=node.querySelector('[data-ing]')?.dataset.ing;node.classList.toggle('jbc-hidden',id&&!categories[chosenCat].includes(id))})}
 cats.addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;chosenCat=b.dataset.cat;cats.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filterIngredients()});
 const ingredients=q('#ingredients');if(ingredients)new MutationObserver(m=>{if(m.some(x=>x.type==='childList'))filterIngredients()}).observe(ingredients,{childList:true});filterIngredients();
 function syncShortcuts(){shortcuts.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(!!q(`.machine[data-machine="${b.dataset.station}"].active`))))}
 shortcuts.addEventListener('click',e=>{const b=e.target.closest('[data-station]');if(!b)return;q(`.machine[data-machine="${b.dataset.station}"]`)?.click();syncShortcuts()});
 scene.addEventListener('click',e=>{if(e.target.closest('.machine'))requestAnimationFrame(syncShortcuts)});
 nav.addEventListener('click',e=>{
  const b=e.target.closest('[data-jbc]');if(!b)return;
  const id=b.dataset.jbc;
  if(id==='recipe')ingredientPanel?.scrollIntoView({behavior:'smooth',block:'center'});
  if(id==='customer')order?.scrollIntoView({behavior:'smooth',block:'center'});
  if(id==='research')q('#vx-open')?.click();
  if(id==='journal')q('#journal-btn')?.click();
  if(id==='notes'){notes?.classList.toggle('jbc-open');notes?.scrollIntoView({behavior:'smooth',block:'center'})}
 });
 function updateCup(){
  const bars=[...q('#stat-bars')?.querySelectorAll('.statrow')||[]];const values={};
  for(const r of bars){const text=r.querySelector('span')?.textContent?.trim();const v=Number(r.querySelector('output')?.textContent||0);if(text)values[text]=v}
  const strength=values['浓度']||0,foam=values['泡沫']||0,cold=values['冰感']||0,sweet=values['甜度']||0;
  const glass=q('#jbc-glass'),liquid=q('#jbc-liquid'),froth=q('#jbc-foam'),ice=q('#jbc-ice'),title=q('#jbc-drink-title'),status=q('#jbc-preview-status');if(!glass)return;
  let brewed=(q('#process-state')?.textContent||'').includes('萃取');
  let color=strength>=70?'#6b332b':strength>=40?'#975434':'#b9875d';
  liquid.style.height=brewed?'72%':'5%';liquid.style.background=brewed?`linear-gradient(100deg,#402522,${color} 25%,#a9734d 55%,${color} 85%,#522f26)`:'linear-gradient(#d9c7a2,#dec8a1)';
  froth.style.height=brewed?Math.max(6,foam*.32)+'px':'0px';froth.style.bottom=brewed?'70%':'0%';ice.style.opacity=cold>35&&brewed?'1':'0';
  title.textContent=brewed?(foam>=55?'☁️ 云朵特调':cold>=65?'🧊 冰咖啡特调':strength>=70?'☕ 浓郁特调':'☕ 经理人特调'):'✦ 一杯等待诞生的咖啡';
  status.textContent=brewed?`浓郁 ${strength} · 冰爽 ${cold} · 泡沫 ${foam} · 甜度 ${sweet}`:'先挑选咖啡豆，再指挥机器制作。';
 }
 let pending=false;
 const statsBars=q('#stat-bars');if(statsBars){const o=new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;updateCup()})});o.observe(statsBars,{childList:true,subtree:true,characterData:true})}
 const stateNode=q('#process-state');if(stateNode)new MutationObserver(()=>updateCup()).observe(stateNode,{childList:true,characterData:true,subtree:true});
 updateCup();syncShortcuts();
 const banner=q('#vx-banner');if(banner){workspace.insertAdjacentElement('afterend',banner)}
 q('.shift-kicker')?.replaceChildren(document.createTextNode('✦ CAFÉ MANAGEMENT · DEMO 0.4 ✦'));
 app.querySelector('footer')?.insertAdjacentText('afterbegin','✦ 新版复古界面 · 食材分类、机器快捷操作与实时杯中预览。');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
