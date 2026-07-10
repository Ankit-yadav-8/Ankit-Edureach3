import SyllabusToolkit from "../components/syllabus/SyllabusToolkit.jsx";
import { PREMIUM_CLASS_11 } from "../data/premiumClass11.js";

export default function Class11() {
  const heroProps = {
    badgeText: "SYLLABUS HUB · CLASS 11",
    titleLines: [
      [{ text: "Master the" }],
      [{ text: "Fundamentals.", accent: true }],
      [{ text: "Crack the " }, { text: "Future.", accent: true }],
    ],
    description: "A premium chapter-wise toolkit for Physics, Chemistry, Mathematics and Biology — everything you need to build a rock-solid foundation for JEE & NEET.",
    stats: [
      { value: "60+", label: "core chapters" },
      { value: "4", label: "subjects" },
      { value: "900+", label: "practice questions" }
    ],
    primaryButton: { text: "Start Learning", onClick: () => { window.scrollTo({top: 800, behavior: 'smooth'}) } },
    secondaryButton: { text: "Explore Full Syllabus", onClick: () => { window.scrollTo({top: 800, behavior: 'smooth'}) } }
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
