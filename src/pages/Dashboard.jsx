import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, MapPin, GraduationCap, Hash, Calendar, LogOut,
  CreditCard, CheckCircle2, ArrowRight, Sparkles, ShieldCheck, BookOpen, Loader2,
  Check, Compass, Pencil, X, LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";
import { useEnrol } from "../components/EnrolModal.jsx";
import { apiMyEnrollments, apiUpdateProfile } from "../auth/api.js";

const ORANGE = "#F47B20";
const GOLD = "#f5a623";
const GREEN = "#15a06e";
const NAVY = "#0d1b3e";

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
      { key: "mentor-jee-2027",   label: "JEE 2027 Mentorship",         tag: "Class 12 / Droppers",    price: 1999, to: "/mentorship/jee-2027" },
      { key: "mentor-neet-2027",  label: "NEET 2027 Mentorship",        tag: "Class 12 / Droppers",    price: 1999, to: "/mentorship/jee-2027" },
      { key: "mentor-jee-2028",   label: "JEE 2028 Mentorship (2-Year)",tag: "Class 11 · 2-Year plan", price: 3999, to: "/mentorship/jee-2028" },
      { key: "mentor-neet-2028",  label: "NEET 2028 Mentorship (2-Year)",tag: "Class 11 · 2-Year plan", price: 3999, to: "/mentorship/jee-2028" },
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
  { label: "College Predictor",   desc: "Rank → college list",       to: "/jee-main#college", color: "#F47B20", icon: Sparkles },
  { label: "Counselling Planner", desc: "Every JoSAA & CSAB date",   to: "/planner",         color: "#15a06e", icon: Calendar },
];

const sectionTitle = {
  fontFamily: "Sora", fontWeight: 800, fontSize: "1.1rem", color: NAVY,
  margin: 0, display: "flex", alignItems: "center", gap: 8,
};

/* ── A single catalogue plan tile — styled like the mentorship pricing
      cards (top accent bar, equal height, text only). ─────────────── */
function PlanTile({ plan, group, enrolled, purchase, onEnrol, onView }) {
  const Icon = group.icon;
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
      style={{
        background: enrolled ? group.soft : "#fff",
        borderRadius: 20,
        border: enrolled ? `2px solid ${group.accent}` : `1px solid ${group.accent}33`,
        height: "100%", minHeight: 250, display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden",
        boxShadow: `0 24px 50px -26px ${group.accent}66`,
      }}>
      {/* top accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${group.accent}, ${group.accent2})` }} />

      <div style={{ padding: "26px 24px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* header: icon + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
          <span style={{ width: 44, height: 44, borderRadius: 13, background: `${group.accent}18`, border: `1px solid ${group.accent}44`, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Icon size={22} color={group.accent} />
          </span>
          <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.12rem", color: NAVY, margin: 0, lineHeight: 1.2, flex: 1, minWidth: 0 }}>{plan.label}</h3>
        </div>

        {/* status badge */}
        <div style={{ marginBottom: 12 }}>
          {enrolled ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 800, color: "#15803d", background: "#dcfce7", borderRadius: 20, padding: "5px 11px" }}>
              <CheckCircle2 size={13} /> Enrolled
            </span>
          ) : (
            <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", background: "#f3f4f6", borderRadius: 20, padding: "5px 11px" }}>Not enrolled</span>
          )}
        </div>

        <p style={{ color: "#6b7280", fontSize: 13.5, lineHeight: 1.55, margin: "0 0 16px" }}>{plan.tag}</p>

        {/* price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
          <span style={{ fontFamily: "Sora", fontWeight: 900, fontSize: 28, color: NAVY }}>₹{plan.price.toLocaleString("en-IN")}</span>
          <span style={{ fontSize: 12.5, color: "#9ca3af" }}>one-time</span>
        </div>

        {enrolled && purchase && (
          <div style={{ fontSize: 12, color: group.accent, fontWeight: 700, marginTop: 6 }}>Purchased {fmtDate(purchase.createdAt)}</div>
        )}

        {/* action */}
        {enrolled ? (
          <button onClick={() => onView(plan.to)}
            style={{ marginTop: "auto", width: "100%", padding: "14px", borderRadius: 12, border: `1.5px solid ${group.accent}66`, background: "#fff", color: group.accent, fontFamily: "Sora", fontWeight: 800, fontSize: 14.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            View details <ArrowRight size={16} />
          </button>
        ) : (
          <button onClick={() => onEnrol(plan.key)}
            style={{ marginTop: "auto", width: "100%", padding: "15px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${group.accent}, ${group.accent2})`, color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 14.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 10px 26px -10px ${group.accent}99` }}>
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
          <div style={{ position: "absolute", top: -30, right: -10, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,123,32,.35), transparent 70%)" }} />
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

  const details = [
    { label: "Full name",         value: user?.name,            icon: User },
    { label: "Email",             value: user?.email,           icon: Mail },
    { label: "Phone",             value: user?.phone,           icon: Phone },
    { label: "Coaching",          value: user?.coaching,        icon: GraduationCap },
    { label: "Home state",        value: user?.homeState,       icon: MapPin },
    { label: "JEE Main rank",     value: user?.jeeMainsRank,    icon: Hash },
    { label: "JEE Advanced rank", value: user?.jeeAdvancedRank, icon: Hash },
    { label: "Member since",      value: fmtDate(user?.createdAt), icon: Calendar },
  ];

  const enrolledKeys = new Set(plans.map((p) => p.plan));
  const hasAnyPlan = plans.length > 0;

  return (
    <section style={{ background: "#f8f7f5", minHeight: "100vh", padding: "120px 0 70px" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 20px" }}>

        {/* Hero header */}
        <div style={{ background: `linear-gradient(135deg, ${NAVY}, #14264f)`, borderRadius: 24, padding: "30px 28px", color: "#fff", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", position: "relative", overflow: "hidden", marginBottom: 24 }}>
          <div style={{ position: "absolute", top: -40, right: -20, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,123,32,.35), transparent 70%)" }} />
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: ORANGE, display: "grid", placeItems: "center", fontSize: 30, fontWeight: 800, fontFamily: "Sora", flexShrink: 0 }}>
            {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 160, position: "relative" }}>
            <div style={{ fontSize: 13, opacity: .8 }}>Welcome back,</div>
            <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.7rem", margin: "2px 0 4px" }}>{user?.name || "Student"}</h1>
            <div style={{ fontSize: 13.5, opacity: .8 }}>{user?.email}</div>
          </div>
          <button onClick={() => setConfirmLogout(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.25)", color: "#fff", padding: "10px 16px", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Sora", position: "relative" }}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Profile details + Edit info */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
          <h2 style={sectionTitle}><User size={18} color={ORANGE} /> Your details</h2>
          <button onClick={() => setEditOpen(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: `1.5px solid ${ORANGE}55`, color: ORANGE, padding: "8px 16px", borderRadius: 11, fontWeight: 800, fontFamily: "Sora", fontSize: 13.5, cursor: "pointer" }}>
            <Pencil size={15} /> Edit info
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 34 }}>
          {details.map(({ label, value, icon: Icon }) => (
            <div key={label} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${ORANGE}12`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Icon size={18} color={ORANGE} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</div>
                <div style={{ fontSize: 15, color: NAVY, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {value || "—"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Enrolled plans (a dedicated section for what you own) ── */}
        <h2 style={{ ...sectionTitle, marginBottom: 14 }}><CheckCircle2 size={18} color={GREEN} /> Your enrolled plans</h2>
        {loading ? (
          <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 16, padding: "40px", textAlign: "center", color: "#9ca3af", marginBottom: 34 }}>
            <Loader2 size={22} className="dash-spin" /> Loading your plans…
          </div>
        ) : !hasAnyPlan ? (
          <div style={{ background: "#fff", border: "1px dashed #e5b894", borderRadius: 16, padding: "34px 24px", textAlign: "center", marginBottom: 34 }}>
            <div style={{ width: 52, height: 52, borderRadius: 15, background: `${ORANGE}12`, display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
              <Sparkles size={24} color={ORANGE} />
            </div>
            <div style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: 16, marginBottom: 4 }}>No active plans yet</div>
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>Pick a mentorship or counselling plan below to get started.</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginBottom: 34 }}>
            {plans.map((p) => {
              const g = groupForPlan(p.plan);
              const Icon = g.icon;
              return (
                <div key={p._id} style={{ background: g.soft, border: `2px solid ${g.accent}`, borderRadius: 18, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", boxShadow: `0 18px 40px -26px ${g.accent}99` }}>
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: "#fff", border: `1px solid ${g.accent}33`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Icon size={22} color={g.accent} />
                  </div>
                  <div style={{ flex: 1, minWidth: 170 }}>
                    <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 15.5, color: NAVY }}>{p.planLabel || p.plan}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                      Purchased {fmtDate(p.createdAt)} · ID {p.razorpayPaymentId || "—"}
                    </div>
                  </div>
                  <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17, color: NAVY }}>₹{Number(p.amount || 0).toLocaleString("en-IN")}</div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 800, color: "#15803d", background: "#dcfce7", borderRadius: 20, padding: "6px 13px" }}>
                    <CheckCircle2 size={14} /> Active
                  </span>
                  {isMentorshipPlan(p.plan) && (
                    <button onClick={() => navigate("/mentorship-dashboard")}
                      style={{ flexBasis: "100%", marginTop: 4, padding: "12px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${g.accent}, ${g.accent2 || GOLD})`, color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 12px 26px -12px ${g.accent}` }}>
                      <LayoutDashboard size={16} /> Mentorship dashboard <ArrowRight size={15} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── All plans — every mentorship & counselling plan ── */}
        <h2 style={{ ...sectionTitle, marginBottom: 6 }}><CreditCard size={18} color={ORANGE} /> All plans</h2>
        <p style={{ fontSize: 13.5, color: "#9ca3af", margin: "0 0 22px" }}>Browse every plan — the ones you’re enrolled in are highlighted.</p>

        {PLAN_CATALOG.map((group) => {
          const GroupIcon = group.icon;
          return (
            <div key={group.key} style={{ marginBottom: 30 }}>
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
                {group.plans.map((plan) => (
                  <PlanTile
                    key={plan.key}
                    plan={plan}
                    group={group}
                    enrolled={enrolledKeys.has(plan.key)}
                    purchase={plans.find((p) => p.plan === plan.key)}
                    onEnrol={(k) => openEnrol?.(k)}
                    onView={(to) => navigate(to)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Quick links to the heavy content pages */}
        <h2 style={{ ...sectionTitle, marginBottom: 14, marginTop: 8 }}><BookOpen size={18} color={ORANGE} /> Continue learning</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {QUICK_LINKS.map(({ label, desc, to, color, icon: Icon }) => (
            <button key={label} onClick={() => navigate(to)}
              style={{ textAlign: "left", background: "#fff", border: "1px solid #eee", borderRadius: 16, padding: "18px", cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start", transition: "box-shadow .15s, transform .15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 10px 26px -12px rgba(13,27,62,.25)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Icon size={19} color={color} />
              </div>
              <div>
                <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 15, color: NAVY, display: "flex", alignItems: "center", gap: 6 }}>{label} <ArrowRight size={14} color="#9ca3af" /></div>
                <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 3 }}>{desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Edit info modal */}
      <AnimatePresence>
        {editOpen && (
          <EditInfoModal
            user={user}
            token={token}
            onClose={() => setEditOpen(false)}
            onSaved={(u) => updateUser?.(u)}
          />
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

      <style>{`@keyframes dashspin{to{transform:rotate(360deg)}}.dash-spin{display:inline-block;animation:dashspin .8s linear infinite;vertical-align:middle;margin-right:6px}`}</style>
    </section>
  );
}
