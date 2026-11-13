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
  getOrganizationSchema,
  getArticleSchema
} from "./ClusterShared.jsx";
import {
  Compass,
  CheckCircle2,
  Brain,
  Shield,
  Layers,
  Award,
  Zap,
  ArrowRight
} from "lucide-react";

export default function JeeMentorshipAdvanced() {
  const currentPath = "/jee-mentorship/jee-advanced";

  const faqs = [
    {
      q: "Why do high scorers in JEE Main often struggle in JEE Advanced?",
      a: "JEE Main tests speed on standardized formulas, whereas JEE Advanced intentionally tests conceptual ambiguity, multi-chapter blending (e.g., Rotation combined with Electrostatics), and unusual numerical constraints. Students who rely on pattern matching fail in Advanced. Our mentorship trains you to build conceptual models from first principles."
    },
    {
      q: "How does an IITian mentor guide multiple-correct questions with partial marking?",
      a: "Multiple-correct questions carry severe negative marking (-2 for wrong choices). Your mentor trains you in high-conviction decision frameworks: only bubbling options where conceptual proof is certain, securing +1, +2, or +3 partial marks instead of gambling and triggering -2."
    },
    {
      q: "How should I structure my preparation between JEE Main and JEE Advanced?",
      a: "Our mentors establish a dual-track roadmap: during early preparation, 70% of problem-solving is Advanced-level subjective/multi-concept problems, scaling down to Main-specific speed mocks 45 days before JEE Main, and immediately pivoting 100% to Advanced PYQs and full-day dual mock tests (Paper 1 + Paper 2) post-Main."
    },
    {
      q: "Are the mentors actually from top IITs?",
      a: "Yes. Every mentor in our JEE Advanced track has cleared JEE Advanced with an elite All India Rank and currently studies at or graduated from premier IITs such as IIT Roorkee, IIT Delhi, and IIT Bombay."
    }
  ];

  const jsonLd = [
    getOrganizationSchema(),
    getArticleSchema({
      headline: "Elite JEE Advanced Mentorship by Top IITians",
      description: "Crack IIT JEE with 1-to-1 JEE Advanced mentorship by top IITians. Master multi-concept problems, partial marking tactics, Paper 1 & 2 stamina, and topper roadmaps.",
      path: "/jee-mentorship/jee-advanced"
    }),
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "JEE Advanced Mentorship Program",
      "description": "Elite 1-on-1 IIT JEE Advanced mentorship by top IITians focusing on multi-concept problem solving, partial marking strategy, and Paper 1 & 2 exam stamina.",
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

  const keywords = SEO_KEYWORD_MAP["/jee-mentorship/jee-advanced"].targetKeywords;

  return (
    <div className="seo-cluster-page">
      <Seo
        title="JEE Advanced Mentorship Program | IIT JEE Mentorship by IITians"
        description="Crack IIT JEE with 1-to-1 JEE Advanced mentorship by top IITians. Master multi-concept problems, partial marking tactics, Paper 1 & 2 stamina, and topper roadmaps."
        path={currentPath}
        keywords={keywords}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "JEE Mentorship", path: "/jee-mentorship" },
          { name: "JEE Advanced", path: currentPath }
        ]}
        jsonLd={jsonLd}
      />

      <ClusterHero
        badge="🏆 CRACK THE TOP 1% · IIT ADMISSION"
        titlePrefix="Elite"
        accentWord="JEE Advanced Mentorship"
        titleSuffix="by Top IITians"
        description="Master the depth, rigor, and multi-concept problem solving demanded by IIT JEE Advanced. Get guided 1-on-1 by mentors from IIT Roorkee and top IITs who scored top ranks."
        planKey="mentor-jee-2027-6m"
      />

      <ClusterNav currentPath={currentPath} />

      <main className="scp-container" id="details">
        {/* Core Methodology */}
        <section className="scp-section" id="advanced-framework">
          <div className="scp-section-header">
            <span className="scp-kicker">First-Principles Thinking</span>
            <h2 className="scp-h2">What Does It Take to Crack JEE Advanced?</h2>
            <p className="scp-section-sub">
              JEE Advanced is not won by solving 500 easy MCQs. It is won by sitting with 10 challenging, unfamiliar problems for 30 minutes each and reasoning through them without looking at solutions.
            </p>
          </div>

          <div className="scp-grid-3">
            <div className="scp-card">
              <div className="scp-card-icon brand">
                <Brain size={22} />
              </div>
              <h3 className="scp-card-h3">1. Multi-Chapter Concept Synthesis</h3>
              <p className="scp-card-p">
                Advanced questions rarely come from one isolated chapter. Our mentors train you to link Rotation with Magnetism, Thermodynamics with Chemical Equilibrium, and Calculus with Vectors.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Synthesis of 2-3 topics per question</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Translating wordy descriptions into clean physics diagrams</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon emerald">
                <Shield size={22} />
              </div>
              <h3 className="scp-card-h3">2. Partial Marking Risk Architecture</h3>
              <p className="scp-card-p">
                In multiple-choice questions with partial marking, choosing an incorrect option costs -2. A mentor teaches you disciplined triage: securing guaranteed partial marks (+1, +2) instead of guessing.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Eliminating reckless guesses</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Converting zero-mark sections into high-yield zones</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon violet">
                <Compass size={22} />
              </div>
              <h3 className="scp-card-h3">3. 6-Hour Exam Stamina (Paper 1 & 2)</h3>
              <p className="scp-card-p">
                Facing two 3-hour papers on the same Sunday requires physiological and psychological endurance. We simulate realistic Paper 1 (9 AM - 12 PM) and Paper 2 (2:30 PM - 5:30 PM) stamina drills.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Overcoming afternoon mental fatigue in Paper 2</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Proper 2-hour break nutrition and mental reset</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Historical Scoring Reality */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Marks vs Rank Reality in JEE Advanced</span>
            <h2 className="scp-h2">You Do Not Need 80% to Enter IIT</h2>
            <p className="scp-section-sub">
              Unlike school exams or JEE Main where percentiles require 75-80% marks, in JEE Advanced, scoring just 45% to 55% historically secures an All India Rank under 3,000!
            </p>
          </div>

          <div className="scp-table-wrapper">
            <table className="scp-table">
              <thead>
                <tr>
                  <th>Approximate Marks %</th>
                  <th>Expected Score (out of ~360)</th>
                  <th>Historical AIR Range</th>
                  <th>IIT Admission Outcome</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>65% – 75%+</strong></td>
                  <td>235 – 270+</td>
                  <td>Top 100 – 500</td>
                  <td><strong style={{ color: "var(--scp-brand)" }}>IIT Bombay, Delhi, Madras CSE & Top Branches</strong></td>
                </tr>
                <tr>
                  <td><strong>52% – 64%</strong></td>
                  <td>190 – 230</td>
                  <td>Top 500 – 2,500</td>
                  <td>Top 7 IITs (Roorkee, Kanpur, Kharagpur) Core Branches</td>
                </tr>
                <tr>
                  <td><strong>42% – 50%</strong></td>
                  <td>150 – 185</td>
                  <td>Top 2,500 – 6,000</td>
                  <td>Top IITs Core Engineering / Second-Gen IIT Top Branches</td>
                </tr>
                <tr>
                  <td><strong>33% – 40%</strong></td>
                  <td>120 – 145</td>
                  <td>Top 6,000 – 15,000</td>
                  <td>IIT Seat Confirmation & Qualifying All India Category Rank</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.86rem", color: "var(--scp-faint)", marginTop: 12 }}>
            *Marks percentages vary yearly depending on the organizing IIT's question difficulty and total marks. Predict your IIT admission branch with our <Link to="/jee-advanced" style={{ color: "var(--scp-brand)", fontWeight: 600 }}>JEE Advanced College Predictor</Link>.
          </p>
        </section>

        <ClusterPricing
          planKey="mentor-jee-2027-6m"
          exam="JEE Advanced 2027"
          sublabel="Till JEE Advanced 2027"
        />

        <ClusterFounders />

        {/* FAQs */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">FAQ</span>
            <h2 className="scp-h2">Frequently Asked Questions on JEE Advanced Mentorship</h2>
          </div>
          <ClusterFaq items={faqs} />
        </section>

        {/* Related Clusters */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Explore Cluster</span>
            <h2 className="scp-h2">Related Preparation Pathways</h2>
          </div>
          <ClusterRelated
            currentPath={currentPath}
            selectedPaths={[
              "/jee-mentorship",
              "/jee-mentorship/iitian-mentor",
              "/jee-mentorship/test-analysis",
              "/jee-preparation/strategy"
            ]}
          />
        </section>
      </main>
    </div>
  );
}

