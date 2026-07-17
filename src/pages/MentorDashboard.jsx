import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, LogOut, Lock, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import Seo from "../components/Seo.jsx";
import StudentReport from "../components/mentor/StudentReport.jsx";
import MentorHero from "../components/mentor/MentorHero.jsx";
import {
  apiMentorLogin, apiMentorMe, apiMentorSetPassword, apiMentorStudents,
  apiMentorStudentProgress, apiMentorStudentTests, apiMentorStudentTasks,
} from "../auth/api.js";

const ACCENT = "#FF693D";
const SORA = "Sora, system-ui, sans-serif";

// Mentor tokens are a different audience to student tokens and the server
// refuses them on student routes — so they get their own storage key rather
// than sharing the student session.
const TOKEN_KEY = "cp:mentorToken";

const readToken = () => { try { return localStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; } };
const writeToken = (t) => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* private mode */ } };

/* ── Shared shell for the signed-out screens ─── */
function AuthShell({ title, sub, children }) {
  return (
    // 120px of headroom clears the fixed site header, matching the student dashboard.
    <div style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "120px 20px 60px" }}>
      <motion.div
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="card"
        style={{ width: "100%", maxWidth: 420, borderTop: `3px solid ${ACCENT}` }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: `${ACCENT}18`, color: ACCENT, display: "grid", placeItems: "center" }}>
            <ShieldCheck size={18} />
          </span>
          <h1 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 19, color: "var(--navy)", margin: 0 }}>{title}</h1>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 18px", lineHeight: 1.55 }}>{sub}</p>
        {children}
      </motion.div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 9, fontSize: 13.5,
  border: "1px solid var(--line)", background: "#fff", color: "var(--navy)", outline: "none",
};

function Field({ label, ...props }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--navy)", marginBottom: 5 }}>{label}</span>
      <input {...props} style={inputStyle} />
    </label>
  );
}

function ErrorNote({ children }) {
  if (!children) return null;
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 12,
      background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 9,
      padding: "9px 11px", fontSize: 12, color: "#b91c1c", lineHeight: 1.5,
    }}>
      <AlertCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} /> {children}
    </div>
  );
}

function SubmitButton({ busy, children }) {
  return (
    <button
      type="submit" disabled={busy}
      style={{
        width: "100%", padding: "11px 14px", borderRadius: 9, border: "none",
        background: busy ? `${ACCENT}99` : ACCENT, color: "#fff",
        fontFamily: SORA, fontWeight: 700, fontSize: 13.5,
        cursor: busy ? "wait" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
      }}
    >
      {busy && <Loader2 size={14} className="cp-spin" />} {children}
    </button>
  );
}

/* ── Login ──────────────────────────────────── */
function Login({ onDone }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const { token, mentor } = await apiMentorLogin({ email, password });
      writeToken(token);
      onDone(token, mentor);
    } catch (e2) {
      setErr(e2.message || "Could not sign in");
    } finally { setBusy(false); }
  };

  return (
    <AuthShell
      title="Mentor sign in"
      sub="Use the email and password your admin gave you. This area is for mentors — students sign in from the mentorship dashboard."
    >
      <form onSubmit={submit}>
        <ErrorNote>{err}</ErrorNote>
        <Field label="Email" type="email" value={email} autoComplete="username"
          onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
        <Field label="Password" type="password" value={password} autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
        <SubmitButton busy={busy}>Sign in</SubmitButton>
      </form>
    </AuthShell>
  );
}

/* ── Forced password change ─────────────────── */
function SetPassword({ token, onDone }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (next !== confirm) return setErr("The two new passwords don't match.");
    if (next.length < 8) return setErr("Use at least 8 characters.");
    setErr(""); setBusy(true);
    try {
      // The server retires every token issued against the old password,
      // including the one we're holding — so adopt the fresh one it returns.
      const r = await apiMentorSetPassword(token, { currentPassword: current, newPassword: next });
      writeToken(r.token);
      onDone(r.token, r.mentor);
    } catch (e2) {
      setErr(e2.message || "Could not update password");
    } finally { setBusy(false); }
  };

  return (
    <AuthShell
      title="Choose your own password"
      sub="Your admin set a temporary password. Replace it before you can view any student data — nobody else should know the password you actually use."
    >
      <form onSubmit={submit}>
        <ErrorNote>{err}</ErrorNote>
        <Field label="Temporary password" type="password" value={current} autoComplete="current-password"
          onChange={(e) => setCurrent(e.target.value)} required />
        <Field label="New password" type="password" value={next} autoComplete="new-password"
          onChange={(e) => setNext(e.target.value)} required placeholder="at least 8 characters" />
        <Field label="Confirm new password" type="password" value={confirm} autoComplete="new-password"
          onChange={(e) => setConfirm(e.target.value)} required />
        <SubmitButton busy={busy}>Save and continue</SubmitButton>
      </form>
    </AuthShell>
  );
}

/* ── Page ───────────────────────────────────── */
export default function MentorDashboard() {
  const [token, setToken] = useState(readToken);
  const [mentor, setMentor] = useState(null);
  const [booting, setBooting] = useState(!!readToken());

  const [students, setStudents] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [report, setReport] = useState({ progress: null, tests: [], tasks: [], updatedAt: null });
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [err, setErr] = useState("");

  const signOut = useCallback(() => {
    writeToken(""); setToken(""); setMentor(null);
    setStudents([]); setActiveId(""); setReport({ progress: null, tests: [], tasks: [], updatedAt: null });
  }, []);

  // Resume a stored session. A revoked mentor or a rotated tokenVersion is
  // rejected here, so a stale token can't linger as a working session.
  useEffect(() => {
    if (!token) { setBooting(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const { mentor: m } = await apiMentorMe(token);
        if (!cancelled) setMentor(m);
      } catch {
        if (!cancelled) signOut();
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token, signOut]);

  // Assigned students, once the password is no longer provisional.
  useEffect(() => {
    if (!token || !mentor || mentor.mustChangePassword) return;
    let cancelled = false;
    (async () => {
      try {
        const { students: list } = await apiMentorStudents(token);
        if (cancelled) return;
        setStudents(list);
        setActiveId((cur) => cur || list[0]?.studentId || "");
      } catch (e) {
        if (!cancelled) setErr(e.message || "Could not load your students");
      }
    })();
    return () => { cancelled = true; };
  }, [token, mentor]);

  // One student's data. Requests are tagged so a fast switch can't let a slow
  // earlier response overwrite the student now on screen.
  useEffect(() => {
    if (!token || !activeId) return;
    let cancelled = false;
    setLoadingStudent(true); setErr("");
    (async () => {
      try {
        const [p, t, k] = await Promise.all([
          apiMentorStudentProgress(token, activeId),
          apiMentorStudentTests(token, activeId).catch(() => ({ attempts: [] })),
          apiMentorStudentTasks(token, activeId).catch(() => ({ tasks: [] })),
        ]);
        if (cancelled) return;
        setReport({ progress: p.data, tests: t.attempts || [], tasks: k.tasks || [], updatedAt: p.updatedAt });
      } catch (e) {
        if (!cancelled) setErr(e.message || "Could not load this student");
      } finally {
        if (!cancelled) setLoadingStudent(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token, activeId]);

  if (booting) {
    return (
      <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", color: "var(--muted)" }}>
        <Loader2 size={26} className="cp-spin" color={ACCENT} />
      </div>
    );
  }

  if (!token || !mentor) {
    return (
      <>
        <Seo title="Mentor sign in · College Parichay" robots="noindex, nofollow" />
        <Login onDone={(t, m) => { setToken(t); setMentor(m); }} />
      </>
    );
  }

  if (mentor.mustChangePassword) {
    return (
      <>
        <Seo title="Set your password · College Parichay" robots="noindex, nofollow" />
        <SetPassword token={token} onDone={(t, m) => { setToken(t); setMentor(m); }} />
      </>
    );
  }

  return (
    <>
      <Seo title="Mentor dashboard · College Parichay" robots="noindex, nofollow" />
      <div className="container" style={{ padding: "120px 0 60px" }}>
        <MentorHero mentor={mentor} students={students} activeId={activeId} onPick={setActiveId} />

        {err && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
            background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10,
            padding: "11px 13px", fontSize: 12.5, color: "#b91c1c",
          }}>
            <AlertCircle size={14} style={{ flexShrink: 0 }} /> {err}
          </div>
        )}

        {students.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "46px 20px" }}>
            <Users size={30} color={ACCENT} style={{ opacity: 0.7 }} />
            <h3 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 16, color: "var(--navy)", margin: "12px 0 5px" }}>
              No students assigned yet
            </h3>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>
              Your admin assigns students to you by their CP ID. Once that's done, they'll appear here.
            </p>
          </div>
        ) : loadingStudent ? (
          <div className="card" style={{ minHeight: 340, display: "grid", placeItems: "center" }}>
            <Loader2 size={22} className="cp-spin" color={ACCENT} />
          </div>
        ) : (
          <StudentReport progress={report.progress} tests={report.tests} tasks={report.tasks}
            updatedAt={report.updatedAt} />
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
          <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--muted)", margin: 0 }}>
            <Lock size={12} color={ACCENT} />
            You can view your assigned students' data but never change it. They keep full control of their own dashboard.
          </p>
          <button
            onClick={signOut}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9,
              border: "1px solid var(--line)", background: "#fff", cursor: "pointer",
              fontSize: 12.5, fontWeight: 600, color: "var(--navy)",
            }}
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </div>

      <style>{`
        .cp-spin { animation: cp-spin 0.9s linear infinite; }
        @keyframes cp-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { .cp-spin { animation-duration: 2.4s; } }
      `}</style>
    </>
  );
}
