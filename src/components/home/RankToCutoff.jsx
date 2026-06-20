/* RankToCutoff — campusloom "Map your rank to cutoffs" JoSAA-engine section.
   Left: pitch + feature bullets. Right: a browser-framed mini predictor —
   type a JEE Advanced CRL and instantly see IIT + branch matches tagged
   High / Medium chance against indicative closing ranks. Each result shows
   an institute monogram "logo". Indicative cutoffs, not official. */
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap } from "lucide-react";
import { CL, clEyebrow, chanceTone } from "./clTheme.js";

/* indicative JEE Advanced CRL closing ranks (gen, latest round) */
const CUTOFFS = [
  { college: "IIT Bombay",     short: "IITB", branch: "Computer Science & Engineering", close: 67,   color: "#1f5fae" },
  { college: "IIT Delhi",      short: "IITD", branch: "Computer Science & Engineering", close: 110,  color: "#b3282d" },
  { college: "IIT Madras",     short: "IITM", branch: "Computer Science & Engineering", close: 160,  color: "#0e7d6b" },
  { college: "IIT Kanpur",     short: "IITK", branch: "Computer Science & Engineering", close: 240,  color: "#6b3fa0" },
  { college: "IIT Bombay",     short: "IITB", branch: "Electrical Engineering",         close: 420,  color: "#1f5fae" },
  { college: "IIT Guwahati",   short: "IITG", branch: "Computer Science & Engineering", close: 600,  color: "#c2540a" },
  { college: "IIT Delhi",      short: "IITD", branch: "Electrical Engineering",         close: 700,  color: "#b3282d" },
  { college: "IIT Hyderabad",  short: "IITH", branch: "Computer Science & Engineering", close: 760,  color: "#0d6b8a" },
  { college: "IIT Roorkee",    short: "IITR", branch: "Computer Science & Engineering", close: 900,  color: "#15803d" },
  { college: "IIT Madras",     short: "IITM", branch: "Electrical Engineering",         close: 1050, color: "#0e7d6b" },
  { college: "IIT BHU",        short: "BHU",  branch: "Computer Science & Engineering", close: 1300, color: "#8a1c1c" },
  { college: "IIT Indore",     short: "IITI", branch: "Computer Science & Engineering", close: 1700, color: "#9a3b8f" },
  { college: "IIT Bombay",     short: "IITB", branch: "Mechanical Engineering",         close: 2000, color: "#1f5fae" },
  { college: "IIT Roorkee",    short: "IITR", branch: "Electrical Engineering",         close: 2400, color: "#15803d" },
  { college: "IIT Mandi",      short: "IITN", branch: "Computer Science & Engineering", close: 3200, color: "#3a86ff" },
  { college: "IIT Madras",     short: "IITM", branch: "Mechanical Engineering",         close: 2700, color: "#0e7d6b" },
  { college: "IIT Kharagpur",  short: "IITKgp", branch: "Mechanical Engineering",       close: 3400, color: "#c2410c" },
  { college: "IIT Delhi",      short: "IITD", branch: "Chemical Engineering",           close: 3800, color: "#b3282d" },
];

const FEATURES = [
  "JoSAA cutoff coverage across IITs, NITs, IIITs & GFTIs",
  "Predictor tint system: High / Medium probability tags",
  "Geographic map views and printable export lists",
];

function chanceFor(rank, close) {
  if (rank <= close * 0.85) return "high";
  if (rank <= close * 1.2) return "medium";
  return "low";
}

function Logo({ short, color }) {
  return (
    <span style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}33`, display: "grid", placeItems: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: CL.display, fontWeight: 800, fontSize: short.length > 4 ? 9 : 11, color, letterSpacing: "-0.3px" }}>{short}</span>
    </span>
  );
}

export default function RankToCutoff() {
  const [rank, setRank] = useState("3850");

  const results = useMemo(() => {
    const r = parseInt(String(rank).replace(/\D/g, ""), 10);
    if (!r || r < 1) return [];
    return CUTOFFS
      .map((c) => ({ ...c, chance: chanceFor(r, c.close) }))
      .filter((c) => c.chance !== "low")
      .sort((a, b) => a.close - b.close)
      .slice(0, 4);
  }, [rank]);

  return (
    <section style={{ background: CL.cream2, padding: "84px 0", position: "relative", overflow: "hidden" }}>
      {/* dotted texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${CL.cream3} 1.2px, transparent 1.2px)`, backgroundSize: "26px 26px", opacity: 0.6, pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 44, alignItems: "center" }}>
          {/* left pitch */}
          <div>
            <span style={clEyebrow}><Zap size={13} /> JoSAA Engine</span>
            <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(2.1rem,4.6vw,3.2rem)", color: CL.ink, letterSpacing: "-1.6px", margin: "18px 0 16px", lineHeight: 1.06 }}>
              Map your rank to cutoffs with{" "}
              <span style={{ position: "relative", color: CL.coral }}>certainty.</span>
            </h2>
            <p style={{ color: CL.body, fontSize: "1.05rem", lineHeight: 1.75, marginBottom: 24, maxWidth: 440 }}>
              Enter your mock rank or final JEE Advanced result to instantly simulate admission probabilities. Filter by NIRF ranking, academic flexibility and branch category buckets.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 26 }}>
              {FEATURES.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: CL.coralSoft, display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                    <Check size={12} color={CL.coralDk} strokeWidth={3} />
                  </span>
                  <span style={{ fontSize: 14, color: CL.ink2 }}>{f}</span>
                </div>
              ))}
            </div>
            <Link to="/jee-advanced" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: CL.coral, color: "#fff", padding: "13px 24px", borderRadius: 12, fontFamily: CL.display, fontWeight: 800, fontSize: 14.5, boxShadow: "0 10px 26px rgba(244,126,32,.35)" }}>
              Open the full JEE Advanced predictor <ArrowRight size={16} />
            </Link>
          </div>

          {/* right: browser-framed mini predictor */}
          <motion.div
            initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ background: CL.card, borderRadius: 20, border: `1px solid ${CL.line}`, boxShadow: CL.shadowLg, overflow: "hidden" }}
          >
            {/* browser chrome */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", background: CL.cream2, borderBottom: `1px solid ${CL.line}` }}>
              <span style={{ display: "flex", gap: 6 }}>
                {["#F47E20", "#e29a2e", "#0fae6e"].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
              </span>
              <span style={{ flex: 1, textAlign: "center", fontSize: 12, color: CL.muted, background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 7, padding: "5px 10px", fontFamily: CL.display }}>
                collegeparichay.in/college-predictor
              </span>
            </div>

            <div style={{ padding: "20px" }}>
              {/* input row */}
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, background: CL.cream2, border: `1px solid ${CL.cream3}`, borderRadius: 12, padding: "10px 16px" }}>
                  <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "1px", color: CL.muted }}>JEE ADVANCED RANK</div>
                  <input
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    inputMode="numeric"
                    style={{ width: "100%", border: "none", background: "transparent", outline: "none", fontFamily: CL.display, fontWeight: 800, fontSize: 24, color: CL.ink, marginTop: 2 }}
                  />
                </div>
                <button style={{ background: CL.coral, color: "#fff", border: "none", borderRadius: 12, padding: "0 26px", fontFamily: CL.display, fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 8px 20px rgba(244,126,32,.3)" }}>
                  Predict
                </button>
              </div>

              {/* results */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {results.length === 0 && (
                  <div style={{ textAlign: "center", color: CL.muted, fontSize: 13.5, padding: "24px 0" }}>Enter a valid rank to see matching IITs.</div>
                )}
                {results.map((c, i) => {
                  const tone = chanceTone(c.chance);
                  return (
                    <motion.div key={`${c.short}-${c.branch}-${i}`}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      style={{ display: "flex", alignItems: "center", gap: 13, background: CL.cream2, border: `1px solid ${CL.cream3}`, borderRadius: 14, padding: "13px 15px" }}
                    >
                      <Logo short={c.short} color={c.color} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 14.5, color: CL.ink }}>{c.college}</div>
                        <div style={{ fontSize: 12, color: CL.body, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.branch}</div>
                      </div>
                      <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".04em", color: tone.fg, background: tone.bg, padding: "5px 11px", borderRadius: 50, whiteSpace: "nowrap" }}>{tone.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
