import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, MapPin, GraduationCap, Hash, Calendar, LogOut,
  ArrowRight, Sparkles, ShieldCheck, Loader2, Check, Compass, Pencil, X,
  CreditCard, Bot, Crosshair, Gauge, GitCompare, Users,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";
import { apiMyEnrollments, apiUpdateProfile } from "../auth/api.js";

const ORANGE = "#FF693D";
const GOLD = "#FF693D";
const GREEN = "#15a06e";
const NAVY = "#0d1b3e";
const INDIGO = "#6366f1";
const TEAL = "#0ea5a4";
const CYAN = "#0ea5e9";

/* hex → rgba helper for translucent accent washes */
const tint = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const CARD_SHADOW = "0 5px 22px rgba(33,29,46,.06)";
const CARD_LINE = "rgba(33,29,46,.08)";

const isMentorshipPlan = (key) => String(key || "").startsWith("mentor-");
const groupForPlan = (key) =>
  isMentorshipPlan(key)
    ? { accent: ORANGE, soft: "#fff6ee", icon: GraduationCap }
    : { accent: GREEN, soft: "#f0faf4", icon: Compass };

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

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
function Panel({ title, icon: Icon, iconColor = ORANGE, action, children, style }) {
  return (
    <section style={{ background: "#fff", border: `1px solid ${CARD_LINE}`, borderRadius: 16, boxShadow: CARD_SHADOW, padding: "16px 18px", ...style }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
          <h2 style={sectionTitle}>{Icon && <Icon size={16} color={iconColor} />} {title}</h2>
          {action}
        </div>
      )}
      {children}
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

  const details = [
    { label: "Full Name",         value: user?.name || "Student",      icon: User },
    { label: "Email",             value: user?.email || "—",           icon: Mail },
    { label: "Phone",             value: user?.phone || "—",           icon: Phone },
    { label: "Coaching",          value: user?.coaching || "—",        icon: GraduationCap },
    { label: "Home State",        value: user?.homeState || "—",       icon: MapPin },
    { label: "JEE Main Rank",     value: user?.jeeMainsRank ?? "—",    icon: Hash },
    { label: "JEE Advanced Rank", value: user?.jeeAdvancedRank ?? "—", icon: Hash },
    { label: "Member Since",      value: fmtDate(user?.createdAt),     icon: Calendar },
  ];

  const hasAnyPlan = plans.length > 0;

  const QUICK_LINKS = [
    { label: "Rank Predictor",      icon: Gauge,     color: ORANGE,    to: "/jee-main#rank" },
    { label: "College Predictor",   icon: Crosshair, color: INDIGO,    to: "/jee-advanced#college" },
    { label: "Compare Colleges",    icon: GitCompare, color: TEAL,     to: "/compare" },
    { label: "Counselling Planner", icon: Calendar,  color: "#8b5cf6", to: "/planner" },
    { label: "Explore Colleges",    icon: Compass,   color: GREEN,     to: "/colleges" },
    { label: "Community",           icon: Users,     color: CYAN,      to: "/community" },
  ];

  return (
    <section id="top" style={{ background: "#ffffff", padding: "112px 0 60px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 18px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Welcome header */}
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", background: "#fff", border: `1px solid ${CARD_LINE}`, borderRadius: 18, boxShadow: CARD_SHADOW, padding: "18px 20px" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${ORANGE}, ${GOLD})`, color: "#fff", display: "grid", placeItems: "center", fontSize: 23, fontWeight: 800, fontFamily: "Sora", flexShrink: 0, boxShadow: `0 10px 24px -10px ${ORANGE}` }}>
              {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.35rem", color: NAVY, letterSpacing: "-0.4px" }}>Welcome back, {firstName} 👋</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Your College Parichay space — profile, plans and tools in one place.</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setEditOpen(true)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 11, border: `1.5px solid ${CARD_LINE}`, background: "#fff", color: NAVY, fontFamily: "Sora", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                <Pencil size={14} /> Edit
              </button>
              <button onClick={() => setConfirmLogout(true)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 11, border: "1.5px solid #fde0da", background: "#fff", color: "#e5484d", fontFamily: "Sora", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </Reveal>

        {/* AI assistant card */}
        <Reveal delay={0.05}>
          <div style={{ position: "relative", overflow: "hidden", borderRadius: 20, padding: "24px", background: `linear-gradient(135deg, ${NAVY} 0%, #14264f 55%, ${tint(ORANGE, .5)} 145%)`, color: "#fff", boxShadow: "0 18px 44px -22px rgba(13,27,62,.6)" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
              style={{ position: "absolute", top: -70, right: -60, width: 200, height: 200, borderRadius: "50%", background: `conic-gradient(${tint(ORANGE, .5)}, transparent 60%)`, filter: "blur(6px)", pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", position: "relative" }}>
              <div style={{ width: 52, height: 52, borderRadius: 15, background: "rgba(255,255,255,.14)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Bot size={26} color="#fff" />
              </div>
              <div style={{ flex: 1, minWidth: 210 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 800, letterSpacing: "1px", background: "rgba(255,255,255,.14)", padding: "4px 11px", borderRadius: 50, marginBottom: 8 }}><Sparkles size={12} /> AI ASSISTANT</span>
                <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-0.4px", lineHeight: 1.2 }}>College Parichay AI — your 24×7 doubt solver</div>
                <div style={{ fontSize: 13.5, color: "rgba(255,255,255,.82)", marginTop: 5, lineHeight: 1.55, maxWidth: 560 }}>Ask any JEE / NEET doubt and get clear step-by-step solutions, notes and quizzes — instantly.</div>
              </div>
              <button onClick={() => navigate("/ai")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12, border: "none", background: "#fff", color: NAVY, fontFamily: "Sora", fontWeight: 800, fontSize: 14, cursor: "pointer", flexShrink: 0 }}>
                Ask a doubt <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Your details */}
        <Reveal delay={0.1}>
          <Panel title="Your details" icon={User}
            action={<button onClick={() => setEditOpen(true)} style={{ background: "transparent", border: "none", color: ORANGE, fontFamily: "Sora", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}><Pencil size={12} /> Edit</button>}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px 20px" }}>
              {details.map(({ label, value, icon: Ic }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <span style={{ width: 34, height: 34, borderRadius: 10, background: tint(ORANGE, 0.09), display: "grid", placeItems: "center", flexShrink: 0 }}><Ic size={15} color={ORANGE} /></span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{label}</div>
                    <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13.5, color: NAVY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </Reveal>

        {/* My plans */}
        <Reveal delay={0.15}>
          <Panel title="My Plans" icon={CreditCard}>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#9ca3af", padding: "16px 0", justifyContent: "center", fontSize: 13.5 }}>
                <Loader2 size={16} className="dash-spin" /> Loading your plans…
              </div>
            ) : hasAnyPlan ? (
              <div>
                {plans.map((p, i) => {
                  const g = groupForPlan(p.plan);
                  const GIcon = g.icon;
                  const mentor = isMentorshipPlan(p.plan);
                  return (
                    <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "13px 0", borderTop: i ? `1px solid ${CARD_LINE}` : "none" }}>
                      <span style={{ width: 40, height: 40, borderRadius: 11, background: g.soft, display: "grid", placeItems: "center", flexShrink: 0 }}><GIcon size={19} color={g.accent} /></span>
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13.5, color: NAVY }}>{p.planLabel || p.plan}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>Purchased {fmtDate(p.createdAt)}{p.razorpayPaymentId ? ` · ${p.razorpayPaymentId}` : ""}</div>
                      </div>
                      {mentor && (
                        <button onClick={() => navigate(`/mentorship-dashboard?plan=${encodeURIComponent(p.plan)}`)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 13px", borderRadius: 10, border: "none", background: g.accent, color: "#fff", fontFamily: "Sora", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
                          Open <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "22px 16px" }}>
                <div style={{ fontSize: 13.5, color: "#6b7280", marginBottom: 12 }}>You haven't enrolled in any plan yet.</div>
                <button onClick={() => navigate("/mentorship")}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 11, border: "none", background: `linear-gradient(135deg, ${ORANGE}, ${GOLD})`, color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: `0 10px 24px -10px ${ORANGE}` }}>
                  Explore mentorship plans <ArrowRight size={14} />
                </button>
              </div>
            )}
          </Panel>
        </Reveal>

        {/* Quick links */}
        <Reveal delay={0.2}>
          <Panel title="Quick links" icon={Compass}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
              {QUICK_LINKS.map(({ label, icon: Ic, color, to }) => (
                <button key={label} onClick={() => navigate(to)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 13px", borderRadius: 12, border: `1px solid ${CARD_LINE}`, background: "#fff", cursor: "pointer", textAlign: "left", transition: "border-color .15s, transform .15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = tint(color, .5); e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = CARD_LINE; e.currentTarget.style.transform = "none"; }}>
                  <span style={{ width: 34, height: 34, borderRadius: 10, background: tint(color, 0.12), display: "grid", placeItems: "center", flexShrink: 0 }}><Ic size={16} color={color} /></span>
                  <span style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13, color: NAVY }}>{label}</span>
                </button>
              ))}
            </div>
          </Panel>
        </Reveal>

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

      <style>{`@keyframes dashspin{to{transform:rotate(360deg)}}
        .dash-spin{display:inline-block;animation:dashspin .8s linear infinite;vertical-align:middle;margin-right:6px}`}</style>
    </section>
  );
}
