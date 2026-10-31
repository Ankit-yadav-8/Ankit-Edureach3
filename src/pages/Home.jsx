/* Home - rebuilt as a short, focused hub.
   Hero → tools → branch catalog → rank-to-cutoff → branch vs college →
   plans → explore/premium colleges → admission timeline → FAQ. News, the
   application radar and top-colleges blocks now live on dedicated pages. */
import React, { lazy, Suspense } from "react";
import Seo from "../components/Seo.jsx";
import Hero from "../components/home/Hero.jsx";
import Defer from "../components/Defer.jsx";

const MentorshipBanner = lazy(() => import("../components/home/MentorshipBanner.jsx"));
const ToolsGrid = lazy(() => import("../components/home/ToolsGrid.jsx"));

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
        "@id": "https://campuspoint.in/#website",
        "url": "https://campuspoint.in/",
        "name": "CampusPoint",
        "description": "JEE Rank Predictor & IIT NIT IIIT College Reviews",
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://campuspoint.in/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "EducationalOrganization",
        "@id": "https://campuspoint.in/#organization",
        "name": "Campus Point",
        "url": "https://campuspoint.in/",
        "logo": "https://campuspoint.in/cplogo.svg",
        "sameAs": [
          "https://www.instagram.com/campuspoint.in",
          "https://youtube.com/@campuspoint"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "1280",
          "reviewCount": "1280"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Campus Point JEE 2027 Mentorship?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Campus Point provides 1-on-1 personal mentorship by top IIT Roorkee and IIT rankers for JEE 2027 aspirants. It includes daily customized study plans, 24/7 WhatsApp doubt solving, backlog management, and weekly mock test analysis starting at ₹3,499 till JEE Mains 2027."
            }
          },
          {
            "@type": "Question",
            "name": "How does 1-on-1 mentorship by IITians help improve JEE rank?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Unlike big batch coaching where everyone gets the same generic roadmap, your personal IITian mentor works only on your strengths and weak areas. They track your daily question count, analyze weekly test errors, and guide your strategy until JEE 2027."
            }
          },
          {
            "@type": "Question",
            "name": "How accurate is the Campus Point JEE Rank Predictor?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Campus Point's JEE Main and Advanced rank predictors are calibrated against official NTA percentile vs marks trends and JoSAA opening and closing ranks from past years, giving high-precision college predictions."
            }
          }
        ]
      },
      {
        "@type": "ItemList",
        "name": "Key Tools and Sections",
        "itemListElement": [
          {
            "@type": "SiteNavigationElement",
            "position": 1,
            "name": "JEE Main Rank Predictor",
            "url": "https://campuspoint.in/jee-main"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 2,
            "name": "JEE Advanced Rank Predictor",
            "url": "https://campuspoint.in/jee-advanced"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 3,
            "name": "College Explorer",
            "url": "https://campuspoint.in/colleges"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 4,
            "name": "JoSAA Cutoffs",
            "url": "https://campuspoint.in/cutoffs"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 5,
            "name": "Branch vs College",
            "url": "https://campuspoint.in/branch-vs-college"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 6,
            "name": "NEET Rank Predictor",
            "url": "https://campuspoint.in/neet"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 7,
            "name": "Campus Fests",
            "url": "https://campuspoint.in/campus-fests"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 8,
            "name": "Mentorship",
            "url": "https://campuspoint.in/mentorship"
          }
        ]
      }
    ]
  };

  return (
    <>
      <Seo
        rawTitle="Campus Point – JEE 2027 Mentorship by IITians, Rank Predictor & College Cutoffs"
        description="Crack JEE & NEET with 1-on-1 IITian mentorship (Till JEE Mains 2027 at ₹3,499). Predict your JEE Main & Advanced rank, explore JoSAA cutoffs, and compare 100+ colleges."
        path="/"
        jsonLd={jsonLd}
      />

      {/* ── Hero ── */}
      <Hero onSearch={onSearch} />

      {/* ── Mentorship Banner ── */}
      <Defer minHeight={300} rootMargin="800px"><MentorshipBanner /></Defer>

      {/* ── Smart tools (LIVE-card grid) ── */}
      <Defer minHeight={400} rootMargin="800px"><ToolsGrid /></Defer>

      {/* Every section below the fold is gated on approaching the viewport.
          They were lazy() but rendered immediately, which splits the code
          without delaying it - all nine fetched and executed during load,
          costing ~1.3s of blocking time for pixels nobody had scrolled to. */}
      
      {/* ── Branch Explorer - 220+ branches, 10 paths ── */}
      <Defer minHeight={520}><BranchCatalog /></Defer>

      {/* ── JoSAA · JEE Advanced rank predictor (full tool) ── */}
      <Defer minHeight={640}><AdvancedPredictorHome /></Defer>

      {/* ── College Reviews - give a review / browse by college ── */}
      <Defer minHeight={480}><CollegeReviews /></Defer>

      {/* ── Branch vs College - 6-question assessment ── */}
      <Defer minHeight={480}><BranchVsCollege /></Defer>

      {/* ── 1-on-1 Mentorship plans ── */}
      <Defer minHeight={560}><PlansSection /></Defer>

      {/* ── Explore Colleges - flagship IITs (tool-style cards) ── */}
      <Defer minHeight={520}><ExploreColleges /></Defer>

      {/* ── Premium colleges that take your JEE rank (outside JoSAA) ── */}
      <Defer minHeight={520}><PremiumColleges /></Defer>

      {/* ── Admission timeline - wavy quarter rail, auto-advancing "NOW" ── */}
      <Defer minHeight={520}><AdmissionTimeline /></Defer>

      {/* ── FAQ ── */}
      <Defer minHeight={420}><FaqSection /></Defer>
    </>
  );
}
