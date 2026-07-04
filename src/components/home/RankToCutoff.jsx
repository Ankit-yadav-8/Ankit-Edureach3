/* RankToCutoff — "See what your rank can reach" JoSAA-engine section.
   Left: pitch + what-you-get bullets. Right: a live rank console — type a
   JEE Advanced CRL and instantly see IIT + branch matches with a Safe / Fair
   / Reach call and a confidence bar against indicative closing ranks.
   Indicative cutoffs, not official. */
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Gauge, Search } from "lucide-react";
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
  "Matched live against real JoSAA closing ranks — IITs, NITs, IIITs & GFTIs",
  "A plain Safe / Fair / Reach call on every branch, not just a number",
  "Turn the matches into a saved, ready-to-fill JoSAA choice list",
];

function chanceFor(rank, close) {
  if (rank <= close * 0.85) return "high";
  if (rank <= close * 1.2) return "medium";
  return "low";
}

/* how comfortably the rank clears the cutoff → bar fill % */
const FILL = { high: 90, medium: 55, low: 22 };

function Logo({ short, color }) {
  return (
    <span style={{ width: 40, height: 40, borderRadius: 11, background: `${color}18`, border: `1px solid ${color}33`, display: "grid", placeItems: "center", flexShrink: 0 }}>
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
      <style>{CSS}</style>
      {/* soft corner glow */}
      <div style={{ position: "absolute", top: -80, right: -60, width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle, ${CL.coral}12, transparent 70%)`, pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="rc-split">
          {/* left pitch */}
          <div>
            <span style={clEyebrow}><Zap size={13} /> Rank → Cutoff engine</span>
            <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(2.1rem,4.6vw,3.2rem)", color: CL.ink, letterSpacing: "-1.6px", margin: "18px 0 16px", lineHeight: 1.06 }}>
              See the seats your rank can <span style={{ color: CL.coral }}>actually reach.</span>
            </h2>
            <p style={{ color: CL.body, fontSize: "1.05rem", lineHeight: 1.75, marginBottom: 24, maxWidth: 450 }}>
              Drop in a mock rank or your final JEE Advanced result and watch matching IITs and branches surface in real time — each one weighed against the ranks it actually closed at.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 28 }}>
              {FEATURES.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: CL.greenSoft, display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                    <Check size={13} color="#0a8f5b" strokeWidth={3} />
                  </span>
                  <span style={{ fontSize: 14.5, color: CL.ink2, lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
            <Link to="/jee-advanced" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: CL.coral, color: "#fff", padding: "13px 24px", borderRadius: 12, fontFamily: CL.display, fontWeight: 800, fontSize: 14.5, boxShadow: "0 10px 26px rgba(255, 105, 61,.35)" }}>
              Open the full JEE Advanced predictor <ArrowRight size={16} />
            </Link>
          </div>

          {/* right: live rank console */}
          <motion.div
            initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="rc-console"
          >
            {/* header */}
            <div className="rc-head">
              <span className="rc-head-icon"><Gauge size={17} color={CL.coralDk} /></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 14.5, color: CL.ink }}>Instant rank check</div>
                <div style={{ fontSize: 11.5, color: CL.muted }}>Indicative JEE Advanced cutoffs · General</div>
              </div>
              <span className="rc-live"><span className="rc-live-dot" /> LIVE</span>
            </div>

            <div style={{ padding: "20px" }}>
              {/* input */}
              <div className="rc-input">
                <Search size={17} color={CL.muted} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "1px", color: CL.muted }}>YOUR JEE ADVANCED RANK (CRL)</div>
                  <input
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    inputMode="numeric"
                    placeholder="e.g. 3850"
                    style={{ width: "100%", border: "none", background: "transparent", outline: "none", fontFamily: CL.display, fontWeight: 800, fontSize: 24, color: CL.ink, marginTop: 2 }}
                  />
                </div>
                <span className="rc-count">{results.length} match{results.length === 1 ? "" : "es"}</span>
              </div>

              {/* results */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                {results.length === 0 && (
                  <div style={{ textAlign: "center", color: CL.muted, fontSize: 13.5, padding: "26px 0" }}>Enter a valid rank to see matching IITs.</div>
                )}
                {results.map((c, i) => {
                  const tone = chanceTone(c.chance);
                  return (
                    <motion.div key={`${c.short}-${c.branch}-${i}`}
                      initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      className="rc-row"
                    >
                      <Logo short={c.short} color={c.color} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                          <span style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 14.5, color: CL.ink }}>{c.college}</span>
                          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".04em", color: tone.fg, background: tone.bg, padding: "4px 10px", borderRadius: 50, whiteSpace: "nowrap" }}>{tone.label}</span>
                        </div>
                        <div style={{ fontSize: 12, color: CL.body, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: "1px 0 7px" }}>
                          {c.branch} · closes ~ CRL {c.close.toLocaleString("en-IN")}
                        </div>
                        {/* confidence bar */}
                        <div className="rc-bar">
                          <motion.span
                            initial={{ width: 0 }} whileInView={{ width: `${FILL[c.chance]}%` }} viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.06 + 0.1 }}
                            style={{ background: tone.fg }}
                          />
                        </div>
                      </div>
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

const CSS = `
.rc-split { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 44px; align-items: center; }
.rc-console { background: ${CL.card}; border-radius: 20px; border: 1px solid ${CL.line}; box-shadow: ${CL.shadowLg}; overflow: hidden; }
.rc-head { display: flex; align-items: center; gap: 12px; padding: 15px 18px; background: linear-gradient(120deg, ${CL.coralSoft}, ${CL.cream2}); border-bottom: 1px solid ${CL.line}; }
.rc-head-icon { width: 34px; height: 34px; border-radius: 10px; background: ${CL.card}; display: grid; place-items: center; box-shadow: ${CL.shadow}; flex-shrink: 0; }
.rc-live { display: inline-flex; align-items: center; gap: 6px; font: 800 10px/1 ${CL.display}; letter-spacing: .08em; color: #0a8f5b; background: ${CL.greenSoft}; padding: 5px 10px; border-radius: 50px; }
.rc-live-dot { width: 7px; height: 7px; border-radius: 50%; background: ${CL.green}; animation: rcBlink 1.4s ease-in-out infinite; }
@keyframes rcBlink { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
.rc-input { display: flex; align-items: center; gap: 12px; background: ${CL.cream2}; border: 1.5px solid ${CL.cream3}; border-radius: 14px; padding: 10px 16px; transition: border-color .2s; }
.rc-input:focus-within { border-color: ${CL.coral}; }
.rc-count { font: 700 11.5px/1 ${CL.display}; color: ${CL.coralDk}; background: ${CL.coralSoft}; padding: 6px 11px; border-radius: 50px; white-space: nowrap; flex-shrink: 0; }
.rc-row { display: flex; align-items: flex-start; gap: 13px; background: ${CL.cream2}; border: 1px solid ${CL.cream3}; border-radius: 14px; padding: 13px 15px; }
.rc-bar { height: 6px; border-radius: 50px; background: ${CL.cream3}; overflow: hidden; }
.rc-bar > span { display: block; height: 100%; border-radius: 50px; }
`;
