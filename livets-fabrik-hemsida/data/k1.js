/* K1 Livets molekyler. PPT Bi2 bild 3–16, 27–28 (livets kemi; bokens sidor om detta saknas i fotona) · bok s. 17–18, 21, 244, 247 · korsord kap 1. */
(function(){
"use strict";
const r1=n=>Math.round(n*10)/10;
const st=(f,s)=>`style="fill:var(${f})${s?";stroke:var("+s+")":""}"`;
const RAD=Math.PI/180;
function ln(d,col,w,extra){return `<path d="${d}" fill="none" style="stroke:var(${col})" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra||""}/>`}
function poly(pts,f,s,w){return `<polygon points="${pts.map(p=>r1(p[0])+","+r1(p[1])).join(" ")}" ${st(f,s)} stroke-width="${w||2}"/>`}
function ngon(cx,cy,r,n,rot){const p=[];for(let i=0;i<n;i++){const a=(rot||0)*RAD+i*2*Math.PI/n;p.push([cx+r*Math.cos(a),cy+r*Math.sin(a)])}return p}
function arr(x1,y1,x2,y2,col,w,hs){const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,h=hs||8;const bx=x2-ux*h,by=y2-uy*h,px=-uy*h*0.6,py=ux*h*0.6;
  return `<path d="M${r1(x1)} ${r1(y1)} L${r1(bx)} ${r1(by)}" fill="none" style="stroke:var(${col})" stroke-width="${w}" stroke-linecap="round"/><polygon points="${r1(x2)},${r1(y2)} ${r1(bx+px)},${r1(by+py)} ${r1(bx-px)},${r1(by-py)}" style="fill:var(${col})"/>`}
const TS='class="sm"';
/* Fettsyrakedja som sicksack. kinks = index på hörn där kedjan viker (dubbelbindning). dir i grader, turn = hur mycket den viker per dubbelbindning. */
function chain(x,y,n,kinks,o){o=o||{};const step=o.step||15,amp=o.amp||5,turn=(o.turn==null?28:o.turn);let a=(o.dir||0)*RAD,bx=x,by=y;const P=[[x,y]];
  for(let i=1;i<=n;i++){if(kinks.includes(i-1)&&i>1)a+=turn*RAD;bx+=step*Math.cos(a);by+=step*Math.sin(a);const s=(i%2?1:-1)*amp;P.push([bx-Math.sin(a)*s,by+Math.cos(a)*s])}
  return P}
function chainSVG(P,kinks,col,w,dcol){let d="M"+P.map(p=>r1(p[0])+" "+r1(p[1])).join(" L");let s=ln(d,col,w||2.2);
  kinks.forEach(k=>{const A=P[k],B=P[k+1];if(!A||!B)return;const dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy),nx=-dy/L*4.5,ny=dx/L*4.5;
    /* andra strecket i dubbelbindningen, på insidan */
    s+=ln(`M${r1(A[0]+dx*0.18+nx)} ${r1(A[1]+dy*0.18+ny)} L${r1(B[0]-dx*0.18+nx)} ${r1(B[1]-dy*0.18+ny)}`,dcol||col,w||2.2)});
  return s}

/* ---------- figur: en, två och många sockerringar (PPT Bi2 bild 5–7) ---------- */
function figSocker(){
  let s="";
  /* monosackarider */
  s+=`<g data-k="glu">${poly(ngon(236,64,24,6,30),"--c-chl-soft","--c-chl",2.5)}<circle cx="256.8" cy="52" r="4.5" ${st("--bad")}/></g>`;
  s+=`<g data-k="fru">${poly(ngon(372,66,22,5,-90),"--c-golgi","--c-golgi",1)}${poly(ngon(372,66,22,5,-90),"--c-wall-soft","--c-wall",2.5)}<circle cx="372" cy="44" r="4.5" ${st("--bad")}/></g>`;
  /* disackarid: sackaros */
  s+=`<g data-k="sack">${poly(ngon(250,168,24,6,30),"--c-chl-soft","--c-chl",2.5)}${ln("M274 172 L296 180 L318 172","--bad",2.5)}<circle cx="296" cy="180" r="4.5" ${st("--bad")}/>${poly(ngon(340,168,22,5,-90),"--c-wall-soft","--c-wall",2.5)}</g>`;
  /* polysackarid */
  let g=`<g data-k="poly">`;
  const xs=[206,254,302,350,398];
  xs.forEach((x,i)=>{g+=poly(ngon(x,262,19,6,30),"--c-chl-soft","--c-chl",2.2);if(i<xs.length-1){g+=ln(`M${x+19} ${262} L${x+29} ${262}`,"--bad",2.5)+`<circle cx="${x+24}" cy="262" r="3.5" ${st("--bad")}/>`}});
  g+=ln("M174 262 H186","--muted",2.5,' stroke-dasharray="3 4"')+ln("M418 262 H436","--muted",2.5,' stroke-dasharray="3 4"');
  s+=g+`</g>`;
  s+=ln("M6 112 H466 M6 214 H466","--line2",1.2,' stroke-dasharray="4 5"');
  return s}

/* ---------- figur: α- och β-glukos (PPT Bi2 bild 4) ---------- */
function ringFlat(cx,cy){/* Haworth-ring sedd snett: sexhörning, tillplattad */
  return [[cx-58,cy],[cx-30,cy-26],[cx+30,cy-26],[cx+58,cy],[cx+30,cy+24],[cx-30,cy+24]]}
function figGlukos(){
  let s="";
  [[120,"a"],[350,"b"]].forEach(([cx,k])=>{const R=ringFlat(cx,150);
    let g=`<g data-k="${k}">`+poly(R,"--c-chl-soft","--c-chl",2.5);
    g+=ln(`M${R[5][0]} ${R[5][1]} L${R[4][0]} ${R[4][1]}`,"--c-chl",6);
    g+=`<circle cx="${R[2][0]}" cy="${R[2][1]}" r="6" ${st("--bad")}/>`;
    /* CH2OH upp från kol 5 (vänster bak) */
    g+=ln(`M${R[1][0]} ${R[1][1]} V${R[1][1]-34}`,"--ink",2);
    /* kol 1 (höger): OH ned (α) eller upp (β) */
    const c1=R[3];
    if(k==="a"){g+=ln(`M${c1[0]} ${c1[1]} V${c1[1]+44}`,"--bad",3)+`<circle cx="${c1[0]}" cy="${c1[1]+50}" r="6" ${st("--bad")}/>`}
    else{g+=ln(`M${c1[0]} ${c1[1]} V${c1[1]-44}`,"--bad",3)+`<circle cx="${c1[0]}" cy="${c1[1]-50}" r="6" ${st("--bad")}/>`}
    /* övriga OH-grupper, neutrala */
    g+=ln(`M${R[4][0]} ${R[4][1]} V${R[4][1]+30}`,"--muted",2)+ln(`M${R[5][0]} ${R[5][1]} V${R[5][1]-26}`,"--muted",2)+ln(`M${R[0][0]} ${R[0][1]} V${R[0][1]+30}`,"--muted",2);
    s+=g+`</g>`});
  s+=`<text x="${120+70}" y="${150+5}" text-anchor="middle" class="lbs" style="font-size:14px">1</text><text x="${350+70}" y="${150+5}" text-anchor="middle" class="lbs" style="font-size:14px">1</text>`;
  return s}

/* ---------- figur: fettmolekyl = glycerol + tre fettsyror (PPT Bi2 bild 9–13) ---------- */
const FA=[{y:52,k:[],n:17},{y:136,k:[8],n:16},{y:206,k:[8,11],n:15}];
function figFett(){
  let s=`<g data-k="gly"><rect x="22" y="28" width="38" height="214" rx="10" ${st("--c-golgi","--c-golgi")} opacity=".25"/><rect x="22" y="28" width="38" height="214" rx="10" fill="none" style="stroke:var(--c-golgi)" stroke-width="2.5"/></g>`;
  FA.forEach((f,i)=>{const P=chain(60,f.y,f.n,f.k,{step:15,amp:5,turn:34});
    s+=`<g data-k="fa${i}">${chainSVG(P,f.k,"--ink",2.2,"--bad")}</g>`});
  return s}

/* ---------- figur: fosfolipid och dubbellager (PPT Bi2 bild 14 · bok s. 17–18) ---------- */
function lipid(x,y,up,kinked,sc){sc=sc||1;const dir=up?-90:90,h=up?-1:1;let s=`<circle cx="${x}" cy="${y}" r="${7*sc}" ${st("--c-mem")}/>`;
  const a=chain(x-3*sc,y+h*7*sc,8,[],{dir:dir,step:7*sc,amp:1.6*sc}),b=chain(x+3*sc,y+h*7*sc,8,kinked?[3]:[],{dir:dir,step:7*sc,amp:1.6*sc,turn:(up?-1:1)*-28});
  return s+chainSVG(a,[],"--c-mem",1.6*sc)+chainSVG(b,kinked?[3]:[],"--c-mem",1.6*sc)}
function figFosfo(){
  let s="";
  /* en stor fosfolipid till vänster */
  s+=`<g data-k="huvud"><circle cx="70" cy="92" r="24" ${st("--c-mem-soft","--c-mem")} stroke-width="3"/><text x="70" y="97" text-anchor="middle" class="lbs" style="font-size:14px">P</text></g>`;
  const A=chain(60,116,10,[],{dir:90,step:14,amp:4}),B=chain(80,116,10,[5],{dir:90,step:14,amp:4,turn:-26});
  s+=`<g data-k="svans">${chainSVG(A,[],"--c-mem",3)}${chainSVG(B,[5],"--c-mem",3,"--bad")}</g>`;
  /* dubbellager till höger */
  s+=`<rect x="196" y="96" width="268" height="120" ${st("--c-vac-soft")} opacity=".0"/>`;
  s+=`<rect x="196" y="40" width="268" height="40" ${st("--c-vac-soft")}/><rect x="196" y="234" width="268" height="40" ${st("--c-vac-soft")}/>`;
  let g=`<g data-k="lager">`;
  for(let i=0;i<12;i++){const x=206+i*22;g+=lipid(x,94,false,i%3===1)+lipid(x,218,true,i%4===2)}
  s+=g+`</g>`;
  /* kolesterol: små stela ringar mellan svansarna */
  s+=`<g data-k="kol">`+[[262,124],[372,176]].map(([x,y])=>`<rect x="${x-5}" y="${y-14}" width="10" height="28" rx="3" ${st("--c-golgi","--ink")} stroke-width="1"/>`).join("")+`</g>`;
  return s}

/* ---------- figur: nukleotiden och en nukleotidkedja (PPT Bi2 bild 27) ---------- */
const BASCOL={A:"--c-nuc",G:"--bad",C:"--c-golgi",T:"--c-vir",U:"--c-vir-soft"};
function nukl(x,y,b,sc){sc=sc||1;let s=`<circle cx="${x}" cy="${y}" r="${10*sc}" ${st("--c-chl-soft","--c-chl")} stroke-width="${1.6*sc}"/>`;
  s+=ln(`M${x+10*sc} ${y} L${x+22*sc} ${y}`,"--muted",2*sc);
  s+=poly(ngon(x+36*sc,y,14*sc,5,-90),"--c-chl","--c-chl",1);
  s+=ln(`M${x+50*sc} ${y} L${x+60*sc} ${y}`,"--muted",2*sc);
  const dbl=(b==="A"||b==="G");
  if(dbl){s+=poly(ngon(x+76*sc,y,14*sc,6,0),BASCOL[b],"--ink",1.2)+poly(ngon(x+98*sc,y,11*sc,5,180),BASCOL[b],"--ink",1.2)}
  else s+=poly(ngon(x+76*sc,y,14*sc,6,0),BASCOL[b],"--ink",1.2);
  s+=`<text x="${x+76*sc}" y="${y+5}" text-anchor="middle" class="lbs" style="font-size:14px;fill:var(--paper)">${b}</text>`;
  return s}
function figNukl(){
  let s=`<g data-k="fos"><circle cx="58" cy="150" r="22" ${st("--c-chl-soft","--c-chl")} stroke-width="3"/></g>`;
  s+=ln("M80 150 H104","--muted",3);
  s+=`<g data-k="soc">${poly(ngon(130,150,28,5,-90),"--c-chl","--c-chl",1)}</g>`;
  s+=ln("M156 150 H174","--muted",3);
  s+=`<g data-k="bas">${poly(ngon(200,150,26,6,0),"--c-nuc","--ink",1.5)}${poly(ngon(240,150,20,5,180),"--c-nuc","--ink",1.5)}<text x="200" y="156" text-anchor="middle" class="lbs" style="font-size:15px;fill:var(--paper)">A</text></g>`;
  /* kedja */
  let g=`<g data-k="kedja">`+ln("M318 56 L310 99 L318 128 L310 157 L318 186 L310 215 L318 244 L314 262","--muted",4);
  ["T","A","C","G"].forEach((b,i)=>{g+=nukl(314,70+i*58,b,0.9)});
  s+=g+`</g>`;
  return s}

G.def({
  id:"k1",
  src:{bok:"s. 17–18 (fosfolipider, fettsyror, kolesterol), s. 21 (glykogen), s. 244 (närsalter), s. 247 (stärkelse). Bokens sidor om livets kemi finns inte bland fotona.",ppt:"Bi2 bild 3–16, 27–28",ab:"Korsord kap 1 Cellkrysset (kolesterol, glykokalyx)"},
  threads:["membran","vagg","atp","ribosom"],
  goals:[
    "förklara vad celler består av: vatten, organiska ämnen (kolföreningar) och närsalter",
    "skilja på mono-, di- och polysackarider och ge exempel (glukos C₆H₁₂O₆, fruktos, sackaros, laktos, maltos, cellulosa, stärkelse)",
    "beskriva en fettmolekyl (glycerol + tre fettsyror) och förklara skillnaden mellan mättat, omättat och fleromättat fett",
    "förklara varför dubbelbindningar gör fett och cellmembran mer flytande, och varför ishavsfiskar har fleromättade fettsyror",
    "beskriva fosfolipidens hydrofila huvud och hydrofoba svans och hur de bildar ett dubbelt lager",
    "berätta vad proteiner gör och vad essentiella aminosyror är",
    "beskriva en nukleotid (fosfatgrupp, socker, kvävebas) och skillnaden mellan DNA och RNA"
  ],
  intro:`<p>Innan vi går in i cellfabriken tittar vi på byggmaterialet på lagret. Förutom vatten består cellerna mest av fyra sorters stora molekyler: kolhydrater, lipider, proteiner och nukleinsyror. Allt du senare möter, från cellmembranet till ATP-myntet, är byggt av dem.</p>
  <div class="box lek"><p>Läraren inleder Bi2 med "lite kort repetition" från Bi1. Bokens sidor om livets kemi finns inte bland fotona, så det mesta i kapitlet kommer från lärarens powerpoint. Det som också står i boken (fettsyrorna i membranet, fosfolipiderna, kolesterolet, cellulosa i cellväggen, stärkelse i potatis och närsalter) är märkt Provviktigt. {{lek:Bi2 bild 2}}</p></div>`,
  secs:[
  {id:"kemi",h:"Livets kemi",nav:"Livets kemi",src:"PPT Bi2 bild 3, 28 · s. 244",html:`
    <p>Förutom <b>vatten</b> består celler främst av <b>kolföreningar</b>, som också kallas <b>organiska ämnen</b>. De tre stora grupperna är <b>kolhydrater</b>, <b>lipider</b> och <b>proteiner</b>. {{lek:Bi2 bild 3}} Till dem kommer <b>nukleinsyrorna</b> (DNA och RNA), som byggs av nukleotider. {{lek:Bi2 bild 28}}</p>
    <p>Celler är också beroende av <b>oorganiska ämnen</b>, som kallas <b>närsalter</b> eller <b>mineralämnen</b>. {{lek:Bi2 bild 3}} Boken använder samma ord för växten. En växt måste ta upp kväve, fosfor och andra mineraler från omgivningen, och de ämnena kallas gemensamt för närsalter. {{prov}} {{src:s. 244}}</p>
    <div class="box key"><p><b>Organiska ämnen</b> = kolföreningar: kolhydrater, lipider, proteiner (och nukleinsyror).</p><p><b>Oorganiska ämnen</b> = <b>närsalter</b> (mineralämnen), till exempel kväve och fosfor. {{prov}}</p></div>
    <table class="cmp"><tr><th>Grupp</th><th>Byggs av</th><th>Exempel</th></tr>
      <tr><td>Kolhydrater</td><td>sockerringar (monosackarider)</td><td>glukos, sackaros, stärkelse, cellulosa</td></tr>
      <tr><td>Lipider</td><td>bland annat glycerol + fettsyror</td><td>fett, fosfolipider, kolesterol</td></tr>
      <tr><td>Proteiner</td><td>aminosyror (upp till 20 sorter)</td><td>hemoglobin, enzymer, vissa hormoner</td></tr>
      <tr><td>Nukleinsyror</td><td>nukleotider</td><td>DNA, RNA</td></tr></table>
    <div class="box fab"><p>Cellen är en fabrik, och de organiska ämnena är fabrikens byggmaterial. Kolhydraterna är bränsle och plankor, lipiderna är materialet i alla väggar, proteinerna är maskiner och arbetare, och nukleinsyrorna är ritningarna på ledningskontoret. Närsalterna är de små skruvar och muttrar som fabriken måste köpa in utifrån.</p></div>
    <div class="box trap"><p>"Organisk" betyder här kolförening, inte ekologisk. Närsalter är oorganiska, fast cellerna inte klarar sig utan dem.</p></div>
  `},
  {id:"kolhydrater",h:"Kolhydrater: sockerringar",nav:"Kolhydrater",src:"PPT Bi2 bild 4–7 · s. 21, 244, 247",lek:true,html:`
    <p>Ordet <b>kolhydrat</b> betyder kol + "hydrat" (vatten). Kolhydrater består alltså av <b>kol</b>, <b>väte</b> och <b>syre</b>. {{lek:Bi2 bild 4}} Molekylerna är ofta formade som enstaka eller hopkopplade ringar, som läraren kallar <b>sockerringar</b>. {{lek:Bi2 bild 5}}</p>
    <div class="lfig-h" data-fig="socker"></div>
    <h3>En sockerring: monosackarider</h3>
    <p><b>Monosackarider</b> är <b>enkla sockerarter</b> med en enda ring. Exempel är <b>druvsocker (glukos)</b>, C₆H₁₂O₆, och <b>fruktsocker (fruktos)</b>. De finns till exempel i bär, frukt och honung. {{lek:Bi2 bild 5}}</p>
    <div class="box key"><p>Glukos = druvsocker = <b>C₆H₁₂O₆</b> (6 kol, 12 väte, 6 syre). {{lek:Bi2 bild 5}}</p></div>
    <p>Glukos kan ritas som en rak kedja eller som en ring. I ringen finns två varianter, <b>α-glukos</b> och <b>β-glukos</b>. De skiljer sig bara i åt vilket håll OH-gruppen vid <b>kol 1</b> pekar: nedåt i α och uppåt i β. {{lek:Bi2 bild 4}}</p>
    <div class="lfig-h" data-fig="glukos"></div>
    <h3>Två sockerringar: disackarider</h3>
    <p>Enkla sockerarter kan kopplas ihop till <b>sammansatta sockerarter</b>. Två ringar kallas en <b>disackarid</b>. Tar man en ring glukos och en ring fruktos blir resultatet <b>sackaros</b>, som är vanligt socker (strösocker). Andra exempel är <b>mjölksocker (laktos)</b> och <b>maltsocker (maltos)</b>. {{lek:Bi2 bild 6}}</p>
    <h3>Många sockerringar: polysackarider</h3>
    <p><b>Polysackarider</b> är långa kedjor av sockerringar. Exempel är cellulosa och stärkelse. {{lek:Bi2 bild 7}}</p>
    <p><b>Cellulosa</b> ingår i växternas cellväggar. {{prov}} Människan kan inte bryta ner cellulosa, och därför passerar den genom tarmen som <b>kostfiber</b>. Kostfiber är ändå nyttiga, eftersom de motverkar förstoppning och ger mättnadskänsla. {{lek:Bi2 bild 7}}</p>
    <p><b>Stärkelse</b> är ett av våra viktigaste näringsämnen och finns till exempel i potatis. {{lek:Bi2 bild 7}} Boken berättar var stärkelsen sitter. Färglösa plastider, <b>leukoplaster</b>, lagrar stärkelse i de delar av växten som lagrar energi, till exempel potatisens stamknölar. {{prov}} {{src:s. 247}}</p>
    <ol class="chainv"><li>Cellulosa är en polysackarid i växternas cellväggar.</li><li>Människan kan inte bryta ner den.</li><li>Den passerar tarmen som kostfiber.</li><li>Kostfiber motverkar förstoppning och ger mättnadskänsla.</li></ol>
    <table class="cmp"><tr><th>Typ</th><th>Antal ringar</th><th>Exempel (vardagsnamn)</th></tr>
      <tr><td>Monosackarid</td><td>en</td><td>glukos (druvsocker), fruktos (fruktsocker)</td></tr>
      <tr><td>Disackarid</td><td>två</td><td>sackaros (strösocker), laktos (mjölksocker), maltos (maltsocker)</td></tr>
      <tr><td>Polysackarid</td><td>många</td><td>cellulosa (kostfiber), stärkelse (potatis)</td></tr></table>
    <div class="box trick"><p><b>Mono</b> = en (monolog), <b>di</b> = två (dialog), <b>poly</b> = många (polygon). Socker-ord slutar ofta på <b>-os</b>: glukos, fruktos, sackaros, laktos, maltos, cellulosa.</p><p><b>S</b>ackaros = <b>S</b>trösocker. <b>L</b>aktos = <b>L</b>ait (mjölk på franska). <b>M</b>altos = <b>M</b>alt.</p></div>
    <div class="box trap"><p>Sackaros är inte en monosackarid. Det är glukos + fruktos, alltså en disackarid.</p><p>Cellulosa och stärkelse är båda kedjor av glukos, men människan kan bara bryta ner stärkelse.</p></div>
    <div class="box link"><p>Kolhydrater finns på fler ställen i cellen. Levercellerna lagrar energi som <b>glykogen</b> i så kallade inklusionskroppar ({{go:k2.djurcell|djurcellen i K2}}, {{src:s. 21}}). På cellytan sitter korta sockerkedjor på lipider och proteiner och bildar <b>glykokalyx</b>, kolhydratlagret som täcker en eukaryot cell ({{go:k3.glykokalyx|K3}}, korsordet 8 vågrätt).</p></div>
    <div class="box tr" data-t="vagg" data-h="Cellulosa">Växtcellens vägg är byggd av polysackariden cellulosa ({{go:k13.cellvaggen|K13}}). Bakteriernas vägg är byggd av något annat, peptidoglykan, alltså kolhydratkedjor korsbundna med peptider ({{go:k8.byggnad|K8}}). Svamparnas vägg innehåller kitin.</div>
    <div class="box fab"><p>Sockerringarna är fabrikens bränsle och virke. Glukos är bränslet som skickas till kraftverket, stärkelse är bränsle på lager, och cellulosa är plankorna i den gröna fabrikens mur.</p></div>
    <div class="x" data-x="sortSocker"></div>
    <div class="x" data-x="matchSocker"></div>
  `},
  {id:"lipider",h:"Lipider och fett",nav:"Lipider och fett",src:"PPT Bi2 bild 8–13 · s. 18",prov:true,html:`
    <p><b>Lipider</b> är en grupp ämnen som är olösliga eller mycket svårlösliga i vatten. <b>Fetter</b> och <b>fosfolipider</b> är exempel. {{lek:Bi2 bild 8}}</p>
    <p>En <b>fettmolekyl</b> är byggd av <b>en glycerol</b> och <b>tre fettsyramolekyler</b>. Fettsyrorna domineras av en <b>lång kedja av kolatomer</b>. {{lek:Bi2 bild 9}} I ena änden av fettsyran sitter en <b>karboxylgrupp</b> (COOH), som lärarens strukturformler visar i rött. {{lek:Bi2 bild 11}}</p>
    <div class="lfig-h" data-fig="fett"></div>
    <h3>Mättat, omättat och fleromättat</h3>
    <p>Om det bara finns <b>enkelbindningar</b> mellan kolatomerna är fettet <b>mättat</b>. Kedjan blir rak, och därför kan molekylerna packas tätt. Mättat fett är <b>fast vid rumstemperatur</b>. Exempel är <b>animaliskt fett</b> och <b>kokosfett</b>. Mättat fett ökar risken för <b>åderförkalkning</b>. {{lek:Bi2 bild 10}}</p>
    <p>En fettsyra med en <b>dubbelbindning</b> mellan kolatomerna kallas <b>omättad</b>. Har den fler än en dubbelbindning kallas den <b>fleromättad</b>. Omättat fett är <b>flytande vid rumstemperatur</b>. Exempel är <b>vegetabiliskt fett</b> och <b>fiskfett</b>. Många anser att de är nyttigare än de mättade fetterna. {{lek:Bi2 bild 12}}</p>
    <p>Lärarens strukturformler visar varför. Vid dubbelbindningen får kedjan en <b>knyck</b>. En enkelomättad fettsyra har en knyck, och en fleromättad har flera och böjer mest. {{lek:Bi2 bild 11, 13}}</p>
    <table class="cmp"><tr><th></th><th>Mättat</th><th>Omättat / fleromättat</th></tr>
      <tr><td>Dubbelbindningar</td><td>inga, bara enkelbindningar</td><td>en / fler än en</td></tr>
      <tr><td>Kedjans form</td><td>rak</td><td>en knyck / flera knyckar</td></tr>
      <tr><td>Rumstemperatur</td><td>fast</td><td>flytande</td></tr>
      <tr><td>Exempel</td><td>animaliskt fett, kokosfett</td><td>vegetabiliskt fett, fiskfett</td></tr>
      <tr><td>Hälsa (PPT)</td><td>ökar risken för åderförkalkning</td><td>anses nyttigare av många</td></tr></table>
    <h3>Boken: varför knycken gör membranet flytande</h3>
    <p>Boken använder samma kemi för cellmembranet. Fosfolipider med <b>veckade, omättade fettsyror</b> hålls flytande vid en lägre temperatur än fosfolipider med <b>raka, mättade fettsyror</b>. {{prov}} {{src:s. 18}}</p>
    <ol class="chainv"><li>Omättad fettsyra har en eller flera dubbelbindningar.</li><li>Fettsyrasvansen blir veckad.</li><li>Avståndet mellan molekylerna blir större.</li><li>De redan svaga <b>van der Waals-krafterna</b> mellan molekylerna blir ännu svagare.</li><li>Membranet förblir flytande även vid lägre temperatur.</li></ol>
    <p>Därför har <b>ishavsfisk</b> ovanligt mycket <b>fleromättade fettsyror</b> i sina cellmembran. Det kalla vattnet skulle annars göra att membranen stelnade och slutade fungera. {{prov}} {{src:s. 18}}</p>
    <p>Även <b>längden</b> på fettsyrekedjorna påverkar. Ju längre fettsyror, desto större yta för van der Waals-krafterna att verka på, och desto mer trögflytande blir membranet. {{src:s. 18}}</p>
    <div class="w" data-w="k1Fett"></div>
    <div class="box trick"><p><b>Mättad = mätt och rak.</b> Kedjan är "full" av väte och har inga dubbelbindningar, så den ligger rak och packas tätt som tändstickor i en ask. Omättad = knyckig, så molekylerna står glest och glider lätt, som en hög med böjda gafflar.</p></div>
    <div class="box trap"><p>Dubbelbindningen sitter mellan två <b>kolatomer</b> i kedjan. Omättat betyder inte att det saknas fettsyror. Det är fortfarande glycerol + tre fettsyror.</p><p>Fleromättat = <b>fler än en</b> dubbelbindning. Enkelomättat = exakt en.</p></div>
    <div class="box fab"><p>Fettet är fabrikens väggmaterial och reservtank. Raka, mättade kedjor staplas tätt som tegel och blir en stel vägg. Knyckiga, omättade kedjor ligger glest och gör väggen mjuk och rörlig, vilket ishavsfisken behöver för att fabriksväggarna inte ska frysa fast.</p></div>
    <div class="box tr" data-t="membran" data-h="Fettsyrorna styr flytet">Fettsyrornas form avgör hur flytande cellmembranet är: knyckiga omättade svansar ger ett lättflytande membran, raka mättade ett trögt ({{go:k3.uppbyggnad|K3}}). Kolesterolet hjälper djurcellens membran att hålla sig lagom flytande.</div>
    <div class="x" data-x="tfFett"></div>
    <div class="x" data-x="chainFett"></div>
  `},
  {id:"fosfolipider",h:"Fosfolipider och kolesterol",nav:"Fosfolipider",src:"PPT Bi2 bild 14 · s. 17–18, 36 · korsord 9 vågrätt",prov:true,html:`
    <p><b>Fosfolipider</b> är lipider som tillsammans med en mindre mängd <b>kolesterol</b> bygger upp cellernas membran. {{prov}} En fosfolipid har ett <b>hydrofilt huvud</b> med en <b>fosfatgrupp</b> och en <b>hydrofob svans</b>. Det betyder förenklat att huvudet är vattenlösligt och svansen fettlöslig. {{prov}} {{lek:Bi2 bild 14}}</p>
    <div class="lfig-h" data-fig="fosfo"></div>
    <p>Boken beskriver hur de bildar cellmembranet. Grunden är ett <b>dubbelt lager av fosfolipider</b> med fettsyrasvansarna riktade mot varandra och de hydrofila huvudena pekande utåt, mot cellens inre och yttre miljö. Huvudena vänder sig mot vattnet eftersom de är vattenlösliga, och svansarna gömmer sig inne i lagret eftersom de är fettlösliga. {{prov}} {{src:s. 17}}</p>
    <p>Därför får membranet ett <b>fettälskande och vattenhatande inre</b>. Fettlösliga ämnen kan passera fritt, medan vattenlösliga ämnen behöver transportproteiner. {{src:s. 17}}</p>
    <p>Fosfolipiderna och proteinerna glider ständigt runt varandra. Membranet är som en <b>tvådimensionell vätska</b>. {{src:s. 17}}</p>
    <div class="box key"><p><b>Fosfolipid</b>: hydrofilt huvud (fosfatgrupp, vattenlösligt) + hydrofob svans (fettsyror, fettlöslig). I membranet: dubbelt lager, svansarna inåt mot varandra, huvudena utåt mot vattnet. {{prov}}</p><p><b>Kolesterol</b>: en steroid i djurcellers cellmembran som hjälper membranet att hålla sig <b>lagom flytande</b>. {{prov}} {{src:s. 18}}</p></div>
    <div class="box diff"><p><b>Boken</b> talar om fosfolipider som lipider i membranet. <b>Läraren</b> kallar dem "en grupp av fetter" på bild 14 men "lipider" på bild 8. Säg helst lipider, eftersom fett i strikt mening är glycerol + tre fettsyror. {{diff}}</p></div>
    <h3>LDL och HDL</h3>
    <p>Kolesterol transporteras i blodet. <b>Boken</b> förklarar att kolesterol då paketeras med protein till vattenlösliga partiklar. <b>LDL</b> innehåller mer kolesterol i förhållande till protein och kallas ibland "det onda kolesterolet". <b>HDL</b> transporterar överskott av kolesterol från vävnaderna till levern, där det bryts ner, och kallas lite slarvigt "det goda kolesterolet". {{prov}} {{src:s. 36}}</p>
    <div class="box diff"><p><b>Boken (s. 36):</b> LDL och HDL är <i>partiklar</i> av kolesterol + protein. HDL för överskottskolesterol till levern.</p><p><b>Läraren (Bi2 bild 14):</b> "Olika typer av kolesterol. LDL: det dåliga kolesterolet, fastnar på kärlets väggar om det finns för mycket. HDL: det goda kolesterolet, hjälper till att transportera bort fett från blodet." På provet: använd bokens formulering.</p></div>
    <div class="box trap"><p>Huvudet är <b>hydrofilt</b> (vattenälskande) och svansen <b>hydrofob</b> (vattenskyende). Lätt att vända på! Tänk "fil" = vän, "fob" = rädd.</p><p>LDL och HDL är inte två sorters kolesterol enligt boken, utan två sorters transportpartiklar.</p></div>
    <div class="box fab"><p>Fosfolipiderna är tegelstenarna i fabrikens tullgräns. Varje tegelsten har en vattenvänlig framsida och en fet baksida, och i muren vänds baksidorna mot varandra. Kolesterolet är bruket som gör att muren varken blir för mjuk eller för stel.</p></div>
    <div class="box link"><p>Hela membranets byggnad, med proteiner och sockerkedjor, finns i {{go:k3.uppbyggnad|K3 Cellmembranet}}. Hur LDL tas upp med endocytos finns i {{go:k5.ldl|K5}}.</p></div>
    <div class="box tr" data-t="membran" data-h="Huvud ut, svans in">Fosfolipidens hydrofila huvud och hydrofoba svans förklarar varför den bildar ett dubbelt lager i vatten ({{go:k3.uppbyggnad|K3}}). Samma dubbla lager omger organellerna ({{go:k4|K4}}) och bakterier ({{go:k8.byggnad|K8}}), och det gör att fettlösliga ämnen passerar fritt men inte joner ({{go:k5.genom|K5}}).</div>
    <div class="x" data-x="clozeFosfo"></div>
  `},
  {id:"proteiner",h:"Proteiner",nav:"Proteiner",src:"PPT Bi2 bild 15–16, 22 · s. 18, 23",lek:true,html:`
    <p><b>Proteiner</b> är ett viktigt <b>byggmaterial</b> till cellerna. Vissa <b>hormoner</b> och <b>enzymer</b> består av proteiner, och det röda blodfärgämnet <b>hemoglobin</b> är ett protein. {{lek:Bi2 bild 15}}</p>
    <p>Ett protein består av upp till <b>20 olika sorters aminosyror</b> som är sammanlänkade i en viss ordning. {{lek:Bi2 bild 15}} Ordningen avgör vilket protein det blir, ungefär som bokstävernas ordning avgör vilket ord det blir.</p>
    <p>Cellerna kan tillverka <b>12</b> av de 20 aminosyrorna. De övriga <b>8</b> måste ingå i födan, och de kallas <b>essentiella aminosyror</b>. Mat som innehåller mycket protein är till exempel ägg, fisk, mjölk, ärtor och bönor. {{lek:Bi2 bild 16}}</p>
    <div class="box key"><p>Protein = kedja av <b>aminosyror</b> (upp till 20 sorter) i en viss ordning. 12 kan cellen tillverka, 8 är <b>essentiella</b> och måste fås via maten. {{lek:Bi2 bild 15–16}}</p></div>
    <p>Proteinerna tillverkas på <b>ribosomerna</b>. {{prov}} Läraren skriver "Ribosomer = Här tillverkar cellen proteiner", och boken kallar ribosomerna platsen för proteinsyntesen. {{lek:Bi2 bild 22}} {{src:s. 23}}</p>
    <p>I cellmembranet sitter proteiner som transporterar ämnen, fungerar som enzymer eller receptorer och kopplar ihop celler. {{src:s. 18}}</p>
    <table class="cmp"><tr><th>Proteinets roll</th><th>Exempel</th><th>Källa</th></tr>
      <tr><td>Byggmaterial</td><td>proteiner i cellerna</td><td>PPT bild 15</td></tr>
      <tr><td>Transport i blodet</td><td>hemoglobin (blodfärgämnet)</td><td>PPT bild 15</td></tr>
      <tr><td>Styrning</td><td>vissa hormoner</td><td>PPT bild 15</td></tr>
      <tr><td>Kemiska reaktioner</td><td>enzymer</td><td>PPT bild 15, bok s. 18</td></tr>
      <tr><td>I membranet</td><td>transportproteiner, receptorer</td><td>bok s. 18</td></tr></table>
    <div class="box diff"><p><b>Läraren</b> säger 8 essentiella aminosyror (12 + 8 = 20). Många nyare källor räknar med 9 för vuxna. Bokens sidor tar inte upp detta. Följ lärarens siffra på provet om frågan gäller lektionen. {{diff}}</p></div>
    <div class="box trick"><p><b>12 + 8 = 20.</b> "Tolv gör jag själv, åtta köper jag i affären."</p></div>
    <div class="box trap"><p>Aminosyran är byggstenen, proteinet är kedjan. Essentiell betyder att cellen <b>inte</b> kan tillverka den, inte att den är viktigast.</p></div>
    <div class="box fab"><p>Proteinerna är fabrikens maskiner och arbetare. De byggs vid arbetsbänken (ribosomen) efter ritningen från ledningskontoret, en aminosyra i taget i rätt ordning.</p></div>
    <div class="box tr" data-t="ribosom" data-h="Där proteinerna byggs">Alla proteiner, från hemoglobin till enzymer, byggs på ribosomerna ({{go:k4.ribosomer|K4}}). Bakterier har också ribosomer, men av en annan sort, och det utnyttjar vissa antibiotika ({{go:k11|K11}}).</div>
    <div class="x" data-x="whoMol"></div>
  `},
  {id:"nukleotider",h:"Nukleotider: byggstenar i DNA och RNA",nav:"Nukleotider",src:"PPT Bi2 bild 27–28 · s. 22",lek:true,html:`
    <p>Utöver kolhydrater, lipider och proteiner finns <b>nukleinsyror</b> och andra molekyler med nyckelfunktioner i cellens liv. <b>Nukleotider</b> har två roller: de <b>bygger upp nukleinsyror</b> och de är <b>energibärare</b>. {{lek:Bi2 bild 28}}</p>
    <p>En nukleotid har tre delar: en <b>fosfatgrupp</b>, en <b>monosackarid</b> (sockret <b>ribos</b> eller <b>deoxiribos</b>) och en <b>kvävebas</b>. {{lek:Bi2 bild 27}}</p>
    <div class="lfig-h" data-fig="nukl"></div>
    <p>Det finns fem kvävebaser. <b>Adenin (A)</b> och <b>guanin (G)</b> är dubbelringar. <b>Cytosin (C)</b>, <b>tymin (T)</b> och <b>uracil (U)</b> är enkelringar. Tymin liknar uracil men har en extra CH₃-grupp. {{lek:Bi2 bild 27}}</p>
    <p><b>Deoxiribos</b> har ett H i stället för ett OH på ett av kolen, alltså en syreatom mindre än ribos ("de-oxi" = utan syre). {{lek:Bi2 bild 27}} Nukleotider kopplas ihop till långa kedjor, där fosfat och socker bildar ryggraden och baserna sticker ut.</p>
    <table class="cmp"><tr><th></th><th>DNA</th><th>RNA</th></tr>
      <tr><td>Socker</td><td>deoxiribos</td><td>ribos</td></tr>
      <tr><td>Kvävebaser</td><td>A, T, C, G</td><td>A, U, C, G</td></tr></table>
    <p class="small">Att T bara finns i DNA och U bara i RNA står inte i text på bilden, men följer av lärarens figur (kedjan med T är DNA). {{extra}}</p>
    <p>Boken nämner att nukleoplasman i cellkärnan innehåller nukleotider, och att nästan all arvsmassa (DNA) finns i kärnan. {{src:s. 22}}</p>
    <div class="box key"><p><b>Nukleotid</b> = fosfatgrupp + socker (ribos eller deoxiribos) + kvävebas (A, G, C, T eller U). Nukleotider bygger nukleinsyror (DNA, RNA) och fungerar som energibärare (ATP). {{lek:Bi2 bild 27–28}}</p></div>
    <div class="box trick"><p>Dubbelringarna är <b>A</b> och <b>G</b>: "<b>A</b>lla <b>G</b>rodor är stora". T i DNA byts mot U i RNA: "<b>T</b> för <b>T</b>vå strängar (DNA), <b>U</b> för <b>U</b>tskick (RNA)".</p></div>
    <div class="box trap"><p>Nukleotid är byggstenen, nukleinsyra är kedjan (DNA eller RNA). Deoxiribos hör till DNA, ribos till RNA och ATP.</p></div>
    <div class="box link"><p>Den viktigaste energibäraren är <b>ATP</b>, adenosintrifosfat: adenin + ribos + tre fosfatgrupper. När den tredje fosfatgruppen lossnar frigörs energi. Mer i {{go:k6|K6 Energin: ATP}}.</p></div>
    <div class="box tr" data-t="atp" data-h="ATP är en nukleotid">ATP byggs av samma delar som en RNA-nukleotid: kvävebasen adenin, sockret ribos och fosfatgrupper, men med tre fosfat i rad. Det är fabrikens mynt ({{go:k6|K6}}) och betalar bland annat natrium-kaliumpumpen ({{go:k5.pumpen|K5}}).</div>
    <div class="box fab"><p>Nukleotiderna är bokstäverna i fabrikens ritningar på ledningskontoret. Fyra bokstäver (A, T, C, G) räcker för att skriva alla ritningar. En nukleotid med tre fosfat, ATP, är dessutom fabrikens mynt.</p></div>
    <div class="x" data-x="mcNukl"></div>
    <div class="x" data-x="fixMol"></div>
  `}
  ],
  figs:{
    socker:{vb:"0 0 470 300",svg:figSocker(),
      labels:[["monosackarid|en ring",8,46,null,null,"s"],["disackarid|två ringar",8,150,null,null,"s"],["polysackarid|många ringar",8,244,null,null,"s"],
        ["glukos",236,104,236,88,"m"],["fruktos",372,104,372,88,"m"],["syreatom i ringen",440,30,260,50,"e"],
        ["glukos + fruktos = sackaros",296,206,296,184,"m"],["cellulosa, stärkelse",306,294,306,282,"m"]],
      parts:{glu:{t:"Glukos (druvsocker)",d:"Monosackarid, C₆H₁₂O₆. En sexring med fem kol och en syreatom. Enkel sockerart som finns i bär, frukt och honung. PPT Bi2 bild 5."},
        fru:{t:"Fruktos (fruktsocker)",d:"Monosackarid. Ritas som en femring när den sitter i sackaros. PPT Bi2 bild 5–6."},
        sack:{t:"Sackaros (strösocker)",d:"Disackarid: en ring glukos + en ring fruktos, ihopkopplade med en syrebrygga. Andra disackarider är laktos (mjölksocker) och maltos (maltsocker). PPT Bi2 bild 6."},
        poly:{t:"Polysackarid",d:"Många sockerringar i en kedja. Cellulosa (växternas cellväggar, kostfiber) och stärkelse (potatis). PPT Bi2 bild 7.",go:"k13.cellvaggen"}},
      cap:"En, två och många sockerringar. Röd prick = syreatom. Ritad efter PPT Bi2 bild 5–7. Tryck på molekylerna.",src:"PPT Bi2 bild 5–7"},
    glukos:{vb:"0 0 470 260",svg:figGlukos(),
      labels:[["α-glukos",120,22,null,null,"m"],["β-glukos",350,22,null,null,"m"],["OH nedåt vid kol 1",120,248,172,204,"m"],["OH uppåt vid kol 1",466,62,410,94,"e"],
        ["CH₂OH",62,96,90,90,"e"],["syreatom",250,96,156,124,"m"]],
      parts:{a:{t:"α-glukos",d:"OH-gruppen vid kol 1 pekar nedåt. Lärarens bild 4 markerar den med en röd pil."},b:{t:"β-glukos",d:"OH-gruppen vid kol 1 pekar uppåt. Annars är molekylen likadan som α-glukos. Cellulosa ritas som en kedja där ringarna är växelvis vända."}},
      cap:"α- och β-glukos skiljer sig bara i riktningen på OH-gruppen vid kol 1 (röd). Den tjocka kanten är ringens framsida. Efter PPT Bi2 bild 4.",src:"PPT Bi2 bild 4"},
    fett:{vb:"0 0 470 300",svg:figFett(),
      labels:[["glycerol",41,270,41,244,"m"],["mättad fettsyra|bara enkelbindningar, rak",130,22,null,null,"s"],
        ["enkelomättad|en knyck",336,120,null,null,"s"],["fleromättad|två knyckar",336,226,null,null,"s"],
        ["dubbelbindning",112,104,186,132,"s"],["lång kolkedja",300,88,280,58,"m"]],
      parts:{gly:{t:"Glycerol",d:"En fettmolekyl är byggd av en glycerol och tre fettsyramolekyler. PPT Bi2 bild 9."},
        fa0:{t:"Mättad fettsyra",d:"Bara enkelbindningar mellan kolatomerna. Kedjan är rak och packas tätt, och därför är mättat fett fast vid rumstemperatur (animaliskt fett, kokosfett)."},
        fa1:{t:"Enkelomättad fettsyra",d:"En dubbelbindning ger en knyck. Molekylerna packas glesare, och fettet är flytande vid rumstemperatur."},
        fa2:{t:"Fleromättad fettsyra",d:"Flera dubbelbindningar ger flera knyckar. Ishavsfisk har mycket fleromättade fettsyror så att cellmembranen inte stelnar i kylan (bok s. 18).",go:"k3.uppbyggnad"}},
      cap:"En fettmolekyl: glycerol + tre fettsyror. Här har varje fettsyra olika mättnad för att visa skillnaden. Röda streck = andra halvan av dubbelbindningen. Efter PPT Bi2 bild 9–13.",src:"PPT Bi2 bild 9–13 · bok s. 18"},
    fosfo:{vb:"0 0 470 310",svg:figFosfo(),
      labels:[["hydrofilt huvud|med fosfatgrupp",8,26,58,72,"s"],["hydrofob svans|(fettsyror)",8,276,62,240,"s"],["knyck = omättad",132,236,96,200,"s"],
        ["vatten (utsida)",330,32,null,null,"m"],["vatten (insida)",330,298,null,null,"m"],["dubbelt lager",466,150,null,null,"e"],["kolesterol",188,156,256,128,"e"]],
      parts:{huvud:{t:"Hydrofilt huvud",d:"Huvudet har en fosfatgrupp och är vattenlösligt. Därför vänder det sig mot vattnet på båda sidor om membranet."},
        svans:{t:"Hydrofob svans",d:"Två fettsyror. De är fettlösliga, och därför gömmer de sig inne i lagret, med svansarna mot varandra. En omättad svans har en knyck."},
        lager:{t:"Dubbelt lager",d:"Bok s. 17: det dubbla lagret av fosfolipider med fettsyrasvansarna riktade mot varandra och de hydrofila huvudena utåt, mot cellens inre och yttre miljö.",go:"k3.uppbyggnad"},
        kol:{t:"Kolesterol",d:"En steroid som finns i djurcellers membran och hjälper membranet att hålla sig lagom flytande (bok s. 18, korsord 9 vågrätt)."}},
      cap:"En fosfolipid (till vänster) och det dubbla lagret i cellmembranet (till höger). Efter PPT Bi2 bild 14 och bok s. 17–18.",src:"PPT Bi2 bild 14 · bok s. 17–18"},
    nukl:{vb:"0 0 470 290",svg:figNukl(),
      labels:[["fosfatgrupp",58,110,58,128,"m"],["monosackarid|(ribos eller|deoxiribos)",130,214,130,178,"m"],["kvävebas|(A, G, C, T, U)",8,30,198,124,"s"],
        ["en nukleotid",130,268,null,null,"m"],["nukleotidkedja|(DNA)",466,30,null,null,"e"],["ryggrad:|fosfat + socker",300,226,314,200,"e"]],
      parts:{fos:{t:"Fosfatgrupp",d:"En fosfor omgiven av syreatomer. Fosfatgrupperna binder ihop nukleotiderna i kedjan. ATP har tre fosfatgrupper i rad."},
        soc:{t:"Monosackarid",d:"En femring: ribos i RNA och ATP, deoxiribos i DNA. Deoxiribos har ett H i stället för ett OH på ett kol."},
        bas:{t:"Kvävebas",d:"Adenin och guanin är dubbelringar. Cytosin, tymin och uracil är enkelringar. T finns i DNA, U i RNA."},
        kedja:{t:"Nukleotidkedja",d:"Nukleotiderna kopplas ihop till en nukleinsyra. Här T, A, C, G, som i lärarens figur."}},
      cap:"En nukleotid (till vänster) och en kedja av nukleotider (till höger). Efter PPT Bi2 bild 27.",src:"PPT Bi2 bild 27"}
  },
  ex:{
    sortSocker:{ty:"sort",h:"En, två eller många ringar?",cats:["Monosackarid","Disackarid","Polysackarid"],src:"PPT Bi2 bild 5–7",items:[
      ["Glukos (druvsocker)",0,"En sockerring, C₆H₁₂O₆."],["Fruktos (fruktsocker)",0,"En sockerring, enkel sockerart i frukt och honung."],
      ["Sackaros (strösocker)",1,"Glukos + fruktos, alltså två ringar."],["Laktos (mjölksocker)",1,"Läraren ger laktos som exempel på disackarid."],["Maltos (maltsocker)",1,"Disackarid enligt bild 6."],
      ["Cellulosa",2,"Många ringar. Finns i växternas cellväggar."],["Stärkelse",2,"Många ringar. Finns i potatis."],["Glykogen i levercellerna",2,"Lagrad energi i levern, en lång kedja av glukos (bok s. 21)."]]},
    matchSocker:{ty:"match",h:"Para ihop vardagsnamnet med det kemiska namnet",src:"PPT Bi2 bild 5–7",pairs:[["Druvsocker","Glukos"],["Fruktsocker","Fruktos"],["Strösocker","Sackaros"],["Mjölksocker","Laktos"],["Maltsocker","Maltos"],["Kostfiber","Cellulosa"]]},
    tfFett:{ty:"tf",h:"Sant eller falskt om fett",src:"PPT Bi2 bild 9–13 · s. 18",items:[
      ["En fettmolekyl består av en glycerol och tre fettsyror.",true,"PPT bild 9."],
      ["Mättat fett har en eller flera dubbelbindningar.",false,"Mättat fett har bara enkelbindningar. Dubbelbindningar gör fettet omättat."],
      ["Omättat fett är flytande vid rumstemperatur.",true,"Knyckarna gör att molekylerna inte kan packas tätt."],
      ["Kokosfett är ett exempel på omättat fett.",false,"Läraren ger kokosfett som exempel på mättat fett, tillsammans med animaliskt fett."],
      ["Ishavsfisk har mycket fleromättade fettsyror i sina cellmembran.",true,"Annars skulle membranen stelna i det kalla vattnet (bok s. 18)."],
      ["Längre fettsyror ger ett mer lättflytande membran.",false,"Längre fettsyror ger större yta för van der Waals-krafterna och därför ett mer trögflytande membran (bok s. 18)."],
      ["Fleromättat betyder fler än en dubbelbindning.",true,"PPT bild 12."]]},
    chainFett:{ty:"chain",h:"Saknad länk: från dubbelbindning till flytande membran",src:"s. 18",items:[
      {h:"Omättat membran",steps:["Fettsyran har dubbelbindningar","Svansen blir veckad","Avståndet mellan molekylerna blir större","Van der Waals-krafterna blir svagare","Membranet är flytande även vid låg temperatur"],b:2,w:["Molekylerna packas tätare","Fettsyran blir längre"],why:"Bok s. 18: veckade svansar ger större avstånd, och då blir de redan svaga van der Waals-krafterna ännu svagare."},
      {h:"Ishavsfisken",steps:["Vattnet är mycket kallt","Raka fettsyror skulle göra membranen stela","Fisken har mycket fleromättade fettsyror","Membranen förblir flytande och fungerar"],b:2,w:["Fisken har mycket mättade fettsyror","Fisken har extra långa fettsyror"],why:"Fleromättade fettsyror har flera knyckar och håller membranet flytande i kylan."},
      {h:"Kostfiber",steps:["Cellulosa finns i växternas cellväggar","Människan kan inte bryta ner cellulosa","Den passerar tarmen som kostfiber","Motverkar förstoppning och ger mättnadskänsla"],b:1,w:["Cellulosa bryts ner till glukos i tarmen","Cellulosa lagras i levern"],why:"PPT Bi2 bild 7."}]},
    clozeFosfo:{ty:"cloze",h:"Fyll i: fosfolipiden",src:"PPT Bi2 bild 14 · s. 17–18",bank:true,
      text:"En fosfolipid har ett [[hydrofilt|vattenälskande]] huvud med en [[fosfatgrupp|fosfat]] och en [[hydrofob|vattenskyende|fettlöslig]] svans. I cellmembranet bildar fosfolipiderna ett [[dubbelt|dubbel]] lager där svansarna pekar [[mot varandra|inåt]]. I djurcellers membran finns också [[kolesterol]], som hjälper membranet att hålla sig lagom flytande."},
    whoMol:{ty:"who",h:"Vem är jag?",src:"PPT Bi2 bild 4–16, 27",items:[
      {clues:["Jag är en kedja av upp till 20 sorters byggstenar.","Jag finns i dina röda blodkroppar.","Jag är det röda blodfärgämnet."],a:"Hemoglobin",w:["Kolesterol","Cellulosa","Glykogen"],why:"Hemoglobin är ett protein (PPT bild 15)."},
      {clues:["Jag består av många sockerringar.","Människan kan inte bryta ner mig.","Jag sitter i växternas cellväggar och kallas kostfiber."],a:"Cellulosa",w:["Stärkelse","Sackaros","Laktos"],why:"Cellulosa är en polysackarid i växternas cellväggar (PPT bild 7, bok s. 244)."},
      {clues:["Jag är en steroid.","Jag sitter mellan fosfolipiderna.","Jag håller djurcellens membran lagom flytande."],a:"Kolesterol",w:["Fosfatgruppen","Glycerol","Hemoglobin"],why:"Bok s. 18 och korsordet 9 vågrätt."},
      {clues:["Jag är en kvävebas.","Jag är en dubbelring.","Jag finns i både DNA, RNA och ATP och förkortas A."],a:"Adenin",w:["Tymin","Uracil","Cytosin"],why:"Adenin och guanin är dubbelringar (PPT bild 27)."},
      {clues:["Jag är en enkel sockerart.","Min formel är C₆H₁₂O₆.","Jag kallas druvsocker."],a:"Glukos",w:["Fruktos","Sackaros","Maltos"],why:"PPT Bi2 bild 5."}]},
    mcNukl:{ty:"mc",h:"Nukleotider",src:"PPT Bi2 bild 27–28",items:[
      {q:"Vilka tre delar har en nukleotid?",o:["Fosfatgrupp, socker och kvävebas","Glycerol och tre fettsyror","Aminosyror i en viss ordning","Hydrofilt huvud och hydrofob svans"],why:"Fosfatgrupp + monosackarid (ribos eller deoxiribos) + kvävebas."},
      {q:"Vilken kvävebas finns i RNA men inte i DNA?",o:["Uracil (U)","Tymin (T)","Adenin (A)","Guanin (G)"],why:"RNA har U i stället för T."},
      {q:"Vilka två roller har nukleotider enligt läraren?",o:["Bygger nukleinsyror och är energibärare","Bygger cellväggar och lagrar fett","Är hormoner och enzymer","Bygger membran och reglerar pH"],why:"PPT Bi2 bild 28: nukleotider bygger upp nukleinsyror och är energibärare (ATP)."},
      {q:"Vad skiljer deoxiribos från ribos?",o:["Deoxiribos har en syreatom mindre (H i stället för OH)","Deoxiribos är en sexring","Deoxiribos innehåller kväve","Deoxiribos har tre fosfatgrupper"],why:"De-oxi betyder utan syre. Lärarens bild visar H i stället för OH på ett av kolen."}]},
    fixMol:{ty:"fix",h:"Hitta felen i Lisas sammanfattning",src:"PPT Bi2 bild 4–16",parts:[
      "Lisa skriver: Kolhydrater består av kol, väte och ",["kväve","syre","Kol-hydrat = kol + vatten, alltså kol, väte och syre (bild 4)."],
      ". Sackaros är en ",["monosackarid","disackarid","Sackaros = glukos + fruktos, alltså två ringar (bild 6)."],
      " som kallas strösocker. Fett är byggt av glycerol och tre fettsyror, och om det bara finns enkelbindningar är fettet ",["omättat och flytande","mättat och fast","Bara enkelbindningar = mättat, fast vid rumstemperatur (bild 10)."],
      ". Proteiner byggs av upp till 20 sorters aminosyror, och de 8 som cellen ",["kan tillverka själv","inte kan tillverka","De essentiella aminosyrorna måste ingå i födan, eftersom cellen inte kan tillverka dem (bild 16)."],
      " kallas essentiella."]}
  },
  w:{
    /* ---------- Mättad eller omättad? ---------- */
    k1Fett(el,api){
      el.className="wid";
      el.innerHTML=`<div class="wh"><b>Mättad eller omättad?</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0;padding:6px"><svg viewBox="0 0 420 260" role="img" aria-label="En fettsyra och hur fettsyrorna packas" id="k1-fa-svg"></svg></figure>
      <div><p class="small">Välj antal dubbelbindningar i fettsyran. Gissa först: blir fettet fast eller flytande?</p>
      <div class="ctl">Dubbelbindningar<div class="seg" role="group" aria-label="Dubbelbindningar" id="k1-fa-n"><button type="button" data-v="0" aria-pressed="true">0</button><button type="button" data-v="1" aria-pressed="false">1</button><button type="button" data-v="2" aria-pressed="false">2</button><button type="button" data-v="3" aria-pressed="false">3</button></div></div>
      <div class="ctl">Kedjans längd<div class="seg" role="group" aria-label="Kedjans längd" id="k1-fa-l"><button type="button" data-v="k" aria-pressed="false">kort</button><button type="button" data-v="l" aria-pressed="true">lång</button></div></div>
      <div class="ctl">Temperatur<div class="seg" role="group" aria-label="Miljö" id="k1-fa-t"><button type="button" data-v="r" aria-pressed="true">rumsvarmt</button><button type="button" data-v="c" aria-pressed="false">iskallt</button></div></div>
      <dl class="readout"><dt>Typ</dt><dd id="k1-fa-typ"></dd><dt>Form</dt><dd id="k1-fa-form"></dd><dt>Packning</dt><dd id="k1-fa-pack"></dd><dt>Exempel</dt><dd id="k1-fa-ex"></dd></dl>
      <p class="verdict" id="k1-fa-vd"></p><p id="k1-fa-why"></p></div></div>`;
      const $=s=>el.querySelector(s),svg=$("#k1-fa-svg");
      const S={n:0,l:"l",t:"r"};
      function wire(id,key){const g=$("#"+id);g.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{g.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));S[key]=key==="n"?+b.dataset.v:b.dataset.v;draw()}))}
      wire("k1-fa-n","n");wire("k1-fa-l","l");wire("k1-fa-t","t");
      const KP=[[],[7],[7,10],[5,8,11]];
      function draw(){
        const n=S.n,len=S.l==="l"?15:10,kinks=KP[n].filter(k=>k<len-1);
        let s=`<rect x="0" y="0" width="420" height="260" ${st(S.t==="c"?"--c-vac-soft":"--paper")}/>`;
        /* en stor fettsyra överst */
        s+=`<text x="12" y="22" class="lbs" style="font-size:15px">en fettsyra</text>`;
        s+=`<circle cx="30" cy="58" r="11" ${st("--bad")}/><text x="12" y="92" class="lbs" style="font-size:15px">COOH (karboxylgrupp)</text>`;
        const P=chain(41,58,len,kinks,{step:18,amp:6,turn:30});
        s+=chainSVG(P,kinks,"--ink",2.6,"--bad");
        /* packning: sex molekyler som står upp, huvud nedtill */
        const gap=n===0?22:(n===1?34:46),cnt=n===0?8:(n===1?6:5),x0=210-gap*(cnt-1)/2-(n?12:0);
        s+=`<text x="12" y="124" class="lbs" style="font-size:15px">många fettsyror bredvid varandra</text>`;
        const xs=[];for(let i=0;i<cnt;i++){const x=x0+i*gap;xs.push(x);
          const Q=chain(x,240,S.l==="l"?11:8,KP[n].map(k=>k-3).filter(k=>k>0&&k<(S.l==="l"?10:7)),{dir:-90,step:10,amp:3,turn:28});
          s+=`<circle cx="${x}" cy="246" r="6" ${st("--c-mem")}/>`+chainSVG(Q,[],"--c-mem",2)}
        /* van der Waals-krafter mellan grannar */
        const op=n===0?(S.l==="l"?0.95:0.7):(n===1?0.4:0.18);
        for(let i=0;i<xs.length-1;i++){for(let y=226;y>(S.l==="l"?140:170);y-=14){s+=`<path d="M${r1(xs[i]+4)} ${y} H${r1(xs[i+1]-4)}" fill="none" style="stroke:var(--c-golgi)" stroke-width="1.5" stroke-dasharray="2 3" opacity="${op}"/>`}}
        svg.innerHTML=s;
        const typ=["mättad","enkelomättad (omättad)","fleromättad","fleromättad"][n];
        $("#k1-fa-typ").textContent=typ;
        $("#k1-fa-form").textContent=n===0?"rak kedja":(n===1?"en knyck":n+" knyckar");
        $("#k1-fa-pack").textContent=n===0?"tät":(n===1?"glesare":"mycket gles");
        $("#k1-fa-ex").textContent=n===0?"animaliskt fett, kokosfett":(n===1?"vegetabiliskt fett (oljor)":"fiskfett, ishavsfiskens membran");
        const vd=$("#k1-fa-vd");let v,w;
        if(S.t==="r"){
          if(n===0){v=["b","Fast vid rumstemperatur"];w="Det finns bara enkelbindningar, och därför blir kedjan rak. Raka kedjor kan packas tätt, så van der Waals-krafterna mellan dem får verka på nära håll. Därför är mättat fett fast. {{lek:Bi2 bild 10}}"}
          else{v=["g","Flytande vid rumstemperatur"];w="Dubbelbindningen ger kedjan en knyck. Knyckiga kedjor kan inte packas tätt, avståndet mellan molekylerna blir större och van der Waals-krafterna svagare. Därför är omättat fett flytande. {{lek:Bi2 bild 12}} {{src:s. 18}}"}}
        else{
          if(n===0){v=["b","Membranet stelnar i kylan"];w="Raka, mättade fettsyror packas tätt, och i kallt vatten blir membranet stelt och slutar fungera. Därför klarar sig inte en ishavsfisk med mättade fettsyror. {{prov}} {{src:s. 18}}"}
          else if(n===1){v=["m","Trögflytande i kylan"];w="En knyck hjälper, men i iskallt vatten räcker det knappt. Ju fler dubbelbindningar, desto lägre temperatur klarar membranet. (Förenklad modell.) {{src:s. 18}}"}
          else{v=["g","Flytande även i iskallt vatten"];w="Flera dubbelbindningar ger flera knyckar, så molekylerna står glest och glider lätt även i kylan. Därför har ishavsfisk ovanligt mycket fleromättade fettsyror i sina cellmembran. {{prov}} {{src:s. 18}}"}}
        if(S.l==="l")w+=" Långa kedjor ger större yta för van der Waals-krafterna, och därför blir fettet trögare än med korta kedjor. {{src:s. 18}}";
        else w+=" Korta kedjor har mindre yta för van der Waals-krafterna, och därför blir fettet mer lättflytande än med långa kedjor. {{src:s. 18}}";
        vd.className="verdict "+v[0];vd.textContent=v[1];$("#k1-fa-why").innerHTML=api.tpl(w)}
      draw();
    }
  }
});
})();
