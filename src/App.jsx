import { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import SearchOverlay from "./components/SearchOverlay.jsx";
import { ScrollProgress, BackToTop } from "./components/ScrollUtils.jsx";
import { ScrollProgressBar } from "./components/Animations.jsx";

import Home from "./pages/Home.jsx";
import JeeMain from "./pages/JeeMain.jsx";
import JeeAdvanced from "./pages/JeeAdvanced.jsx";
import Colleges from "./pages/Colleges.jsx";
import CollegeDetail from "./pages/CollegeDetail.jsx";
import Exams from "./pages/Exams.jsx";
import ExamDetail from "./pages/ExamDetail.jsx";
import NewsDetail from "./pages/NewsDetail.jsx";
import PrivateDetail from "./pages/PrivateDetail.jsx";
import About from "./pages/About.jsx";
import Developer from "./pages/Developer.jsx";
import Compare from "./pages/Compare.jsx";
import Shortlist from "./pages/Shortlist.jsx";
import ForYou from "./pages/ForYou.jsx";
import Josaa2026 from "./pages/Josaa2026.jsx";
import CounsellingPlanner from "./pages/CounsellingPlanner.jsx";
import CollegeMap from "./pages/CollegeMap.jsx";
import CompareExams from "./pages/CompareExams.jsx";
import Scholarships from "./pages/Scholarships.jsx";
import OfficialCutoffs from "./pages/OfficialCutoffs.jsx";
import CompareTray from "./components/CompareTray.jsx";
import Chatbot from "./components/Chatbot.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import AuthModal from "./auth/AuthModal.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import NotFound from "./pages/NotFound.jsx";
import Admin from "./pages/Admin.jsx";
import JeeResources from "./pages/JeeResources.jsx";
import { useAuth } from "./auth/AuthContext.jsx";

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

/* Show auth modal immediately on page load for guests (skip admin page). */
function AuthBootstrap() {
  const { openLogin } = useAuth();
  const { pathname } = useLocation();
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    if (pathname === "/admin") return;

    // If no auth token exists in this session, the user is definitely a guest
    const hasToken = !!localStorage.getItem("edureach:token");
    if (hasToken) return;

    triggered.current = true;
    // Brief delay so the page visually renders before the modal appears
    const t = setTimeout(() => openLogin(), 700);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);

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

  return (
    <>
      <ScrollProgressBar />
      <div id="progress-bar" />
      <ScrollProgress />
      <ScrollManager />
      <AuthBootstrap />
      <Navbar onSearch={() => setSearchOpen(true)} />

      <main>
        <Routes>
          <Route path="/" element={<Home onSearch={() => setSearchOpen(true)} />} />
          <Route path="/jee-main" element={<JeeMain />} />
          <Route path="/jee-advanced" element={<JeeAdvanced />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/colleges/:slug" element={<CollegeDetail />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/exams/:slug" element={<ExamDetail />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/private/:slug" element={<PrivateDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/team/:id" element={<Developer />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/shortlist" element={<Shortlist />} />
          <Route path="/for-you" element={<ForYou />} />
          <Route path="/josaa-2026" element={<Josaa2026 />} />
          <Route path="/planner" element={<CounsellingPlanner />} />
          <Route path="/map" element={<CollegeMap />} />
          <Route path="/compare-exams" element={<CompareExams />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/cutoffs" element={<OfficialCutoffs />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/jee-resources" element={<JeeResources />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <BackToTop />
      <CompareTray />
      <Chatbot />
      <WhatsAppButton />
      <AuthModal />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}