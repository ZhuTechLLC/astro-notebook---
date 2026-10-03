import assert from 'node:assert/strict';
import {DEFAULT_CASE01_CONFIG,runCase01,replayCase01,compareCase01Runs} from '../../experiments/market-emergence-v4a/labs/emergence/case01-engine.mjs';
const cfg={...DEFAULT_CASE01_CONFIG,duration_ms:30000,sample_interval_ms:250,source_commit:'candidate'};
const b1=runCase01({kind:'baseline',config:cfg});const b2=runCase01({kind:'baseline',config:cfg});assert.deepEqual(b1.samples,b2.samples);
const info=runCase01({kind:'theme_information_repricing',config:cfg});const flow=runCase01({kind:'common_theme_flow',config:cfg});
assert.ok(info.fingerprint.theme_fair_shift>0.005);assert.ok(info.fingerprint.permanent_reference_component>0.005);assert.ok(Math.abs(flow.fingerprint.theme_fair_shift)<1e-12);
assert.equal(info.fingerprint.exogenous_share_of_total_flow,0);assert.ok(flow.fingerprint.exogenous_share_of_total_flow>0.05);assert.ok(info.fingerprint.post_intervention_recovery_index_points<0);assert.ok(flow.fingerprint.post_intervention_recovery_index_points>1);
assert.deepEqual(replayCase01(info).samples,info.samples);assert.deepEqual(replayCase01(flow).samples,flow.samples);
for(const run of [b1,info,flow]){assert.ok(run.accounting_reconciliation_error<1e-12);assert.equal(run.config.source_commit,'candidate');assert.equal(run.samples[0].t_ms,0);assert.equal(run.samples.at(-1).t_ms,30000);for(const k of ['reference','exogenousFlow','endogenousFlow','network','residual'])assert.ok(Number.isFinite(run.accounting[k]));}
const cmp=compareCase01Runs(info,flow);assert.ok(Math.abs(cmp.deltas.theme_fair_shift)>0.005);assert.ok(Math.abs(cmp.deltas.exogenous_share_of_total_flow)>0.05);assert.ok(Math.abs(cmp.deltas.post_intervention_recovery_index_points)>1);
console.log(JSON.stringify({PASS:true,baseline_final:b1.fingerprint,info:info.fingerprint,flow:flow.fingerprint,deltas:cmp.deltas},null,2));
