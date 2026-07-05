/* BranchVsCollege — original College Parichay "AI Trade-off Analyzer".
   Ten in-house scenario questions score toward branch (negative) or college
   (positive); a live compass strip tracks the lean, an animated AI analysis
   interstitial reads the answers, and the verdict renders as a semicircular
   dial with pointers and next steps. Used both as a home section and on
   /branch-vs-college. Design & copy are original to College Parichay. */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCompareArrows, ArrowRight, RotateCcw, Sparkles,
  Layers, Crosshair, Compass, CheckCircle2, Scale, Check, Cpu,
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
  {
    q: "It's midnight and you're scrolling placement reports. What are you really checking?",
    options: [
      { label: "The highest package the campus posted this year", score: 2 },
      { label: "Whether my specific branch actually places well there", score: -2 },
      { label: "How many companies visited overall", score: 1 },
      { label: "Which roles match the field I care about", score: -1 },
    ],
  },
  {
    q: "A relative asks what you study. The answer you'd be proud to give is…",
    options: [
      { label: "The name of a college everyone recognises", score: 2 },
      { label: "A field I can explain with genuine excitement", score: -2 },
      { label: "A course with obvious job security", score: 1 },
      { label: "The exact specialisation I always wanted", score: -1 },
    ],
  },
  {
    q: "If you could lock in just ONE thing before counselling, it would be…",
    options: [
      { label: "A seat at the highest-ranked institute I can reach", score: 2 },
      { label: "My chosen branch, wherever it takes me", score: -2 },
      { label: "The strongest placement cell available", score: 1 },
      { label: "A curriculum built around my interests", score: -1 },
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

/* ── AiAnalyzing — animated "AI is reading your answers" interstitial.
   Pulsing orb + rotating conic ring + a checklist of analysis steps that
   tick off in sequence, then hands over to the verdict. ── */
const AI_STEPS = [
  "Reading all 10 of your answers",
  "Weighing campus pull against subject pull",
  "Scoring your risk tolerance & flexibility",
  "Modelling your JoSAA choice priorities",
  "Locking in the side you should protect",
];

function AiAnalyzing({ onDone }) {
  const [i, setI] = useState(0);
  const per = 460;
  useEffect(() => {
    const iv = setInterval(() => setI((x) => (x < AI_STEPS.length - 1 ? x + 1 : x)), per);
    const end = setTimeout(onDone, per * AI_STEPS.length + 500);
    return () => { clearInterval(iv); clearTimeout(end); };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}
      style={{ background: CL.card, borderRadius: 24, border: `1px solid ${CL.line}`, boxShadow: CL.shadowLg, padding: "40px 30px 34px", maxWidth: 560, margin: "0 auto", textAlign: "center", overflow: "hidden", position: "relative" }}
    >
      {/* AI orb */}
      <div style={{ position: "relative", width: 108, height: 108, margin: "0 auto 24px" }}>
        {[0, 1].map((k) => (
          <motion.span key={k}
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: k * 0.9, ease: "easeOut" }}
            style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${CL.coral}` }} />
        ))}
        <motion.div
          animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3.2, ease: "linear" }}
          style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(${CL.coral}, ${CL.amber}, ${CL.green}, ${CL.coral})`, padding: 4 }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: CL.card, display: "grid", placeItems: "center" }}>
            <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}>
              <Cpu size={34} color={CL.coral} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 800, letterSpacing: "1.2px", color: CL.coralDk, background: CL.coralSoft, padding: "5px 13px", borderRadius: 50, marginBottom: 8 }}>
        <Sparkles size={12} /> AI PRIORITY ANALYSIS
      </div>
      <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.4rem", color: CL.ink, letterSpacing: "-0.5px", margin: "0 0 22px" }}>
        Reading between your answers…
      </h3>

      {/* analysis checklist */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 380, margin: "0 auto 22px", textAlign: "left" }}>
        {AI_STEPS.map((s, idx) => {
          const doneStep = idx < i, activeStep = idx === i;
          return (
            <motion.div key={s}
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: doneStep || activeStep ? 1 : 0.35, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 13.5, fontWeight: 600, color: doneStep ? CL.ink2 : activeStep ? CL.ink : CL.muted }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center", background: doneStep ? CL.green : activeStep ? CL.coralSoft : CL.cream2, border: `1px solid ${doneStep ? CL.green : activeStep ? CL.coral : CL.cream3}`, transition: "all .3s" }}>
                {doneStep
                  ? <Check size={13} color="#fff" strokeWidth={3} />
                  : activeStep
                    ? <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }} style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${CL.coral}`, borderTopColor: "transparent" }} />
                    : <span style={{ width: 5, height: 5, borderRadius: "50%", background: CL.muted }} />}
              </span>
              {s}
            </motion.div>
          );
        })}
      </div>

      {/* sweep bar */}
      <div style={{ height: 6, borderRadius: 50, background: CL.cream2, overflow: "hidden", maxWidth: 380, margin: "0 auto" }}>
        <motion.div
          initial={{ width: "0%" }} animate={{ width: "100%" }}
          transition={{ duration: (per * AI_STEPS.length + 300) / 1000, ease: "easeInOut" }}
          style={{ height: "100%", borderRadius: 50, background: `linear-gradient(90deg, ${CL.coral}, ${CL.amber}, ${CL.green})` }} />
      </div>
    </motion.div>
  );
}

const LETTERS = ["A", "B", "C", "D"];

/* question slide transition (direction-aware) */
const qVariants = {
  enter: (dir) => ({ opacity: 0, x: dir >= 0 ? 70 : -70, scale: 0.98 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir) => ({ opacity: 0, x: dir >= 0 ? -70 : 70, scale: 0.98 }),
};
const optContainer = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } } };
const optItem = {
  hidden: { opacity: 0, x: 18 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 280, damping: 24 } },
};

export default function BranchVsCollege({ asPage = false }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [phase, setPhase] = useState("quiz"); // quiz | analyzing | result

  const choose = (opt) => {
    const next = [...answers];
    next[step] = opt;
    setAnswers(next);
    setTimeout(() => {
      if (step + 1 < QUESTIONS.length) { setDir(1); setStep(step + 1); }
      else setPhase("analyzing");
    }, 240);
  };

  const goPrev = () => { if (step > 0) { setDir(-1); setStep(step - 1); } };
  const reset = () => { setAnswers(Array(QUESTIONS.length).fill(null)); setStep(0); setDir(1); setPhase("quiz"); };
  const q = QUESTIONS[step];
  const verdict = phase === "result" ? computeVerdict(answers) : null;
  const progress = (answers.filter(Boolean).length / QUESTIONS.length) * 100;

  return (
    <section id="branch-vs-college" style={{ background: CL.cream, padding: asPage ? "104px 0 80px" : "84px 0", scrollMarginTop: 80 }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 38px" }}>
          <span style={clEyebrow}><GitCompareArrows size={13} /> AI Trade-off Analyzer</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.2vw,2.8rem)", color: CL.ink, letterSpacing: "-1.2px", margin: "16px 0 12px", lineHeight: 1.1 }}>
            Your rank will force a trade-off.<br />
            <span style={{ color: CL.coral }}>Know your side</span> before you fill a single choice.
          </h2>
          {phase === "quiz" && (
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ color: CL.body, fontSize: "1.02rem", lineHeight: 1.65, maxWidth: 560, margin: "0 auto" }}>
              10 quick scenarios · no wrong answers — our engine reads your instincts and tells you which side to protect in your JoSAA list.
            </motion.p>
          )}
        </div>

        <AnimatePresence mode="wait" custom={dir}>
          {phase === "analyzing" ? (
            <AiAnalyzing key="analyzing" onDone={() => setPhase("result")} />
          ) : phase === "result" ? (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <VerdictCard verdict={verdict} onReset={reset} />
            </motion.div>
          ) : (
            <motion.div key={`q-${step}`}
              custom={dir} variants={qVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: CL.card, borderRadius: 24, border: `1px solid ${CL.line}`, boxShadow: CL.shadowLg, padding: "26px 28px 24px", maxWidth: 640, margin: "0 auto", position: "relative", overflow: "hidden" }}
            >
              {/* animated gradient accent */}
              <motion.span aria-hidden
                animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                transition={{ repeat: Infinity, duration: 3.4, ease: "linear" }}
                style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${CL.coral}, ${CL.amber}, ${CL.green}, ${CL.coral})`, backgroundSize: "200% 100%" }} />

              {/* AI badge + step pips */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, letterSpacing: ".08em", color: CL.coralDk, background: CL.coralSoft, padding: "4px 10px", borderRadius: 50, flexShrink: 0 }}>
                  <motion.span animate={{ scale: [1, 1.35, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                    style={{ width: 6, height: 6, borderRadius: "50%", background: CL.coral, display: "inline-block" }} />
                  AI ANALYZING
                </span>
                <span style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 13, color: CL.ink, whiteSpace: "nowrap" }}>
                  {step + 1} <span style={{ color: CL.muted, fontWeight: 700 }}>/ {QUESTIONS.length}</span>
                </span>
                {/* per-question pips */}
                <div style={{ flex: 1, display: "flex", gap: 4, minWidth: 120 }}>
                  {QUESTIONS.map((_, i) => {
                    const done = !!answers[i], current = i === step;
                    return (
                      <div key={i} style={{ flex: 1, height: 6, borderRadius: 50, background: CL.cream2, overflow: "hidden" }}>
                        <motion.div initial={false} animate={{ width: done || current ? "100%" : "0%" }} transition={{ duration: 0.4, ease: "easeOut" }}
                          style={{ height: "100%", borderRadius: 50, background: done ? `linear-gradient(90deg, ${CL.coral}, ${CL.amber})` : CL.coralSoft }} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.32rem", color: CL.ink, letterSpacing: "-0.4px", marginBottom: 6, lineHeight: 1.3 }}>{q.q}</h3>
              <p style={{ fontSize: 12.5, color: CL.muted, marginBottom: 18 }}>Pick whatever feels most true — there's no wrong answer.</p>

              <motion.div variants={optContainer} initial="hidden" animate="show" style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {q.options.map((opt, i) => {
                  const active = answers[step]?.label === opt.label;
                  return (
                    <motion.button key={opt.label} variants={optItem} onClick={() => choose(opt)}
                      whileHover={{ scale: active ? 1 : 1.015, x: active ? 0 : 3 }} whileTap={{ scale: 0.985 }}
                      style={{
                        textAlign: "left", padding: "14px 16px", borderRadius: 14, cursor: "pointer",
                        background: active ? CL.coralSoft : "#fff",
                        border: `1.5px solid ${active ? CL.coral : CL.cream3}`,
                        color: CL.ink, fontSize: 14.5, fontWeight: 600,
                        display: "flex", alignItems: "center", gap: 13,
                        boxShadow: active ? `0 6px 20px ${CL.coral}22` : "none",
                        transition: "background .15s, border-color .15s, box-shadow .2s",
                      }}
                      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = CL.coral + "77"; e.currentTarget.style.background = CL.cream2; } }}
                      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = CL.cream3; e.currentTarget.style.background = "#fff"; } }}
                    >
                      <span style={{
                        width: 28, height: 28, borderRadius: 9, flexShrink: 0, display: "grid", placeItems: "center",
                        fontFamily: CL.display, fontWeight: 800, fontSize: 12.5,
                        background: active ? CL.coral : CL.cream2, color: active ? "#fff" : CL.muted,
                        border: `1px solid ${active ? CL.coral : CL.cream3}`, transition: "all .15s",
                      }}>
                        {active ? <Check size={15} strokeWidth={3} /> : LETTERS[i]}
                      </span>
                      <span style={{ flex: 1 }}>{opt.label}</span>
                      <ArrowRight size={16} color={active ? CL.coral : CL.muted} style={{ flexShrink: 0, opacity: active ? 1 : 0.28, transition: "opacity .2s" }} />
                    </motion.button>
                  );
                })}
              </motion.div>

              <CompassStrip answers={answers} />

              {step > 0 && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <button onClick={goPrev} style={{ fontSize: 13, color: CL.muted, fontWeight: 600, cursor: "pointer", background: "none", border: "none" }}>← Previous question</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
