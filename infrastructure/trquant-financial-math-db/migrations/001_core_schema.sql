BEGIN;

CREATE TABLE assets (
  asset_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  symbol text NOT NULL,
  name text NOT NULL,
  asset_type text NOT NULL CHECK (asset_type IN ('equity','etf','index','future','option','fx','crypto','other')),
  exchange text,
  sector text,
  industry text,
  currency text NOT NULL DEFAULT 'USD',
  active_from date,
  active_to date,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (active_to IS NULL OR active_from IS NULL OR active_to >= active_from)
);

CREATE UNIQUE INDEX assets_identity_uq
  ON assets (lower(symbol), asset_type, coalesce(exchange, ''));

CREATE INDEX assets_sector_idx ON assets (sector, industry);

CREATE TABLE calculation_runs (
  run_id text PRIMARY KEY,
  model_name text NOT NULL,
  model_version text NOT NULL,
  source_commit text NOT NULL,
  parameters_hash text,
  dataset_version text,
  data_cutoff_at timestamptz,
  parameters jsonb NOT NULL DEFAULT '{}'::jsonb,
  provenance jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at timestamptz NOT NULL,
  completed_at timestamptz,
  status text NOT NULL CHECK (status IN ('running','succeeded','failed','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (completed_at IS NULL OR completed_at >= started_at)
);

CREATE INDEX calculation_runs_model_idx
  ON calculation_runs (model_name, model_version, started_at DESC);

CREATE TABLE metric_definitions (
  metric_code text PRIMARY KEY,
  name_zh text NOT NULL,
  name_en text NOT NULL,
  description text NOT NULL,
  formula text,
  unit text,
  default_frequency text,
  methodology_version text NOT NULL,
  required_data text[] NOT NULL DEFAULT ARRAY[]::text[],
  supported_scopes text[] NOT NULL DEFAULT ARRAY[]::text[],
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','experimental','retired')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE metric_observations (
  observation_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  metric_code text NOT NULL REFERENCES metric_definitions(metric_code),
  scope_type text NOT NULL
    CHECK (scope_type IN ('market','sector','industry','theme','asset','network','simulation','custom')),
  scope_key text NOT NULL,
  event_time timestamptz NOT NULL,
  available_at timestamptz NOT NULL,
  value double precision NOT NULL,
  confidence double precision,
  methodology_version text NOT NULL,
  source_kind text NOT NULL
    CHECK (source_kind IN ('market','derived','model','simulation')),
  calculation_run_id text REFERENCES calculation_runs(run_id),
  data_version text,
  quality_flags text[] NOT NULL DEFAULT ARRAY[]::text[],
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ingested_at timestamptz NOT NULL DEFAULT now(),
  CHECK (available_at >= event_time),
  CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1))
);

CREATE UNIQUE INDEX metric_observations_run_uq
  ON metric_observations (
    metric_code,
    scope_type,
    scope_key,
    event_time,
    coalesce(calculation_run_id, '')
  );

CREATE INDEX metric_observations_lookup_idx
  ON metric_observations (metric_code, scope_type, scope_key, event_time DESC);

CREATE INDEX metric_observations_available_idx
  ON metric_observations (available_at DESC);

CREATE TABLE asset_relationships (
  relationship_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  from_asset_id bigint NOT NULL REFERENCES assets(asset_id),
  to_asset_id bigint NOT NULL REFERENCES assets(asset_id),
  relationship_type text NOT NULL
    CHECK (relationship_type IN ('industry','etf','theme','supply_chain','factor','ownership','lead_lag','correlation','custom')),
  directionality text NOT NULL DEFAULT 'directed'
    CHECK (directionality IN ('directed','undirected')),
  weight double precision NOT NULL,
  confidence double precision,
  valid_from timestamptz NOT NULL,
  valid_to timestamptz,
  available_at timestamptz NOT NULL,
  source text,
  calculation_run_id text REFERENCES calculation_runs(run_id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (from_asset_id <> to_asset_id),
  CHECK (weight >= -1 AND weight <= 1),
  CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  CHECK (valid_to IS NULL OR valid_to > valid_from),
  CHECK (available_at >= valid_from)
);

CREATE INDEX asset_relationships_from_idx
  ON asset_relationships (from_asset_id, relationship_type, valid_from DESC);

CREATE INDEX asset_relationships_to_idx
  ON asset_relationships (to_asset_id, relationship_type, valid_from DESC);

CREATE INDEX asset_relationships_available_idx
  ON asset_relationships (available_at DESC);

CREATE TABLE market_events (
  event_id text PRIMARY KEY,
  event_time timestamptz NOT NULL,
  available_at timestamptz NOT NULL,
  event_type text NOT NULL,
  title text NOT NULL,
  summary text,
  source text,
  source_url text,
  confidence double precision,
  importance double precision,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (available_at >= event_time),
  CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  CHECK (importance IS NULL OR (importance >= 0 AND importance <= 1))
);

CREATE INDEX market_events_time_idx ON market_events (event_time DESC);
CREATE INDEX market_events_available_idx ON market_events (available_at DESC);
CREATE INDEX market_events_type_idx ON market_events (event_type, event_time DESC);

CREATE TABLE event_assets (
  event_id text NOT NULL REFERENCES market_events(event_id) ON DELETE CASCADE,
  asset_id bigint NOT NULL REFERENCES assets(asset_id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'related'
    CHECK (role IN ('subject','source','target','related')),
  direction smallint NOT NULL DEFAULT 0 CHECK (direction IN (-1,0,1)),
  relevance double precision,
  lag_seconds integer,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (event_id, asset_id, role),
  CHECK (relevance IS NULL OR (relevance >= 0 AND relevance <= 1))
);

CREATE INDEX event_assets_asset_idx ON event_assets (asset_id, event_id);

CREATE TABLE simulation_runs (
  simulation_id text PRIMARY KEY,
  model_name text NOT NULL,
  model_version text NOT NULL,
  source_commit text NOT NULL,
  scenario text NOT NULL,
  random_seed bigint NOT NULL,
  parameters jsonb NOT NULL DEFAULT '{}'::jsonb,
  result_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at timestamptz NOT NULL,
  completed_at timestamptz,
  status text NOT NULL CHECK (status IN ('running','succeeded','failed','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (completed_at IS NULL OR completed_at >= started_at)
);

CREATE INDEX simulation_runs_model_idx
  ON simulation_runs (model_name, model_version, started_at DESC);

CREATE VIEW latest_metric_observations AS
SELECT DISTINCT ON (metric_code, scope_type, scope_key)
  observation_id,
  metric_code,
  scope_type,
  scope_key,
  event_time,
  available_at,
  value,
  confidence,
  methodology_version,
  source_kind,
  calculation_run_id,
  data_version,
  quality_flags,
  metadata,
  ingested_at
FROM metric_observations
ORDER BY
  metric_code,
  scope_type,
  scope_key,
  event_time DESC,
  available_at DESC,
  ingested_at DESC;

COMMIT;
