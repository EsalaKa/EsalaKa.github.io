(function(global){
  function mapper(cfg){
    const {left,right,top,bottom,xMin,xMax,yMin,yMax}=cfg;
    return {
      X:x=>left+(x-xMin)*(right-left)/(xMax-xMin),
      Y:y=>bottom-(y-yMin)*(bottom-top)/(yMax-yMin)
    };
  }
  function buildPath(fn,cfg,step){
    const m=mapper(cfg);
    const dx=step || (cfg.xMax-cfg.xMin)/700;
    let d='',started=false;
    for(let x=cfg.xMin;x<=cfg.xMax+1e-12;x+=dx){
      const y=fn(x);
      if(!Number.isFinite(y)||y<cfg.yMin||y>cfg.yMax){started=false;continue;}
      const X=m.X(x),Y=m.Y(y);
      d+=(started?' L ':'M ')+X.toFixed(2)+' '+Y.toFixed(2);
      started=true;
    }
    return d;
  }
  function plot(pathId,fn,cfg,step){
    const el=document.getElementById(pathId); if(!el)return;
    el.setAttribute('d',buildPath(fn,cfg,step));
  }
  function point(id,x,y,cfg){
    const el=document.getElementById(id); if(!el)return;
    const m=mapper(cfg); el.setAttribute('cx',m.X(x)); el.setAttribute('cy',m.Y(y));
  }
  function line(id,x1,y1,x2,y2,cfg){
    const el=document.getElementById(id); if(!el)return;
    const m=mapper(cfg);
    el.setAttribute('x1',m.X(x1)); el.setAttribute('y1',m.Y(y1));
    el.setAttribute('x2',m.X(x2)); el.setAttribute('y2',m.Y(y2));
  }
  function text(id,x,y,cfg){
    const el=document.getElementById(id); if(!el)return;
    const m=mapper(cfg); el.setAttribute('x',m.X(x)); el.setAttribute('y',m.Y(y));
  }
  function axes(xAxisId,yAxisId,cfg){
    const m=mapper(cfg);
    const xAxis=document.getElementById(xAxisId), yAxis=document.getElementById(yAxisId);
    const y0=(cfg.yMin<=0&&0<=cfg.yMax)?m.Y(0):m.Y(cfg.yMin);
    const x0=(cfg.xMin<=0&&0<=cfg.xMax)?m.X(0):m.X(cfg.xMin);
    if(xAxis){xAxis.setAttribute('x1',cfg.left);xAxis.setAttribute('x2',cfg.right);xAxis.setAttribute('y1',y0);xAxis.setAttribute('y2',y0);}
    if(yAxis){yAxis.setAttribute('x1',x0);yAxis.setAttribute('x2',x0);yAxis.setAttribute('y1',cfg.top);yAxis.setAttribute('y2',cfg.bottom);}
  }
  function tangent(fn,fnPrime,x0,x1,x2,pathId,cfg){
    const y0=fn(x0),m0=fnPrime(x0);
    plot(pathId,x=>y0+m0*(x-x0),{...cfg,xMin:x1,xMax:x2},(x2-x1)/120);
  }
  global.DYDXGraph={mapper,buildPath,plot,point,line,text,axes,tangent};
})(window);