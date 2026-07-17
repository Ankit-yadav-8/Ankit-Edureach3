import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import TopBar from "./components/TopBar.jsx";
import Footer from "./components/Footer.jsx";
import SearchOverlay from "./components/SearchOverlay.jsx";
import { ScrollProgress, BackToTop } from "./components/ScrollUtils.jsx";
const ScrollProgressBar = lazy(() => import("./components/Animations.jsx").then(m => ({ default: m.ScrollProgressBar })));

const Home = lazy(() => import("./pages/Home.jsx"));

/* Route-level code splitting: only Home ships in the initial bundle; every
   other page is fetched on navigation. Previously all ~50 pages were static
   imports, so one 2.6 MB chunk had to parse before the homepage could paint. */
const JeeMain = lazy(() => import("./pages/JeeMain.jsx"));
const JeeAdvanced = lazy(() => import("./pages/JeeAdvanced.jsx"));
const JeeAdvancedAnalysis = lazy(() => import("./pages/JeeAdvancedAnalysis.jsx"));
const JeeAdvancedResult = lazy(() => import("./pages/JeeAdvancedResult.jsx"));
const Colleges = lazy(() => import("./pages/Colleges.jsx"));
const CollegeDetail = lazy(() => import("./pages/CollegeDetail.jsx"));
const PrivateDetail = lazy(() => import("./pages/PrivateDetail.jsx"));
const PrivateUnis = lazy(() => import("./pages/PrivateUnis.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Developer = lazy(() => import("./pages/Developer.jsx"));
const Compare = lazy(() => import("./pages/Compare.jsx"));
const Shortlist = lazy(() => import("./pages/Shortlist.jsx"));
const ForYou = lazy(() => import("./pages/ForYou.jsx"));
const Josaa2026 = lazy(() => import("./pages/Josaa2026.jsx"));
const JosaaRound1Result = lazy(() => import("./pages/JosaaRound1Result.jsx"));
const JosaaRound2Result = lazy(() => import("./pages/JosaaRound2Result.jsx"));
const JosaaRound3Result = lazy(() => import("./pages/JosaaRound3Result.jsx"));
const CounsellingPlanner = lazy(() => import("./pages/CounsellingPlanner.jsx"));
const CollegeMap = lazy(() => import("./pages/CollegeMap.jsx"));
const CompareExams = lazy(() => import("./pages/CompareExams.jsx"));
const OtherExams = lazy(() => import("./pages/OtherExams.jsx"));
const Tools = lazy(() => import("./pages/Tools.jsx"));
const Reviews = lazy(() => import("./pages/Reviews.jsx"));
const Scholarships = lazy(() => import("./pages/Scholarships.jsx"));
const OfficialCutoffs = lazy(() => import("./pages/OfficialCutoffs.jsx"));
const SearchResults = lazy(() => import("./pages/SearchResults.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));
const JeeResources = lazy(() => import("./pages/JeeResources.jsx"));
const Neet = lazy(() => import("./pages/Neet.jsx"));
const NeetColleges = lazy(() => import("./pages/NeetColleges.jsx"));
const NeetCollegeDetail = lazy(() => import("./pages/NeetCollegeDetail.jsx"));
const HowToUse = lazy(() => import("./pages/HowToUse.jsx"));
const Mentorship = lazy(() => import("./pages/Mentorship.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
const Terms = lazy(() => import("./pages/Terms.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const MentorshipDashboard = lazy(() => import("./pages/MentorshipDashboard.jsx"));
const MentorDashboard = lazy(() => import("./pages/MentorDashboard.jsx"));
const PublicCommunity = lazy(() => import("./pages/PublicCommunity.jsx"));
const Branches = lazy(() => import("./pages/Branches.jsx"));
const BranchDetail = lazy(() => import("./pages/BranchDetail.jsx"));
const BranchVsCollegePage = lazy(() => import("./pages/BranchVsCollegePage.jsx"));
const Blog = lazy(() => import("./pages/Blog.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));
const CampusNotes = lazy(() => import("./pages/CampusNotes.jsx"));
const CollegeParichayAI = lazy(() => import("./pages/CollegeParichayAI.jsx"));
const CampusFests = lazy(() => import("./pages/CampusFests.jsx"));
const Class11 = lazy(() => import("./pages/Class11.jsx"));
const Class12 = lazy(() => import("./pages/Class12.jsx"));
const JeeStrategy = lazy(() => import("./pages/JeeStrategy.jsx"));
const NeetStrategy = lazy(() => import("./pages/NeetStrategy.jsx"));
import CompareTray from "./components/CompareTray.jsx";
import Chatbot from "./components/Chatbot.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import AuthModal from "./auth/AuthModal.jsx";
import ReviewPopup from "./components/ReviewPopup.jsx";

/* Placeholder shown while a lazily-loaded page chunk is in flight. Holds a
   viewport-height box so swapping it for the real page shifts nothing (CLS). */
function RouteFallback() {
  return <div style={{ minHeight: "100vh" }} aria-busy="true" />;
}

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
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
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
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/ai" element={<CollegeParichayAI />} />
          </Routes>
        </Suspense>
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
        <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home onSearch={() => setSearchOpen(true)} />} />
          <Route path="/jee-main" element={<JeeMain />} />
          <Route path="/jee-advanced" element={<JeeAdvanced />} />
          <Route path="/jee-advanced-analysis" element={<JeeAdvancedAnalysis />} />
          <Route path="/jee-advanced-result-2026" element={<JeeAdvancedResult />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/colleges/:slug" element={<CollegeDetail />} />
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
          <Route path="/josaa-round-2-result-2026" element={<JosaaRound2Result />} />
          <Route path="/josaa-round-3-result-2026" element={<JosaaRound3Result />} />
          <Route path="/planner" element={<CounsellingPlanner />} />
          <Route path="/map" element={<CollegeMap />} />
          <Route path="/compare-exams" element={<CompareExams />} />
          <Route path="/other-exams" element={<OtherExams />} />
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
          {/* Mentor-facing, separate from the student dashboard above. */}
          <Route path="/mentor" element={<MentorDashboard />} />
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
        </Suspense>
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