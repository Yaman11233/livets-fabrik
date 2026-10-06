/* K12 Resistens och vaccin – Livets fabrik. Bok s. 212–215 + PPT Antibiotika bild 2, 4–12. */
(function(){
"use strict";
const r1=n=>Math.round(n*10)/10;
const st=(f,s)=>`style="fill:var(${f})${s?";stroke:var("+s+")":""}"`;
function segHTML(id,label,opts,cur){return `<div class="ctl"><span style="margin-right:8px">${label}</span><div class="seg" role="group" aria-label="${label}" id="${id}">${opts.map(([v,t])=>`<button type="button" data-v="${v}" aria-pressed="${v===cur}">${t}</button>`).join("")}</div></div>`}
function segWire(el,id,fn){const g=el.querySelector("#"+id);g.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{g.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(b.dataset.v)}))}
function segSet(el,id,v){el.querySelectorAll("#"+id+" button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.v===v?"true":"false"))}
function arr(x1,y1,x2,y2,col,w,hs){const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,h=hs||8;const bx=x2-ux*h,by=y2-uy*h,px=-uy*h*0.6,py=ux*h*0.6;
  return `<path d="M${r1(x1)} ${r1(y1)} L${r1(bx)} ${r1(by)}" fill="none" style="stroke:var(${col})" stroke-width="${w}" stroke-linecap="round"/><polygon points="${r1(x2)},${r1(y2)} ${r1(bx+px)},${r1(by+py)} ${r1(bx-px)},${r1(by-py)}" style="fill:var(${col})"/>`}
function hexP(x,y,r){const p=[];for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;p.push(r1(x+r*Math.cos(a))+","+r1(y+r*Math.sin(a)))}return p.join(" ")}
/* bakterie = stav, virus = sexhörning */
function rod(x,y,f,s,dash){return `<rect x="${r1(x-10)}" y="${r1(y-6)}" width="20" height="12" rx="6" style="fill:var(${f||"--c-bact-soft"});stroke:var(${s||"--c-bact"})" stroke-width="1.8"${dash?' stroke-dasharray="3 2"':""}/>`}
function vir(x,y,r){return `<polygon points="${hexP(x,y,r||8)}" ${st("--c-vir-soft","--c-vir")} stroke-width="1.8"/>`}
/* antibiotikamolekyl */
function ab(x,y,r){return `<polygon points="${hexP(x,y,r||9)}" ${st("--mid-soft","--mid")} stroke-width="2"/>`}
const TT='class="lbs" style="font-size:14px;font-weight:700"';
const TS='class="lbs" style="font-size:13px"';

/* ---------- figur: vaccinationsprogrammet (bok s. 212) ---------- */
function figVacc(){
  let s="";
  const band=(k,y,h)=>`<rect data-k="${k}" x="4" y="${y}" width="462" height="${h}" rx="10" ${st("--sunk","--line")} stroke-width="1"/>`;
  s+=`<g data-k="alla">${band("alla",6,198)}</g><g data-k="risk">${band("risk",210,62)}</g><g data-k="aldre">${band("aldre",278,54)}</g><g data-k="resa">${band("resa",338,58)}</g>`;
  s+=rod(136,30)+rod(160,30)+rod(184,30);
  s+=vir(136,66)+vir(160,66)+vir(184,66);
  s+=vir(136,102)+vir(136,138);
  s+=rod(136,176)+rod(160,176);
  s+=rod(136,228)+vir(136,254);
  s+=vir(136,305);
  s+=vir(136,367)+rod(160,367);
  s+=rod(140,416)+`<text x="156" y="421" ${TS}>bakterie</text>`+vir(250,416)+`<text x="264" y="421" ${TS}>virus</text>`;
  return s}

/* ---------- figur: tre sätt att bli resistent (bok s. 213) ---------- */
function panel(c,k){const x=c-72;
  let s=`<g data-k="${k}"><rect x="${x}" y="60" width="144" height="58" ${st("--paper")}/><rect x="${x}" y="134" width="144" height="116" ${st("--c-bact-soft")}/>`;
  s+=`<rect x="${x}" y="118" width="144" height="16" ${st("--c-mem-soft")}/>`;
  let t="";for(let xx=x+5;xx<x+144;xx+=9)t+=`M${xx} 118 V123 M${xx} 134 V129 `;
  s+=`<path d="M${x} 118 H${x+144} M${x} 134 H${x+144} ${t}" fill="none" style="stroke:var(--c-mem)" stroke-width="1.4"/>`;
  return s}
function figResmek(){
  let s="";
  s+=`<text x="80" y="20" text-anchor="middle" ${TT}>1 sax</text><text x="235" y="20" text-anchor="middle" ${TT}>2 utkastare</text><text x="390" y="20" text-anchor="middle" ${TT}>3 nytt lås</text>`;
  /* 1 sax */
  s+=panel(80,"sax")+ab(54,88)+arr(54,101,54,154,"--mid",2.4,8)+ab(54,168);
  s+=`<g transform="translate(96 192)"><circle cx="-14" cy="14" r="7" fill="none" style="stroke:var(--c-nuc)" stroke-width="3"/><circle cx="14" cy="14" r="7" fill="none" style="stroke:var(--c-nuc)" stroke-width="3"/><path d="M-9 9 L16 -20 M9 9 L-16 -20" fill="none" style="stroke:var(--c-nuc)" stroke-width="3.4" stroke-linecap="round"/></g>`;
  s+=`<polyline points="118,212 124,202 136,202 140,210" ${st("--mid-soft","--mid")} stroke-width="2"/><polyline points="122,232 126,240 138,240 144,230" ${st("--mid-soft","--mid")} stroke-width="2"/>`;
  s+=arr(66,172,78,180,"--muted",1.6,6)+`</g>`;
  /* 2 utkastare */
  s+=panel(235,"ut");
  s+=`<rect x="219" y="102" width="32" height="48" rx="9" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2.2"/><rect x="231" y="106" width="8" height="40" ${st("--c-nuc")}/>`;
  s+=ab(206,206)+ab(184,226,8)+arr(212,192,229,158,"--mid",2.4,8)+arr(235,98,262,74,"--mid",2.4,8)+ab(276,72)+ab(196,80,8)+`</g>`;
  /* 3 nytt lås */
  s+=panel(390,"las");
  s+=`<path d="M356 196 H378 V212 H402 V196 H424 V238 H356 Z" ${st("--c-euk-soft","--c-euk")} stroke-width="2.2"/>`;
  s+=`<polygon points="${hexP(390,152,11)}" ${st("--mid-soft","--mid")} stroke-width="2"/><polygon points="381,162 399,162 390,180" ${st("--mid-soft","--mid")} stroke-width="2"/>`;
  s+=arr(390,70,390,134,"--mid",2.4,8)+`<path d="M410 172 l12 12 M422 172 l-12 12" fill="none" style="stroke:var(--bad)" stroke-width="3" stroke-linecap="round"/></g>`;
  return s}

/* ---------- figur: selektion före och efter (bok s. 214) ---------- */
const SEL_R=[[1,2]],SEL_E=[[0,0],[2,3],[4,1],[5,3]];
function selPanel(x0,mode){
  let s=`<rect x="${x0}" y="54" width="136" height="170" rx="12" ${st("--c-cyto","--line2")} stroke-width="1.5"/>`;
  for(let r=0;r<6;r++)for(let c=0;c<4;c++){const x=x0+20+c*32,y=72+r*26;const isR=SEL_R.some(p=>p[0]===r&&p[1]===c);
    if(mode===0)s+=isR?rod(x,y,"--bad-soft","--bad"):rod(x,y,"--c-vac-soft","--c-vac");
    else if(mode===1)s+=isR?rod(x,y,"--bad-soft","--bad"):`<rect x="${x-10}" y="${y-6}" width="20" height="12" rx="6" fill="none" style="stroke:var(--muted)" stroke-width="1.4" stroke-dasharray="3 2"/>`;
    else{const empty=SEL_E.some(p=>p[0]===r&&p[1]===c);s+=empty?`<rect x="${x-10}" y="${y-6}" width="20" height="12" rx="6" fill="none" style="stroke:var(--line2)" stroke-width="1" stroke-dasharray="2 3"/>`:rod(x,y,"--bad-soft","--bad")}}
  return s}
function figSel(){
  let s=`<text x="74" y="18" text-anchor="middle" ${TT}>1 före</text><text x="235" y="18" text-anchor="middle" ${TT}>2 antibiotika</text><text x="396" y="18" text-anchor="middle" ${TT}>3 efter</text>`;
  s+=`<g data-k="fore">`+selPanel(6,0)+`</g><g data-k="ab">`+selPanel(167,1);
  [[203,85],[267,111],[235,137],[203,163],[267,189],[235,85]].forEach(p=>{s+=ab(p[0],p[1],6.5)});
  s+=`</g><g data-k="efter">`+selPanel(328,2)+`</g>`;
  s+=arr(145,139,163,139,"--ink",2.4,8)+arr(306,139,324,139,"--ink",2.4,8);
  return s}

/* ---------- figur: hur resistenta bakterier sprids i samhället (PPT bild 6) ---------- */
function person(x,y,f){return `<circle cx="${x}" cy="${y-16}" r="8" ${st(f,"--ink")} stroke-width="1.5"/><path d="M${x-12} ${y+16} Q${x-12} ${y-6} ${x} ${y-6} Q${x+12} ${y-6} ${x+12} ${y+16} Z" ${st(f,"--ink")} stroke-width="1.5"/>`}
function figSprid(){
  let s="";
  s+=`<g data-k="mitt"><circle cx="235" cy="146" r="40" ${st("--bad-soft","--bad")} stroke-width="2"/>`+rod(222,134,"--paper","--bad")+rod(248,140,"--paper","--bad")+rod(230,160,"--paper","--bad")+`</g>`;
  s+=`<g data-k="manniska">`+person(56,66,"--c-euk-soft")+person(92,66,"--c-euk-soft")+`<path d="M68 60 H80" fill="none" style="stroke:var(--ink)" stroke-width="2"/></g>`;
  s+=`<g data-k="djur"><ellipse cx="398" cy="62" rx="30" ry="16" ${st("--c-wall-soft","--ink")} stroke-width="1.5"/><circle cx="432" cy="48" r="10" ${st("--c-wall-soft","--ink")} stroke-width="1.5"/><path d="M378 76 V94 M390 78 V94 M408 78 V94 M420 76 V94" fill="none" style="stroke:var(--ink)" stroke-width="3" stroke-linecap="round"/></g>`;
  s+=`<g data-k="miljo"><path d="M28 222 Q44 212 60 222 T92 222 T124 222 M28 238 Q44 228 60 238 T92 238 T124 238" fill="none" style="stroke:var(--c-vac)" stroke-width="3"/><rect x="40" y="190" width="34" height="14" rx="3" ${st("--line2","--ink")} stroke-width="1.2"/><rect x="88" y="192" width="14" height="8" rx="4" ${st("--mid-soft","--mid")} stroke-width="1.5"/><rect x="104" y="198" width="14" height="8" rx="4" ${st("--mid-soft","--mid")} stroke-width="1.5"/></g>`;
  s+=`<g data-k="resor"><path d="M366 226 L440 210 Q450 208 450 214 Q450 220 440 222 L366 238 Z" ${st("--c-nuc-soft","--ink")} stroke-width="1.5"/><path d="M402 218 L392 196 L402 194 L418 214 Z M402 228 L396 248 L406 248 L418 224 Z M368 228 L360 216 L368 214 L376 226 Z" ${st("--c-nuc-soft","--ink")} stroke-width="1.5"/></g>`;
  s+=arr(201,128,116,82,"--ink",2.2,8)+arr(116,82,201,128,"--ink",2.2,8);
  s+=arr(270,128,362,82,"--ink",2.2,8)+arr(362,82,270,128,"--ink",2.2,8);
  s+=arr(201,166,130,208,"--ink",2.2,8)+arr(130,208,201,166,"--ink",2.2,8);
  s+=arr(270,166,360,214,"--ink",2.2,8)+arr(360,214,270,166,"--ink",2.2,8);
  return s}

G.def({
  id:"k12",
  src:{bok:"s. 212–215", ppt:"Antibiotika, bild 2, 4–12"},
  threads:["plasmid","vagg","nyckel","membran"],
  goals:[
    "räkna upp vad alla barn i Sverige erbjuds vaccin mot enligt boken, och skilja bakteriesjukdomarna från virussjukdomarna",
    "förklara varför resistensgener fanns i naturen långt innan människan började använda antibiotika",
    "beskriva bokens tre sätt som en resistensgen kan skydda en bakterie (sax, utkastare, nytt lås)",
    "förklara steg för steg hur antibiotika selekterar för resistenta bakterier i en patient, på sjukhus och i boskapsskötsel",
    "förklara varför resistenta bakterier blir färre när vi slutar selektera för dem, och ge bokens fem råd med ett eftersom till varje",
    "beskriva MRSA, ESBL-producerande enterobakterier och resistenta tuberkulosbakterier med bokens siffror",
    "förklara varför man ska ta hela kuren och ge lärarens orsaker till att man inte alltid blir frisk av antibiotika",
    "beskriva hur resistenta bakterier sprids mellan bakterier och i samhället"
  ],
  intro:`<p>I {{go:k11|K11}} smög sabotörerna, antibiotikan, in i bakteriens verkstad och stängde av en maskin. Nu slår verkstaden tillbaka. Med rätt receptkort kan den klippa sönder sabotören, kasta ut den eller byta lås, så att sabotörens nyckel inte passar. Men först ett annat sätt att skydda sig mot mikroorganismer: vaccin, som boken tar upp i en faktaruta på samma uppslag.</p>`,
  secs:[
  /* ================= vaccin ================= */
  {id:"vaccin", h:"Det svenska vaccinationsprogrammet", nav:"Vaccin", src:"s. 212 (faktaruta)", html:`
    <p>Ett <b>vaccin</b> ges för att förebygga en sjukdom, innan man har blivit smittad. Boken har en faktaruta om vilka vaccin som erbjuds i Sverige. Listan blandar bakteriesjukdomar och virussjukdomar, och det är viktigt att hålla isär dem, eftersom antibiotika bara hjälper mot bakterier ({{go:k11.antibiotika|K11}}).</p>
    <div class="box key" data-h="Bokens faktaruta"><p><b>Alla barn i Sverige erbjuds i dag vaccinering mot</b></p><ul>
      <li>de tre <b>bakteriesjukdomarna</b> difteri, stelkramp och halsfluss</li>
      <li>de tre <b>virussjukdomarna</b> mässling, röda hund och påssjuka</li>
      <li>virussjukdomen <b>polio</b></li>
      <li><b>papillomavirus</b>, som kan orsaka vårtor och kondylom och öka risken för livmoderhalscancer</li>
      <li>två bakterier som kan orsaka lunginflammation, nämligen <b>pneumokocker</b> och <i class="sp">Haemophilus influenzae</i>.</li></ul>
      <p><b>Barn med ökad risk att smittas</b> erbjuds också vaccination mot <b>tuberkulos</b> och gulsotsviruset <b>hepatit B</b>.</p>
      <p><b>Äldre, personer med nedsatt immunförsvar och personer med lungsjukdomar</b> uppmanas att varje år vaccinera sig mot <b>influensa</b>, eftersom denna ökar risken för allvarlig lunginflammation, som varje år kostar tusentals personer i dessa riskgrupper livet.</p>
      <p><b>Inför resor</b> till vissa länder rekommenderas dessutom vaccinationer mot smittämnen man riskerar att möta på resmålet, som <b>gula febern</b> och <b>kolera</b>. {{src:s. 212}}</p></div>
    <div class="lfig-h" data-fig="vaccprog"></div>
    <table class="cmp"><tr><th>Vem?</th><th>Vaccin mot</th><th>Bakterie eller virus (boken)</th></tr>
      <tr><td>Alla barn</td><td>difteri, stelkramp, halsfluss</td><td>bakterier</td></tr>
      <tr><td>Alla barn</td><td>mässling, röda hund, påssjuka, polio, papillomavirus</td><td>virus</td></tr>
      <tr><td>Alla barn</td><td>pneumokocker, <i class="sp">Haemophilus influenzae</i></td><td>bakterier (lunginflammation)</td></tr>
      <tr><td>Barn med ökad risk</td><td>tuberkulos, hepatit B</td><td>bakterie, virus</td></tr>
      <tr><td>Äldre och riskgrupper</td><td>influensa, varje år</td><td>virus</td></tr>
      <tr><td>Resenärer</td><td>t.ex. gula febern och kolera</td><td>anges inte i boken</td></tr></table>
    <ol class="chainv"><li>Influensa ökar risken för allvarlig lunginflammation.</li><li>Den kostar varje år tusentals personer i riskgrupperna livet.</li><li>Därför uppmanas äldre, personer med nedsatt immunförsvar och personer med lungsjukdomar att vaccinera sig varje år.</li></ol>
    <div class="box trick" data-h="Minnesknep: 3 + 3 + polio + papillom + 2"><p><b>DiSH</b> = Difteri, Stelkramp, Halsfluss, de tre bakterierna.</p><p><b>MRP</b> = Mässling, Röda hund, Påssjuka, de tre virusen. Lägg till polio och papillomavirus.</p><p><b>P + H i lungorna</b> = Pneumokocker och <i class="sp">Haemophilus</i>, två bakterier som ger lunginflammation.</p><p><b>Riskbarn: TB + HB</b> = TuBerkulos och Hepatit B.</p></div>
    <div class="box trap"><p><i class="sp">Haemophilus influenzae</i> är en <b>bakterie</b>, trots namnet. Influensa är ett virus. Boken stavar namnet <i class="sp">Haemophilius</i>, men det rätta är <i class="sp">Haemophilus</i>.</p><p>Hepatit B är ett virus (boken: "gulsotsviruset"). Tuberkulos orsakas av en bakterie ({{go:k12.mordare|Mördarbakterier}}).</p><p>Influensavaccinet är inte för alla barn. Det är för äldre och riskgrupper, och det tas <b>varje år</b>.</p></div>
    <div class="box extra" data-h="Dagens program"><p>Boken är inte helt aktuell här. I dagens svenska program står <b>kikhosta</b>, inte halsfluss, bredvid difteri och stelkramp, och programmet innehåller också <b>rotavirus</b>. Sedan <b>2020</b> erbjuds HPV-vaccin (mot papillomavirus) till <b>alla barn</b> oavsett kön, och <b>hepatit B</b> ges i dag till alla spädbarn. <b>På provet gäller bokens lista</b>, men säg gärna att du vet detta. (Källa: Folkhälsomyndigheten.)</p></div>
    <table class="cmp"><tr><th></th><th>Vaccin</th><th>Antibiotika</th></tr>
      <tr><td>När?</td><td>före smittan, förebyggande</td><td>när man redan har en bakterieinfektion</td></tr>
      <tr><td>Mot</td><td>både bakterie- och virussjukdomar</td><td>bara bakterier</td></tr>
      <tr><td>Källa</td><td>faktarutan s. 212</td><td>s. 212 · PPT bild 2–3</td></tr></table>
    <div class="box link"><p>Antibiotika hjälper inte mot virus {{lek:Antibiotika bild 2–3}}. Mot virussjukdomarna i listan, som mässling och polio, är vaccinet därför det viktigaste skyddet. Ett virus är en kapare utan egen fabrik ({{go:k10.virus|K10}}), och sabotörerna har ingen verkstad att förstöra där.</p></div>
    <div class="box fab"><p>Ett vaccin är som att visa vakterna vid fabriksgrinden en bild på inbrottstjuven i förväg. Antibiotika är sabotörer som skickas in i bakteriens verkstad när inbrottet redan har skett. {{extra}}</p></div>
    <div class="x" data-x="sortVacc"></div>
  `},
  /* ================= resistens ================= */
  {id:"resistens", h:"Antibiotikaresistens: verkstadens försvar", nav:"Resistens", src:"s. 212–213 · PPT bild 2, 4, 7", prov:true, html:`
    <p>Allteftersom människan har använt mer och mer antibiotika har man också <b>selekterat</b> för bakterier som är <b>resistenta</b> {{prov}}. Allt oftare infekteras människor nu av bakterier som är resistenta mot en eller flera av de antibiotika som vanligen används mot dem (s. 212).</p>
    <div class="box lek"><p>Läraren: <b>antibiotikaresistens</b> är ett naturligt fenomen där bakterier utvecklar motståndskraft mot antibiotika. Det är <b>bakterierna</b> som blir resistenta, inte människor eller djur. {{lek:Antibiotika bild 2}}</p></div>
    <h3>Resistensen fanns före oss</h3>
    <p>De flesta antibiotika produceras naturligt i bakterier eller svampar i naturen. Under evolutionen har de varit redskap i konkurrensen mellan olika arter om resurserna i olika ekologiska nischer, eftersom den som tillverkar ett ämne som dödar konkurrenter får bättre möjlighet att föröka sig. Därför bär också många bakterier i naturen på gener som ger dem motståndskraft mot sådan <b>kemisk krigsföring</b>. Runt om i ekosystemen finns därför mängder av olika <b>resistensgener</b>.</p>
    <ol class="chainv"><li>De flesta antibiotika tillverkas naturligt av bakterier eller svampar.</li><li>De är vapen i konkurrensen om resurser, eftersom den som dödar konkurrenter förökar sig bättre.</li><li>Därför har många bakterier gener som skyddar mot den kemiska krigsföringen.</li><li>Mängder av resistensgener finns redan i naturen.</li></ol>
    <p>När bakteriesjukdomar har behandlats med antibiotika har det dessutom skapats ett <b>selektivt tryck</b> för nya <b>mutationer</b> som ger resistens {{prov}}. Läraren beskriver samma sak: får en bakterie en mutation som gör att den tål antibiotika, ärver alla dess avkommor egenskapen och får genom naturligt urval en överlevnadsfördel. Ju mer antibiotika, desto vanligare blir resistenta bakterier {{lek:Antibiotika bild 7}}.</p>
    <div class="box diff"><p><b>Boken:</b> resistensgener fanns i naturen långt innan människan, och användningen av antibiotika ger dessutom selektivt tryck för nya mutationer (s. 213). <b>Läraren:</b> börjar med en mutation i en bakterie som lever med antibiotika och förklarar med naturligt urval (bild 7). Det är ingen motsägelse. Nämn gärna båda på provet.</p></div>
    <h3>Tre sätt att bli resistent</h3>
    <p>Hur kan en gen göra en bakterie resistent? Genen beskriver ett protein, och boken ger tre sorter {{src:s. 213}}.</p>
    <table class="cmp"><tr><th>Resistensgenen beskriver</th><th>Vad händer med antibiotikan?</th><th>Exempel (s. 215)</th></tr>
      <tr><td>1. ett protein som <b>klipper sönder</b> antibiotikan</td><td>den förstörs</td><td>ESBL</td></tr>
      <tr><td>2. ett protein som <b>transporterar ut</b> antibiotikan ur bakterien</td><td>den åker ut igen</td><td>(inget i boken)</td></tr>
      <tr><td>3. en <b>förändrad gen</b> för det protein som antibiotikumet normalt binder</td><td>den kan inte längre fästa vid proteinet</td><td>MRSA</td></tr></table>
    <div class="lfig-h" data-fig="resmek"></div>
    <div class="box trick" data-h="Minnesknep: SUN"><p><b>S</b>ax · <b>U</b>tkastare · <b>N</b>ytt lås.</p><p>Sax = ett protein som klipper sönder antibiotikan. Utkastare = ett protein som transporterar ut den. Nytt lås = målproteinet har ändrats, så att antibiotikan (nyckeln) inte kan fästa.</p></div>
    <div class="box fab"><p>Resistens är <b>verkstadens försvar</b> mot sabotörerna. Med ett receptkort för en sax klipper verkstaden sönder sabotören. Med en utkastare i tullgränsen, cellmembranet, kastas sabotören ut igen. Med ett nytt lås på maskinen passar inte sabotörens nyckel längre.</p></div>
    <div class="box tr" data-t="nyckel" data-h="Nytt lås, nyckeln passar inte">Antibiotikan måste passa i sitt målprotein som en nyckel i ett lås ({{go:k11.verkan|K11}}). Är genen för målproteinet förändrad passar inte nyckeln, och bakterien är resistent. Så gör MRSA med enzymet som bygger cellväggen.</div>
    <div class="box tr" data-t="membran" data-h="Utkastaren sitter i membranet">Ett protein som transporterar ut antibiotikan måste sitta i bakteriens cellmembran, precis som pumparna i {{go:k5.aktiv|K5}} flyttar ämnen genom membranet.</div>
    <div class="box trap"><p>Resistensgener fanns i naturen långt före människans antibiotika. Behandlingen har skapat ett selektivt tryck som gynnar dem.</p><p>I sätt 3 är det <b>bakteriens protein</b> som har ändrats, inte antibiotikan.</p><p>Det är bakterierna som blir resistenta, inte patienten.</p></div>
    <h3>Resistenta bakterier finns överallt</h3>
    <p>Resistensgener finns i en rad bakterier både i kroppen och i naturen omkring oss, och nya resistensgener kan uppkomma slumpmässigt. Läraren påminner om att vi alla bär på bakterier. De flesta är ofarliga eller till och med nödvändiga för vår hälsa. Att bära på resistenta bakterier behöver inte innebära att man blir sjuk, men det ökar risken för spridning till andra och för framtida, svårbehandlade infektioner {{lek:Antibiotika bild 4}}.</p>
    <div class="x" data-x="matchMek"></div>
    <div class="x" data-x="tfRes"></div>
  `},
  /* ================= spridning ================= */
  {id:"spridning", h:"Hur resistensen sprids", nav:"Spridning", src:"s. 213–215 · PPT bild 4–10", prov:true, html:`
    <h3>Mellan bakterier</h3>
    <p>Bakterier har mekanismer som gör att resistensgener, och grupper av sådana, kan <b>hoppa</b> mellan olika ställen i bakteriens arvsmassa och <b>flyttas från en bakterie till en annan</b>, även över artgränser {{prov}}. Sammantaget gör detta att bakterier som är resistenta mot ett antibiotikum kan dyka upp var och när som helst (s. 213–214).</p>
    <p>Läraren kallar det <b>horisontell spridning</b>: från en bakterie till en annan genom konjugation, transduktion eller transformation. <b>Vertikal spridning</b> är från en modercell till två dotterceller {{lek:Antibiotika bild 7–10}}. Hur de tre överföringssätten går till finns i {{go:k9.overforing|K9 Överföring}} och {{go:k9.spridning|K9}}.</p>
    <table class="cmp"><tr><th>Sätt</th><th>Hur genen flyttas (kort)</th></tr>
      <tr><td>Konjugation</td><td>en plasmid förs över vid kontakt via sexpili, och mottagaren blir själv givare</td></tr>
      <tr><td>Transformation</td><td>DNA från döda, lyserade bakterier tas upp av naturligt kompetenta bakterier</td></tr>
      <tr><td>Transduktion</td><td>en bakteriefag, ett virus, för med sig DNA från en bakterie till en annan</td></tr></table>
    <div class="box tr" data-t="plasmid" data-h="Receptkortet lånas ut">Resistensgener ligger i många fall på plasmider ({{go:k9.plasmider|K9}}). Vid konjugation lånas receptkortet ut till grannen, och mottagaren kan sedan själv låna ut det. Därför kan några få plasmidbärare snabbt göra en hel population resistent {{lek:Antibiotika bild 8}}.</div>
    <h3>I samhället</h3>
    <p>Läraren visar att antibiotikaresistens inte bara är ett medicinskt problem. Det berör hela samhället {{lek:Antibiotika bild 6}}. Resistenta bakterier kan spridas</p>
    <ul><li><b>mellan människor</b>, till exempel via nära kontakt eller bristande <b>handhygien</b> {{prov}}</li>
      <li><b>via djur och livsmedel</b>, eftersom antibiotika även används inom djurhållning {{prov}}</li>
      <li><b>i miljön</b>, där antibiotikarester från avloppsvatten och jordbruk kan bidra till resistensutveckling.</li></ul>
    <p><b>Bakterier känner inga gränser.</b> Resistens som uppstår i ett land kan snabbt spridas globalt genom <b>resor och handel</b>. Därför krävs internationellt samarbete för att bekämpa problemet.</p>
    <div class="lfig-h" data-fig="spridvag"></div>
    <h3>Varför det är ett problem för sjukvården</h3>
    <p>Modern sjukvård är beroende av effektiva antibiotika vid till exempel <b>cancerbehandlingar</b>, <b>transplantationer</b> och <b>operationer</b>, eftersom de innebär en ökad infektionsrisk {{lek:Antibiotika bild 5}}. Även vid enklare tillstånd kan antibiotika behövas, till exempel vid <b>urinvägsinfektion</b>.</p>
    <ol class="chainv"><li>Bakterier blir resistenta mot antibiotika.</li><li>Infektioner som tidigare var lättbehandlade kan bli svåra eller omöjliga att bota.</li><li>Cancerbehandlingar, transplantationer och operationer blir farligare, eftersom de kräver effektiva antibiotika.</li></ol>
    <p>Ju mer antibiotika som används, desto mer ökar risken för resistensutveckling. Läraren kallar det ett allvarligt och växande <b>folkhälsoproblem</b> både i Sverige och i världen. Därför är det avgörande att antibiotika används ansvarsfullt, <b>endast när det behövs och på rätt sätt</b> {{lek:Antibiotika bild 5}}.</p>
    <div class="box link"><p>Boken säger samma sak om operationer: infekterade sår vid operationer blev lättbehandlade när antibiotikan kom (s. 212), och just där har man selekterat fram MRSA ({{go:k12.mordare|Mördarbakterier}}).</p></div>
    <div class="box fab"><p>Receptkortet för verkstadens försvar sprids som ett rykte i kvarteret: mellan verkstäder (horisontellt), mellan människor som inte tvättar händerna, via djurens stall, i avloppet och med flyget till andra länder.</p></div>
    <div class="box trap"><p>Att bära på resistenta bakterier är inte samma sak som att vara sjuk {{lek:Antibiotika bild 4}}. Men bäraren kan sprida dem vidare.</p><p>Resistensgener kan flyttas mellan arter, inte bara till bakteriens egen avkomma.</p></div>
    <div class="x" data-x="mcSprid"></div>
  `},
  /* ================= selektion ================= */
  {id:"selektion", h:"Selektion: när den resistenta vinner", nav:"Selektion", src:"s. 214 · PPT bild 5–7", prov:true, html:`
    <h3>I patienten</h3>
    <p>Boken beskriver vad som händer när en resistent bakterie dyker upp i en patient som behandlas med "dess" antibiotikum {{prov}}.</p>
    <ol class="chainv"><li>En resistent bakterie finns i en patient som behandlas med "dess" antibiotikum.</li><li>Den resistenta bakteriens <b>konkurrenter dödas</b>.</li><li>Den resistenta bakterien får fritt fram att <b>dela sig</b> och fylla upp den lediga platsen.</li><li>Därför skapar användning av antibiotika ett <b>starkt selektivt tryck</b> för bakterier som bär på resistensgener.</li></ol>
    <div class="lfig-h" data-fig="selpat"></div>
    <div class="box key"><p>Användande av antibiotika innebär att man skapar ett <b>starkt selektivt tryck</b> för bakterier som bär på resistensgener. {{src:s. 214}}</p></div>
    <div class="w" data-w="selSim"></div>
    <h3>På sjukhuset</h3>
    <p>Kommer resistenta bakterier in i miljöer där man använder mycket antibiotika, till exempel <b>sjukhusens operationsavdelningar</b>, är de besvärliga att bli av med {{prov}}. Det beror på att antibiotikan hela tiden dödar deras konkurrenter, medan de själva överlever.</p>
    <h3>I boskapsskötseln</h3>
    <p>Vi använder antibiotika inte bara i sjukvård utan också i <b>boskapsskötsel</b> {{prov}}. Där används det</p>
    <ul><li>för att <b>behandla</b> djur som fått infektioner</li><li>för att <b>förebygga</b> smitta om en infektion tagit sig in i en boskapsbesättning</li><li>i många länder för att <b>snabba på djurens tillväxt</b>. Varför behandlingen har den effekten är oklart enligt boken.</li></ul>
    <p>I ekosystemen runt stora djurbesättningar ser man därför i många delar av världen att bakterier hos <b>fåglar och smågnagare</b> bär gener som ger resistens mot de typer av antibiotika som getts till boskapen. Läraren säger att resistenta bakterier sprids via djur och livsmedel, eftersom antibiotika även används inom djurhållning {{lek:Antibiotika bild 6}}.</p>
    <div class="box extra"><p>Antibiotika enbart för att öka djurens tillväxt förbjöds i Sverige <b>1986</b> och inom EU <b>2006</b>.</p></div>
    <table class="cmp"><tr><th>Var?</th><th>Vad händer?</th></tr>
      <tr><td>I patienten</td><td>konkurrenterna dödas, den resistenta fyller den lediga platsen</td></tr>
      <tr><td>På sjukhuset</td><td>mycket antibiotika, t.ex. på operationsavdelningar, gör resistenta bakterier besvärliga att bli av med</td></tr>
      <tr><td>I boskapsskötseln</td><td>behandla, förebygga, snabba på tillväxten → resistensgener hos fåglar och smågnagare</td></tr></table>
    <div class="box trick" data-h="Minnesknep: den lediga stolen"><p>Tänk dig ett klassrum där alla stolar är upptagna. Antibiotikan skickar hem alla elever utom den resistenta. Hon får alla tomma stolar, och snart sitter bara hennes kloner där.</p><p>Det är <b>urval</b>: antibiotikan gör inte bakterien resistent, den väljer ut den som redan var det.</p></div>
    <div class="box fab"><p>I kvarteret finns hundra verkstäder. Sabotörerna slår ut alla som saknar försvar. Kvar står den enda verkstaden med rätt receptkort, och den får alla lediga tomter att bygga nya verkstäder på.</p></div>
    <div class="box trap"><p>Antibiotikan dödar konkurrenterna. Den gör inte den känsliga bakterien resistent.</p><p>Fåglarna och smågnagarna har själva inte fått antibiotika. Det är bakterierna hos dem som bär resistensgener.</p><p>Varför antibiotika ökar djurens tillväxt är oklart enligt boken. Hitta inte på en förklaring på provet.</p></div>
    <div class="box link"><p>Normalfloran är för det mesta ofarlig och till och med nödvändig {{lek:Antibiotika bild 4}}. När antibiotikan dödar den blir det lediga platser, och det är de platserna den resistenta bakterien fyller. Mer om bakteriers roll i kroppen i {{go:k8|K8}}.</p></div>
    <div class="x" data-x="ordSel"></div>
  `},
  /* ================= motverka ================= */
  {id:"motverka", h:"Att motverka antibiotikaresistens", nav:"Motverka", src:"s. 214–215 · PPT bild 5–6, 12", prov:true, html:`
    <h3>Plasmider som inte behövs försvinner</h3>
    <p>Gener för antibiotikaresistens ligger <b>i många fall</b> på små extra DNA-molekyler i bakterierna, som kallas <b>plasmider</b> {{prov}}. Plasmiderna kopieras inför varje celldelning, men det finns inget maskineri som ser till att det hamnar plasmider i båda bakterierna som bildas. Ibland blir därför en av bakterierna utan plasmid.</p>
    <ol class="chainv"><li>Resistensgenerna sitter på en plasmid.</li><li>Plasmiden kopieras inför varje celldelning.</li><li>Inget maskineri ser till att båda dotterbakterierna får en plasmid, så ibland blir en utan.</li><li>Utan antibiotika har bakterierna med plasmid ingen fördel.</li><li>I det långa loppet förloras plasmiderna, och resistenta bakterier blir färre, så länge vi inte selekterar för dem.</li></ol>
    <div class="w" data-w="plasSim"></div>
    <div class="box diff"><p><b>Boken:</b> gener för antibiotikaresistens ligger "<b>i många fall</b>" på plasmider (s. 214), och MRSA har sina i en transposon (s. 215). <b>Läraren:</b> "Resistensgener (evolutionärt skydd) sitter på plasmider" (bild 7). Skriv bokens version på provet: ofta på plasmider, men inte alltid.</p></div>
    <div class="box tr" data-t="plasmid" data-h="Det lösa receptkortet tappas">Plasmiden är verkstadens lösa receptkort ({{go:k9.plasmider|K9}}). Det kopieras inför delningen men delas inte ut ordentligt, så ibland tappas det. Utan antibiotika behövs kortet inte, och därför försvinner det långsamt ur populationen.</div>
    <h3>Bokens fem råd</h3>
    <p>Om man vill minska risken för antibiotikaresistenta infektioner bör man enligt boken tänka på fem saker {{prov}}.</p>
    <table class="cmp"><tr><th>Rådet</th><th>Eftersom</th></tr>
      <tr><td>1. Håll tillbaka antibiotika i <b>sjukvården</b></td><td>Använd inte antibiotika vid infektioner som normalt läker av sig själva, t.ex. <b>öroninflammation</b>, även om det kan ge lite längre sjukdomsperiod och lite mer obehag. Mindre antibiotika ger mindre selektion.</td></tr>
      <tr><td>2. Relativt <b>höga doser</b>, behandlingen <b>tiden ut</b></td><td>Genvarianter som ger svag motståndskraft uppstår och cirkulerar relativt ofta. De dödas av höga doser, men överlever vid låga doser eller oregelbundet intag ({{go:k12.kuren|Hela kuren}}).</td></tr>
      <tr><td>3. Begränsa antibiotika i <b>djurhållning</b></td><td>Inte för att öka vikten på djuren och inte för att förebygga infektioner, utan bara för att behandla de infektioner som verkligen bryter ut.</td></tr>
      <tr><td>4. Var försiktig med antibiotika till <b>sällskapsdjur</b></td><td>Etablerar sig resistenta bakterier hos en katt eller hund finns risk att bakterier eller resistensgener förs över till husse eller matte och deras umgänge.</td></tr>
      <tr><td>5. <b>Undvik att sprida bakterier</b></td><td>Ju färre som smittas, desto färre behöver behandlas med antibiotika. Ju mindre smittspridning, desto mindre spridning även av resistenta bakterier.</td></tr></table>
    <div class="box key"><p>Det viktigaste man kan göra för att motverka resistenta bakterier är också det enklaste: att överallt följa de <b>hygienråd</b> som redan finns i hem, sjukhus, slakterier, livsmedelsaffärer, restauranger och så vidare. {{src:s. 215}}</p></div>
    <div class="box lek"><p>Läraren säger samma sak: antibiotika ska användas ansvarsfullt, <b>endast när det behövs och på rätt sätt</b> (bild 5), och resistenta bakterier sprids mellan människor via nära kontakt eller bristande <b>handhygien</b> (bild 6). {{lek:Antibiotika bild 5–6}}</p></div>
    <div class="box trick" data-h="Minnesknep: Sju Duktiga Djur Sover Hemma"><p><b>S</b>jukvården håller tillbaka · <b>D</b>osen hög, hela tiden · <b>D</b>jurhållningen begränsas · <b>S</b>ällskapsdjur försiktigt · <b>H</b>ygien överallt.</p></div>
    <div class="box fab"><p>Fabrikens bästa skydd mot verkstädernas försvar är att skicka in sabotörer mer sällan, men med full styrka när de väl skickas, och att hålla rent i hela kvarteret så att färre verkstäder flyttar in från början.</p></div>
    <div class="box trap"><p>Det är ingen motsägelse att både hålla tillbaka antibiotika och ge höga doser. Använd antibiotika mer sällan, men när det behövs: rätt dos och hela tiden.</p><p>Plasmider tappas inte för att antibiotikan förstör dem. De tappas för att de inte alltid hamnar i båda dotterbakterierna.</p><p>Resistenta bakterier blir färre bara så länge vi inte selekterar för dem.</p></div>
    <div class="x" data-x="chainK12"></div>
    <div class="x" data-x="clozeRad"></div>
    <div class="x" data-x="fixK12"></div>
  `},
  /* ================= mordare ================= */
  {id:"mordare", h:"Mördarbakterier", nav:"Mördarbakterier", src:"s. 215 (faktaruta)", html:`
    <p>Boken har en faktaruta om några av de antibiotikaresistenta bakterier som just nu oroar sjukvården.</p>
    <table class="cmp"><tr><th></th><th>MRSA</th><th>ESBL</th><th>Resistent TB</th></tr>
      <tr><td>Vad är det?</td><td><b>meticillinresistenta gula stafylokocker</b></td><td><b>ESBL-producerande enterobakterier</b>: gramnegativa stavar, ofta <i class="sp">E. coli</i>, som normalt bor i tarmen</td><td>den bakterie som orsakar <b>tuberkulos</b></td></tr>
      <tr><td>Var sitter resistensen?</td><td>i ett hoppande genpaket, en <b>transposon</b></td><td>på en <b>plasmid</b></td><td>bakterien samlar på sig resistensgener</td></tr>
      <tr><td>Hur fungerar den?</td><td>en förändrad version av enzymet som cellväggsantibiotika binder, helt okänslig (nytt lås)</td><td>ett protein som klipper sönder penicillin och många andra cellväggsantibiotika (sax)</td><td>resistent mot rifampicin och isoniazid, och allt fler mot andrahandsvalen</td></tr>
      <tr><td>Fler resistensgener?</td><td>ofta, fler än tre → multiresistent</td><td>inte sällan, på samma plasmid</td><td>under 2000-talet stammar resistenta mot alla</td></tr>
      <tr><td>Sverige 2010</td><td>1 500 fall, bara 15 djupt in i kroppen</td><td>5 000 fall, varav 200 infektioner på djupet</td><td>ett mycket allvarligt problem globalt</td></tr></table>
    <h3>MRSA</h3>
    <p><b>MRSA</b> betyder meticillinresistenta gula stafylokocker. De bär på ett hoppande genpaket, en <b>transposon</b>, som ger resistens mot de flesta antibiotika som slår mot <b>cellväggssyntesen</b>. Alla dessa antibiotika binder nämligen till och blockerar ett visst <b>enzym</b>, och i genpaketet finns en förändrad version av enzymet, som är helt okänslig för antibiotikan. Ofta finns dessutom ytterligare resistensgener i paketet. Är dessa ytterligare resistensgener <b>fler än tre</b> talar man om <b>multiresistenta bakterier</b>.</p>
    <ol class="chainv"><li>Många människor har normalt gula stafylokocker på huden.</li><li>De kan vara inblandade när sår blir infekterade.</li><li>Man använder antibiotika för att hejda infektioner i sår vid operationer.</li><li>Därför har man i sjukvården världen över selekterat för MRSA, som på många håll skapar stora problem.</li></ol>
    <p>I Sverige hittade man år <b>2010</b> sammanlagt <b>1 500 fall</b> med MRSA, men bara i <b>femton</b> av dessa fall hade bakterierna trängt djupt in i patientens kropp.</p>
    <div class="box tr" data-t="vagg" data-h="MRSA byter lås på väggbygget">Penicillin och andra cellväggsantibiotika blockerar enzymet som bygger bakteriens cellvägg ({{go:k11.verkan|K11}}). MRSA har en förändrad version av just det enzymet, så väggbygget fortsätter trots antibiotikan.</div>
    <h3>ESBL-producerande enterobakterier</h3>
    <p><b>ESBL</b>-producerande enterobakterier är gramnegativa stavar, ofta <i class="sp">E. coli</i>, som normalt bor i tarmen. De bär på en <b>plasmid</b> som får bakterien att bilda ett protein som <b>klipper sönder</b> både penicillin och många andra antibiotika som slår mot cellväggssyntesen. Inte sällan bär plasmiden även andra resistensgener. Under <b>2010</b> hittade man i Sverige <b>5 000 fall</b> med sådana bakterier, varav <b>200</b> utgjorde infektioner som gått på djupet.</p>
    <div class="box tr" data-t="plasmid" data-h="ESBL på receptkortet">ESBL-bakteriernas sax sitter på en plasmid, ofta tillsammans med andra resistensgener. Plasmider kan föras över mellan bakterier ({{go:k9.overforing|K9}}), och därför kan hela paketet av försvar lånas ut på en gång.</div>
    <h3>Resistenta tuberkulosbakterier</h3>
    <p>Ett mycket allvarligt problem globalt är att den bakterie som orsakar <b>tuberkulos</b> samlar på sig resistensgener. Endast ett fåtal antibiotika biter på bakterien, och en mycket stor andel av de tuberkulosbakterier som cirkulerar i världen är nu resistenta mot de två antibiotika, <b>rifampicin</b> och <b>isoniazid</b>, som traditionellt varit läkarnas förstahandsval. Allt fler tuberkulosbakterier har också blivit resistenta mot flera av de antibiotika man sätter in i andra hand. Under <b>2000-talet</b> har stammar börjat cirkulera som är resistenta mot <b>alla</b> antibiotika man kan använda mot sjukdomen.</p>
    <div class="box link"><p>Rifampicin slår mot steget DNA → RNA i bokens figur ({{go:k11.verkan|K11}}). MRSA använder sätt 3, nytt lås, och ESBL använder sätt 1, sax ({{go:k12.resistens|Resistens}}). Transposoner, hoppande gener, finns i {{go:k9.transposoner|K9}}.</p></div>
    <div class="box trick" data-h="Minnesknep: MRSA hoppar, ESBL klipper, TB samlar"><p>MRSA: genpaketet hoppar (transposon) och ger ett nytt lås. ESBL: plasmiden ger en sax. TB: samlar resistensgener, tills inget antibiotikum biter.</p><p>Siffrorna 2010: <b>1 500 / 15</b> och <b>5 000 / 200</b>. ESBL har flest fall.</p></div>
    <div class="box trap"><p>MRSA: transposon. ESBL: plasmid. Blanda inte ihop dem.</p><p>Multiresistent = fler än tre <b>ytterligare</b> resistensgener.</p><p>ESBL-bakterierna är gramnegativa och bor normalt i tarmen. MRSA är gula stafylokocker som många har på huden.</p></div>
    <div class="box extra"><p>Bokens siffror gäller 2010. Antalet fall av både MRSA och ESBL i Sverige har ökat sedan dess. På provet gäller bokens siffror. Tuberkulos som är resistent mot både rifampicin och isoniazid kallas <b>MDR-TB</b> (multiresistent tuberkulos).</p></div>
    <div class="x" data-x="whoK12"></div>
  `},
  /* ================= kuren ================= */
  {id:"kuren", h:"Viktigt att ta hela kuren", nav:"Hela kuren", src:"s. 214–215 · PPT bild 12", prov:true, html:`
    <p>Läraren har en egen bild om detta {{lek:Antibiotika bild 12}}. När man har börjat ta antibiotika tar det ett tag innan alla bakterier har försvunnit, men ofta känner man sig bättre efter några dagar. Det är viktigt att ta antibiotika <b>så länge som läkaren har ordinerat</b>, även om man känner sig bra tidigare {{prov}}. Om man slutar för tidigt kan några bakterier överleva och börja föröka sig. Infektionen kan då komma tillbaka.</p>
    <div class="box key"><p><b>Boken:</b> de patienter som måste använda antibiotika ska få relativt <b>höga doser</b>, fortsätta behandlingen <b>tiden ut</b> och inte sluta när symptomen försvinner. {{src:s. 214}}</p><p><b>Läraren:</b> viktigt att ta hela kuren, så länge som läkaren har ordinerat. {{src:PPT bild 12}}</p></div>
    <h3>Bokens förklaring</h3>
    <ol class="chainv"><li>Genvarianter som ger <b>svag motståndskraft</b> mot ett antibiotikum uppstår och cirkulerar relativt ofta.</li><li>Bakterier med sådana gener dödas av höga doser.</li><li>Vid låga doser eller oregelbundet intag kan de däremot överleva, föröka sig och sprida sig.</li><li>Sedan kan de mutera vidare eller kombinera sina gener med varandra.</li><li>Då uppkommer allt mer resistenta bakterier.</li></ol>
    <div class="box diff"><p><b>Boken</b> förklarar rådet med resistens: svagt motståndskraftiga bakterier överlever låga doser och blir allt mer resistenta (s. 214–215). <b>Läraren</b> förklarar med återfall: slutar man för tidigt kan några bakterier överleva och infektionen komma tillbaka (bild 12). Förklaringarna är olika, men rådet är detsamma. Ge gärna båda på provet.</p></div>
    <p>Testa själv i simuleringen i {{go:k12.selektion|Selektion}}: välj start "bara svaga" (bara svagt motståndskraftiga bakterier) och jämför låg dos med hög dos.</p>
    <h3>Varför blir man inte alltid frisk av antibiotika?</h3>
    <p>Den vanligaste orsaken till att man inte blir bra trots antibiotika är att infektionen inte beror på bakterier, utan på <b>virus</b> {{lek:Antibiotika bild 12}}. Det finns också andra orsaker:</p>
    <ul><li>man har fått <b>fel sorts</b> antibiotika ({{go:k11.spektrum|K11 Spektrum}})</li><li>man har fått för <b>låg dos</b></li><li>man har behandlats för <b>kort tid</b>.</li></ul>
    <table class="cmp"><tr><th>Orsak</th><th>Varför det inte hjälper</th></tr>
      <tr><td>Virus (vanligast)</td><td>antibiotika verkar bara mot bakterier</td></tr>
      <tr><td>Fel sorts antibiotika</td><td>det har inte effekt mot just den bakterien</td></tr>
      <tr><td>För låg dos</td><td>bakterier, t.ex. svagt motståndskraftiga, överlever</td></tr>
      <tr><td>För kort tid</td><td>några bakterier överlever och infektionen kommer tillbaka</td></tr></table>
    <div class="box extra"><p>En del experter diskuterar i dag om kortare kurer räcker för vissa infektioner. Hur lång kuren ska vara bestämmer läkaren. Följ alltid läkarens ordination, och på provet gäller bokens och lärarens råd.</p></div>
    <div class="box fab"><p>Sabotörerna måste skickas in med full styrka och stanna tills sista verkstaden har stängt. Drar man tillbaka dem för tidigt finns några verkstäder med ett halvbra försvar kvar, och de hinner förbättra sitt receptkort till nästa gång.</p></div>
    <div class="box trap"><p>Sluta inte när symptomen försvinner. Bakterier, bland annat sådana med svag motståndskraft, kan finnas kvar.</p><p>Den vanligaste orsaken till att antibiotika inte hjälper är virus, inte resistens.</p></div>
    <div class="x" data-x="mcKur"></div>
  `}
  ],
  figs:{
    vaccprog:{vb:"0 0 470 432",svg:figVacc(),
      labels:[["alla barn",12,104,null,null,"s"],["barn med|ökad risk",12,234,null,null,"s"],["äldre och|riskgrupper",12,299,null,null,"s"],["resenärer",12,371,null,null,"s"],
        ["difteri, stelkramp, halsfluss",204,35,null,null,"s"],["mässling, röda hund, påssjuka",204,71,null,null,"s"],["polio",204,107,null,null,"s"],["papillomavirus",204,143,null,null,"s"],
        ["pneumokocker,|Haemophilus influenzae",204,172,null,null,"s"],["tuberkulos",204,233,null,null,"s"],["hepatit B",204,259,null,null,"s"],["influensa, varje år",204,310,null,null,"s"],["gula febern, kolera",204,372,null,null,"s"]],
      parts:{
        alla:{t:"Alla barn",d:"Alla barn i Sverige erbjuds vaccin mot tre bakteriesjukdomar (difteri, stelkramp, halsfluss), tre virussjukdomar (mässling, röda hund, påssjuka), polio, papillomavirus och två bakterier som kan orsaka lunginflammation (pneumokocker och <i class=\"sp\">Haemophilus influenzae</i>).",go:"k12.vaccin"},
        risk:{t:"Barn med ökad risk att smittas",d:"Erbjuds också vaccin mot tuberkulos (en bakterie) och gulsotsviruset hepatit B."},
        aldre:{t:"Äldre och riskgrupper",d:"Äldre, personer med nedsatt immunförsvar och personer med lungsjukdomar uppmanas att vaccinera sig mot influensa varje år, eftersom influensa ökar risken för allvarlig lunginflammation."},
        resa:{t:"Resenärer",d:"Inför resor till vissa länder rekommenderas vaccin mot smittämnen man riskerar att möta på resmålet, som gula febern och kolera."}},
      cap:"Det svenska vaccinationsprogrammet enligt bokens faktaruta. Stav = bakterie, sexhörning = virus. Att gula febern är ett virus och kolera en bakterie står inte i boken.",
      src:"Bok s. 212"},
    resmek:{vb:"0 0 470 316",svg:figResmek(),
      labels:[["antibiotika",80,46,54,76,"m"],["cellmembran",235,46,180,126,"m"],["fäster inte",390,46,414,170,"m"],
        ["protein som|klipper sönder|antibiotikan",80,270,96,206,"m"],["protein som|transporterar ut|antibiotikan",235,270,235,150,"m"],["förändrat|målprotein",390,270,390,238,"m"]],
      parts:{
        sax:{t:"1 Sax",d:"Resistensgenen beskriver ett protein som helt enkelt klipper sönder antibiotikan. Så gör ESBL-bakterierna med penicillin.",go:"k12.mordare"},
        ut:{t:"2 Utkastare",d:"Resistensgenen beskriver ett protein som transporterar ut antibiotikan ur bakterien, genom cellmembranet."},
        las:{t:"3 Nytt lås",d:"Resistensgenen är en förändrad gen för det protein som antibiotikan normalt binder. Antibiotikan kan inte längre fästa vid proteinet. Så gör MRSA.",go:"k12.mordare"}},
      cap:"Bokens tre sätt som en resistensgen kan skydda en bakterie. Sexhörningarna är antibiotikamolekyler. Boken har ingen bild här.",
      src:"Bok s. 213"},
    selpat:{vb:"0 0 470 300",svg:figSel(),
      labels:[["resistent bakterie",74,42,90,92,"m"],["antibiotika",235,42,235,79,"m"],["ledig plats",396,42,348,72,"m"],
        ["känslig bakterie",74,248,58,206,"m"],["död känslig|bakterie",235,248,219,206,"m"],["de resistenta|delar sig",396,248,392,208,"m"]],
      parts:{
        fore:{t:"1 Före",d:"Bland många känsliga bakterier finns en resistent. Den har ingen fördel så länge det inte finns antibiotika."},
        ab:{t:"2 Antibiotika",d:"Patienten behandlas med \"dess\" antibiotikum. Den resistenta bakteriens konkurrenter dödas."},
        efter:{t:"3 Efter",d:"Den resistenta bakterien får fritt fram att dela sig och fylla upp den lediga platsen. Därför skapar antibiotika ett starkt selektivt tryck för bakterier med resistensgener.",go:"k12.selektion"}},
      cap:"Selektion i en patient, efter bokens text. Antibiotikan gör ingen bakterie resistent. Den väljer ut den som redan var det.",
      src:"Bok s. 214"},
    spridvag:{vb:"0 0 470 300",svg:figSprid(),
      labels:[["resistenta|bakterier",235,214,235,186,"m"],["mellan människor:|handhygien",14,112,null,null,"s"],["djur och|livsmedel",456,118,null,null,"e"],
        ["i miljön: avlopp|och jordbruk",14,264,null,null,"s"],["antibiotikarester",14,172,96,192,"s"],["resor och|handel",456,270,null,null,"e"]],
      parts:{
        mitt:{t:"Resistenta bakterier",d:"Att bära på resistenta bakterier behöver inte göra en sjuk, men det ökar risken för spridning till andra och för framtida, svårbehandlade infektioner (lärarens bild 4)."},
        manniska:{t:"Mellan människor",d:"Till exempel via nära kontakt eller bristande handhygien (lärarens bild 6)."},
        djur:{t:"Via djur och livsmedel",d:"Antibiotika används även inom djurhållning (lärarens bild 6). Boken: bakterier hos fåglar och smågnagare runt stora djurbesättningar bär resistensgener.",go:"k12.selektion"},
        miljo:{t:"I miljön",d:"Antibiotikarester från avloppsvatten och jordbruk kan bidra till resistensutveckling (lärarens bild 6)."},
        resor:{t:"Resor och handel",d:"Bakterier känner inga gränser. Resistens som uppstår i ett land kan snabbt spridas globalt genom resor och handel, och därför krävs internationellt samarbete (lärarens bild 6)."}},
      cap:"Hur resistenta bakterier sprids i samhället, efter lärarens bild 6.",
      src:"PPT Antibiotika bild 4, 6"}
  },
  ex:{
    sortVacc:{ty:"sort", h:"Bakterie eller virus?", cats:["Bakterie","Virus"], items:[
      ["Difteri",0,"En av bokens tre bakteriesjukdomar (DiSH)."],
      ["Stelkramp",0,"En av bokens tre bakteriesjukdomar."],
      ["Halsfluss",0,"En av bokens tre bakteriesjukdomar."],
      ["Mässling",1,"En av bokens tre virussjukdomar (MRP)."],
      ["Röda hund",1,"En av bokens tre virussjukdomar."],
      ["Påssjuka",1,"En av bokens tre virussjukdomar."],
      ["Polio",1,"Boken: virussjukdomen polio."],
      ["Papillomavirus",1,"Ett virus som kan orsaka vårtor och kondylom och öka risken för livmoderhalscancer."],
      ["Pneumokocker",0,"En av de två bakterierna som kan orsaka lunginflammation."],
      ["Haemophilus influenzae",0,"En bakterie, trots namnet. Influensa är ett virus."],
      ["Tuberkulos",0,"Orsakas av en bakterie (s. 215)."],
      ["Hepatit B",1,"Boken kallar det gulsotsviruset."],
      ["Influensa",1,"Ett virus. Riskgrupperna vaccineras varje år."]
    ], src:"s. 212"},
    matchMek:{ty:"match", h:"Para ihop försvar och verkan", pairs:[
      ["Sax","ett protein klipper sönder antibiotikan"],
      ["Utkastare","ett protein transporterar ut antibiotikan ur bakterien"],
      ["Nytt lås","målproteinet är förändrat, så antibiotikan kan inte fästa"],
      ["ESBL","plasmid med gen för ett protein som klipper sönder penicillin"],
      ["MRSA","transposon med en förändrad version av enzymet för cellväggen"]
    ], why:"Bokens tre sätt (s. 213) och exemplen från faktarutan Mördarbakterier (s. 215).", src:"s. 213, 215"},
    tfRes:{ty:"tf", h:"Sant eller falskt om resistens", items:[
      ["Resistensgener fanns i naturen långt innan människan började använda antibiotika.",true,"De flesta antibiotika tillverkas naturligt av bakterier och svampar som vapen mot konkurrenter. Därför har många bakterier gener för motståndskraft (s. 213)."],
      ["Antibiotikan gör de känsliga bakterierna resistenta.",false,"Antibiotikan selekterar. Den dödar de känsliga, så att de som redan var resistenta får plats (s. 214)."],
      ["Det är patienten som blir resistent mot antibiotika.",false,"Det är bakterierna som blir resistenta, inte människor eller djur (lärarens bild 2)."],
      ["Resistensgener kan flyttas mellan bakterier av olika arter.",true,"Boken: resistensgener kan flyttas från en bakterie till en annan, även över artgränser (s. 214)."],
      ["Vid nytt lås är det antibiotikamolekylen som har ändrat form.",false,"Det är genen för bakteriens målprotein som är förändrad. Antibiotikan kan inte längre fästa vid proteinet (s. 213)."],
      ["Att bära på resistenta bakterier betyder alltid att man är sjuk.",false,"Det behöver inte innebära att man blir sjuk, men det ökar risken för spridning och framtida svårbehandlade infektioner (lärarens bild 4)."],
      ["Nya resistensgener kan uppkomma slumpmässigt.",true,"Boken s. 213. Antibiotikan skapar sedan ett selektivt tryck som gynnar dem."]
    ], src:"s. 213–214 · PPT bild 2, 4"},
    mcSprid:{ty:"mc", h:"Spridning i samhället", items:[
      {q:"Vilka tre spridningsvägar för resistenta bakterier nämner läraren på bild 6?",o:["Mellan människor, via djur och livsmedel, i miljön","Via luften, via vatten, via insekter","Bara mellan människor på sjukhus","Via vaccin, via antibiotika, via mat"],why:"Mellan människor (nära kontakt, bristande handhygien), via djur och livsmedel (djurhållning) och i miljön (antibiotikarester från avlopp och jordbruk)."},
      {q:"Varför krävs internationellt samarbete mot resistens enligt läraren?",o:["Resistens i ett land kan snabbt spridas globalt genom resor och handel","Alla länder använder samma antibiotika","Bakterier kan inte resa själva","Vaccin tillverkas bara i ett land"],why:"\"Bakterier känner inga gränser\" (bild 6)."},
      {q:"Varför är modern sjukvård beroende av effektiva antibiotika?",o:["Cancerbehandlingar, transplantationer och operationer innebär en ökad infektionsrisk","De behövs mot alla virusinfektioner","De ersätter vaccin","De gör operationer kortare"],why:"Lärarens bild 5. Även enklare tillstånd, som urinvägsinfektion, kan kräva antibiotika."}
    ], src:"PPT Antibiotika bild 5–6"},
    ordSel:{ty:"order", h:"Selektion i patienten", intro:"Lägg bokens förlopp i rätt ordning.", items:[
      "En resistent bakterie finns bland många känsliga",
      "Patienten behandlas med \"dess\" antibiotikum",
      "Den resistenta bakteriens konkurrenter dödas",
      "Den resistenta bakterien delar sig och fyller upp den lediga platsen",
      "Resistenta bakterier dominerar och är besvärliga att bli av med"
    ], why:"Antibiotikan skapar ett starkt selektivt tryck för bakterier med resistensgener (s. 214).", src:"s. 214"},
    chainK12:{ty:"chain", h:"Saknad länk", items:[
      {h:"Plasmiden försvinner", steps:["Resistensgenen sitter på en plasmid","Plasmiden kopieras inför delningen","Inget maskineri fördelar plasmiderna, så ibland blir en dotterbakterie utan","Utan antibiotika förloras plasmiderna i det långa loppet"], b:2, w:["Antibiotikan klipper sönder plasmiden","Plasmiden kopieras aldrig"], why:"Bokens förklaring (s. 214). Resistenta bakterier blir färre så länge vi inte selekterar för dem."},
      {h:"Låg dos", steps:["Genvarianter med svag motståndskraft uppstår ofta","Vid låg dos eller oregelbundet intag överlever de","De förökar sig, sprids och muterar vidare eller kombinerar gener","Allt mer resistenta bakterier uppkommer"], b:1, w:["Vid låg dos dör alla bakterier","Patienten blir resistent"], why:"Därför ska dosen vara relativt hög och behandlingen fortsätta tiden ut (s. 214–215)."},
      {h:"Hygien", steps:["Man följer hygienråden överallt","Färre smittas av bakterier","Färre behöver behandlas med antibiotika","Mindre spridning av resistenta bakterier"], b:2, w:["Bakterierna blir känsligare","Fler behöver antibiotika"], why:"Det viktigaste är också det enklaste (s. 215)."},
      {h:"MRSA på sjukhus", steps:["Många har gula stafylokocker på huden","De kan vara inblandade när sår blir infekterade","Man ger antibiotika mot sårinfektioner vid operationer","Man har selekterat för MRSA världen över"], b:2, w:["Man vaccinerar mot gula stafylokocker","Man slutar operera"], why:"Faktarutan Mördarbakterier (s. 215)."}
    ]},
    clozeRad:{ty:"cloze", h:"Bokens fem råd", text:"1. Håll tillbaka antibiotika i [[sjukvården]], t.ex. vid [[öroninflammation|öroninflammationer]] som normalt läker av sig själva. 2. Ge relativt [[höga]] doser och fortsätt behandlingen [[tiden ut]]. 3. Begränsa antibiotika i [[djurhållning|djurhållningen|boskapsskötsel]], bara för att behandla infektioner som verkligen bryter ut. 4. Var försiktig med [[sällskapsdjur]]. 5. Undvik att [[sprida]] bakterier, och följ [[hygienråd|hygienråden]] överallt.", bank:true, why:"Boken s. 214–215. Minnesknep: Sju Duktiga Djur Sover Hemma."},
    fixK12:{ty:"fix", h:"Hitta felet i Pelles förklaring", parts:[
      "När man behandlar en infektion med antibiotika ",
      ["blir några bakterier resistenta av antibiotikan","dödas de känsliga bakterierna, så att de som redan var resistenta får plats","Antibiotikan selekterar. Den skapar inte resistensen (s. 214)."],
      ". Resistensgenerna sitter ",
      ["alltid på plasmider","i många fall på plasmider, men hos MRSA i en transposon","Boken skriver \"i många fall\" (s. 214), och MRSA har en transposon (s. 215)."],
      ". Om vi slutar använda antibiotika försvinner plasmiderna med tiden, eftersom ",
      ["antibiotikan inte längre skyddar dem","det inte finns något maskineri som ser till att båda dotterbakterierna får en plasmid","Ibland blir en dotterbakterie utan, och utan selektion förloras plasmiderna (s. 214)."],
      ". Det viktigaste rådet är att följa hygienråden."
    ], src:"s. 214–215"},
    whoK12:{ty:"who", h:"Vem är jag?", items:[
      {clues:["Jag bär ett hoppande genpaket.","Mitt förändrade enzym är helt okänsligt för cellväggsantibiotika.","Jag är en meticillinresistent gul stafylokock."], a:"MRSA", w:["ESBL","Resistent TB","Haemophilus influenzae"], why:"Transposon och nytt lås. Sverige 2010: 1 500 fall, 15 djupa (s. 215)."},
      {clues:["Jag är en gramnegativ stav.","Jag bor normalt i tarmen, ofta som E. coli.","Min plasmid ger ett protein som klipper sönder penicillin."], a:"ESBL-producerande enterobakterie", w:["MRSA","Pneumokock","Resistent TB"], why:"Plasmid och sax. Sverige 2010: 5 000 fall, 200 djupa (s. 215)."},
      {clues:["Bara ett fåtal antibiotika biter på mig.","Många av mina släktingar tål rifampicin och isoniazid.","Jag orsakar tuberkulos."], a:"Resistent tuberkulosbakterie", w:["MRSA","ESBL","Influensavirus"], why:"Under 2000-talet cirkulerar stammar som är resistenta mot alla antibiotika (s. 215)."},
      {clues:["Jag kopieras inför varje delning.","Inget maskineri ser till att båda dotterbakterierna får mig.","Jag är en liten extra DNA-molekyl, ofta med resistensgener."], a:"Plasmid", w:["Kromosom","Transposon","Ribosom"], why:"Därför kan resistensen försvinna när vi inte selekterar för den (s. 214)."}
    ], src:"s. 214–215"},
    mcKur:{ty:"mc", h:"Hela kuren", items:[
      {q:"Vad är den vanligaste orsaken till att man inte blir frisk av antibiotika enligt läraren?",o:["Infektionen beror på virus","Bakterierna är resistenta","Man har tagit för hög dos","Man har druckit för lite vatten"],why:"Lärarens bild 12. Antibiotika verkar inte mot virus."},
      {q:"Varför ska dosen vara relativt hög enligt boken?",o:["Bakterier med svag motståndskraft dödas av höga doser men överlever låga","Höga doser gör patienten immun","Höga doser förstör plasmiderna","Låga doser verkar bara mot virus"],why:"Vid låga doser kan de svagt motståndskraftiga överleva, föröka sig och bli allt mer resistenta (s. 214–215)."},
      {q:"Vad kan hända om man slutar ta antibiotika för tidigt, enligt läraren?",o:["Några bakterier överlever, förökar sig och infektionen kommer tillbaka","Bakterierna blir virus","Man blir allergisk","Ingenting, man är ju frisk"],why:"Lärarens bild 12. Ta antibiotika så länge läkaren har ordinerat."}
    ], src:"s. 214–215 · PPT bild 12"}
  },
  w:{
    /* ---------- Selektion över tid ---------- */
    selSim(el,api){
      el.className="wid";const P="k12-sel";
      const CW=10,RW=8,N=CW*RW,CS=24,GX=6,GY=8;
      const COL=[null,"--c-vac","--mid","--bad"],NAME=["ledig","känslig","svagt motståndskraftig","resistent"];
      el.innerHTML=`<div class="wh"><b>Selektion över tid</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0"><svg viewBox="0 0 420 260" role="img" aria-label="Bakterier i en patient och en kurva över antalet bakterier av varje sort"></svg></figure>
      <div>${segHTML(P+"-sc","Start",[["res","en resistent"],["svag","bara svaga"]],"res")}
      ${segHTML(P+"-dos","Dos",[["0","ingen"],["lag","låg"],["hog","hög"]],"0")}
      <div class="row"><button class="btn sm" type="button" id="${P}-1">1 generation</button><button class="btn sm" type="button" id="${P}-10">10 generationer</button><button class="btn ghost sm" type="button" id="${P}-r">Börja om</button></div>
      <dl class="readout"><dt>Generation</dt><dd id="${P}-g"></dd><dt>Känsliga</dt><dd id="${P}-k"></dd><dt>Svagt motståndskraftiga</dt><dd id="${P}-s"></dd><dt>Resistenta</dt><dd id="${P}-re"></dd><dt>Lediga platser</dt><dd id="${P}-l"></dd></dl>
      <p class="verdict m" id="${P}-v"></p></div></div>`;
      const svg=el.querySelector("svg"),sv=api.sv;
      sv("rect",{x:GX-3,y:GY-3,width:CW*CS+6,height:RW*CS+6,rx:10,style:"fill:var(--c-cyto);stroke:var(--line2)","stroke-width":1.5},svg);
      const gG=sv("g",{},svg);
      const cx0=262,cy0=26,cw=152,ch=164;
      sv("path",{d:`M${cx0} ${cy0} V${cy0+ch} H${cx0+cw}`,fill:"none",style:"stroke:var(--muted)","stroke-width":1.5},svg);
      const t1=sv("text",{x:cx0+cw,y:cy0+ch+16,"text-anchor":"end",class:"lbs",style:"font-size:13px;fill:var(--muted)"},svg);t1.textContent="generationer";
      const t2=sv("text",{x:cx0,y:cy0-10,class:"lbs",style:"font-size:13px;fill:var(--muted)"},svg);t2.textContent="antal";
      const lines=[1,2,3].map(i=>sv("path",{d:"",fill:"none",style:`stroke:var(${COL[i]})`,"stroke-width":2.6,"stroke-linejoin":"round"},svg));
      [[1,"känslig",8],[2,"svag",110],[3,"resistent",200]].forEach(([i,t,x])=>{sv("rect",{x:x,y:232,width:20,height:12,rx:6,style:`fill:var(${COL[i]})`},svg);const tx=sv("text",{x:x+26,y:243,class:"lbs",style:"font-size:13px"},svg);tx.textContent=t});
      let cells,gen,hist,scen="res",dose="0";
      function init(){cells=new Array(N).fill(1);const idx=[...Array(N).keys()].sort(()=>Math.random()-0.5);
        for(let i=0;i<5;i++)cells[idx[i]]=2;if(scen==="res")cells[idx[5]]=3;gen=0;hist=[count()];draw()}
      function count(){const c=[0,0,0,0];cells.forEach(v=>c[v]++);return c}
      const KILL={"0":[0,0.04,0.04,0.04],lag:[0,0.55,0.08,0.04],hog:[0,0.92,0.75,0.04]};
      function step(){const kp=KILL[dose];
        for(let i=0;i<N;i++){const v=cells[i];if(v&&Math.random()<kp[v])cells[i]=0}
        const order=[...Array(N).keys()].sort(()=>Math.random()-0.5);
        order.forEach(i=>{const v=cells[i];if(!v||Math.random()>0.75)return;const r=Math.floor(i/CW),c=i%CW;const nb=[];
          for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){if(!dr&&!dc)continue;const rr=r+dr,cc=c+dc;if(rr>=0&&rr<RW&&cc>=0&&cc<CW&&!cells[rr*CW+cc])nb.push(rr*CW+cc)}
          if(nb.length){const j=nb[Math.floor(Math.random()*nb.length)];cells[j]=(v===2&&Math.random()<0.06)?3:v}});
        gen++;hist.push(count())}
      function draw(){gG.innerHTML="";
        cells.forEach((v,i)=>{if(!v)return;const x=GX+(i%CW)*CS+2,y=GY+Math.floor(i/CW)*CS+6;sv("rect",{x:x,y:y,width:20,height:12,rx:6,style:`fill:var(${COL[v]})`},gG)});
        const maxG=Math.max(20,hist.length-1);
        [1,2,3].forEach(k=>{lines[k-1].setAttribute("d",hist.map((h,g)=>`${g?"L":"M"}${r1(cx0+g/maxG*cw)} ${r1(cy0+ch-h[k]/N*ch)}`).join(" "))});
        const c=count(),q=id=>el.querySelector("#"+P+"-"+id);
        q("g").textContent=gen;q("k").textContent=c[1];q("s").textContent=c[2];q("re").textContent=c[3];q("l").textContent=c[0];
        const v=q("v");let cl="m",t;
        const alive=c[1]+c[2]+c[3];
        if(gen===0)t="Välj dos och tryck på 1 generation. Gissa först vad som händer med den sortens bakterier som tål antibiotikan.";
        else if(!alive){cl="g";t="Alla bakterier är döda. Infektionen är borta, eftersom ingen bakterie tålde dosen.";}
        else if(dose==="0")t="Utan antibiotika har de resistenta och svagt motståndskraftiga ingen fördel. Platserna fylls av den sort som redan är vanligast, alltså de känsliga.";
        else if(c[3]>0&&c[3]>=c[1]){cl="b";t="De resistenta tar över. Antibiotikan dödade deras konkurrenter, och de fick fritt fram att dela sig och fylla de lediga platserna. Antibiotikan gjorde ingen bakterie resistent. Den valde ut dem.";}
        else if(dose==="lag"&&c[2]>0){cl="b";t="Låg dos: de svagt motståndskraftiga överlever, förökar sig och får plats när de känsliga dör. Några muterar vidare till fullt resistenta (röda).";}
        else if(dose==="hog"&&c[3]===0){cl="g";t="Hög dos: även de svagt motståndskraftiga dör. Fortsätt behandlingen tiden ut, så att ingen hinner mutera vidare.";}
        else t="De känsliga dör och lämnar lediga platser. Titta på vem som fyller dem.";
        v.className="verdict "+cl;v.textContent=t}
      segWire(el,P+"-sc",v=>{scen=v;init()});
      segWire(el,P+"-dos",v=>{dose=v;draw()});
      el.querySelector(`#${P}-1`).addEventListener("click",()=>{step();draw()});
      el.querySelector(`#${P}-10`).addEventListener("click",()=>{for(let i=0;i<10;i++)step();draw()});
      el.querySelector(`#${P}-r`).addEventListener("click",()=>{dose="0";segSet(el,P+"-dos","0");init()});
      init();
    },
    /* ---------- Plasmider som försvinner ---------- */
    plasSim(el,api){
      el.className="wid";const P="k12-pl";const N=100;
      el.innerHTML=`<div class="wh"><b>Försvinner resistensen?</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0"><svg viewBox="0 0 420 260" role="img" aria-label="Hundra bakterier, med eller utan plasmid, och en kurva över andelen med plasmid"></svg></figure>
      <div><label class="ctl">Risk att en dotterbakterie blir utan plasmid: <b id="${P}-pv"></b><input type="range" id="${P}-p" min="1" max="20" step="1" value="8"></label>
      ${segHTML(P+"-ab","Antibiotika",[["av","nej"],["pa","ja"]],"av")}
      <div class="row"><button class="btn sm" type="button" id="${P}-1">1 generation</button><button class="btn sm" type="button" id="${P}-10">10 generationer</button><button class="btn ghost sm" type="button" id="${P}-r">Börja om</button></div>
      <dl class="readout"><dt>Generation</dt><dd id="${P}-g"></dd><dt>Med plasmid</dt><dd id="${P}-m"></dd><dt>Utan plasmid</dt><dd id="${P}-u"></dd></dl>
      <p class="verdict m" id="${P}-v"></p></div></div>`;
      const svg=el.querySelector("svg"),sv=api.sv;
      sv("rect",{x:2,y:2,width:226,height:226,rx:12,style:"fill:var(--c-cyto);stroke:var(--line2)","stroke-width":1.5},svg);
      const gG=sv("g",{},svg);
      const cx0=252,cy0=26,cw=162,ch=182;
      sv("path",{d:`M${cx0} ${cy0} V${cy0+ch} H${cx0+cw}`,fill:"none",style:"stroke:var(--muted)","stroke-width":1.5},svg);
      [[0,"100 %"],[1,"0 %"]].forEach(([f,t])=>{const tx=sv("text",{x:cx0+(f?4:0),y:cy0+f*ch+(f?-4:-10),class:"lbs",style:"font-size:13px;fill:var(--muted)"},svg);tx.textContent=t});
      const t1=sv("text",{x:cx0+cw,y:cy0+ch+16,"text-anchor":"end",class:"lbs",style:"font-size:13px;fill:var(--muted)"},svg);t1.textContent="generationer";
      const line=sv("path",{d:"",fill:"none",style:"stroke:var(--t-plasmid)","stroke-width":2.8,"stroke-linejoin":"round"},svg);
      sv("rect",{x:8,y:238,width:20,height:12,rx:6,style:"fill:var(--c-bact-soft);stroke:var(--c-bact)","stroke-width":1.5},svg);sv("circle",{cx:18,cy:244,r:3.2,fill:"none",style:"stroke:var(--t-plasmid)","stroke-width":2},svg);
      const l1=sv("text",{x:34,y:249,class:"lbs",style:"font-size:13px"},svg);l1.textContent="med plasmid";
      sv("rect",{x:140,y:238,width:20,height:12,rx:6,style:"fill:var(--c-bact-soft);stroke:var(--c-bact)","stroke-width":1.5},svg);
      const l2=sv("text",{x:166,y:249,class:"lbs",style:"font-size:13px"},svg);l2.textContent="utan";
      let pop,gen,hist,abOn=false,dead=false;
      const pIn=el.querySelector(`#${P}-p`);
      function pr(){return +pIn.value/100}
      function init(){pop=new Array(N).fill(1);gen=0;hist=[N];dead=false;draw()}
      function step(){if(dead)return;const p=pr();let kids=[];
        pop.forEach(v=>{if(v){kids.push(1);kids.push(Math.random()<p?0:1)}else{kids.push(0);kids.push(0)}});
        if(abOn)kids=kids.filter(v=>v===1);
        if(!kids.length){dead=true;pop=[];gen++;hist.push(0);return}
        for(let i=kids.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[kids[i],kids[j]]=[kids[j],kids[i]]}
        pop=kids.slice(0,N);while(pop.length<N)pop.push(pop[Math.floor(Math.random()*pop.length)]);
        gen++;hist.push(pop.filter(v=>v).length)}
      function draw(){gG.innerHTML="";el.querySelector(`#${P}-pv`).textContent=pIn.value+" %";
        pop.forEach((v,i)=>{const x=12+(i%10)*21.5,y=12+Math.floor(i/10)*21.5;sv("rect",{x:x,y:y+4,width:19,height:12,rx:6,style:"fill:var(--c-bact-soft);stroke:var(--c-bact)","stroke-width":1.2},gG);if(v)sv("circle",{cx:x+9.5,cy:y+10,r:3.2,fill:"none",style:"stroke:var(--t-plasmid)","stroke-width":2},gG)});
        const maxG=Math.max(30,hist.length-1);
        line.setAttribute("d",hist.map((h,g)=>`${g?"L":"M"}${r1(cx0+g/maxG*cw)} ${r1(cy0+ch-h/N*ch)}`).join(" "));
        const m=pop.filter(v=>v).length,q=id=>el.querySelector("#"+P+"-"+id);
        q("g").textContent=gen;q("m").textContent=dead?"–":m+" %";q("u").textContent=dead?"–":(pop.length-m)+" %";
        const v=q("v");let cl="m",t;
        if(dead){cl="g";t="Alla bakterier dog. Ingen hade kvar plasmiden med resistensgenen, och då biter antibiotikan på alla.";}
        else if(gen===0)t="Alla bakterier har en plasmid med en resistensgen. Gissa: vad händer med andelen om det inte finns antibiotika?";
        else if(abOn){cl="b";t="Med antibiotika dör de bakterier som blivit utan plasmid. Bara de med plasmid överlever, så resistensen finns kvar. Vi selekterar för den.";}
        else if(m<50){cl="g";t="Utan antibiotika ger plasmiden ingen fördel. Varje gång en dotterbakterie blir utan plasmid finns den inte kvar hos hennes avkomma, och därför minskar de resistenta i det långa loppet.";}
        else t="Plasmiderna kopieras, men inget maskineri ser till att båda dotterbakterierna får en. Ibland blir en utan. Fortsätt och se vad som händer över många generationer.";
        v.className="verdict "+cl;v.textContent=t}
      pIn.addEventListener("input",draw);
      segWire(el,P+"-ab",v=>{abOn=v==="pa";draw()});
      el.querySelector(`#${P}-1`).addEventListener("click",()=>{step();draw()});
      el.querySelector(`#${P}-10`).addEventListener("click",()=>{for(let i=0;i<10;i++)step();draw()});
      el.querySelector(`#${P}-r`).addEventListener("click",()=>{init()});
      init();
    }
  }
});
})();
