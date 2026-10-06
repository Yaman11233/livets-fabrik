/* K2 Tre sorters celler. PPT Bi2 bild 17–26 · bok s. 17, 21, 178, 180–181, 244–247. */
(function(){
"use strict";
const r1=n=>Math.round(n*10)/10;
const st=(f,s)=>`style="fill:var(${f})${s?";stroke:var("+s+")":""}"`;
function ln(d,col,w,extra){return `<path d="${d}" fill="none" style="stroke:var(${col})" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra||""}/>`}
function arr(x1,y1,x2,y2,col,w,hs){const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,h=hs||8;const bx=x2-ux*h,by=y2-uy*h,px=-uy*h*0.6,py=ux*h*0.6;
  return `<path d="M${r1(x1)} ${r1(y1)} L${r1(bx)} ${r1(by)}" fill="none" style="stroke:var(${col})" stroke-width="${w}" stroke-linecap="round"/><polygon points="${r1(x2)},${r1(y2)} ${r1(bx+px)},${r1(by+py)} ${r1(bx-px)},${r1(by-py)}" style="fill:var(${col})"/>`}
function dots(P,r,col){return P.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${r||1.8}" ${st(col||"--ink")}/>`).join("")}
function squiggle(cx,cy,rx,ry,n){let d="";const N=n||28;for(let i=0;i<=N;i++){const a=i/N*Math.PI*4,x=cx+rx*Math.sin(a*1.3)*Math.cos(i*0.7),y=cy+ry*Math.cos(a*0.9)*Math.sin(i*0.5+1);d+=(i?"L":"M")+r1(x)+" "+r1(y)}return d}
function mito(cx,cy,rx,ry,rot){let s=`<g transform="rotate(${rot||0} ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${st("--c-mito-soft","--c-mito")} stroke-width="2"/>`;
  let d=`M${cx-rx+5} ${cy}`;const n=6;for(let i=1;i<=n;i++){const x=cx-rx+5+i*(2*rx-10)/n;d+=` L${r1(x)} ${i%2?cy-ry+4:cy+ry-4}`}
  return s+ln(d,"--c-mito",1.5)+`</g>`}
function chloro(cx,cy,rx,ry,rot){let s=`<g transform="rotate(${rot||0} ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${st("--c-chl-soft","--c-chl")} stroke-width="2"/>`;
  const k=Math.max(2,Math.round(rx/7));for(let i=0;i<k;i++){const x=cx-rx+rx*2*(i+0.5)/k;s+=`<rect x="${r1(x-2.5)}" y="${r1(cy-ry*0.55)}" width="5" height="${r1(ry*1.1)}" ${st("--c-chl")}/>`}
  return s+`</g>`}
function golgi(x,y,n,w,gap){let s="";for(let i=0;i<n;i++){const yy=y+i*gap;s+=ln(`M${x} ${yy} Q${x+w/2} ${yy-8} ${x+w} ${yy}`,"--c-golgi",4)}return s}
function lyso(cx,cy,r){return `<circle cx="${cx}" cy="${cy}" r="${r}" ${st("--c-lyso","--c-lyso")} stroke-width="1" opacity=".35"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" style="stroke:var(--c-lyso)" stroke-width="2"/>`+dots([[cx-3,cy-2],[cx+3,cy+2],[cx+2,cy-3]],1.5,"--c-lyso")}

/* ---------- figur: tre sorters celler (PPT Bi2 bild 20, 26) ---------- */
function figTre(){
  let s="";
  /* bakterie */
  s+=`<g data-k="bak"><rect x="22" y="112" width="112" height="60" rx="30" ${st("--c-bact-soft","--c-bact")} stroke-width="5"/><rect x="29" y="119" width="98" height="46" rx="23" fill="none" style="stroke:var(--c-mem)" stroke-width="1.5"/>`;
  s+=ln(squiggle(78,142,22,10,30),"--c-dna",1.8)+dots([[44,128],[52,156],[112,130],[106,158],[40,146],[118,146]],2)+`</g>`;
  /* djurcell */
  s+=`<g data-k="djur"><path d="M235 84 C280 82 300 112 298 144 C296 178 280 200 238 200 C196 200 172 182 172 146 C172 108 196 86 235 84 Z" ${st("--c-cyto","--c-mem")} stroke-width="3"/>`;
  s+=`<circle cx="232" cy="138" r="22" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2.5"/>`+mito(272,168,12,6,-20)+mito(196,120,10,5,30)+dots([[262,112],[270,126],[204,170],[214,182]],1.8)+`</g>`;
  /* växtcell */
  s+=`<g data-k="vaxt"><rect x="334" y="94" width="116" height="104" rx="4" ${st("--c-wall-soft","--c-wall")} stroke-width="6"/><rect x="341" y="101" width="102" height="90" rx="3" ${st("--c-cyto","--c-mem")} stroke-width="1.5"/>`;
  s+=`<rect x="352" y="112" width="70" height="66" rx="16" ${st("--c-vac-soft","--c-vac")} stroke-width="2"/><circle cx="432" cy="118" r="8" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2"/>`;
  s+=chloro(436,166,7,4,90)+chloro(388,106,10,3.6,0)+chloro(388,186,10,3.6,0)+`</g>`;
  s+=ln("M156 30 V250 M314 30 V250","--line2",1.2,' stroke-dasharray="4 5"');
  return s}

/* ---------- figur: cell → vävnad → organ (PPT Bi2 bild 18–19) ---------- */
function spindle(cx,cy,rx,ry){return `<path d="M${cx-rx} ${cy} Q${cx} ${cy-ry*2} ${cx+rx} ${cy} Q${cx} ${cy+ry*2} ${cx-rx} ${cy} Z" ${st("--c-mito-soft","--c-mito")} stroke-width="1.8"/><ellipse cx="${cx}" cy="${cy}" rx="5" ry="3" ${st("--c-nuc")}/>`}
function figOrg(){
  let s=`<g data-k="cell">${spindle(72,124,50,14)}</g>`;
  let g=`<g data-k="vav">`;[[230,84],[262,104],[214,104],[240,124],[206,144],[262,144],[230,164]].forEach(p=>{g+=spindle(p[0],p[1],34,8)});s+=g+`</g>`;
  s+=`<g data-k="organ"><path d="M400 172 C356 140 344 108 362 90 C378 74 398 80 400 98 C402 80 422 74 438 90 C456 108 444 140 400 172 Z" ${st("--bad-soft","--bad")} stroke-width="3"/>${ln("M386 92 C392 110 404 112 412 128","--bad",1.6)}</g>`;
  s+=arr(126,124,166,124,"--ink",3,10)+arr(300,124,340,124,"--ink",3,10);
  return s}

/* ---------- figur: djurcellens delar (PPT Bi2 bild 21, bok s. 21) ---------- */
const DCELL="M240 52 C300 50 342 100 340 170 C338 240 350 300 300 340 C260 370 190 366 160 330 C126 290 140 240 136 180 C132 110 176 54 240 52 Z";
function arcPath(cx,cy,R,a0,a1){const p=a=>[r1(cx+R*Math.cos(a*Math.PI/180)),r1(cy+R*Math.sin(a*Math.PI/180))];const A=p(a0),B=p(a1);return `M${A[0]} ${A[1]} A${R} ${R} 0 0 1 ${B[0]} ${B[1]}`}
function arcDots(cx,cy,R,a0,a1,n){const P=[];for(let i=0;i<=n;i++){const a=(a0+(a1-a0)*i/n)*Math.PI/180;P.push([r1(cx+R*Math.cos(a)),r1(cy+R*Math.sin(a))])}return P}
function figDjur(){
  let s=`<g data-k="cyto"><path d="${DCELL}" ${st("--c-cyto")}/></g>`;
  s+=`<g data-k="karna"><circle cx="232" cy="150" r="44" ${st("--c-nuc-soft")}/><circle cx="232" cy="150" r="44" fill="none" style="stroke:var(--c-nuc)" stroke-width="2.5"/><circle cx="232" cy="150" r="40" fill="none" style="stroke:var(--c-nuc)" stroke-width="1.2"/><ellipse cx="216" cy="166" rx="9" ry="7" ${st("--c-nuc")}/></g>`;
  s+=`<g data-k="dna">${ln(squiggle(236,146,26,18,34),"--c-dna",1.8)}</g>`;
  let g=`<g data-k="er">`;[54,62,70].forEach(R=>{g+=ln(arcPath(232,150,R,5,80),"--c-er",3.5)});s+=g+`</g>`;
  s+=`<g data-k="rib"><rect x="292" y="232" width="34" height="40" fill="transparent"/>${dots(arcDots(232,150,58,8,78,8).concat(arcDots(232,150,74,8,78,9)),1.6)}${dots([[300,240],[312,252],[304,262],[318,238],[296,226]],2)}</g>`;
  s+=`<g data-k="golgi"><rect x="150" y="262" width="56" height="44" fill="transparent"/>${golgi(156,272,4,46,9)}<circle cx="206" cy="296" r="3.5" ${st("--c-golgi")}/></g>`;
  s+=`<g data-k="mito">${mito(304,172,22,11,70)}${mito(178,108,18,9,-30)}${mito(206,336,18,9,10)}</g>`;
  s+=`<g data-k="lyso">${lyso(162,216,9)}${lyso(274,310,8)}</g>`;
  s+=`<g data-k="cent"><rect x="242" y="268" width="22" height="8" rx="3" ${st("--muted")}/><rect x="257" y="258" width="8" height="22" rx="3" ${st("--muted")}/></g>`;
  s+=`<g data-k="mem"><path d="${DCELL}" fill="none" style="stroke:var(--c-mem)" stroke-width="4"/></g>`;
  return s}

/* ---------- figur: växtcellens delar (PPT Bi2 bild 23–25, bok s. 245) ---------- */
function figVaxt(){
  let s=`<g data-k="vagg"><polygon points="30,190 70,80 330,80 370,190 330,300 70,300" ${st("--c-wall-soft","--c-wall")} stroke-width="10" stroke-linejoin="round"/></g>`;
  s+=`<g data-k="cyto"><polygon points="44,190 79,92 321,92 356,190 321,288 79,288" ${st("--c-cyto")}/></g>`;
  s+=`<g data-k="mem"><polygon points="44,190 79,92 321,92 356,190 321,288 79,288" fill="none" style="stroke:var(--c-mem)" stroke-width="2.5" stroke-linejoin="round"/></g>`;
  s+=`<g data-k="vak"><polygon points="82,190 108,118 262,118 288,190 262,262 108,262" ${st("--c-vac-soft","--c-vac")} stroke-width="2.5" stroke-linejoin="round"/></g>`;
  s+=`<g data-k="karna"><circle cx="314" cy="150" r="17" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2.5"/><circle cx="310" cy="154" r="5" ${st("--c-nuc")}/></g>`;
  s+=`<g data-k="er">${ln("M298 176 Q314 184 330 176 M296 186 Q314 194 334 186 M298 196 Q314 204 330 196","--c-er",3)}${dots([[302,180],[312,183],[322,181],[304,190],[316,193],[328,190]],1.4)}</g>`;
  s+=`<g data-k="rib"><rect x="306" y="214" width="30" height="34" fill="transparent"/>${dots([[316,222],[326,230],[314,236],[328,242],[320,214]],2)}</g>`;
  s+=`<g data-k="klo">${chloro(150,105,20,7,0)}${chloro(232,105,20,7,0)}${chloro(122,275,18,7,0)}${chloro(244,275,18,7,0)}</g>`;
  s+=`<g data-k="mito">${mito(72,152,14,6,-70)}${mito(296,256,13,6,-30)}</g>`;
  s+=`<g data-k="golgi"><rect x="164" y="266" width="44" height="22" fill="transparent"/>${golgi(168,276,2,36,7)}</g>`;
  return s}

const DEF={
  mem:{t:"Cellmembran",d:"Läraren: \"Yttre skydd som släpper in och ut vissa ämnen.\" Boken: avgränsar cellen och kontrollerar in- och uttransport. I växtcellen ligger det innanför cellväggen.",go:"k3.funktion"},
  karna:{t:"Cellkärna",d:"Läraren: \"Innehåller gener (arvsanlagen) som består av DNA.\" Boken: nästan all arvsmassa, omgiven av ett dubbelt membran (kärnmembranet).",go:"k4.karnan"},
  dna:{t:"Arvsmassa, DNA",d:"De trådar som ritningarna står på. Finns i kärnan (och lite i mitokondrier och kloroplaster).",go:"k4.karnan"},
  cyto:{t:"Cytoplasma (cellplasma)",d:"Läraren: \"Cellplasma = innehåller specialiserade celldelar samt mycket vatten.\" Boken: en tjock vätska med lösta ämnen där många av cellens kemiska reaktioner sker."},
  mito:{t:"Mitokondrie",d:"Läraren: \"Cellens kraftverk. Energirik näring förbränns (cellandningen).\" Finns i både djur- och växtceller.",go:"k4.mitokondrien"},
  rib:{t:"Ribosomer",d:"Läraren: \"Här tillverkar cellen proteiner.\" De sitter fritt i cytoplasman eller på ER.",go:"k4.ribosomer"},
  er:{t:"Endoplasmatiska nätverket (ER)",d:"Läraren: \"Ett membransystem som transporterar kemiska föreningar.\" ER med ribosomer kallas kornigt ER.",go:"k4.er"},
  golgi:{t:"Golgiapparaten",d:"Staplade membransäckar som modifierar proteiner och knoppar av blåsor (bok s. 25). PPT bild 23 stavar \"Golgieapparat\".",go:"k4.golgi"},
  lyso:{t:"Lysosom",d:"Membranblåsa med nedbrytande enzymer, cellens sopförbränning. Finns i djurceller men inte i växtceller.",go:"k4.lysosomer"},
  cent:{t:"Centrioler",d:"Finns med i bokens djurcellsbild (s. 21) men inte i lärarens. Växtceller saknar centrioler (s. 244)."},
  vagg:{t:"Cellvägg",d:"Läraren: \"Stödjande vägg av cellulosa (finns i växtceller).\" Boken: ger form, skydd och stadga och hindrar cellen från att spricka.",go:"k13.cellvaggen"},
  vak:{t:"Vakuol",d:"Läraren: \"En vätskefylld blåsa (cellsaftrum).\" Boken: upp till 90 % av cellens volym, ger turgor mot cellväggen. PPT bild 23 stavar \"Vacuol\".",go:"k13.vakuolen"},
  klo:{t:"Kloroplast",d:"Läraren: \"Innehåller klorofyll som gör att växterna kan utnyttja ljusenergi (fotosyntes) från solen (växter och alger).\"",go:"k13.kloroplasten"}
};

G.def({
  id:"k2",
  src:{bok:"s. 17, 21 (djurcellen), s. 178, 180–181 (bakterier, arkéer, cyanobakterier), s. 244–247 (växtcellen)",ppt:"Bi2 bild 17–26",ab:"Korsord kap 1 Cellkrysset"},
  threads:["membran","vagg","endo","osmos"],
  goals:[
    "förklara skillnaden mellan prokaryota och eukaryota celler och ge exempel på båda",
    "beskriva lärarens tre celltyper och vad boken lägger till (arkéer, cyanobakterier)",
    "förklara hur celler bildar vävnader och organ, och vad generalister och specialister är",
    "märka ut djurcellens delar och säga vad varje del gör",
    "märka ut växtcellens delar och förklara cellväggen, vakuolen och kloroplasten",
    "jämföra djurcell, växtcell och bakteriecell i en tabell"
  ],
  intro:`<p>I {{go:k1|K1}} såg du byggmaterialet. Nu tittar vi på fabrikerna som byggs av det. Alla celler har ett cellmembran runt sig, men inuti finns två helt olika planlösningar: en verkstad i ett enda rum (prokaryot) och en stor fabrik med avdelningar (eukaryot). Här får du översikten. Detaljerna om varje avdelning kommer i {{go:k4|K4 Organellerna}} och {{go:k13|K13 Växtcellen}}.</p>`,
  secs:[
  {id:"celltyper",h:"Cellen: livets minsta enhet",nav:"Prokaryot och eukaryot",src:"PPT Bi2 bild 20, 26 · s. 178, 180–181",prov:true,html:`
    <p>Cellen är <b>livets minsta enhet</b>. Det finns olika sorters celler, beroende på om de hör till en encellig eller en flercellig organism. {{lek:Bi2 bild 20}}</p>
    <p>Den viktigaste skillnaden är kärnan. En <b>eukaryot</b> cell har en <b>cellkärna</b>. En <b>prokaryot</b> cell saknar en avgränsad cellkärna. {{prov}} {{lek:Bi2 bild 26}} Boken säger samma sak om bakterierna: de är encelliga och saknar cellkärna och andra organeller som avgränsas av membran. {{src:s. 180}} Därför ligger bakteriens DNA fritt i cytoplasman.</p>
    <div class="box key"><p><b>Eukaryot</b> = cell <b>med</b> cellkärna. <b>Prokaryot</b> = cell <b>utan</b> avgränsad cellkärna (och utan membranomslutna organeller). {{prov}}</p></div>
    <p>Läraren talar om <b>i princip tre celltyper</b>. {{lek:Bi2 bild 20}}</p>
    <ol><li><b>Prokaryota celler</b>, som saknar cellkärna: bakterier och "blågröna alger".</li><li><b>Eukaryota djurceller</b>, med cellkärna.</li><li><b>Eukaryota växtceller</b>, med cellkärna.</li></ol>
    <div class="lfig-h" data-fig="tre"></div>
    <div class="box diff"><p><b>Boken</b> delar in allt levande i tre huvudgrupper: <b>bakterier</b>, <b>arkéer</b> och <b>eukaryoter</b>. Även <b>arkéerna</b> saknar cellkärna, men deras cellmembran är byggt annorlunda än hos bakterier och eukaryoter. {{src:s. 178, 180}} De "blågröna algerna" kallas i boken <b>cyanobakterier</b>. De gör fotosyntes men är bakterier, alltså prokaryoter, inte alger. {{src:s. 181}}</p><p><b>Läraren</b> nämner bara bakterier och blågröna alger som prokaryoter, och bara djur- och växtceller som eukaryoter. Svampar och encelliga eukaryoter, som jäst och malariaparasiten, är också eukaryoter. {{src:s. 178}}</p></div>
    <table class="cmp"><tr><th></th><th>Prokaryot</th><th>Eukaryot</th></tr>
      <tr><td>Cellkärna</td><td>nej, DNA fritt i cytoplasman</td><td>ja</td></tr>
      <tr><td>Organeller med membran</td><td>nej</td><td>ja (mitokondrier, ER, golgi …)</td></tr>
      <tr><td>Exempel</td><td>bakterier, cyanobakterier ("blågröna alger"), arkéer</td><td>djur, växter, svampar, alger, encelliga eukaryoter</td></tr>
      <tr><td>Antal celler</td><td>alltid encelliga</td><td>encelliga eller flercelliga</td></tr></table>
    <div class="box trick"><p><b>Eu</b> = äkta, <b>karyon</b> = kärna. Eukaryot = "äkta kärna". <b>Pro</b> = före: prokaryot = "före kärnan".</p></div>
    <div class="box trap"><p>"Blågröna alger" är inte alger. Det är cyanobakterier, alltså prokaryoter. Riktiga alger är eukaryoter med kloroplaster.</p><p>Prokaryoter har DNA. Det ligger bara inte i någon kärna.</p></div>
    <div class="box fab"><p>En prokaryot cell är en <b>verkstad i ett enda rum</b>. Ritningen (DNA) ligger framme på golvet, och arbetsbänkarna (ribosomerna) står runt omkring. En eukaryot cell är en <b>stor fabrik med avdelningar</b>: ett ledningskontor (kärnan) med ritningarna inlåsta, ett kraftverk (mitokondrien), löpande band (ER) och en packcentral (golgi).</p></div>
    <div class="box tr" data-t="endo" data-h="Kraftverk som flyttat in">Mitokondrien och kloroplasten har dubbla membran och eget, ringformat DNA. Man tror att de en gång var fritt levande prokaryoter som flyttade in i en eukaryot cell, endosymbios ({{go:k4.mitokondrien|K4}}, {{go:k13.kloroplasten|K13}}).</div>
    <div class="box link"><p>Mer om de prokaryota cellerna: bakteriecellens byggnad i {{go:k8.byggnad|K8}} och arkéerna i {{go:k10.arkeer|K10}}. De encelliga eukaryoterna finns i {{go:k7|K7}}.</p></div>
    <div class="x" data-x="sortTyp"></div>
  `},
  {id:"organisation",h:"Från cell till organ",nav:"Cell, vävnad, organ",src:"PPT Bi2 bild 18–20 · s. 17, 21, 178, 244",prov:true,html:`
    <p>Celler förökar sig genom att <b>dela sig till två dotterceller</b>. Många celler i kroppen dör och byts ut mot nya. {{lek:Bi2 bild 18}}</p>
    <p>Vissa organismer består av <b>en enda cell</b>. {{lek:Bi2 bild 18}} Boken räknar upp encelliga eukaryoter som alger och jäst, och alla bakterier och arkéer. {{prov}} {{src:s. 178}}</p>
    <p>Hos flercelliga organismer bildar <b>flera likadana celler</b> en <b>vävnad</b>, och <b>olika vävnader</b> kan tillsammans bilda ett <b>organ</b>. Muskelceller bildar muskelvävnad, nervceller nervvävnad och benceller benvävnad. Vävnaderna bygger upp organ som hjärta, lever och lungor. {{lek:Bi2 bild 18–19}}</p>
    <div class="lfig-h" data-fig="org"></div>
    <ol class="chainv"><li><b>Cell</b>: livets minsta enhet, t.ex. en muskelcell.</li><li><b>Vävnad</b>: flera likadana celler, t.ex. muskelvävnad.</li><li><b>Organ</b>: olika vävnader tillsammans, t.ex. hjärtat.</li></ol>
    <h3>Generalister och specialister</h3>
    <p>Celler hos encelliga organismer är <b>generalister</b>, eftersom en enda cell måste klara samtliga funktioner. Hos flercelliga organismer är cellerna i stället <b>specialister</b>, specialiserade på vissa funktioner. På så sätt kan energin användas mer effektivt. {{lek:Bi2 bild 20}}</p>
    <p>Boken säger samma sak. Flercelliga organismer består av en mängd celltyper som är <b>specialiserade</b> på olika arbetsuppgifter, och därför kan de se väldigt olika ut. {{prov}} {{src:s. 21}} Växter byggs också av celler med olika specialiseringar som bildar olika typer av vävnader. {{src:s. 244}}</p>
    <p>Hur sitter cellerna ihop? Proteiner i cellmembranet gör att celler kan fästa till varandra och bilda vävnader med olika funktion. {{src:s. 17}}</p>
    <table class="cmp"><tr><th></th><th>Generalist</th><th>Specialist</th></tr>
      <tr><td>Finns hos</td><td>encelliga organismer</td><td>flercelliga organismer</td></tr>
      <tr><td>Gör</td><td>samtliga funktioner</td><td>vissa specifika funktioner</td></tr>
      <tr><td>Exempel</td><td>bakterie, jästcell</td><td>muskelcell, nervcell, bencell</td></tr></table>
    <div class="box trick"><p>Cell → vävnad → organ: <b>C V O</b>, "<b>C</b>ykla <b>V</b>idare, <b>O</b>la".</p></div>
    <div class="box trap"><p>En vävnad är <b>likadana</b> celler. Ett organ är <b>olika</b> vävnader. Hjärtat är ett organ, inte en vävnad.</p></div>
    <div class="box fab"><p>En encellig organism är en enmansverkstad där samma person gör allt. En flercellig organism är ett stort företag med många fabriker som var och en gör en sak bra, och det sparar energi.</p></div>
    <div class="box link"><p>Hur en eukaryot cell delar sig behöver cellskelettet ({{go:k4.cellskelettet|K4}}). Hur bakterier delar sig finns i {{go:k9.delning|K9}}.</p></div>
    <div class="x" data-x="orderOrg"></div>
  `},
  {id:"djurcell",h:"Djurcellen",nav:"Djurcellen",src:"PPT Bi2 bild 17, 21–22 · s. 21",prov:true,html:`
    <p>Läraren inleder cellavsnittet med en stor tredimensionell bild av en uppskuren djurcell, där man ser kärnan, ER, golgi, mitokondrier och blåsor. {{lek:Bi2 bild 17}} Sedan kommer "en enkel bild" med etiketter. {{lek:Bi2 bild 21}}</p>
    <div class="lfig-h" data-fig="djur"></div>
    <p>Boken påpekar att läroboksbilden är en <b>"genomsnittlig" djurcell</b>, eftersom specialiserade celler kan se väldigt olika ut. {{src:s. 21}}</p>
    <p>Djurceller har <b>ingen cellvägg</b>, till skillnad från växtceller. I stället är det <b>cellmembranet</b> (samt vissa ämnen som utsöndras ur cellen) som utgör det enda skyddet mot omgivningen. {{prov}} {{src:s. 21}}</p>
    <p>Innanför membranet finns <b>cytoplasman</b>, en tjock vätska med lösta ämnen där många av cellens kemiska reaktioner sker. Den omger organellerna och <b>inklusionskropparna</b>. Inklusionskroppar finns inte i alla celler. De flesta är <b>lagrad energi</b>, som glykogen i leverceller och fett i fettceller, eller <b>cellprodukter</b>, som melanin (pigment) i hudceller och slem i slemproducerande celler. {{prov}} {{src:s. 21}}</p>
    <h3>Lärarens lista</h3>
    <table class="cmp"><tr><th>Del</th><th>Vad den gör (PPT Bi2 bild 22)</th></tr>
      <tr><td>Cellmembran</td><td>Yttre skydd som släpper in och ut vissa ämnen</td></tr>
      <tr><td>Cellkärna</td><td>Innehåller gener (arvsanlagen) som består av DNA</td></tr>
      <tr><td>Cellplasma</td><td>Innehåller specialiserade celldelar samt mycket vatten</td></tr>
      <tr><td>Mitokondrie</td><td>Cellens kraftverk. Energirik näring förbränns (cellandningen)</td></tr>
      <tr><td>Ribosomer</td><td>Här tillverkar cellen proteiner</td></tr>
      <tr><td>Endoplasmatiska nätverket (ER)</td><td>Ett membransystem som transporterar kemiska föreningar</td></tr></table>
    <p>Alla dessa finns också i boken, och de är därför provviktiga. {{prov}} Bilden har dessutom lysosom och golgiapparaten, som boken förklarar på s. 25–26.</p>
    <div class="box diff"><p><b>Cellplasma eller cytoplasma?</b> Läraren skriver "cellplasma" i listan men "cytoplasma" i bilden. Boken säger <b>cytoplasma</b>. Det är samma sak. {{diff}}</p><p><b>Hur mycket DNA i kärnan?</b> Läraren: kärnan "innehåller gener som består av DNA". Boken: kärnan innehåller <b>nästan all</b> arvsmassa, eftersom mitokondrierna har eget DNA. {{src:s. 22}}</p><p><b>Bilderna:</b> Bokens djurcell (s. 21) har också centrioler, kärnmembran, ER med ribosomer och en liten vakuol. Lärarens bild saknar dem.</p></div>
    <div class="box trap"><p>Djurcellen har ingen cellvägg. Därför spricker en djurcell i rent vatten, men inte en växtcell ({{go:k5.osmos|osmos i K5}}).</p></div>
    <div class="box fab"><p>Djurcellen är fabriken utan mur. Tullgränsen (cellmembranet) är den enda gränsen mot omvärlden. Inne i fabriken flyter allt i en tjock soppa (cytoplasman), och där ligger avdelningarna: ledningskontoret, kraftverket, arbetsbänkarna, löpande bandet, packcentralen och sopförbränningen.</p></div>
    <div class="box tr" data-t="membran" data-h="Djurcellens enda skydd">Djurcellen har ingen vägg, så cellmembranet är den enda gränsen mot omgivningen (bok s. 21). Hur membranet är byggt och vad det gör finns i {{go:k3|K3}}, och hur ämnen tar sig igenom i {{go:k5|K5}}.</div>
    <div class="box link"><p>Varje organell har en egen sektion i {{go:k4|K4 Organellerna}}, med bokens bild av djurcellen och alla 13 etiketter.</p></div>
    <div class="x" data-x="matchDef"></div>
  `},
  {id:"vaxtcell",h:"Växtcellen",nav:"Växtcellen",src:"PPT Bi2 bild 23–25 · s. 244–247",prov:true,html:`
    <p>En växtcell är i stort sett uppbyggd på samma sätt som en djurcell, men det finns några viktiga skillnader. Växtcellen har till skillnad från djurcellen en <b>cellvägg</b>, en <b>stor vakuol</b> och <b>kloroplaster</b>, men saknar de <b>lysosomer</b> och <b>centrioler</b> som finns i djurcellen. {{prov}} {{src:s. 244}}</p>
    <div class="lfig-h" data-fig="vaxt"></div>
    <h3>Cellväggen</h3>
    <p>Läraren: "Stödjande vägg av <b>cellulosa</b> (finns i växtceller)". {{lek:Bi2 bild 25}} Boken: växtcellen har en extracellulär matrix i form av en cellvägg av cellulosa. Den ger cellen dess <b>form</b> och <b>skyddar</b> den. Cellväggarna hänger ihop i ett nätverk och ger <b>stadga</b> åt växten, så att den kan stå upprätt. {{prov}} {{src:s. 244–245}}</p>
    <p>Cellväggen hindrar också cellen från att <b>spricka</b> när den tar upp vatten. En växtcell i en hypoton lösning, t.ex. destillerat vatten, spricker alltså inte, till skillnad från en djurcell. {{src:s. 245}} Genom kanaler i väggen, <b>plasmodesmata</b>, kan cellerna föra över ämnen till varandra. {{src:s. 245}}</p>
    <div class="box trap"><p>Växtcellen har <b>både</b> cellvägg och cellmembran. Cellmembranet ligger <b>innanför</b> väggen. Läraren kallar cellmembranet "yttre skydd" även i växtcellen, men det yttersta är cellväggen. {{diff}}</p></div>
    <h3>Vakuolen</h3>
    <p>Läraren: "Vakuol = en vätskefylld blåsa (<b>cellsaftrum</b>)". {{lek:Bi2 bild 25}} Boken: växtcellens vakuol kan uppta <b>upp till 90 %</b> av cellens volym. Den bildas hos äldre celler när många små vakuoler smälter samman, och den innehåller en vattenlösning med många lösta joner. {{prov}} {{src:s. 245}} Vakuolen innehåller också enzymer som kan spjälka makromolekyler, och därför fyller den ungefär samma funktion som djurcellens lysosomer. {{src:s. 246}}</p>
    <p>Vakuolen anpassar sin storlek så att cellen alltid fyller hela utrymmet innanför cellväggen. Därför upprätthåller den ett tryck mot cellväggarna, <b>turgor</b>, som gör att växten kan stå upprätt. Vid vattenbrist innehåller vakuolen för lite vatten, och växten slokar. {{prov}} {{src:s. 246}}</p>
    <ol class="chainv"><li>Vakuolen fylls med vatten.</li><li>Den trycker cellmembranet mot cellväggen.</li><li>Trycket, turgor, gör cellen spänd.</li><li>Växten står upprätt.</li></ol>
    <div class="box diff"><p><b>Boken (s. 246):</b> turgor gör att växten kan stå upprätt "trots att den saknar skelett och muskler".</p><p><b>Läraren (Bi2 bild 25):</b> vakuolen "utgör tillsammans med cellväggarna växternas skelett". Läraren använder ordet skelett bildligt. Idén är densamma: stödet kommer från vakuolens tryck mot cellväggen.</p></div>
    <h3>Kloroplasten</h3>
    <p>Läraren: kloroplasten "innehåller <b>klorofyll</b> som gör att växterna kan utnyttja ljusenergi (<b>fotosyntes</b>) från solen (växter och alger)". {{lek:Bi2 bild 25}} Boken: kloroplasterna hör till <b>plastiderna</b>, som bara finns i celler hos växter och alger. De har dubbla membran och eget DNA, liksom mitokondrien. {{prov}} {{src:s. 246–247}}</p>
    <p>Växtcellen har också <b>mitokondrier</b>, eftersom den behöver förbränna näring precis som djurcellen. {{prov}} {{lek:Bi2 bild 23–25}}</p>
    <div class="box key"><p>Växtcellen <b>har</b>: cellvägg (cellulosa), stor vakuol (cellsaftrum, turgor) och kloroplaster (klorofyll, fotosyntes). Den <b>saknar</b>: lysosomer och centrioler. {{prov}} {{src:s. 244}}</p></div>
    <div class="box lek"><p>Läraren visar två bilder av växtcellen. Bild 23 är tredimensionell med etiketterna cellkärna, "Vacuol", mitokondrie, "Kloroplast m. klorofyll", cellmembran, cellvägg och "Golgieapparat". Bild 24 är en läroboksbild där vakuolen fyller nästan hela cellen. Stavningarna "Vacuol" och "Golgieapparat" är fel. Skriv vakuol och golgiapparat. {{lek:Bi2 bild 23–24}}</p></div>
    <div class="box fab"><p>Växtcellen är den <b>gröna fabriken med mur</b>. Muren (cellväggen) håller formen, vattentanken (vakuolen) trycker utåt så att byggnaden står stadigt, och solkraftverken (kloroplasterna) gör egen energi av solljus. Fabriken har ändå vanliga kraftverk (mitokondrier) också.</p></div>
    <div class="box tr" data-t="vagg" data-h="Växtens mur">Växtcellens vägg är av cellulosa ({{go:k1.kolhydrater|K1}}) och ligger utanför cellmembranet. Bakterier har också en vägg, men av peptidoglykan ({{go:k8.byggnad|K8}}), och det är den som penicillin slår mot ({{go:k11|K11}}). Djurceller saknar vägg.</div>
    <div class="box tr" data-t="osmos" data-h="Väggen stoppar sprickan">I rent vatten strömmar vatten in i cellen genom osmos. En djurcell kan spricka ({{go:k5.osmos|K5}}), men växtcellens vägg tar emot trycket. Vakuolen blir full och ger turgor, så att växten står upprätt ({{go:k13.vakuolen|K13}}).</div>
    <div class="box link"><p>Allt om cellväggen, vakuolen och kloroplasten (tylakoider, granum, stroma, leukoplaster) finns i {{go:k13.vaxtcellen|K13 Växten och växtcellen}}.</p></div>
    <div class="x" data-x="chainVaxt"></div>
    <div class="x" data-x="fixVaxt"></div>
  `},
  {id:"jamfor",h:"Jämför de tre cellerna",nav:"Jämför",src:"PPT Bi2 bild 20–26 · s. 21, 180–181, 244",prov:true,html:`
    <p>Här är allt samlat. Djurcell och växtcell är båda eukaryoter och har därför samma grundutrustning. Bakterien är en prokaryot och saknar kärna och membranomslutna organeller. {{prov}}</p>
    <table class="cmp"><tr><th>Del</th><th>Djurcell</th><th>Växtcell</th><th>Bakterie</th></tr>
      <tr><td>Cellmembran</td><td>ja, enda skyddet</td><td>ja, innanför väggen</td><td>ja</td></tr>
      <tr><td>Cellvägg</td><td>nej</td><td>ja, cellulosa</td><td>ja, peptidoglykan</td></tr>
      <tr><td>Cellkärna</td><td>ja</td><td>ja</td><td>nej, DNA i cytoplasman</td></tr>
      <tr><td>Ribosomer</td><td>ja</td><td>ja</td><td>ja</td></tr>
      <tr><td>Mitokondrier</td><td>ja</td><td>ja</td><td>nej</td></tr>
      <tr><td>ER och golgi</td><td>ja</td><td>ja</td><td>nej</td></tr>
      <tr><td>Kloroplaster</td><td>nej</td><td>ja</td><td>nej (cyanobakterier gör ändå fotosyntes)</td></tr>
      <tr><td>Vakuol</td><td>små, andra funktioner</td><td>stor, upp till 90 %</td><td>nej</td></tr>
      <tr><td>Lysosomer</td><td>ja</td><td>nej (vakuolen gör jobbet)</td><td>nej</td></tr>
      <tr><td>Centrioler</td><td>ja</td><td>nej</td><td>nej</td></tr></table>
    <p class="small">Källor: djurcellen bok s. 21 och PPT bild 21–22, växtcellen bok s. 244–246 och PPT bild 23–25, bakterien bok s. 180–181.</p>
    <div class="box trick"><p>Växtens tre extra: <b>V</b>ägg, <b>V</b>attentank (vakuol), sol<b>K</b>raftverk (kloroplast), "<b>VVK</b>". Djurets två extra: <b>L</b>ysosomer och <b>C</b>entrioler, "<b>L</b>ejonets <b>C</b>irkus".</p></div>
    <div class="box trap"><p>Växtceller har mitokondrier. Kloroplasten ersätter inte kraftverket.</p><p>Både växter och bakterier har cellvägg, men av olika material: cellulosa respektive peptidoglykan.</p></div>
    <div class="box fab"><p>Tre byggnader: djurcellen är fabriken utan mur, växtcellen den gröna fabriken med mur, vattentank och solkraftverk, och bakterien verkstaden i ett enda rum med en egen mur av annat material.</p></div>
    <div class="x" data-x="sortDelar"></div>
    <div class="x" data-x="tfCell"></div>
    <div class="x" data-x="whoCell"></div>
  `}
  ],
  figs:{
    tre:{vb:"0 0 470 290",svg:figTre(),
      labels:[["bakterie",78,30,null,null,"m"],["djurcell",235,30,null,null,"m"],["växtcell",392,30,null,null,"m"],
        ["DNA utan kärna",78,74,72,136,"m"],["cellkärna",235,66,232,118,"m"],["cellvägg",392,66,392,92,"m"],
        ["prokaryot",78,236,null,null,"m"],["eukaryot",235,236,null,null,"m"],["eukaryot",392,236,null,null,"m"],
        ["ingen kärna",78,258,null,null,"m"],["med kärna",235,258,null,null,"m"],["med kärna",392,258,null,null,"m"]],
      parts:{bak:{t:"Bakterie (prokaryot)",d:"Saknar cellkärna och membranomslutna organeller. DNA ligger fritt i cytoplasman. Har cellmembran, ribosomer och en cellvägg av peptidoglykan (bok s. 180–181).",go:"k8.byggnad"},
        djur:{t:"Djurcell (eukaryot)",d:"Har cellkärna och organeller med membran, men ingen cellvägg. Cellmembranet är det enda skyddet (bok s. 21).",go:"k2.djurcell"},
        vaxt:{t:"Växtcell (eukaryot)",d:"Har cellkärna och organeller, och dessutom cellvägg av cellulosa, stor vakuol och kloroplaster (bok s. 244).",go:"k2.vaxtcell"}},
      cap:"Lärarens tre celltyper: prokaryota celler (bakterier och blågröna alger), eukaryota djurceller och eukaryota växtceller. Storlekarna är inte skalenliga. Tryck på cellerna.",src:"PPT Bi2 bild 20, 26 · bok s. 180"},
    org:{vb:"0 0 470 250",svg:figOrg(),
      labels:[["muskelcell",72,40,null,null,"m"],["muskelvävnad",236,40,null,null,"m"],["organ: hjärtat",400,40,null,null,"m"],
        ["en cell",72,206,null,null,"m"],["flera likadana|celler",236,206,null,null,"m"],["olika vävnader|tillsammans",400,206,null,null,"m"]],
      parts:{cell:{t:"Cell",d:"Livets minsta enhet. Muskelceller, nervceller och benceller är exempel på specialiserade celler (PPT bild 19)."},
        vav:{t:"Vävnad",d:"Flera likadana celler bildar en vävnad: muskelvävnad, nervvävnad, benvävnad (PPT bild 18–19)."},
        organ:{t:"Organ",d:"Olika vävnader kan tillsammans bilda ett organ, t.ex. hjärta, lever och lungor (PPT bild 18–19)."}},
      cap:"Cell → vävnad → organ. Muskelceller bildar muskelvävnad, som tillsammans med andra vävnader bygger upp hjärtat. Efter PPT Bi2 bild 18–19.",src:"PPT Bi2 bild 18–19"},
    djur:{vb:"0 0 480 400",svg:figDjur(),
      labels:[["cellmembran",8,58,186,62,"s"],["arvsmassa, DNA",8,112,222,140,"s"],["cellkärna",8,160,188,156,"s"],["lysosom",8,216,152,216,"s"],["golgiapparaten",8,290,156,280,"s"],
        ["cytoplasma",472,58,292,90,"e"],["mitokondrie",472,150,318,166,"e"],["endoplasmatiska|nätverket (ER)",472,206,290,196,"e"],["ribosomer",472,262,318,250,"e"],
        ["centrioler",256,392,256,282,"m"]],
      parts:{mem:DEF.mem,karna:DEF.karna,dna:DEF.dna,cyto:DEF.cyto,mito:DEF.mito,rib:DEF.rib,er:DEF.er,golgi:DEF.golgi,lyso:DEF.lyso,cent:DEF.cent},
      cap:"Djurcellens delar, \"en enkel bild\". Ritad efter PPT Bi2 bild 21, med centriolerna från bokens bild s. 21. Tryck på delarna för lärarens definitioner.",src:"PPT Bi2 bild 21–22 · bok s. 21"},
    vaxt:{vb:"0 0 480 380",svg:figVaxt(),
      labels:[["mitokondrie",8,34,70,144,"s"],["endoplasmatiska|nätverket (ER)",216,24,314,180,"s"],
        ["cellvägg",476,96,352,140,"e"],["cellmembran",476,128,345,164,"e"],["cellkärna",476,160,331,152,"e"],["ribosomer",476,214,326,226,"e"],["cytoplasma",476,250,312,250,"e"],["kloroplast",476,300,262,276,"e"],
        ["golgiapparaten",8,350,180,278,"s"],["vakuol",250,350,236,240,"m"]],
      parts:{vagg:DEF.vagg,mem:DEF.mem,cyto:DEF.cyto,vak:DEF.vak,karna:DEF.karna,er:DEF.er,rib:DEF.rib,klo:DEF.klo,mito:DEF.mito,golgi:DEF.golgi},
      cap:"Växtcellens delar. Den stora vakuolen fyller nästan hela cellen, och resten ligger i ett tunt lager cytoplasma längs kanten. Ritad efter PPT Bi2 bild 23–25 och bok s. 245.",src:"PPT Bi2 bild 23–25 · bok s. 245"}
  },
  ex:{
    sortTyp:{ty:"sort",h:"Prokaryot eller eukaryot?",cats:["Prokaryot","Eukaryot"],src:"PPT Bi2 bild 20, 26 · s. 178–181",items:[
      ["En bakterie",0,"Bakterier saknar cellkärna (s. 180)."],
      ["En cyanobakterie (\"blågrön alg\")",0,"Cyanobakterier är bakterier, alltså prokaryoter (s. 181), trots det gamla namnet."],
      ["En arké",0,"Arkéer saknar också cellkärna (s. 180)."],
      ["En muskelcell",1,"Djurceller har cellkärna."],
      ["En cell i ett blad",1,"Växtceller har cellkärna."],
      ["En encellig jästsvamp",1,"Jäst är en encellig eukaryot (s. 178)."],
      ["En encellig alg i havet",1,"Alger är eukaryoter med kloroplaster (s. 178)."],
      ["Malariaparasiten",1,"En encellig eukaryot (s. 178)."]]},
    orderOrg:{ty:"order",h:"Från cell till organ",intro:"Lägg nivåerna i ordning, från minst till störst.",src:"PPT Bi2 bild 18–19",items:["En muskelcell","Flera likadana muskelceller","Muskelvävnad","Muskelvävnad och andra vävnader tillsammans","Ett organ, t.ex. hjärtat"],why:"Likadana celler bildar en vävnad, och olika vävnader bildar tillsammans ett organ."},
    matchDef:{ty:"match",h:"Para ihop delen med lärarens definition",src:"PPT Bi2 bild 22, 25",pairs:[
      ["Cellmembran","Yttre skydd som släpper in och ut vissa ämnen"],["Cellkärna","Innehåller gener (arvsanlagen) som består av DNA"],["Cellplasma","Innehåller specialiserade celldelar samt mycket vatten"],
      ["Mitokondrie","Cellens kraftverk, energirik näring förbränns"],["Ribosomer","Här tillverkar cellen proteiner"],["ER","Membransystem som transporterar kemiska föreningar"],
      ["Cellvägg","Stödjande vägg av cellulosa"],["Vakuol","Vätskefylld blåsa (cellsaftrum)"],["Kloroplast","Innehåller klorofyll för fotosyntes"]]},
    chainVaxt:{ty:"chain",h:"Saknad länk: växtcellen och vattnet",src:"s. 245–246",items:[
      {h:"Turgor",steps:["Vakuolen fylls med vatten","Den trycker mot cellväggen","Trycket kallas turgor","Växten står upprätt"],b:1,w:["Cellväggen krymper","Cellmembranet löses upp"],why:"Bok s. 246: vakuolen upprätthåller trycket mot cellväggarna, turgor, som gör att växten kan stå upprätt."},
      {h:"Tulpanen slokar",steps:["Växten får för lite vatten","Vakuolerna innehåller för lite vatten","Trycket mot cellväggarna minskar","Växten slokar"],b:1,w:["Kloroplasterna slutar fungera","Cellväggen löses upp"],why:"Bokens bildtext till de slokande tulpanerna: \"Tomma vakuoler.\""},
      {h:"Destillerat vatten",steps:["Växtcellen hamnar i en hypoton lösning","Vatten strömmar in genom osmos","Cellväggen tar emot trycket","Cellen spricker inte"],b:2,w:["Vakuolen pumpar ut vattnet","Cellmembranet stoppar allt vatten"],why:"Bok s. 245: cellväggen hindrar cellen från att spricka, till skillnad från en djurcell."}]},
    fixVaxt:{ty:"fix",h:"Hitta felen i Oscars beskrivning av växtcellen",src:"s. 244–246 · PPT Bi2 bild 25",parts:[
      "Oscar skriver: Växtcellen har en cellvägg av ",["peptidoglykan","cellulosa","Peptidoglykan finns i bakteriernas cellvägg. Växtcellens vägg är av cellulosa."],
      ". Cellmembranet ligger ",["utanför cellväggen","innanför cellväggen","Cellväggen är det yttersta. Cellmembranet ligger innanför den."],
      ". Växtcellen har kloroplaster i stället för ",["mitokondrier","lysosomer och centrioler","Växtcellen har både kloroplaster och mitokondrier. Den saknar lysosomer och centrioler (s. 244)."],
      ". Vakuolen kan uppta upp till ",["10 %","90 %","Boken: upp till 90 % av cellens volym (s. 245)."]," av cellens volym och ger turgor, så att växten står upprätt."]},
    sortDelar:{ty:"sort",h:"Djurcell, växtcell eller båda?",cats:["Bara djurcell","Bara växtcell","Båda"],src:"s. 21, 244 · PPT Bi2 bild 21–25",items:[
      ["Cellvägg",1,"Växtcellens vägg är av cellulosa. Djurceller har ingen vägg."],["Kloroplast",1,"Bara hos växter och alger."],["Stor vakuol",1,"Upp till 90 % av växtcellens volym."],
      ["Lysosom",0,"Växtcellen saknar lysosomer. Vakuolen gör ungefär samma jobb."],["Centrioler",0,"Växtcellen saknar centrioler (s. 244)."],
      ["Mitokondrie",2,"Både djur- och växtceller förbränner näring."],["Cellkärna",2,"Båda är eukaryoter."],["Ribosomer",2,"Alla celler tillverkar proteiner."],["Cellmembran",2,"Alla celler har cellmembran."],["Golgiapparaten",2,"Finns i båda (PPT bild 21, 23, 24)."],["ER",2,"Finns i båda (PPT bild 22, 25)."]]},
    tfCell:{ty:"tf",h:"Sant eller falskt om cellerna",src:"PPT Bi2 bild 20–26 · s. 21, 180–181, 244–246",items:[
      ["En prokaryot cell saknar avgränsad cellkärna.",true,"PPT bild 26, bok s. 180."],
      ["Blågröna alger är eukaryoter.",false,"De är cyanobakterier, alltså prokaryoter (bok s. 181)."],
      ["Djurceller har en tunn cellvägg.",false,"Djurceller har ingen cellvägg. Cellmembranet är det enda skyddet (s. 21)."],
      ["Växtceller saknar mitokondrier.",false,"Växtceller har mitokondrier (PPT bild 23–25)."],
      ["En vävnad består av flera likadana celler.",true,"PPT bild 18."],
      ["Celler hos encelliga organismer är specialister.",false,"De är generalister och gör samtliga funktioner (PPT bild 20)."],
      ["En växtcell i destillerat vatten spricker inte.",true,"Cellväggen hindrar det (s. 245)."],
      ["Cellplasma och cytoplasma är samma sak.",true,"Läraren säger cellplasma, boken cytoplasma."]]},
    whoCell:{ty:"who",h:"Vem är jag?",src:"PPT Bi2 bild 20–25 · s. 21, 244–246",items:[
      {clues:["Jag kallas också cellsaftrum.","Jag kan ta upp till 90 % av cellens volym.","Utan mig slokar tulpanen."],a:"Vakuolen",w:["Kloroplasten","Lysosomen","Cellväggen"],why:"Vakuolen ger turgor (s. 245–246, PPT bild 25)."},
      {clues:["Jag finns i djurceller men inte i växtceller.","Jag är en membranblåsa.","Jag är cellens sopförbränning."],a:"Lysosomen",w:["Vakuolen","Mitokondrien","Golgiapparaten"],why:"Växtcellen saknar lysosomer (s. 244)."},
      {clues:["Jag kallades förr blågrön alg.","Jag gör fotosyntes.","Jag är en bakterie, alltså prokaryot."],a:"Cyanobakterien",w:["Grönalgen","Arkén","Kloroplasten"],why:"Bok s. 181."},
      {clues:["Jag är gjord av cellulosa.","Jag ligger utanför cellmembranet.","Jag hindrar växtcellen från att spricka."],a:"Cellväggen",w:["Cellmembranet","Vakuolen","Glykokalyx"],why:"Bok s. 244–245, PPT bild 25."}]}
  }
});
})();
