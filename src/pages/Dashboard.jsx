import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, MapPin, GraduationCap, Hash, Calendar, LogOut,
  CreditCard, CheckCircle2, ArrowRight, Sparkles, ShieldCheck, BookOpen, Loader2,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";
import { apiMyEnrollments } from "../auth/api.js";

const ORANGE = "#F47B20";
const NAVY = "#0d1b3e";

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
  margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8,
};

export default function Dashboard() {
  const { user, token, isLoggedIn, logout, openLogin } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmLogout, setConfirmLogout] = useState(false);

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

        {/* Profile details */}
        <h2 style={sectionTitle}><User size={18} color={ORANGE} /> Your details</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 30 }}>
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

        {/* Purchased plans */}
        <h2 style={sectionTitle}><CreditCard size={18} color={ORANGE} /> Your plans &amp; purchases</h2>
        {loading ? (
          <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 16, padding: "40px", textAlign: "center", color: "#9ca3af", marginBottom: 30 }}>
            <Loader2 size={22} className="dash-spin" /> Loading your plans…
          </div>
        ) : plans.length === 0 ? (
          <div style={{ background: "#fff", border: "1px dashed #e5b894", borderRadius: 16, padding: "34px 24px", textAlign: "center", marginBottom: 30 }}>
            <div style={{ fontSize: 15, color: "#6b7280", marginBottom: 14 }}>You haven't purchased any plan yet.</div>
            <button onClick={() => navigate("/mentorship")} style={{ background: ORANGE, color: "#fff", border: "none", padding: "11px 20px", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Sora", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Explore mentorship &amp; counselling <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 14, marginBottom: 30 }}>
            {plans.map((p) => (
              <div key={p._id} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: `${ORANGE}12`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Sparkles size={20} color={ORANGE} />
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 16, color: NAVY }}>{p.planLabel || p.plan}</div>
                  <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 2 }}>
                    Purchased {fmtDate(p.createdAt)} · Payment ID {p.razorpayPaymentId || "—"}
                  </div>
                </div>
                <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 18, color: NAVY }}>₹{Number(p.amount || 0).toLocaleString("en-IN")}</div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#15803d", background: "#dcfce7", borderRadius: 20, padding: "5px 12px" }}>
                  <CheckCircle2 size={14} /> Active
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Quick links to the heavy content pages */}
        <h2 style={sectionTitle}><BookOpen size={18} color={ORANGE} /> Continue learning</h2>
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
