import { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Plus, Trash2, UserPlus, KeyRound, Copy, Check, Loader2, ShieldOff,
  ShieldCheck, GraduationCap, AlertTriangle, X, Search, ChevronDown,
  UserCheck, Users, Sparkles, Tag, CheckCircle2, ChevronRight
} from "lucide-react";
import {
  apiAdminMentorList, apiAdminMentorCreate, apiAdminMentorUpdate,
  apiAdminMentorAssign, apiAdminMentorUnassign, apiAdminMentorResetPassword,
  apiAdminMentorDelete, apiAdminEligibleStudents, apiAdminSetStudentGroup,
} from "../../auth/api.js";

const ORANGE = "#FF693D";
const GREEN = "#15a06e";
const RED = "#dc2626";

const inputStyle = {
  height: 38, padding: "0 12px", borderRadius: 9, border: "1.5px solid #e2e8f0",
  fontSize: 12.5, outline: "none", fontFamily: "inherit", boxSizing: "border-box", width: "100%",
  background: "#ffffff", color: "#0f172a", transition: "all .15s ease",
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
      display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12,
      borderRadius: 9, padding: "9px 12px", fontSize: 12, lineHeight: 1.5,
      background: c.bg, border: `1.5px solid ${c.bd}`, color: c.fg,
    }}>
      <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>{children}</div>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss"
          style={{ border: "none", background: "transparent", cursor: "pointer", color: c.fg, padding: 0 }}>
          <X size={13} />
        </button>
      )}
    </div>
  );
}

function PasswordHandoff({ mentor, password, onDone }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked */ }
  };
  return (
    <div style={{
      background: "#fffbeb", border: `1.5px solid #fcd34d`, borderRadius: 12,
      padding: "12px 14px", marginBottom: 14,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
        <KeyRound size={14} color="#92400e" />
        <strong style={{ fontFamily: "Sora, sans-serif", fontSize: 13, color: "#92400e" }}>
          One-time password for {mentor}
        </strong>
      </div>
      <p style={{ fontSize: 11.5, color: "#92400e", margin: "0 0 8px", lineHeight: 1.5 }}>
        Copy this now and send it to the mentor. It cannot be shown again.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <code style={{
          flex: 1, background: "#fff", border: "1px solid #fcd34d", borderRadius: 8,
          padding: "7px 10px", fontSize: 13, fontFamily: "ui-monospace, monospace",
          color: "#111", letterSpacing: ".04em", userSelect: "all",
        }}>{password}</code>
        <button onClick={copy} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "0 12px", borderRadius: 8,
          border: "none", background: copied ? GREEN : "#92400e", color: "#fff",
          fontWeight: 700, fontSize: 12, cursor: "pointer",
        }}>
          {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={onDone} style={{
          padding: "0 12px", borderRadius: 8, border: "1.5px solid #fcd34d",
          background: "#fff", color: "#92400e", fontWeight: 700, fontSize: 12, cursor: "pointer",
        }}>
          Done
        </button>
      </div>
    </div>
  );
}

/* ── Create mentor form ──────────────────────────────── */
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
        display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9,
        border: "none", background: `linear-gradient(135deg,${ORANGE},#ea580c)`, color: "#fff",
        fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 12.5, cursor: "pointer",
        boxShadow: "0 4px 14px rgba(255,105,61,.3)",
      }}>
        <UserPlus size={14} /> New Mentor
      </button>
    );
  }

  return (
    <form onSubmit={submit} style={{
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
      padding: 14, marginBottom: 16, boxShadow: "0 4px 18px rgba(15,23,42,.05)",
    }}>
      <Note type="err">{err}</Note>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 10 }}>
        <input style={inputStyle} placeholder="Full name *" value={f.name} onChange={set("name")} required />
        <input style={inputStyle} placeholder="Email *" type="email" value={f.email} onChange={set("email")} required />
        <input style={inputStyle} placeholder="College / IIT" value={f.college} onChange={set("college")} />
        <input style={inputStyle} placeholder="Contact number" value={f.phone} onChange={set("phone")} />
      </div>
      <p style={{ fontSize: 11.5, color: "#64748b", margin: "0 0 10px", lineHeight: 1.4 }}>
        A secure one-time password will be generated for the mentor upon creation.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={busy} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
          border: "none", background: busy ? `${ORANGE}99` : ORANGE, color: "#fff",
          fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 12, cursor: busy ? "wait" : "pointer",
        }}>
          {busy ? <Loader2 size={12} className="adm-spin" /> : <Plus size={12} />} Save Mentor
        </button>
        <button type="button" onClick={() => { setOpen(false); setErr(""); }} style={{
          padding: "8px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0",
          background: "#fff", color: "#64748b", fontWeight: 700, fontSize: 12, cursor: "pointer",
        }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ── One Mentor Card / Row ──────────────────────────── */
function MentorRow({ token, mentor, eligibleStudents = [], onChange, onDelete, onPassword }) {
  const [sid, setSid] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [editingGroupSid, setEditingGroupSid] = useState(null);
  const [groupInput, setGroupInput] = useState("");

  // Map of studentId -> eligible student object
  const studentMap = useMemo(() => {
    const map = new Map();
    eligibleStudents.forEach((s) => {
      if (s.studentId) map.set(s.studentId.toUpperCase(), s);
    });
    return map;
  }, [eligibleStudents]);

  // Live lookup for student name as user types CP ID
  const matchedStudent = useMemo(() => {
    const q = sid.trim().toUpperCase();
    if (!q) return null;
    return eligibleStudents.find((s) =>
      s.studentId?.toUpperCase() === q ||
      s.studentId?.toUpperCase().endsWith(q) ||
      s.name?.toLowerCase().includes(sid.trim().toLowerCase())
    ) || null;
  }, [sid, eligibleStudents]);

  // Students available to be assigned (paid students not yet in this mentor's list)
  const availableStudents = useMemo(() => {
    const assignedSet = new Set((mentor.students || []).map((s) => s.toUpperCase()));
    return eligibleStudents.filter((s) => !assignedSet.has(s.studentId?.toUpperCase()));
  }, [eligibleStudents, mentor.students]);

  const assignStudentId = async (targetId) => {
    const id = String(targetId || sid).trim().toUpperCase();
    if (!id) return;
    setErr(""); setBusy(true);
    try {
      const r = await apiAdminMentorAssign(token, mentor.id, id);
      setSid("");
      setShowDropdown(false);
      onChange(r.mentor);
    } catch (e2) {
      setErr(e2.message || "Could not assign student");
    } finally { setBusy(false); }
  };

  const unassign = async (id) => {
    if (!window.confirm(`Unassign mentee ${id} from ${mentor.name}?`)) return;
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
    } catch (e2) { setErr(e2.message || "Could not update status"); }
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

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete mentor ${mentor.name}?\nThis will remove their account and unassign their mentees.`)) return;
    setErr(""); setBusy(true);
    try {
      await apiAdminMentorDelete(token, mentor.id);
      onDelete(mentor.id);
    } catch (e2) { setErr(e2.message || "Could not delete mentor"); }
    finally { setBusy(false); }
  };

  const saveGroupTag = async (studentId) => {
    if (!groupInput.trim()) {
      setEditingGroupSid(null);
      return;
    }
    setBusy(true);
    try {
      await apiAdminSetStudentGroup(token, studentId, groupInput.trim());
      // update local eligible student group
      const target = studentMap.get(studentId.toUpperCase());
      if (target) target.studentGroup = groupInput.trim();
      setEditingGroupSid(null);
      setGroupInput("");
      
    } catch (e) {
      setErr(e.message || "Failed to update group");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{
      background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14,
      padding: "16px 18px", boxShadow: "0 2px 8px rgba(15,23,42,.03)",
      opacity: mentor.active ? 1 : 0.65, transition: "all .15s ease",
    }}>
      {/* Mentor Header Row */}
      <div className="adm-mentor-header-row" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
        
        {/* Left Side: Identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 240, flex: 1 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: "grid", placeItems: "center",
            background: mentor.active ? "linear-gradient(135deg, #FF693D 0%, #ea580c 100%)" : "#cbd5e1",
            color: "#ffffff", fontWeight: 800, fontSize: 15, fontFamily: "Sora, sans-serif",
            boxShadow: mentor.active ? "0 4px 12px rgba(255,105,61,.28)" : "none",
          }}>
            {mentor.name?.charAt(0)?.toUpperCase() || "M"}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "Sora, sans-serif", fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
                {mentor.name}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 800,
                color: mentor.active ? "#15803d" : RED,
                background: mentor.active ? "#f0fdf4" : "#fef2f2",
                border: `1px solid ${mentor.active ? "#bbf7d0" : "#fecaca"}`,
                borderRadius: 6, padding: "1px 7px", textTransform: "uppercase", letterSpacing: 0.5,
              }}>
                {mentor.active ? "Active" : "Deactivated"}
              </span>
              {mentor.mustChangePassword && mentor.active && (
                <span style={{
                  fontSize: 10, fontWeight: 800, color: "#92400e", background: "#fffbeb",
                  border: "1px solid #fde68a", borderRadius: 6, padding: "1px 7px",
                }}>
                  Pending 1st Login
                </span>
              )}
            </div>

            <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 2, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span>{mentor.email}</span>
              {mentor.college && <span>• {mentor.college}</span>}
              {mentor.phone && <span>• {mentor.phone}</span>}
              <span style={{ color: ORANGE, fontWeight: 700 }}>• {mentor.students?.length || 0} Mentees</span>
            </div>
          </div>
        </div>

        {/* Right Side: Action Buttons & Assign Container */}
        <div className="adm-mentor-actions-col" style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", minWidth: 280 }}>
          
          {/* Top Row: Reset Password, Deactivate/Reactivate, and Delete Mentor */}
          <div className="adm-mentor-actions-top" style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button
              onClick={resetPw}
              disabled={busy}
              title="Generate a new one-time password"
              style={{
                display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 11px",
                borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#ffffff",
                color: "#475569", fontSize: 11.5, fontWeight: 700, cursor: busy ? "wait" : "pointer",
                transition: "all .15s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              <KeyRound size={12} color="#64748b" /> Reset password
            </button>

            <button
              onClick={toggleActive}
              disabled={busy}
              title={mentor.active ? "Deactivate mentor access" : "Restore mentor access"}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 11px",
                borderRadius: 8, border: `1.5px solid ${mentor.active ? "#fecaca" : "#bbf7d0"}`,
                background: mentor.active ? "#fff5f5" : "#f0fdf4",
                color: mentor.active ? RED : GREEN, fontSize: 11.5, fontWeight: 700,
                cursor: busy ? "wait" : "pointer",
              }}
            >
              {mentor.active ? <><ShieldOff size={12} /> Deactivate</> : <><ShieldCheck size={12} /> Reactivate</>}
            </button>

            <button
              onClick={handleDelete}
              disabled={busy}
              title="Delete mentor account"
              style={{
                display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 10px",
                borderRadius: 8, border: "1.5px solid #fecaca", background: "#ffffff",
                color: RED, fontSize: 11.5, fontWeight: 700, cursor: busy ? "wait" : "pointer",
                transition: "all .15s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; }}
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>

          {/* Just below the buttons: Quick Assign Bar covering combined width */}
          <div className="adm-assign-container" style={{ position: "relative", width: "100%", maxWidth: 360 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (matchedStudent) assignStudentId(matchedStudent.studentId);
                else assignStudentId(sid);
              }}
              style={{ display: "flex", gap: 6 }}
            >
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  value={sid}
                  onChange={(e) => {
                    setSid(e.target.value);
                    setShowDropdown(false);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Enter CP ID or search student name..."
                  style={{
                    ...inputStyle,
                    height: 34,
                    fontSize: 12,
                    paddingRight: 26,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowDropdown((v) => !v)}
                  style={{
                    position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
                    border: "none", background: "transparent", cursor: "pointer", color: "#94a3b8",
                  }}
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              <button
                type="submit"
                disabled={busy || !sid.trim()}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4, padding: "0 12px",
                  borderRadius: 8, border: "none",
                  background: sid.trim() ? "linear-gradient(135deg, #FF693D 0%, #ea580c 100%)" : "#e2e8f0",
                  color: sid.trim() ? "#ffffff" : "#94a3b8",
                  fontWeight: 700, fontSize: 12, cursor: sid.trim() ? "pointer" : "not-allowed",
                  height: 34, flexShrink: 0,
                }}
              >
                {busy ? <Loader2 size={12} className="adm-spin" /> : <Plus size={13} />} Assign
              </button>
            </form>

            {/* Live Name Preview when CP ID or Name matches */}
            {matchedStudent && (
              <div
                onClick={() => assignStudentId(matchedStudent.studentId)}
                style={{
                  marginTop: 6,
                  background: "#f0fdf4",
                  border: "1.5px solid #86efac",
                  borderRadius: 9,
                  padding: "6px 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  fontSize: 11.5,
                  animation: "admUp .2s ease-out",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <UserCheck size={14} color="#16a34a" />
                  <div>
                    <strong style={{ color: "#166534" }}>{matchedStudent.name}</strong>
                    <span style={{ color: "#15803d", marginLeft: 6, fontFamily: "monospace" }}>({matchedStudent.studentId})</span>
                    {matchedStudent.targetExam && <span style={{ color: "#64748b", marginLeft: 4 }}>• {matchedStudent.targetExam}</span>}
                  </div>
                </div>
                <span style={{ color: "#16a34a", fontWeight: 800, fontSize: 11 }}>Click to assign →</span>
              </div>
            )}

            {/* Dropdown list of eligible students */}
            {showDropdown && availableStudents.length > 0 && (
              <div
                className="cp-custom-scroll"
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  width: "100%",
                  maxHeight: 220,
                  overflowY: "auto",
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: 10,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                  zIndex: 80,
                  marginTop: 4,
                  padding: 4,
                }}
              >
                <div style={{ fontSize: 10.5, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", padding: "4px 8px" }}>
                  Available Students ({availableStudents.length})
                </div>
                {availableStudents.slice(0, 25).map((st) => (
                  <div
                    key={st.studentId}
                    onClick={() => {
                      setSid(st.studentId);
                      assignStudentId(st.studentId);
                    }}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      fontSize: 12,
                      transition: "background .12s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, color: "#0f172a" }}>{st.name}</span>
                      <span style={{ fontFamily: "monospace", color: "#64748b", marginLeft: 6, fontSize: 11 }}>
                        {st.studentId}
                      </span>
                    </div>
                    {st.targetExam && (
                      <span style={{ fontSize: 10, background: "#f8fafc", padding: "1px 6px", borderRadius: 4, color: "#64748b" }}>
                        {st.targetExam}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Note type="err" onClose={() => setErr("")}>{err}</Note>

      {/* ── Assigned Students Section with Names & Group Tags ── */}
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.6 }}>
            Assigned Mentees ({mentor.students?.length || 0})
          </div>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>
            Click group badge to assign e.g. Campus-Point-1
          </span>
        </div>

        {mentor.students && mentor.students.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
            gap: 8,
          }}>
            {mentor.students.map((sId) => {
              const info = studentMap.get(sId.toUpperCase()) || {};
              const sName = info.name || "Student";
              const sGroup = info.studentGroup || "Campus-Point-1";
              const isEditingGroup = editingGroupSid === sId;

              return (
                <div
                  key={sId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "7px 10px",
                    borderRadius: 9,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    gap: 8,
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 12, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {sName}
                      </span>
                      <span style={{
                        fontSize: 10, fontFamily: "monospace", color: "#64748b",
                        background: "#fff", padding: "1px 5px", borderRadius: 4, border: "1px solid #e2e8f0",
                      }}>
                        {sId}
                      </span>
                    </div>

                    {/* Group Tag / Editor */}
                    <div style={{ marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
                      {isEditingGroup ? (
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                          <input
                            value={groupInput}
                            onChange={(e) => setGroupInput(e.target.value)}
                            placeholder="Campus-Point-1"
                            autoFocus
                            style={{ height: 22, fontSize: 10.5, padding: "0 6px", borderRadius: 4, border: "1px solid #cbd5e1" }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveGroupTag(sId);
                              if (e.key === "Escape") setEditingGroupSid(null);
                            }}
                          />
                          <button
                            onClick={() => saveGroupTag(sId)}
                            style={{ background: ORANGE, color: "#fff", border: "none", borderRadius: 4, fontSize: 10, padding: "2px 6px", fontWeight: 700 }}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span
                          onClick={() => {
                            setEditingGroupSid(sId);
                            setGroupInput(sGroup);
                          }}
                          title="Click to change student group (e.g. Campus-Point-1)"
                          style={{
                            fontSize: 10, fontWeight: 700, color: "#2563eb", background: "#eff6ff",
                            padding: "1px 6px", borderRadius: 4, border: "1px solid #dbeafe",
                            cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3,
                          }}
                        >
                          <Tag size={9} /> {sGroup}
                        </span>
                      )}

                      {info.targetExam && (
                        <span style={{ fontSize: 9.5, color: "#94a3b8" }}>• {info.targetExam}</span>
                      )}
                    </div>
                  </div>

                  {/* Unassign button */}
                  <button
                    onClick={() => unassign(sId)}
                    disabled={busy}
                    title={`Unassign ${sName}`}
                    style={{
                      border: "none", background: "transparent", cursor: "pointer",
                      color: "#94a3b8", padding: 4, borderRadius: 6, display: "grid", placeItems: "center",
                      transition: "color .12s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = RED; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, padding: "8px 0" }}>
            No mentees assigned yet. Use the assign box above to link students by name or CP ID.
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Main Mentors Management Tab ────────────────────── */
export default function Mentors({ token }) {
  const [mentors, setMentors] = useState([]);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [handoff, setHandoff] = useState(null);

  // Unassigned Students Slide-Over Drawer state
  const [unassignedDrawerOpen, setUnassignedDrawerOpen] = useState(false);
  const [unassignedSearch, setUnassignedSearch] = useState("");
  const [assigningSid, setAssigningSid] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      const [mRes, sRes] = await Promise.all([
        apiAdminMentorList(token),
        apiAdminEligibleStudents(token).catch(() => ({ students: [] })),
      ]);
      setMentors(mRes.mentors || []);
      setEligibleStudents(sRes.students || []);
    } catch (e) {
      setErr(e.message || "Could not load mentors");
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const upsert = (m) => setMentors((prev) => prev.map((x) => (x.id === m.id ? { ...x, ...m } : x)));
  const removeMentor = (id) => setMentors((prev) => prev.filter((x) => x.id !== id));

  const filteredMentors = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mentors;
    return mentors.filter((m) =>
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.college?.toLowerCase().includes(q) ||
      (m.students || []).some((sid) => sid.toLowerCase().includes(q))
    );
  }, [mentors, search]);

  const assignedSet = useMemo(() => {
    const set = new Set();
    mentors.forEach((m) => (m.students || []).forEach((s) => set.add(String(s).toUpperCase())));
    return set;
  }, [mentors]);

  const totalAssigned = assignedSet.size;

  const unassignedStudents = useMemo(() => {
    return eligibleStudents.filter((s) => !assignedSet.has(String(s.studentId || "").toUpperCase()));
  }, [eligibleStudents, assignedSet]);

  const filteredUnassignedStudents = useMemo(() => {
    const q = unassignedSearch.trim().toLowerCase();
    if (!q) return unassignedStudents;
    return unassignedStudents.filter((s) =>
      s.name?.toLowerCase().includes(q) ||
      s.studentId?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.phone?.toLowerCase().includes(q) ||
      s.plan?.toLowerCase().includes(q)
    );
  }, [unassignedStudents, unassignedSearch]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Top Header Card */}
      <div style={{
        background: "#ffffff",
        borderRadius: 16,
        border: "1px solid #f0e9e0",
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 14,
        boxShadow: "0 2px 10px rgba(15,23,42,0.02)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: `${ORANGE}15`, display: "grid", placeItems: "center", color: ORANGE,
          }}>
            <GraduationCap size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0, fontFamily: "Sora, sans-serif" }}>
              Mentor Accounts & Caseload Management
            </h2>
            <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>
              Assign students by CP ID with live name lookup, manage credentials, and audit active roster
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Quick Search */}
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mentor or mentee..."
              style={{
                height: 36, paddingLeft: 30, paddingRight: 10, borderRadius: 9,
                border: "1px solid #cbd5e1", fontSize: 12, outline: "none", width: 200,
              }}
            />
          </div>

          <CreateMentor token={token} onCreated={(m, password) => {
            setMentors((p) => [m, ...p]);
            setHandoff({ mentor: m.name, password });
          }} />
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="adm-mentor-kpis" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(160px, 100%), 1fr))",
        gap: 12,
      }}>
        <div style={{ background: "#ffffff", borderRadius: 12, padding: "12px 16px", border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Total Mentors</span>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>
            {mentors.length}
            <span style={{ fontSize: 11.5, color: "#16a34a", marginLeft: 6, fontWeight: 600 }}>
              ({mentors.filter((m) => m.active).length} active)
            </span>
          </div>
        </div>

        <div style={{ background: "#ffffff", borderRadius: 12, padding: "12px 16px", border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Assigned Mentees</span>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>
            {totalAssigned}
            <span style={{ fontSize: 11.5, color: "#64748b", marginLeft: 6, fontWeight: 500 }}>
              across {mentors.length} mentors
            </span>
          </div>
        </div>

        <div style={{ background: "#ffffff", borderRadius: 12, padding: "12px 16px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Paid Students Pool</span>
            {unassignedStudents.length > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999,
                background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe",
              }}>
                {unassignedStudents.length} awaiting
              </span>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
              {eligibleStudents.length}
              <span style={{ fontSize: 11.5, color: "#2563eb", marginLeft: 6, fontWeight: 600 }}>
                ({unassignedStudents.length} unassigned)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setUnassignedDrawerOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: unassignedStudents.length > 0 ? "#eff6ff" : "#f8fafc",
                border: unassignedStudents.length > 0 ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                color: unassignedStudents.length > 0 ? "#1d4ed8" : "#64748b",
                fontSize: 11.5,
                fontWeight: 700,
                padding: "5px 10px",
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              title="Click to view all unassigned students"
            >
              <Users size={12.5} />
              <span>View Unassigned ({unassignedStudents.length})</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {handoff && (
        <PasswordHandoff mentor={handoff.mentor} password={handoff.password} onDone={() => setHandoff(null)} />
      )}
      <Note type="err" onClose={() => setErr("")}>{err}</Note>

      {/* Mentor Cards List */}
      {loading ? (
        <div style={{ background: "#ffffff", borderRadius: 14, padding: "50px 20px", textAlign: "center", border: "1px solid #e2e8f0" }}>
          <Loader2 size={24} className="adm-spin" color={ORANGE} style={{ margin: "0 auto 10px" }} />
          <div style={{ fontSize: 12.5, color: "#64748b" }}>Loading mentor directory...</div>
        </div>
      ) : filteredMentors.length === 0 ? (
        <div style={{ background: "#ffffff", borderRadius: 14, padding: "40px 20px", textAlign: "center", border: "1px solid #e2e8f0" }}>
          <GraduationCap size={32} color={ORANGE} style={{ opacity: 0.6, margin: "0 auto 8px" }} />
          <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>No Mentors Found</h4>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
            {search ? `No mentors matching "${search}"` : "Create your first mentor account to begin assigning students."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredMentors.map((m) => (
            <MentorRow
              key={m.id}
              token={token}
              mentor={m}
              eligibleStudents={eligibleStudents}
              onChange={upsert}
              onDelete={removeMentor}
              onPassword={(name, password) => setHandoff({ mentor: name, password })}
            />
          ))}
        </div>
      )}

      {/* Slide-Over Unassigned Students Drawer */}
      {unassignedDrawerOpen && typeof document !== "undefined" && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setUnassignedDrawerOpen(false);
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(15,23,42,0.45)",
            backdropFilter: "blur(2px)",
            display: "flex",
            justifyContent: "flex-end",
            zIndex: 9999,
            animation: "admFadeIn 0.18s ease-out",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              width: "min(500px, 94vw)",
              height: "100vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-12px 0 40px rgba(15,23,42,0.18)",
              borderLeft: "1px solid #e2e8f0",
              animation: "admDrawerSlideIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fafafa",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#eff6ff",
                    color: "#2563eb",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                  }}
                >
                  <Users size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0, fontFamily: "Sora, sans-serif" }}>
                    Unassigned Students ({unassignedStudents.length})
                  </h3>
                  <p style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 0" }}>
                    Paid students awaiting 1-on-1 mentor allocation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUnassignedDrawerOpen(false)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                  color: "#64748b",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Search Filter Strip */}
            <div style={{ padding: "12px 18px", borderBottom: "1px solid #f1f5f9", background: "#ffffff" }}>
              <div style={{ position: "relative" }}>
                <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  value={unassignedSearch}
                  onChange={(e) => setUnassignedSearch(e.target.value)}
                  placeholder="Search by student name, CP ID, email, phone..."
                  style={{
                    ...inputStyle,
                    paddingLeft: 30,
                    height: 35,
                    fontSize: 12,
                  }}
                />
              </div>
            </div>

            {/* Student List */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredUnassignedStudents.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 16px", color: "#64748b" }}>
                  <Users size={28} style={{ opacity: 0.4, margin: "0 auto 8px" }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                    {unassignedSearch ? "No unassigned students match your search" : "No Unassigned Students"}
                  </div>
                  <div style={{ fontSize: 11.5, marginTop: 4 }}>
                    {unassignedSearch ? "Try searching with a different keyword" : "All enrolled students have been assigned to mentors."}
                  </div>
                </div>
              ) : (
                filteredUnassignedStudents.map((st) => (
                  <div
                    key={st.studentId}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "12px 14px",
                      background: "#ffffff",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{st.name}</span>
                          <span style={{
                            fontSize: 10.5, fontWeight: 700, padding: "2px 6px", borderRadius: 6,
                            background: "#f1f5f9", color: "#475569", fontFamily: "monospace",
                          }}>
                            {st.studentId}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                          {st.email} {st.phone ? `• ${st.phone}` : ""}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999,
                        background: "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa",
                        whiteSpace: "nowrap", textTransform: "capitalize",
                      }}>
                        {st.plan || "Mentorship"}
                      </span>
                    </div>

                    {/* Quick Assignment Dropdown */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8, marginTop: 4,
                      paddingTop: 8, borderTop: "1px dashed #f1f5f9",
                    }}>
                      <select
                        id={`assign-select-${st.studentId}`}
                        defaultValue=""
                        style={{
                          flex: 1,
                          height: 32,
                          fontSize: 11.5,
                          borderRadius: 7,
                          border: "1px solid #cbd5e1",
                          padding: "0 8px",
                          background: "#fff",
                          outline: "none",
                        }}
                      >
                        <option value="" disabled>Select mentor to assign...</option>
                        {mentors.filter((m) => m.active).map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.students?.length || 0} mentees)
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={assigningSid === st.studentId}
                        onClick={async () => {
                          const selectEl = document.getElementById(`assign-select-${st.studentId}`);
                          const mentorId = selectEl?.value;
                          if (!mentorId) {
                            alert("Please select a mentor first.");
                            return;
                          }
                          setAssigningSid(st.studentId);
                          try {
                            await apiAdminMentorAssign(token, mentorId, st.studentId);
                            await load();
                          } catch (err) {
                            alert(err.message || "Failed to assign student");
                          } finally {
                            setAssigningSid("");
                          }
                        }}
                        style={{
                          height: 32,
                          padding: "0 12px",
                          borderRadius: 7,
                          border: "none",
                          background: assigningSid === st.studentId ? "#94a3b8" : ORANGE,
                          color: "#fff",
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: assigningSid === st.studentId ? "wait" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {assigningSid === st.studentId ? (
                          <Loader2 size={12} className="adm-spin" />
                        ) : (
                          <UserPlus size={12} />
                        )}
                        <span>Assign</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            <div style={{ padding: "12px 18px", borderTop: "1px solid #f1f5f9", background: "#fafafa", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setUnassignedDrawerOpen(false)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 8,
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        .adm-spin { animation: adm-spin .9s linear infinite; }
        @keyframes adm-spin { to { transform: rotate(360deg); } }
        @keyframes admDrawerSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes admFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 640px) {
          .adm-mentor-header-row {
            flex-direction: column !important;
            gap: 10px !important;
          }
          .adm-mentor-actions-col {
            width: 100% !important;
            min-width: 0 !important;
            align-items: stretch !important;
          }
          .adm-mentor-actions-top {
            width: 100% !important;
            justifyContent: flex-start !important;
          }
          .adm-assign-container {
            max-width: 100% !important;
            width: 100% !important;
          }
          .adm-mentor-kpis {
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }
          .adm-mentor-kpis > div:last-child {
            grid-column: span 2 !important;
          }
        }
      `}</style>
    </div>
  );
}
