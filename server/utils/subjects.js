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
