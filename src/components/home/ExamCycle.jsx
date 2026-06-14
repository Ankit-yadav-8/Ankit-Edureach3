import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, IndianRupee, Users, Trophy, ChevronDown, ChevronUp,
  ExternalLink, Clock, CheckCircle2, Sparkles,
} from "lucide-react";

/* ── Exam data Sep 2025 → Dec 2026 ─────────────────────────── */
const EXAM_CYCLE = [
  /* ── Phase 0: Registration Season ── */
  {
    phase: "Registration & Prep",
    period: "Sep – Nov 2025",
    phaseColor: "#6366f1",
    phaseBg: "rgba(99,102,241,.08)",
    exams: [
      {
        name: "JEE Main 2026 (Session 1)",
        short: "JEE Main S1",
        date: "Registration: Sep–Oct 2025 · Exam: Jan 22–29, 2026",
        fee: "₹1,000 (Gen) · ₹500 (SC/ST)",
        seats: "~43,600 (NITs+IIITs+GFTIs)",
        body: "NTA",
        color: "#F47B20",
        status: "deadline_gone",
        what_you_get: [
          "NIT / IIIT / GFTI admission via JoSAA",
          "Eligibility for JEE Advanced (top 2.5L)",
          "Best of 2 sessions score considered",
          "Percentile used for JoSAA rank list",
        ],
        link: "/jee-main",
      },
      {
        name: "BITSAT 2026",
        short: "BITSAT",
        date: "Registration: Nov 2025 · Exam: Jun 2026",
        fee: "₹3,600 (Gen) · ₹2,900 (Girls)",
        seats: "~2,000 (BITS Pilani/Goa/Hyderabad)",
        body: "BITS",
        color: "#1a3a5c",
        status: "upcoming",

        what_you_get: [
          "Admission to BITS Pilani, Goa, Hyderabad",
          "B.E./B.Pharm/M.Sc dual degree",
          "Online test, unique question set per student",
          "No negative marking for skipped questions",
        ],
        link: "/private/bits-pilani",
      },
    ],
  },

  /* ── Phase 1: Jan–Mar 2026 ── */
  {
    phase: "Main Exam Season",
    period: "Jan – Apr 2026",
    phaseColor: "#F47B20",
    phaseBg: "rgba(244,123,32,.08)",
    exams: [
      {
        name: "JEE Main Session 1",
        short: "JEE Main S1",
        date: "Jan 22 – 29, 2026",
        fee: "₹1,000 (Gen) · ₹500 (SC/ST/PwD)",
        seats: "~43,600 (NIT+IIIT+GFTI)",
        body: "NTA",
        color: "#F47B20",
        status: "deadline_gone",
        what_you_get: [
          "First attempt at qualifying rank for JEE Advanced",
          "Session 1 score used if better than Session 2",
          "Total 90 questions · 300 marks",
          "Physics + Chemistry + Mathematics (equal weight)",
        ],
        link: "/jee-main",
      },
      {
        name: "SRMJEEE 2026",
        short: "SRMJEEE",
        date: "Feb – Mar 2026 (Multiple slots)",
        fee: "₹1,100",
        seats: "~10,000+ (SRM campuses)",
        body: "SRMIST",
        color: "#3b3b98",
        status: "deadline_gone",
        what_you_get: [
          "SRM Institute of Science & Technology admission",
          "B.Tech across all campuses",
          "Merit scholarships based on score",
          "No JEE Main score needed",
        ],
        link: "/private/srm",
      },
      {
        name: "LPUNEST 2026",
        short: "LPUNEST",
        date: "Jan – Mar 2026 (Ongoing)",
        fee: "Free",
        seats: "~15,000+",
        body: "LPU",
        color: "#386641",
        status: "deadline_gone",
        what_you_get: [
          "Lovely Professional University admission",
          "Merit-based scholarships up to 100%",
          "B.Tech / B.Des / BCA / B.Sc",
          "No entrance test required (direct JEE Main score)",
        ],
        link: "/private/lpu",
      },
      {
        name: "VITEEE 2026",
        short: "VITEEE",
        date: "Apr 19 – 25, 2026",
        fee: "₹1,350",
        seats: "~15,000+ (VIT Vellore + Chennai)",
        body: "VIT",
        color: "#2a2a3c",
        status: "deadline_gone",
        what_you_get: [
          "VIT Vellore & Chennai B.Tech admission",
          "Flexible Credit System (FFCS) from Year 1",
          "No Chemistry in paper (only PCM/PCB)",
          "Rank-based branch & campus allocation",
        ],
        link: "/private/vit",
      },
    ],
  },

  /* ── Phase 2: Apr–May 2026 ── */
  {
    phase: "Advanced & Premier",
    period: "Apr – May 2026",
    phaseColor: "#7c3aed",
    phaseBg: "rgba(124,58,237,.08)",
    exams: [
      {
        name: "JEE Main Session 2",
        short: "JEE Main S2",
        date: "Apr 1 – 8, 2026",
        fee: "₹1,000 (Gen) · ₹500 (SC/ST/PwD)",
        seats: "~43,600 (shared with S1)",
        body: "NTA",
        color: "#F47B20",
        status: "deadline_gone",
        what_you_get: [
          "Second chance to improve JEE Main score",
          "Best of 2 sessions auto-counted",
          "Top 2.5L qualify for JEE Advanced",
          "Final rank basis for JoSAA counselling",
        ],
        link: "/jee-main",
      },
      {
        name: "KIITEE 2026",
        short: "KIITEE",
        date: "Apr 2026",
        fee: "₹1,500",
        seats: "~4,000+ (KIIT Bhubaneswar)",
        body: "KIIT University",
        color: "#2d6a4f",
        status: "deadline_gone",
        what_you_get: [
          "KIIT University Bhubaneswar admission",
          "B.Tech in 20+ branches",
          "KIIT is an Institute of Eminence",
          "Hostel-based residential campus",
        ],
        link: "/private/kiit",
      },
      {
        name: "MET 2026 (Manipal)",
        short: "MET",
        date: "Apr – May 2026",
        fee: "₹2,000",
        seats: "~5,000+ (MIT Manipal + MAHE)",
        body: "MAHE",
        color: "#0b525b",
        status: "deadline_gone",
        what_you_get: [
          "Manipal Institute of Technology (MIT) admission",
          "Also valid for MAHE Manipal B.Tech",
          "Optional: accept JEE Main score directly",
          "Online CBT exam",
        ],
        link: "/private/manipal",
      },
      {
        name: "JEE Advanced 2026",
        short: "JEE Adv.",
        date: "May 18, 2026",
        fee: "₹3,600 (Gen) · ₹1,600 (SC/ST/PwD/Female)",
        seats: "~17,385 (23 IITs)",
        body: "IIT (rotational)",
        color: "#1c1c28",
        status: "deadline_gone",
        what_you_get: [
          "Admission to all 23 IITs",
          "2 papers (Paper 1 + Paper 2 both compulsory)",
          "Top-ranked seats: IIT Bombay, Delhi, Madras",
          "Only top 2.5L JEE Main qualifiers eligible",
        ],
        link: "/jee-advanced",
      },
    ],
  },

  /* ── Phase 3: Jun–Aug 2026 ── */
  {
    phase: "Counselling Season",
    period: "Jun – Aug 2026",
    phaseColor: "#15a06e",
    phaseBg: "rgba(21,160,110,.08)",
    exams: [
      {
        name: "JoSAA Counselling 2026",
        short: "JoSAA",
        date: "Jun 15 – Jul 25, 2026 (6 rounds)",
        fee: "₹15,000 (seat acceptance fee)",
        seats: "60,000+ (IIT+NIT+IIIT+GFTI combined)",
        body: "JoSAA (JOSAA.NIC.IN)",
        color: "#F47B20",
        status: "upcoming",
        what_you_get: [
          "Admission to IITs, NITs, IIITs, GFTIs",
          "6 rounds of allotment + 2 CSAB special rounds",
          "Float/Slide/Upgrade mechanism for better college/branch",
          "All 60K+ government-funded engineering seats",
        ],
        link: "/josaa-2026",
      },
      {
        name: "CSAB Special Rounds",
        short: "CSAB",
        date: "Jul 20 – Aug 10, 2026",
        fee: "₹5,000 (refundable)",
        seats: "Vacant NIT/IIIT/GFTI seats",
        body: "CSAB",
        color: "#0ea5a4",
        status: "upcoming",
        what_you_get: [
          "Second chance at NITs/IIITs after JoSAA",
          "Vacant seats at all participating institutes",
          "NEUT + SUPERNUMERARY special rounds",
          "No fresh JEE score needed",
        ],
        link: "/josaa-2026",
      },
      {
        name: "Private College Counselling",
        short: "Private",
        date: "Jun – Aug 2026 (college-specific)",
        fee: "Varies by college",
        seats: "50,000+ across all private colleges",
        body: "Individual universities",
        color: "#8b5cf6",
        status: "upcoming",
        what_you_get: [
          "VIT, SRM, Manipal, BITS (via their portals)",
          "Amity, LPU, Bennett, UPES, Chandigarh U.",
          "Slots based on entrance exam rank/JEE score",
          "Scholarship offered by many at this stage",
        ],
        link: "/private-universities",
      },
    ],
  },
];

const STATUS_META = {
  upcoming:      { label: "Upcoming",      bg: "rgba(244,123,32,.13)", color: "#F47B20",  icon: "🔜" },
  flagship:      { label: "Flagship",      bg: "rgba(244,123,32,.15)", color: "#F47B20",  icon: "⭐" },
  open:          { label: "Open Now",      bg: "rgba(21,160,110,.13)", color: "#15a06e",  icon: "✅" },
  deadline_gone: { label: "Deadline Gone", bg: "rgba(107,114,128,.10)", color: "#9ca3af", icon: "⏰" },
  completed:     { label: "Completed",     bg: "rgba(99,102,241,.12)", color: "#6366f1",  icon: "✔" },
};

/* ── Exam Card ──────────────────────────────────────────────── */
function ExamCard({ exam, index }) {
  const [expanded, setExpanded] = useState(false);
  const sm = STATUS_META[exam.status] || STATUS_META.upcoming;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "#fff",
        backdropFilter: "blur(10px)",
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,.08)",
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(0,0,0,.07)",
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "16px 18px", cursor: "pointer",
          background: expanded ? `${exam.color}18` : "transparent",
          transition: "background .2s",
          borderBottom: expanded ? `1px solid ${exam.color}22` : "none",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Color indicator */}
        <div style={{
          width: 44, height: 44, borderRadius: 11,
          background: `linear-gradient(135deg, ${exam.color}22, ${exam.color}44)`,
          border: `1.5px solid ${exam.color}44`,
          display: "grid", placeItems: "center", flexShrink: 0,
        }}>
          <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 10, color: exam.color, letterSpacing: "0.3px", textAlign: "center" }}>
            {exam.short}
          </span>
        </div>

        {/* Name + date */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <h4 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: "0.92rem", color: "#1a1a2e", margin: 0 }}>
              {exam.name}
            </h4>
            <span style={{ padding: "2px 10px", borderRadius: 50, fontSize: 10, fontWeight: 700, background: sm.bg, color: sm.color, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span>{sm.icon}</span> {sm.label}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6b7280" }}>
            <Calendar size={11} /> {exam.date}
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexShrink: 0 }}>
          <div style={{ textAlign: "center", display: "none" }} className="exam-stat-desktop">
            <div style={{ fontSize: 11, color: "#9ca3af" }}>Seats</div>
            <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13, color: "#1a1a2e" }}>
              {exam.seats.split("(")[0].trim()}
            </div>
          </div>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4 }}>
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "18px 18px 20px" }}>
              {/* Info grid */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 10, marginBottom: 18,
              }}>
                {[
                  { icon: IndianRupee, label: "Application Fee", value: exam.fee },
                  { icon: Users,       label: "Total Seats",      value: exam.seats },
                  { icon: Trophy,      label: "Conducted by",     value: exam.body },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{
                    background: "#f9f5f2", borderRadius: 10,
                    padding: "10px 14px", border: "1px solid rgba(0,0,0,.07)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#6b7280", marginBottom: 4 }}>
                      <Icon size={11} /> {label}
                    </div>
                    <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13, color: "#1a1a2e" }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* What you get */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 10 }}>
                  What you get
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {exam.what_you_get.map((item) => (
                    <div key={item} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13, color: "#374151" }}>
                      <CheckCircle2 size={14} color={exam.color} style={{ flexShrink: 0, marginTop: 1 }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <a
                href={exam.link}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "9px 18px", borderRadius: 10,
                  background: exam.color,
                  color: "#fff", fontSize: 13, fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: `0 4px 14px ${exam.color}44`,
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
              >
                Full Details <ExternalLink size={13} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main Component ─────────────────────────────────────────── */
export default function ExamCycle() {
  const [activePhase, setActivePhase] = useState(null);

  return (
    <section id="exam-cycle" className="section" style={{ background: "linear-gradient(160deg, #ffffff 0%, #ffffff 40%, #ffffff 100%)", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}>
      <div className="container">

        {/* Header */}
        <motion.div
          className="title-bar"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow">
            <Sparkles size={11} /> Exam Cycle 2025–2026
          </span>
          <h2 className="section-title" style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", color: "#1a1a2e" }}>
            Complete Exam Timeline <span className="accent">Sep 2025 → Dec 2026</span>
          </h2>
          <p className="section-sub" style={{ color: "#4b5563" }}>
            Every major engineering entrance — dates, application fees, total seats, and exactly what you unlock by qualifying.
          </p>
        </motion.div>

        {/* Phase navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}
        >
          <button
            onClick={() => setActivePhase(null)}
            style={{
              padding: "9px 18px", borderRadius: 50,
              fontSize: 13, fontWeight: 600, fontFamily: "Sora",
              cursor: "pointer", transition: "all .2s",
              border: !activePhase ? "2px solid #F47B20" : "2px solid rgba(0,0,0,.15)",
              background: !activePhase ? "#F47B20" : "#fff",
              color: !activePhase ? "#fff" : "#6b7280",
            }}
          >
            All Phases
          </button>
          {EXAM_CYCLE.map((phase) => (
            <button
              key={phase.phase}
              onClick={() => setActivePhase(activePhase === phase.phase ? null : phase.phase)}
              style={{
                padding: "9px 18px", borderRadius: 50,
                fontSize: 13, fontWeight: 600, fontFamily: "Sora",
                cursor: "pointer", transition: "all .2s",
                border: activePhase === phase.phase ? `2px solid ${phase.phaseColor}` : "2px solid rgba(0,0,0,.12)",
                background: activePhase === phase.phase ? phase.phaseColor : "#fff",
                color: activePhase === phase.phase ? "#fff" : "#6b7280",
              }}
            >
              {phase.period}
            </button>
          ))}
        </motion.div>

        {/* Phase blocks */}
        <div style={{ display: "flex", flexDirection: "column", gap: 36, position: "relative" }}>
          {/* Vertical timeline line */}
          <div style={{ position: "absolute", left: 21, top: 18, bottom: 18, width: 2, background: "linear-gradient(to bottom, rgba(244,123,32,.5), rgba(244,123,32,.08))", borderRadius: 2, pointerEvents: "none", zIndex: 0 }} />
          {EXAM_CYCLE
            .filter((ph) => !activePhase || ph.phase === activePhase)
            .map((phase, pi) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: pi * 0.06 }}
              >
                {/* Phase header */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 14,
                  marginBottom: 18, position: "relative", zIndex: 1,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: `linear-gradient(135deg, ${phase.phaseColor}, ${phase.phaseColor}cc)`,
                    border: `3px solid ${phase.phaseColor}33`,
                    boxShadow: `0 0 16px ${phase.phaseColor}44`,
                    display: "grid", placeItems: "center",
                    fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: 15, color: "#fff",
                  }}>
                    {pi + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: phase.phaseColor, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Space Grotesk','Sora',sans-serif" }}>
                      Phase {pi + 1}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#1c1c28" }}>
                      {phase.phase} · <span style={{ color: "#9ca3af", fontSize: "0.95rem" }}>{phase.period}</span>
                    </div>
                  </div>
                  <span style={{
                    marginLeft: "auto",
                    padding: "4px 12px", borderRadius: 50,
                    background: phase.phaseBg, color: phase.phaseColor,
                    fontSize: 11.5, fontWeight: 700,
                  }}>
                    {phase.exams.length} exam{phase.exams.length > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Exam cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {phase.exams.map((exam, ei) => (
                    <ExamCard key={exam.name} exam={exam} index={ei} />
                  ))}
                </div>
              </motion.div>
            ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            marginTop: 40,
            background: "rgba(244,123,32,.06)",
            border: "1px solid rgba(244,123,32,.18)",
            borderRadius: 12, padding: "14px 20px",
            display: "flex", alignItems: "center", gap: 10,
            fontSize: 13, color: "#92400e",
          }}
        >
          <Clock size={15} color="#F47B20" style={{ flexShrink: 0 }} />
          <span>
            Dates are indicative based on previous year patterns. Always verify from official websites before applying.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
