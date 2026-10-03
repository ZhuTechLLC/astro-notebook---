const THEME=['NVDA','AMD','AVGO','MU','AMAT','LRCX'];

const mean=a=>a.reduce((s,x)=>s+x,0)/Math.max(1,a.length);
const stdev=a=>{const m=mean(a);return Math.sqrt(mean(a.map(x=>(x-m)**2)))};
const ret=(closes,n)=>closes.at(-1)/closes.at(-(n+1))-1;
const dailyReturns=closes=>closes.slice(1).map((x,i)=>x/closes[i]-1);

function corr(a,b){
  const ma=mean(a),mb=mean(b);
  const da=Math.sqrt(mean(a.map(x=>(x-ma)**2)));
  const db=Math.sqrt(mean(b.map(x=>(x-mb)**2)));
  if(!da||!db)return 0;
  return mean(a.map((x,i)=>(x-ma)*(b[i]-mb)))/(da*db);
}

function firstCommonMode(corrMatrix){
  const n=corrMatrix.length;
  let v=Array(n).fill(1/Math.sqrt(n));
  for(let k=0;k<100;k++){
    const w=corrMatrix.map(row=>row.reduce((s,x,j)=>s+x*v[j],0));
    const norm=Math.sqrt(w.reduce((s,x)=>s+x*x,0))||1;
    v=w.map(x=>x/norm);
  }
  const cv=corrMatrix.map(row=>row.reduce((s,x,j)=>s+x*v[j],0));
  const lambda1=v.reduce((s,x,i)=>s+x*cv[i],0);
  return {lambda1,share:lambda1/n};
}

export function validateCase01RealSnapshot(snapshot){
  const errors=[];
  if(snapshot.schema_version!=='case01_real_evidence_snapshot_v1')errors.push('schema_version');
  if(snapshot.clock?.latest_completed_session!=='2026-10-02')errors.push('latest_completed_session');
  const sessions=snapshot.clock?.sessions||[];
  const series=snapshot.price_evidence?.series||{};
  for(const symbol of ['SPY','QQQ',...THEME]){
    const row=series[symbol];
    if(!row){errors.push('missing_series_'+symbol);continue}
    if(row.close.length!==sessions.length)errors.push('close_length_'+symbol);
    if(row.volume.length!==sessions.length)errors.push('volume_length_'+symbol);
  }
  return {valid:errors.length===0,errors};
}

export function deriveCase01RealEvidence(snapshot){
  const validation=validateCase01RealSnapshot(snapshot);
  if(!validation.valid)throw new Error('invalid Case 01 snapshot: '+validation.errors.join(','));

  const sessions=snapshot.clock.sessions;
  const series=snapshot.price_evidence.series;
  const returns={};
  const bySymbol={};

  for(const [symbol,row] of Object.entries(series)){
    const d=dailyReturns(row.close);
    returns[symbol]=d;
    const avgVol20=mean(row.volume.slice(-20));
    bySymbol[symbol]={
      close:row.close.at(-1),
      session:sessions.at(-1),
      ret_1d:d.at(-1),
      ret_5d:ret(row.close,5),
      ret_20d:ret(row.close,20),
      volume:row.volume.at(-1),
      volume_vs_20d_avg:row.volume.at(-1)/avgVol20
    };
  }

  for(const horizon of ['ret_1d','ret_5d','ret_20d']){
    const themeMean=mean(THEME.map(symbol=>bySymbol[symbol][horizon]));
    for(const symbol of THEME){
      bySymbol[symbol][horizon+'_excess_theme']=bySymbol[symbol][horizon]-themeMean;
    }
  }

  const latestThemeDaily=THEME.map(symbol=>bySymbol[symbol].ret_1d);
  const theme1d=mean(latestThemeDaily);
  const theme5d=mean(THEME.map(symbol=>bySymbol[symbol].ret_5d));
  const theme20d=mean(THEME.map(symbol=>bySymbol[symbol].ret_20d));

  const matrix=THEME.map(a=>THEME.map(b=>corr(returns[a],returns[b])));
  const common=firstCommonMode(matrix);

  const mu=series.MU.close;
  const i0=sessions.indexOf('2026-09-30');
  const i1=sessions.indexOf('2026-10-01');
  const i2=sessions.indexOf('2026-10-02');
  const muEventPath=(i0>=0&&i1>=0&&i2>=0)?{
    event_release_date:'2026-09-30',
    close_pre_release:mu[i0],
    close_first_session_after_release:mu[i1],
    close_second_session_after_release:mu[i2],
    first_session_return:mu[i1]/mu[i0]-1,
    second_session_return:mu[i2]/mu[i1]-1,
    cumulative_two_session_return:mu[i2]/mu[i0]-1
  }:null;

  return {
    schema_version:'case01_real_evidence_derived_v1',
    snapshot_id:snapshot.snapshot_id,
    as_of:snapshot.clock.latest_completed_session,
    by_symbol:bySymbol,
    theme:{
      breadth_positive_1d:latestThemeDaily.filter(x=>x>0).length/THEME.length,
      dispersion_1d:stdev(latestThemeDaily),
      ret_1d_equal_weight:theme1d,
      ret_5d_equal_weight:theme5d,
      ret_20d_equal_weight:theme20d,
      excess_vs_SPY_1d:theme1d-bySymbol.SPY.ret_1d,
      excess_vs_QQQ_1d:theme1d-bySymbol.QQQ.ret_1d,
      excess_vs_SPY_5d:theme5d-bySymbol.SPY.ret_5d,
      excess_vs_QQQ_5d:theme5d-bySymbol.QQQ.ret_5d,
      excess_vs_SPY_20d:theme20d-bySymbol.SPY.ret_20d,
      excess_vs_QQQ_20d:theme20d-bySymbol.QQQ.ret_20d,
      common_mode_lambda1_20d:common.lambda1,
      common_mode_share_20d:common.share,
      daily_return_sample_size:returns.NVDA.length
    },
    correlation_matrix:{symbols:THEME,values:matrix},
    event_paths:{MU_Q4_2026:muEventPath},
    mechanism_assessment:{
      market_common_structure:{status:'OBSERVED',boundary:'descriptive decomposition only'},
      theme_information_repricing:{
        status:'UNRESOLVED',
        missing:['synchronized analyst revision panel','event-aligned estimate changes across the whole theme','price-implied expectation reconstruction']
      },
      common_theme_flow:{status:'UNRESOLVED',missing:['theme ETF flow','signed flow / OFI','common portfolio-flow evidence']},
      trend_feedback:{status:'UNRESOLVED',missing:['return-to-future-flow evidence']},
      liquidity_amplification:{status:'UNRESOLVED',missing:['depth','spread history','impact-per-unit-flow']},
      leader_information_propagation:{status:'UNRESOLVED',missing:['event-aligned intraday lead-lag','identified economic transmission channel']}
    },
    evidence_availability:snapshot.evidence_availability,
    comparable_to_simulation:{
      available:['theme path persistence across 1d/5d/20d','breadth','dispersion','market-vs-theme-vs-stock decomposition'],
      unavailable:['permanent reference-anchor contribution','exogenous-flow share','signed participant mix','post-flow recovery time','network contribution accounting'],
      rule:'Compare only dimensions observed on both sides; do not back-solve real causal percentages from simulation.'
    }
  };
}
