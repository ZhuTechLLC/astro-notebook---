---
title: "K.1 小节页面模板指南"
description: "Astro投资手册小节页面标准格式与内容模块完整示例"
lang: "zh-CN"
alt: "小节模板指南"
layout: "../../layouts/HandbookLayout.astro"
updateDate: "2025-01-03"
---

# K.1 小节页面模板指南

> **核心摘要：**
> 
>本指南提供Astro投资手册小节页面的完整标准格式与各类内容模块示例，包括公式展示、数据表格、图片处理、互动元素等。通过标准化模板，确保全书内容格式统一、可读性强、可维护性高。

## 📋 章节导航
<div class="chapter-overview">
  <div class="overview-grid">
    <div class="overview-item">
      <h4>K.1.1 基础结构模板</h4>
      <p>Frontmatter、核心摘要、章节导航等基础结构</p>
    </div>
    <div class="overview-item">
      <h4>K.1.2 内容模块示例</h4>
      <p>公式、表格、图片、互动元素等各类内容展示</p>
    </div>
    <div class="overview-item">
      <h4>K.1.3 格式规范说明</h4>
      <p>缩进、空行、样式类等格式要求详细说明</p>
    </div>
    <div class="overview-item">
      <h4>K.1.4 扩展性设计</h4>
      <p>模板弹性扩展、自定义内容块设计原则</p>
    </div>
  </div>
</div>

## K.1.1 基础页面结构模板

### Frontmatter 标准格式

```yaml
---
title: "小节标题"
description: "页面描述（简明扼要，利于SEO）"
lang: "zh-CN"
alt: "可选替代标题"
layout: "../../layouts/HandbookLayout.astro"
updateDate: "2025-01-03"
---
```

### 核心摘要固定格式

```markdown
**核心摘要：**
> 
>本小节核心观点、方法或结论简要总结。可多行，便于读者快速把握重点。支持换行和详细描述，但建议控制在3-5行内。
```

### 章节导航标准结构

```html
## 📋 章节导航
<div class="chapter-overview">
  <div class="overview-grid">
    <div class="overview-item">
      <h4>小节要点1</h4>
      <p>简要描述要点内容，支持多行扩展。</p>
    </div>
    <div class="overview-item">
      <h4>小节要点2</h4>
      <p>可根据实际内容增减overview-item数量。</p>
    </div>
    <!-- 可继续添加overview-item，保持2空格缩进，无空行 -->
  </div>
</div>
```

## K.1.2 内容模块展示示例

### 公式展示模块

<div class="info-block">
  <div class="info-title">夏普比率计算公式</div>
  <div class="info-content">
    <div class="formula-display">
      夏普比率 = (投资组合收益率 - 无风险收益率) / 投资组合标准差
    </div>
    <div class="formula-latex">
      $$\text{Sharpe Ratio} = \frac{R_p - R_f}{\sigma_p}$$
    </div>
  </div>
  <div class="info-explanation">
    其中：R_p为投资组合收益率，R_f为无风险收益率，σ_p为投资组合标准差。夏普比率越高，表示单位风险获得的超额收益越多。
  </div>
</div>

### 夏普比率公式示例（MathJax推荐写法）

夏普比率定义如下：

$$
\text{Sharpe Ratio} = \frac{R_p - R_f}{\sigma_p}
$$

其中 $R_p$ 为投资组合收益率，$R_f$ 为无风险收益率，$\sigma_p$ 为投资组合标准差。

### 数据表格模块

<div class="info-block">
  <div class="info-title">主要财务指标对比</div>
  <div class="info-content">
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>指标</th>
            <th>公司A</th>
            <th>公司B</th>
            <th>行业平均</th>
            <th>评级</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ROE (%)</td>
            <td class="positive">15.2</td>
            <td class="neutral">12.8</td>
            <td>11.5</td>
            <td><span class="rating excellent">优秀</span></td>
          </tr>
          <tr>
            <td>P/E</td>
            <td>18.5</td>
            <td>22.3</td>
            <td>20.1</td>
            <td><span class="rating good">良好</span></td>
          </tr>
          <tr>
            <td>负债率 (%)</td>
            <td class="negative">65.2</td>
            <td>45.8</td>
            <td>52.3</td>
            <td><span class="rating warning">注意</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="info-explanation">
    表格数据支持颜色编码：正值用绿色，负值用红色，中性值用默认色。评级标签支持优秀、良好、注意、风险等级别。
  </div>
</div>

### 图片展示模块

<div class="info-block">
  <div class="info-title">投资组合收益曲线</div>
  <div class="info-content">
    <div class="image-container">
      <img src="/images/portfolio-performance.png" alt="投资组合收益曲线图" class="responsive-image" />
      <div class="image-caption">
        图1: 2020-2024年投资组合收益曲线对比（数据来源：Wind金融终端）
      </div>
    </div>
  </div>
  <div class="info-explanation">
    图片支持响应式显示，自动适配不同屏幕尺寸。建议使用WebP格式，并提供详细的alt描述和数据来源。
  </div>
</div>

### 互动元素模块

<div class="info-block">
  <div class="info-title">风险评估工具</div>
  <div class="info-content">
    <div class="interactive-element">
      <div class="risk-calculator">
        <div class="input-group">
          <label>投资金额 (万元):</label>
          <input type="number" id="investment-amount" value="100" min="1" max="10000" />
        </div>
        <div class="input-group">
          <label>风险偏好:</label>
          <select id="risk-preference">
            <option value="conservative">保守型</option>
            <option value="moderate">稳健型</option>
            <option value="aggressive">积极型</option>
          </select>
        </div>
        <div class="result-display">
          <div class="result-item">
            <span class="label">建议股票比例:</span>
            <span class="value" id="stock-ratio">60%</span>
          </div>
          <div class="result-item">
            <span class="label">预期年化收益:</span>
            <span class="value" id="expected-return">8.5%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="info-explanation">
    互动元素支持实时计算和动态显示。可集成简单的JavaScript逻辑，提供更好的用户体验。
  </div>
</div>

### 代码示例模块

<div class="info-block">
  <div class="info-title">Python股票数据获取</div>
  <div class="info-content">
    <div class="code-block">
      <div class="code-header">
        <span class="language">Python</span>
        <button class="copy-btn">复制代码</button>
      </div>
      <pre><code class="language-python">
import yfinance as yf
import pandas as pd

# 获取股票数据
def get_stock_data(symbol, period='1y'):
    """
    获取股票历史数据
    
    Args:
        symbol: 股票代码
        period: 时间周期
    
    Returns:
        DataFrame: 股票数据
    """
    stock = yf.Ticker(symbol)
    data = stock.history(period=period)
    return data

# 示例使用
aapl_data = get_stock_data('AAPL', '2y')
print(aapl_data.head())
      </code></pre>
    </div>
  </div>
  <div class="info-explanation">
    代码块支持语法高亮、复制功能，并提供详细的注释说明。建议包含完整的函数文档和使用示例。
  </div>
</div>

### 警告提示模块

<div class="warning-block">
  <div class="warning-icon">⚠️</div>
  <div class="warning-content">
    <div class="warning-title">投资风险提示</div>
    <div class="warning-text">
      股票投资存在市场风险，历史业绩不代表未来表现。投资者应根据自身风险承受能力谨慎投资，必要时咨询专业投资顾问。
    </div>
  </div>
</div>

### 成功案例模块

<div class="success-block">
  <div class="success-icon">✅</div>
  <div class="success-content">
    <div class="success-title">成功案例</div>
    <div class="success-text">
      通过应用本章介绍的价值投资策略，投资者在2020-2023年期间实现了年化15.2%的收益，显著超越市场基准。
    </div>
  </div>
</div>

### 引用文献模块

<div class="reference-block">
  <div class="reference-title">参考文献</div>
  <div class="reference-list">
    <div class="reference-item">
      [1] Graham, B., & Dodd, D. (2008). Security Analysis. McGraw-Hill Education.
    </div>
    <div class="reference-item">
      [2] Buffett, W. (2020). Berkshire Hathaway Annual Report. Berkshire Hathaway Inc.
    </div>
    <div class="reference-item">
      [3] 中国证监会. (2023). 《证券投资基金管理办法》. 中国证监会官网.
    </div>
  </div>
</div>

## K.1.3 格式规范详细说明

### HTML标签缩进规范

```html
<!-- 正确：2空格缩进，无空行 -->
<div class="info-block">
  <div class="info-title">标题</div>
  <div class="info-content">
    内容
  </div>
</div>

<!-- 错误：4空格缩进，有空行 -->
<div class="info-block">

    <div class="info-title">标题</div>
    
    <div class="info-content">
        内容
    </div>
    
</div>
```

### CSS类命名规范

- `.info-block`: 信息块容器
- `.info-title`: 信息块标题
- `.info-content`: 信息块内容
- `.info-explanation`: 信息块说明
- `.overview-item`: 概览项目
- `.chapter-overview`: 章节概览容器
- `.warning-block`: 警告提示块
- `.success-block`: 成功案例块
- `.reference-block`: 参考文献块

### 响应式设计要求

```css
/* 移动端适配 */
@media (max-width: 768px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .responsive-image {
    max-width: 100%;
    height: auto;
  }
}
```

## K.1.4 扩展性设计原则

### 自定义内容块

```html
<!-- 可扩展的内容块结构 -->
<div class="custom-block [type-class]">
  <div class="custom-header">
    <div class="custom-icon">[图标]</div>
    <div class="custom-title">[标题]</div>
  </div>
  <div class="custom-content">
    [内容区域]
  </div>
  <div class="custom-footer">
    [底部信息]
  </div>
</div>
```

### 主题变量支持

```css
/* 支持主题切换的CSS变量 */
.info-block {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.warning-block {
  background: var(--warning-bg);
  border-left: 4px solid var(--warning-color);
}
```

### 多语言支持

```markdown
<!-- 中文版本 -->
**核心摘要：**
> 
>中文摘要内容

<!-- 英文版本 -->
**Core Summary:**
> 
>English summary content
```

## K.1.5 模板使用指南

### 快速开始

1. 复制基础模板结构
2. 填写frontmatter信息
3. 编写核心摘要
4. 设计章节导航
5. 添加内容模块
6. 检查格式规范
7. 测试响应式显示

### 内容模块选择

- **公式密集型**: 使用info-block + formula-display
- **数据分析型**: 使用table-container + data-table
- **案例研究型**: 使用image-container + success-block
- **工具介绍型**: 使用interactive-element + code-block
- **风险提示型**: 使用warning-block + reference-block

### 质量检查清单

- [ ] Frontmatter字段完整
- [ ] 核心摘要格式正确
- [ ] HTML标签无空行
- [ ] 2空格缩进一致
- [ ] 响应式图片设置
- [ ] 代码语法高亮
- [ ] 表格数据准确
- [ ] 引用来源标注
- [ ] 多端显示测试

<style>
/* 模板专用样式 */
.formula-display {
  background: var(--code-bg);
  padding: 1rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  text-align: center;
  margin: 0.5rem 0;
}

.formula-latex {
  text-align: center;
  margin: 1rem 0;
}

.table-container {
  overflow-x: auto;
  margin: 1rem 0;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  background: var(--card-bg);
  font-weight: 600;
}

.positive {
  color: var(--success-color);
}

.negative {
  color: var(--error-color);
}

.neutral {
  color: var(--text-secondary);
}

.rating {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.rating.excellent {
  background: var(--success-bg);
  color: var(--success-color);
}

.rating.good {
  background: var(--info-bg);
  color: var(--info-color);
}

.rating.warning {
  background: var(--warning-bg);
  color: var(--warning-color);
}

.image-container {
  text-align: center;
  margin: 1rem 0;
}

.responsive-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.image-caption {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
  font-style: italic;
}

.interactive-element {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.risk-calculator {
  max-width: 400px;
  margin: 0 auto;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--text-primary);
}

.result-display {
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--highlight-bg);
  border-radius: 4px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-item .label {
  font-weight: 500;
}

.result-item .value {
  color: var(--primary-color);
  font-weight: 600;
}

.code-block {
  margin: 1rem 0;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--code-header-bg);
  padding: 0.5rem 1rem;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid var(--border-color);
}

.language {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.copy-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
}

.copy-btn:hover {
  background: var(--primary-dark);
}

.warning-block,
.success-block {
  display: flex;
  align-items: flex-start;
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.warning-block {
  background: var(--warning-bg);
  border-left-color: var(--warning-color);
}

.success-block {
  background: var(--success-bg);
  border-left-color: var(--success-color);
}

.warning-icon,
.success-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
  margin-top: 0.125rem;
}

.warning-title,
.success-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.warning-text,
.success-text {
  line-height: 1.6;
}

.reference-block {
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.reference-title {
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.reference-item {
  margin-bottom: 0.75rem;
  padding-left: 1rem;
  position: relative;
  line-height: 1.6;
}

.reference-item:last-child {
  margin-bottom: 0;
}

.reference-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.75rem;
  width: 4px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 50%;
}

@media (max-width: 768px) {
  .overview-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .interactive-element {
    padding: 1rem;
  }
  
  .risk-calculator {
    max-width: 100%;
  }
  
  .code-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .warning-block,
  .success-block {
    flex-direction: column;
    text-align: center;
  }
  
  .warning-icon,
  .success-icon {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}
</style>

## K.1.6 公式格式规范与混合渲染最佳实践

### 1. 推荐用法：纯Markdown公式

- 适用范围：绝大多数章节、知识点、正文内容
- 写法示例：

  行内公式：`$E=mc^2$`

  块级公式：
  ```
  $$
  \int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
  $$
  ```
- 优点：结构清晰、渲染稳定、便于维护

### 2. 特殊场景：HTML标签+前端MathJax渲染

- 适用范围：
  - 需要在表格、交互组件、弹窗等复杂HTML结构中插入公式
  - 需要为单个公式定制样式或动态渲染
- 写法示例：

  ```html
  <div class="custom-math-formula">$$E=mc^2$$</div>
  <span class="inline-math">$a^2+b^2=c^2$</span>
  ```
- 配合前端MathJax脚本（在布局文件<head>中引入）：
  ```html
  <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
  ```
- 可用CSS隔离特殊公式样式：
  ```css
  .custom-math-formula {
    color: var(--primary-color);
    font-size: 1.2em;
    margin: 1rem 0;
  }
  .inline-math {
    color: var(--success-color);
    font-weight: bold;
  }
  ```

### 3. 格式规范建议

- 常规内容统一用Markdown公式，保持内容结构化、可维护。
- 特殊场景允许HTML标签+MathJax，但需加自定义class，避免影响全局样式。
- 在格式规范文档和模板中明确区分两种用法，便于团队协作和后期维护。
- 如需批量渲染标签内公式，建议在布局文件全局引入MathJax CDN脚本。

### 4. 常见场景公式写法与渲染示例

#### 4.1 纯Markdown行内公式

爱因斯坦质能方程：$E=mc^2$，可直接在正文中使用。

#### 4.2 纯Markdown块级公式

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

#### 4.3 HTML标签包裹公式

<div class="custom-math-formula">$$E=mc^2$$</div>
<span class="inline-math">$a^2+b^2=c^2$</span>

#### 4.4 表格内公式

<table class="data-table">
  <thead>
    <tr><th>变量</th><th>公式</th></tr>
  </thead>
  <tbody>
    <tr><td>夏普比率</td><td>$$\text{Sharpe Ratio} = \frac{R_p - R_f}{\sigma_p}$$</td></tr>
    <tr><td>贝塔系数</td><td>$$\beta = \frac{\text{Cov}(r_i, r_m)}{\text{Var}(r_m)}$$</td></tr>
  </tbody>
</table>

#### 4.5 交互组件/动态内容内公式

<div class="info-block">
  <div class="info-title">动态公式演示</div>
  <div class="info-content">
    <div class="custom-math-formula">$$f(x) = x^2 + 2x + 1$$</div>
    <span class="inline-math">$x = {-b \pm \sqrt{b^2-4ac} \over 2a}$</span>
  </div>
  <div class="info-explanation">
    这些公式可通过JS动态插入，MathJax会自动渲染。
  </div>
</div>

### 5. 股票数据获取与公司信息交互示例

<div class="info-block">
  <div class="info-title">股票数据获取与公司信息</div>
  <div class="info-content">
    <div class="stock-fetcher">
      <label for="stock-symbol">股票代码：</label>
      <input type="text" id="stock-symbol" value="AAPL" placeholder="如AAPL、TSLA、MSFT" />
      <button id="fetch-stock-btn">获取数据</button>
    </div>
    <div id="stock-result" class="stock-result"></div>
    <div id="stock-profile" class="stock-profile"></div>
    <div id="stock-chart" class="stock-chart" style="margin-top:1.5rem; text-align:center; color:var(--text-secondary);">请先输入股票代码并点击获取数据，支持AAPL、TSLA、MSFT等美股。</div>
  </div>
  <div class="info-explanation">
    本工具通过Yahoo Finance公开API获取美股实时行情、近30天收盘价折线图及公司简介/财务摘要。输入股票代码后点击“获取数据”即可显示。
  </div>
</div>

<!-- 引入Plotly.js CDN -->
<script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>
<script type="text/javascript">
  document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('fetch-stock-btn');
    const input = document.getElementById('stock-symbol');
    const result = document.getElementById('stock-result');
    const chart = document.getElementById('stock-chart');
    const profile = document.getElementById('stock-profile');
    if (!btn || !input || !result || !chart || !profile) return;
    btn.onclick = async function() {
      const symbol = input.value.trim().toUpperCase();
      if (!symbol) {
        result.innerHTML = '<span style="color:red">请输入股票代码</span>';
        chart.innerHTML = '请先输入股票代码并点击获取数据，支持AAPL、TSLA、MSFT等美股。';
        profile.innerHTML = '';
        return;
      }
      result.innerHTML = '正在获取数据...';
      chart.innerHTML = '';
      profile.innerHTML = '';
      try {
        // 1. 获取实时行情
        const quoteUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
        const quoteResp = await fetch(quoteUrl);
        const quoteData = await quoteResp.json();
        if (!quoteData.quoteResponse || !quoteData.quoteResponse.result || !quoteData.quoteResponse.result.length) {
          result.innerHTML = `<span style=\"color:red\">未找到股票：${symbol}</span>`;
          chart.innerHTML = '请先输入股票代码并点击获取数据，支持AAPL、TSLA、MSFT等美股。';
          return;
        }
        const stock = quoteData.quoteResponse.result[0];
        result.innerHTML = `
          <div><b>${stock.shortName || stock.symbol}</b> (${stock.symbol})</div>
          <div>最新价：<b>${stock.regularMarketPrice}</b> ${stock.currency || ''}</div>
          <div>涨跌：${stock.regularMarketChange} (${stock.regularMarketChangePercent}%)</div>
          <div>开盘：${stock.regularMarketOpen}，最高：${stock.regularMarketDayHigh}，最低：${stock.regularMarketDayLow}</div>
          <div>市值：${stock.marketCap ? stock.marketCap.toLocaleString() : 'N/A'}</div>
        `;
        // 2. 获取公司简介/财务摘要
        const profileUrl = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=assetProfile,financialData,defaultKeyStatistics`;
        const profileResp = await fetch(profileUrl);
        const profileData = await profileResp.json();
        if (profileData.quoteSummary && profileData.quoteSummary.result && profileData.quoteSummary.result[0]) {
          const p = profileData.quoteSummary.result[0];
          let html = '';
          if (p.assetProfile) {
            html += `<div><b>公司简介：</b>${p.assetProfile.longBusinessSummary || ''}</div>`;
            html += `<div><b>行业：</b>${p.assetProfile.industry || ''}，<b>板块：</b>${p.assetProfile.sector || ''}</div>`;
            html += `<div><b>地址：</b>${p.assetProfile.address1 || ''} ${p.assetProfile.city || ''} ${p.assetProfile.country || ''}</div>`;
          }
          if (p.financialData) {
            html += `<div><b>市盈率(PE)：</b>${p.defaultKeyStatistics && p.defaultKeyStatistics.trailingPE ? p.defaultKeyStatistics.trailingPE.fmt : 'N/A'}</div>`;
            html += `<div><b>每股收益(EPS)：</b>${p.defaultKeyStatistics && p.defaultKeyStatistics.trailingEps ? p.defaultKeyStatistics.trailingEps.fmt : 'N/A'}</div>`;
            html += `<div><b>营收：</b>${p.financialData.totalRevenue ? p.financialData.totalRevenue.fmt : 'N/A'}</div>`;
            html += `<div><b>净利润率：</b>${p.financialData.profitMargins ? p.financialData.profitMargins.fmt : 'N/A'}</div>`;
            html += `<div><b>负债率：</b>${p.financialData.debtToEquity ? p.financialData.debtToEquity.fmt : 'N/A'}</div>`;
          }
          profile.innerHTML = html;
        }
        // 3. 获取近30天K线数据
        const end = Math.floor(Date.now() / 1000);
        const start = end - 60*60*24*35;
        const klineUrl = `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=${start}&period2=${end}&interval=1d&events=history&includeAdjustedClose=true`;
        const klineResp = await fetch(klineUrl);
        const csv = await klineResp.text();
        const lines = csv.split('\n').filter(l => l.trim().length > 0);
        if (lines.length < 2) {
          chart.innerHTML = '<span style="color:red">无历史行情数据</span>';
          return;
        }
        const dates = [], closes = [];
        for (let i = 1; i < lines.length; ++i) {
          const cols = lines[i].split(',');
          if (cols.length < 5) continue;
          dates.push(cols[0]);
          closes.push(parseFloat(cols[4]));
        }
        const showDates = dates.slice(-30);
        const showCloses = closes.slice(-30);
        Plotly.newPlot(chart, [{
          x: showDates,
          y: showCloses,
          type: 'scatter',
          mode: 'lines+markers',
          line: {color: '#4f46e5', width: 3},
          marker: {size: 6, color: '#4f46e5'},
          name: symbol + ' 收盘价'
        }], {
          title: symbol + ' 近30日收盘价',
          xaxis: {title: '日期'},
          yaxis: {title: '收盘价'},
          margin: {t: 40, l: 50, r: 20, b: 50},
          plot_bgcolor: 'rgba(255,255,255,0)',
          paper_bgcolor: 'rgba(255,255,255,0)'
        }, {displayModeBar: false, responsive: true});
      } catch (e) {
        result.innerHTML = `<span style=\"color:red\">获取失败：${e.message}</span>`;
        chart.innerHTML = '请先输入股票代码并点击获取数据，支持AAPL、TSLA、MSFT等美股。';
        profile.innerHTML = '';
      }
    };
  });
</script>

<style>
  .stock-fetcher {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .stock-fetcher input {
    width: 120px;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
  }
  .stock-fetcher button {
    padding: 0.25rem 0.75rem;
    background: var(--primary-color);
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .stock-fetcher button:hover {
    background: var(--primary-dark);
  }
  .stock-result {
    margin-top: 0.5rem;
    font-size: 1rem;
    line-height: 1.7;
  }
  .stock-profile {
    margin-top: 0.5rem;
    font-size: 0.98rem;
    color: var(--text-secondary);
    line-height: 1.7;
    max-width: 700px;
  }
  .stock-chart {
    width: 100%;
    min-height: 320px;
    max-width: 700px;
    margin: 0 auto;
  }
</style>

---

> **所有上述写法在本页面均应被MathJax自动渲染为数学公式。**

---