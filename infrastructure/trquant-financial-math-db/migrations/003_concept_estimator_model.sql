BEGIN;

-- Guard against silently changing the meaning of previously measured values.
-- The current production database is expected to have zero observations for
-- these six estimator codes before this migration.
CREATE TEMP TABLE _concept_estimator_migration_guard (
  ok boolean NOT NULL CHECK (ok)
);

INSERT INTO _concept_estimator_migration_guard (ok)
SELECT NOT EXISTS (
  SELECT 1
  FROM metric_observations
  WHERE metric_code IN ('A','C','Q','L','E','P')
);

DROP TABLE _concept_estimator_migration_guard;

DROP VIEW latest_metric_observations;

ALTER TABLE metric_definitions RENAME TO estimator_definitions;
ALTER TABLE estimator_definitions RENAME COLUMN metric_code TO estimator_code;

ALTER TABLE metric_observations RENAME TO estimator_observations;
ALTER TABLE estimator_observations RENAME COLUMN metric_code TO estimator_code;

ALTER INDEX metric_observations_run_uq
  RENAME TO estimator_observations_run_uq;
ALTER INDEX metric_observations_lookup_idx
  RENAME TO estimator_observations_lookup_idx;
ALTER INDEX metric_observations_available_idx
  RENAME TO estimator_observations_available_idx;

CREATE TABLE concept_definitions (
  concept_code text PRIMARY KEY,
  name_zh text NOT NULL,
  name_en text NOT NULL,
  definition text NOT NULL,
  evidence_boundary text NOT NULL,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','experimental','retired')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE concept_estimator_links (
  concept_code text NOT NULL REFERENCES concept_definitions(concept_code),
  estimator_code text NOT NULL REFERENCES estimator_definitions(estimator_code),
  evidence_role text NOT NULL DEFAULT 'supporting'
    CHECK (evidence_role IN ('primary','supporting','diagnostic','boundary')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (concept_code, estimator_code)
);

CREATE INDEX concept_estimator_links_estimator_idx
  ON concept_estimator_links (estimator_code, concept_code);

INSERT INTO concept_definitions (
  concept_code, name_zh, name_en, definition, evidence_boundary, notes
) VALUES
(
  'directional_alignment','方向一致性','Directional Alignment',
  '参与者行为、订单流或其他已声明有符号量在给定横截面上的方向一致程度。',
  '必须明确被聚合的有符号变量、权重、横截面与期限；不能自动替代收益 breadth、持仓拥挤或因果反馈。',
  'Concept 本身不产生数值；数值必须来自明确 estimator。'
),
(
  'common_mode_movement','共同模态运动','Common-Mode Movement',
  '横截面变量由少数共同统计模态解释的程度。',
  '共同运动不自动等于直接经济耦合、共同因子结构或因果联系。',
  '相关矩阵、协方差矩阵与因子模型必须分别命名。'
),
(
  'concentration','集中度','Concentration',
  '某个明确分布中的权重或活动是否集中于少数成分。',
  '必须声明输入分布是订单流、持仓、所有权、资金流还是其他量；集中度本身不等于 Crowding。',
  NULL
),
(
  'price_impact','价格冲击','Price Impact',
  '给定交易或订单流条件下，价格对流量变化的响应。',
  '估计结果依赖市场、频率、深度、样本与模型条件；不能代表 Liquidity 的全部维度。',
  NULL
),
(
  'return_flow_response','收益—资金流响应','Return–Flow Response',
  '价格变化与随后资金流、订单流或仓位调整之间的时序响应关系。',
  '没有识别设计时只称 response / association，不升级为因果反馈。',
  NULL
),
(
  'self_excitation','自激事件结构','Self-Excitation',
  '事件过程中过去事件对未来事件到达强度的自激或交叉激发结构。',
  'Hawkes 谱半径是指定模型的稳定性 / 反馈性质，不等于通用“内生性比例”。',
  NULL
),
(
  'network_feedback','网络反馈','Network Feedback',
  '指定动态网络系统中反馈放大与稳定性相关的结构性质。',
  '谱半径只对明确的线性动态矩阵定义有意义，不等于通用传播度、spillover 或 transmission。',
  NULL
),
(
  'connectedness_spillover','连通性 / 溢出','Connectedness / Spillover',
  '不同资产、行业或节点之间具有方向与期限的预测响应或方差贡献联系。',
  'IRF、FEVD、lead-lag 等回答不同问题；Transmission 需要额外的经济通道与识别证据。',
  NULL
),
(
  'liquidity','流动性','Liquidity',
  '市场以有限价格让步吸收交易并在冲击后恢复的能力。',
  '价差、深度、price impact 与 resiliency 是不同维度，不能由一个 beta 自动代表全部 Liquidity。',
  NULL
),
(
  'crowding','拥挤','Crowding',
  '多个资金主体因相似暴露、约束与退出路径而形成潜在共同去风险压力的状态。',
  '单一 HHI 或单一订单流集中度不足以识别 Crowding；还需持仓重叠、约束与退出容量等证据。',
  NULL
);

UPDATE estimator_definitions
SET
  name_zh = '订单流方向一致性',
  name_en = 'Signed-Flow Directional Alignment',
  description = '对给定有符号订单流或反应量计算加权方向一致性。',
  formula = '|sum_i w_i s_i| / sum_i w_i |s_i|',
  unit = '0-1',
  default_frequency = 'method-dependent',
  methodology_version = 'research-v2',
  required_data = ARRAY['signed flow or signed reaction','weights'],
  supported_scopes = ARRAY['market','sector','theme','simulation'],
  notes = '稳定 estimator code；不等于收益 breadth、Crowding 或固定市场状态维度。',
  updated_at = now()
WHERE estimator_code = 'A';

UPDATE estimator_definitions
SET
  name_zh = '共同模态占比',
  name_en = 'Correlation First-Mode Share',
  description = '相关矩阵第一特征值占迹的比例，用于描述横截面共同统计运动的集中程度。',
  formula = 'lambda_1(R_t) / trace(R_t)',
  unit = '0-1',
  default_frequency = 'daily',
  methodology_version = 'research-v2',
  required_data = ARRAY['returns','rolling correlation matrix'],
  supported_scopes = ARRAY['market','sector','industry','theme'],
  notes = '稳定 estimator code；共同模态不自动表示经济耦合、共同因子或因果关系。',
  updated_at = now()
WHERE estimator_code = 'C';

UPDATE estimator_definitions
SET
  name_zh = '归一化集中度',
  name_en = 'Normalized HHI Concentration',
  description = '对明确命名的非负权重分布计算归一化 HHI 集中度。',
  formula = '(sum_j p_j^2 - 1/N) / (1 - 1/N)',
  unit = '0-1',
  default_frequency = 'method-dependent',
  methodology_version = 'research-v2',
  required_data = ARRAY['explicitly named non-negative weight distribution'],
  supported_scopes = ARRAY['market','sector','theme','simulation'],
  notes = '稳定 estimator code；必须声明 p_j 的含义。该统计量本身不等于 Crowding。',
  updated_at = now()
WHERE estimator_code = 'Q';

UPDATE estimator_definitions
SET
  name_zh = 'OFI 价格冲击系数',
  name_en = 'OFI Price-Impact Coefficient',
  description = '在明确样本与频率条件下估计订单流失衡对价格变化的条件响应。',
  formula = 'Delta p_t = beta_OFI,t * OFI_t + epsilon_t',
  unit = 'price-impact coefficient',
  default_frequency = 'tick/1m',
  methodology_version = 'research-v2',
  required_data = ARRAY['trades','quotes or order book','order flow imbalance'],
  supported_scopes = ARRAY['market','sector','asset'],
  notes = '稳定 estimator code；beta_OFI 是 price-impact estimator，不等于 Liquidity 或 Liquidity Fragility 的完整定义。',
  updated_at = now()
WHERE estimator_code = 'L';

UPDATE estimator_definitions
SET
  name_zh = 'Hawkes 反馈谱半径',
  name_en = 'Hawkes Kernel Spectral Radius',
  description = '指定线性多元 Hawkes 核积分矩阵的谱半径，用于描述该模型的稳定性与反馈结构。',
  formula = 'rho(K)',
  unit = 'dimensionless',
  default_frequency = 'event/tick',
  methodology_version = 'research-v2',
  required_data = ARRAY['event timestamps','specified Hawkes model','kernel estimates'],
  supported_scopes = ARRAY['market','sector','asset','network'],
  notes = '稳定 estimator code；rho(K) 不是多元系统的通用 endogenous-event fraction，也不是趋势或模仿的泛称。',
  updated_at = now()
WHERE estimator_code = 'E';

UPDATE estimator_definitions
SET
  name_zh = '动态网络反馈谱半径',
  name_en = 'Dynamic Network Spectral Radius',
  description = '指定线性动态网络矩阵的谱半径，用于描述该系统的反馈放大与稳定性性质。',
  formula = 'rho(B_t)',
  unit = 'dimensionless',
  default_frequency = 'method-dependent',
  methodology_version = 'research-v2',
  required_data = ARRAY['specified dynamic network matrix B_t'],
  supported_scopes = ARRAY['market','sector','theme','network'],
  notes = '稳定 estimator code；rho(B_t) 不等于通用 Propagation、Connectedness、Spillover 或 Transmission。',
  updated_at = now()
WHERE estimator_code = 'P';

INSERT INTO concept_estimator_links (
  concept_code, estimator_code, evidence_role, notes
) VALUES
  ('directional_alignment','A','primary','A 直接测量已声明有符号量的方向一致性。'),
  ('common_mode_movement','C','primary','C 是相关矩阵共同模态的统计摘要。'),
  ('concentration','Q','primary','Q 只测量被明确命名分布的集中度。'),
  ('price_impact','L','primary','L 是 OFI 条件 price-impact estimator。'),
  ('self_excitation','E','primary','E 描述指定 Hawkes 模型的谱半径。'),
  ('network_feedback','P','primary','P 描述指定动态网络矩阵的谱半径。');

CREATE VIEW latest_estimator_observations AS
SELECT DISTINCT ON (estimator_code, scope_type, scope_key)
  observation_id,
  estimator_code,
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
FROM estimator_observations
ORDER BY
  estimator_code,
  scope_type,
  scope_key,
  event_time DESC,
  available_at DESC,
  ingested_at DESC;

COMMIT;
