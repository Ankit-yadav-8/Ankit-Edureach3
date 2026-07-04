import { useState, useEffect, Component } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, TrendingUp, Building2, AlertCircle, ArrowLeft, ArrowDown,
  Briefcase, IndianRupee, ShieldCheck, CheckCircle2, XCircle, ChevronDown,
  ChevronRight, Zap, Target, BookOpen, Layers, BarChart3, FlaskConical, Calculator, Code, Wrench, Globe, ShieldAlert
} from "lucide-react";
import { getBranch, BRANCHES } from "../data/branches.js";
import { BRANCH_EXTRA } from "../data/branchExtra.js";
import { BRANCH_ICONS } from "../components/home/branchIcons.js";
import { CL } from "../components/home/clTheme.js";
import Seo from "../components/Seo.jsx";
import { Bars, Trend, Gauge } from "../components/Charts.jsx";
import { chanceTone } from "../components/home/clTheme.js";
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, ScatterChart, Scatter, ZAxis
} from "recharts";

const TABS = [
  { key: "academics", label: "Inside the Degree",    icon: GraduationCap },
  { key: "insights",  label: "Career & Pay Reality", icon: TrendingUp },
  { key: "colleges",  label: "Where to Study",       icon: Building2 },
  { key: "myths",     label: "Myth Busters",         icon: AlertCircle },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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

function Panel({ children, title, right, style }) {
  return (
    <motion.div variants={itemVariants} style={{ background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 20, padding: "24px", boxShadow: CL.shadow, ...style }}>
      {(title || right) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 20 }}>
          {title && <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "1.2px", color: CL.muted, textTransform: "uppercase" }}>{title}</div>}
          {right}
        </div>
      )}
      {children}
    </motion.div>
  );
}

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

function VerticalRoadmap({ semesters }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {semesters.map((s, i) => {
        const isLast = i === semesters.length - 1;
        return (
          <div key={i} style={{ display: "flex", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: CL.coralSoft, color: CL.coralDk, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 14, flexShrink: 0, zIndex: 2, border: `2px solid #fff`, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                {i + 1}
              </div>
              {!isLast && <div style={{ width: 2, flex: 1, background: CL.cream3, margin: "4px 0" }} />}
            </div>
            <div style={{ paddingBottom: isLast ? 0 : 28, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: CL.coral, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>{s.term}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: CL.ink, marginBottom: 12 }}>{s.desc}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {s.courses.map(c => <span key={c} style={{ fontSize: 12, background: CL.cream2, color: CL.ink2, padding: "5px 12px", borderRadius: 8, border: `1px solid ${CL.cream3}`, fontWeight: 600 }}>{c}</span>)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ThreatCard({ risk, label, color }) {
  return (
    <div style={{ background: `linear-gradient(135deg, ${CL.cream2} 0%, #fff 100%)`, border: `1px solid ${CL.cream3}`, borderRadius: 16, padding: 24, textAlign: "center", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
        <Zap size={20} color={color} />
        <span style={{ fontSize: 13, fontWeight: 800, color: CL.muted, textTransform: "uppercase", letterSpacing: "1px" }}>AI Impact Level</span>
      </div>
      <div style={{ fontSize: 48, fontWeight: 800, color: CL.ink, fontFamily: CL.display, lineHeight: 1 }}>{risk}<span style={{ fontSize: 24, color: CL.muted }}>/100</span></div>
      
      <div style={{ display: "flex", height: 8, borderRadius: 4, background: CL.cream3, margin: "20px 0", overflow: "hidden" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${risk}%` }} transition={{ duration: 1, delay: 0.2 }} style={{ background: color, borderRadius: 4 }} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: color, letterSpacing: "0.5px" }}>{label}</div>
    </div>
  );
}

function SplitBlock({ cw, sl }) {
  return (
    <div style={{ display: "flex", borderRadius: 14, overflow: "hidden", height: 80, border: `1px solid ${CL.line}` }}>
      <motion.div initial={{ flex: 0 }} animate={{ flex: cw }} transition={{ duration: 0.8 }} style={{ background: CL.blue, padding: 12, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 24, fontWeight: 800 }}>{cw}%</div>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Coursework</div>
      </motion.div>
      <motion.div initial={{ flex: 0 }} animate={{ flex: sl }} transition={{ duration: 0.8 }} style={{ background: CL.coral, padding: 12, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", textAlign: "right" }}>
        <div style={{ fontSize: 24, fontWeight: 800 }}>{sl}%</div>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Self-learning</div>
      </motion.div>
    </div>
  );
}

/* ── TABS ── */
function Academics({ b, extra }) {
  const meters = b.studyMeters || [];
  const split = b.outcomeSplit || [];
  const placement = b.placement;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: "grid", gap: 24 }}>
      <motion.div variants={itemVariants} style={{ background: `linear-gradient(135deg, ${CL.cream} 0%, ${b.color}11 100%)`, border: `1px solid ${CL.line}`, borderRadius: 20, padding: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: CL.ink, marginBottom: 12, fontFamily: CL.display }}>What you actually study</h2>
        <p style={{ color: CL.ink2, fontSize: 15.5, lineHeight: 1.7, margin: 0 }}>{b.academics.summary}</p>
      </motion.div>

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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24 }}>
        <Panel title="Tools & Technologies Learned">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {extra.toolsAndTech.map((t, i) => (
              <motion.div key={t} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} style={{ background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 8, boxShadow: CL.shadow }}>
                <Wrench size={16} color={b.color} />
                <span style={{ fontWeight: 800, color: CL.ink }}>{t}</span>
              </motion.div>
            ))}
          </div>
        </Panel>

        <Panel title="The 8-Semester Journey">
          <VerticalRoadmap semesters={extra.semesters} />
        </Panel>
      </div>
    </motion.div>
  );
}

function Insights({ b, extra }) {
  const ins = b.insights;
  const riskColor = b.stats.aiRisk >= 60 ? CL.coral : b.stats.aiRisk >= 40 ? CL.amber : CL.green;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
        <motion.div variants={itemVariants}>
          <ThreatCard risk={b.stats.aiRisk} label={b.aiRiskLabel} color={riskColor} />
        </motion.div>
        
        <Panel title="Skills Origin">
          <SplitBlock cw={ins.skills.coursework} sl={ins.skills.selfLearning} />
          <p style={{ marginTop: 20, fontSize: 13.5, color: CL.body, lineHeight: 1.6, marginBottom: 0 }}>
            <strong style={{ color: CL.ink }}>{ins.skills.selfLearning}%</strong> of job-ready skills come from self-learning and independent projects.
          </p>
        </Panel>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24 }}>
        <Panel title="Global vs Domestic Opportunities">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Globe size={18} color={CL.blue} />
              <span style={{ fontWeight: 800, color: CL.ink }}>Global Demand</span>
            </div>
            <span style={{ fontWeight: 800, color: CL.blue }}>{extra.globalVsDomestic.global}%</span>
          </div>
          <div style={{ height: 8, background: CL.cream3, borderRadius: 4, overflow: "hidden", marginBottom: 24 }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${extra.globalVsDomestic.global}%` }} transition={{ duration: 1 }} style={{ height: "100%", background: CL.blue }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Building2 size={18} color={CL.green} />
              <span style={{ fontWeight: 800, color: CL.ink }}>Domestic Demand</span>
            </div>
            <span style={{ fontWeight: 800, color: CL.green }}>{extra.globalVsDomestic.domestic}%</span>
          </div>
          <div style={{ height: 8, background: CL.cream3, borderRadius: 4, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${extra.globalVsDomestic.domestic}%` }} transition={{ duration: 1 }} style={{ height: "100%", background: CL.green }} />
          </div>
        </Panel>

        <Panel title="Industry Demand">
          <div style={{ height: 220, width: "100%" }}>
            <ResponsiveContainer>
              <BarChart data={extra.industryDemand} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={CL.cream3} />
                <XAxis type="number" hide />
                <YAxis dataKey="industry" type="category" axisLine={false} tickLine={false} tick={{ fill: CL.ink2, fontSize: 12, fontWeight: 700 }} width={90} />
                <RechartsTooltip cursor={{ fill: CL.cream2 }} contentStyle={{ borderRadius: 8, border: `1px solid ${CL.line}` }} />
                <Bar dataKey="demand" fill={CL.coral} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Role vs Salary Distribution (Entry to Peak in ₹ LPA)">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          {extra.roleSalaries.map((r, i) => (
            <div key={r.role} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 140, fontSize: 13, fontWeight: 800, color: CL.ink2 }}>{r.role}</div>
              <div style={{ flex: 1, position: "relative", height: 24, background: CL.cream2, borderRadius: 12, overflow: "hidden", display: "flex", alignItems: "center" }}>
                <motion.div initial={{ left: 0, width: 0 }} animate={{ left: `${(r.entry/100)*100}%`, width: `${((r.peak-r.entry)/100)*100}%` }} transition={{ duration: 1, delay: i*0.1 }} style={{ position: "absolute", height: "100%", background: `linear-gradient(90deg, ${CL.coralSoft}, ${CL.coral})`, borderRadius: 12 }} />
                <span style={{ position: "absolute", left: `${(r.entry/100)*100}%`, paddingLeft: 8, fontSize: 11, fontWeight: 800, color: CL.coralDk }}>{r.entry}L</span>
                <span style={{ position: "absolute", left: `${(r.peak/100)*100}%`, marginLeft: -32, fontSize: 11, fontWeight: 800, color: "#fff" }}>{r.peak}L</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </motion.div>
  );
}

function Colleges({ b, extra }) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: "grid", gap: 24 }}>
      <Panel title="5-Year Cutoff Rank Trends">
        <div style={{ height: 300, width: "100%" }}>
          <ResponsiveContainer>
            <LineChart data={extra.cutoffTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CL.cream3} />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: CL.muted, fontWeight: 700 }} />
              <YAxis reversed axisLine={false} tickLine={false} tick={{ fill: CL.muted, fontWeight: 700 }} />
              <RechartsTooltip cursor={{ stroke: CL.line, strokeWidth: 2 }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: CL.shadow }} />
              <Line type="monotone" dataKey="rank" stroke={CL.blue} strokeWidth={3} dot={{ r: 6, fill: CL.blue, stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ textAlign: "center", fontSize: 12, color: CL.muted, marginTop: 12 }}>*Lower rank means higher competition.</div>
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24 }}>
        <Panel title="ROI: Fees vs Avg Placement (₹ LPA)">
          <div style={{ height: 260, width: "100%" }}>
            <ResponsiveContainer>
              <BarChart data={extra.roiMetrics} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CL.cream3} />
                <XAxis dataKey="tier" axisLine={false} tickLine={false} tick={{ fill: CL.ink2, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: CL.muted, fontWeight: 700 }} />
                <RechartsTooltip cursor={{ fill: CL.cream2 }} contentStyle={{ borderRadius: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 700, color: CL.muted, paddingTop: 16 }} />
                <Bar dataKey="fees" name="Total Fees" fill={CL.amber} radius={[4, 4, 0, 0]} />
                <Bar dataKey="placement" name="Avg Placement" fill={CL.green} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Where to study">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
            {b.colleges.map((c, i) => {
              const tone = chanceTone(c.chance);
              return (
                <motion.div key={c.name} variants={itemVariants} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 16, padding: "16px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: tone.fg }} />
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: CL.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>{c.tag}</div>
                    <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 16, color: CL.ink }}>{c.name}</div>
                  </div>
                  <div style={{ display: "inline-flex", alignSelf: "flex-start", fontSize: 10, fontWeight: 800, letterSpacing: ".05em", color: tone.fg, background: tone.bg, padding: "4px 8px", borderRadius: 6 }}>
                    {tone.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Panel>
      </div>
    </motion.div>
  );
}

function FlipCard({ myth }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div style={{ perspective: 1000, height: 160, cursor: "pointer" }} onClick={() => setFlipped(!flipped)}>
      <motion.div
        animate={{ rotateX: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d" }}
      >
        <div style={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 16, display: "flex", flexDirection: "column", justifyContent: "center", padding: 24, boxShadow: CL.shadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, color: CL.coralDk, marginBottom: 8, letterSpacing: "1px" }}>
            <ShieldAlert size={16} /> CHALLENGE
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: CL.ink }}>{myth.title}</div>
          <div style={{ position: "absolute", bottom: 16, right: 20, fontSize: 12, color: CL.muted, fontWeight: 700 }}>Tap to reveal reality</div>
        </div>
        <div style={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", background: CL.greenSoft, border: `1px solid #0a8f5b44`, borderRadius: 16, display: "flex", flexDirection: "column", justifyContent: "center", padding: 24, transform: "rotateX(180deg)", boxShadow: CL.shadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, color: "#0a8f5b", marginBottom: 8, letterSpacing: "1px" }}>
            <CheckCircle2 size={16} /> REALITY
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#066c43", lineHeight: 1.5 }}>{myth.reality}</div>
        </div>
      </motion.div>
    </div>
  );
}

function Myths({ b, extra }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
        <Panel title="Student Satisfaction Score">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Gauge value={extra.satisfaction} label="Overall Satisfaction" color={CL.green} height={200} />
            <p style={{ textAlign: "center", fontSize: 13, color: CL.body, marginTop: -20 }}>Based on alumni feedback regarding career outcomes and stress levels.</p>
          </div>
        </Panel>

        <div style={{ display: "grid", gap: 16 }}>
          {extra.hiddenChallenges.map((m, i) => (
            <motion.div variants={itemVariants} key={i}>
              <FlipCard myth={m} />
            </motion.div>
          ))}
        </div>
      </div>

      <Panel title="Common Myths vs Reality">
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
      </Panel>
    </motion.div>
  );
}

export default function BranchDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const b = getBranch(slug);
  const extra = BRANCH_EXTRA[slug];
  const [tab, setTab] = useState("academics");

  useEffect(() => { setTab("academics"); }, [slug]);
  useEffect(() => { if (b) document.title = `${b.name} — Branch Guide · College Parichay`; }, [b?.name]);

  if (!b || !extra) {
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ background: CL.card, borderRadius: 24, border: `1px solid ${CL.line}`, boxShadow: CL.shadowLg, padding: "32px", marginBottom: 32 }}>
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
        </motion.div>

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
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
              {tab === "academics" && <Academics b={b} extra={extra} />}
              {tab === "insights" && <Insights b={b} extra={extra} />}
              {tab === "colleges" && <Colleges b={b} extra={extra} />}
              {tab === "myths" && <Myths b={b} extra={extra} />}
            </motion.div>
          </AnimatePresence>
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
