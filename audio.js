/* The Jolly Bean Café — Original Swing Soundtrack and Machine SFX v0.3.1.
   Procedural original music and sounds: no third-party audio, requests or accounts. */
(() => {
 'use strict'; if(window.JollySound)return;
 const KEY='jolly-bean-audio-v031', AC=window.AudioContext||window.webkitAudioContext;
 let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{}
 const S={music:saved.music!==false,sfx:saved.sfx!==false,volume:Number.isFinite(saved.volume)?Math.max(0,Math.min(1,saved.volume)):.52,started:false,unlocked:false,ctx:null,musicBus:null,fxBus:null,master:null,bar:0,nextBar:0,interval:null};
 const notes=n=>440*Math.pow(2,(n-69)/12),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({music:S.music,sfx:S.sfx,volume:S.volume}))}catch{}};
 let noiseBuf;
 function ensure(){
  if(!AC)return null;
  if(!S.ctx){
   const c=S.ctx=new AC(),comp=c.createDynamicsCompressor(),master=S.master=c.createGain(),m=S.musicBus=c.createGain(),fx=S.fxBus=c.createGain();
   comp.threshold.value=-17;comp.ratio.value=4;comp.attack.value=.004;comp.release.value=.22;
   master.gain.value=S.volume;m.gain.value=S.music?.34:0;fx.gain.value=S.sfx?.73:0;
   m.connect(master);fx.connect(master);master.connect(comp).connect(c.destination);
   noiseBuf=c.createBuffer(1,c.sampleRate*2,c.sampleRate);
   let prev=0;const data=noiseBuf.getChannelData(0);
   for(let i=0;i<data.length;i++){const w=Math.random()*2-1;prev=(prev+w*.26)/1.26;data[i]=w*.7+prev*.3;}
  }
  if(S.ctx.state==='suspended')S.ctx.resume().catch(()=>{});
  S.unlocked=true;return S.ctx;
 }
 function envelope(g,t,d,amp,att=.005,rel=.10){
  const c=S.ctx;t=Math.max(c.currentTime+.001,t);const h=Math.max(.005,d-att-rel);
  g.gain.setValueAtTime(.00001,t);g.gain.linearRampToValueAtTime(amp,t+att);
  g.gain.setValueAtTime(amp,t+att+h);g.gain.exponentialRampToValueAtTime(.00001,t+att+h+rel);
  return t;
 }
 function osc(t,f,d,amp=.06,type='sine',bus=S.musicBus,to=0,filter=0){
  if(!S.ctx)return;const c=S.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;
  const at=Math.max(c.currentTime+.001,t);o.frequency.setValueAtTime(Math.max(30,f),at);
  if(to)o.frequency.exponentialRampToValueAtTime(Math.max(30,to),at+d);
  envelope(g,at,d,amp,.008,Math.min(.14,d*.52));
  if(filter){const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=filter;o.connect(lp).connect(g);}
  else o.connect(g);g.connect(bus);o.start(at);o.stop(at+d+.03);
 }
 function noise(t,d,f=1600,amp=.08,bus=S.fxBus,type='bandpass'){
  if(!S.ctx||!noiseBuf)return;const c=S.ctx,src=c.createBufferSource(),flt=c.createBiquadFilter(),g=c.createGain();
  src.buffer=noiseBuf;src.loop=true;flt.type=type;flt.frequency.value=f;flt.Q.value=.8;
  const at=envelope(g,t,d,amp,.004,Math.min(.16,d*.7));
  src.connect(flt).connect(g).connect(bus);src.start(at);src.stop(at+d+.035);
 }
 // Original 8-bar café swing phrase, with walking bass, comping piano, brushes and lead.
 const bars=[
  {b:[48,52,55,57],c:[60,64,67,69],l:[72,null,76,79,76,null,74,72]},
  {b:[45,49,52,55],c:[57,61,64,67],l:[73,null,76,81,79,null,76,73]},
  {b:[50,53,57,59],c:[60,65,69,72],l:[74,null,77,79,81,null,79,77]},
  {b:[43,47,50,53],c:[59,62,65,69],l:[79,77,null,74,71,74,76,null]},
  {b:[48,52,55,59],c:[59,64,67,72],l:[76,null,79,83,79,null,76,74]},
  {b:[45,49,52,55],c:[57,61,64,67],l:[73,76,78,null,81,78,76,null]},
  {b:[50,53,57,60],c:[60,65,69,72],l:[77,74,72,74,77,null,74,null]},
  {b:[43,47,50,53],c:[59,62,65,69],l:[71,74,77,79,76,74,72,null]}
 ];
 const beat=60/108,barlen=beat*4;
 function score(t,b){
  const p=bars[b%8];
  for(let i=0;i<4;i++){const f=notes(p.b[i]);osc(t+i*beat,f,.44,.19,'triangle',S.musicBus,0,640);osc(t+i*beat,f*2,.13,.035);}
  for(const j of [1,3])p.c.forEach((m,i)=>{osc(t+(j-.45)*beat+i*.006,notes(m),.28,.042,'triangle',S.musicBus,0,2000);});
  for(let i=0;i<8;i++){
   const st=t+(Math.floor(i/2)+(i%2?2/3:0))*beat;
   if(p.l[i]!=null){const f=notes(p.l[i]);osc(st,f,i%2?.16:.26,.082,'triangle',S.musicBus,0,2200);osc(st,f*2,.19,.014);}
   noise(st,i%2?.05:.075,6400,i%2?.014:.021,S.musicBus,'highpass');
   if(i===0||i===4){osc(st,105,.16,.042,'sine',S.musicBus,52);noise(st,.16,210,.029,S.musicBus,'lowpass');}
   if(i===2||i===6)noise(st,.11,1700,.027,S.musicBus);
  }
 }
 function schedule(){
  if(!S.music||!S.ctx||!S.unlocked)return;
  const now=S.ctx.currentTime;
  if(S.nextBar<now-.4)S.nextBar=now+.12;
  let count=0;while(S.nextBar<now+1.1&&count++<4){score(S.nextBar,S.bar++);S.nextBar+=barlen;}
 }
 function start(){
  const c=ensure();if(!c)return;
  if(!S.started){S.started=true;S.nextBar=c.currentTime+.14;S.bar=0;S.interval=setInterval(schedule,180);}
  schedule();render();
 }
 function setMusic(value){
  S.music=!!value;save();if(S.music)start();
  if(S.musicBus)S.musicBus.gain.setTargetAtTime(S.music?.34:0,S.ctx.currentTime,.12);
  render();
 }
 function setSfx(value){
  S.sfx=!!value;save();if(S.sfx)ensure();
  if(S.fxBus)S.fxBus.gain.setTargetAtTime(S.sfx?.73:0,S.ctx.currentTime,.06);
  render();
 }
 function setVolume(value){
  S.volume=clamp(Number(value)||0,0,1);save();
  if(S.master)S.master.gain.setTargetAtTime(S.volume,S.ctx.currentTime,.055);
  render();
 }
 const last={};
 function play(name,opt={}){
  if(!S.sfx||!ensure())return;
  const t=S.ctx.currentTime,gap={sneeze:1.15,grind:.06,steam:.14,shake:.065,ice:.11,success:.2}[name]||0;
  if(last[name]!==undefined&&t-last[name]<gap)return;last[name]=t;
  const f=S.fxBus;
  if(name==='sneeze'){
   noise(t,.18,980,.050,f); // the inhale
   osc(t+.11,190,.20,.102,'sawtooth',f,295,1100);
   osc(t+.13,385,.18,.051,'triangle',f,520);
   noise(t+.30,.27,1500,.28,f);
   noise(t+.33,.20,4400,.12,f);
   osc(t+.33,380,.23,.12,'sawtooth',f,110,1050);
   osc(t+.56,510,.12,.047,'triangle',f,295);return;
  }
  if(name==='grind'){noise(t,.09,520,.12,f);osc(t,110+Math.min(175,(opt.speed||1)*18),.075,.05,'triangle',f,92);return;}
  if(name==='steam'){noise(t,.24,3700,.095,f);osc(t,330,.18,.025,'sine',f,410);return;}
  if(name==='ice'){[830,1255,1720].forEach((hz,i)=>osc(t+i*.045,hz,.23,.072-i*.014,'sine',f));return;}
  if(name==='shake'){noise(t,.11,1400,.115,f);osc(t,175,.10,.05,'triangle',f);return;}
  if(name==='success'){[76,79,83,88].forEach((m,i)=>{osc(t+i*.1,notes(m),.36,.12,'triangle',f);osc(t+i*.1,notes(m)*2,.18,.035,'sine',f);});}
 }
 function render(){
  const m=document.getElementById('jb-music'),fx=document.getElementById('jb-sfx'),v=document.getElementById('jb-volume'),s=document.getElementById('jb-now');
  if(m){m.textContent=S.music?'♫ 音乐开':'♫ 音乐关';m.setAttribute('aria-pressed',String(S.music));}
  if(fx){fx.textContent=S.sfx?'🔊 音效开':'🔇 音效关';fx.setAttribute('aria-pressed',String(S.sfx));}
  if(v)v.value=String(Math.round(S.volume*100));
  if(s)s.textContent=!AC?'此浏览器不支持声音':!S.unlocked?'点击游戏开始播放声音':!S.music?'背景音乐已暂停':'♪ 原创 Swing · Radio Ruby';
 }
 function mount(){
  if(document.getElementById('jb-audio'))return;
  const panel=document.createElement('aside');panel.id='jb-audio';panel.setAttribute('aria-label','咖啡馆声音控制台');
  panel.innerHTML='<div class="jb-audio-title">♪ RADIO RUBY · SOUND ROOM</div><div class="jb-audio-row"><button type="button" id="jb-music" aria-pressed="true">♫ 音乐开</button><button type="button" id="jb-sfx" aria-pressed="true">🔊 音效开</button><button type="button" id="jb-sneeze" title="试听 Grindy Joe 的喷嚏">🤧 试听喷嚏</button></div><div class="jb-audio-bottom"><label for="jb-volume">音量</label><input id="jb-volume" type="range" min="0" max="100" value="52" aria-label="总音量"><span id="jb-now" aria-live="polite">点击游戏开始播放声音</span></div>';
  document.body.appendChild(panel);
  document.getElementById('jb-music').addEventListener('click',()=>setMusic(!S.music));
  document.getElementById('jb-sfx').addEventListener('click',()=>setSfx(!S.sfx));
  document.getElementById('jb-volume').addEventListener('input',e=>setVolume(e.target.value/100));
  document.getElementById('jb-sneeze').addEventListener('click',()=>{
   if(S.music)start();else ensure();play('sneeze');
   const a=document.querySelector('.machine[data-machine="grindy"]');
   if(a){a.classList.remove('vx-sneezing');void a.offsetWidth;a.classList.add('vx-sneezing');setTimeout(()=>a.classList.remove('vx-sneezing'),1150);}
  });
  // Browser autoplay restriction: music unlocks only after a real user interaction.
  document.addEventListener('pointerdown',e=>{
   if(e.target.closest&&e.target.closest('#jb-music,#jb-sfx'))return;
   if(S.music)start();else ensure();
  },{once:true,capture:true});
  document.addEventListener('keydown',e=>{
   if(!e.repeat&&(e.key==='Enter'||e.key===' ')){if(S.music)start();else ensure();}
  },{once:true});
  document.addEventListener('visibilitychange',()=>{
   if(S.musicBus&&S.ctx)S.musicBus.gain.setTargetAtTime(document.hidden?0:(S.music?.34:0),S.ctx.currentTime,.12);
  });
  render();
 }
 window.JollySound={start,play,setMusic,setSfx,setVolume,ensure,effectsBus:()=>S.fxBus||(ensure()&&S.fxBus),isSfxOn:()=>S.sfx,isMusicOn:()=>S.music,debug:()=>({started:S.started,unlocked:S.unlocked,contextState:S.ctx?.state||'not-created',music:S.music,sfx:S.sfx,volume:S.volume,bar:S.bar})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
