#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量格式化章节文件的脚本
统一添加3点核心要点总结，清理重复导航链接
"""

import os
import re
from pathlib import Path

def get_chapter_order():
    """定义章节顺序"""
    return [
        "001_序言",
        "002_第一章：看清自己，看懂世界——投资的认知起点", 
        "003_第二章：投资心理与风险管理",
        "004_第三章：历史规律与高倍股研究",
        "005_第四章：赛道选择与行业趋势",
        "006_第五章：股票筛选策略",
        "007_第六章：交易策略与执行",
        "008_第七章：投资决策工具与资源",
        "009_第八章：案例复盘与策略改进",
        "010_第九章：构建投资体系",
        "011_第十章：交易执行与实战指南",
        "012_附录",
        "013_示例：加载股票价格数据",
        "014_示例：计算动量因子",
        "015_示例：等权构建组合",
        "016_示例：回测收益曲线",
        "017_使用scipy.optimize进行优化",
        "018_策略逻辑"
    ]

def get_core_points(filename):
    """根据文件名生成3个核心要点"""
    if "序言" in filename:
        return [
            "投资是一门需要系统学习和实践的技能，需要建立正确的认知基础",
            "成功的投资需要结合理论学习和实战经验，形成个人化的投资体系",
            "本手册将帮助读者建立完整的投资知识框架和实战能力"
        ]
    elif "投资心理" in filename or "风险管理" in filename:
        return [
            "投资心理是成功投资的关键因素，需要控制贪婪和恐惧情绪",
            "风险管理是投资体系的核心，包括仓位管理和止损策略",
            "建立正确的投资心态，保持理性分析和长期思维"
        ]
    elif "历史规律" in filename or "高倍股" in filename:
        return [
            "历史规律为投资决策提供重要参考，但需要结合当前市场环境",
            "高倍股研究揭示成功企业的共同特征和发展路径",
            "通过历史数据分析，识别投资机会和风险信号"
        ]
    elif "赛道选择" in filename or "行业趋势" in filename:
        return [
            "赛道选择是投资成功的关键，需要识别高成长性行业",
            "行业趋势分析帮助把握投资时机和方向",
            "结合宏观经济和产业政策，选择优质赛道进行布局"
        ]
    elif "股票筛选" in filename:
        return [
            "股票筛选需要建立科学的评价体系和筛选标准",
            "基本面分析和技术分析相结合，提高选股准确性",
            "持续跟踪和更新筛选结果，及时调整投资组合"
        ]
    elif "交易策略" in filename or "执行" in filename:
        return [
            "制定明确的交易策略，包括买入、持有和卖出条件",
            "严格执行交易计划，避免情绪化决策",
            "建立交易记录和复盘机制，持续优化策略"
        ]
    elif "决策工具" in filename or "资源" in filename:
        return [
            "利用专业工具和平台，提高投资决策效率",
            "建立信息收集和分析体系，获取高质量投资信息",
            "持续学习和更新知识，提升投资能力"
        ]
    elif "案例复盘" in filename or "策略改进" in filename:
        return [
            "通过案例复盘，总结成功经验和失败教训",
            "建立策略改进机制，持续优化投资方法",
            "将复盘成果转化为可执行的改进措施"
        ]
    elif "投资体系" in filename:
        return [
            "构建完整的投资体系，包括分析框架和决策流程",
            "建立风险控制和资金管理体系",
            "形成个人化的投资哲学和方法论"
        ]
    elif "实战指南" in filename:
        return [
            "掌握实战操作技巧，提高交易执行效率",
            "建立完整的交易流程和风控机制",
            "通过实战积累经验，提升投资水平"
        ]
    elif "附录" in filename:
        return [
            "附录包含重要的参考资料和补充信息",
            "提供实用的工具和模板，便于实际操作",
            "作为手册的重要补充，完善投资知识体系"
        ]
    elif "示例" in filename:
        return [
            "通过实际代码示例，展示投资策略的实现方法",
            "提供可运行的代码模板，便于学习和实践",
            "结合理论知识和实际应用，提升编程能力"
        ]
    else:
        return [
            "建立正确的投资认知和心态，是成功投资的基础",
            "制定科学的投资策略和风险管理体系",
            "持续学习和实践，不断提升投资能力"
        ]

def clean_content(content):
    """清理内容，移除重复的导航链接和gpt-tip块"""
    lines = content.split('\n')
    cleaned_lines = []
    
    # 移除gpt-tip块
    skip_gpt_tip = False
    for line in lines:
        if ':::tip' in line or ':::tip 核心要点' in line:
            skip_gpt_tip = True
            continue
        if skip_gpt_tip and line.strip() == ':::':
            skip_gpt_tip = False
            continue
        if skip_gpt_tip:
            continue
        
        # 移除重复的导航链接
        if '<div class="nav-links">' in line:
            continue
        if '</div>' in line and 'nav-links' in line:
            continue
        if '← 上一章' in line or '下一章 →' in line or '返回目录' in line:
            continue
        
        cleaned_lines.append(line)
    
    return '\n'.join(cleaned_lines)

def add_core_points_block(content, points):
    """添加核心要点块"""
    core_points_block = f''':::tip 核心要点
**本章核心要点：**

1. **{points[0]}**
2. **{points[1]}**  
3. **{points[2]}**

:::'''
    
    # 在标题后插入核心要点块
    lines = content.split('\n')
    new_lines = []
    title_found = False
    
    for line in lines:
        new_lines.append(line)
        if line.startswith('# ') and not title_found:
            new_lines.append('')  # 空行
            new_lines.append(core_points_block)
            new_lines.append('')  # 空行
            title_found = True
    
    return '\n'.join(new_lines)

def add_navigation_links(content, filename, chapter_order):
    """添加统一的导航链接"""
    try:
        current_index = chapter_order.index(filename)
    except ValueError:
        return content
    
    nav_links = []
    
    # 上一章链接
    if current_index > 0:
        prev_chapter = chapter_order[current_index - 1]
        if prev_chapter == "001_序言":
            nav_links.append('[← 序言](./001_序言)')
        else:
            title = prev_chapter.split("：", 1)[-1] if "：" in prev_chapter else prev_chapter
            nav_links.append(f'[← 第{current_index}章：{title}](./{prev_chapter})')
    else:
        nav_links.append('[← 返回目录](./index)')
    
    # 下一章链接
    if current_index < len(chapter_order) - 1:
        next_chapter = chapter_order[current_index + 1]
        if next_chapter == "001_序言":
            nav_links.append('[序言 →](./001_序言)')
        else:
            title = next_chapter.split("：", 1)[-1] if "：" in next_chapter else next_chapter
            nav_links.append(f'[第{current_index + 2}章：{title} →](./{next_chapter})')
    else:
        nav_links.append('[返回目录 →](./index)')
    
    nav_block = f'''

---

**📖 导航链接：** {' | '.join(nav_links)}

---'''
    
    # 在内容末尾添加导航
    return content + nav_block

def process_chapter_file(file_path, chapter_order):
    """处理单个章节文件"""
    print(f"处理文件: {file_path}")
    
    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 获取文件名（不含扩展名）
    filename = Path(file_path).stem
    
    # 清理现有内容
    content = clean_content(content)
    
    # 获取核心要点
    points = get_core_points(filename)
    print(f"核心要点: {points}")
    
    # 添加核心要点块
    content = add_core_points_block(content, points)
    
    # 添加导航链接
    content = add_navigation_links(content, filename, chapter_order)
    
    # 保存文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ 完成处理: {file_path}")

def main():
    """主函数"""
    pages_dir = Path('src/pages')
    chapter_order = get_chapter_order()
    
    # 获取所有章节文件
    chapter_files = []
    for file_path in pages_dir.glob('*.md'):
        if file_path.name.startswith(('00', '01')):
            chapter_files.append(file_path)
    
    chapter_files.sort()
    
    print(f"找到 {len(chapter_files)} 个章节文件")
    
    # 处理每个章节
    for file_path in chapter_files:
        process_chapter_file(file_path, chapter_order)
    
    print("🎉 所有章节处理完成！")

if __name__ == "__main__":
    main() 