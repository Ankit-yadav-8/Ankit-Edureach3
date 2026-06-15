import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, MapPin, GraduationCap, Hash, Calendar, LogOut,
  CreditCard, CheckCircle2, ArrowRight, Sparkles, ShieldCheck, BookOpen, Loader2,
  Check, Compass,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";
import { apiMyEnrollments } from "../auth/api.js";

const ORANGE = "#F47B20";
const GOLD = "#f5a623";
const GREEN = "#15a06e";
const NAVY = "#0d1b3e";

// Which plan keys belong to which product line (kept in sync with
// server/routes/payment.js PLANS). Mentorship keys all start with "mentor-".
const COUNSELLING_KEYS = ["josaa", "all-colleges"];
const isMentorshipPlan = (key) => String(key || "").startsWith("mentor-");
const isCounsellingPlan = (key) => COUNSELLING_KEYS.includes(key);

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

  // Split the user's purchases into the two product lines and render a big
  // card for each — owned plans show an "enrolled" state, the rest a CTA.
  const CATEGORIES = [
    {
      key: "mentorship",
      title: "Mentorship",
      tag: "1-on-1 IITian / doctor mentor",
      desc: "A personal mentor, daily targets, weekly test analysis and a roadmap built around your backlog and target rank.",
      icon: GraduationCap,
      accent: ORANGE,
      accent2: GOLD,
      soft: "#fff6ee",
      to: "/mentorship",
      cta: "Explore mentorship",
      features: [
        "Personal 1-on-1 mentor",
        "Daily targets & accountability",
        "Weekly test analysis",
        "Parent weekly progress booklet",
      ],
      owned: plans.filter((p) => isMentorshipPlan(p.plan)),
    },
    {
      key: "counselling",
      title: "Counselling",
      tag: "JoSAA · CSAB · All-college guidance",
      desc: "Expert choice-filling and a personalised college list tailored to your rank — across JoSAA, CSAB and every other counselling.",
      icon: Compass,
      accent: GREEN,
      accent2: "#22c55e",
      soft: "#f0faf4",
      to: "/josaa-2026",
      cta: "Explore counselling",
      features: [
        "Expert JoSAA + CSAB choice-filling",
        "Personalised college list for your rank",
        "Every counselling round covered",
        "1-on-1 guidance from a mentor",
      ],
      owned: plans.filter((p) => isCounsellingPlan(p.plan)),
    },
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

        {/* Purchased plans — one big card per product line (Mentorship & Counselling) */}
        <h2 style={sectionTitle}><CreditCard size={18} color={ORANGE} /> Your plans &amp; purchases</h2>
        {loading ? (
          <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 16, padding: "40px", textAlign: "center", color: "#9ca3af", marginBottom: 34 }}>
            <Loader2 size={22} className="dash-spin" /> Loading your plans…
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 20, marginBottom: 34 }}>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const owned = cat.owned;
              const has = owned.length > 0;
              return (
                <motion.div key={cat.key} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  style={{
                    background: "#fff", borderRadius: 22, border: `1px solid ${cat.accent}33`,
                    position: "relative", overflow: "hidden", display: "flex", flexDirection: "column",
                    boxShadow: `0 24px 50px -30px ${cat.accent}80`,
                  }}>
                  {/* top accent bar */}
                  <div style={{ height: 5, background: `linear-gradient(90deg, ${cat.accent}, ${cat.accent2})` }} />

                  <div style={{ padding: "24px 26px 28px", display: "flex", flexDirection: "column", flex: 1 }}>
                    {/* header */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                      <div style={{ width: 54, height: 54, borderRadius: 16, background: `${cat.accent}14`, border: `1px solid ${cat.accent}30`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <Icon size={26} color={cat.accent} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.32rem", color: NAVY }}>{cat.title}</div>
                        <div style={{ fontSize: 12.5, color: "#9ca3af", fontWeight: 600, marginTop: 1 }}>{cat.tag}</div>
                      </div>
                      {has ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 800, color: "#15803d", background: "#dcfce7", borderRadius: 20, padding: "6px 13px", flexShrink: 0 }}>
                          <CheckCircle2 size={14} /> Enrolled
                        </span>
                      ) : (
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: "#9ca3af", background: "#f3f4f6", borderRadius: 20, padding: "6px 13px", flexShrink: 0 }}>
                          Not enrolled
                        </span>
                      )}
                    </div>

                    <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6, margin: "0 0 18px" }}>{cat.desc}</p>

                    {has ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* "you have this plan" confirmation banner */}
                        <div style={{ display: "flex", alignItems: "center", gap: 11, background: cat.soft, border: `1px solid ${cat.accent}33`, borderRadius: 14, padding: "13px 15px" }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: cat.accent, display: "grid", placeItems: "center", flexShrink: 0 }}>
                            <Check size={18} color="#fff" strokeWidth={3} />
                          </div>
                          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 14.5, color: NAVY, lineHeight: 1.35 }}>
                            You have {owned.length > 1 ? `${owned.length} active ${cat.title.toLowerCase()} plans` : `an active ${cat.title.toLowerCase()} plan`}
                          </div>
                        </div>

                        {/* each owned plan */}
                        {owned.map((p) => (
                          <div key={p._id} style={{ background: "#fff", border: "1px solid #eef0f2", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                            <div style={{ width: 40, height: 40, borderRadius: 11, background: `${cat.accent}12`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                              <Sparkles size={18} color={cat.accent} />
                            </div>
                            <div style={{ flex: 1, minWidth: 140 }}>
                              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 14.5, color: NAVY }}>{p.planLabel || p.plan}</div>
                              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                                Purchased {fmtDate(p.createdAt)} · ID {p.razorpayPaymentId || "—"}
                              </div>
                            </div>
                            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 16, color: NAVY }}>₹{Number(p.amount || 0).toLocaleString("en-IN")}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
                          {cat.features.map((f) => (
                            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ width: 22, height: 22, borderRadius: "50%", background: `${cat.accent}14`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                                <Check size={13} color={cat.accent} strokeWidth={3} />
                              </span>
                              <span style={{ color: "#374151", fontSize: 13.5 }}>{f}</span>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => navigate(cat.to)}
                          style={{
                            marginTop: "auto", width: "100%", padding: "14px", borderRadius: 13, border: "none",
                            background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent2})`, color: "#fff",
                            fontFamily: "Sora", fontWeight: 800, fontSize: 15, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            boxShadow: `0 12px 26px -10px ${cat.accent}99`,
                          }}>
                          {cat.cta} <ArrowRight size={17} />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
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
