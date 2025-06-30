<<<<<<< Updated upstream:src/pages/013_示例：加载股票价格数据.md
=======
---
title: 示例：加载股票价格数据
layout: ../layouts/Layout.astro
lang: zh
alt: /en/013_Example_Loading_Stock_Price_Data_en
---

<div class="top-nav">
  <a href="/012_Strategy_Logic_CN">← 上一章</a>
  <a href="/014_Example_Calculating_Momentum_Factor_CN">下一章 →</a>
</div>

>>>>>>> Stashed changes:src/pages/013_Example_Loading_Stock_Price_Data_CN.md
# 示例：加载股票价格数据

import yfinance as yf

tickers = ["AAPL", "MSFT", "GOOGL"]

data = yf.download(tickers, start="2015-01-01", end="2025-01-01")['Adj Close']

2.2 因子计算

因子是量化策略的核心，用于筛选优质股票和优化投资组合。

常用因子：

技术因子：

动量：过去 30 天的收益率，用于捕捉趋势。

波动率：过去一段时间的价格波动，用于评估风险。

均线：如 MA50（50 日均线）和 MA200，用于识别趋势。

基本面因子：

<<<<<<< Updated upstream:src/pages/013_示例：加载股票价格数据.md
P/E、P/B、ROE、净利润增长率等，用于衡量企业质量。
=======
P/E、P/B、ROE、净利润增长率等，用于衡量企业质量。

<div class="nav-links">
  <a href="/012_Strategy_Logic_CN">← 上一章</a>
  <a href="/014_Example_Calculating_Momentum_Factor_CN">下一章 →</a>
</div>
>>>>>>> Stashed changes:src/pages/013_Example_Loading_Stock_Price_Data_CN.md
