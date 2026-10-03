import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {deriveCase01EvidenceV2} from '../../experiments/market-emergence-v4a/labs/emergence/case01-evidence-v2.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const raw=JSON.parse(fs.readFileSync(path.join(root,'experiments/market-emergence-v4a/cases/evidence/case01-evidence-v2-2026-10-02.raw.json'),'utf8'));
const d=deriveCase01EvidenceV2(raw);
const near=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<=t,String(a)+' != '+String(b));

near(d.intraday.labor_0830_5m.theme,0.007172062488216631);
near(d.intraday.labor_0830_30m.theme,0.010406818456254241);
near(d.intraday.labor_0830_to_open.theme,0.0041667973752149146);
near(d.intraday.open_first_30m.theme,0.0039440072389946845);
near(d.intraday.regular_session.theme,-0.0019086958144818127);
near(d.intraday.by_symbol.MU.labor_0830_to_open,-0.00568568859501728);

near(d.expectation.eps_guidance_vs_consensus,0.05913381454747357);
near(d.expectation.revenue_guidance_vs_consensus,0.08331865421877738);
assert.equal(d.expectation.explicit_target_raises_in_sample,4);

near(d.flow.SOXQ.aum_adjusted_flow_proxy_usd,-3175695.7512130737,0.01);
near(d.flow.SOXQ.aum_adjusted_flow_proxy_pct_prior_aum,-0.0009816679292776118,1e-12);
near(d.flow.SOXQ.volume_vs_30d_avg,0.9937646141855028);
near(d.flow.SMH.volume_vs_30d_avg,1.1569060773480664);

assert.equal(d.mechanism_assessment.macro_relief_timing.status,'TIMING_SUPPORT');
assert.equal(d.mechanism_assessment.theme_information_repricing.status,'PARTIAL_SINGLE_NAME_SUPPORT');
assert.equal(d.mechanism_assessment.common_theme_flow.status,'NO_SUPPORT_FROM_AVAILABLE_ETF_PROXY');
assert.equal(d.mechanism_assessment.persistent_intraday_accumulation.status,'NOT_OBSERVED');
assert.equal(d.mechanism_assessment.liquidity_amplification.status,'UNRESOLVED');
assert.equal(raw.authority.trading_authority,false);
assert.equal(raw.authority.causal_authority,false);

console.log(JSON.stringify({PASS:true,snapshot_id:d.snapshot_id,assessment:d.mechanism_assessment},null,2));
