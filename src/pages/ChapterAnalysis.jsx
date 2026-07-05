/* ChapterAnalysis — "Weightage & Difficulty Lab" for JEE Main
   and JEE Advanced. Left rail with summary metrics + a chapter-chip snapshot,
   then per-subject cards each with a weightage donut, difficulty and trend.
   Chapter weightage / difficulty figures are indicative dummy data. */
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Atom, FlaskConical, Sigma, TrendingUp, TrendingDown, Minus,
  Target, BarChart3, Sparkles, Layers, Award,
} from "lucide-react";
import Seo from "../components/Seo.jsx";
import BackButton from "../components/BackButton.jsx";
import { CL, clEyebrow } from "../components/home/clTheme.js";

/* ── Subject → chapter lists (standard syllabus headings) ── */
const SUBJECTS = [
  {
    id: "math", name: "Mathematics", short: "Math", icon: Sigma, color: "#6366f1",
    chapters: [
      "Sets, Relations & Functions", "Complex Numbers", "Quadratic Equations", "Sequences & Series",
      "Permutations & Combinations", "Binomial Theorem", "Matrices & Determinants",
      "Limits, Continuity & Differentiability", "Differentiation & Applications", "Integration",
      "Differential Equations", "Straight Lines & Circles", "Conic Sections", "Vectors",
      "3D Geometry", "Probability", "Trigonometry", "Inverse Trigonometry", "Mathematical Reasoning",
    ],
  },
  {
    id: "physics", name: "Physics", short: "Phy", icon: Atom, color: "#FF693D",
    chapters: [
      "Units & Dimensions", "Kinematics", "Laws of Motion", "Work, Energy & Power",
      "Rotational Motion", "Gravitation", "Properties of Matter", "Thermodynamics",
      "Oscillations (SHM)", "Waves", "Electrostatics", "Current Electricity",
      "Magnetic Effects of Current", "Electromagnetic Induction", "Alternating Current",
      "Ray & Wave Optics", "Modern Physics", "Semiconductors", "Communication Systems",
    ],
  },
  {
    id: "chemistry", name: "Chemistry", short: "Chem", icon: FlaskConical, color: "#15a06e",
    chapters: [
      "Some Basic Concepts", "Atomic Structure", "Chemical Bonding", "States of Matter",
      "Thermodynamics", "Equilibrium", "Redox Reactions", "Electrochemistry", "Chemical Kinetics",
      "Solutions", "p-Block Elements", "d & f-Block Elements", "Coordination Compounds",
      "Periodic Table & Periodicity", "General Organic Chemistry", "Hydrocarbons",
      "Haloalkanes & Haloarenes", "Alcohols, Phenols & Ethers", "Aldehydes, Ketones & Acids",
      "Amines", "Biomolecules", "Polymers",
    ],
  },
];

/* deterministic pseudo-random so figures are stable per chapter+exam */
function seed(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0); }
function chapterStats(name, exam) {
  const h = seed(name + "|" + exam);
  const weight = 2 + (h % 7) + ((h >> 3) % 2);            // 2–9 %
  const dscore = (h >> 5) % 100;
  const diff = exam === "advanced"
    ? (dscore < 22 ? "Easy" : dscore < 55 ? "Medium" : "Hard")
    : (dscore < 38 ? "Easy" : dscore < 75 ? "Medium" : "Hard");
  const questions = 1 + ((h >> 7) % (exam === "advanced" ? 3 : 4));
  const trend = ((h >> 9) % 3) - 1;                        // -1, 0, 1
  return { weight, diff, questions, marks: questions * (exam === "advanced" ? 4 : 4), trend };
}

const DIFF_META = {
  Easy:   { fg: "#0a8f5b", bg: CL.greenSoft },
  Medium: { fg: "#b9781a", bg: CL.amberSoft },
  Hard:   { fg: CL.coralDk, bg: CL.coralSoft },
};

function Donut({ pct, color, label }) {
  const r = 26, c = 2 * Math.PI * r;
  const filled = Math.min(100, pct) / 100 * c;
  return (
    <div style={{ position: "relative", width: 68, height: 68, flexShrink: 0 }}>
      <svg width="68" height="68" viewBox="0 0 68 68">
        <circle cx="34" cy="34" r={r} fill="none" stroke="#efeaf0" strokeWidth="7" />
        <motion.circle
          cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
          transform="rotate(-90 34 34)"
          initial={{ strokeDasharray: `0 ${c}` }}
          whileInView={{ strokeDasharray: `${filled} ${c}` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 14, color: CL.ink, lineHeight: 1 }}>{label}</div>
      </div>
    </div>
  );
}

function TrendIcon({ t }) {
  if (t > 0) return <TrendingUp size={13} color="#0a8f5b" />;
  if (t < 0) return <TrendingDown size={13} color={CL.coralDk} />;
  return <Minus size={13} color={CL.muted} />;
}

function ChapterCard({ name, color, exam, idx }) {
  const s = chapterStats(name, exam);
  const dm = DIFF_META[s.diff];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: (idx % 3) * 0.04 }}
      whileHover={{ y: -4 }}
      style={{ background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 16, boxShadow: CL.shadow, padding: "16px 16px", display: "flex", gap: 14, alignItems: "center" }}
    >
      <Donut pct={s.weight * 11} color={color} label={`${s.weight}%`} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 13.5, color: CL.ink, lineHeight: 1.25, marginBottom: 8 }}>{name}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 10.5, fontWeight: 800, color: dm.fg, background: dm.bg, padding: "3px 9px", borderRadius: 50 }}>{s.diff}</span>
          <span style={{ fontSize: 11, color: CL.muted, fontWeight: 600 }}>{s.questions} Q · {s.marks} mk</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: CL.muted, fontWeight: 600 }}>
            <TrendIcon t={s.trend} /> {s.trend > 0 ? "Rising" : s.trend < 0 ? "Easing" : "Stable"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ChapterAnalysis() {
  const [params, setParams] = useSearchParams();
  const exam = params.get("exam") === "advanced" ? "advanced" : "main";
  const [subject, setSubject] = useState("all");
  const examLabel = exam === "advanced" ? "JEE Advanced" : "JEE Main";
  const accent = exam === "advanced" ? "#7C3AED" : "#FF693D";

  useEffect(() => { document.title = `${examLabel} — Chapter Weightage & Difficulty · College Parichay`; window.scrollTo(0, 0); }, [examLabel]);

  const setExam = (e) => { params.set("exam", e); setParams(params); };

  const shownSubjects = subject === "all" ? SUBJECTS : SUBJECTS.filter((s) => s.id === subject);

  const summary = useMemo(() => {
    let total = 0, high = 0, hard = 0, marks = 0;
    SUBJECTS.forEach((s) => s.chapters.forEach((c) => {
      const st = chapterStats(c, exam); total++; marks += st.marks;
      if (st.weight >= 6) high++; if (st.diff === "Hard") hard++;
    }));
    return { total, high, hard, marks };
  }, [exam]);

  return (
    <div style={{ background: CL.cream, minHeight: "100vh" }}>
      <Seo title={`${examLabel} Chapter Weightage & Difficulty Analysis · College Parichay`}
        description={`Chapter-wise weightage, difficulty and trend analysis for ${examLabel} across Physics, Chemistry and Mathematics — indicative data to plan your prep.`}
        path="/jee-analysis" />

      <div className="container" style={{ paddingTop: 104, paddingBottom: 60 }}>
        <BackButton style={{ marginBottom: 16 }} />

        {/* exam toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
          <span style={clEyebrow}><BarChart3 size={13} /> Weightage & Difficulty Lab</span>
          <div style={{ display: "inline-flex", background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 50, padding: 4, boxShadow: CL.shadow }}>
            {[["main", "JEE Main"], ["advanced", "JEE Advanced"]].map(([k, lbl]) => {
              const on = exam === k;
              return (
                <button key={k} onClick={() => setExam(k)} style={{
                  padding: "8px 18px", borderRadius: 50, border: "none", cursor: "pointer",
                  fontFamily: CL.display, fontWeight: 800, fontSize: 13,
                  background: on ? (k === "advanced" ? "#7C3AED" : CL.coral) : "transparent",
                  color: on ? "#fff" : CL.body,
                }}>{lbl}</button>
              );
            })}
          </div>
        </div>

        <h1 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.4vw,2.8rem)", color: CL.ink, letterSpacing: "-1.2px", lineHeight: 1.08, marginBottom: 10 }}>
          {examLabel} — <span style={{ color: accent }}>chapter weightage</span> & difficulty
        </h1>
        <p style={{ color: CL.body, fontSize: "1.04rem", lineHeight: 1.7, maxWidth: 660, marginBottom: 28 }}>
          Every chapter scored on expected weightage, difficulty and year-on-year trend — so you know exactly where to spend your hours. Figures are indicative and built for planning, not official.
        </p>

        <div className="ca-grid" style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>
          {/* left rail */}
          <div className="ca-rail" style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 96 }}>
            <div style={{ background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 18, boxShadow: CL.shadow, padding: "20px 20px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".1em", color: CL.muted, textTransform: "uppercase", marginBottom: 14 }}>Snapshot · {examLabel}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { icon: Layers, val: summary.total, lbl: "Chapters", c: accent },
                  { icon: Target, val: summary.high, lbl: "High weightage", c: CL.green },
                  { icon: Award, val: summary.hard, lbl: "Hard chapters", c: CL.coralDk },
                  { icon: Sparkles, val: summary.marks, lbl: "Approx marks", c: CL.blue },
                ].map(({ icon: Ic, val, lbl, c }) => (
                  <div key={lbl} style={{ background: CL.cream2, border: `1px solid ${CL.cream3}`, borderRadius: 12, padding: "12px 12px" }}>
                    <Ic size={16} color={c} />
                    <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 20, color: CL.ink, marginTop: 6, lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: 11, color: CL.muted, marginTop: 3 }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* subject filter */}
            <div style={{ background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 18, boxShadow: CL.shadow, padding: "16px 16px" }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".1em", color: CL.muted, textTransform: "uppercase", marginBottom: 12 }}>Subject</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[{ id: "all", name: "All subjects", color: accent }, ...SUBJECTS].map((s) => {
                  const on = subject === s.id;
                  return (
                    <button key={s.id} onClick={() => setSubject(s.id)} style={{
                      display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                      padding: "9px 12px", borderRadius: 11, cursor: "pointer",
                      background: on ? `${s.color}14` : "transparent",
                      border: `1px solid ${on ? s.color + "44" : CL.line}`,
                      fontFamily: CL.display, fontWeight: 700, fontSize: 13.5, color: on ? CL.ink : CL.body,
                    }}>
                      <span style={{ width: 9, height: 9, borderRadius: "50%", background: s.color }} />
                      {s.name}
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px dashed ${CL.cream3}`, display: "flex", flexWrap: "wrap", gap: 9 }}>
                {Object.entries(DIFF_META).map(([k, m]) => (
                  <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: CL.body, fontWeight: 600 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: m.fg }} /> {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* main */}
          <div style={{ minWidth: 0 }}>
            {shownSubjects.map((s) => (
              <div key={s.id} style={{ marginBottom: 34 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
                  <span style={{ width: 40, height: 40, borderRadius: 11, background: `${s.color}18`, display: "grid", placeItems: "center" }}>
                    <s.icon size={20} color={s.color} />
                  </span>
                  <div>
                    <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.35rem", color: CL.ink, letterSpacing: "-0.4px" }}>{s.name}</h2>
                    <div style={{ fontSize: 12.5, color: CL.muted }}>{s.chapters.length} chapters · {examLabel}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                  {s.chapters.map((c, i) => <ChapterCard key={c} name={c} color={s.color} exam={exam} idx={i} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .ca-grid { grid-template-columns: 1fr !important; }
          .ca-rail { position: static !important; }
        }
      `}</style>
    </div>
  );
}
