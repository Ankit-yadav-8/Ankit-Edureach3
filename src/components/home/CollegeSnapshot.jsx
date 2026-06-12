/* CollegeSnapshot — rich college info section for the home page */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy, TrendingUp, MapPin, ArrowRight,
  IndianRupee, Users, Star, Zap, CheckCircle2, Flame,
} from "lucide-react";

/* IITs avg pkg INCREASED by ₹15.5L */


const TOP_IIT = [
  { name: "IIT Madras",    nirf: 1,  loc: "Chennai",   avg: 3990000, placed: 94, cse: "83–185",    color: "#F47B20" },
  { name: "IIT Bombay",   nirf: 3,  loc: "Mumbai",    avg: 3730000, placed: 96, cse: "67–150",    color: "#6366f1" },
  { name: "IIT Delhi",    nirf: 2,  loc: "New Delhi", avg: 3590000, placed: 95, cse: "98–203",    color: "#0ea5a4" },
  { name: "IIT Kanpur",   nirf: 5,  loc: "Kanpur",    avg: 3510000, placed: 92, cse: "290–450",   color: "#8b5cf6" },
  { name: "IIT Roorkee",  nirf: 7,  loc: "Roorkee",   avg: 3330000, placed: 90, cse: "840–1100",  color: "#dc2626" },
  { name: "IIT Kharagpur",nirf: 6,  loc: "Kharagpur", avg: 3400000, placed: 91, cse: "600–900",   color: "#f59e0b" },
];

/* NITs avg pkg INCREASED by ₹5L */
const TOP_NIT = [
  { name: "NIT Trichy",    nirf: 10, loc: "Tamil Nadu",    avg: 1620000, placed: 92, cse: "≤5,000",  color: "#0ea5a4" },
  { name: "NIT Warangal",  nirf: 26, loc: "Telangana",     avg: 1480000, placed: 89, cse: "≤8,000",  color: "#3b3b98" },
  { name: "NIT Surathkal", nirf: 27, loc: "Karnataka",     avg: 1550000, placed: 88, cse: "≤12,000", color: "#0d3340" },
  { name: "NIT Calicut",   nirf: 28, loc: "Kerala",        avg: 1440000, placed: 87, cse: "≤15,000", color: "#2d6a4f" },
  { name: "NIT Rourkela",  nirf: 35, loc: "Odisha",        avg: 1380000, placed: 86, cse: "≤18,000", color: "#7c3aed" },
  { name: "NIT Allahabad", nirf: 47, loc: "Uttar Pradesh", avg: 1260000, placed: 84, cse: "≤25,000", color: "#b45309" },
];

const BRANCH_PKG_IIT = [
  { branch: "CSE / AI",        avg: 4800000, trend: "+14%", color: "#6366f1" },
  { branch: "ECE",             avg: 3200000, trend: "+9%",  color: "#F47B20" },
  { branch: "Electrical (EE)", avg: 2900000, trend: "+8%",  color: "#f59e0b" },
  { branch: "Mechanical",      avg: 2400000, trend: "+5%",  color: "#0ea5a4" },
  { branch: "Civil",           avg: 1900000, trend: "+4%",  color: "#8b5cf6" },
  { branch: "Chemical",        avg: 2100000, trend: "+6%",  color: "#dc2626" },
];

const BRANCH_PKG_NIT = [
  { branch: "CSE / AI",        avg: 2200000, trend: "+12%", color: "#6366f1" },
  { branch: "ECE",             avg: 1450000, trend: "+8%",  color: "#F47B20" },
  { branch: "Electrical (EE)", avg: 1180000, trend: "+6%",  color: "#f59e0b" },
  { branch: "Mechanical",      avg: 980000,  trend: "+4%",  color: "#0ea5a4" },
  { branch: "Civil",           avg: 760000,  trend: "+3%",  color: "#8b5cf6" },
  { branch: "Chemical",        avg: 850000,  trend: "+5%",  color: "#dc2626" },
];

const fmtL = (v) => `₹${(v / 100000).toFixed(1)}L`;

function CollegeRow({ c, index, accentColor }) {
  const nav = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      onClick={() => nav(`/colleges/${c.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "11px 14px", borderRadius: 12,
        background: "#fff",
        border: "1px solid rgba(0,0,0,.07)",
        boxShadow: "0 2px 10px rgba(28,28,40,.04)",
        cursor: "pointer", transition: "all .2s",
      }}
      whileHover={{ y: -2, boxShadow: `0 8px 28px ${c.color}22` }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${c.color}18`, border: `1.5px solid ${c.color}33`,
        display: "grid", placeItems: "center", flexShrink: 0,
      }}>
        <span style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: 11, color: c.color }}>#{c.nirf}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: 13.5, color: "#1c1c28", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
        <div style={{ fontSize: 11, color: "#9ca3af", display: "flex", alignItems: "center", gap: 3 }}>
          <MapPin size={10} /> {c.loc} · CSE: {c.cse}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: 13.5, color: accentColor }}>{fmtL(c.avg)}</div>
          <div style={{ fontSize: 9.5, color: "#9ca3af" }}>avg pkg</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: 13, color: "#15a06e" }}>{c.placed}%</div>
          <div style={{ fontSize: 9.5, color: "#9ca3af" }}>placed</div>
        </div>
      </div>
      <ArrowRight size={13} color="#d1d5db" />
    </motion.div>
  );
}

function BranchBar({ b, i, maxAvg }) {
  const pct = Math.round((b.avg / maxAvg) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: i * 0.06 }}
      style={{ display: "flex", alignItems: "center", gap: 12 }}
    >
      <div style={{ width: 130, fontFamily: "'Space Grotesk','DM Sans',sans-serif", fontWeight: 600, fontSize: 12.5, color: "#374151", flexShrink: 0 }}>{b.branch}</div>
      <div style={{ flex: 1, height: 9, background: "#f3f4f6", borderRadius: 50, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.07, ease: "easeOut" }}
          style={{ height: "100%", borderRadius: 50, background: `linear-gradient(90deg, ${b.color}, ${b.color}bb)` }}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, minWidth: 110 }}>
        <span style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: 13, color: "#1c1c28" }}>{fmtL(b.avg)}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#15a06e", background: "rgba(21,160,110,.1)", padding: "2px 7px", borderRadius: 50 }}>{b.trend}</span>
      </div>
    </motion.div>
  );
}

export default function CollegeSnapshot() {
  const nav = useNavigate();

  return (
    <section style={{ background: "linear-gradient(160deg, #ffffff 0%, #ffffff 40%, #ffffff 100%)", padding: "72px 0", position: "relative", overflow: "hidden" }}>
      <div className="container">

        {/* Header */}
        <motion.div
          className="title-bar"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow"><Trophy size={11} /> College Intelligence</span>
          <h2 className="section-title" style={{ color: "#1a1a2e" }}>
            Everything About <span className="accent">Top Institutes</span>
          </h2>
          <p className="section-sub" style={{ color: "#4b5563" }}>
            NIRF rankings, avg placements, placed % and CSE cutoff ranges — updated for 2026.
          </p>
        </motion.div>

        {/* ══════════════════════════════════
            IIT SECTION (orange/indigo theme)
        ══════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: "28px 28px 24px",
            marginBottom: 28,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(244,123,32,.1)",
            border: "1px solid rgba(244,123,32,.2)",
          }}
        >
          {/* Top gradient line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #F47B20, #fbbf24, #F47B20)" }} />
          {/* Glow blob */}
          <div style={{ position: "absolute", top: -60, right: -40, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,123,32,.18) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* IIT Section Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(244,123,32,.2)", border: "1.5px solid rgba(244,123,32,.4)", display: "grid", placeItems: "center" }}>
                <Flame size={22} color="#F47B20" />
              </div>
              <div>
                <div style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "1.25rem", color: "#1a1a2e" }}>IIT Placements 2026</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>23 Institutes · 17,385 seats · <span style={{ color: "#F47B20", fontWeight: 700 }}>Avg +₹15.5L from last year</span></div>
              </div>
            </div>
            <button onClick={() => nav("/colleges?type=IIT")} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(244,123,32,.15)", border: "1px solid rgba(244,123,32,.35)", borderRadius: 50, padding: "7px 16px", cursor: "pointer", color: "#F47B20", fontSize: 12.5, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>
              All IITs <ArrowRight size={13} />
            </button>
          </div>

          {/* IIT college rows (light card on dark bg) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
            {TOP_IIT.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => nav(`/colleges/${c.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px", borderRadius: 12,
                  background: "#f9f5f2",
                  border: `1px solid ${c.color}22`,
                  cursor: "pointer", transition: "all .2s",
                }}
                whileHover={{ background: `rgba(244,123,32,.06)`, borderColor: `${c.color}44` }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${c.color}28`, border: `1.5px solid ${c.color}44`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 10, color: c.color }}>#{c.nirf}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: 13, color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                  <div style={{ fontSize: 10.5, color: "#6b7280" }}>{c.loc}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: 14, color: "#F47B20" }}>{fmtL(c.avg)}</div>
                  <div style={{ fontSize: 10, color: "#6b7280" }}>{c.placed}% placed</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* IIT Branch Package Bars */}
          <div style={{ background: "#f9f5f2", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(0,0,0,.07)" }}>
            <div style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e", marginBottom: 16 }}>
              IIT Branch-wise Avg Package
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {BRANCH_PKG_IIT.map((b, i) => {
                const pct = Math.round((b.avg / 5500000) * 100);
                return (
                  <motion.div
                    key={b.branch}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div style={{ width: 120, fontFamily: "'Space Grotesk','DM Sans',sans-serif", fontWeight: 600, fontSize: 12, color: "#374151", flexShrink: 0 }}>{b.branch}</div>
                    <div style={{ flex: 1, height: 8, background: "#e5e7eb", borderRadius: 50, overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.07, ease: "easeOut" }}
                        style={{ height: "100%", borderRadius: 50, background: `linear-gradient(90deg, ${b.color}, ${b.color}99)` }}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0, minWidth: 105 }}>
                      <span style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: 13, color: "#1a1a2e" }}>{fmtL(b.avg)}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,.12)", padding: "2px 7px", borderRadius: 50 }}>{b.trend}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════
            NIT SECTION (teal/blue theme)
        ══════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: "28px 28px 24px",
            marginBottom: 28,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(14,165,164,.1)",
            border: "1px solid rgba(14,165,164,.2)",
          }}
        >
          {/* Top gradient line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #0ea5a4, #06b6d4, #0ea5a4)" }} />
          <div style={{ position: "absolute", top: -60, right: -40, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,164,.15) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* NIT Section Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(14,165,164,.2)", border: "1.5px solid rgba(14,165,164,.4)", display: "grid", placeItems: "center" }}>
                <Star size={22} color="#0ea5a4" />
              </div>
              <div>
                <div style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "1.25rem", color: "#1a1a2e" }}>NIT Placements 2026</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>31 Institutes · 23,954 seats · <span style={{ color: "#0ea5a4", fontWeight: 700 }}>Avg +₹5L from last year</span></div>
              </div>
            </div>
            <button onClick={() => nav("/colleges?type=NIT")} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(14,165,164,.15)", border: "1px solid rgba(14,165,164,.35)", borderRadius: 50, padding: "7px 16px", cursor: "pointer", color: "#0ea5a4", fontSize: 12.5, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>
              All NITs <ArrowRight size={13} />
            </button>
          </div>

          {/* NIT college rows */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
            {TOP_NIT.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => nav(`/colleges/${c.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px", borderRadius: 12,
                  background: "#f9f5f2",
                  border: `1px solid ${c.color}22`,
                  cursor: "pointer", transition: "all .2s",
                }}
                whileHover={{ background: `rgba(14,165,164,.06)`, borderColor: `${c.color}44` }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${c.color}28`, border: `1.5px solid ${c.color}44`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 10, color: c.color }}>#{c.nirf}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: 13, color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                  <div style={{ fontSize: 10.5, color: "#6b7280" }}>{c.loc} · CSE: {c.cse}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: 14, color: "#0ea5a4" }}>{fmtL(c.avg)}</div>
                  <div style={{ fontSize: 10, color: "#6b7280" }}>{c.placed}% placed</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* NIT Branch Package Bars */}
          <div style={{ background: "#f9f5f2", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(0,0,0,.07)" }}>
            <div style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e", marginBottom: 16 }}>
              NIT Branch-wise Avg Package
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {BRANCH_PKG_NIT.map((b, i) => {
                const pct = Math.round((b.avg / 2800000) * 100);
                return (
                  <motion.div
                    key={b.branch}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div style={{ width: 120, fontFamily: "'Space Grotesk','DM Sans',sans-serif", fontWeight: 600, fontSize: 12, color: "#374151", flexShrink: 0 }}>{b.branch}</div>
                    <div style={{ flex: 1, height: 8, background: "#e5e7eb", borderRadius: 50, overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.07, ease: "easeOut" }}
                        style={{ height: "100%", borderRadius: 50, background: `linear-gradient(90deg, ${b.color}, ${b.color}99)` }}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0, minWidth: 105 }}>
                      <span style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: 13, color: "#1a1a2e" }}>{fmtL(b.avg)}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,.12)", padding: "2px 7px", borderRadius: 50 }}>{b.trend}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginTop: 32 }}
        >
          <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 14 }}>
            Want the full picture? Compare any two colleges side by side.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-coral" onClick={() => nav("/colleges")} style={{ gap: 8, fontFamily: "'Space Grotesk','Sora',sans-serif" }}>
              Browse All Colleges <ArrowRight size={16} />
            </button>
            <button className="btn btn-ghost" onClick={() => nav("/compare")} style={{ gap: 8, fontFamily: "'Space Grotesk','Sora',sans-serif" }}>
              Compare Colleges
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
