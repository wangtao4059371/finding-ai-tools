import os, re, time, json, requests
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

client = OpenAI(api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com/v1")
H = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

MODELS = [
    ("Claude Opus 4.6","Anthropic","https://claude.ai"),
    ("Gemini 3.1 Pro","Google DeepMind","https://deepmind.google/gemini"),
    ("GPT-5.4","OpenAI","https://openai.com"),
    ("Doubao Seed 2.0 Pro","字节跳动","https://www.volcengine.com"),
    ("DeepSeek V4 Pro","深度求索","https://www.deepseek.com"),
    ("Gemini 3 Flash","Google","https://deepmind.google/gemini"),
    ("DeepSeek V4 Flash","深度求索","https://www.deepseek.com"),
    ("Grok 4.20","xAI","https://x.ai"),
    ("Kimi K2.5","月之暗面","https://kimi.moonshot.cn"),
    ("Qwen 3.5 Think","阿里通义","https://tongyi.aliyun.com"),
    ("GLM-5","智谱AI","https://www.zhipuai.cn"),
]

results = {}
for name, company, url in MODELS:
    print(f"\n处理: {name}")
    scraped = ""
    try:
        r = requests.get(url, headers=H, timeout=10)
        text = re.sub(r'<script[^>]*>.*?</script>', '', r.text, flags=re.DOTALL|re.IGNORECASE)
        text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL|re.IGNORECASE)
        text = re.sub(r'<[^>]+>', ' ', text)
        scraped = re.sub(r'\s+', ' ', text).strip()[:5000]
        print(f"  抓取: {len(scraped)}字")
    except Exception as e:
        print(f"  抓取失败: {e}")

    prompt = f"""你是资深科技编辑。根据以下信息为{name}写详细中英双语介绍。要求：
1. 每份不少于500字
2. 用事实和数据，不用AI口吻
3. 介绍核心能力、技术亮点、适用场景
4. 如果官网信息不足，用行业数据补充

官网：{scraped}  公司：{company}

输出JSON：{{"zh":"中文介绍","en":"English intro"}}"""

    try:
        r = client.chat.completions.create(
            model="deepseek-chat", temperature=0.4, timeout=90,
            messages=[{"role":"system","content":"只输出JSON"},{"role":"user","content":prompt}]
        )
        txt = r.choices[0].message.content.strip()
        if txt.startswith("```"): txt = txt.replace("```json","").replace("```","").strip()
        data = json.loads(txt)
        results[name] = data
        print(f"  ✅ 中文{len(data.get('zh',''))}字, 英文{len(data.get('en',''))}字")
    except Exception as e:
        print(f"  ❌ {e}")
    
    time.sleep(1)

with open('/tmp/enriched_descs.json','w') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print(f"\n完成 {len(results)} 条")
