import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Search, Target, Menu, X,
  BadgeCheck, CalendarDays, FileText, BarChart3, Landmark, Crosshair, Gauge, Heart, GitCompare, Award, ShieldCheck,
  BookOpen, FlaskConical, Sigma, Zap, CalendarClock, Trophy, LogOut, Sparkles,
  HelpCircle, Newspaper, Flame, Medal, Megaphone, Globe2, Edit3, Activity, Clock, ClipboardCheck
} from "lucide-react";
import { useShortlist } from "../context/Shortlist.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

const GATE_TABS = false;

// ── JEE mega-menu: Prep + JEE Main + JEE Advanced merged into one panel ───────
// Previously these were three separate top-level tabs (JEE, JEE Main, JEE
// Advanced) which made the navbar feel crowded. Grouping them under one "JEE"
// heading with three colour-coded columns keeps everything one hover away.
const JEE_MEGA = [
  {
    title: "Resources", to: "/resources", color: "#6366f1", icon: BookOpen,
    items: [
      { label: "Class 11", to: "/class-11", icon: BookOpen, desc: "Complete syllabus & notes", iconBg: "#FFF3E0", iconColor: "#8B5E34" },
      { label: "Class 12", to: "/class-12", icon: Edit3, desc: "Boards + competitive prep", iconBg: "#E0F2F1", iconColor: "#00695C" },
      { label: "Exam Strategies for JEE", to: "/jee-strategy", icon: Zap, desc: "Tips, tricks & toppers' advice", iconBg: "#F3F0F5", iconColor: "#7E57C2" },
      { label: "Exam Strategies for NEET", to: "/neet-strategy", icon: FlaskConical, desc: "Time management hacks", iconBg: "#FCE4EC", iconColor: "#AD1457" },
    ],
  },
  {
    title: "JEE Main", to: "/jee-main", color: "#FF693D", icon: FileText,
    items: [
      { label: "Eligibility Criteria",     to: "/jee-main#eligibility",   icon: BadgeCheck },
      { label: "Exam Pattern & Schedule",  to: "/exams/jee-main",         icon: CalendarDays },
      { label: "Shift-wise Papers & Keys", to: "/jee-main#papers",        icon: FileText },
      { label: "Result & Rank Analysis",   to: "/jee-main#analysis",      icon: BarChart3 },
      { label: "NIT Rankings (NIRF)",      to: "/jee-main#nit-rankings",  icon: Landmark },
      { label: "College Predictor",        to: "/jee-main#college",       icon: Crosshair },
      { label: "Rank Predictor",           to: "/jee-main#rank",          icon: Gauge },
    ],
  },
  {
    title: "JEE Advanced", to: "/jee-advanced", color: "#e5484d", icon: Trophy,
    items: [
      { label: "🔥 Result & Rank List 2026", to: "/jee-advanced-result-2026",   icon: Trophy },
      { label: "Eligibility Criteria",       to: "/jee-advanced#eligibility",   icon: BadgeCheck },
      { label: "Exam Pattern & Schedule",    to: "/exams/jee-advanced",         icon: CalendarDays },
      { label: "Paper 1 & 2 Analysis",       to: "/jee-advanced#analysis",      icon: BarChart3 },
      { label: "IIT Rankings (NIRF)",        to: "/jee-advanced#iit-rankings",  icon: Landmark },
      { label: "College Predictor",          to: "/jee-advanced#college",       icon: Crosshair },
      { label: "Rank Predictor",             to: "/jee-advanced#rank",          icon: Gauge },
    ],
  },
];

// ── NEET mega-menu: mirrors the JEE tab's style with dummy NEET data ──────────
const NEET_MEGA = [
  {
    title: "NEET Prep Resources", to: "/neet", color: "#0ea5a4", icon: BookOpen,
    items: [
      { label: "Biology (38 chapters)",   to: "/neet#biology",   icon: BookOpen,      desc: "Botany + Zoology · 360 marks" },
      { label: "Physics (29 chapters)",    to: "/neet#physics",   icon: Zap,           desc: "Mechanics to modern physics" },
      { label: "Chemistry (30 chapters)",  to: "/neet#chemistry", icon: FlaskConical,  desc: "Physical · Organic · Inorganic" },
      { label: "NEET Exam Cycle 2026",     to: "/neet#cycle",     icon: CalendarClock, desc: "Every key date for the year" },
    ],
  },
  {
    title: "NEET UG 2026", to: "/neet", color: "#FF693D", icon: FileText,
    items: [
      { label: "Eligibility Criteria",    to: "/neet#eligibility", icon: BadgeCheck,   desc: "Age, qualification & attempts" },
      { label: "Exam Pattern & Syllabus", to: "/neet#pattern",     icon: CalendarDays, desc: "180 questions · 720 marks" },
      { label: "Result & Rank List 2026", to: "/neet#result",      icon: BarChart3,    desc: "Toppers, cutoffs & percentile" },
      { label: "NEET Rank Predictor",     to: "/neet#predictor",   icon: Gauge,        desc: "Marks → expected AIR" },
    ],
  },
  {
    title: "NEET Counselling", to: "/neet", color: "#6366f1", icon: Award,
    items: [
      { label: "MCC / AIQ Counselling",   to: "/neet#counselling", icon: Award,    desc: "15% All-India quota seats" },
      { label: "State Quota Counselling", to: "/neet#counselling", icon: Landmark, desc: "85% state domicile seats" },
      { label: "Top Medical Colleges",    to: "/neet#colleges",    icon: Landmark, desc: "AIIMS, JIPMER & govt MBBS" },
      { label: "MBBS Cutoff Trends",      to: "/neet#cutoffs",     icon: BarChart3, desc: "Category-wise closing ranks" },
    ],
  },
];

// ── Mentorship dropdown: 1-on-1 JEE & NEET mentorship pages ───────────────────
const MENTORSHIP_NAV = [
  { label: "JEE & NEET 2027",   to: "/mentorship/jee-2027",   icon: Trophy,   tag: "₹1 · Class 12 / Droppers" },
  { label: "JEE & NEET 2028",   to: "/mentorship/jee-2028",   icon: Award,    tag: "₹1 · 2-Year Plan" },
  { label: "Foundation (9–10)", to: "/mentorship/foundation", icon: BookOpen, tag: "₹1 · Class 9 & 10" },
];

const COLLEGES = [
  { label: "Explore IITs", to: "/colleges?type=IIT", icon: Landmark },
  { label: "Explore NITs", to: "/colleges?type=NIT", icon: Landmark },
  { label: "Explore IIITs", to: "/colleges?type=IIIT", icon: Landmark },
  { label: "Private Universities", to: "/private-universities", icon: BadgeCheck },
  { label: "State-wise Colleges", to: "/colleges", icon: BadgeCheck },
];

// ── Tools mega-menu: every utility grouped under a common, colour-coded name ──
// Each item carries a one-line `desc` so first-time visitors instantly know what
// the tool does — they shouldn't have to click to find out.
const TOOLS_MEGA = [
  {
    title: "Plan & Apply", to: "/planner", color: "#FF693D", icon: CalendarDays,
    items: [
      { label: "Branch Insights Hub",     to: "/branches",   icon: Landmark,     desc: "Deep dive into 15+ clear engineering domains, exploring future career prospects, salaries, and real-world applications." },
      { label: "Trade-off Analyzer",      to: "/branch-vs-college", icon: GitCompare, desc: "Stuck between a top-tier college or your preferred branch? Take our quick assessment to find your ideal path forward." },
      { label: "Counselling Planner",     to: "/planner",    icon: CalendarDays, desc: "Track every JoSAA & CSAB round date" },
      { label: "JoSAA 2026 Counselling",  to: "/josaa-2026", icon: Award,        desc: "Expert ₹299 choice-filling plan" },
      { label: "Colleges For You",        to: "/for-you",    icon: Sparkles,     desc: "Personalised picks for your rank" },
    ],
  },
  {
    title: "Compare & Explore", to: "/compare", color: "#6366f1", icon: GitCompare,
    items: [
      { label: "Compare Colleges", to: "/compare",       icon: GitCompare, desc: "Place colleges side by side" },
      { label: "Compare Exams",    to: "/compare-exams", icon: BarChart3,  desc: "JEE vs other entrance exams" },
      { label: "College Map",      to: "/map",           icon: Landmark,   desc: "Find institutes across India" },
    ],
  },
  {
    title: "Cutoffs & More", to: "/cutoffs", color: "#2ec4b6", icon: FileText,
    items: [
      { label: "Official Cutoffs",      to: "/cutoffs",      icon: FileText,    desc: "Real opening & closing ranks" },
      { label: "Scholarships & Loans",  to: "/scholarships", icon: BadgeCheck,  desc: "Funding options for your seat" },
      { label: "Admin Data",            to: "/admin",        icon: ShieldCheck, desc: "Manage portal data" },
    ],
  },
  {
    title: "Community", to: "/campus-notes", color: "#e5484d", icon: Heart,
    items: [
      { label: "Campus Notes",       to: "/campus-notes", icon: BookOpen,   desc: "Upload & share study notes", iconBg: "#FFF3E0", iconColor: "#8B5E34" },
      { label: "Public Community",   to: "/community",    icon: Globe2,     desc: "Peer discussions & Q&A", iconBg: "#E0F2F1", iconColor: "#00695C" },
      { label: "Events & Fests",     to: "/campus-fests", icon: Sparkles,   desc: "Discover cultural & tech fests", iconBg: "#FCE4EC", iconColor: "#C2185B" },
    ],
  },
];

// ── "Exam Buzz" mega-menu: the old Exams tab merged with News into one ────────
// Previously exam pages and the news section lived in two different places. They
// are now one uniquely-named tab — "Exam Buzz" — with a Latest News column
// (results & counselling updates) beside an Entrance Exams column.
const EXAM_NEWS_MEGA = [
  {
    title: "Latest News & Results", to: "/exam-buzz", color: "#15a06e", icon: Newspaper,
    items: [
      { label: "🔥 JoSAA 2026 Round 1 Result", to: "/josaa-round-1-result-2026", icon: Trophy,    desc: "Seat allotment is out — Freeze/Float/Slide" },
      { label: "JEE Advanced 2026 Result",      to: "/jee-advanced-result-2026",  icon: Medal,     desc: "Toppers, cutoffs & rank list" },
      { label: "Application & Counselling Radar", to: "/exam-buzz",               icon: CalendarDays, desc: "Every live deadline in one timeline" },
      { label: "All News & Admission Updates",  to: "/exam-buzz",                 icon: Megaphone,  desc: "Results, admit cards & notices" },
    ],
  },
  {
    title: "Entrance Exams", to: "/exams", color: "#FF693D", icon: FileText,
    items: [
      { label: "All Entrance Exams", to: "/exams",            icon: FileText,  desc: "Eligibility, pattern & dates" },
      { label: "JEE Main",           to: "/exams/jee-main",   icon: Zap,       desc: "NTA · twice a year" },
      { label: "JEE Advanced",       to: "/exams/jee-advanced", icon: Flame,   desc: "Gateway to the IITs" },
      { label: "Compare Exams",      to: "/compare-exams",    icon: BarChart3, desc: "JEE vs other entrances" },
    ],
  },
];

export default function Navbar({ onSearch }) {
  const { saved, compare } = useShortlist();
  const { isLoggedIn, user, openLogin, openSignup, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 250);
    }
    setMobileOpen(false);
  }, [location]);

  const goHash = (to) => {
    if (GATE_TABS && !isLoggedIn) { openLogin(); return; }
    setOpen(null);
    setMobileOpen(false);
    const [path, hash] = to.split("#");
    if (path === "" || path === location.pathname) {
      if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(to);
    }
  };

  // `match` decides when a nav item should render in its "active" (current-page)
  // state — gives every one of the six parts a consistent highlight so users
  // always know where they are.
  const navItems = [
    { label: "JEE", icon: BookOpen, mega: JEE_MEGA, base: "/jee-resources", match: (p) => p.startsWith("/jee") },
    { label: "NEET", icon: FlaskConical, mega: NEET_MEGA, base: "/neet", match: (p) => p.startsWith("/neet") },
    { label: "Colleges", icon: Landmark, drop: COLLEGES, base: "/colleges", match: (p) => p.startsWith("/colleges") || p.startsWith("/college/") },
    { label: "Mentorship", icon: Heart, drop: MENTORSHIP_NAV, base: "/mentorship/jee-2027", match: (p) => p.startsWith("/mentorship") },
    { label: "Tools", icon: Crosshair, mega: TOOLS_MEGA, base: "/planner", align: "right", match: (p) => ["/planner", "/compare", "/cutoffs", "/scholarships", "/map", "/admin", "/josaa", "/campus-notes", "/community"].some((x) => p.startsWith(x)) },
    { label: "Blog", icon: FileText, to: "/blog", match: (p) => p.startsWith("/blog") },
  ];

  const isActive = (item) => (item.match ? item.match(location.pathname) : false);

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 34, left: 0, right: 0, zIndex: 1000,
          height: 64, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
          padding: "0 max(24px, calc((100vw - 1280px) / 2))",
          width: "100%",
          background: "#ffffff",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.03)" : "none",
          transition: "box-shadow .3s ease",
        }}
      >
        {/* ── LOGO ── */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0 })}
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", justifySelf: "start" }}
        >
          {/* CP circle logo */}
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "#FF693D",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "#fff",
                fontFamily: "Sora, sans-serif",
                fontWeight: 800,
                fontSize: "15px",
                letterSpacing: "-0.5px",
                lineHeight: 1,
              }}
            >
              CP
            </span>
          </span>

          {/* Brand text — clamps down on narrow phones so the bar never overflows */}
          <span id="cp-wordmark" style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1rem, 4.4vw, 1.3rem)", letterSpacing: "-0.01em", whiteSpace: "nowrap", color: "#1a1a2e" }}>
            College <span style={{ color: "#1a1a2e" }}>Parichay</span>
          </span>
        </Link>

        {/* Desktop nav — the middle cell of the navbar's 3-column grid
            (1fr · auto · 1fr). The equal 1fr side columns hold the logo (left)
            and action cluster (right), so the JEE / Colleges / Tools links sit
            truly centred in the bar. The grid expands the side columns before
            overlapping, so the links never collide on MacBook / laptop widths. */}
        <ul
          className="desktop-nav"
          style={{
            display: "flex", alignItems: "center", gap: 4,
            justifySelf: "center", justifyContent: "center", minWidth: 0,
            margin: 0, padding: 0, listStyle: "none",
          }}
        >
          {navItems.map((item) => (
            <li
              key={item.label}
              style={{ position: item.mega && item.label === "Tools" ? "static" : "relative" }}
              onMouseEnter={() => (item.drop || item.mega) && setOpen(item.label)}
              onMouseLeave={() => setOpen(null)}
            >
              {item.mega ? (
                <>
                  <button
                    onClick={(e) => { e.preventDefault(); if (GATE_TABS && !isLoggedIn) openLogin(); }}
                    className={item.highlight ? "nav-highlight-btn" : "nav-link-btn"}
                    style={item.highlight ? navHighlightStyle(open === item.label || isActive(item)) : navLinkStyle(open === item.label || isActive(item))}
                  >
                    {item.highlight && <BookOpen size={13} />}
                    {item.label}
                  </button>
                  <AnimatePresence>
                    {open === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, ...(item.label === "Tools" ? { x: "-50%" } : {}) }}
                        animate={{ opacity: 1, y: 0, ...(item.label === "Tools" ? { x: "-50%" } : {}) }}
                        exit={{ opacity: 0, y: -8, ...(item.label === "Tools" ? { x: "-50%" } : {}) }}
                        transition={{ duration: 0.18 }}
                        style={{
                          position: "absolute", top: "calc(100% + 8px)",
                          left: item.label === "Tools" ? "50%" : 0,
                          background: "#fff", borderRadius: 18,
                          boxShadow: "0 24px 60px -18px rgba(13,27,62,.32)",
                          padding: 12, border: "1px solid var(--border)",
                          display: "flex", gap: 6,
                          maxWidth: "96vw", overflowX: "auto"
                        }}
                      >
                        {item.mega.map((col) => {
                          const ColIc = col.icon;
                          return (
                            <div key={col.title} style={{ minWidth: 230 }}>
                              <button
                                onClick={() => goHash(col.to)}
                                className="mega-col-head"
                                style={{
                                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                                  padding: "8px 10px", marginBottom: 4, borderRadius: 10,
                                  background: `${col.color}14`, cursor: "pointer", border: "none",
                                }}
                              >
                                <span style={{ width: 24, height: 24, borderRadius: 7, background: col.color, display: "grid", placeItems: "center", flexShrink: 0 }}>
                                  <ColIc size={14} color="#fff" />
                                </span>
                                <span style={{ fontWeight: 800, fontSize: "0.82rem", color: col.color, letterSpacing: "-0.01em" }}>{col.title}</span>
                              </button>
                              {col.items.map((d, i) => {
                                const Ic = d.icon;
                                const defaultColors = [
                                  { bg: "#FFF4E5", color: "#8B5E34" },
                                  { bg: "#E0F2F1", color: "#00695C" },
                                  { bg: "#F3F0F5", color: "#7E57C2" },
                                  { bg: "#FCE4EC", color: "#AD1457" },
                                  { bg: "#E3F2FD", color: "#1565C0" },
                                  { bg: "#E8F5E9", color: "#2E7D32" }
                                ];
                                const theme = defaultColors[i % defaultColors.length];
                                return (
                                  <button
                                    key={d.label}
                                    onClick={() => goHash(d.to)}
                                    className="mega-item"
                                    style={{ ...megaItemStyle, alignItems: d.desc ? "flex-start" : "center", "--mega-accent": col.color }}
                                  >
                                    <span style={{ width: 40, height: 40, borderRadius: 12, background: d.iconBg || theme.bg, display: "grid", placeItems: "center", flexShrink: 0, marginTop: d.desc ? 2 : 0 }}>
                                      <Ic size={18} color={d.iconColor || theme.color} style={{ strokeWidth: 1.8 }} />
                                    </span>
                                    <span style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                                      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--navy)" }}>{d.label}</span>
                                        {d.badge && <span style={{ background: "#FFF0F0", color: "#FF8A8A", fontSize: "0.6rem", fontWeight: 800, padding: "2px 6px", borderRadius: 4, letterSpacing: "0.05em" }}>{d.badge}</span>}
                                      </span>
                                      {d.desc && <span style={{ fontSize: "0.78rem", color: "#888", lineHeight: 1.3 }}>{d.desc}</span>}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : item.drop ? (
                <>
                  <button
                    onClick={(e) => { e.preventDefault(); if (GATE_TABS && !isLoggedIn) openLogin(); }}
                    className={item.highlight ? "nav-highlight-btn" : "nav-link-btn"}
                    style={item.highlight ? navHighlightStyle(open === item.label || isActive(item)) : navLinkStyle(open === item.label || isActive(item))}
                  >
                    {item.icon && <item.icon size={15} style={{ color: "rgba(0,0,0,0.35)", marginRight: 2 }} />}
                    {item.label}
                  </button>
                  <AnimatePresence>
                    {open === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        style={{
                          position: "absolute", top: "calc(100% + 6px)", left: 0,
                          background: "#fff", borderRadius: 14, boxShadow: "var(--shadow-lg)",
                          minWidth: 252, padding: 8, border: "1px solid var(--border)",
                        }}
                      >
                        {item.drop.map((d, i) => {
                          const Ic = d.icon;
                          const defaultColors = [
                            { bg: "#FFF4E5", color: "#8B5E34" },
                            { bg: "#E0F2F1", color: "#00695C" },
                            { bg: "#F3F0F5", color: "#7E57C2" },
                            { bg: "#FCE4EC", color: "#AD1457" },
                            { bg: "#E3F2FD", color: "#1565C0" },
                            { bg: "#E8F5E9", color: "#2E7D32" }
                          ];
                          const theme = defaultColors[i % defaultColors.length];
                          return (
                            <button key={d.label} onClick={() => goHash(d.to)} className="mega-item" style={{ ...megaItemStyle, alignItems: "flex-start", "--mega-accent": "#FF693D" }}>
                              <span style={{ width: 40, height: 40, borderRadius: 12, background: d.iconBg || theme.bg, display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                                <Ic size={18} color={d.iconColor || theme.color} style={{ strokeWidth: 1.8 }} />
                              </span>
                              <span style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                                <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--navy)" }}>{d.label}</span>
                                  {d.badge && <span style={{ background: "#FFF0F0", color: "#FF8A8A", fontSize: "0.6rem", fontWeight: 800, padding: "2px 6px", borderRadius: 4, letterSpacing: "0.05em" }}>{d.badge}</span>}
                                </span>
                                {d.tag && <span style={{ fontSize: "0.78rem", color: "#888", lineHeight: 1.3 }}>{d.tag}</span>}
                              </span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : item.feature ? (
                <button
                  onClick={() => goHash(item.to)}
                  className="nav-feature-btn"
                  style={navFeatureStyle}
                >
                  <Sparkles size={14} />
                  {item.label}
                </button>
              ) : (
                <button onClick={() => goHash(item.to)} className="nav-link-btn" style={navLinkStyle(isActive(item))}>
                  {item.icon && <item.icon size={15} style={{ color: "rgba(0,0,0,0.35)", marginRight: 2 }} />}
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: 8, justifySelf: "end", gridColumn: 3 }}>
          {isLoggedIn ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="cta-desktop"
              title="My Dashboard"
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 12px 5px 5px", borderRadius: 999, border: "1px solid rgba(0,0,0,0.08)", background: "#fff", color: "var(--navy)", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"; }}
            >
              <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#FFF1E9", color: "#FF693D", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 800 }}>
                {(user?.name || user?.phone || "U").charAt(0).toUpperCase()}
              </span>
              {user?.name?.split(" ")[0] || "Account"}
            </button>
          ) : (
            <button
              onClick={openLogin}
              className="cta-desktop nav-ghost-cta"
              style={{ padding: "8px 16px", borderRadius: 999, border: "1px solid rgba(0,0,0,0.06)", background: "#fff", color: "var(--navy)", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
            >
              Login
            </button>
          )}
          <button className="hamburger" onClick={() => { setExpandedSection(null); setMobileOpen(true); }} aria-label="Menu" style={{ display: "none" }}>
            <Menu size={22} color="var(--navy)" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(13,27,62,.4)", zIndex: 1100 }}
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              style={{
                position: "fixed", top: 0, right: 0, bottom: 0,
                width: "min(320px,86vw)", background: "#fff", zIndex: 1200,
                padding: "1.2rem", overflowY: "auto", boxShadow: "var(--shadow-lg)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                {/* Mobile drawer logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#FF693D",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <span style={{ color: "#fff", fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "13px", letterSpacing: "-0.5px", lineHeight: 1 }}>
                      CP
                    </span>
                  </span>
                  <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.05rem", whiteSpace: "nowrap", color: "#1a1a2e" }}>
                    College <span style={{ color: "#1a1a2e" }}>Parichay</span>
                  </span>
                </div>
                <button onClick={() => setMobileOpen(false)}><X size={22} /></button>
              </div>

              {/* College Parichay AI — prominent in the mobile drawer */}
              <button
                onClick={() => { setMobileOpen(false); navigate("/ai"); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                  background: "#FF693D", borderRadius: 10, padding: "11px 12px",
                  marginBottom: "0.8rem", border: "none", cursor: "pointer", color: "#fff",
                }}>
                <Sparkles size={18} />
                <span style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <span style={{ fontWeight: 800, fontSize: "0.92rem" }}>College Parichay AI</span>
                  <span style={{ fontSize: "0.72rem", opacity: .9 }}>Solve doubts, notes & quizzes →</span>
                </span>
              </button>

              {isLoggedIn && (
                <button
                  onClick={() => { setMobileOpen(false); navigate("/dashboard"); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                    background: "#FFF4EC", borderRadius: 10, padding: "10px 12px",
                    marginBottom: "0.8rem", border: "1px solid #FFD9BA", cursor: "pointer",
                  }}>
                  <span style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "#FF693D", color: "#fff",
                    display: "grid", placeItems: "center",
                    fontSize: 14, fontWeight: 800, flexShrink: 0,
                  }}>
                    {(user?.name || user?.phone || "U").charAt(0).toUpperCase()}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user?.name || user?.phone || "My Account"}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "#E0421F", fontWeight: 600 }}>View my dashboard →</span>
                  </span>
                </button>
              )}

              {/* Public community — kept in the mobile drawer (the hamburger is
                  how phones navigate); on desktop it lives in the hero instead. */}
              <button
                onClick={() => { setMobileOpen(false); navigate("/community"); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                  background: "rgba(14,165,233,.08)", borderRadius: 10, padding: "11px 12px",
                  marginBottom: "0.8rem", border: "1px solid rgba(14,165,233,.3)", cursor: "pointer",
                }}>
                <span style={{ width: 32, height: 32, borderRadius: "50%", background: "#0ea5e9", color: "#fff", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Globe2 size={17} />
                </span>
                <span style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.9rem" }}>Public Community</span>
                  <span style={{ fontSize: "0.72rem", color: "#0284c7", fontWeight: 600 }}>Share tricks, strategies & notes →</span>
                </span>
              </button>

              {navItems.map((item) => {
                if (item.feature) {
                  return (
                    <button
                      key={item.label}
                      onClick={() => goHash(item.to)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        width: "100%", margin: "10px 0", padding: "13px 16px",
                        borderRadius: 12, border: "none", cursor: "pointer",
                        color: "#fff", fontWeight: 800, fontSize: "0.98rem",
                        background: "linear-gradient(120deg, #FF693D 0%, #FF693D 40%, #fb923c 60%, #FF693D 100%)",
                        backgroundSize: "200% auto",
                        boxShadow: "0 8px 20px -8px rgba(255, 105, 61,.7)",
                        animation: "brandGradient 3s linear infinite",
                      }}
                    >
                      <Sparkles size={16} /> {item.label}
                    </button>
                  );
                }

                const hasChildren = !!(item.drop || item.mega);
                const expanded = expandedSection === item.label;
                const active = isActive(item);

                return (
                  <div key={item.label} style={{ borderBottom: "1px solid var(--gray-light)" }}>
                    {/* Top-level category row — taps toggle the section (or navigate if it has no children) */}
                    <button
                      onClick={() =>
                        hasChildren
                          ? setExpandedSection(expanded ? null : item.label)
                          : goHash(item.to || item.base)
                      }
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                        fontWeight: 700, fontSize: "1rem", padding: "0.85rem 0.7rem",
                        width: "100%", borderRadius: 10, cursor: "pointer",
                        color: active || expanded ? "#E0421F" : "var(--navy)",
                        background: active ? "rgba(255, 105, 61,.1)" : "transparent",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {active && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF693D" }} />}
                        {item.label}
                      </span>
                      {hasChildren && (
                        <ChevronDown
                          size={18}
                          style={{
                            color: "#9ca3af", flexShrink: 0,
                            transform: expanded ? "rotate(180deg)" : "none",
                            transition: "transform .2s",
                          }}
                        />
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {hasChildren && expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeInOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          {item.drop && (
                            <div style={{ paddingLeft: 12, paddingBottom: 8 }}>
                              {item.drop.map((d) => (
                                <button
                                  key={d.label}
                                  onClick={() => goHash(d.to)}
                                  style={{ display: "block", padding: "0.5rem 0.7rem", color: "var(--gray)", fontSize: "0.9rem", width: "100%", textAlign: "left" }}
                                >
                                  {d.label}
                                </button>
                              ))}
                            </div>
                          )}
                          {item.mega && (
                            <div style={{ paddingLeft: 12, paddingBottom: 8 }}>
                              {item.mega.map((col) => (
                                <div key={col.title} style={{ marginTop: 8 }}>
                                  <button
                                    onClick={() => goHash(col.to)}
                                    style={{ display: "block", padding: "0.25rem 0.7rem", fontSize: "0.72rem", fontWeight: 800, color: col.color, letterSpacing: "0.04em", textTransform: "uppercase" }}
                                  >
                                    {col.title}
                                  </button>
                                  {col.items.map((d) => (
                                    <button
                                      key={d.label}
                                      onClick={() => goHash(d.to)}
                                      style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1, padding: "0.45rem 0.7rem", width: "100%", textAlign: "left" }}
                                    >
                                      <span style={{ color: "var(--navy)", fontSize: "0.88rem", fontWeight: 600 }}>{d.label}</span>
                                      {d.desc && <span style={{ color: "#9ca3af", fontSize: "0.74rem", lineHeight: 1.3 }}>{d.desc}</span>}
                                    </button>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              <Link
                to="/how-to-use"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", marginTop: 14, padding: "12px 16px",
                  borderRadius: 10, border: "1.5px solid rgba(255, 105, 61,.28)",
                  background: "rgba(255, 105, 61,.1)", color: "#E0421F",
                  fontWeight: 700, fontSize: "0.95rem", textDecoration: "none",
                }}
              >
                <HelpCircle size={16} /> How to use College Parichay
              </Link>

              {isLoggedIn ? (
                <button
                  onClick={() => { setMobileOpen(false); setConfirmLogout(true); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", marginTop: 12, padding: "12px 16px",
                    borderRadius: 10, border: "1.5px solid #FFD9BA",
                    background: "#fff", color: "var(--navy)",
                    fontWeight: 700, cursor: "pointer", fontSize: "0.95rem",
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "#FF693D", color: "#fff",
                    display: "grid", placeItems: "center",
                    fontSize: 13, fontWeight: 800, flexShrink: 0,
                  }}>
                    {(user?.name || user?.phone || "U").charAt(0).toUpperCase()}
                  </span>
                  <span style={{ flex: 1, textAlign: "left" }}>
                    {user?.name || user?.phone || "Account"}
                  </span>
                  <span style={{ color: "#e5484d", fontSize: "0.85rem", fontWeight: 700 }}>
                    Logout
                  </span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); openLogin(); }}
                    style={{
                      width: "100%", marginTop: 12, padding: "13px 16px",
                      borderRadius: 10, border: "1.5px solid var(--line)",
                      background: "#fff", color: "var(--navy)",
                      fontWeight: 700, cursor: "pointer", fontSize: "0.95rem",
                    }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setMobileOpen(false); openSignup(); }}
                    style={{
                      width: "100%", marginTop: 8, padding: "13px 16px",
                      borderRadius: 10, border: "none",
                      background: "#FF693D", color: "#fff",
                      fontWeight: 700, cursor: "pointer", fontSize: "0.95rem",
                    }}
                  >
                    Sign Up Free
                  </button>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Logout confirmation ── */}
      <AnimatePresence>
        {confirmLogout && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setConfirmLogout(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 2000,
              background: "rgba(13,27,62,.55)",
              backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
              display: "grid", placeItems: "center", padding: "1.2rem",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(380px, 100%)", background: "#fff",
                borderRadius: 20, padding: "26px 24px 22px",
                boxShadow: "0 30px 80px rgba(13,27,62,.4)",
                textAlign: "center",
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: "50%", margin: "0 auto 14px",
                background: "#FFF1E9", display: "grid", placeItems: "center",
              }}>
                <LogOut size={26} color="#FF693D" />
              </div>
              <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.25rem", color: "var(--navy)", margin: "0 0 6px" }}>
                Log out?
              </h3>
              <p style={{ fontSize: "0.95rem", color: "var(--gray)", margin: "0 0 20px", lineHeight: 1.5 }}>
                Are you sure you want to log out of your account?
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setConfirmLogout(false)}
                  style={{
                    flex: 1, padding: "12px 0", borderRadius: 12,
                    border: "1.5px solid var(--line)", background: "#fff",
                    color: "var(--navy)", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
                  }}
                >
                  No
                </button>
                <button
                  onClick={() => { logout(); setConfirmLogout(false); navigate("/"); }}
                  style={{
                    flex: 1, padding: "12px 0", borderRadius: 12,
                    border: "none", background: "#e5484d",
                    color: "#fff", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
                    boxShadow: "0 6px 18px -6px #e5484d",
                  }}
                >
                  Yes, log out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const navLinkStyle = (active) => ({
  display: "flex", alignItems: "center", gap: 5,
  padding: "0.46rem 0.8rem", fontSize: "0.93rem", fontWeight: active ? 700 : 600,
  color: active ? "#111" : "#444",
  borderRadius: 999, whiteSpace: "nowrap", cursor: "pointer",
  fontFamily: "inherit", fontStyle: "normal",
  background: active ? "rgba(0,0,0,.04)" : "transparent",
  border: "none",
  boxShadow: "none",
  transition: "background .2s ease, color .2s ease",
});

const navHighlightStyle = (active) => ({
  display: "flex", alignItems: "center", gap: 5,
  padding: "0.46rem 0.95rem", fontSize: "0.86rem", fontWeight: 800,
  color: "#fff",
  borderRadius: 10, whiteSpace: "nowrap", cursor: "pointer",
  fontFamily: "inherit", fontStyle: "normal",
  background: "linear-gradient(120deg, #FF693D 0%, #FF693D 45%, #fbbf24 100%)",
  backgroundSize: "200% auto",
  border: "1.5px solid rgba(255,255,255,.5)",
  boxShadow: active ? "0 8px 20px -6px rgba(255, 105, 61,.8)" : "0 6px 16px -8px rgba(255, 105, 61,.6)",
  animation: "brandGradient 3s linear infinite",
  transition: "all .2s",
});

const navFeatureStyle = {
  display: "flex", alignItems: "center", gap: 5,
  padding: "0.45rem 0.85rem", fontSize: "0.86rem", fontWeight: 700,
  color: "#fff", borderRadius: 10, whiteSpace: "nowrap", cursor: "pointer",
  border: "none", fontStyle: "normal",
  background: "linear-gradient(120deg, #FF693D 0%, #FF693D 40%, #fb923c 60%, #FF693D 100%)",
  backgroundSize: "200% auto",
  boxShadow: "0 6px 16px -6px rgba(255, 105, 61,.75)",
  animation: "brandGradient 3s linear infinite",
  transition: "transform .2s ease, box-shadow .2s ease",
};

const iconBtnStyle = {
  width: 38, height: 38, borderRadius: 999,
  display: "grid", placeItems: "center",
  border: "none", cursor: "pointer",
  transition: "background .15s ease, color .15s ease",
};

const iconBadge = (bg) => ({
  position: "absolute", top: 0, right: 0,
  minWidth: 16, height: 16, padding: "0 4px",
  borderRadius: 999, background: bg, color: "#fff",
  fontSize: 9, fontWeight: 700, lineHeight: 1,
  display: "grid", placeItems: "center",
});

const dropItemStyle = {
  display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
  padding: "0.6rem 0.8rem", borderRadius: 9, fontSize: "0.85rem", color: "var(--navy)",
};

const megaItemStyle = {
  display: "flex", alignItems: "center", gap: 9, width: "100%", textAlign: "left",
  padding: "0.5rem 0.7rem 0.5rem 0.85rem", borderRadius: 9,
  fontSize: "0.82rem", color: "var(--navy)", cursor: "pointer", border: "none", background: "transparent",
};