import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Search, Target, Menu, X,
  BadgeCheck, CalendarDays, FileText, BarChart3, Landmark, Crosshair, Gauge, Heart, GitCompare, Award, ShieldCheck,
  BookOpen, FlaskConical, Sigma, Zap, CalendarClock, Trophy, LogOut, Sparkles,
  HelpCircle,
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
    title: "JEE Prep Resources", to: "/jee-resources", color: "#6366f1", icon: BookOpen,
    items: [
      { label: "Mathematics (19 chapters)", to: "/jee-resources?subject=math",      icon: Sigma },
      { label: "Physics (25 chapters)",     to: "/jee-resources?subject=physics",   icon: Zap },
      { label: "Chemistry (29 chapters)",   to: "/jee-resources?subject=chemistry", icon: FlaskConical },
      { label: "Exam Cycle 2025–26",        to: "/#exam-cycle",                     icon: CalendarClock },
    ],
  },
  {
    title: "JEE Main", to: "/jee-main", color: "#F47B20", icon: FileText,
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

const COLLEGES = [
  { label: "Explore IITs", to: "/colleges?type=IIT", icon: Landmark },
  { label: "Explore NITs", to: "/colleges?type=NIT", icon: Landmark },
  { label: "Explore IIITs", to: "/colleges?type=IIIT", icon: Landmark },
  { label: "Private Universities", to: "/#private", icon: BadgeCheck },
  { label: "State-wise Colleges", to: "/colleges", icon: BadgeCheck },
];

// ── Tools mega-menu: every utility grouped under a common, colour-coded name ──
// Each item carries a one-line `desc` so first-time visitors instantly know what
// the tool does — they shouldn't have to click to find out.
const TOOLS_MEGA = [
  {
    title: "Plan & Apply", to: "/planner", color: "#F47B20", icon: CalendarDays,
    items: [
      { label: "Counselling Planner",     to: "/planner",    icon: CalendarDays, desc: "Track every JoSAA & CSAB round date" },
      { label: "JoSAA 2026 Counselling",  to: "/josaa-2026", icon: Award,        desc: "Expert ₹249 choice-filling plan" },
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
];

export default function Navbar({ onSearch }) {
  const { saved, compare } = useShortlist();
  const { isLoggedIn, user, openLogin, openSignup, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    { label: "Home", to: "/", match: (p) => p === "/" },
    { label: "JEE", mega: JEE_MEGA, base: "/jee-resources", highlight: true, match: (p) => p.startsWith("/jee") },
    { label: "Colleges", drop: COLLEGES, base: "/colleges", match: (p) => p.startsWith("/colleges") || p.startsWith("/college/") },
    { label: "Colleges For You", to: "/for-you", feature: true, match: (p) => p.startsWith("/for-you") },
    { label: "Exams", to: "/exams", match: (p) => p.startsWith("/exam") || p.startsWith("/compare-exams") },
    { label: "Tools", mega: TOOLS_MEGA, base: "/planner", align: "right", match: (p) => ["/planner", "/compare", "/cutoffs", "/scholarships", "/map", "/admin", "/josaa"].some((x) => p.startsWith(x)) },
  ];

  const isActive = (item) => (item.match ? item.match(location.pathname) : false);

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 3, left: 0, right: 0, zIndex: 1000,
          height: 68, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 1.4rem",
          background: scrolled ? "rgba(250,249,247,0.96)" : "rgba(250,249,247,0.82)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(214,224,245,0.5)",
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
          transition: "all .3s ease",
        }}
      >
        {/* ── LOGO ── */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0 })}
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}
        >
          {/* CP circle logo */}
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "#F47B20",
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

          {/* Brand text */}
          <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
            College{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #F47B20 0%, #f97316 25%, #fbbf24 50%, #f97316 75%, #F47B20 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "brandGradient 3s linear infinite",
                display: "inline",
              }}
            >
              Parichay
            </span>
          </span>
        </Link>

        {/* Desktop nav — a flexible middle section (flex:1) that centres the
            JEE / Colleges / Tools links in the space left between the logo and
            the right-hand action cluster. Using flex flow (instead of the old
            position:absolute centring) guarantees the links can never overlap
            the side clusters on MacBook / laptop widths (1280–1500px), where the
            absolutely-positioned version used to collide with the buttons. */}
        <ul
          className="desktop-nav"
          style={{
            display: "flex", alignItems: "center", gap: 4,
            flex: "1 1 auto", justifyContent: "center", minWidth: 0,
            margin: 0, padding: 0, listStyle: "none",
          }}
        >
          {navItems.map((item) => (
            <li
              key={item.label}
              style={{ position: "relative" }}
              onMouseEnter={() => (item.drop || item.mega) && setOpen(item.label)}
              onMouseLeave={() => setOpen(null)}
            >
              {item.mega ? (
                <>
                  <button
                    onClick={() => (GATE_TABS && !isLoggedIn ? openLogin() : navigate(item.base))}
                    style={item.highlight ? navHighlightStyle(open === item.label || isActive(item)) : navLinkStyle(open === item.label || isActive(item))}
                  >
                    {item.highlight && <BookOpen size={13} />}
                    {item.label}
                    <ChevronDown size={13} style={{ transform: open === item.label ? "rotate(180deg)" : "none", transition: ".2s" }} />
                  </button>
                  <AnimatePresence>
                    {open === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        style={{
                          position: "absolute", top: "calc(100% + 8px)",
                          ...(item.align === "right" ? { right: 0 } : { left: 0 }),
                          background: "#fff", borderRadius: 18,
                          boxShadow: "0 24px 60px -18px rgba(13,27,62,.32)",
                          padding: 12, border: "1px solid var(--border)",
                          display: "flex", gap: 6,
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
                              {col.items.map((d) => {
                                const Ic = d.icon;
                                return (
                                  <button
                                    key={d.label}
                                    onClick={() => goHash(d.to)}
                                    className="mega-item"
                                    style={{ ...megaItemStyle, alignItems: d.desc ? "flex-start" : "center", "--mega-accent": col.color }}
                                  >
                                    <span style={{ width: 26, height: 26, borderRadius: 8, background: `${col.color}16`, display: "grid", placeItems: "center", flexShrink: 0, marginTop: d.desc ? 1 : 0 }}>
                                      <Ic size={15} color={col.color} />
                                    </span>
                                    <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                      <span style={{ fontWeight: 700, fontSize: "0.83rem", color: "var(--navy)" }}>{d.label}</span>
                                      {d.desc && <span style={{ fontSize: "0.72rem", color: "#9ca3af", lineHeight: 1.35 }}>{d.desc}</span>}
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
                    onClick={() => (GATE_TABS && !isLoggedIn ? openLogin() : navigate(item.base))}
                    style={item.highlight ? navHighlightStyle(open === item.label || isActive(item)) : navLinkStyle(open === item.label || isActive(item))}
                  >
                    {item.highlight && <BookOpen size={13} />}
                    {item.label}
                    <ChevronDown size={13} style={{ transform: open === item.label ? "rotate(180deg)" : "none", transition: ".2s" }} />
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
                        {item.drop.map((d) => {
                          const Ic = d.icon;
                          return (
                            <button key={d.label} onClick={() => goHash(d.to)} className="drop-item" style={d.tag ? { ...dropItemStyle, flexDirection: "column", alignItems: "flex-start", gap: 1 } : dropItemStyle}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Ic size={15} color="var(--coral)" />
                                <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{d.label}</span>
                              </div>
                              {d.tag && <span style={{ fontSize: 11, color: "#9ca3af", paddingLeft: 23 }}>{d.tag}</span>}
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
                <button onClick={() => goHash(item.to)} style={navLinkStyle(isActive(item))}>
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {/* Unified utility cluster — Help · Search · Compare · Wishlist merged
              into one segmented pill so the bar reads as a single tidy module
              instead of four loose icons. */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: 2,
              background: "rgba(244,123,32,.06)",
              border: "1px solid rgba(244,123,32,.16)",
              borderRadius: 999, padding: 3,
            }}
          >
            <Link to="/how-to-use" title="How to use College Parichay" aria-label="How to use" className="nav-icon-btn cta-desktop" style={iconBtnStyle}>
              <HelpCircle size={18} />
            </Link>
            <button onClick={onSearch} aria-label="Search" className="nav-icon-btn" style={iconBtnStyle}>
              <Search size={18} />
            </button>
            <Link to="/compare" aria-label="Compare colleges" title="Compare" className="nav-icon-btn" style={{ ...iconBtnStyle, position: "relative" }}>
              <GitCompare size={18} />
              {compare.length > 0 && (
                <span style={iconBadge("var(--teal)")}>{compare.length}</span>
              )}
            </Link>
            <Link to="/shortlist" aria-label="My colleges" title="My Colleges" className="nav-icon-btn" style={{ ...iconBtnStyle, position: "relative", color: "var(--coral)" }}>
              <Heart size={18} fill={saved.length ? "var(--coral)" : "none"} />
              {saved.length > 0 && (
                <span style={iconBadge("var(--coral)")}>{saved.length}</span>
              )}
            </Link>
          </div>
          {isLoggedIn ? (
            <button
              onClick={() => setConfirmLogout(true)}
              title="Logout"
              className="cta-desktop"
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, border: "1.5px solid var(--line)", background: "#fff", color: "var(--navy)", fontWeight: 700, cursor: "pointer" }}
            >
              <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#F47B20", color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800 }}>
                {(user?.name || user?.phone || "U").charAt(0).toUpperCase()}
              </span>
              {user?.name?.split(" ")[0] || "Account"}
              <LogOut size={15} style={{ color: "#e5484d" }} />
            </button>
          ) : (
            <>
              <button
                onClick={openLogin}
                className="cta-desktop"
                style={{ padding: "9px 18px", borderRadius: 10, border: "1.5px solid var(--line)", background: "#fff", color: "var(--navy)", fontWeight: 700, cursor: "pointer" }}
              >
                Login
              </button>
              <button
                onClick={openSignup}
                className="cta-desktop"
                style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: "#F47B20", color: "#fff", fontWeight: 700, cursor: "pointer" }}
              >
                Sign Up
              </button>
            </>
          )}
          <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Menu" style={{ display: "none" }}>
            <Menu size={24} color="var(--navy)" />
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
                      background: "#F47B20",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <span style={{ color: "#fff", fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "13px", letterSpacing: "-0.5px", lineHeight: 1 }}>
                      CP
                    </span>
                  </span>
                  <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.05rem", whiteSpace: "nowrap" }}>
                    College{" "}
                    <span style={{
                      background: "linear-gradient(90deg, #F47B20 0%, #f97316 25%, #fbbf24 50%, #f97316 75%, #F47B20 100%)",
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      animation: "brandGradient 3s linear infinite",
                    }}>Parichay</span>
                  </span>
                </div>
                <button onClick={() => setMobileOpen(false)}><X size={22} /></button>
              </div>

              {isLoggedIn && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "#FFF4EC", borderRadius: 10, padding: "10px 12px",
                  marginBottom: "0.8rem", border: "1px solid #FFD9BA",
                }}>
                  <span style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "#F47B20", color: "#fff",
                    display: "grid", placeItems: "center",
                    fontSize: 14, fontWeight: 800, flexShrink: 0,
                  }}>
                    {(user?.name || user?.phone || "U").charAt(0).toUpperCase()}
                  </span>
                  <span style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.9rem", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user?.name || user?.phone || "My Account"}
                  </span>
                </div>
              )}

              {navItems.map((item) => (
                item.feature ? (
                  <button
                    key={item.label}
                    onClick={() => goHash(item.to)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      width: "100%", margin: "10px 0", padding: "13px 16px",
                      borderRadius: 12, border: "none", cursor: "pointer",
                      color: "#fff", fontWeight: 800, fontSize: "0.98rem",
                      background: "linear-gradient(120deg, #F47B20 0%, #f97316 40%, #fb923c 60%, #F47B20 100%)",
                      backgroundSize: "200% auto",
                      boxShadow: "0 8px 20px -8px rgba(244,123,32,.7)",
                      animation: "brandGradient 3s linear infinite",
                    }}
                  >
                    <Sparkles size={16} /> {item.label}
                  </button>
                ) : (
                <div key={item.label} style={{ borderBottom: "1px solid var(--gray-light)", padding: "0.5rem 0" }}>
                  <button
                    onClick={() => goHash(item.to || item.base)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      fontWeight: 700, fontSize: "1rem", padding: "0.5rem 0.7rem",
                      width: "100%", borderRadius: 10, cursor: "pointer",
                      color: isActive(item) ? "#ea580c" : "var(--navy)",
                      background: isActive(item) ? "rgba(244,123,32,.1)" : "transparent",
                    }}
                  >
                    {isActive(item) && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F47B20" }} />}
                    {item.label}
                  </button>
                  {item.drop && (
                    <div style={{ paddingLeft: 12 }}>
                      {item.drop.map((d) => (
                        <button
                          key={d.label}
                          onClick={() => goHash(d.to)}
                          style={{ display: "block", padding: "0.35rem 0", color: "var(--gray)", fontSize: "0.88rem" }}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {item.mega && (
                    <div style={{ paddingLeft: 12 }}>
                      {item.mega.map((col) => (
                        <div key={col.title} style={{ marginTop: 8 }}>
                          <button
                            onClick={() => goHash(col.to)}
                            style={{ display: "block", padding: "0.25rem 0", fontSize: "0.72rem", fontWeight: 800, color: col.color, letterSpacing: "0.04em", textTransform: "uppercase" }}
                          >
                            {col.title}
                          </button>
                          {col.items.map((d) => (
                            <button
                              key={d.label}
                              onClick={() => goHash(d.to)}
                              style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1, padding: "0.4rem 0", width: "100%", textAlign: "left" }}
                            >
                              <span style={{ color: "var(--navy)", fontSize: "0.88rem", fontWeight: 600 }}>{d.label}</span>
                              {d.desc && <span style={{ color: "#9ca3af", fontSize: "0.74rem", lineHeight: 1.3 }}>{d.desc}</span>}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                )
              ))}

              <Link
                to="/how-to-use"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", marginTop: 14, padding: "12px 16px",
                  borderRadius: 10, border: "1.5px solid rgba(244,123,32,.28)",
                  background: "rgba(244,123,32,.1)", color: "#ea580c",
                  fontWeight: 700, fontSize: "0.95rem", textDecoration: "none",
                }}
              >
                <HelpCircle size={16} /> How to use College Parichay
              </Link>

              <button
                className="btn btn-coral full mt-3"
                style={{ justifyContent: "center" }}
                onClick={() => goHash("/jee-main#college")}
              >
                <Target size={16} /> Predict My College
              </button>

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
                    background: "#F47B20", color: "#fff",
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
                      background: "#F47B20", color: "#fff",
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
                <LogOut size={26} color="#F47B20" />
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
  padding: "0.46rem 0.9rem", fontSize: "0.88rem", fontWeight: active ? 700 : 600,
  color: active ? "#ea580c" : "#374151",
  borderRadius: 999, whiteSpace: "nowrap", cursor: "pointer",
  fontFamily: "inherit",
  background: active ? "rgba(244,123,32,.12)" : "transparent",
  border: `1.5px solid ${active ? "rgba(244,123,32,.3)" : "transparent"}`,
  boxShadow: active ? "0 4px 14px -6px rgba(244,123,32,.5)" : "none",
  transition: "all .2s",
});

const navHighlightStyle = (active) => ({
  display: "flex", alignItems: "center", gap: 5,
  padding: "0.46rem 0.9rem", fontSize: "0.86rem", fontWeight: 700,
  color: active ? "#fff" : "#6366f1",
  borderRadius: 999, whiteSpace: "nowrap", cursor: "pointer",
  fontFamily: "inherit",
  background: active ? "linear-gradient(120deg,#6366f1,#818cf8)" : "rgba(99,102,241,.10)",
  border: `1.5px solid ${active ? "transparent" : "rgba(99,102,241,.28)"}`,
  boxShadow: active ? "0 6px 16px -6px rgba(99,102,241,.7)" : "none",
  transition: "all .2s",
});

const navFeatureStyle = {
  display: "flex", alignItems: "center", gap: 5,
  padding: "0.45rem 0.85rem", fontSize: "0.86rem", fontWeight: 700,
  color: "#fff", borderRadius: 999, whiteSpace: "nowrap", cursor: "pointer",
  border: "none",
  background: "linear-gradient(120deg, #F47B20 0%, #f97316 40%, #fb923c 60%, #F47B20 100%)",
  backgroundSize: "200% auto",
  boxShadow: "0 6px 16px -6px rgba(244,123,32,.75)",
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