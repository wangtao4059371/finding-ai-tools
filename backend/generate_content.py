import os
import json
import time
import sqlite3
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("DEEPSEEK_API_KEY")
if not API_KEY:
    raise RuntimeError("请设置 DEEPSEEK_API_KEY")

client = OpenAI(api_key=API_KEY, base_url="https://api.deepseek.com/v1")

def generate_content(name, description, tag, url):
    prompt = f"""你是一个专业的 AI 科技编辑。请为以下 AI 工具写一份详细的介绍文章。用中文输出，不少于 400 字。

工具名称: {name}
简短描述: {description}
分类: {tag}
官网: {url}

请按以下结构输出 HTML 格式的内容（只输出 body 内的 HTML，不要 doctype 和 body 标签）：

<h2>概述</h2>
<p>（2-3 段介绍这个工具是什么，谁开发的，主要能力）</p>

<h2>核心功能</h2>
<ul>
<li>功能1</li>
<li>功能2</li>
<li>功能3</li>
<li>功能4</li>
<li>功能5</li>
</ul>

<h2>适用场景</h2>
<p>（描述这个工具适合哪些人使用，解决什么问题）</p>
<ul>
<li>场景1</li>
<li>场景2</li>
<li>场景3</li>
</ul>

<h2>优缺点</h2>
<h3>优点</h3>
<ul>
<li>优点1</li>
<li>优点2</li>
<li>优点3</li>
</ul>
<h3>缺点</h3>
<ul>
<li>缺点1</li>
<li>缺点2</li>
</ul>

<h2>常见问题 (FAQ)</h2>
<h3>Q: （问题1）</h3>
<p>A: （回答）</p>
<h3>Q: （问题2）</h3>
<p>A: （回答）</p>

直接输出 HTML，不要加任何解释。"""
    
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "你是一个只输出 HTML 内容的机器。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            timeout=60
        )
        content = response.choices[0].message.content.strip()
        # 清理可能的 markdown 包裹
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
    
    # 获取没有 content 的工具
    cursor.execute("SELECT id, name, description, tag, url, slug FROM tools WHERE content IS NULL OR content = '' ORDER BY id")
    tools = cursor.fetchall()
    
    print(f"需要生成内容的工具: {len(tools)} 个\n")
    
    count = 0
    for tool in tools:
        tool_id, name, description, tag, url, slug = tool
        
        # 跳过中文名没有 slug 的
        if not slug:
            print(f"  跳过 (无slug): {name}")
            continue
        
        print(f"生成 ({count+1}/{len(tools)}): {name} ...")
        content = generate_content(name, description or '', tag or '', url or '')
        
        if content:
            cursor.execute("UPDATE tools SET content = ? WHERE id = ?", (content, tool_id))
            conn.commit()
            print(f"  ✅ 成功: {len(content)} 字")
            count += 1
        else:
            print(f"  ❌ 失败")
        
        # 避免限速
        if count % 5 == 0:
            time.sleep(2)
        else:
            time.sleep(0.5)
    
    conn.close()
    print(f"\n完成! 共生成 {count} 条内容")

if __name__ == "__main__":
    main()