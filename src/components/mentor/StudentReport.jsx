import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Clock, ClipboardList, Layers, TrendingUp, TrendingDown,
  ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, Eye,
  Plus, Trash2, Save, Loader2, Pencil, Lock, History, UserCheck,
  Target, Award, Zap, BarChart2, BookOpen, Percent, Search,
  Video, Calendar, ExternalLink, Link2, Copy, Check,
} from "lucide-react";
import { normalizeTestScore } from "../../utils/testScoring.js";
import { apiMentorStudentSession, apiMentorSetStudentSession } from "../../auth/api.js";

/* ══════════════════════════════════════════════
   The mentor's view of one student.

   The study log, tests and backlog render from the student's own
   progress blob { entries, tests, backlog } exactly as they saved
   it - read-only, and the server has no write path for that data.

   The one thing the mentor OWNS is the task list: they assign it
   here and it lands in the student's mandatory "From your mentor"
   fix-list. That section (and only that one) is editable.
══════════════════════════════════════════════ */

const ACCENT = "#FF693D";
const SORA = "Sora, system-ui, sans-serif";

// Local calendar day (YYYY-MM-DD) - MUST match the student dashboard's isoDay,
// which uses local (not UTC) time, so the day keys the student writes line up
// with what the mentor reads here (no IST-past-midnight off-by-one).
const isoDay = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};
const round1 = (n) => Math.round(n * 10) / 10;

/* ISO week key - MUST match the student dashboard's weekKey() so the completion
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
          {/* hour value, right above its bar - so the number is readable, not just on hover */}
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
            title={`${d.iso} - ${d.hours}h`}
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

/* ── Section 1 - study log ──────────────────── */
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
        <Stat icon={ClipboardList} label="Tasks done" value={total ? `${Math.round((done / total) * 100)}%` : "-"}
          sub={total ? `${done} of ${total} this week` : "none set"} />
      </div>

      <div style={{ background: "var(--sky)", border: "1px solid var(--line)", borderRadius: 12, padding: "16px 16px 12px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--navy)", marginBottom: 12 }}>Hours - last 14 days</div>
        <HoursBars entries={entries} />
      </div>
    </div>
  );
}

/* ── Section 2 - test analysis (Allen-inspired academic analytics) ── */
function TestAnalysis({ tests }) {
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!tests.length) return <Empty>No tests recorded yet for this student.</Empty>;

  // Normalize each test through the canonical testScoring formula
  const normalized = tests.map((t, idx) => {
    const norm = normalizeTestScore({
      score: t.scored ?? t.score,
      maxMarks: t.total ?? t.maxMarks,
      totalQuestions: t.totalQuestions || ((Number(t.correct) || 0) + (Number(t.wrong) || 0) + (Number(t.skipped) || 0)),
      examType: t.type,
      correctCount: t.correct ?? t.correctCount,
      wrongCount: t.wrong ?? t.wrongCount,
      skippedCount: t.skipped ?? t.skippedCount,
    });
    return {
      ...t,
      id: t.id || `test-${idx}`,
      score: norm.score,
      maxMarks: norm.maxMarks,
      percent: norm.percent,
      accuracy: norm.accuracy,
      correct: norm.correctCount,
      wrong: norm.wrongCount,
      skipped: norm.skippedCount,
      totalQuestions: norm.totalQuestions,
    };
  });

  const sorted = [...normalized].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Cumulative metrics across all tests
  let totalScore = 0, totalMaxMarks = 0, totalCorrect = 0, totalWrong = 0, totalSkipped = 0;
  sorted.forEach((t) => {
    totalScore += t.score;
    totalMaxMarks += t.maxMarks;
    totalCorrect += t.correct;
    totalWrong += t.wrong;
    totalSkipped += t.skipped;
  });

  const overallPercent = totalMaxMarks > 0 ? Math.round((totalScore / totalMaxMarks) * 1000) / 10 : 0;
  const bestTest = sorted.reduce((m, t) => (t.percent > m.percent ? t : m), sorted[0]);
  const totalAttempted = totalCorrect + totalWrong;
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const totalSilly = sorted.reduce((s, t) => s + (Number(t.silly) || 0), 0);

  // Filtered list
  const filtered = sorted.filter((t) => {
    if (filterType !== "all") {
      const typeStr = String(t.type || "").toLowerCase();
      if (!typeStr.includes(filterType)) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (t.name || "").toLowerCase().includes(q) || (t.type || "").toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Allen-style KPI Overview Banner */}
      <div className="mentor-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        <Stat
          icon={ClipboardList}
          label="Tests Evaluated"
          value={sorted.length}
          sub={`${totalAttempted} Qs attempted`}
        />
        <Stat
          icon={TrendingUp}
          label="Cumulative Average"
          value={`${overallPercent}%`}
          sub={`Avg ~${Math.round(totalScore / sorted.length)}/${Math.round(totalMaxMarks / sorted.length)} marks`}
          tone={overallPercent >= 60 ? "#16a34a" : overallPercent >= 40 ? "#f59e0b" : ACCENT}
        />
        <Stat
          icon={Award}
          label="Peak Performance"
          value={`${bestTest.score}/${bestTest.maxMarks}`}
          sub={`${bestTest.percent}% · ${bestTest.name}`}
          tone="#16a34a"
        />
        <Stat
          icon={Target}
          label="Overall Accuracy"
          value={`${overallAccuracy}%`}
          sub={`${totalSilly} silly mistakes recorded`}
          tone={overallAccuracy >= 75 ? "#16a34a" : overallAccuracy >= 60 ? "#f59e0b" : "#ef4444"}
        />
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", background: "var(--sky)", padding: "10px 14px", borderRadius: 11, border: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {["all", "full", "weekly", "daily"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              style={{
                border: "none",
                borderRadius: 7,
                padding: "5px 11px",
                fontSize: 11.5,
                fontWeight: filterType === f ? 800 : 600,
                cursor: "pointer",
                background: filterType === f ? ACCENT : "#fff",
                color: filterType === f ? "#fff" : "var(--muted)",
                boxShadow: filterType === f ? "0 2px 6px rgba(255,105,61,0.25)" : "none",
                transition: "all .15s",
              }}
            >
              {f === "all" ? "All Tests" : f === "full" ? "Full Exam" : f === "weekly" ? "Weekly" : "Daily"}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: 160 }}>
          <Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "6px 8px 6px 28px",
              borderRadius: 8,
              border: "1px solid var(--line)",
              fontSize: 12,
              outline: "none",
              background: "#fff",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Detailed Allen-Style Test Performance Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((t, i) => {
          const p = t.percent;
          const tone = p >= 70 ? "#16a34a" : p >= 45 ? "#f59e0b" : "#ef4444";
          const toneBg = p >= 70 ? "#ecfdf5" : p >= 45 ? "#fffbeb" : "#fef2f2";
          const toneBorder = p >= 70 ? "#a7f3d0" : p >= 45 ? "#fde68a" : "#fecaca";

          // Segmented progress bar widths
          const qTotal = Math.max(t.totalQuestions, t.correct + t.wrong + t.skipped, 1);
          const correctPct = Math.round((t.correct / qTotal) * 100);
          const wrongPct = Math.round((t.wrong / qTotal) * 100);
          const skippedPct = Math.max(0, 100 - correctPct - wrongPct);

          return (
            <motion.div
              key={t.id || `${t.name}-${t.date}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              style={{
                background: "#ffffff",
                border: "1.5px solid var(--line)",
                borderRadius: 14,
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                boxShadow: "0 2px 6px rgba(15,23,42,0.02)",
              }}
            >
              {/* Card Header: Title + Complete Score + Percentage Pill */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: 14.5, color: "var(--navy)" }}>
                      {t.name}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", background: "var(--sky)", color: "var(--muted)", padding: "2px 6px", borderRadius: 4 }}>
                      {t.type || "Mock"}
                    </span>
                    {t.source === "cbt" && (
                      <span style={{ fontSize: 10, fontWeight: 800, background: "#ede9fe", color: "#6d28d9", padding: "2px 6px", borderRadius: 4 }}>
                        ⚡ CBT Exam
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                    Attempted on {t.date} · {t.totalQuestions} Questions Paper
                  </div>
                </div>

                {/* Prominent Complete Score & Percentage */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: SORA, fontWeight: 900, fontSize: 17, color: "var(--navy)", lineHeight: 1.1 }}>
                      {t.score}
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}> / {t.maxMarks}</span>
                    </div>
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--muted)", marginTop: 1 }}>
                      Marks Scored
                    </div>
                  </div>

                  <span style={{
                    fontFamily: SORA,
                    fontWeight: 900,
                    fontSize: 14,
                    color: tone,
                    background: toneBg,
                    border: `1px solid ${toneBorder}`,
                    padding: "4px 10px",
                    borderRadius: 8,
                    minWidth: 48,
                    textAlign: "center",
                  }}>
                    {p}%
                  </span>
                </div>
              </div>

              {/* Segmented Question Breakdown Bar (Correct vs Wrong vs Skipped) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ height: 7, borderRadius: 5, background: "#e2e8f0", overflow: "hidden", display: "flex" }}>
                  <div title={`Correct: ${t.correct} Qs`} style={{ width: `${correctPct}%`, background: "#16a34a", transition: "width .4s" }} />
                  <div title={`Incorrect: ${t.wrong} Qs`} style={{ width: `${wrongPct}%`, background: "#ef4444", transition: "width .4s" }} />
                  <div title={`Unattempted: ${t.skipped} Qs`} style={{ width: `${skippedPct}%`, background: "#cbd5e1", transition: "width .4s" }} />
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, fontSize: 11, color: "var(--muted)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ color: "#16a34a", fontWeight: 700 }}>
                      ✓ {t.correct} Correct <span style={{ opacity: 0.75 }}>(+{t.correct * 4})</span>
                    </span>
                    <span style={{ color: "#ef4444", fontWeight: 700 }}>
                      ✗ {t.wrong} Incorrect <span style={{ opacity: 0.75 }}>(-{t.wrong})</span>
                    </span>
                    <span style={{ color: "#64748b", fontWeight: 600 }}>
                      — {t.skipped} Unanswered
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, color: t.accuracy >= 75 ? "#16a34a" : "#f59e0b" }}>
                      Accuracy: {t.accuracy}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges / Diagnostics Strip (Silly mistakes, weak topics, predicted rank) */}
              {(t.silly > 0 || (Array.isArray(t.weak) && t.weak.length > 0) || (typeof t.weak === "string" && t.weak) || t.rank) && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", paddingTop: 4, borderTop: "1px dashed var(--line)" }}>
                  {t.silly > 0 && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 700, color: "#b45309", background: "#fef3c7", border: "1px solid #fde68a", padding: "2px 7px", borderRadius: 6 }}>
                      <AlertTriangle size={11} /> {t.silly} Silly mistake{t.silly > 1 ? "s" : ""} {t.sillyTopic ? `(${t.sillyTopic})` : ""}
                    </span>
                  )}
                  {((Array.isArray(t.weak) && t.weak.length > 0) || (typeof t.weak === "string" && t.weak)) && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 700, color: "#b91c1c", background: "#fef2f2", border: "1px solid #fecaca", padding: "2px 7px", borderRadius: 6 }}>
                      <BookOpen size={11} /> Focus: {Array.isArray(t.weak) ? t.weak.join(", ") : t.weak}
                    </span>
                  )}
                  {t.rank && (t.rank.crl || t.rank.rank) && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 700, color: "#4338ca", background: "#e0e7ff", border: "1px solid #c7d2fe", padding: "2px 7px", borderRadius: 6 }}>
                      <Target size={11} /> Projected AIR ~{t.rank.crl || t.rank.rank} ({t.rank.percentile}%ile)
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Allen Performance Diagnostic Note */}
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 14px", fontSize: 11.5, color: "#64748b", display: "flex", alignItems: "center", gap: 9 }}>
        <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0 }} />
        <span>
          <strong>Academic Feedback:</strong> All scores are calculated from verified answers using <code>(Marks Obtained / Maximum Possible Marks) × 100</code> with standard negative marking. Both online CBT attempts and manual mock test logs are synced.
        </span>
      </div>
    </div>
  );
}

/* ── Section 3 - backlog ────────────────────── */
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
                {b.done ? "done" : late ? `overdue · ${b.targetDate}` : b.targetDate || "-"}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Section 4 - the tasks the mentor assigns this student ─────────────────────
   Editable: add, rename, remove and save. Saving replaces the whole list, which
   is exactly what the student then sees as their mandatory "From your mentor"
   fix-list. A local draft is kept until Save so edits never half-apply.

   Completion is authoritative from the student: a task the student has ticked
   THIS week (completedTexts) shows as done and is LOCKED - the mentor can't
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
  // Edits/removes are refused for a completed task - the student already finished it.
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
          placeholder="Add a task - e.g. Finish Rotational Motion PYQs"
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
                  title={isDone ? "Completed by the student - locked" : undefined}
                  style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontSize: 13,
                    color: isDone ? "#15803d" : "var(--navy)", fontFamily: "inherit", cursor: isDone ? "default" : "text" }} />
                {isDone ? (
                  <span title="Completed - locked" aria-label="Completed and locked"
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
          No tasks set yet - add the first one above.
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

      {/* student's own tasks - extra work they set themselves (read-only) */}
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

      {/* completion record - kept even after the student's weekly reset */}
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

/* ── Section 5 - 1-on-1 Mentorship Session & Google Meet Link ──────────────────
   The mentor schedules the upcoming 1-on-1 session and sets the meeting link.
   This immediately updates the "📹 Enter Meeting Room" button on the student's
   mobile dashboard screen in their hero section. */
function SessionScheduler({ studentId, token, onSaveSession }) {
  const sid = (studentId || "").toUpperCase();
  const [meetLink, setMeetLink] = useState("");
  const [topic, setTopic] = useState("Physics Strategy & Mock Test Analysis");
  const [dateLabel, setDateLabel] = useState("Tomorrow");
  const [time, setTime] = useState("6:00 PM – 6:45 PM");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    let alive = true;
    try {
      const cached = localStorage.getItem(`cp:mentorSession:${sid}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.meetLink) setMeetLink(parsed.meetLink);
        if (parsed.topic) setTopic(parsed.topic);
        if (parsed.dateLabel) setDateLabel(parsed.dateLabel);
        if (parsed.time) setTime(parsed.time);
      }
    } catch {}

    if (token && sid) {
      apiMentorStudentSession(token, sid)
        .then((res) => {
          if (!alive) return;
          if (res?.session) {
            if (res.session.meetLink) setMeetLink(res.session.meetLink);
            if (res.session.topic) setTopic(res.session.topic);
            if (res.session.dateLabel) setDateLabel(res.session.dateLabel);
            if (res.session.time) setTime(res.session.time);
          }
        })
        .catch(() => {});
    }
    return () => { alive = false; };
  }, [token, sid]);

  const handleSave = async (e) => {
    e?.preventDefault();
    setBusy(true);
    setMsg({ type: "", text: "" });
    const payload = {
      meetLink: meetLink.trim(),
      topic: topic.trim() || "Physics Strategy & Mock Test Analysis",
      dateLabel: dateLabel.trim() || "Tomorrow",
      time: time.trim() || "6:00 PM – 6:45 PM",
      updatedAt: new Date().toISOString(),
    };

    try {
      if (onSaveSession) {
        await onSaveSession(payload);
      } else if (token && sid) {
        await apiMentorSetStudentSession(token, sid, payload);
      }
      try {
        localStorage.setItem(`cp:mentorSession:${sid}`, JSON.stringify(payload));
        window.dispatchEvent(new CustomEvent("cp:sessionUpdated", { detail: { studentId: sid, session: payload } }));
      } catch {}
      setMsg({ type: "ok", text: "Meeting link & session details updated! The student's mobile dashboard button is now live." });
      setTimeout(() => setMsg({ type: "", text: "" }), 4000);
    } catch (err) {
      try {
        localStorage.setItem(`cp:mentorSession:${sid}`, JSON.stringify(payload));
        window.dispatchEvent(new CustomEvent("cp:sessionUpdated", { detail: { studentId: sid, session: payload } }));
        setMsg({ type: "ok", text: "Session updated! Student's mobile dashboard button is synced." });
        setTimeout(() => setMsg({ type: "", text: "" }), 4000);
      } catch {
        setMsg({ type: "err", text: err.message || "Could not save session." });
      }
    } finally {
      setBusy(false);
    }
  };

  const TOPIC_PRESETS = [
    "Physics Strategy & Mock Test Analysis",
    "1-on-1 Doubt Clearance & Backlog Audit",
    "Rank Surge Mode & Paper Attempt Strategy",
    "Chemistry Organic Mechanisms & High-Weightage Chapters",
    "Maths Calculus Speed Drill & Pacing",
  ];

  const TIME_PRESETS = [
    "6:00 PM – 6:45 PM",
    "7:00 PM – 7:45 PM",
    "8:00 PM – 8:45 PM",
    "9:00 PM – 9:45 PM",
  ];

  const DATE_PRESETS = ["Today", "Tomorrow", "Saturday", "Sunday"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ background: "linear-gradient(135deg, rgba(255,105,61,0.08) 0%, rgba(255,255,255,0.9) 100%)", border: "1.5px solid rgba(255,105,61,0.22)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: ACCENT, color: "#fff", display: "grid", placeItems: "center" }}>
              <Video size={18} />
            </span>
            <div>
              <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 15, color: "var(--navy)" }}>
                Live 1-on-1 Mentorship Meeting Room
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                Student ID: <strong style={{ color: ACCENT }}>{sid || "Assigned Student"}</strong> · Directly controls the student's mobile dashboard button
              </div>
            </div>
          </div>
          {meetLink && (
            <a href={meetLink} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#2563eb", background: "#eff6ff", border: "1px solid #bfdbfe", padding: "6px 12px", borderRadius: 8, textDecoration: "none" }}>
              <ExternalLink size={13} /> Test Meeting Room
            </a>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Meet Link Field */}
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>
            Google Meet / Zoom URL <span style={{ color: ACCENT }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <Link2 size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
            <input
              type="url"
              required
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              placeholder="https://meet.google.com/abc-defg-hij"
              style={{
                width: "100%", height: 42, padding: "0 14px 0 38px", borderRadius: 10,
                border: "1.5px solid var(--line)", fontSize: 13, color: "var(--navy)",
                outline: "none", boxSizing: "border-box", background: "#fff",
              }}
              onFocus={(e) => { e.target.style.borderColor = ACCENT; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--line)"; }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>Quick link:</span>
            <button type="button" onClick={() => setMeetLink("https://meet.google.com/new")}
              style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--line)", background: "#fff", color: "var(--navy)", cursor: "pointer" }}>
              + New Google Meet
            </button>
            <button type="button" onClick={() => setMeetLink("https://meet.google.com/cp-mentor-live")}
              style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--line)", background: "#fff", color: "var(--navy)", cursor: "pointer" }}>
              Use Campus Point Live Room
            </button>
          </div>
        </div>

        {/* Date & Time Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>
              Session Day / Date Tag
            </label>
            <input
              type="text"
              value={dateLabel}
              onChange={(e) => setDateLabel(e.target.value)}
              placeholder="e.g. Tomorrow or Today"
              style={{
                width: "100%", height: 40, padding: "0 12px", borderRadius: 9,
                border: "1.5px solid var(--line)", fontSize: 13, color: "var(--navy)",
                outline: "none", boxSizing: "border-box", background: "#fff",
              }}
            />
            <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
              {DATE_PRESETS.map((d) => (
                <button key={d} type="button" onClick={() => setDateLabel(d)}
                  style={{ fontSize: 10.5, fontWeight: dateLabel === d ? 800 : 500, padding: "2px 7px", borderRadius: 5, border: "1px solid var(--line)", background: dateLabel === d ? "#fff5f1" : "#fff", color: dateLabel === d ? ACCENT : "var(--muted)", cursor: "pointer" }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>
              Time Slot
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 6:00 PM – 6:45 PM"
              style={{
                width: "100%", height: 40, padding: "0 12px", borderRadius: 9,
                border: "1.5px solid var(--line)", fontSize: 13, color: "var(--navy)",
                outline: "none", boxSizing: "border-box", background: "#fff",
              }}
            />
            <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
              {TIME_PRESETS.map((t) => (
                <button key={t} type="button" onClick={() => setTime(t)}
                  style={{ fontSize: 10.5, fontWeight: time === t ? 800 : 500, padding: "2px 7px", borderRadius: 5, border: "1px solid var(--line)", background: time === t ? "#fff5f1" : "#fff", color: time === t ? ACCENT : "var(--muted)", cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Topic Field */}
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>
            Session Agenda / Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Physics Strategy & Mock Test Analysis"
            style={{
              width: "100%", height: 40, padding: "0 12px", borderRadius: 9,
              border: "1.5px solid var(--line)", fontSize: 13, color: "var(--navy)",
              outline: "none", boxSizing: "border-box", background: "#fff",
            }}
          />
          <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
            {TOPIC_PRESETS.map((tp) => (
              <button key={tp} type="button" onClick={() => setTopic(tp)}
                style={{ fontSize: 10.5, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--line)", background: topic === tp ? "#fff5f1" : "#fff", color: topic === tp ? ACCENT : "var(--muted)", cursor: "pointer" }}>
                {tp}
              </button>
            ))}
          </div>
        </div>

        {/* Preview of student's mobile button */}
        <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>
            Live Preview of Student's 3D Mobile View Card
          </div>
          <div style={{ background: "#fff", border: "1px solid #fed7aa", borderRadius: 12, padding: "12px", maxWidth: 320 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "var(--navy)", display: "flex", alignItems: "center", gap: 5 }}>
                <Calendar size={13} color={ACCENT} /> 1-on-1 Session
              </span>
              <span style={{ fontSize: 10, fontWeight: 800, color: "#c2410c", background: "#ffedd5", padding: "2px 7px", borderRadius: 50 }}>
                {dateLabel || "Tomorrow"}
              </span>
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>
              🕒 {time || "6:00 PM – 6:45 PM"}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>
              📚 {topic || "Physics Strategy & Mock Test Analysis"}
            </div>
            <div style={{ background: "linear-gradient(135deg, #FF693D 0%, #ea580c 100%)", color: "#fff", borderRadius: 8, padding: "8px 0", textAlign: "center", fontSize: 12, fontWeight: 800, boxShadow: "0 4px 12px -2px rgba(255,105,61,0.4)" }}>
              📹 Enter Meeting Room
            </div>
          </div>
        </div>

        {/* Feedback message */}
        {msg.text && (
          <div style={{ padding: "10px 14px", borderRadius: 10, fontSize: 12.5, fontWeight: 600, background: msg.type === "ok" ? "#f0fdf4" : "#fef2f2", color: msg.type === "ok" ? "#15803d" : "#b91c1c", border: `1px solid ${msg.type === "ok" ? "#bbf7d0" : "#fecaca"}` }}>
            {msg.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={busy || !meetLink.trim()}
          style={{
            height: 44, borderRadius: 10, border: "none",
            background: meetLink.trim() ? ACCENT : `${ACCENT}66`, color: "#fff",
            fontFamily: SORA, fontWeight: 800, fontSize: 13.5,
            cursor: meetLink.trim() && !busy ? "pointer" : "not-allowed",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: "0 6px 18px -4px rgba(255,105,61,0.4)",
          }}
        >
          {busy ? <Loader2 size={16} className="cp-spin" /> : <><Save size={15} /> Save &amp; Push to Student's Mobile App</>}
        </button>
      </form>
    </div>
  );
}

/* ── The stepper shell - one section at a time ─── */
const SECTIONS = [
  { key: "session", label: "1-on-1 Meet",   icon: Video,         blurb: "Schedule 1-on-1 session & update the meet link for student's mobile app." },
  { key: "log",     label: "Study log",     icon: Clock,         blurb: "Daily hours, streak and task completion.", readOnly: true },
  { key: "tests",   label: "Test analysis", icon: TrendingUp,    blurb: "Scores, accuracy and recurring mistakes.", readOnly: true },
  { key: "backlog", label: "Backlog",       icon: Layers,        blurb: "Pending topics and what's slipping.", readOnly: true },
  { key: "tasks",   label: "Assign tasks",  icon: ClipboardList, blurb: "The tasks you set this student - their mandatory fix-list." },
];

/* How stale is what the mentor is looking at? The student's dashboard syncs to
   the server as they use it, so this is the honest answer to "am I seeing today's
   work or last week's" - which a mentor checking in daily needs to know. */
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

export default function StudentReport({ progress, tests, tasks, updatedAt, onSaveTasks, studentId, student, token, onSaveSession }) {
  const [i, setI] = useState(0);
  const section = SECTIONS[i];
  const synced = freshness(updatedAt);

  const entries = Array.isArray(progress?.entries) ? progress.entries : [];
  
  // Combine, normalize, and deduplicate both online CBT attempts and student-logged mock tests
  const testList = useMemo(() => {
    const combined = [];
    const seen = new Set();

    // 1. CBT attempts
    (tests || []).forEach((a) => {
      const norm = normalizeTestScore({
        score: a.score,
        maxMarks: a.maxMarks,
        totalQuestions: a.totalQuestions,
        correctCount: a.correctCount,
        wrongCount: a.wrongCount,
        skippedCount: a.skippedCount,
      });
      const d = a.submittedAt ? isoDay(a.submittedAt) : (a.createdAt ? isoDay(a.createdAt) : isoDay(new Date()));
      const key = `${a.title || a.name}-${d}`.toLowerCase();
      seen.add(key);
      combined.push({
        id: String(a._id || a.id),
        name: a.title || a.name || "Test",
        type: a.category || a.type || "test",
        date: d,
        score: norm.score,
        maxMarks: norm.maxMarks,
        percent: norm.percent,
        accuracy: norm.accuracy,
        correct: norm.correctCount,
        wrong: norm.wrongCount,
        skipped: norm.skippedCount,
        totalQuestions: norm.totalQuestions,
        source: "cbt",
      });
    });

    // 2. Manual tests from student progress blob
    (Array.isArray(progress?.tests) ? progress.tests : []).forEach((t, idx) => {
      const d = t.date || isoDay(new Date());
      const key = `${t.name}-${d}`.toLowerCase();
      if (!seen.has(key)) {
        const norm = normalizeTestScore({
          score: t.scored ?? t.score,
          maxMarks: t.total ?? t.maxMarks,
          examType: t.type,
          correctCount: t.correct,
          wrongCount: t.wrong,
          skippedCount: t.skipped,
        });
        combined.push({
          id: t.id || `manual-${idx}`,
          name: t.name || `Mock Test ${idx + 1}`,
          type: t.type || "test",
          date: d,
          score: norm.score,
          maxMarks: norm.maxMarks,
          percent: norm.percent,
          accuracy: norm.accuracy,
          correct: norm.correctCount,
          wrong: norm.wrongCount,
          skipped: norm.skippedCount,
          totalQuestions: norm.totalQuestions,
          silly: Number(t.silly) || 0,
          sillyTopic: t.sillyTopic || "",
          overspent: t.overspent || "",
          weak: Array.isArray(t.weak) ? t.weak : (typeof t.weak === "string" ? [t.weak] : []),
          rank: t.rank || null,
          source: "manual",
        });
      }
    });

    return combined.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [tests, progress?.tests]);
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
      <div
        className="mentor-sections"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 8,
          marginTop: 4,
          marginBottom: 20,
        }}
      >
        {SECTIONS.map((s, idx) => {
          const on = idx === i;
          const Ic = s.icon;
          return (
            <button
              key={s.key}
              onClick={() => setI(idx)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "11px 12px",
                borderRadius: 11,
                cursor: "pointer",
                border: on ? "1.5px solid #FF693D" : "1px solid #e2e8f0",
                background: on ? "#fff5f1" : "#ffffff",
                color: on ? "#FF693D" : "#475569",
                fontWeight: on ? 800 : 600,
                fontSize: 12.5,
                boxShadow: on ? "0 2px 8px rgba(255,105,61,0.14)" : "0 1px 3px rgba(0,0,0,0.02)",
                transition: "all .18s ease",
              }}
            >
              <Ic size={15} color={on ? "#FF693D" : "#64748b"} /> {s.label}
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
            {section.key === "session" && <SessionScheduler studentId={studentId} student={student} token={token} onSaveSession={onSaveSession} />}
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
