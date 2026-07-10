import SyllabusToolkit from "../components/syllabus/SyllabusToolkit.jsx";
import { PREMIUM_CLASS_12 } from "../data/premiumClass12.js";

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
    secondaryButton: { text: "Explore Full Syllabus", onClick: () => { window.scrollTo({top: 800, behavior: 'smooth'}) } }
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
