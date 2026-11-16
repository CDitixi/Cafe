/* The Jolly Bean Café — Radio Ruby's original jazz.
   Browser-generated instruments; no samples, external requests, or licensed music.
   Audio begins only following a real click/tap. */
(function(){
'use strict';
const radio=document.getElementById('radio-btn');
const bar=document.querySelector('.topbar');
if(!radio||!bar||document.getElementById('jolly-music'))return;
const style=document.createElement('style');
style.textContent='#jolly-music{display:flex;align-items:center;gap:8px;flex:0 0 auto;padding:7px 10px;border:1px solid #c29461;background:rgba(35,24,23,.75);border-radius:13px;color:#efdbb8}#jolly-music button{background:#8c4a3c;border:1px solid #d0a270;color:#fff1d0;border-radius:8px;padding:7px 11px;min-width:100px;font-size:12px;cursor:pointer}#jolly-music button:hover{background:#ac6352}#jolly-music button:focus-visible,#jolly-music input:focus-visible{outline:2px solid #fff0c2;outline-offset:2px}#jolly-music label{display:flex;align-items:center;gap:5px;font-size:13px}#jolly-music input{accent-color:#e2b176;width:72px;cursor:pointer}@media(max-width:1250px){.topbar{flex-wrap:wrap}#jolly-music{margin-left:auto}}@media(max-width:680px){#jolly-music{flex:1 1 100%;order:8;justify-content:center;margin:2px auto}#jolly-music input{width:110px}.top-actions{order:7}}';
document.head.appendChild(style);
const player=document.createElement('div');
player.id='jolly-music';
player.setAttribute('role','group');
player.setAttribute('aria-label','Radio Ruby 音乐播放器');
player.innerHTML='<button type="button" id="jolly-music-toggle" aria-label="播放背景音乐" aria-pressed="false">▶ 播放爵士</button><label title="背景音乐音量">♫ <input type="range" id="jolly-music-volume" min="0" max="100" value="38" aria-label="背景音乐音量"></label>';
bar.insertBefore(player,document.querySelector('.top-actions'));
const toggle=player.querySelector('button'),slider=player.querySelector('input');
const AudioCtor=window.AudioContext||window.webkitAudioContext;
const score=[
{chord:['Bb3','D4','F4','G4'],bass:['Bb2','D3','F3','A2'],tune:[[0,'D5',.7],[1.67,'F5',.24],[2,'G5',.7],[3.33,'F5',.28]]},
{chord:['G3','B3','D4','F4'],bass:['G2','B2','D3','F2'],tune:[[0,'D5',.66],[1,'B4',.65],[2.67,'D5',.3],[3.33,'F5',.28]]},
{chord:['C4','Eb4','G4','Bb4'],bass:['C3','Eb3','G2','Bb2'],tune:[[0,'Eb5',.78],[1.67,'G5',.24],[2,'F5',.7],[3,'Eb5',.65]]},
{chord:['F3','A3','C4','Eb4'],bass:['F2','A2','C3','Eb3'],tune:[[.33,'C5',.66],[1.33,'A4',.45],[2.67,'C5',.3],[3,'D5',.7]]},
{chord:['D3','F3','A3','C4'],bass:['D3','F3','A2','C3'],tune:[[0,'F5',.85],[1,'A4',.5],[2.67,'C5',.3],[3,'D5',.65]]},
{chord:['G3','B3','D4','F4'],bass:['G2','B2','D3','F2'],tune:[[.67,'D5',.5],[1.67,'F5',.35],[2,'G5',.7],[3.33,'F5',.28]]},
{chord:['C4','Eb4','G4','Bb4'],bass:['C3','Eb3','G2','Bb2'],tune:[[0,'Eb5',.7],[1.67,'G5',.28],[2.67,'F5',.35],[3.33,'Eb5',.28]]},
{chord:['Bb3','D4','F4','G4'],bass:['Bb2','F2','D3','Bb2'],tune:[[0,'D5',.75],[1,'C5',.4],[2,'Bb4',1.25]]}
];
let ctx=null,master=null,channelGain=null,whiteNoise=null,interval=null;
let playing=false,channel=0,next=0,measure=0,volume=38;
try{const raw=localStorage.getItem('jolly-radio-volume');if(raw!==null&&Number.isFinite(Number(raw)))volume=Math.max(0,Math.min(100,Number(raw)))}catch(e){}
slider.value=String(volume);
const gameChannel=()=>{try{return window.JollyBeanDemo.getState().radio}catch(e){return 0}};
const frequency=(s)=>{const p=/^([A-G])([b#]?)(\d)$/.exec(s);if(!p)return 440;const base={C:0,D:2,E:4,F:5,G:7,A:9,B:11};const n=12*(Number(p[3])+1)+base[p[1]]+(p[2]==='b'?-1:p[2]==='#'?1:0);return 440*Math.pow(2,(n-69)/12)};
function init(){
  if(!AudioCtor)return false;
  if(ctx)return true;
  ctx=new AudioCtor();
  master=ctx.createGain();master.gain.value=volume/100*.84;master.connect(ctx.destination);
  whiteNoise=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.23),ctx.sampleRate);
  const d=whiteNoise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  return true;
}
function tone(pitch,t,dur,loud,type){
  if(!ctx||!channelGain)return;
  const o=ctx.createOscillator(),gain=ctx.createGain();
  o.type=type||'triangle';o.frequency.setValueAtTime(frequency(pitch),t);
  gain.gain.setValueAtTime(.0001,t);
  gain.gain.exponentialRampToValueAtTime(Math.max(.0002,loud),t+.015);
  gain.gain.exponentialRampToValueAtTime(.0001,t+Math.max(.09,dur));
  o.connect(gain);gain.connect(channelGain);o.start(t);o.stop(t+Math.max(.1,dur)+.03);
}
function percussion(t,type,loud){
  if(type==='kick'){
    const o=ctx.createOscillator(),gain=ctx.createGain();
    o.type='sine';o.frequency.setValueAtTime(125,t);
    o.frequency.exponentialRampToValueAtTime(54,t+.14);
    gain.gain.setValueAtTime(.0001,t);
    gain.gain.exponentialRampToValueAtTime(loud,t+.006);
    gain.gain.exponentialRampToValueAtTime(.0001,t+.16);
    o.connect(gain);gain.connect(channelGain);o.start(t);o.stop(t+.17);
  }else{
    const o=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
    o.buffer=whiteNoise;filter.type=type==='hat'?'highpass':'bandpass';
    filter.frequency.value=type==='hat'?5500:1700;
    gain.gain.setValueAtTime(loud,t);
    gain.gain.exponentialRampToValueAtTime(.0001,t+(type==='hat'?.072:.135));
    o.connect(filter);filter.connect(gain);gain.connect(channelGain);
    o.start(t);o.stop(t+(type==='hat'?.08:.14));
  }
}
function barMusic(t,i){
  const swing=channel===0,b=60/(swing?116:88),a=score[i];
  for(let j=0;j<4;j++)tone(a.bass[j],t+j*b,.36*b,swing?.13:.115,'triangle');
  const rhythm=swing?[.7,2.65]:[1,3];
  for(const pos of rhythm)for(const n of a.chord.slice(1,4))tone(n,t+pos*b,.44*b,.045,'triangle');
  for(let j=0;j<8;j++)percussion(t+(Math.floor(j/2)+(j%2?(swing?.67:.5):0))*b,'hat',swing?.016:.01);
  percussion(t+.01,'kick',swing?.067:.052);percussion(t+2*b,'kick',.05);
  percussion(t+b,'snare',.023);percussion(t+3*b,'snare',.028);
  if(swing||i%2===0)for(const [pos,n,dur] of a.tune)tone(n,t+pos*b,Math.max(.15,dur*b),swing?.06:.045,'sine');
}
function loop(){
  if(!playing||!ctx)return;
  while(next<ctx.currentTime+.42){
    barMusic(next,measure);
    next+=4*60/(channel===0?116:88);
    measure=(measure+1)%score.length;
  }
}
function updateUI(){
  toggle.textContent=playing?(channel===0?'❚❚ 摇摆爵士':'❚❚ 慢爵士'):'▶ 播放爵士';
  toggle.setAttribute('aria-pressed',String(playing));
  toggle.setAttribute('aria-label',playing?'暂停背景音乐':'播放背景音乐');
}
function stop(){
  if(interval!==null){clearInterval(interval);interval=null}
  if(ctx&&channelGain)channelGain.gain.setTargetAtTime(0,ctx.currentTime,.035);
  channelGain=null;playing=false;updateUI();
}
function play(ch){
  if(ch===2){stop();return}
  if(!init()){toggle.textContent='不支持播放';return}
  ctx.resume().catch(()=>{});
  if(playing&&channel===ch)return;
  stop();
  channel=ch;channelGain=ctx.createGain();channelGain.connect(master);
  next=ctx.currentTime+.1;measure=0;playing=true;loop();
  interval=setInterval(loop,80);updateUI();
}
toggle.addEventListener('click',()=>{
  if(playing){stop();return}
  if(gameChannel()===2){radio.click();return}
  play(gameChannel());
});
slider.addEventListener('input',()=>{
  volume=Math.max(0,Math.min(100,Number(slider.value)||0));
  if(ctx&&master)master.gain.setTargetAtTime(volume/100*.84,ctx.currentTime,.04);
  try{localStorage.setItem('jolly-radio-volume',String(volume))}catch(e){}
});
radio.addEventListener('click',()=>{const ch=gameChannel();if(ch===2)stop();else play(ch)});
document.addEventListener('visibilitychange',()=>{if(!ctx)return;if(document.hidden)ctx.suspend().catch(()=>{});else if(playing)ctx.resume().catch(()=>{})});
window.addEventListener('pagehide',stop);
window.JollyRadioMusic={getStatus:()=>({playing,channel,volume}),play,stop};
updateUI();
})();