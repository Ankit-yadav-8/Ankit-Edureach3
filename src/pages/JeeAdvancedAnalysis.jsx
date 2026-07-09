/* JeeAdvancedAnalysis — the JEE Advanced "Chapter Intelligence" console.
   A Class 11/12-style hero over an analysis console: one card per chapter
   (all 80), each with weightage ring / avg-Qs / difficulty / priority and a
   sub-topic breakdown, plus three dropdown filters (class, difficulty, trend)
   and a search. Below the grid: a 200-hour study-time split by subject and the
   marking scheme. Warm neutral / amber theme. */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Atom, FlaskConical, Sigma, Search, X, ChevronDown, Sparkles,
  Target, ArrowRight, Clock, ShieldCheck,
} from "lucide-react";
import Seo from "../components/Seo.jsx";
import { JEE_ADV_CHAPTERS } from "../data/jeeAdvancedChapters.js";
import { SUBJECT_SUMMARY, MARKING_SCHEME } from "../data/jeeAdvancedMeta.js";

/* ── warm neutral / amber theme ── */
const T = {
  bg: "#F5F3EE", surface: "#FFFFFF", surface2: "#FAF9F4",
  border: "#D8D8D2", borderLight: "#E8E6DF",
  ink: "#1A1A2E", body: "#57535C", muted: "#9A958E",
  amber: "#F59E0B", amberDk: "#B45309", amberSoft: "#FEF3C7",
  error: "#DC2626", errorSoft: "#FCE9E9", success: "#16A34A", successSoft: "#E4F5EA",
};
const SUBJECTS = {
  Physics:   { color: "#2563EB", soft: "#E7EDFB", icon: Atom },
  Chemistry: { color: "#7C3AED", soft: "#EEE9FC", icon: FlaskConical },
  Maths:     { color: "#0E9F6E", soft: "#E1F5EC", icon: Sigma },
};
const PRIORITY = {
  "Must-Do": { fg: T.ink,     label: "MUST-DO" },
  High:      { fg: T.amberDk, label: "HIGH" },
  Standard:  { fg: T.muted,   label: "STANDARD" },
};
const DIFF_STYLE = {
  "Low":         { fg: "#15803D", bg: T.successSoft },
  "Low-Medium":  { fg: "#15803D", bg: T.successSoft },
  "Medium":      { fg: T.amberDk, bg: T.amberSoft },
  "Medium-High": { fg: "#C2410C", bg: "#FFEAD6" },
  "High":        { fg: "#B91C1C", bg: T.errorSoft },
};

const SUBJECT_FILTERS = ["All", "Physics", "Chemistry", "Maths"];
const CLASS_FILTERS = ["All", "11", "12"];
const DIFF_FILTERS  = ["All", "Low", "Low-Medium", "Medium", "Medium-High", "High"];
const TREND_FILTERS = ["All", "Rising", "Stable", "Falling"];
const SUBJECT_DOTS = { Physics: SUBJECTS.Physics.color, Chemistry: SUBJECTS.Chemistry.color, Maths: SUBJECTS.Maths.color };

/* ── weightage ring ── */
function Ring({ pct, color, label }) {
  const r = 25, C = 2 * Math.PI * r;
  return (
    <div className="jaa-ring">
      <svg width="60" height="60" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r={r} fill="none" stroke={T.borderLight} strokeWidth="5" />
        <motion.circle
          cx="30" cy="30" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          transform="rotate(-90 30 30)" strokeDasharray={C}
          initial={{ strokeDashoffset: C }} whileInView={{ strokeDashoffset: C * (1 - pct) }}
          viewport={{ once: true }} transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      <span className="jaa-ring-lbl">{label}</span>
    </div>
  );
}

/* ── chapter card ── */
function ChapterCard({ c, index, forceOpen }) {
  const [open, setOpen] = useState(false);
  const isOpen = forceOpen || open;
  const sub = SUBJECTS[c.subject];
  const Icon = sub.icon;
  const prio = PRIORITY[c.priority] || PRIORITY.Standard;
  const diff = DIFF_STYLE[c.difficulty] || DIFF_STYLE.Medium;
  const subtopics = c.subtopics || [];

  return (
    <motion.article
      className="jaa-card" style={{ "--accent": sub.color }}
      initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.35, delay: Math.min(index, 10) * 0.03 }}
    >
      <div className="jaa-card-top">
        <Ring pct={c.ringPct} color={sub.color} label={c.weightage} />
        <div className="jaa-card-head">
          <span className="jaa-cat"><Icon size={11} strokeWidth={2.5} color={sub.color} /> {c.subject}</span>
          <h3 className="jaa-chap">{c.chapter}</h3>
        </div>
        <span className="jaa-prio" style={{ color: prio.fg }}>{prio.label}</span>
      </div>

      <div className="jaa-meta">
        <div className="jaa-metric"><span className="jaa-metric-cap">Avg. Qs</span><span className="jaa-metric-val">{c.avgQs}</span></div>
        <div className="jaa-metric"><span className="jaa-metric-cap">Difficulty</span><span className="jaa-diff" style={{ color: diff.fg, background: diff.bg }}>{c.difficulty}</span></div>
      </div>

      <p className="jaa-focus">{c.focus}</p>

      {subtopics.length > 0 && (
        <>
          <button className="jaa-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={isOpen}>
            <ChevronDown size={12} className={isOpen ? "jaa-chev open" : "jaa-chev"} />
            Sub-topic breakdown · {subtopics.length}
          </button>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div className="jaa-break"
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}>
                <div className="jaa-break-inner">
                  {subtopics.map((st, i) => (
                    <div key={i} className="jaa-brk-row">
                      <span className="jaa-brk-dot" style={{ background: sub.color }} />
                      <span className="jaa-brk-name">{st}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.article>
  );
}

/* ── segmented pill toggle (subject / class) ── */
function Segmented({ label, options, value, onChange, dots, fmt }) {
  return (
    <div className="jaa-seg-wrap">
      <span className="jaa-seg-lbl">{label}</span>
      <div className="jaa-seg" role="tablist" aria-label={label}>
        {options.map((o) => (
          <button key={o} role="tab" aria-selected={value === o}
            className={value === o ? "jaa-seg-btn on" : "jaa-seg-btn"}
            style={value === o && dots && dots[o] ? { "--on": dots[o] } : undefined}
            onClick={() => onChange(o)}>
            {dots && dots[o] && <span className="jaa-seg-dot" style={{ background: dots[o] }} />}
            {fmt ? fmt(o) : o}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── hero visual ── */
const ORBIT = [{ top: "0%", left: "-4%" }, { top: "8%", right: "-6%" }, { bottom: "12%", left: "-6%" }, { bottom: "-2%", right: "-2%" }];
function HeroVisual({ subjectCounts, mustDo }) {
  const cards = [
    { title: "Physics", subtitle: `${subjectCounts.Physics} chapters`, ...SUBJECTS.Physics },
    { title: "Chemistry", subtitle: `${subjectCounts.Chemistry} chapters`, ...SUBJECTS.Chemistry },
    { title: "Maths", subtitle: `${subjectCounts.Maths} chapters`, ...SUBJECTS.Maths },
    { title: "Must-Do", subtitle: `${mustDo} high-yield`, color: T.amber, soft: T.amberSoft, icon: Target },
  ];
  const r = 70, C = 2 * Math.PI * r;
  return (
    <div className="jaa-visual">
      <motion.div className="jaa-orbit jaa-orbit-1" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 70, ease: "linear" }} />
      <motion.div className="jaa-orbit jaa-orbit-2" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 100, ease: "linear" }} />
      <motion.div className="jaa-core" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 170, damping: 16 }}>
        <svg width="164" height="164" viewBox="0 0 164 164" className="jaa-core-svg">
          <circle cx="82" cy="82" r={r} fill="none" stroke={T.amberSoft} strokeWidth="6" />
          <motion.circle cx="82" cy="82" r={r} fill="none" stroke={T.amber} strokeWidth="6" strokeLinecap="round"
            transform="rotate(-90 82 82)" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * 0.26 }}
            transition={{ duration: 1.4, delay: 0.6, ease: "easeInOut" }} />
        </svg>
        <motion.div className="jaa-core-face" animate={{ y: [0, -7, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
          <span className="jaa-core-num">80</span><span className="jaa-core-cap">chapters<br />mapped</span>
        </motion.div>
      </motion.div>
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div key={i} className="jaa-fcard" style={ORBIT[i]}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{ opacity: { duration: 0.5, delay: 0.4 + i * 0.14 }, scale: { duration: 0.5, delay: 0.4 + i * 0.14 }, y: { repeat: Infinity, duration: 3.4 + i * 0.5, ease: "easeInOut", delay: i * 0.3 } }}>
            <span className="jaa-fcard-ic" style={{ color: card.color, background: card.soft }}><Icon size={18} strokeWidth={2.5} /></span>
            <span className="jaa-fcard-t">{card.title}</span><span className="jaa-fcard-s">{card.subtitle}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── subject study-time summary ── */
function SubjectSummary() {
  return (
    <section className="jaa-summary">
      <div className="jaa-dir-head">
        <span className="jaa-kicker"><Clock size={13} /> Where your 200 hours go</span>
        <h2 className="jaa-h2">A subject-wise revision budget</h2>
        <p className="jaa-dir-sub">Study hours modelled on each chapter's weightage and difficulty — Maths and Chemistry earn the biggest slices at Advanced.</p>
      </div>
      <div className="jaa-sum-grid">
        {SUBJECT_SUMMARY.map((s) => {
          const sub = SUBJECTS[s.subject]; const Icon = sub.icon;
          const total = s.tiers.reduce((a, t) => a + t.hours, 0);
          const barColors = { "Must-Do": sub.color, High: T.amber, Standard: T.border };
          return (
            <div key={s.subject} className="jaa-sum-card" style={{ "--accent": sub.color }}>
              <div className="jaa-sum-top">
                <span className="jaa-sum-ic" style={{ color: sub.color, background: sub.soft }}><Icon size={20} strokeWidth={2.4} /></span>
                <div><div className="jaa-sum-name">{s.subject}</div><div className="jaa-sum-sub">{s.chapters} chapters · {s.weightage} of paper</div></div>
                <span className="jaa-sum-hrs">{s.hours}<span>hrs</span></span>
              </div>
              <div className="jaa-sum-bar">
                {s.tiers.map((t) => <span key={t.priority} style={{ width: `${(t.hours / total) * 100}%`, background: barColors[t.priority] }} />)}
              </div>
              {s.tiers.map((t) => (
                <div key={t.priority} className="jaa-sum-row">
                  <span className="jaa-sum-dot" style={{ background: barColors[t.priority] }} />
                  <span className="jaa-sum-tier">{t.priority}</span>
                  <span className="jaa-sum-meta">{t.chapters} ch · {t.share}</span>
                  <span className="jaa-sum-th">{t.hours} hrs</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── page ── */
export default function JeeAdvancedAnalysis() {
  const [subject, setSubject] = useState("All");
  const [cls, setCls] = useState("All");
  const [diff, setDiff] = useState("All");
  const [trend, setTrend] = useState("All");
  const [q, setQ] = useState("");

  const subjectCounts = useMemo(() => {
    const c = { Physics: 0, Chemistry: 0, Maths: 0 };
    JEE_ADV_CHAPTERS.forEach((x) => { c[x.subject]++; }); return c;
  }, []);
  const mustDo = useMemo(() => JEE_ADV_CHAPTERS.filter((x) => x.priority === "Must-Do").length, []);
  const maxWt = useMemo(() => Math.max(...JEE_ADV_CHAPTERS.map((x) => x.wtMid), 1), []);

  const filtersOn = subject !== "All" || cls !== "All" || diff !== "All" || trend !== "All" || q.trim() !== "";

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return JEE_ADV_CHAPTERS
      .filter((ch) => {
        if (subject !== "All" && ch.subject !== subject) return false;
        if (cls !== "All" && ch.cls !== cls) return false;
        if (diff !== "All" && ch.difficulty !== diff) return false;
        if (trend !== "All" && ch.trend !== trend) return false;
        if (needle && !(`${ch.chapter} ${ch.focus} ${(ch.subtopics || []).join(" ")} ${ch.subject}`.toLowerCase().includes(needle))) return false;
        return true;
      })
      .map((ch) => ({ ...ch, ringPct: Math.min(ch.wtMid / maxWt, 1) }))
      .sort((a, b) => b.wtMid - a.wtMid || a.rank - b.rank);
  }, [subject, cls, diff, trend, q, maxWt]);

  const reset = () => { setSubject("All"); setCls("All"); setDiff("All"); setTrend("All"); setQ(""); };
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="jaa">
      <Seo
        title="JEE Advanced Chapter-wise Analysis 2026 — Weightage, Priority & Marks"
        description="All 80 NCERT chapters for JEE Advanced ranked chapter-by-chapter by weightage, marks at stake, difficulty, average questions and priority — with sub-topic breakdowns, class/difficulty/trend filters, a 200-hour study budget and the marking scheme on College Parichay."
        path="/jee-advanced-analysis"
      />

      {/* ── HERO ── */}
      <section className="jaa-hero">
        <div className="jaa-hero-card">
        <div className="jaa-hero-grid">
          <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
            <motion.h1 className="jaa-title" variants={fade}>Every chapter,<br />ranked by <span className="jaa-hl">what it's worth.</span></motion.h1>
            <motion.p className="jaa-sub" variants={fade}>
              All 80 NCERT chapters, one card each — tagged with weightage, marks at stake,
              difficulty, average questions and priority, so you always know exactly what to open next.
            </motion.p>
            <motion.div className="jaa-stats" variants={fade}>
              <div className="jaa-stat"><span className="jaa-stat-num">80</span><span className="jaa-stat-cap">Chapters mapped</span></div>
              <div className="jaa-stat"><span className="jaa-stat-num">3</span><span className="jaa-stat-cap">Subjects</span></div>
              <div className="jaa-stat"><span className="jaa-stat-num">{mustDo}</span><span className="jaa-stat-cap">Must-do chapters</span></div>
            </motion.div>
            <motion.div className="jaa-cta" variants={fade}>
              <button className="jaa-btn-primary" onClick={() => scrollTo("chapters")}><Sparkles size={17} /> Open the console</button>
              <button className="jaa-btn-ghost" onClick={() => scrollTo("budget")}>See the study budget <ArrowRight size={16} /></button>
            </motion.div>
          </motion.div>
          <HeroVisual subjectCounts={subjectCounts} mustDo={mustDo} />
        </div>
        </div>
      </section>

      {/* ── CONSOLE (sticky sidebar) + CARD GRID ── */}
      <section id="chapters" className="jaa-dir">
        <div className="jaa-workspace">
          {/* left: filters + how-to */}
          <aside className="jaa-sidebar">
            <div className="jaa-side-card">
              <div className="jaa-side-head">
                <span className="jaa-kicker"><Target size={13} /> Analysis console</span>
                <h2 className="jaa-side-title">Filter your 80 chapters</h2>
              </div>
              <div className="jaa-search">
                <Search size={16} color={T.muted} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a chapter or sub-topic…" />
                {q && <button onClick={() => setQ("")} aria-label="Clear"><X size={15} /></button>}
              </div>
              <div className="jaa-filters">
                <Segmented label="Subject" options={SUBJECT_FILTERS} value={subject} onChange={setSubject} dots={SUBJECT_DOTS} />
                <Segmented label="Class" options={CLASS_FILTERS} value={cls} onChange={setCls} fmt={(o) => (o === "All" ? "All" : `Class ${o}`)} />
                <Segmented label="Difficulty" options={DIFF_FILTERS} value={diff} onChange={setDiff} />
                <Segmented label="Trend" options={TREND_FILTERS} value={trend} onChange={setTrend} />
              </div>
              <div className="jaa-searchrow">
                <p className="jaa-count"><strong>{filtered.length}</strong> of 80 chapters shown</p>
                {filtersOn && <button className="jaa-reset" onClick={reset}>Clear all</button>}
              </div>
            </div>

            <div className="jaa-howto">
              <div className="jaa-howto-head">
                <span className="jaa-howto-ic"><Sparkles size={15} /></span>
                <h3>How to use this tool</h3>
              </div>
              <ol className="jaa-howto-steps">
                <li><strong>Pick a subject</strong> to focus on Physics, Chemistry or Maths — or leave it on All.</li>
                <li><strong>Narrow by class, difficulty or trend</strong> to match where you are in prep.</li>
                <li><strong>Search</strong> any chapter or sub-topic by name.</li>
                <li><strong>Open a card</strong> for its sub-topic breakdown; the ring shows exam weightage.</li>
                <li>Cards are <strong>sorted high-weightage first</strong> — start at the top.</li>
              </ol>
              <div className="jaa-howto-tip"><Target size={13} /> <span>Tip: clear <strong>Must-Do</strong> chapters first for the fastest marks.</span></div>
            </div>
          </aside>

          {/* right: cards */}
          <div className="jaa-main">
            {filtered.length > 0 ? (
              <div className="jaa-grid">
                {filtered.map((c, i) => <ChapterCard key={c.id} c={c} index={i} forceOpen={false} />)}
              </div>
            ) : (
              <div className="jaa-empty"><p>No chapters match those filters.</p><button onClick={reset}>Reset filters</button></div>
            )}
          </div>
        </div>
      </section>

      {/* ── STUDY BUDGET ── */}
      <div id="budget"><SubjectSummary /></div>

      {/* ── MARKING SCHEME ── */}
      <section className="jaa-marking">
        <div className="jaa-dir-head">
          <span className="jaa-kicker"><ShieldCheck size={13} /> Know the marking</span>
          <h2 className="jaa-h2">How the two papers are scored</h2>
          <p className="jaa-dir-sub">Advanced mixes question types with different reward and penalty — attempt strategy should follow the marking, not just the syllabus.</p>
        </div>
        <div className="jaa-mark-grid">
          {MARKING_SCHEME.map((m) => (
            <div key={m.type} className="jaa-mark-card">
              <div className="jaa-mark-type">{m.type}</div>
              <div className="jaa-mark-rows">
                <div><span>Correct</span><strong style={{ color: T.success }}>{m.correct}</strong></div>
                <div><span>Negative</span><strong style={{ color: T.error }}>{m.negative}</strong></div>
                <div><span>Partial</span><strong>{m.partial}</strong></div>
              </div>
            </div>
          ))}
        </div>
        <div className="jaa-back"><Link to="/jee-strategy">← Back to the JEE Advanced strategy guide</Link></div>
      </section>

      <style>{CSS}</style>
    </div>
  );
}

const fade = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 0.84, 0.32, 1] } } };

const CSS = `
.jaa { background:${T.bg}; color:${T.ink}; font-family:'DM Sans','Inter',system-ui,sans-serif; }
.jaa * { box-sizing:border-box; }

/* ── hero (plain full-width on desktop, becomes a card on mobile) ── */
.jaa-hero { position:relative; padding:128px 0 132px; border-bottom:1px solid ${T.borderLight};
  background-image:radial-gradient(rgba(245,158,11,.16) 1px, transparent 1px); background-size:40px 40px; }
.jaa-hero-card { position:relative; z-index:1; max-width:1250px; margin:0 auto; padding:0 24px; }
.jaa-hero-grid { display:grid; grid-template-columns:1.15fr .85fr; gap:80px; align-items:center; }
.jaa-title { font:800 clamp(2.6rem,4.4vw,3.9rem)/1.12 'Space Grotesk','Sora',sans-serif; letter-spacing:-.5px; color:${T.ink}; margin:0; }
.jaa-hl { color:${T.amber}; }
.jaa-sub { font:400 1.14rem/1.7 inherit; color:${T.body}; max-width:540px; margin:26px 0 0; }
.jaa-stats { display:flex; flex-wrap:wrap; gap:48px; margin:44px 0 0; }
.jaa-stat { display:flex; flex-direction:column; gap:8px; }
.jaa-stat-num { font:800 2.3rem/1 'Space Grotesk',sans-serif; color:${T.ink}; letter-spacing:-1px; }
.jaa-stat:first-child .jaa-stat-num { color:${T.amber}; }
.jaa-stat-cap { font:700 .82rem/1.1 inherit; text-transform:uppercase; letter-spacing:.05em; color:${T.muted}; }
.jaa-cta { display:flex; flex-wrap:wrap; gap:20px; align-items:center; margin:44px 0 0; }
.jaa-btn-primary { display:inline-flex; align-items:center; gap:9px; cursor:pointer; border:none; padding:18px 32px; border-radius:14px; font:700 1.05rem/1 'Space Grotesk',sans-serif; color:#fff; background:${T.amber}; box-shadow:0 10px 30px rgba(245,158,11,.32); transition:transform .18s, box-shadow .18s, background .18s; }
.jaa-btn-primary:hover { background:#e08e08; transform:translateY(-3px); box-shadow:0 16px 34px rgba(245,158,11,.44); }
.jaa-btn-ghost { display:inline-flex; align-items:center; gap:8px; cursor:pointer; background:transparent; border:none; color:${T.amber}; font:700 1rem/1 'Space Grotesk',sans-serif; padding:8px 6px; transition:gap .18s, color .18s; }
.jaa-btn-ghost:hover { color:${T.amberDk}; gap:12px; }

.jaa-visual { position:relative; height:480px; }
.jaa-orbit { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); border-radius:50%; }
.jaa-orbit-1 { width:300px; height:300px; border:2px dashed ${T.amber}66; }
.jaa-orbit-2 { width:410px; height:410px; border:1px dashed #FDE68A; }
.jaa-core { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:164px; height:164px; z-index:10; }
.jaa-core-svg { position:absolute; inset:0; }
.jaa-core-face { position:absolute; inset:14px; border-radius:50%; background:${T.surface}; box-shadow:0 22px 44px -12px rgba(245,158,11,.4); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; }
.jaa-core-num { font:800 2.5rem/1 'Space Grotesk',sans-serif; color:${T.amber}; letter-spacing:-1px; }
.jaa-core-cap { font:700 .72rem/1.25 inherit; text-transform:uppercase; letter-spacing:.04em; color:${T.muted}; text-align:center; }
.jaa-fcard { position:absolute; z-index:12; display:flex; flex-direction:column; gap:2px; background:${T.surface}; padding:13px 15px; border-radius:15px; border:1px solid ${T.border}; box-shadow:0 16px 34px -16px rgba(26,26,46,.26); width:150px; }
.jaa-fcard-ic { width:38px; height:38px; border-radius:11px; display:flex; align-items:center; justify-content:center; margin-bottom:6px; }
.jaa-fcard-t { font:700 .96rem/1.1 'Space Grotesk',sans-serif; color:${T.ink}; }
.jaa-fcard-s { font:600 .78rem/1.2 inherit; color:${T.muted}; }

/* ── directory / console ── */
.jaa-dir { max-width:1250px; margin:0 auto; padding:96px 24px 40px; }
.jaa-dir-head { text-align:center; max-width:680px; margin:0 auto 34px; }
.jaa-kicker { display:inline-flex; align-items:center; gap:7px; padding:6px 14px; border-radius:50px; background:${T.amberSoft}; color:${T.amberDk}; font:800 .72rem/1 'Space Grotesk',sans-serif; letter-spacing:.06em; text-transform:uppercase; }
.jaa-h2 { font:800 clamp(1.7rem,3.4vw,2.4rem)/1.15 'Space Grotesk',sans-serif; letter-spacing:-.8px; color:${T.ink}; margin:16px 0 0; }
.jaa-dir-sub { font:400 1.02rem/1.6 inherit; color:${T.body}; margin:12px 0 0; }

/* ── workspace: sticky filter sidebar + card grid ── */
.jaa-workspace { display:grid; grid-template-columns:300px 1fr; gap:24px; align-items:start; }
.jaa-sidebar { position:sticky; top:114px; display:flex; flex-direction:column; gap:16px; }
.jaa-main { min-width:0; max-height:calc(100vh - 128px); overflow-y:auto; overflow-x:hidden; padding:4px 10px 4px 4px; margin:-4px -6px -4px -4px; }
.jaa-main::-webkit-scrollbar { width:10px; }
.jaa-main::-webkit-scrollbar-track { background:transparent; }
.jaa-main::-webkit-scrollbar-thumb { background:${T.border}; border-radius:10px; border:2px solid transparent; background-clip:content-box; }
.jaa-main::-webkit-scrollbar-thumb:hover { background:${T.amber}; background-clip:content-box; }
.jaa-main { scrollbar-width:thin; scrollbar-color:${T.border} transparent; }

.jaa-side-card { background:${T.surface}; border:1px solid ${T.border}; border-radius:20px; padding:20px; box-shadow:0 18px 48px -32px rgba(26,26,46,.4); display:flex; flex-direction:column; gap:16px; }
.jaa-side-head { display:flex; flex-direction:column; align-items:flex-start; gap:12px; }
.jaa-side-title { font:800 1.12rem/1.2 'Space Grotesk',sans-serif; letter-spacing:-.4px; color:${T.ink}; margin:0; }

/* ── how-to info card ── */
.jaa-howto { background:${T.surface2}; border:1px solid ${T.borderLight}; border-radius:20px; padding:20px; }
.jaa-howto-head { display:flex; align-items:center; gap:10px; margin-bottom:15px; }
.jaa-howto-ic { width:30px; height:30px; border-radius:9px; display:grid; place-items:center; background:${T.amberSoft}; color:${T.amberDk}; flex-shrink:0; }
.jaa-howto-head h3 { font:800 .98rem/1.2 'Space Grotesk',sans-serif; color:${T.ink}; margin:0; }
.jaa-howto-steps { margin:0; padding:0; list-style:none; counter-reset:step; display:flex; flex-direction:column; gap:12px; }
.jaa-howto-steps li { position:relative; padding-left:30px; font:400 .88rem/1.55 sans-serif; color:${T.body}; counter-increment:step; }
.jaa-howto-steps li::before { content:counter(step); position:absolute; left:0; top:1px; width:20px; height:20px; border-radius:50%; background:${T.amber}; color:#fff; font:800 .68rem/20px 'Space Grotesk',sans-serif; text-align:center; }
.jaa-howto-steps strong { color:${T.ink}; font-weight:700; }
.jaa-howto-tip { display:flex; align-items:flex-start; gap:7px; margin-top:16px; padding:10px 12px; border-radius:11px; background:${T.amberSoft}; color:${T.amberDk}; font:600 .76rem/1.4 sans-serif; }
.jaa-howto-tip svg { flex-shrink:0; margin-top:2px; }
.jaa-howto-tip strong { font-weight:800; }

/* ── segmented pill filters (subject / class / difficulty / trend) ── */
.jaa-filters { display:flex; flex-direction:column; gap:15px; }
.jaa-seg-wrap { display:flex; flex-direction:column; gap:7px; }
.jaa-seg-lbl { font:800 .7rem/1 'Space Grotesk',sans-serif; letter-spacing:.08em; text-transform:uppercase; color:${T.muted}; }
.jaa-seg { display:flex; flex-wrap:wrap; width:fit-content; max-width:100%; gap:4px; padding:4px; background:${T.surface2}; border:1px solid ${T.border}; border-radius:13px; }
.jaa-seg-btn { display:inline-flex; align-items:center; gap:7px; white-space:nowrap; cursor:pointer; border:none; background:transparent; color:${T.body}; padding:9px 15px; border-radius:9px; font:700 .87rem/1 'Space Grotesk',sans-serif; transition:background .16s, color .16s, box-shadow .16s; }
.jaa-seg-btn:hover { color:${T.amberDk}; }
.jaa-seg-btn.on { background:${T.surface}; color:${T.ink}; box-shadow:0 2px 9px -3px rgba(26,26,46,.28), inset 0 -2px 0 var(--on, ${T.amber}); }
.jaa-seg-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }

.jaa-search { display:flex; align-items:center; gap:9px; width:100%; background:${T.surface}; border:1px solid ${T.border}; border-radius:11px; padding:12px 15px; }
.jaa-search:focus-within { border-color:${T.amber}; box-shadow:0 0 0 3px ${T.amberSoft}; }
.jaa-search input { flex:1; border:none; outline:none; background:none; font:500 .96rem/1 inherit; color:${T.ink}; min-width:0; }
.jaa-search button { display:grid; place-items:center; color:${T.muted}; background:none; border:none; cursor:pointer; }
.jaa-searchrow { display:flex; flex-wrap:wrap; align-items:center; gap:14px; }
.jaa-count { font:500 .94rem/1 inherit; color:${T.muted}; margin:0; }
.jaa-count strong { color:${T.amberDk}; }
.jaa-reset { cursor:pointer; border:1px solid ${T.border}; background:${T.surface}; color:${T.body}; padding:9px 15px; border-radius:50px; font:700 .8rem/1 'Space Grotesk',sans-serif; }
.jaa-reset:hover { border-color:${T.error}; color:${T.error}; }

.jaa-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(255px, 1fr)); gap:18px; align-items:start; }

/* ── chapter card (compact · small type) ── */
.jaa-card { background:${T.surface}; border:1px solid ${T.border}; border-left:4px solid var(--accent); border-radius:15px; padding:16px 16px 14px; transition:transform .18s, box-shadow .18s; }
.jaa-card:hover { transform:translateY(-3px); box-shadow:0 18px 38px -20px rgba(26,26,46,.3); }
.jaa-card-top { display:flex; align-items:flex-start; gap:11px; }
.jaa-ring { position:relative; display:grid; place-items:center; flex-shrink:0; }
.jaa-ring-lbl { position:absolute; font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:-.3px; color:${T.ink}; }
.jaa-card-head { flex:1; min-width:0; }
.jaa-cat { display:inline-flex; align-items:center; gap:5px; padding:3px 8px; border-radius:50px; background:${T.surface2}; border:1px solid ${T.borderLight}; color:${T.body}; font:700 10px/1 'Space Grotesk',sans-serif; letter-spacing:.07em; text-transform:uppercase; }
.jaa-chap { font:700 1.02rem/1.25 'Space Grotesk',sans-serif; color:${T.ink}; letter-spacing:-.2px; margin:7px 0 0; }
.jaa-prio { flex-shrink:0; padding:4px 8px; border:1.2px dashed currentColor; border-radius:7px; font:700 9.5px/1 'Space Grotesk',sans-serif; letter-spacing:.06em; }
.jaa-meta { display:flex; flex-wrap:wrap; gap:12px 20px; margin:13px 0 0; }
.jaa-metric { display:flex; flex-direction:column; gap:5px; }
.jaa-metric-cap { font:700 .64rem/1 'Space Grotesk',sans-serif; text-transform:uppercase; letter-spacing:.06em; color:${T.muted}; }
.jaa-metric-val { font:700 .92rem/1 'Space Grotesk',sans-serif; color:${T.ink}; }
.jaa-diff { align-self:flex-start; padding:4px 9px; border-radius:6px; font:700 .74rem/1.3 inherit; }
.jaa-focus { font:400 .84rem/1.55 sans-serif; color:${T.body}; margin:12px 0 0; }
.jaa-toggle { display:inline-flex; align-items:center; gap:6px; margin-top:13px; cursor:pointer; padding:6px 11px; border:1.1px solid ${T.ink}; border-radius:7px; background:transparent; color:${T.ink}; font:700 .66rem/1 'Space Grotesk',sans-serif; letter-spacing:.07em; text-transform:uppercase; }
.jaa-chev { transition:transform .2s; } .jaa-chev.open { transform:rotate(180deg); }
.jaa-break { overflow:hidden; }
.jaa-break-inner { margin-top:8px; padding-top:9px; border-top:1px dashed ${T.border}; display:flex; flex-direction:column; gap:2px; }
.jaa-brk-row { display:flex; align-items:center; gap:8px; padding:5px 0; }
.jaa-brk-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }
.jaa-brk-name { font:500 .8rem/1.45 sans-serif; color:${T.body}; }

.jaa-empty { text-align:center; padding:60px 0; }
.jaa-empty p { font:700 1.05rem/1 'Space Grotesk',sans-serif; color:${T.body}; margin-bottom:16px; }
.jaa-empty button { cursor:pointer; border:none; padding:11px 22px; border-radius:10px; background:${T.amber}; color:#fff; font:700 .88rem/1 'Space Grotesk',sans-serif; }

/* ── subject summary / budget ── */
.jaa-summary { max-width:1250px; margin:0 auto; padding:40px 24px 20px; }
.jaa-sum-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.jaa-sum-card { background:${T.surface}; border:1px solid ${T.border}; border-top:4px solid var(--accent); border-radius:16px; padding:17px; }
.jaa-sum-top { display:flex; align-items:center; gap:11px; }
.jaa-sum-ic { width:36px; height:36px; border-radius:10px; display:grid; place-items:center; flex-shrink:0; }
.jaa-sum-ic svg { width:17px; height:17px; }
.jaa-sum-name { font:800 .96rem/1 'Space Grotesk',sans-serif; color:${T.ink}; }
.jaa-sum-sub { font:600 .68rem/1.3 inherit; color:${T.muted}; margin-top:4px; }
.jaa-sum-hrs { margin-left:auto; font:800 1.25rem/1 'Space Grotesk',sans-serif; color:${T.ink}; }
.jaa-sum-hrs span { font-size:.6rem; color:${T.muted}; margin-left:3px; }
.jaa-sum-bar { display:flex; height:7px; border-radius:50px; overflow:hidden; margin:15px 0 12px; background:${T.surface2}; }
.jaa-sum-bar span { height:100%; }
.jaa-sum-row { display:flex; align-items:center; gap:8px; padding:5px 0; font:600 .72rem/1 inherit; }
.jaa-sum-dot { width:8px; height:8px; border-radius:3px; flex-shrink:0; }
.jaa-sum-tier { font-weight:800; font-family:'Space Grotesk',sans-serif; color:${T.ink}; }
.jaa-sum-meta { color:${T.muted}; }
.jaa-sum-th { margin-left:auto; font-weight:800; font-family:'Space Grotesk',sans-serif; color:${T.body}; }

/* ── marking ── */
.jaa-marking { max-width:1250px; margin:0 auto; padding:56px 24px 90px; }
.jaa-mark-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }
.jaa-mark-card { background:${T.surface}; border:1px solid ${T.border}; border-radius:14px; padding:18px; }
.jaa-mark-type { font:800 .92rem/1.3 'Space Grotesk',sans-serif; color:${T.ink}; min-height:2.6em; }
.jaa-mark-rows { margin-top:12px; border-top:1px dashed ${T.border}; padding-top:10px; display:flex; flex-direction:column; gap:8px; }
.jaa-mark-rows div { display:flex; justify-content:space-between; align-items:center; gap:10px; }
.jaa-mark-rows span { font:600 .78rem/1 inherit; color:${T.muted}; }
.jaa-mark-rows strong { font:800 .84rem/1.2 'Space Grotesk',sans-serif; color:${T.ink}; text-align:right; }

.jaa-back { text-align:center; margin-top:44px; }
.jaa-back a { color:${T.amberDk}; font:700 .95rem/1 'Space Grotesk',sans-serif; text-decoration:none; }
.jaa-back a:hover { text-decoration:underline; }

/* ── responsive ── */
@media (max-width:1000px) {
  /* mobile / tablet: hero becomes a contained card. Top padding clears the
     98px fixed header (TopBar 34 + Navbar 64) so the card isn't overlapped. */
  .jaa-hero { padding:118px 16px 64px; }
  .jaa-hero-card { max-width:600px; padding:36px 30px; background:${T.surface}; border:1px solid ${T.border}; border-radius:24px; box-shadow:0 24px 60px -34px rgba(26,26,46,.3); }
  .jaa-hero-grid { grid-template-columns:1fr; gap:24px; text-align:center; }
  .jaa-title, .jaa-sub { margin-left:auto; margin-right:auto; }
  .jaa-cta { justify-content:center; }
  .jaa-visual { height:400px; order:2; }
  /* workspace collapses: filters/how-to stack above the cards */
  .jaa-workspace { grid-template-columns:1fr; gap:20px; }
  .jaa-sidebar { position:static; }
  .jaa-main { max-height:none; overflow:visible; padding:0; margin:0; }
  .jaa-sum-grid { grid-template-columns:repeat(2,1fr); }
  .jaa-mark-grid { grid-template-columns:repeat(2,1fr); }
  .jaa-dir { padding-top:64px; }
  /* stats become a tidy 3-column card with dividers (phones + tablets) */
  .jaa-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:0; margin:34px auto 0; width:100%; max-width:460px;
    background:${T.surface}; border:1px solid ${T.border}; border-radius:18px; padding:18px 8px; box-shadow:0 10px 30px -20px rgba(26,26,46,.4); }
  .jaa-stat { align-items:center; text-align:center; gap:6px; padding:2px 4px; }
  .jaa-stat + .jaa-stat { border-left:1px solid ${T.borderLight}; }
  .jaa-stat-num { font-size:1.8rem; }
  .jaa-stat-cap { font-size:.6rem; line-height:1.3; }
}
@media (max-width:760px) {
  .jaa-hero { padding:116px 12px 52px; }
  .jaa-hero-card { padding:30px 20px; border-radius:20px; }
  .jaa-visual { display:none; }
  .jaa-side-card, .jaa-howto { padding:18px; border-radius:16px; }
  .jaa-sum-grid, .jaa-mark-grid { grid-template-columns:1fr; }
}
@media (max-width:420px) {
  .jaa-hero-card { padding:26px 16px; }
  .jaa-stats { grid-template-columns:repeat(3,1fr); }
  .jaa-stat-num { font-size:1.5rem; }
  .jaa-btn-primary, .jaa-btn-ghost { width:100%; justify-content:center; }
  .jaa-cta { width:100%; }
}
/* Match the site-wide .container widths so page content left-aligns with the
   navbar/footer instead of sitting inset. Mirrors the --maxw breakpoints. */
@media (min-width:1025px) and (max-width:1279px) {
  .jaa-hero-card, .jaa-dir, .jaa-summary, .jaa-marking { max-width:1140px; }
}
@media (min-width:1280px) and (max-width:1727px) {
  .jaa-hero-card, .jaa-dir, .jaa-summary, .jaa-marking { max-width:1400px; }
}
@media (min-width:1728px) {
  .jaa-hero-card, .jaa-dir, .jaa-summary, .jaa-marking { max-width:1600px; padding-inline:2.5rem; }
}
@media (prefers-reduced-motion: reduce) { .jaa-orbit { animation:none !important; } }
`;
