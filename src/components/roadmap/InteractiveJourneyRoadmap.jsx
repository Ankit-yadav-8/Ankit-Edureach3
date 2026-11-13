import React, { useState } from "react";
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

const RAIL_NODES = [
  { x: 75,  y: 52 },
  { x: 280, y: 26 },
  { x: 490, y: 68 },
  { x: 700, y: 38 },
  { x: 910, y: 58 },
  { x: 1100, y: 28 }
];

export default function InteractiveJourneyRoadmap({
  title = "Interactive Roadmap to JEE Mains 2027 Success",
  subtitle = "Click on any milestone along the winding path to inspect weekly tactical plans, high-yield chapters, and IITian mentor audit checklists.",
  milestones = DEFAULT_JEE_MILESTONES,
  planKey = "mentor-jee-2027-6m"
}) {
  const { open: openEnrol } = useEnrol();
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const waveD = "M 75,52 C 180,10 370,80 490,68 C 610,56 610,24 700,38 C 790,52 820,70 910,58 C 1000,46 1030,16 1100,28";

  return (
    <section className="ijr-section" id="interactive-roadmap">
      <div className="scp-container">
        {/* Section Header */}
        <div className="ijr-header">
          <span className="ijr-kicker">
            <Sparkles size={14} /> Plan • Prepare • Practice • Perform
          </span>
          <h2 className="ijr-h2">
            A Structured Roadmap to Prepare Smart,{" "}
            <span className="ijr-h2-accent">Track Progress & Crack JEE</span>
          </h2>
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
              initial={{ scale: 0.94, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="ijr-modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: selectedMilestone.theme,
                      display: "grid",
                      placeItems: "center",
                      color: "#FFFFFF",
                      fontFamily: "Space Grotesk, sans-serif",
                      fontWeight: 800,
                      fontSize: "1.15rem"
                    }}
                  >
                    {selectedMilestone.num}
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: "0.74rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontFamily: "Space Grotesk, sans-serif",
                        color: selectedMilestone.theme
                      }}
                    >
                      Milestone {selectedMilestone.num} · {selectedMilestone.week}
                    </span>
                    <h2
                      style={{
                        margin: "2px 0 0",
                        fontSize: "1.32rem",
                        fontWeight: 800,
                        fontFamily: "Sora, sans-serif",
                        color: "#1B1B24"
                      }}
                    >
                      {selectedMilestone.title}
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  className="ijr-modal-close"
                  onClick={() => setSelectedMilestone(null)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="ijr-modal-body">
                <p style={{ fontSize: "1.02rem", lineHeight: 1.65, color: "#374151", margin: "0 0 20px" }}>
                  {selectedMilestone.fullDescription}
                </p>

                <div className="ijr-modal-grid-2">
                  {/* Action Tasks */}
                  <div className="ijr-pane">
                    <h4 className="ijr-pane-title">
                      <Target size={15} /> Key Milestones & Daily Checklist
                    </h4>
                    <ul className="ijr-checklist">
                      {selectedMilestone.tasks.map((task, ti) => (
                        <li key={ti} className="ijr-checklist-item">
                          <CheckCircle2 size={16} color={selectedMilestone.theme} style={{ flexShrink: 0, marginTop: 2 }} />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Reference Material */}
                  <div className="ijr-pane">
                    <h4 className="ijr-pane-title">
                      <BookOpen size={15} /> Verified Reference Material
                    </h4>
                    <ul className="ijr-checklist">
                      {selectedMilestone.resources.map((res, ri) => (
                        <li key={ri} className="ijr-checklist-item">
                          <Award size={16} color="#FF693D" style={{ flexShrink: 0, marginTop: 2 }} />
                          <span>{res}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ marginTop: 20, padding: "12px 14px", background: "#F4F1EA", borderRadius: 12, fontSize: "0.82rem", lineHeight: 1.45, color: "#54525C" }}>
                      💡 <strong>Pro Tip:</strong> Avoid buying duplicate question banks. Master these core resources thoroughly before testing other sources.
                    </div>
                  </div>
                </div>

                {/* Mentor Secret Card */}
                <div className="ijr-mentor-secret">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <Zap size={18} color="#FF693D" />
                    <span style={{ fontSize: "0.82rem", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", color: "#D8512A", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      IIT Roorkee Mentor Secret
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.6, color: "#1B1B24", fontStyle: "italic" }}>
                    "{selectedMilestone.mentorSecret}"
                  </p>
                </div>
              </div>

              {/* Modal Footer with Live Razorpay & WhatsApp Controls */}
              <div className="ijr-modal-footer">
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "#54525C" }}>
                  <Sparkles size={16} color="#FF693D" />
                  <span>Execute this phase with your personal IITian mentor</span>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <a
                    href={`https://wa.me/${WA_NUMBER}?text=Hi%20CampusPoint,%20I%20have%20questions%20about%20Milestone%20${selectedMilestone.id}:%20${encodeURIComponent(selectedMilestone.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mj-btn-glass"
                    style={{ padding: "10px 18px", fontSize: "0.88rem" }}
                  >
                    Discuss on WhatsApp <Phone size={14} />
                  </a>

                  <button
                    type="button"
                    className="mj-btn-glow"
                    style={{ padding: "10px 22px", fontSize: "0.88rem" }}
                    onClick={() => {
                      setSelectedMilestone(null);
                      openEnrol(planKey);
                    }}
                  >
                    Enroll in Mentorship · ₹3,499 <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
