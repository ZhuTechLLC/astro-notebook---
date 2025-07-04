#!/usr/bin/env python3
"""
项目快速恢复脚本
用于项目重启后快速恢复开发上下文
"""

import os
import json
from datetime import datetime

def create_restore_summary():
    """创建项目恢复摘要"""
    
    summary = {
        "timestamp": datetime.now().isoformat(),
        "project": "Astro投资手册项目",
        "status": "组件化重构阶段",
        "key_achievements": [
            "第四章专业级升级完成 (4.1-4.6)",
            "第五章5.1节四维八步选股框架",
            "组件库建立 (ChapterOverview, CoreSummary, KeyMetrics)",
            "o3-pro评估与优化策略制定"
        ],
        "technical_stack": {
            "framework": "Astro",
            "theme": "VS Code Dark",
            "components": [
                "ChapterOverview.astro",
                "CoreSummary.astro", 
                "KeyMetrics.astro"
            ],
            "rules_file": ".cursorrules"
        },
        "current_tasks": [
            "统一第四章Front-matter字段",
            "重构5.1节使用新组件",
            "建立公共样式文件",
            "验证组件化效果"
        ],
        "quality_metrics": {
            "code_duplication": "40% (目标: <20%)",
            "token_efficiency": "基础水平 (目标: 提升50%+)",
            "visual_consistency": "85% (目标: 95%+)",
            "maintenance_cost": "中等 (目标: 降低70%)"
        },
        "key_files": {
            "components": "src/components/",
            "rules": ".cursorrules",
            "backup": "docs/chat_history_backup.md",
            "snapshot": "docs/project_status_snapshot.md",
            "evaluation": "src/pages/5.1_vs_ch4_evaluation.md"
        }
    }
    
    return summary

def save_restore_summary(summary):
    """保存恢复摘要到文件"""
    
    # 确保docs目录存在
    os.makedirs("docs", exist_ok=True)
    
    # 保存JSON格式
    with open("docs/restore_summary.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    
    # 保存Markdown格式
    with open("docs/restore_summary.md", "w", encoding="utf-8") as f:
        f.write(f"# 项目恢复摘要\n\n")
        f.write(f"**生成时间**: {summary['timestamp']}\n\n")
        f.write(f"**项目状态**: {summary['status']}\n\n")
        
        f.write("## 🎯 关键成就\n\n")
        for achievement in summary['key_achievements']:
            f.write(f"- {achievement}\n")
        f.write("\n")
        
        f.write("## 🔧 技术栈\n\n")
        f.write(f"- **框架**: {summary['technical_stack']['framework']}\n")
        f.write(f"- **主题**: {summary['technical_stack']['theme']}\n")
        f.write(f"- **组件**: {', '.join(summary['technical_stack']['components'])}\n")
        f.write(f"- **规则文件**: {summary['technical_stack']['rules_file']}\n\n")
        
        f.write("## 📋 当前任务\n\n")
        for i, task in enumerate(summary['current_tasks'], 1):
            f.write(f"{i}. {task}\n")
        f.write("\n")
        
        f.write("## 📊 质量指标\n\n")
        for metric, value in summary['quality_metrics'].items():
            f.write(f"- **{metric}**: {value}\n")
        f.write("\n")
        
        f.write("## 📁 关键文件\n\n")
        for name, path in summary['key_files'].items():
            f.write(f"- **{name}**: `{path}`\n")
        f.write("\n")
        
        f.write("## 🚀 快速开始\n\n")
        f.write("1. 查看 `docs/project_status_snapshot.md` 了解详细状态\n")
        f.write("2. 检查组件库 `src/components/` 完整性\n")
        f.write("3. 按优先级执行待办事项\n")
        f.write("4. 遵循 `.cursorrules` 规则系统\n\n")
        
        f.write("---\n*此文件由 quick_restore.py 自动生成*\n")

def check_project_health():
    """检查项目健康状态"""
    
    health_report = {
        "components": [],
        "rules": [],
        "backup_files": []
    }
    
    # 检查组件文件
    component_files = [
        "src/components/ChapterOverview.astro",
        "src/components/CoreSummary.astro", 
        "src/components/KeyMetrics.astro"
    ]
    
    for file in component_files:
        if os.path.exists(file):
            health_report["components"].append(f"✅ {file}")
        else:
            health_report["components"].append(f"❌ {file} (缺失)")
    
    # 检查规则文件
    rule_files = [".cursorrules"]
    for file in rule_files:
        if os.path.exists(file):
            health_report["rules"].append(f"✅ {file}")
        else:
            health_report["rules"].append(f"❌ {file} (缺失)")
    
    # 检查备份文件
    backup_files = [
        "docs/chat_history_backup.md",
        "docs/project_status_snapshot.md"
    ]
    
    for file in backup_files:
        if os.path.exists(file):
            health_report["backup_files"].append(f"✅ {file}")
        else:
            health_report["backup_files"].append(f"❌ {file} (缺失)")
    
    return health_report

def main():
    """主函数"""
    
    print("🔄 正在创建项目恢复摘要...")
    
    # 创建恢复摘要
    summary = create_restore_summary()
    
    # 保存摘要文件
    save_restore_summary(summary)
    
    # 检查项目健康状态
    health = check_project_health()
    
    print("✅ 项目恢复摘要已创建:")
    print("   - docs/restore_summary.json")
    print("   - docs/restore_summary.md")
    print()
    
    print("🔍 项目健康检查:")
    print("📦 组件文件:")
    for status in health["components"]:
        print(f"   {status}")
    print()
    
    print("📋 规则文件:")
    for status in health["rules"]:
        print(f"   {status}")
    print()
    
    print("💾 备份文件:")
    for status in health["backup_files"]:
        print(f"   {status}")
    print()
    
    print("🎯 下一步:")
    print("1. 查看 docs/restore_summary.md 了解项目状态")
    print("2. 按优先级执行待办事项")
    print("3. 遵循 .cursorrules 规则系统")
    print("4. 定期运行此脚本更新状态")

if __name__ == "__main__":
    main() 