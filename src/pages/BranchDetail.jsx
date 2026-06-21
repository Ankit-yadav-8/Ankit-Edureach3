/* BranchDetail — full deep-dive page for one branch family.
   Campusloom layout: a header card with at-a-glance stats, then four tabs:
   Academics & Outcomes (study meters · outcome donut · 4-year journey) ·
   Advanced Insights (AI gauge · skills origin · research · salary arc · career
   roles · top recruiters) · Colleges & Branches · Common Myths.
   Reached via /branches/:slug. */
import { useState, useEffect, Component } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, TrendingUp, Building2, AlertCircle, ArrowLeft, ArrowDown,
  Briefcase, IndianRupee, ShieldCheck, CheckCircle2, XCircle, ChevronDown,
} from "lucide-react";
import { getBranch, BRANCHES } from "../data/branches.js";
import { BRANCH_ICONS } from "../components/home/branchIcons.js";
import { CL } from "../components/home/clTheme.js";
import { Trend } from "../components/Charts.jsx";
import { chanceTone } from "../components/home/clTheme.js";

const TABS = [
  { key: "academics", label: "Inside the Degree",    icon: GraduationCap },
  { key: "insights",  label: "Career & Pay Reality", icon: TrendingUp },
  { key: "colleges",  label: "Where to Study",       icon: Building2 },
  { key: "myths",     label: "Myth Busters",         icon: AlertCircle },
];

/* study-intensity level → fill fraction + colour */
const LEVELS = { HEAVY: 0.92, MODERATE: 0.6, LIGHT: 0.35, MINIMAL: 0.16 };
const METER_COLORS = { Coding: CL.violet, Theory: CL.coral, Math: CL.blue, "Lab Work": CL.green };
const SPLIT_COLORS = [CL.coral, CL.green, CL.blue, CL.violet];

/* Keeps a single tab's render error from blanking the whole page — the tab
   still "opens" with a graceful fallback instead of an unmounted SPA. */
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

/* ── small UI atoms ── */
function Panel({ children, title, right, style }) {
  return (
    <div style={{ background: CL.cream2, border: `1px solid ${CL.cream3}`, borderRadius: 16, padding: "20px 22px", ...style }}>
      {(title || right) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 16 }}>
          {title && <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "1.2px", color: CL.muted, textTransform: "uppercase" }}>{title}</div>}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

const chipStyle = { fontSize: 13, fontWeight: 700, color: CL.ink2, background: CL.card, border: `1px solid ${CL.line}`, padding: "8px 14px", borderRadius: 10 };

function GaugeArc({ value, color, riskLabel }) {
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

/* horizontal study-intensity meter (Coding / Theory / Math / Lab Work) */
function StudyMeter({ label, level }) {
  const frac = LEVELS[level] ?? 0.5;
  const color = METER_COLORS[label] || CL.coral;
  const filled = Math.round(frac * 12);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <span style={{ fontWeight: 800, fontSize: 13.5, color: CL.ink }}>{label}</span>
        <span style={{ fontWeight: 800, fontSize: 10.5, letterSpacing: ".08em", color }}>{level}</span>
      </div>
      <div style={{ display: "flex", gap: 3 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} style={{ flex: 1, height: 8, borderRadius: 2, background: i < filled ? color : CL.cream3 }} />
        ))}
      </div>
    </div>
  );
}

/* where-graduates-land donut + legend */
function Donut({ data }) {
  const total = data.reduce((s, d) => s + d.pct, 0) || 100;
  const R = 52, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
      <div style={{ position: "relative", width: 138, height: 138, flexShrink: 0 }}>
        <svg width="138" height="138" viewBox="0 0 138 138">
          <circle cx="69" cy="69" r={R} fill="none" stroke={CL.cream3} strokeWidth="15" />
          {data.map((d, i) => {
            const len = (d.pct / total) * C;
            const seg = (
              <circle key={i} cx="69" cy="69" r={R} fill="none"
                stroke={SPLIT_COLORS[i % SPLIT_COLORS.length]} strokeWidth="15"
                strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-acc}
                transform="rotate(-90 69 69)" />
            );
            acc += len;
            return seg;
          })}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <span style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 24, color: CL.ink }}>{data[0]?.pct}%</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1, minWidth: 130 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}>
            <span style={{ width: 11, height: 11, borderRadius: 3, background: SPLIT_COLORS[i % SPLIT_COLORS.length], flexShrink: 0 }} />
            <span style={{ fontWeight: 800, color: CL.ink, minWidth: 34 }}>{d.pct}%</span>
            <span style={{ color: CL.body }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* fallback journey if a branch has no authored journey data */
function fallbackJourney(b) {
  const core = b.academics.coreSubjects || [];
  return [
    { title: "Common courses, settling in", tag: "FOUNDATION", subjects: ["Mathematics I & II", "Physics & Chemistry", "Intro to Programming", "Engineering Graphics"] },
    { title: "Core branch subjects begin", tag: "CORE LOAD", subjects: [...core.slice(0, 3)] },
    { title: "Specialisation + internships", tag: "PEAK PRESSURE", subjects: core.slice(2, 5).length ? core.slice(2, 5) : core.slice(0, 3) },
    { title: "Electives, projects, thesis", tag: "EXIT YEAR", subjects: [...core.slice(4), "Major Project / Thesis"].filter(Boolean) },
  ];
}

function Journey({ b }) {
  const years = (b.journey && b.journey.length === 4) ? b.journey : fallbackJourney(b);
  const [active, setActive] = useState(2);
  const cur = years[active] || years[0];
  return (
    <Panel title="The 4-year journey · Curriculum"
      right={<span style={{ fontSize: 11.5, color: CL.muted }}>Tap a year to see representative coursework</span>}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
        {years.map((y, i) => {
          const on = i === active;
          return (
            <button key={i} onClick={() => setActive(i)} style={{
              textAlign: "left", cursor: "pointer",
              background: on ? CL.coralSoft + "88" : CL.card,
              border: `1px solid ${on ? CL.coral + "66" : CL.line}`,
              borderRadius: 14, padding: "13px 15px",
            }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 9 }}>
                {Array.from({ length: 8 }).map((_, k) => (
                  <span key={k} style={{ flex: 1, height: 4, borderRadius: 2, background: k < (i + 1) * 2 ? CL.coral : CL.cream3 }} />
                ))}
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".08em", color: CL.muted, textTransform: "uppercase" }}>Year {i + 1}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: on ? CL.coralDk : CL.ink2, marginTop: 3, lineHeight: 1.35 }}>{y.title}</div>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "1px", color: CL.coralDk, textTransform: "uppercase", marginBottom: 12 }}>
          Year {active + 1} · {cur.tag || "Representative coursework"}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
          {cur.subjects.map((s) => <span key={s} style={chipStyle}>{s}</span>)}
        </div>
      </div>
    </Panel>
  );
}

/* ── tab panels ── */
function Academics({ b }) {
  const meters = b.studyMeters || [];
  const split = b.outcomeSplit || [];
  const placement = b.placement;
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel title="What you actually study">
        <p style={{ color: CL.ink2, fontSize: 14.5, lineHeight: 1.75, margin: 0 }}>{b.academics.summary}</p>
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}>
        {meters.length > 0 && (
          <Panel title="What you'll study">
            {meters.map((m) => <StudyMeter key={m.label} label={m.label} level={m.level} />)}
          </Panel>
        )}
        {split.length > 0 && (
          <Panel title="Where graduates land">
            <Donut data={split} />
          </Panel>
        )}
        {placement && (
          <Panel title="Tech placement access">
            <span style={{ display: "inline-block", fontSize: 13, fontWeight: 800, color: "#0a8f5b", background: CL.greenSoft, borderRadius: 9, padding: "8px 14px", marginBottom: 14 }}>{placement.headline}</span>
            <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
              {Array.from({ length: 18 }).map((_, i) => (
                <span key={i} style={{ flex: 1, height: 7, borderRadius: 2, background: i < 14 ? CL.green : CL.cream3 }} />
              ))}
            </div>
            <p style={{ fontSize: 13, color: CL.body, lineHeight: 1.6, margin: 0 }}>{placement.note}</p>
          </Panel>
        )}
      </div>

      <Journey b={b} />

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
            {b.academics.outcomes.map((o) => <span key={o} style={chipStyle}>{o}</span>)}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Insights({ b }) {
  const ins = b.insights;
  const riskColor = b.stats.aiRisk >= 60 ? CL.coral : b.stats.aiRisk >= 40 ? CL.amber : CL.green;
  const [showRisk, setShowRisk] = useState(false);
  const [showResearch, setShowResearch] = useState(false);
  const roles = b.careerRoles || [];
  const recruiters = b.recruiters || [];
  const arc = ins.salaryArc;
  const salaryData = [
    { year: "Entry", Median: arc.median.entry, "Top 10%": arc.top.entry },
    { year: "Year 3", Median: arc.median.y3, "Top 10%": arc.top.y3 },
    { year: "Year 5", Median: arc.median.y5, "Top 10%": arc.top.y5 },
  ];
  const researchLong = "Funding and hiring momentum here are shaped by national missions and private R&D — strong performers find both academic and industry routes open.";

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
        <Panel title="AI Replaceability">
          <GaugeArc value={b.stats.aiRisk} color={riskColor} riskLabel={b.aiRiskLabel} />
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button onClick={() => setShowRisk((v) => !v)} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 800, color: CL.coralDk, background: CL.coralSoft, border: "none", borderRadius: 50, padding: "7px 14px", cursor: "pointer", fontFamily: CL.display }}>
              {showRisk ? "Show less" : "Know more"} <ChevronDown size={14} style={{ transform: showRisk ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
            </button>
          </div>
          <AnimatePresence>
            {showRisk && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden", marginTop: 12, fontSize: 12.5, color: CL.body, lineHeight: 1.6, textAlign: "center" }}>
                How exposed this path's core work is to automation over the next decade. Judgement, design and physical/regulated work stay human-led; repetitive analysis is most exposed.
              </motion.p>
            )}
          </AnimatePresence>
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
          <p style={{ marginTop: 16, fontSize: 12.8, color: CL.body, lineHeight: 1.6 }}>
            {ins.researchNote}{showResearch ? " " + researchLong : ""}
          </p>
          <button onClick={() => setShowResearch((v) => !v)} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 800, color: CL.coralDk, background: "transparent", border: "none", padding: 0, cursor: "pointer", fontFamily: CL.display }}>
            {showResearch ? "Show less" : "Show more"} <ChevronDown size={13} style={{ transform: showResearch ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
          </button>
        </Panel>
      </div>

      {/* salary arc + table */}
      <Panel title="5-year salary arc · India median (₹ LPA)">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20, alignItems: "center" }}>
          <Trend
            data={salaryData}
            lines={[
              { key: "Top 10%", label: "Top performer", color: CL.coral },
              { key: "Median", label: "Median performer", color: CL.muted },
            ]}
            height={230}
            fmt={(v) => `₹${v}L`}
          />
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr", gap: 0, fontSize: 12.5 }}>
              {["Career stage", "Entry", "Year 3", "Year 5"].map((h, i) => (
                <div key={h} style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".05em", color: CL.muted, textTransform: "uppercase", padding: "8px 6px", textAlign: i === 0 ? "left" : "right" }}>{h}</div>
              ))}
              <RowCells label="Median" color={CL.muted} cells={[arc.median.entry, arc.median.y3, arc.median.y5]} />
              <RowCells label="Top 10%" color={CL.coralDk} cells={[arc.top.entry, arc.top.y3, arc.top.y5]} highlight />
            </div>
          </div>
        </div>
      </Panel>

      {/* career paths */}
      {(roles.length > 0 || recruiters.length > 0) && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}>
          {roles.length > 0 && (
            <Panel title="Typical career roles" style={{ gridColumn: recruiters.length ? "auto" : "1 / -1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14, fontSize: 11.5, color: CL.muted }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: CL.coral }} /> Direct entry-level</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: CL.card, border: `1px solid ${CL.line}` }} /> Needs more prep / higher studies</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {roles.map((r) => (
                  <span key={r.role} style={{
                    fontSize: 12.5, fontWeight: 700, padding: "7px 13px", borderRadius: 9,
                    background: r.direct ? CL.coralSoft : CL.card,
                    color: r.direct ? CL.coralDk : CL.ink2,
                    border: `1px solid ${r.direct ? CL.coral + "55" : CL.line}`,
                  }}>{r.role}</span>
                ))}
              </div>
              <p style={{ marginTop: 14, fontSize: 11.5, color: CL.muted, lineHeight: 1.5 }}>
                Highlighted chips are common direct entry-level roles. Others usually need extra preparation, specialisation or higher studies.
              </p>
            </Panel>
          )}
          {recruiters.length > 0 && (
            <Panel title="Top recruiters">
              {recruiters.map((r, i) => (
                <div key={r} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < recruiters.length - 1 ? `1px solid ${CL.line}` : "none" }}>
                  <span style={{ fontFamily: CL.display, fontWeight: 800, color: CL.muted, fontSize: 12, width: 20 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontWeight: 800, color: CL.ink, fontSize: 14 }}>{r}</span>
                </div>
              ))}
            </Panel>
          )}
        </div>
      )}
    </div>
  );
}

function RowCells({ label, cells, color, highlight }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 6px", borderTop: `1px solid ${CL.line}` }}>
        <span style={{ width: 9, height: 9, borderRadius: 2, background: color }} />
        <span style={{ fontWeight: 700, color: CL.ink2 }}>{label}</span>
      </div>
      {cells.map((c, i) => (
        <div key={i} style={{ padding: "10px 6px", borderTop: `1px solid ${CL.line}`, textAlign: "right", fontFamily: CL.display, fontWeight: 800, color: highlight ? CL.coralDk : CL.ink }}>₹{c} LPA</div>
      ))}
    </>
  );
}

function Colleges({ b }) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel title="Branches in this path">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
          {b.branchesList.map((br) => (
            <span key={br} style={{ ...chipStyle, padding: "9px 15px" }}>{br}</span>
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
              <button onClick={() => setTab("insights")} title="Jump to insights" style={{ width: 46, height: 46, borderRadius: "50%", background: CL.coral, display: "grid", placeItems: "center", boxShadow: "0 8px 20px rgba(255, 105, 61,.35)" }}>
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

        {/* panels — keyed remount on tab change for an instant, reliable swap
           (no AnimatePresence "wait" that could leave a tab unresponsive). */}
        <PanelBoundary tabKey={tab}>
          <motion.div key={tab}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}>
            {tab === "academics" && <Academics b={b} />}
            {tab === "insights" && <Insights b={b} />}
            {tab === "colleges" && <Colleges b={b} />}
            {tab === "myths" && <Myths b={b} />}
          </motion.div>
        </PanelBoundary>

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
