import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, MapPin, GraduationCap, Calendar, LogOut,
  ArrowUpRight, Loader2, Check, Compass, Pencil, X, ShieldCheck,
  Bot, Sparkles, Send, Award, Hash, Stethoscope, CreditCard,
  Gauge, Crosshair, GitCompare, Users,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";
import { apiMyEnrollments, apiUpdateProfile } from "../auth/api.js";

/* ── Warm coral palette (matches dashboard mock) ──────────────────── */
const CORAL    = "#FF693D";
const CORAL_DK = "#E0421F";
const CORAL_SOFT = "#FFF1E9";
const INK      = "#1a1a2e";   // near-black headings
const BODY     = "#4b5563";   // body text
const MUTED    = "#8b93a5";   // muted text
const LABEL    = "#9aa3b2";   // tiny uppercase labels
const LINE     = "rgba(26,26,46,.09)";
const GREEN    = "#15a06e";
const GREEN_BG = "#e7f6ee";

const DISPLAY = '"Space Grotesk", "Sora", sans-serif';

const tint = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const CARD = {
  background: "#fff", border: `1px solid ${LINE}`, borderRadius: 22,
  boxShadow: "0 8px 30px -18px rgba(26,26,46,.18)",
};

const isMentorshipPlan = (key) => String(key || "").startsWith("mentor-");
const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtRank = (r) => (r != null && r !== "" ? Number(r).toLocaleString("en-IN") : "—");

/* ── A labelled input used inside the Edit-info modal ─────────────── */
function LabeledInput({ label, value, onChange, type = "text", placeholder, inputMode, disabled }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#6b7280" }}>{label}</span>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} inputMode={inputMode} disabled={disabled}
        style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e5e7eb", fontSize: 14, color: INK, outline: "none", boxSizing: "border-box", background: disabled ? "#f9fafb" : "#fff" }}
        onFocus={(e) => { e.target.style.borderColor = CORAL; }}
        onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }} />
    </label>
  );
}

/* ── Edit profile modal — name / email / phone / ranks ────────────── */
function EditInfoModal({ user, token, onClose, onSaved }) {
  const [f, setF] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    coaching: user?.coaching || "",
    homeState: user?.homeState || "",
    jeeMainsRank: user?.jeeMainsRank ?? "",
    jeeAdvancedRank: user?.jeeAdvancedRank ?? "",
    neetRank: user?.neetRank ?? "",
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
        neetRank: f.neetRank === "" ? null : Number(f.neetRank),
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
      style={{ position: "fixed", inset: 0, zIndex: 4000, background: "rgba(26,26,46,.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", display: "grid", placeItems: "center", padding: 16, overflowY: "auto" }}>
      <motion.div initial={{ opacity: 0, scale: .94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .95, y: 12 }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }} onMouseDown={(e) => e.stopPropagation()}
        style={{ width: "min(560px,100%)", background: "#fff", borderRadius: 22, boxShadow: "0 30px 80px rgba(26,26,46,.4)", overflow: "hidden", margin: "auto" }}>

        {/* header */}
        <div style={{ background: `linear-gradient(135deg, ${CORAL}, ${CORAL_DK})`, color: "#fff", padding: "22px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -10, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.25), transparent 70%)" }} />
          <button onClick={onClose} disabled={busy} aria-label="Close"
            style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.2)", color: "#fff", cursor: busy ? "not-allowed" : "pointer", display: "grid", placeItems: "center" }}>
            <X size={17} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 11, position: "relative" }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(255,255,255,.18)", display: "grid", placeItems: "center" }}>
              <Pencil size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "1.25rem", margin: 0 }}>Edit your information</h3>
              <div style={{ fontSize: 12.5, opacity: .85, marginTop: 2 }}>Used across your dashboard and at checkout.</div>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <LabeledInput label="JEE Main rank" inputMode="numeric" value={f.jeeMainsRank} onChange={set("jeeMainsRank")} placeholder="—" />
              <LabeledInput label="JEE Advanced rank" inputMode="numeric" value={f.jeeAdvancedRank} onChange={set("jeeAdvancedRank")} placeholder="—" />
              <LabeledInput label="NEET rank" inputMode="numeric" value={f.neetRank} onChange={set("neetRank")} placeholder="—" />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <button onClick={onClose} disabled={busy} style={{ flex: 1, padding: "13px 0", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", color: INK, fontWeight: 700, fontFamily: DISPLAY, cursor: busy ? "not-allowed" : "pointer" }}>Cancel</button>
            <button onClick={save} disabled={busy}
              style={{ flex: 1.4, padding: "13px 0", borderRadius: 12, border: "none", background: busy ? "#f9a25e" : `linear-gradient(135deg, ${CORAL}, ${CORAL_DK})`, color: "#fff", fontWeight: 800, fontFamily: DISPLAY, cursor: busy ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 10px 24px -10px ${CORAL}` }}>
              {busy ? <><Loader2 size={17} className="dash-spin" /> Saving…</> : <><Check size={17} strokeWidth={3} /> Save changes</>}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Scroll-reveal wrapper ── */
function Reveal({ children, delay = 0, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1], delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── One field inside "Your details" ── */
function Detail({ icon: Ic, label, value, color, bg, span }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0, gridColumn: span ? "1 / -1" : "auto" }}>
      <span style={{ width: 34, height: 34, borderRadius: 10, background: bg, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Ic size={16} color={color} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10.5, color: LABEL, fontWeight: 700, letterSpacing: ".6px", textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>{value}</div>
      </div>
    </div>
  );
}

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

  if (!isLoggedIn) {
    return (
      <section style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "120px 16px 60px", background: "var(--page-bg)" }}>
        <div style={{ textAlign: "center", maxWidth: 380 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: CORAL_SOFT, display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
            <ShieldCheck size={30} color={CORAL} />
          </div>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, color: INK, fontSize: "1.6rem", margin: "0 0 8px" }}>Please log in</h2>
          <p style={{ color: BODY, marginBottom: 18 }}>Log in to view your dashboard, profile and enrolled programs.</p>
          <button onClick={openLogin} style={{ background: CORAL, color: "#fff", border: "none", padding: "12px 22px", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontFamily: DISPLAY }}>
            Log in
          </button>
        </div>
      </section>
    );
  }

  const firstName = (user?.name || "").trim().split(" ")[0] || "Student";
  const mentorPlan = plans.find((p) => isMentorshipPlan(p.plan));
  const planYear = plans.map((p) => String(p.planLabel || p.plan || "").match(/20\d{2}/)?.[0]).find(Boolean);
  const aspirantTag = `${planYear ? `JEE ${planYear}` : "JEE / NEET"} · Aspirant`;

  const rankPhrase = user?.jeeMainsRank
    ? `your JEE Main rank of ${fmtRank(user.jeeMainsRank)}`
    : "your profile";
  const statePhrase = user?.homeState ? ` and ${user.homeState} home state` : "";
  const suggestion = `${firstName}, based on ${rankPhrase}${statePhrase}, here are 5 colleges worth targeting…`;

  const chips = [
    user?.jeeMainsRank ? `Colleges for rank ${fmtRank(user.jeeMainsRank)}?` : "Colleges for my rank?",
    "JEE Advanced strategy",
    "Compare NITs vs IIITs",
    user?.homeState ? `${user.homeState} state quota` : "Home-state quota",
  ];

  const details = [
    { icon: User,          label: "Name",              value: user?.name || "Student",       color: CORAL,     bg: CORAL_SOFT },
    { icon: GraduationCap, label: "Coaching",          value: user?.coaching || "—",         color: "#7C3AED", bg: "#EDE7FE" },
    { icon: Mail,          label: "Email",             value: user?.email || "—",            color: "#2563EB", bg: "#DCEBFE", span: true },
    { icon: Phone,         label: "Phone",             value: user?.phone || "—",            color: "#0EA371", bg: "#D6F3E5" },
    { icon: MapPin,        label: "State",             value: user?.homeState || "—",        color: "#DB2777", bg: "#FCE1EA" },
    { icon: Calendar,      label: "Member Since",      value: fmtDate(user?.createdAt),      color: "#E08600", bg: "#FEEBCF" },
    { icon: Hash,          label: "JEE Main Rank",     value: fmtRank(user?.jeeMainsRank),   color: CORAL,     bg: CORAL_SOFT },
    { icon: Award,         label: "JEE Advanced Rank", value: fmtRank(user?.jeeAdvancedRank),color: "#7C3AED", bg: "#EDE7FE" },
    { icon: Stethoscope,   label: "NEET Rank",         value: fmtRank(user?.neetRank),       color: "#0EA371", bg: "#D6F3E5" },
  ];

  const QUICK = [
    { label: "Rank Predictor",      icon: Gauge,     to: "/jee-main#rank",        color: CORAL,     bg: CORAL_SOFT },
    { label: "College Predictor",   icon: Crosshair, to: "/jee-advanced#college", color: "#7C3AED", bg: "#EDE7FE" },
    { label: "Compare Colleges",    icon: GitCompare,to: "/compare",              color: "#0EA371", bg: "#D6F3E5" },
    { label: "Counselling Planner", icon: Calendar,  to: "/planner",              color: "#E08600", bg: "#FEEBCF" },
    { label: "Explore Colleges",    icon: Compass,   to: "/colleges",             color: "#DB2777", bg: "#FCE1EA" },
    { label: "Community",           icon: Users,     to: "/community",            color: "#2563EB", bg: "#DCEBFE" },
  ];

  const goMentorship = () => navigate(mentorPlan ? `/mentorship-dashboard?plan=${encodeURIComponent(mentorPlan.plan)}` : "/mentorship");

  return (
    <section id="top" style={{ background: "var(--page-bg)", padding: "104px 0 40px", minHeight: "100vh" }}>
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <Reveal>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(1.9rem, 4.6vw, 2.6rem)", color: INK, letterSpacing: "-1px", margin: 0, lineHeight: 1.05 }}>
                Welcome back, {firstName}.
              </h1>
            </div>
            <button onClick={() => setConfirmLogout(true)} aria-label="Log out"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 50, border: `1px solid ${LINE}`, background: "#fff", color: "#e5484d", fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 12px -6px rgba(229,72,77,.2)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fff1f1"; e.currentTarget.style.borderColor = "#e5484d"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = LINE; }}
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </Reveal>

        {/* ── Row 1: Parichay AI + Your details ──────────────────── */}
        <div className="dash-2col">
          {/* Parichay AI */}
          <Reveal delay={0.05} style={{ display: "flex" }}>
            <div style={{ ...CARD, flex: 1, padding: "20px 22px", position: "relative", overflow: "hidden" }}>
              <div aria-hidden style={{ position: "absolute", top: -40, right: -30, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${tint(CORAL, .1)}, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                {/* header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: INK, display: "grid", placeItems: "center" }}>
                      <Bot size={24} color="#fff" />
                    </div>
                    <span style={{ position: "absolute", bottom: -2, right: -2, width: 14, height: 14, borderRadius: "50%", background: CORAL, border: "2.5px solid #fff" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 17, color: INK }}>Parichay AI</span>
                      <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".5px", color: CORAL_DK, background: CORAL_SOFT, padding: "3px 7px", borderRadius: 50 }}>BETA</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: MUTED, marginTop: 1 }}>Your personal counselling assistant</div>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: MUTED, fontWeight: 600 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }} /> Online
                  </span>
                </div>

                {/* suggestion */}
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".08em", color: LABEL, margin: "18px 0 8px" }}>SUGGESTED FOR YOU</div>
                <div style={{ background: CORAL_SOFT, border: `1px solid ${tint(CORAL, .16)}`, borderRadius: 14, padding: "14px 16px", fontSize: 14.5, color: INK, fontWeight: 600, lineHeight: 1.55 }}>
                  “{suggestion}”
                </div>

                {/* chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                  {chips.map((c) => (
                    <button key={c} onClick={() => navigate("/ai")}
                      style={{ padding: "8px 14px", borderRadius: 50, border: `1px solid ${LINE}`, background: "#fff", color: BODY, fontSize: 12.5, fontWeight: 600, cursor: "pointer", transition: "border-color .15s, color .15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = tint(CORAL, .5); e.currentTarget.style.color = CORAL_DK; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = LINE; e.currentTarget.style.color = BODY; }}>
                      {c}
                    </button>
                  ))}
                </div>

                {/* input */}
                <button onClick={() => navigate("/ai")}
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", marginTop: 16, padding: "10px 10px 10px 16px", borderRadius: 50, border: `1px solid ${LINE}`, background: "#fff", cursor: "pointer", textAlign: "left" }}>
                  <Sparkles size={16} color={CORAL} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13.5, color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Ask Parichay AI anything about colleges, ranks, counselling…</span>
                  <span style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${CORAL}, ${CORAL_DK})`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Send size={16} color="#fff" />
                  </span>
                </button>
              </div>
            </div>
          </Reveal>

          {/* Your details */}
          <Reveal delay={0.1} style={{ display: "flex" }}>
            <div style={{ ...CARD, flex: 1, padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 34, height: 34, borderRadius: 10, background: CORAL_SOFT, display: "grid", placeItems: "center" }}><User size={17} color={CORAL} /></span>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 17, color: INK }}>Your details</span>
                </div>
                <button onClick={() => setEditOpen(true)} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "transparent", border: "none", color: CORAL, fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  <Pencil size={13} /> Edit
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 18px" }}>
                {details.map((d) => <Detail key={d.label} {...d} />)}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Row 2: My plans + Quick links ──────────────────────── */}
        <div className="dash-2col">
          {/* My plans */}
          <Reveal delay={0.05} style={{ display: "flex" }}>
            <div style={{ ...CARD, flex: 1, padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 34, height: 34, borderRadius: 10, background: CORAL_SOFT, display: "grid", placeItems: "center" }}><CreditCard size={17} color={CORAL} /></span>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 17, color: INK }}>My plans</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {!loading && plans.length > 0 && <span style={{ fontSize: 12.5, color: MUTED, fontWeight: 600 }}>{plans.length} active</span>}
                  <button onClick={() => navigate("/mentorship")} style={{ background: "transparent", border: "none", color: CORAL, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: DISPLAY, padding: 0 }}>Explore all plans</button>
                </div>
              </div>

              {loading ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: MUTED, padding: "22px 0", justifyContent: "center", fontSize: 13.5 }}>
                  <Loader2 size={16} className="dash-spin" /> Loading your plans…
                </div>
              ) : plans.length > 0 ? (
                plans.map((p, i) => (
                  <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "13px 0", borderTop: i ? `1px solid ${LINE}` : "none" }}>
                    <span style={{ width: 40, height: 40, borderRadius: 11, background: CORAL_SOFT, display: "grid", placeItems: "center", flexShrink: 0 }}><GraduationCap size={19} color={CORAL} /></span>
                    <div style={{ flex: 1, minWidth: 150 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 14, color: INK }}>{p.planLabel || p.plan}</span>
                        <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".5px", padding: "3px 8px", borderRadius: 50, background: GREEN_BG, color: GREEN }}>ACTIVE</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: LABEL, marginTop: 3 }}>{fmtDate(p.createdAt)}{p.razorpayPaymentId ? ` · ${p.razorpayPaymentId}` : ""}</div>
                    </div>
                    {isMentorshipPlan(p.plan) && (
                      <button onClick={() => navigate(`/mentorship-dashboard?plan=${encodeURIComponent(p.plan)}`)}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${CORAL}, ${CORAL_DK})`, color: "#fff", fontFamily: DISPLAY, fontWeight: 700, fontSize: 12.5, cursor: "pointer", flexShrink: 0 }}>
                        Open <ArrowUpRight size={13} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "20px 12px" }}>
                  <div style={{ fontSize: 13.5, color: BODY, marginBottom: 14 }}>You haven't enrolled in any plan yet.</div>
                  <button onClick={() => navigate("/mentorship")}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 18px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${CORAL}, ${CORAL_DK})`, color: "#fff", fontFamily: DISPLAY, fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: `0 10px 24px -12px ${CORAL}` }}>
                    Explore mentorship plans <ArrowUpRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </Reveal>

          {/* Quick links */}
          <Reveal delay={0.1} style={{ display: "flex" }}>
            <div style={{ ...CARD, flex: 1, padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ width: 34, height: 34, borderRadius: 10, background: CORAL_SOFT, display: "grid", placeItems: "center" }}><Compass size={17} color={CORAL} /></span>
                <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 17, color: INK }}>Quick links</span>
              </div>
              <div className="dash-quick">
                {QUICK.map(({ label, icon: Ic, to, color, bg }) => (
                  <button key={label} onClick={() => navigate(to)}
                    style={{ display: "flex", flexDirection: "column", gap: 10, padding: "14px 14px", borderRadius: 14, border: `1px solid ${LINE}`, background: "#fff", cursor: "pointer", textAlign: "left", transition: "transform .15s, box-shadow .15s, border-color .15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 26px -14px rgba(26,26,46,.35)"; e.currentTarget.style.borderColor = tint(color, .4); }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = LINE; }}>
                    <span style={{ width: 40, height: 40, borderRadius: "50%", background: bg, display: "grid", placeItems: "center" }}><Ic size={19} color={color} /></span>
                    <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13.5, color: INK }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* footer line */}
        <div style={{ textAlign: "center", fontSize: 12.5, color: MUTED, marginTop: 8 }}>
          College Parichay · Built for JEE aspirants who play the long game.
        </div>
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
            style={{ position: "fixed", inset: 0, zIndex: 4000, background: "rgba(26,26,46,.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", display: "grid", placeItems: "center", padding: 20 }}>
            <motion.div initial={{ opacity: 0, scale: .92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .94, y: 12 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }} onClick={(e) => e.stopPropagation()}
              style={{ width: "min(380px,100%)", background: "#fff", borderRadius: 20, padding: "26px 24px 22px", boxShadow: "0 30px 80px rgba(26,26,46,.4)", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 14px", background: CORAL_SOFT, display: "grid", placeItems: "center" }}>
                <LogOut size={26} color={CORAL} />
              </div>
              <h3 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "1.3rem", color: INK, margin: "0 0 6px" }}>Log out?</h3>
              <p style={{ fontSize: ".95rem", color: BODY, margin: "0 0 20px", lineHeight: 1.5 }}>Are you sure you want to log out of your account?</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setConfirmLogout(false)} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", color: INK, fontWeight: 700, cursor: "pointer" }}>No</button>
                <button onClick={() => { logout(); setConfirmLogout(false); navigate("/"); }} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", background: "#e5484d", color: "#fff", fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 18px -6px #e5484d" }}>Yes, log out</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      <style>{`@keyframes dashspin{to{transform:rotate(360deg)}}
        .dash-spin{display:inline-block;animation:dashspin .8s linear infinite;vertical-align:middle;margin-right:6px}
        .dash-2col{display:grid;grid-template-columns:1.5fr 1fr;gap:18px;align-items:stretch}
        .dash-quick{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        @media (max-width:860px){.dash-2col{grid-template-columns:1fr}}
        @media (max-width:520px){.dash-quick{grid-template-columns:repeat(2,1fr)}}`}</style>
    </section>
  );
}
