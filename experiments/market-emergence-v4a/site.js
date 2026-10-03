(()=> {
  const menu=document.querySelector('.mobile-menu'),nav=document.querySelector('.site-nav');
  menu?.addEventListener('click',()=>nav?.classList.toggle('open'));
  const canvas=document.getElementById('homeDynamics'),ctx=canvas?.getContext('2d');
  if(!canvas||!ctx)return;
  let w=0,h=0,dpr=1,nodes=[],pointer={x:-9999,y:-9999,inside:false};
  const resize=()=>{dpr=Math.min(devicePixelRatio||1,1.5);w=canvas.clientWidth;h=canvas.clientHeight;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);if(!nodes.length){for(let i=0;i<64;i++){const a=Math.random()*Math.PI*2,s=.18+Math.random()*.34;nodes.push({x:Math.random()*w,y:Math.random()*h,vx:Math.cos(a)*s,vy:Math.sin(a)*s,r:1.2+Math.random()*2.2})}}};
  canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;pointer.inside=true},{passive:true});canvas.addEventListener('pointerleave',()=>pointer.inside=false,{passive:true});
  const tick=()=>{ctx.clearRect(0,0,w,h);const g=ctx.createRadialGradient(w*.72,h*.18,10,w*.72,h*.18,Math.max(w,h)*.75);g.addColorStop(0,'rgba(24,85,110,.34)');g.addColorStop(.55,'rgba(8,31,46,.14)');g.addColorStop(1,'rgba(4,14,21,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    nodes.forEach(n=>{if(pointer.inside){const dx=n.x-pointer.x,dy=n.y-pointer.y,d=Math.hypot(dx,dy);if(d<150&&d>1){n.vx+=dx/d*(1-d/150)*.018;n.vy+=dy/d*(1-d/150)*.018}}const sp=Math.hypot(n.vx,n.vy)||1,max=.52;if(sp>max){n.vx=n.vx/sp*max;n.vy=n.vy/sp*max}n.x+=n.vx;n.y+=n.vy;if(n.x<-20)n.x=w+20;if(n.x>w+20)n.x=-20;if(n.y<-20)n.y=h+20;if(n.y>h+20)n.y=-20});
    for(let i=0;i<nodes.length;i++){for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<120){ctx.strokeStyle='rgba(120,214,235,'+((1-d/120)*.12)+')';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}
    nodes.forEach((n,i)=>{ctx.fillStyle=i%9===0?'rgba(223,170,98,.68)':'rgba(143,228,244,.64)';ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fill()});requestAnimationFrame(tick)};
  resize();window.addEventListener('resize',resize,{passive:true});requestAnimationFrame(tick);
})();