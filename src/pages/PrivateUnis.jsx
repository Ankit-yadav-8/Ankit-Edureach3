import Seo from "../components/Seo.jsx";
import PrivateUniversities from "../components/home/PrivateUniversities.jsx";

/* Dedicated page for the private-universities listing.
   (Removed from the home page, but still fully available here.) */
export default function PrivateUnis() {
  return (
    <div className="page">
      <Seo
        title="Top Private Universities in India — Fees, Placements & Admission"
        description="Compare 13+ leading private universities — VIT, SRM, Manipal, BITS, KIIT, LPU and more — by fees, placements, cutoffs and admission, and apply directly. By CollegeParichay."
        path="/private-universities"
      />
      <PrivateUniversities />
    </div>
  );
}
