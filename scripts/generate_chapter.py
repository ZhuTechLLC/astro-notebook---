#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
章节内容生成器
使用模板和配置自动生成章节内容，避免重复工作
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Any

class ChapterGenerator:
    def __init__(self, template_dir: str = "src/templates", output_dir: str = "src/pages"):
        self.template_dir = Path(template_dir)
        self.output_dir = Path(output_dir)
        self.template_dir.mkdir(exist_ok=True)
        
    def load_template(self, template_name: str) -> str:
        """加载模板文件"""
        template_path = self.template_dir / template_name
        if template_path.exists():
            with open(template_path, 'r', encoding='utf-8') as f:
                return f.read()
        else:
            raise FileNotFoundError(f"模板文件不存在: {template_path}")
    
    def generate_chapter_card(self, number: str, title: str, description: str, 
                            features: List[str], link: str) -> str:
        """生成章节卡片HTML"""
        features_html = '\n'.join([f'<span class="feature-tag">{feature}</span>' for feature in features])
        
        return f'''
  <div class="chapter-card">
    <div class="chapter-header">
      <span class="chapter-number">{number}</span>
      <h3>{title}</h3>
    </div>
    <p>{description}</p>
    <div class="chapter-features">
      {features_html}
    </div>
    <a href="{link}" class="chapter-link">开始学习 →</a>
  </div>'''
    
    def generate_chapter(self, config: Dict[str, Any]) -> str:
        """根据配置生成章节内容"""
        # 加载模板
        template = self.load_template("chapter_template.md")
        
        # 生成章节卡片
        chapter_cards = []
        for subsection in config.get('subsections', []):
            card = self.generate_chapter_card(
                number=subsection['number'],
                title=subsection['title'],
                description=subsection['description'],
                features=subsection['features'],
                link=subsection['link']
            )
            chapter_cards.append(card)
        
        # 替换模板变量
        replacements = {
            '{{TITLE}}': config['title'],
            '{{ENGLISH_PATH}}': config.get('english_path', ''),
            '{{PREV_CHAPTER}}': config.get('prev_chapter', ''),
            '{{NEXT_CHAPTER}}': config.get('next_chapter', ''),
            '{{SUMMARY}}': config['summary'],
            '{{TOPIC}}': config['topic'],
            '{{CHAPTER_CARDS}}': '\n'.join(chapter_cards),
            '{{LEARNING_OBJECTIVES}}': self._format_list(config['learning_objectives']),
            '{{CORE_CONCEPTS}}': config['core_concepts'],
            '{{RELATED_CHAPTERS}}': config['related_chapters'],
            '{{LEARNING_TIPS}}': config['learning_tips'],
            '{{PREV_TITLE}}': config.get('prev_title', ''),
            '{{FIRST_SUBSECTION}}': config.get('first_subsection', ''),
            '{{FIRST_SUBSECTION_TITLE}}': config.get('first_subsection_title', '')
        }
        
        content = template
        for placeholder, value in replacements.items():
            content = content.replace(placeholder, value)
        
        return content
    
    def _format_list(self, items: List[str]) -> str:
        """格式化列表为Markdown"""
        return '\n'.join([f'- **{item}**' for item in items])
    
    def save_chapter(self, filename: str, content: str):
        """保存章节文件"""
        output_path = self.output_dir / filename
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ 章节已生成: {output_path}")
    
    def update_existing_chapter(self, filename: str, config: Dict[str, Any]):
        """更新现有章节的特定部分"""
        file_path = self.output_dir / filename
        if not file_path.exists():
            print(f"❌ 文件不存在: {file_path}")
            return
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 只更新需要修改的部分
        if 'summary' in config:
            content = self._update_section(content, '核心摘要', config['summary'])
        
        if 'learning_objectives' in config:
            objectives_text = self._format_list(config['learning_objectives'])
            content = self._update_section(content, '学习目标', objectives_text)
        
        if 'learning_tips' in config:
            content = self._update_section(content, '学习建议', config['learning_tips'])
        
        # 保存更新后的内容
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ 章节已更新: {file_path}")
    
    def _update_section(self, content: str, section_name: str, new_content: str) -> str:
        """更新特定章节的内容"""
        # 使用正则表达式找到并替换特定章节
        pattern = rf'(## 🎯 {section_name}.*?)(?=## |$)'
        replacement = f'## 🎯 {section_name}\n\n{new_content}\n\n'
        
        if re.search(pattern, content, re.DOTALL):
            return re.sub(pattern, replacement, content, flags=re.DOTALL)
        else:
            print(f"⚠️ 未找到章节: {section_name}")
            return content

# 使用示例
if __name__ == "__main__":
    generator = ChapterGenerator()
    
    # 示例配置
    chapter_config = {
        'title': '示例章节',
        'summary': '这是一个示例章节的摘要',
        'topic': '示例主题',
        'learning_objectives': [
            '目标1：学习基础知识',
            '目标2：掌握核心技能',
            '目标3：应用实践'
        ],
        'core_concepts': '这里是核心概念的内容...',
        'related_chapters': '相关章节链接...',
        'learning_tips': '学习建议内容...',
        'subsections': [
            {
                'number': '1.1',
                'title': '第一个小节',
                'description': '小节描述',
                'features': ['特性1', '特性2'],
                'link': '/section1'
            }
        ]
    }
    
    # 生成新章节
    # content = generator.generate_chapter(chapter_config)
    # generator.save_chapter('example_chapter.md', content)
    
    # 更新现有章节
    # generator.update_existing_chapter('001_Chapter1_Know_Yourself_and_the_World_CN.md', {
    #     'summary': '更新后的摘要',
    #     'learning_tips': '更新后的学习建议'
    # }) 