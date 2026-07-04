import { useState, useEffect, Component } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, TrendingUp, Building2, AlertCircle, ArrowLeft,
  Briefcase, IndianRupee, CheckCircle2, XCircle, ChevronDown,
  ChevronRight, Zap, Target, BookOpen, Wrench, Globe, ShieldAlert,
  Award, Users, MapPin, Layers, BarChart3, ArrowRight
} from "lucide-react";
import { getBranch, BRANCHES } from "../data/branches.js";
import { BRANCH_EXTRA } from "../data/branchExtra.js";
import { BRANCH_ICONS } from "../components/home/branchIcons.js";
import { CL } from "../components/home/clTheme.js";
import Seo from "../components/Seo.jsx";
import { Trend, Gauge } from "../components/Charts.jsx";
import { chanceTone } from "../components/home/clTheme.js";
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar
} from "recharts";

/* ─── TABS ─── */
const TABS = [
  { key: "academics", label: "Inside the Degree",    icon: GraduationCap },
  { key: "insights",  label: "Career & Pay Reality", icon: TrendingUp },
  { key: "colleges",  label: "Where to Study",       icon: Building2 },
  { key: "myths",     label: "Myth Busters",         icon: AlertCircle },
];

/* ─── Animation ─── */
const cV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const iV = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 26 } } };

/* ─── Error Boundary ─── */
class PanelBoundary extends Component {
  constructor(p) { super(p); this.state = { err: false }; }
  static getDerivedStateFromError() { return { err: true }; }
  componentDidUpdate(prev) { if (prev.tabKey !== this.props.tabKey && this.state.err) this.setState({ err: false }); }
  render() {
    if (this.state.err) return <div style={{ background: CL.cream2, border: `1px solid ${CL.cream3}`, borderRadius: 14, padding: 24, textAlign: "center", color: CL.body, fontSize: 13 }}>This section couldn't load. Try another tab.</div>;
    return this.props.children;
  }
}

/* ─── ATOMS ─── */
const F = { xs: 10.5, sm: 11.5, md: 12.5, base: 13, lg: 15, xl: 18, xxl: 22 };
const eye = { fontSize: F.xs, fontWeight: 800, letterSpacing: "1.1px", color: CL.muted, textTransform: "uppercase" };

function Card({ children, title, style }) {
  return (
    <motion.div variants={iV} style={{ background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 16, padding: "20px", boxShadow: CL.shadow, ...style }}>
      {title && <div style={{ ...eye, marginBottom: 16 }}>{title}</div>}
      {children}
    </motion.div>
  );
}

/* ─── Intensity Bars (segmented blocks) ─── */
const LEVEL_BLOCKS = { HEAVY: 5, MODERATE: 3, LIGHT: 2, MINIMAL: 1 };
const LEVEL_COLOR = { HEAVY: CL.coral, MODERATE: CL.amber, LIGHT: CL.blue, MINIMAL: CL.muted };
function IntensityBars({ meters }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {meters.map(m => {
        const count = LEVEL_BLOCKS[m.level] || 2;
        const color = LEVEL_COLOR[m.level] || CL.muted;
        return (
          <div key={m.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: F.base, fontWeight: 700, color: CL.ink, minWidth: 80 }}>{m.label}</span>
            <div style={{ display: "flex", gap: 4, flex: 1, marginLeft: 16, marginRight: 12 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div key={i} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: i * 0.06, duration: 0.3 }}
                  style={{ height: 7, flex: 1, borderRadius: 3, background: i < count ? color : CL.cream3 }} />
              ))}
            </div>
            <span style={{ fontSize: F.xs, fontWeight: 800, color: color, minWidth: 70, textAlign: "right" }}>{m.level}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Donut (pure SVG) ─── */
const DONUT_COLORS = ["#FF693D", "#0FAE6E", "#3A86FF", "#E29A2E", "#7B5EA7"];
function MiniDonut({ data, size = 120 }) {
  const total = data.reduce((s, d) => s + d.pct, 0) || 1;
  const r = size / 2 - 8, cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const biggest = data.reduce((max, d) => d.pct > max.pct ? d : max, data[0]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {data.map((d, i) => {
            const pct = d.pct / total;
            const dashArray = `${pct * circumference} ${circumference}`;
            const dashOffset = -offset * circumference;
            offset += pct;
            return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
              strokeWidth={14} strokeDasharray={dashArray} strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: "stroke-dasharray 0.6s" }} />;
          })}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: F.xxl, fontWeight: 800, color: CL.ink, lineHeight: 1 }}>{biggest.pct}%</div>
            <div style={{ fontSize: F.xs, color: CL.muted, fontWeight: 600, marginTop: 2 }}>{biggest.label.split("/")[0].trim()}</div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 120 }}>
        {data.map((d, i) => (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: F.sm }}>
            <span style={{ width: 9, height: 9, borderRadius: 2, background: DONUT_COLORS[i % DONUT_COLORS.length], flexShrink: 0 }} />
            <span style={{ color: CL.body, fontWeight: 500 }}>{d.pct}% {d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Journey Cards ─── */
function JourneyCards({ years }) {
  const phaseColors = [CL.blue, CL.green, CL.coral, CL.violet];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
      {years.map((y, i) => (
        <motion.div key={i} variants={iV} style={{
          background: i === 2 ? CL.coral : CL.card,
          color: i === 2 ? "#fff" : CL.ink,
          border: `1px solid ${i === 2 ? CL.coral : CL.line}`,
          borderRadius: 14, padding: "18px", position: "relative", overflow: "hidden"
        }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} style={{ height: 4, width: 22, borderRadius: 2, background: i === 2 ? "rgba(255,255,255,0.4)" : phaseColors[i % 4] }} />
            ))}
          </div>
          <div style={{ fontSize: F.xs, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: i === 2 ? "rgba(255,255,255,0.7)" : CL.coral, marginBottom: 6 }}>{y.tag}</div>
          <div style={{ fontSize: F.lg, fontWeight: 800, marginBottom: 10, lineHeight: 1.3 }}>{y.title}</div>
          <div style={{ fontSize: F.sm, lineHeight: 1.5, color: i === 2 ? "rgba(255,255,255,0.85)" : CL.body }}>
            {y.subjects.slice(0, 3).join(", ")}{y.subjects.length > 3 ? ` +${y.subjects.length - 3} more` : ""}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Flip Card ─── */
function FlipCard({ myth }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ perspective: 1000, height: 150, cursor: "pointer" }} onClick={() => setF(!f)}>
      <motion.div animate={{ rotateX: f ? 180 : 0 }} transition={{ duration: 0.5, type: "spring", damping: 20 }}
        style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 14, display: "flex", flexDirection: "column", justifyContent: "center", padding: 20, boxShadow: CL.shadow }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, ...eye, color: CL.coralDk, marginBottom: 6 }}><ShieldAlert size={14} /> CHALLENGE</div>
          <div style={{ fontSize: F.base, fontWeight: 700, color: CL.ink, lineHeight: 1.4 }}>{myth.title}</div>
          <div style={{ position: "absolute", bottom: 12, right: 16, fontSize: F.xs, color: CL.muted }}>Tap to flip</div>
        </div>
        <div style={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", background: CL.greenSoft, border: `1px solid #0a8f5b33`, borderRadius: 14, display: "flex", flexDirection: "column", justifyContent: "center", padding: 20, transform: "rotateX(180deg)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, ...eye, color: "#0a8f5b", marginBottom: 6 }}><CheckCircle2 size={14} /> REALITY</div>
          <div style={{ fontSize: F.sm, fontWeight: 500, color: "#066c43", lineHeight: 1.5 }}>{myth.reality}</div>
        </div>
      </motion.div>
    </div>
  );
}

function riskColorFn(risk) { return risk >= 60 ? CL.coral : risk >= 40 ? CL.amber : CL.green; }

/* ═══════════════════════════════════════════════════════════════
   TAB: ACADEMICS
   ═══════════════════════════════════════════════════════════════ */
function Academics({ b, extra }) {
  const meters = b.studyMeters || [];
  const split = b.outcomeSplit || [];
  const placement = b.placement;
  const core = b.academics.coreSubjects || [];
  const outcomes = b.academics.outcomes || [];
  const journey = b.journey || [];

  return (
    <motion.div variants={cV} initial="hidden" animate="show" style={{ display: "grid", gap: 20 }}>
      {/* Row 1: Summary + Intensity */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        <Card style={{ background: `linear-gradient(135deg, ${b.color}12 0%, #fff 100%)`, borderLeft: `4px solid ${b.color}` }}>
          <div style={{ ...eye, color: CL.muted, marginBottom: 10 }}>What you actually study</div>
          <p style={{ fontSize: F.lg, fontWeight: 700, color: CL.ink, lineHeight: 1.55, margin: 0 }}>{b.academics.summary}</p>
        </Card>
        <Card title="Study Intensity Distribution">
          {meters.length > 0 ? <IntensityBars meters={meters} /> : <p style={{ color: CL.muted, fontSize: F.sm }}>No intensity data.</p>}
        </Card>
      </div>

      {/* Row 2: Donut + Placement */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {split.length > 0 && <Card title="Where graduates land"><MiniDonut data={split} /></Card>}
        {placement && (
          <Card title="Tech placement access" style={{ background: CL.cream2 }}>
            <div style={{ background: b.color, color: "#fff", padding: "8px 14px", borderRadius: 8, display: "inline-block", fontWeight: 800, fontSize: F.base, marginBottom: 12 }}>{placement.headline}</div>
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
              {Array.from({ length: 8 }).map((_, i) => <div key={i} style={{ width: 22, height: 16, borderRadius: 3, background: i < 6 ? b.color : CL.cream3 }} />)}
            </div>
            <p style={{ fontSize: F.sm, color: CL.body, lineHeight: 1.55, margin: 0 }}>{placement.note}</p>
          </Card>
        )}
      </div>

      {/* Row 3: Journey */}
      {journey.length > 0 && (
        <Card title={`The ${journey.length}-Year Journey`}>
          <div style={{ fontSize: F.sm, color: CL.muted, marginTop: -10, marginBottom: 16 }}>Step-by-step evolution of a {b.name.split("&")[0].trim()} student</div>
          <JourneyCards years={journey} />
        </Card>
      )}

      {/* Row 4: Core Subjects + Roles + Tools */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        <Card title="Core subjects you'll master">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {core.map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: F.sm }}>
                <CheckCircle2 size={14} color={CL.green} style={{ flexShrink: 0 }} />
                <span style={{ color: CL.ink, fontWeight: 600 }}>{s}</span>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ display: "grid", gap: 20 }}>
          <Card title="Target roles">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {outcomes.map(o => <span key={o} style={{ fontSize: F.sm, fontWeight: 700, padding: "5px 11px", borderRadius: 8, background: CL.cream2, border: `1px solid ${CL.cream3}`, color: CL.ink2 }}>{o}</span>)}
            </div>
          </Card>
          <Card title="Tools & Technologies">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {extra.toolsAndTech.map((t, i) => (
                <motion.span key={t} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  style={{ fontSize: F.sm, fontWeight: 700, padding: "5px 11px", borderRadius: 8, background: CL.card, border: `1px solid ${CL.line}`, color: CL.ink, display: "flex", alignItems: "center", gap: 4 }}>
                  <Wrench size={11} color={b.color} /> {t}
                </motion.span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: INSIGHTS
   ═══════════════════════════════════════════════════════════════ */
function Insights({ b, extra }) {
  const ins = b.insights;
  const riskColor = riskColorFn(b.stats.aiRisk);
  const roles = b.careerRoles || [];
  const recruiters = b.recruiters || [];
  const arc = ins.salaryArc;
  const salaryData = [
    { year: "Entry", Median: arc.median.entry, "Top 10%": arc.top.entry },
    { year: "Year 3", Median: arc.median.y3, "Top 10%": arc.top.y3 },
    { year: "Year 5", Median: arc.median.y5, "Top 10%": arc.top.y5 },
  ];

  return (
    <motion.div variants={cV} initial="hidden" animate="show" style={{ display: "grid", gap: 20 }}>
      {/* Row 1: AI Risk + Skills + Opportunity */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
        <Card style={{ textAlign: "center" }}>
          <div style={{ ...eye, marginBottom: 12 }}>AI Disruption Index</div>
          <div style={{ fontSize: 44, fontWeight: 800, color: CL.ink, fontFamily: CL.display, lineHeight: 1 }}>{b.stats.aiRisk}<span style={{ fontSize: 20, color: CL.muted }}>/100</span></div>
          <div style={{ display: "flex", height: 6, borderRadius: 3, background: CL.cream3, margin: "16px 0 12px", overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${b.stats.aiRisk}%` }} transition={{ duration: 1 }} style={{ background: riskColor, borderRadius: 3 }} />
          </div>
          <span style={{ fontSize: F.xs, fontWeight: 800, color: riskColor }}>{b.aiRiskLabel}</span>
        </Card>

        <Card>
          <div style={{ ...eye, marginBottom: 12 }}>Skills Origin</div>
          <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", height: 56, border: `1px solid ${CL.line}` }}>
            <motion.div initial={{ flex: 0 }} animate={{ flex: ins.skills.coursework }} transition={{ duration: 0.7 }}
              style={{ background: CL.blue, padding: "6px 10px", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: F.xl, fontWeight: 800 }}>{ins.skills.coursework}%</div>
              <div style={{ fontSize: 9, fontWeight: 700, opacity: 0.8 }}>Curriculum</div>
            </motion.div>
            <motion.div initial={{ flex: 0 }} animate={{ flex: ins.skills.selfLearning }} transition={{ duration: 0.7 }}
              style={{ background: CL.coral, padding: "6px 10px", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", textAlign: "right" }}>
              <div style={{ fontSize: F.xl, fontWeight: 800 }}>{ins.skills.selfLearning}%</div>
              <div style={{ fontSize: 9, fontWeight: 700, opacity: 0.8 }}>Self-learn</div>
            </motion.div>
          </div>
        </Card>

        <Card>
          <div style={{ ...eye, marginBottom: 12 }}>Opportunity Reach</div>
          {[{ label: "Global", val: extra.globalVsDomestic.global, color: CL.blue, icon: Globe },
            { label: "Domestic", val: extra.globalVsDomestic.domestic, color: CL.green, icon: MapPin }].map(d => (
            <div key={d.label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: F.sm, fontWeight: 700, color: CL.ink, display: "flex", alignItems: "center", gap: 4 }}><d.icon size={12} color={d.color} /> {d.label}</span>
                <span style={{ fontSize: F.sm, fontWeight: 800, color: d.color }}>{d.val}%</span>
              </div>
              <div style={{ height: 5, background: CL.cream3, borderRadius: 3 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${d.val}%` }} transition={{ duration: 0.8 }} style={{ height: "100%", background: d.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Row 2: Salary */}
      <Card title="5-Year Salary Progression">
        <Trend data={salaryData} lines={[{ key: "Top 10%", label: "Top 10%", color: CL.coral }, { key: "Median", label: "Median", color: CL.blue }]} height={240} fmt={v => `₹${v}L`} />
      </Card>

      {/* Row 3: Industry + Role Salary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        <Card title="Industry Hiring Distribution">
          <div style={{ height: 190 }}>
            <ResponsiveContainer>
              <BarChart data={extra.industryDemand} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={CL.cream3} />
                <XAxis type="number" hide />
                <YAxis dataKey="industry" type="category" axisLine={false} tickLine={false} tick={{ fill: CL.ink2, fontSize: 11, fontWeight: 700 }} width={80} />
                <RechartsTooltip cursor={{ fill: CL.cream2 }} contentStyle={{ borderRadius: 8, border: `1px solid ${CL.line}`, fontSize: 11 }} />
                <Bar dataKey="demand" fill={CL.coral} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Role vs Salary (₹ LPA)">
          <div style={{ display: "grid", gap: 10 }}>
            {extra.roleSalaries.map((r, i) => (
              <div key={r.role}>
                <div style={{ fontSize: F.sm, fontWeight: 700, color: CL.ink2, marginBottom: 3 }}>{r.role}</div>
                <div style={{ position: "relative", height: 18, background: CL.cream2, borderRadius: 9, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((r.peak / 100) * 100, 100)}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    style={{ position: "absolute", left: `${(r.entry / 100) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${CL.blue}88, ${CL.coral})`, borderRadius: 9, maxWidth: `${((r.peak - r.entry) / 100) * 100}%` }} />
                  <span style={{ position: "absolute", left: 6, top: 2, fontSize: 9, fontWeight: 800, color: CL.ink }}>{r.entry}L</span>
                  <span style={{ position: "absolute", right: 6, top: 2, fontSize: 9, fontWeight: 800, color: CL.ink }}>{r.peak}L</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 4: Career Roles + Recruiters */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {roles.length > 0 && (
          <Card title="Career Roles">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {roles.map(r => <span key={r.role} style={{ fontSize: F.sm, fontWeight: 700, padding: "4px 10px", borderRadius: 7, background: r.direct ? CL.cream2 : CL.card, color: r.direct ? CL.ink : CL.muted, border: `1px solid ${r.direct ? CL.cream3 : CL.line}` }}>{r.role}</span>)}
            </div>
          </Card>
        )}
        {recruiters.length > 0 && (
          <Card title="Top Recruiters">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 8 }}>
              {recruiters.map(r => <div key={r} style={{ background: CL.cream2, border: `1px solid ${CL.cream3}`, borderRadius: 8, padding: "8px 6px", textAlign: "center", fontSize: F.sm, fontWeight: 800, color: CL.ink2 }}>{r}</div>)}
            </div>
          </Card>
        )}
      </div>

      {/* Row 5: Research */}
      {ins.research && (
        <Card title="Research Ecosystem">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 14, marginBottom: 14 }}>
            {ins.research.map(r => (
              <div key={r.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: F.xxl, fontWeight: 800, color: CL.ink }}>{r.value}<span style={{ fontSize: F.sm, color: CL.muted }}>/100</span></div>
                <div style={{ fontSize: F.xs, color: CL.muted, fontWeight: 700, marginTop: 2 }}>{r.label}</div>
              </div>
            ))}
          </div>
          {ins.researchNote && <p style={{ fontSize: F.sm, color: CL.body, lineHeight: 1.55, margin: 0, borderTop: `1px solid ${CL.line}`, paddingTop: 10 }}>{ins.researchNote}</p>}
        </Card>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: COLLEGES
   ═══════════════════════════════════════════════════════════════ */
function Colleges({ b, extra }) {
  return (
    <motion.div variants={cV} initial="hidden" animate="show" style={{ display: "grid", gap: 20 }}>
      <Card title="5-Year Cutoff Rank Trends">
        <div style={{ fontSize: F.xs, color: CL.muted, marginTop: -10, marginBottom: 12 }}>Lower rank = higher competition</div>
        <div style={{ height: 240 }}>
          <ResponsiveContainer>
            <LineChart data={extra.cutoffTrends} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CL.cream3} />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: CL.muted, fontWeight: 700, fontSize: 11 }} />
              <YAxis reversed axisLine={false} tickLine={false} tick={{ fill: CL.muted, fontWeight: 700, fontSize: 11 }} />
              <RechartsTooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: CL.shadow, fontSize: 11 }} />
              <Line type="monotone" dataKey="rank" stroke={CL.blue} strokeWidth={2.5} dot={{ r: 5, fill: CL.blue, stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        <Card title="ROI: Fees vs Placement (₹ LPA)">
          <div style={{ height: 210 }}>
            <ResponsiveContainer>
              <BarChart data={extra.roiMetrics} margin={{ top: 10, right: 20, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CL.cream3} />
                <XAxis dataKey="tier" axisLine={false} tickLine={false} tick={{ fill: CL.ink2, fontWeight: 700, fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: CL.muted, fontWeight: 700, fontSize: 11 }} />
                <RechartsTooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 700, color: CL.muted, paddingTop: 10 }} />
                <Bar dataKey="fees" name="Total Fees" fill={CL.amber} radius={[3, 3, 0, 0]} />
                <Bar dataKey="placement" name="Avg Placement" fill={CL.green} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recommended Colleges">
          <div style={{ display: "grid", gap: 8 }}>
            {b.colleges.map(c => {
              const tone = chanceTone(c.chance);
              return (
                <motion.div key={c.name} variants={iV} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: CL.cream2, border: `1px solid ${CL.line}`, borderRadius: 10, padding: "10px 14px", borderLeft: `3px solid ${tone.fg}` }}>
                  <div><div style={{ fontSize: F.base, fontWeight: 800, color: CL.ink }}>{c.name}</div><div style={{ fontSize: F.xs, color: CL.muted }}>{c.tag}</div></div>
                  <span style={{ fontSize: 9, fontWeight: 800, color: tone.fg, background: tone.bg, padding: "2px 7px", borderRadius: 5 }}>{tone.label}</span>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>

      {b.branchesList && (
        <Card title="Related Branch Names">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {b.branchesList.map(bl => <span key={bl} style={{ fontSize: F.sm, fontWeight: 700, padding: "4px 10px", borderRadius: 7, background: CL.cream2, border: `1px solid ${CL.cream3}`, color: CL.ink2 }}>{bl}</span>)}
          </div>
        </Card>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: MYTHS
   ═══════════════════════════════════════════════════════════════ */
function Myths({ b, extra }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <motion.div variants={cV} initial="hidden" animate="show" style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        <Card style={{ textAlign: "center" }}>
          <div style={{ ...eye, marginBottom: 8 }}>Student Satisfaction</div>
          <Gauge value={extra.satisfaction} label="Overall Score" color={CL.green} height={170} />
          <p style={{ fontSize: F.xs, color: CL.muted, marginTop: -14 }}>Alumni career outcomes & stress surveys</p>
        </Card>
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ ...eye }}>Hidden Challenges</div>
          {extra.hiddenChallenges.map((m, i) => <motion.div variants={iV} key={i}><FlipCard myth={m} /></motion.div>)}
        </div>
      </div>

      <Card title="Common Myths vs Reality">
        <div style={{ display: "grid", gap: 10 }}>
          {b.myths.map((m, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} style={{ background: CL.cream2, border: `1px solid ${isOpen ? CL.coral : CL.cream3}`, borderRadius: 12, overflow: "hidden", transition: "border-color .2s" }}>
                <button onClick={() => setOpenIdx(isOpen ? -1 : i)} style={{ width: "100%", textAlign: "left", padding: "12px 16px", background: "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <XCircle size={15} color={CL.coralDk} />
                    <span style={{ fontWeight: 800, color: CL.ink, fontSize: F.base }}>{m.myth}</span>
                  </div>
                  <ChevronDown size={15} color={CL.muted} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <div style={{ padding: "0 16px 14px" }}>
                        <div style={{ background: CL.greenSoft, padding: "10px 14px", borderRadius: 8, borderLeft: `3px solid #0a8f5b`, display: "flex", gap: 8 }}>
                          <CheckCircle2 size={15} color="#0a8f5b" style={{ flexShrink: 0, marginTop: 2 }} />
                          <div style={{ color: "#066c43", fontSize: F.sm, lineHeight: 1.5, fontWeight: 500 }}>{m.reality}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
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
  const idx = BRANCHES.findIndex(x => x.slug === slug);
  const next = BRANCHES[(idx + 1) % BRANCHES.length];
  const seoDesc = `${b.name}: ${(b.desc || "").slice(0, 150)} Explore scope, salaries, AI-disruption risk, top recruiters, placements and the best colleges.`;

  return (
    <div style={{ background: "#FAFAFA", minHeight: "100vh", paddingTop: 92, paddingBottom: 72 }}>
      <Seo title={`${b.name} — Scope, Salary, Colleges & AI Risk`} description={seoDesc} path={`/branches/${slug}`}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Branches", path: "/branches" }, { name: b.name, path: `/branches/${slug}` }]} />
      <div className="container" style={{ maxWidth: 1040 }}>
        <Link to="/branches" className="cp-back-btn" style={{ marginBottom: 20, fontSize: F.sm }}><ArrowLeft size={14} /> Back to Catalog</Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ background: CL.card, borderRadius: 20, border: `1px solid ${CL.line}`, boxShadow: CL.shadowLg, padding: "28px", marginBottom: 28 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24 }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: `${b.color}14`, border: `1px solid ${b.color}28`, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon size={30} color={b.color} />
            </div>
            <div style={{ flex: "1 1 280px" }}>
              <h1 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.8rem", color: CL.ink, letterSpacing: "-0.5px", marginBottom: 8, lineHeight: 1.15 }}>{b.name}</h1>
              <p style={{ color: CL.body, fontSize: F.base, lineHeight: 1.5, marginBottom: 12, maxWidth: 460 }}>{b.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {b.tags.map(t => <span key={t} style={{ fontSize: F.xs, fontWeight: 700, color: CL.ink2, background: CL.cream2, border: `1px solid ${CL.cream3}`, padding: "3px 10px", borderRadius: 6 }}>{t}</span>)}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, background: CL.cream2, padding: "16px 18px", borderRadius: 14, minWidth: 180 }}>
              <div style={{ ...eye }}>Quick Stats</div>
              {[
                { icon: IndianRupee, color: CL.coral, val: b.stats.medianSalary, lbl: "Median Salary" },
                { icon: Briefcase, color: CL.blue, val: b.stats.jobGrowth, lbl: "Market Demand" },
                { icon: Zap, color: riskColorFn(b.stats.aiRisk), val: `${b.stats.aiRisk}/100`, lbl: "AI Risk" },
              ].map(s => (
                <div key={s.lbl} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <s.icon size={14} color={s.color} />
                  <div><div style={{ fontSize: F.base, fontWeight: 800, color: CL.ink }}>{s.val}</div><div style={{ fontSize: 9, color: CL.muted }}>{s.lbl}</div></div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", WebkitOverflowScrolling: "touch", marginBottom: 24, scrollbarWidth: "none", paddingBottom: 4 }}>
          {TABS.map(t => {
            const on = tab === t.key;
            const TI = t.icon;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 16px", fontSize: F.sm, fontWeight: 800, fontFamily: CL.display,
                color: on ? "#fff" : CL.ink2, cursor: "pointer",
                background: on ? CL.coral : CL.card,
                border: `1px solid ${on ? CL.coral : CL.line}`,
                borderRadius: 10, whiteSpace: "nowrap", flexShrink: 0,
                boxShadow: on ? `0 6px 18px ${CL.coral}44` : "none",
                transition: "all .2s"
              }}><TI size={14} /> {t.label}</button>
            );
          })}
        </div>

        {/* Content */}
        <PanelBoundary tabKey={tab}>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 14 }} transition={{ duration: 0.2 }}>
              {tab === "academics" && <Academics b={b} extra={extra} />}
              {tab === "insights" && <Insights b={b} extra={extra} />}
              {tab === "colleges" && <Colleges b={b} extra={extra} />}
              {tab === "myths" && <Myths b={b} extra={extra} />}
            </motion.div>
          </AnimatePresence>
        </PanelBoundary>

        {/* Next Branch */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <button onClick={() => { nav(`/branches/${next.slug}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 40, padding: "10px 24px", fontFamily: CL.display, fontWeight: 800, fontSize: F.base, color: CL.ink, cursor: "pointer", boxShadow: CL.shadow, transition: "transform .2s" }}>
            Next: {next.name} <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
