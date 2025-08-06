import os
import sys
import json
import pandas as pd
import pdfplumber
import PyPDF2
from pdf2image import convert_from_path
from PIL import Image
import tabula
import camelot
from pdfminer.high_level import extract_text
from pdfminer.layout import LAParams
import matplotlib.pyplot as plt
import cv2
import numpy as np
from datetime import datetime
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ComprehensivePDFExtractor:
    def __init__(self, pdf_path, output_dir):
        self.pdf_path = pdf_path
        self.output_dir = output_dir
        self.metadata = {
            'extraction_time': datetime.now().isoformat(),
            'pdf_file': os.path.basename(pdf_path),
            'total_pages': 0,
            'extracted_items': {
                'text_files': [],
                'images': [],
                'tables': [],
                'charts': []
            }
        }
        
    def extract_metadata(self):
        """提取PDF元数据"""
        try:
            with open(self.pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                self.metadata['total_pages'] = len(pdf_reader.pages)
                
                if pdf_reader.metadata:
                    self.metadata['pdf_metadata'] = {
                        'title': pdf_reader.metadata.get('/Title', ''),
                        'author': pdf_reader.metadata.get('/Author', ''),
                        'subject': pdf_reader.metadata.get('/Subject', ''),
                        'creator': pdf_reader.metadata.get('/Creator', ''),
                        'producer': pdf_reader.metadata.get('/Producer', ''),
                        'creation_date': str(pdf_reader.metadata.get('/CreationDate', '')),
                        'modification_date': str(pdf_reader.metadata.get('/ModDate', ''))
                    }
                    
            logger.info(f"PDF元数据提取完成，总页数: {self.metadata['total_pages']}")
            
        except Exception as e:
            logger.error(f"提取PDF元数据失败: {e}")
            
    def extract_text_content(self):
        """提取文本内容"""
        logger.info("开始提取文本内容...")
        
        try:
            # 方法1: 使用pdfplumber提取结构化文本
            with pdfplumber.open(self.pdf_path) as pdf:
                full_text = ""
                page_texts = {}
                
                for i, page in enumerate(pdf.pages, 1):
                    page_text = page.extract_text()
                    if page_text:
                        page_texts[f"page_{i}"] = page_text
                        full_text += f"\n\n=== 第 {i} 页 ===\n\n{page_text}"
                        
                        # 保存单页文本
                        page_file = os.path.join(self.output_dir, 'text', f'page_{i:03d}.txt')
                        with open(page_file, 'w', encoding='utf-8') as f:
                            f.write(page_text)
                        self.metadata['extracted_items']['text_files'].append(f'page_{i:03d}.txt')
                
                # 保存完整文本
                full_text_file = os.path.join(self.output_dir, 'text', 'full_text.txt')
                with open(full_text_file, 'w', encoding='utf-8') as f:
                    f.write(full_text)
                    
                # 保存结构化文本数据
                structured_file = os.path.join(self.output_dir, 'text', 'structured_text.json')
                with open(structured_file, 'w', encoding='utf-8') as f:
                    json.dump(page_texts, f, ensure_ascii=False, indent=2)
                    
                self.metadata['extracted_items']['text_files'].extend(['full_text.txt', 'structured_text.json'])
                
            # 方法2: 使用pdfminer提取更详细的文本
            detailed_text = extract_text(self.pdf_path, laparams=LAParams())
            detailed_file = os.path.join(self.output_dir, 'text', 'detailed_text.txt')
            with open(detailed_file, 'w', encoding='utf-8') as f:
                f.write(detailed_text)
            self.metadata['extracted_items']['text_files'].append('detailed_text.txt')
            
            logger.info(f"文本提取完成，共提取 {len(page_texts)} 页")
            
        except Exception as e:
            logger.error(f"文本提取失败: {e}")
            
    def extract_images(self):
        """提取图片内容"""
        logger.info("开始提取图片...")
        
        try:
            # 方法1: 转换整页为图片
            pages = convert_from_path(self.pdf_path, dpi=300)
            for i, page in enumerate(pages, 1):
                image_file = os.path.join(self.output_dir, 'images', f'page_{i:03d}_full.png')
                page.save(image_file, 'PNG')
                self.metadata['extracted_items']['images'].append(f'page_{i:03d}_full.png')
                
            # 方法2: 提取嵌入的图片
            with pdfplumber.open(self.pdf_path) as pdf:
                for i, page in enumerate(pdf.pages, 1):
                    # 检测图片对象
                    if hasattr(page, 'images'):
                        for j, img in enumerate(page.images):
                            try:
                                # 提取图片区域
                                bbox = (img['x0'], img['top'], img['x1'], img['bottom'])
                                cropped = page.crop(bbox)
                                
                                # 转换为图片
                                img_obj = cropped.to_image(resolution=300)
                                img_file = os.path.join(self.output_dir, 'images', f'page_{i:03d}_img_{j+1}.png')
                                img_obj.save(img_file)
                                self.metadata['extracted_items']['images'].append(f'page_{i:03d}_img_{j+1}.png')
                                
                            except Exception as e:
                                logger.warning(f"提取第{i}页第{j+1}个图片失败: {e}")
                                
            logger.info(f"图片提取完成，共提取 {len(self.metadata['extracted_items']['images'])} 个图片")
            
        except Exception as e:
            logger.error(f"图片提取失败: {e}")
            
    def extract_tables(self):
        """提取表格内容"""
        logger.info("开始提取表格...")
        
        try:
            # 方法1: 使用tabula-py提取表格
            try:
                tables = tabula.read_pdf(self.pdf_path, pages='all', multiple_tables=True)
                for i, table in enumerate(tables):
                    if not table.empty:
                        table_file = os.path.join(self.output_dir, 'tables', f'tabula_table_{i+1:03d}.csv')
                        table.to_csv(table_file, index=False, encoding='utf-8')
                        
                        # 同时保存为Excel
                        excel_file = os.path.join(self.output_dir, 'tables', f'tabula_table_{i+1:03d}.xlsx')
                        table.to_excel(excel_file, index=False)
                        
                        self.metadata['extracted_items']['tables'].extend([
                            f'tabula_table_{i+1:03d}.csv',
                            f'tabula_table_{i+1:03d}.xlsx'
                        ])
                        
                logger.info(f"Tabula提取了 {len(tables)} 个表格")
                
            except Exception as e:
                logger.warning(f"Tabula表格提取失败: {e}")
                
            # 方法2: 使用camelot提取表格
            try:
                tables = camelot.read_pdf(self.pdf_path, pages='all')
                for i, table in enumerate(tables):
                    table_file = os.path.join(self.output_dir, 'tables', f'camelot_table_{i+1:03d}.csv')
                    table.to_csv(table_file, encoding='utf-8')
                    
                    # 保存表格图片
                    table_img = os.path.join(self.output_dir, 'tables', f'camelot_table_{i+1:03d}_visual.png')
                    camelot.plot(table, kind='contour').savefig(table_img)
                    plt.close()
                    
                    self.metadata['extracted_items']['tables'].extend([
                        f'camelot_table_{i+1:03d}.csv',
                        f'camelot_table_{i+1:03d}_visual.png'
                    ])
                    
                logger.info(f"Camelot提取了 {len(tables)} 个表格")
                
            except Exception as e:
                logger.warning(f"Camelot表格提取失败: {e}")
                
            # 方法3: 使用pdfplumber提取表格
            try:
                with pdfplumber.open(self.pdf_path) as pdf:
                    table_count = 0
                    for i, page in enumerate(pdf.pages, 1):
                        tables = page.extract_tables()
                        for j, table in enumerate(tables):
                            if table:
                                table_count += 1
                                df = pd.DataFrame(table[1:], columns=table[0])
                                
                                table_file = os.path.join(self.output_dir, 'tables', f'pdfplumber_page_{i:03d}_table_{j+1}.csv')
                                df.to_csv(table_file, index=False, encoding='utf-8')
                                
                                excel_file = os.path.join(self.output_dir, 'tables', f'pdfplumber_page_{i:03d}_table_{j+1}.xlsx')
                                df.to_excel(excel_file, index=False)
                                
                                self.metadata['extracted_items']['tables'].extend([
                                    f'pdfplumber_page_{i:03d}_table_{j+1}.csv',
                                    f'pdfplumber_page_{i:03d}_table_{j+1}.xlsx'
                                ])
                                
                logger.info(f"PDFPlumber提取了 {table_count} 个表格")
                
            except Exception as e:
                logger.warning(f"PDFPlumber表格提取失败: {e}")
                
        except Exception as e:
            logger.error(f"表格提取失败: {e}")
            
    def detect_charts(self):
        """检测和提取图表"""
        logger.info("开始检测图表...")
        
        try:
            # 转换PDF页面为图片进行图表检测
            pages = convert_from_path(self.pdf_path, dpi=200)
            
            for i, page in enumerate(pages, 1):
                # 转换为OpenCV格式
                page_np = np.array(page)
                page_cv = cv2.cvtColor(page_np, cv2.COLOR_RGB2BGR)
                gray = cv2.cvtColor(page_cv, cv2.COLOR_BGR2GRAY)
                
                # 检测图表特征（简单的矩形检测）
                edges = cv2.Canny(gray, 50, 150, apertureSize=3)
                contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                
                chart_count = 0
                for j, contour in enumerate(contours):
                    area = cv2.contourArea(contour)
                    if area > 5000:  # 过滤小的噪声
                        x, y, w, h = cv2.boundingRect(contour)
                        aspect_ratio = w / h
                        
                        # 简单的图表判断逻辑
                        if 0.5 < aspect_ratio < 3 and w > 100 and h > 100:
                            chart_count += 1
                            
                            # 提取图表区域
                            chart_region = page_cv[y:y+h, x:x+w]
                            chart_file = os.path.join(self.output_dir, 'charts', f'page_{i:03d}_chart_{chart_count}.png')
                            cv2.imwrite(chart_file, chart_region)
                            
                            self.metadata['extracted_items']['charts'].append(f'page_{i:03d}_chart_{chart_count}.png')
                            
                            # 在原图上标记图表位置
                            cv2.rectangle(page_cv, (x, y), (x+w, y+h), (0, 255, 0), 2)
                            cv2.putText(page_cv, f'Chart {chart_count}', (x, y-10), 
                                      cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                
                # 保存标记了图表的页面
                if chart_count > 0:
                    marked_file = os.path.join(self.output_dir, 'charts', f'page_{i:03d}_marked.png')
                    cv2.imwrite(marked_file, page_cv)
                    self.metadata['extracted_items']['charts'].append(f'page_{i:03d}_marked.png')
                    
            logger.info(f"图表检测完成，共检测到 {len([f for f in self.metadata['extracted_items']['charts'] if 'chart_' in f])} 个图表")
            
        except Exception as e:
            logger.error(f"图表检测失败: {e}")
            
    def generate_analysis_report(self):
        """生成分析报告"""
        logger.info("生成分析报告...")
        
        try:
            report = {
                'extraction_summary': {
                    'pdf_file': self.metadata['pdf_file'],
                    'extraction_time': self.metadata['extraction_time'],
                    'total_pages': self.metadata['total_pages'],
                    'text_files_count': len(self.metadata['extracted_items']['text_files']),
                    'images_count': len(self.metadata['extracted_items']['images']),
                    'tables_count': len(self.metadata['extracted_items']['tables']),
                    'charts_count': len(self.metadata['extracted_items']['charts'])
                },
                'detailed_inventory': self.metadata['extracted_items'],
                'recommendations': []
            }
            
            # 添加建议
            if report['extraction_summary']['text_files_count'] > 0:
                report['recommendations'].append("文本内容已成功提取，可用于内容分析和搜索")
                
            if report['extraction_summary']['tables_count'] > 0:
                report['recommendations'].append("表格数据已提取为CSV和Excel格式，可进行数据分析")
                
            if report['extraction_summary']['images_count'] > 0:
                report['recommendations'].append("图片已提取为PNG格式，可用于视觉分析")
                
            if report['extraction_summary']['charts_count'] > 0:
                report['recommendations'].append("图表已检测并提取，可用于数据可视化分析")
            
            # 保存报告
            report_file = os.path.join(self.output_dir, 'reports', 'extraction_report.json')
            with open(report_file, 'w', encoding='utf-8') as f:
                json.dump(report, f, ensure_ascii=False, indent=2)
                
            # 生成HTML报告
            html_report = self.generate_html_report(report)
            html_file = os.path.join(self.output_dir, 'reports', 'extraction_report.html')
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(html_report)
                
            logger.info("分析报告生成完成")
            
        except Exception as e:
            logger.error(f"生成分析报告失败: {e}")
            
    def generate_html_report(self, report):
        """生成HTML格式的报告"""
        html = f"""
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PDF内容提取报告</title>
            <style>
                body {{ font-family: 'Microsoft YaHei', sans-serif; margin: 20px; }}
                .header {{ background: #f5f5f5; padding: 20px; border-radius: 8px; }}
                .section {{ margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }}
                .summary-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }}
                .summary-card {{ background: #e8f4fd; padding: 15px; border-radius: 5px; text-align: center; }}
                .file-list {{ max-height: 300px; overflow-y: auto; }}
                .file-item {{ padding: 5px; border-bottom: 1px solid #eee; }}
                .recommendation {{ background: #f0f8f0; padding: 10px; margin: 5px 0; border-left: 4px solid #4CAF50; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>PDF内容提取报告</h1>
                <p><strong>文件:</strong> {report['extraction_summary']['pdf_file']}</p>
                <p><strong>提取时间:</strong> {report['extraction_summary']['extraction_time']}</p>
            </div>
            
            <div class="section">
                <h2>提取概要</h2>
                <div class="summary-grid">
                    <div class="summary-card">
                        <h3>{report['extraction_summary']['total_pages']}</h3>
                        <p>总页数</p>
                    </div>
                    <div class="summary-card">
                        <h3>{report['extraction_summary']['text_files_count']}</h3>
                        <p>文本文件</p>
                    </div>
                    <div class="summary-card">
                        <h3>{report['extraction_summary']['images_count']}</h3>
                        <p>图片文件</p>
                    </div>
                    <div class="summary-card">
                        <h3>{report['extraction_summary']['tables_count']}</h3>
                        <p>表格文件</p>
                    </div>
                    <div class="summary-card">
                        <h3>{report['extraction_summary']['charts_count']}</h3>
                        <p>图表文件</p>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>文件清单</h2>
                <h3>文本文件</h3>
                <div class="file-list">
                    {''.join([f'<div class="file-item">📄 {f}</div>' for f in report['detailed_inventory']['text_files']])}
                </div>
                
                <h3>图片文件</h3>
                <div class="file-list">
                    {''.join([f'<div class="file-item">🖼️ {f}</div>' for f in report['detailed_inventory']['images']])}
                </div>
                
                <h3>表格文件</h3>
                <div class="file-list">
                    {''.join([f'<div class="file-item">📊 {f}</div>' for f in report['detailed_inventory']['tables']])}
                </div>
                
                <h3>图表文件</h3>
                <div class="file-list">
                    {''.join([f'<div class="file-item">📈 {f}</div>' for f in report['detailed_inventory']['charts']])}
                </div>
            </div>
            
            <div class="section">
                <h2>使用建议</h2>
                {''.join([f'<div class="recommendation">💡 {rec}</div>' for rec in report['recommendations']])}
            </div>
        </body>
        </html>
        """
        return html
        
    def run_extraction(self, extract_text=True, extract_images=True, extract_tables=True, detect_charts=True):
        """运行完整的提取流程"""
        logger.info(f"开始处理PDF文件: {self.pdf_path}")
        
        # 提取元数据
        self.extract_metadata()
        
        # 根据参数选择提取内容
        if extract_text:
            self.extract_text_content()
            
        if extract_images:
            self.extract_images()
            
        if extract_tables:
            self.extract_tables()
            
        if detect_charts:
            self.detect_charts()
            
        # 生成报告
        self.generate_analysis_report()
        
        # 保存元数据
        metadata_file = os.path.join(self.output_dir, 'metadata', 'extraction_metadata.json')
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(self.metadata, f, ensure_ascii=False, indent=2)
            
        logger.info("PDF内容提取完成!")
        return self.metadata

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='综合PDF内容提取工具')
    parser.add_argument('pdf_path', help='PDF文件路径')
    parser.add_argument('--output-dir', default='pdf_extracted_content', help='输出目录')
    parser.add_argument('--no-text', action='store_true', help='不提取文本')
    parser.add_argument('--no-images', action='store_true', help='不提取图片')
    parser.add_argument('--no-tables', action='store_true', help='不提取表格')
    parser.add_argument('--no-charts', action='store_true', help='不检测图表')
    
    args = parser.parse_args()
    
    # 创建输出目录
    os.makedirs(args.output_dir, exist_ok=True)
    for subdir in ['text', 'images', 'tables', 'charts', 'metadata', 'reports']:
        os.makedirs(os.path.join(args.output_dir, subdir), exist_ok=True)
    
    # 创建提取器并运行
    extractor = ComprehensivePDFExtractor(args.pdf_path, args.output_dir)
    result = extractor.run_extraction(
        extract_text=not args.no_text,
        extract_images=not args.no_images,
        extract_tables=not args.no_tables,
        detect_charts=not args.no_charts
    )
    
    print(f"\n提取完成! 结果保存在: {args.output_dir}")
    print(f"总页数: {result['total_pages']}")
    print(f"提取的文件数量:")
    print(f"  - 文本文件: {len(result['extracted_items']['text_files'])}")
    print(f"  - 图片文件: {len(result['extracted_items']['images'])}")
    print(f"  - 表格文件: {len(result['extracted_items']['tables'])}")
    print(f"  - 图表文件: {len(result['extracted_items']['charts'])}")

if __name__ == "__main__":
    main()
