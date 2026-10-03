import assert from 'node:assert/strict';
import {
  agentSignal,
  alignmentRatio,
  normalizedConcentration,
  createSeededRandom,
  applyInformationShockToFairValue
} from '../../experiments/market-emergence-v4a/labs/emergence/model-rules.mjs';

const cfg={retailGain:1,trendGain:1,meanRevGain:1,dealerGain:1};
const base={cfg,eps:0,fair:100,price:100,momentum:0,ret:0,volatility:.02,infoShock:0,attention:0,inventory:0,lastFlow:0};

assert(agentSignal('statarb',{...base,price:90})>0,'undervalued asset should attract mean-reversion buying');
assert(agentSignal('statarb',{...base,price:110})<0,'overvalued asset should attract mean-reversion selling');
assert(agentSignal('retail',{...base,infoShock:-1,attention:1})<0,'attention must amplify negative information, not flip it positive');
assert.equal(agentSignal('retail',{...base,attention:1}),0,'attention alone is magnitude, not a buy-direction signal');
assert(Math.abs(agentSignal('trend',{...base,momentum:.01,volatility:.10}))<Math.abs(agentSignal('trend',{...base,momentum:.01,volatility:.01})),'higher volatility should reduce trend response');

assert.equal(alignmentRatio(0,2),0);
assert.equal(alignmentRatio(2,2),1);
assert(Math.abs(normalizedConcentration([1,1,1,1]))<1e-12,'equal order-flow activity should have zero normalized concentration');
assert(Math.abs(normalizedConcentration([4,0,0,0])-1)<1e-12,'single-asset order-flow activity should have unit normalized concentration');

assert(applyInformationShockToFairValue(100,1,1)>100,'positive information shock should raise the model fair value');
assert(applyInformationShockToFairValue(100,-1,1)<100,'negative information shock should lower the model fair value');
assert.equal(applyInformationShockToFairValue(100,0,1),100,'zero-direction shock should not move fair value');

const rngA=createSeededRandom(20261003);
const rngB=createSeededRandom(20261003);
const seqA=[rngA(),rngA(),rngA(),rngA()];
const seqB=[rngB(),rngB(),rngB(),rngB()];
assert.deepEqual(seqA,seqB,'same simulation seed must reproduce the same economic random stream');

console.log('P0 market-emergence semantic rules v2: PASS');
