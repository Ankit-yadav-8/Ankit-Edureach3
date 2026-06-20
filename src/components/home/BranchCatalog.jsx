/* BranchCatalog — campusloom "220+ branches / 10 clear paths" section.
   A list of wide rows; each row shows the path icon, description, tags and
   three at-a-glance stats (job growth, median salary, AI risk). Tapping a
   row opens the full /branches/:slug detail page. */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, IndianRupee, ShieldCheck, ArrowRight } from "lucide-react";
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
        boxShadow: "0 8px 20px rgba(244,126,32,.35)",
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
        <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 40px" }}>
          <span style={clEyebrow}>Branch Explorer</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(2rem,4.4vw,3rem)", color: CL.ink, letterSpacing: "-1.4px", margin: "16px 0 6px", lineHeight: 1.05 }}>
            {TOTAL_BRANCHES}+ branches.
          </h2>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(2rem,4.4vw,3rem)", color: CL.coral, letterSpacing: "-1.4px", margin: "0 0 14px", lineHeight: 1.05 }}>
            {BRANCHES.length} clear paths.
          </h2>
          <p style={{ color: CL.body, fontSize: "1.04rem", lineHeight: 1.7 }}>
            Bucketed into {BRANCHES.length} domains with deep insights on placements, salaries, AI outlook and more — so nothing slips through the cracks.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {BRANCHES.map((b) => <BranchRow key={b.slug} b={b} nav={nav} />)}
        </div>
      </div>
    </section>
  );
}
