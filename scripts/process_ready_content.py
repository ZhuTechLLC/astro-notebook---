#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import json
from pathlib import Path

class ReadyContentProcessor:
    def __init__(self, content_dir="../src/pages/001_Chapter1"):
        self.content_dir = content_dir
        self.config = self.load_config()
        
    def load_config(self):
        """加载配置"""
        config_path = "scripts/config.json"
        if os.path.exists(config_path):
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    
    def get_emoji_for_title(self, title):
        """根据标题内容返回相应的emoji"""
        emoji_map = self.config.get('emoji_mapping', {
            '认知': '🧠',
            '智慧': '🧠',
            '世界': '🌍',
            '规律': '📊',
            '行动': '⚡',
            '执行': '🎯',
            '心理': '😌',
            '风险': '⚠️',
            '管理': '📋',
            '历史': '📚',
            '多倍': '🚀',
            '股票': '📈',
            '筛选': '🔍',
            '策略': '🎯',
            '交易': '💹',
            '工具': '🛠️',
            '资源': '📚',
            '案例': '📖',
            '复盘': '🔍',
            '系统': '⚙️',
            '实战': '🎯',
            '指南': '📋',
            '附录': '📚',
            '总结': '💎'
        })
        
        for keyword, emoji in emoji_map.items():
            if keyword in title:
                return emoji
        
        return '📝'  # 默认emoji
    
    def generate_summary(self, content):
        """生成章节摘要"""
        # 提取前几段作为摘要
        paragraphs = content.split('\n\n')
        summary_paragraphs = []
        
        for para in paragraphs[:3]:  # 取前3段
            if para.strip() and not para.startswith('#'):
                summary_paragraphs.append(para.strip())
        
        if summary_paragraphs:
            return summary_paragraphs[0][:200] + '...'
        
        return "本章节详细介绍了相关内容，帮助投资者建立系统的投资认知和操作能力。"
    
    def add_enhanced_navigation(self, content, filename):
        """添加增强的导航元素"""
        # 根据文件名确定章节信息
        if "1.1" in filename:
            section_name = "自我觉知与投资智慧"
            next_section = "1.2_Understanding_the_World_CN"
            prev_section = "000_Preface_CN"
        elif "1.2" in filename:
            section_name = "看懂世界"
            next_section = "1.3_From_Cognition_to_Action_CN"
            prev_section = "1.1_Self_Awareness_and_Investment_Wisdom_CN"
        elif "1.3" in filename:
            section_name = "从认知到行动"
            next_section = "002_Chapter2_Investment_Psychology_and_Risk_Management_CN"
            prev_section = "1.2_Understanding_the_World_CN"
        else:
            section_name = "章节"
            next_section = ""
            prev_section = ""
        
        # 顶部导航
        top_nav = f'''<div class="top-nav">
  <a href="/">← 返回目录</a>
  <a href="/{prev_section}">← 上一节</a>
  <a href="/001_Chapter1_Know_Yourself_and_the_World_CN">← 返回第一章</a>
</div>

'''
        
        # 底部导航
        bottom_nav = f'''

---

<div class="bottom-nav">
  <a href="/{prev_section}">← 上一节</a>
  <a href="/001_Chapter1_Know_Yourself_and_the_World_CN">← 返回第一章</a>'''
        
        if next_section:
            bottom_nav += f'  <a href="/001_Chapter1/{next_section}">下一节 →</a>'
        
        bottom_nav += '</div>'
        
        return top_nav + content + bottom_nav
    
    def add_enhanced_styles(self, content):
        """添加增强的CSS样式"""
        styles = '''
<style>
  /* 章节标题样式 */
  h1 {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    margin: 2rem 0;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }

  /* 子标题样式 */
  h2 {
    color: #2c3e50;
    border-left: 4px solid #3498db;
    padding-left: 1rem;
    margin: 2rem 0 1rem 0;
  }

  h3 {
    color: #34495e;
    border-bottom: 2px solid #ecf0f1;
    padding-bottom: 0.5rem;
    margin: 1.5rem 0 1rem 0;
  }

  /* 内容框样式 */
  .example-box {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    border: 1px solid #2196f3;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
  }

  .example-box h4 {
    color: #1976d2;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .tip-box {
    background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
    border: 1px solid #4caf50;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
  }

  .tip-box h4 {
    color: #388e3c;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .warning-box {
    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    border: 1px solid #ff9800;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    box-shadow: 0 2px 8px rgba(255, 152, 0, 0.1);
  }

  .warning-box h4 {
    color: #f57c00;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .quote-box {
    background: var(--bg-secondary);
    border-left: 4px solid var(--primary-color);
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 0 8px 8px 0;
    font-style: italic;
  }

  /* 导航样式 */
  .top-nav, .bottom-nav {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
    flex-wrap: wrap;
  }

  .top-nav a, .bottom-nav a {
    padding: 0.5rem 1rem;
    background: var(--primary-color);
    color: white;
    text-decoration: none;
    border-radius: 6px;
    transition: background-color 0.2s;
  }

  .top-nav a:hover, .bottom-nav a:hover {
    background: var(--primary-color-dark);
  }

  /* 列表样式 */
  ul, ol {
    padding-left: 1.5rem;
  }

  li {
    margin: 0.5rem 0;
    line-height: 1.6;
  }

  /* 强调文本 */
  strong {
    color: var(--primary-color);
    font-weight: 600;
  }

  /* 代码块 */
  code {
    background: #f8f9fa;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
  }

  pre {
    background: #2d3748;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
  }
</style>'''
        
        return content + styles
    
    def add_interactive_elements(self, content):
        """添加交互元素"""
        # 添加可点击的复选框
        content = re.sub(
            r'^- \[ \] (.+)$',
            r'<label class="checklist-item"><input type="checkbox"> \1</label>',
            content,
            flags=re.MULTILINE
        )
        
        # 添加引用块
        content = re.sub(
            r'^> (.+)$',
            r'<div class="quote-box">\n  <p>\1</p>\n</div>',
            content,
            flags=re.MULTILINE
        )
        
        return content
    
    def add_visual_elements(self, content):
        """添加视觉元素"""
        # 添加案例展示框
        content = re.sub(
            r'案例：(.+)',
            r'<div class="example-box">\n  <h4>💡 实战案例：\1</h4>\n  <p>\1</p>\n</div>',
            content
        )
        
        # 添加提示框
        content = re.sub(
            r'提示：(.+)',
            r'<div class="tip-box">\n  <h4>💡 提示</h4>\n  <p>\1</p>\n</div>',
            content
        )
        
        # 添加警告框
        content = re.sub(
            r'警告：(.+)',
            r'<div class="warning-box">\n  <h4>⚠️ 警告</h4>\n  <p>\1</p>\n</div>',
            content
        )
        
        return content
    
    def process_file(self, file_path):
        """处理单个文件"""
        print(f"处理文件: {file_path}")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查是否已经有frontmatter
        if not content.startswith('---'):
            # 添加frontmatter
            filename = os.path.basename(file_path)
            title = filename.replace('.md', '').replace('_', ' ')
            
            frontmatter = f"""---
title: "{title}"
lang: zh
layout: ../../layouts/Layout.astro
---

"""
            content = frontmatter + content
        
        # 添加emoji到标题
        lines = content.split('\n')
        processed_lines = []
        
        for line in lines:
            if line.startswith('# ') and '🧠' not in line and '��' not in line and '⚡' not in line:
                title = line[2:].strip()
                emoji = self.get_emoji_for_title(title)
                processed_lines.append(f'# {emoji} {title}')
            elif line.startswith('## ') and not any(emoji in line for emoji in ['🧠', '🌍', '⚡', '📊', '🎯']):
                title = line[3:].strip()
                emoji = self.get_emoji_for_title(title)
                processed_lines.append(f'## {emoji} {title}')
            else:
                processed_lines.append(line)
        
        content = '\n'.join(processed_lines)
        
        # 添加交互元素
        content = self.add_interactive_elements(content)
        
        # 添加视觉元素
        content = self.add_visual_elements(content)
        
        # 添加导航
        content = self.add_enhanced_navigation(content, os.path.basename(file_path))
        
        # 添加样式
        content = self.add_enhanced_styles(content)
        
        # 保存处理后的文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ 已处理: {file_path}")
    
    def process_all_files(self):
        """处理所有文件"""
        print("开始处理已准备好的内容...")
        
        if not os.path.exists(self.content_dir):
            print(f"目录不存在: {self.content_dir}")
            return
        
        # 只处理中文文件
        for filename in os.listdir(self.content_dir):
            if filename.endswith('_CN.md'):
                file_path = os.path.join(self.content_dir, filename)
                self.process_file(file_path)
        
        print("所有文件处理完成！")

if __name__ == "__main__":
    processor = ReadyContentProcessor()
    processor.process_all_files() 
# -*- coding: utf-8 -*-

import os
import re
import json
from pathlib import Path

class ReadyContentProcessor:
    def __init__(self, content_dir="../src/pages/001_Chapter1"):
        self.content_dir = content_dir
        self.config = self.load_config()
        
    def load_config(self):
        """加载配置"""
        config_path = "scripts/config.json"
        if os.path.exists(config_path):
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    
    def get_emoji_for_title(self, title):
        """根据标题内容返回相应的emoji"""
        emoji_map = self.config.get('emoji_mapping', {
            '认知': '🧠',
            '智慧': '🧠',
            '世界': '🌍',
            '规律': '📊',
            '行动': '⚡',
            '执行': '🎯',
            '心理': '😌',
            '风险': '⚠️',
            '管理': '📋',
            '历史': '📚',
            '多倍': '🚀',
            '股票': '📈',
            '筛选': '🔍',
            '策略': '🎯',
            '交易': '💹',
            '工具': '🛠️',
            '资源': '📚',
            '案例': '📖',
            '复盘': '🔍',
            '系统': '⚙️',
            '实战': '🎯',
            '指南': '📋',
            '附录': '📚',
            '总结': '💎'
        })
        
        for keyword, emoji in emoji_map.items():
            if keyword in title:
                return emoji
        
        return '📝'  # 默认emoji
    
    def generate_summary(self, content):
        """生成章节摘要"""
        # 提取前几段作为摘要
        paragraphs = content.split('\n\n')
        summary_paragraphs = []
        
        for para in paragraphs[:3]:  # 取前3段
            if para.strip() and not para.startswith('#'):
                summary_paragraphs.append(para.strip())
        
        if summary_paragraphs:
            return summary_paragraphs[0][:200] + '...'
        
        return "本章节详细介绍了相关内容，帮助投资者建立系统的投资认知和操作能力。"
    
    def add_enhanced_navigation(self, content, filename):
        """添加增强的导航元素"""
        # 根据文件名确定章节信息
        if "1.1" in filename:
            section_name = "自我觉知与投资智慧"
            next_section = "1.2_Understanding_the_World_CN"
            prev_section = "000_Preface_CN"
        elif "1.2" in filename:
            section_name = "看懂世界"
            next_section = "1.3_From_Cognition_to_Action_CN"
            prev_section = "1.1_Self_Awareness_and_Investment_Wisdom_CN"
        elif "1.3" in filename:
            section_name = "从认知到行动"
            next_section = "002_Chapter2_Investment_Psychology_and_Risk_Management_CN"
            prev_section = "1.2_Understanding_the_World_CN"
        else:
            section_name = "章节"
            next_section = ""
            prev_section = ""
        
        # 顶部导航
        top_nav = f'''<div class="top-nav">
  <a href="/">← 返回目录</a>
  <a href="/{prev_section}">← 上一节</a>
  <a href="/001_Chapter1_Know_Yourself_and_the_World_CN">← 返回第一章</a>
</div>

'''
        
        # 底部导航
        bottom_nav = f'''

---

<div class="bottom-nav">
  <a href="/{prev_section}">← 上一节</a>
  <a href="/001_Chapter1_Know_Yourself_and_the_World_CN">← 返回第一章</a>'''
        
        if next_section:
            bottom_nav += f'  <a href="/001_Chapter1/{next_section}">下一节 →</a>'
        
        bottom_nav += '</div>'
        
        return top_nav + content + bottom_nav
    
    def add_enhanced_styles(self, content):
        """添加增强的CSS样式"""
        styles = '''
<style>
  /* 章节标题样式 */
  h1 {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    margin: 2rem 0;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }

  /* 子标题样式 */
  h2 {
    color: #2c3e50;
    border-left: 4px solid #3498db;
    padding-left: 1rem;
    margin: 2rem 0 1rem 0;
  }

  h3 {
    color: #34495e;
    border-bottom: 2px solid #ecf0f1;
    padding-bottom: 0.5rem;
    margin: 1.5rem 0 1rem 0;
  }

  /* 内容框样式 */
  .example-box {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    border: 1px solid #2196f3;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
  }

  .example-box h4 {
    color: #1976d2;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .tip-box {
    background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
    border: 1px solid #4caf50;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
  }

  .tip-box h4 {
    color: #388e3c;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .warning-box {
    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    border: 1px solid #ff9800;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    box-shadow: 0 2px 8px rgba(255, 152, 0, 0.1);
  }

  .warning-box h4 {
    color: #f57c00;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .quote-box {
    background: var(--bg-secondary);
    border-left: 4px solid var(--primary-color);
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 0 8px 8px 0;
    font-style: italic;
  }

  /* 导航样式 */
  .top-nav, .bottom-nav {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
    flex-wrap: wrap;
  }

  .top-nav a, .bottom-nav a {
    padding: 0.5rem 1rem;
    background: var(--primary-color);
    color: white;
    text-decoration: none;
    border-radius: 6px;
    transition: background-color 0.2s;
  }

  .top-nav a:hover, .bottom-nav a:hover {
    background: var(--primary-color-dark);
  }

  /* 列表样式 */
  ul, ol {
    padding-left: 1.5rem;
  }

  li {
    margin: 0.5rem 0;
    line-height: 1.6;
  }

  /* 强调文本 */
  strong {
    color: var(--primary-color);
    font-weight: 600;
  }

  /* 代码块 */
  code {
    background: #f8f9fa;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
  }

  pre {
    background: #2d3748;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
  }
</style>'''
        
        return content + styles
    
    def add_interactive_elements(self, content):
        """添加交互元素"""
        # 添加可点击的复选框
        content = re.sub(
            r'^- \[ \] (.+)$',
            r'<label class="checklist-item"><input type="checkbox"> \1</label>',
            content,
            flags=re.MULTILINE
        )
        
        # 添加引用块
        content = re.sub(
            r'^> (.+)$',
            r'<div class="quote-box">\n  <p>\1</p>\n</div>',
            content,
            flags=re.MULTILINE
        )
        
        return content
    
    def add_visual_elements(self, content):
        """添加视觉元素"""
        # 添加案例展示框
        content = re.sub(
            r'案例：(.+)',
            r'<div class="example-box">\n  <h4>💡 实战案例：\1</h4>\n  <p>\1</p>\n</div>',
            content
        )
        
        # 添加提示框
        content = re.sub(
            r'提示：(.+)',
            r'<div class="tip-box">\n  <h4>💡 提示</h4>\n  <p>\1</p>\n</div>',
            content
        )
        
        # 添加警告框
        content = re.sub(
            r'警告：(.+)',
            r'<div class="warning-box">\n  <h4>⚠️ 警告</h4>\n  <p>\1</p>\n</div>',
            content
        )
        
        return content
    
    def process_file(self, file_path):
        """处理单个文件"""
        print(f"处理文件: {file_path}")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查是否已经有frontmatter
        if not content.startswith('---'):
            # 添加frontmatter
            filename = os.path.basename(file_path)
            title = filename.replace('.md', '').replace('_', ' ')
            
            frontmatter = f"""---
title: "{title}"
lang: zh
layout: ../../layouts/Layout.astro
---

"""
            content = frontmatter + content
        
        # 添加emoji到标题
        lines = content.split('\n')
        processed_lines = []
        
        for line in lines:
            if line.startswith('# ') and '🧠' not in line and '��' not in line and '⚡' not in line:
                title = line[2:].strip()
                emoji = self.get_emoji_for_title(title)
                processed_lines.append(f'# {emoji} {title}')
            elif line.startswith('## ') and not any(emoji in line for emoji in ['🧠', '🌍', '⚡', '📊', '🎯']):
                title = line[3:].strip()
                emoji = self.get_emoji_for_title(title)
                processed_lines.append(f'## {emoji} {title}')
            else:
                processed_lines.append(line)
        
        content = '\n'.join(processed_lines)
        
        # 添加交互元素
        content = self.add_interactive_elements(content)
        
        # 添加视觉元素
        content = self.add_visual_elements(content)
        
        # 添加导航
        content = self.add_enhanced_navigation(content, os.path.basename(file_path))
        
        # 添加样式
        content = self.add_enhanced_styles(content)
        
        # 保存处理后的文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ 已处理: {file_path}")
    
    def process_all_files(self):
        """处理所有文件"""
        print("开始处理已准备好的内容...")
        
        if not os.path.exists(self.content_dir):
            print(f"目录不存在: {self.content_dir}")
            return
        
        # 只处理中文文件
        for filename in os.listdir(self.content_dir):
            if filename.endswith('_CN.md'):
                file_path = os.path.join(self.content_dir, filename)
                self.process_file(file_path)
        
        print("所有文件处理完成！")

if __name__ == "__main__":
    processor = ReadyContentProcessor()
    processor.process_all_files() 