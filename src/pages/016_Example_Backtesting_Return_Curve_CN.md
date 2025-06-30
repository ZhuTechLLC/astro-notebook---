<<<<<<< Updated upstream:src/pages/016_示例：回测收益曲线.md
=======
---
title: 示例：回测收益曲线
layout: ../layouts/Layout.astro
lang: zh
alt: /en/016_Example_Backtesting_Return_Curve_en
---

<div class="top-nav">
  <a href="/015_Example_Building_Equal_Weighted_Portfolio_CN">← 上一章</a>
  <a href="/017_Using_scipy_optimize_for_Optimization_CN">下一章 →</a>
</div>

>>>>>>> Stashed changes:src/pages/016_Example_Backtesting_Return_Curve_CN.md
# 示例：回测收益曲线

portfolio_returns = data.pct_change().dot(pd.Series(weights))

cumulative_returns = (1 + portfolio_returns).cumprod()

指标计算公式：

夏普比率： Sharpe Ratio=组合年化收益率−无风险利率年化波动率\text{Sharpe Ratio} = \frac{\text{组合年化收益率} - \text{无风险利率}}{\text{年化波动率}}

最大回撤： 最大回撤=累计收益的最大值−累计收益的最小值累计收益的最大值\text{最大回撤} = \frac{\text{累计收益的最大值} - \text{累计收益的最小值}}{\text{累计收益的最大值}}

2.5 优化扩展

通过数学模型优化组合权重，实现风险和收益的动态平衡。

均值方差优化： 目标是最大化夏普比率或最小化组合波动率。

<<<<<<< Updated upstream:src/pages/016_示例：回测收益曲线.md
from scipy.optimize import minimize
=======
from scipy.optimize import minimize

<!-- 图表占位：[示例：回测收益曲线] -->

<div class="nav-links">
  <a href="/015_Example_Building_Equal_Weighted_Portfolio_CN">← 上一章</a>
  <a href="/017_Using_scipy_optimize_for_Optimization_CN">下一章 →</a>
</div>
>>>>>>> Stashed changes:src/pages/016_Example_Backtesting_Return_Curve_CN.md
