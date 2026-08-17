(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const C = {
    axis:'#171717', label:'#171717', point:'#171717', grid:'#d9dde2',
    guide:'#666b70', blue:'#496f8a', rust:'#9a6754', green:'#617b6b', grey:'#727980'
  };
  const page = location.pathname.split('/').pop();
  const el=(n,a={},t)=>{const e=document.createElementNS(NS,n);Object.entries(a).forEach(([k,v])=>e.setAttribute(k,v));if(t!==undefined)e.textContent=t;return e;};
  const html=(tag,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;return e;};
  function placeAfterIntro(title,node){
    const h=[...document.querySelectorAll('.lesson-content h3')].find(x=>x.textContent.trim().startsWith(title));
    if(!h)return;
    let p=h.nextElementSibling, last=h;
    while(p && p.tagName!=='H3' && !p.classList.contains('lesson-navigation')){
      last=p;
      if(p.tagName==='P') break;
      p=p.nextElementSibling;
    }
    last.insertAdjacentElement('afterend',node);
  }
  function wrap(){const d=html('div','math-graph');d.style.maxWidth='720px';d.style.margin='28px auto';return d;}
  function plot({xmin,xmax,ymin,ymax,curves=[],guides=[],points=[],labels=[],equal=false}){
    const W=720,H=equal?720:480,m=58,pw=W-2*m,ph=H-2*m;
    const sx=pw/(xmax-xmin), sy=ph/(ymax-ymin), s=equal?Math.min(sx,sy):null;
    const X=x=>equal ? W/2 + (x-(xmin+xmax)/2)*s : m+(x-xmin)*sx;
    const Y=y=>equal ? H/2 - (y-(ymin+ymax)/2)*s : H-m-(y-ymin)*sy;
    const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':'Mathematical graph',style:'width:100%;height:auto;display:block'});
    const defs=el('defs'); const id='clip-'+Math.random().toString(36).slice(2); const clip=el('clipPath',{id}); clip.appendChild(el('rect',{x:m,y:m,width:pw,height:ph}));defs.appendChild(clip);svg.appendChild(defs);
    for(let x=Math.ceil(xmin);x<=Math.floor(xmax);x++) svg.appendChild(el('line',{x1:X(x),y1:m,x2:X(x),y2:H-m,stroke:C.grid,'stroke-width':.7}));
    for(let y=Math.ceil(ymin);y<=Math.floor(ymax);y++) svg.appendChild(el('line',{x1:m,y1:Y(y),x2:W-m,y2:Y(y),stroke:C.grid,'stroke-width':.7}));
    if(ymin<=0&&0<=ymax) svg.appendChild(el('line',{x1:m,y1:Y(0),x2:W-m,y2:Y(0),stroke:C.axis,'stroke-width':1.6}));
    if(xmin<=0&&0<=xmax) svg.appendChild(el('line',{x1:X(0),y1:m,x2:X(0),y2:H-m,stroke:C.axis,'stroke-width':1.6}));
    const g=el('g',{'clip-path':`url(#${id})`});
    curves.forEach((c,j)=>{let pts=[];const n=1000;for(let i=0;i<=n;i++){const x=c.a+(c.b-c.a)*i/n,y=c.f(x);if(Number.isFinite(y)&&y>ymin-2&&y<ymax+2)pts.push(`${X(x).toFixed(2)},${Y(y).toFixed(2)}`);}g.appendChild(el('polyline',{points:pts.join(' '),fill:'none',stroke:c.color||[C.blue,C.rust,C.green][j%3],'stroke-width':c.width||3}));});
    svg.appendChild(g);
    guides.forEach(q=>svg.appendChild(el('line',{x1:X(q.x1),y1:Y(q.y1),x2:X(q.x2),y2:Y(q.y2),stroke:q.color||C.guide,'stroke-width':q.width||1.5,'stroke-dasharray':q.dash===false?'':'7 6'})));
    points.forEach(p=>svg.appendChild(el('circle',{cx:X(p.x),cy:Y(p.y),r:p.r||5,fill:C.point})));
    labels.forEach(l=>svg.appendChild(el('text',{x:X(l.x)+(l.dx||0),y:Y(l.y)+(l.dy||0),fill:C.label,'font-size':l.size||15},l.t)));
    const d=wrap();d.appendChild(svg);return d;
  }
  function unitCircle(){
    const d=wrap(),svg=el('svg',{viewBox:'0 0 620 430',role:'img','aria-label':'Unit circle showing cosine and sine coordinates',style:'width:100%;height:auto'});
    const cx=300,cy=215,r=145,th=Math.PI/4,px=cx+r*Math.cos(th),py=cy-r*Math.sin(th);
    svg.appendChild(el('line',{x1:80,y1:cy,x2:540,y2:cy,stroke:C.axis,'stroke-width':1.6}));svg.appendChild(el('line',{x1:cx,y1:385,x2:cx,y2:45,stroke:C.axis,'stroke-width':1.6}));
    svg.appendChild(el('circle',{cx,cy,r,fill:'none',stroke:C.blue,'stroke-width':3}));
    svg.appendChild(el('line',{x1:cx,y1:cy,x2:px,y2:py,stroke:C.rust,'stroke-width':2.5}));
    svg.appendChild(el('line',{x1:px,y1:py,x2:px,y2:cy,stroke:C.guide,'stroke-dasharray':'6 5'}));svg.appendChild(el('line',{x1:px,y1:py,x2:cx,y2:py,stroke:C.guide,'stroke-dasharray':'6 5'}));
    svg.appendChild(el('circle',{cx:px,cy:py,r:5,fill:C.point}));
    [['cos θ',px-10,cy+24],['sin θ',cx-62,py-8],['(cos θ, sin θ)',px+10,py-12],['θ',cx+36,cy-18]].forEach(a=>svg.appendChild(el('text',{x:a[1],y:a[2],fill:C.label,'font-size':15},a[0])));
    d.appendChild(svg);return d;
  }
  const add=(title,node)=>placeAfterIntro(title,node);

  if(page==='function-concept.html'){
    add('6. Functions and graphs',plot({xmin:-3,xmax:3,ymin:-1,ymax:9,curves:[{a:-3,b:3,f:x=>x*x}],points:[{x:2,y:4}],labels:[{x:2,y:4,t:'(2,4)',dx:10,dy:-10},{x:2.2,y:7,t:'y=x²'}]}));
  }
  if(page==='function-notation.html'){
    add('7. Comparing two function values',plot({xmin:-1,xmax:6,ymin:-2,ymax:28,curves:[{a:-1,b:5.3,f:x=>x*x}],points:[{x:2,y:4},{x:5,y:25}],guides:[{x1:2,y1:4,x2:5,y2:25,dash:false,color:C.rust}],labels:[{x:2,y:4,t:'f(2)=4',dx:8,dy:-8},{x:5,y:25,t:'f(5)=25',dx:-82,dy:-10},{x:3.4,y:18,t:'change in output',dx:5,dy:-8}]}));
  }
  if(page==='domain-range.html'){
    add('3. Domain and range are different ideas',plot({xmin:-4,xmax:4,ymin:-1,ymax:9,curves:[{a:-3,b:3,f:x=>x*x}],labels:[{x:2.1,y:6.5,t:'range: y ≥ 0'},{x:-3.4,y:.7,t:'domain: all real x'}]}));
    add('4. Division can restrict the domain',plot({xmin:-5,xmax:5,ymin:-5,ymax:5,curves:[{a:-5,b:-.15,f:x=>1/x},{a:.15,b:5,f:x=>1/x}],guides:[{x1:0,y1:-5,x2:0,y2:5},{x1:-5,y1:0,x2:5,y2:0}],labels:[{x:.25,y:4.2,t:'x=0 excluded'},{x:2.1,y:1.1,t:'y=1/x'}]}));
    add('5. Square roots can restrict the domain',plot({xmin:-2,xmax:8,ymin:-1,ymax:4,curves:[{a:0,b:8,f:x=>Math.sqrt(x)}],points:[{x:0,y:0}],labels:[{x:3.7,y:2.5,t:'y=√x'},{x:.1,y:.4,t:'starts at x=0'}]}));
  }
  if(page==='linear-functions.html'){
    add('3. Constant rate of change',plot({xmin:-1,xmax:5,ymin:-2,ymax:11,curves:[{a:-1,b:5,f:x=>2*x+1}],points:[{x:1,y:3},{x:4,y:9}],guides:[{x1:1,y1:3,x2:4,y2:3},{x1:4,y1:3,x2:4,y2:9}],labels:[{x:2.2,y:2.5,t:'Δx=3'},{x:4.05,y:6.1,t:'Δy=6'},{x:2.8,y:8,t:'slope=2'}]}));
    add('5. Positive and negative gradient',plot({xmin:-4,xmax:4,ymin:-4,ymax:4,curves:[{a:-4,b:4,f:x=>.75*x+1},{a:-4,b:4,f:x=>-.75*x+1,color:C.rust},{a:-4,b:4,f:x=>-2,color:C.green}],labels:[{x:2.2,y:3,t:'m>0'},{x:2.2,y:-.8,t:'m<0'},{x:2.2,y:-1.7,t:'m=0'}]}));
  }
  if(page==='quadratic-functions.html'){
    add('2. Example',plot({xmin:-4,xmax:4,ymin:-1,ymax:10,curves:[{a:-3.2,b:3.2,f:x=>x*x}],guides:[{x1:0,y1:-1,x2:0,y2:10}],points:[{x:-2,y:4},{x:2,y:4}],labels:[{x:-2,y:4,t:'(−2,4)',dx:-70,dy:-8},{x:2,y:4,t:'(2,4)',dx:10,dy:-8},{x:.15,y:8,t:'axis of symmetry'}]}));
    add('5. Completing the square',plot({xmin:-2,xmax:6,ymin:-1,ymax:12,curves:[{a:-1,b:5,f:x=>(x-2)*(x-2)+3}],guides:[{x1:2,y1:-1,x2:2,y2:12}],points:[{x:2,y:3}],labels:[{x:2,y:3,t:'turning point (2,3)',dx:10,dy:-10},{x:3.2,y:7,t:'y=(x−2)²+3'}]}));
    add('8. Discriminant',plot({xmin:-4,xmax:4,ymin:-4,ymax:8,curves:[{a:-3,b:3,f:x=>x*x-1},{a:-3,b:3,f:x=>x*x,color:C.rust},{a:-3,b:3,f:x=>x*x+1,color:C.green}],labels:[{x:2.1,y:3.2,t:'two roots'},{x:2.1,y:4.4,t:'one repeated root'},{x:2.1,y:5.7,t:'no real roots'}]}));
  }
  if(page==='polynomial-functions.html'){
    add('5. Roots',plot({xmin:-1,xmax:6,ymin:-3,ymax:7,curves:[{a:-1,b:6,f:x=>(x-2)*(x-3)}],points:[{x:2,y:0},{x:3,y:0}],labels:[{x:2,y:0,t:'root 2',dx:-48,dy:24},{x:3,y:0,t:'root 3',dx:10,dy:24}]}));
    add('7. End behaviour',plot({xmin:-3,xmax:3,ymin:-10,ymax:10,curves:[{a:-2.15,b:2.15,f:x=>x*x*x},{a:-1.75,b:1.75,f:x=>x*x*x*x-4,color:C.rust}],labels:[{x:1.25,y:5,t:'odd degree'},{x:-1.7,y:5,t:'even degree'}]}));
  }
  if(page==='rational-functions.html'){
    add('3. Vertical asymptotes',plot({xmin:-5,xmax:5,ymin:-5,ymax:5,curves:[{a:-5,b:-.12,f:x=>1/x},{a:.12,b:5,f:x=>1/x}],guides:[{x1:0,y1:-5,x2:0,y2:5},{x1:-5,y1:0,x2:5,y2:0}],labels:[{x:.25,y:4.2,t:'vertical asymptote x=0'},{x:2.1,y:.9,t:'y=1/x'}]}));
    add('6. A removable discontinuity',plot({xmin:-2,xmax:4,ymin:-1,ymax:6,curves:[{a:-2,b:.98,f:x=>x+1},{a:1.02,b:4,f:x=>x+1}],points:[],labels:[{x:1,y:2,t:'open point at (1,2)',dx:12,dy:-12},{x:2.3,y:3.7,t:'y=x+1'}]}));
    const hole=document.querySelectorAll('.math-graph');
  }
  if(page==='exponential-functions.html'){
    add('3. Exponential decay',plot({xmin:-3,xmax:4,ymin:-1,ymax:9,curves:[{a:-3,b:3,f:x=>Math.pow(2,x)},{a:-3,b:3,f:x=>Math.pow(.5,x),color:C.rust}],points:[{x:0,y:1}],labels:[{x:1.6,y:4.5,t:'growth: 2ˣ'},{x:-2.6,y:4.5,t:'decay: (1/2)ˣ'},{x:.1,y:1,t:'(0,1)',dx:8,dy:-8}]}));
    add('10. Linear versus exponential',plot({xmin:0,xmax:6,ymin:0,ymax:35,curves:[{a:0,b:6,f:x=>4*x+1},{a:0,b:5,f:x=>Math.pow(2,x),color:C.rust}],labels:[{x:4.5,y:19,t:'linear'},{x:4.1,y:25,t:'exponential'}]}));
  }
  if(page==='logarithmic-functions.html'){
    add('3. Domain',plot({xmin:-1,xmax:8,ymin:-4,ymax:3,curves:[{a:.03,b:8,f:x=>Math.log(x)}],guides:[{x1:0,y1:-4,x2:0,y2:3}],points:[{x:1,y:0}],labels:[{x:.2,y:-3.2,t:'x=0 asymptote'},{x:3.5,y:1.8,t:'y=ln x'},{x:1,y:0,t:'(1,0)',dx:8,dy:-8}]}));
    add('9. Inverse identities',plot({xmin:-3,xmax:5,ymin:-3,ymax:5,curves:[{a:-3,b:Math.log(5),f:x=>Math.exp(x)},{a:.05,b:5,f:x=>Math.log(x),color:C.rust}],guides:[{x1:-3,y1:-3,x2:5,y2:5}],labels:[{x:.6,y:3.5,t:'eˣ'},{x:3.2,y:1.4,t:'ln x'},{x:3.4,y:4.1,t:'y=x'}]}));
  }
  if(page==='trigonometric-functions.html'){
    add('2. The unit circle',unitCircle());
    add('4. Periodic behaviour',plot({xmin:-6.5,xmax:6.5,ymin:-1.5,ymax:1.5,curves:[{a:-6.5,b:6.5,f:x=>Math.sin(x)},{a:-6.5,b:6.5,f:x=>Math.cos(x),color:C.rust}],labels:[{x:4.4,y:-.7,t:'sin x'},{x:4.4,y:.7,t:'cos x'}]}));
    add('6. Tangent',plot({xmin:-4.5,xmax:4.5,ymin:-4,ymax:4,curves:[{a:-4.5,b:-Math.PI/2-.04,f:x=>Math.tan(x)},{a:-Math.PI/2+.04,b:Math.PI/2-.04,f:x=>Math.tan(x)},{a:Math.PI/2+.04,b:4.5,f:x=>Math.tan(x)}],guides:[{x1:-Math.PI/2,y1:-4,x2:-Math.PI/2,y2:4},{x1:Math.PI/2,y1:-4,x2:Math.PI/2,y2:4}],labels:[{x:-1.4,y:3.3,t:'−π/2'},{x:1.7,y:3.3,t:'π/2'},{x:.35,y:2.2,t:'tan x'}]}));
    add('8. Transforming trigonometric functions',plot({xmin:-6.3,xmax:6.3,ymin:-2.5,ymax:2.5,curves:[{a:-6.3,b:6.3,f:x=>Math.sin(x)},{a:-6.3,b:6.3,f:x=>2*Math.sin(2*x),color:C.rust}],labels:[{x:4.3,y:-.7,t:'sin x'},{x:3.1,y:2.1,t:'2 sin(2x)'}]}));
  }
  if(page==='composite-functions.html'){
    add('2. The order matters',plot({xmin:-5,xmax:3,ymin:-2,ymax:18,curves:[{a:-5,b:2,f:x=>(x+2)*(x+2)},{a:-4,b:3,f:x=>x*x+2,color:C.rust}],labels:[{x:-4.4,y:4,t:'f(g(x))=(x+2)²'},{x:1.1,y:7,t:'g(f(x))=x²+2'}]}));
    add('6. Domain of a composite function',plot({xmin:-1,xmax:8,ymin:-1,ymax:4,curves:[{a:1,b:8,f:x=>Math.sqrt(x-1)}],points:[{x:1,y:0}],labels:[{x:1.1,y:.35,t:'domain starts at x=1'},{x:4.5,y:2.4,t:'√(x−1)'}]}));
  }
  if(page==='transformations.html'){
    add('1. Vertical translation',plot({xmin:-4,xmax:4,ymin:-1,ymax:10,curves:[{a:-3,b:3,f:x=>x*x},{a:-2.6,b:2.6,f:x=>x*x+3,color:C.rust}],points:[{x:0,y:0},{x:0,y:3}],labels:[{x:1.8,y:3.5,t:'y=x²'},{x:1.8,y:6.5,t:'y=x²+3'}]}));
    add('2. Horizontal translation',plot({xmin:-3,xmax:7,ymin:-1,ymax:10,curves:[{a:-3,b:3,f:x=>x*x},{a:-1,b:5,f:x=>(x-2)*(x-2),color:C.rust}],points:[{x:0,y:0},{x:2,y:0}],labels:[{x:-2.4,y:5.5,t:'y=x²'},{x:3.2,y:2.5,t:'y=(x−2)²'}]}));
    add('4. Vertical reflection',plot({xmin:-4,xmax:4,ymin:-9,ymax:9,curves:[{a:-3,b:3,f:x=>x*x},{a:-3,b:3,f:x=>-x*x,color:C.rust}],labels:[{x:2,y:5,t:'x²'},{x:2,y:-4,t:'−x²'}]}));
    add('6. Horizontal scaling',plot({xmin:-6.3,xmax:6.3,ymin:-1.5,ymax:1.5,curves:[{a:-6.3,b:6.3,f:x=>Math.sin(x)},{a:-6.3,b:6.3,f:x=>Math.sin(2*x),color:C.rust}],labels:[{x:4.3,y:-.75,t:'sin x'},{x:3.2,y:.95,t:'sin(2x)'}]}));
  }
})();