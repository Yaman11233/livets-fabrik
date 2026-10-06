/* K4 Organellerna. Bok s. 21–27, PPT Bi2 bild 17, 21–22, 29–30, korsord kap 1. */
(function(){
"use strict";
const r1=n=>Math.round(n*10)/10;
const st=(f,s,w)=>`style="fill:var(${f})${s?";stroke:var("+s+")":""}"${w!=null?` stroke-width="${w}"`:""}`;
const ln=(d,c,w,x)=>`<path d="${d}" fill="none" style="stroke:var(${c})" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${x||""}/>`;
const TX='class="lbs halo" style="font-size:15px"';
function dots(pts,r,col){return pts.map(p=>`<circle cx="${r1(p[0])}" cy="${r1(p[1])}" r="${r}" style="fill:var(${col||"--ink"})"/>`).join("")}
function arcPt(cx,cy,R,a){const t=a*Math.PI/180;return [r1(cx+R*Math.cos(t)),r1(cy+R*Math.sin(t))]}
function arcPath(cx,cy,R,a0,a1){const p=arcPt(cx,cy,R,a0),q=arcPt(cx,cy,R,a1);return `M${p[0]} ${p[1]} A${R} ${R} 0 0 1 ${q[0]} ${q[1]}`}
function arcDots(cx,cy,R,a0,a1,step){const o=[];for(let a=a0;a<=a1+0.01;a+=step)o.push(arcPt(cx,cy,R,a));return o}
function squiggle(cx,cy,R,n,seed){const pts=[];for(let i=0;i<n;i++){const a=i*2.399+seed;const f=Math.abs(Math.sin(i*12.9898+seed)*43758.5453)%1;const rr=R*(0.25+0.75*f);pts.push([r1(cx+rr*Math.cos(a)),r1(cy+rr*Math.sin(a))])}
  let d=`M${pts[0][0]} ${pts[0][1]}`;for(let i=1;i<pts.length-1;i++){const m=[r1((pts[i][0]+pts[i+1][0])/2),r1((pts[i][1]+pts[i+1][1])/2)];d+=` Q${pts[i][0]} ${pts[i][1]} ${m[0]} ${m[1]}`}return d}
function arr(x1,y1,x2,y2,col,w,hs){const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,h=hs||8;const bx=x2-ux*h,by=y2-uy*h,px=-uy*h*0.6,py=ux*h*0.6;
  return `<path d="M${r1(x1)} ${r1(y1)} L${r1(bx)} ${r1(by)}" fill="none" style="stroke:var(${col})" stroke-width="${w}" stroke-linecap="round"/><polygon points="${r1(x2)},${r1(y2)} ${r1(bx+px)},${r1(by+py)} ${r1(bx-px)},${r1(by-py)}" style="fill:var(${col})"/>`}
function mito(cx,cy,rx,ry,rot,soft){let z=`M${r1(cx-rx*0.72)} ${cy}`;const n=7;for(let i=1;i<=n;i++){const x=cx-rx*0.72+i*(rx*1.44/n);z+=` L${r1(x)} ${r1(cy+(i%2?-1:1)*ry*0.55)}`}
  return `<g transform="rotate(${rot} ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${st(soft?"--c-mito-soft":"--c-mito-soft","--c-mito",2)}/><path d="${z}" fill="none" style="stroke:var(--c-mito)" stroke-width="1.5"/></g>`}
function golgiStack(x,y,n,w,gap,col){let s="";for(let i=0;i<n;i++){const yy=y+i*gap;s+=ln(`M${x} ${yy} Q${x+w/2} ${yy+10} ${x+w} ${yy}`,col||"--c-golgi",5)}return s}
function segHTML(id,label,opts,cur){return `<div class="ctl">${label}<div class="seg" role="group" aria-label="${label}" id="${id}">${opts.map(([v,t])=>`<button type="button" data-v="${v}" aria-pressed="${v===cur}">${t}</button>`).join("")}</div></div>`}

/* ---------- figur: djurcellen (s. 21) ---------- */
const CELL="M160 52 C210 18 300 22 342 56 C380 88 376 160 368 210 C360 262 380 330 340 370 C300 408 200 410 160 378 C118 344 110 290 116 236 C122 182 106 96 160 52 Z";
function figDjurcell(){
  let s=`<g data-k="cyto"><path d="${CELL}" ${st("--c-cyto")}/></g>`;
  /* cellskelett (inte med i bokens bild) */
  s+=`<g data-k="skel">${ln("M150 300 L230 250 M300 360 L330 260 M140 200 L190 120 M340 230 L360 120","--muted",1,' opacity=".55"')}${ln("M150 300 L230 250 M300 360 L330 260 M140 200 L190 120 M340 230 L360 120","--muted",9,' opacity="0"')}</g>`;
  /* kärna */
  s+=`<g data-k="karna"><circle cx="255" cy="150" r="56" ${st("--c-nuc-soft")}/></g>`;
  s+=`<g data-k="dna">${ln(squiggle(258,148,40,22,1.3),"--c-dna",1.8)}</g>`;
  s+=`<g data-k="nukleol"><ellipse cx="236" cy="168" rx="11" ry="9" ${st("--c-nuc")}/></g>`;
  s+=`<g data-k="kmem"><circle cx="255" cy="150" r="56" fill="none" style="stroke:var(--c-nuc)" stroke-width="2.5"/><circle cx="255" cy="150" r="51" fill="none" style="stroke:var(--c-nuc)" stroke-width="1.5"/></g>`;
  /* kornigt ER runt kärnan */
  let g=`<g data-k="rer">`;
  [66,75,84].forEach(R=>{g+=ln(arcPath(255,150,R,112,250),"--c-er",3.2)+dots(arcDots(255,150,R+3,114,248,9),1.5)});
  s+=g+`</g>`;
  /* slätt ER */
  s+=`<g data-k="ser">${ln("M140 112 C150 100 160 124 170 112 C178 102 186 118 180 132 C174 146 150 136 144 150 C138 164 160 170 166 160","--c-er",6)}${ln("M140 112 C150 100 160 124 170 112 C178 102 186 118 180 132 C174 146 150 136 144 150 C138 164 160 170 166 160","--c-cyto",2)}</g>`;
  /* fria ribosomer */
  s+=`<g data-k="rib"><rect x="132" y="228" width="50" height="32" fill="transparent"/>${dots([[140,236],[150,248],[162,238],[172,252],[146,258],[176,232],[300,240],[318,212],[204,262],[222,300]],2)}</g>`;
  /* golgi */
  s+=`<g data-k="golgi"><rect x="150" y="286" width="72" height="56" fill="transparent"/>${golgiStack(156,296,4,56,10)}<circle cx="214" cy="336" r="4" ${st("--c-golgi")}/><circle cx="152" cy="338" r="3.5" ${st("--c-golgi")}/></g>`;
  /* centrioler */
  s+=`<g data-k="cent"><rect x="226" y="338" width="26" height="10" rx="3" ${st("--muted")}/><rect x="244" y="326" width="10" height="26" rx="3" ${st("--muted")}/></g>`;
  /* mitokondrier */
  s+=`<g data-k="mito">${mito(300,322,27,13,-20)}${mito(318,196,18,9,20)}</g>`;
  /* vakuol, lysosom, peroxisom */
  s+=`<g data-k="vak"><ellipse cx="346" cy="232" rx="13" ry="10" ${st("--c-vac-soft","--c-vac",2)}/></g>`;
  s+=`<g data-k="lyso"><circle cx="348" cy="288" r="10" ${st("--good-soft","--c-lyso",2)}/>${dots([[345,285],[351,291],[350,283]],1.8,"--c-lyso")}</g>`;
  s+=`<g data-k="perox"><circle cx="290" cy="266" r="6.5" ${st("--c-arch-soft","--c-arch",1.6)}/></g>`;
  /* cellmembran */
  s+=`<g data-k="mem"><path d="${CELL}" fill="none" style="stroke:var(--c-mem)" stroke-width="4"/></g>`;
  return s}

/* ---------- figur: kärnan med ER (s. 23) ---------- */
function figKarna(){
  let s=`<rect x="110" y="40" width="300" height="275" rx="20" ${st("--c-cyto")}/>`;
  let g=`<g data-k="rer">`;
  [100,111,122].forEach(R=>{g+=ln(arcPath(220,178,R,-62,62),"--c-er",3.4)+dots(arcDots(220,178,R+3.5,-60,60,7),1.6)});
  s+=g+`</g>`;
  s+=`<g data-k="ser">${ln("M352 230 C364 212 380 236 372 252 C364 268 384 280 396 266 M372 252 C360 268 346 262 340 280 M352 230 C346 214 360 200 372 206","--c-er",6)}${ln("M352 230 C364 212 380 236 372 252 C364 268 384 280 396 266 M372 252 C360 268 346 262 340 280 M352 230 C346 214 360 200 372 206","--c-cyto",2)}</g>`;
  s+=`<g data-k="rib"><rect x="340" y="80" width="56" height="64" fill="transparent"/>${dots([[350,96],[366,110],[382,92],[358,128],[378,130],[392,112],[150,282],[170,296],[300,304]],2.1)}</g>`;
  s+=`<g data-k="np"><circle cx="200" cy="178" r="82" ${st("--c-nuc-soft")}/></g>`;
  s+=`<g data-k="krom">${ln(squiggle(212,182,58,26,2.1),"--c-dna",2)}</g>`;
  s+=`<g data-k="nukleol"><ellipse cx="176" cy="150" rx="17" ry="14" ${st("--c-nuc")}/></g>`;
  /* dubbelt kärnmembran med porer */
  g=`<g data-k="kmem"><circle cx="200" cy="178" r="84" fill="none" style="stroke:var(--c-nuc)" stroke-width="2.6"/><circle cx="200" cy="178" r="78" fill="none" style="stroke:var(--c-nuc)" stroke-width="1.6"/></g>`;
  s+=g;
  g=`<g data-k="por">`;
  [-120,-40,30,100,160,210].forEach(a=>{const p=arcPt(200,178,81,a);g+=`<rect x="${r1(p[0]-5)}" y="${r1(p[1]-5)}" width="10" height="10" rx="2" transform="rotate(${a} ${p[0]} ${p[1]})" ${st("--c-cyto","--c-mem",1.4)}/>`});
  s+=g+`</g>`;
  return s}

/* ---------- figur: ribosomen och proteinsyntesen (s. 23) ---------- */
function figRibosom(){
  let s=`<g data-k="mrna">${ln("M30 186 H450","--c-dna",3)}`;
  for(let x=40;x<450;x+=12)s+=ln(`M${x} 186 v7`,"--c-dna",2);
  s+=`</g>`;
  s+=`<g data-k="liten"><ellipse cx="250" cy="192" rx="62" ry="19" ${st("--c-er")}/></g>`;
  s+=`<g data-k="stor"><path d="M186 176 C186 116 222 86 250 86 C278 86 314 116 314 176 Z" ${st("--c-nuc")}/></g>`;
  /* tRNA på väg in med aminosyra */
  s+=`<g data-k="trna"><path d="M352 92 L368 62 L384 92 Z" ${st("--c-mem","--c-wall",1.5)}/>${ln("M368 92 V112","--c-wall",3)}<circle cx="368" cy="50" r="8" ${st("--c-mito","--ink",1)}/></g>`;
  s+=arr(350,104,318,140,"--muted",2,8);
  /* tRNA i ribosomen och kedjan */
  s+=`<path d="M246 160 L258 136 L270 160 Z" ${st("--c-mem","--c-wall",1.5)}/>`;
  s+=`<g data-k="kedja">${ln("M258 132 L240 106 L222 84 L204 64 L184 48 L162 40","--ink",1.3)}${[[258,128],[240,106],[222,84],[204,64],[184,48],[162,40],[140,38]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="7" ${st("--c-mito","--ink",1)}/>`).join("")}</g>`;
  s+=`<circle cx="310" cy="214" r="11" ${st("--paper","--ink",1.4)}/><text x="310" y="219" text-anchor="middle" ${TX}>1</text><circle cx="306" cy="110" r="11" ${st("--paper","--ink",1.4)}/><text x="306" y="115" text-anchor="middle" ${TX}>2</text>`;
  return s}

/* ---------- figur: ER (s. 24) ---------- */
function figER(){
  let s=`<rect x="0" y="0" width="480" height="300" rx="16" ${st("--c-cyto")}/>`;
  s+=`<g data-k="karna"><circle cx="20" cy="160" r="96" ${st("--c-nuc-soft")}/>${ln(squiggle(10,170,60,16,0.7),"--c-dna",1.6)}</g>`;
  s+=`<g data-k="kmem"><circle cx="20" cy="160" r="96" fill="none" style="stroke:var(--c-nuc)" stroke-width="2.6"/><circle cx="20" cy="160" r="90" fill="none" style="stroke:var(--c-nuc)" stroke-width="1.6"/></g>`;
  let g=`<g data-k="rer">`;
  [[124,-40,40],[140,-44,44],[156,-46,46]].forEach(([R,a0,a1])=>{const A=arcPt(20,160,R+9,a1),B=arcPt(20,160,R+9,a0);g+=`<path d="${arcPath(20,160,R,a0,a1)} L${A[0]} ${A[1]} A${R+9} ${R+9} 0 0 0 ${B[0]} ${B[1]} Z" ${st("--paper","--c-er",2.4)}/>`;
    g+=dots(arcDots(20,160,R-3,a0+2,a1-2,6),1.7)+dots(arcDots(20,160,R+12,a0+2,a1-2,6),1.7)});
  g+=ln(`M${arcPt(20,160,124,-40).join(" ")} L${arcPt(20,160,96,-36).join(" ")}`,"--c-er",2.4);
  s+=g+`</g>`;
  const serD="M246 200 C266 180 282 208 304 192 C324 178 336 200 354 188 M304 192 C310 214 290 230 308 248 C324 264 350 246 366 264 M354 188 C370 176 386 192 402 180";
  s+=`<g data-k="ser">${ln(serD,"--c-er",9)}${ln(serD,"--paper",4)}</g>`;
  s+=`<g data-k="ves"><circle cx="206" cy="126" r="10" ${st("--paper","--c-er",2.4)}/><circle cx="206" cy="126" r="3.5" ${st("--c-mito")}/></g>`;
  return s}

/* ---------- figur: golgiapparatens funktion (s. 25) ---------- */
function figGolgi(){
  let s="";
  /* RER som kam */
  let g=`<g data-k="rer"><path d="M18 70 H40 V96 H86 V112 H40 V142 H86 V158 H40 V188 H86 V204 H40 V230 H18 Z" ${st("--c-wall-soft","--c-golgi",2)}/>`;
  g+=dots([[46,92],[58,92],[70,92],[82,92],[46,116],[58,116],[70,116],[82,116],[46,138],[58,138],[70,138],[82,138],[46,162],[58,162],[70,162],[82,162],[46,184],[58,184],[70,184],[82,184],[46,208],[58,208],[70,208],[82,208],[14,90],[14,120],[14,150],[14,180],[14,210]],1.8);
  s+=g+`</g>`;
  g=`<g data-k="ves">`;
  [104,150,196].forEach(y=>{g+=arr(92,y,112,y,"--muted",1.8,6)+`<circle cx="124" cy="${y}" r="7" ${st("--c-wall-soft","--c-golgi",2)}/>`+arr(134,y,158,y,"--muted",1.8,6)});
  s+=g+`</g>`;
  g=`<g data-k="golgi"><rect x="164" y="72" width="62" height="160" fill="transparent"/>`;
  [0,18,36].forEach(dx=>{g+=ln(`M${178+dx} 80 Q${160+dx} 150 ${178+dx} 220`,"--c-golgi",7)});
  g+=`<circle cx="200" cy="238" r="5" ${st("--c-wall-soft","--c-golgi",1.6)}/>${ln("M186 228 Q196 248 212 232","--muted",1.4)}`;
  s+=g+`</g>`;
  s+=arr(234,120,256,92,"--muted",1.8,6)+arr(234,150,256,150,"--muted",1.8,6)+arr(234,180,256,206,"--muted",1.8,6);
  s+=`<g data-k="lyso"><circle cx="266" cy="86" r="9" ${st("--c-mito","--ink",1)}/></g>`;
  s+=`<g data-k="sekr"><circle cx="266" cy="150" r="9" ${st("--c-nuc","--ink",1)}/>${arr(278,160,420,160,"--muted",1.8,7)}</g>`;
  s+=`<g data-k="bygg"><circle cx="266" cy="214" r="9" ${st("--c-mem","--ink",1)}/>${arr(278,222,420,222,"--muted",1.8,7)}</g>`;
  /* cellmembran med exocytos och inbyggd blåsa */
  g=`<g data-k="mem">${ln("M440 40 C446 90 436 120 438 150 M438 172 C440 190 444 204 442 212 M442 232 C440 250 446 270 440 288","--ink",3)}`;
  g+=`<path d="M438 150 C424 152 424 170 438 172" fill="none" style="stroke:var(--ink)" stroke-width="3"/>${dots([[452,156],[462,164],[454,170],[466,152]],2.6,"--c-nuc")}`;
  g+=`<path d="M442 212 C430 214 430 230 442 232" fill="none" style="stroke:var(--c-mem)" stroke-width="5"/>`;
  s+=g+`</g>`;
  return s}

/* ---------- figur: lysosomens jobb (s. 26) ---------- */
function figLyso(){
  let s=`<rect x="0" y="0" width="480" height="290" rx="16" ${st("--c-cyto")}/>`;
  s+=`<g data-k="lyso"><circle cx="230" cy="150" r="50" ${st("--good-soft","--c-lyso",3)}/>${[[214,136],[244,132],[226,166],[252,160]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="7" ${st("--c-mito","--ink",1)}/>`).join("")}<text x="232" y="196" text-anchor="middle" ${TX}>lågt pH</text></g>`;
  s+=`<g data-k="gmito">${mito(96,70,34,16,-10)}${ln("M92 54 L104 66 M86 72 L100 84","--bad",2.2)}</g>`+arr(130,86,180,118,"--muted",2,8);
  s+=`<g data-k="bakt"><circle cx="92" cy="226" r="26" ${st("--paper","--c-mem",2.4)}/><ellipse cx="92" cy="226" rx="15" ry="8" ${st("--c-bact-soft","--c-bact",2)}/></g>`+arr(122,214,180,180,"--muted",2,8);
  s+=`<g data-k="bygg">${[[312,104],[326,96],[340,108],[330,118],[318,90]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="4.5" ${st("--c-mem","--ink",0.8)}/>`).join("")}</g>`+arr(276,128,304,110,"--muted",2,8);
  s+=`<g data-k="ut">${arr(280,176,428,206,"--muted",2,8)}<circle cx="410" cy="202" r="8" ${st("--c-wall-soft","--c-wall",1.6)}/>${ln("M444 30 C452 100 438 180 446 270","--c-mem",4)}${dots([[460,212],[468,198],[462,226]],2.4,"--c-wall")}</g>`;
  return s}

/* ---------- figur: peroxisomen (s. 26) ---------- */
function figPerox(){
  let s=`<rect x="0" y="0" width="480" height="250" rx="16" ${st("--c-cyto")}/>`;
  s+=`<g data-k="perox"><circle cx="170" cy="130" r="58" ${st("--c-arch-soft","--c-arch",3)}/></g>`;
  s+=`<g data-k="fett">${ln("M40 120 L56 112 L72 120 L88 112 L104 120 L120 112 L136 120","--c-wall",3)}<circle cx="34" cy="122" r="6" ${st("--c-mem","--c-wall",1.2)}/></g>`;
  s+=`<g data-k="h2o2"><text x="186" y="112" text-anchor="middle" ${TX}>H₂O₂</text></g>`;
  s+=`<g data-k="katalas"><path d="M160 150 C150 140 162 128 172 136 C182 128 196 140 186 152 C196 164 180 176 170 166 C160 176 146 164 160 150 Z" ${st("--c-lyso","--ink",1)}/></g>`;
  s+=arr(180,142,182,122,"--muted",1.6,6);
  s+=`<g data-k="knopp"><path d="M332 130 C332 92 380 92 384 120 C388 92 436 92 436 130 C436 168 388 168 384 140 C380 168 332 168 332 130 Z" ${st("--c-arch-soft","--c-arch",3)}/></g>`;
  s+=arr(236,130,316,130,"--muted",2,9);
  return s}

/* ---------- figur: mitokondrien (s. 27) ---------- */
function figMito(){
  let s=`<g data-k="yttre"><ellipse cx="236" cy="140" rx="176" ry="84" ${st("--paper","--c-mito",4)}/></g>`;
  /* inre membran med veck */
  let d="";const top=[],bot=[];
  for(let i=0;i<8;i++){top.push(110+i*34);bot.push(127+i*34)}
  let g=`<g data-k="inre"><ellipse cx="236" cy="140" rx="164" ry="72" ${st("--c-mito-soft","--c-mito",2.6)}/>`;
  top.forEach(x=>{const yb=140-72*Math.sqrt(Math.max(0,1-((x-236)/164)**2));g+=`<path d="M${r1(x-6)} ${r1(yb+1)} L${r1(x-4)} ${r1(yb+52)} Q${x} ${r1(yb+60)} ${r1(x+4)} ${r1(yb+52)} L${r1(x+6)} ${r1(yb+1)}" ${st("--paper","--c-mito",2.4)}/>`});
  bot.forEach(x=>{if(x>392)return;const yb=140+72*Math.sqrt(Math.max(0,1-((x-236)/164)**2));g+=`<path d="M${r1(x-6)} ${r1(yb-1)} L${r1(x-4)} ${r1(yb-50)} Q${x} ${r1(yb-58)} ${r1(x+4)} ${r1(yb-50)} L${r1(x+6)} ${r1(yb-1)}" ${st("--paper","--c-mito",2.4)}/>`});
  s+=g+`</g>`;
  s+=`<g data-k="dna">${ln("M118 132 C108 118 128 106 138 116 C148 104 166 118 154 130 C166 142 150 158 138 148 C128 160 108 148 118 132 Z","--c-dna",2.4)}</g>`;
  s+=`<g data-k="rib">${dots([[188,138],[204,150],[262,136],[290,150],[330,140],[348,132]],3)}</g>`;
  return s}

/* ---------- figur: endosymbios (s. 27) ---------- */
function figEndo(){
  let s=`<rect x="6" y="40" width="216" height="200" rx="16" ${st("--c-euk-soft")}/><rect x="262" y="40" width="212" height="200" rx="16" ${st("--sunk")}/>`;
  /* värdcellens membran som omsluter bakterien */
  s+=`<g data-k="vmem">${ln("M28 50 C40 120 60 200 112 218 C164 236 196 160 200 60","--c-mem",5)}</g>`;
  s+=`<g data-k="bakt"><ellipse cx="114" cy="146" rx="46" ry="28" ${st("--c-bact-soft","--c-bact",3)}/>${ln("M96 146 C96 134 114 132 116 142 C118 132 136 136 132 148 C130 160 112 158 108 152 C102 160 94 156 96 146 Z","--c-dna",2)}${dots([[140,136],[146,152],[86,138],[84,156]],2.4)}</g>`;
  s+=arr(226,140,258,140,"--muted",2.5,10);
  /* mitokondrie med två membran */
  s+=`<g data-k="mm"><ellipse cx="368" cy="140" rx="94" ry="62" ${st("--paper","--c-mem",5)}/><ellipse cx="368" cy="140" rx="82" ry="50" ${st("--c-bact-soft","--c-bact",3)}/>`;
  for(let i=0;i<4;i++){const x=322+i*28;s+=`<path d="M${x} 92 v34" fill="none" style="stroke:var(--c-bact)" stroke-width="3"/>`}
  s+=`</g><g data-k="mdna">${ln("M356 160 C356 148 374 146 376 156 C378 146 396 150 392 162 C390 174 372 172 368 166 C362 174 354 170 356 160 Z","--c-dna",2)}</g>`;
  s+=`<g data-k="mrib">${dots([[324,160],[336,174],[408,150],[414,166],[402,178]],2.6)}</g>`;
  return s}

/* ---------- figur: cellskelettet (s. 27) ---------- */
function rayEnd(x0,y0,a,f){const t=a*Math.PI/180,c=Math.cos(t),sn=Math.sin(t);let lo=0,hi=400;for(let i=0;i<30;i++){const m=(lo+hi)/2,x=x0+m*c,y=y0+m*sn;((x-310)/158)**2+((y-146)/118)**2<f*f?lo=m:hi=m}return [r1(x0+lo*c),r1(y0+lo*sn)]}
function figSkelett(){
  let s=`<g data-k="mem"><ellipse cx="310" cy="146" rx="158" ry="118" ${st("--c-cyto","--c-mem",4)}/></g>`;
  let g=`<g data-k="if">`;
  [160,205,250,300,345,30,75,120].forEach(a=>{const p0=arcPt(330,150,36,a),p1=arcPt(330,150,72,a+14),p2=rayEnd(330,150,a,0.9);g+=ln(`M${p0[0]} ${p0[1]} Q${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`,"--muted",2,' stroke-dasharray="5 3"')});
  s+=g+`</g>`;
  g=`<g data-k="mt">`;
  [150,200,230,270,310,340,20,60,100].forEach(a=>{const p=arcPt(280,120,8,a),e=rayEnd(280,120,a,0.86);g+=ln(`M${p[0]} ${p[1]} L${e[0]} ${e[1]}`,"--c-chl",2.6)});
  g+=`<circle cx="280" cy="120" r="6" ${st("--c-chl")}/>`;
  s+=g+`</g>`;
  g=`<g data-k="mf">`;
  g+=ln("M178 120 C192 64 260 40 320 38 C380 38 428 64 446 108","--c-mito",3)+ln("M186 128 C200 74 262 50 320 48 C376 48 420 74 436 112","--c-mito",2);
  g+=ln("M196 216 L424 196 M204 228 L414 210","--c-mito",2.6);
  s+=g+`</g>`;
  s+=`<g data-k="karna"><circle cx="330" cy="150" r="34" ${st("--c-nuc-soft","--c-nuc",2.4)}/></g>`;
  const e=rayEnd(280,120,150,0.86),m=[r1(280+(e[0]-280)*0.62),r1(120+(e[1]-120)*0.62)];
  s+=`<g data-k="motor"><circle cx="${m[0]}" cy="${r1(m[1]-12)}" r="9" ${st("--c-golgi","--ink",1.2)}/>${ln(`M${r1(m[0]-4)} ${r1(m[1]-4)} l-3 5 M${r1(m[0]+4)} ${r1(m[1]-4)} l3 5`,"--ink",2)}</g>`;
  return s}

G.def({
  id:"k4",
  src:{bok:"s. 21–27", ppt:"Bi2 bild 17, 21–22 (djurcellen), 25 (cellvägg, vakuol), 29–30 (ATP)", ab:"Korsord kap 1 \"Cellkrysset\" (13 av 16 ord)"},
  threads:["membran","ribosom","endo","atp","vagg"],
  goals:[
    "känna igen och namnge alla delar i bokens djurcell, och säga vad varje organell gör i fabriken",
    "beskriva cellkärnan: kärnmembran, kärnporer, nukleoplasma, kromatin och nukleoler",
    "förklara hur ribosomen bygger proteiner och skillnaden mellan fria och ER-bundna ribosomer",
    "jämföra slätt och kornigt ER, och lysosomer med peroxisomer",
    "beskriva golgiapparaten och de tre sorters blåsor som knoppas av där",
    "förklara mitokondriens byggnad, varför den kallas kraftverket och fyra bevis för endosymbiosteorin",
    "nämna cellskelettets tre trådtyper och deras funktioner",
    "beskriva hela resan för ett protein som ska utsöndras ur cellen"
  ],
  intro:`<p>I {{go:k3|K3}} byggde du fabrikens gräns. Nu går vi in i fabriken, avdelning för avdelning. Varje organell har ett eget jobb, och tillsammans tillverkar de, packar och skickar ut cellens produkter. Sist följer du ett protein hela vägen från ritningen i kärnan till lastkajen vid cellmembranet. Lärarens korsord {{go:korsord|Cellkrysset}} bygger nästan helt på det här kapitlet.</p>`,
  secs:[
  /* ===================== DJURCELLEN ===================== */
  {id:"djurcellen", h:"Djurcellen, en översikt", nav:"Djurcellen", src:"s. 21–22 · PPT Bi2 bild 17, 21, 22, 25 · korsord 5 vågrätt", prov:true, html:`
    <p>Flercelliga organismer består av många olika celltyper som är <b>specialiserade</b> på olika arbetsuppgifter. Därför ser cellerna också olika ut. När läroböcker visar en djurcell är det alltså en <b>"genomsnittlig" djurcell</b> utan speciella särdrag. Hur celler blir specialister går {{go:k2.organisation|K2}} igenom. {{src:s. 21}}</p>
    <p>Djurceller har <b>ingen cellvägg</b>, till skillnad från växtceller. Därför är cellmembranet, tillsammans med vissa ämnen som cellen utsöndrar, det enda skyddet mot omgivningen. {{prov}} {{src:s. 21 · PPT Bi2 bild 25}}</p>
    <h3>Cytoplasman</h3>
    <p>Innanför cellmembranet finns en <b>tjock vätska</b> som heter <b>cytoplasma</b>. Den består av många ämnen lösta i vatten. Här sker många av cellens kemiska reaktioner. Cytoplasman omger cellens <b>organeller</b> och så kallade <b>inklusionskroppar</b>. {{src:s. 21}}</p>
    <p>Läraren kallar samma vätska <b>cellplasma</b>: "Innehåller specialiserade celldelar samt mycket vatten." Korsordet frågar efter "vätska som finns innanför cellmembranet". {{prov}} {{src:PPT Bi2 bild 22 · korsord 5 vågrätt}}</p>
    <div class="box key" data-h="Inklusionskroppar"><p>Inklusionskroppar finns <b>inte i alla celler</b>. De består av kemiska ämnen som hör ihop med just den celltypen. {{src:s. 21–22}}</p><ul>
      <li>Oftast <b>lagrad energi</b>: <b>glykogen</b> i leverceller och <b>fett</b> i fettceller.</li>
      <li>Eller <b>cellprodukter</b>: <b>melanin</b> (pigment) i hudceller och <b>slem</b> i slemproducerande celler.</li></ul></div>
    <h3>Organellerna</h3>
    <p>Vilka är då de typiska organellerna i en djurcell, och vilken funktion har de? Tryck på delarna i bokens djurcell. Bilden har alla bokens 13 etiketter. {{src:s. 21–22}}</p>
    <div class="lfig-h" data-fig="djurcell"></div>
    <div class="box trap" data-h="Vakuol, centrioler, peroxisom och cellskelett"><p>Bokens djurcell har två delar som texten på s. 17–27 inte förklarar, en liten <b>vakuol</b> och <b>centrioler</b>. Du behöver kunna peka ut dem i bilden. Den stora vätskefyllda vakuolen ("cellsaftrum") är typisk för växtcellen, se {{go:k13.vakuolen|K13}} {{lek:Bi2 bild 25}}. Omvänt beskriver texten <b>peroxisomer</b> och <b>cellskelettet</b>, men de har ingen etikett i bilden. Här är de inritade utan etikett.</p></div>
    <p>Läraren har en enklare bild med nio etiketter: cellmembran, arvsmassa DNA, cellkärna, lysosom, golgiapparaten, cytoplasma, mitokondrie, endoplasmatiska nätverket och ribosomer (både på ER och fria). Allt detta finns också i boken och är därför provviktigt. {{prov}} {{src:PPT Bi2 bild 21}} Läraren visar också en stor 3D-bild av en uppskuren djurcell utan etiketter. Öva på att peka ut kärnan, ER, golgi och mitokondrierna i den. {{lek:Bi2 bild 17}}</p>
    <table class="cmp"><tr><th>Lärarens lista (bild 22)</th><th>Bokens fördjupning</th></tr>
      <tr><td><b>Cellmembran</b> = yttre skydd som släpper in och ut vissa ämnen</td><td>Fyra funktioner, se {{go:k3.funktion|K3}}</td></tr>
      <tr><td><b>Cellkärna</b> = innehåller gener (arvsanlagen) som består av DNA</td><td>Det allra mesta av arvsmassan, dubbelt kärnmembran</td></tr>
      <tr><td><b>Cellplasma</b> = specialiserade celldelar och mycket vatten</td><td>Cytoplasma, tjock vätska där många reaktioner sker</td></tr>
      <tr><td><b>Mitokondrie</b> = cellens kraftverk, energirik näring förbränns (cellandningen)</td><td>De flesta ATP bildas här</td></tr>
      <tr><td><b>Ribosomer</b> = här tillverkar cellen proteiner</td><td>Två subenheter av rRNA och protein</td></tr>
      <tr><td><b>ER</b> = ett membransystem som transporterar kemiska föreningar</td><td>SER och RER med olika jobb</td></tr></table>
    <h3>Hela fabriken på en gång</h3>
    <table class="cmp"><tr><th>Organell</th><th>I fabriken</th><th>Jobb enligt boken</th></tr>
      <tr><td>Cellmembran</td><td>Tullgränsen med portar</td><td>Avgränsar och kontrollerar vad som går in och ut</td></tr>
      <tr><td>Cytoplasma</td><td>Fabriksgolvet</td><td>Vätska där många reaktioner sker</td></tr>
      <tr><td>Kärnan</td><td>Ledningskontoret med ritningarna</td><td>Det mesta av arvsmassan (DNA)</td></tr>
      <tr><td>Nukleol</td><td>Verkstaden för arbetsbänkarnas delar</td><td>Ribosomalt RNA bildas här</td></tr>
      <tr><td>Ribosom</td><td>Arbetsbänken</td><td>Proteinsyntes</td></tr>
      <tr><td>Kornigt ER</td><td>Löpande bandet</td><td>Proteiner för export, membran och lysosomer</td></tr>
      <tr><td>Slätt ER</td><td>Fettverkstaden och reningsverket</td><td>Lipider, steroidhormoner, avgiftning</td></tr>
      <tr><td>Golgiapparaten</td><td>Packcentralen och posten</td><td>Ändrar proteinerna och skickar iväg dem</td></tr>
      <tr><td>Membranblåsor</td><td>Lastbilarna</td><td>Transporterar mellan organellerna</td></tr>
      <tr><td>Lysosom</td><td>Sopförbränningen och återvinningen</td><td>Bryter ner makromolekyler och gamla organeller</td></tr>
      <tr><td>Peroxisom</td><td>Rummet för farlig kemi</td><td>Bryter ner fettsyror, katalas tar hand om väteperoxid</td></tr>
      <tr><td>Mitokondrie</td><td>Kraftverket</td><td>Bildar det mesta av cellens ATP</td></tr>
      <tr><td>Cellskelett</td><td>Byggställningen och järnvägen</td><td>Stöd, form, rörelse och transport</td></tr></table>
    <div class="box fab"><p>Hela cellen är en <b>fabrik</b>. Ritningarna (DNA) ligger inlåsta på ledningskontoret. Kopior av ritningarna går ut till arbetsbänkarna, varorna åker på löpande band och i lastbilar till packcentralen och skickas sedan ut. Kraftverket betalar allt med ATP-mynt, och sopor bränns eller återvinns.</p></div>
    <div class="box tr" data-t="vagg" data-h="Bara membranet skyddar">Djurcellen saknar cellvägg. Den skyddas av cellmembranet och den extracellulära matrixen ({{go:k3.ecm|K3}}). Växtcellen har en cellvägg av cellulosa utanför membranet ({{go:k13.cellvaggen|K13}}).</div>
    <div class="x" data-x="matchFab"></div>
  `},
  /* ===================== KÄRNAN ===================== */
  {id:"karnan", h:"Cellkärnan, ledningskontoret", nav:"Kärnan", src:"s. 22–23 · PPT Bi2 bild 21–22 · korsord 4, 7, 9, 10 lodrätt", prov:true, html:`
    <p>I <b>cellkärnan</b> finns det <b>allra mesta</b> av cellens arvsmassa. Kärnan omges av ett <b>dubbelt membran</b> som heter <b>kärnmembran</b>. {{prov}} {{src:s. 22 · korsord 10 lodrätt}}</p>
    <div class="box diff"><p><b>Boken:</b> det allra mesta av arvsmassan finns i kärnan. <b>Läraren:</b> "Cellkärna = Innehåller gener (arvsanlagen) som består av DNA." Säg "det mesta", eftersom mitokondrien har eget DNA ({{go:k4.mitokondrien|se nedan}}). {{src:s. 22, 27 · PPT Bi2 bild 22}}</p></div>
    <h3>Kärnmembranet och nukleoplasman</h3>
    <ul>
      <li>Kärnmembranet omsluter en geléliknande vätska, <b>nukleoplasma</b>. Den innehåller ett nätverk av proteintrådar som ger stöd åt kärnan, och dessutom enzymer och nukleotider. {{prov}} {{src:s. 22 · korsord 7 lodrätt}}</li>
      <li>På flera ställen är kärnmembranet <b>ihopkopplat med ER</b>.</li>
      <li>Kärnmembranet har ganska stora <b>kärnporer</b> som underlättar transport genom membranet. Genom porerna kan till exempel en <b>mRNA-molekyl</b> ta sig ut till ribosomerna, där proteinsyntesen sker.</li></ul>
    <div class="lfig-h" data-fig="karna"></div>
    <h3>DNA och kromatin</h3>
    <p>I kärnan är DNA <b>lindat kring histonproteiner</b>. Det bildar trådar som är ungefär <b>30 nm</b> tjocka. Trådarna är med ojämna mellanrum upphängda i proteiner på kärnmembranets insida, och därför bildas <b>loopar</b> som hänger in i kärnan. {{src:s. 22}}</p>
    <p>Det man har sett är att proteiner som regleras gemensamt och används i samma situationer ofta ligger på samma loop. Boken skriver "proteiner", men menar generna för dem.</p>
    <p>Blandningen av DNA och proteiner i kärnan kallas <b>kromatin</b>. {{prov}} {{src:s. 22 · korsord 9 lodrätt}}</p>
    <table class="cmp"><tr><th></th><th>Tätpackat kromatin</th><th>Löspackat kromatin</th></tr>
      <tr><td>Struktur</td><td>Mycket tätt packat</td><td>Lösare</td></tr>
      <tr><td>Generna</td><td>Kan inte användas, eftersom enzymerna inte kommer åt</td><td>Används. Enzymer kommer fram och bildar budbärar-RNA</td></tr>
      <tr><td>När?</td><td>Gener som en specialiserad cell inte behöver stängs av så</td><td>Gener som cellen behöver</td></tr></table>
    <p>Det här spelar stor roll när celler <b>specialiserar sig</b>. De stänger av regioner av arvsmassan som de inte längre behöver, genom att göra kromatinet tätpackat. {{src:s. 22}}</p>
    <h3>Vid celldelning</h3>
    <p>Vid celldelningen upphör cellkärnan att existera. Kärnmembranet löses upp, och kromatinets loopar förs ihop till kroppar som är så stora att de syns i mikroskop. <b>Bara i detta stadium</b> kan man tydligt se de olika DNA-molekylerna, <b>kromosomerna</b>, i ett vanligt ljusmikroskop. {{src:s. 22}}</p>
    <div class="box trap" data-h="Tryckfel i boken"><p>Boken skriver på s. 22 "<b>Cellmembranet</b> löses upp" vid celldelningen. Det är ett tryckfel. Det är <b>kärnmembranet</b> som löses upp, eftersom det är kärnan som upphör att existera. Cellmembranet finns kvar runt cellen.</p></div>
    <h3>Nukleoler</h3>
    <p>I elektronmikroskop ser man ett eller flera <b>mörkfärgade partier</b> i kärnan. Ett sådant parti heter <b>nukleol</b>. Det bildas runt de regioner på DNA som kodar för <b>ribosomalt RNA (rRNA)</b>. Nukleolen består till stor del av rRNA som bildats från rRNA-generna och som väntar på att föras ut till cytoplasman genom en kärnpor. {{prov}} {{src:s. 23 · korsord 4 lodrätt}}</p>
    <ol class="chainv"><li>Cellen tillverkar stora mängder protein.</li><li>Den behöver många ribosomer.</li><li>Den behöver mycket rRNA till ribosomerna.</li><li>Nukleolerna syns extra tydligt.</li></ol>
    <div class="box trick" data-h="Minnesknep: nukleo-OL, -PLASMA, -TID"><p>Nukle<b>ol</b> är en kl<b>ump</b> (mörkt parti med rRNA). Nukleo<b>plasma</b> är <b>vätskan</b>, som cytoplasma fast i kärnan. Nukleo<b>tid</b> är en <b>byggsten</b> i DNA och RNA ({{go:k1.nukleotider|K1}}).</p></div>
    <div class="box fab"><p>Kärnan är <b>ledningskontoret</b> där ritningarna (DNA) förvaras. Ritningarna lämnar aldrig kontoret. Bara <b>kopior</b> (mRNA) går ut genom dörrarna, kärnporerna. Tätpackat kromatin är ritningar som låsts in i arkivet. Nukleolen är verkstaden som gör delar till arbetsbänkarna.</p></div>
    <div class="x" data-x="tfKarna"></div>
  `},
  /* ===================== RIBOSOMER ===================== */
  {id:"ribosomer", h:"Ribosomerna, arbetsbänkarna", nav:"Ribosomer", src:"s. 23–24 · PPT Bi2 bild 21–22 · korsord 1 vågrätt", prov:true, html:`
    <p>Ribosomerna är <b>platsen för proteinsyntesen</b>. {{prov}} Läraren: "Ribosomer = Här tillverkar cellen proteiner." {{src:s. 23 · PPT Bi2 bild 22 · korsord 1 vågrätt}}</p>
    <p>En ribosom består av två olika delar, <b>subenheter</b>. Båda består av <b>RNA-molekyler (rRNA) och proteiner</b>. De två delarna cirkulerar fritt i cytoplasman. {{src:s. 23}}</p>
    <ol class="chainv"><li>Subenheterna stöter på ett <b>budbärar-RNA (mRNA)</b> med instruktioner om vilka aminosyror som ska fogas ihop.</li><li>Först fastnar den <b>lilla</b> subenheten på mRNA.</li><li>Sedan fastnar den andra, stora subenheten.</li><li><b>tRNA</b> levererar aminosyror, och med ribosomens hjälp radas de upp i rätt ordning längs mRNA.</li><li>En aminosyrakedja, ett protein, växer fram.</li></ol>
    <div class="lfig-h" data-fig="ribosom"></div>
    <h3>Fria eller ER-bundna ribosomer</h3>
    <p>Var ribosomen arbetar beror på vart proteinet ska. Ska proteinet <b>exporteras</b> ut ur cellen, sitta i <b>cellmembranet</b> eller arbeta i <b>lysosomerna</b>, cellens "sopförbränningsanläggningar", fästs ribosomen på ett stort membrannätverk i cellen, <b>endoplasmatiskt retikulum (ER)</b>. Då kallas den <b>ER-bunden ribosom</b>, och proteinet förs in i ER för vidare transport. {{src:s. 23}}</p>
    <p>Ska proteinet finnas i <b>cytoplasman</b> eller i <b>andra organeller</b> stannar ribosomen kvar i cytoplasman. Då kallas den <b>fri ribosom</b>.</p>
    <table class="cmp"><tr><th></th><th>Fria ribosomer</th><th>ER-bundna ribosomer</th></tr>
      <tr><td>Var?</td><td>I cytoplasman</td><td>Fästa på ER (kornigt ER)</td></tr>
      <tr><td>Proteinet ska till</td><td>Cytoplasman eller andra organeller</td><td>Ut ur cellen, cellmembranet eller lysosomerna</td></tr>
      <tr><td>Sedan</td><td>Adresslapp styr in i rätt organell</td><td>Proteinet förs in i ER</td></tr></table>
    <div class="box key" data-h="Adresslappen"><p>Ska proteinet in i en annan organell fungerar en kort bit av aminosyrakedjan, <b>precis i kedjans början</b>, som en <b>adresslapp</b>. Den ser till att proteinet lyfts in i rätt organell. Därefter <b>klipps adresslappen bort</b>. {{src:s. 23–24}}</p></div>
    <div class="box fab"><p>Ribosomen är fabrikens <b>arbetsbänk</b>. mRNA är <b>arbetsordern</b>, en kopia av ritningen från kontoret. tRNA är <b>springpojkarna</b> som bär fram byggstenarna. Adresslappen är <b>fraktsedeln</b> som rivs av när varan har kommit fram.</p></div>
    <div class="box trap"><p>Provfälla: Det är den <b>lilla</b> subenheten som fäster först på mRNA. Och proteiner för export görs på <b>ER-bundna</b> ribosomer, inte på fria.</p></div>
    <div class="box tr" data-t="ribosom" data-h="Två sorters ribosomer">Mitokondrien har egna ribosomer av samma typ som bakterier ({{go:k4.mitokondrien|nedan}}). Bakteriernas ribosomer finns i {{go:k8.byggnad|K8}}, och flera antibiotika slår just mot dem ({{go:k11.ribosom|K11}}).</div>
    <div class="x" data-x="clozeRib"></div>
    <div class="x" data-x="sortRib"></div>
  `},
  /* ===================== ER ===================== */
  {id:"er", h:"Endoplasmatiska nätverket (ER)", nav:"ER", src:"s. 24 · PPT Bi2 bild 22 · korsord 2 lodrätt", prov:true, html:`
    <p>Många organeller i en eukaryot cell består av membran. Membranen är, precis som cellmembranet, uppbyggda av <b>fosfolipider</b>. {{src:s. 24}}</p>
    <div class="box tr" data-t="membran" data-h="Organellernas membran">ER, golgiapparaten, lysosomerna och blåsorna har samma sorts fosfolipidmembran som cellmembranet ({{go:k3.uppbyggnad|K3}}). Därför kan blåsor smälta ihop med organeller och med cellmembranet.</div>
    <p>En organell är det <b>endoplasmatiska nätverket</b>, som förkortas <b>ER</b> (endoplasmatiskt retikulum). ER är ett nätverk av membran som har kontakt med kärnmembranet. Tänk dig ER som ett <b>förgrenat kanalsystem med vätska inuti</b>. I kanalerna kan proteiner transporteras från en del av cellen till en annan. {{prov}} {{src:s. 24 · korsord 2 lodrätt}}</p>
    <p>Läraren: "Endoplasmatiska nätverket (ER) = Ett membransystem som transporterar kemiska föreningar." {{src:PPT Bi2 bild 22}}</p>
    <div class="box key"><p><b>Ungefär hälften</b> av en cells totala membran består av ER. {{src:s. 24}}</p></div>
    <p>ER finns i två former. ER utan ribosomer heter <b>slätt ER (SER</b>, smooth endoplasmic reticulum). ER med ribosomer heter <b>kornigt ER (RER</b>, rough endoplasmic reticulum).</p>
    <div class="lfig-h" data-fig="er"></div>
    <h3>Slätt ER (SER)</h3>
    <p>I SER finns inga ribosomer, och därför sker ingen proteinsyntes här. I stället sker <b>lipidmetabolism</b>, alltså syntes och nedbrytning av <b>kolesterol och fett</b>. {{src:s. 24}}</p>
    <ul>
      <li>De <b>fosfolipider</b> som bygger upp cellmembranet och cellens andra membran bildas i SER. De fyller på membranen med "byggmaterial". Det behövs till exempel när cellen växer efter en celldelning.</li>
      <li><b>Steroidhormoner</b>, som testosteron och östrogener, är lipider. De tillverkas av kolesterol i SER. Därför är <b>testosteronproducerande celler i testikeln</b> till stor del fyllda med SER.</li>
      <li>SER tar hand om <b>giftiga ämnen</b> som avgiftas med enzymer. Därför har <b>leverceller</b>, som sköter avgiftningen, mycket SER. Personer som dricker stora mängder <b>alkohol</b> har extra mycket SER.</li>
      <li>I <b>nerv- och muskelceller</b> är SER med i <b>jontransport</b>.</li></ul>
    <h3>Kornigt ER (RER)</h3>
    <p>I RER tillverkas de proteiner som ska <b>exporteras</b> och de som ska till <b>cellmembranet</b> och <b>lysosomerna</b>. Inne i ER veckar proteinerna snabbt ihop sig till rätt <b>tredimensionell struktur</b>. Många får sedan <b>kolhydrater</b>, och därefter paketeras de i <b>membranblåsor</b> som transporteras till golgiapparaten. {{src:s. 24}}</p>
    <table class="cmp"><tr><th></th><th>Slätt ER (SER)</th><th>Kornigt ER (RER)</th></tr>
      <tr><td>Ribosomer</td><td>Nej</td><td>Ja</td></tr>
      <tr><td>Gör</td><td>Lipider: fosfolipider, kolesterol, fett, steroidhormoner. Avgiftning. Jontransport i nerv och muskel</td><td>Proteiner för export, cellmembran och lysosomer. Veckning, kolhydrater, blåsor till golgi</td></tr>
      <tr><td>Mycket i</td><td>Testikelceller, leverceller</td><td>Celler som utsöndrar mycket protein</td></tr></table>
    <div class="box trick" data-h="Minnesknep"><p><b>R</b>ER har <b>R</b>ibosomer och gör p<b>R</b>otein. <b>S</b>ER sköter <b>S</b>möret (fett, kolesterol, steroider) och <b>S</b>priten (avgiftning).</p></div>
    <div class="box fab"><p>RER är fabrikens <b>löpande band</b>, med arbetsbänkar (ribosomer) längs hela bandet. SER är <b>fettverkstaden och reningsverket</b>, där byggmaterial till väggarna tillverkas och gifter oskadliggörs.</p></div>
    <div class="box trap"><p>Provfälla: Fosfolipiderna till cellmembranet tillverkas i <b>SER</b>, men membranproteinerna tillverkas i <b>RER</b>. Bokens bildtext skriver "Endoplasmatisk nätverk", ett litet tryckfel.</p></div>
    <div class="x" data-x="sortSerRer"></div>
  `},
  /* ===================== GOLGI ===================== */
  {id:"golgi", h:"Golgiapparaten, packcentralen", nav:"Golgi", src:"s. 25 · PPT Bi2 bild 21 · korsord 13 vågrätt", prov:true, html:`
    <p>Även <b>golgiapparaten</b> består av membran, ofta <b>sex</b> böjda, platta membranblåsor som kallas <b>cisterner</b>. {{prov}} {{src:s. 25 · korsord 13 vågrätt}}</p>
    <ol class="chainv"><li>På <b>ena sidan</b> kommer membranblåsor med proteiner som bildats och paketerats i RER.</li><li>Blåsorna och golgiapparaten har båda membran av fosfolipider. Därför kan de <b>smälta ihop</b>, och proteinerna kommer in i golgiapparaten.</li><li>Proteinerna <b>modifieras</b>. Sockermolekyler, fettsyror, metylgrupper eller fosfatgrupper fästs på dem.</li><li>Proteinerna flyttas i små blåsor från cistern till cistern.</li><li>På <b>andra sidan</b> knoppas de av i nya blåsor.</li></ol>
    <div class="lfig-h" data-fig="golgi"></div>
    <table class="cmp"><tr><th>Blåsa</th><th>Finns i</th><th>Vad händer</th></tr>
      <tr><td><b>Blåsor med byggmaterial</b></td><td>Alla celler</td><td>Vandrar till cellmembranet med nytt byggmaterial och nya membranproteiner</td></tr>
      <tr><td><b>Lysosomer</b></td><td>Alla djurceller</td><td>Stannar i cellen och innehåller enzymer för nedbrytning</td></tr>
      <tr><td><b>Sekretoriska blåsor (vesiklar)</b></td><td>En del celler, som snabbt måste utsöndra mycket av ett visst protein</td><td>Proteinet ligger tätt packat. Blåsorna väntar nära cellmembranet på den signal som säger åt cellen att släppa ut innehållet</td></tr></table>
    <div class="box fab"><p>Golgiapparaten är fabrikens <b>packcentral och post</b>. Varor från löpande bandet kommer in på ena sidan, får etiketter och tillbehör (socker, fettsyror, metyl- och fosfatgrupper) och skickas ut på andra sidan i tre sorters lastbilar.</p></div>
    <div class="box trap"><p>Provfälla: Texten säger "ofta sex" cisterner, men bokens figur visar tre. Figuren skriver dessutom "Lysom", ett tryckfel för lysosom. Och peroxisomer bildas <b>inte</b> i golgiapparaten.</p></div>
    <div class="box link"><p>Hur sekretoriska blåsor släpper ut sitt innehåll (exocytos) kommer i {{go:k5.exocytos|K5}}.</p></div>
    <div class="x" data-x="mcGolgi"></div>
  `},
  /* ===================== LYSOSOMER ===================== */
  {id:"lysosomer", h:"Lysosomerna, sopförbränningen", nav:"Lysosomer", src:"s. 23, 25–26 · PPT Bi2 bild 21 · korsord 11 vågrätt", prov:true, html:`
    <p><b>Lysosomer</b> bildas i golgiapparaten. En lysosom är en <b>membranblåsa fylld med enzymer</b> som katalyserar nedbrytning av stora molekyler, <b>makromolekyler</b>. Boken kallar lysosomerna för cellens <b>sopförbränningsanläggningar</b>. {{prov}} {{src:s. 23, 26 · korsord 11 vågrätt}}</p>
    <p>Lysosomernas uppgift är också att <b>hålla rent och återvinna</b>.</p>
    <ol class="chainv"><li>En gammal organell som inte fungerar, till exempel en mitokondrie, ska bort.</li><li>Dess membran smälter ihop med lysosomens membran, och organellen tas in i lysosomen.</li><li>Enzymerna bryter ner organellen.</li><li><b>Användbara byggstenar</b> släpps ut i cytoplasman och återvinns.</li><li><b>Avfallsprodukterna</b> förs ut ur cellen (<b>exocytos</b>).</li></ol>
    <div class="lfig-h" data-fig="lyso"></div>
    <h3>Lågt pH är en säkerhetsspärr</h3>
    <p>Enzymerna i lysosomen fungerar bäst i det <b>låga pH-värde</b> som råder där. Det är en fördel om en lysosom skulle gå sönder. pH-värdet är högre i cytoplasman, och därför fungerar enzymerna sämre där och kan inte bryta ner cellen och dess innehåll. {{src:s. 26}}</p>
    <p>När en cell har <b>skadats eller dött</b> börjar enzymer från ett stort antal lysosomer läcka ut. Då bryts cellen ner trots att pH-värdet inte är optimalt för enzymerna. <b>Hur det kan ske har man ännu inte lyckats ta reda på.</b> {{src:s. 26}}</p>
    <h3>Nedbrytning av muskler</h3>
    <p>Lysosomer är aktiva när <b>muskelvävnad som inte används längre</b> bryts ner. Boken ger tre exempel. {{src:s. 26}}</p>
    <ul><li>En <b>kroppsbyggare</b> som slutar styrketräna.</li><li>En <b>nyförlöst mamma</b> vars livmoder, som till stor del består av muskler, ska krympa till normal storlek.</li><li>Ett <b>grodyngel</b> som ska "tappa" sin svans.</li></ul>
    <h3>Försvar mot bakterier och virus</h3>
    <p>Vissa <b>vita blodkroppar</b> kan sluka bakterier. Delar av cellmembranet omsluter bakterien eller viruset och stänger in den i en membranblåsa, som förs in i blodkroppen. Där smälter blåsan ihop med lysosomer, och bakterien bryts ner på samma sätt som gamla organeller. {{src:s. 26}}</p>
    <div class="box fab"><p>Lysosomen är fabrikens <b>sopförbränning och återvinningscentral</b>. Den eldar i en egen ugn med lågt pH. Läcker en enstaka ugn slocknar elden i det högre pH-värdet ute på fabriksgolvet, och därför brinner inte fabriken ner.</p></div>
    <div class="box link"><p>När vita blodkroppar slukar bakterier kallas det fagocytos, en sorts endocytos. Det ordet använder boken i {{go:k5.endocytos|K5}}, inte här.</p></div>
    <div class="x" data-x="chainLyso"></div>
  `},
  /* ===================== PEROXISOMER ===================== */
  {id:"peroxisomer", h:"Peroxisomerna, rummet för farlig kemi", nav:"Peroxisomer", src:"s. 26 · korsord 6 lodrätt", prov:true, html:`
    <p><b>Peroxisomer</b> är <b>mindre än lysosomer</b> och finns i <b>alla eukaryota celler</b>. De är små membranbubblor med de enzymer som behövs för att <b>bryta ner och utvinna energi ur fettsyror</b>. {{prov}} {{src:s. 26 · korsord 6 lodrätt}}</p>
    <ol class="chainv"><li>Enzymerna bryter ner fettsyror och utvinner energi.</li><li>Vid reaktionen bildas <b>väteperoxid</b>, ett starkt oxiderande ämne.</li><li>Enzymet <b>katalas</b> gör väteperoxiden oskadlig.</li></ol>
    <p>Man <b>tror</b> att peroxisomerna finns för att stänga in den här processen tillsammans med katalas, så att väteperoxiden inte stör resten av cellen. Extra många peroxisomer finns i celler som ofta bryter ner fett, till exempel <b>fettceller</b>. {{src:s. 26}}</p>
    <p>Peroxisomer ser ut som små lysosomer, men de bildas <b>inte</b> i golgiapparaten. De bildas genom <b>avknoppning</b> från de peroxisomer som redan finns. {{src:s. 26}}</p>
    <div class="lfig-h" data-fig="perox"></div>
    <table class="cmp"><tr><th></th><th>Lysosom</th><th>Peroxisom</th></tr>
      <tr><td>Storlek</td><td>Större</td><td>Mindre</td></tr>
      <tr><td>Bildas</td><td>I golgiapparaten</td><td>Genom avknoppning från befintliga peroxisomer</td></tr>
      <tr><td>Bryter ner</td><td>Makromolekyler, gamla organeller, slukade bakterier</td><td>Fettsyror (och utvinner energi)</td></tr>
      <tr><td>Speciellt</td><td>Lågt pH som säkerhetsspärr</td><td>Katalas oskadliggör väteperoxid</td></tr>
      <tr><td>Många i</td><td>Vita blodkroppar som slukar bakterier</td><td>Fettceller</td></tr></table>
    <div class="box fab"><p>Peroxisomen är fabrikens <b>rum för farlig kemi</b>. Där hanteras fett med en farlig biprodukt, och katalas är <b>brandsläckaren</b> som står precis bredvid. Rummet byggs inte av packcentralen. Det delar sig själv.</p></div>
    <div class="box trap"><p>Provfälla: Peroxisomer bildas <b>inte</b> i golgiapparaten, fast de liknar små lysosomer.</p></div>
    <div class="x" data-x="sortLysPer"></div>
  `},
  /* ===================== MITOKONDRIEN ===================== */
  {id:"mitokondrien", h:"Mitokondrien, kraftverket", nav:"Mitokondrien", src:"s. 27 · PPT Bi2 bild 21–22, 29–30 · korsord 14 vågrätt", prov:true, html:`
    <p><b>Mitokondrien</b> ritas ofta som en <b>ubåt</b>, men mitokondrier kan vara allt från korta och tjocka till långa och smala. {{src:s. 27}}</p>
    <ul>
      <li>Den har <b>två membran</b>, ett yttre och ett inre.</li>
      <li>Det inre membranet är <b>starkt veckat</b>. Därför får det en stor yta för alla de membranförankrade enzymer som behövs i <b>elektrontransportkedjan</b>, som ger oss de livsnödvändiga, energibärande <b>ATP-molekylerna</b>.</li>
      <li>Vattenlösningen i mitokondriens inre heter <b>matrix</b>. Den innehåller enzymer som behövs för att utvinna energi ur födan vi äter.</li></ul>
    <div class="lfig-h" data-fig="mito"></div>
    <p>Under de energiutvinnande processerna avgår mycket energi som <b>spillvärme</b>, men en del fångas in och används för att bilda ATP. Därför kallas mitokondrien ofta <b>cellens kraftverk</b>. <b>De flesta ATP-molekyler bildas här</b>, och de driver alla energikrävande processer i cellen. {{prov}} {{src:s. 27 · korsord 14 vågrätt}}</p>
    <p>Läraren: "Mitokondrie = Cellens kraftverk. Energirik näring förbränns (<b>cellandningen</b>)." Ordet cellandning står inte på bokens s. 27. {{lek:Bi2 bild 22}}</p>
    <div class="box key"><p>Celler med <b>högt energibehov</b>, till exempel <b>muskelceller</b>, har extra många mitokondrier. {{src:s. 27}}</p></div>
    <div class="box tr" data-t="atp" data-h="Kraftverket gör mynten">Mitokondrien bildar det mesta av cellens ATP, fabrikens mynt. Vad ATP är och hur det används går {{go:k6.atp|K6}} igenom, och pumparna som kostar ATP finns i {{go:k5.pumpen|K5}}.</div>
    <h3>Endosymbiosteorin</h3>
    <p>Du kanske minns <b>endosymbiosteorin</b> från Biologi 1. Den säger att mitokondrien en gång var en <b>bakterie</b> som slukades av föregångaren till den eukaryota cellen, och som sedan började leva i <b>symbios</b> med den. {{src:s. 27}}</p>
    <div class="lfig-h" data-fig="endo"></div>
    <div class="box key" data-h="Fyra bevis i boken"><ol>
      <li><b>Två membran.</b> Det inre membranet kommer från bakteriens cellmembran, och det yttre kommer från cellmembranet hos cellen som slukade bakterien.</li>
      <li><b>Eget DNA.</b></li>
      <li>DNA-molekylen är <b>ringformad</b>, precis som hos bakterier.</li>
      <li><b>Ribosomer av samma typ</b> som hos bakterier.</li></ol></div>
    <div class="box trick" data-h="Minnesknep: 2 · D · R · R"><p><b>2</b> membran, eget <b>D</b>NA, <b>R</b>ingformat DNA, bakterie-<b>R</b>ibosomer.</p></div>
    <div class="box tr" data-t="endo" data-h="Slukade bakterier">Mitokondrien var en bakterie med ringformat DNA ({{go:k8.byggnad|K8}}). Växtcellens kloroplast har en liknande historia och har också eget DNA ({{go:k13.kloroplasten|K13}}).</div>
    <div class="box fab"><p>Mitokondrien är fabrikens <b>kraftverk</b>. Det var en gång ett eget litet företag (en bakterie) som köptes upp av fabriken. Därför har det kvar sin egen gamla ritning (ringformat DNA), sina egna arbetsbänkar och två staket runt sig.</p></div>
    <div class="box trap"><p>Provfälla: <b>Matrix</b> i mitokondrien är vätskan inuti den. <b>Extracellulär matrix</b> ({{go:k3.ecm|K3}}) är skiktet utanför cellen. Samma ord, helt olika saker.</p></div>
    <div class="x" data-x="chainMito"></div>
  `},
  /* ===================== CELLSKELETTET ===================== */
  {id:"cellskelettet", h:"Cellskelettet, byggställning och järnväg", nav:"Cellskelettet", src:"s. 27 · korsord 5 lodrätt, 12 vågrätt", prov:true, html:`
    <p>Organellerna <b>flyter inte fritt</b> i cytoplasman. I elektronmikroskop ser man att de är kopplade till ett nätverk av proteintrådar, <b>cellskelettet</b>. {{prov}} {{src:s. 27 · korsord 5 lodrätt}}</p>
    <p>Cellskelettet består av mycket tunna proteintrådar. Precis som vårt skelett och våra muskler ger de cellen både <b>stöd och form</b> och <b>rörelseförmåga</b>.</p>
    <div class="box key" data-h="Cellskelettets funktioner"><ul><li>cellrörelse</li><li>celldelning</li><li>transport i cellen</li><li>mekaniskt stöd för cellen</li><li>arrangemang av organellerna i cellen</li></ul></div>
    <div class="box key" data-h="Tre sorters trådar"><p><b>Mikrotubuli</b>, <b>intermediära filament</b> och <b>mikrofilament</b>. {{prov}} {{src:s. 27 · korsord 12 vågrätt}}</p></div>
    <p>Både <b>mikrotubuli och mikrofilament</b> kan kopplas till <b>motorproteiner</b> på organeller och blåsor. Därför kan organeller och blåsor transporteras längs trådarna. {{src:s. 27}}</p>
    <div class="lfig-h" data-fig="skelett"></div>
    <p>Bokens bild är ett foto taget med <b>fluorescensmikroskopi</b>. Där syns <b>aktinfilament</b> i rött och cellkärnorna i blått. Boken ger inga mått på trådarna. {{src:s. 27}}</p>
    <div class="box extra"><p>Bildtexten säger aktinfilament och brödtexten säger mikrofilament. Det är samma sorts tråd, eftersom mikrofilament är byggda av proteinet aktin. {{extra}}</p></div>
    <div class="box trick" data-h="Minnesknep: M · I · M"><p><b>M</b>ikrotubuli · <b>I</b>ntermediära filament · <b>M</b>ikrofilament. Bara de två <b>M</b>-trådarna har <b>M</b>otorproteiner som kör last.</p></div>
    <div class="box fab"><p>Cellskelettet är fabrikens <b>byggställning</b>, som håller väggar och maskiner på plats, och dess <b>järnväg</b>. Motorproteinerna är tågen som kör lastbilarna (blåsorna) längs rälsen.</p></div>
    <div class="box trap"><p>Provfälla: Det är mikrotubuli och mikrofilament som kopplas till motorproteiner. Boken säger inget sådant om intermediära filament.</p></div>
    <div class="box link"><p>Cellskelettets trådar förankras i membranet av membranproteiner ({{go:k3.proteiner|K3}}), och kollagen utanför cellen fäster via proteiner i trådarna inuti ({{go:k3.ecm|K3}}).</p></div>
    <div class="x" data-x="tfSkelett"></div>
  `},
  /* ===================== RESAN ===================== */
  {id:"resan", h:"Proteinets resa genom fabriken", nav:"Proteinets resa", src:"s. 22–26", prov:true, html:`
    <p>Den här kedjan knyter ihop nästan hela kapitlet. "Beskriv vägen för ett protein som ska utsöndras" är en typisk provfråga. Säg varje steg högt innan du trycker vidare.</p>
    <div class="box key" data-h="Vägen för ett protein som ska ut ur cellen"><ol>
      <li>Genen ligger i <b>löspackat kromatin</b>. Enzymer kommer åt och bildar <b>mRNA</b>.</li>
      <li>mRNA tar sig ut genom en <b>kärnpor</b>.</li>
      <li>Ribosomens <b>lilla subenhet</b> fäster först på mRNA, sedan den stora. tRNA levererar aminosyror.</li>
      <li>Proteinet ska exporteras, och därför fästs ribosomen på <b>ER</b> (kornigt ER).</li>
      <li>Proteinet förs in i ER, <b>veckas</b> till rätt 3D-form och får ofta <b>kolhydrater</b>.</li>
      <li>Det packas i en <b>membranblåsa</b> som åker till golgiapparaten.</li>
      <li>Blåsan <b>smälter ihop</b> med golgiapparaten, eftersom båda har fosfolipidmembran.</li>
      <li>Proteinet <b>modifieras</b> och flyttas cistern för cistern.</li>
      <li>En <b>sekretorisk blåsa</b> knoppas av och väntar vid cellmembranet.</li>
      <li>En <b>signal</b> kommer, och innehållet släpps ut ur cellen.</li></ol></div>
    <div class="w" data-w="k4Resa"></div>
    <div class="x" data-x="ordResa"></div>
    <div class="box fab"><p>Hela resan i fabriken: <b>ritningen</b> på kontoret kopieras till en <b>arbetsorder</b>, som går ut genom dörren till en <b>arbetsbänk</b> vid <b>löpande bandet</b>. Varan körs i <b>lastbil</b> till <b>packcentralen</b>, får sina tillbehör och lastas på en <b>lastbil</b> som väntar vid <b>lastkajen</b> tills ordern "leverera" kommer.</p></div>
    <div class="box link"><p>Själva utsläppet genom cellmembranet kallas exocytos och kommer i {{go:k5.exocytos|K5}}. Energin till allt arbete kommer från ATP ({{go:k6|K6}}).</p></div>
    <h3>Blanda allt</h3>
    <div class="x" data-x="matchCelltyp"></div>
    <div class="x" data-x="whoK4"></div>
    <div class="x" data-x="fixK4"></div>
  `}
  ],
  figs:{
    djurcell:{vb:"0 0 480 420", svg:figDjurcell(),
      labels:[["cytoplasma",106,58,190,74,"e"],["cellmembran",106,104,125,112,"e"],["ER",106,146,144,150,"e"],["ER med|ribosomer",106,188,176,179,"e"],["ribosomer",106,244,140,238,"e"],["golgiapparat",106,300,160,298,"e"],["centrioler",106,364,238,343,"e"],
        ["DNA",381,70,262,146,"s"],["kärnmembran",381,112,306,127,"s"],["kärna",381,156,296,160,"s"],["vakuol",381,232,356,232,"s"],["lysosom",381,286,354,288,"s"],["mitokondrie",381,336,318,318,"s"]],
      parts:{cyto:{t:"Cytoplasma",d:"Tjock vätska med lösta ämnen där många av cellens reaktioner sker. Läraren kallar den cellplasma. Den omger organellerna och inklusionskropparna.",go:"k4.djurcellen"},
        mem:{t:"Cellmembranet",d:"Tullgränsen. Djurcellens enda skydd mot omgivningen tillsammans med det som cellen utsöndrar.",go:"k3.funktion"},
        karna:{t:"Kärnan",d:"Ledningskontoret med det allra mesta av arvsmassan.",go:"k4.karnan"},
        dna:{t:"DNA",d:"Arvsmassan, lindad kring histoner till kromatin.",go:"k4.karnan"},
        nukleol:{t:"Nukleol",d:"Mörkt parti i kärnan där rRNA till ribosomerna bildas. Utan etikett i bokens bild.",go:"k4.karnan"},
        kmem:{t:"Kärnmembranet",d:"Dubbelt membran med kärnporer. Hänger ihop med ER.",go:"k4.karnan"},
        rer:{t:"ER med ribosomer (kornigt ER)",d:"Löpande bandet. Här tillverkas proteiner för export, cellmembranet och lysosomerna.",go:"k4.er"},
        ser:{t:"ER (slätt ER)",d:"Utan ribosomer. Lipider, steroidhormoner, avgiftning och jontransport.",go:"k4.er"},
        rib:{t:"Ribosomer",d:"Arbetsbänkarna där proteiner tillverkas. Fria i cytoplasman eller bundna till ER.",go:"k4.ribosomer"},
        golgi:{t:"Golgiapparaten",d:"Packcentralen. Ändrar proteinerna och skickar ut dem i blåsor.",go:"k4.golgi"},
        cent:{t:"Centrioler",d:"Finns i bokens bild men förklaras inte på s. 17–27. Känn igen dem i bilden."},
        mito:{t:"Mitokondrie",d:"Kraftverket. De flesta ATP-molekyler bildas här.",go:"k4.mitokondrien"},
        vak:{t:"Vakuol",d:"En liten vakuol finns i bokens djurcell. Den stora vakuolen (cellsaftrum) är typisk för växtcellen.",go:"k13.vakuolen"},
        lyso:{t:"Lysosom",d:"Sopförbränningen. Membranblåsa med nedbrytande enzymer, bildad i golgi.",go:"k4.lysosomer"},
        perox:{t:"Peroxisom",d:"Inte med i bokens bild. Bryter ner fettsyror, och katalas tar hand om väteperoxiden.",go:"k4.peroxisomer"},
        skel:{t:"Cellskelett",d:"Inte med i bokens bild. Nätverk av proteintrådar som organellerna sitter fast i.",go:"k4.cellskelettet"}},
      cap:"Djurcellen med bokens 13 etiketter. Peroxisom och cellskelett är inritade utan etikett. Efter bokens figur på s. 21. Tryck på en del.", src:"Bok s. 21 · PPT Bi2 bild 21"},
    karna:{vb:"0 0 480 330", svg:figKarna(),
      labels:[["nukleol",4,70,170,146,"s"],["kärnpor",4,124,130,138,"s"],["nukleoplasma",4,186,150,192,"s"],["kärnmembran",4,262,141,237,"s"],["cytoplasma",176,62,null,null,"m"],
        ["kromatin|(kromosomer)",476,52,236,168,"e"],["ribosomer",476,100,392,112,"e"],["ER med|ribosomer",476,150,328,151,"e"],["ER",476,236,372,252,"e"]],
      parts:{nukleol:{t:"Nukleol",d:"Mörkfärgat parti runt DNA som kodar för rRNA. Består mest av rRNA som väntar på att föras ut genom en kärnpor."},
        por:{t:"Kärnpor",d:"Ganska stora porer i kärnmembranet. Här tar sig mRNA ut till ribosomerna."},
        np:{t:"Nukleoplasma",d:"Geléliknande vätska med ett nätverk av proteintrådar som stöder kärnan, plus enzymer och nukleotider."},
        kmem:{t:"Kärnmembranet",d:"Dubbelt membran. På flera ställen ihopkopplat med ER."},
        krom:{t:"Kromatin",d:"DNA lindat kring histonproteiner. Vid celldelning packas det ihop till kromosomer som syns i ljusmikroskop."},
        rer:{t:"ER med ribosomer",d:"Kornigt ER, i kontakt med kärnmembranet.",go:"k4.er"},
        ser:{t:"ER",d:"Slätt ER utan ribosomer.",go:"k4.er"},
        rib:{t:"Ribosomer",d:"Fria ribosomer i cytoplasman.",go:"k4.ribosomer"}},
      cap:"Kärnmembranet omger nukleoplasman som innehåller kromatin och en eller flera nukleoler. Kärnporerna underlättar transport in och ut ur kärnan. Kärnmembranet har kontakt med ER. Efter bokens figur på s. 23, med kärnpor och nukleoplasma tillagda.", src:"Bok s. 22–23"},
    ribosom:{vb:"0 0 480 250", svg:figRibosom(),
      labels:[["växande|proteinkedja",4,40,133,38,"s"],["stor subenhet",4,120,200,130,"s"],["liten subenhet",4,222,200,198,"s"],["aminosyra",476,40,376,50,"e"],["tRNA",476,84,382,82,"e"],["mRNA (budbärar-RNA)",476,238,420,192,"e"]],
      parts:{liten:{t:"Lilla subenheten",d:"Av rRNA och proteiner. Fastnar FÖRST på mRNA (1)."},stor:{t:"Stora subenheten",d:"Av rRNA och proteiner. Fastnar sedan (2)."},
        mrna:{t:"mRNA",d:"Budbärar-RNA, kopian av genen. Talar om vilka aminosyror som ska fogas ihop och i vilken ordning."},
        trna:{t:"tRNA",d:"Levererar aminosyror till ribosomen."},kedja:{t:"Proteinkedjan",d:"Aminosyrorna radas upp i rätt ordning. Början av kedjan kan vara en adresslapp."}},
      cap:"Ribosomens två delar består av rRNA och proteiner. Här sker proteinsyntesen. Siffrorna visar ordningen: den lilla subenheten (1) fäster först på mRNA, sedan den stora (2). Efter bokens figur och text på s. 23.", src:"Bok s. 23"},
    er:{vb:"0 0 480 300", svg:figER(),
      labels:[["kärnmembran",4,30,74,80,"s"],["kornigt ER|(RER)",200,30,151,99,"m"],["membranblåsa|till golgi",250,80,212,122,"s"],["slätt ER|(SER)",476,150,400,182,"e"],
        ["kärna",40,288,40,240,"m"],["kanal med|vätska",110,280,145,232,"m"],["ribosomer",230,288,176,223,"m"]],
      parts:{karna:{t:"Kärnan",d:"ER har kontakt med kärnmembranet."},kmem:{t:"Kärnmembranet",d:"Dubbelt membran som hänger ihop med ER."},
        rer:{t:"Kornigt ER (RER)",d:"Platta säckar med ribosomer. Proteiner för export, cellmembran och lysosomer. De veckas och får kolhydrater här."},
        ser:{t:"Slätt ER (SER)",d:"Rör utan ribosomer. Lipidmetabolism, steroidhormoner, avgiftning och jontransport."},
        ves:{t:"Membranblåsa",d:"Proteiner från RER paketeras i membranblåsor som åker till golgiapparaten.",go:"k4.golgi"}},
      cap:"ER är ett förgrenat kanalsystem med vätska inuti som har kontakt med kärnmembranet. På RER finns ribosomer, och här tillverkas proteiner som paketeras i membranblåsor. Efter bokens figur på s. 24.", src:"Bok s. 24"},
    golgi:{vb:"0 0 480 300", svg:figGolgi(),
      labels:[["ER med ribosomer|(RER)",4,30,30,70,"s"],["golgiapparat|(cisterner)",206,30,190,108,"m"],["cellmembran",476,24,444,60,"e"],["lysosom",290,84,276,86,"s"],["sekretorisk|vesikel",290,128,276,148,"s"],
        ["ribosom",4,262,46,208,"s"],["membranblåsor|med proteiner",120,262,124,204,"m"],["vesikel med|byggmaterial till|cellmembranet",290,246,276,220,"s"]],
      parts:{rer:{t:"RER",d:"Här bildas och paketeras proteinerna.",go:"k4.er"},ves:{t:"Membranblåsor med proteiner",d:"Åker från RER till golgiapparaten och smälter ihop med den, eftersom båda har fosfolipidmembran."},
        golgi:{t:"Golgiapparaten",d:"Ofta sex cisterner (bilden visar tre). Proteinerna modifieras och flyttas cistern för cistern."},
        lyso:{t:"Lysosom",d:"Stannar i cellen med nedbrytande enzymer. Boken skriver \"Lysom\" i figuren, ett tryckfel.",go:"k4.lysosomer"},
        sekr:{t:"Sekretorisk vesikel",d:"Tätt packat protein. Väntar vid cellmembranet på en signal och släpper sedan ut innehållet.",go:"k5.exocytos"},
        bygg:{t:"Vesikel med byggmaterial",d:"Går till cellmembranet med nytt byggmaterial och membranproteiner. Finns i alla celler."},
        mem:{t:"Cellmembranet",d:"Blåsorna smälter ihop med det."}},
      cap:"Golgiapparatens funktion. Membranblåsor med proteiner kommer från RER. Proteinerna flyttas i små blåsor från cistern till cistern. I andra änden knoppas lysosomer, sekretoriska vesiklar och blåsor med byggmaterial till membranet av. Efter bokens figur på s. 25.", src:"Bok s. 25"},
    lyso:{vb:"0 0 480 290", svg:figLyso(),
      labels:[["gammal|mitokondrie",4,26,80,58,"s"],["lysosom",256,40,240,101,"m"],["nedbrytande|enzymer",330,40,250,130,"s"],["cellmembran",476,20,447,44,"e"],["byggstenar|återvinns",356,104,344,108,"s"],
        ["bakterie i membranblåsa",130,272,110,240,"s"],["avfall ut|(exocytos)",318,250,404,208,"s"]],
      parts:{lyso:{t:"Lysosomen",d:"Membranblåsa från golgi med enzymer som bryter ner makromolekyler. Lågt pH inuti."},
        gmito:{t:"Gammal mitokondrie",d:"Gamla organeller som inte fungerar smälter ihop med lysosomen och bryts ner."},
        bakt:{t:"Slukad bakterie",d:"En vit blodkropp har omslutit bakterien i en membranblåsa. Blåsan smälter ihop med lysosomer."},
        bygg:{t:"Byggstenar",d:"Användbara byggstenar släpps ut i cytoplasman och återvinns."},
        ut:{t:"Avfall",d:"Avfallsprodukterna förs ut ur cellen genom exocytos."}},
      cap:"Lysosomen håller rent och återvinner. Efter bokens text och lysosomfigur på s. 26 (en membranblåsa med enzymer).", src:"Bok s. 26"},
    perox:{vb:"0 0 480 250", svg:figPerox(),
      labels:[["peroxisom",170,30,170,72,"m"],["fettsyra",60,96,64,114,"m"],["väteperoxid",268,40,200,106,"s"],["katalas",60,206,150,160,"m"],["avknoppning:|ny peroxisom",384,206,384,160,"m"]],
      parts:{perox:{t:"Peroxisom",d:"Liten membranbubbla, mindre än en lysosom. Finns i alla eukaryota celler."},fett:{t:"Fettsyra",d:"Bryts ner i peroxisomen, och energi utvinns."},
        h2o2:{t:"Väteperoxid",d:"Starkt oxiderande ämne som bildas när fettsyror bryts ner."},katalas:{t:"Katalas",d:"Enzym som oskadliggör väteperoxiden."},
        knopp:{t:"Avknoppning",d:"Nya peroxisomer knoppas av från de som redan finns. De bildas inte i golgi."}},
      cap:"Peroxisomen bryter ner fettsyror. Väteperoxiden som bildas oskadliggörs av katalas. Boken har ingen figur. Ritad efter texten på s. 26.", src:"Bok s. 26"},
    mito:{vb:"0 0 480 280", svg:figMito(),
      labels:[["DNA (ringformat)",4,30,126,116,"s"],["ribosomer",220,30,188,138,"m"],["yttre membran",476,40,370,86,"e"],["matrix",476,146,383,150,"e"],["inre membran",476,252,360,187,"e"],["veck: stor yta för|elektrontransportkedjan",4,246,161,182,"s"]],
      parts:{yttre:{t:"Yttre membranet",d:"Kommer enligt endosymbiosteorin från cellmembranet hos cellen som slukade bakterien."},
        inre:{t:"Inre membranet",d:"Starkt veckat, vilket ger stor yta för enzymerna i elektrontransportkedjan som bildar ATP. Kommer från bakteriens cellmembran."},
        dna:{t:"Mitokondriens DNA",d:"Eget och ringformat, precis som hos bakterier."},rib:{t:"Ribosomer",d:"Av samma typ som hos bakterier."}},
      cap:"Mitokondrien har ett yttre och ett inre membran. Det inre är starkt veckat, vilket ger stort utrymme för enzymerna i elektrontransportkedjan. Efter bokens figur på s. 27, med matrix tillagt från texten.", src:"Bok s. 27"},
    endo:{vb:"0 0 480 300", svg:figEndo(),
      labels:[["bakteriens|cellmembran",114,30,114,118,"m"],["ribosomer av|bakterietyp",250,30,324,160,"m"],["yttre membran|(från värdcellen)",476,30,400,82,"e"],
        ["värdcellens|cellmembran",4,272,55,154,"s"],["eget ringformat|DNA",250,272,374,170,"m"],["inre membran|(från bakterien)",476,262,400,186,"e"]],
      parts:{vmem:{t:"Värdcellens cellmembran",d:"Omsluter bakterien. Blir mitokondriens yttre membran."},bakt:{t:"Bakterien",d:"Har eget cellmembran, ringformat DNA och bakterieribosomer."},
        mm:{t:"Mitokondrien i dag",d:"Två membran: det inre från bakterien, det yttre från värdcellen."},mdna:{t:"Eget ringformat DNA",d:"Bevis 2 och 3 för endosymbiosteorin."},mrib:{t:"Bakterielika ribosomer",d:"Bevis 4."}},
      cap:"Endosymbiosteorin. Till vänster slukar föregångaren till den eukaryota cellen en bakterie. Till höger mitokondrien i dag. Färgerna visar var membranen kommer ifrån. Ritad efter bokens text på s. 27.", src:"Bok s. 27"},
    skelett:{vb:"0 0 480 285", svg:figSkelett(),
      labels:[["cellmembran",360,18,360,30,"m"],["mikrotubuli",145,60,218,92,"e"],["motorprotein|med vesikel",145,104,212,140,"e"],["intermediära|filament",145,160,226,190,"e"],["mikrofilament|(aktinfilament)",145,226,210,215,"e"],["cellkärna",330,280,330,184,"m"]],
      parts:{mt:{t:"Mikrotubuli",d:"Kan kopplas till motorproteiner som transporterar organeller och blåsor."},if:{t:"Intermediära filament",d:"En av de tre trådtyperna. Boken nämner dem inte för transport."},
        mf:{t:"Mikrofilament",d:"Kan kopplas till motorproteiner. Bokens foto visar aktinfilament i rött."},motor:{t:"Motorprotein med blåsa",d:"Blåsan transporteras längs tråden, som ett tåg på räls."},
        karna:{t:"Cellkärnan",d:"I bokens fluorescensfoto är kärnorna blå."},mem:{t:"Cellmembranet",d:"Membranproteiner förankrar cellskelettet.",go:"k3.proteiner"}},
      cap:"Cellskelettets tre trådtyper i en schematisk cell. Boken visar ett fluorescensfoto (aktinfilament röda, kärnor blå) och anger inga mått. Ritad efter texten på s. 27.", src:"Bok s. 27"}
  },
  ex:{
    matchFab:{ty:"match", h:"Para ihop organellen med dess roll i fabriken", pairs:[
      ["Kärnan","Ledningskontoret med ritningarna"],["Ribosom","Arbetsbänken"],["Kornigt ER","Löpande bandet"],["Golgiapparaten","Packcentralen och posten"],
      ["Lysosom","Sopförbränningen och återvinningen"],["Peroxisom","Rummet för farlig kemi"],["Mitokondrie","Kraftverket"],["Cellskelett","Byggställning och järnväg"]]},
    tfKarna:{ty:"tf", h:"Kärnan: sant eller falskt?", items:[
      ["Allt DNA i cellen finns i kärnan.",false,"Det allra mesta finns i kärnan, men mitokondrien har eget DNA. {{src:s. 22, 27}}"],
      ["Kärnmembranet är ett dubbelt membran.",true,"Boken: kärnan omges av ett dubbelt membran som kallas kärnmembran."],
      ["mRNA tar sig ut ur kärnan genom kärnporer.",true,"Porerna är ganska stora och underlättar transport."],
      ["Tätpackat kromatin innebär att generna används mycket.",false,"Tätpackat kromatin gör att enzymerna inte kommer åt, så generna kan inte användas."],
      ["DNA är lindat kring histonproteiner till trådar som är ungefär 30 nm tjocka.",true,"Trådarna hänger i loopar från proteiner på kärnmembranets insida. {{src:s. 22}}"],
      ["Vid celldelningen löses cellmembranet upp.",false,"Boken skriver så, men det är ett tryckfel. Det är kärnmembranet som löses upp."],
      ["Kromosomerna syns tydligt i ljusmikroskop hela tiden.",false,"Bara vid celldelningen, när looparna packats ihop till stora kroppar."],
      ["Nukleolen består till stor del av ribosomalt RNA.",true,"Den bildas runt rRNA-generna. {{src:s. 23}}"]]},
    clozeRib:{ty:"cloze", h:"Ribosomen i arbete", text:"Ribosomen består av två [[subenheter]] av [[rRNA|RNA]] och proteiner. När de stöter på ett [[mRNA|budbärar-RNA]] fastnar först den [[lilla]] subenheten och sedan den stora. [[tRNA]] levererar [[aminosyror|aminosyra]] som radas upp i rätt ordning. Ska proteinet ut ur cellen fästs ribosomen på [[ER]]. Ska proteinet in i en annan organell fungerar början av kedjan som en [[adresslapp]] som sedan klipps bort.", bank:true},
    sortRib:{ty:"sort", h:"Fri eller ER-bunden ribosom?", cats:["Fri ribosom","ER-bunden ribosom"], items:[
      ["Ett enzym som ska arbeta i cytoplasman",0,"Proteiner för cytoplasman görs på fria ribosomer."],
      ["Ett protein som ska utsöndras ur cellen",1,"Exportproteiner förs in i ER."],
      ["Ett transportprotein som ska sitta i cellmembranet",1,"Membranproteiner görs på ER-bundna ribosomer."],
      ["Ett nedbrytande enzym till lysosomen",1,"Lysosomens enzymer görs på ER-bundna ribosomer."],
      ["Ett protein med adresslapp till en annan organell",0,"Fria ribosomer gör proteiner för andra organeller, och adresslappen styr dem rätt."],
      ["Ett hormon av protein som sekretoriska blåsor släpper ut",1,"Det ska exporteras."]]},
    sortSerRer:{ty:"sort", h:"Slätt eller kornigt ER?", cats:["SER","RER"], items:[
      ["Har ribosomer",1,"RER = rough, kornigt av ribosomer."],
      ["Tillverkar fosfolipider till membranen",0,"Lipidmetabolism sker i SER."],
      ["Tillverkar testosteron och östrogener",0,"Steroidhormoner bildas från kolesterol i SER."],
      ["Avgiftar, därför mycket i leverceller",0,"SER avgiftar med enzymer."],
      ["Proteinerna veckas till rätt 3D-struktur",1,"Proteiner från ribosomerna förs in i RER och veckas."],
      ["Proteiner får kolhydrater och skickas i blåsor till golgi",1,"Det händer i RER."],
      ["Jontransport i nerv- och muskelceller",0,"SER har speciella uppgifter där."],
      ["Gör proteiner för export, cellmembran och lysosomer",1,"Ribosomerna på RER gör dem."]]},
    mcGolgi:{ty:"mc", h:"Golgiapparaten", items:[
      {q:"Varför kan blåsorna från RER smälta ihop med golgiapparaten?", o:["Båda har membran av fosfolipider","Golgi har en cellvägg som blåsorna fäster i","Blåsorna löses upp i cytoplasman","Ribosomerna limmar ihop dem"], why:"Fosfolipiderna blandar sig med varandra. {{src:s. 25}}"},
      {q:"Vilken modifiering nämner boken INTE i golgiapparaten?", o:["Att aminosyror byts ut","Att sockermolekyler fästs","Att fettsyror fästs","Att metyl- eller fosfatgrupper fästs"], why:"Boken nämner socker, fettsyror, metylgrupper och fosfatgrupper."},
      {q:"Vilka blåsor bildas i ALLA celler enligt boken?", o:["Blåsor med byggmaterial till cellmembranet","Sekretoriska blåsor","Peroxisomer","Vakuoler"], why:"Sekretoriska blåsor finns bara i celler som snabbt måste utsöndra mycket protein."},
      {q:"Vad gör en sekretorisk blåsa när den är färdig?", o:["Väntar nära cellmembranet på en signal","Stannar i cellen och bryter ner organeller","Åker tillbaka till RER","Delar sig genom avknoppning"], why:"När signalen kommer släpps innehållet ut i omgivningen."},
      {q:"Hur många cisterner har golgiapparaten ofta enligt texten?", o:["Sex","Tre","Två","Hundra"], why:"Texten säger ofta sex. Figuren visar tre, så läs noga."}]},
    chainLyso:{ty:"chain", h:"Saknad länk: lysosomen", items:[
      {h:"Säkerhetsspärren", steps:["En lysosom går sönder","Enzymerna läcker ut i cytoplasman","Cytoplasmans pH är högre","Enzymerna fungerar sämre","Cellen bryts inte ner"], b:2, w:["Cytoplasmans pH är lägre","Katalas stoppar enzymerna"], why:"Enzymerna fungerar bäst vid lysosomens låga pH. {{src:s. 26}}"},
      {h:"Återvinning", steps:["Gammal mitokondrie","Membranen smälter ihop med lysosomen","Enzymer bryter ner den","Byggstenar återvinns, avfall ut genom exocytos"], b:1, w:["Mitokondrien knoppas av","Mitokondrien förs till kärnan"], why:"Membranen smälter ihop och organellen tas in i lysosomen."},
      {h:"Försvar", steps:["Vit blodkropp möter en bakterie","Cellmembranet omsluter bakterien","Membranblåsa förs in i blodkroppen","Blåsan smälter ihop med lysosomer","Bakterien bryts ner"], b:3, w:["Blåsan smälter ihop med kärnan","Blåsan smälter ihop med peroxisomer"], why:"Bakterien bryts ner på samma sätt som gamla organeller."}]},
    sortLysPer:{ty:"sort", h:"Lysosom eller peroxisom?", cats:["Lysosom","Peroxisom"], items:[
      ["Bildas i golgiapparaten",0,"Lysosomer knoppas av från golgi."],
      ["Bildas genom avknoppning från befintliga",1,"Peroxisomer bildas inte i golgi."],
      ["Innehåller katalas",1,"Katalas oskadliggör väteperoxid."],
      ["Lågt pH inuti",0,"Lysosomens enzymer fungerar bäst vid lågt pH."],
      ["Bryter ner fettsyror och utvinner energi",1,"Väteperoxid bildas som biprodukt."],
      ["Bryter ner gamla organeller",0,"Lysosomen håller rent och återvinner."],
      ["Extra många i fettceller",1,"Fettceller bryter ofta ner fett."],
      ["Bokens \"sopförbränningsanläggning\"",0,"Bokens eget ord på s. 23."]]},
    chainMito:{ty:"chain", h:"Saknad länk: mitokondrien", items:[
      {h:"Veckat inre membran", steps:["Inre membranet är starkt veckat","Stor yta","Plats för många enzymer i elektrontransportkedjan","Mycket ATP bildas"], b:1, w:["Liten yta","Plats för mer DNA"], why:"Vecken ger stor yta för membranförankrade enzymer. {{src:s. 27}}"},
      {h:"Muskelcellen", steps:["Muskelcellen arbetar mycket","Högt energibehov","Behöver mycket ATP","Extra många mitokondrier"], b:2, w:["Behöver mycket fett","Behöver många lysosomer"], why:"De flesta ATP bildas i mitokondrien."},
      {h:"Endosymbios", steps:["Föregångaren till den eukaryota cellen slukar en bakterie","Bakterien lever kvar i symbios","Bakteriens membran blir inre membranet, värdens blir yttre","Mitokondrien har två membran, eget ringformat DNA och bakterieribosomer"], b:2, w:["Bakterien bryts ner av lysosomer","Bakterien förlorar sitt DNA"], why:"Det är därför man ser bakteriedrag i mitokondrien."},
      {h:"Energin i födan", steps:["Energirik näring","Enzymer i matrix och elektrontransportkedjan utvinner energin","Mycket blir spillvärme","En del fångas in som ATP"], b:2, w:["All energi blir ATP","Energin lagras som DNA"], why:"Boken: mycket energi avgår som spillvärme, men en del fångas in."}]},
    tfSkelett:{ty:"tf", h:"Cellskelettet: sant eller falskt?", items:[
      ["Organellerna flyter fritt omkring i cytoplasman.",false,"De är kopplade till cellskelettet. {{src:s. 27}}"],
      ["Cellskelettet består av tre typer av trådar.",true,"Mikrotubuli, intermediära filament och mikrofilament."],
      ["Intermediära filament fungerar som räls för motorproteiner enligt boken.",false,"Boken nämner mikrotubuli och mikrofilament."],
      ["Cellskelettet behövs vid celldelning.",true,"Celldelning är en av funktionerna."],
      ["Boken anger hur tjocka de tre trådtyperna är.",false,"Boken anger inga mått."],
      ["Bokens fluorescensfoto visar aktinfilament i rött och kärnor i blått.",true,"Bildtexten på s. 27."]]},
    ordResa:{ty:"order", h:"Proteinets resa ut ur cellen", intro:"Lägg stegen i rätt ordning för ett protein som ska utsöndras.", items:[
      "Enzymer bildar mRNA från en gen i löspackat kromatin",
      "mRNA lämnar kärnan genom en kärnpor",
      "Lilla subenheten fäster på mRNA, sedan den stora",
      "Ribosomen fästs på ER",
      "Proteinet veckas och får kolhydrater i RER",
      "Proteinet packas i en membranblåsa",
      "Blåsan smälter ihop med golgiapparaten",
      "Proteinet modifieras och flyttas cistern för cistern",
      "En sekretorisk blåsa knoppas av och väntar vid cellmembranet",
      "En signal kommer och proteinet släpps ut"], why:"Kärna, kärnpor, ribosom, RER, blåsa, golgi, sekretorisk blåsa, signal. {{src:s. 22–25}}", src:"s. 22–25"},
    matchCelltyp:{ty:"match", h:"Vilken celltyp har extra mycket av vad?", pairs:[
      ["Muskelcell","Mitokondrier, eftersom energibehovet är högt"],
      ["Levercell","SER som avgiftar, och glykogen som inklusionskropp"],
      ["Testosteronproducerande cell i testikeln","SER som tillverkar steroidhormoner"],
      ["Fettcell","Peroxisomer, och fett som inklusionskropp"],
      ["Cell som tillverkar mycket protein","Tydliga nukleoler, eftersom den behöver många ribosomer"],
      ["Hudcell","Melanin (pigment) som inklusionskropp"],
      ["Cell som snabbt utsöndrar mycket protein","Sekretoriska blåsor nära cellmembranet"]]},
    whoK4:{ty:"who", h:"Vem är jag?", items:[
      {clues:["Jag är en membranbubbla som är mindre än en lysosom.","Jag bildas genom avknoppning.","Jag har katalas som tar hand om väteperoxid."], a:"Peroxisomen", w:["Lysosomen","Golgiapparaten","Vakuolen"], why:"{{src:s. 26 · korsord 6 lodrätt}}"},
      {clues:["Jag syns som ett mörkt parti i elektronmikroskop.","Jag finns inne i kärnan.","Jag består mest av rRNA."], a:"Nukleolen", w:["Nukleoplasman","Kromatinet","Centriolen"], why:"{{src:s. 23 · korsord 4 lodrätt}}"},
      {clues:["Jag utgör ungefär hälften av cellens membran.","Jag har kontakt med kärnmembranet.","Jag är ett förgrenat kanalsystem, slätt eller kornigt."], a:"ER", w:["Golgiapparaten","Cellmembranet","Mitokondrien"], why:"{{src:s. 24 · korsord 2 lodrätt}}"},
      {clues:["Jag har eget ringformat DNA.","Mitt inre membran är veckat.","Jag är cellens kraftverk."], a:"Mitokondrien", w:["Kärnan","Peroxisomen","Ribosomen"], why:"{{src:s. 27 · korsord 14 vågrätt}}"},
      {clues:["Jag har ofta sex cisterner.","Jag fäster socker, fettsyror, metyl- och fosfatgrupper på proteiner.","Jag skickar ut lysosomer och sekretoriska blåsor."], a:"Golgiapparaten", w:["RER","SER","Lysosomen"], why:"{{src:s. 25 · korsord 13 vågrätt}}"},
      {clues:["Jag är en blandning av DNA och proteiner.","Jag kan vara tätpackat eller löspackat.","Vid celldelningen packas jag ihop till kromosomer."], a:"Kromatinet", w:["Nukleolen","Nukleoplasman","Histonerna"], why:"{{src:s. 22 · korsord 9 lodrätt}}"}]},
    fixK4:{ty:"fix", h:"Hitta felen i Pelles förklaring", parts:["Ett protein som ska utsöndras tillverkas på ",["fria ribosomer i cytoplasman","ribosomer som är bundna till ER","Exportproteiner görs på ER-bundna ribosomer och förs in i ER."],". Ribosomens ",["stora","lilla","Boken säger att den lilla subenheten fastnar först på mRNA."]," subenhet fastnar först på mRNA. I ER veckas proteinet, och sedan åker det i en membranblåsa till golgiapparaten. Där packas proteinet i en sekretorisk blåsa. Lysosomer och ",["peroxisomer","blåsor med byggmaterial till cellmembranet","Peroxisomer bildas genom avknoppning från befintliga peroxisomer, inte i golgi."]," knoppas också av från golgiapparaten. Energin till allt detta kommer från mitokondrien, som har ",["ett membran","två membran","Mitokondrien har två membran, ett av bevisen för endosymbiosteorin."]," och eget ringformat DNA."]}
  },
  w:{
    k4Resa(el,api){
      el.className="wid";
      const P={karna:[62,138],gen:[48,150],por:[118,128],ribf:[152,120],rer:[176,100],ves1:[214,92],gin:[244,120],golgi:[262,140],gout:[288,140],sekr:[338,112],memS:[384,112],ut:[408,112],bygg:[338,184],memB:[382,186],lyso:[318,236],cyto:[176,232],mito:[312,46],ribfree:[150,206]};
      const DEST={ut:"Ut ur cellen",mem:"Cellmembranet",lyso:"Lysosomen",cyto:"Cytoplasman",mito:"En annan organell"};
      const COMMON=[
        {at:"gen",h:"Kärnan: genen läses",t:"Genen ligger i löspackat kromatin. Därför kommer enzymer åt den och kan bilda budbärar-RNA (mRNA), en kopia av ritningen.",f:"Ledningskontoret"},
        {at:"por",h:"Kärnporen",t:"mRNA tar sig ut ur kärnan genom en kärnpor. Ritningen (DNA) stannar kvar i kärnan.",f:"Dörren från kontoret"},
        {at:"ribf",h:"Ribosomen startar",t:"Den lilla subenheten fastnar först på mRNA, sedan den stora. tRNA levererar aminosyror som radas upp i rätt ordning.",f:"Arbetsbänken"}];
      const ER=[
        {at:"rer",h:"Ribosomen fästs på ER",t:"Proteinet ska {X}. Därför fästs ribosomen på ER och blir en ER-bunden ribosom. Proteinet förs in i ER.",f:"Löpande bandet"},
        {at:"rer",h:"I kornigt ER",t:"Inne i ER veckar proteinet snabbt ihop sig till rätt tredimensionell form. Många proteiner får kolhydrater fästa på sig.",f:"Löpande bandet"},
        {at:"ves1",h:"Membranblåsa",t:"Proteinet paketeras i en membranblåsa som transporteras till golgiapparaten.",f:"Lastbilen"},
        {at:"gin",h:"In i golgi",t:"Blåsan och golgiapparaten har båda membran av fosfolipider. Därför kan de smälta ihop, och proteinet kommer in.",f:"Packcentralen"},
        {at:"gout",h:"Golgi modifierar",t:"Proteinet modifieras, till exempel med sockermolekyler, fettsyror, metylgrupper eller fosfatgrupper. Det flyttas i små blåsor från cistern till cistern.",f:"Packcentralen"}];
      const END={
        ut:[{at:"sekr",h:"Sekretorisk blåsa",t:"På andra sidan knoppas en sekretorisk blåsa av. Proteinet ligger tätt packat i den, och blåsan väntar nära cellmembranet på en signal.",f:"Lastbil vid lastkajen"},
            {at:"ut",h:"Signal: släpp ut",t:"Signalen kommer. Blåsan smälter ihop med cellmembranet, eftersom båda är fosfolipidmembran, och proteinet släpps ut i omgivningen. Det kallas exocytos.",f:"Leverans"}],
        mem:[{at:"bygg",h:"Blåsa med byggmaterial",t:"En blåsa med byggmaterial knoppas av och vandrar till cellmembranet. Sådana blåsor bildas i alla celler.",f:"Lastbil med byggmaterial"},
             {at:"memB",h:"Nytt membranprotein",t:"Blåsan smälter ihop med cellmembranet. Proteinet blir ett nytt membranprotein, och membranet får nytt byggmaterial.",f:"Ny port i tullgränsen"}],
        lyso:[{at:"lyso",h:"En lysosom bildas",t:"Proteinet är ett nedbrytande enzym. Det knoppas av i en lysosom som stannar i cellen. Enzymet arbetar bäst i lysosomens låga pH.",f:"Sopförbränningen"}],
        cyto:[{at:"ribfree",h:"Fri ribosom",t:"Proteinet ska arbeta i cytoplasman. Därför stannar ribosomen kvar fritt i cytoplasman. Den kallas fri ribosom.",f:"Arbetsbänk på golvet"},
              {at:"cyto",h:"Klart",t:"Proteinet tillverkas färdigt och börjar arbeta direkt i cytoplasman. Det behöver varken ER eller golgi.",f:"Fabriksgolvet"}],
        mito:[{at:"ribfree",h:"Fri ribosom med adresslapp",t:"Proteinet ska in i en annan organell, till exempel mitokondrien. Därför tillverkas det på en fri ribosom. Den första korta biten av aminosyrakedjan är en adresslapp.",f:"Fraktsedel"},
              {at:"mito",h:"In i organellen",t:"Adresslappen ser till att proteinet lyfts in i rätt organell. Sedan klipps adresslappen bort.",f:"Fraktsedeln rivs av"}]};
      const XT={ut:"exporteras ut ur cellen",mem:"sitta i cellmembranet",lyso:"arbeta i lysosomerna"};
      let dest="ut",i=0,cur=null,anim=0;
      function steps(){const d=dest;if(d==="cyto"||d==="mito")return COMMON.concat(END[d]);return COMMON.concat(ER.map((s,k)=>k===0?Object.assign({},s,{t:s.t.replace("{X}",XT[d])}):s),END[d])}
      el.innerHTML=`<div class="wh"><b>Följ proteinet genom fabriken</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0"><svg viewBox="0 0 420 280" role="img" aria-label="Karta över cellen där ett protein flyttar sig steg för steg" id="k4-rs-svg"></svg></figure>
      <div>${segHTML("k4-rs-d","Vart ska proteinet?",Object.entries(DEST),"ut")}
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0"><button class="btn sm" type="button" id="k4-rs-prev">Förra</button><button class="btn sm" type="button" id="k4-rs-next">Nästa steg</button><button class="btn sm ghost" type="button" id="k4-rs-reset">Börja om</button></div>
      <dl class="readout"><dt>Steg</dt><dd id="k4-rs-n"></dd><dt>Station</dt><dd id="k4-rs-h"></dd><dt>I fabriken</dt><dd id="k4-rs-f"></dd></dl>
      <p id="k4-rs-t"></p><p class="verdict" id="k4-rs-vd"></p></div></div>`;
      const svg=el.querySelector("#k4-rs-svg"),$=s=>el.querySelector(s);
      const reduce=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
      function base(hi){const H=k=>hi===k?' stroke-width="4"':"";let s="";
        s+=`<path d="M8 20 H392 C404 80 400 200 392 270 H8 Z" ${st("--c-cyto")}/>`;
        s+=`<path d="M392 20 C404 80 400 200 392 270" fill="none" style="stroke:var(--c-mem)" stroke-width="${hi==="mem"?7:5}"/>`;
        s+=`<circle cx="62" cy="140" r="56" ${st("--c-nuc-soft","--c-nuc",hi==="karna"?4:2.4)}/>${ln(squiggle(56,146,36,16,0.9),"--c-dna",1.6)}<rect x="113" y="122" width="10" height="12" rx="2" ${st("--c-cyto","--c-mem",1.4)}/>`;
        [0,12,24].forEach(d=>{s+=ln(`M${150+d} 70 Q${140+d} 120 ${150+d} 170`,"--c-er",hi==="rer"?5:3.4)});s+=dots([[146,80],[140,100],[138,120],[140,140],[146,160],[160,84],[155,110],[154,132],[158,156]],1.6);
        [0,12,24].forEach(d=>{s+=ln(`M${250+d} 104 Q${238+d} 140 ${250+d} 176`,"--c-golgi",hi==="golgi"?7:5)});
        s+=mito(312,46,30,13,0)+`<circle cx="318" cy="236" r="14" ${st("--good-soft","--c-lyso",hi==="lyso"?4:2)}/>`;
        s+=`<text x="62" y="214" text-anchor="middle" ${TX}>kärna</text><text x="160" y="196" text-anchor="middle" ${TX}>ER</text><text x="262" y="200" text-anchor="middle" ${TX}>golgi</text><text x="318" y="270" text-anchor="middle" ${TX}>lysosom</text><text x="312" y="82" text-anchor="middle" ${TX}>mitokondrie</text>`;
        return s}
      function marker(x,y,stp){const k=i;let s=`<g transform="translate(${r1(x)} ${r1(y)})">`;
        if(k===0||k===1)s+=`<path d="M-14 0 q4 -6 7 0 t7 0 t7 0 t7 0" fill="none" style="stroke:var(--c-dna)" stroke-width="3"/>`;
        else if(stp.at==="ves1"||stp.at==="gin"||stp.at==="sekr"||stp.at==="bygg")s+=`<circle r="11" ${st("--paper",stp.at==="bygg"?"--c-mem":"--c-golgi",2.4)}/><circle r="5" ${st("--c-mito","--ink",1)}/>`;
        else if(stp.at==="ut")s+=dots([[-4,-8],[6,0],[-4,8],[10,-10]],3,"--c-mito");
        else s+=`<circle r="7" ${st("--c-mito","--ink",1.2)}/>`;
        if(stp.at==="ribf"||stp.at==="rer"||stp.at==="ribfree")s+=`<ellipse cx="0" cy="12" rx="11" ry="5" ${st("--c-er")}/><path d="M-9 8 C-9 -6 9 -6 9 8 Z" ${st("--c-nuc")} opacity=".85"/>`;
        return s+`</g>`}
      function hiOf(at){return {gen:"karna",por:"karna",rer:"rer",gin:"golgi",gout:"golgi",lyso:"lyso",memS:"mem",ut:"mem",memB:"mem"}[at]||""}
      function render(x,y){const S=steps(),stp=S[i];svg.innerHTML=base(hiOf(stp.at))+marker(x,y,stp)}
      function go(to){const S=steps();i=Math.max(0,Math.min(S.length-1,to));const stp=S[i],tg=P[stp.at];
        $("#k4-rs-n").textContent=(i+1)+" av "+S.length;$("#k4-rs-h").textContent=stp.h;$("#k4-rs-f").textContent=stp.f;$("#k4-rs-t").innerHTML=api.tpl(stp.t);
        const vd=$("#k4-rs-vd");if(i===S.length-1){vd.className="verdict g";vd.textContent="Framme: "+DEST[dest].toLowerCase()}else{vd.className="verdict";vd.textContent=""}
        $("#k4-rs-prev").disabled=i===0;$("#k4-rs-next").disabled=i===S.length-1;
        const from=cur||tg;cur=tg.slice();cancelAnimationFrame(anim);
        if(reduce||from===tg){render(tg[0],tg[1]);return}
        const t0=performance.now();const step=ts=>{if(!el.isConnected)return;const u=Math.min(1,(ts-t0)/450),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;render(from[0]+(tg[0]-from[0])*e,from[1]+(tg[1]-from[1])*e);if(u<1)anim=requestAnimationFrame(step)};anim=requestAnimationFrame(step)}
      el.querySelectorAll("#k4-rs-d button").forEach(b=>b.addEventListener("click",()=>{dest=b.dataset.v;el.querySelectorAll("#k4-rs-d button").forEach(o=>o.setAttribute("aria-pressed",o===b?"true":"false"));cur=null;go(0)}));
      $("#k4-rs-next").addEventListener("click",()=>go(i+1));$("#k4-rs-prev").addEventListener("click",()=>go(i-1));$("#k4-rs-reset").addEventListener("click",()=>{cur=null;go(0)});
      go(0);
    }
  }
});

})();
