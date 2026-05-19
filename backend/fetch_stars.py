import sqlite3
import re
import time
import requests

conn = sqlite3.connect('/Users/wangtao/Desktop/ai_directory/tools.db')
cursor = conn.cursor()

cursor.execute("SELECT id, name, url FROM tools WHERE url LIKE '%github.com%'")
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
        r = requests.get(api, headers={'User-Agent': 'findingai', 'Accept': 'application/vnd.github.v3+json'}, timeout=10)
        if r.status_code == 200:
            stars = r.json().get('stargazers_count', 0)
            cursor.execute('UPDATE tools SET stars = ? WHERE id = ?', (stars, tid))
            conn.commit()
            print(f'{name} ({owner}/{repo}): ⭐ {stars}')
        else:
            print(f'{name}: API {r.status_code}')
    except Exception as e:
        print(f'{name}: 失败 {e}')
    
    time.sleep(0.3)

conn.close()
print('\nStar 数据获取完成')
