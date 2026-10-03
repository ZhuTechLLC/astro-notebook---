import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateCase01RealSnapshot,deriveCase01RealEvidence} from '../../experiments/market-emergence-v4a/labs/emergence/case01-evidence.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const raw=JSON.parse(fs.readFileSync(path.join(root,'experiments/market-emergence-v4a/cases/evidence/case01-real-2026-10-02.raw.json'),'utf8'));

assert.equal(validateCase01RealSnapshot(raw).valid,true);
const d=deriveCase01RealEvidence(raw);
const near=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<=tol,String(a)+' != '+String(b));

assert.equal(d.as_of,'2026-10-02');
near(d.theme.ret_1d_equal_weight,0.016315429646574082);
near(d.theme.ret_5d_equal_weight,0.04338732304758255);
near(d.theme.ret_20d_equal_weight,0.15935713579405505);
near(d.theme.excess_vs_SPY_1d,0.008920044890229035);
near(d.theme.excess_vs_QQQ_20d,0.11489380306452743);
near(d.theme.common_mode_share_20d,0.6829710063561231,1e-9);
assert.equal(d.theme.breadth_positive_1d,5/6);
assert.equal(d.theme.daily_return_sample_size,20);

near(d.by_symbol.AMD.ret_20d,0.3896659066994035);
near(d.by_symbol.AMAT.ret_5d,0.11348453608247411);
near(d.by_symbol.LRCX.ret_5d,0.10240791853050357);
near(d.by_symbol.AVGO.ret_20d,-0.005655728525030934);
near(d.by_symbol.MU.ret_1d,-0.020503193941989628);

assert.equal(d.event_paths.MU_Q4_2026.event_release_date,'2026-09-30');
assert.ok(d.event_paths.MU_Q4_2026.first_session_return>0);
assert.ok(d.event_paths.MU_Q4_2026.second_session_return<0);
assert.ok(d.event_paths.MU_Q4_2026.cumulative_two_session_return>0);

for(const key of ['theme_information_repricing','common_theme_flow','trend_feedback','liquidity_amplification','leader_information_propagation']){
  assert.equal(d.mechanism_assessment[key].status,'UNRESOLVED');
}
assert.equal(d.mechanism_assessment.market_common_structure.status,'OBSERVED');

assert.equal(raw.evidence_availability.signed_flow_ofi,'UNAVAILABLE');
assert.equal(raw.evidence_availability.order_book_depth,'UNAVAILABLE');
assert.equal(raw.evidence_availability.synchronized_analyst_revision_panel,'UNAVAILABLE');
assert.equal(raw.authority.trading_authority,false);
assert.equal(raw.authority.causal_authority,false);
assert.ok(raw.data_quality.by_symbol.MU.includes('TRQUANT_STRUCTURED_LAGS_SEP30_Q4_PRIMARY_RELEASE'));
assert.ok(raw.data_quality.by_symbol.AVGO.includes('TRQUANT_STRUCTURED_FUNDAMENTALS_UNAVAILABLE'));

console.log(JSON.stringify({PASS:true,snapshot_id:d.snapshot_id,theme:d.theme,mu_event_path:d.event_paths.MU_Q4_2026},null,2));
