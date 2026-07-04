import SyllabusToolkit from "../components/syllabus/SyllabusToolkit.jsx";
import { PREMIUM_CLASS_12 } from "../data/premiumClass12.js";

export default function Class12() {
  return (
    <SyllabusToolkit 
      title="Class 12 Syllabus & Notes"
      subtitle="Boards + competitive prep combined. Master the crucial final year chapters."
      data={PREMIUM_CLASS_12}
      seoTitle="Class 12 Chapter-wise Syllabus, Mind Maps & Quizzes"
      seoDesc="Master Class 12 Physics, Chemistry, Maths & Biology with our comprehensive chapter-wise toolkit. Get mind maps and generated quizzes for JEE/NEET."
      seoPath="/class-12"
      imageSrc="/images/ai/class_12_hero.png"
    />
  );
}
