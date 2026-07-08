/* JeeAdvancedAnalysis — the JEE Advanced "Chapter Intelligence" directory.
   A premium (Class 11/12-style) hero over a filterable grid of all 80
   NCERT-mapped chapters, each card carrying weightage, marks-at-stake,
   avg questions, difficulty, priority, trend and a sub-topic breakdown.
   Self-contained blue/purple design system (own tokens, no shared theme). */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Atom, FlaskConical, Sigma, Search, X, ChevronDown, Sparkles,
  TrendingUp, TrendingDown, Minus, Target, ArrowRight,
} from "lucide-react";
import Seo from "../components/Seo.jsx";
import { JEE_ADV_CHAPTERS } from "../data/jeeAdvancedChapters.js";

/* ── design tokens (self-contained, blue/purple) ── */
const T = {
  bg: "#F8FAFC", surface: "#FFFFFF", surface2: "#F1F5F9",
  primary: "#2563EB", primaryHover: "#1D4ED8", primaryLight: "#DBEAFE",
  secondary: "#7C3AED", secondaryLight: "#EDE9FE",
  success: "#16A34A", successLight: "#DCFCE7",
  warning: "#F59E0B", warningLight: "#FEF3C7",
  error: "#DC2626", errorLight: "#FEE2E2",
  info: "#0891B2", infoLight: "#CFFAFE",
  ink: "#0F172A", body: "#475569", muted: "#94A3B8",
  border: "#E2E8F0", borderLight: "#F1F5F9",
};

/* per-subject accent + icon */
const SUBJECTS = {
  Physics:   { color: T.primary,   soft: T.primaryLight,   icon: Atom,         short: "PHY" },
  Chemistry: { color: T.secondary, soft: T.secondaryLight, icon: FlaskConical, short: "CHE" },
  Maths:     { color: T.info,      soft: T.infoLight,      icon: Sigma,        short: "MATH" },
};

/* priority → outlined-pill style (mirrors the reference card badges) */
const PRIORITY = {
  "Must-Do":  { fg: T.ink,     bd: T.ink,     bg: "transparent", label: "MUST-DO" },
  High:       { fg: "#B45309", bd: T.warning, bg: "transparent", label: "HIGH" },
  Standard:   { fg: T.muted,   bd: T.border,  bg: "transparent", label: "STANDARD" },
};

/* difficulty → filled soft pill */
const DIFFICULTY = {
  "Low":           { fg: "#15803D", bg: T.successLight },
  "Low-Medium":    { fg: "#15803D", bg: T.successLight },
  "Medium":        { fg: "#B45309", bg: T.warningLight },
  "Medium-High":   { fg: "#C2410C", bg: "#FFEDD5" },
  "High":          { fg: "#B91C1C", bg: T.errorLight },
};

const TRENDS = {
  Rising:  { icon: TrendingUp,   fg: T.success },
  Stable:  { icon: Minus,        fg: T.muted },
  Falling: { icon: TrendingDown, fg: T.error },
};

const SUBJECT_FILTERS  = ["All", "Physics", "Chemistry", "Maths"];
const CLASS_FILTERS    = ["All", "11", "12"];
const PRIORITY_FILTERS = ["All", "Must-Do", "High", "Standard"];
const DIFF_FILTERS     = ["All", "Low", "Low-Medium", "Medium", "Medium-High", "High"];
const SORTS = [
  { key: "rank",   label: "Study priority" },
  { key: "weight", label: "Weightage" },
  { key: "az",     label: "A → Z" },
];

const MAX_WT = 9; // ring is scaled against the highest chapter weightage

/* ─────────────────────────  weightage ring  ───────────────────────── */
function Ring({ pct, color, label }) {
  const r = 26, C = 2 * Math.PI * r;
  return (
    <div className="jaa-ring">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke={T.surface2} strokeWidth="6" />
        <motion.circle
          cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          transform="rotate(-90 32 32)" strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          whileInView={{ strokeDashoffset: C * (1 - pct) }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      <span className="jaa-ring-lbl" style={{ color: T.ink }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────  chapter card  ───────────────────────── */
function ChapterCard({ c, index }) {
  const [open, setOpen] = useState(false);
  const sub = SUBJECTS[c.subject];
  const Icon = sub.icon;
  const prio = PRIORITY[c.priority] || PRIORITY.Standard;
  const diff = DIFFICULTY[c.difficulty] || DIFFICULTY.Medium;
  const trend = TRENDS[c.trend] || TRENDS.Stable;
  const TrendIcon = trend.icon;

  return (
    <motion.article
      className="jaa-card"
      style={{ "--accent": sub.color }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.04 }}
    >
      <div className="jaa-card-top">
        <Ring pct={Math.min(c.wtMid / MAX_WT, 1)} color={sub.color} label={c.weightage} />
        <div className="jaa-card-head">
          <span className="jaa-cat" style={{ color: sub.color, background: sub.soft }}>
            <Icon size={12} strokeWidth={2.5} /> {c.subject} · Class {c.cls}
          </span>
        </div>
        <span className="jaa-prio" style={{ color: prio.fg, borderColor: prio.bd }}>
          {prio.label}
        </span>
      </div>

      <h3 className="jaa-chap">{c.chapter}</h3>

      <div className="jaa-meta">
        <div className="jaa-metric">
          <span className="jaa-metric-cap">Avg. Qs</span>
          <span className="jaa-metric-val">{c.avgQs}</span>
        </div>
        <div className="jaa-metric">
          <span className="jaa-metric-cap">Marks@stake</span>
          <span className="jaa-metric-val">{c.marks}</span>
        </div>
        <div className="jaa-metric">
          <span className="jaa-metric-cap">Difficulty</span>
          <span className="jaa-diff" style={{ color: diff.fg, background: diff.bg }}>{c.difficulty}</span>
        </div>
      </div>

      <p className="jaa-focus">{c.focus}</p>

      <button className="jaa-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <ChevronDown size={14} className={open ? "jaa-chev open" : "jaa-chev"} />
        Sub-topic breakdown
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="jaa-break"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="jaa-break-inner">
              <div className="jaa-chips">
                {c.subtopics.map((s, i) => (
                  <span key={i} className="jaa-chip">{s}</span>
                ))}
              </div>
              <div className="jaa-break-foot">
                <span className="jaa-foot-item">
                  <TrendIcon size={13} color={trend.fg} strokeWidth={2.5} />
                  <span style={{ color: trend.fg }}>{c.trend}</span>
                </span>
                <span className="jaa-foot-item">
                  <Target size={13} color={T.primary} strokeWidth={2.5} />
                  Priority score <strong>{c.score}</strong>
                </span>
                <span className="jaa-foot-item jaa-rank">#{c.rank} overall</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/* ─────────────────────────  segmented filter  ───────────────────────── */
function Segmented({ label, options, value, onChange }) {
  return (
    <div className="jaa-seg-wrap">
      <span className="jaa-seg-label">{label}</span>
      <div className="jaa-seg">
        {options.map((o) => (
          <button
            key={o}
            className={value === o ? "jaa-seg-btn on" : "jaa-seg-btn"}
            onClick={() => onChange(o)}
          >
            {o === "11" || o === "12" ? `Class ${o}` : o}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────  hero visual  ───────────────────────── */
const ORBIT = [
  { top: "0%", left: "-4%" },
  { top: "8%", right: "-6%" },
  { bottom: "12%", left: "-6%" },
  { bottom: "-2%", right: "-2%" },
];
function HeroVisual({ subjectCounts, mustDo }) {
  const cards = [
    { title: "Physics", subtitle: `${subjectCounts.Physics} chapters`, ...SUBJECTS.Physics },
    { title: "Chemistry", subtitle: `${subjectCounts.Chemistry} chapters`, ...SUBJECTS.Chemistry },
    { title: "Maths", subtitle: `${subjectCounts.Maths} chapters`, ...SUBJECTS.Maths },
    { title: "Must-Do", subtitle: `${mustDo} high-yield`, color: T.error, soft: T.errorLight, icon: Target },
  ];
  const r = 70, C = 2 * Math.PI * r;
  return (
    <div className="jaa-visual">
      {/* orbit rings */}
      <motion.div className="jaa-orbit jaa-orbit-1" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 70, ease: "linear" }} />
      <motion.div className="jaa-orbit jaa-orbit-2" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 100, ease: "linear" }} />

      {/* centre node */}
      <motion.div
        className="jaa-core"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 170, damping: 16 }}
      >
        <svg width="164" height="164" viewBox="0 0 164 164" className="jaa-core-svg">
          <circle cx="82" cy="82" r={r} fill="none" stroke={T.primaryLight} strokeWidth="6" />
          <motion.circle
            cx="82" cy="82" r={r} fill="none" stroke={T.primary} strokeWidth="6" strokeLinecap="round"
            transform="rotate(-90 82 82)" strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: C * 0.26 }}
            transition={{ duration: 1.4, delay: 0.6, ease: "easeInOut" }}
          />
        </svg>
        <motion.div className="jaa-core-face" animate={{ y: [0, -7, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
          <span className="jaa-core-num">80</span>
          <span className="jaa-core-cap">chapters<br />mapped</span>
        </motion.div>
      </motion.div>

      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={i}
            className="jaa-fcard"
            style={ORBIT[i]}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 0.4 + i * 0.14 },
              scale: { duration: 0.5, delay: 0.4 + i * 0.14 },
              y: { repeat: Infinity, duration: 3.4 + i * 0.5, ease: "easeInOut", delay: i * 0.3 },
            }}
          >
            <span className="jaa-fcard-ic" style={{ color: card.color, background: card.soft }}>
              <Icon size={18} strokeWidth={2.5} />
            </span>
            <span className="jaa-fcard-t">{card.title}</span>
            <span className="jaa-fcard-s">{card.subtitle}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────  page  ───────────────────────── */
export default function JeeAdvancedAnalysis() {
  const [subject, setSubject]   = useState("All");
  const [cls, setCls]           = useState("All");
  const [priority, setPriority] = useState("All");
  const [diff, setDiff]         = useState("All");
  const [q, setQ]               = useState("");
  const [sort, setSort]         = useState("rank");

  const subjectCounts = useMemo(() => {
    const c = { Physics: 0, Chemistry: 0, Maths: 0 };
    JEE_ADV_CHAPTERS.forEach((x) => { c[x.subject] = (c[x.subject] || 0) + 1; });
    return c;
  }, []);
  const mustDo = useMemo(() => JEE_ADV_CHAPTERS.filter((x) => x.priority === "Must-Do").length, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let rows = JEE_ADV_CHAPTERS.filter((x) => {
      if (subject !== "All" && x.subject !== subject) return false;
      if (cls !== "All" && x.cls !== cls) return false;
      if (priority !== "All" && x.priority !== priority) return false;
      if (diff !== "All" && x.difficulty !== diff) return false;
      if (needle && !(`${x.chapter} ${x.focus}`.toLowerCase().includes(needle))) return false;
      return true;
    });
    if (sort === "weight") rows = [...rows].sort((a, b) => b.wtMid - a.wtMid);
    else if (sort === "az") rows = [...rows].sort((a, b) => a.chapter.localeCompare(b.chapter));
    else rows = [...rows].sort((a, b) => a.rank - b.rank);
    return rows;
  }, [subject, cls, priority, diff, q, sort]);

  const reset = () => { setSubject("All"); setCls("All"); setPriority("All"); setDiff("All"); setQ(""); };
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="jaa">
      <Seo
        title="JEE Advanced Chapter-wise Analysis 2026 — Weightage, Priority & Marks"
        description="All 80 NCERT chapters for JEE Advanced (Class 11 + 12) ranked by weightage, marks at stake, difficulty, priority and a computed study-priority score. Filter Physics, Chemistry and Maths by class, priority and difficulty on College Parichay."
        path="/jee-advanced-analysis"
      />

      {/* ── HERO (Class 11/12 premium layout, blue theme) ── */}
      <section className="jaa-hero">
        <div className="jaa-dots" />
        <div className="jaa-hero-grid">
          <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
            <motion.span className="jaa-badge" variants={fade}>
              <motion.span className="jaa-badge-dot" animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
              JEE ADVANCED · CHAPTER INTELLIGENCE
            </motion.span>

            <motion.h1 className="jaa-title" variants={fade}>
              Every chapter,<br />
              ranked by <span className="jaa-hl">what it's</span> <span className="jaa-hl2">worth.</span>
            </motion.h1>

            <motion.p className="jaa-sub" variants={fade}>
              All 80 NCERT chapters across Physics, Chemistry and Maths — tagged with weightage,
              marks at stake, difficulty and a computed study-priority score, so you always know
              exactly what to open next.
            </motion.p>

            <motion.div className="jaa-stats" variants={fade}>
              <div className="jaa-stat"><span className="jaa-stat-num">80</span><span className="jaa-stat-cap">Chapters mapped</span></div>
              <div className="jaa-stat"><span className="jaa-stat-num" style={{ color: T.error }}>{mustDo}</span><span className="jaa-stat-cap">Must-do chapters</span></div>
              <div className="jaa-stat"><span className="jaa-stat-num" style={{ color: T.secondary }}>3</span><span className="jaa-stat-cap">Subjects</span></div>
            </motion.div>

            <motion.div className="jaa-cta" variants={fade}>
              <button className="jaa-btn-primary" onClick={() => scrollTo("chapters")}>
                <Sparkles size={17} /> Explore all 80 chapters
              </button>
              <button className="jaa-btn-ghost" onClick={() => scrollTo("chapters")}>
                How the scoring works <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>

          <HeroVisual subjectCounts={subjectCounts} mustDo={mustDo} />
        </div>
      </section>

      {/* ── DIRECTORY ── */}
      <section id="chapters" className="jaa-dir">
        <div className="jaa-dir-head">
          <span className="jaa-kicker"><Target size={13} /> The full chapter map</span>
          <h2 className="jaa-h2">Filter down to your next 10 hours of study</h2>
          <p className="jaa-dir-sub">
            Weightage and marks are directional estimates from multi-year JEE Advanced PYQ analysis —
            treat them as priority signals, not official statistics.
          </p>
        </div>

        {/* filters */}
        <div className="jaa-filters">
          <Segmented label="Subject"    options={SUBJECT_FILTERS}  value={subject}  onChange={setSubject} />
          <Segmented label="Class"      options={CLASS_FILTERS}    value={cls}      onChange={setCls} />
          <Segmented label="Priority"   options={PRIORITY_FILTERS} value={priority} onChange={setPriority} />
          <Segmented label="Difficulty" options={DIFF_FILTERS}     value={diff}     onChange={setDiff} />
        </div>

        <div className="jaa-toolbar">
          <div className="jaa-search">
            <Search size={16} color={T.muted} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a chapter or topic…" />
            {q && <button onClick={() => setQ("")} aria-label="Clear"><X size={15} /></button>}
          </div>
          <div className="jaa-sort">
            <span>Sort</span>
            {SORTS.map((s) => (
              <button key={s.key} className={sort === s.key ? "on" : ""} onClick={() => setSort(s.key)}>{s.label}</button>
            ))}
          </div>
        </div>

        <p className="jaa-count">Showing <strong>{filtered.length}</strong> of {JEE_ADV_CHAPTERS.length} chapters</p>

        {filtered.length > 0 ? (
          <div className="jaa-grid">
            {filtered.map((c, i) => <ChapterCard key={c.id} c={c} index={i} />)}
          </div>
        ) : (
          <div className="jaa-empty">
            <p>No chapters match those filters.</p>
            <button onClick={reset}>Reset filters</button>
          </div>
        )}

        <div className="jaa-back">
          <Link to="/jee-strategy">← Back to the JEE Advanced strategy guide</Link>
        </div>
      </section>

      <style>{CSS}</style>
    </div>
  );
}

const fade = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 0.84, 0.32, 1] } } };

const CSS = `
.jaa { background:${T.bg}; color:${T.ink}; font-family:'DM Sans','Inter',system-ui,sans-serif; }
.jaa * { box-sizing:border-box; }

/* ── hero ── */
.jaa-hero { position:relative; overflow:hidden; padding:90px 24px 104px; border-bottom:1px solid ${T.borderLight}; }
.jaa-dots { position:absolute; inset:0; z-index:0; opacity:.5;
  background-image:radial-gradient(${T.primary}22 1px, transparent 1px); background-size:38px 38px; }
.jaa-hero-grid { position:relative; z-index:1; max-width:1220px; margin:0 auto; display:grid; grid-template-columns:1.12fr .88fr; gap:64px; align-items:center; }

.jaa-badge { display:inline-flex; align-items:center; gap:10px; padding:8px 18px; border-radius:50px;
  background:${T.primaryLight}; color:${T.primaryHover}; border:1px solid ${T.primary}33;
  font:800 .74rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; text-transform:uppercase; }
.jaa-badge-dot { width:8px; height:8px; border-radius:50%; background:${T.primary}; display:inline-block; }

.jaa-title { font:800 clamp(2.5rem,4.6vw,3.9rem)/1.08 'Space Grotesk','Sora',sans-serif; letter-spacing:-1.5px; color:${T.ink}; margin:26px 0 0; }
.jaa-hl { color:${T.primary}; }
.jaa-hl2 { color:${T.secondary}; }
.jaa-sub { font:400 1.14rem/1.7 inherit; color:${T.body}; max-width:560px; margin:22px 0 0; }

.jaa-stats { display:flex; flex-wrap:wrap; gap:44px; margin:36px 0 0; }
.jaa-stat { display:flex; flex-direction:column; gap:6px; }
.jaa-stat-num { font:800 2.4rem/1 'Space Grotesk',sans-serif; color:${T.primary}; letter-spacing:-1px; }
.jaa-stat-cap { font:700 .78rem/1.1 inherit; text-transform:uppercase; letter-spacing:.05em; color:${T.muted}; }

.jaa-cta { display:flex; flex-wrap:wrap; gap:16px; align-items:center; margin:40px 0 0; }
.jaa-btn-primary { display:inline-flex; align-items:center; gap:9px; cursor:pointer; border:none;
  padding:16px 28px; border-radius:14px; font:700 1.02rem/1 'Space Grotesk',sans-serif; color:#fff;
  background:${T.primary}; box-shadow:0 10px 26px -8px ${T.primary}; transition:transform .18s, box-shadow .18s, background .18s; }
.jaa-btn-primary:hover { background:${T.primaryHover}; transform:translateY(-2px); box-shadow:0 16px 32px -10px ${T.primary}; }
.jaa-btn-ghost { display:inline-flex; align-items:center; gap:7px; cursor:pointer; background:transparent; border:none;
  color:${T.primary}; font:700 1rem/1 'Space Grotesk',sans-serif; padding:10px 8px; transition:gap .18s, color .18s; }
.jaa-btn-ghost:hover { color:${T.primaryHover}; gap:11px; }

/* ── hero visual ── */
.jaa-visual { position:relative; height:460px; }
.jaa-orbit { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); border-radius:50%; }
.jaa-orbit-1 { width:300px; height:300px; border:2px dashed ${T.primary}44; }
.jaa-orbit-2 { width:410px; height:410px; border:1px dashed ${T.secondary}44; }
.jaa-core { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:164px; height:164px; z-index:10; }
.jaa-core-svg { position:absolute; inset:0; }
.jaa-core-face { position:absolute; inset:14px; border-radius:50%; background:${T.surface};
  box-shadow:0 22px 44px -12px ${T.primary}55; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; }
.jaa-core-num { font:800 2.5rem/1 'Space Grotesk',sans-serif; color:${T.primary}; letter-spacing:-1px; }
.jaa-core-cap { font:700 .72rem/1.25 inherit; text-transform:uppercase; letter-spacing:.04em; color:${T.muted}; text-align:center; }

.jaa-fcard { position:absolute; z-index:12; display:flex; flex-direction:column; gap:2px;
  background:${T.surface}; padding:13px 15px; border-radius:15px; border:1px solid ${T.borderLight};
  box-shadow:0 16px 34px -14px rgba(15,23,42,.28); width:150px; }
.jaa-fcard-ic { width:38px; height:38px; border-radius:11px; display:flex; align-items:center; justify-content:center; margin-bottom:6px; }
.jaa-fcard-t { font:700 .96rem/1.1 'Space Grotesk',sans-serif; color:${T.ink}; }
.jaa-fcard-s { font:600 .78rem/1.2 inherit; color:${T.muted}; }

/* ── directory ── */
.jaa-dir { max-width:1220px; margin:0 auto; padding:66px 24px 96px; }
.jaa-dir-head { text-align:center; max-width:680px; margin:0 auto 30px; }
.jaa-kicker { display:inline-flex; align-items:center; gap:7px; padding:6px 14px; border-radius:50px;
  background:${T.secondaryLight}; color:${T.secondary}; font:800 .72rem/1 'Space Grotesk',sans-serif; letter-spacing:.06em; text-transform:uppercase; }
.jaa-h2 { font:800 clamp(1.7rem,3.4vw,2.4rem)/1.15 'Space Grotesk',sans-serif; letter-spacing:-.8px; color:${T.ink}; margin:16px 0 0; }
.jaa-dir-sub { font:400 1.02rem/1.6 inherit; color:${T.body}; margin:12px 0 0; }

/* filters */
.jaa-filters { display:flex; flex-wrap:wrap; gap:14px 26px; justify-content:center; padding:22px; margin-bottom:16px;
  background:${T.surface}; border:1px solid ${T.border}; border-radius:18px; box-shadow:0 6px 22px -14px rgba(15,23,42,.18); }
.jaa-seg-wrap { display:flex; flex-direction:column; gap:8px; }
.jaa-seg-label { font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.08em; text-transform:uppercase; color:${T.muted}; }
.jaa-seg { display:inline-flex; flex-wrap:wrap; gap:6px; }
.jaa-seg-btn { cursor:pointer; border:1px solid ${T.border}; background:${T.surface}; color:${T.body};
  padding:7px 13px; border-radius:9px; font:700 .82rem/1 inherit; transition:all .15s; white-space:nowrap; }
.jaa-seg-btn:hover { border-color:${T.primary}; color:${T.primary}; }
.jaa-seg-btn.on { background:${T.primary}; border-color:${T.primary}; color:#fff; }

.jaa-toolbar { display:flex; flex-wrap:wrap; gap:14px; align-items:center; justify-content:space-between; margin-bottom:8px; }
.jaa-search { display:flex; align-items:center; gap:9px; flex:1 1 280px; max-width:420px;
  background:${T.surface}; border:1px solid ${T.border}; border-radius:12px; padding:11px 15px; }
.jaa-search:focus-within { border-color:${T.primary}; box-shadow:0 0 0 3px ${T.primaryLight}; }
.jaa-search input { flex:1; border:none; outline:none; background:none; font:500 .92rem/1 inherit; color:${T.ink}; }
.jaa-search button { display:grid; place-items:center; color:${T.muted}; background:none; border:none; cursor:pointer; }
.jaa-sort { display:inline-flex; align-items:center; gap:6px; flex-wrap:wrap; }
.jaa-sort > span { font:800 .72rem/1 'Space Grotesk',sans-serif; text-transform:uppercase; letter-spacing:.06em; color:${T.muted}; margin-right:2px; }
.jaa-sort button { cursor:pointer; border:1px solid ${T.border}; background:${T.surface}; color:${T.body};
  padding:7px 12px; border-radius:9px; font:700 .8rem/1 inherit; transition:all .15s; }
.jaa-sort button:hover { border-color:${T.secondary}; color:${T.secondary}; }
.jaa-sort button.on { background:${T.secondary}; border-color:${T.secondary}; color:#fff; }

.jaa-count { text-align:center; font:500 .88rem/1 inherit; color:${T.muted}; margin:20px 0 26px; }
.jaa-count strong { color:${T.primary}; }

.jaa-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; align-items:start; }

/* ── card ── */
.jaa-card { background:${T.surface}; border:1px solid ${T.border}; border-left:4px solid var(--accent);
  border-radius:16px; padding:20px 20px 16px; box-shadow:0 4px 18px -12px rgba(15,23,42,.25); transition:transform .18s, box-shadow .18s; }
.jaa-card:hover { transform:translateY(-3px); box-shadow:0 18px 38px -18px rgba(15,23,42,.3); }
.jaa-card-top { display:flex; align-items:flex-start; gap:14px; }
.jaa-ring { position:relative; display:grid; place-items:center; flex-shrink:0; }
.jaa-ring-lbl { position:absolute; font:800 .74rem/1 'Space Grotesk',sans-serif; letter-spacing:-.3px; }
.jaa-card-head { flex:1; min-width:0; padding-top:4px; }
.jaa-cat { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:50px;
  font:800 .66rem/1 'Space Grotesk',sans-serif; letter-spacing:.04em; text-transform:uppercase; }
.jaa-prio { flex-shrink:0; padding:4px 10px; border:1.5px solid; border-radius:8px;
  font:800 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.06em; }
.jaa-chap { font:800 1.16rem/1.28 'Space Grotesk',sans-serif; color:${T.ink}; letter-spacing:-.4px; margin:14px 0 0; }

.jaa-meta { display:flex; gap:20px; margin:14px 0 0; }
.jaa-metric { display:flex; flex-direction:column; gap:5px; }
.jaa-metric-cap { font:800 .62rem/1 'Space Grotesk',sans-serif; text-transform:uppercase; letter-spacing:.06em; color:${T.muted}; }
.jaa-metric-val { font:800 1.02rem/1 'Space Grotesk',sans-serif; color:${T.ink}; }
.jaa-diff { align-self:flex-start; padding:3px 9px; border-radius:6px; font:800 .72rem/1.3 inherit; }

.jaa-focus { font:400 .92rem/1.55 inherit; color:${T.body}; margin:15px 0 0; }

.jaa-toggle { display:inline-flex; align-items:center; gap:7px; margin-top:15px; cursor:pointer;
  background:none; border:none; padding:0; color:${T.primary}; font:800 .72rem/1 'Space Grotesk',sans-serif; letter-spacing:.06em; text-transform:uppercase; }
.jaa-chev { transition:transform .2s; }
.jaa-chev.open { transform:rotate(180deg); }
.jaa-break { overflow:hidden; }
.jaa-break-inner { margin-top:14px; padding-top:14px; border-top:1px dashed ${T.border}; }
.jaa-chips { display:flex; flex-wrap:wrap; gap:7px; }
.jaa-chip { padding:5px 11px; border-radius:7px; background:${T.surface2}; color:${T.body};
  font:600 .78rem/1.2 inherit; border:1px solid ${T.borderLight}; }
.jaa-break-foot { display:flex; flex-wrap:wrap; gap:8px 16px; margin-top:14px; }
.jaa-foot-item { display:inline-flex; align-items:center; gap:5px; font:600 .78rem/1 inherit; color:${T.body}; }
.jaa-foot-item strong { color:${T.ink}; }
.jaa-rank { margin-left:auto; color:${T.muted}; font-weight:700; }

.jaa-empty { text-align:center; padding:60px 0; }
.jaa-empty p { font:700 1.05rem/1 'Space Grotesk',sans-serif; color:${T.body}; margin-bottom:16px; }
.jaa-empty button { cursor:pointer; border:none; padding:11px 22px; border-radius:10px; background:${T.primary}; color:#fff; font:700 .88rem/1 'Space Grotesk',sans-serif; }

.jaa-back { text-align:center; margin-top:44px; }
.jaa-back a { color:${T.primary}; font:700 .95rem/1 'Space Grotesk',sans-serif; text-decoration:none; }
.jaa-back a:hover { text-decoration:underline; }

/* ── responsive ── */
@media (max-width:1000px) {
  .jaa-hero-grid { grid-template-columns:1fr; gap:20px; }
  .jaa-visual { height:400px; order:2; }
  .jaa-grid { grid-template-columns:repeat(2,1fr); }
}
@media (max-width:760px) {
  .jaa-hero { padding:56px 20px 64px; }
  .jaa-hero-grid { text-align:center; }
  .jaa-badge, .jaa-title, .jaa-sub { margin-left:auto; margin-right:auto; }
  .jaa-stats, .jaa-cta { justify-content:center; }
  .jaa-visual { display:none; }
  .jaa-filters { justify-content:flex-start; }
  .jaa-grid { grid-template-columns:1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .jaa-orbit { animation:none !important; }
}
`;
