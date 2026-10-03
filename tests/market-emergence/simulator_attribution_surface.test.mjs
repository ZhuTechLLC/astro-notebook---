import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const dir=path.join(root,'experiments/market-emergence-v4a/labs/emergence');
const app=fs.readFileSync(path.join(dir,'app.js'),'utf8');
const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');

assert.doesNotMatch(app,/;\\nconst canvas=/,'literal \\n must never enter executable JavaScript');
assert.doesNotMatch(html,/<\/span>\\n\s*<span>/,'literal \\n must not leak into visible HTML');
assert.match(html,/id="flockCanvas"/);
assert.match(html,/id="marketCanvas"/);
assert.match(html,/echarts@5\.5\.1/);
assert.match(html,/id="marketPriceChart"/);
assert.match(html,/id="marketCrossChart"/);
assert.match(html,/id="attributionChart"/);
assert.match(app,/recordAnalytics\(\)/);
assert.match(app,/ATTR_LABELS/);
assert.match(app,/components:\{flow:0,information:0,attention:0,network:0,noise:0\}/);
assert.match(app,/整体市场 · SPY/);
assert.match(app,/模型内部归因/);

console.log('Market emergence simulator surface + attribution: PASS');
