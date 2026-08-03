/* Home — rebuilt as a short, focused hub.
   Hero → tools → branch catalog → rank-to-cutoff → branch vs college →
   plans → explore/premium colleges → admission timeline → FAQ. News, the
   application radar and top-colleges blocks now live on dedicated pages. */
import React, { lazy, Suspense } from "react";
import Seo from "../components/Seo.jsx";
import Hero from "../components/home/Hero.jsx";
import MentorshipRepresentation from "../components/home/MentorshipRepresentation.jsx";
import ToolsGrid from "../components/home/ToolsGrid.jsx";
import Defer from "../components/Defer.jsx";

const BranchCatalog = lazy(() => import("../components/home/BranchCatalog.jsx"));
const AdvancedPredictorHome = lazy(() => import("../components/home/AdvancedPredictorHome.jsx"));
const CollegeReviews = lazy(() => import("../components/home/CollegeReviews.jsx"));
const BranchVsCollege = lazy(() => import("../components/home/BranchVsCollege.jsx"));
const PlansSection = lazy(() => import("../components/home/PlansSection.jsx"));
const ExploreColleges = lazy(() => import("../components/home/ExploreColleges.jsx"));
const PremiumColleges = lazy(() => import("../components/home/PremiumColleges.jsx"));
const AdmissionTimeline = lazy(() => import("../components/home/AdmissionTimeline.jsx"));
const FaqSection = lazy(() => import("../components/home/FaqSection.jsx"));

export default function Home({ onSearch }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://collegeparichay.in/#website",
        "url": "https://collegeparichay.in/",
        "name": "CollegeParichay",
        "description": "JEE Rank Predictor & IIT NIT IIIT College Reviews",
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://collegeparichay.in/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://collegeparichay.in/#organization",
        "name": "CollegeParichay",
        "url": "https://collegeparichay.in/",
        "logo": "https://collegeparichay.in/cplogo.svg"
      },
      {
        "@type": "ItemList",
        "name": "Key Tools and Sections",
        "itemListElement": [
          {
            "@type": "SiteNavigationElement",
            "position": 1,
            "name": "JEE Main Rank Predictor",
            "url": "https://collegeparichay.in/jee-main"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 2,
            "name": "JEE Advanced Rank Predictor",
            "url": "https://collegeparichay.in/jee-advanced"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 3,
            "name": "College Explorer",
            "url": "https://collegeparichay.in/colleges"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 4,
            "name": "JoSAA Cutoffs",
            "url": "https://collegeparichay.in/cutoffs"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 5,
            "name": "Branch vs College",
            "url": "https://collegeparichay.in/branch-vs-college"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 6,
            "name": "NEET Rank Predictor",
            "url": "https://collegeparichay.in/neet"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 7,
            "name": "Campus Fests",
            "url": "https://collegeparichay.in/campus-fests"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 8,
            "name": "Mentorship",
            "url": "https://collegeparichay.in/mentorship"
          }
        ]
      }
    ]
  };

  return (
    <>
      <Seo path="/" jsonLd={jsonLd} />

      {/* ── Hero ── */}
      <Hero onSearch={onSearch} />

      {/* ── Mentorship Representation (Premium highlighting) ── */}
      <MentorshipRepresentation />

      {/* ── Smart tools (LIVE-card grid) ── */}
      <ToolsGrid />

      {/* Every section below the fold is gated on approaching the viewport.
          They were lazy() but rendered immediately, which splits the code
          without delaying it — all nine fetched and executed during load,
          costing ~1.3s of blocking time for pixels nobody had scrolled to. */}
      
      {/* ── Branch Explorer — 220+ branches, 10 paths ── */}
      <Defer minHeight={520}><BranchCatalog /></Defer>

      {/* ── JoSAA · JEE Advanced rank predictor (full tool) ── */}
      <Defer minHeight={640}><AdvancedPredictorHome /></Defer>

      {/* ── College Reviews — give a review / browse by college ── */}
      <Defer minHeight={480}><CollegeReviews /></Defer>

      {/* ── Branch vs College — 6-question assessment ── */}
      <Defer minHeight={480}><BranchVsCollege /></Defer>

      {/* ── 1-on-1 Mentorship plans ── */}
      <Defer minHeight={560}><PlansSection /></Defer>

      {/* ── Explore Colleges — flagship IITs (tool-style cards) ── */}
      <Defer minHeight={520}><ExploreColleges /></Defer>

      {/* ── Premium colleges that take your JEE rank (outside JoSAA) ── */}
      <Defer minHeight={520}><PremiumColleges /></Defer>

      {/* ── Admission timeline — wavy quarter rail, auto-advancing "NOW" ── */}
      <Defer minHeight={520}><AdmissionTimeline /></Defer>

      {/* ── FAQ ── */}
      <Defer minHeight={420}><FaqSection /></Defer>
    </>
  );
}
