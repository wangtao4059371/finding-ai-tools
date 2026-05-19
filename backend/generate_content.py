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
    prompt = f"""你是一个专业的 AI 科技编辑。请为以下 AI 工具写一份简洁的介绍。用中文输出，总共控制在 200-300 字。

工具名称: {name}
简短描述: {description}
分类: {tag}
官网: {url}

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