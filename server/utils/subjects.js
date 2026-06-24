// Canonical subject handling for section-wise papers.
// JEE Mains/Advanced split into Physics · Chemistry · Maths; NEET into
// Physics · Chemistry · Biology. Vision/text extraction returns messy labels
// ("Mathematics", "Bio", "Zoology", …) which we fold to these canonical names.

const ORDER = { Physics: 0, Chemistry: 1, Maths: 2, Biology: 3 };

export function normalizeSubject(s) {
  const t = String(s || "").trim().toLowerCase();
  if (!t) return "";
  if (/phys/.test(t)) return "Physics";
  if (/chem/.test(t)) return "Chemistry";
  if (/bio|zoo|bota/.test(t)) return "Biology";
  if (/math|quant/.test(t)) return "Maths";
  return "";
}

// The section list a given exam pattern is expected to have.
export function subjectsFor(examType) {
  if (examType === "neet") return ["Physics", "Chemistry", "Biology"];
  if (examType === "mains" || examType === "advanced") return ["Physics", "Chemistry", "Maths"];
  return [];
}

// Distinct subjects present in a question list, in exam order.
export function orderSubjects(list) {
  return [...new Set((list || []).map(normalizeSubject).filter(Boolean))]
    .sort((a, b) => (ORDER[a] ?? 9) - (ORDER[b] ?? 9));
}

export const subjectRank = (s) => ORDER[normalizeSubject(s)] ?? 9;

// Fixed exam patterns whose papers run in CONTIGUOUS subject blocks, with the
// fraction of questions each subject occupies, in order. JEE Mains is even
// thirds (P·C·M, 25/25/25); NEET is 1:1:2 (P·C·B, 45/45/90).
const SECTION_PATTERN = {
  mains: [["Physics", 1 / 3], ["Chemistry", 1 / 3], ["Maths", 1 / 3]],
  neet: [["Physics", 1 / 4], ["Chemistry", 1 / 4], ["Biology", 1 / 2]],
};

// Last-resort safety net: when subject auto-detection folds a whole section into
// its neighbour (e.g. Chemistry merged into Physics → "Physics 50, Maths 25"),
// re-tag questions by their POSITION using the exam's known section proportions.
// Deliberately conservative — only fires for a fixed-pattern paper that:
//   • already shows ≥2 of the expected subjects (so it's really multi-section), and
//   • is missing ≥1 expected subject (a section vanished), and
//   • has one section clearly oversized vs its expected share (it absorbed another)
// so a genuine single- or two-subject daily test is left untouched.
export function enforceSectionPattern(questions, examType) {
  const pat = SECTION_PATTERN[examType];
  if (!pat || !Array.isArray(questions) || questions.length < pat.length) return questions;
  const expected = pat.map(([s]) => s);
  const n = questions.length;
  const count = {};
  for (const q of questions) { const s = normalizeSubject(q.subject); if (s) count[s] = (count[s] || 0) + 1; }
  const present = expected.filter((s) => count[s]).length;
  const missing = expected.filter((s) => !count[s]).length;
  if (present < 2 || missing < 1) return questions;
  // Compare each subject to its EXPECTED share (handles NEET's uneven 1:1:2).
  const absorbed = pat.some(([s, f]) => (count[s] || 0) >= 1.7 * f * n);
  if (!absorbed) return questions;
  const sizes = pat.map(([, f]) => Math.round(f * n));
  sizes[sizes.length - 1] = n - sizes.slice(0, -1).reduce((a, b) => a + b, 0);
  if (sizes.some((s) => s <= 0)) return questions;
  const ordered = [...questions].sort((a, b) => a.qno - b.qno);
  let i = 0;
  expected.forEach((subject, b) => { for (let k = 0; k < sizes[b]; k++, i++) ordered[i].subject = subject; });
  return ordered;
}
