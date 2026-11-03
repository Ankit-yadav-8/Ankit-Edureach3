import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Send, Users, User, CheckCircle2, AlertCircle,
  Sparkles, RefreshCw, Eye, EyeOff, Search, Check,
  BookOpen, Calendar, Target, Flame, ShieldAlert,
} from "lucide-react";
import { apiMentorSendEmail } from "../../auth/api.js";

const ACCENT = "#FF693D";
const SORA = "Sora, system-ui, sans-serif";

const CATEGORIES = [
  "General Guidance",
  "Test Feedback & Analysis",
  "1-on-1 Meeting Update",
  "Backlog & Study Streak",
  "Urgent Notice",
  "Motivation & Consistency",
];

const TEMPLATES = [
  {
    title: "Mock Test Strategy",
    icon: Target,
    category: "Test Feedback & Analysis",
    subject: "Action Plan: Analyzing your recent mock test & next steps",
    message:
`I reviewed your recent mock test performance on the dashboard. Here are three key priorities for this week:

1. Error Notebook: Categorise your incorrect questions into silly mistakes, conceptual gaps, and time pressure.
2. Speed vs Accuracy: Do not attempt questions in panic during the final 30 minutes; focus on 85%+ accuracy on your strong chapters.
3. Chemistry & Physics Revisions: Dedicate at least 1.5 hours daily to revamping high-weightage formulas and reaction mechanisms.

Make sure to log your progress daily on the dashboard. We will review your improved test target in our upcoming 1-on-1 session.`,
  },
  {
    title: "1-on-1 Meeting Link",
    icon: Calendar,
    category: "1-on-1 Meeting Update",
    subject: "Schedule confirmation for our upcoming 1-on-1 mentorship call",
    message:
`Our next 1-on-1 mentorship session is scheduled. Please ensure you are ready with:

1. Your current chapter backlog list.
2. The specific questions or concepts from this week's mock test that gave you trouble.
3. Your daily hours tracking updated on the dashboard.

Click the 'Enter Meeting Room' button on your dashboard hero section at the scheduled time. Let's make this session count!`,
  },
  {
    title: "Study Consistency Check",
    icon: Flame,
    category: "Backlog & Study Streak",
    subject: "Important check-in: Maintaining your daily study consistency",
    message:
`A quick check-in on your daily study routine. Consistency in competitive exams like JEE & NEET matters far more than sporadic all-nighters.

Please update your study hours and tasks on the dashboard before going to bed tonight. Your parents receive the complete daily summary every morning between 10:00 AM – 10:30 AM IST, so keeping your log updated ensures they see your real hard work.

If you are feeling overwhelmed or stuck on any chapter, reach out on the community or bring it up in our 1-on-1 call!`,
  },
  {
    title: "Urgent Batch Notice",
    icon: ShieldAlert,
    category: "Urgent Notice",
    subject: "Important update regarding your weekly fix-list deadline",
    message:
`Please note that the deadline to finish this week's assigned mentor tasks is approaching.

Open your Mentorship Dashboard and check the 'From your mentor' task checklist. Complete and tick off each item so it rolls up positively into your weekly progress booklet sent on Sunday.

Stay focused and keep pushing!`,
  },
];

export default function MentorEmailStudio({
  token,
  mentor,
  students = [],
  preselectedStudentId = "",
  onSent,
}) {
  const [recipientType, setRecipientType] = useState("all"); // "all" | "selected"
  const [selectedIds, setSelectedIds] = useState(() =>
    preselectedStudentId ? [preselectedStudentId] : []
  );
  const [searchStudent, setSearchStudent] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [includeParent, setIncludeParent] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successResult, setSuccessResult] = useState(null);

  // If preselectedStudentId changes, adjust recipient selection
  useEffect(() => {
    if (preselectedStudentId) {
      setRecipientType("selected");
      setSelectedIds((prev) =>
        prev.includes(preselectedStudentId) ? prev : [...prev, preselectedStudentId]
      );
    }
  }, [preselectedStudentId]);

  // Filter students for picker
  const filteredStudents = useMemo(() => {
    if (!searchStudent.trim()) return students;
    const q = searchStudent.toLowerCase().trim();
    return students.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.studentId?.toLowerCase().includes(q) ||
        s.plan?.toLowerCase().includes(q)
    );
  }, [students, searchStudent]);

  // Compute final targeted student list
  const targetedStudents = useMemo(() => {
    if (recipientType === "all") return students;
    return students.filter((s) => selectedIds.includes(s.studentId));
  }, [recipientType, selectedIds, students]);

  const toggleStudentSelection = (sid) => {
    setSelectedIds((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]
    );
  };

  const selectAllFiltered = () => {
    const allIds = Array.from(new Set([...selectedIds, ...filteredStudents.map((s) => s.studentId)]));
    setSelectedIds(allIds);
  };

  const deselectAllFiltered = () => {
    const filteredIdSet = new Set(filteredStudents.map((s) => s.studentId));
    setSelectedIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
  };

  const applyTemplate = (tpl) => {
    setCategory(tpl.category);
    setSubject(tpl.subject);
    setMessage(tpl.message);
    setErrorMsg("");
  };

  const clearForm = () => {
    setSubject("");
    setMessage("");
    setErrorMsg("");
    setSuccessResult(null);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!token) return;
    setErrorMsg("");
    setSuccessResult(null);

    const cleanSub = subject.trim();
    const cleanMsg = message.trim();

    if (!cleanSub) {
      setErrorMsg("Please enter an email subject line.");
      return;
    }
    if (!cleanMsg) {
      setErrorMsg("Please write the email message body.");
      return;
    }
    if (recipientType === "selected" && selectedIds.length === 0) {
      setErrorMsg("Please select at least one student to email.");
      return;
    }
    if (students.length === 0) {
      setErrorMsg("You have no allotted students to send an email to.");
      return;
    }

    setSending(true);
    try {
      const res = await apiMentorSendEmail(token, {
        recipientType,
        studentIds: recipientType === "selected" ? selectedIds : [],
        subject: cleanSub,
        message: cleanMsg,
        includeParent,
        category,
      });

      setSuccessResult({
        sentCount: res.sentCount,
        totalRequested: res.totalRequested,
        recipients: res.recipients || [],
        subject: cleanSub,
      });

      if (onSent) onSent(res);
    } catch (err) {
      setErrorMsg(err.message || "Failed to send email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const mentorName = mentor?.name || "Mentor";
  const mentorCollege = mentor?.college || "Senior IITian/NEET Mentor";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* ── TOP BANNER ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#fff",
          borderRadius: 16,
          padding: "20px 24px",
          boxShadow: "0 6px 20px rgba(15,23,42,0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(255,105,61,0.2)",
              border: "1.5px solid rgba(255,105,61,0.4)",
              display: "grid",
              placeItems: "center",
              color: ACCENT,
              flexShrink: 0,
            }}
          >
            <Mail size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h2 style={{ fontFamily: SORA, fontSize: 18, fontWeight: 800, margin: 0, color: "#fff" }}>
                Mentee Email &amp; Announcement Studio
              </h2>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  background: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  padding: "2px 8px",
                  borderRadius: 20,
                  color: "#cbd5e1",
                  letterSpacing: "0.5px",
                }}
              >
                DIRECT DISPATCH
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: "#94a3b8", margin: "4px 0 0", lineHeight: 1.4 }}>
              Send official email notifications, mock test strategies, or schedules directly to your allotted students.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 10,
              padding: "7px 12px",
              textAlign: "right",
            }}
          >
            <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
              Sender Identity
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: "#fff" }}>
              {mentorName} <span style={{ fontSize: 11, color: "#cbd5e1", fontWeight: 600 }}>({mentorCollege})</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SUCCESS BANNER ── */}
      <AnimatePresence>
        {successResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: "#f0fdf4",
              border: "1.5px solid #86efac",
              borderRadius: 14,
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#dcfce7",
                  color: "#16a34a",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={20} />
              </span>
              <div>
                <div style={{ fontFamily: SORA, fontWeight: 800, fontSize: 14.5, color: "#166534" }}>
                  Email Dispatched Successfully!
                </div>
                <div style={{ fontSize: 12.5, color: "#15803d", marginTop: 2 }}>
                  Sent <b>{successResult.sentCount}</b> email(s) for &ldquo;{successResult.subject}&rdquo;
                  {includeParent && " (with parent copy included)"}.
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessResult(null);
                setSubject("");
                setMessage("");
              }}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid #bbf7d0",
                background: "#fff",
                color: "#166534",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Compose Another Message
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ERROR BANNER ── */}
      {errorMsg && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: 12,
            padding: "12px 16px",
            fontSize: 13,
            color: "#b91c1c",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── MAIN WORKSPACE GRID ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: previewOpen ? "minmax(0, 1.15fr) minmax(0, 0.85fr)" : "1fr",
          gap: 18,
          alignItems: "start",
        }}
      >
        {/* Left: Compose Form */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            padding: "22px 24px",
            boxShadow: "0 2px 10px rgba(15,23,42,0.03)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* 1. Recipient Selector */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: SORA,
                fontSize: 12.5,
                fontWeight: 800,
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: 0.6,
                marginBottom: 8,
              }}
            >
              1. Choose Recipients
            </label>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              <button
                type="button"
                onClick={() => setRecipientType("all")}
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  border: recipientType === "all" ? `2px solid ${ACCENT}` : "1.5px solid #e2e8f0",
                  background: recipientType === "all" ? "#fff5f1" : "#f8fafc",
                  color: recipientType === "all" ? ACCENT : "#475569",
                  fontFamily: SORA,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  transition: "all 0.15s",
                }}
              >
                <Users size={16} /> All Allotted Mentees ({students.length})
              </button>

              <button
                type="button"
                onClick={() => setRecipientType("selected")}
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  border: recipientType === "selected" ? `2px solid ${ACCENT}` : "1.5px solid #e2e8f0",
                  background: recipientType === "selected" ? "#fff5f1" : "#f8fafc",
                  color: recipientType === "selected" ? ACCENT : "#475569",
                  fontFamily: SORA,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  transition: "all 0.15s",
                }}
              >
                <User size={16} /> Select Specific Students ({selectedIds.length} selected)
              </button>
            </div>

            {/* Individual Student Picker if "selected" */}
            {recipientType === "selected" && (
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                    <Search
                      size={14}
                      color="#94a3b8"
                      style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
                    />
                    <input
                      type="text"
                      placeholder="Search by student name or CP ID..."
                      value={searchStudent}
                      onChange={(e) => setSearchStudent(e.target.value)}
                      style={{
                        width: "100%",
                        height: 32,
                        paddingLeft: 30,
                        paddingRight: 10,
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                        fontSize: 12,
                        background: "#fff",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      type="button"
                      onClick={selectAllFiltered}
                      style={{
                        padding: "5px 10px",
                        borderRadius: 6,
                        border: "1px solid #cbd5e1",
                        background: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#334155",
                        cursor: "pointer",
                      }}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={deselectAllFiltered}
                      style={{
                        padding: "5px 10px",
                        borderRadius: 6,
                        border: "1px solid #cbd5e1",
                        background: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#64748b",
                        cursor: "pointer",
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Pill Grid */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 7,
                    maxHeight: 160,
                    overflowY: "auto",
                    padding: "2px",
                  }}
                >
                  {filteredStudents.length === 0 ? (
                    <div style={{ fontSize: 12, color: "#94a3b8", padding: "10px 4px" }}>
                      No matching students found.
                    </div>
                  ) : (
                    filteredStudents.map((s) => {
                      const checked = selectedIds.includes(s.studentId);
                      return (
                        <button
                          key={s.studentId}
                          type="button"
                          onClick={() => toggleStudentSelection(s.studentId)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "6px 12px",
                            borderRadius: 8,
                            border: checked ? `1.5px solid ${ACCENT}` : "1px solid #cbd5e1",
                            background: checked ? "#fff5f1" : "#fff",
                            color: checked ? ACCENT : "#334155",
                            fontWeight: checked ? 700 : 500,
                            fontSize: 12,
                            cursor: "pointer",
                            transition: "all 0.1s",
                          }}
                        >
                          <span
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: 4,
                              background: checked ? ACCENT : "#fff",
                              border: checked ? `1px solid ${ACCENT}` : "1.5px solid #94a3b8",
                              display: "grid",
                              placeItems: "center",
                              color: "#fff",
                              fontSize: 9,
                            }}
                          >
                            {checked && <Check size={10} strokeWidth={3} />}
                          </span>
                          <span>{s.name}</span>
                          <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace" }}>
                            ({s.studentId})
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>

                <div style={{ fontSize: 11.5, color: "#64748b", fontWeight: 600 }}>
                  Selected: <b>{selectedIds.length}</b> of {students.length} students
                </div>
              </div>
            )}
          </div>

          {/* 2. Quick Templates */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label
                style={{
                  fontFamily: SORA,
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: "#0f172a",
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                }}
              >
                2. Quick Starter Templates
              </label>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>1-click prefill</span>
            </div>

            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {TEMPLATES.map((tpl) => {
                const Icon = tpl.icon;
                return (
                  <button
                    key={tpl.title}
                    type="button"
                    onClick={() => applyTemplate(tpl)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 12px",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc",
                      color: "#334155",
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = ACCENT;
                      e.currentTarget.style.color = ACCENT;
                      e.currentTarget.style.background = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.color = "#334155";
                      e.currentTarget.style.background = "#f8fafc";
                    }}
                  >
                    <Icon size={13} color={ACCENT} />
                    <span>{tpl.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Category & Subject */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)", gap: 12 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: SORA,
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: 6,
                }}
              >
                Category Badge
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  height: 40,
                  borderRadius: 10,
                  border: "1.5px solid #cbd5e1",
                  padding: "0 10px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#0f172a",
                  background: "#fff",
                  outline: "none",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: SORA,
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: 6,
                }}
              >
                Email Subject Line *
              </label>
              <input
                type="text"
                placeholder="e.g. Action Plan: Physics Strategy & Target for this week"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: "100%",
                  height: 40,
                  borderRadius: 10,
                  border: "1.5px solid #cbd5e1",
                  padding: "0 12px",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#0f172a",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* 4. Message Body */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label
                style={{
                  fontFamily: SORA,
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Message Body *
              </label>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                Blank lines become paragraphs · Links auto-link
              </span>
            </div>

            <textarea
              rows={8}
              placeholder="Write your guidance, instructions, or meeting notes here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "100%",
                borderRadius: 12,
                border: "1.5px solid #cbd5e1",
                padding: "12px 14px",
                fontSize: 13.5,
                lineHeight: 1.6,
                color: "#1e293b",
                fontFamily: "inherit",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* 5. Parent Copy Option */}
          <div
            style={{
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: 12,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={includeParent}
                onChange={(e) => setIncludeParent(e.target.checked)}
                style={{ width: 17, height: 17, accentColor: ACCENT, cursor: "pointer" }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#9a3412" }}>
                  Also send a copy to each student&apos;s registered parent email
                </div>
                <div style={{ fontSize: 11.5, color: "#c2410c" }}>
                  Keeps parents updated on your official recommendations &amp; session updates.
                </div>
              </div>
            </label>

            <button
              type="button"
              onClick={() => setPreviewOpen(!previewOpen)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid #fed7aa",
                background: "#fff",
                color: "#c2410c",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {previewOpen ? <EyeOff size={14} /> : <Eye size={14} />}
              {previewOpen ? "Hide Preview" : "Preview Email"}
            </button>
          </div>

          {/* 6. Action Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              borderTop: "1px solid #f1f5f9",
              paddingTop: 16,
            }}
          >
            <div style={{ fontSize: 12.5, color: "#64748b" }}>
              Targeting: <b style={{ color: "#0f172a" }}>{targetedStudents.length}</b> student{targetedStudents.length === 1 ? "" : "s"}
              {includeParent && " (+ parents)"}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={clearForm}
                disabled={sending}
                style={{
                  padding: "9px 16px",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  color: "#64748b",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleSend}
                disabled={sending || targetedStudents.length === 0}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 22px",
                  borderRadius: 10,
                  border: "none",
                  background: sending || targetedStudents.length === 0
                    ? "#cbd5e1"
                    : "linear-gradient(135deg, #FF693D 0%, #ea580c 100%)",
                  color: "#fff",
                  fontFamily: SORA,
                  fontWeight: 800,
                  fontSize: 13.5,
                  cursor: sending || targetedStudents.length === 0 ? "not-allowed" : "pointer",
                  boxShadow: sending || targetedStudents.length === 0 ? "none" : "0 4px 14px rgba(255,105,61,0.35)",
                }}
              >
                {sending ? (
                  <>
                    <RefreshCw size={15} className="cp-spin" />
                    Sending Emails...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send to {targetedStudents.length} Student{targetedStudents.length === 1 ? "" : "s"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Email Preview (if open) */}
        {previewOpen && (
          <div
            style={{
              background: "#f1f5f9",
              border: "1px solid #cbd5e1",
              borderRadius: 16,
              padding: "16px",
              boxShadow: "0 4px 14px rgba(15,23,42,0.04)",
              position: "sticky",
              top: 20,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: 0.6 }}>
                Live Email Client Preview
              </span>
              <button
                onClick={() => setPreviewOpen(false)}
                style={{ background: "transparent", border: "none", color: "#64748b", fontSize: 11, cursor: "pointer", fontWeight: 700 }}
              >
                Close
              </button>
            </div>

            {/* Email Card Mock */}
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
              }}
            >
              {/* Header */}
              <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: "#fff", color: ACCENT, fontWeight: 900, fontSize: 10, display: "grid", placeItems: "center" }}>
                    CP
                  </span>
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>Campus Point Mentorship</span>
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, color: "#ff8a65", background: "rgba(255,105,61,0.2)", padding: "2px 7px", borderRadius: 12, textTransform: "uppercase" }}>
                  {category}
                </span>
              </div>

              {/* Sender strip */}
              <div style={{ background: "#fff7ed", padding: "8px 18px", borderBottom: "1px solid #fed7aa", display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <div>
                  <span style={{ color: "#c2410c", fontWeight: 800 }}>From: </span>
                  <span style={{ color: "#0f172a", fontWeight: 700 }}>{mentorName}</span> ({mentorCollege})
                </div>
                <div style={{ color: "#64748b" }}>
                  To: {targetedStudents[0]?.name || "Student"}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "18px" }}>
                <h4 style={{ fontFamily: SORA, fontSize: 14.5, fontWeight: 800, color: "#0f172a", margin: "0 0 10px" }}>
                  {subject || "Subject line will appear here"}
                </h4>
                <div style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                  {message ? `Dear ${targetedStudents[0]?.name || "Student"},\n\n${message}` : "Message body preview..."}
                </div>

                <div style={{ textAlign: "center", margin: "18px 0 10px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: "linear-gradient(135deg, #FF693D 0%, #ea580c 100%)",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 800,
                      padding: "8px 18px",
                      borderRadius: 8,
                    }}
                  >
                    Open Mentorship Dashboard &rarr;
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div style={{ background: "#f8fafc", borderTop: "1px solid #f1f5f9", padding: "10px 16px", textAlign: "center", fontSize: 10, color: "#94a3b8" }}>
                Official Mentorship Communication · Campus Point
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

