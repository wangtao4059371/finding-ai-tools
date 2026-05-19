import os
import time
import sqlite3
import re
import requests
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("DEEPSEEK_API_KEY")
if not API_KEY:
    raise RuntimeError("请设置 DEEPSEEK_API_KEY")

client = OpenAI(api_key=API_KEY, base_url="https://api.deepseek.com/v1")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}

def fetch_website_text(url):
    if not url:
        return None
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        r.raise_for_status()
        text = re.sub(r'<script[^>]*>.*?</script>', '', r.text, flags=re.DOTALL)
        text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL)
        text = re.sub(r'<[^>]+>', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()[:3000]
    except:
        return None

def generate_content(name, description, tag, url):
    site_text = fetch_website_text(url)
    
    context = f"""工具名称: {name}
简短描述: {description}
分类: {tag}
官网: {url}"""

    if site_text:
        context += f"""
以下是从官网抓取的最新内容（请优先使用官网信息）：
---
{site_text}
---"""

    prompt = f"""你是一个专业的 AI 科技编辑。请根据以下信息写一份工具介绍。用中文输出，总共 200-300 字。

⚠️ 重要规则：
- 不要写具体版本号（不说"GPT-4"、"Claude 3.5"等），用概括描述
- 不要写具体价格数字（不说"每月20美元"、"免费10次"等）
- 如果官网内容与你的训练数据冲突，以官网为准
- 不确定的信息用概括性语言描述

{context}

按以下结构输出 HTML（只要 HTML）：

<h2>概述</h2>
<p>该工具是什么、主要用途、核心能力</p>

<h2>核心特点</h2>
<ul>
<li>特点1</li>
<li>特点2</li>
<li>特点3</li>
</ul>

<h2>适用场景</h2>
<p>适合什么人用、解决什么问题</p>

<h2>定价</h2>
<p>收费模式概况（不写具体金额）</p>"""
    
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "你是一个只输出 HTML 内容的机器。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            timeout=60
        )
        content = response.choices[0].message.content.strip()
        if content.startswith("```html"): content = content.replace("```html", "").replace("```", "").strip()
        elif content.startswith("```"): content = content.replace("```", "").strip()
        return content
    except Exception as e:
        print(f"  生成失败: {e}")
        return None

def main():
    conn = sqlite3.connect('tools.db')
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name, description, tag, url, slug FROM tools WHERE slug IS NOT NULL AND slug != '' ORDER BY id")
    tools = cursor.fetchall()
    print(f"需要生成内容的工具: {len(tools)} 个\n")
    
    count = 0
    for tool in tools:
        tool_id, name, description, tag, url, slug = tool
        
        print(f"生成 ({count+1}/{len(tools)}): {name} ...")
        
        site_text = fetch_website_text(url)
        source_tag = "🌐 官网" if site_text else "📚 知识库"
        print(f"  数据源: {source_tag}")
        
        content = generate_content(name, description or '', tag or '', url or '')
        
        if content:
            now = datetime.now().isoformat()
            cursor.execute("UPDATE tools SET content = ?, content_updated = ? WHERE id = ?", (content, now, tool_id))
            conn.commit()
            print(f"  ✅ 成功: {len(content)} 字")
            count += 1
        else:
            print(f"  ❌ 失败")
        
        time.sleep(0.3)
    
    conn.close()
    print(f"\n完成! 共生成 {count} 条内容")

if __name__ == "__main__":
    main()