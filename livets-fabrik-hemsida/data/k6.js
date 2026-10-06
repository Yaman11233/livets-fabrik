/* K6 Energin: ATP. PPT Bi2 bild 22, 27–31 · bok s. 27 (mitokondrien), s. 34–35 (aktiv transport, ATP-pumpar), s. 247 (kloroplasten). */
(function(){
"use strict";
const r1=n=>Math.round(n*10)/10;
const st=(f,s)=>`style="fill:var(${f})${s?";stroke:var("+s+")":""}"`;
const RM=()=>{try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}};
function arr(x1,y1,x2,y2,col,w,hs){const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,h=hs||8;const bx=x2-ux*h,by=y2-uy*h,px=-uy*h*0.6,py=ux*h*0.6;
  return `<path d="M${r1(x1)} ${r1(y1)} L${r1(bx)} ${r1(by)}" fill="none" style="stroke:var(${col})" stroke-width="${w}" stroke-linecap="round"/><polygon points="${r1(x2)},${r1(y2)} ${r1(bx+px)},${r1(by+py)} ${r1(bx-px)},${r1(by-py)}" style="fill:var(${col})"/>`}
function poly(cx,cy,r,n,a0){const p=[];for(let i=0;i<n;i++){const a=a0+i*2*Math.PI/n;p.push(r1(cx+r*Math.cos(a))+","+r1(cy+r*Math.sin(a)))}return p.join(" ")}
/* adenin = sexring + femring (pekar åt höger) */
function adenin(x,y,r,s){s=s||1;const R=r*s,R5=R*0.92,cx5=x+R*Math.cos(Math.PI/6)+R5*Math.cos(Math.PI/5);
  return `<polygon points="${poly(x,y,R,6,Math.PI/6)}" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2"/><polygon points="${poly(cx5,y,R5,5,0)}" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2"/>`}
function ribos(x,y,r){return `<polygon points="${poly(x,y,r,5,-Math.PI/2)}" ${st("--c-mito-soft","--c-mito")} stroke-width="2"/>`}
function fosf(x,y,r,col,txt){return `<circle cx="${x}" cy="${y}" r="${r}" ${st(col||"--good-soft","--good")} stroke-width="2"/>`+(txt===false?"":`<text x="${x}" y="${r1(y+4.5)}" text-anchor="middle" class="sm" style="font-size:13px">P</text>`)}
function bond(x1,y1,x2,y2){return `<path d="M${r1(x1)} ${r1(y1)} L${r1(x2)} ${r1(y2)}" fill="none" style="stroke:var(--ink)" stroke-width="2.4"/>`}
function hiBond(x1,x2,y){const n=4,dx=(x2-x1)/n;let d=`M${x1} ${y}`;for(let i=1;i<=n;i++)d+=` L${r1(x1+i*dx-dx/2)} ${y+(i%2?-5:5)} L${r1(x1+i*dx)} ${y}`;
  return `<path d="${d}" fill="none" style="stroke:var(--bad)" stroke-width="2.6" stroke-linejoin="round"/>`}
function star(x,y,R,col){const p=[];for(let i=0;i<16;i++){const a=-Math.PI/2+i*Math.PI/8,rr=i%2?R*0.55:R;p.push(r1(x+rr*Math.cos(a))+","+r1(y+rr*Math.sin(a)))}return `<polygon points="${p.join(" ")}" ${st(col||"--mid-soft","--mid")} stroke-width="1.6"/>`}
function drop(x,y,s){return `<path d="M${x} ${y-14*s} Q${x+11*s} ${y} ${x+8*s} ${y+6*s} A${9*s} ${9*s} 0 0 1 ${x-8*s} ${y+6*s} Q${x-11*s} ${y} ${x} ${y-14*s} Z" ${st("--c-vac-soft","--c-vac")} stroke-width="1.8"/>`}
/* liten nukleotidglyf: adenin + ribos + n fosfat */
function glyph(x,y,n,s,hi){s=s||1;const r=12*s;let g=adenin(x,y,r);const xr=x+r*0.87+r*0.92*1.81+r*1.25;g+=bond(x+r*0.87+r*0.92*1.81,y,xr-r*0.95,y+2*s)+ribos(xr,y+2*s,r*0.95);
  let px=xr+r*0.95;for(let i=0;i<n;i++){const cx=px+(i?22*s:20*s);g+=(i===2&&hi?hiBond(px,cx-9*s,y+2*s):bond(px,y+2*s,cx-9*s,y+2*s))+fosf(r1(cx),r1(y+2*s),9*s,i===2&&hi==="new"?"--t-atp":"--good-soft",s>=1.2);px=cx+9*s}
  return g}
const TW='class="lbs halo" style="font-size:14px"';
const T12='class="lbs" style="font-size:12px"';

/* ---------- figur 1: ATP-molekylen och hydrolysen (PPT Bi2 bild 29) ---------- */
function figAtp(){
  let s=`<g data-k="atp">`+adenin(100,118,22)+bond(152,118,172,121)+ribos(190,121,20)+bond(209,121,240,121)+fosf(256,121,16)+bond(272,121,288,121)+fosf(304,121,16)+hiBond(320,344,121)+fosf(360,121,16)+`</g>`;
  s+=arr(230,148,230,200,"--ink",3,11)+drop(198,172,1);
  s+=`<g data-k="adp">`+adenin(90,248,22)+bond(142,248,162,251)+ribos(180,251,20)+bond(199,251,230,251)+fosf(246,251,16)+bond(262,251,278,251)+fosf(294,251,16)+`</g>`;
  s+=`<text x="322" y="257" text-anchor="middle" ${TW}>+</text>`+fosf(352,251,16)+`<text x="383" y="257" text-anchor="middle" ${TW}>+</text>`+star(420,250,22);
  return s}

/* ---------- figur 2: ATP–ADP-cykeln (PPT Bi2 bild 30) ---------- */
function figCykel(){
  const cx=230,cy=165,R=120,P=t=>[cx+R*Math.cos(t*Math.PI/180),cy+R*Math.sin(t*Math.PI/180)];
  function arc(a,b,col){const [x1,y1]=P(a),[x2,y2]=P(b),[x3,y3]=P(b-6);
    return `<path d="M${r1(x1)} ${r1(y1)} A${R} ${R} 0 0 1 ${r1(x3)} ${r1(y3)}" fill="none" style="stroke:var(${col})" stroke-width="4"/>`+arr(x3,y3,x2,y2,col,4,13)}
  let s=glyph(176,40,3,1,true)+glyph(176,290,2,1);
  const [a1,b1]=P(-22),[a2,b2]=P(22),[c1,d1]=P(158),[c2,d2]=P(202);
  s+=`<g data-k="ner"><rect x="300" y="50" width="160" height="230" fill="transparent"/>`+arc(-58,58,"--bad")+arr(a1,b1,384,100,"--bad",2.5,9)+fosf(396,92,11)+arr(a2,b2,378,226,"--bad",2.5,9)+star(396,240,18)+`</g>`;
  s+=`<g data-k="upp"><rect x="0" y="50" width="160" height="230" fill="transparent"/>`+arc(122,238,"--good")+star(66,96,18)+arr(80,108,c2-4,d2-2,"--good",2.5,9)+fosf(74,236,11)+arr(84,228,c1-4,d1+2,"--good",2.5,9)+`</g>`;
  return s}

/* ---------- figur 3: mitokondrien som kraftverk (bok s. 27) ---------- */
function figMito(){
  const cx=230,cy=150,RX=138,RY=73,yb=(x,top)=>{const q=1-Math.pow((x-cx)/RX,2);return cy+(top?-1:1)*RY*Math.sqrt(Math.max(q,0))};
  let s=`<g data-k="ytt"><ellipse cx="${cx}" cy="${cy}" rx="150" ry="85" ${st("--paper","--c-mito")} stroke-width="4"/></g>`;
  s+=`<g data-k="matrix"><ellipse cx="${cx}" cy="${cy}" rx="${RX}" ry="${RY}" ${st("--c-mito-soft","--c-mito")} stroke-width="3"/></g>`;
  let f="";
  [130,175,220,265,310].forEach(x=>{const y=yb(x,true);f+=`M${x} ${r1(y-3)} L${x} ${r1(y+38)}`});
  [152,197,242,287,332].forEach(x=>{const y=yb(x,false);f+=`M${x} ${r1(y+3)} L${x} ${r1(y-38)}`});
  s+=`<g data-k="inre"><path d="${f}" fill="none" style="stroke:var(--c-mito)" stroke-width="14" stroke-linecap="round"/><path d="${f}" fill="none" style="stroke:var(--paper)" stroke-width="8" stroke-linecap="round"/>`;
  s+=`</g>`;
  /* elektrontransportkedjan: små proteiner på vecket */
  s+=[[212,88],[228,98],[212,108],[228,118]].map(p=>`<rect x="${p[0]-4}" y="${p[1]-4}" width="8" height="8" rx="2" ${st("--t-atp","--ink")} stroke-width="1"/>`).join("");
  /* DNA-ring och ribosomer */
  s+=`<g data-k="dna"><path d="M178 150 C170 136 196 128 204 140 C212 152 196 168 186 162 C176 156 186 146 194 150" fill="none" style="stroke:var(--c-dna)" stroke-width="2.6"/></g>`;
  s+=[[248,150],[258,160],[244,166],[262,143],[120,150],[112,162]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3" ${st("--ink")}/>`).join("");
  /* energi ur födan in */
  s+=arr(30,132,114,142,"--good",3,11);
  /* ATP ut */
  s+=arr(352,104,392,82,"--t-atp",3,10)+[[404,70],[428,88],[404,104]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="10" ${st("--t-atp","--ink")} stroke-width="1.2"/>`).join("");
  /* spillvärme */
  s+=[0,12,24].map(i=>`<path d="M${352+i} 232 q6 -6 0 -12 q-6 -6 0 -12 q6 -6 0 -12" fill="none" style="stroke:var(--bad)" stroke-width="2.2"/>`).join("");
  return s}

/* ---------- figur 4: kreatinfosfat laddar ADP (PPT Bi2 bild 31) ---------- */
function figKrea(){
  let s=`<rect x="64" y="44" width="80" height="34" rx="10" ${st("--c-golgi","--ink")} stroke-width="1.5" opacity=".85"/>`+bond(144,61,156,61)+fosf(172,61,16);
  s+=`<text x="205" y="67" text-anchor="middle" ${TW}>+</text>`+glyph(240,60,2,1);
  s+=`<path d="M172 40 Q250 -6 330 46" fill="none" style="stroke:var(--t-atp)" stroke-width="2.6" stroke-dasharray="6 5"/>`+arr(322,38,333,50,"--t-atp",2.6,10);
  s+=arr(205,92,205,140,"--ink",3,11);
  s+=`<rect x="64" y="160" width="80" height="34" rx="10" ${st("--c-golgi","--ink")} stroke-width="1.5" opacity=".85"/>`;
  s+=`<text x="205" y="183" text-anchor="middle" ${TW}>+</text>`+glyph(240,176,3,1,"new");
  return s}

G.def({
  id:"k6",
  src:{bok:"s. 27 (mitokondrien) · s. 34–35 (aktiv transport, ATP-drivna pumpar) · s. 247 (kloroplasten)",ppt:"Bi2 bild 22, 27–31 · Transport över membran bild 15–17, 19"},
  threads:["atp","endo","membran"],
  goals:[
    "beskriva ATP:s byggnad (ribos, adenin, tre fosfatgrupper) och skillnaden mot ADP",
    "förklara var energin i ATP sitter och vad som händer vid hydrolysen ATP → ADP + fosfat",
    "rita och förklara ATP–ADP-cykeln och varför ATP hela tiden måste återbildas",
    "förklara hur kreatinfosfat fungerar som ett snabbladdat reservbatteri i musklerna",
    "förklara varför mitokondrien kallas cellens kraftverk och varför det inre membranet är veckat",
    "ge exempel på vad cellen använder ATP till, med natrium-kaliumpumpen som största kund",
    "känna igen två fel i lärarens bild 29 och ge den korrekta versionen"
  ],
  intro:`<p>Allt som händer i cellfabriken kostar något. Pumparna i tullgränsen ({{go:k5.pumpen|K5}}), lastbilarna vid lastkajen och musklernas arbete betalas med samma valuta, <b>ATP</b>. Det här kapitlet handlar om myntet själv, om reservkassan i musklerna och om kraftverket som präglar nya mynt.</p>`,
  secs:[
  {id:"atp",h:"ATP, fabrikens mynt",nav:"ATP och ADP",src:"PPT Bi2 bild 27–30 · s. 27, 35",prov:true,html:`
    <h3>En nukleotid som bär energi</h3>
    <p>Läraren tar upp <b>nukleotider</b> som en egen grupp av viktiga molekyler, vid sidan av kolhydrater, lipider, proteiner och nukleinsyror. En nukleotid består av en <b>fosfatgrupp</b>, ett socker (en <b>monosackarid</b>, ribos eller deoxiribos) och en <b>kvävebas</b>. {{lek:Bi2 bild 27}}</p>
    <p>Nukleotiderna har två roller. De bygger upp nukleinsyrorna DNA och RNA, och de fungerar som <b>energibärare</b>. {{lek:Bi2 bild 28}} Mer om nukleotidens delar finns i {{go:k1.nukleotider|K1}}.</p>
    <h3>ATP:s byggnad</h3>
    <p><b>ATP</b> (<b>adenosintrifosfat</b>) är den viktigaste energibärande molekylen i cellen. Den består av ett socker (<b>ribos</b>), en kvävebas (<b>adenin</b>) och <b>tre fosfatgrupper</b>. {{lek:Bi2 bild 29}}</p>
    <p><b>ADP</b> (<b>adenosindifosfat</b>) har bara <b>två fosfatgrupper</b>. Namnen förklarar sig själva, eftersom <i>tri</i> betyder tre och <i>di</i> betyder två. {{lek:Bi2 bild 29}}</p>
    <div class="box key"><p><b>ATP</b> = ribos + adenin + <b>tre</b> fosfatgrupper. <b>ADP</b> = ribos + adenin + <b>två</b> fosfatgrupper. {{lek:Bi2 bild 29}}</p></div>
    <div class="box diff" data-h="Stavfel i lärarens bild"><p><b>Lärarens bild 29:</b> "Adenosin<b>tris</b>fosfat" och "Adenosin<b>dis</b>fosfat". <b>Korrekt:</b> adenosin<b>tri</b>fosfat och adenosin<b>di</b>fosfat. Skriv den korrekta formen på provet. {{diff:stavfel i PPT Bi2 bild 29}}</p></div>
    <h3>Var sitter energin?</h3>
    <p>Bindningen mellan den <b>andra och den tredje fosfatgruppen</b> innehåller mycket energi. När den tredje fosfatgruppen lossnar frigörs energin, och ATP blir ADP. {{lek:Bi2 bild 29}}</p>
    <p>För att bindningen ska brytas behövs <b>vatten</b>. Därför kallas reaktionen <b>hydrolys</b> (<i>hydro</i> = vatten, <i>lys</i> = upplösning). Boken beskriver samma sak när den förklarar pumparna. ATP <b>hydrolyseras till ADP</b> och "tappar" ett fosfat, och energin som frigörs driver pumpen. {{prov}} {{src:s. 35 · PPT Bi2 bild 29}}</p>
    <div class="lfig-h" data-fig="atp"></div>
    <div class="box key" data-h="Hydrolysen"><p>ATP + vatten → ADP + fosfat + <b>energi</b> {{prov}} {{src:s. 35 · PPT Bi2 bild 29}}</p></div>
    <div class="box diff" data-h="Fel i lärarens bild 29"><p><b>Lärarens bild 29:</b> "Vatten och kreatinfosfat behövs när ATP frigör energi (hydrolys)."</p><p><b>Korrekt:</b> Bara <b>vatten</b> behövs för hydrolysen. Kreatinfosfat används åt andra hållet, för att <b>återbilda</b> ATP från ADP. Det står i lärarens egen bild 31 ("Kreatinfosfat + ADP → Kreatin + ATP"), och boken s. 35 säger bara att ATP hydrolyseras till ADP. {{diff:PPT bild 29 motsäger bild 31}}</p></div>
    <h3>ATP–ADP-cykeln</h3>
    <p>ADP kastas inte bort. ADP kan ta upp den tredje fosfatgruppen igen med hjälp av energi och på så sätt <b>återbilda ATP</b>. {{lek:Bi2 bild 29}} Energin till återbildningen kommer från <b>födan</b>. {{lek:Bi2 bild 30}}</p>
    <p>Boken säger var det sker. I mitokondrien utvinns energi ur födan, och en del av den fångas in och används för att bilda ATP. <b>De flesta ATP-molekyler bildas i mitokondrien</b> och används för att driva alla energikrävande processer i cellen. {{prov}} {{src:s. 27 · PPT Bi2 bild 22, 30}}</p>
    <div class="lfig-h" data-fig="cykel"></div>
    <ol class="chainv"><li>Cellen behöver energi till ett arbete, till exempel en pump.</li><li>ATP hydrolyseras. Den tredje fosfatgruppen lossnar och energi frigörs.</li><li>Kvar blir ADP och ett fosfat.</li><li>Energi från födan (i mitokondrien) sätter tillbaka fosfatet på ADP.</li><li>Nu finns ATP igen, redo att användas.</li></ol>
    <p>Därför måste ATP <b>hela tiden återbildas</b>. Varje gång cellen betalar för ett arbete blir ett ATP till ADP, och cellen arbetar oavbrutet. Om återbildningen stannar tar ATP slut, och då stannar också allt som drivs av ATP. Samma molekyler används alltså om och om igen, som mynt som går runt i en kassa.</p>
    <table class="cmp"><tr><th></th><th>ATP</th><th>ADP</th></tr>
      <tr><td>Hela namnet</td><td>adenosintrifosfat</td><td>adenosindifosfat</td></tr>
      <tr><td>Fosfatgrupper</td><td>tre</td><td>två</td></tr>
      <tr><td>Energi</td><td>"laddad", kan frigöra energi</td><td>"urladdad", måste laddas</td></tr>
      <tr><td>Bildas när</td><td>ADP + fosfat får energi (från födan)</td><td>ATP hydrolyseras</td></tr></table>
    <div class="box trick"><p><b>Tri = tre, di = två.</b> En trehjuling har tre hjul. Tappar den ett hjul blir den en tvåhjuling, och då har energin redan använts.</p><p>"<b>Tre-T</b>ar, <b>Två-T</b>ömd": ATP har tre fosfat och är laddat, ADP har två och är tömt.</p></div>
    <div class="box fab"><p>ATP är <b>fabrikens mynt</b>. Ett ATP är ett laddat mynt, och när det betalas för ett jobb blir det ett tomt mynt (ADP) plus en lös fosfatbit. Kraftverket (mitokondrien) tar emot de tomma mynten och laddar dem igen med energi från födan. Fabriken har inga mynt att slösa med, så samma mynt går runt hela tiden.</p></div>
    <div class="box trap"><p>Energin sitter i <b>bindningen</b> mellan den andra och tredje fosfatgruppen. Det är inte den första fosfatgruppen som lossnar.</p><p>Hydrolys behöver <b>vatten</b>, inte kreatinfosfat (se felet i bild 29 ovan).</p><p>ATP och ADP är inte två olika ämnen som bildas från grunden varje gång. ADP blir ATP igen när det tar upp ett fosfat.</p></div>
    <div class="box tr" data-t="atp" data-h="Myntet i hela guiden">ATP är en nukleotid ({{go:k1.nukleotider|K1}}) som bildas mest i mitokondrien ({{go:k4.mitokondrien|K4}}) och betalar för pumparna i membranet ({{go:k5.pumpen|K5}}). Varje gång ATP används blir det ADP, som måste laddas igen.</div>
    <div class="x" data-x="tfAtp"></div>
    <div class="x" data-x="ordCykel"></div>
    <div class="x" data-x="clozeAtp"></div>
  `},
  {id:"kreatin",h:"Kreatinfosfat, reservbatteriet",nav:"Kreatinfosfat",src:"PPT Bi2 bild 29, 31",lek:true,html:`
    <p><b>Kreatin</b> är ett kvävehaltigt ämne som kroppen tillverkar själv, främst i <b>levern</b> och <b>njurarna</b>. Kreatin finns också i animaliska livsmedel som <b>kött och fisk</b>, och det säljs som kosttillskott, vanligen som <b>kreatinmonohydrat</b>. {{lek:Bi2 bild 31}}</p>
    <p>I musklerna lagras kreatin som <b>fosfokreatin</b>, som också kallas <b>kreatinfosfat</b>. Det är kreatin med en fosfatgrupp bunden till sig, och det används för att snabbt återbilda ATP. {{lek:Bi2 bild 31}}</p>
    <div class="box key"><p>Kreatinfosfat + ADP → Kreatin + ATP {{lek:Bi2 bild 31}}</p><p>Kreatinfosfat återbildar ATP från ADP när <b>energibehovet är stort</b>. Kreatin fungerar som ett <b>snabbladdat reservbatteri</b>.</p></div>
    <div class="lfig-h" data-fig="krea"></div>
    <ol class="chainv"><li>Muskeln arbetar maximalt och gör av med ATP mycket snabbt.</li><li>Kreatinfosfat lämnar sin fosfatgrupp till ADP.</li><li>ATP återbildas snabbt, och kvar blir kreatin.</li><li>Muskeln kan arbeta maximalt, men bara under <b>väldigt kort tid</b>, eftersom förrådet av kreatinfosfat tar slut.</li></ol>
    <table class="cmp"><tr><th></th><th>Hydrolys av ATP</th><th>Kreatinfosfat + ADP</th></tr>
      <tr><td>Vad händer</td><td>ATP tappar sitt tredje fosfat</td><td>ADP får ett fosfat från kreatinfosfat</td></tr>
      <tr><td>Behövs</td><td>vatten</td><td>kreatinfosfat</td></tr>
      <tr><td>Resultat</td><td>ADP + fosfat + energi</td><td>kreatin + ATP</td></tr>
      <tr><td>Riktning i cykeln</td><td>ATP → ADP (energi ut)</td><td>ADP → ATP (återbildning)</td></tr></table>
    <div class="box trick"><p><b>Kreatin-P ger sitt P.</b> Fosfatet hoppar från kreatin till ADP. Det som hade P i början (kreatinfosfat) saknar P efteråt, och det som saknade ett P (ADP) har fått det.</p></div>
    <div class="box fab"><p>Kreatinfosfatet är fabrikens <b>reservkassa</b> vid muskelns arbetsplats. När det plötsligt behövs väldigt många mynt på en gång, hinner kraftverket inte ladda tillräckligt snabbt. Då tas laddning direkt ur reservkassan. Den räcker bara en kort stund, sedan är den tom.</p></div>
    <div class="box trap"><p>Kreatinfosfat <b>bildar ATP</b> (från ADP). Det behövs inte när ATP frigör sin energi, trots att lärarens bild 29 säger så.</p><p>Fosfokreatin och kreatinfosfat är <b>samma ämne</b>. Kreatinmonohydrat är formen i kosttillskottet.</p><p>Reservbatteriet ger maximal kraft men bara under väldigt kort tid.</p></div>
    <div class="box diff"><p><b>Lärarens bild 29</b> säger att kreatinfosfat behövs när ATP frigör energi. <b>Lärarens bild 31</b> säger att kreatinfosfat återbildar ATP från ADP. Bild 31 är rätt, och den stämmer med att hydrolysen bara behöver vatten (bok s. 35). {{diff:bild 31 gäller}}</p></div>
    <div class="box link"><p>Muskelceller har högt energibehov och därför extra många mitokondrier ({{go:k6.kraftverk|kraftverket}}, bok s. 27). Kreatinfosfatet är en snabb reserv utöver dem.</p></div>
    <div class="box tr" data-t="atp" data-h="Två sätt att ladda myntet">ADP blir ATP igen antingen med energi från födan i mitokondrien eller snabbt med fosfatet från kreatinfosfat i musklerna. Mitokondrien står för det mesta ({{go:k4.mitokondrien|K4}}).</div>
    <div class="x" data-x="chainKrea"></div>
  `},
  {id:"kraftverk",h:"Mitokondrien, kraftverket",nav:"Kraftverket",src:"s. 27 · PPT Bi2 bild 22, 30 · s. 247",prov:true,html:`
    <p>Mitokondrien beskrivs ofta som <b>cellens kraftverk</b>, eftersom <b>de flesta ATP-molekyler bildas just här</b>. ATP:t används sedan för att driva alla energikrävande processer i cellen. {{prov}} {{src:s. 27 · PPT Bi2 bild 22}}</p>
    <p>Läraren skriver: "Mitokondrie = Cellens kraftverk. Energirik näring förbränns (<b>cellandningen</b>)." Ordet cellandning står inte på bokens s. 27, men det är samma process som boken kallar de energiutvinnande processerna. {{lek:Bi2 bild 22}}</p>
    <h3>Hur kraftverket är byggt</h3>
    <p>Mitokondrien har <b>två membran</b>, ett yttre och ett inre. Det <b>inre membranet är starkt veckat</b>. Det ger en stor yta för alla de <b>membranförankrade enzymer</b> som behövs i den så kallade <b>elektrontransportkedjan</b>, som ger oss de energibärande ATP-molekylerna. {{prov}} {{src:s. 27}}</p>
    <p>Vattenlösningen inne i mitokondrien heter <b>matrix</b>. Den innehåller <b>enzymer som behövs för att utvinna energi ur födan</b> vi äter. {{src:s. 27}}</p>
    <div class="lfig-h" data-fig="mito"></div>
    <ol class="chainv"><li>Energirik näring från födan kommer in i mitokondrien.</li><li>Enzymer i matrix utvinner energi ur födan.</li><li>Elektrontransportkedjan i det veckade inre membranet fångar in en del av energin.</li><li>Den energin används för att bilda ATP från ADP och fosfat.</li><li>Resten av energin avgår som spillvärme.</li></ol>
    <div class="box key"><p>Under de energiutvinnande processerna avgår <b>mycket energi som spillvärme</b>, men en del fångas in och används för att bilda ATP. {{src:s. 27}}</p><p>Celler med <b>högt energibehov</b>, till exempel <b>muskelceller</b>, har därför <b>extra många mitokondrier</b>. {{prov}} {{src:s. 27}}</p></div>
    <div class="box trick"><p><b>Veck = yta = fler enzymer = mer ATP.</b> Tänk på ett handdukselement som är veckat för att få plats med mer yta i ett litet utrymme.</p></div>
    <div class="box fab"><p>Mitokondrien är fabrikens <b>kraftverk</b>. Bränslet är födan, och det som kommer ut är laddade ATP-mynt. Precis som ett riktigt kraftverk blir en stor del av energin <b>spillvärme</b> i stället för användbar energi. Fabriker som drar mycket ström, som muskelceller, har många kraftverk.</p></div>
    <div class="box trap"><p>Matrix i mitokondrien är vattenlösningen <b>inuti</b> mitokondrien. Den har inget med extracellulär matrix ({{go:k3.ecm|K3}}) att göra.</p><p>Det är det <b>inre</b> membranet som är veckat och bär elektrontransportkedjan, inte det yttre.</p><p>Boken säger att <b>de flesta</b> ATP-molekyler bildas i mitokondrien. Säg inte "allt ATP".</p></div>
    <div class="box tr" data-t="membran" data-h="Ett membran som tillverkar">I mitokondrien gör membranet mer än att avgränsa. Det inre membranet bär enzymerna i elektrontransportkedjan, och därför är det veckat för att få stor yta. Samma dubbla lager av fosfolipider finns i cellmembranet ({{go:k3.uppbyggnad|K3}}).</div>
    <h3>En gammal bakterie</h3>
    <p>Enligt <b>endosymbiosteorin</b> var mitokondrien en gång en bakterie som slukades av föregångaren till den eukaryota cellen och började leva i symbios med den. Bevisen är de <b>två membranen</b>, att mitokondrien har <b>eget DNA</b> som är <b>ringformat</b> som hos bakterier, och att den har <b>ribosomer av samma typ som hos bakterier</b>. {{src:s. 27}}</p>
    <div class="box tr" data-t="endo" data-h="Kraftverket var en bakterie">Mitokondriens inre membran kommer från bakteriens cellmembran och det yttre från cellen som slukade den ({{go:k4.mitokondrien|K4}}). Kloroplasten tros ha uppkommit på samma sätt ({{go:k13.kloroplasten|K13}}). Fabrikens kraftverk var alltså från början en egen liten verkstad.</div>
    <h3>Växtcellens andra energiorganell</h3>
    <p>Växtceller har mitokondrier precis som djurceller, men de har också <b>kloroplaster</b>. I kloroplastens <b>tylakoider</b> sitter klorofyllet, som fångar in solljuset. Läraren skriver att klorofyllet gör att växterna kan utnyttja ljusenergi från solen (<b>fotosyntes</b>). {{prov}} {{src:s. 247 · PPT Bi2 bild 25}}</p>
    <table class="cmp"><tr><th></th><th>Mitokondrie</th><th>Kloroplast</th></tr>
      <tr><td>Energikälla</td><td>födan</td><td>solljuset</td></tr>
      <tr><td>Membran</td><td>två, det inre veckat</td><td>två, med tylakoider innanför</td></tr>
      <tr><td>Vattenlösningen</td><td>matrix</td><td>stroma (jämförs med matrix)</td></tr>
      <tr><td>Eget ringformat DNA, ribosomer</td><td>ja</td><td>ja</td></tr>
      <tr><td>Finns i</td><td>djurceller och växtceller</td><td>växter och alger</td></tr></table>
    <div class="box link"><p>Kloroplasten går {{go:k13.kloroplasten|K13}} igenom: tylakoider, granum, stroma och varför växter är gröna.</p></div>
    <div class="box extra"><p>Ljusenergin som kloroplasten fångar används i fotosyntesen, bland annat till att bilda ATP inne i kloroplasten. Det ATP:t används till fotosyntesens egna reaktioner. Det står inte på de boksidor du har. {{extra}}</p></div>
    <div class="x" data-x="fixMito"></div>
  `},
  {id:"forbrukare",h:"Vad kostar ATP?",nav:"ATP-förbrukare",src:"s. 27, 34–35 · PPT Transport bild 15–17, 19 · PPT Bi2 bild 31",prov:true,html:`
    <p>ATP driver <b>alla energikrävande processer i cellen</b>. {{src:s. 27}} Här är de förbrukare du har mött i guiden.</p>
    <h3>Aktiv transport med ATP-drivna pumpar</h3>
    <p>Transport mot koncentrationsgradienten, från låg till hög koncentration, kallas <b>aktiv transport</b> och kräver energi, som att rulla något uppför en backe ({{go:k5.aktiv|K5}}). Den kan ske med kopplad transport eller med <b>ATP-drivna proteinpumpar</b>. {{prov}} {{src:s. 34 · PPT Transport bild 15}}</p>
    <p>En pump utnyttjar energin som frigörs när ATP <b>hydrolyseras till ADP</b> ("tappar" ett fosfat). Energin överförs till pumpen, och därför kan ämnet som binder till pumpen föras till andra sidan membranet. Den stora fördelen är att pumparna fungerar <b>oberoende av koncentrationsgradienter</b>, eftersom energin kommer från ATP. {{prov}} {{src:s. 35 · PPT Transport bild 16}}</p>
    <div class="box key"><p>Ungefär <b>40 %</b> av det ATP som produceras i en cell går åt till <b>natrium-kaliumpumpen</b>. Den håller jonbalansen i cellerna uppe. {{prov}} {{src:s. 35 · PPT Transport bild 19}}</p></div>
    <div class="box diff"><p><b>Boken:</b> ungefär 40 % av cellens ATP går till natrium-kaliumpumpen. <b>Lärarens bild 19:</b> pumparna använder 10–40 % av cellens ATP-produktion, och pumpen flyttar ut tre natriumjoner och in två kaliumjoner för varje ATP. Svara med bokens siffra, ungefär 40 %. {{diff:40 % i boken, 10–40 % i PPT}}</p></div>
    <h3>Kopplad transport, ATP i andra hand</h3>
    <p>Vid <b>kopplad transport</b> driver ett ämne som diffunderar med sin gradient ett annat ämne mot dess gradient. Det kräver ändå ATP <b>indirekt</b>. Koncentrationen av det ämne vars diffusion driver transporten måste ju upprätthållas, och därför måste ämnet pumpas tillbaka med ATP. Utan koncentrationsgradient ingen diffusion. {{prov}} {{src:s. 34 · PPT Transport bild 17}} ({{go:k5.kopplad|K5}})</p>
    <h3>Vesiklar och muskler</h3>
    <p>Både <b>endocytos</b> och <b>exocytos</b> kräver energi, enligt boken. {{src:s. 35}} ({{go:k5.endocytos|K5}})</p>
    <p>Muskelceller har högt energibehov. Därför har de extra många mitokondrier {{src:s. 27}} och ett reservbatteri av kreatinfosfat. {{lek:Bi2 bild 31}}</p>
    <table class="cmp"><tr><th>Process</th><th>Kostar ATP?</th><th>Varför</th></tr>
      <tr><td>Diffusion, osmos</td><td>nej</td><td>ämnet följer sin gradient</td></tr>
      <tr><td>Underlättad diffusion</td><td>nej</td><td>med gradienten, proteinet hjälper bara</td></tr>
      <tr><td>ATP-driven pump</td><td>ja, direkt</td><td>mot gradienten, energi från hydrolysen</td></tr>
      <tr><td>Kopplad transport</td><td>ja, indirekt</td><td>gradienten måste pumpas upp igen</td></tr>
      <tr><td>Endocytos, exocytos</td><td>ja (energi)</td><td>boken: kräver energi</td></tr></table>
    <div class="box trap"><p>Alla proteinpumpar drivs inte av ATP. Hos vissa bakterier och arkéer finns pumpar som drivs av <b>solenergi</b>. {{src:s. 34}}</p><p>Kopplad transport använder ingen ATP direkt, men den stannar utan ATP.</p><p>Diffusion kostar ingen ATP, inte ens när den går genom ett protein.</p></div>
    <div class="box fab"><p>I fabriken är pumpen en <b>rulltrappa uppför</b> som kostar ett ATP-mynt per resa. Natrium-kaliumpumpen är fabrikens dyraste maskin och tar ungefär 40 % av alla mynt, eftersom den aldrig stängs av.</p></div>
    <div class="w" data-w="k6Kassa"></div>
    <div class="box tr" data-t="atp" data-h="Den största kunden">Natrium-kaliumpumpen i cellmembranet tar ungefär 40 % av cellens ATP ({{go:k5.pumpen|K5}}). Därför måste kraftverket ({{go:k4.mitokondrien|K4}}) hela tiden ladda nya mynt.</div>
    <div class="box tr" data-t="membran" data-h="Membranet kostar">Cellmembranet håller jonbalansen med pumpar som drivs av ATP, och mitokondriens inre membran bildar ATP:t. Membranen är alltså både den största förbrukaren och tillverkaren ({{go:k5.pumpen|K5}}).</div>
    <div class="x" data-x="sortKostar"></div>
    <div class="x" data-x="whoAtp"></div>
  `}
  ],
  figs:{
    atp:{vb:"0 0 460 312",svg:figAtp(),
      labels:[["adenin|(kvävebas)",8,30,98,94,"s"],["ribos|(socker)",205,30,192,100,"m"],["tre fosfatgrupper",254,30,304,104,"s"],["energirik|bindning",376,64,334,116,"s"],
        ["ATP",66,124,null,null,"e"],["vatten",182,178,null,null,"e"],["hydrolys",244,178,null,null,"s"],["ADP",58,254,null,null,"e"],
        ["fosfat",352,294,null,null,"m"],["energi|frigörs",420,288,null,null,"m"]],
      parts:{atp:{t:"ATP, adenosintrifosfat",d:"Adenin (kvävebas) + ribos (socker) + tre fosfatgrupper. Bindningen mellan den andra och tredje fosfatgruppen innehåller mycket energi."},
        adp:{t:"ADP, adenosindifosfat",d:"Samma molekyl med bara två fosfatgrupper. ADP kan ta upp ett fosfat igen med energi från födan och bli ATP.",go:"k6.atp"}},
      cap:"ATP-molekylen och hydrolysen. Med vatten lossnar den tredje fosfatgruppen, och energi frigörs. Kvar blir ADP och ett fosfat. Tryck på molekylerna.",src:"PPT Bi2 bild 29 · bok s. 35"},
    cykel:{vb:"0 0 460 330",svg:figCykel(),
      labels:[["ATP",230,16,null,null,"m"],["ADP",230,326,null,null,"m"],["ATP–ADP-|cykeln",230,160,null,null,"m"],
        ["fosfat lossnar",456,60,400,84,"e"],["energi frigörs|(för cellen)",456,286,398,256,"e"],["hydrolys",352,170,null,null,"s"],
        ["energi från|födan",4,40,56,80,"s"],["fosfat tas upp",4,300,70,246,"s"],["återbildning",110,170,null,null,"e"]],
      parts:{ner:{t:"Energi frigörs",d:"ATP hydrolyseras. Den tredje fosfatgruppen lossnar och energi frigörs, som cellen använder till arbete, till exempel pumpar.",go:"k6.forbrukare"},
        upp:{t:"ATP återbildas",d:"ADP tar upp ett fosfat igen med energi från födan. Det sker mest i mitokondrien. I muskler kan kreatinfosfat också återbilda ATP snabbt.",go:"k6.kraftverk"}},
      cap:"ATP–ADP-cykeln. Till höger används ATP och energi frigörs. Till vänster laddas ADP igen med energi från födan. Samma molekyler går runt hela tiden. Efter lärarens bild 30 (engelska etiketter översatta).",src:"PPT Bi2 bild 30 · bok s. 27, 35"},
    mito:{vb:"0 0 460 300",svg:figMito(),
      labels:[["inre membran|(veckat)",140,22,136,96,"e"],["elektrontransport-|kedjan",222,22,220,84,"m"],["yttre membran",306,22,300,74,"s"],
        ["energi|ur födan",4,104,null,null,"s"],["matrix",62,192,112,176,"e"],["DNA (ringformat)",100,284,190,164,"s"],["ribosomer",290,284,252,166,"s"],
        ["ATP",420,46,410,60,"s"],["spillvärme",456,262,null,null,"e"]],
      parts:{ytt:{t:"Yttre membranet",d:"Slätt. Enligt endosymbiosteorin kommer det från cellmembranet hos den cell som slukade bakterien.",go:"k4.mitokondrien"},
        inre:{t:"Inre membranet",d:"Starkt veckat, vilket ger en stor yta för de membranförankrade enzymerna i elektrontransportkedjan som ger ATP. Kommer enligt teorin från bakteriens cellmembran."},
        matrix:{t:"Matrix",d:"Vattenlösningen i mitokondriens inre. Innehåller enzymer som behövs för att utvinna energi ur födan, och dessutom DNA och ribosomer."},
        dna:{t:"Eget DNA",d:"Ringformat som hos bakterier. Ett av bevisen för endosymbiosteorin.",go:"k4.mitokondrien"}},
      cap:"Mitokondrien som kraftverk. Energi ur födan utvinns i matrix, elektrontransportkedjan i det veckade inre membranet ger ATP, och mycket energi avgår som spillvärme. Efter bokens figur s. 27. Tryck på delarna.",src:"Bok s. 27"},
    krea:{vb:"0 0 460 232",svg:figKrea(),
      labels:[["kreatinfosfat",104,114,null,null,"m"],["ADP",285,104,null,null,"m"],["kreatin",104,222,null,null,"m"],["ATP",298,222,null,null,"m"],
        ["fosfatet flyttas",340,22,null,null,"s"],["när behovet|är stort",452,120,null,null,"e"]],
      cap:"Kreatinfosfat + ADP → kreatin + ATP. Fosfatgruppen flyttas från kreatin till ADP, så att ATP återbildas snabbt. Det snabbladdade reservbatteriet i musklerna.",src:"PPT Bi2 bild 31"}
  },
  ex:{
    tfAtp:{ty:"tf",h:"ATP och ADP",src:"PPT Bi2 bild 29–30 · s. 27, 35",items:[
      ["ATP består av ribos, adenin och tre fosfatgrupper.",true,"Lärarens bild 29. Ribos är sockret och adenin är kvävebasen."],
      ["ADP har en fosfatgrupp.",false,"ADP har två fosfatgrupper (di = två). En fosfatgrupp skulle vara AMP, som inte finns i materialet."],
      ["Energin i ATP sitter främst i bindningen mellan den första och andra fosfatgruppen.",false,"Den energirika bindningen är den mellan den andra och tredje fosfatgruppen. Det är den tredje som lossnar."],
      ["Vid hydrolysen av ATP behövs vatten.",true,"Hydrolys betyder spjälkning med vatten. ATP + vatten → ADP + fosfat + energi."],
      ["Kreatinfosfat behövs för att ATP ska kunna frigöra energi.",false,"Det står i bild 29 men är fel. Kreatinfosfat återbildar ATP från ADP (bild 31)."],
      ["De flesta ATP-molekyler bildas i mitokondrien.",true,"Bok s. 27. Därför kallas mitokondrien cellens kraftverk."],
      ["När ATP har blivit ADP är molekylen förbrukad och måste brytas ner.",false,"ADP tar upp ett fosfat igen med energi från födan och blir ATP. Det är ATP–ADP-cykeln."],
      ["Nukleotider bygger nukleinsyror och fungerar som energibärare.",true,"Lärarens bild 28. ATP är exemplet på en energibärare."]]},
    ordCykel:{ty:"order",h:"Ett varv i ATP–ADP-cykeln",intro:"Börja med att cellen äter och sluta med att samma molekyl är laddad igen.",src:"PPT Bi2 bild 29–30 · s. 27, 35",items:[
      "Enzymer i mitokondriens matrix utvinner energi ur födan",
      "Elektrontransportkedjan i det inre membranet fångar in en del av energin",
      "ADP tar upp ett fosfat och blir ATP",
      "ATP binder till en pump i cellmembranet",
      "ATP hydrolyseras med vatten och den tredje fosfatgruppen lossnar",
      "Energin driver pumpen och ämnet förs mot sin gradient",
      "ADP och fosfat är kvar och kan laddas igen"],
      why:"Energin från födan laddar ADP till ATP i mitokondrien (s. 27). När ATP hydrolyseras frigörs energin som driver pumpen (s. 35). Kvar blir ADP, och cykeln börjar om."},
    clozeAtp:{ty:"cloze",h:"Fyll i luckorna om ATP",src:"PPT Bi2 bild 29–30 · s. 27, 35",bank:true,
      text:"ATP står för [[adenosintrifosfat]] och består av sockret [[ribos]], kvävebasen [[adenin]] och [[tre]] fosfatgrupper. Bindningen mellan den andra och tredje fosfatgruppen innehåller mycket [[energi]]. När ATP [[hydrolyseras]] med hjälp av [[vatten]] bildas [[ADP]] och ett fosfat. Med energi från [[födan]] kan ADP återbildas till ATP. Det mesta av cellens ATP bildas i [[mitokondrien]]."},
    chainKrea:{ty:"chain",h:"Saknad länk",src:"PPT Bi2 bild 29–31 · s. 27, 35",items:[
      {h:"Kreatinfosfat vid en spurt",steps:["Muskeln arbetar maximalt","ATP förbrukas mycket snabbt","Kreatinfosfat ger sitt fosfat till ADP","ATP återbildas snabbt","Förrådet tar slut efter väldigt kort tid"],b:2,w:["Kreatinfosfat hydrolyserar ATP","Mitokondrien slutar arbeta"],why:"Kreatinfosfat + ADP → kreatin + ATP. Det är ett snabbladdat reservbatteri (bild 31)."},
      {h:"Varför ATP hela tiden måste återbildas",steps:["Cellen driver pumpar och annat arbete","ATP hydrolyseras till ADP och fosfat","ATP-förrådet minskar","Energi från födan laddar ADP till ATP igen"],b:1,w:["ATP bryts ner helt till koldioxid","ADP lämnar cellen"],why:"Varje gång energin används blir ATP till ADP. Utan återbildning tar ATP slut."},
      {h:"Mitokondrien",steps:["Energirik näring kommer in","Enzymer i matrix utvinner energi","Elektrontransportkedjan i inre membranet fångar energi","ATP bildas, resten blir spillvärme"],b:2,w:["Det yttre membranet bildar ATP","Ribosomerna förbränner näringen"],why:"Det är det veckade inre membranet som bär elektrontransportkedjan (s. 27)."}]},
    fixMito:{ty:"fix",h:"Hitta felen i Pelles förklaring",src:"s. 27 · PPT Bi2 bild 29–31",parts:[
      "Pelle förklarar: Mitokondrien kallas cellens kraftverk eftersom ",["allt","det mesta av","Boken: de flesta ATP-molekyler bildas i mitokondrien, inte allt."]," cellens ATP bildas där. Det ",["yttre","inre","Det är det inre membranet som är starkt veckat och bär elektrontransportkedjan."]," membranet är veckat för att få plats med enzymerna i elektrontransportkedjan. Nästan all energi ur födan blir ATP, ",["ingenting går förlorat","mycket avgår som spillvärme","Boken: mycket energi avgår som spillvärme, bara en del fångas in som ATP."],". När cellen använder ATP lossnar den tredje fosfatgruppen, och för det behövs ",["kreatinfosfat","vatten","Hydrolys kräver vatten. Kreatinfosfat används för att återbilda ATP (bild 31)."],"."]},
    sortKostar:{ty:"sort",h:"Kostar det ATP?",cats:["Kostar ATP direkt","Kostar ATP indirekt","Kostar ingen energi"],src:"s. 31–35",items:[
      ["Natrium-kaliumpumpen",0,"ATP hydrolyseras och energin driver pumpen direkt."],
      ["Glukos tas upp tillsammans med natrium (kopplad transport)",1,"Natriumgradienten måste hållas uppe av pumpen, som kostar ATP."],
      ["Syre diffunderar in i cellen",2,"Syre följer sin gradient. Diffusion är passiv."],
      ["Osmos genom aquaporiner",2,"Vattnet följer sin gradient. Ingen energi behövs."],
      ["Glukos genom ett bärarprotein med gradienten",2,"Underlättad diffusion kräver ingen energi."],
      ["En ATP-driven proteinpump som pumpar ett ämne mot gradienten",0,"Energin kommer från hydrolysen av ATP."],
      ["Ett ämne som pumpas tillbaka för att hålla uppe en gradient för kopplad transport",0,"Själva tillbakapumpningen är en ATP-driven pump."]]},
    whoAtp:{ty:"who",h:"Vem är jag?",src:"PPT Bi2 bild 29–31 · s. 27, 35",items:[
      {clues:["Jag har två fosfatgrupper.","Jag bildas när energin har använts.","Jag är det urladdade myntet."],a:"ADP",w:["ATP","Kreatin","Kreatinfosfat"],why:"ADP = adenosindifosfat, två fosfatgrupper."},
      {clues:["Jag är kreatin som har fått ett fosfat.","Jag lagras i musklerna.","Jag är ett snabbladdat reservbatteri."],a:"Kreatinfosfat",w:["ATP","Glykogen","ADP"],why:"Kreatinfosfat (fosfokreatin) återbildar ATP från ADP när energibehovet är stort."},
      {clues:["Jag har två membran.","Mitt inre membran är starkt veckat.","De flesta ATP-molekyler bildas hos mig."],a:"Mitokondrien",w:["Kloroplasten","Kärnan","Lysosomen"],why:"Mitokondrien är cellens kraftverk (s. 27)."},
      {clues:["Jag sitter i cellmembranet.","Jag tar ungefär 40 % av cellens ATP.","Jag håller jonbalansen uppe."],a:"Natrium-kaliumpumpen",w:["Aquaporinen","Bärarproteinet för glukos","Jonkanalen"],why:"Bok s. 35: ungefär 40 % av ATP:t går till natrium-kaliumpumpen."},
      {clues:["Jag är en nukleotid.","Jag har ribos, adenin och tre fosfatgrupper.","Jag är cellens viktigaste energibärare."],a:"ATP",w:["ADP","DNA","Glukos"],why:"Lärarens bild 29."}]}
  },
  w:{
    /* ---------- Fabrikens kassa ---------- */
    k6Kassa(el,api){
      el.className="wid";
      const N=20,FOOD=[0,1,2,3],FN=["ingen","lite","normalt","mycket"],WORK=[0,1,3,5],WN=["vila","lätt arbete","hårt arbete","spurt"],CR0=8;
      el.innerHTML=`<div class="wh"><b>Fabrikens kassa</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0;padding:6px"><svg viewBox="0 0 420 260" role="img" aria-label="ATP-mynt som laddas i mitokondrien och används av en pump och en muskel" id="k6-ka-svg"></svg></figure>
      <div><p class="small">Kassan har 20 mynt. Gula mynt är laddade (ATP), tomma mynt är ADP. Varje steg laddar mitokondrien mynt med energi från födan, och pumpen och muskeln betalar.</p>
      <label class="ctl">Energi från födan: <span id="k6-ka-fn"></span><input type="range" id="k6-ka-f" min="0" max="3" step="1" value="2"></label>
      <label class="ctl">Muskelns arbete: <span id="k6-ka-wn"></span><input type="range" id="k6-ka-w" min="0" max="3" step="1" value="1"></label>
      <div class="row"><button class="btn sm" type="button" id="k6-ka-go">Kör</button><button class="btn ghost sm" type="button" id="k6-ka-st">Ett steg</button><button class="btn ghost sm" type="button" id="k6-ka-r">Börja om</button></div>
      <dl class="readout"><dt>Laddade mynt (ATP)</dt><dd id="k6-ka-a"></dd><dt>Tomma mynt (ADP)</dt><dd id="k6-ka-d"></dd><dt>Kreatinfosfat kvar</dt><dd id="k6-ka-c"></dd><dt>Natrium-kaliumpumpen</dt><dd id="k6-ka-p"></dd><dt>Muskeln</dt><dd id="k6-ka-m"></dd></dl>
      <p class="verdict" id="k6-ka-vd"></p><p id="k6-ka-why"></p>
      <p class="small">Mynten och stegen är påhittade enheter som visar principen. De är inte verkliga mängder.</p><p class="small" id="k6-ka-rm"></p></div></div>`;
      const svg=el.querySelector("#k6-ka-svg"),$=s=>el.querySelector(s);
      let S,run=false,raf=0,last=0;
      function reset(){S={atp:14,adp:6,cr:CR0,t:0,pump:true,done:0,need:0,crNow:0,prod:0}}
      function step(){const f=FOOD[+$("#k6-ka-f").value],w=WORK[+$("#k6-ka-w").value];
        const prod=Math.min(S.adp,f);S.atp+=prod;S.adp-=prod;S.prod=prod;S.crNow=0;
        function pay(){if(S.atp<1&&S.cr>0&&S.adp>0&&w>=3){S.cr--;S.adp--;S.atp++;S.crNow++}if(S.atp>=1){S.atp--;S.adp++;return true}return false}
        S.pump=pay();let d=0;for(let i=0;i<w;i++)if(pay())d++;S.done=d;S.need=w;S.t++}
      function draw(){const f=+$("#k6-ka-f").value,w=+$("#k6-ka-w").value;
        let s=`<ellipse cx="62" cy="80" rx="48" ry="28" ${st("--c-mito-soft","--c-mito")} stroke-width="3"/><path d="M34 60v22M52 104v-22M70 58v22M88 102v-22" fill="none" style="stroke:var(--c-mito)" stroke-width="3" stroke-linecap="round"/>`;
        s+=`<text x="62" y="130" text-anchor="middle" ${TW}>mitokondrien</text>`;
        if(f>0)s+=arr(62,18,62,46,"--good",1.5+f*1.5,10);
        s+=`<text x="76" y="24" ${T12}>föda</text>`;
        if(S.prod>0)s+=arr(114,80,140,80,"--t-atp",3,10);
        for(let i=0;i<N;i++){const x=158+(i%5)*36,y=34+Math.floor(i/5)*36,full=i<S.atp;
          s+=full?`<circle cx="${x}" cy="${y}" r="15" ${st("--t-atp","--ink")} stroke-width="1.4"/><text x="${x}" y="${y+4}" text-anchor="middle" ${T12}>ATP</text>`
            :`<circle cx="${x}" cy="${y}" r="15" ${st("--paper","--line2")} stroke-width="1.4" stroke-dasharray="3 3"/><text x="${x}" y="${y+4}" text-anchor="middle" class="lbs" style="font-size:12px;fill:var(--muted)">ADP</text>`}
        const pc=S.pump?"--good":"--bad",mc=S.done===S.need?"--good":"--bad";
        s+=`<rect x="338" y="40" width="64" height="40" rx="6" ${st("--c-mem-soft","--c-mem")} stroke-width="2"/><rect x="360" y="34" width="20" height="52" rx="6" ${st("--c-nuc-soft",pc)} stroke-width="3"/>`;
        s+=`<text x="370" y="104" text-anchor="middle" ${TW}>Na/K-pump</text>`;
        s+=`<path d="M336 160 Q370 128 404 160 Q370 192 336 160 Z" ${st("--c-vir-soft",mc)} stroke-width="3"/><text x="370" y="208" text-anchor="middle" ${TW}>muskel</text>`;
        s+=arr(318,70,334,62,pc,2.5,8)+arr(318,140,334,154,mc,2.5,8);
        s+=`<text x="14" y="244" ${TW}>kreatinfosfat</text>`;
        for(let i=0;i<CR0;i++)s+=`<rect x="${130+i*20}" y="230" width="15" height="18" rx="3" ${i<S.cr?st("--c-golgi","--ink"):st("--sunk","--line2")} stroke-width="1"/>`;
        if(S.crNow>0)s+=arr(220,226,240,186,"--c-golgi",2.5,9);
        svg.innerHTML=s;
        $("#k6-ka-fn").textContent=FN[f];$("#k6-ka-wn").textContent=WN[w];
        $("#k6-ka-a").textContent=S.atp+" av "+N;$("#k6-ka-d").textContent=S.adp+" av "+N;$("#k6-ka-c").textContent=S.cr+" av "+CR0;
        $("#k6-ka-p").textContent=S.pump?"går":"har stannat";
        $("#k6-ka-m").textContent=S.need===0?"vilar":(S.done===S.need?"arbetar fullt":S.done>0?"orkar bara delvis":"orkar inte");
        const vd=$("#k6-ka-vd");let t;
        if(!S.pump){vd.className="verdict b";vd.textContent="Pumpen har stannat";
          t="Kassan är tom. Alla mynt har blivit ADP, och "+(f===0?"det kommer ingen energi från födan, så mitokondrien kan inte ladda dem igen.":"mitokondrien hinner inte ladda dem lika fort som de används.")+" Utan ATP stannar natrium-kaliumpumpen, och då kan cellen inte hålla jonbalansen uppe. {{src:s. 35}}"}
        else if(S.need>0&&S.done<S.need){vd.className="verdict b";vd.textContent="Muskeln orkar inte";
          t="Arbetet kostar fler mynt per steg än mitokondrien laddar"+(S.cr===0?", och reservbatteriet med kreatinfosfat är tomt.":".")+" Pumpen får betalt först, eftersom den alltid måste gå."}
        else if(S.crNow>0){vd.className="verdict m";vd.textContent="Reservbatteriet används";
          t="ATP har tagit slut under det hårda arbetet. Därför ger kreatinfosfat sitt fosfat till ADP, så att ATP återbildas snabbt. Det räcker bara en kort stund, eftersom förrådet är litet. {{lek:Bi2 bild 31}}"}
        else if(S.atp<4&&S.t>0){vd.className="verdict m";vd.textContent="Kassan krymper";
          t="Fler mynt används än vad mitokondrien laddar varje steg. Därför minskar antalet laddade mynt, och snart tar de slut."}
        else{vd.className="verdict g";vd.textContent="Kassan går ihop";
          t=S.atp===N?"Alla mynt är laddade. Mitokondrien kan inte ladda fler, eftersom det inte finns några tomma mynt att ladda. Det finns ingen extra hög med ATP, bara samma mynt som går runt.":"Mitokondrien laddar tomma mynt lika fort som de används. Därför räcker ATP:t, så länge energin från födan fortsätter komma."}
        $("#k6-ka-why").innerHTML=api.tpl(t+" Summan av laddade och tomma mynt är hela tiden 20, eftersom ATP blir ADP när energin används och ADP blir ATP igen när det laddas. Därför måste ATP hela tiden återbildas. {{src:s. 27 · PPT Bi2 bild 30}}")}
      function loop(ts){if(!el.isConnected||!run){run=false;raf=0;return}
        if(ts-last>700){last=ts;step();draw();if(S.t>400){run=false;raf=0;$("#k6-ka-go").textContent="Kör";return}}
        raf=requestAnimationFrame(loop)}
      $("#k6-ka-go").addEventListener("click",()=>{if(RM()){for(let i=0;i<5;i++)step();draw();return}
        if(run){run=false;$("#k6-ka-go").textContent="Kör"}else{run=true;S.t=Math.min(S.t,300);$("#k6-ka-go").textContent="Pausa";if(!raf)raf=requestAnimationFrame(loop)}});
      $("#k6-ka-st").addEventListener("click",()=>{step();draw()});
      $("#k6-ka-r").addEventListener("click",()=>{reset();draw()});
      $("#k6-ka-f").addEventListener("input",draw);$("#k6-ka-w").addEventListener("input",draw);
      if(RM())$("#k6-ka-rm").textContent="Rörelse är avstängd i din webbläsare. Kör tar fem steg åt gången.";
      reset();draw();
    }
  }
});
})();
