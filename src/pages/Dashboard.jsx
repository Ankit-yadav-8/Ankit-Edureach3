import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import {
  User, Mail, Phone, MapPin, GraduationCap, Hash, Calendar, LogOut, Bell,
  CheckCircle2, ArrowRight, Sparkles, ShieldCheck, BookOpen, Loader2,
  Check, Compass, Pencil, X, LayoutDashboard, Users, HelpCircle, Settings, Rocket,
  Clock, Video, ClipboardList, FileText, BarChart3, UserCheck, Award, Wallet,
  MessageCircle, NotebookPen, TrendingUp, Zap, Target, Flame, Medal, Trophy,
  Star, Lock, CreditCard,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";
import { apiMyEnrollments, apiUpdateProfile } from "../auth/api.js";

const ORANGE = "#FF693D";
const GOLD = "#FF693D";
const GREEN = "#15a06e";
const NAVY = "#0d1b3e";
const INDIGO = "#6366f1";
const TEAL = "#0ea5a4";

/* hex → rgba helper for translucent accent washes (matches home bento cards) */
const tint = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const CARD_SHADOW = "0 5px 22px rgba(33,29,46,.06)";
const CARD_LINE = "rgba(33,29,46,.08)";

const isMentorshipPlan = (key) => String(key || "").startsWith("mentor-");

// Look up the accent palette for an owned plan key.
const groupForPlan = (key) =>
  isMentorshipPlan(key)
    ? { accent: ORANGE, soft: "#fff6ee", icon: GraduationCap }
    : { accent: GREEN, soft: "#f0faf4", icon: Compass };

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

// Deterministic 30–90% "progress" from a stable string (UI scaffold until a
// real progress endpoint exists) — keeps each plan's bar consistent per render.
const pseudoProgress = (seed) => {
  const s = String(seed || "x");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return 30 + (h % 61);
};

/* ── Demo learning data — UI scaffold for the activity widgets. Mirrors the
      design mockup; wire to real progress endpoints when the backend exists. ── */
const PERF_DATA = [
  { d: "1 May",  score: 55, acc: 60 },
  { d: "6 May",  score: 62, acc: 68 },
  { d: "11 May", score: 58, acc: 72 },
  { d: "16 May", score: 70, acc: 75 },
  { d: "22 May", score: 74, acc: 80 },
  { d: "26 May", score: 80, acc: 84 },
  { d: "31 May", score: 85, acc: 88 },
];

const LIVE_SESSIONS = [
  { day: "19", mon: "MAY", subject: "Physics",     topic: "Current Electricity", time: "07:00 PM – 08:30 PM", tutor: "Rahul Sir",  color: INDIGO,  status: "Live in 2h", live: true },
  { day: "20", mon: "MAY", subject: "Mathematics", topic: "Quadratic Equations", time: "06:00 PM – 07:30 PM", tutor: "Aman Sir",   color: ORANGE,  status: "Upcoming",   live: false },
  { day: "22", mon: "MAY", subject: "Chemistry",   topic: "Chemical Bonding",    time: "07:00 PM – 08:30 PM", tutor: "Neha Ma'am", color: TEAL,    status: "Upcoming",   live: false },
];

const QUICK_ACTIONS = [
  { label: "Take a Test",    icon: FileText,      color: INDIGO,    to: "/jee-resources" },
  { label: "View Notes",     icon: NotebookPen,   color: GREEN,     to: "/jee-resources" },
  { label: "Ask Doubt",      icon: MessageCircle, color: "#8b5cf6", to: "/ai" },
  { label: "Study Material", icon: BookOpen,      color: ORANGE,    to: "/jee-resources" },
  { label: "My Schedule",    icon: Calendar,      color: "#ef4444", to: "/planner" },
];

const ACHIEVEMENTS = [
  { label: "Consistency Master", desc: "Study 10 days in a row",   icon: Flame,  color: "#f59e0b", unlocked: true },
  { label: "Test Champion",      desc: "Attempt 15 tests a month", icon: Medal,  color: INDIGO,    unlocked: true },
  { label: "Accuracy Star",      desc: "Score 80%+ in 5 tests",    icon: Star,   color: GREEN,     unlocked: true },
  { label: "Rank Booster",       desc: "Improve rank by 1000+",    icon: TrendingUp, color: "#8b5cf6", unlocked: false },
];

const sectionTitle = {
  fontFamily: "Sora", fontWeight: 800, fontSize: "0.98rem", color: NAVY,
  margin: 0, display: "flex", alignItems: "center", gap: 7,
};

/* ── A labelled input used inside the Edit-info modal ─────────────── */
function LabeledInput({ label, value, onChange, type = "text", placeholder, inputMode, disabled }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#6b7280" }}>{label}</span>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} inputMode={inputMode} disabled={disabled}
        style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e5e7eb", fontSize: 14, color: NAVY, outline: "none", boxSizing: "border-box", background: disabled ? "#f9fafb" : "#fff" }}
        onFocus={(e) => { e.target.style.borderColor = ORANGE; }}
        onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
    </label>
  );
}

/* ── Edit profile modal — name / email / phone (+ more) ───────────── */
function EditInfoModal({ user, token, onClose, onSaved }) {
  const [f, setF] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    coaching: user?.coaching || "",
    homeState: user?.homeState || "",
    jeeMainsRank: user?.jeeMainsRank ?? "",
    jeeAdvancedRank: user?.jeeAdvancedRank ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => { setF((s) => ({ ...s, [k]: e.target.value })); setErr(""); };

  async function save() {
    setErr("");
    if (!f.name.trim()) return setErr("Name cannot be empty");
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return setErr("Enter a valid email address");
    if (!/^\d{10}$/.test(f.phone.replace(/\D/g, "").slice(-10))) return setErr("Enter a valid 10-digit phone number");
    setBusy(true);
    try {
      const { user: updated } = await apiUpdateProfile(token, {
        name: f.name.trim(),
        email: f.email.trim().toLowerCase(),
        phone: f.phone.replace(/\D/g, "").slice(-10),
        coaching: f.coaching.trim(),
        homeState: f.homeState.trim(),
        jeeMainsRank: f.jeeMainsRank === "" ? null : Number(f.jeeMainsRank),
        jeeAdvancedRank: f.jeeAdvancedRank === "" ? null : Number(f.jeeAdvancedRank),
      });
      onSaved(updated);
      onClose();
    } catch (e) {
      setErr(e.message || "Could not save. Please try again.");
    } finally { setBusy(false); }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .18 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 4000, background: "rgba(13,27,62,.55)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", display: "grid", placeItems: "center", padding: 16, overflowY: "auto" }}>
      <motion.div initial={{ opacity: 0, scale: .94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .95, y: 12 }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }} onMouseDown={(e) => e.stopPropagation()}
        style={{ width: "min(560px,100%)", background: "#fff", borderRadius: 22, boxShadow: "0 30px 80px rgba(13,27,62,.4)", overflow: "hidden", margin: "auto" }}>

        {/* header */}
        <div style={{ background: `linear-gradient(135deg, ${NAVY}, #14264f)`, color: "#fff", padding: "22px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -10, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(255, 105, 61,.35), transparent 70%)" }} />
          <button onClick={onClose} disabled={busy} aria-label="Close"
            style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.16)", color: "#fff", cursor: busy ? "not-allowed" : "pointer", display: "grid", placeItems: "center" }}>
            <X size={17} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 11, position: "relative" }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(255,255,255,.14)", display: "grid", placeItems: "center" }}>
              <Pencil size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.25rem", margin: 0 }}>Edit your information</h3>
              <div style={{ fontSize: 12.5, opacity: .8, marginTop: 2 }}>Used to auto-fill your details at checkout.</div>
            </div>
          </div>
        </div>

        {/* body */}
        <div style={{ padding: "22px 24px 24px" }}>
          {err && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "10px 12px", borderRadius: 10, fontSize: 13.5, marginBottom: 14, fontWeight: 600 }}>{err}</div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <LabeledInput label="Full name" value={f.name} onChange={set("name")} placeholder="Your name" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <LabeledInput label="Email" type="email" value={f.email} onChange={set("email")} placeholder="you@email.com" />
              <LabeledInput label="Mobile number" type="tel" inputMode="numeric" value={f.phone} onChange={set("phone")} placeholder="10-digit mobile" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <LabeledInput label="Coaching" value={f.coaching} onChange={set("coaching")} placeholder="Your coaching" />
              <LabeledInput label="Home state" value={f.homeState} onChange={set("homeState")} placeholder="Home state" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <LabeledInput label="JEE Main rank" inputMode="numeric" value={f.jeeMainsRank} onChange={set("jeeMainsRank")} placeholder="Optional" />
              <LabeledInput label="JEE Advanced rank" inputMode="numeric" value={f.jeeAdvancedRank} onChange={set("jeeAdvancedRank")} placeholder="Optional" />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <button onClick={onClose} disabled={busy} style={{ flex: 1, padding: "13px 0", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", color: NAVY, fontWeight: 700, fontFamily: "Sora", cursor: busy ? "not-allowed" : "pointer" }}>Cancel</button>
            <button onClick={save} disabled={busy}
              style={{ flex: 1.4, padding: "13px 0", borderRadius: 12, border: "none", background: busy ? "#f9a25e" : `linear-gradient(135deg, ${ORANGE}, ${GOLD})`, color: "#fff", fontWeight: 800, fontFamily: "Sora", cursor: busy ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 10px 24px -10px ${ORANGE}` }}>
              {busy ? <><Loader2 size={17} className="dash-spin" /> Saving…</> : <><Check size={17} strokeWidth={3} /> Save changes</>}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── A reusable section panel — white card with title + optional action ── */
function Panel({ id, title, icon: Icon, iconColor = ORANGE, action, children, style }) {
  return (
    <section id={id} style={{ background: "#fff", border: `1px solid ${CARD_LINE}`, borderRadius: 16, boxShadow: CARD_SHADOW, padding: "14px 16px", ...style }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
          <h2 style={sectionTitle}>{Icon && <Icon size={16} color={iconColor} />} {title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/* ── Compact top stat card — small icon, value, label ── */
function StatCard({ icon: Icon, value, unit, label, color }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${CARD_LINE}`, borderRadius: 14, boxShadow: CARD_SHADOW, padding: "12px 13px", display: "flex", flexDirection: "column", gap: 7, minWidth: 0 }}>
      <span style={{ width: 32, height: 32, borderRadius: 9, background: tint(color, 0.12), display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Icon size={16} color={color} />
      </span>
      <div>
        <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 19, color: NAVY, lineHeight: 1.05 }}>
          {value}{unit && <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", marginLeft: 3 }}>{unit}</span>}
        </div>
        <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}

/* ── Mini sparkline (inline SVG) for the performance side-stats ── */
function Sparkline({ points, color }) {
  const w = 120, h = 30, max = Math.max(...points), min = Math.min(...points);
  const span = max - min || 1;
  const step = w / (points.length - 1);
  const d = points.map((p, i) => `${i ? "L" : "M"}${(i * step).toFixed(1)},${(h - ((p - min) / span) * h).toFixed(1)}`).join(" ");
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Right-aligned "View all" link used in section headers ── */
const ViewAll = ({ onClick }) => (
  <button onClick={onClick} style={{ background: "transparent", border: "none", color: ORANGE, fontFamily: "Sora", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3 }}>
    View all <ArrowRight size={13} />
  </button>
);

export default function Dashboard() {
  const { user, token, isLoggedIn, logout, openLogin, updateUser } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = "My Dashboard · College Parichay";
    return () => { document.title = prev; };
  }, []);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    let alive = true;
    apiMyEnrollments(token)
      .then((d) => { if (alive) setPlans(d.enrollments || []); })
      .catch(() => { if (alive) setPlans([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [token]);

  // Guest fallback (AuthGate normally opens the login modal before this shows).
  if (!isLoggedIn) {
    return (
      <section style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "120px 16px 60px" }}>
        <div style={{ textAlign: "center", maxWidth: 380 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: `${ORANGE}15`, display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
            <ShieldCheck size={30} color={ORANGE} />
          </div>
          <h2 style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: "1.5rem", margin: "0 0 8px" }}>Please log in</h2>
          <p style={{ color: "#6b7280", marginBottom: 18 }}>Log in to view your dashboard, profile and purchased plans.</p>
          <button onClick={openLogin} style={{ background: ORANGE, color: "#fff", border: "none", padding: "12px 22px", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Sora" }}>
            Log in
          </button>
        </div>
      </section>
    );
  }

  const firstName = (user?.name || "").trim().split(" ")[0] || "Student";

  // Profile detail rows — one compact card, 3-col grid (matches mockup).
  const details = [
    { label: "Full Name",         value: user?.name || "Student",        icon: User },
    { label: "Email",             value: user?.email || "—",             icon: Mail },
    { label: "Phone",             value: user?.phone || "—",             icon: Phone },
    { label: "Coaching",          value: user?.coaching || "—",          icon: GraduationCap },
    { label: "Home State",        value: user?.homeState || "—",         icon: MapPin },
    { label: "JEE Main Rank",     value: user?.jeeMainsRank ?? "—",      icon: Hash },
    { label: "JEE Advanced Rank", value: user?.jeeAdvancedRank ?? "—",   icon: Hash },
    { label: "Member Since",      value: fmtDate(user?.createdAt),       icon: Calendar },
  ];

  const hasAnyPlan = plans.length > 0;

  // Top metrics — "Courses" maps to real enrollments; the rest are UI scaffold.
  const stats = [
    { icon: Flame,    value: "12",   unit: "days",  label: "Learning Streak", color: ORANGE },
    { icon: Clock,    value: "48.5", unit: "hrs",   label: "Study Hours",     color: INDIGO },
    { icon: FileText, value: "18",   unit: "tests", label: "Tests Attempted", color: TEAL },
    { icon: Target,   value: "82",   unit: "%",     label: "Accuracy",        color: GREEN },
    { icon: Zap,      value: "+620", unit: "",      label: "Reward Points",   color: "#f59e0b" },
  ];

  const goTo = (to) => {
    if (!to) return;
    if (to.startsWith("#")) document.getElementById(to.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
    else navigate(to);
  };

  const navItems = [
    { label: "Dashboard",      icon: LayoutDashboard, to: "#top", active: true },
    { label: "My Plans",       icon: CreditCard,      to: "#enrolled-plans" },
    { label: "Live Sessions",  icon: Video,           to: "#live-sessions", badge: 3 },
    { label: "Assignments",    icon: ClipboardList,   to: "/mentorship-dashboard", badge: 2 },
    { label: "Test Series",    icon: FileText,        to: "/jee-resources" },
    { label: "Performance",    icon: BarChart3,       to: "#performance" },
    { label: "Mentor Connect", icon: UserCheck,       to: "/mentorship-dashboard" },
    { label: "Resource Center",icon: BookOpen,        to: "/jee-resources" },
    { label: "Community",      icon: Users,           to: "/community" },
    { label: "Certificates",   icon: Award,           to: "#achievements" },
  ];

  return (
    <section id="top" style={{ background: "#f4f5f9", minHeight: "100vh", padding: "100px 0 60px" }}>
      <div className="dash-shell" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 18px" }}>

        {/* ── Left sidebar ── */}
        <aside className="dash-side">
          <div style={{ background: "#fff", border: `1px solid ${CARD_LINE}`, borderRadius: 18, boxShadow: CARD_SHADOW, padding: "20px 12px 14px", display: "flex", flexDirection: "column", gap: 2 }}>
            {/* identity */}
            <div style={{ textAlign: "center", padding: "0 6px 14px", borderBottom: `1px solid ${CARD_LINE}`, marginBottom: 10 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${ORANGE}, ${GOLD})`, color: "#fff", display: "grid", placeItems: "center", fontSize: 23, fontWeight: 800, fontFamily: "Sora", margin: "0 auto 10px", boxShadow: `0 10px 24px -10px ${ORANGE}` }}>
                {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
              </div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 14.5, color: NAVY }}>{user?.name || "Student"}</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</div>
            </div>

            {/* nav */}
            {navItems.map(({ label, icon: Icon, to, active, badge }) => (
              <button key={label} onClick={() => goTo(to)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                  padding: "8.5px 11px", borderRadius: 10, cursor: "pointer", fontFamily: "Sora",
                  fontWeight: active ? 800 : 600, fontSize: 13,
                  border: "1px solid transparent",
                  background: active ? tint(ORANGE, 0.1) : "transparent",
                  color: active ? ORANGE : "#475067",
                  transition: "background .15s, color .15s",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#f4f5f9"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                <Icon size={16} color={active ? ORANGE : "#94a3b8"} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge && <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", background: ORANGE, borderRadius: 50, minWidth: 17, height: 17, display: "grid", placeItems: "center", padding: "0 5px" }}>{badge}</span>}
              </button>
            ))}

            {/* footer actions */}
            <div style={{ borderTop: `1px solid ${CARD_LINE}`, marginTop: 10, paddingTop: 10, display: "flex", flexDirection: "column", gap: 2 }}>
              <button onClick={() => navigate("/mentorship")}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", padding: "8.5px 11px", borderRadius: 10, cursor: "pointer", fontFamily: "Sora", fontWeight: 600, fontSize: 13, border: "1px solid transparent", background: "transparent", color: "#475067" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f5f9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                <Wallet size={16} color="#94a3b8" /> <span style={{ flex: 1 }}>Wallet</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: GREEN, background: tint(GREEN, 0.12), borderRadius: 50, padding: "2px 7px" }}>₹1</span>
              </button>
              <button onClick={() => setEditOpen(true)}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", padding: "8.5px 11px", borderRadius: 10, cursor: "pointer", fontFamily: "Sora", fontWeight: 600, fontSize: 13, border: "1px solid transparent", background: "transparent", color: "#475067" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f5f9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                <Settings size={16} color="#94a3b8" /> Settings
              </button>
              <button onClick={() => navigate("/how-to-use")}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", padding: "8.5px 11px", borderRadius: 10, cursor: "pointer", fontFamily: "Sora", fontWeight: 600, fontSize: 13, border: "1px solid transparent", background: "transparent", color: "#475067" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f5f9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                <HelpCircle size={16} color="#94a3b8" /> Help Center
              </button>
              <button onClick={() => setConfirmLogout(true)}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", padding: "8.5px 11px", borderRadius: 10, cursor: "pointer", fontFamily: "Sora", fontWeight: 600, fontSize: 13, border: "1px solid transparent", background: "transparent", color: "#e5484d" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                <LogOut size={16} color="#e5484d" /> Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="dash-main" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Welcome header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.2rem,3vw,1.55rem)", color: NAVY, margin: 0, fontStyle: "normal" }}>
                Welcome back, {firstName}! 👋
              </h1>
              <p style={{ color: "#6b7280", margin: "4px 0 0", fontSize: 13 }}>Keep learning, keep growing</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button aria-label="Notifications"
                style={{ position: "relative", width: 38, height: 38, borderRadius: 11, border: `1px solid ${CARD_LINE}`, background: "#fff", cursor: "pointer", display: "grid", placeItems: "center" }}>
                <Bell size={17} color="#475067" />
                <span style={{ position: "absolute", top: 9, right: 9, width: 7, height: 7, borderRadius: "50%", background: ORANGE, border: "1.5px solid #fff" }} />
              </button>
              <button onClick={() => setEditOpen(true)}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: `1.5px solid ${ORANGE}`, color: ORANGE, padding: "9px 16px", borderRadius: 11, fontWeight: 800, fontFamily: "Sora", fontSize: 13, cursor: "pointer" }}>
                <Pencil size={14} /> Edit Profile
              </button>
            </div>
          </div>

          {/* Profile details — ONE compact card, 3-col grid */}
          <div style={{ background: "#fff", border: `1px solid ${CARD_LINE}`, borderRadius: 16, boxShadow: CARD_SHADOW, padding: "16px 18px" }}>
            <div className="dash-info">
              {details.map(({ label, value, icon: Icon }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <span style={{ width: 32, height: 32, borderRadius: 9, background: tint(ORANGE, 0.1), display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Icon size={15} color={ORANGE} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</div>
                    <div style={{ fontSize: 13, color: NAVY, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="dash-stats">
            {stats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>

          {/* Enrolled plans + Upcoming live sessions */}
          <div className="dash-two">
            <Panel id="enrolled-plans" title="Your enrolled plans" icon={CheckCircle2} iconColor={GREEN}
              action={<ViewAll onClick={() => navigate("/mentorship")} />}>
              {loading ? (
                <div style={{ padding: "24px", textAlign: "center", color: "#9ca3af" }}><Loader2 size={20} className="dash-spin" /> Loading…</div>
              ) : !hasAnyPlan ? (
                <div style={{ border: "1px dashed #e5b894", borderRadius: 13, padding: "24px 18px", textAlign: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: `${ORANGE}12`, display: "grid", placeItems: "center", margin: "0 auto 10px" }}>
                    <Sparkles size={20} color={ORANGE} />
                  </div>
                  <div style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: 14, marginBottom: 4 }}>No active plans yet</div>
                  <div style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 12 }}>Pick a mentorship or counselling plan to get started.</div>
                  <button onClick={() => navigate("/mentorship")} style={{ background: `linear-gradient(135deg, ${ORANGE}, ${GOLD})`, color: "#fff", border: "none", padding: "9px 16px", borderRadius: 10, fontWeight: 800, fontFamily: "Sora", fontSize: 13, cursor: "pointer" }}>Explore plans</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {plans.map((p, i) => {
                    const g = groupForPlan(p.plan);
                    const Icon = g.icon;
                    const mentor = isMentorshipPlan(p.plan);
                    const prog = pseudoProgress(p._id || p.plan);
                    return (
                      <div key={p._id} style={{ padding: "13px 0", borderTop: i ? `1px solid ${CARD_LINE}` : "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 11, flexWrap: "wrap" }}>
                          <div style={{ width: 38, height: 38, borderRadius: 11, background: tint(g.accent, 0.1), display: "grid", placeItems: "center", flexShrink: 0 }}>
                            <Icon size={18} color={g.accent} />
                          </div>
                          <div style={{ flex: 1, minWidth: 140 }}>
                            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13.5, color: NAVY }}>{p.planLabel || p.plan}</div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>Purchased {fmtDate(p.createdAt)}{p.razorpayPaymentId ? ` · ${p.razorpayPaymentId}` : ""}</div>
                          </div>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 800, color: "#15803d", background: "#dcfce7", borderRadius: 20, padding: "4px 9px" }}>
                            <CheckCircle2 size={12} /> Active
                          </span>
                          {mentor && (
                            <button onClick={() => navigate(`/mentorship-dashboard?plan=${encodeURIComponent(p.plan)}`)}
                              style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 10, border: `1.5px solid ${g.accent}55`, background: "#fff", color: g.accent, fontFamily: "Sora", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                              Open dashboard <ArrowRight size={13} />
                            </button>
                          )}
                        </div>
                        {/* progress */}
                        <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 9 }}>
                          <span style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 700 }}>Progress</span>
                          <div style={{ flex: 1, height: 6, borderRadius: 50, background: "#eef0f5", overflow: "hidden" }}>
                            <div style={{ width: `${prog}%`, height: "100%", borderRadius: 50, background: `linear-gradient(90deg, ${g.accent}, ${tint(g.accent, 0.7)})` }} />
                          </div>
                          <span style={{ fontSize: 11.5, color: NAVY, fontWeight: 800 }}>{prog}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Panel>

            <Panel id="live-sessions" title="Upcoming live sessions" icon={Video} iconColor={INDIGO}
              action={<ViewAll onClick={() => navigate("/mentorship-dashboard")} />}>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {LIVE_SESSIONS.map((s) => (
                  <div key={s.subject + s.topic} style={{ display: "flex", alignItems: "center", gap: 11, border: `1px solid ${CARD_LINE}`, borderRadius: 12, padding: "9px 11px" }}>
                    <div style={{ width: 40, textAlign: "center", flexShrink: 0 }}>
                      <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 17, color: s.color, lineHeight: 1 }}>{s.day}</div>
                      <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 700, letterSpacing: ".05em" }}>{s.mon}</div>
                    </div>
                    <div style={{ width: 1, alignSelf: "stretch", background: CARD_LINE }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 12.5, color: NAVY }}>{s.subject}: {s.topic}</div>
                      <div style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 2, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Clock size={10} /> {s.time}</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><User size={10} /> {s.tutor}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".03em", flexShrink: 0, color: s.live ? "#fff" : s.color, background: s.live ? "#ef4444" : tint(s.color, 0.13), borderRadius: 50, padding: "4px 9px" }}>{s.status}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* Performance overview + Quick actions / Achievements */}
          <div className="dash-perf">
            <Panel id="performance" title="Performance overview" icon={BarChart3} iconColor={ORANGE}
              action={<span style={{ fontSize: 11.5, fontWeight: 700, color: "#475067", border: `1px solid ${CARD_LINE}`, borderRadius: 8, padding: "4px 10px" }}>This Month</span>}>
              <div className="dash-perf-inner">
                <div style={{ minWidth: 0 }}>
                  <div style={{ width: "100%", height: 196 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={PERF_DATA} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(33,29,46,.06)" vertical={false} />
                        <XAxis dataKey="d" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${CARD_LINE}`, boxShadow: CARD_SHADOW, fontFamily: "Sora", fontSize: 12 }} formatter={(v, n) => [`${v}%`, n === "score" ? "Score" : "Accuracy"]} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontFamily: "Sora", fontWeight: 700 }} formatter={(v) => v === "score" ? "Score" : "Accuracy"} />
                        <Line type="monotone" dataKey="score" stroke={INDIGO} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                        <Line type="monotone" dataKey="acc" stroke={GREEN} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Average Score",    value: "72%", color: INDIGO, pts: [55, 62, 58, 70, 74, 80, 85] },
                    { label: "Average Accuracy", value: "82%", color: GREEN,  pts: [60, 68, 72, 75, 80, 84, 88] },
                    { label: "Total Tests",      value: "18",  color: ORANGE, pts: [4, 6, 5, 9, 12, 15, 18] },
                  ].map((b) => (
                    <div key={b.label} style={{ border: `1px solid ${CARD_LINE}`, borderRadius: 12, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700 }}>{b.label}</div>
                      <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 20, color: NAVY, margin: "1px 0 4px" }}>{b.value}</div>
                      <Sparkline points={b.pts} color={b.color} />
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
              <Panel title="Quick actions" icon={Zap} iconColor="#f59e0b">
                <div className="dash-quick">
                  {QUICK_ACTIONS.map(({ label, icon: Icon, color, to }) => (
                    <button key={label} onClick={() => goTo(to)}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: "11px 6px", borderRadius: 12, border: `1px solid ${CARD_LINE}`, background: "#fff", cursor: "pointer", transition: "transform .15s, box-shadow .15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = CARD_SHADOW; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                      <span style={{ width: 38, height: 38, borderRadius: 11, background: tint(color, 0.12), display: "grid", placeItems: "center" }}>
                        <Icon size={18} color={color} />
                      </span>
                      <span style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 11, color: NAVY, textAlign: "center", lineHeight: 1.2 }}>{label}</span>
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel id="achievements" title="Achievements" icon={Trophy} iconColor="#f59e0b"
                action={<ViewAll onClick={() => goTo("#achievements")} />}>
                <div className="dash-badges">
                  {ACHIEVEMENTS.map(({ label, desc, icon: Icon, color, unlocked }) => (
                    <div key={label} title={desc}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "11px 6px", borderRadius: 12, border: `1px solid ${unlocked ? tint(color, 0.3) : CARD_LINE}`, background: unlocked ? tint(color, 0.06) : "#f8f8fb", textAlign: "center", opacity: unlocked ? 1 : 0.7 }}>
                      <span style={{ width: 38, height: 38, borderRadius: "50%", background: unlocked ? tint(color, 0.16) : "#eceef3", display: "grid", placeItems: "center", position: "relative" }}>
                        <Icon size={18} color={unlocked ? color : "#9ca3af"} />
                        {!unlocked && (
                          <span style={{ position: "absolute", bottom: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: "#fff", border: `1px solid ${CARD_LINE}`, display: "grid", placeItems: "center" }}>
                            <Lock size={9} color="#9ca3af" />
                          </span>
                        )}
                      </span>
                      <div>
                        <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 11, color: NAVY, lineHeight: 1.15 }}>{label}</div>
                        <div style={{ fontSize: 9.5, color: "#9ca3af", marginTop: 2, lineHeight: 1.25 }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        </main>
      </div>

      {/* Edit info modal */}
      <AnimatePresence>
        {editOpen && (
          <EditInfoModal user={user} token={token} onClose={() => setEditOpen(false)} onSaved={(u) => updateUser?.(u)} />
        )}
      </AnimatePresence>

      {/* Logout confirmation */}
      <AnimatePresence>
        {confirmLogout && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .18 }}
            onClick={() => setConfirmLogout(false)}
            style={{ position: "fixed", inset: 0, zIndex: 4000, background: "rgba(13,27,62,.55)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", display: "grid", placeItems: "center", padding: 20 }}>
            <motion.div initial={{ opacity: 0, scale: .92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .94, y: 12 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }} onClick={(e) => e.stopPropagation()}
              style={{ width: "min(380px,100%)", background: "#fff", borderRadius: 20, padding: "26px 24px 22px", boxShadow: "0 30px 80px rgba(13,27,62,.4)", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 14px", background: "#FFF1E9", display: "grid", placeItems: "center" }}>
                <LogOut size={26} color={ORANGE} />
              </div>
              <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.25rem", color: NAVY, margin: "0 0 6px" }}>Log out?</h3>
              <p style={{ fontSize: ".95rem", color: "#6b7280", margin: "0 0 20px", lineHeight: 1.5 }}>Are you sure you want to log out of your account?</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setConfirmLogout(false)} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", color: NAVY, fontWeight: 700, cursor: "pointer" }}>No</button>
                <button onClick={() => { logout(); setConfirmLogout(false); navigate("/"); }} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", background: "#e5484d", color: "#fff", fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 18px -6px #e5484d" }}>Yes, log out</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes dashspin{to{transform:rotate(360deg)}}
        .dash-spin{display:inline-block;animation:dashspin .8s linear infinite;vertical-align:middle;margin-right:6px}
        .dash-shell{display:flex;gap:20px;align-items:flex-start}
        .dash-side{width:228px;flex-shrink:0;position:sticky;top:92px}
        .dash-info{display:grid;grid-template-columns:repeat(3,1fr);gap:16px 22px}
        .dash-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
        .dash-two{display:grid;grid-template-columns:1.5fr 1fr;gap:16px;align-items:start}
        .dash-perf{display:grid;grid-template-columns:1.55fr 1fr;gap:16px;align-items:start}
        .dash-perf-inner{display:grid;grid-template-columns:1fr 150px;gap:14px;align-items:start}
        .dash-quick{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
        .dash-badges{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
        @media (max-width:1100px){
          .dash-stats{grid-template-columns:repeat(3,1fr)}
          .dash-perf{grid-template-columns:1fr}
          .dash-perf-inner{grid-template-columns:1fr}
        }
        @media (max-width:900px){
          .dash-shell{flex-direction:column}
          .dash-side{width:100%;position:static;top:auto}
          .dash-two{grid-template-columns:1fr}
        }
        @media (max-width:640px){
          .dash-info{grid-template-columns:1fr 1fr}
          .dash-stats{grid-template-columns:1fr 1fr}
          .dash-quick{grid-template-columns:repeat(3,1fr)}
          .dash-badges{grid-template-columns:repeat(2,1fr)}
        }
        @media (max-width:400px){
          .dash-info{grid-template-columns:1fr}
          .dash-stats{grid-template-columns:1fr 1fr}
        }
      `}</style>
    </section>
  );
}
