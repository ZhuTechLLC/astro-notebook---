import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {deriveCase01EvidenceV2} from '../../experiments/market-emergence-v4a/labs/emergence/case01-evidence-v2.mjs';
import {runCase01} from '../../experiments/market-emergence-v4a/labs/emergence/case01-engine.mjs';
import {buildCase01MechanismChallenger} from '../../experiments/market-emergence-v4a/labs/emergence/case01-challenger.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const raw=JSON.parse(fs.readFileSync(path.join(root,'experiments/market-emergence-v4a/cases/evidence/case01-evidence-v2-2026-10-02.raw.json'),'utf8'));
const evidenceV2=deriveCase01EvidenceV2(raw);
const runs={
  theme_information_repricing:runCase01({kind:'theme_information_repricing'}),
  common_theme_flow:runCase01({kind:'common_theme_flow'})
};
const d=buildCase01MechanismChallenger({evidenceV2,runs});

assert.equal(d.schema_version,'case01_mechanism_challenger_v1');
assert.equal(d.outcome,'NEITHER_SINGLE_MECHANISM_SUFFICIENT');
assert.equal(d.real_fingerprint.path_shape,'REVERSAL_DOMINANT');
assert.ok(d.real_fingerprint.retention_ratio>0&&d.real_fingerprint.retention_ratio<.5);

const A=d.hypotheses.theme_information_repricing.rows;
const B=d.hypotheses.common_theme_flow.rows;
assert.equal(A.find(x=>x.id==='broad_market_co_move').status,'CONFLICT');
assert.equal(A.find(x=>x.id==='post_event_path').status,'CONFLICT');
assert.equal(A.find(x=>x.id==='theme_excess').status,'MATCH');
assert.equal(A.find(x=>x.id==='direct_expectation_evidence').status,'PARTIAL');
assert.equal(B.find(x=>x.id==='broad_market_co_move').status,'CONFLICT');
assert.equal(B.find(x=>x.id==='post_event_path').status,'MATCH');
assert.equal(B.find(x=>x.id==='theme_excess').status,'MATCH');
assert.equal(B.find(x=>x.id==='direct_flow_evidence').status,'UNKNOWN');

assert.equal(d.challenger_conclusion.next_hypothesis,'MACRO_COMMON_REPRICING_PLUS_HETEROGENEOUS_EXPECTATIONS');
assert.equal(d.evidence_queue.filter(x=>x.priority==='P0').length,2);
assert.ok(d.evidence_queue.every(x=>x.status==='UNAVAILABLE'));

console.log(JSON.stringify({
  PASS:true,
  outcome:d.outcome,
  real_fingerprint:d.real_fingerprint,
  A:d.hypotheses.theme_information_repricing.counts,
  B:d.hypotheses.common_theme_flow.counts,
  next_hypothesis:d.challenger_conclusion.next_hypothesis
},null,2));
