import os, json
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
client = OpenAI(api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com/v1")

with open('/tmp/article_raw.txt') as f:
    raw = f.read()

prompt = f"""你是资深科技编辑。处理以下AI编程工具对比文章。要求：

1. 润色中文版：保留核心内容数据，删除冗余废话，合并重复。保持技术深度和个人体验语气。
2. 生成英文版：忠实翻译。
3. 标题：中文"Claude Code vs Codex 终极对比：开发者实测报告 2026"，英文"Claude Code vs Codex: Developer's Real-World Comparison 2026"
4. 生成50字摘录，分类标签"AI编程"

输出JSON：{{"zh_title":"","en_title":"","zh_excerpt":"","en_excerpt":"","zh":"Markdown","en":"Markdown"}}

文章：{raw[:8000]}"""

r = client.chat.completions.create(
    model="deepseek-chat", temperature=0.3, timeout=120,
    messages=[{"role":"system","content":"只输出JSON"},{"role":"user","content":prompt}]
)
txt = r.choices[0].message.content.strip()
if txt.startswith("```"): txt = txt.replace("```json","").replace("```","").strip()
data = json.loads(txt)

md = f"""---
title: "{data['zh_title']}"
date: "2026-05-21"
excerpt: "{data['zh_excerpt']}"
excerpt_en: "{data['en_excerpt']}"
category: "AI编程"
cover: ""
---

{data['zh']}

---

## English Version

{data['en']}
"""

path = '/Users/wangtao/Desktop/ai_directory/nextjs-app/content/blog/claude-code-vs-codex.md'
os.makedirs(os.path.dirname(path), exist_ok=True)
with open(path, 'w') as f:
    f.write(md)
print(f'✅ 保存: {path}')
print(f'中文: {len(data["zh"])} 字, 英文: {len(data["en"])} 字')
