-- Latest point-in-time estimator evidence for one concept and scope.
-- Example bindings:
--   :concept_code = 'price_impact'
--   :scope_type   = 'sector'
--   :scope_key    = 'Semiconductors'
--   :as_of        = '2026-10-02T20:00:00Z'
--
-- The result deliberately keeps estimators separate. It does not synthesize a
-- single concept score unless such an aggregation estimator is explicitly
-- defined elsewhere.

WITH ranked AS (
  SELECT
    cel.concept_code,
    cel.evidence_role,
    ed.estimator_code,
    ed.name_zh AS estimator_name_zh,
    ed.name_en AS estimator_name_en,
    eo.event_time,
    eo.available_at,
    eo.value,
    eo.confidence,
    eo.methodology_version,
    eo.source_kind,
    eo.calculation_run_id,
    row_number() OVER (
      PARTITION BY ed.estimator_code
      ORDER BY eo.event_time DESC, eo.available_at DESC, eo.ingested_at DESC
    ) AS rn
  FROM concept_estimator_links cel
  JOIN estimator_definitions ed
    ON ed.estimator_code = cel.estimator_code
  JOIN estimator_observations eo
    ON eo.estimator_code = ed.estimator_code
  WHERE cel.concept_code = :concept_code
    AND eo.scope_type = :scope_type
    AND eo.scope_key = :scope_key
    AND eo.event_time <= :as_of
    AND eo.available_at <= :as_of
)
SELECT
  concept_code,
  evidence_role,
  estimator_code,
  estimator_name_zh,
  estimator_name_en,
  event_time,
  available_at,
  value,
  confidence,
  methodology_version,
  source_kind,
  calculation_run_id
FROM ranked
WHERE rn = 1
ORDER BY estimator_code;
