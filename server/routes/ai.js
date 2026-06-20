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
const SEARCH_RE = /\b(iit|nit|iiit|bits|cutoff|cut-off|cut off|closing rank|opening rank|placement|package|lpa|admission|counsell?ing|josaa|csab|seat matrix|seats?|fees?|nirf|eligibilit|notification|registration|application form|exam date|result|answer key|merit list|how many|number of (students|candidates|applicants)|applicants|appear(ed|ing)?|vacanc|scholarship|hostel|predictor|this year|latest|current|recent)\b/;
const CODE_RE = /\b(code|coding|program|programming|python|javascript|typescript|java|c\+\+|c#|golang|rust|sql|html|css|react|node|api|function|algorithm|data structure|recursion|loop|array|pointer|compile|syntax|runtime error|stack trace|debug|leetcode|oop|class|inheritance|regex|bug|terminal|git)\b/;
const MATH_RE = /\b(solve|simplify|evaluate|calculate|integral|integrate|derivative|differentiat|matrix|matrices|determinant|probability|permutation|combination|equation|inequalit|prove|theorem|circuit|kirchhoff|physics|chemistry|thermodynamics|calculus|vector|trigonometr|algebra|geometry|limit|series|kinematics|electromagnet|capacitor|resistor|mole|stoichiometr|numerical|jee|neet)\b/;

/* Choose the Groq model from the latest user message. Web-search wins first so
   exam / college / cutoff queries get fresh data even if they also look mathy. */
function pickModel(text = "") {
  const t = text.toLowerCase();
  if (SEARCH_RE.test(t)) return MODELS.search;
  if (CODE_RE.test(t)) return MODELS.code;
  if (MATH_RE.test(t) || /[∫∑√π∞≤≥×÷]|\\frac|\\int|\\sqrt|\\sum|\\theta/.test(text)) return MODELS.math;
  return MODELS.general;
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
   - Never invent facts, statistics, rankings, cutoffs, or dates.
   - When exact future information is unavailable, provide a reasonable estimate based on available trends and clearly label it as an estimate (e.g. "≈ 1.9 lakh (estimate)") with the reasoning behind it. Never dead-end with a bare "I don't know".

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

  // Route to the best model for the latest question (math / code / general).
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const chosen = pickModel(lastUser);

  const callGroq = (model) => fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature,
      stream: true,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
    signal: controller.signal,
  });

  try {
    // If the routed model is unavailable (e.g. retired id), fall back to general.
    let upstream = await callGroq(chosen);
    if ((!upstream.ok || !upstream.body) && chosen !== MODELS.general) {
      upstream = await callGroq(MODELS.general);
    }

    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text().catch(() => "");
      res.write(`event: error\ndata: ${JSON.stringify({ error: `AI upstream error (${upstream.status})`, detail: errText.slice(0, 300) })}\n\n`);
      return res.end();
    }

    // Re-emit Groq's OpenAI-style SSE as plain {delta} events the client reads,
    // dropping any <think>…</think> reasoning that R1 / Qwen emit.
    const strip = makeThinkStripper();
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
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
        if (payload === "[DONE]") {
          const tail = strip.flush();
          if (tail) res.write(`data: ${JSON.stringify({ delta: tail })}\n\n`);
          res.write("event: done\ndata: {}\n\n");
          continue;
        }
        try {
          const json = JSON.parse(payload);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) {
            const clean = strip.push(delta);
            if (clean) res.write(`data: ${JSON.stringify({ delta: clean })}\n\n`);
          }
        } catch { /* ignore keep-alive / partial frames */ }
      }
    }
    const tail = strip.flush();
    if (tail) res.write(`data: ${JSON.stringify({ delta: tail })}\n\n`);
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

export default router;
