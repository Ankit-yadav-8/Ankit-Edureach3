import { useState, useEffect, useCallback } from "react";
import {
  Plus, Trash2, UserPlus, KeyRound, Copy, Check, Loader2, ShieldOff,
  ShieldCheck, GraduationCap, AlertTriangle, X,
} from "lucide-react";
import {
  apiAdminMentorList, apiAdminMentorCreate, apiAdminMentorUpdate,
  apiAdminMentorAssign, apiAdminMentorUnassign, apiAdminMentorResetPassword,
} from "../../auth/api.js";

const ORANGE = "#FF693D";
const GREEN = "#15a06e";
const RED = "#dc2626";

// Admin tool: create mentor accounts and assign them students by CP ID.
//
// Mentors never self-register — the admin creates the account, hands over the
// one-time password out of band, and the mentor is forced to replace it on
// first sign-in. Assignment is what grants read access, so it only accepts a
// CP ID backed by a real paid enrolment.

const inputStyle = {
  height: 44, padding: "0 14px", borderRadius: 10, border: "1.5px solid #e5e7eb",
  fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", width: "100%",
};

function Note({ type, children, onClose }) {
  if (!children) return null;
  const c = type === "ok"
    ? { bg: "#f0fdf4", bd: "#86efac", fg: "#166534" }
    : type === "warn"
      ? { bg: "#fffbeb", bd: "#fcd34d", fg: "#92400e" }
      : { bg: "#fff1f2", bd: "#fca5a5", fg: "#991b1b" };
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 14,
      borderRadius: 10, padding: "10px 13px", fontSize: 13, lineHeight: 1.55,
      background: c.bg, border: `1.5px solid ${c.bd}`, color: c.fg,
    }}>
      <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>{children}</div>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss"
          style={{ border: "none", background: "transparent", cursor: "pointer", color: c.fg, padding: 0 }}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}

/* The one-time password. It is never stored in readable form and cannot be
   fetched again — if the admin loses it the only path is a reset. */
function PasswordHandoff({ mentor, password, onDone }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked — the password is on screen to copy by hand */ }
  };
  return (
    <div style={{
      background: "#fffbeb", border: `1.5px solid #fcd34d`, borderRadius: 12,
      padding: "14px 16px", marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
        <KeyRound size={15} color="#92400e" />
        <strong style={{ fontFamily: "Sora", fontSize: 13.5, color: "#92400e" }}>
          One-time password for {mentor}
        </strong>
      </div>
      <p style={{ fontSize: 12.5, color: "#92400e", margin: "0 0 10px", lineHeight: 1.55 }}>
        Copy this now and send it to the mentor over a channel you trust. It can't be shown
        again — if it's lost, use “Reset password”. They must change it on first sign-in.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <code style={{
          flex: 1, background: "#fff", border: "1px solid #fcd34d", borderRadius: 8,
          padding: "9px 12px", fontSize: 14, fontFamily: "ui-monospace, monospace",
          color: "#111", letterSpacing: ".04em", userSelect: "all",
        }}>{password}</code>
        <button onClick={copy} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "0 14px", borderRadius: 8,
          border: "none", background: copied ? GREEN : "#92400e", color: "#fff",
          fontWeight: 700, fontSize: 12.5, cursor: "pointer",
        }}>
          {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={onDone} style={{
          padding: "0 14px", borderRadius: 8, border: "1.5px solid #fcd34d",
          background: "#fff", color: "#92400e", fontWeight: 700, fontSize: 12.5, cursor: "pointer",
        }}>
          Done
        </button>
      </div>
    </div>
  );
}

/* ── Create form ────────────────────────────── */
function CreateMentor({ token, onCreated }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "", college: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const r = await apiAdminMentorCreate(token, f);
      setF({ name: "", email: "", phone: "", college: "" });
      setOpen(false);
      onCreated(r.mentor, r.password);
    } catch (e2) {
      setErr(e2.message || "Could not create mentor");
    } finally { setBusy(false); }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        display: "flex", alignItems: "center", gap: 7, padding: "10px 16px", borderRadius: 10,
        border: "none", background: `linear-gradient(135deg,${ORANGE},#E0421F)`, color: "#fff",
        fontFamily: "Sora", fontWeight: 700, fontSize: 13.5, cursor: "pointer",
        boxShadow: "0 6px 16px rgba(255,105,61,.3)",
      }}>
        <UserPlus size={15} /> New mentor
      </button>
    );
  }

  return (
    <form onSubmit={submit} style={{
      background: "#fff", border: "1px solid #f0e9e0", borderRadius: 14,
      padding: 16, marginBottom: 18, boxShadow: "0 8px 24px rgba(13,27,62,.06)",
    }}>
      <Note type="err">{err}</Note>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <input style={inputStyle} placeholder="Full name *" value={f.name} onChange={set("name")} required />
        <input style={inputStyle} placeholder="Email *" type="email" value={f.email} onChange={set("email")} required />
        <input style={inputStyle} placeholder="College" value={f.college} onChange={set("college")} />
        <input style={inputStyle} placeholder="Contact number" value={f.phone} onChange={set("phone")} />
      </div>
      <p style={{ fontSize: 12, color: "#7c7368", margin: "0 0 12px", lineHeight: 1.5 }}>
        A one-time password is generated on save — you'll see it once, then hand it to the mentor.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={busy} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 9,
          border: "none", background: busy ? `${ORANGE}99` : ORANGE, color: "#fff",
          fontFamily: "Sora", fontWeight: 700, fontSize: 13, cursor: busy ? "wait" : "pointer",
        }}>
          {busy ? <Loader2 size={13} className="adm-spin" /> : <Plus size={13} />} Create mentor
        </button>
        <button type="button" onClick={() => { setOpen(false); setErr(""); }} style={{
          padding: "10px 18px", borderRadius: 9, border: "1.5px solid #e5e7eb",
          background: "#fff", color: "#7c7368", fontWeight: 700, fontSize: 13, cursor: "pointer",
        }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ── One mentor row ─────────────────────────── */
function MentorRow({ token, mentor, onChange, onPassword }) {
  const [sid, setSid] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const assign = async (e) => {
    e.preventDefault();
    const id = sid.trim().toUpperCase();
    if (!id) return;
    setErr(""); setBusy(true);
    try {
      const r = await apiAdminMentorAssign(token, mentor.id, id);
      setSid("");
      onChange(r.mentor);
    } catch (e2) {
      setErr(e2.message || "Could not assign");
    } finally { setBusy(false); }
  };

  const unassign = async (id) => {
    setErr(""); setBusy(true);
    try {
      const r = await apiAdminMentorUnassign(token, mentor.id, id);
      onChange(r.mentor);
    } catch (e2) { setErr(e2.message || "Could not unassign"); }
    finally { setBusy(false); }
  };

  const toggleActive = async () => {
    setErr(""); setBusy(true);
    try {
      const r = await apiAdminMentorUpdate(token, mentor.id, { active: !mentor.active });
      onChange(r.mentor);
    } catch (e2) { setErr(e2.message || "Could not update"); }
    finally { setBusy(false); }
  };

  const resetPw = async () => {
    setErr(""); setBusy(true);
    try {
      const r = await apiAdminMentorResetPassword(token, mentor.id);
      onPassword(mentor.name, r.password);
      onChange({ ...mentor, mustChangePassword: true });
    } catch (e2) { setErr(e2.message || "Could not reset password"); }
    finally { setBusy(false); }
  };

  return (
    <div style={{
      background: "#fff", border: "1px solid #f0e9e0", borderRadius: 14, padding: 16,
      opacity: mentor.active ? 1 : 0.62,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <span style={{
          width: 38, height: 38, borderRadius: 11, flexShrink: 0, display: "grid", placeItems: "center",
          background: `${ORANGE}18`, color: ORANGE,
        }}>
          <GraduationCap size={19} />
        </span>

        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <strong style={{ fontFamily: "Sora", fontSize: 14.5, color: "#0d1b3e" }}>{mentor.name}</strong>
            {!mentor.active && (
              <span style={{ fontSize: 10, fontWeight: 800, color: RED, background: "#fff1f2", border: "1px solid #fca5a5", borderRadius: 50, padding: "2px 8px" }}>
                DEACTIVATED
              </span>
            )}
            {mentor.mustChangePassword && mentor.active && (
              <span style={{ fontSize: 10, fontWeight: 800, color: "#92400e", background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 50, padding: "2px 8px" }}>
                AWAITING FIRST SIGN-IN
              </span>
            )}
          </div>
          <div style={{ fontSize: 12.5, color: "#7c7368", marginTop: 2 }}>
            {mentor.email}{mentor.college ? ` · ${mentor.college}` : ""}{mentor.phone ? ` · ${mentor.phone}` : ""}
          </div>
        </div>

        <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
          <button onClick={resetPw} disabled={busy} title="Issue a new one-time password"
            style={{
              display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 8,
              border: "1.5px solid #e5e7eb", background: "#fff", color: "#7c7368",
              fontSize: 12, fontWeight: 700, cursor: busy ? "wait" : "pointer",
            }}>
            <KeyRound size={12} /> Reset password
          </button>
          <button onClick={toggleActive} disabled={busy}
            title={mentor.active ? "Revoke access immediately" : "Restore access"}
            style={{
              display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 8,
              border: `1.5px solid ${mentor.active ? "#fca5a5" : "#86efac"}`,
              background: "#fff", color: mentor.active ? RED : GREEN,
              fontSize: 12, fontWeight: 700, cursor: busy ? "wait" : "pointer",
            }}>
            {mentor.active ? <><ShieldOff size={12} /> Deactivate</> : <><ShieldCheck size={12} /> Reactivate</>}
          </button>
        </div>
      </div>

      <Note type="err" onClose={() => setErr("")}>{err}</Note>

      {/* assigned students */}
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px dashed #f0e9e0" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#9a9189", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>
          Assigned students ({mentor.students.length})
        </div>

        {mentor.students.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
            {mentor.students.map((s) => (
              <span key={s} style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 8px 5px 11px",
                borderRadius: 50, background: `${ORANGE}0f`, border: `1px solid ${ORANGE}33`,
                fontSize: 12, fontWeight: 700, color: "#0d1b3e", fontFamily: "ui-monospace, monospace",
              }}>
                {s}
                <button onClick={() => unassign(s)} disabled={busy} aria-label={`Unassign ${s}`}
                  style={{
                    border: "none", background: "transparent", cursor: "pointer", color: ORANGE,
                    display: "grid", placeItems: "center", padding: 2,
                  }}>
                  <Trash2 size={11} />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 12.5, color: "#9a9189", margin: "0 0 10px" }}>
            None yet — this mentor sees nothing until a student is assigned.
          </p>
        )}

        <form onSubmit={assign} style={{ display: "flex", gap: 7 }}>
          <input
            value={sid} onChange={(e) => setSid(e.target.value)}
            placeholder="CP-2026-00042"
            style={{ ...inputStyle, height: 38, width: 200, fontFamily: "ui-monospace, monospace", fontSize: 13 }}
          />
          <button type="submit" disabled={busy || !sid.trim()} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "0 14px", borderRadius: 9,
            border: "none", background: sid.trim() ? ORANGE : "#e5e7eb",
            color: sid.trim() ? "#fff" : "#9a9189",
            fontWeight: 700, fontSize: 12.5, cursor: sid.trim() ? "pointer" : "not-allowed",
          }}>
            {busy ? <Loader2 size={12} className="adm-spin" /> : <Plus size={12} />} Assign
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Tab ────────────────────────────────────── */
export default function Mentors({ token }) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [handoff, setHandoff] = useState(null); // { mentor, password }

  const load = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      const d = await apiAdminMentorList(token);
      setMentors(d.mentors || []);
    } catch (e) {
      setErr(e.message || "Could not load mentors");
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const upsert = (m) => setMentors((prev) => prev.map((x) => (x.id === m.id ? { ...x, ...m } : x)));

  return (
    <div className="adm-card" style={{
      background: "var(--page-bg)", borderRadius: 20, border: "1px solid #f0e9e0",
      padding: 20, boxShadow: "0 8px 30px rgba(13,27,62,.06)",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17, color: "#0d1b3e", margin: 0 }}>
            Mentors
          </h3>
          <p style={{ fontSize: 12.5, color: "#7c7368", margin: "3px 0 0", lineHeight: 1.55 }}>
            Create a mentor, then assign students by CP ID. Mentors can view their assigned
            students' dashboards but can never edit them.
          </p>
        </div>
        <CreateMentor token={token} onCreated={(m, password) => {
          setMentors((p) => [m, ...p]);
          setHandoff({ mentor: m.name, password });
        }} />
      </div>

      {handoff && (
        <PasswordHandoff mentor={handoff.mentor} password={handoff.password} onDone={() => setHandoff(null)} />
      )}
      <Note type="err" onClose={() => setErr("")}>{err}</Note>

      {loading ? (
        <div style={{ display: "grid", placeItems: "center", padding: 40 }}>
          <Loader2 size={22} className="adm-spin" color={ORANGE} />
        </div>
      ) : mentors.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <GraduationCap size={28} color={ORANGE} style={{ opacity: 0.7 }} />
          <p style={{ fontSize: 13.5, color: "#7c7368", margin: "10px 0 0" }}>
            No mentors yet. Create one to get started.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mentors.map((m) => (
            <MentorRow key={m.id} token={token} mentor={m} onChange={upsert}
              onPassword={(name, password) => setHandoff({ mentor: name, password })} />
          ))}
        </div>
      )}

      <style>{`
        .adm-spin { animation: adm-spin .9s linear infinite; }
        @keyframes adm-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
