import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
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
    title: "Understand the Exam",
    shortTitle: "Syllabus & Pattern",
    week: "Weeks 1–2",
    theme: "#3B82F6",
    bgLight: "#EFF6FF",
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
    title: "Build Strong Basics",
    shortTitle: "Concept Clarity & NCERT",
    week: "Weeks 1–8",
    theme: "#0EA5E9",
    bgLight: "#F0F9FF",
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
    title: "Practice & Analyze",
    shortTitle: "Mock Tests & PYQs",
    week: "Weeks 9–16",
    theme: "#10B981",
    bgLight: "#ECFDF5",
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
    title: "Revise Strategically",
    shortTitle: "70-30 Backlog Clearance",
    week: "Weeks 17–20",
    theme: "#8B5CF6",
    bgLight: "#F5F3FF",
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
    title: "Boost Performance",
    shortTitle: "Full CBT Mock Drills",
    week: "Weeks 21–24",
    theme: "#F59E0B",
    bgLight: "#FFFBEB",
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
    title: "Be Exam Ready",
    shortTitle: "Final Sprint & Rank Lock",
    week: "April 2027",
    theme: "#EC4899",
    bgLight: "#FDF2F8",
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

export default function InteractiveJourneyRoadmap({
  kicker = "PLAN • PREPARE • PRACTICE • PERFORM",
  title = "Interactive Roadmap to JEE Mains 2027 Success",
  subtitle = "Click on any milestone along the winding path to inspect weekly tactical plans, high-yield chapters, and IITian mentor audit checklists.",
  milestones = DEFAULT_JEE_MILESTONES,
  planKey = "mentor-jee-2027-6m",
  summitLabel = "JEE Mains 2027 Success",
  targetExam = "JEE Main & Advanced 2027"
}) {
  const { open: openEnrol } = useEnrol();
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  return (
    <section className="ijr-section" id="interactive-roadmap">
      <div className="scp-container">
        {/* Section Header */}
        <div className="ijr-header">
          <span className="ijr-kicker">
            <Sparkles size={14} /> {kicker}
          </span>
          <h2 className="ijr-h2">
            A Structured Roadmap to Prepare Smart,{" "}
            <span className="ijr-h2-accent">Track Progress & Crack JEE</span>
          </h2>
          <p className="ijr-sub">{subtitle}</p>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <span className="ijr-helper-pill">
              <Compass size={16} color="#FF693D" /> Click any milestone to open full execution guide
            </span>
            <span className="ijr-helper-pill">
              <Award size={16} color="#10B981" /> Formulated by IIT Roorkee Rankers
            </span>
          </div>
        </div>

        {/* ── DESKTOP WINDING ROAD STAGE (> 920px) ───────────────── */}
        <div className="ijr-desktop-view">
          {/* Summit Goal Pill */}
          <div className="ijr-summit">
            <span className="ijr-summit-trophy">🏆</span>
            <div>
              <p className="ijr-summit-title">{summitLabel}</p>
              <span className="ijr-summit-sub">Dream IIT / NIT Admission</span>
            </div>
          </div>

          {/* Student Avatar on Lookout */}
          <div className="ijr-student-avatar">
            <div className="ijr-student-icon">
              <GraduationCap size={22} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: "0.88rem", color: "#1B1B24", fontFamily: "Sora, sans-serif" }}>
                JEE Aspirant
              </p>
              <span style={{ fontSize: "0.75rem", color: "#FF693D", fontWeight: 700 }}>
                Start Your Journey →
              </span>
            </div>
          </div>

          {/* Winding Highway SVG */}
          <div className="ijr-road-svg-wrap" aria-hidden="true">
            <svg
              className="ijr-road-svg"
              viewBox="0 0 1140 460"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="roadGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#252936" />
                  <stop offset="50%" stopColor="#32384A" />
                  <stop offset="100%" stopColor="#1E222D" />
                </linearGradient>
                <filter id="roadShadow" x="-10%" y="-10%" width="120%" height="130%">
                  <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#0F172A" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Asphalt Road Base */}
              <path
                d="M 60,390 C 180,390 220,180 390,200 C 560,220 590,380 770,350 C 920,320 960,110 1080,90"
                fill="none"
                stroke="url(#roadGradient)"
                strokeWidth="74"
                strokeLinecap="round"
                filter="url(#roadShadow)"
              />

              {/* Road Shoulder Highlights */}
              <path
                d="M 60,390 C 180,390 220,180 390,200 C 560,220 590,380 770,350 C 920,320 960,110 1080,90"
                fill="none"
                stroke="#475569"
                strokeWidth="76"
                strokeLinecap="round"
                opacity="0.3"
              />

              {/* Center Dashed Highway Line */}
              <path
                d="M 60,390 C 180,390 220,180 390,200 C 560,220 590,380 770,350 C 920,320 960,110 1080,90"
                fill="none"
                stroke="#FCD34D"
                strokeWidth="4"
                strokeDasharray="14 12"
                strokeLinecap="round"
                opacity="0.85"
              />
            </svg>
          </div>

          {/* 6 Milestone Cards Grid */}
          <div className="ijr-milestones-track">
            {milestones.map((m) => (
              <motion.div
                key={m.id}
                className={`ijr-card ${selectedMilestone?.id === m.id ? "active" : ""}`}
                style={{ borderTop: `4px solid ${m.theme}` }}
                whileHover={{ y: -6, transition: { duration: 0.18 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMilestone(m)}
              >
                <div>
                  <div className="ijr-card-head">
                    <span className="ijr-badge-num" style={{ background: m.theme }}>
                      {m.num}
                    </span>
                    <span
                      className="ijr-badge-week"
                      style={{ background: m.bgLight, color: m.theme }}
                    >
                      {m.week}
                    </span>
                  </div>

                  <h3 className="ijr-card-title">{m.title}</h3>

                  <ul className="ijr-card-bullets">
                    {m.bullets.map((b, bi) => (
                      <li key={bi} className="ijr-card-bullet-item">
                        <CheckCircle2 size={13} color={m.theme} />
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

        {/* ── MOBILE SERPENTINE STEPPER (<= 920px) ───────────────── */}
        <div className="ijr-mobile-view">
          <div className="ijr-mobile-spine" />

          {milestones.map((m) => (
            <div key={m.id} className="ijr-mobile-step">
              <div
                className="ijr-mobile-node"
                style={{ background: m.theme }}
                onClick={() => setSelectedMilestone(m)}
              >
                {m.num}
              </div>

              <div
                className={`ijr-mobile-card ${selectedMilestone?.id === m.id ? "active" : ""}`}
                style={{ borderLeft: `4px solid ${m.theme}` }}
                onClick={() => setSelectedMilestone(m)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      fontFamily: "Space Grotesk, sans-serif",
                      color: m.theme,
                      textTransform: "uppercase"
                    }}
                  >
                    {m.week}
                  </span>
                  <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#FF693D", display: "flex", alignItems: "center", gap: 3 }}>
                    Details <ChevronRight size={13} />
                  </span>
                </div>

                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#1B1B24", margin: "0 0 8px", fontFamily: "Sora, sans-serif" }}>
                  {m.title}
                </h3>

                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
                  {m.bullets.map((b, bi) => (
                    <li key={bi} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: "#54525C" }}>
                      <CheckCircle2 size={13} color={m.theme} style={{ flexShrink: 0 }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── INTERACTIVE PHASE INSPECTOR MODAL / DRAWER ───────────── */}
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
              initial={{ scale: 0.92, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Sticky Header */}
              <div className="ijr-modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: selectedMilestone.theme,
                      display: "grid",
                      placeItems: "center",
                      color: "#FFFFFF",
                      fontFamily: "Space Grotesk, sans-serif",
                      fontWeight: 800,
                      fontSize: "1.2rem"
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
                        fontSize: "1.35rem",
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
                  {/* Column 1: Action Tasks */}
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

                  {/* Column 2: Recommended Resources */}
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
