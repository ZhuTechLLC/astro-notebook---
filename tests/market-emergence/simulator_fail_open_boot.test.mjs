import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const app=fs.readFileSync(path.join(root,'experiments/market-emergence-v4a/labs/emergence/app.js'),'utf8');

assert.ok(!app.includes("import {buildCase01MechanismChallenger} from './case01-challenger.mjs';"));
assert.ok(app.includes("await import('./case01-challenger.mjs')"));
assert.ok(app.includes("Optional Case 01 challenger failed; core simulator remains active."));
assert.ok(app.includes("Optional analytics init failed; core simulator remains active."));

const boot=app.indexOf("if(canvas&&ctx){");
const raf=app.indexOf("requestAnimationFrame(draw)",boot);
const analytics=app.indexOf("try{initAnalytics()}",boot);
assert.ok(boot>=0&&raf>boot&&analytics>raf,'core draw must be scheduled before optional analytics init');

for(const core of ['function step(','function shock(','function metaorder(','function resetSim(']){
  assert.ok(app.includes(core),'core simulator behavior missing: '+core);
}
console.log(JSON.stringify({PASS:true,fail_open_core_boot:true,challenger_lazy_loaded:true},null,2));
