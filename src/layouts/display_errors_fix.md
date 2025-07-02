
# Webpage Common Display Errors & Fix Guide

## 1  Duplicate List Markers

| Location | Symptom | Root Cause | Recommended Fix |
|----------|---------|------------|-----------------|
| 日常检查制度 – `morning‑check` 列表 | 黑色圆点 (默认 `li` bullet) **+** “□” 字符双重标记 | Markdown 在自定义 HTML 代码前自动插入 `<ul><li>`，而组件内部又手动在文本与 `::before` 中放入“□” | - 在 Markdown 中避免在自定义 `<div>` 之前使用 “- ” 等列表语法<br>- 或给外层 `ul` 增加 `.no-style{ list-style:none; padding:0}` |
| 自律能力自测表 – `assessment-checklist` | 出现两个“□” | 既在文本里硬编码“□”，又在 `li::before` 生成“□” | 仅保留 **一种**：<br>① 更语义化地使用 `<input type="checkbox">`；或<br>② 删除文本里的“□”，继续使用伪元素 |

---

## 2  `list-style:none` 未生效

* **症状**：仍显示默认圆点  
* **原因**：选择器不匹配或被 Markdown 注入的外层 `<ul>` 覆盖  
* **修复**：提高选择器优先级，例如  

```css
.daily-checks ul,
.daily-checks li,
.no-style ul,
.no-style li { list-style:none!important; margin:0; padding:0; }
```

---

## 3  图标与文本对齐偏移

* **症状**：框线与图标之间有过宽空隙  
* **原因**：在 `li` 上同时设置 `padding-left` 与伪元素 `left:`，缩进被叠加  
* **修复**：  
  ```css
  .morning-check li { padding-left:1.6rem; }
  .morning-check li::before { left:0.6rem; }
  ```

---

## 4  过度硬编码的图符

硬编码图符（“□”“•” 等）难以统一风格，可改用 **伪元素** 或 **SVG / Icon Font** 统一控制颜色及大小。

---

## 5  无障碍与语义

* 用字符模拟勾选框对 **屏幕阅读器** 不友好。  
* 建议：`<input type="checkbox" aria-label="隔夜重大消息梳理">`

---

## 示例（已精简）

```html
<div class="morning-check">
  <h5>🌅 每日开盘前检查</h5>
  <ul class="no-style">
    <li><input type="checkbox" aria-label="隔夜重大消息梳理"> 隔夜重大消息梳理</li>
    <li><input type="checkbox" aria-label="持仓股票公告检查"> 持仓股票公告检查</li>
  </ul>
</div>
```

```css
.no-style         { list-style:none; margin:0; padding:0; }
.no-style li      { display:flex; align-items:center; gap:.4rem; }
```

---

## 检查清单

- [ ] 去掉硬编码“□”“•”
- [ ] 所有自定义列表统一添加 `.no-style`
- [ ] 调整 `padding-left` / `left:` 保证图标居中
- [ ] 如需勾选功能改用 `<input type="checkbox">`
- [ ] 增加无障碍属性 (`aria-label`)
