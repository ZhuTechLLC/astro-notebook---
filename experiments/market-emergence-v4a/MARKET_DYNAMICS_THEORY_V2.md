# TRQuant Market Dynamics Theory & Algorithm v2

Status: FROZEN FOR NEXT DEVELOPMENT CHECKPOINT  
Scope: Market Dynamics Laboratory / simulator / case design  
Base commit: `2dcd1d3d69b1b7f7c926a45ec3c833488e3951de`

---

## 1. Mission

TRQuant Market Dynamics does **not** attempt to build a perfect digital twin of the stock market.

Its mission is:

> Find the smallest set of market states and mechanisms that can explain decision-relevant price behavior, test them through controlled counterfactual experiments, compare them against real-market evidence, and keep only what improves investment decisions.

The product-facing Market Laboratory exists to make these states, mechanisms, feedback loops, interventions, uncertainty, and competing explanations visible and testable.

The final authority is not visual plausibility or model fit. It is incremental investment value under controlled risk and cost.

---

## 2. Canonical research chain

The canonical chain is:

[
oxed{
	ext{Investment Question}
ightarrow
	ext{Observables}
ightarrow
	ext{Competing Mechanisms}
ightarrow
	ext{Estimators}
ightarrow
	ext{Evidence}
ightarrow
	ext{Decision Relevance}
ightarrow
	ext{Outcome / Learning}
}
]

No fixed set of market dimensions is assumed.

A concept is not a number by itself. A concept is informed by one or more estimators, each with explicit data, horizon, scope, and uncertainty.

---

## 3. Core objects

Let:

- (X_t): high-dimensional market microstate, usually only partially observed.
- (Z_t): compressed decision-relevant market state.
- (U_t): intervention or shock applied in a controlled experiment.
- (M_t): finite memory needed because compression may destroy Markov closure.
- (Psi_{t:t+h}): dynamics fingerprint over horizon (h), e.g. return path, drawdown, propagation, reversal, impact decay, recovery, acceleration.
- (mathcal{M}={M_1,ldots,M_k}): competing mechanisms.

The compressed-state goal is not “predict price from a few variables.” It is:

[
P(Psi_{t:t+h}mid X_{le t}, do(U))
approx
P(Psi_{t:t+h}mid Z_t,M_t,do(U))
]

for the investment questions and horizons we actually care about.

This is a research hypothesis, not an already-proven universal law.

---

## 4. Eight mechanism layers

The Market Laboratory should organize theory around eight mechanism layers.

### 4.1 Heterogeneity

Different participants use different decision rules, horizons, constraints, and reaction speeds.

An agent is represented by a response function, not by a literal real-world person:

[
q_{a,i,t}=f_a(	ext{information},	ext{return},	ext{momentum},	ext{mispricing},	ext{volatility},	ext{inventory},	ext{constraints},ldots)
]

Useful canonical families:

- attention / discretionary flow;
- fundamental / valuation-sensitive;
- trend / momentum;
- statistical mean-reversion;
- dealer / inventory-sensitive liquidity supply;
- high-frequency / short-horizon liquidity response;
- passive / benchmark / rebalance flow;
- constrained / forced flow when an explicit constraint exists.

The simulator may visualize participants individually, but the theory does not require preserving every microscopic agent.

### 4.2 Information / reference repricing

The simulator uses a latent reference anchor (v_{i,t}), not a claim of true fundamental value.

A simple hierarchical shock structure is:

[
Delta v_{i,t}
=
eta_i^M I_t^M
+
eta_i^S I_t^S
+
I_{i,t}^{idio}
]

where:

- (I_t^M): market-wide information;
- (I_t^S): sector/theme information;
- (I_{i,t}^{idio}): stock-specific information.

This lets cases distinguish:

- market repricing;
- theme repricing;
- leader-specific repricing;
- pure flow with no reference-anchor change.

### 4.3 Order flow

Participant decisions are compressed into signed flow:

[
OFI_{i,t}=sum_a w_{a,t}q_{a,i,t}
]

Additional summaries can include:

- absolute flow;
- participant mix;
- flow persistence;
- flow concentration across assets;
- flow concentration across participant classes.

The visual location of agents is illustrative. The economically meaningful object is the flow they generate.

### 4.4 Price formation / impact

A minimal price response is:

[
r_{i,t}
=
r^{info}_{i,t}
+
r^{flow}_{i,t}
+
r^{network}_{i,t}
+
epsilon_{i,t}
]

with:

[
r^{flow}_{i,t}
=
kappa_{i,t} OFI_{i,t}
]

and (kappa_{i,t}) depending on market depth and liquidity conditions.

Liquidity must remain multidimensional:

[
oxed{
	ext{Liquidity}
=
{	ext{Spread},	ext{Depth},	ext{Impact},	ext{Resiliency}}
}
]

Price Impact alone is not Liquidity.

### 4.5 Feedback / reflexivity

Two directions must be separated:

Flow to price:

[
K_t=rac{partial r_t}{partial F_t}
]

Price to future flow:

[
B_h=rac{partial F_{t+h}}{partial r_t}
]

A compact feedback operator is:

[
G_h=K_t B_h
]

In multiple assets, (K), (B), and (G) are matrices.

Reflexivity is therefore better treated as feedback structure in system dynamics than as one scalar market “dimension.”

For stability questions, inspect the relevant Jacobian / feedback operator rather than using a universal one-dimensional threshold.

### 4.6 Cross-asset structure / network

A network edge can represent different things and must never be semantically overloaded.

Possible edge meanings:

- statistical co-movement;
- lead-lag relation;
- estimated dynamic response;
- known economic relationship;
- common ownership / ETF exposure;
- supplier-customer relation;
- model-internal propagation link.

The UI must make the active edge semantics explicit.

“Connectedness,” “spillover,” and “transmission” are not interchangeable.

Transmission requires a specified economic channel plus sufficiently strong identification evidence.

### 4.7 Liquidity / constraints

The same flow can produce very different price changes when depth and recovery differ.

A simple illustrative relation:

[
|r^{flow}|
propto
rac{|OFI|}{Depth}
]

Transient impact may recover:

[
Impact(t)
=
Impact_{infty}
+
Impact_{0}^{transient} e^{-kt}
]

Forced flow should be used only when a concrete constraint generates mechanically required trading, e.g.:

- margin;
- redemption;
- benchmark rebalance;
- volatility target;
- risk limit;
- ETF creation/redemption;
- financing constraint.

### 4.8 Memory / market environment

Compression may create memory:

[
Z_{t+1}
=
F(Z_t,U_t)
+
sum_{	au=1}^{L}K_{	au}Z_{t-	au}
+
eta_t
]

This does not imply that a full memory-kernel model must be built now.

“Market Environment” is the default label for manually configured conditions such as trend-heavy, concentrated-flow, or low-liquidity scenarios.

Use “Regime” only when an explicit regime/state model is actually estimated or simulated.

---

## 5. Current simulator accounting

The current visual simulator is an illustrative mechanism engine, not an empirical estimator.

Its internal price update currently contains model-internal components corresponding to:

- information shock;
- order-flow impact;
- attention-related response;
- network propagation;
- random disturbance.

For v2 theory, **attention is primarily a modifier of participant behavior**, not an independent real-market causal category.

Future case attribution should therefore prefer the conceptual hierarchy:

[
	ext{Information}
+
	ext{Flow}
+
	ext{Feedback}
+
	ext{Network}
+
	ext{Liquidity / Constraint Effects}
+
	ext{Residual}
]

and avoid double-counting attention both inside behavior and again as an independent cause.

Simulation accounting can be exact because the simulator generated the components.

Real-market attribution cannot assume the same decomposition is known.

---

## 6. Two-level price attribution

The preferred hierarchy is:

### Level 1: market / theme / stock-specific

[
r_{i,t}
=
eta_i^M r_{M,t}
+
eta_i^S r_{S,t}
+
r_{i,t}^{idio}
]

This answers:

- Is the move mostly market-wide?
- Is it mostly theme/sector-wide?
- Is the stock behaving idiosyncratically?

### Level 2: mechanism explanation

For the residual / incremental move:

[
r_{i,t}^{idio}
sim
	ext{Information}
+
	ext{Flow}
+
	ext{Feedback}
+
	ext{Network}
+
	ext{Liquidity}
+
	ext{Residual}
]

In simulation, these can be accounting contributions.

In real markets, they are competing hypotheses supported by estimators and evidence. Do not display unsupported causal percentages.

---

## 7. Estimator map

| Concept / question | Simulation object | Real-market estimator candidates | Boundary |
|---|---|---|---|
| Signed directional flow | agent orders / OFI | signed flow, OFI | Does not identify motive |
| Flow concentration | activity shares | normalized HHI on named distribution | Not Crowding by itself |
| Common movement | simulated correlation | PCA / eigenspectrum / RMT comparison | Not a causal common factor by itself |
| Price Impact | known flow-to-price coefficient | return/price change vs OFI conditional on depth | Not whole Liquidity |
| Depth | configured liquidity state | order-book depth / quoted depth | One liquidity dimension |
| Resiliency | impact recovery | post-shock recovery / decay | Requires explicit horizon |
| Return-flow response | programmed agent feedback | future flow conditional on prior return, LP / distributed-lag design | Response is not automatically causal feedback |
| Dynamic connectedness | programmed propagation links | lead-lag, VAR, IRF, FEVD, Local Projection | Connectedness != Transmission |
| Event self-excitation | explicit event process | Hawkes-type event model | Only use when modeling events |
| Structural environment change | scenario switch | change-point / HMM / Markov switching when explicitly fit | Ordinary environment != Regime |
| Constraint flow | explicit forced trade | margin/redemption/rebalance/constraint data | Must identify the constraint |
| Crowding | not directly inferable from flow HHI | holdings/exposure/flow concentration + exit capacity + common constraints | Requires multiple evidence types |

---

## 8. Stable estimator codes are not ontology

A / C / Q / L / E / P may remain stable database estimator codes for continuity.

They are not canonical market dimensions.

Current meanings:

- A: signed-flow directional alignment;
- C: first common-mode share of a correlation matrix;
- Q: normalized HHI of an explicitly named distribution;
- L: OFI price-impact coefficient;
- E: spectral radius of a specified Hawkes kernel;
- P: spectral radius of a specified dynamic network feedback matrix.

Boundaries:

- Q alone != Crowding.
- L alone != Liquidity.
- E != generic market endogeneity.
- P != generic spillover or causal transmission.

---

## 9. Simulation truth vs real-market evidence

The system must preserve a hard distinction between three worlds.

### 9.1 Simulation truth

The simulator knows:

- which shock was injected;
- which agents responded;
- which order flows were generated;
- which network links propagated effects;
- which price components were added.

Therefore exact accounting attribution is allowed.

### 9.2 Real-market evidence

The real market exposes observables, not hidden mechanism labels.

We observe some combination of:

- prices;
- returns;
- volume;
- quotes/order book;
- signed flow;
- ETF flows;
- holdings/exposures;
- corporate events;
- analyst revisions;
- news;
- options;
- cross-asset timing.

Estimators provide evidence for or against mechanisms.

Unless identification is sufficient, outputs should use language such as:

- supports;
- inconsistent with;
- stronger/weaker evidence;
- remains plausible;
- UNKNOWN.

### 9.3 Investment decision

Only after evidence is linked to a concrete decision should the model affect investment action.

Decision relevance can include:

- research priority;
- entry timing;
- whether to follow or fade a move;
- expected persistence;
- risk / sizing constraint;
- exit condition;
- horizon;
- confidence.

Simulation alone does not authorize capital.

---

## 10. Canonical case matrix

### Case 01 — Why are semiconductors rising together?

**Question**

Why are multiple semiconductor-related stocks rising at the same time?

**Competing mechanisms**

1. market-wide risk-on / beta;
2. common semiconductor information repricing;
3. leader-specific information followed by peer propagation;
4. common ETF / portfolio flow;
5. trend-following feedback;
6. liquidity amplification;
7. random/coincidental co-movement.

**Simulator interventions**

- market information shock;
- semiconductor-theme information shock;
- NVDA-only information shock;
- persistent multi-asset theme flow;
- stronger trend-agent response;
- lower depth;
- stronger/weaker cross-asset propagation.

**Core outputs**

- Market -> Theme -> Stock price paths;
- cross-section of asset returns;
- participant-flow mix;
- propagation map;
- feedback strength;
- model-internal attribution;
- counterfactual A/B comparison.

**Real evidence candidates**

- factor residualization;
- event study / revisions;
- ETF and signed flow;
- OFI / price impact;
- return-flow response;
- lead-lag / LP / VAR / FEVD;
- depth / spread / recovery.

**Decision relevance**

Distinguish persistent repricing from transient flow, feedback-driven continuation, or liquidity amplification.

---

### Case 02 — Does a leader move propagate to peers?

Example: NVDA -> AMD / AVGO / QQQ.

**Question**

Is the observed peer move simply common information, or is there directional propagation?

**Competing mechanisms**

- common simultaneous information;
- leader-specific information;
- common factor;
- lead-lag flow;
- real economic link;
- trend imitation.

**Required discipline**

A moving line in the simulator is not evidence of real transmission.

Real-market escalation path:

[
Co	ext{-}movement
ightarrow
Lead	ext{-}lag
ightarrow
Dynamic Response
ightarrow
Economic Channel
ightarrow
Transmission
]

---

### Case 03 — Why does the same sell flow produce a much larger decline?

**Question**

Why can identical signed flow have modest impact in one environment and severe impact in another?

**Mechanisms**

- depth deterioration;
- wider spread;
- larger impact coefficient;
- slower resiliency;
- dealer inventory constraint;
- forced/constrained selling;
- feedback amplification.

**Core outputs**

- identical flow under different liquidity states;
- peak impact;
- time to recovery;
- residual permanent move;
- dealer / constrained-flow participation.

This case should be the primary testbed for Price Impact / Depth / Resiliency.

---

### Case 04 — How does concentrated participation become fragile?

Do not automatically label this “Crowding.”

**Question**

When does concentration become a dangerous exit problem?

**Mechanisms**

- concentrated holdings/exposure;
- concentrated active flow;
- correlated constraints;
- shrinking exit capacity;
- shared stop/deleveraging rules;
- liquidity feedback.

**Simulator outputs**

- concentration;
- common directional flow;
- exit capacity;
- nonlinear impact under synchronized liquidation.

**Real evidence requirement**

Use Crowding only when holdings/exposure/flow concentration plus shared constraints and exit capacity are sufficiently supported.

---

## 11. Algorithm priority tiers

### P0 — Required for Market Laboratory v1

- deterministic seeded simulation;
- event/shock injection;
- heterogeneous participant rules;
- signed flow / OFI;
- hierarchical Market -> Theme -> Stock structure;
- price impact with depth dependence;
- transient/permanent impact distinction where relevant;
- feedback loop;
- cross-asset propagation with explicit semantics;
- market/theme/idiosyncratic decomposition;
- counterfactual A/B experiment;
- event timeline and replay;
- simulation accounting attribution;
- evidence requirements attached to each mechanism.

### P1 — Add when a case requires it

- PCA / eigenspectrum / RMT comparison;
- event study;
- factor residualization;
- Local Projection;
- VAR / IRF / FEVD;
- Hawkes;
- change-point detection;
- HMM / Markov switching;
- holdings / exposure network;
- constraint-specific forced-flow models.

### P2 — Research challengers only

- Koopman / DMD;
- SINDy;
- Mori-Zwanzig reduced dynamics;
- GNN / neural operator;
- full ABM calibration;
- large-scale order-book digital twin.

P2 methods must not become core dependencies without clear incremental decision value.

---

## 12. Kill rule and development gate

The default complexity gate is:

[
oxed{
Delta Complexity > Delta Investment Value
Rightarrow STOP
}
]

Every new theory, estimator, data source, or simulation feature should answer:

1. Does the phenomenon exist in real data?
2. Can it be identified with reasonable stability?
3. Does it add decision information beyond the current baseline?
4. Does it improve forward/shadow performance?
5. Does small-capital live evidence remain positive?
6. Does it improve LIU or materially reduce risk?

Possible lifecycle:

[
Keep ightarrow Validate ightarrow Scale
]

or:

[
Keep ightarrow Demote ightarrow Kill
]

---

## 13. Explicit non-goals

Do not make the following default development targets:

- full stock-market digital twin;
- thousands of finely calibrated agents;
- exact K-line fit;
- universal six-variable state vector;
- dozens of proprietary indicators without incremental value;
- complete Koopman/SINDy/Mori-Zwanzig implementation;
- exchange-grade matching engine unless a concrete case needs it;
- “AI agents” merely for appearance;
- causal labels inferred from simulation graphics;
- direct trading authority from simulator output.

---

## 14. Product interpretation

The central 2D simulator is not decorative.

Its role is to make the following chain observable:

[
oxed{
	ext{Participants}
ightarrow
	ext{Behavior}
ightarrow
	ext{Flow}
ightarrow
	ext{Price}
ightarrow
	ext{Network}
ightarrow
	ext{Feedback}
ightarrow
	ext{Emergent Structure}
}
]

The product should let a user:

1. observe;
2. inject a shock;
3. change one mechanism;
4. compare a counterfactual;
5. inspect Market -> Theme -> Stock paths;
6. inspect attribution;
7. replay the event sequence;
8. see what real-world evidence would discriminate the competing explanations.

This is the defining workflow of the Market Dynamics Laboratory.

---

## 15. Next development checkpoint

The next checkpoint after this theory freeze is:

# Case 01 Vertical Slice — Semiconductor Synchronised Rise

It should implement one end-to-end case:

[
oxed{
	ext{Question}
ightarrow
	ext{Competing Mechanisms}
ightarrow
	ext{Interactive Experiment}
ightarrow
	ext{Counterfactual Comparison}
ightarrow
	ext{Attribution}
ightarrow
	ext{Evidence Requirements}
ightarrow
	ext{Decision Relevance}
}
]

Before adding backend infrastructure, freeze the Case 01 input/output contract and identify the minimum persistence needed for:

- case definition;
- scenario;
- run;
- shock/event;
- time-series snapshots;
- attribution;
- evidence requirement;
- replay.

No general-purpose backend should be built beyond what Case 01 proves necessary.
