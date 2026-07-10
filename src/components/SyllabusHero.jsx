import { motion } from "framer-motion";

/*
 * SyllabusHero — centred "Syllabus Hub" hero used by Class 11 & Class 12.
 * Big display headline with coral italic accents, a pulsing badge pill,
 * two CTAs, a centred stat row, and four subject cards floating at the
 * corners over a warm dot-grid + rotating dashed-ellipse backdrop.
 */

// Corner anchor + entrance-slide direction for each floating card (by index).
const CORNERS = [
  { pos: { top: 22, left: 36 },    from: { x: -46, y: -26 } }, // top-left
  { pos: { top: 22, right: 36 },   from: { x: 46, y: -26 } },  // top-right
  { pos: { bottom: 30, left: 36 }, from: { x: -46, y: 26 } },  // bottom-left
  { pos: { bottom: 30, right: 36 },from: { x: 46, y: 26 } },   // bottom-right
];

const CORAL = "#FF693D";
const INK = "#141428";

export default function SyllabusHero({
  badgeText = "SYLLABUS HUB",
  titleLines = [
    [{ text: "Master the" }],
    [{ text: "Fundamentals.", accent: true }],
    [{ text: "Crack the " }, { text: "Future.", accent: true }],
  ],
  description = "A premium chapter-wise toolkit for Physics, Chemistry, Mathematics and Biology — everything you need to build a rock-solid foundation for JEE & NEET.",
  primaryButton = { text: "Start Learning", onClick: () => {} },
  secondaryButton = { text: "Explore Full Syllabus", onClick: () => {} },
  stats = [],
  floatingCards = [],
}) {
  const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 0.84, 0.32, 1] } },
  };

  const accentStyle = {
    fontStyle: "italic",
    background: "linear-gradient(100deg, #FF5A34 0%, #FF8A5B 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
  };

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--page-bg)",
        padding: "104px 0 120px",
      }}
    >
      <style>{`
        .sh-inner { max-width: 720px; margin: 0 auto; padding: 0 24px; text-align: center; position: relative; z-index: 3; }
        .sh-title { font-family: "Space Grotesk","Sora",sans-serif; font-weight: 700; color: ${INK};
          font-size: clamp(2.5rem, 6.4vw, 4.5rem); line-height: 1.04; letter-spacing: -0.02em; margin: 0 0 24px; }
        .sh-deco { position: absolute; inset: 0; max-width: 1340px; margin: 0 auto; z-index: 2; pointer-events: none; }
        .sh-card { position: absolute; width: 208px; background: #fff; border-radius: 22px;
          box-shadow: 0 18px 44px rgba(20,20,40,0.09), 0 2px 8px rgba(20,20,40,0.04);
          padding: 16px 18px; pointer-events: auto; }
        @media (max-width: 940px) { .sh-card { display: none; } }
        @media (max-width: 560px) {
          .sh-btns { flex-direction: column; width: 100%; }
          .sh-btns > * { width: 100%; justify-content: center; }
          .sh-stats { gap: 30px !important; }
        }
      `}</style>

      {/* Warm dot-grid texture */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "radial-gradient(rgba(255,105,61,0.16) 1px, transparent 1px)",
        backgroundSize: "22px 22px", opacity: 0.5,
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 45%, #000 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 45%, #000 40%, transparent 100%)",
      }} />

      {/* Radial coral glow behind the headline */}
      <div style={{
        position: "absolute", top: "42%", left: "50%", transform: "translate(-50%, -50%)",
        width: 620, height: 620, borderRadius: "50%", zIndex: 0,
        background: "radial-gradient(circle, rgba(255,105,61,0.16) 0%, rgba(255,138,91,0.06) 42%, transparent 68%)",
      }} />

      {/* Rotating dashed ellipse rings, centred on the hero */}
      {[
        { w: 1180, h: 640, dur: 150, dir: 1, op: 0.5, dash: "1px 12px" },
        { w: 840, h: 500, dur: 110, dir: -1, op: 0.6, dash: "1px 11px" },
        { w: 520, h: 360, dur: 80, dir: 1, op: 0.7, dash: "1px 10px" },
      ].map((r, i) => (
        <motion.div
          key={i}
          aria-hidden
          animate={{ rotate: 360 * r.dir }}
          transition={{ repeat: Infinity, duration: r.dur, ease: "linear" }}
          style={{
            position: "absolute", top: "42%", left: "50%", zIndex: 0,
            width: r.w, height: r.h, marginLeft: -r.w / 2, marginTop: -r.h / 2,
            borderRadius: "50%", border: `2px dashed rgba(255,105,61,0.22)`,
            borderStyle: "dashed", opacity: r.op,
          }}
        />
      ))}

      {/* Twinkling coral particles */}
      {[
        { top: "16%", left: "12%", s: 6, d: 5 },
        { top: "34%", right: "9%", s: 5, d: 6.5 },
        { bottom: "24%", left: "8%", s: 7, d: 5.8 },
        { bottom: "16%", right: "14%", s: 5, d: 7 },
        { top: "62%", left: "20%", s: 4, d: 6 },
      ].map((p, i) => (
        <motion.span
          key={i}
          aria-hidden
          animate={{ y: [0, -12, 0], opacity: [0.35, 0.9, 0.35] }}
          transition={{ repeat: Infinity, duration: p.d, ease: "easeInOut", delay: i * 0.6 }}
          style={{
            position: "absolute", zIndex: 1, width: p.s, height: p.s, borderRadius: "50%",
            background: CORAL, ...p,
          }}
        />
      ))}

      {/* Centre content */}
      <motion.div className="sh-inner" variants={stagger} initial="hidden" animate="show">
        {/* Badge pill */}
        <motion.div variants={fadeUp} style={{
          display: "inline-flex", alignItems: "center", gap: 9,
          background: "#fff", color: CORAL, padding: "8px 18px", borderRadius: 50,
          fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", marginBottom: 30,
          boxShadow: "0 6px 18px rgba(255,105,61,0.15), 0 1px 3px rgba(20,20,40,0.05)",
          fontFamily: '"Space Grotesk","Sora",sans-serif',
        }}>
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.55, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{ width: 7, height: 7, borderRadius: "50%", background: CORAL, display: "inline-block" }}
          />
          {badgeText}
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={fadeUp} className="sh-title">
          {titleLines.map((line, li) => (
            <span key={li} style={{ display: "block" }}>
              {line.map((seg, si) => (
                <span key={si} style={seg.accent ? accentStyle : undefined}>{seg.text}</span>
              ))}
            </span>
          ))}
        </motion.h1>

        {/* Description */}
        <motion.p variants={fadeUp} style={{
          color: "#6b7280", fontSize: "1.06rem", lineHeight: 1.65,
          maxWidth: 560, margin: "0 auto 36px", fontFamily: '"DM Sans",sans-serif',
        }}>
          {description}
        </motion.p>

        {/* Buttons */}
        <motion.div variants={fadeUp} className="sh-btns" style={{
          display: "flex", gap: 18, alignItems: "center", justifyContent: "center", marginBottom: 52,
        }}>
          <motion.button
            whileHover={{ y: -3, boxShadow: "0 16px 34px rgba(255,105,61,0.42)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            onClick={primaryButton.onClick}
            style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              background: "linear-gradient(100deg, #FF6A3D 0%, #FF8A5B 100%)",
              color: "#fff", border: "none", padding: "15px 30px", borderRadius: 50,
              fontSize: "1rem", fontWeight: 700, cursor: "pointer",
              fontFamily: '"Space Grotesk","Sora",sans-serif',
              boxShadow: "0 10px 26px rgba(255,105,61,0.35)",
            }}
          >
            {primaryButton.text}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </motion.button>
          <motion.button
            whileHover={{ x: 4 }}
            onClick={secondaryButton.onClick}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "transparent", color: INK, border: "none",
              fontSize: "0.98rem", fontWeight: 700, cursor: "pointer", padding: "8px 6px",
              fontFamily: '"Space Grotesk","Sora",sans-serif',
            }}
          >
            {secondaryButton.text}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </motion.button>
        </motion.div>

        {/* Stats */}
        {stats.length > 0 && (
          <motion.div variants={fadeUp} className="sh-stats" style={{
            display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 56,
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: '"Space Grotesk","Sora",sans-serif', fontWeight: 700,
                  fontSize: "2.4rem", lineHeight: 1, color: CORAL, letterSpacing: "-0.02em",
                }}>{s.value}</div>
                <div style={{
                  color: "#9aa2b1", fontSize: "0.72rem", fontWeight: 700, marginTop: 9,
                  textTransform: "uppercase", letterSpacing: "0.11em",
                }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Floating subject cards at the four corners */}
      <div className="sh-deco">
        {floatingCards.slice(0, 4).map((card, idx) => {
          const Icon = card.icon;
          const corner = CORNERS[idx % CORNERS.length];
          return (
            <motion.div
              key={idx}
              className="sh-card"
              style={corner.pos}
              initial={{ opacity: 0, ...corner.from }}
              animate={{ opacity: 1, x: 0, y: [0, -11, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.55 + idx * 0.12 },
                x: { duration: 0.6, delay: 0.55 + idx * 0.12, ease: [0.16, 0.84, 0.32, 1] },
                y: { repeat: Infinity, duration: 3.4 + idx * 0.5, ease: "easeInOut", delay: 0.9 + idx * 0.3 },
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 13, flexShrink: 0,
                  background: card.color + "1f", color: card.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={21} strokeWidth={2.4} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: '"Space Grotesk","Sora",sans-serif', fontWeight: 700,
                    fontSize: "1.02rem", color: INK, lineHeight: 1.15,
                  }}>{card.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "#8a93a3", fontWeight: 500, marginTop: 2 }}>
                    {card.subtitle}
                  </div>
                </div>
              </div>
              <div style={{ height: 6, borderRadius: 4, background: "rgba(255,105,61,0.13)", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${card.progress}%` }}
                  transition={{ duration: 1.1, delay: 0.9 + idx * 0.12, ease: "easeOut" }}
                  style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #FF5A34, #FF9166)" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
