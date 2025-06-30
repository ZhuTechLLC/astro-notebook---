<<<<<<< Updated upstream:src/pages/015_示例：等权构建组合.md
=======
---
title: 示例：等权构建组合
layout: ../layouts/Layout.astro
lang: zh
alt: /en/015_Example_Building_Equal_Weighted_Portfolio_en
---

<div class="top-nav">
  <a href="/">← 返回目录</a>
  <a href="/016_Example_Backtesting_Return_Curve_CN">下一章 →</a>
</div>

>>>>>>> Stashed changes:src/pages/015_Example_Building_Equal_Weighted_Portfolio_CN.md
# 示例：等权构建组合

top_n = 5

weights = {ticker: 1 / top_n for ticker in selected_tickers}

2.4 回测分析

通过历史数据验证策略的有效性，评估收益和风险。

回测步骤：

计算每日组合收益：组合收益 = 每只股票收益 × 权重。

累计收益曲线：累计收益 = (1 + 日收益).cumprod()。

计算关键指标：

年化收益率：反映策略长期表现。

最大回撤：衡量潜在风险。

<<<<<<< Updated upstream:src/pages/015_示例：等权构建组合.md
夏普比率：评估风险调整后的收益。
=======
夏普比率：评估风险调整后的收益。

<!-- 图表占位：[示例：等权构建组合] -->

<div class="nav-links">
  <a href="/">← 返回目录</a>
  <a href="/016_Example_Backtesting_Return_Curve_CN">下一章 →</a>
</div>
>>>>>>> Stashed changes:src/pages/015_Example_Building_Equal_Weighted_Portfolio_CN.md
