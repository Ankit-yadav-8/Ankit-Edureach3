/* AI proxy — College Parichay's own assistant, powered by Google Gemini.
   The Gemini API key never leaves the server: the browser talks only to these
   endpoints. /chat streams tokens back as Server-Sent Events; /title returns a
   short auto-generated conversation title. Both require a logged-in user.
   (Test-paper PDF→CBT conversion runs on Groq — see server/utils/groq.js.) */
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { callGemini } from "../utils/gemini.js";

const router = express.Router();

// ─── Constants ───────────────────────────────────────────────────────────────

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
// Main chat model (one multimodal model serves every mode). The "search" mode
// layers Google Search grounding on top of it; FAST_MODEL handles the cheap
// helper calls (titles, follow-ups, memory, image prompts).
const CHAT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const FAST_MODEL = process.env.GEMINI_TITLE_MODEL || "gemini-2.5-flash-lite";

// Per-mode generation knobs. `search` turns on the google_search tool; `think`
// is the thinking-token budget (0 = off, for snappy replies; reasoning modes get
// a small budget so multi-step maths/code is worked out before answering).
const MODE_META = {
  search:  { label: "Web search", temp: 0.5, maxTokens: 4096, search: true,  think: 0 },
  math:    { label: "Reasoning",  temp: 0.3, maxTokens: 8192, search: false, think: 4096 },
  code:    { label: "Coding",     temp: 0.3, maxTokens: 8192, search: false, think: 4096 },
  general: { label: "Chat",       temp: 0.6, maxTokens: 4096, search: false, think: 0 },
};

// How many turns of history to forward per mode (search stays lean for latency)
const HISTORY_TURNS = { search: 6, math: 20, code: 20, general: 24 };

// Per-request timeout in ms (search grounding can be slow while browsing)
const STREAM_TIMEOUT_MS = { search: 240_000, math: 240_000, code: 240_000, general: 180_000 };

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

const SYSTEM_PROMPT = `You are College Parichay AI, an expert, highly advanced educational assistant and mentor. You specialize in engineering, science, programming, college admissions, placements, and career guidance.

Your goal is to provide comprehensive, detailed, and deeply informative answers, similar to advanced AI models like ChatGPT, Claude, and Gemini. Do not give short or brief answers unless explicitly asked. Go deep into the subject matter.

TOP PRIORITY: Accuracy and depth. A confident wrong answer is worse than honestly saying "I can't confirm the exact figure — verify it at [official source]." Never trade accuracy for sounding confident or complete. If you are not sure a specific fact is true, do not assert it.

Core Principles:

1. Be conversational and engaging. Treat the user as a mentee. Provide encouraging, full, and rich responses.

2. Be accurate and honest.
   - FACTS vs REASONING vs STATISTICS: facts and figures must come from provided data or web-search results; reasoning and explanations you may generate yourself; statistics must NEVER be generated without evidence.
   - Never invent or guess official statistics — exam registration counts, cutoffs, closing ranks, placement numbers, percentages, or dates.
   - FACT-CHECK before sending: if your answer contains any number, percentage, ranking, registration count or statistic, confirm it came from provided data or search results.

3. For academic questions:
   - Explain concepts deeply and step by step.
   - Use simple language first, then build up to advanced technical depth.
   - Show formulas when relevant.
   - Show all calculation steps for numerical problems, and verify the final answer.
   - Provide exhaustive examples and analogies whenever possible.

4. For programming questions:
   - Give working code in a fenced block with a language tag.
   - Explain the code architecture and logic thoroughly.
   - Mention edge cases, common mistakes, and modern best practices.

5. For engineering questions:
   - Explain theory, formulas, and practical applications in detail.
   - Connect concepts to real-world engineering use cases comprehensively.

6. For college admissions, answer in this order:
   - Official facts first (eligibility, exam details, process, fees, placements, cutoffs) — from data or search, clearly marked as official.
   - Then trends across recent years.
   - Then estimates, clearly labelled, only where exact data is genuinely unavailable.

7. Response Structure & Formatting:
   - Use rich Markdown: headings, bold text, bullet points, and tables to structure your long answers. Make it highly readable.
   - Write ALL mathematics in LaTeX — $...$ for inline and $$...$$ for display equations. Never write raw "x^2", "sqrt(x)".

8. DO NOT truncate lists, quizzes, or steps. If the user asks for a specific number of items (e.g., 10 questions, 5 explanations), you MUST provide exactly that number, fully detailed and explained. Never stop halfway or leave out explanations.

9. Always aim to give the most helpful, extensive, and high-quality response possible. Do not artificially compress your explanations. You are encouraged to provide long, high-quality, comprehensive answers just like ChatGPT and Claude.`;

function buildSearchSystemPrompt() {
  return (
    `Current date: ${todayIST()}. Treat any event on or before today as already happened.\n` +
    "You are College Parichay AI with live web search. Search the web and answer the student comprehensively with highly detailed explanations. " +
    "Provide rich, long-form answers that deeply cover the topic. " +
    "Base every number, cutoff, rank and date on what you actually find, and cite the source with its year. " +
    "Never invent statistics; if the search finds nothing, say so. Use Markdown to structure your detailed answer, and write any maths in LaTeX ($...$)."
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

// ─── Gemini message conversion ───────────────────────────────────────────────

/** Map OpenAI-style chat turns to Gemini `contents` (assistant → "model"). */
function toGeminiContents(messages) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

// ─── SSE helpers ─────────────────────────────────────────────────────────────

function sseDelta(res, text)  { res.write(`data: ${JSON.stringify({ delta: text })}\n\n`); }
function sseMeta(res, data)   { res.write(`event: meta\ndata: ${JSON.stringify(data)}\n\n`); }
function sseError(res, msg, detail = "") {
  res.write(`event: error\ndata: ${JSON.stringify({ error: msg, ...(detail ? { detail } : {}) })}\n\n`);
}

// ─── Core streaming logic ─────────────────────────────────────────────────────

/**
 * Open one streaming generateContent call against Gemini and pipe visible tokens
 * to `res`. Returns { emitted, rateLimited, error } so the caller can fall back.
 * `search` adds Google Search grounding; `think` is the thinking-token budget.
 */
async function streamGemini({ res, model, messages, systemPrompt, temperature, maxTokens, search, think, timeoutMs, controller }) {
  const url = `${GEMINI_BASE}/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`;

  const generationConfig = {
    temperature,
    ...(maxTokens ? { maxOutputTokens: maxTokens } : {}),
  };
  // Cap "thinking" so 2.5 models answer promptly (0) or reason a little (math/code).
  if (/2\.5/.test(model)) {
    const tb = Number(process.env.GEMINI_CHAT_THINKING_BUDGET);
    generationConfig.thinkingConfig = { thinkingBudget: Number.isFinite(tb) ? tb : (think ?? 0) };
  }

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: toGeminiContents(messages),
    generationConfig,
    ...(search ? { tools: [{ google_search: {} }] } : {}),
  };

  // Apply a per-request timeout on top of the AbortController used for client-disconnect.
  const timeoutId = setTimeout(() => controller.abort("timeout"), timeoutMs);

  let upstream;
  try {
    upstream = await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
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
    return { emitted: false, error: `Gemini ${upstream.status}: ${errText.slice(0, 200)}` };
  }

  if (!upstream.body) return { emitted: false, error: "No response body" };

  const reader  = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer    = "";
  let emitted   = false;

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
        if (!payload || payload === "[DONE]") continue;

        let parsed;
        try { parsed = JSON.parse(payload); } catch { continue; }

        const parts = parsed.candidates?.[0]?.content?.parts ?? [];
        for (const p of parts) {
          if (p?.thought) continue; // never leak chain-of-thought
          if (typeof p?.text === "string" && p.text) { sseDelta(res, p.text); emitted = true; }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return { emitted };
}

// ─── Routes ──────────────────────────────────────────────────────────────────

/* POST /api/ai/chat — streamed completion via SSE */
router.post("/chat", requireAuth, async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
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

    const sharedArgs = { res, model: CHAT_MODEL, messages, systemPrompt, temperature, controller };

    let result = await streamGemini({
      ...sharedArgs,
      maxTokens: meta.maxTokens,
      search:    meta.search,
      think:     meta.think,
      timeoutMs: STREAM_TIMEOUT_MS[mode],
    });

    // Transparent fallback: if a specialised mode (search grounding / reasoning)
    // failed or produced nothing, retry as a plain general chat before erroring.
    if (!result.emitted && mode !== "general") {
      sseMeta(res, { mode: "general", label: MODE_META.general.label });
      result = await streamGemini({
        ...sharedArgs,
        maxTokens:  MODE_META.general.maxTokens,
        search:     false,
        think:      MODE_META.general.think,
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
  if (!process.env.GEMINI_API_KEY) return res.json({ title: "New chat" });

  const first = String(req.body?.prompt || "").trim().slice(0, 1_000);
  if (!first) return res.json({ title: "New chat" });

  try {
    const out = await callGemini({
      model: FAST_MODEL, temperature: 0.3, maxTokens: 24, json: false, retries: 1,
      system: "Reply with ONLY a 2-5 word title (no quotes, no punctuation at the end) summarising the user's message.",
      parts: [{ text: first }],
    });
    let title = (out || "").trim().replace(/^["'#\s]+|["'.\s]+$/g, "").slice(0, 48);
    res.json({ title: title || "New chat" });
  } catch {
    res.json({ title: "New chat" });
  }
});

/* POST /api/ai/followups — 3 suggested follow-up questions */
router.post("/followups", requireAuth, async (req, res) => {
  if (!process.env.GEMINI_API_KEY) return res.json({ followups: [] });

  const question = String(req.body?.question || "").trim().slice(0, 1_500);
  const answer   = String(req.body?.answer   || "").trim().slice(0, 3_000);
  if (!question) return res.json({ followups: [] });

  try {
    const raw = await callGemini({
      model: FAST_MODEL, temperature: 0.5, maxTokens: 160, json: true, retries: 1,
      system: "You suggest what a student might naturally ask next. Reply with ONLY a JSON array of exactly 3 short follow-up questions (each under 9 words), no prose, no numbering.",
      parts: [{ text: `Question: ${question}\n\nAnswer: ${answer}\n\nGive 3 follow-up questions as a JSON array.` }],
    }) || "[]";

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
  if (process.env.GEMINI_API_KEY) {
    try {
      const refined = (await callGemini({
        model: FAST_MODEL, temperature: 0.7, maxTokens: 140, json: false, retries: 1,
        system: "Rewrite the user's request as ONE vivid, detailed image-generation prompt — name the subject, style, lighting, mood and composition. Reply with ONLY the prompt (no quotes, no preamble), under 55 words.",
        parts: [{ text: raw }],
      }))?.trim();
      if (refined) prompt = refined.replace(/^["']|["']$/g, "").slice(0, 400);
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
  if (!recent.trim() || !process.env.GEMINI_API_KEY) return res.json({ memory: existing });

  try {
    const out = await callGemini({
      model: FAST_MODEL, temperature: 0.2, maxTokens: 300, json: false, retries: 1,
      system: "You maintain a tiny long-term memory about a student so an AI tutor can personalise help. Keep only STABLE, useful facts: class/year, target exam(s) & year, target branches/colleges, city/state, category, strengths & weak topics, and clear preferences. Ignore one-off question content and anything temporary. Merge new facts into the existing memory, dedupe, and keep it under 10 short bullet lines starting with '- '. Reply with ONLY the bullet list (no preamble). If there is nothing worth remembering, repeat the existing memory unchanged.",
      parts: [{ text: `Existing memory:\n${existing || "(empty)"}\n\nRecent conversation:\n${recent}\n\nReturn the updated memory.` }],
    });
    let memory = (out || "").trim() || existing;
    // keep only bullet lines, cap size
    memory = memory.split("\n").filter((l) => l.trim().startsWith("-")).join("\n").slice(0, 1_500) || existing;
    res.json({ memory });
  } catch {
    res.json({ memory: existing });
  }
});

/* POST /api/ai/tutor — proxy for AiTutor Voice Tutor to avoid browser CORS/API key issues */
router.post("/tutor", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_AI_API_KEY || process.env.AI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "AI Tutor API key not configured on server" });

  try {
    const question = req.body?.question || "";
    const fetchRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `You are CollegeParichay, an AI Voice Tutor. A student asks: "${question}". 
        
Follow these academic guidelines for completeness:
${SYSTEM_PROMPT}

ADDITIONAL INSTRUCTIONS FOR THIS TUTOR:
1. If the user asks for short notes, structure them based on the standard Allen Handbook reference style, keeping them extremely crisp, conceptual, and well-organized. 
2. Use diagrammatic formats where possible (using ASCII diagrams in the "text" field) to visually explain concepts in a handwritten-style layout.
3. **PREVENT BULKY TEXT**: Break down your explanations into highly granular, bite-sized steps. Never output a giant wall of text. A single step's "text" should be no longer than 2-3 short sentences. 
4. **DEPTH & POWER**: Act with the full depth of an advanced AI like ChatGPT/Gemini. Cover every topic comprehensively, but distribute that depth across MANY short steps rather than cramming it into a few huge ones.
5. **EQUATIONS**: Place primary equations in the "math" field rather than inline, to keep the "text" field clean and easy to read.

CRITICAL FORMATTING INSTRUCTION:
Even though you are providing full, in-depth derivations and explanations, you MUST format your ENTIRE response exactly as this JSON structure. Place the step-by-step derivations or explanations into the "steps" array.
{
  "speech": "An introductory sentence meant to be spoken aloud.",
  "steps": [
    { "step": 1, "text": "Detailed explanation for this step", "math": "Formula or LaTeX if applicable (optional)" }
  ],
  "closing": "Encouraging closing remark meant to be spoken aloud."
}
Include as many steps in the "steps" array as necessary to provide a complete, rigorous, and deep answer (e.g., 10-20 steps if needed). Do NOT skip steps, and do NOT combine multiple concepts into one step.
Do not include markdown blocks around the JSON, just the pure JSON string.` }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });
    
    if (!fetchRes.ok) {
      return res.status(fetchRes.status).json({ error: "Gemini API Error" });
    }
    
    const data = await fetchRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
