/* K10 Arkéer, virus och livets träd. Bok s. 178, 183 (faktarutan), 184–186, PPT "Mikroorganismer" bild 20–22, 36–40, arbetsblad "Mikroorganismernas värld". */
(function(){
"use strict";
const r1=n=>Math.round(n*10)/10;
const st=(f,s)=>`style="fill:var(${f})${s?";stroke:var("+s+")":""}"`;
const RM=()=>{try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}};
function arr(x1,y1,x2,y2,col,w,hs){const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,h=hs||8;const bx=x2-ux*h,by=y2-uy*h,px=-uy*h*0.6,py=ux*h*0.6;
  return `<path d="M${r1(x1)} ${r1(y1)} L${r1(bx)} ${r1(by)}" fill="none" style="stroke:var(${col})" stroke-width="${w}" stroke-linecap="round"/><polygon points="${r1(x2)},${r1(y2)} ${r1(bx+px)},${r1(by+py)} ${r1(bx-px)},${r1(by-py)}" style="fill:var(${col})"/>`}
function dot(x,y,r,col,sc){return `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" ${st(col,sc)}${sc?' stroke-width="1.5"':""}/>`}
function hexP(x,y,r){const p=[];for(let i=0;i<6;i++){const a=i*Math.PI/3;p.push(r1(x+r*Math.cos(a))+","+r1(y+r*Math.sin(a)))}return p.join(" ")}
function hexa(x,y,r,f,s,w){return `<polygon points="${hexP(x,y,r)}" ${st(f,s)} stroke-width="${w||2}"/>`}
/* S-formad DNA-tråd */
function dnaS(x,y,s,col,w){s=s||1;return `<path d="M${r1(x-12*s)} ${r1(y-8*s)} C${r1(x-2*s)} ${r1(y-18*s)} ${r1(x+4*s)} ${r1(y-2*s)} ${r1(x)} ${r1(y)} C${r1(x-4*s)} ${r1(y+2*s)} ${r1(x+2*s)} ${r1(y+18*s)} ${r1(x+12*s)} ${r1(y+8*s)}" fill="none" style="stroke:var(${col||"--c-dna"})" stroke-width="${w||3}" stroke-linecap="round"/>`}
/* herpesvirus: membran med proteiner, proteinhölje (sexkant), DNA */
function herpV(x,y,R,opt){opt=opt||{};let s="";
  if(!opt.naked){const n=12;for(let i=0;i<n;i++){const a=i/n*Math.PI*2;s+=`<circle cx="${r1(x+(R+3)*Math.cos(a))}" cy="${r1(y+(R+3)*Math.sin(a))}" r="${r1(R*0.16)}" ${st("--c-vir")}/>`}
    s+=`<circle cx="${x}" cy="${y}" r="${R}" ${st("--c-vir-soft","--c-mem")} stroke-width="${r1(Math.max(2,R*0.12))}"/>`}
  s+=hexa(x,y,R*0.62,"--c-nuc-soft","--c-nuc",Math.max(1.5,R*0.07))+dnaS(x,y,R/34,"--c-dna",Math.max(2,R*0.08));
  return s}
const TW='class="lbs halo" style="font-size:14px"';
const TS='class="lbs halo" style="font-size:16px"';

/* ---------- figur: livets träd (PPT bild 20/36, bok s. 178, 184) ---------- */
function figTrad(){
  const tul=(cx,k,f,s)=>`<g data-k="${k}"><path d="M${cx-66} 34 Q${cx} 22 ${cx+66} 34 L${cx+50} 96 Q${cx} 106 ${cx-50} 96 Z" ${st(f,s)} stroke-width="2.5"/></g>`;
  let s=`<path d="M18 22 H292" fill="none" style="stroke:var(--muted)" stroke-width="1.6" stroke-dasharray="5 4"/><path d="M18 22 V32 M292 22 V32" fill="none" style="stroke:var(--muted)" stroke-width="1.6"/><g transform="translate(0,28)"><path d="M164 300 V236" fill="none" style="stroke:var(--c-chl)" stroke-width="9" stroke-linecap="round"/>`;
  s+=`<path d="M164 238 C150 190 92 150 80 100" fill="none" style="stroke:var(--c-chl)" stroke-width="7" stroke-linecap="round"/>`;
  s+=`<path d="M164 238 C190 210 270 196 300 166" fill="none" style="stroke:var(--c-chl)" stroke-width="7" stroke-linecap="round"/>`;
  s+=`<path d="M300 166 C290 140 236 128 230 100 M300 166 C320 140 376 128 380 100" fill="none" style="stroke:var(--c-chl)" stroke-width="6" stroke-linecap="round"/>`;
  s+=tul(80,"bak","--c-bact-soft","--c-bact")+tul(230,"ark","--c-arch-soft","--c-arch")+tul(380,"euk","--c-euk-soft","--c-euk");
  s+=`<circle cx="164" cy="238" r="8" ${st("--bad")}/><circle cx="300" cy="166" r="8" ${st("--bad")}/>`;
  return s+`</g>`}

/* ---------- figur: virusets byggnad (bok s. 184–185, PPT bild 39) ---------- */
function figVirus(){
  let s=`<g data-k="holje"><circle cx="150" cy="160" r="86" fill="transparent"/>`;
  const n=16;for(let i=0;i<n;i++){const a=i/n*Math.PI*2,x1=150+76*Math.cos(a),y1=160+76*Math.sin(a),x2=150+90*Math.cos(a),y2=160+90*Math.sin(a);
    s+=`<path d="M${r1(x1)} ${r1(y1)} L${r1(x2)} ${r1(y2)}" fill="none" style="stroke:var(--c-vir)" stroke-width="3"/><circle cx="${r1(x2)}" cy="${r1(y2)}" r="5.5" ${st("--c-vir")}/>`}
  s+=`<circle cx="150" cy="160" r="74" ${st("--c-vir-soft","--c-mem")} stroke-width="8"/></g>`;
  s+=`<g data-k="kapsid"><polygon points="${hexP(150,160,50)}" ${st("--c-nuc-soft","--c-nuc")} stroke-width="3"/>`;
  for(let i=0;i<6;i++){const a=i*Math.PI/3+Math.PI/6;s+=`<path d="M150 160 L${r1(150+43*Math.cos(a))} ${r1(160+43*Math.sin(a))}" fill="none" style="stroke:var(--c-nuc)" stroke-width="1" opacity=".45"/>`}
  s+=`</g><g data-k="dna">${dnaS(150,160,1.6,"--c-dna",4)}</g>`;
  /* bakteriofag */
  s+=`<g data-k="fag"><rect x="320" y="40" width="120" height="210" fill="transparent"/><polygon points="${hexP(380,92,34)}" ${st("--c-nuc-soft","--c-nuc")} stroke-width="3"/>${dnaS(380,92,0.9,"--c-dna",3)}`;
  s+=`<rect x="372" y="126" width="16" height="70" rx="3" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2"/><path d="M372 140 H388 M372 154 H388 M372 168 H388 M372 182 H388" fill="none" style="stroke:var(--c-nuc)" stroke-width="1.2"/>`;
  s+=`<rect x="356" y="196" width="48" height="8" rx="2" ${st("--c-nuc")}/><path d="M360 204 L338 236 M372 204 L362 240 M388 204 L398 240 M400 204 L422 236" fill="none" style="stroke:var(--c-nuc)" stroke-width="2.6" stroke-linecap="round"/></g>`;
  return s}

/* ---------- figur: herpesviruset tar över en slemhinnecell (bok s. 185) ---------- */
function figHerpes(){
  let s=`<g data-k="cell"><rect x="10" y="86" width="440" height="284" rx="34" ${st("--c-cyto","--c-mem")} stroke-width="6"/></g>`;
  s+=`<g data-k="karna"><ellipse cx="322" cy="192" rx="104" ry="56" ${st("--c-nuc-soft","--c-nuc")} stroke-width="3"/>`+dnaS(270,192,0.8)+dnaS(306,184,0.8)+dnaS(342,198,0.8)+dnaS(378,188,0.8)+`</g>`;
  /* fritt virus + steg 1 */
  s+=`<g data-k="v0">`+herpV(48,40,22)+`</g>`+arr(74,52,112,74,"--ink",2.2,8);
  s+=`<g data-k="s1"><path d="M112 89 A26 26 0 0 1 164 89" ${st("--c-vir-soft","--c-mem")} stroke-width="5"/>`+hexa(138,96,15,"--c-nuc-soft","--c-nuc",2)+dnaS(138,96,0.45,"--c-dna",2)+`</g>`;
  /* steg 2 */
  s+=arr(132,118,104,138,"--ink",2,7);
  s+=`<g data-k="s2"><path d="M70 150 l10 -6 l8 8 M90 170 l10 4 l-2 10 M58 172 l-6 10 l8 6" fill="none" style="stroke:var(--c-nuc)" stroke-width="3" stroke-linejoin="round"/>`+dnaS(118,158,0.55,"--c-dna",3)+`</g>`;
  s+=arr(138,168,212,184,"--ink",2,8);
  /* steg 4: nya proteiner */
  s+=arr(300,250,262,286,"--ink",2,8);
  s+=`<g data-k="s4">`+[[232,296],[244,288],[256,300],[240,306],[226,284],[252,312],[264,290],[218,300]].map(p=>dot(p[0],p[1],4.5,"--c-nuc")).join("")+`</g>`;
  s+=arr(212,292,184,276,"--bad",2,7)+arr(212,304,184,322,"--bad",2,7);
  /* steg 5: nya virus knoppas av */
  s+=arr(270,302,314,318,"--ink",2,8);
  s+=`<g data-k="s5">`+hexa(330,318,13,"--c-nuc-soft","--c-nuc",2)+dnaS(330,318,0.38,"--c-dna",2)+hexa(362,310,13,"--c-nuc-soft","--c-nuc",2)+dnaS(362,310,0.38,"--c-dna",2);
  s+=`<path d="M378 368 A22 22 0 0 0 422 368" ${st("--c-vir-soft","--c-mem")} stroke-width="5"/>`+hexa(400,378,10,"--c-nuc-soft","--c-nuc",2)+`</g>`;
  s+=`<g data-k="ny">`+herpV(400,418,15)+`</g>`;
  return s}

/* ---------- figur: extremofiler (bok s. 184, arbetsbladet) ---------- */
function figExtrem(){
  const tx=t=>r1(20+t*3.2),px=p=>r1(20+p*30);
  let s=`<g data-k="termo"><rect x="14" y="48" width="436" height="22" rx="11" ${st("--paper","--ink")} stroke-width="2"/><rect x="18" y="53" width="${r1(tx(122)-18)}" height="12" rx="6" ${st("--bad")}/></g>`;
  [[0,"0 °C"],[50,"50"]].forEach(([t,l])=>{s+=`<path d="M${tx(t)} 70 V80" fill="none" style="stroke:var(--ink)" stroke-width="1.6"/><text x="${tx(t)}" y="96" text-anchor="middle" ${TW}>${l}</text>`});
  s+=`<path d="M${tx(85)} 70 V82 M${tx(122)} 36 V48" fill="none" style="stroke:var(--ink)" stroke-width="1.6"/>`;
  s+=`<g data-k="acido"><rect x="14" y="146" width="436" height="22" rx="4" ${st("--mid-soft","--ink")} stroke-width="2"/><rect x="16" y="148" width="${r1(px(2)-16)}" height="18" ${st("--bad-soft")}/></g>`;
  [[7,"pH 7"],[14,"pH 14"]].forEach(([p,l])=>{s+=`<path d="M${px(p)} 168 V178" fill="none" style="stroke:var(--ink)" stroke-width="1.6"/><text x="${p===14?436:px(p)}" y="194" text-anchor="middle" ${TW}>${l}</text>`});
  s+=`<path d="M${px(0)+4} 134 V146 M${px(2)} 168 V180" fill="none" style="stroke:var(--ink)" stroke-width="1.6"/>`;
  s+=`<g data-k="halo" transform="translate(0,12)"><path d="M20 236 Q86 220 152 236 L142 284 Q86 296 30 284 Z" ${st("--bad-soft","--bad")} stroke-width="2"/><path d="M40 256 Q66 246 86 260 Q108 272 132 256" fill="none" style="stroke:var(--good)" stroke-width="5" stroke-linecap="round"/>`;
  s+=[[44,228],[70,222],[104,222],[130,228]].map(p=>`<rect x="${p[0]-5}" y="${p[1]-5}" width="10" height="10" ${st("--paper","--muted")} stroke-width="1.5" transform="rotate(45 ${p[0]} ${p[1]})"/>`).join("")+`</g>`;
  return s}

G.def({
  id:"k10",
  src:{bok:"s. 178, 183 (faktarutan), 184–186",ppt:"Mikroorganismer, bild 20–22 och 36–40",ab:"Arbetsblad Mikroorganismernas värld"},
  threads:["ribosom","membran","nyckel","plasmid"],
  goals:[
    "förklara varför man använder genen för 16S rRNA för att ordna bakterier, och vilka för- och nackdelar förslaget har",
    "rita livets träd med tre domäner och förklara varför arkéer och eukaryoter är närmast släkt",
    "beskriva vad som skiljer arkéer från bakterier enligt boken, och vad läraren säger om cellväggen",
    "ge tre exempel på extremofiler med bokens siffror och förklara varför arkéer påverkar den globala uppvärmningen",
    "definiera virus, beskriva hur virus kan skilja sig åt och resonera om virus är levande",
    "beskriva i fem steg hur herpesviruset tar över en slemhinnecell, och jämföra lytiskt och lysogent (latent) beteende",
    "förklara virusens betydelse för evolutionen och för havets ekosystem"
  ],
  intro:`<p>I {{go:k8|K8}} och {{go:k9|K9}} lärde du känna bakterien, verkstaden i ett enda rum, och hur den byter gener med sina grannar. Nu ska du träffa två andra sorters mikrober. <b>Arkéerna</b> ser ut som bakterier men är byggda i ett annat material och klarar miljöer där inget annat liv överlever. <b>Virusen</b> har ingen fabrik alls. De är kapare som tar över andras fabriker. Först reder vi ut hur forskarna ordnar allt detta i livets träd.</p>`,
  secs:[
  {id:"system",h:"Livets träd och bakteriernas systematik",nav:"Livets träd",src:"s. 178, 183–184 · PPT Mikroorganismer bild 20–22, 36 · Arbetsblad",prov:true,html:`
    <p>Liksom allt levande kan mikroorganismerna delas in i de tre huvudgrupperna <b>bakterier</b>, <b>arkéer</b> och <b>eukaryoter</b>. {{prov}} Alla bakterier och alla arkéer är mikroorganismer, liksom huvuddelen av alla eukaryota arter. {{src:s. 178}} Läraren kallar huvudgrupperna för <b>domäner</b> {{lek:Mikroorganismer bild 20, 36}}.</p>
    <div class="box key"><p>Livet delas in i tre domäner: <b>bakterier</b>, <b>arkéer</b> och <b>eukaryoter</b>. Bakterier och arkéer saknar cellkärna och kallas tillsammans <b>prokaryoter</b>. {{prov}}</p></div>
    <h3>Livets träd</h3>
    <p>Lärarens släktträd visar hur domänerna hänger ihop {{lek:Mikroorganismer bild 20, 36}}. Stammen delar sig först i två grenar. Den ena går till bakterierna. Den andra delar sig en gång till, i arkéer och eukaryoter. Därför har arkéer och eukaryoter en senare gemensam förfader, och de är alltså närmare släkt med varandra än någon av dem är med bakterierna.</p>
    <div class="lfig-h" data-fig="trad"></div>
    <p>Boken säger samma sak från arkéernas håll. Analyserar man arvsmassan ser man att arkéerna utgör en <b>separat huvudgren av livets träd</b>, trots att de till det yttre påminner om bakterier. {{prov}} {{src:s. 184}}</p>
    <p>Läraren lägger till tre saker {{lek:Mikroorganismer bild 20–22}}. De första bakterierna utvecklades för <b>3,5–4 miljarder år sedan</b>. Nutida bakterier härstammar från jordens mest ursprungliga livsformer, men det betyder inte att dagens bakterier är primitiva, eftersom de har utvecklats under miljarder år och är ytterst väl anpassade till dagens miljöer. Bakterierna räknas till <b>prokaryoterna</b>, som även inkluderar domänen arkéer.</p>
    <table class="cmp"><tr><th></th><th>Bakterier</th><th>Arkéer</th><th>Eukaryoter</th></tr>
      <tr><td>Cellkärna</td><td>nej (prokaryot)</td><td>nej (prokaryot)</td><td>ja</td></tr>
      <tr><td>Fosfolipider i cellmembranet</td><td>liknar eukaryoternas</td><td>kemiskt mycket annorlunda</td><td>liknar bakteriernas</td></tr>
      <tr><td>Sjukdom hos människa eller djur</td><td>en del arter</td><td>ingen känd</td><td>en del (t.ex. <i class="sp">Plasmodium</i>)</td></tr>
      <tr><td>Närmast släkt med</td><td>grenade av först</td><td>eukaryoter</td><td>arkéer</td></tr></table>
    <div class="box trap"><p>Arkéer och bakterier är båda prokaryoter och ser lika ut, men det betyder inte att de är närmast släkt. I trädet är arkéerna närmare släkt med eukaryoterna, alltså med oss. "Prokaryot" beskriver hur cellen är byggd (ingen kärna), inte en släktgren.</p></div>
    <div class="box fab"><p>I fabriksbilden finns tre sorters byggnader. Bakterien och arkén är båda verkstäder i ett enda rum, utan ledningskontor. Men arkéns verkstad är byggd i ett annat material, och ritningarna visar att arkén är närmare släkt med den stora fabriken med många rum (eukaryoten) än med bakteriens verkstad.</p></div>
    <h3>Hur ordnar man bakterier? 16S rRNA</h3>
    <p>Bakterieindivider kan skilja sig mycket från varandra, eftersom de hela tiden tappar, tar upp och flyttar gener ({{go:k9.overforing|K9}}). Många bakterier har inte ens hälften av sina gener gemensamma med alla sina artfränder. Därför diskuterar forskarna hur man egentligen ska definiera en <b>art</b> och ett släktskap hos bakterier. Var i släktträdet ska man rita in en bakterie som har fått hälften av sina arvsanlag från en bakterie och hälften från en annan? {{src:s. 183}}</p>
    <div class="box key"><p>Man har <b>enats</b> om att låta genen för en av ribosomernas RNA-molekyler, <b>16S rRNA</b>, avgöra vilken <b>släkt och familj</b> en bakterie hör till. Att samma gen också ska avgöra <b>art</b> är bara ett <b>förslag</b>. {{src:s. 183}}</p></div>
    <p>Enligt förslaget räknas bakterier som har samma gen för denna RNA-molekyl som en art, oavsett hur lika eller olika de är i övrigt. Förslaget har två stora fördelar. Systematiken grundar sig då på ett enhetligt sätt på <b>släktskap</b>. Dessutom kan man artbestämma bakterier mycket snabbt och enkelt, utan att ens ha sett dem. Det räcker att ta ett prov där bakterierna finns, slå sönder cellerna och <b>sekvensbestämma</b> det DNA man hittar.</p>
    <p>Förslaget har också problem. Ett mindre problem är att vi måste föra ihop bakterier som vi tidigare har sett som olika arter, ibland från olika släkten eller familjer, till samma art, och dela upp sådana vi har sett som en art i flera. Det stora problemet är att en del bakterier har <b>flera kopior</b> av genen, och ibland har kopiorna olika sekvens. Ska bakterien då höra till flera arter på samma gång?</p>
    <ol class="chainv"><li>Ta ett prov där bakterierna finns.</li><li>Slå sönder cellerna.</li><li>Sekvensbestäm DNA:t och läs genen för 16S rRNA.</li><li>Samma gen ger samma art (enligt förslaget), utan att man har sett bakterierna.</li></ol>
    <div class="box extra"><p>Varför just en ribosomgen? Alla celler har ribosomer, och därför har alla bakterier genen. Det gör den användbar som gemensam måttstock.</p></div>
    <div class="box tr" data-t="ribosom" data-h="Ribosomen ordnar livets träd">Ribosomen är arbetsbänken i varje cell ({{go:k4.ribosomer|K4}}). En av dess RNA-molekyler, 16S rRNA, används för att avgöra vilken släkt och familj en bakterie hör till. Bakteriens ribosom är också måltavla för flera antibiotika ({{go:k11.ribosom|K11}}).</div>
    <div class="box trap"><p>Blanda inte ihop vad man har <b>enats</b> om (16S rRNA avgör släkt och familj) med vad som bara är ett <b>förslag</b> (16S rRNA avgör art).</p></div>
    <div class="x" data-x="mcSystem"></div>
  `},
  {id:"arkeer",h:"Arkéer: verkstäder i annat material",nav:"Arkéer",src:"s. 178, 184 · PPT Mikroorganismer bild 36–38 · Arbetsblad",prov:true,html:`
    <p><b>Arkéer</b> påminner till det yttre om bakterier, men det finns flera viktiga skillnader. {{prov}} Arbetsbladet berättar att arkéerna förr räknades till bakterierna {{lek:Arbetsblad}}, och bokens bildtext använder fortfarande det äldre ordet <i>arkebakterier</i>. Men analyserar man arvsmassan ser man att arkéerna är en egen huvudgren av livets träd.</p>
    <div class="box key"><p>Fosfolipiderna i arkéernas <b>cellmembran</b> skiljer sig rent kemiskt kraftigt från fosfolipiderna hos bakterier och eukaryoter. {{prov}} {{src:s. 184}}</p></div>
    <div class="box diff"><p><b>Boken:</b> skillnaden sitter i <b>cellmembranets fosfolipider</b>. Arbetsbladet säger samma sak (cellmembranets huvudkomponenter, fosfolipiderna). <b>Läraren:</b> arkéerna liknar bakterier men har inte samma material i sin <b>cellvägg</b> {{lek:Mikroorganismer bild 37}}. Svara med bokens version på provet, och nämn gärna lärarens cellvägg som tillägg.</p></div>
    <div class="box tr" data-t="membran" data-h="Arkéns tullgräns i annat material">Alla celler har ett cellmembran av fosfolipider ({{go:k1.fosfolipider|K1}}, {{go:k3.uppbyggnad|K3}}). Hos arkéerna är fosfolipiderna kemiskt helt annorlunda än hos bakterier och eukaryoter. Det är bokens viktigaste skillnad mellan arkéer och bakterier.</div>
    <p>Arkéer kan anta något fler former än bakterier. Det finns till exempel arkéer som är <b>platta och fyrkantiga</b>, tunna och <b>nålformade</b>, <b>skrynkliga</b> eller nästan perfekt <b>rektangulära</b>. {{src:s. 184}}</p>
    <h3>Överallt, och där inget annat klarar sig</h3>
    <p>Liksom bakterier finns arkéer i stort sett överallt på jorden: i luft, i vatten, i jord, i olika djurs tarmar och på deras hud. Läraren skriver att de är mycket vanliga och finns där bakterier lever {{lek:Mikroorganismer bild 37}}. Boken går längre. Det finns till och med arkéer på fler ställen i naturen än det finns bakterier, eftersom en del arkéer klarar miljöer som är för tuffa för alla andra livsformer. Sådana organismer kallas <b>extremofiler</b>. {{prov}}</p>
    <div class="lfig-h" data-fig="extrem"></div>
    <table class="cmp"><tr><th>Extremofil</th><th>Klarar</th><th>Exempel</th></tr>
      <tr><td><b>Halofiler</b> (saltälskande)</td><td>höga salthalter</td><td>färgar saltdammar röda och gröna när vattnet avdunstar och saltkristaller faller ut. Döda havet {{lek:Arbetsblad}}</td></tr>
      <tr><td><b>Termofila</b> (värmeälskande)</td><td>växer och delar sig vid <b>+122 °C</b></td><td>lever i heta källor {{lek:Arbetsblad}}</td></tr>
      <tr><td><b>Acidofila</b> (syraälskande)</td><td><b>pH 0</b>, vilket motsvarar 1,2 M svavelsyra</td><td>extremt sura miljöer</td></tr></table>
    <div class="box trick"><p><b>Halo</b> = salt (jämför halogen, saltbildare). <b>Termo</b> = värme (termometer, termos). <b>Acido</b> = syra (acid på engelska). <b>-fil</b> = älskar.</p></div>
    <p>Bokens bilder visar två exempel. <i class="sp">Sulfolobus</i> lever i vulkaniska källor med <b>pH 2</b> och <b>+85 °C</b>. <i class="sp">Deinococcus radiodurans</i> hittades i Saharas öken. För att överleva solens intensiva UV-strålning har den skapat system för att <b>reparera sitt DNA</b>, och därför överlever den även i stark radioaktivitet. {{src:s. 184}}</p>
    <div class="box extra"><p>Bildtexten står under rubriken arkéer och säger "arkebakterier". <i class="sp">Deinococcus radiodurans</i> räknas i dag som en bakterie, inte en arké. Lär dig ändå bildtexten som den står i boken.</p></div>
    <p>Upptäckten att liv kan finnas i så extrema miljöer har gett perspektiv både på frågan om <b>livets uppkomst</b> och på möjligheten att hitta <b>liv på andra planeter</b>. Därför har man föreslagit att arkéer kanske är den livsform som mest påminner om det första livet på jorden. {{src:s. 184}}</p>
    <div class="box diff"><p><b>Boken:</b> arkéerna kanske mest påminner om det första livet. <b>Läraren:</b> nutida <i>bakterier</i> härstammar från jordens mest ursprungliga livsformer {{lek:Mikroorganismer bild 20}}. Det är ingen direkt motsägelse, bara olika betoning. Båda är gamla, prokaryota livsformer.</p></div>
    <p>Arkéer i heta djuphavskällor utvinner energi ur oorganiska kemikalier och bildar kolhydrater, och de kolhydraterna livnär hela ekosystem runt källorna. {{src:s. 178}} Jämför med de kemoautotrofa bakterierna i {{go:k8.naring|K8}}.</p>
    <h3>Metan och global uppvärmning</h3>
    <p>Arkéer spelar en viktig roll i diskussionen om global uppvärmning. {{prov}} Det är arkéer som bildar <b>metan</b> i matspjälkningssystemet hos idisslande djur. Metan är en växthusgas, och därför ger kött- och mjölkproduktion mycket växthusgas. {{src:s. 184}}</p>
    <ol class="chainv"><li>Kon (ett idisslande djur) äter gräs.</li><li>Arkéer i matspjälkningssystemet bildar metan.</li><li>Metan är en växthusgas.</li><li>Kött- och mjölkproduktion ger mycket växthusgas och bidrar till den globala uppvärmningen.</li></ol>
    <p>Läraren beskriver de <b>metanproducerande arkéerna</b> närmare {{lek:Mikroorganismer bild 38}}. De bildar gasen metan, <b>CH₄</b>. De är <b>anaeroba</b>, vilket innebär att de klarar sig utan syrgas. Därför finns de där det är syrefattigt: i <b>sumpmarker</b>, i <b>syrefattiga sjöbottnar</b> och i <b>tarmarna hos olika djur</b>. Arbetsbladet lägger till att metanet från arkéer kan utnyttjas för att framställa <b>biogas</b>, som används som bränsle {{lek:Arbetsblad}}.</p>
    <div class="x" data-x="chainArk"></div>
    <h3>Ingen sjukdom</h3>
    <p>En sak verkar arkéer inte kunna göra. Man har hittills inte hittat en enda arké som orsakar sjukdom hos vare sig <b>människa eller djur</b>. {{prov}} {{src:s. 184}} Läraren skriver "hos människor" och lägger till att arkéer verkar vara <b>resistenta mot de flesta formerna av antibiotika</b> {{lek:Mikroorganismer bild 37}}. Det är logiskt, eftersom antibiotika är byggda för att sabotera just bakteriernas verkstad ({{go:k11.verkan|K11}}), och arkéns verkstad är byggd i annat material.</p>
    <div class="box fab"><p>Arkén är en verkstad i ett enda rum, precis som bakterien, men byggd i ett annat material. Därför fungerar inte bakteriesabotörerna (antibiotika) på den, och därför står den emot hetta, salt och syra som skulle förstöra andra verkstäder.</p></div>
    <div class="box trap"><p>Arkéer har ingen cellkärna, men de är inga bakterier. Och de är inte sällsynta: de finns i stort sett överallt, även i din tarm och på din hud.</p></div>
    <div class="x" data-x="sortArk"></div>
    <div class="x" data-x="matchExtrem"></div>
  `},
  {id:"virus",h:"Virus: kapare utan egen fabrik",nav:"Virus",src:"s. 178, 184–185 · PPT Mikroorganismer bild 39–40 · Arbetsblad",prov:true,html:`
    <div class="box key"><p>Ett <b>virus</b> är en bit arvsanlag, inslaget i ett paket med proteiner och ibland också ett membran, som kan ta sig in i en levande cell och få den att använda sin energi och sina näringsämnen till att göra nya viruspartiklar. {{prov}} {{src:s. 184}}</p></div>
    <div class="box diff"><p>Lärarens definition är nästan ordagrant bokens, men utan membranet {{lek:Mikroorganismer bild 39}}. Arbetsbladet har med det: vissa virus har också ett membran utanför paketet {{lek:Arbetsblad}}. Ta med membranet i ditt svar.</p></div>
    <div class="lfig-h" data-fig="virus"></div>
    <h3>Lever virus?</h3>
    <p>Virus brukar räknas till mikroorganismerna, men man kan diskutera om de ska räknas som levande. {{src:s. 178}} Svaret beror på vad man tycker är den viktigaste egenskapen för liv. {{prov}}</p>
    <table class="cmp"><tr><th>Viktigaste egenskapen för liv</th><th>Är virus levande?</th><th>Varför</th></tr>
      <tr><td>Egen ämnesomsättning och energihantering</td><td><b>nej</b>, döda</td><td>virus har ingen egen ämnesomsättning och använder cellens energi</td></tr>
      <tr><td>Informationsöverföring och evolution</td><td><b>ja</b>, levande</td><td>virus för vidare sina arvsanlag och utvecklas</td></tr></table>
    <p>Arbetsbladet säger att biologer inte är eniga. Det kallar virus för <b>parasiter</b>, eftersom de inte har någon egen ämnesomsättning och måste invadera en cell för att kunna föröka sig {{lek:Arbetsblad}}. Läraren påpekar att bakterier, till skillnad från virus, har egen ämnesomsättning {{lek:Mikroorganismer bild 28}}.</p>
    <div class="box fab"><p>Viruset är en <b>kapare utan egen fabrik</b>. Det har bara en ritning (arvsanlagen) i en låda (proteinhöljet), ibland inslagen i en stulen bit tullgräns (membranet). Det tar sig in i en fabrik och får den att använda sin egen energi och sina egna råvaror till att bygga nya kapare.</p></div>
    <h3>Hur virus skiljer sig åt</h3>
    <p>Över <b>5 000</b> olika virus är beskrivna i detalj, men man räknar med att det finns minst <b>en miljon</b>. {{prov}} {{src:s. 184}} Läraren skriver ca 1 000 000 virus, varav 5 000 beskrivna {{lek:Mikroorganismer bild 39}}.</p>
    <ul>
      <li>Arvsanlagen är <b>DNA</b> eller <b>RNA</b>. {{prov}}</li>
      <li>Molekylerna kan vara <b>enkelsträngade</b> eller <b>dubbelsträngade</b>.</li>
      <li>Virus kan ha eller sakna <b>membranhölje</b>.</li>
      <li>Storleken varierar från <b>20 nm</b> till <b>en mikrometer</b> (1 µm). {{src:s. 185}}</li>
    </ul>
    <div class="box trap"><p>Virus är inte alltid mindre än bakterier. De största virusen (1 µm) är lika stora som små bakterier, eftersom bakterier är från några tiondels mikrometer stora ({{go:k8.form|K8}}). Skillnaden är att viruset inte är en cell och saknar egen ämnesomsättning.</p></div>
    <table class="cmp"><tr><th></th><th>Virus</th><th>Bakterie</th></tr>
      <tr><td>Är en cell</td><td>nej, arvsanlag i ett proteinpaket</td><td>ja, en cell utan kärna</td></tr>
      <tr><td>Egen ämnesomsättning</td><td>nej, använder cellens energi och näring</td><td>ja</td></tr>
      <tr><td>Förökning</td><td>bara inne i en levande värdcell</td><td>delning</td></tr>
      <tr><td>Arvsanlag</td><td>DNA eller RNA, enkel- eller dubbelsträngat</td><td>DNA (kromosom och plasmider)</td></tr>
      <tr><td>Storlek</td><td>20 nm – 1 µm</td><td>några tiondels – något tiotal µm</td></tr></table>
    <h3>Vem kan smittas?</h3>
    <p>De flesta virus kan bara infektera någon eller några arter eller artgrupper. Men <b>alla livsformer</b> kan infekteras av virus: växter, svampar, djur, encelliga eukaryoter, bakterier och arkéer. {{prov}} De virus som kan infektera bakterier eller arkéer kallas ofta <b>fager</b> eller <b>bakteriofager</b>. {{src:s. 185}}</p>
    <div class="box diff"><p><b>Boken:</b> fager infekterar bakterier <b>eller arkéer</b>. <b>Läraren och arbetsbladet:</b> virus som infekterar <b>bakterier</b> kallas bakteriofager {{lek:Mikroorganismer bild 39}}. Boken är bredare.</p></div>
    <p>Varför kan ett virus bara infektera vissa arter? Viruset måste först fästa vid cellen. Proteiner på virusets yta passar till proteiner i cellens membran, som en nyckel i ett lås (boken säger "som hand i handske" om herpesviruset). Därför kan viruset bara ta sig in i celler som har rätt lås. {{extra}}</p>
    <div class="box tr" data-t="nyckel" data-h="Virusets falska nyckel">Virusets ytproteiner passar i cellens membranproteiner som en nyckel i ett lås, eller som hand i handske. Samma princip används när signalmolekyler binder till receptorer ({{go:k3.proteiner|K3}}) och när antibiotika binder till bakteriens enzym ({{go:k11.verkan|K11}}).</div>
    <h3>Två livsstilar</h3>
    <p>Virus kan uppföra sig på helt olika sätt när de kommer in i en cell. Antingen tar de över cellen med en gång och dödar den, eller så lägger de sig som en tyst <b>fripassagerare</b> i cellen. Det virus som orsakar herpes kan göra båda delarna, och det är bokens exempel i nästa avsnitt ({{go:k10.herpes|herpes}}). {{src:s. 185}}</p>
    <p>Läraren visar en film om hur ett virus fungerar {{lek:Mikroorganismer bild 40}}, och bilden på bild 39 är det välkända coronaviruset med sina utstickande proteiner.</p>
    <div class="x" data-x="tfVirus"></div>
    <div class="x" data-x="clozeVirus"></div>
  `},
  {id:"herpes",h:"Herpesviruset tar över en cell",nav:"Herpes",src:"s. 185–186",html:`
    <p><b>Herpesviruset</b> består av en <b>DNA-molekyl</b> omgiven av ett <b>proteinhölje</b>, som är inslaget i ett <b>membran</b> med några proteiner. Viruset smittar genom kontakt mellan <b>slemhinnor</b>, till exempel vid kyssar och sex. {{src:s. 185}}</p>
    <p>I princip finns ett slags herpesvirus som orsakar <b>munsår</b> och ett annat som orsakar <b>sår på könsorganen</b>. Men båda virusen kan ibland ta sig in även i den andra sortens slemhinna. Därför kan viruset ibland smitta mellan mun och könsorgan vid oralsex.</p>
    <h3>Fem steg i slemhinnecellen</h3>
    <div class="lfig-h" data-fig="herpes"></div>
    <ol>
      <li><b>Bindning och sammansmältning.</b> Proteiner i virusets membran passar som hand i handske och binder till proteiner i membranet hos celler i läpparnas och könsorganens slemhinna. Det leder till att membranen smälter ihop, så att DNA-molekylen och proteinhöljet hamnar inne i cellen.</li>
      <li><b>Isärtagning.</b> DNA-molekylen och proteinhöljet säras.</li>
      <li><b>Kopiering.</b> DNA-molekylen förs in i kärnan och kopieras många gånger.</li>
      <li><b>Avläsning.</b> DNA-molekylen avläses, och det bildas proteiner som (a) stänger av cellens förmåga att använda sina egna arvsanlag, vilket på sikt dömer cellen till döden, (b) bryter ner cellens proteiner och arvsmassa till byggstenar som används till nya virus och (c) ingår i virusets membran och bygger upp dess hölje.</li>
      <li><b>Avknoppning.</b> DNA-molekylerna och proteinerna ordnar sig till nya viruspartiklar, som slås in i en bit av cellens membran och knoppas av från cellen. Efter en tid dör cellen.</li>
    </ol>
    <div class="box trick"><p><b>F-S-K-A-K</b>: <b>F</b>äster, <b>S</b>äras, <b>K</b>opieras, <b>A</b>vläses, <b>K</b>noppas av. "<b>F</b>arliga <b>S</b>må <b>K</b>apare <b>A</b>nfaller <b>K</b>roppen."</p></div>
    <div class="box fab"><p>Kaparen tar sig in genom tullgränsen genom att visa en falsk nyckel. Väl inne lämnar den sin ritning till ledningskontoret (kärnan), som kopierar den om och om igen. De nya instruktionerna stänger av fabrikens egna ritningar, river maskinerna till byggdelar och bygger nya kapare, som lämnar fabriken inslagna i en bit av dess egen tullgräns. Fabriken går under.</p></div>
    <div class="box tr" data-t="membran" data-h="Viruset stjäl en bit membran">Herpesviruset kommer in genom att dess membran smälter ihop med cellmembranet, och de nya virusen knoppas av inslagna i en bit av cellens membran. Det liknar endocytos och exocytos i {{go:k5.endocytos|K5}}, där membran smälter ihop och snörs av.</div>
    <div class="x" data-x="ordHerpes"></div>
    <h3>Lytiskt: snabbt och dödligt</h3>
    <p>I slemhinnecellerna är viruset mycket aggressivt mot cellen, som inte har en chans att överleva utan dör relativt snabbt. Innan dess har den dock hunnit bilda <b>hundratals</b> nya viruspartiklar, som kan spridas på slemhinnan och ta sig in i nya celler. Att snabbt föröka sig och döda sin värd kallas <b>lytiskt</b> beteende. {{src:s. 186}}</p>
    <p>Det är när viruset beter sig lytiskt i slemhinnan som de karakteristiska <b>såren</b> vid herpes bildas. De blir dessutom hårda och svullna av de reaktioner som kroppens försvar sätter igång.</p>
    <h3>Lysogent och latent: tyst och långsiktigt</h3>
    <p>Herpesviruset kan också dra ner på sin aktivitet och ligga nästan tyst inne i en cell. Ibland har det då till och med satt in sin DNA-molekyl i värdcellens DNA, och därför kopieras virusets arvsmassa garanterat varje gång cellen delar sig. När viruset uppför sig på detta sätt kallas det <b>lysogent</b>. Viruset prioriterar då långsiktig överlevnad framför snabb förökning. {{src:s. 186}}</p>
    <p>Då kan viruset ligga gömt i många år i några av kroppens celler. Man säger ofta att viruset ligger <b>latent</b>. För herpesviruset sker det ofta i <b>nervceller</b> som startar eller slutar i de läppar som har infekterats.</p>
    <div class="box extra"><p><b>Reaktivering.</b> Boken säger inte vad som händer sedan. Ett latent herpesvirus kan senare vakna och börja bete sig lytiskt igen. Då kan ett nytt munsår komma på samma ställe, eftersom viruset ligger kvar i nerverna till läppen.</p></div>
    <table class="cmp"><tr><th></th><th>Lytiskt</th><th>Lysogent (latent)</th></tr>
      <tr><td>Aktivitet</td><td>hög, snabb förökning</td><td>låg, nästan tyst</td></tr>
      <tr><td>Värdcellen</td><td>dör relativt snabbt</td><td>lever vidare och delar sig</td></tr>
      <tr><td>Virusets DNA</td><td>kopieras många gånger i kärnan</td><td>ibland insatt i värdcellens DNA, kopieras vid varje delning</td></tr>
      <tr><td>Nya virus</td><td>hundratals</td><td>inga för stunden</td></tr>
      <tr><td>Prioriterar</td><td>snabb förökning</td><td>långsiktig överlevnad</td></tr>
      <tr><td>Herpes: var?</td><td>slemhinnan, ger sår</td><td>nervceller till läpparna, i många år</td></tr></table>
    <div class="box trap"><p><b>Lytiskt</b> = cellen <b>lyseras</b>, går sönder och dör. <b>Lysogent</b> låter likt men betyder motsatsen: cellen lever och viruset gömmer sig. <b>Latent</b> är vardagsordet för samma tysta läge.</p></div>
    <div class="box tr" data-t="plasmid" data-h="Främmande DNA i arvsmassan">När herpesviruset sätter in sitt DNA i värdcellens DNA kopieras det med vid varje delning. På samma sätt fogas virus-DNA in i bakteriens kromosom vid transduktion, och gener flyttas mellan plasmid och kromosom med transposoner ({{go:k9.overforing|K9}}, {{go:k9.transposoner|K9}}).</div>
    <div class="w" data-w="k10Herpes"></div>
    <div class="x" data-x="chainHerpes"></div>
  `},
  {id:"betydelse",h:"Virusens betydelse",nav:"Betydelse",src:"s. 186 · Arbetsblad",prov:true,html:`
    <h3>Gener på tvären</h3>
    <p>Virus har spelat en mycket viktig roll i evolutionen genom att transportera gener mellan olika individer och arter. Gener har därför inte bara förts vidare <b>vertikalt</b>, från anfader till avkomma, utan också <b>horisontellt</b>, mellan olika individer och arter. Man har till exempel hittat genen för <b>hemoglobin</b> i vissa växter. {{src:s. 186}}</p>
    <ol class="chainv"><li>Virus för gener mellan individer och arter (horisontellt).</li><li>Gener kombineras på nya sätt.</li><li>Den genetiska variationen ökar.</li><li>Variationen är grunden för det naturliga urvalet.</li></ol>
    <div class="box link"><p>Vertikal och horisontell spridning hos bakterier finns i {{go:k9.spridning|K9}}, och transduktion, där en fag bär gener mellan bakterier, i {{go:k9.overforing|K9}}.</p></div>
    <div class="box tr" data-t="plasmid" data-h="Horisontella gener">Plasmider och virus gör samma sak på olika sätt: de flyttar gener horisontellt mellan individer. Hos bakterier sprids resistensgener så ({{go:k12.spridning|K12}}), och genom evolutionen har virus flyttat gener mellan helt olika arter.</div>
    <h3>Havets dödsskvadron</h3>
    <p>Virus spelar också viktiga roller i ekosystemen. {{prov}} I de marina ekosystemen står bakterier för huvuddelen av fotosyntesen. Där finns det i varje milliliter havsvatten minst <b>tio gånger fler bakterievirus än bakterier</b>. Virusen angriper och dödar bakterier så ofta att de bakterier som dödas under en enda dag utgör ungefär <b>en femtedel av havets biomassa</b>. {{src:s. 186}}</p>
    <p>Molekylerna i de döda bakterierna släpps ut i vattnet och kan tas upp av andra organismer. Därför gör bakterievirusen havets ekosystem mycket mer dynamiska och flexibla än de annars skulle ha varit. Arbetsbladet lägger till att det på detta sätt frigörs mycket DNA, vilket påverkar havet som ekosystem {{lek:Arbetsblad}}.</p>
    <ol class="chainv"><li>Bakterievirus angriper och dödar havets bakterier.</li><li>Bakteriernas molekyler släpps ut i vattnet.</li><li>Andra organismer tar upp molekylerna.</li><li>Havets ekosystem blir mer dynamiska och flexibla.</li></ol>
    <p>Även i människans tarmar finns <b>tusentals</b> olika bakterievirus, men vilken roll de spelar har man ännu ingen aning om. {{src:s. 186}}</p>
    <div class="box trap"><p>Det finns två olika "tio gånger" i materialet. I tarmen finns ungefär tio gånger fler <b>bakterier</b> än människoceller ({{go:k8.ekosystem|K8}}). I havet finns minst tio gånger fler <b>bakterievirus</b> än bakterier per milliliter.</p></div>
    <div class="box fab"><p>I havet river kaparna hela tiden ner verkstäder. Byggmaterialet hamnar på gatan, och där plockar andra fabriker upp det och använder det. Därför går materialet runt snabbare i havets ekonomi.</p></div>
    <div class="x" data-x="whoK10"></div>
    <div class="x" data-x="fixK10"></div>
  `}
  ],
  figs:{
    trad:{vb:"0 0 460 340",svg:figTrad(),
      labels:[["domän|bakterier",80,86,null,null,"m"],["domän|arkéer",230,86,null,null,"m"],["domän|eukaryoter",380,86,null,null,"m"],
        ["prokaryoter (ingen cellkärna)",155,14,null,null,"m"],
        ["bakterierna|grenar av först",14,256,158,262,"s"],["arkéer + eukaryoter:|senare gemensam|förfader",290,236,298,202,"s"],
        ["gemensam|förfader",182,306,null,null,"s"]],
      parts:{bak:{t:"Domän bakterier",d:"Prokaryoter utan cellkärna. De grenade av först i livets träd. De första bakterierna utvecklades för 3,5–4 miljarder år sedan (lektionen).",go:"k8"},
        ark:{t:"Domän arkéer",d:"Prokaryoter som till det yttre liknar bakterier. Arvsmassan visar att de är en egen huvudgren, och fosfolipiderna i cellmembranet är kemiskt helt annorlunda.",go:"k10.arkeer"},
        euk:{t:"Domän eukaryoter",d:"Celler med cellkärna: djur, växter, svampar och encelliga eukaryoter som Plasmodium. Närmast släkt med arkéerna.",go:"k7"}},
      cap:"Livets träd med tre domäner. Stammen delar sig först (nedre röda pricken) i bakterier och en gren som sedan (övre röda pricken) delar sig i arkéer och eukaryoter. Därför är arkéer och eukaryoter närmast släkt. Tryck på en domän.",src:"PPT Mikroorganismer bild 20, 36 · bok s. 178, 184"},
    virus:{vb:"0 0 460 300",svg:figVirus(),
      labels:[["membranproteiner",10,26,86,96,"s"],["DNA eller RNA",176,26,160,150,"s"],["membranhölje",10,290,98,212,"s"],["proteinhölje",130,290,158,203,"s"],
        ["bakteriofag",330,22,null,null,"s"],["DNA",424,98,394,92,"s"],["utan|membranhölje",316,270,null,null,"s"]],
      parts:{holje:{t:"Membranhölje med proteiner",d:"Vissa virus, t.ex. herpesviruset, är inslagna i ett membran med några proteiner. Membranet är en bit av den förra värdcellens membran. Proteinerna passar som hand i handske till proteiner i nästa cells membran.",go:"k10.herpes"},
        kapsid:{t:"Proteinhölje",d:"Paketet av proteiner som arvsanlagen är inslagna i. Alla virus har det."},
        dna:{t:"Arvsanlagen",d:"DNA eller RNA, enkelsträngat eller dubbelsträngat. Det är ritningen till nya virus, men viruset saknar egen fabrik för att bygga dem."},
        fag:{t:"Bakteriofag",d:"Ett virus som infekterar bakterier eller arkéer. Det här saknar membranhölje. Fager kan föra gener mellan bakterier (transduktion).",go:"k9.overforing"}},
      cap:"Virusets byggnad. Till vänster ett virus med membranhölje (som herpesviruset), till höger en bakteriofag utan membranhölje. Virus är 20 nm till 1 µm stora. Tryck på delarna.",src:"Bok s. 184–185 · PPT Mikroorganismer bild 39"},
    herpes:{vb:"0 0 460 444",svg:figHerpes(),
      labels:[["herpesvirus",80,30,null,null,"s"],["1 membranen smälter ihop",176,66,null,null,"s"],["slemhinnecell",440,108,null,null,"e"],
        ["3 DNA kopieras i kärnan",232,128,null,null,"s"],["2 DNA och hölje säras",24,214,null,null,"s"],["4 virusproteiner",24,262,null,null,"s"],
        ["stänger av cellens|egna gener",24,288,null,null,"s"],["bryter ner cellen|till byggstenar",24,334,null,null,"s"],["5 nya virus knoppas av",370,424,null,null,"e"]],
      parts:{v0:{t:"Herpesvirus",d:"En DNA-molekyl omgiven av ett proteinhölje, inslaget i ett membran med några proteiner. Smittar genom kontakt mellan slemhinnor."},
        s1:{t:"Steg 1",d:"Proteiner i virusets membran passar som hand i handske och binder till proteiner i slemhinnecellens membran. Membranen smälter ihop, och DNA-molekylen och proteinhöljet hamnar inne i cellen."},
        s2:{t:"Steg 2",d:"DNA-molekylen och proteinhöljet säras."},
        karna:{t:"Steg 3: kärnan",d:"DNA-molekylen förs in i kärnan och kopieras många gånger."},
        s4:{t:"Steg 4",d:"DNA:t avläses, och proteiner bildas som (a) stänger av cellens förmåga att använda sina egna arvsanlag, (b) bryter ner cellens proteiner och arvsmassa till byggstenar och (c) bygger virusets membran och hölje."},
        s5:{t:"Steg 5",d:"DNA och proteiner ordnar sig till nya viruspartiklar, som slås in i en bit av cellens membran och knoppas av. Efter en tid dör cellen. Det kallas lytiskt beteende."},
        ny:{t:"Nytt herpesvirus",d:"En av hundratals nya viruspartiklar. Den kan spridas på slemhinnan och ta sig in i nya celler."},
        cell:{t:"Slemhinnecellen",d:"En cell i läpparnas eller könsorganens slemhinna. Den har ingen chans att överleva och dör relativt snabbt."}},
      cap:"Herpesviruset tar över en slemhinnecell i fem steg. Bokens bildtext: \"Virus består av en bit arvsanlag omgiven av proteiner, som kan ta över kommandot av en cell, och får den att bilda många nya viruspartiklar. Herpesviruset är ett exempel.\"",src:"Bok s. 185"},
    extrem:{vb:"0 0 460 300",svg:figExtrem(),
      labels:[["termofila arkéer: +122 °C",446,26,null,null,"e"],["Sulfolobus: +85 °C",292,106,292,84,"m"],
        ["acidofila: pH 0 = 1,2 M svavelsyra",14,132,null,null,"s"],["Sulfolobus: pH 2",80,218,80,182,"s"],
        ["halofiler: höga|salthalter, färgar|saltdammar röda|och gröna",176,244,null,null,"s"]],
      parts:{termo:{t:"Värmeälskande (termofila) arkéer",d:"Klarar att växa och dela sig vid +122 °C. Arbetsbladet: lever i heta källor. Sulfolobus lever i vulkaniska källor med +85 °C."},
        acido:{t:"Syraälskande (acidofila) arkéer",d:"Kan leva vid pH 0, vilket motsvarar 1,2 M svavelsyra. Sulfolobus lever vid pH 2."},
        halo:{t:"Saltälskande arkéer (halofiler)",d:"Lever vid höga salthalter och färgar saltdammar röda och gröna när vattnet avdunstar och saltkristaller faller ut. Arbetsbladet: Döda havet."}},
      cap:"Extremofiler bland arkéerna, med bokens siffror. Överst temperatur, i mitten pH, nederst en saltdamm.",src:"Bok s. 184 · Arbetsblad"}
  },
  ex:{
    mcSystem:{ty:"mc",h:"Livets träd och 16S rRNA",src:"s. 178, 183–184 · PPT Mikroorganismer bild 20, 36",items:[
      {q:"Vilka två domäner är närmast släkt enligt lärarens släktträd?",o:["Arkéer och eukaryoter","Bakterier och arkéer","Bakterier och eukaryoter","Alla tre är lika nära släkt"],why:"Bakterierna grenade av först. Arkéer och eukaryoter har en senare gemensam förfader. Att bakterier och arkéer båda är prokaryoter säger inget om släktskap."},
      {q:"Vad har forskarna enats om att genen för 16S rRNA ska avgöra?",o:["Vilken släkt och familj en bakterie hör till","Vilken art en bakterie hör till","Om bakterien är grampositiv","Om bakterien kan orsaka sjukdom"],why:"Att genen också ska avgöra art är bara ett förslag."},
      {q:"Vad är det stora problemet med att låta 16S rRNA avgöra art?",o:["En del bakterier har flera kopior av genen med olika sekvens","Genen finns bara hos arkéer","Man måste odla bakterierna först","Genen ändras varje gång bakterien delar sig"],why:"Ska bakterien då höra till flera arter på samma gång? Att man måste slå ihop och dela upp gamla arter är det mindre problemet."},
      {q:"Varför kan man artbestämma bakterier utan att ens ha sett dem?",o:["Man kan sekvensbestämma DNA:t i ett prov och läsa 16S-genen","Man färgar dem med Grams metod","Man räknar hur fort de delar sig","Man tittar på deras form i mikroskop"],why:"Ta ett prov, slå sönder cellerna och sekvensbestäm DNA:t."},
      {q:"Vad säger arvsmassan om arkéerna?",o:["De är en separat huvudgren av livets träd","De är en sorts bakterier","De är eukaryoter utan kärna","De är virus med cellvägg"],why:"De påminner till det yttre om bakterier, men arvsmassan visar en egen huvudgren (s. 184)."}]},
    sortArk:{ty:"sort",h:"Bakterie, arké eller båda?",intro:"Sortera påståendena enligt boken.",src:"s. 180–184 · PPT Mikroorganismer bild 22, 37",cats:["Bakterier","Arkéer","Båda"],items:[
      ["Saknar cellkärna",2,"Båda är prokaryoter."],
      ["Fosfolipiderna i cellmembranet liknar eukaryoternas",0,"Det är arkéernas fosfolipider som skiljer sig kemiskt."],
      ["Ingen känd art orsakar sjukdom hos människa eller djur",1,"Boken s. 184: inte en enda arké har hittats som orsakar sjukdom."],
      ["Bildar metan i idisslares matspjälkning",1,"Det är arkéer som bildar metan."],
      ["Finns i luft, vatten, jord, djurs tarmar och hud",2,"Boken: liksom bakterier finns arkéer i stort sett överallt."],
      ["Kan klara +122 °C och pH 0",1,"Det är extremofila arkéer."],
      ["Kan vara platta och fyrkantiga eller nästan perfekt rektangulära",1,"Arkéer kan anta något fler former än bakterier."],
      ["Grenade av först i livets träd",0,"Arkéer och eukaryoter delar en senare gemensam förfader."],
      ["Kan infekteras av fager",2,"Boken: fager infekterar bakterier eller arkéer."]]},
    matchExtrem:{ty:"match",h:"Extremofiler och siffror",src:"s. 184 · Arbetsblad",pairs:[
      ["Halofiler","höga salthalter, saltdammar, Döda havet"],["Termofila arkéer","+122 °C, heta källor"],["Acidofila arkéer","pH 0 = 1,2 M svavelsyra"],
      ["Sulfolobus","vulkaniska källor, pH 2 och +85 °C"],["Deinococcus radiodurans","Saharas öken, reparerar sitt DNA, tål radioaktivitet"],["Metanbildande arkéer","anaeroba, sumpmarker och tarmar"]]},
    chainArk:{ty:"chain",h:"Saknad länk: arkéer",items:[
      {h:"Kor och klimat",steps:["Idisslare äter gräs","Arkéer i matspjälkningen bildar metan","Metan är en växthusgas","Kött- och mjölkproduktion bidrar till global uppvärmning"],b:1,w:["Bakterier i kons lungor bildar koldioxid","Arkéer i gräset bildar syre"],why:"Boken s. 184: det är arkéer som bildar metan i matspjälkningssystemet hos idisslande djur."},
      {h:"Var metanbildarna bor",steps:["Arkéerna är anaeroba","De klarar sig utan syrgas","De lever i syrefattiga miljöer","T.ex. sumpmarker, sjöbottnar och tarmar"],b:1,w:["De behöver mycket syrgas","De gör fotosyntes"],why:"Anaerob betyder att organismen klarar sig utan syrgas (PPT bild 38)."},
      {h:"Djuphavskällan",steps:["Arkéer vid heta djuphavskällor","utvinner energi ur oorganiska kemikalier","och bildar kolhydrater","som livnär hela ekosystemet runt källan"],b:2,w:["och bildar metan som andra djur andas","och tar upp ljus för fotosyntes"],why:"Boken s. 178. Där finns inget solljus, så energin kommer från kemikalier."}]},
    tfVirus:{ty:"tf",h:"Sant eller falskt om virus",src:"s. 178, 184–185 · PPT Mikroorganismer bild 39",items:[
      ["Alla virus har ett membran runt sitt proteinpaket.",false,"Bara vissa virus har membranhölje. Boken: \"ibland också ett membran\"."],
      ["Virusens arvsanlag kan vara DNA eller RNA, enkel- eller dubbelsträngade.",true,"Boken s. 185."],
      ["Virus har egen ämnesomsättning.",false,"Viruset får cellen att använda sin energi och sina näringsämnen. Därför kallas virus parasiter (arbetsbladet)."],
      ["Om man tycker att evolution är livets viktigaste egenskap hör virus till det levande.",true,"Boken: är det informationsöverföring och evolution hör virusen till det levande."],
      ["Ett virus kan vara större än en liten bakterie.",true,"Virus är upp till en mikrometer, och bakterier från några tiondels mikrometer."],
      ["Det finns ungefär 5 000 virus i världen.",false,"Över 5 000 är beskrivna i detalj, men man räknar med minst en miljon."],
      ["Växter, svampar och arkéer kan också infekteras av virus.",true,"Alla livsformer kan infekteras av virus."],
      ["De flesta virus kan infektera nästan alla arter.",false,"De flesta kan bara infektera någon eller några arter eller artgrupper."]]},
    clozeVirus:{ty:"cloze",h:"Arbetsbladet: virus",src:"Arbetsblad Mikroorganismernas värld · s. 184–185",bank:true,text:"Virus räknas som en mikroorganism trots att biologer inte är eniga om man ska räkna dem som levande. De består endast av arvsmassa, [[DNA]] eller [[RNA]], inslaget i ett paket med [[proteiner|protein]]. Vissa virus har också ett [[membran|membranhölje]] utanför detta paket. Virus är [[parasiter|parasit]] eftersom de inte har någon egen [[ämnesomsättning]]. De virus som infekterar bakterier kallas för [[bakteriofager|fager|bakteriofag]]."},
    ordHerpes:{ty:"order",h:"Herpesvirusets fem steg",intro:"Lägg stegen i rätt ordning.",src:"s. 185",items:[
      "Virusets membranproteiner binder som hand i handske till slemhinnecellens membranproteiner",
      "Membranen smälter ihop, och DNA och proteinhölje hamnar i cellen",
      "DNA-molekylen och proteinhöljet säras",
      "DNA:t förs in i kärnan och kopieras många gånger",
      "DNA:t avläses, och virusproteiner stänger av cellens gener och bryter ner den till byggstenar",
      "Nya viruspartiklar slås in i en bit cellmembran och knoppas av",
      "Cellen dör, och de nya virusen sprids på slemhinnan"],why:"Viruset måste in (1) och packas upp (2) innan DNA:t kan kopieras (3) och läsas av (4). Först då finns delar till nya virus (5)."},
    chainHerpes:{ty:"chain",h:"Saknad länk: herpes",items:[
      {h:"Varför cellen dör",steps:["Virus-DNA avläses","Virusproteiner bildas","De stänger av cellens egna arvsanlag och bryter ner dess proteiner","Cellen dör"],b:2,w:["De reparerar cellens DNA","De pumpar ut viruset ur cellen"],why:"Boken s. 185: proteinerna stänger av cellens förmåga att använda sina egna arvsanlag, vilket dömer cellen till döden."},
      {h:"Munsåret",steps:["Viruset beter sig lytiskt i slemhinnan","Slemhinnecellerna dör","Sår bildas","Kroppens försvar gör såren hårda och svullna"],b:1,w:["Viruset sätter in sitt DNA i nervcellen","Bakterier infekterar läppen"],why:"Boken s. 186: såren bildas när viruset beter sig lytiskt i slemhinnan."},
      {h:"Lysogent",steps:["Viruset drar ner sin aktivitet","Det sätter ibland in sitt DNA i värdcellens DNA","Virus-DNA kopieras varje gång cellen delar sig","Viruset överlever i många år (latent)"],b:2,w:["Cellen dör inom några timmar","Hundratals nya virus knoppas av"],why:"Eftersom virusets DNA sitter i värdcellens DNA följer det med vid varje delning."}]},
    whoK10:{ty:"who",h:"Vem är jag?",items:[
      {clues:["Mina fosfolipider är kemiskt annorlunda än dina.","Jag kan leva vid pH 0 eller +122 °C.","Jag bildar metan i kons mage."],a:"Arké",w:["Bakterie","Virus","Bakteriofag"],why:"Arkéer är prokaryoter med annorlunda membran, många är extremofiler, och de bildar metan (s. 184)."},
      {clues:["Jag är en av ribosomernas RNA-molekyler.","Min gen avgör vilken släkt och familj en bakterie hör till.","Mitt namn är en siffra och en bokstav: 16 och S."],a:"16S rRNA",w:["Plasmid","Transposon","Hemoglobin"],why:"Man har enats om att genen för 16S rRNA avgör släkt och familj (s. 183)."},
      {clues:["Jag har DNA i ett proteinhölje inslaget i ett membran.","Jag kan ligga gömd i nervceller i många år.","Jag ger munsår."],a:"Herpesviruset",w:["Bakteriofag","Coronaviruset","Plasmodium"],why:"Herpesviruset kan bete sig både lytiskt och lysogent (s. 185–186)."},
      {clues:["I havet finns minst tio gånger fler av mig än av mitt byte.","Jag dödar så många bakterier att de utgör en femtedel av havets biomassa per dag.","Jag är ett virus som infekterar bakterier."],a:"Bakteriofag",w:["Arké","Cyanobakterie","Herpesvirus"],why:"Bakterievirus (fager) gör havets ekosystem mer dynamiska (s. 186)."}]},
    fixK10:{ty:"fix",h:"Hitta felen i Pelles förklaring",src:"s. 184–186",parts:[
      "Pelle skriver: Arkéer är en sorts bakterier som skiljer sig genom ",["att de har cellkärna","att fosfolipiderna i cellmembranet är kemiskt annorlunda","Arkéer saknar cellkärna. Boken säger att skillnaden sitter i membranets fosfolipider."],
      ". ",["Virus är levande celler, men mycket små","Virus är inga celler, och om de lever beror på vad man menar med liv","Virus är en bit arvsanlag i ett proteinpaket. Om de räknas som levande beror på om man väger ämnesomsättning eller evolution tyngst."],". När herpesviruset kommer in i cellen ",["förs proteinhöljet in i kärnan och kopieras","förs DNA-molekylen in i kärnan och kopieras","Det är DNA:t som förs in i kärnan, efter att det har särats från proteinhöljet."],
      ". Sedan knoppas nya virus av, och cellen dör. Det kallas ",["lysogent","lytiskt","Snabb förökning som dödar värden kallas lytiskt. Lysogent är det tysta läget."],
      " beteende. Ibland ligger viruset latent i ",["röda blodkroppar","nervceller","Boken: ofta i nervceller som startar eller slutar i de infekterade läpparna."],
      " i många år."]}
  },
  w:{
    k10Herpes(el,api){
      el.className="wid";
      const seg=(id,label,opts,cur)=>`<div class="ctl">${label}<div class="seg" role="group" aria-label="${label}" id="${id}">${opts.map(([v,t])=>`<button type="button" data-v="${v}" aria-pressed="${v===cur}">${t}</button>`).join("")}</div></div>`;
      el.innerHTML=`<div class="wh"><b>Herpesviruset steg för steg</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0;padding:6px"><svg viewBox="0 0 420 290" role="img" aria-label="Herpesvirus som infekterar en slemhinnecell" id="k10-hp-svg"></svg></figure>
      <div><p class="small">Gå igenom infektionen. Efter steg 2 väljer viruset väg. Testa båda.</p>
      ${seg("k10-hp-path","Virusets väg efter steg 2",[["lyt","Lytiskt"],["lys","Lysogent"]],"lyt")}
      <div class="row"><button class="btn ghost sm" type="button" id="k10-hp-prev">Föregående</button><button class="btn sm" type="button" id="k10-hp-next">Nästa steg</button><button class="btn ghost sm" type="button" id="k10-hp-reset">Börja om</button></div>
      <dl class="readout"><dt>Steg</dt><dd id="k10-hp-st"></dd><dt>Cellen</dt><dd id="k10-hp-cell"></dd><dt>Nya virus</dt><dd id="k10-hp-nv"></dd><dt>Syns det?</dt><dd id="k10-hp-syn"></dd></dl>
      <p class="verdict" id="k10-hp-vd"></p><p id="k10-hp-why"></p></div></div>`;
      const svg=el.querySelector("#k10-hp-svg"),$=q=>el.querySelector(q);
      let path="lyt",i=0;
      const C=[ /* gemensamma steg 0–2 */
        {t:"Smitta",cell:"frisk",nv:"0",syn:"nej",v:"m",vd:"Viruset når slemhinnan",why:"Herpesviruset smittar genom kontakt mellan slemhinnor, t.ex. vid kyssar. Det är en DNA-molekyl i ett proteinhölje, inslaget i ett membran med några proteiner. Viruset har ingen egen ämnesomsättning, och därför kan det inte föröka sig förrän det är inne i en cell. {{src:s. 185}}"},
        {t:"1 Bindning",cell:"frisk",nv:"0",syn:"nej",v:"m",vd:"Hand i handske",why:"Proteiner i virusets membran passar som hand i handske, eller nyckel i lås, till proteiner i slemhinnecellens membran. Därför kan viruset bara fästa vid celler med rätt proteiner. Membranen smälter ihop, och DNA-molekylen och proteinhöljet hamnar inne i cellen. {{src:s. 185}} {{t:nyckel}}"},
        {t:"2 Isärtagning",cell:"frisk",nv:"0",syn:"nej",v:"m",vd:"Paketet öppnas",why:"DNA-molekylen och proteinhöljet säras. Nu ligger virusets ritning fri i cellen, och här kan viruset ta två vägar: lytiskt eller lysogent. Välj väg ovanför knapparna. {{src:s. 185}}"}];
      const L=[
        {t:"3 Kopiering",cell:"lever ännu",nv:"0",syn:"nej",v:"m",vd:"DNA kopieras i kärnan",why:"DNA-molekylen förs in i kärnan och kopieras många gånger. Viruset använder cellens egen kopieringsmaskin, eftersom det inte har någon egen. {{src:s. 185}}"},
        {t:"4 Avläsning",cell:"håller på att dö",nv:"byggs",syn:"nej",v:"b",vd:"Cellen tas över",why:"DNA:t avläses, och det bildas proteiner som (a) stänger av cellens förmåga att använda sina egna arvsanlag, (b) bryter ner cellens proteiner och arvsmassa till byggstenar och (c) bygger virusets membran och hölje. Eftersom cellen inte längre kan läsa sina egna gener är den dömd till döden. {{src:s. 185}}"},
        {t:"5 Avknoppning",cell:"dör",nv:"hundratals",syn:"ja, munsår",v:"b",vd:"Lytiskt: snabb förökning, värden dör",why:"Nya viruspartiklar slås in i en bit av cellens membran och knoppas av, och efter en tid dör cellen. Innan dess har den hunnit bilda hundratals nya virus som sprids på slemhinnan till nya celler. När många celler dör bildas såren, och kroppens försvar gör dem hårda och svullna. {{src:s. 185–186}}"}];
      const Y=[
        {t:"3 Tyst läge",cell:"lever",nv:"0",syn:"nej",v:"g",vd:"Lysogent: viruset drar ner aktiviteten",why:"Viruset ligger nästan tyst i cellen. Ibland sätter det in sin DNA-molekyl i värdcellens DNA (den röda biten i den grå tråden). Cellen märker inget och lever vidare. {{src:s. 186}}"},
        {t:"4 Celldelning",cell:"lever och delar sig",nv:"0",syn:"nej",v:"g",vd:"Virus-DNA följer med",why:"När cellen delar sig kopieras hela dess DNA, och eftersom virusets DNA sitter i värdens DNA kopieras det garanterat med. Viruset prioriterar långsiktig överlevnad framför snabb förökning. {{src:s. 186}} {{t:plasmid}}"},
        {t:"5 Latent",cell:"lever",nv:"0",syn:"nej, inga symtom",v:"g",vd:"Gömt i nervceller i många år",why:"Viruset kan ligga gömt i många år. Man säger att det ligger latent. För herpes sker det ofta i nervceller som startar eller slutar i de infekterade läpparna. {{src:s. 186}}"},
        {t:"6 Reaktivering",cell:"börjar tas över",nv:"snart hundratals",syn:"snart, nytt munsår",v:"b",vd:"Viruset vaknar och blir lytiskt",why:"Boken beskriver inte detta steg. Ett latent herpesvirus kan senare vakna och börja bete sig lytiskt igen. Då kopieras DNA:t, cellen tas över och ett nytt munsår kan komma på samma ställe, eftersom viruset ligger kvar i nerverna till läppen. {{extra}}"}];
      const list=()=>C.concat(path==="lyt"?L:Y);
      function virus(x,y,R){return herpV(x,y,R)}
      function draw(){const S=list(),k=i,lyt=path==="lyt";
        const dying=lyt&&k>=4,dead=lyt&&k>=5,re=!lyt&&k===6;
        let g=`<rect x="12" y="46" width="396" height="214" rx="26" ${st(dead?"--bad-soft":"--c-cyto","--c-mem")} stroke-width="6"${dying&&!dead?' opacity=".85"':""}/>`;
        g+=`<ellipse cx="288" cy="140" rx="96" ry="50" ${st("--c-nuc-soft","--c-nuc")} stroke-width="3"/>`;
        /* värdens DNA */
        const ins=!lyt&&k>=3;
        g+=`<path d="M206 150 C230 130 250 170 274 150 S318 130 340 150 S360 168 372 150" fill="none" style="stroke:var(--muted)" stroke-width="3"${dying?' stroke-dasharray="6 6"':""}/>`;
        if(ins)g+=`<path d="M274 150 S300 134 318 138" fill="none" style="stroke:var(--c-dna)" stroke-width="5" stroke-linecap="round"/>`;
        if(k===0)g+=virus(70,22,18)+arr(92,30,128,44,"--ink",2,8);
        if(k===1)g+=`<path d="M110 49 A24 24 0 0 1 158 49" ${st("--c-vir-soft","--c-mem")} stroke-width="5"/>`+hexa(134,56,14,"--c-nuc-soft","--c-nuc",2)+dnaS(134,56,0.42,"--c-dna",2);
        if(k>=2&&k<=3||(!lyt&&k===2))g+=`<path d="M82 112 l10 -6 l8 8 M100 132 l10 4 l-2 10 M70 134 l-6 10 l8 6" fill="none" style="stroke:var(--c-nuc)" stroke-width="3" stroke-linejoin="round"/>`;
        if(k===2)g+=dnaS(140,118,0.55,"--c-dna",3)+arr(160,124,196,134,"--ink",2,8);
        if(lyt&&k>=3){[[236,120],[262,112],[300,116],[334,122],[248,160],[322,164]].slice(0,k===3?6:4).forEach(p=>{g+=dnaS(p[0],p[1],0.5,"--c-dna",2.5)})}
        if(lyt&&k>=4){[[150,200],[164,192],[176,206],[160,214],[140,190],[184,196],[130,208],[196,212]].forEach(p=>{g+=dot(p[0],p[1],4.5,"--c-nuc")});
          g+=arr(206,172,180,188,"--ink",2,7)}
        if(lyt&&k>=5){g+=hexa(240,222,12,"--c-nuc-soft","--c-nuc",2)+dnaS(240,222,0.35,"--c-dna",2)+hexa(276,226,12,"--c-nuc-soft","--c-nuc",2)+dnaS(276,226,0.35,"--c-dna",2);
          g+=`<path d="M318 258 A20 20 0 0 0 358 258" ${st("--c-vir-soft","--c-mem")} stroke-width="5"/>`+hexa(338,252,10,"--c-nuc-soft","--c-nuc",2);
          g+=`<path d="M40 70 L70 100 M70 70 L40 100" fill="none" style="stroke:var(--bad)" stroke-width="5" stroke-linecap="round"/>`}
        if(!lyt&&k===4){const mc=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="22" ry="14" ${st("--c-cyto","--c-mem")} stroke-width="3"/><path d="M${x-12} ${y} H${x+12}" fill="none" style="stroke:var(--muted)" stroke-width="2.5"/><path d="M${x-2} ${y} H${x+7}" fill="none" style="stroke:var(--c-dna)" stroke-width="4"/>`;
          g+=`<text x="34" y="178" ${TS}>celldelning</text>`+mc(60,214)+arr(88,214,118,204,"--ink",2,7)+arr(88,216,118,230,"--ink",2,7)+mc(146,196)+mc(146,236)}
        if(!lyt&&k===5){g+=`<text x="34" y="214" ${TS}>latent i många år</text>`}
        if(re){[[236,120],[300,116],[334,122]].forEach(p=>{g+=dnaS(p[0],p[1],0.5,"--c-dna",2.5)});g+=`<text x="34" y="214" ${TS}>viruset vaknar</text>`}
        g+=`<text x="210" y="38" text-anchor="middle" class="lbs" style="font-size:16px;fill:var(--muted)">${!lyt&&k>=5?"nervcell":"slemhinnecell"}</text>`;
        svg.innerHTML=g;
        const d=S[k];
        $("#k10-hp-st").textContent=d.t+" ("+(k+1)+" av "+S.length+")";$("#k10-hp-cell").textContent=d.cell;$("#k10-hp-nv").textContent=d.nv;$("#k10-hp-syn").textContent=d.syn;
        const vd=$("#k10-hp-vd");vd.className="verdict "+d.v;vd.textContent=d.vd;$("#k10-hp-why").innerHTML=api.tpl(d.why);
        $("#k10-hp-prev").disabled=k===0;$("#k10-hp-next").disabled=k===S.length-1}
      $("#k10-hp-next").addEventListener("click",()=>{if(i<list().length-1)i++;draw()});
      $("#k10-hp-prev").addEventListener("click",()=>{if(i>0)i--;draw()});
      $("#k10-hp-reset").addEventListener("click",()=>{i=0;draw()});
      const sg=el.querySelector("#k10-hp-path");
      sg.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{sg.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));path=b.dataset.v;if(i>list().length-1)i=list().length-1;draw()}));
      draw();
    }
  }
});
})();
