import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('experiments/market-emergence-v4a/labs/emergence/index.html');
const app=read('experiments/market-emergence-v4a/labs/emergence/app.js');
const css=read('experiments/market-emergence-v4a/labs/emergence/styles.css');

for(const id of ['marketCanvas','flockCanvas','case01ChallengeA','case01ChallengeB','case01ChallengerOutcome','case01VerdictA','case01VerdictB']){
  assert.ok(html.includes('id="'+id+'"'),id+' missing');
}
assert.ok(app.includes("from './case01-challenger.mjs'"));
assert.ok(app.includes('buildCase01MechanismChallenger'));
assert.ok(app.includes('renderCase01Challenger'));
assert.ok(app.includes("case01DataV2=deriveCase01EvidenceV2"));
assert.ok(app.includes("renderCase01Challenger();"));
assert.ok(html.includes('宏观共同重估 + 个股 / 主题异质预期'));
assert.ok(html.includes('ETF / 个股有符号资金流或 OFI'));
assert.ok(css.includes('.case01-challenger-grid'));
for(const core of ['function step(','function shock(','function metaorder(','function resetSim(']){
  assert.ok(app.includes(core),'core simulator behavior missing: '+core);
}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const dup=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];
assert.deepEqual(dup,[]);
console.log(JSON.stringify({PASS:true,challenger_ui_present:true,core_simulator_preserved:true},null,2));
