/* K11 Antibiotika – Livets fabrik. Bok s. 212–213 + PPT Antibiotika. */
(function(){
"use strict";
/* ---------- hjälpfunktioner för figurerna ---------- */
function hexPts(cx,cy,r,rot){var p=[];for(var i=0;i<6;i++){var a=Math.PI/3*i+(rot||0);p.push((cx+r*Math.cos(a)).toFixed(1)+","+(cy+r*Math.sin(a)).toFixed(1))}return p.join(" ")}
function lcg(seed){var a=seed>>>0;return function(){a=(Math.imul(a,1664525)+1013904223)>>>0;return a/4294967296}}
/* bakteriekolonier i en näringsskål: [x,y,dead] */
function colonies(cx,cy,R,zx,zy,zr,mr,fixed,seed){
  var r=lcg(seed),pts=fixed.slice(),tries=0;
  while(pts.length<52&&tries<4000){tries++;var a=r()*Math.PI*2,d=Math.sqrt(r())*R,x=cx+Math.cos(a)*d,y=cy+Math.sin(a)*d;
    if(Math.hypot(x-zx,y-zy)<mr)continue;
    if(pts.every(function(p){return Math.hypot(p[0]-x,p[1]-y)>15}))pts.push([x,y])}
  return pts.map(function(p){return[p[0],p[1],Math.hypot(p[0]-zx,p[1]-zy)<zr]})}
function dishSVG(cx,cy,R,zx,zy,zr,fixed,seed,sc){
  sc=sc||1;var s="";
  s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(R+8*sc)+'" style="fill:var(--line2)"/>';
  s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" style="fill:var(--c-wall-soft)"/>';
  return s}
function moldSVG(x,y,s){var o="";for(var i=0;i<9;i++){var a=i/9*Math.PI*2;o+='<circle cx="'+(x+Math.cos(a)*9*s).toFixed(1)+'" cy="'+(y+Math.sin(a)*9*s).toFixed(1)+'" r="'+(6.5*s).toFixed(1)+'" style="fill:var(--c-chl)" opacity=".8"/>'}
  o+='<circle cx="'+x+'" cy="'+y+'" r="'+(10*s).toFixed(1)+'" style="fill:var(--c-chl)"/>';return o}

/* ---------- Figur: Flemings näringsskål ---------- */
var FL={cx:146,cy:152,R:120,zx:172,zy:118,zr:55};
var flCol=colonies(FL.cx,FL.cy,FL.R-10,FL.zx,FL.zy,FL.zr,24,[[208,140],[218,232],[150,170],[96,98]],7);
var flSvg=dishSVG(FL.cx,FL.cy,FL.R,FL.zx,FL.zy,FL.zr)+
  '<circle cx="'+FL.zx+'" cy="'+FL.zy+'" r="'+FL.zr+'" style="fill:var(--paper);stroke:var(--muted)" stroke-width="1.5" stroke-dasharray="5 4" opacity=".9"/>'+
  flCol.map(function(p){return p[2]?'<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="4.6" fill="none" style="stroke:var(--muted)" stroke-width="1.4" stroke-dasharray="2 2"/>':'<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="4.6" style="fill:var(--c-bact);stroke:var(--c-bact)" stroke-width="1"/>'}).join("")+
  moldSVG(FL.zx,FL.zy,1.25);

/* ---------- Figur: bokens bakterie med angreppspunkterna ---------- */
var hatch=function(id){return '<defs><pattern id="'+id+'" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" style="fill:var(--c-wall-soft)"/><path d="M0 0 V7 M0 0 H7" style="stroke:var(--c-wall)" stroke-width="1.3"/></pattern><marker id="'+id+'-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style="fill:var(--ink)"/></marker></defs>'};
var malSvg=hatch("k11-hatch")+
  '<g data-k="vagg"><rect x="20" y="62" width="272" height="178" rx="64" style="fill:url(#k11-hatch);stroke:var(--c-wall)" stroke-width="1.5"/></g>'+
  '<rect x="33" y="75" width="246" height="152" rx="52" style="fill:var(--paper);stroke:var(--c-mem)" stroke-width="2.2"/>'+
  '<g data-k="kopi"><circle cx="54" cy="151" r="19" style="fill:var(--paper);fill-opacity:0"/><path d="M63.2 141.8 A13 13 0 1 0 65.3 157.5" fill="none" style="stroke:var(--ink)" stroke-width="2.4" marker-end="url(#k11-hatch-ah)"/></g>'+
  '<text x="74" y="156" style="font-size:15px">DNA</text>'+
  '<g data-k="rna"><rect x="108" y="138" width="28" height="24" style="fill:var(--paper);fill-opacity:0"/><path d="M110 151 H132" fill="none" style="stroke:var(--ink)" stroke-width="2.4" marker-end="url(#k11-hatch-ah)"/></g>'+
  '<text x="137" y="156" style="font-size:15px">RNA</text>'+
  '<g data-k="prot"><rect x="171" y="138" width="28" height="24" style="fill:var(--paper);fill-opacity:0"/><path d="M174 151 H195" fill="none" style="stroke:var(--ink)" stroke-width="2.4" marker-end="url(#k11-hatch-ah)"/></g>'+
  '<text x="199" y="156" style="font-size:15px">proteiner</text>'+
  '<g data-k="bygg"><rect x="226" y="80" width="30" height="58" style="fill:var(--paper);fill-opacity:0"/><path d="M236 138 C 238 118 242 100 250 82" fill="none" style="stroke:var(--ink)" stroke-width="2.4" marker-end="url(#k11-hatch-ah)"/></g>';

/* ---------- Figur: penicillin och cellväggen ---------- */
function wallStrip(y,gap){var s="";for(var row=0;row<2;row++){for(var x=14+(row?13:0);x<262;x+=26){if(gap&&x+24>128&&x<160)continue;s+='<rect x="'+x+'" y="'+(y+row*12)+'" width="24" height="10" rx="2" style="fill:var(--c-wall-soft);stroke:var(--c-wall)" stroke-width="1.3"/>'}}return s}
function enzyme(x,y){return '<path d="M'+(x-22)+' '+y+' a22 15 0 1 0 44 0 h-14 l-8 -9 l-8 9 z" style="fill:var(--acc-soft);stroke:var(--acc)" stroke-width="2"/>'}
var penSvg=
  '<text x="12" y="22" class="ttl">utan penicillin</text>'+
  wallStrip(52,true)+
  '<rect x="136" y="88" width="20" height="9" rx="2" style="fill:var(--c-wall-soft);stroke:var(--c-wall)" stroke-width="1.6"/>'+
  '<path d="M146 86 V 70" fill="none" style="stroke:var(--good)" stroke-width="2.4"/><path d="M140 74 L146 64 L152 74 z" style="fill:var(--good)"/>'+
  enzyme(146,104)+
  '<path d="M12 132 H266" style="stroke:var(--c-mem)" stroke-width="5" fill="none"/>'+
  '<path d="M0 158 H440" style="stroke:var(--line)" stroke-width="1" fill="none"/>'+
  '<text x="12" y="184" class="ttl">med penicillin</text>'+
  wallStrip(214,true)+
  enzyme(146,266)+
  '<polygon points="'+hexPts(146,252,8,0)+'" style="fill:var(--t-nyckel);stroke:var(--t-nyckel)" stroke-width="1"/>'+
  '<rect x="206" y="268" width="20" height="9" rx="2" transform="rotate(-18 216 272)" style="fill:var(--c-wall-soft);stroke:var(--c-wall)" stroke-width="1.6"/>'+
  '<path d="M196 254 l12 12 M208 254 l-12 12" fill="none" style="stroke:var(--bad)" stroke-width="2.4"/>'+
  '<path d="M12 294 H266" style="stroke:var(--c-mem)" stroke-width="5" fill="none"/>';

/* ---------- Figur: ribosomen hos bakterie och människa ---------- */
function beads(pts,dashed){return pts.map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5" style="fill:'+(dashed?'none':'var(--c-golgi)')+';stroke:var(--c-golgi)" stroke-width="1.6"'+(dashed?' stroke-dasharray="2 2"':'')+'/>'}).join("")}
var ribSvg=
  '<text x="12" y="22" class="ttl">bakteriecell</text>'+
  '<path d="M44 104 H262" style="stroke:var(--c-dna)" stroke-width="3" fill="none"/>'+
  '<path d="M60 104 v6 M80 104 v6 M100 104 v6 M120 104 v6 M140 104 v6 M160 104 v6 M180 104 v6 M200 104 v6 M220 104 v6 M240 104 v6" style="stroke:var(--c-dna)" stroke-width="2" fill="none"/>'+
  '<ellipse cx="130" cy="118" rx="36" ry="14" style="fill:var(--t-ribosom)" opacity=".55"/>'+
  '<path d="M84 90 a46 28 0 0 1 92 0 a46 12 0 0 1 -14 6 h-14 l-6 -12 h-14 l-6 12 h-24 a46 12 0 0 1 -14 -6 z" style="fill:var(--t-ribosom)" opacity=".9"/>'+
  '<polygon points="'+hexPts(145,82,8,0)+'" style="fill:var(--t-nyckel);stroke:var(--paper)" stroke-width="1.5"/>'+
  '<ellipse cx="200" cy="126" rx="16" ry="10" style="fill:var(--mid-soft);stroke:var(--mid)" stroke-width="2"/>'+
  beads([[132,58],[140,48]],false)+beads([[150,40],[160,33]],true)+
  '<path d="M166 22 l12 12 M178 22 l-12 12" fill="none" style="stroke:var(--bad)" stroke-width="2.6"/>'+
  '<path d="M0 166 H440" style="stroke:var(--line)" stroke-width="1" fill="none"/>'+
  '<text x="12" y="190" class="ttl">människocell</text>'+
  '<path d="M44 266 H262" style="stroke:var(--c-dna)" stroke-width="3" fill="none"/>'+
  '<path d="M60 266 v6 M80 266 v6 M100 266 v6 M120 266 v6 M140 266 v6 M160 266 v6 M180 266 v6 M200 266 v6 M220 266 v6 M240 266 v6" style="stroke:var(--c-dna)" stroke-width="2" fill="none"/>'+
  '<ellipse cx="130" cy="281" rx="42" ry="15" style="fill:var(--t-ribosom)" opacity=".4"/>'+
  '<path d="M78 252 a52 32 0 0 1 104 0 a52 12 0 0 1 -12 7 h-80 a52 12 0 0 1 -12 -7 z" style="fill:var(--t-ribosom)" opacity=".7"/>'+
  '<rect x="138" y="232" width="18" height="12" rx="3" style="fill:var(--paper)"/>'+
  beads([[136,214],[146,205],[157,198],[168,192],[180,187],[192,183],[204,180]],false)+
  '<polygon points="'+hexPts(72,226,8,0)+'" style="fill:var(--t-nyckel);stroke:var(--paper)" stroke-width="1.5"/>'+
  '<path d="M84 230 q14 4 8 18" fill="none" style="stroke:var(--muted)" stroke-width="1.6" stroke-dasharray="3 3"/>';

/* ---------- Figur: ampicillin, förenklad strukturformel ---------- */
function bond(x1,y1,x2,y2,w){return '<path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" style="stroke:var(--ink)" stroke-width="'+(w||2)+'" fill="none"/>'}
function atom(x,y,t,col,r){return '<circle cx="'+x+'" cy="'+(y-5)+'" r="'+(r||9)+'" style="fill:var(--paper)"/><text x="'+x+'" y="'+y+'" text-anchor="middle" style="font-size:15px;font-weight:700;fill:'+(col||'var(--ink)')+'">'+t+'</text>'}
var bz=[[96,160],[83,182.5],[57,182.5],[44,160],[57,137.5],[83,137.5]];
var ampSvg=
  '<polygon points="'+bz.map(function(p){return p.join(",")}).join(" ")+'" style="fill:var(--sunk);stroke:var(--ink)" stroke-width="2"/>'+
  '<circle cx="70" cy="160" r="14" fill="none" style="stroke:var(--ink)" stroke-width="1.6"/>'+
  bond(96,160,122,145)+bond(122,145,122,118)+bond(122,145,148,160)+bond(148,160,148,186)+bond(153,160,153,186,1.6)+
  bond(148,160,172,145)+bond(172,145,196,160)+
  '<rect x="196" y="160" width="28" height="28" style="fill:var(--c-wall-soft);stroke:var(--ink)" stroke-width="2"/>'+
  bond(196,188,182,206)+bond(200,190,186,208,1.6)+
  '<path d="M224 160 L246 140 L270 156 L262 188 L224 188" style="fill:var(--c-wall-soft);stroke:var(--ink)" stroke-width="2"/>'+
  bond(270,156,294,146)+bond(270,156,292,170)+bond(262,188,270,214)+
  bond(57,137.5,46,120)+
  atom(122,112,"NH₂","var(--bad)",15)+atom(148,203,"O")+atom(172,146,"NH",null,12)+atom(180,224,"O")+atom(246,146,"S")+atom(224,193,"N")+atom(272,232,"COOH",null,22)+
  '<circle cx="36" cy="104" r="17" style="fill:var(--paper);stroke:var(--bad)" stroke-width="1.6" stroke-dasharray="4 3"/>'+
  '<text x="36" y="109" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--bad)">OH</text>';

G.def({
  id:"k11",
  src:{bok:"s. 212–213", ppt:"Antibiotika, bild 1–3, 11, 13–20"},
  threads:["vagg","ribosom","nyckel","membran","endo"],
  goals:[
    "ge bokens definition av antibiotika och förklara varför de hjälper mot bakterier men inte mot virus",
    "berätta steg för steg hur Fleming upptäckte penicillinet och vilken slutsats han drog",
    "förklara steg för steg hur penicillin dödar en bakterie och varför det framför allt verkar mot grampositiva",
    "para ihop antibiotikagrupper med det de slår mot, både i bokens figur och i lärarens fyra verkningsmekanismer",
    "förklara varför antibiotika som blockerar ribosomen dödar bakterier men skonar människans celler",
    "förklara vad en aminogrupp och en hydroxylgrupp gör med penicillin (ampicillin)",
    "förklara smalt och brett spektrum och varför det spelar roll var infektionen sitter"
  ],
  intro:`<p>I {{go:k8|K8}} och {{go:k9|K9}} lärde du dig hur bakteriens verkstad är byggd: cellvägg, cellmembran, DNA, ribosomer och plasmider. Nu kommer sabotörerna. Antibiotika smyger in i verkstaden och stänger av en maskin som bakterien behöver, och de flesta av maskinerna ser annorlunda ut i våra egna celler. I {{go:k12|K12}} ser du sedan hur verkstaden slår tillbaka.</p>`,
  secs:[
  /* ================= antibiotika ================= */
  {id:"antibiotika", h:"Vad är antibiotika?", nav:"Antibiotika", src:"s. 212 · PPT bild 2–3", prov:true, html:`
    <p><b>Antibiotika</b> är ämnen som kan döda bakterier, men som lämnar människans celler relativt oskadda {{prov}}. Därför kan de användas för att behandla <b>bakterieinfektioner</b>.</p>
    <div class="box key"><p><b>Antibiotika</b> är ämnen som kan döda bakterier, men som lämnar människans celler relativt oskadda. De kan därför användas för att behandla bakterieinfektioner. {{src:s. 212}}</p></div>
    <div class="box lek"><p>Läraren beskriver antibiotika som ett <b>samlingsbegrepp</b> för de läkemedel som används för att behandla infektioner som orsakas av bakterier. Man kan också få infektioner av andra mikroorganismer, som <b>virus</b> eller <b>svampar</b>, men då används inte antibiotika. I dagligt tal kallas antibiotika ofta för penicillin. {{lek:Antibiotika bild 3}}</p></div>
    <div class="box diff"><p><b>Boken:</b> antibiotika är ämnen som kan <b>döda</b> bakterier (s. 212). <b>Läraren:</b> antibiotika verkar genom att antingen döda bakterierna <b>eller hindra dem från att föröka sig</b> (bild 2). På provet kan du säga båda: de dödar bakterier eller hindrar dem från att föröka sig.</p></div>
    <h3>En revolution för sjukvården</h3>
    <p>De första antibiotika dök upp på <b>1940- och 50-talen</b>, och de innebar en <b>revolution</b> för sjukvården {{prov}}. En lång rad bakteriesjukdomar gick från att vara dödliga hot till lättbehandlade åkommor, eftersom man nu kunde döda bakterierna inne i kroppen. Bokens exempel är <b>lunginflammationer efter förkylningar</b> och <b>infekterade sår vid operationer</b>.</p>
    <p>Läraren säger samma sak med andra ord: antibiotika har revolutionerat modern medicin och räddat otaliga liv. Men effekten hotas nu av antibiotikaresistens {{lek:Antibiotika bild 2}}.</p>
    <h3>Baksidan</h3>
    <p>Allteftersom människan använt mer och mer antibiotika har man också <b>selekterat</b> för bakterier som är <b>resistenta</b>. Därför infekteras människor allt oftare av bakterier som är resistenta mot en eller flera av de antibiotika som vanligen används mot dem. Hur det går till läser du i {{go:k12.selektion|K12 Selektion}}.</p>
    <ol class="chainv"><li>Människan använder mer och mer antibiotika.</li><li>Man selekterar för bakterier som är resistenta.</li><li>Människor infekteras allt oftare av bakterier som tål en eller flera av de vanliga antibiotikan.</li></ol>
    <table class="cmp"><tr><th></th><th>Bakterie</th><th>Virus</th></tr>
      <tr><td>Vad är det?</td><td>en cell, en verkstad i ett enda rum ({{go:k8|K8}})</td><td>arvsanlag i ett proteinpaket som tar över en levande cell ({{go:k10.virus|K10}})</td></tr>
      <tr><td>Hjälper antibiotika?</td><td>ja</td><td>nej {{lek:bild 2–3, 12}}</td></tr>
      <tr><td>Exempel från s. 212</td><td>lunginflammation efter förkylning, infekterade operationssår</td><td>mässling, polio, influensa (vaccin i stället, {{go:k12.vaccin|K12}})</td></tr></table>
    <div class="box fab"><p>Bakterien är en <b>verkstad i ett enda rum</b>. Antibiotika är <b>sabotörer</b> som smyger in och stänger av en maskin som bara finns i verkstaden, till exempel maskinen som bygger staketet (cellväggen) eller arbetsbänkarna (ribosomerna). Våra egna fabriker har andra maskiner, och därför klarar de sig relativt oskadda. Ett virus är en kapare utan egen fabrik, och därför har sabotörerna ingenting att förstöra där {{extra}}.</p></div>
    <div class="box trap"><p>Antibiotika hjälper bara mot bakterieinfektioner. Mot virus och svampar används inte antibiotika (lärarens bild 3).</p><p>"Relativt oskadda" betyder att våra celler klarar sig mycket bättre än bakterierna. Det betyder inte att antibiotika är helt ofarliga.</p><p>I vardagen säger man "penicillin" om all antibiotika. Penicillin är bara ett av många antibiotika.</p></div>
    <div class="x" data-x="tfAb"></div>
  `},
  /* ================= fleming ================= */
  {id:"fleming", h:"Penicillin och Flemings upptäckt", nav:"Fleming", src:"s. 212 · PPT bild 14–15", prov:true, html:`
    <p>Det antibiotikum som används mest i Sverige är <b>penicillin</b> {{prov}}. Det är också det första antibiotikum som upptäcktes. Penicillin tillverkas av <b>mögelsvampar</b>.</p>
    <p>Penicillinet upptäcktes av den brittiske forskaren <b>Alexander Fleming</b>, som levde <b>1881–1955</b>. Läraren visar ett foto av honom i laboratoriet bland provrör och näringsskålar {{lek:Antibiotika bild 14}}.</p>
    <div class="box extra" data-h="Stavningen"><p>Boken (s. 212) och lärarens bild 15 stavar namnet <b>Flemming</b>, med två m. Han hette Alexander <b>Fleming</b>. Båda stavningarna syftar alltså på samma person.</p></div>
    <h3>Upptäckten steg för steg</h3>
    <ol class="chainv">
      <li>Fleming hade odlat bakterier i näringsskålar i sitt laboratorium.</li>
      <li>Han åkte på <b>en månads semester</b>.</li>
      <li>När han kom tillbaka hade det börjat växa <b>mögelsvampar</b> i en av näringsskålarna.</li>
      <li><b>Invid möglet hade bakterierna dött.</b></li>
      <li>Slutsats: alltså måste mögelsvampen bilda något ämne som dödar bakterierna.</li>
      <li>Fleming isolerade ämnet och gav det namnet <b>penicillin</b>, efter den typ av mögelsvampar som tillverkade det.</li>
    </ol>
    <div class="w" data-w="flemingSteg"></div>
    <div class="lfig-h" data-fig="fleming"></div>
    <div class="box key"><p><b>Penicillin</b> är det mest använda antibiotikumet i Sverige och det första som upptäcktes. Det tillverkas av mögelsvampar och upptäcktes av Alexander Fleming (1881–1955). {{src:s. 212 · PPT bild 15}}</p></div>
    <div class="box diff"><p><b>Boken:</b> penicillin <b>tillverkas</b> av mögelsvampar. <b>Läraren:</b> penicillin <b>tillverkades först</b> av mögelsvampar (bild 15). Lärarens ordval passar med bild 17, där man ändrar penicillinmolekylen och får nya varianter ({{go:k11.ampicillin|Ampicillin}}).</p></div>
    <div class="box trick"><p><b>Fleming for på semester, möglet flyttade in.</b> En månad borta, mögel i en skål, döda bakterier runt möglet och ett nytt ämne: penicillin.</p><p>Årtalen: Fleming föddes 1881 och dog 1955. De första antibiotika kom på 1940- och 50-talen, alltså medan han levde.</p></div>
    <div class="box extra"><p>Upptäckten gjordes 1928, och mögelsläktet heter <i class="sp">Penicillium</i>. Howard Florey och Ernst Chain lyckades på 1940-talet ta fram penicillin i större mängder, och alla tre fick Nobelpriset 1945.</p></div>
    <div class="box trap"><p>Penicillin tillverkas av mögelsvampar. Mögel är svampar, alltså eukaryoter, och här dödar ett ämne från en eukaryot mikroorganism bakterier.</p><p>Ledtråden var de <b>döda bakterierna invid möglet</b>. Mögel i en skål är vanligt, men en död zon runt möglet visar att möglet bildar ett ämne som dödar bakterier.</p></div>
    <div class="box link"><p>Mögel är en mikroskopisk svamp, en eukaryot mikroorganism ({{go:k7.varld|K7}}). I {{go:k12.resistens|K12}} ser du att de flesta antibiotika produceras naturligt av bakterier eller svampar, som vapen mot konkurrenter. Flemings mögel gjorde precis det.</p></div>
    <div class="x" data-x="ordFleming"></div>
  `},
  /* ================= verkan ================= */
  {id:"verkan", h:"Hur antibiotika fungerar", nav:"Så verkar de", src:"s. 212–213 · PPT bild 13, 15, 18", prov:true, html:`
    <h3>Penicillin stoppar bygget av cellväggen</h3>
    <p>Penicillin och några andra grupper av antibiotika verkar genom att binda till och blockera ett <b>enzym</b> som behövs för att bakterier ska kunna bygga sin <b>cellvägg</b> {{prov}}.</p>
    <ol class="chainv">
      <li>Penicillin binder till och blockerar ett enzym som behövs för att bygga cellväggen.</li>
      <li>Bakterien kan inte bilda och reparera sin cellvägg.</li>
      <li>Därför kan den inte dela sig.</li>
      <li>Bakterien dör.</li>
    </ol>
    <div class="lfig-h" data-fig="penvagg"></div>
    <p>Eftersom dessa antibiotika slår mot bildandet av <b>peptidoglukan</b> är de framför allt verksamma mot <b>grampositiva</b> bakterier {{prov}}. Grampositiva har ett tjockt lager peptidoglykan utanför cellmembranet, medan gramnegativa har ett tunt lager och ett yttre membran ({{go:k8.byggnad|K8}}). Vissa varianter kan även slå mot vissa <b>gramnegativa</b> bakterier, till exempel ampicillin ({{go:k11.ampicillin|längre ned}}).</p>
    <div class="box trap"><p>Boken skriver <b>peptidoglukan</b> här (s. 213) och lärarens bild 15 gör likadant. I kapitlet om bakterier (s. 180, {{go:k8.byggnad|K8}}) står det <b>peptidoglykan</b>. Det är samma ämne: långa kedjor av kolhydrater som är korsbundna med peptider.</p><p>Penicillin blockerar ett <b>enzym</b>. Bakterien dör för att den inte kan bygga och laga cellväggen och därför inte kan dela sig.</p></div>
    <div class="box tr" data-t="vagg" data-h="Penicillin och bakteriens vägg">Penicillin slår mot bygget av bakteriens cellvägg av peptidoglukan. Djurceller saknar cellvägg ({{go:k2|K2}}), och växtens cellvägg är byggd av cellulosa ({{go:k13.cellvaggen|K13}}).</div>
    <h3>Andra antibiotika: bakteriens egna varianter</h3>
    <p>Andra antibiotika utnyttjar i stället att de molekyler som utför viktiga grundläggande mekanismer, som <b>DNA-syntes</b>, <b>replikation</b> och <b>proteinsyntes</b>, skiljer sig kraftigt mellan bakterier och eukaryoter {{prov}}. Dessa antibiotika binder därför till och blockerar <b>bakteriens variant</b> av en sådan molekyl. Det leder också till att bakterien inte kan dela sig och därmed dör.</p>
    <p>Bokens bild visar vilka processer i bakterien som några viktiga grupper av antibiotika slår mot. Bakterien kopierar sitt DNA (cirkelpilen), läser av DNA till RNA, bygger proteiner med hjälp av RNA, och proteinerna bygger cellväggen.</p>
    <div class="lfig-h" data-fig="mal"></div>
    <table class="cmp"><tr><th>Antibiotikagrupp (bokens figur)</th><th>Slår mot</th><th>Lärarens grupp (bild 13)</th></tr>
      <tr><td>penicilliner, cefalosporiner, karbapenemer</td><td>bygget av cellväggen (proteiner → cellvägg)</td><td>hämmare av cellväggssyntes</td></tr>
      <tr><td>kinoloner</td><td>kopieringen av DNA (cirkelpilen vid DNA)</td><td>hämmare av DNA-replikation</td></tr>
      <tr><td>rifampicin</td><td>steget DNA → RNA</td><td>nukleinsyrasynteshämmare</td></tr>
      <tr><td>tetracykliner, makrolider, linkosamider</td><td>steget RNA → proteiner (proteinsyntesen)</td><td>proteinsynteshämmare</td></tr></table>
    <div class="box lek" data-h="Lärarens fyra verkningsmekanismer"><p>Lärarens bild 13 delar in antibiotika i fyra grupper efter verkningsmekanism, med fler preparat än boken. Fetstil = finns också i bokens figur. {{lek:Antibiotika bild 13}}</p></div>
    <table class="cmp"><tr><th>Verkningsmekanism (bild 13)</th><th>Preparat</th></tr>
      <tr><td>Hämmare av cellväggssyntes</td><td>betalaktamer, glykopeptider</td></tr>
      <tr><td>Proteinsynteshämmare</td><td>aminoglykosider, <b>tetracykliner</b>, <b>makrolider</b>, <b>linkosamider</b>, kloramfenikol</td></tr>
      <tr><td>Nukleinsyrasynteshämmare</td><td>trimetoprim, sulfonamid, <b>rifampicin</b></td></tr>
      <tr><td>Hämmare av DNA-replikation</td><td><b>kinoloner</b>, metronidazol</td></tr></table>
    <div class="box diff"><p><b>Cellväggen:</b> boken räknar upp penicilliner, cefalosporiner och karbapenemer. Läraren skriver betalaktamer och glykopeptider. {{extra}} Penicilliner, cefalosporiner och karbapenemer hör alla till gruppen betalaktamer.</p><p><b>Rifampicin:</b> boken säger steget DNA → RNA, läraren säger nukleinsyrasyntes. Det stämmer båda, eftersom RNA är en nukleinsyra.</p><p><b>Kinoloner:</b> boken säger kopieringen av DNA, läraren säger DNA-replikation. Replikation betyder just att DNA kopieras.</p></div>
    <p>Läraren sammanfattar: andra antibiotika än penicillin blockerar i stället viktiga mekanismer, till exempel DNA-syntes, replikation och proteinsyntes {{lek:Antibiotika bild 18}}.</p>
    <div class="box trick" data-h="Minnesknep: sabotage i verkstaden"><p><b>PCK på väggen:</b> Penicilliner, Cefalosporiner och Karbapenemer stoppar maskinen som bygger staketet.</p><p><b>TML på arbetsbänken:</b> Tetracykliner, Makrolider och Linkosamider stoppar ribosomerna.</p><p><b>R som i RNA:</b> Rifampicin stoppar steget DNA → RNA. <b>K som i kopiatorn:</b> Kinoloner stoppar kopieringen av DNA.</p></div>
    <div class="box fab"><p>Sabotörerna har olika mål i verkstaden. Några stoppar maskinen som bygger staketet (cellväggen). Andra stoppar kopiatorn som kopierar ritningen (DNA), utskriften av arbetsordrar (DNA → RNA) eller arbetsbänkarna (ribosomerna). Oavsett mål blir resultatet detsamma: verkstaden kan inte dela sig och går under.</p></div>
    <div class="box extra"><p>Steget DNA → RNA kallas <b>transkription</b> och steget RNA → protein kallas <b>translation</b>. Orden står inte i boken eller i lärarens bilder.</p></div>
    <div class="box tr" data-t="nyckel" data-h="Antibiotika passar i bakteriens lås">Penicillin binder till ett enzym och tetracykliner till ribosomen. Antibiotikan måste passa exakt i sitt mål, som en nyckel i ett lås. Ändrar bakterien låset passar nyckeln inte längre, och det är ett av sätten att bli resistent ({{go:k12.resistens|K12}}).</div>
    <div class="w" data-w="abVal"></div>
    <div class="x" data-x="chainPen"></div>
    <div class="x" data-x="matchPrep"></div>
  `},
  /* ================= ribosom ================= */
  {id:"ribosom", h:"Antibiotika mot ribosomen", nav:"Ribosomen", src:"s. 213 · PPT bild 18–19", prov:true, html:`
    <p>Många av de antibiotika som används mot bakterier fungerar genom att binda till och blockera <b>ribosomen</b> eller något av <b>hjälparproteinerna</b> hos bakterier, utan att göra samma sak hos människor {{lek:Antibiotika bild 19}}. Därför kan dessa läkemedel döda bakterierna samtidigt som de omgivande människocellerna överlever.</p>
    <p>Boken förklarar varför det går: molekylerna som utför proteinsyntesen skiljer sig kraftigt mellan bakterier och eukaryoter {{prov}}. Bakteriens ribosom har en annan form än vår, och därför passar antibiotikan bara i bakteriens ribosom.</p>
    <div class="lfig-h" data-fig="ribfig"></div>
    <ol class="chainv">
      <li>Antibiotikan binder till bakteriens ribosom eller ett hjälparprotein.</li>
      <li>Proteinsyntesen, steget RNA → proteiner, stannar.</li>
      <li>Bakterien kan inte bilda de proteiner den behöver och kan inte dela sig.</li>
      <li>Bakterien dör. Människans ribosomer har en annan variant och fortsätter arbeta.</li>
    </ol>
    <table class="cmp"><tr><th></th><th>Bakteriens ribosom</th><th>Människans ribosom</th></tr>
      <tr><td>Bygger</td><td>proteiner</td><td>proteiner</td></tr>
      <tr><td>Form</td><td>bakteriens variant</td><td>eukaryot variant, skiljer sig kraftigt</td></tr>
      <tr><td>Proteinsynteshämmare</td><td>binder och blockerar</td><td>binder inte, cellen överlever</td></tr>
      <tr><td>Exempel på preparat</td><td colspan="2">tetracykliner, makrolider, linkosamider (bok + PPT), aminoglykosider, kloramfenikol (PPT)</td></tr></table>
    <div class="box fab"><p>Ribosomen är <b>arbetsbänken</b> där proteiner byggs. Bakteriens arbetsbänk är byggd på ett annat sätt än arbetsbänkarna i våra fabriker. Sabotören har en verktygsnyckel som bara passar bakteriens bänk, och därför står våra bänkar orörda.</p></div>
    <div class="box trap"><p>Proteinsynteshämmare blockerar bakteriens ribosom. Människans ribosomer är en annan variant, så våra celler fortsätter att göra proteiner.</p><p>Rifampicin slår mot steget DNA → RNA och kinoloner mot kopieringen av DNA. De är alltså inga proteinsynteshämmare.</p></div>
    <div class="box tr" data-t="ribosom" data-h="Bakteriens arbetsbänk är annorlunda">Ribosomen bygger proteiner i alla celler, men bakteriens ribosom skiljer sig från vår. Därför kan tetracykliner, makrolider och linkosamider stoppa just bakteriens arbetsbänk.</div>
    <div class="box tr" data-t="endo" data-h="Mitokondriens ribosomer">I {{go:k4.mitokondrien|K4}} såg du att mitokondrien har ribosomer av samma typ som bakterier. Det är ett av bevisen för att mitokondrien en gång var en fri bakterie.</div>
    <div class="box link"><p>Ribosomen består av två subenheter av rRNA och proteiner ({{go:k4.ribosomer|K4}}). Bakteriens ribosom skiljer sig från eukaryotens, och det är just den skillnaden lärarens bild 19 bygger på.</p></div>
    <div class="x" data-x="sortMal"></div>
  `},
  /* ================= ampicillin ================= */
  {id:"ampicillin", h:"Ampicillin: små ändringar, större användning", nav:"Ampicillin", src:"PPT bild 15–17", lek:true, html:`
    <p>Läraren visar att små ändringar av strukturen hos penicillin vidgar användningsområdet {{lek:Antibiotika bild 17}}. Man sätter till en liten kemisk grupp på penicillinmolekylen och får ett nytt läkemedel med nya egenskaper.</p>
    <div class="box key"><p>Sätter man till en <b>aminogrupp</b> (NH₂) får man <b>ampicillin</b>, som även verkar mot <b>gramnegativa</b> bakterier.</p><p>Sätter man till en <b>hydroxylgrupp</b> (OH) tas läkemedlet lättare upp av <b>mag-tarmkanalen</b>. {{src:PPT bild 17}}</p></div>
    <div class="lfig-h" data-fig="ampi"></div>
    <p>Det här är ett exempel på bokens "vissa varianter" som även kan slå mot vissa gramnegativa bakterier (s. 213) och lärarens "Det finns varianter som även kan slå mot gramnegativa" (bild 15). Vanligt penicillin verkar framför allt mot grampositiva, eftersom det slår mot bildandet av peptidoglukan.</p>
    <table class="cmp"><tr><th>Ändring</th><th>Resultat</th></tr>
      <tr><td>+ aminogrupp (NH₂)</td><td>ampicillin, verkar även mot gramnegativa bakterier</td></tr>
      <tr><td>+ hydroxylgrupp (OH)</td><td>tas lättare upp av mag-tarmkanalen</td></tr></table>
    <div class="box extra"><p>Molekylen med både aminogrupp och hydroxylgrupp heter <b>amoxicillin</b>. Namnet står inte i lärarens bild eller i boken.</p></div>
    <div class="box tr" data-t="membran" data-h="Det yttre membranet hos gramnegativa">Gramnegativa bakterier har ett yttre membran utanför sin tunna cellvägg ({{go:k8.byggnad|K8}}). {{extra}} Det yttre membranet gör det svårare för vanligt penicillin att nå fram till cellväggen, och ampicillin tar sig lättare förbi.</div>
    <div class="box link"><p>Karboxylgruppen (COOH) längst ned i molekylen känner du igen från fettsyrorna i {{go:k1.lipider|K1}}.</p></div>
    <div class="box trap"><p>Amino<b>grupp</b> → ampicillin → även gramnegativa. Hydroxyl<b>grupp</b> → lättare upptag i mag-tarmkanalen. Blanda inte ihop dem.</p></div>
    <div class="x" data-x="clozeAmpi"></div>
    <div class="x" data-x="fixPen"></div>
  `},
  /* ================= spektrum ================= */
  {id:"spektrum", h:"Rätt antibiotikum till rätt infektion", nav:"Spektrum", src:"PPT bild 11, 16, 20", lek:true, html:`
    <p>Det viktigaste när läkaren väljer antibiotika är att det har effekt mot just den bakterie som orsakar infektionen {{lek:Antibiotika bild 11}}. I första hand väljer läkaren antibiotika med <b>smalt spektrum</b>. Men patienten kan behöva antibiotika med <b>brett spektrum</b> om hen är mycket sjuk eller om det inte är helt klart vilka bakterier som orsakar infektionen. Ibland behövs till och med flera olika antibiotika samtidigt.</p>
    <table class="cmp"><tr><th></th><th>Smalt spektrum</th><th>Brett spektrum</th></tr>
      <tr><td>Verkar mot {{extra}}</td><td>ett fåtal sorters bakterier</td><td>många sorters bakterier</td></tr>
      <tr><td>När?</td><td>i första hand</td><td>vid svår sjukdom, eller när det är oklart vilka bakterier det är</td></tr></table>
    <div class="box extra"><p>Ett smalt spektrum dödar färre av de ofarliga bakterierna i kroppen och ger mindre selektion för resistenta bakterier ({{go:k12.selektion|K12}}). Det är en anledning till att man börjar med smalt spektrum.</p></div>
    <h3>Var sitter infektionen?</h3>
    <p>Läkaren måste också ta hänsyn till var infektionen sitter. Alla antibiotika passerar inte till hjärnan, och därför kan de inte användas för att behandla <b>hjärnhinneinflammation</b> {{lek:Antibiotika bild 11}}.</p>
    <h3>Grampositiv eller gramnegativ?</h3>
    <p>Vilken bakterie det är spelar roll, eftersom antibiotika verkar olika bra på olika cellväggar. Läraren repeterar gramfärgningen {{lek:Antibiotika bild 16}}, som du läste om i {{go:k8.byggnad|K8}}.</p>
    <table class="cmp"><tr><th></th><th>Grampositiv (G+)</th><th>Gramnegativ (G−)</th></tr>
      <tr><td>Cellvägg</td><td>mycket tjock, utanför plasmamembranet</td><td>tunn</td></tr>
      <tr><td>Yttre cellmembran</td><td>saknas</td><td>finns</td></tr>
      <tr><td>Färg vid gramfärgning</td><td>blå/lila</td><td>rosa/röd</td></tr>
      <tr><td>Penicillin</td><td>verkar framför allt här</td><td>bara vissa varianter, t.ex. ampicillin</td></tr></table>
    <div class="box lek"><p>Läraren tipsar om webbplatsen Antibiotikasmart (antibiotikasmart.se/fakta.html) för en överblick. {{lek:Antibiotika bild 20}}</p></div>
    <div class="box trap"><p>Brett spektrum låter bättre, men läkaren väljer i första hand smalt spektrum.</p><p>Att ett antibiotikum dödar bakterien i ett provrör räcker inte. Det måste också nå fram dit infektionen sitter, och alla antibiotika passerar inte till hjärnan.</p></div>
    <div class="x" data-x="mcSpektrum"></div>
    <div class="x" data-x="whoK11"></div>
  `}
  ],

  figs:{
    fleming:{
      vb:"0 0 440 290",
      svg:flSvg,
      labels:[
        ["näringsskål",292,40,236,64,"s"],
        ["mögelsvamp",292,96,186,110,"s"],
        ["döda bakterier|invid möglet",292,140,212,140,"s"],
        ["ämnet från möglet|sprids ut",292,200,200,166,"s"],
        ["levande|bakteriekolonier",292,250,222,232,"s"]
      ],
      cap:"Flemings näringsskål när han kom tillbaka efter en månads semester. Invid möglet hade bakterierna dött. Förenklad bild efter bokens berättelse.",
      src:"Bok s. 212"
    },
    mal:{
      vb:"0 0 440 312",
      svg:malSvg,
      labels:[
        ["rifampicin",24,36,121,148,"s"],
        ["cellvägg",172,36,196,66,"m"],
        ["penicilliner|cefalosporiner|karbapenemer",304,92,244,104,"s"],
        ["cellmembran",304,186,278,170,"s"],
        ["kinoloner",24,272,54,166,"s"],
        ["tetracykliner|makrolider|linkosamider",132,270,184,153,"s"]
      ],
      parts:{
        vagg:{t:"Cellväggen",d:"Proteinerna (enzymerna) bygger cellväggen av peptidoglukan. <b>Penicilliner, cefalosporiner och karbapenemer</b> blockerar ett enzym i bygget. Bakterien kan inte bilda och reparera väggen, kan inte dela sig och dör.",go:"k11.verkan"},
        bygg:{t:"Proteiner bygger cellväggen",d:"Pilen från proteinerna upp till väggen är bygget. Där slår <b>penicilliner, cefalosporiner och karbapenemer</b> till.",go:"k11.verkan"},
        kopi:{t:"Kopieringen av DNA",d:"Cirkelpilen betyder att DNA kopieras (replikation) före varje delning. <b>Kinoloner</b> slår mot den. Läraren: hämmare av DNA-replikation.",go:"k11.verkan"},
        rna:{t:"Steget DNA → RNA",d:"<b>Rifampicin</b> slår mot steget DNA → RNA. Läraren kallar rifampicin en nukleinsyrasynteshämmare. Rifampicin är också ett av förstahandsvalen mot tuberkulos ({{go:k12.mordare|K12}}).",go:"k11.verkan"},
        prot:{t:"Steget RNA → proteiner",d:"<b>Tetracykliner, makrolider och linkosamider</b> slår mot proteinsyntesen. Läraren: de binder bakteriens ribosom eller hjälparproteiner, men inte människans.",go:"k11.ribosom"}
      },
      cap:"Vilka processer i bakterien några viktiga grupper av antibiotika slår mot. Ritad efter bokens figur s. 213. Tryck på pilarna och väggen.",
      src:"Bok s. 213 · PPT bild 13"
    },
    penvagg:{
      vb:"0 0 440 322",
      svg:penSvg,
      labels:[
        ["cellvägg av|peptidoglukan",290,46,250,58,"s"],
        ["enzym som|bygger väggen",290,104,170,104,"s"],
        ["nytt|byggstycke",30,94,134,92,"s"],
        ["hål som|inte lagas",290,210,146,222,"s"],
        ["penicillin|blockerar enzymet",290,262,154,252,"s"],
        ["cellmembran",30,316,60,296,"s"]
      ],
      cap:"Överst bygger enzymet in ett nytt byggstycke i cellväggen. Nederst har penicillin bundit till enzymet och blockerat det. Hålet lagas inte, och bakterien kan inte dela sig. Förenklad bild.",
      src:"Bok s. 212 · PPT bild 15"
    },
    ribfig:{
      vb:"0 0 440 322",
      svg:ribSvg,
      labels:[
        ["proteinkedjan|stannar",290,22,178,30,"s"],
        ["bakteriens ribosom",290,70,170,72,"s"],
        ["antibiotikum,|t.ex. tetracyklin",290,108,153,84,"s"],
        ["hjälparprotein",290,148,214,128,"s"],
        ["RNA",12,110,null,null,"s"],
        ["proteinet byggs|färdigt",290,190,206,181,"s"],
        ["människans ribosom",290,244,178,248,"s"],
        ["antibiotikan|passar inte",12,300,72,236,"s"]
      ],
      cap:"Överst: antibiotikan passar i bakteriens ribosom och proteinsyntesen stannar. Nederst: människans ribosom har en annan form, antibiotikan binder inte och proteinet byggs färdigt. Förenklad bild efter lärarens bild 19.",
      src:"PPT bild 19 · Bok s. 213"
    },
    ampi:{
      vb:"0 0 440 290",
      svg:ampSvg,
      labels:[
        ["hydroxylgrupp (OH)",12,40,30,88,"s"],
        ["aminogrupp (NH₂)",176,40,128,96,"s"],
        ["penicillinets|grundstomme",318,130,252,168,"s"],
        ["bensenring",12,262,64,182,"s"],
        ["karboxylgrupp|(COOH)",300,250,272,238,"s"]
      ],
      cap:"Förenklad strukturformel efter lärarens bild 17. Med aminogruppen (rött) blir penicillin ampicillin, som även verkar mot gramnegativa. Sätter man också till hydroxylgruppen (streckad) tas läkemedlet lättare upp i mag-tarmkanalen.",
      src:"PPT bild 17"
    }
  },

  ex:{
    tfAb:{ty:"tf", h:"Vad är antibiotika?", items:[
      ["Antibiotika är ämnen som kan döda bakterier men lämnar människans celler relativt oskadda.",true,"Det är bokens definition (s. 212). Därför kan de användas mot bakterieinfektioner."],
      ["Antibiotika hjälper mot förkylning eftersom förkylning är en infektion.",false,"Antibiotika hjälper mot bakterieinfektioner. Mot virus och svampar används inte antibiotika (lärarens bild 2–3). Att förkylning orsakas av virus är extra."],
      ["De första antibiotika kom på 1940- och 50-talen.",true,"Och de innebar en revolution för sjukvården (s. 212)."],
      ["Infekterade sår vid operationer är ett av bokens exempel på sjukdomar som blev lättbehandlade.",true,"Det andra exemplet är lunginflammationer efter förkylningar."],
      ["Enligt läraren kan antibiotika verka genom att hindra bakterierna från att föröka sig.",true,"Bild 2: antingen döda bakterierna eller hindra dem från att föröka sig. Boken säger bara döda."],
      ["\"Relativt oskadda\" betyder att antibiotika är helt ofarliga för människan.",false,"Relativt betyder att våra celler klarar sig mycket bättre än bakterierna, inte att de är helt opåverkade."],
      ["Allt oftare infekteras människor av bakterier som är resistenta mot en eller flera vanliga antibiotika.",true,"Eftersom människan använt mer och mer antibiotika har man selekterat för resistenta bakterier (s. 212)."]
    ], src:"s. 212 · PPT bild 2–3"},
    ordFleming:{ty:"order", h:"Flemings upptäckt", intro:"Lägg bokens berättelse i rätt ordning.", items:[
      "Fleming odlar bakterier i näringsskålar.",
      "Han åker på en månads semester.",
      "Mögelsvampar har börjat växa i en av skålarna.",
      "Invid möglet har bakterierna dött.",
      "Slutsats: mögelsvampen måste bilda ett ämne som dödar bakterier.",
      "Han isolerar ämnet och kallar det penicillin, efter mögelsvampen."
    ], why:"Observationen (döda bakterier invid möglet) kommer före slutsatsen, och namnet kommer sist, efter den typ av mögelsvamp som tillverkade ämnet.", src:"s. 212"},
    chainPen:{ty:"chain", h:"Saknad länk", items:[
      {h:"Hur penicillin dödar en bakterie", steps:["Penicillin binder till och blockerar ett enzym","Bakterien kan inte bilda och reparera sin cellvägg","Bakterien kan inte dela sig","Bakterien dör"], b:1, w:["Bakteriens DNA löses upp","Bakteriens ribosomer stannar"], why:"Enzymet behövs för att bygga cellväggen. Utan vägg som kan byggas och lagas kan bakterien inte dela sig (s. 212)."},
      {h:"Varför penicillin framför allt verkar mot grampositiva", steps:["Penicillin slår mot bildandet av peptidoglukan","Grampositiva har ett tjockt lager peptidoglukan","Penicillin verkar framför allt mot grampositiva"], b:1, w:["Grampositiva saknar cellvägg","Gramnegativa har ett tjockt lager peptidoglukan"], why:"Gramnegativa har bara ett tunt lager och ett yttre membran (s. 180, 213)."},
      {h:"Hur andra antibiotika skonar våra celler", steps:["Molekylerna för DNA-syntes, replikation och proteinsyntes skiljer sig mellan bakterier och eukaryoter","Antibiotikan binder bara till bakteriens variant","Bakterien kan inte dela sig och dör, men våra celler klarar sig"], b:1, w:["Antibiotikan binder till alla celler lika mycket","Våra celler har en cellvägg som skyddar"], why:"Bokens förklaring (s. 213). Läraren ger ribosomen som exempel (bild 19)."},
      {h:"Proteinsynteshämmare", steps:["Antibiotikan binder bakteriens ribosom eller ett hjälparprotein","Proteinsyntesen stannar","Bakterien dör, människocellerna överlever"], b:0, w:["Antibiotikan binder människans ribosom","Antibiotikan bygger om cellväggen"], why:"Lärarens bild 19: samma sak händer inte hos människor."}
    ]},
    matchPrep:{ty:"match", h:"Para ihop preparat och angreppspunkt", pairs:[
      ["penicilliner, cefalosporiner, karbapenemer","bygget av cellväggen"],
      ["kinoloner","kopieringen av DNA"],
      ["rifampicin","steget DNA → RNA"],
      ["tetracykliner, makrolider, linkosamider","steget RNA → proteiner"],
      ["betalaktamer, glykopeptider (PPT)","hämmare av cellväggs\u00ADsyntes"],
      ["aminoglykosider, kloramfenikol (PPT)","proteinsyntes\u00ADhämmare"],
      ["trimetoprim, sulfonamid (PPT)","nukleinsyra\u00ADsyntes\u00ADhämmare"],
      ["metronidazol (PPT)","hämmare av DNA-replikation"]
    ], why:"De fyra första är bokens figur (s. 213). De fyra sista är lärarens bild 13.", src:"s. 213 · PPT bild 13"},
    sortMal:{ty:"sort", h:"Vad slår preparatet mot?", cats:["Cellväggen","DNA-replikation","Nukleinsyrasyntes","Proteinsyntes"], items:[
      ["Penicilliner",0,"Blockerar enzymet som bygger cellväggen (bok + PPT)."],
      ["Karbapenemer",0,"Står vid cellväggen i bokens figur."],
      ["Glykopeptider",0,"Lärarens bild 13: hämmare av cellväggssyntes."],
      ["Kinoloner",1,"Kopieringen av DNA i boken, DNA-replikation hos läraren."],
      ["Metronidazol",1,"Lärarens bild 13: hämmare av DNA-replikation."],
      ["Rifampicin",2,"Boken: steget DNA → RNA. Läraren: nukleinsyrasynteshämmare."],
      ["Trimetoprim",2,"Lärarens bild 13: nukleinsyrasynteshämmare."],
      ["Sulfonamid",2,"Lärarens bild 13: nukleinsyrasynteshämmare."],
      ["Tetracykliner",3,"Steget RNA → proteiner (bok + PPT)."],
      ["Aminoglykosider",3,"Lärarens bild 13: proteinsynteshämmare."],
      ["Kloramfenikol",3,"Lärarens bild 13: proteinsynteshämmare."],
      ["Makrolider",3,"Steget RNA → proteiner (bok + PPT)."]
    ]},
    clozeAmpi:{ty:"cloze", h:"Ampicillin", text:"Små ändringar av strukturen hos [[penicillin]] vidgar användningsområdet. Genom att sätta till en [[aminogrupp]] kan man tillverka [[ampicillin]], som även verkar mot [[gramnegativa]] bakterier. Genom att sätta till en [[hydroxylgrupp]] tas läkemedlet lättare upp av [[mag-tarmkanalen|tarmen|magtarmkanalen]].", bank:true, why:"Lärarens bild 17."},
    fixPen:{ty:"fix", h:"Hitta felet i Pelles förklaring", parts:[
      "Penicillin är det mest använda antibiotikumet i Sverige. Det dödar bakterier genom att ",
      ["lösa upp deras DNA","binda till och blockera ett enzym som behövs för att bygga cellväggen","Penicillin slår mot cellväggsbygget (s. 212). Kinoloner och rifampicin slår mot DNA och RNA."],
      ". Då kan bakterien inte dela sig och dör. Penicillin verkar framför allt mot ",
      ["gramnegativa","grampositiva","Grampositiva har ett tjockt lager peptidoglukan, som är det penicillin slår mot (s. 213)."],
      " bakterier. Om man sätter till en ",
      ["hydroxylgrupp","aminogrupp","Aminogruppen ger ampicillin, som även verkar mot gramnegativa. Hydroxylgruppen gör att läkemedlet tas lättare upp i mag-tarmkanalen (bild 17)."],
      " får man ampicillin, som även verkar mot gramnegativa bakterier."
    ], src:"s. 212–213 · PPT bild 17"},
    mcSpektrum:{ty:"mc", h:"Rätt antibiotikum", items:[
      {q:"Vilket spektrum väljer läkaren i första hand enligt läraren?", o:["Smalt spektrum","Brett spektrum","Flera antibiotika samtidigt","Det spelar ingen roll"], why:"Brett spektrum behövs om patienten är mycket sjuk eller om det är oklart vilka bakterier det är (bild 11)."},
      {q:"Varför kan inte alla antibiotika användas mot hjärnhinneinflammation?", o:["Alla antibiotika passerar inte till hjärnan","Hjärnhinneinflammation orsakas alltid av virus","Hjärnan har ingen cellvägg","Antibiotika förstör hjärnans ribosomer"], why:"Läkaren måste ta hänsyn till var infektionen sitter (bild 11)."},
      {q:"När kan en patient behöva antibiotika med brett spektrum?", o:["När hen är mycket sjuk eller när det är oklart vilka bakterier som orsakar infektionen","Alltid vid öroninflammation","Vid alla virusinfektioner","När hen har tagit antibiotika förut"], why:"Lärarens bild 11."},
      {q:"Vilken färg får en gramnegativ bakterie vid gramfärgning enligt läraren?", o:["Rosa/röd","Blå/lila","Grön","Ingen färg alls"], why:"Grampositiva blir blå/lila (bild 16)."}
    ]},
    whoK11:{ty:"who", h:"Vem är jag?", items:[
      {clues:["Jag tillverkades först av en levande organism.","Jag blockerar ett enzym som bygger cellväggen.","Jag är det mest använda antibiotikumet i Sverige."], a:"Penicillin", w:["Rifampicin","Tetracyklin","Ampicillin"], why:"Penicillin tillverkas av mögelsvampar och var det första antibiotikum som upptäcktes (s. 212)."},
      {clues:["Jag är en liten ändring av en känd molekyl.","Jag har fått en aminogrupp.","Jag verkar även mot gramnegativa bakterier."], a:"Ampicillin", w:["Penicillin","Kinoloner","Kloramfenikol"], why:"Lärarens bild 17."},
      {clues:["Jag är ett förstahandsval mot tuberkulos.","Läraren kallar mig nukleinsyrasynteshämmare.","Jag stoppar steget DNA → RNA."], a:"Rifampicin", w:["Kinoloner","Penicillin","Makrolider"], why:"Bokens figur s. 213 och faktarutan om tuberkulos s. 215."},
      {clues:["Jag levde 1881–1955.","Jag var borta en månad på semester.","Jag såg att bakterierna invid möglet hade dött."], a:"Alexander Fleming", w:["Hans Christian Gram","Louis Pasteur","Charles Darwin"], why:"Den brittiske forskaren som upptäckte penicillinet (boken stavar Flemming)."},
      {clues:["Jag hör till en grupp som heter likadant som jag.","Jag binder till bakteriens ribosom.","Jag står vid pilen RNA → proteiner i bokens figur, tillsammans med makrolider och linkosamider."], a:"Tetracykliner", w:["Karbapenemer","Kinoloner","Glykopeptider"], why:"TML på arbetsbänken."}
    ]}
  },

  w:{
    /* ---------- Flemings näringsskål steg för steg ---------- */
    flemingSteg(el,api){
      el.className="wid";const P="k11-fs";
      el.innerHTML=`<div class="wh"><b>Flemings näringsskål steg för steg</b><span class="mono">Steg för steg</span></div>
      <div class="wgrid"><figure style="margin:0"><svg viewBox="0 0 420 250" role="img" aria-label="Flemings näringsskål i fem steg"></svg></figure>
      <div><p class="verdict m" id="${P}-h"></p><p id="${P}-t"></p>
      <div class="row"><button class="btn ghost sm" type="button" id="${P}-prev">Föregående</button><button class="btn sm" type="button" id="${P}-next">Nästa steg</button></div>
      <dl class="readout"><dt>Steg</dt><dd id="${P}-n"></dd></dl></div></div>`;
      const svg=el.querySelector("svg");const sv=api.sv;
      const cx=118,cy=125,R=104,zx=140,zy=96,zr=48;
      const col=colonies(cx,cy,R-8,zx,zy,zr,20,[],11);
      sv("circle",{cx,cy,r:R+7,style:"fill:var(--line2)"},svg);
      sv("circle",{cx,cy,r:R,style:"fill:var(--c-wall-soft)"},svg);
      const zone=sv("circle",{cx:zx,cy:zy,r:zr,style:"fill:var(--paper);stroke:var(--muted)","stroke-width":1.5,"stroke-dasharray":"5 4"},svg);
      const live=sv("g",{},svg),dead=sv("g",{},svg);
      col.forEach(p=>{const c=sv("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:4.2,style:"fill:var(--c-bact);stroke:var(--c-bact)","stroke-width":1},live);if(p[2]){c.dataset.z="1";sv("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:4.2,fill:"none",style:"stroke:var(--muted)","stroke-width":1.3,"stroke-dasharray":"2 2"},dead)}});
      const mold=sv("g",{},svg);mold.innerHTML=moldSVG(zx,zy,1.1);
      const rays=sv("g",{},svg);[[0,-1],[1,0],[0,1],[-1,0],[.7,.7],[-.7,-.7],[.7,-.7],[-.7,.7]].forEach(d=>sv("path",{d:`M${zx+d[0]*18} ${zy+d[1]*18} L${zx+d[0]*40} ${zy+d[1]*40}`,style:"stroke:var(--t-nyckel)","stroke-width":2,"stroke-dasharray":"3 3",fill:"none"},rays));
      const sun=sv("g",{},svg);sv("circle",{cx:300,cy:58,r:14,style:"fill:var(--mid)"},sun);
      for(let i=0;i<8;i++){const a=i/8*Math.PI*2;sv("path",{d:`M${300+Math.cos(a)*19} ${58+Math.sin(a)*19} L${300+Math.cos(a)*25} ${58+Math.sin(a)*25}`,style:"stroke:var(--mid)","stroke-width":2.4,fill:"none"},sun)}
      const st1=sv("text",{x:330,y:54,style:"font-size:14px"},sun);st1.textContent="en månads";const st2=sv("text",{x:330,y:72,style:"font-size:14px"},sun);st2.textContent="semester";
      const pen=sv("g",{},svg);const pt=sv("text",{x:268,y:190,style:"font-size:17px;font-weight:700;fill:var(--t-nyckel)"},pen);pt.textContent="penicillin";
      const pq=sv("text",{x:268,y:212,style:"font-size:14px"},pen);pq.textContent="ämnet från möglet";
      const S=[
        ["1. Bakterier i näringsskålar","Fleming hade odlat <b>bakterier</b> i näringsskålar. Prickarna är bakteriekolonier som växer över hela skålen."],
        ["2. En månads semester","Fleming åkte på <b>en månads semester</b>. Skålarna stod kvar i laboratoriet."],
        ["3. Mögel i en skål","När han kom tillbaka hade det börjat växa <b>mögelsvampar</b> i en av skålarna. <b>Gissa först:</b> vad har hänt med bakterierna runt möglet?"],
        ["4. Döda bakterier invid möglet","<b>Invid möglet hade bakterierna dött.</b> Längre bort växte de som vanligt. Gissa slutsatsen innan du går vidare."],
        ["5. Slutsatsen","<b>Alltså måste mögelsvampen bilda något ämne som dödar bakterierna</b>, och ämnet sprids ut i skålen. Fleming isolerade ämnet och kallade det <b>penicillin</b>, efter den typ av mögelsvamp som tillverkade det."]
      ];
      let s=0;const show=(n,on)=>{n.style.display=on?"":"none"};
      function draw(){show(sun,s>=1);show(mold,s>=2);show(zone,s>=3);show(dead,s>=3);show(rays,s>=4);show(pen,s>=4);
        live.querySelectorAll("[data-z]").forEach(c=>show(c,s<3));
        el.querySelector(`#${P}-h`).textContent=S[s][0];el.querySelector(`#${P}-t`).innerHTML=api.tpl(S[s][1]);
        el.querySelector(`#${P}-n`).textContent=`${s+1} av ${S.length}`;
        el.querySelector(`#${P}-prev`).disabled=s===0;el.querySelector(`#${P}-next`).textContent=s===S.length-1?"Börja om":"Nästa steg"}
      el.querySelector(`#${P}-next`).addEventListener("click",()=>{s=(s+1)%S.length;draw()});
      el.querySelector(`#${P}-prev`).addEventListener("click",()=>{if(s>0)s--;draw()});
      draw();
    },
    /* ---------- Vilket antibiotikum stoppar vad? ---------- */
    abVal(el,api){
      el.className="wid";const P="k11-ab";
      const T={
        vagg:{h:"Bygget av cellväggen",k:"Cellväggen",why:"Antibiotikan binder till och blockerar ett <b>enzym</b> som behövs för att bygga cellväggen. Bakterien kan inte bilda och reparera sin cellvägg.",us:"Människans celler har ingen cellvägg ({{go:k2|K2}}). Det finns alltså inget cellväggsbygge att stoppa {{extra}}."},
        kopi:{h:"Kopieringen av DNA (replikation)",k:"DNA-kopieringen",why:"Antibiotikan stoppar kopieringen av DNA, cirkelpilen i bokens figur. Utan kopierat DNA kan bakterien inte dela sig.",us:"Molekylerna som kopierar DNA skiljer sig kraftigt mellan bakterier och eukaryoter. Antibiotikan blockerar bara bakteriens variant (s. 213)."},
        rna:{h:"Steget DNA → RNA",k:"DNA → RNA",why:"Antibiotikan stoppar steget där DNA läses av till RNA. Bakterien kan inte göra nytt RNA och därmed inte nya proteiner.",us:"Molekylerna som gör RNA skiljer sig kraftigt mellan bakterier och eukaryoter. Antibiotikan blockerar bara bakteriens variant (s. 213)."},
        nuk:{h:"Nukleinsyrasyntesen",k:"Nukleinsyrasyntes",why:"Läraren kallar gruppen <b>nukleinsyrasynteshämmare</b>. De hindrar bakterien från att bygga sina nukleinsyror (DNA och RNA). Exakt vilket steg står inte i materialet.",us:"Bakteriens molekyler för DNA-syntes skiljer sig kraftigt från våra, och antibiotikan blockerar bakteriens variant (s. 213)."},
        prot:{h:"Steget RNA → proteiner (ribosomen)",k:"RNA → proteiner",why:"Antibiotikan binder till och blockerar bakteriens <b>ribosom</b> eller något av hjälparproteinerna. Proteinsyntesen stannar.",us:"Människans ribosomer och hjälparproteiner ser annorlunda ut, och antibiotikan binder inte till dem. Därför överlever människocellerna (lärarens bild 19)."}
      };
      const D=[
        ["Penicillin","vagg","bok + PPT","Hämmare av cellväggssyntes","Det första och mest använda antibiotikumet. Verkar framför allt mot grampositiva, eftersom det slår mot bildandet av peptidoglukan."],
        ["Ampicillin","vagg","PPT bild 17","Hämmare av cellväggssyntes","Penicillin med en aminogrupp. Verkar även mot gramnegativa bakterier."],
        ["Cefalosporiner","vagg","bok s. 213","Hämmare av cellväggssyntes",""],
        ["Karbapenemer","vagg","bok s. 213","Hämmare av cellväggssyntes",""],
        ["Betalaktamer","vagg","PPT bild 13","Hämmare av cellväggssyntes","Lärarens gruppnamn. {{extra}} Penicilliner, cefalosporiner och karbapenemer är betalaktamer."],
        ["Glykopeptider","vagg","PPT bild 13","Hämmare av cellväggssyntes",""],
        ["Kinoloner","kopi","bok + PPT","Hämmare av DNA-replikation",""],
        ["Metronidazol","kopi","PPT bild 13","Hämmare av DNA-replikation",""],
        ["Rifampicin","rna","bok + PPT","Nukleinsyrasynteshämmare","Ett av de två traditionella förstahandsvalen mot tuberkulos ({{go:k12.mordare|K12}})."],
        ["Trimetoprim","nuk","PPT bild 13","Nukleinsyrasynteshämmare",""],
        ["Sulfonamid","nuk","PPT bild 13","Nukleinsyrasynteshämmare",""],
        ["Tetracykliner","prot","bok + PPT","Proteinsynteshämmare",""],
        ["Makrolider","prot","bok + PPT","Proteinsynteshämmare",""],
        ["Linkosamider","prot","bok + PPT","Proteinsynteshämmare",""],
        ["Aminoglykosider","prot","PPT bild 13","Proteinsynteshämmare",""],
        ["Kloramfenikol","prot","PPT bild 13","Proteinsynteshämmare",""]
      ];
      el.innerHTML=`<div class="wh"><b>Vilket antibiotikum stoppar vad?</b><span class="mono">Simulering</span></div>
      <div class="seg" role="group" aria-label="Läge" id="${P}-mode" style="margin-bottom:8px"><button type="button" data-m="ut" aria-pressed="true">Utforska</button><button type="button" data-m="test" aria-pressed="false">Testa dig</button></div>
      <div class="wgrid"><figure style="margin:0"><svg viewBox="0 0 420 250" role="img" aria-label="Bakterie och människocell. Det valda antibiotikumets angreppspunkt markeras."></svg></figure>
      <div><div id="${P}-ctl"></div><dl class="readout" id="${P}-ro"></dl><p class="verdict" id="${P}-v"></p><p id="${P}-why" class="small"></p></div></div>`;
      const svg=el.querySelector("svg"),sv=api.sv;
      svg.innerHTML=hatch("k11-hatch2")+
        `<text x="14" y="26" style="font-size:14px;font-weight:700">bakterie</text>
         <rect x="8" y="38" width="262" height="176" rx="62" style="fill:url(#k11-hatch2);stroke:var(--c-wall)" stroke-width="1.5"/>
         <rect x="20" y="50" width="238" height="152" rx="52" style="fill:var(--paper);stroke:var(--c-mem)" stroke-width="2"/>
         <path d="M51.2 114.8 A13 13 0 1 0 53.3 130.5" fill="none" style="stroke:var(--ink)" stroke-width="2.4" marker-end="url(#k11-hatch2-ah)"/>
         <text x="62" y="129" style="font-size:15px">DNA</text>
         <path d="M98 124 H118" fill="none" style="stroke:var(--ink)" stroke-width="2.4" marker-end="url(#k11-hatch2-ah)"/>
         <text x="122" y="129" style="font-size:15px">RNA</text>
         <path d="M158 124 H176" fill="none" style="stroke:var(--ink)" stroke-width="2.4" marker-end="url(#k11-hatch2-ah)"/>
         <text x="180" y="129" style="font-size:15px">proteiner</text>
         <path d="M214 111 C 216 92 220 74 226 58" fill="none" style="stroke:var(--ink)" stroke-width="2.4" marker-end="url(#k11-hatch2-ah)"/>
         <text x="296" y="26" style="font-size:14px;font-weight:700">människocell</text>
         <circle cx="350" cy="124" r="58" style="fill:var(--c-euk-soft);stroke:var(--c-mem)" stroke-width="2.5"/>
         <circle cx="336" cy="112" r="20" style="fill:var(--c-nuc-soft);stroke:var(--c-nuc)" stroke-width="2"/>
         <circle cx="372" cy="104" r="2.6" style="fill:var(--t-ribosom)"/><circle cx="380" cy="120" r="2.6" style="fill:var(--t-ribosom)"/><circle cx="366" cy="146" r="2.6" style="fill:var(--t-ribosom)"/><circle cx="342" cy="152" r="2.6" style="fill:var(--t-ribosom)"/><circle cx="318" cy="140" r="2.6" style="fill:var(--t-ribosom)"/>`;
      const hl={};const mk=(k,html)=>{const g=sv("g",{},svg);g.innerHTML=html;g.style.display="none";hl[k]=g};
      const X=(x,y)=>`<path d="M${x-7} ${y-7} l14 14 M${x+7} ${y-7} l-14 14" fill="none" style="stroke:var(--bad)" stroke-width="3"/>`;
      mk("vagg",`<rect x="8" y="38" width="262" height="176" rx="62" fill="none" style="stroke:var(--bad)" stroke-width="4"/><path d="M214 111 C 216 92 220 74 226 58" fill="none" style="stroke:var(--bad)" stroke-width="4"/>${X(232,84)}`);
      mk("kopi",`<circle cx="42" cy="124" r="16" fill="none" style="stroke:var(--bad)" stroke-width="4"/>${X(42,154)}`);
      mk("rna",`<path d="M98 124 H118" fill="none" style="stroke:var(--bad)" stroke-width="5"/>${X(108,150)}`);
      mk("nuk",`<rect x="58" y="110" width="40" height="26" rx="6" fill="none" style="stroke:var(--bad)" stroke-width="3"/><rect x="118" y="110" width="40" height="26" rx="6" fill="none" style="stroke:var(--bad)" stroke-width="3"/>${X(108,154)}`);
      mk("prot",`<path d="M158 124 H176" fill="none" style="stroke:var(--bad)" stroke-width="5"/><ellipse cx="200" cy="160" rx="16" ry="9" style="fill:var(--t-ribosom)"/>${X(168,150)}`);
      const ok=sv("g",{},svg);ok.innerHTML=`<circle cx="350" cy="206" r="16" style="fill:var(--good-soft);stroke:var(--good)" stroke-width="2"/><path d="M342 206 l6 6 l10 -12" fill="none" style="stroke:var(--good)" stroke-width="3"/>`;ok.style.display="none";
      const ro=el.querySelector(`#${P}-ro`),v=el.querySelector(`#${P}-v`),why=el.querySelector(`#${P}-why`),ctl=el.querySelector(`#${P}-ctl`);
      function mark(t){Object.keys(hl).forEach(k=>hl[k].style.display=k===t?"":"none");ok.style.display=t?"":"none"}
      function explain(d){const t=T[d[1]];mark(d[1]);
        ro.innerHTML=`<dt>Preparat</dt><dd>${api.esc(d[0])}</dd><dt>Slår mot</dt><dd>${api.esc(t.h)}</dd><dt>Lärarens grupp</dt><dd>${api.esc(d[3])}</dd><dt>Källa</dt><dd>${api.esc(d[2])}</dd>`;
        v.className="verdict g";v.textContent="Bakterien kan inte dela sig och dör.";
        why.innerHTML=api.tpl(`${t.why} ${d[4]}<br><b>Varför människocellen klarar sig:</b> ${t.us}`)}
      let mode="ut",cur=null,score=0,tries=0;
      function explore(){ctl.innerHTML=`<p class="small muted" style="margin:0 0 6px">Välj ett preparat. Säg först själv vad det slår mot.</p><div class="lchips" style="margin-top:0">${D.map((d,i)=>`<button type="button" data-i="${i}">${api.esc(d[0])}</button>`).join("")}</div>`;
        ctl.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ctl.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));explain(D[+b.dataset.i])}));
        mark(null);ro.innerHTML="";v.textContent="";why.innerHTML="Bakterien kopierar sitt DNA (cirkelpilen), läser av DNA till RNA, bygger proteiner, och proteinerna bygger cellväggen."}
      function test(){cur=D[Math.floor(Math.random()*D.length)];mark(null);ro.innerHTML="";v.textContent="";why.innerHTML="";
        ctl.innerHTML=`<p style="margin:0 0 6px">Vad slår <b>${api.esc(cur[0])}</b> mot?</p><div class="lchips" style="margin-top:0">${Object.keys(T).map(k=>`<button type="button" data-k="${k}">${api.esc(T[k].k)}</button>`).join("")}</div><p class="small muted" id="${P}-sc">${tries?`Rätt hittills: ${score} av ${tries}`:""}</p><button class="btn sm" type="button" id="${P}-nx" hidden>Nästa preparat</button>`;
        ctl.querySelectorAll("[data-k]").forEach(b=>b.addEventListener("click",()=>{if(ctl.dataset.done)return;ctl.dataset.done="1";const k=b.dataset.k;const good=k===cur[1]||(cur[0]==="Rifampicin"&&k==="nuk");tries++;if(good)score++;
          b.classList.add("on");explain(cur);v.className="verdict "+(good?"g":"b");v.textContent=good?"Rätt! Bakterien kan inte dela sig och dör.":`Inte rätt. ${cur[0]} slår mot ${T[cur[1]].h.toLowerCase()}.`;
          el.querySelector(`#${P}-sc`).textContent=`Rätt hittills: ${score} av ${tries}`;el.querySelector(`#${P}-nx`).hidden=false}));
        el.querySelector(`#${P}-nx`).addEventListener("click",()=>{delete ctl.dataset.done;test()})}
      el.querySelectorAll(`#${P}-mode button`).forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.m;el.querySelectorAll(`#${P}-mode button`).forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));delete ctl.dataset.done;mode==="ut"?explore():test()}));
      explore();
    }
  }
});
})();
