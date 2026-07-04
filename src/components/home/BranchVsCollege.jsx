/* BranchVsCollege — original "which side do you protect" priority check,
   written and designed in-house for College Parichay. Seven scenario
   questions score toward branch (negative) or college (positive); a
   compass strip slides live under the quiz and the final verdict renders
   as a semicircular dial with pointers and next steps. Used both as a
   home section and on /branch-vs-college. */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCompareArrows, ArrowRight, RotateCcw, Sparkles,
  Layers, Crosshair, Compass, CheckCircle2, Scale,
} from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

/* Every option carries a score: negative leans branch, positive leans
   college, magnitude = how strongly. All questions are original
   College Parichay scenarios. */
const QUESTIONS = [
  {
    q: "Two admission offers land on the same day. Which one do you accept?",
    options: [
      { label: "The famous campus, even if the subject isn't my favourite", score: 2 },
      { label: "The subject I want, even if few people know the college", score: -2 },
      { label: "The one where seniors report better internships", score: 1 },
      { label: "The one whose curriculum genuinely interests me", score: -1 },
    ],
  },
  {
    q: "Picture your third year of B.Tech. What would make it feel worth it?",
    options: [
      { label: "Leading clubs and fests on a buzzing campus", score: 2 },
      { label: "Building real projects in the exact field I chose", score: -2 },
      { label: "Sitting for the biggest recruiters at placement season", score: 1 },
      { label: "An internship or paper in my core domain", score: -1 },
    ],
  },
  {
    q: "How fixed is your idea of what you want to study?",
    options: [
      { label: "Locked in — I've known my field for years", score: -2 },
      { label: "I have a favourite, but I could be convinced", score: -1 },
      { label: "Honestly, I keep changing my mind", score: 2 },
      { label: "I care more about outcomes than the subject itself", score: 1 },
    ],
  },
  {
    q: "A senior says: “Your branch stops mattering after the first job.” You think…",
    options: [
      { label: "True — the college name opens the first door", score: 2 },
      { label: "Wrong — deep skills compound for decades", score: -2 },
      { label: "Partly true — but I'd still start in the right field", score: -1 },
      { label: "Neither matters as much as the network you build", score: 1 },
    ],
  },
  {
    q: "Your dream branch closes just above your rank. Plan B is…",
    options: [
      { label: "Take the best college available and explore inside it", score: 2 },
      { label: "Drop a college tier to protect the branch", score: -2 },
      { label: "Join any branch there and attempt a branch change", score: 1 },
      { label: "Pick a related branch that keeps my field alive", score: -1 },
    ],
  },
  {
    q: "Ten years from now, you'd rather be known as…",
    options: [
      { label: "An alum of a legendary institute", score: 2 },
      { label: "The specialist people call for one hard problem", score: -2 },
      { label: "A generalist who moves across roles easily", score: 1 },
      { label: "Someone who built a career on one strong skill", score: -1 },
    ],
  },
  {
    q: "Which outcome would bother you more?",
    options: [
      { label: "Missing the alumni network of a top campus", score: 2 },
      { label: "Spending four years on a subject I don't enjoy", score: -2 },
      { label: "Graduating without a strong placement season", score: 1 },
      { label: "Being average at something I never chose", score: -1 },
    ],
  },
];

const MAX_SCORE = QUESTIONS.reduce(
  (s, q) => s + Math.max(...q.options.map((o) => Math.abs(o.score))), 0,
);

/* sum of answered scores → norm in [-1, 1] (negative = branch) */
function scoreState(answers) {
  const sum = answers.reduce((s, a) => s + (a ? a.score : 0), 0);
  return { sum, norm: Math.max(-1, Math.min(1, sum / MAX_SCORE)) };
}

function computeVerdict(answers) {
  const { norm } = scoreState(answers);
  const strength = Math.round(Math.abs(norm) * 100);
  if (norm >= 0.15) {
    return {
      side: "college", norm, strength,
      eyebrow: "PROTECT THE COLLEGE",
      title: "Put the college first in your list.",
      blurb:
        "Your answers say the campus — its people, brand and placement floor — is what you'd regret losing. When a choice forces a trade-off, keep the stronger institute and stay open about the branch.",
      pointers: [
        "Order your JoSAA list by institute tier before branch preference.",
        "Inside each college, still rank branches you'd genuinely accept.",
        "Check branch-change rules — many institutes allow a switch after year one.",
      ],
    };
  }
  if (norm <= -0.15) {
    return {
      side: "branch", norm, strength,
      eyebrow: "PROTECT THE BRANCH",
      title: "Put the branch first in your list.",
      blurb:
        "Your answers point to the subject, not the signboard. You already know what you want to spend four years on — so protect that field even if it means a less famous campus.",
      pointers: [
        "Order your JoSAA list by branch first, then by college within it.",
        "Include your branch at colleges a tier below your rank as safety.",
        "Skip “better” colleges offering branches you'd resent studying.",
      ],
    };
  }
  return {
    side: "balanced", norm, strength,
    eyebrow: "GENUINELY BALANCED",
    title: "You can trade either way — use rank math.",
    blurb:
      "Neither side dominates for you, and that's an advantage: you won't regret a smart compromise. Decide each choice on its own numbers — cutoffs, placements and how much you'd enjoy the subject.",
    pointers: [
      "Interleave your list: dream branch at good colleges, good branches at dream colleges.",
      "Use last year's closing ranks to see which trade-offs are realistic for you.",
      "Revisit this check after exploring branches — clarity usually picks a side.",
    ],
  };
}

/* Eased count-up for live numbers. */
function useCountUp(target, dur = 650) {
  const [n, setN] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const from = prev.current, to = target;
    prev.current = target;
    if (from === to) { setN(to); return; }
    let raf, start;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return n;
}

/* ── DirectionDial — semicircular gauge whose needle swings between
   Branch (left) and College (right). Original SVG, exported for the
   /branch-vs-college hero too. ── */
export function DirectionDial({ norm = 0, size = 240, label = true }) {
  const W = 220, H = 132, cx = 110, cy = 116, R = 90;
  const ang = norm * 72 * (Math.PI / 180); // cap swing at ±72°
  const nx = cx + Math.sin(ang) * (R - 20);
  const ny = cy - Math.cos(ang) * (R - 20);
  const arc = (a0, a1, color) => {
    const p = (a) => [cx + Math.sin(a) * R, cy - Math.cos(a) * R];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return <path d={`M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`} fill="none" stroke={color} strokeWidth="13" strokeLinecap="round" />;
  };
  const D = Math.PI / 180;
  return (
    <svg viewBox={`0 0 ${W} ${H + (label ? 16 : 0)}`} width={size} style={{ maxWidth: "100%", height: "auto", display: "block" }} role="img" aria-label="Branch vs college direction dial">
      {arc(-84 * D, -30 * D, CL.coral)}
      {arc(-24 * D, 24 * D, CL.amber)}
      {arc(30 * D, 84 * D, CL.green)}
      {/* tick marks */}
      {[-60, -30, 0, 30, 60].map((deg) => {
        const a = deg * D;
        return (
          <line key={deg}
            x1={cx + Math.sin(a) * (R - 14)} y1={cy - Math.cos(a) * (R - 14)}
            x2={cx + Math.sin(a) * (R - 22)} y2={cy - Math.cos(a) * (R - 22)}
            stroke={CL.cream3} strokeWidth="2" strokeLinecap="round" />
        );
      })}
      {/* needle */}
      <motion.line
        x1={cx} y1={cy} animate={{ x2: nx, y2: ny }}
        transition={{ type: "spring", stiffness: 70, damping: 13 }}
        stroke={CL.ink} strokeWidth="4.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="10" fill={CL.ink} />
      <circle cx={cx} cy={cy} r="4" fill="#fff" />
      {label && (
        <>
          <text x="20" y={H + 10} fontSize="10.5" fontWeight="800" letterSpacing="1" fill={CL.coralDk} fontFamily={CL.display}>BRANCH</text>
          <text x={W - 20} y={H + 10} fontSize="10.5" fontWeight="800" letterSpacing="1" fill="#0a8f5b" fontFamily={CL.display} textAnchor="end">COLLEGE</text>
        </>
      )}
    </svg>
  );
}

/* ── CompassStrip — slim live meter under the question card. A dot slides
   along a branch→college track as answers come in. ── */
function CompassStrip({ answers }) {
  const { sum, norm } = scoreState(answers);
  const answered = answers.some(Boolean);
  const pos = ((norm + 1) / 2) * 100;
  const tone = !answered || Math.abs(norm) < 0.1 ? CL.amber : norm > 0 ? CL.green : CL.coral;
  const caption = !answered
    ? "Answer to see your needle move"
    : Math.abs(norm) < 0.1 ? "Sitting near the middle so far"
    : norm > 0 ? "Drifting toward college" : "Drifting toward branch";
  return (
    <div style={{ marginTop: 22, background: CL.cream2, border: `1px solid ${CL.cream3}`, borderRadius: 14, padding: "14px 18px 12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, fontWeight: 800, letterSpacing: "1px", marginBottom: 9 }}>
        <span style={{ color: CL.coralDk }}>BRANCH</span>
        <motion.span key={caption} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: tone, letterSpacing: ".3px", textTransform: "none", fontWeight: 700 }}>{caption}</motion.span>
        <span style={{ color: "#0a8f5b" }}>COLLEGE</span>
      </div>
      <div style={{ position: "relative", height: 6, borderRadius: 50, background: `linear-gradient(90deg, ${CL.coral}, ${CL.amber}, ${CL.green})`, opacity: answered ? 1 : 0.45 }}>
        {/* centre tick */}
        <span style={{ position: "absolute", left: "50%", top: -3, width: 2, height: 12, background: CL.line, transform: "translateX(-50%)" }} />
        <motion.span
          animate={{ left: `${pos}%` }} transition={{ type: "spring", stiffness: 80, damping: 13 }}
          style={{ position: "absolute", top: "50%", transform: "translate(-50%,-50%)", width: 18, height: 18, borderRadius: "50%", background: "#fff", border: `3px solid ${tone}`, boxShadow: CL.shadow }} />
      </div>
    </div>
  );
}

function VerdictCard({ verdict, onReset }) {
  const shown = useCountUp(verdict.strength);
  const toneFg = verdict.side === "college" ? "#0a8f5b" : verdict.side === "branch" ? CL.coralDk : "#b9781a";
  const toneBg = verdict.side === "college" ? CL.greenSoft : verdict.side === "branch" ? CL.coralSoft : CL.amberSoft;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      style={{ background: CL.card, borderRadius: 24, border: `1px solid ${CL.line}`, boxShadow: CL.shadowLg, padding: "34px 32px", maxWidth: 900, margin: "0 auto" }}
    >
      <div className="bvc2-verdict-grid" style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 34, alignItems: "center" }}>
        {/* dial */}
        <div style={{ textAlign: "center" }}>
          <DirectionDial norm={verdict.norm} size={280} />
          <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 800, color: toneFg, background: toneBg, padding: "7px 15px", borderRadius: 50 }}>
            <Scale size={14} />
            {verdict.side === "balanced" ? "Almost an even split" : `${shown}% pull to one side`}
          </div>
        </div>
        {/* verdict copy */}
        <div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 800, letterSpacing: "1.2px", color: toneFg, background: toneBg, padding: "5px 12px", borderRadius: 50, marginBottom: 13 }}>
            <Sparkles size={13} /> {verdict.eyebrow}
          </span>
          <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.9rem", color: CL.ink, letterSpacing: "-0.8px", lineHeight: 1.12, marginBottom: 12 }}>{verdict.title}</h3>
          <p style={{ color: CL.body, fontSize: 14.5, lineHeight: 1.7 }}>{verdict.blurb}</p>
        </div>
      </div>

      <div style={{ height: 1, background: CL.line, margin: "28px 0 24px" }} />

      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em", color: CL.muted, marginBottom: 14 }}>HOW TO FILL YOUR LIST</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 26 }}>
        {verdict.pointers.map((p) => (
          <div key={p} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <CheckCircle2 size={17} color={CL.green} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 13.5, color: CL.ink2, lineHeight: 1.55 }}>{p}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em", color: CL.muted, marginBottom: 14 }}>KEEP GOING</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
        <NextTile to="/branches" icon={Layers} title="Branch Explorer" sub="What each branch actually leads to." primary />
        <NextTile to="/jee-main#college" icon={Crosshair} title="College Predictor" sub="Which campuses your rank can reach." />
        <NextTile to="/for-you" icon={Compass} title="Personal shortlist" sub="A ready-to-file list built for you." />
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
        <button onClick={onReset} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: `1.5px solid ${CL.line}`, borderRadius: 50, padding: "11px 22px", fontFamily: CL.display, fontWeight: 700, fontSize: 13.5, color: CL.ink, cursor: "pointer" }}>
          <RotateCcw size={15} /> Retake — nothing is saved
        </button>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .bvc2-verdict-grid { grid-template-columns: 1fr !important; gap: 22px !important; text-align: left; }
        }
      `}</style>
    </motion.div>
  );
}

function NextTile({ to, icon: Icon, title, sub, primary }) {
  return (
    <Link to={to} style={{
      display: "flex", flexDirection: "column", gap: 9, padding: "16px 17px", borderRadius: 16,
      background: primary ? CL.coral : CL.cream2, border: `1px solid ${primary ? CL.coral : CL.cream3}`,
      color: primary ? "#fff" : CL.ink,
    }}>
      <Icon size={20} color={primary ? "#fff" : CL.coral} />
      <div>
        <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
          {title} <ArrowRight size={14} color={primary ? "#fff" : CL.muted} />
        </div>
        <div style={{ fontSize: 11.5, color: primary ? "rgba(255,255,255,.85)" : CL.muted, marginTop: 3 }}>{sub}</div>
      </div>
    </Link>
  );
}

const LETTERS = ["A", "B", "C", "D"];

export default function BranchVsCollege({ asPage = false }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [done, setDone] = useState(false);

  const choose = (opt) => {
    const next = [...answers];
    next[step] = opt;
    setAnswers(next);
    setTimeout(() => {
      if (step + 1 < QUESTIONS.length) setStep(step + 1);
      else setDone(true);
    }, 220);
  };

  const reset = () => { setAnswers(Array(QUESTIONS.length).fill(null)); setStep(0); setDone(false); };
  const q = QUESTIONS[step];
  const verdict = done ? computeVerdict(answers) : null;
  const progress = ((answers.filter(Boolean).length) / QUESTIONS.length) * 100;

  return (
    <section id="branch-vs-college" style={{ background: CL.cream, padding: asPage ? "104px 0 80px" : "84px 0", scrollMarginTop: 80 }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 38px" }}>
          <span style={clEyebrow}><GitCompareArrows size={13} /> Branch vs College</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.2vw,2.8rem)", color: CL.ink, letterSpacing: "-1.2px", margin: "16px 0 12px", lineHeight: 1.1 }}>
            Your rank will force a trade-off.<br />
            <span style={{ color: CL.coral }}>Know your side</span> before you fill a single choice.
          </h2>
        </div>

        {!done ? (
          <AnimatePresence mode="wait">
            <motion.div key={`q-${step}`}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.26 }}
              style={{ background: CL.card, borderRadius: 24, border: `1px solid ${CL.line}`, boxShadow: CL.shadowLg, padding: "28px 28px 24px", maxWidth: 640, margin: "0 auto" }}
            >
              {/* progress */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                <span style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 13, color: CL.ink, whiteSpace: "nowrap" }}>
                  {step + 1} <span style={{ color: CL.muted, fontWeight: 700 }}>/ {QUESTIONS.length}</span>
                </span>
                <div style={{ flex: 1, height: 6, borderRadius: 50, background: CL.cream2, overflow: "hidden" }}>
                  <motion.div animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 90, damping: 16 }}
                    style={{ height: "100%", borderRadius: 50, background: `linear-gradient(90deg, ${CL.coral}, ${CL.amber})` }} />
                </div>
              </div>

              <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.32rem", color: CL.ink, letterSpacing: "-0.4px", marginBottom: 20, lineHeight: 1.3 }}>{q.q}</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {q.options.map((opt, i) => {
                  const active = answers[step]?.label === opt.label;
                  return (
                    <button key={opt.label} onClick={() => choose(opt)} style={{
                      textAlign: "left", padding: "14px 16px", borderRadius: 14, cursor: "pointer",
                      background: active ? CL.coralSoft : "#fff",
                      border: `1.5px solid ${active ? CL.coral : CL.cream3}`,
                      color: CL.ink, fontSize: 14.5, fontWeight: 600,
                      display: "flex", alignItems: "center", gap: 13,
                      transition: "all .15s",
                    }}
                      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = CL.coral + "77"; e.currentTarget.style.background = CL.cream2; } }}
                      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = CL.cream3; e.currentTarget.style.background = "#fff"; } }}
                    >
                      <span style={{
                        width: 28, height: 28, borderRadius: 9, flexShrink: 0, display: "grid", placeItems: "center",
                        fontFamily: CL.display, fontWeight: 800, fontSize: 12.5,
                        background: active ? CL.coral : CL.cream2, color: active ? "#fff" : CL.muted,
                        border: `1px solid ${active ? CL.coral : CL.cream3}`, transition: "all .15s",
                      }}>{LETTERS[i]}</span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <CompassStrip answers={answers} />

              {step > 0 && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <button onClick={() => setStep(step - 1)} style={{ fontSize: 13, color: CL.muted, fontWeight: 600, cursor: "pointer", background: "none", border: "none" }}>← Previous question</button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <VerdictCard verdict={verdict} onReset={reset} />
        )}
      </div>
    </section>
  );
}
