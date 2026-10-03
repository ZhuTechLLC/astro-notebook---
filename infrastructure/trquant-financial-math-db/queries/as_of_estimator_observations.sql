-- Point-in-time estimator observation read.
-- Supply :as_of and never use rows that were not yet available at that time.
-- This query does not imply a fixed market-state vector.

SELECT DISTINCT ON (eo.estimator_code, eo.scope_type, eo.scope_key)
  eo.estimator_code,
  ed.name_zh,
  ed.name_en,
  eo.scope_type,
  eo.scope_key,
  eo.event_time,
  eo.available_at,
  eo.value,
  eo.confidence,
  eo.methodology_version,
  eo.source_kind,
  eo.calculation_run_id
FROM estimator_observations eo
JOIN estimator_definitions ed
  ON ed.estimator_code = eo.estimator_code
WHERE eo.available_at <= :as_of
  AND eo.event_time <= :as_of
ORDER BY
  eo.estimator_code,
  eo.scope_type,
  eo.scope_key,
  eo.event_time DESC,
  eo.available_at DESC,
  eo.ingested_at DESC;
