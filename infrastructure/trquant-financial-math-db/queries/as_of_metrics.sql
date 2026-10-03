-- Point-in-time metric read.
-- Supply :as_of and never use rows that were not yet available at that time.

SELECT DISTINCT ON (metric_code, scope_type, scope_key)
  metric_code,
  scope_type,
  scope_key,
  event_time,
  available_at,
  value,
  confidence,
  methodology_version,
  source_kind,
  calculation_run_id
FROM metric_observations
WHERE available_at <= :as_of
  AND event_time <= :as_of
ORDER BY
  metric_code,
  scope_type,
  scope_key,
  event_time DESC,
  available_at DESC,
  ingested_at DESC;
