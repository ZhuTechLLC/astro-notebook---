#!/usr/bin/env python3
"""
HTML零空行批量修复脚本
修复所有Markdown文件中HTML标签间的空行问题
"""

import os
import re
import glob
from pathlib import Path

def fix_html_spacing(file_path):
    """修复单个文件的HTML空行问题"""
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 修复模式1：</div> 和下一个HTML标签间的空行
        pattern1 = r'</div>\s*\n\s*\n\s*<'
        replacement1 = '</div>\n<'
        content = re.sub(pattern1, replacement1, content)
        
        # 修复模式2：</div> 和下一个div标签间的空行
        pattern2 = r'</div>\s*\n\s*\n\s*<div'
        replacement2 = '</div>\n<div'
        content = re.sub(pattern2, replacement2, content)
        
        # 修复模式3：标题和div标签间的空行
        pattern3 = r'(<h[1-6][^>]*>.*?</h[1-6]>)\s*\n\s*\n\s*<div'
        replacement3 = r'\1\n<div'
        content = re.sub(pattern3, replacement3, content)
        
        # 修复模式4：section标签间的空行
        pattern4 = r'</section>\s*\n\s*\n\s*<'
        replacement4 = '</section>\n<'
        content = re.sub(pattern4, replacement4, content)
        
        # 如果内容有变化，写回文件
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
        
    except Exception as e:
        print(f"❌ 修复文件 {file_path} 时出错: {e}")
        return False

def find_markdown_files():
    """查找所有Markdown文件"""
    
    patterns = [
        "src/pages/**/*.md",
        "docs/**/*.md",
        "*.md"
    ]
    
    files = []
    for pattern in patterns:
        files.extend(glob.glob(pattern, recursive=True))
    
    return list(set(files))  # 去重

def main():
    """主函数"""
    
    print("🔧 HTML零空行批量修复工具")
    print("=" * 50)
    
    # 查找所有Markdown文件
    files = find_markdown_files()
    print(f"📁 找到 {len(files)} 个Markdown文件")
    
    # 统计修复结果
    fixed_count = 0
    total_count = len(files)
    
    # 逐个修复文件
    for file_path in files:
        print(f"🔍 检查: {file_path}")
        
        if fix_html_spacing(file_path):
            print(f"✅ 修复: {file_path}")
            fixed_count += 1
        else:
            print(f"⏭️  跳过: {file_path} (无需修复)")
    
    # 输出统计结果
    print("\n" + "=" * 50)
    print(f"📊 修复统计:")
    print(f"   总文件数: {total_count}")
    print(f"   修复文件数: {fixed_count}")
    print(f"   跳过文件数: {total_count - fixed_count}")
    print(f"   修复率: {fixed_count/total_count*100:.1f}%")
    
    if fixed_count > 0:
        print("\n🎉 HTML零空行问题修复完成！")
        print("💡 建议运行项目检查验证修复效果")
    else:
        print("\n✅ 所有文件都符合HTML零空行规范！")

if __name__ == "__main__":
    main() 