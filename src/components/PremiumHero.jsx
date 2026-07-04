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
    { value: "184", label: "days left", color: "#EF4444" },
    { value: "58", label: "chapters", color: "#0f172a" },
    { value: "1,200+", label: "questions", color: "#0f172a" }
  ],
  primaryButton = { text: "Start Now", onClick: () => {} },
  secondaryButton = { text: "See details", onClick: () => {} },
  chartPercentage = 68,
  chartLabel = "syllabus\\nrevised",
  floatingCards = []
}) {
  return (
    <section style={{ 
      position: "relative", 
      background: "#ffffff", 
      padding: "80px 0 100px", 
      overflow: "hidden",
      borderBottom: "1px solid #f1f5f9"
    }}>
      {/* Light Dotted Background Pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(#e2e8f0 1.5px, transparent 1.5px)",
        backgroundSize: "32px 32px",
        opacity: 0.8,
        zIndex: 0
      }} />

      <div className="container" style={{ 
        maxWidth: 1250, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1,
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center"
      }}>
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Badge */}
          <div style={{ 
            display: "inline-block", background: "#f1f5f9", color: "#334155", 
            padding: "6px 16px", borderRadius: 50, fontSize: "0.75rem", 
            fontWeight: 800, letterSpacing: "0.1em", marginBottom: 24, border: "1px solid #e2e8f0"
          }}>
            <span style={{ display: "inline-block", width: 6, height: 6, background: "#f59e0b", borderRadius: "50%", marginRight: 8, verticalAlign: "middle" }} />
            {badgeText}
          </div>

          {/* Heading */}
          <h1 style={{ 
            fontSize: "clamp(2.5rem, 4.5vw, 3.8rem)", fontWeight: 800, 
            lineHeight: 1.1, color: "#0f172a", marginBottom: 24, letterSpacing: "-1px"
          }}>
            {titlePart1}<br />
            {titlePart2}
            <span style={{ color: "#f59e0b" }}>{highlight1}</span>
            {titlePart3}
            <span style={{ color: "#10b981" }}>{highlight2}</span>
          </h1>

          {/* Description */}
          <p style={{ color: "#475569", fontSize: "1.15rem", lineHeight: 1.6, maxWidth: 540, marginBottom: 40 }}>
            {description}
          </p>

          {/* Stats Row */}
          <div style={{ display: "flex", gap: "40px", marginBottom: 40 }}>
            {stats.map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600, marginTop: 6, textTransform: "lowercase" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <button 
              onClick={primaryButton.onClick}
              style={{
                background: "#f59e0b", color: "#fff", border: "none",
                padding: "16px 28px", borderRadius: 12, fontSize: "1rem",
                fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)"
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 15px 30px rgba(245, 158, 11, 0.4)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(245, 158, 11, 0.3)"; }}
            >
              {primaryButton.text}
            </button>
            <button 
              onClick={secondaryButton.onClick}
              style={{
                background: "#ffffff", color: "#0f172a", border: "1px solid #e2e8f0",
                padding: "16px 28px", borderRadius: 12, fontSize: "1rem",
                fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                boxShadow: "0 4px 10px rgba(0,0,0,0.02)"
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "#ffffff"; }}
            >
              {secondaryButton.text}
            </button>
          </div>
        </motion.div>

        {/* Right Content - Visuals */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          style={{ position: "relative", height: 500, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {/* Central Circular Progress */}
          <div style={{ position: "relative", width: 280, height: 280 }}>
            {/* SVG Ring */}
            <svg width="280" height="280" viewBox="0 0 280 280" style={{ transform: "rotate(-90deg)" }}>
              {/* Background Ring */}
              <circle cx="140" cy="140" r="120" fill="none" stroke="#f1f5f9" strokeWidth="16" />
              {/* Progress Ring */}
              <motion.circle 
                cx="140" cy="140" r="120" fill="none" stroke="#10b981" strokeWidth="16" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 120}
                initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
                animate={{ strokeDashoffset: (2 * Math.PI * 120) * (1 - chartPercentage / 100) }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
              />
            </svg>
            {/* Center Content */}
            <div style={{ 
              position: "absolute", inset: 0, display: "flex", flexDirection: "column", 
              alignItems: "center", justifyContent: "center", textAlign: "center" 
            }}>
              <span style={{ fontSize: "3.5rem", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{chartPercentage}%</span>
              <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600, marginTop: 4, whiteSpace: "pre-line" }}>
                {chartLabel}
              </span>
            </div>
          </div>

          {/* Floating Cards */}
          {floatingCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + (idx * 0.15) }}
              whileHover={{ y: -5, scale: 1.02 }}
              style={{
                position: "absolute",
                ...card.pos,
                background: "#ffffff",
                padding: "20px",
                borderRadius: "16px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                border: "1px solid #f1f5f9",
                minWidth: "220px",
                zIndex: 10 + idx
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${card.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: card.color }}>
                  <card.icon size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}>{card.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>{card.subtitle}</div>
                </div>
              </div>
              <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${card.progress}%` }}
                  transition={{ duration: 1, delay: 1 + (idx * 0.1) }}
                  style={{ height: "100%", background: card.color, borderRadius: "4px" }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .container {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 40px !important;
          }
          .container > div:first-child p, .container > div:first-child div {
            margin-left: auto;
            margin-right: auto;
          }
          .container > div:first-child > div:nth-child(4) {
            justify-content: center;
          }
          .container > div:first-child > div:nth-child(5) {
            justify-content: center;
          }
        }
        @media (max-width: 600px) {
          .container > div:first-child > div:nth-child(4) {
            flex-direction: column;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
