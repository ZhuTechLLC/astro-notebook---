#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import argparse
from content_sync import ContentSync
from format_optimizer import FormatOptimizer

class UpdateWorkflow:
    def __init__(self):
        self.content_sync = ContentSync()
        self.format_optimizer = FormatOptimizer()
        
    def run_full_update(self):
        """运行完整更新流程"""
        print("🔄 开始完整更新流程...")
        print("=" * 50)
        
        # 第一步：内容同步
        print("📄 步骤1: 内容同步")
        print("-" * 30)
        self.content_sync.sync_content()
        print()
        
        # 第二步：格式优化
        print("🎨 步骤2: 格式优化")
        print("-" * 30)
        self.format_optimizer.optimize_all()
        print()
        
        print("✅ 更新流程完成！")
        print("=" * 50)
    
    def run_content_sync_only(self):
        """仅运行内容同步"""
        print("📄 运行内容同步...")
        self.content_sync.sync_content()
    
    def run_format_optimization_only(self):
        """仅运行格式优化"""
        print("🎨 运行格式优化...")
        self.format_optimizer.optimize_all()
    
    def check_updates(self):
        """检查是否有更新"""
        updates = self.content_sync.check_for_updates()
        if isinstance(updates, list) and updates:
            print(f"📝 发现 {len(updates)} 个文件需要更新:")
            for file in updates:
                print(f"  - {file}")
        else:
            print("✅ 所有文件都是最新的")
        return updates
    
    def backup_current_content(self):
        """备份当前内容"""
        import shutil
        from datetime import datetime
        
        backup_dir = f"backup/content_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        if os.path.exists("src/pages"):
            shutil.copytree("src/pages", f"{backup_dir}/pages")
            print(f"📦 已备份到: {backup_dir}")
    
    def restore_from_backup(self, backup_path):
        """从备份恢复"""
        import shutil
        
        if os.path.exists(backup_path):
            shutil.rmtree("src/pages", ignore_errors=True)
            shutil.copytree(f"{backup_path}/pages", "src/pages")
            print(f"🔄 已从备份恢复: {backup_path}")
        else:
            print(f"❌ 备份路径不存在: {backup_path}")

def main():
    parser = argparse.ArgumentParser(description="投资手册更新工作流程")
    parser.add_argument("--mode", choices=["full", "sync", "format", "check", "backup", "restore"], 
                       default="full", help="运行模式")
    parser.add_argument("--backup-path", help="备份路径（用于恢复模式）")
    parser.add_argument("--no-backup", action="store_true", help="跳过备份")
    
    args = parser.parse_args()
    
    workflow = UpdateWorkflow()
    
    try:
        if args.mode == "full":
            if not args.no_backup:
                workflow.backup_current_content()
            workflow.run_full_update()
            
        elif args.mode == "sync":
            workflow.run_content_sync_only()
            
        elif args.mode == "format":
            workflow.run_format_optimization_only()
            
        elif args.mode == "check":
            workflow.check_updates()
            
        elif args.mode == "backup":
            workflow.backup_current_content()
            
        elif args.mode == "restore":
            if not args.backup_path:
                print("❌ 恢复模式需要指定备份路径: --backup-path")
                return
            workflow.restore_from_backup(args.backup_path)
            
    except Exception as e:
        print(f"❌ 更新过程中出现错误: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 
# -*- coding: utf-8 -*-

import os
import sys
import argparse
from content_sync import ContentSync
from format_optimizer import FormatOptimizer

class UpdateWorkflow:
    def __init__(self):
        self.content_sync = ContentSync()
        self.format_optimizer = FormatOptimizer()
        
    def run_full_update(self):
        """运行完整更新流程"""
        print("🔄 开始完整更新流程...")
        print("=" * 50)
        
        # 第一步：内容同步
        print("📄 步骤1: 内容同步")
        print("-" * 30)
        self.content_sync.sync_content()
        print()
        
        # 第二步：格式优化
        print("🎨 步骤2: 格式优化")
        print("-" * 30)
        self.format_optimizer.optimize_all()
        print()
        
        print("✅ 更新流程完成！")
        print("=" * 50)
    
    def run_content_sync_only(self):
        """仅运行内容同步"""
        print("📄 运行内容同步...")
        self.content_sync.sync_content()
    
    def run_format_optimization_only(self):
        """仅运行格式优化"""
        print("🎨 运行格式优化...")
        self.format_optimizer.optimize_all()
    
    def check_updates(self):
        """检查是否有更新"""
        updates = self.content_sync.check_for_updates()
        if isinstance(updates, list) and updates:
            print(f"📝 发现 {len(updates)} 个文件需要更新:")
            for file in updates:
                print(f"  - {file}")
        else:
            print("✅ 所有文件都是最新的")
        return updates
    
    def backup_current_content(self):
        """备份当前内容"""
        import shutil
        from datetime import datetime
        
        backup_dir = f"backup/content_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        if os.path.exists("src/pages"):
            shutil.copytree("src/pages", f"{backup_dir}/pages")
            print(f"📦 已备份到: {backup_dir}")
    
    def restore_from_backup(self, backup_path):
        """从备份恢复"""
        import shutil
        
        if os.path.exists(backup_path):
            shutil.rmtree("src/pages", ignore_errors=True)
            shutil.copytree(f"{backup_path}/pages", "src/pages")
            print(f"🔄 已从备份恢复: {backup_path}")
        else:
            print(f"❌ 备份路径不存在: {backup_path}")

def main():
    parser = argparse.ArgumentParser(description="投资手册更新工作流程")
    parser.add_argument("--mode", choices=["full", "sync", "format", "check", "backup", "restore"], 
                       default="full", help="运行模式")
    parser.add_argument("--backup-path", help="备份路径（用于恢复模式）")
    parser.add_argument("--no-backup", action="store_true", help="跳过备份")
    
    args = parser.parse_args()
    
    workflow = UpdateWorkflow()
    
    try:
        if args.mode == "full":
            if not args.no_backup:
                workflow.backup_current_content()
            workflow.run_full_update()
            
        elif args.mode == "sync":
            workflow.run_content_sync_only()
            
        elif args.mode == "format":
            workflow.run_format_optimization_only()
            
        elif args.mode == "check":
            workflow.check_updates()
            
        elif args.mode == "backup":
            workflow.backup_current_content()
            
        elif args.mode == "restore":
            if not args.backup_path:
                print("❌ 恢复模式需要指定备份路径: --backup-path")
                return
            workflow.restore_from_backup(args.backup_path)
            
    except Exception as e:
        print(f"❌ 更新过程中出现错误: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 
 
 
 