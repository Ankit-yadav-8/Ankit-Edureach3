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

// Download a (Cloudinary-hosted) PDF and return its extracted text.
// Throws a tagged Error (err.code) so callers can give an accurate reason:
//   FETCH   — the file couldn't be downloaded (e.g. Cloudinary delivery blocked)
//   SCANNED — downloaded fine but has no text layer (image-only / scanned)
export async function fetchPdfText(url) {
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
  const buf = Buffer.from(await res.arrayBuffer());
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

export function parseQuestions(text) {
  const clean = String(text || "").replace(/\r/g, "");
  const markerRe = /(?:^|\n)\s*(\d{1,3})[.)]\s+/g;
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

  OPTION_RE.lastIndex = 0;
  const opts = [];
  let firstOptAt = -1;
  let m;
  while ((m = OPTION_RE.exec(block)) !== null) {
    const label = (m[1] || m[2] || "").toUpperCase();
    const at = m.index;
    if (firstOptAt === -1) firstOptAt = at;
    opts.push({ label, at, contentFrom: OPTION_RE.lastIndex });
  }

  // Inline answer marker ("Ans: B" under the question). For an MCQ we only trust
  // a marker that appears at/after the options, so a stray "…is 4" in the stem
  // can't hijack the answer or wipe out the options; for an option-less (integer)
  // block we accept it anywhere after the stem. `cut` is where the answer text
  // begins, so it's trimmed off the last option / the stem rather than kept.
  let inlineCorrect = "";
  let cut = block.length;
  const ans = extractInlineAnswer(block);
  if (ans) {
    const minAt = opts.length ? opts[opts.length - 1].contentFrom : 1;
    if (ans.index >= minAt) { inlineCorrect = ans.value; cut = ans.index; }
  }

  // Slice each option's text up to the next option marker; the last option stops
  // at the answer marker (cut) so "Ans: X" doesn't bleed into it.
  const cleaned = [];
  for (let i = 0; i < opts.length; i++) {
    const from = opts[i].contentFrom;
    const to = i + 1 < opts.length ? opts[i + 1].at : cut;
    const txt = block.slice(from, to).replace(/\s+/g, " ").trim();
    cleaned.push({ key: normalizeAnswer(opts[i].label), text: txt });
  }
  // De-dupe to the canonical 1..4 keys, keep first occurrence, drop empties.
  const seen = new Set();
  const options = [];
  for (const o of cleaned) {
    if (!o.key || seen.has(o.key)) continue;
    seen.add(o.key);
    options.push(o);
  }

  const stem = (firstOptAt >= 0 ? block.slice(0, firstOptAt) : block.slice(0, cut))
    .replace(/\s+/g, " ")
    .trim();

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
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const LLM_SYS =
  "You convert a raw exam paper into structured JSON for a computer-based test (CBT). " +
  'Output ONLY valid JSON of the form {"questions":[{"qno":1,"text":"...","subject":"Physics","type":"single","options":[{"key":"1","text":"..."},{"key":"2","text":"..."},{"key":"3","text":"..."},{"key":"4","text":"..."}],"correct":"1","explanation":"..."}]}. ' +
  "Rules: keep the original question order and numbering; normalise option labels to \"1\",\"2\",\"3\",\"4\" (map A/B/C/D to 1/2/3/4); for numerical/integer-answer questions set type to \"integer\", options to [] and correct to the number; " +
  "the correct answer may be given INLINE inside the question paper itself (e.g. \"Ans: B\", \"Answer (3)\", \"Correct option: 2\", \"Correct answer is D\") — detect it and remove that marker from the question/option text; a separate ANSWER KEY, when provided, takes precedence over the inline marker; " +
  "fill each correct field (\"1\"-\"4\" for MCQ, the number for integer); if no answer can be found set correct to \"\"; " +
  "set subject to the topic/subject when it is evident (e.g. Physics, Chemistry, Maths, Biology), else \"\"; " +
  "write a short explanation (1-3 sentences) justifying the correct answer — prefer the official solution if the ANSWER KEY/SOLUTIONS text provides one, otherwise reason it out concisely; if you cannot justify it, set explanation to \"\"; " +
  "keep text plain and concise; do NOT invent questions or answers. Output JSON only, no prose.";

async function parseWithLLM(qText, kText) {
  if (!process.env.GROQ_API_KEY) return null;
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const user =
    `QUESTION PAPER (raw text):\n${qText.slice(0, 45000)}\n\n` +
    `ANSWER KEY (raw text):\n${(kText || "(none provided — the answers may be inline in the question paper above)").slice(0, 8000)}`;
  let res;
  try {
    res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model,
        temperature: 0,
        max_tokens: 8000,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: LLM_SYS }, { role: "user", content: user }],
      }),
    });
  } catch { return null; }
  if (!res.ok) return null;
  let content;
  try { content = (await res.json()).choices?.[0]?.message?.content || ""; } catch { return null; }

  let parsed;
  try { parsed = JSON.parse(content); }
  catch {
    const m = content.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try { parsed = JSON.parse(m[0]); } catch { return null; }
  }
  const arr = Array.isArray(parsed) ? parsed : parsed?.questions;
  if (!Array.isArray(arr) || !arr.length) return null;

  return arr.slice(0, 200).map((q, i) => {
    const type = q?.type === "integer" ? "integer" : "single";
    const options = type === "single" && Array.isArray(q?.options)
      ? q.options.slice(0, 4).map((o, j) => ({ key: normalizeAnswer(o?.key) || String(j + 1), text: String(o?.text || "").slice(0, 1000) }))
      : [];
    return {
      qno: Number(q?.qno) || i + 1,
      text: String(q?.text || "").slice(0, 4000),
      options,
      type,
      subject: String(q?.subject || "").slice(0, 40),
      correct: normalizeAnswer(q?.correct),
      explanation: String(q?.explanation || "").slice(0, 2000),
    };
  });
}

// Parse both PDFs and merge the answer key into the questions. Returns the
// questions array plus a human-readable note for the admin review screen.
// Strategy: try the fast rules parser; if it does poorly but the PDF has a text
// layer, fall back to the LLM converter. A PDF with no text layer is scanned and
// can't be auto-read — the admin then fills the grid manually.
export async function buildTestFromPdfs(testPdfUrl, keyPdfUrl) {
  const [qText, kText] = await Promise.all([
    fetchPdfText(testPdfUrl),
    keyPdfUrl ? fetchPdfText(keyPdfUrl) : Promise.resolve(""),
  ]);

  let questions = parseQuestions(qText);
  // Answers can come from (a) inline markers in the question paper itself
  // ("Ans: B" under each question) — already filled by parseOneBlock — and/or
  // (b) a separate answer-key PDF. The separate key fills only what's missing,
  // so a single self-contained PDF works without a second upload.
  const key = parseAnswerKey(kText);
  let matched = 0;
  for (const q of questions) {
    if (!q.correct && key[q.qno]) q.correct = key[q.qno];
    if (q.correct) matched++;
  }
  let method = "rules";

  const textLen = qText.trim().length;
  const poor = questions.length === 0 || matched < Math.ceil(questions.length / 2);
  if (poor && textLen > 40 && process.env.GROQ_API_KEY) {
    const llm = await parseWithLLM(qText, kText);
    if (llm && llm.length >= questions.length) {
      questions = llm;
      matched = llm.filter((q) => q.correct).length;
      method = "AI";
    }
  }

  let note;
  if (questions.length) {
    const src = keyPdfUrl ? "answer key" : "answers";
    note = `Converted ${questions.length} question${questions.length === 1 ? "" : "s"} (${method === "AI" ? "AI" : "auto"}); ${src} matched ${matched}/${questions.length}${keyPdfUrl ? "" : " (detected inline in the paper)"}. Review below before publishing.`;
  } else if (textLen === 0) {
    note = "This PDF has no text layer — it's a scanned image/photo, so it can't be auto-read. Add questions manually below (students still see the uploaded paper).";
  } else {
    note = `Read ${textLen} characters of text but couldn't detect the question format automatically. Add questions manually below.`;
  }

  return { questions, matched, note, method };
}
