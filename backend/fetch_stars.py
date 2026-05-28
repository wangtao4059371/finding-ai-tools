import os
import re
import sqlite3
import time
from datetime import datetime

import requests
from dotenv import load_dotenv

load_dotenv()

DB_PATH = os.getenv(
    "TOOLS_DB_PATH",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "tools.db"),
)
if not os.path.exists(DB_PATH):
    DB_PATH = os.path.join(os.getcwd(), "tools.db")

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
HEADERS = {
    "User-Agent": "findingai",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}
if GITHUB_TOKEN:
    HEADERS["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    print("✅ 使用 GitHub Token")
else:
    print("⚠️ 无 Token，速率受限")

GITHUB_RE = re.compile(r"github\.com/([^/\s?#]+)/([^/\s?#]+)")

EXTRA_COLUMNS = {
    "stars": "INTEGER DEFAULT 0",
    "content_updated": "TEXT",
    "owner_login": "TEXT",
    "owner_avatar_url": "TEXT",
    "repo_name": "TEXT",
    "github_url": "TEXT",
    "forks": "INTEGER DEFAULT 0",
    "language": "TEXT",
    "license": "TEXT",
    "topics": "TEXT",
    "pushed_at": "TEXT",
    "repo_image_url": "TEXT",
}


def ensure_columns(cursor):
    cursor.execute("PRAGMA table_info(tools)")
    existing = {row[1] for row in cursor.fetchall()}
    for name, definition in EXTRA_COLUMNS.items():
        if name not in existing:
            cursor.execute(f"ALTER TABLE tools ADD COLUMN {name} {definition}")


def parse_github_repo(url):
    match = GITHUB_RE.search(url or "")
    if not match:
        return None, None
    owner = match.group(1)
    repo = match.group(2).removesuffix(".git")
    return owner, repo


def repo_metadata(data):
    owner = data.get("owner") or {}
    license_info = data.get("license") or {}
    owner_login = owner.get("login") or ""
    repo_name = data.get("name") or ""

    return {
        "logo": owner.get("avatar_url") or f"https://github.com/{owner_login}.png",
        "stars": data.get("stargazers_count") or 0,
        "owner_login": owner_login,
        "owner_avatar_url": owner.get("avatar_url") or f"https://github.com/{owner_login}.png",
        "repo_name": repo_name,
        "github_url": data.get("html_url") or "",
        "forks": data.get("forks_count") or 0,
        "language": data.get("language") or "",
        "license": license_info.get("spdx_id") or license_info.get("name") or "",
        "topics": ",".join(data.get("topics") or []),
        "pushed_at": data.get("pushed_at") or "",
        "repo_image_url": f"https://opengraph.githubassets.com/1/{owner_login}/{repo_name}",
    }


conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
ensure_columns(cursor)
conn.commit()

cursor.execute("SELECT id, name, url FROM tools WHERE url LIKE '%github.com%' ORDER BY id")
tools = cursor.fetchall()
print(f"需要补全 GitHub 元数据的仓库: {len(tools)} 个\n")

updated = 0
for tid, name, url in tools:
    owner, repo = parse_github_repo(url)
    if not owner or not repo:
        print(f"{name}: GitHub URL 无法解析")
        continue

    try:
        api = f"https://api.github.com/repos/{owner}/{repo}"
        response = requests.get(api, headers=HEADERS, timeout=15)
        if response.status_code == 200:
            metadata = repo_metadata(response.json())
            metadata["content_updated"] = datetime.now().isoformat()
            columns = list(metadata.keys())
            values = [metadata[column] for column in columns]
            values.append(tid)
            cursor.execute(
                f"UPDATE tools SET {', '.join([column + ' = ?' for column in columns])} WHERE id = ?",
                values,
            )
            conn.commit()
            updated += 1
            print(
                f"{name} ({owner}/{repo}): ⭐ {metadata['stars']} "
                f"· {metadata['language'] or 'Unknown'}"
            )
        elif response.status_code == 404:
            print(f"{name}: 仓库不存在")
        elif response.status_code == 403:
            print(f"{name}: API 限频，等待60秒...")
            time.sleep(60)
        else:
            print(f"{name}: API {response.status_code}")
    except Exception as exc:
        print(f"{name}: 失败 {exc}")

    time.sleep(0.15)

conn.close()
print(f"\nGitHub 元数据补全完成，更新 {updated}/{len(tools)} 个仓库")
