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
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSearch,
  Check,
  X,
  ArrowRight,
  TrendingUp,
  Cpu
} from "lucide-react";

export default function JeeMentorshipTestAnalysis() {
  const currentPath = "/jee-mentorship/test-analysis";

  const faqs = [
    {
      q: "Why is question-level mock test analysis better than just seeing test rank?",
      a: "Looking only at total marks or rank creates panic without providing solutions. A question-level audit reveals the precise micro-causes of lost marks: how many questions were lost to silly mistakes, how many minutes were squandered on unsolvable traps, and which specific chapters contributed negative marks. Fixing these directly adds 30-50 marks in the next test."
    },
    {
      q: "What is the CampusPoint 8-Step Test Analysis Loop?",
      a: "Our analysis engine follows: 1. Full CBT Test → 2. Question-level breakdown → 3. Correct / Incorrect / Skipped tagging → 4. Time-spent per question tracking → 5. Accuracy percentage by sub-topic → 6. Identification of weak chapters → 7. 1-on-1 Mentor review call → 8. Tailored 7-day corrective task list."
    },
    {
      q: "How does my mentor help eliminate silly mistakes in JEE tests?",
      a: "Mentors mandate a dedicated 'Error Diary'. Every calculation slip or sign mistake is written down by the student along with the psychological trigger (rushing through the last 10 minutes, unorganized rough sheet work). The student re-reads this diary 30 minutes before every new mock test to prime their subconscious against repeating it."
    },
    {
      q: "How many mock tests should I take during JEE preparation?",
      a: "For Class 12 and Droppers, 1 part-test every 2 weeks during syllabus coverage, increasing to 2 full-syllabus mock tests per week in the final 2 months. Crucially, each 3-hour test must be matched with at least 2 hours of thorough analysis."
    }
  ];

  const jsonLd = [
    getOrganizationSchema(),
    getArticleSchema({
      headline: "Precision JEE Test Analysis & Mistake Tracking",
      description: "Master JEE mock test analysis with our 8-step question-level error tracking system. Eliminate negative marks, analyze time-spent bottlenecks, and improve by 40+ marks.",
      path: "/jee-mentorship/test-analysis"
    }),
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "JEE Mock Test Analysis & Performance Mentorship",
      "description": "Systematic 8-step question error tracking, time-spent analysis, and mentor remediation to eliminate negative marking in JEE Main & Advanced.",
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

  const keywords = SEO_KEYWORD_MAP["/jee-mentorship/test-analysis"].targetKeywords;

  return (
    <div className="seo-cluster-page">
      <Seo
        title="JEE Test Analysis & Mock Test Mentorship | Error Tracking System"
        description="Master JEE mock test analysis with our 8-step question-level error tracking system. Eliminate negative marks, analyze time-spent bottlenecks, and improve by 40+ marks."
        path={currentPath}
        keywords={keywords}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "JEE Mentorship", path: "/jee-mentorship" },
          { name: "Test Analysis", path: currentPath }
        ]}
        jsonLd={jsonLd}
      />

      <ClusterNav currentPath={currentPath} />

      <ClusterHero
        badge="SCIENTIFIC QUESTION ERROR DIAGNOSTICS"
        title={
          <>
            Precision <span className="brand-accent">JEE Test Analysis</span> & Mistake Tracking
          </>
        }
        description="Don't just look at your score and feel depressed. Break down your exam question-by-question: time spent per problem, silly slips vs concept gaps, and turn negative marks into guaranteed points with your IITian mentor."
        stats={[
          { value: "8-Step", label: "Diagnostic Review Engine", color: "brand" },
          { value: "-15 to -30", label: "Negative Marks Eliminated", color: "emerald" },
          { value: "+40-55", label: "Avg Score Growth in 4 Mocks", color: "violet" },
          { value: "1-on-1", label: "Weekly Mentor Test Audit", color: "brand" }
        ]}
        ctaText="Enroll in Mentorship · ₹3,499"
        ctaLink="/mentorship/jee-2027"
        secondaryText="View 8-Step System"
        secondaryLink="#system"
      />

      <main className="scp-container" id="details">
        {/* The 8-Step Test Engine */}
        <section className="scp-section" id="system">
          <div className="scp-section-header">
            <span className="scp-kicker">CampusPoint Test Intelligence</span>
            <h2 className="scp-h2">The 8-Step Mock Test Analysis Loop</h2>
            <p className="scp-section-sub">
              This is the exact methodology top IITians use to consistently improve their ranks across every mock test:
            </p>
          </div>

          <div className="scp-table-wrapper">
            <table className="scp-table">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Action Step</th>
                  <th>Outcome & Metric Generated</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Step 1</strong></td>
                  <td>Mock Test Attempt</td>
                  <td>Full 3-hour CBT simulation under strict exam hall conditions.</td>
                </tr>
                <tr>
                  <td><strong>Step 2</strong></td>
                  <td>Question-Level Audit</td>
                  <td>Classification into Correct, Incorrect, and Skipped across all 75-90 questions.</td>
                </tr>
                <tr>
                  <td><strong>Step 3</strong></td>
                  <td>Time-Spent Tracking</td>
                  <td>Flagging questions where {">"} 3.5 minutes were spent without reaching the answer.</td>
                </tr>
                <tr>
                  <td><strong>Step 4</strong></td>
                  <td>Accuracy Metric</td>
                  <td>Calculating subject-wise strike rate (Target: {">"} 85% accuracy in attempted questions).</td>
                </tr>
                <tr>
                  <td><strong>Step 5</strong></td>
                  <td>Error Categorization</td>
                  <td>Tagging each mistake as Silly Error, Conceptual Deficit, or Formula Blindspot.</td>
                </tr>
                <tr>
                  <td><strong>Step 6</strong></td>
                  <td>Weak Chapter Detection</td>
                  <td>Algorithmic detection of topics where accuracy falls below 50%.</td>
                </tr>
                <tr>
                  <td><strong>Step 7</strong></td>
                  <td>1-on-1 Mentor Review</td>
                  <td>A 30-minute private call with your IITian mentor analyzing your psychological and tactical choices.</td>
                </tr>
                <tr>
                  <td><strong>Step 8</strong></td>
                  <td>Corrective 7-Day Plan</td>
                  <td>Assigning specific re-practice questions for flagged chapters to prevent recurring slips.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* The 4 Mistake Categories */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Eliminating Score Leaks</span>
            <h2 className="scp-h2">The 4 Types of Marks Lost in JEE Mocks</h2>
            <p className="scp-section-sub">
              When students score 120/300, they believe they need to learn 180 marks worth of new physics, chemistry, and maths. In reality, over 50 marks are lost to preventable tactical blunders:
            </p>
          </div>

          <div className="scp-grid-2">
            <div className="scp-card">
              <div className="scp-card-icon brand">
                <AlertTriangle size={22} />
              </div>
              <h3 className="scp-card-h3">1. Silly & Calculation Slips (-15 to -25 Marks)</h3>
              <p className="scp-card-p">
                You knew the formula, understood the concept, but made a basic sign error, multiplied wrongly, or marked Option B instead of C.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Solution: Maintaining a handwritten Error Diary reviewed before every mock.</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Solution: Standardizing 4-quadrant structured rough work.</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon violet">
                <Clock size={22} />
              </div>
              <h3 className="scp-card-h3">2. Time-Trap Sinks (-20 to -35 Marks)</h3>
              <p className="scp-card-p">
                Spending 7 to 9 minutes on a single ego-driven problem in Mathematics, leaving 6 easy questions in Physics completely unread at the end of the paper.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Solution: Strict 2.5-minute cutoff rule trained by your mentor.</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Solution: Compulsory Round 1 scan through all questions.</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon amber">
                <FileSearch size={22} />
              </div>
              <h3 className="scp-card-h3">3. Reading & Trap Mistakes (-10 to -15 Marks)</h3>
              <p className="scp-card-p">
                Misreading "which statement is INCORRECT" as correct, or ignoring units like cm vs meters and Joules vs kiloJoules.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Solution: Pen-tracing keywords during question reading.</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Solution: Writing down given units explicitly on rough sheets.</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon emerald">
                <TrendingUp size={22} />
              </div>
              <h3 className="scp-card-h3">4. True Conceptual Gaps (The Genuine Re-Study Zone)</h3>
              <p className="scp-card-p">
                Only questions falling into this bucket require opening textbooks or watching lecture videos. Separating genuine gaps from silly slips saves 15+ hours of wasted revision weekly!
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Solution: 10 targeted PYQs on that exact micro-topic.</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Solution: Mentor explanation of first-principles concept.</li>
              </ul>
            </div>
          </div>
        </section>

        <ClusterCta
          title="Turn Your Mock Test Mistakes into a 99 Percentile Score"
          subtitle="Stop giving tests blindly. Work with an IIT Roorkee mentor who conducts question-level autopsies of your mocks, identifies time bottlenecks, and guarantees consistent score jumps."
          primaryText="Start Mentorship & Test Analysis · ₹3,499"
          primaryLink="/mentorship/jee-2027"
        />

        {/* FAQs */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">FAQ</span>
            <h2 className="scp-h2">Frequently Asked Questions About Test Analysis</h2>
          </div>
          <ClusterFaq items={faqs} />
        </section>

        {/* Related Topics */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Related Clusters</span>
            <h2 className="scp-h2">Next Recommended Strategies</h2>
          </div>
          <ClusterRelated
            currentPath={currentPath}
            selectedPaths={[
              "/jee-mentorship",
              "/jee-mentorship/jee-main",
              "/jee-mentorship/1-to-1",
              "/jee-preparation/strategy"
            ]}
          />
        </section>
      </main>
    </div>
  );
}

