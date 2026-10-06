/* K8 Bakterier. Bok s. 180–182, PPT "Mikroorganismer" bild 18–35, PPT "Antibiotika" bild 16, arbetsblad "Mikroorganismernas värld". */
(function(){
"use strict";
const r1=n=>Math.round(n*10)/10;
const st=(f,s)=>`style="fill:var(${f})${s?";stroke:var("+s+")":""}"`;
function segHTML(id,label,opts,cur){return `<div class="ctl">${label}<div class="seg" role="group" aria-label="${label}" id="${id}">${opts.map(([v,t])=>`<button type="button" data-v="${v}" aria-pressed="${v===cur}">${t}</button>`).join("")}</div></div>`}
function segWire(el,id,fn){const g=el.querySelector("#"+id);g.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{g.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(b.dataset.v)}))}
function segSet(el,id,v){el.querySelectorAll("#"+id+" button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.v===v?"true":"false"))}
function rng(seed){let s=seed>>>0||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function dot(x,y,r,col,sc){return `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" ${st(col,sc)}${sc?' stroke-width="1.5"':""}/>`}
/* trassligt DNA */
function squiggle(seed,cx,cy,rx,ry,n){const R=rng(seed);let d="",x=cx,y=cy;for(let i=0;i<n;i++){const nx=cx+(R()*2-1)*rx,ny=cy+(R()*2-1)*ry;d+=(i?" Q"+r1((x+nx)/2+(R()*2-1)*10)+" "+r1((y+ny)/2+(R()*2-1)*8)+" "+r1(nx)+" "+r1(ny):"M"+r1(nx)+" "+r1(ny));x=nx;y=ny}return d}
/* våg (spirill/spiroket/flagell) */
function wave(x0,x1,y,amp,len){let d=`M${x0} ${y}`;for(let x=x0;x<x1;x+=len/2){const dir=((x-x0)/(len/2))%2?1:-1;d+=` Q${r1(x+len/4)} ${r1(y+dir*amp*2)} ${r1(x+len/2)} ${y}`}return d}
/* fosfolipid-dubbelskikt, liggande */
function bilH(x0,x1,yT,yB,skip){skip=skip||[];const m=(yT+yB)/2;let s=`<rect x="${x0}" y="${yT}" width="${x1-x0}" height="${yB-yT}" ${st("--c-mem-soft")}/>`,t="";
  for(let x=x0+5;x<=x1-3;x+=10){const sk=skip.some(([a,b])=>x>a-5&&x<b+5);
    if(!sk)s+=`<circle cx="${x}" cy="${yT}" r="4" ${st("--c-mem")}/>`;
    s+=`<circle cx="${x}" cy="${yB}" r="4" ${st("--c-mem")}/>`;
    if(!sk)t+=`M${r1(x-1.6)} ${yT+4}V${r1(m-2)}M${r1(x+1.6)} ${yT+4}V${r1(m-2)}`;
    t+=`M${r1(x-1.6)} ${yB-4}V${r1(m+2)}M${r1(x+1.6)} ${yB-4}V${r1(m+2)}`}
  return s+`<path d="${t}" fill="none" style="stroke:var(--c-mem)" stroke-width="1.1"/>`}
/* peptidoglykan: långa kolhydratkedjor (vågräta) korsbundna med peptider (lodräta) */
function pgMesh(x0,x1,yT,yB){let s=`<rect x="${x0}" y="${yT}" width="${x1-x0}" height="${yB-yT}" ${st("--c-wall-soft")}/>`,h="",v="",row=0;
  for(let y=yT+4;y<=yB-3;y+=9){h+=`M${x0+2} ${y}H${x1-2}`;if(y+9<=yB-3){for(let x=x0+8+(row%2)*9;x<x1-4;x+=18)v+=`M${x} ${y}V${y+9}`}row++}
  return s+`<path d="${h}" fill="none" style="stroke:var(--c-wall)" stroke-width="2.4"/><path d="${v}" fill="none" style="stroke:var(--c-golgi)" stroke-width="2"/>`}
const TS='class="sm" style="font-size:13.5px"';

/* ---------- figur: former (bok s. 180) och kockarnas arrangemang (PPT bild 24, 27) ---------- */
function figFormer(){
  const B='style="fill:var(--c-bact-soft);stroke:var(--c-bact)" stroke-width="2"';
  const hit=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="transparent"/>`;
  let s="";
  s+=`<g data-k="kock">${hit(14,22,94,82)}<circle cx="60" cy="62" r="24" ${B}/></g>`;
  s+=`<g data-k="stav">${hit(122,22,110,82)}<path d="M131 56 q-10 -14 -4 -28 M222 68 q10 14 4 28 M150 76 q-4 14 6 22 M200 48 q4 -14 -6 -22" fill="none" style="stroke:var(--c-bact)" stroke-width="1.2"/><rect x="131" y="49" width="90" height="26" rx="13" ${B}/></g>`;
  s+=`<g data-k="spirill">${hit(238,22,110,82)}<path d="${wave(246,338,62,9,36)}" fill="none" style="stroke:var(--c-bact)" stroke-width="11" stroke-linecap="round"/><path d="${wave(246,338,62,9,36)}" fill="none" style="stroke:var(--c-bact-soft)" stroke-width="6" stroke-linecap="round"/><path d="M246 62 q-8 -6 -6 -18 M246 62 q-10 2 -10 14" fill="none" style="stroke:var(--c-bact)" stroke-width="1.2"/></g>`;
  s+=`<g data-k="spiroket">${hit(354,22,110,82)}<path d="${wave(362,454,62,6,12)}" fill="none" style="stroke:var(--c-bact)" stroke-width="3.2" stroke-linecap="round"/></g>`;
  s+=`<path d="M10 134 H460" fill="none" style="stroke:var(--line2)" stroke-width="1" stroke-dasharray="4 4"/>`;
  s+=`<text ${TS} x="235" y="156" text-anchor="middle">Kockar kan sitta ihop på olika sätt (läraren)</text>`;
  s+=`<g data-k="solitar">${hit(30,166,96,52)}<circle cx="78" cy="192" r="13" ${B}/></g>`;
  s+=`<g data-k="diplo">${hit(186,166,98,52)}${dot(222,192,13,"--c-bact-soft","--c-bact")}${dot(248,192,13,"--c-bact-soft","--c-bact")}</g>`;
  let ch="";for(let i=0;i<8;i++){const x=336+i*16,y=200-Math.sin(i/7*Math.PI)*18;ch+=dot(x,y,8,"--c-bact-soft","--c-bact")}
  s+=`<g data-k="strepto">${hit(324,166,136,52)}${ch}</g>`;
  let cl="";[[60,272],[78,268],[96,274],[52,288],[70,286],[88,290],[106,290],[62,304],[80,304],[98,306],[72,256],[90,254]].forEach(p=>cl+=dot(p[0],p[1],9,"--c-bact-soft","--c-bact"));
  s+=`<g data-k="stafylo">${hit(30,244,96,72)}${cl}</g>`;
  let sc="";[[234,266],[256,266],[234,288],[256,288]].forEach(p=>sc+=dot(p[0],p[1],11,"--c-bact-soft","--c-bact"));[[222,276],[244,276],[222,298],[244,298]].forEach(p=>sc+=dot(p[0],p[1],11,"--c-bact-soft","--c-bact"));
  s+=`<g data-k="sarcina">${hit(196,244,82,72)}${sc}</g>`;
  let te="";[[380,270],[404,270],[380,294],[404,294]].forEach(p=>te+=dot(p[0],p[1],12,"--c-bact-soft","--c-bact"));
  s+=`<g data-k="tetrad">${hit(352,244,82,72)}${te}</g>`;
  return s}

/* ---------- figur: typisk gramnegativ bakterie (bok s. 181) ---------- */
function ribos(seed,n,cx,cy,rx,ry,avoid){const R=rng(seed);let s="",k=0,tries=0;while(k<n&&tries<2000){tries++;const x=cx+(R()*2-1)*rx,y=cy+(R()*2-1)*ry;
  if(((x-cx)/rx)**2+((y-cy)/ry)**2>1)continue;if(avoid&&((x-avoid[0])/avoid[2])**2+((y-avoid[1])/avoid[3])**2<1)continue;s+=dot(x,y,2.6,"--ink");k++}return s}
function fimb(){let d="";const add=(x1,y1,x2,y2)=>{d+=`M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}`};
  for(let x=226;x<=296;x+=10){add(x,80,x,70);add(x,200,x,210)}
  for(let a=100;a<=260;a+=16){const r=a*Math.PI/180;add(220+Math.cos(r)*60,140+Math.sin(r)*60,220+Math.cos(r)*70,140+Math.sin(r)*70)}
  for(let a=-80;a<=80;a+=16){if(Math.abs(a)<20)continue;const r=a*Math.PI/180;add(300+Math.cos(r)*60,140+Math.sin(r)*60,300+Math.cos(r)*70,140+Math.sin(r)*70)}
  return `<path d="${d}" fill="none" style="stroke:var(--muted)" stroke-width="1.6" stroke-linecap="round"/>`}
function figCell(){
  let s=`<g data-k="fimbrier">${fimb()}</g>`;
  s+=`<g data-k="flagell"><path d="${wave(360,456,140,7,32)}" fill="none" style="stroke:var(--muted)" stroke-width="3.4" stroke-linecap="round"/></g>`;
  s+=`<g data-k="ytter"><rect x="160" y="80" width="200" height="120" rx="60" ${st("--c-wall-soft","--c-mem")} stroke-width="3"/></g>`;
  s+=`<g data-k="pepti"><rect x="166" y="86" width="188" height="108" rx="54" fill="none" style="stroke:var(--c-wall)" stroke-width="5"/></g>`;
  s+=`<g data-k="inner"><rect x="172" y="92" width="176" height="96" rx="48" ${st("--c-cyto","--c-mem")} stroke-width="3"/></g>`;
  s+=`<g data-k="ribo">${ribos(11,30,260,140,78,40,[262,142,50,26])}${dot(205,170,2.8,"--ink")}</g>`;
  s+=`<g data-k="dna"><path d="${squiggle(5,262,142,40,20,46)}" fill="none" style="stroke:var(--c-dna)" stroke-width="1.8"/></g>`;
  return s}

/* ---------- figur: cellväggen hos grampositiva och gramnegativa (bok s. 180) ---------- */
function lpsChain(x){let s="";for(let y=190;y>=152;y-=8)s+=dot(x,y,3.4,"--c-golgi");
  [[-6,144],[-11,136],[-15,128],[6,144],[11,136],[15,128]].forEach(p=>s+=dot(x+p[0],p[1],3.4,"--c-golgi"));return s}
function figGramVagg(){
  let s=`<g data-k="gpos">`+pgMesh(10,120,166,256)+bilH(10,120,262,292)+`</g>`;
  s+=`<g data-k="gneg">`+bilH(246,356,262,292)+pgMesh(246,356,238,256)+bilH(246,356,206,232,[[266,274],[316,324],[336,344]])+`</g>`;
  s+=`<g data-k="lps">`;[270,320,340].forEach(x=>{s+=lpsChain(x)+`<rect x="${x-6}" y="196" width="12" height="20" rx="5" ${st("--paper","--ink")} stroke-width="1.4"/>`});s+=`</g>`;
  s+=`<path d="M360 118 q6 0 6 8 V150 q0 6 6 8 q-6 2 -6 8 V188 q0 8 -6 8" fill="none" style="stroke:var(--ink)" stroke-width="1.6"/>`;
  return s}

/* ---------- figur: bakteriecellen enligt läraren (PPT bild 35 + 18, Antibiotika bild 16) ---------- */
function figLektion(){
  let s=`<g data-k="flagell"><path d="${wave(358,458,145,7,32)}" fill="none" style="stroke:var(--c-bact)" stroke-width="3.4" stroke-linecap="round"/></g>`;
  s+=`<g data-k="kapsel"><rect x="142" y="82" width="216" height="126" rx="63" ${st("--c-bact-soft","--c-bact")} stroke-width="2" stroke-dasharray="5 3"/></g>`;
  s+=`<g data-k="vagg"><rect x="151" y="91" width="198" height="108" rx="54" ${st("--c-wall-soft","--c-wall")} stroke-width="6"/></g>`;
  s+=`<g data-k="plasma"><rect x="160" y="100" width="180" height="90" rx="45" ${st("--c-cyto","--c-mem")} stroke-width="3"/></g>`;
  s+=`<g data-k="cyto"><rect x="176" y="150" width="30" height="24" fill="transparent"/></g>`;
  s+=`<g data-k="meso"><path d="M226 101 q2 14 -6 16 q-8 2 -6 10 q2 8 10 6 q8 -2 10 6 q2 8 -6 10 q-6 2 -4 8 M246 101 q2 10 -4 14" fill="none" style="stroke:var(--c-mem)" stroke-width="3" stroke-linecap="round"/></g>`;
  s+=`<g data-k="ribo">${ribos(23,22,255,145,76,38,[264,148,46,24])}${dot(192,166,2.8,"--ink")}</g>`;
  s+=`<g data-k="dna"><path d="${squiggle(9,266,148,36,16,40)}" fill="none" style="stroke:var(--c-dna)" stroke-width="1.8"/></g>`;
  s+=`<g data-k="plasmid"><circle cx="312" cy="172" r="7" fill="none" style="stroke:var(--t-plasmid)" stroke-width="2.4"/><circle cx="322" cy="118" r="6" fill="none" style="stroke:var(--t-plasmid)" stroke-width="2.4"/></g>`;
  return s}

G.def({
  id:"k8",
  src:{bok:"s. 180–182",ppt:"Mikroorganismer, bild 18–35 · Antibiotika, bild 16",ab:"Arbetsblad Mikroorganismernas värld (luckorna 4–17 hör hit, hela bladet finns sist)"},
  threads:["vagg","membran","plasmid","ribosom"],
  goals:[
    "beskriva bakteriernas tre former (kock, stav, spirill/spiroket), deras storlek och lärarens arrangemang av kockar",
    "rita och namnge en typisk gramnegativ bakterie med sju delar och deras uppgift, och lärarens extra delar kapsel och mesosom",
    "förklara skillnaden mellan grampositiva och gramnegativa bakterier, vad peptidoglykan och LPS är och vad Grams test visar",
    "förklara vad endosporer är och varför de bildas",
    "skilja på fotoautotrofa och kemoautotrofa bakterier och förklara varför cyanobakterier inte är alger",
    "redogöra för bakteriernas roller i ekosystemen med bokens siffror, och för normalfloran",
    "ge sjukdomar för varje bakterieform enligt läraren, och förklara varför vi kyler, saltar och torkar maten"
  ],
  intro:`<p>I {{go:k7|K7}} mötte du mikroorganismernas värld och de eukaryota mikroorganismerna, som är små men kompletta fabriker med ledningskontor. Nu krymper vi ännu mer. En <b>bakterie</b> är en verkstad i ett enda rum. Där finns inget ledningskontor och inga avdelningar med egna väggar, bara ett rum med ritningarna i en ring på golvet, arbetsbänkar (ribosomer) och en stadig mur runt om. Kapitlet följer boken s. 180–182 och lärarens bilder om bakterier.</p>`,
  secs:[
  {id:"form",h:"Bakteriernas former och storlek",nav:"Former",src:"s. 180 · PPT bild 19–27 · AB lucka 4–7",prov:true,html:`
    <p>Bakterier är, liksom arkéer, <b>encelliga</b> varelser som saknar <b>cellkärna</b> och andra organeller som avgränsas av membran {{prov}}. Därför räknas de till <b>prokaryoterna</b>, en grupp som även omfattar domänen arkéer {{lek:Mikroorganismer bild 22}}. Till skillnad från arkéerna har cellmembranet hos bakterier ungefär samma kemiska uppbyggnad som hos eukaryoter. {{src:s. 180}}</p>
    <div class="box fab"><p>En bakterie är en <b>verkstad i ett enda rum</b>. Den saknar ledningskontor (kärna), löpande band (ER), packcentral (golgi) och kraftverk (mitokondrier), eftersom den inte har några organeller med membran. Allt arbete sker i samma rum, cytoplasman. Ritningarna (DNA) ligger fritt i rummet, och arbetsbänkarna (ribosomerna) står utspridda runt dem.</p></div>
    <div class="box lek"><p>Läraren berättar att de första bakterierna utvecklades för <b>3,5–4 miljarder år sedan</b>. Bakterier finns överallt på jorden och de är ofattbart många. De är encelliga, men vissa arter bildar sammansatta <b>kedjor</b> eller <b>klasar</b>. {{lek:Mikroorganismer bild 21}}</p><p>Dagens bakterier härstammar från jordens mest ursprungliga livsformer, men det betyder inte att de är primitiva. De har utvecklats under miljarder år och är ytterst väl anpassade till dagens miljöer. {{lek:Mikroorganismer bild 20}} Domänträdet finns i {{go:k7.varld|K7}}.</p></div>
    <h3>Tre former</h3>
    <p>En bakterie kan ha tre olika former {{prov}}. Läraren sammanfattar det med rubriken "Bakterierna klassificeras efter sin form". {{lek:Mikroorganismer bild 23}}</p>
    <div class="box key"><p><b>Kock</b> = rund bakterie. <b>Stav</b> = avlång bakterie. <b>Spirill</b> eller <b>spiroket</b> = spiral- eller makaronliknande bakterie. {{prov}} {{src:s. 180}}</p></div>
    <div class="lfig-h" data-fig="former"></div>
    <div class="box trick"><p><b>Kock = Klot, Stav = Stång, Spirill = Spiral.</b> Första bokstäverna matchar formen. En spiroket är en tunnare, tätare korkskruv. {{extra}}</p></div>
    <p>Läraren använder andra ord för samma former. Runda bakterier kallas <b>kocker</b>, avlånga eller stavformade kallas <b>baciller</b> och spiralformiga kallas <b>spiriller</b>. {{lek:Mikroorganismer bild 24–26}} Ordet <i>baciller</i> används också i vardagligt tal, eller när man pratar med barn, om bakterier eller alla smittämnen i stort. {{lek:Mikroorganismer bild 25}}</p>
    <table class="cmp"><tr><th>Form</th><th>Bokens ord</th><th>Lärarens ord</th></tr>
      <tr><td>rund (klot)</td><td>kock</td><td>kocker</td></tr>
      <tr><td>avlång (stav)</td><td>stav</td><td>baciller</td></tr>
      <tr><td>spiral, makaronliknande</td><td>spirill eller spiroket</td><td>spiriller (bild 27: spiriller och spiroketer)</td></tr></table>
    <div class="box lek"><p>Kockar kan sitta ihop på olika sätt {{lek:Mikroorganismer bild 24, 27}}:</p><ul><li><b>solitär kock</b>: en kock som lever ensam</li><li><b>diplokocker</b>: två kockar i par</li><li><b>streptokocker</b>: en kedja av kockar</li><li><b>stafylokocker</b>: en klump som liknar en druvklase</li><li><b>sarcina</b>: åtta kockar i en kub (2 × 2 × 2)</li><li><b>tetrad</b>: fyra kockar i en kvadrat</li></ul></div>
    <div class="box trick"><p><b>Diplo</b> = två (som i diplom med två namn). <b>Strepto</b> = kedja, tänk "streck". <b>Stafylo</b> = druvklase, tänk "stapel av druvor". <b>Tetra</b> = fyra, som i Tetris med fyra rutor.</p></div>
    <h3>Hur stora är bakterier?</h3>
    <p>Bakteriers storlek varierar från <b>några tiondels</b> till <b>något tiotal mikrometer</b> {{src:s. 180}}. En typisk stav kan vara någon mikrometer lång och en halv mikrometer tjock. En typisk kock kan vara en knapp mikrometer i diameter. Därför skulle tiotusentals bakterier kunna ligga ihopträngda i ett enda lager på en punkt som knappt är synlig för ögat. Bakterierna syns alltså inte för blotta ögat {{prov}} {{lek:Mikroorganismer bild 28}}.</p>
    <div class="box extra"><p>Räkneexempel: en punkt som knappt syns är ungefär 0,2 mm = 200 µm bred. Dess yta är ungefär 3,14 × 100 × 100 ≈ 31 000 µm². En kock tar ungefär 1 µm² i anspråk, och därför får omkring 30 000 kockar plats, alltså tiotusentals, precis som boken säger.</p></div>
    <div class="box trap"><p>Både bakterier och arkéer saknar cellkärna. Det som skiljer dem i bokens text på s. 180 är cellmembranets kemi. Bakteriers cellmembran liknar eukaryoternas, men arkéernas gör det inte ({{go:k10.arkeer|K10}}).</p><p>"Bacill" betyder stavformad bakterie. Det är inte ett eget slags organism.</p></div>
    <div class="box link"><p>De organeller med membran som bakterien saknar känner du från {{go:k4|K4 Organellerna}}: kärnan, ER, golgiapparaten, lysosomer, peroxisomer och mitokondrier.</p></div>
    <div class="x" data-x="matchForm"></div>
  `},
  {id:"byggnad",h:"Bakteriecellens delar",nav:"Cellens delar",src:"s. 181 · PPT bild 18, 35 · Antibiotika bild 16 · AB lucka 13–14",prov:true,html:`
    <p>Boken visar hur en typisk <b>gramnegativ</b> bakterie kan se ut. Den har sju delar, och varje del har en uppgift {{prov}}. Vad "gramnegativ" betyder kommer i {{go:k8.gram|nästa avsnitt}}.</p>
    <div class="lfig-h" data-fig="cell"></div>
    <table class="cmp"><tr><th>Del</th><th>Uppgift enligt boken</th></tr>
      <tr><td><b>Yttermembran</b></td><td>skyddar bakterien</td></tr>
      <tr><td><b>Peptidoglykan</b></td><td>ger bakterien struktur och skyddar den</td></tr>
      <tr><td><b>Innermembran</b></td><td>separerar cellens innehåll från omgivningen</td></tr>
      <tr><td><b>Ribosomer</b></td><td>utför proteinsyntes</td></tr>
      <tr><td><b>DNA</b></td><td>bakteriens kromosom</td></tr>
      <tr><td><b>Flagell</b></td><td>ett tjockt utskott av proteiner. Genom att rotera kan den sätta bakterien i rörelse.</td></tr>
      <tr><td><b>Fimbrier</b></td><td>tunna utskott av proteiner. På spetsen sitter ofta ett protein som kan gripa tag i något som bakterien ska hålla sig fast vid.</td></tr></table>
    <p>Flagellen och fimbrierna finns på utsidan, och därför är det de som möter omvärlden. Flagellen roterar som en propeller, och därför kan bakterien simma. Fimbrierna har ett gripande protein på spetsen, och därför kan bakterien fästa sig på ett lämpligt ställe {{prov}}. Arbetsbladet säger att vissa bakterier har en eller flera flageller {{lek:Arbetsblad lucka 13–14}}.</p>
    <div class="box trick"><p><b>Flagell = Fart</b> (tjock, roterar). <b>Fimbrier = Fästa</b> (tunna, griper). Ytter, pepti, inner kommer i ordning utifrån och in, som tre skal på en lök.</p></div>
    <div class="box fab"><p>Verkstadens mur har tre lager: ett yttre skyddsstaket (yttermembranet), en stadig mur av nät (peptidoglykanet) och tullgränsen närmast rummet (innermembranet). Ritningarna (DNA) ligger i en enda ring på golvet. Arbetsbänkarna (ribosomerna) tillverkar proteinerna. Flagellen är verkstadens propeller och fimbrierna dess förtöjningslinor.</p></div>
    <div class="x" data-x="matchDelar"></div>
    <h3>Lärarens bild av bakteriecellen</h3>
    <p>Läraren visar en annan figur, en stavbakterie som är uppskuren så att insidan syns, och en film om bakteriecellens uppbyggnad {{lek:Mikroorganismer bild 35}}. Figuren har åtta etiketter: <b>kapsel</b>, <b>cellvägg</b>, <b>plasmamembran</b>, <b>cytoplasma</b>, <b>DNA</b>, <b>ribosomer</b>, <b>mesosom</b> och <b>flagell</b>. I lärarens avsnittsbild syns också röda ringar, alltså <b>plasmider</b>, och korta hårstrån, alltså fimbrier {{lek:Mikroorganismer bild 18}}. Bilden om gramfärgning märker ut både "DNA (kromosom)" och "DNA (plasmid)" {{lek:Antibiotika bild 16}}.</p>
    <div class="lfig-h" data-fig="lektion"></div>
    <div class="box diff"><p><b>Boken (s. 181):</b> fimbrier, yttermembran, peptidoglykan, innermembran, ribosomer, DNA, flagell. <b>Läraren (bild 35):</b> kapsel, cellvägg, plasmamembran, cytoplasma, DNA, ribosomer, mesosom, flagell.</p><p>Plasmamembran = innermembran = bakteriens cellmembran. Cellväggen är peptidoglykanet (hos gramnegativa plus yttermembranet). <b>Kapsel</b> och <b>mesosom</b> finns inte i boken. Lär dig bokens sju delar först och lärarens extra ord som tillägg.</p></div>
    <table class="cmp"><tr><th>Bokens ord</th><th>Lärarens ord</th><th>Kommentar</th></tr>
      <tr><td>innermembran</td><td>plasmamembran</td><td>samma sak, cellmembranet</td></tr>
      <tr><td>peptidoglykan (+ yttermembran)</td><td>cellvägg</td><td>läraren: "yttre cellmembran" hos gramnegativa</td></tr>
      <tr><td>finns inte</td><td>kapsel</td><td>yttersta lagret i lärarens figur</td></tr>
      <tr><td>finns inte</td><td>mesosom</td><td>veckad struktur vid membranet</td></tr>
      <tr><td>fimbrier</td><td>finns inte i bild 35</td><td>syns som hårstrån i bild 18</td></tr></table>
    <div class="box trap"><p>Bakteriens <b>flagell</b> är ett proteinutskott. <b>Flagellater</b> (gisseldjur) är eukaryota urdjur ({{go:k7.protister|K7}}).</p><p><b>Mesosom</b> och <b>ribosom</b> låter lika. Ribosomen tillverkar proteiner. Mesosomen är lärarens veckade struktur vid membranet.</p><p>Bakteriens <b>DNA</b> ligger fritt i cytoplasman, eftersom det inte finns någon kärna.</p></div>
    <div class="box tr" data-t="ribosom" data-h="Bakteriens arbetsbänkar">Bakterien har ribosomer som utför proteinsyntes, precis som våra celler ({{go:k4.ribosomer|K4}}). Bakteriernas ribosomer skiljer sig ändå från våra, och därför kan vissa antibiotika slå ut dem ({{go:k11.ribosom|K11}}).</div>
    <div class="box tr" data-t="plasmid" data-h="Lösa receptkort">Utöver kromosomen kan bakterien ha små extra DNA-ringar, plasmider, som syns i lärarens bilder. De bär gener som är bra att ha ibland, t.ex. för antibiotikaresistens. Mer i {{go:k9.plasmider|K9}} och {{go:k12.resistens|K12}}.</div>
    <div class="box link"><p>Vem behöver vad? Mitokondrien har ett eget ringformat DNA och egna ribosomer som liknar bakteriens, eftersom den en gång var en bakterie ({{go:k4.mitokondrien|K4}}).</p></div>
  `},
  {id:"gram",h:"Cellväggen och Grams test",nav:"Grampositiv/negativ",src:"s. 180 · Antibiotika bild 16 · AB lucka 8–12",prov:true,html:`
    <p>Utanför cellmembranet har bakterier en <b>cellvägg</b> {{prov}}. Den kan vara uppbyggd på två helt olika sätt. Därför delar man in bakterier i två grupper beroende på typ av cellvägg: <b>grampositiva</b> (Gr⁺) och <b>gramnegativa</b> (Gr⁻). {{src:s. 180}}</p>
    <div class="box diff"><p><b>Boken:</b> "Utanför cellmembranet har bakterier en cellvägg." <b>Arbetsbladet:</b> "Utanför sitt cellmembran har <b>nästan alla</b> bakterier en cellvägg." Arbetsbladet är alltså lite försiktigare. {{lek:Arbetsblad lucka 8}}</p></div>
    <h3>Peptidoglykan</h3>
    <p>Hos de grampositiva bakterierna finns utanför cellmembranet ett <b>tjockt</b> lager av <b>peptidoglykan</b> {{prov}}. Peptidoglykan består av långa kedjor av <b>kolhydrater</b> som är korsbundna till varandra med <b>peptider</b>, alltså korta aminosyrekedjor. Kedjorna är bundna åt två håll, och därför blir lagret ett starkt nät.</p>
    <div class="box trick"><p>Namnet förklarar sig självt: <b>pepti</b>d (korta aminosyrekedjor) + <b>glykan</b> (kolhydratkedjor, jämför glukos). Kolhydraterna är de långa trådarna och peptiderna är stagen emellan.</p></div>
    <p>Även gramnegativa bakterier har ett peptidoglykanlager, men det är mycket <b>tunt</b>. Utanför det omges bakterien i stället av ett <b>yttre membran</b> {{prov}}. Det yttre membranet skiljer sig från vanliga cellmembran, eftersom en del av fosfolipiderna där är utbytta mot så kallade <b>lipopolysackarider</b> (<b>LPS</b>). LPS kan vara mycket skadliga för människor. {{src:s. 180}}</p>
    <div class="lfig-h" data-fig="gramvagg"></div>
    <div class="box trap"><p>Boken har ett tryckfel i figuren på s. 180: där står <b>"pepdidoglykan"</b>. Rätt stavning är <b>peptidoglykan</b>, som i brödtexten. Längre fram i boken (s. 213) och i lärarens antibiotikabilder står <b>"peptidoglukan"</b>. Det är samma ämne ({{go:k11.verkan|K11}}).</p></div>
    <h3>Grams test</h3>
    <p>Bara de grampositiva bakterierna behåller en <b>blå</b> infärgning vid ett test som utvecklades av dansken <b>Hans Christian Gram</b> {{prov}}. Det är därför grupperna heter grampositiva och gramnegativa. Testet "ser" alltså skillnaden i cellväggen: det tjocka peptidoglykanlagret håller kvar färgen.</p>
    <div class="box lek"><p>Läraren beskriver gramfärgningen så här {{lek:Antibiotika bild 16}}:</p><ul><li><b>Grampositiva</b> (G+) har ett plasmamembran och en mycket tjock yttre cellvägg, och färgas <b>blå/lila</b>.</li><li><b>Gramnegativa</b> (G−) har ett plasmamembran, en tunn cellvägg och ett yttre cellmembran, och färgas <b>rosa/röda</b>.</li></ul></div>
    <table class="cmp"><tr><th></th><th>Grampositiva (Gr⁺)</th><th>Gramnegativa (Gr⁻)</th></tr>
      <tr><td>Peptidoglykan</td><td>tjockt lager</td><td>tunt lager</td></tr>
      <tr><td>Yttre membran</td><td>saknas</td><td>finns, med LPS</td></tr>
      <tr><td>Grams test (boken)</td><td>behåller den blå färgen</td><td>behåller inte den blå färgen</td></tr>
      <tr><td>Färg (läraren)</td><td>blå/lila</td><td>rosa/röd</td></tr>
      <tr><td>Penicillin</td><td>verkar framför allt här</td><td>bara vissa varianter, t.ex. ampicillin</td></tr></table>
    <div class="w" data-w="k8Gram"></div>
    <div class="box key"><p><b>Gr⁺</b> = tjockt peptidoglykan, inget yttre membran, behåller blå färg. <b>Gr⁻</b> = tunt peptidoglykan + yttre membran med LPS, behåller inte den blå färgen. Testet är uppkallat efter dansken Hans Christian Gram. {{prov}}</p></div>
    <div class="box trap"><p>Både grampositiva och gramnegativa har peptidoglykan. Skillnaden är tjockleken och det yttre membranet.</p><p>"Positiv" betyder inte farlig. LPS, som kan vara mycket skadliga för människor, finns hos de <b>gramnegativa</b>.</p><p>Boken ritar en <b>gramnegativ</b> bakterie på s. 181. Därför har den ett yttermembran.</p></div>
    <div class="box tr" data-t="vagg" data-h="Bakteriens vägg av peptidoglykan">Bakteriens cellvägg är av peptidoglykan, kolhydratkedjor korsbundna med peptider. Växtens cellvägg är av cellulosa ({{go:k13.cellvaggen|K13}}), och djurceller har ingen cellvägg ({{go:k3.ecm|K3}}). Penicillin stoppar bygget av peptidoglykan, och därför skadar det bakterier men inte oss ({{go:k11.verkan|K11}}).</div>
    <div class="box tr" data-t="membran" data-h="Två membran hos gramnegativa">Innermembranet är ett vanligt cellmembran av fosfolipider, med ungefär samma kemi som hos eukaryoter ({{go:k3.uppbyggnad|K3}}). Gramnegativa har dessutom ett yttre membran där en del fosfolipider är utbytta mot LPS. Arkéernas membran har en annan kemi ({{go:k10.arkeer|K10}}).</div>
    <div class="box link"><p>Antibiotika som slår mot bildandet av peptidoglykan, som penicillin, är framför allt verksamma mot grampositiva bakterier ({{go:k11.verkan|K11}}). Ampicillin verkar även mot gramnegativa ({{go:k11.ampicillin|K11}}).</p></div>
    <div class="x" data-x="tfGram"></div>
  `},
  {id:"endosporer",h:"Endosporer",nav:"Endosporer",src:"PPT bild 29",lek:true,html:`
    <p>En del bakterier kan kopiera sitt DNA och sedan omge kopiorna med mycket motståndskraftiga väggar {{lek:Mikroorganismer bild 29}}. På så sätt bildas <b>endosporer</b>, alltså vilande celler med avstannad ämnesomsättning.</p>
    <div class="box key"><p><b>Endospor</b> = vilande bakteriecell med avstannad ämnesomsättning, där en DNA-kopia omges av en mycket motståndskraftig vägg. Den bildas för att klara <b>torka, värme och näringsbrist</b>, inte för att föröka sig. Den kan vara livskraftig i <b>hundratals år</b>. {{lek:Mikroorganismer bild 29}}</p></div>
    <ol class="chainv"><li>Extrema förhållanden, t.ex. torka, värme eller näringsbrist.</li><li>Bakterien kopierar sitt DNA.</li><li>Kopian omges av en mycket motståndskraftig vägg.</li><li>Ämnesomsättningen stannar av, och cellen vilar.</li><li>Endosporen kan överleva i hundratals år.</li></ol>
    <p>Bakterier bildar alltså inte sporer för att föröka sig. De bildar dem för att överleva, eftersom en vilande cell med tålig vägg och utan ämnesomsättning klarar mer än en aktiv cell.</p>
    <div class="box extra"><p>När förhållandena blir bra igen kan endosporen gro och bli en vanlig, aktiv bakterie. Det står inte på lärarens bild.</p></div>
    <div class="box fab"><p>Verkstaden stänger för vintern. Den gör en kopia av ritningarna, låser in den i ett kassaskåp med tjocka väggar och släcker alla maskiner. Kassaskåpet kan stå i hundratals år och öppnas först när det blir bättre tider.</p></div>
    <div class="box trap"><p>Tre sorters "sporer" som inte har med varandra att göra: <b>endosporer</b> är vilande bakterieceller. <b>Spordjur</b> är en stam urdjur, t.ex. <i class="sp">Plasmodium</i> ({{go:k7.protister|K7}}). <b>Slemsvampens sporer</b> är överlevare som sprids lätt ({{go:k7.slemsvampar|K7}}).</p><p>En endospor är ingen förökning. En bakterie blir en endospor, inte många.</p></div>
    <div class="box link"><p>Endosporer tål värme. Därför räcker det inte alltid att värma maten för att få bort alla bakterier ({{go:k8.mat|Maten nedan}}).</p></div>
    <div class="x" data-x="ordEndo"></div>
  `},
  {id:"naring",h:"Hur bakterier får energi",nav:"Näring",src:"s. 181 · PPT bild 33–34 · AB lucka 15",prov:true,html:`
    <p>Läraren delar in bakterierna efter hur de får sin energi {{lek:Mikroorganismer bild 33}}. <b>Autotrofa</b> bakterier bildar själva sina kolhydrater. De finns i två sorter.</p>
    <table class="cmp"><tr><th>Typ</th><th>Energikälla</th><th>Exempel</th></tr>
      <tr><td><b>Fotoautotrofa</b></td><td>solljus</td><td>cyanobakterier</td></tr>
      <tr><td><b>Kemoautotrofa</b></td><td>oorganiska föreningar</td><td>bildar kolhydrater med energirika oorganiska kemikalier (boken)</td></tr>
      <tr><td><b>Heterotrofa</b></td><td>står bara i lärarens rubrik</td><td>se rutan Extra</td></tr></table>
    <p>Boken säger samma sak om kemoautotroferna: andra bakterier, kallade <b>kemoautotrofer</b>, bildar kolhydrater med hjälp av energirika oorganiska kemikalier {{prov}} {{src:s. 181}}. Läraren säger att <b>kemoautotrofa</b> bakterier använder oorganiska föreningar som energikälla {{lek:Mikroorganismer bild 33}}.</p>
    <div class="box extra"><p><b>Heterotrofa</b> bakterier står bara i rubriken på lärarens bild, utan förklaring. De bildar inte själva kolhydrater, utan tar energi och kol från organiska ämnen, till exempel döda organismer eller andra levande organismer. Det gör även vi människor.</p></div>
    <div class="box trick"><p><b>Foto</b> = ljus (som i fotografi). <b>Kemo</b> = kemikalier. <b>Auto</b> = själv, <b>trof</b> = näring. Autotrof = "gör sin egen mat". <b>Hetero</b> = annan, alltså "äter andras mat".</p></div>
    <h3>Cyanobakterier</h3>
    <p>Många av bakterierna i havet kan utföra fotosyntes. De kallas för <b>cyanobakterier</b> och kallades tidigare för <b>blågröna alger</b> {{prov}} {{src:s. 181}}. Läraren förtydligar: alla arter är inte blågröna, och de är inte alls alger {{lek:Mikroorganismer bild 34}}. De är bakterier, alltså prokaryoter utan cellkärna, medan alger är eukaryoter.</p>
    <div class="box lek"><p>Cyanobakterier har fotosyntes, och man tror att de var viktiga vid syresättningen av jordens atmosfär för cirka <b>3 miljarder år sedan</b>. {{lek:Mikroorganismer bild 34}} Alla algers förmåga till fotosyntes härstammar dessutom från cyanobakterierna {{lek:Mikroorganismer bild 12}}.</p></div>
    <div class="box trap"><p>"Blågröna alger" är ett missvisande namn av två skäl. Cyanobakterier är bakterier, inte alger, och alla är inte blågröna.</p></div>
    <div class="box link"><p>Växter är också fotoautotrofa, med solkraftverk i form av kloroplaster ({{go:k13.kloroplasten|K13}}). Kloroplasten liknar en cyanobakterie, och det är ingen slump ({{go:k13.kloroplasten|endosymbios i K13}}). Arkéer i heta djuphavskällor bildar också kolhydrater ur oorganiska kemikalier ({{go:k7.varld|K7}}).</p></div>
    <div class="x" data-x="sortNaring"></div>
  `},
  {id:"ekosystem",h:"Bakterier i ekosystemen och i kroppen",nav:"Ekosystem",src:"s. 181–182 · PPT bild 22 · AB lucka 15–16",prov:true,html:`
    <p>Bakterier hittar man på de allra flesta platser i naturen {{src:s. 181}}. Läraren säger att de kan hittas i alla ekosystem på jorden och att de utgör en viktig länk i näringskedjor {{lek:Mikroorganismer bild 22}}.</p>
    <table class="cmp"><tr><th>Plats</th><th>Antal bakterier</th><th>Antal arter</th></tr>
      <tr><td>Havsvatten</td><td>ungefär 100 miljoner per <b>deciliter</b></td><td>bortåt 2 000 (Sargassohavet i Karibien)</td></tr>
      <tr><td>Jord</td><td>över en miljard per <b>gram</b></td><td>fler än 10 000 på varje ställe</td></tr>
      <tr><td>Tarmarna</td><td>ca 10 gånger fler än antalet människoceller i en kropp</td><td>500–1 000</td></tr>
      <tr><td>Huden</td><td>stora mängder</td><td>hundratals</td></tr></table>
    <div class="box trick"><p>Jorden vinner båda tävlingarna. Ett gram jord har fler bakterier (över en miljard) än en deciliter havsvatten (100 miljoner), och fler arter på varje ställe (över 10 000 mot 2 000).</p></div>
    <h3>Bakteriernas roller</h3>
    <p>Bakterier spelar viktiga roller i ekosystemen {{prov}} {{src:s. 181}}:</p>
    <ul><li><b>Fotosyntetiserande bakterier</b> är de viktigaste <b>primärproducenterna</b> i haven. De bildar huvuddelen av den kemiska energi, i form av kolhydrater, som andra livsformer utnyttjar.</li><li><b>Kemoautotrofer</b> bildar kolhydrater med hjälp av energirika oorganiska kemikalier.</li><li>Bakterier <b>fixerar och omvandlar kväve</b> i vatten och mark.</li><li>Bakterier <b>löser upp fosfater</b> ur mineraler, så att de kan användas av andra livsformer.</li></ul>
    <p>Utan bakterierna skulle alltså både energi och viktiga grundämnen saknas för andra livsformer. {{extra}} Kväve och fosfor behövs för att bygga till exempel proteiner och nukleotider ({{go:k1.nukleotider|K1}}), och därför är bakteriernas arbete grunden för allt annat liv.</p>
    <div class="box diff"><p><b>Boken:</b> fotosyntetiserande bakterier är de viktigaste primärproducenterna <b>i haven</b> (s. 181). <b>Läraren:</b> de eukaryota <b>algerna</b> står för ca 73–87 % av den globala syreproduktionen {{lek:Mikroorganismer bild 12}}. Svara med boken om haven, och nämn lärarens siffra som "enligt lektionen" ({{go:k7.alger|K7}}).</p></div>
    <h3>Normalfloran</h3>
    <p>Även människans och andra djurs kroppar är hem för stora mängder bakterier. De bakterier som finns på och i vår kropp utan att göra oss sjuka kallas ofta för vår <b>normalflora</b> {{prov}} {{src:s. 181–182}}. På huden finns hundratals olika bakterier. I tarmarna finns mellan 500 och 1 000 olika bakteriearter, och antalet bakterier där är omkring <b>tio gånger</b> så stort som antalet människoceller i en kropp. Bakterier finns också i andra "inbuktningar" i kroppen, som munhålan och vagina.</p>
    <div class="box lek"><p>Läraren säger att det uppskattningsvis finns 10 gånger fler bakterier än människoceller <b>i en människa</b>, och att de flesta finns i tarmen och huden. De flesta är ofarliga, men de kan orsaka infektioner. {{lek:Mikroorganismer bild 22}}</p></div>
    <p>Sammansättningen av bakteriefloran varierar kraftigt från person till person, och dessutom över tiden i en och samma person {{prov}}. Normalfloran är viktig. Den hjälper oss att bryta ner maten, och den sitter i vägen för sjukdomsframkallande bakterier, alltså tar den platsen från dem.</p>
    <ol class="chainv"><li>En nyfödd människas immunförsvar utvecklas i nära samspel med bakteriefloran i tarmarna.</li><li>Floran störs.</li><li>Immunförsvaret utvecklas inte som det ska.</li><li>Ökad risk för allergier och för sjukdomar där immunförsvaret angriper den egna kroppen.</li></ol>
    <div class="box key"><p><b>Normalflora</b> = bakterierna på och i kroppen som inte gör oss sjuka. Den hjälper till att bryta ner maten, sitter i vägen för sjukdomsframkallande bakterier och behövs för att den nyföddas immunförsvar ska utvecklas. Den varierar mellan personer och över tid. {{prov}}</p></div>
    <div class="box fab"><p>Normalfloran är som hyresgästerna i ett fullt hus. Varje rum är redan uthyrt, och därför finns det ingen plats för inbrottstjuvarna, de sjukdomsframkallande bakterierna.</p></div>
    <div class="box trap"><p>Två olika "10 gånger": i tarmen finns ca 10 gånger fler bakterier än människoceller (s. 182). I havet finns minst 10 gånger fler bakterievirus än bakterier ({{go:k10.betydelse|K10}}).</p><p>Enheterna skiljer sig: havet räknas per <b>deciliter</b>, jorden per <b>gram</b>.</p></div>
    <div class="box link"><p>Hur bakterier förökar sig och byter gener kommer i {{go:k9|K9}}.</p></div>
    <div class="x" data-x="chainK8"></div>
  `},
  {id:"sjukdomar",h:"Sjukdomar och bakteriernas form",nav:"Sjukdomar",src:"PPT bild 24–27",lek:true,html:`
    <p>De flesta bakterier är ofarliga, men vissa är <b>sjukdomsalstrare</b> (patogena, se {{go:k7.varld|K7}}). Läraren ordnar exemplen efter bakteriernas form {{lek:Mikroorganismer bild 24–27}}. Bild 24–26 och tabellen på bild 27 kompletterar varandra, så listorna nedan är sammanslagna.</p>
    <table class="cmp"><tr><th>Form</th><th>Sjukdomar enligt läraren</th></tr>
      <tr><td><b>Kocker</b> (runda)</td><td>halsfluss, bihåleinflammation, öroninflammation, lunginflammation, hjärnhinneinflammation (bild 24), gonorré, karies (bild 27)</td></tr>
      <tr><td><b>Baciller</b> (stavar)</td><td>mjältbrand, kikhosta, tuberkulos, stelkramp, spetälska (bild 25 och 27)</td></tr>
      <tr><td><b>Spiriller</b> (spiraler)</td><td>syfilis och kolera (bild 26), magsår och kolera (bild 27)</td></tr></table>
    <p>Många <b>streptokockarter</b> är sjukdomsalstrare {{lek:Mikroorganismer bild 24}}. Streptokocker är kockar som sitter i kedjor ({{go:k8.form|former ovan}}).</p>
    <div class="box diff"><p>Lärarens bilder säger olika om spirillerna. <b>Bild 26:</b> "De bakterier som ger upphov till sjukdomarna syfilis och kolera är spiriller." <b>Bild 27:</b> spiralformade (spiriller och spiroketer) ger magsår och kolera. <b>Kolera</b> finns på båda, så den är säkrast. Kunna gärna alla tre.</p></div>
    <div class="box extra"><p>Syfilis orsakas av en <b>spiroket</b>, magsår av en spiralformad bakterie (<i class="sp">Helicobacter</i>) och kolerabakterien är kommaformad, alltså en böjd stav. Därför hamnar de i gruppen spiralformade.</p></div>
    <div class="box trick"><p><b>Kocker sitter i huvud och hals</b>: hals, bihålor, öron, hjärnhinnor, lungor (plus gonorré och karies). <b>Stavarna är de gamla farsoterna</b>: mjältbrand, kikhosta, tuberkulos, stelkramp, spetälska, "MKTSS". <b>Spiralen vrider magen</b>: kolera och magsår (plus syfilis).</p></div>
    <div class="box link"><p>Flera av sjukdomarna, t.ex. stelkramp, kikhosta och tuberkulos, finns i {{go:k12.vaccin|vaccinationsprogrammet i K12}}. Bakteriesjukdomar behandlas med antibiotika ({{go:k11|K11}}).</p></div>
    <div class="x" data-x="sortForm"></div>
  `},
  {id:"mat",h:"Bakterier i maten",nav:"Maten",src:"PPT bild 28, 30–32",lek:true,html:`
    <p>Bakterier har, till skillnad från virus, <b>egen ämnesomsättning</b>. De kan ta upp syre och näring och avge avfallsprodukter, och de förökar sig genom <b>delning</b> {{lek:Mikroorganismer bild 28}}. Under gynnsamma förhållanden tar en celldelning, en <b>generation</b>, 1–3 timmar. Vissa arter kan dela sig <b>var tjugonde minut</b>. Mer om delningen i {{go:k9.delning|K9}}.</p>
    <p>Bakterier trivs där det är <b>varmt och fuktigt</b> {{lek:Mikroorganismer bild 30}}. Läraren visar ett par sportskor, eftersom svettiga skor är varma och fuktiga, och en kebabtallrik med sås, eftersom mat som står framme länge är en perfekt plats för bakterier {{lek:Mikroorganismer bild 31}}.</p>
    <div class="box lek"><p>"Om mat står länge i hög temperatur så bildas bakterier." {{lek:Mikroorganismer bild 32}}</p></div>
    <div class="box trap"><p>Bakterierna <b>bildas</b> inte ur maten. Det läraren menar är att de bakterier som redan finns i maten <b>förökar sig</b> genom delning. Varm och fuktig mat ger snabb delning, och därför blir de snabbt väldigt många.</p></div>
    <div class="w" data-w="k8Tillvaxt"></div>
    <h3>Tio knep mot bakterier i maten</h3>
    <p>Läraren listar tio sätt att skydda maten: <b>torka, konservera, värma, salta, sockra, syra, röka, kyla, frysa och stråla</b>. "Detta gillar inte bakterierna." {{lek:Mikroorganismer bild 32}} Varje knep tar bort något som bakterierna behöver för att föröka sig. Förklaringarna i tabellen kommer inte från läraren. {{extra}}</p>
    <table class="cmp"><tr><th>Knep</th><th>Varför det fungerar {{extra}}</th></tr>
      <tr><td>Torka</td><td>bakterierna trivs där det är fuktigt, och utan vatten kan de inte föröka sig</td></tr>
      <tr><td>Konservera</td><td>maten hettas upp och försluts lufttätt, och därför kan inga nya bakterier komma in</td></tr>
      <tr><td>Värma</td><td>hög värme dödar bakterierna (endosporer kan dock tåla värme)</td></tr>
      <tr><td>Salta</td><td>saltet drar ut vatten ur bakterierna genom osmos ({{go:k5.osmos|K5}})</td></tr>
      <tr><td>Sockra</td><td>mycket socker drar också ut vatten genom osmos, t.ex. i sylt</td></tr>
      <tr><td>Syra</td><td>de flesta bakterier växer dåligt i sur miljö, t.ex. i ättiksgurka</td></tr>
      <tr><td>Röka</td><td>röken torkar ytan och innehåller ämnen som hämmar bakterier</td></tr>
      <tr><td>Kyla</td><td>i kylan delar sig bakterierna mycket långsammare</td></tr>
      <tr><td>Frysa</td><td>vattnet blir is, och därför kan bakterierna inte föröka sig (de flesta dör inte)</td></tr>
      <tr><td>Stråla</td><td>strålningen skadar bakteriernas DNA</td></tr></table>
    <div class="box trick"><p>Dela upp de tio i grupper: <b>fyra S</b> (salta, sockra, syra, stråla), <b>två kalla</b> (kyla, frysa), <b>två varma</b> (värma, konservera) och <b>två torra</b> (torka, röka). 4 + 2 + 2 + 2 = 10.</p></div>
    <div class="box fab"><p>Varje knep stänger verkstaden på sitt sätt. Kylan sänker takten vid arbetsbänkarna, saltet och sockret suger ut vattnet ur rummet, och strålningen river sönder ritningarna.</p></div>
    <div class="box trap"><p>Kyla och frysning stoppar mest förökningen. Därför ska man inte låta upptinad mat stå varm länge. {{extra}}</p></div>
    <div class="x" data-x="fixK8"></div>
    <div class="x" data-x="whoK8"></div>
    <div class="box link"><p>Hela arbetsbladet "Mikroorganismernas värld" med alla 36 luckor finns här: <a href="#ab">Arbetsbladet som digital lucktext</a>. Luckorna 4–17 hör till det här kapitlet, resten till {{go:k7|K7}}, {{go:k9|K9}} och {{go:k10|K10}}.</p></div>
  `}
  ],
  figs:{
    former:{vb:"0 0 470 344",svg:figFormer(),
      labels:[["kock",60,118,null,null,"m"],["stav",176,118,null,null,"m"],["spirill",292,118,null,null,"m"],["spiroket",408,118,null,null,"m"],
        ["solitär kock",78,236,null,null,"m"],["diplokocker",235,236,null,null,"m"],["streptokocker",392,236,null,null,"m"],
        ["stafylokocker",78,334,null,null,"m"],["sarcina",235,334,null,null,"m"],["tetrad",392,334,null,null,"m"]],
      parts:{
        kock:{t:"Kock",d:"Rund bakterie. En typisk kock är en knapp mikrometer i diameter (bok s. 180). Läraren säger kocker, t.ex. streptokocker och stafylokocker.",go:"k8.form"},
        stav:{t:"Stav",d:"Avlång bakterie, i lärarens ord en bacill. En typisk stav är någon mikrometer lång och en halv mikrometer tjock (bok s. 180). Bokens foto visar tunna trådar, flageller, runt staven."},
        spirill:{t:"Spirill",d:"Spiral- eller makaronliknande bakterie (bok s. 180). Läraren: spiriller ger syfilis och kolera (bild 26), eller magsår och kolera (bild 27).",go:"k8.sjukdomar"},
        spiroket:{t:"Spiroket",d:"Också spiral- eller makaronliknande (bok s. 180). Extra, inte i materialet: den är tunnare och tätare vriden än en spirill. Lärarens tabell (bild 27) skriver \"spiriller och spiroketer\" under spiralformade."},
        solitar:{t:"Solitär kock",d:"En ensamlevande kock. Lärarens tabell, PPT bild 27."},
        diplo:{t:"Diplokocker",d:"Två kockar som sitter ihop i par. Diplo = två. PPT bild 24 och 27."},
        strepto:{t:"Streptokocker",d:"Kockar i en kedja. Många streptokockarter är sjukdomsalstrare (PPT bild 24), t.ex. vid halsfluss.",go:"k8.sjukdomar"},
        stafylo:{t:"Stafylokocker",d:"Kockar i en klump som liknar en druvklase. PPT bild 24 och 27."},
        sarcina:{t:"Sarcina",d:"Åtta kockar i en kub, 2 × 2 × 2. PPT bild 24."},
        tetrad:{t:"Tetrad",d:"Fyra kockar i en kvadrat, 2 × 2. Tetra = fyra. PPT bild 24."}},
      cap:"Överst bokens tre former: kock, stav och spirill eller spiroket (bok s. 180). Nedanför lärarens bild av hur kockar kan sitta ihop (PPT bild 24, 27). Tryck på en form.",src:"Bok s. 180 · PPT Mikroorganismer bild 24, 27"},
    cell:{vb:"0 0 470 280",svg:figCell(),
      labels:[["fimbrier",8,48,226,71,"s"],["yttermembran",8,100,164,120,"s"],["peptidoglykan",8,140,166,140,"s"],["innermembran",8,180,175,157,"s"],
        ["ribosomer",8,222,203,171,"s"],["DNA",262,266,262,152,"m"],["flagell",420,100,418,136,"m"]],
      parts:{
        fimbrier:{t:"Fimbrier",d:"Tunna utskott, uppbyggda av proteiner. På deras spets sitter ofta ett protein som kan gripa tag i något som bakterien ska hålla sig fast vid (bok s. 181)."},
        flagell:{t:"Flagell",d:"Ett tjockt utskott, uppbyggt av proteiner. Genom att rotera kan den sätta bakterien i rörelse (bok s. 181)."},
        ytter:{t:"Yttermembran",d:"Skyddar bakterien (bok s. 181). Finns bara hos gramnegativa. En del av fosfolipiderna är utbytta mot lipopolysackarider (LPS), som kan vara mycket skadliga för människor (s. 180).",go:"k8.gram"},
        pepti:{t:"Peptidoglykan",d:"Ger bakterien struktur och skyddar den (bok s. 181). Långa kolhydratkedjor korsbundna med peptider. Hos gramnegativa är lagret tunt.",go:"k8.gram"},
        inner:{t:"Innermembran",d:"Separerar cellens innehåll från omgivningen (bok s. 181). Det är bakteriens cellmembran, som läraren kallar plasmamembran.",go:"k3.uppbyggnad"},
        ribo:{t:"Ribosomer",d:"Utför proteinsyntes (bok s. 181). Vissa antibiotika slår mot bakteriens ribosomer.",go:"k11.ribosom"},
        dna:{t:"DNA",d:"Bakteriens kromosom (bok s. 181), en cirkulär DNA-molekyl som ligger fritt i cytoplasman, eftersom det inte finns någon cellkärna.",go:"k9.delning"}},
      cap:"En typisk gramnegativ bakterie med bokens sju delar. Tryck på en del för att se vad den gör. Efter bokens figur s. 181.",src:"Bok s. 181"},
    gramvagg:{vb:"0 104 480 220",svg:figGramVagg(),
      labels:[["peptidoglykan",128,214,118,210,"s"],["cellmembran",128,282,118,278,"s"],
        ["polysackarid",238,134,266,150,"e"],["lipid",238,186,264,206,"e"],
        ["lipopoly-|sackarid|(LPS)",378,140,null,null,"s"],
        ["yttermembran",372,224,358,219,"s"],["peptidoglykan",372,252,358,247,"s"],["cellmembran",372,284,358,278,"s"],
        ["grampositiv",65,316,null,null,"m"],["gramnegativ",301,316,null,null,"m"]],
      parts:{
        gpos:{t:"Grampositiv cellvägg",d:"Ett tjockt lager peptidoglykan utanför cellmembranet. Peptidoglykan är långa kedjor av kolhydrater (vågräta i bilden) som är korsbundna med peptider, korta aminosyrekedjor (lodräta). Behåller den blå färgen i Grams test.",go:"k8.gram"},
        gneg:{t:"Gramnegativ cellvägg",d:"Ett tunt lager peptidoglykan och utanför det ett yttre membran. Behåller inte den blå färgen i Grams test.",go:"k8.gram"},
        lps:{t:"Lipopolysackarid (LPS)",d:"I det yttre membranet är en del av fosfolipiderna utbytta mot lipopolysackarider. En LPS-molekyl består av en lipid och en polysackarid. LPS kan vara mycket skadliga för människor (bok s. 180)."}},
      cap:"Cellväggens uppbyggnad hos grampositiva och gramnegativa bakterier. Boken skriver \"pepdidoglykan\" i figuren, ett tryckfel. Efter bokens figur s. 180.",src:"Bok s. 180"},
    lektion:{vb:"0 0 470 290",svg:figLektion(),
      labels:[["kapsel",8,64,161,101,"s"],["cellvägg",8,104,154,127,"s"],["plasmamembran",8,146,160,146,"s"],["cytoplasma",8,188,184,152,"s"],
        ["ribosomer",8,228,191,167,"s"],["mesosom",232,40,229,112,"m"],["DNA",266,268,266,154,"m"],["flagell",420,104,418,141,"m"],["plasmid",440,238,316,177,"m"]],
      parts:{
        kapsel:{t:"Kapsel",d:"Det yttersta lagret i lärarens figur (PPT bild 35). Kapseln finns inte i boken."},
        vagg:{t:"Cellvägg",d:"Lärarens ord för lagret utanför plasmamembranet (PPT bild 35). I boken är det peptidoglykanet, och hos gramnegativa även yttermembranet.",go:"k8.gram"},
        plasma:{t:"Plasmamembran",d:"Lärarens ord för cellmembranet. Boken kallar det innermembran i figuren på s. 181."},
        cyto:{t:"Cytoplasma",d:"Vätskan i verkstadens enda rum. Här ligger DNA, ribosomer och plasmider fritt, eftersom bakterien saknar organeller med membran."},
        meso:{t:"Mesosom",d:"Veckad struktur vid membranet i lärarens figur (PPT bild 35). Finns inte i boken. Blanda inte ihop med ribosom."},
        ribo:{t:"Ribosomer",d:"Utför proteinsyntes (bok s. 181). Blå prickar i lärarens figur.",go:"k11.ribosom"},
        dna:{t:"DNA (kromosom)",d:"Bakteriens kromosom, en cirkulär DNA-molekyl. Lärarens gramfärgningsbild skriver \"DNA (kromosom)\" (Antibiotika bild 16)."},
        flagell:{t:"Flagell",d:"Roterar och sätter bakterien i rörelse (bok s. 181)."},
        plasmid:{t:"Plasmid",d:"Liten extra DNA-ring, \"DNA (plasmid)\" på lärarens bild (Antibiotika bild 16; röda ringar i Mikroorganismer bild 18). Bär t.ex. gener för antibiotikaresistens (bok s. 182).",go:"k9.plasmider"}},
      cap:"Lärarens bild av bakteriecellen med kapsel och mesosom, kompletterad med plasmider från lärarens andra bilder. Ritad efter PPT Mikroorganismer bild 35 och 18 och Antibiotika bild 16.",src:"PPT Mikroorganismer bild 18, 35 · Antibiotika bild 16"}
  },
  ex:{
    matchForm:{ty:"match",h:"Former och arrangemang",src:"s. 180 · PPT Mikroorganismer bild 24–27",pairs:[
      ["Kock","rund bakterie"],["Stav","avlång bakterie, lärarens bacill"],["Spirill","spiral- eller makaronliknande bakterie"],
      ["Diplokocker","två kockar i par"],["Streptokocker","kockar i en kedja"],["Stafylokocker","kockar i en druvklase"],["Sarcina","åtta kockar i en kub"],["Tetrad","fyra kockar i en kvadrat"]]},
    matchDelar:{ty:"match",h:"Delen och dess uppgift",intro:"Bokens lista på s. 181.",src:"s. 181",pairs:[
      ["Yttermembran","skyddar bakterien"],["Peptidoglykan","ger struktur och skyddar"],["Innermembran","separerar cellens innehåll från omgivningen"],
      ["Ribosomer","utför proteinsyntes"],["DNA","bakteriens kromosom"],["Flagell","roterar och sätter bakterien i rörelse"],["Fimbrier","griper tag så att bakterien kan hålla sig fast"]]},
    tfGram:{ty:"tf",h:"Grampositiv eller gramnegativ?",src:"s. 180 · Antibiotika bild 16",items:[
      ["Bara grampositiva bakterier har peptidoglykan.",false,"Båda har peptidoglykan. Grampositiva har ett tjockt lager och gramnegativa ett mycket tunt lager."],
      ["Gramnegativa bakterier har ett yttre membran utanför peptidoglykanet.",true,"Utanför det tunna peptidoglykanlagret omges gramnegativa av ett yttre membran (s. 180)."],
      ["Det är de grampositiva som behåller den blå färgen i Grams test.",true,"Bara de grampositiva behåller den blå infärgningen, eftersom deras tjocka peptidoglykanlager håller kvar färgen."],
      ["LPS finns i cellväggen hos grampositiva bakterier.",false,"LPS sitter i det yttre membranet, och det har bara gramnegativa bakterier."],
      ["Testet utvecklades av dansken Hans Christian Gram.",true,"Boken s. 180. Därav namnen grampositiv och gramnegativ."],
      ["Peptidoglykan är långa kedjor av aminosyror korsbundna med fettsyror.",false,"Peptidoglykan är långa kedjor av kolhydrater korsbundna med peptider, alltså korta aminosyrekedjor."],
      ["Enligt läraren färgas gramnegativa bakterier rosa eller röda.",true,"Antibiotika bild 16: G+ färgas blå/lila och G− rosa/röda."],
      ["Penicillin verkar framför allt mot gramnegativa bakterier.",false,"Penicillin slår mot bildandet av peptidoglykan och verkar därför framför allt mot grampositiva, som har ett tjockt lager (K11)."]]},
    ordEndo:{ty:"order",h:"Så bildas en endospor",intro:"Börja med det som sätter igång processen.",src:"PPT Mikroorganismer bild 29",items:[
      "Bakterien utsätts för torka, värme eller näringsbrist","Bakterien kopierar sitt DNA","Kopian omges av en mycket motståndskraftig vägg","Ämnesomsättningen stannar av och cellen vilar","Endosporen kan vara livskraftig i hundratals år"],
      why:"Endosporer bildas för att klara extrema förhållanden, inte för att föröka sig. Den tåliga väggen och den avstannade ämnesomsättningen gör att de kan överleva i hundratals år."},
    sortNaring:{ty:"sort",h:"Foto, kemo eller båda?",intro:"Sortera påståendena om bakteriernas energi.",src:"s. 181 · PPT Mikroorganismer bild 33–34",cats:["Fotoautotrofa","Kemoautotrofa","Båda"],items:[
      ["Använder solljus som energikälla",0,"Foto = ljus. Läraren bild 33."],
      ["Använder oorganiska föreningar som energikälla",1,"Kemo = kemikalier. Läraren bild 33."],
      ["Cyanobakterier",0,"Cyanobakterier har fotosyntes (s. 181, bild 34)."],
      ["Bildar kolhydrater med hjälp av energirika oorganiska kemikalier",1,"Bokens beskrivning av kemoautotrofer (s. 181)."],
      ["Förr kallade blågröna alger",0,"Cyanobakterierna, som har fotosyntes."],
      ["Viktigaste primärproducenterna i haven",0,"Fotosyntetiserande bakterier (s. 181)."],
      ["Är autotrofa, alltså bildar själva sina kolhydrater",2,"Båda är autotrofa. Skillnaden är energikällan."],
      ["Troligen viktiga när jordens atmosfär syresattes för ca 3 miljarder år sedan",0,"Cyanobakterierna, enligt läraren bild 34."]]},
    chainK8:{ty:"chain",h:"Orsak och verkan",items:[
      {h:"Varför behåller grampositiva den blå färgen?",steps:["Grampositiva har ett tjockt lager peptidoglykan","Det tjocka lagret håller kvar färgen","Bakterien är fortfarande blå efter testet","Den kallas grampositiv"],b:1,w:["Det yttre membranet suger upp färgen","LPS färgar bakterien blå"],why:"Bara de grampositiva behåller den blå infärgningen, eftersom deras tjocka peptidoglykanlager håller kvar färgen (s. 180)."},
      {h:"Normalfloran hos en nyfödd",steps:["Immunförsvaret utvecklas i samspel med tarmfloran","Tarmfloran störs","Immunförsvaret utvecklas inte som det ska","Ökad risk för allergier och autoimmuna sjukdomar"],b:2,w:["Bakterierna tar över immunförsvaret","Barnet får för många vita blodkroppar"],why:"Boken s. 182: störningar i tarmfloran ökar risken för allergier och för sjukdomar där immunförsvaret angriper den egna kroppen."},
      {h:"Kebaben som stod framme",steps:["Det finns några bakterier i maten","Maten står varmt och fuktigt länge","Bakterierna delar sig, kanske var tjugonde minut","Bakterierna blir väldigt många"],b:2,w:["Nya bakterier bildas ur såsen","Bakterierna bildar endosporer och förökar sig"],why:"Bakterierna bildas inte ur maten. De som redan finns förökar sig genom delning, och i värme och fukt går det snabbt (PPT bild 28, 30–32)."},
      {h:"Havets energi",steps:["Cyanobakterier gör fotosyntes","De bildar kolhydrater","Andra livsformer utnyttjar den kemiska energin","Cyanobakterierna är de viktigaste primärproducenterna i haven"],b:1,w:["De bildar metan","De tar upp fosfater ur djuren"],why:"Fotosyntetiserande bakterier bildar huvuddelen av den kemiska energi (kolhydrater) som andra livsformer i haven utnyttjar (s. 181)."}]},
    sortForm:{ty:"sort",h:"Vilken form har sjukdomsalstraren?",intro:"Lärarens exempel på bild 24–27.",src:"PPT Mikroorganismer bild 24–27",cats:["Kocker","Baciller","Spiriller"],items:[
      ["Halsfluss",0,"Kocker (bild 24, 27)."],["Bihåleinflammation",0,"Kocker (bild 24)."],["Öroninflammation",0,"Kocker (bild 24)."],["Lunginflammation",0,"Kocker (bild 24, 27)."],["Hjärnhinneinflammation",0,"Kocker (bild 24)."],["Gonorré",0,"Kocker (bild 27)."],["Karies",0,"Kocker (bild 27)."],
      ["Mjältbrand",1,"Baciller (bild 25)."],["Kikhosta",1,"Baciller (bild 25, 27)."],["Tuberkulos",1,"Baciller (bild 25)."],["Stelkramp",1,"Baciller (bild 25, 27)."],["Spetälska",1,"Baciller (bild 25, 27)."],
      ["Kolera",2,"Spiriller (bild 26 och 27)."],["Syfilis",2,"Spiriller enligt bild 26."],["Magsår",2,"Spiralformade enligt bild 27."]]},
    fixK8:{ty:"fix",h:"Hitta felen i Pelles förklaring",src:"s. 180–181 · PPT bild 29, 32, 34",parts:[
      "Bakterier är encelliga och ",["har en liten cellkärna","saknar cellkärna","Bakterier saknar cellkärna och andra organeller som avgränsas av membran (s. 180)."],
      ". Runt cellmembranet har de en cellvägg av peptidoglykan. I Grams test är det ",["de gramnegativa","de grampositiva","Bara de grampositiva behåller den blå färgen, eftersom deras tjocka peptidoglykanlager håller kvar den (s. 180)."],
      " som behåller den blå färgen. I havet gör ",["algerna cyanobakterier","cyanobakterierna","Cyanobakterier är bakterier, inte alger. De kallades förr blågröna alger (s. 181, bild 34)."],
      " fotosyntes och är de viktigaste primärproducenterna. Vissa bakterier bildar endosporer ",["för att föröka sig snabbt","för att klara torka, värme och näringsbrist","Endosporer är vilande celler. De bildas inte för förökning utan för att klara extrema förhållanden (PPT bild 29)."],
      ", och om mat står varmt länge ",["bildas nya bakterier ur maten","förökar sig bakterierna i maten","Bakterierna bildas inte ur maten. De som redan finns förökar sig genom delning (PPT bild 28, 32)."],"."]},
    whoK8:{ty:"who",h:"Vem är jag?",items:[
      {clues:["Jag var dansk.","Mitt test delar in bakterier i två grupper efter cellväggen.","De bakterier som är positiva i mitt test behåller den blå färgen."],a:"Hans Christian Gram",w:["Alexander Fleming","Louis Pasteur","Robert Koch"],why:"Grams test utvecklades av dansken Hans Christian Gram (s. 180)."},
      {clues:["Jag är uppbyggd av proteiner.","Det sitter ofta ett gripande protein på min spets.","Jag är ett tunt utskott som hjälper bakterien att fästa."],a:"Fimbrier",w:["Flagell","Peptidoglykan","Mesosom"],why:"Fimbrier är tunna proteinutskott som griper tag (s. 181). Flagellen är tjock och roterar."},
      {clues:["Jag kallades förr något som jag inte är.","Alla av mig är inte blågröna.","Jag är en bakterie som gör fotosyntes i havet."],a:"Cyanobakterie",w:["Grönalg","Kemoautotrof bakterie","Arké"],why:"Cyanobakterier kallades förr blågröna alger, men de är bakterier (s. 181, bild 34)."},
      {clues:["Jag har avstannad ämnesomsättning.","Mitt DNA är omgivet av en mycket motståndskraftig vägg.","Jag kan överleva torka, värme och näringsbrist i hundratals år."],a:"Endospor",w:["Plasmid","Spordjur","Kapsel"],why:"Endosporer är vilande bakterieceller (PPT bild 29)."},
      {clues:["Jag sitter i ett yttre membran.","Jag består av en lipid och en polysackarid.","Jag kan vara mycket skadlig för människor."],a:"LPS (lipopolysackarid)",w:["Peptidoglykan","Fosfolipid","Kolesterol"],why:"En del av fosfolipiderna i gramnegativa bakteriers yttre membran är utbytta mot LPS (s. 180)."}]},
    abMikro:{ty:"cloze",h:"Arbetsblad: Mikroorganismernas värld (s. 178–186)",bank:false,src:"Arbetsblad Mikroorganismernas värld",text:"Liksom allt annat levande kan mikroorganismerna delas in i de tre huvudgrupperna [[bakterier|arkéer|eukaryoter|bakterierna]], [[arkéer|bakterier|eukaryoter|arkéerna]] och [[eukaryoter|bakterier|arkéer|eukaryoterna]]. Bakterier saknar [[cellkärna|kärna|cellkärnor]] och andra membranombundna organeller. De kan ha olika form och några exempel är runda celler som kallas för [[kockar|kocker|kock]], avlånga som kallas för [[stavar|stav|baciller|bacill]] och spiralformade som kallas för [[spiriller|spirill|spiroketer|spiroket]]. Utanför sitt cellmembran har nästan alla bakterier en [[cellvägg]]. Om den består av ett tjockt lager av peptidoglykan tillhör bakterien huvudgruppen [[grampositiva|grampositiv|Gr+|Gr⁺|G+]] bakterier. Om detta lager istället är tunt och det finns ett [[yttre|ytter]] [[membran|cellmembran]] utanför tillhör bakterien istället de [[gramnegativa|gramnegativ|Gr-|Gr⁻|G-]] bakterierna. Vissa bakterier har också en eller flera [[flageller|flagell|flagellen]] som gör att de kan röra sig och/eller tunna utskott som kallas för [[fimbrier]] och som hjälper bakterien att fästa sig på lämpligt ställe. Bakterierna spelar en oerhört stor roll i våra ekosystem. Vissa bakterier, som [[cyanobakterier|cyanobakterierna|blågröna alger]], är fotosyntetiserande och producerar mängder av syre i våra hav där de tillhör de viktigaste primärproducenterna. Även på och i våra kroppar finns mängder av bakterier som inte gör oss sjuka utan istället är viktiga för att vi ska må bra. Dessa bakterier som består av en mängd olika arter kallas för vår [[normalflora|normalfloran]] och den skiljer sig åt mellan olika människor och även över tid. Bakterier förökar sig genom [[delning|celldelning|tvådelning]]. Arvsmassan finns lagrad i en [[cirkulär|ringformad]] [[DNA-molekyl|DNA molekyl|dna-molekyl]] som också kallas för en [[kromosom]]. Vissa bakterier kan också ha \"extra-gener\" i s.k. [[plasmider|plasmid]]. Dessa gener är ofta gener som kan vara extra bra att ha om bakterien utsätts för extrema miljöer, exempelvis hög metallhalt eller antibiotika. Trots att bakterier inte har könlig förökning sker det ändå ett utbyte av genetiskt material (gener). Detta kan ske genom att bakterier tar upp DNA från omgivningen. Eftersom döda organismer hela tiden bryts ned frigörs också stora mängder DNA och bakterier kan alltså ibland ta upp bitar av sådant DNA. Detta kallas för [[transformation]]. Ett bakterievirus kan också föra över en eller fler gener från en bakterie till en annan då den infekterar. Detta kallas för [[transduktion]]. Ett tredje sätt på vilket utbyte kan ske är genom [[konjugation]] vilket innebär att bakterier kan föra över plasmider till varandra. Gener kan också byta plats hos en bakterie, så att gener på plasmiden hamnar i kromosomen eller tvärtom. Detta kan ske genom homolog rekombination eller med hjälp av transposoner. [[Arkéer|arkeer|arkébakterier|arkebakterier]] liknar bakterier och räknades förr i tiden till dessa, men med de analyser som numera kan göras har man upptäckt att det finns flera viktiga skillnader. Framförallt skiljer sig cellmembranets huvudkomponenter, [[fosfolipiderna|fosfolipider|fosfolipid]], kemiskt från de hos bakterier och eukaryoter. Denna huvudgrupp av levande organismer finns överallt på jorden. Vissa har påverkan på den globala uppvärmningen eftersom de producerar växthusgasen [[metan|CH4|CH₄|metangas]], men de kan också utnyttjas för att framställa just denna gas som då kallas för biogas och utnyttjas som bränsle. Det finns också arter som kan leva i för oss människor extrema miljöer och de kallas därför för [[extremofiler|extremofila]]. Vissa, [[termofila arkéer|termofila|termofiler|värmeälskande|termofil]], lever i heta källor, medan andra, [[halofiler|halofila|halofil|saltälskande]], kan leva i mycket salta miljöer som Döda havet eller som [[acidofila|acidofiler|acidofil|syraälskande]] i extremt sura miljöer. Virus räknas som en mikroorganism trots att biologer inte är eniga om man ska räkna dem som levande organismer eller ej. De består endast av arvsmassa, [[DNA|RNA]] eller [[RNA|DNA]] inslaget i ett paket med [[proteiner|protein]]. Vissa virus har också ett [[membran|membranhölje|hölje]] utanför detta paket. Virus är parasiter eftersom de inte har någon egen ämnesomsättning och är beroende av att invadera en cell för att reproduktion ska kunna ske. De virus som infekterar bakterier kallas för [[bakteriofager|fager|bakteriofag|fag]]. De spelar en stor roll bl.a. i havet där de infekterar och därmed dödar bakterier i enormt stora mängder. På detta sätt frigörs också mycket DNA vilket får stor påverkan på havet som ekosystem."}
  },
  exOnly:["abMikro"],
  w:{
    /* ---------- bakterietillväxt: generationstid → antal ---------- */
    k8Tillvaxt(el,api){
      el.className="wid";
      el.innerHTML=`<div class="wh"><b>En bakterie i såsen</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0"><svg viewBox="0 0 420 260" role="img" aria-label="Antal bakterier över tid" id="k8-tv-svg"></svg></figure>
      <div><p class="small">En enda bakterie hamnar i kebabsåsen. Välj hur ofta den delar sig och var maten står. Gissa först hur många bakterier det blir på fyra timmar.</p>
      <label class="ctl">Generationstid i värme: <span id="k8-tv-gn">20 min</span><input type="range" id="k8-tv-g" min="20" max="180" step="10" value="20"></label>
      ${segHTML("k8-tv-pl","Var står maten?",[["varm","Framme, varmt"],["kyl","I kylskåpet"]],"varm")}
      <label class="ctl">Tid: <span id="k8-tv-tn">4 h</span><input type="range" id="k8-tv-t" min="0" max="12" step="0.5" value="4"></label>
      <dl class="readout"><dt>Tid per delning</dt><dd id="k8-tv-eg"></dd><dt>Antal generationer</dt><dd id="k8-tv-ng"></dd><dt>Antal bakterier</dt><dd id="k8-tv-n"></dd></dl>
      <p class="verdict" id="k8-tv-vd"></p><p id="k8-tv-why"></p></div></div>`;
      const $=s=>el.querySelector(s),svg=$("#k8-tv-svg");
      const X0=58,X1=404,Y0=222,Y1=24,LMAX=12,TMAX=12;
      const xs=t=>X0+(X1-X0)*t/TMAX,ys=l=>Y0-(Y0-Y1)*Math.min(l,LMAX)/LMAX;
      let g="";[0,3,6,9,12].forEach((l,i)=>{const y=ys(l);g+=`<path d="M${X0} ${y}H${X1}" fill="none" style="stroke:var(--line)" stroke-width="1"/><text class="sm" style="font-size:13.5px" x="${X0-6}" y="${y+4}" text-anchor="end">${["1","tusen","miljon","miljard","biljon"][i]}</text>`});
      [0,2,4,6,8,10,12].forEach(t=>{g+=`<text class="sm" style="font-size:13.5px" x="${xs(t)}" y="${Y0+18}" text-anchor="middle">${t}</text>`});
      g+=`<text class="sm" style="font-size:13.5px" x="${X1}" y="${Y0+34}" text-anchor="end">timmar</text><path d="M${X0} ${Y1}V${Y0}H${X1}" fill="none" style="stroke:var(--ink)" stroke-width="1.5"/>`;
      svg.innerHTML=g+`<path id="k8-tv-r1" fill="none" style="stroke:var(--line2)" stroke-width="1.5" stroke-dasharray="4 4"/><path id="k8-tv-r2" fill="none" style="stroke:var(--line2)" stroke-width="1.5" stroke-dasharray="4 4"/><path id="k8-tv-c" fill="none" style="stroke:var(--c-bact)" stroke-width="3"/><path id="k8-tv-v" fill="none" style="stroke:var(--muted)" stroke-width="1" stroke-dasharray="2 3"/><circle id="k8-tv-m" r="6" style="fill:var(--c-bact);stroke:var(--paper)" stroke-width="2"/>`;
      const curve=gen=>{let d="";for(let t=0;t<=TMAX+1e-9;t+=0.1){const l=t*60/gen*Math.LOG10E*Math.log(2);if(l>LMAX){d+=` L${r1(xs(LMAX*gen/(60*Math.log10(2))))} ${ys(LMAX)}`;break}d+=(d?" L":"M")+r1(xs(t))+" "+r1(ys(l))}return d};
      $("#k8-tv-r1").setAttribute("d",curve(20));$("#k8-tv-r2").setAttribute("d",curve(180));
      let place="varm";
      function fmt(n){if(n<1e4)return Math.round(n).toLocaleString("sv-SE");if(n<1e6)return (Math.round(n/100)*100).toLocaleString("sv-SE");
        const u=[[1e12,"biljoner"],[1e9,"miljarder"],[1e6,"miljoner"]].find(a=>n>=a[0]);const v=n/u[0];return (v>=100?Math.round(v):v.toFixed(1).replace(".",","))+" "+u[1]}
      function upd(){const g0=+$("#k8-tv-g").value,t=+$("#k8-tv-t").value,gen=place==="kyl"?g0*10:g0;
        $("#k8-tv-gn").textContent=g0+" min";$("#k8-tv-tn").textContent=String(t).replace(".",",")+" h";
        const ng=t*60/gen,n=Math.pow(2,ng),l=Math.log10(n);
        $("#k8-tv-eg").textContent=gen>=60?String(Math.round(gen/6)/10).replace(".",",")+" h":gen+" min";
        $("#k8-tv-ng").textContent=String(Math.round(ng*10)/10).replace(".",",");$("#k8-tv-n").textContent=n>1e12?"över en biljon":fmt(n);
        $("#k8-tv-c").setAttribute("d",curve(gen));const mx=xs(t),my=ys(l);$("#k8-tv-m").setAttribute("cx",r1(mx));$("#k8-tv-m").setAttribute("cy",r1(my));$("#k8-tv-v").setAttribute("d",`M${r1(mx)} ${Y0}V${r1(my)}`);
        const vd=$("#k8-tv-vd");let w;
        if(place==="kyl"){vd.className="verdict g";vd.textContent="Kylan bromsar delningen";
          w="I kylskåpet delar sig bakterierna mycket långsammare. Här räknar vi med tio gånger längre generationstid. {{extra}} Därför hinner bakterien bara dela sig "+String(Math.round(ng*10)/10).replace(".",",")+" gånger på "+String(t).replace(".",",")+" timmar. Det är därför kyla och frysning finns bland lärarens tio knep. {{lek:Mikroorganismer bild 32}}"}
        else if(n<1000){vd.className="verdict m";vd.textContent="Än så länge få bakterier";
          w="Varje generation fördubblas antalet, eftersom varje bakterie delar sig i två. I början märks det knappt: 1, 2, 4, 8, 16 … Men fördubblingarna fortsätter så länge maten är varm och fuktig."}
        else if(n<1e6){vd.className="verdict m";vd.textContent="Antalet växer snabbt";
          w="Efter "+String(Math.round(ng*10)/10).replace(".",",")+" generationer har den enda bakterien blivit "+fmt(n)+". Antalet fördubblas varje generation, eftersom varje bakterie delar sig i två. Varje ny fördubbling blir större än alla tidigare tillsammans. Dra i tiden och se vad som händer."}
        else{vd.className="verdict b";vd.textContent="Väldigt många bakterier";
          w="Efter "+String(Math.round(ng*10)/10).replace(".",",")+" generationer har den enda bakterien blivit "+(n>1e12?"över en biljon":fmt(n))+". Antalet fördubblas varje generation, eftersom varje bakterie delar sig i två, och därför växer det explosionsartat. Det är därför mat inte ska stå länge i hög temperatur. {{lek:Mikroorganismer bild 32}}"}
        $("#k8-tv-why").innerHTML=api.tpl(w+" Läraren: en generation tar 1–3 timmar under gynnsamma förhållanden, och vissa arter delar sig var tjugonde minut (de streckade kurvorna). {{lek:Mikroorganismer bild 28}}")}
      ["#k8-tv-g","#k8-tv-t"].forEach(s=>$(s).addEventListener("input",upd));
      segWire(el,"k8-tv-pl",v=>{place=v;upd()});
      upd();
    },
    /* ---------- Grams test ---------- */
    k8Gram(el,api){
      el.className="wid";
      el.innerHTML=`<div class="wh"><b>Grams test</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0"><svg viewBox="0 0 420 260" role="img" aria-label="En grampositiv och en gramnegativ bakterie under Grams test" id="k8-gr-svg"></svg></figure>
      <div><p class="small">Gör testet steg för steg. Gissa innan du tvättar: vilken bakterie behåller den blå färgen?</p>
      <div class="row"><button class="btn sm" type="button" id="k8-gr-1">1. Färga blått</button><button class="btn sm" type="button" id="k8-gr-2">2. Tvätta</button><button class="btn sm" type="button" id="k8-gr-3">3. Färga rosa</button><button class="btn ghost sm" type="button" id="k8-gr-0">Börja om</button></div>
      ${segHTML("k8-gr-gu","Min gissning: blå efter tvätten blir",[["p","grampositiv"],["n","gramnegativ"],["b","båda"]],"")}
      <dl class="readout"><dt>Grampositiv</dt><dd id="k8-gr-rp"></dd><dt>Gramnegativ</dt><dd id="k8-gr-rn"></dd></dl>
      <p class="verdict" id="k8-gr-vd"></p><p id="k8-gr-why"></p></div></div>`;
      const $=s=>el.querySelector(s),svg=$("#k8-gr-svg");
      function rod(cx,neg){const x=cx-46,y=34,w=92,h=176;let s="";
        if(neg){s+=`<rect x="${x-9}" y="${y-9}" width="${w+18}" height="${h+18}" rx="${(w+18)/2}" fill="none" style="stroke:var(--ink)" stroke-width="2.5"/>`;
          s+=`<rect class="k8w" x="${x-4}" y="${y-4}" width="${w+8}" height="${h+8}" rx="${(w+8)/2}" fill="none" style="stroke:var(--c-wall)" stroke-width="3"/>`}
        else s+=`<rect class="k8w" x="${x-7}" y="${y-7}" width="${w+14}" height="${h+14}" rx="${(w+14)/2}" fill="none" style="stroke:var(--c-wall)" stroke-width="13"/>`;
        s+=`<rect class="k8c" x="${x}" y="${y}" width="${w}" height="${h}" rx="${w/2}" style="fill:var(--sunk);stroke:var(--c-mem)" stroke-width="2"/>`;
        s+=`<path d="${squiggle(neg?4:7,cx,y+h/2,22,50,22)}" fill="none" style="stroke:var(--ink)" stroke-width="1.4" opacity=".55"/>`;
        return `<g id="k8-gr-${neg?"n":"p"}">${s}</g>`}
      svg.innerHTML=rod(110,false)+rod(310,true)+`<text class="sm" style="font-size:13.5px" x="110" y="238" text-anchor="middle">grampositiv</text><text class="sm" style="font-size:13.5px" x="110" y="254" text-anchor="middle">tjockt peptidoglykan</text><text class="sm" style="font-size:13.5px" x="310" y="238" text-anchor="middle">gramnegativ</text><text class="sm" style="font-size:13.5px" x="310" y="254" text-anchor="middle">tunt + yttre membran</text>`;
      let step=0,guess="";
      const col={0:["--sunk","--sunk"],1:["--gpos","--gpos"],2:["--gpos","--sunk"],3:["--gpos","--gneg"]};
      const nm={"--sunk":"ofärgad","--gpos":"blå/lila","--gneg":"rosa/röd"};
      function paint(){const c=col[step];[["p",0],["n",1]].forEach(([k,i])=>{const g=$("#k8-gr-"+k);g.querySelector(".k8c").style.fill=`var(${c[i]})`;g.querySelector(".k8w").style.stroke=c[i]==="--sunk"?"var(--c-wall)":`var(${c[i]})`});
        $("#k8-gr-rp").textContent=nm[c[0]];$("#k8-gr-rn").textContent=nm[c[1]];
        $("#k8-gr-2").disabled=step!==1;$("#k8-gr-3").disabled=step!==2;$("#k8-gr-1").disabled=step!==0;
        const vd=$("#k8-gr-vd");let w="";
        if(step===0){vd.className="verdict m";vd.textContent="Två ofärgade bakterier";w="Under mikroskopet syns bakterierna knappt utan färg. Till vänster en grampositiv med tjockt peptidoglykanlager, till höger en gramnegativ med tunt peptidoglykan och ett yttre membran."}
        else if(step===1){vd.className="verdict m";vd.textContent="Båda är blå";w="Den blå färgen tränger in i båda bakterierna. Välj din gissning och tryck sedan på Tvätta. {{extra}} Den blå färgen heter kristallviolett."}
        else{const ok=guess==="p";vd.className="verdict "+(guess?(ok?"g":"b"):"m");
          vd.textContent=step===2?(guess?(ok?"Rätt gissat! Bara den grampositiva är blå":"Inte riktigt. Bara den grampositiva är blå"):"Bara den grampositiva är blå"):"Grampositiv blå, gramnegativ rosa";
          w="Bara de grampositiva bakterierna behåller den blå infärgningen, eftersom de har ett tjockt lager peptidoglykan som håller kvar färgen. De gramnegativa har bara ett tunt lager, och därför tvättas färgen ur. {{prov}} {{src:s. 180}} Testet utvecklades av dansken Hans Christian Gram.";
          if(step===3)w+=" Den andra färgen gör de gramnegativa synliga. Läraren: G+ färgas blåa/lila och G− rosa/röda. {{lek:Antibiotika bild 16}} {{extra}} Tvätten görs med alkohol, och den rosa färgen heter safranin."}
        $("#k8-gr-why").innerHTML=api.tpl(w)}
      $("#k8-gr-1").addEventListener("click",()=>{step=1;paint()});$("#k8-gr-2").addEventListener("click",()=>{step=2;paint()});$("#k8-gr-3").addEventListener("click",()=>{step=3;paint()});
      $("#k8-gr-0").addEventListener("click",()=>{step=0;guess="";segSet(el,"k8-gr-gu","");paint()});
      segWire(el,"k8-gr-gu",v=>{guess=v;if(step>=2)paint()});
      paint();
    }
  }
});

})();
