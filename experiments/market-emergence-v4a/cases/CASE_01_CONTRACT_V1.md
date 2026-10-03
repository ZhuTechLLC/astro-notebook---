# Case 01 Vertical Slice Contract v1

## Semiconductor Synchronised Rise

Status: FROZEN FOR IMPLEMENTATION  
Parent theory: \`MARKET_DYNAMICS_THEORY_V2.md\`  
Authority: simulation/research only; no trading or capital-allocation authority.

---

## 1. Investment question

> Why are multiple semiconductor-related stocks rising at the same time?

The case exists to distinguish competing explanations that can produce superficially similar price paths.

It is **not** a historical claim about a particular day and it is **not** an attempt to fit a real semiconductor rally.

---

## 2. Case scope

### Market reference

- SPY — broad-market reference.
- QQQ — growth/technology reference.

### Theme

Stable theme id:

\`ai_semiconductor\`

Members for v1:

- NVDA
- AMD
- AVGO
- MU
- AMAT
- LRCX

The theme basket is an equal-weight simulation summary in v1 unless a later case version explicitly changes the weighting rule.

### Default focus stock

- NVDA

The user can switch the focus stock among theme members.

---

## 3. Competing mechanisms

Every mechanism has a stable id so simulation, backend, replay, and UI can refer to the same object.

### M1 — \`market_beta\`

**Hypothesis**

The apparent semiconductor rally is primarily part of a broader market / growth move.

**Simulation intervention**

Inject market-level information or broad common flow.

**Real evidence candidates**

- broad-factor return decomposition;
- market/sector residualization;
- breadth and common-mode measures.

**Boundary**

Common movement alone does not establish a causal common factor.

---

### M2 — \`theme_information\`

**Hypothesis**

A semiconductor-specific information repricing moves multiple theme members together.

**Simulation intervention**

Shift the latent reference anchors of all theme members in the same direction.

**Real evidence candidates**

- industry event study;
- earnings/revision breadth;
- sector-specific news;
- factor-adjusted residual returns.

**Boundary**

The latent reference anchor in simulation is not a measured real-world fair value.

---

### M3 — \`leader_information_propagation\`

**Hypothesis**

A stock-specific information shock starts in a leader, then peers move later.

**Default leader**

NVDA.

**Simulation intervention**

Inject an NVDA-only information shock and allow configured cross-asset response.

**Real evidence candidates**

- lead-lag;
- Local Projection;
- VAR / IRF / FEVD;
- explicit economic channel.

**Boundary**

A simulated propagation edge is model truth only. Real-market Transmission requires directional evidence plus an economic channel.

---

### M4 — \`common_flow\`

**Hypothesis**

Common portfolio / ETF-like flow pushes multiple theme members at once without requiring a common reference-value change.

**Simulation intervention**

Inject persistent signed flow across the theme basket.

**Real evidence candidates**

- ETF flow;
- signed flow / OFI;
- volume and execution pattern;
- price impact conditional on depth.

**Boundary**

Flow identifies trading pressure, not investor motive.

---

### M5 — \`trend_feedback\`

**Hypothesis**

An initial move attracts trend-sensitive flow, which reinforces price changes.

**Simulation intervention**

Increase trend response while keeping the initial shock fixed.

**Core conceptual loop**

\[
\text{Price}
\rightarrow
\text{Future Flow}
\rightarrow
\text{Price}
\]

**Real evidence candidates**

- return-flow response;
- distributed lag;
- Local Projection;
- persistence after initial information.

**Boundary**

A return-flow response is not automatically causal feedback.

---

### M6 — \`liquidity_amplification\`

**Hypothesis**

The same signed flow produces a larger move because depth is lower and/or recovery is slower.

**Simulation intervention**

Reduce depth / liquidity while holding flow fixed.

**Real evidence candidates**

- spread;
- depth;
- impact coefficient;
- resiliency / recovery.

**Boundary**

Price Impact alone is not Liquidity.

---

### M7 — \`coincidence_residual\`

**Hypothesis**

Some apparent synchronisation is residual randomness or common movement not explained by the tested mechanisms.

**Simulation intervention**

No special structural intervention; use seeded stochastic disturbances.

**Real evidence candidates**

- null simulation;
- bootstrap;
- RMT/noise benchmark;
- residual diagnostics.

**Boundary**

This is not a positive mechanism claim; it preserves UNKNOWN.

---

## 4. Baseline simulation contract

The baseline exists so every intervention can be compared against the same initial world.

### Required baseline fields

- \`case_id\`
- \`case_version\`
- \`engine_version\`
- \`source_commit\`
- \`seed\`
- \`duration_ms\`
- \`sample_interval_ms\`
- \`environment\`
- \`noise\`
- \`network_strength\`
- \`liquidity\`
- participant-rule version
- asset universe version
- theme version

### v1 defaults

- seed: \`20261003\`
- duration: \`60000 ms\`
- sample interval: \`250 ms\`
- environment: \`balanced\`
- noise: \`0.35\`
- network strength: \`0.55\`
- liquidity: \`0.70\`

These defaults mirror the current visual simulator where possible. They are experiment defaults, not empirically calibrated market parameters.

---

## 5. Intervention contract

A run may contain zero or more timestamped interventions.

Every intervention must record:

- \`event_id\`
- \`t_ms\`
- \`type\`
- \`scope\`
- \`target\`
- \`direction\`
- \`strength\`
- \`duration_ms\` when applicable
- \`parameters\`
- \`source\`

### Allowed intervention types in Case 01 v1

#### \`information_shock\`

Scopes:

- \`market\`
- \`theme\`
- \`asset\`

Examples:

- market-wide positive information;
- semiconductor-theme information;
- NVDA-specific information.

#### \`persistent_flow\`

Scopes:

- \`theme\`
- \`asset\`

Examples:

- common semiconductor buy flow;
- single-stock buy/sell metaorder.

#### \`parameter_change\`

Allowed parameters:

- \`trend_gain\`
- \`network_strength\`
- \`liquidity\`
- \`noise\`

Parameter changes must be explicit events so replay remains deterministic.

---

## 6. A/B counterfactual contract

The minimum useful experiment is not “run the simulator once.”

It is:

\[
\boxed{
\text{Same Initial State}
+
\text{Same Seed}
+
\text{One Deliberate Mechanism Difference}
}
\]

### Required comparison constraints

A and B must share:

- case definition;
- engine/source version;
- seed;
- initial participant population;
- asset universe;
- baseline parameters;
- duration;
- sample interval.

The comparison must declare exactly which intervention or parameter differs.

### Canonical first A/B experiment

**A — Theme information repricing**

- positive \`information_shock\`
- scope = \`theme\`
- target = \`ai_semiconductor\`

**B — Common flow**

- positive \`persistent_flow\`
- scope = \`theme\`
- target = \`ai_semiconductor\`
- no theme-wide reference-anchor shift

### Why this pair is first

Both can make semiconductor stocks rise together, but they should differ in:

- persistence;
- relationship to latent reference anchors;
- participant response mix;
- post-flow recovery;
- path dependence;
- evidence needed in real markets.

This directly demonstrates why “stocks rose together” is not a sufficient explanation.

---

## 7. Required run outputs

### 7.1 Market -> Theme -> Stock paths

For each sample time store/derive:

- broad-market normalized price;
- theme normalized price;
- focus-stock normalized price.

All displayed path indices start at 100.

For v1 the theme path is the equal-weight average of member normalized prices.

### 7.2 Cross-section

At each requested snapshot:

- normalized return by asset;
- rank;
- theme membership;
- focus flag.

### 7.3 Flow summary

At minimum:

- signed flow by asset;
- absolute flow by asset;
- flow by participant class;
- directional alignment;
- concentration of explicitly named flow distribution.

Flow concentration is not labeled Crowding.

### 7.4 Network / propagation summary

At minimum:

- active model-internal links;
- link strength used by the simulator;
- propagated contribution by asset;
- event order.

This is simulation propagation, not real-market Transmission evidence.

### 7.5 Feedback summary

At minimum:

- trend-agent response strength;
- return-to-subsequent-flow summary inside the simulation;
- whether amplification increased or decayed over the run.

No universal “reflexivity score” is required.

### 7.6 Two-level attribution

#### Level 1 — structural price comparison

Output:

- \`market_return\`
- \`theme_return\`
- \`focus_stock_return\`
- \`theme_excess_vs_market\`
- \`stock_excess_vs_theme\`

This is a simulation structural comparison, not a causal factor decomposition.

#### Level 2 — model accounting attribution

Preferred categories:

- \`information\`
- \`flow\`
- \`feedback\`
- \`network\`
- \`liquidity_constraint\`
- \`residual\`

The categories must sum, within numerical tolerance, to the modeled incremental move under the chosen accounting convention.

Attention is treated primarily as a behavior modifier and should not be double-counted as an independent real-market cause.

### 7.7 Dynamics fingerprint

The v1 summary may contain:

- horizon return;
- maximum favorable excursion;
- maximum adverse excursion;
- realized path volatility;
- time to peak;
- propagation breadth;
- impact decay;
- recovery time;
- reversal magnitude.

This fingerprint is used for A/B comparison; it is not a new fixed market-state ontology.

---

## 8. Event timeline and replay

Replay is a first-class requirement.

### Minimum deterministic replay inputs

A run must be reproducible from:

\[
\boxed{
\text{Source Commit}
+
\text{Engine Version}
+
\text{Case Version}
+
\text{Seed}
+
\text{Baseline Parameters}
+
\text{Ordered Event Stream}
}
\]

Therefore the backend does **not** need to persist every animation frame.

### Persist

- run metadata;
- seed;
- parameter set/hash;
- ordered event stream;
- final summary;
- optional sparse checkpoints;
- selected sampled series needed for charts.

### Do not persist by default

- every rendered frame;
- every agent screen coordinate;
- full visual particle state;
- large raw matrices already reproducible from source data.

This keeps the backend small and reproducible.

---

## 9. Real-market evidence contract

Each candidate mechanism must expose what evidence would discriminate it from challengers.

An evidence requirement contains:

- \`mechanism_id\`
- \`observable\`
- \`estimator\`
- \`scope\`
- \`horizon\`
- \`expected_signature\`
- \`status\`

Allowed status values in v1:

- \`UNKNOWN\`
- \`AVAILABLE\`
- \`SUPPORTS\`
- \`INCONSISTENT\`
- \`UNAVAILABLE\`

Simulation runs initialize real-market evidence as \`UNKNOWN\` unless a separate real-data workflow supplies evidence.

The simulator must not manufacture empirical support.

---

## 10. Decision-relevance contract

The simulator may produce a **decision-relevance summary**, but not an order or position size.

Allowed outputs:

- persistence hypothesis;
- main competing explanation;
- key uncertainty;
- evidence to collect next;
- risk condition;
- failure condition;
- relevant horizon.

Not allowed from simulation alone:

- Buy / Sell instruction;
- capital allocation;
- portfolio size;
- automated execution authority;
- claim that a real mechanism has been causally identified.

---

## 11. Minimum persistence model

Case 01 proves the need for only the following objects.

### \`case_definition\`

Stores:

- stable case id/version;
- question;
- universe/theme;
- mechanism list;
- allowed interventions;
- evidence requirements.

### \`simulation_run\`

Stores:

- run id;
- case/version;
- engine/source commit;
- seed;
- start configuration;
- parameter hash;
- timestamps;
- status.

### \`simulation_event\`

Stores:

- ordered intervention/event stream.

### \`simulation_series\`

Stores only chart/research series that are not cheaper to regenerate for the current product need.

For v1:

- market normalized path;
- theme normalized path;
- focus-stock path;
- optional selected state summaries at the sampling interval.

### \`simulation_attribution\`

Stores:

- attribution convention/version;
- structural comparison;
- model-accounting contribution values;
- numerical reconciliation residual.

### \`simulation_comparison\`

Stores:

- run A;
- run B;
- declared changed mechanism;
- outcome deltas;
- dynamics-fingerprint deltas.

### \`evidence_requirement\`

Stores:

- mechanism-to-observable/estimator mapping.

A general-purpose market backend is explicitly out of scope until this minimal model proves insufficient.

---

## 12. UI contract for the later implementation checkpoint

This contract does not redesign the page, but it defines what the later 2D workbench must expose.

### Central canvas

Must remain the primary surface.

It visualizes:

\[
\text{Participants}
\rightarrow
\text{Flow}
\rightarrow
\text{Assets}
\rightarrow
\text{Network}
\rightarrow
\text{Feedback}
\]

### Case controls

Must allow the user to:

- choose the Case 01 mechanism/intervention;
- inject the intervention;
- reset to the same seed;
- run A/B;
- pause/resume;
- replay timeline.

### Analytics dock

Must expose:

- Market -> Theme -> Stock path;
- cross-section;
- flow;
- propagation;
- attribution;
- event timeline;
- A/B comparison.

The analytics panels support the canvas; they do not replace it.

---

## 13. Acceptance criteria for the implementation checkpoint

Case 01 implementation will be considered complete only when:

1. Baseline run is deterministic from the frozen seed and parameters.
2. Theme-information and common-flow scenarios can be run from the same initial state.
3. A/B comparison changes only the declared mechanism.
4. Market -> Theme -> Stock paths update from the same simulation engine.
5. Timeline records all user interventions in deterministic order.
6. Replay reproduces the run within declared numerical tolerance.
7. Model-accounting attribution reconciles with the simulated move.
8. Real-market evidence requirements remain separate from simulation truth.
9. No output from simulation alone authorizes a trade.
10. Existing central 2D market canvas remains the product core.

---

## 14. First implementation slice

After this contract freeze, the first code checkpoint should implement only:

\[
\boxed{
\text{Baseline}
\leftrightarrow
\text{Theme Information Shock}
\leftrightarrow
\text{Common Theme Flow}
}
\]

with:

- same seed;
- same initial state;
- deterministic event log;
- Market -> Theme -> NVDA path;
- A/B dynamics summary;
- model-accounting attribution;
- replay.

Do not implement all seven mechanisms at once.

The remaining mechanisms enter one at a time only after this first A/B slice is stable.
