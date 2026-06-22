import { useState, useEffect, useCallback, Fragment } from "react";
import {
  Users, Download, RefreshCw, ShieldCheck, LogOut, KeyRound, Mail, Phone, Calendar, Clock,
  ChevronRight, ChevronDown, CreditCard, IndianRupee, CheckCircle2, MessagesSquare, FileText,
} from "lucide-react";
import { API_BASE } from "../auth/api.js";
import CommunityModeration from "../components/admin/CommunityModeration.jsx";
import TestUpload from "../components/admin/TestUpload.jsx";

const TOKEN_STORAGE = "edureach:adminToken";
const ORANGE = "#FF693D";

const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const avatar = (name, phone) => (name || phone || "U").charAt(0).toUpperCase();

// Lowercase + strip spaces/punctuation so "Vit thal" and "vitthal" compare equal.
const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9@.]/g, "");

// Levenshtein edit distance — lets a typo'd search ("vithal") still match "Vitthal".
const editDistance = (a, b) => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let cur = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[b.length];
};

// True if the (normalized) query matches the value as a substring or a close fuzzy match.
const fuzzyMatch = (value, q) => {
  const v = norm(value);
  if (!v) return false;
  if (v.includes(q)) return true;
  const tol = Math.floor(q.length / 4) + 1; // allow ~1 typo per 4 chars
  if (editDistance(v, q) <= tol) return true;
  // also test each word/token so "vithal" matches one name in "Sai Vitthal Jadhav"
  return String(value)
    .split(/[\s@.]+/)
    .map(norm)
    .some((w) => w && (w.includes(q) || editDistance(w, q) <= tol));
};

const avatarColor = (str) => {
  const colors = ["#6366f1","#f59e0b","#10b981","#3b82f6","#ec4899","#8b5cf6","#14b8a6","#FF693D"];
  let hash = 0;
  for (let i = 0; i < (str || "").length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_STORAGE) || "");
  const [authed, setAuthed] = useState(false);
  // two-step admin login: enter key → OTP emailed to the admin inbox → verify
  const [step, setStep] = useState("key");          // "key" | "otp"
  const [adminKey, setAdminKey] = useState("");     // verified key, kept for step 2
  const [enteringKey, setEnteringKey] = useState("");
  const [enteringOtp, setEnteringOtp] = useState("");
  const [otpSentTo, setOtpSentTo] = useState("");
  const [devCode, setDevCode] = useState("");
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(() => new Set());
  const [tab, setTab] = useState("users");          // "users" | "payments"
  const [payments, setPayments] = useState([]);
  const [payTotal, setPayTotal] = useState(0);
  const [payLoaded, setPayLoaded] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = "Admin · College Parichay";
    return () => { document.title = prev; };
  }, []);

  const toggleRow = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const fetchUsers = useCallback(async (t) => {
    setBusy(true); setErr("");
    try {
      const res = await fetch(API_BASE + "/api/users", { headers: { "x-admin-token": t }, cache: "no-store" });
      if (res.status === 401 || res.status === 403) throw new Error("Session expired — please log in again");
      if (!res.ok) throw new Error("Server error " + res.status);
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total ?? (data.users?.length || 0));
      setAuthed(true);
      sessionStorage.setItem(TOKEN_STORAGE, t);
      setToken(t);
    } catch (e) {
      setErr(e.message);
      setAuthed(false);
      sessionStorage.removeItem(TOKEN_STORAGE);
      setToken("");
    } finally { setBusy(false); }
  }, []);

  const fetchPayments = useCallback(async (t) => {
    setBusy(true); setErr("");
    try {
      const res = await fetch(API_BASE + "/api/payment/enrollments", { headers: { "x-admin-token": t }, cache: "no-store" });
      if (res.status === 401 || res.status === 403) throw new Error("Session expired — please log in again");
      if (!res.ok) throw new Error("Server error " + res.status);
      const data = await res.json();
      setPayments(data.enrollments || []);
      setPayTotal(data.total ?? (data.enrollments?.length || 0));
      setPayLoaded(true);
    } catch (e) {
      setErr(e.message);
    } finally { setBusy(false); }
  }, []);

  const switchTab = (t) => {
    setTab(t); setSearch(""); setExpanded(new Set()); setErr("");
    if (t === "payments" && !payLoaded) fetchPayments(token);
  };
  // Community moderation manages its own data/refresh, so the header Refresh is a no-op there.
  const refreshActive = () => (tab === "users" ? fetchUsers(token) : tab === "payments" ? fetchPayments(token) : undefined);

  useEffect(() => { if (token) fetchUsers(token); /* eslint-disable-next-line */ }, []);

  // Step 1 — verify the admin key on the server, which emails an OTP to the
  // admin inbox. We never advance to step 2 unless the key was correct.
  async function requestOtp(k) {
    setBusy(true); setErr("");
    try {
      const res = await fetch(API_BASE + "/api/admin/request-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: k }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send the code");
      setAdminKey(k);
      setOtpSentTo(data.sentTo || "the admin email");
      if (data.devCode) setDevCode(data.devCode);
      setStep("otp"); setEnteringOtp("");
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }

  // Step 2 — verify key + OTP; on success the server returns a short-lived
  // admin session token that gates every data request.
  async function verifyOtp(code) {
    setBusy(true); setErr("");
    try {
      const res = await fetch(API_BASE + "/api/admin/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: adminKey, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Invalid code");
      setDevCode(""); setEnteringOtp(""); setAdminKey("");
      await fetchUsers(data.token);  // stores the token + flips authed on success
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }

  async function downloadCsv() {
    setErr("");
    try {
      const res = await fetch(API_BASE + "/api/users/export.csv", { headers: { "x-admin-token": token } });
      if (!res.ok) throw new Error("CSV download failed (" + res.status + ")");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "collegeparichay-users.csv";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch (e) { setErr(e.message); }
  }

  async function downloadPaymentsCsv() {
    setErr("");
    try {
      const res = await fetch(API_BASE + "/api/payment/enrollments/export.csv", { headers: { "x-admin-token": token } });
      if (!res.ok) throw new Error("CSV download failed (" + res.status + ")");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "collegeparichay-payments.csv";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch (e) { setErr(e.message); }
  }
  const exportActive = () => (tab === "users" ? downloadCsv() : downloadPaymentsCsv());

  function logout() {
    sessionStorage.removeItem(TOKEN_STORAGE);
    setToken(""); setAuthed(false);
    setStep("key"); setAdminKey(""); setEnteringKey(""); setEnteringOtp(""); setOtpSentTo(""); setDevCode("");
    setUsers([]); setTotal(0); setErr("");
    setPayments([]); setPayTotal(0); setPayLoaded(false); setTab("users");
  }

  const q = norm(search);
  const filtered = users.filter((u) =>
    !q ||
    fuzzyMatch(u.name, q) ||
    fuzzyMatch(u.email, q) ||
    fuzzyMatch(u.phone, q) ||
    fuzzyMatch(u.coaching, q)
  );
  const filteredPayments = payments.filter((p) =>
    !q ||
    fuzzyMatch(p.name, q) ||
    fuzzyMatch(p.email, q) ||
    fuzzyMatch(p.phone, q) ||
    fuzzyMatch(p.planLabel, q) ||
    fuzzyMatch(p.plan, q)
  );
  const revenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  // ── TWO-STEP LOGIN GATE (key → OTP) ───────────────────────────
  if (!authed) {
    const onKey = step === "key";
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "60px 16px", background: "#f8f7f5" }}>
        <div style={{ maxWidth: 440, width: "100%", background: "#fff", borderRadius: 20, padding: "40px 36px", boxShadow: "0 4px 32px rgba(0,0,0,0.08)", border: "1px solid #eee" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 22 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: `${ORANGE}15`, display: "grid", placeItems: "center", marginBottom: 16 }}>
              {onKey ? <ShieldCheck size={30} color={ORANGE} /> : <Mail size={30} color={ORANGE} />}
            </div>
            <h2 style={{ fontFamily: "Sora", fontWeight: 800, color: "#0d1b3e", fontSize: "1.6rem", margin: 0 }}>
              {onKey ? "Admin Access" : "Verify it's you"}
            </h2>
            <p style={{ color: "#888", fontSize: 14, marginTop: 8 }}>
              {onKey
                ? "Step 1 of 2 · Enter your secret key"
                : <>Step 2 of 2 · Enter the 6-digit code sent to <strong>{otpSentTo}</strong></>}
            </p>
          </div>

          {/* progress bars */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 22 }}>
            <span style={{ width: 28, height: 6, borderRadius: 6, background: ORANGE }} />
            <span style={{ width: 28, height: 6, borderRadius: 6, background: onKey ? "#e5e7eb" : ORANGE, transition: "background .2s" }} />
          </div>

          {onKey ? (
            <>
              <div style={{ position: "relative", marginBottom: 16 }}>
                <KeyRound size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#bbb", pointerEvents: "none" }} />
                <input
                  type="password" placeholder="Enter ADMIN_KEY"
                  value={enteringKey} onChange={(e) => setEnteringKey(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && enteringKey && !busy) requestOtp(enteringKey); }}
                  autoFocus
                  style={{
                    width: "100%", paddingLeft: 44, paddingRight: 16, height: 50,
                    borderRadius: 12, border: "1.5px solid #e5e7eb", fontSize: 15,
                    outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border .2s",
                  }}
                />
              </div>
              <button
                disabled={busy || !enteringKey}
                onClick={() => requestOtp(enteringKey)}
                style={{
                  background: ORANGE, color: "#fff", width: "100%", border: "none",
                  height: 50, borderRadius: 12, fontWeight: 700, fontSize: 16,
                  cursor: busy || !enteringKey ? "not-allowed" : "pointer",
                  opacity: busy || !enteringKey ? 0.6 : 1, transition: "opacity .2s",
                }}
              >
                {busy ? "Sending code…" : "Send verification code →"}
              </button>
            </>
          ) : (
            <>
              <div style={{ position: "relative", marginBottom: 16 }}>
                <KeyRound size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#bbb", pointerEvents: "none" }} />
                <input
                  inputMode="numeric" maxLength={6} placeholder="6-digit code"
                  value={enteringOtp}
                  onChange={(e) => setEnteringOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyDown={(e) => { if (e.key === "Enter" && enteringOtp.length === 6 && !busy) verifyOtp(enteringOtp); }}
                  autoFocus
                  style={{
                    width: "100%", paddingLeft: 44, paddingRight: 16, height: 50,
                    borderRadius: 12, border: "1.5px solid #e5e7eb", fontSize: 22,
                    letterSpacing: 6, fontWeight: 700, outline: "none", boxSizing: "border-box",
                    fontFamily: "inherit", transition: "border .2s",
                  }}
                />
              </div>
              {devCode && (
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "8px 12px", marginBottom: 14, color: "#92400e", fontSize: 13, textAlign: "center" }}>
                  Dev mode — code: <strong>{devCode}</strong>
                </div>
              )}
              <button
                disabled={busy || enteringOtp.length !== 6}
                onClick={() => verifyOtp(enteringOtp)}
                style={{
                  background: ORANGE, color: "#fff", width: "100%", border: "none",
                  height: 50, borderRadius: 12, fontWeight: 700, fontSize: 16,
                  cursor: busy || enteringOtp.length !== 6 ? "not-allowed" : "pointer",
                  opacity: busy || enteringOtp.length !== 6 ? 0.6 : 1, transition: "opacity .2s",
                }}
              >
                {busy ? "Verifying…" : "🔓 Verify & Unlock"}
              </button>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
                <button onClick={() => { setStep("key"); setErr(""); setDevCode(""); }} disabled={busy}
                  style={{ background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
                  ← Back
                </button>
                <button onClick={() => requestOtp(adminKey)} disabled={busy}
                  style={{ background: "none", border: "none", color: ORANGE, fontSize: 13, cursor: "pointer", fontWeight: 700 }}>
                  Resend code
                </button>
              </div>
            </>
          )}

          {err && (
            <div style={{ background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", marginTop: 14, color: "#dc2626", fontSize: 13, textAlign: "center" }}>
              {err}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(1200px 500px at 100% -10%, #fdeede 0%, transparent 55%), radial-gradient(1000px 460px at -10% 110%, #eef0fb 0%, transparent 50%), linear-gradient(180deg,#faf8f4 0%,#f5f3ef 100%)", padding: "32px 0 60px", position: "relative" }}>
      <style>{`
        @keyframes admUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: none; } }
        @keyframes admSpin { to { transform: rotate(360deg); } }
        .adm-stat { animation: admUp .5s cubic-bezier(.4,0,.2,1) both; transition: transform .2s, box-shadow .22s; }
        .adm-stat:hover { transform: translateY(-4px); box-shadow: 0 18px 44px rgba(13,27,62,.12); }
        .adm-stat:nth-child(2){ animation-delay:.07s } .adm-stat:nth-child(3){ animation-delay:.14s } .adm-stat:nth-child(4){ animation-delay:.21s }
        .adm-card { animation: admUp .55s .12s cubic-bezier(.4,0,.2,1) both; }
        .adm-tab { transition: background .18s, color .18s, box-shadow .18s; }
      `}</style>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${ORANGE}15`, display: "grid", placeItems: "center" }}>
                <ShieldCheck size={18} color={ORANGE} />
              </div>
              <h1 style={{ fontFamily: "Sora", fontWeight: 800, color: "#0d1b3e", fontSize: "1.5rem", margin: 0 }}>
                Admin Dashboard
              </h1>
            </div>
            <p style={{ color: "#888", fontSize: 13, margin: 0, paddingLeft: 46 }}>
              College Parichay · Live signups from MongoDB Atlas
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={refreshActive} disabled={busy}
              style={{ background: "#fff", color: ORANGE, border: `1.5px solid ${ORANGE}`, height: 40, padding: "0 16px", borderRadius: 10, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <RefreshCw size={14} style={{ animation: busy ? "spin 1s linear infinite" : "none" }} />
              {busy ? "Refreshing…" : "Refresh"}
            </button>
            {tab !== "community" && tab !== "tests" && (
              <button onClick={exportActive}
                style={{ background: ORANGE, color: "#fff", border: "none", height: 40, padding: "0 16px", borderRadius: 10, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <Download size={14} /> Export CSV
              </button>
            )}
            <button onClick={logout}
              style={{ background: "#fff", color: "#888", border: "1.5px solid #e5e7eb", height: 40, padding: "0 14px", borderRadius: 10, fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "inline-flex", gap: 6, marginBottom: 24, background: "#fff", border: "1px solid #f0e9e0", borderRadius: 50, padding: 6, boxShadow: "0 4px 16px rgba(13,27,62,.05)", flexWrap: "wrap" }}>
          {[
            { k: "users", label: "Users", icon: Users, count: total },
            { k: "payments", label: "Payments", icon: CreditCard, count: payTotal },
            { k: "community", label: "Community", icon: MessagesSquare },
            { k: "tests", label: "Tests", icon: FileText },
          ].map(({ k, label, icon: Icon, count }) => {
            const active = tab === k;
            return (
              <button key={k} onClick={() => switchTab(k)} className="adm-tab"
                style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
                  border: "none", cursor: "pointer", borderRadius: 50,
                  fontFamily: "Sora", fontWeight: 700, fontSize: 14,
                  color: active ? "#fff" : "#7c7368",
                  background: active ? "linear-gradient(135deg,#FF693D,#E0421F)" : "transparent",
                  boxShadow: active ? "0 6px 16px rgba(255, 105, 61,.32)" : "none",
                }}>
                <Icon size={16} /> {label}
                {count !== undefined && (
                  <span style={{ background: active ? "rgba(255,255,255,.25)" : "#f3f0eb", color: active ? "#fff" : "#9a9189", borderRadius: 20, padding: "1px 9px", fontSize: 12, fontWeight: 700 }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Stat cards */}
        {tab === "community" || tab === "tests" ? null : tab === "users" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
          <div className="adm-stat" style={{ background: "linear-gradient(135deg,#1a1d42 0%,#3c2a66 100%)", borderRadius: 18, padding: "20px 24px", color: "#fff", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 10px 30px rgba(60,42,102,.28)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${ORANGE}33`, display: "grid", placeItems: "center" }}>
              <Users size={22} color={ORANGE} />
            </div>
            <div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1 }}>{total}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", marginTop: 4 }}>Total signups</div>
            </div>
          </div>
          <div className="adm-stat" style={{ background: "linear-gradient(135deg,#ffffff,#fbf7f2)", borderRadius: 18, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, border: "1px solid #f0e9e0", boxShadow: "0 4px 18px rgba(13,27,62,.05)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f0fdf4", display: "grid", placeItems: "center" }}>
              <Calendar size={22} color="#16a34a" />
            </div>
            <div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1, color: "#0d1b3e" }}>
                {users.filter(u => {
                  const d = new Date(u.createdAt);
                  const now = new Date();
                  return d.toDateString() === now.toDateString();
                }).length}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Joined today</div>
            </div>
          </div>
          <div className="adm-stat" style={{ background: "linear-gradient(135deg,#ffffff,#fbf7f2)", borderRadius: 18, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, border: "1px solid #f0e9e0", boxShadow: "0 4px 18px rgba(13,27,62,.05)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${ORANGE}14`, display: "grid", placeItems: "center" }}>
              <Clock size={22} color={ORANGE} />
            </div>
            <div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1, color: "#0d1b3e" }}>
                {users.filter(u => {
                  const d = new Date(u.lastLogin);
                  const now = new Date();
                  return (now - d) < 24 * 60 * 60 * 1000;
                }).length}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Active today</div>
            </div>
          </div>
        </div>
        ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
          <div className="adm-stat" style={{ background: "linear-gradient(135deg,#1a1d42 0%,#3c2a66 100%)", borderRadius: 18, padding: "20px 24px", color: "#fff", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 10px 30px rgba(60,42,102,.28)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${ORANGE}33`, display: "grid", placeItems: "center" }}>
              <CreditCard size={22} color={ORANGE} />
            </div>
            <div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1 }}>{payTotal}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", marginTop: 4 }}>Successful payments</div>
            </div>
          </div>
          <div className="adm-stat" style={{ background: "linear-gradient(135deg,#ffffff,#fbf7f2)", borderRadius: 18, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, border: "1px solid #f0e9e0", boxShadow: "0 4px 18px rgba(13,27,62,.05)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f0fdf4", display: "grid", placeItems: "center" }}>
              <IndianRupee size={22} color="#16a34a" />
            </div>
            <div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1, color: "#0d1b3e" }}>
                ₹{revenue.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Total revenue</div>
            </div>
          </div>
          <div className="adm-stat" style={{ background: "linear-gradient(135deg,#ffffff,#fbf7f2)", borderRadius: 18, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, border: "1px solid #f0e9e0", boxShadow: "0 4px 18px rgba(13,27,62,.05)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f0fdf4", display: "grid", placeItems: "center" }}>
              <Calendar size={22} color="#16a34a" />
            </div>
            <div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1, color: "#0d1b3e" }}>
                {payments.filter(p => new Date(p.createdAt).toDateString() === new Date().toDateString()).length}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Paid today</div>
            </div>
          </div>
        </div>
        )}

        {err && (
          <div style={{ background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#dc2626", fontSize: 13 }}>
            {err}
          </div>
        )}

        {/* Search + Table */}
        {tab === "community" ? (
          <CommunityModeration token={token} />
        ) : tab === "tests" ? (
          <TestUpload token={token} />
        ) : tab === "users" ? (
        <div className="adm-card" style={{ background: "#fff", borderRadius: 20, border: "1px solid #f0e9e0", overflow: "hidden", boxShadow: "0 8px 30px rgba(13,27,62,.06)" }}>

          {/* Search bar */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, color: "#0d1b3e", fontSize: 15 }}>
              All Users
              <span style={{ marginLeft: 8, background: "#f3f4f6", borderRadius: 20, padding: "2px 10px", fontSize: 12, color: "#666", fontWeight: 600 }}>
                {filtered.length}
              </span>
            </span>
            <input
              placeholder="Search name, email or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                height: 38, padding: "0 14px", borderRadius: 10, border: "1.5px solid #e5e7eb",
                fontSize: 13, outline: "none", minWidth: 240, fontFamily: "inherit",
              }}
            />
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "#aaa", fontSize: 14 }}>
              {search ? "No users match your search." : "No signups yet."}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 1100, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#fafafa" }}>
                    {["#", "", "User", "Email", "Phone", "Coaching", "JEE Mains", "JEE Adv.", "Joined", "Last Login"].map((h, hi) => (
                      <th key={hi} style={{
                        padding: "12px 20px", textAlign: "left", fontSize: 11,
                        fontWeight: 700, color: "#999", letterSpacing: ".06em",
                        textTransform: "uppercase", borderBottom: "1px solid #f0f0f0",
                        whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => {
                    const isOpen = expanded.has(u._id);
                    return (
                    <Fragment key={u._id}>
                    <tr style={{ borderBottom: isOpen ? "none" : "1px solid #f8f8f8", transition: "background .15s", cursor: "pointer", background: isOpen ? "#fafafa" : "transparent" }}
                      onClick={() => toggleRow(u._id)}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                      onMouseLeave={e => e.currentTarget.style.background = isOpen ? "#fafafa" : "transparent"}
                    >
                      <td style={{ padding: "14px 20px", fontSize: 12, color: "#ccc", fontFamily: "monospace", width: 40 }}>
                        {i + 1}
                      </td>
                      <td style={{ padding: "14px 8px", width: 24, color: "#bbb" }}>
                        {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                            background: avatarColor(u.name || u.phone),
                            color: "#fff", display: "grid", placeItems: "center",
                            fontSize: 13, fontWeight: 800,
                          }}>
                            {avatar(u.name, u.phone)}
                          </div>
                          <span style={{ fontWeight: 600, color: "#0d1b3e", fontSize: 14 }}>
                            {u.name || "—"}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13 }}>
                          <Mail size={13} color="#bbb" />
                          {u.email || "—"}
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13 }}>
                          <Phone size={13} color="#bbb" />
                          {u.phone || "—"}
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#555" }}>
                        {u.coaching || <span style={{ color: "#ddd" }}>—</span>}
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#555", fontWeight: 600 }}>
                        {u.jeeMainsRank ? u.jeeMainsRank.toLocaleString() : "—"}
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#555", fontWeight: 600 }}>
                        {u.jeeAdvancedRank ? u.jeeAdvancedRank.toLocaleString() : "—"}
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 12.5, color: "#888", whiteSpace: "nowrap" }}>
                        {fmtDate(u.createdAt)}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{
                          fontSize: 12, color: "#555",
                          background: "#f3f4f6", borderRadius: 6,
                          padding: "4px 8px", whiteSpace: "nowrap",
                        }}>
                          {fmtDate(u.lastLogin)}
                        </span>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr style={{ borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
                        <td colSpan={10} style={{ padding: "0 20px 18px 52px" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#999", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 8 }}>
                            Full document (MongoDB Atlas)
                          </div>
                          <pre style={{
                            margin: 0, padding: "14px 16px", background: "#0d1b3e", color: "#cdd6f4",
                            borderRadius: 10, fontSize: 12.5, lineHeight: 1.6, overflowX: "auto",
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}>
                            {JSON.stringify(u, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                    </Fragment>
                  );})}
                </tbody>
              </table>
            </div>
          )}
        </div>
        ) : (
          <PaymentsTable
            payments={filteredPayments}
            search={search}
            setSearch={setSearch}
            expanded={expanded}
            toggleRow={toggleRow}
          />
        )}

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Payments tab: successful enrolments only ─────────────────────── */
function PaymentsTable({ payments, search, setSearch, expanded, toggleRow }) {
  return (
    <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #eee", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>

      {/* Search bar */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontWeight: 700, color: "#0d1b3e", fontSize: 15 }}>
          Successful Payments
          <span style={{ marginLeft: 8, background: "#f3f4f6", borderRadius: 20, padding: "2px 10px", fontSize: 12, color: "#666", fontWeight: 600 }}>
            {payments.length}
          </span>
        </span>
        <input
          placeholder="Search name, email, phone or plan…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ height: 38, padding: "0 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", minWidth: 240, fontFamily: "inherit" }}
        />
      </div>

      {payments.length === 0 ? (
        <div style={{ padding: "60px 20px", textAlign: "center", color: "#aaa", fontSize: 14 }}>
          {search ? "No payments match your search." : "No successful payments yet."}
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 1000, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                {["#", "", "Customer", "Email", "Phone", "Plan", "Amount", "Status", "Paid On"].map((h, hi) => (
                  <th key={hi} style={{
                    padding: "12px 20px", textAlign: "left", fontSize: 11,
                    fontWeight: 700, color: "#999", letterSpacing: ".06em",
                    textTransform: "uppercase", borderBottom: "1px solid #f0f0f0",
                    whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => {
                const isOpen = expanded.has(p._id);
                return (
                <Fragment key={p._id}>
                <tr style={{ borderBottom: isOpen ? "none" : "1px solid #f8f8f8", transition: "background .15s", cursor: "pointer", background: isOpen ? "#fafafa" : "transparent" }}
                  onClick={() => toggleRow(p._id)}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = isOpen ? "#fafafa" : "transparent"}
                >
                  <td style={{ padding: "14px 20px", fontSize: 12, color: "#ccc", fontFamily: "monospace", width: 40 }}>{i + 1}</td>
                  <td style={{ padding: "14px 8px", width: 24, color: "#bbb" }}>
                    {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                        background: avatarColor(p.name || p.phone),
                        color: "#fff", display: "grid", placeItems: "center",
                        fontSize: 13, fontWeight: 800,
                      }}>
                        {avatar(p.name, p.phone)}
                      </div>
                      <span style={{ fontWeight: 600, color: "#0d1b3e", fontSize: 14 }}>{p.name || "—"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13 }}>
                      <Mail size={13} color="#bbb" />{p.email || "—"}
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13 }}>
                      <Phone size={13} color="#bbb" />{p.phone || "—"}
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#555" }}>{p.planLabel || p.plan || "—"}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13.5, color: "#0d1b3e", fontWeight: 700, whiteSpace: "nowrap" }}>
                    ₹{Number(p.amount || 0).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#15803d", background: "#dcfce7", borderRadius: 20, padding: "4px 11px", whiteSpace: "nowrap" }}>
                      <CheckCircle2 size={13} /> Success
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 12.5, color: "#888", whiteSpace: "nowrap" }}>{fmtDate(p.createdAt)}</td>
                </tr>
                {isOpen && (
                  <tr style={{ borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
                    <td colSpan={9} style={{ padding: "0 20px 18px 52px" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#999", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 8 }}>
                        Full document (MongoDB Atlas · enrollments)
                      </div>
                      <pre style={{
                        margin: 0, padding: "14px 16px", background: "#0d1b3e", color: "#cdd6f4",
                        borderRadius: 10, fontSize: 12.5, lineHeight: 1.6, overflowX: "auto",
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      }}>
                        {JSON.stringify(p, null, 2)}
                      </pre>
                    </td>
                  </tr>
                )}
                </Fragment>
              );})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}