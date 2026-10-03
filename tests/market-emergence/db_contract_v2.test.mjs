import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const db=path.join(root,'infrastructure/trquant-financial-math-db');
const migration=fs.readFileSync(path.join(db,'migrations/003_concept_estimator_model.sql'),'utf8');
const readme=fs.readFileSync(path.join(db,'README.md'),'utf8');
const asOf=fs.readFileSync(path.join(db,'queries/as_of_estimator_observations.sql'),'utf8');
const concept=fs.readFileSync(path.join(db,'queries/concept_evidence_snapshot.sql'),'utf8');

assert.match(migration,/CREATE TABLE concept_definitions/);
assert.match(migration,/CREATE TABLE concept_estimator_links/);
assert.match(migration,/ALTER TABLE metric_definitions RENAME TO estimator_definitions/);
assert.match(migration,/ALTER TABLE metric_observations RENAME TO estimator_observations/);
assert.match(migration,/CREATE VIEW latest_estimator_observations/);
assert.match(migration,/DO \$\$[\s\S]*END;\s*\$\$;/,'PL/pgSQL DO block must terminate END with semicolon');

for(const code of ['A','C','Q','L','E','P']){
  assert.match(migration,new RegExp("WHERE estimator_code = '"+code+"'"),code+' estimator code must be preserved');
}
assert.doesNotMatch(migration,/DELETE\s+FROM\s+estimator_definitions/i);
assert.doesNotMatch(migration,/status\s*=\s*'retired'/i);

assert.match(migration,/Q[\s\S]*不等于 Crowding/);
assert.match(migration,/L[\s\S]*不等于 Liquidity/);
assert.match(migration,/rho\(K\)[\s\S]*不是多元系统的通用 endogenous-event fraction/);
assert.match(migration,/rho\(B_t\)[\s\S]*不等于通用 Propagation/);

assert.match(readme,/A \/ C \/ Q \/ L \/ E \/ P/);
assert.match(readme,/not.*closed list|不是.*闭|not.*fixed/i);
assert.doesNotMatch(readme,/six market-state codes/i);
assert.doesNotMatch(readme,/A\/C\/Q\/L\/E\/P snapshot/i);

assert.match(asOf,/estimator_observations/);
assert.match(concept,/concept_estimator_links/);
assert.match(concept,/LEFT JOIN LATERAL/);
assert.match(concept,/evidence_status/);
assert.match(concept,/'UNKNOWN'/);
assert.doesNotMatch(concept,/IN\s*\(\s*'A'\s*,\s*'C'\s*,\s*'Q'\s*,\s*'L'\s*,\s*'E'\s*,\s*'P'\s*\)/i);

assert.equal(fs.existsSync(path.join(db,'queries/as_of_metrics.sql')),false,'retired metric query must not remain active');
assert.equal(fs.existsSync(path.join(db,'queries/market_state_snapshot.sql')),false,'fixed six-state snapshot query must not remain active');

console.log('Financial Math Concept/Estimator contract v2: PASS');
