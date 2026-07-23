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
const MARKER   = "#FFC46B"; // warm amber marker-highlighter under the keywords

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
const LINE_A = [{ t: "Predictor", c: false }, { t: "tools", c: false }, { t: "that", c: false }, { t: "know", c: false }, { t: "the", c: false }, { t: "numbers.", c: true }];
const LINE_B = [{ t: "Mentors", c: false }, { t: "who", c: false }, { t: "know", c: false }, { t: "the", c: false }, { t: "journey.", c: true }];

function HeadWord({ w, order }) {
  return (
    <motion.span variants={w.c ? coralWord : blackWord}
      style={{ display: "inline-block", marginRight: "0.26em", color: w.c ? CORAL : INK, position: w.c ? "relative" : undefined, whiteSpace: "nowrap" }}>
      {w.t}
      {w.c && (
        <svg width="106%" height="20" viewBox="0 0 200 20" preserveAspectRatio="none" style={{ position: "absolute", left: "-3%", bottom: "-0.2em", width: "106%", zIndex: -1 }}>
          <motion.path d="M6 12 C 55 5, 150 5, 194 10" stroke={MARKER} strokeWidth="13" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.6, delay: 0.9 + order * 0.28, ease: "easeInOut" }} />
        </svg>
      )}
    </motion.span>
  );
}

export default function Hero({ onSearch }) {
  const nav = useNavigate();
  const { isXs, isMobile, isTablet } = useBreakpoint();
  const openSearch = () => { if (onSearch) onSearch(); else nav("/search"); };
  const headingSize = isXs ? "1.7rem" : isMobile ? "2.1rem" : isTablet ? "2.8rem" : "clamp(2.6rem, 4vw, 3.5rem)";

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
          <span style={{ display: "block" }}>
            {LINE_A.map((w, idx) => <HeadWord key={idx} w={w} order={0} />)}
          </span>
          <span style={{ display: "block" }}>
            {LINE_B.map((w, idx) => <HeadWord key={idx} w={w} order={1} />)}
          </span>
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
      </div>
    </section>
  );
}
