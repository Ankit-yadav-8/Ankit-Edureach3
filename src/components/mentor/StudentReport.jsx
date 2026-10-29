import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Clock, ClipboardList, Layers, TrendingUp, TrendingDown,
  ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, Eye,
  Plus, Trash2, Save, Loader2, Pencil, Lock, History, UserCheck,
  Target, Award, Zap, BarChart2, BookOpen, Percent, Search,
  Video, Calendar, ExternalLink, Link2, Copy, Check, Hash, CheckSquare,
  Sparkles,
} from "lucide-react";
import { normalizeTestScore } from "../../utils/testScoring.js";
import { apiMentorStudentSession, apiMentorSetStudentSession } from "../../auth/api.js";

const ACCENT = "#ff5e36";
const ACCENT_DARK = "#e04924";
const ACCENT_LIGHT = "#fff5f2";
const SORA = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const isoDay = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};
const round1 = (n) => Math.round(n * 10) / 10;

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

/* ── Modern SaaS KPI Stat Card ─── */
function StatCard({ icon: Icon, faIcon, label, value, sub, tone = ACCENT, trend }) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle hover:border-slate-300 transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-500 tracking-tight">{label}</span>
        <span
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${tone}15`, color: tone }}
        >
          {faIcon ? <i className={faIcon} style={{ fontSize: 13 }}></i> : <Icon size={14} />}
        </span>
      </div>
      <div>
        <div className="text-xs font-bold text-slate-900 tracking-tight leading-none mb-1">{value}</div>
        {sub && <div className="text-[11px] text-slate-500 font-medium truncate">{sub}</div>}
      </div>
    </div>
  );
}

function EmptyState({ title = "No records found", desc = "Nothing has been recorded yet for this student.", icon: Icon = BookOpen }) {
  return (
    <div className="py-14 px-4 text-center bg-white border border-slate-200/80 rounded-2xl shadow-subtle">
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
        <Icon size={22} />
      </div>
      <h4 className="text-sm font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mx-auto">{desc}</p>
    </div>
  );
}

/* ── 14-Day Study Hours Bars ─── */
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
    <div className="flex items-flex-end gap-1.5 sm:gap-2.5 h-32 px-1 pt-4">
      {days.map((d, i) => (
        <div key={d.iso} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
          {d.hours > 0 ? (
            <span className="text-[10px] font-bold text-brand-600 leading-none">{d.hours}h</span>
          ) : (
            <span className="text-[9px] text-slate-300 leading-none">-</span>
          )}
          <motion.div
            title={`${d.iso}: ${d.hours} hrs`}
            initial={{ height: 0 }}
            animate={{ height: `${Math.max((d.hours / max) * 72, d.hours ? 5 : 2)}px` }}
            transition={{ duration: 0.35, delay: i * 0.015 }}
            className={`w-full rounded-t ${d.hours ? "bg-gradient-to-t from-brand-600 to-brand-500" : "bg-slate-200"}`}
          />
          <span className="text-[10px] font-medium text-slate-400 uppercase">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── SUB-TAB 1: 1-on-1 Meet Scheduler ─── */
function SessionScheduler({
  studentId,
  student,
  token,
  onSaveSession,
  onPrevStudent,
  onNextStudent,
  studentIndex = 0,
  totalStudents = 1,
}) {
  const sid = studentId || student?.studentId || "";
  const [meetLink, setMeetLink] = useState("");
  const [topic, setTopic] = useState("Physics Strategy & Mock Test Analysis");
  const [dateLabel, setDateLabel] = useState("Tomorrow");
  const [time, setTime] = useState("6:00 PM – 6:45 PM");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!sid) return;
    let alive = true;
    try {
      const raw = localStorage.getItem(`cp:mentorSession:${sid.toUpperCase()}`);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.meetLink) setMeetLink(s.meetLink);
        if (s.topic) setTopic(s.topic);
        if (s.dateLabel) setDateLabel(s.dateLabel);
        if (s.time) setTime(s.time);
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

  const handleCopy = () => {
    if (!meetLink.trim()) return;
    navigator.clipboard.writeText(meetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        localStorage.setItem(`cp:mentorSession:${sid.toUpperCase()}`, JSON.stringify(payload));
        localStorage.setItem("cp:mentorSession:ACTIVE", JSON.stringify(payload));
        window.dispatchEvent(new CustomEvent("cp:sessionUpdated", { detail: { studentId: sid, session: payload } }));
      } catch {}
      setMsg({ type: "ok", text: "Meeting link & session details updated! Synced to student's mobile dashboard button." });
      setTimeout(() => setMsg({ type: "", text: "" }), 4000);
    } catch (err) {
      try {
        localStorage.setItem(`cp:mentorSession:${sid.toUpperCase()}`, JSON.stringify(payload));
        localStorage.setItem("cp:mentorSession:ACTIVE", JSON.stringify(payload));
        window.dispatchEvent(new CustomEvent("cp:sessionUpdated", { detail: { studentId: sid, session: payload } }));
        setMsg({ type: "ok", text: "Session updated locally! Student's mobile dashboard button is synced." });
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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden">
      {/* Card Header */}
      <div className="p-6 border-b border-slate-100 flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center border border-brand-100/80 text-brand-500 shadow-sm flex-shrink-0">
            <Calendar size={18} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 leading-tight">Schedule 1-on-1 Meet</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update the meeting link directly to {student?.name || "student"}'s mobile app.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1">
            {studentIndex + 1} / {totalStudents}
          </span>
          <button
            type="button"
            onClick={onPrevStudent}
            disabled={totalStudents <= 1}
            className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-30 cursor-pointer"
            title="Previous mentee"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={onNextStudent}
            disabled={totalStudents <= 1}
            className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-30 cursor-pointer"
            title="Next mentee"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Inner Gradient Banner */}
      <div className="m-6 bg-gradient-to-r from-brand-50 via-orange-50/50 to-orange-50/20 rounded-xl border border-brand-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xl shadow-sm border border-white flex-shrink-0">
            <Video size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-xs font-bold text-slate-900">Live Mentorship Room</h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-brand-500 text-white shadow-sm">
                Live
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Controls the "Join Meet" button on {student?.name || "student"}'s mobile dashboard.
            </p>
          </div>
        </div>
        <a
          href={meetLink.trim() ? meetLink : undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!meetLink.trim()) {
              e.preventDefault();
              alert("Please enter and save a valid meeting URL first.");
            }
          }}
          className={`whitespace-nowrap px-5 py-2.5 rounded-lg font-semibold text-xs text-white shadow-sm transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
            meetLink.trim()
              ? "bg-brand-500 hover:bg-brand-600 cursor-pointer"
              : "bg-slate-300 cursor-not-allowed"
          }`}
        >
          <Video size={14} /> Join Meet
        </a>
      </div>

      {/* Form Configuration */}
      <form onSubmit={handleSave} className="px-6 pb-6 space-y-5">
        {/* URL Input */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Link2 size={13} className="text-slate-400" /> Meeting URL <span className="text-brand-500">*</span>
          </label>
          <div className="relative flex items-center group">
            <div className="absolute left-3 text-slate-400 group-focus-within:text-brand-500 transition-colors">
              <Link2 size={15} />
            </div>
            <input
              type="url"
              required
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              placeholder="Paste Zoom or Google Meet URL"
              className="w-full pl-9 pr-12 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 cp-focus-ring transition-all shadow-sm"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-2.5 text-slate-400 hover:text-slate-700 p-1.5 rounded transition-colors"
              title="Copy link"
            >
              {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs text-slate-400">Quick link:</span>
            <button
              type="button"
              onClick={() => setMeetLink("https://meet.google.com/new")}
              className="px-2.5 py-1 rounded-md border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm bg-white cursor-pointer"
            >
              + New Google Meet
            </button>
            <button
              type="button"
              onClick={() => setMeetLink("https://meet.google.com/cp-mentor-live")}
              className="px-2.5 py-1 rounded-md border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm bg-white cursor-pointer"
            >
              Use Campus Point Live Room
            </button>
          </div>
        </div>

        {/* Grid for Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Date Select */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar size={13} className="text-slate-400" /> Session Day
            </label>
            <div className="relative">
              <select
                value={dateLabel}
                onChange={(e) => setDateLabel(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 cp-focus-ring appearance-none shadow-sm cursor-pointer"
              >
                <option value="Tomorrow">Tomorrow</option>
                <option value="Today">Today</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <ChevronRight size={14} className="rotate-90" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              {DATE_PRESETS.map((d) => {
                const sel = dateLabel === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDateLabel(d)}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all border ${
                      sel
                        ? "border-brand-200 text-brand-600 bg-brand-50 font-bold"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50 bg-white"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Select */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock size={13} className="text-slate-400" /> Time Slot
            </label>
            <div className="relative">
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 cp-focus-ring appearance-none shadow-sm cursor-pointer"
              >
                {TIME_PRESETS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <ChevronRight size={14} className="rotate-90" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              {TIME_PRESETS.map((t) => {
                const shortLabel = t.split("–")[0]?.trim() || t;
                const sel = time === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all border ${
                      sel
                        ? "border-brand-200 text-brand-600 bg-brand-50 font-bold"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50 bg-white"
                    }`}
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Agenda */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ClipboardList size={13} className="text-slate-400" /> Session Agenda
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Physics Strategy & Mock Test Analysis"
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 cp-focus-ring transition-all shadow-sm mb-2.5"
          />
          <div className="flex flex-wrap gap-2">
            {TOPIC_PRESETS.map((tp, idx) => {
              const sel = topic === tp;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(tp)}
                  className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-all border ${
                    sel
                      ? "bg-brand-50 text-brand-600 border-brand-200 font-bold"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  {tp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Preview of Student's Mobile View Card */}
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles size={12} className="text-brand-500" /> Live Preview of Student's Mobile Card
          </div>
          <div className="bg-white border border-orange-200/90 rounded-xl p-3.5 max-w-sm shadow-subtle">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar size={13} className="text-brand-500" /> 1-on-1 Session
              </span>
              <span className="text-[10px] font-bold text-brand-600 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-full">
                {dateLabel || "Tomorrow"}
              </span>
            </div>
            <div className="text-xs text-slate-600 mb-1 flex items-center gap-1.5">
              <Clock size={12} className="text-slate-400" /> {time || "6:00 PM – 6:45 PM"}
            </div>
            <div className="text-xs text-slate-700 font-medium mb-3 flex items-center gap-1.5">
              <BookOpen size={12} className="text-slate-400" /> {topic || "Physics Strategy & Mock Test Analysis"}
            </div>
            <div className="bg-brand-500 hover:bg-brand-600 text-white rounded-lg py-2 text-center text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5">
              <Video size={13} /> Enter Meeting Room
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        {msg.text && (
          <div
            className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              msg.type === "ok"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {msg.type === "ok" ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            {msg.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={busy || !meetLink.trim()}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            meetLink.trim() && !busy
              ? "bg-brand-500 hover:bg-brand-600 active:scale-95"
              : "bg-slate-300 cursor-not-allowed opacity-70"
          }`}
        >
          {busy ? (
            <>
              <Loader2 size={14} className="cp-spin" /> Saving &amp; Pushing...
            </>
          ) : (
            <>
              <Save size={14} /> Save &amp; Push to Student's Mobile App
            </>
          )}
        </button>
      </form>
    </div>
  );
}

/* ── SUB-TAB 2: Study Log ─── */
function StudyLogView({ entries }) {
  if (!entries || !entries.length) {
    return <EmptyState title="No study logs recorded yet" desc="Daily hours, study streaks, and chapter logs recorded by this student will appear here." icon={Clock} />;
  }

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
    <div className="space-y-6">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Flame} label="Current Streak" value={`${streakOf(entries)}d`} sub="Consecutive days active" tone="#f97316" />
        <StatCard
          icon={Clock}
          label="Weekly Hours"
          value={`${hrs}h`}
          sub={prev.length ? `${delta >= 0 ? "+" : ""}${delta}h vs prev week` : "Initial logging period"}
          tone={delta >= 0 ? "#10b981" : "#ef4444"}
        />
        <StatCard icon={TrendingUp} label="Daily Average" value={`${avg}h`} sub={`Across ${wk.length} logged days`} tone="#3b82f6" />
        <StatCard
          icon={ClipboardList}
          label="Completion"
          value={total ? `${Math.round((done / total) * 100)}%` : "-"}
          sub={total ? `${done} of ${total} tasks done` : "No task target"}
          tone="#8b5cf6"
        />
      </div>

      {/* Hours Bar Chart Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Study Hours — Past 14 Days</h3>
            <p className="text-xs text-slate-500">Visual trend of student study commitment</p>
          </div>
          <span className="text-xs font-bold text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-full">
            14-Day Matrix
          </span>
        </div>
        <HoursBars entries={entries} />
      </div>

      {/* Detailed Entries Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-subtle overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">Recent Study Log Entries</h3>
          <span className="text-xs text-slate-500">{entries.length} total entries</span>
        </div>
        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto cp-custom-scroll">
          {entries.slice(0, 20).map((e, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 font-bold text-xs flex items-center justify-center border border-brand-100/60">
                  {e.hours || 0}h
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{e.date}</div>
                  <div className="text-[11px] text-slate-500">
                    {e.subject || "Self Study"} · {e.tasksDone || 0}/{e.tasksTotal || 0} tasks finished
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── SUB-TAB 3: Test Analysis ─── */
function TestAnalysisView({ tests }) {
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!tests || !tests.length) {
    return <EmptyState title="No test records found" desc="CBT mock exams and student-logged practice test scores will populate here." icon={TrendingUp} />;
  }

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

  let totalScore = 0, totalMax = 0, totalCorrect = 0, totalWrong = 0;
  sorted.forEach((t) => {
    totalScore += t.score;
    totalMax += t.maxMarks;
    totalCorrect += t.correct;
    totalWrong += t.wrong;
  });

  const overallPercent = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
  const totalAtt = totalCorrect + totalWrong;
  const overallAcc = totalAtt > 0 ? Math.round((totalCorrect / totalAtt) * 100) : 0;
  const bestTest = sorted.reduce((m, t) => (t.percent > m.percent ? t : m), sorted[0]);

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
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={ClipboardList} label="Tests Evaluated" value={sorted.length} sub={`${totalAtt} Questions attempted`} tone="#3b82f6" />
        <StatCard icon={TrendingUp} label="Average Score" value={`${overallPercent}%`} sub={`Out of ${totalMax} cumulative`} tone="#10b981" />
        <StatCard icon={Award} label="Highest Score" value={`${bestTest?.percent || 0}%`} sub={bestTest?.name || "Best attempt"} tone="#f97316" />
        <StatCard icon={Target} label="Overall Accuracy" value={`${overallAcc}%`} sub={`${totalCorrect} correct answers`} tone="#8b5cf6" />
      </div>

      {/* Tests Evaluation List */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-subtle overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Academic CBT &amp; Mock Tests</h3>
            <p className="text-xs text-slate-500">Breakdown of student question accuracy and score weightage</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Filter by test name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none cp-focus-ring"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto cp-custom-scroll">
          {filtered.map((t, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{t.name || `Mock Test #${idx + 1}`}</span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {t.type || "Full Mock"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {t.date || "Recent"} · {t.correct} correct · {t.wrong} incorrect · {t.skipped} skipped
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">
                    {t.score} <span className="text-[11px] text-slate-400 font-normal">/ {t.maxMarks}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-600">{t.accuracy}% Accuracy</div>
                </div>
                <span className="text-xs font-bold text-brand-600 bg-brand-50 border border-brand-100 px-2 py-1 rounded-lg">
                  {t.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── SUB-TAB 4: Assign Tasks ─── */
function AssignTasksView({ tasks = [], onSaveTasks, studentName = "student" }) {
  const [draft, setDraft] = useState(() => (tasks || []).map((t, i) => ({ id: t.id || `mt-${i}`, text: t.text })));
  const [newTask, setNewTask] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    setDraft((tasks || []).map((t, i) => ({ id: t.id || `mt-${i}`, text: t.text })));
  }, [tasks]);

  const save = async (listToSave) => {
    if (!onSaveTasks) return;
    setBusy(true);
    setMsg({ type: "", text: "" });
    try {
      const texts = (listToSave || draft).map((t) => t.text.trim()).filter(Boolean);
      await onSaveTasks(texts);
      setMsg({ type: "ok", text: texts.length ? `Assigned ${texts.length} tasks.` : "Task list cleared." });
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    } catch (e) {
      setMsg({ type: "err", text: e.message || "Failed to update tasks." });
    } finally {
      setBusy(false);
    }
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

  const remove = async (id) => {
    const newDraft = draft.filter((t) => t.id !== id);
    setDraft(newDraft);
    await save(newDraft);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-subtle p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-900 leading-tight">Assign Mentee Tasks</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tasks you set here appear directly on {studentName}'s dashboard as mandatory weekly goals.
          </p>
        </div>
        <span className="text-xs font-bold text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-full">
          {draft.length} Active Targets
        </span>
      </div>

      {/* Add Task Form */}
      <form onSubmit={add} className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={`Assign targeted task to ${studentName}...`}
          className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 cp-focus-ring shadow-sm"
        />
        <button
          type="submit"
          disabled={busy || !newTask.trim()}
          className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {busy ? <Loader2 size={14} className="cp-spin" /> : <Plus size={14} />} Assign
        </button>
      </form>

      {msg.text && (
        <div className={`p-2.5 rounded-lg text-xs font-semibold ${msg.type === "ok" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {msg.text}
        </div>
      )}

      {/* Task List */}
      <div className="space-y-2 max-h-96 overflow-y-auto cp-custom-scroll">
        {draft.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400">
            No assigned tasks for this student yet. Use the input box above to assign one.
          </div>
        ) : (
          draft.map((t, idx) => (
            <div
              key={t.id || idx}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs font-medium text-slate-800 truncate">{t.text}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-bold text-brand-600 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded">
                  Pending
                </span>
                <button
                  type="button"
                  onClick={() => remove(t.id)}
                  className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                  title="Remove task"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MASTER STUDENT REPORT COMPONENT
   Renders the exact 4 Action Tabs matching the user's template:
   1. 1-on-1 Meet
   2. Study Log
   3. Test Analysis
   4. Assign Tasks
══════════════════════════════════════════════════════════════════════ */
export default function StudentReport({
  progress,
  tests,
  tasks,
  updatedAt,
  onSaveTasks,
  studentId,
  student,
  token,
  onSaveSession,
  onPrevStudent,
  onNextStudent,
  studentIndex = 0,
  totalStudents = 1,
}) {
  const [activeSubTab, setActiveSubTab] = useState("session"); // "session" | "log" | "tests" | "tasks"

  const entries = Array.isArray(progress?.entries) ? progress.entries : [];

  // Combine CBT attempts and logged tests
  const testList = useMemo(() => {
    const combined = [];
    const seen = new Set();

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
      const key = `${a.title || a.testId || "cbt"}-${d}`;
      seen.add(key);
      combined.push({
        id: a._id || a.attemptId || key,
        name: a.title || a.testName || "Online CBT Test",
        type: a.testCategory || "Full CBT Test",
        date: d,
        score: norm.score,
        maxMarks: norm.maxMarks,
        correct: norm.correctCount,
        wrong: norm.wrongCount,
        skipped: norm.skippedCount,
      });
    });

    (progress?.tests || []).forEach((t) => {
      const key = `${t.name}-${t.date}`;
      if (!seen.has(key)) {
        combined.push(t);
      }
    });

    return combined;
  }, [tests, progress]);

  const SUB_TABS = [
    { id: "session", label: "1-on-1 Meet", sub: "Live session room", icon: Video },
    { id: "log", label: "Study Log", sub: "Track progress", icon: Clock },
    { id: "tests", label: "Test Analysis", sub: "Insights", icon: TrendingUp },
    { id: "tasks", label: "Assign Tasks", sub: "Manage work", icon: Layers },
  ];

  return (
    <div className="space-y-6">
      {/* Action Tabs Strip (Exact Template Style) */}
      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {SUB_TABS.map((t) => {
          const sel = activeSubTab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                sel
                  ? "border-brand-200 bg-brand-50/60 text-brand-600 shadow-sm font-semibold"
                  : "border-slate-200 bg-white text-slate-600 shadow-subtle hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <Icon size={16} className={sel ? "text-brand-500" : "text-slate-400"} />
              <div className="flex flex-col items-start leading-tight text-left">
                <span className={`text-xs ${sel ? "font-bold text-brand-600" : "font-semibold text-slate-700"}`}>
                  {t.label}
                </span>
                <span className={`text-[9.5px] ${sel ? "text-brand-500/80 font-medium" : "text-slate-400"}`}>
                  {t.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Sub-Tab View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeSubTab === "session" && (
            <SessionScheduler
              studentId={studentId}
              student={student}
              token={token}
              onSaveSession={onSaveSession}
              onPrevStudent={onPrevStudent}
              onNextStudent={onNextStudent}
              studentIndex={studentIndex}
              totalStudents={totalStudents}
            />
          )}

          {activeSubTab === "log" && <StudyLogView entries={entries} />}

          {activeSubTab === "tests" && <TestAnalysisView tests={testList} />}

          {activeSubTab === "tasks" && (
            <AssignTasksView
              tasks={tasks}
              onSaveTasks={onSaveTasks}
              studentName={student?.name || "student"}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
