import assert from 'node:assert/strict';
import {agentSignal,alignmentRatio,normalizedConcentration,networkShockTransfer,isMaterialTransfer} from '../../experiments/market-emergence-v4a/labs/emergence/model-rules.mjs';

const cfg={retailGain:1,trendGain:1,meanRevGain:1,dealerGain:1};
const base={cfg,eps:0,fair:100,price:100,momentum:0,ret:0,volatility:.02,infoShock:0,attention:0,inventory:0,lastFlow:0};

assert(agentSignal('statarb',{...base,price:90})>0,'undervalued asset should attract mean-reversion buying');
assert(agentSignal('statarb',{...base,price:110})<0,'overvalued asset should attract mean-reversion selling');
assert(agentSignal('retail',{...base,infoShock:-1,attention:1})<0,'attention must amplify negative information, not flip it positive');
assert.equal(agentSignal('retail',{...base,attention:1}),0,'attention alone is magnitude, not a buy-direction signal');
assert(Math.abs(agentSignal('trend',{...base,momentum:.01,volatility:.10}))<Math.abs(agentSignal('trend',{...base,momentum:.01,volatility:.01})),'higher volatility should reduce trend response');
assert.equal(alignmentRatio(0,2),0);
assert.equal(alignmentRatio(2,2),1);
assert(Math.abs(normalizedConcentration([1,1,1,1]))<1e-12,'equal exposure should have zero normalized concentration');
assert(Math.abs(normalizedConcentration([4,0,0,0])-1)<1e-12,'single-asset exposure should have unit normalized concentration');
const disabled=networkShockTransfer(.5,0,1);
assert.equal(disabled,0);
assert.equal(isMaterialTransfer(disabled),false,'disabled network must not count as transfer');
console.log('P0 market-emergence semantic rules: PASS');
