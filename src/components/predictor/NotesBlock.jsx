import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle } from "lucide-react";

/* ══════════════════════════════════════════════
   Shared "How this tool works" block, used by the Rank
   Predictor, the College Predictor and the NEET page.
   Renders a titled card with a responsive grid of points.

   A point may supply a `visual` — a component rendered
   above the title in place of the icon chip. Points
   without one keep the compact icon + text layout, so
   callers opt in per-tool.

   Lives apart from RankPredictorTool so the NEET page can
   pull it in without dragging the predictor (and its
   worker + cutoff-DB plumbing) into that bundle.
══════════════════════════════════════════════ */

const NOTES_GRID = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const NOTES_CARD = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 210, damping: 24 } },
};

/* Splits `heading` so `highlight` can be tinted without the caller passing JSX. */
function HeadingText({ heading, highlight, accent }) {
  if (!highlight || !heading.includes(highlight)) return heading;
  const [before, ...rest] = heading.split(highlight);
  return (
    <>
      {before}
      {/* tint derived from `accent` alone — the block is also rendered in the
          Advanced page's purple, where a hardcoded warm stop turned the word orange */}
      <span style={{ background: `linear-gradient(95deg, ${accent} 0%, ${accent}b0 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
        {highlight}
      </span>
      {rest.join(highlight)}
    </>
  );
}

export function NotesBlock({ accent, eyebrow, heading, highlight, points, note }) {
  const still = useReducedMotion();
  const hasVisuals = points.some((p) => p.visual);

  return (
    <div className="card notes-block" style={{ marginTop: 22, borderTop: `3px solid ${accent}`, position: "relative", overflow: "hidden" }}>
      {/* slow light sweep across the whole block, tying the cards together */}
      {!still && (
        <motion.div
          aria-hidden
          style={{
            position: "absolute", left: 0, right: 0, height: 90, pointerEvents: "none", zIndex: 0,
            background: `linear-gradient(180deg, transparent 0%, ${accent}0f 50%, transparent 100%)`,
          }}
          initial={{ top: "-12%" }}
          animate={{ top: ["-12%", "108%"] }}
          transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
        />
      )}

      <div style={{ marginBottom: 14, position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 3 }}>
          {eyebrow}
        </div>
        <h4 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: hasVisuals ? 25 : 17, color: "var(--navy)" }}>
          <HeadingText heading={heading} highlight={highlight} accent={accent} />
        </h4>
      </div>

      <motion.div
        className="notes-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, position: "relative", zIndex: 1 }}
        variants={NOTES_GRID}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {points.map(({ icon: Icon, title, body, visual: Visual }) => (
          <motion.div
            key={title}
            variants={NOTES_CARD}
            whileHover={still ? undefined : { y: -4, transition: { type: "spring", stiffness: 400, damping: 26 } }}
            style={{
              display: Visual ? "block" : "flex",
              gap: 11, padding: Visual ? "14px 15px 15px" : "13px 15px",
              background: "var(--sky)", borderRadius: 12, border: "1px solid var(--line)",
            }}
          >
            {Visual ? (
              <Visual accent={accent} />
            ) : (
              <span style={{
                display: "grid", placeItems: "center", width: 32, height: 32, borderRadius: 9,
                background: `${accent}18`, color: accent, flexShrink: 0,
              }}>
                <Icon size={17} />
              </span>
            )}
            <div>
              <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: Visual ? 14.5 : 13.5, color: "var(--navy)", marginBottom: 3 }}>{title}</div>
              <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.55, margin: 0 }}>{body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {note && (
        <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 12, display: "flex", alignItems: "center", gap: 6, position: "relative", zIndex: 1 }}>
          <AlertCircle size={13} color={accent} style={{ flexShrink: 0 }} /> {note}
        </p>
      )}

      <style>{`@media (max-width: 640px){ .notes-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
