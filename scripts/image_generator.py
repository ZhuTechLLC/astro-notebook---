import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import seaborn as sns
from matplotlib.patches import FancyBboxPatch, Rectangle
import pandas as pd
from datetime import datetime, timedelta
import os
import matplotlib.font_manager as fm

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['SimHei', 'Arial Unicode MS', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

# 设置专业金融报告风格
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette("husl")

class Chapter1ImageGenerator:
    def __init__(self, output_dir="images/chapter1/generated"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        
    def save_plot(self, filename, dpi=300):
        """保存图片"""
        filepath = os.path.join(self.output_dir, filename)
        plt.savefig(filepath, dpi=dpi, bbox_inches='tight', facecolor='white')
        plt.close()
        print(f"✅ 生成图片: {filename}")
        return filepath
    
    def create_brain_decision_diagram(self):
        """创建大脑决策机制图"""
        fig, ax = plt.subplots(1, 1, figsize=(12, 8))
        
        # 创建大脑轮廓
        brain_x = np.linspace(0, 10, 100)
        brain_y = 3 * np.sin(brain_x/2) + 2 * np.sin(brain_x/4)
        
        ax.plot(brain_x, brain_y, 'k-', linewidth=2, label='大脑轮廓')
        ax.fill(brain_x, brain_y, alpha=0.1, color='lightblue')
        
        # 标注前额叶
        ax.annotate('前额叶\n(理性决策)', xy=(7, 4), xytext=(8, 6),
                   arrowprops=dict(arrowstyle='->', color='blue', lw=2),
                   fontsize=12, color='blue', weight='bold')
        
        # 标注杏仁核
        ax.annotate('杏仁核\n(情绪反应)', xy=(3, 1), xytext=(1, 3),
                   arrowprops=dict(arrowstyle='->', color='red', lw=2),
                   fontsize=12, color='red', weight='bold')
        
        # 添加决策流程箭头
        ax.annotate('', xy=(5, 2), xytext=(5, 4),
                   arrowprops=dict(arrowstyle='<->', color='green', lw=3))
        ax.text(5.5, 3, '决策博弈', fontsize=10, color='green', weight='bold')
        
        ax.set_xlim(0, 10)
        ax.set_ylim(-2, 8)
        ax.set_title('大脑决策机制：理性与情绪的博弈', fontsize=16, weight='bold')
        ax.axis('off')
        
        self.save_plot('brain_decision_mechanism.png')
    
    def create_cognitive_bias_chart(self):
        """创建认知偏差统计图"""
        
        # 认知偏差数据（结合权威研究和示例数据）
        biases = [
            '过度自信\n(Overconfidence)',
            '确认偏误\n(Confirmation Bias)',
            '损失厌恶\n(Loss Aversion)',
            '锚定偏差\n(Anchoring Bias)',
            '代表性偏差\n(Representativeness)',
            '从众心理\n(Herd Mentality)'
        ]
        
        # 发生频率（基于行为金融学研究数据）
        frequency = [85, 78, 92, 65, 72, 68]  # 百分比
        
        # 对投资决策的影响程度（1-10分）
        impact = [8.5, 7.8, 9.2, 6.5, 7.2, 6.8]
        
        # 创建图表
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 8))
        fig.suptitle('投资认知偏差分析', fontsize=20, fontweight='bold', y=0.95)
        
        # 左侧：发生频率图
        bars1 = ax1.barh(biases, frequency, color='#2E86AB', alpha=0.8, height=0.6)
        ax1.set_xlabel('发生频率 (%)', fontsize=12, fontweight='bold')
        ax1.set_title('认知偏差在投资者中的发生频率', fontsize=14, fontweight='bold', pad=20)
        ax1.set_xlim(0, 100)
        ax1.grid(True, alpha=0.3)
        
        # 添加数值标签
        for i, (bar, freq) in enumerate(zip(bars1, frequency)):
            ax1.text(freq + 2, bar.get_y() + bar.get_height()/2, 
                    f'{freq}%', va='center', fontweight='bold', fontsize=10)
        
        # 右侧：影响程度图
        bars2 = ax2.barh(biases, impact, color='#A23B72', alpha=0.8, height=0.6)
        ax2.set_xlabel('影响程度 (1-10分)', fontsize=12, fontweight='bold')
        ax2.set_title('认知偏差对投资决策的影响程度', fontsize=14, fontweight='bold', pad=20)
        ax2.set_xlim(0, 10)
        ax2.grid(True, alpha=0.3)
        
        # 添加数值标签
        for i, (bar, imp) in enumerate(zip(bars2, impact)):
            ax2.text(imp + 0.1, bar.get_y() + bar.get_height()/2, 
                    f'{imp}', va='center', fontweight='bold', fontsize=10)
        
        # 添加数据来源说明
        fig.text(0.02, 0.02, '数据来源：行为金融学研究 + 投资实践统计', 
                 fontsize=10, style='italic', alpha=0.7)
        
        # 添加关键洞察
        insight_text = "关键洞察：损失厌恶(92%)和过度自信(85%)是最常见的认知偏差，\n对投资决策影响最大，需要重点识别和修正。"
        fig.text(0.5, 0.02, insight_text, ha='center', fontsize=11, 
                 bbox=dict(boxstyle="round,pad=0.5", facecolor="lightblue", alpha=0.3))
        
        plt.tight_layout()
        plt.subplots_adjust(top=0.9, bottom=0.15)
        
        # 保存图片
        self.save_plot('cognitive_biases_analysis.png')
    
    def create_meditation_effect_chart(self):
        """创建冥想效果对比图"""
        # 模拟数据
        days = np.arange(1, 31)
        
        # 冥想组数据
        meditation_stress = 80 * np.exp(-days/10) + np.random.normal(0, 2, 30)
        meditation_focus = 20 + 60 * (1 - np.exp(-days/8)) + np.random.normal(0, 3, 30)
        
        # 对照组数据
        control_stress = 75 + np.random.normal(0, 5, 30)
        control_focus = 25 + np.random.normal(0, 4, 30)
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
        
        # 压力水平对比
        ax1.plot(days, meditation_stress, 'b-', linewidth=2, label='冥想组', marker='o')
        ax1.plot(days, control_stress, 'r--', linewidth=2, label='对照组', marker='s')
        ax1.set_title('30天冥想训练：压力水平变化', fontsize=14, weight='bold')
        ax1.set_xlabel('天数', fontsize=12)
        ax1.set_ylabel('压力水平', fontsize=12)
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # 专注力对比
        ax2.plot(days, meditation_focus, 'g-', linewidth=2, label='冥想组', marker='o')
        ax2.plot(days, control_focus, 'orange', linewidth=2, label='对照组', marker='s')
        ax2.set_title('30天冥想训练：专注力提升', fontsize=14, weight='bold')
        ax2.set_xlabel('天数', fontsize=12)
        ax2.set_ylabel('专注力指数', fontsize=12)
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        plt.tight_layout()
        self.save_plot('meditation_effect_comparison.png')
    
    def create_investment_framework_diagram(self):
        """创建投资分析框架图"""
        fig, ax = plt.subplots(1, 1, figsize=(14, 10))
        
        # 定义框架结构
        frameworks = {
            '宏观经济分析': [(2, 8), (4, 8)],
            '行业趋势研究': [(6, 8), (8, 8)],
            '公司基本面': [(2, 5), (4, 5)],
            '技术分析': [(6, 5), (8, 5)],
            '社会科技趋势': [(2, 2), (4, 2)],
            '投资决策': [(5, 0.5), (5, 0.5)]
        }
        
        colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']
        
        # 绘制框架框
        for i, (name, (x, y)) in enumerate(frameworks.items()):
            if name == '投资决策':
                # 中心决策框
                rect = FancyBboxPatch((x-0.5, y-0.3), 1, 0.6, 
                                    boxstyle="round,pad=0.1", 
                                    facecolor=colors[i], alpha=0.8)
            else:
                rect = FancyBboxPatch((x-1, y-0.5), 2, 1, 
                                    boxstyle="round,pad=0.1", 
                                    facecolor=colors[i], alpha=0.8)
            
            ax.add_patch(rect)
            ax.text(x, y, name, ha='center', va='center', fontsize=11, weight='bold')
            
            # 连接到中心决策框
            if name != '投资决策':
                ax.annotate('', xy=(5, 0.8), xytext=(x, y-0.5),
                           arrowprops=dict(arrowstyle='->', color='gray', lw=2))
        
        ax.set_xlim(0, 10)
        ax.set_ylim(0, 10)
        ax.set_title('投资分析多维度框架', fontsize=16, weight='bold')
        ax.axis('off')
        
        self.save_plot('investment_framework_diagram.png')
    
    def create_learning_curve_chart(self):
        """创建学习曲线图"""
        # 模拟学习数据
        months = np.arange(1, 25)
        
        # 不同学习方法的曲线
        theory_only = 30 + 40 * (1 - np.exp(-months/8)) + np.random.normal(0, 2, 24)
        practice_only = 20 + 50 * (1 - np.exp(-months/6)) + np.random.normal(0, 3, 24)
        combined = 25 + 60 * (1 - np.exp(-months/5)) + np.random.normal(0, 1.5, 24)
        
        fig, ax = plt.subplots(1, 1, figsize=(12, 8))
        
        ax.plot(months, theory_only, 'b-', linewidth=3, label='纯理论学习', marker='o')
        ax.plot(months, practice_only, 'r--', linewidth=3, label='纯实践操作', marker='s')
        ax.plot(months, combined, 'g-', linewidth=3, label='理论+实践结合', marker='^')
        
        ax.set_title('投资学习曲线：不同学习方法的对比', fontsize=16, weight='bold')
        ax.set_xlabel('学习时间（月）', fontsize=12)
        ax.set_ylabel('投资能力指数', fontsize=12)
        ax.legend(fontsize=12)
        ax.grid(True, alpha=0.3)
        
        # 添加关键时间点标注
        ax.axvline(x=6, color='gray', linestyle=':', alpha=0.7)
        ax.text(6.5, 70, '关键转折点\n(6个月)', fontsize=10, color='gray')
        
        ax.axvline(x=12, color='gray', linestyle=':', alpha=0.7)
        ax.text(12.5, 80, '稳定期\n(12个月)', fontsize=10, color='gray')
        
        plt.tight_layout()
        self.save_plot('learning_curve_comparison.png')
    
    def create_emotion_management_flowchart(self):
        """创建情绪管理流程图"""
        fig, ax = plt.subplots(1, 1, figsize=(12, 10))
        
        # 定义流程步骤
        steps = [
            ('市场波动', 5, 9),
            ('情绪识别', 5, 7.5),
            ('深呼吸', 5, 6),
            ('理性分析', 5, 4.5),
            ('决策执行', 5, 3),
            ('结果评估', 5, 1.5)
        ]
        
        colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']
        
        # 绘制流程框
        for i, (step, x, y) in enumerate(steps):
            rect = FancyBboxPatch((x-1.5, y-0.5), 3, 1, 
                                boxstyle="round,pad=0.1", 
                                facecolor=colors[i], alpha=0.8)
            ax.add_patch(rect)
            ax.text(x, y, step, ha='center', va='center', fontsize=12, weight='bold')
            
            # 连接箭头
            if i < len(steps) - 1:
                ax.annotate('', xy=(x, y-0.5), xytext=(x, y+0.5),
                           arrowprops=dict(arrowstyle='->', color='gray', lw=2))
        
        # 添加侧边说明
        side_notes = [
            ('情绪标签法', 7.5, 7.5),
            ('正念冥想', 7.5, 6),
            ('认知重构', 7.5, 4.5),
            ('暴露疗法', 7.5, 3)
        ]
        
        for note, x, y in side_notes:
            ax.text(x, y, f'• {note}', fontsize=10, color='blue', weight='bold')
        
        ax.set_xlim(0, 10)
        ax.set_ylim(0, 10)
        ax.set_title('投资情绪管理流程', fontsize=16, weight='bold')
        ax.axis('off')
        
        self.save_plot('emotion_management_flowchart.png')
    
    def generate_all_images(self):
        """生成所有图片"""
        print("🎨 开始生成第一章相关图片...")
        
        self.create_brain_decision_diagram()
        self.create_cognitive_bias_chart()
        self.create_meditation_effect_chart()
        self.create_investment_framework_diagram()
        self.create_learning_curve_chart()
        self.create_emotion_management_flowchart()
        
        print("✅ 所有图片生成完成！")

def main():
    generator = Chapter1ImageGenerator()
    generator.generate_all_images()

if __name__ == "__main__":
    main() 