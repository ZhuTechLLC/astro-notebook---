#!/usr/bin/env python3
"""
删除所有Markdown文件中的旧导航条
"""

import os
import re
import glob

def remove_nav_from_file(file_path):
    """从单个文件中删除导航条"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 删除顶部导航条
        content = re.sub(
            r'<div class="top-nav">.*?</div>\s*',
            '',
            content,
            flags=re.DOTALL
        )
        
        # 删除底部导航条
        content = re.sub(
            r'<div class="bottom-nav">.*?</div>\s*',
            '',
            content,
            flags=re.DOTALL
        )
        
        # 删除nav-links导航条
        content = re.sub(
            r'<div class="nav-links">.*?</div>\s*',
            '',
            content,
            flags=re.DOTALL
        )
        
        # 如果内容有变化，写回文件
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ 已更新: {file_path}")
            return True
        else:
            print(f"⏭️  无需更新: {file_path}")
            return False
            
    except Exception as e:
        print(f"❌ 错误处理文件 {file_path}: {e}")
        return False

def main():
    """主函数"""
    # 获取所有Markdown文件
    md_files = []
    
    # 搜索src/pages目录下的所有.md文件
    for pattern in ['src/pages/**/*.md', 'src/templates/**/*.md']:
        md_files.extend(glob.glob(pattern, recursive=True))
    
    print(f"找到 {len(md_files)} 个Markdown文件")
    
    updated_count = 0
    
    for file_path in md_files:
        if remove_nav_from_file(file_path):
            updated_count += 1
    
    print(f"\n🎉 完成！共更新了 {updated_count} 个文件")

if __name__ == "__main__":
    main() 