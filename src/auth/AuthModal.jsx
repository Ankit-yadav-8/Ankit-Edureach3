import { useState } from "react";
import { X, Mail, Phone, ArrowLeft } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import { apiForgot, apiReset, apiSendOtp, apiVerifyOtp } from "./api.js";

const ORANGE = "#F47B20";

export default function AuthModal() {
  const { loginOpen, closeLogin, login, signup, saveSession } = useAuth();
  const [mode, setMode] = useState("login"); // login | signup | otpPhone | otpCode | forgot | reset
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", code: "", token: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  if (!loginOpen) return null;
  const go = (m) => { setErr(""); setMsg(""); setMode(m); };
  const close = () => { go("login"); setF({ name: "", email: "", phone: "", password: "", code: "", token: "" }); closeLogin(); };

  const run = (fn) => async () => {
    setErr(""); setMsg(""); setBusy(true);
    try { await fn(); } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const doLogin   = run(async () => { await login(f.email, f.password); close(); });
  const doSignup  = run(async () => { await signup({ name: f.name, email: f.email, phone: f.phone, password: f.password }); close(); });
  const doSendOtp = run(async () => { const r = await apiSendOtp({ phone: f.phone, name: f.name }); setMsg(r.devCode ? `Dev OTP: ${r.devCode}` : "OTP sent!"); go("otpCode"); });
  const doVerify  = run(async () => { const r = await apiVerifyOtp({ phone: f.phone, code: f.code }); saveSession(r); close(); });
  const doForgot  = run(async () => { const r = await apiForgot({ email: f.email }); setMsg(r.devToken ? `Dev reset token: ${r.devToken}` : "If that email exists, a reset link was sent."); if (r.devToken) { set("token", r.devToken); go("reset"); } });
  const doReset   = run(async () => { const r = await apiReset({ token: f.token, password: f.password }); saveSession(r); close(); });

  const inp = { width: "100%", marginBottom: 10 };
  const primaryBtn = { background: ORANGE, color: "#fff", justifyContent: "center", width: "100%", marginTop: 8, border: "none" };
  const linkBtn = { background: "none", border: "none", color: ORANGE, fontWeight: 700, cursor: "pointer", padding: 0 };

  const titles = {
    login: "Welcome back", signup: "Create your account", otpPhone: "Login with OTP",
    otpCode: "Enter the code", forgot: "Reset your password", reset: "Set a new password",
  };
  const subs = {
    login: "Log in to save colleges, predict ranks and track counselling.",
    signup: "We use your details only to sign you in and send important updates.",
    otpPhone: "We'll text a 6-digit code to your phone.",
    otpCode: `Code sent to ${f.phone}.`,
    forgot: "Enter your email and we'll send a reset link.",
    reset: "Choose a new password for your account.",
  };

  return (
    <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(28,28,40,.5)", zIndex: 300, display: "grid", placeItems: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: 28, width: "min(410px,100%)", boxShadow: "0 30px 70px rgba(28,28,40,.35)", position: "relative" }}>
        <button onClick={close} aria-label="Close" style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "#9aa0aa" }}><X size={20} /></button>
        {["otpPhone", "otpCode", "forgot", "reset"].includes(mode) && (
          <button onClick={() => go(mode === "otpCode" ? "otpPhone" : "login")} style={{ ...linkBtn, display: "flex", alignItems: "center", gap: 4, marginBottom: 8, color: "#9aa0aa" }}><ArrowLeft size={15} /> Back</button>
        )}

        <h3 style={{ fontFamily: "Sora", fontWeight: 800, color: "#1c1c28", marginBottom: 4, fontSize: "1.3rem" }}>{titles[mode]}</h3>
        <p style={{ color: "#6b7280", fontSize: 13.5, marginBottom: 18 }}>{subs[mode]}</p>

        {mode === "login" && (<>
          <input className="input" style={inp} type="email" placeholder="Email" value={f.email} onChange={(e) => set("email", e.target.value)} />
          <input className="input" style={inp} type="password" placeholder="Password" value={f.password} onChange={(e) => set("password", e.target.value)} />
          <div style={{ textAlign: "right", marginBottom: 4 }}><button style={linkBtn} onClick={() => go("forgot")}>Forgot password?</button></div>
          <button className="btn" style={primaryBtn} disabled={busy} onClick={doLogin}>{busy ? "…" : "Log in"}</button>
          <button className="btn" style={{ ...primaryBtn, background: "#fff", color: ORANGE, border: `1.6px solid ${ORANGE}`, display: "flex", gap: 8 }} onClick={() => go("otpPhone")}><Phone size={16} /> Login with mobile OTP</button>
        </>)}

        {mode === "signup" && (<>
          <input className="input" style={inp} placeholder="Full name" value={f.name} onChange={(e) => set("name", e.target.value)} />
          <input className="input" style={inp} placeholder="Mobile number" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
          <input className="input" style={inp} type="email" placeholder="Email" value={f.email} onChange={(e) => set("email", e.target.value)} />
          <input className="input" style={inp} type="password" placeholder="Password (min 6 chars)" value={f.password} onChange={(e) => set("password", e.target.value)} />
          <button className="btn" style={primaryBtn} disabled={busy} onClick={doSignup}>{busy ? "…" : "Sign up"}</button>
        </>)}

        {mode === "otpPhone" && (<>
          <input className="input" style={inp} placeholder="Your name (optional)" value={f.name} onChange={(e) => set("name", e.target.value)} />
          <input className="input" style={inp} placeholder="10-digit mobile number" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
          <button className="btn" style={primaryBtn} disabled={busy || f.phone.replace(/\D/g, "").length < 10} onClick={doSendOtp}>{busy ? "Sending…" : "Send OTP"}</button>
        </>)}

        {mode === "otpCode" && (<>
          <input className="input" style={inp} placeholder="6-digit code" value={f.code} onChange={(e) => set("code", e.target.value)} />
          <button className="btn" style={primaryBtn} disabled={busy || f.code.length < 6} onClick={doVerify}>{busy ? "Verifying…" : "Verify & continue"}</button>
          <button className="btn" style={{ ...primaryBtn, background: "transparent", color: ORANGE, border: "none" }} onClick={doSendOtp}>Resend code</button>
        </>)}

        {mode === "forgot" && (<>
          <input className="input" style={inp} type="email" placeholder="Your email" value={f.email} onChange={(e) => set("email", e.target.value)} />
          <button className="btn" style={primaryBtn} disabled={busy} onClick={doForgot}>{busy ? "…" : "Send reset link"}</button>
        </>)}

        {mode === "reset" && (<>
          <input className="input" style={inp} placeholder="Reset token" value={f.token} onChange={(e) => set("token", e.target.value)} />
          <input className="input" style={inp} type="password" placeholder="New password" value={f.password} onChange={(e) => set("password", e.target.value)} />
          <button className="btn" style={primaryBtn} disabled={busy} onClick={doReset}>{busy ? "…" : "Set new password"}</button>
        </>)}

        {msg && <p style={{ color: "#15a06e", fontSize: 12.5, marginTop: 10 }}>{msg}</p>}
        {err && <p style={{ color: "#e5484d", fontSize: 12.5, marginTop: 10 }}>{err}</p>}

        {(mode === "login" || mode === "signup") && (
          <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", marginTop: 16 }}>
            {mode === "login" ? "New to EduReach? " : "Already have an account? "}
            <button style={linkBtn} onClick={() => go(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Sign up" : "Log in"}</button>
          </p>
        )}
      </div>
    </div>
  );
}