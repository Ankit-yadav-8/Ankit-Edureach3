// ─────────────────────────────────────────────────────────────────────────────
// Re-convert a test PDF and AUDIT its diagrams — a standalone diagnostic.
//
//   node scripts/reconvert-check.mjs "<questionPdfUrl>" ["<answerKeyPdfUrl>"] [examType]
//
// It runs the real buildTestFromPdfs() pipeline (Groq vision + Cloudinary), then
// downloads every diagram it produced and measures the "ink" fraction of each, so
// we can confirm no blank/near-blank crop slipped through after the blank-crop fix.
// Needs server/.env (GROQ_API_KEY + CLOUDINARY_*). Does NOT touch MongoDB.
// ─────────────────────────────────────────────────────────────────────────────
import "dotenv/config";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { buildTestFromPdfs } from "../utils/testParser.js";

const [, , qUrl, keyUrl = "", examType = ""] = process.argv;
if (!qUrl) {
  console.error('Usage: node scripts/reconvert-check.mjs "<questionPdfUrl>" ["<keyPdfUrl>"] [examType]');
  process.exit(1);
}

const require = createRequire(import.meta.url);
const { loadImage, createCanvas } = await import(pathToFileURL(require.resolve("@napi-rs/canvas")).href);

// Fraction of pixels darker than light-grey — the same "ink" measure the cropper
// uses to reject blank crops. A real figure is well above ~1%; a blank one ~0.
async function inkFraction(url) {
  const res = await fetch(url);
  if (!res.ok) return { err: `HTTP ${res.status}` };
  const buf = Buffer.from(await res.arrayBuffer());
  const img = await loadImage(buf);
  const cv = createCanvas(img.width, img.height);
  const ctx = cv.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const d = ctx.getImageData(0, 0, img.width, img.height).data;
  let ink = 0;
  for (let i = 0; i < d.length; i += 4) {
    const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    if (lum < 200) ink++;
  }
  return { ink: ink / (img.width * img.height), w: img.width, h: img.height };
}

console.log(`\n▶ Re-converting: ${qUrl}\n`);
const t0 = Date.now();
const { questions, matched, note, method } = await buildTestFromPdfs(qUrl, keyUrl, examType);
console.log(`✔ ${method} · ${questions.length} questions · ${matched} answers matched · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
console.log(`  note: ${note}\n`);

const subj = {};
for (const q of questions) subj[q.subject || "—"] = (subj[q.subject || "—"] || 0) + 1;
console.log("Subjects:", subj, "\n");

const imgs = [];
for (const q of questions) {
  if (q.image) imgs.push({ label: `Q${q.qno} stem`, url: q.image });
  for (const o of q.options || []) if (o.image) imgs.push({ label: `Q${q.qno} opt ${o.key}`, url: o.image });
}
console.log(`Diagrams found: ${imgs.length}\n`);

let blanks = 0;
for (const it of imgs) {
  const r = await inkFraction(it.url).catch((e) => ({ err: e.message }));
  if (r.err) { console.log(`  ⚠ ${it.label}: could not check (${r.err})`); continue; }
  const blank = r.ink < 0.005;
  if (blank) blanks++;
  console.log(`  ${blank ? "✗ BLANK" : "✓ ok   "} ${it.label}  ink=${(r.ink * 100).toFixed(2)}%  ${r.w}x${r.h}`);
}

console.log(`\n${blanks === 0 ? "✅ No blank diagrams." : `❌ ${blanks} blank diagram(s) slipped through.`}`);
process.exit(0);
