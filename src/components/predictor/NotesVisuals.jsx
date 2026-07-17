import { motion, useReducedMotion } from "framer-motion";

/* ══════════════════════════════════════════════
   Animated illustrations for the "How this tool
   works" cards. Each one is a self-contained,
   decorative loop — purely presentational, so the
   whole set is aria-hidden and collapses to a
   static frame under prefers-reduced-motion.
══════════════════════════════════════════════ */

const SORA = "Sora, system-ui, sans-serif";

/* Shared frame: the soft inset panel each illustration sits in. */
function Frame({ children, height = 150 }) {
  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        height,
        marginBottom: 14,
        borderRadius: 12,
        border: "1px solid var(--line)",
        background: "linear-gradient(160deg, #fff 0%, #fffaf7 55%, #fff3ec 100%)",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

/* ── 1. Marks → estimated CRL ───────────────── */
export function RankEstimateVisual({ accent = "#FF693D", advanced = false }) {
  const still = useReducedMotion();
  const bars = [26, 42, 34, 52, 62];

  return (
    <Frame>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, paddingBottom: 20 }}>
        <div style={{ position: "relative", width: 146, height: 94 }}>
          {/* equalizer — the raw marks being crunched, tucked behind the card */}
          <div style={{ position: "absolute", left: 12, bottom: 0, display: "flex", alignItems: "flex-end", gap: 5, height: 56 }}>
            {bars.map((h, i) => (
              <motion.span
                key={i}
                style={{
                  width: 13,
                  borderRadius: "4px 4px 2px 2px",
                  background: `linear-gradient(180deg, ${accent} 0%, ${accent}b3 100%)`,
                }}
                initial={{ height: h }}
                animate={still ? { height: h } : { height: [h, h * 1.42, h * 0.82, h] }}
                transition={still ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.13 }}
              />
            ))}
          </div>

          {/* the estimate card, mid-computation */}
          <motion.div
            style={{
              position: "absolute", left: 0, top: 0, width: 138, padding: "8px 10px 9px",
              background: "rgba(255,255,255,.95)", backdropFilter: "blur(2px)",
              border: `1.5px dashed ${accent}`, borderRadius: 12,
              boxShadow: `0 6px 18px ${accent}26`,
            }}
            initial={{ y: 0 }}
            animate={still ? { y: 0 } : { y: [0, -3.5, 0] }}
            transition={still ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div style={{ fontSize: 9.5, color: "var(--muted)", letterSpacing: ".02em" }}>Estimated CRL</div>
            <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 21, color: accent, lineHeight: 1.2 }}>#2,481</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 1 }}>
              <span style={{ display: "flex", gap: 3 }}>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    style={{ width: 4.5, height: 4.5, borderRadius: "50%", background: accent }}
                    initial={{ opacity: 0.3 }}
                    animate={still ? { opacity: 0.5 } : { opacity: [0.25, 1, 0.25] }}
                    transition={still ? undefined : { duration: 1.25, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
                  />
                ))}
              </span>
              <span style={{ fontSize: 9, color: "var(--muted)" }}>computing…</span>
            </div>
          </motion.div>
        </div>

        {/* marching arrow — marks flowing out to a rank */}
        <svg width="70" height="18" viewBox="0 0 70 18" fill="none" style={{ marginTop: 4 }}>
          <motion.path
            d="M2 14 C 20 14, 32 5, 52 5"
            stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="7 6"
            initial={{ strokeDashoffset: 0 }}
            animate={still ? { strokeDashoffset: 0 } : { strokeDashoffset: [0, -26] }}
            transition={still ? undefined : { duration: 1.1, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M48 1 L 57 5 L 48 11"
            stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            initial={{ x: 0 }}
            animate={still ? { x: 0 } : { x: [0, 4, 0] }}
            transition={still ? undefined : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 12, textAlign: "center", fontSize: 10.5, color: "var(--muted)" }}>
        {advanced ? "Paper 1 + Paper 2 marks" : "Physics + Chemistry + Maths marks"}
      </div>
    </Frame>
  );
}

/* ── 2. CRL vs category rank ────────────────── */
export function CategoryRankVisual({ accent = "#FF693D" }) {
  const still = useReducedMotion();

  return (
    <Frame>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ position: "relative", width: 232, height: 96 }}>
          {/* the CRL sitting behind — real, but not what counselling uses */}
          <div
            style={{
              position: "absolute", right: 0, bottom: 0, width: 132, padding: "9px 12px",
              background: "#fff", border: "1px solid var(--line)", borderRadius: 12,
              boxShadow: "0 4px 14px rgba(15,23,42,.06)", textAlign: "right",
            }}
          >
            <div style={{ fontSize: 9.5, color: "var(--muted)" }}>All-India CRL</div>
            <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 18, color: "var(--navy)", lineHeight: 1.25 }}>#2,481</div>
          </div>

          {/* the category rank, front and centre — the one that actually matters */}
          <motion.div
            style={{
              position: "absolute", left: 0, top: 0, width: 142, padding: "9px 12px 10px",
              borderRadius: 12, transformOrigin: "center",
              background: `linear-gradient(140deg, ${accent} 0%, ${accent}cc 100%)`,
              boxShadow: `0 10px 26px ${accent}57`,
            }}
            initial={{ y: 0, rotate: -1.5 }}
            animate={still ? { y: 0, rotate: -1.5 } : { y: [0, -5, 0], rotate: [-1.5, -2.6, -1.5] }}
            transition={still ? undefined : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.9)" }}>OBC-NCL Rank</div>
            <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 22, color: "#fff", lineHeight: 1.2 }}>#612</div>
            <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: ".08em", color: "rgba(255,255,255,.95)", marginTop: 1 }}>
              USED FOR SEATS
            </div>
          </motion.div>
        </div>

        {/* trail marching off toward seat allotment */}
        <div style={{ display: "flex", gap: 5, marginTop: -6 }}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              style={{ width: 9, height: 2.5, borderRadius: 2, background: accent }}
              initial={{ opacity: 0.35 }}
              animate={still ? { opacity: 0.5 } : { opacity: [0.2, 1, 0.2] }}
              transition={still ? undefined : { duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.22 }}
            />
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ── 3. A range, not a single number ────────── */
export function RangeBandVisual({ accent = "#FF693D" }) {
  const still = useReducedMotion();

  return (
    <Frame>
      <div style={{ position: "absolute", left: 46, right: 46, top: 50 }}>
        {/* endpoint labels */}
        <div style={{ position: "relative", height: 14, marginBottom: 6, fontSize: 10, color: "var(--muted)" }}>
          <span style={{ position: "absolute", left: "18%", transform: "translateX(-50%)" }}>2,300</span>
          <span style={{ position: "absolute", left: "76%", transform: "translateX(-50%)" }}>2,650</span>
        </div>

        {/* ruler */}
        <div style={{ position: "relative", height: 22 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 9, height: 2, borderRadius: 2, background: "var(--line)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 11, display: "flex", justifyContent: "space-between" }}>
            {Array.from({ length: 11 }).map((_, i) => (
              <span key={i} style={{ width: 1, height: 5, background: `${accent}4d` }} />
            ))}
          </div>

          {/* the plausible band */}
          <div
            style={{
              position: "absolute", left: "18%", width: "58%", top: 3, height: 14, borderRadius: 8,
              background: `linear-gradient(90deg, ${accent}33 0%, ${accent}80 50%, ${accent}33 100%)`,
            }}
          />
          {/* band endpoints */}
          <span style={{ position: "absolute", left: "18%", top: 6, width: 8, height: 8, marginLeft: -4, borderRadius: "50%", background: accent }} />
          <span style={{ position: "absolute", left: "76%", top: 6, width: 8, height: 8, marginLeft: -4, borderRadius: "50%", background: accent }} />

          {/* the estimate itself — never quite settling on one number */}
          <motion.div
            style={{ position: "absolute", top: 10, left: 0 }}
            initial={{ x: 0 }}
            animate={still ? { left: "47%" } : { left: ["24%", "70%", "24%"] }}
            transition={still ? undefined : { duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.span
              style={{
                position: "absolute", width: 26, height: 26, marginLeft: -13, marginTop: -13,
                borderRadius: "50%", border: `1.5px solid ${accent}`,
              }}
              initial={{ scale: 0.6, opacity: 0.5 }}
              animate={still ? { scale: 0.7, opacity: 0.35 } : { scale: [0.6, 1.15, 0.6], opacity: [0.55, 0, 0.55] }}
              transition={still ? undefined : { duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <span
              style={{
                position: "absolute", width: 15, height: 15, marginLeft: -7.5, marginTop: -7.5,
                borderRadius: "50%", background: accent, boxShadow: `0 3px 10px ${accent}80`,
              }}
            />
          </motion.div>
        </div>

        <div style={{ marginTop: 12, textAlign: "center", fontSize: 10.5, fontWeight: 700, color: "var(--navy)" }}>
          low <span style={{ color: "var(--muted)", fontWeight: 400 }}>——</span> your estimate{" "}
          <span style={{ color: "var(--muted)", fontWeight: 400 }}>——</span> high
        </div>
      </div>
    </Frame>
  );
}

/* ── 4. Colleges matched to that rank ───────── */
const TILES_ADV = [
  { name: "IIT Bombay", rank: "#412", bars: [16, 24, 12] },
  { name: "IIT Delhi",  rank: "#598", bars: [12, 22, 17] },
  { name: "IIT Madras", rank: "#701", bars: [20, 14, 22] },
];
const TILES_MAIN = [
  { name: "NIT Trichy",  rank: "#412", bars: [16, 24, 12] },
  { name: "NIT Warangal", rank: "#598", bars: [12, 22, 17] },
  { name: "IIIT Hyd",    rank: "#701", bars: [20, 14, 22] },
];

export function CollegeMatchVisual({ accent = "#FF693D", advanced = false }) {
  const still = useReducedMotion();
  const tiles = advanced ? TILES_ADV : TILES_MAIN;

  return (
    <Frame>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        {tiles.map((t, i) => (
          <motion.div
            key={t.name}
            style={{
              position: "relative", width: 84, padding: "12px 8px 9px", borderRadius: 11,
              background: "#fff", border: `1px solid ${accent}33`,
              boxShadow: "0 4px 14px rgba(15,23,42,.05)", textAlign: "center",
            }}
            initial={{ y: 0 }}
            animate={still ? { y: 0 } : { y: [0, -7, 0] }}
            transition={still ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 }}
          >
            {/* matched ✓ */}
            <motion.span
              style={{
                position: "absolute", top: -7, right: -6, width: 17, height: 17, borderRadius: "50%",
                background: accent, color: "#fff", display: "grid", placeItems: "center",
                fontSize: 9, fontWeight: 900, boxShadow: `0 2px 8px ${accent}80`,
              }}
              initial={{ scale: 1 }}
              animate={still ? { scale: 1 } : { scale: [1, 1.22, 1] }}
              transition={still ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 + 0.2 }}
            >
              ✓
            </motion.span>

            {/* branch spread */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 3, height: 26, marginBottom: 7 }}>
              {t.bars.map((h, j) => (
                <motion.span
                  key={j}
                  style={{
                    width: 6, borderRadius: "2px 2px 1px 1px",
                    background: j === 1 ? accent : `${accent}80`,
                  }}
                  initial={{ height: h }}
                  animate={still ? { height: h } : { height: [h, h * 1.3, h] }}
                  transition={still ? undefined : { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 + j * 0.12 }}
                />
              ))}
            </div>

            <div style={{ fontSize: 9.5, fontWeight: 700, color: "var(--navy)" }}>{t.name}</div>
            <div style={{ fontFamily: SORA, fontSize: 11, fontWeight: 800, color: accent, marginTop: 1 }}>{t.rank}</div>
          </motion.div>
        ))}
      </div>
    </Frame>
  );
}
