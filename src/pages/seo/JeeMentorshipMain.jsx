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
        badge="🎯 TARGET 99+ PERCENTILE · SPEED & ACCURACY"
        titlePrefix="Dedicated"
        accentWord="JEE Main Mentorship"
        titleSuffix="& 1-on-1 Strategy"
        description="Crack the 99 percentile barrier in JEE Main. Work with a verified IITian mentor to master question selection, eliminate negative marks, master high-yield NCERT chemistry, and analyze full-length mock tests."
        planKey="mentor-jee-2027-6m"
      />

      <ClusterNav currentPath={currentPath} />

      <InteractiveJourneyRoadmap
        title="Interactive 1-on-1 Roadmap for JEE Main 2027"
        subtitle="Work with your IITian mentor across these 6 strategic milestones. Click any phase to inspect your weekly deliverables."
        planKey="mentor-jee-2027-6m"
        targetExam="JEE Main 2027"
      />

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

          <div className="scp-grid-3">
            <div className="scp-card">
              <div className="scp-card-icon brand">
                <Target size={22} />
              </div>
              <h3 className="scp-card-h3">1. Subject-Wise Scoring Calibration</h3>
              <p className="scp-card-p">
                We engineer your score breakdown with statistical certainty:
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><strong>Chemistry (75–85):</strong> 40m target. NCERT Inorganic & Organic mastery.</li>
                <li className="scp-card-list-item"><strong>Physics (70–80):</strong> Formula sheets, direct numericals & modern physics.</li>
                <li className="scp-card-list-item"><strong>Maths (45–55):</strong> Cherry-picking 12–14 high-confidence problems.</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon emerald">
                <Clock size={22} />
              </div>
              <h3 className="scp-card-h3">2. 3-Pass Exam Time Management</h3>
              <p className="scp-card-p">
                Your mentor coaches you to solve the paper in 3 distinct rounds:
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><strong>Round 1 (0 to 60m):</strong> 30–35 easy, direct recall questions across all 3 subjects.</li>
                <li className="scp-card-list-item"><strong>Round 2 (60 to 140m):</strong> Tackle moderate multi-step questions.</li>
                <li className="scp-card-list-item"><strong>Round 3 (140 to 180m):</strong> Re-check calculations & attempt 4–5 harder questions.</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon violet">
                <BarChart size={22} />
              </div>
              <h3 className="scp-card-h3">3. Test Diagnostics & Rank Alignment</h3>
              <p className="scp-card-p">
                Weekly mistake autopsy paired with JoSAA college cutoffs:
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item">Isolate unforced calculation errors vs genuine concept gaps.</li>
                <li className="scp-card-list-item">Eliminate questions where &gt;3 mins were spent with 0 marks.</li>
                <li className="scp-card-list-item">Align mock percentiles with top NIT (Trichy, Surathkal) cutoffs.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Study Timetable Blueprint */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Recommended Schedule</span>
            <h2 className="scp-h2">Ideal Daily Study Plan for JEE Main Aspirants</h2>
            <p className="scp-section-sub">
              Your personal mentor personalizes this baseline timetable to fit your exact coaching hours and school commitments.
            </p>
          </div>

          <div className="scp-table-wrapper">
            <table className="scp-table">
              <thead>
                <tr>
                  <th>Time Slot</th>
                  <th>Activity</th>
                  <th>Focus Area</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>06:30 AM – 08:30 AM</td>
                  <td>Active Recall & Chemistry NCERT</td>
                  <td>Inorganic reactions, coordination compounds, organic mechanisms</td>
                </tr>
                <tr>
                  <td>09:00 AM – 01:00 PM</td>
                  <td>School / Coaching or Self-Study Slot 1</td>
                  <td>Core theory understanding & classroom note assimilation</td>
                </tr>
                <tr>
                  <td>02:30 PM – 05:00 PM</td>
                  <td>Physics Problem Solving Sprint</td>
                  <td>30-40 timed numericals, mechanics, electrodynamics PYQs</td>
                </tr>
                <tr>
                  <td>05:30 PM – 07:30 PM</td>
                  <td>Maths Problem Drilling</td>
                  <td>15-20 challenging problems, calculus, coordinate geometry</td>
                </tr>
                <tr>
                  <td>08:30 PM – 10:00 PM</td>
                  <td>Backlog Recovery or Test Revision</td>
                  <td>Clearing flagged mistakes and previous week error logs</td>
                </tr>
                <tr>
                  <td>10:00 PM – 10:30 PM</td>
                  <td>Mentor Daily Log Submission</td>
                  <td>Submitting completed question count & receiving next day plan</td>
                </tr>
              </tbody>
            </table>
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

