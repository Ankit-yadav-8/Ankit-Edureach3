/* BranchVsCollegePage — standalone page for the Branch vs College assessment.
   A dedicated hero (headline + live weighing-scale + CTA + trust bar) sits above
   the full 6-question quiz section. */
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, ListChecks, BarChart3, Star, ArrowRight, Users, Sparkles } from "lucide-react";
import Seo from "../components/Seo.jsx";
import BranchVsCollege, { BalanceScale } from "../components/home/BranchVsCollege.jsx";
import { CL, clEyebrow } from "../components/home/clTheme.js";

const FEATURES = [
  { icon: Clock,      title: "Takes ~2 Minutes",      sub: "Quick, focused, and built for you." },
  { icon: ListChecks, title: "6 Smart Questions",     sub: "Designed to understand what really matters." },
  { icon: BarChart3,  title: "Live Balance Tracking", sub: "See your branch vs. college balance in real time." },
  { icon: Star,       title: "Personalized Insights", sub: "Get clarity, not generic advice." },
];

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
            <span style={clEyebrow}><Sparkles size={13} /> Make a confident choice</span>
            <h1 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(2.1rem,5vw,3.4rem)", color: CL.ink, letterSpacing: "-1.4px", lineHeight: 1.06, margin: "18px 0 18px" }}>
              Branch or College —<br />what matters most to{" "}
              <span style={{ background: CL.amberSoft, color: CL.ink, padding: "0 12px", borderRadius: 12, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>you?</span>
            </h1>
            <p style={{ color: CL.body, fontSize: "1.08rem", lineHeight: 1.7, maxWidth: 460, marginBottom: 28 }}>
              Answer 6 smart questions. Watch the scale decide in real time. Then apply the framework.
            </p>
            <button onClick={scrollToQuiz} style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: CL.coral, color: "#fff", border: "none", borderRadius: 50,
              padding: "15px 30px", fontFamily: CL.display, fontWeight: 800, fontSize: 16,
              cursor: "pointer", boxShadow: "0 12px 30px rgba(255, 105, 61,.38)",
            }}>
              <BarChart3 size={18} /> Find My Balance <ArrowRight size={18} />
            </button>
          </div>

          {/* right — animated scale + trust badge */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <BalanceScale tilt={0.18} tally={{ c: 3, b: 2 }} showMeta={false} big />
            </motion.div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10, alignSelf: "center",
              background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 50,
              padding: "10px 20px", boxShadow: CL.shadow,
            }}>
              <Users size={16} color={CL.coral} />
              <span style={{ fontSize: 13.5, color: CL.body, fontWeight: 600 }}>
                <strong style={{ color: CL.ink }}>3,200+</strong> students have already made their{" "}
                <strong style={{ color: CL.coral }}>smarter choice.</strong>
              </span>
            </div>
          </div>
        </div>

        {/* feature bar */}
        <div className="bvc-feature-bar" style={{
          marginTop: 36, background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 20,
          boxShadow: CL.shadow, padding: "22px 10px",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", alignItems: "center",
        }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "4px 22px",
              borderLeft: i === 0 ? "none" : `1px solid ${CL.line}`,
            }}>
              <span style={{ width: 40, height: 40, borderRadius: 12, background: CL.coralSoft, display: "grid", placeItems: "center", flexShrink: 0 }}>
                <f.icon size={19} color={CL.coral} />
              </span>
              <div>
                <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 14, color: CL.ink, lineHeight: 1.2 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: CL.muted, marginTop: 3, lineHeight: 1.4 }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .bvc-hero-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .bvc-feature-bar { grid-template-columns: repeat(2, 1fr) !important; gap: 18px 0; }
          .bvc-feature-bar > div:nth-child(odd) { border-left: none !important; }
        }
        @media (max-width: 540px) {
          .bvc-feature-bar { grid-template-columns: 1fr !important; }
          .bvc-feature-bar > div { border-left: none !important; }
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
