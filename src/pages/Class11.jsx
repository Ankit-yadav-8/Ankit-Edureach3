import SyllabusToolkit from "../components/syllabus/SyllabusToolkit.jsx";
import { PREMIUM_CLASS_11 } from "../data/premiumClass11.js";

export default function Class11() {
  return (
    <SyllabusToolkit 
      title="Class 11 Syllabus & Notes"
      subtitle="Complete chapter-wise toolkit for Physics, Chemistry, Mathematics, and Biology. Your foundation starts here."
      data={PREMIUM_CLASS_11}
      seoTitle="Class 11 Chapter-wise Syllabus, Mind Maps & Quizzes"
      seoDesc="Master Class 11 Physics, Chemistry, Maths & Biology with our comprehensive chapter-wise toolkit. Get mind maps and generated quizzes for JEE/NEET."
      seoPath="/class-11"
      imageSrc="/images/ai/class_11_hero.png"
    />
  );
}
