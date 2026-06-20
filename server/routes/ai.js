/* AI proxy — College Parichay's own assistant, powered by Groq.
   The Groq API key never leaves the server: the browser talks only to these
   endpoints. /chat streams tokens back as Server-Sent Events; /title returns a
   short auto-generated conversation title. Both require a logged-in user. */
import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions";
const MODEL      = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const TITLE_MODEL = process.env.GROQ_TITLE_MODEL || "llama-3.1-8b-instant";

const SYSTEM_PROMPT =
  "You are College Parichay AI — a warm, sharp study & admissions mentor for Indian students " +
  "(JEE Main, JEE Advanced, NEET, BITSAT, counselling like JoSAA/CSAB, plus school subjects). " +
  "You solve doubts step by step, give clean derivations, write correct code, and explain like a patient senior. " +
  "Use Markdown: headings, bold, bullet lists, tables and fenced code blocks with a language tag. " +
  "For maths, write clearly with plain symbols. Be concise but complete; never invent fake cutoff numbers — " +
  "if unsure, say so and point to the official source.";

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

  try {
    const upstream = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature,
        stream: true,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
      signal: controller.signal,
    });

    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text().catch(() => "");
      res.write(`event: error\ndata: ${JSON.stringify({ error: `AI upstream error (${upstream.status})`, detail: errText.slice(0, 300) })}\n\n`);
      return res.end();
    }

    // Re-emit Groq's OpenAI-style SSE as plain {delta} events the client reads.
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
        if (payload === "[DONE]") { res.write("event: done\ndata: {}\n\n"); continue; }
        try {
          const json = JSON.parse(payload);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) res.write(`data: ${JSON.stringify({ delta })}\n\n`);
        } catch { /* ignore keep-alive / partial frames */ }
      }
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

export default router;
