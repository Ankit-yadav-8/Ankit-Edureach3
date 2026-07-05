import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, MapPin, GraduationCap, Hash, Calendar, LogOut,
  ArrowRight, Loader2, Check, Compass, Pencil, X, ShieldCheck,
  Share2, Bell, Award, Building2, BarChart3, GitCompare, TrendingUp,
  Zap, ChevronDown,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";
import { apiMyEnrollments, apiUpdateProfile } from "../auth/api.js";

/* ── Premium navy / slate palette (matches dashboard mock) ─────────── */
const INK    = "#1d2a48";   // serif headings — deep navy
const NAVY    = "#1f2f52";  // dark tiles / primary buttons
const STEEL   = "#42648f";  // accent steel blue
const SLATE   = "#61708c";  // body muted text
const LABEL    = "#97a1b4"; // tiny uppercase labels
const TILE     = "#edf0f6"; // light blue-gray tiles
const LINE     = "#e7e9f1"; // hairline borders
const PAGE     = "var(--page-bg)"; // page canvas — site-wide flat token
const GREEN_BG = "#e6f5ec", GREEN_TX = "#1f9060";
const BLUE_BG  = "#e9eef8", BLUE_TX  = "#3a568c";

/* keep old constant names alive for the modals below */
const ORANGE = STEEL, GOLD = NAVY;

const tint = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const CARD_SHADOW = "0 6px 22px rgba(29,42,72,.06)";
const CARD_LINE = LINE;

const isMentorshipPlan = (key) => String(key || "").startsWith("mentor-");

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const serifHead = {
  fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 800,
  color: INK, margin: 0, letterSpacing: "-0.2px",
};

/* ── A labelled input used inside the Edit-info modal ─────────────── */
function LabeledInput({ label, value, onChange, type = "text", placeholder, inputMode, disabled }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: SLATE }}>{label}</span>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} inputMode={inputMode} disabled={disabled}
        style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: "1.5px solid #e5e7eb", fontSize: 14, color: NAVY, outline: "none", boxSizing: "border-box", background: disabled ? "#f9fafb" : "#fff" }}
        onFocus={(e) => { e.target.style.borderColor = STEEL; }}
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
      style={{ position: "fixed", inset: 0, zIndex: 4000, background: "rgba(29,42,72,.55)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", display: "grid", placeItems: "center", padding: 16, overflowY: "auto" }}>
      <motion.div initial={{ opacity: 0, scale: .94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .95, y: 12 }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }} onMouseDown={(e) => e.stopPropagation()}
        style={{ width: "min(560px,100%)", background: "#fff", borderRadius: 22, boxShadow: "0 30px 80px rgba(29,42,72,.4)", overflow: "hidden", margin: "auto" }}>

        {/* header */}
        <div style={{ background: `linear-gradient(135deg, ${NAVY}, #14264f)`, color: "#fff", padding: "22px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -10, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${tint(STEEL, .5)}, transparent 70%)` }} />
          <button onClick={onClose} disabled={busy} aria-label="Close"
            style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.16)", color: "#fff", cursor: busy ? "not-allowed" : "pointer", display: "grid", placeItems: "center" }}>
            <X size={17} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 11, position: "relative" }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(255,255,255,.14)", display: "grid", placeItems: "center" }}>
              <Pencil size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 800, fontSize: "1.25rem", margin: 0 }}>Edit your information</h3>
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
              style={{ flex: 1.4, padding: "13px 0", borderRadius: 12, border: "none", background: busy ? "#7e91b3" : `linear-gradient(135deg, ${STEEL}, ${NAVY})`, color: "#fff", fontWeight: 800, fontFamily: "Sora", cursor: busy ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 10px 24px -10px ${STEEL}` }}>
              {busy ? <><Loader2 size={17} className="dash-spin" /> Saving…</> : <><Check size={17} strokeWidth={3} /> Save changes</>}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── A reusable card panel — white, hairline border, serif title ──── */
function Card({ title, action, children, style, bodyStyle }) {
  return (
    <section style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 16, boxShadow: CARD_SHADOW, padding: "18px 20px", ...style }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 16 }}>
          <h2 style={{ ...serifHead, fontSize: "1.12rem" }}>{title}</h2>
          {action}
        </div>
      )}
      <div style={bodyStyle}>{children}</div>
    </section>
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

/* ── A single profile-highlight cell ── */
function Highlight({ icon: Ic, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0, flex: "1 1 180px", padding: "2px 6px" }}>
      <span style={{ width: 38, height: 38, borderRadius: 10, background: TILE, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Ic size={17} color={STEEL} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10.5, color: LABEL, fontWeight: 700, letterSpacing: ".6px", textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 14, color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

/* ── Faux select used in Comparison Intelligence (visual) ── */
function FauxSelect({ label, value, options }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0, flex: 1 }}>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: SLATE }}>{label}</span>
      <div style={{ position: "relative" }}>
        <select defaultValue={value}
          style={{ width: "100%", appearance: "none", WebkitAppearance: "none", padding: "11px 34px 11px 13px", borderRadius: 11, border: `1.5px solid ${LINE}`, fontSize: 13.5, fontFamily: "Sora", fontWeight: 700, color: INK, background: "#fbfcfe", outline: "none", cursor: "pointer" }}>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={16} color={SLATE} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>
    </label>
  );
}

export default function Dashboard() {
  const { user, token, isLoggedIn, logout, openLogin, updateUser } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cmpTab, setCmpTab] = useState("branch");

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
      <section style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "120px 16px 60px", background: PAGE }}>
        <div style={{ textAlign: "center", maxWidth: 380 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: TILE, display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
            <ShieldCheck size={30} color={STEEL} />
          </div>
          <h2 style={{ ...serifHead, fontSize: "1.6rem", margin: "0 0 8px" }}>Please log in</h2>
          <p style={{ color: SLATE, marginBottom: 18 }}>Log in to view your dashboard, profile and enrolled programs.</p>
          <button onClick={openLogin} style={{ background: NAVY, color: "#fff", border: "none", padding: "12px 22px", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Sora" }}>
            Log in
          </button>
        </div>
      </section>
    );
  }

  const firstName = (user?.name || "").trim().split(" ")[0] || "Student";
  const avatarChar = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  // profile completeness → shown in the header subtitle
  const fields = ["name", "email", "phone", "coaching", "homeState", "jeeMainsRank", "jeeAdvancedRank"];
  const filled = fields.filter((k) => user?.[k] !== undefined && user?.[k] !== null && user?.[k] !== "").length;
  const pct = Math.round((filled / fields.length) * 100);

  const rankVal = user?.jeeMainsRank != null && user?.jeeMainsRank !== ""
    ? `AIR ${Number(user.jeeMainsRank).toLocaleString("en-IN")}` : "—";

  const highlights = [
    { icon: User,       label: "Full Name",      value: user?.name || "Student" },
    { icon: Award,      label: "JEE Rank (Main)", value: rankVal },
    { icon: MapPin,     label: "Home State",     value: user?.homeState || "—" },
    { icon: Building2,  label: "Coaching",       value: user?.coaching || "—" },
  ];

  const QUICK = [
    { label: "Rank Predictor",    icon: BarChart3,     to: "/jee-main#rank",       badge: "RECOMMENDED" },
    { label: "College Predictor", icon: GraduationCap, to: "/jee-advanced#college" },
    { label: "Compare Colleges",  icon: GitCompare,    to: "/compare" },
    { label: "Explore Programs",  icon: Compass,       to: "/colleges",            dark: true },
  ];

  // illustrative demand-trend chart (2024-2029)
  const bars = [
    { yr: "2024", h: 42, kind: "growth" },
    { yr: "2025", h: 55, kind: "growth" },
    { yr: "2026", h: 63, kind: "growth" },
    { yr: "2027", h: 72, kind: "proj" },
    { yr: "2028", h: 86, kind: "proj" },
    { yr: "2029", h: 98, kind: "proj" },
  ];

  const activeMentor = plans.filter((p) => isMentorshipPlan(p.plan)).length;
  const subtitle = `Your academic profile is ${pct}% complete.` +
    (activeMentor ? ` You have ${activeMentor} active mentorship ${activeMentor === 1 ? "program" : "programs"}.` : " Complete your profile to unlock tailored guidance.");

  return (
    <section id="top" style={{ background: PAGE, padding: "104px 0 60px", minHeight: "100vh" }}>
      <div className="dash-wrap" style={{ maxWidth: 1040, margin: "0 auto", padding: "0 18px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* ── Welcome header ─────────────────────────────────────── */}
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <h1 style={{ ...serifHead, fontSize: "clamp(1.7rem, 4vw, 2.15rem)" }}>Welcome back, {firstName}</h1>
              <p style={{ fontSize: 13.5, color: SLATE, margin: "6px 0 0", lineHeight: 1.55 }}>{subtitle}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => navigate("/community")} aria-label="Community" title="Community"
                style={{ width: 42, height: 42, borderRadius: 12, border: `1px solid ${LINE}`, background: "#fff", color: NAVY, display: "grid", placeItems: "center", cursor: "pointer" }}>
                <Share2 size={17} />
              </button>
              <button onClick={() => navigate("/mentorship")} aria-label="Updates" title="Mentorship updates"
                style={{ position: "relative", width: 42, height: 42, borderRadius: 12, border: `1px solid ${LINE}`, background: "#fff", color: NAVY, display: "grid", placeItems: "center", cursor: "pointer" }}>
                <Bell size={17} />
                {activeMentor > 0 && <span style={{ position: "absolute", top: 9, right: 10, width: 8, height: 8, borderRadius: "50%", background: "#e5484d", border: "2px solid #fff" }} />}
              </button>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${NAVY}, ${STEEL})`, color: "#fff", display: "grid", placeItems: "center", fontSize: 19, fontWeight: 800, fontFamily: "Sora", flexShrink: 0, boxShadow: `0 10px 22px -10px ${NAVY}` }}>
                {avatarChar}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Your Profile Highlights ────────────────────────────── */}
        <Reveal delay={0.05}>
          <Card title="Your Profile Highlights"
            action={<button onClick={() => setEditOpen(true)} style={{ background: "transparent", border: "none", color: STEEL, fontFamily: "Sora", fontWeight: 700, fontSize: 12.5, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}>Edit Profile <ArrowRight size={13} /></button>}
            bodyStyle={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: 6 }}>
            {highlights.map((h, i) => (
              <div key={h.label} style={{ display: "flex", alignItems: "center", flex: "1 1 200px", minWidth: 0 }}>
                <Highlight {...h} />
                {i < highlights.length - 1 && <span className="hl-divider" style={{ width: 1, alignSelf: "stretch", background: LINE, margin: "4px 0" }} />}
              </div>
            ))}
          </Card>
        </Reveal>

        {/* ── Row 1: Comparison Intelligence + Quick Actions ─────── */}
        <div className="dash-2col">
          {/* Comparison Intelligence */}
          <Reveal delay={0.1} style={{ display: "flex" }}>
            <Card style={{ flex: 1 }} bodyStyle={{}}
              title="Comparison Intelligence"
              action={
                <div style={{ display: "flex", gap: 6, background: "#f2f4f8", padding: 3, borderRadius: 10 }}>
                  {[["branch", "Branch vs. College"], ["placement", "Placement Trends"]].map(([k, lbl]) => (
                    <button key={k} onClick={() => setCmpTab(k)}
                      style={{ border: "none", cursor: "pointer", padding: "6px 11px", borderRadius: 8, fontFamily: "Sora", fontWeight: 700, fontSize: 11.5, color: cmpTab === k ? "#fff" : SLATE, background: cmpTab === k ? NAVY : "transparent", transition: "background .15s" }}>
                      {lbl}
                    </button>
                  ))}
                </div>
              }>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <FauxSelect label="Primary Selection" value="IIT Bombay — Computer Science"
                  options={["IIT Bombay — Computer Science", "IIT Delhi — Computer Science", "IIT Madras — Electrical"]} />
                <FauxSelect label="Comparison Baseline" value="IIT Madras — Data Science"
                  options={["IIT Madras — Data Science", "IIT Kanpur — Mechanical", "IIT Roorkee — Civil"]} />
              </div>

              <div style={{ marginTop: 20, background: "#f8f9fc", border: `1px solid ${LINE}`, borderRadius: 13, padding: "16px 16px 18px" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 12.5, color: SLATE }}>Predictive Match Score</span>
                  <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 900, fontSize: "1.5rem", color: INK }}>94%</span>
                </div>
                <div style={{ height: 12, borderRadius: 8, background: "#e6e9f1", overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "94%" }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                    style={{ height: "100%", borderRadius: 8, background: `linear-gradient(90deg, ${NAVY}, ${STEEL})` }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 16 }}>
                {[["JEE Grade", "8.4"], ["Faculty Ratio", "1:12"], ["Alumni Score", "A-"]].map(([l, v]) => (
                  <div key={l} style={{ textAlign: "center", padding: "12px 6px", background: "#fbfcfe", border: `1px solid ${LINE}`, borderRadius: 11 }}>
                    <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 800, fontSize: "1.25rem", color: INK }}>{v}</div>
                    <div style={{ fontSize: 10.5, color: LABEL, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", marginTop: 3 }}>{l}</div>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>

          {/* Quick Actions */}
          <Reveal delay={0.15} style={{ display: "flex" }}>
            <Card style={{ flex: 1 }} title="Quick Actions"
              bodyStyle={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {QUICK.map(({ label, icon: Ic, to, badge, dark }) => (
                <button key={label} onClick={() => navigate(to)}
                  style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 18, minHeight: 118, padding: "14px 14px 13px", borderRadius: 14, border: dark ? "none" : `1px solid ${LINE}`, background: dark ? `linear-gradient(150deg, ${NAVY}, #16233f)` : TILE, cursor: "pointer", textAlign: "left", transition: "transform .15s, box-shadow .15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 26px -14px rgba(29,42,72,.4)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                  {badge && <span style={{ position: "absolute", top: 11, right: 11, fontSize: 8.5, fontWeight: 800, letterSpacing: ".6px", color: STEEL, background: "#fff", padding: "3px 7px", borderRadius: 50, border: `1px solid ${LINE}` }}>{badge}</span>}
                  <span style={{ width: 40, height: 40, borderRadius: 11, background: dark ? "rgba(255,255,255,.14)" : "#fff", display: "grid", placeItems: "center", border: dark ? "none" : `1px solid ${LINE}` }}>
                    <Ic size={19} color={dark ? "#fff" : NAVY} />
                  </span>
                  <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13.5, color: dark ? "#fff" : INK, lineHeight: 1.25 }}>{label}</span>
                </button>
              ))}
            </Card>
          </Reveal>
        </div>

        {/* ── Row 2: Enrolled Programs + Future Trends ───────────── */}
        <div className="dash-2col">
          {/* Enrolled Programs */}
          <Reveal delay={0.1} style={{ display: "flex" }}>
            <Card style={{ flex: 1 }} title="Your Enrolled Programs">
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: SLATE, padding: "22px 0", justifyContent: "center", fontSize: 13.5 }}>
                  <Loader2 size={16} className="dash-spin" /> Loading your programs…
                </div>
              ) : plans.length > 0 ? (
                <>
                  {plans.map((p, i) => {
                    const mentor = isMentorshipPlan(p.plan);
                    return (
                      <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "13px 0", borderTop: i ? `1px solid ${LINE}` : "none" }}>
                        <span style={{ width: 42, height: 42, borderRadius: 12, background: mentor ? `linear-gradient(150deg, ${NAVY}, ${STEEL})` : TILE, display: "grid", placeItems: "center", flexShrink: 0 }}>
                          {mentor ? <GraduationCap size={20} color="#fff" /> : <Compass size={20} color={NAVY} />}
                        </span>
                        <div style={{ flex: 1, minWidth: 150 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 14, color: INK }}>{p.planLabel || p.plan}</span>
                            <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".5px", padding: "3px 8px", borderRadius: 50, background: mentor ? GREEN_BG : BLUE_BG, color: mentor ? GREEN_TX : BLUE_TX }}>
                              {mentor ? "ACTIVE" : "ENROLLED"}
                            </span>
                          </div>
                          <div style={{ fontSize: 11.5, color: LABEL, marginTop: 3 }}>Purchased {fmtDate(p.createdAt)}</div>
                        </div>
                        {mentor && (
                          <button onClick={() => navigate(`/mentorship-dashboard?plan=${encodeURIComponent(p.plan)}`)}
                            style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${LINE}`, background: "#fff", color: NAVY, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
                            <ArrowRight size={15} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <button onClick={() => navigate("/mentorship")}
                    style={{ width: "100%", marginTop: 14, padding: "12px 0", borderRadius: 12, border: `1.5px solid ${LINE}`, background: "#fff", color: NAVY, fontFamily: "Sora", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    Browse All Programs
                  </button>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 12px" }}>
                  <div style={{ fontSize: 13.5, color: SLATE, marginBottom: 14 }}>You haven't enrolled in any program yet.</div>
                  <button onClick={() => navigate("/mentorship")}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 18px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${NAVY}, ${STEEL})`, color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: `0 10px 24px -12px ${NAVY}` }}>
                    Explore mentorship plans <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </Card>
          </Reveal>

          {/* Future Trends */}
          <Reveal delay={0.15} style={{ display: "flex" }}>
            <Card style={{ flex: 1 }} title="Future Trends"
              action={
                <div style={{ display: "flex", gap: 12, fontSize: 11, fontWeight: 700, color: SLATE }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: NAVY }} /> Growth</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: "#a9b7d0" }} /> Projection</span>
                </div>
              }>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, height: 150, padding: "0 2px" }}>
                {bars.map((b) => (
                  <div key={b.yr} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 7, height: "100%", justifyContent: "flex-end" }}>
                    <motion.div initial={{ height: 0 }} whileInView={{ height: `${b.h}%` }} viewport={{ once: true }} transition={{ duration: .7, ease: [0.4, 0, 0.2, 1] }}
                      style={{ width: "100%", maxWidth: 30, borderRadius: "6px 6px 3px 3px", background: b.kind === "growth" ? `linear-gradient(180deg, ${STEEL}, ${NAVY})` : "#a9b7d0" }} />
                    <span style={{ fontSize: 10.5, color: LABEL, fontWeight: 700 }}>{b.yr}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16, display: "flex", gap: 11, background: TILE, borderRadius: 12, padding: "13px 14px" }}>
                <span style={{ width: 30, height: 30, borderRadius: 9, background: "#fff", display: "grid", placeItems: "center", flexShrink: 0, border: `1px solid ${LINE}` }}>
                  <Zap size={15} color={STEEL} />
                </span>
                <div style={{ fontSize: 12.5, color: SLATE, lineHeight: 1.55 }}>
                  <strong style={{ color: INK, fontFamily: "Sora", fontWeight: 800 }}>AI Insight:</strong> Based on current rank trends, Computer Science demand is expected to peak in 2028. Consider specialization in AI/ML for long-term growth.
                </div>
              </div>
            </Card>
          </Reveal>
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
            style={{ position: "fixed", inset: 0, zIndex: 4000, background: "rgba(29,42,72,.55)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", display: "grid", placeItems: "center", padding: 20 }}>
            <motion.div initial={{ opacity: 0, scale: .92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .94, y: 12 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }} onClick={(e) => e.stopPropagation()}
              style={{ width: "min(380px,100%)", background: "#fff", borderRadius: 20, padding: "26px 24px 22px", boxShadow: "0 30px 80px rgba(29,42,72,.4)", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 14px", background: TILE, display: "grid", placeItems: "center" }}>
                <LogOut size={26} color={STEEL} />
              </div>
              <h3 style={{ ...serifHead, fontSize: "1.3rem", margin: "0 0 6px" }}>Log out?</h3>
              <p style={{ fontSize: ".95rem", color: SLATE, margin: "0 0 20px", lineHeight: 1.5 }}>Are you sure you want to log out of your account?</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setConfirmLogout(false)} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", color: NAVY, fontWeight: 700, cursor: "pointer" }}>No</button>
                <button onClick={() => { logout(); setConfirmLogout(false); navigate("/"); }} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", background: "#e5484d", color: "#fff", fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 18px -6px #e5484d" }}>Yes, log out</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* logout trigger lives in the header menu on smaller builds; expose via keyboard-free path */}
      <button onClick={() => setConfirmLogout(true)} aria-label="Log out"
        style={{ position: "fixed", bottom: 22, right: 22, zIndex: 30, display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 16px", borderRadius: 50, border: `1px solid ${LINE}`, background: "#fff", color: "#e5484d", fontFamily: "Sora", fontWeight: 700, fontSize: 12.5, cursor: "pointer", boxShadow: "0 10px 28px -12px rgba(29,42,72,.5)" }}>
        <LogOut size={14} /> Logout
      </button>

      <style>{`@keyframes dashspin{to{transform:rotate(360deg)}}
        .dash-spin{display:inline-block;animation:dashspin .8s linear infinite;vertical-align:middle;margin-right:6px}
        .dash-2col{display:grid;grid-template-columns:1.15fr .85fr;gap:18px;align-items:stretch}
        @media (max-width:780px){.dash-2col{grid-template-columns:1fr}.hl-divider{display:none}}`}</style>
    </section>
  );
}
