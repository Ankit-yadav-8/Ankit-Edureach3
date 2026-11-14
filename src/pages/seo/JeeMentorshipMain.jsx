import React from "react";
import { SEO_KEYWORD_MAP } from "../../data/seoKeywordMap.js";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import {
  ClusterNav,
  ClusterHero,
  ClusterPricing,
  ClusterFounders,
  ClusterCta,
  ClusterFaq,
  ClusterRelated,
  InteractiveJourneyRoadmap,
  getOrganizationSchema,
  getArticleSchema
} from "./ClusterShared.jsx";
import {
  Atom,
  FlaskConical,
  Sigma,
  Zap,
  Target,
  CheckCircle2,
  TrendingUp,
  BarChart,
  Clock,
  Layers,
  ArrowRight
} from "lucide-react";

export default function JeeMentorshipMain() {
  const currentPath = "/jee-mentorship/jee-main";

  const faqs = [
    {
      q: "What makes JEE Main mentorship different from general coaching?",
      a: "JEE Main is fundamentally an exam of speed, accuracy, and syllabus breadth rather than extreme depth. Our JEE Main mentorship program focuses on question selection efficiency, negative marking reduction, high-yield NCERT retention for Chemistry, and 10-year PYQ mastery to consistently target 200+ marks and 99+ percentile."
    },
    {
      q: "How does my personal JEE Main mentor help with shift percentiles?",
      a: "Because JEE Main uses normalisation across tough and easy shifts, students often panic during difficult papers. Your mentor trains you in dynamic benchmark calibration: identifying whether a shift is tough within the first 15 minutes, calibrating the minimum attempt threshold, and securing safe percentiles without reckless guessing."
    },
    {
      q: "How many mock tests should I take for JEE Main with mentor review?",
      a: "Our mentors recommend 15 to 25 full-length Computer Based Tests (CBT) during the final 3 months. Crucially, each mock is followed by a 2-hour question error audit with your mentor to log silly errors, formula slips, and time bottlenecks."
    },
    {
      q: "Can I use the CampusPoint JEE Main Rank Predictor alongside mentorship?",
      a: "Yes! Mentorship students use our calibrated JEE Main College & Rank Predictor to track where their current test marks place them among top NITs, IIITs, and GFTIs for JoSAA cutoffs."
    }
  ];

  const jsonLd = [
    getOrganizationSchema(),
    getArticleSchema({
      headline: "Dedicated JEE Main Mentorship & 1-on-1 Guidance",
      description: "Master JEE Main with 1-to-1 IITian mentorship. Get personalized study plans, speed & accuracy drills, test analysis, PYQ roadmaps, and 99 percentile strategies.",
      path: "/jee-mentorship/jee-main"
    }),
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "JEE Main Mentorship Program",
      "description": "Targeted 1-on-1 JEE Main mentorship by IITians focusing on speed, accuracy, mock test analysis, and 99 percentile strategy.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "CampusPoint",
        "url": "https://campuspoint.in"
      },
      "offers": {
        "@type": "Offer",
        "price": "3499",
        "priceCurrency": "INR",
        "url": "https://campuspoint.in/mentorship/jee-2027"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    }
  ];

  const keywords = SEO_KEYWORD_MAP["/jee-mentorship/jee-main"].targetKeywords;

  return (
    <div className="seo-cluster-page">
      <Seo
        title="JEE Main Mentorship Program | 1-to-1 Mentorship for JEE Main"
        description="Master JEE Main with 1-to-1 IITian mentorship. Get personalized study plans, speed & accuracy drills, test analysis, PYQ roadmaps, and 99 percentile strategies."
        path={currentPath}
        keywords={keywords}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "JEE Mentorship", path: "/jee-mentorship" },
          { name: "JEE Main", path: currentPath }
        ]}
        jsonLd={jsonLd}
      />

      <ClusterHero
        line1="Precision 1-on-1 Guidance"
        line1Squiggle="Guidance"
        line2Lead="for your"
        line2Box="JEE Main."
        description="Daily personal guidance from verified IIT Roorkee rankers to master rapid recall, 3-pass paper strategy, and score 99+ percentile."
        planKey="mentor-jee-2027-6m"
      />

      <ClusterNav currentPath={currentPath} />

      <main className="scp-container" id="details">
        {/* Core Strategy Breakdown */}
        <section className="scp-section" id="blueprint">
          <div className="scp-section-header" style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 36px" }}>
            <span className="scp-kicker">Precision Score Optimization</span>
            <h2 className="scp-h2">3 Core Pillars of JEE Main Prep</h2>
            <p className="scp-section-sub">
              Scoring 200+ in JEE Main requires rapid recall, calculation speed, and zero silly mistakes. Here is how your mentor optimizes your score:
            </p>
          </div>

          <div className="jmh-grid">
            {/* Pillar 1 */}
            <div className="jmh-card">
              <div className="jmh-card-top">
                <div className="jmh-card-icon">
                  <Target size={22} />
                </div>
                <span className="jmh-card-badge">LIVE</span>
              </div>
              <h3 className="jmh-card-title">Score Calibration</h3>
              <p className="jmh-card-desc">
                Engineered subject-wise score breakdown targeting 200+ marks with statistical certainty.
              </p>
              <ul className="jmh-card-bullets">
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Chemistry: 75–85 marks via NCERT mastery</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Physics: 70–80 marks via formula sprints</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Maths: 45–55 marks via 14 high-confidence picks</span>
                </li>
              </ul>
              <Link to="/jee-preparation/strategy" className="jmh-card-action">
                <span>Explore scoring strategy</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="jmh-card">
              <div className="jmh-card-top">
                <div className="jmh-card-icon">
                  <Clock size={22} />
                </div>
                <span className="jmh-card-badge">LIVE</span>
              </div>
              <h3 className="jmh-card-title">3-Pass Time Pacing</h3>
              <p className="jmh-card-desc">
                Rigorous exam pacing technique to maximize easy marks early and avoid time traps.
              </p>
              <ul className="jmh-card-bullets">
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Round 1 (0–60m): 30–35 direct recall problems</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Round 2 (60–140m): Multi-step moderate questions</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Round 3 (140–180m): Re-checks & high-yield attempts</span>
                </li>
              </ul>
              <Link to="/jee-preparation/study-plan" className="jmh-card-action">
                <span>View timing drill</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="jmh-card">
              <div className="jmh-card-top">
                <div className="jmh-card-icon">
                  <BarChart size={22} />
                </div>
                <span className="jmh-card-badge">LIVE</span>
              </div>
              <h3 className="jmh-card-title">Test Autopsy & Cutoffs</h3>
              <p className="jmh-card-desc">
                Weekly question-level diagnostic linking score improvements directly to JoSAA cutoffs.
              </p>
              <ul className="jmh-card-bullets">
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Isolate calculation slips vs concept gaps</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Eliminate questions with &gt;3 mins & zero marks</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Align mock percentiles with top NIT branches</span>
                </li>
              </ul>
              <Link to="/jee-mentorship/test-analysis" className="jmh-card-action">
                <span>See test analysis</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* 2-Month All-Subject Revision Strategy */}
        <section className="scp-section" id="two-month-strategy">
          <div className="scp-section-header">
            <span className="scp-kicker">60-Day Last-Lap Blueprint</span>
            <h2 className="scp-h2">All-Subject 2-Month Revision Strategy for JEE Main</h2>
          </div>

          {/* 3 Subject Strategy Cards */}
          <div className="jmh-grid" style={{ marginBottom: 32 }}>
            {/* Physics Card */}
            <div className="jmh-card">
              <div className="jmh-card-top">
                <div className="jmh-card-icon" style={{ background: "rgba(99, 102, 241, 0.08)", color: "#6366F1" }}>
                  <Atom size={22} />
                </div>
                <span className="jmh-card-badge" style={{ background: "rgba(99, 102, 241, 0.1)", color: "#4F46E5" }}>
                  TARGET: 75–85
                </span>
              </div>
              <h3 className="jmh-card-title">Physics 60-Day Sprint</h3>
              <p className="jmh-card-desc">
                High-yield formula recall, PYQ mastery in Modern Physics & Electrodynamics, and eliminating calculation slips.
              </p>
              <ul className="jmh-card-bullets">
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" style={{ background: "#6366F1" }} />
                  <span><strong>Month 1:</strong> Top 12 high-weightage chapters + 2019–2025 PYQs</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" style={{ background: "#6366F1" }} />
                  <span><strong>Month 2:</strong> 2 timed sectional tests/week + formula error logs</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" style={{ background: "#6366F1" }} />
                  <span><strong>Key Priority:</strong> Modern Physics, Current Electricity, Kinematics, Optics</span>
                </li>
              </ul>
              <Link to="/jee-preparation/strategy" className="jmh-card-action">
                <span>View physics roadmap</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Chemistry Card */}
            <div className="jmh-card">
              <div className="jmh-card-top">
                <div className="jmh-card-icon" style={{ background: "rgba(255, 105, 61, 0.08)", color: "#FF693D" }}>
                  <FlaskConical size={22} />
                </div>
                <span className="jmh-card-badge" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#059669" }}>
                  TARGET: 80–90
                </span>
              </div>
              <h3 className="jmh-card-title">Chemistry Score Engine</h3>
              <p className="jmh-card-desc">
                The highest scoring subject per minute. Master line-by-line NCERT Inorganic and Organic reaction roadmaps.
              </p>
              <ul className="jmh-card-bullets">
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" style={{ background: "#FF7A3C" }} />
                  <span><strong>Month 1:</strong> Daily 1-hr NCERT Inorganic reading + Organic reaction maps</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" style={{ background: "#FF7A3C" }} />
                  <span><strong>Month 2:</strong> Past-shift CBT papers in 40-minute speed sprints</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" style={{ background: "#FF7A3C" }} />
                  <span><strong>Key Priority:</strong> Coordination, GOC, Chemical Bonding, Carbonyls</span>
                </li>
              </ul>
              <Link to="/jee-preparation/strategy" className="jmh-card-action">
                <span>View chemistry roadmap</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Mathematics Card */}
            <div className="jmh-card">
              <div className="jmh-card-top">
                <div className="jmh-card-icon" style={{ background: "rgba(16, 185, 129, 0.08)", color: "#10B981" }}>
                  <Sigma size={22} />
                </div>
                <span className="jmh-card-badge" style={{ background: "rgba(245, 158, 11, 0.12)", color: "#D97706" }}>
                  TARGET: 50–60
                </span>
              </div>
              <h3 className="jmh-card-title">Maths Accuracy Playbook</h3>
              <p className="jmh-card-desc">
                JEE Maths tests time discipline. Secure 99%ile by cherry-picking 12–14 safe problems and avoiding ego traps.
              </p>
              <ul className="jmh-card-bullets">
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" style={{ background: "#10B981" }} />
                  <span><strong>Month 1:</strong> Master 14 safe scoring chapters with 25 timed problems daily</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" style={{ background: "#10B981" }} />
                  <span><strong>Month 2:</strong> Question-filtering drills with strict 3-min skip rule</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" style={{ background: "#10B981" }} />
                  <span><strong>Key Priority:</strong> Vectors & 3D, Matrices, Sequences, Definite Integrals</span>
                </li>
              </ul>
              <Link to="/jee-preparation/strategy" className="jmh-card-action">
                <span>View maths selection guide</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* 2-Phase 60-Day Calendar Breakdown */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
            gap: 22,
            maxWidth: 1140,
            margin: "0 auto"
          }}>
            <div style={{
              background: "#FFFFFF",
              border: "1px solid rgba(226, 232, 240, 0.9)",
              borderRadius: 20,
              padding: "26px 24px",
              boxShadow: "0 4px 18px -3px rgba(15, 23, 42, 0.03)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{
                  background: "rgba(255, 105, 61, 0.1)",
                  color: "#FF5C35",
                  fontWeight: 800,
                  fontSize: "0.78rem",
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontFamily: "Space Grotesk, sans-serif"
                }}>
                  PHASE 1 · DAYS 1–30
                </span>
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.06rem", margin: 0, color: "#0F172A" }}>
                  High-Yield Consolidation & PYQs
                </h4>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
                <li style={{ fontSize: "0.87rem", color: "#475569", lineHeight: 1.5, display: "flex", gap: 8 }}>
                  <span style={{ color: "#FF7A3C", fontWeight: 700 }}>•</span>
                  <span><strong>70% Daily Time:</strong> Finish remaining syllabus & drill 2019–2025 chapterwise PYQs.</span>
                </li>
                <li style={{ fontSize: "0.87rem", color: "#475569", lineHeight: 1.5, display: "flex", gap: 8 }}>
                  <span style={{ color: "#FF7A3C", fontWeight: 700 }}>•</span>
                  <span><strong>Daily Habit:</strong> 1-hour active formula sheet & NCERT Inorganic reaction revision.</span>
                </li>
                <li style={{ fontSize: "0.87rem", color: "#475569", lineHeight: 1.5, display: "flex", gap: 8 }}>
                  <span style={{ color: "#FF7A3C", fontWeight: 700 }}>•</span>
                  <span><strong>Weekly Review:</strong> 1 part-syllabus mock test every Sunday with question-by-question autopsy.</span>
                </li>
              </ul>
            </div>

            <div style={{
              background: "#FFFFFF",
              border: "1px solid rgba(226, 232, 240, 0.9)",
              borderRadius: 20,
              padding: "26px 24px",
              boxShadow: "0 4px 18px -3px rgba(15, 23, 42, 0.03)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  color: "#059669",
                  fontWeight: 800,
                  fontSize: "0.78rem",
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontFamily: "Space Grotesk, sans-serif"
                }}>
                  PHASE 2 · DAYS 31–60
                </span>
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.06rem", margin: 0, color: "#0F172A" }}>
                  Full-Length CBT Mocks & Mistake Autopsy
                </h4>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
                <li style={{ fontSize: "0.87rem", color: "#475569", lineHeight: 1.5, display: "flex", gap: 8 }}>
                  <span style={{ color: "#10B981", fontWeight: 700 }}>•</span>
                  <span><strong>Alternate-Day Mocks:</strong> Full 3-hour tests strictly in exact NTA slot timings (09 AM or 03 PM).</span>
                </li>
                <li style={{ fontSize: "0.87rem", color: "#475569", lineHeight: 1.5, display: "flex", gap: 8 }}>
                  <span style={{ color: "#10B981", fontWeight: 700 }}>•</span>
                  <span><strong>Error Autopsy Diary:</strong> Classify every mark lost into silly slip vs conceptual trap.</span>
                </li>
                <li style={{ fontSize: "0.87rem", color: "#475569", lineHeight: 1.5, display: "flex", gap: 8 }}>
                  <span style={{ color: "#10B981", fontWeight: 700 }}>•</span>
                  <span><strong>Final 10 Days:</strong> Zero new concepts; 100% focused on confidence & formula flashcards.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <ClusterPricing
          planKey="mentor-jee-2027-6m"
          exam="JEE Main 2027"
          sublabel="Till JEE Mains 2027"
        />

        <ClusterFounders />

        {/* FAQs */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">FAQ</span>
            <h2 className="scp-h2">Frequently Asked Questions</h2>
          </div>
          <ClusterFaq items={faqs} />
        </section>

        {/* Related Pages */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Related Clusters</span>
            <h2 className="scp-h2">Continue Exploring JEE Mentorship Topics</h2>
          </div>
          <ClusterRelated
            currentPath={currentPath}
            selectedPaths={[
              "/jee-mentorship",
              "/jee-mentorship/jee-advanced",
              "/jee-mentorship/test-analysis",
              "/jee-preparation/study-plan"
            ]}
          />
        </section>
      </main>
    </div>
  );
}

