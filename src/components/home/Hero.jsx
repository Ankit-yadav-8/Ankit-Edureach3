import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Target, Users } from "lucide-react";

/* ════════════════════════════════════════════════
   HERO — simple, editorial. Warm cream canvas with a
   dotted grid, faint dashed orbits and a giant faint
   "College Parichay" watermark. Word-by-word headline
   reveal ending in a coral script word. No cards / images.
════════════════════════════════════════════════ */

const CORAL    = "#FF5A36";
const CORAL_DK = "#E0421F";
const INK      = "#4A4438";
const TEXT_SOFT= "#8A8272";
const BASE     = "#FFFFFF";
const SHADOW_DK = "rgba(0,0,0,0.08)";
const SHADOW_LT = "#FFFFFF";

const raised = `8px 8px 16px ${SHADOW_DK}, -8px -8px 16px ${SHADOW_LT}`;
const raisedSm = `4px 4px 8px ${SHADOW_DK}, -4px -4px 8px ${SHADOW_LT}`;
const pressed = `inset 4px 4px 8px ${SHADOW_DK}, inset -4px -4px 8px ${SHADOW_LT}`;
const searchShadow = `inset 6px 6px 14px ${SHADOW_DK}, inset -6px -6px 14px ${SHADOW_LT}`;

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
  { n: "02", title: "Rank", to: "/jee-main", desc: "Your mentor lifts your rank with 1-on-1 doubt solving and a plan to clear every backlog." },
  { n: "03", title: "Dream College", to: "/for-you", desc: "Guided by your mentor every step, you'll reach your dream college." },
];
const stepsContainer = { hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } };
const stepVariant = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

/* simple straight line connecting the three nodes, faded at the ends */
function JourneyLine() {
  return (
    <div aria-hidden style={{ position: "absolute", top: 27, left: "16%", right: "16%", height: 3, zIndex: 0,
      background: `linear-gradient(90deg, ${CORAL} 0%, ${CORAL} 40%, ${SHADOW_DK} 40%, ${SHADOW_DK} 100%)`, borderRadius: 2 }} />
  );
}

function HeroSteps({ isMobile }) {
  return (
    <motion.div
      variants={stepsContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }}
      style={{ maxWidth: 980, margin: isMobile ? "2.4rem auto 0" : "3rem auto 0", position: "relative" }}
    >
      {/* animated journey line behind the circles (desktop/tablet) */}
      {!isMobile && <JourneyLine />}
      {/* desktop: 3 across · mobile: triangle (01 on top, 02 & 03 below) */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", columnGap: isMobile ? 16 : 24, rowGap: isMobile ? 34 : 0 }}>
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n} variants={stepVariant}
            style={{ textAlign: "center", position: "relative", zIndex: 1, gridColumn: isMobile && i === 0 ? "1 / -1" : "auto" }}
          >
            <div style={{
              width: 54, height: 54, borderRadius: "50%", margin: "0 auto 16px",
              background: i === 0 ? CORAL : BASE,
              boxShadow: i === 0 ? `inset 3px 3px 6px rgba(0,0,0,0.15), inset -3px -3px 6px rgba(255,255,255,0.3)` : pressed,
              display: "grid", placeItems: "center",
            }}>
              <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 17, color: i === 0 ? "#fff" : CORAL }}>{s.n}</span>
            </div>
            <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: isMobile ? 16 : 18, color: INK, marginBottom: 8 }}>{s.title}</div>
            <p style={{ margin: "0 auto", maxWidth: isMobile ? 230 : 250, fontSize: isMobile ? 12.5 : 13.5, color: TEXT_SOFT, lineHeight: 1.55, fontFamily: "'Inter',system-ui,sans-serif" }}>{s.desc}</p>
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
    <>
    <section style={{ position: "relative", overflow: "hidden", width: "100%", boxSizing: "border-box", background: BASE }}>
      {/* ── content ── */}
      <div className="container" style={{
        position: "relative", zIndex: 2, width: "100%", boxSizing: "border-box",
        paddingInline: "1.5rem", textAlign: "center",
        paddingTop: isXs ? 116 : isMobile ? 124 : 128,
        paddingBottom: isMobile ? 72 : 72,
      }}>
        {/* badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: BASE, color: CORAL, borderRadius: 9999, padding: "6px 16px", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.5px", fontFamily: "'Inter',system-ui,sans-serif", marginBottom: 28, boxShadow: raisedSm }}
        >
          <motion.span animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 1.8, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: "50%", background: CORAL, boxShadow: `inset 2px 2px 4px rgba(0,0,0,0.2)` }} />
          Built for JEE &amp; NEET aspirants
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
          style={{ margin: `${isMobile ? "1.6rem" : "2rem"} auto 0`, maxWidth: 560, fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 500, fontSize: isXs ? "1rem" : "1.1rem", color: TEXT_SOFT, lineHeight: 1.65 }}
        >
          An <span style={{ position: "relative", color: CORAL, fontWeight: 700, whiteSpace: "nowrap" }}>
            IIT Roorkee
            <svg width="100%" height="8" viewBox="0 0 120 8" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: "-3px", width: "100%" }}>
              <motion.path d="M2 5 C 30 2, 90 2, 118 4" stroke={CORAL} strokeWidth="2.5" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 1.5, ease: "easeInOut" }} />
            </svg>
          </span> startup — built by IITians, trusted by aspirants
        </motion.p>

        {/* CTAs — wide search bar + two action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.05 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, marginTop: isMobile ? "2.4rem" : "2.8rem" }}
        >
          {/* wide search bar */}
          <div
            onClick={openSearch}
            style={{
              display: "flex", alignItems: "center", gap: 10, cursor: "text", boxSizing: "border-box",
              width: "100%", maxWidth: 540, padding: isXs ? "7px 7px 7px 16px" : "8px 8px 8px 20px",
              background: BASE, borderRadius: 9999,
              boxShadow: searchShadow,
            }}
          >
            <Search size={18} style={{ color: TEXT_SOFT, flexShrink: 0 }} />
            <span style={{ flex: 1, textAlign: "left", color: TEXT_SOFT, fontFamily: "'Inter',system-ui,sans-serif",
              fontSize: isXs ? 13 : 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Search colleges, entrance exams, or rankings…
            </span>
            <button
              onClick={openSearch}
              style={{
                flexShrink: 0, cursor: "pointer", border: "none", background: CORAL, color: "#fff",
                padding: isXs ? "9px 16px" : "11px 26px", borderRadius: 9999,
                fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 700, fontSize: isXs ? 13 : 14.5,
                boxShadow: `4px 4px 10px rgba(255,90,54,0.3), -4px -4px 10px ${SHADOW_LT}`, transition: "all .2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `6px 6px 14px rgba(255,90,54,0.3), -6px -6px 14px ${SHADOW_LT}`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `4px 4px 10px rgba(255,90,54,0.3), -4px -4px 10px ${SHADOW_LT}`; }}
            >
              Search
            </button>
          </div>

          {/* action buttons */}
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", justifyContent: "center", gap: isMobile ? 16 : 24, marginTop: isMobile ? "2.5rem" : "3rem", width: "100%" }}>
            <button
              onClick={() => nav("/mentorship/jee-2027")}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, cursor: "pointer",
                width: isMobile ? "100%" : undefined, maxWidth: isMobile ? 360 : undefined, minWidth: !isMobile ? 200 : undefined, 
                padding: isMobile ? "16px 24px" : "12px 24px", borderRadius: 9999, whiteSpace: "nowrap",
                background: CORAL, border: "none", color: "#fff",
                fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 700, fontSize: isXs ? 15 : 16,
                boxShadow: `inset 4px 4px 10px rgba(0,0,0,0.2), inset -4px -4px 10px rgba(255,255,255,0.3)`, transition: "all .2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `inset 6px 6px 14px rgba(0,0,0,0.25), inset -6px -6px 14px rgba(255,255,255,0.35)`; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `inset 4px 4px 10px rgba(0,0,0,0.2), inset -4px -4px 10px rgba(255,255,255,0.3)`; }}
            >
              Explore Mentorship <Target size={16} />
            </button>
            <button
              onClick={() => nav("/community")}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, cursor: "pointer",
                width: isMobile ? "100%" : undefined, maxWidth: isMobile ? 360 : undefined, minWidth: !isMobile ? 200 : undefined, 
                padding: isMobile ? "16px 24px" : "12px 24px", borderRadius: 9999, whiteSpace: "nowrap",
                background: BASE, border: "none", color: INK,
                fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 700, fontSize: isXs ? 15 : 16,
                boxShadow: pressed, transition: "all .2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `inset 6px 6px 12px ${SHADOW_DK}, inset -6px -6px 12px ${SHADOW_LT}`; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = pressed; }}
            >
              Join community <Users size={16} />
            </button>
          </div>
        </motion.div>

        {/* social proof — avatar cluster + count, framed by hairlines */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.2 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: isMobile ? 8 : 18, marginTop: isMobile ? "4.5rem" : "5.5rem", width: "100%" }}
        >
          <span style={{ width: isMobile ? 16 : 56, flexShrink: 0, height: 1, borderRadius: 1, background: `linear-gradient(90deg, transparent, rgba(0,0,0,0.15))` }} />
          <div style={{ display: "flex" }}>
            {[["#FF7A59", "A"], ["#FF5A36", "P"], ["#7C5CFF", "R"], [BASE, "+"]].map(([c, ltr], i) => (
              <span key={i} style={{
                width: 32, height: 32, borderRadius: "50%", background: c,
                border: `2px solid ${BASE}`, marginLeft: i === 0 ? 0 : -10,
                boxShadow: c === BASE ? pressed : `2px 2px 5px rgba(0,0,0,0.1)`,
                display: "grid", placeItems: "center",
                color: c === BASE ? TEXT_SOFT : "#fff", fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 700, fontSize: 13,
              }}>{ltr}</span>
            ))}
          </div>
          <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontSize: isXs ? 13 : 14, color: TEXT_SOFT, whiteSpace: "normal", textAlign: "center" }}>
            Trusted by <strong style={{ color: CORAL, fontWeight: 800 }}>3200+</strong> JEE &amp; NEET aspirants
          </span>
          <span style={{ width: isMobile ? 16 : 56, flexShrink: 0, height: 1, borderRadius: 1, background: `linear-gradient(90deg, rgba(0,0,0,0.15), transparent)` }} />
        </motion.div>
      </div>
    </section>
    
    <section style={{ width: "100%", background: BASE, paddingBottom: isMobile ? 72 : 92 }}>
      <div className="container" style={{ paddingInline: "1.5rem" }}>
        {/* ══ 3-step journey ══ */}
        <HeroSteps isMobile={isMobile} />
      </div>
    </section>
    </>
  );
}
