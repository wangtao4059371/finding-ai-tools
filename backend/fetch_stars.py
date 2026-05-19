import sqlite3
import re
import time
import requests
import os
from dotenv import load_dotenv

load_dotenv()

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools.db')
if not os.path.exists(DB_PATH):
    DB_PATH = os.path.join(os.getcwd(), 'tools.db')

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
HEADERS = {'User-Agent': 'findingai', 'Accept': 'application/vnd.github.v3+json'}
if GITHUB_TOKEN:
    HEADERS['Authorization'] = f'token {GITHUB_TOKEN}'
    print(f'✅ 使用 GitHub Token')
else:
    print(f'⚠️ 无 Token，速率受限')

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("SELECT id, name, url FROM tools WHERE url LIKE '%github.com%' AND (stars IS NULL OR stars = 0)")
tools = cursor.fetchall()
print(f'需要获取 Star 的仓库: {len(tools)} 个\n')

for tool in tools:
    tid, name, url = tool
    match = re.search(r'github\.com/([^/]+)/([^/]+)', url)
    if not match:
        continue
    owner, repo = match.group(1), match.group(2)
    repo = repo.split('/')[0]
    
    try:
        api = f'https://api.github.com/repos/{owner}/{repo}'
        r = requests.get(api, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            stars = r.json().get('stargazers_count', 0)
            cursor.execute('UPDATE tools SET stars = ? WHERE id = ?', (stars, tid))
            conn.commit()
            print(f'{name} ({owner}/{repo}): ⭐ {stars}')
        elif r.status_code == 404:
            print(f'{name}: 仓库不存在')
        elif r.status_code == 403:
            print(f'{name}: API 限频，等待60秒...')
            time.sleep(60)
        else:
            print(f'{name}: API {r.status_code}')
    except Exception as e:
        print(f'{name}: 失败 {e}')
    
    time.sleep(0.1)

conn.close()
print('\nStar 数据获取完成')
