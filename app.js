import React,{useEffect,useMemo,useRef,useState} from "https://esm.sh/react@19.1.1";
import {createRoot} from "https://esm.sh/react-dom@19.1.1/client";
import htm from "https://esm.sh/htm@3.1.1";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.179.1/+esm";
const html=htm.bind(React.createElement);
const sectorSummary={
"科技":{industries:11,firms:801,forwardPE:36.15,growth5Y:18.74,peg:1.965,lossRate:62.12},
"工业":{industries:19,firms:839,forwardPE:19.76,growth5Y:15.97,peg:1.41,lossRate:50},
"可选消费":{industries:27,firms:1156,forwardPE:21.52,growth5Y:9.95,peg:2.27,lossRate:60.26},
"金融":{industries:13,firms:1443,forwardPE:16.36,growth5Y:15,peg:1.03,lossRate:25},
"原材料":{industries:9,firms:268,forwardPE:16.64,growth5Y:12.715,peg:1.215,lossRate:75.86},
"能源":{industries:7,firms:343,forwardPE:21.9,growth5Y:7.77,peg:2.59,lossRate:57.73},
"医疗健康":{industries:5,firms:1063,forwardPE:42.33,growth5Y:14.98,peg:1.4,lossRate:75.98},
"公用事业":{industries:3,firms:81,forwardPE:21.3,growth5Y:7.65,peg:2.81,lossRate:28.57}
};
const benchmark={forwardPE:27.66,growth5Y:13.95,peg:1.9,lossRate:57.16,firms:5994,industries:94};
const stocks=[
{t:"NVDA",n:"NVIDIA",s:"科技",p:227.45,d:2.33,ytd:22.10,hv:.354965,adv:29410987018,trq:{opp:58.92,risk:41.89,fund:60,conf:.5167,integrity:"STALE",peFwd:14.84,peTtm:29.16,gross:.7498,opm:.6624,gaps:10,conflicts:8,refresh:["price","risk","valuation"]}},
{t:"TSM",n:"Taiwan Semiconductor",s:"科技",p:444.63,d:2.29,ytd:47.04,hv:.312658,adv:5565241341},
{t:"MU",n:"Micron Technology",s:"科技",p:1047.84,d:3.15,ytd:267.31,hv:.597010,adv:40974548153},
{t:"CRWD",n:"CrowdStrike",s:"科技",p:249.74,d:5.09,ytd:113.11,hv:.646148,adv:2236645603,trq:{opp:60,risk:null,fund:60,conf:.2333,integrity:"UNKNOWN",peFwd:null,peTtm:null,gross:.7457,opm:-.0226,gaps:12,conflicts:0,refresh:[]}},
{t:"MSFT",n:"Microsoft",s:"科技",p:500.70,d:1.40,ytd:3.99,hv:.219929,adv:17067106960},
{t:"PLTR",n:"Palantir",s:"科技",p:182.60,d:2.79,ytd:2.73,hv:.437090,adv:7185200013},
{t:"GOOGL",n:"Alphabet",s:"科技",p:356.24,d:1.92,ytd:13.96,hv:.235481,adv:10590744993},
{t:"META",n:"Meta Platforms",s:"科技",p:746.97,d:12.29,ytd:13.36,hv:.392485,adv:13679747956},
{t:"AMZN",n:"Amazon",s:"可选消费",p:258.60,d:1.93,ytd:12.04,hv:.232987,adv:11937565711},
{t:"GEV",n:"GE Vernova",s:"工业",p:949.02,d:.92,ytd:45.40,hv:.501712,adv:2432929721,trq:{opp:49.79,risk:57.86,fund:60,conf:.5037,integrity:"STALE",peFwd:null,peTtm:26.66,gross:.2125,opm:.0588,gaps:11,conflicts:0,refresh:["price","risk","valuation"]}},
{t:"ETN",n:"Eaton",s:"工业",p:435.50,d:2.53,ytd:37.52,hv:.433239,adv:967234001},
{t:"VST",n:"Vistra",s:"能源",p:141.40,d:.68,ytd:-12.10,hv:.366242,adv:618914286},
{t:"XOM",n:"Exxon Mobil",s:"能源",p:158.61,d:-3.01,ytd:33.57,hv:.260996,adv:2306081550,trq:{opp:69,risk:24.25,fund:60,conf:.4907,integrity:"STALE",peFwd:null,peTtm:19.64,gross:null,opm:null,gaps:14,conflicts:0,refresh:["price","risk","valuation"]}},
{t:"LLY",n:"Eli Lilly",s:"医疗健康",p:1164.96,d:1.04,ytd:8.77,hv:.288103,adv:3148811765},
{t:"UNH",n:"UnitedHealth",s:"医疗健康",p:376.94,d:.01,ytd:15.72,hv:.252879,adv:1955276134},
{t:"TEM",n:"Tempus AI",s:"医疗健康",p:77.60,d:-.31,ytd:31.41,hv:.851018,adv:506902745},
{t:"JPM",n:"JPMorgan Chase",s:"金融",p:351.61,d:.55,ytd:10.17,hv:.191958,adv:2782015696,trq:{opp:73.61,risk:16.19,fund:60,conf:.4729,integrity:"STALE",peFwd:null,peTtm:14.78,gross:null,opm:null,gaps:15,conflicts:0,refresh:["price","risk","valuation"]}},
{t:"COST",n:"Costco",s:"可选消费",p:898.63,d:.37,ytd:4.50,hv:.185063,adv:1980841785},
{t:"ACVA",n:"ACV Auctions",s:"可选消费",p:10.45,d:-.29,ytd:30.30,hv:1.301848,adv:70178117}
];
const meta={
"科技":{c:0x2b8fff,accent:"#5bc7ff",pos:[-7,-5],icon:"▦"},"医疗健康":{c:0x22b97a,accent:"#67efb8",pos:[0,-6],icon:"✚"},"金融":{c:0xd3a62d,accent:"#f3d476",pos:[7,-5],icon:"▥"},"可选消费":{c:0xc94f9a,accent:"#ef9bd1",pos:[-7,2],icon:"◆"},"工业":{c:0xe67b2c,accent:"#ffb46e",pos:[0,1],icon:"⚙"},"能源":{c:0x7658d5,accent:"#b8a3ff",pos:[7,2],icon:"▲"},"公用事业":{c:0x1b9c9f,accent:"#79e9e1",pos:[-3.6,7],icon:"⌁"},"原材料":{c:0xd55370,accent:"#ff8fa5",pos:[4,7],icon:"⬟"}
};
const rel=[["科技","工业"],["科技","医疗健康"],["科技","可选消费"],["金融","工业"],["工业","能源"],["工业","原材料"],["能源","公用事业"],["原材料","可选消费"]];
const clamp=(x,a=0,b=100)=>Math.max(a,Math.min(b,x));
function extent(a,key){const v=a.map(x=>key(x)).filter(Number.isFinite);return [Math.min(...v),Math.max(...v)]}
function norm(v,[a,b]){if(!Number.isFinite(v))return .5;return a===b?.5:(v-a)/(b-a)}
const ytdExt=extent(stocks,x=>x.ytd),dayExt=extent(stocks,x=>x.d),volExt=extent(stocks,x=>x.hv),liqExt=extent(stocks,x=>Math.log10(x.adv));
stocks.forEach(x=>{const mom=.72*norm(x.ytd,ytdExt)+.18*norm(x.d,dayExt)+.10*norm(Math.log10(x.adv),liqExt);const risk=.28*norm(x.hv,volExt);x.liveHeat=Math.round(clamp((mom-risk)*100));x.evidence=x.trq?Math.round(clamp(100-3*x.trq.gaps-2*x.trq.conflicts-(x.trq.integrity==="UNKNOWN"?20:0))):0});
const fmt=(v,n=1)=>Number.isFinite(v)?Number(v).toFixed(n):"—";
function money(v){if(!Number.isFinite(v))return"—";if(v>=1e9)return"$"+(v/1e9).toFixed(1)+"B";if(v>=1e6)return"$"+(v/1e6).toFixed(1)+"M";return"$"+Math.round(v).toLocaleString()}
function sprite(text,color="#d8f7ff",scale=1){const c=document.createElement("canvas"),x=c.getContext("2d");c.width=384;c.height=96;x.font="700 32px system-ui";x.fillStyle=color;x.textAlign="center";x.fillText(text,192,56);const tex=new THREE.CanvasTexture(c),mat=new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false});const sp=new THREE.Sprite(mat);sp.scale.set(4.2*scale,1.05*scale,1);return sp}
function ThreeMap({items,mode,selected,onSelect,showLabels,showRelations,autoRotate,onSector}){
 const ref=useRef(null),tip=useRef(null);
 useEffect(()=>{
  const el=ref.current;if(!el)return;
  const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x061018,.023);
  const cam=new THREE.PerspectiveCamera(42,1,.1,100);cam.position.set(16,15,20);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));el.appendChild(renderer.domElement);
  scene.add(new THREE.AmbientLight(0xffffff,.95));const dl=new THREE.DirectionalLight(0xc8f3ff,2.4);dl.position.set(8,14,10);scene.add(dl);
  const group=new THREE.Group();scene.add(group);const floor=new THREE.GridHelper(28,28,0x214b58,0x12303b);floor.position.y=-.02;group.add(floor);
  const pickables=[],islandTop={};
  Object.entries(sectorSummary).forEach(([s,ss])=>{const m=meta[s];const terrainH=mode==="terrain"?.45+3.4*norm(ss.growth5Y,[7,19]):.34;islandTop[s]=terrainH;const island=new THREE.Mesh(new THREE.CylinderGeometry(2.7,2.9,terrainH,36),new THREE.MeshStandardMaterial({color:m.c,roughness:.62,metalness:.04,transparent:true,opacity:mode==="terrain"?.72:.34,emissive:m.c,emissiveIntensity:.05}));island.position.set(m.pos[0],terrainH/2,m.pos[1]);island.userData={kind:"sector",sector:s};group.add(island);pickables.push(island);const ring=new THREE.Mesh(new THREE.RingGeometry(2.72,2.88,48),new THREE.MeshBasicMaterial({color:m.c,transparent:true,opacity:.65,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(m.pos[0],terrainH+.012,m.pos[1]);group.add(ring);if(showLabels){const lab=sprite(`${m.icon} ${s}`,m.accent,.82);lab.position.set(m.pos[0],terrainH+.8,m.pos[1]);group.add(lab);const metric=mode==="terrain"?`EPS5Y ${fmt(ss.growth5Y)}%`:`PE ${fmt(ss.forwardPE)}×`;const sub=sprite(metric,"#83a8b4",.52);sub.position.set(m.pos[0],terrainH+.35,m.pos[1]);group.add(sub)}});
  if(showRelations){rel.forEach(([a,b])=>{const A=meta[a].pos,B=meta[b].pos;const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(A[0],.22,A[1]),new THREE.Vector3(B[0],.22,B[1])]),new THREE.LineDashedMaterial({color:0x5b8f9c,dashSize:.3,gapSize:.23,transparent:true,opacity:.4}));line.computeLineDistances();group.add(line)})}
  const bySector={};items.forEach(x=>(bySector[x.s]??=[]).push(x));
  Object.entries(bySector).forEach(([s,a])=>a.forEach((d,i)=>{const m=meta[s],ang=i*2.399963,r=.6+.38*Math.sqrt(i+1),sx=m.pos[0]+Math.cos(ang)*r,sz=m.pos[1]+Math.sin(ang)*r;const score=mode==="trq"?(d.trq?.opp??0):mode==="terrain"?Math.max(12,d.liveHeat):d.liveHeat;const hgt=mode==="trq"?(d.trq?1+score/17:.38):.75+score/18;const top=islandTop[s],sy=top+hgt,liq=.18+.26*norm(Math.log10(d.adv),liqExt),color=mode==="trq"&&!d.trq?0x63737a:m.c;const ball=new THREE.Mesh(new THREE.SphereGeometry(liq,22,16),new THREE.MeshStandardMaterial({color,roughness:.3,metalness:.22,emissive:color,emissiveIntensity:d.t===selected?.34:.08,transparent:true,opacity:mode==="trq"&&!d.trq?.48:1}));ball.position.set(sx,sy,sz);ball.userData={kind:"stock",stock:d};group.add(ball);pickables.push(ball);group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(sx,top,sz),new THREE.Vector3(sx,sy-liq,sz)]),new THREE.LineBasicMaterial({color,transparent:true,opacity:.28})));if(showLabels){const lab=sprite(d.t,d.t===selected?"#ffffff":"#ccecf2",.45);lab.position.set(sx,sy+.48,sz);group.add(lab)}}));
  let rx=-.22,ry=-.42,zoom=1,drag=false,moved=0,px=0,py=0;group.rotation.set(rx,ry,0);const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();
  function resize(){const w=el.clientWidth,hg=el.clientHeight;renderer.setSize(w,hg,false);cam.aspect=w/hg;cam.updateProjectionMatrix()}resize();const ro=new ResizeObserver(resize);ro.observe(el);
  function hit(ev){const r=renderer.domElement.getBoundingClientRect();mouse.x=((ev.clientX-r.left)/r.width)*2-1;mouse.y=-((ev.clientY-r.top)/r.height)*2+1;ray.setFromCamera(mouse,cam);return ray.intersectObjects(pickables,false)[0]||null}
  function hover(ev){const q=hit(ev);if(!q){tip.current.style.display="none";renderer.domElement.style.cursor=drag?"grabbing":"grab";return}renderer.domElement.style.cursor="pointer";const r=renderer.domElement.getBoundingClientRect();tip.current.style.display="block";tip.current.style.left=(ev.clientX-r.left+10)+"px";tip.current.style.top=(ev.clientY-r.top+10)+"px";tip.current.textContent=q.object.userData.kind==="stock"?`${q.object.userData.stock.t} · ${q.object.userData.stock.n}`:`${q.object.userData.sector} · 行业地形`}
  const down=e=>{drag=true;moved=0;px=e.clientX;py=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)};
  const move=e=>{if(!drag){hover(e);return}const dx=e.clientX-px,dy=e.clientY-py;moved+=Math.abs(dx)+Math.abs(dy);ry+=dx*.006;rx=clamp(rx+dy*.004,-.72,.28);px=e.clientX;py=e.clientY;group.rotation.set(rx,ry,0)};
  const up=e=>{drag=false;if(moved<7){const q=hit(e);if(q?.object.userData.kind==="stock")onSelect(q.object.userData.stock.t);if(q?.object.userData.kind==="sector")onSector(q.object.userData.sector)}};
  const wheel=e=>{e.preventDefault();zoom=clamp(zoom+Math.sign(e.deltaY)*.08,.7,1.55);cam.position.set(16*zoom,15*zoom,20*zoom)};
  renderer.domElement.addEventListener("pointerdown",down);renderer.domElement.addEventListener("pointermove",move);renderer.domElement.addEventListener("pointerup",up);renderer.domElement.addEventListener("wheel",wheel,{passive:false});
  let af;const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;function loop(){af=requestAnimationFrame(loop);if(autoRotate&&!drag&&!reduce){ry+=.0014;group.rotation.y=ry}renderer.render(scene,cam)}loop();
  return()=>{cancelAnimationFrame(af);ro.disconnect();renderer.dispose();if(el.contains(renderer.domElement))el.removeChild(renderer.domElement)}
 },[items,mode,selected,showLabels,showRelations,autoRotate]);
 return html`<div ref=${ref} style=${{width:"100%",height:"100%",position:"relative"}}><div ref=${tip} className="tooltip"></div></div>`
}
function Bars({d}){const rows=[["市场热度",d.liveHeat],["动量(YTD映射)",Math.round(norm(d.ytd,ytdExt)*100)],["流动性",Math.round(norm(Math.log10(d.adv),liqExt)*100)],["低波动分",Math.round((1-norm(d.hv,volExt))*100)]];return html`<div className="metrics">${rows.map(([k,v])=>html`<div className="metricrow" key=${k}><span>${k}</span><div className="track"><div className="fill" style=${{width:clamp(v)+"%"}}></div></div><b>${v}</b></div>`)}</div>`}
function App(){
 const sectors=["全部",...Object.keys(sectorSummary)];const [mode,setMode]=useState("live"),[sector,setSector]=useState("全部"),[sel,setSel]=useState("NVDA"),[q,setQ]=useState(""),[sort,setSort]=useState("heat"),[labels,setLabels]=useState(true),[relations,setRelations]=useState(true),[auto,setAuto]=useState(false),[resetKey,setResetKey]=useState(0);
 const filtered=useMemo(()=>stocks.filter(x=>(sector==="全部"||x.s===sector)&&(!q||`${x.t} ${x.n}`.toLowerCase().includes(q.toLowerCase()))),[sector,q]);
 const ranked=useMemo(()=>[...filtered].sort((a,b)=>sort==="ytd"?b.ytd-a.ytd:sort==="day"?b.d-a.d:sort==="vol"?a.hv-b.hv:sort==="liq"?b.adv-a.adv:sort==="trq"?(b.trq?.opp??-1)-(a.trq?.opp??-1):b.liveHeat-a.liveHeat),[filtered,sort]);
 const chosen=stocks.find(x=>x.t===sel)||ranked[0]||stocks[0],ss=sectorSummary[chosen.s],known=stocks.filter(x=>x.trq).length;
 const tabs=[{k:"live",a:"实盘状态",b:"IBKR REALTIME"},{k:"trq",a:"TRQuant证据",b:"Unknown 明示"},{k:"terrain",a:"行业地貌",b:"94 行业背景"}];
 const rankValue=d=>sort==="trq"?(d.trq?fmt(d.trq.opp,0):"—"):sort==="vol"?fmt(d.hv*100,0):sort==="liq"?money(d.adv):sort==="day"?`${d.d>=0?"+":""}${fmt(d.d)}%`:sort==="ytd"?`${d.ytd>=0?"+":""}${fmt(d.ytd)}%`:d.liveHeat;
 return html`<div className="app">
 <header className="top"><div><div className="eyebrow">TRQUANT · 3D STOCK MAP · PRACTICAL V1</div><div className="title">交互式 3D 选股地图</div><div className="sub">19 只实盘标的 + Damodaran 94 行业背景 + TRQuant evidence overlay。拖拽旋转、滚轮缩放、点击标的/板块。</div></div>
 <div className="tabs">${tabs.map(x=>html`<button key=${x.k} className=${mode===x.k?"active":""} onClick=${()=>setMode(x.k)}><b>${x.a}</b>${x.b}</button>`)}</div>
 <div className="kpis"><div className="kpi"><span>IBKR 实盘覆盖</span><b>19 / 19</b></div><div className="kpi"><span>TRQuant 结构化证据</span><b>${known} / 19</b></div><div className="kpi"><span>行业背景</span><b>94 / 5994</b></div><div className="kpi"><span>市场风险权威</span><b>UNAVAILABLE</b></div></div></header>
 <div className="workspace">
  <aside className="panel side"><div className="section">研究导航</div><input className="search" value=${q} placeholder="搜索 ticker / company" onChange=${e=>setQ(e.target.value)}/><div className="label">板块</div><div className="chips">${sectors.map(s=>html`<button key=${s} className=${"chip "+(sector===s?"active":"")} onClick=${()=>setSector(s)}>${s}</button>`)}</div><div className="label">排序</div><select className="select" value=${sort} onChange=${e=>setSort(e.target.value)}><option value="heat">实时市场热度</option><option value="ytd">YTD 涨幅</option><option value="day">今日涨幅</option><option value="vol">低波动优先</option><option value="liq">流动性</option><option value="trq">TRQuant Opportunity</option></select><div className="label">视图</div><label className="toggle"><input type="checkbox" checked=${labels} onChange=${e=>setLabels(e.target.checked)}/>显示板块 / ticker 标签</label><label className="toggle"><input type="checkbox" checked=${relations} onChange=${e=>setRelations(e.target.checked)}/>显示板块关系</label><label className="toggle"><input type="checkbox" checked=${auto} onChange=${e=>setAuto(e.target.checked)}/>自动缓慢旋转</label><div className="mini"><button onClick=${()=>{setSector("全部");setQ("")}}>显示全部</button><button onClick=${()=>setMode("live")}>实盘视图</button><button onClick=${()=>setResetKey(x=>x+1)}>重置相机</button></div><p className="hint">实时市场热度是透明扫描指标：YTD/当日动量 + 流动性 − 波动惩罚；不是 TRQuant 投资结论。TRQuant 缺失项显示为 UNKNOWN，不做填补。</p><div className="label">机会雷达</div><div className="rank">${ranked.slice(0,10).map((d,i)=>html`<button key=${d.t} className=${d.t===sel?"sel":""} onClick=${()=>setSel(d.t)}><i>${String(i+1).padStart(2,"0")}</i><span><b>${d.t} · ${d.n}</b><small>${d.s} · YTD ${fmt(d.ytd)}% · Vol ${fmt(d.hv*100)}%</small></span><strong className=${d.d>=0?"up":"down"}>${rankValue(d)}</strong></button>`)}</div></aside>
  <main className="panel stage"><div className="toolbar"><div className="pill"><b>${mode==="live"?"高度 = 实时热度":mode==="trq"?"高度 = TRQuant Opportunity":"地形高度 = 5Y EPS 增长"}</b></div><div className="pill"><b>球大小 = 90D $Volume</b></div></div><${ThreeMap} key=${`${mode}-${resetKey}`} items=${filtered} mode=${mode} selected=${sel} onSelect=${setSel} showLabels=${labels} showRelations=${relations} autoRotate=${auto} onSector=${s=>setSector(s)}/><div className="legend"><span><b>颜色</b> = 固定板块身份</span><span><b>Live</b> = IBKR REALTIME</span><span><b>TRQuant</b> = 仅机器可验证字段</span><span><b>行业</b> = Damodaran 2026-01 · 94 行业</span></div></main>
  <aside className="panel detail"><div className="detail-head"><div className="logo">${chosen.t.slice(0,4)}</div><div><h2>${chosen.t}</h2><div className="company">${chosen.n} · ${chosen.s}</div></div><div className="source-badge">IBKR REALTIME</div></div><div className="price"><b>$${fmt(chosen.p,2)}</b><span className=${chosen.d>=0?"up":"down"}>${chosen.d>=0?"+":""}${fmt(chosen.d)}% today</span></div><div className="cards"><div className="card"><span>YTD</span><b className=${chosen.ytd>=0?"up":"down"}>${chosen.ytd>=0?"+":""}${fmt(chosen.ytd)}%</b></div><div className="card"><span>年化历史波动</span><b>${fmt(chosen.hv*100)}%</b></div><div className="card"><span>90D 美元成交额</span><b>${money(chosen.adv)}</b></div></div>
   <div className="block"><div className="block-title"><span>实时扫描</span><span className="badge good">研究注意力</span></div><${Bars} d=${chosen}/></div>
   <div className="block"><div className="block-title"><span>TRQuant evidence</span><span className=${"badge "+(chosen.trq?(chosen.trq.integrity==="STALE"?"warn":"good"):"bad")}>${chosen.trq?chosen.trq.integrity:"UNKNOWN"}</span></div>${chosen.trq?html`<div><div className="cards"><div className="card"><span>Opportunity</span><b>${fmt(chosen.trq.opp,0)}</b></div><div className="card"><span>Risk score</span><b>${fmt(chosen.trq.risk,0)}</b></div><div className="card"><span>Evidence score</span><b>${chosen.evidence}</b></div></div><div className="source" style=${{marginTop:8}}>Fundamental ${fmt(chosen.trq.fund,0)} · PE(TTM) ${fmt(chosen.trq.peTtm,2)} · Forward PE ${fmt(chosen.trq.peFwd,2)} · gaps ${chosen.trq.gaps} · conflicts ${chosen.trq.conflicts}</div><div className="callout">${chosen.trq.refresh?.length?`下一步：refresh ${chosen.trq.refresh.join(", ")} 后重新读取 Security Packet；未解决前不升级为交易证据。`:"当前 packet 仍有结构化缺口；保持 WATCH / UNKNOWN。"}</div></div>`:html`<div className="empty">当前 canonical Security Packet 对该标的没有可用结构化数据。地图保留实时市场层，但不会推断 fundamentals / valuation / TRQuant opportunity。</div>`}</div>
   <div className="block"><div className="block-title"><span>行业背景</span><span className="badge">${ss.industries} industries</span></div><div className="cards"><div className="card"><span>Forward PE 中位</span><b>${fmt(ss.forwardPE,2)}×</b></div><div className="card"><span>5Y EPS 增长</span><b>${fmt(ss.growth5Y,2)}%</b></div><div className="card"><span>PEG / 亏损率</span><b>${fmt(ss.peg,2)} / ${fmt(ss.lossRate,0)}%</b></div></div><div className="source" style=${{marginTop:8}}>Damodaran 2026-01 横截面；全市场 ${benchmark.industries} 行业 / ${benchmark.firms} 家公司。板块值为所属行业中位数。</div></div>
   <div className="block"><div className="block-title">数据与边界</div><div className="source">IBKR：实时价格、当日涨跌、YTD、历史波动、90D 美元成交额。TRQuant：Security Packet 的结构化 evidence；UNKNOWN 保留。Market Risk 当前不可用，因此本页面不输出仓位、下单或资本授权。</div></div>
  </aside>
 </div></div>`
}
createRoot(document.getElementById("root")).render(html`<${App}/>`);
