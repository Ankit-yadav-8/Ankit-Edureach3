/* AdmissionTimeline — the home admission-season timeline.
   A wavy horizontal progress rail (DONE ✓ · NOW · upcoming) above six
   quarter cards spanning Jan 2026 → Jun 2027. The current quarter is
   computed live from the date — (year-2026)*4 + floor(month/3) — so the
   "NOW" marker auto-advances every month across cycles with no manual
   edits. Cards expand to every event; the full exam directory is tappable
   for per-exam detail; an Exam Buzz CTA links to the counselling hub. */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarRange, Check, ChevronDown, Radio, X, ArrowRight } from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";
import { EXAM_DETAILS, EXAM_GROUPS, levelTone } from "../../data/examCalendar.js";

/* exam-family palette (the coloured dots + legend) */
const FAM = {
  jee:     { dot: CL.coral,   label: "JEE Main" },
  adv:     { dot: CL.blue,    label: "JEE Advanced" },
  council: { dot: CL.violet,  label: "Counselling" },
  state:   { dot: CL.amber,   label: "State exams" },
  private: { dot: "#14B8A6",  label: "Private unis" },
  other:   { dot: CL.muted,   label: "Boards & other" },
};

const START_YEAR = 2026;

/* Six calendar quarters, Jan 2026 → Jun 2027, built from the official
   2025–26 cycle + expected 2026–27 annual schedule. */
const QUARTERS = [
  {
    mon: "Jan – Mar", yr: "2026", accent: CL.coral, accentBg: CL.coralSoft, events: [
      { fam: "jee",     name: "JEE Main · Session 1 Exam",          sub: "Jan" },
      { fam: "private", name: "VITEEE · SRMJEEE · BITSAT · MET Reg.", sub: "Jan" },
      { fam: "private", name: "AEEE P1 · KIITEE · LPUNEST · SAAT Reg.", sub: "Jan" },
      { fam: "state",   name: "KCET · KEAM · MHT CET Registration",  sub: "Jan" },
      { fam: "state",   name: "AP/TS EAPCET Notification · GUJCET",  sub: "Jan" },
      { fam: "jee",     name: "JEE Main S1 Result",                 sub: "Feb" },
      { fam: "jee",     name: "JEE Main Session 2 Registration",    sub: "Feb" },
      { fam: "state",   name: "COMEDK · WBJEE · OJEE Registration",  sub: "Feb" },
      { fam: "state",   name: "AP/TS EAMCET Registration",          sub: "Feb" },
      { fam: "private", name: "AMUEEE Registration",                sub: "Feb" },
      { fam: "state",   name: "GUJCET Exam",                        sub: "Mar" },
      { fam: "jee",     name: "JEE Main S2 Correction Window",      sub: "Mar" },
      { fam: "state",   name: "KCET · KEAM · MHT CET · COMEDK Admit Cards", sub: "Mar" },
      { fam: "private", name: "BITSAT S1 Registration Closes",      sub: "Mar" },
    ],
  },
  {
    mon: "Apr – Jun", yr: "2026", accent: CL.green, accentBg: CL.greenSoft, events: [
      { fam: "jee",     name: "JEE Main · Session 2",              sub: "Apr" },
      { fam: "private", name: "BITSAT Session 1",                  sub: "Apr" },
      { fam: "private", name: "VITEEE · SRMJEEE · MET · KIITEE P1", sub: "Apr" },
      { fam: "state",   name: "KCET · KEAM · MHT CET · WBJEE",      sub: "Apr" },
      { fam: "private", name: "AEEE Phase 2 · AMUEEE",             sub: "Apr" },
      { fam: "adv",     name: "JEE Advanced",                      sub: "May 17" },
      { fam: "state",   name: "COMEDK UGET",                       sub: "May 9" },
      { fam: "private", name: "BITSAT Session 2",                  sub: "May" },
      { fam: "state",   name: "AP/TS EAPCET · OJEE · HPCET",       sub: "May" },
      { fam: "state",   name: "MHT CET P2 · CUET-UG (Eng)",        sub: "May" },
      { fam: "adv",     name: "JEE Advanced Result",               sub: "Jun" },
      { fam: "council", name: "JoSAA Registration & Choice Filling", sub: "Jun" },
      { fam: "adv",     name: "AAT · Architecture Aptitude Test",  sub: "Jun" },
      { fam: "council", name: "State Counselling Begins · Doc Verify", sub: "Jun" },
    ],
  },
  {
    mon: "Jul – Sep", yr: "2026", accent: CL.blue, accentBg: "rgba(58,134,255,.12)", events: [
      { fam: "council", name: "JoSAA Counselling Rounds 1 – 6",    sub: "Jul" },
      { fam: "council", name: "Seat Allotment · Institute Reporting", sub: "Jul" },
      { fam: "state",   name: "State Counselling Continues",       sub: "Jul" },
      { fam: "private", name: "SRMJEEE Phase 3",                   sub: "Jul" },
      { fam: "council", name: "CSAB Special Rounds",               sub: "Aug" },
      { fam: "council", name: "Vacant Seat & Spot Admissions",     sub: "Aug" },
      { fam: "state",   name: "Final State Counselling Rounds",    sub: "Aug" },
      { fam: "council", name: "College Reporting",                 sub: "Aug" },
      { fam: "council", name: "Spot Round Admissions",             sub: "Sep" },
      { fam: "other",   name: "Admission Closure",                 sub: "Sep" },
    ],
  },
  {
    mon: "Oct – Dec", yr: "2026", accent: CL.violet, accentBg: "rgba(123,94,167,.14)", events: [
      { fam: "jee",     name: "JEE Main 2027 · S1 Notification",   sub: "Oct" },
      { fam: "jee",     name: "JEE Main Registration Opens",       sub: "Oct" },
      { fam: "private", name: "VITEEE · MET · AEEE · KIITEE Reg.",  sub: "Oct" },
      { fam: "jee",     name: "JEE Main S1 Reg. Continues",        sub: "Nov" },
      { fam: "private", name: "BITSAT · SRMJEEE Reg. Begins",      sub: "Nov" },
      { fam: "private", name: "LPUNEST · UPESAT · SAAT Reg.",      sub: "Nov" },
      { fam: "jee",     name: "JEE Main S1 Correction Window",     sub: "Dec" },
      { fam: "jee",     name: "Admit Card Updates",                sub: "Dec" },
      { fam: "state",   name: "GUJCET Reg. · WBJEE Bulletin",      sub: "Dec" },
    ],
  },
  {
    mon: "Jan – Mar", yr: "2027", accent: CL.coral, accentBg: CL.coralSoft, events: [
      { fam: "jee",     name: "JEE Main 2027 · Session 1 Exam",    sub: "Jan" },
      { fam: "private", name: "VITEEE · SRMJEEE · BITSAT · MET Reg.", sub: "Jan" },
      { fam: "private", name: "AEEE Phase 1",                     sub: "Jan" },
      { fam: "state",   name: "KCET · KEAM · MHT CET Registration", sub: "Jan" },
      { fam: "state",   name: "AP/TS EAPCET Notification",        sub: "Jan" },
      { fam: "jee",     name: "JEE Main S1 Result",               sub: "Feb" },
      { fam: "jee",     name: "JEE Main Session 2 Registration",  sub: "Feb" },
      { fam: "state",   name: "COMEDK · WBJEE · OJEE Registration", sub: "Feb" },
      { fam: "private", name: "AMUEEE Registration",              sub: "Feb" },
      { fam: "state",   name: "GUJCET Exam",                      sub: "Mar" },
      { fam: "jee",     name: "JEE Main S2 Correction Window",    sub: "Mar" },
      { fam: "state",   name: "KCET · KEAM · MHT CET · COMEDK Admit Cards", sub: "Mar" },
    ],
  },
  {
    mon: "Apr – Jun", yr: "2027", accent: CL.green, accentBg: CL.greenSoft, events: [
      { fam: "jee",     name: "JEE Main · Session 2",             sub: "Apr" },
      { fam: "private", name: "BITSAT S1 · VITEEE · SRMJEEE · MET", sub: "Apr" },
      { fam: "state",   name: "KCET · KEAM · MHT CET · WBJEE",     sub: "Apr" },
      { fam: "private", name: "AEEE Phase 2 · KIITEE P1 · AMUEEE", sub: "Apr" },
      { fam: "adv",     name: "JEE Advanced",                     sub: "May" },
      { fam: "private", name: "BITSAT Session 2",                 sub: "May" },
      { fam: "state",   name: "COMEDK · AP/TS EAPCET · OJEE",     sub: "May" },
      { fam: "state",   name: "MHT CET P2 · HPCET · CUET-UG",     sub: "May" },
      { fam: "adv",     name: "JEE Advanced Result",              sub: "Jun" },
      { fam: "council", name: "JoSAA Registration & Choice Filling", sub: "Jun" },
      { fam: "council", name: "State Counselling Begins · Doc Verify", sub: "Jun" },
    ],
  },
];

const PHASE = {
  done: { label: "Done", fg: CL.muted,  bg: "rgba(33,29,46,.06)" },
  live: { label: "Live", fg: "#0a8f5b", bg: CL.greenSoft },
  soon: { label: "Soon", fg: CL.coralDk, bg: CL.coralSoft },
};

const N = QUARTERS.length;
/* evenly-spaced nodes on a gentle sine wave (viewBox 1200 × 90) */
const NODES = QUARTERS.map((_, i) => ({
  x: ((i + 0.5) / N) * 1200,
  y: 46 + 10 * Math.sin(i * 1.15 + 0.5),
}));

/* smooth cubic path through a list of points */
function wavePath(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1], p1 = pts[i];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx.toFixed(1)} ${p0.y.toFixed(1)}, ${cx.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  return d;
}

const MAX_ROWS = 5; // events shown before "+N more"

export default function AdmissionTimeline() {
  const [showExams, setShowExams] = useState(false);
  const [openCards, setOpenCards] = useState({});
  const [activeExam, setActiveExam] = useState(null);

  const liveIndex = useMemo(() => {
    const now = new Date();
    return (now.getFullYear() - START_YEAR) * 4 + Math.floor(now.getMonth() / 3);
  }, []);

  const phaseOf = (i) => (i < liveIndex ? "done" : i === liveIndex ? "live" : "soon");
  const toggleCard = (i) => setOpenCards((o) => ({ ...o, [i]: !o[i] }));

  const grayD = wavePath([{ x: 0, y: NODES[0].y }, ...NODES, { x: 1200, y: NODES[N - 1].y }]);
  const li = Math.max(0, Math.min(liveIndex, N - 1));
  const coralPts = [{ x: 0, y: NODES[0].y }, ...NODES.slice(0, li + 1)];
  const coralD = liveIndex >= 0 && coralPts.length > 1 ? wavePath(coralPts) : "";

  const detail = activeExam ? EXAM_DETAILS[activeExam] : null;
  const detailRows = detail && [
    ["Level", detail.level], ["Conducted by", detail.body], ["Mode", detail.mode],
    ["Duration", detail.duration], ["Eligibility", detail.eligibility], ["Courses", detail.courses],
    ["Accepted by", detail.acceptedBy], ["Note", detail.note],
  ].filter(([, v]) => v);

  return (
    <section id="admission-timeline" style={{ background: CL.cream, padding: "84px 0", position: "relative" }}>
      <style>{CSS}</style>
      <div className="container at-container" style={{ position: "relative", zIndex: 1 }}>
        {/* heading */}
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 40px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <span style={clEyebrow}><CalendarRange size={13} /> Admission Calendar · 2026 – 27 Cycle</span>
          </div>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(2rem,4.5vw,2.8rem)", color: CL.ink, letterSpacing: "-1px", lineHeight: 1.15 }}>
            The complete <span style={{ color: CL.coral }}>admission season.</span>
          </h2>
          <p style={{ color: CL.body, fontSize: "1.08rem", lineHeight: 1.6, margin: "16px auto 24px" }}>
            Every major exam, result and counselling window from Jan 2026 to Jun 2027 — with a live marker that moves each month so you never miss a deadline.
          </p>
          <div className="at-legend">
            {Object.values(FAM).map((f) => (
              <span key={f.label} className="at-legend-item">
                <span className="at-legend-dot" style={{ background: f.dot }} /> {f.label}
              </span>
            ))}
          </div>
        </div>

        {/* animated wavy progress rail (desktop) */}
        <div className="at-rail" aria-hidden="true">
          <svg className="at-wave" viewBox="0 0 1200 90" preserveAspectRatio="none">
            <defs>
              <linearGradient id="atCoralGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={CL.coralDk} />
                <stop offset="0.6" stopColor={CL.coral} />
                <stop offset="1" stopColor="#FF8A5B" />
              </linearGradient>
              <filter id="atGlowF" x="-50%" y="-400%" width="200%" height="900%">
                <feGaussianBlur stdDeviation="3.2" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* base track */}
            <path d={grayD} fill="none" stroke={CL.cream3} strokeWidth="3" strokeLinecap="round" />
            {/* animated progress (draws in on view) */}
            {coralD && (
              <motion.path
                d={coralD} fill="none" stroke="url(#atCoralGrad)" strokeWidth="4" strokeLinecap="round"
                filter="url(#atGlowF)"
                initial={{ pathLength: 0, opacity: 0.2 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
              />
            )}
            {/* light pulse running along the progress line */}
            {coralD && (
              <path className="at-flow" d={coralD} fill="none" stroke="#FFEDE4" strokeWidth="4" strokeLinecap="round" />
            )}
          </svg>

          {QUARTERS.map((q, i) => {
            const ph = phaseOf(i);
            return (
              <motion.div
                key={q.mon + q.yr} className="at-node"
                style={{ left: `${(NODES[i].x / 1200) * 100}%`, top: NODES[i].y }}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.12, type: "spring", stiffness: 320, damping: 20 }}
              >
                {ph === "live" && <span className="at-node-pill at-node-pill--now">Now</span>}
                {ph === "done" && i === liveIndex - 1 && <span className="at-node-pill at-node-pill--done">Done</span>}
                {ph === "done" && <span className="at-dot at-dot--done"><Check size={13} strokeWidth={3} /></span>}
                {ph === "live" && (
                  <span className="at-dot at-dot--now">
                    <span className="at-ring at-ring-1" /><span className="at-ring at-ring-2" />
                    <span className="at-dot-core" />
                  </span>
                )}
                {ph === "soon" && <span className="at-dot at-dot--soon" />}
              </motion.div>
            );
          })}
        </div>

        {/* quarter cards */}
        <div className="at-cards">
          {QUARTERS.map((q, i) => {
            const ph = phaseOf(i);
            const p = PHASE[ph];
            const open = !!openCards[i];
            const shown = open ? q.events : q.events.slice(0, MAX_ROWS);
            const extra = q.events.length - MAX_ROWS;
            return (
              <motion.div
                key={q.mon + q.yr}
                className={`at-card at-card--${ph}`}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
              >
                <div className="at-card-head">
                  <span className="at-card-icon" style={{ background: q.accentBg, color: q.accent }}>
                    <CalendarRange size={19} />
                  </span>
                  <span className="at-card-phase" style={{ color: p.fg, background: p.bg }}>
                    {ph === "live" && <span className="at-phase-dot" />}{p.label}
                  </span>
                </div>
                <div className="at-card-title">
                  <span className="at-card-mon">{q.mon}</span>
                  <span className="at-card-yr">{q.yr}</span>
                </div>
                <div className="at-events">
                  {shown.map((e, idx) => {
                    const f = FAM[e.fam] || FAM.other;
                    return (
                      <div key={idx} className="at-event">
                        <span className="at-event-dot" style={{ background: f.dot }} />
                        <span className="at-event-text">
                          <span className="at-event-name">{e.name}</span>
                          {e.sub && <span className="at-event-sub">{e.sub}</span>}
                        </span>
                      </div>
                    );
                  })}
                  {extra > 0 && (
                    <button className="at-more" onClick={() => toggleCard(i)}>
                      {open ? "Show less" : `+${extra} more`}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Exam Buzz CTA */}
        <div className="at-cta-wrap">
          <Link to="/exam-buzz" className="at-cta">
            <Radio size={17} /> Explore the full counselling timeline on Exam Buzz <ArrowRight size={16} />
          </Link>
        </div>

        {/* complete exam directory (collapsible · tap any exam for details) */}
        <div className="at-exams">
          <button className="at-exams-toggle" onClick={() => setShowExams((s) => !s)} aria-expanded={showExams}>
            Complete list of engineering entrance exams
            <ChevronDown size={17} style={{ transform: showExams ? "rotate(180deg)" : "none", transition: "transform .25s" }} />
          </button>
          {showExams && (
            <motion.div className="at-exams-grid" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              {EXAM_GROUPS.map((g) => (
                <div key={g.title} className="at-exam-group">
                  <h4 className="at-exam-group-title" style={{ color: g.tone }}>{g.title}</h4>
                  <div className="at-chips">
                    {g.exams.map((name) => (
                      <button key={name} className="at-chip" style={{ borderColor: `${g.tone}44` }} onClick={() => setActiveExam(name)}>
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* per-exam detail modal */}
      <AnimatePresence>
        {detail && (
          <motion.div className="at-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveExam(null)}>
            <motion.div
              className="at-modal"
              initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()} role="dialog" aria-label={`${activeExam} details`}
            >
              <button className="at-modal-x" onClick={() => setActiveExam(null)} aria-label="Close"><X size={16} /></button>
              <span className="at-modal-level" style={{ color: levelTone(detail.level), background: `${levelTone(detail.level)}18` }}>{detail.level}</span>
              <h3 className="at-modal-title">{activeExam}</h3>
              <dl className="at-modal-rows">
                {detailRows.map(([k, v]) => (
                  <div key={k} className="at-modal-row"><dt>{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
              <Link to="/exam-buzz" className="at-modal-link" onClick={() => setActiveExam(null)}>
                See live counselling dates on Exam Buzz <ArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

const CSS = `
.at-container { max-width:1280px; }
.at-legend { display:flex; flex-wrap:wrap; justify-content:center; gap:10px 22px; }
.at-legend-item { display:inline-flex; align-items:center; gap:7px; font-size:13px; color:${CL.body}; font-weight:600; }
.at-legend-dot { width:10px; height:10px; border-radius:4px; }

/* ── animated wavy progress rail ── */
.at-rail { position:relative; height:96px; max-width:1240px; margin:18px auto 8px; }
.at-wave { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
.at-flow { stroke-dasharray:16 250; stroke-dashoffset:0; opacity:.9; animation:atFlow 2.8s linear infinite; }
@keyframes atFlow { to { stroke-dashoffset:-266; } }
.at-node { position:absolute; transform:translate(-50%,-50%); }
.at-node-pill {
  position:absolute; left:50%; bottom:calc(100% + 13px); transform:translateX(-50%);
  font:800 10px/1 ${CL.display}; letter-spacing:.09em; text-transform:uppercase;
  padding:5px 11px; border-radius:50px; white-space:nowrap;
}
.at-node-pill--now  { color:#fff; background:${CL.coral}; box-shadow:0 6px 16px ${CL.coral}66; }
.at-node-pill--done { color:${CL.muted}; background:#fff; border:1px solid ${CL.cream3}; }

.at-dot { position:relative; display:grid; place-items:center; border-radius:50%; }
.at-dot--done { width:26px; height:26px; background:#fff; border:2px solid ${CL.coral}; color:${CL.coral}; box-shadow:0 4px 12px ${CL.coral}33; }
.at-dot--soon { width:16px; height:16px; background:#fff; border:2px dashed ${CL.muted}; }
.at-dot--now  { width:32px; height:32px; background:${CL.coral}; color:#fff; box-shadow:0 8px 22px ${CL.coral}66; }
.at-dot-core { width:12px; height:12px; border-radius:50%; background:#fff; position:relative; z-index:2; }
.at-ring { position:absolute; inset:0; border-radius:50%; border:2px solid ${CL.coral}; opacity:0; }
.at-ring-1 { animation:atRing 2.4s ease-out infinite; }
.at-ring-2 { animation:atRing 2.4s ease-out infinite 1.2s; }
@keyframes atRing {
  0%   { transform:scale(1);   opacity:.7; }
  100% { transform:scale(2.9); opacity:0; }
}

/* ── quarter cards ── */
.at-cards { display:grid; grid-template-columns:repeat(6,1fr); gap:16px; max-width:1280px; margin:0 auto; align-items:start; }
.at-card {
  background:#FBF7F4; border:1px solid ${CL.line}; border-radius:20px; padding:18px;
  display:flex; flex-direction:column; gap:14px;
  transition:transform .25s ease, box-shadow .25s ease;
}
.at-card:hover { transform:translateY(-5px); box-shadow:0 18px 40px rgba(33,29,46,.09); }
.at-card--done { background:#F7F6F7; }
.at-card--done .at-event-name, .at-card--done .at-card-mon { color:${CL.ink2}; }
.at-card--live {
  background:linear-gradient(180deg,${CL.greenSoft}55,#FBFDFB);
  border:1.5px solid ${CL.green}; box-shadow:0 14px 34px ${CL.green}22;
}
.at-card--soon { background:#FCF6F2; }

.at-card-head { display:flex; align-items:center; justify-content:space-between; }
.at-card-icon { width:40px; height:40px; border-radius:12px; display:grid; place-items:center; flex-shrink:0; }
.at-card-phase {
  display:inline-flex; align-items:center; gap:6px;
  font:800 9.5px/1 ${CL.display}; letter-spacing:.08em; text-transform:uppercase;
  padding:5px 10px; border-radius:50px;
}
.at-phase-dot { width:6px; height:6px; border-radius:50%; background:currentColor; animation:atPulse 1.5s ease-in-out infinite; }
@keyframes atPulse { 0%,100%{transform:scale(.9);opacity:1;} 50%{transform:scale(1.5);opacity:.4;} }

.at-card-title { display:flex; align-items:baseline; gap:8px; padding-bottom:12px; border-bottom:1px dashed ${CL.line}; }
.at-card-mon { font:800 1.18rem/1.1 ${CL.display}; color:${CL.ink}; letter-spacing:-.4px; }
.at-card-yr { font:700 .86rem/1 sans-serif; color:${CL.muted}; }

.at-events { display:flex; flex-direction:column; gap:10px; }
.at-event { display:flex; align-items:flex-start; gap:9px; }
.at-event-dot { width:8px; height:8px; border-radius:50%; margin-top:4px; flex-shrink:0; }
.at-event-text { display:flex; flex-direction:column; gap:1px; min-width:0; }
.at-event-name { font:700 .8rem/1.3 ${CL.display}; color:${CL.ink}; }
.at-event-sub { font:500 .72rem/1.35 sans-serif; color:${CL.muted}; }
.at-more {
  align-self:flex-start; margin-top:4px; margin-left:17px; cursor:pointer;
  font:700 .76rem/1 ${CL.display}; color:${CL.coralDk};
  background:none; border:none; padding:2px 0;
}
.at-more:hover { text-decoration:underline; }

/* ── Exam Buzz CTA ── */
.at-cta-wrap { text-align:center; margin:46px 0 4px; }
.at-cta {
  display:inline-flex; align-items:center; gap:10px; text-decoration:none;
  background:${CL.coral}; color:#fff; border-radius:50px; padding:14px 28px;
  font:800 1rem/1 ${CL.display}; box-shadow:0 10px 26px rgba(255,105,61,.32);
  transition:transform .2s, box-shadow .2s;
}
.at-cta:hover { transform:translateY(-2px); box-shadow:0 14px 32px rgba(255,105,61,.42); }

/* ── complete exam directory ── */
.at-exams { max-width:1120px; margin:26px auto 0; text-align:center; }
.at-exams-toggle {
  display:inline-flex; align-items:center; gap:9px; cursor:pointer;
  background:#fff; border:1px solid ${CL.cream3}; border-radius:50px;
  padding:12px 22px; font:800 .92rem/1 ${CL.display}; color:${CL.ink};
  box-shadow:0 6px 18px rgba(33,29,46,.05); transition:border-color .2s, box-shadow .2s;
}
.at-exams-toggle:hover { border-color:${CL.coral}66; box-shadow:0 10px 24px rgba(255,105,61,.14); }
.at-exams-grid {
  display:grid; grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr));
  gap:22px; margin-top:26px; text-align:left;
}
.at-exam-group-title { font:800 .78rem/1 ${CL.display}; letter-spacing:.1em; text-transform:uppercase; margin-bottom:12px; }
.at-chips { display:flex; flex-wrap:wrap; gap:8px; }
.at-chip {
  font:600 .8rem/1 sans-serif; color:${CL.ink2}; background:#fff; cursor:pointer;
  border:1px solid ${CL.cream3}; border-radius:8px; padding:7px 11px;
  transition:transform .15s, box-shadow .15s, background .15s;
}
.at-chip:hover { transform:translateY(-2px); background:#FBF7F4; box-shadow:0 6px 16px rgba(33,29,46,.08); }

/* ── per-exam detail modal ── */
.at-modal-overlay { position:fixed; inset:0; z-index:120; background:rgba(20,16,26,.55); backdrop-filter:blur(3px); display:grid; place-items:center; padding:20px; }
.at-modal { position:relative; width:min(440px,100%); max-height:88vh; overflow-y:auto; background:#fff; border-radius:22px; padding:26px 24px 22px; box-shadow:0 30px 70px rgba(13,27,62,.35); }
.at-modal-x { position:absolute; top:14px; right:14px; width:32px; height:32px; border-radius:50%; display:grid; place-items:center; cursor:pointer; color:${CL.body}; background:${CL.cream2}; border:1px solid ${CL.cream3}; }
.at-modal-x:hover { background:${CL.cream3}; }
.at-modal-level { display:inline-flex; font:800 10.5px/1 ${CL.display}; letter-spacing:.09em; text-transform:uppercase; padding:6px 12px; border-radius:50px; }
.at-modal-title { font:800 1.5rem/1.15 ${CL.display}; color:${CL.ink}; letter-spacing:-.5px; margin:12px 0 18px; }
.at-modal-rows { display:flex; flex-direction:column; gap:0; }
.at-modal-row { display:grid; grid-template-columns:110px 1fr; gap:14px; padding:11px 0; border-top:1px solid ${CL.line}; }
.at-modal-row dt { font:700 .78rem/1.4 ${CL.display}; color:${CL.muted}; text-transform:uppercase; letter-spacing:.04em; }
.at-modal-row dd { font:500 .9rem/1.5 sans-serif; color:${CL.ink2}; }
.at-modal-link { display:inline-flex; align-items:center; gap:7px; margin-top:18px; text-decoration:none; color:${CL.coralDk}; font:800 .88rem/1 ${CL.display}; }
.at-modal-link:hover { gap:10px; }

@media (max-width:1099px) {
  .at-rail { display:none; }
  .at-cards { grid-template-columns:repeat(3,1fr); gap:18px; }
}
@media (max-width:760px) { .at-cards { grid-template-columns:repeat(2,1fr); } }
@media (max-width:520px) {
  .at-cards { grid-template-columns:1fr; }
  .at-modal-row { grid-template-columns:96px 1fr; gap:10px; }
}
@media (prefers-reduced-motion: reduce) {
  .at-ring, .at-flow { animation:none; }
  .at-flow { display:none; }
}
`;
