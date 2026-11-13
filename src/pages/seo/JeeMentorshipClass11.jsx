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
  BookOpen,
  CheckCircle2,
  Calendar,
  AlertOctagon,
  Sparkles,
  Shield,
  Layers,
  ArrowRight
} from "lucide-react";

export default function JeeMentorshipClass11() {
  const currentPath = "/jee-mentorship/class-11";

  const faqs = [
    {
      q: "Why do so many students struggle in Class 11 JEE preparation?",
      a: "The jump from Class 10 to Class 11 is steep: syllabus volume expands 5-fold, concepts require rigorous derivation and calculus rather than memorization, and initial coaching test scores often drop to 30-40%. Without personalized guidance, students develop anxiety and massive backlogs within the first 4 months."
    },
    {
      q: "How does a mentor help balance Class 11 school exams and JEE coaching?",
      a: "Your mentor creates a synchronized calendar. When school unit tests or term exams approach, we schedule targeted NCERT derivations and descriptive question practice into your routine so you score 85%+ in school while maintaining your JEE problem-solving momentum."
    },
    {
      q: "Which chapters in Class 11 are most critical for JEE Advanced?",
      a: "In Physics: Mechanics (Vectors to Rotational Dynamics) forms the backbone of all Class 12 Physics. In Chemistry: Chemical Bonding, Thermodynamics, and GOC (General Organic Chemistry). In Mathematics: Quadratic Equations, Coordinate Geometry, and Trigonometric Identities."
    },
    {
      q: "Can I join the 2-Year Foundation Mentorship for JEE 2028?",
      a: "Yes! Our Class 11 track is specifically designed as a 2-year foundation program, locking in your basics so you enter Class 12 with zero backlogs and top-tier test confidence."
    }
  ];

  const jsonLd = [
    getOrganizationSchema(),
    getArticleSchema({
      headline: "Personalized Class 11 JEE Mentorship & Foundation",
      description: "Master Class 11 with 1-to-1 JEE mentorship by top IITians. Overcome the 10th-to-11th transition, prevent backlogs, balance school, and build a rock-solid foundation.",
      path: "/jee-mentorship/class-11"
    }),
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Class 11 JEE Mentorship Program",
      "description": "Foundation 1-on-1 JEE mentorship for Class 11 students to conquer the 10th-to-11th transition, balance school, and eliminate backlogs.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "CampusPoint",
        "url": "https://campuspoint.in"
      },
      "offers": {
        "@type": "Offer",
        "price": "3499",
        "priceCurrency": "INR",
        "url": "https://campuspoint.in/mentorship/jee-2028"
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

  const keywords = SEO_KEYWORD_MAP["/jee-mentorship/class-11"].targetKeywords;

  return (
    <div className="seo-cluster-page">
      <Seo
        title="JEE Mentorship for Class 11 | Foundation to Advanced Strategy"
        description="Master Class 11 with 1-to-1 JEE mentorship by top IITians. Overcome the 10th-to-11th transition, prevent backlogs, balance school, and build a rock-solid foundation."
        path={currentPath}
        keywords={keywords}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "JEE Mentorship", path: "/jee-mentorship" },
          { name: "Class 11 Mentorship", path: currentPath }
        ]}
        jsonLd={jsonLd}
      />

      <ClusterHero
        titlePrefix="Personalized"
        accentWord="Class 11 JEE Mentorship"
        titleSuffix="& Foundation"
        description="Don't let the Class 11 shock derail your IIT dreams. Work 1-on-1 with an IITian mentor to master Mechanics, Bonding, and Calculus, balance school with coaching, and keep your prep completely backlog-free."
        planKey="mentor-jee-2028-6m"
      />

      <ClusterNav currentPath={currentPath} />

      <main className="scp-container" id="details">
        {/* The Class 11 Reality */}
        <section className="scp-section" id="class-11-roadmap">
          <div className="scp-section-header">
            <span className="scp-kicker">Avoid The Common Pitfalls</span>
            <h2 className="scp-h2">Overcoming the Class 11 Shock</h2>
            <p className="scp-section-sub">
              Students who scored 95%+ in Class 10 board exams frequently panic when their first coaching test score is 35/100. Understanding how to handle this shift is the single biggest predictor of eventual IIT selection.
            </p>
          </div>

          <div className="scp-grid-3">
            <div className="scp-card">
              <div className="scp-card-icon brand">
                <AlertOctagon size={22} />
              </div>
              <h3 className="scp-card-h3">1. The Rote-Learning Trap</h3>
              <p className="scp-card-p">
                In Class 10, memorizing textbook lines produced top marks. In Class 11, JEE questions test mathematical derivations, free-body diagrams, and multi-variable conditions.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Solution: Shift to first-principles conceptual derivations</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Solution: Daily mentor problem audits</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon emerald">
                <Layers size={22} />
              </div>
              <h3 className="scp-card-h3">2. The Compounding Backlog Crisis</h3>
              <p className="scp-card-p">
                Miss 2 weeks of Kinematics or GOC, and the subsequent 4 months of Rotational Motion and Reaction Mechanisms become completely incomprehensible.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Solution: Weekly backlog guardrails</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Solution: Zero-tolerance weekend recovery sprints</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon violet">
                <Calendar size={22} />
              </div>
              <h3 className="scp-card-h3">3. School Attendance vs Coaching Conflict</h3>
              <p className="scp-card-p">
                Juggling 6 hours of school, 4 hours of coaching, and exhaustion leaves zero time for self-study. Your mentor designs a balanced schedule that protects 3 hours of focused daily problem solving.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Solution: Micro-study blocks between classes</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Solution: Coordinated school exam prep without panic</li>
              </ul>
            </div>
          </div>
        </section>

        {/* High-Yield Chapter Matrix */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Foundation Priorities</span>
            <h2 className="scp-h2">High-Yield Class 11 Chapters</h2>
            <p className="scp-section-sub">
              Your mentor ensures absolute mastery in these keystone topics before moving to Class 12:
            </p>
          </div>

          <div className="scp-table-wrapper">
            <table className="scp-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Core Keystone Chapters</th>
                  <th>Why It Matters for Class 12 & JEE Advanced</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Physics</strong></td>
                  <td>Newton's Laws, Work-Energy-Power, Rotational Motion</td>
                  <td>Forms the foundation for Electromagnetism, Optics, and Modern Physics.</td>
                </tr>
                <tr>
                  <td><strong>Chemistry</strong></td>
                  <td>Chemical Bonding, GOC (General Organic Chemistry), Thermodynamics</td>
                  <td>Without GOC, Class 12 Organic Chemistry is impossible to understand.</td>
                </tr>
                <tr>
                  <td><strong>Mathematics</strong></td>
                  <td>Functions, Trigonometry, Coordinate Geometry, Sequences & Series</td>
                  <td>Functions and Trigonometric transformations are required in every Calculus question.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <ClusterPricing
          planKey="mentor-jee-2028-6m"
          exam="Class 11 Foundation (JEE 2028)"
          sublabel="2-Year Foundation · 6 Months"
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
            <h2 className="scp-h2">Next Recommended Guides</h2>
          </div>
          <ClusterRelated
            currentPath={currentPath}
            selectedPaths={[
              "/jee-mentorship",
              "/jee-mentorship/class-12",
              "/jee-preparation/study-plan",
              "/jee-preparation/backlog"
            ]}
          />
        </section>
      </main>
    </div>
  );
}

