/* OtherExams — a single directory of every engineering entrance beyond JEE.
   Structure:
     1. Hero        — our own coral/cream intro + an animated exam-badge wall
     2. Timeline    — the home AdmissionTimeline, reused verbatim
     3. Directory   — Total / Ongoing / Upcoming / Concluded + category + search
                      filters over one rich card per exam (ExamCard).
   The hero copy and its badge-wall animation are original to College Parichay. */
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Compass, Sparkles, X } from "lucide-react";
import Seo from "../components/Seo.jsx";
import BackButton from "../components/BackButton.jsx";
import AdmissionTimeline from "../components/home/AdmissionTimeline.jsx";
import ExamCard from "../components/ExamCard.jsx";
import { CL, clEyebrow } from "../components/home/clTheme.js";
import { ALL_EXAMS, CATEGORIES } from "../data/otherExams.js";

const STATUS_FILTERS = [
  { key: "all",      label: "All exams" },
  { key: "current",  label: "Ongoing" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past",     label: "Concluded" },
];

/* three drifting rows for the hero badge wall — split so each row scrolls its
   own set at a different speed / direction. */
const WALL_ROWS = [
  ALL_EXAMS.filter((_, i) => i % 3 === 0),
  ALL_EXAMS.filter((_, i) => i % 3 === 1),
  ALL_EXAMS.filter((_, i) => i % 3 === 2),
];

export default function OtherExams() {
  const [status, setStatus] = useState("all");
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const c = { all: ALL_EXAMS.length, current: 0, upcoming: 0, past: 0 };
    ALL_EXAMS.forEach((e) => { c[e.status] = (c[e.status] || 0) + 1; });
    return c;
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ALL_EXAMS.filter((e) => {
      if (status !== "all" && e.status !== status) return false;
      if (cat !== "all" && e.category !== cat) return false;
      if (needle) {
        const hay = `${e.code} ${e.full} ${e.body}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [status, cat, q]);

  return (
    <div className="page">
      <Seo
        title="Other Engineering Entrance Exams 2026 — BITSAT, VITEEE, State CETs & More"
        description="Explore every engineering entrance exam beyond JEE — national, state and private-university tests. Fees, dates, pattern, eligibility and a plain-English read for BITSAT, VITEEE, MHT CET, KCET, COMEDK, SRMJEEE and 30+ more on College Parichay."
        path="/other-exams"
      />

      {/* ── 1. HERO ── */}
      <section className="oe-hero">
        <div className="container oe-hero-grid">
          <div className="oe-hero-copy">
            <BackButton style={{ margin: "0 0 14px" }} />
            <span style={clEyebrow}><Compass size={13} /> Beyond the JEE bubble</span>
            <h1 className="oe-hero-title">
              One home for <span style={{ color: CL.coral }}>every entrance</span> that isn't JEE.
            </h1>
            <p className="oe-hero-sub">
              National, state and private-university engineering exams — laid out card by card
              with fees, dates, the exam pattern and an honest read on where each one gets you.
            </p>

            <div className="oe-hero-cta">
              <a href="#directory" className="oe-btn-primary">
                <Sparkles size={16} /> Browse all {counts.all} exams
              </a>
              <a href="#admission-timeline" className="oe-btn-ghost">See the calendar</a>
            </div>

            <div className="oe-stats">
              <div className="oe-stat">
                <span className="oe-stat-num">{counts.all}</span>
                <span className="oe-stat-cap">Exams<br />mapped</span>
              </div>
              <span className="oe-stat-div" />
              <div className="oe-stat">
                <span className="oe-stat-num">{CATEGORIES.length}</span>
                <span className="oe-stat-cap">National · State<br />· Private tracks</span>
              </div>
              <span className="oe-stat-div" />
              <div className="oe-stat">
                <span className="oe-stat-num">6</span>
                <span className="oe-stat-cap">Quarters of<br />live calendar</span>
              </div>
            </div>
          </div>

          {/* animated exam-badge wall (original composition — not a radial graph) */}
          <div className="oe-wall" aria-hidden="true">
            <div className="oe-wall-fade" />
            {WALL_ROWS.map((row, ri) => (
              <div key={ri} className={`oe-wall-row ${ri % 2 ? "rev" : ""}`}>
                <div className="oe-wall-track">
                  {[...row, ...row].map((e, i) => (
                    <span key={i} className="oe-wall-chip" style={{ "--tint": e.tint, "--tint-soft": e.tintSoft }}>
                      {e.code}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. CALENDAR (reused home timeline) ── */}
      <AdmissionTimeline />

      {/* ── 3. DIRECTORY ── */}
      <section id="directory" className="oe-directory">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 34px" }}>
            <span style={clEyebrow}><Compass size={13} /> The full directory</span>
            <h2 className="oe-dir-title">Every exam, one card at a time</h2>
            <p className="oe-dir-sub">Filter by where you are in the cycle, narrow by track, or search by name.</p>
          </div>

          {/* filter bar */}
          <div className="oe-filters">
            <div className="oe-chips">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.key}
                  className={`oe-chip ${status === f.key ? "on" : ""}`}
                  onClick={() => setStatus(f.key)}
                >
                  {f.label}
                  <span className="oe-chip-count">{counts[f.key]}</span>
                </button>
              ))}
            </div>

            <div className="oe-chips">
              <button className={`oe-chip alt ${cat === "all" ? "on" : ""}`} onClick={() => setCat("all")}>All tracks</button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  className={`oe-chip alt ${cat === c.key ? "on" : ""}`}
                  onClick={() => setCat(c.key)}
                  style={cat === c.key ? { "--tint": c.tint } : undefined}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="oe-search">
              <Search size={16} color={CL.muted} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search BITSAT, VITEEE, KCET…"
              />
              {q && <button onClick={() => setQ("")} aria-label="Clear"><X size={15} /></button>}
            </div>
          </div>

          {/* results count */}
          <p className="oe-count">
            Showing <strong>{filtered.length}</strong> of {counts.all} exams
          </p>

          {/* card grid */}
          {filtered.length > 0 ? (
            <div className="oe-grid">
              {filtered.map((exam, i) => (
                <ExamCard key={exam.code} exam={exam} index={i} />
              ))}
            </div>
          ) : (
            <div className="oe-empty">
              <p>No exams match those filters.</p>
              <button onClick={() => { setStatus("all"); setCat("all"); setQ(""); }}>Reset filters</button>
            </div>
          )}
        </div>
      </section>

      <style>{CSS}</style>
    </div>
  );
}

const CSS = `
/* ── hero ── */
.oe-hero { background:linear-gradient(180deg, ${CL.coralSoft}55, #fff 70%); padding:34px 0 48px; overflow:hidden; }
.oe-hero-grid { display:grid; grid-template-columns:1.05fr .95fr; gap:40px; align-items:center; }
.oe-hero-title { font:800 clamp(2.1rem,5vw,3.3rem)/1.08 ${CL.display}; color:${CL.ink}; letter-spacing:-1.5px; margin:16px 0 0; }
.oe-hero-sub { font:500 clamp(1rem,1.6vw,1.12rem)/1.6 sans-serif; color:${CL.body}; max-width:520px; margin:16px 0 0; }
.oe-hero-cta { display:flex; flex-wrap:wrap; gap:12px; margin-top:26px; }
.oe-btn-primary {
  display:inline-flex; align-items:center; gap:8px; text-decoration:none;
  padding:13px 22px; border-radius:50px; font:800 .95rem/1 ${CL.display}; color:#fff;
  background:linear-gradient(120deg, ${CL.coral} 0%, ${CL.coral} 45%, #fbbf24 130%);
  box-shadow:0 12px 26px -10px ${CL.coral}; transition:transform .2s, box-shadow .2s;
}
.oe-btn-primary:hover { transform:translateY(-2px); box-shadow:0 16px 32px -10px ${CL.coral}; }
.oe-btn-ghost {
  display:inline-flex; align-items:center; text-decoration:none;
  padding:13px 22px; border-radius:50px; font:800 .95rem/1 ${CL.display}; color:${CL.ink};
  background:#fff; border:1px solid ${CL.cream3}; transition:border-color .2s, transform .2s;
}
.oe-btn-ghost:hover { border-color:${CL.coral}66; transform:translateY(-2px); }

.oe-stats { display:flex; align-items:center; gap:22px; margin-top:34px; }
.oe-stat { display:flex; flex-direction:column; gap:6px; }
.oe-stat-num { font:800 2.1rem/1 ${CL.display}; color:${CL.ink}; letter-spacing:-1px; }
.oe-stat-num::after { content:"+"; color:${CL.coral}; }
.oe-stat-cap { font:600 .72rem/1.3 sans-serif; color:${CL.muted}; text-transform:uppercase; letter-spacing:.04em; }
.oe-stat-div { width:1px; height:44px; background:${CL.cream3}; }

/* ── hero badge wall ── */
.oe-wall { position:relative; display:flex; flex-direction:column; gap:14px; padding:10px 0; -webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent); mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent); }
.oe-wall-row { overflow:hidden; }
.oe-wall-track { display:inline-flex; gap:12px; white-space:nowrap; width:max-content; animation:oeScroll 44s linear infinite; }
.oe-wall-row.rev .oe-wall-track { animation-direction:reverse; animation-duration:56s; }
.oe-wall-chip {
  display:inline-flex; align-items:center; padding:11px 17px; border-radius:14px;
  font:800 .92rem/1 ${CL.display}; color:var(--tint); background:var(--tint-soft);
  border:1px solid color-mix(in srgb, var(--tint) 22%, transparent); box-shadow:0 6px 16px rgba(33,29,46,.05);
}
@keyframes oeScroll { to { transform:translateX(-50%); } }

/* ── directory ── */
.oe-directory { background:${CL.cream2}; padding:70px 0 90px; }
.oe-dir-title { font:800 clamp(1.7rem,4vw,2.5rem)/1.15 ${CL.display}; color:${CL.ink}; letter-spacing:-1px; margin:14px 0 0; }
.oe-dir-sub { font:500 1.05rem/1.6 sans-serif; color:${CL.body}; margin:12px 0 0; }

.oe-filters { display:flex; flex-direction:column; gap:14px; align-items:center; margin-bottom:10px; }
.oe-chips { display:flex; flex-wrap:wrap; gap:9px; justify-content:center; }
.oe-chip {
  display:inline-flex; align-items:center; gap:8px; cursor:pointer;
  padding:9px 16px; border-radius:50px; font:800 .82rem/1 ${CL.display}; color:${CL.ink2};
  background:#fff; border:1px solid ${CL.cream3}; transition:all .18s;
}
.oe-chip:hover { border-color:${CL.coral}66; }
.oe-chip.on { color:#fff; background:${CL.coral}; border-color:${CL.coral}; box-shadow:0 8px 18px -8px ${CL.coral}; }
.oe-chip-count { font-size:.72rem; padding:2px 7px; border-radius:50px; background:rgba(33,29,46,.07); color:${CL.muted}; }
.oe-chip.on .oe-chip-count { background:rgba(255,255,255,.26); color:#fff; }
.oe-chip.alt.on { background:var(--tint,${CL.ink}); border-color:var(--tint,${CL.ink}); box-shadow:0 8px 18px -8px var(--tint,${CL.ink}); }

.oe-search { display:flex; align-items:center; gap:9px; width:min(420px,100%); background:#fff; border:1px solid ${CL.cream3}; border-radius:50px; padding:10px 16px; }
.oe-search:focus-within { border-color:${CL.coral}; box-shadow:0 0 0 3px ${CL.coralSoft}; }
.oe-search input { flex:1; border:none; outline:none; background:none; font:500 .9rem/1 sans-serif; color:${CL.ink}; }
.oe-search button { display:grid; place-items:center; color:${CL.muted}; }

.oe-count { text-align:center; font:500 .86rem/1 sans-serif; color:${CL.muted}; margin:22px 0 26px; }
.oe-count strong { color:${CL.coral}; }

.oe-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; align-items:start; }

.oe-empty { text-align:center; padding:60px 0; }
.oe-empty p { font:600 1.05rem/1 ${CL.display}; color:${CL.ink2}; margin-bottom:16px; }
.oe-empty button { padding:11px 22px; border-radius:50px; background:${CL.coral}; color:#fff; font:800 .85rem/1 ${CL.display}; cursor:pointer; border:none; }

@media (max-width:960px) {
  .oe-hero-grid { grid-template-columns:1fr; gap:30px; }
  .oe-wall { order:-1; }
  .oe-grid { grid-template-columns:repeat(2,1fr); }
}
@media (max-width:640px) {
  .oe-grid { grid-template-columns:1fr; }
  .oe-stats { gap:14px; }
  .oe-stat-num { font-size:1.7rem; }
}
@media (prefers-reduced-motion: reduce) {
  .oe-wall-track { animation:none; }
}
`;
