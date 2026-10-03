-- Latest point-in-time estimator evidence for one concept and scope.
-- Example bindings:
--   :concept_code = 'price_impact'
--   :scope_type   = 'sector'
--   :scope_key    = 'Semiconductors'
--   :as_of        = '2026-10-02T20:00:00Z'
--
-- One row is returned for every linked estimator. Missing observations remain
-- visible as evidence_status = 'UNKNOWN'; absence is never treated as evidence.
-- The query does not synthesize a single concept score.

SELECT
  cel.concept_code,
  cd.name_zh AS concept_name_zh,
  cd.name_en AS concept_name_en,
  cel.evidence_role,
  ed.estimator_code,
  ed.name_zh AS estimator_name_zh,
  ed.name_en AS estimator_name_en,
  CASE
    WHEN eo.observation_id IS NULL THEN 'UNKNOWN'
    ELSE 'AVAILABLE'
  END AS evidence_status,
  eo.event_time,
  eo.available_at,
  eo.value,
  eo.confidence,
  eo.methodology_version,
  eo.source_kind,
  eo.calculation_run_id
FROM concept_estimator_links cel
JOIN concept_definitions cd
  ON cd.concept_code = cel.concept_code
JOIN estimator_definitions ed
  ON ed.estimator_code = cel.estimator_code
LEFT JOIN LATERAL (
  SELECT x.*
  FROM estimator_observations x
  WHERE x.estimator_code = ed.estimator_code
    AND x.scope_type = :scope_type
    AND x.scope_key = :scope_key
    AND x.event_time <= :as_of
    AND x.available_at <= :as_of
  ORDER BY
    x.event_time DESC,
    x.available_at DESC,
    x.ingested_at DESC
  LIMIT 1
) eo ON TRUE
WHERE cel.concept_code = :concept_code
ORDER BY ed.estimator_code;
