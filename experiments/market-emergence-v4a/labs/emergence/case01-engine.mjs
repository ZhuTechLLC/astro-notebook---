import {agentSignal,alignmentRatio,normalizedConcentration,createSeededRandom,applyInformationShockToFairValue} from './model-rules.mjs';

export const CASE01_THEME_ID='ai_semiconductor';
export const CASE01_THEME=['NVDA','AMD','AVGO','MU','AMAT','LRCX'];
export const CASE01_ASSETS=[
  {id:'SPY',group:'market',baseLiquidity:1.00},
  {id:'QQQ',group:'growth',baseLiquidity:.88},
  {id:'NVDA',group:CASE01_THEME_ID,baseLiquidity:.70},
  {id:'AMD',group:CASE01_THEME_ID,baseLiquidity:.62},
  {id:'AVGO',group:CASE01_THEME_ID,baseLiquidity:.70},
  {id:'MU',group:CASE01_THEME_ID,baseLiquidity:.60},
  {id:'AMAT',group:CASE01_THEME_ID,baseLiquidity:.66},
  {id:'LRCX',group:CASE01_THEME_ID,baseLiquidity:.63}
];
const EDGES=[['SPY','QQQ',.46],['QQQ','NVDA',.55],['QQQ','AMD',.36],['QQQ','AVGO',.38],['QQQ','AMAT',.20],['QQQ','LRCX',.20],['NVDA','AMD',.42],['NVDA','AVGO',.40],['AMD','MU',.18],['MU','AMAT',.30],['MU','LRCX',.28],['AMAT','LRCX',.52]];
const PARTICIPANTS={retail:.80,fundamental:1.20,trend:1.00,statarb:.80,dealer:.90,hft:.60};
const CFG={retailGain:1,trendGain:1,meanRevGain:1,dealerGain:1,network:1};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mean=a=>a.reduce((s,v)=>s+v,0)/Math.max(1,a.length);
const stdev=a=>{const m=mean(a);return Math.sqrt(mean(a.map(v=>(v-m)**2)))};

export const DEFAULT_CASE01_CONFIG=Object.freeze({
  case_id:'case-01-semiconductor-synchronised-rise',case_version:'case-01-v1',engine_version:'case01-engine-v1',source_commit:null,
  seed:20261003,duration_ms:30000,sample_interval_ms:250,dt_ms:1000/60,event_time_ms:5000,focus_asset:'NVDA',
  noise:.35,network_strength:.55,liquidity:.70,trend_gain:1,reference_adjust_speed:.032,info_impulse_decay:.965,
  expectation_fair_shift:.012,common_flow_strength:4.8,common_flow_duration_ms:4000
});

export function canonicalCase01Events(kind,config={}){
  const c={...DEFAULT_CASE01_CONFIG,...config};
  if(kind==='baseline')return [];
  if(kind==='theme_information_repricing')return [{event_id:'case01-info-1',t_ms:c.event_time_ms,type:'information_shock',scope:'theme',target:CASE01_THEME_ID,direction:1,strength:1,source:'case01'}];
  if(kind==='common_theme_flow')return [{event_id:'case01-flow-1',t_ms:c.event_time_ms,type:'persistent_flow',scope:'theme',target:CASE01_THEME_ID,direction:1,strength:1,duration_ms:c.common_flow_duration_ms,source:'case01'}];
  throw new Error(`unknown Case 01 run kind: ${kind}`);
}

function initState(config){
  const rng=createSeededRandom(config.seed);
  const assets=CASE01_ASSETS.map((a,i)=>{const base=100+i*1.75;return {...a,basePrice:base,price:base,fair:base,ret:0,prevRet:0,momentum:0,volatility:.02,infoImpulse:0,lastEndogenousFlow:0,endogenousFlow:0,exogenousFlow:0,cum:{reference:0,exogenousFlow:0,endogenousFlow:0,network:0,residual:0},absFlowByClass:Object.fromEntries(Object.keys(PARTICIPANTS).map(k=>[k,0]))}});
  const byId=Object.fromEntries(assets.map(a=>[a.id,a]));
  const participants=[];
  for(const a of assets){
    for(const [type,capital] of Object.entries(PARTICIPANTS))participants.push({asset:a.id,type,capital,inventory:(rng()-.5)*.20,order:0});
  }
  return {rng,assets,byId,participants,time_ms:0,eventLog:[],activeFlows:[],samples:[],cumTrendAbs:0,cumEndogenousAbs:0,cumExogenousAbs:0,maxAccountingError:0,focusAsset:config.focus_asset};
}

function targetIds(event){if(event.scope==='theme'&&event.target===CASE01_THEME_ID)return CASE01_THEME; if(event.scope==='asset')return [event.target];if(event.scope==='market')return CASE01_ASSETS.map(x=>x.id);throw new Error(`unsupported event scope: ${event.scope}`)}

function applyEvent(state,event,config){
  const ids=targetIds(event);const direction=event.direction>0?1:event.direction<0?-1:0;const strength=Math.max(0,event.strength??1);
  if(event.type==='information_shock'){
    for(const id of ids){const a=state.byId[id];a.fair=applyInformationShockToFairValue(a.fair,direction,strength,config.expectation_fair_shift);a.infoImpulse=clamp(a.infoImpulse+direction*.85*strength,-2,2)}
  }else if(event.type==='persistent_flow'){
    state.activeFlows.push({event_id:event.event_id,ids:new Set(ids),direction,strength,until_ms:event.t_ms+(event.duration_ms??config.common_flow_duration_ms)});
  }else throw new Error(`unsupported event type: ${event.type}`);
  state.eventLog.push(structuredClone(event));
}

function step(state,config,dt){
  const cfg={...CFG,trendGain:config.trend_gain};
  for(const a of state.assets){a.prevRet=a.ret;a.endogenousFlow=0;a.exogenousFlow=0;a.infoImpulse*=Math.pow(config.info_impulse_decay,dt*60)}
  for(const p of state.participants){
    const a=state.byId[p.asset];const eps=(state.rng()-.5)*config.noise*.14;
    const want=agentSignal(p.type,{cfg,eps,fair:a.fair,price:a.price,momentum:a.momentum,ret:a.ret,volatility:a.volatility,infoShock:a.infoImpulse,attention:0,inventory:p.inventory,lastFlow:a.lastEndogenousFlow});
    const reaction=p.type==='fundamental'?.035:p.type==='hft'?.18:.085;
    p.order+=(want-p.order)*clamp(reaction*dt*60,0,1);p.inventory=clamp(p.inventory+p.order*.0025*dt*60,-1.5,1.5);
    const q=p.order*p.capital;a.endogenousFlow+=q;a.absFlowByClass[p.type]+=Math.abs(q)*dt;
    state.cumEndogenousAbs+=Math.abs(q)*dt;if(p.type==='trend')state.cumTrendAbs+=Math.abs(q)*dt;
  }
  state.activeFlows=state.activeFlows.filter(f=>f.until_ms>state.time_ms);
  for(const f of state.activeFlows){for(const id of f.ids){const q=f.direction*f.strength*config.common_flow_strength;state.byId[id].exogenousFlow+=q;state.cumExogenousAbs+=Math.abs(q)*dt}}
  const prop=Object.fromEntries(state.assets.map(a=>[a.id,0]));
  for(const [aId,bId,w0] of EDGES){const a=state.byId[aId],b=state.byId[bId],w=w0*config.network_strength;prop[bId]+=a.prevRet*w;prop[aId]+=b.prevRet*w}
  for(const a of state.assets){
    const liq=clamp(a.baseLiquidity*config.liquidity,.08,1.4),impactK=.000075/liq;
    const referenceGap=(a.fair-a.price)/a.fair;
    const comp={
      reference:referenceGap*config.reference_adjust_speed,
      exogenousFlow:a.exogenousFlow*impactK,
      endogenousFlow:a.endogenousFlow*impactK,
      network:prop[a.id],
      residual:(state.rng()-.5)*config.noise*.00010
    };
    const raw=Object.values(comp).reduce((s,v)=>s+v,0),ret=clamp(raw,-.018,.018),scale=Math.abs(raw)>1e-12?ret/raw:1;
    for(const k of Object.keys(comp)){comp[k]*=scale;a.cum[k]+=comp[k]}
    state.maxAccountingError=Math.max(state.maxAccountingError,Math.abs(ret-Object.values(comp).reduce((sum,v)=>sum+v,0)));a.ret=ret;a.price*=1+ret;a.momentum+=(a.ret-a.momentum)*.065;a.volatility+=(Math.abs(a.ret)-a.volatility)*.045;a.lastEndogenousFlow=a.endogenousFlow;
  }
}

function sample(state){
  const norm=Object.fromEntries(state.assets.map(a=>[a.id,100*a.price/a.basePrice]));
  const theme=mean(CASE01_THEME.map(id=>norm[id]));
  const themeReturns=CASE01_THEME.map(id=>norm[id]/100-1);
  state.samples.push({t_ms:Math.round(state.time_ms),market:norm.SPY,qqq:norm.QQQ,theme,focus:norm[state.focusAsset]??norm.NVDA,assets:norm,breadth:themeReturns.filter(x=>x>0).length/CASE01_THEME.length,dispersion:stdev(themeReturns)});
}

export function runCase01({kind='baseline',config={},events=null}={}){
  const c={...DEFAULT_CASE01_CONFIG,...config};
  const state=initState(c),eventStream=(events??canonicalCase01Events(kind,c)).map(x=>structuredClone(x)).sort((a,b)=>a.t_ms-b.t_ms||String(a.event_id).localeCompare(String(b.event_id)));
  let eventIndex=0,nextSample=0;
  sample(state);nextSample+=c.sample_interval_ms;
  while(state.time_ms<c.duration_ms-1e-9){
    while(eventIndex<eventStream.length&&eventStream[eventIndex].t_ms<=state.time_ms+1e-9)applyEvent(state,eventStream[eventIndex++],c);
    const dt=Math.min(c.dt_ms,c.duration_ms-state.time_ms)/1000;step(state,c,dt);state.time_ms+=dt*1000;
    while(state.time_ms+1e-7>=nextSample&&nextSample<=c.duration_ms){sample(state);nextSample+=c.sample_interval_ms}
  }
  const themeAssets=CASE01_THEME.map(id=>state.byId[id]);
  const themeFinal=mean(themeAssets.map(a=>a.price/a.basePrice-1)),marketFinal=state.byId.SPY.price/state.byId.SPY.basePrice-1,focus=state.byId[c.focus_asset]||state.byId.NVDA,focusFinal=focus.price/focus.basePrice-1;
  const themeFairShift=mean(themeAssets.map(a=>a.fair/a.basePrice-1));
  const accounting=Object.fromEntries(['reference','exogenousFlow','endogenousFlow','network','residual'].map(k=>[k,mean(themeAssets.map(a=>a.cum[k]))]));
  const eventEnd=eventStream.reduce((m,e)=>Math.max(m,e.t_ms+(e.duration_ms??0)),c.event_time_ms);const atEnd=state.samples.reduce((best,s)=>Math.abs(s.t_ms-eventEnd)<Math.abs(best.t_ms-eventEnd)?s:best,state.samples[0]);const finalSample=state.samples.at(-1);
  const recovery=(atEnd.theme-100)-(finalSample.theme-100);
  const flowAbs=state.cumEndogenousAbs+state.cumExogenousAbs;
  const fingerprint={theme_fair_shift:themeFairShift,permanent_reference_component:themeFairShift,theme_return:themeFinal,market_return:marketFinal,theme_excess_vs_market:themeFinal-marketFinal,focus_return:focusFinal,focus_excess_vs_theme:focusFinal-themeFinal,post_intervention_recovery_index_points:recovery,trend_share_of_endogenous_flow:state.cumEndogenousAbs>0?state.cumTrendAbs/state.cumEndogenousAbs:0,exogenous_share_of_total_flow:flowAbs>0?state.cumExogenousAbs/flowAbs:0,final_breadth:finalSample.breadth,final_dispersion:finalSample.dispersion};
  const participantMix=Object.fromEntries(Object.keys(PARTICIPANTS).map(k=>[k,themeAssets.reduce((s,a)=>s+a.absFlowByClass[k],0)]));
  return {schema_version:'case01_run_v1',kind,config:c,event_log:state.eventLog,samples:state.samples,accounting_reconciliation_error:state.maxAccountingError,final_assets:Object.fromEntries(state.assets.map(a=>[a.id,{price:a.price,fair:a.fair,normalized:100*a.price/a.basePrice}])),accounting,fingerprint,participant_mix:participantMix,flow_metrics:{alignment:alignmentRatio(themeAssets.reduce((s,a)=>s+a.endogenousFlow+a.exogenousFlow,0),themeAssets.reduce((s,a)=>s+Math.abs(a.endogenousFlow)+Math.abs(a.exogenousFlow),0)),concentration:normalizedConcentration(themeAssets.map(a=>Math.abs(a.endogenousFlow)+Math.abs(a.exogenousFlow)))}};
}

export function replayCase01(run){return runCase01({kind:run.kind,config:run.config,events:run.event_log})}
export function compareCase01Runs(a,b){const keys=new Set([...Object.keys(a.fingerprint),...Object.keys(b.fingerprint)]);return {schema_version:'case01_comparison_v1',run_a:a.kind,run_b:b.kind,deltas:Object.fromEntries([...keys].map(k=>[k,(b.fingerprint[k]??0)-(a.fingerprint[k]??0)]))};}
