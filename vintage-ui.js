/* The Jolly Bean Café: re-layout original working game into playable illustrated interface. */
(()=>{
'use strict';
if(window.__jbcVintageReady)return;

function drawJollyCup({strength,foam,cold,brewed}){
 const deep=strength>70?'#522519':strength>45?'#784027':'#aa7041';
 const liquidHeight=brewed?162:0;
 const liquidY=237-liquidHeight;
 const bubbles=foam>18?Array.from({length:12},(_,i)=>{
  const x=107+(i*29)%111, y=liquidY-3-(i%3)*5,r=3+(i%4);
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${i%2?'#fff5dc':'#e2b67b'}" opacity=".9"/>`;
 }).join(''):'';
 const cubes=brewed&&cold>34?Array.from({length:3},(_,i)=>{
  let x=119+i*34, y=liquidY+39+(i%2)*38;
  return `<g transform="rotate(${i*21-17} ${x} ${y})"><rect x="${x}" y="${y}" width="32" height="27" rx="6" fill="#e6faf6" fill-opacity=".45" stroke="#f8ffff" stroke-width="3"/><path d="M ${x+4} ${y+13} L ${x+23} ${y+3}" stroke="#fff" stroke-opacity=".55" stroke-width="3"/></g>`;
 }).join(''):'';
 const crema=brewed?`<ellipse cx="164" cy="${liquidY+4}" rx="69" ry="13" fill="#bc8054" opacity=".9"/>`:'';
 const layer=brewed?`<rect x="89" y="${liquidY}" width="150" height="174" fill="url(#jbc-coffee-fill)"/>${crema}${cubes}`:'';
 const froth=brewed&&foam>16?`<ellipse cx="164" cy="${liquidY-3}" rx="71" ry="15" fill="#f4d4a0"/><path d="M95 ${liquidY-2} Q104 ${liquidY-28} 121 ${liquidY-16} Q140 ${liquidY-45} 162 ${liquidY-23} Q184 ${liquidY-44} 205 ${liquidY-16} Q225 ${liquidY-20} 233 ${liquidY-2} Z" fill="url(#jbc-cream)"/>${bubbles}`:'';
 const steam=brewed&&cold<30?`<g fill="none" stroke="#fff5d9" stroke-width="5" opacity=".7" stroke-linecap="round"><path d="M133 62 Q120 49 134 38 T138 16"/><path d="M185 58 Q199 44 182 32 T181 11"/></g>`:'';
 return `<svg viewBox="0 0 330 290" role="img" aria-label="${brewed?'已萃取的原创咖啡插画':'等待萃取的空玻璃杯'}">
 <defs><clipPath id="jbc-art-glass-clip"><path d="M89 61 L96 233 Q164 254 232 233 L239 61 Z"/></clipPath>
 <linearGradient id="jbc-coffee-fill" x1="0" x2="1"><stop stop-color="#49251d"/><stop offset=".34" stop-color="${deep}"/><stop offset=".7" stop-color="#b67b4c"/><stop offset="1" stop-color="#5a2b1d"/></linearGradient>
 <linearGradient id="jbc-cream" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#fff6df"/><stop offset="1" stop-color="#c99464"/></linearGradient>
 <linearGradient id="jbc-glass-glaze" x1="0" x2="1"><stop stop-color="#fff8e7" stop-opacity=".85"/><stop offset=".24" stop-color="#fff8e7" stop-opacity=".02"/><stop offset=".84" stop-color="#fff8e7" stop-opacity=".12"/><stop offset="1" stop-color="#fffdf3" stop-opacity=".72"/></linearGradient></defs>
 <ellipse cx="164" cy="264" rx="95" ry="10" fill="#5f3a26" opacity=".2"/>
 ${steam}<g clip-path="url(#jbc-art-glass-clip)"><path d="M89 61 L96 233 Q164 254 232 233 L239 61 Z" fill="#f0e7d4" opacity=".14"/>${layer}${froth}<path d="M105 70 Q112 163 108 227" fill="none" stroke="#fffdf4" stroke-width="10" opacity=".56"/></g>
 <path d="M89 61 L96 233 Q164 254 232 233 L239 61 Z" fill="url(#jbc-glass-glaze)" stroke="#fff9e7" stroke-width="6"/><path d="M89 61 L96 233 Q164 254 232 233 L239 61 Z" fill="none" stroke="#9b6946" stroke-opacity=".4" stroke-width="2"/>
 <ellipse cx="164" cy="61" rx="76" ry="12" fill="none" stroke="#fffcf0" stroke-width="7"/><path d="M109 229 Q164 242 217 229" fill="none" stroke="#e8d6b6" stroke-width="5" opacity=".7"/>
 </svg>`;
}
function createJollySceneBackdrop(scene){
 if(scene.querySelector('.jbc-stage-art'))return;
 const back=document.createElement('div');back.className='jbc-stage-art';
 let jars='';for(let i=0;i<12;i++){
  const x=430+i*60, y=114+(i%3)*2;
  jars+=`<g><rect x="${x}" y="${y}" width="31" height="47" rx="5" fill="#c88f4b" fill-opacity=".35" stroke="#dca55e" stroke-width="2"/><rect x="${x-2}" y="${y-8}" width="35" height="9" rx="2" fill="#a26736"/><circle cx="${x+15}" cy="${y+28}" r="8" fill="#5c3624" opacity=".8"/></g>`;
 }
 const svg=`<svg viewBox="0 0 1200 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>
 <linearGradient id="jbc-wall-grad" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#49211f"/><stop offset=".56" stop-color="#7b4530"/><stop offset="1" stop-color="#aa6b3c"/></linearGradient>
 <linearGradient id="jbc-window-grad" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#445a76"/><stop offset=".6" stop-color="#9a6c73"/><stop offset="1" stop-color="#f4bc76"/></linearGradient>
 <radialGradient id="jbc-golden-light"><stop stop-color="#ffd599" stop-opacity=".55"/><stop offset="1" stop-color="#e3a45c" stop-opacity="0"/></radialGradient></defs>
 <rect width="1200" height="480" fill="url(#jbc-wall-grad)"/>
 <g opacity=".26" stroke="#e5a35e" stroke-width="7"><path d="M0 33 H1200 M0 98 H1200"/><path d="M0 3 V480 M310 3 V480 M715 3 V480 M1180 3 V480"/></g>
 <path d="M35 344 V107 Q35 25 175 25 Q318 25 318 107 V344 Z" fill="#613725" stroke="#dbab62" stroke-width="14"/>
 <path d="M49 331 V104 Q49 40 176 40 Q305 40 305 104 V331 Z" fill="url(#jbc-window-grad)"/>
 <g fill="#432c43" opacity=".72"><path d="M52 331 V242 H78 V217 H104 V269 H130 V180 H155 V235 H177 V205 H195 V257 H229 V197 H258 V246 H302 V331 Z"/></g>
 <path d="M177 40 V331 M49 180 H306" stroke="#8a5135" stroke-width="13"/><path d="M177 40 V331 M49 180 H306" stroke="#dfad74" stroke-width="4" opacity=".8"/>
 <g opacity=".95"><path d="M438 113 H1150" stroke="#d7a25f" stroke-width="15"/><path d="M421 170 H1160" stroke="#673421" stroke-width="12"/>${jars}</g>
 <g fill="#c38949" opacity=".9"><path d="M845 0 V170 M1070 0 V184" stroke="#d9a25e" stroke-width="11"/><circle cx="843" cy="145" r="30"/><circle cx="1067" cy="165" r="31"/></g>
 <g><path d="M640 0 V59" stroke="#b78148" stroke-width="9"/><ellipse cx="640" cy="102" rx="96" ry="39" fill="#bb7538" stroke="#eebc73" stroke-width="7"/><ellipse cx="640" cy="93" rx="69" ry="27" fill="#ffe0a0"/><ellipse cx="640" cy="135" rx="170" ry="115" fill="url(#jbc-golden-light)"/></g>
 <g><path d="M1030 0 V64" stroke="#be8b54" stroke-width="9"/><ellipse cx="1030" cy="88" rx="76" ry="26" fill="#b07333" stroke="#e7b973" stroke-width="6"/><ellipse cx="1030" cy="81" rx="57" ry="18" fill="#ffd896"/><ellipse cx="1020" cy="144" rx="150" ry="100" fill="url(#jbc-golden-light)"/></g>
 <path d="M0 340 H1200" stroke="#5b2b20" stroke-width="15"/>
 <path d="M0 351 H1200" stroke="#d49a58" stroke-width="6"/>
 </svg>`;
 back.innerHTML=svg;scene.prepend(back);
}
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
 createJollySceneBackdrop(scene);
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
 const previewArt=document.createElement('div');previewArt.className='jbc-art-cup';previewArt.id='jbc-art-cup';stats.querySelector('.jbc-preview-stage')?.append(previewArt);
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
  const cupArt=q('#jbc-art-cup');if(cupArt)cupArt.innerHTML=drawJollyCup({strength,foam,cold,brewed});
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