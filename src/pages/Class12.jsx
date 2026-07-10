import SyllabusToolkit from "../components/syllabus/SyllabusToolkit.jsx";
import { PREMIUM_CLASS_12 } from "../data/premiumClass12.js";
import { Atom, FlaskConical, Sigma, Leaf } from "lucide-react";

export default function Class12() {
  const heroProps = {
    badgeText: "SYLLABUS HUB · CLASS 12",
    titleLines: [
      [{ text: "Master the" }],
      [{ text: "Advanced.", accent: true }],
      [{ text: "Crack the " }, { text: "Competition.", accent: true }],
    ],
    description: "A premium chapter-wise toolkit for Physics, Chemistry, Mathematics and Biology — cross-tagged for CBSE boards and JEE/NEET so every night of study counts twice.",
    stats: [
      { value: "56", label: "core chapters" },
      { value: "4", label: "subjects" },
      { value: "1,200+", label: "practice questions" }
    ],
    primaryButton: { text: "Start Learning", onClick: () => { window.scrollTo({top: 800, behavior: 'smooth'}) } },
    secondaryButton: { text: "Explore Full Syllabus", onClick: () => { window.scrollTo({top: 800, behavior: 'smooth'}) } },
    floatingCards: [
      { title: "Physics", subtitle: "14 chapters", icon: Atom, color: "#6366f1", progress: 60 },
      { title: "Chemistry", subtitle: "16 chapters", icon: FlaskConical, color: "#ef4444", progress: 80 },
      { title: "Mathematics", subtitle: "13 chapters", icon: Sigma, color: "#f59e0b", progress: 40 },
      { title: "Biology", subtitle: "13 chapters", icon: Leaf, color: "#10b981", progress: 90 },
    ]
  };

  return (
    <SyllabusToolkit
      data={PREMIUM_CLASS_12}
      heroProps={heroProps}
      classLevel="12"
      seoTitle="Class 12 Chapter-wise Syllabus, Mind Maps & Quizzes"
      seoDesc="Master Class 12 Physics, Chemistry, Maths & Biology with our comprehensive chapter-wise toolkit. Get mind maps and generated quizzes for JEE/NEET."
      seoPath="/class-12"
    />
  );
}
