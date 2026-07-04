import SyllabusToolkit from "../components/syllabus/SyllabusToolkit.jsx";
import { CLASS_11_CHAPTERS } from "../data/chapters.js";

export default function Class11() {
  return (
    <SyllabusToolkit 
      title="Class 11 Syllabus & Notes"
      subtitle="Complete chapter-wise toolkit for Physics, Chemistry, Mathematics, and Biology. Your foundation starts here."
      data={CLASS_11_CHAPTERS}
      seoTitle="Class 11 Chapter-wise Syllabus, Mind Maps & Quizzes"
      seoDesc="Master Class 11 Physics, Chemistry, Maths & Biology with our comprehensive chapter-wise toolkit. Get mind maps and generated quizzes for JEE/NEET."
      seoPath="/class-11"
    />
  );
}
