/* PageHero — the blog-style hero reused across JEE Main / Advanced / NEET (and
   anywhere else). Left: eyebrow + headline (with a highlighted phrase) + sub +
   CTA. Right: three floating preview cards. Only the content differs per page. */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

function Preview({ cards, accent }) {
  const offsets = [
    { top: 0, right: 84, rotate: -4, z: 2 },
    { top: 40, right: 0, rotate: 5, z: 3 },
    { top: 168, right: 132, rotate: -2, z: 1 },
  ];
  return (
    <div className="ph-preview" style={{ position: "relative", height: 372 }}>
      {cards.slice(0, 3).map((c, i) => {
        const o = offsets[i] || offsets[0];
        /* Single consistent accent across the whole hero (the page's colour). */
        const ac = accent;
        const Ic = c.icon;
        return (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 24, rotate: o.rotate }}
            animate={{ opacity: 1, y: 0, rotate: o.rotate }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
            whileHover={{ y: -5, rotate: 0, zIndex: 5 }}
            style={{
              position: "absolute", top: o.top, right: o.right, zIndex: o.z, width: 264,
              background: CL.card, borderRadius: 18, border: `1px solid ${CL.line}`,
              boxShadow: CL.shadowLg, padding: "20px 20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ width: 40, height: 40, borderRadius: 11, background: `${ac}18`, display: "grid", placeItems: "center" }}>
                {Ic && <Ic size={20} color={ac} />}
              </span>
              {c.badge && <span style={{ fontSize: 9.5, fontWeight: 800, color: CL.muted, background: CL.cream2, padding: "4px 10px", borderRadius: 50 }}>{c.badge}</span>}
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: ac, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 6 }}>{c.category}</div>
            <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 15.5, color: CL.ink, lineHeight: 1.3, marginBottom: 8 }}>{c.title}</div>
            {c.meta && <div style={{ fontSize: 12, color: CL.muted, lineHeight: 1.5 }}>{c.meta}</div>}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function PageHero({
  eyebrow, eyebrowIcon: Eic, accent = CL.coral,
  titleLead, highlight, titleTail, highlightTail,
  sub, cta, cards = [],
}) {
  const nav = useNavigate();
  return (
    <section style={{ background: CL.cream, paddingTop: 124, paddingBottom: 36, position: "relative", overflow: "hidden" }}>
      <div className="container">
        <div className="ph-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 36, alignItems: "center" }}>
          <div>
            <span style={{ ...clEyebrow, color: accent, background: `${accent}14`, borderColor: `${accent}33` }}>
              {Eic && <Eic size={13} />} {eyebrow}
            </span>
            <h1 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(2rem,4.8vw,3.2rem)", color: CL.ink, letterSpacing: "-1.4px", lineHeight: 1.07, margin: "18px 0 16px" }}>
              {titleLead}{" "}
              <span style={{ background: `${accent}1f`, color: accent, padding: "0 10px", borderRadius: 10, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{highlight}</span>
              {titleTail && <><br />{titleTail}{" "}</>}
              {highlightTail && <span style={{ color: accent }}>{highlightTail}</span>}
            </h1>
            <p style={{ color: CL.body, fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 480, marginBottom: cta ? 26 : 0 }}>{sub}</p>
            {cta && (
              <button onClick={() => {
                if (cta.onClick) return cta.onClick();
                if (cta.to?.startsWith("#")) return document.getElementById(cta.to.slice(1))?.scrollIntoView({ behavior: "smooth" });
                nav(cta.to);
              }} style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                background: accent, color: "#fff", border: "none", borderRadius: 50,
                padding: "13px 26px", fontFamily: CL.display, fontWeight: 800, fontSize: 15,
                cursor: "pointer", boxShadow: `0 12px 28px -8px ${accent}99`,
              }}>
                {cta.label} <ArrowRight size={17} />
              </button>
            )}
          </div>
          <Preview cards={cards} accent={accent} />
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .ph-grid { grid-template-columns: 1fr !important; }
          .ph-preview { display: none !important; }
        }
      `}</style>
    </section>
  );
}
