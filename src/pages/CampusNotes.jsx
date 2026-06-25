import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Search, FileText, Download, Heart, Eye, X, ChevronRight, ChevronLeft,
  BookOpen, GraduationCap, Building2, FolderOpen, Filter, Clock, TrendingUp,
  Plus, Check, Star, MessageCircle, ArrowLeft, Users, Sparkles, SlidersHorizontal,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const STUDENT_TYPES = [
  { id: "ug", label: "UG Student", desc: "B.Tech / B.E. / B.Sc", icon: GraduationCap, color: "#FF693D" },
  { id: "pg", label: "PG Student", desc: "M.Tech / MBA / M.Sc", icon: BookOpen, color: "#6366f1" },
];

const COLLEGES = {
  ug: [
    "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur",
    "IIT Roorkee", "IIT Guwahati", "IIT Hyderabad", "NIT Trichy", "NIT Warangal",
    "NIT Surathkal", "NIT Rourkela", "NIT Calicut", "BITS Pilani", "BITS Goa",
    "VIT Vellore", "SRM Chennai", "Manipal Institute", "IIIT Hyderabad", "DTU Delhi",
    "NSUT Delhi", "Jadavpur University", "BHU Varanasi", "PEC Chandigarh", "COEP Pune",
    "Other College",
  ],
  pg: [
    "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur",
    "IIM Ahmedabad", "IIM Bangalore", "IIM Calcutta", "IIM Lucknow",
    "NIT Trichy", "NIT Warangal", "BITS Pilani", "ISM Dhanbad",
    "Other Institute",
  ],
};

const BRANCHES = {
  ug: [
    { id: "cse", label: "Computer Science & Engineering", short: "CSE", color: "#6366f1", icon: "💻" },
    { id: "ece", label: "Electronics & Communication", short: "ECE", color: "#0ea5e9", icon: "📡" },
    { id: "eee", label: "Electrical Engineering", short: "EEE", color: "#f59e0b", icon: "⚡" },
    { id: "me", label: "Mechanical Engineering", short: "ME", color: "#e5484d", icon: "⚙️" },
    { id: "ce", label: "Civil Engineering", short: "CE", color: "#15803d", icon: "🏗️" },
    { id: "che", label: "Chemical Engineering", short: "ChE", color: "#8b5cf6", icon: "🧪" },
    { id: "bio", label: "Biotechnology", short: "BT", color: "#10b981", icon: "🧬" },
    { id: "math", label: "Mathematics & Computing", short: "M&C", color: "#ec4899", icon: "📐" },
    { id: "phy", label: "Engineering Physics", short: "EP", color: "#14b8a6", icon: "🔬" },
    { id: "meta", label: "Metallurgical Engineering", short: "Meta", color: "#a855f7", icon: "🔩" },
    { id: "aero", label: "Aerospace Engineering", short: "Aero", color: "#3b82f6", icon: "✈️" },
    { id: "ai", label: "AI & Data Science", short: "AI/DS", color: "#FF693D", icon: "🤖" },
  ],
  pg: [
    { id: "cse", label: "Computer Science", short: "CSE", color: "#6366f1", icon: "💻" },
    { id: "ece", label: "Electronics & Comm", short: "ECE", color: "#0ea5e9", icon: "📡" },
    { id: "me", label: "Mechanical", short: "ME", color: "#e5484d", icon: "⚙️" },
    { id: "mba", label: "MBA", short: "MBA", color: "#f59e0b", icon: "📊" },
    { id: "msc", label: "M.Sc Physics / Chemistry", short: "M.Sc", color: "#10b981", icon: "🔬" },
  ],
};

const SEMESTERS = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8"];

const SUBJECTS_BY_BRANCH = {
  cse: {
    "Sem 1": ["Mathematics I", "Physics", "Basic Electronics", "Programming in C", "English"],
    "Sem 2": ["Mathematics II", "Chemistry", "Data Structures", "Digital Logic", "Economics"],
    "Sem 3": ["Discrete Maths", "OOP (Java/C++)", "Computer Organisation", "DBMS", "Probability & Stats"],
    "Sem 4": ["Operating Systems", "Algorithms", "Software Engineering", "Computer Networks", "Theory of Computation"],
    "Sem 5": ["Machine Learning", "Compiler Design", "Web Technologies", "Cryptography", "Elective I"],
    "Sem 6": ["Artificial Intelligence", "Cloud Computing", "Big Data", "Cyber Security", "Elective II"],
    "Sem 7": ["Deep Learning", "NLP", "Blockchain", "Project I", "Elective III"],
    "Sem 8": ["Final Year Project", "Elective IV", "Seminar"],
  },
  ece: {
    "Sem 1": ["Mathematics I", "Physics", "Basic Electrical", "Programming in C", "English"],
    "Sem 2": ["Mathematics II", "Chemistry", "Electronic Devices", "Digital Electronics", "Signals & Systems"],
    "Sem 3": ["Network Theory", "Analog Circuits", "Electromagnetic Theory", "Microprocessors", "Probability"],
    "Sem 4": ["Control Systems", "Communication Systems", "VLSI Design", "DSP", "Antenna Theory"],
    "Sem 5": ["Embedded Systems", "Wireless Communication", "Optical Communication", "IoT", "Elective I"],
    "Sem 6": ["Radar Engineering", "Satellite Comm", "Robotics", "Elective II", "Elective III"],
    "Sem 7": ["Advanced VLSI", "5G Networks", "Project I", "Elective IV"],
    "Sem 8": ["Final Year Project", "Seminar"],
  },
  eee: {
    "Sem 1": ["Mathematics I", "Physics", "Basic Electronics", "Programming", "English"],
    "Sem 2": ["Mathematics II", "Chemistry", "Circuit Theory", "Digital Logic", "Electrical Machines I"],
    "Sem 3": ["Electrical Machines II", "Power Systems", "Control Systems", "Measurements", "Signals"],
    "Sem 4": ["Power Electronics", "Transmission & Distribution", "Microprocessors", "Electromagnetic Theory", "Elective I"],
    "Sem 5": ["Renewable Energy", "High Voltage Engineering", "Switchgear & Protection", "Elective II", "Project I"],
    "Sem 6": ["Smart Grid", "Electric Drives", "Elective III", "Elective IV", "Project II"],
    "Sem 7": ["Power System Analysis", "Elective V", "Project III"],
    "Sem 8": ["Final Year Project", "Seminar"],
  },
  me: {
    "Sem 1": ["Mathematics I", "Physics", "Basic Electrical", "Engineering Drawing", "English"],
    "Sem 2": ["Mathematics II", "Chemistry", "Material Science", "Thermodynamics", "Manufacturing"],
    "Sem 3": ["Fluid Mechanics", "Strength of Materials", "Kinematics of Machinery", "Engineering Metallurgy", "Statistics"],
    "Sem 4": ["Heat Transfer", "Dynamics of Machinery", "Machine Design I", "Manufacturing Technology", "Elective I"],
    "Sem 5": ["IC Engines", "Refrigeration & AC", "Machine Design II", "FEA", "Elective II"],
    "Sem 6": ["CAD/CAM", "Robotics", "Industrial Engineering", "Elective III", "Project I"],
    "Sem 7": ["Mechatronics", "Elective IV", "Project II"],
    "Sem 8": ["Final Year Project", "Seminar"],
  },
};

// Fallback for branches without explicit subjects
const GENERIC_SUBJECTS = {
  "Sem 1": ["Mathematics I", "Physics", "Basic Engineering", "Programming", "English"],
  "Sem 2": ["Mathematics II", "Chemistry", "Core Subject I", "Core Subject II", "Economics"],
  "Sem 3": ["Core Subject III", "Core Subject IV", "Elective I", "Lab I", "Statistics"],
  "Sem 4": ["Core Subject V", "Core Subject VI", "Elective II", "Lab II", "Seminar"],
  "Sem 5": ["Advanced Topic I", "Advanced Topic II", "Elective III", "Lab III", "Mini Project"],
  "Sem 6": ["Advanced Topic III", "Elective IV", "Elective V", "Lab IV", "Project I"],
  "Sem 7": ["Specialisation I", "Specialisation II", "Project II"],
  "Sem 8": ["Final Year Project", "Seminar"],
};

function getSubjects(branchId, sem) {
  return (SUBJECTS_BY_BRANCH[branchId] && SUBJECTS_BY_BRANCH[branchId][sem]) || GENERIC_SUBJECTS[sem] || [];
}

/* helper: format date */
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function CampusNotes() {
  /* ── persistent state ── */
  const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(`cn_${key}`)) ?? fallback; } catch { return fallback; } };
  const save = (key, val) => { localStorage.setItem(`cn_${key}`, JSON.stringify(val)); };

  const [step, setStep] = useState(() => load("step", "type"));       // type → college → browse
  const [studentType, setStudentType] = useState(() => load("stype", null));
  const [college, setCollege] = useState(() => load("college", null));
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSem, setSelectedSem] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [notes, setNotes] = useState(() => load("notes", []));
  const [liked, setLiked] = useState(() => load("liked", []));
  const [collegeSearch, setCollegeSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const fileRef = useRef(null);

  // persist key selections
  useEffect(() => { save("step", step); }, [step]);
  useEffect(() => { save("stype", studentType); }, [studentType]);
  useEffect(() => { save("college", college); }, [college]);
  useEffect(() => { save("notes", notes); }, [notes]);
  useEffect(() => { save("liked", liked); }, [liked]);

  /* ── pick student type ── */
  const pickType = (t) => { setStudentType(t); setStep("college"); };
  /* ── pick college ── */
  const pickCollege = (c) => { setCollege(c); setStep("browse"); };
  /* ── go back ── */
  const goBack = () => {
    if (selectedSubject) { setSelectedSubject(null); return; }
    if (selectedSem) { setSelectedSem(null); return; }
    if (selectedBranch) { setSelectedBranch(null); return; }
    if (step === "browse") { setStep("college"); return; }
    if (step === "college") { setStep("type"); return; }
  };
  /* ── reset ── */
  const resetAll = () => { setStep("type"); setStudentType(null); setCollege(null); setSelectedBranch(null); setSelectedSem(null); setSelectedSubject(null); };

  /* ── upload handler ── */
  const handleUpload = (formData) => {
    const newNote = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      subject: formData.subject || selectedSubject,
      branch: selectedBranch?.id || formData.branchId,
      branchLabel: selectedBranch?.label || formData.branchLabel,
      semester: selectedSem || formData.semester,
      college,
      studentType,
      author: formData.author || "Anonymous",
      fileName: formData.fileName,
      fileSize: formData.fileSize,
      fileType: formData.fileType,
      timestamp: Date.now(),
      downloads: 0,
      likes: 0,
      views: 0,
    };
    setNotes((prev) => [newNote, ...prev]);
    setUploadOpen(false);
  };

  const toggleLike = (id) => {
    setLiked((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, likes: liked.includes(id) ? n.likes - 1 : n.likes + 1 } : n));
  };

  /* ── filter notes ── */
  const filteredNotes = notes.filter((n) => {
    if (selectedBranch && n.branch !== selectedBranch.id) return false;
    if (selectedSem && n.semester !== selectedSem) return false;
    if (selectedSubject && n.subject !== selectedSubject) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.subject?.toLowerCase().includes(q) || n.branchLabel?.toLowerCase().includes(q) || n.author?.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "newest") return b.timestamp - a.timestamp;
    if (sortBy === "popular") return b.likes - a.likes;
    if (sortBy === "downloads") return b.downloads - a.downloads;
    return 0;
  });

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>
      {/* ── Hero Section ── */}
      <section style={{
        background: "linear-gradient(135deg, #FFF5F0 0%, #FFF 40%, #F0F0FF 100%)",
        padding: "140px 20px 60px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,105,61,0.06) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFF3ED", borderRadius: 999, padding: "6px 16px", marginBottom: 20, border: "1px solid #FFD5C2" }}>
            <Sparkles size={14} color="#FF693D" />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FF693D" }}>Campus Community Forums</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: "#1a1a2e", marginBottom: 14, lineHeight: 1.15, letterSpacing: "-0.03em" }}>
            Share & Access Notes <span style={{ color: "#FF693D" }}>Across Campuses</span>
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#64748b", maxWidth: 560, margin: "0 auto 28px", lineHeight: 1.6 }}>
            Upload your study notes, access peer resources, and collaborate with students from top colleges — all in one place.
          </p>

          {step === "browse" && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 999, padding: "8px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.06)" }}>
              <Building2 size={16} color="#FF693D" />
              <span style={{ fontWeight: 700, color: "#1a1a2e" }}>{college}</span>
              <span style={{ color: "#ccc" }}>·</span>
              <span style={{ fontSize: "0.85rem", color: "#64748b" }}>{studentType === "ug" ? "Undergraduate" : "Postgraduate"}</span>
              <button onClick={resetAll} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, marginLeft: 4 }}>
                <X size={14} color="#999" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Hero image */}
        <motion.img
          src="/campus-notes-hero.png"
          alt="Campus Notes"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ maxWidth: 320, margin: "30px auto 0", display: "block", borderRadius: 16 }}
        />
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px 80px" }}>
        <AnimatePresence mode="wait">
          {/* ═══ Step 1: Choose UG / PG ═══ */}
          {step === "type" && (
            <motion.div key="type" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
              <h2 style={{ textAlign: "center", fontSize: "1.4rem", fontWeight: 800, color: "#1a1a2e", marginTop: 40, marginBottom: 8 }}>I am a…</h2>
              <p style={{ textAlign: "center", color: "#64748b", marginBottom: 32 }}>Select your student type to get started</p>
              <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                {STUDENT_TYPES.map((t) => {
                  const Ic = t.icon;
                  return (
                    <motion.button
                      key={t.id}
                      whileHover={{ y: -4, boxShadow: "0 16px 40px -12px rgba(0,0,0,0.12)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => pickType(t.id)}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
                        padding: "36px 48px", borderRadius: 20, background: "#fff", cursor: "pointer",
                        border: "1.5px solid rgba(0,0,0,0.06)", boxShadow: "0 4px 20px -8px rgba(0,0,0,0.06)",
                        transition: "all .2s",
                      }}
                    >
                      <span style={{ width: 60, height: 60, borderRadius: 16, background: `${t.color}14`, display: "grid", placeItems: "center" }}>
                        <Ic size={28} color={t.color} />
                      </span>
                      <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#1a1a2e" }}>{t.label}</span>
                      <span style={{ fontSize: "0.85rem", color: "#64748b" }}>{t.desc}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ═══ Step 2: Choose College ═══ */}
          {step === "college" && studentType && (
            <motion.div key="college" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
              <button onClick={goBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", marginTop: 30, marginBottom: 10, color: "#64748b", fontWeight: 600 }}>
                <ArrowLeft size={16} /> Back
              </button>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>Select your college</h2>
              <p style={{ color: "#64748b", marginBottom: 20 }}>Choose from India's top institutions</p>

              <div style={{ position: "relative", maxWidth: 420, marginBottom: 24 }}>
                <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#999" }} />
                <input
                  type="text"
                  placeholder="Search colleges..."
                  value={collegeSearch}
                  onChange={(e) => setCollegeSearch(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 14px 12px 40px", borderRadius: 12,
                    border: "1.5px solid rgba(0,0,0,0.08)", background: "#fff", fontSize: "0.95rem",
                    outline: "none", fontFamily: "inherit",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                {(COLLEGES[studentType] || [])
                  .filter((c) => c.toLowerCase().includes(collegeSearch.toLowerCase()))
                  .map((c) => (
                    <motion.button
                      key={c}
                      whileHover={{ y: -2, boxShadow: "0 8px 24px -8px rgba(0,0,0,0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => pickCollege(c)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                        borderRadius: 14, background: "#fff", cursor: "pointer",
                        border: "1.5px solid rgba(0,0,0,0.06)", textAlign: "left", fontFamily: "inherit",
                        boxShadow: "0 2px 8px -4px rgba(0,0,0,0.04)",
                      }}
                    >
                      <span style={{ width: 36, height: 36, borderRadius: 10, background: "#FFF3ED", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <Building2 size={16} color="#FF693D" />
                      </span>
                      <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1a1a2e" }}>{c}</span>
                    </motion.button>
                  ))}
              </div>
            </motion.div>
          )}

          {/* ═══ Step 3: Browse — Branches → Semesters → Subjects → Notes ═══ */}
          {step === "browse" && (
            <motion.div key="browse" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
              {/* Breadcrumb */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 30, marginBottom: 24, flexWrap: "wrap" }}>
                <button onClick={goBack} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#64748b", fontWeight: 600 }}>
                  <ArrowLeft size={16} />
                </button>
                <button onClick={() => { setSelectedBranch(null); setSelectedSem(null); setSelectedSubject(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, color: "#FF693D", fontSize: "0.88rem" }}>
                  All Branches
                </button>
                {selectedBranch && (
                  <>
                    <ChevronRight size={14} color="#ccc" />
                    <button onClick={() => { setSelectedSem(null); setSelectedSubject(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, color: selectedSem ? "#64748b" : "#1a1a2e", fontSize: "0.88rem" }}>
                      {selectedBranch.short}
                    </button>
                  </>
                )}
                {selectedSem && (
                  <>
                    <ChevronRight size={14} color="#ccc" />
                    <button onClick={() => setSelectedSubject(null)} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, color: selectedSubject ? "#64748b" : "#1a1a2e", fontSize: "0.88rem" }}>
                      {selectedSem}
                    </button>
                  </>
                )}
                {selectedSubject && (
                  <>
                    <ChevronRight size={14} color="#ccc" />
                    <span style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.88rem" }}>{selectedSubject}</span>
                  </>
                )}
              </div>

              {/* ── Branches grid ── */}
              {!selectedBranch && (
                <>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1a1a2e", marginBottom: 20 }}>Choose your Branch</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
                    {(BRANCHES[studentType] || BRANCHES.ug).map((b) => (
                      <motion.button
                        key={b.id}
                        whileHover={{ y: -3, boxShadow: "0 12px 32px -10px rgba(0,0,0,0.12)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedBranch(b)}
                        style={{
                          display: "flex", alignItems: "center", gap: 14, padding: "18px 20px",
                          borderRadius: 16, background: "#fff", cursor: "pointer",
                          border: "1.5px solid rgba(0,0,0,0.05)", textAlign: "left", fontFamily: "inherit",
                          boxShadow: "0 2px 12px -6px rgba(0,0,0,0.04)",
                        }}
                      >
                        <span style={{ fontSize: "1.6rem", width: 48, height: 48, borderRadius: 14, background: `${b.color}12`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                          {b.icon}
                        </span>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#1a1a2e" }}>{b.short}</div>
                          <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: 2 }}>{b.label}</div>
                        </div>
                        <ChevronRight size={16} color="#ccc" style={{ marginLeft: "auto" }} />
                      </motion.button>
                    ))}
                  </div>
                </>
              )}

              {/* ── Semesters ── */}
              {selectedBranch && !selectedSem && (
                <>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1a1a2e", marginBottom: 20 }}>
                    <span style={{ color: selectedBranch.color }}>{selectedBranch.short}</span> — Select Semester
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                    {SEMESTERS.slice(0, studentType === "pg" ? 4 : 8).map((sem, i) => (
                      <motion.button
                        key={sem}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedSem(sem)}
                        style={{
                          display: "flex", alignItems: "center", gap: 12, padding: "16px 18px",
                          borderRadius: 14, background: "#fff", cursor: "pointer",
                          border: "1.5px solid rgba(0,0,0,0.05)", fontFamily: "inherit",
                          boxShadow: "0 2px 8px -4px rgba(0,0,0,0.04)",
                        }}
                      >
                        <span style={{ width: 40, height: 40, borderRadius: 12, background: `${selectedBranch.color}14`, display: "grid", placeItems: "center", fontWeight: 900, fontSize: "0.95rem", color: selectedBranch.color, flexShrink: 0 }}>
                          {i + 1}
                        </span>
                        <span style={{ fontWeight: 700, color: "#1a1a2e" }}>{sem}</span>
                        <ChevronRight size={16} color="#ccc" style={{ marginLeft: "auto" }} />
                      </motion.button>
                    ))}
                  </div>
                </>
              )}

              {/* ── Subjects ── */}
              {selectedBranch && selectedSem && !selectedSubject && (
                <>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1a1a2e", marginBottom: 20 }}>
                    <span style={{ color: selectedBranch.color }}>{selectedBranch.short}</span> · {selectedSem} — Subjects
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                    {getSubjects(selectedBranch.id, selectedSem).map((sub) => {
                      const count = notes.filter((n) => n.subject === sub && n.branch === selectedBranch.id && n.semester === selectedSem).length;
                      return (
                        <motion.button
                          key={sub}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedSubject(sub)}
                          style={{
                            display: "flex", alignItems: "center", gap: 12, padding: "16px 18px",
                            borderRadius: 14, background: "#fff", cursor: "pointer",
                            border: "1.5px solid rgba(0,0,0,0.05)", fontFamily: "inherit", textAlign: "left",
                            boxShadow: "0 2px 8px -4px rgba(0,0,0,0.04)",
                          }}
                        >
                          <span style={{ width: 40, height: 40, borderRadius: 12, background: "#F0F0FF", display: "grid", placeItems: "center", flexShrink: 0 }}>
                            <BookOpen size={18} color="#6366f1" />
                          </span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a1a2e" }}>{sub}</div>
                            <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: 2 }}>{count} note{count !== 1 ? "s" : ""} uploaded</div>
                          </div>
                          <ChevronRight size={16} color="#ccc" />
                        </motion.button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* ── Notes list for a subject ── */}
              {selectedSubject && (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1a1a2e", margin: 0 }}>
                      📄 {selectedSubject}
                    </h2>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ position: "relative" }}>
                        <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#999" }} />
                        <input
                          placeholder="Search notes..."
                          value={searchQ}
                          onChange={(e) => setSearchQ(e.target.value)}
                          style={{ padding: "8px 12px 8px 32px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)", fontSize: "0.85rem", outline: "none", fontFamily: "inherit", background: "#fff" }}
                        />
                      </div>
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)", fontSize: "0.85rem", fontFamily: "inherit", background: "#fff", cursor: "pointer" }}>
                        <option value="newest">Newest</option>
                        <option value="popular">Most Liked</option>
                        <option value="downloads">Most Downloaded</option>
                      </select>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setUploadOpen(true)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
                          borderRadius: 10, background: "#FF693D", color: "#fff", fontWeight: 700,
                          border: "none", cursor: "pointer", fontSize: "0.88rem",
                        }}
                      >
                        <Upload size={15} /> Upload Notes
                      </motion.button>
                    </div>
                  </div>

                  {filteredNotes.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 16, border: "1.5px dashed rgba(0,0,0,0.08)" }}>
                      <FolderOpen size={48} color="#ddd" style={{ marginBottom: 12 }} />
                      <p style={{ fontWeight: 700, color: "#64748b", marginBottom: 6 }}>No notes yet</p>
                      <p style={{ color: "#94a3b8", fontSize: "0.88rem", marginBottom: 16 }}>Be the first to upload notes for {selectedSubject}!</p>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setUploadOpen(true)}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 12, background: "#FF693D", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}
                      >
                        <Plus size={16} /> Upload First Notes
                      </motion.button>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                      {filteredNotes.map((note) => (
                        <motion.div
                          key={note.id}
                          whileHover={{ y: -3, boxShadow: "0 12px 32px -10px rgba(0,0,0,0.1)" }}
                          style={{
                            background: "#fff", borderRadius: 16, padding: "20px",
                            border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 2px 8px -4px rgba(0,0,0,0.04)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                            <span style={{ width: 44, height: 44, borderRadius: 12, background: "#FFF3ED", display: "grid", placeItems: "center", flexShrink: 0 }}>
                              <FileText size={20} color="#FF693D" />
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h3 style={{ fontWeight: 800, fontSize: "0.95rem", color: "#1a1a2e", margin: 0, lineHeight: 1.3 }}>{note.title}</h3>
                              {note.description && <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 4, lineHeight: 1.4 }}>{note.description}</p>}
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                            <span style={{ fontSize: "0.72rem", background: "#F0F0FF", color: "#6366f1", padding: "3px 8px", borderRadius: 6, fontWeight: 700 }}>{note.fileType || "PDF"}</span>
                            <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{note.fileSize || "–"}</span>
                            <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>by {note.author}</span>
                            <span style={{ fontSize: "0.72rem", color: "#94a3b8", marginLeft: "auto" }}>{timeAgo(note.timestamp)}</span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 14, borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: 12 }}>
                            <button onClick={() => toggleLike(note.id)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", borderRadius: 8, border: "none", background: liked.includes(note.id) ? "#FFF0F0" : "#F8F8F8", cursor: "pointer", color: liked.includes(note.id) ? "#e5484d" : "#64748b", fontWeight: 600, fontSize: "0.8rem" }}>
                              <Heart size={14} fill={liked.includes(note.id) ? "#e5484d" : "none"} /> {note.likes}
                            </button>
                            <button onClick={() => setNotes((p) => p.map((n) => n.id === note.id ? { ...n, downloads: n.downloads + 1 } : n))} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", borderRadius: 8, border: "none", background: "#F8F8F8", cursor: "pointer", color: "#64748b", fontWeight: 600, fontSize: "0.8rem" }}>
                              <Download size={14} /> {note.downloads}
                            </button>
                            <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", fontSize: "0.8rem", color: "#94a3b8" }}>
                              <Eye size={14} /> {note.views}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ Upload Modal ═══ */}
      <AnimatePresence>
        {uploadOpen && (
          <UploadModal
            onClose={() => setUploadOpen(false)}
            onUpload={handleUpload}
            subject={selectedSubject}
            branch={selectedBranch}
            semester={selectedSem}
            branches={BRANCHES[studentType] || BRANCHES.ug}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   UPLOAD MODAL
   ═══════════════════════════════════════════════════════════════════════════ */
function UploadModal({ onClose, onUpload, subject, branch, semester, branches }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileType, setFileType] = useState("PDF");
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize((file.size / 1024).toFixed(1) + " KB");
      const ext = file.name.split(".").pop()?.toUpperCase() || "PDF";
      setFileType(ext);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onUpload({
      title: title.trim(),
      description: description.trim(),
      author: author.trim() || "Anonymous",
      fileName,
      fileSize,
      fileType,
      subject,
      branchId: branch?.id,
      branchLabel: branch?.label,
      semester,
    });
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 2000, backdropFilter: "blur(4px)" }}
      />
      {/* Scrollable wrapper — fills the viewport so the modal can scroll */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 2001,
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          overflowY: "auto", WebkitOverflowScrolling: "touch",
          padding: "60px 16px 40px",
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{
            width: "min(480px, 100%)",
            background: "#fff", borderRadius: 20,
            padding: "28px", boxShadow: "0 32px 64px -16px rgba(0,0,0,0.25)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontWeight: 800, color: "#1a1a2e", margin: 0 }}>📤 Upload Notes</h3>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color="#999" /></button>
          </div>

          {subject && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F0F0FF", borderRadius: 8, padding: "6px 12px", marginBottom: 16, fontSize: "0.82rem", fontWeight: 700, color: "#6366f1" }}>
              <BookOpen size={14} /> {subject}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={labelStyle}>Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Operating Systems — Unit 3 Handwritten Notes" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of what's covered…" rows={2} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div>
              <label style={labelStyle}>Your Name</label>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Anonymous" style={inputStyle} />
            </div>

            {/* File picker */}
            <div>
              <label style={labelStyle}>Attach File</label>
              <input type="file" ref={fileRef} onChange={handleFile} accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.zip" style={{ display: "none" }} />
              <button type="button" onClick={() => fileRef.current?.click()} style={{
                width: "100%", padding: "14px", borderRadius: 12, border: "2px dashed rgba(0,0,0,0.1)",
                background: "#FAFAFA", cursor: "pointer", textAlign: "center", fontFamily: "inherit",
              }}>
                {fileName ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <Check size={16} color="#22c55e" />
                    <span style={{ fontWeight: 700, color: "#1a1a2e" }}>{fileName}</span>
                    <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>({fileSize})</span>
                  </span>
                ) : (
                  <span style={{ color: "#64748b", fontSize: "0.88rem" }}>
                    <Upload size={18} style={{ marginBottom: 4 }} /><br />
                    Click to select file (PDF, DOCX, PPT, Images)
                  </span>
                )}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              style={{
                padding: "13px", borderRadius: 12, background: "#FF693D", color: "#fff",
                fontWeight: 800, border: "none", cursor: "pointer", fontSize: "0.95rem", marginTop: 4,
              }}
            >
              Upload Notes
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  );
}

const labelStyle = { display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#374151", marginBottom: 6 };
const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,0.08)",
  fontSize: "0.9rem", fontFamily: "inherit", outline: "none", background: "#FAFAFA",
  boxSizing: "border-box",
};
