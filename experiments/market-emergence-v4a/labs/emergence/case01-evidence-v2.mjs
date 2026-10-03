const THEME=['NVDA','AMD','AVGO','MU','AMAT','LRCX'];
const mean=a=>a.reduce((s,x)=>s+x,0)/Math.max(1,a.length);
const ret=(a,b)=>b/a-1;
const mid=(a,b)=>(a+b)/2;

export function deriveCase01EvidenceV2(raw){
  if(raw.schema_version!=='case01_evidence_upgrade_v2')throw new Error('invalid v2 schema');
  const idx={pre:0,post5m:1,post30m:2,open:3,open30m:4,close:5};
  const R=(symbol,a,b)=>ret(raw.event_timing.by_symbol[symbol].close[idx[a]],raw.event_timing.by_symbol[symbol].close[idx[b]]);
  const theme=(a,b)=>mean(THEME.map(s=>R(s,a,b)));
  const intraday={
    labor_0830_5m:{theme:theme('pre','post5m'),spy:R('SPY','pre','post5m'),qqq:R('QQQ','pre','post5m')},
    labor_0830_30m:{theme:theme('pre','post30m'),spy:R('SPY','pre','post30m'),qqq:R('QQQ','pre','post30m')},
    labor_0830_to_open:{theme:theme('pre','open'),spy:R('SPY','pre','open'),qqq:R('QQQ','pre','open')},
    open_first_30m:{theme:theme('open','open30m'),spy:R('SPY','open','open30m'),qqq:R('QQQ','open','open30m')},
    regular_session:{theme:theme('open','close'),spy:R('SPY','open','close'),qqq:R('QQQ','open','close')},
    by_symbol:Object.fromEntries(THEME.map(s=>[s,{
      labor_0830_5m:R(s,'pre','post5m'),
      labor_0830_to_open:R(s,'pre','open'),
      open_first_30m:R(s,'open','open30m'),
      regular_session:R(s,'open','close')
    }]))
  };
  for(const k of ['labor_0830_5m','labor_0830_30m','labor_0830_to_open','open_first_30m','regular_session']){
    intraday[k].excess_vs_spy=intraday[k].theme-intraday[k].spy;
    intraday[k].excess_vs_qqq=intraday[k].theme-intraday[k].qqq;
  }

  const mu=raw.expectation_evidence.MU;
  const epsMid=mid(mu.q1_fy2027_guidance.eps_low,mu.q1_fy2027_guidance.eps_high);
  const revMid=mid(mu.q1_fy2027_guidance.revenue_low_usd,mu.q1_fy2027_guidance.revenue_high_usd);
  const expectation={
    symbol:'MU',
    eps_guidance_midpoint:epsMid,
    revenue_guidance_midpoint_usd:revMid,
    eps_guidance_vs_consensus:epsMid/mu.event_time_consensus.eps-1,
    revenue_guidance_vs_consensus:revMid/mu.event_time_consensus.revenue_usd-1,
    explicit_target_raises_in_sample:mu.post_event_analyst_actions.filter(x=>x.action==='target_raise').length,
    theme_synchronized_revision_series:mu.theme_synchronized_revision_series
  };

  const soxq=raw.flow_and_activity_proxies.SOXQ;
  const p0=soxq.close['2026-10-01'],p1=soxq.close['2026-10-02'];
  const a0=soxq.aum_usd['2026-10-01'],a1=soxq.aum_usd['2026-10-02'];
  const priceReturn=p1/p0-1;
  const impliedFlowUsd=a1-a0*(1+priceReturn);
  const flow={
    SOXQ:{
      price_return:priceReturn,
      aum_adjusted_flow_proxy_usd:impliedFlowUsd,
      aum_adjusted_flow_proxy_pct_prior_aum:impliedFlowUsd/a0,
      volume_vs_30d_avg:soxq.volume['2026-10-02']/soxq.volume.avg_30d_2026_10_02
    },
    SMH:{
      volume_vs_30d_avg:raw.flow_and_activity_proxies.SMH.volume['2026-10-02']/raw.flow_and_activity_proxies.SMH.volume.avg_30d
    }
  };

  return {
    schema_version:'case01_evidence_upgrade_v2_derived',
    snapshot_id:raw.snapshot_id,
    intraday,
    expectation,
    flow,
    mechanism_assessment:{
      macro_relief_timing:{
        status:'TIMING_SUPPORT',
        reason:'The broad equity and semiconductor response begins immediately after the 08:30 ET labor release, while public rates reporting shows an initial Treasury-yield decline before later reversal.',
        boundary:'Timing alignment is not causal identification.'
      },
      theme_information_repricing:{
        status:'PARTIAL_SINGLE_NAME_SUPPORT',
        reason:'MU guidance exceeded event-time consensus and several public analyst actions were positive after the event, but a synchronized theme-level estimate revision panel is unavailable.',
        boundary:'Single-name expectation evidence cannot be promoted to a theme-wide causal claim.'
      },
      common_theme_flow:{
        status:'NO_SUPPORT_FROM_AVAILABLE_ETF_PROXY',
        reason:'SOXQ AUM-adjusted daily proxy is approximately flat/slightly negative while trading activity is normal; SMH volume is only moderately above its 30-day average.',
        boundary:'One ETF AUM proxy and trading volume cannot rule out institutional or cross-vehicle common flow.'
      },
      persistent_intraday_accumulation:{
        status:intraday.regular_session.theme>0?'SUPPORTED':'NOT_OBSERVED',
        reason:'The equal-weight theme return from the 09:30 ET open to 16:00 ET close is measured directly from one-minute bars.',
        boundary:'Price persistence is not signed flow.'
      },
      liquidity_amplification:{status:'UNRESOLVED',reason:'Historical spread and depth are unavailable.'},
      trend_feedback:{status:'UNRESOLVED',reason:'Return-to-future-flow evidence is unavailable.'}
    }
  };
}
