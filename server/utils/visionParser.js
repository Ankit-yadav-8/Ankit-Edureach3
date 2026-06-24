// ─────────────────────────────────────────────────────────────────────────────
// Vision-based test extractor.
//
// Math-heavy exam PDFs (JEE/NEET) store their equations as vector glyphs, not as
// a readable text layer — so text parsing recovers garbled stems and empty
// options. Instead we render each page to an image and ask a Groq vision model
// to transcribe the questions, options and answer key as JSON, with all maths in
// LaTeX ($…$) so the player renders it via KaTeX.
//
// Pages are rendered with pdf-to-img (pdfjs + @napi-rs/canvas, prebuilt — no
// system deps) and sent in small page-batches with limited concurrency to stay
// within model image limits and keep latency reasonable.
//
// Tunables (env): GROQ_VISION_MODEL, TEST_VISION_SCALE (render DPI factor),
// TEST_VISION_PAGES (pages per request), TEST_VISION_MAXPAGES, TEST_VISION=off.
// ─────────────────────────────────────────────────────────────────────────────
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { normalizeAnswer, stripNoise, repairLatexBackslashes } from "./testParser.js";
import { uploadImageBuffer, cloudinaryReady } from "./cloudinary.js";

const clamp01 = (n) => Math.max(0, Math.min(1, Number(n) || 0));

// Recover whole question objects from a response that didn't parse as JSON —
// usually because the model overran max_tokens and the array was cut off
// mid-element. Brace-matching pulls out every complete {...} that carries a
// "qno", so a truncated batch still yields the questions that finished instead
// of dropping the entire page batch (which silently loses ~4-6 questions).
function salvageQuestions(text) {
  const out = [];
  if (typeof text !== "string") return out;
  // Skip the outer {"questions":[ … ]} wrapper so we match the elements, not the
  // (unterminated) outer object.
  let i = text.indexOf("[");
  if (i < 0) i = 0;
  for (; i < text.length; i++) {
    if (text[i] !== "{") continue;
    let depth = 0, inStr = false, esc = false, closed = false, j = i;
    for (; j < text.length; j++) {
      const ch = text[j];
      if (esc) { esc = false; continue; }
      if (ch === "\\") { esc = true; continue; }
      if (ch === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (ch === "{") depth++;
      else if (ch === "}" && --depth === 0) { closed = true; break; }
    }
    if (!closed) break; // truncated final object — nothing complete past here
    const chunk = text.slice(i, j + 1);
    if (/"qno"\s*:/.test(chunk)) { try { out.push(JSON.parse(chunk)); } catch { /* skip */ } }
    i = j;
  }
  return out;
}

// Crop a diagram region (normalized bbox, padded a little) out of a page PNG and
// return a PNG buffer, or null if the box is missing/too small. Uses the
// prebuilt @napi-rs/canvas that ships with pdf-to-img — no extra dependency.
async function cropDiagram(pngBuffer, bbox, pad = 0.02) {
  if (!Array.isArray(bbox) || bbox.length < 4) return null;
  let [x0, y0, x1, y1] = bbox.map(clamp01);
  x0 = clamp01(x0 - pad); y0 = clamp01(y0 - pad); x1 = clamp01(x1 + pad); y1 = clamp01(y1 + pad);
  if (x1 - x0 < 0.03 || y1 - y0 < 0.03) return null;
  const require = createRequire(import.meta.url);
  const { createCanvas, loadImage } = await import(pathToFileURL(require.resolve("@napi-rs/canvas")).href);
  const img = await loadImage(pngBuffer);
  const sx = Math.round(x0 * img.width), sy = Math.round(y0 * img.height);
  const sw = Math.round((x1 - x0) * img.width), sh = Math.round((y1 - y0) * img.height);
  if (sw < 24 || sh < 24) return null;
  const cv = createCanvas(sw, sh);
  cv.getContext("2d").drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  return cv.toBuffer("image/png");
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const VISION_SYS =
  'You read images of exam-paper pages and output ONLY JSON of the form ' +
  '{"questions":[{"qno":1,"text":"...","subject":"","type":"single","options":[{"key":"1","text":"..."},{"key":"2","text":"..."},{"key":"3","text":"..."},{"key":"4","text":"..."}],"correct":"1","explanation":""}]}. ' +
  "Transcribe each question and ALL its options exactly as printed, including every mathematical expression — wrap ALL maths in LaTeX delimiters $...$ (e.g. $\\frac{\\beta}{\\alpha}$, $x^2+1$, $\\alpha,\\beta\\in\\mathbb{R}$). " +
  'Use the printed question number for "qno". Map option labels A/B/C/D or (1)-(4) to "1","2","3","4". ' +
  'For numerical / integer-answer questions set "type":"integer", "options":[] and "correct" to the number. ' +
  'If the page shows the answer (e.g. "Answer Key : (3)") put it in "correct" ("1"-"4" for MCQ, the number for integer); otherwise "correct":"". ' +
  'Set "subject" to the topic when obvious (Physics/Chemistry/Maths/Biology), else "". ' +
  'If a question includes or refers to a FIGURE / DIAGRAM / GRAPH / CIRCUIT / RAY DIAGRAM / STRUCTURE / TABLE-as-image, you MUST add ' +
  '"hasDiagram":true, "page": the 1-based index (among the images in THIS request) of the page it appears on, and ' +
  '"bbox":[x0,y0,x1,y1] — a generous bounding box around the whole figure in fractions of that page (0=left/top, 1=right/bottom). ' +
  'Phrases like "refer the figure", "as shown", "in the figure/diagram/graph", "the circuit shown", "the arrangement shown" ALWAYS mean a figure is present — never omit hasDiagram/bbox for those. Only omit these when the question is purely text/equations. ' +
  "Ignore page headers, footers, watermarks and website names. Do not invent questions. Output JSON only, no prose.";

// Render every page of the PDF buffer to a PNG Buffer.
async function renderPages(pdfBuffer, scale) {
  const require = createRequire(import.meta.url);
  const { pdf } = await import(pathToFileURL(require.resolve("pdf-to-img")).href);
  const doc = await pdf(pdfBuffer, { scale });
  const pages = [];
  for await (const img of doc) pages.push(img);
  return pages;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// One vision request, retrying on rate-limit (429) and transient 5xx. Groq's
// free tier caps tokens-per-minute, so we honour the Retry-After header / the
// "try again in Ns" hint instead of failing the whole conversion.
async function callVision(model, key, images, maxTokens, retries = 9) {
  const content = [{ type: "text", text: "Transcribe every question shown in these page image(s)." }];
  for (const png of images) {
    content.push({ type: "image_url", image_url: { url: "data:image/png;base64," + png.toString("base64") } });
  }
  const payload = JSON.stringify({
    model, temperature: 0, max_tokens: maxTokens,
    response_format: { type: "json_object" },
    messages: [{ role: "system", content: VISION_SYS }, { role: "user", content }],
  });

  for (let attempt = 0; ; attempt++) {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: payload,
    });
    if (res.status === 429 || res.status >= 500) {
      const body = await res.text().catch(() => "");
      // Per-DAY quota (TPD/RPD) won't reset for hours — retrying is pointless and
      // would hang for ages. Fail fast with a clear, distinct reason.
      if (/per day|\bTPD\b|\bRPD\b|tokens per day|requests per day/i.test(body)) {
        const e = new Error("daily AI quota reached");
        e.code = "DAILY_LIMIT";
        e.detail = body.slice(0, 200);
        throw e;
      }
      if (attempt < retries) {
        const ra = Number(res.headers.get("retry-after"));
        const hint = Number((body.match(/try again in ([\d.]+)\s*s/i) || [])[1]);
        const waitMs = Math.min(30000, Math.ceil(((ra || hint || 3 + attempt) + 0.5) * 1000));
        await sleep(waitMs);
        continue;
      }
      const e = new Error(`HTTP ${res.status}`);
      e.detail = body.slice(0, 200);
      throw e;
    }
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      const e = new Error(`HTTP ${res.status}`);
      e.detail = body.slice(0, 200);
      throw e;
    }
    // Repair under-escaped LaTeX backslashes before parsing, else \frac/\sqrt get
    // mangled into control chars (or rejected) by JSON.parse.
    const c = repairLatexBackslashes((await res.json()).choices?.[0]?.message?.content || "");
    try { const p = JSON.parse(c); return Array.isArray(p) ? p : (p?.questions || []); }
    catch { return salvageQuestions(c); } // truncated/!valid JSON — keep what completed
  }
}

// Run fn over items with a bounded number of workers in flight.
async function mapPool(items, concurrency, fn) {
  const out = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) { const i = next++; out[i] = await fn(items[i], i); }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return out;
}

const richness = (q) =>
  (q.text?.length || 0) +
  (q.options?.reduce((s, o) => s + (String(o.text).trim() ? 1 : 0), 0) || 0) * 60 +
  (q.correct ? 40 : 0) +
  (q.image ? 80 : 0);

// Render the PDF and transcribe its questions with a vision model.
// answerKey (qno -> answer, parsed from the text layer) fills any answer the
// model misses. Returns { questions, error } — questions [] on failure.
export async function extractWithVision(pdfBuffer, { answerKey = {} } = {}) {
  if (!process.env.GROQ_API_KEY) return { questions: [], error: "AI vision is off (GROQ_API_KEY not set on the server)" };

  const model = process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct";
  // Defaults tuned for Groq's free tier (30k tokens/min): 2 pages per request at
  // scale 1.5 is ~5k tokens, and 2 in flight (~10k) stays under the cap while
  // overlapping work — ~2x faster than one-at-a-time. Bump TEST_VISION_PAGES /
  // _CONCURRENCY / _SCALE on a paid tier (higher TPM) for sub-minute runs.
  const scale = Math.min(3, Math.max(1, Number(process.env.TEST_VISION_SCALE) || 1.5));
  const perBatch = Math.min(5, Math.max(1, Number(process.env.TEST_VISION_PAGES) || 2));
  const maxPages = Math.min(80, Math.max(1, Number(process.env.TEST_VISION_MAXPAGES) || 50));
  const concurrency = Math.min(6, Math.max(1, Number(process.env.TEST_VISION_CONCURRENCY) || 2));

  let pages;
  try { pages = await renderPages(pdfBuffer, scale); }
  catch (e) { return { questions: [], error: `Couldn't render the PDF to images (${e?.message || "render error"})` }; }
  if (!pages.length) return { questions: [], error: "The PDF has no pages to read" };
  const truncated = pages.length > maxPages;
  pages = pages.slice(0, maxPages);

  const batches = [];
  for (let i = 0; i < pages.length; i += perBatch) batches.push(pages.slice(i, i + perBatch));

  // Extract diagram crops unless turned off / Cloudinary not configured.
  const wantDiagrams = String(process.env.TEST_VISION_DIAGRAMS || "").toLowerCase() !== "off" && cloudinaryReady();

  let firstErr = "";
  let dailyLimit = false;
  const results = await mapPool(batches, concurrency, async (imgs, bi) => {
    if (dailyLimit) return []; // stop hammering once the daily quota is gone
    const batchStart = bi * perBatch; // absolute 0-based index of imgs[0]
    let arr;
    // 8000 tokens (was 4000): a 2-page batch of dense JEE questions with LaTeX
    // options overran 4000, truncating the JSON and dropping the whole batch.
    try { arr = await callVision(model, process.env.GROQ_API_KEY, imgs, 8000); }
    catch (e) {
      if (e.code === "DAILY_LIMIT") {
        dailyLimit = true;
        firstErr = "Daily AI quota reached — try again tomorrow, or set a paid GROQ_API_KEY for higher limits";
      } else if (!firstErr) {
        firstErr = `AI vision error (${e.message}${e.detail ? `: ${e.detail}` : ""})`;
      }
      console.error("[visionParser]", e.message, e.detail || "");
      return [];
    }
    // Crop & upload any diagram the model located, attaching it as the question
    // image so figure-based questions render natively in the CBT.
    if (wantDiagrams && Array.isArray(arr)) {
      for (const q of arr) {
        if (!q?.hasDiagram || !q?.bbox) continue;
        // The model is asked for a batch-local page index but often returns the
        // absolute document page. Accept both: a value within the batch is
        // local; anything larger is absolute and mapped back into the batch.
        const p = Number(q.page);
        let pageIdx = 0;
        if (Number.isFinite(p) && p >= 1) pageIdx = p <= imgs.length ? p - 1 : p - 1 - batchStart;
        if (!(pageIdx >= 0 && pageIdx < imgs.length)) pageIdx = 0;
        try {
          const crop = await cropDiagram(imgs[pageIdx], q.bbox);
          if (crop) q.image = await uploadImageBuffer(crop, { folder: "tests/diagrams" });
        } catch (e) { console.error("[visionParser] diagram crop/upload failed", e.message); }
      }
    }
    return arr;
  });

  // Merge across batches, de-duping by qno and keeping the richest transcription.
  const byQno = new Map();
  for (const arr of results) {
    for (const q of Array.isArray(arr) ? arr : []) {
      const qno = Number(q?.qno);
      if (!qno || qno < 1 || qno > 400) continue;
      const type = q?.type === "integer" ? "integer" : "single";
      const options = type === "single" && Array.isArray(q?.options)
        ? q.options.slice(0, 4).map((o, j) => ({ key: normalizeAnswer(o?.key) || String(j + 1), text: stripNoise(o?.text).slice(0, 1000), image: "" }))
        : [];
      const cand = {
        qno,
        text: stripNoise(q?.text).slice(0, 4000),
        image: typeof q?.image === "string" && q.image.startsWith("http") ? q.image : "",
        options,
        type,
        subject: String(q?.subject || "").slice(0, 40),
        correct: normalizeAnswer(q?.correct) || normalizeAnswer(answerKey[qno]),
        explanation: stripNoise(q?.explanation).slice(0, 2000),
      };
      const prev = byQno.get(qno);
      if (!prev || richness(cand) > richness(prev)) byQno.set(qno, cand);
    }
  }

  const questions = [...byQno.values()].sort((a, b) => a.qno - b.qno);
  if (!questions.length) return { questions: [], error: firstErr || "AI vision couldn't read any questions from the PDF" };
  return { questions, error: truncated ? `Only the first ${maxPages} pages were read` : firstErr };
}
