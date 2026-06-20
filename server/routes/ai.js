/* AI proxy — College Parichay's own assistant, powered by Groq.
   The Groq API key never leaves the server: the browser talks only to these
   endpoints. /chat streams tokens back as Server-Sent Events; /title returns a
   short auto-generated conversation title. Both require a logged-in user. */
import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// ─── Constants ───────────────────────────────────────────────────────────────

const GROQ_URL    = "https://api.groq.com/openai/v1/chat/completions";
const TITLE_MODEL = process.env.GROQ_TITLE_MODEL || "llama-3.1-8b-instant";

const MODELS = {
  search:  process.env.GROQ_MODEL_SEARCH  || "groq/compound",
  math:    process.env.GROQ_MODEL_MATH    || "qwen/qwen3-32b",
  code:    process.env.GROQ_MODEL_CODE    || "qwen/qwen3-32b",
  general: process.env.GROQ_MODEL_GENERAL || process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
};

const MODE_META = {
  search:  { label: "Web search", model: MODELS.search,  temp: 0.5, maxTokens: null },
  math:    { label: "Reasoning",  model: MODELS.math,    temp: 0.3, maxTokens: 3072 },
  code:    { label: "Coding",     model: MODELS.code,    temp: 0.3, maxTokens: 3072 },
  general: { label: "Chat",       model: MODELS.general, temp: 0.6, maxTokens: 2048 },
};

// How many turns of history to forward per mode (search is tight on TPM)
const HISTORY_TURNS = { search: 6, math: 20, code: 20, general: 24 };

// Per-request timeout in ms (Groq compound can be slow while browsing)
const STREAM_TIMEOUT_MS = { search: 60_000, math: 45_000, code: 45_000, general: 30_000 };

// Image generation — Pollinations is keyless & free; swap via env for a paid provider
const IMAGE_BASE  = process.env.IMAGE_API_BASE || "https://image.pollinations.ai/prompt/";
const IMAGE_MODEL = process.env.IMAGE_MODEL || "flux";

// ─── Routing regexes ─────────────────────────────────────────────────────────

/* Live-data questions — route to web-search model for fresh information */
const SEARCH_RE = /\b(jee|neet|iit|nit|iiit|bits|cutoff|cut-off|cut off|rank|closing rank|opening rank|placement|package|lpa|admission|counsell?ing|josaa|csab|seat matrix|seats?|fees?|nirf|college|eligibilit|eligible|notification|registration|application|exam date|result|answer key|merit list|how many|number of (students|candidates|applicants)|applicants|appear(ed|ing)?|vacanc|scholarship|hostel|predictor|this year|latest|current|recent)\b/i;

const CODE_RE = /\b(code|coding|program|programming|python|javascript|typescript|java|c\+\+|c#|golang|rust|sql|html|css|react|node|api|function|algorithm|data structure|recursion|loop|array|pointer|compile|syntax|runtime error|stack trace|debug|leetcode|oop|class|inheritance|regex|bug|terminal|git)\b/i;

const MATH_RE = /\b(matrix|matrices|determinant|probability|permutation|combination|equation|inequalit|theorem|circuit|kirchhoff|physics|chemistry|thermodynamics|calculus|vector|trigonometr|algebra|geometry|limit|series|kinematics|electromagnet|capacitor|resistor|mole|stoichiometr|numerical)\b/i;

/* "Solve this" intent — keeps JEE numericals on the reasoning model */
const SOLVE_RE = /\b(solve|simplify|evaluate|calculate|integrate|differentiate|derive|prove|compute|find the|value of|roots? of)\b/i;

/* Detects LaTeX/math symbols in the raw message text */
const MATH_SYMBOL_RE = /[∫∑√π∞≤≥×÷]|\\frac|\\int|\\sqrt|\\sum|\\theta/;

function pickMode(text = "") {
  const solvey = SOLVE_RE.test(text) || MATH_SYMBOL_RE.test(text);
  if (SEARCH_RE.test(text) && !solvey) return "search";
  if (CODE_RE.test(text))              return "code";
  if (solvey || MATH_RE.test(text))   return "math";
  return "general";
}

// ─── System prompts ──────────────────────────────────────────────────────────

function todayIST() {
  return new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata", day: "numeric", month: "long", year: "numeric",
  });
}

function buildDateHeader() {
  return (
    `Current date: ${todayIST()}.\n` +
    "You know today's date. Never assume it is an earlier year. " +
    "Treat any event dated on or before today as something that has ALREADY happened — " +
    "do not claim a past exam, result or session 'has not been conducted yet'. " +
    "Only a date strictly after today is the future. Always verify dates and years against today's date before answering.\n\n"
  );
}

const MEMORY_NOTE =
  "\n\nNO WEB-SEARCH RESULTS are available this turn — you are answering from memory only. " +
  "Do NOT state any current or year-specific number, cutoff, closing rank, registration/candidate count " +
  "or exam date as a confirmed fact. Instead give the official source to check, and only if you genuinely " +
  "know it, a clearly-labelled historical range. Never output a specific fabricated figure.";

const SYSTEM_PROMPT = `You are College Parichay AI, an expert educational assistant specializing in engineering, science, programming, college admissions, placements, and career guidance.

TOP PRIORITY: be correct. A confident wrong answer is worse than honestly saying "I can't confirm the exact figure — verify it at [official source]." Never trade accuracy for sounding confident or complete. If you are not sure a specific fact is true, do not assert it.

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

6. For college admissions, answer in this order:
   - Official facts first (eligibility, exam details, process, fees, placements, cutoffs) — from data or search, clearly marked as official.
   - Then trends across recent years.
   - Then estimates, clearly labelled, only where exact data is genuinely unavailable.
   - Distinguish official information from estimates and state important assumptions.
   - Only for a year strictly after today's date should you say exact data cannot exist yet, then project from recent trends as a clearly-labelled estimate. For a past or current year, do not pretend the event hasn't happened — give official/searched data or say it must be verified from the official source.

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

10. Think step-by-step before answering, and verify every date and year against today's date (given above) before responding.

11. Never respond with: only "I don't know", vague answers, or unexplained conclusions.

If the user asks for the latest information, use any web-search results provided to you — prefer and cite them over memory, noting the year/source (jeeadv.ac.in, josaa.nic.in, nta.ac.in, etc.). If current data is unavailable, clearly state the limitation and provide the best available explanation or estimate.`;

function buildSearchSystemPrompt() {
  return (
    `Current date: ${todayIST()}. Treat any event on or before today as already happened.\n` +
    "You are College Parichay AI with live web search. Search the web and answer the student accurately and concisely. " +
    "Base every number, cutoff, rank and date on what you actually find, and cite the source with its year. " +
    "Never invent statistics; if the search finds nothing, say so. Use Markdown, and write any maths in LaTeX ($...$)."
  );
}

/* Persistent, cross-chat memory the client sends each turn (the student's class,
   target exam/year, branches, city, preferences). Injected so replies feel
   personalised — like ChatGPT/Claude memory. */
function buildUserContext(ctx) {
  const s = (typeof ctx === "string" ? ctx : "").trim().slice(0, 1_500);
  if (!s) return "";
  return (
    "\n\n— WHAT YOU KNOW ABOUT THIS STUDENT (use it naturally to personalise answers; " +
    "do not recite it back unless relevant) —\n" + s
  );
}

// ─── Message sanitization ────────────────────────────────────────────────────

function sanitizeMessages(raw, maxTurns = 24) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-maxTurns)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 24_000) }));
}

/** Trim messages for the search model: drop attachment blobs, cap length, keep recent turns */
function leanForSearch(msgs, maxTurns = 6) {
  return msgs.slice(-maxTurns).map((m) => ({
    role: m.role,
    content: m.content.split("\n\n--- Attached:")[0].slice(0, 3_000),
  }));
}

// ─── <think> stripper ────────────────────────────────────────────────────────

/**
 * Stateful streaming filter that removes <think>…</think> blocks from Groq's
 * chain-of-thought models (DeepSeek-R1, Qwen 3). Handles tags split across chunks.
 */
function makeThinkStripper() {
  const OPEN = "<think>", CLOSE = "</think>";
  let inside = false, pending = "";

  /** Returns how many trailing chars of `s` could be the start of `tag` */
  const partialTail = (s, tag) => {
    const max = Math.min(s.length, tag.length - 1);
    for (let k = max; k > 0; k--) {
      if (tag.startsWith(s.slice(s.length - k))) return k;
    }
    return 0;
  };

  return {
    push(chunk) {
      let s = pending + chunk;
      pending = "";
      let out = "";
      while (s) {
        if (!inside) {
          const idx = s.indexOf(OPEN);
          if (idx === -1) {
            const k = partialTail(s, OPEN);
            out    += s.slice(0, s.length - k);
            pending = s.slice(s.length - k);
            break;
          }
          out += s.slice(0, idx);
          s    = s.slice(idx + OPEN.length);
          inside = true;
        } else {
          const idx = s.indexOf(CLOSE);
          if (idx === -1) {
            const k = partialTail(s, CLOSE);
            pending = s.slice(s.length - k);
            break;
          }
          s      = s.slice(idx + CLOSE.length);
          inside = false;
        }
      }
      return out;
    },
    flush() {
      const out = inside ? "" : pending;
      pending   = "";
      inside    = false; // reset so the instance is reusable
      return out;
    },
  };
}

/**
 * The compound search model emits the real answer after its last </think> block
 * (or directly if it skips thinking). Strip any residual tags.
 */
function finalFromReasoning(raw) {
  const i = raw.lastIndexOf("</think>");
  let ans = (i >= 0 ? raw.slice(i + "</think>".length) : raw)
    .replace(/<\/?(think|output|reasoning)>/gi, "")
    .trim();

  // Fallback: strip all think blocks and take whatever remains
  if (!ans) {
    ans = raw
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .replace(/<\/?(think|output|reasoning)>/gi, "")
      .trim();
  }
  return ans;
}

// ─── SSE helpers ─────────────────────────────────────────────────────────────

function sseDelta(res, text)  { res.write(`data: ${JSON.stringify({ delta: text })}\n\n`); }
function sseMeta(res, data)   { res.write(`event: meta\ndata: ${JSON.stringify(data)}\n\n`); }
function sseError(res, msg, detail = "") {
  res.write(`event: error\ndata: ${JSON.stringify({ error: msg, ...(detail ? { detail } : {}) })}\n\n`);
}

// ─── Core streaming logic ─────────────────────────────────────────────────────

/**
 * Open one streaming completion against Groq and pipe visible tokens to `res`.
 * Returns { emitted: boolean } so the caller can decide to fall back.
 */
async function streamGroq({ res, model, messages, systemPrompt, temperature, maxTokens, timeoutMs, controller }) {
  const body = {
    model,
    temperature,
    stream: true,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    ...(maxTokens ? { max_tokens: maxTokens } : {}),
  };

  // Apply a per-request timeout on top of the AbortController used for client-disconnect.
  const timeoutId = setTimeout(() => controller.abort("timeout"), timeoutMs);

  let upstream;
  try {
    upstream = await fetch(GROQ_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body:    JSON.stringify(body),
      signal:  controller.signal,
    });
  } catch (e) {
    clearTimeout(timeoutId);
    if (controller.signal.aborted) throw e; // propagate client-disconnect
    return { emitted: false, error: e.message };
  }

  clearTimeout(timeoutId);

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => "");
    // Surface rate-limit errors explicitly so the UI can show a friendly message
    if (upstream.status === 429) return { emitted: false, rateLimited: true };
    return { emitted: false, error: `Groq ${upstream.status}: ${errText.slice(0, 200)}` };
  }

  if (!upstream.body) return { emitted: false, error: "No response body" };

  const strip    = makeThinkStripper();
  const reader   = upstream.body.getReader();
  const decoder  = new TextDecoder();
  let buffer     = "";
  let emitted    = false;
  let reasonBuf  = ""; // for compound model's reasoning field

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? ""; // keep incomplete last line

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") continue;

        let parsed;
        try { parsed = JSON.parse(payload); } catch { continue; }

        const delta = parsed.choices?.[0]?.delta ?? {};

        if (delta.content) {
          const clean = strip.push(delta.content);
          if (clean) { sseDelta(res, clean); emitted = true; }
        } else if (delta.reasoning) {
          // Compound model streams its full answer in the reasoning field
          reasonBuf += delta.reasoning;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  const tail = strip.flush();
  if (tail) { sseDelta(res, tail); emitted = true; }

  // If nothing came via `content`, try extracting from buffered reasoning
  if (!emitted && reasonBuf.trim()) {
    const answer = finalFromReasoning(reasonBuf);
    if (answer) { sseDelta(res, answer); emitted = true; }
  }

  return { emitted };
}

// ─── Routes ──────────────────────────────────────────────────────────────────

/* POST /api/ai/chat — streamed completion via SSE */
router.post("/chat", requireAuth, async (req, res) => {
  if (!process.env.GROQ_API_KEY) {
    return res.status(503).json({ error: "AI is not configured on the server." });
  }

  const rawMessages = sanitizeMessages(req.body?.messages);
  if (!rawMessages.length) {
    return res.status(400).json({ error: "No messages provided." });
  }

  // Override temperature only when the caller explicitly passes it
  const callerTemp = req.body?.temperature != null
    ? Math.min(1.2, Math.max(0, Number(req.body.temperature) || 0))
    : null;

  // Detect mode from the most recent user turn
  const lastUserText = [...rawMessages].reverse().find((m) => m.role === "user")?.content ?? "";
  const mode         = pickMode(lastUserText);
  const meta         = MODE_META[mode];
  const temperature  = callerTemp ?? meta.temp;

  // Prepare mode-specific message list and system prompt
  const isSearch     = mode === "search";
  const userContext  = buildUserContext(req.body?.context);
  const messages     = isSearch ? leanForSearch(rawMessages) : rawMessages.slice(-HISTORY_TURNS[mode]);
  const systemPrompt = (isSearch
    ? buildSearchSystemPrompt()
    : buildDateHeader() + SYSTEM_PROMPT + MEMORY_NOTE) + userContext;

  // SSE headers
  res.setHeader("Content-Type",  "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection",    "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  // Shared AbortController — aborted on client disconnect or per-request timeout
  const controller = new AbortController();
  res.on("close", () => { if (!res.writableEnded) controller.abort("client-disconnect"); });

  try {
    // Tell the UI which mode is active (drives the badge)
    sseMeta(res, { mode, label: meta.label });

    const sharedArgs = { res, messages, systemPrompt, temperature, controller };

    let result = await streamGroq({
      ...sharedArgs,
      model:     meta.model,
      maxTokens: meta.maxTokens,
      timeoutMs: STREAM_TIMEOUT_MS[mode],
    });

    // Transparent fallback: if the routed model failed or produced nothing,
    // try the general model before surfacing an error to the user.
    if (!result.emitted && meta.model !== MODELS.general) {
      sseMeta(res, { mode: "general", label: MODE_META.general.label });
      result = await streamGroq({
        ...sharedArgs,
        model:      MODELS.general,
        maxTokens:  MODE_META.general.maxTokens,
        timeoutMs:  STREAM_TIMEOUT_MS.general,
        systemPrompt: buildDateHeader() + SYSTEM_PROMPT + MEMORY_NOTE + userContext,
        messages:     rawMessages.slice(-HISTORY_TURNS.general),
      });
    }

    if (!result.emitted) {
      const userMsg = result.rateLimited
        ? "The AI is busy right now (rate limit reached). Please wait a moment and try again."
        : "The AI returned an empty response — please try again.";
      sseError(res, userMsg, result.error);
    }

    res.write("event: done\ndata: {}\n\n");
    res.end();
  } catch (e) {
    if (controller.signal.aborted) return res.end();
    sseError(res, "AI request failed.", String(e?.message || e).slice(0, 200));
    res.end();
  }
});

/* POST /api/ai/title — generate a short conversation title */
router.post("/title", requireAuth, async (req, res) => {
  if (!process.env.GROQ_API_KEY) return res.json({ title: "New chat" });

  const first = String(req.body?.prompt || "").trim().slice(0, 1_000);
  if (!first) return res.json({ title: "New chat" });

  try {
    const r = await fetch(GROQ_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model:       TITLE_MODEL,
        temperature: 0.3,
        max_tokens:  20,
        messages: [
          { role: "system", content: "Reply with ONLY a 2-5 word title (no quotes, no punctuation at the end) summarising the user's message." },
          { role: "user",   content: first },
        ],
      }),
    });

    if (!r.ok) return res.json({ title: "New chat" });
    const data = await r.json();
    let title  = data.choices?.[0]?.message?.content?.trim() ?? "";
    title = title.replace(/^["'#\s]+|["'.\s]+$/g, "").slice(0, 48);
    res.json({ title: title || "New chat" });
  } catch {
    res.json({ title: "New chat" });
  }
});

/* POST /api/ai/followups — 3 suggested follow-up questions */
router.post("/followups", requireAuth, async (req, res) => {
  if (!process.env.GROQ_API_KEY) return res.json({ followups: [] });

  const question = String(req.body?.question || "").trim().slice(0, 1_500);
  const answer   = String(req.body?.answer   || "").trim().slice(0, 3_000);
  if (!question) return res.json({ followups: [] });

  try {
    const r = await fetch(GROQ_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model:       TITLE_MODEL,
        temperature: 0.5,
        max_tokens:  120,
        messages: [
          {
            role:    "system",
            content: "You suggest what a student might naturally ask next. Reply with ONLY a JSON array of exactly 3 short follow-up questions (each under 9 words), no prose, no numbering.",
          },
          {
            role:    "user",
            content: `Question: ${question}\n\nAnswer: ${answer}\n\nGive 3 follow-up questions as a JSON array.`,
          },
        ],
      }),
    });

    if (!r.ok) return res.json({ followups: [] });
    const data = await r.json();
    const raw  = data.choices?.[0]?.message?.content ?? "[]";

    let followups = [];
    try {
      const match = raw.match(/\[[\s\S]*\]/);
      followups   = JSON.parse(match ? match[0] : raw);
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

/* POST /api/ai/image — text-to-image. We refine the prompt with a fast LLM, then
   return a keyless image URL the browser loads directly. */
router.post("/image", requireAuth, async (req, res) => {
  const raw = String(req.body?.prompt || "").trim().slice(0, 600);
  if (!raw) return res.status(400).json({ error: "Describe the image you want." });

  // Expand the request into a vivid prompt (best-effort; fall back to the raw text)
  let prompt = raw;
  if (process.env.GROQ_API_KEY) {
    try {
      const r = await fetch(GROQ_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({
          model: TITLE_MODEL, temperature: 0.7, max_tokens: 110,
          messages: [
            { role: "system", content: "Rewrite the user's request as ONE vivid, detailed image-generation prompt — name the subject, style, lighting, mood and composition. Reply with ONLY the prompt (no quotes, no preamble), under 55 words." },
            { role: "user", content: raw },
          ],
        }),
      });
      if (r.ok) {
        const refined = (await r.json()).choices?.[0]?.message?.content?.trim();
        if (refined) prompt = refined.replace(/^["']|["']$/g, "").slice(0, 400);
      }
    } catch { /* keep raw prompt */ }
  }

  const seed = Number.isFinite(+req.body?.seed) ? Math.abs(+req.body.seed) % 1_000_000 : Math.floor(Math.random() * 1_000_000);
  const url  = `${IMAGE_BASE}${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${seed}&model=${IMAGE_MODEL}`;
  res.json({ url, prompt, seed });
});

/* POST /api/ai/memory — distil durable facts about the student into a compact,
   persistent memory the client stores and replays on every turn. */
router.post("/memory", requireAuth, async (req, res) => {
  const existing = String(req.body?.memory || "").slice(0, 2_000);
  const recent   = sanitizeMessages(req.body?.messages, 8)
    .map((m) => `${m.role === "user" ? "Student" : "AI"}: ${m.content.split("\n\n--- Attached:")[0].slice(0, 600)}`)
    .join("\n");
  if (!recent.trim() || !process.env.GROQ_API_KEY) return res.json({ memory: existing });

  try {
    const r = await fetch(GROQ_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: TITLE_MODEL, temperature: 0.2, max_tokens: 260,
        messages: [
          { role: "system", content: "You maintain a tiny long-term memory about a student so an AI tutor can personalise help. Keep only STABLE, useful facts: class/year, target exam(s) & year, target branches/colleges, city/state, category, strengths & weak topics, and clear preferences. Ignore one-off question content and anything temporary. Merge new facts into the existing memory, dedupe, and keep it under 10 short bullet lines starting with '- '. Reply with ONLY the bullet list (no preamble). If there is nothing worth remembering, repeat the existing memory unchanged." },
          { role: "user", content: `Existing memory:\n${existing || "(empty)"}\n\nRecent conversation:\n${recent}\n\nReturn the updated memory.` },
        ],
      }),
    });
    if (!r.ok) return res.json({ memory: existing });
    let memory = (await r.json()).choices?.[0]?.message?.content?.trim() || existing;
    // keep only bullet lines, cap size
    memory = memory.split("\n").filter((l) => l.trim().startsWith("-")).join("\n").slice(0, 1_500) || existing;
    res.json({ memory });
  } catch {
    res.json({ memory: existing });
  }
});

export default router;
