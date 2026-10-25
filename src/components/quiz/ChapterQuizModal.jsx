// ─────────────────────────────────────────────────────────────────────────────
// ChapterQuizModal.jsx — Interactive Quiz Maker & CBT Player
// Supports Units and Measurements (47 Verified JEE Questions)
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Zap, Sparkles, CheckCircle2, XCircle, Clock, Award,
  ChevronRight, ChevronLeft, RotateCcw, FileText, Check,
  AlertCircle, HelpCircle, Layers, Sliders, Play, Share2,
  BookOpen, Eye, ArrowRight
} from "lucide-react";
import MathText from "../mentorship/MathText.jsx";
import localQuestions from "../../data/unitsAndMeasurementsQuestions.json";

const DIFFICULTIES = [
  {
    key: "easy",
    label: "Easy Level",
    badge: "Foundation",
    desc: "Easy + some Medium questions for solid basics",
    color: "#10B981",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    ratio: "Easy + Medium blend",
  },
  {
    key: "moderate",
    label: "Moderate Level",
    badge: "JEE Standard",
    desc: "40% Easy, 40% Moderate, 20% Hard questions",
    color: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
    ratio: "40% Easy · 40% Med · 20% Hard",
  },
  {
    key: "difficult",
    label: "Difficult Level",
    badge: "Advanced Challenge",
    desc: "60% Moderate, 40% Hard questions",
    color: "#EF4444",
    bg: "#FEF2F2",
    border: "#FECACA",
    ratio: "60% Moderate · 40% Hard",
  },
];

const QUESTION_COUNTS = [5, 10, 15];

// ── Match List Question Parser ───────────────────────────────────────────────
function parseMatchListQuestion(statement) {
  if (!statement) return null;
  const isMatch = /Match\s+(?:the\s+)?(?:following\s+columns|List\s*[-–]?\s*I\s+with\s+List\s*[-–]?\s*II)/i.test(statement);
  if (!isMatch) return null;

  // Case 1: Formatted Markdown Table
  if (statement.includes("| List - I | List - II |") || (statement.includes("|") && statement.includes("List - I"))) {
    const lines = statement.split("\n").map((l) => l.trim()).filter(Boolean);
    const tableRows = lines.filter((l) => l.startsWith("|") && !l.includes(":---") && !l.includes("List - I | List - II"));

    if (tableRows.length >= 4) {
      const itemsI = [];
      const itemsII = [];
      tableRows.forEach((row) => {
        const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
        if (cells.length >= 2) {
          const m1 = cells[0].match(/^(?:\*\*\(([A-D])\)\*\*|\(([A-D])\))\s*([\s\S]+)$/);
          const letter = m1 ? (m1[1] || m1[2]) : "";
          const text1 = m1 ? m1[3].trim() : cells[0];

          const m2 = cells[1].match(/^(?:\*\*\(([IVX]+)\)\*\*|\(([IVX]+)\))\s*([\s\S]+)$/);
          const roman = m2 ? (m2[1] || m2[2]) : "";
          const text2 = m2 ? m2[3].trim() : cells[1];

          itemsI.push({ label: letter || String.fromCharCode(65 + itemsI.length), text: text1 });
          itemsII.push({ label: roman || ["I", "II", "III", "IV"][itemsII.length], text: text2 });
        }
      });

      return {
        instruction: "Match List - I with List - II:",
        col1Header: "Column - A (List - I)",
        col2Header: "Column - B (List - II)",
        list1: itemsI,
        list2: itemsII,
        trailing: "Choose the correct answer from the options given below:",
      };
    }
  }

  // Case 2: Raw paragraph string format (e.g. from user screenshot or raw bank)
  const introMatch = statement.match(/^(?:Match\s+(?:the\s+)?List\s*[-–]?\s*I\s+with\s+List\s*[-–]?\s*II\s*[:.]?\s*)/i);
  const body = introMatch ? statement.slice(introMatch[0].length) : statement;

  const list1Match = body.match(/List\s*[-–]?\s*I\s*[:.]?\s*([\s\S]+?)\s*List\s*[-–]?\s*II/i);
  const list2Match = body.match(/List\s*[-–]?\s*II\s*[:.]?\s*([\s\S]+?)(?:\s*(?:where\b|Choose the correct answer|\bwhere\s+h|\n|$))/i);

  if (list1Match && list2Match) {
    const rawList1 = list1Match[1].trim();
    const rawList2 = list2Match[1].trim();

    const itemsI = [];
    const l1Regex = /(?:^|\s+)(?:\(?([A-D])\)?\.?|\b([A-D])\.)\s+([\s\S]+?)(?=(?:\s+(?:\(?([A-D])\)?\.?|\b([A-D])\.)\s+)|$)/g;
    let m1;
    while ((m1 = l1Regex.exec(rawList1)) !== null) {
      itemsI.push({ label: m1[1] || m1[2], text: m1[3].trim() });
    }

    const itemsII = [];
    const l2Regex = /(?:^|\s+)(?:\(?([IVX]+)\)?\.?|\b([IVX]+)\.)\s+([\s\S]+?)(?=(?:\s+(?:\(?([IVX]+)\)?\.?|\b([IVX]+)\.)\s+)|$)/g;
    let m2;
    while ((m2 = l2Regex.exec(rawList2)) !== null) {
      let t = m2[3].trim();
      t = t.replace(/\^\(([^)]+)\)/g, "^{$1}");
      t = t.replace(/\{([A-Za-z])\}/g, "$1");
      if (t.includes("[") && !t.includes("$")) t = `$${t}$`;
      itemsII.push({ label: m2[1] || m2[2], text: t });
    }

    if (itemsI.length === 4 && itemsII.length === 4) {
      return {
        instruction: "Match List - I with List - II:",
        col1Header: "Column - A (List - I)",
        col2Header: "Column - B (List - II)",
        list1: itemsI,
        list2: itemsII,
        trailing: "Choose the correct answer from the options given below:",
      };
    }
  }

  return null;
}

// ── Match Option Parser ──────────────────────────────────────────────────────
function parseMatchOption(text) {
  if (!text) return null;
  const pairRegex = /(?:\(?([A-D])\)?\s*[-–]\s*\(?([IVX]+)\)?)/g;
  const pairs = [];
  let m;
  while ((m = pairRegex.exec(text)) !== null) {
    pairs.push({ l1: m[1], l2: m[2] });
  }
  if (pairs.length === 4) return pairs;
  return null;
}

// ── Match Option Pill Component ──────────────────────────────────────────────
function MatchOptionPill({ pairs, isSelected }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center" }}>
      {pairs.map(({ l1, l2 }, idx) => (
        <span
          key={idx}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 9px",
            borderRadius: 7,
            background: isSelected ? "#dbeafe" : "#f1f5f9",
            border: `1px solid ${isSelected ? "#93c5fd" : "#cbd5e1"}`,
            fontSize: 12.5,
            fontWeight: 700,
            transition: "all 0.15s ease",
            boxShadow: isSelected ? "0 1px 3px rgba(37,99,235,0.15)" : "none",
          }}
        >
          <span style={{ color: isSelected ? "#1e40af" : "#2563eb", fontWeight: 800 }}>{l1}</span>
          <span style={{ color: "#94a3b8", fontSize: 10, fontWeight: 800 }}>➔</span>
          <span style={{ color: isSelected ? "#5b21b6" : "#7c3aed", fontWeight: 800 }}>{l2}</span>
        </span>
      ))}
    </div>
  );
}

// ── Match Table Viewer Component ─────────────────────────────────────────────
function MatchTableViewer({ matchData, qNumber }) {
  const { instruction, col1Header, col2Header, list1, list2, trailing } = matchData;

  return (
    <div style={{ marginBottom: 18 }}>
      {/* Header Banner */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 12, flexWrap: "wrap", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {qNumber !== undefined && (
            <span style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginRight: 4 }}>
              Q{qNumber}.
            </span>
          )}
          <span style={{
            fontSize: 13.5, fontWeight: 700, color: "#1e40af",
            background: "#eff6ff", border: "1px solid #bfdbfe",
            padding: "4px 10px", borderRadius: 8,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <Layers size={14} /> {instruction || "Match List - I with List - II"}
          </span>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, color: "#64748b",
          background: "#f8fafc", border: "1px solid #e2e8f0",
          padding: "3px 8px", borderRadius: 6,
        }}>
          Dual-Column Matching Grid
        </span>
      </div>

      {/* Modern 2-Column Responsive Matching Table */}
      <div style={{
        width: "100%",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        borderRadius: 14,
        border: "1.5px solid #cbd5e1",
        boxShadow: "0 2px 10px rgba(15, 23, 42, 0.05)",
        background: "#ffffff",
        marginBottom: 12,
      }}>
        <table style={{
          width: "100%",
          minWidth: "480px",
          borderCollapse: "separate",
          borderSpacing: 0,
          tableLayout: "fixed",
        }}>
          <thead>
            <tr>
              <th style={{
                width: "50%",
                background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                borderBottom: "2px solid #93c5fd",
                borderRight: "1px solid #bfdbfe",
                padding: "12px 16px",
                textAlign: "left",
                fontSize: 13,
                fontWeight: 800,
                color: "#1e40af",
                letterSpacing: "0.4px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb" }} />
                  {col1Header || "Column - A (List - I)"}
                </div>
              </th>
              <th style={{
                width: "50%",
                background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
                borderBottom: "2px solid #c4b5fd",
                padding: "12px 16px",
                textAlign: "left",
                fontSize: 13,
                fontWeight: 800,
                color: "#6d28d9",
                letterSpacing: "0.4px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed" }} />
                  {col2Header || "Column - B (List - II)"}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {list1.map((item1, idx) => {
              const item2 = list2[idx] || { label: "", text: "" };
              const isEven = idx % 2 === 0;
              const isLast = idx === list1.length - 1;
              return (
                <tr
                  key={idx}
                  style={{
                    background: isEven ? "#ffffff" : "#f8fafc",
                    transition: "background 0.15s ease",
                  }}
                >
                  {/* Left Column (List - I) */}
                  <td style={{
                    padding: "12px 16px",
                    borderBottom: isLast ? "none" : "1px solid #e2e8f0",
                    borderRight: "1px solid #e2e8f0",
                    verticalAlign: "middle",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: "#eff6ff", border: "1.5px solid #bfdbfe",
                        color: "#1d4ed8", fontWeight: 800, fontSize: 13,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 1px 2px rgba(37,99,235,0.1)",
                      }}>
                        {item1.label}
                      </span>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1e293b", lineHeight: 1.45 }}>
                        <MathText text={item1.text} />
                      </span>
                    </div>
                  </td>

                  {/* Right Column (List - II) */}
                  <td style={{
                    padding: "12px 16px",
                    borderBottom: isLast ? "none" : "1px solid #e2e8f0",
                    verticalAlign: "middle",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: "#f5f3ff", border: "1.5px solid #ddd6fe",
                        color: "#6d28d9", fontWeight: 800, fontSize: 12.5,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 1px 2px rgba(109,40,217,0.1)",
                      }}>
                        {item2.label}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", lineHeight: 1.45 }}>
                        <MathText text={item2.text} />
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Trailing prompt */}
      {trailing && (
        <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginTop: 8 }}>
          {trailing}
        </div>
      )}
    </div>
  );
}

// ── Smart Question Statement Viewer ──────────────────────────────────────────
function QuestionStatementViewer({ statement, qNumber }) {
  const matchData = parseMatchListQuestion(statement);
  if (matchData) {
    return <MatchTableViewer matchData={matchData} qNumber={qNumber} />;
  }

  return (
    <div style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", lineHeight: 1.6, marginBottom: 20 }}>
      {qNumber !== undefined && <span style={{ fontWeight: 800, marginRight: 8 }}>Q{qNumber}.</span>}
      <MathText text={statement} />
    </div>
  );
}

export default function ChapterQuizModal({ isOpen, onClose, chapterName = "Units and Measurements" }) {
  // Mode: 'configure' | 'active' | 'result' | 'mentor_paper'
  const [mode, setMode] = useState("configure");
  const [selectedDifficulty, setSelectedDifficulty] = useState("moderate");
  const [questionCount, setQuestionCount] = useState(10);
  const [useAI, setUseAI] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState([]);
  
  // Quiz Session State
  const [quiz, setQuiz] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qId]: 'A' | 'B' | ... }
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [result, setResult] = useState(null);
  const [reviewFilter, setReviewFilter] = useState("all"); // 'all' | 'wrong' | 'correct'

  // Timer Ref
  const timerRef = useRef(null);

  // Extract all distinct topics from question bank
  const allTopics = useMemo(() => {
    return [...new Set(localQuestions.map((q) => q.topic))];
  }, []);

  // Initialize selected topics
  useEffect(() => {
    if (selectedTopics.length === 0 && allTopics.length > 0) {
      setSelectedTopics(allTopics);
    }
  }, [allTopics]);

  // Timer countdown in active mode
  useEffect(() => {
    if (mode === "active" && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, secondsRemaining]);

  // Generate Quiz Algorithm (Client-side fallback using synced JSON or API)
  const handleGenerateAndStart = async (asMentorPaper = false) => {
    try {
      let data = null;
      // Try fetching from server API first
      try {
        const res = await fetch("/api/quiz/units-measurements/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            difficulty: selectedDifficulty,
            questionCount,
            useAI,
            selectedTopics,
            mode: asMentorPaper ? "mentor_paper" : "student_quiz",
          }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success) data = json.quiz;
        }
      } catch (e) {
        // Fallback to client algorithm
      }

      // Client Fallback Solver
      if (!data) {
        const pool = localQuestions.filter((q) =>
          selectedTopics.length === 0 || selectedTopics.includes(q.topic)
        );
        const easyPool = pool.filter((q) => q.difficulty === "easy");
        const modPool = pool.filter((q) => q.difficulty === "moderate");
        const hardPool = pool.filter((q) => q.difficulty === "hard");

        let targetEasy = 0, targetMod = 0, targetHard = 0;
        const total = Math.min(questionCount, 15);

        if (selectedDifficulty === "easy") {
          targetEasy = Math.min(easyPool.length, Math.round(total * 0.4) || 2);
          targetMod = total - targetEasy;
        } else if (selectedDifficulty === "difficult") {
          targetHard = Math.min(hardPool.length, Math.round(total * 0.40));
          targetMod = total - targetHard;
        } else {
          // Moderate: 40% easy, 40% mod, 20% hard
          targetEasy = Math.min(easyPool.length, Math.round(total * 0.40));
          const rem = total - targetEasy;
          targetHard = Math.min(hardPool.length, Math.round(rem * 0.35));
          targetMod = total - targetEasy - targetHard;
        }

        const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
        let selected = [
          ...shuffle(easyPool).slice(0, targetEasy),
          ...shuffle(modPool).slice(0, targetMod),
          ...shuffle(hardPool).slice(0, targetHard),
        ];

        if (selected.length < total) {
          const chosenIds = new Set(selected.map((q) => q.id));
          const remainder = shuffle(pool.filter((q) => !chosenIds.has(q.id)));
          selected.push(...remainder.slice(0, total - selected.length));
        }

        if (useAI) {
          const diffRank = { easy: 1, moderate: 2, hard: 3 };
          selected.sort((a, b) => diffRank[a.difficulty] - diffRank[b.difficulty]);
        }

        data = {
          paperId: `QUIZ-UM-${Date.now().toString(36).toUpperCase()}`,
          title: `Units & Dimensions — ${selectedDifficulty.toUpperCase()} Quiz`,
          chapter: "Units and Measurements",
          totalQuestions: selected.length,
          durationMinutes: selected.length * 2,
          maxMarks: selected.length * 4,
          aiInsight: useAI
            ? `AI Test Optimizer: Balanced ${selected.length} questions with progressive cognitive load.`
            : `Standard Distribution (${selected.length} questions).`,
          questions: selected,
        };
      }

      setQuiz(data);
      setAnswers({});
      setMarkedForReview(new Set());
      setCurrentIdx(0);
      setSecondsRemaining(data.durationMinutes * 60);

      if (asMentorPaper) {
        setMode("mentor_paper");
      } else {
        setMode("active");
      }
    } catch (err) {
      console.error("Error creating quiz:", err);
    }
  };

  // Submit and evaluate
  const handleSubmitQuiz = () => {
    if (!quiz) return;
    if (timerRef.current) clearInterval(timerRef.current);

    // Evaluate answers
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;
    let positiveMarks = 0;
    let negativeMarks = 0;

    const evaluatedQuestions = quiz.questions.map((q) => {
      const studentAns = (answers[q.id] || "").trim().toUpperCase();
      // Ensure we look up correct answer from localQuestions if hidden
      const original = localQuestions.find((lq) => lq.id === q.id) || q;
      const correctAns = original.correct;
      const isAttempted = studentAns !== "";
      const isCorrect = isAttempted && studentAns === correctAns;

      let marksAwarded = 0;
      let status = "unattempted";

      if (!isAttempted) {
        unattemptedCount++;
        status = "unattempted";
      } else if (isCorrect) {
        correctCount++;
        positiveMarks += 4;
        marksAwarded = 4;
        status = "correct";
      } else {
        wrongCount++;
        negativeMarks += 1;
        marksAwarded = -1;
        status = "wrong";
      }

      return {
        ...original,
        studentAnswer: studentAns,
        isCorrect,
        status,
        marksAwarded,
      };
    });

    const netScore = positiveMarks - negativeMarks;
    const totalAttempted = correctCount + wrongCount;
    const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
    const percentage = Math.round((netScore / (quiz.questions.length * 4)) * 100);

    setResult({
      paperId: quiz.paperId,
      totalQuestions: quiz.questions.length,
      attempted: totalAttempted,
      correctCount,
      wrongCount,
      unattemptedCount,
      positiveMarks,
      negativeMarks,
      netScore,
      maxMarks: quiz.questions.length * 4,
      accuracy,
      percentage,
      evaluatedQuestions,
      timeTakenSec: (quiz.durationMinutes * 60) - secondsRemaining,
    });

    setMode("result");
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(15, 23, 42, 0.75)",
      backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "clamp(6px, 2vw, 16px)",
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        style={{
          width: "100%", maxWidth: mode === "active" ? 1000 : 860,
          height: mode === "active" ? "min(94vh, 900px)" : "auto",
          maxHeight: "96vh",
          background: "#ffffff",
          borderRadius: "clamp(14px, 2vw, 20px)",
          boxShadow: "0 25px 60px -15px rgba(0,0,0,0.35)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: "clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
          color: "#ffffff",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(59, 130, 246, 0.25)",
              border: "1px solid rgba(59, 130, 246, 0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#60a5fa"
            }}>
              <Zap size={20} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: 1 }}>
                Physics · Class 11 · Question Bank
              </div>
              <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: "#ffffff" }}>
                {mode === "active" ? quiz?.title : "Units and Measurements Quiz & Exam Maker"}
              </h2>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {mode === "active" && (
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: secondsRemaining < 120 ? "#ef444425" : "rgba(255,255,255,0.12)",
                border: `1px solid ${secondsRemaining < 120 ? "#ef4444" : "rgba(255,255,255,0.2)"}`,
                padding: "6px 12px", borderRadius: 8,
                color: secondsRemaining < 120 ? "#fca5a5" : "#ffffff",
                fontFamily: "monospace", fontSize: 15, fontWeight: 700
              }}>
                <Clock size={16} />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>
            )}
            <button
              onClick={() => {
                if (mode === "active") {
                  if (window.confirm("Are you sure you want to exit? Your quiz will be submitted.")) {
                    handleSubmitQuiz();
                  }
                } else {
                  onClose();
                  setMode("configure");
                }
              }}
              style={{
                background: "rgba(255,255,255,0.1)", border: "none", color: "#ffffff",
                width: 32, height: 32, borderRadius: 8, display: "flex",
                alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: mode === "active" ? 20 : 24 }}>
          {/* ══════════════════════════════════════════════════════════
              MODE 1: CONFIGURE QUIZ (STUDENT & MENTOR BUILDER)
          ══════════════════════════════════════════════════════════ */}
          {mode === "configure" && (
            <div>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px", background: "#f8fafc", borderRadius: 12,
                border: "1px solid #e2e8f0", marginBottom: 20
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                    Verified Question Bank Loaded: <strong>47 Questions</strong> (3 Easy, 28 Moderate, 16 Hard)
                  </span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", background: "#eff6ff", padding: "4px 10px", borderRadius: 20 }}>
                  JEE Main & Adv Level
                </span>
              </div>

              {/* 1. Question Count (Max 15) */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
                  1. Question Count (Max 15 per Quiz)
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  {QUESTION_COUNTS.map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      style={{
                        flex: 1, padding: "10px 14px", borderRadius: 10,
                        border: `2px solid ${questionCount === cnt ? "#2563eb" : "#e2e8f0"}`,
                        background: questionCount === cnt ? "#eff6ff" : "#ffffff",
                        color: questionCount === cnt ? "#1d4ed8" : "#475569",
                        fontWeight: 700, fontSize: 14, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                      }}
                    >
                      {cnt} Questions
                      {questionCount === cnt && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Difficulty Level */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
                  2. Difficulty Calibration
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {DIFFICULTIES.map((d) => {
                    const isSelected = selectedDifficulty === d.key;
                    return (
                      <div
                        key={d.key}
                        onClick={() => setSelectedDifficulty(d.key)}
                        style={{
                          border: `2px solid ${isSelected ? d.color : "#e2e8f0"}`,
                          borderRadius: 14, padding: 14, cursor: "pointer",
                          background: isSelected ? d.bg : "#ffffff",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: 13.5, fontWeight: 800, color: isSelected ? d.color : "#1e293b" }}>
                            {d.label}
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: d.color, background: "#ffffff", padding: "2px 6px", borderRadius: 4, border: `1px solid ${d.border}` }}>
                            {d.badge}
                          </span>
                        </div>
                        <p style={{ fontSize: 11.5, color: "#64748b", margin: "0 0 8px 0", lineHeight: 1.4 }}>
                          {d.desc}
                        </p>
                        <div style={{ fontSize: 10.5, fontWeight: 600, color: d.color }}>
                          Formula: {d.ratio}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. AI Optimization Switch */}
              <div style={{
                padding: "14px 18px", borderRadius: 14,
                background: useAI ? "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)" : "#f8fafc",
                border: `1.5px solid ${useAI ? "#86efac" : "#e2e8f0"}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 22
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: useAI ? "#10b981" : "#cbd5e1",
                    color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1e293b" }}>
                      AI Test Level Optimizer
                    </div>
                    <div style={{ fontSize: 11.5, color: "#64748b" }}>
                      Dynamically sequences questions by progressive cognitive difficulty and enforces subtopic diversity.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setUseAI(!useAI)}
                  style={{
                    width: 48, height: 26, borderRadius: 13,
                    background: useAI ? "#10b981" : "#cbd5e1",
                    border: "none", position: "relative", cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: "#ffffff", position: "absolute",
                    top: 3, left: useAI ? 25 : 3,
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                  }} />
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                <button
                  onClick={() => handleGenerateAndStart(false)}
                  style={{
                    flex: 1.5, padding: "14px 20px", borderRadius: 12,
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: "#ffffff", border: "none", fontWeight: 700, fontSize: 15,
                    cursor: "pointer", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 8,
                    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)"
                  }}
                >
                  <Play size={18} /> Start Quiz ({questionCount} Qs · {questionCount * 2} mins)
                </button>

                <button
                  onClick={() => handleGenerateAndStart(true)}
                  style={{
                    flex: 1, padding: "14px 18px", borderRadius: 12,
                    background: "#ffffff", color: "#1e293b",
                    border: "1.5px solid #cbd5e1", fontWeight: 700, fontSize: 14,
                    cursor: "pointer", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 8,
                  }}
                >
                  <FileText size={16} /> Mentor Exam Paper
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              MODE 2: ACTIVE CBT QUIZ PLAYER
          ══════════════════════════════════════════════════════════ */}
          {mode === "active" && quiz && (
            <div>
              {/* Question Navigation Palette */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 14px", background: "#f8fafc", borderRadius: 10,
                marginBottom: 16, border: "1px solid #e2e8f0"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  {quiz.questions.map((q, idx) => {
                    const isAnswered = !!answers[q.id];
                    const isMarked = markedForReview.has(q.id);
                    const isCurrent = currentIdx === idx;

                    let bg = "#e2e8f0";
                    let color = "#475569";
                    if (isAnswered && isMarked) {
                      bg = "#8b5cf6"; color = "#fff";
                    } else if (isAnswered) {
                      bg = "#22c55e"; color = "#fff";
                    } else if (isMarked) {
                      bg = "#a855f7"; color = "#fff";
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIdx(idx)}
                        style={{
                          width: 28, height: 28, borderRadius: 6,
                          background: isCurrent ? "#1e3a8a" : bg,
                          color: isCurrent ? "#ffffff" : color,
                          border: isCurrent ? "2px solid #3b82f6" : "none",
                          fontSize: 12, fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>
                  Question <strong>{currentIdx + 1}</strong> of {quiz.questions.length}
                </div>
              </div>

              {/* Active Question Box */}
              {(() => {
                const currentQ = quiz.questions[currentIdx];
                if (!currentQ) return null;
                const chosenOption = answers[currentQ.id];

                return (
                  <div style={{
                    background: "#ffffff", border: "1px solid #e2e8f0",
                    borderRadius: 14, padding: "20px 24px", marginBottom: 16
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: "#2563eb", background: "#eff6ff", padding: "4px 8px", borderRadius: 6 }}>
                        Topic: {currentQ.topic}
                      </span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, textTransform: "uppercase", padding: "4px 8px", borderRadius: 6,
                        background: currentQ.difficulty === "easy" ? "#ecfdf5" : currentQ.difficulty === "hard" ? "#fef2f2" : "#fffbeb",
                        color: currentQ.difficulty === "easy" ? "#059669" : currentQ.difficulty === "hard" ? "#dc2626" : "#d97706"
                      }}>
                        {currentQ.difficulty} (+4 / -1)
                      </span>
                    </div>

                    <QuestionStatementViewer statement={currentQ.statement} qNumber={currentIdx + 1} />

                    {/* Options */}
                    {(() => {
                      const isMatchQ = !!parseMatchListQuestion(currentQ.statement) || (currentQ.options || []).some((o) => !!parseMatchOption(o?.text));
                      return (
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: isMatchQ ? "repeat(auto-fit, minmax(280px, 1fr))" : "1fr",
                          gap: 10,
                          marginBottom: 20,
                        }}>
                          {(currentQ.options || []).map((opt) => {
                            const isSelected = chosenOption === opt.key;
                            const matchPairs = parseMatchOption(opt?.text);
                            return (
                              <div
                                key={opt.key}
                                onClick={() => {
                                  setAnswers((prev) => ({ ...prev, [currentQ.id]: opt.key }));
                                }}
                                style={{
                                  display: "flex", alignItems: "center", gap: 12,
                                  padding: "12px 16px", borderRadius: 10,
                                  border: `2px solid ${isSelected ? "#2563eb" : "#e2e8f0"}`,
                                  background: isSelected ? "#eff6ff" : "#ffffff",
                                  cursor: "pointer", transition: "all 0.15s ease",
                                  boxShadow: isSelected ? "0 4px 12px rgba(37,99,235,0.12)" : "none",
                                }}
                              >
                                <span style={{
                                  width: 28, height: 28, borderRadius: "50%",
                                  background: isSelected ? "#2563eb" : "#f1f5f9",
                                  color: isSelected ? "#ffffff" : "#475569",
                                  fontWeight: 800, fontSize: 13, display: "flex",
                                  alignItems: "center", justifyContent: "center",
                                  flexShrink: 0,
                                }}>
                                  {opt.key}
                                </span>
                                <div style={{ fontSize: 14, color: "#334155", flex: 1 }}>
                                  {matchPairs ? (
                                    <MatchOptionPill pairs={matchPairs} isSelected={isSelected} />
                                  ) : (
                                    <MathText text={opt.text} />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}

                    {/* Question Actions */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => {
                            setMarkedForReview((prev) => {
                              const next = new Set(prev);
                              if (next.has(currentQ.id)) next.delete(currentQ.id);
                              else next.add(currentQ.id);
                              return next;
                            });
                          }}
                          style={{
                            padding: "8px 12px", borderRadius: 8,
                            border: "1px solid #cbd5e1", background: markedForReview.has(currentQ.id) ? "#f3e8ff" : "#ffffff",
                            color: markedForReview.has(currentQ.id) ? "#7c3aed" : "#475569",
                            fontSize: 12, fontWeight: 600, cursor: "pointer"
                          }}
                        >
                          {markedForReview.has(currentQ.id) ? "Marked for Review" : "Mark Review"}
                        </button>
                        <button
                          onClick={() => {
                            setAnswers((prev) => {
                              const next = { ...prev };
                              delete next[currentQ.id];
                              return next;
                            });
                          }}
                          style={{
                            padding: "8px 12px", borderRadius: 8,
                            border: "1px solid #e2e8f0", background: "#ffffff",
                            color: "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer"
                          }}
                        >
                          Clear
                        </button>
                      </div>

                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          disabled={currentIdx === 0}
                          onClick={() => setCurrentIdx((i) => i - 1)}
                          style={{
                            padding: "8px 14px", borderRadius: 8,
                            border: "1px solid #cbd5e1", background: "#ffffff",
                            color: "#1e293b", fontSize: 13, fontWeight: 600,
                            cursor: currentIdx === 0 ? "not-allowed" : "pointer",
                            opacity: currentIdx === 0 ? 0.5 : 1
                          }}
                        >
                          <ChevronLeft size={16} /> Prev
                        </button>

                        {currentIdx < quiz.questions.length - 1 ? (
                          <button
                            onClick={() => setCurrentIdx((i) => i + 1)}
                            style={{
                              padding: "8px 18px", borderRadius: 8,
                              background: "#2563eb", color: "#ffffff",
                              border: "none", fontSize: 13, fontWeight: 700,
                              cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                            }}
                          >
                            Save & Next <ChevronRight size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmitQuiz}
                            style={{
                              padding: "8px 20px", borderRadius: 8,
                              background: "#16a34a", color: "#ffffff",
                              border: "none", fontSize: 13, fontWeight: 700,
                              cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                            }}
                          >
                            Submit Quiz <Check size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              MODE 3: DIAGNOSTIC RESULT SCORECARD
          ══════════════════════════════════════════════════════════ */}
          {mode === "result" && result && (
            <div>
              {/* Scorecard Banner */}
              <div style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
                borderRadius: 14, padding: "20px 24px", color: "#ffffff",
                marginBottom: 20
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#93c5fd", textTransform: "uppercase" }}>
                      Quiz Scorecard · Diagnostic Summary
                    </span>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: "#ffffff", margin: "4px 0 0 0" }}>
                      Units & Dimensions Assessment
                    </h3>
                  </div>
                  <button
                    onClick={() => setMode("configure")}
                    style={{
                      background: "rgba(255,255,255,0.15)", border: "none", color: "#ffffff",
                      padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                    }}
                  >
                    <RotateCcw size={14} /> New Quiz
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  <div style={{ background: "rgba(255,255,255,0.08)", padding: 12, borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>{result.netScore} / {result.maxMarks}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase" }}>Net Score</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", padding: 12, borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#34d399" }}>{result.accuracy}%</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase" }}>Accuracy</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", padding: 12, borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>{result.correctCount} / {result.totalQuestions}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase" }}>Correct</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", padding: 12, borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#f87171" }}>{result.wrongCount}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase" }}>Incorrect (-{result.negativeMarks})</div>
                  </div>
                </div>
              </div>

              {/* Filter tabs */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h4 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: "#1e293b" }}>
                  Question-by-Question Solution Room
                </h4>
                <div style={{ display: "flex", gap: 6 }}>
                  {[
                    { key: "all", label: `All (${result.totalQuestions})` },
                    { key: "wrong", label: `Wrong (${result.wrongCount})` },
                    { key: "correct", label: `Correct (${result.correctCount})` },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setReviewFilter(f.key)}
                      style={{
                        padding: "5px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                        border: `1px solid ${reviewFilter === f.key ? "#2563eb" : "#e2e8f0"}`,
                        background: reviewFilter === f.key ? "#eff6ff" : "#ffffff",
                        color: reviewFilter === f.key ? "#1d4ed8" : "#64748b",
                        cursor: "pointer"
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Solution List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {result.evaluatedQuestions
                  .filter((q) => {
                    if (reviewFilter === "wrong") return q.status === "wrong";
                    if (reviewFilter === "correct") return q.status === "correct";
                    return true;
                  })
                  .map((q, idx) => (
                    <div
                      key={q.id}
                      style={{
                        border: `1.5px solid ${q.status === "correct" ? "#86efac" : q.status === "wrong" ? "#fca5a5" : "#e2e8f0"}`,
                        borderRadius: 12, padding: "16px 18px",
                        background: q.status === "correct" ? "#f0fdf4" : q.status === "wrong" ? "#fef2f2" : "#f8fafc"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>
                          Question #{idx + 1} · {q.topic}
                        </span>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                          background: q.status === "correct" ? "#22c55e" : q.status === "wrong" ? "#ef4444" : "#94a3b8",
                          color: "#ffffff"
                        }}>
                          {q.status === "correct" ? "+4 Marks" : q.status === "wrong" ? "-1 Mark" : "Unattempted (0)"}
                        </span>
                      </div>

                      <QuestionStatementViewer statement={q.statement} />

                      {(() => {
                        const isMatchQ = !!parseMatchListQuestion(q.statement) || (q.options || []).some((o) => !!parseMatchOption(o?.text));
                        return (
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: isMatchQ ? "repeat(auto-fit, minmax(280px, 1fr))" : "1fr 1fr",
                            gap: 8,
                            marginBottom: 12,
                          }}>
                            {(q.options || []).map((opt) => {
                              const isKey = opt.key === q.correct;
                              const isStudentPick = opt.key === q.studentAnswer;
                              const matchPairs = parseMatchOption(opt?.text);
                              let borderCol = "#e2e8f0";
                              let bgCol = "#ffffff";
                              if (isKey) {
                                borderCol = "#22c55e"; bgCol = "#dcfce7";
                              } else if (isStudentPick && !isKey) {
                                borderCol = "#ef4444"; bgCol = "#fee2e2";
                              }

                              return (
                                <div
                                  key={opt.key}
                                  style={{
                                    padding: "10px 14px", borderRadius: 8,
                                    border: `1.5px solid ${borderCol}`, background: bgCol,
                                    fontSize: 13, display: "flex", alignItems: "center", gap: 8,
                                  }}
                                >
                                  <strong>({opt.key})</strong>
                                  <div style={{ flex: 1 }}>
                                    {matchPairs ? (
                                      <MatchOptionPill pairs={matchPairs} isSelected={isKey || isStudentPick} />
                                    ) : (
                                      <MathText text={opt.text} />
                                    )}
                                  </div>
                                  {isKey && <span style={{ marginLeft: "auto", fontSize: 11, color: "#16a34a", fontWeight: 700, flexShrink: 0 }}>✓ Key</span>}
                                  {isStudentPick && !isKey && <span style={{ marginLeft: "auto", fontSize: 11, color: "#dc2626", fontWeight: 700, flexShrink: 0 }}>✗ Your Choice</span>}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}

                      {q.explanation && (
                        <div style={{
                          fontSize: 12.5, color: "#334155", background: "rgba(255,255,255,0.7)",
                          padding: 10, borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)",
                          lineHeight: 1.5
                        }}>
                          <strong>Solution & Rationale:</strong><br />
                          <MathText text={q.explanation} />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              MODE 4: MENTOR PAPER VIEW (PRINTABLE / EXPORT)
          ══════════════════════════════════════════════════════════ */}
          {mode === "mentor_paper" && quiz && (
            <div>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 18px", background: "#f8fafc", borderRadius: 10,
                border: "1px solid #e2e8f0", marginBottom: 18
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
                    {quiz.title} (Mentor Exam Copy)
                  </h3>
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    Total Questions: {quiz.totalQuestions} · Marks: {quiz.maxMarks} · {quiz.aiInsight}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => window.print()}
                    style={{
                      padding: "8px 14px", borderRadius: 8, background: "#0f172a",
                      color: "#ffffff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer"
                    }}
                  >
                    Print Paper
                  </button>
                  <button
                    onClick={() => setMode("configure")}
                    style={{
                      padding: "8px 14px", borderRadius: 8, background: "#ffffff",
                      color: "#475569", border: "1px solid #cbd5e1", fontSize: 12, fontWeight: 600, cursor: "pointer"
                    }}
                  >
                    Back
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {quiz.questions.map((q, idx) => {
                  const fullQ = localQuestions.find((lq) => lq.id === q.id) || q;
                  return (
                    <div key={q.id} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <strong style={{ color: "#1e3a8a" }}>Question {idx + 1}</strong>
                        <span style={{ fontSize: 11, background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>
                          {fullQ.difficulty} · {fullQ.topic}
                        </span>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <QuestionStatementViewer statement={fullQ.statement} />
                      </div>
                      {(() => {
                        const isMatchQ = !!parseMatchListQuestion(fullQ.statement) || fullQ.options.some((o) => !!parseMatchOption(o.text));
                        return (
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: isMatchQ ? "repeat(auto-fit, minmax(280px, 1fr))" : "1fr 1fr",
                            gap: 8,
                            marginBottom: 10,
                          }}>
                            {(fullQ.options || []).map((opt) => {
                              const matchPairs = parseMatchOption(opt?.text);
                              const isCorrectOpt = opt.key === fullQ.correct;
                              return (
                                <div
                                  key={opt.key}
                                  style={{
                                    fontSize: 13,
                                    color: isCorrectOpt ? "#16a34a" : "#475569",
                                    fontWeight: isCorrectOpt ? 700 : 400,
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "8px 12px", borderRadius: 8,
                                    border: `1px solid ${isCorrectOpt ? "#86efac" : "#e2e8f0"}`,
                                    background: isCorrectOpt ? "#f0fdf4" : "#ffffff",
                                  }}
                                >
                                  <strong>({opt.key})</strong>
                                  <div style={{ flex: 1 }}>
                                    {matchPairs ? (
                                      <MatchOptionPill pairs={matchPairs} isSelected={isCorrectOpt} />
                                    ) : (
                                      <MathText text={opt.text} />
                                    )}
                                  </div>
                                  {isCorrectOpt && <span style={{ marginLeft: "auto", fontSize: 11, color: "#16a34a", fontWeight: 700, flexShrink: 0 }}>✓ (Answer Key)</span>}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                      {fullQ.explanation && (
                        <div style={{ fontSize: 12, color: "#64748b", background: "#f8fafc", padding: 8, borderRadius: 6 }}>
                          <strong>Answer Key: ({fullQ.correct})</strong> — {fullQ.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
