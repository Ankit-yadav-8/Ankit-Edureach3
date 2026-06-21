/* BranchVsCollege — campusloom-style 6-question assessment that decides
   whether the institute (college-first) or the subject (branch-first)
   should win when the two conflict in JoSAA choice filling. Renders an
   animated result card with a confidence match, the reasoning, and what
   to do next. Used both as a home section and on /branch-vs-college. */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCompareArrows, ArrowRight, RotateCcw, Sparkles, ShieldCheck,
  Layers, Crosshair, Compass, CheckCircle2,
} from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

/* each option leans "college" or "branch" with a weight */
const QUESTIONS = [
  {
    q: "When you picture life after the degree, what excites you more?",
    options: [
      { label: "The brand, network and alumni of a top institute", lean: "college", w: 2 },
      { label: "Working deeply in a subject I genuinely love", lean: "branch", w: 2 },
      { label: "The placement pipeline and recruiter footfall", lean: "college", w: 2 },
      { label: "Mastering an in-demand, future-proof skill", lean: "branch", w: 2 },
      { label: "A vibrant campus, fests and peer group", lean: "college", w: 1 },
      { label: "A bit of both — I'm still figuring it out", lean: "college", w: 1 },
    ],
  },
  {
    q: "Forced to choose at the JoSAA screen, you'd pick…",
    options: [
      { label: "A top IIT/NIT with an average branch", lean: "college", w: 2 },
      { label: "A mid-tier college with my dream branch", lean: "branch", w: 2 },
      { label: "A top IIT/NIT with a decent (not dream) branch", lean: "college", w: 2 },
      { label: "A great branch even at a lesser-known college", lean: "branch", w: 2 },
      { label: "Whichever has better placements overall", lean: "college", w: 1 },
      { label: "The one my dream branch is in, location aside", lean: "branch", w: 1 },
    ],
  },
  {
    q: "How clear are you about what you want to study?",
    options: [
      { label: "Crystal clear — I know my exact branch", lean: "branch", w: 2 },
      { label: "Broadly know the field, not the exact branch", lean: "branch", w: 1 },
      { label: "Still exploring — I want options open", lean: "college", w: 2 },
      { label: "Two or three branches in mind, not decided", lean: "branch", w: 1 },
      { label: "No idea yet — the college matters more", lean: "college", w: 2 },
      { label: "I'll figure it out once I'm on campus", lean: "college", w: 1 },
    ],
  },
  {
    q: "For your first job, what matters most?",
    options: [
      { label: "Brand recognition on my resume", lean: "college", w: 2 },
      { label: "Specific, in-demand domain skills", lean: "branch", w: 2 },
      { label: "Strong on-campus placement pipeline", lean: "college", w: 1 },
      { label: "Doing work I'm genuinely interested in", lean: "branch", w: 2 },
      { label: "The salary and the company name", lean: "college", w: 2 },
      { label: "Flexibility to switch roles later", lean: "branch", w: 1 },
    ],
  },
  {
    q: "How much do peers and campus environment matter to you?",
    options: [
      { label: "A lot — I grow with ambitious people around me", lean: "college", w: 2 },
      { label: "Somewhat — but I can self-drive anywhere", lean: "branch", w: 1 },
      { label: "Not much — the subject is what I care about", lean: "branch", w: 2 },
      { label: "The network and seniors are a big draw", lean: "college", w: 2 },
      { label: "I value labs and faculty over peers", lean: "branch", w: 1 },
      { label: "Fests, clubs and campus life matter to me", lean: "college", w: 1 },
    ],
  },
  {
    q: "Your long-term plan after graduation?",
    options: [
      { label: "Keep options open — MS, startup, or pivot", lean: "college", w: 2 },
      { label: "Build deep expertise and stay in my domain", lean: "branch", w: 2 },
      { label: "Crack a great first job, then decide", lean: "college", w: 1 },
      { label: "Research / higher studies in my subject", lean: "branch", w: 2 },
      { label: "Civil services / management / non-core", lean: "college", w: 2 },
      { label: "Start up around something I'm passionate about", lean: "branch", w: 1 },
    ],
  },
];

const FACTORS = ["Passion", "Learning Fit", "Holistic Growth", "Alternatives", "Career Outcomes"];

function computeResult(answers) {
  let college = 0, branch = 0;
  answers.forEach((a) => {
    if (!a) return;
    if (a.lean === "college") college += a.w; else branch += a.w;
  });
  const total = college + branch || 1;
  const collegePct = Math.round((college / total) * 100);
  const isCollege = college >= branch;
  const match = Math.max(collegePct, 100 - collegePct);
  return {
    isCollege,
    match,
    title: isCollege ? "You're college-first." : "You're branch-first.",
    eyebrow: isCollege ? "COLLEGE FIRST" : "BRANCH FIRST",
    blurb: isCollege
      ? "The institute's brand, network and environment matter more to you right now — and that's a completely valid call. Use the framework below to find which college fits your life best."
      : "The subject you study matters more to you than the campus badge — a clear, focused signal. Use the catalog below to pin down the exact branch worth fighting for.",
    reasons: isCollege
      ? [
          "You value flexibility and exploration over locking into one branch.",
          "Your career bet leans on brand, peer group and placement pipelines.",
          "You're comfortable shaping your specialisation once you're inside.",
        ]
      : [
          "You already know the subject you want to go deep in.",
          "Domain skills and fit matter to you more than the campus name.",
          "You're self-driven enough to thrive regardless of college tier.",
        ],
  };
}

function StepDots({ total, current }) {
  return (
    <div style={{ display: "flex", gap: 7, justifyContent: "center", marginBottom: 22 }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{ width: i === current ? 26 : 8, height: 8, borderRadius: 50, background: i <= current ? CL.coral : "#e7ddd2", transition: "all .3s" }} />
      ))}
    </div>
  );
}

const FACTOR_COLORS = [CL.coral, CL.green, CL.amber, CL.blue, CL.violet];

/* Eased count-up for the live numbers — animates smoothly between values. */
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

/* A small head-to-head tower whose height grows with that side's points,
   with a glossy fill, a repeating shine sweep and a soft glow. */
function Tower({ pct, color, soft, label, points, big }) {
  const shown = useCountUp(pct);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
      <div style={{ position: "relative", width: "100%", maxWidth: big ? 92 : 78, height: big ? 150 : 124, borderRadius: 16, background: soft, overflow: "hidden", display: "flex", alignItems: "flex-end", border: `1px solid ${color}33` }}>
        <motion.div
          animate={{ height: `${Math.max(8, pct)}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 14 }}
          style={{ position: "relative", width: "100%", background: `linear-gradient(180deg, ${color}, ${color}cc)`, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 8, borderTopLeftRadius: 11, borderTopRightRadius: 11, boxShadow: `0 -3px 22px ${color}66` }}
        >
          <span style={{ color: "#fff", fontFamily: CL.display, fontWeight: 800, fontSize: big ? 16 : 14, fontStyle: "italic", position: "relative", zIndex: 1 }}>{shown}%</span>
          {/* glossy shine sweeping up the bar */}
          <motion.span aria-hidden
            initial={{ y: "130%" }} animate={{ y: ["130%", "-130%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.1 }}
            style={{ position: "absolute", left: 0, right: 0, height: "45%", background: "linear-gradient(180deg, transparent, rgba(255,255,255,.42), transparent)", pointerEvents: "none" }} />
        </motion.div>
      </div>
      <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: big ? 15 : 13.5, color }}>{label}</div>
      <motion.span key={points} initial={{ scale: 0.78, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 320, damping: 18 }}
        style={{ fontSize: 11, fontWeight: 700, color, background: soft, border: `1px solid ${color}33`, padding: "3px 11px", borderRadius: 50 }}>{points} pts</motion.span>
    </div>
  );
}

/* Animated "balance meter" — an original head-to-head design (twin towers +
   a sliding centre marker) that reacts live as answers come in.
   `tilt` is -1 (branch) … +1 (college). */
export function BalanceScale({ tilt = 0, tally = { c: 0, b: 0 }, step = 0, total = 6, big = false, showMeta = true }) {
  const sum = tally.c + tally.b;
  const collegePct = sum ? Math.round((tally.c / sum) * 100) : 50;
  const branchPct = 100 - collegePct;
  const even = tally.c === tally.b;
  const leadCollege = tally.c > tally.b;
  const leadColor = !sum || even ? CL.muted : leadCollege ? CL.green : CL.coral;
  const leadPct = Math.max(collegePct, branchPct);
  const spring = { type: "spring", stiffness: 90, damping: 14 };
  const shownLead = useCountUp(leadPct);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative", overflow: "hidden",
        background: CL.card, borderRadius: 24, border: `1px solid ${CL.line}`,
        boxShadow: CL.shadow, padding: big ? "30px 28px 26px" : "26px 24px 22px",
        display: "flex", flexDirection: "column", height: "100%",
      }}>
      {/* soft animated glow that tints toward the leading side */}
      <motion.div aria-hidden
        animate={{ opacity: [0.5, 0.85, 0.5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: -60, right: -40, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${leadColor}1f, transparent 70%)`, pointerEvents: "none" }} />

      {showMeta && (
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", color: CL.muted, textTransform: "uppercase", textAlign: "center", position: "relative" }}>
          Your leaning so far
        </div>
      )}

      {/* live readout */}
      <div style={{ textAlign: "center", margin: big ? "12px 0 16px" : "8px 0 14px", position: "relative" }}>
        <motion.div animate={{ color: leadColor }} transition={{ duration: 0.4 }}
          style={{ fontFamily: CL.display, fontWeight: 800, fontSize: big ? 44 : 38, color: leadColor, lineHeight: 1, fontStyle: "italic" }}>
          {sum ? `${shownLead}%` : "50 / 50"}
        </motion.div>
        <motion.div key={`${even}-${leadCollege}-${!!sum}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 12.5, fontWeight: 700, color: leadColor, marginTop: 6 }}>
          {!sum ? "Answer to see it tilt live" : even ? "Evenly balanced — keep going" : leadCollege ? "Leaning College" : "Leaning Branch"}
        </motion.div>
      </div>

      {/* twin towers */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: big ? 22 : 16, justifyContent: "center", position: "relative" }}>
        <Tower pct={branchPct} color={CL.coral} soft={CL.coralSoft} label="Branch" points={tally.b} big={big} />
        <span style={{ fontFamily: CL.display, fontWeight: 800, fontStyle: "italic", fontSize: big ? 14 : 12, color: CL.muted, paddingBottom: big ? 64 : 52 }}>vs</span>
        <Tower pct={collegePct} color={CL.green} soft={CL.greenSoft} label="College" points={tally.c} big={big} />
      </div>

      {/* sliding balance track with a moving sheen */}
      <div style={{ position: "relative", height: 8, borderRadius: 50, background: `linear-gradient(90deg, ${CL.coral}, ${CL.amber}, ${CL.green})`, margin: big ? "22px 4px 4px" : "18px 4px 4px", overflow: "visible" }}>
        {/* pulsing halo behind the marker */}
        <motion.span
          animate={{ left: `${branchPct}%` }} transition={spring}
          style={{ position: "absolute", top: "50%", transform: "translate(-50%,-50%)", width: big ? 24 : 20, height: big ? 24 : 20 }}
        >
          <motion.span aria-hidden
            animate={{ scale: [1, 2.1, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            style={{ position: "absolute", inset: 0, borderRadius: "50%", background: leadColor, pointerEvents: "none" }} />
          <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#fff", boxShadow: CL.shadow, border: `2.5px solid ${leadColor}`, display: "grid", placeItems: "center" }}>
            <GitCompareArrows size={big ? 12 : 10} color={leadColor} />
          </span>
        </motion.span>
      </div>

      {showMeta && (
        <>
          <div style={{ height: 1, background: CL.line, margin: "16px 0 14px" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9, justifyContent: "center" }}>
            {FACTORS.map((f, i) => (
              <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: CL.body, fontWeight: 600 }}>
                <motion.span
                  animate={{ scale: [1, 1.45, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 }}
                  style={{ width: 8, height: 8, borderRadius: "50%", background: FACTOR_COLORS[i % FACTOR_COLORS.length] }} /> {f}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 11.5, color: CL.muted, textAlign: "center" }}>
            Question {Math.min(step + 1, total)} of {total} · live, private
          </div>
        </>
      )}
    </motion.div>
  );
}

function ResultCard({ result, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      style={{ background: CL.card, borderRadius: 24, border: `1px solid ${CL.line}`, boxShadow: CL.shadowLg, padding: "32px 30px", maxWidth: 940, margin: "0 auto" }}
    >
      {/* top: verdict + orbit */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ flex: "1 1 340px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 800, letterSpacing: "1.2px", color: CL.violet, background: "#efeafc", padding: "5px 12px", borderRadius: 50, marginBottom: 14 }}>
            <ShieldCheck size={13} /> {result.eyebrow}
          </span>
          <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "2.1rem", color: CL.ink, letterSpacing: "-1px", marginBottom: 14, lineHeight: 1.08 }}>{result.title}</h3>
          <p style={{ color: CL.body, fontSize: 14.5, lineHeight: 1.7, marginBottom: 16, maxWidth: 460 }}>{result.blurb}</p>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 800, color: "#0a8f5b", background: CL.greenSoft, padding: "8px 16px", borderRadius: 50 }}>
            <Sparkles size={14} /> High confidence · {result.match}% match
          </span>
        </div>

        {/* orbit visual */}
        <div style={{ position: "relative", width: 210, height: 210, flexShrink: 0, margin: "0 auto" }}>
          {[170, 120, 72].map((d, i) => (
            <span key={d} style={{ position: "absolute", top: "50%", left: "50%", width: d, height: d, transform: "translate(-50%,-50%)", borderRadius: "50%", border: `1px dashed ${CL.cream3}` }} />
          ))}
          <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 60, height: 60, borderRadius: 16, background: CL.coral, display: "grid", placeItems: "center", boxShadow: "0 10px 30px rgba(255, 105, 61,.4)" }}>
            <GitCompareArrows size={26} color="#fff" />
          </span>
          {FACTORS.map((f, i) => {
            const ang = (i / FACTORS.length) * Math.PI * 2 - Math.PI / 2;
            const r = 85;
            const cols = [CL.coral, CL.green, CL.amber, CL.violet, CL.blue];
            return (
              <span key={f} style={{ position: "absolute", top: `calc(50% + ${Math.sin(ang) * r}px)`, left: `calc(50% + ${Math.cos(ang) * r}px)`, transform: "translate(-50%,-50%)", width: 12, height: 12, borderRadius: "50%", background: cols[i % cols.length], boxShadow: `0 0 0 4px ${cols[i % cols.length]}22` }} />
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
        {FACTORS.map((f, i) => {
          const cols = [CL.coral, CL.green, CL.amber, CL.violet, CL.blue];
          return (
            <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, color: CL.body, fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: cols[i % cols.length] }} /> {f}
            </span>
          );
        })}
      </div>

      <div style={{ height: 1, background: CL.line, margin: "26px 0" }} />

      {/* why + next */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 26 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em", color: CL.coralDk, marginBottom: 14 }}>WHY YOU GOT THIS RESULT</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {result.reasons.map((r) => (
              <div key={r} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <CheckCircle2 size={17} color={CL.green} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13.5, color: CL.ink2, lineHeight: 1.55 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em", color: CL.coralDk, marginBottom: 14 }}>WHAT'S NEXT</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <NextCard to="/branches" icon={Layers} title="Open the Branch Explorer" sub="See what each branch really gives you." primary />
            <NextCard to="/jee-main#college" icon={Crosshair} title="Try the College Predictor" sub="See which colleges your rank can get." />
            <NextCard to="/for-you" icon={Compass} title="Get a personalised shortlist" sub="Answer a few more and get your list." />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
        <button onClick={onReset} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: `1.5px solid ${CL.line}`, borderRadius: 50, padding: "11px 22px", fontFamily: CL.display, fontWeight: 700, fontSize: 13.5, color: CL.ink, cursor: "pointer" }}>
          <RotateCcw size={15} /> Start over · your answers are private
        </button>
      </div>
    </motion.div>
  );
}

function NextCard({ to, icon: Icon, title, sub, primary }) {
  return (
    <Link to={to} style={{
      display: "flex", alignItems: "center", gap: 13, padding: "13px 16px", borderRadius: 14,
      background: primary ? CL.coral : CL.cream2, border: `1px solid ${primary ? CL.coral : CL.cream3}`,
      color: primary ? "#fff" : CL.ink,
    }}>
      <Icon size={20} color={primary ? "#fff" : CL.coral} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 14 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: primary ? "rgba(255,255,255,.85)" : CL.muted }}>{sub}</div>
      </div>
      <ArrowRight size={16} color={primary ? "#fff" : CL.muted} />
    </Link>
  );
}

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
    }, 180);
  };

  const reset = () => { setAnswers(Array(QUESTIONS.length).fill(null)); setStep(0); setDone(false); };
  const q = QUESTIONS[step];
  const result = done ? computeResult(answers) : null;

  /* running lean for the balance scale: +1 college … -1 branch */
  const tally = answers.reduce((acc, a) => {
    if (a) { if (a.lean === "college") acc.c += a.w; else acc.b += a.w; }
    return acc;
  }, { c: 0, b: 0 });
  const tilt = (tally.c + tally.b) ? (tally.c - tally.b) / (tally.c + tally.b) : 0;

  return (
    <section id="branch-vs-college" style={{ background: asPage ? CL.cream : CL.cream, padding: asPage ? "104px 0 80px" : "84px 0", scrollMarginTop: 80 }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 40px" }}>
          <span style={clEyebrow}><GitCompareArrows size={13} /> Branch vs College</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.2vw,2.8rem)", color: CL.ink, letterSpacing: "-1.2px", margin: "16px 0 12px", lineHeight: 1.1 }}>
            Should the <span style={{ color: CL.coral }}>college</span> or the <span style={{ color: CL.green }}>branch</span> win?
          </h2>
          <p style={{ color: CL.body, fontSize: "1.04rem", lineHeight: 1.7 }}>
            Six quick questions decide what should top your choice list when the two collide. No login, no data stored.
          </p>
        </div>

        {!done ? (
          <div className="bvc-quiz-grid">
            <div className="bvc-scale-col">
              <BalanceScale tilt={tilt} tally={tally} step={step} total={QUESTIONS.length} />
            </div>
            <AnimatePresence mode="wait">
            <motion.div key={`q-${step}`}
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28 }}
              style={{ background: CL.card, borderRadius: 24, border: `1px solid ${CL.line}`, boxShadow: CL.shadowLg, padding: "30px 28px" }}
            >
              <StepDots total={QUESTIONS.length} current={step} />
              <div style={{ fontSize: 12, fontWeight: 700, color: CL.muted, textAlign: "center", marginBottom: 8 }}>Question {step + 1} of {QUESTIONS.length}</div>
              <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.4rem", color: CL.ink, textAlign: "center", letterSpacing: "-0.4px", marginBottom: 24, lineHeight: 1.25 }}>{q.q}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {q.options.map((opt) => {
                  const active = answers[step]?.label === opt.label;
                  return (
                    <button key={opt.label} onClick={() => choose(opt)} style={{
                      textAlign: "left", padding: "16px 18px", borderRadius: 14, cursor: "pointer",
                      background: active ? CL.coralSoft : CL.cream2,
                      border: `1.5px solid ${active ? CL.coral : CL.cream3}`,
                      color: CL.ink, fontSize: 14.5, fontWeight: 600,
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                      transition: "all .15s",
                    }}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = CL.coral + "66"; }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = CL.cream3; }}
                    >
                      {opt.label}
                      <ArrowRight size={16} color={CL.coral} style={{ flexShrink: 0 }} />
                    </button>
                  );
                })}
              </div>
              {step > 0 && (
                <div style={{ textAlign: "center", marginTop: 18 }}>
                  <button onClick={() => setStep(step - 1)} style={{ fontSize: 13, color: CL.muted, fontWeight: 600, cursor: "pointer" }}>← Back</button>
                </div>
              )}
            </motion.div>
            </AnimatePresence>
          </div>
          ) : (
            <ResultCard result={result} onReset={reset} />
          )}
      </div>
    </section>
  );
}
