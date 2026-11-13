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
  GraduationCap,
  CheckCircle2,
  Calendar,
  Layers,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp
} from "lucide-react";

export default function JeeMentorshipClass12() {
  const currentPath = "/jee-mentorship/class-12";

  const faqs = [
    {
      q: "How does an IITian mentor help balance Class 12 Boards and JEE Main?",
      a: "The syllabus for CBSE Boards and JEE Main is nearly identical, but the testing style is completely different: Boards require step-by-step descriptive derivations, while JEE requires speed and calculation shortcuts. Your mentor integrates 1-2 hours of weekly NCERT board derivation writing into your schedule so you secure 90%+ in Boards without interrupting your JEE problem-solving momentum."
    },
    {
      q: "When should Class 12 students finish their JEE syllabus?",
      a: "Our mentors establish a firm deadline to complete the Class 12 syllabus by October 31 or mid-November at latest. This preserves a full 60 to 75 days dedicated solely to Class 11 revision, full-length mock tests, and error elimination before JEE Main Session 1 in January."
    },
    {
      q: "How do I revise Class 11 while studying Class 12 chapters?",
      a: "We utilize the 'Dual Track Revision Strategy': Monday to Friday is dedicated to your active Class 12 coaching lectures and problems. Saturdays and Sundays include a 4-hour dedicated block for Class 11 high-weightage chapters and PYQs, systematically rotating through Physics, Chemistry, and Maths."
    },
    {
      q: "What is the 75% Board eligibility criterion for JoSAA?",
      a: "To qualify for admission to IITs, NITs, and IIITs through JoSAA, students must score at least 75% aggregate in their Class 12 Board exams (or be in the top 20 percentile of their respective board). Our mentors keep track of this benchmark to ensure board scores are never compromised."
    }
  ];

  const jsonLd = [
    getOrganizationSchema(),
    getArticleSchema({
      headline: "Personalized Class 12 JEE Mentorship & Strategy",
      description: "Ace Class 12 boards and JEE Main/Advanced together. 1-to-1 IITian mentorship, October syllabus finish, dual-track Class 11 revision, and pre-board management.",
      path: "/jee-mentorship/class-12"
    }),
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Class 12 JEE Mentorship Program",
      "description": "Comprehensive 1-on-1 JEE mentorship for Class 12 students balancing board exams, October syllabus completion, and Class 11 revision.",
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

  const keywords = SEO_KEYWORD_MAP["/jee-mentorship/class-12"].targetKeywords;

  return (
    <div className="seo-cluster-page">
      <Seo
        title="JEE Mentorship for Class 12 | Boards + JEE Main & Advanced"
        description="Ace Class 12 boards and JEE Main/Advanced together. 1-to-1 IITian mentorship, October syllabus finish, dual-track Class 11 revision, and pre-board management."
        path={currentPath}
        keywords={keywords}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "JEE Mentorship", path: "/jee-mentorship" },
          { name: "Class 12 Mentorship", path: currentPath }
        ]}
        jsonLd={jsonLd}
      />

      <ClusterHero
        badge="📚 BOARDS + JEE MAIN & ADVANCED · JEE 2027"
        titlePrefix="Personalized"
        accentWord="Class 12 JEE Mentorship"
        titleSuffix="& Strategy"
        description="Master Class 12 without getting overwhelmed by board exams and Class 11 backlogs. Work 1-on-1 with an IITian mentor to complete your syllabus by October, revise Class 11, and secure 99%ile on your first attempt."
        planKey="mentor-jee-2027-6m"
      />

      <ClusterNav currentPath={currentPath} />

      <main className="scp-container" id="details">
        {/* Core Class 12 Challenges */}
        <section className="scp-section" id="dual-strategy">
          <div className="scp-section-header">
            <span className="scp-kicker">The Class 12 Juggling Act</span>
            <h2 className="scp-h2">Balancing Boards & JEE in Class 12</h2>
            <p className="scp-section-sub">
              Class 12 is intense. Between coaching lectures, board practicals, pre-boards, and fear of unresolved Class 11 backlogs, having a dedicated IITian mentor ensures you never lose direction.
            </p>
          </div>

          <div className="scp-grid-3">
            <div className="scp-card">
              <div className="scp-card-icon brand">
                <Clock size={22} />
              </div>
              <h3 className="scp-card-h3">1. The October Deadline Rule</h3>
              <p className="scp-card-p">
                Coaching institutes often drag syllabus completion until late December, leaving no time for revision. Your mentor structures self-study sprints to finish Class 12 topics by late October.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Accelerated high-yield coverage</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> 60-75 days reserved for mock tests</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon emerald">
                <Layers size={22} />
              </div>
              <h3 className="scp-card-h3">2. Dual-Track Class 11 Revision</h3>
              <p className="scp-card-p">
                You cannot afford to forget Class 11. Your mentor integrates weekend revision blocks focusing on high-weightage topics like Mechanics, Chemical Bonding, and Coordinate Geometry.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> 4 hours dedicated on weekends</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> 50 targeted PYQs per chapter</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon violet">
                <GraduationCap size={22} />
              </div>
              <h3 className="scp-card-h3">3. Effortless Board Exam Sync</h3>
              <p className="scp-card-p">
                We align NCERT textbook questions with your board practical schedule so that board preparations reinforce JEE fundamentals instead of distracting from them.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Solving NCERT Back-Exercises</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Clear 75% JoSAA criterion with ease</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Master Month-by-Month Schedule */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Master Milestone Timeline</span>
            <h2 className="scp-h2">The Class 12 JEE Preparation Calendar</h2>
            <p className="scp-section-sub">
              A disciplined, step-by-step timeline calibrated by our IITian mentors for Class 12 aspirants:
            </p>
          </div>

          <div className="scp-table-wrapper">
            <table className="scp-table">
              <thead>
                <tr>
                  <th>Months</th>
                  <th>Primary Focus</th>
                  <th>Milestone Benchmark</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>April – July</strong></td>
                  <td>Core Class 12 Foundations</td>
                  <td>Electrodynamics, Magnetism, Calculus, Physical Chemistry (Class 12).</td>
                </tr>
                <tr>
                  <td><strong>August – October</strong></td>
                  <td>Advanced Class 12 & Modern Physics</td>
                  <td>Complete 100% Class 12 syllabus; begin integrated weekend Class 11 revision.</td>
                </tr>
                <tr>
                  <td><strong>November – December</strong></td>
                  <td>Intensive Full Mock Series & Class 11 Polish</td>
                  <td>15-20 full CBT mock tests; error diary analysis; pre-board synchronization.</td>
                </tr>
                <tr>
                  <td><strong>January</strong></td>
                  <td>JEE Main Session 1 Peak Performance</td>
                  <td>Lock 99+ percentile in Session 1 to ensure freedom for JEE Advanced.</td>
                </tr>
                <tr>
                  <td><strong>February – March</strong></td>
                  <td>Board Exams Finalization</td>
                  <td>Secure 90%+ aggregate in Board examinations.</td>
                </tr>
                <tr>
                  <td><strong>April – May</strong></td>
                  <td>JEE Advanced Intensive Simulation</td>
                  <td>Paper 1 & Paper 2 full simulations; multi-concept problem solving.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <ClusterPricing
          planKey="mentor-jee-2027-6m"
          exam="Class 12 Boards + JEE 2027"
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
            <h2 className="scp-h2">More Useful Mentorship Resources</h2>
          </div>
          <ClusterRelated
            currentPath={currentPath}
            selectedPaths={[
              "/jee-mentorship",
              "/jee-mentorship/jee-main",
              "/jee-mentorship/test-analysis",
              "/jee-preparation/study-plan"
            ]}
          />
        </section>
      </main>
    </div>
  );
}

