// The gang, redrawn as go kart racers. Side view, facing right.
// Look: thick ink outlines, color printed slightly off register, stipple shading on the shadow side.
(function(){
const INK='#211C18',CREAM='#F6ECD6',TONGUE='#E06A76';
const W=(d,w=2.6)=>`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
// printed shape: fill nudged off register, stipple shading in the lower left crescent, ink line on top
function shape(id,d,fill,shade=true){
  return `<path d="${d}" fill="${fill}" transform="translate(1.3 .9)"/>`+
   (shade?`<path d="${d}" fill="url(#st)" mask="url(#cr-${id})" opacity=".85"/>`:'')+
   `<path d="${d}" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>`}
const crescent=(id,d,dx=6,dy=-6)=>`<mask id="cr-${id}" maskUnits="userSpaceOnUse" x="-20" y="-40" width="200" height="180"><path d="${d}" fill="#fff"/><path d="${d}" fill="#000" transform="translate(${dx} ${dy})"/></mask>`;
const glove=(x,y,r=6)=>`<g transform="translate(${x} ${y})"><path d="M${-r*.95} ${r*.55} q${r*.95} ${r*.75} ${r*1.9} 0 l0 ${r*.5} q${-r*.95} ${r*.7} ${-r*1.9} 0z" fill="${CREAM}" stroke="${INK}" stroke-width="1.8"/><path d="M${-r} 0 a${r} ${r*.95} 0 1 1 ${r*2} 0 a${r} ${r*.95} 0 1 1 ${-r*2} 0" fill="${CREAM}" stroke="${INK}" stroke-width="2.3"/><path d="M${-r*.4} ${-r*.85} v${r*.75} M${r*.2} ${-r*.92} v${r*.8} M${r*.7} ${-r*.6} v${r*.55}" stroke="${INK}" stroke-width="1.1" stroke-linecap="round"/><path d="M${-r*.8} ${-r*.2} q${-r*.5} ${r*.4} 0 ${r*.7}" fill="none" stroke="${INK}" stroke-width="1.1"/></g>`;
const hose=(d,c,w=5.2)=>`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w+4.2}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const drops=(pts)=>pts.map(([x,y,r])=>`<path d="M${x} ${y-r*1.6} q${r} ${r*1.3} 0 ${r*2.4} q${-r} ${-r*1.1} 0 ${-r*2.4}z" fill="#8CC9D9" stroke="${INK}" stroke-width="1.1"/>`).join('');
// angry eye: white oval with the brow slicing the top off
function eye(cx,cy,rx,ry,px,py,pr,browTilt){
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${CREAM}" stroke="${INK}" stroke-width="2"/><ellipse cx="${px}" cy="${py}" rx="${pr*.85}" ry="${pr}" fill="${INK}"/><circle cx="${px+pr*.35}" cy="${py-pr*.4}" r="${pr*.28}" fill="${CREAM}"/>`+
   `<path d="M${cx-rx-2} ${cy-ry*.35+browTilt} L${cx+rx+2} ${cy-ry*.35-browTilt} L${cx+rx+2} ${cy-ry-4} L${cx-rx-2} ${cy-ry-4}Z" fill="var(--skin)"/>`}
const brow=(x1,y1,x2,y2,w=4.4)=>`<path d="M${x1} ${y1} Q${(x1+x2)/2} ${(y1+y2)/2-1.5} ${x2} ${y2}" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;

// ---------- karts ----------
function kart(col,num){
  const chassis='M18 93 L28 81 H108 L134 85 Q148 87 149 95 L145 101 H24Z';
  return {
   back:`<g class="wheel" style="transform-origin:42px 101px"><circle cx="42" cy="101" r="13" fill="${INK}"/><circle cx="42" cy="101" r="6" fill="#8C8273" stroke="${INK}" stroke-width="1.5"/><path d="M42 89 v24 M30 101 h24" stroke="#3A332C" stroke-width="2"/></g>`,
   body:`<path d="${chassis}" fill="${col}" transform="translate(1.3 .9)"/><path d="${chassis}" fill="url(#st)" opacity=".5"/><path d="${chassis}" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>`+
     `<path d="M30 86 H104" stroke="#00000033" stroke-width="2"/><circle cx="64" cy="91" r="7.5" fill="${CREAM}" stroke="${INK}" stroke-width="2.2"/><text x="64" y="94.5" text-anchor="middle" font-family="Bowlby One,Impact,sans-serif" font-size="10" fill="${INK}">${num}</text>`+
     `<path d="M12 95 h-6 M12 99 h-8" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M134 86 L150 90" stroke="${INK}" stroke-width="2"/>`,
   front:`<g class="wheel" style="transform-origin:128px 104px"><circle cx="128" cy="104" r="9.5" fill="${INK}"/><circle cx="128" cy="104" r="4.2" fill="#8C8273" stroke="${INK}" stroke-width="1.4"/><path d="M128 95 v18 M119 104 h18" stroke="#3A332C" stroke-width="1.8"/></g>`,
   wheel:`<path d="M124 85 L114 72" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/><ellipse cx="113" cy="70" rx="3.4" ry="9" transform="rotate(25 113 70)" fill="none" stroke="${INK}" stroke-width="3.6"/>`,
   dust:`<g class="dust"><circle cx="18" cy="104" r="6" fill="#E3CDA6" stroke="${INK}" stroke-width="1.6"/><circle cx="8" cy="98" r="4.5" fill="#E3CDA6" stroke="${INK}" stroke-width="1.4"/><circle cx="2" cy="106" r="3.5" fill="#E3CDA6" stroke="${INK}" stroke-width="1.2"/></g>`
  }}

// ---------- drivers ----------
const GX=103.5,GY=79; // where gloves grip the wheel (driver space)
const D={
 thumbs:{name:'Thumbs',skin:'#E2858C',kart:'#B23F2C',num:1,lift:15,draw(){
  const B='M52 64 Q50 36 78 36 Q106 37 105 64 Q104 92 78 92 Q53 92 52 64Z';
  const H='M47 63 Q43 27 78 25 Q109 26 108 54 Q99 51 90 53 Q70 59 56 69 Q48 71 47 63Z';
  return glove(GX+4,GY+15-4,6)+crescent('thumbs',B,8,-8)+shape('thumbs',B,this.skin)+
   `<clipPath id="hc-thumbs"><path d="${H}"/></clipPath><path d="${H}" fill="#A8392A" transform="translate(1.3 .9)"/><g clip-path="url(#hc-thumbs)"><path d="M104 52 Q98 22 72 23 Q55 27 47 48" fill="none" stroke="${CREAM}" stroke-width="11" opacity=".92"/><path d="M86 30 l5 3 M98 38 l4 -2 M62 34 l-3 5 M102 47 l4 1 M72 44 l3 2 M90 44 l2 3" stroke="${CREAM}" stroke-width="2.6" stroke-linecap="round" opacity=".7"/><path d="${H}" fill="url(#st)" opacity=".6"/></g>`+
   W(H,2.8)+`<path d="M49 66 Q72 51 108 52" fill="none" stroke="#4A2A1E" stroke-width="6.5" stroke-linecap="round"/>`+W('M48 62.5 Q72 47.5 108 48.5 M50 69.5 Q73 55 108 55.5',1.8)+
   [[55,64.5],[66,57.5],[79,53],[94,51.5],[104,52]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.8" fill="#D9CDB8" stroke="${INK}" stroke-width="1"/>`).join('')+
   eye(80,69,7.4,7.6,83.5,70.5,3.9,2.6)+eye(97,67,6.6,7.2,100,68.6,3.6,-2.6)+brow(70,61,88,67.5,5)+brow(91,66,106,58.5,5)+
   `<path d="M68 79 Q84 101 108 75 Q93 85 68 79Z" fill="${INK}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M70 80 Q87 86 106 76.5 L104 81 Q87 89 72 84Z" fill="${CREAM}" stroke="${INK}" stroke-width="1.2"/><path d="M80 84 v3.5 M88 84 v3.5 M96 82 v3.5" stroke="${INK}" stroke-width="1"/>`+
   `<path d="M100 80 Q112 82 119 74 Q124 86 112 92 Q103 94 99 86Z" fill="${TONGUE}" stroke="${INK}" stroke-width="2.3" stroke-linejoin="round"/><path d="M104 84 Q111 85 116 80" fill="none" stroke="${INK}" stroke-width="1.3"/>`+
   drops([[114,42,2.2],[44,52,2],[112,62,1.8]])},
  arms(){return hose(`M100 86 Q104 92 ${GX} ${GY+15}`,this.skin)+glove(GX,GY+15,6.4)}},
 pops:{name:'Pops Pointer',skin:'#509C94',kart:'#6E8B4A',num:2,draw(){
  const B='M60 96 Q56 62 62 38 Q66 17 83 18 Q97 21 96 42 Q94 64 88 96Z';
  return `<g class="shake" style="transform-origin:64px 60px">${hose('M64 60 Q48 46 50 24',this.skin)}${glove(50,20,7.4)}</g>`+crescent('pops',B,7,-7)+shape('pops',B,this.skin)+
   `<path d="M64 27 q-8 -1 -13 -6 M63 33 q-10 0 -15 -3 M63 39 q-8 2 -13 1 M68 21 q-3 -5 -9 -7 M73 19 q0 -4 3 -6" stroke="${INK}" stroke-width="4.6" stroke-linecap="round" fill="none"/><path d="M64 27 q-8 -1 -13 -6 M63 33 q-10 0 -15 -3 M63 39 q-8 2 -13 1 M68 21 q-3 -5 -9 -7 M73 19 q0 -4 3 -6" stroke="#F1E9DA" stroke-width="2.2" stroke-linecap="round" fill="none"/>`+
   `<circle cx="79" cy="37" r="7" fill="${CREAM}" stroke="${INK}" stroke-width="1.6"/><circle cx="95" cy="36" r="6.5" fill="${CREAM}" stroke="${INK}" stroke-width="1.6"/><path d="M87 35.5 h1.6 M71 36 l-7 -2" stroke="${INK}" stroke-width="1.8"/><circle cx="82" cy="37.5" r="3.2" fill="${INK}"/><circle cx="98.5" cy="36.5" r="3" fill="${INK}"/>`+
   `<path d="M70 31 q7 -6 16 3 q-8 -3 -16 -3z M88 33 q7 -8 15 -3 q-7 -1 -15 3z" fill="#F1E9DA" stroke="${INK}" stroke-width="1.8"/>`+
   `<path d="M86 64 Q95 84 108 63 Q96 57 86 64Z" fill="${INK}"/><path d="M90 72 q5 6 11 -1 q-5 -4 -11 1z" fill="${TONGUE}"/>`+
   `<path d="M66 54 q1 -9 13 -9 q6 -5 13 -2 q9 -2 15 3 q6 2 9 9 q-7 -1 -10 4 q-4 -5 -9 -1 q-5 -5 -10 0 q-6 -4 -10 1 q-5 -5 -11 -5z" fill="#F1E9DA" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M76 50 l2 5 M85 48 l1 6 M94 48 l2 5 M103 50 l2 4 M110 54 l2 3" stroke="${INK}" stroke-width="1.1"/>`+
   `<path d="M100 44 q8 0 8 -5 q-1 -5 -8 -4z" fill="${this.skin}" stroke="${INK}" stroke-width="2"/>`+
   drops([[112,26,2.2],[106,14,1.8],[56,46,1.8]])},
  arms(){return hose(`M86 76 Q98 82 ${GX} ${GY}`,this.skin)+glove(GX,GY,6.4)}},
 birdie:{name:'Birdie',skin:'#D9A63A',kart:'#3F6E9A',num:3,draw(){
  const B='M62 96 Q57 58 62 26 Q66 8 83 9 Q97 11 96 30 Q94 60 90 96Z';
  return `${hose('M64 66 Q52 76 44 88',this.skin)}${glove(43,91,6.4)}`+crescent('birdie',B,7,-7)+shape('birdie',B,this.skin)+
   `<path d="M71 12 q-4 -7 -11 -7 M76 10 q-1 -7 3 -10 M81 10 q4 -6 9 -6 M72 12 q-7 -2 -10 2" stroke="${INK}" stroke-width="1.8" stroke-linecap="round" fill="none"/>`+
   eye(79,28,7.2,7.6,83.5,29.6,3.7,2)+eye(95,27,6.4,7,99,28.6,3.4,-2)+brow(70,22,87,27.5,5)+brow(90,26,104,19,5)+
   `<path d="M70 42 Q89 58 108 37 Q92 47 70 42Z" fill="${CREAM}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M78 45 v3 M86 46 v3 M95 44.5 v3 M102 41 v3" stroke="${INK}" stroke-width="1"/>`+
   `<path d="M105 40 L124 35" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path d="M105 40 L124 35" stroke="#E9D3A2" stroke-width="1.7" stroke-linecap="round"/>`+
   drops([[110,16,2],[56,20,1.8]])},
  arms(){return hose(`M88 72 Q98 78 ${GX} ${GY}`,this.skin)+glove(GX,GY,6.4)}},
 sir:{name:'Sir Ringsley',skin:'#A58CC5',kart:'#7D5BA6',num:4,lift:3,draw(){
  const B='M60 96 Q56 62 62 38 Q68 18 82 21 Q95 26 93 50 Q90 72 88 96Z';
  const N='M86 31 Q106 25 122 27 Q128 30 124 34 Q106 40 89 48Z';
  return glove(GX+4,GY+3-5,6)+crescent('sir',B,7,-7)+shape('sir',B,this.skin)+
   `<path d="${N}" fill="${this.skin}" transform="translate(1.3 .9)"/><path d="M90 42 Q108 34 124 29 Q110 39 90 47Z" fill="url(#st)" opacity=".8"/>`+W(N,2.6)+
   `<circle cx="77" cy="33" r="8.6" fill="${CREAM}" stroke="${INK}" stroke-width="2"/><path d="M70 29 l3 1.5 M70 37 l3 -1 M84 37 l-2 -1.5" stroke="#D2565C" stroke-width=".9"/><circle cx="79.5" cy="33" r="2.6" fill="${INK}"/>`+
   `<circle cx="77" cy="33" r="10.6" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="77" cy="33" r="10.6" fill="none" stroke="#D8AA3B" stroke-width="2.8"/><path d="M86 40 q9 14 1 32" fill="none" stroke="#D8AA3B" stroke-width="2" stroke-dasharray="2.2 1.6"/>`+
   `<path d="M71 19 q5 -6 12 -2" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`+
   `<path d="M83 52 Q86 74 102 56 Q92 49 83 52Z" fill="${INK}"/><path d="M87 62 q5 4 10 -4" stroke="${TONGUE}" stroke-width="3" stroke-linecap="round"/><path d="M85 53 h10" stroke="${CREAM}" stroke-width="2"/>`+
   `<path d="M58 76 Q74 81 92 76 L92 84 Q74 89 58 84Z" fill="#7B4A2B" stroke="${INK}" stroke-width="2"/><circle cx="81" cy="80" r="6" fill="none" stroke="${INK}" stroke-width="5.2"/><circle cx="81" cy="80" r="6" fill="none" stroke="#D8AA3B" stroke-width="3"/>`+
   drops([[60,28,1.8],[66,16,1.6]])},
  arms(){return `<g class="tremble">${hose(`M90 66 Q100 72 ${GX} ${GY+3}`,this.skin)}${glove(GX,GY+3,6.4)}</g>`}},
 lil:{name:'Lil Pink',skin:'#EE9A7C',kart:'#C8553D',num:5,lift:4,draw(){
  const B='M66 94 Q60 68 70 56 Q84 44 98 54 Q108 66 102 94Z';
  const C='M64 62 Q61 40 84 37 Q104 37 106 56 Q94 51 84 53 Q73 55 64 62Z';
  return `<g class="cheer" style="transform-origin:70px 74px">${hose('M70 74 Q56 64 56 46',this.skin)}${glove(56,41,6.8)}</g><g class="cheer2" style="transform-origin:98px 70px">${hose('M98 70 Q114 60 116 42',this.skin)}${glove(116,37,6.8)}</g>`+crescent('lil',B,6,-6)+shape('lil',B,this.skin)+
   `<path d="${C}" fill="#3F6E9A" transform="translate(1.2 .8)"/><path d="${C}" fill="url(#st)" opacity=".5"/>`+W(C)+
   `<path d="M66 58 L46 62 Q43 56 50 53 L66 51Z" fill="#3F6E9A" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M88 38 q2 7 9 7" stroke="${INK}" stroke-width="1.5" fill="none"/>`+
   eye(83,65,6.2,6.6,86,66.4,3.3,2)+eye(97,64,5.6,6.2,100,65.4,3.1,-2)+brow(75,58,90,63,4.4)+brow(93,62,104,56,4.4)+
   `<path d="M74 72 Q89 96 106 70 Q90 76 74 72Z" fill="${INK}"/><path d="M76 73 Q89 77 104 71 l-1.5 3 Q89 80 77 76.5Z" fill="${CREAM}"/><path d="M83 82 Q90 92 98 82 Q90 78 83 82Z" fill="${TONGUE}"/>`+
   drops([[112,46,2],[60,44,1.8]])},
  arms(){return ''}}
};

const order=['thumbs','pops','birdie','sir','lil'];
function racer(id,state='idle'){const d=D[id],k=kart(d.kart,d.num);
  return `<svg class="racer ${state}" viewBox="0 -30 160 150" role="img" aria-label="${d.name}" style="--skin:${d.skin}">`+
   `<defs><pattern id="st" width="2.6" height="2.6" patternUnits="userSpaceOnUse"><circle cx="1.3" cy="1.3" r=".62" fill="${INK}"/></pattern></defs>`+
   `${k.dust}<g class="chassis">${k.back}<g transform="translate(78 96) scale(1.4) translate(-78 -96) translate(0 ${-(d.lift||0)})"><g class="driver">${d.draw()}</g></g>${k.body}${k.front}${k.wheel}<g transform="translate(78 96) scale(1.4) translate(-78 -96) translate(0 ${-(d.lift||0)})"><g class="driver">${d.arms()}</g></g></g>`+
   `<g class="lines"><path d="M2 70 h12 M0 78 h9 M4 62 h8" stroke="${INK}" stroke-width="2" stroke-linecap="round"/></g></svg>`}
window.GANG=Object.fromEntries(order.map(id=>[id,{name:D[id].name,color:D[id].skin,kart:D[id].kart}]));
window.racer=racer;window.GANG_ORDER=order;
})();
