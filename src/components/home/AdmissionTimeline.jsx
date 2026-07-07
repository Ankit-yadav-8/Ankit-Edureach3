/* AdmissionTimeline — the home admission-season timeline.
   Merges the old ExamCalendar + Exam-Buzz teaser into one section:
   a wavy horizontal progress rail (DONE ✓ · NOW · upcoming) above four
   quarter cards. The current quarter is computed live from the date —
   floor(month / 3) — so the "NOW" marker auto-advances every month with
   no manual edits. Card styling follows the soft "LIVE"-pill card look. */
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarRange, Check, ChevronDown } from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

/* exam-family palette (the coloured dots + legend) */
const FAM = {
  jee:     { dot: CL.coral,   label: "JEE" },
  adv:     { dot: CL.blue,    label: "JEE Advanced" },
  neet:    { dot: CL.green,   label: "NEET" },
  council: { dot: CL.violet,  label: "Counselling" },
  state:   { dot: CL.amber,   label: "State exams" },
  private: { dot: "#14B8A6",  label: "Private unis" },
  other:   { dot: CL.muted,   label: "Boards & other" },
};

/* Four calendar quarters. Events are annualised, so the same rail is
   reused every cycle; only the phase (done / now / soon) changes by date. */
const QUARTERS = [
  {
    mon: "Jan – Mar", accent: CL.coral, accentBg: CL.coralSoft, events: [
      { fam: "jee",   name: "JEE Main · Session 1",        sub: "Jan 22 – 29" },
      { fam: "jee",   name: "JEE Main S1 Result",          sub: "Feb" },
      { fam: "jee",   name: "JEE Main Session 2 Reg.",     sub: "Feb" },
      { fam: "state", name: "KCET · KEAM · MHT CET Reg.",  sub: "Jan" },
      { fam: "state", name: "COMEDK · EAMCET Reg.",        sub: "Feb" },
      { fam: "other", name: "Board Practicals & Theory",   sub: "Feb – Mar" },
      { fam: "state", name: "WBJEE · GUJCET Reg.",         sub: "Mar" },
      { fam: "jee",   name: "BITSAT Session 1 Reg.",       sub: "Mar" },
    ],
  },
  {
    mon: "Apr – Jun", accent: CL.green, accentBg: CL.greenSoft, events: [
      { fam: "jee",     name: "JEE Main · Session 2",              sub: "Apr 1 – 8" },
      { fam: "private", name: "VITEEE · SRMJEEE · MET · KIITEE",   sub: "Apr" },
      { fam: "state",   name: "KCET · KEAM · MHT CET",             sub: "Apr" },
      { fam: "other",   name: "CUET-UG Window",                   sub: "Apr" },
      { fam: "neet",    name: "NEET-UG",                          sub: "May 3" },
      { fam: "state",   name: "COMEDK UGET",                      sub: "May 9" },
      { fam: "adv",     name: "JEE Advanced",                     sub: "May 17" },
      { fam: "jee",     name: "BITSAT Session 1",                 sub: "Late May" },
      { fam: "state",   name: "WBJEE · EAPCET · OJEE",            sub: "May" },
      { fam: "adv",     name: "JEE Advanced Results",             sub: "Jun" },
      { fam: "council", name: "JoSAA Counselling Begins",         sub: "Jun" },
      { fam: "state",   name: "BITSAT · COMEDK Counselling",      sub: "Jun" },
    ],
  },
  {
    mon: "Jul – Sep", accent: CL.blue, accentBg: "rgba(58,134,255,.12)", events: [
      { fam: "council", name: "JoSAA Rounds 1 – 6",         sub: "Jul" },
      { fam: "council", name: "CSAB Special Rounds",        sub: "Jul" },
      { fam: "state",   name: "State Counselling (CAP)",    sub: "Jul" },
      { fam: "council", name: "College Seat Allotment",     sub: "Jul" },
      { fam: "council", name: "Final Reporting",            sub: "Aug" },
      { fam: "other",   name: "Classes Begin",              sub: "Aug" },
      { fam: "council", name: "Spot Round Vacancies",       sub: "Sep" },
      { fam: "council", name: "Admission Closure",          sub: "Sep" },
    ],
  },
  {
    mon: "Oct – Dec", accent: CL.violet, accentBg: "rgba(123,94,167,.14)", events: [
      { fam: "jee",     name: "JEE Main · S1 Notification",   sub: "Oct" },
      { fam: "other",   name: "Internal Branch Sliding",      sub: "Oct" },
      { fam: "jee",     name: "JEE Main Registration",        sub: "Nov" },
      { fam: "private", name: "VITEEE · SRMJEEE Reg.",        sub: "Nov" },
      { fam: "jee",     name: "BITSAT · GUJCET Reg.",         sub: "Dec" },
      { fam: "jee",     name: "JEE Main Admit Card & Prep",   sub: "Dec" },
    ],
  },
];

const PHASE = {
  done: { label: "Done", fg: CL.muted,  bg: "rgba(33,29,46,.06)" },
  live: { label: "Live", fg: "#0a8f5b", bg: CL.greenSoft },
  soon: { label: "Soon", fg: CL.coralDk, bg: CL.coralSoft },
};

/* full engineering-entrance list, grouped (from the admission handbook) */
const EXAM_GROUPS = [
  { title: "National-level", tone: CL.coral, list: ["JEE Main", "JEE Advanced", "BITSAT", "CUET UG", "AEEE", "AMUEEE", "KIITEE", "COMEDK UGET", "IMU CET", "CIPET JEE"] },
  { title: "State-level", tone: CL.amber, list: ["MHT CET", "KCET", "KEAM", "WBJEE", "AP EAPCET", "TS EAMCET", "GUJCET", "OJEE", "HPCET", "CG PET", "BCECE", "REAP", "UPTAC", "JAC Delhi", "HSTES Haryana", "MP DTE", "TNEA"] },
  { title: "Private universities", tone: "#14B8A6", list: ["VITEEE", "SRMJEEE", "MET (Manipal)", "BVP CET", "UPESAT", "SAAT", "LPU NEST", "GEEE", "JET", "SITEEE"] },
];

/* smooth cubic path through a list of points */
function wavePath(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1], p1 = pts[i];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

const NODES_X = [150, 450, 750, 1050];       // centres of 4 equal columns (viewBox 1200)
const NODES_Y = [50, 40, 55, 45];            // gentle wave (viewBox height 90)
const MAX_ROWS = 5;                          // events shown before "+N more"

export default function AdmissionTimeline() {
  const [showExams, setShowExams] = useState(false);

  const { liveIndex, cycleLabel } = useMemo(() => {
    const now = new Date();
    const q = Math.floor(now.getMonth() / 3);          // 0..3 → auto-advances monthly
    const y = now.getFullYear();
    return { liveIndex: q, cycleLabel: `${y}–${String((y + 1) % 100).padStart(2, "0")}` };
  }, []);

  const phaseOf = (i) => (i < liveIndex ? "done" : i === liveIndex ? "live" : "soon");

  const nodePts = NODES_X.map((x, i) => ({ x, y: NODES_Y[i] }));
  const grayPts = [{ x: 0, y: NODES_Y[0] }, ...nodePts, { x: 1200, y: NODES_Y[3] }];
  const coralPts = [{ x: 0, y: NODES_Y[0] }, ...nodePts.slice(0, liveIndex + 1)];

  return (
    <section id="admission-timeline" style={{ background: CL.cream, padding: "84px 0", position: "relative" }}>
      <style>{CSS}</style>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* heading */}
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 40px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <span style={clEyebrow}><CalendarRange size={13} /> Admission Calendar · {cycleLabel} Cycle</span>
          </div>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(2rem,4.5vw,2.8rem)", color: CL.ink, letterSpacing: "-1px", lineHeight: 1.15 }}>
            The complete <span style={{ color: CL.coral }}>admission season.</span>
          </h2>
          <p style={{ color: CL.body, fontSize: "1.08rem", lineHeight: 1.6, margin: "16px auto 24px" }}>
            Every major exam, result and counselling window — organised by quarter, with a live marker so you never miss a deadline.
          </p>
          <div className="at-legend">
            {Object.values(FAM).map((f) => (
              <span key={f.label} className="at-legend-item">
                <span className="at-legend-dot" style={{ background: f.dot }} /> {f.label}
              </span>
            ))}
          </div>
        </div>

        {/* wavy progress rail (desktop) */}
        <div className="at-rail" aria-hidden="true">
          <svg className="at-wave" viewBox="0 0 1200 90" preserveAspectRatio="none">
            <path d={wavePath(grayPts)} fill="none" stroke={CL.cream3} strokeWidth="3" strokeLinecap="round" />
            <path d={wavePath(coralPts)} fill="none" stroke={CL.coral} strokeWidth="3.5" strokeLinecap="round" />
          </svg>
          {QUARTERS.map((q, i) => {
            const ph = phaseOf(i);
            const left = `${(NODES_X[i] / 1200) * 100}%`;
            const top = NODES_Y[i];
            return (
              <div key={q.mon} className="at-node" style={{ left, top }}>
                {ph === "live" && <span className="at-node-pill at-node-pill--now">Now</span>}
                {ph === "done" && i === liveIndex - 1 && <span className="at-node-pill at-node-pill--done">Done</span>}
                {ph === "done" && (
                  <span className="at-dot at-dot--done"><Check size={13} strokeWidth={3} /></span>
                )}
                {ph === "live" && (
                  <span className="at-dot at-dot--now"><span className="at-dot-core" /></span>
                )}
                {ph === "soon" && <span className="at-dot at-dot--soon" />}
              </div>
            );
          })}
        </div>

        {/* quarter cards */}
        <div className="at-cards">
          {QUARTERS.map((q, i) => {
            const ph = phaseOf(i);
            const p = PHASE[ph];
            const shown = q.events.slice(0, MAX_ROWS);
            const extra = q.events.length - shown.length;
            return (
              <motion.div
                key={q.mon}
                className={`at-card at-card--${ph}`}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="at-card-head">
                  <span className="at-card-icon" style={{ background: q.accentBg, color: q.accent }}>
                    <CalendarRange size={20} />
                  </span>
                  <span className="at-card-phase" style={{ color: p.fg, background: p.bg }}>
                    {ph === "live" && <span className="at-phase-dot" />}{p.label}
                  </span>
                </div>
                <div className="at-card-title">
                  <span className="at-card-mon">{q.mon}</span>
                  <span className="at-card-yr">{cycleLabel.slice(0, 4)}</span>
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
                  {extra > 0 && <span className="at-more">+{extra} more</span>}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* complete exam list (collapsible) */}
        <div className="at-exams">
          <button className="at-exams-toggle" onClick={() => setShowExams((s) => !s)} aria-expanded={showExams}>
            Complete list of engineering entrance exams
            <ChevronDown size={17} style={{ transform: showExams ? "rotate(180deg)" : "none", transition: "transform .25s" }} />
          </button>
          {showExams && (
            <motion.div
              className="at-exams-grid"
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
            >
              {EXAM_GROUPS.map((g) => (
                <div key={g.title} className="at-exam-group">
                  <h4 className="at-exam-group-title" style={{ color: g.tone }}>{g.title}</h4>
                  <div className="at-chips">
                    {g.list.map((x) => (
                      <span key={x} className="at-chip" style={{ borderColor: `${g.tone}44` }}>{x}</span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

const CSS = `
.at-legend { display:flex; flex-wrap:wrap; justify-content:center; gap:10px 22px; }
.at-legend-item { display:inline-flex; align-items:center; gap:7px; font-size:13px; color:${CL.body}; font-weight:600; }
.at-legend-dot { width:10px; height:10px; border-radius:4px; }

/* ── wavy progress rail ── */
.at-rail { position:relative; height:90px; max-width:1120px; margin:14px auto 6px; }
.at-wave { position:absolute; inset:0; width:100%; height:100%; }
.at-node { position:absolute; transform:translate(-50%,-50%); }
.at-node-pill {
  position:absolute; left:50%; bottom:calc(100% + 12px); transform:translateX(-50%);
  font:800 10px/1 ${CL.display}; letter-spacing:.09em; text-transform:uppercase;
  padding:5px 11px; border-radius:50px; white-space:nowrap;
}
.at-node-pill--now  { color:#fff; background:${CL.coral}; box-shadow:0 6px 16px ${CL.coral}66; }
.at-node-pill--done { color:${CL.muted}; background:#fff; border:1px solid ${CL.cream3}; }

.at-dot { display:grid; place-items:center; border-radius:50%; }
.at-dot--done { width:26px; height:26px; background:#fff; border:2px solid ${CL.coral}; color:${CL.coral}; }
.at-dot--soon { width:16px; height:16px; background:#fff; border:2px dashed ${CL.muted}; }
.at-dot--now  {
  width:30px; height:30px; background:${CL.coral}; color:#fff;
  box-shadow:0 0 0 6px ${CL.coral}22, 0 8px 22px ${CL.coral}55;
  animation:atGlow 2s ease-in-out infinite;
}
.at-dot-core { width:11px; height:11px; border-radius:50%; background:#fff; }
@keyframes atGlow {
  0%,100% { box-shadow:0 0 0 5px ${CL.coral}22, 0 8px 22px ${CL.coral}44; }
  50%     { box-shadow:0 0 0 12px ${CL.coral}00, 0 8px 26px ${CL.coral}66; }
}

/* ── quarter cards ── */
.at-cards { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; max-width:1120px; margin:0 auto; }
.at-card {
  background:#FBF7F4; border:1px solid ${CL.line}; border-radius:22px; padding:22px;
  display:flex; flex-direction:column; gap:16px;
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
.at-card-icon { width:44px; height:44px; border-radius:13px; display:grid; place-items:center; flex-shrink:0; }
.at-card-phase {
  display:inline-flex; align-items:center; gap:6px;
  font:800 10px/1 ${CL.display}; letter-spacing:.09em; text-transform:uppercase;
  padding:5px 11px; border-radius:50px;
}
.at-phase-dot { width:6px; height:6px; border-radius:50%; background:currentColor; animation:atPulse 1.5s ease-in-out infinite; }
@keyframes atPulse { 0%,100%{transform:scale(.9);opacity:1;} 50%{transform:scale(1.5);opacity:.4;} }

.at-card-title { display:flex; align-items:baseline; gap:9px; padding-bottom:14px; border-bottom:1px dashed ${CL.line}; }
.at-card-mon { font:800 1.3rem/1.1 ${CL.display}; color:${CL.ink}; letter-spacing:-.4px; }
.at-card-yr { font:700 .9rem/1 sans-serif; color:${CL.muted}; }

.at-events { display:flex; flex-direction:column; gap:11px; }
.at-event { display:flex; align-items:flex-start; gap:10px; cursor:default; }
.at-event-dot { width:9px; height:9px; border-radius:50%; margin-top:4px; flex-shrink:0; }
.at-event-text { display:flex; flex-direction:column; gap:1px; min-width:0; }
.at-event-name { font:700 .86rem/1.3 ${CL.display}; color:${CL.ink}; }
.at-event-sub { font:500 .74rem/1.35 sans-serif; color:${CL.muted}; }
.at-more { font:700 .78rem/1 ${CL.display}; color:${CL.coralDk}; margin-top:4px; padding-left:19px; }

/* ── complete exam list ── */
.at-exams { max-width:1120px; margin:44px auto 0; text-align:center; }
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
  font:600 .8rem/1 sans-serif; color:${CL.ink2}; background:#fff;
  border:1px solid ${CL.cream3}; border-radius:8px; padding:7px 11px;
}

@media (max-width:920px) {
  .at-rail { display:none; }
  .at-cards { grid-template-columns:repeat(2,1fr); gap:16px; }
}
@media (max-width:560px) {
  .at-cards { grid-template-columns:1fr; }
  .at-card { padding:20px; }
}
`;
