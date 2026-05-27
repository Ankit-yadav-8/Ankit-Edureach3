import { useState } from "react";
import { X, Mail, ArrowLeft, Lock, User, ShieldCheck, KeyRound, Phone, GraduationCap } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import { apiForgot, apiReset, apiSendOtp, apiVerifyOtp } from "./api.js";

const ORANGE = "#F47B20";
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

const Field = ({ icon: Icon, ...props }) => (
  <div style={{ position: "relative", marginBottom: 12 }}>
    <Icon size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9aa0aa", pointerEvents: "none" }} />
    <input className="input" style={{ width: "100%", paddingLeft: 42 }} {...props} />
  </div>
);

export default function AuthModal() {
  const { loginOpen, closeLogin, login, signup, saveSession } = useAuth();
  const [mode, setMode] = useState("login"); // login | signup | otpEmail | otpCode | forgot | reset
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", code: "", token: "", coaching: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  if (!loginOpen) return null;
  const go = (m) => { setErr(""); setMsg(""); setMode(m); };
  const close = () => { setMode("login"); setF({ name: "", email: "", phone: "", password: "", code: "", token: "", coaching: "" }); setErr(""); setMsg(""); closeLogin(); };

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
  const doVerify  = run(async () => { const r = await apiVerifyOtp({ email: f.email.trim(), code: f.code }); saveSession(r); close(); });
  const doForgot  = run(async () => { const r = await apiForgot({ email: f.email }); setMsg(r.devToken ? `Dev reset token: ${r.devToken}` : "If that email exists, a reset link was sent."); if (r.devToken) { set("token", r.devToken); go("reset"); } });
  const doReset   = run(async () => { const r = await apiReset({ token: f.token, password: f.password }); saveSession(r); close(); });

  // ── styles ──────────────────────────────────────────────────────────────
  const wrap   = { position: "relative", marginBottom: 12 };
  const iconL  = { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9aa0aa", pointerEvents: "none" };
  const inpBase= { width: "100%", paddingLeft: 42 };
  const primary= { background: ORANGE, color: "#fff", justifyContent: "center", width: "100%", border: "none", height: 48, borderRadius: 12, fontWeight: 700, fontSize: 15 };
  const outline= { background: "#fff", color: ORANGE, border: `1.6px solid ${ORANGE}`, justifyContent: "center", width: "100%", height: 48, borderRadius: 12, fontWeight: 700, fontSize: 15, display: "flex", gap: 8, alignItems: "center" };
  const linkBtn= { background: "none", border: "none", color: ORANGE, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 13.5 };

  const Field = ({ icon: Icon, ...props }) => (
    <div style={wrap}>
      <Icon size={17} style={iconL} />
      <input className="input" style={inpBase} {...props} />
    </div>
  );

  const HEAD = {
    login:    { icon: ShieldCheck, title: "Welcome back",          sub: "Log in to save colleges, predict ranks and track counselling." },
    signup:   { icon: User,        title: "Create your account",   sub: "Takes 20 seconds. We only use your details to sign you in." },
    otpEmail: { icon: Mail,        title: "Login with email OTP",  sub: "We'll email you a 6-digit code — no password needed." },
    otpCode:  { icon: KeyRound,    title: "Enter the code",        sub: `We sent a 6-digit code to ${f.email || "your email"}.` },
    forgot:   { icon: Lock,        title: "Reset your password",   sub: "Enter your email and we'll send a reset link." },
    reset:    { icon: KeyRound,    title: "Set a new password",    sub: "Choose a new password for your account." },
  };
  const H = HEAD[mode];
  const HeadIcon = H.icon;

  return (
    <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(28,28,40,.55)", backdropFilter: "blur(3px)", zIndex: 300, display: "grid", placeItems: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 22, padding: "26px 26px 22px", width: "min(420px,100%)", boxShadow: "0 30px 80px rgba(28,28,40,.4)", position: "relative" }}>
        <button onClick={close} aria-label="Close" style={{ position: "absolute", top: 16, right: 16, background: "#f4f5f7", border: "none", cursor: "pointer", color: "#6b7280", width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center" }}><X size={17} /></button>

        {["otpEmail", "otpCode", "forgot", "reset"].includes(mode) && (
          <button onClick={() => go(mode === "otpCode" ? "otpEmail" : "login")} style={{ ...linkBtn, color: "#9aa0aa", display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}><ArrowLeft size={15} /> Back</button>
        )}

        {/* header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 54, height: 54, borderRadius: 16, background: `${ORANGE}15`, display: "grid", placeItems: "center", marginBottom: 12 }}>
            <HeadIcon size={26} color={ORANGE} />
          </div>
          <h3 style={{ fontFamily: "Sora", fontWeight: 800, color: "#1c1c28", fontSize: "1.35rem", marginBottom: 5 }}>{H.title}</h3>
          <p style={{ color: "#6b7280", fontSize: 13.5, lineHeight: 1.5, maxWidth: 320 }}>{H.sub}</p>
        </div>

        {/* ── LOGIN ── */}
        {mode === "login" && (<>
          <Field icon={Mail} type="email" placeholder="Email address" value={f.email} onChange={(e) => set("email", e.target.value)} />
          <Field icon={Lock} type="password" placeholder="Password" value={f.password} onChange={(e) => set("password", e.target.value)} />
          <div style={{ textAlign: "right", marginBottom: 14 }}><button style={linkBtn} onClick={() => go("forgot")}>Forgot password?</button></div>
          <button className="btn" style={primary} disabled={busy} onClick={doLogin}>{busy ? "…" : "Log in"}</button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#eceef1" }} />
            <span style={{ fontSize: 12, color: "#9aa0aa", fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "#eceef1" }} />
          </div>

          <button className="btn" style={outline} onClick={() => go("otpEmail")}><Mail size={16} /> Login with email OTP</button>
        </>)}

        {/* ── SIGNUP ── */}
        {mode === "signup" && (<>
          <Field icon={User} placeholder="Full name" value={f.name} onChange={(e) => set("name", e.target.value)} />
          <Field icon={Phone} type="tel" inputMode="numeric" maxLength={10} placeholder="Mobile number" value={f.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} />
          <Field icon={GraduationCap} placeholder="Coaching institute (optional)" value={f.coaching} onChange={(e) => set("coaching", e.target.value)} />
          <Field icon={Mail} type="email" placeholder="Email address" value={f.email} onChange={(e) => set("email", e.target.value)} />
          <Field icon={Lock} type="password" placeholder="Password (min 6 chars)" value={f.password} onChange={(e) => set("password", e.target.value)} />
          <button className="btn" style={{ ...primary, marginTop: 4 }} disabled={busy} onClick={doSignup}>{busy ? "…" : "Create account"}</button>
        </>)}

        {/* ── EMAIL OTP REQUEST ── */}
        {mode === "otpEmail" && (<>
          <Field icon={User} placeholder="Your name (optional)" value={f.name} onChange={(e) => set("name", e.target.value)} />
          <Field icon={Mail} type="email" placeholder="Email address" value={f.email} onChange={(e) => set("email", e.target.value)} />
          <button className="btn" style={{ ...primary, marginTop: 4 }} disabled={busy || !isEmail(f.email)} onClick={doSendOtp}>{busy ? "Sending…" : "Send code"}</button>
        </>)}

        {/* ── OTP CODE ── */}
        {mode === "otpCode" && (<>
          <input className="input" inputMode="numeric" maxLength={6} placeholder="••••••"
            style={{ width: "100%", textAlign: "center", letterSpacing: "0.5em", fontSize: 24, fontWeight: 800, color: "#1c1c28", marginBottom: 12 }}
            value={f.code} onChange={(e) => set("code", e.target.value.replace(/\D/g, ""))} />
          <button className="btn" style={primary} disabled={busy || f.code.length < 6} onClick={doVerify}>{busy ? "Verifying…" : "Verify & continue"}</button>
          <button className="btn" style={{ background: "transparent", color: ORANGE, border: "none", width: "100%", height: 42, fontWeight: 700, marginTop: 4 }} disabled={busy} onClick={doSendOtp}>Resend code</button>
        </>)}

        {/* ── FORGOT ── */}
        {mode === "forgot" && (<>
          <Field icon={Mail} type="email" placeholder="Your email" value={f.email} onChange={(e) => set("email", e.target.value)} />
          <button className="btn" style={{ ...primary, marginTop: 4 }} disabled={busy} onClick={doForgot}>{busy ? "…" : "Send reset link"}</button>
        </>)}

        {/* ── RESET ── */}
        {mode === "reset" && (<>
          <Field icon={KeyRound} placeholder="Reset token" value={f.token} onChange={(e) => set("token", e.target.value)} />
          <Field icon={Lock} type="password" placeholder="New password" value={f.password} onChange={(e) => set("password", e.target.value)} />
          <button className="btn" style={{ ...primary, marginTop: 4 }} disabled={busy} onClick={doReset}>{busy ? "…" : "Set new password"}</button>
        </>)}

        {msg && <p style={{ color: "#15a06e", fontSize: 12.5, marginTop: 12, textAlign: "center" }}>{msg}</p>}
        {err && <p style={{ color: "#e5484d", fontSize: 12.5, marginTop: 12, textAlign: "center" }}>{err}</p>}

        {(mode === "login" || mode === "signup") && (
          <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", marginTop: 18 }}>
            {mode === "login" ? "New to EduReach? " : "Already have an account? "}
            <button style={linkBtn} onClick={() => go(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Sign up" : "Log in"}</button>
          </p>
        )}
      </div>
    </div>
  );
}