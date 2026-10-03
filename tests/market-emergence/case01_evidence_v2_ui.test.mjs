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

for(const id of [
  'flockCanvas','marketCanvas','case01-lab','case01PathChart','case01TimingChart',
  'case01Macro5m','case01OpenClose','case01MuEpsBeat','case01SoxqFlow','case01EvidenceVerdict'
]){
  assert.ok(html.includes('id="'+id+'"'),id+' missing');
}
assert.ok(app.includes("from './case01-evidence-v2.mjs'"));
assert.ok(app.includes("case01-evidence-v2-2026-10-02.raw.json"));
assert.ok(app.includes('deriveCase01EvidenceV2'));
assert.ok(app.includes('renderCase01EvidenceV2'));
assert.ok(app.includes('case01TimingChart'));
assert.ok(html.includes('现有 ETF 代理没有显示明显申购浪潮'));
assert.ok(html.includes('不能直接升级成“整个半导体主题同步上修”'));
assert.ok(html.includes('成交量不能排除机构篮子'));
assert.ok(css.includes('.case01-discrimination-grid'));
for(const core of ['function step(','function shock(','function metaorder(','function resetSim(']){
  assert.ok(app.includes(core),'core simulator behavior missing: '+core);
}
console.log(JSON.stringify({PASS:true,core_simulator_preserved:true,evidence_v2_ui_present:true},null,2));
