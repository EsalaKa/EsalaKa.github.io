(() => {
const NS='http://www.w3.org/2000/svg';
const C={axis:'#171717',label:'#171717',point:'#171717',grid:'#d9dde2',guide:'#666b70',blue:'#496f8a',rust:'#9a6754',green:'#617b6b'};
const page=location.pathname.split('/').pop();
const el=(n,a={},t)=>{const e=document.createElementNS(NS,n);for(const[k,v]of Object.entries(a))e.setAttribute(k,v);if(t!==undefined)e.textContent=t;return e;};
function plot({xmin,xmax,ymin,ymax,curves=[],guides=[],points=[],openPoints=[],labels=[]}){
 const W=720,H=480,m=58,pw=W-2*m,ph=H-2*m;
 const X=x=>m+(x-xmin)*pw/(xmax-xmin),Y=y=>H-m-(y-ymin)*ph/(ymax-ymin);
 const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':'Mathematical graph',style:'width:100%;height:auto;display:block'});
 for(let x=Math.ceil(xmin);x<=Math.floor(xmax);x++)svg.appendChild(el('line',{x1:X(x),y1:m,x2:X(x),y2:H-m,stroke:C.grid,'stroke-width':.7}));
 for(let y=Math.ceil(ymin);y<=Math.floor(ymax);y++)svg.appendChild(el('line',{x1:m,y1:Y(y),x2:W-m,y2:Y(y),stroke:C.grid,'stroke-width':.7}));
 if(ymin<=0&&0<=ymax)svg.appendChild(el('line',{x1:m,y1:Y(0),x2:W-m,y2:Y(0),stroke:C.axis,'stroke-width':1.9}));
 if(xmin<=0&&0<=xmax)svg.appendChild(el('line',{x1:X(0),y1:m,x2:X(0),y2:H-m,stroke:C.axis,'stroke-width':1.9}));
 curves.forEach((c,j)=>{let pts=[];const n=1800;const flush=()=>{if(pts.length>1)svg.appendChild(el('polyline',{points:pts.join(' '),fill:'none',stroke:c.color||[C.blue,C.rust,C.green][j%3],'stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round'}));pts=[];};let lastY=null;for(let i=0;i<=n;i++){const x=c.a+(c.b-c.a)*i/n,y=c.f(x);if(!Number.isFinite(y)||y<ymin||y>ymax){flush();lastY=null;continue;}if(lastY!==null&&Math.abs(y-lastY)>.3*(ymax-ymin))flush();pts.push(`${X(x).toFixed(2)},${Y(y).toFixed(2)}`);lastY=y;}flush();});
 guides.forEach(q=>svg.appendChild(el('line',{x1:X(q.x1),y1:Y(q.y1),x2:X(q.x2),y2:Y(q.y2),stroke:q.color||C.guide,'stroke-width':q.width||1.4,'stroke-dasharray':q.dash===false?'':'7 6'})));
 points.forEach(p=>svg.appendChild(el('circle',{cx:X(p.x),cy:Y(p.y),r:p.r||5.5,fill:C.point,stroke:C.point})));
 openPoints.forEach(p=>svg.appendChild(el('circle',{cx:X(p.x),cy:Y(p.y),r:p.r||6.5,fill:'#fff',stroke:C.point,'stroke-width':2.2})));
 labels.forEach(l=>svg.appendChild(el('text',{x:X(l.x)+(l.dx||0),y:Y(l.y)+(l.dy||0),fill:C.label,'font-size':l.size||15},l.t)));
 const d=document.createElement('div');d.className='math-graph';d.appendChild(svg);return d;
}
function put(title,node){const h=[...document.querySelectorAll('.lesson-content h3')].find(x=>x.textContent.trim().startsWith(title));if(!h)return;const card=h.closest('section');if(card){const visual=[...card.querySelectorAll('div')].find(d=>/(^|-)visual\b/.test(d.className));if(visual){visual.replaceChildren(node);}}}

if(page==='inverse-functions.html'){
 put('5. Graphs of inverse functions',plot({xmin:-4,xmax:4,ymin:-4,ymax:4,curves:[{a:-2.5,b:1.5,f:x=>2*x+1},{a:-4,b:4,f:x=>(x-1)/2,color:C.rust},{a:-4,b:4,f:x=>x,color:C.guide}],points:[{x:1,y:3},{x:3,y:1}],labels:[{x:.5,y:3.2,t:'y = 2x + 1'},{x:2.1,y:.3,t:'y = (x−1)/2'},{x:2.7,y:3.2,t:'y = x'},{x:1,y:3,t:'(1,3)',dx:8,dy:-8},{x:3,y:1,t:'(3,1)',dx:8,dy:-8}]}));
 put('7. The horizontal line test',plot({xmin:-3,xmax:3,ymin:-1,ymax:6,curves:[{a:-2.5,b:2.5,f:x=>x*x}],guides:[{x1:-3,y1:4,x2:3,y2:4}],points:[{x:-2,y:4},{x:2,y:4}],labels:[{x:2.1,y:5.2,t:'y = x²'},{x:-2.8,y:4.15,t:'y = 4'},{x:-2,y:4,t:'(−2,4)',dx:-58,dy:-10},{x:2,y:4,t:'(2,4)',dx:8,dy:-10}]}));
 put('8. Restricting the domain',plot({xmin:0,xmax:4,ymin:0,ymax:4,curves:[{a:0,b:2,f:x=>x*x},{a:0,b:4,f:x=>Math.sqrt(x),color:C.rust},{a:0,b:4,f:x=>x,color:C.guide}],points:[{x:1,y:1},{x:2,y:4},{x:4,y:2}],labels:[{x:1.35,y:3.1,t:'y = x², x ≥ 0'},{x:2.55,y:1.6,t:'y = √x'},{x:3.1,y:3.45,t:'y = x'}]}));
 put('10. Exponential and logarithmic inverses',plot({xmin:-2.5,xmax:4,ymin:-2.5,ymax:4,curves:[{a:-2.5,b:Math.log(4),f:x=>Math.exp(x)},{a:Math.exp(-2.5),b:4,f:x=>Math.log(x),color:C.rust},{a:-2.5,b:4,f:x=>x,color:C.guide}],points:[{x:0,y:1},{x:1,y:0}],labels:[{x:.7,y:3.2,t:'y = eˣ'},{x:2.4,y:.8,t:'y = ln x'},{x:3,y:3.4,t:'y = x'},{x:0,y:1,t:'(0,1)',dx:8,dy:-8},{x:1,y:0,t:'(1,0)',dx:8,dy:22}]}));
}

if(page==='transformations.html'){
 put('1. Vertical translation',plot({xmin:-4,xmax:4,ymin:-1,ymax:10,curves:[{a:-3,b:3,f:x=>x*x},{a:-2.6,b:2.6,f:x=>x*x+3,color:C.rust}],points:[{x:0,y:0},{x:0,y:3}],labels:[{x:2.1,y:4.8,t:'y = x²'},{x:1.6,y:7.1,t:'y = x² + 3'}]}));
 put('2. Horizontal translation',plot({xmin:-3,xmax:6,ymin:-1,ymax:10,curves:[{a:-3,b:3,f:x=>x*x},{a:-1,b:5,f:x=>(x-2)*(x-2),color:C.rust}],points:[{x:0,y:0},{x:2,y:0}],labels:[{x:-2.5,y:5.5,t:'y = x²'},{x:3.2,y:3.5,t:'y = (x−2)²'}]}));
 put('3. Vertical stretching and compression',plot({xmin:-3,xmax:3,ymin:-1,ymax:10,curves:[{a:-3,b:3,f:x=>x*x},{a:-2.2,b:2.2,f:x=>2*x*x,color:C.rust},{a:-3,b:3,f:x=>.5*x*x,color:C.green}],points:[{x:0,y:0}],labels:[{x:2.1,y:4.7,t:'x²'},{x:1.5,y:6.7,t:'2x²'},{x:2.1,y:2.1,t:'½x²'}]}));
 put('4. Reflection in the x-axis',plot({xmin:-3,xmax:3,ymin:-9,ymax:9,curves:[{a:-3,b:3,f:x=>x*x},{a:-3,b:3,f:x=>-x*x,color:C.rust}],points:[{x:0,y:0}],labels:[{x:1.8,y:5.5,t:'y = x²'},{x:1.8,y:-5.5,t:'y = −x²'}]}));
 put('5. Reflection in the y-axis',plot({xmin:-3,xmax:3,ymin:-1,ymax:9,curves:[{a:-3,b:2.1,f:x=>Math.exp(x)},{a:-2.1,b:3,f:x=>Math.exp(-x),color:C.rust}],points:[{x:0,y:1}],labels:[{x:1.2,y:4.5,t:'y = eˣ'},{x:-2.4,y:4.5,t:'y = e⁻ˣ'}]}));
 put('6. Horizontal stretching and compression',plot({xmin:-2*Math.PI,xmax:2*Math.PI,ymin:-1.5,ymax:1.5,curves:[{a:-2*Math.PI,b:2*Math.PI,f:x=>Math.sin(x)},{a:-2*Math.PI,b:2*Math.PI,f:x=>Math.sin(2*x),color:C.rust}],labels:[{x:1.1,y:1.05,t:'sin x'},{x:2.3,y:-1.15,t:'sin(2x)'}]}));
 put('7. Several transformations together',plot({xmin:-1,xmax:7,ymin:-1,ymax:12,curves:[{a:-1,b:4.3,f:x=>x*x},{a:1,b:5,f:x=>2*(x-3)*(x-3)+1,color:C.rust}],points:[{x:0,y:0},{x:3,y:1}],guides:[{x1:3,y1:-1,x2:3,y2:12}],labels:[{x:.8,y:4.3,t:'y = x²'},{x:3.2,y:1,t:'vertex (3,1)',dx:8,dy:-8},{x:4.2,y:4.4,t:'y = 2(x−3)² + 1'}]}));
}
})();