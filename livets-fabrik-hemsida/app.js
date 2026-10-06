/* Livets fabrik – studieguide. Core: utils, meta, state, sync, router, shell. */
"use strict";
const G = window.G = {data:{}, bank:null, loaded:{}, idx:null, w:{}};
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function h(html){const t=document.createElement("template");t.innerHTML=html.trim();return t.content.firstElementChild}
function frag(html){const t=document.createElement("template");t.innerHTML=html;return t.content}
function hash(s){let x=2166136261;for(let i=0;i<s.length;i++){x^=s.charCodeAt(i);x=Math.imul(x,16777619)}return (x>>>0).toString(36)}
function rng(seed){let a=seed>>>0||1;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function shuffle(arr,seed){const a=arr.slice();const r=seed==null?Math.random:rng(seed);for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function pick(arr,n,seed){return shuffle(arr,seed).slice(0,n)}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function norm(s){return String(s||"").toLowerCase().replace(/[‐-―]/g,"-").replace(/\s+/g," ").trim()}
function plain(html){const d=document.createElement("div");d.innerHTML=html;return d.textContent||""}
const DAYMS=864e5;
function dayOf(d){d=d||new Date();return Math.floor((d.getTime()-d.getTimezoneOffset()*6e4)/DAYMS)}
function today(){return dayOf(new Date())}
function dateOfDay(n){const d=new Date(n*DAYMS);return new Date(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())}
function dayFromISO(s){if(!s)return null;const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s);if(!m)return null;return dayOf(new Date(+m[1],+m[2]-1,+m[3]))}
const WD=["sön","mån","tis","ons","tor","fre","lör"],MO=["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];
function fmtDay(n){const d=dateOfDay(n);return WD[d.getDay()]+" "+d.getDate()+" "+MO[d.getMonth()]}
function plural(n,a,b){return n+" "+(n===1?a:b)}
function toast(msg,ms){const t=h(`<div class="toast" role="status">${esc(msg)}</div>`);document.body.appendChild(t);setTimeout(()=>t.remove(),ms||2200)}
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement("script");s.src=src;s.onload=()=>res();s.onerror=()=>rej(new Error("Kunde inte ladda "+src));document.head.appendChild(s)})}

/* ---------- meta ---------- */
const PARTS={
  A:{n:"Cellen",c:"var(--pa)",s:"var(--pa-soft)"},
  B:{n:"Mikroberna",c:"var(--pb)",s:"var(--pb-soft)"},
  C:{n:"Kampen mot bakterierna",c:"var(--pc)",s:"var(--pc-soft)"},
  D:{n:"Växten",c:"var(--pd)",s:"var(--pd-soft)"}
};
const CH=[
  {id:"k1",n:1,p:"A",t:"Livets molekyler",fab:"Råvarorna fabriken bygger med",sc:"molekyl"},
  {id:"k2",n:2,p:"A",t:"Tre sorters celler",fab:"Fabriker i olika modeller",sc:"cell"},
  {id:"k3",n:3,p:"A",t:"Cellmembranet",fab:"Tullgränsen runt fabriken",sc:"membran"},
  {id:"k4",n:4,p:"A",t:"Organellerna",fab:"Fabrikens avdelningar",sc:"organell"},
  {id:"k5",n:5,p:"A",t:"Transport över membran",fab:"Portar, pumpar och lastkajer",sc:"membran"},
  {id:"k6",n:6,p:"A",t:"Energin: ATP",fab:"Fabrikens valuta och kraftverk",sc:"molekyl"},
  {id:"k7",n:7,p:"B",t:"Eukaryota mikroorganismer",fab:"Hela fabriker i en enda cell",sc:"mikrob"},
  {id:"k8",n:8,p:"B",t:"Bakterier",fab:"Verkstaden i ett enda rum",sc:"mikrob"},
  {id:"k9",n:9,p:"B",t:"Gener som flyttar sig",fab:"Receptkort som byter ägare",sc:"gen"},
  {id:"k10",n:10,p:"B",t:"Arkéer, virus och livets träd",fab:"Extremverkstäder och kapare",sc:"mikrob"},
  {id:"k11",n:11,p:"C",t:"Antibiotika",fab:"Sabotörerna i verkstaden",sc:"molekyl"},
  {id:"k12",n:12,p:"C",t:"Resistens och vaccin",fab:"Verkstaden slår tillbaka",sc:"population"},
  {id:"k13",n:13,p:"D",t:"Växten och växtcellen",fab:"Den gröna fabriken",sc:"organism"}
];
const CHM={};CH.forEach(c=>CHM[c.id]=c);
function chColor(id){const c=CHM[id];return c?PARTS[c.p].c:"var(--acc)"}
function chLabel(id){const c=CHM[id];return c?("K"+c.n+" "+c.t):id}

const ICON={
  membran:'<svg viewBox="0 0 16 16"><path d="M1 5.2c2-1.6 4-1.6 6 0s4 1.6 6 0M1 10.8c2-1.6 4-1.6 6 0s4 1.6 6 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  vagg:'<svg viewBox="0 0 16 16"><path d="M1.5 3h13v10h-13zM1.5 6.3h13M1.5 9.7h13M6 3v3.3M10 6.3v3.4M6 9.7V13" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  endo:'<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.3" fill="none" stroke="currentColor" stroke-width="1.6"/><ellipse cx="8.6" cy="8.6" rx="3.2" ry="2" fill="currentColor"/></svg>',
  osmos:'<svg viewBox="0 0 16 16"><path d="M8 1.6C5.8 5 4 7.2 4 9.8a4 4 0 0 0 8 0C12 7.2 10.2 5 8 1.6z" fill="currentColor"/></svg>',
  nyckel:'<svg viewBox="0 0 16 16"><circle cx="4.6" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M7.6 8h7M12 8v3M14.4 8v2.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  plasmid:'<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="3 1.6"/><circle cx="8" cy="2.4" r="1.6" fill="currentColor"/></svg>',
  atp:'<svg viewBox="0 0 16 16"><path d="M9.2 1 3.5 9h4l-1 6 6-8.4H8.4z" fill="currentColor"/></svg>',
  ribosom:'<svg viewBox="0 0 16 16"><ellipse cx="8" cy="6" rx="5" ry="3.4" fill="currentColor"/><ellipse cx="8" cy="10.6" rx="3.6" ry="2.2" fill="currentColor" opacity=".6"/><path d="M.8 9h14.4" stroke="currentColor" stroke-width="1.2" stroke-dasharray="1.6 1.2"/></svg>'
};
const THREADS={
  membran:{n:"Membranet överallt",c:"var(--t-membran)",d:"Samma byggsten, fosfolipiden, gör cellmembran, organellmembran, vesiklar, bakteriers yttre membran och virusets hölje. Arkéerna har en egen sort."},
  vagg:{n:"Cellväggar",c:"var(--t-vagg)",d:"Djurceller saknar cellvägg. Växter har cellulosa, bakterier peptidoglykan och svampar har också vägg. Penicillin slår mot bakteriens väggbygge."},
  endo:{n:"Endosymbios",c:"var(--t-endo)",d:"Mitokondrien och kloroplasten var en gång fria bakterier. Bevisen: två membran, eget ringformat DNA och bakterieliknande ribosomer."},
  osmos:{n:"Osmos i olika celler",c:"var(--t-osmos)",d:"Vatten går dit det finns mest löst ämne. Röda blodkroppar kan spricka, växtceller får turgor i stället, eftersom cellväggen tar emot trycket."},
  nyckel:{n:"Nyckel i lås",c:"var(--t-nyckel)",d:"Molekyler som passar exakt: receptorer och signalämnen, LDL-receptorn, virus som fäster på celler och antibiotika som binder till bakteriens enzym eller ribosom."},
  plasmid:{n:"Plasmiden",c:"var(--t-plasmid)",d:"Små ringar av extra DNA i bakterier. De kan flytta mellan bakterier och bär ofta gener för antibiotikaresistens."},
  atp:{n:"ATP",c:"var(--t-atp)",d:"Cellens energivaluta. Bildas mest i mitokondrien och driver pumpar, aktiv transport och bygget av molekyler."},
  ribosom:{n:"Ribosomen",c:"var(--t-ribosom)",d:"Arbetsbänken där proteiner byggs. Bakteriens ribosomer skiljer sig från våra, och därför kan vissa antibiotika stoppa just dem."}
};
function thrChip(id,link){const t=THREADS[id];if(!t)return"";const inner=`${ICON[id]}${esc(t.n)}`;return link===false?`<span class="thr" style="color:${t.c}">${inner}</span>`:`<a class="thr" style="color:${t.c}" href="#trad.${id}">${inner}</a>`}

/* ---------- content templating ---------- */
function tpl(s){
  return String(s||"")
    .replace(/\{\{prov\}\}/g,'<span class="tag prov" title="Finns både i boken och i lärarens material">Provviktigt</span>')
    .replace(/\{\{lek(?::([^}]*))?\}\}/g,(m,a)=>`<span class="tag lek" title="Finns bara i lärarens material">Från lektionen${a?" · "+esc(a):""}</span>`)
    .replace(/\{\{extra\}\}/g,'<span class="tag extra">Extra (inte i boken)</span>')
    .replace(/\{\{diff(?::([^}]*))?\}\}/g,(m,a)=>`<span class="tag diff">Boken och läraren skiljer sig${a?" · "+esc(a):""}</span>`)
    .replace(/\{\{src:([^}]*)\}\}/g,(m,a)=>`<span class="tag src">${esc(a)}</span>`)
    .replace(/\{\{t:([a-z]+)\}\}/g,(m,a)=>thrChip(a))
    .replace(/\{\{go:([a-z0-9.]+)\|([^}]*)\}\}/g,(m,a,b)=>`<a href="#${a}">${esc(b)}</a>`);
}

/* ---------- state ---------- */
const LS="livets-fabrik-v1";
function blank(){return{v:1,t:0,sv:{},cards:{},qa:{},open:{},ch:{},plan:{exam:"",done:{},t:0},exams:[],x:{},set:{newPer:25,t:0},nd:{}}}
let S=blank();
try{const raw=localStorage.getItem(LS);if(raw){const v=JSON.parse(raw);if(v&&v.v===1)S=Object.assign(blank(),v)}}catch(e){}
const MAPS=["cards","qa","open","ch","x","sv"];
function stamp(o){o.t=Date.now();return o}
function saveLocal(){try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}}
let saveT=null;
function save(){S.t=Date.now();saveLocal();Sync.queue();clearTimeout(saveT);saveT=setTimeout(()=>{renderRail();},120)}
function mergeState(a,b){ /* item-level last-write-wins */
  const out=blank();
  MAPS.forEach(k=>{const A=a[k]||{},B=b[k]||{};const o={};
    new Set([...Object.keys(A),...Object.keys(B)]).forEach(id=>{const x=A[id],y=B[id];o[id]=!x?y:!y?x:((y.t||0)>(x.t||0)?y:x)});out[k]=o});
  out.plan=((b.plan&&b.plan.t)||0)>((a.plan&&a.plan.t)||0)?b.plan:a.plan;
  out.set=((b.set&&b.set.t)||0)>((a.set&&a.set.t)||0)?b.set:a.set;
  const ex={};[...(a.exams||[]),...(b.exams||[])].forEach(e=>{if(e&&e.t)ex[e.t]=e});out.exams=Object.values(ex).sort((p,q)=>p.t-q.t).slice(-30);
  out.nd=Object.assign({},a.nd||{},b.nd||{});
  out.t=Math.max(a.t||0,b.t||0);return out;
}
const Sync={db:null,refs:null,on:false,pushT:null,busy:false,again:false,fails:0,lastRemote:"",
  split(){return{
    srs:{v:1,t:S.t,cards:S.cards,nd:S.nd},
    svar:{v:1,t:S.t,qa:S.qa,x:S.x,exams:S.exams},
    meta:{v:1,t:S.t,open:S.open,ch:S.ch,plan:S.plan,set:S.set,sv:S.sv}}},
  join(p){const o=blank();if(p.srs){o.cards=p.srs.cards||{};o.nd=p.srs.nd||{}}if(p.svar){o.qa=p.svar.qa||{};o.x=p.svar.x||{};o.exams=p.svar.exams||[]}if(p.meta){o.sv=p.meta.sv||{};o.open=p.meta.open||{};o.ch=p.meta.ch||{};o.plan=p.meta.plan||o.plan;o.set=p.meta.set||o.set}
    o.t=Math.max(...["srs","svar","meta"].map(k=>(p[k]&&p[k].t)||0));return o},
  async init(){
    const c=window.claude;if(!c||typeof c.use!=="function")return;
    try{
      const [db,user]=await Promise.all([c.use("db"),c.use("user")]);
      if(!db||!user)return;
      const id=await user.id();if(!id)return;
      const base="data/users/"+id+"/";
      this.refs={srs:db.doc(base+"srs"),svar:db.doc(base+"svar"),meta:db.doc(base+"meta")};
      const snaps=await Promise.all(Object.values(this.refs).map(r=>r.get()));
      const p={};["srs","svar","meta"].forEach((k,i)=>{if(snaps[i].exists)p[k]=snaps[i].data()});
      const remote=this.join(p);
      const before=JSON.stringify([S.cards,S.qa,S.open]);
      S=mergeState(S,remote);saveLocal();
      this.on=true;this.msg();
      if(JSON.stringify([S.cards,S.qa,S.open])!==before){rerender()}
      this.push();
      Object.entries(this.refs).forEach(([k,ref])=>{try{ref.onSnapshot(sn=>{if(!sn||!sn.exists)return;const d=sn.data();if(!d||(d.t||0)<=0)return;
        const part={};part[k]=d;const r=this.join(part);
        // only merge the maps that live in this doc
        const m=mergeState(S,Object.assign(blank(),r,{plan:k==="meta"?r.plan:S.plan,set:k==="meta"?r.set:S.set}));
        const changed=JSON.stringify(m.cards)!==JSON.stringify(S.cards)||JSON.stringify(m.qa)!==JSON.stringify(S.qa)||JSON.stringify(m.open)!==JSON.stringify(S.open);
        S=m;saveLocal();if(changed)softRefresh()},()=>{})}catch(e){}});
    }catch(e){this.on=false;this.msg()}
  },
  queue(){if(!this.refs)return;clearTimeout(this.pushT);this.pushT=setTimeout(()=>this.push(),1500)},
  async push(){
    if(!this.refs)return;if(this.busy){this.again=true;return}
    this.busy=true;
    try{const p=this.split();for(const k of Object.keys(p)){const body=JSON.parse(JSON.stringify(p[k]));const s=JSON.stringify(body);if(s.length<240000)await this.refs[k].set(body)}this.fails=0;this.on=true}
    catch(e){this.fails++;if(this.fails>3){this.on=false}}
    this.busy=false;this.msg();
    if(this.again){this.again=false;setTimeout(()=>this.push(),1500)}
  },
  msg(){const el=$("#syncNote");if(el)el.innerHTML=this.on?"<b>Synkas med ditt konto.</b> Dina framsteg följer med mellan mobil och dator.":"Dina framsteg sparas i den här webbläsaren. När du är inloggad synkas de mellan dina enheter."}
};

/* ---------- bank & progress ---------- */
const CARD_INT=[0,1,2,4,8,16];
function examDay(){return dayFromISO(S.plan&&S.plan.exam)}
function cardState(id){return S.cards[id]||null}
function cardDue(id,t){const c=S.cards[id];return c?c.d<=(t==null?today():t):false}
function rateCard(id,r){
  const t=today();const c=S.cards[id]||{b:0,n:0};
  let b=c.b||0;
  if(r===2)b=b?Math.min(b+1,5):2; else if(r===1)b=Math.max(b,1); else b=1;
  let d=t+(r===0?0:r===1?1:CARD_INT[b]);
  const ex=examDay();if(ex!=null&&ex>t&&d>=ex&&r>0)d=Math.max(t+1,ex-1);
  S.cards[id]=stamp({b,d,n:(c.n||0)+1,l:r,f:c.f||t});
  if(r===0){S.cards[id].d=t}
  save();
}
function recQA(id,ok,conf,extra){const o=S.qa[id]||{n:0,w:0};o.n=(o.n||0)+1;if(!ok)o.w=(o.w||0)+1;o.ok=!!ok;o.c=conf;o.d=today();Object.assign(o,extra||{});S.qa[id]=stamp(o);save()}
function qaStatus(id){const o=S.qa[id];if(!o)return"new";if(o.ok&&o.c===2)return"k";if(o.ok)return"d";if(!o.ok&&o.c===2)return"f";return"n"}
function openRate(id,r,txt){const o=S.open[id]||{};o.r=r;if(txt!=null)o.txt=txt;o.d=today();S.open[id]=stamp(o);save()}
function itemsOfCh(id){const b=G.bank;if(!b)return null;return b.byCh[id]||null}
function chProgress(id){
  const it=itemsOfCh(id);if(!it)return 0;
  const cards=it.cards,mc=it.mc,kan=it.kan;
  const cp=cards.length?cards.filter(c=>(S.cards[c.id]||{}).b>=3).length/cards.length:0;
  const qp=mc.length?mc.filter(q=>qaStatus(q.id)==="k").length/mc.length:0;
  const kp=kan.length?kan.filter(k=>(S.open[k.id]||{}).r===2).length/kan.length:0;
  return Math.round(100*(cp*.4+qp*.35+kp*.25));
}
function dueCount(){if(!G.bank)return 0;const t=today();return G.bank.cards.filter(c=>{const s=S.cards[c.id];return s&&s.d<=t}).length}
function weakItems(){
  if(!G.bank)return[];const out=[];
  G.bank.mc.forEach(q=>{const s=qaStatus(q.id);if(s==="f"||s==="n")out.push({it:q,sev:s==="f"?3:2,why:s==="f"?"Fel men du var säker":"Fel svar"});else if(s==="d"&&S.qa[q.id].c===0)out.push({it:q,sev:1,why:"Rätt, men du gissade"})});
  G.bank.cards.forEach(c=>{const s=S.cards[c.id];if(s&&(s.l===0||(s.b<=1&&s.n>=2)))out.push({it:c,sev:s.l===0?2:1,why:s.l===0?"Kunde inte kortet senast":"Kortet sitter inte ännu"})});
  G.bank.kan.forEach(k=>{const o=S.open[k.id];if(o&&o.r<2)out.push({it:k,sev:o.r===0?2:1,why:o.r===0?"Kunde inte":"Kunde delvis"})});
  G.bank.open.forEach(k=>{const o=S.open[k.id];if(o&&o.r!=null&&o.r<2)out.push({it:k,sev:o.r===0?2:1,why:o.r===0?"Kunde inte":"Kunde delvis"})});
  return out.sort((a,b)=>b.sev-a.sev);
}

/* ---------- loading ---------- */
function ensureBank(){if(G.bank)return Promise.resolve();if(!G._bankP)G._bankP=loadScript("data/bank.js").then(()=>{renderRail()}).catch(e=>{console.error(e)});return G._bankP}
G.bankAll=function(B){
  const byCh={};const all={cards:[],mc:[],open:[],kan:[],kompis:[],pre:[],gloss:[],snabb:{}};
  CH.forEach(c=>{const b=B[c.id];const o={cards:[],mc:[],open:[],kan:[],kompis:[],pre:[],gloss:[]};byCh[c.id]=o;if(!b)return;
    (b.cards||[]).forEach(x=>{x.kind="card";x.ch=c.id;o.cards.push(x)});
    ["f","u"].forEach(l=>((b.quiz||{})[l]||[]).forEach(x=>{x.kind="mc";x.lv=l;x.ch=c.id;o.mc.push(x)}));
    ((b.quiz||{}).o||[]).forEach(x=>{x.kind="open";x.lv="o";x.ch=c.id;o.open.push(x)});
    (b.kan||[]).forEach(x=>{x.kind="kan";x.ch=c.id;o.kan.push(x)});
    (b.kompis||[]).forEach(x=>{x.kind="kompis";x.ch=c.id;o.kompis.push(x)});
    (b.pre||[]).forEach(x=>{x.kind="mc";x.lv="pre";x.ch=c.id;o.pre.push(x)});
    (b.gloss||[]).forEach(x=>{x.ch=c.id;o.gloss.push(x)});
    if(b.snabb)all.snabb[c.id]=b.snabb;
    ["cards","mc","open","kan","kompis","pre","gloss"].forEach(k=>all[k].push(...o[k]));
  });
  all.byCh=byCh;all.byId={};["cards","mc","open","kan","kompis","pre"].forEach(k=>all[k].forEach(x=>all.byId[x.id]=x));
  G.bank=all;
};
G.def=function(d){G.data[d.id]=d};
function ensureCh(id){if(G.data[id])return Promise.resolve();if(!G.loaded[id])G.loaded[id]=loadScript("data/"+id+".js");return G.loaded[id]}

/* ---------- shell ---------- */
const NAV_TOOLS=[["sok","Sök i guiden","⌕"],["atlas","Cellatlasen","◎"],["jamfor","Stora jämförelsen","▦"],["trad","Röda trådar","∿"],["tidslinje","Tidslinjen","┃"],["karta","Begreppskartor","⌘"],["korsord","Cellkrysset","#"],["ab","Arbetsbladen","✎"]];
const NAV_PRACT=[["pass","Dagens pass","▶"],["kort","Flashcards","❏"],["quiz","Quiz","?"],["prov","Provsimulator","⏱"],["svaga","Mina svaga punkter","!"],["sparat","Sparat","★"],["snabb","Snabböversikt","≡"],["ord","Ordlista","Aa"],["plan","Studieplan","▤"]];
function renderRail(){
  const r=$("#rail");if(!r)return;const cur=(location.hash||"#start").slice(1).split(".")[0]||"start";
  const due=dueCount();const weak=G.bank?weakItems().length:0;
  let s=`<a class="brand" href="#start" aria-label="Livets fabrik, startsidan">${LOGO}<b>Livets fabrik</b></a><div class="nav">`;
  s+=`<a href="#start" class="${cur==="start"?"on":""}"><span class="ic">⌂</span><span>Start</span><span></span></a>`;
  let lastP="";
  CH.forEach(c=>{if(c.p!==lastP){lastP=c.p;s+=`<div class="navg"><i style="background:${PARTS[c.p].c}"></i>${esc(PARTS[c.p].n)}</div>`}
    const pr=chProgress(c.id);
    s+=`<a href="#${c.id}" class="${cur===c.id?"on":""}" title="${esc(c.t)}: ${pr} % klart"><span class="n">${c.n}</span><span>${esc(c.t)}</span><span class="pr" aria-label="${pr} procent"><u style="width:${pr}%"></u></span></a>`});
  s+=`<div class="navg">Verktyg</div>`;
  NAV_TOOLS.forEach(([id,n,ic])=>{s+=`<a href="#${id}" class="${cur===id?"on":""}"><span class="ic">${ic}</span><span>${n}</span><span></span></a>`});
  s+=`<div class="navg">Öva</div>`;
  NAV_PRACT.forEach(([id,n,ic])=>{let b="";if(id==="pass"&&due)b=`<span class="badge">${due}</span>`;if(id==="svaga"&&weak)b=`<span class="badge">${weak}</span>`;if(id==="sparat"){const n=savedCount();if(n)b=`<span class="badge" style="background:var(--mid)">${n}</span>`}
    s+=`<a href="#${id}" class="${cur===id?"on":""}"><span class="ic">${ic}</span><span>${n}</span>${b||"<span></span>"}</a>`});
  s+=`</div><p class="sync" id="syncNote"></p>`;
  r.innerHTML=s;Sync.msg();
}
const LOGO='<svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="none" stroke="var(--c-mem)" stroke-width="3"/><circle cx="14" cy="15" r="6" fill="var(--c-nuc)" opacity=".85"/><ellipse cx="23" cy="21" rx="3.6" ry="2" fill="var(--c-mito)" transform="rotate(-25 23 21)"/><circle cx="21" cy="9" r="1.6" fill="var(--ink)"/><circle cx="9" cy="23" r="1.4" fill="var(--ink)"/></svg>';
function closeMenu(){document.body.classList.remove("menu");const b=$("#menuBtn");if(b)b.setAttribute("aria-expanded","false")}

/* ---------- router ---------- */
const VIEWS={};
let curView="";
function route(){
  const raw=(location.hash||"#start").slice(1)||"start";
  const [name,...rest]=raw.split(".");const arg=rest.join(".");
  const main=$("#main");closeMenu();
  const fn=VIEWS[name]||(CHM[name]?VIEWS._chapter:null);
  const v=document.createElement("div");v.className="view";
  main.innerHTML="";main.appendChild(v);
  const sameView=curView===name;curView=name;
  const title=CHM[name]?("K"+CHM[name].n+" "+CHM[name].t):((NAV_TOOLS.concat(NAV_PRACT).find(x=>x[0]===name)||[0,"Livets fabrik"])[1]);
  $("#topTitle").textContent=title;document.title=name==="start"?"Livets fabrik":title+" · Livets fabrik";
  renderRail();
  if(!fn){VIEWS.start(v);return}
  Promise.resolve(fn(v,arg||"",name)).then(()=>{
    if(arg&&CHM[name]){const t=document.getElementById(name+"-"+arg)||document.getElementById(arg);if(t)setTimeout(()=>t.scrollIntoView({behavior:"auto",block:"start"}),30)}
    else if(!sameView||!arg)window.scrollTo(0,0);
  }).catch(e=>{console.error(e);v.innerHTML=`<div class="empty">Något gick fel när sidan skulle visas: ${esc(e.message)}. Ladda om sidan.</div>`});
}
function rerender(){route()}
function softRefresh(){renderRail();const f=G._soft;if(typeof f==="function")f()}
window.addEventListener("hashchange",route);
document.addEventListener("click",e=>{const a=e.target.closest&&e.target.closest("a[href^='#']");if(a){closeMenu()}});
function boot(){
  $("#menuBtn").addEventListener("click",()=>{const on=!document.body.classList.contains("menu");document.body.classList.toggle("menu",on);$("#menuBtn").setAttribute("aria-expanded",on?"true":"false")});
  $("#scrim").addEventListener("click",closeMenu);
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()});
  renderRail();
  ensureBank().then(()=>{if(["start","pass","kort","quiz","prov","svaga","snabb","ord","plan","trad"].includes(curView)||CHM[curView])softRefresh()});
  route();
  Sync.init();
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")Sync.push()});
}

/* ---------- saved (bookmarks) ---------- */
function savedCount(){return Object.values(S.sv||{}).filter(x=>x&&x.on).length}
function isSaved(id){return !!(S.sv&&S.sv[id]&&S.sv[id].on)}
function starBtn(id,payload){const on=isSaved(id);return`<button type="button" class="star" data-sid="${esc(id)}" data-pl="${esc(JSON.stringify(payload||{}))}" aria-pressed="${on}" title="${on?"Ta bort från Sparat":"Spara"}" aria-label="${on?"Ta bort från Sparat":"Spara"}">${on?"★":"☆"}</button>`}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest(".star");if(!b)return;e.preventDefault();e.stopPropagation();
  const id=b.dataset.sid;let pl={};try{pl=JSON.parse(b.dataset.pl||"{}")}catch(x){}
  S.sv=S.sv||{};const on=!isSaved(id);S.sv[id]=stamp(Object.assign({},S.sv[id]||{},pl,{on:on?1:0}));save();
  $$(`.star[data-sid="${CSS.escape(id)}"]`).forEach(x=>{x.setAttribute("aria-pressed",on);x.textContent=on?"★":"☆";x.title=on?"Ta bort från Sparat":"Spara"});
  toast(on?"Sparat. Du hittar det under Sparat i menyn.":"Borttaget från Sparat.")},true);
/* ---------- shared question widgets ---------- */
const CONF=[["2","Säker"],["1","Tror det"],["0","Gissar"]];
function whyText(ok,conf){
  if(ok&&conf===2)return"<b>Rätt</b>, och du var säker.";
  if(ok&&conf===1)return"<b>Rätt.</b> Du var nästan säker. Läs förklaringen en gång till.";
  if(ok)return"<b>Rätt, men du gissade.</b> Räkna inte det här som kunnat förrän du vet varför.";
  if(conf===2)return"<b>Fel, fast du var säker.</b> Det här är en farlig lucka. Läs förklaringen noga.";
  return"<b>Inte rätt.</b>";
}
/* q:{id,q,o:[right,...wrong],why,src,t}  opts:{conf,record,noFeedback,onDone,meta,prev} */
function mcNode(q,opts){
  opts=Object.assign({conf:true,record:true},opts||{});
  const d=document.createElement("div");d.className="qq";
  const order=shuffle(q.o.map((_,i)=>i),hash(q.id||q.q));
  const meta=opts.meta!==false?`<div class="qm">${q.lv==="f"?'<span class="pill x">Fakta</span>':q.lv==="u"?'<span class="pill x">Förståelse</span>':""}${opts.chTag?`<a class="tag src" href="#${q.ch}">${esc(chLabel(q.ch))}</a>`:""}${(q.t||[]).map(t=>thrChip(t,false)).join(" ")}</div>`:"";
  d.innerHTML=`${meta}<p class="t">${tpl(q.q)} ${q.id?starBtn(q.id,{k:"q",ch:q.ch}):""}</p><div class="opts"></div><div class="cslot"></div><div class="wslot"></div>`;
  const box=$(".opts",d);let picked=null,done=false;
  order.forEach(oi=>{const b=document.createElement("button");b.type="button";b.innerHTML=tpl(q.o[oi]);b.dataset.oi=oi;box.appendChild(b);
    b.addEventListener("click",()=>{if(done)return;picked=oi;$$("button",box).forEach(x=>x.classList.toggle("pick",x===b));
      if(opts.conf)askConf();else finish(1)})});
  function askConf(){const cs=$(".cslot",d);if(cs.firstChild)return;
    const c=h(`<div class="conf"><span>Hur säker är du?</span>${CONF.map(([v,n])=>`<button type="button" data-c="${v}">${n}</button>`).join("")}</div>`);
    $$("button",c).forEach(b=>b.addEventListener("click",()=>{if(picked==null)return;c.remove();finish(+b.dataset.c)}));cs.appendChild(c)}
  function finish(conf){done=true;const ok=picked===0;
    if(opts.record&&q.id)recQA(q.id,ok,conf);
    if(!opts.noFeedback)reveal(ok,conf);else $$("button",box).forEach(x=>x.disabled=true);
    if(opts.onDone)opts.onDone(ok,conf,picked)}
  function reveal(ok,conf){$$("button",box).forEach(x=>{x.disabled=true;const oi=+x.dataset.oi;if(oi===0)x.classList.add("right");else if(oi===picked)x.classList.add("wrong")});
    const cls=ok?(conf===0?"lucky":"ok"):"no";
    $(".wslot",d).innerHTML=`<div class="why ${cls}">${whyText(ok,conf)} ${tpl(q.why||"")}${q.src?` <span class="tag src">${esc(q.src)}</span>`:""}</div>`}
  if(opts.prev&&q.id&&S.qa[q.id]){const o=S.qa[q.id];picked=o.ok?0:-1;done=true;
    $$("button",box).forEach(x=>{x.disabled=true;if(+x.dataset.oi===0)x.classList.add("right")});
    $(".wslot",d).innerHTML=`<div class="why ${o.ok?(o.c===0?"lucky":"ok"):"no"}">${o.ok?"Du svarade rätt":"Du svarade fel"}${o.ok&&o.c===0?" men gissade":""} förra gången. ${tpl(q.why||"")} <button class="btn ghost sm" type="button">Svara igen</button></div>`;
    $(".wslot .btn",d).addEventListener("click",()=>{const n=mcNode(q,Object.assign({},opts,{prev:false}));d.replaceWith(n)})}
  return d;
}
function kwHits(txt,kw){const t=norm(txt);return (kw||[]).map(g=>{const alts=Array.isArray(g)?g:[g];return{label:alts[0],hit:alts.some(a=>t.includes(norm(a)))}})}
function kwHTML(hits){return`<div class="kw">${hits.map(x=>`<span class="${x.hit?"hit":""}">${x.hit?"✓ ":""}${esc(x.label)}</span>`).join("")}</div>`}
function rateHTML(cur){return`<div class="rate"><span>Bedöm dig själv:</span><button type="button" data-r="0" aria-pressed="${cur===0}">Kunde inte</button><button type="button" data-r="1" aria-pressed="${cur===1}">Delvis</button><button type="button" data-r="2" aria-pressed="${cur===2}">Kunde</button></div>`}
let samplePromise=null;
function getSample(){if(!samplePromise){const c=window.claude;samplePromise=(c&&typeof c.use==="function")?c.use("sample").catch(()=>null):Promise.resolve(null)}return samplePromise}
async function aiFeedback(slot,item,txt){
  const sample=await getSample();if(!sample){slot.innerHTML="";return}
  slot.innerHTML=`<div class="ai"><span class="mono">Feedback från Claude</span><span class="aitxt">Läser ditt svar…</span></div>`;
  const out=$(".aitxt",slot);
  const kw=(item.kw||[]).map(g=>Array.isArray(g)?g[0]:g).join(", ");
  const prompt=`Du är en vänlig men noggrann biologilärare på gymnasiet i Sverige. En elev pluggar inför ett prov och har svarat på en fråga. Bedöm svaret mot lärobokens modellsvar. Skriv på enkel svenska, kort, utan rubriker i markdown.

FRÅGA: ${plain(item.q)}
MODELLSVAR (enligt boken): ${plain(item.model||item.a||"")}
NYCKELORD SOM BÖR FINNAS MED: ${kw}
ELEVENS SVAR: ${txt}

Svara exakt i det här formatet, med högst 90 ord totalt:
Bra: (vad som är rätt, 1–2 meningar)
Saknas eller fel: (vad som saknas eller är fel jämfört med modellsvaret; skriv "Inget viktigt" om svaret är komplett)
Tips: (en konkret sak att lägga till eller ändra, gärna ett "eftersom")
Poäng: X av 3`;
  try{const r=await sample(prompt,{modelTier:"quick",onText:({text})=>{out.textContent=text}});out.textContent=r.text}
  catch(e){if(e&&e.code==="not_granted"){slot.innerHTML=`<div class="ai"><span class="mono">Feedback från Claude</span>Du har inte gett sidan lov att fråga Claude. Nyckelordskontrollen ovan fungerar ändå.</div>`}
    else if(e&&e.code==="rate_limited"){out.textContent="Claude har fått för många frågor just nu. Vänta en stund och försök igen."}
    else{out.textContent=(e&&e.text)||"Det gick inte att få feedback just nu. Jämför med modellsvaret ovan i stället."}}
}
/* open question: item {id,q,model|a,kw,src} mode 'kan'|'kompis'|'open' */
function openNode(item,opts){
  opts=opts||{};const model=item.model||item.a||"";const prev=S.open[item.id]||{};
  const d=document.createElement("div");d.className="kq";
  const ph=opts.mode==="kompis"?"Förklara med egna ord, som för en kompis som inte har läst kapitlet. Använd gärna \"eftersom\".":"Skriv ditt svar här, eller säg det högt först.";
  d.innerHTML=`<p class="q">${tpl(item.q)} ${item.id?starBtn(item.id,{k:"o",ch:item.ch}):""} ${prev.r!=null?`<span class="pill ${["n","d","k"][prev.r]}">${["Kunde inte","Delvis","Kunde"][prev.r]}</span>`:""}${opts.chTag?` <a class="tag src" href="#${item.ch}">${esc(chLabel(item.ch))}</a>`:""}</p>
  <textarea aria-label="Ditt svar" placeholder="${esc(ph)}">${esc(prev.txt||"")}</textarea>
  <div class="row"><button class="btn sm" type="button" data-a="show">${opts.mode==="kompis"?"Kolla mina nyckelord":"Visa facit"}</button><button class="btn ghost sm aibtn" type="button" data-a="ai" hidden>Få feedback</button></div>
  <div class="res"></div><div class="aislot"></div>`;
  const ta=$("textarea",d),res=$(".res",d),aib=$(".aibtn",d);
  getSample().then(s=>{if(s)aib.hidden=false});
  $("[data-a=show]",d).addEventListener("click",()=>{
    const txt=ta.value.trim();const hits=kwHits(txt,item.kw);
    res.innerHTML=`${txt&&item.kw&&item.kw.length?`<p class="small muted" style="margin:.4rem 0 0">Nyckelord du fick med: ${hits.filter(x=>x.hit).length} av ${hits.length}</p>${kwHTML(hits)}`:(item.kw&&item.kw.length?`<p class="small muted" style="margin:.4rem 0 0">Nyckelord ett bra svar innehåller:</p>${kwHTML(hits.map(x=>({label:x.label,hit:false})))}`:"")}
      <div class="model"><span class="mono">${opts.mode==="kompis"?"Så kan man förklara (enligt boken)":"Facit (enligt boken)"}</span>${tpl(model)}${item.src?` <span class="tag src">${esc(item.src)}</span>`:""}</div>${rateHTML(prev.r)}`;
    $$(".rate button",res).forEach(b=>b.addEventListener("click",()=>{const r=+b.dataset.r;openRate(item.id,r,ta.value.trim());$$(".rate button",res).forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));if(opts.onRate)opts.onRate(r)}));
    if(opts.onShow)opts.onShow();
  });
  aib.addEventListener("click",()=>{const txt=ta.value.trim();if(txt.length<15){toast("Skriv ett svar först, minst en mening.");return}aiFeedback($(".aislot",d),Object.assign({},item,{model}),txt)});
  ta.addEventListener("change",()=>{const o=S.open[item.id]||{};o.txt=ta.value.trim();S.open[item.id]=stamp(o);save()});
  return d;
}

/* ---------- label figures ---------- */
const SVGNS="http://www.w3.org/2000/svg";
function sv(tag,attrs,parent){const e=document.createElementNS(SVGNS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
function labelText(g,txt,x,y,anchor,cls){
  const t=sv("text",{x,y,"text-anchor":anchor==="e"?"end":anchor==="m"?"middle":"start",class:cls||"lb halo"},g);
  const lines=String(txt).split("|");lines.forEach((ln,i)=>{const ts=sv("tspan",{x,dy:i?16:0},t);ts.textContent=ln});return t;
}
function bboxOf(t,txt){try{const b=t.getBBox();if(b&&b.width)return b}catch(e){}const lines=String(txt).split("|");const w=Math.max(...lines.map(l=>l.length))*7.6;const x=+t.getAttribute("x"),y=+t.getAttribute("y");const a=t.getAttribute("text-anchor");return{x:a==="end"?x-w:a==="middle"?x-w/2:x,y:y-13,width:w,height:16*lines.length}}
function renderFig(host,fig,figId,chId){
  const wrap=document.createElement("figure");wrap.className="lfig";wrap.id="fig-"+figId;
  const hasL=fig.labels&&fig.labels.length;
  wrap.innerHTML=`${hasL?`<div class="figbar"><div class="seg" role="group" aria-label="Läge"><button type="button" data-m="show" aria-pressed="true">Visa</button><button type="button" data-m="test" aria-pressed="false">Testa dig</button><button type="button" data-m="place" aria-pressed="false">Placera ord</button></div><span class="hint"></span></div>`:""}`;
  const svg=sv("svg",{viewBox:fig.vb||"0 0 600 360",role:"img","aria-label":plain(fig.cap||fig.alt||"Figur")});
  svg.innerHTML=fig.svg||"";wrap.appendChild(svg);
  const cap=document.createElement("figcaption");cap.innerHTML=tpl(fig.cap||"")+(fig.src?` <span class="tag src">${esc(fig.src)}</span>`:"");wrap.appendChild(cap);
  const chips=document.createElement("div");chips.className="lchips";chips.hidden=true;wrap.appendChild(chips);
  const info=document.createElement("div");info.className="infop";info.setAttribute("aria-live","polite");wrap.appendChild(info);
  host.replaceWith(wrap);
  const L=(fig.labels||[]).map((l,i)=>({i,txt:l[0],x:l[1],y:l[2],px:l[3],py:l[4],a:l[5]||"s"}));
  const gLead=sv("g",{},svg),gTxt=sv("g",{},svg),gCov=sv("g",{},svg),gSlot=sv("g",{},svg);
  L.forEach(l=>{
    l.t=labelText(gTxt,l.txt,l.x,l.y,l.a);
  });
  // leaders after text so bbox exists
  L.forEach(l=>{l.bb=bboxOf(l.t,l.txt);
    if(l.px!=null&&l.py!=null){const bb=l.bb;let sx,sy;
      const cx=bb.x+bb.width/2,cy=bb.y+bb.height/2;
      if(l.px<bb.x)sx=bb.x-3;else if(l.px>bb.x+bb.width)sx=bb.x+bb.width+3;else sx=clamp(l.px,bb.x,bb.x+bb.width);
      if(l.py<bb.y)sy=bb.y-1;else if(l.py>bb.y+bb.height)sy=bb.y+bb.height+1;else sy=cy;
      if(sx!==bb.x-3&&sx!==bb.x+bb.width+3&&sy===cy)sy=l.py<cy?bb.y-1:bb.y+bb.height+1;
      sv("line",{x1:sx,y1:sy,x2:l.px,y2:l.py,class:"lead"},gLead);sv("circle",{cx:l.px,cy:l.py,r:2.6,class:"pdot"},gLead)}
    const cv=sv("g",{class:"cov",tabindex:"0",role:"button","aria-label":"Visa etikett "+(l.i+1)},gCov);
    sv("rect",{x:l.bb.x-4,y:l.bb.y-2,width:l.bb.width+8,height:l.bb.height+4,rx:5},cv);
    const ct=sv("text",{x:l.bb.x+l.bb.width/2,y:l.bb.y+l.bb.height/2+4,"text-anchor":"middle"},cv);ct.textContent=String(l.i+1);
    cv.addEventListener("click",()=>{cv.style.display="none";l.t.style.visibility="visible";upd()});
    cv.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();cv.dispatchEvent(new Event("click"))}});
    l.cv=cv;
    const sl=sv("g",{class:"slot"},gSlot);sv("rect",{x:l.bb.x-4,y:l.bb.y-2,width:Math.max(l.bb.width+8,40),height:l.bb.height+4,rx:5},sl);
    const sn=sv("text",{x:l.bb.x+2,y:l.bb.y+l.bb.height/2+4,class:"num"},sl);sn.textContent=String(l.i+1);
    l.sl=sl;sl.dataset.i=l.i;
  });
  gCov.style.display="none";gSlot.style.display="none";
  let mode="show",errors=0,placed=0,sel=null;
  const hint=$(".hint",wrap);
  function upd(){if(mode==="test"){const n=L.filter(l=>l.cv.style.display==="none").length;hint.textContent=`${n} av ${L.length} visade. Säg namnet innan du trycker.`}
    if(mode==="place"){hint.textContent=placed===L.length?`Klart! ${errors===0?"Inga fel.":plural(errors,"fel","fel")+" på vägen."}`:`${placed} av ${L.length} på plats. Tryck på ett ord och sedan på en ruta, eller dra ordet.`}}
  function setMode(m){mode=m;$$(".figbar .seg button",wrap).forEach(b=>b.setAttribute("aria-pressed",b.dataset.m===m?"true":"false"));
    L.forEach(l=>{l.t.style.visibility=m==="show"?"visible":"hidden";l.cv.style.display="";l.sl.classList.remove("ok","hot");$$("text:not(.num)",l.sl).forEach(x=>x.remove())});
    gCov.style.display=m==="test"?"":"none";gSlot.style.display=m==="place"?"":"none";chips.hidden=m!=="place";
    if(m==="show")hint.textContent=fig.parts?"Tryck på delarna i bilden.":"";
    if(m==="place"){errors=0;placed=0;sel=null;buildChips()}
    if(wrap._all)wrap._all.hidden=m!=="test";
    upd()}
  function buildChips(){chips.innerHTML="";shuffle(L.map(l=>l.txt)).forEach(txt=>{const b=document.createElement("button");b.type="button";b.textContent=txt.replace(/\|/g," ");b.dataset.txt=txt;chips.appendChild(b);
    b.addEventListener("click",()=>{if(b._dragged){b._dragged=false;return}sel=sel===b?null:b;$$("button",chips).forEach(x=>x.classList.toggle("on",x===sel));$$(".slot",gSlot).forEach(s=>s.classList.toggle("hot",!!sel&&!s.classList.contains("ok")))});
    dragChip(b)})}
  function tryPlace(b,i){const l=L[i];if(!l||l.sl.classList.contains("ok"))return;
    if(b.dataset.txt===l.txt){l.sl.classList.add("ok");l.sl.classList.remove("hot");const bb=l.bb;labelText(l.sl,l.txt,l.x,l.y,l.a,"lb");b.classList.add("used");placed++;sel=null;$$("button",chips).forEach(x=>x.classList.remove("on"));$$(".slot",gSlot).forEach(s=>s.classList.remove("hot"));
      if(placed===L.length){S.x[chId+"."+figId]=stamp({s:Math.max(0,L.length-errors),m:L.length});save()}}
    else{errors++;b.classList.remove("shake");void b.offsetWidth;b.classList.add("shake")}
    upd()}
  $$(".slot",gSlot).forEach(s=>s.addEventListener("click",()=>{if(sel)tryPlace(sel,+s.dataset.i)}));
  function dragChip(b){let gh=null,sx=0,sy=0,moved=false;
    b.addEventListener("pointerdown",e=>{if(e.button)return;sx=e.clientX;sy=e.clientY;moved=false;b.setPointerCapture(e.pointerId)});
    b.addEventListener("pointermove",e=>{if(!b.hasPointerCapture(e.pointerId))return;if(!moved&&Math.hypot(e.clientX-sx,e.clientY-sy)<8)return;moved=true;
      if(!gh){gh=h(`<div class="ghostdrag">${esc(b.textContent)}</div>`);document.body.appendChild(gh)}gh.style.left=e.clientX+"px";gh.style.top=e.clientY+"px";
      const el=document.elementFromPoint(e.clientX,e.clientY);const s=el&&el.closest&&el.closest(".slot");$$(".slot",gSlot).forEach(x=>x.classList.toggle("hot",x===s&&!x.classList.contains("ok")))});
    const end=e=>{if(gh){gh.remove();gh=null}if(moved){b._dragged=true;const el=document.elementFromPoint(e.clientX,e.clientY);const s=el&&el.closest&&el.closest(".slot");$$(".slot",gSlot).forEach(x=>x.classList.remove("hot"));if(s)tryPlace(b,+s.dataset.i);setTimeout(()=>b._dragged=false,50)}};
    b.addEventListener("pointerup",end);b.addEventListener("pointercancel",()=>{if(gh){gh.remove();gh=null}})}
  $$(".figbar .seg button",wrap).forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.m)));
  if(hasL){const bar=$(".figbar",wrap);const all=h(`<button class="btn ghost sm" type="button">Visa alla</button>`);bar.insertBefore(all,hint);all.hidden=true;
    all.addEventListener("click",()=>{if(mode==="test"){L.forEach(l=>{l.cv.style.display="none";l.t.style.visibility="visible"});upd()}});
    wrap._all=all}
  // clickable parts
  if(fig.parts){$$("[data-k]",svg).forEach(p=>{p.classList.add("part");p.setAttribute("tabindex","0");p.setAttribute("role","button");const k=p.dataset.k;const pt=fig.parts[k];if(pt)p.setAttribute("aria-label",plain(pt.t));
    const act=()=>{$$(".part",svg).forEach(x=>x.classList.toggle("sel",x===p));if(pt)info.innerHTML=`<h4>${tpl(pt.t)}</h4>${tpl(pt.d||"")}${pt.go?` <a href="#${pt.go}">Läs mer</a>`:""}`};
    p.addEventListener("click",act);p.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();act()}})});
    if(!hasL){hint&&(hint.textContent="")}
    info.innerHTML=`<span class="muted small">Tryck på en del av bilden för att läsa om den.</span>`}
  if(fig.mode)setMode(fig.mode);else setMode("show");
  return wrap;
}

/* ---------- exercises ---------- */
function xHead(ex,ty){const names={order:"Lägg i ordning",sort:"Sortera",tf:"Sant eller falskt?",fix:"Hitta felet",chain:"Saknad länk",who:"Vem är jag?",match:"Para ihop",cloze:"Lucktext",mc:"Frågor"};
  return`<div class="xh"><span class="xt">${names[ty]||"Övning"}</span><b>${tpl(ex.h||"")}</b><span class="sc"></span></div>${ex.intro?`<p class="intro">${tpl(ex.intro)}</p>`:""}`}
function xSave(key,s,m){S.x[key]=stamp({s,m});save()}
function xPrev(key){const o=S.x[key];return o?`Senast: ${o.s} av ${o.m}`:""}
const XR={};
XR.order=(el,ex,key)=>{
  el.innerHTML=xHead(ex,"order")+`<ol class="olist"></ol><div class="row"><button class="btn sm" type="button" data-a="chk">Rätta</button><button class="btn ghost sm" type="button" data-a="new">Blanda om</button></div><div class="fbk"></div>`;
  const ol=$("ol",el);$(".sc",el).textContent=xPrev(key);let cur=[];let selI=null;
  function draw(checked){ol.innerHTML="";cur.forEach((it,pos)=>{const li=document.createElement("li");if(checked)li.classList.add(it===pos?"ok":"no");if(selI===pos)li.classList.add("sel");
    li.innerHTML=`<span class="k">${pos+1}</span><span>${tpl(ex.items[it])}</span><span class="mv"><button type="button" aria-label="Flytta upp" ${pos===0?"disabled":""}>↑</button><button type="button" aria-label="Flytta ner" ${pos===cur.length-1?"disabled":""}>↓</button></span>${checked&&it!==pos?`<span class="fix">Rätt plats: ${it+1}</span>`:""}`;
    const [up,dn]=$$(".mv button",li);up.addEventListener("click",e=>{e.stopPropagation();mv(pos,pos-1)});dn.addEventListener("click",e=>{e.stopPropagation();mv(pos,pos+1)});
    li.addEventListener("click",()=>{if(selI==null){selI=pos;draw()}else if(selI===pos){selI=null;draw()}else{const a=selI;selI=null;[cur[a],cur[pos]]=[cur[pos],cur[a]];draw()}});
    ol.appendChild(li)})}
  function mv(a,b){if(b<0||b>=cur.length)return;[cur[a],cur[b]]=[cur[b],cur[a]];selI=null;draw()}
  function reset(){cur=shuffle(ex.items.map((_,i)=>i));if(cur.every((v,i)=>v===i)&&cur.length>1)cur.reverse();selI=null;draw();$(".fbk",el).innerHTML=""}
  $("[data-a=chk]",el).addEventListener("click",()=>{const n=cur.filter((v,i)=>v===i).length;draw(true);xSave(key,n,cur.length);$(".sc",el).textContent=xPrev(key);
    $(".fbk",el).innerHTML=`<div class="why ${n===cur.length?"ok":"no"}">${n===cur.length?"<b>Helt rätt ordning!</b>":`<b>${n} av ${cur.length}</b> på rätt plats. Tryck på två steg för att byta plats, eller använd pilarna, och rätta igen.`} ${tpl(ex.why||"")}${ex.src?` <span class="tag src">${esc(ex.src)}</span>`:""}</div>`});
  $("[data-a=new]",el).addEventListener("click",reset);
  el.insertBefore(h(`<p class="intro">Tryck på två steg för att byta plats på dem, eller använd pilarna.</p>`),ol);
  reset();
};
XR.sort=(el,ex,key)=>{
  el.innerHTML=xHead(ex,"sort")+`<div class="rows"></div>`;$(".sc",el).textContent=xPrev(key);
  const rows=$(".rows",el);let n=0,ok=0;const items=shuffle(ex.items.map((x,i)=>i),hash(key));
  items.forEach(i=>{const [txt,cat,why]=ex.items[i];const r=h(`<div class="srow"><div class="it">${tpl(txt)}</div><div class="ch2">${ex.cats.map((c,ci)=>`<button type="button" data-c="${ci}">${tpl(c)}</button>`).join("")}</div><div class="fb"></div></div>`);
    $$("button",r).forEach(b=>b.addEventListener("click",()=>{if(r.dataset.done)return;r.dataset.done=1;const good=+b.dataset.c===cat;n++;if(good)ok++;
      $$("button",r).forEach(x=>{x.disabled=true;if(+x.dataset.c===cat)x.classList.add("right");else if(x===b)x.classList.add("wrong")});
      $(".fb",r).innerHTML=(good?"Rätt. ":"Fel. ")+tpl(why||"");
      if(n===items.length){xSave(key,ok,n);$(".sc",el).textContent=`Klart: ${ok} av ${n}`}}));rows.appendChild(r)});
};
XR.tf=(el,ex,key)=>{
  el.innerHTML=xHead(ex,"tf")+`<p class="intro">Bestäm dig och säg <b>varför</b> innan du ser svaret.</p><div class="rows"></div>`;$(".sc",el).textContent=xPrev(key);
  const rows=$(".rows",el);let n=0,ok=0;
  ex.items.forEach(([st,val,why],i)=>{const r=h(`<div class="srow"><div class="it">${tpl(st)}</div><div class="ch2"><button type="button" data-v="1">Sant</button><button type="button" data-v="0">Falskt</button></div><div class="fb"></div></div>`);
    $$("button",r).forEach(b=>b.addEventListener("click",()=>{if(r.dataset.done)return;r.dataset.done=1;const good=(b.dataset.v==="1")===!!val;n++;if(good)ok++;
      $$("button",r).forEach(x=>{x.disabled=true;if((x.dataset.v==="1")===!!val)x.classList.add("right");else x.classList.add("wrong")});
      $(".fb",r).innerHTML=`<b>${val?"Sant":"Falskt"}.</b> ${tpl(why||"")}`;
      if(n===ex.items.length){xSave(key,ok,n);$(".sc",el).textContent=`Klart: ${ok} av ${n}`}}));rows.appendChild(r)});
};
XR.fix=(el,ex,key)=>{
  const errs=ex.parts.filter(p=>Array.isArray(p)).length;
  el.innerHTML=xHead(ex,"fix")+`<p class="intro">Texten innehåller <b>${plural(errs,"fel","fel")}</b>. Tryck på de delar du tror är fel, och rätta sedan.</p><div class="fixtext"></div><div class="row"><button class="btn sm" type="button" data-a="chk">Rätta</button></div><div class="fbk"></div>`;
  $(".sc",el).textContent=xPrev(key);const box=$(".fixtext",el);
  ex.parts.forEach(p=>{if(Array.isArray(p)){const s=h(`<span class="ph" data-e="1">${tpl(p[0])}</span>`);s._e=p;box.appendChild(s);box.appendChild(document.createTextNode(" "))}
    else{String(p).split(/(?<=[.,;:!?])\s+/).forEach(seg=>{if(!seg.trim())return;const s=h(`<span class="ph">${tpl(seg)}</span>`);box.appendChild(s);box.appendChild(document.createTextNode(" "))})}});
  $$(".ph",box).forEach(s=>s.addEventListener("click",()=>{if(el.dataset.done)return;s.classList.toggle("sel");s.style.background=s.classList.contains("sel")?"var(--acc-soft)":""}));
  $("[data-a=chk]",el).addEventListener("click",()=>{if(el.dataset.done)return;el.dataset.done=1;let hit=0,fp=0;
    $$(".ph",box).forEach(s=>{s.style.background="";const sel=s.classList.contains("sel");if(s.dataset.e){if(sel){hit++;s.classList.add("hit")}else s.classList.add("err-show")}else if(sel){fp++;s.classList.add("miss")}});
    const fb=ex.parts.filter(Array.isArray).map(p=>`<li><b>${tpl(p[0])}</b> → ${tpl(p[1])}${p[2]?`. ${tpl(p[2])}`:""}</li>`).join("");
    $(".fbk",el).innerHTML=`<div class="why ${hit===errs&&!fp?"ok":"no"}">Du hittade <b>${hit} av ${errs}</b> fel${fp?` och markerade ${fp} del${fp>1?"ar":""} som var rätt`:""}.<ul>${fb}</ul>${ex.src?`<span class="tag src">${esc(ex.src)}</span>`:""}</div>`;
    xSave(key,Math.max(0,hit-fp),errs);$(".sc",el).textContent=xPrev(key)});
};
XR.chain=(el,ex,key)=>{
  el.innerHTML=xHead(ex,"chain")+`<div class="chs"></div>`;$(".sc",el).textContent=xPrev(key);
  const box=$(".chs",el);let n=0,ok=0;const items=ex.items||[{steps:ex.steps,b:ex.b,w:ex.w}];
  items.forEach((it,ii)=>{const c=document.createElement("div");c.style.marginBottom="14px";
    c.innerHTML=(it.h?`<p style="margin:.2rem 0;font-weight:700">${tpl(it.h)}</p>`:"")+`<ol class="chainx">${it.steps.map((s,i)=>i===it.b?`<li class="blank">?</li>`:`<li>${tpl(s)}</li>`).join("")}</ol><div class="opts"></div><div class="fb"></div>`;
    const opts=$(".opts",c);shuffle([it.steps[it.b],...it.w],hash(key+ii)).forEach(o=>{const b=document.createElement("button");b.type="button";b.innerHTML=tpl(o);b.dataset.r=o===it.steps[it.b]?"1":"0";opts.appendChild(b);
      b.addEventListener("click",()=>{if(c.dataset.done)return;c.dataset.done=1;n++;const good=b.dataset.r==="1";if(good)ok++;
        $$("button",opts).forEach(x=>{x.disabled=true;if(x.dataset.r==="1")x.classList.add("right");else if(x===b)x.classList.add("wrong")});
        const bl=$(".blank",c);bl.innerHTML=tpl(it.steps[it.b]);bl.style.borderStyle="solid";
        $(".fb",c).innerHTML=`<div class="why ${good?"ok":"no"}">${good?"Rätt länk.":"Inte rätt."} ${tpl(it.why||"")}</div>`;
        if(n===items.length){xSave(key,ok,n);$(".sc",el).textContent=`Klart: ${ok} av ${n}`}})});
    box.appendChild(c)});
};
XR.who=(el,ex,key)=>{
  el.innerHTML=xHead(ex,"who")+`<p class="intro">Ledtrådarna kommer en i taget. Gissa så tidigt du kan.</p><div class="ws"></div>`;$(".sc",el).textContent=xPrev(key);
  const box=$(".ws",el);let n=0,pts=0;
  ex.items.forEach((it,ii)=>{const c=h(`<div class="who" style="border-top:1px solid var(--line);padding-top:10px;margin-top:10px"><div class="cl"></div><div class="row"><button class="btn ghost sm" type="button" data-a="more">Nästa ledtråd</button></div><div class="opts"></div><div class="fb"></div></div>`);
    let shown=0;const cl=$(".cl",c);const more=$("[data-a=more]",c);
    function next(){if(shown>=it.clues.length)return;cl.appendChild(h(`<div class="clue"><span class="mono">Ledtråd ${shown+1}</span><br>${tpl(it.clues[shown])}</div>`));shown++;if(shown>=it.clues.length)more.disabled=true}
    more.addEventListener("click",next);next();
    const opts=$(".opts",c);shuffle([it.a,...it.w],hash(key+ii)).forEach(o=>{const b=document.createElement("button");b.type="button";b.innerHTML=tpl(o);b.dataset.r=o===it.a?"1":"0";opts.appendChild(b);
      b.addEventListener("click",()=>{if(c.dataset.done)return;c.dataset.done=1;n++;const good=b.dataset.r==="1";const at=shown;const p=good?Math.max(1,it.clues.length-at+1):0;pts+=p;
        $$("button",opts).forEach(x=>{x.disabled=true;if(x.dataset.r==="1")x.classList.add("right");else if(x===b)x.classList.add("wrong")});
        while(shown<it.clues.length)next();
        $(".fb",c).innerHTML=`<div class="why ${good?"ok":"no"}">${good?`Rätt efter ${plural(at,"ledtråd","ledtrådar")}.`:`Svaret är <b>${tpl(it.a)}</b>.`} ${tpl(it.why||"")}</div>`;
        if(n===ex.items.length){const max=ex.items.reduce((s,x)=>s+x.clues.length,0);xSave(key,pts,max);$(".sc",el).textContent=`Klart: ${pts} av ${max} poäng`}})});
    box.appendChild(c)});
};
XR.match=(el,ex,key)=>{
  el.innerHTML=xHead(ex,"match")+`<p class="intro">Tryck på något i vänster kolumn och sedan på det som hör ihop i höger.</p><div class="matchg"><div class="l opts"></div><div class="r opts"></div></div><div class="fbk"></div>`;
  $(".sc",el).textContent=xPrev(key);const L=$(".l",el),R=$(".r",el);let sel=null,err=0,done=0;
  shuffle(ex.pairs.map((p,i)=>i),hash(key)).forEach(i=>{const b=document.createElement("button");b.type="button";b.innerHTML=tpl(ex.pairs[i][0]);b.dataset.i=i;L.appendChild(b);b.addEventListener("click",()=>{if(b.classList.contains("done"))return;sel=b;$$("button",L).forEach(x=>x.classList.toggle("sel",x===b))})});
  shuffle(ex.pairs.map((p,i)=>i),hash(key)+7).forEach(i=>{const b=document.createElement("button");b.type="button";b.innerHTML=tpl(ex.pairs[i][1]);b.dataset.i=i;R.appendChild(b);
    b.addEventListener("click",()=>{if(!sel||b.classList.contains("done"))return;if(ex.pairs[+sel.dataset.i][1]===ex.pairs[+b.dataset.i][1]){sel.classList.add("done");sel.classList.remove("sel");b.classList.add("done");sel=null;done++;
      if(done===ex.pairs.length){xSave(key,Math.max(0,done-err),done);$(".fbk",el).innerHTML=`<div class="why ok"><b>Alla par klara!</b> ${err?plural(err,"felförsök","felförsök")+".":"Inga felförsök."} ${tpl(ex.why||"")}</div>`;$(".sc",el).textContent=xPrev(key)}}
      else{err++;b.classList.remove("no");void b.offsetWidth;b.classList.add("no")}})});
};
function clozeCheckWord(val,ans){const v=norm(val).replace(/[.,!?]$/,"");return ans.some(a=>norm(a)===v)}
XR.cloze=(el,ex,key)=>{
  const parts=String(ex.text).split(/(\[\[[^\]]+\]\])/);const blanks=[];
  let html="";parts.forEach(p=>{const m=/^\[\[([^\]]+)\]\]$/.exec(p);if(m){const ans=m[1].split("|");const i=blanks.length;blanks.push(ans);html+=`<input type="text" data-i="${i}" aria-label="Lucka ${i+1}" autocomplete="off" autocapitalize="off" spellcheck="false" style="width:${Math.max(6,Math.min(16,ans[0].length+2))}em">`}else html+=tpl(p)});
  const bank=ex.bank?shuffle(blanks.map(a=>a[0]),hash(key)):null;
  el.innerHTML=xHead(ex,"cloze")+(bank?`<div class="kw" aria-label="Ordbank">${bank.map(w=>`<span>${esc(w)}</span>`).join("")}</div>`:"")+`<div class="cloze">${html}</div><div class="row"><button class="btn sm" type="button" data-a="chk">Rätta</button><button class="btn ghost sm" type="button" data-a="show">Visa facit</button><button class="btn ghost sm" type="button" data-a="clr">Töm</button></div><div class="fbk"></div>`;
  $(".sc",el).textContent=xPrev(key);
  const saved=(S.x[key]&&S.x[key].v)||{};$$("input",el).forEach(inp=>{if(saved[inp.dataset.i])inp.value=saved[inp.dataset.i];inp.addEventListener("change",()=>{const o=S.x[key]||{s:0,m:blanks.length};o.v=o.v||{};o.v[inp.dataset.i]=inp.value;S.x[key]=stamp(o);save()})});
  $("[data-a=chk]",el).addEventListener("click",()=>{let ok=0;$$("input",el).forEach(inp=>{const good=clozeCheckWord(inp.value,blanks[+inp.dataset.i]);inp.classList.toggle("ok",good);inp.classList.toggle("no",!good&&inp.value.trim()!=="");if(good)ok++});
    const o=S.x[key]||{};o.s=ok;o.m=blanks.length;S.x[key]=stamp(o);save();$(".sc",el).textContent=xPrev(key);
    $(".fbk",el).innerHTML=`<div class="why ${ok===blanks.length?"ok":"no"}"><b>${ok} av ${blanks.length}</b> rätt. ${ok<blanks.length?"Röda luckor är fel, tomma är obesvarade.":""} ${tpl(ex.why||"")}</div>`});
  $("[data-a=show]",el).addEventListener("click",()=>{$$("input",el).forEach(inp=>{const a=blanks[+inp.dataset.i];if(!clozeCheckWord(inp.value,a)){const s=inp.nextElementSibling;if(!(s&&s.classList&&s.classList.contains("ans")))inp.insertAdjacentHTML("afterend",`<span class="ans">${esc(a[0])}</span>`)}})});
  $("[data-a=clr]",el).addEventListener("click",()=>{$$("input",el).forEach(inp=>{inp.value="";inp.classList.remove("ok","no")});$$(".ans",el).forEach(x=>x.remove());const o=S.x[key]||{};o.v={};S.x[key]=stamp(o);save()});
};
XR.mc=(el,ex,key)=>{el.innerHTML=xHead(ex,"mc");ex.items.forEach((q,i)=>{el.appendChild(mcNode(Object.assign({id:key+"."+i},q),{meta:false}))})};
function renderEx(host,ex,key){const el=document.createElement("div");el.className="xbox";el.id="x-"+key.replace(/\./g,"-");host.replaceWith(el);try{(XR[ex.ty]||XR.mc)(el,ex,key)}catch(e){console.error(e);el.innerHTML=`<p class="muted">Övningen kunde inte visas.</p>`}}

/* ---------- hydrate content ---------- */
function hydrate(root,d,chId){
  $$("table.cmp",root).forEach(t=>{if(!t.parentElement.classList.contains("tscroll")){const w=document.createElement("div");w.className="tscroll";t.replaceWith(w);w.appendChild(t)}});
  $$(".box",root).forEach(b=>{if(b.querySelector(":scope>.bh"))return;const lbl={key:"Kunna utantill",trick:"Minnesknep",fab:"Fabriken",trap:"Provfälla",extra:"Extra (inte i boken)",lek:"Från lektionen",diff:"Boken och läraren skiljer sig",link:"Koppling"};
    let k=Object.keys(lbl).find(c=>b.classList.contains(c));let title=b.dataset.h||(k?lbl[k]:"");
    if(b.classList.contains("tr")){const t=THREADS[b.dataset.t];if(t){b.style.setProperty("--tc",t.c);b.insertAdjacentHTML("afterbegin",`<div class="bh"><a class="thr" style="color:${t.c}" href="#trad.${b.dataset.t}">${ICON[b.dataset.t]}${esc(t.n)}</a>${b.dataset.h?`<span>${esc(b.dataset.h)}</span>`:""}</div>`)}return}
    const sid=chId+":"+hash(b.textContent.trim().slice(0,400));if(title)b.insertAdjacentHTML("afterbegin",`<div class="bh">${esc(title)}${chId&&CHM[chId]&&!b.classList.contains("link")?" "+starBtn(sid,{k:"b",ch:chId,h:title,html:b.innerHTML}):""}${b.dataset.src?` <span class="tag src">${esc(b.dataset.src)}</span>`:""}</div>`)});
  $$(".lfig-h[data-fig]",root).forEach(f=>{const fig=d.figs&&d.figs[f.dataset.fig];if(fig)renderFig(f,fig,f.dataset.fig,chId);else f.remove()});
  $$(".x[data-x]",root).forEach(x=>{const ex=d.ex&&d.ex[x.dataset.x];if(ex)renderEx(x,ex,chId+"."+x.dataset.x);else x.remove()});
  $$(".w[data-w]",root).forEach(w=>{const fn=d.w&&d.w[w.dataset.w];if(fn){try{fn(w,API)}catch(e){console.error(e);w.innerHTML=`<p class="muted">Simuleringen kunde inte visas.</p>`}}else w.remove()});
}
const API={sv,h,esc,tpl,$,$$,shuffle,clamp,labelText,toast,save,S:()=>S,stamp};

/* ---------- chapter view ---------- */
VIEWS._chapter=async function(v,arg,id){
  v.innerHTML=`<div class="loading">Laddar kapitlet…</div>`;
  await Promise.all([ensureCh(id),ensureBank()]);
  const d=G.data[id],c=CHM[id],b=(G.bank&&G.bank.byCh[id])||{pre:[],kan:[],kompis:[],cards:[],mc:[],open:[]};
  if(!d){v.innerHTML=`<div class="empty">Kapitlet kunde inte laddas.</div>`;return}
  const P=PARTS[c.p];const st=S.ch[id]||{};
  const secs=d.secs||[];
  let s=`<header class="chead"><div class="eyebrow"><span class="knum" style="background:${P.c}">K${c.n}</span><span class="mono">${esc(P.n)}</span>${(d.threads||[]).map(t=>thrChip(t)).join(" ")}</div>
   <h1>${esc(c.t)}</h1><div class="fab">Fabriken: ${esc(c.fab)}</div>
   <dl class="srcs">${d.src&&d.src.bok?`<dt>Boken</dt><dd>${tpl(d.src.bok)}</dd>`:""}${d.src&&d.src.ppt?`<dt>Lektionen</dt><dd>${tpl(d.src.ppt)}</dd>`:""}${d.src&&d.src.ab?`<dt>Arbetsblad</dt><dd>${tpl(d.src.ab)}</dd>`:""}</dl>
   <nav class="steps" aria-label="I kapitlet">${b.pre.length?`<a href="#${id}.fortest">1 Förtest</a>`:""}<a href="#${id}.mal">Mål</a>${secs.map(x=>`<a href="#${id}.${x.id}">${esc(x.nav||x.h)}</a>`).join("")}<a href="#${id}.kandu">Kan du?</a><a href="#${id}.kompis">Förklara</a><a href="#${id}.ova">Öva</a></nav></header>`;
  if(b.pre.length)s+=`<div class="prebox" id="${id}-fortest"><div class="ph"><b>Förtest: gissa innan du läser</b><span class="small muted">Det gör inget om du svarar fel. Att försöka först gör att du minns svaret bättre när du läser.</span></div><div class="preqs"></div><div class="row"><button class="btn ghost sm" type="button" id="preSkip">${st.pre?"Förtestet är gjort":"Hoppa över förtestet"}</button></div></div>`;
  s+=`<div class="lock" id="lock">`;
  s+=`<div class="goals" id="${id}-mal"><span class="mono">Mål: efter kapitlet kan du</span><ul>${(d.goals||[]).map(g=>`<li>${tpl(g)}</li>`).join("")}</ul></div>`;
  if(d.intro)s+=`<div class="intro">${tpl(d.intro)}</div>`;
  secs.forEach(x=>{s+=`<section class="sec" id="${id}-${x.id}"><div class="sh"><h2>${esc(x.h)}</h2><span class="s">${x.prov?"{{prov}}":""}${x.lek?`{{lek}}`:""}${x.src?`<span class="tag src">${esc(x.src)}</span>`:""}</span></div>${x.html}</section>`});
  s+=`<div class="endblk"><div class="kan" id="${id}-kandu"><div class="kh"><b>Kan du…?</b><span class="mono"></span></div><p class="small muted" style="margin:.2rem 0 0">Svara först, i huvudet eller skriftligt. Visa sedan facit och bedöm dig själv ärligt.</p><div class="kqs"></div></div>
   <div class="expl" id="${id}-kompis"><div class="eh"><b>Förklara för en kompis</b></div><p class="small muted" style="margin:.2rem 0 0">Förklara mekanismen med egna ord. Sedan ser du vilka nyckelord du fick med${" "}och kan jämföra med ett modellsvar.</p><div class="kps"></div></div>
   <div class="card" id="${id}-ova"><h3 style="margin-top:0">Öva kapitlet</h3><p>${b.cards.length} flashcards, ${b.mc.length} quizfrågor och ${b.open.length} öppna provfrågor hör till kapitlet.</p>
    <div class="row"><a class="btn acc" href="#pass.${id}">Starta ett pass för K${c.n}</a><a class="btn ghost" href="#kort.${id}">Flashcards</a><a class="btn ghost" href="#quiz.${id}">Quiz</a><button class="btn ghost" type="button" id="readBtn">${st.read?"Läst "+fmtDay(st.read)+" ✓":"Jag har läst kapitlet"}</button></div>
    <p class="small muted">När du markerar kapitlet som läst lägger studieplanen in repetition efter 1, 3 och 7 dagar.</p></div></div>`;
  s+=`</div>`;
  const ci=CH.findIndex(x=>x.id===id);const pv=CH[ci-1],nx=CH[ci+1];
  s+=`<nav class="chnav">${pv?`<a href="#${pv.id}"><span class="mono">← Föregående</span><b>K${pv.n} ${esc(pv.t)}</b></a>`:"<span></span>"}${nx?`<a href="#${nx.id}" style="text-align:right"><span class="mono">Nästa →</span><b>K${nx.n} ${esc(nx.t)}</b></a>`:""}</nav>`;
  v.innerHTML=tpl(s);
  hydrate(v,d,id);
  addSaveStars(v,d,id);
  // pretest
  if(b.pre.length){const box=$(".preqs",v);let n=0;
    const unlock=()=>{const o=S.ch[id]||{};o.pre=today();S.ch[id]=stamp(o);save();$("#lock",v).classList.remove("pre-wait");$("#preSkip",v).textContent="Förtestet är gjort"};
    b.pre.forEach(q=>box.appendChild(mcNode(q,{meta:false,prev:true,onDone:()=>{n++;if(n>=b.pre.length&&!(S.ch[id]||{}).pre)setTimeout(unlock,600)}})));
    $("#preSkip",v).addEventListener("click",unlock)}
  const kq=$(".kqs",v);b.kan.forEach(k=>kq.appendChild(openNode(k,{mode:"kan"})));
  const upK=()=>{const n=b.kan.filter(k=>(S.open[k.id]||{}).r===2).length;$("#"+id+"-kandu .kh .mono",v).textContent=`${n} av ${b.kan.length} kunde`};upK();
  const kp=$(".kps",v);b.kompis.forEach(k=>kp.appendChild(openNode(k,{mode:"kompis"})));
  if(!b.kompis.length)$("#"+id+"-kompis",v).remove();
  $("#readBtn",v).addEventListener("click",e=>{const o=S.ch[id]||{};o.read=today();S.ch[id]=stamp(o);save();e.target.textContent="Läst "+fmtDay(o.read)+" ✓";toast("Repetition inlagd i studieplanen: om 1, 3 och 7 dagar.")});
  G._soft=()=>{upK()};
};

/* ---------- save anything ---------- */
function secOf(el){const s=el.closest&&el.closest("section.sec");return s?s.id.replace(/^k\d+-/,""):""}
function addSaveStars(root,d,chId){
  $$("section.sec",root).forEach(sec=>{const sid=sec.id.replace(/^k\d+-/,"");const hd=$(".sh .s",sec);const h2=$(".sh h2",sec);if(hd&&h2)hd.insertAdjacentHTML("beforeend",starBtn(chId+":s:"+sid,{k:"s",ch:chId,sec:sid,h:h2.textContent}))});
  $$(".tscroll",root).forEach((w,i)=>{const t=$("table",w);if(!t||w.closest(".box"))return;const th=$("th",t);const ttl=(th&&th.textContent.trim())||"Tabell";
    w.insertAdjacentHTML("beforebegin",`<div class="savebar"><span class="mono">Tabell</span>${starBtn(chId+":t:"+hash(t.textContent.slice(0,300)),{k:"tb",ch:chId,sec:secOf(w),h:"Tabell: "+ttl,html:t.outerHTML})}</div>`)});
  $$("figure.lfig",root).forEach(f=>{const fid=f.id.replace(/^fig-/,"");const cap=plain(($("figcaption",f)||{}).innerHTML||"").slice(0,90);let bar=$(".figbar",f);
    if(!bar){bar=h(`<div class="figbar"></div>`);f.insertBefore(bar,f.firstChild)}
    bar.insertAdjacentHTML("beforeend",`<span class="spacer"></span>${starBtn(chId+":f:"+fid,{k:"f",ch:chId,sec:secOf(f),fig:fid,h:cap||"Bild"})}`)});
  $$(".wid",root).forEach((w,i)=>{if(!w.id)w.id=chId+"-w"+i;const hd=$(".wh",w);const ttl=hd?($("b",hd)||hd).textContent:"Simulering";
    const st=starBtn(chId+":w:"+hash(ttl),{k:"l",ch:chId,sec:secOf(w),h:"Simulering: "+ttl});if(hd)hd.insertAdjacentHTML("beforeend",st);else w.insertAdjacentHTML("afterbegin",`<div class="savebar">${st}</div>`)});
  $$(".xbox",root).forEach(x=>{const hd=$(".xh",x);if(!hd)return;const ttl=(($(".xt",hd)||{}).textContent||"")+": "+(($("b",hd)||{}).textContent||"");
    $(".sc",hd).insertAdjacentHTML("afterend",starBtn(chId+":x:"+x.id,{k:"l",ch:chId,sec:secOf(x),h:"Övning "+ttl}))});
}
/* text selection → save */
(function(){let btn=null,timer=null;
  function hide(){if(btn){btn.remove();btn=null}}
  function check(){const sel=window.getSelection();const txt=sel?String(sel).trim():"";
    if(!txt||txt.length<3){hide();return}
    const node=sel.anchorNode&&(sel.anchorNode.nodeType===1?sel.anchorNode:sel.anchorNode.parentElement);
    const view=node&&node.closest&&node.closest("#main");if(!view){hide();return}
    const cur=(location.hash||"").slice(1).split(".")[0];const ch=CHM[cur]?cur:"";
    const sec=node.closest?secOf(node):"";const h2=node.closest&&node.closest("section.sec");
    if(!btn){btn=h(`<button type="button" class="btn acc selsave">★ Spara markeringen</button>`);document.body.appendChild(btn);
      btn.addEventListener("mousedown",e=>e.preventDefault());
      btn.addEventListener("click",()=>{const t=String(window.getSelection()).trim().slice(0,1500);if(!t)return;const id="sel:"+hash(t);
        S.sv=S.sv||{};S.sv[id]=stamp({on:1,k:"tx",ch:btn.dataset.ch,sec:btn.dataset.sec,h:btn.dataset.h,txt:t});save();toast("Markeringen är sparad under Sparat.");window.getSelection().removeAllRanges();hide()})}
    btn.dataset.ch=ch;btn.dataset.sec=sec;btn.dataset.h=h2?($(".sh h2",h2)||{}).textContent||"":document.title}
  document.addEventListener("selectionchange",()=>{clearTimeout(timer);timer=setTimeout(check,250)});
})();
/* ---------- home ---------- */
function ring(p,color){const r=18,c=2*Math.PI*r;return`<svg class="ring" viewBox="0 0 46 46" aria-hidden="true"><circle cx="23" cy="23" r="${r}" fill="none" stroke="var(--line)" stroke-width="5"/><circle cx="23" cy="23" r="${r}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(c*p/100).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 23 23)"/><text x="23" y="27" text-anchor="middle" style="font-size:11px;font-family:var(--f-mono);fill:var(--ink)">${p}</text></svg>`}
VIEWS.start=async function(v){
  v.className="view wide";
  const draw=()=>{
    const due=dueCount();const weak=G.bank?weakItems().length:0;const ex=examDay();const t=today();
    const left=ex!=null?ex-t:null;
    const tot=G.bank?{c:G.bank.cards.length,q:G.bank.mc.length+G.bank.open.length}:{c:0,q:0};
    let s=`<div class="hero"><span class="mono">Biologi · kapitel 1, 5 och 7 + lärarens material</span><h1>Livets fabrik</h1>
    <p class="lead">Hela provet på ett ställe: från molekylerna som bygger cellen, via membranet och organellerna, ut till bakterier, virus, antibiotika och växten. Cellen är en fabrik, och den bilden följer med genom alla kapitel.</p></div>
    <div class="today"><div class="tcard"><span class="mono" style="color:inherit;opacity:.7">Idag, ${fmtDay(t)}</span><h2>Dagens pass</h2>
      <div class="nums"><div><b>${due}</b><span>kort att repetera</span></div><div><b>${weak}</b><span>svaga punkter</span></div><div><b>${left==null?"–":left<0?"klart":left}</b><span>${left==null?"sätt provdatum i studieplanen":left===0?"provet är idag":"dagar till provet"}</span></div></div>
      <a class="btn" href="#pass">Starta dagens pass, ca 20 min</a></div>
      <div class="card"><h3 style="margin-top:0">Så lär du dig snabbast</h3><ol class="small" style="margin:.3rem 0">
        <li><b>Gissa först.</b> Varje kapitel börjar med ett förtest.</li>
        <li><b>Läs aktivt.</b> Testa bilderna med etiketterna dolda.</li>
        <li><b>Skatta säkerheten.</b> Säg om du är säker eller gissar, så vet guiden vad du kan.</li>
        <li><b>Förklara varför.</b> Skriv "eftersom" i dina svar.</li>
        <li><b>Repetera med mellanrum.</b> Dagens pass väljer korten åt dig.</li></ol>
        <a href="#plan">Gör en studieplan efter provdatum</a></div></div>
    <h2 style="margin-top:26px">Från det minsta till det största</h2><p class="muted" style="margin-top:4px">Kapitlen följer en väg från molekyl till organism. Siffran i ringen är hur mycket av kapitlet du kan.</p><div class="route">`;
    let lastP="";s+="<ol>";
    CH.forEach(c=>{if(c.p!==lastP){if(lastP)s+="</ol><ol>";lastP=c.p;s+=`</ol><div class="partlbl"><i style="background:${PARTS[c.p].c}"></i>${esc(PARTS[c.p].n)}</div><ol>`}
      const pr=chProgress(c.id);const st=S.ch[c.id]||{};
      s+=`<li><a href="#${c.id}">${ring(pr,PARTS[c.p].c)}<span class="tt"><b>K${c.n} ${esc(c.t)}</b><span>${esc(c.fab)}${st.read?" · läst "+fmtDay(st.read):""}</span></span><span class="scale">${esc(c.sc)}</span></a></li>`});
    s+=`</ol></div>
    <h2 style="margin-top:26px">Verktyg</h2><div class="tiles" style="margin-top:10px">
      <a class="tile" href="#atlas"><b>Cellatlasen</b><span>Zooma från organism till molekyl i djurcell, växtcell, bakterie, arké och virus.</span></a>
      <a class="tile" href="#jamfor"><b>Stora jämförelsen</b><span>Sju sorters celler och virus. Gissa först, klicka fram svaret.</span></a>
      <a class="tile" href="#trad"><b>Röda trådar</b><span>Åtta idéer som går igen i flera kapitel.</span></a>
      <a class="tile" href="#tidslinje"><b>Tidslinjen</b><span>Från de första bakterierna till dagens resistens.</span></a>
      <a class="tile" href="#karta"><b>Begreppskartor</b><span>Bygg kartan själv och jämför med facit.</span></a>
      <a class="tile" href="#korsord"><b>Cellkrysset</b><span>Lärarens korsord om kapitel 1, interaktivt.</span></a>
      <a class="tile" href="#ab"><b>Arbetsbladen</b><span>Båda arbetsbladen som digitala lucktexter med facit.</span></a>
      <a class="tile" href="#snabb"><b>Snabböversikt</b><span>Kvällen före provet och en 5-minutersrepetition.</span></a></div>
    <h2 style="margin-top:26px">Röda trådar</h2><div class="chips" style="margin-top:10px">${Object.keys(THREADS).map(k=>thrChip(k)).join("")}</div>
    <div class="grid2" style="margin-top:26px"><div class="card"><h3 style="margin-top:0">Etiketterna i guiden</h3><p class="small"><span class="tag prov">Provviktigt</span> finns både i boken och i lärarens powerpoint eller arbetsblad.</p><p class="small"><span class="tag lek">Från lektionen</span> finns bara i lärarens material.</p><p class="small"><span class="tag diff">Boken och läraren skiljer sig</span> boken och powerpointen säger olika saker. Bokens version står först.</p><p class="small"><span class="tag extra">Extra (inte i boken)</span> finns inte i ditt material, men är bra att veta.</p></div>
    <div class="card"><h3 style="margin-top:0">Framsteg</h3><p class="small">${tot.c} flashcards och ${tot.q} quizfrågor finns i guiden.</p><p class="small" id="syncHome"></p><p class="small">Källor: boken s. 17–27, 31–37, 178–186, 212–215 och 244–247, lärarens fyra powerpoints, två arbetsblad, faktabladet och korsordet. <a href="#om">Om materialet</a></p></div></div>`;
    v.innerHTML=s;$("#syncHome",v).textContent=Sync.on?"Dina framsteg synkas med ditt konto mellan mobil och dator.":"Dina framsteg sparas i den här webbläsaren.";
  };
  draw();G._soft=draw;await ensureBank();draw();
};
VIEWS.om=async function(v){
  await ensureBank();
  v.innerHTML=`<h1>Om materialet</h1>${tpl(G.OM||"")}`;
};

/* ---------- flashcard node ---------- */
const CTYPE={b:"Begrepp",v:"Varför",s:"Siffror och namn",j:"Jämför",f:"Provfälla",i:"Bild"};
function cardNode(c,onRate){
  const st=S.cards[c.id];
  const d=h(`<div><div class="fc"><div class="fcard" tabindex="0" role="button" aria-label="Vänd kortet">
    <div class="fface front"><div class="top"><span class="pill x">${CTYPE[c.ty]||"Kort"}</span>${c.p?'<span class="tag prov">Provviktigt</span>':""}<span class="spacer"></span>${starBtn(c.id,{k:"c",ch:c.ch})}<a class="tag src" href="#${c.ch}">K${CHM[c.ch].n}</a></div><div class="q">${tpl(c.f)}</div><p class="small muted" style="margin-top:14px">Svara i huvudet. Tryck sedan för att vända.</p></div>
    <div class="fface back"><div class="top">${(c.t||[]).map(t=>thrChip(t,false)).join(" ")}<span class="spacer"></span>${st?`<span class="pill x">Låda ${st.b}</span>`:'<span class="pill x">Nytt</span>'}</div><div class="a">${tpl(c.b)}</div>${c.src?`<p style="margin-top:10px"><span class="tag src">${esc(c.src)}</span></p>`:""}</div></div></div>
    <div class="row rbtns" hidden><span class="small muted">Hur gick det?</span><button class="btn bad sm" type="button" data-r="0">Kunde inte</button><button class="btn mid sm" type="button" data-r="1">Osäker</button><button class="btn good sm" type="button" data-r="2">Kunde</button></div></div>`);
  return d;
}
function mountCard(host,c,onRate){
  host.innerHTML="";const w=cardNode(c);host.appendChild(w);
  const fc=$(".fcard",host),rb=$(".rbtns",host);
  const flip=()=>{fc.classList.toggle("flip");if(fc.classList.contains("flip"))rb.hidden=false};
  fc.addEventListener("click",e=>{if(e.target.closest("a"))return;flip()});
  fc.addEventListener("keydown",e=>{if(e.key===" "||e.key==="Enter"){e.preventDefault();flip()}});
  const fit=()=>{const f=$(".front",host),b=$(".back",host);const hgt=Math.max(260,f.scrollHeight,b.scrollHeight);fc.style.minHeight=hgt+"px"};setTimeout(fit,20);
  $$("button[data-r]",rb).forEach(b=>b.addEventListener("click",()=>{const r=+b.dataset.r;rateCard(c.id,r);onRate&&onRate(r)}));
}

/* ---------- session runner ---------- */
function estSec(it){return it.kind==="card"?20:it.kind==="mc"?45:200}
function runSession(v,items,opts){
  opts=opts||{};const exam=opts.mode==="exam";
  let i=0;const res=[];const queue=items.slice();const t0=Date.now();let timer=null;let requeued={};
  v.innerHTML=`<div class="sess"><div class="sesstop"><span class="mono cnt"></span><div class="bar"><i></i></div><span class="mono tmr"></span><button class="btn ghost sm" type="button" data-a="end">Avsluta</button></div><h2 class="stitle" style="font-size:1.2rem;margin-bottom:8px">${esc(opts.title||"Pass")}</h2><div class="slot"></div><div class="row end nav"></div></div>`;
  const slot=$(".slot",v),nav=$(".nav",v);
  $("[data-a=end]",v).addEventListener("click",()=>end(true));
  if(opts.time){const until=Date.now()+opts.time*1000;const tick=()=>{const left=Math.max(0,Math.round((until-Date.now())/1000));$(".tmr",v).textContent=`${Math.floor(left/60)}:${String(left%60).padStart(2,"0")}`;if(left<=0){clearInterval(timer);toast("Tiden är slut.");end(false)}};tick();timer=setInterval(tick,1000)}
  function prog(){$(".cnt",v).textContent=`${Math.min(i+1,queue.length)} / ${queue.length}`;$(".bar i",v).style.width=(100*i/Math.max(1,queue.length))+"%"}
  function next(){i++;if(i>=queue.length)end(false);else show()}
  function nextBtn(label){nav.innerHTML="";const b=h(`<button class="btn acc" type="button">${label||"Nästa"}</button>`);b.addEventListener("click",next);nav.appendChild(b);b.focus({preventScroll:true})}
  function show(){prog();nav.innerHTML="";slot.innerHTML="";const it=queue[i];window.scrollTo({top:0});
    if(it.kind==="card"){mountCard(slot,it,r=>{res.push({it,r});if(r===0&&!requeued[it.id]&&!exam){requeued[it.id]=1;queue.splice(Math.min(queue.length,i+4),0,it)}next()});
      const skip=h(`<button class="btn ghost sm" type="button">Hoppa över</button>`);skip.addEventListener("click",next);nav.appendChild(skip)}
    else if(it.kind==="mc"){const n=mcNode(it,{chTag:true,noFeedback:exam,onDone:(ok,conf,p)=>{res.push({it,ok,conf});if(exam)next();else nextBtn()}});slot.appendChild(n)}
    else{if(exam){const n=h(`<div class="kq"><p class="q">${tpl(it.q)} <a class="tag src" href="#${it.ch}">${esc(chLabel(it.ch))}</a></p><textarea aria-label="Ditt svar" placeholder="Skriv ditt svar. Du rättar själv när provet är slut."></textarea></div>`);slot.appendChild(n);
        const b=h(`<button class="btn acc" type="button">Spara svaret och gå vidare</button>`);b.addEventListener("click",()=>{res.push({it,txt:$("textarea",n).value.trim()});next()});nav.appendChild(b)}
      else{const n=openNode(it,{mode:it.kind==="kompis"?"kompis":"open",chTag:true,onRate:r=>{res.push({it,r});nextBtn()}});slot.appendChild(n);
        const skip=h(`<button class="btn ghost sm" type="button">Hoppa över</button>`);skip.addEventListener("click",next);nav.appendChild(skip)}}
  }
  function end(early){clearInterval(timer);const secs=Math.round((Date.now()-t0)/1000);if(opts.onEnd)return opts.onEnd(v,res,secs,early);summary(v,res,secs,opts)}
  if(!queue.length){v.innerHTML=`<div class="empty">Det finns inget att öva här just nu. ${opts.emptyMsg||""}</div>`;return}
  show();
}
function summary(v,res,secs,opts){
  const cards=res.filter(r=>r.it.kind==="card"),mc=res.filter(r=>r.it.kind==="mc"),op=res.filter(r=>r.r!=null&&r.it.kind!=="card");
  const k=cards.filter(r=>r.r===2).length,o=cards.filter(r=>r.r===1).length,n=cards.filter(r=>r.r===0).length;
  const mok=mc.filter(r=>r.ok&&r.conf>0).length,mluck=mc.filter(r=>r.ok&&r.conf===0).length,mfs=mc.filter(r=>!r.ok&&r.conf===2).length,mw=mc.filter(r=>!r.ok).length;
  v.innerHTML=`<div class="sess"><span class="mono">Passet är klart · ${Math.round(secs/60)} min</span><h2>${esc(opts.title||"Pass")}</h2>
   <div class="statgrid">${cards.length?`<div class="stat"><b>${k} / ${cards.length}</b><span>kort kunde du (${o} osäkra, ${n} kunde inte)</span></div>`:""}
   ${mc.length?`<div class="stat"><b>${mok} / ${mc.length}</b><span>frågor rätt och säkert</span></div><div class="stat"><b>${mluck}</b><span>rätt men gissade</span></div><div class="stat"><b>${mfs}</b><span>fel fast du var säker</span></div>`:""}
   ${op.length?`<div class="stat"><b>${op.filter(r=>r.r===2).length} / ${op.length}</b><span>öppna frågor kunde du</span></div>`:""}</div>
   ${mw||n?`<p>Det du missade ligger nu i <a href="#svaga">Mina svaga punkter</a> och kommer tillbaka i nästa pass.</p>`:"<p>Snyggt. Inga missar i det här passet.</p>"}
   <div class="row"><a class="btn acc" href="#start">Till startsidan</a><button class="btn ghost" type="button" data-a="again">Ett pass till</button></div></div>`;
  $("[data-a=again]",v).addEventListener("click",()=>route());
}

/* ---------- Dagens pass ---------- */
function newCardsAllowed(){const t=today();const used=(S.nd&&S.nd[t])||0;return Math.max(0,(S.set.newPer||25)-used)}
function noteNew(n){const t=today();const prev=(S.nd&&S.nd[t])||0;S.nd={};S.nd[t]=prev+n}
function studiedChs(){return CH.filter(c=>{const s=S.ch[c.id]||{};return s.read||s.pre}).map(c=>c.id)}
function repsDue(){const t=today();const out=[];CH.forEach(c=>{const r=(S.ch[c.id]||{}).read;if(r==null)return;[1,3,7].forEach(k=>{if(r+k===t)out.push({ch:c.id,k})})});return out}
function buildPass(chId){
  const B=G.bank;const t=today();const items=[];const used=new Set();const add=x=>{if(x&&!used.has(x.id)){used.add(x.id);items.push(x)}};
  const inCh=x=>!chId||x.ch===chId;
  const due=B.cards.filter(c=>inCh(c)&&S.cards[c.id]&&S.cards[c.id].d<=t).sort((a,b)=>(S.cards[a.id].d-S.cards[b.id].d)||(S.cards[a.id].b-S.cards[b.id].b));
  due.slice(0,chId?25:30).forEach(add);
  const st=studiedChs();const pool=chId?[chId]:(st.length?st:[CH[0].id]);
  let nn=Math.min(newCardsAllowed(),chId?20:Math.max(0,32-items.length));
  const fresh=B.cards.filter(c=>pool.includes(c.ch)&&!S.cards[c.id]);
  const freshSorted=fresh.sort((a,b)=>(b.p?1:0)-(a.p?1:0)||CH.findIndex(x=>x.id===a.ch)-CH.findIndex(x=>x.id===b.ch));
  freshSorted.slice(0,nn).forEach(add);
  weakItems().filter(w=>inCh(w.it)&&w.it.kind!=="card").slice(0,chId?6:6).forEach(w=>add(w.it));
  const mcs=B.mc.filter(q=>inCh(q)&&(chId||pool.includes(q.ch)||st.length===0)&&qaStatus(q.id)!=="k");
  // interleave chapters
  const byC={};mcs.forEach(q=>{(byC[q.ch]=byC[q.ch]||[]).push(q)});
  const chs=shuffle(Object.keys(byC));let k=0,guard=0;const want=chId?8:7;
  while(k<want&&guard<200){guard++;const c=chs[guard%chs.length];if(!c)break;const q=(byC[c]||[]).shift();if(q){add(q);k++}}
  repsDue().forEach(r=>{if(chId&&r.ch!==chId)return;shuffle(B.mc.filter(q=>q.ch===r.ch)).slice(0,3).forEach(add)});
  const opens=B.open.concat(B.kompis).filter(x=>inCh(x)&&(chId||pool.includes(x.ch))&&(S.open[x.id]||{}).r!==2);
  if(opens.length)add(shuffle(opens)[0]);
  // fit to ~20 min
  let tot=0;const fit=[];items.forEach(x=>{if(tot+estSec(x)<=1260||fit.length<8){fit.push(x);tot+=estSec(x)}});
  const nNew=fit.filter(x=>x.kind==="card"&&!S.cards[x.id]).length;
  return{items:shuffle(fit),nNew,tot};
}
VIEWS.pass=async function(v,arg){
  await ensureBank();
  const chId=CHM[arg]?arg:null;
  const {items,nNew,tot}=buildPass(chId);
  const title=chId?`Pass för K${CHM[chId].n} ${CHM[chId].t}`:"Dagens pass";
  v.innerHTML=`<div class="card"><span class="mono">${fmtDay(today())}</span><h1 style="font-size:2rem">${esc(title)}</h1>
   <p>${items.length} uppgifter, ungefär ${Math.max(1,Math.round(tot/60))} minuter: ${items.filter(x=>x.kind==="card").length} flashcards (varav ${nNew} nya), ${items.filter(x=>x.kind==="mc").length} frågor och ${items.filter(x=>x.kind!=="card"&&x.kind!=="mc").length} öppen fråga. Kapitlen blandas, eftersom blandade frågor gör att du lär dig skilja begreppen åt.</p>
   ${!studiedChs().length&&!chId?`<p class="small muted">Du har inte börjat på något kapitel ännu, så passet tar nya kort från K1. Börja gärna med att läsa <a href="#k1">K1</a>.</p>`:""}
   <div class="row"><button class="btn acc" type="button" id="go">Starta</button><a class="btn ghost" href="#plan">Studieplan</a></div></div>`;
  $("#go",v).addEventListener("click",()=>{noteNew(nNew);save();runSession(v,items,{title,emptyMsg:'Läs ett kapitel och markera det som läst, eller öppna <a href="#kort">Flashcards</a>.'})});
};

/* ---------- flashcards ---------- */
function selOpts(list,cur){return list.map(([v,n])=>`<option value="${v}" ${v===cur?"selected":""}>${esc(n)}</option>`).join("")}
const CH_OPTS=()=>[["all","Alla kapitel"],...CH.map(c=>[c.id,"K"+c.n+" "+c.t])];
const TH_OPTS=()=>[["all","Alla trådar"],...Object.keys(THREADS).map(k=>[k,THREADS[k].n])];
VIEWS.kort=async function(v,arg){
  await ensureBank();const B=G.bank;
  const f=Object.assign({ch:CHM[arg]?arg:"all",th:"all",ty:"all",mode:"today"},G._kf||{},CHM[arg]?{ch:arg}:{});
  const draw=()=>{G._kf=f;const t=today();
    let list=B.cards.filter(c=>(f.ch==="all"||c.ch===f.ch)&&(f.th==="all"||(c.t||[]).includes(f.th))&&(f.ty==="all"||c.ty===f.ty));
    const boxes=[0,0,0,0,0,0];list.forEach(c=>{const s=S.cards[c.id];boxes[s?s.b:0]++});
    let sel;if(f.mode==="today"){const d=list.filter(c=>S.cards[c.id]&&S.cards[c.id].d<=t);const n=list.filter(c=>!S.cards[c.id]).slice(0,newCardsAllowed());sel=d.concat(n)}
    else if(f.mode==="new")sel=list.filter(c=>!S.cards[c.id]);else if(f.mode==="weak")sel=list.filter(c=>{const s=S.cards[c.id];return s&&(s.l===0||s.b<=1)});else sel=list;
    const mx=Math.max(1,...boxes);
    v.innerHTML=`<h1>Flashcards</h1><p class="muted">Lådsystem: ett kort du kan flyttar upp en låda och kommer tillbaka efter längre tid (1, 2, 4, 8 och 16 dagar). Ett kort du inte kan börjar om i låda 1 och kommer igen i samma pass.</p>
    <div class="filters"><label>Kapitel<select id="fch">${selOpts(CH_OPTS(),f.ch)}</select></label><label>Röd tråd<select id="fth">${selOpts(TH_OPTS(),f.th)}</select></label><label>Korttyp<select id="fty">${selOpts([["all","Alla typer"],...Object.entries(CTYPE)],f.ty)}</select></label>
    <label>Vilka kort<select id="fmo">${selOpts([["today","Dagens kort"],["all","Alla"],["new","Bara nya"],["weak","Bara svaga"]],f.mode)}</select></label></div>
    <div class="card"><div class="hbars">${["Nya","Låda 1 · 1 dag","Låda 2 · 2 dagar","Låda 3 · 4 dagar","Låda 4 · 8 dagar","Låda 5 · 16 dagar"].map((n,i)=>`<div class="hb"><span>${n}</span><div class="bar"><i style="width:${100*boxes[i]/mx}%;background:${i===0?"var(--line2)":i<3?"var(--mid)":"var(--good)"}"></i></div><span class="v">${boxes[i]}</span></div>`).join("")}</div>
    <div class="row"><button class="btn acc" type="button" id="go" ${sel.length?"":"disabled"}>Starta ${plural(sel.length,"kort","kort")}</button><span class="small muted">${list.length} kort matchar filtret.</span></div></div>`;
    ["fch","fth","fty","fmo"].forEach(id=>$("#"+id,v).addEventListener("change",e=>{const k={fch:"ch",fth:"th",fty:"ty",fmo:"mode"}[id];f[k]=e.target.value;draw()}));
    $("#go",v).addEventListener("click",()=>{const nNew=sel.filter(c=>!S.cards[c.id]).length;if(f.mode==="today")noteNew(nNew);runSession(v,shuffle(sel).slice(0,80),{title:"Flashcards"})});
  };draw();G._soft=null;
};

/* ---------- quiz ---------- */
VIEWS.quiz=async function(v,arg){
  await ensureBank();const B=G.bank;
  const f=Object.assign({lv:"f",ch:"all",th:"all",n:"10",only:"all"},G._qf||{},CHM[arg]?{ch:arg}:{});
  const draw=()=>{G._qf=f;
    const pool=(f.lv==="o"?B.open:B.mc.filter(q=>q.lv===f.lv)).filter(q=>(f.ch==="all"||q.ch===f.ch)&&(f.th==="all"||(q.t||[]).includes(f.th)));
    const sel=f.only==="wrong"?pool.filter(q=>f.lv==="o"?((S.open[q.id]||{}).r??-1)<2&&S.open[q.id]:["f","n"].includes(qaStatus(q.id))||(S.qa[q.id]&&S.qa[q.id].c===0)):f.only==="new"?pool.filter(q=>f.lv==="o"?!S.open[q.id]:!S.qa[q.id]):pool;
    const done=f.lv==="o"?pool.filter(q=>(S.open[q.id]||{}).r===2).length:pool.filter(q=>qaStatus(q.id)==="k").length;
    v.innerHTML=`<h1>Quiz</h1><p class="muted">Tre nivåer. Svara, säg hur säker du är, och läs förklaringen. Frågor du gissade rätt på räknas inte som kunnade.</p>
     <div class="pnav" role="tablist">${[["f","1 Fakta"],["u","2 Förståelse"],["o","3 Öppna provfrågor"]].map(([k,n])=>`<a href="#quiz" role="tab" data-lv="${k}" class="${f.lv===k?"on":""}">${n}</a>`).join("")}</div>
     <div class="filters"><label>Kapitel<select id="qch">${selOpts(CH_OPTS(),f.ch)}</select></label><label>Röd tråd<select id="qth">${selOpts(TH_OPTS(),f.th)}</select></label><label>Vilka<select id="qon">${selOpts([["all","Alla"],["new","Bara nya"],["wrong","Fel eller gissade"]],f.only)}</select></label><label>Antal<select id="qn">${selOpts([["10","10"],["20","20"],["40","40"],["all","Alla"]],f.n)}</select></label></div>
     <div class="card"><p style="margin-top:0"><b>${pool.length}</b> frågor på nivån${f.ch!=="all"?" i kapitlet":""}. Du kan <b>${done}</b> av dem säkert.</p><div class="bar"><i style="width:${pool.length?100*done/pool.length:0}%"></i></div>
     <div class="row"><button class="btn acc" type="button" id="go" ${sel.length?"":"disabled"}>Starta ${Math.min(sel.length,f.n==="all"?sel.length:+f.n)} frågor</button></div></div>`;
    $$(".pnav a",v).forEach(a=>a.addEventListener("click",e=>{e.preventDefault();f.lv=a.dataset.lv;draw()}));
    [["qch","ch"],["qth","th"],["qon","only"],["qn","n"]].forEach(([id,k])=>$("#"+id,v).addEventListener("change",e=>{f[k]=e.target.value;draw()}));
    $("#go",v).addEventListener("click",()=>{const n=f.n==="all"?sel.length:+f.n;
      const ord=f.ch==="all"?interleave(sel):shuffle(sel);runSession(v,ord.slice(0,n),{title:["","Fakta","Förståelse","Öppna provfrågor"][{f:1,u:2,o:3}[f.lv]]})});
  };draw();G._soft=null;
};
function interleave(list){const by={};shuffle(list).forEach(q=>{(by[q.ch]=by[q.ch]||[]).push(q)});const keys=shuffle(Object.keys(by));const out=[];let more=true;while(more){more=false;keys.forEach(k=>{const q=by[k].shift();if(q){out.push(q);more=true}})}return out}

/* ---------- exam simulator ---------- */
VIEWS.prov=async function(v){
  await ensureBank();const B=G.bank;
  const f=Object.assign({n:20,open:2,time:"auto",chs:CH.map(c=>c.id)},G._pf||{});
  const draw=()=>{G._pf=f;
    const hist=(S.exams||[]).slice(-6).reverse();
    v.innerHTML=`<h1>Provsimulator</h1><p class="muted">Som ett riktigt prov: inga svar visas förrän du är klar. Du skattar ändå hur säker du är, så att resultatet visar skillnaden mellan kunskap och tur.</p>
    <div class="card"><div class="filters"><label>Antal flervalsfrågor<select id="pn">${selOpts([["10","10"],["20","20"],["30","30"],["40","40"]].map(x=>[x[0],x[1]]),String(f.n))}</select></label>
     <label>Öppna frågor<select id="po">${selOpts([["0","0"],["1","1"],["2","2"],["3","3"],["4","4"]],String(f.open))}</select></label>
     <label>Tid<select id="pt">${selOpts([["auto","Automatisk"],["none","Ingen tidsgräns"],["15","15 min"],["30","30 min"],["45","45 min"],["60","60 min"]],f.time)}</select></label></div>
     <p style="margin:.4rem 0 .2rem;font-weight:700;font-size:.9rem">Kapitel</p><div class="chips" id="pchs">${CH.map(c=>`<button type="button" class="chip" data-c="${c.id}" aria-pressed="${f.chs.includes(c.id)}">K${c.n}</button>`).join("")}<button type="button" class="chip" data-c="all">Alla</button><button type="button" class="chip" data-c="none">Inga</button></div>
     <p class="small muted" id="pinfo"></p><div class="row"><button class="btn acc" type="button" id="go">Starta provet</button></div></div>
     ${hist.length?`<h2 style="margin-top:24px">Tidigare prov</h2><div class="hbars">${hist.map(e=>`<div class="hb"><span>${fmtDay(dayOf(new Date(e.t)))} · ${e.n} frågor</span><div class="bar"><i style="width:${e.p}%"></i></div><span class="v">${e.p} %</span></div>`).join("")}</div>`:""}`;
    const sec=()=>f.time==="none"?0:f.time==="auto"?Math.round(f.n*60+f.open*240):(+f.time)*60;
    $("#pinfo",v).textContent=`${f.n} flervalsfrågor och ${f.open} öppna frågor ur ${f.chs.length} kapitel. ${sec()?"Tid: "+Math.round(sec()/60)+" minuter.":"Ingen tidsgräns."}`;
    [["pn","n"],["po","open"],["pt","time"]].forEach(([id,k])=>$("#"+id,v).addEventListener("change",e=>{f[k]=k==="time"?e.target.value:+e.target.value;draw()}));
    $$("#pchs button",v).forEach(b=>b.addEventListener("click",()=>{const c=b.dataset.c;if(c==="all")f.chs=CH.map(x=>x.id);else if(c==="none")f.chs=[];else f.chs=f.chs.includes(c)?f.chs.filter(x=>x!==c):f.chs.concat(c);draw()}));
    $("#go",v).addEventListener("click",()=>{if(!f.chs.length){toast("Välj minst ett kapitel.");return}
      const mcPool=B.mc.filter(q=>f.chs.includes(q.ch));const per={};mcPool.forEach(q=>{(per[q.ch]=per[q.ch]||[]).push(q)});
      // weight unseen and weak higher
      Object.values(per).forEach(a=>a.sort((x,y)=>prio(y)-prio(x)+Math.random()*0.8-0.4));
      const out=[];let guard=0;const keys=shuffle(Object.keys(per));while(out.length<f.n&&guard<1000){guard++;const k=keys[guard%keys.length];const q=per[k]&&per[k].shift();if(q)out.push(q);if(!Object.values(per).some(a=>a.length))break}
      const op=shuffle(B.open.filter(q=>f.chs.includes(q.ch))).slice(0,f.open);
      runSession(v,shuffle(out).concat(op),{title:"Provsimulator",mode:"exam",time:sec(),onEnd:examResult})});
  };draw();G._soft=null;
};
function prio(q){const s=qaStatus(q.id);return s==="new"?2:s==="f"?3:s==="n"?2.5:s==="d"?1.5:0}
function examResult(v,res,secs,early){
  const mc=res.filter(r=>r.it.kind==="mc"),op=res.filter(r=>r.it.kind==="open");
  const byCh={},byT={};
  mc.forEach(r=>{const c=byCh[r.it.ch]=byCh[r.it.ch]||[0,0];c[1]++;if(r.ok)c[0]++;(r.it.t||[]).forEach(t=>{const x=byT[t]=byT[t]||[0,0];x[1]++;if(r.ok)x[0]++})});
  const ok=mc.filter(r=>r.ok).length,luck=mc.filter(r=>r.ok&&r.conf===0).length,fs=mc.filter(r=>!r.ok&&r.conf===2).length;
  const bars=(o,lab)=>Object.entries(o).map(([k,[a,b]])=>`<div class="hb"><span>${lab(k)}</span><div class="bar"><i style="width:${100*a/b}%;background:${a/b>=.8?"var(--good)":a/b>=.5?"var(--mid)":"var(--bad)"}"></i></div><span class="v">${a}/${b}</span></div>`).join("");
  v.innerHTML=`<div class="sess"><span class="mono">Provet är klart · ${Math.round(secs/60)} min${early?" · avslutat i förtid":""}</span><h1 style="font-size:2rem">Resultat</h1>
   <div class="statgrid"><div class="stat"><b>${ok} / ${mc.length}</b><span>flervalsfrågor rätt</span></div><div class="stat"><b>${luck}</b><span>av de rätta var gissningar</span></div><div class="stat"><b>${fs}</b><span>fel fast du var säker</span></div><div class="stat"><b id="opsc">–</b><span>öppna frågor (rätta nedan)</span></div></div>
   <h2 style="font-size:1.3rem">Per kapitel</h2><div class="hbars">${bars(byCh,k=>"K"+CHM[k].n+" "+CHM[k].t)}</div>
   ${Object.keys(byT).length?`<h2 style="font-size:1.3rem">Per röd tråd</h2><div class="hbars">${bars(byT,k=>THREADS[k].n)}</div>`:""}
   ${op.length?`<h2 style="font-size:1.3rem">Rätta dina öppna svar</h2><div class="ops"></div>`:""}
   <h2 style="font-size:1.3rem">Frågor att gå igenom</h2><div class="wrong"></div>
   <div class="row"><a class="btn acc" href="#svaga">Öva svaga punkter</a><button class="btn ghost" type="button" data-a="again">Nytt prov</button></div></div>`;
  const opsBox=$(".ops",v);const opR={};
  const saveExam=()=>{const opPts=Object.values(opR).reduce((s,r)=>s+r/2,0);const tot=mc.length+op.length;const p=tot?Math.round(100*(ok+opPts)/tot):0;
    const e={t:G._examT||(G._examT=Date.now()),n:tot,p,ok,mc:mc.length,op:op.length,luck,fs,byCh,byT};S.exams=(S.exams||[]).filter(x=>x.t!==e.t).concat(e).slice(-30);save();
    $("#opsc",v).textContent=op.length?`${opPts} / ${op.length}`:"–"};
  G._examT=Date.now();
  op.forEach(r=>{const it=r.it;const hits=kwHits(r.txt,it.kw);const n=h(`<div class="kq"><p class="q">${tpl(it.q)}</p><div class="small" style="white-space:pre-wrap;background:var(--bg);border-radius:8px;padding:8px 10px">${esc(r.txt||"(inget svar)")}</div><p class="small muted" style="margin:.4rem 0 0">Nyckelord: ${hits.filter(x=>x.hit).length} av ${hits.length}</p>${kwHTML(hits)}<div class="model"><span class="mono">Modellsvar (enligt boken)</span>${tpl(it.model||"")}</div>${rateHTML(null)}<div class="aislot"></div></div>`);
    $$(".rate button",n).forEach(b=>b.addEventListener("click",()=>{const q=+b.dataset.r;opR[it.id]=q;openRate(it.id,q,r.txt);$$(".rate button",n).forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));saveExam()}));
    getSample().then(s=>{if(s&&r.txt){const b=h(`<button class="btn ghost sm" type="button">Få feedback</button>`);b.addEventListener("click",()=>aiFeedback($(".aislot",n),it,r.txt));$(".aislot",n).before(b)}});
    opsBox.appendChild(n)});
  const wr=$(".wrong",v);const bad=mc.filter(r=>!r.ok||r.conf===0);
  if(!bad.length)wr.innerHTML=`<p>Inga fel och inga gissningar. Mycket bra!</p>`;
  bad.forEach(r=>{const q=r.it;wr.appendChild(h(`<div class="qq"><div class="qm"><span class="pill ${r.ok?"d":"n"}">${r.ok?"Rätt men gissat":r.conf===2?"Fel men säker":"Fel"}</span><a class="tag src" href="#${q.ch}">${esc(chLabel(q.ch))}</a></div><p class="t">${tpl(q.q)}</p><p style="margin:.2rem 0"><b>Rätt svar:</b> ${tpl(q.o[0])}</p><div class="why">${tpl(q.why||"")}${q.src?` <span class="tag src">${esc(q.src)}</span>`:""}</div></div>`))});
  saveExam();
  $("[data-a=again]",v).addEventListener("click",()=>route());
}

/* ---------- weak points ---------- */
VIEWS.svaga=async function(v){
  await ensureBank();
  const draw=()=>{const W=weakItems();
    const by={};W.forEach(w=>{(by[w.it.ch]=by[w.it.ch]||[]).push(w)});
    v.innerHTML=`<h1>Mina svaga punkter</h1><p class="muted">Här hamnar frågor du svarat fel på, rätt svar du bara gissade, kort som inte sitter och Kan du-frågor du inte kunde. Farligast är <b>fel svar där du var säker</b>, så de står först.</p>
     ${W.length?`<div class="row"><button class="btn acc" type="button" id="go">Öva de ${Math.min(30,W.length)} viktigaste</button><span class="small muted">${W.length} punkter totalt</span></div>`:`<div class="empty">Inga svaga punkter ännu. Gör ett pass eller ett quiz, så fyller guiden i den här listan.</div>`}
     ${CH.filter(c=>by[c.id]).map(c=>`<h2 style="font-size:1.25rem;margin-top:22px">K${c.n} ${esc(c.t)} <span class="mono">${by[c.id].length}</span></h2><div class="weak">${by[c.id].map(w=>{const it=w.it;const q=it.kind==="card"?it.f:it.q;const a=it.kind==="card"?it.b:it.kind==="mc"?it.o[0]:(it.model||it.a||"");
       return`<div class="wi"><span class="q">${tpl(q)}</span><span class="pill ${w.sev===3?"n":w.sev===2?"n":"d"}">${esc(w.why)}</span><details class="a"><summary>Visa svaret</summary>${tpl(a)}</details></div>`}).join("")}</div>`).join("")}`;
    const go=$("#go",v);if(go)go.addEventListener("click",()=>runSession(v,W.slice(0,30).map(w=>w.it),{title:"Svaga punkter"}));
  };draw();G._soft=null;
};

/* ---------- quick overview ---------- */
VIEWS.snabb=async function(v,arg){
  await ensureBank();const B=G.bank;
  const mode=arg==="fem"?"fem":"kvall";
  if(mode==="fem"){
    const prov=B.cards.filter(c=>c.p);const pool=(prov.length>=15?prov:B.cards);
    const sorted=pool.slice().sort((a,b)=>{const sa=S.cards[a.id],sb=S.cards[b.id];return((sa?sa.b:0)-(sb?sb.b:0))||Math.random()-.5});
    v.innerHTML=`<div class="pnav"><a href="#snabb">Kvällen före</a><a href="#snabb.fem" class="on">5-minutersrepetition</a></div><h1>5 minuter</h1><p class="muted">Femton provviktiga kort, de svagaste först. Klockan går i fem minuter. Svara snabbt.</p><div class="row"><button class="btn acc" id="go" type="button">Starta</button></div>`;
    $("#go",v).addEventListener("click",()=>runSession(v,sorted.slice(0,15),{title:"5-minutersrepetition",time:300}));return;
  }
  const hide=!!G._snabbHide;
  let s=`<div class="pnav"><a href="#snabb" class="on">Kvällen före</a><a href="#snabb.fem">5-minutersrepetition</a></div><h1>Snabböversikt</h1><p class="muted">Det viktigaste från varje kapitel på en sida. Slå på "Dölj svaren" och testa dig: tryck på en svart ruta för att se vad som står där.</p>
   <div class="row"><button class="btn ${hide?"acc":"ghost"} sm" type="button" id="hid">${hide?"Visa allt":"Dölj svaren"}</button></div>`;
  CH.forEach(c=>{const q=B.snabb[c.id];if(!q)return;
    s+=`<h2 style="font-size:1.3rem;margin-top:24px"><a href="#${c.id}" style="color:inherit;text-decoration:none">K${c.n} ${esc(c.t)}</a></h2><div class="cheat hideable ${hide?"hid":""}">`;
    if(q.keys&&q.keys.length)s+=`<div><b>Kärnan</b><ul>${q.keys.map(k=>`<li>${hv(k)}</li>`).join("")}</ul></div>`;
    if(q.nums&&q.nums.length)s+=`<div><b>Siffror och namn</b><ul>${q.nums.map(([a,b])=>`<li><span class="hv">${tpl(a)}</span> ${tpl(b)}</li>`).join("")}</ul></div>`;
    if(q.chains&&q.chains.length)s+=`<div><b>Orsak och verkan</b><ul>${q.chains.map(ch=>`<li>${ch.map((x,i)=>i?`<span class="hv">${tpl(x)}</span>`:tpl(x)).join(" → ")}</li>`).join("")}</ul></div>`;
    if(q.traps&&q.traps.length)s+=`<div><b>Provfällor</b><ul>${q.traps.map(k=>`<li>${tpl(k)}</li>`).join("")}</ul></div>`;
    s+=`</div>`});
  v.innerHTML=s;
  $("#hid",v).addEventListener("click",()=>{G._snabbHide=!hide;route()});
  $$(".hv",v).forEach(x=>x.addEventListener("click",()=>{x.classList.remove("hv");x.style.background="var(--hl)"}));
};
function hv(k){/* text "A :: B" → A visible, B hideable */const p=String(k).split("::");return p.length>1?`${tpl(p[0])} <span class="hv">${tpl(p.slice(1).join("::"))}</span>`:tpl(k)}

/* ---------- glossary ---------- */
const SYN=[["cytoplasma","cellplasma","Bi2 bild 22"],["aquaporin","akvaporin, vattenkanal","s. 33 · film"],["kopplad transport","sekundär aktiv transport","PPT Transport"],["pinocytos med receptorer","receptormedierad (receptorförmedlad) endocytos","s. 36 · PPT Transport"],["peptidoglykan (s. 180)","peptidoglukan (s. 213)","boken"],["arkéer","arkebakterier","s. 184 bildtext"],["cyanobakterier","blågröna alger","s. 181 · Bi2"],["vakuol","cellsaftrum","Bi2 bild 25"],["stavbakterie","bacill","s. 180 · PPT Mikroorg."],["bakteriofag","fag","s. 185"],["Fleming","Flemming (bokens stavning)","s. 212"],["natrium-kaliumpumpen","Na⁺/K⁺-pumpen, Na/K-pumpen","s. 35 · PPT"],["endoplasmatiska nätverket","endoplasmatiskt retikulum, ER","s. 24"],["mitokondrien, kraftverket","platsen för cellandningen","Bi2 bild 22"]];
VIEWS.ord=async function(v){
  await ensureBank();const B=G.bank;
  const all=B.gloss.slice().sort((a,b)=>a.w.localeCompare(b.w,"sv"));
  const f=Object.assign({q:"",ch:"all"},G._of||{});
  v.innerHTML=`<h1>Ordlista</h1><p class="muted">${all.length} ord. Varje ord visar var det kommer ifrån.</p><div class="filters"><label style="flex:1 1 220px">Sök<input type="search" id="oq" placeholder="t.ex. osmos" value="${esc(f.q)}" autocomplete="off"></label><label>Kapitel<select id="och">${selOpts(CH_OPTS(),f.ch)}</select></label></div><dl class="gl-list" id="ol"></dl>
  <h2 style="font-size:1.3rem;margin-top:26px">Samma sak, olika namn</h2><p class="muted small">Boken, läraren och filmerna använder ibland olika ord för samma sak. Alla kan dyka upp på provet.</p>
  <table class="cmp"><tr><th>Boken</th><th>Också kallat</th><th>Var</th></tr>${SYN.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td><span class="tag src">${r[2]}</span></td></tr>`).join("")}</table>`;
  hydrate(v,{},"ord");
  const draw=()=>{G._of=f;const q=norm(f.q);const list=all.filter(g=>(f.ch==="all"||g.ch===f.ch)&&(!q||norm(g.w).includes(q)||norm(plain(g.d)).includes(q)));
    $("#ol",v).innerHTML=list.length?list.map(g=>`<div><dt>${esc(g.w)}</dt><dd>${tpl(g.d)}</dd><div class="gm"><a class="tag src" href="#${g.ch}">${esc(chLabel(g.ch))}</a>${g.src?`<span class="tag src">${esc(g.src)}</span>`:""}${g.lek?'<span class="tag lek">Från lektionen</span>':""}${g.extra?'<span class="tag extra">Extra</span>':""}</div></div>`).join(""):`<div class="empty">Inget ord matchar.</div>`};
  $("#oq",v).addEventListener("input",e=>{f.q=e.target.value;draw()});$("#och",v).addEventListener("change",e=>{f.ch=e.target.value;draw()});draw();
};

/* ---------- study plan ---------- */
VIEWS.plan=async function(v){
  await ensureBank();
  const draw=()=>{const t=today();const ex=examDay();
    let s=`<h1>Studieplan</h1><p class="muted">Ange provdatumet. Markera ett kapitel som läst när du har gått igenom det, så lägger planen in repetition efter 1, 3 och 7 dagar. Varje dag finns också Dagens pass.</p>
    <div class="card"><div class="filters"><label>Provdatum<input type="date" id="pd" value="${esc(S.plan.exam||"")}"></label><label>Nya kort per dag<select id="pnp">${selOpts([["10","10"],["15","15"],["25","25"],["40","40"],["60","60"]],String(S.set.newPer||25))}</select></label></div></div>`;
    s+=`<h2 style="font-size:1.3rem;margin-top:20px">Kapitlen</h2><div class="weak">${CH.map(c=>{const st=S.ch[c.id]||{};const pr=chProgress(c.id);return`<div class="wi"><span class="q"><a href="#${c.id}">K${c.n} ${esc(c.t)}</a> <span class="mono">${pr} %</span></span><span>${st.read?`<span class="pill k">Läst ${fmtDay(st.read)}</span> <button class="btn ghost sm" type="button" data-un="${c.id}">Ångra</button>`:`<button class="btn sm" type="button" data-rd="${c.id}">Läst idag</button>`}</span></div>`}).join("")}</div>`;
    if(ex==null)s+=`<div class="empty" style="margin-top:16px">Välj provdatum ovan, så räknar guiden ut en plan dag för dag.</div>`;
    else if(ex<t)s+=`<div class="empty" style="margin-top:16px">Provdatumet har passerat. Välj ett nytt datum om du ska plugga till ett nytt prov.</div>`;
    else{const days=planDays(t,ex);s+=`<h2 style="font-size:1.3rem;margin-top:20px">Dag för dag</h2><div class="card">${days.map(dd=>`<div class="planday ${dd.d===t?"today":""}"><div class="d"><b>${dd.d===t?"Idag":dd.d===ex?"Provdag":fmtDay(dd.d)}</b>${dd.d===ex?"":ex-dd.d+" dagar kvar"}</div><div>${dd.tasks.map(tk=>{const key=dd.d+"|"+tk.k;return`<label><input type="checkbox" data-k="${esc(key)}" ${S.plan.done[key]?"checked":""}><span>${tk.html}</span></label>`}).join("")}</div></div>`).join("")}</div>`}
    v.innerHTML=s;
    $("#pd",v).addEventListener("change",e=>{S.plan.exam=e.target.value;S.plan.t=Date.now();save();draw()});
    $("#pnp",v).addEventListener("change",e=>{S.set.newPer=+e.target.value;S.set.t=Date.now();save()});
    $$("[data-rd]",v).forEach(b=>b.addEventListener("click",()=>{const o=S.ch[b.dataset.rd]||{};o.read=today();S.ch[b.dataset.rd]=stamp(o);save();draw()}));
    $$("[data-un]",v).forEach(b=>b.addEventListener("click",()=>{const o=S.ch[b.dataset.un]||{};delete o.read;S.ch[b.dataset.un]=stamp(o);save();draw()}));
    $$("input[data-k]",v).forEach(cb=>cb.addEventListener("change",()=>{S.plan.done[cb.dataset.k]=cb.checked;S.plan.t=Date.now();save()}));
  };draw();G._soft=null;
};
function planDays(t,ex){
  const days=[];const unread=CH.filter(c=>!(S.ch[c.id]||{}).read);
  const studyDays=Math.max(1,ex-t-2);const perDay=Math.ceil(unread.length/studyDays);
  const readOn={};CH.forEach(c=>{const r=(S.ch[c.id]||{}).read;if(r!=null)readOn[c.id]=r});
  let ui=0;
  for(let d=t;d<=ex;d++){const tasks=[];const left=ex-d;
    if(left>=2){for(let k=0;k<perDay&&ui<unread.length;k++){const c=unread[ui++];readOn[c.id]=d;tasks.push({k:"read-"+c.id,html:`Läs <a href="#${c.id}">K${c.n} ${esc(c.t)}</a>: förtest, text, bilder i Testa dig-läge, Kan du och Förklara för en kompis`})}}
    CH.forEach(c=>{const r=readOn[c.id];if(r==null)return;[1,3,7].forEach(k=>{if(r+k===d&&d<ex)tasks.push({k:"rep"+k+"-"+c.id,html:`Repetera <a href="#pass.${c.id}">K${c.n}</a> (dag ${k}): ett pass för kapitlet`})})});
    if(d<ex)tasks.push({k:"pass",html:`<a href="#pass">Dagens pass</a>, ca 20 min`});
    if(left===2)tasks.push({k:"prov40",html:`<a href="#prov">Provsimulator</a> med 40 frågor och 3 öppna, alla kapitel`},{k:"svaga",html:`Gå igenom <a href="#svaga">Mina svaga punkter</a>`});
    if(left===1)tasks.push({k:"snabb",html:`Läs <a href="#snabb">Snabböversikten</a> med "Dölj svaren"`},{k:"jamfor",html:`<a href="#jamfor">Stora jämförelsen</a> i testläge`},{k:"prov20",html:`Ett kort <a href="#prov">prov</a> med 20 frågor`});
    if(left===0)tasks.push({k:"fem",html:`<a href="#snabb.fem">5-minutersrepetition</a> på morgonen. Lycka till!`});
    days.push({d,tasks});
  }
  return days;
}

/* ---------- Sparat ---------- */
VIEWS.sparat=async function(v){
  await ensureBank();
  const draw=()=>{const list=Object.entries(S.sv||{}).filter(([id,x])=>x&&x.on).sort((a,b)=>(CH.findIndex(c=>c.id===a[1].ch)-CH.findIndex(c=>c.id===b[1].ch))||((b[1].t||0)-(a[1].t||0)));
    const items=list.map(([id])=>G.bank.byId[id]).filter(Boolean);
    let s=`<h1>Sparat</h1><p class="muted">Allt du har sparat. Tryck på ☆ vid ett avsnitt, en ruta, en bild, en tabell, en simulering, en övning, ett kort eller en fråga. Du kan också markera vilken text som helst och trycka på "Spara markeringen". Sparade frågor och kort kan du öva på här.</p>
     ${items.length?`<div class="row"><button class="btn acc" type="button" id="go">Öva ${plural(items.length,"sparad fråga eller kort","sparade frågor och kort")}</button></div>`:""}`;
    if(!list.length)s+=`<div class="empty">Inget sparat ännu. Tryck på ☆ vid något du tycker är viktigt.</div>`;
    let last="";list.forEach(([id,x])=>{if(x.ch!==last){last=x.ch;s+=`<h2 style="font-size:1.25rem;margin-top:22px"><a href="#${x.ch}" style="color:inherit;text-decoration:none">${esc(chLabel(x.ch))}</a></h2>`}
      const it=G.bank.byId[id];
      const go=x.ch&&CHM[x.ch]?`<a class="small" href="#${x.ch}${x.sec?"."+x.sec:""}">Gå till avsnittet →</a>`:"";
      if(x.k==="tx")s+=`<div class="box key"><div class="bh">Markerad text${x.h?" · "+esc(x.h):""} ${starBtn(id,{})}</div><p style="white-space:pre-wrap">${esc(x.txt||"")}</p>${go}</div>`;
      else if(x.k==="tb")s+=`<div class="savebar"><span class="mono">${esc(x.h||"Tabell")}</span>${starBtn(id,{})}</div><div class="tscroll">${x.html||""}</div><p>${go}</p>`;
      else if(x.k==="f")s+=`<div class="savebar"><span class="mono">Bild</span>${starBtn(id,{})}</div><div class="lfig-h" data-fig="${esc(x.fig)}" data-ch="${esc(x.ch)}"></div><p>${go}</p>`;
      else if(x.k==="s"||x.k==="l")s+=`<div class="weak"><div class="wi"><span class="q">${esc(x.h||"Avsnitt")}</span>${starBtn(id,{})}<span class="a">${go}</span></div></div>`;
      else if(x.k==="b"&&x.html)s+=`<div class="box key" style="position:relative"><div class="bh">${esc(x.h||"Faktaruta")} ${starBtn(id,{})}</div>${x.html.replace(/<div class="bh">[\s\S]*?<\/div>/,"")}</div>`;
      else if(it){const q=it.kind==="card"?it.f:it.q;const a=it.kind==="card"?it.b:it.kind==="mc"?it.o[0]:(it.model||it.a||"");
        s+=`<div class="weak"><div class="wi"><span class="q">${tpl(q)}</span>${starBtn(id,{})}<details class="a"><summary>Visa svaret</summary>${tpl(a)}${it.why?`<p class="small muted">${tpl(it.why)}</p>`:""}</details></div></div>`}});
    v.innerHTML=s;const go=$("#go",v);if(go)go.addEventListener("click",()=>runSession(v,shuffle(items),{title:"Sparat"}));
    $$(".lfig-h[data-ch]",v).forEach(async el=>{try{await ensureCh(el.dataset.ch);const d=G.data[el.dataset.ch];const fig=d&&d.figs&&d.figs[el.dataset.fig];if(fig)renderFig(el,fig,el.dataset.fig,el.dataset.ch);else el.remove()}catch(e){el.remove()}});
  };draw();G._soft=draw;
};
/* ---------- tools: comparison, threads, timeline, concept maps, crossword, worksheets, about ---------- */

/* ===== Stora jämförelsen ===== */
const CMP_COLS=[["djur","Djurcell"],["vaxt","Växtcell"],["svamp","Svampcell"],["prot","Encellig eukaryot"],["bakt","Bakterie"],["ark","Arké"],["vir","Virus"]];
/* cell: [text, class y|n|p, src] */
const CMP_ROWS=[
  {r:"Är det en cell?",c:{djur:["Ja, eukaryot cell","y","K2"],vaxt:["Ja, eukaryot cell","y","K2"],svamp:["Ja, eukaryot (t.ex. jäst, mögel)","y","s. 178"],prot:["Ja, en hel organism i en enda cell","y","s. 178"],bakt:["Ja, prokaryot cell","y","s. 180"],ark:["Ja, prokaryot cell","y","s. 180, 184"],vir:["Nej. En bit arvsanlag i ett proteinhölje, som behöver en levande cell","n","s. 184"]}},
  {r:"Cellkärna",c:{djur:["Ja, med dubbelt kärnmembran","y","s. 22"],vaxt:["Ja","y","s. 244"],svamp:["Ja","y","K2"],prot:["Ja","y","s. 178"],bakt:["Nej. DNA ligger fritt i cytoplasman","n","s. 180"],ark:["Nej","n","s. 180"],vir:["Nej","n","s. 184"]}},
  {r:"Organeller med membran",c:{djur:["Ja: ER, golgi, lysosomer, mitokondrier …","y","s. 21–27"],vaxt:["Ja, plus kloroplaster och stor vakuol","y","s. 244–247"],svamp:["Ja","y","K2"],prot:["Ja","y","s. 178"],bakt:["Nej","n","s. 180"],ark:["Nej","n","s. 180"],vir:["Nej","n","s. 184"]}},
  {r:"Cellmembran",c:{djur:["Ja, fosfolipider + kolesterol","y","s. 17–18"],vaxt:["Ja, innanför cellväggen","y","s. 244"],svamp:["Ja","y","K2"],prot:["Ja","y","K2"],bakt:["Ja, kemiskt som hos eukaryoter","y","s. 180"],ark:["Ja, men fosfolipiderna skiljer sig kraftigt kemiskt","p","s. 184"],vir:["Nej. Vissa har ett membranhölje från värdcellen","p","s. 185"]}},
  {r:"Cellvägg",c:{djur:["Nej. Extracellulär matrix i stället","n","s. 20–21"],vaxt:["Ja, av cellulosa","y","s. 244"],svamp:["Ja {{extra}} (av kitin)","y","Extra"],prot:["Varierar: amöban saknar, alger har","p","s. 178"],bakt:["Ja, av peptidoglykan (tjock hos Gr+, tunn hos Gr−)","y","s. 180"],ark:["Ja, men av annat material än bakteriernas {{lek}}","p","PPT Mikroorg. bild 37"],vir:["Nej. Proteinhölje","n","s. 184"]}},
  {r:"Yttre membran med LPS",c:{djur:["Nej","n",""],vaxt:["Nej","n",""],svamp:["Nej","n",""],prot:["Nej","n",""],bakt:["Bara gramnegativa","p","s. 180"],ark:["Nej","n",""],vir:["Nej","n",""]}},
  {r:"Ribosomer",c:{djur:["Ja, fria och på RER","y","s. 23–24"],vaxt:["Ja","y","s. 245"],svamp:["Ja","y","K2"],prot:["Ja","y","K2"],bakt:["Ja, av bakterietyp","y","s. 181"],ark:["Ja","y","K10"],vir:["Nej. Använder värdcellens ribosomer","n","s. 184"]}},
  {r:"Mitokondrier",c:{djur:["Ja, flest i muskelceller","y","s. 27"],vaxt:["Ja, även växtceller","y","s. 245"],svamp:["Ja","y","K2"],prot:["Ja","y","K2"],bakt:["Nej","n","s. 180"],ark:["Nej","n","s. 180"],vir:["Nej","n",""]}},
  {r:"Kloroplaster",c:{djur:["Nej","n","s. 244"],vaxt:["Ja, i de gröna delarna","y","s. 246–247"],svamp:["Nej","n","K2"],prot:["Alger har","p","s. 247"],bakt:["Nej. Cyanobakterier gör ändå fotosyntes","p","s. 181"],ark:["Nej","n",""],vir:["Nej","n",""]}},
  {r:"Stor vakuol",c:{djur:["Nej, bara små vakuoler","n","s. 245"],vaxt:["Ja, upp till 90 % av volymen","y","s. 245"],svamp:["–","p",""],prot:["–","p",""],bakt:["Nej","n",""],ark:["Nej","n",""],vir:["Nej","n",""]}},
  {r:"Lysosomer och centrioler",c:{djur:["Ja","y","s. 21, 244"],vaxt:["Nej. Vakuolen gör lysosomens jobb","n","s. 244–246"],svamp:["–","p",""],prot:["–","p",""],bakt:["Nej","n",""],ark:["Nej","n",""],vir:["Nej","n",""]}},
  {r:"Arvsmassa",c:{djur:["DNA i kärnan (kromatin) + ringformat DNA i mitokondrien","y","s. 22, 27"],vaxt:["DNA i kärnan + ringformat DNA i mitokondrier och kloroplaster","y","s. 247"],svamp:["DNA i kärnan","y","K2"],prot:["DNA i kärnan","y","K2"],bakt:["En ringformad kromosom + ofta plasmider","y","s. 182"],ark:["DNA, ingen kärna","y","s. 184"],vir:["DNA eller RNA, enkel- eller dubbelsträngat","p","s. 185"]}},
  {r:"Plasmider",c:{djur:["Nej","n",""],vaxt:["Nej","n",""],svamp:["–","p",""],prot:["–","p",""],bakt:["Ja, ofta. Bär t.ex. resistensgener","y","s. 182"],ark:["–","p",""],vir:["Nej","n",""]}},
  {r:"Egen ämnesomsättning",c:{djur:["Ja","y",""],vaxt:["Ja, fotoautotrof","y","s. 244"],svamp:["Ja","y",""],prot:["Ja","y",""],bakt:["Ja","y","PPT Mikroorg. bild 28"],ark:["Ja","y",""],vir:["Nej","n","s. 184"]}},
  {r:"Förökning",c:{djur:["Celldelning","y","s. 22"],vaxt:["Celldelning","y",""],svamp:["Celldelning","y",""],prot:["Delning","y",""],bakt:["Delning, var 20:e min till 1–3 h","y","PPT Mikroorg. bild 28"],ark:["Delning","y",""],vir:["Värdcellen tillverkar nya virus","p","s. 185"]}},
  {r:"Storlek",c:{djur:["–","p",""],vaxt:["–","p",""],svamp:["Jäst: mikroskopisk","p","s. 178"],prot:["Mikroskopisk","p","s. 178"],bakt:["Några tiondels till något tiotal µm","p","s. 180"],ark:["Som bakterier","p","s. 184"],vir:["20 nm till 1 µm","p","s. 185"]}},
  {r:"Påverkas av antibiotika?",c:{djur:["Nej, relativt oskadda","n","s. 212"],vaxt:["–","p",""],svamp:["Nej","n","s. 212"],prot:["Nej","n",""],bakt:["Ja","y","s. 212"],ark:["Tycks resistenta mot de flesta {{lek}}","n","PPT Mikroorg. bild 37"],vir:["Nej {{lek}}","n","PPT Antibiotika bild 3"]}},
  {r:"Exempel",c:{djur:["Muskelcell, levercell, röd blodkropp","p","s. 21"],vaxt:["Bladcell med kloroplaster","p","s. 247"],svamp:["Jäst, mögel, Candida","p","s. 178"],prot:["Amöba, toffeldjur, Plasmodium","p","s. 178–179"],bakt:["E. coli, stafylokocker, cyanobakterier","p","s. 181, 215"],ark:["Halofiler, termofiler, Sulfolobus","p","s. 184"],vir:["Herpesvirus, bakteriofager","p","s. 185"]}}
];
VIEWS.jamfor=function(v){
  v.className="view wide";
  const st=G._cmp||(G._cmp={mode:"test",cols:CMP_COLS.map(c=>c[0]),shown:{},guess:{}});
  const draw=()=>{
    const cols=CMP_COLS.filter(c=>st.cols.includes(c[0]));
    const tot=CMP_ROWS.length*cols.length;const shown=CMP_ROWS.reduce((s,r,ri)=>s+cols.filter(c=>st.shown[ri+"|"+c[0]]).length,0);
    const gOk=Object.values(st.guess).filter(x=>x===1).length,gAll=Object.keys(st.guess).length;
    v.innerHTML=`<h1>Stora jämförelsen</h1><p class="muted">Sju sorters "fabriker". I testläget är rutorna dolda. Tryck på en ruta, gissa <b>Ja</b>, <b>Nej</b> eller <b>Delvis</b>, och se svaret. Gröna kanter = ja, röda = nej, gula = delvis eller varierar.</p>
     <div class="row"><div class="seg" role="group" aria-label="Läge"><button type="button" data-m="test" aria-pressed="${st.mode==="test"}">Testa dig</button><button type="button" data-m="show" aria-pressed="${st.mode==="show"}">Visa allt</button></div>
     <button class="btn ghost sm" type="button" id="cmpReset">Dölj alla igen</button><span class="small muted">${st.mode==="test"?`${shown} av ${tot} visade · gissat rätt ${gOk} av ${gAll}`:""}</span></div>
     <div class="chips" style="margin:6px 0 4px">${CMP_COLS.map(([k,n])=>`<button type="button" class="chip" data-c="${k}" aria-pressed="${st.cols.includes(k)}">${n}</button>`).join("")}</div>
     <p class="small muted" style="margin:.2rem 0 0">Välj kolumner för att jämföra två eller tre åt gången.</p>
     <div class="cmpgrid"><table><thead><tr><th class="rh"></th>${cols.map(c=>`<th>${c[1]}</th>`).join("")}</tr></thead><tbody>
     ${CMP_ROWS.map((r,ri)=>`<tr><th class="rh">${esc(r.r)}</th>${cols.map(c=>{const [t,cl,src]=r.c[c[0]]||["–","p",""];const key=ri+"|"+c[0];const hid=st.mode==="test"&&!st.shown[key];const g=st.guess[key];
       return`<td data-k="${key}" class="${hid?"hid":cl}${g===1?" guessok":g===0?" guessno":""}" tabindex="0">${hid?"":tpl(t)+(src?` <span class="tag src">${esc(src)}</span>`:"")}</td>`}).join("")}</tr>`).join("")}
     </tbody></table></div>
     <div class="box link"><p>Detaljerna finns i kapitlen: {{go:k2|K2 Tre sorters celler}}, {{go:k4|K4 Organellerna}}, {{go:k8|K8 Bakterier}}, {{go:k10|K10 Arkéer och virus}} och {{go:k13|K13 Växtcellen}}. Rutor utan källa är slutsatser av kapitlens text. Streck betyder att ditt material inte säger något.</p></div>`;
    hydrate(v,{},"jamfor");
    $$(".seg button",v).forEach(b=>b.addEventListener("click",()=>{st.mode=b.dataset.m;draw()}));
    $("#cmpReset",v).addEventListener("click",()=>{st.shown={};st.guess={};st.mode="test";draw()});
    $$(".chip[data-c]",v).forEach(b=>b.addEventListener("click",()=>{const k=b.dataset.c;st.cols=st.cols.includes(k)?st.cols.filter(x=>x!==k):st.cols.concat(k);if(!st.cols.length)st.cols=[k];st.cols=CMP_COLS.map(c=>c[0]).filter(x=>st.cols.includes(x));draw()}));
    $$("td.hid",v).forEach(td=>{const open=()=>{if(td.querySelector(".gs"))return;td.classList.remove("hid");td.innerHTML=`<span class="gs" style="display:flex;flex-wrap:wrap;gap:3px"><button type="button" class="chip" data-g="y">Ja</button><button type="button" class="chip" data-g="n">Nej</button><button type="button" class="chip" data-g="p">Delvis</button></span>`;
        $$("[data-g]",td).forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();const key=td.dataset.k;const [ri,ck]=key.split("|");const cell=CMP_ROWS[+ri].c[ck]||["–","p",""];st.shown[key]=1;if(cell[0]!=="–")st.guess[key]=b.dataset.g===cell[1]?1:0;draw()}))};
      td.addEventListener("click",open);td.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open()}})});
  };draw();
};

/* ===== Röda trådar ===== */
VIEWS.trad=async function(v,arg){
  await ensureBank();const stops=(G.STOPS||[]);
  const order=id=>CH.findIndex(c=>c.id===id);
  if(!THREADS[arg]){
    v.innerHTML=`<h1>Röda trådar</h1><p class="muted">Åtta idéer som går igen i flera kapitel. När du ser samma idé på flera ställen hänger kunskapen ihop, och det är lättare att resonera på provet. Varje tråd har en egen färg och symbol i hela guiden.</p>
    <div class="grid2" style="margin-top:14px">${Object.entries(THREADS).map(([k,t])=>{const n=stops.filter(s=>s.t===k);const chs=[...new Set(n.map(s=>s.ch))].sort((a,b)=>order(a)-order(b));const cards=G.bank?G.bank.cards.filter(c=>(c.t||[]).includes(k)).length:0;
      return`<a class="tile" href="#trad.${k}" style="border-left:5px solid ${t.c}"><b style="color:${t.c};display:flex;align-items:center;gap:6px"><span style="width:18px;height:18px;display:inline-block">${ICON[k]}</span>${esc(t.n)}</b><span>${esc(t.d)}</span><span style="display:block;margin-top:6px;font-family:var(--f-mono);font-size:.72rem">${chs.map(c=>"K"+CHM[c].n).join(" · ")||"–"} · ${cards} kort</span></a>`}).join("")}</div>`;
    return;
  }
  const t=THREADS[arg];const list=stops.filter(s=>s.t===arg).sort((a,b)=>order(a.ch)-order(b.ch));
  const items=G.bank?G.bank.cards.concat(G.bank.mc).filter(x=>(x.t||[]).includes(arg)):[];
  v.innerHTML=`<p><a href="#trad">← Alla trådar</a></p><h1 style="color:${t.c};display:flex;gap:12px;align-items:center"><span style="width:40px;height:40px;display:inline-block;flex:none">${ICON[arg]}</span>${esc(t.n)}</h1>
   <p class="lead" style="font-size:1.1rem">${esc(t.d)}</p>
   <div class="row"><button class="btn acc" type="button" id="go" ${items.length?"":"disabled"}>Öva tråden: ${items.length} kort och frågor</button></div>
   <h2 style="font-size:1.3rem;margin-top:18px">Tråden genom kapitlen</h2>
   <ol class="tstops" style="--tc:${t.c}">${list.length?list.map(s=>`<li><span class="m">K${CHM[s.ch].n} ${esc(CHM[s.ch].t)}</span><h3 style="margin:.2rem 0 .3rem;font-size:1.05rem">${esc(s.h||"")}</h3><div>${tpl(s.html)}</div><a href="#${s.ch}.${s.sec}">Läs i kapitlet →</a></li>`).join(""):`<li>Inga stopp hittades ännu.</li>`}</ol>`;
  const go=$("#go",v);if(go)go.addEventListener("click",()=>runSession(v,interleave(items).slice(0,40),{title:"Tråden: "+t.n}));
};

/* ===== Tidslinje ===== */
const TL_DEEP=[
  {y:"3,5–4 miljarder år sedan",t:"De första bakterierna",d:"Nutida bakterier härstammar från jordens mest ursprungliga livsformer. Bakterierna grenade av först i livets träd.",s:"{{lek:Mikroorganismer bild 20–21}}"},
  {y:"ca 3 miljarder år sedan",t:"Cyanobakterier syresätter atmosfären",d:"Cyanobakterier gör fotosyntes och bildar syre. De syresatte troligen atmosfären.",s:"{{lek:Mikroorganismer bild 33–34}}"},
  {y:"Senare (inget årtal i boken)",t:"Endosymbios: mitokondrien",d:"En bakterie slukas av den eukaryota cellens föregångare och börjar leva i symbios med den. Bevis: två membran, eget ringformat DNA, bakterieliknande ribosomer.",s:"{{src:s. 27}}"},
  {y:"Senare (inget årtal i boken)",t:"Endosymbios: kloroplasten",d:"Kloroplasten tros på samma sätt ha varit en fri organism som togs upp av en cell. Den har dubbla membran och eget ringformat DNA.",s:"{{src:s. 247}}"},
  {y:"Arkéerna",t:"Liknar kanske det första livet",d:"Boken föreslår att arkéer, som klarar extrema miljöer, kan vara den livsform som mest påminner om det första livet på jorden.",s:"{{src:s. 184}}"}
];
const TL_NEAR=[
  {y:"1881",t:"Alexander Fleming föds",d:"Brittisk forskare. Boken stavar namnet Flemming.",s:"{{src:s. 212}}"},
  {y:"Början av 1900-talet",t:"Sista malariasmittan i Sverige",d:"Den senaste personen i Sverige smittades genom ett myggbett i början av 1900-talet.",s:"{{src:s. 179}}"},
  {y:"1928",t:"Fleming upptäcker penicillinet",d:"Efter en månads semester hade mögel vuxit i en näringsskål. Invid möglet hade bakterierna dött.",s:"{{extra}} årtalet; berättelsen {{src:s. 212}}"},
  {y:"Fram till 1930-talet",t:"Malaria norr om Medelhavet",d:"Malaria var vanlig norr om Medelhavet fram till 1930-talet.",s:"{{src:s. 179}}"},
  {y:"1940- och 50-talen",t:"De första antibiotika",d:"En revolution för sjukvården. Lunginflammation efter förkylning och infekterade operationssår blev lättbehandlade.",s:"{{src:s. 212}}"},
  {y:"1945",t:"Nobelpris",d:"Fleming, Howard Florey och Ernst Chain får Nobelpriset för penicillinet.",s:"{{extra}}"},
  {y:"1955",t:"Fleming dör",d:"Han hann se antibiotikans genombrott.",s:"{{src:s. 212}}"},
  {y:"1986",t:"Sverige förbjuder tillväxtantibiotika",d:"Antibiotika enbart för att djur ska växa snabbare förbjöds.",s:"{{extra}}"},
  {y:"2000-talet",t:"Tuberkulos resistent mot allt",d:"Stammar av tuberkulosbakterier som är resistenta mot alla antibiotika som kan användas börjar cirkulera.",s:"{{src:s. 215}}"},
  {y:"2006",t:"EU förbjuder tillväxtantibiotika",d:"Samma förbud gäller i hela EU.",s:"{{extra}}"},
  {y:"2010",t:"MRSA och ESBL i Sverige",d:"MRSA: 1 500 fall, varav bara 15 hade trängt djupt in i kroppen. ESBL: 5 000 fall, varav 200 infektioner på djupet.",s:"{{src:s. 215}}"},
  {y:"2020",t:"HPV-vaccin till alla barn",d:"I dag erbjuds vaccin mot papillomavirus till alla barn oavsett kön.",s:"{{extra}}"}
];
VIEWS.tidslinje=function(v){
  const ev=(e,deep)=>`<div class="ev ${deep?"deep":""}"><span class="y">${esc(e.y)}</span><h3 style="margin:.1rem 0 .2rem;font-size:1.05rem">${esc(e.t)}</h3><p style="margin:.1rem 0">${tpl(e.d)}</p><div>${tpl(e.s)}</div></div>`;
  v.innerHTML=`<h1>Tidslinjen</h1><p class="muted">Två tidsskalor: miljarder år för livets historia och några hundra år för människans kamp mot bakterierna. Testa dig själv i ordningsövningen längst ner.</p>
   <div class="grid2"><div><h2 style="font-size:1.3rem">Djup tid</h2><div class="tl">${TL_DEEP.map(e=>ev(e,1)).join("")}</div></div>
   <div><h2 style="font-size:1.3rem">Människans tid</h2><div class="tl">${TL_NEAR.map(e=>ev(e,0)).join("")}</div></div></div>
   <div class="x" data-x="tlOrd"></div><div class="x" data-x="tlMatch"></div>`;
  hydrate(v,{ex:{
    tlOrd:{ty:"order",h:"Lägg händelserna i tidsordning",items:["De första bakterierna","Cyanobakterier syresätter atmosfären","Fleming föds","Fleming upptäcker penicillinet","De första antibiotika används","Fleming dör","Tuberkulos resistent mot alla antibiotika"],why:"Bakterierna är flera miljarder år gamla. Antibiotikans tid är bara knappt hundra år."},
    tlMatch:{ty:"match",h:"Para ihop årtal och händelse",pairs:[["1881–1955","Fleming lever"],["1940- och 50-talen","de första antibiotika"],["Början av 1900-talet","sista malariasmittan i Sverige"],["2010","1 500 MRSA-fall i Sverige"],["3,5–4 miljarder år sedan","de första bakterierna"]]}
  }},"tl");
};

/* ===== Begreppskartor ===== */
const CMAPS={
  cell:{n:"Från molekyl till cell",vb:"0 0 480 440",nodes:[
    ["amino","Aminosyra",70,40],["prot","Protein",240,40],["ribo","Ribosom",410,40],
    ["nukl","Nukleotid",70,130],["dna","DNA i kärnan",240,130],["kol","Kolesterol",410,130],
    ["fos","Fosfolipid",70,220],["mem","Cellmembran",240,220],["mito","Mitokondrie",410,220],
    ["glu","Glukos",70,310],["atp","ATP",410,310],
    ["cell","Cellulosa",70,400],["vagg","Cellvägg",240,400]],
    links:["bygger upp","tillverkar","bär ritningen till","gör lagom flytande","bildar","driver","sitter i","kopplas ihop till","skyddar"],
    facit:[["amino","prot","bygger upp"],["ribo","prot","tillverkar"],["nukl","dna","bygger upp"],["dna","prot","bär ritningen till"],["fos","mem","bygger upp"],["kol","mem","gör lagom flytande"],["prot","mem","sitter i"],["mito","atp","bildar"],["glu","cell","kopplas ihop till"],["cell","vagg","bygger upp"],["atp","prot","driver"]]},
  trans:{n:"Membranet och transporten",vb:"0 0 480 440",nodes:[
    ["diff","Diffusion",80,40],["grad","Koncentrations-|gradient",250,40],["akt","Aktiv transport",400,40],
    ["osm","Osmos",80,150],["und","Underlättad|diffusion",250,150],["atp","ATP",400,150],
    ["vat","Vatten",80,260],["kan","Kanalprotein",250,260],["pump","Na/K-pumpen",400,260],
    ["aqua","Aquaporin",80,380],["bar","Bärarprotein",250,380],["endo","Endocytos",400,380]],
    links:["är en form av","följer","går mot","kräver","är ett exempel på","sker genom","släpper igenom","är diffusion av"],
    facit:[["osm","diff","är en form av"],["osm","vat","är diffusion av"],["diff","grad","följer"],["akt","grad","går mot"],["akt","atp","kräver"],["pump","akt","är ett exempel på"],["und","kan","sker genom"],["und","bar","sker genom"],["aqua","vat","släpper igenom"],["und","diff","är en form av"],["endo","atp","kräver"]]},
  ab:{n:"Antibiotika och resistens",vb:"0 0 480 440",nodes:[
    ["pen","Penicillin",80,40],["enz","Enzym",250,40],["vagg","Cellvägg",400,40],
    ["gpos","Grampositiv",80,150],["pep","Peptidoglykan",250,150],["tet","Tetracyklin",400,150],
    ["bakt","Bakterie",80,260],["plas","Plasmid",250,260],["ribo","Ribosom",400,260],
    ["konj","Konjugation",80,380],["gen","Resistensgen",250,380],["sel","Selektion",400,380]],
    links:["blockerar","bygger","bygger upp","har tjockt lager av","bär","för över","har","gynnar bakterier med"],
    facit:[["pen","enz","blockerar"],["enz","vagg","bygger"],["pep","vagg","bygger upp"],["gpos","pep","har tjockt lager av"],["tet","ribo","blockerar"],["plas","gen","bär"],["konj","plas","för över"],["bakt","plas","har"],["sel","gen","gynnar bakterier med"],["bakt","ribo","har"]]}
};
VIEWS.karta=function(v,arg){
  const id=CMAPS[arg]?arg:"cell";const M=CMAPS[id];const key="karta."+id;
  const saved=(S.x[key]&&S.x[key].e)||[];let edges=saved.map(e=>e.slice());let sel=null,checked=false;
  v.innerHTML=`<h1>Begreppskartor</h1><div class="pnav">${Object.entries(CMAPS).map(([k,m])=>`<a href="#karta.${k}" class="${k===id?"on":""}">${esc(m.n)}</a>`).join("")}</div>
   <p class="muted">Bygg kartan själv: tryck på ett begrepp och sedan på ett annat, och välj vad som binder ihop dem. Tryck på en etikett på en linje för att ta bort den. Jämför sedan med facit.</p>
   <figure class="cmap" style="margin:0"><svg viewBox="${M.vb}" role="img" aria-label="Begreppskarta: ${esc(M.n)}"><g class="E"></g><g class="N"></g></svg></figure>
   <div class="card" id="pickBox" hidden style="margin-top:10px"><p style="margin:0 0 6px"><b id="pickTxt"></b></p><div class="chips" id="pickLinks"></div><div class="row"><button class="btn ghost sm" type="button" id="pickCancel">Avbryt</button></div></div>
   <div class="row"><button class="btn acc" type="button" id="cmChk">Jämför med facit</button><button class="btn ghost" type="button" id="cmClr">Börja om</button><span class="small muted" id="cmScore"></span></div><div id="cmFb"></div>`;
  const svg=$("svg",v),gE=$(".E",v),gN=$(".N",v);const N={};M.nodes.forEach(n=>N[n[0]]={id:n[0],l:n[1],x:n[2],y:n[3]});
  function nodeBox(n){const lines=n.l.split("|");const w=Math.max(...lines.map(s=>s.length))*7.8+20;const hh=lines.length*16+12;return{x:n.x-w/2,y:n.y-hh/2,w,h:hh}}
  function edgePts(a,b){const A=nodeBox(a),B=nodeBox(b);const cx=(p,bx,tx,ty)=>{const dx=tx-p.x,dy=ty-p.y;const sx=dx?Math.abs((bx.w/2)/dx):Infinity,sy=dy?Math.abs((bx.h/2)/dy):Infinity;const s=Math.min(sx,sy,1);return{x:p.x+dx*s,y:p.y+dy*s}};return[cx(a,A,b.x,b.y),cx(b,B,a.x,a.y)]}
  const same=(e,f)=>(e[0]===f[0]&&e[1]===f[1])||(e[0]===f[1]&&e[1]===f[0]);
  function draw(){gE.innerHTML="";gN.innerHTML="";
    const show=edges.map(e=>({e,st:checked?(M.facit.some(f=>same(e,f)&&f[2]===e[2])?"ok":M.facit.some(f=>same(e,f))?"half":"no"):""}));
    if(checked)M.facit.forEach(f=>{if(!edges.some(e=>same(e,f)))show.push({e:f,st:"miss"})});
    show.forEach(({e,st},i)=>{const a=N[e[0]],b=N[e[1]];if(!a||!b)return;const [p,q]=edgePts(a,b);
      sv("line",{x1:p.x,y1:p.y,x2:q.x,y2:q.y,class:"edge "+(st==="ok"||st==="half"?"ok":st==="no"?"no":st==="miss"?"miss":"")},gE);
      const mx=(p.x+q.x)/2,my=(p.y+q.y)/2;const t=sv("text",{x:mx,y:my-3,"text-anchor":"middle",class:"elbl halo"+(st==="ok"?" ok":""),style:"cursor:pointer"},gE);t.textContent=e[2]+(st==="half"?" (rätt par)":st==="miss"?" (saknas)":"");
      if(st!=="miss")t.addEventListener("click",()=>{if(checked)return;edges=edges.filter(x=>x!==e);persist();draw()})});
    Object.values(N).forEach(n=>{const b=nodeBox(n);const g=sv("g",{class:"node"+(sel===n.id?" sel":""),tabindex:"0",role:"button",style:"cursor:pointer"},gN);sv("rect",{x:b.x,y:b.y,width:b.w,height:b.h,rx:9},g);
      labelText(g,n.l,n.x,n.y-(n.l.split("|").length-1)*8+5,"m","");
      const act=()=>{if(checked)return;if(!sel){sel=n.id;draw()}else if(sel===n.id){sel=null;draw()}else{openPick(sel,n.id)}};
      g.addEventListener("click",act);g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();act()}})})}
  function openPick(a,b){const box=$("#pickBox",v);box.hidden=false;$("#pickTxt",v).textContent=`${N[a].l.replace("|","")} → ${N[b].l.replace("|","")}: vad binder ihop dem?`;
    const L=$("#pickLinks",v);L.innerHTML="";M.links.forEach(l=>{const c=h(`<button type="button" class="chip">${esc(l)}</button>`);c.addEventListener("click",()=>{edges=edges.filter(e=>!same(e,[a,b]));edges.push([a,b,l]);sel=null;box.hidden=true;persist();draw()});L.appendChild(c)});box.scrollIntoView({block:"nearest"})}
  $("#pickCancel",v).addEventListener("click",()=>{sel=null;$("#pickBox",v).hidden=true;draw()});
  function persist(){S.x[key]=stamp({e:edges,s:(S.x[key]||{}).s||0,m:M.facit.length});save()}
  $("#cmChk",v).addEventListener("click",()=>{checked=!checked;$("#cmChk",v).textContent=checked?"Fortsätt bygga":"Jämför med facit";
    if(checked){const ok=edges.filter(e=>M.facit.some(f=>same(e,f)&&f[2]===e[2])).length;const half=edges.filter(e=>M.facit.some(f=>same(e,f)&&f[2]!==e[2])).length;const wrong=edges.length-ok-half;
      $("#cmScore",v).textContent=`${ok} av ${M.facit.length} kopplingar helt rätt`;S.x[key]=stamp({e:edges,s:ok,m:M.facit.length});save();
      $("#cmFb",v).innerHTML=`<div class="why ${ok===M.facit.length?"ok":"no"}">Gröna linjer stämmer med facit${half?`, ${half} har rätt par men en annan etikett`:""}${wrong?`, ${wrong} finns inte i facit (röda, streckade)`:""}. Gula streckade linjer är kopplingar du saknar. Facit är inte den enda möjliga kartan: kan du motivera en annan koppling med boken är den också bra.</div>`}
    else{$("#cmScore",v).textContent="";$("#cmFb",v).innerHTML=""}draw()});
  $("#cmClr",v).addEventListener("click",()=>{edges=[];checked=false;$("#cmChk",v).textContent="Jämför med facit";$("#cmFb",v).innerHTML="";$("#cmScore",v).textContent="";persist();draw()});
  draw();
};

/* ===== Cellkrysset ===== */
const XW={rows:25,cols:24,sh:[[15,20]],e:[
 [1,"a",0,13,"RIBOSOMEN","I denna cellstruktur sker proteinsyntesen.",["RIBOSOMER"]],
 [5,"a",6,14,"CYTOPLASMA","Vätska som finns innanför cellmembranet.",["CELLPLASMA"]],
 [8,"a",9,7,"GLYKOKALYX","Det kolhydratlager som täcker en eukaryot cell och har en skyddande funktion."],
 [9,"a",11,0,"KOLESTEROL","Denna steroid finns i cellmembranet i djurceller och har som funktion att hålla det lagom flytande."],
 [11,"a",14,7,"LYSOSOMER","Dessa bildas i golgiapparaten och består av membranblåsor fyllda med enzymer och dessa organeller fungerar som cellens sopförbränningsanläggningar."],
 [12,"a",18,2,"MIKROFILAMENT","De tre typer av proteintrådar som bygger upp cellskelettet är mikrotubuli, intermediära filament och ___."],
 [13,"a",20,8,"GOLGIAPPARATEN","Här modifieras proteiner och knoppas av i blåsor som vandrar till cellmembranet."],
 [14,"a",23,10,"MITOKONDRIEN","Cellens kraftverk i vilken förbränningen äger rum.",["MITOKONDRIER"]],
 [2,"d",0,20,"ENDOPLASMATISKA NÄTVERKET","Membransystem som är ett förgrenat kanalsystem med vätska i. Det kan vara slätt eller kornigt."],
 [3,"d",2,22,"CELLMEMBRAN","Fungerar som avgränsning mot omvärlden och kontrollerar in- och uttransport av ämnen."],
 [4,"d",3,8,"NUKLEOL","Mörkfärgat parti i cellkärnan som bildas runt regioner på DNA som kodar för ribosomalt RNA."],
 [5,"d",6,14,"CELLSKELETTET","Till detta nätverk av proteintrådar är organellerna kopplade."],
 [6,"d",6,18,"PEROXISOMER","Membranblåsor i cellen som innehåller enzymer som behövs för att bryta ner och utvinna energi ur fettsyror."],
 [7,"d",8,2,"NUKLEOPLASMA","Geléliknande vätska som omsluts av kärnmembranet."],
 [9,"d",11,0,"KROMATIN","Den packningsnivå av DNA och proteiner som finns i cellkärnan."],
 [10,"d",14,4,"CELLKÄRNAN","Denna omges av ett dubbelt membran och innehåller det mesta av arvsmassan."]]};
VIEWS.korsord=function(v){
  const R=XW.rows,C=XW.cols;const sol={},num={},cellW={};const sh=new Set(XW.sh.map(x=>x[0]+","+x[1]));
  const W=XW.e.map(([n,d,r,c,ans,clue,alt],i)=>{const cells=[];for(let k=0;k<ans.length;k++){const rr=r+(d==="d"?k:0),cc=c+(d==="a"?k:0);const key=rr+","+cc;cells.push(key);if(ans[k]!==" ")sol[key]=ans[k];(cellW[key]=cellW[key]||[]).push(i)}num[r+","+c]=n;return{i,n,d,ans,clue,alt:alt||[],cells}});
  const st=S.x.korsord||{v:{}};const val=Object.assign({},st.v||{});
  let cur=null,dir="a",curW=null;
  v.className="view wide";
  v.innerHTML=`<h1>Cellkrysset</h1><p class="muted">Lärarens korsord om kapitel 1 (s. 17–27). Tryck på en ruta eller en ledtråd och skriv. Tryck på samma ruta igen för att byta riktning. Den grå rutan i 2 lodrätt är mellanrummet mellan två ord.</p>
   <div class="xwcur" id="xwCur">Välj en ledtråd.</div>
   <div class="xwwrap" style="position:relative"><div class="xw" id="xw"></div><input class="xwin" id="xwIn" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Skriv bokstav"></div>
   <div class="row"><button class="btn sm" type="button" id="xwChk">Rätta</button><button class="btn ghost sm" type="button" id="xwL">Visa en bokstav</button><button class="btn ghost sm" type="button" id="xwW">Visa ordet</button><button class="btn ghost sm" type="button" id="xwClr">Töm</button><span class="small muted" id="xwSc"></span></div>
   <div class="xwclues"><div><h3 style="margin-top:0">Vågrätt</h3><ol id="xwA"></ol></div><div><h3 style="margin-top:0">Lodrätt</h3><ol id="xwD"></ol></div></div>`;
  const grid=$("#xw",v),inp=$("#xwIn",v);
  const avail=Math.min(v.clientWidth||600,900);const cs=clamp(Math.floor((avail-8)/C),24,32);grid.style.setProperty("--cs",cs+"px");grid.style.gridTemplateColumns=`repeat(${C},${cs}px)`;
  for(let r=0;r<R;r++)for(let c=0;c<C;c++){const key=r+","+c;const d=document.createElement("div");
    if(cellW[key]){d.className="c"+(sh.has(key)?" sh":"");d.dataset.k=key;if(num[key])d.innerHTML=`<span class="nm">${num[key]}</span>`;d.appendChild(document.createElement("b"));
      if(!sh.has(key))d.addEventListener("click",()=>select(key,true))}
    grid.appendChild(d)}
  function cellEl(k){return grid.querySelector(`[data-k="${k}"]`)}
  function paint(){$$(".c",grid).forEach(d=>{const k=d.dataset.k;d.querySelector("b").textContent=sh.has(k)?"":(val[k]||"");d.classList.toggle("cur",k===cur);d.classList.toggle("inw",!!curW&&curW.cells.includes(k)&&k!==cur)});
    $$("#xwA li,#xwD li",v).forEach(li=>{const w=W[+li.dataset.i];li.classList.toggle("on",w===curW);li.classList.toggle("solved",solved(w))});
    $("#xwCur",v).innerHTML=curW?`<b>${curW.n} ${curW.d==="a"?"vågrätt":"lodrätt"}</b> (${curW.ans.replace(/ /g,"").length} bokstäver): ${esc(curW.clue)}`:"Välj en ledtråd."}
  function solved(w){return w.cells.every(k=>sh.has(k)||(val[k]||"")===sol[k])||w.alt.some(a=>w.cells.every((k,i)=>sh.has(k)||(val[k]||"")===a[i]))}
  function wordAt(key,d){const ws=(cellW[key]||[]).map(i=>W[i]);return ws.find(w=>w.d===d)||ws[0]}
  function select(key,tap){if(tap&&key===cur&&(cellW[key]||[]).length>1)dir=dir==="a"?"d":"a";cur=key;curW=wordAt(key,dir);dir=curW.d;inp.focus({preventScroll:true});paint();const el=cellEl(key);if(el)el.scrollIntoView({block:"nearest",inline:"nearest"})}
  function step(back){if(!curW)return;let i=curW.cells.indexOf(cur)+(back?-1:1);while(curW.cells[i]&&sh.has(curW.cells[i]))i+=back?-1:1;if(curW.cells[i]){cur=curW.cells[i];paint()}}
  function put(ch){if(!cur)return;val[cur]=ch;persist();step(false);paint()}
  function persist(){S.x.korsord=stamp({v:val,s:W.filter(solved).length,m:W.length});save();$("#xwSc",v).textContent=`${W.filter(solved).length} av ${W.length} ord lösta`}
  inp.addEventListener("input",()=>{const t=inp.value.toUpperCase().replace(/[^A-ZÅÄÖ]/g,"");inp.value="";if(t)put(t[t.length-1])});
  inp.addEventListener("keydown",e=>{if(e.key==="Backspace"){e.preventDefault();if(cur&&val[cur]){delete val[cur];persist();paint()}else{step(true);if(cur){delete val[cur];persist();paint()}}}
    else if(e.key==="ArrowRight"||e.key==="ArrowLeft"||e.key==="ArrowUp"||e.key==="ArrowDown"){e.preventDefault();const [r,c]=cur?cur.split(",").map(Number):[0,13];const m={ArrowRight:[0,1],ArrowLeft:[0,-1],ArrowUp:[-1,0],ArrowDown:[1,0]}[e.key];let rr=r+m[0],cc=c+m[1];while(rr>=0&&rr<R&&cc>=0&&cc<C&&(!cellW[rr+","+cc]||sh.has(rr+","+cc))){rr+=m[0];cc+=m[1]}if(cellW[rr+","+cc]){dir=m[0]?"d":"a";select(rr+","+cc)}}});
  ["a","d"].forEach(d=>{const ol=$(d==="a"?"#xwA":"#xwD",v);W.filter(w=>w.d===d).forEach(w=>{const li=h(`<li data-i="${w.i}"><b>${w.n}</b>${esc(w.clue)} <span class="mono">(${w.ans.replace(/ /g,"").length})</span></li>`);li.addEventListener("click",()=>{dir=w.d;const first=w.cells.find(k=>!sh.has(k)&&!val[k])||w.cells[0];cur=first;curW=w;inp.focus({preventScroll:true});paint();const el=cellEl(first);if(el)el.scrollIntoView({block:"center",inline:"center"})});ol.appendChild(li)})});
  $("#xwChk",v).addEventListener("click",()=>{$$(".c",grid).forEach(d=>{const k=d.dataset.k;d.classList.remove("ok","no");if(val[k]){const okAlt=(cellW[k]||[]).some(i=>{const w=W[i];return w.alt.some(a=>a[w.cells.indexOf(k)]===val[k])});d.classList.add(val[k]===sol[k]||okAlt?"ok":"no")}});persist()});
  $("#xwL",v).addEventListener("click",()=>{if(cur&&!sh.has(cur)){val[cur]=sol[cur];persist();paint()}else toast("Välj en ruta först.")});
  $("#xwW",v).addEventListener("click",()=>{if(!curW){toast("Välj en ledtråd först.");return}curW.cells.forEach(k=>{if(!sh.has(k))val[k]=sol[k]});persist();paint()});
  $("#xwClr",v).addEventListener("click",()=>{Object.keys(val).forEach(k=>delete val[k]);$$(".c",grid).forEach(d=>d.classList.remove("ok","no"));persist();paint()});
  persist();paint();
};

/* ===== Arbetsbladen ===== */
VIEWS.ab=async function(v){
  v.innerHTML=`<div class="loading">Laddar arbetsbladen…</div>`;
  await Promise.all([ensureCh("k5").catch(()=>{}),ensureCh("k8").catch(()=>{})]);
  const blocks=[["k5","abTransport","Arbetsblad: Transport över membran","Lucktext med 20 luckor om s. 31–38. Lärarens faktablad är facit."],["k8","abMikro","Arbetsblad: Mikroorganismernas värld","Lucktext med 36 luckor om s. 178–186 och lektionen."]];
  v.innerHTML=`<h1>Arbetsbladen</h1><p class="muted">Lärarens arbetsblad som digitala lucktexter. Skriv i luckorna och tryck Rätta. Små stavfel räknas som fel, så titta på facit om du är osäker. Dina svar sparas.</p>${blocks.map(([ch,x,t,d])=>`<h2 style="font-size:1.3rem;margin-top:22px">${t}</h2><p class="small muted">${d} Hör till <a href="#${ch}">${esc(chLabel(ch))}</a>.</p><div class="x" data-x="${x}" data-ch="${ch}"></div>`).join("")}`;
  $$(".x[data-ch]",v).forEach(x=>{const d=G.data[x.dataset.ch];const ex=d&&d.ex&&d.ex[x.dataset.x];if(ex)renderEx(x,ex,x.dataset.ch+"."+x.dataset.x);else x.outerHTML=`<div class="empty">Arbetsbladet finns inte i guiden ännu.</div>`});
};

/* ===== Om materialet ===== */
G.OM=`<p>Guiden bygger på tre sorters källor. <b>Boken</b> går alltid först. Lärarens <b>powerpoints</b> kommer sedan, och sist allt annat.</p>
<div class="grid2"><div class="card"><h3 style="margin-top:0">Boken (dina foton)</h3><ul class="small">
<li>Kapitel 1 Celler: s. 17–27 och s. 31–37</li><li>Kapitel 5 Mikroorganismer, infektioner och försvar: s. 178–186 och s. 212–215</li><li>Kapitel 7 Hur växter och svampar fungerar: s. 244–247</li></ul></div>
<div class="card"><h3 style="margin-top:0">Lärarens material (del 5)</h3><ul class="small">
<li>Bi2.pptx (32 bilder): livets kemi, celler, ATP och kreatin</li><li>Transport över membran.pptx (26 bilder)</li><li>Mikroorganismer.pptx (40 bilder)</li><li>Antibiotika.pptx (20 bilder)</li><li>Arbetsbladen om transport och mikroorganismer, faktabladet (som är facit till transportbladet) och korsordet Cellkrysset</li></ul></div></div>
<h2 style="font-size:1.3rem;margin-top:20px">Det som saknas</h2><ul>
<li><b>s. 37–38, "Spänning över cellmembranet":</b> fotot av s. 37 är avklippt under rubriken och s. 38 finns inte. Powerpointen om transport har ingen bild med den rubriken, men bild 16, 19 och 20 tar upp laddningen över membranet, natrium-kaliumpumpen och aktionspotentialen. Det står i K5 och är märkt "Från lektionen".</li>
<li><b>s. 187–211 och s. 216–243</b> finns inte bland fotona, och inget i powerpointerna motsvarar dem säkert. En del av Mikroorganismer-powerpointen (sjukdomar, endosporer, mat) kan höra till s. 187 och framåt.</li>
<li>Bokens sidor om <b>livets kemi</b> (före s. 17) finns inte heller. K1 bygger därför på Bi2-powerpointen.</li></ul>
<h2 style="font-size:1.3rem;margin-top:20px">Etiketterna</h2>
<p><span class="tag prov">Provviktigt</span> finns både i boken och i lärarens material. <span class="tag lek">Från lektionen</span> finns bara i lärarens material. <span class="tag diff">Boken och läraren skiljer sig</span> visar bokens version först. <span class="tag extra">Extra (inte i boken)</span> finns inte i ditt material.</p>`;

/* ===== Sök i guiden ===== */
function snip(text,q,n){const i=norm(text).indexOf(q);if(i<0)return null;const a=Math.max(0,i-60),b=Math.min(text.length,i+q.length+80);const t=text.slice(a,b);const j=i-a;return(a?"…":"")+esc(t.slice(0,j))+"<mark>"+esc(t.slice(j,j+q.length))+"</mark>"+esc(t.slice(j+q.length))+(b<text.length?"…":"")}
VIEWS.sok=async function(v,arg){
  v.innerHTML=`<h1>Sök i guiden</h1><p class="muted">Sök efter ett ord och se var det finns: ordlistan, kapitlens text, flashcards och frågor. Tryck på en träff för att gå dit.</p>
   <div class="filters"><label style="flex:1 1 260px">Sökord<input type="search" id="sq" placeholder="t.ex. plasmid, turgor, Fleming" autocomplete="off" value="${esc(G._sq||"")}"></label></div><div id="sr"><div class="loading">Laddar alla kapitel…</div></div>`;
  const inp=$("#sq",v);inp.focus();
  await ensureBank();await Promise.all(CH.map(c=>ensureCh(c.id).catch(()=>{})));
  if(!G._sidx){G._sidx=[];CH.forEach(c=>{const d=G.data[c.id];if(!d)return;(d.secs||[]).forEach(sec=>{G._sidx.push({ch:c.id,sec:sec.id,h:sec.h,t:plain(tpl(sec.html)).replace(/\s+/g," ")})})})}
  const draw=()=>{const q=norm(inp.value);G._sq=inp.value;const out=$("#sr",v);
    if(q.length<2){out.innerHTML=`<div class="empty">Skriv minst två bokstäver.</div>`;return}
    const gl=G.bank.gloss.filter(g=>norm(g.w).includes(q)||norm(plain(g.d)).includes(q)).slice(0,30);
    const secs=G._sidx.map(x=>{const n=norm(x.t).split(q).length-1;return n||norm(x.h).includes(q)?Object.assign({n},x):null}).filter(Boolean).sort((a,b)=>b.n-a.n).slice(0,40);
    const items=G.bank.cards.concat(G.bank.mc,G.bank.open).filter(x=>norm(plain(x.kind==="card"?x.f+" "+x.b:x.q+" "+(x.o?x.o[0]:"")+" "+(x.model||""))).includes(q)).slice(0,30);
    let s=`<p class="small muted">${gl.length} i ordlistan · ${secs.length} avsnitt · ${items.length}${items.length===30?"+":""} kort och frågor</p>`;
    if(gl.length)s+=`<h2 style="font-size:1.2rem">Ordlistan</h2><dl class="gl-list">${gl.map(g=>`<div><dt>${esc(g.w)}</dt><dd>${tpl(g.d)}</dd><div class="gm"><a class="tag src" href="#${g.ch}">${esc(chLabel(g.ch))}</a></div></div>`).join("")}</dl>`;
    if(secs.length)s+=`<h2 style="font-size:1.2rem;margin-top:18px">I kapitlen</h2><div class="weak">${secs.map(x=>`<a class="wi" style="text-decoration:none;color:inherit" href="#${x.ch}.${x.sec}"><span class="q">K${CHM[x.ch].n} · ${esc(x.h)}</span><span class="pill x">${x.n} träff${x.n===1?"":"ar"}</span><span class="a">${snip(x.t,q)||""}</span></a>`).join("")}</div>`;
    if(items.length)s+=`<h2 style="font-size:1.2rem;margin-top:18px">Kort och frågor</h2><div class="weak">${items.map(x=>{const a=x.kind==="card"?x.b:x.kind==="mc"?x.o[0]:(x.model||"");return`<div class="wi"><span class="q">${tpl(x.kind==="card"?x.f:x.q)}</span><a class="tag src" href="#${x.ch}">K${CHM[x.ch].n}</a><details class="a"><summary>Visa svaret</summary>${tpl(a)}</details></div>`}).join("")}</div>`;
    if(!gl.length&&!secs.length&&!items.length)s+=`<div class="empty">Inga träffar. Prova en kortare ordstam, t.ex. "osmo" i stället för "osmotisk".</div>`;
    out.innerHTML=s};
  let t=null;inp.addEventListener("input",()=>{clearTimeout(t);t=setTimeout(draw,180)});draw();
};
/* ---------- Cellatlasen: zoom organism → cell → organell → molekyl ---------- */
const AT={};
(function(){
const f=(c,o)=>`style="fill:var(${c})${o!=null?";fill-opacity:"+o:""}"`;
const st=(c,w,extra)=>`style="stroke:var(${c})" stroke-width="${w||2}" fill="none"${extra?" "+extra:""}`;
const fs=(fc,sc,w,o)=>`style="fill:var(${fc});stroke:var(${sc})${o!=null?";fill-opacity:"+o:""}" stroke-width="${w==null?2:w}"`;
function dots(pts,r,c){return pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${r}" ${f(c||"--ink")}/>`).join("")}
function hexRing(cx,cy,r){let s="";for(let i=0;i<6;i++){const a=Math.PI/3*i+Math.PI/6;s+=(i?"L":"M")+(cx+r*Math.cos(a)).toFixed(1)+" "+(cy+r*Math.sin(a)).toFixed(1)}return s+"Z"}
function bilayer(x0,x1,yTop,step,opts){opts=opts||{};let s="";const skip=opts.skip||[];
  for(let x=x0;x<=x1;x+=step){if(skip.some(([a,b])=>x>a&&x<b))continue;
    s+=`<circle cx="${x}" cy="${yTop}" r="${step*0.42}" ${f("--c-mem")}/><path d="M${x-2} ${yTop+4}v${opts.t||22}M${x+2} ${yTop+4}v${opts.t||22}" ${st("--muted",1.4)}/>`;
    s+=`<circle cx="${x}" cy="${yTop+2*(opts.t||22)+12}" r="${step*0.42}" ${f("--c-mem")}/><path d="M${x-2} ${yTop+2*(opts.t||22)+8}v-${opts.t||22}M${x+2} ${yTop+2*(opts.t||22)+8}v-${opts.t||22}" ${st("--muted",1.4)}/>`}
  return s}
function wavy(x0,y0,x1,y1,amp,n){let s=`M${x0} ${y0}`;const dx=(x1-x0)/n,dy=(y1-y0)/n;for(let i=1;i<=n;i++){const mx=x0+dx*(i-.5),my=y0+dy*(i-.5)+(i%2?-amp:amp);s+=` Q${mx.toFixed(1)} ${my.toFixed(1)} ${(x0+dx*i).toFixed(1)} ${(y0+dy*i).toFixed(1)}`}return s}
function lens(cx,cy,r){return `<circle cx="${cx}" cy="${cy}" r="${r}" ${fs("--paper","--ink",3,.35)}/><path d="M${cx+r*.7} ${cy+r*.7} l${r*.6} ${r*.6}" ${st("--ink",7,'stroke-linecap="round"')}/>`}

/* ===== scenes ===== */
const SC={};
/* --- organisms --- */
SC["djur.org"]={t:"Människan",vb:"0 0 520 340",d:"Människan är flercellig. Cellerna är specialister och bildar vävnader, som bildar organ. Tryck på förstoringsglaset för att zooma in på en cell.",
  svg:`<rect x="0" y="0" width="520" height="340" ${f("--bg")}/>
  <circle cx="200" cy="58" r="30" ${fs("--c-mito-soft","--ink",2.5)}/>
  <path d="M200 90 C150 95 140 110 135 170 L120 250 M200 90 C250 95 260 110 265 170 L282 250 M165 100 L170 190 L160 320 M235 100 L230 190 L240 320 M170 190 L230 190" ${st("--ink",3,'stroke-linecap="round"')}/>
  <path d="M168 100 h64 v92 h-64z" ${fs("--c-mito-soft","--ink",2.5)}/>
  <g data-k="cell"><circle cx="380" cy="170" r="70" ${fs("--c-cyto","--c-mem",3)}/>
   ${[[350,150],[385,140],[415,165],[360,190],[395,200],[345,175],[410,195],[378,170]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="15" ${fs("--c-nuc-soft","--c-mem",1.5)}/><circle cx="${p[0]}" cy="${p[1]}" r="5" ${f("--c-nuc")}/>`).join("")}
   <path d="M323 214 l-48 40" ${st("--ink",7,'stroke-linecap="round"')}/></g>
  <path d="M265 170 C300 160 310 165 312 170" ${st("--muted",1.5,'stroke-dasharray="4 4"')}/>`,
  parts:{cell:{t:"En bit vävnad",fl:"Fabrikerna",d:"Här ser du några celler tätt intill varandra. Varje cell är en egen liten fabrik. Tryck på Zooma in.",z:"djur.cell",src:"PPT Bi2 bild 18–19"}}};
SC["vaxt.org"]={t:"Växten",vb:"0 0 520 340",d:"Växten är fotoautotrof: den bygger sin egen näring med hjälp av solljus. Bladens celler är fulla av kloroplaster. Tryck på förstoringsglaset.",
  svg:`<rect x="0" y="0" width="520" height="340" ${f("--bg")}/>
  <path d="M190 330 C190 250 195 180 200 90" ${st("--c-chl",6)}/>
  <path d="M196 230 C150 215 110 230 90 260 C130 270 170 260 196 230Z" ${fs("--c-chl-soft","--c-chl",2.5)}/>
  <path d="M198 170 C240 140 290 145 310 170 C270 190 230 190 198 170Z" ${fs("--c-chl-soft","--c-chl",2.5)}/>
  <path d="M200 110 C170 80 140 75 120 90 C145 115 175 118 200 110Z" ${fs("--c-chl-soft","--c-chl",2.5)}/>
  <path d="M150 330 h90" ${st("--c-wall",4)}/>
  <g data-k="cell"><circle cx="400" cy="170" r="72" ${fs("--c-chl-soft","--c-wall",3)}/>
   ${[[360,140],[400,130],[440,145],[365,185],[405,180],[440,195],[385,215],[425,225]].map(p=>`<rect x="${p[0]-17}" y="${p[1]-14}" width="34" height="28" rx="4" ${fs("--c-vac-soft","--c-wall",2)}/><ellipse cx="${p[0]-9}" cy="${p[1]-6}" rx="4" ry="3" ${f("--c-chl")}/><ellipse cx="${p[0]+8}" cy="${p[1]+6}" rx="4" ry="3" ${f("--c-chl")}/>`).join("")}
   <path d="M341 213 l-46 40" ${st("--ink",7,'stroke-linecap="round"')}/></g>
  <path d="M305 168 C330 168 326 170 328 170" ${st("--muted",1.5,'stroke-dasharray="4 4"')}/>`,
  parts:{cell:{t:"Bladets celler",fl:"De gröna fabrikerna",d:"Växtcellerna ligger tätt, åtskilda av cellväggar. Kloroplasterna (gröna) sitter i de gröna delarna av växten.",z:"vaxt.cell",src:"s. 244–247"}}};
SC["bakt.org"]={t:"Ett gram jord",vb:"0 0 520 340",d:"Ett enda gram jord kan innehålla över en miljard bakterier, och i havet finns ungefär hundra miljoner bakterier per deciliter vatten. Tryck på förstoringsglaset.",
  svg:`<rect x="0" y="0" width="520" height="340" ${f("--bg")}/>
  <path d="M60 280 C80 200 160 170 220 190 C280 210 300 270 280 300 C220 320 120 320 60 280Z" ${fs("--c-wall-soft","--c-wall",3)}/>
  ${[[120,250],[170,230],[220,260],[140,285],[250,285],[195,290]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="9" ${f("--c-wall",.5)}/>`).join("")}
  <g data-k="cell"><circle cx="400" cy="160" r="78" ${fs("--c-bact-soft","--c-bact",3)}/>
   ${[[365,130],[395,120],[430,140],[370,170],[410,165],[445,180],[380,200],[420,205],[400,145]].map((p,i)=>i%3===0?`<circle cx="${p[0]}" cy="${p[1]}" r="7" ${f("--c-bact")}/>`:`<rect x="${p[0]-13}" y="${p[1]-5}" width="26" height="10" rx="5" ${f("--c-bact")} transform="rotate(${i*23} ${p[0]} ${p[1]})"/>`).join("")}
   <path d="M345 215 l-50 44" ${st("--ink",7,'stroke-linecap="round"')}/></g>`,
  parts:{cell:{t:"Bakterier i jorden",fl:"Verkstäderna",d:"Marken är ännu mer bakterietät än havet. På varje undersökt plats finns fler än 10 000 bakteriearter.",z:"bakt.cell",src:"s. 181"}}};
SC["ark.org"]={t:"En saltdamm",vb:"0 0 520 340",d:"Arkéer finns i stort sett överallt, även där inget annat klarar sig. Saltälskande arkéer färgar saltdammar röda och gröna. Tryck på förstoringsglaset.",
  svg:`<rect x="0" y="0" width="520" height="340" ${f("--bg")}/>
  <ellipse cx="170" cy="230" rx="150" ry="70" ${fs("--c-arch-soft","--c-arch",3)}/>
  <ellipse cx="150" cy="225" rx="90" ry="38" ${f("--c-vir",.25)}/><ellipse cx="220" cy="245" rx="60" ry="22" ${f("--c-chl",.25)}/>
  ${[[90,170],[130,160],[200,165],[250,175]].map(p=>`<path d="M${p[0]} ${p[1]} l8 -14 l8 14z" ${fs("--paper","--muted",1.5)}/>`).join("")}
  <g data-k="cell"><circle cx="410" cy="150" r="75" ${fs("--c-arch-soft","--c-arch",3)}/>
   ${[[380,125,0],[420,115,20],[445,150,-10],[385,170,15],[425,180,0],[400,145,-25]].map(p=>`<rect x="${p[0]-12}" y="${p[1]-12}" width="24" height="24" rx="2" ${f("--c-arch")} transform="rotate(${p[2]} ${p[0]} ${p[1]})"/>`).join("")}
   <path d="M357 203 l-50 44" ${st("--ink",7,'stroke-linecap="round"')}/></g>`,
  parts:{cell:{t:"Arkéer i saltvattnet",fl:"Extremverkstäderna",d:"Halofila arkéer lever vid höga salthalter. Det finns arkéer som är platta och fyrkantiga.",z:"ark.cell",src:"s. 184"}}};
SC["vir.org"]={t:"En infekterad cell",vb:"0 0 520 340",d:"Ett virus kan inte föröka sig själv. Det fäster på en cell och tvingar den att tillverka nya virus. Tryck på förstoringsglaset.",
  svg:`<rect x="0" y="0" width="520" height="340" ${f("--bg")}/>
  <ellipse cx="190" cy="190" rx="150" ry="120" ${fs("--c-cyto","--c-mem",4)}/>
  <circle cx="180" cy="190" r="40" ${fs("--c-nuc-soft","--c-nuc",2)}/>
  ${[[110,95],[250,85],[330,170],[80,250],[300,270]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="11" ${fs("--c-vir-soft","--c-vir",2)}/>`).join("")}
  ${[[150,240],[220,250],[240,150],[130,170]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="7" ${f("--c-vir",.7)}/>`).join("")}
  <g data-k="cell">${lens(420,120,62)}<circle cx="420" cy="120" r="28" ${fs("--c-vir-soft","--c-vir",3)}/>${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return`<path d="M${420+28*Math.cos(a)} ${120+28*Math.sin(a)} L${420+38*Math.cos(a)} ${120+38*Math.sin(a)}" ${st("--c-vir",3)}/>`}).join("")}</g>`,
  parts:{cell:{t:"Ett viruspartikel",fl:"Kaparen",d:"Virus är mycket mindre än cellen: från 20 nm till en mikrometer. Zooma in på ett av dem.",z:"vir.cell",src:"s. 184–185"}}};

/* --- cells --- */
SC["djur.cell"]={t:"Djurcellen",vb:"0 0 520 360",d:"En genomsnittlig djurcell enligt boken. Den saknar cellvägg. Tryck på en del.",
  svg:`<ellipse cx="260" cy="185" rx="150" ry="135" ${fs("--c-cyto","--c-mem",0)}/>
  <g data-k="membran"><ellipse cx="260" cy="185" rx="150" ry="135" ${st("--c-mem",7)}/></g>
  <g data-k="cyto"><path d="M300 290 C330 280 350 260 360 240 C372 262 360 292 330 305Z" fill="transparent"/></g>
  <g data-k="rer"><path d="M268 112 C305 112 318 140 318 172 M276 100 C318 100 334 132 334 174 M262 232 C295 236 316 214 322 192" ${st("--c-er",7,'stroke-linecap="round" opacity=".75"')}/>${dots([[300,108],[318,124],[328,146],[333,164],[285,104],[300,232],[316,214],[324,196],[278,236]],2.6)}</g>
  <g data-k="ser"><path d="M140 232 q14 -14 28 0 t28 0 M146 252 q14 14 28 0 t28 0" ${st("--c-er",6,'stroke-linecap="round" opacity=".45"')}/></g>
  <g data-k="karna"><circle cx="235" cy="170" r="52" ${f("--c-nuc-soft")}/><circle cx="235" cy="170" r="52" ${st("--c-nuc",4,'stroke-dasharray="16 5"')}/><path d="M205 165 q12 -18 24 0 t24 0 M210 190 q10 -12 20 0 t20 0" ${st("--c-dna",2.5)}/><circle cx="252" cy="158" r="12" ${f("--c-nuc",.8)}/></g>
  <g data-k="golgi"><path d="M290 252 q26 -16 52 0 M287 262 q29 -16 58 0 M285 272 q32 -16 64 0 M287 282 q29 -16 58 0" ${st("--c-golgi",5,'stroke-linecap="round"')}/><circle cx="352" cy="262" r="5" ${f("--c-golgi")}/><circle cx="349" cy="283" r="4" ${f("--c-golgi")}/></g>
  <g data-k="mito"><g transform="rotate(-18 345 95)"><ellipse cx="345" cy="95" rx="28" ry="14" ${f("--c-mito")}/><path d="M323 95 l5 -8 l5 16 l5 -16 l5 16 l5 -16 l5 16 l5 -16 l4 8" ${st("--paper",2)}/></g><g transform="rotate(30 170 108)"><ellipse cx="170" cy="108" rx="26" ry="13" ${f("--c-mito")}/><path d="M150 108 l5 -7 l5 14 l5 -14 l5 14 l5 -14 l5 14 l5 -7" ${st("--paper",2)}/></g></g>
  <g data-k="lyso"><circle cx="190" cy="292" r="13" ${f("--c-lyso",.85)}/>${dots([[185,288],[195,295],[192,284]],2.5,"--paper")}</g>
  <g data-k="perox"><circle cx="350" cy="186" r="9" ${f("--c-golgi",.7)}/></g>
  <g data-k="ribo">${dots([[290,305],[300,297],[310,309],[282,318],[318,300]],3)}<circle cx="300" cy="305" r="18" fill="transparent"/></g>
  <g data-k="skelett"><path d="M128 150 C150 120 170 130 205 118 M135 205 C160 225 175 215 190 230" ${st("--c-mito",2,'stroke-dasharray="6 4" opacity=".8"')}/><path d="M128 150 C150 120 170 130 205 118" stroke="transparent" stroke-width="14" fill="none"/></g>
  <g data-k="centr"><rect x="196" y="207" width="8" height="24" rx="2" ${f("--muted")}/><rect x="188" y="215" width="24" height="8" rx="2" ${f("--muted")}/></g>
  <g data-k="vakuol"><ellipse cx="236" cy="296" rx="13" ry="9" ${f("--c-vac",.6)}/></g>`,
  parts:{
   membran:{t:"Cellmembranet",fl:"Tullgränsen",lb:["Cellmembran",104,60,"e",150,92],d:"Ett dubbelt lager av fosfolipider med proteiner. Det avgränsar cellen och styr vad som går in och ut, eftersom fettlösliga ämnen passerar fritt medan andra behöver transportproteiner.",ch:"k3",z:"membran",src:"s. 17–18"},
   skelett:{t:"Cellskelettet",fl:"Byggställning och järnväg",lb:["Cellskelett",104,118,"e",140,138],d:"Tre sorters proteintrådar: mikrotubuli, intermediära filament och mikrofilament. Ger stöd och fungerar som räls för transport av organeller och vesiklar.",ch:"k4.cellskelettet",src:"s. 27"},
   karna:{t:"Cellkärnan",fl:"Ledningskontoret",lb:["Cellkärna",104,170,"e",183,170],d:"Innehåller nästan all arvsmassa (DNA) och omges av ett dubbelt kärnmembran med porer. Därifrån skickas mRNA ut till ribosomerna.",ch:"k4.karnan",z:"karna",src:"s. 22–23"},
   centr:{t:"Centrioler",fl:"Hjälper till vid delningen",lb:["Centrioler",104,214,"e",188,219],d:"Finns i djurcellen men inte i växtcellen. Boken har dem i figuren på s. 21 och nämner att växtcellen saknar dem (s. 244).",ch:"k4",src:"s. 21, 244"},
   ser:{t:"Slätt ER",fl:"Fett- och avgiftningsverkstaden",lb:["Slätt ER",104,256,"e",142,250],d:"ER utan ribosomer. Tillverkar fosfolipider, kolesterol och steroidhormoner och avgiftar, därför har leverceller mycket slätt ER.",ch:"k4.er",z:"er",src:"s. 24"},
   lyso:{t:"Lysosom",fl:"Sopförbränningen",lb:["Lysosom",104,300,"e",178,294],d:"Membranblåsa med nedbrytande enzymer som bildas i golgi. Lågt pH är en säkerhetsspärr, eftersom enzymerna fungerar sämre om de läcker ut i cytoplasman.",ch:"k4.lysosomer",z:"lyso",src:"s. 26"},
   vakuol:{t:"Vakuol",fl:"Liten förrådstank",lb:["Vakuol",104,340,"e",226,300],d:"Djurceller kan ha små vakuoler, men inte den stora vakuol som växtceller har.",ch:"k13.vakuolen",src:"s. 21, 245"},
   mito:{t:"Mitokondrien",fl:"Kraftverket",lb:["Mitokondrie",416,72,"s",362,86],d:"Bildar det mesta av cellens ATP. Har två membran, och det inre är veckat för att få plats med mer enzym. Muskelceller har extra många.",ch:"k4.mitokondrien",z:"mito",src:"s. 27"},
   rer:{t:"Kornigt ER",fl:"Löpande bandet",lb:["Kornigt ER",416,140,"s",333,150],d:"ER med ribosomer. Här tillverkas proteiner som ska exporteras, sitta i cellmembranet eller arbeta i lysosomerna.",ch:"k4.er",z:"er",src:"s. 24"},
   perox:{t:"Peroxisom",fl:"Rummet för farlig kemi",lb:["Peroxisom",416,186,"s",359,186],d:"Bryter ner fettsyror. Väteperoxiden som bildas görs ofarlig av enzymet katalas. Bildas genom avknoppning, inte i golgi.",ch:"k4.peroxisomer",src:"s. 26"},
   golgi:{t:"Golgiapparaten",fl:"Packcentralen och posten",lb:["Golgiapparat",416,234,"s",350,258],d:"Ofta sex platta cisterner. Proteiner från ER modifieras och skickas vidare i vesiklar: lysosomer, sekretoriska vesiklar och vesiklar med byggmaterial.",ch:"k4.golgi",z:"golgi",src:"s. 25"},
   ribo:{t:"Ribosomer",fl:"Arbetsbänkarna",lb:["Ribosomer",416,282,"s",318,300],d:"Här byggs proteiner. Fria ribosomer gör proteiner till cytoplasman, ER-bundna gör proteiner för export, membran och lysosomer.",ch:"k4.ribosomer",z:"ribo",src:"s. 23–24"},
   cyto:{t:"Cytoplasman",fl:"Fabriksgolvet",lb:["Cytoplasma",416,328,"s",345,285],d:"Tjock vätska innanför membranet, där många av cellens reaktioner sker. Läraren kallar den också cellplasma.",ch:"k4.djurcellen",src:"s. 21 · PPT Bi2 bild 22"}}};
SC["vaxt.cell"]={t:"Växtcellen",vb:"0 0 520 360",d:"Växtcellen har allt djurcellen har utom lysosomer och centrioler, och dessutom cellvägg, stor vakuol och kloroplaster. Tryck på en del.",
  svg:`<g data-k="vagg"><rect x="112" y="40" width="296" height="290" rx="12" ${fs("--c-wall-soft","--c-wall",3)}/></g>
  <rect x="124" y="52" width="272" height="266" rx="8" ${f("--c-cyto")}/>
  <g data-k="membran"><rect x="124" y="52" width="272" height="266" rx="8" ${st("--c-mem",3)}/></g>
  <g data-k="plasmo"><rect x="110" y="182" width="16" height="12" ${f("--c-cyto")}/><path d="M110 182 h16 M110 194 h16" ${st("--c-mem",2)}/></g>
  <g data-k="vakuol"><path d="M180 110 C230 80 330 85 360 130 C385 175 370 250 320 270 C260 292 190 270 175 220 C165 180 160 135 180 110Z" ${fs("--c-vac-soft","--c-vac",2.5)}/></g>
  <g data-k="karna"><circle cx="158" cy="98" r="27" ${f("--c-nuc-soft")}/><circle cx="158" cy="98" r="27" ${st("--c-nuc",3,'stroke-dasharray="12 4"')}/><circle cx="165" cy="92" r="7" ${f("--c-nuc",.8)}/></g>
  <g data-k="er"><path d="M190 76 q16 -10 32 0 t32 0 M186 62 q14 -8 28 0" ${st("--c-er",4,'stroke-linecap="round" opacity=".7"')}/></g>
  <g data-k="klor">${[[150,255,20],[375,110,-70],[378,245,80],[262,300,0]].map(p=>`<g transform="rotate(${p[2]} ${p[0]} ${p[1]})"><ellipse cx="${p[0]}" cy="${p[1]}" rx="20" ry="11" ${fs("--c-chl-soft","--c-chl",2)}/>${[-10,0,10].map(dx=>`<rect x="${p[0]+dx-3}" y="${p[1]-6}" width="6" height="12" rx="1" ${f("--c-chl")}/>`).join("")}</g>`).join("")}</g>
  <g data-k="mito"><ellipse cx="300" cy="70" rx="17" ry="9" ${f("--c-mito")}/><ellipse cx="335" cy="298" rx="16" ry="8" ${f("--c-mito")}/></g>
  <g data-k="golgi"><path d="M178 290 q14 -9 28 0 M176 299 q16 -9 32 0 M178 308 q14 -9 28 0" ${st("--c-golgi",4,'stroke-linecap="round"')}/></g>
  <g data-k="ribo">${dots([[384,180],[390,190],[378,196],[388,203]],2.6)}<circle cx="385" cy="192" r="13" fill="transparent"/></g>`,
  parts:{
   vagg:{t:"Cellväggen",fl:"Muren av cellulosa",lb:["Cellvägg",100,50,"e",114,62],d:"Cellulosafibriller i en matrix av andra polysackarider och proteiner. Ger form, skydd och stadga och hindrar cellen från att spricka i en hypoton lösning.",ch:"k13.cellvaggen",z:"vagg",src:"s. 244–245"},
   membran:{t:"Cellmembranet",fl:"Tullgränsen innanför muren",lb:["Cellmembran",100,90,"e",126,104],d:"Ligger innanför cellväggen. Det är membranet, inte väggen, som styr vad som går in och ut.",ch:"k3",z:"membran",src:"s. 245"},
   karna:{t:"Cellkärnan",fl:"Ledningskontoret",lb:["Cellkärna",100,130,"e",134,110],d:"Samma som i djurcellen. Den stora vakuolen trycker ofta undan kärnan mot kanten.",ch:"k4.karnan",z:"karna",src:"s. 245"},
   plasmo:{t:"Plasmodesmata",fl:"Dörrar till grannfabriken",lb:["Plasmodesma",100,190,"e",112,188],d:"Kanaler genom cellväggen, klädda med cellmembran och fyllda med cytoplasma. Genom dem kommunicerar cellerna och skickar ämnen till varandra.",ch:"k13.cellvaggen",z:"vagg",src:"s. 245"},
   klor:{t:"Kloroplasten",fl:"Solkraftverket",lb:["Kloroplast",100,250,"e",130,252],d:"Innehåller klorofyll i tylakoiderna och fångar ljusenergi. Har dubbla membran och eget ringformat DNA och tros ha uppstått genom endosymbios.",ch:"k13.kloroplasten",z:"klor",src:"s. 246–247"},
   golgi:{t:"Golgiapparaten",fl:"Packcentralen",lb:["Golgiapparat",100,302,"e",176,298],d:"Finns i växtcellen precis som i djurcellen.",ch:"k4.golgi",z:"golgi",src:"PPT Bi2 bild 23–24"},
   er:{t:"Endoplasmatiska nätverket",fl:"Löpande bandet",lb:["ER",420,60,"s",254,72],d:"Samma uppgifter som i djurcellen.",ch:"k4.er",z:"er",src:"PPT Bi2 bild 24"},
   mito:{t:"Mitokondrier",fl:"Kraftverken",lb:["Mitokondrie",420,98,"s",316,72],d:"Växtceller har också mitokondrier. Kloroplasten ersätter dem inte.",ch:"k4.mitokondrien",z:"mito",src:"s. 245"},
   vakuol:{t:"Vakuolen",fl:"Vattentanken och återvinningen",lb:["Vakuol",420,160,"s",365,160],d:"Kan ta upp till 90 % av cellens volym. Den håller cellen spänd (turgor) och innehåller enzymer som gör ungefär samma jobb som lysosomerna.",ch:"k13.vakuolen",z:"vakuol",src:"s. 245–246"},
   ribo:{t:"Ribosomer",fl:"Arbetsbänkarna",lb:["Ribosomer",420,200,"s",392,192],d:"Bygger proteiner, precis som i djurcellen.",ch:"k4.ribosomer",z:"ribo",src:"s. 245"},
   cyto:{t:"Cytoplasman",fl:"Fabriksgolvet",lb:["Cytoplasma",420,286,"s",360,282],d:"Ett tunt lager längs kanten, eftersom vakuolen fyller det mesta av cellen.",ch:"k13.vaxtcellen",src:"s. 245"}}};
SC["bakt.cell"]={t:"En gramnegativ bakterie",vb:"0 0 520 340",d:"Bokens bild av en typisk gramnegativ stavbakterie (s. 181). Ingen kärna, inga organeller med membran. Tryck på en del.",
  svg:`<g data-k="kapsel"><rect x="114" y="96" width="292" height="148" rx="74" ${st("--muted",2,'stroke-dasharray="6 5"')}/></g>
  <g data-k="fimbr">${Array.from({length:26},(_,i)=>{const a=i/26*Math.PI*2;const x=260+138*Math.cos(a),y=170+64*Math.sin(a);return`<path d="M${(260+128*Math.cos(a)).toFixed(1)} ${(170+58*Math.sin(a)).toFixed(1)} L${x.toFixed(1)} ${y.toFixed(1)}" ${st("--c-bact",1.6)}/>`}).join("")}</g>
  <g data-k="ytter"><rect x="132" y="112" width="256" height="116" rx="58" ${fs("--c-bact-soft","--c-bact",3)}/></g>
  <g data-k="pepti"><rect x="138" y="118" width="244" height="104" rx="52" ${st("--c-wall",4,'stroke-dasharray="3 2"')}/></g>
  <g data-k="inner"><rect x="145" y="125" width="230" height="90" rx="45" ${fs("--c-cyto","--c-mem",2.5)}/></g>
  <g data-k="dna"><path d="M220 160 C230 140 250 190 262 160 C272 135 290 185 300 162 C308 145 280 150 255 175 C235 192 215 180 230 165" ${st("--c-dna",2.5)}/></g>
  <g data-k="plasmid"><circle cx="190" cy="185" r="10" ${st("--c-dna",2.2)}/><circle cx="335" cy="148" r="8" ${st("--c-dna",2.2)}/></g>
  <g data-k="ribo">${dots([[175,150],[195,140],[320,190],[340,180],[300,198],[205,200],[350,165]],2.6)}</g>
  <g data-k="flagell"><path d="${wavy(386,190,500,290,10,6)}" ${st("--muted",3)}/></g>`,
  parts:{
   kapsel:{t:"Kapsel",fl:"Ett extra skyddsskikt",lb:["Kapsel",104,70,"e",160,112],d:"Ett slemlager utanför cellväggen hos vissa bakterier. Det står i lärarens bild av bakteriecellen men inte i boken.",ch:"k8.byggnad",src:"PPT Mikroorganismer bild 35"},
   fimbr:{t:"Fimbrier",fl:"Gripklor",lb:["Fimbrier",104,110,"e",136,138],d:"Tunna utskott av protein. Proteinet i spetsen kan gripa tag i det bakterien ska hålla sig fast vid.",ch:"k8.byggnad",src:"s. 181"},
   ytter:{t:"Yttermembran",fl:"Ytterväggen",lb:["Yttermembran",104,150,"e",133,160],d:"Finns bara hos gramnegativa bakterier. En del fosfolipider är utbytta mot lipopolysackarider (LPS), som kan vara mycket skadliga för människor.",ch:"k8.byggnad",z:"holje",src:"s. 180–181"},
   pepti:{t:"Peptidoglykan",fl:"Staketet",lb:["Peptidoglykan",104,190,"e",139,182],d:"Kolhydratkedjor korsbundna med korta peptider. Ger struktur och skydd. Tjockt hos grampositiva, tunt hos gramnegativa. Penicillin hindrar bygget av det.",ch:"k8.byggnad",z:"holje",src:"s. 180–181"},
   inner:{t:"Innermembran",fl:"Tullgränsen",lb:["Innermembran",104,230,"e",146,196],d:"Bakteriens cellmembran. Separerar cellens innehåll från omgivningen. Kemiskt ungefär som hos eukaryoter.",ch:"k8.byggnad",src:"s. 180–181"},
   dna:{t:"DNA",fl:"Ritningen på golvet",lb:["DNA",416,64,"s",280,150],d:"Bakteriens kromosom är ringformad och ligger fritt, eftersom bakterien saknar cellkärna.",ch:"k9.delning",src:"s. 181–182"},
   plasmid:{t:"Plasmider",fl:"Lösa receptkort",lb:["Plasmid",416,106,"s",343,148],d:"Små ringar av extra DNA. Kan bära gener för t.ex. antibiotikaresistens och kan föras över till andra bakterier.",ch:"k9.plasmider",z:"plasmid",src:"s. 182"},
   ribo:{t:"Ribosomer",fl:"Arbetsbänkarna",lb:["Ribosomer",416,214,"s",349,180],d:"Utför proteinsyntesen. Bakteriens ribosomer skiljer sig från våra, och därför kan vissa antibiotika blockera just dem.",ch:"k11.ribosom",z:"ribo",src:"s. 181 · PPT Antibiotika bild 19"},
   flagell:{t:"Flagell",fl:"Propellern",lb:["Flagell",416,320,"s",472,268],d:"Ett tjockt utskott av proteiner. Genom att rotera sätter den bakterien i rörelse.",ch:"k8.byggnad",src:"s. 181"}}};
SC["ark.cell"]={t:"En arké",vb:"0 0 520 340",d:"Arkéer liknar bakterier till det yttre, men de är en egen gren av livets träd. Vissa är platta och fyrkantiga. Tryck på en del.",
  svg:`<g data-k="vagg"><rect x="160" y="70" width="200" height="200" rx="16" ${fs("--c-arch-soft","--c-arch",4)}/></g>
  <g data-k="membran"><rect x="172" y="82" width="176" height="176" rx="10" ${fs("--c-cyto","--c-arch",2.5,null)} stroke-dasharray="8 3"/></g>
  <g data-k="dna"><path d="M220 150 C232 128 252 182 266 150 C276 126 296 176 304 152 C312 136 282 140 258 168 C238 186 214 174 230 158" ${st("--c-dna",2.5)}/></g>
  <g data-k="ribo">${dots([[200,110],[318,110],[205,225],[310,228],[262,205],[230,200]],2.8)}</g>`,
  parts:{
   vagg:{t:"Cellvägg",fl:"Muren",lb:["Cellvägg",150,50,"e",170,74],d:"Läraren skriver att arkéer inte har samma material i cellväggen som bakterier. Boken säger i stället att skillnaden sitter i membranets fosfolipider.",ch:"k10.arkeer",src:"PPT Mikroorganismer bild 37"},
   membran:{t:"Cellmembranet",fl:"Tullgräns av annat material",lb:["Cellmembran",150,150,"e",173,150],d:"Fosfolipiderna i arkéernas cellmembran skiljer sig rent kemiskt kraftigt från fosfolipiderna hos bakterier och eukaryoter. Det är bokens viktigaste skillnad.",ch:"k10.arkeer",z:"arkmem",src:"s. 184"},
   dna:{t:"Arvsmassa",fl:"Ritningen",lb:["DNA",372,100,"s",302,150],d:"Ingen cellkärna. När man analyserar arvsmassan ser man att arkéerna är en separat huvudgren av livets träd.",ch:"k10.system",src:"s. 184"},
   ribo:{t:"Ribosomer",fl:"Arbetsbänkarna",lb:["Ribosomer",372,240,"s",312,228],d:"Arkéer bygger sina proteiner på ribosomer, som alla celler.",ch:"k10.arkeer",src:"K10"}}};
SC["vir.cell"]={t:"Ett virus med hölje",vb:"0 0 520 340",d:"Ett virus är en bit arvsanlag i ett proteinpaket. Vissa har också ett membranhölje. Tryck på en del.",
  svg:`<g data-k="spik">${Array.from({length:16},(_,i)=>{const a=i*Math.PI/8;return`<path d="M${(260+100*Math.cos(a)).toFixed(1)} ${(170+100*Math.sin(a)).toFixed(1)} L${(260+124*Math.cos(a)).toFixed(1)} ${(170+124*Math.sin(a)).toFixed(1)}" ${st("--c-vir",4)}/><circle cx="${(260+128*Math.cos(a)).toFixed(1)}" cy="${(170+128*Math.sin(a)).toFixed(1)}" r="6" ${f("--c-vir")}/>`}).join("")}</g>
  <g data-k="holje"><circle cx="260" cy="170" r="100" ${fs("--c-vir-soft","--c-mem",7)}/></g>
  <g data-k="kapsid"><path d="${hexRing(260,170,62)}" ${fs("--paper","--c-vir",4)}/></g>
  <g data-k="arv"><path d="M230 150 C245 125 265 195 280 150 C290 128 300 190 285 195 C265 200 240 185 245 165" ${st("--c-dna",3)}/></g>`,
  parts:{
   spik:{t:"Ytproteiner",fl:"Falska nycklar",lb:["Ytproteiner",120,40,"e",193,80],d:"Proteiner som passar som nyckel i lås till receptorer på värdcellen. Därför kan de flesta virus bara infektera någon eller några arter.",ch:"k10.virus",z:"vfast",src:"s. 185"},
   holje:{t:"Membranhölje",fl:"Stulen tullgräns",lb:["Membranhölje",120,300,"e",196,250],d:"Vissa virus har ett hölje av membran utanför proteinpaketet, andra saknar det.",ch:"k10.virus",src:"s. 185"},
   kapsid:{t:"Proteinhölje",fl:"Kaparens väska",lb:["Proteinhölje",400,60,"s",310,140],d:"Arvsanlagen är förpackade i ett paket av protein.",ch:"k10.virus",src:"s. 184"},
   arv:{t:"Arvsmassa",fl:"Kaparens ritningar",lb:["DNA eller RNA",400,290,"s",283,190],d:"DNA eller RNA, enkel- eller dubbelsträngat. Viruset har ingen egen ämnesomsättning och inga ribosomer, så det måste använda värdcellens.",ch:"k10.virus",m:"nukl",src:"s. 184–185"}}};

/* --- organelle details --- */
SC.membran={t:"Cellmembranet på nära håll",vb:"0 0 520 340",d:"Fosfolipiddubbelskiktet med proteiner och sockerkedjor på utsidan. Utsidan är uppåt.",
  svg:`<text x="16" y="24" class="sm">CELLENS UTSIDA</text><text x="16" y="330" class="sm">CYTOPLASMAN</text>
  <g data-k="fosfo">${bilayer(40,500,130,16,{skip:[[150,200],[262,300],[372,404]]})}</g>
  <g data-k="kanal"><rect x="156" y="112" width="16" height="96" rx="7" ${f("--c-nuc")}/><rect x="180" y="112" width="16" height="96" rx="7" ${f("--c-nuc")}/></g>
  <g data-k="rec"><path d="M281 210 L281 128 L266 96 M281 128 L296 96" ${st("--c-euk",11,'stroke-linecap="round"')}/></g>
  <g data-k="glyko"><rect x="376" y="118" width="24" height="88" rx="11" ${f("--c-nuc",.75)}/>${[[388,104],[380,90],[392,78],[402,92],[408,76]].map(p=>`<path d="${hexRing(p[0],p[1],6)}" ${fs("--c-mem","--ink",1)}/>`).join("")}</g>
  <g data-k="kol"><path d="${hexRing(232,150,6)}" ${fs("--c-golgi","--ink",1)}/><path d="${hexRing(232,162,6)}" ${fs("--c-golgi","--ink",1)}/><path d="M232 168 v12" ${st("--ink",1.5)}/></g>`,
  parts:{
   fosfo:{t:"Fosfolipider",fl:"Tullgränsens tegel",lb:["Fosfolipid",500,300,"e",452,192],d:"Hydrofila huvuden pekar ut mot vattnet på båda sidor och hydrofoba svansar mot varandra. Membranet är som en tvådimensionell vätska där delarna glider runt.",ch:"k3.uppbyggnad",m:"fosfo",src:"s. 17–18"},
   kanal:{t:"Kanalprotein",fl:"Grinden",lb:["Kanalprotein",120,60,"e",170,112],d:"En vattenfylld kanal som släpper igenom vatten eller en viss sorts jon. Ingen energi behövs, eftersom ämnet går med sin gradient.",ch:"k5.underlattad",src:"s. 32"},
   kol:{t:"Kolesterol",fl:"Smörjmedlet",lb:["Kolesterol",232,300,"m",232,182],d:"Finns i djurcellers membran och håller det lagom flytande.",ch:"k3.uppbyggnad",src:"s. 18"},
   rec:{t:"Receptor",fl:"Brevlådan",lb:["Receptor",281,60,"m",281,96],d:"Tar emot signalmolekyler som passar som nyckel i lås, t.ex. hormoner och neurotransmittorer.",ch:"k3.proteiner",src:"s. 19"},
   glyko:{t:"Glykoprotein med sockerkedja",fl:"Fabrikens uniform",lb:["Glykokalyx",440,50,"s",405,80],d:"Sockerkedjor på glykoproteiner och glykolipider bildar glykokalyx, cellens sockerpäls. Den skyddar och visar vilken celltyp cellen är.",ch:"k3.glykokalyx",src:"s. 20–21"}}};
SC.karna={t:"Cellkärnan på nära håll",vb:"0 0 520 340",d:"Kärnmembranet är dubbelt och har porer. Inuti finns kromatin och en eller flera nukleoler.",
  svg:`<rect x="0" y="0" width="520" height="340" ${f("--c-cyto")}/>
  <g data-k="km"><circle cx="250" cy="170" r="135" ${fs("--c-nuc-soft","--c-nuc",5)}/><circle cx="250" cy="170" r="125" ${st("--c-nuc",3)}/></g>
  <g data-k="por">${[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4+.3;return`<circle cx="${(250+130*Math.cos(a)).toFixed(1)}" cy="${(170+130*Math.sin(a)).toFixed(1)}" r="6" ${f("--c-cyto")}/>`}).join("")}</g>
  <g data-k="krom"><path d="M170 140 q15 -25 30 0 t30 0 t30 0 M175 210 q12 -20 24 0 t24 0 t24 0 M310 220 q10 -16 20 0 t20 0" ${st("--c-dna",3)}/></g>
  <g data-k="nukleol"><circle cx="300" cy="140" r="30" ${f("--c-nuc",.85)}/></g>
  <g data-k="er"><path d="M380 110 C420 100 460 120 500 110 M384 128 C424 118 464 138 504 128" ${st("--c-er",6,'stroke-linecap="round" opacity=".7"')}/></g>`,
  parts:{
   km:{t:"Kärnmembranet",fl:"Kontorets väggar",lb:["Kärnmembran",120,30,"e",160,70],d:"Ett dubbelt membran som omsluter nukleoplasman. Det är på flera ställen ihopkopplat med ER. Vid celldelning löses det upp.",ch:"k4.karnan",src:"s. 22"},
   por:{t:"Kärnporer",fl:"Kontorets dörrar",lb:["Kärnpor",120,320,"e",153,267],d:"Ganska stora porer. Genom dem tar sig t.ex. mRNA ut till ribosomerna.",ch:"k4.karnan",src:"s. 22"},
   krom:{t:"Kromatin",fl:"Ritningarna i pärmar",lb:["Kromatin",80,180,"e",168,148],d:"DNA lindat runt histonproteiner. Tätt packat kromatin går inte att läsa, löst packat kan användas. Vid delning packas det till kromosomer.",ch:"k4.karnan",m:"nukl",src:"s. 22–23"},
   nukleol:{t:"Nukleol",fl:"Ribosomverkstaden",lb:["Nukleol",400,40,"s",322,122],d:"Mörkt parti som bildas runt de DNA-regioner som kodar för ribosomalt RNA. Celler som gör mycket protein har tydliga nukleoler.",ch:"k4.karnan",src:"s. 23"},
   er:{t:"ER",fl:"Löpande bandet",lb:["ER",510,160,"e",470,124],d:"ER hänger ihop med kärnmembranet.",ch:"k4.er",src:"s. 22"}}};
SC.mito={t:"Mitokondrien på nära håll",vb:"0 0 520 340",d:"Två membran. Det inre är kraftigt veckat. Eget ringformat DNA och ribosomer av bakterietyp.",
  svg:`<g data-k="ytter"><ellipse cx="260" cy="170" rx="210" ry="110" ${fs("--c-mito-soft","--c-mito",5)}/></g>
  <g data-k="matrix"><ellipse cx="260" cy="170" rx="196" ry="96" ${f("--c-mito-soft")}/></g>
  <g data-k="inner"><path d="M70 170 C80 100 95 100 100 170 C106 240 118 240 126 170 C134 96 146 96 154 170 C162 244 174 244 182 170 C190 94 202 94 210 170 C218 246 230 246 238 170 C246 94 258 94 266 170 C274 246 286 246 294 170 C302 94 314 94 322 170 C330 244 342 244 350 170 C358 96 370 96 378 170 C386 240 398 240 406 170 C414 104 426 104 440 170" ${st("--c-mito",5)}/></g>
  <g data-k="dna"><circle cx="196" cy="222" r="14" ${st("--c-dna",2.5)}/></g>
  <g data-k="ribo">${dots([[300,120],[318,212],[248,118],[352,130]],3.2)}</g>`,
  parts:{
   ytter:{t:"Yttre membranet",fl:"Kraftverkets yttervägg",lb:["Yttre membran",120,30,"e",150,82],d:"Enligt endosymbiosteorin kommer det från cellmembranet hos cellen som slukade bakterien.",ch:"k4.mitokondrien",src:"s. 27"},
   inner:{t:"Inre membranet",fl:"Turbinhallen",lb:["Inre membran (veckat)",500,30,"e",420,110],d:"Starkt veckat, vilket ger stor yta för enzymerna i elektrontransportkedjan som bildar ATP. Det kommer från bakteriens eget cellmembran.",ch:"k4.mitokondrien",m:"atp",src:"s. 27"},
   matrix:{t:"Matrix",fl:"Kraftverkets innandöme",lb:["Matrix",100,320,"e",160,240],d:"Vätskan inuti, med enzymer som utvinner energi ur födan.",ch:"k4.mitokondrien",src:"s. 27"},
   dna:{t:"Eget ringformat DNA",fl:"En gammal bakteriritning",lb:["Ringformat DNA",290,320,"m",205,234],d:"Mitokondrien har eget DNA som är ringformat, precis som hos bakterier. Ett av bevisen för endosymbios.",ch:"k4.mitokondrien",src:"s. 27"},
   ribo:{t:"Ribosomer av bakterietyp",fl:"Gamla arbetsbänkar",lb:["Ribosomer",500,310,"e",360,138],d:"Samma typ som hos bakterier, ännu ett bevis för endosymbios.",ch:"k4.mitokondrien",src:"s. 27"}}};
SC.er={t:"ER på nära håll",vb:"0 0 520 340",d:"Kornigt ER med ribosomer bygger proteiner. Slätt ER gör fetter och avgiftar.",
  svg:`<path d="M0 30 C60 10 120 10 160 40 L160 300 C120 330 60 330 0 310Z" ${f("--c-nuc-soft")}/>
  <g data-k="rer">${[0,1,2].map(i=>`<path d="M170 ${70+i*60} C230 ${50+i*60} 300 ${90+i*60} 360 ${70+i*60}" ${st("--c-er",14,'stroke-linecap="round" opacity=".55"')}/>`).join("")}</g>
  <g data-k="ribo">${[0,1,2].map(i=>dots([[190,60+i*60-8],[220,53+i*60-8],[250,58+i*60-8],[280,66+i*60-6],[310,72+i*60-6],[340,68+i*60-8]],3.5)).join("")}</g>
  <g data-k="ser"><path d="M200 270 q20 -22 40 0 t40 0 t40 0 M210 300 q20 18 40 0 t40 0" ${st("--c-er",10,'stroke-linecap="round" opacity=".35"')}/></g>
  <g data-k="ves"><circle cx="420" cy="110" r="14" ${fs("--c-er","--c-er",2,.35)}/><circle cx="460" cy="150" r="10" ${fs("--c-er","--c-er",2,.35)}/></g>`,
  parts:{
   rer:{t:"Kornigt ER",fl:"Löpande bandet",lb:["Kornigt ER",420,40,"s",360,76],d:"Proteinerna förs in i ER och veckas till rätt form. Många får kolhydrater fästa på sig.",ch:"k4.er",src:"s. 24"},
   ribo:{t:"ER-bundna ribosomer",fl:"Arbetsbänkar vid bandet",lb:["Ribosomer",80,20,"m",188,50],d:"Ribosomer som gör proteiner för export, cellmembranet och lysosomerna sitter på ER.",ch:"k4.ribosomer",z:"ribo",src:"s. 24"},
   ser:{t:"Slätt ER",fl:"Fett- och avgiftningsverkstaden",lb:["Slätt ER",420,290,"s",360,282],d:"Lipidmetabolism: fosfolipider, kolesterol och steroidhormoner. Avgiftning i leverceller.",ch:"k4.er",src:"s. 24"},
   ves:{t:"Vesiklar till golgi",fl:"Lastbilar till packcentralen",lb:["Vesikel till golgi",500,200,"e",462,160],d:"Proteinerna packas i membranblåsor som skickas till golgiapparaten.",ch:"k4.resan",src:"s. 24"}}};
SC.golgi={t:"Golgiapparaten på nära håll",vb:"0 0 520 340",d:"Vesiklar från ER kommer in på ena sidan. Proteinerna modifieras och knoppas av på andra sidan.",
  svg:`<g data-k="in"><circle cx="70" cy="120" r="14" ${fs("--c-er","--c-er",2,.4)}/><circle cx="90" cy="200" r="12" ${fs("--c-er","--c-er",2,.4)}/></g>
  <g data-k="cist">${[0,1,2,3,4,5].map(i=>`<path d="M${150+i*30} 70 C${190+i*30} 150 ${190+i*30} 190 ${150+i*30} 270" ${st("--c-golgi",13,'stroke-linecap="round"')}/>`).join("")}</g>
  <g data-k="lyso"><circle cx="420" cy="80" r="18" ${f("--c-lyso",.85)}/></g>
  <g data-k="sekr"><circle cx="440" cy="170" r="18" ${fs("--c-nuc-soft","--c-nuc",2)}/>${dots([[434,165],[446,175],[440,162]],2.5,"--c-nuc")}</g>
  <g data-k="bygg"><circle cx="420" cy="262" r="16" ${fs("--c-mem-soft","--c-mem",2)}/></g>`,
  parts:{
   in:{t:"Vesiklar från ER",fl:"Inkommande lastbilar",lb:["Vesikel från ER",90,40,"m",72,106],d:"Vesiklarna och golgi har membran av fosfolipider, så de kan smälta ihop och proteinerna kommer in.",ch:"k4.golgi",src:"s. 25"},
   cist:{t:"Cisterner",fl:"Packborden",lb:["Cisterner",240,320,"m",230,260],d:"Ofta sex böjda, platta membranblåsor. Proteinerna modifieras med socker, fettsyror, metyl- eller fosfatgrupper.",ch:"k4.golgi",src:"s. 25"},
   lyso:{t:"Lysosom",fl:"Sopförbränningen",lb:["Lysosom",500,40,"e",430,66],d:"Stannar i cellen och innehåller nedbrytande enzymer.",ch:"k4.lysosomer",z:"lyso",src:"s. 25–26"},
   sekr:{t:"Sekretorisk vesikel",fl:"Expressleverans",lb:["Sekretorisk|vesikel",500,124,"e",452,158],d:"Fullpackad med ett protein. Väntar vid membranet på en signal och släpper sedan ut innehållet.",ch:"k4.golgi",src:"s. 25"},
   bygg:{t:"Vesikel med byggmaterial",fl:"Byggleverans",lb:["Byggmaterial",500,310,"e",430,274],d:"Går till cellmembranet med nytt membran och membranproteiner. Finns hos alla celler.",ch:"k4.golgi",src:"s. 25"}}};
SC.ribo={t:"Ribosomen på nära håll",vb:"0 0 520 340",d:"Två subenheter av rRNA och protein. tRNA levererar aminosyror som radas upp efter mRNA.",
  svg:`<g data-k="mrna"><path d="M20 210 H500" ${st("--c-dna",5,'stroke-dasharray="10 4"')}/></g>
  <g data-k="stor"><path d="M170 200 C170 110 350 110 350 200Z" style="fill:var(--t-ribosom);fill-opacity:.85"/></g>
  <g data-k="liten"><rect x="190" y="214" width="140" height="44" rx="22" style="fill:var(--t-ribosom);opacity:.5"/></g>
  <g data-k="trna"><path d="M380 90 v60 M370 90 h20" ${st("--c-mito",6,'stroke-linecap="round"')}/><circle cx="380" cy="70" r="12" ${f("--c-golgi")}/></g>
  <g data-k="kedja">${[[240,120],[222,98],[204,80],[186,66],[168,58],[150,56]].map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="11" style="fill:var(${["--c-golgi","--c-lyso","--c-nuc","--c-mito","--c-euk","--c-arch"][i]})"/>`).join("")}</g>`,
  parts:{
   mrna:{t:"mRNA",fl:"Arbetsordern",lb:["mRNA",60,250,"m",60,212],d:"Budbärar-RNA med instruktioner om vilka aminosyror som ska fogas ihop. Kommer från kärnan.",ch:"k4.ribosomer",src:"s. 23"},
   liten:{t:"Liten subenhet",fl:"Bänkens underdel",lb:["Liten subenhet",260,300,"m",260,258],d:"Fastnar först på mRNA. Sedan kommer den stora.",ch:"k4.ribosomer",src:"s. 23"},
   stor:{t:"Stor subenhet",fl:"Bänkens överdel",lb:["Stor subenhet",420,250,"s",340,190],d:"Båda subenheterna består av rRNA och proteiner.",ch:"k4.ribosomer",src:"s. 23"},
   trna:{t:"tRNA",fl:"Budet med råvaror",lb:["tRNA med aminosyra",500,40,"e",392,70],d:"tRNA levererar aminosyror, och ribosomen radar upp dem i rätt ordning längs mRNA.",ch:"k4.ribosomer",src:"s. 23–24"},
   kedja:{t:"Aminosyrakedjan",fl:"Den färdiga produkten",lb:["Aminosyrakedja",40,40,"s",150,56],d:"Kedjan växer en aminosyra i taget och veckas till ett protein.",ch:"k1.proteiner",m:"prot",src:"s. 23 · PPT Bi2 bild 15"}}};
SC.lyso={t:"Lysosomen på nära håll",vb:"0 0 520 340",d:"En membranblåsa full av enzymer som bryter ner stora molekyler och gamla organeller.",
  svg:`<g data-k="memb"><circle cx="250" cy="170" r="120" ${fs("--c-lyso","--c-lyso",6,.18)}/></g>
  <g data-k="enz">${[[190,120],[300,110],[320,220],[200,230],[250,260],[170,175]].map(p=>`<path d="M${p[0]-10} ${p[1]} a10 10 0 1 1 20 0 l-10 0z" ${f("--c-lyso")}/>`).join("")}</g>
  <g data-k="gammal"><g transform="rotate(-15 260 165)"><ellipse cx="260" cy="165" rx="50" ry="26" ${f("--c-mito",.55)}/></g></g>
  <g data-k="ut">${dots([[410,120],[430,140],[420,170],[445,110]],5,"--c-golgi")}<path d="M372 150 L400 140" ${st("--muted",2)}/></g>
  <g data-k="ph"><text x="230" y="300" class="ttl">pH lågt</text></g>`,
  parts:{
   memb:{t:"Lysosomens membran",fl:"Förbränningsugnens vägg",lb:["Membran",120,40,"e",165,85],d:"Lysosomen bildas i golgiapparaten och är en membranblåsa.",ch:"k4.lysosomer",src:"s. 26"},
   enz:{t:"Nedbrytande enzymer",fl:"Ugnens flammor",lb:["Enzymer",120,300,"e",175,240],d:"Bryter ner makromolekyler. Användbara byggstenar släpps ut och återanvänds, avfallet förs ut ur cellen.",ch:"k4.lysosomer",src:"s. 26"},
   gammal:{t:"Gammal mitokondrie",fl:"Uttjänt maskin",lb:["Gammal organell",400,40,"s",300,150],d:"En gammal organell smälter ihop med lysosomen och bryts ner.",ch:"k4.lysosomer",src:"s. 26"},
   ut:{t:"Byggstenar tillbaka",fl:"Återvinningen",lb:["Byggstenar ut",500,210,"e",430,160],d:"Användbara byggstenar återanvänds i cytoplasman.",ch:"k4.lysosomer",src:"s. 26"},
   ph:{t:"Lågt pH",fl:"Säkerhetsspärren",d:"Enzymerna fungerar bäst vid lågt pH. Läcker lysosomen fungerar de sämre i cytoplasmans högre pH, och därför bryts inte cellen ner av misstag.",ch:"k4.lysosomer",src:"s. 26"}}};
SC.vagg={t:"Cellväggen på nära håll",vb:"0 0 520 340",d:"Två grannceller och väggen mellan dem. Plasmodesmata är kanaler genom väggen.",
  svg:`<rect x="0" y="0" width="200" height="340" ${f("--c-cyto")}/><rect x="320" y="0" width="200" height="340" ${f("--c-cyto")}/>
  <g data-k="fibr"><rect x="210" y="0" width="100" height="340" ${f("--c-wall-soft")}/>${Array.from({length:9},(_,i)=>`<path d="M${214+i*11} 0 C${226+i*11} 80 ${206+i*11} 170 ${218+i*11} 340" ${st("--c-wall",3)}/>`).join("")}</g>
  <g data-k="mem"><path d="M206 0 V140 M206 200 V340 M314 0 V140 M314 200 V340" ${st("--c-mem",4)}/></g>
  <g data-k="plasmo"><rect x="200" y="148" width="120" height="44" ${f("--c-cyto")}/><path d="M200 146 H320 M200 194 H320" ${st("--c-mem",4)}/></g>`,
  parts:{
   fibr:{t:"Cellulosafibriller",fl:"Murens armeringsjärn",lb:["Cellulosafibriller",260,30,"m",255,60],d:"Cellulosa bildar fibriller som bildar tjockare fibrer, inbäddade i en matrix av andra polysackarider och proteiner.",ch:"k13.cellvaggen",m:"cellu",src:"s. 244"},
   mem:{t:"Cellmembranen",fl:"Tullgränserna",lb:["Cellmembran",120,80,"m",206,90],d:"Varje cell har sitt cellmembran innanför väggen.",ch:"k13.cellvaggen",src:"s. 245"},
   plasmo:{t:"Plasmodesma",fl:"Dörren till grannen",lb:["Plasmodesma",420,250,"m",300,180],d:"Kanalen är klädd med cellmembran och fylld med cytoplasma. Ämnen kan gå direkt från cell till cell.",ch:"k13.cellvaggen",src:"s. 245"}}};
SC.vakuol={t:"Vakuolen och turgor",vb:"0 0 520 340",d:"Till vänster: gott om vatten, vakuolen trycker cellen mot väggen (turgor). Till höger: för lite vatten, vakuolen krymper och växten slokar.",
  svg:`<g data-k="full"><rect x="30" y="50" width="200" height="240" rx="10" ${fs("--c-wall-soft","--c-wall",4)}/><rect x="40" y="60" width="180" height="220" rx="8" ${f("--c-cyto")}/><rect x="52" y="72" width="156" height="196" rx="30" ${fs("--c-vac-soft","--c-vac",3)}/></g>
  <g data-k="tom"><rect x="290" y="50" width="200" height="240" rx="10" ${fs("--c-wall-soft","--c-wall",4)}/><rect x="320" y="90" width="140" height="160" rx="30" ${f("--c-cyto")}/><rect x="345" y="125" width="90" height="90" rx="30" ${fs("--c-vac-soft","--c-vac",3)}/></g>
  <text x="130" y="320" class="lbs" text-anchor="middle">gott om vatten</text><text x="390" y="320" class="lbs" text-anchor="middle">för lite vatten</text>`,
  parts:{
   full:{t:"Turgor",fl:"Full vattentank",lb:["Spänd cell (turgor)",130,30,"m",130,60],d:"Vakuolen anpassar sin storlek så att cellen fyller hela utrymmet innanför väggen. Trycket mot väggen gör att växten står upprätt. Cellen spricker inte, eftersom väggen tar emot trycket.",ch:"k13.vakuolen",src:"s. 245–246"},
   tom:{t:"Tomma vakuoler",fl:"Tom vattentank",lb:["Slokande cell",390,30,"m",390,60],d:"Bokens bild av slokande tulpaner har bildtexten \"Tomma vakuoler\". Utan tryck mot väggen slokar växten.",ch:"k13.vakuolen",src:"s. 246"}}};
SC.klor={t:"Kloroplasten på nära håll",vb:"0 0 520 340",d:"Två membran, staplar av tylakoider (grana) och stroma runt omkring.",
  svg:`<g data-k="ytter"><ellipse cx="260" cy="175" rx="215" ry="115" ${fs("--c-chl-soft","--c-chl",4)}/></g>
  <g data-k="inner"><ellipse cx="260" cy="175" rx="202" ry="102" ${st("--c-chl",2.5)}/></g>
  <g data-k="stroma"><ellipse cx="260" cy="175" rx="195" ry="95" fill="transparent"/></g>
  <g data-k="granum">${[[150,160],[240,140],[330,175],[220,215]].map(p=>[0,1,2,3,4].map(j=>`<rect x="${p[0]-22}" y="${p[1]-20+j*9}" width="44" height="7" rx="3.5" ${f("--c-chl")}/>`).join("")).join("")}</g>
  <g data-k="dna"><circle cx="380" cy="120" r="13" ${st("--c-dna",2.5)}/>${dots([[400,220],[150,225],[300,110]],3)}</g>`,
  parts:{
   ytter:{t:"Yttermembran",fl:"Kraftverkets yttervägg",lb:["Yttermembran",500,40,"e",410,82],d:"Kloroplasten har, liksom mitokondrien, dubbla membran. Ett tecken på endosymbios.",ch:"k13.kloroplasten",src:"s. 247"},
   inner:{t:"Innermembran",fl:"Innervägg",lb:["Innermembran",20,40,"s",120,96],d:"Det inre av de två membranen.",ch:"k13.kloroplasten",src:"s. 247"},
   granum:{t:"Granum och tylakoider",fl:"Solpanelerna",lb:["Granum (tylakoider)",20,310,"s",150,190],d:"Tylakoider är platta membranblåsor. En packe av dem kallas granum. Inuti tylakoiderna finns klorofyllet som fångar ljusenergi.",ch:"k13.kloroplasten",src:"s. 247"},
   stroma:{t:"Stroma",fl:"Kraftverkets golv",lb:["Stroma",500,310,"e",360,250],d:"Vattenlösningen runt tylakoiderna, motsvarar mitokondriens matrix.",ch:"k13.kloroplasten",src:"s. 247"},
   dna:{t:"Eget DNA och ribosomer",fl:"Egen ritning",lb:["Ringformat DNA",500,175,"e",393,124],d:"Stroma innehåller, precis som mitokondrien, en ringformad DNA-molekyl, ribosomer och enzymer.",ch:"k13.kloroplasten",src:"s. 247"}}};
SC.holje={t:"Bakteriens hölje: Gram+ och Gram−",vb:"0 0 520 340",d:"Vänster: grampositiv med tjockt peptidoglykan. Höger: gramnegativ med tunt peptidoglykan och ett yttermembran med LPS.",
  svg:`<text x="120" y="24" class="ttl" text-anchor="middle">Grampositiv</text><text x="390" y="24" class="ttl" text-anchor="middle">Gramnegativ</text>
  <g data-k="cm">${bilayer(30,210,250,14,{t:14})}${bilayer(300,480,250,14,{t:14})}</g>
  <g data-k="pg"><rect x="24" y="110" width="192" height="128" ${f("--c-wall-soft")}/>${Array.from({length:8},(_,i)=>`<path d="M24 ${118+i*16} H216" ${st("--c-wall",3)}/>`).join("")}${Array.from({length:12},(_,i)=>`<path d="M${32+i*16} 110 V238" ${st("--c-lyso",1.5)}/>`).join("")}
   <rect x="294" y="212" width="192" height="28" ${f("--c-wall-soft")}/><path d="M294 220 H486 M294 232 H486" ${st("--c-wall",3)}/></g>
  <g data-k="om">${bilayer(300,480,150,14,{t:14})}</g>
  <g data-k="lps">${[310,346,382,418,454].map(x=>`<path d="M${x} 146 V90 M${x} 110 l-10 -14 M${x} 104 l10 -14" ${st("--c-golgi",3)}/>`).join("")}</g>`,
  parts:{
   cm:{t:"Cellmembran",fl:"Tullgränsen",lb:["Cellmembran",260,330,"m",210,300],d:"Båda grupperna har ett vanligt cellmembran innerst.",ch:"k8.byggnad",src:"s. 180"},
   pg:{t:"Peptidoglykan",fl:"Staketet",lb:["Peptidoglykan",260,175,"m",216,175],d:"Tjockt hos grampositiva, mycket tunt hos gramnegativa. Därför behåller bara grampositiva den blå färgen vid gramfärgning, och därför verkar penicillin främst mot dem.",ch:"k8.byggnad",m:"pepg",src:"s. 180, 213"},
   om:{t:"Yttermembran",fl:"Extra yttervägg",lb:["Yttermembran",500,150,"e",482,170],d:"Bara gramnegativa har det. Det skyddar bakterien, även mot vissa antibiotika.",ch:"k8.byggnad",src:"s. 180–181"},
   lps:{t:"Lipopolysackarid (LPS)",fl:"Giftiga flaggor",lb:["LPS",500,70,"e",458,94],d:"En del fosfolipider i yttermembranet är utbytta mot LPS, som kan vara mycket skadliga för människor.",ch:"k8.byggnad",src:"s. 180"}}};
SC.plasmid={t:"Plasmider på nära håll",vb:"0 0 520 340",d:"Bakterien har en stor ringformad kromosom och ofta små plasmider. Plasmider kan flyttas till andra bakterier.",
  svg:`<rect x="20" y="40" width="300" height="260" rx="120" ${fs("--c-bact-soft","--c-bact",3)}/>
  <g data-k="krom"><circle cx="150" cy="170" r="70" ${st("--c-dna",4)}/></g>
  <g data-k="pl"><circle cx="265" cy="110" r="26" ${st("--c-dna",4)}/><path d="M262 84 a26 26 0 0 1 26 18" ${st("--c-mito",7)}/></g>
  <g data-k="pilus"><path d="M318 150 H430" ${st("--muted",4)}/><rect x="430" y="80" width="80" height="140" rx="40" ${fs("--c-bact-soft","--c-bact",3)}/></g>`,
  parts:{
   krom:{t:"Kromosomen",fl:"Huvudritningen",lb:["Kromosom",150,330,"m",150,240],d:"Bakteriens ringformade huvud-DNA.",ch:"k9.delning",src:"s. 182"},
   pl:{t:"Plasmid med resistensgen",fl:"Receptkortet",lb:["Plasmid (resistensgen)",500,40,"e",290,100],d:"Plasmider bär ofta gener för antibiotikaresistens. Plasmider som inte behövs kan försvinna när antibiotikan saknas.",ch:"k9.plasmider",src:"s. 182, 214"},
   pilus:{t:"Konjugation",fl:"Överlämning av receptkort",lb:["Konjugation",380,250,"m",380,152],d:"Vid konjugation förs en plasmid över från en givarcell till en mottagarcell genom en sexpilus. Mottagaren blir själv givare.",ch:"k9.overforing",src:"s. 182 · PPT Antibiotika bild 8"}}};
SC.arkmem={t:"Arkéns membran",vb:"0 0 520 340",d:"Samma grundidé som alla membran, men fosfolipiderna skiljer sig rent kemiskt kraftigt från bakteriers och eukaryoters.",
  svg:`<text x="130" y="30" class="ttl" text-anchor="middle">Bakterie och eukaryot</text><text x="390" y="30" class="ttl" text-anchor="middle">Arké</text>
  <g data-k="vanl">${bilayer(40,220,110,16)}</g>
  <g data-k="ark">${Array.from({length:12},(_,i)=>{const x=300+i*16;return`<circle cx="${x}" cy="110" r="6.7" ${f("--c-arch")}/><circle cx="${x}" cy="166" r="6.7" ${f("--c-arch")}/><path d="M${x} 116 V160" ${st("--c-arch",2.4)}/>`}).join("")}</g>`,
  parts:{
   vanl:{t:"Vanliga fosfolipider",fl:"Standardtegel",lb:["Bakteriers fosfolipider",130,260,"m",130,190],d:"Bakteriers cellmembran har ungefär samma kemiska uppbyggnad som eukaryoters.",ch:"k10.arkeer",src:"s. 180"},
   ark:{t:"Arkéernas fosfolipider",fl:"Annat byggmaterial",lb:["Arkéns fosfolipider",390,260,"m",390,190],d:"Kemiskt kraftigt annorlunda. Ritningen är förenklad: boken säger inte exakt hur de ser ut.",ch:"k10.arkeer",src:"s. 184"}}};
SC.vfast={t:"Viruset fäster på cellen",vb:"0 0 520 340",d:"Virusets ytprotein passar till en receptor på värdcellen, som en nyckel i ett lås.",
  svg:`<rect x="0" y="240" width="520" height="100" ${f("--c-cyto")}/><path d="M0 240 H520" ${st("--c-mem",8)}/>
  <g data-k="rec">${[120,260,400].map(x=>`<path d="M${x} 244 V200 M${x-12} 200 h24 M${x-12} 200 v-14 M${x+12} 200 v-14" ${st("--c-euk",6,'stroke-linecap="round"')}/>`).join("")}</g>
  <g data-k="vir"><circle cx="260" cy="90" r="60" ${fs("--c-vir-soft","--c-vir",4)}/><path d="M260 150 V182 M250 182 h20 v-8 h-20z" ${st("--c-vir",6)}/></g>`,
  parts:{
   vir:{t:"Viruspartikeln",fl:"Kaparen",lb:["Virus",400,60,"s",320,80],d:"Viruset kan bara fästa där ytproteinet passar. Därför infekterar de flesta virus bara en eller några arter.",ch:"k10.virus",src:"s. 185"},
   rec:{t:"Receptorer på värdcellen",fl:"Låsen",lb:["Receptor",120,170,"m",120,190],d:"Cellens receptorer är egentligen till för signalmolekyler. Viruset utnyttjar dem.",ch:"k3.proteiner",src:"s. 19, 185"}}};

/* --- molecules --- */
SC["m.fosfo"]={t:"En fosfolipid",vb:"0 0 520 340",d:"Ett hydrofilt huvud med en fosfatgrupp och två hydrofoba fettsyrasvansar. Den ena svansen har en knyck av en dubbelbindning.",
  svg:`<g data-k="huvud"><circle cx="260" cy="70" r="40" ${f("--c-mem")}/><text x="260" y="79" text-anchor="middle" class="ttl">P</text></g>
  <g data-k="rak"><path d="M240 110 L240 310" ${st("--muted",8,'stroke-linecap="round"')}/></g>
  <g data-k="knyck"><path d="M280 110 L280 200 L310 240 L310 310" ${st("--muted",8,'stroke-linecap="round" stroke-linejoin="round"')}/><path d="M290 205 l22 30" ${st("--c-mito",3)}/></g>`,
  parts:{
   huvud:{t:"Hydrofilt huvud",fl:"Vattenvän",lb:["Huvud med fosfatgrupp",130,40,"m",222,64],d:"Vattenlösligt. Pekar ut mot vattnet på båda sidor av membranet.",ch:"k1.fosfolipider",src:"s. 17 · PPT Bi2 bild 14"},
   rak:{t:"Mättad fettsyra",fl:"Rak svans",lb:["Mättad fettsyra|(rak)",130,230,"m",236,230],d:"Bara enkelbindningar. Raka svansar packas tätt och gör membranet trögare.",ch:"k1.lipider",src:"s. 18 · PPT Bi2 bild 10"},
   knyck:{t:"Omättad fettsyra",fl:"Svans med knyck",lb:["Omättad fettsyra|(knyck)",410,170,"m",312,240],d:"En dubbelbindning ger en knyck. Avståndet mellan molekylerna ökar och membranet håller sig flytande även när det är kallt.",ch:"k3.uppbyggnad",src:"s. 18 · PPT Bi2 bild 12"}}};
SC["m.nukl"]={t:"En nukleotid",vb:"0 0 520 340",d:"Nukleotider är byggstenarna i DNA och RNA: fosfatgrupp, socker och kvävebas.",
  svg:`<g data-k="fosfat"><circle cx="110" cy="170" r="34" ${f("--c-mem")}/><text x="110" y="179" text-anchor="middle" class="ttl">P</text></g>
  <path d="M144 170 H190" ${st("--ink",3)}/>
  <g data-k="socker"><path d="M220 130 L270 145 L262 200 L210 205 L195 160Z" ${fs("--c-golgi","--ink",2,.6)}/></g>
  <path d="M270 160 H320" ${st("--ink",3)}/>
  <g data-k="bas"><rect x="320" y="130" width="120" height="70" rx="10" ${fs("--c-nuc-soft","--c-nuc",3)}/><text x="380" y="173" text-anchor="middle" class="ttl">A G C T U</text></g>`,
  parts:{
   fosfat:{t:"Fosfatgrupp",fl:"Länken i kedjan",lb:["Fosfatgrupp",110,250,"m",110,204],d:"Binder nukleotiderna ihop till en lång kedja.",ch:"k1.nukleotider",src:"PPT Bi2 bild 27"},
   socker:{t:"Socker",fl:"Stommen",lb:["Socker (ribos|eller deoxiribos)",232,60,"m",232,130],d:"Ribos i RNA och deoxiribos i DNA.",ch:"k1.nukleotider",src:"PPT Bi2 bild 27"},
   bas:{t:"Kvävebas",fl:"Bokstaven i ritningen",lb:["Kvävebas",380,250,"m",380,200],d:"A, G, C och T i DNA. I RNA finns U i stället för T. Ordningen på baserna är ritningen.",ch:"k1.nukleotider",src:"PPT Bi2 bild 27–28"}}};
SC["m.atp"]={t:"ATP",vb:"0 0 520 340",d:"Adenosintrifosfat: adenin, ribos och tre fosfatgrupper. När den sista fosfatgruppen lossnar frigörs energi och ATP blir ADP.",
  svg:`<g data-k="adenin"><path d="${hexRing(90,170,34)}" ${fs("--c-nuc-soft","--c-nuc",3)}/><path d="M119 153 L150 140 L160 170 L130 185" ${fs("--c-nuc-soft","--c-nuc",3)}/></g>
  <path d="M160 170 H190" ${st("--ink",3)}/>
  <g data-k="ribos"><path d="M200 140 L245 152 L238 200 L195 205 L182 165Z" ${fs("--c-golgi","--ink",2,.6)}/></g>
  <path d="M245 170 H272" ${st("--ink",3)}/>
  <g data-k="fosf">${[300,370,440].map(x=>`<circle cx="${x}" cy="170" r="26" ${f("--c-mem")}/><text x="${x}" y="178" text-anchor="middle" class="ttl">P</text>`).join("")}<path d="M326 170 H344" ${st("--ink",3)}/></g>
  <g data-k="bind"><path d="M396 170 H414" ${st("--c-mito",6)}/><path d="M405 120 l-10 22 h12 l-10 22" ${st("--t-atp",3)}/></g>`,
  parts:{
   adenin:{t:"Adenin",fl:"Myntets prägling",lb:["Adenin",90,260,"m",90,204],d:"En kvävebas, samma som A i DNA.",ch:"k6.atp",src:"PPT Bi2 bild 29–30"},
   ribos:{t:"Ribos",fl:"Myntets kärna",lb:["Ribos",215,260,"m",215,205],d:"Ett socker med fem kolatomer.",ch:"k6.atp",src:"PPT Bi2 bild 29–30"},
   fosf:{t:"Tre fosfatgrupper",fl:"Tre laddade mynt",lb:["Tre fosfatgrupper",370,260,"m",370,196],d:"Tre fosfat = ATP. Två fosfat = ADP.",ch:"k6.atp",src:"PPT Bi2 bild 29–30"},
   bind:{t:"Energirik bindning",fl:"Myntets värde",lb:["Energirik bindning",405,70,"m",405,118],d:"När bindningen till den sista fosfatgruppen bryts frigörs energi som cellen kan använda, t.ex. i natrium-kaliumpumpen.",ch:"k6.atp",src:"PPT Bi2 bild 30 · s. 35"}}};
SC["m.prot"]={t:"Från aminosyror till protein",vb:"0 0 520 340",d:"Ett protein är en kedja av upp till 20 olika sorters aminosyror i en bestämd ordning. Kedjan veckas till en tredimensionell form.",
  svg:`<g data-k="aa">${Array.from({length:8},(_,i)=>`<circle cx="${50+i*26}" cy="120" r="11" style="fill:var(${["--c-golgi","--c-lyso","--c-nuc","--c-mito","--c-euk","--c-arch","--c-bact","--c-dna"][i]})"/>`).join("")}</g>
  <g data-k="veckat"><path d="M330 90 C420 60 460 140 400 160 C340 180 330 240 410 250 C470 260 470 200 440 190" ${st("--c-nuc",12,'stroke-linecap="round"')}/></g>
  <path d="M260 120 L310 120" ${st("--muted",3)}/><path d="M302 112 l10 8 l-10 8" ${st("--muted",3)}/>`,
  parts:{
   aa:{t:"Aminosyror i en kedja",fl:"Råvarorna på rad",lb:["Aminosyrakedja",140,180,"m",140,132],d:"Upp till 20 sorters aminosyror. Ordningen bestäms av ritningen i DNA och läses av på ribosomen.",ch:"k1.proteiner",src:"PPT Bi2 bild 15–16"},
   veckat:{t:"Veckat protein",fl:"Den färdiga maskinen",lb:["Veckat protein",420,310,"m",420,256],d:"Formen avgör funktionen: enzym, hormon, transportprotein eller hemoglobin.",ch:"k1.proteiner",src:"s. 24 · PPT Bi2 bild 15"}}};
SC["m.cellu"]={t:"Cellulosa",vb:"0 0 520 340",d:"Cellulosa är en polysackarid: många glukosringar kopplade i långa kedjor. Människan kan inte bryta ner den, så den blir kostfiber.",
  svg:`<g data-k="glu"><path d="${hexRing(70,110,24)}" ${fs("--c-golgi","--ink",2,.6)}/></g>
  <g data-k="kedja">${[0,1,2].map(r=>Array.from({length:8},(_,i)=>`<path d="${hexRing(150+i*44,110+r*60,18)}" ${fs("--c-wall-soft","--c-wall",2)}/>`).join("")+`<path d="M168 ${110+r*60} H470" ${st("--c-wall",2)}/>`).join("")}</g>`,
  parts:{
   glu:{t:"Glukos",fl:"En tegelsten",lb:["Glukos",70,180,"m",70,134],d:"En sockerring, C₆H₁₂O₆.",ch:"k1.kolhydrater",src:"PPT Bi2 bild 5"},
   kedja:{t:"Cellulosakedjor",fl:"Muren",lb:["Cellulosakedjor",310,320,"m",310,250],d:"Långa kedjor av glukos som lägger sig bredvid varandra och bildar fibriller i cellväggen.",ch:"k13.cellvaggen",src:"PPT Bi2 bild 7 · s. 244"}}};
SC["m.pepg"]={t:"Peptidoglykan",vb:"0 0 520 340",d:"Långa kedjor av kolhydrater korsbundna till varandra med peptider, korta aminosyrekedjor. Det bildar ett nät runt bakterien.",
  svg:`<g data-k="kh">${[0,1,2].map(r=>Array.from({length:8},(_,i)=>`<path d="${hexRing(80+i*52,80+r*90,16)}" ${fs("--c-wall-soft","--c-wall",2)}/>`).join("")+`<path d="M96 ${80+r*90} H460" ${st("--c-wall",2)}/>`).join("")}</g>
  <g data-k="pep">${[0,1].map(r=>[1,3,5,7].map(i=>`<path d="M${80+i*52} ${96+r*90} V${154+r*90}" ${st("--c-lyso",5)}/>`).join("")).join("")}</g>`,
  parts:{
   kh:{t:"Kolhydratkedjor",fl:"Staketets plankor",lb:["Kolhydratkedja",260,330,"m",260,276],d:"Långa kedjor av sockerringar.",ch:"k8.byggnad",src:"s. 180"},
   pep:{t:"Peptidbryggor",fl:"Spikarna",lb:["Peptider (korsbindningar)",440,40,"e",392,96],d:"Korta aminosyrekedjor som binder ihop kedjorna. Penicillin blockerar enzymet som bygger nätet.",ch:"k11.verkan",src:"s. 180, 213"}}};

AT.SC=SC;
AT.TYPES=[["djur","Djurcell"],["vaxt","Växtcell"],["bakt","Bakterie"],["ark","Arké"],["vir","Virus"]];
})();

const FS={"Ledningskontoret":"Kontoret","Fett- och avgiftningsverkstaden":"Fettverkstan","Sopförbränningen":"Sopugnen","Arbetsbänkarna":"Arbetsbänkar","Ribosomverkstaden":"Ribosom-|verkstan","Förbränningsugnens vägg":"Ugnens vägg","Tullgränsen innanför muren":"Tullgränsen","Packcentralen":"Packhuset","Vattentanken och återvinningen":"Vattentanken","Staketets plankor":"Plankor","Byggställning och järnväg":"Byggställning","Packcentralen och posten":"Packhuset","Hjälper till vid delningen":"Delnings-|hjälp","Arbetsbänkar vid bandet":"Bänkar vid|bandet","Lastbilar till packcentralen":"Lastbilar","Bänkens underdel":"Underdelen","Bänkens överdel":"Överdelen","Budet med råvaror":"Budet","Den färdiga produkten":"Produkten","Murens armeringsjärn":"Armering","Dörren till grannen":"Dörren","Dörrar till grannfabriken":"Dörrar","Kraftverkets yttervägg":"Yttervägg","Kraftverkets innandöme":"Innandömet","En gammal bakteriritning":"Gammal ritning","Gamla arbetsbänkar":"Gamla bänkar","Kontorets väggar":"Väggarna","Kontorets dörrar":"Dörrarna","Ritningarna i pärmar":"Ritningar","Inkommande lastbilar":"Lastbilar in","Expressleverans":"Express","Byggleverans":"Byggleverans","Extra yttervägg":"Ytterväggen","Giftiga flaggor":"Giftflaggor","Ett extra skyddsskikt":"Skyddsskikt","Lösa receptkort":"Receptkort","Ritningen på golvet":"Ritningen","Fabrikens uniform":"Uniformen","Tullgränsens tegel":"Teglet","Myntets prägling":"Präglingen","Tre laddade mynt":"Tre mynt","Myntets kärna":"Kärnan","Myntets värde":"Värdet","Råvarorna på rad":"Råvaror","Den färdiga maskinen":"Maskinen","Staketets plankor ":"Plankor","Uttjänt maskin":"Gammal maskin","Byggstenar tillbaka":"Återvinning","Ugnens flammor":"Flammorna","Standardtegel":"Standard","Annat byggmaterial":"Annat tegel","Kaparens väska":"Väskan","Kaparens ritningar":"Ritningarna","Stulen tullgräns":"Stulen gräns","Falska nycklar":"Nycklar","Full vattentank":"Full tank","Tom vattentank":"Tom tank","Kraftverkets golv":"Golvet","Solpanelerna":"Solpaneler","Överlämning av receptkort":"Överlämning","Rummet för farlig kemi":"Kemirummet","Fett- och avgiftningsverkstaden ":"Fettverkstan","Muren av cellulosa":"Muren","Spikarna":"Spikarna","Bokstaven i ritningen":"Bokstaven","Länken i kedjan":"Länken","Liten förrådstank":"Förrådstank","Fabriksgolvet":"Golvet","Gripklor":"Gripklor","Propellern":"Propellern","Extremverkstäderna":"Extrem-|verkstäder","Kraftverket":"Kraftverket","Kraftverken":"Kraftverk","Solkraftverket":"Solkraftverk","Löpande bandet":"Bandet","Tullgränsen":"Tullgränsen","Staketet":"Staketet","Ytterväggen":"Ytterväggen","Smörjmedlet":"Smörjmedlet","Brevlådan":"Brevlådan","Grinden":"Grinden","Vattenvän":"Vattenvän","Rak svans":"Rak svans","Svans med knyck":"Svans med|knyck","Stommen":"Stommen","Myntets":"Mynt","Turbinhallen":"Turbinhallen","Armering":"Armering","Kaparen":"Kaparen","Låsen":"Låsen","Huvudritningen":"Huvudritning","Receptkortet":"Receptkortet","Innervägg":"Innervägg","Säkerhetsspärren":"Spärren","Återvinningen":"Återvinning","Muren":"Muren","Uttjänt":"Uttjänt","En tegelsten":"Tegelsten","Ritningen":"Ritningen","Tullgräns av annat material":"Annan tullgräns"};
function wrapL(t){if(t.length<=13||t.includes("|"))return t;const mid=t.length/2;let best=-1;for(let i=0;i<t.length;i++){if(t[i]===" "&&(best<0||Math.abs(i-mid)<Math.abs(best-mid)))best=i}return best<0?t:t.slice(0,best)+"|"+t.slice(best+1)}
VIEWS.atlas=function(v,arg){
  v.className="view wide";const SC=AT.SC;
  const parts=[];String(arg||"").split(".").filter(Boolean).forEach((x,i,a)=>{if(x==="m"&&a[i+1]){return}if(i>0&&a[i-1]==="m")parts.push("m."+x);else parts.push(x)});
  const st=G._at||(G._at={type:"djur",path:[],mode:"bio",score:{}});
  if(parts[0]&&AT.TYPES.some(t=>t[0]===parts[0])){st.type=parts[0];st.path=parts.slice(1)}
  const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function sceneKey(){if(!st.path.length)return st.type+".org";const last=st.path[st.path.length-1];return last==="cell"?st.type+".cell":last.startsWith("m.")?last:last}
  function crumbs(){const out=[[SC[st.type+".org"].t,[]]];st.path.forEach((p,i)=>{const k=p==="cell"?st.type+".cell":p;out.push([SC[k]?SC[k].t.replace(/ på nära håll/,""):p,st.path.slice(0,i+1)])});return out}
  v.innerHTML=`<h1>Cellatlasen</h1><p class="muted">Zooma från en hel organism ner till cellen, organellerna och molekylerna. Byt celltyp med knapparna. Läget <b>Fabriken</b> visar delarnas roll i fabriken, och <b>Testa dig</b> döljer namnen.</p>
   <div class="atlas"><div class="abar"><div class="chips" id="atT">${AT.TYPES.map(([k,n])=>`<button type="button" class="chip" data-t="${k}" aria-pressed="${st.type===k}">${n}</button>`).join("")}</div>
    <span class="spacer"></span><div class="seg" id="atM" role="group" aria-label="Etiketter"><button type="button" data-m="bio">Biologi</button><button type="button" data-m="fab">Fabriken</button><button type="button" data-m="test">Testa dig</button></div></div>
    <div class="abar"><nav class="crumbs" id="atC" aria-label="Zoomnivå"></nav><span class="spacer"></span><span class="alv" id="atL"></span></div>
    <div class="stage"><svg id="atS" role="img"></svg></div><div class="ainfo" id="atI" aria-live="polite"></div></div>
   <p class="small muted" style="margin-top:8px">Ritningarna är förenklade efter bokens och lärarens figurer. Källan står vid varje del.</p>`;
  const svg=$("#atS",v),info=$("#atI",v);
  let anim=null;
  function vbArr(s){return s.split(/[ ,]+/).map(Number)}
  function setVB(a){svg.setAttribute("viewBox",a.map(x=>x.toFixed(1)).join(" "))}
  function animVB(from,to,ms,cb){if(reduce||!ms){setVB(to);cb&&cb();return}const t0=performance.now();cancelAnimationFrame(anim);
    const stp=t=>{const k=Math.min(1,(t-t0)/ms);const e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;setVB(from.map((x,i)=>x+(to[i]-x)*e));if(k<1)anim=requestAnimationFrame(stp);else cb&&cb()};anim=requestAnimationFrame(stp)}
  function fitRect(bb,full){const pad=Math.max(bb.width,bb.height)*.35+10;let w=bb.width+pad*2,hh=bb.height+pad*2;const ar=full[2]/full[3];if(w/hh>ar)hh=w/ar;else w=hh*ar;return[bb.x+bb.width/2-w/2,bb.y+bb.height/2-hh/2,w,hh]}
  function render(fromRect){
    const key=sceneKey();const S0=SC[key];if(!S0){st.path=[];return render()}
    const full=vbArr(S0.vb);svg.setAttribute("aria-label",S0.t);
    svg.innerHTML=S0.svg;
    // labels
    const gl=sv("g",{},svg);
    Object.entries(S0.parts).forEach(([k,p])=>{if(!p.lb)return;const [txt,x,y,a,px,py]=p.lb;
      if(px!=null)sv("line",{x1:a==="e"?x+4:a==="s"?x-4:x,y1:a==="m"?(py<y?y-15:y+4):y-5,x2:px,y2:py,class:"lead",style:"stroke:var(--muted);stroke-width:1.2"},gl);
      if(px!=null)sv("circle",{cx:px,cy:py,r:2.6,style:"fill:var(--ink)"},gl);
      const label=st.mode==="fab"?wrapL(FS[p.fl]||p.fl||p.t):st.mode==="test"?"?":txt;const t=labelText(gl,label,x,y,a,"lb halo");t.dataset.k=k;t.style.cursor="pointer";t.addEventListener("click",()=>pick(k))});
    $$("[data-k]",svg).forEach(el=>{if(el.tagName==="text")return;el.classList.add("apart");el.setAttribute("tabindex","0");el.setAttribute("role","button");const p=S0.parts[el.dataset.k];if(p)el.setAttribute("aria-label",st.mode==="test"?"Okänd del":p.t);
      el.addEventListener("click",()=>pick(el.dataset.k));el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();pick(el.dataset.k)}})});
    // crumbs + level
    $("#atC",v).innerHTML="";crumbs().forEach(([n,p],i,arr)=>{const b=h(`<button type="button">${esc(n)}</button>`);if(i===arr.length-1)b.setAttribute("aria-current","true");b.addEventListener("click",()=>goBack(p));$("#atC",v).appendChild(b);if(i<arr.length-1)$("#atC",v).appendChild(h(`<span aria-hidden="true">›</span>`))});
    const lvl=key.endsWith(".org")?0:key.endsWith(".cell")?1:key.startsWith("m.")?3:2;
    $("#atL",v).innerHTML=["Organism","Cell","Organell","Molekyl"].map((n,i)=>`<i class="${i<=lvl?"on":""}" title="${n}"></i>`).join("")+` ${["Organism","Cell","Del","Molekyl"][lvl]}`;
    $$("#atT button",v).forEach(b=>b.setAttribute("aria-pressed",b.dataset.t===st.type?"true":"false"));
    $$("#atM button",v).forEach(b=>b.setAttribute("aria-pressed",b.dataset.m===st.mode?"true":"false"));
    info.innerHTML=`<h3>${esc(S0.t)}</h3><p style="margin:.2rem 0">${tpl(S0.d)}</p>${st.mode==="test"?`<p class="small muted">Testa dig: tryck på en del och välj vad den heter.</p>`:`<p class="small muted">Tryck på en del i bilden.</p>`}`;
    if(fromRect){setVB(fromRect);animVB(fromRect,full,520)}else setVB(full);
  }
  function pick(k){const key=sceneKey();const S0=SC[key];const p=S0.parts[k];if(!p)return;
    $$(".apart",svg).forEach(x=>x.classList.toggle("sel",x.dataset.k===k));
    if(st.mode==="test"){const others=shuffle(Object.keys(S0.parts).filter(x=>x!==k)).slice(0,3).map(x=>S0.parts[x].t);const opts=shuffle([p.t,...others]);
      info.innerHTML=`<h3>Vad heter den markerade delen?</h3><div class="opts" style="margin-top:8px">${opts.map(o=>`<button type="button">${esc(o)}</button>`).join("")}</div><div class="wslot"></div>`;
      $$(".opts button",info).forEach(b=>b.addEventListener("click",()=>{const ok=b.textContent===p.t;$$(".opts button",info).forEach(x=>{x.disabled=true;if(x.textContent===p.t)x.classList.add("right");else if(x===b)x.classList.add("wrong")});
        const sc=st.score[key]=st.score[key]||{};sc[k]=ok;const n=Object.values(sc).filter(Boolean).length;
        $(".wslot",info).innerHTML=`<div class="why ${ok?"ok":"no"}">${ok?"Rätt!":"Det är "+esc(p.t)+"."} ${tpl(p.d)} <span class="small muted">(${n} av ${Object.keys(S0.parts).length} rätt i den här bilden)</span></div>${actions(p,k)}`;bindActions(p,k)}));return}
    info.innerHTML=`<h3>${esc(p.t)}</h3>${p.fl?`<p class="small" style="margin:.1rem 0"><b>Fabriken:</b> ${esc(p.fl)}</p>`:""}<p style="margin:.3rem 0">${tpl(p.d)}</p>${p.src?`<span class="tag src">${esc(p.src)}</span>`:""}${actions(p,k)}`;bindActions(p,k)}
  function actions(p,k){return`<div class="row">${p.z||p.m?`<button class="btn acc sm" type="button" data-a="zoom">Zooma in ⊕</button>`:""}${p.ch?`<a class="btn ghost sm" href="#${p.ch}">Läs i ${esc(chLabel(p.ch.split(".")[0]))} →</a>`:""}</div>`}
  function bindActions(p,k){const z=$("[data-a=zoom]",info);if(z)z.addEventListener("click",()=>zoomInto(k,p))}
  function zoomInto(k,p){const key=sceneKey();const full=vbArr(SC[key].vb);let target=p.z?(p.z===st.type+".cell"?"cell":p.z):"m."+p.m;
    if(target.endsWith(".cell"))target="cell";
    const el=$(`[data-k="${k}"]`,svg);let bb=null;try{bb=el&&el.getBBox()}catch(e){}
    const go=()=>{st.path=st.path.concat(target);render(null);fade()};
    if(bb&&bb.width){animVB(vbArr(svg.getAttribute("viewBox")),fitRect(bb,full),480,go)}else go()}
  function fade(){if(reduce)return;svg.style.transition="none";svg.style.opacity=".2";svg.style.transform="scale(.97)";requestAnimationFrame(()=>{svg.style.transition="opacity .35s, transform .35s";svg.style.opacity="1";svg.style.transform="none"})}
  function goBack(path){if(path.length>=st.path.length)return;const child=st.path[path.length];const parentPath=path;
    st.path=parentPath;const key=sceneKey();const S0=SC[key];svg.innerHTML=S0.svg;
    // find part that zooms to child to start zoomed-in
    let k=Object.keys(S0.parts).find(x=>{const p=S0.parts[x];return (child==="cell"&&p.z&&p.z.endsWith(".cell"))||(p.z===child)||("m."+p.m===child)});
    let from=null;if(k){const el=$(`[data-k="${k}"]`,svg);try{const bb=el.getBBox();if(bb.width)from=fitRect(bb,vbArr(S0.vb))}catch(e){}}
    render(from)}
  $$("#atT button",v).forEach(b=>b.addEventListener("click",()=>{st.type=b.dataset.t;st.path=[];render();fade()}));
  $$("#atM button",v).forEach(b=>b.addEventListener("click",()=>{st.mode=b.dataset.m;render()}));
  render();
};
/* ---------- boot ---------- */
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
