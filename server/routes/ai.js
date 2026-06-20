/* AI proxy — College Parichay's own assistant, powered by Groq.
   The Groq API key never leaves the server: the browser talks only to these
   endpoints. /chat streams tokens back as Server-Sent Events; /title returns a
   short auto-generated conversation title. Both require a logged-in user. */
import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions";
const TITLE_MODEL = process.env.GROQ_TITLE_MODEL || "llama-3.1-8b-instant";

/* Subject-routed models — one Groq key, the right model per question.
   Each id is env-overridable so we can swap it if Groq renames/retires one.
     • math / engineering / reasoning → DeepSeek-R1 (deep step-by-step working)
     • coding / programming           → Qwen 3 (strong code + explanations)
     • everything else                → Llama 3.3 70B (fast, well-rounded) */
const MODELS = {
  search:  process.env.GROQ_MODEL_SEARCH  || "groq/compound",          // built-in web search
  math:    process.env.GROQ_MODEL_MATH    || "deepseek-r1-distill-llama-70b",
  code:    process.env.GROQ_MODEL_CODE    || "qwen/qwen3-32b",
  general: process.env.GROQ_MODEL_GENERAL || process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
};

/* Live-data questions (admissions, cutoffs, placements, exam stats/dates) — route
   to a web-search-capable model so answers reflect current reality, not training. */
const SEARCH_RE = /\b(jee|neet|iit|nit|iiit|bits|cutoff|cut-off|cut off|rank|closing rank|opening rank|placement|package|lpa|admission|counsell?ing|josaa|csab|seat matrix|seats?|fees?|nirf|college|eligibilit|eligible|notification|registration|application|exam date|result|answer key|merit list|how many|number of (students|candidates|applicants)|applicants|appear(ed|ing)?|vacanc|scholarship|hostel|predictor|this year|latest|current|recent)\b/;
const CODE_RE = /\b(code|coding|program|programming|python|javascript|typescript|java|c\+\+|c#|golang|rust|sql|html|css|react|node|api|function|algorithm|data structure|recursion|loop|array|pointer|compile|syntax|runtime error|stack trace|debug|leetcode|oop|class|inheritance|regex|bug|terminal|git)\b/;
const MATH_RE = /\b(matrix|matrices|determinant|probability|permutation|combination|equation|inequalit|theorem|circuit|kirchhoff|physics|chemistry|thermodynamics|calculus|vector|trigonometr|algebra|geometry|limit|series|kinematics|electromagnet|capacitor|resistor|mole|stoichiometr|numerical)\b/;
/* strong "solve this problem" intent — keeps real numericals on the reasoning
   model even when they mention JEE/IIT (which would otherwise hit web search). */
const SOLVE_RE = /\b(solve|simplify|evaluate|calculate|integrate|differentiate|derive|prove|compute|find the|value of|roots? of)\b/;

/* Per-mode display label + generation tuning. Maths/code run cooler for
   accuracy; the cap keeps latency and token cost in check. */
const MODE_META = {
  search:  { label: "Web search", model: MODELS.search,  temp: 0.5, maxTokens: 2048 },
  math:    { label: "Reasoning",  model: MODELS.math,     temp: 0.3, maxTokens: 3072 },
  code:    { label: "Coding",     model: MODELS.code,     temp: 0.3, maxTokens: 3072 },
  general: { label: "Chat",       model: MODELS.general,  temp: 0.6, maxTokens: 2048 },
};

/* Choose the Groq model from the latest user message. Web-search wins first so
   exam / college / cutoff queries get fresh data even if they also look mathy. */
function pickMode(text = "") {
  const t = text.toLowerCase();
  const solvey = SOLVE_RE.test(t) || /[∫∑√π∞≤≥×÷]|\\frac|\\int|\\sqrt|\\sum|\\theta/.test(text);
  if (SEARCH_RE.test(t) && !solvey) return "search";   // admissions/data — unless it's a problem to solve
  if (CODE_RE.test(t)) return "code";
  if (solvey || MATH_RE.test(t)) return "math";
  return "general";
}

/* Today's date in IST so the assistant grounds "this year" / cutoff reasoning. */
function todayIST() {
  return new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata", day: "numeric", month: "long", year: "numeric",
  });
}

/* Reasoning models (DeepSeek-R1, Qwen 3) stream their chain-of-thought wrapped
   in <think>…</think>. Strip it so students see only the final answer. The
   filter is stateful and tolerant of tags split across streamed chunks. */
function makeThinkStripper() {
  const OPEN = "<think>", CLOSE = "</think>";
  let inside = false, pending = "";
  const partialTail = (s, tag) => {
    const max = Math.min(s.length, tag.length - 1);
    for (let k = max; k > 0; k--) if (tag.startsWith(s.slice(s.length - k))) return k;
    return 0;
  };
  return {
    push(chunk) {
      let s = pending + chunk; pending = ""; let out = "";
      while (s) {
        if (!inside) {
          const idx = s.indexOf(OPEN);
          if (idx === -1) { const k = partialTail(s, OPEN); out += s.slice(0, s.length - k); pending = s.slice(s.length - k); break; }
          out += s.slice(0, idx); s = s.slice(idx + OPEN.length); inside = true;
        } else {
          const idx = s.indexOf(CLOSE);
          if (idx === -1) { const k = partialTail(s, CLOSE); pending = s.slice(s.length - k); break; }
          s = s.slice(idx + CLOSE.length); inside = false;
        }
      }
      return out;
    },
    flush() { const out = inside ? "" : pending; pending = ""; return out; },
  };
}

const SYSTEM_PROMPT = `You are College Parichay AI, an expert educational assistant specializing in engineering, science, programming, college admissions, placements, and career guidance.

Core Principles:

1. Always answer the user's question directly before giving extra details.

2. Be accurate and honest.
   - If information is uncertain, say so.
   - FACTS vs REASONING vs STATISTICS: facts and figures must come from provided data or web-search results; reasoning and explanations you may generate yourself; statistics must NEVER be generated without evidence.
   - Never invent or guess official statistics — exam registration / candidate / applicant counts, cutoffs, closing ranks, placement numbers, percentages, rankings or dates — and never build a table of made-up numbers.
   - For an official statistic with no verified source in front of you: state plainly that you cannot confirm the exact figure and that it should be taken from the official report (jeeadv.ac.in, josaa.nic.in, nta.ac.in, etc.). You MAY add a broad historical RANGE only if you genuinely know it from past years, clearly labelled as approximate (e.g. "historically ~1.5–2.0 lakh candidates appear; the exact 2025 figure must be verified officially"). Never present such a range as the confirmed answer, and never output a single fabricated exact number.
   - Estimates are allowed only for genuinely predictive / non-official questions (e.g. a likely future trend), and must be clearly labelled with the reasoning. Never dead-end with a bare "I don't know" — give the honest framing plus whatever verified context or clearly-labelled range you can.
   - FACT-CHECK before sending: if your answer contains any number, percentage, ranking, registration count or statistic, confirm it came from provided data or search results. If it did not, do not state it as a fact — express the uncertainty instead.

3. For academic questions:
   - Explain concepts step by step.
   - Use simple language first, then add technical depth.
   - Show formulas when relevant.
   - Show all calculation steps for numerical problems, and verify the final answer.
   - Provide examples whenever possible.

4. For programming questions:
   - Give working code in a fenced block with a language tag.
   - Explain the code line by line when useful.
   - Mention common mistakes.
   - Prefer clean and modern coding practices.

5. For engineering questions:
   - Explain theory, formulas, and practical applications.
   - Connect concepts to real-world engineering use cases.

6. For college admissions:
   - Provide eligibility, exam details, admission process, fees, placements, and cutoffs when available.
   - Distinguish between official information and estimates, and mention important assumptions.
   - For future-year queries (e.g. "JEE Advanced 2027", "IIT Bombay CSE cutoff 2028"), note the exact data cannot exist yet, then project from recent trends as a clearly-labelled estimate.

7. Response Structure:
   - Direct Answer
   - Explanation
   - Example (if applicable)
   - Key Takeaways
   (For pure derivations, follow the natural step-by-step style.)

8. Formatting:
   - Use Markdown: headings and bullet points.
   - Use tables for comparisons.
   - Use code blocks for code.
   - Write ALL mathematics in LaTeX — $...$ for inline and $$...$$ for display equations — using real commands (\\frac{a}{b}, x^{2}, x_{n}, \\sqrt{x}, \\theta, \\pi, \\sum, \\int, \\leq, \\geq). Never write raw "x^2", "sqrt(x)" or Unicode math glyphs outside LaTeX.

9. User Experience:
   - Be concise for simple questions, detailed for complex ones.
   - Ask clarifying questions when needed.
   - Maintain context from previous messages.

10. Never respond with: only "I don't know", vague answers, or unexplained conclusions.

If the user asks for the latest information, use any web-search results provided to you — prefer and cite them over memory, noting the year/source (jeeadv.ac.in, josaa.nic.in, nta.ac.in, etc.). If current data is unavailable, clearly state the limitation and provide the best available explanation or estimate.`;

/* keep payloads sane: cap how much history & text we forward to Groq */
function sanitizeMessages(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-24) // last 24 turns of memory
    .map((m) => ({ role: m.role, content: m.content.slice(0, 24000) }));
}

/* ── POST /api/ai/chat — streamed completion (SSE) ── */
router.post("/chat", requireAuth, async (req, res) => {
  const messages = sanitizeMessages(req.body?.messages);
  const temperature = Math.min(1.2, Math.max(0, Number(req.body?.temperature) || 0.6));
  if (!messages.length) return res.status(400).json({ error: "No messages provided." });
  if (!process.env.GROQ_API_KEY) return res.status(503).json({ error: "AI is not configured on the server." });

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  const controller = new AbortController();
  // Abort the upstream call only if the *client* disconnects mid-stream — not
  // when the request body finishes (req 'close' fires early on Node 18+/20+).
  res.on("close", () => { if (!res.writableEnded) controller.abort(); });

  // Route to the best model for the latest question (search / math / code / general).
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const mode = pickMode(lastUser);
  const meta = MODE_META[mode];
  // Respect a caller-supplied temperature, else use the mode's tuned default.
  const temp = req.body?.temperature != null ? temperature : meta.temp;
  const sys = `${SYSTEM_PROMPT}\n\nToday's date is ${todayIST()}. Treat any later year as the future.`;

  const callGroq = (model) => fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature: temp,
      max_tokens: meta.maxTokens,
      stream: true,
      messages: [{ role: "system", content: sys }, ...messages],
    }),
    signal: controller.signal,
  });

  // Stream one model's completion to the client, dropping any <think>…</think>
  // reasoning. Returns whether it produced visible content, so a routed model
  // that streams nothing usable (e.g. web-search model returns only tool steps)
  // can transparently fall back to the general model.
  const streamGroq = async (model) => {
    let upstream;
    try { upstream = await callGroq(model); }
    catch (e) { if (controller.signal.aborted) throw e; return { emitted: false }; }
    if (!upstream.ok || !upstream.body) { await upstream.text?.().catch(() => {}); return { emitted: false }; }

    const strip = makeThinkStripper();
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "", emitted = false;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") continue;
        try {
          const json = JSON.parse(payload);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) {
            const clean = strip.push(delta);
            if (clean) { res.write(`data: ${JSON.stringify({ delta: clean })}\n\n`); emitted = true; }
          }
        } catch { /* ignore keep-alive / partial frames */ }
      }
    }
    const tail = strip.flush();
    if (tail) { res.write(`data: ${JSON.stringify({ delta: tail })}\n\n`); emitted = true; }
    return { emitted };
  };

  try {
    // Tell the client which engine is answering (drives the live mode badge).
    res.write(`event: meta\ndata: ${JSON.stringify({ mode, label: meta.label })}\n\n`);

    let { emitted } = await streamGroq(meta.model);

    // If the routed model was unavailable or streamed nothing usable, fall back.
    if (!emitted && meta.model !== MODELS.general) {
      res.write(`event: meta\ndata: ${JSON.stringify({ mode: "general", label: MODE_META.general.label })}\n\n`);
      ({ emitted } = await streamGroq(MODELS.general));
    }

    if (!emitted) {
      res.write(`event: error\ndata: ${JSON.stringify({ error: "The AI returned an empty response — please try again." })}\n\n`);
    }
    res.write("event: done\ndata: {}\n\n");
    res.end();
  } catch (e) {
    if (controller.signal.aborted) return res.end();
    res.write(`event: error\ndata: ${JSON.stringify({ error: "AI request failed.", detail: String(e?.message || e).slice(0, 200) })}\n\n`);
    res.end();
  }
});

/* ── POST /api/ai/title — short conversation title ── */
router.post("/title", requireAuth, async (req, res) => {
  const first = String(req.body?.prompt || "").slice(0, 1000);
  if (!first.trim()) return res.json({ title: "New chat" });
  if (!process.env.GROQ_API_KEY) return res.json({ title: "New chat" });
  try {
    const r = await fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: TITLE_MODEL,
        temperature: 0.3,
        max_tokens: 20,
        messages: [
          { role: "system", content: "Reply with ONLY a 2-5 word title (no quotes, no punctuation at the end) summarising the user's message." },
          { role: "user", content: first },
        ],
      }),
    });
    const data = await r.json();
    let title = data.choices?.[0]?.message?.content?.trim() || "New chat";
    title = title.replace(/^["'#\s]+|["'.\s]+$/g, "").slice(0, 48);
    res.json({ title: title || "New chat" });
  } catch {
    res.json({ title: "New chat" });
  }
});

/* ── POST /api/ai/followups — 3 suggested next questions for the chips ── */
router.post("/followups", requireAuth, async (req, res) => {
  const question = String(req.body?.question || "").slice(0, 1500);
  const answer   = String(req.body?.answer || "").slice(0, 3000);
  if (!question.trim() || !process.env.GROQ_API_KEY) return res.json({ followups: [] });
  try {
    const r = await fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: TITLE_MODEL,
        temperature: 0.5,
        max_tokens: 120,
        messages: [
          { role: "system", content: "You suggest what a student might naturally ask next. Reply with ONLY a JSON array of exactly 3 short follow-up questions (each under 9 words), no prose, no numbering." },
          { role: "user", content: `Question: ${question}\n\nAnswer: ${answer}\n\nGive 3 follow-up questions as a JSON array.` },
        ],
      }),
    });
    const data = await r.json();
    const raw = data.choices?.[0]?.message?.content || "[]";
    let followups = [];
    try {
      const match = raw.match(/\[[\s\S]*\]/);
      followups = JSON.parse(match ? match[0] : raw);
    } catch { followups = []; }
    followups = (Array.isArray(followups) ? followups : [])
      .filter((q) => typeof q === "string" && q.trim())
      .map((q) => q.trim().replace(/^["'\d.\s-]+/, "").slice(0, 90))
      .slice(0, 3);
    res.json({ followups });
  } catch {
    res.json({ followups: [] });
  }
});

export default router;
