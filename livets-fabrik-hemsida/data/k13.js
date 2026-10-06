/* K13 Växten och växtcellen. Bok s. 244–247 (+ s. 33), PPT Bi2 bild 3, 7, 18–26. */
(function(){
"use strict";
const r1=n=>Math.round(n*10)/10;
const st=(f,s)=>`style="fill:var(${f})${s?";stroke:var("+s+")":""}"`;
function dots(pts,r,col){return pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${r}" style="fill:var(${col||"--ink"})"/>`).join("")}
function arcPt(cx,cy,R,a){const t=a*Math.PI/180;return [r1(cx+R*Math.cos(t)),r1(cy+R*Math.sin(t))]}
function arcPath(cx,cy,R,a0,a1){const p=arcPt(cx,cy,R,a0),q=arcPt(cx,cy,R,a1);return `M${p[0]} ${p[1]} A${R} ${R} 0 0 1 ${q[0]} ${q[1]}`}
function arcDots(cx,cy,R,a0,a1,step){const o=[];for(let a=a0;a<=a1+0.01;a+=step)o.push(arcPt(cx,cy,R,a));return o}
function mito(cx,cy,rx,ry,rot){let z=`M${r1(cx-rx*0.7)} ${cy}`;const n=6;for(let i=1;i<=n;i++){const x=cx-rx*0.7+i*(rx*1.4/n);z+=` L${r1(x)} ${r1(cy+(i%2?-1:1)*ry*0.5)}`}
  return `<g transform="rotate(${rot} ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${st("--c-mito-soft","--c-mito")} stroke-width="2"/><path d="${z}" fill="none" style="stroke:var(--c-mito)" stroke-width="1.4"/></g>`}
function chlo(cx,cy,rx,ry,rot){let s=`<g transform="rotate(${rot} ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${st("--c-chl","--c-chl")} stroke-width="1.5"/>`;
  const n=3;for(let i=0;i<n;i++){const x=cx-rx*0.5+i*rx*0.5;s+=`<path d="M${r1(x-rx*0.17)} ${r1(cy-ry*0.35)} h${r1(rx*0.34)} M${r1(x-rx*0.17)} ${cy} h${r1(rx*0.34)} M${r1(x-rx*0.17)} ${r1(cy+ry*0.35)} h${r1(rx*0.34)}" fill="none" style="stroke:var(--c-chl-soft)" stroke-width="1.6"/>`}
  return s+`</g>`}
function squiggle(cx,cy,R,n,seed){const pts=[];for(let i=0;i<n;i++){const a=i*2.399+seed;const f=Math.abs(Math.sin(i*12.9898+seed)*43758.5453)%1;const rr=R*(0.25+0.75*f);pts.push([r1(cx+rr*Math.cos(a)),r1(cy+rr*Math.sin(a))])}
  let d=`M${pts[0][0]} ${pts[0][1]}`;for(let i=1;i<pts.length-1;i++){const m=[r1((pts[i][0]+pts[i+1][0])/2),r1((pts[i][1]+pts[i+1][1])/2)];d+=` Q${pts[i][0]} ${pts[i][1]} ${m[0]} ${m[1]}`}return d}
function arr(x1,y1,x2,y2,col,w,hs){const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,h=hs||8;const bx=x2-ux*h,by=y2-uy*h,px=-uy*h*0.6,py=ux*h*0.6;
  return `<path d="M${r1(x1)} ${r1(y1)} L${r1(bx)} ${r1(by)}" fill="none" style="stroke:var(${col})" stroke-width="${w}" stroke-linecap="round"/><polygon points="${r1(x2)},${r1(y2)} ${r1(bx+px)},${r1(by+py)} ${r1(bx-px)},${r1(by-py)}" style="fill:var(${col})"/>`}
const T13='class="lbs halo" style="font-size:13.5px"';

/* ---------- figur: växtgrupperna (s. 244) ---------- */
function figVaxter(){
  let s=`<rect x="0" y="190" width="470" height="24" ${st("--c-wall-soft")}/><rect x="0" y="118" width="96" height="72" ${st("--c-vac-soft")}/><path d="M0 190 H470" fill="none" style="stroke:var(--c-wall)" stroke-width="1.5"/>`;
  let g=`<g data-k="alg"><rect x="4" y="112" width="88" height="100" fill="transparent"/>`;
  for(let i=0;i<5;i++){const x=28+i*10;g+=`<path d="M${x} 189 q-6 -12 0 -24 q6 -12 0 -24 q-6 -10 1 -16" fill="none" style="stroke:var(--c-chl)" stroke-width="3" stroke-linecap="round"/>`}
  s+=g+`</g>`;
  g=`<g data-k="moss"><rect x="104" y="150" width="56" height="58" fill="transparent"/>`;
  for(let i=0;i<11;i++){const x=112+i*4;g+=`<path d="M${x} 190 q${i%2?2:-2} -10 ${r1((i-5)*1.2)} -22" fill="none" style="stroke:var(--c-chl)" stroke-width="3" stroke-linecap="round"/>`}
  for(let i=0;i<5;i++){const x=116+i*8;g+=`<path d="M${x} 191 l${(i-2)*2} 13" fill="none" style="stroke:var(--c-wall)" stroke-width="1.3"/>`}
  s+=g+`</g>`;
  g=`<g data-k="orm"><rect x="206" y="100" width="76" height="108" fill="transparent"/>`;
  for(const sd of [-1,1]){g+=`<path d="M244 190 q${sd*6} -36 ${sd*30} -64" fill="none" style="stroke:var(--c-chl)" stroke-width="2.6"/>`;
    for(let j=1;j<6;j++){const t=j/6;const px=244+sd*(12*t+18*t*t),py=190-72*t+8*t*t;g+=`<ellipse cx="${r1(px+sd*7)}" cy="${r1(py-2)}" rx="7" ry="2.8" transform="rotate(${sd*-30} ${r1(px+sd*7)} ${r1(py-2)})" ${st("--c-chl")}/>`}}
  g+=`<path d="M244 190 V108" fill="none" style="stroke:var(--c-chl)" stroke-width="2.6"/>`;
  for(let j=1;j<6;j++){const y=190-j*14;g+=`<ellipse cx="236" cy="${y}" rx="7" ry="2.6" ${st("--c-chl")}/><ellipse cx="252" cy="${y}" rx="7" ry="2.6" ${st("--c-chl")}/>`}
  for(let i=0;i<4;i++)g+=`<path d="M${238+i*4} 191 l${(i-1.5)*4} 15" fill="none" style="stroke:var(--c-wall)" stroke-width="1.5"/>`;
  s+=g+`</g>`;
  g=`<g data-k="nak"><rect x="306" y="104" width="84" height="104" fill="transparent"/><rect x="344" y="170" width="8" height="20" ${st("--c-wall")}/>`;
  [[108,22,134],[124,28,152],[142,34,172]].forEach(([y,w,b])=>{g+=`<polygon points="348,${y} ${348-w},${b} ${348+w},${b}" ${st("--c-chl")}/>`});
  for(let i=0;i<4;i++)g+=`<path d="M${342+i*4} 191 l${(i-1.5)*5} 15" fill="none" style="stroke:var(--c-wall)" stroke-width="1.5"/>`;
  s+=g+`</g>`;
  g=`<g data-k="gom"><rect x="400" y="100" width="64" height="108" fill="transparent"/><path d="M432 190 V128" fill="none" style="stroke:var(--c-chl)" stroke-width="3"/><ellipse cx="420" cy="168" rx="12" ry="5" transform="rotate(-30 420 168)" ${st("--c-chl")}/><ellipse cx="444" cy="158" rx="12" ry="5" transform="rotate(30 444 158)" ${st("--c-chl")}/>`;
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2-Math.PI/2;const x=r1(432+Math.cos(a)*9),y=r1(120+Math.sin(a)*9);g+=`<ellipse cx="${x}" cy="${y}" rx="8" ry="5.5" transform="rotate(${Math.round(a*180/Math.PI)} ${x} ${y})" ${st("--c-vir")}/>`}
  g+=`<circle cx="432" cy="120" r="4.5" ${st("--c-mem")}/>`;
  for(let i=0;i<4;i++)g+=`<path d="M${426+i*4} 191 l${(i-1.5)*4} 14" fill="none" style="stroke:var(--c-wall)" stroke-width="1.5"/>`;
  s+=g+`</g>`;
  s+=`<path d="M198 78 V70 H466 V78" fill="none" style="stroke:var(--ink)" stroke-width="1.6"/><path d="M302 102 V96 H466 V102" fill="none" style="stroke:var(--ink)" stroke-width="1.6"/>`;
  s+=`<text x="48" y="272" text-anchor="middle" ${T13}>i vatten</text><text x="132" y="272" text-anchor="middle" ${T13}>inga rötter</text><text x="244" y="272" text-anchor="middle" ${T13}>sporer</text><text x="348" y="272" text-anchor="middle" ${T13}>t.ex. barrträd</text><text x="432" y="272" text-anchor="middle" ${T13}>blommande</text>`;
  return s;
}

/* ---------- figur: bokens växtcell (s. 245) ---------- */
function figVaxtcell(){
  const inner="M154 57 Q245 48 346 62 Q373 67 374 96 L376 326 Q376 359 345 362 L150 367 Q120 367 119 337 L118 88 Q118 60 154 57 Z";
  let s=`<g data-k="vagg"><path d="M150 44 Q245 34 352 50 Q384 56 386 92 L388 330 Q388 370 350 374 L146 380 Q110 380 108 342 L106 86 Q106 48 150 44 Z" ${st("--c-wall-soft","--c-wall")} stroke-width="2"/></g>`;
  s+=`<g data-k="cyto"><path d="${inner}" ${st("--c-cyto")}/></g>`;
  s+=`<g data-k="mem"><path d="${inner}" fill="none" style="stroke:var(--c-mem)" stroke-width="4"/></g>`;
  s+=`<g data-k="vak"><path d="M172 90 C200 70 304 74 322 96 C340 122 334 196 306 214 C276 232 240 214 210 226 C182 238 158 222 154 190 C150 150 150 108 172 90 Z" ${st("--c-vac-soft","--c-vac")} stroke-width="2"/></g>`;
  // fria ribosomer
  s+=`<g>${dots([[136,104],[132,196],[140,166],[164,252],[186,248],[198,270],[140,318],[250,250],[262,262],[246,282],[354,98],[362,244],[364,152],[330,232],[282,240],[204,64],[290,66],[136,72],[230,236],[160,300],[254,300],[364,282],[204,340],[236,356]],1.8)}</g>`;
  s+=`<g data-k="rib"><circle cx="145" cy="238" r="15" fill="transparent"/>${dots([[138,232],[145,236],[140,242],[150,230],[152,241],[146,247],[134,239],[156,236]],2)}</g>`;
  s+=`<g data-k="klor">${chlo(152,282,19,11,-20)}${chlo(246,64,16,6.5,0)}${chlo(354,190,17,9,80)}${chlo(170,352,17,7.5,0)}</g>`;
  s+=`<g data-k="mito">${mito(178,322,18,10,15)}${mito(354,124,16,9,80)}</g>`;
  let go=`<g data-k="golgi"><rect x="202" y="288" width="44" height="38" fill="transparent"/>`;
  for(let i=0;i<4;i++)go+=`<path d="M204 ${300+i*7} q20 -9 40 0" fill="none" style="stroke:var(--c-golgi)" stroke-width="3.4" stroke-linecap="round"/>`;
  s+=go+`</g>`;
  s+=`<g data-k="er"><path d="M250 336 q13 8 26 2 q13 -6 26 4 M252 347 q13 8 26 2 q13 -6 26 4" fill="none" style="stroke:var(--c-er)" stroke-width="3" stroke-linecap="round"/></g>`;
  s+=`<g data-k="rer"><path d="${arcPath(306,286,42,-60,55)} ${arcPath(306,286,50,-45,40)}" fill="none" style="stroke:var(--c-er)" stroke-width="3" stroke-linecap="round"/>${dots(arcDots(306,286,46,-55,50,15).concat(arcDots(306,286,54.5,-40,35,15)),1.9)}</g>`;
  s+=`<g data-k="karna"><circle cx="306" cy="286" r="32" ${st("--c-nuc-soft")}/></g>`;
  s+=`<g data-k="dna"><path d="${squiggle(306,286,23,26,1.3)}" fill="none" style="stroke:var(--c-dna)" stroke-width="1.6"/></g>`;
  s+=`<g data-k="kmem"><circle cx="306" cy="286" r="32" fill="none" style="stroke:var(--c-nuc)" stroke-width="3.5" stroke-dasharray="15 4"/></g>`;
  return s;
}

/* ---------- figur: cellväggen och plasmodesmata (s. 244–245) ---------- */
function figVagg(){
  let s=`<g data-k="vagg"><rect x="6" y="14" width="458" height="196" rx="18" ${st("--c-wall-soft","--c-wall")} stroke-width="2"/></g>`;
  s+=`<g data-k="cyto"><rect x="20" y="28" width="196" height="168" rx="12" ${st("--c-cyto")}/><rect x="254" y="28" width="196" height="168" rx="12" ${st("--c-cyto")}/></g>`;
  s+=`<g data-k="mem"><rect x="20" y="28" width="196" height="168" rx="12" fill="none" style="stroke:var(--c-mem)" stroke-width="3"/><rect x="254" y="28" width="196" height="168" rx="12" fill="none" style="stroke:var(--c-mem)" stroke-width="3"/></g>`;
  s+=`<g data-k="vak"><ellipse cx="118" cy="112" rx="74" ry="54" ${st("--c-vac-soft","--c-vac")} stroke-width="2"/><ellipse cx="352" cy="112" rx="74" ry="54" ${st("--c-vac-soft","--c-vac")} stroke-width="2"/></g>`;
  s+=chlo(70,42,13,5.5,0)+chlo(170,184,13,5.5,0)+chlo(300,42,13,5.5,0)+chlo(410,182,13,5.5,0);
  let p=`<g data-k="plas">`;[62,112,162].forEach(y=>{p+=`<rect x="210" y="${y-5}" width="50" height="10" rx="3" ${st("--c-cyto")}/><path d="M210 ${y-5} H260 M210 ${y+5} H260" fill="none" style="stroke:var(--c-mem)" stroke-width="1.8"/>`});
  s+=p+`</g>`;
  // förstoring
  let f=`<g data-k="fib"><rect x="4" y="254" width="462" height="138" rx="12" style="fill:var(--paper);stroke:var(--line)" stroke-width="1.5"/>`;
  f+=`<path d="M24 300 q25 -8 50 0 t50 0" fill="none" style="stroke:var(--c-wall)" stroke-width="2.6"/>`;
  for(let i=0;i<5;i++)f+=`<path d="M172 ${290+i*5} q25 -8 50 0 t50 0" fill="none" style="stroke:var(--c-wall)" stroke-width="2.2"/>`;
  f+=`<rect x="316" y="268" width="142" height="62" rx="8" ${st("--c-wall-soft")}/>`;
  const rd=[[322,274],[338,290],[352,276],[366,322],[380,284],[396,304],[410,274],[426,320],[440,292],[452,276],[330,318],[346,306],[372,300],[402,326],[418,288],[434,306],[450,322],[388,272]];
  rd.forEach((q,i)=>{f+=`<circle cx="${q[0]}" cy="${q[1]}" r="2.6" style="fill:var(${i%2?"--c-golgi":"--c-euk"})"/>`});
  for(let j=0;j<3;j++)for(let i=0;i<3;i++)f+=`<path d="M320 ${280+j*18+i*3.5} q34 -6 68 0 t64 0" fill="none" style="stroke:var(--c-wall)" stroke-width="1.8"/>`;
  f+=arr(134,298,162,298,"--ink",2.5,8)+arr(282,298,308,298,"--ink",2.5,8);
  s+=f+`</g>`;
  return s;
}

/* ---------- figur: den stora vakuolen bildas (s. 245) ---------- */
function figVakBildas(){
  let s="";
  [16,170,324].forEach((x,i)=>{s+=`<rect x="${x}" y="34" width="130" height="136" rx="14" ${st("--c-wall-soft","--c-wall")} stroke-width="2"/><rect x="${x+8}" y="42" width="114" height="120" rx="9" ${st("--c-cyto","--c-mem")} stroke-width="2"/>`;
    if(i===0)[[44,64,8],[76,58,9],[106,70,7],[52,100,9],[86,96,8],[112,112,7],[64,142,8],[40,132,7],[100,140,9]].forEach(([dx,y,r])=>{s+=`<circle cx="${x+dx-16}" cy="${y}" r="${r}" ${st("--c-vac-soft","--c-vac")} stroke-width="1.5"/>`});
    else if(i===1)[[214,86,20],[252,98,22],[220,128,16],[256,136,12]].forEach(([cx,cy,r])=>{s+=`<circle cx="${cx}" cy="${cy}" r="${r}" ${st("--c-vac-soft","--c-vac")} stroke-width="1.5"/>`});
    else s+=`<rect x="${x+18}" y="52" width="94" height="100" rx="22" ${st("--c-vac-soft","--c-vac")} stroke-width="2"/>`;
  });
  s+=chlo(36,52,8,4,0)+chlo(126,156,8,4,0)+chlo(188,152,8,4,0)+chlo(282,52,8,4,0)+chlo(340,48,8,3.5,0)+chlo(438,156,8,3.5,0);
  s+=arr(150,102,166,102,"--ink",2.5,7)+arr(304,102,320,102,"--ink",2.5,7);
  return s;
}

/* ---------- figur: lärarens växtcell (Bi2 bild 24) ---------- */
function figBi2(){
  let s="";
  [["20,170","4,170"],["66,66","54,40"],["330,66","342,40"],["330,274","342,300"],["66,274","54,300"]].forEach(([a,b])=>{s+=`<path d="M${a.replace(","," ")} L${b.replace(","," ")}" fill="none" style="stroke:var(--c-wall)" stroke-width="9" stroke-linecap="round"/><path d="M${a.replace(","," ")} L${b.replace(","," ")}" fill="none" style="stroke:var(--c-wall-soft)" stroke-width="5" stroke-linecap="round"/>`});
  s+=`<polygon points="20,170 66,66 330,66 380,170 330,274 66,274" ${st("--c-wall-soft","--c-wall")} stroke-width="2"/>`;
  s+=`<polygon points="31,170 72,77 324,77 369,170 324,263 72,263" ${st("--c-cyto","--c-mem")} stroke-width="2.5" stroke-linejoin="round"/>`;
  s+=`<path d="M98 99 H296 Q308 99 312 110 L312 230 Q308 241 296 241 H98 Q88 241 83 232 L60 180 Q56 170 60 160 L83 108 Q88 99 98 99 Z" ${st("--c-vac-soft","--c-vac")} stroke-width="2"/>`;
  s+=chlo(140,88,24,7.5,0)+chlo(234,88,24,7.5,0)+chlo(152,252,24,7.5,0)+chlo(268,252,24,7.5,0);
  s+=mito(45,170,14,7,90)+mito(330,224,10,6,-20);
  s+=`<ellipse cx="338" cy="170" rx="14" ry="30" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2.5"/>`;
  s+=`<path d="M316 124 q10 -10 22 -6 M316 132 q10 -10 24 -4" fill="none" style="stroke:var(--c-er)" stroke-width="2.6" stroke-linecap="round"/>${dots([[320,116],[328,111],[336,112],[322,125],[331,121],[340,124]],1.6)}`;
  for(let i=0;i<3;i++)s+=`<path d="M86 ${248+i*6} q13 -6 26 0" fill="none" style="stroke:var(--c-golgi)" stroke-width="3" stroke-linecap="round"/>`;
  return s;
}

/* ---------- figur: från blad till kloroplast (s. 247) ---------- */
function figKloro(){
  let s=`<defs><clipPath id="k13-leafclip"><circle cx="70" cy="100" r="54" fill="none"/></clipPath></defs><g data-k="blad"><circle cx="70" cy="100" r="54" ${st("--c-chl-soft")}/><g clip-path="url(#k13-leafclip)">`;
  for(let row=0;row<7;row++)for(let col=0;col<7;col++){const cx=6+col*24+(row%2?12:0),cy=40+row*21;let pts=[];for(let k=0;k<6;k++){const a=(30+60*k)*Math.PI/180;pts.push(r1(cx+13*Math.cos(a))+","+r1(cy+13*Math.sin(a)))}
    s+=`<polygon points="${pts.join(" ")}" ${st("--c-chl-soft","--c-wall")} stroke-width="1.6"/>`;
    for(let k=0;k<5;k++){const a=(k*72+row*20)*Math.PI/180;s+=`<circle cx="${r1(cx+6.5*Math.cos(a))}" cy="${r1(cy+6.5*Math.sin(a))}" r="2" ${st("--c-chl")}/>`}}
  s+=`</g><circle cx="70" cy="100" r="54" fill="none" style="stroke:var(--c-chl)" stroke-width="2"/></g>`;
  s+=`<path d="M70 100 Q128 20 186 82" fill="none" style="stroke:var(--ink)" stroke-width="7" stroke-linecap="round"/><polygon points="194.2,90.8 177.3,87.3 191.9,73.7" ${st("--ink")}/>`;
  s+=`<g data-k="ytter"><ellipse cx="322" cy="166" rx="134" ry="88" style="fill:var(--paper);stroke:var(--c-chl)" stroke-width="3.5"/></g>`;
  s+=`<g data-k="stroma"><ellipse cx="322" cy="166" rx="124" ry="78" ${st("--c-chl-soft")}/></g>`;
  s+=`<g data-k="inner"><ellipse cx="322" cy="166" rx="124" ry="78" fill="none" style="stroke:var(--c-chl)" stroke-width="2"/></g>`;
  const stacks=[[238,160],[284,126],[340,170],[386,128],[412,184],[300,214]];
  let gr=`<g data-k="gran"><path d="M252 156 L272 132 M298 128 L326 164 M354 164 L374 134 M398 132 L404 176 M354 178 L312 206 M252 166 L288 206" fill="none" style="stroke:var(--c-chl)" stroke-width="3.2"/>`,ty="";
  stacks.forEach(([x,y],si)=>{for(let j=0;j<5;j++){const e=`<ellipse cx="${x}" cy="${y-14+j*7}" rx="15" ry="4.6" style="fill:var(--c-chl);stroke:var(--c-chl-soft)" stroke-width="1.2"/>`;if(si===5&&j===4)ty+=e;else gr+=e}});
  s+=gr+`</g><g data-k="tyl">${ty}</g>`;
  s+=`<g data-k="dna"><circle cx="370" cy="216" r="12" fill="transparent"/><path d="M362 216 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M366 212 q4 6 8 0" fill="none" style="stroke:var(--c-dna)" stroke-width="2.2"/></g>`;
  s+=`<g data-k="rib"><circle cx="245" cy="203" r="11" fill="transparent"/>${dots([[240,200],[247,204],[242,208],[250,198],[236,206]],2.1)}</g>`;
  return s;
}

/* ---------- figur: tre sorters plastider (s. 246–247) ---------- */
function figPlastider(){
  let s=`<g data-k="klo"><ellipse cx="78" cy="80" rx="56" ry="28" ${st("--c-chl-soft","--c-chl")} stroke-width="2.5"/><ellipse cx="78" cy="80" rx="49" ry="21" fill="none" style="stroke:var(--c-chl)" stroke-width="1.2"/>`;
  [52,78,104].forEach(x=>{[74,80,86].forEach(y=>{s+=`<ellipse cx="${x}" cy="${y}" rx="9" ry="2.8" ${st("--c-chl")}/>`})});
  s+=`<path d="M78 198 C52 188 48 162 78 148 C108 162 104 188 78 198 Z" ${st("--c-chl")}/><path d="M78 196 V152" fill="none" style="stroke:var(--c-chl-soft)" stroke-width="1.6"/></g>`;
  s+=`<g data-k="leu"><ellipse cx="230" cy="80" rx="56" ry="28" style="fill:var(--paper);stroke:var(--muted)" stroke-width="2.5"/>`;
  [[208,76,12,8],[238,70,10,7],[254,88,9,6],[222,91,8,5]].forEach(([x,y,a,b])=>{s+=`<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" style="fill:var(--sunk);stroke:var(--line2)" stroke-width="1.5"/>`});
  s+=`<ellipse cx="230" cy="174" rx="36" ry="22" ${st("--c-wall-soft","--c-wall")} stroke-width="2"/>${dots([[214,168],[240,164],[248,182],[222,184]],2.2,"--c-wall")}</g>`;
  s+=`<g data-k="kro"><ellipse cx="382" cy="80" rx="56" ry="28" ${st("--c-arch-soft","--c-arch")} stroke-width="2.5"/>`;
  [[350,74],[362,90],[376,70],[392,92],[404,74],[416,86],[386,80],[368,80],[400,64],[358,62]].forEach((q,i)=>{s+=`<circle cx="${q[0]}" cy="${q[1]}" r="3.4" style="fill:var(${i%2?"--c-vir":"--c-arch"})"/>`});
  s+=`<path d="M368 196 V176" fill="none" style="stroke:var(--c-chl)" stroke-width="2.5"/>`;
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2-Math.PI/2;const x=r1(368+Math.cos(a)*10),y=r1(166+Math.sin(a)*10);s+=`<ellipse cx="${x}" cy="${y}" rx="9" ry="6" transform="rotate(${Math.round(a*180/Math.PI)} ${x} ${y})" ${st("--c-arch")}/>`}
  s+=`<circle cx="368" cy="166" r="5" ${st("--c-mem")}/><circle cx="410" cy="182" r="11" ${st("--c-vir")}/><path d="M410 171 q2 -6 7 -8" fill="none" style="stroke:var(--c-chl)" stroke-width="2"/></g>`;
  return s;
}

/* ---------- simuleringar ---------- */
const RM=()=>{try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}};
function segHTML(id,label,opts,cur){return `<div class="ctl">${label}<div class="seg" role="group" aria-label="${label}" id="${id}">${opts.map(([v,t])=>`<button type="button" data-v="${v}" aria-pressed="${v===cur}">${t}</button>`).join("")}</div></div>`}
function segWire(el,id,fn){const g=el.querySelector("#"+id);g.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{g.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(b.dataset.v)}))}

G.def({
  id:"k13",
  src:{bok:"s. 244–247 (kap. 7 Hur växter och svampar fungerar) · s. 33 (osmos)",ppt:"Bi2 bild 3, 7, 18–20, 23–26 · Mikroorganismer bild 12"},
  threads:["vagg","osmos","endo","membran","atp"],
  goals:[
    "förklara vad fotoautotrof betyder och vad en växt behöver, bland annat närsalter",
    "jämföra mossor och kärlväxter och beskriva växtgrupperna från grönalger till fröväxter",
    "säga vilka tre delar växtcellen har som djurcellen saknar och vilka två den saknar, och namnge delarna i bokens bild",
    "beskriva cellväggens byggnad och uppgifter, och förklara vad plasmodesmata är",
    "förklara hur den stora vakuolen bildas, vad den innehåller och hur den ger turgor",
    "förklara varför en växtcell inte spricker i destillerat vatten men en röd blodkropp gör det",
    "beskriva kloroplastens byggnad, varför växter är gröna och varför man tror att kloroplasten uppkom genom endosymbios",
    "skilja på kloroplaster, leukoplaster och kromoplaster"
  ],
  intro:`<p>Hittills har fabriken varit en djurcell. Nu bygger vi om den till <b>den gröna fabriken</b>. Den har samma avdelningar som djurcellen i {{go:k4|K4 Organellerna}}, och dessutom tre tillbyggnader: en mur av cellulosa (cellväggen), en vattentank (vakuolen) och ett solkraftverk (kloroplasterna). Först ser vi på hela växten och vad den behöver.</p>`,
  secs:[
  {id:"vaxten",h:"Växten",nav:"Växten",src:"s. 244 · PPT Bi2 bild 3, 18–20",prov:true,html:`
    <p>En växt skiljer sig från ett djur genom att den är <b>fotoautotrof</b>. Den kan skapa organiska föreningar med hjälp av solljus och koldioxid. Växten bildar alltså sina <b>energirika organiska molekyler</b> själv, eftersom den kan utföra <b>fotosyntes</b>.</p>
    <div class="box key"><p><b>Fotoautotrof</b> = kan skapa organiska föreningar med hjälp av solljus och koldioxid. Det är det som skiljer en växt från ett djur. {{src:s. 244}}</p></div>
    <p>Växten har ändå samma grundläggande behov som ett djur, eftersom även den måste överleva som flercellig organism. Det här behöver växten enligt boken.</p>
    <ul>
      <li><b>Energirika organiska molekyler.</b> Dem bildar den själv genom fotosyntesen.</li>
      <li><b>Vatten, koldioxid och solljus.</b></li>
      <li><b>Kväve, fosfor och andra mineraler</b> från omgivningen. Dessa ämnen kallas tillsammans för <b>närsalter</b>. {{prov}}</li>
      <li>Förmåga att <b>lagra energi, transportera ämnen och reproducera sig</b>.</li>
    </ul>
    <div class="box lek"><p>Läraren kallar närsalterna också <b>mineralämnen</b>. De är <b>oorganiska ämnen</b>, medan kolhydrater, lipider och proteiner är organiska ämnen, alltså kolföreningar ({{go:k1.kemi|livets kemi i K1}}). {{lek:Bi2 bild 3}}</p></div>
    <p>Precis som hos djur har olika <b>anpassningar</b> utvecklats genom det naturliga urvalet för att klara alla de här uppgifterna. Liksom djur byggs växter upp av celler med olika specialiseringar och funktioner, och cellerna bildar olika typer av <b>vävnader</b>. {{prov}}</p>
    <div class="box lek"><p>Läraren bygger vidare på samma tanke. Flera likadana celler bildar en vävnad, och olika vävnader bildar tillsammans ett organ. Hos flercelliga organismer är cellerna <b>specialister</b>, eftersom det effektiviserar energin. Encelliga organismers celler är <b>generalister</b> som gör alla funktioner själva. {{lek:Bi2 bild 18–20}}</p></div>
    <div class="box fab"><p>Den gröna fabriken har en egen solcellspark. Energin, alltså de energirika organiska molekylerna, tillverkar den själv av solljus och koldioxid. Men råvarorna kväve och fosfor (närsalterna) måste den ändå hämta in utifrån, från marken.</p></div>
    <h3>Från vatten till land</h3>
    <p>Alla växter härstammar från <b>vattenlevande grönalger</b>. De har fått anpassningar som gör det möjligt att leva på land.</p>
    <p><b>Mossorna</b> är de enklast uppbyggda växterna. De saknar både rötter och <b>ledningsvävnad</b> för transport av vatten och näringsämnen. Därför tar mossorna inte upp vatten eller närsalter från marken. De tar dem från det vatten som hamnar på bladen, till exempel regn.</p>
    <p>För att kunna fästa sig i marken har mossorna så kallade <b>rhizoider</b>. De ser ut som rötter, men de har bara en förankrande funktion. Rhizoiderna kan inte suga upp vatten och närsalter.</p>
    <p><b>Kärlväxter</b> har anpassats vidare till ett liv på land. De har både rötter och en speciell vävnad för transport inne i växten, och därför kan de ta upp vatten och närsalter ur marken. Därför klarar de torka i varma och soliga miljöer bättre.</p>
    <p>De tidigaste kärlväxterna, <b>ormbunks- och lummerväxter</b>, förökar sig med <b>sporer</b>. Från dem har <b>fröbildande växter</b> utvecklats. Bland dem finns dels de <b>gömfröiga</b>, blommande växterna, dels de <b>nakenfröiga</b>, till exempel barrträd.</p>
    <div class="lfig-h" data-fig="vaxter"></div>
    <table class="cmp"><tr><th></th><th>Mossor</th><th>Kärlväxter</th></tr>
      <tr><td>Rötter och ledningsvävnad</td><td>saknar båda</td><td>har båda</td></tr>
      <tr><td>Vatten och närsalter</td><td>från vattnet som hamnar på bladen, t.ex. regn</td><td>ur marken</td></tr>
      <tr><td>Fäster sig med</td><td>rhizoider, som bara förankrar</td><td>rötter</td></tr>
      <tr><td>Torka</td><td>klarar torka sämre</td><td>klarar torka i varma och soliga miljöer bättre</td></tr>
      <tr><td>Exempel</td><td>mossor</td><td>ormbunks- och lummerväxter (sporer), nakenfröiga och gömfröiga (frön)</td></tr></table>
    <div class="box trick"><p>Fyra steg upp på land: <b>Alg → Mossa → Ormbunke → Fröväxt</b>. Från ormbunken och framåt finns rötter och ledningsvävnad (kärlväxter). Bara fröväxterna har frön.</p><p><b>N</b>akenfröiga har <b>n</b>ålar (barrträd). Gömfröiga är de blommande.</p></div>
    <div class="box trap"><p>Rhizoider ser ut som rötter men kan inte suga upp vatten och närsalter. De förankrar bara mossan.</p><p>Ormbunks- och lummerväxter är kärlväxter, men de förökar sig med sporer. Frön har först de fröbildande växterna.</p><p>Fotoautotrof betyder att växten bildar sina organiska molekyler själv. Den behöver ändå vatten, koldioxid, solljus och närsalter utifrån.</p></div>
    <div class="box link"><p>Fotoautotrofa finns också bland bakterierna. Cyanobakterier använder solljus som energikälla, medan kemoautotrofa bakterier använder oorganiska föreningar ({{go:k8.naring|bakteriernas näring i K8}}).</p></div>
    <div class="x" data-x="tfVaxten"></div>
  `},
  {id:"vaxtcellen",h:"Växtcellens uppbyggnad",nav:"Växtcellen",src:"s. 244–245 · PPT Bi2 bild 20–26",prov:true,html:`
    <p>En växtcell är i stort sett uppbyggd på samma sätt som en djurcell. Båda är <b>eukaryota</b> celler, alltså celler med cellkärna ({{go:k2.celltyper|tre sorters celler i K2}}). Men det finns några viktiga skillnader.</p>
    <div class="box key"><p>Växtcellen har, till skillnad från djurcellen, en <b>cellvägg</b>, en <b>stor vakuol</b> och <b>kloroplaster</b>. Den saknar de <b>lysosomer</b> och <b>centrioler</b> som finns i djurcellen. {{prov}} {{src:s. 244}}</p></div>
    <div class="lfig-h" data-fig="vaxtcell"></div>
    <p>Bilden i boken har frågan <i>"Hur skiljer sig denna växtcell från en djurcell?"</i> Svaret är rutan ovan. Allt annat i bilden har båda cellerna: cellmembran, cytoplasma, kärna med kärnmembran och DNA, ribosomer, ER med och utan ribosomer, golgiapparat och mitokondrier. {{prov}}</p>
    <table class="cmp"><tr><th>Del</th><th>Växtcell</th><th>Djurcell</th></tr>
      <tr><td>Cellvägg</td><td>ja, av cellulosa</td><td>nej</td></tr>
      <tr><td>Vakuol</td><td>stor, upp till 90 % av volymen</td><td>kan finnas, men mindre och med andra funktioner</td></tr>
      <tr><td>Kloroplaster</td><td>ja, i de gröna delarna</td><td>nej</td></tr>
      <tr><td>Lysosomer</td><td>nej, vakuolen gör ungefär samma jobb</td><td>ja</td></tr>
      <tr><td>Centrioler</td><td>nej</td><td>ja</td></tr>
      <tr><td>Mitokondrier</td><td>ja</td><td>ja</td></tr>
      <tr><td>Cellmembran, kärna, ribosomer, ER, golgiapparat</td><td>ja</td><td>ja</td></tr></table>
    <div class="box trick"><p><b>Tre in, två ut.</b> Växtcellen bygger till <b>mur, tank och solkraftverk</b> (cellvägg, vakuol, kloroplaster) och plockar bort <b>sopförbränningen och centriolerna</b> (lysosomer, centrioler).</p></div>
    <div class="box fab"><p>Växtcellen är <b>den gröna fabriken</b>. Den har alla avdelningar från djurfabriken: ledningskontoret med ritningarna (kärnan med DNA), arbetsbänkarna (ribosomerna), det löpande bandet (ER), packcentralen (golgiapparaten) och kraftverket (mitokondrien). Dessutom har den en mur (cellväggen), en vattentank (vakuolen) och ett solkraftverk (kloroplasterna). Sopförbränningen (lysosomerna) saknas, eftersom vattentanken har tagit över det jobbet.</p></div>
    <div class="box trap"><p>Växtceller har <b>mitokondrier</b> också. Kloroplasten ersätter inte mitokondrien, och båda syns i bokens bild.</p><p>Växtcellen har både cellvägg och cellmembran. Cellmembranet ligger <b>innanför</b> cellväggen.</p><p>Djurceller kan också ha vakuoler, men de är små och fyller andra funktioner.</p></div>
    <div class="box lek"><p>Lärarens lista över växtcellens delar {{lek:Bi2 bild 25}}</p><ul>
      <li><b>Cellmembran</b> = yttre skydd som släpper in och ut vissa ämnen.</li>
      <li><b>Cellvägg</b> = stödjande vägg av cellulosa (finns i växtceller).</li>
      <li><b>Cellkärna</b> = innehåller gener (arvsanlagen) som består av DNA.</li>
      <li><b>Cellplasma</b> = innehåller specialiserade celldelar samt mycket vatten. Det är samma sak som bokens cytoplasma.</li>
      <li><b>Kloroplast</b> = innehåller klorofyll som gör att växterna kan utnyttja ljusenergi (fotosyntes) från solen. Finns hos växter och alger.</li>
      <li><b>Mitokondrie</b> = cellens kraftverk. Energirik näring förbränns (<b>cellandningen</b>).</li>
      <li><b>Endoplasmatiska nätverket (ER)</b> = ett membransystem som transporterar kemiska föreningar.</li>
      <li><b>Ribosomer</b> = här tillverkar cellen proteiner.</li>
      <li><b>Vakuol</b> = en vätskefylld blåsa (<b>cellsaftrum</b>).</li></ul>
      <p>På lärarens bild 23 står "Vacuol", "Golgieapparat" och "Kloroplast m. klorofyll". Stava som boken: vakuol och golgiapparat.</p></div>
    <div class="box diff"><p><b>Boken:</b> växtcellen har både cellvägg och cellmembran, och cellmembranet ligger innanför cellväggen (bilden s. 245). Det yttersta lagret är alltså cellväggen. <b>Läraren:</b> "Cellmembran = Yttre skydd som släpper in och ut vissa ämnen", samma mening som för djurcellen. {{diff:Bi2 bild 25}}</p><p>Svara så här på provet: cellmembranet släpper in och ut vissa ämnen, men i växtcellen ligger cellväggen utanför det.</p></div>
    <div class="box link"><p>Djurcellens organeller går du igenom i {{go:k4.djurcellen|K4 Organellerna}}. Jämförelsen mellan bakterie, djurcell och växtcell finns i {{go:k2.jamfor|K2}}.</p></div>
    <div class="x" data-x="sortCell"></div>
  `},
  {id:"cellvaggen",h:"Cellväggen",nav:"Cellväggen",src:"s. 244–245 · PPT Bi2 bild 7, 25",prov:true,html:`
    <p>Växtcellen har en <b>extracellulär matrix</b> i form av en <b>cellvägg</b> som består av <b>cellulosa</b>. {{prov}}</p>
    <p>Cellulosa är en <b>polysackarid</b>, en lång kedja av många sockerringar ({{go:k1.kolhydrater|kolhydraterna i K1}}). Människan kan inte bryta ner cellulosa. Därför kallas den <b>kostfiber</b>, och den är ändå nyttig att äta, eftersom den motverkar förstoppning och ger mättnadskänsla. {{lek:Bi2 bild 7}}</p>
    <h3>Vad cellväggen gör</h3>
    <ul>
      <li>Den ger växtcellen dess <b>form</b> och <b>skyddar</b> den.</li>
      <li>Cellväggarna hos växtens celler hänger ihop med varandra och bildar ett <b>nätverk</b>, med "hål" för var och en av växtens celler. Därför ger cellväggarna <b>stadga</b> åt växten, som behövs för att den ska kunna stå upprätt.</li>
      <li>Den hindrar cellen från att <b>spricka</b> när den tar upp vatten från omgivningen.</li>
    </ul>
    <div class="box key"><p>En växtcell som placeras i en <b>hypoton lösning</b> (t.ex. destillerat vatten) spricker inte, till skillnad från en djurcell. Det beror på att cellväggen håller emot. {{src:s. 245}}</p></div>
    <h3>Hur cellväggen är byggd</h3>
    <p>Cellväggen kan se olika ut hos olika växter, men grunden är densamma.</p>
    <ol class="chainv"><li><b>Cellulosafibriller</b></li><li>bildar tillsammans tjockare <b>fibrer</b>,</li><li>som är inbäddade i en <b>matrix av andra polysackarider och proteiner</b>.</li></ol>
    <h3>Plasmodesmata</h3>
    <p>För att cellerna ska kunna kommunicera med varandra innehåller cellväggen <b>cellmembranklädda kanaler fyllda med cytoplasma</b>. Kanalerna kallas <b>plasmodesmata</b>, och genom dem kan ämnen föras över från cell till cell.</p>
    <div class="lfig-h" data-fig="vagg"></div>
    <div class="box trick"><p>Cellväggen är <b>armerad betong</b>. Cellulosafibrerna är armeringsjärnen, och matrixen av polysackarider och proteiner är betongen runt omkring.</p></div>
    <div class="box fab"><p>Cellväggen är <b>muren runt den gröna fabriken</b>. Murarna hos grannfabrikerna sitter ihop, och tillsammans håller de upp hela växten. Plasmodesmata är <b>gångtunnlar genom muren</b>. Tunnlarna är klädda med samma tullgräns som fabriken (cellmembranet) och fyllda med cytoplasma, så att grannarna kan skicka ämnen direkt till varandra.</p></div>
    <div class="box trap"><p>Cellmembranet ligger innanför cellväggen. Växtcellen har båda.</p><p>Plasmodesmata är inga tomma hål. De är kanaler klädda med cellmembran och fyllda med cytoplasma.</p><p>Cellväggen stoppar inte vattnet. Vatten går in i cellen, men väggen hindrar cellen från att spricka.</p></div>
    <div class="box link"><p>Djurceller saknar cellvägg. De har i stället en extracellulär matrix av bland annat glykoproteiner och kollagen ({{go:k3.ecm|ECM i K3}}). Växtens cellvägg är också en extracellulär matrix, fast av cellulosa. Vad som händer när vatten går in i cellen prövar du i simuleringen under {{go:k13.vakuolen|Vakuolen}}.</p></div>
    <div class="box tr" data-t="vagg" data-h="Cellulosa eller peptidoglykan">Växtens cellvägg är av cellulosa. Bakteriens cellvägg är av peptidoglykan, långa kolhydratkedjor som är korsbundna med peptider ({{go:k8.byggnad|bakteriens byggnad i K8}}). Djurceller har ingen cellvägg alls.</div>
    <div class="box tr" data-t="vagg" data-h="Penicillin och väggbygget">Penicillin blockerar ett enzym som bakterier behöver för att bygga sin cellvägg av peptidoglukan ({{go:k11.verkan|K11}}). Våra celler har ingen cellvägg, och därför har penicillin inget väggbygge att stoppa hos oss.</div>
    <div class="x" data-x="tfVagg"></div>
  `},
  {id:"vakuolen",h:"Vakuolen",nav:"Vakuolen",src:"s. 245–246 · s. 33 · PPT Bi2 bild 23–25",prov:true,html:`
    <p>Något annat som skiljer växtceller från djurceller är deras <b>vakuol</b>. Även djurceller kan innehålla vakuoler, men de är inte lika stora som hos växter och fyller andra funktioner.</p>
    <div class="box key"><p>Växtcellens vakuol kan uppta <b>upp till 90 %</b> av cellens volym. Den bildas hos <b>äldre celler</b> genom att många små vakuoler smälter samman. {{prov}} {{src:s. 245}}</p></div>
    <p>Därför kan en växtcell öka i storlek utan att behöva öka mängden cytoplasma särskilt mycket. Det mesta av den nya volymen är vakuol.</p>
    <div class="lfig-h" data-fig="vakbildas"></div>
    <h3>Vad finns i vakuolen?</h3>
    <ul>
      <li>En <b>vattenlösning med många lösta joner</b>.</li>
      <li><b>Enzymer som kan spjälka makromolekyler</b>. Därför fyller vakuolen ungefär samma funktion som djurcellens <b>lysosomer</b> ({{go:k4.lysosomer|lysosomen i K4}}), som växtcellen saknar.</li>
    </ul>
    <div class="box lek"><p>Läraren kallar vakuolen "en vätskefylld blåsa (<b>cellsaftrum</b>)". På lärarens bild fyller vakuolen nästan hela cellen, och cytoplasman med organellerna ligger som ett tunt lager längs väggen. {{lek:Bi2 bild 24–25}}</p></div>
    <div class="lfig-h" data-fig="bi2cell"></div>
    <h3>Turgor</h3>
    <p>En viktig funktion hos vakuolen är att den <b>anpassar sin storlek</b>. Då fyller cellen hela tiden hela det utrymme som cellväggen ger den, oavsett hur mycket cytoplasma och andra organeller den behöver.</p>
    <ol class="chainv"><li>Vakuolen fyller ut cellen.</li><li>Den hjälper cellen att upprätthålla ett tryck mot cellväggarna, så kallat <b>turgor</b>.</li><li>Turgor gör att växten kan stå upprätt, trots att den saknar skelett och muskler.</li></ol>
    <p>När växten drabbas av <b>vattenbrist</b> slokar den, eftersom vakuolen inte innehåller tillräckligt mycket vatten. Boken visar röda tulpaner som hänger med huvudena, och bildtexten är <i>"Tomma vakuoler."</i> {{prov}}</p>
    <div class="w" data-w="k13Turgor"></div>
    <div class="box diff"><p><b>Boken:</b> turgor gör att växten kan stå upprätt "trots att den saknar skelett och muskler" (s. 246). <b>Läraren:</b> vakuolen "utgör tillsammans med cellväggarna växternas skelett". {{diff:Bi2 bild 25}}</p><p>Båda menar samma sak. Läraren använder ordet skelett bildligt om det som håller växten uppe. Skriv som boken på provet: växten saknar skelett, och den står upprätt tack vare turgor mot cellväggarna.</p></div>
    <div class="box trick"><p>Turgor är som luften i en <b>cykelslang</b>. Slangen (vakuolen) trycker mot däcket (cellväggen) inifrån, och däcket håller emot. Utan luft blir cykeln slak, och utan vatten slokar tulpanen.</p></div>
    <div class="box fab"><p>Vakuolen är <b>vattentanken</b> i den gröna fabriken. Den fylls så att fabriken alltid är uppblåst mot muren. Den är också <b>återvinningscentralen</b>, eftersom den har tagit över sopförbränningens enzymer.</p></div>
    <div class="box trap"><p>Turgor är trycket <b>inifrån mot cellväggen</b>. Vakuolen skapar trycket, och cellväggen håller emot.</p><p>Växten slokar för att vakuolen har för lite vatten. Cellväggen är hel.</p><p>Den stora vakuolen finns hos <b>äldre</b> celler och bildas när många små vakuoler smälter samman.</p></div>
    <h3>Osmos i växtcellen och i den röda blodkroppen</h3>
    <p>Vatten tar sig in i och ut ur celler genom <b>osmos</b>, vattnets diffusion över ett semipermeabelt membran ({{go:k5.osmos|osmos i K5}}). Vattnet diffunderar från hög vattenkoncentration till låg, och en lösning med mycket löst ämne har lägre vattenkoncentration än rent vatten.</p>
    <p>En röd blodkropp i destillerat vatten, en <b>hypoton lösning</b>, tar upp vatten, sväller och kan till slut spricka (s. 33). En växtcell i samma lösning tar också upp vatten, men den spricker inte, eftersom cellväggen hindrar det (s. 245).</p>
    <div class="w" data-w="k13Osmos"></div>
    <div class="box tr" data-t="osmos" data-h="Blodkropp eller växtcell">I en hypoton lösning går vatten in i cellen genom osmos. Den röda blodkroppen har bara sitt cellmembran och kan spricka. Växtcellen har en cellvägg som tar emot trycket, och därför får den turgor i stället.</div>
    <div class="box extra"><p>Boken kopplar inte ihop vakuolens joner med osmos på s. 245–246. Men eftersom vakuolen innehåller många lösta joner har den lägre vattenkoncentration än rent vatten, och därför drar den till sig vatten genom osmos. Det fyller vakuolen och ger turgor.</p><p>Vad som händer med en växtcell i en <b>hyperton lösning</b> tar boken inte heller upp. Vatten går ut, vakuolen krymper och cellmembranet kan dra sig bort från cellväggen. Det kallas <b>plasmolys</b>.</p></div>
    <div class="x" data-x="chainVak"></div>
    <div class="x" data-x="fixVak"></div>
  `},
  {id:"kloroplasten",h:"Kloroplasten och andra plastider",nav:"Kloroplasten",src:"s. 246–247 · PPT Bi2 bild 7, 23, 25",prov:true,html:`
    <p><b>Kloroplasterna</b> tillhör en grupp organeller som kallas <b>plastider</b>. Plastider finns bara i celler hos växter och alger. Kloroplasterna innehåller <b>klorofyll</b> och finns i alla de celler som ingår i de gröna delarna av växten eller algen. {{prov}}</p>
    <div class="box key"><p>Kloroplasten innehåller klorofyll, som gör att växterna kan utnyttja ljusenergi från solen (<b>fotosyntes</b>). Kloroplaster finns hos växter och alger. {{prov}} {{src:s. 246–247 · Bi2 bild 23, 25}}</p></div>
    <h3>Kloroplastens byggnad</h3>
    <ul>
      <li>Kloroplasten har, liksom mitokondrien, <b>dubbla membran</b>, ett yttermembran och ett innermembran.</li>
      <li>Innanför de två membranen finns packar av platta membranblåsor, så kallade <b>tylakoider</b>.</li>
      <li>Varje packe av tylakoider kallas för ett <b>granum</b>.</li>
      <li>Inuti tylakoiderna finns <b>klorofyllmolekylerna</b>, som fångar in solljuset.</li>
      <li>Tylakoiderna är omgivna av en vattenlösning som kallas <b>stroma</b>. Den kan jämföras med mitokondriens <b>matrix</b>.</li>
      <li>I stroma finns, precis som i mitokondrien, en <b>ringformad DNA-molekyl</b>, <b>ribosomer</b> och <b>enzymer</b>.</li>
    </ul>
    <div class="lfig-h" data-fig="kloroplast"></div>
    <div class="box trick"><p>Ett <b>granum är en hög pannkakor</b>. Varje pannkaka är en tylakoid med klorofyll i, och sirapen runt omkring är stroma.</p></div>
    <div class="x" data-x="orderZoom"></div>
    <h3>Varför växter är gröna</h3>
    <p>Det finns olika typer av klorofyllmolekyler, och de fångar in ljus av olika våglängder. <b>Violett, blått och rött ljus absorberas</b>, medan <b>grönt ljus reflekteras</b> i stället för att absorberas. Det är därför vi uppfattar växter som gröna.</p>
    <div class="w" data-w="k13Ljus"></div>
    <h3>Egen förökning och endosymbios</h3>
    <p>DNA-molekylen i kloroplasten kan <b>replikeras</b>, och kloroplasterna kan <b>dela sig</b>. På så sätt kan de sköta sin egen reproduktion.</p>
    <p>Kloroplasten har dubbla membran precis som mitokondrien, och precis som för mitokondrien tror man att kloroplasten uppkom genom <b>endosymbios</b>. Enligt endosymbiosteorin var mitokondrien en bakterie som slukades av den eukaryota cellens föregångare och började leva i symbios med den (s. 27). Samma tanke gäller kloroplasten.</p>
    <table class="cmp"><tr><th></th><th>Kloroplast</th><th>Mitokondrie</th></tr>
      <tr><td>Membran</td><td>dubbla, ytter- och innermembran</td><td>dubbla, yttre och inre (det inre är veckat)</td></tr>
      <tr><td>Inuti</td><td>tylakoider i packar (granum) med klorofyll</td><td>veckat inre membran där ATP bildas</td></tr>
      <tr><td>Vätskan</td><td>stroma</td><td>matrix</td></tr>
      <tr><td>Eget DNA, ribosomer, enzymer</td><td>ja, ringformat DNA</td><td>ja, ringformat DNA</td></tr>
      <tr><td>Uppkomst</td><td colspan="2">man tror att båda uppkom genom endosymbios</td></tr>
      <tr><td>Uppgift</td><td>fångar in solljus (fotosyntes)</td><td>kraftverket, energirik näring förbränns (cellandningen)</td></tr>
      <tr><td>Finns i</td><td>växter och alger, i de gröna delarna</td><td>både djurceller och växtceller</td></tr></table>
    <div class="box tr" data-t="endo" data-h="Kloroplasten, den andra före detta bakterien">Bevisen för att mitokondrien en gång var en bakterie är två membran, eget ringformat DNA och ribosomer av bakterietyp ({{go:k4.mitokondrien|mitokondrien i K4}}). Kloroplasten har samma kännetecken, alltså dubbla membran, en egen ringformad DNA-molekyl och ribosomer, och den kan dessutom dela sig själv.</div>
    <div class="box link"><p>I mikrobiologin sa läraren att alla algers förmåga till fotosyntes härstammar från <b>cyanobakterierna</b> {{lek:Mikroorganismer bild 12}}. Cyanobakterier är bakterier som gör fotosyntes och som förr kallades blågröna alger ({{go:k8.ekosystem|K8}}).</p></div>
    <div class="x" data-x="clozeKloro"></div>
    <h3>Kloroplasterna flyttar sig</h3>
    <p>Kloroplasterna transporteras, som många andra organeller, med hjälp av <b>mikrotubuli</b>. Därför kan de förflyttas till den del av cellen som träffas av mest ljus. Om man tittar på ett blad i ett vanligt ljusmikroskop kan man se den här transporten.</p>
    <div class="w" data-w="k13Flytt"></div>
    <div class="box link"><p>Mikrotubuli är en av cellskelettets tre sorters proteintrådar, fabrikens järnväg ({{go:k4.cellskelettet|cellskelettet i K4}}). Där såg du att organeller och vesiklar kan dras längs trådarna med hjälp av motorproteiner. Här dras solkraftverken mot ljuset.</p></div>
    <h3>Andra plastider</h3>
    <p>Ett annat exempel på plastider är <b>leukoplaster</b>. De är färglösa organeller som lagrar <b>stärkelse</b>. De finns framför allt i de delar av växten som används för att lagra energi, till exempel <b>potatisens stamknölar</b>. {{prov}}</p>
    <p>En annan typ av plastider, <b>kromoplaster</b>, innehåller de pigment som ger blommor och frukter, och även rötter och blad, <b>orange eller röd färg</b>.</p>
    <div class="lfig-h" data-fig="plastider"></div>
    <table class="cmp"><tr><th>Plastid</th><th>Vad den gör</th><th>Exempel</th></tr>
      <tr><td>Kloroplast</td><td>innehåller klorofyll och fångar in ljusenergi</td><td>alla celler i växtens gröna delar</td></tr>
      <tr><td>Leukoplast</td><td>färglös, lagrar stärkelse</td><td>delar som lagrar energi, t.ex. potatisens stamknölar</td></tr>
      <tr><td>Kromoplast</td><td>innehåller pigment som ger orange eller röd färg</td><td>blommor och frukter, även rötter och blad</td></tr></table>
    <div class="box lek"><p>Läraren tar upp <b>stärkelse</b> och <b>cellulosa</b> som två polysackarider. Stärkelse är ett av våra viktigaste näringsämnen och finns till exempel i potatis. Cellulosan sitter i cellväggarna och kan inte brytas ner av människan. {{lek:Bi2 bild 7}}</p><p>Att stärkelsen i potatisen lagras i leukoplaster står i boken. {{prov}}</p></div>
    <div class="box trick"><p><b>L</b>eukoplast = <b>l</b>ager (stärkelse i potatisen). <b>K</b>romoplast = <b>k</b>ulör (orange och rött). <b>Kl</b>oroplast = <b>kl</b>orofyll.</p></div>
    <div class="box fab"><p>Kloroplasten är <b>solkraftverket</b>. Tylakoiderna är solpanelerna, staplade i höga hus (granum), och stroma är gården runt husen. Leukoplasten är <b>förrådet</b> där stärkelsen lagras, och kromoplasten är <b>målaravdelningen</b> som färgar blommor och frukter.</p></div>
    <div class="box trap"><p>Klorofyllet sitter <b>inuti tylakoiderna</b>, inte i stroma.</p><p><b>Grönt ljus reflekteras.</b> Det absorberas inte.</p><p>Tylakoid = en platt membranblåsa. Granum = en packe tylakoider.</p><p>Stroma hör till kloroplasten och matrix till mitokondrien.</p><p>Leukoplaster är plastider fast de är färglösa. Kloroplaster finns bara i de gröna delarna, så i potatisknölen lagras stärkelsen i leukoplaster.</p></div>
    <div class="box tr" data-t="atp" data-h="Från solljus till ATP">Växten bildar sina energirika organiska molekyler själv genom fotosyntesen (s. 244), och det är klorofyllet i kloroplasterna som gör att den kan utnyttja ljusenergin (Bi2 bild 25). Sedan förbränns energirik näring i mitokondrierna (cellandningen), där det mesta av cellens ATP bildas ({{go:k6|ATP i K6}}). Växtcellen behöver alltså både solkraftverket och kraftverket.</div>
    <div class="box tr" data-t="membran" data-h="Membran i den gröna fabriken">Kloroplasten har två membran, och tylakoiderna är platta membranblåsor. Plasmodesmata är klädda med cellmembran, så att grannceller hänger ihop genom väggen. Membranen avgränsar rum även i den gröna fabriken ({{go:k3|K3 Cellmembranet}}).</div>
    <div class="x" data-x="matchKloro"></div>
    <div class="x" data-x="whoVaxt"></div>
  `}
  ],
  figs:{
    vaxter:{vb:"0 0 470 282",svg:figVaxter(),
      labels:[["kärlväxter: rötter och|ledningsvävnad",332,38,null,null,"m"],["fröbildande växter",384,88,null,null,"m"],
        ["grönalger",48,236,null,null,"m"],["mossor",132,236,null,null,"m"],["rhizoider",160,212,146,201,"s"],["ormbunks- och|lummerväxter",244,236,null,null,"m"],["nakenfröiga",348,236,null,null,"m"],["gömfröiga",432,236,null,null,"m"]],
      parts:{alg:{t:"Grönalger",d:"Alla växter härstammar från vattenlevande grönalger. Därifrån har växterna fått anpassningar för att leva på land."},
        moss:{t:"Mossor",d:"De enklast uppbyggda växterna. De saknar rötter och ledningsvävnad, och därför tar de vatten och närsalter från vattnet som hamnar på bladen, t.ex. regn. Rhizoiderna förankrar bara."},
        orm:{t:"Ormbunks- och lummerväxter",d:"De tidigaste kärlväxterna. De har rötter och en speciell vävnad för transport, så de tar vatten och närsalter ur marken. De förökar sig med sporer."},
        nak:{t:"Nakenfröiga",d:"Fröbildande kärlväxter, till exempel barrträd."},
        gom:{t:"Gömfröiga",d:"Fröbildande kärlväxter som blommar. Boken säger inte vilken av de två fröväxtgrupperna som kom först."}},
      cap:"Växtgrupperna från vatten till land, efter bokens text och mossbilden på s. 244 (\"Mossan har inga rötter, men kan fästa till underlaget med hjälp av s.k. rhizoider.\"). Tryck på en växtgrupp.",src:"Bok s. 244"},
    vaxtcell:{vb:"0 0 480 416",svg:figVaxtcell(),
      labels:[["cellvägg",100,52,114,70,"e"],["cellmembran",100,96,118,112,"e"],["cytoplasma",100,140,135,150,"e"],["vakuol",100,182,196,168,"e"],["ribosomer",100,232,137,236,"e"],["kloroplast",100,282,136,284,"e"],["mitokondrie",100,330,163,321,"e"],
        ["kärna",392,236,322,266,"s"],["kärnmembran",382,264,338,280,"s"],["DNA",392,294,298,298,"s"],["ER med|ribosomer",392,330,351,312,"s"],
        ["golgiapparat",222,404,222,320,"m"],["ER",290,404,276,339,"m"]],
      parts:{vagg:{t:"Cellväggen",d:"Växtcellens extracellulära matrix, av cellulosa. Den ger form, skydd och stadga och hindrar cellen från att spricka när den tar upp vatten. Djurceller saknar cellvägg.",go:"k13.cellvaggen"},
        mem:{t:"Cellmembranet",d:"Ligger innanför cellväggen och släpper in och ut vissa ämnen. Både växt- och djurceller har cellmembran.",go:"k3.funktion"},
        cyto:{t:"Cytoplasman",d:"Vätskan innanför cellmembranet, där organellerna ligger. Läraren kallar den cellplasma. Den stora vakuolen gör att cytoplasman ofta bara är ett tunt lager."},
        vak:{t:"Vakuolen",d:"Upp till 90 % av cellens volym. En vattenlösning med lösta joner och enzymer som spjälkar makromolekyler. Den ger turgor.",go:"k13.vakuolen"},
        rib:{t:"Ribosomerna",d:"Här tillverkar cellen proteiner. De sitter fria i cytoplasman och på ER.",go:"k4.ribosomer"},
        klor:{t:"Kloroplasterna",d:"Solkraftverken. De innehåller klorofyll som fångar in solljus. Finns i alla celler i växtens gröna delar.",go:"k13.kloroplasten"},
        mito:{t:"Mitokondrierna",d:"Kraftverken. Växtcellen har mitokondrier precis som djurcellen, och här förbränns energirik näring (cellandningen).",go:"k4.mitokondrien"},
        golgi:{t:"Golgiapparaten",d:"Packcentralen som tar emot proteiner från ER, ändrar dem och skickar iväg dem i blåsor.",go:"k4.golgi"},
        er:{t:"ER",d:"Endoplasmatiska nätverket utan ribosomer. Ett membransystem som transporterar kemiska föreningar.",go:"k4.er"},
        rer:{t:"ER med ribosomer",d:"Endoplasmatiska nätverket med ribosomer på membranet. Proteinerna som byggs här förs in i ER.",go:"k4.er"},
        karna:{t:"Kärnan",d:"Ledningskontoret med ritningarna. Den innehåller nästan all arvsmassa, men kloroplasten och mitokondrien har eget DNA.",go:"k4.karnan"},
        kmem:{t:"Kärnmembranet",d:"Kärnans hölje. Det skiljer kärnans innehåll från cytoplasman.",go:"k4.karnan"},
        dna:{t:"DNA",d:"Arvsmassan i kärnan. Läraren: cellkärnan innehåller gener (arvsanlagen) som består av DNA."}},
      cap:"Bokens växtcell med alla 13 etiketter. Bildtext i boken: \"Hur skiljer sig denna växtcell från en djurcell?\" Tryck på en del för att läsa om den.",src:"Bok s. 245 · Bi2 bild 23–24"},
    vagg:{vb:"0 0 470 396",svg:figVagg(),
      labels:[["cellvägg",8,234,12,200,"s"],["cellmembran",128,234,96,196,"m"],["plasmodesmata",235,234,235,167,"m"],["cytoplasma",362,234,300,186,"m"],["vakuol",118,117,null,null,"m"],
        ["cellulosafibrill",74,354,74,305,"m"],["tjockare fiber",222,354,222,314,"m"],["matrix av andra|polysackarider|och proteiner",387,354,400,326,"m"]],
      parts:{vagg:{t:"Cellväggen",d:"Cellväggarna hänger ihop i ett nätverk med ett \"hål\" för varje cell. Därför ger de stadga åt hela växten."},
        mem:{t:"Cellmembranet",d:"Ligger innanför cellväggen. Det klär också insidan av plasmodesmata."},
        cyto:{t:"Cytoplasman",d:"Fyller plasmodesmata, så att grannarnas cytoplasma hänger ihop genom väggen."},
        vak:{t:"Vakuolen",d:"Den stora vattentanken. Den trycker cellen mot väggen (turgor).",go:"k13.vakuolen"},
        plas:{t:"Plasmodesmata",d:"Cellmembranklädda kanaler fyllda med cytoplasma. Genom dem kan cellerna kommunicera, och ämnen kan föras från cell till cell."},
        fib:{t:"Väggens byggstenar",d:"Cellulosafibriller bildar tillsammans tjockare fibrer, som är inbäddade i en matrix av andra polysackarider och proteiner."}},
      cap:"Två grannceller med gemensam vägg och plasmodesmata. Nederst cellväggens uppbyggnad, från fibrill till vägg. Ritad efter bokens text på s. 244–245.",src:"Bok s. 244–245"},
    vakbildas:{vb:"0 0 470 224",svg:figVakBildas(),
      labels:[["ung cell",81,24,null,null,"m"],["cellen blir äldre",235,24,null,null,"m"],["äldre cell",389,24,null,null,"m"],["små vakuoler",81,198,62,149,"m"],["smälter samman",235,198,236,108,"m"],["stor vakuol|upp till 90 %",389,198,389,144,"m"]],
      cap:"Hos äldre celler smälter många små vakuoler samman till en stor. Förenklad bild efter bokens text på s. 245.",src:"Bok s. 245"},
    bi2cell:{vb:"0 0 470 316",svg:figBi2(),
      labels:[["mitokondrie",18,30,45,158,"s"],["cellmembran",196,30,196,77,"m"],["endoplasmatiska|nätverket",466,20,328,122,"e"],["cellkärna",388,176,345,170,"s"],["vakuol",388,214,298,206,"s"],
        ["Golgiapparaten",18,306,98,254,"s"],["cellvägg",196,306,196,269,"m"],["kloroplast",292,306,268,256,"m"]],
      cap:"Lärarens bild av växtcellen. Vakuolen fyller nästan hela cellen, och organellerna ligger i ett tunt lager cytoplasma längs väggen. Ritad efter Bi2 bild 24.",src:"PPT Bi2 bild 24"},
    kloroplast:{vb:"0 0 470 300",svg:figKloro(),
      labels:[["kloroplast",150,40,220,109,"m"],["innermembran",290,40,343,89,"m"],["yttermembran",466,40,389,90,"e"],["granum",14,180,224,160,"s"],["ribosomer",14,214,238,204,"s"],["stroma",14,250,268,226,"s"],["tylakoid",300,288,300,231,"m"],["ringformat DNA",466,288,374,224,"e"]],
      parts:{blad:{t:"Bladet",d:"Växtceller i ett blad, sedda i mikroskop. De små gröna kornen är kloroplaster."},
        ytter:{t:"Yttermembranet",d:"Kloroplastens yttre membran. Kloroplasten har dubbla membran, precis som mitokondrien."},
        inner:{t:"Innermembranet",d:"Det inre av kloroplastens två membran."},
        stroma:{t:"Stroma",d:"Vattenlösningen runt tylakoiderna. Den kan jämföras med mitokondriens matrix och innehåller en ringformad DNA-molekyl, ribosomer och enzymer."},
        gran:{t:"Granum",d:"En packe av tylakoider. Packarna är förbundna med varandra."},
        tyl:{t:"Tylakoid",d:"En platt membranblåsa. Inuti tylakoiderna finns klorofyllmolekylerna, som fångar in solljuset."},
        dna:{t:"Ringformat DNA",d:"Kloroplastens eget DNA. Det kan replikeras, och kloroplasten kan dela sig. Ett tecken på endosymbios.",go:"k4.mitokondrien"},
        rib:{t:"Ribosomer",d:"Kloroplasten har egna ribosomer i stroma, precis som mitokondrien."}},
      cap:"Från blad till kloroplast. Bildtext i boken: \"I kloroplastens tylakoider fångas ljusenergi in.\" Efter bokens figur s. 247. Ribosomer och ringformat DNA är tillagda efter texten.",src:"Bok s. 247"},
    plastider:{vb:"0 0 460 250",svg:figPlastider(),
      labels:[["kloroplast",78,26,null,null,"m"],["leukoplast",230,26,null,null,"m"],["kromoplast",382,26,null,null,"m"],["klorofyll",78,134,78,90,"m"],["lagrar stärkelse",230,134,222,97,"m"],["pigment",382,134,392,93,"m"],
        ["gröna|delar",78,222,78,198,"m"],["potatisens|stamknölar",230,222,230,197,"m"],["blommor och|frukter",382,222,374,181,"m"]],
      parts:{klo:{t:"Kloroplast",d:"Innehåller klorofyll och fångar in solljus. Finns i alla celler i växtens gröna delar."},
        leu:{t:"Leukoplast",d:"Färglös plastid som lagrar stärkelse. Finns framför allt i de delar av växten som lagrar energi, t.ex. potatisens stamknölar."},
        kro:{t:"Kromoplast",d:"Innehåller de pigment som ger blommor och frukter, och även rötter och blad, orange eller röd färg."}},
      cap:"Tre sorters plastider. Plastider finns bara i celler hos växter och alger. Förenklad bild efter bokens text på s. 246–247.",src:"Bok s. 246–247"}
  },
  ex:{
    tfVaxten:{ty:"tf",h:"Växten och växtgrupperna",src:"s. 244",items:[
      ["En växt är fotoautotrof, och därför behöver den inte ta upp något från omgivningen.",false,"Den bildar sina energirika organiska molekyler själv, men den behöver vatten, koldioxid, solljus och närsalter som kväve och fosfor."],
      ["Kväve, fosfor och andra mineraler kallas tillsammans för närsalter.",true,"Det är bokens definition på s. 244."],
      ["Mossor tar upp vatten och närsalter med sina rhizoider.",false,"Rhizoiderna har bara en förankrande funktion. Mossan tar vatten och närsalter från vattnet som hamnar på bladen, t.ex. regn."],
      ["Kärlväxter klarar torka bättre än mossor, eftersom de har rötter och en speciell vävnad för transport.",true,"Därför kan de ta upp vatten och närsalter ur marken, och därför klarar de torka i varma och soliga miljöer bättre."],
      ["Ormbunks- och lummerväxter förökar sig med frön.",false,"De tidigaste kärlväxterna förökar sig med sporer. Fröbildande växter utvecklades senare från dem."],
      ["Barrträd hör till de nakenfröiga växterna.",true,"Boken: de nakenfröiga, t.ex. barrträd. De gömfröiga är de blommande växterna."],
      ["Alla växter härstammar från vattenlevande grönalger.",true,"Därför har växterna behövt anpassningar för att kunna leva på land."]]},
    sortCell:{ty:"sort",h:"Bara växtcellen, bara djurcellen eller båda?",cats:["Bara växtcellen","Bara djurcellen","Båda"],items:[
      ["Cellvägg",0,"Av cellulosa. Djurceller saknar cellvägg."],["Stor vakuol",0,"Upp till 90 % av volymen. Djurceller kan ha vakuoler, men små."],["Kloroplaster",0,"Plastider finns bara hos växter och alger."],
      ["Leukoplaster",0,"Leukoplaster är plastider, och plastider finns bara hos växter och alger."],["Lysosomer",1,"Växtcellen saknar lysosomer. Vakuolen gör ungefär samma jobb."],["Centrioler",1,"Växtcellen saknar centrioler (s. 244)."],
      ["Mitokondrier",2,"Växtceller har också mitokondrier. Kloroplasten ersätter dem inte."],["Cellmembran",2,"Växtcellen har cellmembran innanför cellväggen."],["Ribosomer",2,"Båda tillverkar proteiner på ribosomer."],
      ["Golgiapparat",2,"Finns i bokens bild av växtcellen."],["ER med ribosomer",2,"Finns i bokens bild av växtcellen."],["Cellkärna med kärnmembran",2,"Båda är eukaryota celler."]]},
    tfVagg:{ty:"tf",h:"Cellväggen",src:"s. 244–245 · Bi2 bild 7",items:[
      ["Växtens cellvägg består av cellulosa.",true,"Cellväggen är växtcellens extracellulära matrix av cellulosa."],
      ["Cellmembranet ligger utanför cellväggen.",false,"Cellmembranet ligger innanför cellväggen."],
      ["Plasmodesmata är tomma hål i cellväggen.",false,"De är kanaler klädda med cellmembran och fyllda med cytoplasma."],
      ["En växtcell i destillerat vatten spricker inte, eftersom cellväggen hindrar det.",true,"Destillerat vatten är en hypoton lösning. En djurcell skulle spricka."],
      ["Cellväggarna hänger ihop i ett nätverk som ger växten stadga.",true,"Nätverket har ett \"hål\" för varje cell, och stadgan behövs för att växten ska stå upprätt."],
      ["Cellulosafibrillerna ligger inbäddade i en matrix av fosfolipider.",false,"Fibrerna är inbäddade i en matrix av andra polysackarider och proteiner."],
      ["Människan kan bryta ner cellulosa och använda den som näring.",false,"Människan kan inte bryta ner cellulosa. Den är kostfiber, som motverkar förstoppning och ger mättnadskänsla (Bi2 bild 7)."]]},
    chainVak:{ty:"chain",h:"Orsak och verkan i växtcellen",items:[
      {h:"Vattenbrist",steps:["Marken torkar ut","Vakuolen innehåller inte tillräckligt mycket vatten","Trycket mot cellväggarna (turgor) minskar","Växten slokar"],b:1,w:["Cellväggen går sönder","Kloroplasterna slutar fånga ljus"],why:"Boken s. 246: växten slokar eftersom vakuolen inte innehåller tillräckligt mycket vatten. Cellväggen är hel."},
      {h:"Destillerat vatten",steps:["Växtcellen hamnar i en hypoton lösning","Vatten tar sig in i cellen","Vakuolen sväller och trycker mot cellväggen","Cellväggen håller emot, så cellen spricker inte"],b:3,w:["Cellen sväller tills den spricker, precis som en röd blodkropp","Cellmembranet släpper genast ut vattnet igen"],why:"Cellväggen hindrar cellen från att spricka när den tar upp vatten (s. 245)."},
      {h:"Den stora vakuolen bildas",steps:["Den unga cellen har många små vakuoler","Cellen blir äldre","De små vakuolerna smälter samman","En stor vakuol tar upp till 90 % av volymen","Cellen blir större utan att behöva mycket mer cytoplasma"],b:2,w:["Lysosomerna växer ihop till en vakuol","Cellkärnan bildar en ny stor vakuol"],why:"Växtcellen har inga lysosomer. Den stora vakuolen bildas hos äldre celler när många små vakuoler smälter samman (s. 245)."}]},
    fixVak:{ty:"fix",h:"Hitta felen i Pelles förklaring av vakuolen",src:"s. 245–246",parts:[
      "Pelle förklarar: Växtcellens vakuol kan ta upp ",["ungefär hälften","upp till 90 %","Boken s. 245: upp till 90 % av cellens volym."]," av cellens volym. Den bildas i ",["unga celler, när vakuolen delar sig","äldre celler, när många små vakuoler smälter samman","Den stora vakuolen bildas hos äldre celler genom att många små vakuoler smälter samman."],
      ". Den innehåller en vattenlösning med många lösta joner och enzymer som kan spjälka makromolekyler. Vakuolen trycker mot cellväggen, och det trycket kallas turgor. När växten får för lite vatten slokar den, eftersom ",["cellväggen går sönder","vakuolen inte innehåller tillräckligt mycket vatten","Cellväggen är hel. Det är vakuolen som har för lite vatten, och därför minskar turgor."],"."]},
    orderZoom:{ty:"order",h:"Zooma in från blad till ljusfångare",intro:"Lägg i ordning från störst till minst.",items:["Bladet","En växtcell i bladet","En kloroplast i cellen","Ett granum, en packe tylakoider","En tylakoid, en platt membranblåsa","Klorofyllmolekylerna som fångar in solljuset"],why:"Klorofyllet sitter inuti tylakoiderna, som ligger i packar (granum) inne i kloroplasten.",src:"s. 247"},
    clozeKloro:{ty:"cloze",h:"Kloroplasten med bokens ord",bank:true,src:"s. 246–247",text:"Kloroplasterna tillhör en grupp organeller som kallas [[plastider]]. Kloroplasten har liksom mitokondrien [[dubbla|två]] membran, och man tror att den uppkom genom [[endosymbios]]. Innanför membranen finns packar av platta membranblåsor, så kallade [[tylakoider]]. Varje packe kallas ett [[granum]]. Inuti tylakoiderna finns [[klorofyllmolekylerna|klorofyll|klorofyllet|klorofyllmolekyler]], som fångar in solljuset. Violett, blått och rött ljus absorberas, medan [[grönt]] ljus reflekteras. Runt tylakoiderna finns en vattenlösning som kallas [[stroma]]. Där finns en [[ringformad|ringformat]] DNA-molekyl, ribosomer och enzymer."},
    matchKloro:{ty:"match",h:"Para ihop delen med vad den är",pairs:[["Tylakoid","platt membranblåsa med klorofyll"],["Granum","en packe tylakoider"],["Stroma","vattenlösningen runt tylakoiderna"],["Leukoplast","färglös, lagrar stärkelse"],["Kromoplast","pigment som ger orange eller röd färg"],["Mikrotubuli","flyttar kloroplasterna mot ljuset"],["Plastider","organeller som bara finns hos växter och alger"]],why:"Allt står på s. 246–247."},
    whoVaxt:{ty:"who",h:"Vem är jag i den gröna fabriken?",items:[
      {clues:["Jag kan vara upp till 90 % av cellen.","Mina enzymer gör ungefär samma jobb som lysosomer.","När jag är tom slokar tulpanen."],a:"Vakuolen",w:["Kloroplasten","Cellväggen","Lysosomen"],why:"Vakuolen ger turgor. Bildtexten till de slokande tulpanerna är \"Tomma vakuoler.\""},
      {clues:["Jag är en plastid.","Jag är färglös.","Jag lagrar stärkelse i potatisens stamknölar."],a:"Leukoplasten",w:["Kromoplasten","Kloroplasten","Vakuolen"],why:"Leukoplaster är färglösa plastider som lagrar stärkelse (s. 247)."},
      {clues:["Vi är klädda med cellmembran och fyllda med cytoplasma.","Vi går genom cellväggen.","Genom oss kan ämnen föras från cell till cell."],a:"Plasmodesmata",w:["Mikrotubuli","Tylakoider","Rhizoider"],why:"Plasmodesmata är kanalerna genom cellväggen (s. 245)."},
      {clues:["Jag finns hos de enklast uppbyggda växterna.","Jag ser ut som en rot.","Jag förankrar mossan men kan inte suga upp vatten."],a:"Rhizoider",w:["Rötter","Plasmodesmata","Sporer"],why:"Rhizoider har bara en förankrande funktion (s. 244)."},
      {clues:["Jag har eget ringformat DNA och kan dela mig.","Jag har två membran och tros ha uppkommit genom endosymbios.","Jag innehåller klorofyll."],a:"Kloroplasten",w:["Mitokondrien","Cellkärnan","Leukoplasten"],why:"Både kloroplasten och mitokondrien har två membran och eget DNA, men bara kloroplasten har klorofyll."}]}
  },
  w:{
    k13Turgor(el,api){
      el.className="wid";
      const N=["Torr jord","Lite vatten","Lagom","Mycket vatten","Välvattnad"];
      el.innerHTML=`<div class="wh"><b>Vattna tulpanen</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0;padding:6px"><svg viewBox="0 0 420 270" role="img" aria-label="En växtcell och en tulpan vid olika mycket vatten" id="k13-tg-svg"></svg></figure>
      <div><p class="small">Dra i reglaget. Gissa först hur vakuolen och tulpanen ser ut.</p>
      <label class="ctl">Vatten i marken: <span id="k13-tg-n"></span><input type="range" id="k13-tg-r" min="0" max="4" step="1" value="1"></label>
      <dl class="readout"><dt>Vatten i vakuolen</dt><dd id="k13-tg-v"></dd><dt>Turgor</dt><dd id="k13-tg-t"></dd><dt>Tulpanen</dt><dd id="k13-tg-s"></dd></dl>
      <p class="verdict" id="k13-tg-vd"></p><p id="k13-tg-why"></p></div></div>`;
      const svg=el.querySelector("#k13-tg-svg"),rg=el.querySelector("#k13-tg-r"),$=s=>el.querySelector(s);
      function draw(){const w=+rg.value;let s="";
        s+=`<rect x="14" y="30" width="196" height="214" rx="22" ${st("--c-wall-soft","--c-wall")} stroke-width="3"/><rect x="26" y="42" width="172" height="190" rx="14" ${st("--c-cyto","--c-mem")} stroke-width="3"/>`;
        const rx=30+w*13,ry=36+w*14.5;
        s+=`<ellipse cx="112" cy="137" rx="${rx}" ry="${ry}" ${st("--c-vac-soft","--c-vac")} stroke-width="2.5"/>`;
        s+=chlo(46,58,12,5.5,0)+chlo(178,58,12,5.5,0)+chlo(46,216,12,5.5,0)+chlo(178,216,12,5.5,0);
        if(w>=2){for(let k=0;k<8;k++){const a=k*Math.PI/4;const c=Math.cos(a),sn=Math.sin(a);s+=arr(112+(rx-22)*c,137+(ry-22)*sn,112+(rx-5)*c,137+(ry-5)*sn,"--c-vac",2.4,7)}}
        s+=`<text x="112" y="20" text-anchor="middle" class="lbs halo">cellvägg</text><text x="112" y="141" text-anchor="middle" class="lbs halo">vakuol</text>`;
        if(w<=1)s+=`<text x="112" y="262" text-anchor="middle" class="lbs halo">"Tomma vakuoler."</text>`;
        s+=`<rect x="236" y="244" width="178" height="18" ${st("--c-wall-soft")}/><path d="M236 244 H414" fill="none" style="stroke:var(--c-wall)" stroke-width="2"/>`;
        const d=(4-w)/4,bx=324,by=244,tx=bx+d*60,ty=92+d*100;
        s+=`<path d="M${bx} ${by} q-30 -26 -28 -84 q12 38 28 64 Z" ${st("--c-chl")} opacity=".85"/><path d="M${bx} ${by} q34 -20 36 -70 q-16 32 -36 54 Z" ${st("--c-chl")} opacity=".7"/>`;
        s+=`<path d="M${bx} ${by} Q${bx} 150 ${r1(tx)} ${r1(ty)}" fill="none" style="stroke:var(--c-chl)" stroke-width="5" stroke-linecap="round"/>`;
        s+=`<g transform="translate(${r1(tx)} ${r1(ty)}) rotate(${Math.round(d*140)})"><path d="M-15 0 C-17 -26 -7 -34 0 -34 C7 -34 17 -26 15 0 Z" ${st("--c-vir")}/><path d="M-5 -2 C-5 -20 0 -30 0 -30 C0 -30 5 -20 5 -2" fill="none" style="stroke:var(--paper)" stroke-width="1.5" opacity=".6"/></g>`;
        svg.innerHTML=s;
        $("#k13-tg-n").textContent=N[w];$("#k13-tg-v").textContent=["mycket lite","lite","en del","mycket","fullt"][w];$("#k13-tg-t").textContent=["nästan inget","lågt","medel","högt","högt"][w];$("#k13-tg-s").textContent=["slokar","slokar","börjar sloka","står upprätt","står upprätt"][w];
        const vd=$("#k13-tg-vd");vd.className="verdict "+(w<=1?"b":w===2?"m":"g");vd.textContent=w<=1?"Tulpanen slokar":w===2?"Tulpanen börjar sloka":"Tulpanen står upprätt";
        $("#k13-tg-why").innerHTML=api.tpl([
          "Marken är torr, och vakuolen innehåller inte tillräckligt mycket vatten. Därför fyller den inte ut cellen, trycket mot cellväggarna (turgor) försvinner och tulpanen slokar, precis som på bokens bild \"Tomma vakuoler.\" {{src:s. 246}}",
          "Det finns lite vatten. Vakuolen är för liten för att trycka mot cellväggarna, och därför är turgor lågt och tulpanen slokar. {{src:s. 246}}",
          "Vakuolen fyller inte riktigt hela utrymmet som cellväggen ger. Turgor är lägre, och därför börjar tulpanen sloka.",
          "Vakuolen har anpassat sin storlek så att cellen fyller hela utrymmet i cellväggen. Den trycker mot väggarna, och turgor gör att tulpanen står upprätt trots att den saknar skelett och muskler. {{src:s. 246}}",
          "Vakuolen är full och trycker hårt mot cellväggarna. Cellen spricker ändå inte, eftersom cellväggen håller emot. Därför blir det ett tryck, turgor, och tulpanen står rak. {{src:s. 245–246}}"][w])}
      rg.addEventListener("input",draw);draw();
    },
    k13Osmos(el,api){
      el.className="wid";
      const S={c:"v",s:"hypo"};
      el.innerHTML=`<div class="wh"><b>Växtcell eller röd blodkropp i tre lösningar</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0;padding:6px"><svg viewBox="0 0 420 260" role="img" aria-label="En cell i en lösning" id="k13-os-svg"></svg></figure>
      <div>${segHTML("k13-os-c","Cell",[["v","Växtcell"],["r","Röd blodkropp"]],"v")}${segHTML("k13-os-s","Lösning",[["hypo","Destillerat vatten"],["iso","Isoton"],["hyper","Stark saltlösning"]],"hypo")}
      <dl class="readout"><dt>Vattnet</dt><dd id="k13-os-w"></dd><dt>Cellen</dt><dd id="k13-os-r"></dd></dl>
      <p class="verdict" id="k13-os-vd"></p><p id="k13-os-why"></p></div></div>`;
      const svg=el.querySelector("#k13-os-svg"),$=s=>el.querySelector(s);
      const DOT=[[20,40],[44,70],[30,110],[60,150],[24,190],[50,226],[90,40],[100,200],[84,236],[330,40],[360,70],[392,100],[350,150],[396,180],[370,216],[320,236],[400,40],[340,110],[106,92],[316,90],[22,240],[402,236],[66,30],[380,30],[60,96],[372,130],[112,160],[310,178],[40,166],[400,150],[80,180],[340,200],[90,120],[384,214],[18,80],[404,80],[52,50],[356,46],[70,210],[324,212]];
      function draw(){let s="";const sol=S.s,pl=S.c==="v";
        const nd={hypo:0,iso:16,hyper:40}[sol];for(let i=0;i<nd;i++)s+=`<circle cx="${DOT[i][0]}" cy="${DOT[i][1]}" r="3" style="fill:var(--muted)" opacity=".75"/>`;
        s+=`<text x="10" y="16" class="lbs halo">${{hypo:"Destillerat vatten: hypoton, låg halt lösta ämnen",iso:"Isoton: samma halt lösta ämnen som i cellen",hyper:"Stark saltlösning: hyperton, hög halt lösta ämnen"}[sol]}</text>`;
        if(pl){const ins=sol==="hyper"?32:10;
          s+=`<rect x="122" y="36" width="176" height="176" rx="22" ${st("--c-wall-soft","--c-wall")} stroke-width="3"/>`;
          s+=`<rect x="${122+ins}" y="${36+ins}" width="${176-2*ins}" height="${176-2*ins}" rx="14" ${st("--c-cyto","--c-mem")} stroke-width="3"/>`;
          const vr={hypo:72,iso:62,hyper:30}[sol];s+=`<circle cx="210" cy="124" r="${vr}" ${st("--c-vac-soft","--c-vac")} stroke-width="2.5"/>`;
          if(sol==="hypo"){for(let k=0;k<4;k++){const a=Math.PI/4+k*Math.PI/2;s+=arr(210+50*Math.cos(a),124+50*Math.sin(a),210+69*Math.cos(a),124+69*Math.sin(a),"--c-vac",2.4,7)}}
          s+=`<text x="210" y="128" text-anchor="middle" class="lbs halo">vakuol</text>`;
          s+=`<path d="M306 30 L292 42" fill="none" style="stroke:var(--muted)" stroke-width="1.2"/><text x="308" y="34" class="lbs halo">cellvägg</text>`;
          s+=`<path d="M304 222 L${298-ins} ${200-ins}" fill="none" style="stroke:var(--muted)" stroke-width="1.2"/><text x="306" y="228" class="lbs halo">cellmembran</text>`;
        }else{
          if(sol==="hypo"){s+=`<circle cx="210" cy="124" r="92" ${st("--c-vir-soft","--c-vir")} stroke-width="3" stroke-dasharray="16 6"/>`;[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([a,b])=>{s+=`<path d="M${r1(210+a*62)} ${r1(124+b*62)} l${a*14} ${b*14}" fill="none" style="stroke:var(--bad)" stroke-width="3"/>`})}
          else if(sol==="iso"){s+=`<circle cx="210" cy="124" r="72" ${st("--c-vir-soft","--c-vir")} stroke-width="3"/><circle cx="210" cy="124" r="36" fill="none" style="stroke:var(--c-vir)" stroke-width="1.5" stroke-dasharray="4 4"/>`}
          else{let d="";for(let i=0;i<=28;i++){const a=i/28*Math.PI*2,rr=50+(i%2?-7:5);d+=(i?" L":"M")+r1(210+Math.cos(a)*rr)+" "+r1(124+Math.sin(a)*rr)}s+=`<path d="${d} Z" ${st("--c-vir-soft","--c-vir")} stroke-width="3"/>`}
          s+=`<text x="210" y="128" text-anchor="middle" class="lbs halo">röd blodkropp</text>`;
        }
        const dir={hypo:"in",iso:"lika",hyper:"ut"}[sol];
        if(dir==="in")s+=arr(40,124,104,124,"--c-vac",4,11)+arr(380,124,316,124,"--c-vac",4,11);
        else if(dir==="ut")s+=arr(104,124,40,124,"--c-vac",4,11)+arr(316,124,380,124,"--c-vac",4,11);
        else s+=arr(40,124,104,124,"--c-vac",4,11)+arr(316,124,380,124,"--c-vac",4,11);
        s+=`<text x="72" y="110" text-anchor="middle" class="lbs halo">H₂O</text><text x="348" y="110" text-anchor="middle" class="lbs halo">H₂O</text>`;
        s+=`<text x="210" y="252" text-anchor="middle" class="lb halo">${{in:"vatten går in i cellen",lika:"lika mycket vatten in som ut",ut:"vatten går ut ur cellen"}[dir]}</text>`;
        svg.innerHTML=s;
        const R={v:{hypo:["g","Spricker inte","in, genom osmos","sväller men spricker inte","Destillerat vatten har lägre halt av lösta ämnen än cellen, alltså högre vattenkoncentration. Därför diffunderar vatten in genom osmos och vakuolen sväller. Cellen spricker ändå inte, eftersom cellväggen hindrar den. Trycket mot väggen är turgor. {{src:s. 245}}"],
            iso:["m","Ingen förändring","lika mycket in som ut","påverkas inte","Lösningen har samma halt lösta ämnen som cellen, och därför är vattenkoncentrationen densamma. Lika många vattenmolekyler diffunderar in som ut. {{src:s. 33}}"],
            hyper:["b","Krymper innanför väggen","ut","vakuolen krymper","Stark saltlösning har lägre vattenkoncentration än cellen, och därför diffunderar vatten ut. Vakuolen krymper och cellmembranet drar sig bort från cellväggen. {{extra}} Boken tar inte upp växtcellen i hyperton lösning. Det kallas plasmolys."]},
          r:{hypo:["b","Sväller och kan spricka","in, genom osmos","sväller och kan spricka","Vatten diffunderar in, eftersom vattenkoncentrationen är högre utanför än inuti cellen. Blodkroppen har ingen cellvägg som håller emot, och därför sväller den och kanske till slut sprängs. {{src:s. 33}}"],
            iso:["m","Påverkas inte","lika mycket in som ut","oförändrad","Lösningen har samma halt lösta ämnen som cytoplasman, och därför diffunderar lika många vattenmolekyler in som ut. {{src:s. 33}}"],
            hyper:["b","Krymper","ut","krymper","Vatten går från den högre vattenkoncentrationen inuti cellen till den lägre i saltlösningen. Därför töms blodkroppen på mycket av sitt vatten och krymper. {{src:s. 33}}"]}}[S.c][sol];
        $("#k13-os-w").textContent=R[2];$("#k13-os-r").textContent=R[3];const vd=$("#k13-os-vd");vd.className="verdict "+R[0];vd.textContent=R[1];$("#k13-os-why").innerHTML=api.tpl(R[4])}
      segWire(el,"k13-os-c",v=>{S.c=v;draw()});segWire(el,"k13-os-s",v=>{S.s=v;draw()});draw();
    },
    k13Ljus(el,api){
      el.className="wid";
      const C={v:"--c-euk",b:"--c-nuc",g:"--c-chl",r:"--c-vir"},NM={v:"violett",b:"blått",g:"grönt",r:"rött"},Y={v:88,b:116,g:144,r:172};
      el.innerHTML=`<div class="wh"><b>Vilket ljus fångar klorofyllet?</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0;padding:6px"><svg viewBox="0 0 420 240" role="img" aria-label="Ljus som träffar ett blad" id="k13-lj-svg"></svg></figure>
      <div>${segHTML("k13-lj-s","Ljus",[["all","Vitt solljus"],["v","Violett"],["b","Blått"],["g","Grönt"],["r","Rött"]],"all")}
      <dl class="readout"><dt>Ljuset</dt><dd id="k13-lj-l"></dd><dt>Händer</dt><dd id="k13-lj-h"></dd></dl>
      <p class="verdict" id="k13-lj-vd"></p><p id="k13-lj-why"></p></div></div>`;
      const svg=el.querySelector("#k13-lj-svg"),$=s=>el.querySelector(s);
      function draw(k){let s=`<circle cx="30" cy="128" r="16" ${st("--c-mem")}/>`;
        for(let i=0;i<8;i++){const a=i/8*Math.PI*2;s+=`<path d="M${r1(30+Math.cos(a)*20)} ${r1(128+Math.sin(a)*20)} l${r1(Math.cos(a)*6)} ${r1(Math.sin(a)*6)}" fill="none" style="stroke:var(--c-mem)" stroke-width="2"/>`}
        s+=`<path d="M78 30 q22 -16 44 0 q-22 16 -44 0 z" style="fill:var(--paper);stroke:var(--ink)" stroke-width="2"/><circle cx="100" cy="30" r="5.5" ${st("--ink")}/>`;
        s+=`<ellipse cx="310" cy="130" rx="66" ry="82" ${st("--c-chl-soft","--c-chl")} stroke-width="3"/>`;
        [[292,104],[330,112],[300,160],[336,164]].forEach(([x,y])=>{for(let j=0;j<4;j++)s+=`<ellipse cx="${x}" cy="${y-9+j*6}" rx="11" ry="3.2" ${st("--c-chl")}/>`});
        s+=`<text x="310" y="138" text-anchor="middle" class="lbs halo">klorofyll</text>`;
        ["v","b","g","r"].forEach(c=>{const y=Y[c],dy=y-130,xe=310-66*Math.sqrt(1-(dy/82)*(dy/82));const on=k==="all"||k===c;
          s+=`<g opacity="${on?1:0.18}">`+arr(52,y,xe-2,y,C[c],4,9);
          if(c==="g")s+=arr(xe-6,y-3,128,40,C[c],3,9);else s+=`<circle cx="${r1(xe+12)}" cy="${y}" r="6" style="fill:var(${C[c]})" opacity=".55"/>`;
          s+=`<text x="58" y="${y-7}" class="lbs halo">${NM[c]}</text></g>`});
        if(k==="all"||k==="g")s+=`<text x="132" y="26" class="lbs halo">vi ser grönt</text>`;
        s+=`<text x="210" y="232" text-anchor="middle" class="lbs halo">absorberas: violett, blått, rött · reflekteras: grönt</text>`;
        svg.innerHTML=s;
        const vd=$("#k13-lj-vd");
        if(k==="all"){$("#k13-lj-l").textContent="vitt solljus (alla färger)";$("#k13-lj-h").textContent="violett, blått och rött absorberas, grönt reflekteras";vd.className="verdict g";vd.textContent="Bladet ser grönt ut";
          $("#k13-lj-why").innerHTML=api.tpl("Det finns olika typer av klorofyllmolekyler, och de fångar in ljus av olika våglängder. Violett, blått och rött ljus absorberas, medan grönt ljus reflekteras. Därför uppfattar vi växter som gröna. {{src:s. 247}}")}
        else if(k==="g"){$("#k13-lj-l").textContent="grönt";$("#k13-lj-h").textContent="reflekteras";vd.className="verdict m";vd.textContent="Grönt studsar tillbaka";
          $("#k13-lj-why").innerHTML=api.tpl("Grönt ljus absorberas inte av klorofyllet. Det reflekteras i stället och når ditt öga, och därför ser bladet grönt ut. {{src:s. 247}}")}
        else{$("#k13-lj-l").textContent=NM[k];$("#k13-lj-h").textContent="absorberas";vd.className="verdict g";vd.textContent="Fångas in";
          $("#k13-lj-why").innerHTML=api.tpl("Klorofyllmolekylerna inuti tylakoiderna absorberar "+NM[k]+" ljus. Ljusenergin fångas in, och det är den som gör att växten kan utföra fotosyntes. {{src:s. 247 · Bi2 bild 25}}")}}
      segWire(el,"k13-lj-s",draw);draw("all");
    },
    k13Flytt(el,api){
      el.className="wid";
      el.innerHTML=`<div class="wh"><b>Kloroplasterna söker ljuset</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0;padding:6px"><svg viewBox="0 0 420 214" role="img" aria-label="Kloroplaster i en cell som flyttar mot ljuset" id="k13-fl-svg"></svg></figure>
      <div>${segHTML("k13-fl-s","Ljuset kommer",[["v","från vänster"],["j","jämnt"],["h","från höger"]],"j")}
      <p class="verdict" id="k13-fl-vd"></p><p id="k13-fl-why"></p></div></div>`;
      const svg=el.querySelector("#k13-fl-svg"),$=s=>el.querySelector(s);
      let s=`<rect x="40" y="30" width="340" height="150" rx="18" ${st("--c-wall-soft","--c-wall")} stroke-width="3"/><rect x="50" y="40" width="320" height="130" rx="12" ${st("--c-cyto","--c-mem")} stroke-width="2"/>`;
      [70,105,140].forEach(y=>{s+=`<path d="M62 ${y} H358" fill="none" style="stroke:var(--muted)" stroke-width="2" stroke-dasharray="7 4"/>`});
      s+=`<path d="M210 190 L210 145" fill="none" style="stroke:var(--muted)" stroke-width="1.2"/><text x="210" y="204" text-anchor="middle" class="lbs halo">mikrotubuli</text>`;
      for(let i=0;i<9;i++){const y=[70,105,140][i%3];s+=`<g class="k13cp" style="transform:translate(210px,0px)"><ellipse cx="0" cy="${y}" rx="13" ry="7" ${st("--c-chl","--c-chl")}/><path d="M-6 ${y-2} h12 M-6 ${y+2} h12" fill="none" style="stroke:var(--c-chl-soft)" stroke-width="1.4"/></g>`}
      s+=`<g id="k13-fl-sun"></g>`;svg.innerHTML=s;
      const cps=[...svg.querySelectorAll(".k13cp")];if(!RM())cps.forEach(g=>{g.style.transition="transform .8s ease"});
      function set(m){cps.forEach((g,i)=>{const k=Math.floor(i/3),t=i%3;const x=m==="v"?74+k*28+t*6:m==="h"?346-k*28-t*6:96+k*112+t*10;g.style.transform=`translate(${x}px,0px)`});
        let sun="";if(m!=="j"){const x=m==="v"?20:400;sun+=`<circle cx="${x}" cy="105" r="11" ${st("--c-mem")}/><text x="${x}" y="84" text-anchor="middle" class="lbs halo">ljus</text>`;
          [80,105,130].forEach(y=>{sun+=m==="v"?arr(32,y,46,y,"--c-mem",2.5,6):arr(388,y,374,y,"--c-mem",2.5,6)})}
        svg.querySelector("#k13-fl-sun").innerHTML=sun;
        const vd=$("#k13-fl-vd");
        if(m==="j"){vd.className="verdict m";vd.textContent="Utspridda i cellen";$("#k13-fl-why").innerHTML=api.tpl("När ljuset är jämnt ligger kloroplasterna utspridda. Välj ljus från ett håll och gissa först vart de tar vägen.")}
        else{vd.className="verdict g";vd.textContent="Mot ljuset";$("#k13-fl-why").innerHTML=api.tpl("Kloroplasterna transporteras längs <b>mikrotubuli</b>, som många andra organeller. Därför kan de förflyttas till den del av cellen som träffas av mest ljus. Transporten syns om man tittar på ett blad i ett vanligt ljusmikroskop. {{src:s. 247}}")}}
      segWire(el,"k13-fl-s",set);set("j");
    }
  }
});
})();
