import { motion } from "framer-motion";

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
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 0.84, 0.32, 1] } }
  };

  return (
    <section style={{ 
      position: "relative", 
      background: "#ffffff", 
      padding: "100px 0 120px", 
      overflow: "hidden",
      borderBottom: "1px solid #f1f5f9"
    }}>
      {/* Light Dotted Background Pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(#fcd34d 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        opacity: 0.3,
        zIndex: 0
      }} />

      <div className="container" style={{ 
        maxWidth: 1250, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1,
        display: "grid", gridTemplateColumns: floatingCards && floatingCards.length > 0 ? "1.2fr 0.8fr" : "1fr", gap: "80px", alignItems: "center"
      }}>
        
        {/* Left Content */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} style={{ 
            display: "inline-block", background: "#fffbeb", color: "#b45309", 
            padding: "8px 20px", borderRadius: 50, fontSize: "0.8rem", 
            fontWeight: 800, letterSpacing: "0.15em", marginBottom: 32, border: "1px solid #fde68a",
            textTransform: "uppercase"
          }}>
            <span style={{ display: "inline-block", width: 8, height: 8, background: "#f59e0b", borderRadius: "50%", marginRight: 10, verticalAlign: "middle" }} />
            {badgeText}
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={fadeUp} style={{ 
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(2.8rem, 4.5vw, 4rem)", fontWeight: 800, 
            lineHeight: 1.1, color: "#0f172a", marginBottom: 28, letterSpacing: "-1px"
          }}>
            {titlePart1}<br />
            {titlePart2}
            <span style={{ color: "#f59e0b" }}>{highlight1}</span>
            {titlePart3}
            <span style={{ color: "#f59e0b" }}>{highlight2}</span>
          </motion.h1>

          {/* Description */}
          <motion.p variants={fadeUp} style={{ 
            color: "#475569", fontSize: "1.15rem", lineHeight: 1.7, maxWidth: 540, marginBottom: 48,
            fontFamily: "'Inter', sans-serif"
          }}>
            {description}
          </motion.p>

          {/* Stats Row */}
          <motion.div variants={fadeUp} style={{ display: "flex", gap: "48px", marginBottom: 48 }}>
            {stats.map((stat, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "2.4rem", fontWeight: 800, color: stat.color, lineHeight: 1, letterSpacing: "-1px" }}>
                  {stat.value}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 700, marginTop: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Buttons */}
          <motion.div variants={fadeUp} style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={primaryButton.onClick}
              style={{
                background: "#f59e0b", color: "#fff", border: "none",
                padding: "18px 32px", borderRadius: 14, fontSize: "1.05rem",
                fontWeight: 700, cursor: "pointer",
                boxShadow: "0 10px 30px rgba(245, 158, 11, 0.3)"
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 15px 30px rgba(245, 158, 11, 0.4)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(245, 158, 11, 0.3)"; }}
            >
              {primaryButton.text}
            </motion.button>
            <motion.button 
              whileHover={{ x: 5 }}
              onClick={secondaryButton.onClick}
              style={{
                background: "transparent", color: "#f59e0b", border: "none",
                fontSize: "1rem", fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = "#d97706"; e.currentTarget.style.background = "#fffbeb"; }}
              onMouseOut={(e) => { e.currentTarget.style.color = "#f59e0b"; e.currentTarget.style.background = "transparent"; }}
            >
              {secondaryButton.text}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Content - Visuals (Only rendered if floatingCards exist) */}
        {floatingCards && floatingCards.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ position: "relative", height: "450px" }}
          >
            {/* Background elements */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 280, height: 280, borderRadius: "50%", border: "2px dashed #fcd34d", opacity: 0.5 }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 380, height: 380, borderRadius: "50%", border: "1px dashed #fef3c7", opacity: 0.5 }} />
            
            {/* Center Node */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                width: 140, height: 140, background: "#ffffff", borderRadius: "50%",
                boxShadow: "0 20px 40px rgba(245, 158, 11, 0.15)", border: "1px solid #fef3c7",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10
              }}
            >
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f59e0b", lineHeight: 1 }}>{chartPercentage}%</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, marginTop: 4, whiteSpace: "pre-line", textAlign: "center", textTransform: "uppercase" }}>{chartLabel}</div>
            </motion.div>

            {/* Orbiting Cards */}
            {floatingCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div 
                  key={idx}
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 3 + idx, ease: "easeInOut", delay: idx * 0.5 }}
                  style={{
                    position: "absolute", ...card.pos,
                    background: "#ffffff", padding: "16px", borderRadius: 16,
                    boxShadow: "0 15px 35px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9",
                    display: "flex", gap: 12, alignItems: "center", minWidth: 160, zIndex: 10 + idx
                  }}
                >
                  <div style={{ 
                    width: 42, height: 42, borderRadius: 12, background: card.color + "15",
                    display: "flex", alignItems: "center", justifyContent: "center", color: card.color
                  }}>
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>{card.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>{card.subtitle}</div>
                    <div style={{ width: "100%", height: 4, background: "#f1f5f9", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                      <div style={{ width: `${card.progress}%`, height: "100%", background: card.color, borderRadius: 2 }} />
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
