import requests
import os
from urllib.parse import urlparse

def download_image(url, filename, folder="images"):
    """下载图片"""
    try:
        # 创建文件夹
        os.makedirs(folder, exist_ok=True)
        
        # 设置请求头
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # 下载图片
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # 保存图片
        filepath = os.path.join(folder, filename)
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ 下载成功: {filename}")
        return filepath
        
    except Exception as e:
        print(f"❌ 下载失败 {filename}: {e}")
        return None

def main():
    """下载第一章相关图片"""
    print("🚀 开始下载第一章相关图片...")
    
    # 第一章相关图片链接
    images = {
        # 哲学与自我认知
        "socrates_philosophy.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
        "meditation_mindfulness.jpg": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        "brain_neuroscience.jpg": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
        
        # 投资与决策
        "investment_charts.jpg": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
        "decision_making.jpg": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
        "emotional_control.jpg": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        
        # 全球视野
        "global_economy.jpg": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
        "world_map.jpg": "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600&fit=crop",
        "technology_trends.jpg": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
        
        # 认知心理学
        "cognitive_psychology.jpg": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
        "critical_thinking.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
        "self_awareness.jpg": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        
        # 投资框架
        "investment_framework.jpg": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
        "risk_management.jpg": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
        "portfolio_diversification.jpg": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop"
    }
    
    # 下载所有图片
    downloaded_count = 0
    for filename, url in images.items():
        if download_image(url, filename):
            downloaded_count += 1
    
    print(f"\n✅ 下载完成！成功下载 {downloaded_count}/{len(images)} 张图片")
    print(f"📁 图片保存在: {os.path.abspath('images')}")

if __name__ == "__main__":
    main() 