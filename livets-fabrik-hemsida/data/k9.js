(function(){
/* ---------- små ritverktyg (bara strängar, inga färgkoder utom CSS-variabler) ---------- */
const R=n=>Math.round(n*10)/10;
function ring(cx,cy,r,col,w){return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke-width="'+(w||3)+'" style="stroke:'+col+'"/>'}
function arc(cx,cy,r,a0,a1,col,w){const p=a=>[R(cx+r*Math.cos(a*Math.PI/180)),R(cy+r*Math.sin(a*Math.PI/180))];const s=p(a0),e=p(a1);const big=(a1-a0)>180?1:0;
  return '<path d="M'+s[0]+' '+s[1]+' A'+r+' '+r+' 0 '+big+' 1 '+e[0]+' '+e[1]+'" fill="none" stroke-width="'+(w||5)+'" stroke-linecap="round" style="stroke:'+col+'"/>'}
function loopD(cx,cy,rx,ry,k,amp,ph,t0,t1){let d="";const N=90;const a=t0==null?0:t0,b=t1==null?2*Math.PI:t1;const n=Math.max(6,Math.round(N*(b-a)/(2*Math.PI)));
  for(let i=0;i<=n;i++){const t=a+(b-a)*i/n;const f=1+amp*Math.sin(k*t+ph)+amp*.45*Math.sin((k+3)*t+2*ph);d+=(i?"L":"M")+R(cx+rx*f*Math.cos(t))+" "+R(cy+ry*f*Math.sin(t))}return d}
function loop(cx,cy,rx,ry,col,w,ph){return '<path d="'+loopD(cx,cy,rx,ry,9,.11,ph||.4)+'Z" fill="none" stroke-width="'+(w||2.4)+'" stroke-linejoin="round" style="stroke:'+col+'"/>'}
function loopSeg(cx,cy,rx,ry,t0,t1,col,w,ph){return '<path d="'+loopD(cx,cy,rx,ry,9,.11,ph||.4,t0,t1)+'" fill="none" stroke-width="'+(w||5)+'" stroke-linecap="round" style="stroke:'+col+'"/>'}
function cap(x,y,w,h,fill,stroke,sw,extra){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(h/2)+'" stroke-width="'+(sw||3)+'" style="fill:'+fill+';stroke:'+stroke+'"'+(extra||"")+'/>'}
function cell(x,y,w,h){return cap(x,y,w,h,"var(--c-bact-soft)","var(--c-bact)",3)}
function wave(x,y,len,col,w){const q=len/4;return '<path d="M'+x+' '+y+' q'+q+' -6 '+(2*q)+' 0 t'+(2*q)+' 0" fill="none" stroke-width="'+(w||2.6)+'" stroke-linecap="round" style="stroke:'+col+'"/>'}
function head(x1,y1,x2,y2,col){const a=Math.atan2(y2-y1,x2-x1),L=9,W=4.6;const bx=x2-L*Math.cos(a),by=y2-L*Math.sin(a);
  return '<polygon points="'+R(x2)+','+R(y2)+' '+R(bx-W*Math.sin(a))+','+R(by+W*Math.cos(a))+' '+R(bx+W*Math.sin(a))+','+R(by-W*Math.cos(a))+'" style="fill:'+col+'"/>'}
function arrow(x1,y1,x2,y2,col,w,dash){col=col||"var(--ink)";const a=Math.atan2(y2-y1,x2-x1);const ex=x2-7*Math.cos(a),ey=y2-7*Math.sin(a);
  return '<path d="M'+x1+' '+y1+' L'+R(ex)+' '+R(ey)+'" fill="none" stroke-width="'+(w||2.2)+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+' style="stroke:'+col+'"/>'+head(x1,y1,x2,y2,col)}
function arrow2(x1,y1,x2,y2,col,w){col=col||"var(--ink)";return '<path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" fill="none" stroke-width="'+(w||2.2)+'" style="stroke:'+col+'"/>'+head(x2,y2,x1,y1,col)+head(x1,y1,x2,y2,col)}
function arrowQ(x1,y1,cx,cy,x2,y2,col,w,dash){col=col||"var(--ink)";return '<path d="M'+x1+' '+y1+' Q'+cx+' '+cy+' '+x2+' '+y2+'" fill="none" stroke-width="'+(w||2.2)+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+' style="stroke:'+col+'"/>'+head(cx,cy,x2,y2,col)}
function hexPts(cx,cy,r,rot){let p=[];for(let i=0;i<6;i++){const a=Math.PI/3*i+(rot||0);p.push(R(cx+r*Math.cos(a))+","+R(cy+r*Math.sin(a)))}return p.join(" ")}
function phage(x,y,s,dna,extra){s=s||1;const r=11*s;let o='<polygon points="'+hexPts(x,y,r,Math.PI/6)+'" stroke-width="2" style="fill:var(--c-vir-soft);stroke:var(--c-vir)"/>';
  o+=(dna||'<path d="M'+R(x-4*s)+' '+R(y-5*s)+' q'+R(6*s)+' '+R(2.5*s)+' 0 '+R(5*s)+' q'+R(-6*s)+' '+R(2.5*s)+' 0 '+R(5*s)+'" fill="none" stroke-width="2" style="stroke:var(--c-arch)"/>');
  o+='<rect x="'+R(x-2.5*s)+'" y="'+R(y+r-1)+'" width="'+R(5*s)+'" height="'+R(15*s)+'" style="fill:var(--c-vir)"/>';
  const ty=y+r+14*s;o+='<path d="M'+x+' '+R(ty)+' l'+R(-8*s)+' '+R(7*s)+' M'+x+' '+R(ty)+' l'+R(8*s)+' '+R(7*s)+' M'+x+' '+R(ty)+' l'+R(-3*s)+' '+R(8*s)+' M'+x+' '+R(ty)+' l'+R(3*s)+' '+R(8*s)+'" fill="none" stroke-width="2" style="stroke:var(--c-vir)"/>';
  return '<g'+(extra||"")+'>'+o+'</g>'}
function dots(list,r,col){return list.map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(r||2.6)+'" style="fill:'+(col||"var(--ink)")+'"/>').join("")}
function num(x,y,n){return '<circle cx="'+x+'" cy="'+y+'" r="10" style="fill:var(--ink)"/><text x="'+x+'" y="'+(y+4.6)+'" text-anchor="middle" style="fill:var(--paper);font-size:13px;font-weight:700">'+n+'</text>'}
function plasmid(cx,cy,r,inner,col){col=col||"var(--t-plasmid)";return ring(cx,cy,r,col,3)+(inner?ring(cx,cy,r-4,col,1.4):"")}
const CHR="var(--c-nuc)",PLA="var(--t-plasmid)",VDNA="var(--c-arch)",NEW="var(--good)",TRP="var(--mid)";

/* ---------- figurer ---------- */
const FIGS={
 bakt:{vb:"0 0 470 262",
  svg:'<g data-k="vagg">'+'<rect x="110" y="50" width="250" height="150" rx="75" stroke-width="7" style="fill:var(--c-bact-soft);stroke:var(--c-wall)"/></g>'+
   '<g data-k="mem"><rect x="118" y="58" width="234" height="134" rx="67" fill="none" stroke-width="2.6" style="stroke:var(--c-mem)"/></g>'+
   '<g data-k="kro"><ellipse cx="205" cy="125" rx="44" ry="31" style="fill:var(--c-nuc-soft)"/>'+loop(205,125,46,34,CHR,2.6)+'</g>'+
   '<g data-k="pla"><circle cx="300" cy="95" r="16" style="fill:var(--c-bact-soft)" opacity="0"/>'+plasmid(300,95,12,true)+plasmid(322,138,10,true)+plasmid(292,165,9,true)+arc(292,165,9,-10,80,TRP,5)+'</g>'+
   '<g data-k="rib">'+dots([[148,100],[140,132],[152,160],[178,178],[232,178],[262,172],[258,80],[180,72],[345,118],[330,170],[275,110],[340,95]],2.7)+'</g>',
  labels:[["cellvägg",10,40,132,73,"s"],["ribosomer",10,136,139,132,"s"],["cellmembran",10,238,138,172,"s"],["kromosom|(cirkulär DNA)",170,236,205,162,"s"],["plasmid",380,70,311,90,"s"],["cytoplasma",372,135,340,150,"s"],["resistensgen",372,200,299,171,"s"]],
  parts:{
   vagg:{t:"Cellvägg",d:"Ger bakterien struktur och skyddar den. Mer om grampositiva och gramnegativa väggar i K8.",go:"k8.byggnad"},
   mem:{t:"Cellmembran",d:"Avgränsar cellens innehåll från omgivningen. Kromosomen och plasmiderna ligger innanför, fritt i cytoplasman, eftersom bakterien saknar cellkärna."},
   kro:{t:"Kromosomen",d:"En <b>cirkulär DNA-molekyl</b> med <b>några tusen gener</b>. Den behövs alltid och kopieras före varje delning, så att båda dotterbakterierna får en. {{src:s. 182}}"},
   pla:{t:"Plasmider",d:"Extra, mindre, cirkulära DNA-molekyler med <b>ett litet antal gener</b>, t.ex. för resistens mot antibiotika (gult avsnitt). Nyttiga under speciella omständigheter men behövs inte ständigt. Kan tappas vid delning. {{src:s. 182}}"},
   rib:{t:"Ribosomer",d:"Utför proteinsyntesen. Här byggs bland annat de proteiner som plasmidens resistensgen beskriver.",go:"k4.ribosomer"}},
  cap:"Bakterie med kromosom och plasmider. Plasmiden nere till höger bär en resistensgen (gult). Tryck på delarna.",src:"Bok s. 181–182 · PPT Antibiotika bild 16"},

 flytt:{vb:"0 0 480 360",
  svg:cell(150,40,305,110)+loop(225,95,38,30,CHR,2.4)+plasmid(400,72,10)+plasmid(424,104,9)+plasmid(394,124,8)+
   '<rect x="12" y="222" width="280" height="104" rx="52" stroke-width="3" style="fill:var(--c-bact-soft);stroke:var(--c-bact)"/>'+loop(105,274,44,28,CHR,2.4,1.3)+
   '<g data-k="rek">'+arrow2(268,78,376,78,"var(--ink)",2.4)+'</g>'+
   '<g data-k="tra">'+arrow2(268,112,370,112,TRP,3)+'</g>'+
   '<g data-k="kon"><polygon points="184,146 197,146 179,226 166,226" stroke-width="2" style="fill:var(--c-bact-soft);stroke:var(--c-bact)"/><path d="M212 122 Q198 136 190 150 L172 228 q-2 14 16 22" fill="none" stroke-width="2.4" style="stroke:'+CHR+'"/></g>'+
   '<g data-k="tdu">'+arrow(330,152,342,178)+phage(350,196,1.1)+arrow(338,240,298,268)+'</g>'+
   '<g data-k="tfo">'+plasmid(420,290,7)+plasmid(448,310,6)+wave(398,322,26,NEW)+wave(430,268,22,NEW)+arrow(396,298,298,298)+'</g>',
  labels:[["kromosom",8,66,188,90,"s"],["rekombination",262,26,322,78,"s"],["plasmider",384,26,400,62,"s"],["transposoner",222,180,318,112,"s"],["konjugation",8,190,181,186,"s"],["genöverföring|via virus",370,190,362,196,"s"],["transformation",362,350,425,316,"s"],["mottagande bakterie",8,350,70,320,"s"]],
  parts:{
   rek:{t:"Homolog rekombination",d:"Gener byter plats inom bakterien, mellan plasmid och kromosom, genom en naturlig process som också kallas homolog omlagring.",go:"k9.rekombination"},
   tra:{t:"Transposoner",d:"Avsnitt av DNA som lätt kan flyttas eller kopieras till ett annat ställe i arvsmassan, t.ex. från kromosomen till en plasmid.",go:"k9.transposoner"},
   kon:{t:"Konjugation",d:"Bakterien fäster vid en närbesläktad bakterie bredvid, bildar en kanal och för över delar av sin arvsmassa. I bokens bild går DNA från kromosomen genom kanalen."},
   tdu:{t:"Transduktion",d:"Ett bakterievirus (en fag) för gener eller stora paket av gener från en bakterie till en annan."},
   tfo:{t:"Transformation",d:"Bakterien fiskar upp plasmider eller bitar av naket DNA från omgivningen."}},
  cap:"Arvsmassa kan flyttas på många olika sätt både inom och mellan bakterier. Överst: inom en bakterie. Nederst: tre vägar in i en annan bakterie. Tryck på pilarna.",src:"Bok s. 183"},

 konj:{vb:"0 0 460 340",
  svg:(function(){let o="";[70,175,280].forEach((c,i)=>{o+='<rect x="186" y="'+(c-5)+'" width="88" height="10" stroke-width="2" style="fill:var(--c-bact-soft);stroke:var(--c-bact)"/>';
     o+=cap(30,c-25,160,50,"var(--c-bact-soft)","var(--c-bact)",3)+cap(270,c-25,160,50,"var(--c-bact-soft)","var(--c-bact)",3);
     o+='<path d="M188 '+(c-5)+' V'+(c+5)+' M272 '+(c-5)+' V'+(c+5)+'" stroke-width="3" style="stroke:var(--c-bact-soft)" fill="none"/>';
     o+=loop(72,c,22,13,CHR,2.2,i)+loop(390,c,22,13,CHR,2.2,i+2)+num(14,c,i+1)});
    o+=plasmid(150,70,11,true);
    o+=ring(150,175,7,PLA,1.6)+arc(150,175,11,-150,150,PLA,3)+arc(150,175,11,30,150,NEW,3)+'<path d="M161 175 L268 175 Q300 175 304 158" fill="none" stroke-width="2.4" style="stroke:'+PLA+'"/><path d="M276 180 L298 180" fill="none" stroke-width="2.4" style="stroke:'+NEW+'"/>';
    o+=plasmid(150,280,11,true)+ring(310,280,11,NEW,3)+ring(310,280,7,PLA,1.6);
    o+=arrow(446,100,446,146,"var(--muted)",2)+arrow(446,205,446,251,"var(--muted)",2);return o})(),
  labels:[["givarcell",30,32,80,46,"s"],["plasmid",120,32,150,58,"s"],["mottagarcell",300,32,330,46,"s"],["kromosom",30,124,72,85,"s"],["sexpilus (kanal)",160,124,230,75,"s"],["nya strängar byggs",28,229,150,187,"s"],["en sträng förs över",200,229,240,175,"s"],["båda har plasmiden",150,330,310,292,"s"]],
  cap:"Konjugation i tre steg. 1: givarcellen fäster med sexpilus vid mottagarcellen. 2: en sträng av plasmiden förs över, och nya strängar (grönt) byggs i båda cellerna. 3: båda har plasmiden, och mottagaren kan nu bli givare.",src:"PPT Antibiotika bild 8 · bok s. 182"},

 transf:{vb:"0 0 460 345",
  svg:'<rect x="20" y="40" width="150" height="70" rx="35" stroke-width="2.4" stroke-dasharray="7 6" style="fill:var(--sunk);stroke:var(--muted)"/>'+
   '<path d="M92 40 l6 12 l-8 8 l7 10 M130 110 l-5 -10 l7 -9" fill="none" stroke-width="2" style="stroke:var(--muted)"/>'+
   wave(48,72,22,CHR,2)+wave(90,88,20,CHR,2)+wave(118,62,18,CHR,2)+
   wave(190,62,30,NEW)+wave(213,100,28,NEW)+wave(188,130,24,NEW)+plasmid(252,78,9)+
   arrow(222,140,232,165)+
   cell(150,180,290,110)+
   '<path d="M200 180 v-8 m-5 -6 l5 6 l5 -6 M232 180 v-8 m-5 -6 l5 6 l5 -6 M264 180 v-8 m-5 -6 l5 6 l5 -6" fill="none" stroke-width="2.2" style="stroke:var(--c-er)"/>'+
   wave(222,166,24,NEW)+
   loop(270,240,52,30,CHR,2.4,.9)+loopSeg(270,240,52,30,-1.95,-1.3,NEW,5,.9)+plasmid(392,224,10)+
   num(140,58,1)+num(176,160,2)+num(330,206,3),
  labels:[["plasmid",290,74,262,77,"s"],["DNA-fragment",290,120,241,100,"s"],["död bakterie|som spruckit",20,140,90,111,"s"],["fogas in i|kromosomen",310,150,276,210,"s"],["proteiner på|cellytan",10,198,199,172,"s"],["kompetent bakterie",10,322,165,268,"s"],["plasmiden blir|en egen ring",330,322,392,235,"s"]],
  cap:"Transformation. 1: en bakterie dör och spricker (lyserar), och DNA-bitar och plasmider hamnar fritt i omgivningen. 2: en naturligt kompetent bakterie binder DNA med proteiner på cellytan och tar in det. 3: en DNA-bit fogas in i kromosomen (grönt), en hel plasmid blir en egen ring.",src:"PPT Antibiotika bild 9 · bok s. 182 · Arbetsblad"},

 transd:{vb:"0 0 460 330",
  svg:cell(20,60,230,90)+phage(125,22,1)+'<path d="M125 54 L125 80" fill="none" stroke-width="2.4" stroke-dasharray="3 3" style="stroke:'+VDNA+'"/>'+
   loop(110,106,62,24,CHR,2.4,.2)+loopSeg(110,106,62,24,1.15,1.9,VDNA,5,.2)+loopSeg(110,106,62,24,1.9,2.35,NEW,5,.2)+
   arrow(252,104,286,106)+
   phage(305,108,1.2,'<path d="M298 101 q6 3 0 6 q-6 3 0 6" fill="none" stroke-width="2.2" style="stroke:'+VDNA+'"/><path d="M306 99 q6 4 2 10" fill="none" stroke-width="3" style="stroke:'+NEW+'"/>')+
   arrow(305,156,310,218)+
   cell(200,225,240,90)+loop(320,270,64,24,CHR,2.4,1.1)+loopSeg(320,270,64,24,-1.55,-1.1,NEW,5,1.1)+loopSeg(320,270,64,24,-2.0,-1.55,VDNA,5,1.1)+
   num(156,46,1)+num(218,104,2)+num(305,72,3)+num(326,186,4)+num(418,268,5),
  labels:[["bakteriofag",162,26,137,22,"s"],["bakterie 1",20,50,null,null,"s"],["gen från|bakterie 1",10,186,79,129,"s"],["virus-DNA",110,186,112,133,"s"],["ny fag med|bakteriens gen",345,92,320,104,"s"],["genen fogas in|i kromosomen",343,200,337,247,"s"],["bakterie 2",110,300,203,282,"s"]],
  cap:"Transduktion. 1: en fag för in sitt DNA (orange). 2: virus-DNA:t fogas in i kromosomen. 3: en ny fag får med en bit av bakteriens eget DNA (grönt). 4: fagen infekterar bakterie 2. 5: genen från bakterie 1 fogas in i kromosomen hos bakterie 2.",src:"PPT Antibiotika bild 10 · bok s. 183"},

 transp:{vb:"0 0 460 300",
  svg:'<rect x="6" y="6" width="448" height="288" rx="40" stroke-width="2" style="fill:var(--c-bact-soft);stroke:var(--c-bact)"/>'+
   ring(140,165,78,CHR,4)+arc(140,165,78,14,46,TRP,9)+ring(365,130,38,PLA,4)+arc(365,130,38,152,208,TRP,9)+
   arrow2(204,112,336,98,"var(--ink)",2.2)+arrowQ(216,214,300,236,331,160,TRP,2.6,"6 4"),
  labels:[["kromosom",140,170,null,null,"m"],["plasmid",365,135,null,null,"m"],["homolog|rekombination",200,46,270,105,"s"],["kopian på|ny plats",380,212,329,143,"s"],["transposon",190,268,207,205,"s"],["flyttas eller|kopieras",290,268,287,211,"s"]],
  cap:"Gener byter plats inom en bakterie. En transposon (gul) kopieras eller flyttas från kromosomen till plasmiden, eller tvärtom. Homolog rekombination är det andra sättet.",src:"Bok s. 183"},

 vh:{vb:"0 0 460 300",
  svg:'<path d="M232 10 V290" fill="none" stroke-width="2" stroke-dasharray="6 6" style="stroke:var(--line2)"/>'+
   cap(60,40,110,44,"var(--c-bact-soft)","var(--c-bact)",3)+loop(98,62,18,10,CHR,2,.3)+plasmid(146,62,7)+arc(146,62,7,-40,60,TRP,4)+
   arrow(96,88,70,124)+arrow(136,88,162,124)+
   cap(14,130,92,40,"var(--c-bact-soft)","var(--c-bact)",3)+loop(46,150,15,9,CHR,2,.8)+plasmid(84,150,6)+arc(84,150,6,-40,60,TRP,4)+
   cap(126,130,92,40,"var(--c-bact-soft)","var(--c-bact)",3)+loop(158,150,15,9,CHR,2,1.6)+plasmid(196,150,6)+arc(196,150,6,-40,60,TRP,4)+
   cap(250,50,110,44,"var(--c-bact-soft)","var(--c-bact)",3)+loop(286,72,18,10,CHR,2,2)+plasmid(336,72,7)+arc(336,72,7,-40,60,TRP,4)+
   arrowQ(338,98,400,120,382,168,"var(--ink)",2.2)+plasmid(392,128,5)+
   '<rect x="300" y="170" width="140" height="50" rx="12" stroke-width="3" style="fill:var(--c-wall-soft);stroke:var(--c-wall)"/>'+loop(340,195,20,11,CHR,2,2.5)+plasmid(404,195,7)+arc(404,195,7,-40,60,TRP,4),
  labels:[["modercell",70,28,100,41,"s"],["dotterceller",40,198,60,171,"s"],["vertikal spridning",20,286,null,null,"s"],["plasmid med|resistensgen",360,36,341,66,"s"],["annan bakterie,|även annan art",250,250,330,219,"s"],["horisontell spridning",250,290,null,null,"s"]],
  cap:"Vertikal spridning: från en modercell till två dotterceller. Horisontell spridning: från en bakterie till en annan, genom konjugation, transduktion eller transformation.",src:"PPT Antibiotika bild 7 · bok s. 186, 214"}
};

/* ---------- simuleringar ---------- */
function segHTML(id,opts,cur){return '<div class="seg" role="group" id="'+id+'">'+opts.map(o=>'<button type="button" data-v="'+o[0]+'" aria-pressed="'+(o[0]===cur)+'">'+o[1]+'</button>').join("")+'</div>'}

const GS={
 tf:{n:"Transformation",giv:"en död bakterie som har spruckit (lyserat)",mot:"en naturligt kompetent bakterie",vad:"plasmider eller bitar av naket DNA",beh:"fritt DNA i omgivningen och en bakterie som kan ta upp det",
  steps:["En bakterie har dött och spruckit. DNA-bitar och plasmider ligger fria i omgivningen som <b>naket DNA</b>, eftersom döda organismer hela tiden bryts ned.",
   "En naturligt kompetent bakterie binder DNA:t med hjälp av <b>proteiner på cellytan</b>.",
   "DNA:t tas in i cellen. Ingen levande givare behövs, eftersom DNA:t redan ligger fritt.",
   "DNA-biten fogas in i kromosomen, och en hel plasmid blir en egen ring. Bakterien är <b>transformerad</b> och har fått nya gener."]},
 kj:{n:"Konjugation",giv:"en levande bakterie med en plasmid som har gener för sexpili",mot:"en närbesläktad bakterie bredvid",vad:"delar av arvsmassan, ofta en plasmid",beh:"kontakt via sexpilus och en kanal mellan cellerna",
  steps:["Givarcellen har en plasmid med <b>gener för sexpili</b>. Bara en sådan bakterie kan vara givare, eftersom den behöver sexpili för att få kontakt.",
   "Sexpilus fäster vid en närbesläktad <b>mottagarcell</b> bredvid, och en kanal bildas mellan cellerna.",
   "Den ena strängen i plasmiden förs över genom kanalen. Nya strängar byggs i båda cellerna (grönt), så givaren behåller sin plasmid.",
   "Båda har nu plasmiden. Mottagaren har fått generna för sexpili och kan själv bli givare. Därför kan resistens spridas mycket snabbt i en population."]},
 td:{n:"Transduktion",giv:"en bakterie som har infekterats av ett bakterievirus",mot:"en annan bakterie som viruset infekterar sedan",vad:"gener eller stora paket av gener",beh:"ett bakterievirus (bakteriofag) som budbärare",
  steps:["En <b>bakteriofag</b> fäster vid bakterie 1 och för in sitt DNA (orange).",
   "Virus-DNA:t fogas in i bakteriens kromosom.",
   "När nya virus byggs följer en bit av bakteriens eget DNA (grönt) med in i en ny viruspartikel.",
   "Viruset infekterar bakterie 2 och för in DNA:t, som nu bär gener från bakterie 1.",
   "Genen från bakterie 1 fogas in i kromosomen hos bakterie 2. Bakterierna har aldrig träffats, eftersom viruset var budbäraren."]}
};
function gsScene(m,s){let o="";const L=[20,95,150,70],Rr=[250,95,150,70];
 const own=(x,y,t)=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" class="lbs" style="font-size:13px">'+t+'</text>';
 if(m==="tf"){
  o+='<rect x="20" y="95" width="150" height="70" rx="35" stroke-width="2.4" stroke-dasharray="7 6" style="fill:var(--sunk);stroke:var(--muted)"/>'+wave(50,125,22,CHR,2)+wave(95,140,20,CHR,2)+wave(118,112,18,CHR,2);
  o+=cell(250,95,150,70)+'<path d="M250 112 h-8 m-6 -5 l6 5 l-6 5 M250 148 h-8 m-6 -5 l6 5 l-6 5" fill="none" stroke-width="2.2" style="stroke:var(--c-er)"/>';
  o+=loop(330,130,34,20,CHR,2.2,.5);
  if(s===0){o+=wave(186,70,26,NEW)+wave(196,188,24,NEW)+plasmid(208,124,8)}
  if(s===1){o+=wave(212,110,24,NEW)+wave(196,188,24,NEW)+plasmid(206,150,8)}
  if(s===2){o+=wave(268,112,22,NEW)+plasmid(380,140,8)+wave(196,188,24,NEW)}
  if(s===3){o+=loopSeg(330,130,34,20,-2.0,-1.2,NEW,5,.5)+plasmid(380,140,8)}
  o+=own(95,190,"död bakterie")+own(325,190,"mottagare");
 }
 if(m==="kj"){
  const br=s>=1;if(br)o+='<rect x="168" y="125" width="84" height="10" stroke-width="2" style="fill:var(--c-bact-soft);stroke:var(--c-bact)"/>';
  else o+='<path d="M170 126 l26 -4 M170 134 l22 5" fill="none" stroke-width="2.4" style="stroke:var(--c-bact)"/>';
  o+=cell(20,95,150,70)+cell(250,95,150,70);
  if(br)o+='<path d="M170 126 V134 M250 126 V134" fill="none" stroke-width="3" style="stroke:var(--c-bact-soft)"/>';
  o+=loop(70,130,26,15,CHR,2.2,.1)+loop(350,130,26,15,CHR,2.2,2.1);
  if(s<=1)o+=plasmid(135,130,12,true);
  if(s===2){o+=ring(135,130,8,PLA,1.6)+arc(135,130,12,-150,150,PLA,3)+arc(135,130,12,30,150,NEW,3)+'<path d="M147 130 L250 130 Q282 130 288 112" fill="none" stroke-width="2.4" style="stroke:'+PLA+'"/><path d="M256 135 L280 135" fill="none" stroke-width="2.4" style="stroke:'+NEW+'"/>'}
  if(s===3){o+=plasmid(135,130,12,true)+ring(290,130,12,NEW,3)+ring(290,130,8,PLA,1.6)+'<path d="M400 126 l18 -6 M400 134 l16 6" fill="none" stroke-width="2.4" style="stroke:var(--c-bact)"/>'}
  o+=own(95,190,"givare")+own(325,190,s===3?"ny givare":"mottagare");
 }
 if(m==="td"){
  o+=cell(20,95,150,70)+cell(250,95,150,70);
  o+=loop(90,135,46,18,CHR,2.2,.3)+loop(325,135,46,18,CHR,2.2,1.4);
  if(s>=1)o+=loopSeg(90,135,46,18,1.2,1.9,VDNA,5,.3);
  if(s>=1)o+=loopSeg(90,135,46,18,1.9,2.35,NEW,5,.3);
  if(s===0)o+=phage(95,58,1)+'<path d="M95 90 L95 108" fill="none" stroke-width="2.4" stroke-dasharray="3 3" style="stroke:'+VDNA+'"/>';
  if(s===2)o+=arrow(150,92,190,66)+phage(210,52,1.15,'<path d="M204 45 q6 3 0 6 q-6 3 0 6" fill="none" stroke-width="2.2" style="stroke:'+VDNA+'"/><path d="M212 44 q5 4 2 9" fill="none" stroke-width="3" style="stroke:'+NEW+'"/>');
  if(s===3)o+=phage(325,58,1.15,'<path d="M319 51 q6 3 0 6 q-6 3 0 6" fill="none" stroke-width="2.2" style="stroke:'+VDNA+'"/><path d="M327 50 q5 4 2 9" fill="none" stroke-width="3" style="stroke:'+NEW+'"/>')+'<path d="M325 92 L325 112" fill="none" stroke-width="2.4" stroke-dasharray="3 3" style="stroke:'+NEW+'"/>';
  if(s===4)o+=loopSeg(325,135,46,18,-1.6,-1.15,NEW,5,1.4)+loopSeg(325,135,46,18,-2.05,-1.6,VDNA,5,1.4);
  o+=own(95,190,"bakterie 1")+own(325,190,"bakterie 2");
 }
 return o}

const W={
 genSim(el,api){
  el.className="wid";let m="kj",s=0;
  el.innerHTML='<div class="wh"><b>Genöverföring steg för steg</b><span class="mono">Simulering</span></div>'+
   '<p class="small" style="margin:0 0 8px">Välj ett sätt och stega igenom. Säg själv vad som händer innan du trycker på Nästa.</p>'+
   segHTML("k9-gs-mode",[["tf","Transformation"],["kj","Konjugation"],["td","Transduktion"]],m)+
   '<div class="wgrid" style="margin-top:10px"><figure style="margin:0"><svg viewBox="0 0 420 210" id="k9-gs-svg" role="img" aria-label="Två bakterier och DNA som förs över"></svg></figure>'+
   '<div><dl class="readout"><dt>Givare</dt><dd id="k9-gs-g"></dd><dt>Mottagare</dt><dd id="k9-gs-m"></dd><dt>Förs över</dt><dd id="k9-gs-v"></dd><dt>Behövs</dt><dd id="k9-gs-b"></dd><dt>Steg</dt><dd id="k9-gs-n"></dd></dl>'+
   '<div class="row"><button class="btn ghost sm" type="button" id="k9-gs-prev">Föregående</button><button class="btn sm" type="button" id="k9-gs-next">Nästa steg</button></div></div></div>'+
   '<p class="verdict m" id="k9-gs-txt"></p>';
  const svg=api.$("#k9-gs-svg",el);
  function draw(){const d=GS[m];svg.innerHTML=gsScene(m,s);
   api.$("#k9-gs-g",el).textContent=d.giv;api.$("#k9-gs-m",el).textContent=d.mot;api.$("#k9-gs-v",el).textContent=d.vad;api.$("#k9-gs-b",el).textContent=d.beh;
   api.$("#k9-gs-n",el).textContent=(s+1)+" av "+d.steps.length;
   api.$("#k9-gs-txt",el).innerHTML="<b>"+d.n+", steg "+(s+1)+".</b> "+d.steps[s];
   api.$("#k9-gs-prev",el).disabled=s===0;api.$("#k9-gs-next",el).textContent=s>=d.steps.length-1?"Börja om":"Nästa steg";
   api.$$("#k9-gs-mode button",el).forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===m?"true":"false"))}
  api.$$("#k9-gs-mode button",el).forEach(b=>b.addEventListener("click",()=>{m=b.dataset.v;s=0;draw()}));
  api.$("#k9-gs-next",el).addEventListener("click",()=>{s=s>=GS[m].steps.length-1?0:s+1;draw()});
  api.$("#k9-gs-prev",el).addEventListener("click",()=>{if(s>0)s--;draw()});
  draw();
 },
 plasmidSim(el,api){
  el.className="wid";const N=48;let ab="nej",kj="av",st="alla",pop=[],gen=0,killed=0;const LOSS=.12;
  el.innerHTML='<div class="wh"><b>Behålls plasmiden?</b><span class="mono">Simulering</span></div>'+
   '<div class="wgrid"><figure style="margin:0"><svg viewBox="0 0 420 262" id="k9-ps-svg" role="img" aria-label="48 platser för bakterier. Rosa ring betyder plasmid med resistensgen."></svg></figure><div>'+
   '<p class="small" style="margin:0 0 4px"><b>Antibiotikum i miljön</b></p>'+segHTML("k9-ps-ab",[["nej","Nej"],["ja","Ja"]],ab)+
   '<p class="small" style="margin:8px 0 4px"><b>Konjugation</b></p>'+segHTML("k9-ps-kj",[["av","Av"],["pa","På"]],kj)+
   '<p class="small" style="margin:8px 0 4px"><b>Start</b></p>'+segHTML("k9-ps-st",[["alla","Alla har plasmiden"],["tre","3 har plasmiden"]],st)+
   '<dl class="readout"><dt>Generation</dt><dd id="k9-ps-gen">0</dd><dt>Levande</dt><dd id="k9-ps-n"></dd><dt>Med plasmid</dt><dd id="k9-ps-pct"></dd></dl>'+
   '<div class="row"><button class="btn sm" type="button" id="k9-ps-1">1 generation</button><button class="btn ghost sm" type="button" id="k9-ps-5">5 generationer</button><button class="btn ghost sm" type="button" id="k9-ps-r">Börja om</button></div></div></div>'+
   '<p class="verdict m" id="k9-ps-why"></p><p class="small muted" style="margin:6px 0 0">'+api.tpl("{{extra}} Förenklad modell av bokens resonemang på s. 182 och 214. Risken att tappa plasmiden är kraftigt överdriven, så att du hinner se vad som händer.")+'</p>';
  const svg=api.$("#k9-ps-svg",el);
  function reset(){pop=[];for(let i=0;i<N;i++)pop.push(st==="alla"?1:(i===5||i===22||i===40?1:0));gen=0;killed=0;draw()}
  function step(){const alive=pop.filter(x=>x===0||x===1);if(!alive.length){draw();return}
   const surv=ab==="ja"?alive.filter(x=>x===1):alive;killed=alive.length-surv.length;
   let kids=[];surv.forEach(p=>{for(let k=0;k<2;k++){let d=p;if(d===1&&Math.random()<LOSS)d=0;kids.push(d)}});
   kids=api.shuffle(kids).slice(0,N);
   if(kj==="pa"){const idx=kids.map((x,i)=>i);const donors=idx.filter(i=>kids[i]===1);donors.forEach(()=>{if(Math.random()<.4){const rec=idx.filter(i=>kids[i]===0);if(rec.length)kids[rec[Math.floor(Math.random()*rec.length)]]=1}})}
   let dead=0;if(ab==="ja"){kids=kids.map(x=>{if(x===0){dead++;return -1}return x})}
   const out=kids.slice();const room=N-out.length;for(let i=0;i<Math.min(room,killed);i++)out.push(-1);while(out.length<N)out.push(null);
   pop=out;killed+=dead;gen++;draw()}
  function draw(){let o="";for(let i=0;i<N;i++){const c=i%8,r=Math.floor(i/8);const x=12+c*50,y=12+r*36;const v=pop[i];
    if(v===null){o+='<rect x="'+x+'" y="'+y+'" width="42" height="20" rx="10" fill="none" stroke-width="1.2" stroke-dasharray="3 3" style="stroke:var(--line2)"/>';continue}
    if(v===-1){o+='<rect x="'+x+'" y="'+y+'" width="42" height="20" rx="10" stroke-width="1.5" style="fill:var(--sunk);stroke:var(--line2)"/><path d="M'+(x+15)+' '+(y+4)+' l12 12 M'+(x+27)+' '+(y+4)+' l-12 12" fill="none" stroke-width="2" style="stroke:var(--bad)"/>';continue}
    o+='<rect x="'+x+'" y="'+y+'" width="42" height="20" rx="10" stroke-width="1.8" style="fill:var(--c-bact-soft);stroke:var(--c-bact)"/>';
    if(v===1)o+=ring(x+31,y+10,5,PLA,2.4)}
   o+='<text x="12" y="238" class="lbs" style="font-size:13px">rosa ring = plasmid med resistensgen</text><text x="12" y="256" class="lbs" style="font-size:13px">kryss = dödad av antibiotikum</text>';
   svg.innerHTML=o;
   const alive=pop.filter(x=>x===0||x===1),wp=alive.filter(x=>x===1).length;
   api.$("#k9-ps-gen",el).textContent=gen;api.$("#k9-ps-n",el).textContent=alive.length+" av "+N+" platser";
   api.$("#k9-ps-pct",el).textContent=alive.length?Math.round(100*wp/alive.length)+" %":"–";
   let why;
   if(!alive.length)why="<b>Alla bakterier dog</b>, eftersom ingen av dem hade plasmiden med resistensgenen.";
   else if(ab==="ja"&&kj==="pa")why="<b>Antibiotikum och konjugation.</b> Bakterier utan plasmid dör, och plasmiden lånas dessutom ut. Därför tar de resistenta snabbt över hela platsen.";
   else if(ab==="ja")why="<b>Med antibiotikum</b> dör de bakterier som saknar plasmiden, eftersom de saknar resistensgenen. De som har plasmiden överlever, delar sig och fyller upp de lediga platserna. Plasmiden finns därför kvar.";
   else if(kj==="pa")why="<b>Med konjugation</b> lånas plasmiden ut. Varje mottagare blir själv givare, och därför sprids plasmiden snabbt, även om bara tre bakterier hade den från början.";
   else if(st==="tre")why="<b>Utan antibiotikum och utan konjugation</b> förs plasmiden bara vidare vertikalt, till dotterbakterierna, och den kan tappas vid delningen. Den blir därför inte vanligare.";
   else why="<b>Utan antibiotikum</b> ger plasmiden ingen överlevnadsfördel. Ibland blir en dotterbakterie utan plasmid vid delningen, eftersom inget maskineri fördelar plasmiderna. Därför minskar andelen långsamt.";
   if(gen===0)why="Välj inställningar och tryck på <b>1 generation</b>. Gissa först: blir plasmiden vanligare eller ovanligare?";
   api.$("#k9-ps-why",el).innerHTML=why}
  [["k9-ps-ab",v=>ab=v],["k9-ps-kj",v=>kj=v],["k9-ps-st",v=>{st=v;reset()}]].forEach(([id,f])=>api.$$("#"+id+" button",el).forEach(b=>b.addEventListener("click",()=>{api.$$("#"+id+" button",el).forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));f(b.dataset.v);draw()})));
  api.$("#k9-ps-1",el).addEventListener("click",step);
  api.$("#k9-ps-5",el).addEventListener("click",()=>{for(let i=0;i<5;i++)step()});
  api.$("#k9-ps-r",el).addEventListener("click",reset);
  reset();
 }
};

G.def({
 id:"k9",
 src:{bok:"s. 182–183 (och s. 186, 213–215 om spridning och resistens)",ppt:"Mikroorganismer bild 18, 28 · Antibiotika bild 7–10, 16",ab:"Arbetsblad Mikroorganismernas värld (lucka 17–24)"},
 threads:["plasmid","endo"],
 goals:["förklara varför bakterier som delar sig bildar kloner och varför mutationer är ovanliga",
  "jämföra kromosom och plasmid och förklara varför plasmider kan försvinna ur en population",
  "beskriva transformation, konjugation och transduktion: givare, mottagare, vad som förs över och vad som behövs",
  "förklara hur gener flyttar inom en bakterie genom homolog rekombination och transposoner",
  "skilja vertikal och horisontell spridning och förklara varför resistens kan spridas snabbt",
  "förklara vad genbytena leder till över lång tid"],
 intro:`<p>I {{go:k8|K8}} lärde du känna bakterien, verkstaden i ett enda rum. Ritningarna ligger som en ring på golvet, och här och där ligger lösa receptkort. Det här kapitlet handlar om hur verkstaden ärver sina ritningar, och hur receptkorten kan tappas, lånas ut och hoppa mellan verkstäder. Det är förklaringen till att antibiotikaresistens kan spridas så snabbt ({{go:k12|K12}}).</p>`,
 secs:[
 {id:"delning",h:"Delning: arv utan sex",nav:"Delning",src:"s. 182 · PPT Mikroorganismer bild 28 · Arbetsblad",prov:true,html:`
  <p>Bakterier förökar sig genom att <b>dela sig</b> {{prov}}. Det är en <b>könlös förökning</b>, eftersom en bakterie blir två utan att två föräldrar blandar sina gener {{lek:Mikroorganismer bild 28}}. De två bakterier som bildas har i de allra flesta fall identisk arvsmassa. Bakterien kopierar nämligen hela sin arvsmassa före delningen och ger en kopia till var och en.</p>
  <p>När bakterier växer och delar sig bildas därför <b>kloner</b>, alltså bakterier med i stort sett samma arvsanlag.</p>
  <p>Ibland blir det fel när arvsmassan kopieras, och då uppstår en <b>mutation</b>. Det är ändå ovanligt. Bakterier har så liten arvsmassa att det bara är vid en celldelning på tio, hundra eller tusen som någon enstaka DNA-bokstav förändras.</p>
  <div class="box key"><p><b>Delning</b> ger två bakterier med nästan alltid identisk arvsmassa, alltså <b>kloner</b>. En ändrad DNA-bokstav kommer bara vid var tionde, hundrade eller tusende delning, eftersom arvsmassan är så liten.</p></div>
  <div class="box lek"><p>Under gynnsamma förhållanden tar en celldelning, en <b>generation</b>, 1–3 timmar. Vissa arter kan dela sig var tjugonde minut. Till skillnad från virus har bakterierna <b>egen ämnesomsättning</b>. De kan ta upp syre och näring och avge avfallsprodukter. {{lek:Mikroorganismer bild 28}}</p></div>
  <div class="box extra"><p>Räkneexempel: med 20 minuter per generation blir en bakterie 2, sedan 4 och sedan 8 på en timme. Efter åtta timmar, alltså 24 generationer, kan en enda bakterie ha blivit drygt 16 miljoner. Därför kan ett fåtal bakterier bli väldigt många på en dag.</p></div>
  <h3>Ärftlighet utan sex</h3>
  <p>Arbetsbladet sammanfattar det viktigaste. Trots att bakterier inte har könlig förökning sker det ändå ett utbyte av genetiskt material, alltså gener {{lek:Arbetsblad}}. Gener har därför två vägar. De kan ärvas nedåt, från modercell till dotterceller, eller flytta åt sidan, från en bakterie till en annan. Resten av kapitlet handlar om de två vägarna.</p>
  <div class="box fab"><p>Inför delningen kopierar verkstaden hela sin huvudpärm med ritningar. Sedan delas rummet i två, och varje ny verkstad får en pärm. Båda verkstäderna blir därför likadana, som två kopior av samma ritning.</p></div>
  <div class="box link"><p>Bakteriens byggnad, former och endosporer finns i {{go:k8|K8 Bakterier}}. Virus kan inte dela sig själva, se {{go:k10.virus|Virus i K10}}.</p></div>
  <div class="box trap"><p>Provfälla: kloner har identisk arvsmassa "i de allra flesta fall", eftersom mutationer ibland sker vid kopieringen. Och att bakterier saknar könlig förökning betyder inte att de aldrig byter gener.</p></div>
 `},
 {id:"plasmider",h:"Kromosom och plasmider",nav:"Plasmider",src:"s. 182, 214 · PPT Antibiotika bild 7, 16 · Arbetsblad",prov:true,html:`
  <p>En bakterie lagrar sin arvsmassa i en <b>cirkulär DNA-molekyl</b> som kallas <b>kromosom</b> {{prov}}. En typisk bakterie har några tusen gener på sin kromosom. Kromosomen ligger fritt i cytoplasman, eftersom bakterien saknar cellkärna.</p>
  <p>Ibland har bakterier dessutom extra, mindre, cirkulära DNA-molekyler som kallas <b>plasmider</b> {{prov}}. Plasmiderna bär ett litet antal gener som bakterien kan ha nytta av under speciella omständigheter, men som den inte ständigt behöver. Ett exempel är gener som ger resistens mot ett antibiotikum. Arbetsbladet kallar dem "extra-gener" som är bra att ha i extrema miljöer, till exempel vid <b>hög metallhalt</b> eller antibiotika {{lek:Arbetsblad}}.</p>
  <div class="lfig-h" data-fig="bakt"></div>
  <table class="cmp"><tr><th></th><th>Kromosom</th><th>Plasmid</th></tr>
   <tr><td>Form</td><td>en cirkulär DNA-molekyl</td><td>extra, mindre, cirkulära DNA-molekyler</td></tr>
   <tr><td>Antal gener</td><td>några tusen</td><td>ett litet antal</td></tr>
   <tr><td>Behövs</td><td>alltid</td><td>under speciella omständigheter, t.ex. när det finns antibiotika</td></tr>
   <tr><td>Kan förloras</td><td>ibland stora avsnitt, på många olika sätt</td><td>ja, vid en delning kan en dotterbakterie bli utan</td></tr>
   <tr><td>Till andra bakterier</td><td>bitar kan föras över</td><td>kan föras över, t.ex. vid konjugation</td></tr></table>
  <h3>Plasmider kan försvinna</h3>
  <p>Ibland händer det vid en celldelning att den ena bakterien blir utan den plasmid som moderbakterien hade. Boken förklarar varför på s. 214. Plasmiderna kopieras inför varje celldelning, men det finns inget maskineri som ser till att det hamnar plasmider i båda bakterierna som bildas. Plasmider kan därför långsamt försvinna i en bakteriepopulation, om de inte ger bakterien en <b>överlevnadsfördel</b> i den miljö den lever i.</p>
  <ol class="chainv"><li>Plasmiden kopieras inför delningen</li><li>Inget maskineri fördelar kopiorna, så ibland blir en dotterbakterie utan</li><li>Utan antibiotika i miljön ger plasmiden ingen överlevnadsfördel</li><li>Bakterier utan plasmid klarar sig lika bra och blir fler med tiden</li><li>Plasmiden försvinner långsamt ur populationen</li></ol>
  <p>Med antibiotika i miljön blir det tvärtom. Då dör de bakterier som saknar plasmiden med resistensgenen, och därför finns plasmiden kvar. Det är grunden till rådet att hålla nere antibiotikaanvändningen, se {{go:k12.motverka|Att motverka resistens i K12}}.</p>
  <p>Också kromosomen kan krympa. Då och då händer det att en bakterie förlorar stora avsnitt av sin kromosom, och det verkar kunna ske på många olika sätt.</p>
  <div class="w" data-w="plasmidSim"></div>
  <div class="box fab"><p>Kromosomen är verkstadens huvudpärm med alla ritningar som behövs varje dag. Plasmiderna är lösa receptkort med specialrecept, till exempel "så gör du dig okänslig för antibiotika". Lösa kort är praktiska och lätta att låna ut, men de kan också tappas när verkstaden delar sig.</p></div>
  <div class="box lek"><p>Lärarens bakteriebild har två etiketter för DNA, <b>DNA (kromosom)</b> och <b>DNA (plasmid)</b>. Avsnittsbilden om prokaryoter visar plasmiderna som röda ringar i en stavbakterie. {{lek:Antibiotika bild 16 · Mikroorganismer bild 18}}</p></div>
  <div class="box tr" data-t="plasmid" data-h="Plasmidens hem">Här hör plasmiden hemma: en liten extra ring av DNA med få gener, ofta för resistens. I K9 ser du hur den kopieras, tappas och flyttas mellan bakterier. I {{go:k12.mordare|K12}} bär ESBL-bakterierna sin resistens på en plasmid.</div>
  <div class="box tr" data-t="endo" data-h="Ringformat DNA">Bakteriens kromosom är cirkulär. Mitokondrien och kloroplasten har också eget ringformat DNA, och det är ett av bevisen för att de en gång var bakterier ({{go:k4.mitokondrien|K4}}, {{go:k13.kloroplasten|K13}}).</div>
  <div class="box trap"><p>Provfälla: det är kromosomen som har några tusen gener. Plasmiden har bara några få gener och kan saknas helt utan att bakterien dör.</p></div>
  <div class="x" data-x="tfPlasmid"></div>
 `},
 {id:"overforing",h:"Tre vägar in: transformation, konjugation och transduktion",nav:"Överföring",src:"s. 182–183 · PPT Antibiotika bild 7–10 · Arbetsblad",prov:true,html:`
  <p>Bakterier kan få nya gener från andra bakterier på tre sätt {{prov}}. Alla tre finns i boken, i lärarens powerpoint och på arbetsbladet, så lär dig dem ordentligt.</p>
  <div class="box key"><p><b>Transformation</b>: bakterien fiskar upp plasmider eller andra bitar <b>naket DNA</b> från omgivningen.</p><p><b>Konjugation</b>: bakterien fäster vid en närbesläktad bakterie bredvid, bildar en kanal och för över delar av sin arvsmassa.</p><p><b>Transduktion</b>: gener eller stora paket av gener förs över mellan bakterier av <b>bakterievirus</b>.</p></div>
  <div class="lfig-h" data-fig="flytt"></div>
  <h3>Transformation: DNA från döda bakterier</h3>
  <p>Boken säger att alla bakterier då och då kan fiska upp plasmider eller andra bitar naket DNA från omgivningen. Arbetsbladet förklarar var DNA:t kommer ifrån. Döda organismer bryts hela tiden ned, och därför frigörs stora mängder DNA som bakterier kan ta upp {{lek:Arbetsblad}}.</p>
  <p>Läraren lägger till fler detaljer {{lek:Antibiotika bild 9}}. DNA:t kommer från bakterier som har dött och <b>lyserat</b>, alltså spruckit. Det kan vara <b>DNA-fragment</b> eller hela plasmider. Det tas upp av bakterier som är <b>naturligt kompetenta</b>. De binder DNA:t med hjälp av proteiner på cellytan, tar in det i cellen och fogar in det i sin kromosom. Om en hel plasmid tas upp blir den i stället en egen, separat del av bakterien.</p>
  <div class="lfig-h" data-fig="transf"></div>
  <div class="box diff"><p><b>Boken:</b> alla bakterier kan då och då fiska upp naket DNA. <b>Läraren:</b> DNA:t tas upp av bakterier som är naturligt kompetenta. På provet kan du skriva bokens mening och lägga till att kompetenta bakterier binder DNA med proteiner på cellytan.</p></div>
  <h3>Konjugation: en kanal till grannen</h3>
  <p>Enligt boken kan många bakterier föra över delar av sin arvsmassa till närbesläktade bakterier bredvid. De fäster vid grannen och bildar en kanal till den. Läraren beskriver konjugation som utbyte av DNA i form av plasmider, via kontakt med hjälp av <b>sexpili</b> {{lek:Antibiotika bild 8}}.</p>
  <p>Plasmiden som kan orsaka konjugation innehåller gener för sexpili. Därför kan bara en bakterie som har en sådan plasmid fungera som <b>givarcell</b>. Bakterien som tar emot kallas <b>mottagarcell</b>. När mottagarcellen har fått plasmiden kan den själv bilda sexpili och bli givarcell. Därför kan några få bakterier med plasmiden snabbt göra om en hel population, och på så sätt kan antibiotikaresistens spridas mycket snabbt {{lek:Antibiotika bild 8}}.</p>
  <div class="lfig-h" data-fig="konj"></div>
  <div class="x" data-x="ordKonj"></div>
  <div class="box diff"><p><b>Boken:</b> vid konjugation förs "delar av sin arvsmassa" över, och bokens figur på s. 183 visar DNA från kromosomen som går genom kanalen. <b>Läraren och arbetsbladet:</b> vid konjugation förs plasmider över. Skriv gärna "delar av arvsmassan, ofta plasmider" så täcker du båda.</p></div>
  <h3>Transduktion: virus som budbärare</h3>
  <p>Vid transduktion förs gener eller stora paket av gener över mellan bakterier av ett bakterievirus. Ett virus som kan infektera bakterier kallas <b>bakteriofag</b>, eller bara fag ({{go:k10.virus|K10}}). Arbetsbladet säger att bakterieviruset för över en eller flera gener från en bakterie till en annan när det infekterar {{lek:Arbetsblad}}.</p>
  <p>Lärarens bild visar hur det går till {{lek:Antibiotika bild 10}}. Fagen för in sitt DNA i en bakterie, och virus-DNA:t fogas in i bakteriens kromosom. När nya virus byggs följer en bit av bakteriens eget DNA med in i en ny viruspartikel. När det viruset infekterar nästa bakterie för det in bakteriegenerna där, och de kan fogas in i den nya bakteriens kromosom. Viruset bär alltså gener från en bakterie till en annan, utan att bakterierna behöver träffas.</p>
  <div class="lfig-h" data-fig="transd"></div>
  <div class="x" data-x="ordTransd"></div>
  <table class="cmp"><tr><th></th><th>Transformation</th><th>Konjugation</th><th>Transduktion</th></tr>
   <tr><td>Varifrån</td><td>naket DNA i omgivningen, från döda bakterier</td><td>en levande givarcell bredvid</td><td>en bakterie som ett virus har infekterat</td></tr>
   <tr><td>Vad</td><td>plasmider eller DNA-bitar</td><td>delar av arvsmassan, ofta plasmider</td><td>gener eller paket av gener</td></tr>
   <tr><td>Hur</td><td>bakterien tar upp DNA:t</td><td>kontakt och kanal (sexpilus)</td><td>en bakteriofag bär DNA:t</td></tr>
   <tr><td>Kräver</td><td>fritt DNA och en kompetent bakterie</td><td>närbesläktad granne och plasmid med gener för sexpili</td><td>ett bakterievirus</td></tr></table>
  <div class="w" data-w="genSim"></div>
  <div class="box trick"><p>Trans<b>f</b>ormation = <b>f</b>iska upp DNA från gatan. <b>K</b>onjugation = <b>k</b>ontakt och <b>k</b>anal till grannen. Trans<b>d</b>uktion = <b>d</b>rönarleverans med virus.</p></div>
  <div class="box fab"><p>Transformation är när verkstaden plockar upp receptkort som blivit kvar efter en nedlagd verkstad på gatan. Konjugation är när två grannverkstäder kopplar ihop sig med en slang och den ena skickar över en kopia av ett receptkort. Transduktion är när en kapare, ett virus, råkar ta med sig ett receptkort från en verkstad och lämnar det i nästa.</p></div>
  <div class="box trap"><p>Provfälla: transformation och transduktion låter lika. Vid transformation tas naket DNA upp, utan budbärare. Vid transduktion är ett virus budbärare. Konjugation är det enda av de tre sätten där två levande bakterier måste ha kontakt.</p></div>
  <div class="x" data-x="sortVag"></div>
  <div class="box link"><p>Fagerna och hur virus tar över celler finns i {{go:k10.virus|K10}}. Varför resistens sprids så fort finns i {{go:k12.spridning|K12}}.</p></div>
 `},
 {id:"rekombination",h:"Gener byter plats inuti bakterien",nav:"Rekombination",src:"s. 183 · Arbetsblad",prov:true,html:`
  <p>Gener och paket av gener kan också byta plats mellan olika delar av en bakteries egen arvsmassa {{prov}}. De kan flytta från en plasmid till kromosomen, eller från kromosomen till en plasmid. Det kan bland annat ske genom en naturlig process som kallas <b>homolog omlagring</b>, eller <b>homolog rekombination</b>. Det kan också ske med hjälp av transposoner, som kommer i nästa avsnitt. Arbetsbladet nämner båda sätten {{lek:Arbetsblad}}.</p>
  <div class="box extra"><p>"Homolog" betyder ungefär "likadan". Homolog rekombination sker mellan DNA-avsnitt som har nästan samma ordning av DNA-bokstäver, och därför kan avsnitten byta plats med varandra.</p></div>
  <h3>Vad leder genbytena till?</h3>
  <p>Ur en enskild bakteries perspektiv är förluster, upptag och omflyttningar av gener mycket ovanliga. Men över längre tidsperioder leder de till att bakteriers arvsmassa kan genomgå stora förändringar, och att bakteriegener av olika ursprung kombineras med varandra på nya sätt.</p>
  <p>Resultatet är häpnadsväckande. Många bakterier har inte ens hälften av sina gener gemensamt med alla sina artfränder. Huvuddelen av de gener som finns hos en bakterieart finns alltså bara hos en del medlemmar av arten. Därför är det svårt att säga vad en bakterieart är, och det tar {{go:k10.system|systematiken i K10}} upp.</p>
  <ol class="chainv"><li>Gener tappas, tas upp och flyttas, sällan men hela tiden</li><li>Över lång tid förändras arvsmassan mycket</li><li>Gener av olika ursprung kombineras på nya sätt</li><li>Bakterier av samma art kan ha mindre än hälften av generna gemensamt</li><li>Det blir svårt att definiera en art hos bakterier</li></ol>
  <div class="box fab"><p>Homolog rekombination är som att byta ut en sida i huvudpärmen mot en nästan likadan sida från ett receptkort. Efter mycket lång tid blir varje verkstads pärm ett lapptäcke av sidor från olika håll.</p></div>
  <div class="box trap"><p>Provfälla: transformation, konjugation och transduktion flyttar gener <b>mellan</b> bakterier. Homolog rekombination och transposoner flyttar gener <b>inom</b> en bakterie, mellan plasmid och kromosom.</p></div>
  <div class="x" data-x="sortInom"></div>
 `},
 {id:"transposoner",h:"Transposoner: gener som hoppar",nav:"Transposoner",src:"s. 183, 213–215 · Arbetsblad",prov:true,html:`
  <p><b>Transposoner</b> är <b>mobila genetiska element</b> {{prov}}. De är avsnitt av DNA-molekylen som lätt kan flyttas eller kopieras, varpå kopian placeras på något annat ställe i bakteriens arvsmassa. På så sätt kan en gen hoppa från kromosomen till en plasmid, eller tvärtom.</p>
  <div class="lfig-h" data-fig="transp"></div>
  <p>Boken återkommer till detta när den förklarar resistens (s. 213–214). Det finns mekanismer hos bakterier som gör det möjligt för resistensgener, och grupper av sådana, att hoppa mellan olika ställen i bakteriens arvsmassa och att flyttas från en bakterie till en annan, även över artgränser. Sammantaget gör detta att bakterier som är resistenta mot ett antibiotikum kan dyka upp var och när som helst.</p>
  <p>Ett exempel är <b>MRSA</b>, meticillinresistenta gula stafylokocker. De bär på ett <b>hoppande genpaket</b>, en transposon, som ger resistens mot de flesta antibiotika som slår mot cellväggssyntesen (s. 215). Läs mer i {{go:k12.mordare|Mördarbakterier i K12}}.</p>
  <ol class="chainv"><li>En resistensgen sitter i en transposon på kromosomen</li><li>Transposonen kopieras och hamnar på en plasmid</li><li>Plasmiden förs över till en annan bakterie, t.ex. genom konjugation</li><li>Den bakterien blir också resistent</li></ol>
  <div class="box trick"><p>Trans<b>pos</b>on byter <b>pos</b>ition. Tänk "hoppande gener" eller klipp och klistra i arvsmassan.</p></div>
  <div class="box fab"><p>En transposon är en lapp i pärmen som kan klippas ut, eller kopieras, och klistras in någon annanstans. Om lappen hamnar på ett löst receptkort kan den följa med kortet till en annan verkstad.</p></div>
  <div class="box trap"><p>Provfälla: en transposon är bara ett avsnitt av DNA. Den flyttar gener inom bakteriens arvsmassa. För att hamna i en annan bakterie behöver den följa med, till exempel på en plasmid.</p></div>
 `},
 {id:"spridning",h:"Vertikal och horisontell spridning",nav:"Spridning",src:"s. 186, 213–214 · PPT Antibiotika bild 7",prov:true,html:`
  <p>Gener kan föras vidare på två sätt {{prov}}. Läraren använder orden om resistensgener {{lek:Antibiotika bild 7}}.</p>
  <div class="box key"><p><b>Vertikal spridning</b>: från en modercell till två dotterceller.</p><p><b>Horisontell spridning</b>: från en bakterie till en annan bakterie genom konjugation, transduktion eller transformation.</p></div>
  <p>Boken använder samma ord om evolutionen (s. 186). Gener har förts vidare "vertikalt" från anfader till avkomma, men också "horisontellt" mellan olika individer och arter, ofta med virus som transportörer. Mer om det i {{go:k10.betydelse|Virus betydelse i K10}}.</p>
  <div class="lfig-h" data-fig="vh"></div>
  <h3>Varför kan resistens spridas så snabbt?</h3>
  <p>Lärarens förklaring börjar med en mutation {{lek:Antibiotika bild 7}}. Om antibiotika finns i bakteriernas miljö och en bakterie får en mutation som gör att den tål antibiotikan, ärver alla dess avkommor egenskapen. Genom naturligt urval får de en överlevnadsfördel. Ju mer människan använder antibiotika, desto vanligare blir därför antibiotikaresistenta bakterier.</p>
  <p>Horisontell spridning gör det ännu snabbare. En resistensgen behöver inte uppstå på nytt i varje bakterie, eftersom den kan lånas ut. En enda bakterie med en resistensplasmid kan genom konjugation göra grannarna till nya givare, och resistensgener kan enligt boken flyttas även över artgränser.</p>
  <ol class="chainv"><li>Antibiotika finns i miljön</li><li>En bakterie har en resistensgen, från en mutation eller lånad</li><li>Känsliga bakterier dör, den resistenta överlever och delar sig (vertikalt)</li><li>Resistensgenen lånas ut till andra bakterier (horisontellt)</li><li>Resistenta bakterier blir snabbt vanliga</li></ol>
  <div class="box diff"><p><b>Boken:</b> gener för antibiotikaresistens ligger "i många fall" på plasmider (s. 214), och MRSA bär sin resistens i en transposon (s. 215). <b>Läraren:</b> "Resistensgener (evolutionärt skydd) sitter på plasmider." Skriv bokens version på provet: ofta på plasmider, men inte alltid.</p></div>
  <div class="box fab"><p>Vertikalt är när verkstaden delar sig och båda nya verkstäder får pärmen. Horisontellt är när ett receptkort lånas ut till grannen, ibland till och med till en verkstad av en annan sort. Försvarsreceptet mot sabotörerna, antibiotikan, sprids då som ett rykte genom hela kvarteret.</p></div>
  <div class="box link"><p>Hur antibiotikan väljer ut resistenta bakterier i en patient, och vad vi kan göra åt det, finns i {{go:k12.selektion|K12 Selektion}} och {{go:k12.motverka|K12 Att motverka resistens}}.</p></div>
  <div class="box trap"><p>Provfälla: det är bakterierna som blir resistenta, inte människan {{lek:Antibiotika bild 2}}. Antibiotikan skapar inte heller resistensgenen. Den dödar de känsliga bakterierna, så att de resistenta får plats.</p></div>
  <div class="x" data-x="chainK9"></div>
 `},
 {id:"repetera",h:"Repetera kapitlet",nav:"Repetera",src:"s. 182–183 · Arbetsblad",html:`
  <p>Här blandas allt från kapitlet. Gör övningarna utan att titta, och läs förklaringen efter varje svar.</p>
  <div class="x" data-x="clozeK9"></div>
  <div class="x" data-x="fixK9"></div>
  <div class="x" data-x="whoK9"></div>
  <div class="x" data-x="matchK9"></div>
 `}
 ],
 figs:FIGS,
 ex:{
  tfPlasmid:{ty:"tf",h:"Kromosom, plasmid och delning",items:[
   ["En typisk bakterie har några tusen gener på sin kromosom.",true,"Det står i boken s. 182. Plasmiderna har bara ett litet antal gener."],
   ["Plasmider är stora, raka DNA-molekyler.",false,"Plasmider är extra, mindre, <b>cirkulära</b> DNA-molekyler."],
   ["Bakterien behöver sina plasmider hela tiden för att överleva.",false,"Plasmidens gener är nyttiga under speciella omständigheter, men behövs inte ständigt."],
   ["En plasmid kan bära gener för antibiotikaresistens.",true,"Det är bokens exempel. Arbetsbladet nämner också hög metallhalt."],
   ["Vid en delning kan en dotterbakterie bli utan plasmid.",true,"Plasmiderna kopieras, men inget maskineri ser till att båda dotterbakterierna får en."],
   ["Utan antibiotika i miljön blir plasmider med resistensgener vanligare med tiden.",false,"Tvärtom. Utan överlevnadsfördel försvinner plasmiden långsamt ur populationen."],
   ["Bakterier förökar sig könlöst genom delning och bildar kloner.",true,"De två bakterierna har i de allra flesta fall identisk arvsmassa."],
   ["Mutationer sker vid nästan varje delning hos bakterier.",false,"Arvsmassan är så liten att bara var tionde, hundrade eller tusende delning ger en ändrad DNA-bokstav."]],src:"s. 182, 214"},
  ordKonj:{ty:"order",h:"Konjugation steg för steg",intro:"Lägg stegen i rätt ordning.",items:[
   "Givarcellen har en plasmid med gener för sexpili.",
   "Givarcellen fäster med sexpilus vid en närbesläktad mottagarcell, och en kanal bildas.",
   "Den ena strängen i plasmiden klipps av.",
   "Strängen förs över genom kanalen, och nya strängar byggs i båda cellerna.",
   "Båda cellerna har nu en hel plasmid.",
   "Mottagarcellen bildar själv sexpili och kan bli givarcell."],
   why:"Bara en bakterie med en plasmid som har gener för sexpili kan vara givare. Kontakten kommer först, och sedan förs en sträng över medan nya strängar byggs. Eftersom mottagaren får hela plasmiden, även generna för sexpili, kan den sedan själv bli givare.",src:"s. 182 · PPT Antibiotika bild 8"},
  ordTransd:{ty:"order",h:"Transduktion steg för steg",items:[
   "En bakteriofag för in sitt DNA i bakterie 1.",
   "Virus-DNA:t fogas in i bakteriens kromosom.",
   "Nya virus byggs, och en bit av bakteriens eget DNA följer med in i ett av dem.",
   "Viruset infekterar bakterie 2 och för in DNA:t med generna från bakterie 1.",
   "Generna från bakterie 1 fogas in i kromosomen hos bakterie 2."],
   why:"Viruset är budbäraren. Bakteriens gener hamnar i viruset när nya virus byggs i bakterie 1, och därför kan viruset lämna dem i nästa bakterie.",src:"s. 183 · PPT Antibiotika bild 10"},
  sortVag:{ty:"sort",h:"Vilket sätt är det?",cats:["Transformation","Konjugation","Transduktion"],items:[
   ["Bakterien tar upp naket DNA från omgivningen",0,"Naket DNA utan budbärare är transformation."],
   ["DNA:t kommer från bakterier som dött och spruckit",0,"DNA från döda, lyserade bakterier tas upp vid transformation."],
   ["Bakterien måste vara naturligt kompetent",0,"Kompetenta bakterier binder DNA med proteiner på cellytan."],
   ["Kräver sexpili och kontakt mellan två levande bakterier",1,"Konjugation sker via kontakt och en kanal."],
   ["Mottagaren kan själv bli givare efteråt",1,"Mottagaren får plasmiden med generna för sexpili."],
   ["Sker till närbesläktade bakterier som ligger bredvid",1,"Så beskriver boken konjugation."],
   ["Ett bakterievirus bär generna",2,"Virus som budbärare är transduktion."],
   ["En fag infekterar två bakterier efter varandra",2,"Fagen tar med bakterie-DNA från den första till den andra."]],src:"s. 182–183 · PPT Antibiotika bild 8–10"},
  sortInom:{ty:"sort",h:"Inom eller mellan bakterier?",cats:["Inom en bakterie","Mellan bakterier"],items:[
   ["Homolog rekombination",0,"Flyttar gener mellan plasmid och kromosom i samma bakterie."],
   ["Transposoner",0,"Hoppar mellan ställen i bakteriens egen arvsmassa."],
   ["En gen flyttar från en plasmid till kromosomen",0,"Det sker inom bakterien."],
   ["Transformation",1,"DNA från omgivningen tas upp."],
   ["Konjugation",1,"DNA förs över till en granne."],
   ["Transduktion",1,"Ett virus bär gener till en annan bakterie."],
   ["Horisontell spridning",1,"Från en bakterie till en annan."]],src:"s. 182–183"},
  chainK9:{ty:"chain",h:"Saknad länk",items:[
   {h:"Plasmiden försvinner",steps:["Plasmiden kopieras inför delningen","Inget maskineri fördelar kopiorna till båda dotterbakterierna","Ibland blir en dotterbakterie utan plasmid","Utan antibiotika ger plasmiden ingen överlevnadsfördel","Plasmiden försvinner långsamt ur populationen"],b:2,w:["Plasmiden bryts ner av bakteriens ribosomer","Dotterbakterien får dubbelt så många plasmider"],why:"Eftersom plasmiderna inte fördelas säkert kan en dotterbakterie bli utan. Utan selektion försvinner plasmiden då långsamt."},
   {h:"Konjugation sprider resistens",steps:["En bakterie har en plasmid med resistensgen och gener för sexpili","Den fäster med sexpilus vid en mottagarcell","Mottagaren får en kopia av plasmiden","Mottagaren bildar sexpili och blir själv givare","Resistensen sprids snabbt i populationen"],b:3,w:["Mottagaren dör av det främmande DNA:t","Givaren förlorar sin plasmid"],why:"Eftersom varje mottagare blir en ny givare sprids plasmiden som en kedjereaktion."},
   {h:"Transduktion",steps:["En fag infekterar bakterie 1","Virus-DNA fogas in i kromosomen","En bit bakterie-DNA hamnar i ett nytt virus","Viruset infekterar bakterie 2","Bakterie 2 får gener från bakterie 1"],b:2,w:["Bakterie 1 och 2 bildar en kanal mellan sig","Bakterie 2 tar upp naket DNA från omgivningen"],why:"Bakteriens DNA följer med in i ett nytt virus när det byggs, och därför kan viruset leverera det."},
   {h:"Resistens blir vanligare (läraren)",steps:["Antibiotika finns i miljön","En bakterie får en mutation som gör att den tål antibiotikan","Alla dess avkommor ärver resistensen","Naturligt urval ger dem en överlevnadsfördel","Resistenta bakterier blir vanligare"],b:2,w:["Antibiotikan gör bakterien resistent","Människan blir resistent mot antibiotikan"],why:"Avkommorna ärver resistensen vertikalt, och eftersom de känsliga dör får de resistenta plats."}],src:"s. 182–183, 214 · PPT Antibiotika bild 7–8, 10"},
  fixK9:{ty:"fix",h:"Hitta felet i Pelles förklaring",parts:[
   "Bakterier förökar sig genom delning och bildar kloner. Kromosomen är en cirkulär DNA-molekyl med några tusen gener.",
   ["Plasmiden är en stor, rak DNA-molekyl som bakterien alltid behöver.","Plasmiden är en extra, liten, cirkulär DNA-molekyl med få gener som bara behövs ibland.","Plasmidens gener, t.ex. för resistens, är nyttiga under speciella omständigheter."],
   "Vid konjugation fäster bakterien vid en närbesläktad granne och för över DNA genom en kanal.",
   ["Vid transformation bär ett virus generna mellan bakterierna.","Vid transduktion bär ett bakterievirus generna mellan bakterierna.","Transformation är upptag av naket DNA. Viruset hör till transduktion."],
   ["Transposoner för över gener mellan två bakterier med hjälp av sexpili.","Transposoner flyttar eller kopierar DNA-avsnitt till ett annat ställe i samma bakteries arvsmassa.","Sexpili hör till konjugation."],
   "Plasmider kan försvinna ur en population om de inte ger någon överlevnadsfördel."],src:"s. 182–183"},
  whoK9:{ty:"who",h:"Vem är jag?",items:[
   {clues:["Jag är bara ett avsnitt av DNA.","Jag kan kopieras och klistras in på ett nytt ställe i arvsmassan.","MRSA bär sin resistens i mig, och jag kallas hoppande genpaket."],a:"Transposon",w:["Plasmid","Bakteriofag","Sexpilus"],why:"En transposon är ett mobilt genetiskt element (s. 183, 215)."},
   {clues:["Jag är cirkulär.","Bakterien kan klara sig utan mig.","Jag är en liten extra DNA-ring med få gener, t.ex. för resistens."],a:"Plasmid",w:["Kromosom","Transposon","Ribosom"],why:"Kromosomen är också cirkulär, men den behövs alltid och har några tusen gener."},
   {clues:["Jag behöver inget virus och ingen levande givare.","Jag kräver en naturligt kompetent bakterie.","Jag är upptag av naket DNA från döda bakterier."],a:"Transformation",w:["Transduktion","Konjugation","Homolog rekombination"],why:"Vid transformation tas fritt DNA upp från omgivningen."},
   {clues:["Jag har ingen egen ämnesomsättning.","Jag kan bära gener från en bakterie till en annan.","Jag är ett virus som infekterar bakterier och kallas ofta fag."],a:"Bakteriofag",w:["Transposon","Plasmid","Sexpilus"],why:"Bakteriofagen är budbäraren vid transduktion."},
   {clues:["Generna för mig sitter på en plasmid.","Jag skapar kontakt mellan givarcell och mottagarcell.","Utan mig blir det ingen konjugation enligt läraren."],a:"Sexpilus",w:["Flagell","Fimbrie","Ribosom"],why:"Konjugation sker via kontakt med hjälp av sexpili (PPT Antibiotika bild 8)."}],src:"s. 182–183, 215 · PPT Antibiotika bild 8–10"},
  matchK9:{ty:"match",h:"Para ihop med fabriksbilden",pairs:[
   ["Kromosom","verkstadens huvudpärm med några tusen ritningar"],
   ["Plasmid","löst receptkort med specialrecept"],
   ["Transformation","plocka upp receptkort på gatan"],
   ["Konjugation","skicka en kopia genom en slang till grannen"],
   ["Transduktion","kaparen tar med ett receptkort till nästa verkstad"],
   ["Transposon","lapp som klipps och klistras in på ett nytt ställe"],
   ["Vertikal spridning","verkstaden delar sig och båda får pärmen"]],why:"Bilderna hjälper dig minnas skillnaderna: pärm mot lösa kort, och tre sätt för korten att flytta."},
  clozeK9:{ty:"cloze",h:"Arbetsbladet, lucka 17–24",intro:"Ordagrant från arbetsbladet Mikroorganismernas värld. De två sista luckorna är tillagda.",bank:true,
   text:"Bakterier förökar sig genom [[delning|celldelning]]. Arvsmassan finns lagrad i en [[cirkulär]] [[DNA-molekyl|dna-molekyl]] som också kallas för en [[kromosom]]. Vissa bakterier kan också ha \"extra-gener\" i s.k. [[plasmider|plasmid]]. Dessa gener är ofta gener som kan vara extra bra att ha om bakterien utsätts för extrema miljöer, exempelvis hög metallhalt eller antibiotika. Trots att bakterier inte har könlig förökning sker det ändå ett utbyte av genetiskt material (gener). Detta kan ske genom att bakterier tar upp DNA från omgivningen. Eftersom döda organismer hela tiden bryts ned frigörs också stora mängder DNA och bakterier kan alltså ibland ta upp bitar av sådant DNA. Detta kallas för [[transformation]]. Ett bakterievirus kan också föra över en eller fler gener från en bakterie till en annan då den infekterar. Detta kallas för [[transduktion]]. Ett tredje sätt på vilket utbyte kan ske är genom [[konjugation]] vilket innebär att bakterier kan föra över plasmider till varandra. Gener kan också byta plats hos en bakterie, så att gener på plasmiden hamnar i kromosomen eller tvärtom. Detta kan ske genom [[homolog rekombination|homolog omlagring]] eller med hjälp av [[transposoner|transposon]].",
   why:"Transformation = upptag av DNA, transduktion = via virus, konjugation = överföring till en granne."}
 },
 w:W
});
})();
