import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Mail, ArrowLeft, Lock, User, KeyRound,
  Phone, GraduationCap, CheckCircle2, AlertCircle,
  Loader2, Eye, EyeOff, Sparkles,
  Shield, Zap, BookOpen,
} from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import { apiForgot, apiReset, apiSendOtp, apiVerifyOtp } from "./api.js";

/* ── constants ──────────────────────────────────────────────── */
const OR  = "#F47B20";
const ORD = "#ea580c";
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
const isPhone = (v) => !v || !v.length || /^\d{10}$/.test(v);

/* ── client-side validation ─────────────────────────────────── */
function validate(mode, f) {
  const e = {};
  if (mode === "login") {
    if (!f.email.trim())         e.email    = "Email is required";
    else if (!isEmail(f.email))  e.email    = "Enter a valid email";
    if (!f.password)             e.password = "Password is required";
  }
  if (mode === "signup") {
    if (!f.name.trim())          e.name     = "Full name is required";
    if (!f.email.trim())         e.email    = "Email is required";
    else if (!isEmail(f.email))  e.email    = "Enter a valid email";
    if (f.phone && !isPhone(f.phone)) e.phone = "Enter a valid 10-digit number";
    if (!f.password)             e.password = "Password is required";
    else if (f.password.length < 6) e.password = "Minimum 6 characters";
  }
  if (mode === "otpEmail") {
    if (!f.email.trim())         e.email = "Email is required";
    else if (!isEmail(f.email))  e.email = "Enter a valid email";
  }
  if (mode === "forgot") {
    if (!f.email.trim())         e.email = "Email is required";
    else if (!isEmail(f.email))  e.email = "Enter a valid email";
  }
  if (mode === "reset") {
    if (!f.token.trim())         e.token    = "Reset token is required";
    if (!f.password)             e.password = "New password is required";
    else if (f.password.length < 6) e.password = "Minimum 6 characters";
  }
  return e;
}

/* ══════════════════════════════════════════════════
   FIELD — with focus glow, icon, eye-toggle, error
══════════════════════════════════════════════════ */
function Field({ icon: Icon, error, label, ...props }) {
  const [focused, setFocused] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const isPass = props.type === "password";
  const type   = isPass ? (showPw ? "text" : "password") : (props.type || "text");

  const borderColor = error ? "#ef4444" : focused ? OR : "#e2e8f0";
  const shadow      = error
    ? "0 0 0 3px rgba(239,68,68,.12)"
    : focused
      ? `0 0 0 3px ${OR}1a, 0 1px 4px rgba(0,0,0,.06)`
      : "0 1px 3px rgba(0,0,0,.04)";

  return (
    <div style={{ marginBottom: error ? 6 : 14 }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 5, display: "block", letterSpacing: ".03em" }}>
          {label}
        </label>
      )}
      <div style={{
        position: "relative", borderRadius: 13,
        border: `1.5px solid ${borderColor}`,
        background: error ? "#fff8f8" : "#fff",
        transition: "border-color .18s, box-shadow .18s",
        boxShadow: shadow,
        display: "flex", alignItems: "center",
      }}>
        <Icon size={15} style={{
          position: "absolute", left: 14,
          color: error ? "#ef4444" : focused ? OR : "#94a3b8",
          transition: "color .18s", flexShrink: 0,
        }} />
        <input
          {...props}
          type={type}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e)  => { setFocused(false); props.onBlur?.(e); }}
          style={{
            flex: 1, border: "none", background: "transparent", outline: "none",
            paddingLeft: 40, paddingRight: isPass ? 46 : 14,
            height: 48, fontSize: 14, color: "#1e293b", borderRadius: 12,
            fontFamily: "inherit",
          }}
        />
        {isPass && (
          <button type="button" onClick={() => setShowPw(v => !v)}
            style={{ position: "absolute", right: 12, background: "none", border: "none",
              cursor: "pointer", color: focused ? OR : "#94a3b8",
              padding: 4, display: "grid", placeItems: "center", borderRadius: 6,
              transition: "color .18s" }}>
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
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
      style={{
        width: "100%", height: 50, borderRadius: 14,
        background: busy || disabled
          ? `linear-gradient(135deg, ${OR}99, ${ORD}88)`
          : `linear-gradient(135deg, ${OR} 0%, ${ORD} 100%)`,
        border: "none", color: "#fff",
        fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 15,
        cursor: busy || disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        boxShadow: busy || disabled ? "none" : `0 6px 24px ${OR}44, 0 2px 8px ${OR}22`,
        transition: "box-shadow .2s, background .2s, transform .1s",
        letterSpacing: ".01em",
      }}
      onMouseEnter={(e) => { if (!busy && !disabled) e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
      onMouseDown={(e)  => { if (!busy && !disabled) e.currentTarget.style.transform = "translateY(0px)"; }}
    >
      {busy
        ? <><Loader2 size={17} style={{ animation: "spin .75s linear infinite" }} /> {busyLabel}</>
        : label}
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
      <Icon size={16} style={{ flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 13, lineHeight: 1.55, fontWeight: 500 }}>{text}</span>
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
  const { loginOpen, closeLogin, login, signup, saveSession } = useAuth();
  const [mode,    setMode]   = useState("login");
  const [f,       setF]      = useState({ name: "", email: "", phone: "", password: "", code: "", token: "", coaching: "" });
  const [fe,      setFe]     = useState({});   // field errors
  const [banner,  setBanner] = useState({ type: "", text: "" });
  const [busy,    setBusy]   = useState(false);
  const [shake,   setShake]  = useState(false);
  const [slowNet, setSlowNet] = useState(false);

  if (!loginOpen) return null;

  const set = (k, v) => {
    setF(s => ({ ...s, [k]: v }));
    if (fe[k]) setFe(s => ({ ...s, [k]: "" }));
  };

  const go = (m) => {
    setBanner({ type: "", text: "" });
    setFe({});
    setSlowNet(false);
    setMode(m);
  };

  const close = () => {
    setMode("login");
    setF({ name: "", email: "", phone: "", password: "", code: "", token: "", coaching: "" });
    setBanner({ type: "", text: "" });
    setFe({});
    setBusy(false);
    setSlowNet(false);
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
    const st = setTimeout(() => setSlowNet(true), 3000);
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
  const doSignup  = run(async () => { await signup({ name: f.name.trim(), email: f.email.trim(), phone: f.phone, coaching: f.coaching, password: f.password }); close(); }, "signup");
  const doSendOtp = run(async () => {
    const r = await apiSendOtp({ email: f.email.trim(), name: f.name.trim() });
    setBanner({ type: "ok", text: r.devCode ? `Dev OTP: ${r.devCode}` : "Code sent! Check your inbox and spam folder." });
    go("otpCode");
  }, "otpEmail");
  const doVerify  = run(async () => { const r = await apiVerifyOtp({ email: f.email.trim(), code: f.code }); saveSession(r); close(); });
  const doForgot  = run(async () => {
    const r = await apiForgot({ email: f.email.trim() });
    if (r.devToken) { set("token", r.devToken); go("reset"); }
    else setBanner({ type: "ok", text: "If that email is registered, a reset link has been sent." });
  }, "forgot");
  const doReset   = run(async () => { const r = await apiReset({ token: f.token.trim(), password: f.password }); saveSession(r); close(); }, "reset");

  const BACK = ["otpEmail", "otpCode", "forgot", "reset"];
  const H    = HEADS[mode] ?? HEADS.login;

  const busyLabel = slowNet ? "Server waking up…"
    : mode === "login"    ? "Logging in…"
    : mode === "signup"   ? "Creating account…"
    : mode === "otpEmail" ? "Sending code…"
    : mode === "otpCode"  ? "Verifying…"
    : mode === "forgot"   ? "Sending link…"
    : "Saving…";

  return (
    <AnimatePresence>
      {/* ── backdrop ── */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={close}
        style={{
          position: "fixed", inset: 0, zIndex: 300,
          background: "rgba(10,12,28,.72)",
          backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
          display: "grid", placeItems: "center", padding: "16px",
        }}
      >
        {/* ── card ── */}
        <motion.div
          key="card"
          initial={{ opacity: 0, scale: 0.90, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: "min(460px,100%)",
            borderRadius: 26,
            overflow: "hidden",
            boxShadow: "0 40px 100px rgba(10,12,28,.55), 0 0 0 1px rgba(255,255,255,.08)",
            background: "#fff",
            maxHeight: "92vh", overflowY: "auto",
          }}
        >

          {/* ─── BUSY progress bar ─── */}
          <AnimatePresence>
            {busy && (
              <motion.div
                key="prog"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg, ${OR}, #fbbf24, ${OR})`,
                  backgroundSize: "200% 100%",
                  animation: "brandGradient 1.2s linear infinite",
                  transformOrigin: "left",
                  zIndex: 10,
                }}
              />
            )}
          </AnimatePresence>

          {/* ─── HEADER BAND ─── */}
          <div style={{
            background: `linear-gradient(135deg, #1a0d00 0%, #2d1400 40%, #3d2010 70%, #1a0d00 100%)`,
            padding: "22px 24px 20px",
            position: "relative", overflow: "hidden",
          }}>
            {/* glow orbs */}
            <div style={{ position: "absolute", top: -30, right: -20, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${OR}44 0%, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -40, left: -20, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${OR}22 0%, transparent 70%)`, pointerEvents: "none" }} />

            {/* top bar: back + close */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, position: "relative", zIndex: 1 }}>
              {BACK.includes(mode) ? (
                <motion.button
                  whileHover={{ x: -2 }}
                  onClick={() => go(mode === "otpCode" ? "otpEmail" : "login")}
                  style={{ background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 8, cursor: "pointer", color: "rgba(255,255,255,.85)", padding: "5px 12px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}
                >
                  <ArrowLeft size={14} /> Back
                </motion.button>
              ) : (
                /* brand pill */
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${OR},${ORD})`, display: "grid", placeItems: "center", boxShadow: `0 4px 12px ${OR}55` }}>
                    <GraduationCap size={16} color="#fff" />
                  </span>
                  <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: ".95rem", color: "#fff" }}>
                    College <span style={{ color: OR }}>Parichay</span>
                  </span>
                </div>
              )}

              <button onClick={close} aria-label="Close"
                style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.15)", cursor: "pointer", color: "rgba(255,255,255,.75)", display: "grid", placeItems: "center", transition: "background .15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.10)"}
              >
                <X size={15} />
              </button>
            </div>

            {/* title area */}
            <motion.div
              key={mode + "_head"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              style={{ position: "relative", zIndex: 1 }}
            >
              <div style={{ fontSize: 28, marginBottom: 6, lineHeight: 1 }}>{H.emoji}</div>
              <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.35rem", color: "#fff", margin: "0 0 5px" }}>
                {H.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,.65)", fontSize: 13.5, margin: 0, lineHeight: 1.5 }}>
                {mode === "otpCode"
                  ? `Code sent to ${f.email || "your email"}`
                  : H.sub}
              </p>
            </motion.div>

            {/* Login / Sign up tab switcher (only on login/signup) */}
            {(mode === "login" || mode === "signup") && (
              <div style={{
                display: "flex", background: "rgba(255,255,255,.08)", borderRadius: 10,
                padding: 3, marginTop: 18, position: "relative", zIndex: 1,
              }}>
                {[["login", "Log in"], ["signup", "Sign up"]].map(([m, lbl]) => (
                  <button key={m} onClick={() => go(m)}
                    style={{
                      flex: 1, border: "none", cursor: "pointer", borderRadius: 8,
                      padding: "8px 0", fontSize: 13.5, fontWeight: 700, fontFamily: "Sora",
                      background: mode === m ? "rgba(255,255,255,.92)" : "transparent",
                      color: mode === m ? OR : "rgba(255,255,255,.7)",
                      transition: "all .2s",
                      boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,.18)" : "none",
                    }}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── FORM BODY ─── */}
          <div style={{ padding: "24px 24px 22px" }}>

            {/* feature pills — login/signup only */}
            {(mode === "login" || mode === "signup") && <FeaturePills />}

            {/* ── form slide animation ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.2 }}
              >

                {/* ═══ LOGIN ═══ */}
                {mode === "login" && (<>
                  <Field icon={Mail} type="email" placeholder="Email address" value={f.email}
                    error={fe.email} onChange={e => set("email", e.target.value)}
                    onKeyDown={e => e.key === "Enter" && doLogin()} autoComplete="email" />
                  <Field icon={Lock} type="password" placeholder="Password" value={f.password}
                    error={fe.password} onChange={e => set("password", e.target.value)}
                    onKeyDown={e => e.key === "Enter" && doLogin()} autoComplete="current-password" />
                  <div style={{ textAlign: "right", marginTop: -8, marginBottom: 18 }}>
                    <button onClick={() => go("forgot")} style={{ background: "none", border: "none", color: OR, fontWeight: 600, cursor: "pointer", fontSize: 12.5, padding: 0 }}>
                      Forgot password?
                    </button>
                  </div>
                  <ActionBtn busy={busy} label="Log in →" busyLabel={busyLabel} onClick={doLogin} shake={shake} />
                  <Divider />
                  <button onClick={() => go("otpEmail")} style={{
                    width: "100%", height: 46, borderRadius: 13,
                    background: "#f8fafc", border: "1.5px solid #e2e8f0",
                    color: "#374151", fontWeight: 600, fontSize: 13.5, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "border-color .2s, background .2s",
                    fontFamily: "inherit",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = OR; e.currentTarget.style.background = `${OR}08`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}
                  >
                    <Mail size={15} color={OR} /> Login with email OTP
                  </button>
                </>)}

                {/* ═══ SIGNUP ═══ */}
                {mode === "signup" && (<>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ gridColumn: "1/-1" }}>
                      <Field icon={User} placeholder="Full name *" value={f.name}
                        error={fe.name} onChange={e => set("name", e.target.value)} autoComplete="name" />
                    </div>
                    <Field icon={Phone} type="tel" inputMode="numeric" maxLength={10}
                      placeholder="Mobile *" value={f.phone}
                      error={fe.phone} onChange={e => set("phone", e.target.value.replace(/\D/g, ""))} autoComplete="tel" />
                    <Field icon={GraduationCap} placeholder="Coaching (opt.)" value={f.coaching}
                      onChange={e => set("coaching", e.target.value)} />
                    <div style={{ gridColumn: "1/-1" }}>
                      <Field icon={Mail} type="email" placeholder="Email address *" value={f.email}
                        error={fe.email} onChange={e => set("email", e.target.value)} autoComplete="email" />
                    </div>
                    <div style={{ gridColumn: "1/-1" }}>
                      <Field icon={Lock} type="password" placeholder="Password (min 6 chars) *" value={f.password}
                        error={fe.password} onChange={e => set("password", e.target.value)}
                        onKeyDown={e => e.key === "Enter" && doSignup()} autoComplete="new-password" />
                    </div>
                  </div>
                  {/* password strength */}
                  {f.password.length > 0 && (
                    <div style={{ display: "flex", gap: 4, marginTop: -4, marginBottom: 12 }}>
                      {[1,2,3,4].map(i => {
                        const strength = f.password.length >= 10 && /[A-Z]/.test(f.password) && /\d/.test(f.password) ? 4 : f.password.length >= 8 ? 3 : f.password.length >= 6 ? 2 : 1;
                        const color = strength >= 4 ? "#22c55e" : strength === 3 ? "#84cc16" : strength === 2 ? "#f59e0b" : "#ef4444";
                        return <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? color : "#e2e8f0", transition: "background .2s" }} />;
                      })}
                      <span style={{ fontSize: 10.5, color: "#94a3b8", whiteSpace: "nowrap" }}>
                        {f.password.length < 6 ? "Too short" : f.password.length < 8 ? "Weak" : f.password.length >= 10 && /[A-Z]/.test(f.password) ? "Strong" : "OK"}
                      </span>
                    </div>
                  )}
                  <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 14 }}>Fields marked * are required</p>
                  <ActionBtn busy={busy} label="Create account →" busyLabel={busyLabel} onClick={doSignup} shake={shake} />
                </>)}

                {/* ═══ OTP EMAIL ═══ */}
                {mode === "otpEmail" && (<>
                  <Field icon={User} placeholder="Your name (optional)" value={f.name}
                    onChange={e => set("name", e.target.value)} />
                  <Field icon={Mail} type="email" placeholder="Email address *" value={f.email}
                    error={fe.email} onChange={e => set("email", e.target.value)}
                    onKeyDown={e => e.key === "Enter" && doSendOtp()} autoComplete="email" />
                  <ActionBtn busy={busy} label="Send OTP →" busyLabel={busyLabel} onClick={doSendOtp} shake={shake} />
                </>)}

                {/* ═══ OTP CODE ═══ */}
                {mode === "otpCode" && (<>
                  <div style={{ textAlign: "center", marginBottom: 20 }}>
                    {/* big OTP input */}
                    <input
                      inputMode="numeric" maxLength={6}
                      placeholder="——————"
                      value={f.code}
                      onChange={e => set("code", e.target.value.replace(/\D/g, ""))}
                      onKeyDown={e => e.key === "Enter" && f.code.length === 6 && doVerify()}
                      autoFocus
                      style={{
                        width: "100%", textAlign: "center", letterSpacing: "1em",
                        fontSize: 34, fontWeight: 900, color: "#1e293b",
                        height: 72, border: `2px solid ${f.code.length === 6 ? OR : "#e2e8f0"}`,
                        borderRadius: 16, background: f.code.length === 6 ? `${OR}08` : "#f8fafc",
                        outline: "none", fontFamily: "Sora, monospace",
                        transition: "all .2s",
                        boxShadow: f.code.length === 6 ? `0 0 0 4px ${OR}1a` : "none",
                      }}
                    />
                    {/* pip progress */}
                    <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 14 }}>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div key={i}
                          animate={{ scale: i === f.code.length - 1 ? [1, 1.4, 1] : 1 }}
                          transition={{ duration: .2 }}
                          style={{
                            width: 9, height: 9, borderRadius: "50%",
                            background: i < f.code.length ? OR : "#e2e8f0",
                            transition: "background .15s",
                          }}
                        />
                      ))}
                    </div>
                    <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 10 }}>
                      Enter the 6-digit code sent to your email
                    </p>
                  </div>
                  <ActionBtn busy={busy} disabled={f.code.length < 6} label="Verify & continue →"
                    busyLabel={busyLabel} onClick={doVerify} shake={shake} />
                  <button onClick={doSendOtp} disabled={busy}
                    style={{
                      width: "100%", height: 44, marginTop: 10, borderRadius: 12,
                      background: "transparent", border: `1.5px solid ${OR}30`,
                      color: OR, fontWeight: 600, fontSize: 13.5, cursor: "pointer",
                      transition: "background .15s, border-color .15s",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${OR}0d`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    Resend code
                  </button>
                </>)}

                {/* ═══ FORGOT ═══ */}
                {mode === "forgot" && (<>
                  <Field icon={Mail} type="email" placeholder="Registered email address *" value={f.email}
                    error={fe.email} onChange={e => set("email", e.target.value)}
                    onKeyDown={e => e.key === "Enter" && doForgot()} autoComplete="email" />
                  <ActionBtn busy={busy} label="Send reset link →" busyLabel={busyLabel} onClick={doForgot} shake={shake} />
                </>)}

                {/* ═══ RESET ═══ */}
                {mode === "reset" && (<>
                  <Field icon={KeyRound} placeholder="Reset token *" value={f.token}
                    error={fe.token} onChange={e => set("token", e.target.value)} />
                  <Field icon={Lock} type="password" placeholder="New password (min 6 chars) *" value={f.password}
                    error={fe.password} onChange={e => set("password", e.target.value)}
                    onKeyDown={e => e.key === "Enter" && doReset()} autoComplete="new-password" />
                  <ActionBtn busy={busy} label="Set new password →" busyLabel={busyLabel} onClick={doReset} shake={shake} />
                </>)}

              </motion.div>
            </AnimatePresence>

            {/* ── slow network hint ── */}
            <AnimatePresence>
              {slowNet && busy && (
                <motion.p key="slow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 10 }}>
                  ☕ Server is waking up — usually takes ~10s on free hosting…
                </motion.p>
              )}
            </AnimatePresence>

            {/* ── banner ── */}
            <AnimatePresence>
              {banner.text && <Banner key={banner.text} type={banner.type} text={banner.text} />}
            </AnimatePresence>

            {/* ── footer trust row ── */}
            <div style={{
              marginTop: 20, paddingTop: 16,
              borderTop: "1px solid #f1f5f9",
              display: "flex", justifyContent: "center", alignItems: "center", gap: 6,
            }}>
              <Sparkles size={12} color={OR} />
              <span style={{ fontSize: 11.5, color: "#94a3b8" }}>
                Free · Trusted by <strong style={{ color: "#64748b" }}>50,000+</strong> JEE aspirants
              </span>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
