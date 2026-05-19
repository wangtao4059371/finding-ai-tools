import os
import time
import sqlite3
import re
import requests
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
    """尝试抓取官网首页文本"""
    if not url:
        return None
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        r.raise_for_status()
        text = re.sub(r'<script[^>]*>.*?</script>', '', r.text, flags=re.DOTALL)
        text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL)
        text = re.sub(r'<[^>]+>', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        text = text.strip()[:3000]
        return text
    except:
        return None

def generate_content(name, description, tag, url):
    # 先获取官网最新内容
    site_text = fetch_website_text(url)
    
    context = f"""工具名称: {name}
简短描述: {description}
分类: {tag}
官网: {url}"""

    if site_text:
        context += f"""
以下是从官网抓取的最新内容（请以此为准）：
---
{site_text}
---"""

    prompt = f"""你是一个专业的 AI 科技编辑。请根据以下信息为这个 AI 工具写一份简洁介绍。用中文输出，总共控制在 200-300 字。
如果提供了官网最新内容，请优先使用官网信息。

{context}

请按以下结构输出 HTML 格式的内容（只输出 body 内的 HTML）：

<h2>概述</h2>
<p>（1 段话，说明该工具是什么、谁开发的、主要用途）</p>

<h2>核心特点</h2>
<ul>
<li>特点1（一句话）</li>
<li>特点2（一句话）</li>
<li>特点3（一句话）</li>
</ul>

<h2>适用场景</h2>
<p>（1 句话说明适合什么人用、解决什么问题）</p>

<h2>价格</h2>
<p>（1 句话说明收费模式）</p>

直接输出 HTML，不要加任何解释。"""
    
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
        if content.startswith("```html"):
            content = content.replace("```html", "").replace("```", "").strip()
        elif content.startswith("```"):
            content = content.replace("```", "").strip()
        return content
    except Exception as e:
        print(f"  生成失败: {e}")
        return None

def main():
    conn = sqlite3.connect('tools.db')
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name, description, tag, url, slug FROM tools WHERE slug IS NOT NULL AND slug != '' AND (content IS NULL OR content = '') ORDER BY id")
    tools = cursor.fetchall()
    
    print(f"需要生成内容的工具: {len(tools)} 个\n")
    
    count = 0
    for tool in tools:
        tool_id, name, description, tag, url, slug = tool
        
        print(f"生成 ({count+1}/{len(tools)}): {name} ...")
        
        # 尝试抓取官网
        site_text = fetch_website_text(url)
        source_tag = "🌐 官网" if site_text else "📚 知识库"
        print(f"  数据源: {source_tag}")
        
        content = generate_content(name, description or '', tag or '', url or '')
        
        if content:
            cursor.execute("UPDATE tools SET content = ? WHERE id = ?", (content, tool_id))
            conn.commit()
            print(f"  ✅ 成功: {len(content)} 字")
            count += 1
        else:
            print(f"  ❌ 失败")
        
        if count % 3 == 0:
            time.sleep(2)
        else:
            time.sleep(0.5)
    
    conn.close()
    print(f"\n完成! 共生成 {count} 条内容")

if __name__ == "__main__":
    main()