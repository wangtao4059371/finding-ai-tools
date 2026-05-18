import sqlite3
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="AI Tools & Agents Directory API")

# 允许跨域
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "tools.db"

# 1. 初始化数据库 (9个核心字段)
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
            description TEXT
        )
    ''')
    cursor.execute("SELECT COUNT(*) FROM tools")
    if cursor.fetchone()[0] == 0:
        test_data = [
            ("Midjourney", "https://avatar.iran.liara.run/public/44", "https://midjourney.com", "Tool", "设计创意", "无", "无", "付费", "顶级的AI艺术与图像生成工具，通过文本提示生成高质量图像。"),
            ("AutoGPT", "https://avatar.iran.liara.run/public/12", "https://github.com/Significant-Gravitas/AutoGPT", "Agent", "自治智能体", "GPT-4", "LangChain", "免费", "开源的自主智能体。只要给定一个目标，它能自动联网搜索、拆解任务并执行，直至目标完成。")
        ]
        cursor.executemany("INSERT INTO tools (name, logo, url, type, tag, base_model, framework, pricing, description) VALUES (?,?,?,?,?,?,?,?,?)", test_data)
    conn.commit()
    conn.close()

init_db()

# 2. 根目录直接展示网页
@app.get("/")
def read_index():
    return FileResponse("index.html")

# 3. 接收爬虫数据的格式校验
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

# 4. 提供给前端的数据接口
@app.get("/api/tools", response_model=List[dict])
def get_tools():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tools ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

# 6. 提供单个工具详情接口 (供 Next.js 构建用)
@app.get("/api/tools/{tool_id}", response_model=dict)
def get_tool_detail(tool_id: int):
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tools WHERE id = ?", (tool_id,))
    row = cursor.fetchone()
    conn.close()
    if row is None:
        raise HTTPException(status_code=404, detail="工具不存在")
    return dict(row)

# 5. 爬虫数据录入接口（带防重机制）
@app.post("/api/tools/add")
def add_tool(tool: ToolSchema):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    try:
        # 🔥 防重安检门：检查是否已经存在同名或同链接的产品
        cursor.execute("SELECT id FROM tools WHERE name = ? OR url = ?", (tool.name, tool.url))
        if cursor.fetchone():
            return {"status": "skipped", "message": f"⚠️ 产品 [{tool.name}] 已经存在数据库中，直接跳过。"}

        # 执行插入
        cursor.execute(
            "INSERT INTO tools (name, logo, url, type, tag, base_model, framework, pricing, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (tool.name, tool.logo, tool.url, tool.type, tool.tag, tool.base_model, tool.framework, tool.pricing, tool.description)
        )
        conn.commit()
        return {"status": "success", "message": f"✅ 产品 [{tool.name}] 录入成功！"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)