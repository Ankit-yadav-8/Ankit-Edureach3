import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Mail, ArrowLeft, Lock, User, KeyRound,
  Phone, GraduationCap, CheckCircle2, AlertCircle, MapPin,
  Loader2, Eye, EyeOff, Sparkles, ChevronDown,
  Shield, Zap, BookOpen, Award, Trophy, Stethoscope,
} from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import { apiForgot, apiReset, apiSendOtp, apiVerifyOtp } from "./api.js";

/* ── constants ──────────────────────────────────────────────── */
const OR  = "#FF693D";
const ORD = "#E0421F";
// Email is only accepted when it ends with "@gmail.com" or with ".in"
const isEmail = (v) => {
  const s = String(v || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return false;
  return s.endsWith("@gmail.com") || s.endsWith(".in");
};
const isPhone = (v) => /^\d{10}$/.test(v);
const isRank  = (v) => !v || (!isNaN(Number(v)) && Number(v) > 0);
const EMAIL_ERR = "Use a @gmail.com or .in email address";

/* Indian states & union territories — for the Home state dropdown */
const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar","Chandigarh","Dadra & Nagar Haveli and Daman & Diu","Delhi",
  "Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry",
];

/* ── client-side validation ─────────────────────────────────── */
function validate(mode, f) {
  const e = {};
  if (mode === "login") {
    if (!f.email.trim())         e.email    = "Email is required";
    else if (!isEmail(f.email))  e.email    = EMAIL_ERR;
    if (!f.password)             e.password = "Password is required";
  }
  if (mode === "signup") {
    if (!f.name.trim())              e.name         = "Full name is required";
    if (!f.email.trim())             e.email        = "Email is required";
    else if (!isEmail(f.email))      e.email        = EMAIL_ERR;
    if (!f.phone)                    e.phone        = "Mobile number is required";
    else if (!isPhone(f.phone))      e.phone        = "Enter a valid 10-digit number";
    if (!f.coaching.trim())          e.coaching     = "Coaching is required";
    if (!f.homeState.trim())         e.homeState    = "Home state is required";
    if (!f.studentClass)             e.studentClass = "Class is required";
    if (!f.password)             e.password = "Password is required";
    else if (f.password.length < 6) e.password = "Minimum 6 characters";
  }
  if (mode === "otpEmail") {
    if (!f.email.trim())         e.email = "Email is required";
    else if (!isEmail(f.email))  e.email = EMAIL_ERR;
  }
  if (mode === "forgot") {
    if (!f.email.trim())         e.email = "Email is required";
    else if (!isEmail(f.email))  e.email = EMAIL_ERR;
  }
  if (mode === "reset") {
    if (!f.token.trim())         e.token    = "Reset token is required";
    if (!f.password)             e.password = "New password is required";
    else if (f.password.length < 8) e.password = "Minimum 8 characters";
  }
  return e;
}

/* ══════════════════════════════════════════════════
   FIELD — with focus glow, icon, eye-toggle, error
══════════════════════════════════════════════════ */
function Field({ icon: Icon, error, label, ...props }) {
  const [showPw,  setShowPw]  = useState(false);
  const isPass = props.type === "password";
  const type   = isPass ? (showPw ? "text" : "password") : (props.type || "text");

  return (
    <div style={{ marginBottom: error ? 6 : 0 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 5, display: "block" }}>{label}</label>}
      <div className={`field ${error ? 'error' : ''}`}>
        <Icon className="icon" />
        <input {...props} type={type} />
        {isPass && (
          <button type="button" className="toggle-eye" onClick={() => setShowPw(v => !v)}>
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            key="err"
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            style={{ display: "flex", alignItems: "center", gap: 4, paddingTop: 5, paddingLeft: 4 }}
          >
            <AlertCircle size={11} color="#ef4444" />
            <span style={{ fontSize: 11.5, color: "#ef4444", fontWeight: 500 }}>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SELECT FIELD — same styling as Field, native dropdown
══════════════════════════════════════════════════ */
function SelectField({ icon: Icon, error, label, options, placeholder, value, ...props }) {
  return (
    <div style={{ marginBottom: error ? 6 : 0 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 5, display: "block" }}>{label}</label>}
      <div className={`field ${error ? 'error' : ''}`}>
        <Icon className="icon" />
        <select {...props} value={value}>
          <option value="" disabled>{placeholder || "Select…"}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-soft)" }} />
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            key="err"
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            style={{ display: "flex", alignItems: "center", gap: 4, paddingTop: 5, paddingLeft: 4 }}
          >
            <AlertCircle size={11} color="#ef4444" />
            <span style={{ fontSize: 11.5, color: "#ef4444", fontWeight: 500 }}>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════
   ACTION BUTTON
════════════════════════ */
function ActionBtn({ busy, disabled, label, busyLabel, onClick, shake }) {
  return (
    <motion.button
      animate={shake ? { x: [0, -10, 10, -7, 7, -4, 4, 0] } : {}}
      transition={{ duration: 0.38, type: "tween" }}
      onClick={onClick}
      disabled={busy || disabled}
      className="submit"
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
    >
      {busy ? <Loader2 size={16} style={{ animation: "spin .75s linear infinite" }} /> : null}
      {busy ? busyLabel || "Please wait…" : label}
    </motion.button>
  );
}

/* ════════════════════════
   STATUS BANNER
════════════════════════ */
function Banner({ type, text }) {
  if (!text) return null;
  const ok     = type === "ok";
  const color  = ok ? "#166534" : "#991b1b";
  const bg     = ok ? "linear-gradient(135deg,#f0fdf4,#dcfce7)" : "linear-gradient(135deg,#fff1f2,#fde8e8)";
  const border = ok ? "#86efac" : "#fca5a5";
  const Icon   = ok ? CheckCircle2 : AlertCircle;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: .97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: .96 }}
      style={{
        display: "flex", gap: 10, alignItems: "flex-start",
        background: bg, border: `1.5px solid ${border}`, borderRadius: 12,
        padding: "11px 14px", marginTop: 14, color,
      }}
    >
      <Icon size={17} style={{ flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 13.5, lineHeight: 1.55, fontWeight: 700 }}>{text}</span>
    </motion.div>
  );
}

/* ════════════════════════
   DIVIDER
════════════════════════ */
function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #e2e8f0)" }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: ".08em" }}>OR</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, #e2e8f0)" }} />
    </div>
  );
}

/* ════════════════════════
   FEATURE PILLS (login/signup mode)
════════════════════════ */
function FeaturePills() {
  const items = [
    { icon: Shield, text: "Secure & private" },
    { icon: Zap,    text: "Instant access" },
    { icon: BookOpen, text: "8-yr JoSAA data" },
  ];
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
      {items.map(({ icon: I, text }) => (
        <span key={text} style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "4px 12px", borderRadius: 20,
          background: `${OR}0d`, border: `1px solid ${OR}22`,
          fontSize: 11.5, color: "#78350f", fontWeight: 600,
        }}>
          <I size={11} color={OR} /> {text}
        </span>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SHOWCASE PANEL — animated left side (desktop only)
════════════════════════════════════════════════════════════ */
const SHOWCASE = {
  login:  { title: "Welcome back to",     accent: "College Parichay" },
  signup: { title: "Start your journey with", accent: "College Parichay" },
};
const SHOW_STATS = [
  { icon: Trophy,  label: "8 years of JoSAA closing ranks" },
  { icon: BookOpen, label: "Personalised college predictor" },
  { icon: Award,   label: "Branch & cutoff comparisons" },
  { icon: Shield,  label: "Free forever · privacy-first" },
];
// Deterministic particle field so it doesn't reshuffle on every render
const PARTICLES = Array.from({ length: 16 }).map((_, i) => ({
  left: (i * 53) % 100,
  size: 3 + ((i * 7) % 6),
  delay: (i % 8) * 0.9,
  dur: 7 + ((i * 3) % 7),
}));

function ShowcasePanel({ mode }) {
  const S = SHOWCASE[mode] || SHOWCASE.login;
  return (
    <div className="auth-showcase">
      {/* animated colour layers */}
      <div className="auth-aurora" />
      <div className="auth-mesh" />
      {PARTICLES.map((p, i) => (
        <span key={i} className="auth-particle" style={{
          left: `${p.left}%`, bottom: -10, width: p.size, height: p.size,
          animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
        }} />
      ))}

      {/* brand */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${OR},${ORD})`, display: "grid", placeItems: "center", boxShadow: `0 6px 18px ${OR}66`, animation: "glowPulse 3s ease-in-out infinite" }}>
          <span style={{ color: "#fff", fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: "-0.5px", lineHeight: 1 }}>CP</span>
        </span>
        <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.05rem", color: "#1a1a2e" }}>
          College <span style={{ color: OR }}>Parichay</span>
        </span>
      </div>

      {/* headline */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.h2
            key={mode}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.7rem", lineHeight: 1.25, margin: "0 0 14px", color: "#1a1a2e" }}
          >
            {S.title}<br />
            <span className="auth-grad-text">{S.accent}</span>
          </motion.h2>
        </AnimatePresence>
        <p style={{ color: "#6b7280", fontSize: 13.5, lineHeight: 1.6, margin: 0, maxWidth: 280 }}>
          The data-driven companion for every JEE aspirant choosing where to study next.
        </p>
      </div>

      {/* stat chips */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
        {SHOW_STATS.map(({ icon: I, label }, i) => (
          <motion.div key={label} className="auth-stat"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 + i * 0.08, duration: 0.35 }}
          >
            <span style={{ width: 28, height: 28, borderRadius: 9, background: `${OR}1a`, border: `1px solid ${OR}3a`, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <I size={14} color={OR} />
            </span>
            <span style={{ fontSize: 12.5, color: "#475569", fontWeight: 600 }}>{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN MODAL
════════════════════════════════════════════════════════════ */
const HEADS = {
  login:    { emoji: "👋", title: "Welcome back!",        sub: "Continue your college discovery journey." },
  signup:   { emoji: "🚀", title: "Create your account",  sub: "Join 50,000+ JEE aspirants. Free forever." },
  otpEmail: { emoji: "✉️", title: "Login with OTP",       sub: "No password needed — we'll email you a code." },
  forgot:   { emoji: "🔐", title: "Forgot password?",     sub: "Enter your email and we'll send a reset link." },
  reset:    { emoji: "🔑", title: "Set new password",     sub: "Choose a strong password for your account." },
};

export default function AuthModal() {
  const { loginOpen, closeLogin, login, signup, saveSession, loginMode } = useAuth();
  // Login is optional — guests browse freely and open this modal on demand,
  // so it is always dismissible (close X + "browse as guest" skip link).
  const mandatory = false;
  const [mode,    setMode]   = useState("login");
  const [f,       setF]      = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", code: "", token: "", coaching: "", homeState: "", studentClass: "", remember: false });
  const [fe,      setFe]     = useState({});
  const [banner,  setBanner] = useState({ type: "", text: "" });
  const [busy,    setBusy]   = useState(false);
  const [shake,   setShake]  = useState(false);
  const [slowNet, setSlowNet] = useState(false);
  const [notReg,  setNotReg]  = useState(false);
  const prevOpen = useRef(false);

  useEffect(() => {
    if (loginOpen && !prevOpen.current) {
      setMode(loginMode || "login");
      // If we are opening in reset mode, grab the token from the URL if it's there
      if (loginMode === "reset") {
        const urlParams = new URLSearchParams(window.location.search);
        const t = urlParams.get("reset");
        if (t) setF((s) => ({ ...s, token: t }));
      }
    }
    prevOpen.current = loginOpen;
  }, [loginOpen, loginMode]);

  if (!loginOpen) return null;

  const set = (k, v) => {
    setF(s => ({ ...s, [k]: v }));
    if (fe[k]) setFe(s => ({ ...s, [k]: "" }));
  };

  const go = (m) => {
    setBanner({ type: "", text: "" });
    setFe({});
    setSlowNet(false);
    setNotReg(false);
    setMode(m);
  };

  const close = () => {
    setMode("login");
    setF({ name: "", email: "", phone: "", password: "", confirmPassword: "", code: "", token: "", coaching: "", homeState: "", studentClass: "", remember: false });
    setBanner({ type: "", text: "" });
    setFe({});
    setBusy(false);
    setSlowNet(false);
    setNotReg(false);
    closeLogin();
  };

  const run = (fn, vMode) => async () => {
    if (vMode) {
      const errs = validate(vMode, f);
      if (Object.keys(errs).length) {
        setFe(errs);
        setBanner({ type: "err", text: "Please fix the highlighted fields." });
        setShake(true); setTimeout(() => setShake(false), 450);
        return;
      }
    }
    setFe({}); setBanner({ type: "", text: "" });
    setBusy(true); setSlowNet(false);
    const st = setTimeout(() => setSlowNet(true), 1500);
    try {
      await fn();
    } catch (e) {
      const msg = e.message || "";
      const friendly = msg.includes("timed out") || msg.includes("AbortError")
        ? "Server is taking too long. It may be waking up — try again in a few seconds."
        : msg.includes("fetch") || msg.includes("Failed") || msg.includes("network")
          ? "No connection. Check your internet and try again."
          : msg || "Something went wrong.";
      setBanner({ type: "err", text: friendly });
      setShake(true); setTimeout(() => setShake(false), 450);
    } finally {
      clearTimeout(st);
      setBusy(false); setSlowNet(false);
    }
  };

  const doLogin   = run(async () => { await login(f.email.trim(), f.password); close(); }, "login");
  const doSignup  = run(async () => { await signup({ name: f.name.trim(), email: f.email.trim(), phone: f.phone, coaching: f.coaching, homeState: f.homeState.trim(), password: f.password, studentClass: f.studentClass }); close(); }, "signup");
  const doSendOtp = run(async () => {
    setNotReg(false);
    try {
      const r = await apiSendOtp({ email: f.email.trim(), name: f.name.trim() });
      setBanner({ type: "ok", text: r.devCode ? `Dev OTP: ${r.devCode}` : "Code sent! Check your inbox and spam folder." });
      go("otpCode");
    } catch (e) {
      if (e?.data?.notRegistered || /not registered/i.test(e?.message || "")) setNotReg(true);
      throw e; // let run() surface the message in the banner
    }
  }, "otpEmail");
  const doVerify  = run(async () => {
    try {
      const r = await apiVerifyOtp({ email: f.email.trim(), code: f.code });
      saveSession(r); close();
    } catch (e) {
      if (e?.data?.notRegistered || /not registered/i.test(e?.message || "")) setNotReg(true);
      throw e;
    }
  });
  const doForgot  = run(async () => {
    const r = await apiForgot({ email: f.email.trim() });
    if (r.devToken) { set("token", r.devToken); go("reset"); }
    else setBanner({ type: "ok", text: "If that email is registered, a reset link has been sent." });
  }, "forgot");
  const doReset   = run(async () => { 
    if (f.password !== f.confirmPassword) {
      setFe({ confirmPassword: "Passwords do not match" });
      setBanner({ type: "err", text: "Passwords do not match." });
      setShake(true); setTimeout(() => setShake(false), 450);
      return;
    }
    const r = await apiReset({ token: f.token.trim(), password: f.password }); saveSession(r); close(); 
  }, "reset");

  const BACK = ["otpEmail", "otpCode", "forgot", "reset"];
  const H    = HEADS[mode] ?? HEADS.login;

  const busyLabel = slowNet ? "Server starting up — please wait…"
    : mode === "login"    ? "Logging in…"
    : mode === "signup"   ? "Creating account…"
    : mode === "otpEmail" ? "Sending code…"
    : mode === "otpCode"  ? "Verifying…"
    : mode === "forgot"   ? "Sending link…"
    : "Saving…";

  return (
    <AnimatePresence>
      {/* ── backdrop ── clicking outside does NOT auto-close (use Skip link below) */}
      <motion.div
        key="backdrop"
        className="auth-backdrop neo-auth"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
      >
        {/* ── card ── split-panel: showcase (desktop) + form ── */}
        <motion.div
          key="card"
          initial={{ opacity: 0, scale: 0.90, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          onClick={e => e.stopPropagation()}
          className="card-anim-wrap"
        >
          <div className="shell">
            {(!mandatory || mode === "login" || mode === "signup") && (
            <div className="visual">
              <div className="brand">
                <div className="brand-mark raised-sm">CP</div>
                <div className="brand-name">College<b>Parichay</b></div>
              </div>

              <div className="dial-wrap raised">
                <svg viewBox="0 0 190 190">
                  <circle className="dial-track" cx="95" cy="95" r="80" fill="none" strokeWidth="10"/>
                  <circle className="dial-progress" cx="95" cy="95" r="80" fill="none" strokeWidth="10" strokeDasharray="502" strokeDashoffset="60"/>
                </svg>
                <div className="dial-inner">
                  <span className="dial-num">98.7</span>
                  <span className="dial-label">percentile</span>
                </div>
              </div>

              <div className="visual-copy">
                <h1>Know your rank.<br/>Find your <span>dream college.</span></h1>
                <p>Built by IIT Roorkee alumni — rank prediction, college shortlists and mentorship in one place.</p>
              </div>
            </div>
            )}

            <div className="panel" style={{ width: (mode !== "login" && mode !== "signup") ? "100%" : undefined }}>
              <div className="form-wrap" style={{ margin: (mode !== "login" && mode !== "signup") ? "auto" : undefined }}>
                {(mode === "login" || mode === "signup") && (
                  <div className={`tabs ${mode === "signup" ? "signup" : ""}`}>
                    <div className="tab-glider"></div>
                    <button type="button" className={mode === "login" ? "active" : ""} onClick={() => go("login")}>Log in</button>
                    <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => go("signup")}>Sign up</button>
                  </div>
                )}
                
                {/* ── form slide animation ── */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                     {/* login */}
                     {mode === "login" && (<div className="form active">
                        <h2 className="title">Welcome back</h2>
                        <p className="sub">Log in to continue your college search.</p>
                        
                        <Field icon={Mail} type="email" placeholder="you@email.com" value={f.email}
                          error={fe.email} onChange={e => set("email", e.target.value)}
                          onKeyDown={e => e.key === "Enter" && doLogin()} autoComplete="email" />
                        <Field icon={Lock} type="password" placeholder="Password" value={f.password}
                          error={fe.password} onChange={e => set("password", e.target.value)}
                          onKeyDown={e => e.key === "Enter" && doLogin()} autoComplete="current-password" />
                        
                        <div className="row-between">
                          <label className="remember"><input type="checkbox" checked={f.remember} onChange={e => set("remember", e.target.checked)} /> Remember me</label>
                          <button type="button" onClick={() => go("forgot")}>Forgot password?</button>
                        </div>
                        
                        <ActionBtn busy={busy} label="Log in" busyLabel={busyLabel} onClick={doLogin} shake={shake} />
                        
                        <p className="switch-line">New to CollegeParichay? <button type="button" onClick={() => go("signup")}>Create an account</button></p>
                     </div>)}

                     {/* signup */}
                     {mode === "signup" && (<div className="form active">
                        <h2 className="title">Create your account</h2>
                        <p className="sub">Start predicting your rank in seconds.</p>

                        <div className="signup-grid">
                          <div className="full-w">
                            <Field icon={User} placeholder="Full name *" value={f.name} error={fe.name} onChange={e => set("name", e.target.value)} autoComplete="name" />
                          </div>
                          <Field icon={Phone} type="tel" inputMode="numeric" maxLength={10} placeholder="Mobile number *" value={f.phone} error={fe.phone} onChange={e => set("phone", e.target.value.replace(/\D/g, ""))} autoComplete="tel" />
                          <Field icon={GraduationCap} placeholder="Coaching *" value={f.coaching} error={fe.coaching} onChange={e => set("coaching", e.target.value)} />
                          
                          <div className="full-w">
                            <SelectField icon={MapPin} placeholder="Home state *" value={f.homeState} options={INDIAN_STATES} error={fe.homeState} onChange={e => set("homeState", e.target.value)} />
                          </div>
                          <div className="full-w">
                            <Field icon={Mail} type="email" placeholder="Email address *" value={f.email} error={fe.email} onChange={e => set("email", e.target.value)} autoComplete="email" />
                          </div>
                          <div className="full-w">
                            <SelectField icon={BookOpen} placeholder="Class *" value={f.studentClass} options={["11", "12", "12+"]} error={fe.studentClass} onChange={e => set("studentClass", e.target.value)} />
                          </div>
                          <div className="full-w">
                            <Field icon={Stethoscope} type="tel" inputMode="numeric" placeholder="NEET rank (optional)" value={f.neetRank} error={fe.neetRank} onChange={e => set("neetRank", e.target.value.replace(/\D/g, ""))} />
                          </div>
                          <div className="full-w">
                            <Field icon={Trophy} type="tel" inputMode="numeric" placeholder="JEE Mains rank (optional)" value={f.jeeMainsRank} error={fe.jeeMainsRank} onChange={e => set("jeeMainsRank", e.target.value.replace(/\D/g, ""))} />
                          </div>
                          <div className="full-w">
                            <Field icon={Award} type="tel" inputMode="numeric" placeholder="JEE Adv rank (optional)" value={f.jeeAdvancedRank} error={fe.jeeAdvancedRank} onChange={e => set("jeeAdvancedRank", e.target.value.replace(/\D/g, ""))} />
                          </div>
                          <div className="full-w">
                            <Field icon={Lock} type="password" placeholder="Create password *" value={f.password} error={fe.password} onChange={e => set("password", e.target.value)} onKeyDown={e => e.key === "Enter" && doSignup()} autoComplete="new-password" />
                          </div>
                        </div>

                        {f.password.length > 0 && (
                          <div style={{ display: "flex", gap: 4, marginTop: 12, marginBottom: 12 }}>
                            {[1,2,3,4].map(i => {
                              const strength = f.password.length >= 10 && /[A-Z]/.test(f.password) && /\d/.test(f.password) ? 4 : f.password.length >= 8 ? 3 : f.password.length >= 6 ? 2 : 1;
                              const color = strength >= 4 ? "#22c55e" : strength === 3 ? "#84cc16" : strength === 2 ? "#f59e0b" : "#ef4444";
                              return <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? color : "#e2e8f0", transition: "background .2s" }} />;
                            })}
                          </div>
                        )}
                        
                        <div className="row-between" style={{ justifyContent: "flex-start", gap: 6 }}>
                          <label className="remember" style={{ fontSize: 11 }}><input type="checkbox" required /> I agree to the Terms and Privacy Policy</label>
                        </div>
                        
                        <ActionBtn busy={busy} label="Create account" busyLabel={busyLabel} onClick={doSignup} shake={shake} />
                        
                        <p className="switch-line">Already have an account? <button type="button" onClick={() => go("login")}>Log in</button></p>
                     </div>)}

                     {/* otpEmail */}
                     {mode === "otpEmail" && (<div className="form active">
                        <h2 className="title">Email Verification</h2>
                        <p className="sub">Enter your email to receive an OTP.</p>
                        
                        <Field icon={User} placeholder="Your name (optional)" value={f.name} onChange={e => set("name", e.target.value)} />
                        <Field icon={Mail} type="email" placeholder="Email address *" value={f.email} error={fe.email} onChange={e => { set("email", e.target.value); if (notReg) setNotReg(false); }} onKeyDown={e => e.key === "Enter" && doSendOtp()} autoComplete="email" />
                        
                        <ActionBtn busy={busy} label="Send OTP" busyLabel={busyLabel} onClick={doSendOtp} shake={shake} />
                        <p className="switch-line"><button type="button" onClick={() => go("login")}>Back to login</button></p>
                     </div>)}

                     {/* otpCode */}
                     {mode === "otpCode" && (<div className="form active">
                        <h2 className="title">Enter Code</h2>
                        <p className="sub">Code sent to {f.email || "your email"}</p>
                        
                        <div style={{ textAlign: "center", marginBottom: 20 }}>
                          <input
                            inputMode="numeric" maxLength={6}
                            placeholder="------"
                            value={f.code}
                            onChange={e => set("code", e.target.value.replace(/\D/g, ""))}
                            onKeyDown={e => e.key === "Enter" && f.code.length === 6 && doVerify()}
                            autoFocus
                            style={{
                              width: "100%", textAlign: "center", letterSpacing: "1em",
                              fontSize: 34, fontWeight: 900, color: "var(--text)",
                              height: 72, border: `2px solid ${f.code.length === 6 ? "var(--orange)" : "transparent"}`,
                              borderRadius: 16, background: "transparent",
                              outline: "none", fontFamily: "Sora, monospace",
                              transition: "all .2s",
                              boxShadow: "inset 4px 4px 8px var(--shadow-dark), inset -4px -4px 8px var(--shadow-light)",
                            }}
                          />
                        </div>
                        
                        <ActionBtn busy={busy} disabled={f.code.length < 6} label="Verify & continue" busyLabel={busyLabel} onClick={doVerify} shake={shake} />
                        <p className="switch-line"><button type="button" onClick={doSendOtp} disabled={busy}>Resend code</button></p>
                     </div>)}

                     {/* forgot */}
                     {mode === "forgot" && (<div className="form active">
                        <h2 className="title">Reset Password</h2>
                        <p className="sub">Enter your email to receive a reset link.</p>
                        
                        <Field icon={Mail} type="email" placeholder="Registered email address *" value={f.email} error={fe.email} onChange={e => set("email", e.target.value)} onKeyDown={e => e.key === "Enter" && doForgot()} autoComplete="email" />
                        
                        <ActionBtn busy={busy} label="Send reset link" busyLabel={busyLabel} onClick={doForgot} shake={shake} />
                        <p className="switch-line"><button type="button" onClick={() => go("login")}>Back to login</button></p>
                     </div>)}

                     {/* reset */}
                     {mode === "reset" && (<div className="form active">
                        <h2 className="title">Set New Password</h2>
                        <p className="sub">Choose a strong password for your account.</p>
                        
                        {/* Only show token field if we didn't get it from the URL */}
                        {!new URLSearchParams(window.location.search).get("reset") && !f.token && (
                          <Field icon={KeyRound} placeholder="6-digit Reset Code *" value={f.token} error={fe.token} onChange={e => set("token", e.target.value)} />
                        )}
                        <Field icon={Lock} type="password" placeholder="New password (min 8 chars) *" value={f.password} error={fe.password} onChange={e => set("password", e.target.value)} autoComplete="new-password" />
                        <Field icon={Lock} type="password" placeholder="Confirm new password *" value={f.confirmPassword} error={fe.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} onKeyDown={e => e.key === "Enter" && doReset()} autoComplete="new-password" />
                        
                        <ActionBtn busy={busy} label="Set new password" busyLabel={busyLabel} onClick={doReset} shake={shake} />
                        <p className="switch-line"><button type="button" onClick={() => go("login")}>Back to login</button></p>
                     </div>)}

                  </motion.div>
                </AnimatePresence>

                {/* banner */}
                <AnimatePresence>
                  {banner.text && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{ marginTop: 20, textAlign: "center", color: banner.type === 'error' ? 'red' : 'green', fontSize: 13 }}>
                      {banner.text}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* ── skip link — only when auth is optional (logged-in re-auth) ── */}
                {!mandatory && (mode === "login" || mode === "signup") && (
                  <div style={{ textAlign: "center", marginTop: 14 }}>
                    <button
                      onClick={close}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "#b0bac8", fontSize: 12, fontWeight: 500,
                        textDecoration: "underline", textDecorationStyle: "dotted",
                        padding: "4px 8px", borderRadius: 6,
                        transition: "color .15s",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = "#64748b"}
                      onMouseLeave={e => e.currentTarget.style.color = "#b0bac8"}
                    >
                      Skip for now — browse as guest
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
