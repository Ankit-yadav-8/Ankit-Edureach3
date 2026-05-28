/* CollegeSnapshot — rich college info section for the home page */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy, TrendingUp, MapPin, ArrowRight,
  IndianRupee, Users, Star, Zap, CheckCircle2,
} from "lucide-react";

const TOP_IIT = [
  { name: "IIT Madras",    nirf: 1,  loc: "Chennai",   avg: 2440000, placed: 94, cse: "83–185",    color: "#F97316" },
  { name: "IIT Bombay",   nirf: 3,  loc: "Mumbai",    avg: 2180000, placed: 96, cse: "67–150",    color: "#6366f1" },
  { name: "IIT Delhi",    nirf: 2,  loc: "New Delhi", avg: 2040000, placed: 95, cse: "98–203",    color: "#0ea5a4" },
  { name: "IIT Kanpur",   nirf: 5,  loc: "Kanpur",    avg: 1960000, placed: 92, cse: "290–450",   color: "#8b5cf6" },
  { name: "IIT Roorkee",  nirf: 7,  loc: "Roorkee",   avg: 1780000, placed: 90, cse: "840–1100",  color: "#dc2626" },
  { name: "IIT Kharagpur",nirf: 6,  loc: "Kharagpur", avg: 1850000, placed: 91, cse: "600–900",   color: "#f59e0b" },
];

const TOP_NIT = [
  { name: "NIT Trichy",    nirf: 10, loc: "Tamil Nadu",    avg: 1120000, placed: 92, cse: "≤5,000",  color: "#0ea5a4" },
  { name: "NIT Warangal",  nirf: 26, loc: "Telangana",     avg: 980000,  placed: 89, cse: "≤8,000",  color: "#3b3b98" },
  { name: "NIT Surathkal", nirf: 27, loc: "Karnataka",     avg: 1050000, placed: 88, cse: "≤12,000", color: "#0d3340" },
  { name: "NIT Calicut",   nirf: 28, loc: "Kerala",        avg: 940000,  placed: 87, cse: "≤15,000", color: "#2d6a4f" },
  { name: "NIT Rourkela",  nirf: 35, loc: "Odisha",        avg: 880000,  placed: 86, cse: "≤18,000", color: "#7c3aed" },
  { name: "NIT Allahabad", nirf: 47, loc: "Uttar Pradesh", avg: 760000,  placed: 84, cse: "≤25,000", color: "#b45309" },
];

const BRANCH_PKG = [
  { branch: "CSE / AI",         avg: 2200000, trend: "+12%", color: "#6366f1" },
  { branch: "ECE",              avg: 1450000, trend: "+8%",  color: "#0ea5a4" },
  { branch: "Electrical (EE)",  avg: 1180000, trend: "+6%",  color: "#f59e0b" },
  { branch: "Mechanical",       avg: 980000,  trend: "+4%",  color: "#F97316" },
  { branch: "Civil",            avg: 760000,  trend: "+3%",  color: "#10b981" },
  { branch: "Chemical",         avg: 850000,  trend: "+5%",  color: "#8b5cf6" },
];

const fmtL = (v) => `₹${(v / 100000).toFixed(1)}L`;

function CollegeRow({ c, index, showCse }) {
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
        padding: "12px 16px", borderRadius: 12,
        background: "#fff",
        border: "1px solid rgba(0,0,0,.07)",
        boxShadow: "0 2px 10px rgba(28,28,40,.04)",
        cursor: "pointer", transition: "all .2s",
      }}
      whileHover={{ y: -2, boxShadow: `0 8px 28px ${c.color}22` }}
    >
      {/* Rank */}
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${c.color}18`, border: `1.5px solid ${c.color}33`,
        display: "grid", placeItems: "center", flexShrink: 0,
      }}>
        <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 11, color: c.color }}>#{c.nirf}</span>
      </div>

      {/* Name + loc */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13.5, color: "#1c1c28", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
        <div style={{ fontSize: 11.5, color: "#9ca3af", display: "flex", alignItems: "center", gap: 3 }}>
          <MapPin size={10} /> {c.loc}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13, color: "#F97316" }}>{fmtL(c.avg)}</div>
          <div style={{ fontSize: 10, color: "#9ca3af" }}>avg pkg</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13, color: "#15a06e" }}>{c.placed}%</div>
          <div style={{ fontSize: 10, color: "#9ca3af" }}>placed</div>
        </div>
        {showCse && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 12, color: "#6366f1" }}>{c.cse}</div>
            <div style={{ fontSize: 10, color: "#9ca3af" }}>CSE rank</div>
          </div>
        )}
      </div>

      <ArrowRight size={14} color="#d1d5db" />
    </motion.div>
  );
}

export default function CollegeSnapshot() {
  const nav = useNavigate();

  return (
    <section style={{ background: "linear-gradient(180deg, #fdf8f4 0%, #fff 100%)", padding: "72px 0" }}>
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
          <h2 className="section-title">
            Everything About <span className="accent">Top Institutes</span>
          </h2>
          <p className="section-sub">
            NIRF rankings, avg placements, placed % and CSE cutoff ranges — at a glance.
          </p>
        </motion.div>

        {/* ── IITs + NITs side by side ── */}
        <div className="grid-2" style={{ gap: 28, marginBottom: 36 }}>

          {/* IITs */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(249,115,22,.12)", display: "grid", placeItems: "center" }}>
                  <Trophy size={15} color="#F97316" />
                </div>
                <div>
                  <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1rem", color: "#1c1c28" }}>Top IITs</div>
                  <div style={{ fontSize: 11.5, color: "#9ca3af" }}>23 institutes · 17,385 seats</div>
                </div>
              </div>
              <button onClick={() => nav("/colleges?type=IIT")} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#F97316", fontSize: 12.5, fontWeight: 700 }}>
                All IITs <ArrowRight size={12} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TOP_IIT.map((c, i) => <CollegeRow key={c.name} c={c} index={i} showCse />)}
            </div>
          </div>

          {/* NITs */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(14,165,164,.12)", display: "grid", placeItems: "center" }}>
                  <Star size={15} color="#0ea5a4" />
                </div>
                <div>
                  <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1rem", color: "#1c1c28" }}>Top NITs</div>
                  <div style={{ fontSize: 11.5, color: "#9ca3af" }}>31 institutes · 23,954 seats</div>
                </div>
              </div>
              <button onClick={() => nav("/colleges?type=NIT")} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#0ea5a4", fontSize: 12.5, fontWeight: 700 }}>
                All NITs <ArrowRight size={12} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TOP_NIT.map((c, i) => <CollegeRow key={c.name} c={c} index={i} showCse />)}
            </div>
          </div>
        </div>

        {/* ── Branch-wise Package Comparison ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: "#fff",
            borderRadius: 20,
            border: "1px solid rgba(0,0,0,.07)",
            boxShadow: "0 4px 24px rgba(28,28,40,.07)",
            padding: "28px 28px 24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #6366f1, #F97316, #0ea5a4, #8b5cf6)" }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.15rem", color: "#1c1c28" }}>Branch-wise Average Packages</div>
              <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>Avg across top IITs + NITs · 2025 placement season</div>
            </div>
            <span style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 14px", borderRadius: 50, background: "rgba(21,160,110,.1)", color: "#15a06e", fontSize: 12, fontWeight: 700 }}>
              <TrendingUp size={12} /> Placement 2025
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {BRANCH_PKG.map((b, i) => {
              const pct = Math.round((b.avg / 2500000) * 100);
              return (
                <motion.div
                  key={b.branch}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  style={{ display: "flex", alignItems: "center", gap: 14 }}
                >
                  {/* Branch name */}
                  <div style={{ width: 150, fontFamily: "Sora", fontWeight: 600, fontSize: 13, color: "#374151", flexShrink: 0 }}>{b.branch}</div>

                  {/* Bar */}
                  <div style={{ flex: 1, height: 10, background: "#f3f4f6", borderRadius: 50, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.07, ease: "easeOut" }}
                      style={{ height: "100%", borderRadius: 50, background: `linear-gradient(90deg, ${b.color}, ${b.color}bb)` }}
                    />
                  </div>

                  {/* Value + trend */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, minWidth: 100 }}>
                    <span style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13.5, color: "#1c1c28" }}>{fmtL(b.avg)}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#15a06e", background: "rgba(21,160,110,.1)", padding: "2px 7px", borderRadius: 50 }}>{b.trend}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #f3f4f6", display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "CSE remains highest demand", icon: "🏆" },
              { label: "AI/ML roles driving CSE avg up", icon: "🤖" },
              { label: "Core branches growing steadily", icon: "📈" },
            ].map(({ label, icon }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginTop: 36 }}
        >
          <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 14 }}>
            Want the full picture? Compare any two colleges side by side.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-coral" onClick={() => nav("/colleges")} style={{ gap: 8 }}>
              Browse All Colleges <ArrowRight size={16} />
            </button>
            <button className="btn btn-ghost" onClick={() => nav("/compare")} style={{ gap: 8 }}>
              Compare Colleges
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
