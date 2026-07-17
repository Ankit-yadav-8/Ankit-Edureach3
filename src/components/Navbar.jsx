import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Search, Target, Menu, X,
  BadgeCheck, CalendarDays, FileText, BarChart3, Landmark, Crosshair, Gauge, Heart, GitCompare, Award,
  BookOpen, FlaskConical, Sigma, Zap, Trophy, LogOut, Sparkles,
  HelpCircle, Flame, Globe2, Edit3, Activity, Clock, ClipboardCheck, Compass, GraduationCap
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
    title: "JEE Main", to: "/jee-main", color: "#FF693D", icon: FileText,
    items: [
      { label: "Eligibility Criteria",     to: "/jee-main#eligibility",   icon: BadgeCheck, desc: "Age & qualification rules" },
      { label: "Exam Pattern & Schedule",  to: "/jee-main",               icon: CalendarDays, desc: "Dates, marking & syllabus" },
      { label: "NIT Rankings (NIRF)",      to: "/jee-main#nit-rankings",  icon: Landmark, desc: "Official 2026 rankings" },
      { label: "College Predictor",        to: "/jee-main#college",       icon: Crosshair, desc: "Rank → eligible colleges" },
      { label: "Rank Predictor",           to: "/jee-main#rank",          icon: Gauge, desc: "Marks → expected rank" },
    ],
  },
  {
    title: "JEE Advanced", to: "/jee-advanced", color: "#e5484d", icon: Trophy,
    items: [
      { label: "Result & Rank List 2026",    to: "/jee-advanced-result-2026", icon: Award, desc: "Toppers & cutoffs" },
      { label: "Eligibility Criteria",       to: "/jee-advanced#eligibility",   icon: BadgeCheck, desc: "Top 2.5 lakh cutoff rule" },
      { label: "Exam Pattern & Schedule",    to: "/jee-advanced",               icon: CalendarDays, desc: "Paper 1 & 2 details" },
      { label: "IIT Rankings (NIRF)",        to: "/jee-advanced#iit-rankings",  icon: Landmark, desc: "Official 2026 rankings" },
      { label: "College Predictor",          to: "/jee-advanced#college",       icon: Crosshair, desc: "Rank → eligible IITs" },
    ],
  },
];

// ── NEET mega-menu: mirrors the JEE tab's style with dummy NEET data ──────────
const NEET_MEGA = [
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

// ── Resources dropdown: learning hub — syllabus, strategies & the AI tutor ────
// Pulled out of the JEE mega-menu into its own top-level tab so study material
// isn't buried under an exam-specific menu.
const RESOURCES_NAV = [
  { label: "College Parichay AI", to: "/ai", icon: Sparkles, tag: "Solve doubts, get notes & quizzes" },
  { label: "Class 11 Syllabus & Mind Maps", to: "/class-11", icon: BookOpen, tag: "Chapter-wise notes + mind maps" },
  { label: "Class 12 Syllabus & Mind Maps", to: "/class-12", icon: Edit3, tag: "Boards + competitive prep" },
  { label: "Exam Strategy — JEE", to: "/jee-strategy", icon: Zap, tag: "Toppers' roadmap, tips & tricks" },
  { label: "JEE Advanced Chapter Analysis", to: "/jee-advanced-analysis", icon: BarChart3, tag: "80 chapters ranked by weightage & priority" },
  { label: "Exam Strategy — NEET", to: "/neet-strategy", icon: FlaskConical, tag: "Time-management & accuracy hacks" },
  { label: "Other Entrance Exams", to: "/other-exams", icon: Compass, tag: "BITSAT, VITEEE, state CETs & 30+ more" },
];

// ── Mentorship dropdown: 1-on-1 JEE & NEET mentorship pages ───────────────────
const MENTORSHIP_NAV = [
  { label: "JEE & NEET 2027",   to: "/mentorship/jee-2027",   icon: Trophy,   tag: "₹2,499 · Class 12 / Droppers" },
  { label: "JEE & NEET 2028",   to: "/mentorship/jee-2028",   icon: Award,    tag: "₹2,499 · 2-Year Plan" },
  { label: "Foundation (9–10)", to: "/mentorship/foundation", icon: BookOpen, tag: "₹2,499 · Class 9 & 10" },
];

const COLLEGES = [
  { label: "Explore IITs", to: "/colleges?type=IIT", icon: Landmark, tag: "All 23 IITs, branch-wise" },
  { label: "Explore NITs", to: "/colleges?type=NIT", icon: Landmark, tag: "31 NITs across India" },
  { label: "Explore IIITs", to: "/colleges?type=IIIT", icon: Landmark, tag: "Govt-funded IIITs" },
  { label: "Private Universities", to: "/private-universities", icon: Clock, tag: "Top-ranked private options" },
  { label: "State-wise Colleges", to: "/colleges", icon: Compass, tag: "Browse by state quota" },
];

// ── Tools mega-menu: every utility grouped under a common, colour-coded name ──
// Each item carries a one-line `desc` so first-time visitors instantly know what
// the tool does — they shouldn't have to click to find out.
const TOOLS_MEGA = [
  {
    title: "Plan & Apply", to: "/planner", color: "#FF693D", icon: CalendarDays,
    items: [
      { label: "Colleges For You",        to: "/for-you",    icon: Compass,      desc: "Personalised IIT, NIT & IIIT picks for your JEE rank" },
      { label: "Branch Insights Hub",     to: "/branches",   icon: Landmark,     desc: "Explore 15+ engineering domains, scope & career paths" },
      { label: "Trade-off Analyzer",      to: "/branch-vs-college", icon: GitCompare, desc: "A quick 6-question quiz to settle college vs branch" },
      { label: "Counselling Planner",     to: "/planner",    icon: CalendarDays, desc: "Track every JoSAA & CSAB round date in one place" },
      { label: "JoSAA 2026 Counselling",  to: "/josaa-2026", icon: Award,        desc: "Expert-guided choice filling — the ₹299 plan" },
    ],
  },
  {
    title: "Compare & Explore", to: "/compare", color: "#6366f1", icon: GitCompare,
    items: [
      { label: "Compare Colleges", to: "/compare",       icon: GitCompare, desc: "Place colleges side by side on fees, ranks & placements" },
      { label: "Compare Exams",    to: "/compare-exams", icon: BarChart3,  desc: "JEE vs BITSAT, VITEEE & other entrance exams" },
      { label: "College Map",      to: "/map",           icon: Landmark,   desc: "Find engineering institutes across India on a map" },
    ],
  },
  {
    title: "Cutoffs & More", to: "/cutoffs", color: "#2ec4b6", icon: FileText,
    items: [
      { label: "Official Cutoffs",      to: "/cutoffs",      icon: FileText,    desc: "Real JoSAA opening & closing ranks, round by round" },
      { label: "Scholarships & Loans",  to: "/scholarships", icon: BadgeCheck,  desc: "Funding, scholarships & education loans for your seat" },
      // Admin Data is deliberately NOT listed. This menu is shown to every
      // visitor, and the admin panel is for two people — signposting it to
      // everyone bought nothing. /admin still works when typed directly; this
      // removes the advertising, not the access, and the panel is gated by
      // key + OTP server-side regardless.
      { label: "Mentor Dashboard",      to: "/mentor",       icon: GraduationCap, desc: "Mentors sign in with the email & password from your admin" },
    ],
  },
  {
    title: "Community", to: "/campus-notes", color: "#e5484d", icon: Heart,
    items: [
      { label: "Campus Notes",       to: "/campus-notes", icon: BookOpen,   desc: "Upload & share study notes with your batch", iconBg: "#FFF3E0", iconColor: "#8B5E34" },
      { label: "Public Community",   to: "/community",    icon: Globe2,     desc: "Peer discussions, doubts & Q&A with students", iconBg: "#E0F2F1", iconColor: "#00695C" },
      { label: "Events & Fests",     to: "/campus-fests", icon: Sparkles,   desc: "Discover cultural & tech fests across campuses", iconBg: "#FCE4EC", iconColor: "#C2185B" },
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
    { label: "JEE", icon: BookOpen, mega: JEE_MEGA, base: "/jee-main", match: (p) => p.startsWith("/jee") },
    { label: "NEET", icon: FlaskConical, mega: NEET_MEGA, base: "/neet", match: (p) => p.startsWith("/neet") },
    { label: "Resources", icon: BookOpen, drop: RESOURCES_NAV, base: "/class-11", match: (p) => ["/class-1", "/jee-strategy", "/jee-advanced-analysis", "/neet-strategy", "/ai", "/other-exams"].some((x) => p.startsWith(x)) },
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
          height: 64,
          width: "100%",
          background: "var(--page-bg)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.03)" : "none",
          transition: "box-shadow .3s ease",
        }}
      >
        {/* Inner wrapper shares the site `.container` width so the bar lines up
            with the page sections (branches, etc.) and the links stay centred. */}
        <div className="container" style={{ height: "100%", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
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
                fontFamily: "'Plus Jakarta Sans', sans-serif",
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
          <span id="cp-wordmark" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1rem, 4.4vw, 1.3rem)", letterSpacing: "-0.01em", whiteSpace: "nowrap", color: "#1a1a2e" }}>
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
                          background: "var(--page-bg)", borderRadius: 18,
                          boxShadow: "0 24px 60px -18px rgba(13,27,62,.32)",
                          padding: "16px 16px 14px", border: "1px solid var(--border)",
                          display: "flex", flexDirection: "column",
                          maxWidth: "96vw", overflowX: "auto"
                        }}
                      >
                        <div style={eyebrowStyle}>Explore {item.label}</div>
                        <div style={{ display: "flex", gap: 26 }}>
                        {item.mega.map((col) => {
                          const ColIc = col.icon;
                          return (
                            <div key={col.title} style={{ minWidth: 232 }}>
                              <button
                                onClick={() => goHash(col.to)}
                                className="mega-col-head"
                                style={{
                                  display: "flex", alignItems: "center", gap: 7, width: "100%",
                                  padding: "4px 6px", marginBottom: 6, borderRadius: 8,
                                  background: "transparent", cursor: "pointer", border: "none",
                                }}
                              >
                                <ColIc size={16} color={col.color} style={{ strokeWidth: 2 }} />
                                <span style={{ fontWeight: 800, fontSize: "0.9rem", color: col.color, letterSpacing: "-0.01em" }}>{col.title}</span>
                              </button>
                              {col.items.map((d, i) => {
                                const Ic = d.icon;
                                const theme = TILE_COLORS[i % TILE_COLORS.length];
                                return (
                                  <button
                                    key={d.label}
                                    onClick={() => goHash(d.to)}
                                    className="mega-item"
                                    style={{ ...megaItemStyle, alignItems: d.desc ? "flex-start" : "center", "--mega-accent": col.color }}
                                  >
                                    <span style={{ width: 40, height: 40, borderRadius: 12, background: d.iconBg || theme.bg, display: "grid", placeItems: "center", flexShrink: 0, marginTop: d.desc ? 2 : 0 }}>
                                      <Ic size={18} color={d.iconColor || theme.color} style={{ strokeWidth: 1.85 }} />
                                    </span>
                                    <span style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                                      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a1a2e" }}>{d.label}</span>
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
                        </div>
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
                          background: "var(--page-bg)", borderRadius: 18, boxShadow: "0 24px 60px -18px rgba(13,27,62,.32)",
                          minWidth: 300, padding: "16px 14px 12px", border: "1px solid var(--border)",
                        }}
                      >
                        <div style={eyebrowStyle}>Explore {item.label}</div>
                        {item.drop.map((d, i) => {
                          const Ic = d.icon;
                          const theme = TILE_COLORS[i % TILE_COLORS.length];
                          return (
                            <button key={d.label} onClick={() => goHash(d.to)} className="mega-item" style={{ ...megaItemStyle, alignItems: "flex-start", "--mega-accent": "#FF693D" }}>
                              <span style={{ width: 40, height: 40, borderRadius: 12, background: d.iconBg || theme.bg, display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                                <Ic size={18} color={d.iconColor || theme.color} style={{ strokeWidth: 1.85 }} />
                              </span>
                              <span style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                                <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a1a2e" }}>{d.label}</span>
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
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", alignItems: "center", gap: 8, padding: "5px 12px 5px 5px", borderRadius: 999, border: "1px solid rgba(0,0,0,0.08)", background: "var(--page-bg)", color: "var(--navy)", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem", transition: "all 0.2s" }}
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
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", padding: "8px 16px", borderRadius: 999, border: "1px solid rgba(0,0,0,0.06)", background: "var(--page-bg)", color: "var(--navy)", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
            >
              Login
            </button>
          )}
          <button className="hamburger" onClick={() => { setExpandedSection(null); setMobileOpen(true); }} aria-label="Menu" style={{ display: "none" }}>
            <Menu size={22} color="var(--navy)" />
          </button>
        </div>
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
                width: "min(320px,86vw)", background: "var(--page-bg)", zIndex: 1200,
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
                    background: "var(--page-bg)", color: "var(--navy)",
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
                      background: "var(--page-bg)", color: "var(--navy)",
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
                width: "min(380px, 100%)", background: "var(--page-bg)",
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
                    border: "1.5px solid var(--line)", background: "var(--page-bg)",
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
  padding: "0.46rem 0.8rem", fontSize: "0.9rem", fontWeight: active ? 700 : 600,
  color: active ? "#111" : "#444",
  borderRadius: 999, whiteSpace: "nowrap", cursor: "pointer",
  fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: "normal", letterSpacing: "-0.01em",
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
  display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left",
  padding: "0.5rem 0.7rem", borderRadius: 11,
  fontSize: "0.82rem", color: "var(--navy)", cursor: "pointer", border: "none", background: "transparent",
};

// Shared "EXPLORE X" eyebrow shown at the top of every dropdown / mega-menu.
const eyebrowStyle = {
  fontFamily: "Sora, sans-serif",
  fontSize: "0.68rem", fontWeight: 800,
  letterSpacing: "0.16em", textTransform: "uppercase",
  color: "#9aa3b2", padding: "0 6px 12px",
};

// Bright pastel tiles used by every dropdown item — matches the reference cards.
const TILE_COLORS = [
  { bg: "#EDE7FE", color: "#7C3AED" }, // purple
  { bg: "#FCE1EA", color: "#DB2777" }, // rose
  { bg: "#DCEBFE", color: "#2563EB" }, // blue
  { bg: "#D6F3E5", color: "#0EA371" }, // green
  { bg: "#FEEBCF", color: "#E08600" }, // amber
];