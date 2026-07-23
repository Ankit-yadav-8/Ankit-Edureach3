import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Target } from "lucide-react";

/* ════════════════════════════════════════════════
   HERO — simple, editorial. Warm cream canvas with a
   dotted grid, faint dashed orbits and a giant faint
   "College Parichay" watermark. Word-by-word headline
   reveal ending in a coral script word. No cards / images.
════════════════════════════════════════════════ */

const CORAL    = "#FF5A36";
const CORAL_DK = "#E0421F";
const INK      = "#1c1c28";

/* ── breakpoints ── */
function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    if (w <= 430)  return "xs";
    if (w <= 768)  return "mobile";
    if (w <= 1024) return "tablet";
    return "desktop";
  });
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 430)  setBp("xs");
      else if (w <= 768)  setBp("mobile");
      else if (w <= 1024) setBp("tablet");
      else setBp("desktop");
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return { isXs: bp === "xs", isMobile: bp === "mobile" || bp === "xs", isTablet: bp === "tablet" };
}

/* ── word reveal — black words blur-up, coral keywords spring-pop with a drawn underline ── */
const headVariants = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } };
const blackWord = {
  hidden: { opacity: 0, y: "0.55em", filter: "blur(6px)" },
  show:   { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const coralWord = {
  hidden: { opacity: 0, scale: 0.6, y: "0.2em" },
  show:   { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 380, damping: 17 } },
};
const HEAD_LINES = [
  [{ t: "Predict", c: false }, { t: "your", c: false }, { t: "rank.", c: true }],
  [{ t: "Meet", c: false }, { t: "your", c: false }, { t: "mentor.", c: true }],
];

function HeadWord({ w, order }) {
  return (
    <motion.span variants={w.c ? coralWord : blackWord}
      style={{ display: "inline-block", marginRight: "0.26em", color: w.c ? CORAL : INK, position: w.c ? "relative" : undefined, whiteSpace: "nowrap" }}>
      {w.t}
      {w.c && (
        <svg width="100%" height="12" viewBox="0 0 200 12" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: "-0.1em", width: "100%" }}>
          <motion.path d="M3 8C40 3 70 3 100 6C130 9 160 9 197 4" stroke={CORAL} strokeWidth="4" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.55, delay: 0.9 + order * 0.28, ease: "easeInOut" }} />
        </svg>
      )}
    </motion.span>
  );
}

/* ── 3-step journey: Mentorship → Rank → Dream College ── */
const STEPS = [
  { n: "01", title: "Mentorship", to: "/mentorship", desc: "A 1-on-1 IITian / doctor mentor with daily targets and weekly test analysis." },
  { n: "02", title: "Rank", to: "/jee-main", desc: "Free JEE & NEET predictors turn your marks into an accurate All-India rank." },
  { n: "03", title: "Dream College", to: "/for-you", desc: "Match that rank to every IIT, NIT & IIIT and plan your JoSAA choices." },
];
const stepsContainer = { hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } };
const stepVariant = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

function HeroSteps({ isMobile }) {
  return (
    <motion.div
      variants={stepsContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }}
      style={{ maxWidth: 980, margin: isMobile ? "3rem auto 0" : "4.5rem auto 0", position: "relative" }}
    >
      {/* connecting line behind the circles (desktop/tablet) */}
      {!isMobile && (
        <div aria-hidden style={{ position: "absolute", top: 34, left: "16%", right: "16%", height: 2, zIndex: 0,
          background: "linear-gradient(90deg, transparent, rgba(28,28,40,.14) 14%, rgba(28,28,40,.14) 86%, transparent)" }} />
      )}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: isMobile ? 30 : 24 }}>
        {STEPS.map((s) => (
          <motion.div
            key={s.n} variants={stepVariant}
            style={{ textAlign: "center", position: "relative", zIndex: 1 }}
          >
            <div style={{
              width: 68, height: 68, borderRadius: "50%", margin: "0 auto 16px",
              background: "#fff", border: "1px solid rgba(28,28,40,.1)",
              boxShadow: "0 10px 26px -10px rgba(28,28,40,.2)", display: "grid", placeItems: "center",
            }}>
              <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 22, color: CORAL }}>{s.n}</span>
            </div>
            <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 18, color: INK, marginBottom: 8 }}>{s.title}</div>
            <p style={{ margin: "0 auto", maxWidth: 250, fontSize: 13.5, color: "#6b6770", lineHeight: 1.6, fontFamily: "'Inter',system-ui,sans-serif" }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Hero({ onSearch }) {
  const nav = useNavigate();
  const { isXs, isMobile, isTablet } = useBreakpoint();
  const openSearch = () => { if (onSearch) onSearch(); else nav("/search"); };
  const headingSize = isXs ? "2.4rem" : isMobile ? "3rem" : isTablet ? "3.8rem" : "clamp(3.4rem, 5vw, 5rem)";

  return (
    <section style={{ position: "relative", overflow: "hidden", width: "100%", boxSizing: "border-box", background: "#FFFFFF" }}>
      {/* ── content ── */}
      <div className="container" style={{
        position: "relative", zIndex: 2, width: "100%", boxSizing: "border-box",
        paddingInline: "1.5rem", textAlign: "center",
        paddingTop: isXs ? 130 : isMobile ? 140 : 168,
        paddingBottom: isMobile ? 90 : 150,
      }}>
        {/* badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,90,54,.10)", border: "1px solid rgba(255,90,54,.22)", color: CORAL_DK, borderRadius: 9999, padding: "7px 16px", fontSize: 12, fontWeight: 800, letterSpacing: "1.4px", fontFamily: "'Inter',system-ui,sans-serif", marginBottom: 28 }}
        >
          <motion.span animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 1.8, repeat: Infinity }} style={{ width: 7, height: 7, borderRadius: "50%", background: CORAL }} />
          BUILT FOR JEE &amp; NEET ASPIRANTS
        </motion.div>

        {/* headline */}
        <motion.h1
          variants={headVariants} initial="hidden" animate="show"
          style={{ fontFamily: "'Space Grotesk','Sora',system-ui,sans-serif", fontWeight: 800, color: INK, fontSize: headingSize, lineHeight: 1.08, letterSpacing: "-0.03em", margin: 0 }}
        >
          {(() => {
            let o = 0;
            return HEAD_LINES.map((line, li) => (
              <span key={li} style={{ display: "block" }}>
                {line.map((w, wi) => <HeadWord key={wi} w={w} order={w.c ? o++ : 0} />)}
              </span>
            ));
          })()}
        </motion.h1>

        {/* subtext */}
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.9 }}
          style={{ margin: `${isMobile ? "1.6rem" : "2rem"} auto 0`, maxWidth: 560, fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 400, fontSize: isXs ? "1rem" : "1.1rem", color: "#6b6770", lineHeight: 1.65 }}
        >
          An <span style={{ position: "relative", color: CORAL, fontWeight: 700, whiteSpace: "nowrap" }}>
            IIT Roorkee
            <svg width="100%" height="8" viewBox="0 0 120 8" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: "-3px", width: "100%" }}>
              <motion.path d="M2 5 C 30 2, 90 2, 118 4" stroke={CORAL} strokeWidth="2.5" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 1.5, ease: "easeInOut" }} />
            </svg>
          </span> startup — built by IITians, trusted by aspirants
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.05 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, marginTop: isMobile ? "2rem" : "2.6rem" }}
        >
          <button
            onClick={openSearch}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, cursor: "pointer",
              minWidth: isXs ? 200 : 230, padding: "14px 26px", borderRadius: 9999, whiteSpace: "nowrap",
              background: "#fff", border: "1px solid rgba(0,0,0,.14)", color: "#111",
              fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 600, fontSize: isXs ? 14 : 15,
              boxShadow: "0 4px 12px rgba(0,0,0,.03)", transition: "all .2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(0,0,0,.28)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(0,0,0,.14)"; }}
          >
            <Search size={17} /> Search
          </button>
          <button
            onClick={() => nav("/jee-main#college")}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, cursor: "pointer",
              minWidth: isXs ? 200 : 230, padding: "14px 30px", borderRadius: 9999, whiteSpace: "nowrap",
              background: CORAL, border: "none", color: "#fff",
              fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 600, fontSize: isXs ? 14 : 15,
              boxShadow: "0 8px 24px rgba(255, 90, 54, 0.3)", transition: "all .2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = CORAL_DK; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.background = CORAL; }}
          >
            Predict my college <Target size={18} />
          </button>
        </motion.div>

        {/* ══ 3-step journey ══ */}
        <HeroSteps isMobile={isMobile} />
      </div>
    </section>
  );
}
