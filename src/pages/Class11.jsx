import SyllabusToolkit from "../components/syllabus/SyllabusToolkit.jsx";
import { PREMIUM_CLASS_11 } from "../data/premiumClass11.js";
import { Atom, FlaskConical, Sigma, Activity } from "lucide-react";

export default function Class11() {
  const heroProps = {
    badgeText: "SYLLABUS HUB · CLASS 11",
    titlePart1: "Master the ",
    highlight1: "Fundamentals.",
    titlePart2: " Crack the ",
    highlight2: "Future.",
    description: "A premium chapter-wise toolkit for Physics, Chemistry, Mathematics and Biology — everything you need to build a rock-solid foundation for JEE & NEET.",
    stats: [
      { value: "60+", label: "CORE CHAPTERS" },
      { value: "4", label: "SUBJECTS" },
      { value: "900+", label: "PRACTICE QUESTIONS" }
    ],
    primaryButton: { text: "Start Physics — Ch. 1", onClick: () => { window.scrollTo({top: 800, behavior: 'smooth'}) } },
    secondaryButton: { text: "See full syllabus", onClick: () => { window.scrollTo({top: 800, behavior: 'smooth'}) } },
    chartPercentage: 25,
    chartLabel: "foundation\nbuilt",
    floatingCards: [
      { title: "Physics", subtitle: "15 chapters", icon: Atom, color: "#6366f1", progress: 30, pos: { top: "5%", left: "5%" } },
      { title: "Chemistry", subtitle: "14 chapters", icon: FlaskConical, color: "#ef4444", progress: 40, pos: { top: "15%", right: "5%" } },
      { title: "Maths", subtitle: "14 chapters", icon: Sigma, color: "#f59e0b", progress: 20, pos: { bottom: "5%", left: "10%" } },
      { title: "Biology", subtitle: "22 chapters", icon: Activity, color: "#10b981", progress: 10, pos: { bottom: "10%", right: "10%" } },
    ]
  };

  return (
    <SyllabusToolkit
      data={PREMIUM_CLASS_11}
      heroProps={heroProps}
      classLevel="11"
      seoTitle="Class 11 Chapter-wise Syllabus, Mind Maps & Quizzes"
      seoDesc="Master Class 11 Physics, Chemistry, Maths & Biology with our comprehensive chapter-wise toolkit. Get mind maps and generated quizzes for JEE/NEET."
      seoPath="/class-11"
    />
  );
}
