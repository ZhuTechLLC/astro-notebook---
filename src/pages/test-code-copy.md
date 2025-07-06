---
title: "代码复制功能测试"
description: "测试代码复制按钮和语法高亮功能"
layout: "../../layouts/HandbookLayout.astro"
---

# 代码复制功能测试

## Python 代码示例

```python
# 风险监控系统示例
class RiskMonitor:
    def __init__(self, portfolio_value=100000):
        self.portfolio_value = portfolio_value
        self.risk_metrics = {}
        
    def calculate_var(self, returns, confidence_level=0.95):
        """计算风险价值VaR"""
        import numpy as np
        sorted_returns = np.sort(returns)
        index = int((1 - confidence_level) * len(sorted_returns))
        return sorted_returns[index]
        
    def monitor_risk(self):
        """实时风险监控"""
        risk_report = {
            'timestamp': datetime.now(),
            'portfolio_value': self.portfolio_value,
            'risk_level': 'MEDIUM',
            'alerts': []
        }
        return risk_report
```

## JavaScript 代码示例

```javascript
// 主题切换功能
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // 触发主题变化事件
    document.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme: newTheme }
    }));
}

// 页面加载时应用保存的主题
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
});
```

## SQL 查询示例

```sql
-- 股票筛选查询
SELECT 
    symbol,
    company_name,
    market_cap,
    pe_ratio,
    revenue_growth,
    profit_margin
FROM stocks 
WHERE 
    market_cap > 1000000000 
    AND pe_ratio BETWEEN 10 AND 25
    AND revenue_growth > 0.15
    AND profit_margin > 0.10
ORDER BY market_cap DESC
LIMIT 20;
```

## Bash 脚本示例

```bash
#!/bin/bash
# 自动化部署脚本

# 设置变量
PROJECT_DIR="/path/to/astro-notebook"
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份
echo "创建备份..."
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$PROJECT_DIR"

# 更新代码
echo "更新代码..."
cd "$PROJECT_DIR"
git pull origin main

# 安装依赖
echo "安装依赖..."
npm install

# 构建项目
echo "构建项目..."
npm run build

echo "部署完成!"
```

## CSS 样式示例

```css
/* 代码复制按钮样式 */
.copy-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    color: #333333;
    padding: 8px 12px;
    font-size: 13px;
    cursor: pointer;
    opacity: 0.8;
    transition: all 0.2s ease;
}

.copy-button:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

## 测试说明

1. **复制按钮可见性**: 按钮现在默认显示（opacity: 0.8），悬停时完全显示
2. **主题适配**: 在亮色和暗色主题下都有合适的样式
3. **语法高亮**: 使用VS Code主题，支持多种编程语言
4. **响应式设计**: 在移动设备上也能正常显示和使用

## 功能特性

- ✅ 一键复制代码
- ✅ 键盘快捷键支持 (Ctrl+Shift+C)
- ✅ 复制成功反馈
- ✅ 降级处理（API不可用时自动选择文本）
- ✅ 无障碍支持
- ✅ 响应式设计 