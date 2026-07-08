/* JeeAdvancedAnalysis — the JEE Advanced "Chapter Intelligence" console.
   A Class 11/12-style hero over an analysis console: topic-cluster cards
   with weightage / avg-Qs / difficulty / ROI, an analysis lens
   (Weightage · Safest · Frequency · Hardest), an Easy-Marks mode, and
   chapter-level filters (class, priority, difficulty, trend). Below the
   grid: a 200-hour study-time split by subject and the marking scheme.
   Warm neutral theme — no background texture. */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Atom, FlaskConical, Sigma, Search, X, ChevronDown, Sparkles, Zap,
  Target, ArrowRight, TrendingUp, TrendingDown, Minus, Clock, ShieldCheck,
} from "lucide-react";
import Seo from "../components/Seo.jsx";
import { JEE_ADV_CHAPTERS } from "../data/jeeAdvancedChapters.js";
import { JEE_ADV_CLUSTERS } from "../data/jeeAdvancedClusters.js";
import { SUBJECT_SUMMARY, MARKING_SCHEME } from "../data/jeeAdvancedMeta.js";

/* ── warm neutral theme (shared with the rest of the site) ── */
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
  Maths:     { color: "#0891B2", soft: "#DEF3F8", icon: Sigma },
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
const DIFF_RANK = ["Low", "Low-Medium", "Medium", "Medium-High", "High"];
const DIFF_SCORE = { "Low": 1, "Low-Medium": 2, "Medium": 3, "Medium-High": 4, "High": 5 };
const TRENDS = {
  Rising:  { icon: TrendingUp,   fg: T.success },
  Stable:  { icon: Minus,        fg: T.muted },
  Falling: { icon: TrendingDown, fg: T.error },
};

const SUBJECT_FILTERS = ["All", "Physics", "Chemistry", "Maths"];
const CLASS_FILTERS   = ["All", "11", "12"];
const PRIO_FILTERS    = ["All", "Must-Do", "High", "Standard"];
const DIFF_FILTERS    = ["All", "Low", "Low-Medium", "Medium", "Medium-High", "High"];
const TREND_FILTERS   = ["All", "Rising", "Stable", "Falling"];
const LENSES = [
  { key: "weight",    label: "Weightage", hint: "Most marks first" },
  { key: "safest",    label: "Safest",    hint: "Best marks-per-effort" },
  { key: "frequency", label: "Frequency", hint: "Asked most often" },
  { key: "hardest",   label: "Hardest",   hint: "Toughest first" },
];

const range = (s) => { const n = (s.match(/\d+(?:\.\d+)?/g) || ["0"]).map(Number); return [n[0], n.length > 1 ? n[1] : n[0]]; };

/* ── weightage ring ── */
function Ring({ pct, color, label }) {
  const r = 27, C = 2 * Math.PI * r;
  return (
    <div className="jaa-ring">
      <svg width="66" height="66" viewBox="0 0 66 66">
        <circle cx="33" cy="33" r={r} fill="none" stroke={T.borderLight} strokeWidth="6" />
        <motion.circle
          cx="33" cy="33" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          transform="rotate(-90 33 33)" strokeDasharray={C}
          initial={{ strokeDashoffset: C }} whileInView={{ strokeDashoffset: C * (1 - pct) }}
          viewport={{ once: true }} transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      <span className="jaa-ring-lbl">{label}</span>
    </div>
  );
}

/* ── cluster card ── */
function ClusterCard({ c, index, forceOpen }) {
  const [open, setOpen] = useState(false);
  const isOpen = forceOpen || open;
  const sub = SUBJECTS[c.subject];
  const Icon = sub.icon;
  const prio = PRIORITY[c.priority] || PRIORITY.Standard;
  const diff = DIFF_STYLE[c.difficulty] || DIFF_STYLE.Medium;

  return (
    <motion.article
      className="jaa-card" style={{ "--accent": sub.color }}
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.05 }}
    >
      <div className="jaa-card-top">
        <Ring pct={c.ringPct} color={sub.color} label={c.wtLabel} />
        <div className="jaa-card-head">
          <span className="jaa-cat"><Icon size={12} strokeWidth={2.5} color={sub.color} /> {c.subject}</span>
          <h3 className="jaa-chap">{c.name}</h3>
        </div>
        <span className="jaa-prio" style={{ color: prio.fg }}>{prio.label}</span>
      </div>

      <div className="jaa-meta">
        <div className="jaa-metric"><span className="jaa-metric-cap">Avg. Qs</span><span className="jaa-metric-val">{c.qsLabel}</span></div>
        <div className="jaa-metric"><span className="jaa-metric-cap">Difficulty</span><span className="jaa-diff" style={{ color: diff.fg, background: diff.bg }}>{c.difficulty}</span></div>
        <div className="jaa-metric"><span className="jaa-metric-cap">Marks@stake</span><span className="jaa-metric-val">≈{c.marksTotal}</span></div>
        <div className="jaa-metric"><span className="jaa-metric-cap">ROI</span><span className="jaa-metric-val" style={{ color: T.success }}>{c.roi}×</span></div>
      </div>

      <p className="jaa-focus">{c.blurb}</p>

      <button className="jaa-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={isOpen}>
        <ChevronDown size={13} className={isOpen ? "jaa-chev open" : "jaa-chev"} />
        Sub-topic breakdown · {c.chapters.length}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div className="jaa-break"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}>
            <div className="jaa-break-inner">
              {c.chapters.map((ch) => {
                const Tr = (TRENDS[ch.trend] || TRENDS.Stable);
                const TrIcon = Tr.icon;
                const d = DIFF_STYLE[ch.difficulty] || DIFF_STYLE.Medium;
                return (
                  <div key={ch.id} className="jaa-brk-row">
                    <div className="jaa-brk-head">
                      <span className="jaa-brk-name">{ch.chapter}<span className="jaa-brk-cls">Class {ch.cls}</span></span>
                      <span className="jaa-brk-wt">~{Math.round(ch.wtMid)}%</span>
                    </div>
                    <p className="jaa-brk-desc">{ch.focus}</p>
                    <div className="jaa-brk-tags">
                      <span className="jaa-tag" style={{ color: d.fg, background: d.bg }}>{ch.difficulty}</span>
                      <span className="jaa-tag jaa-tag-plain">{ch.avgQs} Qs</span>
                      <span className="jaa-tag jaa-tag-plain" style={{ color: Tr.fg }}><TrIcon size={11} strokeWidth={2.5} /> {ch.trend}</span>
                      <span className="jaa-tag jaa-tag-quad">{ch.quadrant}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/* ── labelled chip group ── */
function ChipGroup({ label, options, value, onChange }) {
  return (
    <div className="jaa-chipgrp">
      <span className="jaa-chipgrp-lbl">{label}</span>
      <div className="jaa-chips-row">
        {options.map((o) => (
          <button key={o} className={value === o ? "jaa-fchip on" : "jaa-fchip"} onClick={() => onChange(o)}>
            {o === "11" || o === "12" ? `Class ${o}` : o}
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
  const [prio, setPrio] = useState("All");
  const [diff, setDiff] = useState("All");
  const [trend, setTrend] = useState("All");
  const [easy, setEasy] = useState(false);
  const [lens, setLens] = useState("weight");
  const [q, setQ] = useState("");

  const byId = useMemo(() => Object.fromEntries(JEE_ADV_CHAPTERS.map((c) => [c.id, c])), []);
  const subjectCounts = useMemo(() => {
    const c = { Physics: 0, Chemistry: 0, Maths: 0 };
    JEE_ADV_CHAPTERS.forEach((x) => { c[x.subject]++; }); return c;
  }, []);
  const mustDo = useMemo(() => JEE_ADV_CHAPTERS.filter((x) => x.priority === "Must-Do").length, []);

  const chapterFiltersOn = cls !== "All" || prio !== "All" || diff !== "All" || trend !== "All" || easy || q.trim() !== "";

  const chapterMatch = (ch, clusterNameHit) => {
    if (cls !== "All" && ch.cls !== cls) return false;
    if (prio !== "All" && ch.priority !== prio) return false;
    if (diff !== "All" && ch.difficulty !== diff) return false;
    if (trend !== "All" && ch.trend !== trend) return false;
    if (easy && !(ch.wtMid >= 3 && DIFF_SCORE[ch.difficulty] <= 3)) return false;
    const needle = q.trim().toLowerCase();
    if (needle && !clusterNameHit && !(`${ch.chapter} ${ch.focus}`.toLowerCase().includes(needle))) return false;
    return true;
  };

  const clusters = useMemo(() => {
    const enriched = JEE_ADV_CLUSTERS.map((cl) => {
      const needle = q.trim().toLowerCase();
      const nameHit = needle ? (`${cl.name} ${cl.blurb}`.toLowerCase().includes(needle)) : false;
      const all = cl.members.map((id) => byId[id]).filter(Boolean);
      const chapters = all.filter((ch) => chapterMatch(ch, nameHit)).sort((a, b) => b.wtMid - a.wtMid);
      let wLo = 0, wHi = 0, qLo = 0, qHi = 0, marks = 0, diffMax = 0, diffSum = 0, prioAgg = "Standard";
      chapters.forEach((ch) => {
        const [a, b] = range(ch.weightage); wLo += a; wHi += b;
        const [x, y] = range(ch.avgQs); qLo += x; qHi += y;
        marks += Number((ch.marks.match(/\d+/) || [0])[0]);
        diffMax = Math.max(diffMax, DIFF_RANK.indexOf(ch.difficulty));
        diffSum += DIFF_SCORE[ch.difficulty] || 3;
        if (ch.priority === "Must-Do") prioAgg = "Must-Do";
        else if (ch.priority === "High" && prioAgg !== "Must-Do") prioAgg = "High";
      });
      const n = chapters.length || 1;
      return {
        ...cl, chapters, count: chapters.length, nameHit,
        wLo: Math.round(wLo), wHi: Math.round(wHi), wtLabel: `${Math.round(wLo)}–${Math.round(wHi)}%`,
        qsLabel: qLo === qHi ? `${qLo}` : `${qLo}–${qHi}`, qHi, marksTotal: marks,
        difficulty: DIFF_RANK[diffMax] || "Medium", diffMax,
        roi: Math.round((wHi / (diffSum / n)) * 10) / 10, priority: prioAgg,
      };
    });
    const maxHi = Math.max(...enriched.map((c) => c.wHi), 1);
    enriched.forEach((c) => { c.ringPct = Math.min(c.wHi / maxHi, 1); });
    return enriched;
  }, [byId, cls, prio, diff, trend, easy, q]);

  const filtered = useMemo(() => {
    let rows = clusters.filter((cl) => {
      if (subject !== "All" && cl.subject !== subject) return false;
      if (cl.count === 0) return false;
      return true;
    });
    if (lens === "safest") rows = [...rows].sort((a, b) => b.roi - a.roi);
    else if (lens === "frequency") rows = [...rows].sort((a, b) => b.qHi - a.qHi);
    else if (lens === "hardest") rows = [...rows].sort((a, b) => b.diffMax - a.diffMax || b.wHi - a.wHi);
    else rows = [...rows].sort((a, b) => b.wHi - a.wHi);
    return rows;
  }, [clusters, subject, lens]);

  const shownChapters = filtered.reduce((a, c) => a + c.count, 0);
  const reset = () => { setSubject("All"); setCls("All"); setPrio("All"); setDiff("All"); setTrend("All"); setEasy(false); setQ(""); };
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="jaa">
      <Seo
        title="JEE Advanced Chapter-wise Analysis 2026 — Weightage, Priority & Marks"
        description="All 80 NCERT chapters for JEE Advanced grouped into topic clusters and ranked by weightage, marks at stake, difficulty, ROI and priority. Analysis lenses, an easy-marks mode, a 200-hour study budget and the marking scheme on College Parichay."
        path="/jee-advanced-analysis"
      />

      {/* ── HERO ── */}
      <section className="jaa-hero">
        <div className="jaa-hero-grid">
          <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
            <motion.span className="jaa-badge" variants={fade}>
              <motion.span className="jaa-badge-dot" animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
              JEE ADVANCED · PAPER ANALYSIS 2021–2025
            </motion.span>
            <motion.h1 className="jaa-title" variants={fade}>Every chapter,<br />ranked by <span className="jaa-hl">what it's worth.</span></motion.h1>
            <motion.p className="jaa-sub" variants={fade}>
              All 80 NCERT chapters, grouped into topic clusters and tagged with weightage, marks at stake,
              difficulty, ROI and priority — so you always know exactly what to open next.
            </motion.p>
            <motion.div className="jaa-stats" variants={fade}>
              <div className="jaa-stat"><span className="jaa-stat-num">80</span><span className="jaa-stat-cap">Chapters mapped</span></div>
              <div className="jaa-stat"><span className="jaa-stat-num">{JEE_ADV_CLUSTERS.length}</span><span className="jaa-stat-cap">Topic clusters</span></div>
              <div className="jaa-stat"><span className="jaa-stat-num">{mustDo}</span><span className="jaa-stat-cap">Must-do chapters</span></div>
            </motion.div>
            <motion.div className="jaa-cta" variants={fade}>
              <button className="jaa-btn-primary" onClick={() => scrollTo("chapters")}><Sparkles size={17} /> Open the console</button>
              <button className="jaa-btn-ghost" onClick={() => scrollTo("budget")}>See the study budget <ArrowRight size={16} /></button>
            </motion.div>
          </motion.div>
          <HeroVisual subjectCounts={subjectCounts} mustDo={mustDo} />
        </div>
      </section>

      {/* ── CONSOLE + GRID ── */}
      <section id="chapters" className="jaa-dir">
        <div className="jaa-console">
          <div className="jaa-console-head">
            <span className="jaa-kicker"><Target size={13} /> Analysis console</span>
            <h2 className="jaa-h2">Filter down to your next 10 hours</h2>
          </div>

          <div className="jaa-console-body">
            <ChipGroup label="Subject" options={SUBJECT_FILTERS} value={subject} onChange={setSubject} />

            <div className="jaa-lensrow">
              <span className="jaa-chipgrp-lbl">Analysis lens</span>
              <div className="jaa-lens">
                {LENSES.map((l) => (
                  <button key={l.key} className={lens === l.key ? "jaa-lens-btn on" : "jaa-lens-btn"} onClick={() => setLens(l.key)}>
                    <span className="jaa-lens-t">{l.label}</span>
                    <span className="jaa-lens-h">{l.hint}</span>
                  </button>
                ))}
                <button className={easy ? "jaa-easy on" : "jaa-easy"} onClick={() => setEasy((e) => !e)}>
                  <Zap size={15} strokeWidth={2.5} /> Easy Marks Mode
                </button>
              </div>
            </div>

            <div className="jaa-filterwrap">
              <ChipGroup label="Class" options={CLASS_FILTERS} value={cls} onChange={setCls} />
              <ChipGroup label="Priority" options={PRIO_FILTERS} value={prio} onChange={setPrio} />
              <ChipGroup label="Difficulty" options={DIFF_FILTERS} value={diff} onChange={setDiff} />
              <ChipGroup label="Trend" options={TREND_FILTERS} value={trend} onChange={setTrend} />
            </div>

            <div className="jaa-searchrow">
              <div className="jaa-search">
                <Search size={16} color={T.muted} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a topic or chapter…" />
                {q && <button onClick={() => setQ("")} aria-label="Clear"><X size={15} /></button>}
              </div>
              <p className="jaa-count"><strong>{filtered.length}</strong> clusters · <strong>{shownChapters}</strong> chapters shown</p>
              {chapterFiltersOn && <button className="jaa-reset" onClick={reset}>Clear all</button>}
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="jaa-grid">
            {filtered.map((c, i) => <ClusterCard key={c.id} c={c} index={i} forceOpen={chapterFiltersOn} />)}
          </div>
        ) : (
          <div className="jaa-empty"><p>No chapters match those filters.</p><button onClick={reset}>Reset filters</button></div>
        )}
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

/* ── hero ── */
.jaa-hero { padding:100px 0 120px; border-bottom:1px solid ${T.border}; }
.jaa-hero-grid { max-width:1250px; margin:0 auto; padding:0 24px; display:grid; grid-template-columns:1.15fr .85fr; gap:80px; align-items:center; }
.jaa-badge { display:inline-flex; align-items:center; gap:10px; padding:8px 20px; border-radius:50px; background:${T.amberSoft}; color:${T.amberDk}; border:1px solid #FDE68A; font:800 .76rem/1 'Space Grotesk',sans-serif; letter-spacing:.11em; text-transform:uppercase; }
.jaa-badge-dot { width:8px; height:8px; border-radius:50%; background:${T.amber}; display:inline-block; }
.jaa-title { font:800 clamp(2.6rem,4.4vw,3.9rem)/1.12 'Space Grotesk','Sora',sans-serif; letter-spacing:-.5px; color:${T.ink}; margin:28px 0 0; }
.jaa-hl { color:${T.amber}; }
.jaa-sub { font:400 1.14rem/1.7 inherit; color:${T.body}; max-width:540px; margin:24px 0 0; }
.jaa-stats { display:flex; flex-wrap:wrap; gap:48px; margin:40px 0 0; }
.jaa-stat { display:flex; flex-direction:column; gap:8px; }
.jaa-stat-num { font:800 2.3rem/1 'Space Grotesk',sans-serif; color:${T.ink}; letter-spacing:-1px; }
.jaa-stat:first-child .jaa-stat-num { color:${T.amber}; }
.jaa-stat-cap { font:700 .82rem/1.1 inherit; text-transform:uppercase; letter-spacing:.05em; color:${T.muted}; }
.jaa-cta { display:flex; flex-wrap:wrap; gap:20px; align-items:center; margin:44px 0 0; }
.jaa-btn-primary { display:inline-flex; align-items:center; gap:9px; cursor:pointer; border:none; padding:18px 32px; border-radius:14px; font:700 1.05rem/1 'Space Grotesk',sans-serif; color:#fff; background:${T.amber}; box-shadow:0 10px 30px rgba(245,158,11,.3); transition:transform .18s, box-shadow .18s, background .18s; }
.jaa-btn-primary:hover { background:#e08e08; transform:translateY(-3px); box-shadow:0 16px 34px rgba(245,158,11,.42); }
.jaa-btn-ghost { display:inline-flex; align-items:center; gap:8px; cursor:pointer; background:transparent; border:none; color:${T.amber}; font:700 1rem/1 'Space Grotesk',sans-serif; padding:8px 6px; transition:gap .18s, color .18s; }
.jaa-btn-ghost:hover { color:#d97706; gap:12px; }

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
.jaa-dir { max-width:1250px; margin:0 auto; padding:70px 24px 40px; }
.jaa-dir-head { text-align:center; max-width:680px; margin:0 auto 34px; }
.jaa-kicker { display:inline-flex; align-items:center; gap:7px; padding:6px 14px; border-radius:50px; background:${T.amberSoft}; color:${T.amberDk}; font:800 .72rem/1 'Space Grotesk',sans-serif; letter-spacing:.06em; text-transform:uppercase; }
.jaa-h2 { font:800 clamp(1.7rem,3.4vw,2.4rem)/1.15 'Space Grotesk',sans-serif; letter-spacing:-.8px; color:${T.ink}; margin:16px 0 0; }
.jaa-dir-sub { font:400 1.02rem/1.6 inherit; color:${T.body}; margin:12px 0 0; }

.jaa-console { background:${T.surface}; border:1px solid ${T.border}; border-radius:22px; padding:26px 26px 22px; box-shadow:0 18px 48px -30px rgba(26,26,46,.4); }
.jaa-console-head { text-align:center; margin-bottom:20px; }
.jaa-console-head .jaa-h2 { font-size:clamp(1.4rem,2.6vw,1.8rem); margin-top:12px; }
.jaa-console-body { display:flex; flex-direction:column; gap:18px; }

.jaa-chipgrp { display:flex; flex-direction:column; gap:9px; }
.jaa-chipgrp-lbl { font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.08em; text-transform:uppercase; color:${T.muted}; }
.jaa-chips-row { display:flex; flex-wrap:wrap; gap:7px; }
.jaa-fchip { cursor:pointer; border:1px solid ${T.border}; background:${T.surface2}; color:${T.body}; padding:8px 15px; border-radius:50px; font:700 .84rem/1 inherit; transition:all .15s; }
.jaa-fchip:hover { border-color:${T.amber}; color:${T.amberDk}; }
.jaa-fchip.on { background:${T.amber}; border-color:${T.amber}; color:#fff; }

.jaa-lensrow { display:flex; flex-direction:column; gap:9px; }
.jaa-lens { display:flex; flex-wrap:wrap; gap:10px; }
.jaa-lens-btn { display:flex; flex-direction:column; gap:3px; align-items:flex-start; cursor:pointer; text-align:left; min-width:140px; flex:1 1 140px;
  border:1.5px solid ${T.border}; background:${T.surface}; border-radius:14px; padding:12px 16px; transition:all .16s; }
.jaa-lens-btn:hover { border-color:${T.amber}; transform:translateY(-2px); }
.jaa-lens-btn.on { border-color:${T.amber}; background:${T.amberSoft}; box-shadow:0 8px 20px -12px ${T.amber}; }
.jaa-lens-t { font:800 .96rem/1 'Space Grotesk',sans-serif; color:${T.ink}; }
.jaa-lens-btn.on .jaa-lens-t { color:${T.amberDk}; }
.jaa-lens-h { font:600 .74rem/1 inherit; color:${T.muted}; }
.jaa-easy { display:inline-flex; align-items:center; gap:8px; cursor:pointer; flex:1 1 160px; justify-content:center;
  border:1.5px dashed ${T.amber}; background:${T.surface}; color:${T.amberDk}; border-radius:14px; padding:12px 16px; font:800 .9rem/1 'Space Grotesk',sans-serif; transition:all .16s; }
.jaa-easy:hover { background:${T.amberSoft}; }
.jaa-easy.on { background:${T.amber}; border-style:solid; color:#fff; box-shadow:0 8px 20px -10px ${T.amber}; }

.jaa-filterwrap { display:flex; flex-wrap:wrap; gap:16px 26px; padding:18px; background:${T.surface2}; border:1px solid ${T.borderLight}; border-radius:14px; }
.jaa-searchrow { display:flex; flex-wrap:wrap; align-items:center; gap:14px; }
.jaa-search { display:flex; align-items:center; gap:9px; flex:1 1 260px; max-width:420px; background:${T.surface}; border:1px solid ${T.border}; border-radius:11px; padding:11px 15px; }
.jaa-search:focus-within { border-color:${T.amber}; box-shadow:0 0 0 3px ${T.amberSoft}; }
.jaa-search input { flex:1; border:none; outline:none; background:none; font:500 .92rem/1 inherit; color:${T.ink}; }
.jaa-search button { display:grid; place-items:center; color:${T.muted}; background:none; border:none; cursor:pointer; }
.jaa-count { font:500 .88rem/1 inherit; color:${T.muted}; margin:0; }
.jaa-count strong { color:${T.amberDk}; }
.jaa-reset { cursor:pointer; border:1px solid ${T.border}; background:${T.surface}; color:${T.body}; padding:9px 15px; border-radius:50px; font:700 .8rem/1 'Space Grotesk',sans-serif; }
.jaa-reset:hover { border-color:${T.error}; color:${T.error}; }

.jaa-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; align-items:start; margin-top:30px; }

/* ── cluster card ── */
.jaa-card { background:${T.surface}; border:1px solid ${T.border}; border-left:4px solid var(--accent); border-radius:16px; padding:20px; transition:transform .18s, box-shadow .18s; }
.jaa-card:hover { transform:translateY(-3px); box-shadow:0 18px 38px -20px rgba(26,26,46,.3); }
.jaa-card-top { display:flex; align-items:flex-start; gap:14px; }
.jaa-ring { position:relative; display:grid; place-items:center; flex-shrink:0; }
.jaa-ring-lbl { position:absolute; font:800 .72rem/1 'Space Grotesk',sans-serif; letter-spacing:-.3px; color:${T.ink}; }
.jaa-card-head { flex:1; min-width:0; }
.jaa-cat { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:50px; background:${T.surface2}; border:1px solid ${T.borderLight}; color:${T.body}; font:800 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.06em; text-transform:uppercase; }
.jaa-chap { font:800 1.24rem/1.24 'Space Grotesk',sans-serif; color:${T.ink}; letter-spacing:-.4px; margin:9px 0 0; }
.jaa-prio { flex-shrink:0; padding:4px 10px; border:1.4px dashed currentColor; border-radius:8px; font:800 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.06em; }
.jaa-meta { display:flex; flex-wrap:wrap; gap:16px 20px; margin:16px 0 0; }
.jaa-metric { display:flex; flex-direction:column; gap:5px; }
.jaa-metric-cap { font:800 .62rem/1 'Space Grotesk',sans-serif; text-transform:uppercase; letter-spacing:.06em; color:${T.muted}; }
.jaa-metric-val { font:800 1.02rem/1 'Space Grotesk',sans-serif; color:${T.ink}; }
.jaa-diff { align-self:flex-start; padding:3px 9px; border-radius:6px; font:800 .72rem/1.3 inherit; }
.jaa-focus { font:400 .92rem/1.55 inherit; color:${T.body}; margin:16px 0 0; }
.jaa-toggle { display:inline-flex; align-items:center; gap:7px; margin-top:16px; cursor:pointer; padding:6px 12px; border:1.3px solid ${T.ink}; border-radius:8px; background:transparent; color:${T.ink}; font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.06em; text-transform:uppercase; }
.jaa-chev { transition:transform .2s; } .jaa-chev.open { transform:rotate(180deg); }
.jaa-break { overflow:hidden; }
.jaa-break-inner { margin-top:6px; border-top:1px dashed ${T.border}; }
.jaa-brk-row { padding:13px 0; border-bottom:1px solid ${T.borderLight}; }
.jaa-brk-row:last-child { border-bottom:none; padding-bottom:2px; }
.jaa-brk-head { display:flex; align-items:baseline; justify-content:space-between; gap:12px; }
.jaa-brk-name { font:700 .92rem/1.3 'Space Grotesk',sans-serif; color:${T.ink}; }
.jaa-brk-cls { font:700 .66rem/1 'Space Grotesk',sans-serif; color:${T.muted}; margin-left:8px; text-transform:uppercase; letter-spacing:.04em; }
.jaa-brk-wt { font:800 .82rem/1 'Space Grotesk',sans-serif; color:${T.amberDk}; white-space:nowrap; }
.jaa-brk-desc { font:400 .84rem/1.5 inherit; color:${T.body}; margin:5px 0 0; }
.jaa-brk-tags { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
.jaa-tag { display:inline-flex; align-items:center; gap:4px; padding:3px 8px; border-radius:6px; font:700 .68rem/1.2 'Space Grotesk',sans-serif; }
.jaa-tag-plain { background:${T.surface2}; color:${T.body}; border:1px solid ${T.borderLight}; }
.jaa-tag-quad { background:transparent; color:${T.muted}; border:1px dashed ${T.border}; }

.jaa-empty { text-align:center; padding:60px 0; }
.jaa-empty p { font:700 1.05rem/1 'Space Grotesk',sans-serif; color:${T.body}; margin-bottom:16px; }
.jaa-empty button { cursor:pointer; border:none; padding:11px 22px; border-radius:10px; background:${T.amber}; color:#fff; font:700 .88rem/1 'Space Grotesk',sans-serif; }

/* ── subject summary / budget ── */
.jaa-summary { max-width:1250px; margin:0 auto; padding:40px 24px 20px; }
.jaa-sum-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
.jaa-sum-card { background:${T.surface}; border:1px solid ${T.border}; border-top:4px solid var(--accent); border-radius:16px; padding:20px; }
.jaa-sum-top { display:flex; align-items:center; gap:12px; }
.jaa-sum-ic { width:44px; height:44px; border-radius:12px; display:grid; place-items:center; flex-shrink:0; }
.jaa-sum-name { font:800 1.15rem/1 'Space Grotesk',sans-serif; color:${T.ink}; }
.jaa-sum-sub { font:600 .78rem/1.3 inherit; color:${T.muted}; margin-top:4px; }
.jaa-sum-hrs { margin-left:auto; font:800 1.6rem/1 'Space Grotesk',sans-serif; color:${T.ink}; }
.jaa-sum-hrs span { font-size:.7rem; color:${T.muted}; margin-left:3px; }
.jaa-sum-bar { display:flex; height:9px; border-radius:50px; overflow:hidden; margin:18px 0 14px; background:${T.surface2}; }
.jaa-sum-bar span { height:100%; }
.jaa-sum-row { display:flex; align-items:center; gap:9px; padding:6px 0; font:600 .82rem/1 inherit; }
.jaa-sum-dot { width:9px; height:9px; border-radius:3px; flex-shrink:0; }
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
  .jaa-hero { padding:64px 0 72px; }
  .jaa-hero-grid { grid-template-columns:1fr; gap:24px; }
  .jaa-visual { height:400px; order:2; }
  .jaa-grid, .jaa-sum-grid { grid-template-columns:repeat(2,1fr); }
  .jaa-mark-grid { grid-template-columns:repeat(2,1fr); }
}
@media (max-width:760px) {
  .jaa-hero { padding:48px 0 56px; }
  .jaa-hero-grid { text-align:center; }
  .jaa-badge, .jaa-title, .jaa-sub { margin-left:auto; margin-right:auto; }
  .jaa-cta { justify-content:center; }
  .jaa-visual { display:none; }
  /* mobile stats become a tidy 3-column card with dividers */
  .jaa-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:0; margin-top:32px; width:100%;
    background:${T.surface}; border:1px solid ${T.border}; border-radius:16px; padding:16px 6px; box-shadow:0 6px 22px -16px rgba(26,26,46,.3); }
  .jaa-stat { align-items:center; text-align:center; gap:6px; }
  .jaa-stat + .jaa-stat { border-left:1px solid ${T.borderLight}; }
  .jaa-stat-num { font-size:1.7rem; }
  .jaa-stat-cap { font-size:.62rem; }
  .jaa-console { padding:20px 16px; border-radius:18px; }
  .jaa-lens-btn { flex-basis:calc(50% - 5px); min-width:0; }
  .jaa-grid, .jaa-sum-grid, .jaa-mark-grid { grid-template-columns:1fr; }
}
@media (prefers-reduced-motion: reduce) { .jaa-orbit { animation:none !important; } }
`;
