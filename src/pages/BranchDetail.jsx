/* BranchDetail — full deep-dive page for one branch family.
   Campusloom layout: a header card with at-a-glance stats, then four tabs:
   Academics & Outcomes · Advanced Insights (gauge + 5-yr salary arc) ·
   Colleges & Branches · Common Myths. Reached via /branches/:slug. */
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, TrendingUp, Building2, AlertCircle, ArrowLeft, ArrowDown,
  Briefcase, IndianRupee, ShieldCheck, CheckCircle2, XCircle, Check,
} from "lucide-react";
import { getBranch, BRANCHES } from "../data/branches.js";
import { BRANCH_ICONS } from "../components/home/branchIcons.js";
import { CL } from "../components/home/clTheme.js";
import { Trend } from "../components/Charts.jsx";
import { chanceTone } from "../components/home/clTheme.js";

const TABS = [
  { key: "academics", label: "Study & Curriculum",      icon: GraduationCap },
  { key: "insights",  label: "Career & Salary Insights", icon: TrendingUp },
  { key: "colleges",  label: "Top Colleges & Branches",  icon: Building2 },
  { key: "myths",     label: "Myths vs Reality",         icon: AlertCircle },
];

/* ── small UI atoms ── */
function Panel({ children, title, style }) {
  return (
    <div style={{ background: CL.cream2, border: `1px solid ${CL.cream3}`, borderRadius: 16, padding: "20px 22px", ...style }}>
      {title && <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "1.2px", color: CL.muted, textTransform: "uppercase", marginBottom: 16 }}>{title}</div>}
      {children}
    </div>
  );
}

function GaugeArc({ value, color, riskLabel }) {
  // semicircle gauge, green → amber → coral. Number + label sit BELOW the arc
  // (no negative margins) so they never overlap the dial.
  const angle = -90 + (value / 100) * 180;
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 200, height: 112, margin: "0 auto" }}>
        <svg viewBox="0 0 200 112" width="200" height="112">
          <defs>
            <linearGradient id="gauge-cl" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={CL.green} />
              <stop offset="55%" stopColor={CL.amber} />
              <stop offset="100%" stopColor={CL.coral} />
            </linearGradient>
          </defs>
          <path d="M16 100 A 84 84 0 0 1 184 100" fill="none" stroke="url(#gauge-cl)" strokeWidth="16" strokeLinecap="round" />
          {/* needle */}
          <line
            x1="100" y1="100"
            x2={100 + 68 * Math.cos((angle - 90) * Math.PI / 180)}
            y2={100 + 68 * Math.sin((angle - 90) * Math.PI / 180)}
            stroke={CL.ink} strokeWidth="3.5" strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="7" fill={CL.ink} />
        </svg>
      </div>
      <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 3 }}>
        <span style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 34, color, lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 14, color: CL.muted, fontWeight: 600 }}>/100</span>
      </div>
      {riskLabel && (
        <div style={{ marginTop: 7, fontFamily: CL.display, fontWeight: 800, color, fontSize: 12.5, letterSpacing: ".05em" }}>
          {riskLabel}
        </div>
      )}
    </div>
  );
}

function SliderBar({ value, leftLabel, rightLabel, gradient }) {
  return (
    <div>
      <div style={{ position: "relative", height: 10, borderRadius: 50, background: gradient || `linear-gradient(90deg, ${CL.green}, ${CL.coral})`, marginBottom: 10 }}>
        <span style={{ position: "absolute", top: "50%", left: `${value}%`, transform: "translate(-50%,-50%)", width: 20, height: 20, borderRadius: "50%", background: "#fff", border: `3px solid ${CL.coral}`, boxShadow: "0 2px 8px rgba(0,0,0,.2)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", color: CL.muted, textTransform: "uppercase" }}>
        <span>{leftLabel}</span><span>{rightLabel}</span>
      </div>
    </div>
  );
}

function DotBar({ value }) {
  const filled = Math.round(value / 10);
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} style={{ width: 9, height: 16, borderRadius: 2, background: i < filled ? CL.amber : "#e7ddd2" }} />
      ))}
    </div>
  );
}

/* ── tab panels ── */
function Academics({ b }) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel title="What you actually study">
        <p style={{ color: CL.ink2, fontSize: 14.5, lineHeight: 1.75 }}>{b.academics.summary}</p>
      </Panel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
        <Panel title="Core subjects">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {b.academics.coreSubjects.map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: CL.ink2 }}>
                <CheckCircle2 size={16} color={b.color} style={{ flexShrink: 0 }} /> {s}
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Where graduates go">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
            {b.academics.outcomes.map((o) => (
              <span key={o} style={{ fontSize: 13, fontWeight: 700, color: CL.ink2, background: CL.card, border: `1px solid ${CL.line}`, padding: "8px 14px", borderRadius: 10 }}>{o}</span>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Insights({ b }) {
  const ins = b.insights;
  const riskColor = b.stats.aiRisk >= 60 ? CL.coral : b.stats.aiRisk >= 40 ? CL.amber : CL.green;
  const salaryData = [
    { year: "Entry", Median: ins.salaryArc.median.entry, "Top 10%": ins.salaryArc.top.entry },
    { year: "Year 3", Median: ins.salaryArc.median.y3, "Top 10%": ins.salaryArc.top.y3 },
    { year: "Year 5", Median: ins.salaryArc.median.y5, "Top 10%": ins.salaryArc.top.y5 },
  ];
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
        <Panel title="AI Replaceability">
          <GaugeArc value={b.stats.aiRisk} color={riskColor} riskLabel={b.aiRiskLabel} />
          <p style={{ marginTop: 14, fontSize: 12.5, color: CL.body, lineHeight: 1.55, textAlign: "center" }}>
            How exposed this path's core work is to automation over the next decade.
          </p>
        </Panel>

        <Panel title="Skills origin">
          <SliderBar value={ins.skills.selfLearning} leftLabel="Coursework" rightLabel="Self-learning"
            gradient={`linear-gradient(90deg, ${CL.violet}, ${CL.coral})`} />
          <div style={{ marginTop: 18, fontSize: 13.5, color: CL.body, lineHeight: 1.6 }}>
            Roughly <strong style={{ color: CL.ink }}>{ins.skills.selfLearning}%</strong> of job-ready skill comes from projects and self-learning beyond the syllabus.
          </div>
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px dashed ${CL.cream3}` }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "1px", color: CL.muted, textTransform: "uppercase", marginBottom: 12 }}>Does college tier decide outcome?</div>
            <SliderBar value={ins.tierMatters} leftLabel="Tier barely matters" rightLabel="Top institute decisive" />
          </div>
        </Panel>

        <Panel title="Research scope">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {ins.research.map((r) => (
              <div key={r.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".04em", color: CL.muted, textTransform: "uppercase" }}>{r.label}</span>
                <DotBar value={r.value} />
              </div>
            ))}
          </div>
          <p style={{ marginTop: 16, fontSize: 12.8, color: CL.body, lineHeight: 1.6 }}>{ins.researchNote}</p>
        </Panel>
      </div>

      <Panel title={`5-year salary arc · India median (₹ LPA)`}>
        <Trend
          data={salaryData}
          lines={[
            { key: "Top 10%", label: "Top performer", color: CL.coral },
            { key: "Median", label: "Median performer", color: CL.muted },
          ]}
          height={260}
          fmt={(v) => `₹${v}L`}
        />
      </Panel>
    </div>
  );
}

function Colleges({ b }) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel title="Branches in this path">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
          {b.branchesList.map((br) => (
            <span key={br} style={{ fontSize: 13, fontWeight: 700, color: CL.ink2, background: CL.card, border: `1px solid ${CL.line}`, padding: "9px 15px", borderRadius: 10 }}>{br}</span>
          ))}
        </div>
      </Panel>
      <Panel title="Where to study it">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
          {b.colleges.map((c) => {
            const tone = chanceTone(c.chance);
            return (
              <div key={c.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 14, padding: "14px 16px" }}>
                <div>
                  <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 15, color: CL.ink }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: CL.muted, marginTop: 2 }}>{c.tag}</div>
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".04em", color: tone.fg, background: tone.bg, padding: "5px 10px", borderRadius: 50, whiteSpace: "nowrap" }}>{tone.label}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 18, textAlign: "center" }}>
          <Link to="/colleges" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: CL.coralDk, fontWeight: 700, fontSize: 13.5, fontFamily: CL.display }}>
            Browse all colleges →
          </Link>
        </div>
      </Panel>
    </div>
  );
}

function Myths({ b }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {b.myths.map((m, i) => (
        <div key={i} style={{ background: CL.cream2, border: `1px solid ${CL.cream3}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ borderLeft: `4px solid ${CL.coral}`, padding: "16px 20px", background: CL.coralSoft + "55" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 800, letterSpacing: ".08em", color: CL.coralDk, marginBottom: 6 }}>
              <XCircle size={14} /> MYTH
            </div>
            <div style={{ fontWeight: 800, color: CL.ink, fontSize: 15 }}>{m.myth}</div>
          </div>
          <div style={{ borderLeft: `4px solid ${CL.green}`, padding: "16px 20px", background: CL.greenSoft + "55" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 800, letterSpacing: ".08em", color: "#0a8f5b", marginBottom: 6 }}>
              <CheckCircle2 size={14} /> REALITY
            </div>
            <div style={{ color: CL.ink2, fontSize: 14, lineHeight: 1.6 }}>{m.reality}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BranchDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const b = getBranch(slug);
  const [tab, setTab] = useState("academics");

  useEffect(() => { setTab("academics"); if (b) document.title = `${b.name} — Branch Guide · College Parichay`; }, [slug, b]);

  if (!b) {
    return (
      <div className="page container" style={{ paddingTop: 120, textAlign: "center" }}>
        <h1 style={{ fontFamily: CL.display, color: CL.ink }}>Branch not found</h1>
        <Link to="/branches" className="btn btn-coral" style={{ marginTop: 20 }}>Back to Branch Explorer</Link>
      </div>
    );
  }

  const Icon = BRANCH_ICONS[b.icon] || Briefcase;
  const idx = BRANCHES.findIndex((x) => x.slug === slug);
  const next = BRANCHES[(idx + 1) % BRANCHES.length];

  return (
    <div style={{ background: CL.cream, minHeight: "100vh", paddingTop: 92, paddingBottom: 72 }}>
      <div className="container" style={{ maxWidth: 1060 }}>
        <Link to="/branches" style={{
          display: "inline-flex", alignItems: "center", gap: 8, color: CL.ink,
          fontSize: 13.5, fontWeight: 700, fontFamily: CL.display, marginBottom: 20,
          background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 50,
          padding: "9px 18px", boxShadow: CL.shadow, textDecoration: "none",
        }}>
          <ArrowLeft size={16} /> Back to Branch Explorer
        </Link>

        {/* header card */}
        <div style={{ background: CL.card, borderRadius: 22, border: `1px solid ${CL.line}`, boxShadow: CL.shadowLg, padding: "26px 28px", marginBottom: 22 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 22 }}>
            <span style={{ width: 64, height: 64, borderRadius: 17, background: `${b.color}18`, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon size={32} color={b.color} />
            </span>
            <div style={{ flex: "1 1 260px", minWidth: 0 }}>
              <h1 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.9rem", color: CL.ink, letterSpacing: "-0.6px", marginBottom: 6 }}>{b.name}</h1>
              <p style={{ color: CL.body, fontSize: 14, lineHeight: 1.55, marginBottom: 11, maxWidth: 420 }}>{b.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {b.tags.map((t) => (
                  <span key={t} style={{ fontSize: 11, fontWeight: 700, color: CL.ink2, background: CL.cream2, border: `1px solid ${CL.cream3}`, padding: "3px 11px", borderRadius: 7 }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 26, alignItems: "center", flexWrap: "wrap" }}>
              <HeaderStat icon={Briefcase} value={b.stats.jobGrowth} label="Job Growth" color={CL.green} />
              <HeaderStat icon={IndianRupee} value={b.stats.medianSalary} label="Median Salary" color={CL.amber} />
              <HeaderStat icon={ShieldCheck} value={`${b.stats.aiRisk}/100`} label="AI Risk" color={CL.coral} />
              <button onClick={() => setTab("insights")} title="Jump to insights" style={{ width: 46, height: 46, borderRadius: "50%", background: CL.coral, display: "grid", placeItems: "center", boxShadow: "0 8px 20px rgba(244,126,32,.35)" }}>
                <ArrowDown size={20} color="#fff" />
              </button>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div style={{ display: "flex", gap: 6, flexWrap: "nowrap", overflowX: "auto", WebkitOverflowScrolling: "touch", borderBottom: `1px solid ${CL.line}`, marginBottom: 26, scrollbarWidth: "none" }}>
          {TABS.map((t) => {
            const on = tab === t.key;
            const TIcon = t.icon;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "12px 16px", fontSize: 13.5, fontWeight: 700, fontFamily: CL.display,
                color: on ? CL.coralDk : CL.body, cursor: "pointer",
                borderBottom: on ? `2.5px solid ${CL.coral}` : "2.5px solid transparent",
                marginBottom: -1, whiteSpace: "nowrap", flexShrink: 0, background: "transparent",
              }}>
                <TIcon size={15} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* panels */}
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}>
            {tab === "academics" && <Academics b={b} />}
            {tab === "insights" && <Insights b={b} />}
            {tab === "colleges" && <Colleges b={b} />}
            {tab === "myths" && <Myths b={b} />}
          </motion.div>
        </AnimatePresence>

        {/* next branch */}
        <div style={{ marginTop: 36, textAlign: "center" }}>
          <button onClick={() => nav(`/branches/${next.slug}`)} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 50, padding: "11px 22px", fontFamily: CL.display, fontWeight: 700, fontSize: 13.5, color: CL.ink, cursor: "pointer", boxShadow: CL.shadow }}>
            Next path: {next.name} →
          </button>
        </div>
      </div>
    </div>
  );
}

function HeaderStat({ icon: Icon, value, label, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <Icon size={18} color={color} />
      <div>
        <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 14, color: CL.ink, lineHeight: 1.1, whiteSpace: "nowrap" }}>{value}</div>
        <div style={{ fontSize: 10.5, color: CL.muted }}>{label}</div>
      </div>
    </div>
  );
}
