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
// Tunables (env): GROQ_VISION_MODEL (default meta-llama/llama-4-scout-17b-16e-
// instruct), TEST_VISION_SCALE (render DPI factor, used for diagram crops),
// TEST_VISION_OCR_SCALE (smaller effective scale of the images SENT to the model
// — fewer tokens so long papers finish), TEST_VISION_PAGES (pages per request),
// TEST_VISION_MAXPAGES, TEST_VISION_RETRIES, TEST_VISION_DIAGRAM_PAD,
// TEST_VISION=off, TEST_VISION_DIAGRAMS=off.
// ─────────────────────────────────────────────────────────────────────────────
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { normalizeAnswer, stripNoise, repairLatexBackslashes } from "./testParser.js";
import { uploadImageBuffer, cloudinaryReady } from "./cloudinary.js";
import { callGroq, groqReady } from "./groq.js";
import { callGemini, geminiReady, geminiModel } from "./gemini.js";

const clamp01 = (n) => Math.max(0, Math.min(1, Number(n) || 0));

// Vision provider. Gemini (2.5-flash) is markedly better than Groq's llama-4-scout
// at LOCATING figures — flagging hasDiagram + a tight bbox for question figures AND
// picture-style options — which is what the diagram crops depend on. Default to
// Gemini; TEST_VISION_PROVIDER=groq switches back. Both clients take the same
// `parts` shape (text + {inline_data}) and throw a tagged DAILY_LIMIT on quota.
const visionProvider = () => (process.env.TEST_VISION_PROVIDER || "gemini").toLowerCase();
const visionReady = () => (visionProvider() === "groq" ? groqReady() : geminiReady());
const visionModel = () =>
  visionProvider() === "groq"
    ? process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct"
    : process.env.GEMINI_VISION_MODEL || geminiModel("gemini-2.5-flash");
function callVisionProvider({ system, parts, maxTokens, model, retries }) {
  if (visionProvider() === "groq") return callGroq({ system, parts, maxTokens, model, retries });
  // thinkingBudget 0 keeps 2.5's output budget for the JSON (not chain-of-thought).
  return callGemini({ system, parts, maxTokens, model, retries, json: true, thinkingBudget: 0 });
}

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
async function cropDiagram(pngBuffer, bbox, pad = Number(process.env.TEST_VISION_DIAGRAM_PAD) || 0.04) {
  if (!Array.isArray(bbox) || bbox.length < 4) return null;
  // Coordinates should be 0..1 fractions, but a vision model may emit 0..1000
  // (Gemini's native detection scale) or 0..100 percentages. Detect by the max
  // magnitude and rescale to fractions first, so a valid box isn't clamped to a
  // zero-area (all-1) crop and silently dropped.
  let coords = bbox.slice(0, 4).map(Number);
  const mx = Math.max(...coords.map((n) => Math.abs(Number(n) || 0)));
  if (mx > 1.5) coords = coords.map((n) => n / (mx > 100 ? 1000 : 100));
  let [x0, y0, x1, y1] = coords.map(clamp01);
  // Vision models often emit the corners swapped (x1<x0) or as [x,y,w,h]; sort so
  // a valid figure isn't silently dropped as a zero/negative-area box.
  if (x1 < x0) [x0, x1] = [x1, x0];
  if (y1 < y0) [y0, y1] = [y1, y0];
  x0 = clamp01(x0 - pad); y0 = clamp01(y0 - pad); x1 = clamp01(x1 + pad); y1 = clamp01(y1 + pad);
  if (x1 - x0 < 0.02 || y1 - y0 < 0.02) return null;
  const require = createRequire(import.meta.url);
  const { createCanvas, loadImage } = await import(pathToFileURL(require.resolve("@napi-rs/canvas")).href);
  const img = await loadImage(pngBuffer);
  const sx = Math.round(x0 * img.width), sy = Math.round(y0 * img.height);
  const sw = Math.round((x1 - x0) * img.width), sh = Math.round((y1 - y0) * img.height);
  if (sw < 16 || sh < 16) return null;
  const cv = createCanvas(sw, sh);
  const ctx = cv.getContext("2d");
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  dewatermark(ctx, sw, sh);
  // The vision model frequently flags a figure where there is none (e.g. a plain
  // text option) or gives a bbox that lands on blank page margin. That yields an
  // all-white crop which renders as an ugly EMPTY image box next to the question/
  // option. Drop a near-blank crop so the question shows no box and a text option
  // shows just its text. TEST_VISION_DIAGRAM_MININK (default 0.003 = 0.3% of
  // pixels must be ink) tunes the threshold.
  if (isBlankCrop(ctx, sw, sh)) return null;
  return cv.toBuffer("image/png");
}

// True when a crop is effectively empty: fewer than a tiny fraction of its pixels
// are "ink" (darker than light-grey, after the watermark has been whitened out).
function isBlankCrop(ctx, w, h) {
  const minInk = Math.min(0.05, Math.max(0, Number(process.env.TEST_VISION_DIAGRAM_MININK) || 0.003));
  if (minInk <= 0) return false;
  let data;
  try { data = ctx.getImageData(0, 0, w, h).data; } catch { return false; }
  let ink = 0;
  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (lum < 200) ink++; // darker than light grey ⇒ real content (line/label/text)
  }
  return ink / (w * h) < minInk;
}

// Coaching papers tile a faint "mathongo"-style watermark across every page, so
// it inevitably lands inside a cropped figure. The watermark is LIGHT-coloured
// while real figure lines/text/labels are dark — so we push every light-but-not-
// pure-black pixel to white: the watermark vanishes and the diagram stays crisp.
// Off via TEST_VISION_DEWATERMARK=off; TEST_VISION_DEWATERMARK_LEVEL (default 185)
// is the luminance above which a pixel counts as background.
function dewatermark(ctx, w, h) {
  if (String(process.env.TEST_VISION_DEWATERMARK || "").toLowerCase() === "off") return;
  const level = Math.min(245, Math.max(120, Number(process.env.TEST_VISION_DEWATERMARK_LEVEL) || 185));
  let imgData;
  try { imgData = ctx.getImageData(0, 0, w, h); } catch { return; }
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    if (lum >= level) { d[i] = d[i + 1] = d[i + 2] = 255; d[i + 3] = 255; }
  }
  ctx.putImageData(imgData, 0, 0);
}

const VISION_SYS =
  'You read images of exam-paper pages and output ONLY JSON of the form ' +
  '{"questions":[{"qno":1,"text":"...","subject":"","type":"single","options":[{"key":"1","text":"...","hasDiagram":false,"page":1,"bbox":[0,0,0,0]}],"correct":"1","explanation":"","hasDiagram":false,"page":1,"bbox":[0,0,0,0]}]}. ' +
  "Transcribe each question and ALL its options exactly as printed, including every mathematical expression — wrap ALL maths in LaTeX delimiters $...$ (e.g. $\\frac{\\beta}{\\alpha}$, $x^2+1$, $\\alpha,\\beta\\in\\mathbb{R}$). " +
  'Use the printed question number for "qno". Map option labels A/B/C/D or (1)-(4) to "1","2","3","4". ' +
  'For an MCQ every "single" question MUST have all four options. Fill each option\'s "text" with the option exactly as printed (use LaTeX for any maths); never leave a purely-textual option blank. Only "integer" questions may have empty options. ' +
  'A question is "integer" ONLY when the paper prints NO labelled options for it. If FOUR labelled options (1)-(4) or (A)-(D) are printed — even when they are plain numbers like 0.5, 1.2, 0.25 — set "type":"single" and fill ALL four options; NEVER mark it "integer" just because the stem has a blank/underscore (e.g. "the height will be ____ cm"). Only when there are genuinely no printed options set "type":"integer", "options":[] and "correct" to the number. ' +
  'TABLES — if a question contains a small data / values / frequency TABLE, reproduce it inside "text" as a GitHub-flavoured Markdown table: a header row, then a separator row of dashes (| --- | --- |), then each data row, with EACH ROW on its own line (real line breaks). Put any maths in the cells in $...$. ' +
  'If the page shows the answer (e.g. "Answer Key : (3)") put it in "correct" ("1"-"4" for MCQ, the number for integer); otherwise "correct":"". ' +
  'ALWAYS set "subject" for EVERY question to exactly one of "Physics", "Chemistry", "Maths" or "Biology" — never leave it blank. Section headings (e.g. "PHYSICS", "CHEMISTRY", "SECTION B — Chemistry"), the topic of the question, and the position in the paper all indicate the subject; carry the most recent section heading forward to every question under it. ' +
  'DIAGRAMS — give a bounding box for any figure so it can be cropped from the page. Coordinates are fractions of the page the figure is on (0=left/top, 1=right/bottom); "page" is the 1-based index of that page AMONG THE IMAGES IN THIS REQUEST. Every box must TIGHTLY enclose the WHOLE figure with all its parts/labels but EXCLUDE any page watermark, logo, website/URL, coaching-institute name or batch/branding text. ' +
  '(a) QUESTION figure — if the question stem includes or refers to a FIGURE / DIAGRAM / GRAPH / CIRCUIT / RAY DIAGRAM / STRUCTURE / TABLE-as-image, set "hasDiagram":true with "page" and "bbox" ON THE QUESTION object. Phrases like "refer the figure", "as shown", "in the figure/diagram/graph", "the circuit shown", "the arrangement shown" ALWAYS mean a figure is present — never omit it. ' +
  '(b) OPTION figures — when the ANSWER OPTIONS THEMSELVES are pictures (e.g. four graphs / four structures / four circuits / four waveforms to choose between), set "hasDiagram":true with "page" and "bbox" ON EACH SUCH OPTION object, each box enclosing ONLY that one option\'s picture (never its A/B/C/D label or a neighbouring option). Keep a short caption in that option\'s "text" if printed, otherwise leave "text" empty for a picture-only option. ' +
  'Set "hasDiagram":false (page/bbox may be omitted) for any part that is purely text/equations with no figure. ' +
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

// Return a downscaled copy of a page PNG (ratio < 1). The model reads these
// smaller images, which cost FAR fewer vision tokens — so a long paper finishes
// within a rate-limited tier's budget instead of dying after the first section —
// while diagrams are still cropped from the full-res page so figures stay sharp.
// Falls back to the original buffer if resize is unavailable, so OCR never fails.
async function downscalePng(pngBuffer, ratio) {
  if (!(ratio > 0) || ratio >= 1) return pngBuffer;
  try {
    const require = createRequire(import.meta.url);
    const { createCanvas, loadImage } = await import(pathToFileURL(require.resolve("@napi-rs/canvas")).href);
    const img = await loadImage(pngBuffer);
    const w = Math.max(1, Math.round(img.width * ratio));
    const h = Math.max(1, Math.round(img.height * ratio));
    const cv = createCanvas(w, h);
    cv.getContext("2d").drawImage(img, 0, 0, w, h);
    return cv.toBuffer("image/png");
  } catch { return pngBuffer; }
}

// One vision request. The page PNGs ride along as inline image parts (callGroq
// maps them to OpenAI image_url data-URLs). callGroq handles 429/5xx retries
// (honouring Retry-After), auto-halves an over-large token cap, and throws a
// tagged DAILY_LIMIT when the per-day quota is gone, so the conversion fails fast
// rather than hanging.
async function callVision(model, images, maxTokens) {
  const parts = [{ text: "Transcribe every question shown in these page image(s)." }];
  for (const png of images) {
    parts.push({ inline_data: { mime_type: "image/png", data: png.toString("base64") } });
  }
  // Be patient with sustained per-minute rate limits: a big paper fires many
  // batches, and giving up too early is how later questions get silently dropped.
  const retries = Math.min(20, Math.max(4, Number(process.env.TEST_VISION_RETRIES) || 12));
  const text = await callVisionProvider({ system: VISION_SYS, parts, maxTokens, model, retries });
  // Repair under-escaped LaTeX backslashes before parsing, else \frac/\sqrt get
  // mangled into control chars (or rejected) by JSON.parse.
  const c = repairLatexBackslashes(text || "");
  try { const p = JSON.parse(c); return Array.isArray(p) ? p : (p?.questions || []); }
  catch { return salvageQuestions(c); } // truncated/!valid JSON — keep what completed
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
  // an option counts as "filled" if it has text OR a cropped picture
  (q.options?.reduce((s, o) => s + (String(o.text).trim() || o.image ? 1 : 0), 0) || 0) * 60 +
  (q.options?.reduce((s, o) => s + (o.image ? 1 : 0), 0) || 0) * 20 + // prefer the variant that recovered option figures
  (q.correct ? 40 : 0) +
  (q.image ? 80 : 0);

// Render the PDF and transcribe its questions with a vision model.
// answerKey (qno -> answer, parsed from the text layer) fills any answer the
// model misses. Returns { questions, error } — questions [] on failure.
export async function extractWithVision(pdfBuffer, { answerKey = {} } = {}) {
  if (!visionReady()) {
    const key = visionProvider() === "groq" ? "GROQ_API_KEY" : "GEMINI_API_KEY";
    return { questions: [], error: `AI vision is off (${key} not set on the server)` };
  }

  const model = visionModel();
  // Defaults kept conservative for rate-limited tiers: 2 pages per request at
  // scale 1.5, 2 in flight, overlapping work — ~2x faster than one-at-a-time.
  // Bump TEST_VISION_PAGES / _CONCURRENCY / _SCALE on a paid tier (higher RPM)
  // for sub-minute runs.
  // Default 2 (was 1.5): sharper pages so the model reads dense maths/options
  // accurately AND the diagram crops are crisp enough to read on a phone.
  const scale = Math.min(3, Math.max(1, Number(process.env.TEST_VISION_SCALE) || 2));
  // OCR images are sent to the model DOWNSCALED to this effective scale: fewer
  // vision tokens per page, so a full 75-question paper fits a rate-limited/free
  // tier's budget and finishes, instead of stopping after the first section.
  // Diagrams are still cropped from the full-res `pages`, so figures stay crisp.
  const ocrScale = Math.min(scale, Math.max(0.7, Number(process.env.TEST_VISION_OCR_SCALE) || 1.5));
  const perBatch = Math.min(5, Math.max(1, Number(process.env.TEST_VISION_PAGES) || 2));
  const maxPages = Math.min(80, Math.max(1, Number(process.env.TEST_VISION_MAXPAGES) || 50));
  const concurrency = Math.min(6, Math.max(1, Number(process.env.TEST_VISION_CONCURRENCY) || 2));

  let pages;
  try { pages = await renderPages(pdfBuffer, scale); }
  catch (e) { return { questions: [], error: `Couldn't render the PDF to images (${e?.message || "render error"})` }; }
  if (!pages.length) return { questions: [], error: "The PDF has no pages to read" };
  const truncated = pages.length > maxPages;
  pages = pages.slice(0, maxPages);

  // Downscaled copies for the model; the full-res `pages` are kept for crops.
  const ocrPages = ocrScale < scale - 0.01
    ? await Promise.all(pages.map((p) => downscalePng(p, ocrScale / scale)))
    : pages;

  // Batch by START INDEX so each worker reads the downscaled OCR copy of its
  // pages but crops diagrams from the matching full-res pages.
  const batches = [];
  for (let i = 0; i < pages.length; i += perBatch) batches.push(i);

  // Extract diagram crops unless turned off / Cloudinary not configured.
  const wantDiagrams = String(process.env.TEST_VISION_DIAGRAMS || "").toLowerCase() !== "off" && cloudinaryReady();

  let firstErr = "";
  let dailyLimit = false;
  const results = await mapPool(batches, concurrency, async (start) => {
    if (dailyLimit) return []; // stop hammering once the daily quota is gone
    const batchStart = start; // absolute 0-based index of imgs[0]
    const imgs = pages.slice(start, start + perBatch);        // full-res, for crops
    const ocrImgs = ocrPages.slice(start, start + perBatch);  // downscaled, for OCR
    let arr;
    // 6000 tokens (was 4000): dense 2-page batches overran 4000 and truncated;
    // callVision auto-halves if even this is too high for the model/tier.
    try { arr = await callVision(model, ocrImgs, Number(process.env.TEST_VISION_MAXTOKENS) || 8000); }
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
    // Crop & upload any diagram the model located — for the question stem AND for
    // figure-style options — so figure-based questions render natively in the CBT.
    if (wantDiagrams && Array.isArray(arr)) {
      // The model is asked for a batch-local page index but often returns the
      // absolute document page. Accept both: a value within the batch is local;
      // anything larger is absolute and mapped back into the batch.
      const pageIndexFor = (page) => {
        const p = Number(page);
        let idx = 0;
        if (Number.isFinite(p) && p >= 1) idx = p <= imgs.length ? p - 1 : p - 1 - batchStart;
        return idx >= 0 && idx < imgs.length ? idx : 0;
      };
      const cropUpload = async (pageIdx, bbox) => {
        try {
          const crop = await cropDiagram(imgs[pageIdx], bbox);
          if (crop) return await uploadImageBuffer(crop, { folder: "tests/diagrams" });
        } catch (e) { console.error("[visionParser] diagram crop/upload failed", e.message); }
        return "";
      };
      for (const q of arr) {
        if (q?.hasDiagram && Array.isArray(q?.bbox)) {
          const img = await cropUpload(pageIndexFor(q.page), q.bbox);
          if (img) q.image = img;
        }
        // Picture options (four graphs/structures to choose between): crop each.
        for (const o of Array.isArray(q?.options) ? q.options : []) {
          if (o?.hasDiagram && Array.isArray(o?.bbox)) {
            const img = await cropUpload(pageIndexFor(o.page ?? q.page), o.bbox);
            if (img) o.image = img;
          }
        }
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
        ? q.options.slice(0, 4).map((o, j) => ({
            key: normalizeAnswer(o?.key) || String(j + 1),
            text: stripNoise(o?.text).slice(0, 1000),
            image: typeof o?.image === "string" && o.image.startsWith("http") ? o.image : "",
          }))
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
  const withDiagrams = questions.filter((q) => q.image).length;
  console.log(`[visionParser] ${batches.length} batch(es) → ${questions.length} questions, ${withDiagrams} with diagrams${firstErr ? ` · note: ${firstErr}` : ""}`);
  if (!questions.length) return { questions: [], error: firstErr || "AI vision couldn't read any questions from the PDF" };
  return { questions, error: truncated ? `Only the first ${maxPages} pages were read` : firstErr };
}
