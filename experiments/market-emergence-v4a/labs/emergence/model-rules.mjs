export const NETWORK_EVENT_EPS = 1e-6;

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export function agentSignal(type,{cfg,eps=0,fair,price,momentum,ret,volatility,infoShock,attention,inventory,lastFlow}){
  const mis=(fair-price)/fair;
  const mom=momentum;
  const info=infoShock;
  const att=Math.max(0,attention);
  let q=0;
  if(type==='retail'){
    const directional=.74*mom+.52*info;
    q=cfg.retailGain*(1+.55*att)*directional+eps;
  }else if(type==='fundamental'){
    q=.92*mis+.50*info+eps*.25;
  }else if(type==='trend'){
    const volScale=1/(1+18*Math.max(0,volatility));
    q=cfg.trendGain*(1.38*mom)*volScale+eps*.35;
  }else if(type==='statarb'){
    q=cfg.meanRevGain*(1.30*mis-.45*ret)+eps*.18;
  }else if(type==='dealer'){
    q=cfg.dealerGain*(-.72*ret-.24*inventory)+.12*info+eps*.12;
  }else{
    q=cfg.dealerGain*(-1.02*ret-.30*inventory-.16*lastFlow)+eps*.10;
  }
  return clamp(q,-1.6,1.6);
}

export function alignmentRatio(signed,absolute){
  return absolute>1e-5?clamp(Math.abs(signed)/absolute,0,1):0;
}

export function normalizedConcentration(exposure){
  const n=exposure.length;
  const total=exposure.reduce((s,v)=>s+Math.abs(v),0);
  if(total<=1e-5||n===0)return 0;
  if(n===1)return 1;
  const hhi=exposure.reduce((s,v)=>{const p=Math.abs(v)/total;return s+p*p},0);
  const min=1/n;
  return clamp((hhi-min)/(1-min),0,1);
}

export function networkShockTransfer(weight,networkStrength,shockStrength){
  return weight*networkStrength*shockStrength*.22;
}

export function isMaterialTransfer(transfer,epsilon=NETWORK_EVENT_EPS){
  return Math.abs(transfer)>epsilon;
}
