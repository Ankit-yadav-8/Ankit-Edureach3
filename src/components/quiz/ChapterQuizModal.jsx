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
    color: "#059669",
    bg: "#F4FBF7",
    border: "#A7F3D0",
    ratio: "Easy + Medium blend",
  },
  {
    key: "moderate",
    label: "Moderate Level",
    badge: "JEE Standard",
    desc: "40% Easy, 40% Moderate, 20% Hard questions",
    color: "#D97706",
    bg: "#FFF9EF",
    border: "#FDE68A",
    ratio: "40% Easy · 40% Med · 20% Hard",
  },
  {
    key: "difficult",
    label: "Difficult Level",
    badge: "Advanced Challenge",
    desc: "60% Moderate, 40% Hard questions",
    color: "#DC2626",
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
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
      {pairs.map(({ l1, l2 }, idx) => (
        <span
          key={idx}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 8px",
            borderRadius: 6,
            background: isSelected ? "#FFF3EB" : "#FAF5EE",
            border: `1px solid ${isSelected ? "#FCD5C4" : "#EADBCC"}`,
            fontSize: 11.5,
            fontWeight: 700,
            transition: "all 0.15s ease",
            boxShadow: isSelected ? "0 1px 3px rgba(255,105,61,0.12)" : "none",
          }}
        >
          <span style={{ color: isSelected ? "#D9481E" : "#8A4C1C", fontWeight: 800 }}>{l1}</span>
          <span style={{ color: "#A89A8C", fontSize: 9.5, fontWeight: 800 }}>➔</span>
          <span style={{ color: isSelected ? "#B43403" : "#5C4B3E", fontWeight: 800 }}>{l2}</span>
        </span>
      ))}
    </div>
  );
}

// ── Match Table Viewer Component ─────────────────────────────────────────────
function MatchTableViewer({ matchData, qNumber }) {
  const { instruction, col1Header, col2Header, list1, list2, trailing } = matchData;

  return (
    <div style={{ marginBottom: 14 }}>
      {/* Header Banner */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 10, flexWrap: "wrap", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {qNumber !== undefined && (
            <span style={{ fontSize: 14, fontWeight: 800, color: "#231C16", marginRight: 2 }}>
              Q{qNumber}.
            </span>
          )}
          <span style={{
            fontSize: 11.8, fontWeight: 700, color: "#C84E23",
            background: "#FFF4EF", border: "1px solid #FCD5C4",
            padding: "3px 9px", borderRadius: 7,
            display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            <Layers size={13} /> {instruction || "Match List - I with List - II"}
          </span>
        </div>
        <span style={{
          fontSize: 10.5, fontWeight: 700, color: "#7A6C5D",
          background: "#FAF6F0", border: "1px solid #EADBCC",
          padding: "2px 7px", borderRadius: 5,
        }}>
          Dual-Column Matching Grid
        </span>
      </div>

      {/* Modern 2-Column Responsive Matching Table */}
      <div style={{
        width: "100%",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        borderRadius: 12,
        border: "1px solid #EADBCC",
        boxShadow: "0 2px 8px rgba(58, 38, 22, 0.04)",
        background: "#ffffff",
        marginBottom: 10,
      }}>
        <table style={{
          width: "100%",
          minWidth: "400px",
          borderCollapse: "separate",
          borderSpacing: 0,
          tableLayout: "fixed",
        }}>
          <thead>
            <tr>
              <th style={{
                width: "50%",
                background: "linear-gradient(135deg, #FAF4EB 0%, #F4ECE0 100%)",
                borderBottom: "2px solid #E5D6C4",
                borderRight: "1px solid #EADBCC",
                padding: "10px 14px",
                textAlign: "left",
                fontSize: 12,
                fontWeight: 800,
                color: "#78491C",
                letterSpacing: "0.3px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#FF693D" }} />
                  {col1Header || "Column - A (List - I)"}
                </div>
              </th>
              <th style={{
                width: "50%",
                background: "linear-gradient(135deg, #F6F1EA 0%, #F0E8DD 100%)",
                borderBottom: "2px solid #E0D4C7",
                padding: "10px 14px",
                textAlign: "left",
                fontSize: 12,
                fontWeight: 800,
                color: "#614B3E",
                letterSpacing: "0.3px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#8C7E70" }} />
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
                    background: isEven ? "#ffffff" : "#FAF7F2",
                    transition: "background 0.15s ease",
                  }}
                >
                  {/* Left Column (List - I) */}
                  <td style={{
                    padding: "10px 14px",
                    borderBottom: isLast ? "none" : "1px solid #EADBCC",
                    borderRight: "1px solid #EADBCC",
                    verticalAlign: "middle",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        width: 25, height: 25, borderRadius: 6,
                        background: "#FFF4EF", border: "1px solid #FCD5C4",
                        color: "#D9481E", fontWeight: 800, fontSize: 11.5,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {item1.label}
                      </span>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: "#2E241C", lineHeight: 1.45 }}>
                        <MathText text={item1.text} />
                      </span>
                    </div>
                  </td>

                  {/* Right Column (List - II) */}
                  <td style={{
                    padding: "10px 14px",
                    borderBottom: isLast ? "none" : "1px solid #EADBCC",
                    verticalAlign: "middle",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        width: 25, height: 25, borderRadius: 6,
                        background: "#F4EFEA", border: "1px solid #E0D4C9",
                        color: "#614B3E", fontWeight: 800, fontSize: 11.5,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {item2.label}
                      </span>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: "#2E241C", lineHeight: 1.45 }}>
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
        <div style={{ fontSize: 12, fontWeight: 600, color: "#615447", marginTop: 6 }}>
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
    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#231C16", lineHeight: 1.55, marginBottom: 16 }}>
      {qNumber !== undefined && <span style={{ fontWeight: 800, marginRight: 6, color: "#D9481E" }}>Q{qNumber}.</span>}
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
      background: "rgba(32, 26, 22, 0.55)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "clamp(6px, 2vw, 16px)",
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        style={{
          width: "100%", maxWidth: mode === "active" ? 960 : 820,
          height: mode === "active" ? "min(94vh, 880px)" : "auto",
          maxHeight: "95vh",
          background: "#FDFBF7",
          borderRadius: "clamp(12px, 2.5vw, 20px)",
          boxShadow: "0 25px 70px -15px rgba(58, 38, 22, 0.22)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #EADBCC",
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: "clamp(10px, 2vw, 14px) clamp(14px, 3vw, 22px)",
          background: "linear-gradient(135deg, #FAF6F0 0%, #F4EBE1 100%)",
          borderBottom: "1px solid #EADBCC",
          color: "#231C16",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: "#FFF2EC",
              border: "1px solid #FCD5C4",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#FF693D", flexShrink: 0
            }}>
              <Zap size={18} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#FF693D", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                Physics · Class 11 · Question Bank
              </div>
              <h2 style={{ fontSize: "clamp(14px, 2.2vw, 16px)", fontWeight: 800, margin: 0, color: "#231C16" }}>
                {mode === "active" ? quiz?.title : "Units and Measurements Quiz & Exam Maker"}
              </h2>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {mode === "active" && (
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: secondsRemaining < 120 ? "#FEE2E2" : "#FFF7ED",
                border: `1px solid ${secondsRemaining < 120 ? "#FCA5A5" : "#FED7AA"}`,
                padding: "5px 10px", borderRadius: 8,
                color: secondsRemaining < 120 ? "#DC2626" : "#C2410C",
                fontFamily: "monospace", fontSize: 13.5, fontWeight: 700
              }}>
                <Clock size={15} />
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
                background: "#EFE6DA", border: "1px solid #EADBCC", color: "#4A3E33",
                width: 30, height: 30, borderRadius: 8, display: "flex",
                alignItems: "center", justifyContent: "center", cursor: "pointer",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#E5DDD0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#EFE6DA"; }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "clamp(14px, 2.5vw, 20px)" }}>
          {/* ══════════════════════════════════════════════════════════
              MODE 1: CONFIGURE QUIZ (STUDENT & MENTOR BUILDER)
          ══════════════════════════════════════════════════════════ */}
          {mode === "configure" && (
            <div>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 14px", background: "#FAF6F0", borderRadius: 10,
                border: "1px solid #EADBCC", marginBottom: 16, flexWrap: "wrap", gap: 8
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#4A3E33" }}>
                    Verified Question Bank Loaded: <strong>47 Questions</strong> (3 Easy, 28 Moderate, 16 Hard)
                  </span>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#D9481E", background: "#FFF2EC", border: "1px solid #FCD5C4", padding: "3px 8px", borderRadius: 20 }}>
                  JEE Main & Adv Level
                </span>
              </div>

              {/* 1. Question Count (Max 15) */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#231C16", marginBottom: 6 }}>
                  1. Question Count (Max 15 per Quiz)
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {QUESTION_COUNTS.map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      style={{
                        flex: 1, minWidth: 90, padding: "8px 12px", borderRadius: 8,
                        border: `2px solid ${questionCount === cnt ? "#FF693D" : "#EADBCC"}`,
                        background: questionCount === cnt ? "#FFF4F0" : "#ffffff",
                        color: questionCount === cnt ? "#D9481E" : "#5A4E42",
                        fontWeight: 700, fontSize: 13, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        transition: "all 0.15s ease"
                      }}
                    >
                      {cnt} Questions
                      {questionCount === cnt && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Difficulty Level */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#231C16", marginBottom: 6 }}>
                  2. Difficulty Calibration
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
                  {DIFFICULTIES.map((d) => {
                    const isSelected = selectedDifficulty === d.key;
                    return (
                      <div
                        key={d.key}
                        onClick={() => setSelectedDifficulty(d.key)}
                        style={{
                          border: `2px solid ${isSelected ? d.color : "#EADBCC"}`,
                          borderRadius: 12, padding: 12, cursor: "pointer",
                          background: isSelected ? d.bg : "#ffffff",
                          transition: "all 0.2s ease",
                          boxShadow: isSelected ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 800, color: isSelected ? d.color : "#231C16" }}>
                            {d.label}
                          </span>
                          <span style={{ fontSize: 9.5, fontWeight: 700, color: d.color, background: "#ffffff", padding: "2px 6px", borderRadius: 4, border: `1px solid ${d.border}` }}>
                            {d.badge}
                          </span>
                        </div>
                        <p style={{ fontSize: 11, color: "#615447", margin: "0 0 6px 0", lineHeight: 1.4 }}>
                          {d.desc}
                        </p>
                        <div style={{ fontSize: 10, fontWeight: 600, color: d.color }}>
                          Formula: {d.ratio}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. AI Optimization Switch */}
              <div style={{
                padding: "12px 16px", borderRadius: 12,
                background: useAI ? "linear-gradient(135deg, #FFF9F2 0%, #FAF3E6 100%)" : "#FAF6F0",
                border: `1.5px solid ${useAI ? "#FCD5C4" : "#EADBCC"}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 18, flexWrap: "wrap", gap: 10
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: useAI ? "#FF693D" : "#DDD2C4",
                    color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#231C16" }}>
                      AI Test Level Optimizer
                    </div>
                    <div style={{ fontSize: 11, color: "#615447" }}>
                      Sequences questions by progressive difficulty and enforces subtopic diversity.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setUseAI(!useAI)}
                  style={{
                    width: 44, height: 24, borderRadius: 12,
                    background: useAI ? "#FF693D" : "#DDD2C4",
                    border: "none", position: "relative", cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    background: "#ffffff", position: "absolute",
                    top: 3, left: useAI ? 23 : 3,
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                  }} />
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => handleGenerateAndStart(false)}
                  style={{
                    flex: "1 1 240px", padding: "12px 18px", borderRadius: 10,
                    background: "linear-gradient(135deg, #FF693D 0%, #EE5326 100%)",
                    color: "#ffffff", border: "none", fontWeight: 700, fontSize: 13.5,
                    cursor: "pointer", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 7,
                    boxShadow: "0 4px 14px rgba(255, 105, 61, 0.28)",
                    transition: "filter 0.15s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.06)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
                >
                  <Play size={16} /> Start Quiz ({questionCount} Qs · {questionCount * 2} mins)
                </button>

                <button
                  onClick={() => handleGenerateAndStart(true)}
                  style={{
                    flex: "1 1 180px", padding: "12px 16px", borderRadius: 10,
                    background: "#ffffff", color: "#231C16",
                    border: "1.5px solid #EADBCC", fontWeight: 700, fontSize: 12.5,
                    cursor: "pointer", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 6,
                    transition: "background 0.15s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#FAF6F0"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; }}
                >
                  <FileText size={15} /> Mentor Exam Paper
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
                padding: "8px 12px", background: "#FAF6F0", borderRadius: 8,
                marginBottom: 14, border: "1px solid #EADBCC", flexWrap: "wrap", gap: 8
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                  {quiz.questions.map((q, idx) => {
                    const isAnswered = !!answers[q.id];
                    const isMarked = markedForReview.has(q.id);
                    const isCurrent = currentIdx === idx;

                    let bg = "#EFE6DA";
                    let color = "#5A4E42";
                    if (isAnswered && isMarked) {
                      bg = "#9333EA"; color = "#fff";
                    } else if (isAnswered) {
                      bg = "#10B981"; color = "#fff";
                    } else if (isMarked) {
                      bg = "#D97706"; color = "#fff";
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIdx(idx)}
                        style={{
                          width: 26, height: 26, borderRadius: 6,
                          background: isCurrent ? "#FF693D" : bg,
                          color: isCurrent ? "#ffffff" : color,
                          border: isCurrent ? "2px solid #E05326" : "none",
                          fontSize: 11, fontWeight: 700, cursor: "pointer",
                          boxShadow: isCurrent ? "0 2px 8px rgba(255,105,61,0.28)" : "none",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div style={{ fontSize: 11.5, fontWeight: 600, color: "#7A6C5D" }}>
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
                    background: "#ffffff", border: "1px solid #EADBCC",
                    borderRadius: 12, padding: "clamp(14px, 2.5vw, 20px)", marginBottom: 14
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#D9481E", background: "#FFF4EF", border: "1px solid #FCD5C4", padding: "3px 8px", borderRadius: 5 }}>
                        Topic: {currentQ.topic}
                      </span>
                      <span style={{
                        fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", padding: "3px 7px", borderRadius: 5,
                        background: currentQ.difficulty === "easy" ? "#F4FBF7" : currentQ.difficulty === "hard" ? "#FEF2F2" : "#FFF9EF",
                        color: currentQ.difficulty === "easy" ? "#059669" : currentQ.difficulty === "hard" ? "#DC2626" : "#D97706",
                        border: `1px solid ${currentQ.difficulty === "easy" ? "#A7F3D0" : currentQ.difficulty === "hard" ? "#FECACA" : "#FDE68A"}`
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
                          gridTemplateColumns: isMatchQ ? "repeat(auto-fit, minmax(260px, 1fr))" : "1fr",
                          gap: 8,
                          marginBottom: 16,
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
                                  display: "flex", alignItems: "center", gap: 10,
                                  padding: "10px 14px", borderRadius: 9,
                                  border: `2px solid ${isSelected ? "#FF693D" : "#EADBCC"}`,
                                  background: isSelected ? "#FFF7F3" : "#ffffff",
                                  cursor: "pointer", transition: "all 0.15s ease",
                                  boxShadow: isSelected ? "0 2px 10px rgba(255,105,61,0.12)" : "none",
                                }}
                              >
                                <span style={{
                                  width: 25, height: 25, borderRadius: "50%",
                                  background: isSelected ? "#FF693D" : "#F4ECE1",
                                  color: isSelected ? "#ffffff" : "#5A4E42",
                                  fontWeight: 800, fontSize: 11.5, display: "flex",
                                  alignItems: "center", justifyContent: "center",
                                  flexShrink: 0,
                                }}>
                                  {opt.key}
                                </span>
                                <div style={{ fontSize: 13, color: "#2E241C", flex: 1 }}>
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
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F0E7DC", paddingTop: 12, flexWrap: "wrap", gap: 8 }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
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
                            padding: "7px 11px", borderRadius: 7,
                            border: `1px solid ${markedForReview.has(currentQ.id) ? "#FCD34D" : "#EADBCC"}`,
                            background: markedForReview.has(currentQ.id) ? "#FEF3C7" : "#ffffff",
                            color: markedForReview.has(currentQ.id) ? "#B45309" : "#5A4E42",
                            fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                            transition: "all 0.15s ease"
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
                            padding: "7px 11px", borderRadius: 7,
                            border: "1px solid #EADBCC", background: "#ffffff",
                            color: "#7A6C5D", fontSize: 11.5, fontWeight: 600, cursor: "pointer"
                          }}
                        >
                          Clear
                        </button>
                      </div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          disabled={currentIdx === 0}
                          onClick={() => setCurrentIdx((i) => i - 1)}
                          style={{
                            padding: "7px 12px", borderRadius: 7,
                            border: "1px solid #EADBCC", background: "#ffffff",
                            color: "#231C16", fontSize: 12, fontWeight: 600,
                            cursor: currentIdx === 0 ? "not-allowed" : "pointer",
                            opacity: currentIdx === 0 ? 0.45 : 1
                          }}
                        >
                          <ChevronLeft size={14} /> Prev
                        </button>

                        {currentIdx < quiz.questions.length - 1 ? (
                          <button
                            onClick={() => setCurrentIdx((i) => i + 1)}
                            style={{
                              padding: "7px 16px", borderRadius: 7,
                              background: "linear-gradient(135deg, #FF693D 0%, #EE5326 100%)",
                              color: "#ffffff", border: "none", fontSize: 12.5, fontWeight: 700,
                              cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                              boxShadow: "0 2px 8px rgba(255,105,61,0.22)"
                            }}
                          >
                            Save & Next <ChevronRight size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmitQuiz}
                            style={{
                              padding: "7px 18px", borderRadius: 7,
                              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                              color: "#ffffff", border: "none", fontSize: 12.5, fontWeight: 700,
                              cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                              boxShadow: "0 2px 8px rgba(16,185,129,0.22)"
                            }}
                          >
                            Submit Quiz <Check size={14} />
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
                background: "linear-gradient(135deg, #FAF5ED 0%, #F3EAE0 100%)",
                border: "1px solid #EADBCC",
                borderRadius: 12, padding: "16px 20px", color: "#231C16",
                marginBottom: 16
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 800, color: "#9C5B29", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                      Quiz Scorecard · Diagnostic Summary
                    </span>
                    <h3 style={{ fontSize: 16.5, fontWeight: 800, color: "#231C16", margin: "3px 0 0 0" }}>
                      Units & Dimensions Assessment
                    </h3>
                  </div>
                  <button
                    onClick={() => setMode("configure")}
                    style={{
                      background: "#ffffff", border: "1px solid #EADBCC", color: "#4A3E33",
                      padding: "5px 11px", borderRadius: 7, fontSize: 11.5, fontWeight: 600,
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                    }}
                  >
                    <RotateCcw size={13} /> New Quiz
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(105px, 1fr))", gap: 8 }}>
                  <div style={{ background: "#ffffff", border: "1px solid #EADBCC", padding: "10px 8px", borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 19, fontWeight: 800, color: "#FF693D" }}>{result.netScore} / {result.maxMarks}</div>
                    <div style={{ fontSize: 10, color: "#7A6C5D", textTransform: "uppercase", fontWeight: 700 }}>Net Score</div>
                  </div>
                  <div style={{ background: "#ffffff", border: "1px solid #EADBCC", padding: "10px 8px", borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 19, fontWeight: 800, color: "#10B981" }}>{result.accuracy}%</div>
                    <div style={{ fontSize: 10, color: "#7A6C5D", textTransform: "uppercase", fontWeight: 700 }}>Accuracy</div>
                  </div>
                  <div style={{ background: "#ffffff", border: "1px solid #EADBCC", padding: "10px 8px", borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 19, fontWeight: 800, color: "#10B981" }}>{result.correctCount} / {result.totalQuestions}</div>
                    <div style={{ fontSize: 10, color: "#7A6C5D", textTransform: "uppercase", fontWeight: 700 }}>Correct</div>
                  </div>
                  <div style={{ background: "#ffffff", border: "1px solid #EADBCC", padding: "10px 8px", borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 19, fontWeight: 800, color: "#EF4444" }}>{result.wrongCount}</div>
                    <div style={{ fontSize: 10, color: "#7A6C5D", textTransform: "uppercase", fontWeight: 700 }}>Incorrect (-{result.negativeMarks})</div>
                  </div>
                </div>
              </div>

              {/* Filter tabs */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <h4 style={{ fontSize: 13.5, fontWeight: 800, margin: 0, color: "#231C16" }}>
                  Question-by-Question Solution Room
                </h4>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    { key: "all", label: `All (${result.totalQuestions})` },
                    { key: "wrong", label: `Wrong (${result.wrongCount})` },
                    { key: "correct", label: `Correct (${result.correctCount})` },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setReviewFilter(f.key)}
                      style={{
                        padding: "4px 9px", borderRadius: 6, fontSize: 11.5, fontWeight: 600,
                        border: `1px solid ${reviewFilter === f.key ? "#FF693D" : "#EADBCC"}`,
                        background: reviewFilter === f.key ? "#FFF4F0" : "#ffffff",
                        color: reviewFilter === f.key ? "#D9481E" : "#615447",
                        cursor: "pointer", transition: "all 0.15s ease"
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Solution List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                        border: `1px solid ${q.status === "correct" ? "#A7F3D0" : q.status === "wrong" ? "#FECACA" : "#EADBCC"}`,
                        borderRadius: 10, padding: "14px 16px",
                        background: q.status === "correct" ? "#F6FDF9" : q.status === "wrong" ? "#FFF8F8" : "#FAF7F2"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: "#4A3E33" }}>
                          Question #{idx + 1} · {q.topic}
                        </span>
                        <span style={{
                          fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 4,
                          background: q.status === "correct" ? "#10B981" : q.status === "wrong" ? "#EF4444" : "#8C7E70",
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
                            gridTemplateColumns: isMatchQ ? "repeat(auto-fit, minmax(260px, 1fr))" : "1fr 1fr",
                            gap: 6,
                            marginBottom: 10,
                          }}>
                            {(q.options || []).map((opt) => {
                              const isKey = opt.key === q.correct;
                              const isStudentPick = opt.key === q.studentAnswer;
                              const matchPairs = parseMatchOption(opt?.text);
                              let borderCol = "#EADBCC";
                              let bgCol = "#ffffff";
                              if (isKey) {
                                borderCol = "#86EFAC"; bgCol = "#DCFCE7";
                              } else if (isStudentPick && !isKey) {
                                borderCol = "#FECACA"; bgCol = "#FEE2E2";
                              }

                              return (
                                <div
                                  key={opt.key}
                                  style={{
                                    padding: "8px 12px", borderRadius: 7,
                                    border: `1px solid ${borderCol}`, background: bgCol,
                                    fontSize: 12.5, display: "flex", alignItems: "center", gap: 7,
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
                                  {isKey && <span style={{ marginLeft: "auto", fontSize: 10.5, color: "#16A34A", fontWeight: 700, flexShrink: 0 }}>✓ Key</span>}
                                  {isStudentPick && !isKey && <span style={{ marginLeft: "auto", fontSize: 10.5, color: "#DC2626", fontWeight: 700, flexShrink: 0 }}>✗ Your Choice</span>}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}

                      {q.explanation && (
                        <div style={{
                          fontSize: 11.8, color: "#4A3E33", background: "#ffffff",
                          padding: "9px 12px", borderRadius: 7, border: "1px solid #EADBCC",
                          lineHeight: 1.5
                        }}>
                          <strong style={{ color: "#231C16" }}>Solution & Rationale:</strong><br />
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
                padding: "10px 16px", background: "#FAF6F0", borderRadius: 8,
                border: "1px solid #EADBCC", marginBottom: 16, flexWrap: "wrap", gap: 8
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#231C16" }}>
                    {quiz.title} (Mentor Exam Copy)
                  </h3>
                  <span style={{ fontSize: 11.5, color: "#7A6C5D" }}>
                    Total Questions: {quiz.totalQuestions} · Marks: {quiz.maxMarks} · {quiz.aiInsight}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => window.print()}
                    style={{
                      padding: "7px 12px", borderRadius: 7, background: "#231C16",
                      color: "#ffffff", border: "none", fontSize: 11.5, fontWeight: 700, cursor: "pointer"
                    }}
                  >
                    Print Paper
                  </button>
                  <button
                    onClick={() => setMode("configure")}
                    style={{
                      padding: "7px 12px", borderRadius: 7, background: "#ffffff",
                      color: "#4A3E33", border: "1px solid #EADBCC", fontSize: 11.5, fontWeight: 600, cursor: "pointer"
                    }}
                  >
                    Back
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {quiz.questions.map((q, idx) => {
                  const fullQ = localQuestions.find((lq) => lq.id === q.id) || q;
                  return (
                    <div key={q.id} style={{ border: "1px solid #EADBCC", borderRadius: 8, padding: 14, background: "#ffffff" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                        <strong style={{ color: "#78491C", fontSize: 13 }}>Question {idx + 1}</strong>
                        <span style={{ fontSize: 10.5, background: "#FAF6F0", border: "1px solid #EADBCC", padding: "2px 6px", borderRadius: 4, fontWeight: 600, color: "#615447" }}>
                          {fullQ.difficulty} · {fullQ.topic}
                        </span>
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <QuestionStatementViewer statement={fullQ.statement} />
                      </div>
                      {(() => {
                        const isMatchQ = !!parseMatchListQuestion(fullQ.statement) || fullQ.options.some((o) => !!parseMatchOption(o.text));
                        return (
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: isMatchQ ? "repeat(auto-fit, minmax(260px, 1fr))" : "1fr 1fr",
                            gap: 6,
                            marginBottom: 8,
                          }}>
                            {(fullQ.options || []).map((opt) => {
                              const matchPairs = parseMatchOption(opt?.text);
                              const isCorrectOpt = opt.key === fullQ.correct;
                              return (
                                <div
                                  key={opt.key}
                                  style={{
                                    fontSize: 12.5,
                                    color: isCorrectOpt ? "#16A34A" : "#4A3E33",
                                    fontWeight: isCorrectOpt ? 700 : 400,
                                    display: "flex", alignItems: "center", gap: 6,
                                    padding: "7px 10px", borderRadius: 6,
                                    border: `1px solid ${isCorrectOpt ? "#86EFAC" : "#EADBCC"}`,
                                    background: isCorrectOpt ? "#F0FDF4" : "#ffffff",
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
                                  {isCorrectOpt && <span style={{ marginLeft: "auto", fontSize: 10.5, color: "#16A34A", fontWeight: 700, flexShrink: 0 }}>✓ (Answer Key)</span>}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                      {fullQ.explanation && (
                        <div style={{ fontSize: 11.5, color: "#615447", background: "#FAF7F2", padding: 8, borderRadius: 6, border: "1px solid #EADBCC" }}>
                          <strong style={{ color: "#231C16" }}>Answer Key: ({fullQ.correct})</strong> — {fullQ.explanation}
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
