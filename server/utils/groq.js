// ─────────────────────────────────────────────────────────────────────────────
// Groq chat client — shared by the test-paper converters (text + vision).
//
// Deliberately mirrors the callGemini(...) interface so the parsers stay
// provider-agnostic: same { system, parts, maxTokens, temperature, model } args
// and the same returned JSON-string output. Talks to Groq's OpenAI-compatible
// chat-completions API and asks for a JSON object via response_format.
//
// `parts` use the Gemini shape ({ text } | { inline_data: { mime_type, data } });
// we map them to OpenAI content blocks (text | image_url data-URL) so the vision
// model reads page images exactly as the Gemini path did.
//
// Tunables (env): GROQ_API_KEY, GROQ_MODEL (default llama-3.3-70b-versatile),
// GROQ_VISION_MODEL (default meta-llama/llama-4-scout-17b-16e-instruct, set by
// the caller for the page-image OCR pass).
// ─────────────────────────────────────────────────────────────────────────────
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export function groqReady() {
  return !!process.env.GROQ_API_KEY;
}

export function groqModel(fallback = "llama-3.3-70b-versatile") {
  return process.env.GROQ_MODEL || fallback;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Map Gemini-style `parts` to an OpenAI chat `content` value. A bare string is
// passed through; { text } → { type:"text" }, and an inline image becomes a
// base64 data-URL image_url block (Groq's vision models accept these).
function toOpenAIContent(parts) {
  if (typeof parts === "string") return parts;
  const blocks = [];
  for (const p of parts || []) {
    if (p?.text != null) {
      blocks.push({ type: "text", text: p.text });
    } else if (p?.inline_data) {
      const { mime_type, data } = p.inline_data;
      blocks.push({ type: "image_url", image_url: { url: `data:${mime_type};base64,${data}` } });
    }
  }
  return blocks;
}

// One chat completion. Returns the model's text output (the JSON string the
// caller then parses). Retries on 429 / 5xx, honouring Retry-After / the
// "try again in Ns" hint, throws a tagged DAILY_LIMIT error when a per-day quota
// is exhausted (retrying then is pointless), and auto-halves max_tokens on a
// "too many tokens" 400 so a single oversized batch can't blank the paper.
export async function callGroq({
  system,
  parts,
  maxTokens = 8192,
  temperature = 0,
  model = groqModel(),
  retries = 9,
} = {}) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY not set");

  const content = toOpenAIContent(parts);
  let mt = maxTokens;
  const buildBody = () => JSON.stringify({
    model,
    temperature,
    max_tokens: mt,
    response_format: { type: "json_object" },
    messages: [
      ...(system ? [{ role: "system", content: system }] : []),
      { role: "user", content },
    ],
  });

  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: buildBody(),
      });
    } catch (e) {
      if (attempt < retries) { await sleep(Math.min(30000, (2 + attempt) * 1000)); continue; }
      throw e;
    }

    if (res.status === 429 || res.status >= 500) {
      const txt = await res.text().catch(() => "");
      // Per-DAY quota (TPD/RPD) won't reset for hours — fail fast, distinct reason.
      if (/per ?day|\bTPD\b|\bRPD\b|tokens per day|requests per day/i.test(txt)) {
        const e = new Error("daily AI quota reached");
        e.code = "DAILY_LIMIT";
        e.detail = txt.slice(0, 200);
        throw e;
      }
      if (attempt < retries) {
        const ra = Number(res.headers.get("retry-after"));
        const hint = Number((txt.match(/try again in ([\d.]+)\s*s/i) || [])[1]);
        const waitMs = Math.min(30000, Math.ceil(((ra || hint || 3 + attempt) + 0.5) * 1000));
        await sleep(waitMs);
        continue;
      }
      const e = new Error(`HTTP ${res.status}`);
      e.detail = txt.slice(0, 200);
      throw e;
    }

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      // A too-high token cap (400) must NOT blank the whole paper — halve it and
      // retry so the conversion still succeeds at a smaller, accepted cap.
      if (res.status === 400 && mt > 1024 &&
          /max.?(completion.?)?tokens|maximum context|reduce the length|too many tokens|exceeds? the/i.test(txt)) {
        mt = Math.max(1024, Math.floor(mt / 2));
        continue;
      }
      const e = new Error(`HTTP ${res.status}`);
      e.detail = txt.slice(0, 200);
      throw e;
    }

    const data = await res.json().catch(() => ({}));
    return data?.choices?.[0]?.message?.content || "";
  }
}
