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

for(const id of ['flockCanvas','marketCanvas','noiseSlider','networkSlider','liquiditySlider','case01-lab','case01PathChart','case01CrossTable']){
  assert.ok(html.includes('id="'+id+'"'),id+' missing');
}
for(const kind of ['theme_information_repricing','common_theme_flow']){
  assert.ok(html.includes('data-case01-run="'+kind+'"'),kind+' UI control missing');
  assert.ok(app.includes(kind),kind+' app path missing');
}

assert.ok(app.includes("from './case01-engine.mjs'"));
assert.ok(app.includes("from './case01-evidence.mjs'"));
assert.ok(app.includes("case01-real-2026-10-02.raw.json"));
assert.ok(app.includes('deriveCase01RealEvidence'));
assert.ok(app.includes('runCase01'));

for(const core of ['function step(','function shock(','function metaorder(','function resetSim(']){
  assert.ok(app.includes(core),'core simulator behavior missing: '+core);
}

assert.ok(html.includes('共同运动 ≠ 拥挤'));
assert.ok(html.includes('缺的数据保持未知'));
assert.ok(css.includes('.case01-section'));
assert.ok(css.includes('.case01-scenario-buttons'));

console.log(JSON.stringify({PASS:true,core_simulator_preserved:true,case01_ui_present:true},null,2));
