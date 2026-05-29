import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Search, Target, Menu, X,
  BadgeCheck, CalendarDays, FileText, BarChart3, Landmark, Crosshair, Gauge, Heart, GitCompare, Award, ShieldCheck,
  BookOpen, FlaskConical, Sigma, Zap, CalendarClock, Trophy,
} from "lucide-react";
import { useShortlist } from "../context/Shortlist.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

const GATE_TABS = true;

const JEE_RESOURCES = [
  { label: "Mathematics (19 chapters)", to: "/jee-resources?subject=math",     icon: Sigma,        tag: "Algebra · Calculus · Geometry" },
  { label: "Physics (25 chapters)",     to: "/jee-resources?subject=physics",  icon: Zap,          tag: "Mechanics · Electrodynamics" },
  { label: "Chemistry (29 chapters)",   to: "/jee-resources?subject=chemistry",icon: FlaskConical, tag: "Physical · Organic · Inorganic" },
  { label: "Exam Cycle 2025–26",        to: "/#exam-cycle",                    icon: CalendarClock,tag: "All exams · Dates · Fees" },
  { label: "JEE Main Guide",            to: "/jee-main",                        icon: FileText,     tag: "Pattern · Eligibility · Cutoffs" },
  { label: "JEE Advanced Guide",        to: "/jee-advanced",                    icon: Trophy,       tag: "IIT admission · Strategy" },
];

const JEE_MAIN = [
  { label: "Eligibility Criteria", to: "/jee-main#eligibility", icon: BadgeCheck },
  { label: "Exam Pattern & Schedule", to: "/exams/jee-main", icon: CalendarDays },
  { label: "Shift-wise Papers & Keys", to: "/jee-main#papers", icon: FileText },
  { label: "Result & Rank Analysis", to: "/jee-main#analysis", icon: BarChart3 },
  { label: "NIT Rankings (NIRF)", to: "/jee-main#nit-rankings", icon: Landmark },
  { label: "JEE Main College Predictor", to: "/jee-main#college", icon: Crosshair },
  { label: "JEE Main Rank Predictor", to: "/jee-main#rank", icon: Gauge },
];
const JEE_ADV = [
  { label: "Eligibility Criteria", to: "/jee-advanced#eligibility", icon: BadgeCheck },
  { label: "Exam Pattern & Schedule", to: "/exams/jee-advanced", icon: CalendarDays },
  { label: "Paper 1 & Paper 2 Analysis", to: "/jee-advanced#analysis", icon: BarChart3 },
  { label: "IIT Rankings (NIRF)", to: "/jee-advanced#iit-rankings", icon: Landmark },
  { label: "JEE Advanced College Predictor", to: "/jee-advanced#college", icon: Crosshair },
  { label: "JEE Advanced Rank Predictor", to: "/jee-advanced#rank", icon: Gauge },
];
const COLLEGES = [
  { label: "Explore IITs", to: "/colleges?type=IIT", icon: Landmark },
  { label: "Explore NITs", to: "/colleges?type=NIT", icon: Landmark },
  { label: "Explore IIITs", to: "/colleges?type=IIIT", icon: Landmark },
  { label: "Private Universities", to: "/#private", icon: BadgeCheck },
  { label: "State-wise Colleges", to: "/colleges", icon: BadgeCheck },
];

const TOOLS = [
  { label: "JoSAA 2026 Counselling", to: "/josaa-2026", icon: Award },
  { label: "Colleges For You", to: "/for-you", icon: Gauge },
  { label: "Counselling Planner", to: "/planner", icon: CalendarDays },
  { label: "Compare Colleges", to: "/compare", icon: GitCompare },
  { label: "Compare Exams", to: "/compare-exams", icon: BarChart3 },
  { label: "College Map", to: "/map", icon: Landmark },
  { label: "Scholarships & Loans", to: "/scholarships", icon: BadgeCheck },
  { label: "Admin Data", to: "/admin", icon: ShieldCheck },
];

export default function Navbar({ onSearch }) {
  const { saved, compare } = useShortlist();
  const { isLoggedIn, user, openLogin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const navItems = [
    { label: "Home", to: "/" },
    { label: "JEE", drop: JEE_RESOURCES, base: "/jee-resources", highlight: true },
    { label: "JEE Main", drop: JEE_MAIN, base: "/jee-main" },
    { label: "JEE Advanced", drop: JEE_ADV, base: "/jee-advanced" },
    { label: "Colleges", drop: COLLEGES, base: "/colleges" },
    { label: "Exams", to: "/exams" },
    { label: "Cutoffs", to: "/cutoffs" },
    { label: "Tools", drop: TOOLS, base: "/for-you" },
  ];

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
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
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
          <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-0.01em" }}>
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
            <span style={{ color: "#F47B20", fontWeight: 700 }}>.in</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul style={{ display: "flex", alignItems: "center", gap: 2 }} className="desktop-nav">
          {navItems.map((item) => (
            <li
              key={item.label}
              style={{ position: "relative" }}
              onMouseEnter={() => item.drop && setOpen(item.label)}
              onMouseLeave={() => setOpen(null)}
            >
              {item.drop ? (
                <>
                  <button
                    onClick={() => (GATE_TABS && !isLoggedIn ? openLogin() : navigate(item.base))}
                    style={item.highlight ? navHighlightStyle(open === item.label) : navLinkStyle(open === item.label)}
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
                          minWidth: item.highlight ? 300 : 252, padding: 8, border: "1px solid var(--border)",
                        }}
                      >
                        {item.highlight && (
                          <div style={{ padding: "8px 10px 6px", fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                            JEE Prep Resources
                          </div>
                        )}
                        {item.drop.map((d) => {
                          const Ic = d.icon;
                          return (
                            <button key={d.label} onClick={() => goHash(d.to)} style={d.tag ? { ...dropItemStyle, flexDirection: "column", alignItems: "flex-start", gap: 1 } : dropItemStyle}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Ic size={15} color={item.highlight ? "#6366f1" : "var(--coral)"} />
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
              ) : (
                <button onClick={() => goHash(item.to)} style={navLinkStyle(false)}>
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={onSearch} aria-label="Search" style={{ width: 40, height: 40, borderRadius: 10, display: "grid", placeItems: "center", background: "var(--sky)", color: "var(--navy)" }}>
            <Search size={18} />
          </button>
          <Link to="/compare" aria-label="Compare colleges" title="Compare" style={{ position: "relative", width: 40, height: 40, borderRadius: 10, display: "grid", placeItems: "center", background: "var(--sky)", color: "var(--navy)" }}>
            <GitCompare size={18} />
            {compare.length > 0 && (
              <span style={{ position: "absolute", top: -4, right: -4, minWidth: 17, height: 17, padding: "0 4px", borderRadius: 999, background: "var(--teal)", color: "#fff", fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center" }}>
                {compare.length}
              </span>
            )}
          </Link>
          <Link to="/shortlist" aria-label="My colleges" title="My Colleges" style={{ position: "relative", width: 40, height: 40, borderRadius: 10, display: "grid", placeItems: "center", background: "var(--sky)", color: "var(--coral)" }}>
            <Heart size={18} fill={saved.length ? "var(--coral)" : "none"} />
            {saved.length > 0 && (
              <span style={{ position: "absolute", top: -4, right: -4, minWidth: 17, height: 17, padding: "0 4px", borderRadius: 999, background: "var(--coral)", color: "#fff", fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center" }}>
                {saved.length}
              </span>
            )}
          </Link>
          <button className="btn btn-coral cta-desktop" onClick={() => goHash("/jee-main#college")}>
            <Target size={16} /> Predict My College
          </button>
          {isLoggedIn ? (
            <button
              onClick={logout}
              title={user?.name || user?.phone || "Account"}
              className="cta-desktop"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1.5px solid var(--line)", background: "#fff", color: "var(--navy)", fontWeight: 700, cursor: "pointer" }}
            >
              <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#F47B20", color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800 }}>
                {(user?.name || user?.phone || "U").charAt(0).toUpperCase()}
              </span>
              Logout
            </button>
          ) : (
            <button
              onClick={openLogin}
              className="cta-desktop"
              style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: "#F47B20", color: "#fff", fontWeight: 700, cursor: "pointer" }}
            >
              Login
            </button>
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
                  <span style={{ fontFamily: "Sora", fontWeight: 800 }}>Menu</span>
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
                <div key={item.label} style={{ borderBottom: "1px solid var(--gray-light)", padding: "0.5rem 0" }}>
                  <button
                    onClick={() => goHash(item.to || item.base)}
                    style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem", padding: "0.4rem 0" }}
                  >
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
                </div>
              ))}

              <button
                className="btn btn-coral full mt-3"
                style={{ justifyContent: "center" }}
                onClick={() => goHash("/jee-main#college")}
              >
                <Target size={16} /> Predict My College
              </button>

              {isLoggedIn ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
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
                <button
                  onClick={() => { setMobileOpen(false); openLogin(); }}
                  style={{
                    width: "100%", marginTop: 12, padding: "13px 16px",
                    borderRadius: 10, border: "none",
                    background: "#F47B20", color: "#fff",
                    fontWeight: 700, cursor: "pointer", fontSize: "0.95rem",
                  }}
                >
                  Login
                </button>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

const navLinkStyle = (active) => ({
  display: "flex", alignItems: "center", gap: 4,
  padding: "0.5rem 0.7rem", fontSize: "0.88rem", fontWeight: 500,
  color: active ? "var(--coral)" : "var(--navy)", borderRadius: 8,
  background: active ? "var(--sky)" : "transparent", transition: "all .2s", whiteSpace: "nowrap",
});

const navHighlightStyle = (active) => ({
  display: "flex", alignItems: "center", gap: 5,
  padding: "0.45rem 0.8rem", fontSize: "0.86rem", fontWeight: 700,
  color: active ? "#fff" : "#6366f1",
  borderRadius: 8, whiteSpace: "nowrap",
  background: active ? "#6366f1" : "rgba(99,102,241,.10)",
  border: `1.5px solid ${active ? "#6366f1" : "rgba(99,102,241,.25)"}`,
  transition: "all .2s",
});

const dropItemStyle = {
  display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
  padding: "0.6rem 0.8rem", borderRadius: 9, fontSize: "0.85rem", color: "var(--navy)",
};