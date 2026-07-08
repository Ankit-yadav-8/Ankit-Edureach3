/* OtherExams — a single directory of every engineering entrance beyond JEE.
   Structure:
     1. Hero        — our own coral/cream intro + an animated exam-badge wall
     2. Timeline    — the home AdmissionTimeline, reused verbatim
     3. Directory   — Total / Ongoing / Upcoming / Concluded + category + search
                      filters over one rich card per exam (ExamCard).
   The hero copy and its badge-wall animation are original to College Parichay. */
import { useMemo, useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Compass, Sparkles, X, Check, SlidersHorizontal, Layers, GitCompare } from "lucide-react";
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

const TRACK_FILTERS = [
  { key: "all", label: "All tracks" },
  ...CATEGORIES.map((c) => ({ key: c.key, label: c.label })),
];

/* Compact dropdown used for the two condensed filter buttons (Status · Track).
   Closes on select or on an outside click (via a transparent backdrop). */
function FilterDropdown({ icon: Icon, label, value, options, counts, onSelect }) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.key === value) || options[0];
  return (
    <div className="oe-dd">
      <button className={`oe-dd-btn ${open ? "open" : ""}`} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Icon size={15} className="oe-dd-lead" />
        <span className="oe-dd-label">{label}</span>
        <span className="oe-dd-value">{current.label}</span>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="oe-dd-backdrop" onClick={() => setOpen(false)} />
            <motion.div
              className="oe-dd-menu"
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
            >
              {options.map((o) => (
                <button
                  key={o.key}
                  className={`oe-dd-item ${o.key === value ? "on" : ""}`}
                  onClick={() => { onSelect(o.key); setOpen(false); }}
                >
                  <span>{o.label}</span>
                  <span className="oe-dd-item-right">
                    <span className="oe-dd-count">{counts[o.key]}</span>
                    {o.key === value && <Check size={14} />}
                  </span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Hero "route map" — a transit-style diagram: three track lines (National ·
   State · Private) branch off a shared JEE interchange to a handful of exam
   "stations". Original composition + our own palette; label placement differs
   per line so text never sits on the rails. */
const HUB = { x: 80, y: 280 };
const MAP_LINES = [
  {
    key: "national", label: "National", color: CL.coral, lbl: { anchor: "middle", dx: 0, dy: -13 },
    pts: [[80, 280], [180, 280], [250, 210], [335, 178], [425, 152], [515, 134], [600, 120]],
    stations: [
      { x: 250, y: 210, name: "BITSAT" }, { x: 335, y: 178, name: "CUET UG" }, { x: 425, y: 152, name: "AMUEEE" },
      { x: 515, y: 134, name: "KIITEE" }, { x: 600, y: 120, name: "CIPET JEE" },
    ],
  },
  {
    key: "state", label: "State", color: CL.violet, lbl: { anchor: "middle", dx: 0, dy: -12 },
    pts: [[80, 280], [180, 280], [275, 292], [365, 300], [455, 308], [545, 314], [625, 318]],
    stations: [
      { x: 275, y: 292, name: "MHT CET" }, { x: 365, y: 300, name: "KCET" }, { x: 455, y: 308, name: "KEAM" },
      { x: 545, y: 314, name: "WBJEE" }, { x: 625, y: 318, name: "OJEE" },
    ],
  },
  {
    key: "private", label: "Private", color: CL.green, lbl: { anchor: "middle", dx: 0, dy: 22 },
    pts: [[80, 280], [180, 280], [265, 360], [350, 412], [440, 452], [530, 482], [615, 502]],
    stations: [
      { x: 265, y: 360, name: "VITEEE" }, { x: 350, y: 412, name: "SRMJEEE" }, { x: 440, y: 452, name: "MET" },
      { x: 530, y: 482, name: "LPU NEST" }, { x: 615, y: 502, name: "JET" },
    ],
  },
];
const pathD = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");

function RouteMap() {
  return (
    <div className="oe-map" aria-hidden="true">
      <svg viewBox="0 0 700 560" className="oe-map-svg">
        {/* rails draw in on view */}
        {MAP_LINES.map((ln, i) => (
          <motion.path
            key={ln.key}
            d={pathD(ln.pts)} fill="none" stroke={ln.color} strokeWidth="4"
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0.35 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, delay: 0.15 + i * 0.16, ease: [0.4, 0, 0.2, 1] }}
          />
        ))}
        {/* stations pop in after the rails, staggered along each line */}
        {MAP_LINES.map((ln, li) => ln.stations.map((s, si) => (
          <motion.g
            key={`${ln.key}-${si}`}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55 + li * 0.14 + si * 0.11, duration: 0.35, ease: "easeOut" }}
          >
            <circle cx={s.x} cy={s.y} r="6.5" fill="#fff" stroke={ln.color} strokeWidth="3" />
            <text x={s.x + ln.lbl.dx} y={s.y + ln.lbl.dy} className="oe-map-lbl" textAnchor={ln.lbl.anchor} fill={CL.ink2}>{s.name}</text>
          </motion.g>
        )))}
        {/* JEE interchange (you-are-here) */}
        <circle cx={HUB.x} cy={HUB.y} r="15" fill="none" stroke={CL.coral} strokeWidth="2" opacity="0.3" />
        <circle cx={HUB.x} cy={HUB.y} r="9.5" fill={CL.coral} />
        <circle cx={HUB.x} cy={HUB.y} r="3.6" fill="#fff" />
        <text x={HUB.x} y={HUB.y - 24} className="oe-map-hub" textAnchor="middle" fill={CL.ink}>JEE · start here</text>
      </svg>
      <div className="oe-map-legend">
        {MAP_LINES.map((ln) => (
          <span key={ln.key} className="oe-map-leg">
            <span className="oe-map-swatch" style={{ background: ln.color }} /> {ln.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function OtherExams() {
  const [status, setStatus] = useState("all");
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [openSlug, setOpenSlug] = useState(null);
  const location = useLocation();

  const counts = useMemo(() => {
    const c = { all: ALL_EXAMS.length, current: 0, upcoming: 0, past: 0, national: 0, state: 0, private: 0 };
    ALL_EXAMS.forEach((e) => { c[e.status] = (c[e.status] || 0) + 1; c[e.category] = (c[e.category] || 0) + 1; });
    return c;
  }, []);

  /* Deep-link: /other-exams#exam-<slug> (e.g. from the footer). Reset filters
     so the target is visible, open its card and scroll it into view. */
  useEffect(() => {
    const slug = location.hash.replace(/^#(exam-)?/, "");
    if (!slug) return;
    const match = ALL_EXAMS.find((e) => e.slug === slug);
    if (!match) return;
    setStatus("all"); setCat("all"); setQ("");
    setOpenSlug(slug);
    const t = setTimeout(() => {
      document.getElementById(`exam-${slug}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 160);
    return () => clearTimeout(t);
  }, [location.hash]);

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

      {/* ── 1. HERO (route-map concept, flat home-style background) ── */}
      <section className="oe-hero">
        <div className="container oe-hero-grid">
          <div className="oe-hero-copy">
            <div className="oe-hero-top">
              <BackButton />
              <span className="oe-eyebrow"><span className="oe-eyebrow-sq" /> The entrance map · 2026 intake</span>
            </div>
            <h1 className="oe-hero-title">
              Every way in, on <span className="oe-circle">one map</span>.
            </h1>
            <p className="oe-hero-sub">
              <strong>{counts.all} engineering entrances</strong> across three tracks — national,
              state and private. Trace fees, dates and patterns before you commit to a single line.
            </p>

            <div className="oe-hero-cta">
              <a href="#directory" className="oe-btn-primary">
                <Sparkles size={16} /> Explore all {counts.all} exams
              </a>
              <Link to="/compare-exams" className="oe-btn-ghost"><GitCompare size={16} /> Compare exams</Link>
              <a href="#admission-timeline" className="oe-btn-ghost">See the calendar</a>
            </div>

            <div className="oe-statcard">
              <div className="oe-stat">
                <span className="oe-stat-cap">Exams mapped</span>
                <span className="oe-stat-num">{counts.all}+</span>
              </div>
              <span className="oe-stat-div" />
              <div className="oe-stat">
                <span className="oe-stat-cap">Tracks</span>
                <span className="oe-stat-num">{CATEGORIES.length}</span>
                <span className="oe-stat-foot">National · State · Private</span>
              </div>
              <span className="oe-stat-div" />
              <div className="oe-stat">
                <span className="oe-stat-cap">Calendar</span>
                <span className="oe-stat-num">6<span className="oe-stat-unit"> qtrs</span></span>
              </div>
            </div>
          </div>

          <RouteMap />
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

          {/* filter bar — two condensed dropdown buttons + search */}
          <div className="oe-filters">
            <FilterDropdown
              icon={SlidersHorizontal}
              label="Status"
              value={status}
              options={STATUS_FILTERS}
              counts={counts}
              onSelect={setStatus}
            />
            <FilterDropdown
              icon={Layers}
              label="Track"
              value={cat}
              options={TRACK_FILTERS}
              counts={counts}
              onSelect={setCat}
            />
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
                <ExamCard key={exam.code} exam={exam} index={i} defaultOpen={exam.slug === openSlug} />
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
/* ── hero (flat background — matches the home page, no glow) ── */
.oe-hero { background:#fff; padding:30px 0 52px; }
.oe-hero-grid { display:grid; grid-template-columns:1.02fr .98fr; gap:44px; align-items:center; }
.oe-hero-top { display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:18px; }
.oe-eyebrow { display:inline-flex; align-items:center; gap:9px; font:700 .68rem/1 ui-monospace,'Space Grotesk',monospace; letter-spacing:.16em; text-transform:uppercase; color:${CL.coralDk}; background:${CL.coralSoft}; border:1px solid ${CL.coral}33; padding:7px 13px; border-radius:8px; }
.oe-eyebrow-sq { width:8px; height:8px; border-radius:2px; background:${CL.coral}; }
.oe-hero-title { font:800 clamp(2.2rem,5.2vw,3.5rem)/1.06 ${CL.display}; color:${CL.ink}; letter-spacing:-1.6px; margin:18px 0 0; }
.oe-circle { position:relative; color:${CL.coral}; white-space:nowrap; }
.oe-circle::after { content:""; position:absolute; left:-9px; right:-9px; top:-5px; bottom:-3px; border:2.5px solid ${CL.coral}; border-radius:47% 53% 50% 50%/62% 55% 45% 38%; transform:rotate(-2.5deg); pointer-events:none; }
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
  display:inline-flex; align-items:center; gap:8px; text-decoration:none;
  padding:13px 22px; border-radius:50px; font:800 .95rem/1 ${CL.display}; color:${CL.ink};
  background:#fff; border:1px solid ${CL.cream3}; transition:border-color .2s, transform .2s;
}
.oe-btn-ghost:hover { border-color:${CL.coral}66; transform:translateY(-2px); }

.oe-statcard { display:inline-flex; align-items:stretch; gap:22px; margin-top:30px; padding:16px 24px; border:1px solid ${CL.cream3}; border-radius:16px; background:#fff; box-shadow:${CL.shadow}; }
.oe-stat { display:flex; flex-direction:column; gap:5px; justify-content:center; }
.oe-stat-cap { font:800 .62rem/1.1 ${CL.display}; letter-spacing:.1em; text-transform:uppercase; color:${CL.muted}; }
.oe-stat-num { font:800 1.95rem/1 ${CL.display}; color:${CL.ink}; letter-spacing:-1px; }
.oe-stat-num .oe-stat-unit { font-size:.9rem; color:${CL.muted}; font-weight:700; letter-spacing:0; }
.oe-stat-foot { font:600 .62rem/1.2 sans-serif; color:${CL.muted}; }
.oe-stat-div { width:1px; background:${CL.cream3}; }

/* ── hero route map ── */
.oe-map { display:flex; flex-direction:column; align-items:center; gap:14px; }
.oe-map-svg { width:100%; max-width:600px; height:auto; overflow:visible; }
.oe-map-lbl { font:700 11px/1 ui-monospace,'Space Grotesk',monospace; letter-spacing:.5px; }
.oe-map-hub { font:800 12px/1 ${CL.display}; letter-spacing:.2px; }
.oe-map-legend { display:flex; flex-wrap:wrap; gap:8px 20px; justify-content:center; }
.oe-map-leg { display:inline-flex; align-items:center; gap:8px; font:700 .78rem/1 ${CL.display}; color:${CL.ink2}; }
.oe-map-swatch { width:18px; height:5px; border-radius:3px; }

/* ── directory ── */
.oe-directory { background:#fff; padding:70px 0 90px; }
.oe-dir-title { font:800 clamp(1.7rem,4vw,2.5rem)/1.15 ${CL.display}; color:${CL.ink}; letter-spacing:-1px; margin:14px 0 0; }
.oe-dir-sub { font:500 1.05rem/1.6 sans-serif; color:${CL.body}; margin:12px 0 0; }

.oe-filters { display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:center; margin-bottom:10px; }

/* ── condensed filter dropdowns ── */
.oe-dd { position:relative; }
.oe-dd-btn {
  display:inline-flex; align-items:center; gap:9px; cursor:pointer;
  padding:11px 15px; border-radius:14px; background:#fff; border:1px solid ${CL.cream3};
  font:600 .86rem/1 sans-serif; color:${CL.ink2}; box-shadow:0 4px 14px rgba(33,29,46,.05);
  transition:border-color .18s, box-shadow .18s;
}
.oe-dd-btn:hover { border-color:${CL.coral}66; }
.oe-dd-btn.open { border-color:${CL.coral}; box-shadow:0 0 0 3px ${CL.coralSoft}; }
.oe-dd-lead { color:${CL.coral}; }
.oe-dd-label { font:800 .66rem/1 ${CL.display}; letter-spacing:.09em; text-transform:uppercase; color:${CL.muted}; }
.oe-dd-value { font:800 .86rem/1 ${CL.display}; color:${CL.ink}; }
.oe-dd-backdrop { position:fixed; inset:0; z-index:40; }
.oe-dd-menu {
  position:absolute; top:calc(100% + 8px); left:0; z-index:50; min-width:220px;
  background:#fff; border:1px solid ${CL.cream3}; border-radius:14px; padding:6px;
  box-shadow:0 22px 48px -18px rgba(33,29,46,.34);
}
.oe-dd-item {
  display:flex; align-items:center; justify-content:space-between; gap:14px; width:100%; cursor:pointer;
  padding:10px 12px; border-radius:10px; background:transparent; border:none; text-align:left;
  font:600 .88rem/1.2 sans-serif; color:${CL.ink2}; transition:background .15s;
}
.oe-dd-item:hover { background:${CL.cream2}; }
.oe-dd-item.on { background:${CL.coralSoft}; color:${CL.coralDk}; font-weight:800; }
.oe-dd-item-right { display:inline-flex; align-items:center; gap:8px; color:${CL.coral}; }
.oe-dd-count { font-size:.72rem; font-weight:700; padding:2px 8px; border-radius:50px; background:rgba(33,29,46,.06); color:${CL.muted}; }
.oe-dd-item.on .oe-dd-count { background:rgba(255,105,61,.16); color:${CL.coralDk}; }

.oe-search { display:flex; align-items:center; gap:9px; width:min(360px,100%); background:#fff; border:1px solid ${CL.cream3}; border-radius:14px; padding:11px 16px; box-shadow:0 4px 14px rgba(33,29,46,.05); }
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
  /* single column: copy first, route map flows below it (like the reference) */
  .oe-hero-grid { grid-template-columns:1fr; gap:28px; }
  .oe-map { width:100%; }
  .oe-map-svg { max-width:520px; }
  .oe-hero-title { letter-spacing:-1px; }
  .oe-grid { grid-template-columns:repeat(2,1fr); }
}
/* phones / small tablets: centre the whole hero, stats included */
@media (max-width:760px) {
  .oe-hero-copy { text-align:center; }
  .oe-hero-top { justify-content:center; }
  .oe-hero-sub { margin-left:auto; margin-right:auto; }
  .oe-hero-cta { justify-content:center; }
  .oe-statcard { margin-left:auto; margin-right:auto; }
}
@media (max-width:640px) {
  .oe-hero { padding:20px 0 40px; }
  .oe-hero-sub { max-width:none; }
  .oe-hero-cta { width:100%; }
  .oe-btn-primary, .oe-btn-ghost { flex:1 1 auto; justify-content:center; }
  /* three centred stat columns with dividers, matching the reference */
  .oe-statcard { display:flex; width:100%; gap:12px; padding:16px 12px; justify-content:space-between; }
  .oe-stat { flex:1; align-items:center; text-align:center; min-width:0; }
  .oe-stat-foot { line-height:1.35; }
  .oe-stat-num { font-size:1.5rem; }

  .oe-directory { padding:52px 0 72px; }
  .oe-grid { grid-template-columns:1fr; }

  /* filters stack full-width and read as a tidy column on phones */
  .oe-filters { flex-direction:column; align-items:stretch; gap:10px; }
  .oe-dd { width:100%; }
  .oe-dd-btn { width:100%; }
  .oe-dd-menu { min-width:100%; }
  .oe-search { width:100%; }
}
/* on small phones the in-map station text turns illegible when scaled down —
   drop it and let the rails + legend carry the visual (map is decorative). */
@media (max-width:560px) {
  .oe-map-lbl, .oe-map-hub { display:none; }
  .oe-map-svg { max-width:420px; }
}
@media (prefers-reduced-motion: reduce) {
  .ex-card--target { animation:none; }
}
`;
