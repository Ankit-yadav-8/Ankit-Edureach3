/* PageHero — the blog-style hero reused across JEE Main / Advanced / NEET (and
   anywhere else). Left: eyebrow + headline (with a highlighted phrase) + sub +
   CTA. Right: three floating preview cards. Only the content differs per page. */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

function Preview({ cards, accent }) {
  return (
    <div className="ph-preview" style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 360, margin: "0 auto" }}>
      {cards.slice(0, 3).map((c, i) => {
        const ac = c.accent || accent;
        const Ic = c.icon;
        return (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
            style={{
              display: "flex", alignItems: "center", gap: 16,
              background: CL.card, borderRadius: 16, border: `1px solid ${CL.line}`,
              boxShadow: CL.shadow, padding: "16px 20px", marginLeft: i * 20,
            }}
          >
            <span style={{ width: 44, height: 44, borderRadius: 12, background: `${ac}18`, display: "grid", placeItems: "center", flexShrink: 0 }}>
              {Ic && <Ic size={22} color={ac} />}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: ac, textTransform: "uppercase", letterSpacing: ".04em" }}>{c.category}</div>
                {c.badge && <span style={{ fontSize: 9, fontWeight: 800, color: CL.muted, background: CL.cream2, padding: "2px 8px", borderRadius: 50 }}>{c.badge}</span>}
              </div>
              <div style={{ fontFamily: CL.display, fontWeight: 700, fontSize: 14.5, color: CL.ink, lineHeight: 1.2 }}>{c.title}</div>
              {c.meta && <div style={{ fontSize: 11.5, color: CL.muted, marginTop: 4 }}>{c.meta}</div>}
            </div>
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
              <span style={{ color: accent }}>{highlight}</span>
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
