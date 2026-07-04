import SyllabusToolkit from "../components/syllabus/SyllabusToolkit.jsx";
import { PREMIUM_CLASS_11 } from "../data/premiumClass11.js";
import { Atom, FlaskConical, Sigma, Activity } from "lucide-react";

export default function Class11() {
  const heroProps = {
    badgeText: "SYLLABUS HUB · CLASS 11",
    titlePart1: "The foundation year.",
    titlePart2: "Build ",
    highlight1: "concepts",
    titlePart3: ", master ",
    highlight2: "basics.",
    description: "Complete chapter-wise toolkit for Physics, Chemistry, Mathematics, and Biology. Everything you need to kickstart your preparation.",
    stats: [
      { value: "60+", label: "core chapters", color: "#EF4444" },
      { value: "4", label: "subjects mapped", color: "#0f172a" },
      { value: "900+", label: "practice questions", color: "#0f172a" }
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
      seoTitle="Class 11 Chapter-wise Syllabus, Mind Maps & Quizzes"
      seoDesc="Master Class 11 Physics, Chemistry, Maths & Biology with our comprehensive chapter-wise toolkit. Get mind maps and generated quizzes for JEE/NEET."
      seoPath="/class-11"
    />
  );
}
