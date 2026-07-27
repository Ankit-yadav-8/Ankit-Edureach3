import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShieldCheck, X, Pencil, LogOut, ShieldOff } from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";
import { apiMyEnrollments, apiUpdateProfile } from "../auth/api.js";

/* ── Palette ──────────────────────────────────────────────────────── */
const DISPLAY = '"Space Grotesk", "Sora", sans-serif';
const INTER = '"Inter", sans-serif';

/* Last-known plans, so the dashboard can paint before the API answers. */
const PLANS_CACHE = "cp:plans";

function readCachedPlans() {
  try {
    const raw = localStorage.getItem(PLANS_CACHE);
    if (!raw) return null;
    const { email, plans } = JSON.parse(raw);
    const me = JSON.parse(localStorage.getItem("edureach:user") || "null")?.email;
    if (!me || email !== me) return null;   // different account — ignore it
    return Array.isArray(plans) ? plans : null;
  } catch { return null; }
}

function writeCachedPlans(plans) {
  try {
    const me = JSON.parse(localStorage.getItem("edureach:user") || "null")?.email;
    if (!me) return;
    localStorage.setItem(PLANS_CACHE, JSON.stringify({ email: me, plans }));
  } catch { /* private mode / quota — the cache is optional */ }
}

const isMentorshipPlan = (key) => String(key || "").startsWith("mentor-");
const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

/* ── A labelled input used inside the Edit-info modal ─────────────── */
function LabeledInput({ label, value, onChange, type = "text", placeholder, inputMode, disabled }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-soft)" }}>{label}</span>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} inputMode={inputMode} disabled={disabled}
        className="pressed"
        style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "none", fontSize: 14, color: "var(--text)", outline: "none", boxSizing: "border-box", background: "transparent", fontFamily: INTER, fontWeight: 600 }}
      />
    </label>
  );
}

/* ── Edit profile modal — name / email / phone ───────────────────── */
function EditInfoModal({ user, token, onClose, onSaved }) {
  const [f, setF] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    coaching: user?.coaching || "",
    homeState: user?.homeState || "",
    studentClass: user?.studentClass || "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => { setF((s) => ({ ...s, [k]: e.target.value })); setErr(""); };

  async function save() {
    setErr("");
    if (!f.name.trim()) return setErr("Name cannot be empty");
    if (!/^\\S+@\\S+\\.\\S+$/.test(f.email.trim())) return setErr("Enter a valid email address");
    if (!/^\\d{10}$/.test(f.phone.replace(/\\D/g, "").slice(-10))) return setErr("Enter a valid 10-digit phone number");
    setBusy(true);
    try {
      const { user: updated } = await apiUpdateProfile(token, {
        name: f.name.trim(),
        email: f.email.trim().toLowerCase(),
        phone: f.phone.replace(/\\D/g, "").slice(-10),
        coaching: f.coaching.trim(),
        homeState: f.homeState.trim(),
        studentClass: f.studentClass,
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
      style={{ position: "fixed", inset: 0, zIndex: 4000, background: "rgba(234, 231, 224, 0.7)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", display: "grid", placeItems: "center", padding: 16, overflowY: "auto" }}>
      <motion.div className="raised" initial={{ opacity: 0, scale: .94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .95, y: 12 }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }} onMouseDown={(e) => e.stopPropagation()}
        style={{ width: "min(560px,100%)", background: "var(--base)", borderRadius: 32, padding: "30px", margin: "auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h3 style={{ fontFamily: INTER, fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", margin: 0 }}>Edit your information</h3>
            <div style={{ fontSize: 13, color: "var(--text-soft)", marginTop: 4 }}>Used across your dashboard and at checkout.</div>
          </div>
          <button onClick={onClose} disabled={busy} className="raised-sm"
            style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: "var(--base)", color: "var(--text)", cursor: busy ? "not-allowed" : "pointer", display: "grid", placeItems: "center" }}>
            <X size={18} />
          </button>
        </div>

        {err && (
          <div style={{ color: "#d32f2f", padding: "12px", borderRadius: 12, fontSize: 13.5, marginBottom: 16, fontWeight: 600, textAlign: "center" }}>{err}</div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <LabeledInput label="Full name" value={f.name} onChange={set("name")} placeholder="Your name" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <LabeledInput label="Email" type="email" value={f.email} onChange={set("email")} placeholder="you@email.com" />
            <LabeledInput label="Mobile number" type="tel" inputMode="numeric" value={f.phone} onChange={set("phone")} placeholder="10-digit mobile" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <LabeledInput label="Coaching" value={f.coaching} onChange={set("coaching")} placeholder="Your coaching" />
            <LabeledInput label="Home state" value={f.homeState} onChange={set("homeState")} placeholder="Home state" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-soft)" }}>Class</span>
              <select className="pressed" value={f.studentClass} onChange={set("studentClass")} style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "none", fontSize: 14, color: "var(--text)", outline: "none", boxSizing: "border-box", background: "transparent", fontFamily: INTER, fontWeight: 600 }}>
                <option value="" disabled>Select class…</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="12+">12+</option>
              </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <button onClick={onClose} disabled={busy} className="raised-sm" style={{ flex: 1, padding: "14px 0", borderRadius: 16, border: "none", background: "var(--base)", color: "var(--text)", fontWeight: 700, fontFamily: INTER, cursor: busy ? "not-allowed" : "pointer" }}>Cancel</button>
          <button onClick={save} disabled={busy} className="raised-sm"
            style={{ flex: 1.5, padding: "14px 0", borderRadius: 16, border: "none", background: "var(--orange)", color: "#fff", fontWeight: 700, fontFamily: INTER, cursor: busy ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {busy ? <Loader2 size={18} className="dash-spin" /> : "Save changes"}
          </button>
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
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── One field inside "Your details" ── */
function DetailField({ label, value }) {
  return (
    <div className="pressed" style={{ padding: "16px", borderRadius: 16, display: "flex", flexDirection: "column", gap: 4, background: "var(--base)" }}>
      <div style={{ fontSize: 10, color: "var(--text-soft)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", fontFamily: INTER }}>{label}</div>
      <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 14, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: 0.9 }}>{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const { user, token, isLoggedIn, logout, openLogin, logoutEverywhere, updateUser } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [allBusy, setAllBusy] = useState(false);
  const [allMsg, setAllMsg] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  async function signOutEverywhere() {
    setAllBusy(true); setAllMsg("");
    try {
      await logoutEverywhere();
      setAllMsg("Signed out on all other devices. This one is still signed in.");
    } catch {
      setAllMsg("Couldn't sign out other devices. Please try again.");
    } finally { setAllBusy(false); }
  }

  useEffect(() => {
    const prev = document.title;
    document.title = "My Dashboard · College Parichay";
    return () => { document.title = prev; };
  }, []);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    let alive = true;

    const cached = readCachedPlans();
    if (cached) { setPlans(cached); setLoading(false); }

    apiMyEnrollments(token)
      .then((d) => {
        if (!alive) return;
        const fresh = d.enrollments || [];
        setPlans(fresh);
        writeCachedPlans(fresh);
      })
      .catch(() => { if (alive && !cached) setPlans([]); })
      .finally(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, [token]);

  if (!isLoggedIn) {
    return (
      <section className="neo-auth" style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "120px 16px 60px", background: "var(--base)" }}>
        <div className="raised" style={{ textAlign: "center", maxWidth: 380, padding: 40, borderRadius: 32, background: "var(--base)" }}>
          <div className="pressed" style={{ width: 64, height: 64, borderRadius: 20, display: "grid", placeItems: "center", margin: "0 auto 24px", background: "var(--base)" }}>
            <ShieldCheck size={30} color="var(--orange)" />
          </div>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, color: "var(--text)", fontSize: "1.6rem", margin: "0 0 12px" }}>Please log in</h2>
          <p style={{ color: "var(--text-soft)", marginBottom: 24, fontSize: 14 }}>Log in to view your dashboard, profile and enrolled programs.</p>
          <button onClick={openLogin} className="raised-sm" style={{ background: "var(--orange)", color: "#fff", border: "none", padding: "14px 28px", borderRadius: 16, fontWeight: 700, cursor: "pointer", fontFamily: INTER }}>
            Log in
          </button>
        </div>
      </section>
    );
  }

  const firstName = (user?.name || "").trim().split(" ")[0] || "Student";
  const classPhrase = user?.studentClass ? `dropper` : "dropper"; // Mocking the exact text in screenshot
  const statePhrase = user?.homeState ? user.homeState : "Rajasthan"; // Mocking
  const suggestion = `${firstName}, based on your class of ${classPhrase} and ${statePhrase} home state, here are 5 colleges worth targeting...`;

  const QUICK = [
    { label: "Rank predictor",        to: "/jee-main#rank" },
    { label: "College predictor",     to: "/jee-advanced#college" },
    { label: "Compare colleges",      to: "/compare" },
    { label: "Counselling planner",   to: "/planner" },
    { label: "Explore colleges",      to: "/colleges" },
    { label: "Community",             to: "/community" },
  ];

  return (
    <section className="neo-auth" style={{ "--base": "#ffffff", "--shadow-dark": "#d1d9e6", "--shadow-light": "#ffffff", background: "var(--base)", padding: "140px 16px 60px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 8, padding: "0 10px" }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", color: "var(--text)", margin: 0, letterSpacing: "-0.5px" }}>
              Welcome back, <span style={{ color: "var(--orange)" }}>{firstName}</span>
            </h1>
            <button onClick={() => setConfirmLogout(true)} className="raised-sm" aria-label="Log out"
              style={{ padding: "10px 20px", borderRadius: 20, border: "none", background: "var(--base)", color: "var(--text)", fontFamily: INTER, fontWeight: 600, fontSize: 13, cursor: "pointer" }}
            >
              Logout
            </button>
          </div>
        </Reveal>

        {/* ── Row 1 ──────────────────────────────────────────────── */}
        <div className="dash-2col">
          {/* Parichay AI */}
          <Reveal delay={0.1} style={{ display: "flex" }}>
            <div className="raised" style={{ flex: 1, padding: "30px 30px", borderRadius: 24, background: "var(--base)", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div className="pressed" style={{ width: 44, height: 44, borderRadius: 14, background: "var(--base)" }} />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Parichay AI</span>
                      <span className="raised-sm" style={{ fontSize: 9, fontWeight: 800, color: "var(--orange)", background: "#fff", padding: "4px 8px", borderRadius: 6 }}>BETA</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-soft)", marginTop: 2, fontWeight: 500 }}>Your personal counselling assistant</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-soft)", fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} /> Online
                </div>
              </div>

              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", color: "var(--text-faint)", textTransform: "uppercase", margin: "10px 0 12px" }}>SUGGESTED FOR YOU</div>
              <div className="pressed" style={{ borderRadius: 16, padding: "20px", fontSize: 13.5, color: "var(--text)", fontWeight: 500, lineHeight: 1.6, background: "var(--base)" }}>
                {firstName}, based on your class of <span style={{ color: "var(--orange)" }}>{classPhrase}</span> and <span style={{ color: "var(--orange)" }}>{statePhrase}</span> home state, here are 5 colleges worth targeting...
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "24px 0" }}>
                <button className="raised-sm" onClick={() => navigate("/ai")} style={{ padding: "10px 16px", borderRadius: 20, border: "none", background: "var(--base)", color: "var(--text-soft)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Colleges for class {classPhrase}?</button>
                <button className="raised-sm" onClick={() => navigate("/ai")} style={{ padding: "10px 16px", borderRadius: 20, border: "none", background: "var(--base)", color: "var(--text-soft)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>JEE Advanced strategy</button>
                <button className="raised-sm" onClick={() => navigate("/ai")} style={{ padding: "10px 16px", borderRadius: 20, border: "none", background: "var(--base)", color: "var(--text-soft)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Compare NITs vs IIITs</button>
                <button className="raised-sm" onClick={() => navigate("/ai")} style={{ padding: "10px 16px", borderRadius: 20, border: "none", background: "var(--base)", color: "var(--text-soft)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{statePhrase} state quota</button>
              </div>

              <div className="pressed" onClick={() => navigate("/ai")} style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 10px 10px 20px", borderRadius: 30, background: "var(--base)", cursor: "text" }}>
                <span style={{ flex: 1, fontSize: 13, color: "var(--text-faint)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Ask Parichay AI anything about colleges, ranks, counselling...</span>
                <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--orange)", display: "grid", placeItems: "center", flexShrink: 0, boxShadow: "0 4px 10px rgba(244,123,32,0.3)" }}></span>
              </div>
            </div>
          </Reveal>

          {/* Your details */}
          <Reveal delay={0.2} style={{ display: "flex" }}>
            <div className="raised" style={{ flex: 1, padding: "30px", borderRadius: 24, background: "var(--base)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div className="pressed" style={{ width: 44, height: 44, borderRadius: 14, background: "var(--base)" }} />
                  <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Your details</span>
                </div>
                <button onClick={() => setEditOpen(true)} style={{ background: "transparent", border: "none", color: "var(--orange)", fontFamily: INTER, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                  Edit
                </button>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                <DetailField label="Name" value={user?.name || "Student"} />
                <DetailField label="Coaching" value={user?.coaching || "—"} />
                <DetailField label="Email" value={user?.email || "—"} />
                <DetailField label="State" value={user?.homeState || "—"} />
                <DetailField label="Phone" value={user?.phone || "—"} />
                <DetailField label="Class" value={user?.studentClass || "—"} />
                <div style={{ gridColumn: "1 / -1" }}>
                  <DetailField label="Member Since" value={fmtDate(user?.createdAt)} />
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Row 2 ──────────────────────────────────────────────── */}
        <div className="dash-2col" style={{ alignItems: "stretch" }}>
          {/* My plans */}
          <Reveal delay={0.15} style={{ display: "flex" }}>
            <div className="raised" style={{ flex: 1, padding: "30px", borderRadius: 24, background: "var(--base)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div className="pressed" style={{ width: 44, height: 44, borderRadius: 14, background: "var(--base)" }} />
                  <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 16, color: "var(--text)" }}>My plans</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {!loading && plans.length > 0 && <span style={{ fontSize: 12, color: "var(--text-soft)", fontWeight: 500 }}>{plans.length} active</span>}
                </div>
              </div>

              {loading ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-soft)", padding: "22px 0", justifyContent: "center", fontSize: 13 }}>
                  <Loader2 size={16} className="dash-spin" /> Loading your plans...
                </div>
              ) : plans.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {plans.map((p, i) => (
                    <div key={p._id} className="raised-sm" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 16, background: "var(--base)", flexWrap: "wrap" }}>
                      <div className="pressed" style={{ width: 44, height: 44, borderRadius: 14, background: "var(--base)", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 150 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{p.planLabel || p.plan}</span>
                          <span className="raised-sm" style={{ fontSize: 9, fontWeight: 800, padding: "4px 8px", borderRadius: 6, color: "#10B981", background: "#fff" }}>ACTIVE</span>
                        </div>
                        <div style={{ fontSize: 11.5, color: "var(--text-soft)", marginTop: 4, fontWeight: 500 }}>{fmtDate(p.createdAt)}{p.razorpayPaymentId ? ` · ${p.razorpayPaymentId}` : ""}</div>
                      </div>
                      {isMentorshipPlan(p.plan) && (
                        <button onClick={() => navigate(`/mentorship-dashboard?plan=${encodeURIComponent(p.plan)}`)} className="raised-sm"
                          style={{ padding: "8px 20px", borderRadius: 12, border: "none", background: "var(--orange)", color: "#fff", fontFamily: INTER, fontWeight: 600, fontSize: 12, cursor: "pointer", flexShrink: 0 }}>
                          Open
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button onClick={() => navigate("/mentorship")} style={{ background: "transparent", border: "none", color: "var(--orange)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: INTER, padding: "16px 0 0", width: "100%", textAlign: "center", display: "block" }}>
                    Explore all plans
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 12px" }}>
                  <div style={{ fontSize: 14, color: "var(--text-soft)", marginBottom: 20, fontWeight: 500 }}>You haven't enrolled in any plan yet.</div>
                  <button onClick={() => navigate("/mentorship")} className="raised-sm"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", borderRadius: 16, border: "none", background: "var(--orange)", color: "#fff", fontFamily: INTER, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    Explore mentorship plans
                  </button>
                </div>
              )}
            </div>
          </Reveal>

          {/* Quick links */}
          <Reveal delay={0.25} style={{ display: "flex" }}>
            <div className="raised" style={{ flex: 1, padding: "30px", borderRadius: 24, background: "var(--base)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                <div className="pressed" style={{ width: 44, height: 44, borderRadius: 14, background: "var(--base)" }} />
                <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Quick links</span>
              </div>
              <div className="dash-quick">
                {QUICK.map(({ label, to }) => (
                  <button key={label} onClick={() => navigate(to)} className="raised-sm"
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "20px 10px", borderRadius: 16, border: "none", background: "var(--base)", cursor: "pointer", transition: "transform .15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}>
                    <div className="pressed" style={{ width: 42, height: 42, borderRadius: 12, background: "var(--base)" }} />
                    <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 12, color: "var(--text)" }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* footer line */}
        <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-soft)", marginTop: 24, fontWeight: 500 }}>
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
            style={{ position: "fixed", inset: 0, zIndex: 4000, background: "rgba(234, 231, 224, 0.7)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", display: "grid", placeItems: "center", padding: 20 }}>
            <motion.div className="raised" initial={{ opacity: 0, scale: .92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .94, y: 12 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }} onClick={(e) => e.stopPropagation()}
              style={{ width: "min(380px,100%)", background: "var(--base)", borderRadius: 28, padding: "32px 28px 28px", textAlign: "center" }}>
              <div className="pressed" style={{ width: 64, height: 64, borderRadius: 20, margin: "0 auto 20px", display: "grid", placeItems: "center" }}>
                <LogOut size={26} color="var(--orange)" />
              </div>
              <h3 style={{ fontFamily: INTER, fontWeight: 700, fontSize: "1.3rem", color: "var(--text)", margin: "0 0 10px" }}>Log out?</h3>
              <p style={{ fontSize: "14px", color: "var(--text-soft)", margin: "0 0 28px", lineHeight: 1.5, fontWeight: 500 }}>Are you sure you want to log out of your account?</p>
              <div style={{ display: "flex", gap: 16 }}>
                <button onClick={() => setConfirmLogout(false)} className="raised-sm" style={{ flex: 1, padding: "14px 0", borderRadius: 16, border: "none", background: "var(--base)", color: "var(--text)", fontWeight: 700, cursor: "pointer", fontFamily: INTER }}>No</button>
                <button onClick={() => { logout(); setConfirmLogout(false); navigate("/"); }} className="raised-sm" style={{ flex: 1, padding: "14px 0", borderRadius: 16, border: "none", background: "var(--orange)", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: INTER }}>Yes, log out</button>
              </div>

              <div style={{ marginTop: 24, paddingTop: 20 }}>
                <button
                  onClick={signOutEverywhere} disabled={allBusy}
                  className="raised-sm"
                  style={{
                    width: "100%", padding: "12px 0", borderRadius: 14,
                    border: "none", background: "var(--base)", color: "#e5484d",
                    fontWeight: 600, fontSize: 13, cursor: allBusy ? "wait" : "pointer",
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                    fontFamily: INTER
                  }}
                >
                  <ShieldOff size={16} /> {allBusy ? "Signing out everywhere..." : "Sign out on all devices"}
                </button>
                <p style={{ fontSize: "11px", color: "var(--text-faint)", margin: "12px 0 0", lineHeight: 1.5, fontWeight: 500 }}>
                  {allMsg || "Ends your session on every other phone, tablet and computer. Use this if you've lost a device or think someone else is signed in."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes dashspin{to{transform:rotate(360deg)}}
        .dash-spin{display:inline-block;animation:dashspin .8s linear infinite;vertical-align:middle;}
        .dash-2col{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:stretch;}
        .dash-2col>*{min-width:0}
        .dash-quick{display:grid;grid-template-columns:repeat(2, 1fr);gap:16px;}
        .dash-quick>*{min-width:0}
        @media (max-width:860px){
          .dash-2col{grid-template-columns:1fr; gap:16px;}
          .dash-quick{grid-template-columns:repeat(2,1fr);}
        }
        @media (max-width:520px){
          .dash-quick{grid-template-columns:repeat(2,1fr);}
        }
      `}</style>
    </section>
  );
}
