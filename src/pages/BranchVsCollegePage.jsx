/* BranchVsCollegePage — standalone page for the Branch vs College check.
   Original College Parichay design: a split hero (headline + live dial
   preview) over a three-step "how it works" strip, followed by the full
   seven-scenario quiz section. */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ListChecks, Gauge, Map, ArrowRight, Users, Sparkles } from "lucide-react";
import Seo from "../components/Seo.jsx";
import BranchVsCollege, { DirectionDial } from "../components/home/BranchVsCollege.jsx";
import { CL, clEyebrow } from "../components/home/clTheme.js";

const STEPS = [
  { icon: ListChecks, title: "Answer 7 scenarios", sub: "Real trade-offs you'll face at the JoSAA screen — not abstract personality questions." },
  { icon: Gauge,      title: "Watch your needle move", sub: "Every answer nudges the dial toward branch or college, live and private." },
  { icon: Map,        title: "Get a filling strategy", sub: "A clear verdict plus exactly how to order your choice list around it." },
];

/* Hero dial gently sweeps between the two sides until the quiz is taken. */
function IdleDial() {
  const [norm, setNorm] = useState(0.45);
  useEffect(() => {
    const seq = [0.45, -0.5, 0.1, 0.6, -0.25];
    let i = 0;
    const id = setInterval(() => { i = (i + 1) % seq.length; setNorm(seq[i]); }, 2600);
    return () => clearInterval(id);
  }, []);
  return <DirectionDial norm={norm} size={320} />;
}

function Hero() {
  const scrollToQuiz = () => {
    const el = document.getElementById("branch-vs-college");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <section style={{ background: CL.cream, paddingTop: 128, paddingBottom: 24, position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="bvc-hero-grid" style={{
          display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "center",
        }}>
          {/* left — copy */}
          <div>
            <span style={clEyebrow}><Sparkles size={13} /> Decide before counselling does</span>
            <h1 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(2.1rem,5vw,3.4rem)", color: CL.ink, letterSpacing: "-1.4px", lineHeight: 1.06, margin: "18px 0 18px" }}>
              Better branch or bigger college?<br />
              <span style={{ background: CL.amberSoft, color: CL.ink, padding: "0 12px", borderRadius: 12, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>Find your side.</span>
            </h1>
            <p style={{ color: CL.body, fontSize: "1.08rem", lineHeight: 1.7, maxWidth: 470, marginBottom: 28 }}>
              Seven counselling-day scenarios, two minutes, one clear verdict — and a strategy for ordering your JoSAA list around it.
            </p>
            <button onClick={scrollToQuiz} style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: CL.coral, color: "#fff", border: "none", borderRadius: 50,
              padding: "15px 30px", fontFamily: CL.display, fontWeight: 800, fontSize: 16,
              cursor: "pointer", boxShadow: "0 12px 30px rgba(255, 105, 61,.38)",
            }}>
              <Gauge size={18} /> Start the 2-minute check <ArrowRight size={18} />
            </button>
          </div>

          {/* right — live dial preview + trust line */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 24, boxShadow: CL.shadow, padding: "30px 34px 22px", width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".12em", color: CL.muted, textTransform: "uppercase", marginBottom: 14 }}>
                Where will your needle settle?
              </div>
              <IdleDial />
            </motion.div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 50,
              padding: "10px 20px", boxShadow: CL.shadow,
            }}>
              <Users size={16} color={CL.coral} />
              <span style={{ fontSize: 13.5, color: CL.body, fontWeight: 600 }}>
                <strong style={{ color: CL.ink }}>3,200+</strong> aspirants have found{" "}
                <strong style={{ color: CL.coral }}>their side.</strong>
              </span>
            </div>
          </div>
        </div>

        {/* how it works */}
        <div className="bvc-steps" style={{
          marginTop: 36, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
        }}>
          {STEPS.map((s, i) => (
            <div key={s.title} style={{
              background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 20,
              boxShadow: CL.shadow, padding: "20px 22px", display: "flex", gap: 14, alignItems: "flex-start",
            }}>
              <span style={{ width: 42, height: 42, borderRadius: 13, background: CL.coralSoft, display: "grid", placeItems: "center", flexShrink: 0, position: "relative" }}>
                <s.icon size={19} color={CL.coral} />
                <span style={{ position: "absolute", top: -7, right: -7, width: 19, height: 19, borderRadius: "50%", background: CL.ink, color: "#fff", fontSize: 10.5, fontWeight: 800, display: "grid", placeItems: "center", fontFamily: CL.display }}>{i + 1}</span>
              </span>
              <div>
                <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 14.5, color: CL.ink, lineHeight: 1.2 }}>{s.title}</div>
                <div style={{ fontSize: 12.5, color: CL.muted, marginTop: 5, lineHeight: 1.5 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .bvc-hero-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .bvc-steps { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

export default function BranchVsCollegePage() {
  useEffect(() => { document.title = "Branch vs College — should the institute or the branch win? · College Parichay"; }, []);
  return (
    <>
      <Seo path="/branch-vs-college" />
      <Hero />
      <BranchVsCollege asPage />
    </>
  );
}
