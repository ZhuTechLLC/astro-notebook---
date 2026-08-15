---
title: "TRQuant NorthStar 对齐说明（2026-07）"
description: "美股实操手册与 TRQuant 北极星交易系统的边界、术语映射与推荐阅读路径"
lang: "zh-CN"
layout: "/src/layouts/Layout.astro"
updateDate: "2026-07-18"
---

# TRQuant NorthStar 对齐说明（2026-07）

**核心摘要：**

> Astro《美股投资实操手册》是**认知与方法论层**：教怎么想、怎么建体系；自动化交易是长期目标态。  
> TRQuant NorthStar 是**门禁与执行操作系统层**：管能不能做、做多大、如何审计。  
> 两者互补；**当前阶段**执行动作以 TRQuant 合同为准，默认 `recommendation_only_no_order_submission`——不是否定自动交易，而是系统与盈利模式尚未摸透前为时过早。

---

## 1. 两层分工

```text
Astro 手册（认知层）
  心理 / 高倍股 / 宏观轮动 / 个股研究 / 自动化技术储备
        ↓ 映射，不直接下单
TRQuant NorthStar（操作系统层）
  DataSource → Regime → MacroRisk → Theme → Stage0-7
  → EvidenceTier → PreTrade → Precommit → Sizing → Alerts/Review
```

| 层级 | 回答的问题 | 不回答的问题 |
|---|---|---|
| 手册 | 阶段叙事、研究方法、心理纪律、产业链框架 | 是否自动下单、是否已验证盈利 |
| NorthStar | freshness、PIT、hard veto、ledger、shadow SLO | 替代你阅读与思考 |

---

## 2. 旧术语 → 新合同映射

| 手册常见说法 | 2026-07 TRQuant 对应 | 注意 |
|---|---|---|
| 投资心理 / 偏见 | Reflection、Precommit、psychology contract | 正式事件写入 Event Lake |
| 高倍股 / 主升 | Stage0-7、Theme、major uptrend | 确认阶段 ≠ 立即重仓 |
| 赛道选择 | Theme / 动态主线 / 产业链分层 | 主线退潮时产业逻辑不能覆盖 gate |
| 选股筛选 | Candidate Pool → Checklist → Gate | P0 候选 ≠ 推荐 |
| 仓位配置表 | UnifiedSizing + budget | 预算突破时默认禁加仓 |
| 交易计划模板 | Target Flow + PreTrade Checklist | 必须带失效线与 evidence |
| 案例复盘 | ReviewCompiler + DecisionLedger | 可重放、可审计 |
| 自动交易 / IBKR / QC | 长期目标能力；当前 paper-shadow / 门禁后建议 | **目标保留；当前阶段不启用生产自动下单** |
| 回测赚钱 | Profit MVP / efficacy holdout | 当前 champion 为空时不得晋级 |

---

## 3. 当前阶段边界（目标 ≠ 已就绪）

1. **目标态**：自动化交易是最重要要实现的能力；手册中相关措辞**不降级**。  
2. **当前态**：`recommendation_only_no_order_submission`——决策支持与纸面/影子组合；系统未完善、细节未清、盈利模式未摸透前，不启用生产自动下单。  
3. 板块轮动 ETF 强弱可引证**风格阶段**，不可单独给**经济周期**盖章。  
4. 产业链叙事再强，也必须过 EvidenceTier / PreTrade / Precommit。  
5. 历史有效性为 `inconclusive` 时，不得宣称已验证盈利或启动 micro-live / 自动执行。  
6. 生产路径何时打开自动执行：以 NorthStar / Profit MVP **正式验收**为准，不以手册叙事为准。

确认清单已关闭（不做措辞降级）：TRQuant  
`context/US_ASTRO_HANDBOOK_EDIT_CONFIRMATION_LIST_20260718.md`。

---

## 4. 推荐阅读路径（手册内）

| 目标 | 手册入口 |
|---|---|
| 周期×行业轮动 | [II · 2.2](/book2/202_Chapter2/2.2_Market_Characteristics_by_Cycle_CN) |
| 每日轮动阶段卡 | [II · 2.5](/book2/202_Chapter2/2.5_Daily_Sector_Rotation_Stage_Proxy_Card_CN) |
| 产业链与板块内弹性 | [I · 4.7](/book1/004_Chapter4/4.7_Industry_Chain_and_Within_Sector_Magnitude_CN) |
| 心理与风险 | I · 第二章 |
| 宏观配置 | [II · 第九章](/book2/209_Chapter9_Macro_Driven_Asset_Allocation_CN) |

---

## 5. TRQuant 侧权威文档（仓库路径）

| 文档 | 路径 |
|---|---|
| NorthStar 使用手册 | `context/US_NORTHSTAR_USER_MANUAL_20260716.md` |
| 轮动阶段代理模板 | `context/US_SECTOR_ROTATION_STAGE_PROXY_TEMPLATE_v1.md` |
| Astro 阅读导读 | `context/US_ASTRO_HANDBOOK_READING_GUIDE_20260718.md` |
| 系统功能总览 | `context/TRQUANT_SYSTEM_FUNCTIONAL_INVENTORY_20260717.md` |
| 主题生命周期教义 | `context/THEME_LIFECYCLE_EARLY_LAYOUT_AND_EXIT_DOCTRINE_v1.md` |
| Skill 入口 | `.cursor/skills/trquant-northstar-trading-system/SKILL.md` |

---

## 6. 最终原则

1. 用手册校准大脑，用 NorthStar 校准动作。  
2. 先验证数据与阶段，再讨论机会。  
3. 先写确认/失效条件，再谈仓位。  
4. 任何时候都不把叙事、回测或 ETF 强弱直接升级为自动交易授权。

[返回首页](/)
