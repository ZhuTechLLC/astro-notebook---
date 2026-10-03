-- Latest six-state snapshot for a scope.
-- Example bindings:
--   :scope_type = 'sector'
--   :scope_key  = 'Semiconductors'
--   :as_of      = '2026-10-02T20:00:00Z'

WITH ranked AS (
  SELECT
    mo.*,
    row_number() OVER (
      PARTITION BY mo.metric_code
      ORDER BY mo.event_time DESC, mo.available_at DESC, mo.ingested_at DESC
    ) AS rn
  FROM metric_observations mo
  WHERE mo.metric_code IN ('A','C','Q','L','E','P')
    AND mo.scope_type = :scope_type
    AND mo.scope_key = :scope_key
    AND mo.event_time <= :as_of
    AND mo.available_at <= :as_of
)
SELECT
  metric_code,
  event_time,
  available_at,
  value,
  confidence,
  methodology_version,
  source_kind,
  calculation_run_id
FROM ranked
WHERE rn = 1
ORDER BY metric_code;
