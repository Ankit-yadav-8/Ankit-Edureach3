import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  BookOpen,
  Target,
  Award,
  Zap,
  Phone,
  X,
  Compass,
  Trophy,
  Flame,
  Clock,
  Calendar,
  Layers,
  GraduationCap
} from "lucide-react";
import { useEnrol } from "../EnrolModal.jsx";
import JeeBatchSelectModal from "./JeeBatchSelectModal.jsx";
import "../../styles/interactive-roadmap.css";

const WA_NUMBER = "918118826194";

export const DEFAULT_JEE_MILESTONES = [
  {
    id: 1,
    num: "1",
    phase: "done",
    statusLabel: "Done",
    title: "Understand the Exam",
    week: "Weeks 1–2",
    theme: "#3B82F6",
    bullets: [
      "Official NTA syllabus & pattern",
      "Negative marking math (+4 / -1)",
      "High-yield chapter weightage"
    ],
    fullDescription: "The single biggest mistake JEE aspirants make is studying blindly without understanding the official NTA paper distribution. Decode the pattern and weightage before touching random books.",
    tasks: [
      "Download the updated official NTA JEE syllabus and strike through deleted topics",
      "Memorize the marking scheme (+4 for correct, -1 for wrong, 0 for unattempted)",
      "Identify high-weightage chapters across Physics (35%), Chemistry (38%), and Maths (27%)",
      "Set up your official physical error notebook and daily study timer"
    ],
    resources: ["Official NTA Syllabus PDF", "5-Year Chapter-wise Weightage Table", "NCERT Baseline Checklist"],
    mentorSecret: "Ankit Kumar (AIR 3846 CRL): Don't start with 5 books at once. One standard theory source + 5 years of PYQs beats hoarding 10 reference books you will never finish."
  },
  {
    id: 2,
    num: "2",
    phase: "done",
    statusLabel: "Done",
    title: "Build Strong Basics",
    week: "Weeks 1–8",
    theme: "#0EA5E9",
    bullets: [
      "100% NCERT thoroughness",
      "First-principles derivations",
      "Daily formula mastery"
    ],
    fullDescription: "Without rock-solid conceptual roots, solving multi-concept advanced numericals is impossible. Build absolute clarity in Mechanics, GOC, and Algebra fundamentals.",
    tasks: [
      "Physics: Master Free Body Diagrams (FBDs) and Kinematics from H.C. Verma Vol 1",
      "Chemistry: Read NCERT line-by-line for Periodic Table, Chemical Bonding & GOC",
      "Maths: Solve standard problems on Functions, Trigonometry, and Quadratic Equations",
      "Create single-page formula summary sheets after finishing every single chapter"
    ],
    resources: ["H.C. Verma Vol 1 & 2", "NCERT Chemistry Textbooks", "Standard Coaching Theory Modules"],
    mentorSecret: "Saket Kumar (IIT Roorkee): If you cannot derive a formula from first principles, you will freeze when JEE Advanced twists question conditions. Understand the 'why', not just the 'what'."
  },
  {
    id: 3,
    num: "3",
    phase: "done",
    statusLabel: "Done",
    title: "Practice & Analyze",
    week: "Weeks 9–16",
    theme: "#10B981",
    bullets: [
      "5-Year official PYQ bank",
      "Part-syllabus mock exams",
      "Mistake autopsy diary"
    ],
    fullDescription: "Passive studying produces zero marks jump. Spend at least 70% of your daily hours solving questions with a timer and auditing why you made mistakes.",
    tasks: [
      "Solve at least 40-50 quality problems per day with a strict countdown timer",
      "Complete all official NTA PYQs from 2020 to 2025 for completed chapters",
      "Take weekly 3-hour part-syllabus computer-based mock tests",
      "Log every negative mark into: Conceptual Gap, Silly Slip, or Time Pressure"
    ],
    resources: ["Marks App / ExamGOAL PYQ Bank", "Official NTA CBT Mock Simulator", "Diagnostic Mistake Spreadsheet"],
    mentorSecret: "Mayank Singh (IIT Roorkee): Marks don't increase during tests; they increase in the 2 hours AFTER the test when you force yourself to solve every wrong question without looking at solutions."
  },
  {
    id: 4,
    num: "4",
    phase: "live",
    statusLabel: "Live · Target Phase",
    title: "Revise Strategically",
    week: "Weeks 17–20",
    theme: "#8B5CF6",
    bullets: [
      "70-30 backlog formula",
      "Flash formula card decks",
      "Active recall short notes"
    ],
    fullDescription: "Don't let pending backlogs destroy your ongoing classes. The 70-30 rule guarantees systematic backlog recovery while staying 100% on track with ongoing coaching.",
    tasks: [
      "Allocate 70% of study time to ongoing coaching topics and 30% strictly to backlogs",
      "Recover backlogs via High-Yield one-shots + 30 PYQs rather than 20-hour playlists",
      "Review your personal formula diary every morning for 30 minutes",
      "Re-attempt questions marked as 'Difficult' or 'Wrong' from your error diary"
    ],
    resources: ["CampusPoint 70-30 Backlog Tracker", "Short Notes Master Repository", "High-Yield One-Shot Roadmaps"],
    mentorSecret: "Ankit Kumar (AIR 3846 CRL): Aspirants panic when backlogs build up and quit ongoing topics. That creates a vicious cycle. Always protect ongoing classes, and clear backlogs systematically on weekends."
  },
  {
    id: 5,
    num: "5",
    phase: "soon",
    statusLabel: "Upcoming",
    title: "Boost Performance",
    week: "Weeks 21–24",
    theme: "#F59E0B",
    bullets: [
      "15+ Full-length CBTs",
      "3-Pass paper solving",
      "Negative marking reduction"
    ],
    fullDescription: "Simulate the exact exam-day environment. Synchronize your body clock with the 9:00 AM - 12:00 PM and 3:00 PM - 6:00 PM NTA exam shifts.",
    tasks: [
      "Take full-length 3-hour mock tests twice a week in the exact official exam slots",
      "Execute the 3-Pass technique: Pass 1 (Speedy 45-second cherry-picks), Pass 2 (Calculative), Pass 3 (Tough)",
      "Eliminate reckless guessing: cut down unforced negative marks to under 12 marks total",
      "Maintain stamina to sit focused for 180 continuous minutes without distraction"
    ],
    resources: ["Full-Length CBT Test Series", "Official NTA Answer Sheet Simulator", "Percentile Predictor Engine"],
    mentorSecret: "Saket Kumar (IIT Roorkee): Most students lose 30-40 marks simply because they get stuck on Question #3 for 10 minutes and miss easy questions at the end of the paper. Paper strategy is 50% of your rank."
  },
  {
    id: 6,
    num: "6",
    phase: "soon",
    statusLabel: "Goal 🏆",
    title: "Be Exam Ready",
    week: "April 2027",
    theme: "#EC4899",
    bullets: [
      "Peak exam temperament",
      "Complete formula re-runs",
      "JoSAA rank counseling"
    ],
    fullDescription: "Peak mental composure, disciplined sleep cycles, and zero last-minute experiments. Walk into the exam hall with the calm confidence of a verified ranker.",
    tasks: [
      "Stop touching new reference books or untested topics 15 days before the exam",
      "Revise NCERT Inorganic Chemistry and all physics formula sheets daily",
      "Read through your entire error diary from cover to cover",
      "Sleep by 10:30 PM every night to reset your cognitive alertness for morning shifts"
    ],
    resources: ["JEE 2027 Final Revision Checklist", "Admit Card & ID Verification Protocol", "CampusPoint JoSAA Counseling Engine"],
    mentorSecret: "Mayank Singh (IIT Roorkee): On exam day, calm temperament beats raw genius. Trust the system, follow your question-selection rules, and your rank will take care of itself."
  }
];

export const DEFAULT_JEE_2028_MILESTONES = [
  {
    id: 1,
    num: "1",
    phase: "done",
    statusLabel: "Done",
    title: "Class 10 to 11 Jump",
    week: "Weeks 1–4",
    theme: "#3B82F6",
    bullets: [
      "Master vector & calculus math basics",
      "Bridge the 10th to 11th difficulty jump",
      "Fix 6-8 hr daily non-school routine"
    ],
    fullDescription: "The syllabus jump from Class 10 to 11 catches 90% of students off guard. Build mathematical tools (vectors, differentiation, integration) first before starting physics mechanics.",
    tasks: [
      "Master basic differentiation and integration rules used in kinematics",
      "Build a disciplined 6-hour daily self-study timetable balancing school and coaching",
      "Identify high-weightage Class 11 foundational topics in Physics, Chem & Maths"
    ],
    resources: ["Class 11 Foundation Roadmap PDF", "Basic Math for Physics Toolkit", "NCERT Baseline Check"],
    mentorSecret: "Ankit Kumar (AIR 3846 CRL): The biggest mistake in Class 11 is underestimating the volume of content. Never let a single day's homework slide into tomorrow."
  },
  {
    id: 2,
    num: "2",
    phase: "done",
    statusLabel: "Done",
    title: "Core Mechanics & Bonding",
    week: "Weeks 5–12",
    theme: "#0EA5E9",
    bullets: [
      "Kinematics & Newton's Laws (NLM)",
      "Chemical Bonding & Periodic Properties",
      "Trigonometry & Quadratic Equations"
    ],
    fullDescription: "These three chapters form the backbone of the entire 2-year JEE syllabus. Every subsequent topic in Class 12 relies on mechanics and chemical bonding clarity.",
    tasks: [
      "Solve H.C. Verma kinematics and NLM exercise problems with free-body diagrams",
      "Read NCERT Chemical Bonding three times and memorize hybridization structures",
      "Solve 30 objective questions daily from standard coaching module sheets"
    ],
    resources: ["H.C. Verma Vol 1", "NCERT Chemistry Vol 1", "Coaching Level-1 Problem Banks"],
    mentorSecret: "Saket Kumar (IIT Roorkee): If you don't master Chemical Bonding and FBDs in Class 11, Organic Chemistry and Rotational Motion will feel impossible later."
  },
  {
    id: 3,
    num: "3",
    phase: "done",
    statusLabel: "Done",
    title: "Backlog Defense & PYQs",
    week: "Weeks 13–20",
    theme: "#10B981",
    bullets: [
      "Zero-backlog weekly buffer days",
      "Rotational Motion & Thermodynamics",
      "Standard 5-year JEE Main PYQ checks"
    ],
    fullDescription: "Class 11 mid-terms are where backlogs typically begin. Use the 70-30 rule: 70% time on ongoing chapters, 30% time strictly on clearing pending module exercises.",
    tasks: [
      "Reserve Sunday mornings as a 4-hour dedicated backlog elimination sprint",
      "Solve official JEE Main PYQs for all completed chapters",
      "Maintain a physical Error Autopsy Notebook for every failed numerical"
    ],
    resources: ["Marks App PYQ Filter", "Class 11 Backlog Tracker", "Weekly Milestone Log"],
    mentorSecret: "Mayank Singh (IIT Roorkee): Backlogs are normal, but unorganized backlogs are fatal. Make a list of pending chapters and kill them one by one every Sunday."
  },
  {
    id: 4,
    num: "4",
    phase: "live",
    statusLabel: "Active Phase",
    title: "Class 11 Part-Tests",
    week: "Weeks 21–28",
    theme: "#F59E0B",
    bullets: [
      "Bi-weekly 3-hour CBT mock exams",
      "Eliminate negative marking (-1 slips)",
      "Time allocation: 50m C / 60m P / 70m M"
    ],
    fullDescription: "Start taking timed full-length CBT tests on Class 11 chapters. Build exam temperament, question selection strategy, and the habit of leaving trap questions early.",
    tasks: [
      "Attempt 3-hour computer-based mock tests on alternate Sundays",
      "Analyze time spent per question and eliminate silly calculation mistakes",
      "Review mistakes with your IITian mentor within 24 hours of every test"
    ],
    resources: ["Official CBT Exam Simulator", "Negative Marking Reduction Audit Sheet"],
    mentorSecret: "Ankit Kumar (IIT Roorkee): Never judge a test only by score. Judge it by whether you made mistakes on questions you actually knew how to solve."
  },
  {
    id: 5,
    num: "5",
    phase: "upcoming",
    statusLabel: "Upcoming",
    title: "School + JEE Balance",
    week: "Weeks 29–36",
    theme: "#8B5CF6",
    bullets: [
      "Class 11 annual school exam prep",
      "NCERT subjective theory derivations",
      "Organic Chemistry basics (GOC)"
    ],
    fullDescription: "Score 85%+ in Class 11 school exams while keeping JEE problem-solving sharp. Write out full derivations for school and practice objective PYQs in parallel.",
    tasks: [
      "Write formal physics derivations by hand for school theory papers",
      "Master General Organic Chemistry (GOC) reaction mechanisms completely",
      "Maintain 1-on-1 weekly mentor check-ins to stay accountable during exam month"
    ],
    resources: ["NCERT Exemplar Solutions", "GOC Reaction Flowcharts", "1-on-1 Mentor Review Log"],
    mentorSecret: "Saket Kumar (IIT Roorkee): GOC is the gateway to the entire Class 12 Organic Chemistry syllabus. Understand inductive and resonance effects deeply."
  },
  {
    id: 6,
    num: "6",
    phase: "goal",
    statusLabel: "Goal 🏆",
    title: "Class 12 Launchpad",
    week: "April 2028 Goal",
    theme: "#EC4899",
    bullets: [
      "Complete Class 11 grand revision",
      "Formula quick-recap flash cards",
      "Target: AIR < 1000 in JEE 2028"
    ],
    fullDescription: "Enter Class 12 with 100% of Class 11 revised and zero pending backlogs. You will be in the top 1% of serious aspirants nationwide ready to dominate JEE 2028.",
    tasks: [
      "Finish single-page formula recap sheets for all Class 11 chapters",
      "Take the Class 11 full-syllabus benchmark assessment with your mentor",
      "Set up your Class 12 strategic roadmap and 24-month JEE 2028 target"
    ],
    resources: ["Class 11 Grand Formula Booklet", "Class 12 Launch Schedule", "CampusPoint IITian Mentor Roadmap"],
    mentorSecret: "Mayank Singh (IIT Roorkee): Aspirants who finish Class 11 with clear concepts and zero backlogs have a 10x higher probability of cracking top-1000 ranks in JEE Advanced."
  }
];

const RAIL_NODES = [
  { x: 75,  y: 52 },
  { x: 280, y: 26 },
  { x: 490, y: 68 },
  { x: 700, y: 38 },
  { x: 910, y: 58 },
  { x: 1100, y: 28 }
];

export default function InteractiveJourneyRoadmap({
  title = "Roadmap to Crack JEE",
  subtitle = "6 strategic milestones built by IITians to prepare smart and track progress.",
  milestones: customMilestones,
  planKey = "mentor-jee-2027-6m",
  isHero = false,
  kicker = "Built by IITians"
}) {
  const { open: openEnrol } = useEnrol();
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [batchYear, setBatchYear] = useState("2027");
  const [showBatchModal, setShowBatchModal] = useState(false);

  const milestones = customMilestones || (batchYear === "2028" ? DEFAULT_JEE_2028_MILESTONES : DEFAULT_JEE_MILESTONES);
  const activePlanKey = batchYear === "2028" ? "mentor-jee-2028-6m" : (planKey || "mentor-jee-2027-6m");

  const waveD = "M 75,52 C 180,10 370,80 490,68 C 610,56 610,24 700,38 C 790,52 820,70 910,58 C 1000,46 1030,16 1100,28";

  return (
    <section className={`ijr-section ${isHero ? "ijr-section--hero" : ""}`} id={isHero ? "hero" : "interactive-roadmap"}>
      <div className="scp-container">
        {/* Section Header */}
        <div className="ijr-header">
          {/* Target Year Batch Switcher */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.92)",
              border: "1px solid rgba(220, 215, 205, 0.85)",
              borderRadius: 50,
              padding: "4px 5px",
              boxShadow: "0 2px 10px rgba(28, 28, 40, 0.05)",
              gap: 4
            }}>
              <button
                type="button"
                onClick={() => setBatchYear("2027")}
                style={{
                  padding: "6px 16px",
                  borderRadius: 50,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-heading, sans-serif)",
                  cursor: "pointer",
                  border: "none",
                  background: batchYear === "2027" ? "#1C1C28" : "transparent",
                  color: batchYear === "2027" ? "#fff" : "rgba(28,28,40,0.65)",
                  boxShadow: batchYear === "2027" ? "0 2px 8px rgba(28,28,40,0.18)" : "none",
                  transition: "all 0.2s"
                }}
              >
                🎓 JEE 2027 Target
              </button>
              <button
                type="button"
                onClick={() => setBatchYear("2028")}
                style={{
                  padding: "6px 16px",
                  borderRadius: 50,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-heading, sans-serif)",
                  cursor: "pointer",
                  border: "none",
                  background: batchYear === "2028" ? "#1C1C28" : "transparent",
                  color: batchYear === "2028" ? "#fff" : "rgba(28,28,40,0.65)",
                  boxShadow: batchYear === "2028" ? "0 2px 8px rgba(28,28,40,0.18)" : "none",
                  transition: "all 0.2s"
                }}
              >
                🚀 JEE 2028 Target
              </button>
            </div>
          </div>

          {isHero ? (
            <h1 className="ijr-h2 ijr-h2--hero">
              {title === "Roadmap to Crack JEE" || title === "Interactive Roadmap to JEE Mains Success" ? (
                <>Roadmap to <span className="ijr-h2-accent">Crack JEE</span></>
              ) : (
                title
              )}
            </h1>
          ) : (
            <h2 className="ijr-h2">
              {title === "Roadmap to Crack JEE" || title === "Interactive Roadmap to JEE Mains Success" ? (
                <>Roadmap to <span className="ijr-h2-accent">Crack JEE</span></>
              ) : (
                title
              )}
            </h2>
          )}
          <p className="ijr-sub">{subtitle}</p>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#D8512A", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Compass size={15} /> Click any milestone to open full execution guide
            </span>
          </div>
        </div>

        {/* ── WAVY PROGRESS RAIL (DESKTOP > 900px) ────────────────── */}
        <div className="ijr-rail-wrap" aria-hidden="true">
          <svg className="ijr-wave" viewBox="0 0 1180 90" preserveAspectRatio="none">
            <defs>
              <linearGradient id="coralGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#D8512A" />
                <stop offset="60%" stopColor="#FF693D" />
                <stop offset="100%" stopColor="#FFA07A" />
              </linearGradient>
            </defs>

            {/* Base track */}
            <path d={waveD} fill="none" stroke="#E4DED2" strokeWidth="4" strokeLinecap="round" />

            {/* Glowing progress line */}
            <motion.path
              d={waveD}
              fill="none"
              stroke="url(#coralGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
            />

            {/* Light pulse flow running along line */}
            <path className="ijr-flow" d={waveD} fill="none" stroke="#FFF0EA" strokeWidth="4" strokeLinecap="round" />
          </svg>

          {/* Interactive Nodes along the wave */}
          {milestones.map((m, i) => {
            const node = RAIL_NODES[i] || { x: (i + 1) * 180, y: 45 };
            const isLive = m.phase === "live";
            const isDone = m.phase === "done";

            return (
              <div
                key={m.id}
                className="ijr-node"
                style={{ left: `${(node.x / 1180) * 100}%`, top: node.y }}
                onClick={() => setSelectedMilestone(m)}
              >
                {isLive && <span className="ijr-node-pill ijr-node-pill--now">Now</span>}
                {isDone && i === 2 && <span className="ijr-node-pill ijr-node-pill--done">Done</span>}

                {isDone && (
                  <span className="ijr-dot ijr-dot--done">
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}

                {isLive && (
                  <span className="ijr-dot ijr-dot--now">
                    <span className="ijr-ring ijr-ring-1" />
                    <span className="ijr-ring ijr-ring-2" />
                    <span className="ijr-dot-core" />
                  </span>
                )}

                {!isDone && !isLive && (
                  <span className="ijr-dot ijr-dot--soon">
                    <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#8C877E" }}>{m.num}</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── 6 MILESTONE CARDS GRID ──────────────────────────────── */}
        <div className="ijr-cards">
          {milestones.map((m) => (
            <motion.div
              key={m.id}
              className={`ijr-card ${m.phase === "live" ? "ijr-card--live" : ""}`}
              style={{ borderTop: `4px solid ${m.theme}` }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMilestone(m)}
            >
              <div>
                <div className="ijr-card-head">
                  <span
                    className={`ijr-card-phase-pill ijr-card-phase-pill--${m.phase}`}
                    style={m.phase === "live" ? { background: "#FFE7DE", color: "#D8512A" } : undefined}
                  >
                    {m.statusLabel}
                  </span>
                  <span className="ijr-card-time">{m.week}</span>
                </div>

                <h3 className="ijr-card-title">{m.title}</h3>

                <ul className="ijr-card-bullets">
                  {m.bullets.map((b, bi) => (
                    <li key={bi} className="ijr-card-bullet-item">
                      <CheckCircle2 size={13} color={m.theme} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ijr-card-action">
                <span>Open Full Guide</span>
                <ChevronRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── INTERACTIVE PHASE INSPECTOR MODAL ─────────────────────── */}
      {/* ── COMPACT MODAL INSPECTOR WINDOW (PORTALED TO BODY) ───────── */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedMilestone && (
            <motion.div
              className="ijr-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMilestone(null)}
            >
              <motion.div
                className="ijr-modal"
                initial={{ scale: 0.94, y: 16, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.94, y: 16, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="ijr-modal-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: selectedMilestone.theme,
                        display: "grid",
                        placeItems: "center",
                        color: "#FFFFFF",
                        fontFamily: "Space Grotesk, sans-serif",
                        fontWeight: 800,
                        fontSize: "1rem",
                        flexShrink: 0
                      }}
                    >
                      {selectedMilestone.num}
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          fontFamily: "Space Grotesk, sans-serif",
                          color: selectedMilestone.theme,
                          display: "block"
                        }}
                      >
                        Milestone {selectedMilestone.num} · {selectedMilestone.week}
                      </span>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "1.15rem",
                          fontWeight: 800,
                          fontFamily: "Sora, sans-serif",
                          color: "#1B1B24",
                          lineHeight: 1.25
                        }}
                      >
                        {selectedMilestone.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="ijr-modal-close"
                    onClick={() => setSelectedMilestone(null)}
                    aria-label="Close modal"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Modal Body - Sleek, Compact & Focused */}
                <div className="ijr-modal-body">
                  <p className="ijr-modal-desc">
                    {selectedMilestone.fullDescription}
                  </p>

                  {/* Key Action Checklist (Top 3 Actionable Items) */}
                  <div className="ijr-pane-compact">
                    <h4 className="ijr-pane-title">
                      <Target size={14} /> Key Action Checklist
                    </h4>
                    <ul className="ijr-checklist">
                      {selectedMilestone.tasks.slice(0, 3).map((task, ti) => (
                        <li key={ti} className="ijr-checklist-item">
                          <CheckCircle2 size={15} color={selectedMilestone.theme} style={{ flexShrink: 0, marginTop: 2 }} />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Compact Mentor Insight */}
                  {selectedMilestone.mentorSecret && (
                    <div className="ijr-mentor-secret-compact">
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <Zap size={14} color="#FF693D" />
                        <span style={{ fontSize: "0.74rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", color: "#D8512A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          IITian Mentor Secret
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.84rem", lineHeight: 1.5, color: "#1B1B24", fontStyle: "italic" }}>
                        "{selectedMilestone.mentorSecret}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Modal Footer - Compact & Direct Actions */}
                <div className="ijr-modal-footer">
                  <a
                    href={`https://wa.me/${WA_NUMBER}?text=Hi%20CampusPoint,%20I%20have%20questions%20about%20Milestone%20${selectedMilestone.id}:%20${encodeURIComponent(selectedMilestone.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mj-btn-glass"
                    style={{ padding: "9px 16px", fontSize: "0.82rem" }}
                  >
                    Discuss on WhatsApp <Phone size={13} />
                  </a>

                  <button
                    type="button"
                    className="ijr-btn-primary"
                    style={{ padding: "9px 18px", fontSize: "0.84rem" }}
                    onClick={() => {
                      setSelectedMilestone(null);
                      setShowBatchModal(true);
                    }}
                  >
                    Enroll · ₹3,499 <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Target Batch Selector (JEE 2027 vs JEE 2028) */}
      <JeeBatchSelectModal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
      />
    </section>
  );
}
