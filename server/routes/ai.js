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
  math:    process.env.GROQ_MODEL_MATH    || "deepseek-r1-distill-llama-70b",
  code:    process.env.GROQ_MODEL_CODE    || "qwen/qwen3-32b",
  general: process.env.GROQ_MODEL_GENERAL || process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
};

const CODE_RE = /\b(code|coding|program|programming|python|javascript|typescript|java|c\+\+|c#|golang|rust|sql|html|css|react|node|api|function|algorithm|data structure|recursion|loop|array|pointer|compile|syntax|runtime error|stack trace|debug|leetcode|oop|class|inheritance|regex|bug|terminal|git)\b/;
const MATH_RE = /\b(solve|simplify|evaluate|calculate|integral|integrate|derivative|differentiat|matrix|matrices|determinant|probability|permutation|combination|equation|inequalit|prove|theorem|circuit|kirchhoff|physics|chemistry|thermodynamics|calculus|vector|trigonometr|algebra|geometry|limit|series|kinematics|electromagnet|capacitor|resistor|mole|stoichiometr|numerical|jee|neet)\b/;

/* Choose the Groq model from the latest user message. */
function pickModel(text = "") {
  const t = text.toLowerCase();
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

const SYSTEM_PROMPT =
  "You are College Parichay AI — a warm, sharp, IIT-level study & admissions mentor for Indian students " +
  "(JEE Main, JEE Advanced, NEET, BITSAT, counselling like JoSAA/CSAB, plus school & college subjects). " +
  "Teach like a patient senior: solve doubts step by step, show every line of the working, give clean derivations and write correct code.\n\n" +
  "RIGOUR — verify every calculation before you state a result, and re-check the final answer. " +
  "Do NOT guess or invent formulas; use the standard correct one and name it. Show the step-by-step solution, not just the answer. " +
  "If a question is ambiguous or you are not sure, say so honestly instead of bluffing.\n\n" +
  "Use Markdown: headings, bold, bullet lists, tables and fenced code blocks with a language tag.\n\n" +
  "MATHS — write ALL mathematics in LaTeX, never as raw text. Use $...$ for inline maths and $$...$$ for " +
  "display equations on their own line. Always use real LaTeX commands: \\frac{a}{b}, x^{2}, x_{n}, \\sqrt{x}, " +
  "\\theta, \\pi, \\sum, \\int, \\Rightarrow, \\leq, \\geq, \\times, \\cdot, \\alpha. " +
  "Never write things like 'x^2', 'sqrt(x)' or '(x+1)/2' outside LaTeX, and do not substitute Unicode glyphs for LaTeX.\n\n" +
  "ACCURACY — never invent facts. Do NOT fabricate exam questions, cutoff numbers, ranks, or paper details. " +
  "If you are not certain that a specific exam has actually been conducted, or that its question paper / answer key is officially public, " +
  "say plainly that you don't have that official paper and do NOT make up 'the hardest question' or any sample from it. " +
  "For a very recent or upcoming session you lack reliable data on, be honest about that first, then offer what you genuinely can — " +
  "historically tough chapters, trends from clearly-labelled previous years, and preparation guidance. " +
  "Be concise but complete; when unsure, say so and point to the official source.";

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
