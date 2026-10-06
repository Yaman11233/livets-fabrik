/* K5 Transport över membran. Bok s. 31–37, PPT "Transport över membran" bild 1–26, PPT Bi2 bild 14, arbetsblad + facit. */
(function(){
"use strict";
const r1=n=>Math.round(n*10)/10;
const st=(f,s)=>`style="fill:var(${f})${s?";stroke:var("+s+")":""}"`;
const RM=()=>{try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}};
function segHTML(id,label,opts,cur){return `<div class="ctl">${label}<div class="seg" role="group" aria-label="${label}" id="${id}">${opts.map(([v,t])=>`<button type="button" data-v="${v}" aria-pressed="${v===cur}">${t}</button>`).join("")}</div></div>`}
function segWire(el,id,fn){const g=el.querySelector("#"+id);g.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{g.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));fn(b.dataset.v)}))}
function segSet(el,id,v){el.querySelectorAll("#"+id+" button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.v===v?"true":"false"))}
function arr(x1,y1,x2,y2,col,w,hs){const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,h=hs||8;const bx=x2-ux*h,by=y2-uy*h,px=-uy*h*0.6,py=ux*h*0.6;
  return `<path d="M${r1(x1)} ${r1(y1)} L${r1(bx)} ${r1(by)}" fill="none" style="stroke:var(${col})" stroke-width="${w}" stroke-linecap="round"/><polygon points="${r1(x2)},${r1(y2)} ${r1(bx+px)},${r1(by+py)} ${r1(bx-px)},${r1(by-py)}" style="fill:var(${col})"/>`}
function dot(x,y,r,col,sc){return `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" ${st(col,sc)}${sc?' stroke-width="1.5"':""}/>`}
function hexa(x,y,r,col,sc){const p=[];for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;p.push(r1(x+r*Math.cos(a))+","+r1(y+r*Math.sin(a)))}return `<polygon points="${p.join(" ")}" ${st(col,sc)}${sc?' stroke-width="1.4"':""}/>`}
function tri(x,y,r,col,sc){return `<polygon points="${r1(x)},${r1(y-r)} ${r1(x+r*0.9)},${r1(y+r*0.6)} ${r1(x-r*0.9)},${r1(y+r*0.6)}" ${st(col,sc)}${sc?' stroke-width="1.4"':""}/>`}
function star(x,y,R,col){const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?R*0.45:R;p.push(r1(x+rr*Math.cos(a))+","+r1(y+rr*Math.sin(a)))}return `<polygon points="${p.join(" ")}" ${st(col)}/>`}
function bolt(x1,y1,x2,y2,col){const dx=(x2-x1)/4,dy=(y2-y1)/4,nx=-dy*0.45,ny=dx*0.45;
  return `<path d="M${r1(x1)} ${r1(y1)} L${r1(x1+dx+nx)} ${r1(y1+dy+ny)} L${r1(x1+2*dx-nx)} ${r1(y1+2*dy-ny)} L${r1(x1+3*dx+nx)} ${r1(y1+3*dy+ny)}" fill="none" style="stroke:var(${col})" stroke-width="2.6" stroke-linejoin="round"/>`+arr(x1+3*dx+nx,y1+3*dy+ny,x2,y2,col,2.6,9)}
/* fosfolipid-dubbellager, liggande */
function bilH(x0,x1,yT,yB,skip,stp){stp=stp||10;skip=skip||[];const m=(yT+yB)/2;let s=`<rect x="${x0}" y="${yT}" width="${x1-x0}" height="${yB-yT}" ${st("--c-mem-soft")}/>`,t="";
  for(let x=x0+5;x<=x1-3;x+=stp){if(skip.some(([a,b])=>x>a-5&&x<b+5))continue;
    s+=`<circle cx="${x}" cy="${yT}" r="4" ${st("--c-mem")}/><circle cx="${x}" cy="${yB}" r="4" ${st("--c-mem")}/>`;
    t+=`M${r1(x-1.6)} ${yT+4}V${r1(m-3)}M${r1(x+1.6)} ${yT+4}V${r1(m-3)}M${r1(x-1.6)} ${yB-4}V${r1(m+3)}M${r1(x+1.6)} ${yB-4}V${r1(m+3)}`}
  return s+`<path d="${t}" fill="none" style="stroke:var(--c-mem)" stroke-width="1.1"/>`}
/* bärarprotein / pump: dir "up" = öppen mot utsidan (uppåt), "down" = öppen mot insidan */
function carrier(cx,yT,yB,dir,f,s){const t=yT-8,b=yB+8,m=(yT+yB)/2;let d;
  if(dir==="up")d=`M${cx-26} ${t} L${cx-9} ${t} L${cx} ${m+6} L${cx+9} ${t} L${cx+26} ${t} Q${cx+32} ${m} ${cx+20} ${b} L${cx-20} ${b} Q${cx-32} ${m} ${cx-26} ${t} Z`;
  else d=`M${cx-20} ${t} L${cx+20} ${t} Q${cx+32} ${m} ${cx+26} ${b} L${cx+9} ${b} L${cx} ${m-6} L${cx-9} ${b} L${cx-26} ${b} Q${cx-32} ${m} ${cx-20} ${t} Z`;
  return `<path d="${d}" ${st(f||"--c-nuc-soft",s||"--c-nuc")} stroke-width="2"/>`}
function crenate(cx,cy,R,amp,n){let d="";for(let i=0;i<=72;i++){const a=i/72*Math.PI*2,r=R+amp*Math.sin(a*n);d+=(i?"L":"M")+r1(cx+r*Math.cos(a))+" "+r1(cy+r*Math.sin(a))}return d+"Z"}
const T='class="lbs halo"';
const T13='class="lbs halo" style="font-size:13.5px"';
const TW='class="lbs halo" style="font-size:14px"';

/* ---------- figur: vad kommer igenom? (bok s. 31) ---------- */
function figGenom(){
  let s=`<rect x="352" y="14" width="44" height="258" ${st("--c-mem-soft")}/>`,t="";
  for(let y=18;y<=268;y+=10){s+=`<circle cx="357" cy="${y}" r="4" ${st("--c-mem")}/><circle cx="391" cy="${y}" r="4" ${st("--c-mem")}/>`;t+=`M361 ${y-1.5}H372M361 ${y+1.5}H372M387 ${y-1.5}H376M387 ${y+1.5}H376`}
  s+=`<path d="${t}" fill="none" style="stroke:var(--c-mem)" stroke-width="1.1"/>`;
  const R=[46,114,182,250],C=["--c-golgi","--c-vac","--c-chl","--bad"],K=["hyd","sma","sto","jon"];
  R.forEach((y,i)=>{let g=`<g data-k="${K[i]}"><rect x="0" y="${y-28}" width="350" height="60" fill="transparent"/><rect x="6" y="${y-19}" width="12" height="12" rx="2" ${st(C[i])}/>`;
    if(i===0)g+=arr(272,y,458,y,C[i],4,11);
    else{
      if(i===1)g+=arr(286,y-12,458,y-12,C[i],1.8,8);
      if(i===2)g+=`<path d="M286 ${y-12} H448" fill="none" style="stroke:var(${C[i]})" stroke-width="1.4" stroke-dasharray="4 4"/><polygon points="458,${y-12} 449,${y-16} 449,${y-8}" ${st(C[i])}/>`;
      g+=`<path d="M272 ${y+2} H338 A9 9 0 0 1 338 ${y+20} H293" fill="none" style="stroke:var(${C[i]})" stroke-width="4" stroke-linecap="round"/><polygon points="281,${y+20} 293,${y+13} 293,${y+27}" ${st(C[i])}/>`}
    s+=g+`</g>`});
  return s}

/* ---------- figur: backen (bok s. 32 + s. 34) ---------- */
function cl9(cx,cy,col){return [[0,0],[-12,-6],[12,-6],[-8,10],[8,10],[-21,5],[21,5],[0,-16],[-3,20]].map(p=>dot(cx+p[0],cy+p[1],5,col)).join("")}
function figBacken(){
  let s=`<path d="M14 92 L222 234 L14 234 Z" ${st("--sunk")}/><path d="M238 234 L446 92 L446 234 Z" ${st("--sunk")}/>`;
  s+=`<path d="M14 92 L222 234 M238 234 L446 92" fill="none" style="stroke:var(--line2)" stroke-width="2"/>`;
  s+=`<text x="112" y="16" text-anchor="middle" ${T13}>diffusion: nedför backen</text><text x="346" y="16" text-anchor="middle" ${T13}>aktiv transport: uppför backen</text>`;
  s+=cl9(56,70,"--c-mito")+arr(84,92,184,196,"--ink",2.5,10)+dot(140,150,5,"--c-mito")+dot(200,214,5,"--c-mito")+dot(214,204,5,"--c-mito")+dot(208,226,5,"--c-mito");
  s+=dot(258,214,5,"--c-mito")+dot(246,204,5,"--c-mito")+dot(250,226,5,"--c-mito")+arr(276,196,386,92,"--ink",2.5,10)+dot(325,150,5,"--c-mito")+cl9(414,70,"--c-mito");
  return s}

/* ---------- figur: kanalprotein och bärarprotein (bok s. 32) ---------- */
function figKanal(){
  let s=bilH(0,470,112,184,[[92,148],[270,330],[370,430]]);
  s+=`<g data-k="kanal"><rect x="90" y="96" width="70" height="104" fill="transparent"/><rect x="116" y="104" width="8" height="88" ${st("--c-vac-soft")}/><rect x="94" y="98" width="22" height="100" rx="8" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2"/><rect x="124" y="98" width="22" height="100" rx="8" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2"/>`;
  s+=[[120,132],[120,162],[128,48],[146,70],[118,84],[156,92],[112,226],[132,240]].map(p=>dot(p[0],p[1],3.6,"--c-mito")).join("")+`</g>`;
  s+=`<g data-k="barare"><rect x="268" y="96" width="166" height="104" fill="transparent"/>`+carrier(300,112,184,"up")+carrier(400,112,184,"down")+arr(336,148,362,148,"--ink",2,7);
  s+=[[270,70],[292,86],[318,72],[340,92],[362,70],[384,88],[410,72],[436,92],[300,128],[400,206],[276,222],[332,236],[424,228],[448,212]].map(p=>hexa(p[0],p[1],6,"--c-golgi")).join("")+`</g>`;
  return s}

/* ---------- figur: röda blodkroppar (bok s. 33) ---------- */
function figRbk(){
  let s=`<g data-k="hypo"><circle cx="80" cy="112" r="50" ${st("--c-vir-soft","--c-vir")} stroke-width="3"/><path d="M127 98 L135 106 L127 113 L136 121 L128 128" fill="none" style="stroke:var(--paper)" stroke-width="6"/>`;
  s+=`<path d="M140 92 l11 -6 M143 112 l13 0 M140 132 l11 6" fill="none" style="stroke:var(--c-vir)" stroke-width="2.5" stroke-linecap="round"/>`+arr(150,40,117,76,"--c-vac",3,10)+`<text x="150" y="30" ${T13}>H₂O</text></g>`;
  s+=`<g data-k="iso"><ellipse cx="235" cy="112" rx="58" ry="30" ${st("--c-vir-soft","--c-vir")} stroke-width="3"/><ellipse cx="235" cy="112" rx="26" ry="11" style="fill:var(--c-vir)" opacity=".2"/>`;
  s+=arr(178,58,204,86,"--c-vac",3,10)+arr(266,86,292,58,"--c-vac",3,10)+`<text x="174" y="74" text-anchor="end" ${T13}>H₂O</text><text x="296" y="52" ${T13}>H₂O</text></g>`;
  s+=`<g data-k="hyper"><path d="${crenate(390,112,34,4,14)}" ${st("--c-vir-soft","--c-vir")} stroke-width="3"/>`+arr(390,74,390,36,"--c-vac",3,10)+`<text x="400" y="46" ${T13}>H₂O</text></g>`;
  return s}

/* ---------- figur: bägarförsöket (PPT bild 13) ---------- */
function figBagare(){
  const many=[[132,132],[160,150],[184,176],[140,200],[172,206],[150,172],[188,132],[128,164],[176,122],[192,204]],few=[[58,170],[92,196],[50,206]];
  function beaker(x0,lvL,lvR){const mx=x0+85,x1=x0+170;let g=`<rect x="${x0}" y="${lvL}" width="85" height="${220-lvL}" ${st("--c-vac-soft")}/><rect x="${mx}" y="${lvR}" width="85" height="${220-lvR}" ${st("--c-vac-soft")}/>`;
    g+=`<path d="M${x0} ${lvL} H${mx} M${mx} ${lvR} H${x1}" fill="none" style="stroke:var(--c-vac)" stroke-width="2"/>`;
    g+=few.concat(many).map(p=>dot(p[0]-30+x0,p[1],4.5,"--c-golgi")).join("");
    g+=`<path d="M${x0} 58 V220 H${x1} V58" fill="none" style="stroke:var(--ink)" stroke-width="2.5"/><path d="M${mx} 62 V218" fill="none" style="stroke:var(--bad)" stroke-width="2.5" stroke-dasharray="7 5"/>`;
    return g}
  let s=beaker(30,110,110)+beaker(270,140,80);
  s+=arr(208,140,256,140,"--ink",3,11)+arr(314,188,394,188,"--c-vac",3,10);
  s+=`<path d="M300 110 H352" fill="none" style="stroke:var(--muted)" stroke-width="1.2" stroke-dasharray="3 3"/><path d="M358 110 H436" fill="none" style="stroke:var(--muted)" stroke-width="1.2" stroke-dasharray="3 3"/>`;
  s+=`<text x="115" y="48" text-anchor="middle" ${T13}>före</text><text x="355" y="48" text-anchor="middle" ${T13}>efter</text>`;
  return s}

/* ---------- figur: översikten (bok s. 34) ---------- */
function figOversikt(){
  let s=bilH(0,362,120,180,[[104,156],[184,246],[280,340]]);
  s+=`<g data-k="diff"><rect x="18" y="86" width="46" height="146" fill="transparent"/>`+dot(40,96,3.5,"--c-mito")+arr(40,104,40,228,"--ink",2.2,9)+`</g>`;
  s+=`<g data-k="kanal"><rect x="104" y="80" width="52" height="152" fill="transparent"/><path d="M106 112 L127 112 L123 150 L127 188 L106 188 Z" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2"/><path d="M154 112 L133 112 L137 150 L133 188 L154 188 Z" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2"/>`+dot(130,94,3.5,"--c-mito")+arr(130,102,130,228,"--ink",2.2,9)+`</g>`;
  s+=`<g data-k="barare"><rect x="184" y="76" width="62" height="156" fill="transparent"/><rect x="189" y="112" width="52" height="76" rx="24" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2"/><ellipse cx="215" cy="140" rx="9" ry="13" ${st("--c-cyto","--c-nuc")} stroke-width="1.5"/>`+dot(215,92,6,"--c-mito")+arr(215,102,215,228,"--ink",2.2,9)+`</g>`;
  s+=`<g data-k="pump"><rect x="270" y="80" width="80" height="152" fill="transparent"/><path d="M288 112 Q310 102 332 112 L334 190 L318 190 L314 172 L306 172 L302 190 L286 190 Z" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2"/><rect x="304" y="194" width="12" height="12" ${st("--c-chl")}/>`+arr(310,226,310,94,"--ink",2.2,9)+bolt(368,214,340,192,"--t-atp")+`</g>`;
  s+=`<path d="M106 238 V244 H246 V238 M284 238 V244 H336 V238" fill="none" style="stroke:var(--muted)" stroke-width="1.5"/>`;
  s+=`<g data-k="grad"><rect x="398" y="40" width="70" height="200" fill="transparent"/>`;
  [[412,58,5],[428,48,4],[442,62,6],[458,50,4],[420,78,4],[450,82,5],[434,96,3.5]].forEach(p=>{s+=`<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" ${st("--c-mito")}/>`});
  [[406,92],[460,70],[436,74]].forEach(p=>{s+=`<rect x="${p[0]-5}" y="${p[1]-5}" width="10" height="10" ${st("--c-chl")}/>`});
  s+=`<polygon points="424,108 450,108 450,196 464,196 437,234 410,196 424,196" ${st("--paper","--ink")} stroke-width="2"/></g>`;
  return s}

/* ---------- figur: antiport och symport (PPT bild 18) ---------- */
function figAntisym(){
  let s=bilH(0,470,112,176,[[86,154],[306,374]]);
  s+=`<rect x="90" y="98" width="28" height="92" rx="10" ${st("--c-euk-soft","--c-euk")} stroke-width="2"/><rect x="122" y="98" width="28" height="92" rx="10" ${st("--c-euk-soft","--c-euk")} stroke-width="2"/>`;
  s+=`<rect x="310" y="98" width="28" height="92" rx="10" ${st("--c-euk-soft","--c-euk")} stroke-width="2"/><rect x="342" y="98" width="28" height="92" rx="10" ${st("--c-euk-soft","--c-euk")} stroke-width="2"/>`;
  s+=arr(108,212,108,58,"--c-bact",3,10)+arr(132,58,132,212,"--c-arch",3,10);
  s+=[[92,40],[110,30],[126,42]].map(p=>dot(p[0],p[1],6,"--c-bact-soft","--c-bact")).join("")+[[140,228],[156,214]].map(p=>tri(p[0],p[1],7,"--c-arch-soft","--c-arch")).join("");
  s+=star(66,236,13,"--t-atp")+bolt(78,226,100,198,"--t-atp");
  s+=arr(328,58,328,212,"--c-bact",3,10)+arr(352,58,352,212,"--c-chl",3,10);
  s+=[[306,40],[290,52]].map(p=>dot(p[0],p[1],6,"--c-bact-soft","--c-bact")).join("")+[[378,72],[396,88]].map(p=>hexa(p[0],p[1],7,"--c-chl-soft","--c-chl")).join("");
  s+=[[318,228]].map(p=>dot(p[0],p[1],6,"--c-bact-soft","--c-bact")).join("")+[[368,222],[386,212],[384,232]].map(p=>hexa(p[0],p[1],7,"--c-chl-soft","--c-chl")).join("");
  s+=`<text x="232" y="92" text-anchor="middle" class="lbs" style="font-size:13.5px;fill:var(--muted)">utsida</text><text x="232" y="232" text-anchor="middle" class="lbs" style="font-size:13.5px;fill:var(--muted)">insida</text>`;
  return s}

/* ---------- figur: aktionspotential (PPT bild 20) ---------- */
function figAp(){
  const Y=v=>r1(40+(52-v)*1.149);
  let s=`<path d="M40 22 V250 H462" fill="none" style="stroke:var(--muted)" stroke-width="1.5"/>`;
  s+=`<path d="M40 ${Y(0)} H462" fill="none" style="stroke:var(--line2)" stroke-width="1" stroke-dasharray="4 4"/><text x="34" y="${Y(0)+4}" text-anchor="end" class="lbs" style="font-size:13.5px;fill:var(--muted)">0</text><text x="44" y="16" class="lbs" style="font-size:13.5px;fill:var(--muted)">mV</text><text x="462" y="266" text-anchor="end" class="lbs" style="font-size:13.5px;fill:var(--muted)">tid</text>`;
  s+=`<path d="M44 ${Y(-96)} H118 L128 ${Y(52)} L140 ${Y(23)} Q146 ${Y(16)} 156 ${Y(16)} C220 ${Y(14)} 290 ${Y(10)} 318 ${Y(0)} C340 ${Y(-10)} 360 ${Y(-86)} 384 ${Y(-96)} H460" fill="none" style="stroke:var(--ink)" stroke-width="3" stroke-linejoin="round"/>`;
  s+=`<path d="M128 272 H382" fill="none" style="stroke:var(--bad)" stroke-width="2"/><polygon points="126,272 136,267 136,277" ${st("--bad")}/><polygon points="384,272 374,267 374,277" ${st("--bad")}/>`;
  s+=`<path d="M128 252 V280 M384 252 V280" fill="none" style="stroke:var(--bad)" stroke-width="1" stroke-dasharray="3 3"/>`;
  return s}

/* ---------- figur: tre typer av endocytos (PPT bild 23) ---------- */
function figEndo3(){
  let s=`<rect x="0" y="0" width="470" height="140" ${st("--c-vac-soft")} opacity=".55"/><rect x="0" y="140" width="470" height="190" ${st("--c-cyto")}/>`;
  s+=`<path d="M156 30 V322 M314 30 V322" fill="none" style="stroke:var(--line2)" stroke-width="1.5" stroke-dasharray="5 5"/>`;
  /* fagocytos */
  s+=`<g data-k="fago"><rect x="0" y="40" width="154" height="280" fill="transparent"/><path d="M0 140 H156" fill="none" style="stroke:var(--c-mem)" stroke-width="6"/>`;
  s+=`<path d="M14 142 Q24 96 60 72 Q44 104 50 142 Z" ${st("--c-cyto","--c-mem")} stroke-width="4"/><path d="M142 142 Q132 96 96 72 Q112 104 106 142 Z" ${st("--c-cyto","--c-mem")} stroke-width="4"/>`;
  s+=`<ellipse cx="78" cy="104" rx="22" ry="12" ${st("--c-vir-soft","--c-vir")} stroke-width="2"/>`+arr(78,160,78,196,"--ink",2,8);
  s+=`<circle cx="78" cy="234" r="28" ${st("--c-cyto","--c-mem")} stroke-width="4"/><ellipse cx="78" cy="234" rx="15" ry="8" ${st("--c-vir-soft","--c-vir")} stroke-width="2"/></g>`;
  /* pinocytos */
  s+=`<g data-k="pino"><rect x="158" y="40" width="154" height="280" fill="transparent"/>`;
  s+=`<path d="M196 140 V178 Q206 192 216 178 V140 Z M254 140 V178 Q264 192 274 178 V140 Z" ${st("--c-vac-soft")}/>`;
  s+=`<path d="M156 140 H190 Q196 140 196 148 V178 Q206 192 216 178 V148 Q216 140 222 140 H248 Q254 140 254 148 V178 Q264 192 274 178 V148 Q274 140 280 140 H314" fill="none" style="stroke:var(--c-mem)" stroke-width="6"/>`;
  s+=[[176,96],[204,112],[236,90],[262,118],[292,100],[206,166],[266,170],[226,124]].map(p=>dot(p[0],p[1],3,"--c-nuc")).join("")+arr(235,198,235,214,"--ink",2,7);
  s+=`<circle cx="235" cy="240" r="17" ${st("--c-vac-soft","--c-mem")} stroke-width="4"/>`+dot(230,236,3,"--c-nuc")+dot(241,245,3,"--c-nuc")+`</g>`;
  /* receptormedierad */
  s+=`<g data-k="rec"><rect x="316" y="40" width="154" height="280" fill="transparent"/>`;
  s+=`<path d="M352 146 Q352 176 392 176 Q432 176 432 146" fill="none" style="stroke:var(--c-vir)" stroke-width="6" stroke-dasharray="2 4"/>`;
  s+=`<path d="M314 140 H346 Q352 140 352 146 Q352 168 392 168 Q432 168 432 146 Q432 140 438 140 H470" fill="none" style="stroke:var(--c-mem)" stroke-width="6"/>`;
  [[364,152,-0.7],[382,160,-0.2],[402,160,0.2],[420,152,0.7]].forEach(([x,y,a])=>{const dx=Math.sin(a),dy=-Math.cos(a);const tx=x+dx*12,ty=y+dy*12;
    s+=`<path d="M${r1(x)} ${r1(y)} L${r1(tx)} ${r1(ty)} M${r1(tx)} ${r1(ty)} l${r1(dx*6-dy*5)} ${r1(dy*6+dx*5)} M${r1(tx)} ${r1(ty)} l${r1(dx*6+dy*5)} ${r1(dy*6-dx*5)}" fill="none" style="stroke:var(--c-euk)" stroke-width="2.4" stroke-linecap="round"/>`+star(tx+dx*9,ty+dy*9,6,"--c-golgi")});
  s+=star(338,96,6,"--c-golgi")+star(452,108,6,"--c-golgi")+arr(372,190,372,212,"--ink",2,7);
  s+=`<circle cx="372" cy="248" r="24" fill="none" style="stroke:var(--c-vir)" stroke-width="6" stroke-dasharray="2 4"/><circle cx="372" cy="248" r="20" ${st("--c-cyto","--c-mem")} stroke-width="4"/>`+star(366,244,5,"--c-golgi")+star(378,254,5,"--c-golgi")+`</g>`;
  return s}

/* ---------- figur: exocytos och endocytos (bok s. 37) ---------- */
function figExoendo(){
  const box=(x,y,kind)=>{let g=`<rect x="${x}" y="${y}" width="190" height="100" rx="4" ${st("--paper","--line2")} stroke-width="1.2"/><rect x="${x}" y="${y+30}" width="190" height="70" ${st("--sunk")}/>`;
    const mx=x+95;
    if(kind==="a1"){g+=`<path d="M${x} ${y+30} H${x+190}" fill="none" style="stroke:var(--c-mem)" stroke-width="4"/><circle cx="${mx}" cy="${y+68}" r="18" ${st("--c-cyto","--c-mem")} stroke-width="4"/>`+[[-7,-6],[7,-6],[-7,7],[7,7]].map(p=>dot(mx+p[0],y+68+p[1],4,"--c-nuc")).join("")}
    if(kind==="a2"){g+=`<path d="M${mx-20} ${y+30} V${y+44} A20 20 0 0 0 ${mx+20} ${y+44} V${y+30} Z" ${st("--paper")}/><path d="M${x} ${y+30} H${mx-26} Q${mx-20} ${y+30} ${mx-20} ${y+38} V${y+44} A20 20 0 0 0 ${mx+20} ${y+44} V${y+38} Q${mx+20} ${y+30} ${mx+26} ${y+30} H${x+190}" fill="none" style="stroke:var(--c-mem)" stroke-width="4"/>`+[[-8,14],[6,20],[-14,-14],[12,-20]].map(p=>dot(mx+p[0],y+30+p[1],4,"--c-nuc")).join("")}
    if(kind==="b1"){g+=`<path d="M${mx-17} ${y+30} V${y+64} A17 17 0 0 0 ${mx+17} ${y+64} V${y+30} Z" ${st("--paper")}/><path d="M${x} ${y+30} H${mx-23} Q${mx-17} ${y+30} ${mx-17} ${y+38} V${y+64} A17 17 0 0 0 ${mx+17} ${y+64} V${y+38} Q${mx+17} ${y+30} ${mx+23} ${y+30} H${x+190}" fill="none" style="stroke:var(--c-mem)" stroke-width="4"/>`+[[-6,40],[6,52],[-4,64],[8,30],[0,18],[-30,12],[28,16],[48,8],[-50,6]].map(p=>dot(mx+p[0],y+p[1]+10,2.6,"--c-nuc")).join("")}
    if(kind==="a2")g+=arr(mx+34,y+52,mx+46,y+12,"--ink",1.8,7);
    if(kind==="b1")g+=arr(mx+42,y+8,mx+27,y+44,"--ink",1.8,7);
    if(kind==="b2"){g+=`<path d="M${x} ${y+30} H${x+190}" fill="none" style="stroke:var(--c-mem)" stroke-width="4"/><circle cx="${mx}" cy="${y+68}" r="17" ${st("--paper","--c-mem")} stroke-width="4"/>`+[[-6,-5],[6,-4],[-3,6],[7,6],[0,0]].map(p=>dot(mx+p[0],y+68+p[1],2.6,"--c-nuc")).join("")}
    return g};
  let s=`<g data-k="exo">`+box(14,40,"a1")+box(266,40,"a2")+`</g><g data-k="endo">`+box(14,200,"b1")+box(266,200,"b2")+`</g>`;
  s+=arr(212,90,258,90,"--ink",2.5,10)+arr(212,250,258,250,"--ink",2.5,10);
  return s}

/* ---------- figur: akvaporinens insida (Film Osmos) ---------- */
function h2o(x,y,up){const d=up?-1:1;return `<circle cx="${r1(x-5)}" cy="${r1(y+d*6)}" r="3.4" ${st("--paper","--c-vac")} stroke-width="1.4"/><circle cx="${r1(x+5)}" cy="${r1(y+d*6)}" r="3.4" ${st("--paper","--c-vac")} stroke-width="1.4"/><circle cx="${r1(x)}" cy="${r1(y)}" r="6" ${st("--c-vac")}/>`}
function figAkva(){
  let s=bilH(0,470,118,182,[[160,310]]);
  s+=`<g data-k="prot"><rect x="166" y="98" width="60" height="104" rx="16" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2"/><rect x="244" y="98" width="60" height="104" rx="16" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2"/></g>`;
  s+=`<rect x="226" y="98" width="18" height="104" ${st("--c-vac-soft")}/>`;
  s+=`<g data-k="plus">`+[128,172].map(y=>`<text x="214" y="${y}" text-anchor="middle" ${TW}>+</text><text x="256" y="${y}" text-anchor="middle" ${TW}>+</text>`).join("")+`</g>`;
  s+=`<g data-k="vatten">`+h2o(235,112,true)+h2o(235,140,true)+h2o(235,164,false)+h2o(235,190,false)+`</g>`;
  s+=h2o(150,60,true)+h2o(200,44,true)+h2o(286,70,false)+h2o(190,246,false)+h2o(268,256,true)+h2o(318,236,false);
  s+=`<g data-k="hplus">`+dot(352,66,6,"--bad-soft","--bad")+arr(344,72,272,92,"--bad",2.4,8)+`<path d="M256 84 L268 96 M268 84 L256 96" fill="none" style="stroke:var(--bad)" stroke-width="3" stroke-linecap="round"/></g>`;
  return s}

/* ---------- figur: synapsen (Film Aktiv transport) ---------- */
function figSynaps(){
  let s=`<path d="M205 0 L205 34 Q124 38 122 100 L122 150 L348 150 L348 100 Q346 38 265 34 L265 0 Z" ${st("--c-euk-soft","--c-euk")} stroke-width="3"/>`;
  s+=bolt(235,4,235,44,"--c-mito");
  const ves=(x,y)=>`<circle cx="${x}" cy="${y}" r="16" ${st("--paper","--c-golgi")} stroke-width="2"/>`+dot(x-6,y-3,2.8,"--c-golgi")+dot(x+5,y-5,2.8,"--c-golgi")+dot(x,y+6,2.8,"--c-golgi");
  s+=`<g data-k="ves">`+ves(175,82)+ves(296,90)+ves(212,116)+`</g>`;
  s+=`<g data-k="exo"><path d="M244 150 A16 16 0 0 1 276 150" fill="none" style="stroke:var(--c-golgi)" stroke-width="2.4"/>`+[[248,160],[260,168],[272,160],[288,168],[240,170]].map(p=>dot(p[0],p[1],2.8,"--c-golgi")).join("")+`</g>`;
  s+=`<g data-k="ca"><rect x="146" y="140" width="9" height="22" rx="3" ${st("--c-nuc-soft","--c-nuc")} stroke-width="1.6"/><rect x="167" y="140" width="9" height="22" rx="3" ${st("--c-nuc-soft","--c-nuc")} stroke-width="1.6"/>`+arr(161,174,161,122,"--c-mito",2.6,8)+dot(180,170,4,"--c-mito")+dot(150,112,4,"--c-mito")+`</g>`;
  s+=`<rect x="120" y="182" width="300" height="110" rx="20" ${st("--c-mem-soft","--c-mem")} stroke-width="3"/>`;
  s+=`<g data-k="rec">`+[246,272,300].map(x=>`<path d="M${x-6} 172 L${x-6} 184 L${x+6} 184 L${x+6} 172" ${st("--c-nuc-soft","--c-nuc")} stroke-width="1.8"/>`).join("")+`</g>`;
  s+=arr(232,232,352,232,"--c-mito",3,10);
  return s}
G.def({
  id:"k5",
  src:{bok:"s. 31–37 (s. 37 nedre delen och s. 38 saknas i fotona)",ppt:"Transport över membran, bild 1–26 · Bi2 bild 14",ab:"Arbetsblad Transport över membran · Faktablad (facit)"},
  threads:["membran","osmos","atp","nyckel","endo"],
  goals:[
    "förklara vilka fyra egenskaper som avgör hur lätt ett ämne tar sig genom cellmembranet, och varför inte ens vätejonen kommer igenom",
    "förklara diffusion, koncentrationsgradient och passiv transport med sockerbiten i teet och backen, och hur en cell \"andas\"",
    "jämföra kanalproteiner och bärarproteiner vid underlättad diffusion",
    "definiera osmos och förklara vad som händer med en röd blodkropp i hypoton, isoton och hyperton lösning",
    "förklara aktiv transport, kopplad transport och ATP-drivna pumpar, med natrium-kaliumpumpen och salt + glukos vid diarré",
    "beskriva fagocytos, pinocytos, LDL-upptaget och exocytos, och förklara varför cellmembranet håller sin storlek",
    "förklara med lärarens bilder varför membranet är laddat och läsa av en aktionspotential i en hjärtmuskelcell"
  ],
  intro:`<p>I {{go:k3|K3 Cellmembranet}} såg du hur tullgränsen runt cellfabriken är byggd: ett dubbelt lager av fosfolipider med proteiner i. Nu handlar det om hur varorna tar sig över gränsen. En del rullar fritt nedför backen, andra går genom grindar och svängdörrar, några åker rulltrappa uppför och betalar med ATP-mynt, och de största lassen kör in och ut med lastbilar (vesiklar) vid lastkajen.</p>`,
  secs:[
  {id:"genom",h:"Vad kommer igenom membranet?",nav:"Vad kommer igenom?",src:"s. 31 · PPT Transport bild 2, 4 · Arbetsblad",prov:true,html:`
    <p>Cellmembranets dubbla lager av <b>fosfolipider</b> skiljer cellens inre från den omgivande miljön ({{go:k3.uppbyggnad|membranets byggnad i K3}}). Därför kan ämnen inte ta sig över cellmembranet hur som helst. Vissa ämnen kan passera fritt, medan andra inte tar sig igenom lika lätt.</p>
    <div class="box key"><p>Hur lätt ett ämne tar sig igenom cellmembranet beror på fyra faktorer: <b>laddning</b>, <b>storlek</b>, <b>form</b> och <b>fettlöslighet</b>. {{prov}} {{src:s. 31}}</p></div>
    <p><b>Små, oladdade och hydrofoba</b> ämnen, som syre och koldioxid, tar sig lätt igenom cellmembranet. Det gör även <b>stora fettlösliga molekyler</b>. Det beror på att fosfolipidskiktet är fettlösligt. {{prov}}</p>
    <p><b>Hydrofila</b> ämnen har det betydligt svårare. Därför har till exempel natriumjoner (Na⁺) och kaliumjoner (K⁺) inte fri passage. {{prov}}</p>
    <p>Inte ens den minsta av alla joner, <b>vätejonen</b> (H⁺), kan slinka igenom membranet. Det beror på att den, liksom andra joner, attraherar vattenmolekyler och omges av ett <b>skal av vattenmolekyler</b>.</p>
    <ol class="chainv"><li>Jonen är laddad.</li><li>Den attraherar vattenmolekyler och omges av ett vattenskal.</li><li>Med skalet är den hydrofil.</li><li>Den kan inte ta sig genom det fettlösliga fosfolipidskiktet.</li></ol>
    <div class="lfig-h" data-fig="genom"></div>
    <table class="cmp"><tr><th>Grupp i bokens figur</th><th>Exempel</th><th>Genom fosfolipidskiktet</th></tr>
      <tr><td>Hydrofoba molekyler</td><td>O₂, CO₂, N₂, steroidhormoner</td><td>passerar fritt</td></tr>
      <tr><td>Små, oladdade polära molekyler</td><td>H₂O, glycerol</td><td>en del kommer igenom, de flesta studsar tillbaka</td></tr>
      <tr><td>Stora, oladdade polära molekyler</td><td>glukos</td><td>mycket lite kommer igenom</td></tr>
      <tr><td>Joner</td><td>H⁺, Na⁺, K⁺, Ca²⁺, Mg²⁺, Cl⁻, HCO₃⁻</td><td>kommer inte igenom</td></tr></table>
    <p>Bokens bildtext sammanfattar figuren: <i>"Ju mindre molekylen är och framförallt ju mer hydrofob den är desto lättare tar sig molekylen in genom fosfolipidlagret."</i> Fettlösligheten väger alltså tyngst.</p>
    <p>Boken avslutar med en fråga. Hur gör då cellen när den tar in de ämnen den behöver och släpper ut sådant den vill göra sig av med? Svaret är resten av kapitlet.</p>
    <div class="box trick"><p><b>L S F F</b>: "<b>L</b>illa <b>S</b>tina <b>F</b>ryser om <b>F</b>ötterna" = <b>L</b>addning, <b>S</b>torlek, <b>F</b>orm, <b>F</b>ettlöslighet.</p></div>
    <div class="box trap"><p>Storlek är inte allt. Vätejonen är den minsta jonen men kommer ändå inte igenom, eftersom den är laddad och har ett vattenskal. Steroidhormoner är stora men passerar lätt, eftersom de är fettlösliga.</p><p>Vatten är litet men polärt. Därför kommer bara en del vatten igenom själva fosfolipidskiktet ({{go:k5.osmos|aquaporinerna}} hjälper resten).</p></div>
    <div class="box fab"><p>Cellmembranet är fabrikens <b>tullgräns</b>, och muren är gjord av fett. Fettlösliga varor som syre glider rakt igenom muren. Joner är inslagna i ett vattenskal och fastnar, så de måste ta en grind (ett kanalprotein).</p></div>
    <div class="box lek"><p>Läraren börjar med att repetera cellmembranets byggnad: extracellulär vätska ovanför och cytoplasma (cellvätska) under, ett dubbellager av fosfolipider med hydrofila huvuden och hydrofoba svansar, kolesterol, kanalprotein, membranbundna proteiner, glykolipid, kolhydrater och proteintrådar i cellskelettet. {{lek:Transport bild 2}}</p><p>Bild 4 sammanfattar sedan bokens s. 31 i fyra rutor. Vissa ämnen passerar fritt, laddning, storlek, form och fettlöslighet avgör, små oladdade hydrofoba ämnen tar sig enklare in, och hydrofila ämnen som natrium- och kaliumjoner har svårare. {{lek:Transport bild 4}}</p></div>
    <div class="box link"><p>Fosfolipidens hydrofila huvud och hydrofoba svansar finns i {{go:k1.fosfolipider|K1}}. I {{go:k3.uppbyggnad|K3}} ser du hur svansarna pekar inåt mot varandra. Det är därför membranets inre är fettlösligt.</p></div>
    <div class="box tr" data-t="membran" data-h="Fettet är spärren">Membranets inre består av fosfolipidernas hydrofoba svansar ({{go:k1.fosfolipider|K1}}, {{go:k3.uppbyggnad|K3}}). Därför släpps fettlösliga ämnen igenom, medan joner och stora polära molekyler behöver proteiner eller vesiklar. Samma dubbla lager finns i organellernas membran ({{go:k4|K4}}).</div>
    <div class="x" data-x="tfGenom"></div>
  `},
  {id:"diffusion",h:"Diffusion",nav:"Diffusion",src:"s. 31 · PPT Transport bild 5–7 · Arbetsblad",prov:true,html:`
    <p>Lägg en sockerbit i en kopp te. Det dröjer inte länge förrän teet smakar sött. Sockermolekylerna har blandat sig med vattenmolekylerna och de övriga molekylerna i teet.</p>
    <p>Boken kallar det <b>naturens strävan mot kaos</b>. Ordningen från början, när alla sockermolekyler satt samlade i sockerbiten, blir snart till oordning.</p>
    <ol class="chainv"><li>Partiklar är i <b>ständig rörelse</b>, och rörelsen är <b>slumpmässig</b>. Den har ingen speciell riktning.</li><li>I koppen rör sig både sockermolekylerna och vattenmolekylerna slumpartat.</li><li>Trots det har transporten av socker totalt sett en riktning, från <b>hög koncentration</b> (i sockerbiten) till <b>låg koncentration</b> (i vattenlösningen runt omkring).</li><li>Efter en stund är sockret jämnt fördelat i lösningen.</li></ol>
    <p>Man säger att sockermolekylerna följer <b>koncentrationsgradienten</b>, och därför kräver rörelsen ingen energi. {{prov}}</p>
    <div class="w" data-w="k5Te"></div>
    <h3>Backen</h3>
    <p>Tänk dig koncentrationsgradienten som en nedförsbacke som något rullar utför. Föremålet uppe på backen har <b>potentiell energi</b> (lägesenergi). På samma sätt finns det potentiell energi i koncentrationsgradienten. Därför behöver ingen tillföra energi, eftersom ämnet "rullar" av sig självt från hög till låg koncentration.</p>
    <div class="lfig-h" data-fig="backen"></div>
    <div class="box key"><p>Transport från hög till låg koncentration kallas <b>diffusion</b>. När den sker genom ett cellmembran kallas den <b>passiv transport</b>, eftersom den inte kostar cellen någon energi. {{prov}} {{src:s. 31}}</p><p>Varje ämne rör sig längs <b>sin egen koncentrationsgradient</b>. Diffusionen är alltså inte beroende av koncentrationen av andra ämnen.</p></div>
    <div class="box lek"><p>Läraren definierar diffusion så här. Ämnen strävar efter att förflytta sig från en stark koncentration mot en svagare och jämnar på så sätt ut koncentrationsskillnaderna. <b>Energin kommer från molekylernas värmerörelse</b>, och ingen ytterligare energi behövs. Lärarens vardagsexempel är <b>grädde som blandas med kaffe</b>. {{lek:Transport bild 5}}</p><p>Om ett ämne hela tiden kommer ut från en källa och får diffundera fritt, är koncentrationen högst närmast källan och avtar längre bort. Koncentrationsgradienten är skillnaden mellan hög och låg koncentration <b>i förhållande till avståndet</b>, och den är <b>ett mått på hur snabb diffusionen är</b>. En brantare gradient ger alltså snabbare diffusion. {{lek:Transport bild 6}}</p><p>Boken förklarar diffusionen med slumpmässig rörelse och potentiell energi i gradienten, och läraren med värmerörelsen. Det är två sätt att beskriva samma sak.</p></div>
    <div class="box trick"><p>Hög → låg är gratis, som att åka skidor nedför. Låg → hög kostar energi, som att ta liften upp (det kommer under {{go:k5.aktiv|aktiv transport}}).</p></div>
    <div class="box trap"><p>Passiv betyder inte stillastående. Molekylerna rör sig hela tiden, även när allt är jämnt fördelat. Passiv betyder att cellen inte betalar någon energi.</p><p>Diffusion sker överallt, till exempel i teet. Ordet passiv transport används bara när diffusionen sker genom ett cellmembran.</p></div>
    <div class="box fab"><p>Diffusion är varor som rullar nedför en backe rakt genom tullgränsen. Ingen i fabriken behöver betala, eftersom backen själv står för energin.</p></div>
  `},
  {id:"andas",h:"Cellen \"andas\"",nav:"Cellen andas",src:"s. 32 · PPT Transport bild 7",prov:true,html:`
    <p>Mycket av transporten över cellmembranet sker via diffusion. Vissa ämnen, som <b>syre</b> och <b>koldioxid</b>, har fri passage genom membranet, eftersom de är små, oladdade och hydrofoba.</p>
    <p>En cell kan därför <b>"andas"</b> så länge syrehalten utanför cellen är högre än den inuti, och koldioxidhalten är högre inuti cellen än utanför. Då kan syret, som cellen behöver, diffundera in i cellen. Koldioxiden, som den behöver göra sig av med, diffunderar ut. Både syre och koldioxid följer <b>sin egen koncentrationsgradient</b>. {{prov}}</p>
    <div class="w" data-w="k5Andas"></div>
    <div class="box trap"><p>Syre och koldioxid kan gå åt olika håll samtidigt, eftersom varje ämne följer sin egen gradient.</p><p>Cellen pumpar inte in syre. Om syrehalten vore högre inuti cellen än utanför skulle syret i stället diffundera ut.</p></div>
    <div class="box extra"><p>Varför är syrehalten oftast lägre inne i cellen? Mitokondrierna, cellens kraftverk, använder syre när de bildar ATP och lämnar koldioxid efter sig ({{go:k4.mitokondrien|mitokondrien i K4}}). Därför håller cellen själv gradienterna vid liv så länge den arbetar.</p></div>
    <div class="x" data-x="tfDiff"></div>
  `},
  {id:"underlattad",h:"Underlättad diffusion",nav:"Underlättad diffusion",src:"s. 32 · PPT Transport bild 8–11 · Arbetsblad",prov:true,html:`
    <p>Ett ämne som inte kan slinka igenom det dubbla fosfolipidlagret kan ändå följa sin koncentrationsgradient och diffundera in i och ut ur en cell. Det kräver att det finns <b>proteiner i membranet</b> som hjälper det. Det kallas <b>underlättad diffusion</b>, och proteinerna är av två sorter. {{prov}}</p>
    <div class="box key"><p><b>Kanalproteiner</b> är öppningar i membranet som bara vissa ämnen kan slinka igenom, nämligen de med rätt storlek, form och laddning.</p><p><b>Bärarproteiner</b> binder till ett visst ämne och lyfter det genom membranet genom att <b>ändra form</b>.</p><p>De flesta av proteinerna är <b>specifika</b>. De underlättar alltså transporten för bara ett visst ämne. {{prov}} {{src:s. 32}}</p></div>
    <div class="lfig-h" data-fig="kanal"></div>
    <h3>Kanalproteiner</h3>
    <p>Kanalproteinerna bildar <b>vattenfyllda kanaler</b> i cellmembranet. Genom dem kan vattenmolekyler och joner ta sig igenom, och därför är kanalerna jonernas väg genom membranet.</p>
    <p>Olika <b>stimuli</b> kan få kanalerna att öppnas och stängas vid behov. Ett stimulus kan vara <b>kemiskt, elektriskt eller mekaniskt</b>. {{prov}}</p>
    <p>Kanaler som är specialiserade på joner kallas <b>jonkanaler</b>. Det finns till exempel jonkanaler som bara släpper igenom natriumjoner och andra som bara släpper igenom kaliumjoner. {{prov}}</p>
    <h3>Bärarproteiner</h3>
    <ol class="chainv"><li>Ämnet som ska transporteras, till exempel <b>glukos</b>, binder till bärarproteinet.</li><li>Bindningen gör att bärarproteinet ändrar form.</li><li>Ämnet förs över till andra sidan membranet och släpps där.</li></ol>
    <p>Inte heller detta kräver energi, eftersom det är fråga om diffusion. Ämnet transporteras från en högre till en lägre koncentration. {{prov}}</p>
    <div class="w" data-w="k5Kanal"></div>
    <table class="cmp"><tr><th></th><th>Kanalprotein</th><th>Bärarprotein</th></tr>
      <tr><td>Hur</td><td>en vattenfylld öppning genom membranet</td><td>binder ämnet och ändrar form</td></tr>
      <tr><td>Vad</td><td>vatten och joner med rätt storlek, form och laddning</td><td>ett visst ämne, t.ex. glukos</td></tr>
      <tr><td>Styrs av</td><td>stimuli (kemiska, elektriska, mekaniska) som öppnar och stänger</td><td>att ämnet binder</td></tr>
      <tr><td>Specifikt?</td><td>ja, t.ex. jonkanaler för bara Na⁺ eller bara K⁺</td><td>ja, oftast för ett visst ämne</td></tr>
      <tr><td>Energi</td><td>nej, med gradienten</td><td>nej, med gradienten</td></tr></table>
    <div class="box lek"><p>Läraren kallar underlättad diffusion för <b>faciliterad diffusion</b>. Det är samma sak. På bild 11 kallas bärarproteinet för en <b>passiv transportör</b>. {{lek:Transport bild 8, 11}}</p><p>Bild 9 visar en dansk membranfigur med några ord till. Ett <b>integralt membranprotein</b> går genom hela membranet, som kanalproteinet, medan ett <b>perifert membranprotein</b> sitter på ytan. Ett <b>glykoprotein</b> är ett protein med socker på, och en <b>glykolipid</b> är en lipid med socker på. {{lek:Transport bild 9}}</p></div>
    <div class="box trick"><p><b>Kanal = grind</b> som öppnas på en signal. Signalerna är <b>KEM</b>: <b>K</b>emiska, <b>E</b>lektriska, <b>M</b>ekaniska.</p><p><b>Bärare = svängdörr.</b> Ämnet kliver in, dörren vrider sig, och ämnet kliver ut på andra sidan.</p></div>
    <div class="box trap"><p>Protein betyder inte energi. Underlättad diffusion använder protein men är ändå passiv, eftersom ämnet fortfarande går från hög till låg koncentration.</p><p>Bärarprotein eller pump? Båda binder ämnet och ändrar form. Bärarproteinet arbetar med gradienten utan energi, och pumpen arbetar mot gradienten med ATP ({{go:k5.pumpen|pumparna}}).</p></div>
    <div class="box fab"><p>Kanalproteinet är en <b>grind</b> i tullmuren som bara öppnas för en sorts vara. Bärarproteinet är en <b>svängdörr</b> som tar en vara i taget. Ingen av dem tar betalt, eftersom varorna ändå är på väg nedför backen.</p></div>
    <div class="box link"><p>I {{go:k3.proteiner|K3}} lärde du dig att transportproteinerna i membranet antingen bildar en kanal eller ändrar form när molekylen binder. Här får de namn: kanalproteiner och bärarproteiner.</p></div>
    <div class="box tr" data-t="nyckel" data-h="Bara rätt ämne">Transportproteinerna är specifika. Ett bärarprotein binder bara sitt eget ämne, ungefär som ett lås som bara passar en nyckel. Samma princip gäller receptorerna i cellmembranet ({{go:k3.proteiner|K3}}) och LDL-receptorn ({{go:k5.ldl|LDL}}).</div>
    <div class="x" data-x="mcUnder"></div>
  `},
  {id:"osmos",h:"Osmos",nav:"Osmos",src:"s. 33 · PPT Transport bild 13–14 · Arbetsblad",prov:true,html:`
    <p>En vattenmolekyl är inte speciellt stor, men den har ändå inte helt lätt att ta sig igenom fosfolipidskiktet, eftersom den är <b>polär</b>. Det underlättas av att cellmembranet innehåller <b>aquaporiner</b>, vattenkanaler genom vilka vattenmolekyler kan diffundera. Antalet vattenkanaler varierar mellan olika celler, och vissa kan stängas vid behov. {{prov}}</p>
    <p>En cell innehåller <b>många vattenkanaler</b> jämfört med jonkanaler och bärarproteiner. Därför har vatten lättare än andra ämnen att följa sin koncentrationsgradient in i och ut ur en cell. Det är bakgrunden till fenomenet <b>osmos</b>. {{prov}}</p>
    <div class="box key"><p><b>Osmos</b> är "vattnets diffusion över ett semipermeabelt membran". {{prov}} {{src:s. 33}}</p><p>Semipermeabelt betyder halvgenomträngligt. Membranet släpper igenom vatten lätt, men lösta ämnen som saltjoner mycket sämre.</p></div>
    <h3>Mer löst ämne betyder mindre vatten</h3>
    <p>Om man löser ett ämne i vatten tar ämnets molekyler eller joner upp det utrymme som vattenmolekylerna hade förut. Därför har en lösning med hög koncentration av ett löst ämne <b>lägre vattenkoncentration</b> än rent (destillerat) vatten.</p>
    <p>Vatten diffunderar från hög <b>vattenkoncentration</b> till låg. Boken kallar också hög vattenkoncentration för hög <b>vattenpotential</b>.</p>
    <h3>Röda blodkroppen</h3>
    <ol class="chainv"><li>En röd blodkropp läggs i en <b>stark saltlösning</b>.</li><li>Saltlösningen har lägre vattenkoncentration än cellens insida.</li><li>Vatten transporteras från den högre vattenkoncentrationen inuti cellen till den lägre i saltlösningen.</li><li>Blodkroppen töms på mycket av sitt vatten och <b>krymper</b>.</li></ol>
    <p>I <b>destillerat vatten</b> sker det omvända. Lösningen har då högre vattenkoncentration än cellen. Vattenmolekylerna följer återigen koncentrationsgradienten, men nu är den motsatt riktad, och därför diffunderar vatten in. Cellen <b>sväller och kanske till slut sprängs</b>. {{prov}}</p>
    <p>För att blodkroppens vatteninnehåll inte ska påverkas måste den ligga i en lösning som har <b>samma koncentration av lösta ämnen</b> som cellens cytoplasma. Då blir också vattenkoncentrationen densamma, och lika många vattenmolekyler diffunderar in i som ut ur cellen.</p>
    <div class="lfig-h" data-fig="rbk"></div>
    <table class="cmp"><tr><th></th><th>Hypoton</th><th>Isoton</th><th>Hyperton</th></tr>
      <tr><td>Lösta ämnen</td><td>låg halt (destillerat vatten)</td><td>samma halt som i cellen</td><td>hög halt (stark saltlösning)</td></tr>
      <tr><td>Vatten utanför</td><td>högre än i cellen</td><td>samma</td><td>lägre än i cellen</td></tr>
      <tr><td>Vattnet</td><td>in</td><td>lika mycket in som ut</td><td>ut</td></tr>
      <tr><td>Blodkroppen</td><td>sväller, kan spricka</td><td>påverkas inte</td><td>krymper</td></tr></table>
    <p>Orden hypoton, isoton och hyperton står i bokens bildtext. De beskriver halten av <b>lösta ämnen</b> i lösningen runt cellen.</p>
    <div class="w" data-w="k5Osmos"></div>
    <h3>Varför följer inte saltet med?</h3>
    <p>Man kan undra varför saltjonerna inte också följer sina koncentrationsgradienter och diffunderar in i och ut ur cellen på samma sätt som vatten. Svaret är att det finns <b>färre jonkanaler än vattenkanaler</b>, och därför är transporten av saltjoner mycket långsammare. {{prov}}</p>
    <div class="box diff"><p><b>Boken:</b> saltjonerna rör sig mycket långsammare än vattnet, eftersom det finns färre jonkanaler än vattenkanaler (s. 33). <b>Läraren:</b> saltjonerna är "för stora för att passera genom membranets porer". {{diff:Transport bild 13}}</p><p>Svara med bokens förklaring på provet. Joner kan ta sig över membranet genom jonkanaler, men det går mycket långsammare än för vatten.</p></div>
    <h3>Lärarens bägarförsök</h3>
    <div class="box lek"><p>Osmos uppstår vid ett <b>halvgenomträngligt</b> (semipermeabelt) membran med vätskelösning på båda sidor, när två villkor är uppfyllda. {{lek:Transport bild 13}}</p><ul><li>De lösta ämnena kan inte passera membranet, men <b>lösningsmedlet</b> (oftast vatten) kan det.</li><li>De lösta partiklarna är ojämnt fördelade på de två sidorna.</li></ul><p>Då rör sig lösningsmedlet spontant genom membranet, så att volymen ökar på den sida där det finns mest löst ämne. Därför kan vätskenivån bli olika på de två sidorna. Ett föremål med lösta partiklar sväller när lösningsmedel strömmar in, och ett vattenhaltigt föremål krymper i vatten med hög halt av lösta partiklar.</p></div>
    <div class="lfig-h" data-fig="bagare"></div>
    <div class="box trick"><p>Hyp-<b>O</b>-ton: vattnet går in och cellen blir rund som ett <b>O</b> och kan spricka. Hyp-<b>ER</b>-ton: för mycket löst ämne utanför, och cellen skrynklar ihop sig.</p><p>Vattnet söker sig dit det finns <b>mest löst ämne</b>, alltså dit det finns minst vatten.</p></div>
    <div class="box trap"><p>Hypoton och hyperton beskriver halten <b>lösta ämnen</b> i lösningen utanför. En hypoton lösning har lite löst ämne och alltså mycket vatten, och därför går vattnet in.</p><p>Osmos gäller bara vatten. Rör sig salt eller glukos är det vanlig diffusion.</p><p>Isoton betyder inte att vattnet står still. Lika mycket vatten går in som ut.</p></div>
    <div class="box fab"><p>Aquaporinerna är fabrikens <b>vattenledningar</b> genom tullmuren. Det finns många fler vattenledningar än grindar för joner, och därför hinner vattnet flytta sig långt innan saltet har kommit någonstans.</p></div>
    <div class="box link"><p>En växtcell i destillerat vatten tar också upp vatten, men den spricker inte, eftersom cellväggen håller emot ({{go:k13.cellvaggen|cellväggen i K13}}). Trycket mot väggen kallas turgor ({{go:k13.vakuolen|vakuolen i K13}}).</p></div>
    <div class="box tr" data-t="osmos" data-h="Röd blodkropp utan skydd">Den röda blodkroppen har bara sitt cellmembran, och därför kan den spricka i en hypoton lösning. Växtcellen har en cellvägg som tar emot trycket och får turgor i stället ({{go:k13.vakuolen|K13}}).</div>
    <div class="x" data-x="fixOsmos"></div>
  `},
  {id:"osmosfilm",h:"Osmos på djupet (filmen)",nav:"Osmos på djupet",src:"Film Osmos · Lektion (via klasskamratens sammanfattning)",lek:true,html:`
    <div class="box lek" data-h="Från lärarens film"><p>Den här sektionen bygger på lärarens film "Osmos, del 1. Vattnets diffusion genom ett semipermeabelt membran" och på en lektion. Vi har inte sett filmen själva. Innehållet kommer från en klasskamrats sammanfattning (sidan Biologiatlas). Om något skiljer sig från boken gäller boken. {{lek:Film Osmos}}</p><p>Grunderna står i {{go:k5.osmos|Osmos}}. Här går vi djupare: akvaporinens insida, siffror för osmolalitet och osmos i kroppen och i köket.</p></div>
    <h3>Akvaporinens insida</h3>
    <p><b>Akvaporiner</b> (boken skriver aquaporiner) är proteinkanaler i cellmembranet som bara släpper igenom vattenmolekyler. De behövs, eftersom vatten är polärt medan membranets inre består av opolära fettsyror. Utan akvaporiner passerar vatten mycket långsamt. {{lek:Film Osmos}}</p>
    <p>Med akvaporiner går osmosen snabbare. Därför kan cellerna reglera vattenflödet snabbt nog för att hålla vattenbalansen i vävnaderna. <b>Njurceller</b> och <b>blodkärlsceller</b> är extra beroende av akvaporiner. Vissa akvaporiner kan öppnas eller stängas på signal från kroppen, och det stämmer med boken, som säger att vissa vattenkanaler kan stängas vid behov. {{lek:Film Osmos}}</p>
    <ol class="chainv"><li>Inuti kanalen sitter aminosyror med <b>positivt laddade sidogrupper</b>.</li><li>De drar till sig vattenmolekylens partiellt negativa syreatom.</li><li>Vattenmolekylerna vänds åt rätt håll och passerar i <b>en enda rad</b>.</li><li>Laddningen bildar samtidigt en <b>barriär mot protoner (H⁺)</b>, och därför bevaras cellens elektriska balans.</li></ol>
    <div class="lfig-h" data-fig="akva"></div>
    <div class="box key"><p>En akvaporin släpper bara igenom vattenmolekyler. De positiva laddningarna inne i kanalen vänder vattnet rätt och stoppar protonerna. {{lek:Film Osmos}}</p></div>
    <h3>Osmolalitet</h3>
    <p><b>Osmolalitet</b> är ett mått på antalet <b>osmotiskt aktiva partiklar</b> per kilogram lösningsmedel. Osmotiskt aktiva partiklar är ämnen som kan dra till sig och binda vatten, till exempel sockermolekyler och saltjoner. De minskar antalet fria vattenmolekyler. {{lek:Film Osmos}}</p>
    <p>Därför går nettoflödet av vatten från <b>låg till hög osmolalitet</b>, alltså från låg till hög partikelkoncentration. Det är samma sak som bokens "från hög vattenkoncentration till låg", sett från partiklarnas håll.</p>
    <table class="cmp"><tr><th></th><th>Osmolalitet</th><th>Osmolaritet</th></tr>
      <tr><td>Partiklar per</td><td>kilogram lösningsmedel</td><td>liter lösning</td></tr>
      <tr><td>Enhet</td><td>osmol/kg, mOsm/kg</td><td>osmol/L, mOsm/L</td></tr>
      <tr><td>Används</td><td>filmens mått</td><td>ofta i sjukvården</td></tr></table>
    <p>1 osmol/kg betyder 1 mol, ungefär 6,022 × 10²³, osmotiskt aktiva partiklar per kilogram lösningsmedel. I sjukvården anges ofta mOsm/L, per liter lösning, och då är det egentligen <b>osmolaritet</b>. {{lek:Film Osmos}}</p>
    <table class="cmp"><tr><th>Lösningen</th><th>mOsm/kg</th><th>Vattnet</th><th>Cellen</th></tr>
      <tr><td>Hypoton</td><td>under ca 280</td><td>in</td><td>sväller, kan spricka</td></tr>
      <tr><td>Isoton</td><td>ca 280–295</td><td>lika in som ut</td><td>ingen volymändring</td></tr>
      <tr><td>Hyperton</td><td>högre än i cellen</td><td>ut</td><td>krymper</td></tr></table>
    <p>Isoton betyder samma osmolalitet som <b>blodplasman</b>, och ungefär som cytosolen, alltså ca <b>280–295 mOsmol/kg</b>. {{lek:Film Osmos}}</p>
    <div class="box trick"><p>Vattnet följer partiklarna. Hög osmolalitet drar vatten till sig.</p><p>Osmola<b>L</b>itet räknar per ki<b>L</b>o lösningsmedel. Osmola<b>R</b>itet räknar per liter, alltså per <b>R</b>ymd.</p><p>"Två åttio till två nittiofem" är blodets normalzon.</p></div>
    <h3>Röda blodkroppar och växtceller</h3>
    <table class="cmp"><tr><th></th><th>Hyperton</th><th>Isoton</th><th>Hypoton</th></tr>
      <tr><td>Röd blodkropp</td><td>vatten ut, krymper och blir skrynklig</td><td>normal form och funktion</td><td>vatten in, sväller och kan spricka (<b>hemolys</b>)</td></tr>
      <tr><td>Växtcell</td><td><b>plasmolys</b>, membranet drar sig från cellväggen, växten slokar</td><td>i balans, <b>flaccid</b> (slapp)</td><td><b>turgid</b> (spänd), turgortrycket ökar, spricker inte</td></tr>
      <tr><td>Filmens bildord</td><td>plasmolyzed</td><td>flaccid</td><td>turgid</td></tr></table>
    <p>En röd blodkropp i en hyperton lösning kan få sämre <b>syretransport</b>, eftersom hemoglobinet packas tätare och cellens form förändras. I vanligt vatten spricker den lätt, eftersom djurceller saknar cellvägg. {{lek:Film Osmos}}</p>
    <p>En växtcell i en hypoton lösning sväller och turgortrycket ökar. Den spricker ändå inte, eftersom cellväggen håller emot, och den höga turgorn gör växten spänstig. I en hyperton lösning lämnar vattnet cellen, cytoplasman minskar och cellmembranet drar sig bort från den stela cellväggen. Det kallas <b>plasmolys</b>, och växten slokar, eftersom den förlorar sitt turgortryck. {{lek:Film Osmos}}</p>
    <p>En övervattnad växt får inga spruckna celler, eftersom cellväggen håller emot. Faran är <b>syrebrist i rötterna</b>, eftersom blöt jord blir syrefattig. {{lek:Film Osmos}}</p>
    <div class="w" data-w="k5Osml"></div>
    <div class="box tr" data-t="osmos" data-h="Hemolys eller turgor">I samma hypotona lösning spricker den röda blodkroppen (hemolys), medan växtcellen bara blir turgid, eftersom cellväggen tar emot trycket. Cellväggen och vakuolen går du igenom i {{go:k13.vakuolen|K13}}.</div>
    <h3>Konservering med salt och socker</h3>
    <p><b>Konservering</b> betyder att man bevarar livsmedel så att de håller längre och inte förstörs av mikroorganismer eller kemiska förändringar. Metoderna är saltning, sockring, torkning, kylning eller frysning, sterilisering eller pastörisering och konserveringsmedel. {{lek:Film Osmos}}</p>
    <ol class="chainv"><li>Maten får mycket salt eller socker.</li><li>Osmolaliteten blir högre utanför mikroorganismerna än inne i dem.</li><li>Vatten lämnar deras celler genom osmos.</li><li>Cellerna krymper.</li><li>Tillväxt och förökning hämmas.</li><li>Maten håller längre.</li></ol>
    <p>Saltning används till exempel för saltad fisk, skinka och pickles. Sockring används för sylt, marmelad och koncentrerad fruktjuice. {{lek:Film Osmos}}</p>
    <div class="x" data-x="orderKons"></div>
    <div class="box link"><p>Bakterier i maten, både nyttiga och farliga, finns i {{go:k8.mat|K8}}. Där ser du varför det är viktigt att hämma deras förökning.</p></div>
    <h3>Hyponatremi och hjärnödem</h3>
    <p><b>Hyponatremi</b> betyder låg natriumkoncentration i blodplasman och andra kroppsvätskor. Den kan bero på överdrivet vattenintag, vissa sjukdomar, njurproblem eller läkemedel, och den påverkar muskler, nerver och hjärta. {{lek:Lektion}}</p>
    <ol class="chainv"><li>Man dricker för mycket vatten.</li><li>Blodplasman späds ut.</li><li>Osmolaliteten och Na⁺ blir låga (<b>hypoton hyponatremi</b>).</li><li>Vatten går in i cellerna genom osmos.</li><li>Cellerna sväller.</li><li>I hjärnan blir det <b>hjärnödem</b>, och det är livsfarligt.</li></ol>
    <table class="cmp"><tr><th></th><th>Hypoton hyponatremi</th><th>Hyperton hyponatremi</th></tr>
      <tr><td>Na⁺</td><td>låg</td><td>låg</td></tr>
      <tr><td>Osmolalitet</td><td>låg</td><td>hög</td></tr>
      <tr><td>Exempel</td><td>för mycket vatten, vanligast</td><td>mycket högt blodsocker</td></tr>
      <tr><td>Hjärnödem</td><td>kan uppstå</td><td>lektionen nämner det inte</td></tr></table>
    <p>Hjärnödem är farligt, eftersom hjärnan ligger i ett hårt kranium med begränsat utrymme. När cellerna sväller ökar det <b>intrakraniella trycket</b>. Trycket pressar ihop blodkärlen, blodflödet minskar och hjärnan får syrebrist. Blir trycket för högt kan hjärnstammen pressas ner mot skallbasen, och hjärnstammen styr andning och hjärtfrekvens. {{lek:Lektion}}</p>
    <div class="x" data-x="orderHypo"></div>
    <h3>Hur mycket vatten?</h3>
    <p>Kroppen klarar normalt <b>2–3 liter</b> vatten per dag, bland annat tack vare njurarnas utsöndring. Dricker man mer än <b>3–4 liter på kort tid</b> kan njurarna inte hinna med, och elektrolyterna späds ut. Det kan ge hypoton hyponatremi. Vuxna bör få i sig ungefär <b>2–2,5 liter</b> vätska per dag från dryck och mat. {{lek:Lektion}}</p>
    <p><b>Destillerat vatten</b> saknar saltjoner, och därför sänker det natrium och osmolalitet snabbare. <b>Kranvatten</b> innehåller små mängder Ca²⁺, Mg²⁺, Na⁺ och K⁺, och de mildrar effekten. {{lek:Lektion}}</p>
    <h3>Havsvatten</h3>
    <p>"Vatten, vatten överallt, men inte en droppe att dricka" är ett engelskt sjömansuttryck. Blodplasman har ungefär <b>0,9 % salt</b> och 280–295 mOsm/kg. Havsvatten har ungefär <b>3,5 % salt</b> och ca <b>1 000 mOsm/kg</b>. Därför gör havsvatten kroppen mer uttorkad. {{lek:Lektion}}</p>
    <table class="cmp"><tr><th>Var</th><th>Vad händer</th><th>Följd</th></tr>
      <tr><td>Tarmen</td><td>hög salthalt drar vatten från tarmväggens celler ut i tarmen</td><td>diarré och vätskeförlust</td></tr>
      <tr><td>Blodet</td><td>saltet tas upp, blodets osmolalitet ökar och drar vatten ur kroppens celler</td><td>cellulär dehydrering i hjärna, hjärta och andra organ, organsvikt</td></tr>
      <tr><td>Njurarna</td><td>utsöndrar överskottssaltet i urinen, och det kräver vatten</td><td>ännu värre uttorkning</td></tr></table>
    <div class="x" data-x="chainHav"></div>
    <h3>Fysiologisk koksaltlösning</h3>
    <p><b>Fysiologisk koksaltlösning</b> är en isoton vätskeersättning och den vanligaste intravenösa lösningen (dropp). {{lek:Lektion}}</p>
    <div class="box key"><p>0,9 % NaCl = 9 g/L = <b>154 mmol/L</b> Na⁺. Varje NaCl ger två partiklar (Na⁺ och Cl⁻), och därför blir det 154 × 2 = <b>308 mOsmol/L</b>. Lösningen är funktionellt isoton men tekniskt svagt hyperton. {{lek:Lektion}}</p></div>
    <p>Lösningen togs fram på <b>1800-talet</b>. Man testade olika koncentrationer av NaCl på blodkroppar, och 0,9 % bevarade formen bäst. Teoretiskt är <b>0,86 %</b> mer exakt. {{lek:Lektion}}</p>
    <p>Den används vid uttorkning efter kräkningar, diarré eller svettning, vid blodförlust för att hålla uppe blodvolym och blodtryck och som bärare för läkemedel. Den ger ingen risk för hypoton hyponatremi eller hjärnödem, eftersom den är isoton. {{lek:Lektion}}</p>
    <p><b>Ringer-Acetat</b> innehåller dessutom buffrande ämnen som stabiliserar pH. Därför är den bättre vid stora vätskeförluster, kirurgi och längre infusioner, eftersom mycket stora mängder koksaltlösning kan påverka blodets pH. {{lek:Lektion}}</p>
    <div class="w" data-w="k5Nacl"></div>
    <div class="box trap"><p>Rent vatten ges aldrig i dropp. Det är hypotont, och därför skulle det ge hemolys och hjärnödem.</p><p>Vatten går mot <b>hög</b> osmolalitet, eftersom många partiklar betyder få fria vattenmolekyler.</p><p>Hyperton hyponatremi har låg Na⁺ men hög osmolalitet, till exempel vid mycket högt blodsocker.</p><p>308 mOsmol/L ligger över 280–295, och därför säger läraren "tekniskt svagt hyperton" men "funktionellt isoton".</p></div>
    <div class="box fab"><p>Akvaporinen är fabrikens vattenledning med en <b>vakt</b> i porten. De positiva laddningarna vänder varje vattenmolekyl rätt och släpper in dem en och en, men protonerna får inte passera. Saltning av maten gör tvärtom mot konkurrenten: bakteriens verkstad torkar ut, och därför kan den inte växa.</p></div>
    <div class="box tr" data-t="osmos" data-h="Koksalt i droppet">Fysiologisk koksaltlösning, 0,9 % NaCl, är isoton med blodplasman. Därför sväller eller krymper blodkropparna inte, medan rent vatten i blodet skulle ge hemolys. Samma princip, lika mycket löst ämne på båda sidor, gäller för alla celler i guiden.</div>
    <div class="x" data-x="sortTon"></div>
  `},
  {id:"aktiv",h:"Aktiv transport",nav:"Aktiv transport",src:"s. 34 · PPT Transport bild 15 · Arbetsblad",prov:true,html:`
    <p>För att en cell ska kunna ta upp och avge ämnen efter behov måste den också kunna transportera ämnen <b>mot koncentrationsgradienten</b>, alltså från en lägre till en högre koncentration.</p>
    <p>Med backen blir det tydligt. Nu ska föremålet rullas <b>uppför</b> backen, och det kräver energi ({{go:k5.diffusion|backen}}). Därför kallas transport över ett cellmembran mot koncentrationsgradienten för <b>aktiv transport</b>. {{prov}}</p>
    <div class="box key"><p><b>Aktiv transport</b> är transport över ett cellmembran mot koncentrationsgradienten, från lägre till högre koncentration. Den kräver två saker. {{prov}} {{src:s. 34}}</p><ol><li><b>Energi.</b></li><li>Ett <b>membrantransportprotein</b> som binder specifikt till det ämne som ska transporteras.</li></ol></div>
    <p>Det finns olika sätt att lösa den energikrävande transporten. Det sker antingen genom <b>kopplad transport</b> eller genom <b>ATP-drivna proteinpumpar</b>. Hos vissa <b>bakterier och arkéer</b> finns det dessutom proteinpumpar som drivs av <b>solenergi</b>.</p>
    <div class="lfig-h" data-fig="oversikt"></div>
    <table class="cmp"><tr><th></th><th>Riktning</th><th>Energi</th><th>Med hjälp av</th></tr>
      <tr><td>Diffusion (passiv transport)</td><td>hög → låg</td><td>nej</td><td>ingenting, rakt genom fosfolipidskiktet</td></tr>
      <tr><td>Underlättad diffusion</td><td>hög → låg</td><td>nej</td><td>kanalprotein eller bärarprotein</td></tr>
      <tr><td>Aktiv transport med ATP-pump</td><td>låg → hög</td><td>ja, ATP direkt</td><td>proteinpump</td></tr>
      <tr><td>Kopplad transport</td><td>ett ämne låg → hög, ett annat hög → låg</td><td>ja, ATP indirekt</td><td>transportprotein och ett annat ämnes gradient</td></tr></table>
    <div class="box lek"><p>Läraren har samma fyra punkter: transport mot gradienten, kräver energi, kräver ett membrantransportprotein, och sker genom kopplad transport eller ATP-drivna proteinpumpar. Solenergipumparna nämns inte. {{lek:Transport bild 15}}</p><p>Arbetsbladet skriver bara att aktiv transport sker med hjälp av proteinpumpar som drivs av ATP. Kunna bokens två sätt och solenergipumparna. {{src:Arbetsblad Transport}}</p></div>
    <div class="box trick"><p>Riktningen avgör. <b>Med</b> gradienten = passiv, gratis. <b>Mot</b> gradienten = aktiv, kostar energi.</p></div>
    <div class="box trap"><p>Aktiv transport kräver både energi och ett specifikt membrantransportprotein. Det räcker inte att svara "det kräver energi".</p><p>Ett protein i membranet betyder inte att transporten är aktiv. Underlättad diffusion använder också protein.</p></div>
    <div class="box fab"><p>Aktiv transport är en <b>rulltrappa uppför backen</b>. Den kostar ATP-mynt, eftersom varorna ska till den sida där det redan finns mest av dem.</p></div>
    <div class="box tr" data-t="atp" data-h="Gratis eller betalt">Passiv transport kostar ingenting. Aktiv transport kostar energi, och fabrikens mynt är ATP ({{go:k6.atp|K6}}). Det mesta av ATP:t bildas i mitokondrierna, fabrikens kraftverk ({{go:k4.mitokondrien|K4}}).</div>
    <div class="x" data-x="sortPassAkt"></div>
  `},
  {id:"kopplad",h:"Kopplad transport",nav:"Kopplad transport",src:"s. 34–35 · PPT Transport bild 17–18 · Arbetsblad",prov:true,html:`
    <p>Vid <b>kopplad transport</b> (<b>co-transport</b>) kopplas transporten av ett ämne ihop med transporten av ett annat ämne. Det ämne som ska transporteras <b>mot</b> sin koncentrationsgradient kopplas till ett ämne som <b>diffunderar</b>, alltså följer sin koncentrationsgradient. {{prov}}</p>
    <div class="box key"><p>Bokens liknelse är ett <b>vattenfall</b>. Lägesenergin som frigörs när vattnet faller kan driva ett hjul, och hjulet skulle kunna transportera något uppför fallet. {{src:s. 34}}</p><p>Ämnet som diffunderar är vattnet som faller. Ämnet som följer med är det som lyfts uppför.</p></div>
    <h3>Därför krävs ATP, fast indirekt</h3>
    <p>Även ett ämne som transporteras på det här sättet kräver <b>indirekt energi i form av ATP</b>. Koncentrationen av det ämne vars diffusion driver transporten måste nämligen upprätthållas. Utan koncentrationsgradient ingen diffusion. Därför måste ämnet pumpas tillbaka, och till det krävs ATP. {{prov}}</p>
    <p>Den kopplade transporten består alltså av <b>två delar</b>.</p>
    <ol class="chainv"><li><b>Del 1 bygger backen.</b> Cellen bygger upp en koncentrationsgradient, vanligen av <b>natriumjoner eller vätejoner</b>. Det kostar ATP.</li><li><b>Del 2 åker nedför.</b> Jonerna diffunderar tillbaka genom ett transportprotein, och deras diffusion driver transporten av det andra ämnet mot dess gradient.</li></ol>
    <div class="box lek"><p>Läraren kallar kopplad transport för <b>sekundär aktiv transport</b>. Ett ämne transporteras genom att utnyttja energin från att ett annat ämne samtidigt rör sig längs sin koncentrationsgradient. ATP-pumparna, där ATP används direkt, kallas på bild 16 <b>primär aktiv transport</b>. {{lek:Transport bild 16–17}}</p><p>Om två ämnen går <b>samma väg</b> kallas det <b>symport</b>, som Na⁺ och glukos som båda går in i tarmcellen. Om de går <b>åt motsatta håll</b> kallas det <b>antiport</b>, som Na⁺ ut och K⁺ in i natrium-kaliumpumpen. {{lek:Transport bild 18}}</p></div>
    <div class="lfig-h" data-fig="antisym"></div>
    <p>Läraren beskriver kopplad transport i fyra steg, med glukos i tunntarmen som exempel. Glukos tas upp från tarmen till cellerna genom en transportör som samtidigt släpper in natriumjoner. Na⁺ rör sig <b>med</b> sin koncentrationsgradient, och glukos transporteras <b>mot</b> sin. Energin kommer indirekt från ATP som tidigare använts för att pumpa ut Na⁺ ur cellen. {{lek:Transport bild 18}}</p>
    <div class="x" data-x="orderSteg"></div>
    <div class="w" data-w="k5Symport"></div>
    <h3>Kunskaper om kopplad transport räddar liv</h3>
    <p>Bokens faktaruta handlar om <b>Robert K. Crane</b> (1919–2010). Han upptäckte den kopplade transporten av natrium och glukos hos tarmceller. Upptäckten har fått stor praktisk betydelse i delar av världen som saknar rent dricksvatten, där vattnet till exempel är förorenat med <b>kolerabakterier</b>. {{prov}}</p>
    <ol class="chainv"><li>Normalt <b>reabsorberas</b> (återupptas) en stor mängd natriumjoner i tarmen.</li><li>Vid <b>diarré</b> passerar avföringen så snabbt genom tarmen att reabsorptionen inte hinner ske.</li><li>Förlusten av natriumjoner stör kroppens <b>jonbalans</b>.</li><li>Det kan leda till döden, genom uttorkning.</li></ol>
    <div class="box key"><p>Natriumjoner tas upp via tarmens <b>epitelceller</b> genom kopplad transport till glukos. <b>Två natriumjoner transporteras för varje glukosmolekyl.</b> {{prov}} {{src:s. 35}}</p><p>För att natrium ska kunna tas upp i tarmen måste det därför samtidigt finnas glukos. Därför får patienter med vätskebrist dricka en lösning som innehåller både <b>salt (NaCl) och glukos</b>.</p></div>
    <p>Upptäckten har räddat livet på massor av människor och bidragit till att minska <b>barndödligheten</b> i många U-länder.</p>
    <div class="box trick"><p>Natrium betalar biljetten åt glukos. <b>Två Na⁺ per glukos</b>, och biljetterna köps till slut med ATP.</p><p><b>Sym</b>port = <b>sam</b>ma håll. <b>Anti</b>port = <b>mot</b>satt håll.</p></div>
    <div class="box trap"><p>"Kopplad transport kräver ingen energi" är fel. Den kräver energi indirekt, i form av ATP som håller natriumgradienten uppe.</p><p>Det är natriumet som går med sin gradient och glukoset som går mot sin. Det är lätt att vända på dem.</p><p>Drycken måste innehålla glukos. Utan glukos tar tarmen inte upp natriumet.</p></div>
    <div class="box fab"><p>Kopplad transport är fabrikens <b>vattenfall</b>. ATP-pumpen pumpar upp vattnet (natriumjonerna) till toppen. När vattnet faller tillbaka driver det ett hjul som lyfter en annan vara (glukos) uppför. Hjulet behöver ingen egen ström, men utan pumpen torkar fallet ut.</p></div>
    <div class="box tr" data-t="atp" data-h="ATP i andra hand">Kopplad transport använder ingen ATP direkt. Ändå stannar den utan ATP, eftersom natrium-kaliumpumpen måste hålla natriumgradienten uppe ({{go:k5.pumpen|pumpen}}). Hur cellen får sin ATP ser du i {{go:k6.kraftverk|K6}}.</div>
    <div class="box link"><p>Kolera orsakas av bakterier som sprids med förorenat vatten. Bakterier som ger sjukdomar finns i {{go:k8.sjukdomar|K8}}.</p></div>
    <div class="x" data-x="chainKopp"></div>
  `},
  {id:"pumpen",h:"ATP-drivna proteinpumpar",nav:"ATP-pumpar",src:"s. 35 · PPT Transport bild 16, 19 · Arbetsblad",prov:true,html:`
    <p>Många ämnen kan pumpas över membranet mot sin koncentrationsgradient av proteiner. Proteinerna utnyttjar den energi som frigörs när <b>ATP hydrolyseras till ADP</b>, alltså när ATP "tappar" ett fosfat. {{prov}}</p>
    <ol class="chainv"><li>ATP hydrolyseras till ADP och fosfat.</li><li>Energi frigörs.</li><li>Energin överförs till <b>proteinpumpen</b>.</li><li>Ämnet som binder till pumpen kan transporteras till andra sidan membranet, mot sin gradient.</li></ol>
    <div class="box key"><p>Den stora fördelen med ATP-drivna proteinpumpar är att transporten fungerar <b>oberoende av koncentrationsgradienter</b>. {{src:s. 35}}</p><p>Den så kallade <b>natrium-kaliumpumpen</b> fyller en oerhört viktig funktion när det gäller att upprätthålla <b>jonbalansen</b> i våra celler. Ungefär <b>40 %</b> av det ATP som produceras i en cell går åt till att driva den. {{prov}}</p></div>
    <p>Pumparna fungerar oberoende av gradienter, eftersom energin kommer direkt från ATP. Kopplad transport behöver däremot ett annat ämnes gradient att åka på.</p>
    <h3>Natrium-kaliumpumpen</h3>
    <div class="box lek"><p>Läraren visar mer om pumpen. {{lek:Transport bild 16, 19}}</p><ul><li>Natrium-kaliumpumpen är en proteinpump i <b>djurs</b> cellmembran.</li><li>Den flyttar ut <b>tre natriumjoner (Na⁺)</b> och in <b>två kaliumjoner (K⁺)</b>.</li><li>Därför har natrium högre koncentration utanför cellen än innanför, och kalium tvärtom.</li><li>Förflyttningen går emot diffusionskraften och kräver energi. Ett ATP (adenosintrifosfat) krävs vid varje förflyttning. ATP hydrolyseras, och en <b>fosfatgrupp binds till pumpen</b>.</li><li>Bild 16 kallar pumpen <b>primär aktiv transport</b>, en ATP-driven pump som kräver ATP.</li></ul><p>Fotot av bokens s. 38 saknas, men genom pappret syns spegelvänd text därifrån: "…joner (K⁺) samtidigt som den pumpar ut tre natriumjo[ner]…". Boken verkar alltså ta upp samma siffror på s. 38.</p></div>
    <div class="box diff"><p><b>Boken:</b> ungefär <b>40 %</b> av det ATP som produceras i en cell går till natrium-kaliumpumpen (s. 35). <b>Läraren:</b> natrium-kaliumpumparna använder <b>10–40 %</b> av cellens ATP-produktion. {{diff:Transport bild 19}}</p><p>Svara "ungefär 40 %" enligt boken, men känn igen lärarens intervall.</p></div>
    <div class="w" data-w="k5Pump"></div>
    <table class="cmp"><tr><th></th><th>Kanalprotein</th><th>Bärarprotein</th><th>Pump</th></tr>
      <tr><td>Riktning</td><td>med gradienten</td><td>med gradienten</td><td>mot gradienten</td></tr>
      <tr><td>Energi</td><td>nej</td><td>nej</td><td>ATP direkt</td></tr>
      <tr><td>Hur</td><td>vattenfylld kanal som öppnas och stängs</td><td>binder ämnet och ändrar form</td><td>binder ämnet och får energi från ATP</td></tr>
      <tr><td>Exempel</td><td>jonkanaler, aquaporiner</td><td>bärarprotein för glukos</td><td>natrium-kaliumpumpen</td></tr>
      <tr><td>I fabriken</td><td>grind</td><td>svängdörr</td><td>rulltrappa uppför</td></tr></table>
    <div class="box lek"><p><b>Digoxin</b> är ett hjärtläkemedel som hämmar natrium-kaliumpumpen. {{lek:Transport bild 16}}</p><ol class="chainv"><li>Digoxin hämmar Na⁺/K⁺-pumpen.</li><li>Natriumhalten inne i cellen ökar.</li><li>Na⁺/Ca²⁺-pumpen kan då inte fungera.</li><li>Hjärtmuskelns kontraktionskraft ökar.</li></ol><p>Att kraften ökar beror på att mer kalcium stannar kvar i hjärtmuskelcellen. {{extra}}</p></div>
    <div class="box trick"><p><b>Tre ut, två in.</b> Natriumet åker ut till "havet" utanför cellen, där det redan är salt. Kaliumet samlas inne.</p><p>Fyra av tio ATP-mynt går till natrium-kaliumpumpen.</p></div>
    <div class="box trap"><p>Det är pumpen som får energin från ATP. Energin gör att pumpen kan flytta ämnet som binder till den.</p><p>Na⁺ pumpas <b>ut</b> och K⁺ pumpas <b>in</b>. Det är lätt att vända på dem.</p><p>40 % gäller just natrium-kaliumpumpen, inte all aktiv transport.</p></div>
    <div class="box fab"><p>ATP-pumpen är fabrikens <b>rulltrappa uppför</b>. Varje tur kostar ett ATP-mynt. Natrium-kaliumpumpen är den dyraste rulltrappan i fabriken och slukar ungefär fyra av tio mynt.</p></div>
    <div class="box tr" data-t="atp" data-h="Den största ATP-kunden">Natrium-kaliumpumpen använder ungefär 40 % av cellens ATP, eftersom den hela tiden måste hålla jonbalansen uppe. Fler ATP-förbrukare hittar du i {{go:k6.forbrukare|K6}}.</div>
    <div class="x" data-x="matchProt"></div>
  `},
  {id:"spanning",h:"Spänning över cellmembranet",nav:"Spänning över membranet",src:"s. 37 (bara rubriken) · PPT Transport bild 16, 19, 20",lek:true,html:`
    <div class="box lek" data-h="Boksidan saknas"><p>Fotot av s. 37 är avklippt precis under rubriken "Spänning över cellmembranet", och s. 38 finns inte med. Bokens text och figur till avsnittet saknas därför. Det du läser här bygger på lärarens bilder 16, 19 och 20. {{lek:Transport bild 16, 19, 20}}</p><p>Genom pappret syns spegelvänd text från s. 38: "…joner (K⁺) samtidigt som den pumpar ut tre natriumjo[ner]…". Avsnittet handlar alltså om natrium-kaliumpumpen. Fotografera s. 37–38 om du vill ha med bokens egen text.</p></div>
    <h3>Laddning över membranet</h3>
    <p>På lärarens bild 16 är cellmembranet <b>positivt laddat på utsidan</b> (+ + +) och <b>negativt laddat på insidan</b> (– – –). Det finns alltså en elektrisk <b>spänning</b> över membranet. {{lek:Transport bild 16}}</p>
    <p>Natrium-kaliumpumpen bidrar till spänningen. Den flyttar ut tre Na⁺ men bara in två K⁺, och därför hamnar en positiv laddning mer utanför för varje varv. På bilden läcker dessutom K⁺ ut genom membranet längs sin gradient. {{lek:Transport bild 16, 19}}</p>
    <ol class="chainv"><li>Pumpen flyttar 3 Na⁺ ut och 2 K⁺ in.</li><li>Mer positiv laddning hamnar utanför.</li><li>K⁺ läcker ut längs sin gradient.</li><li>Utsidan blir positiv och insidan negativ.</li></ol>
    <h3>Elektrokemisk gradient</h3>
    <p>Bild 16 använder ordet <b>elektrokemisk gradient</b>. För joner räcker det inte att titta på koncentrationen, eftersom jonerna också dras till eller stöts bort av laddningen på andra sidan. Den elektrokemiska gradienten är koncentrationsskillnaden och laddningsskillnaden tillsammans. {{extra}}</p>
    <p>På bilden vill Na⁺ in i cellen längs sin elektrokemiska gradient, eftersom det finns mycket Na⁺ utanför. K⁺ vill ut, eftersom det finns mycket K⁺ inne. Pumpen flyttar båda jonerna åt andra hållet, mot gradienterna. {{lek:Transport bild 16}}</p>
    <h3>Aktionspotential i en hjärtmuskelcell</h3>
    <p>Bild 20 visar hur spänningen över membranet i en <b>hjärtmuskelcell</b> ändras när cellen aktiveras. Kurvan kallas en <b>aktionspotential</b>. Spänningen mäts i millivolt (mV) och anger hur laddad insidan är jämfört med utsidan. {{lek:Transport bild 20}}</p>
    <div class="lfig-h" data-fig="ap"></div>
    <table class="cmp"><tr><th>Fas</th><th>Vad händer</th><th>Joner (bild 20)</th></tr>
      <tr><td>4</td><td>vila, ca −96 mV</td><td>K⁺</td></tr>
      <tr><td>0</td><td>spänningen rusar upp till ca +52 mV</td><td>Na⁺ strömmar in snabbt</td></tr>
      <tr><td>1</td><td>en kort topp som faller lite</td><td>K⁺, Cl⁻, en kort utåtriktad ström</td></tr>
      <tr><td>2</td><td>platå</td><td>Ca²⁺ in, K⁺ ut</td></tr>
      <tr><td>3</td><td>spänningen faller tillbaka</td><td>K⁺ ut</td></tr></table>
    <p>Från fas 0 till slutet av fas 3 tar det ungefär <b>200 ms</b>. När Na⁺ strömmar in får insidan mer positiv laddning, och därför stiger kurvan. När K⁺ strömmar ut förlorar insidan positiv laddning, och därför sjunker kurvan tillbaka.</p>
    <div class="box extra"><p>Jonerna strömmar genom jonkanaler som öppnas och stängs, med sina gradienter. Kanalerna för natrium och kalium läste du om under {{go:k5.underlattad|underlättad diffusion}}. Gradienterna har natrium-kaliumpumpen byggt upp i förväg. Fas 0 kallas ofta depolarisation och fas 3 repolarisation.</p></div>
    <div class="box trick"><p>Na⁺ <b>in</b> = kurvan <b>upp</b>. K⁺ <b>ut</b> = kurvan <b>ner</b>. Ca²⁺ håller <b>platån</b>.</p></div>
    <div class="box trap"><p>I vila är <b>insidan negativ</b> (ca −96 mV i hjärtmuskelcellen på bild 20) och utsidan positiv.</p><p>Pumpen flyttar Na⁺ ut. Det är under aktionspotentialens fas 0 som Na⁺ strömmar in.</p></div>
    <div class="box tr" data-t="atp" data-h="Spänningen kostar ATP">Laddningsskillnaden och jongradienterna byggs upp av natrium-kaliumpumpen, som drivs av ATP. Därför går så mycket av cellens ATP till just den pumpen ({{go:k6.forbrukare|K6}}).</div>
    <div class="x" data-x="orderAP"></div>
  `},
  {id:"endocytos",h:"Vesiklar och endocytos",nav:"Endocytos",src:"s. 35–36 · PPT Transport bild 21–23 · Arbetsblad",prov:true,html:`
    <h3>Transport med hjälp av vesiklar</h3>
    <p>Celler kan även ta upp och avge en stor mängd av ett löst ämne eller partiklar, och till och med andra celler. Det sker med hjälp av membranblåsor, <b>vesiklar</b>. {{prov}}</p>
    <div class="box key"><p>Om något tas in i cellen med membranblåsor kallas det <b>endocytos</b>. Om något utsöndras ur cellen kallas det <b>exocytos</b>. <b>Båda transportsystemen kräver energi.</b> {{prov}} {{src:s. 35}}</p></div>
    <h3>Endocytos</h3>
    <p>Många av de ämnen som en cell behöver är för stora för att kunna tas upp via transportproteiner i membranet. De tas i stället upp genom att delar av cellmembranet omsluter det som ska tas upp. <b>Mikrofilamenten</b> i cellskelettet (<b>aktin</b>) gör det möjligt ({{go:k4.cellskelettet|cellskelettet i K4}}).</p>
    <p>Om en cell tar upp stora partiklar via endocytos kallas det <b>fagocytos</b> ("cellätande"). Om vattenlösliga makromolekyler tas upp kallas det <b>pinocytos</b> ("celldrickande"). {{prov}}</p>
    <h3>Pinocytos med receptorer</h3>
    <p>För att ett visst ämne ska tas upp via pinocytos krävs det att cellmembranet har <b>receptorer</b> för just det ämnet. Många stora molekyler tas upp genom att de binder till sådana receptorer på cellen. {{prov}}</p>
    <ol class="chainv"><li>Molekylerna binder till receptorerna på cellen.</li><li>Det leder på något sätt till att cellmembranet buktar in just där.</li><li>Ju fler molekyler som har bundit, desto mer buktar membranet in.</li><li>Till sist snörs hela membranbubblan av och transporteras in i cellen.</li></ol>
    <h3>Fagocytos</h3>
    <p>Vissa celler kan ta upp stora partiklar, till och med hela celler, genom fagocytos. Även det kräver receptorer. Vita blodkroppar i immunsystemet, <b>fagocyter</b>, kan binda till exempel en inkräktande bakterie, som då slukas.</p>
    <ol class="chainv"><li>Den vita blodkroppen binder bakterien med en receptor.</li><li>Cellmembranet buktar ut så att två armar bildas.</li><li>Armarna sluter sig runt bakterien.</li><li>Armarna smälter samman där de möts, eftersom cellmembranet går att jämföra med en <b>trögflytande vätska</b>. En membranbubbla bildas.</li><li>Partikeln förs vidare in i cellen i bubblan.</li><li>Vesikeln smälter ihop med <b>lysosomer</b>, och enzymerna i dem bryter ner det som tagits upp.</li></ol>
    <div class="x" data-x="orderFago"></div>
    <div class="box lek"><p>Läraren talar om <b>vesikulär transport</b>. Vesiklarna är små blåsor omgivna av ett lipidlager. De används både för transport mellan olika delar inne i cellen och för att föra in eller ut molekyler. {{lek:Transport bild 21}}</p><p>"Endo-" betyder inre på grekiska. Endocytos används av alla celler, eftersom de flesta viktiga substanser är polära och består av stora molekyler som inte kan passera det hydrofoba plasmamembranet. {{lek:Transport bild 22}}</p><p>Läraren delar in endocytos i <b>tre typer</b>. {{lek:Transport bild 21, 23}}</p><ul><li><b>Fagocytos</b>. Membranet skjuter ut <b>pseudopodier</b> som omsluter fasta partiklar. Bubblan kallas <b>fagosom</b> (näringsvakuol).</li><li><b>Pinocytos</b>. Membranet buktar in i små fickor med extracellulär vätska, som snörs av till vesiklar.</li><li><b>Receptormedierad endocytos</b>. Ämnet binder till receptorer, membranet bildar en <b>klatrinbelagd grop</b>, och gropen snörs av till en <b>klatrinbelagd vesikel</b>.</li></ul><p>Lärarens bild har dessutom etiketten "Kaspid" vid den klatrinbelagda vesikelns hölje.</p></div>
    <div class="lfig-h" data-fig="endo3"></div>
    <table class="cmp"><tr><th></th><th>Fagocytos</th><th>Pinocytos</th><th>Receptormedierad (läraren)</th></tr>
      <tr><td>Betyder</td><td>"cellätande"</td><td>"celldrickande"</td><td>upptag via receptorer</td></tr>
      <tr><td>Tar upp</td><td>stora partiklar, till och med hela celler</td><td>vattenlösliga makromolekyler (läraren: extracellulär vätska)</td><td>ämnen som binder till receptorer</td></tr>
      <tr><td>Receptorer</td><td>ja</td><td>ja, för just det ämnet (boken)</td><td>ja</td></tr>
      <tr><td>Membranet</td><td>buktar ut i två armar (pseudopodier)</td><td>buktar in</td><td>klatrinbelagd grop</td></tr>
      <tr><td>Exempel</td><td>vita blodkroppar slukar bakterier</td><td>stora molekyler</td><td>LDL och LDL-receptorn</td></tr></table>
    <div class="box diff"><p><b>Boken:</b> två sorters endocytos. Fagocytos gäller stora partiklar som bakterier, och pinocytos gäller vattenlösliga makromolekyler och kräver receptorer (s. 36). <b>Läraren:</b> tre typer, fagocytos, pinocytos och receptormedierad endocytos. Pinocytos är att extracellulär vätska förs in, och vid fagocytos tar sig "stora molekyler" in. {{diff:Transport bild 21–23}}</p><p>Bokens pinocytos med receptorer liknar lärarens receptormedierade endocytos. Skriv bokens två typer på provet och nämn gärna den tredje.</p></div>
    <div class="box trick"><p>e<b>N</b>do = i<b>N</b>. <b>EX</b>o = <b>EX</b>it. <b>Fago</b> = äta, som i fagocyt. <b>Pino</b> = dricka.</p></div>
    <div class="box trap"><p>Båda typerna kräver receptorer enligt boken.</p><p>Vid fagocytos buktar membranet <b>ut</b> i armar. Vid pinocytos buktar det <b>in</b>.</p><p>Fagocytos är processen. Fagocyter är cellerna som gör den.</p></div>
    <div class="box fab"><p>Endocytos är fabrikens <b>lastkaj för inkommande lass</b>. Tullmuren viker sig runt lasset, och lasset åker in i en egen lastbil (vesikel). Lastbilen kör till sopförbränningen och återvinningen (lysosomen).</p></div>
    <div class="box link"><p>Lysosomerna går du igenom i {{go:k4.lysosomer|K4}}. Där står att vita blodkroppar slukar bakterier i en membranblåsa som smälter ihop med lysosomer. Det är fagocytos.</p></div>
    <div class="box tr" data-t="membran" data-h="Membranet flyter">Armarna vid fagocytos kan smälta samman, eftersom cellmembranet är som en trögflytande vätska. I {{go:k3.uppbyggnad|K3}} kallas membranet en tvådimensionell vätska där fosfolipiderna glider runt varandra.</div>
    <div class="box tr" data-t="endo" data-h="En slukad bakterie">Enligt endosymbiosteorin var mitokondrien en gång en bakterie som slukades av den eukaryota cellens föregångare. Mitokondriens yttre membran kommer från den slukande cellens cellmembran, på samma sätt som fagosomens membran kommer från cellmembranet ({{go:k4.mitokondrien|K4}}).</div>
  `},
  {id:"ldl",h:"Endocytos och kolesterolet i blodet",nav:"LDL och kolesterol",src:"s. 36 · PPT Bi2 bild 14",prov:true,html:`
    <p>Endocytos fyller en mycket viktig funktion när det gäller upptaget av <b>kolesterol</b> i våra celler. {{prov}}</p>
    <p>I blodet transporteras kolesterol i små <b>partiklar</b>, där ett antal kolesterolmolekyler och protein bildar en <b>vattenlöslig enhet</b>. Eftersom partikeln är vattenlöslig kan kolesterolet följa med blodet. Partiklarna finns i två former, med olika proteiner: <b>LDL</b> (low density lipoprotein) och <b>HDL</b> (high density lipoprotein).</p>
    <table class="cmp"><tr><th></th><th>LDL</th><th>HDL</th></tr>
      <tr><td>Står för</td><td>low density lipoprotein</td><td>high density lipoprotein</td></tr>
      <tr><td>Kallas</td><td>ibland "det onda kolesterolet"</td><td>lite slarvigt "det goda kolesterolet"</td></tr>
      <tr><td>Gör</td><td>innehåller mer kolesterol i förhållande till protein, därför släpper kolesterolet lättare från proteinerna</td><td>transporterar överskott av kolesterol från kroppens vävnader till levern, där det bryts ner</td></tr>
      <tr><td>Höga halter</td><td>ökad risk för hjärt-kärlsjukdomar</td><td>boken säger inget om det</td></tr></table>
    <div class="box diff"><p><b>Boken:</b> LDL och HDL är <b>partiklar</b> av kolesterol och protein. HDL kallas "lite slarvigt" det goda kolesterolet och transporterar överskott av <b>kolesterol</b> till <b>levern</b>, där det bryts ner. LDL har mer kolesterol i förhållande till protein och kallas ibland det onda kolesterolet (s. 36). <b>Läraren:</b> rubriken är "Olika typer av kolesterol". LDL är "det dåliga kolesterolet", som fastnar på kärlets väggar om det finns för mycket, och HDL är "det goda kolesterolet", som hjälper till att transportera bort fett från blodet. {{diff:Bi2 bild 14}}</p><p>Använd bokens formulering på provet. LDL och HDL är partiklar som transporterar kolesterol, och de är inga egna sorters kolesterol.</p></div>
    <h3>När LDL-receptorn är felaktig</h3>
    <p>LDL tas upp från blodet in i cellerna via endocytos, och till det behövs en <b>receptor</b> för LDL. Hos vissa människor är <b>genen</b> för den receptorn felaktig. {{prov}}</p>
    <ol class="chainv"><li>Genen för LDL-receptorn är felaktig.</li><li>Cellerna kan inte ta upp LDL från blodet via endocytos på vanligt sätt.</li><li>LDL stannar i blodet, och halten blir hög.</li><li>Risken för hjärtinfarkt och stroke ökar.</li></ol>
    <table class="cmp"><tr><th>Felaktig gen</th><th>LDL-halt</th><th>Följd</th></tr>
      <tr><td>på den ena kromosomen</td><td>mycket hög</td><td>kraftigt ökad risk för hjärtinfarkt och stroke i vuxen ålder</td></tr>
      <tr><td>på båda homologa kromosomerna</td><td>extremt hög</td><td>man avlider ofta i hjärt- och kärlsjukdomar tidigt i livet</td></tr></table>
    <div class="box key"><p>En felaktig gen ger mycket höga halter, och två felaktiga gener ger extremt höga halter. Båda generna påverkar alltså, och därför säger boken att sjukdomen är <b>kodominant</b>. {{src:s. 36}}</p><p><b>Mer än en person av tusen</b> bär den felaktiga genen på sin ena kromosom. Det kan undersökas med ett enkelt <b>gentest</b>. Den som har genen kan minska risken att drabbas radikalt med en kombination av <b>kolesterolfattig mat, regelbunden motion och medicinering</b>.</p></div>
    <div class="w" data-w="k5Ldl"></div>
    <div class="box extra"><p>Boken ger inte sjukdomen något namn. Den kallas familjär hyperkolesterolemi.</p></div>
    <div class="box trick"><p><b>H</b>DL = <b>H</b>jälten som kör kolesterolet <b>h</b>em till levern. <b>L</b>DL = den <b>l</b>ömska som tappar sitt kolesterol.</p></div>
    <div class="box trap"><p>LDL och HDL är partiklar av kolesterol och protein. Boken kallar namnet "det goda kolesterolet" slarvigt.</p><p>Vid sjukdomen är det <b>receptorn</b> för LDL som är felaktig. Därför stannar LDL i blodet.</p><p>Kodominant betyder här att redan en felaktig gen ger höga halter och att två ger ännu högre.</p></div>
    <div class="box fab"><p>LDL-partiklarna är lastbilar med kolesterol som ska lossas vid fabrikens lastkaj. Receptorn är kajens dockningsport. Är porten felbyggd kan lastbilarna inte docka, och därför blir de kvar och kör runt i blodet.</p></div>
    <div class="box tr" data-t="nyckel" data-h="LDL-receptorn">LDL passar i sin receptor som en nyckel i ett lås. Är låset felbyggt på grund av en felaktig gen tas LDL inte upp, och halten i blodet stiger. Receptorer som lås för kemiska nycklar mötte du i {{go:k3.proteiner|K3}}.</div>
    <div class="box link"><p>Kolesterol finns också i djurcellers cellmembran, där det hjälper membranet att hålla sig lagom flytande ({{go:k3.uppbyggnad|K3}}).</p></div>
    <div class="x" data-x="mcLdl"></div>
  `},
  {id:"exocytos",h:"Exocytos",nav:"Exocytos",src:"s. 37 · PPT Transport bild 24–25 · Arbetsblad",prov:true,html:`
    <p>Ordet <b>exocytos</b> betyder "ut ur cellen", och det är alltså motsatsen till endocytos. {{prov}}</p>
    <p><b>Alla celler</b> använder exocytos, till exempel för att transportera material som ska bygga upp cellmembranet och <b>ECM</b>, den extracellulära matrixen ({{go:k3.ecm|K3}}). Ett sådant material är <b>glykoproteiner</b>.</p>
    <ol class="chainv"><li><b>Golgiapparaten</b> producerar membranblåsor med innehållet.</li><li>Blåsorna transporteras till cellmembranets yta.</li><li>När en membranblåsa får kontakt med cellmembranet blandar sig fosfolipiderna med varandra, och membranen smälter ihop.</li><li>Innehållet släpps ut.</li></ol>
    <div class="lfig-h" data-fig="exoendo"></div>
    <h3>Membranet håller sin storlek</h3>
    <p>Exocytos ger ett <b>tillskott av fosfolipider</b> till cellmembranet, eftersom blåsans fosfolipider blandar sig med cellmembranets. Därför skulle cellen hela tiden öka i storlek om det inte också skedde endocytos. Vid endocytos <b>försvinner fosfolipider</b> från cellmembranet till den nya blåsan, så att cellen minskar i storlek. De två processerna <b>tar alltså ut varandra</b>. {{prov}}</p>
    <h3>Sekretoriska celler</h3>
    <p><b>Sekretoriska celler</b> är celler som utsöndrar ämnen. De kan lagra ämnena i <b>sekretoriska blåsor</b> och släppa ut innehållet via exocytos vid behov. Det gäller till exempel cellerna som producerar <b>insulin</b> i bukspottkörteln och <b>nervceller</b> som lagrar <b>neurotransmittorer</b> i så kallade <b>synapsblåsor</b>. {{prov}}</p>
    <div class="box lek"><p>Läraren beskriver hela vägen för ett protein som ska ut ur cellen. {{lek:Transport bild 24–25}}</p><ol><li>Exocytos börjar vid ribosomerna på det <b>korniga endoplasmatiska nätverket</b>.</li><li>Proteinet förs in i nätverkets hålrum.</li><li>Det lämnar nätverket i en vesikel och tar sig till golgiapparatens <b>cis-sida</b>.</li><li>I golgiapparaten modifieras proteinet, och det lämnar apparaten på <b>trans-sidan</b>.</li><li>Vesikeln går upp i cellmembranet, och innehållet utlöses från cellen.</li></ol><p>Exocytos utsöndrar <b>stora biomolekyler</b>, till exempel när ämnen i körtelceller utsöndras. Hos encelliga organismer (<b>protozoer</b>) kan exocytos utsöndra avfallsprodukter, och hos flercelliga organismer har den även en <b>signalerande och reglerande</b> funktion.</p></div>
    <div class="x" data-x="orderExo"></div>
    <div class="box trick"><p><b>EX</b>ocytos = <b>EX</b>tra membran. <b>EN</b>docytos = <b>EN</b> bit membran försvinner.</p></div>
    <div class="box trap"><p>Det är exocytos som lägger till fosfolipider och endocytos som tar bort dem. Det är lätt att vända på dem.</p><p>Alla celler använder exocytos. Det är bara lagringen i sekretoriska blåsor som är typisk för sekretoriska celler.</p></div>
    <div class="box fab"><p>Exocytos är <b>lastkajen för utgående varor</b>. Packcentralen (golgiapparaten) packar varorna i lastbilar (vesiklar) som kör till tullmuren. Där blir lastbilens vägg en del av muren, och därför växer muren lite för varje leverans.</p></div>
    <div class="box tr" data-t="membran" data-h="Membranet byggs om hela tiden">Vid exocytos blir vesikelns membran en del av cellmembranet, och vid endocytos blir en bit cellmembran en vesikel. Membranet flyttas alltså hela tiden, från ER via golgiapparaten till cellmembranet ({{go:k4.resan|proteinets resa i K4}}).</div>
    <div class="box link"><p>Golgiapparaten, packcentralen som skickar ut sekretoriska vesiklar, går du igenom i {{go:k4.golgi|K4}}. Protozoerna finns i {{go:k7.protister|K7}}.</p></div>
  `},
  {id:"aktivfilm",h:"Aktiv transport (filmen)",nav:"Aktiv transport, filmen",src:"Film Aktiv transport · Lektion (via klasskamratens sammanfattning)",lek:true,html:`
    <div class="box lek" data-h="Från lärarens film"><p>Den här sektionen bygger på lärarens film "Aktiv transport. Proteinpumpar, exocytos och endocytos" och på lektionen. Vi har inte sett filmen själva. Innehållet kommer från en klasskamrats sammanfattning (sidan Biologiatlas). Om något skiljer sig från boken gäller boken. {{lek:Film Aktiv transport}}</p><p>Grunderna står i {{go:k5.aktiv|Aktiv transport}}, {{go:k5.pumpen|ATP-pumpar}}, {{go:k5.endocytos|Endocytos}} och {{go:k5.exocytos|Exocytos}}.</p></div>
    <h3>Varför aktiv transport?</h3>
    <p>Aktiv transport kräver alltid <b>ATP</b>. Cellen använder energin på två sätt. Antingen pumpas ämnen mot koncentrationsgradienten, från låg till hög koncentration, eller så tas ämnen upp och avges med vesiklar (endocytos och exocytos). {{lek:Film Aktiv transport}}</p>
    <ul><li>Cellen kan <b>samla</b> ämnen den behöver, till exempel glukos och joner.</li><li>Cellen kan <b>pumpa ut</b> skadliga ämnen, som toxiner och överskott av joner, och därför hålls den inre miljön stabil.</li><li><b>Nerv- och muskelceller</b> pumpar ut Na⁺ och in K⁺. Laddningsskillnaden som bildas behövs för nervsignaler och muskelkontraktion ({{go:k5.spanning|Spänning över membranet}}).</li><li><b>Stora partiklar</b> kan tas in eller ut med endocytos och exocytos.</li></ul>
    <table class="cmp"><tr><th></th><th>Proteinpumpar</th><th>Vesikeltransport</th></tr>
      <tr><td>Vad</td><td>klassisk aktiv transport, en typ av bärarprotein</td><td>endocytos och exocytos</td></tr>
      <tr><td>Flyttar</td><td>joner och små molekyler</td><td>större molekyler och partiklar, t.ex. virus</td></tr>
      <tr><td>Riktning</td><td>mot gradienten</td><td>med eller mot gradienten</td></tr>
      <tr><td>ATP till</td><td>pumpens formändring</td><td>att bilda och flytta vesiklarna</td></tr></table>
    <h3>Natrium-kaliumpumpen i åtta steg</h3>
    <p>Natrium-kaliumpumpen är ett membranprotein, ett bärarprotein, i de flesta djurcellers membran. Den pumpar <b>3 Na⁺ ut och 2 K⁺ in</b>, mot båda gradienterna, och därför är Na⁺ högre utanför cellen och K⁺ högre inne. Pumpen binder joner på ena sidan, ändrar form och släpper dem på andra sidan. {{lek:Film Aktiv transport}}</p>
    <ol class="chainv"><li>3 Na⁺ binder, medan pumpen är öppen inåt.</li><li>ATP spjälkas, och fosfatgruppen binds till pumpen.</li><li>Pumpen ändrar form och öppnas utåt.</li><li>Na⁺ släpps ut.</li><li>2 K⁺ binder.</li><li>Fosfatet släpper.</li><li>Pumpen ändrar form tillbaka.</li><li>K⁺ släpps in.</li></ol>
    <div class="box trick"><p>Fyra steg för natrium, fyra för kalium. <b>Binda, betala, vända, släppa</b>. Sedan <b>binda, kvittot släpper, vända, släppa</b>.</p></div>
    <p>Simuleringen i {{go:k5.pumpen|ATP-pumpar}} visar samma varv, men där är några av stegen sammanslagna.</p>
    <div class="x" data-x="orderNaK8"></div>
    <div class="box tr" data-t="atp" data-h="Pumpen betalar med ATP">Varje varv i natrium-kaliumpumpen kostar ett ATP. Fosfatgruppen från ATP binds till pumpen och får den att ändra form, och därför kan jonerna flyttas mot sina gradienter. Mer om ATP i {{go:k6.atp|K6}}.</div>
    <h3>Vesiklar och adresslappar</h3>
    <p><b>Vesiklar</b> är små membranomslutna blåsor med ett fosfolipidmembran. De bildas genom avknoppning från golgiapparaten, ER eller cellmembranet, och de flyttar proteiner, lipider och annat mellan organeller eller till och från cellens utsida. {{lek:Film Aktiv transport}}</p>
    <p>I ER eller golgiapparaten får vesiklarna <b>adresslappar</b>, kemiska markörer av proteiner eller kolhydratkedjor. Markören passar som en nyckel i rätt lås, en <b>receptor</b> på målorganellens membran eller på cellmembranet. Därför hamnar varje vesikel på rätt ställe. {{lek:Film Aktiv transport}}</p>
    <div class="box tr" data-t="nyckel" data-h="Adresslappar på vesiklar">Vesikelns markör passar i receptorn på målmembranet som en nyckel i ett lås. Det är samma princip som när LDL binder till sin receptor ({{go:k5.ldl|LDL}}) och när coronaviruset binder till ACE2.</div>
    <div class="x" data-x="matchAdress"></div>
    <h3>Varför vesiklar kostar ATP</h3>
    <p>Både exocytos och endocytos kräver ATP. Energin behövs för att <b>omforma och flytta membranet</b>. Vesiklarna transporteras dessutom längs cellskelettets filament, till exempel <b>mikrotubuli</b>, av <b>motorproteiner</b> som använder ATP. {{lek:Film Aktiv transport}}</p>
    <p>Vid exocytos förs stora molekyler, som hormoner, enzymer och avfall, ut i vesiklar som smälter ihop med cellmembranet. Vid endocytos omsluter cellen partiklar, till exempel virus, med en del av membranet som bildar en vesikel. {{lek:Film Aktiv transport}}</p>
    <div class="box tr" data-t="atp" data-h="Vesiklar kostar ATP">Att bilda en vesikel, flytta den längs mikrotubuli med motorproteiner och smälta ihop den med membranet kostar ATP. Därför räknas endocytos och exocytos till aktiv transport. Järnvägen, cellskelettet, finns i {{go:k4.cellskelettet|K4}}.</div>
    <h3>Exocytos i nervcellen, synapsen</h3>
    <div class="lfig-h" data-fig="synaps"></div>
    <ol class="chainv"><li>Nervimpulsen kommer till nervänden.</li><li><b>Ca²⁺-kanaler</b> öppnas, och Ca²⁺ strömmar in.</li><li>Vesiklar med signalämne smälter ihop med membranet (exocytos).</li><li>Signalämnet går över <b>synapsklyftan</b>, och signalen förs vidare till nästa cell.</li></ol>
    <p>Boken nämner att nervceller lagrar neurotransmittorer i synapsblåsor ({{go:k5.exocytos|Exocytos}}). Filmen visar vad som utlöser utsläppet, nämligen kalciumjonerna. {{lek:Film Aktiv transport}}</p>
    <div class="x" data-x="orderSyn"></div>
    <h3>Tre typer av endocytos, kort</h3>
    <p>Filmen delar in endocytos i tre typer, precis som lärarens powerpoint. Allt står utförligt i {{go:k5.endocytos|Endocytos}}. {{lek:Film Aktiv transport}}</p>
    <ul><li><b>Fagocytos</b>, "cellätande". Stora partiklar som bakterier, virus och döda celler omsluts med pseudopodier till fagosomer. Det gör främst immunceller, makrofager och neutrofiler, för att oskadliggöra bakterier och virus.</li><li><b>Pinocytos</b>, "celldrickande". Små mängder vätska med lösta ämnen tas in i små vesiklar. Filmen kallar det ospecifikt.</li><li><b>Receptorförmedlad endocytos</b>. Specifik, eftersom molekylerna först binder till receptorer och membranet sedan veckas inåt. Exempel är LDL-kolesterol och vissa hormoner.</li></ul>
    <div class="box diff"><p><b>Boken:</b> pinocytos kräver receptorer för just det ämne som ska tas upp (s. 36). <b>Filmen:</b> pinocytos är ospecifik, och det är den receptorförmedlade endocytosen som är specifik. {{diff:Film Aktiv transport}}</p><p>Svara med bokens version på provet.</p></div>
    <h3>Coronaviruset kapar vesiklarna</h3>
    <p><b>SARS-CoV-2</b>, viruset som orsakar covid-19, tar sig in i cellen främst via endocytos. Det "kapar" cellens vesikeltransport. {{lek:Film Aktiv transport}}</p>
    <ol class="chainv"><li>Viruset binder till <b>ACE2-receptorer</b> på cellen.</li><li>Cellmembranet buktar in.</li><li>Vesikeln förs in i cellen.</li><li>Virusets arvsmassa frigörs.</li></ol>
    <div class="x" data-x="orderCorona"></div>
    <div class="box tr" data-t="nyckel" data-h="ACE2, virusets lås">Coronaviruset kommer bara in i celler som har ACE2-receptorer, eftersom viruset passar i receptorn som en nyckel i ett lås. Fler virus som kapar celler finns i {{go:k10.virus|K10}}.</div>
    <div class="box fab"><p>Vesiklarna är fabrikens <b>lastbilar med adresslappar</b>. Lappen sätts på i packcentralen (golgi), och lastbilen kör längs järnvägen (mikrotubuli) med motorproteiner som lok. Varje körning kostar ATP-mynt. Coronaviruset är en kapare som visar en falsk nyckel vid lastkajen (ACE2) och åker in med fabrikens egen lastbil.</p></div>
    <div class="box trap"><p>Vesikeltransport kan ske med eller mot gradienten, men den kräver alltid ATP.</p><p>I synapsen är det <b>Ca²⁺</b> som strömmar in och utlöser exocytosen, inte Na⁺.</p><p>Natrium-kaliumpumpen är ett bärarprotein. Den har ingen öppen kanal genom membranet.</p></div>
    <div class="x" data-x="sortTransp"></div>
  `},
  {id:"vagval",h:"Vilken väg tar ämnet?",nav:"Vilken väg?",src:"s. 31–37 · Arbetsblad Transport",prov:true,html:`
    <p>Här möts hela kapitlet. "Hur tar sig X in i cellen?" är en vanlig provfråga. Ställ dig de här frågorna i tur och ordning.</p>
    <ol class="chainv"><li>Är ämnet stort, en hel partikel eller en cell? In: endocytos. Ut: exocytos.</li><li>Är det vatten? Osmos, främst genom aquaporiner.</li><li>Är det litet, oladdat och hydrofobt eller fettlösligt? Diffusion rakt genom fosfolipidskiktet.</li><li>Ska det med sin gradient men är laddat eller polärt? Underlättad diffusion genom en jonkanal eller ett bärarprotein.</li><li>Ska det mot sin gradient? Aktiv transport med en ATP-driven pump, eller kopplad transport om ett annat ämne "betalar".</li></ol>
    <div class="w" data-w="k5Vag"></div>
    <table class="cmp"><tr><th>Transportsätt</th><th>Energi</th><th>Exempel</th></tr>
      <tr><td>Diffusion genom fosfolipidskiktet</td><td>nej</td><td>O₂ in, CO₂ ut, steroidhormoner</td></tr>
      <tr><td>Underlättad diffusion</td><td>nej</td><td>joner genom jonkanaler, glukos med bärarprotein</td></tr>
      <tr><td>Osmos</td><td>nej</td><td>vatten genom aquaporiner</td></tr>
      <tr><td>ATP-driven pump</td><td>ja, direkt</td><td>natrium-kaliumpumpen</td></tr>
      <tr><td>Kopplad transport</td><td>ja, indirekt</td><td>2 Na⁺ + glukos in i tarmcellen</td></tr>
      <tr><td>Endocytos</td><td>ja</td><td>fagocytos av bakterier, LDL via receptorer</td></tr>
      <tr><td>Exocytos</td><td>ja</td><td>insulin, neurotransmittorer, glykoproteiner till ECM</td></tr></table>
    <div class="box fab" data-h="Hela tullgränsen"><p>Backen gratis (diffusion), grinden och svängdörren gratis (kanal och bärare), vattenledningen gratis (aquaporiner), rulltrappan mot ATP-mynt (pump), vattenfallet med hjul (kopplad transport) och lastkajen med lastbilar (endocytos och exocytos).</p></div>
    <div class="x" data-x="whoK5"></div>
    <div class="box lek" data-h="Lärarens filmer"><p>Läraren länkar till fyra filmer: "Cellmembranet" (5 min, bild 3), "Passiv transport – Diffusion och faciliterad diffusion" (16 min, bild 12), "Diffusion och osmos. Transport över membran (basnivå)" och "Osmos – del 1: Vattnets diffusion genom ett semipermeabelt membran" (20 min, den ses på lektionen, bild 14) samt "Aktiv transport – Proteinpumpar, exocytos och endocytos" (bild 26). {{lek:Transport bild 3, 12, 14, 26}}</p></div>
    <p>Öva begreppen med lärarens arbetsblad: <a href="#ab">Arbetsbladet som digital lucktext</a>. Facit är lärarens faktablad.</p>
  `}
  ],
  figs:{
    akva:{vb:"0 0 470 300",svg:figAkva(),
      labels:[["utsida",8,26,null,null,"s"],["vattenmolekyl",8,64,142,60,"s"],["opolärt inre",8,154,null,null,"s"],["cellmembran",8,232,40,186,"s"],["insida",8,288,null,null,"s"],
        ["proton (H⁺)|stoppas",462,26,360,62,"e"],["positivt laddade|aminosyror",462,120,262,126,"e"],["akvaporin",462,210,304,190,"e"],["vatten i en|enda rad",462,254,241,196,"e"]],
      parts:{prot:{t:"Akvaporinen",d:"Ett kanalprotein i cellmembranet som bara släpper igenom vattenmolekyler. Njurceller och blodkärlsceller är extra beroende av akvaporiner, och vissa kan öppnas eller stängas på signal. {{lek:Film Osmos}}"},
        plus:{t:"Positivt laddade sidogrupper",d:"Aminosyrorna i kanalens vägg har positivt laddade sidogrupper. De drar till sig vattnets partiellt negativa syreatom, och därför vänds vattenmolekylerna rätt. {{lek:Film Osmos}}"},
        vatten:{t:"Vatten i en enda rad",d:"Vattenmolekylerna passerar en och en, vända åt rätt håll. Vatten är polärt och tar sig därför mycket långsamt genom det opolära fosfolipidskiktet utan kanalen. {{lek:Film Osmos}}"},
        hplus:{t:"Protonen stoppas",d:"De positiva laddningarna i kanalen stöter bort protoner (H⁺). Därför kan bara vattenmolekyler passera, och cellens elektriska balans bevaras. {{lek:Film Osmos}}"}},
      cap:"Akvaporinens insida, ritad efter beskrivningen i lärarens film (via klasskamratens sammanfattning). Tryck på delarna.",src:"Film Osmos"},
    synaps:{vb:"0 0 470 300",svg:figSynaps(),
      labels:[["nervimpuls",8,22,226,16,"s"],["vesikel med|signalämne",8,78,159,82,"s"],["Ca²⁺-kanal",8,136,144,150,"s"],["synapsklyfta",8,176,134,166,"s"],["mottagande|cell",8,240,120,240,"s"],
        ["nervände",462,40,344,80,"e"],["exocytos",462,118,276,146,"e"],["signalämne",462,166,292,168,"e"],["receptor",462,206,306,180,"e"],["signalen förs vidare",292,268,null,null,"m"]],
      parts:{ves:{t:"Vesiklar med signalämne",d:"Nervänden lagrar signalämnet i vesiklar, synapsblåsor. De väntar på signalen att släppa ut innehållet. {{lek:Film Aktiv transport}}"},
        ca:{t:"Ca²⁺-kanalen",d:"När nervimpulsen kommer till nervänden öppnas kalciumkanaler, och Ca²⁺ strömmar in. Det är kalciumet som får vesiklarna att smälta ihop med membranet. {{lek:Film Aktiv transport}}"},
        exo:{t:"Exocytos",d:"Vesikeln smälter ihop med cellmembranet och släpper ut signalämnet i synapsklyftan. Det kräver ATP. {{lek:Film Aktiv transport}}"},
        rec:{t:"Receptorer",d:"Signalämnet går över synapsklyftan och binder till receptorer på nästa cell, och därför förs signalen vidare. {{lek:Film Aktiv transport}}"}},
      cap:"Exocytos i synapsen: nervimpuls, Ca²⁺ in, vesiklar töms, signalämnet går över synapsklyftan. Ritad efter lärarens film (via klasskamratens sammanfattning). Tryck på delarna.",src:"Film Aktiv transport"},
    genom:{vb:"0 0 470 302",svg:figGenom(),
      labels:[["hydrofoba molekyler",24,38,null,null,"s"],["O₂, CO₂, N₂, steroidhormoner",24,58,null,null,"s"],
        ["små, oladdade polära molekyler",24,106,null,null,"s"],["H₂O, glycerol",24,126,null,null,"s"],
        ["stora oladdade polära molekyler",24,174,null,null,"s"],["glukos",24,194,null,null,"s"],
        ["joner",24,242,null,null,"s"],["H⁺, Na⁺, HCO₃⁻, K⁺,|Ca²⁺, Cl⁻, Mg²⁺",24,262,null,null,"s"],
        ["fosfolipidlager",374,292,374,272,"m"]],
      parts:{hyd:{t:"Hydrofoba molekyler",d:"Syre, koldioxid, kvävgas och steroidhormoner. De är fettlösliga, och därför glider de rakt igenom det fettlösliga fosfolipidskiktet."},
        sma:{t:"Små, oladdade polära molekyler",d:"Vatten och glycerol. En del tar sig igenom, men de flesta studsar tillbaka, eftersom de är polära. Vatten får hjälp av aquaporiner.",go:"k5.osmos"},
        sto:{t:"Stora, oladdade polära molekyler",d:"Glukos. Mycket lite kommer igenom fosfolipidskiktet, eftersom molekylen är både stor och polär. Glukos tar sig in med bärarproteiner.",go:"k5.underlattad"},
        jon:{t:"Joner",d:"H⁺, Na⁺, K⁺, Ca²⁺, Mg²⁺, Cl⁻ och HCO₃⁻. De omges av ett skal av vattenmolekyler och kommer inte igenom alls. De behöver jonkanaler eller pumpar.",go:"k5.underlattad"}},
      cap:"Membranets genomsläpplighet. Bokens bildtext: \"Ju mindre molekylen är och framförallt ju mer hydrofob den är desto lättare tar sig molekylen in genom fosfolipidlagret.\" Pil rakt igenom = passerar, pil som vänder = studsar tillbaka. Tryck på en rad.",src:"Bok s. 31"},
    backen:{vb:"0 0 460 262",svg:figBacken(),
      labels:[["hög koncentration",10,44,null,null,"s"],["låg koncentration",222,252,null,null,"e"],["ingen energi",20,172,null,null,"s"],
        ["låg koncentration",238,252,null,null,"s"],["hög koncentration",452,44,null,null,"e"],["energi krävs",356,172,null,null,"s"]],
      cap:"Till vänster diffusion, från hög till låg koncentration, som en boll som rullar nedför en backe (bok s. 32). Till höger aktiv transport, från låg till hög koncentration, där \"energi krävs\" (bok s. 34).",src:"Bok s. 32 och s. 34"},
    kanal:{vb:"0 0 470 290",svg:figKanal(),
      labels:[["kanalprotein",120,22,112,98,"m"],["bärarprotein",350,22,300,104,"m"],["jon eller|vattenmolekyl",8,52,118,84,"s"],["ämnet binder",466,48,300,128,"e"],
        ["utsida",8,98,null,null,"s"],["insida",8,216,null,null,"s"],["vattenfylld kanal",8,266,120,186,"s"],["fosfolipid-|dubbellager",206,234,206,186,"m"],["ändrar form",466,264,412,198,"e"]],
      parts:{kanal:{t:"a) Kanalprotein",d:"Bokens bildtext: \"Ett kanalprotein bildar en vattenfylld kanal genom vilken vattenmolekyler och joner kan ta sig igenom. Kanalproteinerna är specifika, d.v.s. släpper bara igenom en viss sorts jon.\""},
        barare:{t:"b) Bärarprotein",d:"Bokens bildtext: \"Ett bärarprotein ändrar form då det ämne som ska transporteras binds till det. På så sätt kan ämnet föras över från den ena sidan av membranet till den andra.\" Båda formerna i bilden är samma protein."}},
      cap:"a) Kanalprotein och b) bärarprotein. Båda arbetar med koncentrationsgradienten, från många partiklar till få, utan energi. Tryck på proteinerna.",src:"Bok s. 32 · PPT Transport bild 10–11"},
    rbk:{vb:"0 0 470 234",svg:figRbk(),
      labels:[["hypoton lösning",80,198,null,null,"m"],["isoton lösning",235,198,null,null,"m"],["hyperton lösning",390,198,null,null,"m"],
        ["sväller och spricker",80,224,null,null,"m"],["påverkas inte",235,224,null,null,"m"],["krymper",390,224,null,null,"m"]],
      parts:{hypo:{t:"Hypoton lösning",d:"Låg halt av lösta ämnen, t.ex. destillerat vatten. Vattenkoncentrationen är högre utanför, och därför diffunderar vatten in. Blodkroppen sväller och spricker."},
        iso:{t:"Isoton lösning",d:"Samma halt av lösta ämnen som inuti cellen. Lika många vattenmolekyler diffunderar in som ut, och därför påverkas blodkroppen inte."},
        hyper:{t:"Hyperton lösning",d:"Hög halt av lösta ämnen, t.ex. stark saltlösning. Vattenkoncentrationen är lägre utanför, och därför diffunderar vatten ut. Blodkroppen krymper."}},
      cap:"Röda blodkroppar i tre lösningar. Bokens bildtext: en blodkropp i en hypoton lösning (låg halt av lösta ämnen) spricker, i en isoton lösning (samma halt som inuti cellen) påverkas den inte, och i en hyperton lösning (hög halt av lösta ämnen) krymper den.",src:"Bok s. 33"},
    bagare:{vb:"0 0 470 282",svg:figBagare(),
      labels:[["lösningsmedel (vatten)",8,24,58,150,"s"],["nivån stiger",462,24,412,80,"e"],["semipermeabelt|membran",115,256,115,206,"m"],["löst ämne",232,262,192,206,"m"],["nivån sjunker",290,262,312,140,"s"]],
      cap:"Lärarens bägarförsök. Ett semipermeabelt membran släpper igenom vattnet men inte saltjonerna. Vatten strömmar till sidan med mest löst ämne, och där stiger vätskenivån. Ritad efter PPT bild 13.",src:"PPT Transport bild 13"},
    oversikt:{vb:"0 0 470 310",svg:figOversikt(),
      labels:[["transporterad molekyl",170,24,215,88,"m"],["kanalprotein",104,62,112,112,"e"],["bärarprotein",250,62,236,114,"s"],["proteinpump",300,40,310,102,"s"],
        ["energi",352,236,366,216,"s"],["diffusion",40,262,40,232,"m"],["passiv transport:|underlättad diffusion",170,262,176,246,"m"],["aktiv transport",312,262,310,246,"m"],
        ["koncentrations-|gradient",466,286,437,238,"e"],["fosfolipidskikt",8,300,22,184,"s"]],
      parts:{diff:{t:"Diffusion",d:"Små, oladdade, hydrofoba ämnen går rakt genom fosfolipidskiktet med sin gradient. Ingen energi.",go:"k5.diffusion"},
        kanal:{t:"Kanalprotein",d:"Underlättad diffusion genom en vattenfylld kanal. Passiv, med gradienten.",go:"k5.underlattad"},
        barare:{t:"Bärarprotein",d:"Underlättad diffusion. Proteinet binder ämnet och ändrar form. Passiv, med gradienten.",go:"k5.underlattad"},
        pump:{t:"Proteinpump",d:"Aktiv transport mot gradienten. Pilen pekar uppåt, och energi krävs.",go:"k5.pumpen"},
        grad:{t:"Koncentrationsgradienten",d:"Den stora pilen visar gradienten, från mycket (uppe) till lite (nere). Allt som går med pilen är passivt, och allt som går mot den är aktivt."}},
      cap:"Bokens översikt. Passiv transport (diffusion och underlättad diffusion) går med koncentrationsgradienten, nedåt. Aktiv transport går mot den, uppåt, och kräver energi. Tryck på delarna.",src:"Bok s. 34"},
    antisym:{vb:"0 0 470 306",svg:figAntisym(),
      labels:[["primär aktiv transport",8,20,null,null,"s"],["sekundär aktiv transport|= kopplad transport",462,20,null,null,"e"],["Na⁺/K⁺-pump",8,84,90,120,"s"],
        ["3 Na⁺ ut",176,62,110,72,"s"],["2 K⁺ in",176,204,134,196,"s"],["ATP → ADP + Pᵢ",8,276,60,246,"s"],["antiport",120,298,null,null,"m"],["symport",340,298,null,null,"m"],
        ["Na⁺ med sin|gradient",300,254,328,200,"e"],["glukos mot|sin gradient",462,254,352,200,"e"]],
      cap:"Till vänster natrium-kaliumpumpen, primär aktiv transport där ATP används direkt och jonerna går åt motsatta håll (antiport). Till höger kopplad transport, där Na⁺ och glukos går samma väg (symport). Ritad efter lärarens bild.",src:"PPT Transport bild 18"},
    ap:{vb:"0 0 470 304",svg:figAp(),
      labels:[["+52 mV",48,46,126,40,"s"],["−96 mV",48,196,62,210,"s"],["fas 0: Na⁺ in",140,156,122,156,"s"],["fas 1: K⁺, Cl⁻ ut",150,24,140,72,"s"],
        ["fas 2: Ca²⁺ in, K⁺ ut",150,122,220,86,"s"],["fas 3: K⁺ ut",464,140,352,156,"e"],["fas 4: vila",380,196,430,210,"s"],["200 ms",255,294,null,null,"m"]],
      cap:"Aktionspotential i en hjärtmuskelcell: membranpotentialen (mV) över tid. Vila ca −96 mV, topp ca +52 mV, hela förloppet ca 200 ms. Ritad efter lärarens bild, som saknar förklarande text.",src:"PPT Transport bild 20"},
    endo3:{vb:"0 0 470 330",svg:figEndo3(),
      labels:[["fagocytos",78,22,null,null,"m"],["pinocytos",235,22,null,null,"m"],["receptormedierad|endocytos",392,22,null,null,"m"],
        ["pseudopodier",4,54,30,104,"s"],["cellmembran",164,66,174,138,"s"],["receptor",466,74,420,140,"e"],
        ["fagosom|(näringsvakuol)",4,296,64,258,"s"],["vesikel",235,300,235,258,"m"],["klatrinbelagd|grop",466,198,424,170,"e"],["klatrinbelagd|vesikel",466,300,390,264,"e"]],
      parts:{fago:{t:"Fagocytos",d:"\"Cellätande\". Membranet skjuter ut två armar (pseudopodier) runt en stor partikel, till exempel en bakterie. Armarna smälter samman, och partikeln hamnar i en fagosom som sedan smälter ihop med lysosomer.",go:"k5.endocytos"},
        pino:{t:"Pinocytos",d:"\"Celldrickande\". Membranet buktar in, och en liten vesikel med vätska och lösta makromolekyler snörs av. Boken: pinocytos kräver receptorer för ämnet."},
        rec:{t:"Receptormedierad endocytos",d:"Lärarens tredje typ. Ämnet binder till receptorer, membranet bildar en klatrinbelagd grop, och gropen snörs av till en klatrinbelagd vesikel. LDL tas upp så.",go:"k5.ldl"}},
      cap:"Tre typer av endocytos enligt läraren: fagocytos, pinocytos och receptormedierad endocytos. Överst extracellulärvätska, nederst cytoplasma. Tryck på en typ.",src:"PPT Transport bild 21–23 · Bok s. 36"},
    exoendo:{vb:"0 0 470 354",svg:figExoendo(),
      labels:[["a) exocytos",14,30,null,null,"s"],["cellmembran",128,30,150,70,"s"],["vesikel",22,128,90,108,"s"],["innehållet töms ut",458,30,350,54,"e"],["membranet får|fosfolipider",266,168,null,null,"s"],
        ["b) endocytos",14,190,null,null,"s"],["utsida",24,222,null,null,"s"],["cytoplasma",22,292,null,null,"s"],["membranet tappar|fosfolipider",266,328,null,null,"s"]],
      parts:{exo:{t:"a) Exocytos",d:"Bokens bildtext: \"Cellmembranet får ett tillskott av fosfolipider vid exocytos eftersom membranvesikelns fosfolipider blandar sig med cellmembranets och innehållet på så sätt töms utanför cellen.\""},
        endo:{t:"b) Endocytos",d:"Bokens bildtext: \"Vid endocytos 'tappar' i stället cellmembranet fosfolipider till den membranvesikel som bildats runt det som förs in i cellen.\""}},
      cap:"a) Exocytos och b) endocytos. Exocytos ger membranet fler fosfolipider, och endocytos tar bort fosfolipider. Därför tar processerna ut varandra. Tryck på raderna.",src:"Bok s. 37"}
  },
  ex:{
    sortTon:{ty:"sort",h:"Hyper, iso eller hypo?",cats:["Hyperton","Isoton","Hypoton"],src:"Film Osmos · Lektion",items:[
      ["Cellmembranet drar sig bort från cellväggen",0,"Det är plasmolys. Vatten lämnar växtcellen, eftersom lösningen utanför har högre osmolalitet."],
      ["En röd blodkropp i destillerat vatten",2,"Destillerat vatten har nästan inga lösta partiklar, och därför strömmar vatten in. Blodkroppen sväller och kan spricka."],
      ["En lösning med 280–295 mOsm/kg",1,"Det är samma osmolalitet som blodplasman, och därför sker ingen volymändring."],
      ["Havsvatten, ca 1 000 mOsm/kg",0,"Havsvatten har mycket högre osmolalitet än blodet (280–295), och därför drar det vatten ur cellerna."],
      ["Växtcellen blir turgid (spänd)",2,"Vatten strömmar in och turgortrycket ökar. Cellväggen hindrar att cellen spricker."],
      ["Röda blodkroppar spricker (hemolys)",2,"Vatten strömmar in, och blodkroppen har ingen cellvägg som håller emot."],
      ["Saltlaken runt bakterierna i saltad fisk",0,"Mycket salt ger hög osmolalitet utanför bakterierna, och därför lämnar vatten deras celler."],
      ["Blodplasma jämfört med cytosolen",1,"Filmen säger att cytosolen har ungefär samma osmolalitet som blodplasman, ca 280–295 mOsm/kg."],
      ["Sockerlösningen runt mikroorganismerna i sylt",0,"Mycket socker ger hög osmolalitet, och därför torkar mikroorganismerna ut och kan inte växa."],
      ["Röd blodkropp som blir skrynklig och får sämre syretransport",0,"Vatten har lämnat cellen, och därför packas hemoglobinet tätare och formen förändras."],
      ["Växtcellen är flaccid (slapp) och i balans",1,"Lika mycket vatten går in som ut, och därför är växtcellen slapp men oskadd."],
      ["Rent vatten i ett dropp",2,"Rent vatten har inga lösta partiklar. Därför ges det aldrig i dropp, eftersom det skulle ge hemolys och hjärnödem."],
      ["Fysiologisk koksaltlösning, 0,9 % NaCl, i praktiken",1,"308 mOsmol/L är tekniskt svagt hyperton, men lösningen är funktionellt isoton och används därför som dropp."],
      ["Blodplasman vid hypoton hyponatremi",2,"Plasman är utspädd och har låg osmolalitet, och därför går vatten in i cellerna och de sväller."],
      ["Växten slokar eftersom den förlorar turgortryck",0,"Vatten lämnar cellerna, eftersom lösningen utanför har högre osmolalitet."]]},
    orderKons:{ty:"order",h:"Konservering med salt eller socker",intro:"Lägg kedjan i rätt ordning.",src:"Film Osmos",items:["Maten får mycket salt eller socker","Osmolaliteten blir högre utanför mikroorganismerna","Vatten lämnar mikroorganismernas celler genom osmos","Cellerna krymper","Tillväxt och förökning hämmas","Maten håller längre"],why:"Saltet eller sockret ger hög osmolalitet utanför cellerna. Vatten går från låg till hög osmolalitet, och därför torkar mikroorganismerna ut."},
    orderHypo:{ty:"order",h:"Från för mycket vatten till hjärnödem",intro:"Lägg lektionens kedja i rätt ordning.",src:"Lektion",items:["Man dricker för mycket vatten på kort tid","Blodplasman späds ut","Låg osmolalitet och låg Na⁺ (hypoton hyponatremi)","Vatten går in i cellerna genom osmos","Cellerna sväller","Hjärnödem uppstår","Trycket i skallen stiger, blodflödet minskar och hjärnan får syrebrist","Hjärnstammen kan pressas ner mot skallbasen, och andning och hjärta påverkas"],why:"Hjärnan ligger i ett hårt kranium med begränsat utrymme. När cellerna sväller stiger trycket, och hjärnstammen styr andning och hjärtfrekvens."},
    chainHav:{ty:"chain",h:"Saknad länk: havsvatten",src:"Lektion",items:[
      {h:"Havsvatten i tarmen",steps:["Man dricker havsvatten med 3,5 % salt","Tarminnehållet får mycket hög salthalt","Vatten går från tarmväggens celler ut i tarmen","Diarré och vätskeförlust"],b:2,w:["Vatten tas upp från tarmen till blodet","Saltet stannar i tarmväggens celler"],why:"Vatten går mot hög osmolalitet, och den finns i tarmen."},
      {h:"Havsvatten i blodet",steps:["Saltet tas upp i blodet","Blodets osmolalitet ökar","Vatten går från kroppens celler till blodet","Cellulär dehydrering och organsvikt"],b:2,w:["Vatten går från blodet in i cellerna","Cellerna sväller och spricker"],why:"Blodet blir hypertont mot cellerna, och därför dras vatten ut ur hjärnans, hjärtats och andra organs celler."},
      {h:"Njurarna",steps:["Blodet innehåller för mycket salt","Njurarna utsöndrar överskottssaltet i urinen","Det krävs vatten för att få ut saltet","Uttorkningen blir värre"],b:2,w:["Njurarna sparar vatten genom att behålla saltet","Urinen blir saltfri"],why:"Saltet måste lösas i urin, och därför förlorar kroppen ännu mer vatten."}]},
    orderNaK8:{ty:"order",h:"Natrium-kaliumpumpen i åtta steg",intro:"Lägg filmens åtta steg i rätt ordning.",src:"Film Aktiv transport",items:["3 Na⁺ binder, pumpen är öppen inåt","ATP spjälkas, och fosfatgruppen binds till pumpen","Pumpen ändrar form och öppnas utåt","Na⁺ släpps ut","2 K⁺ binder","Fosfatet släpper","Pumpen ändrar form tillbaka","K⁺ släpps in"],why:"Fosfatet från ATP får pumpen att vända sig utåt. När fosfatet släpper vänder pumpen tillbaka inåt. Tre Na⁺ ut och två K⁺ in per varv."},
    orderSyn:{ty:"order",h:"Exocytos i synapsen",intro:"Lägg stegen i rätt ordning.",src:"Film Aktiv transport",items:["Nervimpulsen kommer till nervänden","Ca²⁺-kanaler öppnas, och Ca²⁺ strömmar in","Vesiklar med signalämne smälter ihop med membranet (exocytos)","Signalämnet går över synapsklyftan, och signalen förs vidare"],why:"Kalciumet som strömmar in utlöser exocytosen av vesiklarna."},
    orderCorona:{ty:"order",h:"Coronaviruset tar sig in",intro:"Lägg stegen i rätt ordning.",src:"Film Aktiv transport",items:["Viruset binder till ACE2-receptorer på cellen","Cellmembranet buktar in","Vesikeln med viruset förs in i cellen","Virusets arvsmassa frigörs"],why:"Viruset använder receptorförmedlad endocytos och kapar cellens vesikeltransport."},
    matchAdress:{ty:"match",h:"Skicka paketet rätt",src:"Film Aktiv transport",pairs:[["Vesikel från ER med nytillverkat protein","golgiapparaten"],["Vesikel med nedbrytande enzymer","lysosomen"],["Vesikel med hormon som ska ut ur cellen","cellmembranet"],["Markören (adresslappen) på vesikeln","nyckeln"],["Receptorn på målmembranet","låset"]]},
    sortTransp:{ty:"sort",h:"Vilken transport?",cats:["Proteinpump","Exocytos","Endocytos"],src:"Film Aktiv transport",items:[
      ["3 Na⁺ ut och 2 K⁺ in",0,"Det är natrium-kaliumpumpen, en proteinpump som använder ATP."],
      ["Signalämne släpps ut i synapsklyftan",1,"Vesiklarna smälter ihop med membranet och töms utåt."],
      ["Cellen tar upp lite vätska med vad som råkar vara löst i den",2,"Det är pinocytos, celldrickande."],
      ["En makrofag slukar en bakterie",2,"Det är fagocytos, cellätande."],
      ["Coronaviruset tas in efter att ha bundit till ACE2",2,"Viruset tas in i en vesikel, och det är endocytos."],
      ["En körtelcell utsöndrar ett hormon",1,"Hormonet förs ut i vesiklar som smälter ihop med cellmembranet."],
      ["Joner flyttas mot sin gradient av ett bärarprotein som ändrar form",0,"Det är en proteinpump."],
      ["LDL tas upp efter att ha bundit till sina receptorer",2,"Det är receptorförmedlad endocytos."],
      ["Cellen gör sig av med avfall i en vesikel",1,"Filmen räknar avfall till det som förs ut med exocytos."],
      ["Nervcellen bygger upp laddningsskillnaden för nervsignaler",0,"Na/K-pumpen pumpar ut Na⁺ och in K⁺, och därför bildas laddningsskillnaden."],
      ["Fosfatgruppen från ATP binds och proteinet vänder sig utåt",0,"Det är ett steg i natrium-kaliumpumpen."],
      ["Enzymer skickas ut ur cellen",1,"Stora molekyler som enzymer förs ut med exocytos."]]},
    tfGenom:{ty:"tf",h:"Vad kommer igenom membranet?",src:"s. 31",items:[
      ["Syre och koldioxid passerar membranet fritt, eftersom de är små, oladdade och hydrofoba.",true,"Fosfolipidskiktet är fettlösligt, och därför tar sig sådana ämnen lätt igenom."],
      ["Vätejonen tar sig igenom fosfolipidskiktet, eftersom den är den minsta av alla joner.",false,"Inte ens vätejonen kommer igenom, eftersom den, som andra joner, omges av ett skal av vattenmolekyler."],
      ["Även stora molekyler kan ta sig lätt igenom membranet om de är fettlösliga.",true,"Boken: stora fettlösliga molekyler tar sig lätt igenom, eftersom fosfolipidskiktet är fettlösligt."],
      ["Natriumjoner och kaliumjoner har fri passage genom membranet.",false,"De är hydrofila joner och har inte fri passage. De behöver jonkanaler eller pumpar."],
      ["Glukos tar sig lättare genom fosfolipidskiktet än vatten.",false,"Glukos är en stor polär molekyl och kommer igenom mycket dåligt. Vatten är litet, och en del vatten kommer igenom."],
      ["Steroidhormoner hör till de hydrofoba molekylerna i bokens figur.",true,"De står i samma grupp som O₂, CO₂ och N₂ och går rakt igenom."],
      ["Det viktigaste för att en molekyl ska komma igenom är att den är liten.",false,"Bildtexten säger \"framförallt ju mer hydrofob\". Fettlösligheten väger tyngst."]]},
    tfDiff:{ty:"tf",h:"Diffusion och cellens andning",src:"s. 31–32 · PPT Transport bild 5–7",items:[
      ["Diffusion kräver ingen energi, eftersom ämnet följer sin koncentrationsgradient.",true,"Gradienten innehåller potentiell energi, som en nedförsbacke."],
      ["När sockret är jämnt fördelat i teet slutar molekylerna att röra sig.",false,"Partiklar är i ständig rörelse. Det blir bara ingen nettoförflyttning längre."],
      ["Diffusion genom ett cellmembran kallas passiv transport.",true,"Den kallas passiv eftersom den inte kostar cellen någon energi."],
      ["Syre kan bara diffundera in i cellen om koldioxid samtidigt diffunderar ut.",false,"Varje ämne följer sin egen koncentrationsgradient, oberoende av andra ämnen."],
      ["En cell kan \"andas\" så länge syrehalten är högre utanför cellen än inuti och koldioxidhalten högre inuti än utanför.",true,"Då diffunderar syre in och koldioxid ut, båda längs sin egen gradient."],
      ["Varje sockermolekyl rör sig rakt från sockerbiten mot ytan.",false,"Varje molekyls rörelse är slumpmässig. Det är bara transporten totalt sett som har en riktning, från hög till låg koncentration."],
      ["Enligt läraren kommer energin för diffusionen från molekylernas värmerörelse.",true,"PPT bild 5: energin kommer från molekylernas värmerörelse, och ingen ytterligare energi behövs."]]},
    mcUnder:{ty:"mc",h:"Kanaler och bärare",src:"s. 32",items:[
      {q:"Vad har kanalproteiner och bärarproteiner gemensamt?",o:["Båda hjälper ämnen med gradienten utan energi","Båda kräver ATP","Båda släpper igenom alla sorters joner","Båda ändrar form när ämnet binder"],why:"Båda används vid underlättad diffusion, från hög till låg koncentration. Det är bara bärarproteinet som ändrar form när ämnet binder."},
      {q:"Vilka sorters stimuli kan öppna och stänga kanalproteiner?",o:["Kemiska, elektriska och mekaniska","Bara ATP","Ljus, värme och tryck","Att glukos binder"],why:"Boken: olika stimuli (kemiskt, elektriskt, mekaniskt) kan göra att kanalerna öppnas och stängs vid behov."},
      {q:"Vad betyder det att ett transportprotein är specifikt?",o:["Det underlättar transporten för bara ett visst ämne","Det finns bara i en sorts cell","Det kräver energi","Det transporterar bara vatten"],why:"De flesta transportproteiner är specifika, till exempel jonkanaler som bara släpper igenom natriumjoner."},
      {q:"Hur transporterar ett bärarprotein glukos?",o:["Glukos binder, proteinet ändrar form och glukos släpps på andra sidan","Glukos glider genom en vattenfylld kanal","Proteinet pumpar glukos mot gradienten med ATP","Glukos löser sig i fosfolipidskiktet"],why:"Bindningen gör att bärarproteinet ändrar form. Det kräver ingen energi, eftersom glukos går från högre till lägre koncentration."}]},
    fixOsmos:{ty:"fix",h:"Hitta felen i Pelles förklaring av osmos",src:"s. 33",parts:[
      "Pelle förklarar: Osmos är diffusion av ",["salt","vatten","Bokens definition: osmos är vattnets diffusion över ett semipermeabelt membran."]," över ett semipermeabelt membran. Om man lägger en röd blodkropp i en stark saltlösning ",["diffunderar saltet in i cellen, så att den sväller","diffunderar vatten ut ur cellen, så att den krymper","Saltlösningen har lägre vattenkoncentration än cellen. Därför går vatten ut, och blodkroppen krymper."],
      ". I destillerat vatten, som är en ",["hyperton","hypoton","Destillerat vatten har låg halt av lösta ämnen och är alltså hypotont."]," lösning, går vatten in och cellen kan spricka. Saltjonerna följer inte med lika snabbt, eftersom ",["de inte alls kan ta sig igenom membranet","det finns färre jonkanaler än vattenkanaler","Boken: transporten av saltjoner är mycket långsammare, eftersom det finns färre jonkanaler än vattenkanaler."],"."]},
    sortPassAkt:{ty:"sort",h:"Passiv eller aktiv?",cats:["Passiv (ingen energi)","Aktiv (kräver energi)"],src:"s. 31–36",items:[
      ["Syre diffunderar in i cellen",0,"Syre har fri passage och följer sin gradient."],
      ["Koldioxid diffunderar ut ur cellen",0,"Halten är högre inuti, så koldioxiden följer sin gradient ut."],
      ["Vatten går in i en röd blodkropp i destillerat vatten",0,"Osmos är diffusion av vatten och kostar ingen energi."],
      ["Na⁺ strömmar genom en öppen jonkanal, med sin gradient",0,"Underlättad diffusion. Jonkanalen hjälper, men det sker med gradienten."],
      ["Glukos tas in med ett bärarprotein, från hög till låg koncentration",0,"Underlättad diffusion med bärarprotein kräver ingen energi."],
      ["Natrium-kaliumpumpen flyttar ut Na⁺",1,"Pumpen arbetar mot gradienten och drivs av ATP."],
      ["Glukos tas upp i tarmcellen tillsammans med Na⁺, mot glukosets gradient",1,"Kopplad transport. ATP behövs indirekt för att hålla natriumgradienten uppe."],
      ["En vit blodkropp slukar en bakterie",1,"Fagocytos är endocytos, och endocytos kräver energi."],
      ["Insulin släpps ut ur en cell i bukspottkörteln",1,"Exocytos kräver energi."],
      ["Ett steroidhormon tar sig genom fosfolipidskiktet",0,"Steroidhormoner är fettlösliga och diffunderar rakt igenom."],
      ["En arké pumpar ämnen med solenergi",1,"Solenergidrivna proteinpumpar är aktiv transport (s. 34)."]]},
    orderSteg:{ty:"order",h:"Kopplad transport i fyra steg",intro:"Lägg lärarens fyra steg i rätt ordning.",src:"PPT Transport bild 18",items:[
      "Cellen använder ATP för att skapa en skillnad i koncentration av natriumjoner",
      "Natriumjonerna vill strömma tillbaka in i cellen, där koncentrationen är lägre",
      "Ett transportprotein kopplar ihop natriumets rörelse med transporten av ett annat ämne",
      "Det andra ämnet, till exempel glukos, \"dras\" med in mot sin egen gradient"],why:"Först byggs gradienten med ATP (del 1). Sedan driver natriumets diffusion transporten av det andra ämnet (del 2)."},
    chainKopp:{ty:"chain",h:"Saknad länk: kopplad transport",src:"s. 34–35",items:[
      {h:"Glukos in i tarmcellen",steps:["ATP driver natrium-kaliumpumpen","Na⁺ pumpas ut och en natriumgradient byggs upp","Na⁺ diffunderar tillbaka in genom ett transportprotein","Glukos följer med in, mot sin egen gradient"],b:2,w:["Glukos pumpas in direkt med ATP","Na⁺ diffunderar ut ur cellen"],why:"Natriumets diffusion in, med gradienten, driver glukosets transport mot gradienten."},
      {h:"Diarré",steps:["Avföringen passerar snabbt genom tarmen","Natriumjonerna hinner inte reabsorberas","Kroppens jonbalans störs","Det kan leda till döden genom uttorkning"],b:1,w:["Tarmen tar upp för mycket natrium","Glukos skadar natriumkanalerna"],why:"Boken s. 35: diarré gör att reabsorptionen inte hinner ske, och förlusten av natriumjoner stör jonbalansen."},
      {h:"Vätskeersättningen",steps:["Patienten dricker en lösning med salt och glukos","Glukos finns i tarmen samtidigt som natrium","Na⁺ tas upp kopplat till glukos, två Na⁺ per glukos","Jonbalansen kan återställas"],b:2,w:["Na⁺ tas upp av sig självt utan glukos","Glukos tas upp med fagocytos"],why:"Natrium tas upp via tarmens epitelceller genom kopplad transport till glukos, två natriumjoner per glukosmolekyl."},
      {h:"Utan ATP",steps:["ATP tar slut","Natrium-kaliumpumpen stannar","Natriumgradienten jämnas ut","Den kopplade transporten av glukos stannar"],b:2,w:["Glukos börjar pumpas in direkt med ATP","Natriumgradienten blir brantare"],why:"Utan koncentrationsgradient ingen diffusion. Därför kräver kopplad transport ATP indirekt."}]},
    matchProt:{ty:"match",h:"Para ihop proteinet med vad det gör",src:"s. 32–35 · PPT Transport bild 18–19",pairs:[
      ["Kanalprotein","vattenfylld öppning för vatten och joner"],["Jonkanal","släpper igenom en viss sorts jon"],["Aquaporin","vattenkanal"],["Bärarprotein","binder ämnet och ändrar form, utan energi"],
      ["Proteinpump","flyttar ämnen mot gradienten med ATP"],["Natrium-kaliumpumpen","3 Na⁺ ut och 2 K⁺ in"],["Symport","två ämnen åt samma håll"],["Antiport","två ämnen åt motsatta håll"]],why:"Kanal och bärare är passiva. Pumpen är aktiv. Symport och antiport är lärarens ord (bild 18)."},
    orderAP:{ty:"order",h:"Aktionspotentialens faser",intro:"Lägg faserna i tidsordning, från vila till vila.",src:"PPT Transport bild 20",items:[
      "Fas 4: vila vid ca −96 mV","Fas 0: Na⁺ strömmar in och spänningen rusar upp till ca +52 mV","Fas 1: en kort topp med utåtriktad ström av K⁺ och Cl⁻",
      "Fas 2: platå när Ca²⁺ strömmar in och K⁺ ut","Fas 3: K⁺ strömmar ut och spänningen faller","Tillbaka i fas 4, vila"],why:"Hela förloppet från fas 0 till slutet av fas 3 tar ungefär 200 ms (bild 20)."},
    orderFago:{ty:"order",h:"Fagocytos steg för steg",intro:"En vit blodkropp tar upp en bakterie. Lägg stegen i ordning.",src:"s. 36",items:[
      "En receptor på den vita blodkroppen binder bakterien","Cellmembranet buktar ut så att två armar bildas","Armarna sluter sig runt bakterien",
      "Armarna smälter samman, och en membranbubbla bildas","Bubblan förs in i cellen","Vesikeln smälter ihop med lysosomer, och enzymerna bryter ner bakterien"],why:"Armarna kan smälta samman eftersom cellmembranet är som en trögflytande vätska."},
    mcLdl:{ty:"mc",h:"LDL och kolesterol",src:"s. 36",items:[
      {q:"Vad är LDL enligt boken?",o:["En partikel av kolesterol och protein","En sorts kolesterol","Ett enzym som bryter ner kolesterol","En receptor i cellmembranet"],why:"Kolesterol transporteras i blodet i små partiklar av kolesterol och protein. LDL och HDL är två sådana former."},
      {q:"Varför kallas LDL ibland \"det onda kolesterolet\"?",o:["Det har mer kolesterol per protein, släpper kolesterolet lättare och höga halter ökar risken för hjärt-kärlsjukdom","Det för kolesterol till levern","Det innehåller inget protein","Det tas upp genom fagocytos"],why:"LDL innehåller mer kolesterol i förhållande till protein. Därför släpper kolesterolet lättare, och höga halter ger ökad risk för hjärt-kärlsjukdomar."},
      {q:"Vad händer om genen för LDL-receptorn är felaktig på båda homologa kromosomerna?",o:["Extremt höga LDL-halter, och man avlider ofta tidigt i hjärt-kärlsjukdom","Inga symtom, eftersom en frisk gen räcker","Låga LDL-halter","Mycket höga halter, men först i hög ålder"],why:"En felaktig gen ger mycket höga halter, två ger extremt höga. Därför är sjukdomen kodominant."},
      {q:"Hur många bär den felaktiga genen på sin ena kromosom?",o:["Mer än en person av tusen","En person av en miljon","Ungefär varannan person","Ingen, den är alltid dödlig"],why:"Boken: mer än en person av tusen. Det kan undersökas med ett enkelt gentest."}]},
    orderExo:{ty:"order",h:"Proteinets väg ut ur cellen",intro:"Lägg lärarens steg för exocytos i ordning.",src:"PPT Transport bild 24 · s. 37",items:[
      "Ribosomer på korniga ER tillverkar proteinet","Proteinet förs in i ER:s hålrum","En vesikel för proteinet till golgiapparatens cis-sida",
      "Proteinet modifieras i golgiapparaten","Proteinet lämnar golgiapparaten på trans-sidan i en vesikel","Vesikeln smälter ihop med cellmembranet och innehållet släpps ut"],why:"Boken börjar vid golgiapparaten, som producerar membranblåsorna. Läraren börjar redan vid ribosomerna på korniga ER."},
    whoK5:{ty:"who",h:"Vem är jag?",src:"s. 31–37",items:[
      {clues:["Jag är ett kanalprotein.","Antalet av mig varierar mellan celler, och vissa av mig kan stängas.","Jag släpper igenom vatten."],a:"Aquaporinen",w:["Jonkanalen","Bärarproteinet","Natrium-kaliumpumpen"],why:"Aquaporiner är vattenkanaler, och cellen har många fler av dem än jonkanaler."},
      {clues:["Jag finns i djurs cellmembran.","Ungefär 40 % av cellens ATP går till mig.","Jag flyttar ut tre Na⁺ och in två K⁺."],a:"Natrium-kaliumpumpen",w:["Bärarproteinet för glukos","Aquaporinen","LDL-receptorn"],why:"Natrium-kaliumpumpen upprätthåller jonbalansen och drivs av ATP."},
      {clues:["Jag har receptorer som binder inkräktare.","Jag skjuter ut två armar runt det jag tar upp.","Jag är en vit blodkropp som slukar bakterier."],a:"Fagocyten",w:["Lysosomen","Golgiapparaten","Den röda blodkroppen"],why:"Fagocyter är vita blodkroppar som gör fagocytos."},
      {clues:["Jag levde 1919–2010.","Min upptäckt har minskat barndödligheten i många U-länder.","Jag upptäckte den kopplade transporten av natrium och glukos i tarmceller."],a:"Robert K. Crane",w:["Alexander Fleming","Louis Pasteur","Robert Koch"],why:"Cranes upptäckt är bakgrunden till att patienter med vätskebrist får dricka salt och glukos."},
      {clues:["Jag är en partikel av kolesterol och protein.","Jag har mer kolesterol i förhållande till protein än HDL.","Jag kallas ibland det onda kolesterolet."],a:"LDL",w:["HDL","Glykoproteinet","Fosfolipiden"],why:"LDL tas upp i cellerna via endocytos med hjälp av LDL-receptorn."}]},
    abTransport:{ty:"cloze",h:"Arbetsblad: Transport över membran (s. 31–38)",bank:false,src:"Arbetsblad Transport · facit = faktabladet",text:"Cellmembranet består av ett dubbelt lager av [[fosfolipider|fosfolipid|fosfolipiderna]]. Faktorer som [[laddning|storlek|form|fettlöslighet]], [[storlek|laddning|form|fettlöslighet]], [[form|laddning|storlek|fettlöslighet]] och [[fettlöslighet|laddning|storlek|form|fettlösligheten]] påverkar hur lätt ett ämne tar sig igenom detta membran. När ett ämne rör sig från en högre koncentration till en lägre krävs ingen energi. Denna typ av transport kallas för [[diffusion|passiv transport]]. Om ett ämne istället transporteras från en lägre till en högre koncentration, d.v.s. mot [[koncentrationsgradienten|koncentrationsgradient|gradienten]] krävs energi. Denna transport kallas därför för [[aktiv transport|aktiv]] och sker med hjälp av [[proteinpumpar|proteinpump|pumpar|ATP-drivna proteinpumpar|atp-drivna proteinpumpar]] som drivs av [[ATP|adenosintrifosfat]]. Ibland kan ett ämne transporteras mot sin koncentrationsgradient genom att transporten kopplas till ett annat ämne som diffunderar. Detta kallas för [[kopplad transport|co-transport|cotransport|sekundär aktiv transport]]. Hydrofila ämnen måste ta hjälp av [[proteiner|protein|membranproteiner|transportproteiner]] för att de ska kunna transporteras genom ett cellmembran. Passiv transport av joner sker med hjälp av [[jonkanaler|jonkanal|kanalproteiner]]. De består av proteiner som bildar kanaler i cellmembranet. Vattenmolekyler diffunderar genom vattenkanaler som kallas för [[aquaporiner|akvaporiner|aquaporin|akvaporin]]. Celler innehåller många fler vattenkanaler jämfört med övriga kanalproteiner. Om en cell placeras i en lösning med hög saltkoncentration är det därför lättare för vattenmolekylerna att röra sig från en högre vattenkoncentration till en lägre än vad det är för saltjonerna. Denna diffusion av vatten över ett semipermeabelt membran kallas för [[osmos]]. Det finns även transportproteiner i cellmembranet som ändrar form när det binder till ett visst ämne (exempelvis glukos) och på så sätt lyfter ämnet igenom fosfolipidskiktet. Denna typ av transportproteiner kallas för [[bärarproteiner|bärarprotein|bärare]]. Större molekyler kan också transporteras genom cellmembranet med hjälp av membranblåsor. Sker denna transport in i cellen kallas det för [[endocytos]] och transporteras istället membranblåsornas innehåll ut ur cellen kallas det för [[exocytos]]. När stora partiklar, t.ex. bakterier, tas in i en cell med hjälp av vesiklar kallas det för [[fagocytos]], vilket kan översättas till \"cellätande\". Om makromolekyler istället tas upp lösta i vatten kallas det för \"celldrickande\", eller [[pinocytos]]."}
  },
  exOnly:["abTransport"],
  w:{
    /* ---------- osmolalitet: blodkropp och växtcell (Film Osmos) ---------- */
    k5Osml(el,api){
      el.className="wid";
      el.innerHTML=`<div class="wh"><b>Osmolalitet: blodkropp och växtcell</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0;padding:6px"><svg viewBox="0 0 420 262" role="img" aria-label="En röd blodkropp och en växtcell i en lösning med vald osmolalitet" id="k5-ol-svg"></svg></figure>
      <div><label class="ctl">Osmolalitet utanför: <span id="k5-ol-n"></span><input type="range" id="k5-ol-r" min="0" max="1100" step="5" value="290"></label>
      <div class="row"><button class="btn ghost sm" type="button" data-v="0">Destillerat vatten</button><button class="btn ghost sm" type="button" data-v="290">Blodplasma</button><button class="btn ghost sm" type="button" data-v="308">0,9 % NaCl</button><button class="btn ghost sm" type="button" data-v="1000">Havsvatten</button></div>
      <dl class="readout"><dt>Lösningen</dt><dd id="k5-ol-t"></dd><dt>Vattnet</dt><dd id="k5-ol-w"></dd><dt>Röd blodkropp</dt><dd id="k5-ol-rb"></dd><dt>Växtcell</dt><dd id="k5-ol-vc"></dd></dl>
      <p class="verdict" id="k5-ol-vd"></p><p id="k5-ol-why"></p>
      <p class="small">Cellernas insida ligger på ca 280–295 mOsm/kg (filmen). Var exakt blodkroppen spricker säger filmen inget om. I figuren spricker den under 150 mOsm/kg.</p></div></div>`;
      const svg=el.querySelector("#k5-ol-svg"),$=s=>el.querySelector(s);
      const D=[];let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
      let guard=0;while(D.length<56&&guard<5000){guard++;const x=10+rnd()*400,y=14+rnd()*196;
        if(Math.hypot(x-104,y-112)<86)continue;if(x>222&&x<408&&y>22&&y<204)continue;if(D.some(p=>Math.hypot(p[0]-x,p[1]-y)<11))continue;D.push([r1(x),r1(y)])}
      function cat(o){return o<280?"hypo":o<=295?"iso":o<=320?"nara":"hyper"}
      function draw(){const o=+$("#k5-ol-r").value,c=cat(o);let s="";
        s+=D.slice(0,Math.round(o/1100*D.length)).map(p=>dot(p[0],p[1],3,"--muted")).join("");
        s+=`<path d="M212 14 V214" fill="none" style="stroke:var(--line2)" stroke-dasharray="4 5" stroke-width="1.2"/>`;
        /* röd blodkropp */
        if(c==="hypo"&&o<150){s+=`<circle cx="104" cy="112" r="74" ${st("--c-vir-soft","--c-vir")} stroke-width="3" stroke-dasharray="16 7"/>`;[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([a,b])=>{s+=`<path d="M${r1(104+a*55)} ${r1(112+b*55)} l${a*12} ${b*12}" fill="none" style="stroke:var(--bad)" stroke-width="3"/>`})}
        else if(c==="hypo")s+=`<circle cx="104" cy="112" r="${r1(52+(280-o)/130*18)}" ${st("--c-vir-soft","--c-vir")} stroke-width="3"/>`;
        else if(c==="iso"||c==="nara")s+=`<ellipse cx="104" cy="112" rx="66" ry="36" ${st("--c-vir-soft","--c-vir")} stroke-width="3"/><ellipse cx="104" cy="112" rx="28" ry="12" style="fill:var(--c-vir)" opacity=".18"/>`;
        else s+=`<path d="${crenate(104,112,Math.max(30,46-(o-320)/780*16),3.5,13)}" ${st("--c-vir-soft","--c-vir")} stroke-width="3"/>`;
        /* växtcell */
        const k=c==="hyper"?Math.min(1,(o-320)/780):0,ins=c==="hypo"?4:c==="hyper"?12+k*40:c==="nara"?10:8,vr=c==="hypo"?62:c==="hyper"?46-k*26:c==="nara"?50:52;
        s+=`<rect x="226" y="26" width="178" height="174" rx="18" ${st("--c-wall-soft","--c-wall")} stroke-width="5"/><rect x="${r1(226+ins)}" y="${r1(26+ins)}" width="${r1(178-2*ins)}" height="${r1(174-2*ins)}" rx="14" ${st("--c-cyto","--c-mem")} stroke-width="3"/>`;
        s+=`<circle cx="315" cy="113" r="${r1(vr)}" ${st("--c-vac-soft","--c-vac")} stroke-width="2.5"/>`+(vr>=36?`<text x="315" y="117" text-anchor="middle" ${TW}>vakuol</text>`:"");
        if(c==="hypo"){s+=arr(14,26,42,52,"--c-vac",4,10)+arr(226,236,258,206,"--c-vac",4,10)}
        else if(c==="hyper"){s+=arr(56,112,22,112,"--c-vac",4,10)+arr(258,206,226,236,"--c-vac",4,10)}
        s+=`<text x="104" y="232" text-anchor="middle" ${TW}>röd blodkropp</text><text x="330" y="232" text-anchor="middle" ${TW}>växtcell</text>`;
        s+=`<text x="210" y="256" text-anchor="middle" class="lb halo">${{hypo:"vatten går in i cellerna",iso:"lika mycket vatten in som ut",nara:"nästan i balans",hyper:"vatten går ut ur cellerna"}[c]}</text>`;
        svg.innerHTML=s;
        $("#k5-ol-n").textContent=o+" mOsm/kg";
        $("#k5-ol-t").textContent={hypo:"hypoton",iso:"isoton",nara:"svagt hyperton, funktionellt isoton",hyper:"hyperton"}[c];
        $("#k5-ol-w").textContent={hypo:"går in i cellerna",iso:"lika mycket in som ut",nara:"nästan lika mycket in som ut",hyper:"går ut ur cellerna"}[c];
        $("#k5-ol-rb").textContent=c==="hypo"?(o<150?"sväller och spricker (hemolys)":"sväller"):c==="hyper"?"krymper och blir skrynklig":"normal form och funktion";
        $("#k5-ol-vc").textContent=c==="hypo"?"turgid (spänd), spricker inte":c==="hyper"?"plasmolys, membranet släpper cellväggen":"flaccid (slapp), i balans";
        let R;
        if(c==="hypo")R=[o<150?"b":"m",o<150?"Hemolys":"Cellerna sväller",`Utanför finns färre osmotiskt aktiva partiklar (${o} mOsm/kg) än inne i cellerna (ca 280–295). Vatten går från låg till hög osmolalitet, och därför strömmar det in. Blodkroppen sväller${o<150?" och spricker":""}, eftersom den saknar cellvägg. Växtcellen blir turgid men spricker inte, eftersom cellväggen håller emot. {{lek:Film Osmos}}`];
        else if(c==="iso")R=["g","Isoton",`${o} mOsm/kg ligger inom 280–295, samma som blodplasman och ungefär som cytosolen. Därför går lika mycket vatten in som ut, och ingen cell ändrar volym. {{lek:Film Osmos}}`];
        else if(c==="nara")R=["m","Nästan isoton",`${o} mOsm/kg ligger strax över 280–295. Tekniskt är lösningen svagt hyperton, men skillnaden är så liten att den fungerar som isoton. Fysiologisk koksaltlösning (308 mOsmol/L) ligger här. {{lek:Lektion}}`];
        else R=["b","Cellerna krymper",`Utanför finns fler osmotiskt aktiva partiklar (${o} mOsm/kg) än inne i cellerna, och de binder vatten. Därför går vatten ut. Blodkroppen krymper och blir skrynklig, och syretransporten kan försämras. Växtcellens membran drar sig från cellväggen (plasmolys), och växten slokar, eftersom turgortrycket försvinner.${o>=900?" Havsvatten ligger kring 1 000 mOsm/kg, och därför torkar det ut kroppens celler. {{lek:Lektion}}":""} {{lek:Film Osmos}}`];
        const vd=$("#k5-ol-vd");vd.className="verdict "+R[0];vd.textContent=R[1];$("#k5-ol-why").innerHTML=api.tpl(R[2])}
      $("#k5-ol-r").addEventListener("input",draw);
      el.querySelectorAll("button[data-v]").forEach(b=>b.addEventListener("click",()=>{$("#k5-ol-r").value=b.dataset.v;draw()}));
      draw();
    },
    /* ---------- koksaltkalkylatorn (Lektion) ---------- */
    k5Nacl(el,api){
      el.className="wid";
      el.innerHTML=`<div class="wh"><b>Koksaltkalkylatorn</b><span class="mono">Simulering</span></div>
      <label class="ctl">Halt NaCl: <span id="k5-na-n"></span><input type="range" id="k5-na-r" min="0" max="3.5" step="0.01" value="0.9"></label>
      <div class="row"><button class="btn ghost sm" type="button" data-v="0">Rent vatten</button><button class="btn ghost sm" type="button" data-v="0.86">0,86 %</button><button class="btn ghost sm" type="button" data-v="0.9">0,9 %</button><button class="btn ghost sm" type="button" data-v="3.5">3,5 % (havet)</button></div>
      <svg viewBox="0 0 420 86" role="img" aria-label="Skala för mOsm per liter" id="k5-na-svg" style="width:100%;max-width:520px;display:block;margin:8px 0"></svg>
      <dl class="readout"><dt>Gram NaCl per liter</dt><dd id="k5-na-g"></dd><dt>mmol NaCl (= Na⁺) per liter</dt><dd id="k5-na-m"></dd><dt>Partiklar, × 2</dt><dd id="k5-na-o"></dd></dl>
      <p id="k5-na-calc" style="font-variant-numeric:tabular-nums"></p>
      <p class="verdict" id="k5-na-vd"></p><p id="k5-na-why"></p>
      <p class="small">Kalkylatorn räknar med att NaCl väger 58,44 g per mol och att varje NaCl ger exakt två fria partiklar. {{extra}} Därför blir 3,5 % högre här än lektionens ca 1 000 mOsm/kg för havsvatten, som dessutom innehåller andra salter.</p>`;
      el.querySelectorAll(".small").forEach(p=>{p.innerHTML=api.tpl(p.innerHTML)});
      const svg=el.querySelector("#k5-na-svg"),$=s=>el.querySelector(s),fm=(n,d)=>n.toFixed(d).replace(".",","),X=v=>r1(14+Math.min(v,1200)/1200*392);
      function draw(){const p=+$("#k5-na-r").value,g=p*10,m=g/58.44*1000,o=m*2;
        let s=`<rect x="14" y="30" width="392" height="14" rx="7" ${st("--sunk","--line2")} stroke-width="1"/><rect x="${X(280)}" y="26" width="${r1(X(295)-X(280))}" height="22" ${st("--good")}/>`;
        s+=[0,300,600,900,1200].map(v=>`<path d="M${X(v)} 46 V52" fill="none" style="stroke:var(--muted)" stroke-width="1.2"/><text x="${X(v)}" y="68" text-anchor="${v===0?"start":v===1200?"end":"middle"}" ${TW}>${v}</text>`).join("");
        s+=`<text x="${X(287)}" y="18" text-anchor="middle" ${TW}>isoton 280–295</text><path d="M${X(o)} 24 V50" fill="none" style="stroke:var(--ink)" stroke-width="3"/><circle cx="${X(o)}" cy="37" r="6" ${st("--acc","--ink")} stroke-width="1.5"/>`;
        s+=`<text x="210" y="84" text-anchor="middle" ${TW}>mOsm/L</text>`;
        svg.innerHTML=s;
        $("#k5-na-n").textContent=fm(p,2)+" %";$("#k5-na-g").textContent=fm(g,1)+" g/L";$("#k5-na-m").textContent=fm(m,0)+" mmol/L";$("#k5-na-o").textContent=fm(o,0)+" mOsm/L";
        $("#k5-na-calc").textContent=`${fm(p,2)} % = ${fm(g,1)} g/L → ${fm(g,1)} ÷ 58,44 = ${fm(m,0)} mmol/L → × 2 = ${fm(o,0)} mOsm/L`;
        let R;
        if(o<1)R=["b","Rent vatten",`Inga partiklar alls. Rent vatten ges aldrig i dropp, eftersom det är hypotont. Vatten skulle strömma in i blodkropparna och ge hemolys och hjärnödem. {{lek:Lektion}}`];
        else if(o<280)R=["b","Hypoton",`${fm(o,0)} mOsm/L är under 280. Vatten skulle gå in i blodkropparna, och därför sväller de. {{lek:Film Osmos}}`];
        else if(o<=295)R=["g","Isoton",`${fm(o,0)} mOsm/L ligger inom 280–295. ${p<0.88?"Det är därför lektionen säger att 0,86 % teoretiskt är mer exakt än 0,9 %. ":""}{{lek:Lektion}}`];
        else if(o<=320)R=["g","Funktionellt isoton",`${fm(o,0)} mOsm/L är tekniskt svagt hyperton, men fungerar som isoton. Fysiologisk koksaltlösning, 0,9 % = 9 g/L = 154 mmol/L Na⁺, ger 154 × 2 = 308 mOsmol/L, eftersom varje NaCl blir två partiklar, Na⁺ och Cl⁻. {{lek:Lektion}}`];
        else R=["b","Hyperton",`${fm(o,0)} mOsm/L är mycket över 280–295. Vatten skulle dras ut ur cellerna, och de krymper.${p>=3?" Det är därför havsvatten (3,5 % salt) torkar ut kroppen i stället för att släcka törsten.":""} {{lek:Lektion}}`];
        const vd=$("#k5-na-vd");vd.className="verdict "+R[0];vd.textContent=R[1];$("#k5-na-why").innerHTML=api.tpl(R[2])}
      $("#k5-na-r").addEventListener("input",draw);
      el.querySelectorAll("button[data-v]").forEach(b=>b.addEventListener("click",()=>{$("#k5-na-r").value=b.dataset.v;draw()}));
      draw();
    },
    /* ---------- sockerbiten i teet ---------- */
    k5Te(el,api){
      el.className="wid";
      const N=60,TN=["kallt","ljummet","varmt"],SS=[4,6.5,9.5];
      el.innerHTML=`<div class="wh"><b>Sockerbiten i teet</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0;padding:6px"><svg viewBox="0 0 420 260" role="img" aria-label="Sockermolekyler som sprids i en kopp te" id="k5-te-svg"></svg></figure>
      <div><p class="small">Släpp i sockerbiten. Gissa först var sockret finns om en stund.</p>
      <div class="row"><button class="btn sm" type="button" id="k5-te-go">Släpp i sockerbiten</button><button class="btn ghost sm" type="button" id="k5-te-p">Pausa</button><button class="btn ghost sm" type="button" id="k5-te-s">Hoppa framåt</button></div>
      <label class="ctl">Teets temperatur: <span id="k5-te-tn">ljummet</span><input type="range" id="k5-te-t" min="0" max="2" step="1" value="1"></label>
      <dl class="readout"><dt>Nere vid botten</dt><dd id="k5-te-lo"></dd><dt>Uppe vid ytan</dt><dd id="k5-te-hi"></dd><dt>Jämnt fördelat</dt><dd id="k5-te-ev"></dd></dl>
      <p class="verdict" id="k5-te-vd"></p><p id="k5-te-why"></p><p class="small" id="k5-te-rm"></p></div></div>`;
      const svg=el.querySelector("#k5-te-svg"),$=s=>el.querySelector(s);
      svg.innerHTML=`<path d="M308 84 Q356 88 352 138 Q348 184 306 190" fill="none" style="stroke:var(--ink)" stroke-width="5"/><path d="M112 32 V222 Q112 248 138 248 H282 Q308 248 308 222 V32" ${st("--paper","--ink")} stroke-width="3"/>
        <path d="M116 56 V222 Q116 244 138 244 H282 Q304 244 304 222 V56 Z" ${st("--c-wall-soft")}/><path d="M116 56 H304" fill="none" style="stroke:var(--c-wall)" stroke-width="2"/>
        <path d="M116 118 H304 M116 180 H304" fill="none" style="stroke:var(--line2)" stroke-dasharray="4 5" stroke-width="1.2"/>
        <text x="102" y="92" text-anchor="end" ${TW}>ytan</text><text x="102" y="154" text-anchor="end" ${TW}>mitten</text><text x="102" y="216" text-anchor="end" ${TW}>botten</text>
        <rect id="k5-te-cube" x="196" y="212" width="28" height="26" rx="3" ${st("--paper","--muted")} stroke-width="1.5"/><g id="k5-te-g"></g>`;
      const g=svg.querySelector("#k5-te-g"),cube=svg.querySelector("#k5-te-cube");
      const C=[];for(let i=0;i<N;i++)C.push(api.sv("circle",{r:3.2,style:"fill:var(--c-euk)"},g));
      let P=[],run=false,raf=0,fr=0,started=false;
      function reset(){P=[];for(let i=0;i<N;i++)P.push({x:199+Math.random()*22,y:215+Math.random()*20});fr=0}
      function step(){const s=SS[+$("#k5-te-t").value];for(const p of P){p.x+=(Math.random()*2-1)*s;p.y+=(Math.random()*2-1)*s;
        if(p.x<121)p.x=242-p.x;if(p.x>299)p.x=598-p.x;if(p.y<61)p.y=122-p.y;if(p.y>239)p.y=478-p.y}}
      function draw(){for(let i=0;i<N;i++){C[i].setAttribute("cx",r1(P[i].x));C[i].setAttribute("cy",r1(P[i].y))}}
      function stats(){let lo=0,hi=0;for(const p of P){if(p.y>180)lo++;else if(p.y<118)hi++}
        const ev=started?Math.max(0,Math.round(100*(1-Math.abs(lo-hi)/N))):0;
        $("#k5-te-lo").textContent=lo+" av "+N;$("#k5-te-hi").textContent=hi+" av "+N;$("#k5-te-ev").textContent=ev+" %";
        const vd=$("#k5-te-vd");let w;
        if(!started){vd.className="verdict m";vd.textContent="Sockerbiten ligger på botten";w="Alla sockermolekyler sitter samlade i sockerbiten. Där är koncentrationen hög, och uppe vid ytan är den noll. Det är en brant koncentrationsgradient."}
        else if(ev<35){vd.className="verdict m";vd.textContent="Hög koncentration vid botten";w="Molekylerna har börjat röra sig slumpmässigt åt alla håll. De flesta finns fortfarande nere vid botten, där koncentrationen är hög."}
        else if(ev<88){vd.className="verdict g";vd.textContent="Sockret sprids från hög till låg koncentration";w="Varje molekyl rör sig slumpmässigt, åt vilket håll som helst. Men det finns fler molekyler nere som kan röra sig uppåt än uppe som kan röra sig nedåt, och därför blir nettoförflyttningen uppåt, från hög till låg koncentration. Sockret följer koncentrationsgradienten, och ingen tillför energi. {{src:s. 31}}"}
        else{vd.className="verdict g";vd.textContent="Jämnt fördelat";w="Nu är sockret jämnt fördelat, och gradienten är borta. Molekylerna rör sig fortfarande slumpmässigt, men lika många rör sig uppåt som nedåt. Därför blir det ingen nettoförflyttning längre. {{src:s. 31}}"}
        $("#k5-te-why").innerHTML=api.tpl(w+" "+["I kallt te rör sig molekylerna långsammare, och därför tar det längre tid. {{extra}}","","I varmt te rör sig molekylerna snabbare, och därför sprids sockret fortare. {{extra}} Läraren säger att diffusionens energi kommer från molekylernas värmerörelse. {{lek:Transport bild 5}}"][+$("#k5-te-t").value])}
      function loop(){if(!el.isConnected||!run){run=false;raf=0;return}for(let k=0;k<4;k++)step();fr++;draw();if(fr%8===0)stats();
        if(fr>2200){run=false;raf=0;stats();$("#k5-te-p").textContent="Fortsätt";return}raf=requestAnimationFrame(loop)}
      function start(){if(RM()){run=false;draw();stats();return}run=true;$("#k5-te-p").textContent="Pausa";if(!raf)raf=requestAnimationFrame(loop)}
      $("#k5-te-go").addEventListener("click",()=>{reset();started=true;cube.setAttribute("opacity","0.25");draw();stats();start()});
      $("#k5-te-p").addEventListener("click",()=>{if(!started)return;if(run){run=false;$("#k5-te-p").textContent="Fortsätt"}else{fr=0;start()}});
      $("#k5-te-s").addEventListener("click",()=>{if(!started){reset();started=true;cube.setAttribute("opacity","0.25")}for(let k=0;k<300;k++)step();draw();stats()});
      $("#k5-te-t").addEventListener("input",()=>{$("#k5-te-tn").textContent=TN[+$("#k5-te-t").value];stats()});
      if(RM())$("#k5-te-rm").textContent="Rörelse är avstängd i din webbläsare. Tryck på Hoppa framåt för att se hur sockret sprids.";
      reset();draw();stats();
    },
    /* ---------- cellen andas ---------- */
    k5Andas(el,api){
      el.className="wid";
      el.innerHTML=`<div class="wh"><b>Cellen andas</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0;padding:6px"><svg viewBox="0 0 420 250" role="img" aria-label="Syre och koldioxid som diffunderar över cellmembranet" id="k5-an-svg"></svg></figure>
      <div><p class="small">Inne i cellen är halterna låsta: syre 40 och koldioxid 60. Ändra halterna utanför.</p>
      <label class="ctl">Syrehalt utanför: <span id="k5-an-on"></span><input type="range" id="k5-an-o" min="0" max="100" step="10" value="80"></label>
      <label class="ctl">Koldioxidhalt utanför: <span id="k5-an-cn"></span><input type="range" id="k5-an-c" min="0" max="100" step="10" value="20"></label>
      <dl class="readout"><dt>Syre</dt><dd id="k5-an-od"></dd><dt>Koldioxid</dt><dd id="k5-an-cd"></dd></dl>
      <p class="verdict" id="k5-an-vd"></p><p id="k5-an-why"></p></div></div>`;
      const svg=el.querySelector("#k5-an-svg"),$=s=>el.querySelector(s);
      const LO=[[24,40],[60,30],[96,46],[30,78],[70,70],[22,168],[56,190],[94,206],[30,214],[66,226]],RO=[[324,40],[360,30],[396,46],[330,78],[392,72],[322,170],[358,190],[396,200],[330,214],[370,226]];
      const IO=[[180,92],[236,90],[188,158],[244,160]],IC=[[208,80],[176,104],[250,106],[214,170],[228,148],[170,146]];
      function draw(){const o=+$("#k5-an-o").value,c=+$("#k5-an-c").value;
        let s=`<circle cx="210" cy="125" r="72" ${st("--c-cyto","--c-mem")} stroke-width="7"/>`;
        s+=LO.slice(0,o/10).map(p=>dot(p[0],p[1],5,"--c-mito")).join("")+RO.slice(0,c/10).map(p=>dot(p[0],p[1],5,"--muted")).join("");
        s+=IO.map(p=>dot(p[0],p[1],5,"--c-mito")).join("")+IC.map(p=>dot(p[0],p[1],5,"--muted")).join("");
        s+=`<text x="70" y="16" text-anchor="middle" ${TW}>O₂ ute: ${o}</text><text x="350" y="16" text-anchor="middle" ${TW}>CO₂ ute: ${c}</text><text x="210" y="129" text-anchor="middle" ${TW}>inne: O₂ 40, CO₂ 60</text>`;
        if(o>40)s+=arr(84,125,132,125,"--c-mito",4,11);else if(o<40)s+=arr(134,125,86,125,"--c-mito",4,11);
        if(c<60)s+=arr(288,125,336,125,"--muted",4,11);else if(c>60)s+=arr(338,125,290,125,"--muted",4,11);
        s+=dot(150,240,5,"--c-mito")+`<text x="160" y="244" ${TW}>syre</text>`+dot(220,240,5,"--muted")+`<text x="230" y="244" ${TW}>koldioxid</text>`;
        svg.innerHTML=s;
        $("#k5-an-on").textContent=o;$("#k5-an-cn").textContent=c;
        const oS=o>40?"in":o<40?"ut":"lika",cS=c<60?"ut":c>60?"in":"lika";
        $("#k5-an-od").textContent={in:"diffunderar in",ut:"diffunderar ut",lika:"ingen nettoförflyttning"}[oS];
        $("#k5-an-cd").textContent={in:"diffunderar in",ut:"diffunderar ut",lika:"ingen nettoförflyttning"}[cS];
        const okO=oS==="in",okC=cS==="ut",vd=$("#k5-an-vd");
        vd.className="verdict "+(okO&&okC?"g":(okO||okC)?"m":"b");vd.textContent=okO&&okC?"Cellen andas":(okO||okC)?"Bara hälften fungerar":"Cellen kan inte andas";
        const tO={in:`Syrehalten är högre utanför (${o}) än inuti (40), och därför diffunderar syre in.`,ut:`Syrehalten är högre inuti (40) än utanför (${o}). Då diffunderar syret ut, och cellen förlorar syre som den behöver.`,lika:"Syrehalten är lika på båda sidor, och därför sker ingen nettoförflyttning av syre."}[oS];
        const tC={ut:`Koldioxidhalten är högre inuti (60) än utanför (${c}), och därför diffunderar koldioxid ut.`,in:`Koldioxidhalten är högre utanför (${c}) än inuti (60). Då diffunderar koldioxid in, och cellen blir inte av med den.`,lika:"Koldioxidhalten är lika på båda sidor, och därför blir cellen inte av med sin koldioxid."}[cS];
        $("#k5-an-why").innerHTML=api.tpl(tO+" "+tC+" Varje ämne följer sin egen koncentrationsgradient, och det kostar ingen energi. {{src:s. 32}}")}
      $("#k5-an-o").addEventListener("input",draw);$("#k5-an-c").addEventListener("input",draw);draw();
    },
    /* ---------- grinden och svängdörren ---------- */
    k5Kanal(el,api){
      el.className="wid";
      const S={sig:"ingen",st:0,n:0,last:"k"};
      el.innerHTML=`<div class="wh"><b>Grinden och svängdörren</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0;padding:6px"><svg viewBox="0 0 420 250" role="img" aria-label="Ett kanalprotein och ett bärarprotein i cellmembranet" id="k5-ka-svg"></svg></figure>
      <div>${segHTML("k5-ka-s","Signal till kanalproteinet",[["ingen","Ingen"],["kem","Kemisk"],["el","Elektrisk"],["mek","Mekanisk"]],"ingen")}
      <div class="row"><button class="btn sm" type="button" id="k5-ka-n">Bärarproteinet: nästa steg</button></div>
      <dl class="readout"><dt>Kanalen</dt><dd id="k5-ka-k"></dd><dt>Bäraren</dt><dd id="k5-ka-b"></dd></dl>
      <p class="verdict" id="k5-ka-vd"></p><p id="k5-ka-why"></p></div></div>`;
      const svg=el.querySelector("#k5-ka-svg"),$=s=>el.querySelector(s);
      function draw(){const open=S.sig!=="ingen";let s=bilH(0,420,100,160,[[62,138],[250,350]]);
        if(open)s+=`<rect x="96" y="92" width="8" height="76" ${st("--c-vac-soft")}/>`;
        const dx=open?4:0;
        s+=`<rect x="${70-dx}" y="88" width="30" height="84" rx="9" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2"/><rect x="${100+dx}" y="88" width="30" height="84" rx="9" ${st("--c-nuc-soft","--c-nuc")} stroke-width="2"/>`;
        const up=[[78,52],[100,40],[122,56],[88,72],[114,76],[140,64]];
        s+=(open?up.slice(0,4):up).map(p=>dot(p[0],p[1],4,"--c-mito")).join("");
        s+=(open?[[100,116],[100,146],[90,192],[112,208],[96,226]]:[[100,214]]).map(p=>dot(p[0],p[1],4,"--c-mito")).join("");
        if(open)s+=arr(100,64,100,84,"--ink",2,7)+arr(100,176,100,196,"--ink",2,7);
        else s+=`<path d="M100 92 V168" fill="none" style="stroke:var(--c-nuc)" stroke-width="2"/>`;
        s+=carrier(300,100,160,S.st===2?"down":"up");
        const GO=[[262,40],[284,58],[312,44],[336,62],[350,40],[276,74]],gin=S.n+(S.st===2?1:0);
        s+=GO.slice(0,S.st===0?6:5).map(p=>hexa(p[0],p[1],6,"--c-golgi")).join("");
        if(S.st===1)s+=hexa(300,122,6,"--c-golgi");
        if(S.st===2)s+=hexa(300,186,6,"--c-golgi")+arr(300,194,300,206,"--ink",1.8,6);
        const GI=[[270,214],[332,222],[352,200],[286,232],[318,240],[262,196],[364,226],[340,240]];
        s+=GI.slice(0,Math.min(GI.length,1+gin-(S.st===2?1:0))).map(p=>hexa(p[0],p[1],6,"--c-golgi")).join("");
        s+=`<text x="8" y="18" class="lbs" style="font-size:14px;fill:var(--muted)">utsida</text><text x="8" y="244" class="lbs" style="font-size:14px;fill:var(--muted)">insida</text><text x="100" y="18" text-anchor="middle" ${TW}>kanalprotein</text><text x="300" y="18" text-anchor="middle" ${TW}>bärarprotein</text>`;
        svg.innerHTML=s;
        const SN={kem:"kemisk",el:"elektrisk",mek:"mekanisk"};
        $("#k5-ka-k").textContent=open?"öppen ("+SN[S.sig]+" signal)":"stängd";
        $("#k5-ka-b").textContent=["öppen mot utsidan","glukos har bundit","har ändrat form"][S.st]+", "+(1+gin)+" glukos inne";
        const vd=$("#k5-ka-vd");let w;
        if(S.last==="k"){if(open){vd.className="verdict g";vd.textContent="Grinden är öppen";w="En "+SN[S.sig]+" signal har öppnat kanalen. Jonerna diffunderar genom den vattenfyllda kanalen från hög till låg koncentration, och därför behövs ingen energi. Kanalen är specifik och släpper bara igenom en sorts jon. {{src:s. 32}}"}
          else{vd.className="verdict m";vd.textContent="Grinden är stängd";w="Utan signal är kanalen stängd. Jonerna kan inte heller ta sig genom fosfolipidskiktet, eftersom de omges av ett skal av vattenmolekyler. Välj en signal. Kanaler öppnas och stängs av kemiska, elektriska och mekaniska stimuli. {{src:s. 31–32}}"}}
        else{vd.className="verdict "+(S.st===2?"g":"m");vd.textContent=["Svängdörren väntar","Glukos binder","Glukos är inne"][S.st];
          w=["Bärarproteinet är öppet mot utsidan, där det finns mest glukos. Tryck på nästa steg.","Glukos har bundit till bärarproteinet. Bindningen gör att proteinet ändrar form.","Bärarproteinet har ändrat form och öppnat sig mot insidan. Glukos släpps där koncentrationen är lägre. Det är diffusion, och därför krävs ingen energi. {{src:s. 32}}"][S.st]}
        $("#k5-ka-why").innerHTML=api.tpl(w)}
      segWire(el,"k5-ka-s",v=>{S.sig=v;S.last="k";draw()});
      $("#k5-ka-n").addEventListener("click",()=>{if(S.st===2){S.n++;S.st=0}else S.st++;if(S.n>5)S.n=0;S.last="b";draw()});
      draw();
    },
    /* ---------- osmos: röd blodkropp eller växtcell ---------- */
    k5Osmos(el,api){
      el.className="wid";
      const S={c:"r"},NM=["destillerat vatten","svag saltlösning","isoton lösning","stark saltlösning","mycket stark saltlösning"];
      el.innerHTML=`<div class="wh"><b>Osmos: röd blodkropp eller växtcell</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0;padding:6px"><svg viewBox="0 0 420 262" role="img" aria-label="En cell i en lösning med olika halt av lösta ämnen" id="k5-os-svg"></svg></figure>
      <div>${segHTML("k5-os-c","Cell",[["r","Röd blodkropp"],["v","Växtcell"]],"r")}
      <label class="ctl">Halt av lösta ämnen utanför: <span id="k5-os-n"></span><input type="range" id="k5-os-r" min="0" max="4" step="1" value="2"></label>
      <dl class="readout"><dt>Lösningen är</dt><dd id="k5-os-t"></dd><dt>Vattenkoncentration utanför</dt><dd id="k5-os-wc"></dd><dt>Vattnet</dt><dd id="k5-os-w"></dd><dt>Cellen</dt><dd id="k5-os-cc"></dd></dl>
      <p class="verdict" id="k5-os-vd"></p><p id="k5-os-why"></p></div></div>`;
      const svg=el.querySelector("#k5-os-svg"),$=s=>el.querySelector(s);
      const D=[];let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
      while(D.length<44){const x=12+rnd()*396,y=30+rnd()*200;if(x>104&&x<316)continue;if(y>98&&y<146)continue;if(D.some(p=>Math.hypot(p[0]-x,p[1]-y)<13))continue;D.push([r1(x),r1(y)])}
      function draw(){const L=+$("#k5-os-r").value,pl=S.c==="v",ton=L<2?"hypo":L===2?"iso":"hyper";let s="";
        s+=D.slice(0,[0,8,16,30,44][L]).map(p=>dot(p[0],p[1],3.2,"--muted")).join("");
        if(pl){const ins=[6,6,8,26,42][L],vr=[70,66,58,40,26][L];
          s+=`<rect x="122" y="36" width="176" height="176" rx="22" ${st("--c-wall-soft","--c-wall")} stroke-width="5"/><rect x="${122+ins}" y="${36+ins}" width="${176-2*ins}" height="${176-2*ins}" rx="14" ${st("--c-cyto","--c-mem")} stroke-width="3"/>`;
          s+=`<circle cx="210" cy="124" r="${vr}" ${st("--c-vac-soft","--c-vac")} stroke-width="2.5"/>`;
          if(L<=1)for(let k=0;k<4;k++){const a=Math.PI/4+k*Math.PI/2;s+=arr(210+(vr-24)*Math.cos(a),124+(vr-24)*Math.sin(a),210+(vr+6)*Math.cos(a),124+(vr+6)*Math.sin(a),"--c-vac",2.4,7)}
          s+=`<text x="210" y="128" text-anchor="middle" ${TW}>vakuol</text><text x="210" y="28" text-anchor="middle" ${TW}>cellvägg</text>`;
        }else{
          if(L===0){s+=`<circle cx="210" cy="124" r="86" ${st("--c-vir-soft","--c-vir")} stroke-width="3" stroke-dasharray="18 7"/>`;[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([a,b])=>{s+=`<path d="M${r1(210+a*64)} ${r1(124+b*64)} l${a*12} ${b*12}" fill="none" style="stroke:var(--bad)" stroke-width="3"/>`})}
          else if(L===1)s+=`<circle cx="210" cy="124" r="76" ${st("--c-vir-soft","--c-vir")} stroke-width="3"/>`;
          else if(L===2)s+=`<ellipse cx="210" cy="124" rx="76" ry="42" ${st("--c-vir-soft","--c-vir")} stroke-width="3"/><ellipse cx="210" cy="124" rx="32" ry="14" style="fill:var(--c-vir)" opacity=".18"/>`;
          else s+=`<path d="${L===3?crenate(210,124,50,5,14):crenate(210,124,36,6,12)}" ${st("--c-vir-soft","--c-vir")} stroke-width="3"/>`;
          s+=`<text x="210" y="${L===2?108:128}" text-anchor="middle" ${TW}>röd blodkropp</text>`}
        if(ton==="hypo")s+=arr(30,122,96,122,"--c-vac",4,11)+arr(390,122,324,122,"--c-vac",4,11);
        else if(ton==="hyper")s+=arr(96,122,30,122,"--c-vac",4,11)+arr(324,122,390,122,"--c-vac",4,11);
        else s+=arr(30,122,96,122,"--c-vac",4,11)+arr(324,122,390,122,"--c-vac",4,11);
        s+=`<text x="62" y="112" text-anchor="middle" ${TW}>H₂O</text><text x="358" y="112" text-anchor="middle" ${TW}>H₂O</text>`;
        s+=`<text x="210" y="254" text-anchor="middle" class="lb halo">${{hypo:"vatten går in i cellen",iso:"lika mycket vatten in som ut",hyper:"vatten går ut ur cellen"}[ton]}</text>`;
        svg.innerHTML=s;
        $("#k5-os-n").textContent=NM[L];$("#k5-os-t").textContent={hypo:"hypoton",iso:"isoton",hyper:"hyperton"}[ton];
        $("#k5-os-wc").textContent={hypo:"högre än i cellen",iso:"samma som i cellen",hyper:"lägre än i cellen"}[ton];
        $("#k5-os-w").textContent={hypo:"diffunderar in",iso:"lika mycket in som ut",hyper:"diffunderar ut"}[ton];
        let R;
        if(!pl)R={hypo:L===0?["b","Spricker","sväller och spricker","Destillerat vatten har ingen halt av lösta ämnen och alltså högre vattenkoncentration än cellen. Därför diffunderar vatten in genom aquaporinerna. Blodkroppen har inget som håller emot, och därför sväller den tills den till slut sprängs. {{src:s. 33}}"]:["m","Sväller","sväller","Lösningen har lägre halt av lösta ämnen än cellen, alltså högre vattenkoncentration. Därför diffunderar vatten in, och blodkroppen sväller. {{src:s. 33}}"],
          iso:["g","Påverkas inte","oförändrad","Lösningen har samma koncentration av lösta ämnen som cytoplasman. Då är också vattenkoncentrationen densamma, och lika många vattenmolekyler diffunderar in som ut. {{src:s. 33}}"],
          hyper:["b","Krymper","krymper","Saltlösningen har lägre vattenkoncentration än cellen. Därför går vatten från den högre vattenkoncentrationen inuti cellen till den lägre i lösningen, och blodkroppen töms på vatten och krymper. Saltjonerna följer inte med lika snabbt, eftersom det finns färre jonkanaler än vattenkanaler. {{src:s. 33}}"]}[ton];
        else R={hypo:["g","Turgor, spricker inte","vakuolen sväller och trycker mot cellväggen","Vatten diffunderar in genom osmos, och vakuolen sväller. Cellen spricker ändå inte, eftersom cellväggen håller emot. Trycket mot väggen kallas turgor. Läs mer om {{go:k13.vakuolen|vakuolen i K13}}. {{src:s. 245–246}}"],
          iso:["m","Ingen förändring","ingen nettoförflyttning","Lösningen har samma halt lösta ämnen som cellen, och därför diffunderar lika mycket vatten in som ut. {{src:s. 33}}"],
          hyper:["b","Krymper innanför väggen","vakuolen krymper, membranet släpper väggen","Vatten diffunderar ut, eftersom vattenkoncentrationen är lägre utanför. Vakuolen krymper och cellmembranet drar sig bort från cellväggen, som behåller sin form. Det kallas plasmolys. {{extra}} Jämför med {{go:k13.vakuolen|vakuolen i K13}}."]}[ton];
        $("#k5-os-cc").textContent=R[2];const vd=$("#k5-os-vd");vd.className="verdict "+R[0];vd.textContent=R[1];$("#k5-os-why").innerHTML=api.tpl(R[3])}
      segWire(el,"k5-os-c",v=>{S.c=v;draw()});$("#k5-os-r").addEventListener("input",draw);draw();
    },
    /* ---------- kopplad transport: symport ---------- */
    k5Symport(el,api){
      el.className="wid";
      const S={};
      function reset(){Object.assign(S,{i:0,naO:10,naI:2,gO:4,gI:5,atp:0,on:S.on===undefined?true:S.on,stop:false})}
      reset();
      el.innerHTML=`<div class="wh"><b>Natrium tar med sig glukos</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0;padding:6px"><svg viewBox="0 0 420 262" role="img" aria-label="Kopplad transport av natrium och glukos i en tarmcell" id="k5-sy-svg"></svg></figure>
      <div>${segHTML("k5-sy-a","ATP till natrium-kaliumpumpen",[["on","På"],["off","Av"]],"on")}
      <div class="row"><button class="btn sm" type="button" id="k5-sy-n">Nästa steg</button><button class="btn ghost sm" type="button" id="k5-sy-r">Börja om</button></div>
      <dl class="readout"><dt>Na⁺ ute / inne</dt><dd id="k5-sy-na"></dd><dt>Glukos ute / inne</dt><dd id="k5-sy-g"></dd><dt>ATP använda</dt><dd id="k5-sy-atp"></dd></dl>
      <p class="verdict" id="k5-sy-vd"></p><p id="k5-sy-why"></p></div></div>`;
      const svg=el.querySelector("#k5-sy-svg"),$=s=>el.querySelector(s);
      const NO=[[20,40],[44,62],[30,86],[160,36],[184,58],[206,40],[230,64],[170,84],[214,86],[22,64],[384,40],[400,66],[248,40],[148,60],[392,88],[240,86]];
      const NI=[[20,196],[44,214],[160,190],[186,214],[212,192],[30,236],[170,236],[232,214],[200,238],[146,214],[54,240],[240,240],[226,190],[22,218],[134,240],[188,192]];
      const GOp=[[350,34],[376,52],[400,30],[396,80]],GIp=[[350,196],[376,214],[400,192],[392,236],[356,238],[410,214],[334,222],[372,238],[408,250],[344,250]];
      function pumpShape(cx,dir,f,sc){const yT=104,yB=156,t=yT-10,b=yB+10,m=(yT+yB)/2;let d;
        if(dir==="down")d=`M${cx-30} ${t} L${cx+30} ${t} Q${cx+46} ${m} ${cx+40} ${b} L${cx+18} ${b} L${cx+8} ${m-14} L${cx-8} ${m-14} L${cx-18} ${b} L${cx-40} ${b} Q${cx-46} ${m} ${cx-30} ${t} Z`;
        else d=`M${cx-40} ${t} L${cx-18} ${t} L${cx-8} ${m+14} L${cx+8} ${m+14} L${cx+18} ${t} L${cx+40} ${t} Q${cx+46} ${m} ${cx+30} ${b} L${cx-30} ${b} Q${cx-46} ${m} ${cx-40} ${t} Z`;
        return `<path d="${d}" ${st(f,sc)} stroke-width="2"/>`}
      function draw(){let s=bilH(0,420,104,156,[[52,148],[244,346]]);
        const i=S.i,bound=i===1,rel=i===2;
        s+=pumpShape(100,"up","--c-euk-soft","--c-euk")+pumpShape(295,rel?"down":"up","--c-nuc-soft","--c-nuc");
        if(i===3&&S.on)s+=arr(100,180,100,70,"--c-bact",3,10)+star(150,196,12,"--t-atp")+bolt(140,186,124,166,"--t-atp");
        s+=NO.slice(0,Math.max(0,S.naO-(bound?2:0))).map(p=>dot(p[0],p[1],5.5,"--c-bact-soft","--c-bact")).join("");
        s+=NI.slice(0,Math.max(0,S.naI-(rel?2:0))).map(p=>dot(p[0],p[1],5.5,"--c-bact-soft","--c-bact")).join("");
        s+=GOp.slice(0,S.gO-(bound?1:0)).map(p=>hexa(p[0],p[1],7,"--c-chl-soft","--c-chl")).join("");
        s+=GIp.slice(0,Math.min(GIp.length,S.gI-(rel?1:0))).map(p=>hexa(p[0],p[1],7,"--c-chl-soft","--c-chl")).join("");
        if(bound)s+=dot(287,112,5.5,"--c-bact-soft","--c-bact")+dot(303,112,5.5,"--c-bact-soft","--c-bact")+hexa(295,128,7,"--c-chl-soft","--c-chl");
        if(rel)s+=dot(285,182,5.5,"--c-bact-soft","--c-bact")+dot(305,182,5.5,"--c-bact-soft","--c-bact")+hexa(295,198,7,"--c-chl-soft","--c-chl")+arr(318,178,318,198,"--ink",2,7);
        s+=`<text x="8" y="16" class="lbs" style="font-size:14px;fill:var(--muted)">tarmen (utsida)</text><text x="8" y="258" class="lbs" style="font-size:14px;fill:var(--muted)">tarmcellen (insida)</text><text x="100" y="186" text-anchor="middle" class="lbs" style="font-size:14px;fill:var(--muted)">Na⁺/K⁺-pump</text><text x="295" y="18" text-anchor="middle" class="lbs" style="font-size:14px;fill:var(--muted)">symport</text>`;
        svg.innerHTML=s;
        $("#k5-sy-na").textContent=S.naO+" / "+S.naI;$("#k5-sy-g").textContent=S.gO+" / "+S.gI;$("#k5-sy-atp").textContent=S.atp;
        const vd=$("#k5-sy-vd");let w;
        if(S.stop){vd.className="verdict b";vd.textContent="Transporten har stannat";w="Nu finns det lika mycket Na⁺ inne som ute. Utan koncentrationsgradient ingen diffusion, och därför kan natriumet inte längre dra med sig glukos. Det är därför kopplad transport kräver ATP indirekt. Slå på ATP och börja om. {{src:s. 34–35}}"}
        else if(i===0){vd.className="verdict m";vd.textContent="Utgångsläge";w="Natrium-kaliumpumpen har använt ATP för att pumpa ut Na⁺. Därför är Na⁺-halten hög i tarmen och låg i cellen. Det är del 1, backen som byggs upp. Glukos finns redan i högre halt inne i cellen än i tarmen."}
        else if(i===1){vd.className="verdict m";vd.textContent="Två Na⁺ och en glukos binder";w="Transportproteinet binder två natriumjoner och en glukosmolekyl från tarmen samtidigt. Två Na⁺ per glukos, precis som i bokens faktaruta. {{src:s. 35}}"}
        else if(i===2){vd.className="verdict g";vd.textContent="Glukos dras med in";w="Proteinet ändrar form. Na⁺ följer sin gradient in i cellen och drar med sig glukos, som därmed går mot sin egen gradient. Båda går åt samma håll, och det kallas symport. Det här är del 2. {{lek:Transport bild 18}}"}
        else if(S.on){vd.className="verdict g";vd.textContent="Pumpen håller backen uppe";w="Natrium-kaliumpumpen pumpar ut natriumet igen med ATP (3 Na⁺ ut och 2 K⁺ in per ATP). Därför finns natriumgradienten kvar, och nästa varv kan börja. Kopplad transport kräver alltså ATP indirekt. {{src:s. 34–35}}"}
        else{vd.className="verdict b";vd.textContent="Pumpen står still";w="Utan ATP pumpas inget natrium ut. Natriumet som kom in blir kvar i cellen, och gradienten blir mindre för varje varv."}
        $("#k5-sy-why").innerHTML=api.tpl(w)}
      $("#k5-sy-n").addEventListener("click",()=>{if(S.stop)return;
        if(S.i===0){if(S.naO-2<S.naI+2){S.stop=true;draw();return}S.i=1}
        else if(S.i===1){S.i=2;S.naO-=2;S.naI+=2;S.gO=4;S.gI++}
        else if(S.i===2){S.i=3;if(S.on){const m=Math.min(3,S.naI-1);S.naI-=m;S.naO+=m;S.atp++}}
        else S.i=0;
        draw()});
      $("#k5-sy-r").addEventListener("click",()=>{reset();draw()});
      segWire(el,"k5-sy-a",v=>{S.on=v==="on";draw()});
      draw();
    },
    /* ---------- natrium-kaliumpumpen ---------- */
    k5Pump(el,api){
      el.className="wid";
      const S={i:-1,na:0,k:0,atp:0,dig:false,naIn:2};
      el.innerHTML=`<div class="wh"><b>Natrium-kaliumpumpen steg för steg</b><span class="mono">Simulering</span></div>
      <div class="wgrid"><figure style="margin:0;padding:6px"><svg viewBox="0 0 420 262" role="img" aria-label="Natrium-kaliumpumpen i cellmembranet" id="k5-pu-svg"></svg></figure>
      <div>${segHTML("k5-pu-d","Läkemedel",[["nej","Inget"],["ja","Digoxin"]],"nej")}
      <div class="row"><button class="btn sm" type="button" id="k5-pu-n">Nästa steg</button><button class="btn ghost sm" type="button" id="k5-pu-r">Börja om</button></div>
      <dl class="readout"><dt>Steg</dt><dd id="k5-pu-s"></dd><dt>Na⁺ ut totalt</dt><dd id="k5-pu-na"></dd><dt>K⁺ in totalt</dt><dd id="k5-pu-k"></dd><dt>ATP använda</dt><dd id="k5-pu-atp"></dd></dl>
      <p class="verdict" id="k5-pu-vd"></p><p id="k5-pu-why"></p>
      <p class="small">Stegens ordning är förenklad. Läraren: 3 Na⁺ ut och 2 K⁺ in, ett ATP per förflyttning och en fosfatgrupp som binds till pumpen (bild 19).</p></div></div>`;
      const svg=el.querySelector("#k5-pu-svg"),$=s=>el.querySelector(s);
      function shape(dir){const cx=210,yT=104,yB=156,t=yT-10,b=yB+10,m=(yT+yB)/2;let d;
        if(dir==="down")d=`M${cx-30} ${t} L${cx+30} ${t} Q${cx+46} ${m} ${cx+40} ${b} L${cx+18} ${b} L${cx+8} ${m-14} L${cx-8} ${m-14} L${cx-18} ${b} L${cx-40} ${b} Q${cx-46} ${m} ${cx-30} ${t} Z`;
        else d=`M${cx-40} ${t} L${cx-18} ${t} L${cx-8} ${m+14} L${cx+8} ${m+14} L${cx+18} ${t} L${cx+40} ${t} Q${cx+46} ${m} ${cx+30} ${b} L${cx-30} ${b} Q${cx-46} ${m} ${cx-40} ${t} Z`;
        return `<path d="${d}" ${st("--c-euk-soft","--c-euk")} stroke-width="2"/>`}
      const NA=(x,y)=>dot(x,y,5.5,"--c-bact-soft","--c-bact"),KK=(x,y)=>tri(x,y,6.5,"--c-arch-soft","--c-arch");
      function draw(){const i=S.i;let s=bilH(0,420,104,156,[[166,254]]);
        s+=`<text x="10" y="26" text-anchor="start" class="lbs" style="font-size:14px;fill:var(--muted)">+ + +</text><text x="10" y="94" class="lbs" style="font-size:14px;fill:var(--muted)">utsida</text><text x="10" y="176" class="lbs" style="font-size:14px;fill:var(--muted)">insida</text><text x="10" y="248" class="lbs" style="font-size:14px;fill:var(--muted)">− − −</text>`;
        s+=[[70,40],[100,60],[130,36],[300,40],[330,64],[360,38],[390,62],[80,78],[310,84]].map(p=>NA(p[0],p[1])).join("")+[[140,72],[372,86]].map(p=>KK(p[0],p[1])).join("");
        s+=[[70,196],[100,214],[130,192],[300,220],[330,200],[360,226],[390,204],[86,236]].map(p=>KK(p[0],p[1])).join("");
        const extraNa=[[136,236],[110,190],[60,220],[150,210],[44,192],[120,246]];
        s+=extraNa.slice(0,S.naIn).map(p=>NA(p[0],p[1])).join("");
        const dir=(i===2||i===3)?"up":"down";s+=shape(dir);
        if(i===0||i===1)s+=NA(210,126)+NA(203,142)+NA(217,142);
        if(i===2)s+=NA(196,66)+NA(210,52)+NA(224,66)+arr(210,92,210,76,"--ink",2,7);
        if(i===3||i===4)s+=dir==="up"?KK(204,124)+KK(216,124):KK(204,136)+KK(216,136);
        if(i===5)s+=KK(202,196)+KK(218,196)+arr(210,170,210,186,"--ink",2,7);
        if(i>=1&&i<=3)s+=`<circle cx="254" cy="140" r="9" ${st("--t-atp")}/><text x="254" y="144" text-anchor="middle" class="lbs" style="font-size:13px;fill:var(--paper)">P</text>`;
        if(i===1)s+=`<text x="268" y="186" ${TW}>ATP → ADP + P</text>`+star(252,182,8,"--t-atp");
        if(S.dig)s+=`<path d="M176 92 L244 168 M244 92 L176 168" fill="none" style="stroke:var(--bad)" stroke-width="5" stroke-linecap="round"/>`;
        s+=NA(282,252)+`<text x="292" y="256" ${TW}>Na⁺</text>`+KK(342,251)+`<text x="352" y="256" ${TW}>K⁺</text>`;
        svg.innerHTML=s;
        $("#k5-pu-s").textContent=i<0?"start":(i+1)+" av 6";$("#k5-pu-na").textContent=S.na;$("#k5-pu-k").textContent=S.k;$("#k5-pu-atp").textContent=S.atp;
        const vd=$("#k5-pu-vd");let w;
        if(S.dig){vd.className="verdict b";vd.textContent="Pumpen är hämmad";w="Digoxin hämmar natrium-kaliumpumpen. Då pumpas inget Na⁺ ut, och natriumhalten inne i cellen ökar. Na⁺/Ca²⁺-pumpen kan då inte fungera, och hjärtmuskelns kontraktionskraft ökar. {{lek:Transport bild 16}}"}
        else{const V=[["m","Pumpen väntar","Pumpen är öppen mot insidan, där det finns lite Na⁺ och mycket K⁺. Tryck på nästa steg."],
          ["m","Tre Na⁺ binder","Pumpen är öppen mot insidan. Tre Na⁺ från cytoplasman binder till pumpen."],
          ["m","ATP betalar","ATP hydrolyseras till ADP. Energin frigörs, och en fosfatgrupp binds till pumpen. {{lek:Transport bild 19}}"],
          ["g","Tre Na⁺ ut","Pumpen ändrar form och öppnar sig mot utsidan. De tre Na⁺ släpps ut, där det redan finns mycket Na⁺. Det är transport mot gradienten, och därför krävs energin från ATP. {{src:s. 35}}"],
          ["m","Två K⁺ binder","Två K⁺ från utsidan binder till pumpen."],
          ["m","Tillbaka","Fosfatgruppen släpper, och pumpen återtar sin form, öppen mot insidan. {{extra}}"],
          ["g","Två K⁺ in","De två K⁺ släpps in i cytoplasman, där det redan finns mycket K⁺. Ett varv är klart: 3 Na⁺ ut, 2 K⁺ in och 1 ATP. Varje varv flyttar en positiv laddning mer ut än in. {{lek:Transport bild 19}}"]][i+1];
          vd.className="verdict "+V[0];vd.textContent=V[1];w=V[2]}
        $("#k5-pu-why").innerHTML=api.tpl(w)}
      $("#k5-pu-n").addEventListener("click",()=>{if(S.dig){if(S.naIn<6)S.naIn++;draw();return}
        S.i=S.i>=5?0:S.i+1;if(S.i===1)S.atp++;if(S.i===2)S.na+=3;if(S.i===5)S.k+=2;draw()});
      $("#k5-pu-r").addEventListener("click",()=>{Object.assign(S,{i:-1,na:0,k:0,atp:0,naIn:2});draw()});
      segWire(el,"k5-pu-d",v=>{S.dig=v==="ja";if(!S.dig)S.naIn=2;draw()});
      draw();
    },
    /* ---------- LDL-receptorns gen ---------- */
    k5Ldl(el,api){
      el.className="wid";
      el.innerHTML=`<div class="wh"><b>Felaktig gen för LDL-receptorn</b><span class="mono">Simulering</span></div>
      ${segHTML("k5-ld-s","Felaktig gen",[["0","Ingen"],["1","På en kromosom"],["2","På båda homologa kromosomerna"]],"0")}
      <div style="height:14px;border-radius:99px;background:var(--line);overflow:hidden;margin:10px 0"><i id="k5-ld-bar" style="display:block;height:100%;width:20%;background:var(--good)"></i></div>
      <dl class="readout"><dt>LDL i blodet</dt><dd id="k5-ld-h"></dd><dt>Följd</dt><dd id="k5-ld-f"></dd></dl>
      <p class="verdict" id="k5-ld-vd"></p><p id="k5-ld-why"></p>`;
      const $=s=>el.querySelector(s);
      const G=[["20%","--good","g","normal","receptorerna tar upp LDL","Inga felaktiga gener","Receptorerna i cellmembranet binder LDL, och partiklarna tas upp i cellerna via endocytos. Därför hålls LDL-halten i blodet nere."],
        ["62%","--mid","m","mycket hög","kraftigt ökad risk för hjärtinfarkt och stroke i vuxen ålder","En felaktig gen","Genen är felaktig på den ena kromosomen. Cellerna tar upp mindre LDL, och därför blir halten i blodet mycket hög. Mer än en person av tusen bär genen. Ett enkelt gentest visar det, och risken kan minskas radikalt med kolesterolfattig mat, regelbunden motion och medicinering. {{src:s. 36}}"],
        ["96%","--bad","b","extremt hög","man avlider ofta i hjärt- och kärlsjukdomar tidigt i livet","Två felaktiga gener","Genen är felaktig på båda de homologa kromosomerna. Halterna blir extremt höga. Eftersom en felaktig gen ger höga halter och två ger ännu högre, är sjukdomen kodominant. {{src:s. 36}}"]];
      function show(v){const g=G[+v],b=$("#k5-ld-bar");b.style.width=g[0];b.style.background="var("+g[1]+")";
        $("#k5-ld-h").textContent=g[3];$("#k5-ld-f").textContent=g[4];const vd=$("#k5-ld-vd");vd.className="verdict "+g[2];vd.textContent=g[5];$("#k5-ld-why").innerHTML=api.tpl(g[6])}
      segWire(el,"k5-ld-s",show);show("0");
    },
    /* ---------- vilken väg tar ämnet? ---------- */
    k5Vag(el,api){
      el.className="wid";
      const R=[["diff","Diffusion genom fosfolipidskiktet"],["under","Underlättad diffusion"],["osmos","Osmos"],["pump","ATP-driven pump"],["kopp","Kopplad transport"],["endo","Endocytos"],["exo","Exocytos"]];
      const V=[["Syre tar sig in i en cell som förbrukar syre","diff","Syre är litet, oladdat och hydrofobt och har fri passage. Halten är högre utanför, och därför diffunderar det in."],
        ["Koldioxid lämnar cellen","diff","Koldioxid har fri passage, och halten är högre inuti cellen. Därför diffunderar den ut."],
        ["Ett steroidhormon tar sig in i cellen","diff","Steroidhormoner är hydrofoba (fettlösliga) och går rakt genom fosfolipidskiktet, eftersom skiktet är fettlösligt."],
        ["Vatten strömmar in i en röd blodkropp i destillerat vatten","osmos","Vattnets diffusion över ett semipermeabelt membran, främst genom aquaporiner."],
        ["Glukos tar sig in i en cell där det finns mindre glukos än utanför","under","Glukos följer sin gradient men är stort och polärt. Därför hjälper ett bärarprotein, utan energi."],
        ["Kaliumjoner strömmar ut genom en öppen kanal, nedför sin gradient","under","Joner kan inte passera fosfolipidskiktet. En jonkanal hjälper dem, och de följer sin gradient."],
        ["Natrium och kalium flyttas mot sina gradienter för att hålla jonbalansen","pump","Natrium-kaliumpumpen drivs av ATP och använder ungefär 40 % av cellens ATP."],
        ["Glukos tas upp i en tarmcell tillsammans med två natriumjoner","kopp","Natriumjonerna diffunderar in med sin gradient och tar med sig glukos mot dess gradient. ATP behövs indirekt."],
        ["En vit blodkropp slukar en bakterie","endo","Fagocytos (cellätande) är en sorts endocytos, med receptorer och membranarmar."],
        ["LDL-partiklar tas upp från blodet","endo","LDL binder till LDL-receptorer och tas upp via endocytos."],
        ["Vattenlösliga makromolekyler binder till receptorer och tas in","endo","Pinocytos (celldrickande). Membranet buktar in och snörs av."],
        ["Insulin släpps ut från celler i bukspottkörteln","exo","Insulinet lagras i sekretoriska blåsor och släpps ut med exocytos vid behov."],
        ["Neurotransmittorer släpps ut från en nervcell","exo","De lagras i synapsblåsor och släpps ut med exocytos."],
        ["Glykoproteiner förs ut för att bygga upp ECM","exo","Golgiblåsor smälter ihop med cellmembranet och släpper ut innehållet."],
        ["Na⁺ strömmar in i en hjärtmuskelcell i aktionspotentialens fas 0","under","Natriumjonerna går med sin gradient genom jonkanaler, och därför krävs ingen energi. {{lek:Transport bild 20}}"]];
      const NM={};R.forEach(r=>{NM[r[0]]=r[1]});
      let order=[],k=0,ok=0,tot=0,answered=false;
      function shuffle(){order=V.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}k=0}
      el.innerHTML=`<div class="wh"><b>Vilken väg tar ämnet?</b><span class="mono">Övning</span></div>
      <p class="small">Läs situationen och välj transportsätt.</p>
      <p id="k5-vg-q" style="font-weight:700;font-size:1.05rem"></p>
      <div class="row" id="k5-vg-b">${R.map(r=>`<button class="btn ghost sm" type="button" data-v="${r[0]}">${r[1]}</button>`).join("")}</div>
      <p class="verdict" id="k5-vg-vd"></p><p id="k5-vg-why"></p>
      <div class="row"><button class="btn sm" type="button" id="k5-vg-n">Nästa ämne</button><span class="small" id="k5-vg-sc"></span></div>`;
      const $=s=>el.querySelector(s);
      function show(){const v=V[order[k]];answered=false;$("#k5-vg-q").textContent=v[0];$("#k5-vg-vd").textContent="";$("#k5-vg-vd").className="verdict";$("#k5-vg-why").textContent="";
        el.querySelectorAll("#k5-vg-b button").forEach(b=>b.setAttribute("aria-pressed","false"));$("#k5-vg-sc").textContent=tot?ok+" rätt av "+tot:""}
      el.querySelectorAll("#k5-vg-b button").forEach(b=>b.addEventListener("click",()=>{const v=V[order[k]],good=b.dataset.v===v[1];
        el.querySelectorAll("#k5-vg-b button").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));
        if(!answered){answered=true;tot++;if(good)ok++}
        const vd=$("#k5-vg-vd");vd.className="verdict "+(good?"g":"b");vd.textContent=good?"Rätt: "+NM[v[1]]:"Inte riktigt. Rätt svar: "+NM[v[1]];
        $("#k5-vg-why").innerHTML=api.tpl(v[2]);$("#k5-vg-sc").textContent=ok+" rätt av "+tot}));
      $("#k5-vg-n").addEventListener("click",()=>{k++;if(k>=order.length)shuffle();show()});
      shuffle();show();
    }
  }
});
})();
