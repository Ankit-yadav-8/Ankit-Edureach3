import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, CartesianGrid,
} from "recharts";
import {
  User, Mail, Phone, MapPin, GraduationCap, Hash, Calendar, LogOut,
  CreditCard, CheckCircle2, ArrowRight, Sparkles, ShieldCheck, BookOpen, Loader2,
  Check, Compass, Pencil, X, LayoutDashboard, Users, HelpCircle, Settings, Rocket,
  Clock, Video, ClipboardList, FileText, BarChart3, UserCheck, Award, Crosshair,
  MessageCircle, NotebookPen, PlayCircle, TrendingUp, Zap, Target, Flame, Medal,
  Star, Crown, Lock, Trophy, ChevronRight,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";
import { useEnrol } from "../components/EnrolModal.jsx";
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

const CARD_SHADOW = "0 6px 28px rgba(33,29,46,.07)";
const CARD_LINE = "rgba(33,29,46,.08)";

// Which plan keys belong to which product line (kept in sync with
// server/routes/payment.js PLANS). Mentorship keys all start with "mentor-".
const COUNSELLING_KEYS = ["josaa", "all-colleges"];
const isMentorshipPlan = (key) => String(key || "").startsWith("mentor-");

// Full plan catalogue shown on the dashboard. Prices are display-only — the
// server is the source of truth at checkout. Keys match the EnrolModal/server.
const PLAN_CATALOG = [
  {
    key: "mentorship",
    title: "Mentorship plans",
    subtitle: "1-on-1 IITian / doctor mentorship for JEE & NEET",
    icon: GraduationCap,
    accent: ORANGE, accent2: GOLD, soft: "#fff6ee",
    plans: [
      { key: "mentor-jee-2027",   label: "JEE 2027 Mentorship",         tag: "Class 12 / Droppers",    price: 1, to: "/mentorship/jee-2027" },
      { key: "mentor-neet-2027",  label: "NEET 2027 Mentorship",        tag: "Class 12 / Droppers",    price: 1, to: "/mentorship/jee-2027" },
      { key: "mentor-jee-2028",   label: "JEE 2028 Mentorship (2-Year)",tag: "Class 11 · 2-Year plan", price: 1, to: "/mentorship/jee-2028" },
      { key: "mentor-neet-2028",  label: "NEET 2028 Mentorship (2-Year)",tag: "Class 11 · 2-Year plan", price: 1, to: "/mentorship/jee-2028" },
      { key: "mentor-foundation", label: "Foundation Mentorship",       tag: "Class 9 & 10",           price: 1, to: "/mentorship/foundation" },
    ],
  },
  {
    key: "counselling",
    title: "Counselling plans",
    subtitle: "Expert JoSAA / CSAB choice-filling & college lists",
    icon: Compass,
    accent: GREEN, accent2: "#22c55e", soft: "#f0faf4",
    plans: [
      { key: "josaa",        label: "JoSAA + CSAB 2026 Counselling", tag: "Strong ranks · IITs / NITs / IIITs", price: 299, to: "/josaa-2026" },
      { key: "all-colleges", label: "All Colleges Counselling",      tag: "Any rank · State / Private / Deemed", price: 499, to: "/josaa-2026" },
    ],
  },
];

// Look up the accent palette for an owned plan key.
const groupForPlan = (key) =>
  isMentorshipPlan(key)
    ? { accent: ORANGE, accent2: GOLD, soft: "#fff6ee", icon: GraduationCap }
    : { accent: GREEN, accent2: "#22c55e", soft: "#f0faf4", icon: Compass };

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

// Quick links to the heavy content pages a logged-in student uses most.
const QUICK_LINKS = [
  { label: "JEE Resources",       desc: "Chapter-wise notes & PYQs", to: "/jee-resources",   color: "#6366f1", icon: BookOpen },
  { label: "NEET Prep",           desc: "Biology · Physics · Chem",  to: "/neet",            color: "#0ea5a4", icon: BookOpen },
  { label: "College Predictor",   desc: "Rank → college list",       to: "/jee-main#college", color: "#FF693D", icon: Sparkles },
  { label: "Counselling Planner", desc: "Every JoSAA & CSAB date",   to: "/planner",         color: "#15a06e", icon: Calendar },
];

/* ── Demo learning data — UI scaffold for the activity widgets. These mirror the
      design mockup; wire to real progress endpoints when the backend exists. ── */
const PERF_DATA = [
  { m: "Jan", s: 62 }, { m: "Feb", s: 68 }, { m: "Mar", s: 64 }, { m: "Apr", s: 72 },
  { m: "May", s: 70 }, { m: "Jun", s: 78 }, { m: "Jul", s: 75 }, { m: "Aug", s: 82 },
  { m: "Sep", s: 80 }, { m: "Oct", s: 85 }, { m: "Nov", s: 83 }, { m: "Dec", s: 88 },
];

const LIVE_SESSIONS = [
  { subject: "Physics",     topic: "Current Electricity",   when: "Today · 6:00 PM",     color: INDIGO,  live: true },
  { subject: "Mathematics", topic: "Quadratic Equations",   when: "Tomorrow · 5:00 PM",  color: ORANGE,  live: false },
  { subject: "Chemistry",   topic: "Chemical Bonding",      when: "Wed · 7:00 PM",       color: TEAL,    live: false },
];

const QUICK_ACTIONS = [
  { label: "Take a Test",   icon: FileText,      color: INDIGO,  to: "/jee-resources" },
  { label: "Ask Doubt",     icon: MessageCircle, color: ORANGE,  to: "/ai" },
  { label: "Study Notes",   icon: NotebookPen,   color: TEAL,    to: "/jee-resources" },
  { label: "My Schedule",   icon: Calendar,      color: "#8b5cf6", to: "/planner" },
  { label: "Predict Rank",  icon: Crosshair,     color: GREEN,   to: "/jee-main#rank" },
  { label: "Find Colleges", icon: Compass,       color: "#0ea5e9", to: "/for-you" },
];

const ACHIEVEMENTS = [
  { label: "First Steps",     desc: "Joined College Parichay", icon: Star,     color: ORANGE,  unlocked: true },
  { label: "Test Taker",      desc: "Attempted 10+ tests",     icon: FileText,  color: INDIGO,  unlocked: true },
  { label: "On Fire",         desc: "7-day study streak",      icon: Flame,     color: "#ef4444", unlocked: true },
  { label: "Top Performer",   desc: "80%+ average score",      icon: Trophy,    color: "#f59e0b", unlocked: false },
  { label: "Century",         desc: "Solved 100 doubts",       icon: Medal,     color: TEAL,    unlocked: false },
  { label: "Champion",        desc: "#1 in your batch",        icon: Crown,     color: "#8b5cf6", unlocked: false },
];

const sectionTitle = {
  fontFamily: "Sora", fontWeight: 800, fontSize: "1.1rem", color: NAVY,
  margin: 0, display: "flex", alignItems: "center", gap: 8,
};

/* ── A single catalogue plan tile — styled like the home-page bento cards:
      white surface, soft icon tile, decorative corner wash, hover lift. ─ */
function PlanTile({ plan, group, enrolled, purchase, onEnrol, onView }) {
  const Icon = group.icon;
  const a = group.accent;
  return (
    <motion.div whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      style={{
        background: enrolled ? group.soft : "#fff",
        borderRadius: 16,
        border: enrolled ? `1.5px solid ${a}` : `1px solid ${CARD_LINE}`,
        height: "100%", minHeight: 252, display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden", boxShadow: CARD_SHADOW,
      }}>
      <div style={{ padding: "26px 24px 24px", display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
        {/* header: icon + status badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ width: 50, height: 50, borderRadius: 15, background: tint(a, 0.12), display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Icon size={24} color={a} />
          </span>
          {enrolled ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 800, letterSpacing: ".06em", color: "#0a8f5b", background: "#D8F3E6", borderRadius: 50, padding: "5px 11px" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN }} /> ENROLLED
            </span>
          ) : (
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".06em", color: "#9ca3af", background: "#f1f1f3", borderRadius: 50, padding: "5px 11px" }}>NOT ENROLLED</span>
          )}
        </div>

        <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.12rem", color: NAVY, margin: "0 0 8px", lineHeight: 1.2, letterSpacing: "-0.3px" }}>{plan.label}</h3>
        <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.55, margin: "0 0 16px" }}>{plan.tag}</p>

        {/* price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
          <span style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 27, color: NAVY }}>₹{plan.price.toLocaleString("en-IN")}</span>
          <span style={{ fontSize: 12.5, color: "#9ca3af" }}>one-time</span>
        </div>

        {enrolled && purchase && (
          <div style={{ fontSize: 12, color: a, fontWeight: 700, marginTop: 6 }}>Purchased {fmtDate(purchase.createdAt)}</div>
        )}

        {/* action */}
        {enrolled ? (
          <button onClick={() => onView(plan.to)}
            style={{ marginTop: "auto", width: "100%", padding: "14px", borderRadius: 12, border: `1.5px solid ${a}66`, background: "#fff", color: a, fontFamily: "Sora", fontWeight: 800, fontSize: 14.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            View details <ArrowRight size={16} />
          </button>
        ) : (
          <button onClick={() => onEnrol(plan.key)}
            style={{ marginTop: "auto", width: "100%", padding: "15px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${a}, ${group.accent2})`, color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 14.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 10px 26px -10px ${a}99` }}>
            Enrol now — ₹{plan.price.toLocaleString("en-IN")} <ArrowRight size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

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
    <section id={id} style={{ background: "#fff", border: `1px solid ${CARD_LINE}`, borderRadius: 18, boxShadow: CARD_SHADOW, padding: "20px 22px", ...style }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <h2 style={sectionTitle}>{Icon && <Icon size={18} color={iconColor} />} {title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/* ── Top stat card — icon, value, label and a small trend pill ── */
function StatCard({ icon: Icon, value, label, color, trend }) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
      style={{ background: "#fff", border: `1px solid ${CARD_LINE}`, borderRadius: 16, boxShadow: CARD_SHADOW, padding: "16px 16px 14px", display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ width: 40, height: 40, borderRadius: 12, background: tint(color, 0.12), display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Icon size={20} color={color} />
        </span>
        {trend && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 800, color: GREEN, background: tint(GREEN, 0.1), borderRadius: 50, padding: "3px 8px" }}>
            <TrendingUp size={11} /> {trend}
          </span>
        )}
      </div>
      <div>
        <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 24, color: NAVY, lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, marginTop: 3 }}>{label}</div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user, token, isLoggedIn, logout, openLogin, updateUser } = useAuth();
  const { open: openEnrol } = useEnrol() || {};
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

  // Compact profile chips shown across the top of the main column.
  const profileCards = [
    { label: "Name",         value: user?.name || "Student",      icon: User,          color: ORANGE },
    { label: "Email",        value: user?.email || "—",           icon: Mail,          color: INDIGO },
    { label: "Phone",        value: user?.phone || "—",           icon: Phone,         color: TEAL },
    { label: "Coaching",     value: user?.coaching || "—",        icon: GraduationCap, color: "#8b5cf6" },
    { label: "Home state",   value: user?.homeState || "—",       icon: MapPin,        color: GREEN },
    { label: "Member since", value: fmtDate(user?.createdAt),      icon: Calendar,      color: "#f59e0b" },
  ];

  const enrolledKeys = new Set(plans.map((p) => p.plan));
  const hasAnyPlan = plans.length > 0;

  // Top metrics — "Courses enrolled" is real (from enrollments); the learning
  // activity figures are UI scaffold until the progress backend lands.
  const stats = [
    { icon: BookOpen, value: plans.length, label: "Courses Enrolled", color: ORANGE, trend: plans.length ? `+${plans.length}` : null },
    { icon: Clock,    value: "48.5",       label: "Study Hours",      color: INDIGO,  trend: "+12" },
    { icon: FileText, value: "18",         label: "Tests Attempted",  color: TEAL,    trend: "+5" },
    { icon: Target,   value: "82%",        label: "Avg Score",        color: GREEN,   trend: "+4%" },
    { icon: Zap,      value: "620",        label: "Reward Points",    color: "#f59e0b", trend: "+620" },
  ];

  const goTo = (to) => {
    if (!to) return;
    if (to.startsWith("#")) {
      document.getElementById(to.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(to);
    }
  };

  const navItems = [
    { label: "Dashboard",     icon: LayoutDashboard, to: "#top",            active: true },
    { label: "My Plans",      icon: CreditCard,      to: "#enrolled-plans" },
    { label: "Live Sessions", icon: Video,           to: "#live-sessions" },
    { label: "Assignments",   icon: ClipboardList,   to: "/mentorship-dashboard" },
    { label: "Test Series",   icon: FileText,        to: "/jee-resources" },
    { label: "Performance",   icon: BarChart3,       to: "#performance" },
    { label: "Resources",     icon: BookOpen,        to: "/jee-resources" },
    { label: "Mentor Connect",icon: UserCheck,       to: "/mentorship-dashboard" },
    { label: "Community",     icon: Users,           to: "/community" },
    { label: "Certificates",  icon: Award,           to: "#achievements" },
  ];

  const scrollToPlans = () => {
    document.getElementById("all-plans")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="top" style={{ background: "#f4f5f9", minHeight: "100vh", padding: "104px 0 70px" }}>
      <div className="dash-shell" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>

        {/* ── Left sidebar ── */}
        <aside className="dash-side">
          <div style={{ background: "#fff", border: `1px solid ${CARD_LINE}`, borderRadius: 20, boxShadow: CARD_SHADOW, padding: "26px 16px 18px", display: "flex", flexDirection: "column", gap: 4 }}>
            {/* identity */}
            <div style={{ textAlign: "center", padding: "0 6px 18px", borderBottom: `1px solid ${CARD_LINE}`, marginBottom: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${ORANGE}, ${GOLD})`, color: "#fff", display: "grid", placeItems: "center", fontSize: 26, fontWeight: 800, fontFamily: "Sora", margin: "0 auto 12px", boxShadow: `0 10px 24px -10px ${ORANGE}` }}>
                {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
              </div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 16, color: NAVY }}>{user?.name || "Student"}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</div>
            </div>

            {/* nav */}
            {navItems.map(({ label, icon: Icon, to, active }) => (
              <button key={label} onClick={() => goTo(to)}
                style={{
                  display: "flex", alignItems: "center", gap: 11, width: "100%", textAlign: "left",
                  padding: "10px 13px", borderRadius: 11, cursor: "pointer", fontFamily: "Sora",
                  fontWeight: active ? 800 : 600, fontSize: 13.5,
                  border: "1px solid transparent",
                  background: active ? `linear-gradient(135deg, ${ORANGE}, ${GOLD})` : "transparent",
                  color: active ? "#fff" : "#475067",
                  boxShadow: active ? `0 10px 24px -12px ${ORANGE}` : "none",
                  transition: "background .15s, color .15s",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#f4f5f9"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                <Icon size={17} color={active ? "#fff" : ORANGE} /> {label}
              </button>
            ))}

            {/* footer actions */}
            <div style={{ borderTop: `1px solid ${CARD_LINE}`, marginTop: 12, paddingTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
              <button onClick={scrollToPlans}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "11px", borderRadius: 11, border: "none", cursor: "pointer", fontFamily: "Sora", fontWeight: 800, fontSize: 13, color: ORANGE, background: tint(ORANGE, 0.12), marginBottom: 4 }}>
                <Rocket size={16} /> Upgrade Plan
              </button>
              <button onClick={() => setEditOpen(true)}
                style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", textAlign: "left", padding: "10px 13px", borderRadius: 11, cursor: "pointer", fontFamily: "Sora", fontWeight: 600, fontSize: 13.5, border: "1px solid transparent", background: "transparent", color: "#475067" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f5f9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                <User size={17} color={ORANGE} /> Profile
              </button>
              <button onClick={() => setEditOpen(true)}
                style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", textAlign: "left", padding: "10px 13px", borderRadius: 11, cursor: "pointer", fontFamily: "Sora", fontWeight: 600, fontSize: 13.5, border: "1px solid transparent", background: "transparent", color: "#475067" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f5f9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                <Settings size={17} color={ORANGE} /> Settings
              </button>
              <button onClick={() => navigate("/how-to-use")}
                style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", textAlign: "left", padding: "10px 13px", borderRadius: 11, cursor: "pointer", fontFamily: "Sora", fontWeight: 600, fontSize: 13.5, border: "1px solid transparent", background: "transparent", color: "#475067" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f5f9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                <HelpCircle size={17} color={ORANGE} /> Help Center
              </button>
              <button onClick={() => setConfirmLogout(true)}
                style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", textAlign: "left", padding: "10px 13px", borderRadius: 11, cursor: "pointer", fontFamily: "Sora", fontWeight: 600, fontSize: 13.5, border: "1px solid transparent", background: "transparent", color: "#e5484d" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                <LogOut size={17} color="#e5484d" /> Log out
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="dash-main" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 22 }}>

          {/* Welcome header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.4rem,3.4vw,1.9rem)", color: NAVY, margin: 0, fontStyle: "normal" }}>
                Welcome back, {firstName}! <span style={{ fontStyle: "normal" }}>👋</span>
              </h1>
              <p style={{ color: "#6b7280", margin: "6px 0 0", fontSize: 14.5 }}>Keep learning, keep growing.</p>
            </div>
            <button onClick={() => setEditOpen(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `linear-gradient(135deg, ${ORANGE}, ${GOLD})`, border: "none", color: "#fff", padding: "11px 20px", borderRadius: 12, fontWeight: 800, fontFamily: "Sora", fontSize: 14, cursor: "pointer", boxShadow: `0 10px 26px -12px ${ORANGE}` }}>
              <Pencil size={15} /> Edit Profile
            </button>
          </div>

          {/* Profile info cards */}
          <div className="dash-info">
            {profileCards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} style={{ background: "#fff", border: `1px solid ${CARD_LINE}`, borderRadius: 14, boxShadow: CARD_SHADOW, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <span style={{ width: 40, height: 40, borderRadius: 11, background: tint(color, 0.12), display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Icon size={18} color={color} />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</div>
                  <div style={{ fontSize: 14.5, color: NAVY, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="dash-stats">
            {stats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>

          {/* Enrolled plans + Upcoming live sessions */}
          <div className="dash-two">
            <Panel id="enrolled-plans" title="Your enrolled plans" icon={CheckCircle2} iconColor={GREEN}
              action={<button onClick={scrollToPlans} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "transparent", border: "none", color: ORANGE, fontFamily: "Sora", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Browse plans <ChevronRight size={15} /></button>}>
              {loading ? (
                <div style={{ padding: "30px", textAlign: "center", color: "#9ca3af" }}><Loader2 size={22} className="dash-spin" /> Loading your plans…</div>
              ) : !hasAnyPlan ? (
                <div style={{ border: "1px dashed #e5b894", borderRadius: 14, padding: "28px 20px", textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${ORANGE}12`, display: "grid", placeItems: "center", margin: "0 auto 12px" }}>
                    <Sparkles size={22} color={ORANGE} />
                  </div>
                  <div style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: 15, marginBottom: 4 }}>No active plans yet</div>
                  <div style={{ fontSize: 13.5, color: "#6b7280", marginBottom: 14 }}>Pick a mentorship or counselling plan to get started.</div>
                  <button onClick={scrollToPlans} style={{ background: `linear-gradient(135deg, ${ORANGE}, ${GOLD})`, color: "#fff", border: "none", padding: "10px 18px", borderRadius: 11, fontWeight: 800, fontFamily: "Sora", fontSize: 13.5, cursor: "pointer" }}>Explore plans</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {plans.map((p, i) => {
                    const g = groupForPlan(p.plan);
                    const Icon = g.icon;
                    const mentor = isMentorshipPlan(p.plan);
                    return (
                      <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 13, flexWrap: "wrap", padding: "14px 0", borderTop: i ? `1px solid ${CARD_LINE}` : "none" }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: tint(g.accent, 0.1), display: "grid", placeItems: "center", flexShrink: 0 }}>
                          <Icon size={21} color={g.accent} />
                        </div>
                        <div style={{ flex: 1, minWidth: 150 }}>
                          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 14.5, color: NAVY }}>{p.planLabel || p.plan}</div>
                          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Purchased {fmtDate(p.createdAt)}</div>
                        </div>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 800, color: "#15803d", background: "#dcfce7", borderRadius: 20, padding: "5px 11px" }}>
                          <CheckCircle2 size={13} /> Active
                        </span>
                        {mentor && (
                          <button onClick={() => navigate(`/mentorship-dashboard?plan=${encodeURIComponent(p.plan)}`)}
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 11, border: `1.5px solid ${g.accent}55`, background: "#fff", color: g.accent, fontFamily: "Sora", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
                            <LayoutDashboard size={14} /> Open
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Panel>

            <Panel id="live-sessions" title="Upcoming live sessions" icon={Video} iconColor={INDIGO}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {LIVE_SESSIONS.map((s) => (
                  <div key={s.subject + s.topic} style={{ display: "flex", alignItems: "center", gap: 12, background: tint(s.color, 0.06), border: `1px solid ${tint(s.color, 0.18)}`, borderRadius: 12, padding: "11px 12px" }}>
                    <span style={{ width: 38, height: 38, borderRadius: 10, background: tint(s.color, 0.14), display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <PlayCircle size={19} color={s.color} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13.5, color: NAVY }}>{s.subject} · {s.topic}</div>
                      <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
                        <Clock size={11} /> {s.when}
                      </div>
                    </div>
                    {s.live ? (
                      <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".05em", color: "#fff", background: "#ef4444", borderRadius: 50, padding: "4px 9px" }}>LIVE</span>
                    ) : (
                      <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".05em", color: s.color, background: tint(s.color, 0.14), borderRadius: 50, padding: "4px 9px" }}>SOON</span>
                    )}
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* Performance overview + Quick actions / Achievements */}
          <div className="dash-perf">
            <Panel id="performance" title="Performance overview" icon={BarChart3} iconColor={ORANGE}
              action={<span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 800, color: GREEN, background: tint(GREEN, 0.1), borderRadius: 50, padding: "4px 10px" }}><TrendingUp size={12} /> Improving</span>}>
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>Average score</div>
                  <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 30, color: NAVY }}>77%</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>Tests this year</div>
                  <div style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 30, color: NAVY }}>18</div>
                </div>
              </div>
              <div style={{ width: "100%", height: 210 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PERF_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={ORANGE} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={ORANGE} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(33,29,46,.06)" vertical={false} />
                    <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: `1px solid ${CARD_LINE}`, boxShadow: CARD_SHADOW, fontFamily: "Sora", fontSize: 12 }}
                      formatter={(v) => [`${v}%`, "Score"]} labelStyle={{ color: NAVY, fontWeight: 700 }} />
                    <Area type="monotone" dataKey="s" stroke={ORANGE} strokeWidth={2.5} fill="url(#perfFill)" dot={false} activeDot={{ r: 4, fill: ORANGE }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <div style={{ display: "flex", flexDirection: "column", gap: 22, minWidth: 0 }}>
              <Panel title="Quick actions" icon={Zap} iconColor="#f59e0b">
                <div className="dash-quick">
                  {QUICK_ACTIONS.map(({ label, icon: Icon, color, to }) => (
                    <button key={label} onClick={() => goTo(to)}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "14px 8px", borderRadius: 13, border: `1px solid ${CARD_LINE}`, background: "#fff", cursor: "pointer", transition: "transform .15s, box-shadow .15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = CARD_SHADOW; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                      <span style={{ width: 42, height: 42, borderRadius: 12, background: tint(color, 0.12), display: "grid", placeItems: "center" }}>
                        <Icon size={20} color={color} />
                      </span>
                      <span style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 12, color: NAVY, textAlign: "center", lineHeight: 1.25 }}>{label}</span>
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel id="achievements" title="Achievements" icon={Trophy} iconColor="#f59e0b">
                <div className="dash-badges">
                  {ACHIEVEMENTS.map(({ label, desc, icon: Icon, color, unlocked }) => (
                    <div key={label} title={desc}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: "14px 8px", borderRadius: 13, border: `1px solid ${unlocked ? tint(color, 0.3) : CARD_LINE}`, background: unlocked ? tint(color, 0.06) : "#f8f8fb", textAlign: "center", opacity: unlocked ? 1 : 0.65 }}>
                      <span style={{ width: 42, height: 42, borderRadius: "50%", background: unlocked ? tint(color, 0.16) : "#eceef3", display: "grid", placeItems: "center", position: "relative" }}>
                        <Icon size={20} color={unlocked ? color : "#9ca3af"} />
                        {!unlocked && (
                          <span style={{ position: "absolute", bottom: -2, right: -2, width: 18, height: 18, borderRadius: "50%", background: "#fff", border: `1px solid ${CARD_LINE}`, display: "grid", placeItems: "center" }}>
                            <Lock size={10} color="#9ca3af" />
                          </span>
                        )}
                      </span>
                      <div>
                        <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 12, color: NAVY, lineHeight: 1.2 }}>{label}</div>
                        <div style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 2, lineHeight: 1.3 }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </div>

          {/* Continue learning — quick links to heavy content pages */}
          <Panel title="Continue learning" icon={BookOpen} iconColor={ORANGE}>
            <div className="dash-learn">
              {QUICK_LINKS.map(({ label, desc, to, color, icon: Icon }) => (
                <button key={label} onClick={() => navigate(to)}
                  style={{ textAlign: "left", background: "#fff", border: `1px solid ${CARD_LINE}`, borderRadius: 14, padding: "16px", cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start", transition: "box-shadow .15s, transform .15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 10px 26px -12px rgba(13,27,62,.25)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Icon size={19} color={color} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 14.5, color: NAVY, display: "flex", alignItems: "center", gap: 6 }}>{label} <ArrowRight size={14} color="#9ca3af" /></div>
                    <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 3 }}>{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </Panel>

          {/* ── More plans — plans the student hasn't enrolled in yet ── */}
          <div id="all-plans" style={{ scrollMarginTop: 96 }}>
            <h2 style={{ ...sectionTitle, marginBottom: 6 }}><CreditCard size={18} color={ORANGE} /> More plans</h2>
            <p style={{ fontSize: 13.5, color: "#9ca3af", margin: "0 0 20px" }}>Plans you haven’t enrolled in yet.</p>

            {PLAN_CATALOG.map((group) => {
              const GroupIcon = group.icon;
              const available = group.plans.filter((plan) => !enrolledKeys.has(plan.key));
              if (!available.length) return null;
              return (
                <div key={group.key} style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: `${group.accent}14`, border: `1px solid ${group.accent}30`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <GroupIcon size={19} color={group.accent} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.02rem", color: NAVY }}>{group.title}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>{group.subtitle}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
                    {available.map((plan) => (
                      <PlanTile key={plan.key} plan={plan} group={group} enrolled={false}
                        onEnrol={(k) => openEnrol?.(k)} onView={(to) => navigate(to)} />
                    ))}
                  </div>
                </div>
              );
            })}
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
        .dash-shell{display:flex;gap:24px;align-items:flex-start}
        .dash-side{width:248px;flex-shrink:0;position:sticky;top:96px}
        .dash-info{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .dash-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
        .dash-two{display:grid;grid-template-columns:1.45fr 1fr;gap:22px;align-items:start}
        .dash-perf{display:grid;grid-template-columns:1.55fr 1fr;gap:22px;align-items:start}
        .dash-quick{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .dash-badges{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .dash-learn{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px}
        @media (max-width:1100px){
          .dash-stats{grid-template-columns:repeat(3,1fr)}
          .dash-perf{grid-template-columns:1fr}
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
