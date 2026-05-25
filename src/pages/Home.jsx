import Hero from "../components/home/Hero.jsx";
import PredictorCards from "../components/home/PredictorCards.jsx";
import NewTools from "../components/home/NewTools.jsx";
import ApplicationRadar from "../components/home/ApplicationRadar.jsx";
import EntranceExams from "../components/home/EntranceExams.jsx";
import TopColleges from "../components/home/TopColleges.jsx";
import PrivateUniversities from "../components/home/PrivateUniversities.jsx";
import NewsSection from "../components/home/NewsSection.jsx";
import Testimonials from "../components/home/Testimonials.jsx";

export default function Home({ onSearch }) {
  return (
    <>
      <Hero onSearch={onSearch} />
      <PredictorCards />
      <NewTools />
      <ApplicationRadar />
      <EntranceExams />
      <TopColleges />
      <PrivateUniversities />
      <Testimonials />
      <NewsSection />
    </>
  );
}
