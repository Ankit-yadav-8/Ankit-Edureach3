import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import TopBar from "./components/TopBar.jsx";
import Footer from "./components/Footer.jsx";
import SearchOverlay from "./components/SearchOverlay.jsx";
import { ScrollProgress, BackToTop } from "./components/ScrollUtils.jsx";
import { ScrollProgressBar } from "./components/Animations.jsx";

import Home from "./pages/Home.jsx";
import JeeMain from "./pages/JeeMain.jsx";
import JeeAdvanced from "./pages/JeeAdvanced.jsx";
import JeeAdvancedResult from "./pages/JeeAdvancedResult.jsx";
import Colleges from "./pages/Colleges.jsx";
import CollegeDetail from "./pages/CollegeDetail.jsx";
import Exams from "./pages/Exams.jsx";
import ExamDetail from "./pages/ExamDetail.jsx";
import NewsDetail from "./pages/NewsDetail.jsx";
import PrivateDetail from "./pages/PrivateDetail.jsx";
import PrivateUnis from "./pages/PrivateUnis.jsx";
import About from "./pages/About.jsx";
import Developer from "./pages/Developer.jsx";
import Compare from "./pages/Compare.jsx";
import Shortlist from "./pages/Shortlist.jsx";
import ForYou from "./pages/ForYou.jsx";
import Josaa2026 from "./pages/Josaa2026.jsx";
import JosaaRound1Result from "./pages/JosaaRound1Result.jsx";
import CounsellingPlanner from "./pages/CounsellingPlanner.jsx";
import CollegeMap from "./pages/CollegeMap.jsx";
import CompareExams from "./pages/CompareExams.jsx";
import Tools from "./pages/Tools.jsx";
import Reviews from "./pages/Reviews.jsx";
import Scholarships from "./pages/Scholarships.jsx";
import OfficialCutoffs from "./pages/OfficialCutoffs.jsx";
import CompareTray from "./components/CompareTray.jsx";
import Chatbot from "./components/Chatbot.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import AuthModal from "./auth/AuthModal.jsx";
import ReviewPopup from "./components/ReviewPopup.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import NotFound from "./pages/NotFound.jsx";
import Admin from "./pages/Admin.jsx";
import JeeResources from "./pages/JeeResources.jsx";
import Neet from "./pages/Neet.jsx";
import NeetColleges from "./pages/NeetColleges.jsx";
import NeetCollegeDetail from "./pages/NeetCollegeDetail.jsx";
import HowToUse from "./pages/HowToUse.jsx";
import Mentorship from "./pages/Mentorship.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MentorshipDashboard from "./pages/MentorshipDashboard.jsx";
import PublicCommunity from "./pages/PublicCommunity.jsx";
import Branches from "./pages/Branches.jsx";
import BranchDetail from "./pages/BranchDetail.jsx";
import BranchVsCollegePage from "./pages/BranchVsCollegePage.jsx";
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import CampusNotes from "./pages/CampusNotes.jsx";
import CollegeParichayAI from "./pages/CollegeParichayAI.jsx";
import CampusFests from "./pages/CampusFests.jsx";
import Class11 from "./pages/Class11.jsx";
import Class12 from "./pages/Class12.jsx";
import JeeStrategy from "./pages/JeeStrategy.jsx";
import NeetStrategy from "./pages/NeetStrategy.jsx";

/* Scroll to top on path change — unless navigating to a hash anchor. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();

  // Cmd/Ctrl+K to open search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Admin dashboard renders standalone — no public navbar, footer, chatbot,
  // WhatsApp button, compare tray or auth modal bleeding into it.
  if (pathname.startsWith("/admin")) {
    return (
      <>
        <ScrollManager />
        <Routes>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </>
    );
  }

  // College Parichay AI is a full-screen Claude-style app — render it on its own
  // (no public navbar / footer / floating widgets). Open to guests; the login
  // modal is still available on demand via the account button.
  if (pathname === "/ai") {
    return (
      <>
        <ScrollManager />
        <Routes>
          <Route path="/ai" element={<CollegeParichayAI />} />
        </Routes>
        <AuthModal />
      </>
    );
  }

  return (
    <>
      <ScrollProgressBar />
      <div id="progress-bar" />
      <ScrollProgress />
      <ScrollManager />
      <TopBar />
      <Navbar onSearch={() => setSearchOpen(true)} />

      <main>
        <Routes>
          <Route path="/" element={<Home onSearch={() => setSearchOpen(true)} />} />
          <Route path="/jee-main" element={<JeeMain />} />
          <Route path="/jee-advanced" element={<JeeAdvanced />} />
          <Route path="/jee-advanced-result-2026" element={<JeeAdvancedResult />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/colleges/:slug" element={<CollegeDetail />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/exams/:slug" element={<ExamDetail />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/private-universities" element={<PrivateUnis />} />
          <Route path="/private/:slug" element={<PrivateDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/team/:id" element={<Developer />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/reviews" element={<Reviews />} />
          {/* /jee-analysis retired — its weightage/difficulty content moved into the JEE strategy page */}
          <Route path="/jee-analysis" element={<Navigate to="/jee-strategy" replace />} />
          <Route path="/shortlist" element={<Shortlist />} />
          <Route path="/for-you" element={<ForYou />} />
          <Route path="/josaa-2026" element={<Josaa2026 />} />
          <Route path="/josaa-round-1-result-2026" element={<JosaaRound1Result />} />
          <Route path="/planner" element={<CounsellingPlanner />} />
          <Route path="/map" element={<CollegeMap />} />
          <Route path="/compare-exams" element={<CompareExams />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/cutoffs" element={<OfficialCutoffs />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/jee-resources" element={<JeeResources />} />
          <Route path="/neet" element={<Neet />} />
          <Route path="/neet-colleges" element={<NeetColleges />} />
          <Route path="/neet-colleges/:slug" element={<NeetCollegeDetail />} />
          <Route path="/how-to-use" element={<HowToUse />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/mentorship/:variant" element={<Mentorship />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mentorship-dashboard" element={<MentorshipDashboard />} />
          <Route path="/community" element={<PublicCommunity />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/branches/:slug" element={<BranchDetail />} />
          <Route path="/branch-vs-college" element={<BranchVsCollegePage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/campus-notes" element={<CampusNotes />} />
          <Route path="/campus-fests" element={<CampusFests />} />
          <Route path="/class-11" element={<Class11 />} />
          <Route path="/class-12" element={<Class12 />} />
          <Route path="/jee-strategy" element={<JeeStrategy />} />
          <Route path="/neet-strategy" element={<NeetStrategy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <BackToTop />
      <CompareTray />
      <Chatbot />
      <WhatsAppButton />
      <AuthModal />
      <ReviewPopup />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}