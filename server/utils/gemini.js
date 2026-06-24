// ─────────────────────────────────────────────────────────────────────────────
// Google Gemini client — shared by the test-paper converters (text + vision).
//
// Gemini is multimodal, so the SAME model reads both raw paper text and rendered
// page images; callers just vary the `parts` they pass (text, or text + images).
// We hit the generateContent REST endpoint directly (no SDK) and ask for a JSON
// response via responseMimeType, mirroring what the Groq path used.
//
// Tunables (env): GEMINI_API_KEY, GEMINI_MODEL (default gemini-2.5-flash — Pro
// has 0 free-tier quota and needs billing), GEMINI_THINKING_BUDGET (cap/disable
// 2.5-model "thinking" so the JSON isn't truncated; 0 disables it on Flash).
// ─────────────────────────────────────────────────────────────────────────────
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export function geminiReady() {
  return !!process.env.GEMINI_API_KEY;
}

export function geminiModel(fallback = "gemini-2.5-flash") {
  return process.env.GEMINI_MODEL || fallback;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// One generateContent call. `parts` is the user-message parts array — text and/or
// { inline_data: { mime_type, data } } images. Returns the model's text output
// (the JSON string the caller then parses). Retries on 429 / 5xx, honouring
// Gemini's RetryInfo.retryDelay, and throws a tagged DAILY_LIMIT error when a
// per-day quota is exhausted (retrying then is pointless — it won't reset today).
export async function callGemini({
  system,
  parts,
  maxTokens = 8192,
  temperature = 0,
  model = geminiModel(),
  retries = 9,
} = {}) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");
  const url = `${GEMINI_BASE}/${encodeURIComponent(model)}:generateContent`;

  const generationConfig = {
    temperature,
    maxOutputTokens: maxTokens,
    responseMimeType: "application/json",
  };
  // 2.5 models "think" before answering, which spends the output budget and can
  // truncate the JSON. Cap the thinking budget so the transcription itself fits.
  if (/2\.5/.test(model)) {
    const tb = Number(process.env.GEMINI_THINKING_BUDGET);
    generationConfig.thinkingConfig = { thinkingBudget: Number.isFinite(tb) ? tb : 2048 };
  }

  const body = JSON.stringify({
    ...(system ? { system_instruction: { parts: [{ text: system }] } } : {}),
    contents: [{ role: "user", parts }],
    generationConfig,
  });

  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body,
      });
    } catch (e) {
      if (attempt < retries) { await sleep(Math.min(30000, (2 + attempt) * 1000)); continue; }
      throw e;
    }

    if (res.status === 429 || res.status >= 500) {
      const txt = await res.text().catch(() => "");
      // Per-DAY quota won't reset for hours — fail fast with a distinct reason.
      if (/per ?day|PerDay|requests? per day|quota.*day|GenerateRequestsPerDay/i.test(txt)) {
        const e = new Error("daily AI quota reached");
        e.code = "DAILY_LIMIT";
        e.detail = txt.slice(0, 200);
        throw e;
      }
      if (attempt < retries) {
        const hint = Number((txt.match(/"retryDelay"\s*:\s*"?([\d.]+)s/i) || [])[1]);
        const waitMs = Math.min(30000, Math.ceil(((hint || 3 + attempt) + 0.5) * 1000));
        await sleep(waitMs);
        continue;
      }
      const e = new Error(`HTTP ${res.status}`);
      e.detail = txt.slice(0, 200);
      throw e;
    }

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      const e = new Error(`HTTP ${res.status}`);
      e.detail = txt.slice(0, 200);
      throw e;
    }

    const data = await res.json().catch(() => ({}));
    const parts2 = data?.candidates?.[0]?.content?.parts || [];
    return parts2.map((p) => p?.text || "").join("");
  }
}
