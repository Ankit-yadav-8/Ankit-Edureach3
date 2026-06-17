import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, FlaskConical, Sigma, ChevronRight, ChevronDown,
  Flame, Zap, Star, Clock, Target, ArrowRight,
  CheckCircle2, TrendingUp, ListChecks, Sparkles,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Seo from "../components/Seo.jsx";

/* ── Subject Data ─────────────────────────────────────────── */
const SUBJECTS = [
  {
    id: "math",
    name: "Mathematics",
    short: "Math",
    icon: Sigma,
    color: "#6366f1",
    light: "#eef2ff",
    chapters: 19,
    desc: "Calculus, Algebra, Coordinate Geometry, Vectors & 3D",
    gradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    chapters_list: [
      { n: 1,  name: "Sets, Relations & Functions",    diff: "medium", jee: "Main",     topics: ["Roster & Set-builder", "Venn Diagrams", "Domain/Range"] },
      { n: 2,  name: "Complex Numbers",                diff: "hard",   jee: "Advanced", topics: ["Argand Plane", "De Moivre's", "Modulus/Argument"] },
      { n: 3,  name: "Quadratic Equations",            diff: "medium", jee: "Main",     topics: ["Discriminant", "Nature of roots", "Sum/Product"] },
      { n: 4,  name: "Sequences & Series",             diff: "medium", jee: "Main",     topics: ["AP/GP/HP", "AGP", "Sum formulas"] },
      { n: 5,  name: "Permutations & Combinations",   diff: "hard",   jee: "Main",     topics: ["Factorial", "nPr/nCr", "Circular Permutation"] },
      { n: 6,  name: "Binomial Theorem",               diff: "medium", jee: "Main",     topics: ["General Term", "Middle Term", "Properties"] },
      { n: 7,  name: "Matrices & Determinants",        diff: "medium", jee: "Main",     topics: ["Types of Matrices", "Cofactors", "Adjoint/Inverse"] },
      { n: 8,  name: "Limits, Continuity & Differentiability", diff: "hard", jee: "Advanced", topics: ["L'Hôpital's Rule", "Sandwich Theorem", "LHL/RHL"] },
      { n: 9,  name: "Differentiation & Applications",diff: "hard",   jee: "Advanced", topics: ["Chain Rule", "Implicit Diff.", "Maxima/Minima"] },
      { n: 10, name: "Integration",                    diff: "hard",   jee: "Advanced", topics: ["Definite Integrals", "By Parts", "Area under curve"] },
      { n: 11, name: "Differential Equations",         diff: "medium", jee: "Main",     topics: ["Variable Separable", "Homogeneous", "Linear DE"] },
      { n: 12, name: "Straight Lines & Circles",       diff: "medium", jee: "Main",     topics: ["Slope Form", "Intercept Form", "Tangent/Normal"] },
      { n: 13, name: "Conic Sections",                 diff: "hard",   jee: "Advanced", topics: ["Parabola", "Ellipse", "Hyperbola"] },
      { n: 14, name: "Vectors",                        diff: "medium", jee: "Main",     topics: ["Dot Product", "Cross Product", "Triple Product"] },
      { n: 15, name: "3D Geometry",                    diff: "medium", jee: "Main",     topics: ["Direction Cosines", "Planes", "Lines in Space"] },
      { n: 16, name: "Probability",                    diff: "medium", jee: "Main",     topics: ["Bayes' Theorem", "Conditional Prob.", "Distributions"] },
      { n: 17, name: "Trigonometry",                   diff: "medium", jee: "Main",     topics: ["Identities", "Equations", "Heights & Distances"] },
      { n: 18, name: "Inverse Trigonometric Functions",diff: "medium", jee: "Main",     topics: ["Domains", "Properties", "Equations"] },
      { n: 19, name: "Mathematical Reasoning",          diff: "easy",   jee: "Main",     topics: ["Statements", "Logical Connectives", "Quantifiers"] },
    ],
  },
  {
    id: "physics",
    name: "Physics",
    short: "Phy",
    icon: Zap,
    color: "#f97316",
    light: "#ffffff",
    chapters: 25,
    desc: "Mechanics, Electrodynamics, Optics, Modern Physics",
    gradient: "linear-gradient(135deg, #E0421F 0%, #dc2626 100%)",
    chapters_list: [
      { n: 1,  name: "Units & Dimensions",             diff: "easy",   jee: "Main",     topics: ["SI Units", "Dimensional Analysis", "Error"] },
      { n: 2,  name: "Kinematics",                     diff: "easy",   jee: "Main",     topics: ["Equations of motion", "Projectile", "Relative motion"] },
      { n: 3,  name: "Newton's Laws of Motion",        diff: "medium", jee: "Main",     topics: ["Free Body Diagrams", "Friction", "Pulley systems"] },
      { n: 4,  name: "Work, Energy & Power",           diff: "medium", jee: "Main",     topics: ["Work-Energy theorem", "Conservative forces", "Potential energy"] },
      { n: 5,  name: "Rotational Motion",              diff: "hard",   jee: "Advanced", topics: ["Moment of Inertia", "Torque", "Angular Momentum"] },
      { n: 6,  name: "Gravitation",                    diff: "medium", jee: "Main",     topics: ["Kepler's Laws", "Satellites", "Gravitational Potential"] },
      { n: 7,  name: "Properties of Matter",           diff: "medium", jee: "Main",     topics: ["Elasticity", "Surface Tension", "Viscosity"] },
      { n: 8,  name: "Thermodynamics",                 diff: "hard",   jee: "Advanced", topics: ["Laws of Thermodynamics", "Carnot Engine", "Entropy"] },
      { n: 9,  name: "Oscillations (SHM)",             diff: "medium", jee: "Main",     topics: ["Simple Pendulum", "Spring System", "Resonance"] },
      { n: 10, name: "Waves",                          diff: "medium", jee: "Main",     topics: ["Superposition", "Beats", "Doppler Effect"] },
      { n: 11, name: "Electrostatics",                 diff: "hard",   jee: "Advanced", topics: ["Coulomb's Law", "Gauss's Law", "Capacitors"] },
      { n: 12, name: "Current Electricity",            diff: "medium", jee: "Main",     topics: ["Ohm's Law", "Kirchhoff's Laws", "Wheatstone Bridge"] },
      { n: 13, name: "Magnetic Effects of Current",    diff: "medium", jee: "Main",     topics: ["Biot-Savart Law", "Ampere's Law", "Moving charges"] },
      { n: 14, name: "Electromagnetic Induction",      diff: "hard",   jee: "Advanced", topics: ["Faraday's Laws", "Lenz's Law", "Self/Mutual Induction"] },
      { n: 15, name: "Alternating Current",            diff: "medium", jee: "Main",     topics: ["RMS values", "LC Circuit", "Transformers"] },
      { n: 16, name: "Ray Optics",                     diff: "medium", jee: "Main",     topics: ["Snell's Law", "Prism", "Lens formula"] },
      { n: 17, name: "Wave Optics",                    diff: "hard",   jee: "Advanced", topics: ["Young's Double Slit", "Diffraction", "Polarisation"] },
      { n: 18, name: "Dual Nature of Matter",          diff: "medium", jee: "Main",     topics: ["Photoelectric Effect", "de Broglie", "Matter waves"] },
      { n: 19, name: "Atomic Structure (Modern)",      diff: "medium", jee: "Main",     topics: ["Bohr Model", "Hydrogen Spectrum", "Quantum numbers"] },
      { n: 20, name: "Nuclei",                         diff: "medium", jee: "Main",     topics: ["Binding Energy", "Radioactivity", "Fission/Fusion"] },
      { n: 21, name: "Semiconductor Devices",          diff: "easy",   jee: "Main",     topics: ["p-n Junction", "Transistors", "Logic Gates"] },
      { n: 22, name: "Communication Systems",          diff: "easy",   jee: "Main",     topics: ["Modulation", "AM/FM", "Bandwidth"] },
      { n: 23, name: "Experimental Physics",           diff: "medium", jee: "Advanced", topics: ["Vernier Caliper", "Screw Gauge", "Potentiometer"] },
      { n: 24, name: "Kinetic Theory of Gases",        diff: "medium", jee: "Main",     topics: ["Mean free path", "RMS Speed", "Degrees of Freedom"] },
      { n: 25, name: "EM Waves",                       diff: "easy",   jee: "Main",     topics: ["EM Spectrum", "Properties", "Energy density"] },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    short: "Chem",
    icon: FlaskConical,
    color: "#10b981",
    light: "#ecfdf5",
    chapters: 29,
    desc: "Physical, Inorganic & Organic Chemistry for JEE",
    gradient: "linear-gradient(135deg, #059669 0%, #0891b2 100%)",
    chapters_list: [
      { n: 1,  name: "Basic Concepts of Chemistry",   diff: "easy",   jee: "Main",     topics: ["Mole concept", "Stoichiometry", "Limiting reagent"] },
      { n: 2,  name: "Atomic Structure",              diff: "medium", jee: "Main",     topics: ["Quantum numbers", "Orbitals", "Electronic config."] },
      { n: 3,  name: "Chemical Bonding",              diff: "medium", jee: "Main",     topics: ["VSEPR", "MO theory", "Hybridisation"] },
      { n: 4,  name: "Thermodynamics (Chem)",         diff: "hard",   jee: "Advanced", topics: ["Hess's Law", "Bond Enthalpy", "Entropy/Gibbs"] },
      { n: 5,  name: "Chemical Equilibrium",          diff: "hard",   jee: "Advanced", topics: ["Kp/Kc", "Le Chatelier's Principle", "Degree of dissociation"] },
      { n: 6,  name: "Ionic Equilibrium",             diff: "hard",   jee: "Advanced", topics: ["pH calculations", "Buffer solutions", "Solubility product"] },
      { n: 7,  name: "Electrochemistry",              diff: "hard",   jee: "Advanced", topics: ["Nernst equation", "Electrolysis", "Galvanic cells"] },
      { n: 8,  name: "Chemical Kinetics",             diff: "medium", jee: "Main",     topics: ["Rate law", "Arrhenius equation", "Order of reaction"] },
      { n: 9,  name: "Solutions",                     diff: "medium", jee: "Main",     topics: ["Molarity/Molality", "Colligative properties", "Van't Hoff"] },
      { n: 10, name: "Solid State",                   diff: "medium", jee: "Main",     topics: ["Crystal systems", "Packing efficiency", "Defects"] },
      { n: 11, name: "Surface Chemistry",             diff: "easy",   jee: "Main",     topics: ["Adsorption", "Colloids", "Catalysis"] },
      { n: 12, name: "Hydrogen & s-Block",            diff: "easy",   jee: "Main",     topics: ["Alkali metals", "Alkaline earth", "Water chemistry"] },
      { n: 13, name: "p-Block Elements (Group 13–14)", diff: "medium", jee: "Main",    topics: ["Boron family", "Carbon family", "Silicates"] },
      { n: 14, name: "p-Block Elements (Group 15–18)", diff: "medium", jee: "Main",    topics: ["Nitrogen oxides", "Sulphur compounds", "Noble gases"] },
      { n: 15, name: "d & f-Block Elements",          diff: "medium", jee: "Main",     topics: ["Transition metals", "Lanthanides", "Actinides"] },
      { n: 16, name: "Coordination Compounds",        diff: "hard",   jee: "Advanced", topics: ["IUPAC nomenclature", "Isomerism", "Crystal Field theory"] },
      { n: 17, name: "Basic Organic Chemistry",       diff: "medium", jee: "Main",     topics: ["IUPAC naming", "Reaction mechanisms", "Isomerism"] },
      { n: 18, name: "Hydrocarbons",                  diff: "medium", jee: "Main",     topics: ["Alkanes", "Alkenes/Alkynes", "Aromatic Hydrocarbons"] },
      { n: 19, name: "Haloalkanes & Haloarenes",      diff: "medium", jee: "Main",     topics: ["SN1/SN2", "Elimination", "Nucleophilicity"] },
      { n: 20, name: "Alcohols, Phenols & Ethers",    diff: "medium", jee: "Main",     topics: ["Lucas test", "Esterification", "Clemmensen reduction"] },
      { n: 21, name: "Aldehydes & Ketones",           diff: "hard",   jee: "Advanced", topics: ["Aldol condensation", "Cannizzaro", "Nucleophilic addition"] },
      { n: 22, name: "Carboxylic Acids & Derivatives",diff: "medium", jee: "Main",    topics: ["Acidity", "Fischer Esterification", "Hell-Volhard-Zelinsky"] },
      { n: 23, name: "Amines",                        diff: "medium", jee: "Main",     topics: ["Basicity", "Diazonium salts", "Gabriel Synthesis"] },
      { n: 24, name: "Biomolecules",                  diff: "easy",   jee: "Main",     topics: ["Carbohydrates", "Proteins", "Nucleic Acids"] },
      { n: 25, name: "Polymers",                      diff: "easy",   jee: "Main",     topics: ["Addition/Condensation", "Rubber", "Synthetic fibres"] },
      { n: 26, name: "Chemistry in Everyday Life",    diff: "easy",   jee: "Main",     topics: ["Drugs", "Soaps & Detergents", "Food preservatives"] },
      { n: 27, name: "Redox Reactions",               diff: "medium", jee: "Main",     topics: ["Oxidation numbers", "Balancing equations", "Half-cell"] },
      { n: 28, name: "Environmental Chemistry",       diff: "easy",   jee: "Main",     topics: ["Air pollution", "Water pollution", "Ozone layer"] },
      { n: 29, name: "States of Matter",              diff: "medium", jee: "Main",     topics: ["Gas laws", "Kinetic theory", "Ideal vs Real"] },
    ],
  },
];

const DIFF_STYLE = {
  easy:   { bg: "rgba(21,160,110,.12)", color: "#15a06e", label: "Easy" },
  medium: { bg: "rgba(245,158,11,.12)", color: "#d97706", label: "Medium" },
  hard:   { bg: "rgba(239,68,68,.12)",  color: "#dc2626", label: "Hard" },
};

const JEE_STYLE = {
  Main:     { bg: "rgba(244,123,32,.12)", color: "#F15A38" },
  Advanced: { bg: "rgba(99,102,241,.12)", color: "#6366f1" },
};

/* ── Chapter Card ───────────────────────────────────────────── */
function ChapterCard({ ch, color, index }) {
  const diff = DIFF_STYLE[ch.diff];
  const jee  = JEE_STYLE[ch.jee];
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.38, delay: (index % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={open ? undefined : { y: -4, transition: { duration: 0.2 } }}
      style={{
        background: "#fff",
        borderRadius: 14,
        border: open ? `1px solid ${color}55` : "1px solid rgba(0,0,0,.08)",
        boxShadow: open ? `0 10px 32px ${color}22` : "0 2px 12px rgba(28,28,40,.05)",
        padding: "16px 16px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: "pointer",
        transition: "box-shadow .2s, border-color .2s",
      }}
      onClick={() => setOpen((o) => !o)}
      onMouseEnter={(e) => { if (!open) e.currentTarget.style.boxShadow = `0 10px 32px ${color}22`; }}
      onMouseLeave={(e) => { if (!open) e.currentTarget.style.boxShadow = "0 2px 12px rgba(28,28,40,.05)"; }}
    >
      {/* Chapter number + badges */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          width: 28, height: 28, borderRadius: 8,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: "grid", placeItems: "center",
          fontFamily: "Sora", fontWeight: 800,
          fontSize: 11, color,
        }}>
          {String(ch.n).padStart(2, "0")}
        </span>
        <div style={{ display: "flex", gap: 5 }}>
          <span style={{ padding: "2px 8px", borderRadius: 50, fontSize: 10, fontWeight: 700, background: diff.bg, color: diff.color }}>
            {diff.label}
          </span>
          <span style={{ padding: "2px 8px", borderRadius: 50, fontSize: 10, fontWeight: 700, background: jee.bg, color: jee.color }}>
            {ch.jee}
          </span>
        </div>
      </div>

      {/* Chapter name + expand chevron */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <h4 style={{
          fontFamily: "Sora", fontWeight: 700,
          fontSize: "0.88rem", color: "#1c1c28",
          lineHeight: 1.35,
        }}>
          {ch.name}
        </h4>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ flexShrink: 0, color, marginTop: 2 }}
        >
          <ChevronDown size={18} />
        </motion.span>
      </div>

      {/* Topics */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {ch.topics.map((t) => (
          <span key={t} style={{
            padding: "3px 9px", borderRadius: 50,
            background: "#f3f4f6",
            border: "1px solid #e5e7eb",
            fontSize: 11, color: "#6b7280",
            fontFamily: "DM Sans",
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* Expandable: full topic list + quiz section */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ paddingTop: 6, borderTop: "1px dashed rgba(0,0,0,.1)", marginTop: 4 }}>
              {/* Topics list */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "12px 0 8px" }}>
                <ListChecks size={14} color={color} />
                <span style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 12, color: "#1c1c28" }}>
                  Topics in this chapter
                </span>
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {ch.topics.map((t) => (
                  <li key={t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#4b5563", fontFamily: "DM Sans" }}>
                    <CheckCircle2 size={14} color={color} style={{ flexShrink: 0 }} />
                    {t}
                  </li>
                ))}
              </ul>

              {/* Quiz section — Coming Soon */}
              <div style={{
                marginTop: 14,
                background: `${color}0d`,
                border: `1px dashed ${color}40`,
                borderRadius: 12,
                padding: "14px 14px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${color}1a`,
                  display: "grid", placeItems: "center", flexShrink: 0,
                }}>
                  <Target size={18} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13, color: "#1c1c28" }}>
                      Chapter Quiz
                    </span>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 3,
                      padding: "2px 8px", borderRadius: 50,
                      background: `${color}18`, color,
                      fontSize: 10, fontWeight: 700,
                    }}>
                      <Sparkles size={10} /> Coming Soon
                    </span>
                  </div>
                  <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "#6b7280", fontFamily: "DM Sans" }}>
                    Practice questions for this chapter will be available here soon.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Subject Hero Banner ────────────────────────────────────── */
function SubjectBanner({ subject, stats }) {
  const Icon = subject.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: subject.gradient,
        borderRadius: 20,
        padding: "28px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 24,
        marginBottom: 32,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: -40, right: 80, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,.07)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -30, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.05)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative", zIndex: 1 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: "rgba(255,255,255,.18)",
          display: "grid", placeItems: "center",
          backdropFilter: "blur(6px)",
        }}>
          <Icon size={32} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.6rem", color: "#fff", margin: 0 }}>
            {subject.name}
          </h2>
          <p style={{ color: "rgba(255,255,255,.75)", fontSize: ".88rem", margin: "4px 0 0" }}>
            {subject.desc}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, position: "relative", zIndex: 1, flexWrap: "wrap" }}>
        {[
          { label: "Chapters", value: subject.chapters },
          { label: "Hard",     value: stats.hard },
          { label: "For Main", value: stats.main },
          { label: "For Adv.", value: stats.adv },
        ].map(({ label, value }) => (
          <div key={label} style={{
            textAlign: "center",
            background: "rgba(255,255,255,.14)",
            borderRadius: 12,
            padding: "10px 18px",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,.2)",
          }}>
            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.4rem", color: "#fff" }}>{value}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Main Page ──────────────────────────────────────────────── */
export default function JeeResources() {
  const [sp] = useSearchParams();
  const [activeSubject, setActiveSubject] = useState(sp.get("subject") || "math");
  const [filter, setFilter] = useState("all");
  const nav = useNavigate();

  useEffect(() => {
    const s = sp.get("subject");
    if (s && SUBJECTS.find((x) => x.id === s)) {
      setActiveSubject(s);
      setFilter("all");
    }
  }, [sp]);

  const subject = SUBJECTS.find((s) => s.id === activeSubject);

  const stats = {
    hard: subject.chapters_list.filter((c) => c.diff === "hard").length,
    main: subject.chapters_list.filter((c) => c.jee === "Main").length,
    adv:  subject.chapters_list.filter((c) => c.jee === "Advanced").length,
  };

  const filtered = subject.chapters_list.filter((c) => {
    if (filter === "hard") return c.diff === "hard";
    if (filter === "main") return c.jee === "Main";
    if (filter === "adv")  return c.jee === "Advanced";
    return true;
  });

  return (
    <div className="page" style={{ minHeight: "100vh" }}>
      <Seo
        title="JEE Preparation Resources — Free Notes, PYQs & Study Plan"
        description="Free JEE Main & Advanced preparation resources — subject-wise notes, previous-year papers, best books and a study plan curated by IIT Roorkee alumni on CollegeParichay."
        path="/jee-resources"
      />

      {/* ── Page Header ── */}
      <section className="warm-page-header" style={{ padding: "60px 0 48px" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 70% at 100% 20%, rgba(249,115,22,.22) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 45% 55% at 0% 80%, rgba(244,162,97,.20) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", top: 20, right: -40, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,123,32,.15) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="eyebrow" style={{ marginBottom: 18 }}>
              <BookOpen size={11} /> JEE Study Material
            </span>

            <h1 style={{
              fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800,
              fontSize: "clamp(1.9rem,4.5vw,3rem)",
              color: "#1c1c28", letterSpacing: "-0.5px",
              lineHeight: 1.12, margin: "0 0 16px",
            }}>
              Master JEE with{" "}
              <span style={{ background: "linear-gradient(90deg, #F15A38, #E0421F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Subject-wise Chapters
              </span>
            </h1>

            <p style={{ color: "rgba(28,28,40,.62)", fontSize: "1rem", maxWidth: 520, lineHeight: 1.7, margin: "0 0 32px" }}>
              73 chapters across Mathematics, Physics &amp; Chemistry — with difficulty ratings, JEE Main vs Advanced coverage, and topic-level breakdown.
            </p>

            {/* Quick stats */}
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { icon: BookOpen, label: "19 Math chapters",     color: "#F15A38" },
                { icon: Zap,      label: "25 Physics chapters",  color: "#E0421F" },
                { icon: FlaskConical, label: "29 Chem chapters", color: "#f97316" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(28,28,40,.75)", fontSize: 13.5, fontWeight: 600 }}>
                  <Icon size={15} color={color} /> {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Subject selector tabs ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,.08)", position: "sticky", top: 68, zIndex: 10 }}>
        <div className="container">
          <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
            {SUBJECTS.map((s) => {
              const Icon = s.icon;
              const isActive = s.id === activeSubject;
              return (
                <button
                  key={s.id}
                  onClick={() => { setActiveSubject(s.id); setFilter("all"); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "16px 24px",
                    borderBottom: `3px solid ${isActive ? s.color : "transparent"}`,
                    background: "none", border: "none", borderBottom: `3px solid ${isActive ? s.color : "transparent"}`,
                    color: isActive ? s.color : "#6b7280",
                    fontSize: 14, fontWeight: 700,
                    fontFamily: "Sora", cursor: "pointer",
                    transition: "all .2s",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Icon size={16} />
                  {s.name}
                  <span style={{
                    padding: "1px 8px", borderRadius: 50,
                    background: isActive ? `${s.color}18` : "#f3f4f6",
                    color: isActive ? s.color : "#9ca3af",
                    fontSize: 11, fontWeight: 700,
                  }}>
                    {s.chapters}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container" style={{ padding: "36px 1.5rem 64px" }}>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubject}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.28 }}
          >
            {/* Subject banner */}
            <SubjectBanner subject={subject} stats={stats} />

            {/* Filter row */}
            <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { id: "all",  label: `All ${subject.chapters}` },
                  { id: "hard", label: `Hard (${stats.hard})` },
                  { id: "main", label: "JEE Main" },
                  { id: "adv",  label: "Advanced" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    style={{
                      padding: "7px 16px", borderRadius: 50,
                      fontSize: 13, fontWeight: 600,
                      fontFamily: "DM Sans",
                      cursor: "pointer", transition: "all .2s",
                      border: filter === f.id ? `2px solid ${subject.color}` : "2px solid #e5e7eb",
                      background: filter === f.id ? subject.color : "#fff",
                      color: filter === f.id ? "#fff" : "#6b7280",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: 13, color: "#9ca3af" }}>
                Showing {filtered.length} chapters
              </span>
            </div>

            {/* Chapter grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}>
              {filtered.map((ch, i) => (
                <ChapterCard key={ch.n} ch={ch} color={subject.color} index={i} />
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                marginTop: 48,
                background: subject.gradient,
                borderRadius: 20,
                padding: "28px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 20,
              }}
            >
              <div>
                <h3 style={{ fontFamily: "Sora", fontWeight: 800, color: "#fff", fontSize: "1.3rem", marginBottom: 6 }}>
                  Ready to test your {subject.name}?
                </h3>
                <p style={{ color: "rgba(255,255,255,.75)", fontSize: 14, margin: 0 }}>
                  Use the College Predictor to see which institutes you can get into based on your JEE performance.
                </p>
              </div>
              <button
                className="btn"
                onClick={() => nav("/jee-main#rank")}
                style={{
                  background: "#fff",
                  color: subject.color,
                  fontWeight: 700,
                  padding: "12px 24px",
                  gap: 8,
                  boxShadow: "0 4px 20px rgba(0,0,0,.2)",
                }}
              >
                Predict My Rank <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
