import { motion } from "framer-motion";

// Edge-peeking orbit positions — each card sits partly outside the visual
// box so only ~75% shows (≈25% clipped by the container's overflow:hidden),
// giving the premium "bleed" look. Assigned by index so every hero — Class 11,
// Class 12, JEE and NEET strategy — shares the exact same layout.
const ORBIT_POSITIONS = [
  { top: -22, left: "4%" },        // peeks from the top edge
  { top: "24%", right: -46 },      // peeks from the right edge
  { bottom: -22, right: "8%" },    // peeks from the bottom edge
  { top: "22%", left: -46 },       // peeks from the left edge
];

export default function PremiumHero({
  badgeText = "SYLLABUS HUB",
  titlePart1 = "Two exams, one chapter list.",
  titlePart2 = "Study ",
  highlight1 = "once",
  titlePart3 = ", walk in ",
  highlight2 = "ready twice.",
  description = "Every chapter cross-tagged for overlap — so a night on Electrostatics counts for both, and nothing gets revised twice by accident.",
  stats = [
    { value: "184", label: "days left", color: "#f59e0b" },
    { value: "58", label: "chapters", color: "#0f172a" },
    { value: "1,200+", label: "questions", color: "#0f172a" }
  ],
  primaryButton = { text: "Start Now", onClick: () => {} },
  secondaryButton = { text: "See details", onClick: () => {} },
  chartPercentage = 68,
  chartLabel = "syllabus\nrevised",
  floatingCards = []
}) {
  const hasVisual = floatingCards && floatingCards.length > 0;

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 0.84, 0.32, 1] } }
  };

  return (
    <section className="premium-hero-section" style={{
      position: "relative",
      background: "#ffffff",
      padding: "100px 0 120px",
      overflow: "hidden",
      borderBottom: "1px solid #f1f5f9"
    }}>
      {/* Responsive rules (component is style-in-JS, so scope via a class) */}
      <style>{`
        .ph-grid { display: grid; gap: 80px; align-items: center; }
        .ph-grid.has-visual { grid-template-columns: 1.15fr 0.85fr; }
        @media (max-width: 900px) {
          .ph-grid.has-visual { grid-template-columns: 1fr; gap: 40px; }
          .ph-visual { height: 340px !important; margin-top: 10px; }
        }
        @media (max-width: 560px) {
          .ph-stats { gap: 28px !important; }
          .ph-visual { height: 300px !important; }
        }
      `}</style>

      {/* Soft dotted background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(#fcd34d 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        opacity: 0.28,
        zIndex: 0
      }} />

      <div className={`container ph-grid ${hasVisual ? "has-visual" : ""}`} style={{
        maxWidth: 1250, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1
      }}>

        {/* Left content */}
        <motion.div variants={staggerContainer} initial="hidden" animate="show">
          {/* Badge */}
          <motion.div variants={fadeUp} style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#fffbeb", color: "#b45309",
            padding: "8px 20px", borderRadius: 50, fontSize: "0.8rem",
            fontWeight: 800, letterSpacing: "0.14em", marginBottom: 30,
            border: "1px solid #fde68a", textTransform: "uppercase"
          }}>
            <motion.span
              animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{ display: "inline-block", width: 8, height: 8, background: "#f59e0b", borderRadius: "50%" }}
            />
            {badgeText}
          </motion.div>

          {/* Heading — inherits the site heading font (Space Grotesk / Sora) */}
          <motion.h1 variants={fadeUp} style={{
            fontSize: "clamp(2.6rem, 4.4vw, 3.9rem)", fontWeight: 800,
            lineHeight: 1.12, color: "#0f172a", marginBottom: 26, letterSpacing: "-0.5px"
          }}>
            {titlePart1}<br />
            {titlePart2}
            <span style={{ color: "#f59e0b" }}>{highlight1}</span>
            {titlePart3}
            <span style={{ color: "#f59e0b" }}>{highlight2}</span>
          </motion.h1>

          {/* Description — inherits the site body font (DM Sans) */}
          <motion.p variants={fadeUp} style={{
            color: "#475569", fontSize: "1.14rem", lineHeight: 1.7, maxWidth: 540, marginBottom: 44
          }}>
            {description}
          </motion.p>

          {/* Stats */}
          <motion.div variants={fadeUp} className="ph-stats" style={{ display: "flex", flexWrap: "wrap", gap: "48px", marginBottom: 44 }}>
            {stats.map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: "2.3rem", fontWeight: 800, color: stat.color, lineHeight: 1, letterSpacing: "-1px" }}>
                  {stat.value}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.82rem", fontWeight: 700, marginTop: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Buttons */}
          <motion.div variants={fadeUp} style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <motion.button
              whileHover={{ y: -3, boxShadow: "0 16px 34px rgba(245, 158, 11, 0.42)" }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              onClick={primaryButton.onClick}
              style={{
                background: "#f59e0b", color: "#fff", border: "none",
                padding: "18px 32px", borderRadius: 14, fontSize: "1.05rem",
                fontWeight: 700, cursor: "pointer",
                boxShadow: "0 10px 30px rgba(245, 158, 11, 0.3)"
              }}
            >
              {primaryButton.text}
            </motion.button>
            <motion.button
              whileHover={{ x: 5, color: "#d97706", background: "#fffbeb" }}
              onClick={secondaryButton.onClick}
              style={{
                background: "transparent", color: "#f59e0b", border: "none",
                fontSize: "1rem", fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8
              }}
            >
              {secondaryButton.text}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right visual — orbiting cards that peek ~25% past the edges */}
        {hasVisual && (
          <motion.div
            className="ph-visual"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 0.84, 0.32, 1] }}
            style={{ position: "relative", height: 450, overflow: "hidden" }}
          >
            {/* Slowly rotating dashed orbit rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
              style={{ position: "absolute", top: "50%", left: "50%", x: "-50%", y: "-50%", width: 300, height: 300, borderRadius: "50%", border: "2px dashed #fcd34d", opacity: 0.5 }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 90, ease: "linear" }}
              style={{ position: "absolute", top: "50%", left: "50%", x: "-50%", y: "-50%", width: 400, height: 400, borderRadius: "50%", border: "1px dashed #fde68a", opacity: 0.55 }}
            />

            {/* Center node with animated progress ring */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 180, damping: 16 }}
              style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                width: 152, height: 152, zIndex: 10
              }}
            >
              <svg width="152" height="152" viewBox="0 0 152 152" style={{ position: "absolute", inset: 0 }}>
                <circle cx="76" cy="76" r="70" fill="none" stroke="#fef3c7" strokeWidth="6" />
                <motion.circle
                  cx="76" cy="76" r="70" fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round"
                  transform="rotate(-90 76 76)"
                  strokeDasharray={2 * Math.PI * 70}
                  initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - chartPercentage / 100) }}
                  transition={{ duration: 1.4, delay: 0.7, ease: "easeInOut" }}
                />
              </svg>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                style={{
                  position: "absolute", inset: 12, background: "#ffffff", borderRadius: "50%",
                  boxShadow: "0 20px 40px rgba(245, 158, 11, 0.16)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                }}
              >
                <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "#f59e0b", lineHeight: 1 }}>{chartPercentage}%</div>
                <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700, marginTop: 5, whiteSpace: "pre-line", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.03em" }}>{chartLabel}</div>
              </motion.div>
            </motion.div>

            {/* Orbiting cards — positioned by index so they peek in from the edges */}
            {floatingCards.map((card, idx) => {
              const Icon = card.icon;
              const pos = ORBIT_POSITIONS[idx % ORBIT_POSITIONS.length];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.5 + idx * 0.15 },
                    scale: { duration: 0.5, delay: 0.5 + idx * 0.15 },
                    y: { repeat: Infinity, duration: 3.2 + idx * 0.6, ease: "easeInOut", delay: idx * 0.4 }
                  }}
                  style={{
                    position: "absolute", ...pos,
                    background: "#ffffff", padding: "14px 16px", borderRadius: 16,
                    boxShadow: "0 15px 35px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9",
                    display: "flex", gap: 12, alignItems: "center", width: 178, zIndex: 12 + idx
                  }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: 12, background: card.color + "15",
                    display: "flex", alignItems: "center", justifyContent: "center", color: card.color, flexShrink: 0
                  }}>
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{card.title}</div>
                    <div style={{ fontSize: "0.74rem", color: "#64748b", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{card.subtitle}</div>
                    <div style={{ width: "100%", height: 4, background: "#f1f5f9", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${card.progress}%` }}
                        transition={{ duration: 1, delay: 0.8 + idx * 0.15, ease: "easeOut" }}
                        style={{ height: "100%", background: card.color, borderRadius: 2 }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
