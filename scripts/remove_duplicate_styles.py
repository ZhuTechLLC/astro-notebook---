#!/usr/bin/env python3
"""
移除章节文件中重复的style标签
这些样式已经在 src/styles/components.css 中统一定义
"""

import os
import re
from pathlib import Path

def remove_style_tags(file_path):
    """移除文件中的style标签及其内容"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查是否有style标签
        if '<style>' not in content.lower():
            return False
        
        # 移除style标签及其内容（包括多行）
        # 使用DOTALL标志让.匹配换行符
        pattern = r'<style>.*?</style>'
        new_content = re.sub(pattern, '', content, flags=re.DOTALL | re.IGNORECASE)
        
        # 清理多余的空行
        new_content = re.sub(r'\n\s*\n\s*\n', '\n\n', new_content)
        
        # 只有内容确实改变了才写入文件
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        
        return False
        
    except Exception as e:
        print(f"处理文件 {file_path} 时出错: {e}")
        return False

def main():
    """主函数：批量处理章节文件"""
    
    # 定义要处理的目录
    directories = [
        'src/pages/001_Chapter1',
        'src/pages/002_Chapter2', 
        'src/pages/003_Chapter3',
        'src/pages/004_Chapter4',
        'src/pages/005_Chapter5',
        'src/pages/006_Chapter6',
        'src/pages/007_Chapter7',
        'src/pages/008_Chapter8',
        'src/pages/009_Chapter9',
        'src/pages/010_Chapter10',
        'src/pages/011_Appendix'
    ]
    
    # 也处理根目录下的章节文件
    root_files = [
        'src/pages/000_Preface_CN.md',
        'src/pages/001_Chapter1_Know_Yourself_and_the_World_CN.md',
        'src/pages/002_Chapter2_Investment_Psychology_and_Risk_Management_CN.md',
        'src/pages/003_Chapter3_Historical_Patterns_and_Multibagger_Stocks_CN.md',
        'src/pages/004_Chapter4_Track_Selection_and_Industry_Trends_CN.md',
        'src/pages/005_Chapter5_Stock_Screening_Strategies_CN.md',
        'src/pages/006_Chapter6_Trading_Strategies_and_Execution_CN.md',
        'src/pages/007_Chapter7_Investment_Decision_Tools_and_Resources_CN.md',
        'src/pages/008_Chapter8_Case_Review_and_Strategy_Improvement_CN.md',
        'src/pages/009_Chapter9_Building_an_Investment_System_CN.md',
        'src/pages/010_Chapter10_Trading_Execution_and_Practical_Guide_CN.md',
        'src/pages/011_Appendix_CN.md',
        'src/pages/012_Strategy_Logic_CN.md'
    ]
    
    processed_files = []
    
    # 处理目录中的文件
    for directory in directories:
        dir_path = Path(directory)
        if dir_path.exists():
            for md_file in dir_path.glob('*.md'):
                if remove_style_tags(md_file):
                    processed_files.append(str(md_file))
                    print(f"✅ 已处理: {md_file}")
    
    # 处理根目录文件
    for file_path in root_files:
        if Path(file_path).exists():
            if remove_style_tags(file_path):
                processed_files.append(file_path)
                print(f"✅ 已处理: {file_path}")
    
    # 输出处理结果
    print(f"\n📊 处理完成:")
    print(f"总共处理了 {len(processed_files)} 个文件")
    
    if processed_files:
        print(f"\n已移除style标签的文件:")
        for file_path in processed_files:
            print(f"  - {file_path}")
        
        print(f"\n💡 这些样式现在由 src/styles/components.css 统一管理")
        print(f"🎯 Token节省估计: {len(processed_files) * 200} tokens")
    else:
        print("没有发现需要处理的文件")

if __name__ == "__main__":
    main() 