import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Stethoscope, CalendarDays, BadgeCheck, BarChart3, Gauge,
  Award, Landmark, BookOpen, Zap, FlaskConical, Clock, Sparkles,
} from "lucide-react";
import Reveal from "../components/Reveal.jsx";

/* ============================================================
   NEET UG 2026 — landing page (illustrative / dummy data)
   Mirrors the warm white theme; swap figures with official
   NTA data when published.
   ============================================================ */

const STATS = [
  { val: "20.8 L+", lbl: "Registered candidates" },
  { val: "720", lbl: "Maximum marks" },
  { val: "180", lbl: "Questions (PCB)" },
  { val: "1.1 L+", lbl: "MBBS seats" },
];

const SUBJECTS = [
  { id: "physics",   name: "Physics",   chapters: 29, marks: 180, icon: Zap,          color: "#F47B20", note: "45 questions · Class 11 & 12 mechanics, electrodynamics & modern physics." },
  { id: "chemistry", name: "Chemistry", chapters: 30, marks: 180, icon: FlaskConical, color: "#0ea5a4", note: "45 questions · Physical, Organic & Inorganic Chemistry." },
  { id: "biology",   name: "Biology",   chapters: 38, marks: 360, icon: BookOpen,     color: "#15a06e", note: "90 questions · Botany + Zoology — the scoring half of NEET." },
];

const PATTERN = [
  ["Mode", "Offline (pen & paper, OMR)"],
  ["Duration", "3 hours 20 minutes"],
  ["Total questions", "200 (attempt 180)"],
  ["Marking", "+4 correct · −1 wrong"],
  ["Sections", "Physics, Chemistry, Botany, Zoology"],
  ["Medium", "13 languages"],
];

const ELIGIBILITY = [
  ["Qualification", "Class 12 with Physics, Chemistry, Biology/Biotechnology & English."],
  ["Minimum marks", "50% in PCB for General (40% for SC/ST/OBC, 45% for PwD)."],
  ["Age limit", "Minimum 17 years as on 31 Dec 2026; no upper age limit."],
  ["Attempts", "No cap on the number of attempts."],
];

const TOPPERS = [
  { rank: 1, name: "AARAV SHARMA", marks: 715, state: "Rajasthan" },
  { rank: 2, name: "DIYA PATEL", marks: 712, state: "Gujarat" },
  { rank: 3, name: "ROHAN VERMA", marks: 711, state: "Uttar Pradesh" },
  { rank: 4, name: "SNEHA REDDY", marks: 708, state: "Telangana" },
  { rank: 5, name: "KABIR SINGH", marks: 705, state: "Delhi" },
];

const COLLEGES = [
  ["AIIMS, New Delhi", "≤ 55", "MBBS"],
  ["MAMC, Delhi", "≤ 220", "MBBS"],
  ["JIPMER, Puducherry", "≤ 145", "MBBS"],
  ["Seth GS Medical College, Mumbai", "≤ 480", "MBBS"],
  ["Madras Medical College, Chennai", "≤ 1,250", "MBBS"],
  ["BJ Medical College, Pune", "≤ 1,690", "MBBS"],
];

export default function Neet() {
  const nav = useNavigate();
  return (
    <div className="page">
      {/* HERO */}
      <section className="warm-page-header" style={{ padding: "44px 0" }}>
        <div className="container">
          <span className="eyebrow"><Stethoscope size={12} /> NEET UG 2026</span>
          <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", margin: "8px 0 6px", color: "#1c1c28" }}>
            India's biggest medical entrance, decoded
          </h1>
          <p style={{ color: "rgba(28,28,40,.62)", maxWidth: 620, lineHeight: 1.6 }}>
            Eligibility, exam pattern, syllabus, result trends and counselling for NEET UG 2026 — your single window to MBBS, BDS, AYUSH and more. <em>Figures shown are indicative.</em>
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
            <button className="btn btn-coral" onClick={() => nav("/mentorship/jee-2027")}>Get NEET mentorship <ArrowRight size={16} /></button>
            <button className="btn btn-ghost" onClick={() => document.getElementById("pattern")?.scrollIntoView({ behavior: "smooth" })}>See exam pattern</button>
          </div>
        </div>
      </section>

      <div className="container section" style={{ paddingTop: "3rem" }}>
        {/* STATS */}
        <div className="grid-4" style={{ marginBottom: "3rem" }}>
          {STATS.map((s) => (
            <Reveal key={s.lbl}>
              <div className="card" style={{ textAlign: "center", height: "100%" }}>
                <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "2rem", color: "var(--coral)" }}>{s.val}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{s.lbl}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* SUBJECTS */}
        <div id="biology" className="title-bar"><span className="eyebrow"><BookOpen size={12} /> Syllabus</span><h2 className="section-title">Subjects &amp; <span className="accent">weightage</span></h2></div>
        <div className="grid-3" style={{ marginBottom: "3.5rem" }}>
          {SUBJECTS.map((s) => (
            <Reveal key={s.id}>
              <div id={s.id} className="card" style={{ height: "100%", borderTop: `3px solid ${s.color}` }}>
                <span style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: `${s.color}1a` }}><s.icon size={22} color={s.color} /></span>
                <h3 style={{ fontFamily: "Sora", fontWeight: 700, margin: "12px 0 4px", color: "var(--navy)" }}>{s.name}</h3>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 8 }}>{s.chapters} chapters · {s.marks} marks</div>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>{s.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* PATTERN + ELIGIBILITY */}
        <div className="grid-2" style={{ marginBottom: "3.5rem", alignItems: "start" }}>
          <div id="pattern">
            <div className="title-bar" style={{ alignItems: "flex-start", textAlign: "left", margin: "0 0 1.2rem" }}>
              <span className="eyebrow"><CalendarDays size={12} /> Exam Pattern</span>
              <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,3vw,2rem)" }}>How NEET is set</h2>
            </div>
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PATTERN.map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 14, borderBottom: "1px solid rgba(0,0,0,.06)", paddingBottom: 8 }}>
                  <span style={{ color: "var(--muted)", fontSize: 13.5 }}>{k}</span>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: "var(--navy)", textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div id="eligibility">
            <div className="title-bar" style={{ alignItems: "flex-start", textAlign: "left", margin: "0 0 1.2rem" }}>
              <span className="eyebrow"><BadgeCheck size={12} /> Eligibility</span>
              <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,3vw,2rem)" }}>Who can apply</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {ELIGIBILITY.map(([t, d]) => (
                <div key={t} className="card" style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <BadgeCheck size={18} color="var(--coral)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: 14 }}>{t}</div>
                    <p style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.55, margin: "2px 0 0" }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RESULT / TOPPERS */}
        <div id="result" className="title-bar"><span className="eyebrow"><BarChart3 size={12} /> Result 2026</span><h2 className="section-title">All-India <span className="accent">toppers</span></h2></div>
        <div className="card" style={{ overflowX: "auto", marginBottom: "1rem", padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
            <thead>
              <tr style={{ background: "rgba(244,123,32,.08)" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, color: "var(--coral)", textTransform: "uppercase", letterSpacing: 1 }}>AIR</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, color: "var(--coral)", textTransform: "uppercase", letterSpacing: 1 }}>Name</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 12, color: "var(--coral)", textTransform: "uppercase", letterSpacing: 1 }}>State</th>
                <th style={{ textAlign: "right", padding: "12px 16px", fontSize: 12, color: "var(--coral)", textTransform: "uppercase", letterSpacing: 1 }}>Marks</th>
              </tr>
            </thead>
            <tbody>
              {TOPPERS.map((t) => (
                <tr key={t.rank} style={{ borderTop: "1px solid rgba(0,0,0,.06)" }}>
                  <td style={{ padding: "11px 16px", fontWeight: 800, color: "var(--coral)" }}>{t.rank}</td>
                  <td style={{ padding: "11px 16px", fontWeight: 600, color: "var(--navy)" }}>{t.name}</td>
                  <td style={{ padding: "11px 16px", color: "var(--muted)", fontSize: 13.5 }}>{t.state}</td>
                  <td style={{ padding: "11px 16px", textAlign: "right", fontWeight: 700, color: "var(--navy)" }}>{t.marks}/720</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p id="cutoffs" style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: "3.5rem" }}>* Illustrative data for layout — replace with official NTA results.</p>

        {/* COLLEGES */}
        <div id="colleges" className="title-bar"><span className="eyebrow"><Landmark size={12} /> Counselling</span><h2 className="section-title">Top <span className="accent">medical colleges</span></h2></div>
        <div id="counselling" className="grid-3" style={{ marginBottom: "3.5rem" }}>
          {COLLEGES.map(([name, rank, course]) => (
            <Reveal key={name}>
              <div className="card" style={{ height: "100%" }}>
                <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1rem", color: "var(--navy)" }}>{name}</h3>
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  <span className="badge orange">{course}</span>
                  <span className="badge teal">AIR {rank}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* PREDICTOR / CYCLE CTA */}
        <div id="predictor" style={{ scrollMarginTop: 120 }} />
        <div id="cycle" style={{ scrollMarginTop: 120 }} />
        <div className="card" style={{ textAlign: "center", padding: "40px 24px", borderTop: "3px solid var(--coral)" }}>
          <span style={{ width: 52, height: 52, borderRadius: 14, display: "inline-grid", placeItems: "center", background: "rgba(244,123,32,.12)", marginBottom: 12 }}><Gauge size={26} color="var(--coral)" /></span>
          <h2 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.3rem,3vw,1.8rem)", color: "var(--navy)", marginBottom: 8 }}>
            NEET rank predictor &amp; counselling — coming soon
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: 520, margin: "0 auto 18px", lineHeight: 1.6 }}>
            We're extending our JEE toolkit to NEET. Meanwhile, get personalised 1-on-1 guidance from doctors &amp; toppers.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-coral" onClick={() => nav("/mentorship/jee-2027")}><Sparkles size={16} /> Talk to a NEET mentor</button>
            <button className="btn btn-ghost" onClick={() => nav("/")}>Back to home</button>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, fontSize: 12.5, color: "var(--muted)" }}>
            <Clock size={13} /> Tools roll out for NEET UG 2026
          </div>
        </div>
      </div>
    </div>
  );
}
