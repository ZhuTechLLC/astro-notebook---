import requests
import os
from bs4 import BeautifulSoup
import time
from urllib.parse import urljoin, urlparse
import json

class ImageScraper:
    def __init__(self, output_dir="images/chapter1"):
        self.output_dir = output_dir
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # 创建输出目录
        os.makedirs(output_dir, exist_ok=True)
        
    def download_image(self, url, filename):
        """下载图片"""
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            filepath = os.path.join(self.output_dir, filename)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            print(f"✅ 下载成功: {filename}")
            return filepath
        except Exception as e:
            print(f"❌ 下载失败 {filename}: {e}")
            return None
    
    def scrape_unsplash(self, query, count=5):
        """从Unsplash抓取图片"""
        base_url = "https://unsplash.com/s/photos/"
        search_url = base_url + query.replace(" ", "-")
        
        try:
            response = self.session.get(search_url)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 查找图片链接
            img_elements = soup.find_all('img', {'data-test': 'photo-grid-single-col-img'})
            
            downloaded = 0
            for i, img in enumerate(img_elements[:count]):
                if 'src' in img.attrs:
                    img_url = img['src']
                    if img_url.startswith('//'):
                        img_url = 'https:' + img_url
                    
                    filename = f"{query.replace(' ', '_')}_{i+1}.jpg"
                    if self.download_image(img_url, filename):
                        downloaded += 1
                        
            print(f"📸 从Unsplash下载了 {downloaded} 张关于 '{query}' 的图片")
            
        except Exception as e:
            print(f"❌ Unsplash抓取失败: {e}")
    
    def get_stock_images(self):
        """获取股票相关的免费图片"""
        stock_queries = [
            "brain neuroscience",
            "meditation mindfulness", 
            "philosophy ancient greece",
            "investment charts",
            "global economy",
            "cognitive psychology",
            "decision making",
            "emotional control",
            "critical thinking",
            "self awareness"
        ]
        
        for query in stock_queries:
            self.scrape_unsplash(query, 3)
            time.sleep(2)  # 避免请求过快
    
    def create_image_manifest(self):
        """创建图片清单"""
        manifest = {
            "chapter1_images": {
                "self_awareness": {
                    "philosophy": [
                        "philosophy_ancient_greece_1.jpg",
                        "philosophy_ancient_greece_2.jpg",
                        "philosophy_ancient_greece_3.jpg"
                    ],
                    "neuroscience": [
                        "brain_neuroscience_1.jpg",
                        "brain_neuroscience_2.jpg",
                        "brain_neuroscience_3.jpg"
                    ],
                    "meditation": [
                        "meditation_mindfulness_1.jpg",
                        "meditation_mindfulness_2.jpg",
                        "meditation_mindfulness_3.jpg"
                    ]
                },
                "world_perspective": {
                    "global_economy": [
                        "global_economy_1.jpg",
                        "global_economy_2.jpg",
                        "global_economy_3.jpg"
                    ],
                    "investment_charts": [
                        "investment_charts_1.jpg",
                        "investment_charts_2.jpg",
                        "investment_charts_3.jpg"
                    ]
                },
                "cognitive_psychology": {
                    "decision_making": [
                        "decision_making_1.jpg",
                        "decision_making_2.jpg",
                        "decision_making_3.jpg"
                    ],
                    "emotional_control": [
                        "emotional_control_1.jpg",
                        "emotional_control_2.jpg",
                        "emotional_control_3.jpg"
                    ]
                }
            }
        }
        
        with open(os.path.join(self.output_dir, "image_manifest.json"), 'w', encoding='utf-8') as f:
            json.dump(manifest, f, ensure_ascii=False, indent=2)
        
        print("📋 图片清单已创建: image_manifest.json")

def main():
    scraper = ImageScraper()
    print("🚀 开始抓取第一章相关图片...")
    
    # 获取股票图片
    scraper.get_stock_images()
    
    # 创建图片清单
    scraper.create_image_manifest()
    
    print("✅ 图片抓取完成！")

if __name__ == "__main__":
    main() 