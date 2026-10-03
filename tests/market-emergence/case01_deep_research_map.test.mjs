import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const casePath=path.join(root,'experiments/market-emergence-v4a/cases/case-01-deep-research-map.v1.json');
const data=JSON.parse(fs.readFileSync(casePath,'utf8'));

assert.equal(data.schema_version,'case01_deep_research_map_v1');
assert.equal(data.case_id,'case-01-semiconductor-synchronised-rise');
assert.deepEqual(data.universe.assets,['NVDA','AMD','AVGO','MU','AMAT','LRCX']);

assert.ok(data.expectation_state.dimensions.includes('expected_end_demand'));
assert.ok(data.expectation_state.dimensions.includes('expected_margin_operating_leverage'));

assert.ok(data.mechanism_grammar.initiator.includes('theme_information'));
assert.ok(data.mechanism_grammar.initiator.includes('common_flow'));
assert.ok(data.mechanism_grammar.amplifier.includes('trend_feedback'));

assert.ok(data.first_ab.A.must_not_inject.includes('exogenous_common_flow'));
assert.ok(data.first_ab.B.must_not_change.includes('theme_reference_anchor'));
assert.ok(data.first_ab.shared.includes('seed'));

assert.ok(data.attribution_policy.prohibited.includes('double_count_information_and_its_induced_flow_as_independent_causes'));
assert.equal(data.current_data_readiness.trading_authority,false);

assert.ok(data.next_engine_slice.includes.includes('replay'));
assert.ok(data.next_engine_slice.excludes.includes('ui_redesign'));
assert.ok(data.next_engine_slice.excludes.includes('trade_recommendation'));

console.log('Case 01 deep research map: PASS');
