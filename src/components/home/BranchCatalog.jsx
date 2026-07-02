import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, IndianRupee, ShieldCheck, ArrowRight, Sparkles, Check } from "lucide-react";
import { BRANCHES, TOTAL_BRANCHES } from "../../data/branches.js";
import { BRANCH_ICONS } from "./branchIcons.js";
import { CL, clEyebrow } from "./clTheme.js";

function Stat({ icon: Icon, value, label, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
      <Icon size={18} color={color} style={{ flexShrink: 0 }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 14, color: CL.ink, lineHeight: 1.1, whiteSpace: "nowrap" }}>{value}</div>
        <div style={{ fontSize: 10.5, color: CL.muted, letterSpacing: ".02em" }}>{label}</div>
      </div>
    </div>
  );
}

function BranchRow({ b, nav }) {
  const Icon = BRANCH_ICONS[b.icon] || Briefcase;
  const open = () => nav(`/branches/${b.slug}`);
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
        background: CL.card, borderRadius: 20, border: `1px solid ${CL.line}`,
        boxShadow: CL.shadow, padding: "20px 22px",
      }}
    >
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
        <span style={{ width: 50, height: 50, borderRadius: 14, background: `${b.color}18`, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Icon size={24} color={b.color} />
        </span>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.12rem", color: CL.ink, letterSpacing: "-0.3px", marginBottom: 4 }}>{b.name}</h3>
          <p style={{ fontSize: 13, color: CL.body, lineHeight: 1.5, marginBottom: 10 }}>{b.desc}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {b.tags.map((t) => (
              <span key={t} style={{ fontSize: 11, fontWeight: 700, color: CL.ink2, background: CL.cream2, border: `1px solid ${CL.cream3}`, padding: "3px 10px", borderRadius: 7, whiteSpace: "nowrap" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="cl-branch-row__stats">
        <Stat icon={Briefcase} value={b.stats.jobGrowth} label="Job Growth" color={CL.green} />
        <Stat icon={IndianRupee} value={b.stats.medianSalary} label="Median Salary" color={CL.amber} />
        <Stat icon={ShieldCheck} value={`${b.stats.aiRisk}/100`} label="AI Risk" color={CL.coral} />
      </div>
    </motion.div>
  );
}

export default function BranchCatalog() {
  const nav = useNavigate();
  return (
    <section id="branches" style={{ background: CL.cream, padding: "84px 0", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* ── Compact card hero matching the Mentorship section style ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22,
            margin: "0 0 16px", background: CL.card, borderRadius: 20,
            border: `1px solid ${CL.line}`, boxShadow: CL.shadow, padding: "18px 20px", alignItems: "stretch"
          }}>

          {/* Left: Copy & CTA */}
          <div style={{ textAlign: "left" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, letterSpacing: "1px",
              background: CL.coralSoft, color: CL.coralDk, padding: "4px 11px", borderRadius: 50, marginBottom: 10, textTransform: "uppercase"
            }}>
              <Sparkles size={12} /> Branch Explorer
            </span>
            <h3 style={{ fontFamily: CL.display, fontWeight: 900, fontSize: "clamp(1.35rem, 2.4vw, 1.8rem)", color: CL.ink, lineHeight: 1.15, marginBottom: 7 }}>
              {TOTAL_BRANCHES}+ branches. <span style={{ color: CL.coral }}>{BRANCHES.length} clear paths.</span>
            </h3>
            <p style={{ color: CL.body, fontSize: 13.5, lineHeight: 1.5, marginBottom: 12, maxWidth: 520 }}>
              Bucketed into {BRANCHES.length} domains with deep insights on placements, salaries &amp; AI outlook.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px 18px", marginBottom: 14 }}>
              {["10 domain paths", "5-year salary arcs", "AI risk scores", "Placement stats"].map(bullet => (
                <div key={bullet} style={{ display: "flex", gap: 7, alignItems: "center" }}>
                  <span style={{ width: 18, height: 18, borderRadius: "50%", background: CL.greenSoft, display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Check size={11} color="#0a8f5b" strokeWidth={3} />
                  </span>
                  <span style={{ fontSize: 13, color: CL.ink2, fontWeight: 600 }}>{bullet}</span>
                </div>
              ))}
            </div>

            <Link to="/branches" style={{
              display: "inline-flex", alignItems: "center", gap: 7, background: CL.coral, color: "#fff",
              padding: "9px 18px", borderRadius: 12, fontFamily: CL.display, fontWeight: 800, fontSize: 13.5,
              textDecoration: "none", boxShadow: "0 10px 24px -8px rgba(255, 105, 61,.6)"
            }}>
              Explore Branches <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right: AI Image */}
          <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${CL.line}`, boxShadow: "0 18px 44px -24px rgba(26,26,46,.2)", height: "100%", minHeight: 150 }}>
            <img src="/images/branch_explorer_career.png" alt="Career path: idea to success" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {BRANCHES.map((b) => <BranchRow key={b.slug} b={b} nav={nav} />)}
        </div>
      </div>
    </section>
  );
}
