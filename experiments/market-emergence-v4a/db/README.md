# TRQuant Financial Math — Database Contract v1

This directory defines the first PostgreSQL data contract for the public financial-math site and the TRQuant compute layer.

## Scope

The database stores **structured, queryable results**:

- asset master data;
- time-varying asset relationships;
- metric definitions;
- point-in-time metric observations;
- market events and their asset links;
- calculation provenance;
- reproducible simulation runs.

It does **not** store bulk tick history, full order books, large matrices, or raw research files. Those belong in object storage when they become necessary.

## Core rule: event time is not availability time

Every time-dependent observation that can affect a historical decision carries both:

- `event_time`: when the underlying market state/event belongs;
- `available_at`: when the information became usable by the system.

Historical queries must filter on `available_at <= as_of`. This is the minimum contract for point-in-time correctness and prevents look-ahead contamination.

## Provenance

Any derived metric that can be reproduced should reference `calculation_runs.run_id`. A run records:

- `model_name` and `model_version`;
- exact Git `source_commit`;
- `parameters_hash`;
- `dataset_version`;
- `data_cutoff_at`;
- machine-readable `parameters` and `provenance`.

A displayed number should therefore be traceable as:

`value -> observation -> calculation_run -> source_commit + dataset_version`

## Metric contract

The six market-state codes are seeded in `002_reference_seed.sql`:

- `A` Alignment / 同步度
- `C` Coupling / 耦合度
- `Q` Crowding / 拥挤度
- `L` Liquidity Fragility / 流动性脆弱度
- `E` Endogeneity / 内生性
- `P` Propagation / 传播度

A metric observation also carries `methodology_version`, because a simulation proxy and a real-market estimator may share the same conceptual metric while using different estimators. They must never be presented as the same measurement without the methodology label.

## Files

- `migrations/001_core_schema.sql` — tables, constraints, indexes, and latest-state view.
- `migrations/002_reference_seed.sql` — A/C/Q/L/E/P definitions and the current 12 demo assets.
- `queries/as_of_metrics.sql` — generic point-in-time read pattern.
- `queries/market_state_snapshot.sql` — point-in-time A/C/Q/L/E/P snapshot for one scope.

## Deployment boundary

This contract is provider-neutral PostgreSQL. The intended first hosted database is Neon, but provisioning, credentials, and production migration are a separate checkpoint.

No database secret belongs in Git. The future runtime should receive `DATABASE_URL` only through the deployment environment.

## Authority boundary

This schema supports research, explanation, historical validation, and website display. It does not grant trading, capital-allocation, or automated-execution authority.
