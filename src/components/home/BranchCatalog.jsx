import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight, Sparkles } from "lucide-react";
import { BRANCHES, TOTAL_BRANCHES } from "../../data/branches.js";
import { BRANCH_ICONS } from "./branchIcons.js";
import { CL, clEyebrow } from "./clTheme.js";

/* tinted chip palette — a tag always hashes to the same tone */
const CHIP_TONES = [
  { fg: "#C2410C", bg: "#FFF1EA" }, // orange
  { fg: "#6D28D9", bg: "#F3EEFB" }, // violet
  { fg: "#0F7B4F", bg: "#E6F6EE" }, // green
  { fg: "#1D5FBF", bg: "#EAF2FF" }, // blue
  { fg: "#A16207", bg: "#FBF3DC" }, // amber
];
const chipTone = (t) =>
  CHIP_TONES[[...t].reduce((a, c) => a + c.charCodeAt(0), 0) % CHIP_TONES.length];

/* AI-risk score → dot colour + soft pill + human label */
function riskTone(score) {
  if (score >= 60) return { dot: "#E5484D", bg: "#FDECEC", label: "High exposure" };
  if (score >= 40) return { dot: CL.amber, bg: CL.amberSoft, label: "Moderate" };
  return { dot: CL.green, bg: CL.greenSoft, label: "Lower risk" };
}

function BranchRow({ b, nav }) {
  const Icon = BRANCH_ICONS[b.icon] || Briefcase;
  const open = () => nav(`/branches/${b.slug}`);
  const risk = riskTone(b.stats.aiRisk);
  return (
    <motion.div
      role="button"
      tabIndex={0}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
      onClick={open}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}
      className="cl-branch-row"
      style={{
        textAlign: "left", width: "100%", cursor: "pointer",
        background: CL.card, borderRadius: 16, border: `1px solid ${CL.line}`,
        boxShadow: CL.shadow, padding: "22px 24px 22px 30px", overflow: "hidden",
      }}
    >
      {/* per-branch accent bar on the left edge */}
      <span aria-hidden style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: b.color }} />

      {/* arrow — absolutely positioned so layout reflows cleanly on mobile */}
      <span className="cl-branch-row__arrow" style={{
        width: 42, height: 42, borderRadius: "50%",
        background: CL.coral, display: "grid", placeItems: "center",
        boxShadow: "0 8px 20px rgba(255, 105, 61,.35)",
      }}>
        <ArrowRight size={18} color="#fff" />
      </span>

      {/* left: icon + title + tags */}
      <div className="cl-branch-row__main" style={{ display: "flex", gap: 16, alignItems: "flex-start", minWidth: 0 }}>
        <span style={{ width: 50, height: 50, borderRadius: 14, background: `${b.color}18`, border: `1px solid ${b.color}2e`, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Icon size={24} color={b.color} />
        </span>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.12rem", color: CL.ink, letterSpacing: "-0.3px", marginBottom: 4 }}>{b.name}</h3>
          <p style={{ fontSize: 13, color: CL.body, lineHeight: 1.5, marginBottom: 10 }}>{b.desc}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {b.tags.map((t) => {
              const tone = chipTone(t);
              return (
                <span key={t} style={{ fontSize: 11, fontWeight: 700, color: tone.fg, background: tone.bg, padding: "4px 11px", borderRadius: 20, whiteSpace: "nowrap" }}>{t}</span>
              );
            })}
          </div>
        </div>
      </div>

      {/* stats — labelled columns with dividers */}
      <div className="cl-branch-row__stats">
        <div className="cl-branch-row__stat">
          <div className="cl-branch-row__stat-label">Job Growth</div>
          <div style={{ fontFamily: CL.display, fontWeight: 700, fontSize: 13.5, color: CL.coralDk, lineHeight: 1.25 }}>{b.stats.jobGrowth}</div>
        </div>
        <div className="cl-branch-row__stat">
          <div className="cl-branch-row__stat-label">Median Salary</div>
          <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 18, color: CL.ink, letterSpacing: "-.3px", lineHeight: 1.1 }}>{b.stats.medianSalary}</div>
        </div>
        <div className="cl-branch-row__stat">
          <div className="cl-branch-row__stat-label">AI Risk</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: risk.bg, padding: "3px 10px", borderRadius: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: risk.dot, flexShrink: 0 }} />
            <span style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 13, color: CL.ink }}>{b.stats.aiRisk} / 100</span>
          </div>
          <div style={{ fontSize: 10.5, color: CL.muted, marginTop: 4 }}>{risk.label}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function BranchCatalog() {
  const nav = useNavigate();
  return (
    <section id="branches" style={{ background: CL.cream, padding: "84px 0", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* ── Centered section heading (image-free) ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 40px" }}>
          <span style={{ ...clEyebrow }}>
            <Sparkles size={13} /> Branch Explorer
          </span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.4vw,2.9rem)", color: CL.ink, letterSpacing: "-1.3px", margin: "16px 0 12px", lineHeight: 1.08 }}>
            {TOTAL_BRANCHES}+ branches. <span style={{ color: CL.coral, fontStyle: "italic" }}>{BRANCHES.length} clear paths.</span>
          </h2>
          <p style={{ color: CL.body, fontSize: "1.04rem", lineHeight: 1.7, fontStyle: "italic" }}>
            Bucketed into {BRANCHES.length} domains with deep insights on placements, salaries, AI outlook and more — so nothing slips through the cracks.
          </p>
          <div style={{ marginTop: 24 }}>
            <Link to="/branches" style={{
              display: "inline-flex", alignItems: "center", gap: 8, background: CL.coral, color: "#fff",
              padding: "12px 24px", borderRadius: 14, fontFamily: CL.display, fontWeight: 800, fontSize: 15,
              textDecoration: "none", boxShadow: "0 10px 24px -8px rgba(255, 105, 61,.6)"
            }}>
              Explore Branches <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {BRANCHES.map((b) => <BranchRow key={b.slug} b={b} nav={nav} />)}
        </div>
      </div>
    </section>
  );
}
