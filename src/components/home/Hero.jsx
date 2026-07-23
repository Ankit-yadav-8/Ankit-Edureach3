import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ════════════════════════════════════════════════
   HERO — simple, editorial. Warm cream canvas with a
   dotted grid, faint dashed orbits and a giant faint
   "College Parichay" watermark. Word-by-word headline
   reveal ending in a coral script word. No cards / images.
════════════════════════════════════════════════ */

const CORAL    = "#FF5A36";
const CORAL_DK = "#E0421F";
const INK      = "#1c1c28";
const MARKER   = "#FBD9A6"; // warm highlighter under "smarter"

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

/* ── word reveal ── */
const headVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.18 } } };
const wordVariant = {
  hidden: { opacity: 0, y: "0.55em", filter: "blur(8px)" },
  show:   { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function Word({ children, underline, marginRight = "0.28em" }) {
  return (
    <motion.span variants={wordVariant} style={{ display: "inline-block", marginRight, position: underline ? "relative" : undefined }}>
      {children}
      {underline && (
        <svg width="100%" height="14" viewBox="0 0 200 14" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: "-0.02em", width: "100%", zIndex: -1 }}>
          <motion.path d="M4 8 C 55 3, 145 3, 196 7" stroke={MARKER} strokeWidth="10" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 1.05, ease: "easeInOut" }} />
        </svg>
      )}
    </motion.span>
  );
}

export default function Hero() {
  const nav = useNavigate();
  const { isXs, isMobile, isTablet } = useBreakpoint();
  const headingSize = isXs ? "2.5rem" : isMobile ? "3.1rem" : isTablet ? "4.2rem" : "clamp(3.8rem, 6vw, 6rem)";

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
          style={{ fontFamily: "'Space Grotesk','Sora',system-ui,sans-serif", fontWeight: 800, color: INK, fontSize: headingSize, lineHeight: 1.04, letterSpacing: "-0.035em", margin: 0 }}
        >
          <span style={{ display: "block" }}>
            <Word>Every</Word><Word>student</Word>
          </span>
          <span style={{ display: "block" }}>
            <Word>deserves</Word><Word>a</Word><Word underline marginRight="0">smarter</Word>
          </span>
          <motion.span
            initial={{ opacity: 0, scale: 0.7, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 1.15 }}
            style={{ display: "block", marginTop: "0.12em", fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontWeight: 700, color: CORAL, fontSize: "1.12em", letterSpacing: "-0.01em" }}
          >
            <motion.span
              animate={{ textShadow: ["0 0 0px rgba(255,90,54,0)", "0 0 26px rgba(255,90,54,.45)", "0 0 0px rgba(255,90,54,0)"] }}
              transition={{ duration: 3.2, repeat: Infinity, delay: 1.6 }}
              style={{ display: "inline-block" }}
            >
              start.
            </motion.span>
          </motion.span>
        </motion.h1>

        {/* subtext */}
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.9 }}
          style={{ margin: `${isMobile ? "1.6rem" : "2rem"} auto 0`, maxWidth: 560, fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 400, fontSize: isXs ? "1rem" : "1.1rem", color: "#6b6770", lineHeight: 1.65 }}
        >
          Free tools, real analysis and honest guidance to crack JEE &amp; NEET and find a better college life.
          <br style={{ display: isXs ? "none" : "block" }} />
          Built by <b style={{ color: INK, fontWeight: 600 }}>IITians who walk the same road</b>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.05 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, marginTop: isMobile ? "2rem" : "2.6rem" }}
        >
          <button
            onClick={() => nav("/for-you")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 9, cursor: "pointer",
              padding: "14px 30px", borderRadius: 9999, whiteSpace: "nowrap",
              background: CORAL, border: "none", color: "#fff",
              fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 700, fontSize: isXs ? 14 : 15,
              boxShadow: "0 10px 28px -6px rgba(255,90,54,.5)", transition: "all .2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = CORAL_DK; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.background = CORAL; }}
          >
            Find Your College <ArrowRight size={17} />
          </button>
          <button
            onClick={() => nav("/tools")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 9, cursor: "pointer",
              padding: "14px 28px", borderRadius: 9999, whiteSpace: "nowrap",
              background: "#fff", border: "1px solid rgba(28,28,40,.14)", color: INK,
              fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 700, fontSize: isXs ? 14 : 15,
              boxShadow: "0 4px 12px rgba(28,28,40,.04)", transition: "all .2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(28,28,40,.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(28,28,40,.14)"; }}
          >
            Explore Free Tools
          </button>
        </motion.div>
      </div>
    </section>
  );
}
