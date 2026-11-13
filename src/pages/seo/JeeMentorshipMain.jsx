import React from "react";
import { SEO_KEYWORD_MAP } from "../../data/seoKeywordMap.js";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import {
  ClusterNav,
  ClusterHero,
  ClusterCta,
  ClusterFaq,
  ClusterRelated,
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

      <ClusterNav currentPath={currentPath} />

      <ClusterHero
        badge="TARGET 99+ PERCENTILE IN JEE MAIN"
        title={
          <>
            Dedicated <span className="brand-accent">JEE Main Mentorship</span> & 1-on-1 Guidance
          </>
        }
        description="Crack the 99 percentile barrier in JEE Main. Work with a verified IITian mentor to master question selection, eliminate negative marks, master high-yield NCERT chemistry, and analyze full-length mock tests."
        stats={[
          { value: "99+ %ile", label: "Strategic Target Benchmark", color: "brand" },
          { value: "200+ Marks", label: "Optimized Score Model", color: "emerald" },
          { value: "10-Yr PYQs", label: "Structured Trend Mapping", color: "violet" },
          { value: "1-on-1", label: "Personalized Strategy Calls", color: "brand" }
        ]}
        ctaText="Join JEE Main Mentorship · ₹3,499"
        ctaLink="/mentorship/jee-2027"
        secondaryText="View 99%ile Blueprint"
        secondaryLink="#blueprint"
      />

      <main className="scp-container" id="details">
        {/* Core Strategy Breakdown */}
        <section className="scp-section" id="blueprint">
          <div className="scp-section-header">
            <span className="scp-kicker">Precision Score Optimization</span>
            <h2 className="scp-h2">The 4 Pillars of CampusPoint JEE Main Mentorship</h2>
            <p className="scp-section-sub">
              Scoring 200+ in JEE Main requires a very different approach than JEE Advanced. While Advanced tests multi-concept depth, Main tests rapid recall, calculation speed, and zero silly mistakes.
            </p>
          </div>

          <div className="scp-grid-2">
            <div className="scp-card">
              <div className="scp-card-icon brand">
                <Target size={22} />
              </div>
              <h3 className="scp-card-h3">1. Subject-Wise Scoring Calibration</h3>
              <p className="scp-card-p">
                We engineer your score breakdown with statistical certainty:
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><strong>Chemistry (75-85 Marks):</strong> 40 minutes target. 100% NCERT line-by-line coverage for Inorganic & Organic ensures quick, sure marks.</li>
                <li className="scp-card-list-item"><strong>Physics (70-80 Marks):</strong> Formula sheets, direct application numericals, and modern physics + semiconductor scoring boosters.</li>
                <li className="scp-card-list-item"><strong>Mathematics (45-55 Marks):</strong> Aggressive question filtration. Solving 12-14 high-confidence questions in 60 minutes guarantees 99%ile in Maths.</li>
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
                <li className="scp-card-list-item"><strong>Round 1 (0 to 60 mins):</strong> Solve 30-35 easy, direct recall questions across all 3 subjects without calculation heavy traps.</li>
                <li className="scp-card-list-item"><strong>Round 2 (60 to 140 mins):</strong> Tackle moderate multi-step questions where the pathway is known.</li>
                <li className="scp-card-list-item"><strong>Round 3 (140 to 180 mins):</strong> Re-check calculations, verify numericals, and attempt 4-5 harder questions.</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon violet">
                <BarChart size={22} />
              </div>
              <h3 className="scp-card-h3">3. Mock Test Error Diagnostics</h3>
              <p className="scp-card-p">
                After every mock test, your mentor analyzes:
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item">Unforced calculation errors vs conceptual gaps</li>
                <li className="scp-card-list-item">Questions where more than 3 minutes were spent with 0 marks returned</li>
                <li className="scp-card-list-item">Categorizing wrong attempts into a targeted 7-day correction plan</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon amber">
                <TrendingUp size={22} />
              </div>
              <h3 className="scp-card-h3">4. Rank Prediction & JoSAA Cutoff Alignment</h3>
              <p className="scp-card-p">
                Understand your college destination early:
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item">Directly check your projected rank using our <Link to="/jee-main" style={{ color: "var(--scp-brand)", fontWeight: 600 }}>JEE Main Rank Predictor</Link>.</li>
                <li className="scp-card-list-item">Align current mock marks with top NITs (Trichy, Surathkal, Warangal) and IIIT Computer Science cutoffs.</li>
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

        <ClusterCta
          title="Secure Your 99 Percentile in JEE Main"
          subtitle="Get a dedicated IITian mentor who has scored 99.5+ percentile themselves. We craft your daily plan, monitor study hours, and review every test attempt till the exam day."
          primaryText="Start JEE Main Mentorship · ₹3,499"
          primaryLink="/mentorship/jee-2027"
        />

        {/* FAQs */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">FAQ</span>
            <h2 className="scp-h2">Frequently Asked Questions on JEE Main Mentorship</h2>
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

