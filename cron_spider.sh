#!/bin/zsh
# 每天 0 点自动运行爬虫抓取 AI 工具数据

cd /Users/wangtao/Desktop/ai_directory

# 检查后端是否在运行，如果不在则启动
if ! pgrep -f "main:app" > /dev/null; then
    nohup python3 main.py > /dev/null 2>&1 &
    sleep 3
fi

# 运行爬虫
python3 auto_spider.py >> /Users/wangtao/Desktop/ai_directory/cron.log 2>&1