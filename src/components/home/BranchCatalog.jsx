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
    <section id="branches" style={{ background: CL.cream2, padding: "84px 0", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* ── Compact card hero matching the Mentorship section style ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 36,
            maxWidth: 1040, margin: "0 auto 40px", background: CL.card, borderRadius: 24,
            border: `1px solid ${CL.line}`, boxShadow: CL.shadow, padding: 28, alignItems: "center"
          }}>

          {/* Left: Copy & CTA */}
          <div style={{ textAlign: "left" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 800, letterSpacing: "1px",
              background: CL.coralSoft, color: CL.coralDk, padding: "6px 14px", borderRadius: 50, marginBottom: 16, textTransform: "uppercase"
            }}>
              <Sparkles size={13} /> Branch Explorer
            </span>
            <h3 style={{ fontFamily: CL.display, fontWeight: 900, fontSize: "clamp(1.9rem, 3.4vw, 2.4rem)", color: CL.ink, lineHeight: 1.1, marginBottom: 12 }}>
              {TOTAL_BRANCHES}+ branches.<br />
              <span style={{ color: CL.coral }}>{BRANCHES.length} clear paths.</span>
            </h3>
            <p style={{ color: CL.body, fontSize: 15, lineHeight: 1.55, marginBottom: 20, maxWidth: 440 }}>
              Bucketed into {BRANCHES.length} domains with deep insights on placements, salaries, AI outlook and more — so nothing slips through the cracks.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 22 }}>
              {["10 domain paths, deep insights", "5-year salary arcs & charts", "AI disruption risk scores", "Placement stats & top recruiters"].map(bullet => (
                <div key={bullet} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: CL.greenSoft, display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Check size={13} color="#0a8f5b" strokeWidth={3} />
                  </span>
                  <span style={{ fontSize: 14.5, color: CL.ink2, fontWeight: 600 }}>{bullet}</span>
                </div>
              ))}
            </div>

            <Link to="/branches" style={{
              display: "inline-flex", alignItems: "center", gap: 8, background: CL.coral, color: "#fff",
              padding: "13px 24px", borderRadius: 14, fontFamily: CL.display, fontWeight: 800, fontSize: 15,
              textDecoration: "none", boxShadow: "0 10px 24px -8px rgba(255, 105, 61,.6)"
            }}>
              Explore Branches <ArrowRight size={18} />
            </Link>
          </div>

          {/* Right: AI Image */}
          <div style={{ borderRadius: 18, overflow: "hidden", border: `1px solid ${CL.line}`, boxShadow: "0 18px 44px -24px rgba(26,26,46,.2)", background: "#000", aspectRatio: "1 / 1" }}>
            <img src="/images/branch_explorer_staircase.jpg" alt="Career path: idea to success" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
          </div>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {BRANCHES.map((b) => <BranchRow key={b.slug} b={b} nav={nav} />)}
        </div>
      </div>
    </section>
  );
}
