# Mayank Kumar — Personal Website

Four-mode personal site: **Work** (portfolio) · **Play** (Stock Agent demo, Snake, AI roast, music, chatbot) · **Learn** (daily AI blog) · **Hire me** (recruiter fast-lane).

## Structure

```
mayank-website/
├── index.html            # SEO meta tags — edit title/description here
├── package.json
├── vite.config.js
├── public/
│   └── Mayank_Kumar_Resume.pdf   # your real resume (download button works)
├── src/
│   ├── main.jsx
│   └── App.jsx           # THE ENTIRE SITE — edit CONFIG + BLOG at the top
└── backend/
    ├── main.py           # FastAPI proxy (keeps Anthropic key secret) + optional global leaderboard
    └── requirements.txt
```

## 1. Run locally

```bash
npm install
npm run dev        # opens http://localhost:5173
```

## 2. Before deploying — edit CONFIG in src/App.jsx

```js
const CONFIG = {
  STOCK_AGENT_URL: "...",   // your live Stock Agent link
  SCHOLAR_URL: "...",       // your Google Scholar profile
  GITHUB_STOCK_REPO: "...", // exact repo URL
  API_BASE: "",             // backend URL (step 4) — empty disables AI features gracefully
  RESUME_PDF: "/Mayank_Kumar_Resume.pdf",
};
```

## 3. Deploy frontend (Vercel — free)

1. Push this folder to a GitHub repo
2. vercel.com → New Project → import the repo (Vite is auto-detected)
3. Deploy. Then add your purchased domain in Vercel → Settings → Domains

## 4. Deploy backend (Render — free) — enables chatbot + roast

1. Render → New Web Service → same repo, root directory `backend/`
2. Build: `pip install -r requirements.txt`
3. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Env var: `ANTHROPIC_API_KEY` (get one at console.anthropic.com)
5. Copy the Render URL into `CONFIG.API_BASE`, redeploy frontend

Note: API usage is paid per token — the chatbot/roast prompts are small, so
casual traffic costs very little, but set a spend limit in the Anthropic
console to be safe.

## 5. Daily blog post (30 seconds)

Open `src/App.jsx`, find the `KNOWLEDGE` array at the top, paste a new block
at position #1:

```js
{
  date: "Jul 07, 2026",
  kind: "NOTES",
  title: "Today's topic",
  body: "Your explanation...",
},
```

Commit + push → Vercel auto-redeploys.

## Notes

- **Leaderboard**: uses localStorage (per-device) by default. For a true
  global leaderboard, the backend already has `/api/leaderboard` endpoints —
  swap `loadLB`/`saveScore` in App.jsx for fetch calls to them.
- **CORS**: after buying your domain, change `allow_origins=["*"]` in
  backend/main.py to `["https://yourdomain.com"]`.
- **SEO**: edit the `<title>` and meta description in index.html; submit your
  domain to Google Search Console after launch.
