import sqlite3
import re
import os
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, List, Optional
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Tools & Agents Directory API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = os.getenv("TOOLS_DB_PATH", "tools.db")

GITHUB_RE = re.compile(r"github\.com/([^/\s?#]+)/([^/\s?#]+)")
FAVICON_URL = "https://www.google.com/s2/favicons?domain={domain}&sz=128"


def parse_github_repo(url: str):
    if not url:
        return None, None
    match = GITHUB_RE.search(url)
    if not match:
        return None, None
    owner = match.group(1)
    repo = match.group(2).removesuffix(".git")
    return owner, repo


def normalize_topics(value: Any) -> str:
    if not value:
        return ""
    if isinstance(value, list):
        return ",".join(str(item).strip() for item in value if str(item).strip())
    return str(value).strip()


def favicon_for_url(url: str) -> str:
    if not url:
        return ""
    try:
        domain = re.sub(r"^https?://", "", url).split("/")[0]
        return FAVICON_URL.format(domain=domain)
    except Exception:
        return ""


def normalize_tool_data(data: dict) -> dict:
    normalized = dict(data)
    owner, repo = parse_github_repo(normalized.get("github_url") or normalized.get("url") or "")
    if owner and repo:
        current_logo = normalized.get("logo") or ""
        current_logo_is_avatar = (
            "avatars.githubusercontent.com" in current_logo
            or re.match(r"^https://github\.com/[^/]+\.png", current_logo)
        )
        normalized["owner_login"] = normalized.get("owner_login") or owner
        normalized["repo_name"] = normalized.get("repo_name") or repo
        normalized["github_url"] = normalized.get("github_url") or f"https://github.com/{owner}/{repo}"
        normalized["owner_avatar_url"] = (
            normalized.get("owner_avatar_url")
            or (current_logo if current_logo_is_avatar else "")
            or f"https://github.com/{owner}.png"
        )
        normalized["logo"] = normalized["owner_avatar_url"]
        normalized["repo_image_url"] = (
            normalized.get("repo_image_url")
            or f"https://opengraph.githubassets.com/1/{owner}/{repo}"
        )
    elif not normalized.get("logo"):
        normalized["logo"] = favicon_for_url(normalized.get("url", ""))

    normalized["topics"] = normalize_topics(normalized.get("topics"))
    return normalized

def make_slug(name: str) -> str:
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tools (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            logo TEXT,
            url TEXT NOT NULL,
            type TEXT NOT NULL,
            tag TEXT,
            base_model TEXT,
            framework TEXT,
            pricing TEXT,
            description TEXT,
            slug TEXT,
            content TEXT,
            stars INTEGER DEFAULT 0,
            content_updated TEXT,
            owner_login TEXT,
            owner_avatar_url TEXT,
            repo_name TEXT,
            github_url TEXT,
            forks INTEGER DEFAULT 0,
            language TEXT,
            license TEXT,
            topics TEXT,
            pushed_at TEXT,
            repo_image_url TEXT
        )
    ''')
    columns = {
        "slug": "TEXT",
        "content": "TEXT",
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
    cursor.execute("PRAGMA table_info(tools)")
    existing = {row[1] for row in cursor.fetchall()}
    for name, definition in columns.items():
        if name not in existing:
            cursor.execute(f"ALTER TABLE tools ADD COLUMN {name} {definition}")
    conn.commit()
    conn.close()

init_db()

@app.get("/")
def read_index():
    return FileResponse("index.html")

class ToolSchema(BaseModel):
    name: str
    logo: Optional[str] = ""
    url: str
    type: str
    tag: str
    base_model: str
    framework: str
    pricing: str
    description: str
    content: Optional[str] = ""
    stars: Optional[int] = 0
    owner_login: Optional[str] = None
    owner_avatar_url: Optional[str] = None
    repo_name: Optional[str] = None
    github_url: Optional[str] = None
    forks: Optional[int] = 0
    language: Optional[str] = None
    license: Optional[str] = None
    topics: Optional[Any] = None
    pushed_at: Optional[str] = None
    repo_image_url: Optional[str] = None


def rows_to_dicts(rows):
    return [normalize_tool_data(dict(row)) for row in rows]

@app.get("/api/tools", response_model=List[dict])
def get_tools():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tools ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return rows_to_dicts(rows)


@app.get("/api/tools/summary", response_model=List[dict])
def get_tools_summary():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, name, logo, url, type, tag, base_model, framework, pricing,
               description, slug, stars, content_updated, owner_login,
               owner_avatar_url, repo_name, github_url, forks, language,
               license, topics, pushed_at, repo_image_url
        FROM tools
        ORDER BY id DESC
    """)
    rows = cursor.fetchall()
    conn.close()
    return rows_to_dicts(rows)

@app.get("/api/tools/id/{tool_id}", response_model=dict)
def get_tool_by_id(tool_id: int):
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tools WHERE id = ?", (tool_id,))
    row = cursor.fetchone()
    conn.close()
    if row is None:
        raise HTTPException(status_code=404, detail="工具不存在")
    return normalize_tool_data(dict(row))

@app.get("/api/tools/{slug}", response_model=dict)
def get_tool_by_slug(slug: str):
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tools WHERE slug = ?", (slug,))
    row = cursor.fetchone()
    conn.close()
    if row is None:
        raise HTTPException(status_code=404, detail="工具不存在")
    return normalize_tool_data(dict(row))

@app.patch("/api/tools/{tool_name}/content")
def update_tool_content(tool_name: str, data: dict):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    try:
        content = data.get("content", "")
        now = datetime.now().isoformat()
        cursor.execute("UPDATE tools SET content = ?, content_updated = ? WHERE name = ?", (content, now, tool_name))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="工具不存在")
        conn.commit()
        return {"status": "success", "message": f"内容更新成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@app.get("/api/models/ratings", response_model=List[dict])
def get_model_ratings():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM model_ratings ORDER BY id")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


@app.post("/api/tools/add")
def add_tool(tool: ToolSchema):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    try:
        payload = normalize_tool_data(tool.model_dump())
        cursor.execute("SELECT id FROM tools WHERE name = ? OR url = ?", (payload["name"], payload["url"]))
        existing = cursor.fetchone()
        if existing:
            metadata_fields = [
                "logo", "stars", "owner_login", "owner_avatar_url", "repo_name",
                "github_url", "forks", "language", "license", "topics",
                "pushed_at", "repo_image_url"
            ]
            updates = []
            values = []
            for field in metadata_fields:
                value = payload.get(field)
                if value not in (None, ""):
                    updates.append(f"{field} = ?")
                    values.append(value)
            if updates:
                values.append(existing[0])
                cursor.execute(f"UPDATE tools SET {', '.join(updates)} WHERE id = ?", values)
                conn.commit()
            return {"status": "skipped", "message": f"产品 [{payload['name']}] 已存在，已补充元数据。"}
        
        slug = make_slug(payload["name"])
        now = datetime.now().isoformat()
        columns = [
            "name", "logo", "url", "type", "tag", "base_model", "framework",
            "pricing", "description", "slug", "content", "stars",
            "content_updated", "owner_login", "owner_avatar_url", "repo_name",
            "github_url", "forks", "language", "license", "topics",
            "pushed_at", "repo_image_url"
        ]
        values = [
            payload.get("name"), payload.get("logo"), payload.get("url"),
            payload.get("type"), payload.get("tag"), payload.get("base_model"),
            payload.get("framework"), payload.get("pricing"),
            payload.get("description"), slug, payload.get("content") or "",
            payload.get("stars") or 0, now, payload.get("owner_login"),
            payload.get("owner_avatar_url"), payload.get("repo_name"),
            payload.get("github_url"), payload.get("forks") or 0,
            payload.get("language"), payload.get("license"),
            payload.get("topics"), payload.get("pushed_at"),
            payload.get("repo_image_url")
        ]
        cursor.execute(
            f"INSERT INTO tools ({', '.join(columns)}) VALUES ({', '.join(['?'] * len(columns))})",
            values
        )
        conn.commit()
        return {"status": "success", "message": f"产品 [{payload['name']}] 录入成功！"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
