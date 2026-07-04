import { useState, useEffect, Component } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, TrendingUp, Building2, AlertCircle, ArrowLeft, ArrowDown,
  Briefcase, IndianRupee, ShieldCheck, CheckCircle2, XCircle, ChevronDown,
  ChevronRight, Zap, Target, BookOpen, Layers, BarChart3, FlaskConical, Calculator, Code
} from "lucide-react";
import { getBranch, BRANCHES } from "../data/branches.js";
import { BRANCH_ICONS } from "../components/home/branchIcons.js";
import { CL } from "../components/home/clTheme.js";
import Seo from "../components/Seo.jsx";
import { Bars, Trend } from "../components/Charts.jsx";
import { chanceTone } from "../components/home/clTheme.js";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

const TABS = [
  { key: "academics", label: "Inside the Degree",    icon: GraduationCap },
  { key: "insights",  label: "Career & Pay Reality", icon: TrendingUp },
  { key: "colleges",  label: "Where to Study",       icon: Building2 },
  { key: "myths",     label: "Myth Busters",         icon: AlertCircle },
];

/* Panel Boundary */
class PanelBoundary extends Component {
  constructor(props) { super(props); this.state = { err: false }; }
  static getDerivedStateFromError() { return { err: true }; }
  componentDidUpdate(prev) { if (prev.tabKey !== this.props.tabKey && this.state.err) this.setState({ err: false }); }
  render() {
    if (this.state.err) {
      return (
        <div style={{ background: CL.cream2, border: `1px solid ${CL.cream3}`, borderRadius: 16, padding: "28px 22px", textAlign: "center", color: CL.body }}>
          This section couldn’t load for this branch. Try another tab.
        </div>
      );
    }
    return this.props.children;
  }
}

/* ── UI ATOMS ── */
function Panel({ children, title, right, style }) {
  return (
    <div style={{ background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 20, padding: "24px", boxShadow: CL.shadow, ...style }}>
      {(title || right) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 20 }}>
          {title && <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "1.2px", color: CL.muted, textTransform: "uppercase" }}>{title}</div>}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

const chipStyle = { fontSize: 13, fontWeight: 700, color: CL.ink2, background: CL.cream2, border: `1px solid ${CL.cream3}`, padding: "8px 14px", borderRadius: 10 };

/* Radar Chart (Spider Chart) for Skills */
const SKILL_MAP = { Coding: Code, Theory: BookOpen, Math: Calculator, "Lab Work": FlaskConical };
const LEVEL_VAL = { HEAVY: 100, MODERATE: 65, LIGHT: 35, MINIMAL: 15 };

function SpiderSkillChart({ meters, color }) {
  const data = meters.map(m => ({ subject: m.label, A: LEVEL_VAL[m.level] || 50, fullMark: 100 }));
  return (
    <div style={{ height: 260, width: "100%", position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke={CL.cream3} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: CL.ink, fontSize: 12, fontWeight: 700 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Skills" dataKey="A" stroke={color} fill={color} fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* Segmented Bar (Replacement for Donut) */
function SegmentedBar({ data }) {
  const total = data.reduce((s, d) => s + d.pct, 0) || 100;
  const colors = [CL.blue, CL.green, CL.coral, CL.violet, CL.amber];
  return (
    <div>
      <div style={{ display: "flex", height: 28, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
        {data.map((d, i) => (
          <div key={d.label} style={{ width: `${(d.pct / total) * 100}%`, background: colors[i % colors.length], transition: "width .3s" }} title={`${d.label}: ${d.pct}%`} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {data.map((d, i) => (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5 }}>
            <span style={{ width: 12, height: 12, borderRadius: 4, background: colors[i % colors.length] }} />
            <span style={{ fontWeight: 800, color: CL.ink }}>{d.pct}%</span>
            <span style={{ color: CL.body }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Vertical Roadmap Stepper (Journey) */
function VerticalRoadmap({ years }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {years.map((y, i) => {
        const isLast = i === years.length - 1;
        return (
          <div key={i} style={{ display: "flex", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: CL.coralSoft, color: CL.coralDk, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 14, flexShrink: 0, zIndex: 2, border: `2px solid #fff`, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                {i + 1}
              </div>
              {!isLast && <div style={{ width: 2, flex: 1, background: CL.cream3, margin: "4px 0" }} />}
            </div>
            <div style={{ paddingBottom: isLast ? 0 : 28, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: CL.coral, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>{y.tag || `Year ${i+1}`}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: CL.ink, marginBottom: 12 }}>{y.title}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {y.subjects.map(s => <span key={s} style={{ fontSize: 12, background: CL.cream2, color: CL.ink2, padding: "5px 12px", borderRadius: 8, border: `1px solid ${CL.cream3}`, fontWeight: 600 }}>{s}</span>)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Threat Level Card (AI Risk) */
function ThreatCard({ risk, label, color }) {
  return (
    <div style={{ background: `linear-gradient(135deg, ${CL.cream2} 0%, #fff 100%)`, border: `1px solid ${CL.cream3}`, borderRadius: 16, padding: 24, textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
        <Zap size={20} color={color} />
        <span style={{ fontSize: 13, fontWeight: 800, color: CL.muted, textTransform: "uppercase", letterSpacing: "1px" }}>AI Impact Level</span>
      </div>
      <div style={{ fontSize: 48, fontWeight: 800, color: CL.ink, fontFamily: CL.display, lineHeight: 1 }}>{risk}<span style={{ fontSize: 24, color: CL.muted }}>/100</span></div>
      
      <div style={{ display: "flex", height: 8, borderRadius: 4, background: CL.cream3, margin: "20px 0", overflow: "hidden" }}>
        <div style={{ width: `${risk}%`, background: color, borderRadius: 4 }} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: color, letterSpacing: "0.5px" }}>{label}</div>
    </div>
  );
}

/* Split Visual Blocks */
function SplitBlock({ cw, sl }) {
  return (
    <div style={{ display: "flex", borderRadius: 14, overflow: "hidden", height: 80, border: `1px solid ${CL.line}` }}>
      <div style={{ flex: cw, background: CL.blue, padding: 12, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 24, fontWeight: 800 }}>{cw}%</div>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Coursework</div>
      </div>
      <div style={{ flex: sl, background: CL.coral, padding: 12, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", textAlign: "right" }}>
        <div style={{ fontSize: 24, fontWeight: 800 }}>{sl}%</div>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Self-learning</div>
      </div>
    </div>
  );
}

/* ── TABS ── */
function Academics({ b }) {
  const meters = b.studyMeters || [];
  const split = b.outcomeSplit || [];
  const placement = b.placement;
  
  const core = b.academics.coreSubjects || [];
  const years = (b.journey && b.journey.length === 4) ? b.journey : [
    { title: "Common courses, settling in", tag: "FOUNDATION", subjects: ["Mathematics I & II", "Physics & Chemistry", "Intro to Programming", "Engineering Graphics"] },
    { title: "Core branch subjects begin", tag: "CORE LOAD", subjects: [...core.slice(0, 3)] },
    { title: "Specialisation + internships", tag: "PEAK PRESSURE", subjects: core.slice(2, 5).length ? core.slice(2, 5) : core.slice(0, 3) },
    { title: "Electives, projects, thesis", tag: "EXIT YEAR", subjects: [...core.slice(4), "Major Project / Thesis"].filter(Boolean) },
  ];

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ background: `linear-gradient(135deg, ${CL.cream} 0%, ${b.color}11 100%)`, border: `1px solid ${CL.line}`, borderRadius: 20, padding: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: CL.ink, marginBottom: 12, fontFamily: CL.display }}>What you actually study</h2>
        <p style={{ color: CL.ink2, fontSize: 15.5, lineHeight: 1.7, margin: 0 }}>{b.academics.summary}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24 }}>
        {meters.length > 0 && (
          <Panel title="Skill Composition">
            <SpiderSkillChart meters={meters} color={b.color} />
          </Panel>
        )}
        <div style={{ display: "grid", gap: 24 }}>
          {split.length > 0 && (
            <Panel title="Graduate Placements">
              <SegmentedBar data={split} />
            </Panel>
          )}
          {placement && (
            <Panel title="Tech Placement Access">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ display: "grid", placeItems: "center", width: 42, height: 42, borderRadius: 12, background: CL.greenSoft, color: "#0a8f5b" }}>
                  <Target size={22} />
                </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: CL.ink }}>{placement.headline}</span>
              </div>
              <p style={{ fontSize: 14, color: CL.body, lineHeight: 1.6, margin: 0 }}>{placement.note}</p>
            </Panel>
          )}
        </div>
      </div>

      <Panel title="The 4-Year Journey">
        <VerticalRoadmap years={years} />
      </Panel>
    </div>
  );
}

function Insights({ b }) {
  const ins = b.insights;
  const riskColor = b.stats.aiRisk >= 60 ? CL.coral : b.stats.aiRisk >= 40 ? CL.amber : CL.green;
  const roles = b.careerRoles || [];
  const recruiters = b.recruiters || [];
  const arc = ins.salaryArc;

  const salaryData = [
    { year: "Entry", Median: arc.median.entry, "Top 10%": arc.top.entry },
    { year: "Year 3", Median: arc.median.y3, "Top 10%": arc.top.y3 },
    { year: "Year 5", Median: arc.median.y5, "Top 10%": arc.top.y5 },
  ];

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
        <ThreatCard risk={b.stats.aiRisk} label={b.aiRiskLabel} color={riskColor} />
        
        <Panel title="Skills Origin">
          <SplitBlock cw={ins.skills.coursework} sl={ins.skills.selfLearning} />
          <p style={{ marginTop: 20, fontSize: 13.5, color: CL.body, lineHeight: 1.6, marginBottom: 0 }}>
            <strong style={{ color: CL.ink }}>{ins.skills.selfLearning}%</strong> of job-ready skills come from self-learning and independent projects.
          </p>
        </Panel>
      </div>

      <Panel title="5-Year Salary Progression (₹ LPA)">
        <Trend
          data={salaryData}
          lines={[
            { key: "Top 10%", label: "Top 10%", color: CL.coral },
            { key: "Median", label: "Median", color: CL.blue },
          ]}
          height={280}
          fmt={(v) => `₹${v}L`}
        />
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24 }}>
        {roles.length > 0 && (
          <Panel title="Typical Career Roles">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {roles.map(r => (
                <span key={r.role} style={{
                  fontSize: 13, fontWeight: 700, padding: "8px 14px", borderRadius: 10,
                  background: r.direct ? CL.cream2 : CL.card,
                  color: r.direct ? CL.ink : CL.muted,
                  border: `1px solid ${r.direct ? CL.cream3 : CL.line}`,
                  boxShadow: r.direct ? "0 2px 5px rgba(0,0,0,0.02)" : "none"
                }}>
                  {r.role}
                </span>
              ))}
            </div>
          </Panel>
        )}
        {recruiters.length > 0 && (
          <Panel title="Top Recruiters">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
              {recruiters.map(r => (
                <div key={r} style={{ background: CL.cream2, border: `1px solid ${CL.line}`, borderRadius: 12, padding: "14px", textAlign: "center", fontSize: 13, fontWeight: 800, color: CL.ink2 }}>
                  {r}
                </div>
              ))}
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}

function Colleges({ b }) {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <Panel title="Where to study">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
          {b.colleges.map((c, i) => {
            const tone = chanceTone(c.chance);
            return (
              <div key={c.name} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 16, padding: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: tone.fg }} />
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: CL.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>{c.tag}</div>
                  <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 18, color: CL.ink }}>{c.name}</div>
                </div>
                <div style={{ display: "inline-flex", alignSelf: "flex-start", fontSize: 11, fontWeight: 800, letterSpacing: ".05em", color: tone.fg, background: tone.bg, padding: "6px 12px", borderRadius: 8 }}>
                  {tone.label}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function Myths({ b }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {b.myths.map((m, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={i} style={{ background: CL.card, border: `1px solid ${isOpen ? CL.coral : CL.line}`, borderRadius: 16, overflow: "hidden", transition: "all .2s" }}>
            <button onClick={() => setOpenIdx(isOpen ? -1 : i)} style={{ width: "100%", textAlign: "left", padding: "20px 24px", background: "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: CL.coralSoft, color: CL.coralDk, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <XCircle size={16} />
                </div>
                <span style={{ fontWeight: 800, color: CL.ink, fontSize: 16 }}>{m.myth}</span>
              </div>
              <ChevronDown size={20} color={CL.muted} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <div style={{ padding: "0 24px 24px", borderTop: `1px solid ${CL.line}` }}>
                    <div style={{ marginTop: 20, background: CL.greenSoft, padding: "16px 20px", borderRadius: 12, borderLeft: `4px solid #0a8f5b`, display: "flex", gap: 12 }}>
                      <CheckCircle2 size={20} color="#0a8f5b" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div style={{ color: "#066c43", fontSize: 15, lineHeight: 1.6, fontWeight: 500 }}>{m.reality}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default function BranchDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const b = getBranch(slug);
  const [tab, setTab] = useState("academics");

  useEffect(() => { setTab("academics"); }, [slug]);
  useEffect(() => { if (b) document.title = `${b.name} — Branch Guide · College Parichay`; }, [b?.name]);

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

  const seoDesc = `${b.name}: ${(b.desc || "").slice(0, 150)} Explore scope, salaries, AI-disruption risk, top recruiters, placements and the best colleges.`;

  return (
    <div style={{ background: CL.cream, minHeight: "100vh", paddingTop: 92, paddingBottom: 72 }}>
      <Seo
        title={`${b.name} — Scope, Salary, Colleges & AI Risk`}
        description={seoDesc}
        path={`/branches/${slug}`}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Branches", path: "/branches" },
          { name: b.name, path: `/branches/${slug}` },
        ]}
      />
      <div className="container" style={{ maxWidth: 1060 }}>
        <Link to="/branches" className="cp-back-btn" style={{ marginBottom: 24 }}>
          <ArrowLeft size={16} /> Back to Catalog
        </Link>

        {/* Dashboard Header */}
        <div style={{ background: CL.card, borderRadius: 24, border: `1px solid ${CL.line}`, boxShadow: CL.shadowLg, padding: "32px", marginBottom: 32 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 32 }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: `linear-gradient(135deg, ${b.color}22 0%, ${b.color}11 100%)`, border: `1px solid ${b.color}33`, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon size={40} color={b.color} />
            </div>
            <div style={{ flex: "1 1 300px" }}>
              <h1 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "2.2rem", color: CL.ink, letterSpacing: "-0.8px", marginBottom: 12, lineHeight: 1.1 }}>{b.name}</h1>
              <p style={{ color: CL.body, fontSize: 15, lineHeight: 1.6, marginBottom: 16, maxWidth: 500 }}>{b.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {b.tags.map((t) => (
                  <span key={t} style={{ fontSize: 11.5, fontWeight: 700, color: CL.ink, background: CL.cream2, border: `1px solid ${CL.cream3}`, padding: "4px 12px", borderRadius: 8 }}>{t}</span>
                ))}
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16, background: CL.cream2, padding: 24, borderRadius: 20, minWidth: 220 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: CL.muted, textTransform: "uppercase", letterSpacing: "1px" }}>Snapshot</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <IndianRupee size={20} color={CL.coral} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: CL.ink }}>{b.stats.medianSalary}</div>
                  <div style={{ fontSize: 12, color: CL.muted }}>Median Salary</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Briefcase size={20} color={CL.blue} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: CL.ink }}>{b.stats.jobGrowth}</div>
                  <div style={{ fontSize: 12, color: CL.muted }}>Market Demand</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div style={{ display: "flex", gap: 12, flexWrap: "nowrap", overflowX: "auto", WebkitOverflowScrolling: "touch", marginBottom: 32, scrollbarWidth: "none", paddingBottom: 4 }}>
          {TABS.map((t) => {
            const on = tab === t.key;
            const TIcon = t.icon;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 20px", fontSize: 14, fontWeight: 800, fontFamily: CL.display,
                color: on ? "#fff" : CL.ink2, cursor: "pointer",
                background: on ? CL.coral : CL.card,
                border: `1px solid ${on ? CL.coral : CL.line}`,
                borderRadius: 16, whiteSpace: "nowrap", flexShrink: 0,
                boxShadow: on ? `0 8px 24px ${CL.coral}44` : "none",
                transition: "all .2s"
              }}>
                <TIcon size={18} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <PanelBoundary tabKey={tab}>
          <motion.div key={tab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {tab === "academics" && <Academics b={b} />}
            {tab === "insights" && <Insights b={b} />}
            {tab === "colleges" && <Colleges b={b} />}
            {tab === "myths" && <Myths b={b} />}
          </motion.div>
        </PanelBoundary>

        {/* Next Branch */}
        <div style={{ marginTop: 48, textAlign: "center" }}>
          <button onClick={() => { nav(`/branches/${next.slug}`); window.scrollTo({top: 0, behavior: "smooth"}); }} style={{ display: "inline-flex", alignItems: "center", gap: 12, background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 50, padding: "16px 32px", fontFamily: CL.display, fontWeight: 800, fontSize: 15, color: CL.ink, cursor: "pointer", boxShadow: CL.shadowLg, transition: "transform .2s" }}>
            Next Path: {next.name} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
