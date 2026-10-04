const OUTCOME=Object.freeze({MATCH:'MATCH',PARTIAL:'PARTIAL',CONFLICT:'CONFLICT',UNKNOWN:'UNKNOWN',NEUTRAL:'NEUTRAL'});

function countStatuses(rows){
  const counts={MATCH:0,PARTIAL:0,CONFLICT:0,UNKNOWN:0,NEUTRAL:0};
  for(const row of rows)counts[row.status]=(counts[row.status]||0)+1;
  return counts;
}

function realPathFingerprint(evidenceV2){
  const e=evidenceV2.intraday;
  const initial=e.labor_0830_30m.theme;
  const preToClose=(1+e.labor_0830_to_open.theme)*(1+e.regular_session.theme)-1;
  const retention=Math.abs(initial)>1e-12?preToClose/initial:null;
  return {
    broad_market_co_move:e.labor_0830_5m.spy>0&&e.labor_0830_5m.qqq>0&&e.labor_0830_5m.theme>0,
    theme_excess_positive:e.labor_0830_5m.excess_vs_spy>0&&e.labor_0830_5m.excess_vs_qqq>0,
    initial_30m_return:initial,
    pre_to_close_return:preToClose,
    retention_ratio:retention,
    regular_session_return:e.regular_session.theme,
    path_shape:retention!==null&&retention<.5&&e.regular_session.theme<0?'REVERSAL_DOMINANT':'PERSISTENT_OR_MIXED'
  };
}

function eventScope(run){
  const scopes=new Set((run.event_log||[]).map(e=>e.scope));
  return scopes.size===1?[...scopes][0]:(scopes.size?'mixed':'none');
}

function row(id,label,status,evidence,boundary){return {id,label,status,evidence,boundary}}

function evaluateExpectation(real,run,evidenceV2){
  const rows=[];
  const scope=eventScope(run);
  rows.push(row('broad_market_co_move','宏观同步启动',
    real.broad_market_co_move&&scope==='theme'?OUTCOME.CONFLICT:OUTCOME.UNKNOWN,
    '真实市场在 08:30 ET 后 SPY、QQQ 与半导体同时上行；当前 A 只对半导体主题施加信息冲击。',
    '这只说明 A 不能作为完整单机制解释，不否认主题层预期变化存在。'));
  rows.push(row('post_event_path','冲击后的路径形态',
    real.path_shape==='REVERSAL_DOMINANT'&&run.fingerprint.post_intervention_recovery_index_points<0?OUTCOME.CONFLICT:OUTCOME.UNKNOWN,
    '真实市场初始 30 分钟上涨后，至收盘仅保留约 '+Math.max(-999,Math.min(999,(real.retention_ratio??0)*100)).toFixed(0)+'% 的初始涨幅，且正常交易时段主题收益为负；A 的模型路径继续向新参考锚收敛。',
    '真实市场可能同时受到后续新信息影响，因此不是对永久重估机制的否定。'));
  rows.push(row('theme_excess','主题相对市场超额',
    real.theme_excess_positive&&run.fingerprint.theme_excess_vs_market>0?OUTCOME.MATCH:OUTCOME.UNKNOWN,
    '真实主题在事件后短窗内跑赢 SPY / QQQ；A 的主题级信息冲击也产生主题相对市场超额。',
    '方向一致不等于原因一致。'));
  rows.push(row('direct_expectation_evidence','直接预期证据',
    evidenceV2.mechanism_assessment.theme_information_repricing.status==='PARTIAL_SINGLE_NAME_SUPPORT'?OUTCOME.PARTIAL:OUTCOME.UNKNOWN,
    'MU 下一季 EPS / 收入指引中点高于事件时点一致预期，并出现公开分析师目标价上调样本。',
    '这是 MU 单名证据，不是六只股票同步预期上修面板。'));
  return rows;
}

function evaluateFlow(real,run,evidenceV2){
  const rows=[];
  const scope=eventScope(run);
  rows.push(row('broad_market_co_move','宏观同步启动',
    real.broad_market_co_move&&scope==='theme'?OUTCOME.CONFLICT:OUTCOME.UNKNOWN,
    '真实市场在 08:30 ET 后 SPY、QQQ 与半导体同时启动；当前 B 只向半导体主题注入共同买盘。',
    '主题资金流仍可作为放大器，但不能独立解释同步的市场级启动。'));
  rows.push(row('post_event_path','冲击后的路径形态',
    real.path_shape==='REVERSAL_DOMINANT'&&run.fingerprint.post_intervention_recovery_index_points>0?OUTCOME.MATCH:OUTCOME.UNKNOWN,
    '真实路径表现出明显的盘前冲高后回吐；B 的有限时长共同买盘结束后同样出现回落。',
    '相似路径不是流量来源的直接证据。'));
  rows.push(row('theme_excess','主题相对市场超额',
    real.theme_excess_positive&&run.fingerprint.theme_excess_vs_market>0?OUTCOME.MATCH:OUTCOME.UNKNOWN,
    '真实主题短窗跑赢市场；B 的主题级共同买盘也会制造这种横截面超额。',
    '这一维度对 A / B 的区分力有限。'));
  rows.push(row('direct_flow_evidence','直接资金流证据',OUTCOME.UNKNOWN,
    'SOXQ 价格调整后 AUM 代理近乎持平/略负，SOXQ 与 SMH 成交活跃度也没有显示异常申购浪潮。',
    'ETF AUM 和成交量不是有符号订单流，不能据此否定其他载体中的共同资金流。'));
  return rows;
}

export function buildCase01MechanismChallenger({evidenceV2,runs}){
  if(!evidenceV2||!runs?.theme_information_repricing||!runs?.common_theme_flow)throw new Error('Case 01 challenger requires evidence v2 and both counterfactual runs');
  const real=realPathFingerprint(evidenceV2);
  const A=evaluateExpectation(real,runs.theme_information_repricing,evidenceV2);
  const B=evaluateFlow(real,runs.common_theme_flow,evidenceV2);
  return {
    schema_version:'case01_mechanism_challenger_v1',
    outcome:'NEITHER_SINGLE_MECHANISM_SUFFICIENT',
    real_fingerprint:real,
    hypotheses:{
      theme_information_repricing:{label:'A · 主题预期重估',rows:A,counts:countStatuses(A),verdict:'PARTIAL_BUT_INSUFFICIENT'},
      common_theme_flow:{label:'B · 共同资金流',rows:B,counts:countStatuses(B),verdict:'PATH_MATCH_BUT_UNCONFIRMED'}
    },
    challenger_conclusion:{
      summary:'A 有 MU 单名预期证据，但不能解释宏观同步启动和明显回吐；B 更像真实的短期路径形态，但缺少直接共同资金流证据，而且同样不能解释市场级同步启动。两个单机制都不足。',
      next_hypothesis:'MACRO_COMMON_REPRICING_PLUS_HETEROGENEOUS_EXPECTATIONS',
      optional_amplifier:'COMMON_FLOW_REQUIRES_DIRECT_EVIDENCE'
    },
    evidence_queue:[
      {priority:'P0',evidence:'主题级同步盈利/收入预期修正序列',discriminates:['theme_information_repricing','heterogeneous_expectations'],status:'UNAVAILABLE'},
      {priority:'P0',evidence:'ETF / 个股有符号资金流或 OFI',discriminates:['common_theme_flow','trend_feedback'],status:'UNAVAILABLE'},
      {priority:'P1',evidence:'事件窗口 bid-ask spread / depth / impact-per-unit-flow',discriminates:['liquidity_amplification'],status:'UNAVAILABLE'},
      {priority:'P1',evidence:'Return → Future Flow 序列',discriminates:['trend_feedback'],status:'UNAVAILABLE'}
    ],
    boundary:'This challenger compares observable fingerprints and evidence compatibility. It does not estimate causal probabilities or authorize investment actions.'
  };
}

export {OUTCOME};
