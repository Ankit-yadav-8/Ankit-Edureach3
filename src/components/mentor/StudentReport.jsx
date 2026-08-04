import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Clock, ClipboardList, Layers, TrendingUp, TrendingDown,
  ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, Eye,
  Plus, Trash2, Save, Loader2, Pencil, Lock, History, UserCheck,
} from "lucide-react";

/* ══════════════════════════════════════════════
   The mentor's view of one student.

   The study log, tests and backlog render from the student's own
   progress blob { entries, tests, backlog } exactly as they saved
   it — read-only, and the server has no write path for that data.

   The one thing the mentor OWNS is the task list: they assign it
   here and it lands in the student's mandatory "From your mentor"
   fix-list. That section (and only that one) is editable.
══════════════════════════════════════════════ */

const ACCENT = "#FF693D";
const SORA = "Sora, system-ui, sans-serif";

// Local calendar day (YYYY-MM-DD) — MUST match the student dashboard's isoDay,
// which uses local (not UTC) time, so the day keys the student writes line up
// with what the mentor reads here (no IST-past-midnight off-by-one).
const isoDay = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};
const round1 = (n) => Math.round(n * 10) / 10;

/* ISO week key — MUST match the student dashboard's weekKey() so the completion
   the student ticks lines up with the week the mentor reads. */
function weekKey(d = new Date()) {
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = dt.getUTCDay() || 7;
  dt.setUTCDate(dt.getUTCDate() + 4 - day);
  const yStart = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
  const wk = Math.ceil((((dt - yStart) / 86400000) + 1) / 7);
  return `${dt.getUTCFullYear()}-W${wk}`;
}

/* Consecutive days logged, counting back from today (yesterday if today is blank). */
function streakOf(entries) {
  const set = new Set(entries.map((e) => e.date));
  let streak = 0;
  const d = new Date();
  if (!set.has(isoDay(d))) d.setDate(d.getDate() - 1);
  while (set.has(isoDay(d))) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}

const lastNDays = (entries, n) => {
  const cut = new Date();
  cut.setDate(cut.getDate() - n);
  return entries.filter((e) => new Date(e.date) >= cut);
};

/* ── Small pieces ───────────────────────────── */
function Stat({ icon: Icon, label, value, sub, tone = ACCENT }) {
  return (
    <div style={{ background: "var(--sky)", border: "1px solid var(--line)", borderRadius: 12, padding: "13px 15px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
        <span style={{ display: "grid", placeItems: "center", width: 26, height: 26, borderRadius: 8, background: `${tone}18`, color: tone }}>
          <Icon size={14} />
        </span>
        <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{label}</span>
      </div>
      <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 21, color: "var(--navy)", lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function Empty({ children }) {
  return (
    <div style={{ padding: "34px 16px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
      {children}
    </div>
  );
}

/* Bars scale to the largest value present, so a light week still reads clearly. */
function HoursBars({ entries }) {
  const days = useMemo(() => {
    const out = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = isoDay(d);
      const e = entries.find((x) => x.date === iso);
      out.push({ iso, hours: e?.hours || 0, label: d.toLocaleDateString(undefined, { weekday: "narrow" }) });
    }
    return out;
  }, [entries]);

  const max = Math.max(...days.map((d) => d.hours), 1);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 128, padding: "0 2px" }}>
      {days.map((d, i) => (
        <div key={d.iso} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
          {/* hour value, right above its bar — so the number is readable, not just on hover */}
          {d.hours > 0 && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22 + i * 0.02 }}
              style={{ fontSize: 9.5, fontWeight: 800, color: ACCENT, fontFamily: "Sora, sans-serif", lineHeight: 1 }}
            >
              {d.hours}h
            </motion.span>
          )}
          <motion.div
            title={`${d.iso} — ${d.hours}h`}
            initial={{ height: 0 }}
            animate={{ height: `${Math.max((d.hours / max) * 80, d.hours ? 4 : 2)}px` }}
            transition={{ duration: 0.45, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "100%", borderRadius: "4px 4px 2px 2px",
              background: d.hours ? `linear-gradient(180deg, ${ACCENT} 0%, ${ACCENT}99 100%)` : "var(--line)",
            }}
          />
          <span style={{ fontSize: 9, color: "var(--muted)" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Section 1 — study log ──────────────────── */
function StudyLog({ entries }) {
  if (!entries.length) return <Empty>No study logs yet. Nothing has been recorded for this student.</Empty>;

  const wk = lastNDays(entries, 7);
  const prev = entries.filter((e) => {
    const d = new Date(e.date), now = new Date();
    const a = new Date(now); a.setDate(a.getDate() - 14);
    const b = new Date(now); b.setDate(b.getDate() - 7);
    return d >= a && d < b;
  });

  const hrs = round1(wk.reduce((s, e) => s + (e.hours || 0), 0));
  const prevHrs = round1(prev.reduce((s, e) => s + (e.hours || 0), 0));
  const delta = round1(hrs - prevHrs);
  const avg = wk.length ? round1(hrs / wk.length) : 0;

  const done = wk.reduce((s, e) => s + (e.tasksDone || 0), 0);
  const total = wk.reduce((s, e) => s + (e.tasksTotal || 0), 0);

  return (
    <div>
      <div className="mentor-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 18 }}>
        <Stat icon={Flame} label="Current streak" value={`${streakOf(entries)}d`} sub="consecutive days logged" />
        <Stat icon={Clock} label="Hours this week" value={`${hrs}h`}
          sub={prev.length ? `${delta >= 0 ? "+" : ""}${delta}h vs last week` : "no prior week to compare"}
          tone={delta >= 0 ? "#16a34a" : "#ef4444"} />
        <Stat icon={TrendingUp} label="Daily average" value={`${avg}h`} sub={`across ${wk.length} logged day${wk.length === 1 ? "" : "s"}`} />
        <Stat icon={ClipboardList} label="Tasks done" value={total ? `${Math.round((done / total) * 100)}%` : "—"}
          sub={total ? `${done} of ${total} this week` : "none set"} />
      </div>

      <div style={{ background: "var(--sky)", border: "1px solid var(--line)", borderRadius: 12, padding: "16px 16px 12px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", marginBottom: 12 }}>Hours — last 14 days</div>
        <HoursBars entries={entries} />
      </div>
    </div>
  );
}

/* ── Section 2 — test analysis ──────────────── */
function TestAnalysis({ tests }) {
  if (!tests.length) return <Empty>No tests recorded yet for this student.</Empty>;

  const sorted = [...tests].sort((a, b) => new Date(b.date) - new Date(a.date));
  const pct = (t) => (t.total ? Math.round((t.scored / t.total) * 100) : 0);
  const avg = Math.round(sorted.reduce((s, t) => s + pct(t), 0) / sorted.length);
  const best = sorted.reduce((m, t) => (pct(t) > pct(m) ? t : m), sorted[0]);
  const silly = sorted.reduce((s, t) => s + (t.silly || 0), 0);

  return (
    <div>
      <div className="mentor-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 18 }}>
        <Stat icon={ClipboardList} label="Tests taken" value={sorted.length} />
        <Stat icon={TrendingUp} label="Average score" value={`${avg}%`} />
        <Stat icon={CheckCircle2} label="Best" value={`${pct(best)}%`} sub={best.name} tone="#16a34a" />
        <Stat icon={AlertTriangle} label="Silly mistakes" value={silly} sub="across all tests" tone={silly > 0 ? "#f59e0b" : ACCENT} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {sorted.slice(0, 8).map((t, i) => {
          const p = pct(t);
          const tone = p >= 70 ? "#16a34a" : p >= 45 ? "#f59e0b" : "#ef4444";
          return (
            <motion.div
              key={t.id || `${t.name}-${t.date}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                background: "var(--sky)", border: "1px solid var(--line)", borderRadius: 11,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: SORA, fontWeight: 700, fontSize: 13, color: "var(--navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {t.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                  {t.date} · {t.type} · {t.correct ?? 0}✓ {t.wrong ?? 0}✗ {t.skipped ?? 0}–
                  {t.weak ? ` · weak: ${t.weak}` : ""}
                </div>
              </div>
              <div style={{ width: 92, flexShrink: 0 }}>
                <div style={{ height: 6, borderRadius: 4, background: "var(--line)", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${p}%` }}
                    transition={{ duration: 0.6, delay: 0.1 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: "100%", background: tone, borderRadius: 4 }}
                  />
                </div>
              </div>
              <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 15, color: tone, width: 44, textAlign: "right", flexShrink: 0 }}>
                {p}%
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Section 3 — backlog ────────────────────── */
function Backlog({ backlog }) {
  if (!backlog.length) return <Empty>No backlog items. Nothing pending for this student.</Empty>;

  const today = isoDay(new Date());
  const open = backlog.filter((b) => !b.done);
  const overdue = open.filter((b) => b.targetDate && b.targetDate < today);

  return (
    <div>
      <div className="mentor-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 18 }}>
        <Stat icon={Layers} label="Open items" value={open.length} />
        <Stat icon={AlertTriangle} label="Overdue" value={overdue.length}
          sub={overdue.length ? "past target date" : "nothing overdue"}
          tone={overdue.length ? "#ef4444" : "#16a34a"} />
        <Stat icon={CheckCircle2} label="Cleared" value={backlog.length - open.length} tone="#16a34a" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {backlog.map((b, i) => {
          const late = !b.done && b.targetDate && b.targetDate < today;
          return (
            <motion.div
              key={b.id || `${b.subject}-${b.topic}`}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: i * 0.03 }}
              style={{
                display: "flex", alignItems: "center", gap: 11, padding: "11px 14px",
                background: "var(--sky)", borderRadius: 11,
                border: `1px solid ${late ? "#ef444455" : "var(--line)"}`,
                opacity: b.done ? 0.55 : 1,
              }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                background: b.done ? "#16a34a" : late ? "#ef4444" : b.strength === "weak" ? "#f59e0b" : ACCENT,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 12.5, color: "var(--navy)", textDecoration: b.done ? "line-through" : "none" }}>
                  {b.topic}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>{b.subject}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: late ? "#ef4444" : "var(--muted)", flexShrink: 0 }}>
                {b.done ? "done" : late ? `overdue · ${b.targetDate}` : b.targetDate || "—"}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Section 4 — the tasks the mentor assigns this student ─────────────────────
   Editable: add, rename, remove and save. Saving replaces the whole list, which
   is exactly what the student then sees as their mandatory "From your mentor"
   fix-list. A local draft is kept until Save so edits never half-apply.

   Completion is authoritative from the student: a task the student has ticked
   THIS week (completedTexts) shows as done and is LOCKED — the mentor can't
   rename or remove it, so a finished task can't be quietly changed underneath
   them. `history` is the record of what was completed in earlier weeks, kept
   here even though the student's own view resets each week. `studentTasks` is
   the extra work the student set for themselves. */
function Tasks({ tasks, onSave, completedTexts, history, studentTasks }) {
  const done = completedTexts || new Set();
  const serverText = (tasks || []).map((t) => t.text).join("\n");
  const [draft, setDraft] = useState(() => (tasks || []).map((t, i) => ({ id: t.id || `mt-${i}`, text: t.text })));
  const [newTask, setNewTask] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Re-seed when the mentor switches to a different student (or the saved list
  // changes), unless the mentor has an unsaved draft in progress.
  useEffect(() => {
    setDraft((tasks || []).map((t, i) => ({ id: t.id || `mt-${i}`, text: t.text })));
    setMsg({ type: "", text: "" });
    setNewTask("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverText]);

  const dirty = draft.map((t) => t.text.trim()).filter(Boolean).join("\n") !== serverText;
  const doneCount = draft.filter((t) => done.has(t.text)).length;

  const save = async (listToSave) => {
    if (!onSave) return;
    setBusy(true); setMsg({ type: "", text: "" });
    try {
      const texts = (listToSave || draft).map((t) => t.text.trim()).filter(Boolean);
      await onSave(texts);
      setMsg({ type: "ok", text: texts.length ? `Assigned ${texts.length} task${texts.length === 1 ? "" : "s"}.` : "Cleared this student's task list." });
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    } catch (e) {
      setMsg({ type: "err", text: e.message || "Could not save. Try again." });
    } finally { setBusy(false); }
  };

  const add = async (e) => {
    e?.preventDefault();
    const text = newTask.trim();
    if (!text) return;
    const newDraft = [...draft, { id: `mt-${Date.now()}`, text }];
    setDraft(newDraft);
    setNewTask("");
    await save(newDraft);
  };
  // Edits/removes are refused for a completed task — the student already finished it.
  const edit = (id, text) => setDraft((p) => p.map((t) => (t.id === id && !done.has(t.text) ? { ...t, text } : t)));
  const remove = async (id) => {
    const newDraft = draft.filter((t) => t.id !== id || done.has(t.text));
    setDraft(newDraft);
    await save(newDraft);
  };

  const inputStyle = {
    flex: 1, minWidth: 0, padding: "10px 12px", borderRadius: 9, fontSize: 13,
    border: "1px solid var(--line)", background: "#fff", color: "var(--navy)",
    outline: "none", fontFamily: "inherit",
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", margin: "0 0 12px" }}>
        <p style={{ fontSize: 12, color: "var(--muted)", margin: 0, lineHeight: 1.55, flex: 1, minWidth: 200 }}>
          Set the tasks this student must work through. They appear in their dashboard under
          <strong style={{ color: "var(--navy)" }}> “From your mentor”</strong> and roll into the weekly parent report.
        </p>
        {draft.length > 0 && (
          <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 800, color: "#16a34a", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 50, padding: "4px 11px" }}>
            <CheckCircle2 size={12} /> {doneCount}/{draft.length} done this week
          </span>
        )}
      </div>

      {/* add a task */}
      <form onSubmit={add} style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a task — e.g. Finish Rotational Motion PYQs"
          style={inputStyle}
          onFocus={(e) => { e.target.style.borderColor = ACCENT; }}
          onBlur={(e) => { e.target.style.borderColor = "var(--line)"; }}
        />
        <button type="submit" disabled={!newTask.trim()}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, border: "none", borderRadius: 9,
            padding: "0 16px", height: 40, fontFamily: SORA, fontWeight: 700, fontSize: 13,
            background: newTask.trim() ? ACCENT : `${ACCENT}66`, color: "#fff",
            cursor: newTask.trim() ? "pointer" : "not-allowed", flexShrink: 0,
          }}>
          <Plus size={15} /> Add
        </button>
      </form>

      {/* the draft list */}
      {draft.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {draft.map((t, i) => {
            const isDone = done.has(t.text);
            return (
              <div key={t.id} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 10px 8px 12px",
                background: isDone ? "#f0fdf4" : "var(--sky)",
                border: `1px solid ${isDone ? "#bbf7d0" : "var(--line)"}`, borderRadius: 11,
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0, display: "grid", placeItems: "center",
                  fontSize: 10, fontWeight: 800,
                  background: isDone ? "#16a34a" : `${ACCENT}18`, color: isDone ? "#fff" : ACCENT,
                }}>{isDone ? <CheckCircle2 size={13} /> : i + 1}</span>
                <input value={t.text} onChange={(e) => edit(t.id, e.target.value)} onBlur={() => dirty && save()} readOnly={isDone}
                  title={isDone ? "Completed by the student — locked" : undefined}
                  style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontSize: 13,
                    color: isDone ? "#15803d" : "var(--navy)", fontFamily: "inherit", cursor: isDone ? "default" : "text" }} />
                {isDone ? (
                  <span title="Completed — locked" aria-label="Completed and locked"
                    style={{ display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0, fontSize: 10.5, fontWeight: 800, color: "#16a34a", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 50, padding: "4px 9px" }}>
                    <Lock size={11} /> Done
                  </span>
                ) : (
                  <button onClick={() => remove(t.id)} title="Remove" aria-label="Remove task"
                    style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #fee2e2", background: "#fff5f5", color: "#ef4444", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: "22px 16px", textAlign: "center", color: "var(--muted)", fontSize: 12.5, marginBottom: 16 }}>
          No tasks set yet — add the first one above.
        </div>
      )}

      {msg.text && (
        <div style={{
          borderRadius: 9, padding: "9px 12px", marginBottom: 14, fontSize: 12.5, fontWeight: 600, lineHeight: 1.5,
          background: msg.type === "ok" ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${msg.type === "ok" ? "#86efac" : "#fecaca"}`,
          color: msg.type === "ok" ? "#166534" : "#b91c1c",
        }}>
          {msg.text}
        </div>
      )}

      {/* student's own tasks — extra work they set themselves (read-only) */}
      {Array.isArray(studentTasks) && studentTasks.length > 0 && (
        <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <UserCheck size={14} color="#6366f1" />
            <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: 13, color: "var(--navy)" }}>Extra work the student set themselves</span>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: "#6366f1", background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 50, padding: "2px 8px" }}>
              {studentTasks.filter((t) => t.done).length}/{studentTasks.length}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {studentTasks.map((t, i) => (
              <div key={t.id || i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 11px", background: "var(--sky)", border: "1px solid var(--line)", borderRadius: 10 }}>
                <span style={{ width: 16, height: 16, borderRadius: 5, flexShrink: 0, display: "grid", placeItems: "center",
                  background: t.done ? "#16a34a" : "#fff", border: `1.5px solid ${t.done ? "#16a34a" : "#cbd5e1"}` }}>
                  {t.done && <CheckCircle2 size={11} color="#fff" />}
                </span>
                <span style={{ fontSize: 12.5, color: t.done ? "#15803d" : "var(--navy)", textDecoration: t.done ? "line-through" : "none", lineHeight: 1.45 }}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* completion record — kept even after the student's weekly reset */}
      {Array.isArray(history) && history.length > 0 && (
        <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <History size={14} color="var(--muted)" />
            <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: 13, color: "var(--navy)" }}>Completion record</span>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>· earlier weeks (kept for you)</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {history.map(({ week, tasks: wkTasks }) => (
              <div key={week}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 6 }}>{week}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {wkTasks.map((tx, j) => (
                    <span key={j} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, color: "#15803d", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "4px 9px" }}>
                      <CheckCircle2 size={11} /> {tx}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── The stepper shell — one section at a time ─── */
const SECTIONS = [
  { key: "log",     label: "Study log",     icon: Clock,         blurb: "Daily hours, streak and task completion.", readOnly: true },
  { key: "tests",   label: "Test analysis", icon: TrendingUp,    blurb: "Scores, accuracy and recurring mistakes.", readOnly: true },
  { key: "backlog", label: "Backlog",       icon: Layers,        blurb: "Pending topics and what's slipping.", readOnly: true },
  { key: "tasks",   label: "Assign tasks",  icon: ClipboardList, blurb: "The tasks you set this student — their mandatory fix-list." },
];

/* How stale is what the mentor is looking at? The student's dashboard syncs to
   the server as they use it, so this is the honest answer to "am I seeing today's
   work or last week's" — which a mentor checking in daily needs to know. */
function freshness(updatedAt) {
  if (!updatedAt) return null;
  const mins = Math.floor((Date.now() - new Date(updatedAt)) / 60000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

export default function StudentReport({ progress, tests, tasks, updatedAt, onSaveTasks }) {
  const [i, setI] = useState(0);
  const section = SECTIONS[i];
  const synced = freshness(updatedAt);

  const entries = Array.isArray(progress?.entries) ? progress.entries : [];
  // Test data can come from the student's own blob or from server-graded
  // attempts; prefer the blob (it's what the student sees) and fall back.
  const testList = Array.isArray(progress?.tests) && progress.tests.length
    ? progress.tests
    : (tests || []).map((a) => ({
        id: String(a._id), name: a.title || "Test", type: a.category || "test",
        date: isoDay(a.createdAt), total: a.maxMarks, scored: a.score,
        correct: a.correctCount, wrong: a.wrongCount, skipped: a.skippedCount,
      }));
  const backlog = Array.isArray(progress?.backlog) ? progress.backlog : [];

  // Task completion the student ticks lives in their progress blob as
  // fixDone = { [weekKey]: [taskText, …] }. It's the same store the student's
  // "From your mentor" checkboxes write to, so it's authoritative here.
  const fixDone = (progress && typeof progress.fixDone === "object" && progress.fixDone) || {};
  const curWeek = weekKey();
  const assignedTexts = new Set((tasks || []).map((t) => t.text));
  // Currently-assigned tasks the student has completed THIS week (→ lock them).
  const completedTexts = new Set((fixDone[curWeek] || []).filter((x) => assignedTexts.has(x)));
  // The record: what got completed in earlier weeks, newest week first.
  const history = Object.keys(fixDone)
    .filter((w) => w !== curWeek && Array.isArray(fixDone[w]) && fixDone[w].length)
    .sort((a, b) => b.localeCompare(a))
    .map((w) => ({ week: w, tasks: fixDone[w] }));
  const studentTasks = Array.isArray(progress?.weeklyTasks) ? progress.weeklyTasks : [];

  const go = (d) => setI((p) => Math.min(Math.max(p + d, 0), SECTIONS.length - 1));

  return (
    <div>
      {/* section switcher */}
      <div className="mentor-sections" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
        {SECTIONS.map((s, idx) => {
          const on = idx === i;
          const Ic = s.icon;
          return (
            <button
              key={s.key}
              onClick={() => setI(idx)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "10px 8px", borderRadius: 10, cursor: "pointer",
                border: `1px solid ${on ? ACCENT : "var(--line)"}`,
                background: on ? `${ACCENT}0f` : "#fff",
                color: on ? ACCENT : "var(--muted)",
                fontWeight: on ? 800 : 600, fontSize: 12,
                transition: "background .15s, border-color .15s, color .15s",
              }}
            >
              <Ic size={14} /> {s.label}
            </button>
          );
        })}
      </div>

      <div className="card" style={{ minHeight: 340 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 17, color: "var(--navy)", margin: 0 }}>
                {section.label}
              </h3>
              {section.readOnly ? (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9.5, fontWeight: 800,
                  letterSpacing: ".05em", textTransform: "uppercase", color: "var(--muted)",
                  background: "var(--sky)", border: "1px solid var(--line)", borderRadius: 50, padding: "3px 8px",
                }}>
                  <Eye size={10} /> Read only
                </span>
              ) : (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9.5, fontWeight: 800,
                  letterSpacing: ".05em", textTransform: "uppercase", color: ACCENT,
                  background: `${ACCENT}12`, border: `1px solid ${ACCENT}44`, borderRadius: 50, padding: "3px 8px",
                }}>
                  <Pencil size={10} /> You set these
                </span>
              )}
            </div>
            <p style={{ fontSize: 12, color: "var(--muted)", margin: "3px 0 0" }}>
              {section.blurb}
              {synced && <> · <span title={new Date(updatedAt).toLocaleString()}>student last synced {synced}</span></>}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 11.5, color: "var(--muted)", marginRight: 2 }}>{i + 1} / {SECTIONS.length}</span>
            {[[ChevronLeft, -1], [ChevronRight, 1]].map(([Ic, d]) => {
              const disabled = d < 0 ? i === 0 : i === SECTIONS.length - 1;
              return (
                <button
                  key={d} onClick={() => go(d)} disabled={disabled}
                  aria-label={d < 0 ? "Previous section" : "Next section"}
                  style={{
                    width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center",
                    border: "1px solid var(--line)", background: "#fff",
                    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1,
                    color: "var(--navy)",
                  }}
                >
                  <Ic size={15} />
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={section.key}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {section.key === "log"     && <StudyLog entries={entries} />}
            {section.key === "tests"   && <TestAnalysis tests={testList} />}
            {section.key === "backlog" && <Backlog backlog={backlog} />}
            {section.key === "tasks"   && <Tasks tasks={tasks || []} onSave={onSaveTasks}
              completedTexts={completedTexts} history={history} studentTasks={studentTasks} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 780px) {
          .mentor-sections { grid-template-columns: repeat(2, 1fr) !important; }
          .mentor-stats    { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
