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
  // Slice each option's text up to the next option marker.
  const cleaned = [];
  for (let i = 0; i < opts.length; i++) {
    const from = opts[i].contentFrom;
    const to = i + 1 < opts.length ? opts[i + 1].at : block.length;
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

  const stem = (firstOptAt >= 0 ? block.slice(0, firstOptAt) : block)
    .replace(/\s+/g, " ")
    .trim();

  if (options.length >= 2) {
    return { qno, text: stem, options: options.slice(0, 4), type: "single", correct: "" };
  }
  return { qno, text: stem, options: [], type: "integer", correct: "" };
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

// Parse both PDFs and merge the answer key into the questions. Returns the
// questions array plus a human-readable note for the admin review screen.
export async function buildTestFromPdfs(testPdfUrl, keyPdfUrl) {
  const [qText, kText] = await Promise.all([
    fetchPdfText(testPdfUrl),
    keyPdfUrl ? fetchPdfText(keyPdfUrl) : Promise.resolve(""),
  ]);

  const questions = parseQuestions(qText);
  const key = parseAnswerKey(kText);

  let matched = 0;
  for (const q of questions) {
    const a = key[q.qno];
    if (a) { q.correct = a; matched++; }
  }

  const note = questions.length
    ? `Parsed ${questions.length} question${questions.length === 1 ? "" : "s"}; answer key matched ${matched}/${questions.length}.`
    : "No questions could be read from the PDF (it may be scanned/image-only). Add them manually below.";

  return { questions, matched, note };
}
