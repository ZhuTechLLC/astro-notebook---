# TRQuant Financial Math — Database Contract v2

This directory defines the PostgreSQL contract for structured TRQuant financial-math research data.

## Core modeling rule

The database separates four things that must not be collapsed into one ontology:

1. **Concept** — the question or market property we want to understand.
2. **Estimator** — a specific statistical / mathematical procedure used to measure something relevant to a concept.
3. **Observation** — a point-in-time value produced by one estimator.
4. **Evidence link** — the declared relationship between a concept and an estimator.

The schema therefore does **not** assume that the market is fully represented by a fixed six-dimensional state vector.

## Concept / estimator contract

- `concept_definitions` stores semantic research concepts. A concept has no numeric value by itself.
- `estimator_definitions` stores explicit formulas, data requirements, methodology versions, units, and scope support.
- `concept_estimator_links` is many-to-many. One concept may require multiple estimators; one estimator may inform more than one concept.
- `estimator_observations` stores measured values. Every value points to exactly one estimator.
- `latest_estimator_observations` is a convenience view over the latest value per estimator + scope.

A concept-level read must therefore return the contributing estimators and evidence; it must not fabricate a synthetic concept score unless an explicit aggregation estimator has been separately defined and validated.

## Stable estimator codes A / C / Q / L / E / P

The existing single-letter codes are retained as stable estimator identifiers for data continuity. They are **not** aliases for a retired ontology and are **not** a closed list of market dimensions.

Their v2 meanings are estimator-specific:

- `A` — signed-flow directional alignment.
- `C` — first common-mode share of a correlation matrix.
- `Q` — normalized HHI concentration of an explicitly named input distribution.
- `L` — OFI price-impact coefficient.
- `E` — spectral radius of a specified linear Hawkes kernel matrix.
- `P` — spectral radius of a specified dynamic network feedback matrix.

Important boundaries:

- `Q` alone is not Crowding.
- `L` alone is not Liquidity.
- `E = rho(K)` is not the multivariate endogenous-event fraction.
- `P = rho(B)` is not generic cross-asset transmission or spillover.
- Common-mode movement is statistical co-movement; it is not automatically economic coupling or causality.

## Point-in-time correctness

Every time-dependent observation that can affect a historical decision carries both:

- `event_time`: when the underlying market state/event belongs;
- `available_at`: when the information became usable by the system.

Historical queries must filter on `available_at <= as_of`.

## Provenance

Any reproducible derived observation should reference `calculation_runs.run_id`. A run records:

- `model_name` and `model_version`;
- exact Git `source_commit`;
- `parameters_hash`;
- `dataset_version`;
- `data_cutoff_at`;
- machine-readable `parameters` and `provenance`.

Traceability remains:

`value -> estimator_observation -> calculation_run -> source_commit + dataset_version`

## Migration sequence

- `migrations/001_core_schema.sql` — original provider-neutral schema.
- `migrations/002_reference_seed.sql` — original reference seed and demo assets; kept immutable for reproducibility.
- `migrations/003_concept_estimator_model.sql` — promotes Concept / Estimator / Observation into the active contract, preserving A/C/Q/L/E/P as estimator codes.

The v2 migration explicitly refuses to reinterpret A/C/Q/L/E/P if observations already exist. This protects historical semantics from silent mutation.

## Active query patterns

- `queries/as_of_estimator_observations.sql` — generic point-in-time estimator read.
- `queries/concept_evidence_snapshot.sql` — latest available estimator evidence for one concept and scope.

There is intentionally no active query that enumerates A/C/Q/L/E/P as a fixed market-state snapshot.

## Storage boundary

This database stores structured, queryable results:

- asset master data;
- time-varying asset relationships;
- concepts and estimator definitions;
- point-in-time estimator observations;
- market events and their asset links;
- calculation provenance;
- reproducible simulation runs.

It does not store bulk tick history, full order books, large matrices, or raw research files.

## Authority boundary

This schema supports research, explanation, historical validation, and website display. It does not grant trading, capital-allocation, portfolio-sizing, or automated-execution authority.
