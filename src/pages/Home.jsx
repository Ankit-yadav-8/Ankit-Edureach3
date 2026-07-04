/* Home — rebuilt as a short, focused hub.
   Hero → tools → branch catalog → rank-to-cutoff → branch vs college →
   plans → exam buzz teaser → success stories → FAQ. News, the application
   radar and top-colleges blocks now live on dedicated pages. */
import Seo from "../components/Seo.jsx";
import Hero from "../components/home/Hero.jsx";
import CollegeTicker from "../components/home/CollegeTicker.jsx";
import ToolsGrid from "../components/home/ToolsGrid.jsx";
import BranchCatalog from "../components/home/BranchCatalog.jsx";
import AdvancedPredictorHome from "../components/home/AdvancedPredictorHome.jsx";
import CollegeReviews from "../components/home/CollegeReviews.jsx";
import BranchVsCollege from "../components/home/BranchVsCollege.jsx";
import PlansSection from "../components/home/PlansSection.jsx";
import ExploreColleges from "../components/home/ExploreColleges.jsx";
import PremiumColleges from "../components/home/PremiumColleges.jsx";
import ExamCalendar from "../components/home/ExamCalendar.jsx";
import ExamBuzzHome from "../components/home/ExamBuzzHome.jsx";
import Testimonials from "../components/home/Testimonials.jsx";
import FaqSection from "../components/home/FaqSection.jsx";

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
        "logo": "https://collegeparichay.in/cplogo3.jpeg"
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

      {/* ── College logo ticker ── */}
      <CollegeTicker />

      {/* ── Smart tools (LIVE-card grid) ── */}
      <ToolsGrid />

      {/* ── Branch Explorer — 220+ branches, 10 paths ── */}
      <BranchCatalog />

      {/* ── JoSAA · JEE Advanced rank predictor (full tool) ── */}
      <AdvancedPredictorHome />

      {/* ── College Reviews — give a review / browse by college ── */}
      <CollegeReviews />

      {/* ── Branch vs College — 6-question assessment ── */}
      <BranchVsCollege />

      {/* ── 1-on-1 Mentorship plans ── */}
      <PlansSection />

      {/* ── Explore Colleges — flagship IITs (tool-style cards) ── */}
      <ExploreColleges />

      {/* ── Premium colleges that take your JEE rank (outside JoSAA) ── */}
      <PremiumColleges />

      {/* ── Exam Calendar 2026–27 — auto-scrolling month rail ── */}
      <ExamCalendar />

      {/* ── Exam Buzz teaser (news + radar live on /exam-buzz) ── */}
      <ExamBuzzHome />

      {/* ── Success stories ── */}
      <Testimonials />

      {/* ── FAQ ── */}
      <FaqSection />
    </>
  );
}
