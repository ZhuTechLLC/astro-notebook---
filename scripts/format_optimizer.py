#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import os
import json
from pathlib import Path

class FormatOptimizer:
    def __init__(self, content_dir="src/content", output_dir="src/pages"):
        self.content_dir = content_dir
        self.output_dir = output_dir
        self.style_templates = self.load_style_templates()
        
    def load_style_templates(self):
        """加载样式模板"""
        return {
            'chapter_header': {
                'pattern': r'^# (.+)$',
                'template': '''# {title}

> **核心摘要：**
> 
> {summary}

## 📖 {title}

{content}'''
            },
            'section_header': {
                'pattern': r'^## (.+)$',
                'template': '''## {emoji} {title}

{content}'''
            },
            'subsection_header': {
                'pattern': r'^### (.+)$',
                'template': '''### {emoji} {title}

{content}'''
            }
        }
    
    def get_emoji_for_title(self, title):
        """根据标题内容返回相应的emoji"""
        emoji_map = {
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
            '规律': '🔄',
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
        }
        
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
    
    def add_interactive_elements(self, content):
        """添加交互元素"""
        # 添加可点击的复选框
        content = re.sub(
            r'^- \[ \] (.+)$',
            r'<label><input type="checkbox"> \1</label>',
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
    
    def add_navigation(self, content, filename):
        """添加导航元素"""
        # 在内容开头添加导航
        nav_section = '''<div class="top-nav">
  <a href="/">← 返回目录</a>
  <a href="/000_Preface_CN">← 上一章</a>
  <a href="/001_Chapter1_Know_Yourself_and_the_World_CN">← 返回第一章</a>
</div>

'''
        
        # 在内容结尾添加导航
        bottom_nav = '''

---

<div class="bottom-nav">
  <a href="/000_Preface_CN">← 上一章：序言</a>
  <a href="/001_Chapter1_Know_Yourself_and_the_World_CN">← 返回第一章</a>
</div>'''
        
        return nav_section + content + bottom_nav
    
    def add_styles(self, content):
        """添加CSS样式"""
        styles = '''
<style>
  .example-box {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    border: 1px solid #2196f3;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1.5rem 0;
  }

  .example-box h4 {
    color: #1976d2;
    margin-bottom: 1rem;
  }

  .tip-box {
    background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
    border: 1px solid #4caf50;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1.5rem 0;
  }

  .tip-box h4 {
    color: #388e3c;
    margin-bottom: 1rem;
  }

  .warning-box {
    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    border: 1px solid #ff9800;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1.5rem 0;
  }

  .warning-box h4 {
    color: #f57c00;
    margin-bottom: 1rem;
  }

  .quote-box {
    background: var(--bg-secondary);
    border-left: 4px solid var(--primary-color);
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 0 8px 8px 0;
  }

  .checklist label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: background-color 0.2s;
  }

  .checklist label:hover {
    background-color: var(--bg-secondary);
  }

  .checklist input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--primary-color);
  }
</style>'''
        
        return content + styles
    
    def optimize_content(self, content, filename):
        """优化内容格式"""
        # 生成摘要
        summary = self.generate_summary(content)
        
        # 添加emoji到标题
        lines = content.split('\n')
        optimized_lines = []
        
        for line in lines:
            if line.startswith('## '):
                title = line[3:].strip()
                emoji = self.get_emoji_for_title(title)
                optimized_lines.append(f'## {emoji} {title}')
            elif line.startswith('### '):
                title = line[4:].strip()
                emoji = self.get_emoji_for_title(title)
                optimized_lines.append(f'### {emoji} {title}')
            else:
                optimized_lines.append(line)
        
        content = '\n'.join(optimized_lines)
        
        # 添加交互元素
        content = self.add_interactive_elements(content)
        
        # 添加视觉元素
        content = self.add_visual_elements(content)
        
        # 添加导航
        content = self.add_navigation(content, filename)
        
        # 添加样式
        content = self.add_styles(content)
        
        return content
    
    def process_file(self, input_file, output_file):
        """处理单个文件"""
        print(f"优化文件: {input_file}")
        
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 优化内容
        optimized_content = self.optimize_content(content, os.path.basename(input_file))
        
        # 保存优化后的内容
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(optimized_content)
        
        print(f"已优化: {output_file}")
    
    def optimize_all(self):
        """优化所有文件"""
        print("开始格式优化...")
        
        if not os.path.exists(self.content_dir):
            print(f"内容目录不存在: {self.content_dir}")
            return
        
        for filename in os.listdir(self.content_dir):
            if filename.endswith('.md'):
                input_path = os.path.join(self.content_dir, filename)
                output_path = os.path.join(self.output_dir, filename)
                
                self.process_file(input_path, output_path)
        
        print("格式优化完成！")

if __name__ == "__main__":
    optimizer = FormatOptimizer()
    optimizer.optimize_all() 
# -*- coding: utf-8 -*-

import re
import os
import json
from pathlib import Path

class FormatOptimizer:
    def __init__(self, content_dir="src/content", output_dir="src/pages"):
        self.content_dir = content_dir
        self.output_dir = output_dir
        self.style_templates = self.load_style_templates()
        
    def load_style_templates(self):
        """加载样式模板"""
        return {
            'chapter_header': {
                'pattern': r'^# (.+)$',
                'template': '''# {title}

> **核心摘要：**
> 
> {summary}

## 📖 {title}

{content}'''
            },
            'section_header': {
                'pattern': r'^## (.+)$',
                'template': '''## {emoji} {title}

{content}'''
            },
            'subsection_header': {
                'pattern': r'^### (.+)$',
                'template': '''### {emoji} {title}

{content}'''
            }
        }
    
    def get_emoji_for_title(self, title):
        """根据标题内容返回相应的emoji"""
        emoji_map = {
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
            '规律': '🔄',
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
        }
        
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
    
    def add_interactive_elements(self, content):
        """添加交互元素"""
        # 添加可点击的复选框
        content = re.sub(
            r'^- \[ \] (.+)$',
            r'<label><input type="checkbox"> \1</label>',
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
    
    def add_navigation(self, content, filename):
        """添加导航元素"""
        # 在内容开头添加导航
        nav_section = '''<div class="top-nav">
  <a href="/">← 返回目录</a>
  <a href="/000_Preface_CN">← 上一章</a>
  <a href="/001_Chapter1_Know_Yourself_and_the_World_CN">← 返回第一章</a>
</div>

'''
        
        # 在内容结尾添加导航
        bottom_nav = '''

---

<div class="bottom-nav">
  <a href="/000_Preface_CN">← 上一章：序言</a>
  <a href="/001_Chapter1_Know_Yourself_and_the_World_CN">← 返回第一章</a>
</div>'''
        
        return nav_section + content + bottom_nav
    
    def add_styles(self, content):
        """添加CSS样式"""
        styles = '''
<style>
  .example-box {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    border: 1px solid #2196f3;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1.5rem 0;
  }

  .example-box h4 {
    color: #1976d2;
    margin-bottom: 1rem;
  }

  .tip-box {
    background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
    border: 1px solid #4caf50;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1.5rem 0;
  }

  .tip-box h4 {
    color: #388e3c;
    margin-bottom: 1rem;
  }

  .warning-box {
    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    border: 1px solid #ff9800;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1.5rem 0;
  }

  .warning-box h4 {
    color: #f57c00;
    margin-bottom: 1rem;
  }

  .quote-box {
    background: var(--bg-secondary);
    border-left: 4px solid var(--primary-color);
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 0 8px 8px 0;
  }

  .checklist label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: background-color 0.2s;
  }

  .checklist label:hover {
    background-color: var(--bg-secondary);
  }

  .checklist input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--primary-color);
  }
</style>'''
        
        return content + styles
    
    def optimize_content(self, content, filename):
        """优化内容格式"""
        # 生成摘要
        summary = self.generate_summary(content)
        
        # 添加emoji到标题
        lines = content.split('\n')
        optimized_lines = []
        
        for line in lines:
            if line.startswith('## '):
                title = line[3:].strip()
                emoji = self.get_emoji_for_title(title)
                optimized_lines.append(f'## {emoji} {title}')
            elif line.startswith('### '):
                title = line[4:].strip()
                emoji = self.get_emoji_for_title(title)
                optimized_lines.append(f'### {emoji} {title}')
            else:
                optimized_lines.append(line)
        
        content = '\n'.join(optimized_lines)
        
        # 添加交互元素
        content = self.add_interactive_elements(content)
        
        # 添加视觉元素
        content = self.add_visual_elements(content)
        
        # 添加导航
        content = self.add_navigation(content, filename)
        
        # 添加样式
        content = self.add_styles(content)
        
        return content
    
    def process_file(self, input_file, output_file):
        """处理单个文件"""
        print(f"优化文件: {input_file}")
        
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 优化内容
        optimized_content = self.optimize_content(content, os.path.basename(input_file))
        
        # 保存优化后的内容
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(optimized_content)
        
        print(f"已优化: {output_file}")
    
    def optimize_all(self):
        """优化所有文件"""
        print("开始格式优化...")
        
        if not os.path.exists(self.content_dir):
            print(f"内容目录不存在: {self.content_dir}")
            return
        
        for filename in os.listdir(self.content_dir):
            if filename.endswith('.md'):
                input_path = os.path.join(self.content_dir, filename)
                output_path = os.path.join(self.output_dir, filename)
                
                self.process_file(input_path, output_path)
        
        print("格式优化完成！")

if __name__ == "__main__":
    optimizer = FormatOptimizer()
    optimizer.optimize_all() 
 
 
 