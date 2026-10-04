import {agentSignal,alignmentRatio,normalizedConcentration,createSeededRandom,applyInformationShockToFairValue} from './model-rules.mjs';
import {runCase01} from './case01-engine.mjs';
import {deriveCase01RealEvidence} from './case01-evidence.mjs';

(() => {
'use strict';
const $=id=>document.getElementById(id),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,visualRand=(a,b)=>a+Math.random()*(b-a),sign0=v=>v>0?1:v<0?-1:0;
const DEFAULT_SIM_SEED=20261003,FIXED_SIM_DT=1/60;let simRandom=createSeededRandom(DEFAULT_SIM_SEED);const simRand=(a,b)=>a+simRandom()*(b-a);
const COLORS={retail:'#e4b362',fundamental:'#5a9fd0',trend:'#57d0c9',statarb:'#5eb989',dealer:'#d97368',hft:'#d8edf4'};
const TYPE_META={retail:{label:'散户 / 注意力资金',rule:'注意力 + 短期动量 + 随机扰动',capital:[.35,.85],speed:1.18},fundamental:{label:'主动基本面基金',rule:'估值偏离 + 信息冲击',capital:[1.15,2.1],speed:.58},trend:{label:'趋势策略',rule:'趋势强度 + 波动缩放',capital:[.75,1.45],speed:.90},statarb:{label:'统计套利',rule:'残差偏离 + 均值回复',capital:[.55,1.1],speed:1.05},dealer:{label:'做市 / 库存对冲',rule:'短期价格变化 + 库存约束',capital:[.8,1.55],speed:.78},hft:{label:'高频做市商',rule:'短期价格变化 + 库存约束',capital:[.25,.65],speed:1.45}};
const MODE={balanced:{trendGain:1,retailGain:1,meanRevGain:1,dealerGain:1,targetBias:0,liquidity:1,network:1},trend:{trendGain:1.65,retailGain:1.15,meanRevGain:.78,dealerGain:.82,targetBias:.12,liquidity:.92,network:1.16},crowded:{trendGain:1.35,retailGain:1.35,meanRevGain:.70,dealerGain:.78,targetBias:.85,liquidity:.82,network:1.20},stress:{trendGain:1.18,retailGain:1.12,meanRevGain:.58,dealerGain:.48,targetBias:.35,liquidity:.38,network:1.48}};
const THEMES={
  '宽基 / 成长':['SPY','QQQ','IWM'],
  'AI / 半导体':['NVDA','AMD','AVGO','MU','AMAT','LRCX'],
  '光通信 / AI 基础设施':['COHR','LITE','VRT']
};
const THEME_BY_ASSET={};Object.entries(THEMES).forEach(([name,ids])=>ids.forEach(id=>THEME_BY_ASSET[id]=name));
const ATTR_LABELS={flow:'订单流冲击',information:'信息冲击',attention:'注意力跟随',network:'网络反馈',noise:'随机扰动'};
const HISTORY_LIMIT=240;
let analyticsHistory={time:[],byAsset:{}},analyticsNextMs=0,priceChart=null,crossChart=null,attributionChart=null;

const ASSETS=[['SPY','宽基市场',.50,.50,1],['QQQ','成长 / 科技',.50,.26,.88],['NVDA','AI 算力',.29,.28,.70],['AMD','AI 算力',.17,.42,.62],['AVGO','半导体 / 网络',.31,.52,.70],['MU','存储',.24,.70,.60],['AMAT','半导体设备',.43,.74,.66],['LRCX','半导体设备',.59,.72,.63],['COHR','光通信',.72,.58,.48],['LITE','光通信',.82,.42,.44],['VRT','电力 / 散热',.70,.25,.52],['IWM','小盘股',.80,.75,.82]];
const EDGE_DEF=[['SPY','QQQ',.46],['SPY','IWM',.34],['SPY','AVGO',.20],['QQQ','NVDA',.55],['QQQ','AMD',.36],['QQQ','AVGO',.38],['NVDA','AMD',.42],['NVDA','AVGO',.40],['NVDA','VRT',.30],['NVDA','COHR',.28],['AVGO','COHR',.32],['COHR','LITE',.54],['COHR','VRT',.22],['MU','AMAT',.30],['MU','LRCX',.28],['AMAT','LRCX',.52],['AMD','MU',.18],['QQQ','AMAT',.20],['QQQ','LRCX',.20],['IWM','VRT',.10]];
const COUNTS={retail:28,fundamental:18,trend:20,statarb:18,dealer:14,hft:26},HOT=new Set(['NVDA','COHR','VRT','LITE']);
const requestedMode=new URLSearchParams(location.search).get('mode');
const canvas=$('marketCanvas'),ctx=canvas?.getContext('2d'),hitLayer=$('assetHitLayer');let W=0,H=0,DPR=1,assets=[],edges=[],agents=[],pulses=[],metaorders=[],mode=MODE[requestedMode]?requestedMode:'balanced',paused=false,noise=Number($('noiseSlider')?.value||.35),network=Number($('networkSlider')?.value||.55),liquidity=Number($('liquiditySlider')?.value||.70),metrics={alignment:0,activation:0,flowConcentration:0},events={user:0,ambient:0,network:0},lastEvent='—',last=performance.now(),frameNo=0,simAccumulator=0,simTimeMs=0,nextShock=0,inspectorKey='',inspectorNext=0,selectedAssetId='NVDA';
const pointer={x:-9999,y:-9999,inside:false,down:false,startX:0,startY:0,lastX:0,lastY:0};
function makeAssets(){assets=ASSETS.map((a,i)=>{const start=100+i*1.7;return{id:a[0],sector:a[1],nx:a[2],ny:a[3],baseLiquidity:a[4],basePrice:start,x:0,y:0,price:start,fair:start,ret:0,prevRet:0,momentum:0,volatility:.02,infoShock:0,attention:0,flow:0,lastFlow:0,activation:0,propagated:0,flash:0,components:{flow:0,information:0,attention:0,network:0,noise:0},attrEma:{flow:0,information:0,attention:0,network:0,noise:0}}});const map=Object.fromEntries(assets.map((a,i)=>[a.id,i]));edges=EDGE_DEF.map(e=>({a:map[e[0]],b:map[e[1]],w:e[2],pulse:0,active:false}));}
function showAssetInspector(a){const card=$('inspectorCard');if(!card||!a)return;selectedAssetId=a.id;const label=$('selectedAssetLabel');if(label)label.textContent=a.id;const pick=$('analyticsAssetSelect');if(pick&&pick.value!==a.id)pick.value=a.id;inspectorKey='a'+a.id;card.classList.remove('empty');card.innerHTML='<b style="color:#bcecf7">'+a.id+' · '+a.sector+'</b><p>这是模型中的资产节点，不代表实时价格。不同参与者的交易行为先汇聚到该资产，再通过资产关系网络影响其他节点。</p><dl><dt>相对价格</dt><dd>'+a.price.toFixed(2)+'</dd><dt>短时收益</dt><dd>'+(a.ret*100).toFixed(3)+'%</dd><dt>订单流</dt><dd>'+a.flow.toFixed(2)+'</dd><dt>注意力</dt><dd>'+a.attention.toFixed(2)+'</dd><dt>模型激活</dt><dd>'+a.activation.toFixed(2)+'</dd></dl>';renderAnalytics(true)}
function buildHitboxes(){if(!hitLayer)return;hitLayer.replaceChildren();assets.forEach(a=>{const b=document.createElement('button');b.type='button';b.className='asset-hitbox';b.dataset.asset=a.id;b.style.left=(a.nx*100)+'%';b.style.top=(a.ny*100)+'%';b.setAttribute('aria-label',a.id+' '+a.sector+'：点击注入正向冲击，Shift+点击注入负向冲击');b.addEventListener('pointerenter',()=>{a.attention=clamp(a.attention+.25,0,1.4);showAssetInspector(a)});b.addEventListener('focus',()=>showAssetInspector(a));b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();shock(a,e.shiftKey?-1:1,1,'user');showAssetInspector(a)});hitLayer.appendChild(b)})}
function getAsset(id){return assets.find(a=>a.id===id)||assets[0]} function assetIndex(id){return assets.findIndex(a=>a.id===id)}
function pickAsset(preferHot=false){if(preferHot&&simRandom()<.65){const c=assets.filter(a=>HOT.has(a.id));return c[(simRandom()*c.length)|0]}return assets[(simRandom()*assets.length)|0]}
function makeAgents(){agents=[];let id=0;Object.entries(COUNTS).forEach(([type,n])=>{const m=TYPE_META[type];for(let i=0;i<n;i++){const t=pickAsset(false),cap=simRand(m.capital[0],m.capital[1]);agents.push({id:id++,type,capital:cap,target:t.id,order:0,inventory:simRand(-.2,.2),activity:0,x:t.x+visualRand(-70,70),y:t.y+visualRand(-60,60),vx:0,vy:0,angle:visualRand(0,Math.PI*2),orbit:visualRand(28,72),retargetAt:simRand(20,120),trail:[]})}})}
function resize(){if(!canvas||!ctx)return;const r=canvas.getBoundingClientRect();W=Math.max(320,r.width);H=Math.max(420,r.height);DPR=Math.min(devicePixelRatio||1,1.6);canvas.width=Math.round(W*DPR);canvas.height=Math.round(H*DPR);ctx.setTransform(DPR,0,0,DPR,0,0);assets.forEach(a=>{a.x=a.nx*W;a.y=a.ny*H});agents.forEach(a=>{const t=getAsset(a.target);a.x=clamp(t.x+visualRand(-60,60),20,W-20);a.y=clamp(t.y+visualRand(-55,55),30,H-30)})}
function signal(agent,a){const cfg=MODE[mode],eps=(simRandom()-.5)*noise*.16;return agentSignal(agent.type,{cfg,eps,fair:a.fair,price:a.price,momentum:a.momentum,ret:a.ret,volatility:a.volatility,infoShock:a.infoShock,attention:a.attention,inventory:agent.inventory,lastFlow:a.lastFlow})}
function retarget(){const cfg=MODE[mode];agents.forEach(g=>{if(--g.retargetAt>0)return;g.retargetAt=simRand(42,125)/TYPE_META[g.type].speed;let best=getAsset(g.target),score=-1e9;assets.forEach(a=>{let s=Math.abs(signal(g,a));if(mode==='crowded'&&HOT.has(a.id))s+=cfg.targetBias*g.capital;if(g.type==='fundamental')s+=Math.abs((a.fair-a.price)/a.fair)*.7;if(g.type==='retail')s+=a.attention*.45;s+=simRandom()*.08;if(s>score){best=a;score=s}});g.target=best.id})}
function resetSim(hard=false){simRandom=createSeededRandom(DEFAULT_SIM_SEED);simAccumulator=0;simTimeMs=0;if(hard){makeAssets();resize();makeAgents()}assets.forEach((a,i)=>{const start=100+i*1.7;a.basePrice=start;a.price=a.fair=start;a.ret=a.prevRet=a.momentum=a.infoShock=a.attention=a.flow=a.lastFlow=0;a.volatility=.02;a.activation=a.propagated=a.flash=0;a.components={flow:0,information:0,attention:0,network:0,noise:0};a.attrEma={flow:0,information:0,attention:0,network:0,noise:0}});const prefer=mode==='crowded';agents.forEach(g=>{const t=pickAsset(prefer);g.target=t.id;g.order=0;g.inventory=simRand(-.15,.15);g.activity=0;g.retargetAt=simRand(42,125)/TYPE_META[g.type].speed;g.x=t.x+visualRand(-70,70);g.y=t.y+visualRand(-60,60);g.vx=g.vy=0;g.trail=[]});pulses=[];metaorders=[];metrics={alignment:0,activation:0,flowConcentration:0};events={user:0,ambient:0,network:0};lastEvent='—';edges.forEach(e=>e.active=false);nextShock=simRand(2600,5200);resetAnalytics()}
function applyMode(m){mode=m;document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===m));resetSim(false)}
function updatePositions(dt){for(let i=0;i<agents.length;i++){const g=agents[i],t=getAsset(g.target),m=TYPE_META[g.type];g.angle+=.008*m.speed*dt*60*(g.id%2?1:-1);const orbit=g.orbit*(1+.2*Math.sin(g.id*.73)),tx=t.x+Math.cos(g.angle)*orbit,ty=t.y+Math.sin(g.angle)*orbit*.70;let fx=(tx-g.x)*.012*m.speed,fy=(ty-g.y)*.012*m.speed;for(let j=0;j<agents.length;j++){if(i===j)continue;const b=agents[j],dx=g.x-b.x,dy=g.y-b.y,d2=dx*dx+dy*dy,minD=13+(g.capital+b.capital)*2.5;if(d2<minD*minD&&d2>.01){const d=Math.sqrt(d2),push=(minD-d)/minD*.28;fx+=dx/d*push;fy+=dy/d*push}}if(pointer.inside){const dx=g.x-pointer.x,dy=g.y-pointer.y,d=Math.hypot(dx,dy);if(d<110&&d>1){const local=(1-d/110)*.06;if(g.type==='retail'||g.type==='trend'){fx-=dx/d*local;fy-=dy/d*local}else{fx+=dx/d*local*.45;fy+=dy/d*local*.45}}}g.vx=(g.vx+fx)*.88;g.vy=(g.vy+fy)*.88;const maxV=2.3*m.speed,sp=Math.hypot(g.vx,g.vy)||1;if(sp>maxV){g.vx=g.vx/sp*maxV;g.vy=g.vy/sp*maxV}g.x=clamp(g.x+g.vx*dt*60,10,W-10);g.y=clamp(g.y+g.vy*dt*60,30,H-30);if(g.id%5===0){g.trail.push([g.x,g.y]);if(g.trail.length>10)g.trail.shift()}}}
function step(dt){const cfg=MODE[mode];assets.forEach(a=>{a.lastFlow=a.flow;a.flow=0;a.prevRet=a.ret;a.infoShock*=Math.pow(.965,dt*60);a.attention*=Math.pow(.91,dt*60);a.flash*=Math.pow(.86,dt*60);a.propagated*=Math.pow(.93,dt*60)});retarget();let signed=0,abs=0,active=0;const flowByAsset=new Array(assets.length).fill(0);agents.forEach(g=>{const a=getAsset(g.target),want=signal(g,a),reaction=g.type==='fundamental'?.035:g.type==='hft'?.18:.085;g.order=lerp(g.order,want,clamp(reaction*dt*60,0,1));g.inventory=clamp(g.inventory+g.order*.0025*dt*60,-1.5,1.5);g.activity=lerp(g.activity,clamp(Math.abs(g.order),0,1),.13);a.flow+=g.order*g.capital;signed+=g.order*g.capital;abs+=Math.abs(g.order*g.capital);flowByAsset[assetIndex(a.id)]+=Math.abs(g.order*g.capital);if(Math.abs(g.order)>.22)active++});metaorders.forEach(m=>{const a=getAsset(m.asset),q=m.sign*m.strength*5.8;a.flow+=q;signed+=q;abs+=Math.abs(q);flowByAsset[assetIndex(a.id)]+=Math.abs(q);a.attention=Math.max(a.attention,.45);m.remaining-=dt*1000});metaorders=metaorders.filter(m=>m.remaining>0);const prop=new Array(assets.length).fill(0);edges.forEach(e=>{const a=assets[e.a],b=assets[e.b],w=e.w*network*cfg.network,ab=a.prevRet*w,ba=b.prevRet*w;prop[e.b]+=ab;prop[e.a]+=ba;const strength=Math.max(Math.abs(ab),Math.abs(ba));e.pulse=Math.max(e.pulse*.90,clamp(strength*160,0,1));if(strength>.00022&&!e.active){events.network++;e.active=true}else if(strength<.00008)e.active=false});const liqMul=clamp(liquidity*cfg.liquidity,.08,1.4);assets.forEach((a,i)=>{const liq=clamp(a.baseLiquidity*liqMul,.08,1.4),impact=a.flow*.000085/liq,info=a.infoShock*.00055,att=sign0(a.flow)*a.attention*.00005,exoNoise=(simRandom()-.5)*noise*.00012;const comp={flow:impact,information:info,attention:att,network:prop[i],noise:exoNoise},raw=impact+info+att+prop[i]+exoNoise;a.ret=clamp(raw,-.018,.018);const scale=Math.abs(raw)>1e-12?a.ret/raw:1;Object.keys(comp).forEach(k=>{comp[k]*=scale;a.attrEma[k]=lerp(a.attrEma[k]||0,comp[k],.075)});a.components=comp;a.price*=1+a.ret;a.momentum=lerp(a.momentum,a.ret,.065);a.volatility=lerp(a.volatility,Math.abs(a.ret),.045);a.propagated=Math.max(a.propagated,clamp(Math.abs(prop[i])*160,0,1));a.activation=clamp(Math.max(a.activation*.92,Math.abs(a.ret)*85+Math.abs(a.infoShock)*.35+a.attention*.25+a.propagated*.55),0,1);a.flash=Math.max(a.flash,clamp(Math.abs(a.ret)*75,0,1))});recordAnalytics();metrics.alignment=alignmentRatio(signed,abs);metrics.flowConcentration=normalizedConcentration(flowByAsset);metrics.activation=clamp(assets.reduce((s,a)=>s+a.activation,0)/assets.length,0,1);updatePositions(dt);updateUI(active)}

function resetAnalytics(){analyticsHistory={time:[0],byAsset:{}};assets.forEach(a=>analyticsHistory.byAsset[a.id]=[100]);analyticsNextMs=0;renderAnalytics(true)}
function normalizedPrice(a){return a&&a.basePrice?100*a.price/a.basePrice:100}
function themeNameFor(id){return THEME_BY_ASSET[id]||'全市场'}
function themeIdsFor(id){const name=themeNameFor(id);return THEMES[name]||assets.map(a=>a.id)}
function themeLevel(id){const ids=themeIdsFor(id),vals=ids.map(x=>normalizedPrice(getAsset(x)));return vals.reduce((s,v)=>s+v,0)/Math.max(vals.length,1)}
function recordAnalytics(){if(simTimeMs<analyticsNextMs)return;analyticsNextMs=simTimeMs+250;analyticsHistory.time.push(simTimeMs/1000);assets.forEach(a=>{const arr=analyticsHistory.byAsset[a.id]||(analyticsHistory.byAsset[a.id]=[]);arr.push(normalizedPrice(a));if(arr.length>HISTORY_LIMIT)arr.shift()});if(analyticsHistory.time.length>HISTORY_LIMIT)analyticsHistory.time.shift();renderAnalytics(false)}
function priceSeriesFor(id){return(analyticsHistory.byAsset[id]||[]).map((v,i)=>[analyticsHistory.time[i]??0,v])}
function themeSeriesFor(id){const ids=themeIdsFor(id),len=analyticsHistory.time.length,out=[];for(let i=0;i<len;i++){let sum=0,n=0;ids.forEach(x=>{const v=(analyticsHistory.byAsset[x]||[])[i];if(Number.isFinite(v)){sum+=v;n++}});out.push([analyticsHistory.time[i]??0,n?sum/n:100])}return out}
function initAnalytics(){const pick=$('analyticsAssetSelect');if(pick&&!pick.options.length){assets.forEach(a=>{const o=document.createElement('option');o.value=a.id;o.textContent=a.id+' · '+a.sector;pick.appendChild(o)});pick.value=selectedAssetId;pick.addEventListener('change',()=>showAssetInspector(getAsset(pick.value)))}if(!window.echarts){const s=$('analyticsStatus');if(s)s.textContent='价格与归因图表未加载，市场模拟仍可正常使用。';return}if(!priceChart)priceChart=window.echarts.init($('marketPriceChart'));if(!crossChart){crossChart=window.echarts.init($('marketCrossChart'));crossChart.on('click',p=>{const a=getAsset(p.name);if(a)showAssetInspector(a)})}if(!attributionChart)attributionChart=window.echarts.init($('attributionChart'));window.addEventListener('resize',()=>{priceChart?.resize();crossChart?.resize();attributionChart?.resize()},{passive:true});renderAnalytics(true)}
function renderAnalytics(force=false){const a=getAsset(selectedAssetId);if(!a)return;const pick=$('analyticsAssetSelect');if(pick&&pick.value!==a.id)pick.value=a.id;const market=getAsset('SPY'),marketNow=normalizedPrice(market)-100,themeName=themeNameFor(a.id),themeNow=themeLevel(a.id)-100,stockNow=normalizedPrice(a)-100;const set=(id,v)=>{const e=$(id);if(e)e.textContent=v};set('analyticsMarket',(marketNow>=0?'+':'')+marketNow.toFixed(2)+'%');set('analyticsTheme',(themeNow>=0?'+':'')+themeNow.toFixed(2)+'%');set('analyticsStock',(stockNow>=0?'+':'')+stockNow.toFixed(2)+'%');set('analyticsThemeName',themeName);set('analyticsStockName',a.id);const drivers=Object.entries(a.attrEma||{}).sort((x,y)=>Math.abs(y[1])-Math.abs(x[1])),lead=drivers[0]||['flow',0],second=drivers[1]||['network',0];let layer='个股与市场大致同步';if(stockNow-themeNow>.25&&themeNow-marketNow>.12)layer='个股领先主题，主题同时强于市场';else if(stockNow-themeNow>.25)layer='个股明显强于所属主题';else if(themeNow-marketNow>.20)layer='主题强于整体市场';else if(stockNow<themeNow-.25)layer='个股弱于所属主题';const leadBp=lead[1]*10000,secondBp=second[1]*10000;set('attributionHeadline',a.id+'：'+layer);set('attributionSummary','近期模型变化中，'+ATTR_LABELS[lead[0]]+'贡献最大（'+(leadBp>=0?'+':'')+leadBp.toFixed(2)+' bp/步），其次是'+ATTR_LABELS[second[0]]+'（'+(secondBp>=0?'+':'')+secondBp.toFixed(2)+' bp/步）。这是模型内部归因，用来解释当前模拟路径，不代表真实市场因果。');if(!window.echarts||!priceChart||!crossChart||!attributionChart)return;const axis={axisLine:{lineStyle:{color:'rgba(140,190,205,.22)'}},axisLabel:{color:'#718f9c',fontSize:9},splitLine:{lineStyle:{color:'rgba(120,170,188,.08)'}}};priceChart.setOption({animation:false,backgroundColor:'transparent',tooltip:{trigger:'axis'},legend:{top:2,textStyle:{color:'#8ea8b3',fontSize:10}},grid:{left:44,right:20,top:38,bottom:32},xAxis:{type:'value',name:'秒',...axis},yAxis:{type:'value',name:'起点=100',scale:true,...axis},series:[{name:'整体市场 · SPY',type:'line',showSymbol:false,smooth:.18,lineStyle:{width:2,color:'#93dced'},data:priceSeriesFor('SPY')},{name:'主题 · '+themeName,type:'line',showSymbol:false,smooth:.18,lineStyle:{width:2,color:'#ddb06a'},data:themeSeriesFor(a.id)},{name:'个股 · '+a.id,type:'line',showSymbol:false,smooth:.18,lineStyle:{width:2.6,color:'#7ed2a9'},data:priceSeriesFor(a.id)}]},true);const cross=assets.map(x=>({name:x.id,value:normalizedPrice(x)-100,sector:x.sector})).sort((x,y)=>y.value-x.value);crossChart.setOption({animationDuration:180,tooltip:{trigger:'item',formatter:p=>p.name+' · '+p.data.sector+'<br/>'+(p.value>=0?'+':'')+Number(p.value).toFixed(2)+'%'},grid:{left:48,right:18,top:14,bottom:42},xAxis:{type:'category',data:cross.map(x=>x.name),axisLabel:{color:'#7694a1',fontSize:9,rotate:35},axisLine:{lineStyle:{color:'rgba(140,190,205,.18)'}}},yAxis:{type:'value',axisLabel:{formatter:'{value}%',color:'#7694a1',fontSize:9},splitLine:{lineStyle:{color:'rgba(120,170,188,.08)'}}},series:[{type:'bar',data:cross.map(x=>({name:x.name,value:x.value,sector:x.sector,itemStyle:{color:x.name===a.id?'#9be8ff':x.value>=0?'#3e9d83':'#a85959'}})),barMaxWidth:26}]},true);const attr=Object.keys(ATTR_LABELS).map(k=>({name:ATTR_LABELS[k],value:(a.attrEma[k]||0)*10000}));attributionChart.setOption({animationDuration:180,tooltip:{trigger:'axis',axisPointer:{type:'shadow'}},grid:{left:78,right:18,top:16,bottom:24},xAxis:{type:'value',axisLabel:{formatter:'{value} bp',color:'#7694a1',fontSize:9},splitLine:{lineStyle:{color:'rgba(120,170,188,.08)'}}},yAxis:{type:'category',data:attr.map(x=>x.name),axisLabel:{color:'#8ea8b3',fontSize:10},axisLine:{show:false}},series:[{type:'bar',data:attr.map(x=>({value:x.value,itemStyle:{color:x.value>=0?'#55b594':'#c66b68'}})),barMaxWidth:18}]},true)}

function updateUI(active){const set=(id,v)=>{const e=$(id);if(e)e.textContent=v};set('heroAlignment',metrics.alignment.toFixed(2));set('heroActivation',metrics.activation.toFixed(2));set('heroFlowConcentration',metrics.flowConcentration.toFixed(2));set('alignmentVal',metrics.alignment.toFixed(2));set('activationVal',metrics.activation.toFixed(2));set('flowConcentrationVal',metrics.flowConcentration.toFixed(2));set('activeAgents',String(active));set('affectedAssets',assets.filter(a=>a.activation>.22).length+' / '+assets.length);set('eventMix',events.user+' / '+events.ambient+' / '+events.network);set('lastEvent',lastEvent);[['alignmentBar',metrics.alignment],['activationBar',metrics.activation],['flowConcentrationBar',metrics.flowConcentration]].forEach(([id,v])=>{const e=$(id);if(e)e.style.width=(v*100).toFixed(0)+'%'})}
function nearestAsset(x,y,max=1e9){let best=null,d0=max*max;assets.forEach(a=>{const dx=a.x-x,dy=a.y-y,d=dx*dx+dy*dy;if(d<d0){d0=d;best=a}});return best}function nearestAgent(x,y,max=18){let best=null,d0=max*max;agents.forEach(a=>{const dx=a.x-x,dy=a.y-y,d=dx*dx+dy*dy;if(d<d0){d0=d;best=a}});return best}
function shock(a,sgn,str=.8,source='user'){if(!a)return;a.fair=applyInformationShockToFairValue(a.fair,sgn,str);a.infoShock=clamp(a.infoShock+sgn*.85*str,-2,2);a.attention=clamp(a.attention+.9*str,0,2);a.flash=1;pulses.push({x:a.x,y:a.y,r:10,max:95+str*55,life:1,sign:sgn,kind:'shock'});if(source==='ambient')events.ambient++;else{events.user++;nextShock=simTimeMs+simRand(3800,5600)}lastEvent=a.id+' '+(sgn>0?'正向':'负向')+'信息冲击（'+(source==='ambient'?'随机':'用户')+'）'}
function metaorder(a,sgn,str,x1,y1,x2,y2,source='user'){if(!a)return;metaorders.push({asset:a.id,sign:sgn,strength:clamp(str,.35,1.8),remaining:2600+str*900});pulses.push({x:a.x,y:a.y,r:12,max:70,life:1,sign:sgn,kind:'meta',x1,y1,x2,y2});if(source==='ambient')events.ambient++;else{events.user++;nextShock=simTimeMs+simRand(3800,5600)}lastEvent=a.id+' '+(sgn>0?'持续买入':'持续卖出')+'（'+(source==='ambient'?'随机':'用户')+'）'}
function localPoint(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*(W/r.width),y:(e.clientY-r.top)*(H/r.height)}}
if(canvas){canvas.addEventListener('pointerenter',e=>{pointer.inside=true;const p=localPoint(e);pointer.x=p.x;pointer.y=p.y});canvas.addEventListener('pointerleave',()=>pointer.inside=false);canvas.addEventListener('pointermove',e=>{const p=localPoint(e);pointer.x=p.x;pointer.y=p.y;const a=nearestAsset(p.x,p.y,135);if(a)a.attention=clamp(a.attention+.028,0,1.4);pointer.lastX=p.x;pointer.lastY=p.y});canvas.addEventListener('pointerdown',e=>{const p=localPoint(e);pointer.down=true;pointer.startX=p.x;pointer.startY=p.y;pointer.lastX=p.x;pointer.lastY=p.y;canvas.setPointerCapture?.(e.pointerId)});canvas.addEventListener('pointerup',e=>{const p=localPoint(e),dx=p.x-pointer.startX,dy=p.y-pointer.startY,d=Math.hypot(dx,dy);if(d<10){shock(nearestAsset(p.x,p.y,150)||nearestAsset(p.x,p.y),e.shiftKey?-1:1,1,'user')}else{const a=nearestAsset(pointer.startX,pointer.startY,170)||nearestAsset(pointer.startX,pointer.startY),sgn=Math.abs(dx)>Math.abs(dy)?sign0(dx):-sign0(dy);metaorder(a,sgn||1,clamp(d/150,.4,1.8),pointer.startX,pointer.startY,p.x,p.y,'user')}pointer.down=false})}
function drawGrid(){ctx.save();ctx.strokeStyle='rgba(116,178,201,.045)';ctx.lineWidth=1;for(let x=0;x<W;x+=54){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}for(let y=0;y<H;y+=54){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}ctx.restore()}
function drawEdges(){edges.forEach(e=>{const a=assets[e.a],b=assets[e.b],alpha=.07+e.w*.10+e.pulse*.24;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle='rgba(102,195,220,'+alpha+')';ctx.lineWidth=.7+e.pulse*1.4;ctx.stroke();if(e.pulse>.12){const t=(performance.now()*.00022*(.7+e.pulse))%1,x=lerp(a.x,b.x,t),y=lerp(a.y,b.y,t);ctx.beginPath();ctx.arc(x,y,1.7+e.pulse*1.7,0,Math.PI*2);ctx.fillStyle='rgba(152,235,250,'+(.25+e.pulse*.45)+')';ctx.fill()}})}
function drawAssets(){assets.forEach(a=>{const r=13+a.baseLiquidity*5;if(a.activation>.05){ctx.beginPath();ctx.arc(a.x,a.y,r+10+a.activation*18,0,Math.PI*2);ctx.strokeStyle='rgba(100,211,232,'+(.06+a.activation*.16)+')';ctx.stroke()}ctx.beginPath();ctx.arc(a.x,a.y,r,0,Math.PI*2);ctx.fillStyle=a.ret>=0?'rgba(35,91,107,'+(.74+a.flash*.15)+')':'rgba(76,42,45,'+(.70+a.flash*.18)+')';ctx.fill();ctx.strokeStyle=a.ret>=0?'rgba(133,227,245,.60)':'rgba(234,137,126,.62)';ctx.lineWidth=1.2;ctx.stroke();ctx.textAlign='center';ctx.fillStyle='#d8eef5';ctx.font='700 9px ui-monospace,Consolas,monospace';ctx.fillText(a.id,a.x,a.y+3);ctx.fillStyle='#577684';ctx.font='7px system-ui';ctx.fillText(a.sector,a.x,a.y+r+11)})}
function drawAgent(g){const c=COLORS[g.type],z=3.4+g.capital*2.4,alpha=.36+g.activity*.55;ctx.save();ctx.translate(g.x,g.y);ctx.fillStyle=c;ctx.strokeStyle=c;ctx.globalAlpha=alpha;ctx.lineWidth=1.2;if(g.type==='retail'){ctx.beginPath();ctx.arc(0,0,z,0,Math.PI*2);ctx.fill()}else if(g.type==='fundamental')ctx.fillRect(-z,-z,z*2,z*2);else if(g.type==='trend'){ctx.beginPath();ctx.moveTo(0,-z*1.25);ctx.lineTo(z,z);ctx.lineTo(-z,z);ctx.closePath();ctx.fill()}else if(g.type==='statarb'){ctx.rotate(Math.PI/4);ctx.fillRect(-z*.85,-z*.85,z*1.7,z*1.7)}else if(g.type==='dealer'){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/3*i,x=Math.cos(a)*z,y=Math.sin(a)*z;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.fill()}else{ctx.beginPath();ctx.moveTo(z*1.35,0);ctx.lineTo(-z*.8,-z*.75);ctx.lineTo(-z*.35,0);ctx.lineTo(-z*.8,z*.75);ctx.closePath();ctx.fill()}ctx.globalAlpha=.18+g.activity*.30;ctx.beginPath();ctx.arc(0,0,z+4+g.activity*5,0,Math.PI*2);ctx.stroke();ctx.restore();if(g.trail.length>1){ctx.beginPath();g.trail.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle=c+'28';ctx.lineWidth=.8;ctx.stroke()}}
function drawPointer(){if(!pointer.inside)return;const grad=ctx.createRadialGradient(pointer.x,pointer.y,0,pointer.x,pointer.y,105);grad.addColorStop(0,'rgba(103,215,236,.10)');grad.addColorStop(.5,'rgba(103,215,236,.035)');grad.addColorStop(1,'rgba(103,215,236,0)');ctx.fillStyle=grad;ctx.fillRect(pointer.x-105,pointer.y-105,210,210);ctx.beginPath();ctx.arc(pointer.x,pointer.y,12,0,Math.PI*2);ctx.strokeStyle='rgba(150,230,245,.18)';ctx.stroke();if(pointer.down){ctx.beginPath();ctx.moveTo(pointer.startX,pointer.startY);ctx.lineTo(pointer.x,pointer.y);ctx.strokeStyle='rgba(245,193,119,.42)';ctx.lineWidth=1.5;ctx.stroke()}}
function drawPulses(dt){pulses.forEach(p=>{p.life-=dt*.42;p.r=lerp(p.r,p.max,.07);if(p.kind==='shock'){ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.strokeStyle=p.sign>0?'rgba(117,225,244,'+(p.life*.45)+')':'rgba(237,126,112,'+(p.life*.45)+')';ctx.lineWidth=1.2;ctx.stroke()}else{ctx.beginPath();ctx.moveTo(p.x1,p.y1);ctx.lineTo(p.x2,p.y2);ctx.strokeStyle=p.sign>0?'rgba(117,225,244,'+(p.life*.55)+')':'rgba(237,126,112,'+(p.life*.55)+')';ctx.lineWidth=2.2;ctx.stroke()}});pulses=pulses.filter(p=>p.life>0)}
function inspect(now){if(now<inspectorNext||!pointer.inside)return;inspectorNext=now+140;const g=nearestAgent(pointer.x,pointer.y,19),a=nearestAsset(pointer.x,pointer.y,28),card=$('inspectorCard');if(!card)return;if(g){const t=getAsset(g.target),m=TYPE_META[g.type],key='g'+g.id;if(key===inspectorKey)return;inspectorKey=key;card.classList.remove('empty');card.innerHTML='<b style="color:'+COLORS[g.type]+'">'+m.label+'</b><p>'+m.rule+'</p><dl><dt>资本权重</dt><dd>'+g.capital.toFixed(2)+'</dd><dt>当前目标</dt><dd>'+t.id+' · '+t.sector+'</dd><dt>当前订单</dt><dd>'+(g.order>=0?'+':'')+g.order.toFixed(3)+'</dd><dt>库存</dt><dd>'+g.inventory.toFixed(3)+'</dd><dt>活跃度</dt><dd>'+g.activity.toFixed(2)+'</dd></dl>'}else if(a){const key='a'+a.id;if(key===inspectorKey)return;inspectorKey=key;card.classList.remove('empty');card.innerHTML='<b style="color:#bcecf7">'+a.id+' · '+a.sector+'</b><p>示意资产节点，不代表实时价格。Agent 订单先汇聚到资产，再沿示意关系网络影响其他节点。</p><dl><dt>相对价格</dt><dd>'+a.price.toFixed(2)+'</dd><dt>短时收益</dt><dd>'+(a.ret*100).toFixed(3)+'%</dd><dt>订单流</dt><dd>'+a.flow.toFixed(2)+'</dd><dt>注意力</dt><dd>'+a.attention.toFixed(2)+'</dd><dt>模型激活</dt><dd>'+a.activation.toFixed(2)+'</dd></dl>'}else if(inspectorKey){inspectorKey='';card.classList.add('empty');card.innerHTML='<b>将鼠标移到参与者或资产节点上</b><p>查看它的类型、当前行为，以及它对订单流和市场状态的影响。</p>'}}
function randomShock(){if(simTimeMs<nextShock)return;const a=assets[(simRandom()*assets.length)|0];shock(a,simRandom()<.5?-1:1,simRand(.22,.55),'ambient');nextShock=simTimeMs+simRand(2800,6000)}
function draw(now){if(!ctx)return;const frameDt=clamp((now-last)/1000,0,.08);last=now;if(!paused){simAccumulator=Math.min(simAccumulator+frameDt,.20);while(simAccumulator>=FIXED_SIM_DT){step(FIXED_SIM_DT);simTimeMs+=FIXED_SIM_DT*1000;frameNo++;randomShock();simAccumulator-=FIXED_SIM_DT}}else simAccumulator=0;ctx.clearRect(0,0,W,H);const bg=ctx.createRadialGradient(W*.5,H*.45,20,W*.5,H*.45,Math.max(W,H)*.72);bg.addColorStop(0,'rgba(15,45,61,.92)');bg.addColorStop(.52,'rgba(7,23,34,.96)');bg.addColorStop(1,'rgba(4,13,20,1)');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);drawGrid();drawEdges();drawPointer();agents.forEach(drawAgent);drawAssets();drawPulses(frameDt);inspect(now);requestAnimationFrame(draw)}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>applyMode(b.dataset.mode)));
document.querySelectorAll('[data-inject]').forEach(b=>b.addEventListener('click',()=>{const a=getAsset(selectedAssetId),kind=b.dataset.inject;if(kind==='positive')shock(a,1,1,'user');else if(kind==='negative')shock(a,-1,1,'user');else{const s=kind==='buy'?1:-1;metaorder(a,s,1.25,a.x-70,a.y,a.x+70,a.y,'user')}showAssetInspector(a)}));
$('noiseSlider')?.addEventListener('input',e=>{noise=Number(e.target.value);$('noiseOut').textContent=noise.toFixed(2)});$('networkSlider')?.addEventListener('input',e=>{network=Number(e.target.value);$('networkOut').textContent=network.toFixed(2)});$('liquiditySlider')?.addEventListener('input',e=>{liquidity=Number(e.target.value);$('liquidityOut').textContent=liquidity.toFixed(2)});$('resetButton')?.addEventListener('click',()=>resetSim(false));$('pauseButton')?.addEventListener('click',e=>{paused=!paused;e.target.textContent=paused?'继续':'暂停'});if(canvas&&ctx){makeAssets();resize();makeAgents();resize();resetSim(false);document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));buildHitboxes();initAnalytics();window.addEventListener('resize',resize,{passive:true});requestAnimationFrame(draw)}

const CASE01_EVIDENCE_URL='../../cases/evidence/case01-real-2026-10-02.raw.json';
let case01Chart=null,case01Data=null,case01Runs=null,case01Selected='theme_information_repricing';
const pct=(v,d=2)=>(v>=0?'+':'')+(v*100).toFixed(d)+'%';
const pp=(v,d=2)=>(v>=0?'+':'')+(v*100).toFixed(d)+' pp';

function case01RunLabel(kind){
  return kind==='common_theme_flow'?'B · 共同资金流':'A · 预期重估';
}

function renderCase01Cross(){
  if(!case01Data)return;
  const body=$('case01CrossTable');
  if(!body)return;
  const ids=['NVDA','AMD','AVGO','MU','AMAT','LRCX']
    .sort((a,b)=>case01Data.by_symbol[b].ret_20d-case01Data.by_symbol[a].ret_20d);
  body.innerHTML=ids.map(id=>{
    const r=case01Data.by_symbol[id];
    return '<tr><td><b>'+id+'</b></td><td>'+pct(r.ret_20d)+'</td><td>'+pp(r.ret_20d_excess_theme)+'</td></tr>';
  }).join('');
}

function renderCase01Chart(){
  const el=$('case01PathChart');
  if(!el||!case01Runs)return;
  if(!window.echarts){
    el.innerHTML='<p class="case01-chart-fallback">反事实路径图未加载；上方模拟器仍可正常使用。</p>';
    return;
  }
  if(!case01Chart)case01Chart=window.echarts.init(el);
  const colors={baseline:'#5b7180',theme_information_repricing:'#61d0c7',common_theme_flow:'#e3aa62'};
  const labels={baseline:'基线',theme_information_repricing:'A · 预期重估',common_theme_flow:'B · 共同资金流'};
  const series=['baseline','theme_information_repricing','common_theme_flow'].map(kind=>({
    name:labels[kind],
    type:'line',
    showSymbol:false,
    smooth:.18,
    data:case01Runs[kind].samples.map(s=>[s.t_ms/1000,s.theme]),
    lineStyle:{width:kind===case01Selected?3.2:1.6,color:colors[kind],opacity:kind==='baseline'?.68:kind===case01Selected?1:.52},
    emphasis:{disabled:true},
    markLine:kind===case01Selected?{
      silent:true,
      symbol:'none',
      label:{formatter:'干预开始',color:'#7f9aa6',fontSize:9},
      lineStyle:{color:'rgba(173,218,231,.22)',type:'dashed'},
      data:[{xAxis:5}]
    }:undefined
  }));
  case01Chart.setOption({
    animationDuration:260,
    backgroundColor:'transparent',
    tooltip:{trigger:'axis',valueFormatter:v=>Number(v).toFixed(3)},
    legend:{top:0,textStyle:{color:'#7895a2',fontSize:9}},
    grid:{left:42,right:18,top:34,bottom:30},
    xAxis:{type:'value',name:'模拟秒',axisLabel:{color:'#617f8d',fontSize:9},axisLine:{lineStyle:{color:'rgba(137,210,233,.16)'}},splitLine:{show:false}},
    yAxis:{type:'value',name:'起点=100',scale:true,axisLabel:{color:'#617f8d',fontSize:9},axisLine:{lineStyle:{color:'rgba(137,210,233,.16)'}},splitLine:{lineStyle:{color:'rgba(137,210,233,.07)'}}},
    series
  },true);
}

function renderCase01Scenario(kind){
  if(!case01Runs)return;
  case01Selected=kind;
  document.querySelectorAll('[data-case01-run]').forEach(b=>b.classList.toggle('active',b.dataset.case01Run===kind));
  const run=case01Runs[kind],f=run.fingerprint;
  const set=(id,v)=>{const el=$(id);if(el)el.textContent=v};
  set('case01ScenarioLabel',case01RunLabel(kind));
  set('case01FairShift',pct(f.theme_fair_shift));
  set('case01FlowShare',pct(f.exogenous_share_of_total_flow));
  set('case01ThemeEnd',pct(f.theme_return));
  if(kind==='common_theme_flow'){
    set('case01Recovery',f.post_intervention_recovery_index_points>0?'冲击后回落':'未见回落');
    set('case01ScenarioExplain','经济参考锚保持不变，只给半导体加入有限时长的共同买盘。买盘结束后出现回落，因此“恢复速度”成为与预期重估不同的动态指纹。');
  }else{
    set('case01Recovery',f.post_intervention_recovery_index_points<0?'继续重估':'趋于回落');
    set('case01ScenarioExplain','只有潜在经济参考锚发生变化。后续基本面资金和趋势资金可以参与价格发现，但这些下游交易不会被重复计算成第二个独立“原因”。');
  }
  renderCase01Chart();
}

async function initCase01Lab(){
  const status=$('case01LoadStatus');
  try{
    const res=await fetch(CASE01_EVIDENCE_URL,{cache:'no-store'});
    if(!res.ok)throw new Error('evidence '+res.status);
    const raw=await res.json();
    case01Data=deriveCase01RealEvidence(raw);
    const set=(id,v)=>{const el=$(id);if(el)el.textContent=v};
    set('case01Real1d',pct(case01Data.theme.ret_1d_equal_weight));
    set('case01Breadth',Math.round(case01Data.theme.breadth_positive_1d*6)+' / 6');
    set('case01Real5d',pct(case01Data.theme.ret_5d_equal_weight));
    set('case01Real20d',pct(case01Data.theme.ret_20d_equal_weight));
    set('case01CommonMode',(case01Data.theme.common_mode_share_20d*100).toFixed(2)+'%');
    renderCase01Cross();

    case01Runs={
      baseline:runCase01({kind:'baseline',config:{source_commit:'b3916f93c196d9b91f12932f9ff27408ccd17468'}}),
      theme_information_repricing:runCase01({kind:'theme_information_repricing',config:{source_commit:'b3916f93c196d9b91f12932f9ff27408ccd17468'}}),
      common_theme_flow:runCase01({kind:'common_theme_flow',config:{source_commit:'b3916f93c196d9b91f12932f9ff27408ccd17468'}})
    };
    document.querySelectorAll('[data-case01-run]').forEach(b=>b.addEventListener('click',()=>renderCase01Scenario(b.dataset.case01Run)));
    renderCase01Scenario(case01Selected);
    if(status)status.textContent='真实市场数据已固定到 2026-10-02；反事实实验使用相同初始条件与随机序列。';
    window.addEventListener('resize',()=>case01Chart?.resize(),{passive:true});
  }catch(err){
    if(status)status.textContent='真实证据文件暂时无法读取；下方静态快照仍保留，反事实实验暂不可运行。';
  }
}

initCase01Lab();

const search=$('toolSearch'),grid=$('toolGrid'),count=$('toolCount');search?.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();let n=0;grid.querySelectorAll('article').forEach(card=>{const hit=!q||(card.dataset.search+' '+card.textContent).toLowerCase().includes(q);card.classList.toggle('hidden',!hit);if(hit)n++});if(count)count.textContent=n+' 项'});
const bgCanvas=$('flockCanvas'),bctx=bgCanvas?.getContext('2d');let BW=0,BH=0,BDPR=1,birds=[];const gp={x:-9999,y:-9999,inside:false};
function resizeBg(){if(!bgCanvas||!bctx)return;BDPR=Math.min(devicePixelRatio||1,1.5);BW=innerWidth;BH=innerHeight;bgCanvas.width=Math.round(BW*BDPR);bgCanvas.height=Math.round(BH*BDPR);bctx.setTransform(BDPR,0,0,BDPR,0,0);if(!birds.length){for(let i=0;i<88;i++){const a=visualRand(0,Math.PI*2);birds.push({x:visualRand(0,BW),y:visualRand(0,BH),vx:Math.cos(a),vy:Math.sin(a),s:visualRand(2.4,4.5)})}}}
window.addEventListener('pointermove',e=>{gp.x=e.clientX;gp.y=e.clientY;gp.inside=true},{passive:true});window.addEventListener('mouseout',e=>{if(!e.relatedTarget)gp.inside=false});
function flockStep(){for(let i=0;i<birds.length;i++){const b=birds[i],near=[];for(let j=0;j<birds.length;j++){if(i===j)continue;const q=birds[j],dx=q.x-b.x,dy=q.y-b.y;near.push([dx*dx+dy*dy,j])}near.sort((a,c)=>a[0]-c[0]);let ax=0,ay=0,cx=0,cy=0,sx=0,sy=0,n=0;for(let k=0;k<Math.min(6,near.length);k++){const d2=near[k][0],q=birds[near[k][1]];if(d2<220*220){n++;ax+=q.vx;ay+=q.vy;cx+=q.x;cy+=q.y;if(d2<28*28){const d=Math.sqrt(d2)||1;sx+=(b.x-q.x)/d*(28-d)/28;sy+=(b.y-q.y)/d*(28-d)/28}}}if(n){ax/=n;ay/=n;cx/=n;cy/=n;b.vx+=(ax-b.vx)*.010;b.vy+=(ay-b.vy)*.010;b.vx+=(cx-b.x)*.00005;b.vy+=(cy-b.y)*.00005;b.vx+=sx*.065;b.vy+=sy*.065}if(gp.inside){const dx=b.x-gp.x,dy=b.y-gp.y,d=Math.hypot(dx,dy);if(d<130&&d>1){b.vx+=dx/d*(1-d/130)*.035;b.vy+=dy/d*(1-d/130)*.035}}b.vx+=visualRand(-.006,.006);b.vy+=visualRand(-.006,.006);const sp=Math.hypot(b.vx,b.vy)||1;b.vx=b.vx/sp*.48;b.vy=b.vy/sp*.48;b.x+=b.vx;b.y+=b.vy;if(b.x<-20)b.x=BW+20;if(b.x>BW+20)b.x=-20;if(b.y<-20)b.y=BH+20;if(b.y>BH+20)b.y=-20}}
function drawFlock(){if(!bctx)return;flockStep();bctx.fillStyle='#061019';bctx.fillRect(0,0,BW,BH);const g=bctx.createRadialGradient(BW*.74,BH*.10,20,BW*.74,BH*.10,Math.max(BW,BH)*.68);g.addColorStop(0,'rgba(20,58,79,.70)');g.addColorStop(.5,'rgba(7,28,42,.36)');g.addColorStop(1,'rgba(4,12,18,.04)');bctx.fillStyle=g;bctx.fillRect(0,0,BW,BH);birds.forEach((b,i)=>{const a=Math.atan2(b.vy,b.vx),co=Math.cos(a),si=Math.sin(a),z=b.s,x=b.x,y=b.y;bctx.strokeStyle='rgba(202,242,251,'+(.10+(i%6)*.018)+')';bctx.lineWidth=.8;bctx.beginPath();bctx.moveTo(x-co*z-si*z*.9,y-si*z+co*z*.9);bctx.lineTo(x-co*z*.1,y-si*z*.1);bctx.lineTo(x+co*z*1.5,y+si*z*1.5);bctx.lineTo(x-co*z+si*z*.9,y-si*z-co*z*.9);bctx.stroke()});requestAnimationFrame(drawFlock)}
if(bgCanvas&&bctx){resizeBg();window.addEventListener('resize',resizeBg,{passive:true});requestAnimationFrame(drawFlock)}
})();