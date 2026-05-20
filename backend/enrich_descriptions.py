import os
import re
import time
import requests
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("DEEPSEEK_API_KEY")
client = OpenAI(api_key=API_KEY, base_url="https://api.deepseek.com/v1")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8",
}

MODELS = [
    ("GPT-5.5", "https://openai.com"),
    ("Claude Opus 4.7", "https://claude.ai"),
    ("Gemini 3.1 Pro", "https://deepmind.google/technologies/gemini"),
    ("Grok 3 Pro", "https://x.ai"),
    ("DeepSeek V4 Pro", "https://www.deepseek.com"),
    ("Qwen 3.6 Max", "https://tongyi.aliyun.com"),
    ("ERNIE 5.1", "https://yiyan.baidu.com"),
    ("Kimi K2.6", "https://kimi.moonshot.cn"),
    ("Llama 4", "https://llama.meta.com"),
    ("Mistral Large 3", "https://mistral.ai"),
    ("Command R7+", "https://cohere.com"),
    ("GLM-5.1", "https://www.zhipuai.cn"),
    ("Doubao Seed 2.0", "https://www.volcengine.com"),
    ("HunYuan 3.5", "https://cloud.tencent.com"),
    ("SenseChat V6", "https://www.sensetime.com"),
    ("Yi 3.5", "https://www.01.ai"),
    ("Baichuan 4-Turbo", "https://www.baichuan-ai.com"),
    ("TeleChat 2", "https://www.chinatelecom.com.cn"),
    ("MiniMax ABAB 6.5", "https://www.minimax.io"),
    ("Phi-4", "https://azure.microsoft.com/en-us/products/phi"),
    ("Gemma 2.5", "https://ai.google.dev/gemma"),
    ("Stable Diffusion 3.5", "https://stability.ai"),
    ("Flux.1 Pro", "https://blackforestlabs.ai"),
    ("Sora 2.0", "https://openai.com/sora"),
    ("Kling 2.0", "https://kling.kuaishou.com"),
]

def scrape_text(url):
    try:
        r = requests.get(url, headers=HEADERS, timeout=12)
        r.raise_for_status()
        text = re.sub(r'<script[^>]*>.*?</script>', '', r.text, flags=re.DOTALL|re.IGNORECASE)
        text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL|re.IGNORECASE)
        text = re.sub(r'<[^>]+>', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()[:4000]
    except Exception as e:
        print(f"  ❌ 抓取失败: {e}")
        return None

def polish(name, scraped):
    prompt = f"""你是资深科技编辑。请根据以下官网抓取内容，为 {name} 写一份自然、有人味的简体中文介绍。要求：

1. 不少于300字
2. 不要用"你可以""我们相信"等AI口吻
3. 用事实和数据说话，语气像科技媒体评测
4. 介绍核心能力、技术亮点、适用场景
5. 如果抓取内容不足，用你知道的行业知识补充

官网内容：
{scraped}

直接输出纯文本中文介绍，不要标题，不要markdown。"""
    
    try:
        r = client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role":"system","content":"你是专业科技编辑"},{"role":"user","content":prompt}],
            temperature=0.4,
            timeout=60
        )
        return r.choices[0].message.content.strip()
    except Exception as e:
        print(f"  ❌ 润色失败: {e}")
        return None

for name, url in MODELS:
    print(f"\n处理: {name}")
    print(f"  官网: {url}")
    scraped = scrape_text(url)
    if scraped:
        print(f"  抓取: {len(scraped)} 字符")
        result = polish(name, scraped)
        if result:
            print(f"  结果: {len(result)} 字")
            print(f"  ---\n  {result[:200]}...")
        else:
            print(f"  失败")
    time.sleep(1.5)

print("\n全部完成")
