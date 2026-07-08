"""
Backend for mayankkumar.dev — API proxy + optional global leaderboard.

Why this exists: the AI chatbot and roast features call the Anthropic API.
Calling it directly from the browser would expose your API key to visitors.
This tiny FastAPI service keeps the key on the server (you know this pattern
well from Stock Agent).

Deploy on Render free tier:
  1. Push this folder to a GitHub repo
  2. Render → New Web Service → connect repo
  3. Build command:  pip install -r requirements.txt
  4. Start command:  uvicorn main:app --host 0.0.0.0 --port $PORT
  5. Environment variable: ANTHROPIC_API_KEY = <your key from console.anthropic.com>
  6. Copy the Render URL into CONFIG.API_BASE in src/App.jsx
"""

import os
import secrets
import sqlite3

import httpx
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="mayank-site-api")

# Lock this down to your domain after you buy it, e.g. ["https://mayankkumar.dev"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ————— AI proxy —————

class ChatRequest(BaseModel):
    messages: list
    system: str | None = None


@app.post("/api/chat")
async def chat(req: ChatRequest):
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": os.environ["ANTHROPIC_API_KEY"],
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-sonnet-4-6",
                "max_tokens": 1000,
                "system": req.system or "",
                "messages": req.messages,
            },
        )
        data = r.json()

    text = "".join(
        block.get("text", "")
        for block in data.get("content", [])
        if block.get("type") == "text"
    )
    return {"text": text or "Hmm, I couldn't think of a reply — try again!"}


# ————— Optional: global snake leaderboard —————
# The frontend uses localStorage (per-device) by default. If you want a TRUE
# global leaderboard, wire these two endpoints into App.jsx (swap loadLB /
# saveScore for fetch calls to /api/leaderboard).

DB = "leaderboard.db"


def _init_db():
    with sqlite3.connect(DB) as con:
        con.execute(
            "CREATE TABLE IF NOT EXISTS scores (name TEXT, score INTEGER)"
        )
        con.execute(
            "CREATE TABLE IF NOT EXISTS posts ("
            "id INTEGER PRIMARY KEY AUTOINCREMENT, "
            "date TEXT, kind TEXT, title TEXT, body TEXT)"
        )


_init_db()


class Score(BaseModel):
    name: str
    score: int


@app.get("/api/leaderboard")
def get_leaderboard():
    with sqlite3.connect(DB) as con:
        rows = con.execute(
            "SELECT name, score FROM scores ORDER BY score DESC LIMIT 8"
        ).fetchall()
    return [{"name": n, "score": s} for n, s in rows]


@app.post("/api/leaderboard")
def post_score(s: Score):
    name = s.name.strip()[:14] or "anon"
    with sqlite3.connect(DB) as con:
        con.execute("INSERT INTO scores VALUES (?, ?)", (name, s.score))
        # keep table small
        con.execute(
            "DELETE FROM scores WHERE rowid NOT IN "
            "(SELECT rowid FROM scores ORDER BY score DESC LIMIT 100)"
        )
    return get_leaderboard()


# ————— Blog posts — added from the site by whoever holds ADMIN_KEY —————
# Note: on Render's free tier, this sqlite file resets on redeploys/restarts.
# Fine for a fun "add a note" feature — treat KNOWLEDGE in App.jsx as the
# permanent record for anything you want to keep forever.

class Post(BaseModel):
    date: str
    kind: str
    title: str
    body: str


def _check_admin(x_admin_key: str | None):
    admin_key = os.environ.get("ADMIN_KEY")
    if not admin_key or not x_admin_key or not secrets.compare_digest(x_admin_key, admin_key):
        raise HTTPException(status_code=401, detail="Invalid admin key")


@app.get("/api/blog")
def get_posts():
    with sqlite3.connect(DB) as con:
        rows = con.execute(
            "SELECT date, kind, title, body FROM posts ORDER BY id DESC"
        ).fetchall()
    return [{"date": d, "kind": k, "title": t, "body": b} for d, k, t, b in rows]


@app.post("/api/blog")
def add_post(post: Post, x_admin_key: str | None = Header(None)):
    _check_admin(x_admin_key)
    with sqlite3.connect(DB) as con:
        con.execute(
            "INSERT INTO posts (date, kind, title, body) VALUES (?, ?, ?, ?)",
            (post.date.strip()[:40], post.kind.strip()[:20], post.title.strip()[:120], post.body.strip()[:2000]),
        )
    return get_posts()


@app.get("/")
def health():
    return {"status": "ok", "service": "mayank-site-api"}
