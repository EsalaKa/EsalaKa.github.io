(() => {
  const NS='http://www.w3.org/2000/svg';
  const C={axis:'#171717',label:'#171717',point:'#171717',grid:'#d9dde2',guide:'#666b70',blue:'#496f8a',rust:'#9a6754',green:'#617b6b'};
  const page=location.pathname.split('/').pop();
  const el=(n,a={},t)=>{const e=document.createElementNS(NS,n);for(const[k,v]of Object.entries(a))e.setAttribute(k,v);if(t!==undefined)e.textContent=t;return e;};
  const wrap=()=>{const d=document.createElement('div');d.className='math-graph';return d;};

  function plot({xmin,xmax,ymin,ymax,curves=[],guides=[],points=[],openPoints=[],labels=[]}){
    const W=720,H=480,m=58,pw=W-2*m,ph=H-2*m;
    const X=x=>m+(x-xmin)*pw/(xmax-xmin);
    const Y=y=>H-m-(y-ymin)*ph/(ymax-ymin);
    const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':'Mathematical graph',style:'width:100%;height:auto;display:block'});
    const defs=el('defs'),cid='clip-'+Math.random().toString(36).slice(2),clip=el('clipPath',{id:cid});
    clip.appendChild(el('rect',{x:m,y:m,width:pw,height:ph}));defs.appendChild(clip);svg.appendChild(defs);
    for(let x=Math.ceil(xmin);x<=Math.floor(xmax);x++)svg.appendChild(el('line',{x1:X(x),y1:m,x2:X(x),y2:H-m,stroke:C.grid,'stroke-width':.7}));
    for(let y=Math.ceil(ymin);y<=Math.floor(ymax);y++)svg.appendChild(el('line',{x1:m,y1:Y(y),x2:W-m,y2:Y(y),stroke:C.grid,'stroke-width':.7}));
    if(ymin<=0&&0<=ymax)svg.appendChild(el('line',{x1:m,y1:Y(0),x2:W-m,y2:Y(0),stroke:C.axis,'stroke-width':1.7}));
    if(xmin<=0&&0<=xmax)svg.appendChild(el('line',{x1:X(0),y1:m,x2:X(0),y2:H-m,stroke:C.axis,'stroke-width':1.7}));
    const g=el('g',{'clip-path':`url(#${cid})`});
    curves.forEach((c,j)=>{
      const n=1400;let pts=[],prev=null;
      const flush=()=>{if(pts.length>1)g.appendChild(el('polyline',{points:pts.join(' '),fill:'none',stroke:c.color||[C.blue,C.rust,C.green][j%3],'stroke-width':c.width||3,'stroke-linejoin':'round','stroke-linecap':'round'}));pts=[];};
      for(let i=0;i<=n;i++){
        const x=c.a+(c.b-c.a)*i/n,y=c.f(x);
        if(!Number.isFinite(y)||y<ymin-.2*(ymax-ymin)||y>ymax+.2*(ymax-ymin)){flush();prev=null;continue;}
        if(prev!==null&&Math.abs(y-prev)>.45*(ymax-ymin))flush();
        pts.push(`${X(x).toFixed(2)},${Y(y).toFixed(2)}`);prev=y;
      }
      flush();
    });
    svg.appendChild(g);
    guides.forEach(q=>svg.appendChild(el('line',{x1:X(q.x1),y1:Y(q.y1),x2:X(q.x2),y2:Y(q.y2),stroke:q.color||C.guide,'stroke-width':q.width||1.4,'stroke-dasharray':q.dash===false?'':'7 6'})));
    points.forEach(p=>svg.appendChild(el('circle',{cx:X(p.x),cy:Y(p.y),r:p.r||5,fill:C.point,stroke:C.point})));
    openPoints.forEach(p=>svg.appendChild(el('circle',{cx:X(p.x),cy:Y(p.y),r:p.r||6,fill:'#fff',stroke:C.point,'stroke-width':2.2}));
    labels.forEach(l=>svg.appendChild(el('text',{x:X(l.x)+(l.dx||0),y:Y(l.y)+(l.dy||0),fill:C.label,'font-size':l.size||15},l.t)));
    const d=wrap();d.appendChild(svg);return d;
  }

  function put(title,node){
    const h=[...document.querySelectorAll('.lesson-content h3')].find(x=>x.textContent.trim().startsWith(title));if(!h)return;
    const card=h.closest('section');
    if(card){const visual=[...card.querySelectorAll('div')].find(d=>/visual/.test(d.className));if(visual){visual.replaceChildren(node);return;}}
    let p=h.nextElementSibling,last=h;while(p&&p.tagName!=='H3'&&!p.classList.contains('lesson-navigation')){last=p;p=p.nextElementSibling;}last.insertAdjacentElement('afterend',node);
  }

  if(page==='function-concept.html'){
    put('4. Different inputs',plot({xmin:-3,xmax:3,ymin:-1,ymax:9,curves:[{a:-3,b:3,f:x=>x*x}],points:[{x:-2,y:4},{x:0,y:0},{x:2,y:4}],labels:[{x:-2,y:4,t:'(−2,4)',dx:-65,dy:-10},{x:2,y:4,t:'(2,4)',dx:10,dy:-10},{x:2.1,y:7,t:'y=x²'}]}));
  }
  if(page==='function-notation.html'){
    put('7. Comparing two function values',plot({xmin:-1,xmax:6,ymin:-2,ymax:28,curves:[{a:-1,b:5.3,f:x=>x*x}],points:[{x:2,y:4},{x:5,y:25}],labels:[{x:2,y:4,t:'f(2)=4',dx:8,dy:-8},{x:5,y:25,t:'f(5)=25',dx:-82,dy:-10}]}));
  }
  if(page==='domain-range.html'){
    put('2. Range',plot({xmin:-4,xmax:4,ymin:-1,ymax:9,curves:[{a:-3,b:3,f:x=>x*x}],points:[{x:0,y:0}],labels:[{x:2.2,y:6.5,t:'range y≥0'}]}));
    put('4. Division',plot({xmin:-5,xmax:5,ymin:-5,ymax:5,curves:[{a:-5,b:-.12,f:x=>1/x},{a:.12,b:5,f:x=>1/x}],guides:[{x1:0,y1:-5,x2:0,y2:5}],labels:[{x:2.1,y:1.1,t:'y=1/x'}]}));
    put('5. Square roots',plot({xmin:-2,xmax:8,ymin:-1,ymax:4,curves:[{a:0,b:8,f:x=>Math.sqrt(x)}],points:[{x:0,y:0}],labels:[{x:3.7,y:2.5,t:'y=√x'}]}));
  }
  if(page==='linear-functions.html'){
    put('1. Why the graph',plot({xmin:-2,xmax:5,ymin:-3,ymax:11,curves:[{a:-2,b:5,f:x=>2*x+1}],points:[{x:0,y:1},{x:1,y:3},{x:2,y:5}],labels:[{x:2.8,y:7.5,t:'y=2x+1'}]}));
    put('2. The gradient',plot({xmin:-1,xmax:5,ymin:-2,ymax:11,curves:[{a:-1,b:5,f:x=>2*x+1}],points:[{x:1,y:3},{x:4,y:9}],guides:[{x1:1,y1:3,x2:4,y2:3},{x1:4,y1:3,x2:4,y2:9}],labels:[{x:2.2,y:2.5,t:'Δx=3'},{x:4.05,y:6.1,t:'Δy=6'}]}));
  }
  if(page==='quadratic-functions.html'){
    put('1. The basic parabola',plot({xmin:-3,xmax:3,ymin:-1,ymax:9,curves:[{a:-3,b:3,f:x=>x*x}],points:[{x:-2,y:4},{x:0,y:0},{x:2,y:4}],labels:[{x:-2,y:4,t:'(−2,4)',dx:-65,dy:-10},{x:2,y:4,t:'(2,4)',dx:10,dy:-10},{x:2.1,y:7,t:'y=x²'}]}));
    put('2. The sign',plot({xmin:-4,xmax:4,ymin:-5,ymax:5,curves:[{a:-3,b:.8,f:x=>(x+1.5)*(x+1.5)-3},{a:-.5,b:4,f:x=>-((x-1.5)*(x-1.5))+3,color:C.rust}],points:[{x:-1.5,y:-3},{x:1.5,y:3}],labels:[{x:-2.8,y:3.8,t:'a>0'},{x:2.2,y:3.8,t:'a<0'}]}));
    put('3. The turning point',plot({xmin:-3,xmax:3,ymin:-1,ymax:9,curves:[{a:-3,b:3,f:x=>x*x}],points:[{x:0,y:0}],guides:[{x1:0,y1:-1,x2:0,y2:9}],labels:[{x:.15,y:1,t:'turning point'}]}));
    put('4. Roots',plot({xmin:0,xmax:5,ymin:-1,ymax:6,curves:[{a:0,b:5,f:x=>(x-2)*(x-3)}],points:[{x:2,y:0},{x:3,y:0},{x:2.5,y:-.25}],labels:[{x:2,y:0,t:'(2,0)',dx:-45,dy:24},{x:3,y:0,t:'(3,0)',dx:10,dy:24},{x:2.5,y:-.25,t:'vertex',dx:10,dy:18}]}));
    put('5. Completing the square',plot({xmin:-1,xmax:5,ymin:0,ymax:12,curves:[{a:-1,b:5,f:x=>(x-2)*(x-2)+3}],points:[{x:2,y:3}],guides:[{x1:2,y1:0,x2:2,y2:12}],labels:[{x:2,y:3,t:'(2,3)',dx:10,dy:-10}]}));
    put('9. Changing',plot({xmin:-3,xmax:3,ymin:-1,ymax:10,curves:[{a:-2.2,b:2.2,f:x=>2*x*x},{a:-3,b:3,f:x=>.5*x*x,color:C.rust}],labels:[{x:1.2,y:6.5,t:'2x²'},{x:2.1,y:2.5,t:'0.5x²'}]}));
  }
  if(page==='polynomial-functions.html'){
    put('4. Roots',plot({xmin:-1,xmax:6,ymin:-3,ymax:7,curves:[{a:-1,b:6,f:x=>(x-2)*(x-3)}],points:[{x:2,y:0},{x:3,y:0}],labels:[{x:2,y:0,t:'root 2',dx:-48,dy:24},{x:3,y:0,t:'root 3',dx:10,dy:24}]}));
    put('7. Cubic',plot({xmin:-3,xmax:3,ymin:-5,ymax:5,curves:[{a:-3,b:3,f:x=>x*x*x-3*x}],points:[{x:-1,y:2},{x:1,y:-2}],labels:[{x:-1,y:2,t:'local max',dx:-75,dy:-10},{x:1,y:-2,t:'local min',dx:10,dy:20}]}));
  }
  if(page==='rational-functions.html'){
    put('1. The reciprocal',plot({xmin:-5,xmax:5,ymin:-5,ymax:5,curves:[{a:-5,b:-.12,f:x=>1/x},{a:.12,b:5,f:x=>1/x}],guides:[{x1:0,y1:-5,x2:0,y2:5}],labels:[{x:2.1,y:1.1,t:'y=1/x'}]}));
    put('2. Vertical asymptotes',plot({xmin:-2,xmax:8,ymin:-5,ymax:6,curves:[{a:-2,b:2.9,f:x=>(x+1)/(x-3)},{a:3.1,b:8,f:x=>(x+1)/(x-3)}],guides:[{x1:3,y1:-5,x2:3,y2:6},{x1:-2,y1:1,x2:8,y2:1}],points:[{x:-1,y:0},{x:0,y:-1/3}],labels:[{x:3.1,y:5,t:'x=3'},{x:6,y:1.2,t:'y=1'}]}));
    put('6. A removable',plot({xmin:-2,xmax:4,ymin:-1,ymax:6,curves:[{a:-2,b:.98,f:x=>x+1},{a:1.02,b:4,f:x=>x+1}],openPoints:[{x:1,y:2}],labels:[{x:1,y:2,t:'hole (1,2)',dx:12,dy:-12}]}));
  }
  if(page==='exponential-functions.html'){
    put('3. Exponential decay',plot({xmin:-3,xmax:4,ymin:-1,ymax:9,curves:[{a:-3,b:3,f:x=>Math.pow(2,x)},{a:-3,b:3,f:x=>Math.pow(.5,x),color:C.rust}],points:[{x:0,y:1}],labels:[{x:1.6,y:4.5,t:'2ˣ'},{x:-2.6,y:4.5,t:'(1/2)ˣ'},{x:.1,y:1,t:'(0,1)',dx:8,dy:-8}]}));
    put('10. Linear versus exponential',plot({xmin:0,xmax:6,ymin:0,ymax:35,curves:[{a:0,b:6,f:x=>4*x+1},{a:0,b:5,f:x=>Math.pow(2,x),color:C.rust}],labels:[{x:4.5,y:19,t:'linear'},{x:4.1,y:25,t:'exponential'}]}));
  }
  if(page==='logarithmic-functions.html'){
    put('3. Domain',plot({xmin:-1,xmax:8,ymin:-4,ymax:3,curves:[{a:.03,b:8,f:x=>Math.log(x)}],guides:[{x1:0,y1:-4,x2:0,y2:3}],points:[{x:1,y:0}],labels:[{x:3.5,y:1.8,t:'y=ln x'}]}));
  }
})();