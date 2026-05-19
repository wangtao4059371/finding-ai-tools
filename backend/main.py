import sqlite3
import re
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="AI Tools & Agents Directory API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "tools.db"

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
            slug TEXT
        )
    ''')
    try:
        cursor.execute('ALTER TABLE tools ADD COLUMN slug TEXT')
    except:
        pass
    conn.commit()
    conn.close()

init_db()

@app.get("/")
def read_index():
    return FileResponse("index.html")

class ToolSchema(BaseModel):
    name: str
    logo: str
    url: str
    type: str
    tag: str
    base_model: str
    framework: str
    pricing: str
    description: str

@app.get("/api/tools", response_model=List[dict])
def get_tools():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tools ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

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
    return dict(row)

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
    return dict(row)

@app.post("/api/tools/add")
def add_tool(tool: ToolSchema):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM tools WHERE name = ? OR url = ?", (tool.name, tool.url))
        if cursor.fetchone():
            return {"status": "skipped", "message": f"产品 [{tool.name}] 已经存在数据库中，直接跳过。"}
        
        slug = make_slug(tool.name)
        cursor.execute(
            "INSERT INTO tools (name, logo, url, type, tag, base_model, framework, pricing, description, slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (tool.name, tool.logo, tool.url, tool.type, tool.tag, tool.base_model, tool.framework, tool.pricing, tool.description, slug)
        )
        conn.commit()
        return {"status": "success", "message": f"产品 [{tool.name}] 录入成功！"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)