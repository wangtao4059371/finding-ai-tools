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
    content: Optional[str] = ""
    stars: Optional[int] = 0

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

@app.patch("/api/tools/{tool_name}/content")
def update_tool_content(tool_name: str, data: dict):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    try:
        content = data.get("content", "")
        cursor.execute("UPDATE tools SET content = ? WHERE name = ?", (content, tool_name))
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


@app.post("/api/ai-recommend")
def ai_recommend(data: dict):
    query = data.get("query", "")
    if not query:
        raise HTTPException(status_code=400, detail="请输入需求描述")
    
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT name, description, tag, url, slug FROM tools WHERE slug IS NOT NULL AND slug != ''")
    tools = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    catalog = "\n".join([f"- {t['name']} ({t['tag']}): {t['description'][:100]}" for t in tools])
    
    try:
        from openai import OpenAI
        import os
        api_key = os.getenv("DEEPSEEK_API_KEY") or os.getenv("MINIMAX_API_KEY")
        client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com/v1")
        
        prompt = f"""你是 AI 工具推荐专家。根据用户需求，从工具库中推荐最匹配的 5 个工具。
只输出 JSON: {{"reason":"推荐理由(一句话)","slugs":["slug1","slug2"]}}

工具库：
{catalog}

用户需求：{query}"""
        
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role":"system","content":"只输出JSON"},{"role":"user","content":prompt}],
            temperature=0.3, timeout=30
        )
        text = response.choices[0].message.content.strip()
        if text.startswith("```"): text = text.replace("```json","").replace("```","").strip()
        
        import json
        result = json.loads(text)
        slugs = result.get("slugs", [])[:5]
        reason = result.get("reason", "")
        
        # 匹配工具
        conn2 = sqlite3.connect(DB_FILE)
        conn2.row_factory = sqlite3.Row
        placeholders = ",".join(["?" for _ in slugs])
        rows = []
        if slugs:
            cursor2 = conn2.cursor()
            cursor2.execute(f"SELECT * FROM tools WHERE slug IN ({placeholders})", slugs)
            rows = [dict(r) for r in cursor2.fetchall()]
        conn2.close()
        
        return {"reason": reason, "tools": rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
            "INSERT INTO tools (name, logo, url, type, tag, base_model, framework, pricing, description, slug, stars) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (tool.name, tool.logo, tool.url, tool.type, tool.tag, tool.base_model, tool.framework, tool.pricing, tool.description, slug, tool.stars)
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