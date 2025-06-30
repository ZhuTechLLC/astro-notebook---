#!/usr/bin/env python3
"""
检查.gitignore文件是否正常工作
验证所有应该被忽略的文件都被正确忽略
"""

import os
import subprocess
import sys
from pathlib import Path

def run_git_command(cmd):
    """运行Git命令并返回结果"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=Path.cwd())
        return result.stdout.strip()
    except Exception as e:
        print(f"运行Git命令时出错: {e}")
        return ""

def check_gitignore_status():
    """检查.gitignore状态"""
    print("🔍 检查.gitignore文件状态...")
    print("=" * 50)
    
    # 检查未跟踪的文件
    untracked = run_git_command("git status --porcelain")
    if untracked:
        print("❌ 发现未跟踪的文件:")
        for line in untracked.split('\n'):
            if line.startswith('??'):
                print(f"  - {line[3:]}")
    else:
        print("✅ 没有未跟踪的文件")
    
    print()
    
    # 检查被忽略的文件
    ignored = run_git_command("git status --ignored --porcelain")
    if ignored:
        ignored_files = [line[3:] for line in ignored.split('\n') if line.startswith('!!')]
        if ignored_files:
            print("✅ 被正确忽略的文件:")
            for file in ignored_files[:10]:  # 只显示前10个
                print(f"  - {file}")
            if len(ignored_files) > 10:
                print(f"  ... 还有 {len(ignored_files) - 10} 个文件被忽略")
        else:
            print("ℹ️  没有文件被忽略")
    else:
        print("ℹ️  没有文件被忽略")
    
    print()
    
    # 检查常见的临时文件是否存在
    common_temp_files = [
        '.DS_Store',
        'Thumbs.db',
        '.vscode/settings.json',
        'node_modules',
        '.astro',
        'dist',
        '*.tmp',
        '*.log'
    ]
    
    print("🔍 检查常见临时文件:")
    for pattern in common_temp_files:
        if '*' in pattern:
            # 处理通配符模式
            files = list(Path('.').glob(pattern))
            if files:
                print(f"  - {pattern}: 找到 {len(files)} 个文件")
            else:
                print(f"  - {pattern}: 未找到")
        else:
            # 处理具体文件/目录
            path = Path(pattern)
            if path.exists():
                status = "存在" if path.is_file() else "目录存在"
                print(f"  - {pattern}: {status}")
            else:
                print(f"  - {pattern}: 不存在")

def check_specific_directories():
    """检查特定目录的状态"""
    print("\n📁 检查特定目录:")
    print("=" * 30)
    
    directories = [
        '.vscode',
        '.astro',
        'node_modules',
        'dist',
        'backup',
        'public/images',
        'public/videos',
        'public/audio'
    ]
    
    for dir_path in directories:
        path = Path(dir_path)
        if path.exists():
            if path.is_dir():
                # 计算目录中的文件数量
                try:
                    file_count = len(list(path.rglob('*')))
                    print(f"  - {dir_path}: 目录存在 ({file_count} 个项目)")
                except PermissionError:
                    print(f"  - {dir_path}: 目录存在 (无法访问)")
            else:
                print(f"  - {dir_path}: 文件存在")
        else:
            print(f"  - {dir_path}: 不存在")

def main():
    """主函数"""
    print("🚀 Git忽略文件检查工具")
    print("=" * 50)
    
    # 检查是否在Git仓库中
    if not Path('.git').exists():
        print("❌ 错误: 当前目录不是Git仓库")
        sys.exit(1)
    
    # 检查.gitignore文件是否存在
    if not Path('.gitignore').exists():
        print("❌ 错误: 未找到.gitignore文件")
        sys.exit(1)
    
    print(f"✅ 找到.gitignore文件: {Path('.gitignore').stat().st_size} 字节")
    print()
    
    # 执行检查
    check_gitignore_status()
    check_specific_directories()
    
    print("\n" + "=" * 50)
    print("✅ 检查完成！")
    print("\n💡 提示:")
    print("  - 如果看到'没有未跟踪的文件'，说明.gitignore工作正常")
    print("  - 被忽略的文件不会出现在Git状态中")
    print("  - 如果需要强制添加被忽略的文件，使用: git add -f <文件名>")

if __name__ == "__main__":
    main() 