import SyllabusToolkit from "../components/syllabus/SyllabusToolkit.jsx";
import { PREMIUM_CLASS_12 } from "../data/premiumClass12.js";
import { Atom, FlaskConical, Sigma, Activity } from "lucide-react";

export default function Class12() {
  const heroProps = {
    badgeText: "SYLLABUS HUB · CLASS 12",
    titlePart1: "Two exams, one chapter list.",
    titlePart2: "Study ",
    highlight1: "once",
    titlePart3: ", walk in ",
    highlight2: "ready twice.",
    description: "Every Class 12 chapter cross-tagged for CBSE boards and JEE/NEET overlap — so a night on Electrostatics counts for both.",
    stats: [
      { value: "184", label: "days to Boards", color: "#EF4444" },
      { value: "58", label: "chapters mapped", color: "#0f172a" },
      { value: "1,200+", label: "practice questions", color: "#0f172a" }
    ],
    primaryButton: { text: "Start Physics — Ch. 1", onClick: () => { window.scrollTo({top: 800, behavior: 'smooth'}) } },
    secondaryButton: { text: "See full syllabus", onClick: () => { window.scrollTo({top: 800, behavior: 'smooth'}) } },
    chartPercentage: 68,
    chartLabel: "syllabus\nrevised overall",
    floatingCards: [
      { title: "Physics", subtitle: "14 chapters", icon: Atom, color: "#6366f1", progress: 60, pos: { top: "5%", left: "5%" } },
      { title: "Chemistry", subtitle: "16 chapters", icon: FlaskConical, color: "#ef4444", progress: 80, pos: { top: "15%", right: "5%" } },
      { title: "Maths", subtitle: "13 chapters", icon: Sigma, color: "#f59e0b", progress: 40, pos: { bottom: "5%", left: "10%" } },
      { title: "Biology", subtitle: "13 chapters", icon: Activity, color: "#10b981", progress: 90, pos: { bottom: "10%", right: "10%" } },
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
