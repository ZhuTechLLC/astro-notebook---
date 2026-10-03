BEGIN;

INSERT INTO metric_definitions (
  metric_code, name_zh, name_en, description, formula, unit,
  default_frequency, methodology_version, required_data, supported_scopes, notes
) VALUES
(
  'A','同步度','Alignment',
  '衡量当前参与者或订单流在方向上是否趋于一致。',
  '|Σ_i w_i s_i| / Σ_i w_i |s_i|',
  '0-1','5m/daily','research-v1',
  ARRAY['signed flow or signed reaction','weights'],
  ARRAY['market','sector','theme','simulation'],
  '模型中的 A 可直接由代理订单流计算；真实市场估计必须明确代理变量与权重来源。'
),
(
  'C','耦合度','Coupling',
  '衡量资产收益是否越来越由共同模态驱动。',
  'lambda_1(Sigma_t) / trace(Sigma_t)',
  '0-1','daily','research-v1',
  ARRAY['returns','rolling covariance matrix'],
  ARRAY['market','sector','industry','theme'],
  '常用 PCA / 随机矩阵方法估计；窗口长度和横截面规模会显著影响结果。'
),
(
  'Q','拥挤度','Crowding',
  '衡量风险暴露、持仓或订单流是否集中在少数相似方向。',
  '(sum_j p_j^2 - 1/N) / (1 - 1/N)',
  '0-1','daily','research-v1',
  ARRAY['exposure or flow distribution'],
  ARRAY['market','sector','theme','simulation'],
  'p_j 为归一化绝对暴露或绝对订单流权重；真实市场的持仓版本需要组合或所有权数据。'
),
(
  'L','流动性脆弱度','Liquidity Fragility',
  '衡量单位订单流失衡需要多大价格变化才能被市场吸收。',
  'Delta p_t = beta_t * OFI_t + epsilon_t; L_t := beta_t',
  'price impact','tick/1m','research-v1',
  ARRAY['trades','quotes or order book','order flow imbalance'],
  ARRAY['market','sector','asset'],
  '没有足够细的盘口或逐笔数据时，不应把模拟值描述为真实市场流动性。'
),
(
  'E','内生性','Endogeneity',
  '衡量市场事件有多少来自内部自激反馈，而非独立外生到达。',
  'rho(K_t)',
  '0-1','event/tick','research-v1',
  ARRAY['event timestamps','Hawkes kernel estimates'],
  ARRAY['market','sector','asset','network'],
  'K_t 为 Hawkes 分支矩阵；数据频率不足时保持未知。'
),
(
  'P','传播度','Propagation',
  '衡量局部冲击沿资产关系网络继续扩散的能力。',
  'rho(B_t)',
  'dimensionless','5m/daily','research-v1',
  ARRAY['asset network','lead-lag or response estimates'],
  ARRAY['market','sector','theme','network'],
  '真实市场目标量可由动态传播矩阵 B_t 估计；交互实验中的传播代理值应单独标注方法版本。'
);

INSERT INTO assets (
  symbol, name, asset_type, exchange, sector, industry, currency
) VALUES
('SPY','SPDR S&P 500 ETF Trust','etf','NYSE Arca','Broad Market','Large Cap','USD'),
('QQQ','Invesco QQQ Trust','etf','NASDAQ','Growth / Technology','Large Cap Growth','USD'),
('NVDA','NVIDIA','equity','NASDAQ','Semiconductors','AI Compute','USD'),
('AMD','Advanced Micro Devices','equity','NASDAQ','Semiconductors','AI Compute','USD'),
('AVGO','Broadcom','equity','NASDAQ','Semiconductors','Semiconductors / Networking','USD'),
('MU','Micron Technology','equity','NASDAQ','Semiconductors','Memory','USD'),
('AMAT','Applied Materials','equity','NASDAQ','Semiconductor Equipment','Wafer Fab Equipment','USD'),
('LRCX','Lam Research','equity','NASDAQ','Semiconductor Equipment','Wafer Fab Equipment','USD'),
('COHR','Coherent','equity','NYSE','Optical Communications','Photonics / Optics','USD'),
('LITE','Lumentum','equity','NASDAQ','Optical Communications','Photonics / Optics','USD'),
('VRT','Vertiv','equity','NYSE','Data Center Infrastructure','Power / Thermal Management','USD'),
('IWM','iShares Russell 2000 ETF','etf','NYSE Arca','Small Cap','Broad Small Cap','USD')
ON CONFLICT DO NOTHING;

COMMIT;
