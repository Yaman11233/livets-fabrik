/* K3 Cellmembranet. Bok s. 17–21, PPT Bi2 bild 11–14, 22, 25, korsord kap 1. */
(function(){
"use strict";
const r1=n=>Math.round(n*10)/10;
const st=(f,s,w)=>`style="fill:var(${f})${s?";stroke:var("+s+")":""}"${w!=null?` stroke-width="${w}"`:""}`;
function hexPts(cx,cy,r){const p=[];for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;p.push(r1(cx+r*Math.cos(a))+","+r1(cy+r*Math.sin(a)))}return p.join(" ")}
function hx(cx,cy,r,f){return `<polygon points="${hexPts(cx,cy,r)}" ${st(f||"--c-golgi","--ink",0.8)}/>`}
function sugar(pts,r,f){let s="";for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];s+=`<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" fill="none" style="stroke:var(--ink)" stroke-width="1"/>`}
  return s+pts.map(p=>hx(p[0],p[1],r,f)).join("")}
function beads(pts,r,f){let s="";for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];s+=`<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" fill="none" style="stroke:var(--ink)" stroke-width="1"/>`}
  return s+pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${r}" ${st(f||"--c-mem","--ink",0.8)}/>`).join("")}
function arr(x1,y1,x2,y2,col,w,hs){const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,h=hs||8;const bx=x2-ux*h,by=y2-uy*h,px=-uy*h*0.6,py=ux*h*0.6;
  return `<path d="M${r1(x1)} ${r1(y1)} L${r1(bx)} ${r1(by)}" fill="none" style="stroke:var(${col})" stroke-width="${w}" stroke-linecap="round"/><polygon points="${r1(x2)},${r1(y2)} ${r1(bx+px)},${r1(by+py)} ${r1(bx-px)},${r1(by-py)}" style="fill:var(${col})"/>`}
/* två fettsyrasvansar: dir +1 nedåt, -1 uppåt; k = antal knäckar på andra svansen (0,1,2), k2 = knäckar på första */
function tails(x,y0,dir,len,k,k2,col,w){
  const one=(xx,kk)=>{if(!kk)return `M${r1(xx)} ${r1(y0)} v${r1(dir*len)}`;
    if(kk===1)return `M${r1(xx)} ${r1(y0)} v${r1(dir*len*0.42)} l5 ${r1(dir*len*0.2)} v${r1(dir*len*0.38)}`;
    return `M${r1(xx)} ${r1(y0)} v${r1(dir*len*0.26)} l5 ${r1(dir*len*0.16)} l-5 ${r1(dir*len*0.16)} v${r1(dir*len*0.1)} l5 ${r1(dir*len*0.16)} v${r1(dir*len*0.16)}`};
  return `<path d="${one(x-3,k2||0)} ${one(x+3,k)}" fill="none" style="stroke:var(${col||"--c-wall"})" stroke-width="${w||2}" stroke-linecap="round" stroke-linejoin="round"/>`}
function chol(cx,cy,s){s=s||1;return `<g transform="translate(${cx} ${cy}) scale(${s})"><polygon points="${hexPts(-6,0,5)}" ${st("--c-arch","--ink",0.7)}/><polygon points="${hexPts(3,-5,5)}" ${st("--c-arch","--ink",0.7)}/><polygon points="${hexPts(3,5,5)}" ${st("--c-arch","--ink",0.7)}/></g>`}
function segHTML(id,label,opts,cur){return `<div class="ctl">${label}<div class="seg" role="group" aria-label="${label}" id="${id}">${opts.map(([v,t])=>`<button type="button" data-v="${v}" aria-pressed="${v===cur}">${t}</button>`).join("")}</div></div>`}

/* ---------- figur: fosfolipid och dubbelskikt ---------- */
function figFosfo(){
  let s=`<rect x="8" y="26" width="256" height="256" rx="14" ${st("--sunk")}/><rect x="274" y="26" width="200" height="256" rx="14" ${st("--sunk")}/>`;
  s+=`<text x="136" y="18" text-anchor="middle" class="lbs" style="font-size:15px">EN FOSFOLIPID</text><text x="374" y="18" text-anchor="middle" class="lbs" style="font-size:15px">DUBBELSKIKTET</text>`;
  /* en stor fosfolipid */
  s+=`<g data-k="huvud"><circle cx="125" cy="66" r="20" ${st("--c-mem","--c-wall",2)}/><text x="125" y="72" text-anchor="middle" class="lbs" style="font-size:16px">P</text><rect x="111" y="86" width="28" height="10" rx="3" ${st("--c-mem-soft","--c-wall",1.5)}/></g>`;
  s+=`<g data-k="mattad"><rect x="104" y="98" width="22" height="152" fill="transparent"/><path d="M118 98 V246" fill="none" style="stroke:var(--c-wall)" stroke-width="5" stroke-linecap="round"/></g>`;
  s+=`<g data-k="omattad"><rect x="128" y="98" width="26" height="152" fill="transparent"/><path d="M132 98 V160 L146 182 V246" fill="none" style="stroke:var(--c-wall)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M137.2 156.3 L151.2 178.3" fill="none" style="stroke:var(--c-wall)" stroke-width="2.5" stroke-linecap="round"/></g>`;
  /* vatten på båda sidor om dubbelskiktet */
  s+=`<rect x="282" y="56" width="184" height="16" rx="6" ${st("--c-vac-soft")}/><rect x="282" y="236" width="184" height="16" rx="6" ${st("--c-vac-soft")}/>`;
  let g=`<g data-k="skikt">`;
  for(let i=0;i<6;i++){const x=290+i*18,k=(i===1||i===4)?1:0;
    g+=tails(x,90,1,58,k,0)+tails(x,218,-1,58,(i===2)?1:0,0);
    g+=`<circle cx="${x}" cy="82" r="8" ${st("--c-mem","--c-wall",1.5)}/><circle cx="${x}" cy="226" r="8" ${st("--c-mem","--c-wall",1.5)}/>`}
  s+=g+`</g>`;
  return s}

/* ---------- figur: membranproteinernas jobb (s. 18) ---------- */
function figProt(){
  let s=`<g data-k="mem"><rect x="20" y="118" width="440" height="40" rx="4" ${st("--c-mem-soft","--c-mem",2)}/></g>`;
  s+=`<text x="4" y="98" class="lbs" style="font-size:15px">UTSIDA</text><text x="4" y="200" class="lbs" style="font-size:15px">INSIDA</text>`;
  s+=`<g data-k="kanal"><rect x="40" y="104" width="36" height="70" fill="transparent"/><rect x="42" y="106" width="11" height="64" rx="5" ${st("--c-nuc")}/><rect x="63" y="106" width="11" height="64" rx="5" ${st("--c-nuc")}/>${arr(58,110,58,178,"--c-vac",2,6)}</g>`;
  s+=`<g data-k="barare"><ellipse cx="118" cy="138" rx="22" ry="30" ${st("--c-nuc")}/><ellipse cx="118" cy="138" rx="6" ry="15" ${st("--c-cyto")}/><circle cx="118" cy="136" r="4.5" ${st("--paper","--ink",1.2)}/></g>`;
  s+=`<g data-k="rec"><rect x="180" y="84" width="40" height="88" fill="transparent"/><rect x="194" y="110" width="12" height="60" rx="4" ${st("--c-nuc")}/><path d="M200 114 L187 92 M200 114 L213 92" fill="none" style="stroke:var(--c-nuc)" stroke-width="10" stroke-linecap="round"/></g>`;
  s+=`<g data-k="mark"><ellipse cx="280" cy="138" rx="16" ry="28" ${st("--c-euk")}/>${beads([[275,111],[271,100],[266,90],[262,81]],4,"--c-mem")}${beads([[266,90],[273,82]],4,"--c-mem")}${beads([[285,111],[289,100],[294,90],[298,81]],4,"--c-mem")}${beads([[294,90],[287,82]],4,"--c-mem")}</g>`;
  s+=`<g data-k="enz"><rect x="326" y="132" width="68" height="96" fill="transparent"/><ellipse cx="360" cy="160" rx="20" ry="22" ${st("--c-euk")}/><path d="M344 210 Q360 190 376 210" fill="none" style="stroke:var(--ink)" stroke-width="2"/><polygon points="378,214 370,209 377,204" style="fill:var(--ink)"/><text x="334" y="220" text-anchor="middle" class="lbs" style="font-size:15px">A</text><text x="388" y="220" text-anchor="middle" class="lbs" style="font-size:15px">B</text></g>`;
  s+=`<g data-k="ihop"><path d="M416 118 C416 104 424 98 432 98 C440 98 448 104 448 118 Z" ${st("--c-nuc")}/><path d="M420 102 l-4 -8 M426 99 l-2 -9 M432 98 v-9 M438 99 l2 -9 M444 102 l4 -8" fill="none" style="stroke:var(--c-nuc)" stroke-width="2.2" stroke-linecap="round"/></g>`;
  s+=`<line x1="112" y1="47" x2="118" y2="106" class="lead"/><circle cx="118" cy="106" r="2.6" class="pdot"/>`;
  return s}

/* ---------- figur: modell över cellmembranet (s. 19) ---------- */
function figModell(){
  let s="";
  /* ECM */
  let g=`<g data-k="ecm"><rect x="108" y="34" width="276" height="104" rx="10" ${st("--c-wall-soft")}/>`;
  for(let i=0;i<9;i++){const x=120+i*30;g+=`<path d="M${x} 136 q-4 -16 2 -30 q6 -14 -2 -28 M${x+1} 112 l-8 -6 M${x+2} 92 l7 -7" fill="none" style="stroke:var(--c-wall)" stroke-width="0.9" opacity=".75"/>`}
  g+=`<path d="M110 62 C190 70 260 96 382 92" fill="none" style="stroke:var(--c-wall)" stroke-width="7" stroke-linecap="round" opacity=".8"/><path d="M110 104 C200 96 280 64 382 54" fill="none" style="stroke:var(--c-wall)" stroke-width="7" stroke-linecap="round" opacity=".8"/>`;
  s+=g+`</g>`;
  /* fosfolipidskikt */
  g=`<g data-k="fl">`;
  const gaps=[[196,234],[286,324]];
  for(let x=114;x<=378;x+=13){if(gaps.some(([a,b])=>x>a-6&&x<b+6))continue;
    g+=tails(x,165,1,22,(x%3===0)?1:0,0,"--c-wall",1.3)+tails(x,215,-1,22,(x%4===0)?1:0,0,"--c-wall",1.3);
    g+=`<circle cx="${x}" cy="158" r="6.5" ${st("--c-mem","--c-wall",1)}/><circle cx="${x}" cy="222" r="6.5" ${st("--c-mem","--c-wall",1)}/>`}
  s+=g+`</g>`;
  /* kolesterol */
  s+=`<g data-k="kol">${chol(127,184,0.85)}${chol(179,197,0.85)}${chol(260,182,0.85)}${chol(346,197,0.85)}</g>`;
  /* transportproteiner */
  s+=`<g data-k="tp"><rect x="198" y="140" width="34" height="98" rx="12" ${st("--c-nuc")}/><rect x="211" y="146" width="8" height="86" rx="4" ${st("--c-cyto")}/><ellipse cx="215" cy="246" rx="15" ry="8" ${st("--c-mito")}/>`;
  s+=`<rect x="288" y="140" width="34" height="98" rx="12" ${st("--c-nuc")}/><rect x="301" y="146" width="8" height="86" rx="4" ${st("--c-cyto")}/><ellipse cx="305" cy="246" rx="15" ry="8" ${st("--c-golgi")}/></g>`;
  /* glykoprotein */
  s+=`<g data-k="gp"><path d="M124 162 C124 140 156 140 156 162 Z" ${st("--c-nuc")}/>${sugar([[146,141],[152,131],[158,121],[164,111],[170,101],[176,91]],5,"--c-golgi")}</g>`;
  /* kolhydrat */
  s+=`<g data-k="kh">${sugar([[257,150],[257,139],[257,128],[248,118],[240,108]],5,"--c-golgi")}${sugar([[257,128],[266,118],[274,108]],5,"--c-golgi")}</g>`;
  /* glykolipid */
  s+=`<g data-k="gl"><circle cx="348" cy="158" r="6.5" ${st("--c-mem","--ink",1.2)}/>${sugar([[348,148],[348,137],[348,126],[348,115]],5,"--c-golgi")}</g>`;
  /* cellskelett */
  g=`<g data-k="cs"><rect x="108" y="256" width="276" height="40" fill="transparent"/>`;
  [[262,0],[276,1],[290,0]].forEach(([y,o])=>{let d1=`M110 ${y}`,d2=`M110 ${y+4}`;for(let x=110;x<380;x+=18){d1+=` q9 ${o?6:-6} 18 0`;d2+=` q9 ${o?-6:6} 18 0`}g+=`<path d="${d1}" fill="none" style="stroke:var(--c-wall)" stroke-width="2"/><path d="${d2}" fill="none" style="stroke:var(--c-wall)" stroke-width="2"/>`});
  g+=`<path d="M150 252 L210 300 M330 252 L280 300" fill="none" style="stroke:var(--c-wall)" stroke-width="2"/>`;
  s+=g+`</g>`;
  s+=`<line x1="215" y1="311" x2="215" y2="256" class="lead"/><circle cx="215" cy="256" r="2.6" class="pdot"/>`;
  return s}

G.def({
  id:"k3",
  src:{bok:"s. 17–21", ppt:"Bi2 bild 11–14 (fetter, fosfolipider), 22 och 25 (cellmembran)", ab:"Korsord kap 1 \"Cellkrysset\" (cellmembran, kolesterol, glykokalyx)"},
  threads:["membran","nyckel","vagg","atp"],
  goals:[
    "nämna cellmembranets fyra funktioner och förklara varför bara fettlösliga ämnen passerar fritt",
    "beskriva vad membranet är byggt av: fosfolipider i ett dubbelskikt, proteiner och kolhydrater på utsidan",
    "förklara varför membranet kallas en tvådimensionell vätska och hur det kan bilda membranblåsor",
    "förklara hur fettsyrornas mättnad och längd, kolesterol och temperatur påverkar hur flytande membranet är",
    "nämna membranproteinernas fem jobb (TERKA) och bokens exempel på varje",
    "förklara vad glykokalyx är och vad den gör",
    "beskriva extracellulär matrix med bokens exempel kollagen och spektrin"
  ],
  intro:`<p>Varje cell har en gräns mot omvärlden. I fabriken är det <b>tullgränsen</b>: ett tunt, flytande skikt av fett med portar av protein och en "uniform" av socker på utsidan. Här lär du dig vad gränsen består av och vad den gör. Fosfolipiden som bygger upp den hittar du i {{go:k1.fosfolipider|K1 Livets molekyler}}, och hur ämnen tar sig igenom kommer i {{go:k5|K5 Transport över membran}}.</p>`,
  secs:[
  /* ===================== FUNKTION ===================== */
  {id:"funktion", h:"Cellmembranets funktioner", nav:"Funktioner", src:"s. 17 · PPT Bi2 bild 22, 25 · korsord 3 lodrätt", prov:true, html:`
    <p><b>Cellmembranet</b> kallas också <b>plasmamembran</b>. Boken säger att det är en av förutsättningarna för liv. Utan cellmembran finns ingen cell. {{src:s. 17}}</p>
    <p>Membranet är ett <b>lipidrikt skikt</b> som skiljer cellen från den omgivande miljön. Därför kan cellen skapa en egen inre miljö som skiljer sig från omgivningen. Stora molekyler, till exempel enzymer, och organeller hålls instängda, och cellen kan reglera sin <b>salthalt</b> och sitt <b>pH-värde</b>.</p>
    <div class="box key" data-h="Kunna utantill: membranets fyra funktioner"><ol>
      <li><b>Avgränsning</b> mot omvärlden.</li>
      <li><b>Kontroll</b> av in- och uttransport av ämnen.</li>
      <li><b>Kommunikation</b> mellan cell och omgivning.</li>
      <li><b>Bindning</b> till närliggande celler.</li></ol>
      <p>Läraren sammanfattar: "Cellmembran = Yttre skydd som släpper in och ut vissa ämnen." {{prov}} {{src:PPT Bi2 bild 22}}</p></div>
    <div class="box trick" data-h="Minnesknep: gränsstationen"><p>Tänk på en gränsstation. <b>Staketet</b> avgränsar, <b>passkontrollen</b> bestämmer vem som får gå in och ut, <b>telefonen</b> tar emot meddelanden och <b>handslaget</b> med grannen håller ihop landet. Avgränsning, kontroll, kommunikation, bindning.</p></div>
    <h3>Vad släpps igenom?</h3>
    <p>Membranets inre är <b>fettälskande och vattenhatande</b>. Därför kan bara <b>fettlösliga ämnen</b> passera fritt. <b>Vattenlösliga ämnen</b> kommer bara igenom med hjälp av speciella <b>transportproteiner</b>, som sitter utspridda bland fosfolipiderna. På så sätt kan cellen själv reglera vad som transporteras in och ut. {{src:s. 17}}</p>
    <ol class="chainv"><li>Membranets inre är fettälskande och vattenhatande.</li><li>Fettlösliga ämnen löser sig i det inre och passerar fritt.</li><li>Vattenlösliga ämnen stoppas och behöver ett transportprotein.</li><li>Cellen bestämmer vilka transportproteiner som finns, och därför kan den reglera transporten.</li></ol>
    <h3>Kommunikation och bindning</h3>
    <p>Vissa proteiner i membranet är <b>receptorer</b>. De gör att cellen kan känna igen och reagera på olika kemiska ämnen i miljön, och därför kan cellerna kommunicera med varandra. En molekyl som en cell skickar ut kan binda till en receptor på en annan cell, <b>i närheten eller långt bort</b>, och påverka den cellens aktivitet. {{src:s. 17}}</p>
    <p>Andra proteiner i membranet gör att celler kan fästa mer eller mindre hårt vid varandra. Därför kan celler bilda <b>vävnader</b> med olika funktion.</p>
    <div class="box fab"><p>Cellmembranet är fabrikens <b>tullgräns</b>. Muren av fett stoppar allt som är vattenlösligt, och därför behövs <b>portar</b> av protein. Fabriken bestämmer själv vilka portar som finns och när de är öppna. Receptorerna är fabrikens <b>brevlådor</b> för meddelanden utifrån.</p></div>
    <div class="box trap"><p>Provfälla: Det är de <b>fettlösliga</b> ämnena som passerar fritt. Förklara alltid varför: membranets inre är fettälskande och vattenhatande.</p></div>
    <div class="box link"><p>Växtcellen har en cellvägg utanför cellmembranet. Där är det cellväggen som ligger ytterst, och cellmembranet ligger innanför. Se {{go:k13.cellvaggen|cellväggen i K13}}. Hur ämnena tar sig igenom membranet lär du dig i {{go:k5.genom|K5}}.</p></div>
    <div class="box tr" data-t="membran" data-h="Samma gräns överallt">Cellmembranet är ett dubbelskikt av fosfolipider med proteiner. Samma byggsätt finns i organellernas membran i {{go:k4.er|K4}}, i bakteriens cellmembran i {{go:k8.byggnad|K8}} och i alla transportprocesser i {{go:k5.genom|K5}}.</div>
    <div class="x" data-x="tfSlapps"></div>
  `},
  /* ===================== UPPBYGGNAD ===================== */
  {id:"uppbyggnad", h:"Membranets uppbyggnad", nav:"Uppbyggnad", src:"s. 17–19 · PPT Bi2 bild 14", prov:true, html:`
    <p>Cellmembranet är <b>extremt tunt</b>. Man skulle behöva lägga minst <b>10 000 cellmembran</b> ovanpå varandra för att nå tjockleken av en sida i boken. {{src:s. 17}}</p>
    <div class="box key" data-h="Tre sorters molekyler"><ul>
      <li><b>Lipider</b>. Membranet består huvudsakligen av lipider.</li>
      <li><b>Proteiner</b> av mängder av olika typer.</li>
      <li><b>Kolhydrater</b>, som ofta sitter fästa på lipider och proteiner och sticker ut på cellens <b>utsida</b>.</li></ul></div>
    <h3>Fosfolipiddubbelskiktet</h3>
    <p>Grunden är ett <b>dubbelt lager av fosfolipider</b>. Fettsyrasvansarna är riktade mot varandra, och de <b>hydrofila</b> (vattenälskande) "huvudena" pekar utåt mot cellens inre och yttre miljö. Svansarna är <b>hydrofoba</b> (vattenhatande). Därför hamnar svansarna i mitten, skyddade från vattnet, medan huvudena vänds mot vattnet på båda sidor. {{src:s. 17}}</p>
    <p>Läraren beskriver fosfolipiden så här: ett hydrofilt huvud med en <b>fosfatgrupp</b> och en hydrofob svans. Förenklat är huvudet vattenlösligt och svansen fettlöslig. Fosfolipiderna bygger upp cellernas membran tillsammans med en <b>mindre mängd kolesterol</b>. {{prov}} {{src:PPT Bi2 bild 14}}</p>
    <div class="lfig-h" data-fig="fosfo"></div>
    <div class="box diff"><p><b>Boken:</b> "Djurcellers cellmembran består förutom av fosfolipider även av kolesterol." <b>Läraren:</b> fosfolipider och en mindre mängd kolesterol bygger upp "cellernas membran". Svara med bokens ord, att kolesterolet finns i <b>djurcellers</b> membran. {{src:s. 18 · PPT Bi2 bild 14}}</p></div>
    <h3>En tvådimensionell vätska</h3>
    <p>Fosfolipiderna och proteinerna som sitter i membranet <b>glider ständigt runt varandra</b>. Membranet är alltså ingen fast hinna. Boken ber dig tänka på det som en <b>tvådimensionell vätska</b> där delarna flyter omkring. {{src:s. 17}}</p>
    <p>Eftersom membranet är flytande kan det ändra form och bilda <b>membranblåsor</b>. Blåsorna kan smälta samman med andra membranblåsor eller med cellmembranet. Det är så lastbilarna i fabriken fungerar, se {{go:k4.golgi|golgiapparaten i K4}} och {{go:k5.endocytos|endocytos i K5}}. {{src:s. 17–18}}</p>
    <div class="lfig-h" data-fig="modell"></div>
    <div class="box trick" data-h="Minnesknep: smörgåsen"><p>Dubbelskiktet är en smörgås med <b>brödet utåt</b> och <b>smöret inuti</b>. Brödet (huvudena) tål vatten. Smöret (svansarna) gömmer sig från vattnet i mitten.</p></div>
    <div class="box extra"><p>I andra böcker kallas den här bilden av membranet ofta för <b>flytande mosaikmodellen</b>. Boken använder inte det ordet på s. 17–21. {{extra}}</p></div>
    <div class="box link"><p>Fosfolipidens byggnad (glycerol, fosfatgrupp och fettsyror) går igenom i {{go:k1.fosfolipider|K1}}.</p></div>
    <div class="x" data-x="clozeUpp"></div>
  `},
  /* ===================== FLYTBARHET ===================== */
  {id:"flyt", h:"Hur flytande är membranet?", nav:"Flytbarhet", src:"s. 18 · PPT Bi2 bild 11–14 · korsord 9 vågrätt", prov:true, html:`
    <p>Vid en viss temperatur kan membranet vara mer <b>lättflytande</b> eller mer <b>trögflytande</b>. Det beror på vilken karaktär fettsyrorna har. {{src:s. 18}}</p>
    <p>Fosfolipiderna hålls ihop av <b>van der Waals-krafter</b>, som är relativt svaga. Krafterna blir ännu svagare när avståndet mellan molekylerna blir större.</p>
    <h3>Mättade och omättade fettsyror</h3>
    <p>Består fosfolipiderna av <b>veckade, omättade fettsyror</b> hålls membranet flytande vid en lägre temperatur än om de består av <b>raka, mättade fettsyror</b>. Det beror på att dubbelbindningarna gör svansarna veckade. Då blir avståndet mellan molekylerna större och van der Waals-krafterna svagare. {{prov}} {{src:s. 18 · PPT Bi2 bild 11–13}}</p>
    <ol class="chainv"><li>Omättad fettsyra har en eller flera dubbelbindningar.</li><li>Svansen blir veckad (får en knäck).</li><li>Fosfolipiderna kan inte packas tätt, och avståndet mellan dem blir större.</li><li>Van der Waals-krafterna blir svagare.</li><li>Membranet förblir flytande även vid lägre temperatur.</li></ol>
    <p>Läraren förklarar orden: en fettsyra med <b>en</b> dubbelbindning är <b>omättad</b> (enkelomättad), och med <b>fler än en</b> är den <b>fleromättad</b>. Omättat fett är flytande vid rumstemperatur och finns i vegetabiliskt fett och fiskfett. Mättat fett har bara enkelbindningar. {{lek:Bi2 bild 10–13}}</p>
    <div class="box key" data-h="Ishavsfisken"><p><b>Ishavsfiskar</b> har ovanligt mycket <b>fleromättade fettsyror</b> i sina cellmembran. Annars skulle det kalla vattnet få membranen att stelna så att de slutade fungera. {{src:s. 18}}</p></div>
    <h3>Fettsyrornas längd</h3>
    <p>Även <b>längden</b> på fettsyrekedjorna påverkar fryspunkten. Ju längre fettsyror, desto större yta har van der Waals-krafterna att verka på. Därför blir membranet mer trögflytande. {{src:s. 18}}</p>
    <h3>Kolesterol</h3>
    <p>Djurcellers cellmembran innehåller förutom fosfolipider även <b>kolesterol</b>. Kolesterolet hjälper membranet att hålla sig <b>lagom flytande</b>. Korsordet kallar kolesterol en <b>steroid</b>. {{prov}} {{src:s. 18 · korsord 9 vågrätt}}</p>
    <table class="cmp"><tr><th>Faktor</th><th>Mer lättflytande</th><th>Mer trögflytande</th></tr>
      <tr><td>Fettsyrornas typ</td><td>omättade, veckade</td><td>mättade, raka</td></tr>
      <tr><td>Fettsyrornas längd</td><td>kortare</td><td>längre</td></tr>
      <tr><td>Temperatur</td><td>varmare</td><td>kallare</td></tr>
      <tr><td>Kolesterol</td><td colspan="2">håller djurcellens membran lagom flytande</td></tr></table>
    <div class="w" data-w="k3Flyt"></div>
    <div class="box trick" data-h="Minnesknep: olja och smör"><p><b>O</b>mättat som <b>O</b>lja, flytande. <b>M</b>ättat som s<b>M</b>ör, fast. Knäckta svansar står som en stökig folkmassa med glipor. Raka svansar står tätt som soldater i led.</p></div>
    <div class="box trap"><p>Provfälla: <b>Längre</b> fettsyror ger ett <b>trögare</b> membran, eftersom ytan för van der Waals-krafterna blir större. Och förklara alltid med avståndet: veckade svansar ger större avstånd och därför svagare krafter.</p></div>
    <div class="box link"><p>Samma bild visar lärarens ruta "Olika typer av kolesterol" med LDL och HDL {{lek:Bi2 bild 14}}. Boken förklarar att LDL och HDL är partiklar av kolesterol och protein i blodet. Läs mer i {{go:k5.ldl|K5}}.</p></div>
    <div class="x" data-x="chainFlyt"></div>
  `},
  /* ===================== PROTEINER ===================== */
  {id:"proteiner", h:"Proteinerna i membranet", nav:"Proteiner", src:"s. 17–20", html:`
    <p>Ett membranprotein kan antingen <b>sträcka sig rakt genom hela membranet</b> eller vara <b>nedsänkt i ena sidan</b>. I båda fallen måste den yta som ligger inne i membranet vara <b>hydrofob</b>. Det beror på att membranets inre är fettälskande och vattenhatande. {{src:s. 18}}</p>
    <div class="box key" data-h="Membranproteinernas fem jobb"><ol>
      <li><b>Transport</b> av ämnen genom membranet.</li>
      <li><b>Enzymaktivitet</b>.</li>
      <li>Fungera som <b>receptorer</b>.</li>
      <li><b>Koppla ihop</b> en cell med andra celler, eller med nätverket av proteiner utanför cellen (extracellulär matrix).</li>
      <li><b>Förankra</b> proteinkedjorna inne i cellen som bygger upp cellskelettet.</li></ol></div>
    <div class="box trick" data-h="Minnesknep: TERKA"><p><b>T</b>ransport · <b>E</b>nzym · <b>R</b>eceptor · <b>K</b>oppla ihop · <b>A</b>nkare. Ordet TERKA är guidens eget, inte bokens.</p></div>
    <div class="lfig-h" data-fig="prot"></div>
    <h3>Transportproteiner</h3>
    <p>Det finns flera typer av transportproteiner. Vissa bildar en kanal i sig själva som ämnen kan ta sig igenom, och de kallas därför <b>kanalproteiner</b>. Andra <b>ändrar form</b> när molekylen som ska transporteras binder till dem, och på så sätt hjälper de molekylen genom membranet. <b>Vissa kräver energi, andra inte.</b> {{src:s. 19}}</p>
    <div class="box fab"><p>Kanalproteinet är en öppen <b>grind</b>. Proteinet som ändrar form är en <b>svängdörr</b> som bara snurrar när rätt molekyl kliver in. De transportproteiner som kräver energi är <b>rulltrappor uppför</b>, och de kostar ATP-mynt. Allt detta kommer i {{go:k5.underlattad|K5}}.</p></div>
    <div class="box tr" data-t="atp" data-h="Portar som kostar energi">Boken säger att vissa transportproteiner kräver energi. Energin kommer från ATP, fabrikens mynt, som mest tillverkas i {{go:k4.mitokondrien|mitokondrien}}. Natrium-kaliumpumpen i {{go:k5.pumpen|K5}} är det stora exemplet.</div>
    <h3>Enzymer</h3>
    <p>Kemiska reaktioner sker inte bara i cytoplasman, utan också på membranets <b>insida och utsida</b>. För att katalysera dem sitter <b>enzymer</b> insprängda bland fosfolipiderna. {{src:s. 19}}</p>
    <ol class="chainv"><li>På utsidan av <b>tunntarmsceller</b> sitter ett enzym.</li><li>Enzymet bryter ner <b>dipeptider</b> (två aminosyror som sitter ihop) till fria aminosyror.</li><li>De fria aminosyrorna tas upp i cellen med hjälp av ett <b>transportprotein</b>.</li></ol>
    <h3>Receptorer</h3>
    <p>Receptorerna är mottagare för olika kemiska molekyler. En viss molekyl passar ungefär som <b>nyckeln i ett lås</b> till en viss receptor, och det kan låsa upp olika aktiviteter i cellen. {{src:s. 19}}</p>
    <ul>
      <li>Vissa celler har receptorer för en eller flera <b>neurotransmittorer</b>. Därför kan de ta emot signaler från nervsystemet, alltså <b>nervimpulser</b>.</li>
      <li>De flesta celler har receptorer för <b>hormoner</b> och andra <b>signalämnen</b>. Därför kan de anpassa sitt beteende efter signaler från andra celler i kroppen.</li>
      <li>Olika celltyper har olika <b>antal</b> och olika <b>typer</b> av receptorer. Det avgör om och hur mycket en cell påverkas av ett visst ämne. {{src:s. 20}}</li></ul>
    <div class="box tr" data-t="nyckel" data-h="Receptorn är låset">Signalmolekylen passar i receptorn som en nyckel i ett lås och låser upp en aktivitet i cellen. Samma bild återkommer när LDL binder till sin receptor innan den tas upp i {{go:k5.ldl|K5}}.</div>
    <h3>Ankare</h3>
    <p>Proteiner hjälper också till att <b>stabilisera</b> cellmembranet. De fungerar som ett slags <b>ankare</b> dit proteintrådar som ger stöd åt cellen kan binda och kopplas ihop. Trådarna är cellskelettet, se {{go:k4.cellskelettet|K4}}. {{src:s. 20}}</p>
    <div class="box trap"><p>Provfälla: Antalet och typen av receptorer avgör hur mycket en cell påverkas av ett hormon. Två celler i samma blod kan alltså reagera helt olika på samma hormon.</p></div>
    <div class="x" data-x="matchProt"></div>
  `},
  /* ===================== GLYKOKALYX ===================== */
  {id:"glykokalyx", h:"Glykokalyx, cellens sockerpäls", nav:"Glykokalyx", src:"s. 19–20 · korsord 8 vågrätt", prov:true, html:`
    <p>En eukaryot cells yta är mer eller mindre täckt av ett <b>kolhydratlager</b>, som kallas <b>glykokalyx</b>. Det bildas genom att vissa lipider, <b>glykolipider</b>, och vissa proteiner, <b>glykoproteiner</b>, i membranet är <b>kovalent bundna till sockerkedjor</b>. Du ser dem i {{go:k3.uppbyggnad|modellen över cellmembranet}}. {{prov}} {{src:s. 20 · korsord 8 vågrätt}}</p>
    <h3>Kläder som visar yrket</h3>
    <p>Sockerkedjorna kan sättas ihop på väldigt många sätt. Boken jämför dem med <b>kläder hos olika yrkesgrupper</b>, som läkarrock och polisuniform. Därför kan en cell "förstå" vilken celltyp den har bredvid sig. {{src:s. 20}}</p>
    <div class="box key" data-h="Glykokalyxens funktioner"><ul>
      <li>Skyddar cellen mot <b>mekanisk och kemisk påverkan</b>.</li>
      <li>Skyddar mot <b>"oönskade" kontakter</b> med attackerande celler.</li>
      <li>Gör att celler känner igen vilken celltyp de har invid sig.</li>
      <li>Ger cellen en <b>slemmig yta</b>.</li></ul></div>
    <ol class="chainv"><li>Kolhydraterna i glykokalyx <b>absorberar vatten</b>.</li><li>Cellen får en slemmig yta.</li><li><b>Vita blodkroppar</b> kan lättare ta sig ut genom öppningarna mellan cellerna i <b>blodkapillärernas väggar</b>.</li><li>De kommer ut i vävnaden och kan jaga bakterier och andra "inkräktare".</li></ol>
    <p>Den <b>glatta ytan</b> på <b>röda blodkroppar</b> minskar risken att de fastnar i varandra eller i blodkärlens väggar. {{src:s. 20}}</p>
    <div class="box fab"><p>Glykokalyx är fabrikens <b>arbetskläder och skylt</b>. Uniformen visar grannarna vilken sorts fabrik det är, och lacken skyddar fasaden mot repor och kemikalier.</p></div>
    <div class="box trick" data-h="Minnesknep: glyko = socker"><p><b>Glyko</b> betyder socker. Glyko<b>lipid</b> är socker på en lipid. Glyko<b>protein</b> är socker på ett protein. Glyko<b>kalyx</b> är hela sockerpälsen.</p></div>
    <div class="box trap"><p>Provfälla: Boken använder tre liknelser i kapitlet. <b>Nyckel i lås</b> gäller receptorer. <b>Kläder hos yrkesgrupper</b> gäller glykokalyx. <b>Russin i en kaka</b> gäller celler i kollagen. Blanda inte ihop dem.</p></div>
    <div class="x" data-x="sortGE"></div>
  `},
  /* ===================== ECM ===================== */
  {id:"ecm", h:"Extracellulär matrix (ECM)", nav:"ECM", src:"s. 20–21 · PPT Bi2 bild 25", html:`
    <p>Djurceller saknar <b>cellvägg</b>. {{prov}} Utanför cellen finns i stället ett skikt av <b>glykoproteiner</b> (proteiner med en sockergrupp) och andra kolhydratinnehållande molekyler. Cellen <b>utsöndrar</b> själv molekylerna, och skiktet har flera funktioner. Det ligger utanför cellen, alltså <b>extracellulärt</b>, och kallas <b>extracellulär matrix (ECM)</b>. {{src:s. 20 · PPT Bi2 bild 25}}</p>
    <p>Gränsen mellan det som räknas som glykokalyx och det som räknas som extracellulär matrix är något otydlig. {{src:s. 20}}</p>
    <table class="cmp"><tr><th></th><th>Glykokalyx</th><th>Extracellulär matrix</th></tr>
      <tr><td>Var?</td><td>På cellytan</td><td>Utanför cellen</td></tr>
      <tr><td>Vad?</td><td>Sockerkedjor på glykolipider och glykoproteiner i membranet</td><td>Glykoproteiner och andra kolhydratinnehållande molekyler som cellen utsöndrar, t.ex. kollagen</td></tr>
      <tr><td>Gör</td><td>Igenkänning, skydd, slemmig yta</td><td>Elasticitet, form, hållfasthet, filter</td></tr></table>
    <h3>Kollagen i senor och brosk</h3>
    <p>Hos vissa celler, till exempel de som bygger upp <b>senor och brosk</b>, består en stor del av matrixen av <b>kollagen</b>. Cellerna är utspridda i kollagenet <b>likt russin i en kaka</b>. Kollagenet binder till cellens yta med hjälp av speciella proteinmolekyler, som i sin tur fäster i proteintrådar inuti cellen. {{src:s. 20}}</p>
    <p>Kollagen gör vävnaden <b>elastisk</b>. Därför kan den tänjas utan att cellerna går sönder.</p>
    <h3>Spektrin i röda blodkroppar</h3>
    <p><b>Röda blodkroppar</b> behåller sin <b>platta form</b> och får ökad <b>hållfasthet</b> genom sin extracellulära matrix. Den består av proteintrådar, <b>spektrin</b>, som bildar ett stabiliserande nät ovanpå cellmembranet. {{src:s. 21}}</p>
    <ol class="chainv"><li>En <b>mutation</b> gör att spektrin inte ser ut och fungerar som det ska.</li><li>De röda blodkropparna blir mer <b>sfäriska</b>.</li><li>De går lätt sönder.</li><li>Personen blir <b>anemisk</b>, alltså får blodbrist.</li></ol>
    <div class="box extra"><p>Boken lägger spektrinnätet i den extracellulära matrixen, "ovanpå cellmembranet". Många andra källor beskriver spektrinnätet på membranets insida. Svara som boken på provet. {{extra}}</p></div>
    <h3>ECM som filter</h3>
    <p>Den extracellulära matrixen påverkar också cellernas beteende. Den bildar <b>geler med porer</b> som fungerar som ett <b>filter</b>, och filtret reglerar vilka molekyler som når cellmembranets yta. Det sker på två sätt. Porerna kan <b>binda tillväxtfaktorer</b> och andra ämnen som fungerar som signaler för cellen. Porerna kan också <b>blockera eller underlätta</b> molekylernas rörelse i gelen. {{src:s. 21}}</p>
    <div class="box fab"><p>ECM är fabrikens <b>gård</b>. Kollagenet är det elastiska markskiktet där fabrikerna ligger utspridda som russin i en kaka. Spektrinet är ett <b>armeringsnät</b> som håller formen. Gelen är <b>grinden vid infarten</b> som släpper fram vissa leveranser och håller kvar andra.</p></div>
    <div class="box tr" data-t="vagg" data-h="Djurcellen saknar vägg">Djurcellen har ingen cellvägg. Dess skydd är cellmembranet och den extracellulära matrixen av glykoproteiner. Växtcellen har en cellvägg av cellulosa ({{go:k13.cellvaggen|K13}}) och bakterier har en cellvägg av ett annat material ({{go:k8.byggnad|K8}}).</div>
    <div class="box link"><p>Kollagenet fäster i proteintrådar inuti cellen. Trådarna är cellskelettet, se {{go:k4.cellskelettet|K4}}.</p></div>
    <div class="x" data-x="whoK3"></div>
    <div class="x" data-x="fixK3"></div>
  `}
  ],
  figs:{
    fosfo:{vb:"0 0 480 290", svg:figFosfo(),
      labels:[["hydrofilt|huvud med|fosfatgrupp",166,60,145,64,"s"],["hydrofob|svans",100,128,116,130,"e"],["mättad|fettsyra|(rak)",100,206,116,214,"e"],
        ["dubbelbindning",160,150,146,170,"s"],["omättad|fettsyra|(veckad)",160,206,148,214,"s"],
        ["cellens utsida",374,50,null,null,"m"],["cellens insida",374,270,null,null,"m"],["hydrofila|huvuden",398,78,388,82,"s"],["hydrofoba|svansar",398,148,385,140,"s"]],
      parts:{huvud:{t:"Hydrofilt huvud",d:"Huvudet tål vatten. Läraren: det innehåller en fosfatgrupp och är vattenlösligt. {{src:PPT Bi2 bild 14}}"},
        mattad:{t:"Mättad fettsyra",d:"Rak, bara enkelbindningar. Raka svansar packas tätt, och därför blir van der Waals-krafterna starkare och membranet trögare."},
        omattad:{t:"Omättad fettsyra",d:"Har en dubbelbindning som ger en knäck. Därför blir avståndet till grannarna större, krafterna svagare och membranet mer flytande. {{src:s. 18}}"},
        skikt:{t:"Dubbelskiktet",d:"Svansarna pekar mot varandra i mitten, och huvudena pekar ut mot vattnet på cellens insida och utsida. {{src:s. 17}}",go:"k3.uppbyggnad"}},
      cap:"En fosfolipid och hur fosfolipiderna bildar dubbelskiktet. Tryck på delarna.", src:"Bok s. 17–18 · PPT Bi2 bild 11–14"},
    modell:{vb:"0 0 480 345", svg:figModell(),
      labels:[["glykoprotein",4,70,140,148,"s"],["cellens|utsida",4,122,null,null,"s"],["kolesterol",4,192,122,186,"s"],["cellskelett",4,262,112,266,"s"],["cellens|insida",4,312,null,null,"s"],
        ["fibrer i|extracellulär|matrix (ECM)",476,26,352,80,"e"],["kolhydrat",246,22,252,104,"m"],["glykolipid",476,122,352,120,"e"],["fosfolipid-|skikt",476,178,372,190,"e"],["transportproteiner",262,330,305,252,"m"]],
      parts:{ecm:{t:"Extracellulär matrix",d:"Ett skikt av glykoproteiner och andra kolhydratinnehållande molekyler som cellen utsöndrar. De tjocka fibrerna kan vara kollagen.",go:"k3.ecm"},
        fl:{t:"Fosfolipidskiktet",d:"Dubbelt lager av fosfolipider, en tvådimensionell vätska där delarna glider runt varandra.",go:"k3.uppbyggnad"},
        kol:{t:"Kolesterol",d:"Finns i djurcellers membran och håller membranet lagom flytande. {{prov}}",go:"k3.flyt"},
        tp:{t:"Transportproteiner",d:"Går genom hela membranet. Vattenlösliga ämnen behöver dem för att komma igenom.",go:"k3.proteiner"},
        gp:{t:"Glykoprotein",d:"Ett protein med en kovalent bunden sockerkedja. Del av glykokalyx.",go:"k3.glykokalyx"},
        kh:{t:"Kolhydrat",d:"Sockerkedjor som sticker ut på cellens utsida, fästa på lipider och proteiner.",go:"k3.glykokalyx"},
        gl:{t:"Glykolipid",d:"En lipid i membranets yttre lager med en kovalent bunden sockerkedja.",go:"k3.glykokalyx"},
        cs:{t:"Cellskelett",d:"Proteintrådar på insidan. Membranproteiner fungerar som ankare för dem.",go:"k4.cellskelettet"}},
      cap:"Modell över cellmembranet hos en djurcell. Utsidan är uppåt. Efter bokens figur på s. 19 med alla bokens tio etiketter.", src:"Bok s. 19"},
    prot:{vb:"0 0 480 232", svg:figProt(),
      labels:[["transportproteiner",85,40,68,106,"m"],["receptor",200,70,200,88,"m"],["markör",280,40,280,78,"m"],["enzym",360,86,360,140,"m"],["ihopkoppling",430,40,432,95,"m"],["cellmembran",150,214,150,158,"m"]],
      parts:{kanal:{t:"Kanalprotein",d:"Bildar en kanal i sig själv som ämnen kan ta sig igenom. {{src:s. 19}}",go:"k5.underlattad"},
        barare:{t:"Transportprotein som ändrar form",d:"Molekylen binder, proteinet ändrar form och släpper ut molekylen på andra sidan. Vissa transportproteiner kräver energi, andra inte."},
        rec:{t:"Receptor",d:"Tar emot en signalmolekyl som passar som en nyckel i ett lås, till exempel ett hormon eller en neurotransmittor."},
        mark:{t:"Markör",d:"Ett protein med sockerkedjor (glykoprotein). Sockerkedjorna fungerar som en uniform som visar vilken celltyp det är.",go:"k3.glykokalyx"},
        enz:{t:"Enzym",d:"Katalyserar en reaktion vid membranet. A omvandlas till B. Exempel: enzymet på tunntarmscellernas utsida som bryter ner dipeptider till aminosyror."},
        ihop:{t:"Ihopkoppling",d:"Kopplar ihop cellen med andra celler eller med den extracellulära matrixen, så att vävnader kan bildas.",go:"k3.ecm"},
        mem:{t:"Cellmembranet",d:"Här ritat som ett band. Den del av proteinet som sitter i bandet måste vara hydrofob."}},
      cap:"Proteiner i cellmembranet. Efter bokens figur på s. 18. Utsidan är uppåt. Tryck på ett protein.", src:"Bok s. 18–19"}
  },
  ex:{
    tfSlapps:{ty:"tf", h:"Vad släpps igenom, och varför?", items:[
      ["Fettlösliga ämnen kan passera fritt genom cellmembranet.",true,"Membranets inre är fettälskande och vattenhatande, så fettlösliga ämnen tar sig igenom. {{src:s. 17}}"],
      ["Vattenlösliga ämnen passerar fritt, eftersom det finns vatten på båda sidor om membranet.",false,"Vattenlösliga ämnen stoppas av det vattenhatande inre och behöver transportproteiner."],
      ["Transportproteinerna gör att cellen kan reglera vad som går in och ut.",true,"Cellen styr vilka transportproteiner som finns, och därför styr den transporten."],
      ["Membranet håller kvar stora molekyler som enzymer inne i cellen.",true,"Avgränsningen gör att enzymer och organeller hålls instängda och att salthalt och pH kan regleras."],
      ["En signalmolekyl kan bara påverka celler som ligger precis bredvid den cell som skickade ut den.",false,"Boken säger att mottagarcellen kan ligga i närheten eller långt bort."],
      ["Proteiner i membranet gör att celler kan fästa vid varandra och bilda vävnader.",true,"Det är membranets fjärde funktion, bindning till närliggande celler."],
      ["Cellmembranet kallas också plasmamembran.",true,"Boken använder båda namnen. {{src:s. 17}}"]]},
    clozeUpp:{ty:"cloze", h:"Membranets byggstenar", text:"Cellmembranet består huvudsakligen av [[lipider]], men också av [[proteiner]]. [[Kolhydrater]] sitter fästa på lipider och proteiner och sticker ut på cellens [[utsida]]. Grunden är ett dubbelt lager av [[fosfolipider]]. De [[hydrofila]] huvudena pekar utåt och de [[hydrofoba]] fettsyrasvansarna pekar mot varandra. Delarna glider runt varandra, så membranet är en [[tvådimensionell]] vätska. Därför kan det bilda [[membranblåsor]]. Minst [[10 000|10000]] membran behövs för att nå tjockleken av en boksida.", bank:true},
    chainFlyt:{ty:"chain", h:"Saknad länk", items:[
      {h:"Omättade fettsyror i membranet", steps:["Dubbelbindningar i fettsyran","Svansen blir veckad","Avståndet mellan molekylerna blir större","Van der Waals-krafterna blir svagare","Membranet är flytande även vid låg temperatur"], b:2, w:["Svansen blir rak och packas tätt","Kolesterolet försvinner"], why:"Veckade svansar kan inte packas tätt. Större avstånd ger svagare van der Waals-krafter. {{src:s. 18}}"},
      {h:"Långa fettsyror", steps:["Längre fettsyrekedjor","Större yta för van der Waals-krafter","Starkare sammanhållning","Mer trögflytande membran"], b:1, w:["Fler dubbelbindningar","Mindre yta för krafterna"], why:"Ju längre fettsyror, desto större yta för krafterna att verka på. {{src:s. 18}}"},
      {h:"Ishavsfisken", steps:["Kallt vatten","Membran med mättade fettsyror skulle stelna","Fisken har mycket fleromättade fettsyror","Membranen håller sig flytande och fungerar"], b:2, w:["Fisken har mycket kolesterol","Fisken har mycket långa mättade fettsyror"], why:"Fleromättade fettsyror är veckade och håller membranet flytande i kylan. {{src:s. 18}}"},
      {h:"Tunntarmen", steps:["Dipeptid utanför tunntarmscellen","Enzym på cellens utsida bryter ner den","Fria aminosyror","Transportprotein tar upp aminosyrorna i cellen"], b:1, w:["Lysosomen bryter ner den","Ribosomen bryter ner den"], why:"Enzymet sitter på utsidan av tunntarmscellernas membran. {{src:s. 19}}"}]},
    matchProt:{ty:"match", h:"Para ihop exemplet med proteinets jobb", pairs:[
      ["Kanalprotein där ämnen tar sig igenom","Transport"],
      ["Bryter ner dipeptider på tunntarmscellens utsida","Enzymaktivitet"],
      ["Tar emot en neurotransmittor","Receptor"],
      ["Fäster cellen vid extracellulär matrix","Koppla ihop"],
      ["Håller fast cellskelettets proteintrådar","Ankare"],
      ["Protein med sockerkedjor som visar celltypen","Markör"]]},
    sortGE:{ty:"sort", h:"Glykokalyx eller extracellulär matrix?", cats:["Glykokalyx","ECM"], items:[
      ["Sockerkedjor på glykolipider och glykoproteiner i membranet",0,"Glykokalyx bildas av membranets egna lipider och proteiner med socker."],
      ["Kollagen i senor och brosk",1,"Kollagenet är matrix som cellerna ligger i som russin i en kaka."],
      ["Liknas vid kläder hos olika yrkesgrupper",0,"Sockerkedjornas variation visar celltypen."],
      ["Spektrinnätet som håller röda blodkroppar platta",1,"Boken räknar spektrin till de röda blodkropparnas extracellulära matrix."],
      ["Ger en slemmig yta så att vita blodkroppar tar sig ut ur kapillärerna",0,"Kolhydraterna absorberar vatten."],
      ["Geler med porer som binder tillväxtfaktorer",1,"ECM fungerar som filter."],
      ["Skyddar mot oönskade kontakter med attackerande celler",0,"En av glykokalyxens funktioner."],
      ["Utsöndras av cellen och ligger utanför den",1,"Extracellulär betyder utanför cellen."]]},
    whoK3:{ty:"who", h:"Vem är jag?", items:[
      {clues:["Jag är en steroid.","Jag sitter mellan fosfolipiderna i djurceller.","Jag håller membranet lagom flytande."], a:"Kolesterol", w:["Kollagen","Spektrin","Glykokalyx"], why:"Kolesterol finns i djurcellers membran. {{src:s. 18 · korsord 9 vågrätt}}"},
      {clues:["Jag är ett kolhydratlager.","Jag bildas av glykolipider och glykoproteiner.","Jag är cellens uniform."], a:"Glykokalyx", w:["Extracellulär matrix","Kolesterol","Cellskelettet"], why:"Sockerkedjorna liknas vid kläder hos olika yrkesgrupper. {{src:s. 20}}"},
      {clues:["Jag är ett protein utanför cellerna.","Jag finns i senor och brosk.","Cellerna ligger i mig som russin i en kaka."], a:"Kollagen", w:["Spektrin","Keratin","Kolesterol"], why:"Kollagen gör vävnaden elastisk. {{src:s. 20}}"},
      {clues:["Jag är proteintrådar.","Jag gör röda blodkroppar starkare.","Om jag är muterad blir blodkropparna sfäriska och personen får anemi."], a:"Spektrin", w:["Kollagen","Glykokalyx","Hemoglobin"], why:"Spektrin håller de röda blodkropparna platta. {{src:s. 21}}"},
      {clues:["Jag är ett protein i membranet.","Hormoner och neurotransmittorer binder till mig.","Jag är låset som rätt nyckel passar i."], a:"Receptor", w:["Kanalprotein","Enzym","Markör"], why:"Receptorn tar emot signalmolekyler. {{src:s. 19–20}}"}]},
    fixK3:{ty:"fix", h:"Hitta felen i Pelles förklaring", parts:["Cellmembranet är ett dubbelskikt av fosfolipider där ",["de hydrofoba svansarna pekar utåt mot vattnet","de hydrofila huvudena pekar utåt mot vattnet","Huvudena är hydrofila och vänds mot vattnet. Svansarna är hydrofoba och pekar mot varandra i mitten."],". Membranet är ingen fast hinna, eftersom delarna glider runt varandra. Ishavsfiskar har mycket ",["mättade","fleromättade","Fleromättade fettsyror är veckade och håller membranet flytande i kylan."]," fettsyror så att membranen inte stelnar. Kolesterol håller djurcellens membran lagom flytande. Ju ",["kortare","längre","Längre fettsyror ger större yta för van der Waals-krafterna och därför ett trögare membran."]," fettsyrorna är, desto trögare blir membranet. Glykokalyx liknas vid ",["russin i en kaka","kläder hos olika yrkesgrupper","Russin i en kaka gäller celler i kollagen. Glykokalyx liknas vid kläder som läkarrock och polisuniform."],"."]}
  },
  w:{
    k3Flyt(el,api){
      el.className="wid";
      const S={typ:"sat",len:"long",chol:"no",T:20};
      el.innerHTML=`<div class="wh"><b>Flytbarhetslabbet</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0"><svg viewBox="0 0 420 260" role="img" aria-label="Ett membran som blir mer eller mindre flytande" id="k3-fl-svg"></svg></figure>
      <div><p class="small">Välj fettsyror, längd, kolesterol och temperatur. Gissa först hur membranet blir.</p>
      ${segHTML("k3-fl-typ","Fettsyror",[["sat","Mättade"],["uns","Omättade"],["poly","Fleromättade"]],S.typ)}
      ${segHTML("k3-fl-len","Längd",[["short","Korta"],["long","Långa"]],S.len)}
      ${segHTML("k3-fl-chol","Kolesterol",[["no","Utan"],["yes","Med"]],S.chol)}
      <label class="ctl">Temperatur: <span id="k3-fl-tv"></span><input type="range" id="k3-fl-t" min="-2" max="40" step="1" value="20"></label>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0"><button class="btn sm" type="button" id="k3-fl-fish">Ishavsfisk, 0 °C</button><button class="btn sm" type="button" id="k3-fl-hum">Människa, 37 °C</button></div>
      <dl class="readout"><dt>Packning</dt><dd id="k3-fl-p"></dd><dt>van der Waals-krafter</dt><dd id="k3-fl-v"></dd><dt>Membranet</dt><dd id="k3-fl-m"></dd></dl>
      <p class="verdict" id="k3-fl-vd"></p><p id="k3-fl-why"></p></div></div>`;
      const svg=el.querySelector("#k3-fl-svg"),$=s=>el.querySelector(s),rg=$("#k3-fl-t");
      const reduce=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
      const TM={sat:{long:32,short:16},uns:{long:6,short:-6},poly:{long:-12,short:-24}};
      function fl(){let f=(S.T-TM[S.typ][S.len]+4)/34;f=Math.max(0,Math.min(1,f));if(S.chol==="yes")f=0.5+(f-0.5)*0.5;return f}
      function draw(t){const f=fl(),L=S.len==="long"?50:32,k=S.typ==="sat"?0:S.typ==="uns"?1:2;
        const amp=reduce?0:(0.6+f*6);let s="";
        const cold=Math.max(0,Math.min(1,(12-S.T)/14)),warm=Math.max(0,Math.min(1,(S.T-26)/14));
        s+=`<rect x="0" y="0" width="420" height="260" rx="10" style="fill:var(--c-vac-soft)" opacity="${r1(cold)}"/><rect x="0" y="0" width="420" height="260" rx="10" style="fill:var(--mid-soft)" opacity="${r1(warm)}"/>`;
        s+=`<text x="12" y="20" class="lbs halo" style="font-size:15px">UTSIDA</text><text x="12" y="250" class="lbs halo" style="font-size:15px">INSIDA</text>`;
        const mid=132;
        for(let i=0;i<9;i++){const ph=i*1.7,dx=amp*Math.sin((t||0)*0.004*(1+(i%3)*0.35)+ph),dy=amp*0.4*Math.cos((t||0)*0.005+ph);
          const x=r1(40+i*36+dx);
          s+=tails(x,mid-L-1+dy,1,L-1,k,S.typ==="poly"?1:0,"--c-wall",2.2)+`<circle cx="${x}" cy="${r1(mid-L-8+dy)}" r="8" ${st("--c-mem","--c-wall",1.4)}/>`;
          const x2=r1(40+i*36-dx*0.8);
          s+=tails(x2,mid+L+1-dy,-1,L-1,k,S.typ==="poly"?1:0,"--c-wall",2.2)+`<circle cx="${x2}" cy="${r1(mid+L+8-dy)}" r="8" ${st("--c-mem","--c-wall",1.4)}/>`;
          if(S.chol==="yes"&&i<8&&i%2===0){s+=chol(r1(58+i*36+dx*0.5),mid-L*0.45,0.8)+chol(r1(58+i*36-dx*0.5),mid+L*0.45,0.8)}}
        /* termometer */
        const tf=(S.T+2)/42;s+=`<rect x="388" y="34" width="14" height="150" rx="7" ${st("--paper","--ink",1.2)}/><rect x="391" y="${r1(181-140*tf)}" width="8" height="${r1(140*tf+3)}" rx="4" style="fill:var(--bad)"/><circle cx="395" cy="194" r="11" ${st("--bad","--ink",1.2)}/><text x="395" y="226" text-anchor="middle" class="lbs halo" style="font-size:15px">${S.T} °C</text>`;
        svg.innerHTML=s}
      let raf=0,until=0,last=0;
      function loop(ts){raf=0;if(!el.isConnected)return;if(ts-last>60){last=ts;draw(ts)}if(ts<until)raf=requestAnimationFrame(loop)}
      function kick(){draw(performance.now());if(reduce)return;until=performance.now()+5000;if(!raf)raf=requestAnimationFrame(loop)}
      function upd(){const f=fl();$("#k3-fl-tv").textContent=S.T+" °C";rg.value=S.T;
        $("#k3-fl-p").textContent={sat:"tät, raka svansar",uns:"glesare, en knäck",poly:"gles, flera knäckar"}[S.typ];
        const sv={sat:2,uns:1,poly:0}[S.typ]+(S.len==="long"?1:0);$("#k3-fl-v").textContent=["mycket svaga","svaga","ganska starka","starka"][sv];
        const state=f<0.12?0:f<0.32?1:f<=0.78?2:3;
        $("#k3-fl-m").textContent=["stelnat","trögflytande","lagom flytande","mycket lättflytande"][state];
        const vd=$("#k3-fl-vd");vd.className="verdict "+["b","m","g","m"][state];vd.textContent=["Membranet har stelnat och slutar fungera","Membranet är trögt","Membranet är lagom flytande och fungerar","Membranet är mycket lättflytande"][state];
        let w=[];
        w.push({sat:"Raka, mättade fettsyror packas tätt. Därför är avståndet mellan molekylerna litet och van der Waals-krafterna starkare.",uns:"Omättade fettsyror har en dubbelbindning som gör svansen veckad. Därför blir avståndet mellan molekylerna större och van der Waals-krafterna svagare.",poly:"Fleromättade fettsyror har flera dubbelbindningar och flera knäckar. Därför packas de glest och krafterna blir ännu svagare."}[S.typ]);
        w.push(S.len==="long"?"Långa fettsyror ger större yta för van der Waals-krafterna, och därför blir membranet trögare.":"Korta fettsyror ger mindre yta för krafterna, och därför blir membranet mer lättflytande.");
        if(S.T<=8)w.push("Det är kallt. Ju kallare det är, desto lättare stelnar membranet.");else if(S.T>=30)w.push("Det är varmt, och värmen gör membranet mer lättflytande.");
        w.push(S.chol==="yes"?"Kolesterolet hjälper membranet att hålla sig lagom flytande, och därför blir det varken lika stelt eller lika lättflytande.":"Djurceller har kolesterol i membranet. Prova att lägga till det.");
        if(S.T<=4&&S.typ==="poly"&&state>=2)w.push("Så klarar sig ishavsfisken. Dess membran har mycket fleromättade fettsyror och stelnar därför inte i det kalla vattnet. {{src:s. 18}}");
        if(S.T<=4&&S.typ==="sat"&&state===0)w.push("En fisk med sådana membran skulle inte klara ishavet, eftersom membranen stelnar i kylan.");
        $("#k3-fl-why").innerHTML=api.tpl(w.join(" "));kick()}
      function seg(id,key){el.querySelectorAll("#"+id+" button").forEach(b=>b.addEventListener("click",()=>{S[key]=b.dataset.v;el.querySelectorAll("#"+id+" button").forEach(o=>o.setAttribute("aria-pressed",o===b?"true":"false"));upd()}))}
      function setSeg(id,v){el.querySelectorAll("#"+id+" button").forEach(o=>o.setAttribute("aria-pressed",o.dataset.v===v?"true":"false"))}
      seg("k3-fl-typ","typ");seg("k3-fl-len","len");seg("k3-fl-chol","chol");
      rg.addEventListener("input",()=>{S.T=+rg.value;upd()});
      $("#k3-fl-fish").addEventListener("click",()=>{Object.assign(S,{typ:"poly",len:"long",chol:"no",T:0});setSeg("k3-fl-typ","poly");setSeg("k3-fl-len","long");setSeg("k3-fl-chol","no");upd()});
      $("#k3-fl-hum").addEventListener("click",()=>{Object.assign(S,{typ:"uns",len:"long",chol:"yes",T:37});setSeg("k3-fl-typ","uns");setSeg("k3-fl-len","long");setSeg("k3-fl-chol","yes");upd()});
      upd();
    }
  }
});
})();
