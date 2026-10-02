<<<<<<< Updated upstream:src/pages/014_示例：计算动量因子.md
=======
---
title: 示例：计算动量因子
layout: ../layouts/Layout.astro
lang: zh
alt: /en/014_Example_Calculating_Momentum_Factor_en
---

<div class="top-nav">
  <a href="/013_Example_Loading_Stock_Price_Data_CN">← 上一章</a>
  <a href="/015_Example_Building_Equal_Weighted_Portfolio_CN">下一章 →</a>
</div>

>>>>>>> Stashed changes:src/pages/014_Example_Calculating_Momentum_Factor_CN.md
# 示例：计算动量因子

momentum = data.pct_change(30).mean(axis=1)

<<<<<<< Updated upstream:src/pages/014_示例：计算动量因子.md
2.3 投资组合构建
=======
<div class="nav-links">
  <a href="/013_Example_Loading_Stock_Price_Data_CN">← 上一章</a>
  <a href="/015_Example_Building_Equal_Weighted_Portfolio_CN">下一章 →</a>
</div>
>>>>>>> Stashed changes:src/pages/014_Example_Calculating_Momentum_Factor_CN.md

通过筛选因子得分最高的股票，分配权重构建投资组合。

常用方法：

等权分配：每只股票权重相等，简单易用。

风险平价：根据波动率调整权重，降低高波动资产的风险。

优化分配：使用数学优化模型（如均值方差模型）寻找最优权重。