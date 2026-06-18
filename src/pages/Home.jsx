/* Home — rebuilt as a short, campusloom-styled hub.
   Hero → tools → branch catalog → rank-to-cutoff → branch vs college →
   plans → exam buzz teaser → success stories → FAQ. News, the application
   radar and top-colleges blocks now live on dedicated pages. */
import Seo from "../components/Seo.jsx";
import Hero from "../components/home/Hero.jsx";
import CollegeTicker from "../components/home/CollegeTicker.jsx";
import ToolsGrid from "../components/home/ToolsGrid.jsx";
import BranchCatalog from "../components/home/BranchCatalog.jsx";
import AdvancedPredictorHome from "../components/home/AdvancedPredictorHome.jsx";
import BranchVsCollege from "../components/home/BranchVsCollege.jsx";
import PlansSection from "../components/home/PlansSection.jsx";
import ExploreColleges from "../components/home/ExploreColleges.jsx";
import PremiumColleges from "../components/home/PremiumColleges.jsx";
import ExamBuzzHome from "../components/home/ExamBuzzHome.jsx";
import Testimonials from "../components/home/Testimonials.jsx";
import FaqSection from "../components/home/FaqSection.jsx";

export default function Home({ onSearch }) {
  return (
    <>
      <Seo path="/" />

      {/* ── Hero ── */}
      <Hero onSearch={onSearch} />

      {/* ── College logo ticker ── */}
      <CollegeTicker />

      {/* ── Smart tools (campusloom LIVE-card grid) ── */}
      <ToolsGrid />

      {/* ── Branch Catalog — 220+ branches, 10 paths ── */}
      <BranchCatalog />

      {/* ── JEE Advanced college predictor (full tool) ── */}
      <AdvancedPredictorHome />

      {/* ── Branch vs College — 6-question assessment ── */}
      <BranchVsCollege />

      {/* ── Counselling + Mentorship plans (merged) ── */}
      <PlansSection />

      {/* ── Explore Colleges — flagship IITs (tool-style cards) ── */}
      <ExploreColleges />

      {/* ── Premium colleges that take your JEE rank (outside JoSAA) ── */}
      <PremiumColleges />

      {/* ── Exam Buzz teaser (news + radar live on /exam-buzz) ── */}
      <ExamBuzzHome />

      {/* ── Success stories ── */}
      <Testimonials />

      {/* ── FAQ ── */}
      <FaqSection />
    </>
  );
}
