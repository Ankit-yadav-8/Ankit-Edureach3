import { useState } from "react";
import { X, Mail, ArrowLeft, Lock, User, ShieldCheck, KeyRound, Phone, GraduationCap } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import { apiForgot, apiReset, apiSendOtp, apiVerifyOtp } from "./api.js";

const ORANGE = "#F47B20";
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

// ── Static styles (created once, not on every render) ────────────────────────
const S = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(28,28,40,.55)",
    backdropFilter: "blur(3px)", zIndex: 300,
    display: "grid", placeItems: "center", padding: 16,
  },
  modal: {
    background: "#fff", borderRadius: 22, padding: "26px 26px 22px",
    width: "min(420px,100%)", boxShadow: "0 30px 80px rgba(28,28,40,.4)",
    position: "relative",
  },
  closeBtn: {
    position: "absolute", top: 16, right: 16, background: "#f4f5f7",
    border: "none", cursor: "pointer", color: "#6b7280",
    width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center",
  },
  backBtn: {
    background: "none", border: "none", color: "#9aa0aa", fontWeight: 700,
    cursor: "pointer", padding: 0, fontSize: 13.5,
    display: "flex", alignItems: "center", gap: 4, marginBottom: 10,
  },
  iconWrap: {
    width: 54, height: 54, borderRadius: 16,
    background: `${ORANGE}15`, display: "grid", placeItems: "center", marginBottom: 12,
  },
  header: {
    display: "flex", flexDirection: "column", alignItems: "center",
    textAlign: "center", marginBottom: 20,
  },
  title: {
    fontFamily: "Sora", fontWeight: 800, color: "#1c1c28",
    fontSize: "1.35rem", marginBottom: 5,
  },
  sub: { color: "#6b7280", fontSize: 13.5, lineHeight: 1.5, maxWidth: 320 },
  primary: {
    background: ORANGE, color: "#fff", justifyContent: "center",
    width: "100%", border: "none", height: 48, borderRadius: 12,
    fontWeight: 700, fontSize: 15,
  },
  outline: {
    background: "#fff", color: ORANGE, border: `1.6px solid ${ORANGE}`,
    justifyContent: "center", width: "100%", height: 48, borderRadius: 12,
    fontWeight: 700, fontSize: 15, display: "flex", gap: 8, alignItems: "center",
  },
  linkBtn: {
    background: "none", border: "none", color: ORANGE,
    fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 13.5,
  },
  dividerRow: { display: "flex", alignItems: "center", gap: 12, margin: "16px 0" },
  divider:    { flex: 1, height: 1, background: "#eceef1" },
  dividerTxt: { fontSize: 12, color: "#9aa0aa", fontWeight: 600 },
  otpInput: {
    width: "100%", textAlign: "center", letterSpacing: "0.5em",
    fontSize: 24, fontWeight: 800, color: "#1c1c28", marginBottom: 12,
  },
  resendBtn: {
    background: "transparent", color: ORANGE, border: "none",
    width: "100%", height: 42, fontWeight: 700, marginTop: 4,
  },
  fieldWrap: { position: "relative", marginBottom: 12 },
  fieldIcon: {
    position: "absolute", left: 14, top: "50%",
    transform: "translateY(-50%)", color: "#9aa0aa", pointerEvents: "none",
  },
  fieldInput: { width: "100%", paddingLeft: 42 },
  msgOk:  { color: "#15a06e", fontSize: 12.5, marginTop: 12, textAlign: "center" },
  msgErr: { color: "#e5484d", fontSize: 12.5, marginTop: 12, textAlign: "center" },
  footer: { fontSize: 13, color: "#6b7280", textAlign: "center", marginTop: 18 },
};

// ── Static HEAD config (icon + title; sub built inline only where dynamic) ───
const HEAD_STATIC = {
  login:    { icon: ShieldCheck, title: "Welcome back",         sub: "Log in to save colleges, predict ranks and track counselling." },
  signup:   { icon: User,        title: "Create your account",  sub: "Takes 20 seconds. We only use your details to sign you in." },
  otpEmail: { icon: Mail,        title: "Login with email OTP", sub: "We'll email you a 6-digit code — no password needed." },
  forgot:   { icon: Lock,        title: "Reset your password",  sub: "Enter your email and we'll send a reset link." },
  reset:    { icon: KeyRound,    title: "Set a new password",   sub: "Choose a new password for your account." },
};

// ── Reusable field ────────────────────────────────────────────────────────────
const Field = ({ icon: Icon, ...props }) => (
  <div style={S.fieldWrap}>
    <Icon size={17} style={S.fieldIcon} />
    <input className="input" style={S.fieldInput} {...props} />
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────────────────
export default function AuthModal() {
  const { loginOpen, closeLogin, login, signup, saveSession } = useAuth();
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", code: "", token: "", coaching: "" });
  const [msg,  setMsg]  = useState("");
  const [err,  setErr]  = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  if (!loginOpen) return null;

  const go    = (m) => { setErr(""); setMsg(""); setMode(m); };
  const close = () => {
    setMode("login");
    setF({ name: "", email: "", phone: "", password: "", code: "", token: "", coaching: "" });
    setErr(""); setMsg(""); closeLogin();
  };

  const run = (fn) => async () => {
    setErr(""); setMsg(""); setBusy(true);
    try { await fn(); } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const doLogin   = run(async () => { await login(f.email, f.password); close(); });
  const doSignup  = run(async () => { await signup({ name: f.name, email: f.email, phone: f.phone, coaching: f.coaching, password: f.password }); close(); });
  const doSendOtp = run(async () => {
    if (!isEmail(f.email)) throw new Error("Enter a valid email address");
    const r = await apiSendOtp({ email: f.email.trim(), name: f.name });
    setMsg(r.devCode ? `Dev OTP: ${r.devCode}` : "Code sent! Check your inbox.");
    go("otpCode");
  });
  const doVerify = run(async () => { const r = await apiVerifyOtp({ email: f.email.trim(), code: f.code }); saveSession(r); close(); });
  const doForgot = run(async () => { const r = await apiForgot({ email: f.email }); setMsg(r.devToken ? `Dev reset token: ${r.devToken}` : "If that email exists, a reset link was sent."); if (r.devToken) { set("token", r.devToken); go("reset"); } });
  const doReset  = run(async () => { const r = await apiReset({ token: f.token, password: f.password }); saveSession(r); close(); });

  // sub for modes with a dynamic value
  const sub = mode === "otpCode"
    ? `We sent a 6-digit code to ${f.email || "your email"}.`
    : HEAD_STATIC[mode]?.sub ?? "";

  const H         = HEAD_STATIC[mode] ?? HEAD_STATIC.login;
  const HeadIcon  = H.icon;
  const BACK_MODES = ["otpEmail", "otpCode", "forgot", "reset"];

  return (
    <div onClick={close} style={S.overlay}>
      <div onClick={(e) => e.stopPropagation()} style={S.modal}>

        <button onClick={close} aria-label="Close" style={S.closeBtn}><X size={17} /></button>

        {BACK_MODES.includes(mode) && (
          <button onClick={() => go(mode === "otpCode" ? "otpEmail" : "login")} style={S.backBtn}>
            <ArrowLeft size={15} /> Back
          </button>
        )}

        {/* ── header ── */}
        <div style={S.header}>
          <div style={S.iconWrap}><HeadIcon size={26} color={ORANGE} /></div>
          <h3 style={S.title}>{H.title}</h3>
          <p style={S.sub}>{sub}</p>
        </div>

        {/* ── LOGIN ── */}
        {mode === "login" && (<>
          <Field icon={Mail} type="email" placeholder="Email address" value={f.email} onChange={(e) => set("email", e.target.value)} />
          <Field icon={Lock} type="password" placeholder="Password" value={f.password} onChange={(e) => set("password", e.target.value)} />
          <div style={{ textAlign: "right", marginBottom: 14 }}>
            <button style={S.linkBtn} onClick={() => go("forgot")}>Forgot password?</button>
          </div>
          <button className="btn" style={S.primary} disabled={busy} onClick={doLogin}>{busy ? "…" : "Log in"}</button>
          <div style={S.dividerRow}>
            <div style={S.divider} /><span style={S.dividerTxt}>OR</span><div style={S.divider} />
          </div>
          <button className="btn" style={S.outline} onClick={() => go("otpEmail")}><Mail size={16} /> Login with email OTP</button>
        </>)}

        {/* ── SIGNUP ── */}
        {mode === "signup" && (<>
          <Field icon={User} placeholder="Full name" value={f.name} onChange={(e) => set("name", e.target.value)} />
          <Field icon={Phone} type="tel" inputMode="numeric" maxLength={10} placeholder="Mobile number" value={f.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} />
          <Field icon={GraduationCap} placeholder="Coaching institute (optional)" value={f.coaching} onChange={(e) => set("coaching", e.target.value)} />
          <Field icon={Mail} type="email" placeholder="Email address" value={f.email} onChange={(e) => set("email", e.target.value)} />
          <Field icon={Lock} type="password" placeholder="Password (min 6 chars)" value={f.password} onChange={(e) => set("password", e.target.value)} />
          <button className="btn" style={{ ...S.primary, marginTop: 4 }} disabled={busy} onClick={doSignup}>{busy ? "…" : "Create account"}</button>
        </>)}

        {/* ── EMAIL OTP REQUEST ── */}
        {mode === "otpEmail" && (<>
          <Field icon={User} placeholder="Your name (optional)" value={f.name} onChange={(e) => set("name", e.target.value)} />
          <Field icon={Mail} type="email" placeholder="Email address" value={f.email} onChange={(e) => set("email", e.target.value)} />
          <button className="btn" style={{ ...S.primary, marginTop: 4 }} disabled={busy || !isEmail(f.email)} onClick={doSendOtp}>{busy ? "Sending…" : "Send code"}</button>
        </>)}

        {/* ── OTP CODE ── */}
        {mode === "otpCode" && (<>
          <input className="input" inputMode="numeric" maxLength={6} placeholder="••••••"
            style={S.otpInput}
            value={f.code} onChange={(e) => set("code", e.target.value.replace(/\D/g, ""))} />
          <button className="btn" style={S.primary} disabled={busy || f.code.length < 6} onClick={doVerify}>{busy ? "Verifying…" : "Verify & continue"}</button>
          <button className="btn" style={S.resendBtn} disabled={busy} onClick={doSendOtp}>Resend code</button>
        </>)}

        {/* ── FORGOT ── */}
        {mode === "forgot" && (<>
          <Field icon={Mail} type="email" placeholder="Your email" value={f.email} onChange={(e) => set("email", e.target.value)} />
          <button className="btn" style={{ ...S.primary, marginTop: 4 }} disabled={busy} onClick={doForgot}>{busy ? "…" : "Send reset link"}</button>
        </>)}

        {/* ── RESET ── */}
        {mode === "reset" && (<>
          <Field icon={KeyRound} placeholder="Reset token" value={f.token} onChange={(e) => set("token", e.target.value)} />
          <Field icon={Lock} type="password" placeholder="New password" value={f.password} onChange={(e) => set("password", e.target.value)} />
          <button className="btn" style={{ ...S.primary, marginTop: 4 }} disabled={busy} onClick={doReset}>{busy ? "…" : "Set new password"}</button>
        </>)}

        {msg && <p style={S.msgOk}>{msg}</p>}
        {err && <p style={S.msgErr}>{err}</p>}

        {(mode === "login" || mode === "signup") && (
          <p style={S.footer}>
            {mode === "login" ? "New to EduReach? " : "Already have an account? "}
            <button style={S.linkBtn} onClick={() => go(mode === "login" ? "signup" : "login")}>
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        )}

      </div>
    </div>
  );
}