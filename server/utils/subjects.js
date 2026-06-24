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

// Keyword fingerprints used to GUESS a question's subject from its text when the
// AI left it blank (e.g. the vision pass was cut short by the daily quota). Even
// a math paper whose equations didn't extract still has tell-tale words in the
// stem ("roots of the quadratic", "two vectors", "velocity", "mole"), so this
// recovers section tags while respecting the paper's actual order.
const SUBJECT_KEYWORDS = {
  Maths: /\b(equation|quadratic|roots?|function|integral|integrat\w*|deriv\w*|differentiat\w*|matri(?:x|ces)|determinant|probabilit\w*|vectors?|complex number|polynomial|coefficients?|tangent|circle|ellipse|parabola|hyperbola|sine?|cosine?|cos|sin|tan|logarithm|series|limits?|permutation|combination|binomial|locus|trigonometr\w*|set theory|relation)\b/gi,
  Physics: /\b(velocit\w*|accelerat\w*|force|momentum|charge|magnetic|electric|current|resistance|resistor|capacitor|inductor|wavelength|frequenc\w*|photon|kinetic|potential energy|gravitation\w*|friction|newton|joule|watt|ohm|tesla|refractive|lens|mirror|displacement|projectile|amplitude|oscillat\w*|thermodynamic\w*|temperature|pressure|circuit|voltage|electron volt)\b/gi,
  Chemistry: /\b(mole|molar|reaction|compound|atom\w*|orbital|acid|base|p\s?H\b|oxidation|reduction|enthalp\w*|bond|isomer|alkane|alkene|alkyne|benzene|polymer|catalyst|valenc\w*|aqueous|hybridi\w*|electroneg\w*|periodic table|ester|amine|aldehyde|ketone|hydrocarbon|salt|electrolys\w*|equilibrium constant)\b/gi,
  Biology: /\b(cell|tissue|organ\w*|enzyme|protein|dna|rna|gene\w*|chromosome|photosynthesis|respiration|species|ecosystem|hormone|nucleus|mitosis|meiosis|bacteri\w*|virus|plant|animal|blood|neuron|reproduc\w*|digest\w*|kingdom|taxonom\w*)\b/gi,
};

// Best-guess subject from question text. Returns "" when nothing matches enough.
// `allowed` (optional) restricts to that exam's subjects so a JEE paper never
// gets tagged "Biology" from a stray "cell"/"plant".
export function guessSubjectFromText(text, allowed = null) {
  const s = String(text || "");
  if (s.length < 4) return "";
  const subs = allowed && allowed.length ? allowed : Object.keys(SUBJECT_KEYWORDS);
  let best = "", bestN = 0;
  for (const sub of subs) {
    const re = SUBJECT_KEYWORDS[sub];
    if (!re) continue;
    const n = (s.match(re) || []).length;
    if (n > bestN) { bestN = n; best = sub; }
  }
  return bestN >= 1 ? best : "";
}

// Fixed exam patterns whose papers run in CONTIGUOUS subject blocks, with the
// fraction of questions each subject occupies, in order. JEE Mains is even
// thirds (P·C·M, 25/25/25); NEET is 1:1:2 (P·C·B, 45/45/90).
const SECTION_PATTERN = {
  mains: [["Physics", 1 / 3], ["Chemistry", 1 / 3], ["Maths", 1 / 3]],
  neet: [["Physics", 1 / 4], ["Chemistry", 1 / 4], ["Biology", 1 / 2]],
};

// Last-resort safety net: when subject auto-detection folds a whole section into
// its neighbour (e.g. Chemistry carried-forward into Physics → "Physics 50,
// Maths 25"), recover the missing section. It is ORDER-AWARE: it keeps the
// subjects the model DID detect in the order they appear (papers can run
// Maths→Physics→Chemistry, not just P→C→M) and carves the missing subject out of
// the oversized block, so it never blindly relabels by a fixed P/C/M order.
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
  const ordered = [...questions].sort((a, b) => a.qno - b.qno);
  const count = {};
  for (const q of ordered) { const s = normalizeSubject(q.subject); if (s) count[s] = (count[s] || 0) + 1; }
  const present = expected.filter((s) => count[s]).length;

  // Whole paper untagged (AI conversion cut short by the quota): give a full
  // fixed-pattern paper the conventional section split by position so students
  // still get section tabs. Large papers only, so small daily/manual tests
  // aren't carved up; the admin can correct any question in review.
  if (present === 0) {
    if (n < 30) return questions;
    const sizes = pat.map(([, f]) => Math.round(f * n));
    sizes[sizes.length - 1] = n - sizes.slice(0, -1).reduce((a, b) => a + b, 0);
    if (sizes.some((s) => s <= 0)) return questions;
    let i = 0;
    expected.forEach((sub, b) => { for (let k = 0; k < sizes[b]; k++, i++) ordered[i].subject = sub; });
    return ordered;
  }

  const missingSubs = expected.filter((s) => !count[s]);
  if (present < 2 || missingSubs.length < 1) return questions;
  // Compare each subject to its EXPECTED share (handles NEET's uneven 1:1:2).
  const absorbed = pat.some(([s, f]) => (count[s] || 0) >= 1.7 * f * n);
  if (!absorbed) return questions;

  const sizeOf = (sub) => Math.round((pat.find(([s]) => s === sub)[1]) * n);
  // Contiguous runs of the CURRENTLY-detected subject, in document (qno) order.
  const runOf = () => {
    const runs = [];
    for (const q of ordered) {
      const s = normalizeSubject(q.subject);
      const last = runs[runs.length - 1];
      if (last && last.sub === s) last.items.push(q);
      else runs.push({ sub: s, items: [q] });
    }
    return runs;
  };
  // For each missing subject, split it off the LATER portion of the most
  // oversized run (carry-forward absorbs the *following* section, so the overflow
  // at the end of a run is the missing subject).
  for (const miss of missingSubs) {
    const runs = runOf().filter((r) => r.sub);
    let big = null, bigOver = 0;
    for (const r of runs) {
      const over = r.items.length - sizeOf(r.sub);
      if (over > bigOver) { bigOver = over; big = r; }
    }
    if (!big || bigOver < Math.max(2, Math.floor(sizeOf(miss) / 2))) break;
    for (const q of big.items.slice(sizeOf(big.sub))) q.subject = miss;
  }
  return ordered;
}
