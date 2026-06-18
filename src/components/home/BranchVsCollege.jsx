/* BranchVsCollege — campusloom-style 6-question assessment that decides
   whether the institute (college-first) or the subject (branch-first)
   should win when the two conflict in JoSAA choice filling. Renders an
   animated result card with a confidence match, the reasoning, and what
   to do next. Used both as a home section and on /branch-vs-college. */
import { useState } from "react";
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
      { label: "Whichever has better placements overall", lean: "college", w: 1 },
    ],
  },
  {
    q: "How clear are you about what you want to study?",
    options: [
      { label: "Crystal clear — I know my exact branch", lean: "branch", w: 2 },
      { label: "Broadly know the field, not the exact branch", lean: "branch", w: 1 },
      { label: "Still exploring — I want options open", lean: "college", w: 2 },
    ],
  },
  {
    q: "For your first job, what matters most?",
    options: [
      { label: "Brand recognition on my resume", lean: "college", w: 2 },
      { label: "Specific, in-demand domain skills", lean: "branch", w: 2 },
      { label: "Strong on-campus placement pipeline", lean: "college", w: 1 },
    ],
  },
  {
    q: "How much do peers and campus environment matter to you?",
    options: [
      { label: "A lot — I grow with ambitious people around me", lean: "college", w: 2 },
      { label: "Somewhat — but I can self-drive anywhere", lean: "branch", w: 1 },
      { label: "Not much — the subject is what I care about", lean: "branch", w: 2 },
    ],
  },
  {
    q: "Your long-term plan after graduation?",
    options: [
      { label: "Keep options open — MS, startup, or pivot", lean: "college", w: 2 },
      { label: "Build deep expertise and stay in my domain", lean: "branch", w: 2 },
      { label: "Crack a great first job, then decide", lean: "college", w: 1 },
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

/* Weights stacked inside a pan — a little dot per "point" leaning that way. */
function PanWeights({ count, cx, cy, color }) {
  const n = Math.min(count, 8);
  return Array.from({ length: n }).map((_, i) => {
    const row = Math.floor(i / 4);
    const inRow = Math.min(4, n - row * 4);
    const x = cx - (inRow - 1) * 5 + (i % 4) * 10;
    const y = cy - 4 - row * 8;
    return (
      <motion.circle
        key={i} cx={x} cy={y} r="3.4" fill={color}
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 18, delay: i * 0.03 }}
      />
    );
  });
}

/* Animated weighing-machine balance — tilts toward Branch or College and the
   pans fill with weights as answers come in. `tilt` is -1 (branch) … +1 (college). */
export function BalanceScale({ tilt = 0, tally = { c: 0, b: 0 }, step = 0, total = 6, big = false, showMeta = true }) {
  const angle = Math.max(-14, Math.min(14, tilt * 14)); // degrees, + = college (right) down
  const dyL = Math.round(-Math.sin((angle * Math.PI) / 180) * 95); // left pan vertical shift
  const dyR = -dyL;
  return (
    <div style={{
      background: CL.card, borderRadius: 24, border: `1px solid ${CL.line}`,
      boxShadow: CL.shadow, padding: big ? "30px 28px 26px" : "26px 24px 22px",
      display: "flex", flexDirection: "column", height: "100%",
    }}>
      {showMeta && (
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", color: CL.muted, textTransform: "uppercase", textAlign: "center" }}>
          {tally.c + tally.b ? "Your leaning so far" : "Watch the scale decide"}
        </div>
      )}

      <div style={{ flex: 1, display: "grid", placeItems: "center", minHeight: big ? 260 : 200 }}>
        <svg viewBox="0 0 300 210" width="100%" style={{ maxWidth: big ? 420 : 320 }}>
          {/* base + stand */}
          <ellipse cx="150" cy="190" rx="56" ry="9" fill="rgba(33,29,46,.08)" />
          <rect x="118" y="182" width="64" height="9" rx="4" fill={CL.ink} />
          <rect x="146" y="58" width="8" height="128" rx="4" fill="#8a6b5e" />
          <motion.circle cx="150" cy="58" r="8" fill={CL.coral}
            animate={{ opacity: [1, 0.5, 1], scale: [1, 1.18, 1] }}
            transition={{ duration: 2, repeat: Infinity }} />

          {/* beam (rotates around the pivot) */}
          <motion.g
            animate={{ rotate: angle }}
            transition={{ type: "spring", stiffness: 80, damping: 11 }}
            style={{ transformOrigin: "150px 58px" }}
          >
            <rect x="42" y="54" width="216" height="8" rx="4" fill="#6f4f43" />
            <circle cx="60" cy="58" r="4" fill="#6f4f43" />
            <circle cx="240" cy="58" r="4" fill="#6f4f43" />
          </motion.g>

          {/* left pan (Branch) — hangs from the beam end, shifts vertically with tilt */}
          <motion.g animate={{ y: dyL }} transition={{ type: "spring", stiffness: 80, damping: 11 }}>
            <line x1="60" y1="58" x2="40" y2="96" stroke="#b3a399" strokeWidth="1.6" />
            <line x1="60" y1="58" x2="80" y2="96" stroke="#b3a399" strokeWidth="1.6" />
            <path d="M34 96 A26 15 0 0 0 86 96 Z" fill={CL.coralSoft} stroke={CL.coral} strokeWidth="2" />
            <PanWeights count={tally.b} cx={60} cy={96} color={CL.coral} />
          </motion.g>

          {/* right pan (College) */}
          <motion.g animate={{ y: dyR }} transition={{ type: "spring", stiffness: 80, damping: 11 }}>
            <line x1="240" y1="58" x2="220" y2="96" stroke="#b3a399" strokeWidth="1.6" />
            <line x1="240" y1="58" x2="260" y2="96" stroke="#b3a399" strokeWidth="1.6" />
            <path d="M214 96 A26 15 0 0 0 266 96 Z" fill={CL.greenSoft} stroke={CL.green} strokeWidth="2" />
            <PanWeights count={tally.c} cx={240} cy={96} color={CL.green} />
          </motion.g>
        </svg>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px", marginTop: 2 }}>
        <span style={{ fontFamily: CL.display, fontWeight: 800, fontSize: big ? 15 : 13.5, color: CL.coral }}>Branch</span>
        <span style={{ fontFamily: CL.display, fontWeight: 800, fontSize: big ? 15 : 13.5, color: CL.green }}>College</span>
      </div>

      {showMeta && (
        <>
          <div style={{ height: 1, background: CL.line, margin: "16px 0 14px" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9, justifyContent: "center" }}>
            {FACTORS.map((f, i) => (
              <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: CL.body, fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: FACTOR_COLORS[i % FACTOR_COLORS.length] }} /> {f}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 11.5, color: CL.muted, textAlign: "center" }}>
            Question {Math.min(step + 1, total)} of {total} · live, private
          </div>
        </>
      )}
    </div>
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
          <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 60, height: 60, borderRadius: 16, background: CL.coral, display: "grid", placeItems: "center", boxShadow: "0 10px 30px rgba(241,90,56,.4)" }}>
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
            <NextCard to="/branches" icon={Layers} title="Explore the Branch Catalog" sub="See what each branch really gives you." primary />
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
