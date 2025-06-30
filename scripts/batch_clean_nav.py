#!/usr/bin/env python3
"""
批量清理所有子节文件中的旧导航条
"""

import os
import re
import glob

def clean_navigation_from_file(file_path):
    """删除单个文件中的导航条"""
    print(f"处理文件: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 检查文件头部是否有currentBook属性
        frontmatter_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
        if frontmatter_match:
            frontmatter = frontmatter_match.group(1)
            if 'currentBook:' not in frontmatter:
                # 添加currentBook属性
                frontmatter += '\ncurrentBook: theory'
                content = f"---\n{frontmatter}\n---" + content[frontmatter_match.end():]
        
        # 删除顶部导航条 (page-nav)
        content = re.sub(r'<div class="page-nav">.*?</div>\s*\n?', '', content, flags=re.DOTALL)
        
        # 删除底部导航条 (bottom-nav) 及其前面的分隔线
        content = re.sub(r'\n?---\s*\n?<div class="bottom-nav">.*?</div>\s*', '', content, flags=re.DOTALL)
        content = re.sub(r'<div class="bottom-nav">.*?</div>\s*', '', content, flags=re.DOTALL)
        
        # 删除多余的样式块
        content = re.sub(r'<style>.*?</style>\s*', '', content, flags=re.DOTALL)
        
        # 删除多余的空行
        content = re.sub(r'\n{3,}', '\n\n', content)
        
        # 确保文件以单个换行符结尾
        content = content.rstrip() + '\n'
        
        # 只有内容发生变化时才写入文件
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ 已更新: {file_path}")
            return True
        else:
            print(f"⚪ 无需更新: {file_path}")
            return False
            
    except Exception as e:
        print(f"❌ 处理失败 {file_path}: {e}")
        return False

def main():
    """主函数"""
    # 要处理的文件模式
    patterns = [
        'src/pages/*/[0-9].*_CN.md',  # 所有子节文件
        'src/pages/*/*/[0-9].*_CN.md'  # 嵌套的子节文件
    ]
    
    updated_files = []
    
    for pattern in patterns:
        files = glob.glob(pattern, recursive=True)
        for file_path in files:
            # 跳过已经处理过的文件
            if any(skip in file_path for skip in ['1.1_Self_Awareness', '1.2_Understanding', '1.3_From_Cognition', '2.1_Personalized', '2.2_Stop_Loss']):
                print(f"⏭️  跳过已处理: {file_path}")
                continue
                
            if clean_navigation_from_file(file_path):
                updated_files.append(file_path)
    
    print(f"\n📊 处理完成:")
    print(f"   更新文件数: {len(updated_files)}")
    
    if updated_files:
        print("\n📝 更新的文件列表:")
        for file_path in updated_files:
            print(f"   - {file_path}")

if __name__ == "__main__":
    main() 