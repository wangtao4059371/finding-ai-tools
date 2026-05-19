import os
import json
import re
import time
import requests
from openai import OpenAI
from dotenv import load_dotenv
from typing import List, Optional

load_dotenv()

API_KEY = os.getenv("DEEPSEEK_API_KEY")
if not API_KEY:
    raise RuntimeError("请在环境变量中设置 DEEPSEEK_API_KEY")

BASE_URL = "https://api.deepseek.com/v1"
client = OpenAI(api_key=API_KEY, base_url=BASE_URL)
LOCAL_SITE_URL = "http://127.0.0.1:8001/api/tools/add"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Cache-Control": "max-age=0",
}


def fetch_product_hunt_scrape() -> List[str]:
    print("📡 正在从 Product Hunt 网页抓取 AI 产品...")
    try:
        url = "https://www.producthunt.com/leading/category/ai"
        response = requests.get(url, headers=HEADERS, timeout=20)
        response.raise_for_status()
        
        text = response.text
        pattern = r'"name":"([^"]+)","slug":"[^"]+","tagline":"([^"]+)"'
        matches = re.findall(pattern, text)
        
        raw_texts = []
        for name, tagline in matches[:30]:
            raw_texts.append(f"""
Product: "{name}"
Description: {tagline}
Website: https://producthunt.com
Topics: AI
""")
        
        if not raw_texts:
            pattern2 = r'data-component="ProductCard[^"]*"[^>]*>.*?<span[^>]*>([^<]+)</span>.*?<p[^>]*>([^<]+)</p>'
            matches2 = re.findall(pattern2, text, re.DOTALL)
            for name, desc in matches2[:30]:
                raw_texts.append(f"""
Product: "{name.strip()}"
Description: {desc.strip()}
Website: https://producthunt.com
Topics: AI
""")
        
        print(f"✅ 获取到 {len(raw_texts)} 条 Product Hunt 数据")
        return raw_texts
        
    except Exception as e:
        print(f"❌ Product Hunt 抓取失败: {e}")
        return []


def fetch_future_tools() -> List[str]:
    print("📡 正在从 Future.tools 抓取 AI 工具...")
    try:
        url = "https://www.future.tools"
        response = requests.get(url, headers=HEADERS, timeout=20)
        response.raise_for_status()
        
        text = response.text
        
        patterns = [
            r'"name":"([^"]+)","description":"([^"]+)","url":"([^"]+)"',
            r'"name":"([^"]+)","description":"([^"]+)","link":"([^"]+)"',
            r'<div[^>]*class="[^"]*tool[^"]*"[^>]*>.*?<h[23][^>]*>([^<]+)</h[23]>.*?<p[^>]*>([^<]+)</p>',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text)
            if matches:
                raw_texts = []
                for match in matches[:30]:
                    if len(match) == 3:
                        name, desc, url = match
                    elif len(match) == 2:
                        name, desc = match
                        url = "https://example.com"
                    else:
                        continue
                    raw_texts.append(f"""
Tool: "{name.strip()}"
Description: {desc.strip()}
Website: {url.strip()}
Category: AI Tools
""")
                if raw_texts:
                    print(f"✅ 获取到 {len(raw_texts)} 条 Future.tools 数据")
                    return raw_texts
        
        print(f"❌ Future.tools 未找到匹配数据")
        return []
        
    except Exception as e:
        print(f"❌ Future.tools 抓取失败: {e}")
        return []


def fetch_theres_an_ai_for_that() -> List[str]:
    print("📡 正在从 There's an AI for That 抓取...")
    try:
        url = "https://theresanaiforthat.com/"
        response = requests.get(url, headers=HEADERS, timeout=20)
        response.raise_for_status()
        
        text = response.text
        pattern = r'"name":"([^"]+)","description":"([^"]+)","url":"([^"]+)"'
        matches = re.findall(pattern, text)
        
        raw_texts = []
        for name, desc, url in matches[:30]:
            raw_texts.append(f"""
Tool: "{name}"
Description: {desc}
Website: {url}
Category: AI Tools
""")
        
        print(f"✅ 获取到 {len(raw_texts)} 条数据")
        return raw_texts
        
    except Exception as e:
        print(f"❌ There's an AI for That 抓取失败: {e}")
        return []


def fetch_gpttoday() -> List[str]:
    print("📡 正在从 GPTtoday 抓取 AI 工具...")
    try:
        url = "https://gpttoday.com/"
        response = requests.get(url, headers=HEADERS, timeout=20)
        response.raise_for_status()
        
        text = response.text
        pattern = r'<h2[^>]*>([^<]+)</h2>.*?<p[^>]*>([^<]+)</p>'
        matches = re.findall(pattern, text, re.DOTALL)
        
        raw_texts = []
        for name, desc in matches[:30]:
            raw_texts.append(f"""
Tool: "{name.strip()}"
Description: {desc.strip()}
Website: https://gpttoday.com
Category: AI Tools
""")
        
        print(f"✅ 获取到 {len(raw_texts)} 条 GPTtoday 数据")
        return raw_texts
        
    except Exception as e:
        print(f"❌ GPTtoday 抓取失败: {e}")
        return []


def fetch_freeai_tools() -> List[str]:
    print("📡 正在从 Free.AI Tools 抓取...")
    try:
        url = "https://free-ai-tools.com/"
        response = requests.get(url, headers=HEADERS, timeout=20)
        response.raise_for_status()
        
        text = response.text
        pattern = r'"title":"([^"]+)","description":"([^"]+)","url":"([^"]+)"'
        matches = re.findall(pattern, text)
        
        raw_texts = []
        for name, desc, url in matches[:30]:
            raw_texts.append(f"""
Tool: "{name}"
Description: {desc}
Website: {url}
Category: AI Tools
""")
        
        print(f"✅ 获取到 {len(raw_texts)} 条 Free.AI Tools 数据")
        return raw_texts
        
    except Exception as e:
        print(f"❌ Free.AI Tools 抓取失败: {e}")
        return []


def fetch_github_trending() -> List[str]:
    print("📡 正在从 GitHub Trending 获取大量 AI 相关项目...")
    all_items = []
    search_queries = [
        "AI OR artificial-intelligence topic:ai",
        "GPT OR LLM topic:llm",
        "LangChain OR agent topic:agent",
        "machine-learning OR deep-learning",
        "stable-diffusion OR text-to-image",
    ]
    
    for query in search_queries:
        try:
            url = "https://api.github.com/search/repositories"
            params = {
                "q": query,
                "sort": "stars",
                "order": "desc",
                "per_page": 100
            }
            headers = {
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "findingaitools/1.0"
            }
            response = requests.get(url, params=params, headers=headers, timeout=15)
            response.raise_for_status()
            items = response.json().get("items", [])
            all_items.extend(items[:50])
            print(f"  ✅ 查询 '{query}' 获取到 {len(items)} 条")
            time.sleep(2)
        except Exception as e:
            print(f"  ❌ 查询 '{query}' 失败: {e}")
    
    # 去重
    seen = set()
    unique_items = []
    for item in all_items:
        if item['id'] not in seen:
            seen.add(item['id'])
            unique_items.append(item)
    
    raw_texts = []
    for item in unique_items:
        text = f"""
Repository: "{item['name']}"
Description: {item['description'] or '暂无描述'}
Language: {item['language'] or '多种语言'}, Stars: {item['stargazers_count']}
Owner: {item['owner']['login']}
Link: {item['html_url']}
"""
        raw_texts.append(text.strip())
    
    print(f"✅ 总共获取到 {len(raw_texts)} 条独特 GitHub AI 数据")
    return raw_texts


def fetch_all_ai_tools() -> List[str]:
    all_data = []
    
    github_data = fetch_github_trending()
    all_data.extend(github_data)
    
    ph_data = fetch_product_hunt_scrape()
    if ph_data:
        all_data.extend(ph_data)
    
    ft_data = fetch_future_tools()
    if ft_data:
        all_data.extend(ft_data)
    
    taft_data = fetch_theres_an_ai_for_that()
    if taft_data:
        all_data.extend(taft_data)
    
    gt_data = fetch_gpttoday()
    if gt_data:
        all_data.extend(gt_data)
    
    free_data = fetch_freeai_tools()
    if free_data:
        all_data.extend(free_data)
    
    print(f"\n📊 总共获取到 {len(all_data)} 条原始数据")
    return all_data


def generate_detail_content(name: str, description: str, tag: str, url: str) -> Optional[str]:
    # 尝试抓取官网最新内容
    site_text = None
    if url:
        try:
            r = requests.get(url, headers=HEADERS, timeout=10)
            r.raise_for_status()
            text = re.sub(r'<script[^>]*>.*?</script>', '', r.text, flags=re.DOTALL)
            text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL)
            text = re.sub(r'<[^>]+>', ' ', text)
            text = re.sub(r'\s+', ' ', text)
            site_text = text.strip()[:3000]
        except:
            pass
    
    context = f"""工具名称: {name}
简短描述: {description}
分类: {tag}
官网: {url}"""

    if site_text:
        context += f"\n\n以下是从官网抓取的最新内容（请优先以官网信息为准）：\n{site_text}"

    prompt = f"""你是一个专业的 AI 科技编辑。请根据以下信息写一份简洁中文介绍，总共 200-300 字。
如果提供了官网最新内容，请优先使用官网信息。

{context}

按此结构输出 HTML（只要 HTML）：
<h2>概述</h2><p>说明该工具是什么、谁开发的、主要用途</p>
<h2>核心特点</h2><ul><li>特点</li></ul>
<h2>适用场景</h2><p>适合什么人用</p>
<h2>价格</h2><p>收费模式</p>"""
    
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
        print(f"  ❌ 内容生成失败: {e}")
        return None


def process_with_llm(raw_text: str) -> Optional[dict]:
    prompt = f"""
你是一个专业的科技媒体编辑。请分析以下 AI 产品信息，提取关键要素，严格按 JSON 格式输出。

要求：
1. name: 产品英文名称
2. logo: 使用 Google Favicon API 格式，如 https://www.google.com/s2/favicons?domain=官网域名&sz=128
3. url: 产品官网链接
4. type: "Agent" 或 "Tool"
5. tag: Agent类可选(自治智能体/开发智能体/金融智能体/Agent框架)；Tool类可选(AI写作/AI绘画/AI视频/AI音频/音乐/AI办公/开发工具/效率工具)
6. base_model: Agent填基座模型；Tool填 "无"
7. framework: Agent填框架；Tool填 "无"
8. pricing: 免费/付费/免费\\/订阅
9. description: 50-80字中文介绍
10. stars: GitHub项目的Star数量（整数），非GitHub项目填0

原文：
{raw_text}

输出严格JSON格式（10个字段）：
{{"name":"","logo":"","url":"","type":"","tag":"","base_model":"","framework":"","pricing":"","description":"","stars":0}}
"""
    
    print("🤖 正在呼叫 DeepSeek 进行智能解析...")
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "你是一个只输出JSON格式数据的机器接口。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        result_text = response.choices[0].message.content.strip()
        
        result_text = re.sub(r'^```json\s*', '', result_text, flags=re.DOTALL).strip()
        result_text = re.sub(r'^```\s*', '', result_text, flags=re.DOTALL).strip()
        result_text = re.sub(r'\s*```$', '', result_text, flags=re.DOTALL).strip()
        result_text = re.sub(r'^[\s\S]*?({)', r'\1', result_text)
        result_text = re.sub(r"(})[\s\S]*$", r'\1', result_text)
        
        start_idx = result_text.find('{')
        end_idx = result_text.rfind('}')
        
        if start_idx != -1 and end_idx != -1:
            pure_json_str = result_text[start_idx:end_idx+1]
            return json.loads(pure_json_str)
        else:
            print("❌ 清洗后没有找到合法的 JSON 格式")
            return None
            
    except Exception as e:
        print(f"❌ AI 处理失败: {e}")
        return None


def publish_to_site(structured_data: dict):
    if not structured_data:
        return
    
    print(f"🚀 发布 [{structured_data['name']}] 到本地网站...")
    try:
        response = requests.post(LOCAL_SITE_URL, json=structured_data, timeout=10)
        if response.status_code == 200:
            result = response.json()
            if result.get("status") == "skipped":
                print(f"⏭️ {result.get('message')}")
            elif result.get("status") == "success":
                print(f"✅ {result.get('message')}")
                # 生成详细内容
                print(f"📝 正在生成详细内容...")
                content = generate_detail_content(
                    structured_data['name'],
                    structured_data.get('description', ''),
                    structured_data.get('tag', ''),
                    structured_data.get('url', '')
                )
                if content:
                    # 发送内容到后端
                    content_response = requests.patch(
                        f"{LOCAL_SITE_URL.replace('/add', '')}/{structured_data['name']}/content",
                        json={"content": content},
                        timeout=10
                    )
                print(f"✨ 内容生成完成")
        else:
            print(f"❌ 发布失败，状态码: {response.status_code}")
    except Exception as e:
        print(f"❌ 无法连接到本地网站: {e}")


if __name__ == "__main__":
    raw_texts = fetch_all_ai_tools()
    
    if not raw_texts:
        print("没有获取到数据，脚本退出。")
        exit(1)
    
    success_count = 0
    for i, raw_text in enumerate(raw_texts, 1):
        print(f"\n{'='*40}")
        print(f"处理第 {i}/{len(raw_texts)} 条数据...")
        
        clean_data = process_with_llm(raw_text)
        if clean_data:
            publish_to_site(clean_data)
            success_count += 1
        
        if i < len(raw_texts):
            print("⏳ 等待 1.5 秒...")
            time.sleep(1.5)
    
    print(f"\n🎉 批量录入完成！成功录入 {success_count} 条数据")