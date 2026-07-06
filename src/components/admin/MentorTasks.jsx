import { useState } from "react";
import { Search, Plus, Trash2, Save, CheckCircle2, ListChecks, User } from "lucide-react";
import { apiAdminGetMentorTasks, apiAdminSetMentorTasks } from "../../auth/api.js";

const ORANGE = "#FF693D";
const GREEN = "#15a06e";

// Admin tool: look up a student by their global ID (CP-2026-00042) and set the
// weekly task list they'll see as "suggested" items in their dashboard.
export default function MentorTasks({ token }) {
  const [idInput, setIdInput] = useState("");
  const [loaded, setLoaded] = useState(null);     // { studentId, found, student }
  const [tasks, setTasks] = useState([]);         // [{ id, text }]
  const [newTask, setNewTask] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const flash = (type, text) => setMsg({ type, text });

  async function load(id) {
    const studentId = (id ?? idInput).trim().toUpperCase();
    if (!studentId) return;
    setBusy(true); setMsg({ type: "", text: "" });
    try {
      const d = await apiAdminGetMentorTasks(token, studentId);
      setLoaded({ studentId: d.studentId, found: d.found, student: d.student });
      setTasks((d.tasks || []).map((t) => ({ id: t.id || `mt-${Math.random()}`, text: t.text })));
      if (!d.found) flash("warn", `No mentorship enrolment found for ${d.studentId}. You can still set tasks — they'll apply once that ID is active.`);
    } catch (e) {
      setLoaded(null); setTasks([]);
      flash("err", e.message || "Could not load this student.");
    } finally { setBusy(false); }
  }

  function addTask(e) {
    e?.preventDefault();
    const text = newTask.trim();
    if (!text) return;
    setTasks((prev) => [...prev, { id: `mt-${Date.now()}`, text }]);
    setNewTask("");
  }
  const removeTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const editTask = (id, text) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));

  async function save() {
    if (!loaded?.studentId) return;
    setBusy(true); setMsg({ type: "", text: "" });
    try {
      const d = await apiAdminSetMentorTasks(token, loaded.studentId, tasks.map((t) => t.text));
      setTasks((d.tasks || []).map((t) => ({ id: t.id, text: t.text })));
      flash("ok", `Saved ${d.tasks?.length || 0} task${(d.tasks?.length || 0) === 1 ? "" : "s"} for ${loaded.studentId}.`);
    } catch (e) {
      flash("err", e.message || "Could not save.");
    } finally { setBusy(false); }
  }

  const inputStyle = { height: 44, padding: "0 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

  return (
    <div className="adm-card" style={{ background: "var(--page-bg)", borderRadius: 20, border: "1px solid #f0e9e0", overflow: "hidden", boxShadow: "0 8px 30px rgba(13,27,62,.06)" }}>
      {/* header */}
      <div style={{ padding: "18px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${GREEN}15`, display: "grid", placeItems: "center" }}>
          <ListChecks size={19} color={GREEN} />
        </div>
        <div>
          <div style={{ fontWeight: 800, color: "#0d1b3e", fontSize: 15, fontFamily: "Sora" }}>Weekly Tasks</div>
          <div style={{ fontSize: 12.5, color: "#888" }}>Set a student's weekly task list — it shows in their dashboard's suggested fix-list.</div>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        {/* student-ID lookup */}
        <form onSubmit={(e) => { e.preventDefault(); load(); }} style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
          <input
            placeholder="Student ID — e.g. CP-2026-00002"
            value={idInput}
            onChange={(e) => setIdInput(e.target.value.toUpperCase())}
            style={{ ...inputStyle, flex: 1, minWidth: 220, letterSpacing: ".02em", fontWeight: 600 }}
            onFocus={(e) => { e.target.style.borderColor = GREEN; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }}
          />
          <button type="submit" disabled={busy || !idInput.trim()}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: ORANGE, color: "#fff", border: "none", height: 44, padding: "0 20px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: busy || !idInput.trim() ? "not-allowed" : "pointer", opacity: busy || !idInput.trim() ? .6 : 1 }}>
            <Search size={15} /> {busy ? "Loading…" : "Load"}
          </button>
        </form>

        {msg.text && (
          <div style={{ borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, fontWeight: 600, lineHeight: 1.5,
            background: msg.type === "ok" ? "#f0fdf4" : msg.type === "warn" ? "#fffbeb" : "#fff0f0",
            border: `1px solid ${msg.type === "ok" ? "#86efac" : msg.type === "warn" ? "#fde68a" : "#fca5a5"}`,
            color: msg.type === "ok" ? "#166534" : msg.type === "warn" ? "#92400e" : "#dc2626" }}>
            {msg.text}
          </div>
        )}

        {loaded && (
          <>
            {/* student summary */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#faf8f4", border: "1px solid #f0e9e0", borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${GREEN}18`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                <User size={18} color={GREEN} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, color: "#0d1b3e", fontSize: 14.5, fontFamily: "Sora" }}>
                  {loaded.student?.name || "Unknown student"} <span style={{ color: "#9a9189", fontWeight: 600, fontSize: 12.5 }}>· {loaded.studentId}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "#888" }}>
                  {loaded.found ? `${loaded.student?.targetExam || loaded.student?.plan || "Mentorship"}${loaded.student?.email ? ` · ${loaded.student.email}` : ""}` : "No active enrolment for this ID yet"}
                </div>
              </div>
            </div>

            {/* add task */}
            <form onSubmit={addTask} style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
              <input
                placeholder="Add a weekly task — e.g. Finish Rotational Motion PYQs"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                style={{ ...inputStyle, flex: 1, minWidth: 220 }}
                onFocus={(e) => { e.target.style.borderColor = GREEN; }} onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; }}
              />
              <button type="submit" disabled={!newTask.trim()}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `linear-gradient(135deg,${GREEN},#22c55e)`, color: "#fff", border: "none", height: 44, padding: "0 18px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: newTask.trim() ? "pointer" : "not-allowed", opacity: newTask.trim() ? 1 : .6 }}>
                <Plus size={15} /> Add
              </button>
            </form>

            {/* task list */}
            {tasks.length ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                {tasks.map((t, i) => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid #eef2f7", borderRadius: 11, padding: "8px 10px 8px 12px" }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#cbd5e1", width: 18, flexShrink: 0, textAlign: "center" }}>{i + 1}</span>
                    <input value={t.text} onChange={(e) => editTask(t.id, e.target.value)}
                      style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#0d1b3e", background: "transparent", minWidth: 0, fontFamily: "inherit" }} />
                    <button onClick={() => removeTask(t.id)} title="Remove"
                      style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #fee2e2", background: "#fff5f5", color: "#ef4444", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#9ca3af", fontSize: 13 }}>No tasks yet — add the first one above.</div>
            )}

            <button onClick={save} disabled={busy}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: busy ? `${GREEN}99` : GREEN, color: "#fff", border: "none", height: 46, padding: "0 22px", borderRadius: 12, fontWeight: 800, fontSize: 14, fontFamily: "Sora", cursor: busy ? "not-allowed" : "pointer" }}>
              {busy ? <CheckCircle2 size={16} /> : <Save size={16} />} Save task list
            </button>
          </>
        )}
      </div>
    </div>
  );
}
