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
  Layers, Crosshair, Compass, CheckCircle2, Check, Cpu,
} from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

/* ════════════════════════════════════════════════════════════════
   QUIZ 1 — Branch vs College. Fact-grounded scenarios; each option
   is worth 1–5 marks. Higher total (10–50) = stronger branch-fit lean.
   ════════════════════════════════════════════════════════════════ */
const BVC_QUESTIONS = [
  { fact: "A B.Tech is 160+ credits over four years, and branch-core subjects are the majority — you'll spend most classroom hours on your branch, not on general 'college experience.'",
    q: "How much does the subject itself weigh in your decision?",
    options: [
      { label: "Barely — I'd take any subject if the campus and name are good enough", mark: 1 },
      { label: "A little — subjects matter, but the college's vibe matters more day-to-day", mark: 2 },
      { label: "I'm not sure yet — I haven't seriously looked at branch syllabi", mark: 3 },
      { label: "Quite a bit — I'd want to at least like the core subjects I'll study for 4 years", mark: 4 },
      { label: "A lot — since most of my time goes to branch subjects, enjoying them beats the campus name", mark: 5 },
    ] },
  { fact: "Hiring reports increasingly cite project portfolios, internships and demonstrated skills for shortlisting — alongside, not instead of, the college name.",
    q: "A branch you're excited to build in vs a 'prestigious' branch you're neutral about — how do you weigh it?",
    options: [
      { label: "The prestigious branch — a strong name opens the first door regardless of my work", mark: 1 },
      { label: "The prestigious branch, though I'd still build some side projects too", mark: 2 },
      { label: "Unsure — I'd want more data before deciding this matters", mark: 3 },
      { label: "The branch I'm excited about — I know I'll actually build things in it", mark: 4 },
      { label: "The branch I'm excited about — real portfolios come from genuine interest, which matters as much as the name now", mark: 5 },
    ] },
  { fact: "Alumni networks matter most within your own branch/department circle, not the whole college.",
    q: "A less 'famous' college has a small but active alumni base in your branch. How does that change your view?",
    options: [
      { label: "Doesn't matter — a bigger name means a bigger network, full stop", mark: 1 },
      { label: "I'd still prefer the bigger college's reputation over a smaller branch network", mark: 2 },
      { label: "I'd want to verify how active that smaller network really is first", mark: 3 },
      { label: "A genuinely active branch network sounds more useful than a vague big-name one", mark: 4 },
      { label: "A small but active branch alumni base beats a large, generic name I'd rarely tap", mark: 5 },
    ] },
  { fact: "GATE & PSU eligibility exists across most core branches — 'keeping government-job options open' isn't a strong reason to avoid a branch you like.",
    q: "Does this change how you think about 'safe' branches?",
    options: [
      { label: "Not really — I'd still pick whatever sounds most broadly 'employable' on paper", mark: 1 },
      { label: "Somewhat — but I'd lean toward branches with an obvious PSU reputation", mark: 2 },
      { label: "I'd check GATE branch-wise cutoffs before trusting this", mark: 3 },
      { label: "Yes — it removes one worry, so I'd lean toward the branch I actually like", mark: 4 },
      { label: "Clearly — GATE/PSU doors stay open across branches, so I'd choose on genuine interest", mark: 5 },
    ] },
  { fact: "MS/PhD committees weigh research exposure, coursework and recommendation letters more than the undergrad college's brand.",
    q: "If you might pursue higher studies, how does this affect your branch-vs-college thinking?",
    options: [
      { label: "Doesn't change anything — a known undergrad name carries weight anywhere", mark: 1 },
      { label: "Slightly — but I'd still bank mostly on the college's reputation", mark: 2 },
      { label: "I'd research this further before it changes my choice", mark: 3 },
      { label: "It nudges me toward a branch where I can build real research exposure", mark: 4 },
      { label: "Strongly — research depth matters more, so I'd pick a branch I'll go deep in", mark: 5 },
    ] },
  { fact: "Placement-brochure 'average package' is often skewed up by a few high offers in specific branches — the average doesn't tell you what YOUR branch earns.",
    q: "A headline 'great average' college vs verified branch-wise data elsewhere — how do you evaluate?",
    options: [
      { label: "I'd trust the headline average number as the deciding factor", mark: 1 },
      { label: "I'd mostly trust the headline but skim branch data briefly", mark: 2 },
      { label: "I wouldn't know how to find branch-wise data, so I'd just guess", mark: 3 },
      { label: "I'd actively find branch-wise placement data before trusting any headline", mark: 4 },
      { label: "I'd only trust branch-specific data — headline averages are skewed by outliers", mark: 5 },
    ] },
  { fact: "Even less-famous colleges run active clubs, hackathons and branch societies — sometimes MORE accessible than at big campuses where they're oversubscribed.",
    q: "Does this change how much 'college fame' matters for your hands-on growth?",
    options: [
      { label: "Not at all — a famous college's clubs are inherently better, regardless of access", mark: 1 },
      { label: "Mostly — I'd still assume the famous college offers more overall", mark: 2 },
      { label: "I'd check both colleges' club activity before deciding", mark: 3 },
      { label: "Somewhat — easier access to real hands-on work beats prestige alone", mark: 4 },
      { label: "Clearly — real hands-on access in my branch beats a famous campus I can't get into", mark: 5 },
    ] },
  { fact: "Many engineers eventually work in roles unrelated to their branch (management, business, other tech) — via skills they built themselves, not the branch name on the degree.",
    q: "Given this, how much should today's branch choice weigh on you?",
    options: [
      { label: "A lot less — I might switch anyway, so the college name should matter more now", mark: 1 },
      { label: "Somewhat less — I'd deprioritise branch fit a bit given the uncertainty", mark: 2 },
      { label: "I'm not sure how to weigh this either way", mark: 3 },
      { label: "Still meaningfully — I'd rather enjoy what I study these 4 years, whatever comes after", mark: 4 },
      { label: "It doesn't reduce branch importance — skills from genuine interest carry me anyway", mark: 5 },
    ] },
  { fact: "Faculty research and lab facilities vary a lot by department — a college can be famous overall while your department has limited research, or vice versa.",
    q: "If you looked up faculty & labs for your branch at two colleges, how much would that influence you?",
    options: [
      { label: "Not much — the overall name would override anything at department level", mark: 1 },
      { label: "A little — but I probably wouldn't spend time checking this", mark: 2 },
      { label: "I'd want to check, but I'm unsure where to find reliable department info", mark: 3 },
      { label: "Quite a bit — I'd actively compare department research strength", mark: 4 },
      { label: "Heavily — department faculty & labs matter more to my 4 years than the college's national name", mark: 5 },
    ] },
  { fact: "In graduate regret surveys, 'picked a branch I wasn't interested in' is a top regret — cited more often than 'picked a less famous college.'",
    q: "Which regret would you actively try harder to avoid?",
    options: [
      { label: "I'd still risk the branch regret to secure the more famous college name", mark: 1 },
      { label: "I'd lean toward avoiding the college-name regret, but not with full confidence", mark: 2 },
      { label: "I'd want more sources before trusting this pattern", mark: 3 },
      { label: "I'd actively avoid the branch regret, since it's reported more often", mark: 4 },
      { label: "Clearly avoid the branch regret — data says it's the more common long-term regret", mark: 5 },
    ] },
];

/* ════════════════════════════════════════════════════════════════
   QUIZ 2 — Which Branch is for me? 8 branches; each answer gives +3
   to a branch; the highest total wins.
   ════════════════════════════════════════════════════════════════ */
const BRANCHES = [
  { id: "mech",  name: "Mechanical Engineering",   short: "Mechanical", emoji: "⚙️", color: "#FF693D", blurb: "Machines, engines, design & manufacturing — how physical things move and work." },
  { id: "elec",  name: "Electrical & Electronics", short: "Electrical", emoji: "⚡", color: "#3A86FF", blurb: "Circuits, chips, power systems & electronics that run modern devices." },
  { id: "civil", name: "Civil Engineering",        short: "Civil",      emoji: "🏗️", color: "#0EA5A4", blurb: "Buildings, bridges, roads & infrastructure that shape how cities grow." },
  { id: "chem",  name: "Chemical Engineering",     short: "Chemical",   emoji: "⚗️", color: "#7C3AED", blurb: "Materials, fuels, medicines & large-scale processes in labs and plants." },
  { id: "cs",    name: "Computer Science / IT",    short: "CS / IT",    emoji: "💻", color: "#6366f1", blurb: "Software, apps & systems used by millions every day." },
  { id: "ai",    name: "AI & Machine Learning",    short: "AI / ML",    emoji: "🤖", color: "#EC4899", blurb: "Systems that learn, predict and automate decisions from data." },
  { id: "aero",  name: "Aerospace Engineering",    short: "Aerospace",  emoji: "✈️", color: "#0d1b3e", blurb: "Aircraft, satellites & spacecraft — flight, propulsion and space." },
  { id: "bio",   name: "Biotechnology",            short: "Biotech",    emoji: "🧬", color: "#15a06e", blurb: "Genetics, materials & processes where biology meets engineering." },
];

const BS_QUESTIONS = [
  { q: "You're stuck on a mechanics numerical for 30+ minutes. What genuinely keeps you going?",
    options: [
      { label: "The satisfaction of visualising exactly how forces and motion interact once it clicks", branch: "mech" },
      { label: "You'd rather switch to the electricity/magnetism chapter — that logic feels more natural", branch: "elec" },
      { label: "You think about how this same load logic applies to real structures like bridges", branch: "civil" },
      { label: "You'd happily spend the time on a chemistry reaction mechanism instead", branch: "chem" },
      { label: "You start thinking about writing code to simulate and verify the answer", branch: "cs" },
      { label: "You wonder if a model could be trained to predict the answer pattern", branch: "ai" },
      { label: "You think about how this physics explains how an aircraft wing generates lift", branch: "aero" },
      { label: "You get curious whether similar force principles apply inside the human body", branch: "bio" },
    ] },
  { q: "A relative asks, \"Beta, what will you actually build after becoming an engineer?\"",
    options: [
      { label: "\"Engines, machines or vehicles that move things more efficiently\"", branch: "mech" },
      { label: "\"Chips, circuits or power systems that run our devices\"", branch: "elec" },
      { label: "\"Buildings, roads or infrastructure people rely on for decades\"", branch: "civil" },
      { label: "\"New materials, fuels or medicines in a lab\"", branch: "chem" },
      { label: "\"Apps or software that people use every day\"", branch: "cs" },
      { label: "\"AI systems that can learn, predict and automate decisions\"", branch: "ai" },
      { label: "\"Aircraft, satellites or spacecraft\"", branch: "aero" },
      { label: "\"Genetic or biological research that improves healthcare\"", branch: "bio" },
    ] },
  { q: "Your coaching forms a college-fest project team. Which role do you take without hesitation?",
    options: [
      { label: "Building and testing the physical model or mechanism", branch: "mech" },
      { label: "Setting up the sensors, wiring or circuit that makes it function", branch: "elec" },
      { label: "Planning the structure and making sure it's assembled safely", branch: "civil" },
      { label: "Figuring out which materials or chemical treatment makes it last", branch: "chem" },
      { label: "Writing the code that powers the project's software side", branch: "cs" },
      { label: "Building a smart feature that learns from data and improves automatically", branch: "ai" },
      { label: "Designing a lightweight, aerodynamic version of the model", branch: "aero" },
      { label: "Researching a biological or health angle for the project's use case", branch: "bio" },
    ] },
  { q: "It's 11 PM, target done, 20 minutes before sleep. Which video do you actually watch?",
    options: [
      { label: "\"Inside an F1 pit stop — how the engine is built\"", branch: "mech" },
      { label: "\"How mobile towers send signals to your phone instantly\"", branch: "elec" },
      { label: "\"How the Atal Setu bridge was actually constructed\"", branch: "civil" },
      { label: "\"How your toothpaste or shampoo is manufactured at scale\"", branch: "chem" },
      { label: "\"How an app like Instagram handles a billion users at once\"", branch: "cs" },
      { label: "\"How ChatGPT actually learns and generates responses\"", branch: "ai" },
      { label: "\"How ISRO's Chandrayaan actually landed on the moon\"", branch: "aero" },
      { label: "\"How CRISPR gene editing actually works\"", branch: "bio" },
    ] },
  { q: "A friend says \"sirf CS/AI rakhna, baaki branch mein future nahi.\" Your honest reaction?",
    options: [
      { label: "Disagree — I'd rather work on real machines than a screen all day", branch: "mech" },
      { label: "Disagree — core electronics & power systems interest me more", branch: "elec" },
      { label: "Disagree — infrastructure will always be needed, whatever happens in tech", branch: "civil" },
      { label: "Disagree — chemical & process industries have their own stable path", branch: "chem" },
      { label: "Partly agree — software genuinely excites me more than most things", branch: "cs" },
      { label: "Fully agree — I think AI is where all future careers are headed", branch: "ai" },
      { label: "Disagree — space & aviation will always need dedicated specialists", branch: "aero" },
      { label: "Disagree — healthcare & biotech will always be essential, tech or not", branch: "bio" },
    ] },
  { q: "On a family trip you see something impressive (a dam, plant, airport or hospital). First thought?",
    options: [
      { label: "\"How does the machinery inside actually operate?\"", branch: "mech" },
      { label: "\"How does this whole thing get powered and wired?\"", branch: "elec" },
      { label: "\"How did they design this to not collapse under its own weight?\"", branch: "civil" },
      { label: "\"What materials or chemical processes went into this?\"", branch: "chem" },
      { label: "\"Is there software or an app managing all of this?\"", branch: "cs" },
      { label: "\"Is AI being used anywhere in how this operates?\"", branch: "ai" },
      { label: "\"How do they handle safety for anything involving flight or altitude?\"", branch: "aero" },
      { label: "\"How does medical or biological research support what happens here?\"", branch: "bio" },
    ] },
  { q: "Your mock result surprises you. Which score are you secretly most proud of?",
    options: [
      { label: "Physics — especially mechanics and energy-based numericals", branch: "mech" },
      { label: "Physics — especially current electricity and electromagnetism", branch: "elec" },
      { label: "Math — especially geometry, mensuration and structural calculations", branch: "civil" },
      { label: "Chemistry — especially organic reactions and processes", branch: "chem" },
      { label: "Overall problem-solving speed, similar to coding logic", branch: "cs" },
      { label: "Math — especially probability, statistics and pattern-based questions", branch: "ai" },
      { label: "Physics — especially fluid dynamics and motion in three dimensions", branch: "aero" },
      { label: "Biology/Chemistry sections dealing with living systems", branch: "bio" },
    ] },
  { q: "Assume rank & package are exactly equal across all branches. Which do you pick, and why?",
    options: [
      { label: "Mechanical — I'd enjoy working with machines regardless of package", branch: "mech" },
      { label: "Electrical — circuits and power systems interest me either way", branch: "elec" },
      { label: "Civil — I'd still want to design and build physical structures", branch: "civil" },
      { label: "Chemical — materials and reactions would still pull me in", branch: "chem" },
      { label: "CS/IT — I'd code and build software even as a hobby", branch: "cs" },
      { label: "AI/ML — I'd study how machines learn even without a job attached", branch: "ai" },
      { label: "Aerospace — flight and space would fascinate me regardless of pay", branch: "aero" },
      { label: "Biotechnology — biology and health research would still draw me", branch: "bio" },
    ] },
];

/* Branch-vs-college scoring: mark 1 = strong college, 5 = strong branch.
   scoreState maps to a college(+)/branch(−) needle for the live meter + dial. */
function scoreState(answers) {
  const chosen = answers.filter(Boolean);
  const sum = chosen.reduce((s, a) => s + (a.mark || 0), 0);
  const signal = chosen.reduce((s, a) => s + (3 - (a.mark || 3)), 0); // +2 college .. −2 branch
  const max = (chosen.length || 1) * 2;
  return { sum, norm: Math.max(-1, Math.min(1, signal / max)) };
}

const BVC_BANDS = [
  { max: 20, side: "college", eyebrow: "STRONG COLLEGE-BRAND LEAN",
    title: "Protect the college name first.",
    blurb: "Even against patterns that favour branch fit, you default to prestige — the campus, brand and network are what you'd most regret losing. Build your JoSAA list around the strongest institute you can realistically reach.",
    pointers: [
      "Order your list by institute tier before branch preference.",
      "Inside each college, still rank branches you'd genuinely accept.",
      "Check branch-change rules — many institutes allow a switch after year one.",
    ] },
  { max: 32, side: "college", eyebrow: "MODERATE COLLEGE LEAN",
    title: "You weigh both — but the name usually tips it.",
    blurb: "You see the case for subject fit, yet reputation still wins most of your close calls. That's fine — just make sure the branches you'd accept at a top college are ones you can live with for four years.",
    pointers: [
      "Shortlist top colleges first, then cut branches you'd truly resent.",
      "Compare branch-wise placement data, not just the headline average.",
      "Keep one 'interest' branch high on your list as a hedge.",
    ] },
  { max: 42, side: "branch", eyebrow: "MODERATE BRANCH LEAN",
    title: "Real-world patterns are tilting you to the subject.",
    blurb: "Skills, portfolios, research exposure and regret data are nudging you toward branch fit — you'd rather study something you like than chase a name. You still value a good college, so balance both.",
    pointers: [
      "Order by branch first, then by the best college that offers it.",
      "Add your branch at a tier-below college as a safety net.",
      "Verify department faculty & labs, not just the college's overall fame.",
    ] },
  { max: 50, side: "branch", eyebrow: "STRONG BRANCH-FIT LEAN",
    title: "Put the branch you'll enjoy first.",
    blurb: "You consistently prioritise genuine interest — backed by how hiring, higher studies and long-term regret actually play out. Protect the field you want, even if it means a less famous campus.",
    pointers: [
      "Order your list by branch, then college within it.",
      "Skip 'better' colleges offering branches you'd resent studying.",
      "Use last year's closing ranks to see which branch trade-offs are realistic.",
    ] },
];

function computeVerdict(answers) {
  const { sum, norm } = scoreState(answers);
  const strength = Math.round(Math.abs(norm) * 100);
  const band = BVC_BANDS.find((b) => sum <= b.max) || BVC_BANDS[BVC_BANDS.length - 1];
  return { ...band, norm, strength, total: sum };
}

/* Which-branch scoring: +3 per answer to its branch; highest total wins. */
function computeBranch(answers) {
  const tally = {};
  answers.filter(Boolean).forEach((a) => { tally[a.branch] = (tally[a.branch] || 0) + 3; });
  const ranked = BRANCHES.map((b) => ({ ...b, score: tally[b.id] || 0 })).sort((x, y) => y.score - x.score);
  const total = ranked.reduce((s, b) => s + b.score, 0) || 1;
  const top = ranked[0];
  return { top, ranked, pct: Math.round((top.score / total) * 100), total };
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
          style={{ position: "absolute", top: "50%", transform: "translate(-50%,-50%)", width: 18, height: 18, borderRadius: "50%", background: "var(--page-bg)", border: `3px solid ${tone}`, boxShadow: CL.shadow }} />
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

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

const MODES = [
  { id: "bvc",    label: "Branch vs College", icon: GitCompareArrows, sub: "Institute or branch — pick your side" },
  { id: "branch", label: "Which Branch?",     icon: Compass,          sub: "Find your best-fit engineering branch" },
];

/* ── Which-branch result card ── */
function BranchVerdict({ result, onReset }) {
  const { top, ranked, pct } = result;
  const maxScore = ranked[0]?.score || 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      style={{ background: CL.card, borderRadius: 24, border: `1px solid ${CL.line}`, boxShadow: CL.shadowLg, padding: "32px 30px", maxWidth: 720, margin: "0 auto" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", marginBottom: 24 }}>
        <motion.div initial={{ scale: 0.6, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}
          style={{ width: 78, height: 78, borderRadius: 22, background: `${top.color}18`, border: `1.5px solid ${top.color}44`, display: "grid", placeItems: "center", fontSize: 38, flexShrink: 0 }}>
          {top.emoji}
        </motion.div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 800, letterSpacing: "1.2px", color: CL.coralDk, background: CL.coralSoft, padding: "5px 12px", borderRadius: 50, marginBottom: 10 }}>
            <Sparkles size={13} /> YOUR BEST-FIT BRANCH
          </span>
          <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.8rem", color: top.color, letterSpacing: "-0.6px", lineHeight: 1.1, margin: "0 0 8px" }}>{top.name}</h3>
          <p style={{ color: CL.body, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{top.blurb}</p>
        </div>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 34, color: top.color, lineHeight: 1 }}>{pct}%</div>
          <div style={{ fontSize: 11, color: CL.muted, fontWeight: 600 }}>match</div>
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em", color: CL.muted, marginBottom: 12 }}>HOW EVERY BRANCH SCORED</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 26 }}>
        {ranked.map((b, i) => (
          <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span style={{ width: 104, fontSize: 12.5, fontWeight: i === 0 ? 800 : 600, color: i === 0 ? b.color : CL.ink2, flexShrink: 0 }}>{b.emoji} {b.short}</span>
            <div style={{ flex: 1, height: 9, borderRadius: 50, background: CL.cream2, overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${(b.score / maxScore) * 100}%` }} transition={{ duration: 0.7, delay: 0.1 + i * 0.05, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: 50, background: b.color, opacity: b.score ? 1 : 0.2 }} />
            </div>
            <span style={{ width: 26, textAlign: "right", fontSize: 12, fontWeight: 700, color: i === 0 ? b.color : CL.muted, flexShrink: 0 }}>{b.score}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em", color: CL.muted, marginBottom: 14 }}>WHAT NEXT</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
        <NextTile to="/branches" icon={Layers} title="Explore this branch" sub="Careers, salaries & syllabus for every branch." primary />
        <NextTile to="/jee-main#college" icon={Crosshair} title="College Predictor" sub="Which campuses your rank can reach." />
        <NextTile to="/for-you" icon={Compass} title="Personal shortlist" sub="A ready-to-file list built for you." />
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
        <button onClick={onReset} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: `1.5px solid ${CL.line}`, borderRadius: 50, padding: "11px 22px", fontFamily: CL.display, fontWeight: 700, fontSize: 13.5, color: CL.ink, cursor: "pointer" }}>
          <RotateCcw size={15} /> Retake — nothing is saved
        </button>
      </div>
    </motion.div>
  );
}

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
  const [mode, setMode] = useState("bvc"); // bvc | branch
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState(Array(BVC_QUESTIONS.length).fill(null));
  const [phase, setPhase] = useState("quiz"); // quiz | analyzing | result

  const QSET = mode === "bvc" ? BVC_QUESTIONS : BS_QUESTIONS;
  const reset = (m = mode) => {
    const qs = m === "bvc" ? BVC_QUESTIONS : BS_QUESTIONS;
    setAnswers(Array(qs.length).fill(null)); setStep(0); setDir(1); setPhase("quiz");
  };
  const switchMode = (m) => { if (m === mode) return; setMode(m); reset(m); };

  const choose = (opt) => {
    const next = [...answers];
    next[step] = opt;
    setAnswers(next);
    setTimeout(() => {
      if (step + 1 < QSET.length) { setDir(1); setStep(step + 1); }
      else setPhase("analyzing");
    }, 240);
  };
  const goPrev = () => { if (step > 0) { setDir(-1); setStep(step - 1); } };

  const q = QSET[step];
  const bvcVerdict = phase === "result" && mode === "bvc" ? computeVerdict(answers) : null;
  const branchResult = phase === "result" && mode === "branch" ? computeBranch(answers) : null;
  const H = mode === "bvc"
    ? { eyebrow: "AI Trade-off Analyzer",
        title: <>Your rank will force a trade-off.<br /><span style={{ color: CL.coral }}>Know your side</span> before you fill a single choice.</>,
        sub: "10 fact-based scenarios · no wrong answers — see whether real hiring, research and regret patterns put you on the branch or the college side." }
    : { eyebrow: "AI Branch Finder",
        title: <>Not sure which branch?<br /><span style={{ color: CL.coral }}>Find the field</span> that actually fits you.</>,
        sub: "8 quick scenarios from an aspirant's real life — we match your instincts to one of 8 engineering branches." };

  return (
    <section id="branch-vs-college" style={{ background: CL.cream, padding: asPage ? "104px 0 80px" : "84px 0", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}>
      {/* soft decorative glow */}
      <div aria-hidden style={{ position: "absolute", top: "6%", left: "50%", width: 640, height: 640, transform: "translateX(-50%)", background: `radial-gradient(circle, ${CL.coralSoft} 0%, transparent 62%)`, opacity: 0.55, pointerEvents: "none", zIndex: 0 }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 24px" }}>
          <span style={clEyebrow}><GitCompareArrows size={13} /> {H.eyebrow}</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.2vw,2.8rem)", color: CL.ink, letterSpacing: "-1.2px", margin: "16px 0 12px", lineHeight: 1.1 }}>
            {H.title}
          </h2>
          {phase === "quiz" && (
            <motion.p key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              style={{ color: CL.body, fontSize: "1.02rem", lineHeight: 1.65, maxWidth: 580, margin: "0 auto" }}>
              {H.sub}
            </motion.p>
          )}
        </div>

        {/* mode selector — two option-style cards on desktop, a compact toggle on phones */}
        <div className="bvc-mode-select" style={{ maxWidth: 640, margin: "0 auto 30px" }}>
          {/* desktop / tablet: two side-by-side cards, styled like the quiz options */}
          <div className="bvc-mode-cards">
            {MODES.map((m) => {
              const on = mode === m.id;
              return (
                <button key={m.id} onClick={() => switchMode(m.id)}
                  style={{
                    textAlign: "left", padding: "20px 22px", borderRadius: 20, cursor: "pointer",
                    background: on ? CL.coralSoft : CL.card,
                    border: `1.5px solid ${on ? CL.coral : CL.line}`,
                    display: "flex", alignItems: "center", gap: 14, width: "100%",
                    boxShadow: on ? `0 12px 30px -10px ${CL.coral}66` : CL.shadow,
                    transition: "transform .18s, background .15s, border-color .15s, box-shadow .2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; if (!on) { e.currentTarget.style.borderColor = CL.coral + "77"; e.currentTarget.style.background = CL.cream2; e.currentTarget.style.boxShadow = CL.shadowLg; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; if (!on) { e.currentTarget.style.borderColor = CL.line; e.currentTarget.style.background = CL.card; e.currentTarget.style.boxShadow = CL.shadow; } }}
                >
                  <span style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, display: "grid", placeItems: "center", background: on ? CL.coral : CL.cream2, border: `1px solid ${on ? CL.coral : CL.cream3}`, transition: "all .15s" }}>
                    <m.icon size={21} color={on ? "#fff" : CL.coral} />
                  </span>
                  <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                    <span style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 15, color: CL.ink, letterSpacing: "-0.2px" }}>{m.label}</span>
                    <span style={{ fontSize: 12.5, color: CL.muted, fontWeight: 500, lineHeight: 1.3 }}>{m.sub}</span>
                  </span>
                  {on
                    ? <CheckCircle2 size={20} color={CL.coral} style={{ flexShrink: 0 }} />
                    : <ArrowRight size={18} color={CL.muted} style={{ flexShrink: 0, opacity: 0.35 }} />}
                </button>
              );
            })}
          </div>

          {/* phones: compact two-button toggle — tap one or the other */}
          <div className="bvc-mode-toggle">
            {MODES.map((m) => {
              const on = mode === m.id;
              return (
                <button key={m.id} onClick={() => switchMode(m.id)}
                  style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px 12px", borderRadius: 50, cursor: "pointer", fontFamily: CL.display, fontWeight: 800, fontSize: 13, border: `1.5px solid ${on ? CL.coral : CL.cream3}`, background: on ? CL.coral : CL.card, color: on ? "#fff" : CL.ink2, boxShadow: on ? `0 8px 20px -10px ${CL.coral}` : "none", transition: "all .18s" }}>
                  <m.icon size={15} color={on ? "#fff" : CL.coral} /> {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait" custom={dir}>
          {phase === "analyzing" ? (
            <AiAnalyzing key={`ai-${mode}`} onDone={() => setPhase("result")} />
          ) : phase === "result" ? (
            <motion.div key={`result-${mode}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {mode === "bvc"
                ? <VerdictCard verdict={bvcVerdict} onReset={() => reset()} />
                : <BranchVerdict result={branchResult} onReset={() => reset()} />}
            </motion.div>
          ) : (
            <motion.div key={`q-${mode}-${step}`}
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
                  {step + 1} <span style={{ color: CL.muted, fontWeight: 700 }}>/ {QSET.length}</span>
                </span>
                <div style={{ flex: 1, display: "flex", gap: 4, minWidth: 120 }}>
                  {QSET.map((_, i) => {
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

              {q.fact && (
                <div style={{ display: "flex", gap: 9, background: CL.cream2, border: `1px solid ${CL.cream3}`, borderRadius: 12, padding: "10px 13px", marginBottom: 14 }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>💡</span>
                  <span style={{ fontSize: 12.5, color: CL.body, lineHeight: 1.5 }}><b style={{ color: CL.ink2 }}>Fact:</b> {q.fact}</span>
                </div>
              )}
              <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.28rem", color: CL.ink, letterSpacing: "-0.4px", marginBottom: 6, lineHeight: 1.3 }}>{q.q}</h3>
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

              {mode === "bvc" && <CompassStrip answers={answers} />}

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
