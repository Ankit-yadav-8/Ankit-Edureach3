import { useState, useEffect, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import TopBar from "./components/TopBar.jsx";
import Footer from "./components/Footer.jsx";
import RouteErrorBoundary from "./components/RouteErrorBoundary.jsx";
import { useAuth } from "./auth/AuthContext.jsx";
import { lazyRetry, clearChunkReloadFlag } from "./utils/lazyRetry.js";
import { ScrollProgress, BackToTop } from "./components/ScrollUtils.jsx";
const ScrollProgressBar = lazyRetry(() => import("./components/Animations.jsx").then(m => ({ default: m.ScrollProgressBar })));

// Home (the landing page + hero) ships in the entry bundle so it paints the
// instant the main JS runs — no extra lazy-chunk round-trip on first load. Its
// own below-the-fold sections are still lazy/deferred inside Home.jsx.
import Home from "./pages/Home.jsx";

/* Route-level code splitting: only Home ships in the initial bundle; every
   other page is fetched on navigation. Previously all ~50 pages were static
   imports, so one 2.6 MB chunk had to parse before the homepage could paint. */
const JeeMain = lazyRetry(() => import("./pages/JeeMain.jsx"));
const JeeAdvanced = lazyRetry(() => import("./pages/JeeAdvanced.jsx"));
const JeeAdvancedAnalysis = lazyRetry(() => import("./pages/JeeAdvancedAnalysis.jsx"));
const JeeAdvancedResult = lazyRetry(() => import("./pages/JeeAdvancedResult.jsx"));
const Colleges = lazyRetry(() => import("./pages/Colleges.jsx"));
const CollegeDetail = lazyRetry(() => import("./pages/CollegeDetail.jsx"));
const PrivateDetail = lazyRetry(() => import("./pages/PrivateDetail.jsx"));
const PrivateUnis = lazyRetry(() => import("./pages/PrivateUnis.jsx"));
const About = lazyRetry(() => import("./pages/About.jsx"));
const Developer = lazyRetry(() => import("./pages/Developer.jsx"));
const Compare = lazyRetry(() => import("./pages/Compare.jsx"));
const Shortlist = lazyRetry(() => import("./pages/Shortlist.jsx"));
const ForYou = lazyRetry(() => import("./pages/ForYou.jsx"));
const Josaa2026 = lazyRetry(() => import("./pages/Josaa2026.jsx"));
const JosaaRound1Result = lazyRetry(() => import("./pages/JosaaRound1Result.jsx"));
const JosaaRound2Result = lazyRetry(() => import("./pages/JosaaRound2Result.jsx"));
const JosaaRound3Result = lazyRetry(() => import("./pages/JosaaRound3Result.jsx"));
const CounsellingPlanner = lazyRetry(() => import("./pages/CounsellingPlanner.jsx"));
const CollegeMap = lazyRetry(() => import("./pages/CollegeMap.jsx"));
const CompareExams = lazyRetry(() => import("./pages/CompareExams.jsx"));
const OtherExams = lazyRetry(() => import("./pages/OtherExams.jsx"));
const Tools = lazyRetry(() => import("./pages/Tools.jsx"));
const Reviews = lazyRetry(() => import("./pages/Reviews.jsx"));
const Scholarships = lazyRetry(() => import("./pages/Scholarships.jsx"));
const OfficialCutoffs = lazyRetry(() => import("./pages/OfficialCutoffs.jsx"));
const SearchResults = lazyRetry(() => import("./pages/SearchResults.jsx"));
const NotFound = lazyRetry(() => import("./pages/NotFound.jsx"));
const Admin = lazyRetry(() => import("./pages/Admin.jsx"));
const JeeResources = lazyRetry(() => import("./pages/JeeResources.jsx"));
const Neet = lazyRetry(() => import("./pages/Neet.jsx"));
const NeetColleges = lazyRetry(() => import("./pages/NeetColleges.jsx"));
const NeetCollegeDetail = lazyRetry(() => import("./pages/NeetCollegeDetail.jsx"));
const HowToUse = lazyRetry(() => import("./pages/HowToUse.jsx"));
const Mentorship = lazyRetry(() => import("./pages/Mentorship.jsx"));
const Privacy = lazyRetry(() => import("./pages/Privacy.jsx"));
const Terms = lazyRetry(() => import("./pages/Terms.jsx"));
const Dashboard = lazyRetry(() => import("./pages/Dashboard.jsx"));
const MentorshipDashboard = lazyRetry(() => import("./pages/MentorshipDashboard.jsx"));
// Both were eager, and both reach the search index -> data/colleges.js, so every
// page preloaded ~100KB of college data plus the index build just to render a
// floating button and a closed overlay. Neither is needed for first paint.
const Chatbot = lazyRetry(() => import("./components/Chatbot.jsx"));
const SearchOverlay = lazyRetry(() => import("./components/SearchOverlay.jsx"));
const MentorDashboard = lazyRetry(() => import("./pages/MentorDashboard.jsx"));
const PublicCommunity = lazyRetry(() => import("./pages/PublicCommunity.jsx"));
const Branches = lazyRetry(() => import("./pages/Branches.jsx"));
const BranchDetail = lazyRetry(() => import("./pages/BranchDetail.jsx"));
const BranchVsCollegePage = lazyRetry(() => import("./pages/BranchVsCollegePage.jsx"));
const Blog = lazyRetry(() => import("./pages/Blog.jsx"));
const BlogPost = lazyRetry(() => import("./pages/BlogPost.jsx"));
const CampusNotes = lazyRetry(() => import("./pages/CampusNotes.jsx"));
const CollegeParichayAI = lazyRetry(() => import("./pages/CollegeParichayAI.jsx"));
const CampusFests = lazyRetry(() => import("./pages/CampusFests.jsx"));
const Class11 = lazyRetry(() => import("./pages/Class11.jsx"));
const Class12 = lazyRetry(() => import("./pages/Class12.jsx"));
const JeeStrategy = lazyRetry(() => import("./pages/JeeStrategy.jsx"));
const NeetStrategy = lazyRetry(() => import("./pages/NeetStrategy.jsx"));
import CompareTray from "./components/CompareTray.jsx";
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
  const { openReset } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("reset")) {
      openReset();
      // Note: We don't remove it from the URL here anymore; AuthModal will do it after reading.
    }
  }, [openReset]);

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

  // Mark this load as healthy (re-enables stale-chunk auto-reload for the next
  // deploy) and warm the most-visited route chunks while the browser is idle,
  // so the first click on those links navigates instantly instead of waiting
  // on a download.
  useEffect(() => {
    clearChunkReloadFlag();
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => {
      [JeeMain, JeeAdvanced, Colleges, OfficialCutoffs, ForYou, Neet, Mentorship,
       CounsellingPlanner, CollegeMap, Compare, Branches, BranchVsCollegePage,
       CampusFests, PrivateUnis, SearchResults].forEach((c) => c.preload?.());
    });
    return () => cancel(id);
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
        <RouteErrorBoundary key={pathname}>
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
        </RouteErrorBoundary>
      </main>

      <Footer />
      <BackToTop />
      <CompareTray />
      <Suspense fallback={null}><Chatbot /></Suspense>
      <WhatsAppButton />
      <AuthModal />
      <ReviewPopup />
      {searchOpen && (
        <Suspense fallback={null}>
          <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
        </Suspense>
      )}
    </>
  );
}