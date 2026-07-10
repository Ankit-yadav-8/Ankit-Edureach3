import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ORBIT_POSITIONS = [
  { top: "5%", left: "5%" },       // top-left
  { top: "5%", right: "5%" },     // top-right
  { bottom: "10%", left: "5%" },   // bottom-left
  { bottom: "10%", right: "5%" },   // bottom-right
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
    { value: "184", label: "days left" },
    { value: "58", label: "chapters" },
    { value: "1,200+", label: "questions" }
  ],
  primaryButton = { text: "Start Now", onClick: () => {} },
  secondaryButton = { text: "See details", onClick: () => {} },
  floatingCards = []
}) {
  const hasVisual = floatingCards && floatingCards.length > 0;

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 0.84, 0.32, 1] } }
  };

  return (
    <section className="premium-hero-section" style={{
      position: "relative",
      background: "var(--page-bg)",
      padding: "100px 0 80px",
      overflow: "hidden",
      minHeight: "85vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {/* ── Background Animations: Concentric Circles ── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        {/* Circle 1 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
          style={{
            position: "absolute", top: "50%", left: "50%",
            width: "50vw", height: "50vw", minWidth: 600, minHeight: 600,
            marginTop: "-25vw", marginLeft: "-25vw",
            borderRadius: "50%", border: "1px dashed rgba(255, 105, 61, 0.2)",
          }}
        >
          <div style={{ position: "absolute", top: "10%", left: "10%", width: 6, height: 6, borderRadius: "50%", background: "#ff693d", opacity: 0.5 }} />
        </motion.div>
        
        {/* Circle 2 */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
          style={{
            position: "absolute", top: "50%", left: "50%",
            width: "70vw", height: "70vw", minWidth: 900, minHeight: 900,
            marginTop: "-35vw", marginLeft: "-35vw",
            borderRadius: "50%", border: "1px dotted rgba(255, 105, 61, 0.15)",
          }}
        >
          <div style={{ position: "absolute", top: "20%", right: "15%", width: 4, height: 4, borderRadius: "50%", background: "#ff693d", opacity: 0.4 }} />
        </motion.div>

        {/* Circle 3 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 160, ease: "linear" }}
          style={{
            position: "absolute", top: "50%", left: "50%",
            width: "90vw", height: "90vw", minWidth: 1200, minHeight: 1200,
            marginTop: "-45vw", marginLeft: "-45vw",
            borderRadius: "50%", border: "1px dashed rgba(255, 105, 61, 0.1)",
          }}
        >
          <div style={{ position: "absolute", bottom: "20%", left: "15%", width: 8, height: 8, borderRadius: "50%", background: "#ff693d", opacity: 0.3 }} />
        </motion.div>
      </div>

      <div className="container" style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"
      }}>
        
        {/* Floating Cards for Desktop */}
        {hasVisual && (
          <div className="ph-floating-cards" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <style>{`
              @media (max-width: 1024px) {
                .ph-floating-cards { display: none; }
              }
            `}</style>
            {floatingCards.map((card, i) => {
              const pos = ORBIT_POSITIONS[i % 4];
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1), duration: 0.6, type: "spring" }}
                  style={{
                    position: "absolute",
                    ...pos,
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderRadius: 24,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                    border: "1px solid rgba(255,255,255,0.8)",
                    minWidth: 220,
                    pointerEvents: "auto",
                    textAlign: "left"
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${card.color}15`, display: "grid", placeItems: "center"
                  }}>
                    {Icon && <Icon size={20} color={card.color} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Sora", fontWeight: 700, color: "#111827", fontSize: "0.95rem" }}>{card.title}</div>
                    <div style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: 2 }}>{card.subtitle}</div>
                  </div>
                  {/* Progress Line */}
                  <div style={{
                    position: "absolute", bottom: 0, left: "10%", right: "10%", height: 3,
                    background: "#f1f5f9", borderRadius: "4px 4px 0 0"
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${card.progress || 50}%` }}
                      transition={{ delay: 0.8, duration: 1 }}
                      style={{ height: "100%", background: card.color, borderRadius: "4px 4px 0 0" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ maxWidth: 760, position: "relative", zIndex: 10 }}>
          
          {/* Badge */}
          <motion.div variants={fadeUp} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#fff",
            color: "#ff693d",
            padding: "8px 20px", borderRadius: 50, fontSize: "0.75rem",
            fontWeight: 800, letterSpacing: "0.12em", marginBottom: 32,
            border: "1px solid rgba(255, 105, 61, 0.2)", textTransform: "uppercase",
            boxShadow: "0 4px 12px rgba(255, 105, 61, 0.08)"
          }}>
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              style={{ display: "inline-block", width: 6, height: 6, background: "#ff693d", borderRadius: "50%" }}
            />
            {badgeText}
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={fadeUp} style={{
            fontSize: "clamp(3rem, 5.5vw, 4.8rem)", fontWeight: 800,
            lineHeight: 1.1, color: "#111827", marginBottom: 24, letterSpacing: "-0.03em",
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            {titlePart1}
            <span style={{ color: "#ff693d", fontStyle: "italic" }}>{highlight1}</span>
            <br />
            {titlePart2}
            <span style={{ color: "#ff693d", fontStyle: "italic" }}>{highlight2}</span>
            {titlePart3}
          </motion.h1>

          {/* Description */}
          <motion.p variants={fadeUp} style={{
            color: "#6b7280", fontSize: "1.15rem", lineHeight: 1.6, maxWidth: 640, margin: "0 auto 40px",
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500
          }}>
            {description}
          </motion.p>

          {/* Buttons */}
          <motion.div variants={fadeUp} style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
            <motion.button
              whileHover={{ y: -2, boxShadow: "0 12px 30px rgba(255, 105, 61, 0.4)" }}
              whileTap={{ scale: 0.97 }}
              onClick={primaryButton.onClick}
              style={{
                background: "linear-gradient(135deg, #ff693d 0%, #ff8f6b 100%)",
                color: "#fff", border: "none",
                padding: "16px 32px", borderRadius: 50, fontSize: "1.05rem",
                fontWeight: 700, cursor: "pointer",
                boxShadow: "0 8px 24px rgba(255, 105, 61, 0.3)",
                display: "flex", alignItems: "center", gap: 8,
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              {primaryButton.text} <ArrowRight size={18} />
            </motion.button>
            
            <motion.button
              whileHover={{ color: "#ff693d", background: "rgba(255, 105, 61, 0.05)" }}
              onClick={secondaryButton.onClick}
              style={{
                background: "transparent", color: "#4b5563", border: "none",
                fontSize: "1.05rem", fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6, padding: "16px 24px", borderRadius: 50,
                fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.2s"
              }}
            >
              {secondaryButton.text} <ArrowRight size={18} />
            </motion.button>
          </motion.div>

          {/* Stats below buttons */}
          <motion.div variants={fadeUp} style={{ 
            display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "60px",
            borderTop: "1px dashed rgba(0,0,0,0.08)", paddingTop: 40
          }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ 
                  fontSize: "2.4rem", fontWeight: 800, color: "#ff693d", lineHeight: 1, 
                  fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-1px" 
                }}>
                  {stat.value}
                </div>
                <div style={{ color: "#9ca3af", fontSize: "0.75rem", fontWeight: 800, marginTop: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
