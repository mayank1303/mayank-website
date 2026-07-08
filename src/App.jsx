import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
//  CONFIG — edit these values, nothing else needs to change
// ═══════════════════════════════════════════════════════════════
const CONFIG = {
  STOCK_AGENT_URL: "https://YOUR-STOCK-AGENT-URL.vercel.app", // ← your live Stock Agent link
  SCHOLAR_URL: "https://scholar.google.com/citations?user=YOUR_ID", // ← your Scholar profile
  GITHUB_STOCK_REPO: "https://github.com/mayank1303", // ← exact repo link
  API_BASE: "https://mayank-site-api.onrender.com", // ← your FastAPI backend URL (empty = AI features show a friendly message)
  RESUME_PDF: "/Mayank_Kumar_Resume.pdf", // already included in /public
};

// ═══════════════════════════════════════════════════════════════
//  BLOG — add a new post here daily (newest FIRST)
//  Copy one block, change date/kind/title/body. Redeploy. Done.
// ═══════════════════════════════════════════════════════════════
const KNOWLEDGE = [
  {
    date: "Jul 06, 2026",
    kind: "STARTER KIT",
    title: "Building your first AI agent — what you actually need",
    body: "1) Claude API or Ollama (local, free). 2) Tools: give the LLM functions it can call — start with just 2-3. 3) RAG: ChromaDB + sentence-transformers for your documents. 4) MCP if you want Claude Desktop integration. 5) Evals from day one — measure tool-routing accuracy before adding features. This is exactly how Stock Agent started.",
  },
  {
    date: "Jul 05, 2026",
    kind: "GUIDE",
    title: "How I deploy ML apps for free",
    body: "My Stock Agent stack: FastAPI backend in Docker → deployed on Render free tier. React frontend → Vercel. Vector DB (ChromaDB) runs embedded, no server needed. Local embeddings via sentence-transformers = zero per-query cost. Total monthly bill: ₹0.",
  },
  {
    date: "Jul 04, 2026",
    kind: "NOTES",
    title: "Transformers explained in 60 seconds",
    body: "Attention = every word looks at every other word and asks 'how relevant are you to me?' Those relevance scores decide what information flows forward. Stack this 30+ times with millions of learned weights and you get a model that captures grammar, facts and reasoning — all from predicting the next token.",
  },
  {
    date: "Jul 03, 2026",
    kind: "ROADMAP",
    title: "Zero-to-ML: the 6-month path I recommend",
    body: "Month 1-2: Python + linear algebra basics (DeepLearning.AI's course is enough). Month 3: classical ML with scikit-learn — build 3 small projects. Month 4-5: deep learning with PyTorch, understand backprop by coding it once. Month 6: deploy ONE real project end-to-end (FastAPI + Docker). Deployment teaches more than 10 tutorials.",
  },
];

// ————— Design tokens —————
const T = { ink: "#131A26", paper: "#F9FAFC", mist: "#E4E9F1", gray: "#5B6472" };
const MODES = {
  work: { accent: "#2547D0", label: "Work" },
  play: { accent: "#E8930C", label: "Play" },
  learn: { accent: "#7C3AED", label: "Learn" },
  hire: { accent: "#0E9F6E", label: "Hire me" },
};
const mono = { fontFamily: "'IBM Plex Mono', ui-monospace, monospace" };

// ————— Data —————
const ME = {
  name: "Mayank Kumar",
  title: "Machine Learning Engineer · Researcher",
  tagline:
    "ML Engineer with 3+ years building real-time, low-latency ML systems at scale — anomaly detection, agentic AI, and published research in adversarial ML.",
  email: "mayankrathor40@gmail.com",
  links: [
    { l: "LinkedIn", u: "https://www.linkedin.com/in/mayankkumariitj" },
    { l: "GitHub", u: "https://github.com/mayank1303" },
    { l: "Google Scholar", u: CONFIG.SCHOLAR_URL },
    { l: "Gmail", u: "mailto:mayankrathor40@gmail.com" },
  ],
};

const SKILLS = ["Python", "PyTorch", "LLM Agents", "RAG / MCP", "FastAPI", "Docker / Kafka", "LightGBM"];

const PROJECTS = [
  {
    name: "Stock Agent",
    skills: ["Python", "LLM Agents", "RAG / MCP", "FastAPI"],
    desc: "End-to-end agentic AI for real-time stock analysis: live NSE data, news retrieval, RAG over a 29,000+ chunk knowledge base, dual Claude + Ollama providers, multimodal chart analysis. Deployed to production.",
    link: CONFIG.GITHUB_STOCK_REPO,
    badge: "FEATURED",
  },
  {
    name: "Malware Scoring Pipeline",
    skills: ["Python", "LightGBM", "Docker / Kafka", "FastAPI"],
    desc: "Endpoint-compatible malware scoring using static PE/ELF analysis + LightGBM, low-latency pre-execution detection across 10,000+ endpoints at C-DOT. Cut false positives by 90%.",
    link: null,
    badge: "PRODUCTION",
  },
  {
    name: "Adversarial ML Research",
    skills: ["PyTorch", "Python"],
    desc: "Attacked Split Neural Networks & Federated Learning with data poisoning + white-box attacks (CIFAR-10, ResNet18). Led to 4 published papers on FL security.",
    link: CONFIG.SCHOLAR_URL,
    badge: "RESEARCH",
  },
  {
    name: "Spoken Language ID",
    skills: ["PyTorch", "Python"],
    desc: "X-vector system with MFCC features, 96% training accuracy. Built for the National Language Translation Mission at IIT Mandi, with a live demo GUI.",
    link: null,
    badge: "IIT MANDI",
  },
];

const PAPERS = [
  ["ICONIP 2022", "How does the Presence of Cognitive Biases in Phishing Emails Affect Human Decision-Making?"],
  ["SINCOF 2023", "BATFL: Battling Backdoor Attacks in Federated Learning"],
  ["SINCOF 2023", "RAFT: Evaluating Federated Learning Resilience Against Threats"],
  ["IJCNN 2023", "On Robustness of Split Neural Networks Against Data Poisoning Attacks"],
];

const TIMELINE = [
  ["2023 — Now", "Scientist B (Machine Learning Engineer), C-DOT Delhi", "Real-time anomaly detection, UEBA, malware scoring at national scale"],
  ["2021 — 2023", "M.Tech CSE, IIT Jammu", "CGPA 8.77 · adversarial ML & federated learning research"],
  ["2022", "AI Research Intern, IIT Mandi", "Spoken language identification (National Language Translation Mission)"],
  ["2016 — 2020", "B.Tech (Hons.) CSE, GEC Jhalawar", "Percentage 71.76"],
];

// All tracks: Kevin MacLeod (incompetech.com), Creative Commons BY 4.0 — attribution below.
const MUSIC_BY_MOOD = {
  Focus: [
    ["Deliberate Thought", "/music/focus-1.mp3"],
    ["At Rest", "/music/focus-2.mp3"],
  ],
  Chill: [
    ["Carefree", "/music/chill-1.mp3"],
    ["Local Forecast", "/music/chill-2.mp3"],
  ],
  Energy: [
    ["Sneaky Snitch", "/music/energy-1.mp3"],
    ["Merry Go", "/music/energy-2.mp3"],
  ],
  "Late night": [
    ["Airport Lounge", "/music/latenight-1.mp3"],
    ["Avant Jazz", "/music/latenight-2.mp3"],
  ],
};

const BIO_FOR_AI = `You are the AI assistant on Mayank Kumar's personal website. Answer questions about him concisely (2-4 sentences), in a friendly professional tone. Facts: Mayank Kumar is a Machine Learning Engineer (Scientist-B) at C-DOT Delhi since July 2023, with 3+ years experience in real-time low-latency ML systems: malware scoring with LightGBM on static PE/ELF analysis, UEBA anomaly detection (reduced false positives 90% using Isolation Forest), real-time pipelines with FastAPI/Docker/Kafka across 10,000+ endpoints. His flagship personal project is Stock Agent: an agentic AI system with live NSE market data, news retrieval, RAG over 29,000+ chunks (20+ PDFs/EPUBs, local embeddings, ChromaDB, OCR fallback), dual LLM providers (Claude API + Ollama) with live switching, MCP integration with Claude Desktop, multimodal chart analysis, FastAPI+React frontend deployed on Render/Vercel. Education: M.Tech CSE IIT Jammu (CGPA 8.77, 2021-23), B.Tech GEC Jhalawar. 4 published papers: phishing cognitive biases (ICONIP 2022), BATFL backdoor attacks in FL (SINCOF 2023), RAFT federated learning resilience (SINCOF 2023), Split NN robustness against data poisoning (IJCNN 2023). AI Research Intern at IIT Mandi 2022 (spoken language ID, X-vector, 96% accuracy). Skills: Python, R, C++, SQL, PyTorch, TensorFlow, LightGBM, scikit-learn, Claude API, Ollama, MCP, RAG, prompt engineering, FastAPI, Django, Flask, React, Docker, Kafka, PostgreSQL, OpenSearch, ChromaDB. Email: mayankrathor40@gmail.com. If asked something unrelated to Mayank, politely redirect to questions about him. Never make up facts not listed here.`;

// ————— AI helper: calls YOUR backend proxy (keeps your API key secret) —————
async function askClaude(messages, system) {
  if (!CONFIG.API_BASE) {
    return "The AI backend isn't connected yet — Mayank is setting it up! Meanwhile, check out his projects above or email him directly.";
  }
  const res = await fetch(`${CONFIG.API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system }),
  });
  const data = await res.json();
  return data.text;
}

// ————— Leaderboard (browser localStorage; see README for global version) —————
const LB_KEY = "mk-snake-leaderboard";
function loadLB() {
  try { return JSON.parse(localStorage.getItem(LB_KEY)) || []; } catch { return []; }
}
function saveLB(board) {
  try { localStorage.setItem(LB_KEY, JSON.stringify(board)); } catch {}
}

// ————— Snake game —————
const GRID = 13;
function SnakeGame({ accent, onGameOver }) {
  const [snake, setSnake] = useState([[6, 6]]);
  const [food, setFood] = useState([3, 3]);
  const [dir, setDir] = useState([0, -1]);
  const [alive, setAlive] = useState(true);
  const [score, setScore] = useState(0);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  const turn = useCallback((d) => {
    const cur = dirRef.current;
    if (d[0] === -cur[0] && d[1] === -cur[1]) return;
    setDir(d);
  }, []);

  useEffect(() => {
    const h = (e) => {
      const map = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
      if (map[e.key]) { e.preventDefault(); turn(map[e.key]); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [turn]);

  useEffect(() => {
    if (!alive) return;
    const iv = setInterval(() => {
      setSnake((s) => {
        const head = [s[0][0] + dirRef.current[0], s[0][1] + dirRef.current[1]];
        if (head[0] < 0 || head[0] >= GRID || head[1] < 0 || head[1] >= GRID ||
            s.some(([x, y]) => x === head[0] && y === head[1])) {
          setAlive(false);
          return s;
        }
        const ns = [head, ...s];
        if (head[0] === food[0] && head[1] === food[1]) {
          setScore((sc) => sc + 10);
          let f;
          do { f = [Math.floor(Math.random() * GRID), Math.floor(Math.random() * GRID)]; }
          while (ns.some(([x, y]) => x === f[0] && y === f[1]));
          setFood(f);
        } else ns.pop();
        return ns;
      });
    }, 160);
    return () => clearInterval(iv);
  }, [alive, food]);

  useEffect(() => { if (!alive) onGameOver(score); }, [alive]); // eslint-disable-line

  const cell = 100 / GRID;
  const dpad = { ...mono, fontSize: 18, width: 46, height: 46, borderRadius: 12, border: `1.5px solid ${T.mist}`, background: "#fff", cursor: "pointer", fontWeight: 700 };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ ...mono, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
        SCORE: <span style={{ color: accent }}>{score}</span> {!alive && " · GAME OVER"}
      </div>
      <div style={{ position: "relative", width: "min(300px, 78vw)", aspectRatio: "1", margin: "0 auto", background: "#fff", border: `2px solid ${T.ink}`, borderRadius: 10, overflow: "hidden" }}>
        {snake.map(([x, y], i) => (
          <div key={i} style={{ position: "absolute", left: `${x * cell}%`, top: `${y * cell}%`, width: `${cell}%`, height: `${cell}%`, background: i === 0 ? T.ink : accent, borderRadius: 3 }} />
        ))}
        <div style={{ position: "absolute", left: `${food[0] * cell}%`, top: `${food[1] * cell}%`, width: `${cell}%`, height: `${cell}%`, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>🍎</div>
        {!alive && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(249,250,252,.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ fontWeight: 900, fontSize: 22 }}>Game Over</div>
            <div style={{ ...mono, fontSize: 13 }}>Final: {score}</div>
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, marginTop: 12 }}>
        <button style={dpad} onClick={() => turn([0, -1])}>↑</button>
        <div style={{ display: "flex", gap: 5 }}>
          <button style={dpad} onClick={() => turn([-1, 0])}>←</button>
          <button style={dpad} onClick={() => turn([0, 1])}>↓</button>
          <button style={dpad} onClick={() => turn([1, 0])}>→</button>
        </div>
      </div>
    </div>
  );
}

// ————— Main site —————
export default function App() {
  const [mode, setMode] = useState("work");
  const [tab, setTab] = useState("stock");
  const [palette, setPalette] = useState(false);
  const [skill, setSkill] = useState(null);
  const [pets, setPets] = useState(0);
  const [openK, setOpenK] = useState(null);
  const accent = MODES[mode].accent;

  const [playing, setPlaying] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [lastScore, setLastScore] = useState(null);
  const [board, setBoard] = useState([]);
  const [nick, setNick] = useState("");
  const [saved, setSaved] = useState(false);

  const [roastKind, setRoastKind] = useState(null);
  const [roastText, setRoastText] = useState("");
  const [roastLoading, setRoastLoading] = useState(false);

  const [explainLevel, setExplainLevel] = useState(null);
  const explains = {
    "5-year-old": "AI is like teaching a puppy tricks — but the puppy is a computer. You show it lots and lots of examples, and slowly it learns to guess right on its own!",
    Student: "AI/ML is math that finds patterns in data. You feed a model examples, it adjusts millions of tiny numbers (weights) until its predictions get good. Deep learning stacks these into layers.",
    Engineer: "Modern AI = large neural nets trained via gradient descent on massive datasets. Transformers + attention dominate; the real engineering is data quality, evals, latency and deployment — which is exactly what Mayank works on.",
  };

  const [msgs, setMsgs] = useState([{ role: "assistant", content: "Hi! I'm Mayank's AI. Ask me anything about his projects, research, or experience — try \"what is the Stock Agent?\"" }]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEnd = useRef(null);

  const [dynamicPosts, setDynamicPosts] = useState([]);
  const [showAddPost, setShowAddPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "", kind: "NOTES", key: "" });
  const [addPostError, setAddPostError] = useState("");
  const [addPostLoading, setAddPostLoading] = useState(false);

  useEffect(() => {
    if (!CONFIG.API_BASE) return;
    fetch(`${CONFIG.API_BASE}/api/blog`).then((r) => r.json()).then(setDynamicPosts).catch(() => {});
  }, []);

  const submitPost = async () => {
    setAddPostError("");
    if (!newPost.title.trim() || !newPost.body.trim()) { setAddPostError("Title and body are required."); return; }
    setAddPostLoading(true);
    try {
      const res = await fetch(`${CONFIG.API_BASE}/api/blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Key": newPost.key },
        body: JSON.stringify({
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          kind: newPost.kind,
          title: newPost.title,
          body: newPost.body,
        }),
      });
      if (res.status === 401) { setAddPostError("Wrong admin key."); return; }
      if (!res.ok) { setAddPostError("Something went wrong — try again."); return; }
      setDynamicPosts(await res.json());
      setNewPost((p) => ({ ...p, title: "", body: "" }));
      setShowAddPost(false);
    } catch {
      setAddPostError("Network error — try again.");
    } finally {
      setAddPostLoading(false);
    }
  };

  const [nowPlaying, setNowPlaying] = useState(null); // track url currently playing, or null
  const audioRef = useRef(null);
  const toggleTrack = (url) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (nowPlaying === url) {
      audio.pause();
      setNowPlaying(null);
    } else {
      audio.src = url;
      audio.play();
      setNowPlaying(url);
    }
  };

  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setPalette((p) => !p); }
      if (e.key === "Escape") setPalette(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => { setBoard(loadLB()); }, []);

  const saveScore = () => {
    if (!nick.trim() || lastScore == null) return;
    let cur = loadLB();
    cur.push({ name: nick.trim().slice(0, 14), score: lastScore });
    cur.sort((a, b) => b.score - a.score);
    cur = cur.slice(0, 8);
    saveLB(cur);
    setBoard(cur);
    setSaved(true);
  };

  const doRoast = async (kind) => {
    setRoastKind(kind); setRoastLoading(true); setRoastText("");
    try {
      const txt = await askClaude(
        [{ role: "user", content: kind === "roast"
          ? "Write a short, playful, PG roast (2-3 sentences max) of a random website visitor who is probably a tech person. Be witty, never mean about identity. Just the roast, nothing else."
          : "Write a short, warm, genuinely uplifting compliment (2-3 sentences max) for a random website visitor, tech-flavored. Just the compliment, nothing else." }],
        "You are a witty entertainment feature on a personal website."
      );
      setRoastText(txt);
    } catch { setRoastText("The AI is napping — try again in a moment."); }
    setRoastLoading(false);
  };

  const sendChat = async () => {
    const q = input.trim();
    if (!q || chatLoading) return;
    const next = [...msgs, { role: "user", content: q }];
    setMsgs(next); setInput(""); setChatLoading(true);
    try {
      const reply = await askClaude(next.map(({ role, content }) => ({ role, content })), BIO_FOR_AI);
      setMsgs([...next, { role: "assistant", content: reply }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: "Connection hiccup — please try again." }]);
    }
    setChatLoading(false);
    setTimeout(() => chatEnd.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const commands = [
    ["→ Projects", () => { setMode("work"); setTimeout(() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }), 50); }],
    ["→ Journey & resume", () => { setMode("work"); setTimeout(() => document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" }), 50); }],
    ["→ Publications", () => { setMode("work"); setTimeout(() => document.getElementById("papers")?.scrollIntoView({ behavior: "smooth" }), 50); }],
    ["📚 Open the blog (Learn mode)", () => setMode("learn")],
    ["⌘ Switch to Hire mode", () => setMode("hire")],
    ["📈 Stock Agent (coming soon)", () => { setMode("play"); setTab("stock"); }],
    ["🎮 Play Snake", () => { setMode("play"); setTab("games"); setPlaying(true); setGameKey(k => k + 1); }],
    ["🔥 Roast me", () => { setMode("play"); setTab("roast"); }],
  ];

  const S = {
    label: { ...mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: accent, fontWeight: 600 },
    card: { background: "#fff", border: `1px solid ${T.mist}`, borderRadius: 14, padding: 20 },
    btn: (filled, c = accent) => ({
      ...mono, fontSize: 12, padding: "8px 15px", borderRadius: 999, cursor: "pointer", fontWeight: 600,
      border: `1.5px solid ${filled ? c : T.mist}`, background: filled ? c : "#fff", color: filled ? "#fff" : T.ink,
    }),
    wrap: { maxWidth: 960, margin: "0 auto", padding: "0 20px" },
  };

  return (
    <div style={{ background: T.paper, color: T.ink, minHeight: "100vh", fontFamily: "'Archivo', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; }
        body { background: ${T.paper}; }
        .lift { transition: transform .2s, box-shadow .2s; }
        .lift:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(19,26,38,.08); }
        @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3) rotate(-8deg)} }
        .pet-bounce { animation: bounce .4s; }
        @keyframes fadeIn { from{opacity:0; transform:translateY(6px)} to{opacity:1; transform:none} }
        .fade { animation: fadeIn .3s ease; }
        input:focus { outline: none; }
        @media (prefers-reduced-motion: reduce) { .lift, .fade, .pet-bounce { animation: none; transition: none; } }
      `}</style>

      {/* Command palette */}
      {palette && (
        <div onClick={() => setPalette(false)} style={{ position: "fixed", inset: 0, background: "rgba(19,26,38,.5)", zIndex: 50, display: "flex", justifyContent: "center", paddingTop: 90 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: "min(520px,92vw)", height: "fit-content", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
            <div style={{ ...mono, fontSize: 13, padding: "14px 18px", borderBottom: `1px solid ${T.mist}`, color: T.gray }}>
              Quick actions <span style={{ float: "right", fontSize: 10.5 }}>ESC</span>
            </div>
            {commands.map(([c, fn]) => (
              <div key={c} onClick={() => { fn(); setPalette(false); }} style={{ padding: "12px 18px", fontSize: 14, cursor: "pointer", borderBottom: `1px solid ${T.paper}` }}>
                {c}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(249,250,252,.92)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${T.mist}` }}>
        <div style={{ ...S.wrap, display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <span style={{ fontWeight: 900, fontSize: 18 }}>MK<span style={{ color: accent }}>.</span></span>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <button style={S.btn(false)} onClick={() => setPalette(true)}>⌘K</button>
            {Object.keys(MODES).map((m) => (
              <button key={m} onClick={() => setMode(m)} style={S.btn(mode === m, MODES[m].accent)}>{MODES[m].label}</button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header style={{ ...S.wrap, padding: mode === "hire" ? "44px 20px 36px" : "60px 20px 44px" }}>
        <p style={S.label}>{mode === "hire" ? "Open to opportunities" : mode === "learn" ? "AI/ML Blog — one new topic daily" : mode === "play" ? "The Playground — have fun" : ME.title}</p>
        <h1 style={{ fontSize: "clamp(36px,8vw,64px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05, margin: "12px 0 16px" }}>
          {ME.name}<span style={{ color: accent }}>.</span>
        </h1>
        {mode === "hire" ? (
          <>
            <p style={{ fontSize: 16, color: T.gray, maxWidth: 560, lineHeight: 1.6, marginBottom: 18 }}>{ME.tagline}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a href={`mailto:${ME.email}`} style={{ ...S.btn(true), textDecoration: "none", display: "inline-block" }}>Email me ↗</a>
              <a href={ME.links[0].u} target="_blank" rel="noreferrer" style={{ ...S.btn(false), textDecoration: "none", display: "inline-block" }}>LinkedIn ↗</a>
              <a href={CONFIG.RESUME_PDF} download style={{ ...S.btn(false), textDecoration: "none", display: "inline-block" }}>Resume PDF ↓</a>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: 16.5, color: T.gray, maxWidth: 560, lineHeight: 1.6 }}>
              {mode === "learn"
                ? "Everything I'm learning about AI/ML — one short, practical post a day. From production ML at C-DOT to agentic AI experiments."
                : mode === "play"
                ? "You found the fun side. Play Snake, get roasted by AI, pick music for your mood, or chat with my AI. Stock Agent demo is coming soon. Don't forget to pet the dog. 🐕"
                : ME.tagline}
            </p>
            {mode !== "play" && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
                {ME.links.map((x) => (
                  <a key={x.l} href={x.u} target="_blank" rel="noreferrer" className="lift" style={{ ...S.btn(false), textDecoration: "none", display: "inline-block" }}>
                    {x.l} ↗
                  </a>
                ))}
              </div>
            )}
            {mode === "work" && (
              <p style={{ ...mono, fontSize: 12, color: T.gray, marginTop: 24 }}>
                <span style={{ color: accent }}>●</span> Now: Scientist B (Machine Learning Engineer) @ C-DOT · building Stock Agent
              </p>
            )}
          </>
        )}
      </header>

      {/* Projects + journey + papers — Work & Hire */}
      {(mode === "work" || mode === "hire") && (<>
      <section id="projects" style={{ ...S.wrap, paddingBottom: 44 }}>
        <p style={S.label}>{mode === "hire" ? "Top projects" : "Projects — click a skill to filter"}</p>
        {mode === "work" && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "14px 0" }}>
            {SKILLS.map((s) => (
              <button key={s} onClick={() => setSkill(skill === s ? null : s)} style={S.btn(skill === s)}>{s}</button>
            ))}
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14, marginTop: mode === "hire" ? 14 : 0 }}>
          {(mode === "hire" ? PROJECTS.slice(0, 2) : PROJECTS).map((p) => {
            const hit = skill && p.skills.includes(skill);
            const dim = skill && !hit;
            return (
              <div key={p.name} className="lift" style={{ ...S.card, opacity: dim ? 0.35 : 1, border: hit ? `2px solid ${accent}` : `1px solid ${T.mist}`, transition: "opacity .25s,border .25s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{p.name}</h3>
                  <span style={{ ...mono, fontSize: 9.5, fontWeight: 600, color: accent }}>{p.badge}</span>
                </div>
                <p style={{ fontSize: 13.5, color: T.gray, lineHeight: 1.55, marginBottom: 12 }}>{p.desc}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {p.skills.map((t) => (
                    <span key={t} style={{ ...mono, fontSize: 10, padding: "4px 9px", borderRadius: 999, background: t === skill ? accent : T.mist, color: t === skill ? "#fff" : T.ink, fontWeight: 600 }}>{t}</span>
                  ))}
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" style={{ ...mono, fontSize: 10.5, color: accent, fontWeight: 600, marginLeft: "auto", textDecoration: "none" }}>VIEW ↗</a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="resume" style={{ ...S.wrap, paddingBottom: 44 }}>
        <p style={S.label}>Journey</p>
        <div style={{ ...S.card, marginTop: 14, padding: 0, overflow: "hidden" }}>
          {TIMELINE.map(([when, what, detail], i) => (
            <div key={what} style={{ display: "flex", gap: 14, padding: "15px 20px", borderTop: i ? `1px solid ${T.mist}` : "none" }}>
              <span style={{ ...mono, fontSize: 10.5, color: accent, fontWeight: 600, minWidth: 86, paddingTop: 2 }}>{when}</span>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700 }}>{what}</div>
                <div style={{ fontSize: 12.5, color: T.gray, marginTop: 2 }}>{detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="papers" style={{ ...S.wrap, paddingBottom: 48 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", borderTop: `1px solid ${T.mist}`, padding: "14px 4px 4px" }}>
          <span style={{ ...mono, fontSize: 11, fontWeight: 600, color: T.gray }}>PUBLICATIONS ({PAPERS.length})</span>
          <a href={CONFIG.SCHOLAR_URL} target="_blank" rel="noreferrer" style={{ ...S.btn(false), marginLeft: "auto", textDecoration: "none" }}>Google Scholar ↗</a>
        </div>
        {PAPERS.map(([venue, title]) => (
          <div key={title} style={{ display: "flex", gap: 12, padding: "11px 4px", borderBottom: `1px solid ${T.mist}`, alignItems: "baseline" }}>
            <span style={{ ...mono, fontSize: 10, color: accent, fontWeight: 600, minWidth: 88 }}>{venue}</span>
            <span style={{ fontSize: 13.5, lineHeight: 1.5 }}>{title}</span>
          </div>
        ))}
      </section>
      </>)}

      {/* Blog — Learn mode */}
      {mode === "learn" && (
        <section id="knowledge" style={{ ...S.wrap, paddingBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <p style={S.label}>Latest posts — new topic every day</p>
            <button
              onClick={() => setShowAddPost((s) => !s)}
              title="Add a post (admin key required)"
              style={{ ...mono, fontSize: 16, fontWeight: 700, width: 28, height: 28, borderRadius: "50%", border: `1.5px solid ${T.mist}`, background: T.paper, color: accent, cursor: "pointer", lineHeight: "26px", padding: 0 }}
            >
              +
            </button>
          </div>

          {showAddPost && (
            <div className="fade" style={{ ...S.card, marginTop: 10, padding: 16 }}>
              <p style={{ fontSize: 11.5, color: T.gray, marginBottom: 10 }}>Add a post — requires the admin key.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input
                  type="password"
                  placeholder="Admin key"
                  value={newPost.key}
                  onChange={(e) => setNewPost((p) => ({ ...p, key: e.target.value }))}
                  style={{ ...mono, fontSize: 12, padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${T.mist}` }}
                />
                <select
                  value={newPost.kind}
                  onChange={(e) => setNewPost((p) => ({ ...p, kind: e.target.value }))}
                  style={{ ...mono, fontSize: 12, padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${T.mist}` }}
                >
                  {["NOTES", "GUIDE", "ROADMAP", "STARTER KIT"].map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
                <input
                  placeholder="Title"
                  value={newPost.title}
                  onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                  style={{ fontSize: 13, padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${T.mist}` }}
                />
                <textarea
                  placeholder="Body"
                  rows={4}
                  value={newPost.body}
                  onChange={(e) => setNewPost((p) => ({ ...p, body: e.target.value }))}
                  style={{ fontSize: 13, padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${T.mist}`, fontFamily: "inherit", resize: "vertical" }}
                />
                {addPostError && <p style={{ fontSize: 12, color: "#D23B2E" }}>{addPostError}</p>}
                <button onClick={submitPost} disabled={addPostLoading} style={S.btn(true, accent)}>
                  {addPostLoading ? "Posting…" : "Publish"}
                </button>
              </div>
            </div>
          )}

          <div style={{ ...S.card, marginTop: 14, padding: 0, overflow: "hidden" }}>
            {[...dynamicPosts, ...KNOWLEDGE].map((k, i) => (
              <div key={`${i}-${k.title}`} style={{ borderTop: i ? `1px solid ${T.mist}` : "none" }}>
                <div
                  onClick={() => setOpenK(openK === i ? null : i)}
                  style={{ display: "flex", gap: 14, alignItems: "center", padding: "15px 20px", cursor: "pointer" }}
                >
                  <div style={{ minWidth: 78 }}>
                    <div style={{ ...mono, fontSize: 9.5, color: accent, fontWeight: 600 }}>{k.kind}</div>
                    <div style={{ ...mono, fontSize: 9, color: T.gray, marginTop: 2 }}>{k.date}</div>
                  </div>
                  <span style={{ fontSize: 14.5, fontWeight: 600, flex: 1 }}>
                    {i === 0 && <span style={{ ...mono, fontSize: 8.5, background: accent, color: "#fff", borderRadius: 999, padding: "2px 7px", marginRight: 8, verticalAlign: "middle" }}>NEW</span>}
                    {k.title}
                  </span>
                  <span style={{ color: T.gray, transform: openK === i ? "rotate(90deg)" : "none", transition: "transform .2s" }}>→</span>
                </div>
                {openK === i && (
                  <div className="fade" style={{ padding: "0 20px 16px 112px", fontSize: 13.5, color: T.gray, lineHeight: 1.65 }}>
                    {k.body}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Playground — Play mode */}
      {mode === "play" && (
        <section id="playground" style={{ ...S.wrap, paddingBottom: 60 }}>
          <p style={{ ...S.label, color: MODES.play.accent }}>Playground</p>
          <div style={{ display: "flex", gap: 8, margin: "14px 0", flexWrap: "wrap" }}>
            {[["stock", "📈 Stock Agent"], ["games", "🎮 Snake"], ["roast", "🔥 Roast me"], ["explain", "🧠 Explain AI"], ["music", "🎧 Music"], ["chat", "💬 Ask my AI"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={S.btn(tab === k, MODES.play.accent)}>{l}</button>
            ))}
          </div>

          <div style={{ ...S.card, minHeight: 200 }}>
            {tab === "stock" && (
              <div style={{ textAlign: "center", padding: 12 }}>
                <div style={{ fontSize: 40 }}>📈</div>
                <p style={{ fontWeight: 800, fontSize: 18, margin: "10px 0 6px" }}>Stock Agent</p>
                <p style={{ fontSize: 13.5, color: T.gray, maxWidth: 460, margin: "0 auto 8px", lineHeight: 1.6 }}>
                  My flagship project, running in production: ask it about live NSE stocks, upload chart images for analysis, or query my 29,000-chunk knowledge base. Dual Claude + Ollama brains.
                </p>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", margin: "12px 0 16px" }}>
                  {["Live NSE data", "RAG", "MCP", "Multimodal"].map((t) => (
                    <span key={t} style={{ ...mono, fontSize: 10, padding: "4px 10px", borderRadius: 999, background: T.mist, fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
                <span style={{ ...mono, fontSize: 12, padding: "10px 20px", borderRadius: 999, background: T.mist, color: T.gray, fontWeight: 700, display: "inline-block" }}>
                  🚧 Coming soon — redeploying
                </span>
              </div>
            )}

            {tab === "games" && (
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
                <div style={{ flex: "1 1 280px", maxWidth: 360 }}>
                  {!playing ? (
                    <div style={{ textAlign: "center", padding: 20 }}>
                      <div style={{ fontSize: 44 }}>🐍</div>
                      <p style={{ fontWeight: 800, margin: "8px 0 4px" }}>Snake</p>
                      <p style={{ fontSize: 12.5, color: T.gray, marginBottom: 14 }}>Arrow keys or the on-screen pad</p>
                      <button style={S.btn(true, MODES.play.accent)} onClick={() => { setPlaying(true); setLastScore(null); setSaved(false); setNick(""); setGameKey(k => k + 1); }}>
                        ▶ Start game
                      </button>
                    </div>
                  ) : (
                    <>
                      <SnakeGame key={gameKey} accent={MODES.play.accent} onGameOver={(s) => setLastScore(s)} />
                      {lastScore != null && (
                        <div className="fade" style={{ marginTop: 12, textAlign: "center" }}>
                          {!saved ? (
                            <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                              <input value={nick} onChange={(e) => setNick(e.target.value)} placeholder="Your name"
                                style={{ ...mono, fontSize: 12, padding: "8px 12px", borderRadius: 999, border: `1.5px solid ${T.mist}` }} />
                              <button style={S.btn(true, MODES.play.accent)} onClick={saveScore}>Save score</button>
                              <button style={S.btn(false)} onClick={() => { setLastScore(null); setSaved(false); setGameKey(k => k + 1); }}>↻ Retry</button>
                            </div>
                          ) : (
                            <button style={S.btn(true, MODES.play.accent)} onClick={() => { setLastScore(null); setSaved(false); setGameKey(k => k + 1); }}>↻ Play again</button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div style={{ flex: "1 1 200px", maxWidth: 280 }}>
                  <div style={{ ...mono, fontSize: 11, fontWeight: 600, color: T.gray, marginBottom: 10 }}>🏆 LEADERBOARD</div>
                  {board.length === 0 && <div style={{ fontSize: 13, color: T.gray }}>No scores yet — be the first!</div>}
                  {board.map((r, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "8px 4px", borderTop: i ? `1px solid ${T.mist}` : "none", fontSize: 13.5 }}>
                      <span style={{ ...mono, width: 24, color: i < 3 ? MODES.play.accent : T.gray, fontWeight: 600 }}>#{i + 1}</span>
                      <span style={{ flex: 1, fontWeight: 600 }}>{r.name}</span>
                      <span style={mono}>{r.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "roast" && (
              <div style={{ textAlign: "center", padding: 8 }}>
                <div style={{ fontSize: 34 }}>🎭</div>
                <p style={{ fontWeight: 700, margin: "8px 0 4px" }}>AI Roast or Compliment?</p>
                <p style={{ fontSize: 12.5, color: T.gray }}>Freshly generated by AI, every time.</p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 14 }}>
                  <button onClick={() => doRoast("roast")} style={S.btn(roastKind === "roast", "#D23B2E")} disabled={roastLoading}>🔥 Roast me</button>
                  <button onClick={() => doRoast("compliment")} style={S.btn(roastKind === "compliment", MODES.hire.accent)} disabled={roastLoading}>✨ Compliment me</button>
                </div>
                {(roastLoading || roastText) && (
                  <div className="fade" style={{ marginTop: 16, background: T.paper, borderRadius: 12, padding: 16, fontSize: 14.5, lineHeight: 1.6, maxWidth: 480, margin: "16px auto 0" }}>
                    {roastLoading ? "Thinking of something good…" : roastText}
                  </div>
                )}
              </div>
            )}

            {tab === "explain" && (
              <div style={{ padding: 6 }}>
                <p style={{ fontWeight: 700, textAlign: "center" }}>🧠 Explain AI to me like I'm…</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 14 }}>
                  {Object.keys(explains).map((lvl) => (
                    <button key={lvl} onClick={() => setExplainLevel(lvl)} style={S.btn(explainLevel === lvl, MODES.play.accent)}>{lvl}</button>
                  ))}
                </div>
                {explainLevel && (
                  <div className="fade" style={{ marginTop: 16, background: T.paper, borderRadius: 12, padding: 16, fontSize: 14.5, lineHeight: 1.65 }}>
                    {explains[explainLevel]}
                  </div>
                )}
              </div>
            )}

            {tab === "music" && (
              <div style={{ padding: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 34 }}>🎧</div>
                  <p style={{ fontWeight: 700, marginTop: 8 }}>Music by mood</p>
                  <p style={{ fontSize: 12.5, color: T.gray, marginBottom: 14 }}>Plays right here, no tab-out</p>
                </div>
                <audio
                  ref={audioRef}
                  onEnded={() => setNowPlaying(null)}
                  style={{ display: "none" }}
                />
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
                  {Object.entries(MUSIC_BY_MOOD).map(([mood, tracks]) => (
                    <div key={mood} style={{ flex: "1 1 220px", maxWidth: 260 }}>
                      <p style={{ ...mono, fontSize: 11, fontWeight: 700, color: MODES.play.accent, marginBottom: 8 }}>{mood.toUpperCase()}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {tracks.map(([title, url]) => (
                          <button key={url} onClick={() => toggleTrack(url)}
                            style={{
                              ...mono, fontSize: 13, color: "inherit", textAlign: "left", cursor: "pointer",
                              padding: "8px 10px", borderRadius: 10, border: "none",
                              background: nowPlaying === url ? MODES.play.accent : T.paper,
                              fontWeight: nowPlaying === url ? 700 : 400,
                            }}>
                            {nowPlaying === url ? "⏸" : "▶"} {title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 10.5, color: T.gray, textAlign: "center", marginTop: 18 }}>
                  Music by Kevin MacLeod (incompetech.com), licensed under{" "}
                  <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
                    CC BY 4.0
                  </a>.
                </p>
              </div>
            )}

            {tab === "chat" && (
              <div>
                <div style={{ maxHeight: 260, overflowY: "auto", marginBottom: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                  {msgs.map((m, i) => (
                    <div key={i} style={{
                      alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                      background: m.role === "user" ? MODES.play.accent : T.paper,
                      color: m.role === "user" ? "#fff" : T.ink,
                      borderRadius: 12, padding: "10px 14px", fontSize: 14, lineHeight: 1.55, maxWidth: "85%",
                    }}>
                      {m.content}
                    </div>
                  ))}
                  {chatLoading && <div style={{ ...mono, fontSize: 12, color: T.gray }}>typing…</div>}
                  <div ref={chatEnd} />
                </div>
                <div style={{ display: "flex", gap: 8, border: `1.5px solid ${T.mist}`, borderRadius: 999, padding: "5px 5px 5px 16px" }}>
                  <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()}
                    placeholder="Ask about Mayank…" style={{ flex: 1, border: "none", background: "transparent", fontSize: 14, fontFamily: "inherit" }} />
                  <button style={S.btn(true, MODES.play.accent)} onClick={sendChat} disabled={chatLoading}>Send</button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Pet dog */}
      <div
        onClick={(e) => {
          setPets(pets + 1);
          e.currentTarget.classList.remove("pet-bounce");
          void e.currentTarget.offsetWidth;
          e.currentTarget.classList.add("pet-bounce");
        }}
        style={{ position: "fixed", bottom: 18, right: 18, cursor: "pointer", textAlign: "center", zIndex: 20, userSelect: "none" }}
        title="Pet me!"
      >
        <div style={{ fontSize: 36, filter: "drop-shadow(0 4px 8px rgba(0,0,0,.15))" }}>{pets >= 10 ? "🐕‍🦺" : "🐕"}</div>
        {pets > 0 && (
          <div style={{ ...mono, fontSize: 9.5, background: "#fff", border: `1px solid ${T.mist}`, borderRadius: 999, padding: "2px 8px", marginTop: 3, fontWeight: 600 }}>
            ❤️ {pets}{pets >= 10 ? " BFF!" : ""}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${T.mist}`, padding: "26px 0 38px" }}>
        <div style={{ ...S.wrap, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ ...mono, fontSize: 11.5, color: T.gray }}>© 2026 MAYANK KUMAR — PRESS CTRL+K</span>
          <a href={`mailto:${ME.email}`} style={{ ...mono, fontSize: 11.5, color: accent, fontWeight: 600, textDecoration: "none" }}>
            MAYANKRATHOR40@GMAIL.COM ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
