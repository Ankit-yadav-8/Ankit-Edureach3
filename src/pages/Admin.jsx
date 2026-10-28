import { useState, useEffect, useCallback, Fragment, useMemo } from "react";
import {
  Users, Download, RefreshCw, ShieldCheck, LogOut, KeyRound, Mail, Phone, Calendar, Clock,
  ChevronRight, ChevronDown, CreditCard, IndianRupee, CheckCircle2, MessagesSquare, FileText,
  GraduationCap, Tag, Send, Eye, EyeOff, Lock, AlertTriangle, ArrowRight, ShieldAlert,
  LayoutDashboard, LineChart, Menu, X, Search, Sparkles, Building2, UserCheck, Layers, ExternalLink,
} from "lucide-react";
import { API_BASE } from "../auth/api.js";
import CommunityModeration from "../components/admin/CommunityModeration.jsx";
import TestUpload from "../components/admin/TestUpload.jsx";
import Mentors from "../components/admin/Mentors.jsx";
import CouponManager from "../components/admin/CouponManager.jsx";
import AdminOverview from "../components/admin/AdminOverview.jsx";
import MentorTracking from "../components/admin/MentorTracking.jsx";

const TOKEN_STORAGE = "edureach:adminToken";
const ORANGE = "#FF693D";

// Tabs that render one self-contained component and own their whole surface:
const SELF_CONTAINED_TABS = new Set(["overview", "mentor-tracking", "community", "tests", "mentors", "coupons"]);

const fmtDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const avatar = (name, phone) => (name || phone || "U").charAt(0).toUpperCase();

// Lowercase + strip spaces/punctuation so "Vit thal" and "vitthal" compare equal.
const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9@.]/g, "");

// Levenshtein edit distance - lets a typo'd search ("vithal") still match "Vitthal".
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
  // Which admin inbox gets the code. Chosen by INDEX - the real addresses never
  // leave the server, the picker only ever shows masked labels.
  const [inboxes, setInboxes] = useState([]);
  const [inbox, setInbox] = useState(0);
  const [adminKey, setAdminKey] = useState("");     // verified key, kept for step 2
  const [enteringKey, setEnteringKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [enteringOtp, setEnteringOtp] = useState("");
  const [otpSentTo, setOtpSentTo] = useState("");
  const [devCode, setDevCode] = useState("");
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(() => new Set());
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [payTotal, setPayTotal] = useState(0);
  const [payLoaded, setPayLoaded] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = "Admin · Campus Point";
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
      if (res.status === 401 || res.status === 403) throw new Error("Session expired - please log in again");
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
      if (res.status === 401 || res.status === 403) throw new Error("Session expired - please log in again");
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
    setTab(t); setSearch(""); setExpanded(new Set()); setErr(""); setSidebarOpen(false);
    if (t === "payments" && !payLoaded) fetchPayments(token);
    if (t === "users" && users.length === 0) fetchUsers(token);
  };
  // Community and self-contained sections manage their own refresh.
  const refreshActive = () => (tab === "users" ? fetchUsers(token) : tab === "payments" ? fetchPayments(token) : undefined);

  useEffect(() => { if (token) fetchUsers(token); /* eslint-disable-next-line */ }, []);

  // Masked list of inboxes a code may be sent to, so each owner can pick their own.
  useEffect(() => {
    fetch(API_BASE + "/api/admin/inboxes")
      .then((r) => r.json())
      .then((d) => setInboxes(d.inboxes || []))
      .catch(() => setInboxes([]));  // picker just hides; the default inbox still works
  }, []);

  // Step 1 - verify the admin key on the server, which emails an OTP to the
  // admin inbox. We never advance to step 2 unless the key was correct.
  async function requestOtp(k) {
    setBusy(true); setErr("");
    try {
      const res = await fetch(API_BASE + "/api/admin/request-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: k, inbox }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send the code");
      setAdminKey(k);
      setOtpSentTo(data.sentTo || "the admin email");
      if (data.devCode) setDevCode(data.devCode);
      setStep("otp"); setEnteringOtp("");
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }

  // Step 2 - verify key + OTP; on success the server returns a short-lived
  // admin session token that gates every data request.
  async function verifyOtp(code) {
    setBusy(true); setErr("");
    try {
      const res = await fetch(API_BASE + "/api/admin/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: adminKey, code, inbox }),
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
      a.href = url; a.download = "CampusPoint-users.csv";
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
      a.href = url; a.download = "CampusPoint-payments.csv";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch (e) { setErr(e.message); }
  }
  const exportActive = () => (tab === "users" ? downloadCsv() : tab === "payments" ? downloadPaymentsCsv() : undefined);
  const [approvingId, setApprovingId] = useState("");

  async function handleApproveEmail(id) {
    if (!window.confirm("Approve and send payment confirmation email to this student now?")) return;
    setApprovingId(id);
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/api/payment/enrollments/${id}/approve-email`, {
        method: "POST",
        headers: { "x-admin-token": token },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to approve email");
      setPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, confirmationEmailSent: true, emailApproved: true } : p))
      );
      alert(data.message || "Payment confirmation email sent successfully!");
    } catch (e) {
      alert(e.message || "Approval failed");
    } finally {
      setApprovingId("");
    }
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_STORAGE);
    setToken(""); setAuthed(false);
    setStep("key"); setAdminKey(""); setEnteringKey(""); setEnteringOtp(""); setOtpSentTo(""); setDevCode("");
    setUsers([]); setTotal(0); setErr("");
    setPayments([]); setPayTotal(0); setPayLoaded(false); setTab("overview"); setSidebarOpen(false);
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
  // ── TWO-STEP LOGIN GATE (key → OTP) ───────────────────────────
  if (!authed) {
    const onKey = step === "key";
    const primaryAdminEmail = inboxes[0]?.email || "ankityadav08022008@gmail.com";

    return (
      <div style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "40px 16px",
        background: "radial-gradient(ellipse at 50% 15%, rgba(255, 105, 61, 0.08) 0%, transparent 60%), #f8fafc",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}>
        <div style={{
          maxWidth: 460,
          width: "100%",
          background: "#ffffff",
          borderRadius: 24,
          padding: "40px 36px 32px",
          boxShadow: "0 20px 50px -12px rgba(15, 23, 42, 0.09), 0 0 0 1px rgba(15, 23, 42, 0.06)",
          position: "relative",
          zIndex: 1,
        }}>
          {/* Header Security Status Badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#f1f5f9",
              padding: "5px 12px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.6,
              color: "#334155",
              textTransform: "uppercase",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 6px #10b981" }} />
              Active Defense · 256-Bit SSL
            </span>
          </div>

          {/* Icon and Title */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 22 }}>
            <div style={{
              width: 68,
              height: 68,
              borderRadius: 20,
              background: onKey ? "linear-gradient(135deg, rgba(255,105,61,0.12), rgba(249,115,22,0.06))" : "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(59,130,246,0.06))",
              display: "grid",
              placeItems: "center",
              marginBottom: 16,
              border: `1.5px solid ${onKey ? "rgba(255,105,61,0.2)" : "rgba(37,99,235,0.2)"}`,
              boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
            }}>
              {onKey ? <ShieldCheck size={32} color={ORANGE} /> : <Mail size={32} color="#2563eb" />}
            </div>
            <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, color: "#0f172a", fontSize: "1.7rem", margin: 0, letterSpacing: -0.5 }}>
              {onKey ? "CampusPoint Admin" : "Security Verification"}
            </h2>
            <p style={{ color: "#64748b", fontSize: 13.5, marginTop: 6, marginBottom: 0, lineHeight: 1.4 }}>
              {onKey
                ? "Enter your secret authorization key to proceed"
                : <>6-digit one-time passcode sent to <strong>{otpSentTo || primaryAdminEmail}</strong></>}
            </p>
          </div>

          {/* Stepper Progress Indicator */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%",
                background: onKey ? ORANGE : "#10b981",
                color: "#fff", fontSize: 11, fontWeight: 800,
                display: "grid", placeItems: "center",
              }}>
                {onKey ? "1" : "✓"}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: onKey ? "#0f172a" : "#10b981" }}>Key</span>
            </div>
            <div style={{ width: 36, height: 2, background: onKey ? "#e2e8f0" : "#10b981", borderRadius: 2 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%",
                background: !onKey ? ORANGE : "#e2e8f0",
                color: !onKey ? "#fff" : "#94a3b8", fontSize: 11, fontWeight: 800,
                display: "grid", placeItems: "center",
              }}>
                2
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: !onKey ? "#0f172a" : "#94a3b8" }}>2FA OTP</span>
            </div>
          </div>

          {/* Verified Admin 2FA Destination Badge */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            borderRadius: 12,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            marginBottom: 20,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "#eff6ff", display: "grid", placeItems: "center" }}>
                <Mail size={14} color="#2563eb" />
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>2FA Inbox</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{primaryAdminEmail}</div>
              </div>
            </div>
            <span style={{
              fontSize: 11,
              fontWeight: 800,
              padding: "3px 8px",
              borderRadius: 6,
              background: "#ecfdf5",
              color: "#059669",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}>
              <CheckCircle2 size={12} /> Verified
            </span>
          </div>

          {onKey ? (
            <>
              {/* Step 1: Secret Key Input with Eye Toggle */}
              <div style={{ position: "relative", marginBottom: 18 }}>
                <KeyRound size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                <input
                  type={showKey ? "text" : "password"}
                  placeholder="Enter secret ADMIN_KEY"
                  value={enteringKey}
                  onChange={(e) => setEnteringKey(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && enteringKey && !busy) requestOtp(enteringKey); }}
                  autoFocus
                  style={{
                    width: "100%", paddingLeft: 46, paddingRight: 46, height: 52,
                    borderRadius: 14, border: "1.5px solid #e2e8f0", fontSize: 15,
                    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                    transition: "all .2s ease",
                    background: "#ffffff",
                    color: "#0f172a",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = ORANGE; e.target.style.boxShadow = "0 0 0 3px rgba(255,105,61,0.15)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  tabIndex={-1}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "#94a3b8", cursor: "pointer",
                    padding: 4, display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                  title={showKey ? "Hide key" : "Show key"}
                >
                  {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Submit Button */}
              <button
                disabled={busy || !enteringKey}
                onClick={() => requestOtp(enteringKey)}
                style={{
                  background: "linear-gradient(135deg, #FF693D 0%, #ea580c 100%)",
                  color: "#fff", width: "100%", border: "none",
                  height: 52, borderRadius: 14, fontWeight: 700, fontSize: 15,
                  cursor: busy || !enteringKey ? "not-allowed" : "pointer",
                  opacity: busy || !enteringKey ? 0.6 : 1, transition: "all .2s ease",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 6px 18px rgba(255,105,61,0.28)",
                }}
              >
                {busy ? (
                  <>
                    <RefreshCw size={17} style={{ animation: "admSpin 1s linear infinite" }} />
                    Verifying & Sending OTP...
                  </>
                ) : (
                  <>
                    Send Verification Code <ArrowRight size={17} />
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* Step 2: 6-Digit OTP Input */}
              <div style={{ position: "relative", marginBottom: 18 }}>
                <input
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="••••••"
                  value={enteringOtp}
                  onChange={(e) => setEnteringOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyDown={(e) => { if (e.key === "Enter" && enteringOtp.length === 6 && !busy) verifyOtp(enteringOtp); }}
                  autoFocus
                  style={{
                    width: "100%", height: 56, textAlign: "center",
                    borderRadius: 14, border: "1.5px solid #e2e8f0", fontSize: 26,
                    letterSpacing: 10, fontWeight: 800, outline: "none", boxSizing: "border-box",
                    fontFamily: "monospace", transition: "all .2s ease",
                    background: "#ffffff", color: "#0f172a",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              {devCode && (
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "8px 12px", marginBottom: 14, color: "#92400e", fontSize: 13, textAlign: "center" }}>
                  Dev mode code: <strong>{devCode}</strong>
                </div>
              )}

              {/* Verify Button */}
              <button
                disabled={busy || enteringOtp.length !== 6}
                onClick={() => verifyOtp(enteringOtp)}
                style={{
                  background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  color: "#fff", width: "100%", border: "none",
                  height: 52, borderRadius: 14, fontWeight: 700, fontSize: 15,
                  cursor: busy || enteringOtp.length !== 6 ? "not-allowed" : "pointer",
                  opacity: busy || enteringOtp.length !== 6 ? 0.6 : 1, transition: "all .2s ease",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 6px 18px rgba(5,150,105,0.28)",
                }}
              >
                {busy ? (
                  <>
                    <RefreshCw size={17} style={{ animation: "admSpin 1s linear infinite" }} />
                    Verifying Code...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} /> Verify & Unlock Console
                  </>
                )}
              </button>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                <button
                  type="button"
                  onClick={() => { setStep("key"); setErr(""); setDevCode(""); }}
                  disabled={busy}
                  style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", fontWeight: 600 }}
                >
                  ← Back to Key
                </button>
                <button
                  type="button"
                  onClick={() => requestOtp(adminKey)}
                  disabled={busy}
                  style={{ background: "none", border: "none", color: ORANGE, fontSize: 13, cursor: "pointer", fontWeight: 700 }}
                >
                  Resend Code
                </button>
              </div>
            </>
          )}

          {/* Security Alert / Error Box */}
          {err && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 12,
              padding: "12px 14px",
              marginTop: 18,
              color: "#991b1b",
              fontSize: 13,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              textAlign: "left",
              lineHeight: 1.45,
            }}>
              <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} color="#dc2626" />
              <div>
                <div style={{ fontWeight: 800, marginBottom: 2 }}>Access Denied</div>
                <div>{err}</div>
              </div>
            </div>
          )}

          {/* Footer Security Badges */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            marginTop: 24,
            paddingTop: 18,
            borderTop: "1px solid #f1f5f9",
            fontSize: 11.5,
            color: "#64748b",
            fontWeight: 600,
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <ShieldAlert size={13} color="#f97316" /> 5-Strike Lockout
            </span>
            <span>•</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Lock size={13} color="#2563eb" /> 2FA Active
            </span>
            <span>•</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <ShieldCheck size={13} color="#059669" /> Auto-Alerted
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────────────
  const primaryAdminEmail = inboxes[0]?.email || "ankityadav08022008@gmail.com";

  const NAV_GROUPS = [
    {
      title: "Analytics & Telemetry",
      items: [
        { k: "overview", label: "Overview", icon: LayoutDashboard },
        { k: "mentor-tracking", label: "Mentor Tracking", icon: LineChart, badge: "Live" },
      ],
    },
    {
      title: "Platform Management",
      items: [
        { k: "mentors", label: "Mentors", icon: GraduationCap },
        { k: "users", label: "Students", icon: Users, count: total },
        { k: "payments", label: "Payments", icon: CreditCard, count: payTotal },
      ],
    },
    {
      title: "Academics & Content",
      items: [
        { k: "tests", label: "Mock Tests", icon: FileText },
        { k: "community", label: "Community", icon: MessagesSquare },
        { k: "coupons", label: "Coupons", icon: Tag },
      ],
    },
  ];

  const TAB_LABELS = {
    "overview": "Overview & Business Pulse",
    "mentor-tracking": "Mentor Analytics & Tracking",
    "mentors": "Mentor Accounts & Students",
    "users": "Student User Directory",
    "payments": "Payments & Approvals",
    "tests": "Mock Test Questions",
    "community": "Community Moderation",
    "coupons": "Discount Coupons",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", position: "relative", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <style>{`
        @keyframes admUp { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: none; } }
        @keyframes admSpin { to { transform: rotate(360deg); } }
        .adm-fade { animation: admUp .35s cubic-bezier(.4,0,.2,1) both; }
        .adm-nav-btn {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: #475569;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.16s ease;
          text-align: left;
          box-sizing: border-box;
        }
        .adm-nav-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .adm-nav-btn.active {
          background: ${ORANGE} !important;
          color: #ffffff !important;
          box-shadow: 0 4px 14px rgba(255, 105, 61, 0.35);
        }
        .adm-stat {
          animation: admUp .4s cubic-bezier(.4,0,.2,1) both;
          transition: transform .2s, box-shadow .22s;
        }
        .adm-stat:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 34px rgba(13,27,62,.09);
        }
        @media (max-width: 1024px) {
          .adm-sidebar {
            position: fixed !important;
            z-index: 100 !important;
            top: 0;
            bottom: 0;
            left: 0;
            width: 270px !important;
            transform: translateX(-100%);
            transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: none;
          }
          .adm-sidebar.open {
            transform: translateX(0) !important;
            box-shadow: 0 0 50px rgba(0,0,0,0.3) !important;
          }
          .adm-mobile-overlay {
            display: block !important;
          }
          .adm-menu-btn {
            display: inline-flex !important;
          }
          .adm-mobile-close {
            display: flex !important;
          }
          .adm-content-area {
            padding: 16px 16px 40px !important;
          }
        }
        @media (min-width: 1025px) {
          .adm-mobile-overlay {
            display: none !important;
          }
          .adm-menu-btn {
            display: none !important;
          }
          .adm-mobile-close {
            display: none !important;
          }
        }
      `}</style>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="adm-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.45)",
            backdropFilter: "blur(3px)",
            zIndex: 95,
          }}
        />
      )}

      {/* ── SLEEK SIDE PANEL (SIDEBAR) ─────────────────────────── */}
      <aside
        className={`adm-sidebar ${sidebarOpen ? "open" : ""}`}
        style={{
          width: 260,
          background: "#ffffff",
          borderRight: "1px solid #f0e9e0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexShrink: 0,
          height: "100vh",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxSizing: "border-box",
        }}
      >
        {/* Top Logo / Brand */}
        <div style={{
          padding: "20px 20px 18px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${ORANGE}, #e0421f)`,
              display: "grid",
              placeItems: "center",
              color: "#ffffff",
              fontWeight: 900,
              fontFamily: "Sora, sans-serif",
              fontSize: 15,
              boxShadow: "0 4px 12px rgba(255,105,61,0.28)",
            }}>
              CP
            </div>
            <div>
              <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, color: "#0f172a", fontSize: 15, letterSpacing: -0.3 }}>
                Campus Point
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 1 }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: ORANGE,
                  background: `${ORANGE}15`,
                  padding: "1px 6px",
                  borderRadius: 4,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}>
                  Admin Suite
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="adm-mobile-close"
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              padding: 4,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation Item Groups */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{
                fontSize: 10.5,
                fontWeight: 800,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: 0.6,
                padding: "0 10px 4px",
              }}>
                {group.title}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = tab === item.k;
                return (
                  <button
                    key={item.k}
                    onClick={() => switchTab(item.k)}
                    className={`adm-nav-btn ${active ? "active" : ""}`}
                  >
                    <Icon size={17} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{item.label}</span>

                    {item.count !== undefined && (
                      <span style={{
                        background: active ? "rgba(255,255,255,0.25)" : "#f1f5f9",
                        color: active ? "#ffffff" : "#64748b",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: 20,
                      }}>
                        {item.count}
                      </span>
                    )}

                    {item.badge && (
                      <span style={{
                        background: active ? "rgba(255,255,255,0.25)" : "#ecfdf5",
                        color: active ? "#ffffff" : "#059669",
                        fontSize: 10,
                        fontWeight: 800,
                        padding: "1px 6px",
                        borderRadius: 10,
                        textTransform: "uppercase",
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Profile & Actions */}
        <div style={{
          padding: "16px 16px 20px",
          borderTop: "1px solid #f1f5f9",
          background: "#fafafa",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}>
          {/* Admin User Chip */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#0f172a",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              fontSize: 12,
              fontWeight: 800,
            }}>
              AD
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Super Admin
              </div>
              <div style={{ fontSize: 11, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {primaryAdminEmail}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              height: 36,
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              color: "#64748b",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.borderColor = "#fca5a5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
          >
            <LogOut size={14} /> End Session
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ───────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: "100vh" }}>
        {/* Top Navigation Bar */}
        <header style={{
          height: 64,
          background: "#ffffff",
          borderBottom: "1px solid #f0e9e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}>
          {/* Breadcrumb / Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="adm-menu-btn"
              title="Open Navigation"
              style={{
                display: "none",
                background: "#f1f5f9",
                border: "none",
                borderRadius: 8,
                padding: "7px",
                cursor: "pointer",
                color: "#334155",
              }}
            >
              <Menu size={18} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <span style={{ color: "#94a3b8" }}>Campus Point</span>
              <ChevronRight size={13} color="#cbd5e1" />
              <span style={{ color: "#0f172a", fontWeight: 800, fontFamily: "Sora, sans-serif" }}>
                {TAB_LABELS[tab] || tab}
              </span>
            </div>
          </div>

          {/* Top Right Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Global search input on Users & Payments */}
            {(tab === "users" || tab === "payments") && (
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  placeholder={tab === "users" ? "Search students…" : "Search payments…"}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    height: 36,
                    paddingLeft: 30,
                    paddingRight: 10,
                    borderRadius: 10,
                    border: "1.5px solid #e2e8f0",
                    fontSize: 12.5,
                    outline: "none",
                    minWidth: 200,
                  }}
                />
              </div>
            )}

            {/* Live System Indicator */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              padding: "5px 11px",
              borderRadius: 20,
              fontSize: 11.5,
              fontWeight: 700,
              color: "#166534",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", boxShadow: "0 0 6px #16a34a" }} />
              Live Sync
            </div>

            {/* Refresh */}
            <button
              onClick={refreshActive}
              disabled={busy}
              style={{
                background: "#ffffff",
                color: "#475569",
                border: "1px solid #e2e8f0",
                height: 36,
                padding: "0 12px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 12.5,
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: busy ? "not-allowed" : "pointer",
              }}
            >
              <RefreshCw size={13} style={{ animation: busy ? "admSpin 1s linear infinite" : "none" }} />
              <span>{busy ? "Syncing…" : "Sync"}</span>
            </button>

            {/* CSV Export on Users / Payments */}
            {!SELF_CONTAINED_TABS.has(tab) && (
              <button
                onClick={exportActive}
                style={{
                  background: ORANGE,
                  color: "#ffffff",
                  border: "none",
                  height: 36,
                  padding: "0 14px",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 12.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  boxShadow: "0 3px 10px rgba(255,105,61,0.25)",
                }}
              >
                <Download size={13} /> Export
              </button>
            )}
          </div>
        </header>

        {/* Viewport Content */}
        <main className="adm-content-area" style={{ flex: 1, padding: "28px 32px 60px", maxWidth: 1400, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
          <div className="adm-fade">
            {tab === "overview" ? (
              <AdminOverview adminToken={token} onNavigateTab={switchTab} />
            ) : tab === "mentor-tracking" ? (
              <MentorTracking adminToken={token} />
            ) : tab === "community" ? (
              <CommunityModeration token={token} />
            ) : tab === "tests" ? (
              <TestUpload token={token} />
            ) : tab === "mentors" ? (
              <Mentors token={token} />
            ) : tab === "coupons" ? (
              <CouponManager token={token} />
            ) : tab === "users" ? (
              <>
                {/* Users Stat Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: 16, marginBottom: 28 }}>
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

                {/* Users Table */}
                <div className="adm-card" style={{ background: "#ffffff", borderRadius: 20, border: "1px solid #f0e9e0", overflow: "hidden", boxShadow: "0 4px 20px rgba(13,27,62,.04)" }}>
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, color: "#0d1b3e", fontSize: 15 }}>
                      Registered Students
                      <span style={{ marginLeft: 8, background: "#f3f4f6", borderRadius: 20, padding: "2px 10px", fontSize: 12, color: "#666", fontWeight: 600 }}>
                        {filtered.length}
                      </span>
                    </span>
                  </div>

                  {filtered.length === 0 ? (
                    <div style={{ padding: "60px 20px", textAlign: "center", color: "#aaa", fontSize: 14 }}>
                      {search ? "No students match your search." : "No signups yet."}
                    </div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", minWidth: 1100, borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: "#fafafa" }}>
                            {["#", "", "User", "Email", "Phone", "Coaching", "Class", "Joined", "Last Login"].map((h, hi) => (
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
                                        {u.name || "-"}
                                      </span>
                                    </div>
                                  </td>
                                  <td style={{ padding: "14px 20px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13 }}>
                                      <Mail size={13} color="#bbb" />
                                      {u.email || "-"}
                                    </div>
                                  </td>
                                  <td style={{ padding: "14px 20px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13 }}>
                                      <Phone size={13} color="#bbb" />
                                      {u.phone || "-"}
                                    </div>
                                  </td>
                                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#555" }}>
                                    {u.coaching || <span style={{ color: "#ddd" }}>-</span>}
                                  </td>
                                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#555", fontWeight: 600 }}>
                                    {u.studentClass || "-"}
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
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Payments Stat Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: 16, marginBottom: 28 }}>
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
                  <div className="adm-stat" style={{ background: "linear-gradient(135deg,#ffffff,#fff7ed)", borderRadius: 18, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, border: "1px solid #fed7aa", boxShadow: "0 4px 18px rgba(13,27,62,.05)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#ffedd5", display: "grid", placeItems: "center" }}>
                      <Mail size={22} color="#ea580c" />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1, color: "#ea580c" }}>
                        {payments.filter(p => !p.confirmationEmailSent).length}
                      </div>
                      <div style={{ fontSize: 12, color: "#9a3412", marginTop: 4, fontWeight: 600 }}>Awaiting email approval</div>
                    </div>
                  </div>
                </div>

                <PaymentsTable
                  payments={filteredPayments}
                  search={search}
                  setSearch={setSearch}
                  expanded={expanded}
                  toggleRow={toggleRow}
                  onApproveEmail={handleApproveEmail}
                  approvingId={approvingId}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ── Payments tab: successful enrolments only ─────────────────────── */
function PaymentsTable({ payments, search, setSearch, expanded, toggleRow, onApproveEmail, approvingId }) {
  return (
    <div style={{ background: "var(--page-bg)", borderRadius: 20, border: "1px solid #eee", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>

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
          <table style={{ width: "100%", minWidth: 1050, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                {["#", "", "Customer", "Email", "Phone", "Plan", "Amount", "Email Approval", "Status", "Paid On"].map((h, hi) => (
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
                      <span style={{ fontWeight: 600, color: "#0d1b3e", fontSize: 14 }}>{p.name || "-"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13 }}>
                      <Mail size={13} color="#bbb" />{p.email || "-"}
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13 }}>
                      <Phone size={13} color="#bbb" />{p.phone || "-"}
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#555" }}>{p.planLabel || p.plan || "-"}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13.5, color: "#0d1b3e", fontWeight: 700, whiteSpace: "nowrap" }}>
                    ₹{Number(p.amount || 0).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "14px 20px" }} onClick={(e) => e.stopPropagation()}>
                    {p.confirmationEmailSent ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#15803d", background: "#dcfce7", borderRadius: 20, padding: "4px 11px", whiteSpace: "nowrap" }}>
                        <CheckCircle2 size={13} /> Sent to User
                      </span>
                    ) : (
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 700, color: "#b45309", background: "#fef3c7", borderRadius: 20, padding: "3px 9px", whiteSpace: "nowrap" }}>
                          <Clock size={11} /> Pending
                        </span>
                        <button
                          type="button"
                          onClick={() => onApproveEmail(p._id)}
                          disabled={approvingId === p._id}
                          style={{
                            background: ORANGE,
                            color: "#fff",
                            border: "none",
                            padding: "4px 10px",
                            borderRadius: 8,
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: approvingId === p._id ? "not-allowed" : "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            whiteSpace: "nowrap",
                            boxShadow: "0 2px 8px rgba(255,105,61,0.25)",
                          }}
                        >
                          <Send size={11} />
                          {approvingId === p._id ? "Sending…" : "Approve"}
                        </button>
                      </div>
                    )}
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
                    <td colSpan={10} style={{ padding: "0 20px 18px 52px" }}>
                      {!p.confirmationEmailSent && (
                        <div style={{ background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: 12, padding: "14px 18px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#9a3412" }}>
                              ⚠️ Student Confirmation Email Pending Approval
                            </div>
                            <div style={{ fontSize: 12.5, color: "#b45309", marginTop: 2 }}>
                              The payment confirmation and welcome email has not been dispatched to <strong>{p.name}</strong> ({p.email}) yet. Click Approve to dispatch it.
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onApproveEmail(p._id); }}
                            disabled={approvingId === p._id}
                            style={{
                              background: "#16a34a",
                              color: "#fff",
                              border: "none",
                              padding: "7px 16px",
                              borderRadius: 8,
                              fontSize: 12.5,
                              fontWeight: 700,
                              cursor: approvingId === p._id ? "not-allowed" : "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              boxShadow: "0 2px 10px rgba(22,163,74,0.3)",
                            }}
                          >
                            <Send size={13} />
                            {approvingId === p._id ? "Sending Email…" : "Approve & Send Email Now"}
                          </button>
                        </div>
                      )}
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