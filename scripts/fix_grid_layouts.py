#!/usr/bin/env python3
"""
批量修复网格布局配置，统一使用280px的minmax值
"""

import os
import re
import glob

def fix_grid_layout(file_path):
    """修复单个文件的网格布局"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 修复 chapters-grid
        content = re.sub(
            r'grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(\d+px,\s*1fr\)\);',
            'grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));',
            content
        )
        
        # 修复 overview-grid
        content = re.sub(
            r'\.overview-grid\s*\{[^}]*grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(\d+px,\s*1fr\)\);[^}]*\}',
            lambda m: m.group(0).replace(
                re.search(r'minmax\(\d+px,\s*1fr\)', m.group(0)).group(0),
                'minmax(280px, 1fr)'
            ),
            content,
            flags=re.DOTALL
        )
        
        # 修复其他常见网格布局
        grid_patterns = [
            r'\.metrics-grid',
            r'\.component-grid',
            r'\.framework-grid',
            r'\.analysis-grid',
            r'\.info-grid',
            r'\.strategy-grid'
        ]
        
        for pattern in grid_patterns:
            content = re.sub(
                pattern + r'\s*\{[^}]*grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(\d+px,\s*1fr\)\);[^}]*\}',
                lambda m: m.group(0).replace(
                    re.search(r'minmax\(\d+px,\s*1fr\)', m.group(0)).group(0),
                    'minmax(280px, 1fr)'
                ) if re.search(r'minmax\(\d+px,\s*1fr\)', m.group(0)) else m.group(0),
                content,
                flags=re.DOTALL
            )
        
        # 统一gap值
        content = re.sub(r'gap:\s*[0-9.]+rem;', 'gap: 1.8rem;', content)
        content = re.sub(r'gap:\s*[0-9.]+px;', 'gap: 1.8rem;', content)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ 修复完成: {file_path}")
        return True
        
    except Exception as e:
        print(f"❌ 修复失败: {file_path} - {e}")
        return False

def main():
    """主函数"""
    # 需要修复的文件模式
    file_patterns = [
        'src/pages/**/*.md',
        'src/pages/**/*.astro',
        'src/components/*.astro',
        'src/layouts/*.astro'
    ]
    
    total_files = 0
    fixed_files = 0
    
    for pattern in file_patterns:
        files = glob.glob(pattern, recursive=True)
        for file_path in files:
            total_files += 1
            if fix_grid_layout(file_path):
                fixed_files += 1
    
    print(f"\n📊 修复统计:")
    print(f"总文件数: {total_files}")
    print(f"修复成功: {fixed_files}")
    print(f"修复失败: {total_files - fixed_files}")

if __name__ == "__main__":
    main() 