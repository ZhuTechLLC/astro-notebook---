import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './styles.css';

const branches = {
  root: ['祖源', '#f4d58d'],
  eldest: ['长房', '#58a6ff'],
  main: ['二房·朱九天', '#ff5d73'],
  third: ['三房', '#56d6b9'],
  fourth: ['四房', '#b98cff'],
  fifth: ['五房', '#f6a95c'],
  daughter: ['曾姑祖母房', '#e7a4d8'],
};

const raw = [
  ['h1','朱鹤宰',1,'root','高祖',1,'鹤字辈；五子一女'],
  ['e1','朱九？',2,'eldest','大曾伯祖',0,'姓名待考'], ['m1','朱九天',2,'main','曾祖',1,'主线'], ['t1','三曾叔祖',2,'third','高祖第三子',0,'生两女'], ['f1','四曾叔祖',2,'fourth','高祖第四子',0,'早逝；家称五伯'], ['q1','小曾叔祖',2,'fifth','高祖第五子',0,'二子二女'], ['d1','曾姑祖母',2,'daughter','高祖之女',0,'家称太太'],
  ['e11','朱振X',3,'eldest','旁系',0,'待考'], ['e12','朱振明',3,'eldest','旁系',0,''], ['m11','朱振兴',3,'main','祖父',1,'主线'], ['m12','朱振芳',3,'main','大姑婆',0,'生一子一女'], ['m13','陈雅珍',3,'main','小姑婆',0,'幼时被陈家领养；三子二女'], ['t11','三曾叔祖长女',3,'third','旁系',0,'待考'], ['t12','三曾叔祖次女',3,'third','旁系',0,'待考'], ['q11','朱振涛',3,'fifth','大公公',0,''], ['q12','小曾叔祖长女',3,'fifth','旁系',0,'生一女'], ['q13','小曾叔祖次女',3,'fifth','旁系',0,'生一子，已逝'], ['q14','陈辉',3,'fifth','二公公',0,'寄名出姓，不是领养'],
  ['m111','朱永祥',4,'main','父亲',1,'主线'], ['m112','朱雅琴',4,'main','姑妈',0,'生徐金凤、徐朱源'], ['m113','朱永兵',4,'main','小伯/叔叔',0,'生朱见爱'], ['m121','朱振芳之子',4,'main','旁系',0,'待考'], ['m122','朱振芳之女',4,'main','旁系',0,'待考'], ['m131','陈雅珍长子',4,'main','旁系',0,'待考'], ['m132','陈雅珍次子',4,'main','旁系',0,'待考'], ['m133','陈雅珍三子',4,'main','旁系',0,'待考'], ['m134','陈雅珍长女',4,'main','旁系',0,'待考'], ['m135','陈雅珍次女',4,'main','旁系',0,'待考'], ['q111','小兵伯伯',4,'fifth','旁系',0,'正式姓名待补'], ['q112','蓓蓓姑妈',4,'fifth','旁系',0,'生一子小龙'], ['q121','长女之女',4,'fifth','旁系',0,'待考'], ['q131','次女之子',4,'fifth','旁系',0,'儿时玩伴，已逝'], ['q141','风雷伯伯',4,'fifth','旁系',0,'陈辉之子'],
  ['m1111','朱滔滔',5,'main','本人',1,''], ['m1121','徐金凤',5,'main','表亲',0,'朱雅琴之女；生二女'], ['m1122','徐朱源',5,'main','表弟',0,'朱雅琴之子；生一女'], ['m1131','朱见爱',5,'main','旁系',0,'朱永兵之子女；生一子'], ['q1121','小龙',5,'fifth','旁系',0,''], ['q1411','风雷伯伯之子',5,'fifth','旁系',0,'待考'],
  ['m11111','朱信琥',6,'main','长子',1,''], ['m11112','朱沃珑',6,'main','次子',1,''], ['m11113','朱嵩珺',6,'main','三子',1,''], ['m11114','朱润琪',6,'main','四子',1,''], ['m11211','徐金凤长女',6,'main','旁系',0,'待考'], ['m11212','徐金凤次女',6,'main','旁系',0,'待考'], ['m11221','徐朱源之女',6,'main','旁系',0,'待考'], ['m11311','朱见爱之子',6,'main','旁系',0,'待考'],
];

const nodes = raw.map((r) => ({ id:r[0], name:r[1], g:r[2], branch:r[3], rel:r[4], direct:Boolean(r[5]), note:r[6], pending:/待考|待补/.test(r[6] || '') }));
const links = [
  ['h1','e1'],['h1','m1'],['h1','t1'],['h1','f1'],['h1','q1'],['h1','d1'],['e1','e11'],['e1','e12'],['m1','m11'],['m1','m12'],['m1','m13'],['m11','m111'],['m11','m112'],['m11','m113'],['m111','m1111'],['m1111','m11111'],['m1111','m11112'],['m1111','m11113'],['m1111','m11114'],['m112','m1121'],['m112','m1122'],['m1121','m11211'],['m1121','m11212'],['m1122','m11221'],['m113','m1131'],['m1131','m11311'],['m12','m121'],['m12','m122'],['m13','m131'],['m13','m132'],['m13','m133'],['m13','m134'],['m13','m135'],['t1','t11'],['t1','t12'],['q1','q11'],['q1','q12'],['q1','q13'],['q1','q14'],['q11','q111'],['q11','q112'],['q112','q1121'],['q12','q121'],['q13','q131'],['q14','q141'],['q141','q1411'],
];

const generationY = {1:38,2:23,3:8,4:-7,5:-22,6:-37};
const branchX = {root:0,eldest:-54,main:-14,third:18,fourth:36,fifth:55,daughter:74};

function nodePosition(n){
  if(n.id === 'h1') return new THREE.Vector3(0,generationY[n.g],0);
  if(n.direct) return new THREE.Vector3(0,generationY[n.g],0);
  const same = nodes.filter(x => x.branch === n.branch && x.g === n.g);
  const k = same.indexOf(n);
  return new THREE.Vector3((branchX[n.branch] || 0) + (k-(same.length-1)/2)*7, generationY[n.g], (k%2?1:-1)*Math.floor((k+1)/2)*7.5);
}

function connectionCurve(a,b){
  const bend = new THREE.Vector3((a.x+b.x)/2,(a.y+b.y)/2+4,(a.z+b.z)/2);
  return new THREE.CatmullRomCurve3([a,a.clone().lerp(b,.25).lerp(bend,.45),bend,b.clone().lerp(a,.25).lerp(bend,.45),b]);
}

function Scene3D({ visibleIds, highlightDirect, motion, selectedId, onSelect, apiRef }){
  const mountRef = useRef(null);
  useEffect(() => {
    const host = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#07101c');
    scene.fog = new THREE.FogExp2('#07101c', 0.006);
    scene.add(new THREE.AmbientLight('#bedcff',1.55));
    const key = new THREE.DirectionalLight('#ffffff',3.1); key.position.set(20,30,30); scene.add(key);
    const fill = new THREE.DirectionalLight('#6aa8ff',1.0); fill.position.set(-35,8,-15); scene.add(fill);

    const camera = new THREE.PerspectiveCamera(48,1,0.1,500);
    const renderer = new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera,renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = .06; controls.minDistance = 20; controls.maxDistance = 190;

    const objectMap = new Map(); const pickables = [];
    nodes.forEach(n => {
      if(!visibleIds.has(n.id)) return;
      const group = new THREE.Group(); group.position.copy(nodePosition(n)); scene.add(group);
      const dim = highlightDirect && !n.direct;
      const color = n.direct ? '#ff5d73' : branches[n.branch][1];
      const material = new THREE.MeshStandardMaterial({color,roughness:.32,metalness:.16,transparent:true,opacity:dim?.18:(n.pending?.48:.96),emissive:new THREE.Color(n.direct?'#3d0b14':'#07101c'),emissiveIntensity:n.direct?.95:.1});
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(n.direct?1.55:1.16,24,18),material);
      sphere.userData.id=n.id; group.add(sphere); pickables.push(sphere);
      if(n.direct){
        const halo = new THREE.Mesh(new THREE.TorusGeometry(2.18,.09,8,48),new THREE.MeshStandardMaterial({color:'#ff8b9b',emissive:'#6a1724',emissiveIntensity:1.6,transparent:true,opacity:.72}));
        halo.rotation.x=Math.PI/2; halo.userData.halo=true; group.add(halo);
      }
      if(n.id===selectedId){
        const sel = new THREE.Mesh(new THREE.TorusGeometry(2.72,.13,8,64),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.8})); sel.rotation.x=Math.PI/2; sel.userData.selection=true; group.add(sel);
      }
      objectMap.set(n.id,{group,node:n});
    });

    const curves=[];
    links.forEach(([a,b]) => {
      if(!objectMap.has(a)||!objectMap.has(b)) return;
      const A=objectMap.get(a).group.position, B=objectMap.get(b).group.position;
      const direct=objectMap.get(a).node.direct&&objectMap.get(b).node.direct;
      const curve=connectionCurve(A,B);
      const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,36,direct?.115:.055,6,false),new THREE.MeshStandardMaterial({color:direct?'#ff6077':'#567590',emissive:direct?'#641426':'#07101c',emissiveIntensity:direct?1.5:.18,transparent:true,opacity:highlightDirect&&!direct?.08:(direct?.92:.34),roughness:.46}));
      scene.add(tube); curves.push({curve,direct});
    });

    const flow=[];
    curves.filter(x=>x.direct).forEach((x,idx)=>{
      for(let i=0;i<3;i++){
        const p=new THREE.Mesh(new THREE.SphereGeometry(.15,10,8),new THREE.MeshBasicMaterial({color:'#ffdbe1'})); scene.add(p); flow.push({mesh:p,curve:x.curve,phase:(i/3+idx*.19)%1});
      }
    });

    const starPos=[]; for(let i=0;i<230;i++) starPos.push((Math.random()-.5)*190,(Math.random()-.5)*120,(Math.random()-.5)*130);
    const starGeo=new THREE.BufferGeometry(); starGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPos,3));
    const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:'#739abb',size:.18,transparent:true,opacity:.22,blending:THREE.AdditiveBlending})); scene.add(stars);

    const labels=document.createElement('div'); labels.className='labels'; host.appendChild(labels); const labelEntries=[];
    objectMap.forEach(({group,node})=>{
      const el=document.createElement('button');
      el.className=`label ${node.direct?'direct':''} ${node.pending?'pending':''} ${highlightDirect&&!node.direct?'dimmed':''}`;
      el.style.borderColor=node.direct?'rgba(255,93,115,.52)':`${branches[node.branch][1]}66`;
      el.textContent=node.name; el.onclick=()=>onSelect(node.id); labels.appendChild(el); labelEntries.push([el,group.position.clone()]);
    });

    const raycaster=new THREE.Raycaster(); const pointer=new THREE.Vector2();
    const onClick=(e)=>{ const rect=renderer.domElement.getBoundingClientRect(); pointer.set((e.clientX-rect.left)/rect.width*2-1,-((e.clientY-rect.top)/rect.height*2-1)); raycaster.setFromCamera(pointer,camera); const hit=raycaster.intersectObjects(pickables)[0]; if(hit) onSelect(hit.object.userData.id); };
    renderer.domElement.addEventListener('click',onClick);

    const overview=()=>{ controls.target.set(6,-2,0); camera.position.set(30,23,116); controls.update(); };
    const focus=(id)=>{ const x=objectMap.get(id); if(!x)return; controls.target.copy(x.group.position); camera.position.copy(x.group.position).add(new THREE.Vector3(0,6,23)); controls.update(); };
    apiRef.current={overview,focus}; overview();

    const resize=()=>{ const r=host.getBoundingClientRect(); camera.aspect=Math.max(r.width,1)/Math.max(r.height,1); camera.updateProjectionMatrix(); renderer.setSize(Math.max(r.width,1),Math.max(r.height,1),false); };
    const ro=new ResizeObserver(resize); ro.observe(host); resize();

    let raf=0,t=0;
    const animate=()=>{ raf=requestAnimationFrame(animate); t+=.012; controls.update(); if(motion){ objectMap.forEach(({group,node})=>{ if(node.direct){ const halo=group.children.find(c=>c.userData.halo); if(halo){ halo.rotation.z+=.0025; halo.scale.setScalar(1+Math.sin(t+node.g)*.026); } } }); flow.forEach(f=>{f.phase=(f.phase+.0019)%1;f.mesh.position.copy(f.curve.getPoint(f.phase));}); stars.rotation.y+=.00018; } renderer.render(scene,camera); const rect=host.getBoundingClientRect(); labelEntries.forEach(([el,p])=>{ const v=p.clone().project(camera); const visible=v.z>-1&&v.z<1&&Math.abs(v.x)<1.08&&Math.abs(v.y)<1.08; el.hidden=!visible; if(visible){el.style.left=`${(v.x+1)*rect.width/2}px`;el.style.top=`${(-v.y+1)*rect.height/2}px`;}}); };
    animate();
    return()=>{cancelAnimationFrame(raf);ro.disconnect();renderer.domElement.removeEventListener('click',onClick);controls.dispose();renderer.dispose();scene.traverse(o=>{o.geometry?.dispose?.(); if(Array.isArray(o.material))o.material.forEach(m=>m.dispose?.());else o.material?.dispose?.();});host.replaceChildren();};
  },[visibleIds,highlightDirect,motion,selectedId,onSelect,apiRef]);
  return <div className="scene-host" ref={mountRef}/>;
}

function App(){
  const [selected,setSelected]=useState('m1111');
  const [filter,setFilter]=useState('all');
  const [highlightDirect,setHighlightDirect]=useState(true);
  const [directOnly,setDirectOnly]=useState(false);
  const [showPending,setShowPending]=useState(true);
  const [motion,setMotion]=useState(true);
  const [query,setQuery]=useState('');
  const apiRef=useRef({});
  const visibleIds=useMemo(()=>new Set(nodes.filter(n=>(!directOnly||n.direct)&&(filter==='all'||n.branch===filter||n.id==='h1')&&(showPending||!n.pending)).map(n=>n.id)),[directOnly,filter,showPending]);
  const current=nodes.find(n=>n.id===selected) ?? nodes[0];
  const matches=nodes.filter(n=>!query||n.name.includes(query)||n.rel.includes(query)).slice(0,8);
  return <div className="app">
    <header><div className="brand">朱氏六代 3D 家族树<small>SPATIAL GENEALOGY · V2</small></div><div className="stats"><span><b>47</b> 已知成员</span><span><b>9</b> 直系</span><span><b>38</b> 旁系</span></div></header>
    <div className="bar">不同支系固定颜色 · 半透明名牌 · 曲线血缘连接 · 一键高亮直系</div>
    <main>
      <aside className="left"><h3>房支导航</h3><p>世代按高度排列，支系向左右与前后展开。</p><button className={filter==='all'&&!directOnly?'active':''} onClick={()=>{setFilter('all');setDirectOnly(false)}}>全部家族</button>{Object.entries(branches).filter(([k])=>k!=='root').map(([k,v])=><button key={k} className={filter===k&&!directOnly?'active':''} onClick={()=>{setFilter(k);setDirectOnly(false)}}><i style={{background:v[1]}}/>{v[0]}</button>)}<h4>视图控制</h4><Toggle label="高亮直系" on={highlightDirect} setOn={setHighlightDirect}/><Toggle label="只看直系" on={directOnly} setOn={setDirectOnly}/><Toggle label="显示待考" on={showPending} setOn={setShowPending}/><Toggle label="动态效果" on={motion} setOn={setMotion}/></aside>
      <section className="world"><div className="toolbar"><b>{directOnly?'你的直系六代':filter==='all'?'朱氏六代空间家谱':branches[filter][0]}</b><div><button onClick={()=>apiRef.current.overview?.()}>全局视角</button><button onClick={()=>apiRef.current.focus?.(selected)}>聚焦当前</button></div></div><div className="scene-wrap"><Scene3D visibleIds={visibleIds} highlightDirect={highlightDirect} motion={motion} selectedId={selected} onSelect={setSelected} apiRef={apiRef}/><div className="orientation">第1代 ↑ · 房支 ← X → · 第6代 ↓</div><div className="hint">拖动旋转 · 滚轮缩放 · 点击人物</div></div><div className="search"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索姓名或称谓…"/><span>{query&&matches.map(x=>x.name).join(' · ')}</span></div></section>
      <aside className="right"><small>PERSON / CONTEXT</small><h2>{current.name}</h2><div><span className={current.direct?'tag direct':'tag'}>{current.direct?'直系血亲':'旁系血亲'}</span><span className="tag">第{current.g}代</span></div><dl><dt>关系</dt><dd>{current.rel}</dd><dt>房支</dt><dd>{branches[current.branch][0]}</dd><dt>现有记录</dt><dd>{current.note||'暂无补充'}</dd></dl><button className="focus" onClick={()=>apiRef.current.focus?.(selected)}>聚焦此人</button></aside>
    </main>
  </div>;
}

function Toggle({label,on,setOn}){return <button className={`toggle ${on?'active':''}`} onClick={()=>setOn(!on)}><span>{label}</span><span className="pill"/></button>}

createRoot(document.getElementById('root')).render(<App/>);
