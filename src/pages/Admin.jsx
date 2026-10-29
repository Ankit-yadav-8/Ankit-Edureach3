import { useState, useEffect, useCallback, Fragment, useMemo } from "react";
import {
  Users, Download, RefreshCw, ShieldCheck, LogOut, KeyRound, Mail, Phone, Calendar, Clock,
  ChevronRight, ChevronDown, CreditCard, IndianRupee, CheckCircle2, MessagesSquare, FileText,
  GraduationCap, Tag, Send, Eye, EyeOff, Lock, AlertTriangle, ArrowRight, ShieldAlert,
  LayoutDashboard, LineChart, Menu, X, Search, Sparkles, Building2, UserCheck, Layers, ExternalLink, Bell, Settings, FileSpreadsheet, HelpCircle,
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
  const [dateRange, setDateRange] = useState("30d");
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [activeAdminModal, setActiveAdminModal] = useState(null); // "settings" | "reports" | "support"
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [payTotal, setPayTotal] = useState(0);
  const [payLoaded, setPayLoaded] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = "Admin · Campus Point";
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("admin-global-search-input");
        if (searchInput) searchInput.focus();
        setSearchFocus(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.title = prev;
      window.removeEventListener("keydown", onKey);
    };
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
      const list = Array.isArray(data.enrollments) ? data.enrollments : [];
      setPayments(list);
      setPayTotal(data.total ?? list.length);
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

  const handleUpdateAmount = useCallback((id, newAmount) => {
    setPayments((prev) =>
      prev.map((p) => (p._id === id ? { ...p, amount: Number(newAmount) || p.amount } : p))
    );
  }, []);

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
  const filteredPayments = (payments || []).filter((p) => p &&
    !q ||
    fuzzyMatch(p.name, q) ||
    fuzzyMatch(p.email, q) ||
    fuzzyMatch(p.phone, q) ||
    fuzzyMatch(p.planLabel, q) ||
    fuzzyMatch(p.plan, q)
  );
  const revenue = (payments || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

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
            <p style={{ color: "#64748b", fontSize: 12, marginTop: 6, marginBottom: 0, lineHeight: 1.4 }}>
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
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{primaryAdminEmail}</div>
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
                    borderRadius: 14, border: "1.5px solid #e2e8f0", fontSize: 21,
                    letterSpacing: 10, fontWeight: 800, outline: "none", boxSizing: "border-box",
                    fontFamily: "monospace", transition: "all .2s ease",
                    background: "#ffffff", color: "#0f172a",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              {devCode && (
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "8px 12px", marginBottom: 14, color: "#92400e", fontSize: 12, textAlign: "center" }}>
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
                  style={{ background: "none", border: "none", color: "#64748b", fontSize: 12, cursor: "pointer", fontWeight: 600 }}
                >
                  ← Back to Key
                </button>
                <button
                  type="button"
                  onClick={() => requestOtp(adminKey)}
                  disabled={busy}
                  style={{ background: "none", border: "none", color: ORANGE, fontSize: 12, cursor: "pointer", fontWeight: 700 }}
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
              fontSize: 12,
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

  const NAV_ITEMS = [
    { k: "overview", label: "Overview", icon: LayoutDashboard },
    { k: "mentor-tracking", label: "Mentor Tracking", icon: LineChart, badge: "New" },
    { k: "users", label: "Students", icon: Users, count: total },
    { k: "mentors", label: "Mentors", icon: GraduationCap },
    { k: "payments", label: "Payments", icon: CreditCard, count: payTotal },
    { k: "tests", label: "Mock Tests", icon: FileText },
    { k: "community", label: "Community", icon: MessagesSquare },
    { k: "coupons", label: "Coupons", icon: Tag },
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
    <div
      className="adm-suite-root"
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#f8fafc",
        position: "relative",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
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
          font-size: 12px;
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
        
        /* ── Sticky Sidebar on Desktop ── */
        .adm-sidebar {
          position: sticky !important;
          top: 0 !important;
          height: 100vh !important;
          align-self: flex-start !important;
          flex-shrink: 0 !important;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .adm-sidebar::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }

        /* ── Invisible Scrollbar: Only scroll effect is present ── */
        .adm-main-scroll {
          overflow-y: auto !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .adm-main-scroll::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        .adm-sidebar {
          position: sticky !important;
          top: 0 !important;
          height: 100vh !important;
          align-self: flex-start !important;
          flex-shrink: 0 !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .adm-sidebar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
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
        className={`adm-sidebar cp-custom-scroll ${sidebarOpen ? "open" : ""}`}
        style={{
          width: 250,
          background: "#ffffff",
          borderRight: "1px solid #f1f5f9",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexShrink: 0,
          height: "100vh",
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          zIndex: 50,
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        {/* Top Logo / Brand */}
        <div style={{
          padding: "20px 18px 18px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${ORANGE}, #e0421f)`,
              display: "grid",
              placeItems: "center",
              color: "#ffffff",
              fontWeight: 900,
              fontFamily: "Sora, sans-serif",
              fontSize: 15,
              boxShadow: "0 3px 10px rgba(255,105,61,0.25)",
            }}>
              CP
            </div>
            <div>
              <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, color: "#0f172a", fontSize: 14.5, letterSpacing: -0.3, lineHeight: 1.2 }}>
                Campus Point
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", marginTop: 2 }}>
                Your College. Our Priority.
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

        {/* Navigation Items */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }} className="cp-custom-scroll">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.k;
            return (
              <button
                key={item.k}
                onClick={() => switchTab(item.k)}
                className={`adm-nav-btn ${active ? "active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "none",
                  background: active ? "#fff7ed" : "transparent",
                  color: active ? "#ea580c" : "#64748b",
                  fontFamily: "inherit",
                  fontSize: 12,
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: "left",
                  boxSizing: "border-box",
                }}
              >
                <Icon size={17} style={{ flexShrink: 0, color: active ? ORANGE : "#64748b" }} />
                <span style={{ flex: 1 }}>{item.label}</span>

                {item.count !== undefined && (
                  <span style={{
                    background: active ? "rgba(234,88,12,0.12)" : "#f1f5f9",
                    color: active ? "#ea580c" : "#64748b",
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
                    background: active ? "#ea580c" : "#fff7ed",
                    color: active ? "#ffffff" : "#ea580c",
                    border: active ? "none" : "1px solid #fed7aa",
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

          {/* Section Divider: ADMIN */}
          <div style={{
            fontSize: 10.5,
            fontWeight: 800,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            padding: "18px 10px 6px",
          }}>
            ADMIN
          </div>

          {/* Settings */}
          <button
            onClick={() => setActiveAdminModal("settings")}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 10,
              border: "none",
              background: "transparent",
              color: "#64748b",
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s ease",
              textAlign: "left",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#0f172a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
          >
            <Settings size={17} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>Settings</span>
          </button>

          {/* Reports */}
          <button
            onClick={() => setActiveAdminModal("reports")}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 10,
              border: "none",
              background: "transparent",
              color: "#64748b",
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s ease",
              textAlign: "left",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#0f172a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
          >
            <FileSpreadsheet size={17} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>Reports</span>
          </button>

          {/* Help & Support */}
          <button
            onClick={() => setActiveAdminModal("support")}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 10,
              border: "none",
              background: "transparent",
              color: "#64748b",
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s ease",
              textAlign: "left",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#0f172a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
          >
            <HelpCircle size={17} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>Help & Support</span>
          </button>
        </div>

        {/* Bottom Profile & Actions */}
        <div style={{
          padding: "14px 14px 16px",
          borderTop: "1px solid #f1f5f9",
          background: "#ffffff",
        }}>
          <div
            onClick={() => setAdminMenuOpen(!adminMenuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 8px",
              borderRadius: 10,
              cursor: "pointer",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${ORANGE}, #e0421f)`,
                color: "#ffffff",
                display: "grid",
                placeItems: "center",
                fontSize: 11.5,
                fontWeight: 800,
                flexShrink: 0,
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
            <ChevronRight size={15} color="#94a3b8" />
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ───────────────────────────────────── */}
      <div
        className="adm-main-scroll cp-custom-scroll"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100vh",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        {/* Top Navigation Bar */}
        <header style={{
          height: 64,
          background: "#ffffff",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 40,
          flexShrink: 0,
          gap: 16,
        }}>
          {/* Left: Mobile hamburger + Global Search Input */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, maxWidth: 520 }}>
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

            {/* Global Search Bar with ⌘K Badge */}
            <div style={{
              position: "relative",
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}>
              <Search
                size={15}
                style={{
                  position: "absolute",
                  left: 12,
                  color: "#94a3b8",
                  pointerEvents: "none",
                }}
              />
              <input
                id="admin-global-search-input"
                type="text"
                placeholder="Search students, mentors, tasks…"
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setSearch(e.target.value);
                }}
                onFocus={() => setSearchFocus(true)}
                style={{
                  width: "100%",
                  height: 38,
                  paddingLeft: 34,
                  paddingRight: 48,
                  borderRadius: 10,
                  border: searchFocus ? `1.5px solid ${ORANGE}` : "1px solid #e2e8f0",
                  background: searchFocus ? "#ffffff" : "#f8fafc",
                  fontSize: 12.5,
                  color: "#0f172a",
                  outline: "none",
                  transition: "all 0.15s ease",
                  fontFamily: "inherit",
                }}
              />
              <span style={{
                position: "absolute",
                right: 10,
                fontSize: 10.5,
                fontWeight: 700,
                color: "#94a3b8",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                padding: "1px 5px",
                borderRadius: 4,
                pointerEvents: "none",
              }}>
                ⌘K
              </span>

              {/* Quick Search Popover Dropdown when typing */}
              {searchFocus && globalSearch.trim().length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: 6,
                    background: "#ffffff",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
                    padding: "8px 0",
                    zIndex: 100,
                    maxHeight: 280,
                    overflowY: "auto",
                  }}
                  className="cp-custom-scroll"
                >
                  <div style={{ padding: "6px 14px", fontSize: 10.5, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>
                    Quick Results
                  </div>
                  {users.filter(u => fuzzyMatch(u.name || u.email, globalSearch.toLowerCase())).slice(0, 3).map(u => (
                    <div
                      key={u._id}
                      onClick={() => { switchTab("users"); setSearch(u.name || ""); setSearchFocus(false); }}
                      style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12 }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <Users size={13} color="#2563eb" />
                      <span style={{ fontWeight: 600, color: "#0f172a" }}>{u.name || u.phone}</span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>({u.email || "Student"})</span>
                    </div>
                  ))}
                  {payments.filter(p => fuzzyMatch(p.name || p.email, globalSearch.toLowerCase())).slice(0, 3).map(p => (
                    <div
                      key={p._id}
                      onClick={() => { switchTab("payments"); setSearch(p.name || ""); setSearchFocus(false); }}
                      style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12 }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <CreditCard size={13} color={ORANGE} />
                      <span style={{ fontWeight: 600, color: "#0f172a" }}>{p.name || p.email}</span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>₹{p.amount} · {p.plan}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid #f1f5f9", marginTop: 4, padding: "6px 14px", display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8" }}>
                    <span>Press Esc or click outside to dismiss</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Date-range picker, Notifications, Admin Profile */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Date-Range Selector Dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                style={{
                  height: 38,
                  padding: "0 12px",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  color: "#334155",
                  fontSize: 12.5,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#cbd5e1"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <Calendar size={14} color="#64748b" />
                <span>
                  {dateRange === "today" ? "Today" : dateRange === "7d" ? "Last 7 days" : dateRange === "90d" ? "Last 90 days" : "Last 30 days"}
                </span>
                <ChevronDown size={14} color="#94a3b8" />
              </button>

              {dateDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: 6,
                    background: "#ffffff",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 25px rgba(15,23,42,0.1)",
                    padding: 6,
                    zIndex: 100,
                    minWidth: 150,
                  }}
                >
                  {[
                    { id: "today", label: "Today" },
                    { id: "7d", label: "Last 7 days" },
                    { id: "30d", label: "Last 30 days" },
                    { id: "90d", label: "Last 90 days" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setDateRange(opt.id);
                        setDateDropdownOpen(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        textAlign: "left",
                        border: "none",
                        borderRadius: 8,
                        background: dateRange === opt.id ? "#fff7ed" : "transparent",
                        color: dateRange === opt.id ? "#ea580c" : "#334155",
                        fontWeight: dateRange === opt.id ? 700 : 500,
                        fontSize: 12.5,
                        cursor: "pointer",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  color: "#475569",
                  position: "relative",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#cbd5e1"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                title="Notifications"
              >
                <Bell size={16} />
                <span style={{
                  position: "absolute",
                  top: 9,
                  right: 9,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: ORANGE,
                  boxShadow: `0 0 6px ${ORANGE}`,
                }} />
              </button>

              {notificationsOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: 6,
                    background: "#ffffff",
                    borderRadius: 14,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
                    width: 310,
                    zIndex: 100,
                    overflow: "hidden",
                  }}
                >
                  <div style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#0f172a" }}>Notifications</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", background: "#f0fdf4", padding: "2px 6px", borderRadius: 10 }}>
                      Live feed
                    </span>
                  </div>
                  <div style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ padding: "8px", borderRadius: 8, background: "#f8fafc", fontSize: 12 }}>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>New Payment Enrolled</div>
                      <div style={{ color: "#64748b", fontSize: 11 }}>Parth Yadav enrolled in JEE 2027 Mentorship</div>
                    </div>
                    <div style={{ padding: "8px", borderRadius: 8, background: "#f8fafc", fontSize: 12 }}>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>Mentor Telemetry Sync</div>
                      <div style={{ color: "#64748b", fontSize: 11 }}>Active mentors successfully synchronized</div>
                    </div>
                  </div>
                  <div style={{ padding: "8px 16px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      style={{ border: "none", background: "none", color: "#2563eb", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
                    >
                      Close Panel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Pill */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  height: 38,
                  padding: "0 10px 0 5px",
                  borderRadius: 24,
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#cbd5e1"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${ORANGE}, #e0421f)`,
                  color: "#ffffff",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 11,
                  fontWeight: 900,
                  fontFamily: "Sora, sans-serif",
                }}>
                  CP
                </div>
                <div style={{ textAlign: "left", lineHeight: 1.15 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Campus Point</div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>Admin</div>
                </div>
              </button>

              {adminMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: 6,
                    background: "#ffffff",
                    borderRadius: 14,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
                    padding: 6,
                    zIndex: 100,
                    minWidth: 190,
                  }}
                >
                  <div style={{ padding: "8px 12px", borderBottom: "1px solid #f1f5f9", marginBottom: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Super Admin</div>
                    <div style={{ fontSize: 11, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis" }}>{primaryAdminEmail}</div>
                  </div>
                  <button
                    onClick={() => { setActiveAdminModal("settings"); setAdminMenuOpen(false); }}
                    style={{ width: "100%", padding: "8px 12px", textAlign: "left", border: "none", borderRadius: 8, background: "transparent", color: "#334155", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Settings size={14} color="#64748b" /> Settings
                  </button>
                  <button
                    onClick={() => { setActiveAdminModal("reports"); setAdminMenuOpen(false); }}
                    style={{ width: "100%", padding: "8px 12px", textAlign: "left", border: "none", borderRadius: 8, background: "transparent", color: "#334155", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <FileSpreadsheet size={14} color="#64748b" /> Reports & Exports
                  </button>
                  <div style={{ borderTop: "1px solid #f1f5f9", margin: "4px 0" }} />
                  <button
                    onClick={logout}
                    style={{ width: "100%", padding: "8px 12px", textAlign: "left", border: "none", borderRadius: 8, background: "transparent", color: "#dc2626", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <LogOut size={14} color="#dc2626" /> End Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="adm-content-area" style={{ flex: 1, padding: "28px 32px 60px", maxWidth: 1400, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
          <div className="adm-fade">
            {tab === "overview" ? (
              <AdminOverview adminToken={token} dateRange={dateRange} onNavigateTab={switchTab} />
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
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: 14, marginBottom: 20 }}>
                  <div style={{ background: "#ffffff", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(15,23,42,.03)" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: `${ORANGE}15`, display: "grid", placeItems: "center" }}>
                      <Users size={20} color={ORANGE} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 22, color: "#0f172a", lineHeight: 1 }}>{total}</div>
                      <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 4, fontWeight: 500 }}>Total Student Signups</div>
                    </div>
                  </div>

                  <div style={{ background: "#ffffff", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(15,23,42,.03)" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: "#f0fdf4", display: "grid", placeItems: "center" }}>
                      <Calendar size={20} color="#16a34a" />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 22, lineHeight: 1, color: "#0f172a" }}>
                        {users.filter(u => {
                          const d = new Date(u.createdAt);
                          const now = new Date();
                          return d.toDateString() === now.toDateString();
                        }).length}
                      </div>
                      <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 4, fontWeight: 500 }}>Joined Today</div>
                    </div>
                  </div>

                  <div style={{ background: "#ffffff", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(15,23,42,.03)" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: `${ORANGE}15`, display: "grid", placeItems: "center" }}>
                      <Clock size={20} color={ORANGE} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 22, lineHeight: 1, color: "#0f172a" }}>
                        {users.filter(u => {
                          const d = new Date(u.lastLogin);
                          const now = new Date();
                          return (now - d) < 24 * 60 * 60 * 1000;
                        }).length}
                      </div>
                      <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 4, fontWeight: 500 }}>Active in Last 24h</div>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #f0e9e0", overflow: "hidden", boxShadow: "0 2px 10px rgba(15,23,42,.03)" }}>
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 800, color: "#0f172a", fontSize: 14, fontFamily: "Sora, sans-serif" }}>
                        Registered Students Directory
                      </span>
                      <span style={{ background: "#f1f5f9", borderRadius: 12, padding: "2px 8px", fontSize: 11, color: "#475569", fontWeight: 700 }}>
                        {filtered.length}
                      </span>
                    </div>
                  </div>

                  {filtered.length === 0 ? (
                    <div style={{ padding: "50px 20px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                      {search ? "No students match your search." : "No signups yet."}
                    </div>
                  ) : (
                    <div className="cp-custom-scroll" style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", minWidth: 950, borderCollapse: "collapse", fontSize: 12 }}>
                        <thead>
                          <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" }}>
                            {["#", "", "Student", "Email", "Phone", "Coaching", "Class", "Joined", "Last Login"].map((h, hi) => (
                              <th key={hi} style={{
                                padding: "10px 14px", textAlign: "left", fontSize: 10.5,
                                fontWeight: 800, color: "#64748b", letterSpacing: ".05em",
                                textTransform: "uppercase", whiteSpace: "nowrap",
                              }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((u, i) => {
                            const isOpen = expanded.has(u._id);
                            return (
                              <Fragment key={u._id}>
                                <tr style={{ borderBottom: isOpen ? "none" : "1px solid #f1f5f9", transition: "background .12s", cursor: "pointer", background: isOpen ? "#f8fafc" : "transparent" }}
                                  onClick={() => toggleRow(u._id)}
                                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                                  onMouseLeave={e => e.currentTarget.style.background = isOpen ? "#f8fafc" : "transparent"}
                                >
                                  <td style={{ padding: "11px 14px", fontSize: 11, color: "#94a3b8", fontFamily: "monospace", width: 36 }}>
                                    {i + 1}
                                  </td>
                                  <td style={{ padding: "11px 6px", width: 22, color: "#94a3b8" }}>
                                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                  </td>
                                  <td style={{ padding: "11px 14px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                                      <div style={{
                                        width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                                        background: avatarColor(u.name || u.phone),
                                        color: "#fff", display: "grid", placeItems: "center",
                                        fontSize: 12, fontWeight: 800,
                                      }}>
                                        {avatar(u.name, u.phone)}
                                      </div>
                                      <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 12.5 }}>
                                        {u.name || "-"}
                                      </span>
                                    </div>
                                  </td>
                                  <td style={{ padding: "11px 14px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#475569", fontSize: 12 }}>
                                      <Mail size={12} color="#94a3b8" />
                                      {u.email || "-"}
                                    </div>
                                  </td>
                                  <td style={{ padding: "11px 14px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#475569", fontSize: 12 }}>
                                      <Phone size={12} color="#94a3b8" />
                                      {u.phone || "-"}
                                    </div>
                                  </td>
                                  <td style={{ padding: "11px 14px", fontSize: 12, color: "#475569" }}>
                                    {u.coaching || <span style={{ color: "#cbd5e1" }}>-</span>}
                                  </td>
                                  <td style={{ padding: "11px 14px", fontSize: 11.5, color: "#0f172a", fontWeight: 700 }}>
                                    <span style={{ background: "#f1f5f9", padding: "2px 7px", borderRadius: 5 }}>
                                      {u.studentClass || "-"}
                                    </span>
                                  </td>
                                  <td style={{ padding: "11px 14px", fontSize: 11.5, color: "#64748b", whiteSpace: "nowrap" }}>
                                    {fmtDate(u.createdAt)}
                                  </td>
                                  <td style={{ padding: "11px 14px" }}>
                                    <span style={{
                                      fontSize: 11, color: "#334155",
                                      background: "#f1f5f9", borderRadius: 6,
                                      padding: "3px 7px", whiteSpace: "nowrap", fontWeight: 600,
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
                {/* Payments Stat Cards - Only 4 Core Metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: 16, marginBottom: 24 }}>
                  {/* Option 1: Total Signups */}
                  <div className="adm-stat" style={{ background: "linear-gradient(135deg,#1a1d42 0%,#3c2a66 100%)", borderRadius: 16, padding: "20px 24px", color: "#fff", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 10px 30px rgba(60,42,102,.28)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${ORANGE}33`, display: "grid", placeItems: "center" }}>
                      <Users size={22} color={ORANGE} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.35rem", lineHeight: 1 }}>{payTotal}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", marginTop: 4, fontWeight: 600 }}>Total Signups</div>
                    </div>
                  </div>

                  {/* Option 2: Today Payment */}
                  <div className="adm-stat" style={{ background: "linear-gradient(135deg,#ffffff,#fbf7f2)", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, border: "1px solid #f0e9e0", boxShadow: "0 4px 18px rgba(13,27,62,.05)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f0fdf4", display: "grid", placeItems: "center" }}>
                      <Calendar size={22} color="#16a34a" />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.35rem", lineHeight: 1, color: "#0d1b3e" }}>
                        {(payments || []).filter(p => p?.createdAt && new Date(p.createdAt).toDateString() === new Date().toDateString()).length}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, fontWeight: 600 }}>Today Payment</div>
                    </div>
                  </div>

                  {/* Option 3: Total Payment */}
                  <div className="adm-stat" style={{ background: "linear-gradient(135deg,#ffffff,#fbf7f2)", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, border: "1px solid #f0e9e0", boxShadow: "0 4px 18px rgba(13,27,62,.05)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f0fdf4", display: "grid", placeItems: "center" }}>
                      <IndianRupee size={22} color="#16a34a" />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.35rem", lineHeight: 1, color: "#0d1b3e" }}>
                        ₹{revenue.toLocaleString("en-IN")}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, fontWeight: 600 }}>Total Payment</div>
                    </div>
                  </div>

                  {/* Option 4: Awaiting Email Approval */}
                  <div className="adm-stat" style={{ background: "linear-gradient(135deg,#ffffff,#fff7ed)", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, border: "1px solid #fed7aa", boxShadow: "0 4px 18px rgba(13,27,62,.05)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#ffedd5", display: "grid", placeItems: "center" }}>
                      <Mail size={22} color="#ea580c" />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.35rem", lineHeight: 1, color: "#ea580c" }}>
                        {(payments || []).filter(p => !p.confirmationEmailSent).length}
                      </div>
                      <div style={{ fontSize: 12, color: "#9a3412", marginTop: 4, fontWeight: 600 }}>Awaiting Email Approval</div>
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
                  onUpdateAmount={handleUpdateAmount}
                />
              </>
            )}
          </div>
        </main>
      </div>

      {/* ── Admin SaaS Utility Modals ── */}
      {activeAdminModal && (
        <div
          onClick={() => setActiveAdminModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 120,
            display: "grid",
            placeItems: "center",
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#ffffff",
              borderRadius: 20,
              width: "100%",
              maxWidth: 480,
              border: "1px solid #e2e8f0",
              boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#fff7ed", color: "#ea580c", display: "grid", placeItems: "center" }}>
                  {activeAdminModal === "settings" ? <Settings size={18} /> : activeAdminModal === "reports" ? <FileSpreadsheet size={18} /> : <HelpCircle size={18} />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a", fontFamily: "Sora, sans-serif" }}>
                    {activeAdminModal === "settings" ? "Platform Admin Settings" : activeAdminModal === "reports" ? "Analytics Reports & CSV Exports" : "Admin Help & Documentation"}
                  </h3>
                  <div style={{ fontSize: 11.5, color: "#64748b" }}>Campus Point SaaS Administration</div>
                </div>
              </div>
              <button
                onClick={() => setActiveAdminModal(null)}
                style={{ border: "none", background: "none", color: "#94a3b8", cursor: "pointer", padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "20px 24px" }}>
              {activeAdminModal === "settings" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ padding: "12px 14px", borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 12 }}>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>Authentication Security</div>
                    <div style={{ color: "#64748b", marginTop: 2 }}>2FA One-Time Password verification is enforced for all admin sessions.</div>
                  </div>
                  <div style={{ padding: "12px 14px", borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 12 }}>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>API Gateway</div>
                    <div style={{ color: "#64748b", marginTop: 2 }}>Connected to: <code style={{ color: ORANGE }}>{API_BASE || "production API"}</code></div>
                  </div>
                  <div style={{ padding: "12px 14px", borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 12 }}>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>Live Sync Status</div>
                    <div style={{ color: "#16a34a", fontWeight: 600, marginTop: 2 }}>● Active & Connected</div>
                  </div>
                </div>
              ) : activeAdminModal === "reports" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontSize: 12.5, color: "#64748b" }}>Export live platform database records as structured CSV files:</div>
                  <button
                    onClick={() => { downloadCsv(); setActiveAdminModal(null); }}
                    style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#ffffff", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12, color: "#0f172a" }}>Student Directory (.csv)</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>Export all {total} registered student accounts</div>
                    </div>
                    <Download size={16} color={ORANGE} />
                  </button>
                  <button
                    onClick={() => { downloadPaymentsCsv(); setActiveAdminModal(null); }}
                    style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#ffffff", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12, color: "#0f172a" }}>Enrollments & Payments (.csv)</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>Export all {payTotal} verified transaction records</div>
                    </div>
                    <Download size={16} color={ORANGE} />
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.6 }}>
                  <p>Welcome to the <strong>Campus Point Admin Suite</strong>. Here you can monitor live mentor analytics, track student tasks, manage mock tests, moderate the community, and oversee verified payments.</p>
                  <p style={{ marginTop: 10 }}>For emergency access support or backend database questions, reach out to the engineering team at <code>admin@campuspoint.in</code>.</p>
                </div>
              )}
            </div>

            <div style={{ padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setActiveAdminModal(null)}
                style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#ffffff", color: "#334155", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Payments tab: successful enrolments only ─────────────────────── */
function PaymentsTable({ payments, search, setSearch, expanded, toggleRow, onApproveEmail, approvingId, onUpdateAmount }) {
  const totalAmount = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const approvedCount = payments.filter((p) => p.confirmationEmailSent).length;
  const pendingCount = payments.length - approvedCount;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      

      <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #f0e9e0", overflow: "hidden", boxShadow: "0 2px 10px rgba(15,23,42,0.03)" }}>
        {/* Search bar */}
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 800, color: "#0f172a", fontSize: 14, fontFamily: "Sora, sans-serif" }}>
              Successful Enrollments & Payments
            </span>
            <span style={{ background: "#f1f5f9", borderRadius: 12, padding: "2px 8px", fontSize: 11, color: "#475569", fontWeight: 700 }}>
              {payments.length}
            </span>
          </div>
          <input
            placeholder="Search student, email, phone or plan…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ height: 34, padding: "0 12px", borderRadius: 8, border: "1.5px solid #cbd5e1", fontSize: 12, outline: "none", minWidth: 240, fontFamily: "inherit" }}
          />
        </div>

        {payments.length === 0 ? (
          <div style={{ padding: "50px 20px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
            {search ? "No payments match your search." : "No successful payments recorded yet."}
          </div>
        ) : (
          <div className="cp-custom-scroll" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 980, borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" }}>
                  {["#", "", "Customer", "Email", "Phone", "Plan", "Amount", "Email Approval", "Status", "Paid On"].map((h, hi) => (
                    <th key={hi} style={{
                      padding: "10px 14px", textAlign: "left", fontSize: 10.5,
                      fontWeight: 800, color: "#64748b", letterSpacing: ".05em",
                      textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => {
                  const isOpen = expanded.has(p._id);
                  return (
                    <Fragment key={p._id}>
                      <tr
                        style={{ borderBottom: isOpen ? "none" : "1px solid #f1f5f9", transition: "background .12s", cursor: "pointer", background: isOpen ? "#f8fafc" : "transparent" }}
                        onClick={() => toggleRow(p._id)}
                        onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                        onMouseLeave={e => e.currentTarget.style.background = isOpen ? "#f8fafc" : "transparent"}
                      >
                        <td style={{ padding: "11px 14px", fontSize: 11, color: "#94a3b8", fontFamily: "monospace", width: 36 }}>{i + 1}</td>
                        <td style={{ padding: "11px 6px", width: 22, color: "#94a3b8" }}>
                          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </td>
                        <td style={{ padding: "11px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                            <div style={{
                              width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                              background: avatarColor(p.name || p.phone),
                              color: "#fff", display: "grid", placeItems: "center",
                              fontSize: 12, fontWeight: 800,
                            }}>
                              {avatar(p.name, p.phone)}
                            </div>
                            <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 12.5 }}>{p.name || "-"}</span>
                          </div>
                        </td>
                        <td style={{ padding: "11px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#475569", fontSize: 12 }}>
                            <Mail size={12} color="#94a3b8" />{p.email || "-"}
                          </div>
                        </td>
                        <td style={{ padding: "11px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#475569", fontSize: 12 }}>
                            <Phone size={12} color="#94a3b8" />{p.phone || "-"}
                          </div>
                        </td>
                        <td style={{ padding: "11px 14px", fontSize: 11.5, color: "#475569" }}>{p.planLabel || p.plan || "-"}</td>
                        <td style={{ padding: "9px 12px", fontSize: 11.5, color: "#0f172a", fontWeight: 700, whiteSpace: "nowrap" }}>
                          ₹{Number(p.amount || 0).toLocaleString("en-IN")}
                        </td>
                        <td style={{ padding: "11px 14px" }} onClick={(e) => e.stopPropagation()}>
                          {p.confirmationEmailSent ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "#15803d", background: "#dcfce7", borderRadius: 6, padding: "3px 8px", whiteSpace: "nowrap" }}>
                              <CheckCircle2 size={12} /> Approved
                            </span>
                          ) : (
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10.5, fontWeight: 700, color: "#b45309", background: "#fef3c7", borderRadius: 6, padding: "2px 7px", whiteSpace: "nowrap" }}>
                                <Clock size={10} /> Pending
                              </span>
                              <button
                                type="button"
                                onClick={() => onApproveEmail(p._id)}
                                disabled={approvingId === p._id}
                                style={{
                                  background: "linear-gradient(135deg, #FF693D 0%, #ea580c 100%)",
                                  color: "#fff",
                                  border: "none",
                                  padding: "3px 9px",
                                  borderRadius: 6,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  cursor: approvingId === p._id ? "not-allowed" : "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <Send size={10} />
                                {approvingId === p._id ? "Sending…" : "Approve"}
                              </button>
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "11px 14px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "#15803d", background: "#dcfce7", borderRadius: 6, padding: "3px 8px", whiteSpace: "nowrap" }}>
                            <CheckCircle2 size={12} /> Paid
                          </span>
                        </td>
                        <td style={{ padding: "11px 14px", fontSize: 11.5, color: "#64748b", whiteSpace: "nowrap" }}>{fmtDate(p.createdAt)}</td>
                      </tr>
                      {isOpen && (
                        <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                          <td colSpan={10} style={{ padding: "0 18px 16px 48px" }}>
                            {!p.confirmationEmailSent && (
                              <div style={{ background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: 10, padding: "10px 14px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                                <div>
                                  <div style={{ fontSize: 12.5, fontWeight: 800, color: "#9a3412" }}>
                                    Student Confirmation Email Pending Approval
                                  </div>
                                  <div style={{ fontSize: 11.5, color: "#b45309", marginTop: 2 }}>
                                    Dispatch confirmation and welcome mail to <strong>{p.name}</strong> ({p.email}).
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
                                    padding: "6px 14px",
                                    borderRadius: 7,
                                    fontSize: 11.5,
                                    fontWeight: 700,
                                    cursor: approvingId === p._id ? "not-allowed" : "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 5,
                                  }}
                                >
                                  <Send size={12} />
                                  {approvingId === p._id ? "Sending…" : "Approve Now"}
                                </button>
                              </div>
                            )}
                            <div style={{ fontSize: 10.5, fontWeight: 800, color: "#64748b", letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 6 }}>
                              Enrollment Data Document
                            </div>
                            <pre style={{
                              margin: 0, padding: "10px 14px", background: "#0f172a", color: "#f8fafc",
                              borderRadius: 8, fontSize: 11.5, lineHeight: 1.5, overflowX: "auto",
                              fontFamily: "ui-monospace, monospace",
                            }}>
                              {JSON.stringify(p, null, 2)}
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
    </div>
  );
}