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

/* ── background: soft frosted-glass shapes drifting behind the hero
   (rounded squares, a pill and a circle), recreated from the reference
   with a gentle float + rotate. Kept subtle so the headline stays hero. ── */
const SHAPES = [
  // top-left — peach rounded square (largest)
  { w: 180, h: 180, top: "5%",  left: "2%",  radius: "34%", rot: -12,
    bg: "linear-gradient(140deg, #FFE4D6, #FFD0BC)", dur: 20, dx: 14,  dy: 24,  dr: 6 },
  // top-right — lavender rounded square (raised into the corner)
  { w: 130, h: 130, top: "9%",  left: "85%", radius: "30%", rot: 14,
    bg: "linear-gradient(140deg, #E7DEFF, #CDBEFB)", dur: 24, dx: -16, dy: 28,  dr: -8 },
  // bottom-left — lavender rounded square
  { w: 128, h: 128, top: "64%", left: "3%",  radius: "30%", rot: -14,
    bg: "linear-gradient(140deg, #E7DEFF, #CDBEFB)", dur: 22, dx: 18,  dy: -22, dr: 7 },
  // bottom-right — peach circle (dropped low, well clear of the top-right)
  { w: 150, h: 150, top: "72%", left: "84%", radius: "50%", rot: 0,
    bg: "linear-gradient(150deg, #FFD9C4, #FFC4A8)", dur: 18, dx: -14, dy: -26, dr: 0 },
];

function HeroBackground() {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* plain white base */}
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF" }} />
      {/* frosted glass shapes — organic drift, rotate & breathe, each out of phase */}
      {SHAPES.map((s, i) => (
        <motion.div
          key={i}
          animate={{ x: [0, s.dx, 0], y: [0, s.dy, 0], rotate: [s.rot, s.rot + s.dr, s.rot], scale: [1, 1.05, 1] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
          style={{
            position: "absolute", top: s.top, left: s.left,
            width: s.w, height: s.h, borderRadius: s.radius,
            background: s.bg,
            border: "1px solid rgba(255,255,255,0.65)",
            boxShadow: "0 30px 60px -20px rgba(120,90,110,0.28), inset 0 1px 2px rgba(255,255,255,0.7)",
          }}
        />
      ))}
    </div>
  );
}

/* ── 3-step journey: Mentorship → Rank → Dream College ── */
const STEPS = [
  { n: "01", title: "Mentorship", to: "/mentorship", desc: "A 1-on-1 IITian / doctor mentor with daily targets and weekly test analysis." },
  { n: "02", title: "Rank", to: "/jee-main", desc: "Your mentor reads your test data and predictors to fix a realistic target rank." },
  { n: "03", title: "Dream College", to: "/for-you", desc: "Your mentor maps that rank to the right IIT, NIT & IIIT and plans your JoSAA choices." },
];
const stepsContainer = { hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } };
const stepVariant = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

/* smooth wave threading the three node centres (x = 167 / 500 / 833), with a
   gentle downward valley in each gap so it reads the same across both bays */
const WAVE = "M0 54 C 55 51 112 50 167 50 C 250 50 292 64 333 64 C 378 64 432 51 500 50 C 572 50 622 64 667 64 C 712 64 758 51 833 50 C 905 50 952 49 1000 46";
const NODE_LEFTS = ["16.667%", "50%", "83.333%"];

/* soft ring around a node — a faint static ring plus one gentle looping pulse */
function PulseRing({ left, delay }) {
  return (
    <div aria-hidden style={{ position: "absolute", top: 34, left, zIndex: 0 }}>
      <span style={{ position: "absolute", top: 0, left: 0, transform: "translate(-50%,-50%)",
        width: 82, height: 82, borderRadius: "50%", border: "1px solid rgba(255,90,54,.16)" }} />
      <motion.span
        style={{ position: "absolute", top: 0, left: 0, x: "-50%", y: "-50%",
          width: 68, height: 68, borderRadius: "50%", border: "1.5px solid rgba(255,90,54,.4)" }}
        animate={{ scale: [1, 1.4], opacity: [0.45, 0] }}
        transition={{ duration: 2.8, ease: "easeOut", repeat: Infinity, delay }}
      />
    </div>
  );
}

function JourneyLine() {
  return (
    <>
      {/* gently pulsing rings under each node */}
      {NODE_LEFTS.map((l, i) => <PulseRing key={i} left={l} delay={i * 0.5} />)}
      {/* static wavy connecting line, coral in the middle, fading to dotted at the ends */}
      <svg aria-hidden viewBox="0 0 1000 100" preserveAspectRatio="none"
        style={{ position: "absolute", top: -16, left: 0, width: "100%", height: 100, zIndex: 0, overflow: "visible", pointerEvents: "none" }}>
        <defs>
          <linearGradient id="coralFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0"    stopColor="#FF5A36" stopOpacity="0" />
            <stop offset="0.07" stopColor="#FF5A36" stopOpacity="1" />
            <stop offset="0.93" stopColor="#FF5A36" stopOpacity="1" />
            <stop offset="1"    stopColor="#FF5A36" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* faint dotted guide — shows through at the faded ends */}
        <path d={WAVE} fill="none" stroke="rgba(255,90,54,.3)" strokeWidth="4" strokeDasharray="0.1 12" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {/* solid coral wave (static) */}
        <path d={WAVE} fill="none" stroke="url(#coralFade)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </>
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
              width: 68, height: 68, borderRadius: "50%", margin: "0 auto 16px",
              background: "#fff", border: "1px solid rgba(28,28,40,.1)",
              boxShadow: "0 10px 26px -10px rgba(28,28,40,.2)", display: "grid", placeItems: "center",
            }}>
              <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 22, color: CORAL }}>{s.n}</span>
            </div>
            <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: isMobile ? 16 : 18, color: INK, marginBottom: 8 }}>{s.title}</div>
            <p style={{ margin: "0 auto", maxWidth: isMobile ? 230 : 250, fontSize: isMobile ? 12.5 : 13.5, color: "#6b6770", lineHeight: 1.55, fontFamily: "'Inter',system-ui,sans-serif" }}>{s.desc}</p>
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
      {/* ── animated coral aurora background ── */}
      <HeroBackground />
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
          style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,90,54,.07)", border: "1px solid rgba(255,90,54,.18)", color: CORAL_DK, borderRadius: 9999, padding: "6px 14px", fontSize: 11.5, fontWeight: 600, letterSpacing: "0.5px", fontFamily: "'Inter',system-ui,sans-serif", marginBottom: 28 }}
        >
          <motion.span animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 1.8, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: CORAL }} />
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

        {/* social proof — avatar cluster + count, framed by hairlines */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.2 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 14, marginTop: isMobile ? "1.4rem" : "1.6rem" }}
        >
          <span style={{ width: isMobile ? 22 : 42, height: 1, background: "linear-gradient(90deg, transparent, rgba(28,28,40,.22))" }} />
          <div style={{ display: "flex" }}>
            {["#FF7A59", "#FFB088", "#7C5CFF", "#FFC24B"].map((c, i) => (
              <span key={i} style={{
                width: 30, height: 30, borderRadius: "50%", background: c,
                border: "2px solid #fff", marginLeft: i === 0 ? 0 : -10,
                boxShadow: "0 2px 6px rgba(0,0,0,.12)",
              }} />
            ))}
          </div>
          <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontSize: isXs ? 13 : 14, color: "#6b6770", whiteSpace: "nowrap" }}>
            <strong style={{ color: CORAL, fontWeight: 800 }}>3200+</strong> students trust on us
          </span>
          <span style={{ width: isMobile ? 22 : 42, height: 1, background: "linear-gradient(90deg, rgba(28,28,40,.22), transparent)" }} />
        </motion.div>

        {/* ══ 3-step journey ══ */}
        <HeroSteps isMobile={isMobile} />
      </div>
    </section>
  );
}
