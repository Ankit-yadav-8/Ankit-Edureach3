// ─────────────────────────────────────────────────────────────────────────────
// Test PDF → structured CBT converter.
//
// The admin uploads a question paper PDF and an answer-key PDF (both on
// Cloudinary). Here we fetch their bytes, extract the text layer and apply
// heuristics to recover:
//   • questions  — number, stem text and up to 4 options (A–D / 1–4)
//   • answer key — qno → correct option / integer
//
// PDF layouts vary wildly, so this is best-effort: option labels are normalised
// to digits ("1".."4") and the admin gets a review/edit step before publishing,
// which is the safety net against a noisy parse. Image-only (scanned) PDFs have
// no text layer and will yield nothing — the admin then fills the grid by hand.
// ─────────────────────────────────────────────────────────────────────────────
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { callGroq, groqReady, groqModel } from "./groq.js";
import { recoverSubjects, normalizeSubject } from "./subjects.js";

// Normalise an answer token to the canonical form used for grading.
// Single-correct → digit "1".."4" (letters A–D folded to 1–4). Integer answers
// are returned trimmed as-is. Returns "" for anything unrecognised.
export function normalizeAnswer(raw) {
  const t = String(raw ?? "").trim().toUpperCase();
  if (!t) return "";
  if (/^[A-D]$/.test(t)) return String("ABCD".indexOf(t) + 1);
  if (/^[1-4]$/.test(t)) return t;
  const num = t.replace(/[^0-9.\-]/g, "");
  return num || "";
}

// Strip site watermarks / page-footer boilerplate that PDF extraction leaves in
// the question text — URLs, hashtags, vendor branding, the "Answer Key(s)"
// label and the "JEE Main 2026 · 02 April (Morning Shift)" header. Extra
// patterns can be added via TEST_PDF_STRIP (comma-separated, case-insensitive).
const EXTRA_STRIP = String(process.env.TEST_PDF_STRIP || "")
  .split(",").map((s) => s.trim()).filter(Boolean);
// LLMs (vision and text) routinely emit LaTeX with SINGLE backslashes (\frac,
// \sqrt) inside JSON strings, which is invalid: JSON.parse turns \f \b \n \r \t
// into control characters (so "\frac" becomes formfeed+"rac", which stripNoise
// then collapses to " rac") and rejects the rest. Repair the raw response by
// escaping every lone backslash that isn't a genuine JSON escape, so each LaTeX
// command survives JSON.parse as a real backslash KaTeX can render.
export function repairLatexBackslashes(raw) {
  if (typeof raw !== "string" || raw.indexOf("\\") < 0) return raw;
  return raw.replace(/\\(\\|"|\/|u[0-9a-fA-F]{4}|[\s\S])/g, (m, g) => {
    if (g === "\\" || g === '"' || g === "/" || /^u[0-9a-fA-F]{4}$/.test(g)) return m;
    return "\\\\" + g;
  });
}

export function stripNoise(s) {
  let out = String(s || "")
    .replace(/https?:\/\/\S+|www\.\S+/gi, " ")                 // urls
    .replace(/#\w+/g, " ")                                      // hashtags (#PaperPhodnaHai)
    .replace(/\bMathon\s?Go\b/gi, " ")                          // vendor branding (MathonGo / mathongo)
    .replace(/\bAnswer\s*Keys?\b/gi, " ")                       // footer / leftover label
    .replace(/\bJEE[-\s]*Main(?:\s+\d{4})?\b/gi, " ")          // paper header (JEE Main / JEE-Main 2026)
    .replace(/\b\d{1,2}\s+[A-Za-z]+\s*\((?:Morning|Afternoon|Evening)[^)]*\)/gi, " ") // date · shift
    .replace(/\((?:Morning|Afternoon|Evening)\s*(?:Shift|Session)\)/gi, " ") // (Morning Session)
    // ── Coaching paper footer that PDF extraction glues onto an option/stem ──
    .replace(/\bPage\s*#\s*\d*/gi, " ")                         // "Page # 1"
    .replace(/\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/g, " ")        // dd-mm-yyyy stamps
    .replace(/\b\d{3,4}-\d{3,4}-\d{2,4}\b/g, " ")             // grouped phone numbers (8888-0000-21)
    .replace(/\b\d{10}\b/g, " ")                                // 10-digit phone numbers
    // Postal address ending in a 6-digit PIN + a state abbreviation, e.g.
    // "OPPO. METRO MAS HOSPITAL, … JAIPUR - 302020 (RAJ.)".
    .replace(/[A-Z][A-Za-z0-9.,/'’&\-\s]{6,90}?\b\d{6}\b\s*\(?\s*(?:RAJ|DELHI|DEL|U\.?P\.?|M\.?P\.?|HR|GUJ|MAH|KAR|TN|AP|TS|WB|BIHAR|UK)\.?\s*\)?/gi, " ");
  for (const w of EXTRA_STRIP) {
    try { out = out.replace(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), " "); } catch { /* ignore */ }
  }
  return out
    .replace(/\s+([,.:;)])/g, "$1")
    .replace(/([,;:])(?:\s*[,;:])+/g, "$1") // collapse "9.8,;" → "9.8,"
    .replace(/\s+/g, " ")
    .replace(/[\s,;:]+$/g, "")               // drop trailing stray punctuation
    .trim();
}

// Download a (Cloudinary-hosted) PDF and return its raw bytes.
// Throws a tagged Error (err.code = "FETCH") if it can't be downloaded.
export async function fetchPdfBuffer(url) {
  let res;
  try {
    res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 CollegeParichay" }, redirect: "follow" });
  } catch (e) {
    const err = new Error(`Network error fetching the PDF: ${e.message}`);
    err.code = "FETCH";
    throw err;
  }
  if (!res.ok) {
    const err = new Error(`Couldn't download the PDF from storage (HTTP ${res.status}). If these are stored on Cloudinary, enable "PDF and ZIP files delivery" in Settings → Security.`);
    err.code = "FETCH";
    throw err;
  }
  return Buffer.from(await res.arrayBuffer());
}

// Extract the text layer from a PDF buffer. Returns "" for image-only/scanned
// PDFs (no throw) so callers can fall back to vision instead of failing.
export async function pdfTextFromBuffer(buf) {
  try {
    return String((await pdfParse(buf)).text || "");
  } catch {
    return "";
  }
}

// Download a (Cloudinary-hosted) PDF and return its extracted text.
// Throws a tagged Error (err.code) so callers can give an accurate reason:
//   FETCH   — the file couldn't be downloaded (e.g. Cloudinary delivery blocked)
//   SCANNED — downloaded fine but has no text layer (image-only / scanned)
export async function fetchPdfText(url) {
  const buf = await fetchPdfBuffer(url);
  let data;
  try {
    data = await pdfParse(buf);
  } catch (e) {
    const err = new Error(`The file isn't a readable PDF: ${e.message}`);
    err.code = "SCANNED";
    throw err;
  }
  return String(data.text || "");
}

// ── Question paper ──────────────────────────────────────────────────────────
// Split the text on "<n>." / "<n>)" markers at a line/space boundary, then pull
// option chunks out of each block. Options are matched as "(1)…(4)" or "(a)…(d)"
// or "1.…4." style. Fewer than 2 options ⇒ treated as an integer-type question.
const OPTION_RE = /(?:^|\s)\(?([A-Da-d1-4])\)\s+|(?:^|\n)\s*([A-Da-d1-4])[.)]\s+/g;

// Inline answer marker embedded in the same block as the question — for papers
// where the key sits right under each question ("Ans: B", "Answer (3)",
// "Correct option: 2", "Correct answer is D", "Answer key - 4"). The captured
// group is an option label (A–D / 1–4) or an integer. We anchor on a keyword +
// the value so ordinary option text ("…the answer to…") doesn't trigger it.
// "solution" is deliberately excluded — it usually precedes a worked explanation
// whose first number would be mistaken for the answer.
const ANSWER_RE_G = /\b(?:ans(?:wer)?(?:\s*key)?|correct(?:\s*(?:option|answer|choice))?(?:\s*is)?|answer\s*key)\b\s*[:.\-–=)]*\s*\(?\s*([A-Da-d]|[1-4]|-?\d{1,4}(?:\.\d+)?)\s*\)?/gi;

// Find the LAST inline answer marker in a block (the answer almost always comes
// after the options). Returns { value, index } or null.
function extractInlineAnswer(block) {
  ANSWER_RE_G.lastIndex = 0;
  let m, last = null;
  while ((m = ANSWER_RE_G.exec(block)) !== null) last = m;
  if (!last) return null;
  const value = normalizeAnswer(last[1]);
  return value ? { value, index: last.index } : null;
}

// Does this text contain 2+ option labels — either spaced ("(1) text (2) …")
// or glued ("(1)(2)(3)(4)")? Used to tell a real answer line (options precede
// it) from a stray "…is 4" mid-stem.
function hasOptionish(s) {
  const labels = new Set();
  const lr = /\(\s*([A-Da-d1-4])\s*\)/g;
  let m;
  while ((m = lr.exec(s)) !== null) { const k = normalizeAnswer(m[1]); if (k) labels.add(k); }
  if (labels.size >= 2) return true;
  OPTION_RE.lastIndex = 0;
  const seen = new Set();
  while ((m = OPTION_RE.exec(s)) !== null) { const k = normalizeAnswer(m[1] || m[2] || ""); if (k) seen.add(k); }
  return seen.size >= 2;
}

export function parseQuestions(text) {
  const clean = String(text || "").replace(/\r/g, "");
  // Question marker at a line start: "1." / "1)" and also "Q1." / "Q.1)" /
  // "Question 1." — exam PDFs commonly prefix the number with Q/Question.
  const markerRe = /(?:^|\n)\s*(?:Q(?:ues(?:tion)?)?\.?\s*)?(\d{1,3})[.)]\s+/gi;
  const marks = [];
  let m;
  while ((m = markerRe.exec(clean)) !== null) {
    marks.push({ qno: Number(m[1]), start: m.index + m[0].length, mEnd: m.index });
  }
  if (!marks.length) return [];

  const questions = [];
  let expected = 1;
  for (let i = 0; i < marks.length; i++) {
    const cur = marks[i];
    // Keep the numbering sane: skip markers that aren't the next expected qno
    // (stops stray "1)" inside option text from starting a bogus question).
    if (cur.qno !== expected && questions.length) continue;
    const next = marks[i + 1];
    const block = clean.slice(cur.start, next ? next.mEnd : clean.length).trim();
    const parsed = parseOneBlock(cur.qno, block);
    if (parsed) { questions.push(parsed); expected = cur.qno + 1; }
  }
  return questions;
}

function parseOneBlock(qno, block) {
  if (!block) return null;

  // Inline answer marker ("Ans: B" / "Answer Key : (2)" under the question).
  // Cut the block at the answer FIRST so trailing junk (page footers, garbled
  // math blobs) can't be mistaken for options. Guard against a stray mid-stem
  // match by only cutting when the part before it actually holds the options
  // (or the part after it doesn't) — otherwise we'd chop a real question.
  let inlineCorrect = "";
  let body = block;
  const ans = extractInlineAnswer(block);
  if (ans && ans.index > 0) {
    const head = block.slice(0, ans.index);
    if (hasOptionish(head) || !hasOptionish(block.slice(ans.index))) {
      inlineCorrect = ans.value;
      body = head;
    }
  }

  OPTION_RE.lastIndex = 0;
  const opts = [];
  let firstOptAt = -1;
  let m;
  while ((m = OPTION_RE.exec(body)) !== null) {
    const label = (m[1] || m[2] || "").toUpperCase();
    const at = m.index;
    if (firstOptAt === -1) firstOptAt = at;
    opts.push({ label, at, contentFrom: OPTION_RE.lastIndex });
  }

  // Slice each option's text up to the next option marker.
  const cleaned = [];
  for (let i = 0; i < opts.length; i++) {
    const from = opts[i].contentFrom;
    const to = i + 1 < opts.length ? opts[i + 1].at : body.length;
    cleaned.push({ key: normalizeAnswer(opts[i].label), text: stripNoise(body.slice(from, to)) });
  }
  // De-dupe to the canonical 1..4 keys, keep first occurrence, drop empties.
  const seen = new Set();
  let options = [];
  for (const o of cleaned) {
    if (!o.key || seen.has(o.key)) continue;
    seen.add(o.key);
    options.push(o);
  }

  // Glued / textless option labels — math-heavy PDFs often collapse
  // "(1) … (2) … (3) … (4)" into "(1)(2)(3)(4)" (the real values land in a
  // separate garbled blob). Detect the labels so it's still a gradable MCQ:
  // students read the actual options from the PDF shown beside the player.
  if (options.length < 2) {
    const labels = new Set();
    const lr = /\(\s*([A-Da-d1-4])\s*\)/g;
    let lm;
    while ((lm = lr.exec(body)) !== null) { const k = normalizeAnswer(lm[1]); if (k) labels.add(k); }
    if (labels.size >= 2) options = [...labels].sort().map((k) => ({ key: k, text: "" }));
  }

  // Stem = text before the first option marker (or the whole body for an
  // option-less question), with glued option-label runs and site watermarks
  // ("MathonGo", footers, URLs) stripped so they don't clutter the question.
  const stem = stripNoise(
    (firstOptAt >= 0 ? body.slice(0, firstOptAt) : body)
      .replace(/(?:\(\s*[A-Da-d1-4]\s*\)\s*){2,}/g, " ")
  );

  if (options.length >= 2) {
    return { qno, text: stem, options: options.slice(0, 4), type: "single", correct: inlineCorrect };
  }
  return { qno, text: stem, options: [], type: "integer", correct: inlineCorrect };
}

// ── Answer key ──────────────────────────────────────────────────────────────
// Two strategies, whichever recovers more answers wins:
//   1. inline pairs — "1. (3)", "1) C", "12 - B", "Q1 4" …
//   2. grid — a row of question numbers above a row of answer tokens.
export function parseAnswerKey(text) {
  const clean = String(text || "").replace(/\r/g, "");
  const inline = parseKeyInline(clean);
  const grid = parseKeyGrid(clean);
  return Object.keys(grid).length > Object.keys(inline).length ? grid : inline;
}

function parseKeyInline(clean) {
  const map = {};
  // qno, optional Q prefix handled by allowing leading letters to be ignored.
  const re = /(\d{1,3})\s*[.)\-:]\s*\(?\s*([A-Da-d]|[1-4]|-?\d{1,4})\s*\)?/g;
  let m;
  while ((m = re.exec(clean)) !== null) {
    const qno = Number(m[1]);
    if (qno < 1 || qno > 400) continue;
    const ans = normalizeAnswer(m[2]);
    if (ans && map[qno] === undefined) map[qno] = ans;
  }
  return map;
}

// Many papers print a consolidated ANSWER KEY at the END of the question paper
// (no separate key PDF, not inline under each question). Find the LAST
// "Answer Key"/"Answers"/"Solutions" heading and parse only the text after it —
// restricting to that tail stops question numbering ("1. A particle…") from being
// misread as "Q1 → A". With no heading we fall back to the distinctive
// number-row/answer-row grid, which is safe to scan over the whole document.
export function parseSelfAnswerKey(text) {
  const clean = String(text || "").replace(/\r/g, "");
  // A REAL key heading — "Answer Key(s)" at a line start, OR a line that is ONLY
  // "Answers"/"Solutions" (+ optional colon). Anchoring to the line and requiring
  // either the word "key" or a heading-only line stops prose like "The answer is…"
  // or "Answers must be marked on the OMR" from being mistaken for a key heading.
  const headRe = /^[^\S\n]*(?:answer\s*keys?\b|(?:answers?|solutions?)\s*:?[^\S\n]*$)/gim;
  let m, lastIdx = -1;
  while ((m = headRe.exec(clean)) !== null) lastIdx = m.index;
  if (lastIdx >= 0) {
    const key = parseAnswerKey(clean.slice(lastIdx));
    if (Object.keys(key).length) return key;
  }
  return parseKeyGrid(clean);
}

function parseKeyGrid(clean) {
  const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);
  const map = {};
  const tokOf = (l) => l.split(/\s+/).filter(Boolean);
  const allNums = (toks) => toks.length >= 3 && toks.every((t) => /^\d{1,3}$/.test(t));
  const allAns = (toks) => toks.length >= 3 && toks.every((t) => /^([A-Da-d]|[1-4])$/.test(t));
  for (let i = 0; i < lines.length - 1; i++) {
    const nums = tokOf(lines[i]);
    const ans = tokOf(lines[i + 1]);
    if (allNums(nums) && allAns(ans) && nums.length === ans.length) {
      nums.forEach((n, j) => {
        const qno = Number(n);
        const a = normalizeAnswer(ans[j]);
        if (a && map[qno] === undefined) map[qno] = a;
      });
      i++; // consume the answer row
    }
  }
  return map;
}

// ── LLM converter (Groq) ─────────────────────────────────────────────────────
// Real exam PDFs vary too much for regex alone, so when the rules parser does
// poorly we hand the extracted text to an LLM and ask for structured questions.
// Returns a normalised question array, or null if unavailable/failed.

const LLM_SYS =
  "You convert a raw exam paper into structured JSON for a computer-based test (CBT). " +
  'Output ONLY valid JSON of the form {"questions":[{"qno":1,"text":"...","subject":"Physics","type":"single","options":[{"key":"1","text":"..."},{"key":"2","text":"..."},{"key":"3","text":"..."},{"key":"4","text":"..."}],"correct":"1","explanation":"..."}]}. ' +
  "Rules: keep the original question order and numbering; normalise option labels to \"1\",\"2\",\"3\",\"4\" (map A/B/C/D to 1/2/3/4); for numerical/integer-answer questions set type to \"integer\", options to [] and correct to the number; " +
  "the correct answer may be given INLINE inside the question paper itself (e.g. \"Ans: B\", \"Answer (3)\", \"Correct option: 2\", \"Correct answer is D\") — detect it and remove that marker from the question/option text; a separate ANSWER KEY, when provided, takes precedence over the inline marker; " +
  "fill each correct field (\"1\"-\"4\" for MCQ, the number for integer); if no answer can be found set correct to \"\"; " +
  "set subject for EVERY question to exactly one of \"Physics\", \"Chemistry\", \"Maths\" or \"Biology\" — never leave it blank; use the section heading (e.g. \"PHYSICS\", \"SECTION B — Chemistry\") and carry it forward to every question under it, falling back to the question's own topic; " +
  "write a short explanation (1-3 sentences) justifying the correct answer — prefer the official solution if the ANSWER KEY/SOLUTIONS text provides one, otherwise reason it out concisely; if you cannot justify it, set explanation to \"\"; " +
  "keep text plain and concise; do NOT invent questions or answers. Output JSON only, no prose.";

// Walk the `"questions": [ … ]` array and pull out each complete top-level
// object, even when the response was truncated (max_tokens hit) or has trailing
// junk — a brace/string-aware scan, so the last partial object is just skipped
// instead of throwing away every question. Returns an array of raw objects.
function salvageQuestions(content) {
  const at = content.indexOf('"questions"');
  const arrStart = content.indexOf("[", at >= 0 ? at : 0);
  if (arrStart < 0) return [];
  const objs = [];
  let depth = 0, start = -1, inStr = false, esc = false;
  for (let i = arrStart + 1; i < content.length; i++) {
    const c = content[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{") { if (depth === 0) start = i; depth++; }
    else if (c === "}") { depth--; if (depth === 0 && start >= 0) { try { objs.push(JSON.parse(content.slice(start, i + 1))); } catch { /* skip */ } start = -1; } }
    else if (c === "]" && depth === 0) break;
  }
  return objs;
}

function normalizeLLMQuestions(arr) {
  return arr.slice(0, 200).map((q, i) => {
    const type = q?.type === "integer" ? "integer" : "single";
    const options = type === "single" && Array.isArray(q?.options)
      ? q.options.slice(0, 4).map((o, j) => ({ key: normalizeAnswer(o?.key) || String(j + 1), text: stripNoise(o?.text).slice(0, 1000) }))
      : [];
    return {
      qno: Number(q?.qno) || i + 1,
      text: stripNoise(q?.text).slice(0, 4000),
      options,
      type,
      subject: String(q?.subject || "").slice(0, 40),
      correct: normalizeAnswer(q?.correct),
      explanation: String(q?.explanation || "").slice(0, 2000),
    };
  });
}

// Hand the extracted text to Groq and ask for structured questions. Returns
// { questions, error } — questions is [] on any failure and error carries a
// short reason for the admin note (so a silent null no longer hides the cause).
async function parseWithLLM(qText, kText) {
  if (!groqReady()) return { questions: [], error: "AI conversion is off (GROQ_API_KEY not set on the server)" };
  const model = groqModel();
  // Big enough for a full paper of MCQs (text + options + short solution each);
  // combined with salvageQuestions(), even a truncated reply still yields Qs.
  const maxTokens = Math.max(2000, Number(process.env.GROQ_MAX_TOKENS) || 16000);
  const user =
    `QUESTION PAPER (raw text):\n${qText.slice(0, 45000)}\n\n` +
    `ANSWER KEY (raw text):\n${(kText || "(none provided — the answers may be inline in the question paper above)").slice(0, 8000)}`;

  let content;
  try {
    content = await callGroq({ system: LLM_SYS, parts: [{ text: user }], maxTokens, model });
  } catch (e) {
    if (e.code === "DAILY_LIMIT") {
      return { questions: [], error: "Daily AI quota reached — try again tomorrow, or use a paid GROQ_API_KEY for higher limits" };
    }
    console.error("[testParser] Groq error", e.message, e.detail || "");
    return { questions: [], error: `AI request failed (${e?.message || "network error"}${e?.detail ? `: ${e.detail}` : ""})` };
  }
  if (!content) return { questions: [], error: "AI returned an empty response" };

  // Prefer a clean parse; fall back to a tolerant salvage for truncated output.
  content = repairLatexBackslashes(content); // keep under-escaped LaTeX intact
  let arr = null;
  try { const p = JSON.parse(content); arr = Array.isArray(p) ? p : p?.questions; } catch { /* salvage below */ }
  if (!Array.isArray(arr) || !arr.length) arr = salvageQuestions(content);
  if (!Array.isArray(arr) || !arr.length) return { questions: [], error: "AI couldn't structure this paper into questions" };

  return { questions: normalizeLLMQuestions(arr) };
}

// True when the rules parse is too thin to use as-is: no questions, or most
// MCQs came out with no option text (math PDFs whose options don't survive text
// extraction). Such papers need the vision model to read the actual content.
function isLowQuality(questions) {
  if (!questions.length) return true;
  const singles = questions.filter((q) => q.type === "single");
  if (!singles.length) return false; // all-integer papers extract fine as text
  const emptyOpts = singles.filter((q) => !q.options.some((o) => String(o.text).trim())).length;
  return emptyOpts / singles.length > 0.4;
}

// Math-heavy PDFs store equations as vector glyphs that the text layer extracts
// as garbage: replacement chars (□ / ), private-use-area glyphs, or dense runs
// of stray symbols ("29□□cd", "~^~^"). When the text is this corrupted the rules
// parser produces gibberish stems and footer-as-option junk, so we must force the
// vision pass even if it technically recovered "options". Returns true when a
// meaningful fraction of the text is unreadable.
function looksGarbled(text) {
  const s = String(text || "");
  if (s.length < 40) return false;
  const bad = (s.match(/[\u25A1\uFFFD\u00AD\uE000-\uF8FF]/g) || []).length; // box/replacement/soft-hyphen/PUA glyphs
  if (bad >= 8 || bad / s.length > 0.004) return true;
  // Long runs of non-alphanumeric symbol soup (broken math), e.g. "□□cd~^~^".
  const soup = (s.match(/[^\w\s.,;:()\-+=/*<>[\]{}$\\|]{4,}/g) || []).length;
  return soup >= 10;
}

// Deterministically map question numbers → subject from the SECTION HEADINGS in
// the paper's text layer ("PHYSICS", "SECTION - CHEMISTRY", "MATHEMATICS"). This
// respects the paper's ACTUAL section order (some papers run Maths→Physics→
// Chemistry), so it's far more reliable than guessing a subject from content or
// position. Headings are matched line-anchored so prose ("the physics of…")
// never counts. Returns {} when the text has no usable headings (scanned papers).
function subjectsFromHeadings(text) {
  const clean = String(text || "").replace(/\r/g, "");
  const headRe = /^[^\S\n]*(?:section\s*[-:–]?\s*)?(PHYSICS|CHEMISTRY|MATHEMATICS|MATHS|BIOLOGY|BOTANY|ZOOLOGY)\b[^\n]{0,24}$/gim;
  const qRe = /(?:^|\n)\s*(?:Q(?:ues(?:tion)?)?\.?\s*)?(\d{1,3})[.)]\s+/gi;
  const events = [];
  let m;
  while ((m = headRe.exec(clean)) !== null) {
    const sub = normalizeSubject(m[1]);
    if (sub) events.push({ pos: m.index, head: sub });
  }
  if (!events.length) return {};
  while ((m = qRe.exec(clean)) !== null) events.push({ pos: m.index, qno: Number(m[1]) });
  events.sort((a, b) => a.pos - b.pos);
  const map = {};
  let cur = "";
  for (const e of events) {
    if (e.head) cur = e.head;
    else if (cur && e.qno >= 1 && e.qno <= 400 && map[e.qno] === undefined) map[e.qno] = cur;
  }
  return map;
}

const visionEnabled = () => String(process.env.TEST_VISION || "").toLowerCase() !== "off";

// Parse both PDFs and merge the answer key into the questions. Returns the
// questions array plus a human-readable note for the admin review screen.
// Strategy:
//   1. fast rules parser on the text layer (+ inline / answer-key merge);
//   2. if that's empty or low quality (math papers), read the page IMAGES with a
//      vision model — recovers the real questions, options and maths (LaTeX);
//   3. otherwise, for text-rich papers the rules parser couldn't structure, fall
//      back to the text LLM.
export async function buildTestFromPdfs(testPdfUrl, keyPdfUrl, examType = "") {
  const [qBuf, kText] = await Promise.all([
    fetchPdfBuffer(testPdfUrl),
    keyPdfUrl ? fetchPdfText(keyPdfUrl) : Promise.resolve(""),
  ]);
  const qText = await pdfTextFromBuffer(qBuf);

  let questions = parseQuestions(qText);
  // Answers can come from (a) inline markers in the question paper itself
  // ("Ans: B" under each question) — already filled by parseOneBlock; (b) an
  // ANSWER KEY printed at the END of the question paper; and/or (c) a separate
  // answer-key PDF. We merge all three so a single self-contained PDF — in any of
  // these formats — works without a second upload; the separate key PDF wins.
  const key = { ...parseSelfAnswerKey(qText), ...parseAnswerKey(kText) };
  let matched = 0;
  for (const q of questions) {
    if (!q.correct && key[q.qno]) q.correct = key[q.qno];
    if (q.correct) matched++;
  }
  let method = "rules";
  let aiError = "";

  // The deterministic answer key from the text layer: a separate key PDF plus
  // any inline "Answer Key : (N)" markers the rules parser already read. This is
  // more trustworthy than the vision model for the answer itself, so we use it to
  // set answers even when vision supplies the question/option text.
  const textKey = { ...key };
  for (const q of questions) if (q.correct) textKey[q.qno] = q.correct;

  const textLen = qText.trim().length;

  // ── Vision pass — for scanned papers and math PDFs whose text is unusable ──
  // Force it when the text layer is GARBLED too (math glyphs that extract as junk
  // but still produced "options"), else the rules parser publishes gibberish.
  const garbled = looksGarbled(qText);
  if (visionEnabled() && groqReady() && (isLowQuality(questions) || garbled)) {
    try {
      const { extractWithVision } = await import("./visionParser.js");
      const v = await extractWithVision(qBuf, { answerKey: textKey });
      if (v.questions.length) {
        // MERGE vision over the rules result by qno — prefer vision's rich
        // transcription, but keep every rules question vision missed (e.g. when
        // the daily AI quota cut the run short), so no question is ever lost.
        const rulesByQno = new Map(questions.map((q) => [q.qno, q]));
        const visByQno = new Map(v.questions.map((q) => [q.qno, q]));
        const allQnos = [...new Set([...rulesByQno.keys(), ...visByQno.keys()])].sort((a, b) => a - b);
        const merged = allQnos.map((qno) => visByQno.get(qno) || rulesByQno.get(qno));
        // Carry a section subject onto any rules-only leftover from its nearest
        // tagged neighbour, so it still lands in a section tab.
        let lastSub = "";
        for (const q of merged) { if (q.subject) lastSub = q.subject; else if (lastSub) q.subject = lastSub; }
        // Trust the deterministic text key for answers.
        for (const q of merged) { const k = normalizeAnswer(textKey[q.qno]); if (k) q.correct = k; }
        questions = merged;
        matched = questions.filter((q) => q.correct).length;
        method = v.questions.length >= questions.length ? "vision" : "vision+text";
        if (v.error) aiError = v.error; // surface partial-run reason (e.g. daily quota)
      } else if (v.error) {
        aiError = v.error;
      }
    } catch (e) {
      aiError = `AI vision unavailable (${e?.message || "error"})`;
      console.error("[testParser] vision import/run failed", e?.message || e);
    }
  }

  // ── Text-LLM fallback — text-rich papers the rules parser couldn't structure ──
  // Skip whenever vision contributed (incl. a partial "vision+text" merge): the
  // text LLM would otherwise overwrite the richer vision transcription.
  if (!method.startsWith("vision")) {
    const poor = questions.length === 0 || matched < Math.ceil(questions.length / 2);
    if (poor && textLen > 40) {
      const llm = await parseWithLLM(qText, kText);
      if (llm.questions.length >= questions.length && llm.questions.length > 0) {
        for (const q of llm.questions) if (!q.correct && key[q.qno]) q.correct = key[q.qno];
        questions = llm.questions;
        matched = llm.questions.filter((q) => q.correct).length;
        method = "AI";
      } else if (llm.error && !aiError) {
        aiError = llm.error;
      }
    }
  }

  // Subjects, in order of trust:
  //   1. SECTION HEADINGS in the paper (deterministic, order-aware);
  //   2. whatever the AI already tagged;
  //   3. a keyword guess from the question text — recovers sections even when the
  //      AI run was cut short (quota) and left subjects blank, respecting the
  //      paper's real order (a Maths question stays Maths wherever it sits);
  //   4. the fixed-pattern positional net, to repair a merged/missing section.
  if (questions.length) {
    // Headings (deterministic) take precedence; recoverSubjects fills the rest
    // from question text + contiguous-block smearing + the fixed-pattern net.
    const headingSubjects = subjectsFromHeadings(qText);
    for (const q of questions) { if (headingSubjects[q.qno]) q.subject = headingSubjects[q.qno]; }
    questions = recoverSubjects(questions, examType);
  }

  const howLabel = { vision: "AI vision", "vision+text": "AI vision (partial)", AI: "AI", rules: "auto" };
  let note;
  if (questions.length && method === "rules" && isLowQuality(questions)) {
    // The math couldn't be read: rules-only on a math paper leaves blank options
    // and stripped equations. Warn loudly so a broken test isn't published as-is.
    const why = aiError ? `${aiError}. ` : "AI vision couldn't read this paper. ";
    note = `⚠️ The questions below have blank options/maths — ${why}This is a scanned/math paper that needs AI to read it. Re-convert when the AI quota resets (or set a paid GROQ_API_KEY), or fill the questions in manually. Do not publish as-is.`;
  } else if (questions.length) {
    const src = keyPdfUrl ? "answer key" : "answers";
    const inline = !keyPdfUrl && method === "rules" ? " (detected inline in the paper)" : "";
    note = `Converted ${questions.length} question${questions.length === 1 ? "" : "s"} (${howLabel[method]}); ${src} matched ${matched}/${questions.length}${inline}. Review below before publishing.`;
    if (method.startsWith("vision")) note += " Maths is shown in LaTeX — check the tricky ones.";
    if (aiError && method === "vision+text") note += ` Note: ${aiError} — some questions came from the text layer; re-convert later for full transcription.`;
  } else if (aiError) {
    note = `${aiError}. Add questions manually below, or try converting again.`;
  } else if (textLen === 0) {
    note = "This PDF couldn't be read automatically. Add questions manually below (students still see the uploaded paper).";
  } else {
    note = `Read ${textLen} characters of text but couldn't detect the question format automatically. Add questions manually below.`;
  }

  return { questions, matched, note, method };
}
