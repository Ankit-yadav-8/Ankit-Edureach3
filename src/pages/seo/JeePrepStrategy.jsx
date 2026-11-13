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
  Compass,
  CheckCircle2,
  Atom,
  FlaskConical,
  Sigma,
  Target,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp
} from "lucide-react";

export default function JeePrepStrategy() {
  const currentPath = "/jee-preparation/strategy";

  const faqs = [
    {
      q: "What is the single most important factor to crack JEE Main and Advanced?",
      a: "Active problem-solving with pen and paper beats passive lecture watching every single time. Toppers spend at least 65-70% of their daily preparation time solving questions, reviewing previous-year questions (PYQs), and analyzing their mistakes, rather than repeatedly watching multi-hour online video lectures."
    },
    {
      q: "How many years of PYQs should I solve for JEE?",
      a: "For JEE Main, solve the last 5 to 7 years of official NTA question papers (2019–2025). For JEE Advanced, solve at least 15 to 20 years of past subjective and objective papers. Advanced repeats core concepts, thought patterns, and mathematical tricks year after year."
    },
    {
      q: "How do I balance Physics, Chemistry, and Mathematics?",
      a: "Chemistry is the highest scoring and fastest subject—scoring 75+ in 40 minutes provides massive percentile leverage and frees up time for Mathematics. Physics requires clean diagrammatic conceptual intuition. In Mathematics, aggressive question selection (choosing 12-14 solvable questions) is what secures 99%ile."
    },
    {
      q: "When should I start taking full-length mock tests?",
      a: "Begin part-syllabus tests from the first month of preparation. Transition to full-syllabus 3-hour CBT mock tests at least 2 to 3 months before your exam date, aiming for 15-25 full tests analyzed thoroughly with your mentor."
    }
  ];

  const jsonLd = [
    getOrganizationSchema(),
    getArticleSchema({
      headline: "Comprehensive JEE Preparation Strategy & Master Guide",
      description: "Master the proven JEE preparation strategy used by top IITians. Subject-wise tactical playbooks for Physics, Chemistry & Maths, PYQ analysis, and topper frameworks.",
      path: "/jee-preparation/strategy"
    }),
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Comprehensive JEE Preparation Strategy & Topper Roadmap",
      "description": "Master strategy guide for JEE Main and JEE Advanced covering subject-wise tactical playbooks, book selection, and exam temperament.",
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

  const keywords = SEO_KEYWORD_MAP["/jee-preparation/strategy"].targetKeywords;

  return (
    <div className="seo-cluster-page">
      <Seo
        title="JEE Preparation Strategy & Roadmap | Main & Advanced Master Guide"
        description="Master the proven JEE preparation strategy used by top IITians. Subject-wise tactical playbooks for Physics, Chemistry & Maths, PYQ analysis, and topper frameworks."
        path={currentPath}
        keywords={keywords}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "JEE Preparation", path: "/jee-preparation" },
          { name: "Preparation Strategy", path: currentPath }
        ]}
        jsonLd={jsonLd}
      />

      <ClusterHero
        titlePrefix="Comprehensive"
        accentWord="JEE Preparation Strategy"
        titleSuffix="& Master Roadmap"
        description="Master both JEE Main and JEE Advanced with systematic subject-wise playbooks, proven PYQ roadmaps, book recommendations, and exam temperament tactics formulated by IIT Roorkee rankers."
        planKey="mentor-jee-2027-6m"
      />

      <ClusterNav currentPath={currentPath} />

      <InteractiveJourneyRoadmap
        title="JEE Preparation Strategy Roadmap"
        subtitle="6 strategic milestones built by IITians to prepare smart and track progress."
        planKey="mentor-jee-2027-6m"
        targetExam="JEE Main 2027"
      />

      <main className="scp-container" id="details">
        {/* Subject Tactical Playbooks */}
        <section className="scp-section" id="subject-strategies">
          <div className="scp-section-header">
            <span className="scp-kicker">Subject-by-Subject Blueprint</span>
            <h2 className="scp-h2">Subject-Wise Master Playbooks</h2>
            <p className="scp-section-sub">
              Each subject in JEE tests a completely distinct cognitive skill. Treating all three subjects with the same study method leads to mediocre scores:
            </p>
          </div>

          <div className="scp-grid-3">
            <div className="scp-card">
              <div className="scp-card-icon violet">
                <Atom size={22} />
              </div>
              <h3 className="scp-card-h3">Physics: First-Principles Intuition</h3>
              <p className="scp-card-p">
                Physics is not a formula memorization contest. It is visual problem modeling:
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Always draw a neat Free Body Diagram (FBD) or circuit schema before writing equations.</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Master Mechanics and Electrodynamics thoroughly—they represent 60% of JEE Advanced Physics.</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Prioritize Concepts of Physics (H.C. Verma) followed by 10 years of PYQs.</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon brand">
                <FlaskConical size={22} />
              </div>
              <h3 className="scp-card-h3">Chemistry: The Score Maximizer</h3>
              <p className="scp-card-p">
                Chemistry gives the highest marks per minute spent:
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><strong>Inorganic:</strong> Treat NCERT as holy scripture. Highlight every line, reaction condition, and exception table.</li>
                <li className="scp-card-list-item"><strong>Organic:</strong> Master GOC and reaction mechanisms (electrophiles, nucleophiles, leaving groups) rather than memorizing products.</li>
                <li className="scp-card-list-item"><strong>Physical:</strong> Calculate with precision. Practice multi-step equilibrium and thermodynamics numericals.</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon emerald">
                <Sigma size={22} />
              </div>
              <h3 className="scp-card-h3">Mathematics: The Selection Game</h3>
              <p className="scp-card-p">
                JEE Maths papers are deliberately lengthy to test your ego and time discipline:
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Never attempt questions in chronological order (1 to 25).</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Scan the paper to cherry-pick 12-14 high-confidence, standard problems.</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Mastering Coordinate Geometry, Vectors/3D, and Definite Integrals guarantees a 99%ile in Maths.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3-Pass Exam Technique */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Exam-Day Execution</span>
            <h2 className="scp-h2">3-Pass Exam Solving Protocol</h2>
            <p className="scp-section-sub">
              How elite rankers structure their 180 minutes inside the computer-based exam hall:
            </p>
          </div>

          <div className="scp-table-wrapper">
            <table className="scp-table">
              <thead>
                <tr>
                  <th>Pass</th>
                  <th>Time Allocation</th>
                  <th>Execution Strategy & Objective</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Pass 1 (The Speed Sweep)</strong></td>
                  <td>0 – 55 Minutes</td>
                  <td>Sweep through all 75 questions across all 3 subjects. Solve ONLY 25-30 instant recall & direct formula questions. If a problem takes {">"} 90 seconds, flag and skip immediately!</td>
                </tr>
                <tr>
                  <td><strong>Pass 2 (The Core Solver)</strong></td>
                  <td>55 – 140 Minutes</td>
                  <td>Solve flagged moderate questions where the solution path is clear but requires 2-3 minutes of calculations. Lock in 25-30 additional problems.</td>
                </tr>
                <tr>
                  <td><strong>Pass 3 (The High-Value Review)</strong></td>
                  <td>140 – 180 Minutes</td>
                  <td>Verify numerical calculations, re-check sign conventions, and attempt 3-5 hard or multi-step questions without reckless guessing.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <ClusterPricing
          planKey="mentor-jee-2027-6m"
          exam="JEE Main & Advanced Strategy"
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

        {/* Related Topics */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Related Clusters</span>
            <h2 className="scp-h2">Explore Other Preparation Pathways</h2>
          </div>
          <ClusterRelated
            currentPath={currentPath}
            selectedPaths={[
              "/jee-preparation",
              "/jee-preparation/study-plan",
              "/jee-preparation/backlog",
              "/jee-mentorship/test-analysis"
            ]}
          />
        </section>
      </main>
    </div>
  );
}

