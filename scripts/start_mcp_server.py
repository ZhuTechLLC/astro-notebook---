#!/usr/bin/env python3
"""
Interactive-Feedback-MCP 服务器启动脚本
解决依赖和环境问题，确保MCP服务器正常运行
"""

import os
import sys
import subprocess
import time
import requests
from pathlib import Path

def check_mcp_server():
    """检查MCP服务器是否运行"""
    try:
        response = requests.get("http://localhost:3000/health", timeout=2)
        return response.status_code == 200
    except:
        return False

def start_mcp_server():
    """启动MCP服务器"""
    project_root = Path(__file__).parent.parent
    mcp_dir = project_root / "interactive-feedback-mcp"
    
    if not mcp_dir.exists():
        print("❌ MCP目录不存在")
        return False
    
    print("🚀 启动Interactive-Feedback-MCP服务器...")
    
    # 切换到MCP目录
    os.chdir(mcp_dir)
    
    try:
        # 使用uv运行服务器
        process = subprocess.Popen(
            ["uv", "run", "server.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # 等待服务器启动
        print("⏳ 等待服务器启动...")
        time.sleep(3)
        
        # 检查是否启动成功
        if check_mcp_server():
            print("✅ MCP服务器启动成功！")
            print("📍 服务地址: http://localhost:3000")
            print("🔧 进程ID:", process.pid)
            return True
        else:
            print("❌ MCP服务器启动失败")
            return False
            
    except Exception as e:
        print(f"❌ 启动失败: {e}")
        return False

def main():
    """主函数"""
    print("🔍 检查Interactive-Feedback-MCP状态...")
    
    if check_mcp_server():
        print("✅ MCP服务器已在运行")
        return
    
    print("📋 启动MCP服务器...")
    if start_mcp_server():
        print("🎉 MCP服务器已就绪，可以在Cursor中使用交互反馈功能")
    else:
        print("💡 如果仍有问题，请检查:")
        print("   1. Python环境是否正确")
        print("   2. uv包管理器是否安装")
        print("   3. MCP依赖是否完整")

if __name__ == "__main__":
    main() 