#!/usr/bin/env python3
"""
MCP服务器快速启动脚本
用于在不重启Cursor的情况下启动Interactive-Feedback-MCP
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def start_mcp_server():
    """启动MCP服务器"""
    
    # 获取项目根目录
    project_root = Path(__file__).parent.parent
    mcp_dir = project_root / "interactive-feedback-mcp"
    
    if not mcp_dir.exists():
        print("❌ MCP目录不存在，请先克隆项目")
        return False
    
    # 检查server.py是否存在
    server_file = mcp_dir / "server.py"
    if not server_file.exists():
        print("❌ server.py文件不存在")
        return False
    
    print("🚀 启动Interactive-Feedback-MCP服务器...")
    
    try:
        # 启动MCP服务器
        cmd = [
            sys.executable, "-m", "uv", 
            "--directory", str(mcp_dir),
            "run", "server.py"
        ]
        
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # 等待几秒检查是否启动成功
        time.sleep(3)
        
        if process.poll() is None:
            print("✅ MCP服务器启动成功！")
            print(f"📁 项目目录: {mcp_dir}")
            print(f"🔧 配置文件: {project_root}/mcp.json")
            print("💡 现在可以在Cursor中使用交互反馈功能了")
            return True
        else:
            stdout, stderr = process.communicate()
            print("❌ MCP服务器启动失败")
            print(f"错误信息: {stderr}")
            return False
            
    except Exception as e:
        print(f"❌ 启动失败: {e}")
        return False

def check_mcp_status():
    """检查MCP服务器状态"""
    
    try:
        import psutil
        
        # 查找运行中的Python进程
        for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
            if proc.info['name'] == 'python.exe':
                cmdline = proc.info['cmdline']
                if cmdline and 'server.py' in ' '.join(cmdline):
                    print(f"✅ MCP服务器正在运行 (PID: {proc.info['pid']})")
                    return True
        
        print("❌ MCP服务器未运行")
        return False
        
    except ImportError:
        print("⚠️ 无法检查进程状态，请手动确认")
        return False

def main():
    """主函数"""
    
    print("🔧 Interactive-Feedback-MCP 管理工具")
    print("=" * 50)
    
    if len(sys.argv) > 1 and sys.argv[1] == "status":
        check_mcp_status()
    else:
        if start_mcp_server():
            print("\n📋 配置信息:")
            print("- 服务器名称: interactive-feedback-mcp")
            print("- 工具名称: interactive_feedback")
            print("- 配置文件: mcp.json")
            print("\n🎯 使用方法:")
            print("在Cursor聊天中输入: '请检查当前代码是否符合项目规范'")

if __name__ == "__main__":
    main() 