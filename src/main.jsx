import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import * as THREE from 'three';

const AGENTS=[
['散户/注意力资金','新闻、涨跌、社交热度','追涨杀跌、短期期权、集中交易'],
['主动基本面基金','盈利、估值、产业变化','主动建仓、减仓、行业比较'],
['被动ETF/指数','申赎、权重、再平衡','机械买卖成分股'],
['CTA/趋势/动量量化','收益、突破、波动','同向加减仓、风险缩放'],
['统计套利/均值回复','价差、残差、协整','相对价值反向交易'],
['波控/风险平价','波动、相关性、风险预算','波动升高减仓'],
['期权Dealer','Delta/Gamma/Vanna/Charm','动态对冲现货与期货'],
['做市商/HFT','盘口、库存、短期订单流','提供/撤回流动性'],
['执行算法/Metaorder','VWAP/TWAP/POV','把母单拆成持续子单'],
['强制与企业资金','保证金、赎回、回购、发行','被迫或计划性交易']
];

const STATES=[
['A','同步度','Aₜ = |Σᵢωᵢsᵢ,ₜ| / Σᵢωᵢ','市场方向是否越来越一致'],
['C','耦合度','Cₜ = λ₁(Σₜ) / tr(Σₜ)','共同市场模态占比'],
['Q','拥挤度','Qₜ ≈ HHI(exposure, flow, ownership)','资本是否挤在相似暴露'],
['L','流动性脆弱','Δpₜ = βₜ·OFIₜ + εₜ','同样订单流造成多大冲击'],
['E','内生性','Eₜ = ρ(Kₜ)','交易是否主要由过去事件继续激发'],
['P','传播度','Pₜ = ρ(Bₜ)','冲击是否跨行业/主题/供应链扩散']
];

const SC={
calm:{name:'分散 / 平静',vals:[.18,.28,.24,.20,.27,.18],k:.48,align:.03,coh:.008,noise:.018,speed:.035},
trend:{name:'趋势共振',vals:[.76,.58,.56,.34,.66,.78],k:.92,align:.13,coh:.020,noise:.004,speed:.047},
sector:{name:'板块扩散',vals:[.60,.46,.49,.31,.55,.84],k:.86,align:.10,coh:.030,noise:.006,speed:.043},
stress:{name:'流动性踩踏',vals:[.86,.89,.80,.93,.92,.90],k:1.11,align:.08,coh:.036,noise:.015,speed:.065}
};

function Flock({mode,onPhi}){
 const host=useRef(null),state=useRef(mode); state.current=mode;
 useEffect(()=>{
  const el=host.current,scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(46,1,.1,100);camera.position.z=22;
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));el.appendChild(renderer.domElement);
  const N=260,positions=[],velocities=[],up=new THREE.Vector3(0,1,0),dir=new THREE.Vector3(),mean=new THREE.Vector3(),dummy=new THREE.Object3D();
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array([0,.34,0,-.25,-.13,0,.25,-.13,0,0,.34,0,-.09,-.27,0,.09,-.27,0]),3));
  const mat=new THREE.MeshBasicMaterial({color:0xe5f8ff,transparent:true,opacity:.76,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});
  const mesh=new THREE.InstancedMesh(geo,mat,N);scene.add(mesh);
  let seed=271828;const rand=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  for(let i=0;i<N;i++){positions.push(new THREE.Vector3((rand()*2-1)*15,(rand()*2-1)*6,(rand()*2-1)*1.4));const a=rand()*Math.PI*2;velocities.push(new THREE.Vector3(Math.cos(a),Math.sin(a)*.55,(rand()-.5)*.18).normalize())}
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};resize();const ro=new ResizeObserver(resize);ro.observe(el);
  let raf=0,last=0;
  const loop=t=>{raf=requestAnimationFrame(loop);const cfg=SC[state.current],dt=Math.min((t-last||16)/16.67,1.5);last=t;mean.set(0,0,0);
   for(let i=0;i<N;i++){const p=positions[i],v=velocities[i];let ax=0,ay=0,cx=0,cy=0,n=0;
    for(let s=1;s<=9;s++){const j=(i+s*29)%N,q=positions[j],d=p.distanceToSquared(q);if(d<18){n++;ax+=velocities[j].x;ay+=velocities[j].y;cx+=q.x;cy+=q.y}}
    if(n){v.x+=(ax/n-v.x)*cfg.align*dt;v.y+=(ay/n-v.y)*cfg.align*dt;v.x+=(cx/n-p.x)*cfg.coh*dt;v.y+=(cy/n-p.y)*cfg.coh*dt}
    v.x+=(Math.random()-.5)*cfg.noise;v.y+=(Math.random()-.5)*cfg.noise;v.normalize();p.addScaledVector(v,cfg.speed*dt);
    if(Math.abs(p.x)>16)v.x*=-1;if(Math.abs(p.y)>6.6)v.y*=-1;if(Math.abs(p.z)>1.6)v.z*=-1;
    dir.copy(v).normalize();mean.add(dir);dummy.position.copy(p);dummy.quaternion.setFromUnitVectors(up,dir);dummy.scale.setScalar(.78);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)
   }
   mesh.instanceMatrix.needsUpdate=true;if(Math.floor(t/250)!==Math.floor((t-16)/250))onPhi(mean.length()/N);renderer.render(scene,camera)
  };loop(0);
  return()=>{cancelAnimationFrame(raf);ro.disconnect();renderer.dispose();el.replaceChildren()}
 },[]);
 return <div className="flock" ref={host}/>;
}

function App(){
 const [mode,setMode]=useState('trend'),[phi,setPhi]=useState(0);const s=SC[mode];
 return <div>
  <section className="hero">
   <Flock mode={mode} onPhi={setPhi}/><div className="veil"/>
   <header><b>TRQUANT · MARKET EMERGENCE LAB</b><span>V2 · RESEARCH PROTOTYPE</span></header>
   <div className="heroGrid">
    <div className="intro">
     <div className="kicker">FROM MANY AGENTS TO A FEW ORDER PARAMETERS</div>
     <h1>把复杂市场，压缩成几个可研究的状态量</h1>
     <p>股市中的“个体”是所有能产生订单流的决策单元：<strong>散户、基金、ETF、CTA、量化、做市商、HFT、期权Dealer、执行算法、强制资金与企业资金</strong>。不逐个模拟，而是从它们留下的市场足迹中反推出集体状态。</p>
     <div className="buttons">{Object.entries(SC).map(([k,v])=><button key={k} className={mode===k?'active':''} onClick={()=>setMode(k)}>{v.name}</button>)}</div>
     <div className="formula">Zₜ = (Aₜ,Cₜ,Qₜ,Lₜ,Eₜ,Pₜ)<br/>Zₜ₊₁ = F(Zₜ,uₜ)+εₜ</div>
    </div>
    <aside className="panel"><div className="panelHead"><h2>市场压缩状态 Zₜ</h2><span>{s.name}</span></div><p className="warn">示意值，不是实时市场数据；真实版本必须按 PIT 数据计算。</p>
     {STATES.map((x,i)=><div className="meter" key={x[0]}><label><b>{x[0]} · {x[1]}</b><small>{x[3]}</small></label><div className="bar"><i style={{width:(s.vals[i]*100)+'%'}}/></div><em>{s.vals[i].toFixed(2)}</em></div>)}
     <div className="critical"><span>整体临界性 κ = ρ(Jₜ)</span><b>{s.k.toFixed(2)}</b></div>
    </aside>
   </div><div className="phi">背景鸟群 Φ = <b>{phi.toFixed(3)}</b> · 仅作“局部规则 → 整体秩序”的视觉类比</div>
  </section>

  <main>
   <section><div className="sectionHead"><span>01 · AGENT ECOLOGY</span><div><h2>先定义“谁在市场里”</h2><p>按反应函数分类，而不是按机构名称分类。一个大型机构内部往往同时存在多个“策略物种”。</p></div></div>
    <div className="agents">{AGENTS.map((a,i)=><article key={a[0]}><small>{String(i+1).padStart(2,'0')}</small><h3>{a[0]}</h3><b>触发</b><p>{a[1]}</p><b>动作</b><p>{a[2]}</p></article>)}</div>
   </section>

   <section><div className="sectionHead"><span>02 · ORDER PARAMETERS</span><div><h2>最小可操作状态向量</h2><p>六个量不是新的“统一金融定律”，而是把成熟理论中的可观测结构组织成可校准、可回测的市场状态压缩器。</p></div></div>
    <div className="states">{STATES.map(x=><article key={x[0]}><i>{x[0]}</i><h3>{x[1]}</h3><code>{x[2]}</code><p>{x[3]}</p></article>)}</div>
   </section>

   <section><div className="sectionHead"><span>03 · DYNAMICS</span><div><h2>真正重要的是闭环</h2><p>行为改变订单流，订单流改变价格，价格再改变下一轮行为。</p></div></div>
    <div className="mathGrid"><article><h3>市场闭环</h3><code>Qₜ = Σₖ wₖ,ₜ fₖ(Xₜ)</code><code>ΔPₜ = Λₜ(Qₜ,depthₜ,inventoryₜ)+εₜ</code><code>Zₜ₊₁ = F(Zₜ,uₜ)+εₜ</code></article><article><h3>临界性</h3><code>δZₜ₊₁ = JₜδZₜ+Bₜuₜ+εₜ</code><code>κₜ = ρ(Jₜ)</code><p>κ≪1：扰动衰减；κ≈1：反馈更持久；κ&gt;1：局部模型提示放大，但会受仓位、流动性和风控等非线性约束。</p></article></div>
   </section>

   <section><div className="sectionHead"><span>04 · BUILD ORDER</span><div><h2>真正该做的研究顺序</h2><p>先做小而硬的状态压缩器，不直接造巨大的全市场 Agent 仿真。</p></div></div>
    <div className="road"><article><b>PHASE A · NOW</b><h3>核心 3+1</h3><p>A 同步度 · C 耦合度 · P 传播度 → R 市场状态</p></article><article><b>PHASE B</b><h3>补交易机制</h3><p>L 流动性脆弱度 · Q 拥挤度 · PIT 事件路径</p></article><article><b>PHASE C</b><h3>高频内生性</h3><p>E Hawkes · Jₜ · κₜ；样本外有增量后才进入资本决策层</p></article></div>
    <div className="contract"><b>验证合同：</b>冻结定义、available_at 与阈值，再按 1W→1M→3M→6M→1Y… 做成功、失败和匹配对照验证；不因结果不好临时调参制造 PASS。</div>
   </section>
  </main>
  <footer>Market Emergence Lab V2 · 鸟群只做背景类比；金融状态必须由真实市场数据验证。</footer>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
