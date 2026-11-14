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
  UserCheck,
  CheckCircle2,
  Calendar,
  BarChart3,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  Flame,
  HelpCircle
} from "lucide-react";

export default function JeeMentorshipHub() {
  const currentPath = "/jee-mentorship";

  const faqs = [
    {
      q: "What is the CampusPoint JEE Mentorship Program?",
      a: "The CampusPoint JEE Mentorship Program provides dedicated 1-to-1 personal guidance by top IITians (from IIT Roorkee and premier IITs) for students preparing for JEE Main and JEE Advanced. Unlike traditional coaching with 200+ batch sizes, our mentorship provides daily customized study plans, question-level test error autopsy, weekly 1-on-1 strategy video reviews, the 70-30 backlog formula, and 24/7 WhatsApp guidance."
    },
    {
      q: "Which is the best mentorship program for JEE Main & Advanced?",
      a: "CampusPoint is rated the #1 JEE Mentorship program (4.9/5 from 260+ enrolled aspirants) because mentors are verified IIT Roorkee and top IIT rankers who cleared JEE under recent NTA patterns. Rather than generic topper advice, students get individualized question-level test diagnostics, daily schedule tracking, and direct WhatsApp access to their mentor."
    },
    {
      q: "How does a 1-to-1 JEE mentor help increase mock test scores by 40–70 marks?",
      a: "Most students study 8–10 hours daily but stay stuck at score plateaus (e.g., 110–140 marks) due to negative marking slips, poor question filtering, and untested silly mistakes. An IITian mentor analyzes your computer-based test question-by-question, classifies every mark lost into conceptual vs execution error, and assigns targeted 30-problem fix decks for the coming week."
    },
    {
      q: "Is this JEE mentorship program suitable for Class 11, Class 12, and Droppers?",
      a: "Yes. We have customized mentorship tracks: Class 11 foundation & school-coaching balance, Class 12 board-plus-JEE coordination and syllabus completion by October, and an intensive high-yield recovery track for Droppers and repeaters."
    },
    {
      q: "How does CampusPoint test error autopsy differ from coaching test series?",
      a: "Coaching test series only give you a score and rank. CampusPoint's diagnostic engine analyzes your exam question-by-question: time spent per question, accuracy in high-yield vs low-yield concepts, silly slips vs conceptual gaps, and unattempted traps. Your mentor then drafts a personalized corrective plan for the following week."
    },
    {
      q: "What is the cost of the CampusPoint JEE Mentorship Program?",
      a: "Our comprehensive JEE Mentorship program is priced transparently at ₹3,499 valid till JEE Mains (or 6 months of daily intensive 1-on-1 guidance), with zero hidden renewal fees."
    }
  ];

  const jsonLd = [
    getOrganizationSchema(),
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "CampusPoint 1-on-1 JEE Mentorship Program",
      "image": "https://campuspoint.in/icons/icon-512x512.png",
      "description": "Comprehensive 1-to-1 JEE mentorship by verified IIT Roorkee rankers. Daily personalized study plans, question-level mock test error autopsy, 70-30 backlog formula, and 24/7 WhatsApp guidance.",
      "brand": {
        "@type": "Brand",
        "name": "CampusPoint"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "bestRating": "5",
        "ratingCount": "264",
        "reviewCount": "182"
      },
      "offers": {
        "@type": "Offer",
        "price": "3499",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": "https://campuspoint.in/jee-mentorship"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "EducationalOccupationalProgram",
      "name": "Personalized JEE Mentorship Program",
      "description": "Comprehensive 1-to-1 JEE mentorship by top IITians featuring custom study plans, mock test error analysis, backlog eradication, and daily tracking.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "CampusPoint",
        "url": "https://campuspoint.in"
      },
      "educationalProgramMode": "Online",
      "offers": {
        "@type": "Offer",
        "price": "3499",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": "https://campuspoint.in/jee-mentorship"
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

  const keywords = SEO_KEYWORD_MAP["/jee-mentorship"].targetKeywords;

  return (
    <div className="seo-cluster-page">
      <Seo
        title="Best JEE Mentorship Program 2026–2027 | 1-on-1 Guidance by IITians - CampusPoint"
        description="Get 1-on-1 JEE Mentorship by verified IIT Roorkee rankers. Daily personalized study plans, question-level mock test error autopsy, 70-30 backlog formula & 24/7 WhatsApp guidance. Enroll at ₹3,499."
        path={currentPath}
        keywords={keywords}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "JEE Mentorship", path: currentPath }
        ]}
        jsonLd={jsonLd}
      />

            <ClusterHero
        line1="Personalized 1-on-1"
        line1Squiggle="1-on-1"
        line2Lead="for your"
        line2Box="JEE Mentorship."
        description="Direct daily guidance from IIT Roorkee rankers to manage study schedules, clear backlogs, and secure top ranks."
        planKey="mentor-jee-2027-6m"
        ctaText="Contact Us"
        ctaHref={`https://wa.me/918118826194?text=${encodeURIComponent(`Hello CampusPoint Team,
I want to know about the JEE Mentorship Plans and pricing.
Could you please share the program details and connect me with an IITian mentor?`)}`}
      />

      <ClusterNav currentPath={currentPath} />

      <main className="scp-container" id="details">
        {/* Core Pillars Section */}
        <section className="scp-section jmh-pillars-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Why 1-to-1 Guidance Outperforms Coaching Batches</span>
            <h2 className="scp-h2">6 Core Pillars of JEE Mentorship</h2>
          </div>

          <div className="jmh-grid">
            {/* Pillar 1 */}
            <div className="jmh-card">
              <div className="jmh-card-top">
                <div className="jmh-card-icon">
                  <UserCheck size={22} />
                </div>
                <span className="jmh-card-badge">LIVE</span>
              </div>
              <h3 className="jmh-card-title">1-on-1 IITian Mentor</h3>
              <p className="jmh-card-desc">
                Paired individually with verified IIT Roorkee rankers for continuous daily guidance, strategy, and accountability.
              </p>
              <ul className="jmh-card-bullets">
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Weekly 1-on-1 strategy video reviews</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Daily WhatsApp study log check-ins</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Authentic tactics from recent toppers</span>
                </li>
              </ul>
              <Link to="/jee-mentorship/1-to-1" className="jmh-card-action">
                <span>Explore mentor track</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="jmh-card">
              <div className="jmh-card-top">
                <div className="jmh-card-icon">
                  <Calendar size={22} />
                </div>
                <span className="jmh-card-badge">LIVE</span>
              </div>
              <h3 className="jmh-card-title">Daily Study Timetables</h3>
              <p className="jmh-card-desc">
                Dynamic schedules balancing school, coaching hours, and high-yield chapter targets.
              </p>
              <ul className="jmh-card-bullets">
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Subject-wise hourly study schedule</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Daily chapter & problem solving quotas</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Live study streaks & consistency audits</span>
                </li>
              </ul>
              <Link to="/jee-preparation/study-plan" className="jmh-card-action">
                <span>View study timetables</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="jmh-card">
              <div className="jmh-card-top">
                <div className="jmh-card-icon">
                  <BarChart3 size={22} />
                </div>
                <span className="jmh-card-badge">LIVE</span>
              </div>
              <h3 className="jmh-card-title">Mock Error Autopsy</h3>
              <p className="jmh-card-desc">
                Question-by-question review identifying silly slips, time traps, and negative mark leakages.
              </p>
              <ul className="jmh-card-bullets">
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Silly mistakes vs concept gap tags</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Time spent per question breakdown</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Weekly 30-problem targeted fix deck</span>
                </li>
              </ul>
              <Link to="/jee-mentorship/test-analysis" className="jmh-card-action">
                <span>See mock autopsy</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 4 */}
            <div className="jmh-card">
              <div className="jmh-card-top">
                <div className="jmh-card-icon">
                  <Flame size={22} />
                </div>
                <span className="jmh-card-badge">LIVE</span>
              </div>
              <h3 className="jmh-card-title">70-30 Backlog Formula</h3>
              <p className="jmh-card-desc">
                Methodical ratio to clear pending high-weightage chapters without halting ongoing syllabus.
              </p>
              <ul className="jmh-card-bullets">
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>70% current syllabus protection</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>30% high-yield backlog recovery sprints</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Weekend catch-up milestone goals</span>
                </li>
              </ul>
              <Link to="/jee-preparation/backlog" className="jmh-card-action">
                <span>Read backlog rule</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 5 */}
            <div className="jmh-card">
              <div className="jmh-card-top">
                <div className="jmh-card-icon">
                  <Sparkles size={22} />
                </div>
                <span className="jmh-card-badge">LIVE</span>
              </div>
              <h3 className="jmh-card-title">Exam Temperament</h3>
              <p className="jmh-card-desc">
                Multi-pass paper solving, question filtering, and stress control during high-pressure shifts.
              </p>
              <ul className="jmh-card-bullets">
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>3-pass paper execution technique</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Trap question filtering & avoidance</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Negative marking control system</span>
                </li>
              </ul>
              <Link to="/jee-mentorship/jee-main" className="jmh-card-action">
                <span>Master exam strategy</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 6 */}
            <div className="jmh-card">
              <div className="jmh-card-top">
                <div className="jmh-card-icon">
                  <Award size={22} />
                </div>
                <span className="jmh-card-badge">LIVE</span>
              </div>
              <h3 className="jmh-card-title">Weekly Progress Audits</h3>
              <p className="jmh-card-desc">
                Objective weekly reports detailing logged study hours, mock trends, and mentor action points.
              </p>
              <ul className="jmh-card-bullets">
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Logged study hours & mock scores</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Syllabus completion percentages</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Mentor remarks & improvement goals</span>
                </li>
              </ul>
              <a href="#pricing" className="jmh-card-action">
                <span>View mentorship plans</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Head-to-Head Comparison</span>
            <h2 className="scp-h2">1-on-1 Mentorship vs Coaching</h2>
            <p className="scp-section-sub">
              See why hundreds of JEE aspirants transition to dedicated personal mentorship to supercharge their preparation.
            </p>
          </div>

          <div className="scp-table-wrapper">
            <table className="scp-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Traditional Coaching Classes</th>
                  <th>CampusPoint 1-on-1 Mentorship</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Student-to-Teacher Ratio</strong></td>
                  <td>1 teacher for 150 - 300 students</td>
                  <td><strong style={{ color: "var(--scp-brand)" }}>1 dedicated mentor for 1 student</strong></td>
                </tr>
                <tr>
                  <td><strong>Daily Study Plan</strong></td>
                  <td>Generic batch syllabus schedule</td>
                  <td>Personalized daily timetable tailored to student strengths & school timings</td>
                </tr>
                <tr>
                  <td><strong>Test Mistake Analysis</strong></td>
                  <td>Only ranks & marks published</td>
                  <td>Question-level analysis with time spent, weak topic tags, and mentor remediation</td>
                </tr>
                <tr>
                  <td><strong>Backlog Recovery</strong></td>
                  <td>Student left on their own</td>
                  <td>Structured 70-30 backlog formula integrated into daily schedule</td>
                </tr>
                <tr>
                  <td><strong>Mentor Credibility</strong></td>
                  <td>Often junior faculty or automated chatbots</td>
                  <td>Verified IIT Roorkee and top IIT rankers who cleared JEE</td>
                </tr>
                <tr>
                  <td><strong>Pricing</strong></td>
                  <td>₹1.5 Lakh - ₹3 Lakh per year</td>
                  <td><strong style={{ color: "var(--scp-brand)" }}>₹3,499 total till JEE Mains</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Topic Cluster Directory */}
        <section className="scp-section" id="cluster-topics">
          <div className="scp-section-header">
            <span className="scp-kicker">JEE Mentorship Topical Cluster</span>
            <h2 className="scp-h2">Explore Specialized JEE Mentorship & Preparation Guides</h2>
            <p className="scp-section-sub">
              Whether you are in Class 11, Class 12, taking a drop year, or targeting 99%ile in JEE Main or an under-1000 rank in JEE Advanced, access our comprehensive dedicated guides:
            </p>
          </div>

          <div className="scp-topic-cloud">
            <Link to="/jee-mentorship/jee-main" className="scp-topic-link">
              <span><strong>JEE Main Mentorship</strong> — Speed & 99%ile Strategy</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-mentorship/jee-advanced" className="scp-topic-link">
              <span><strong>JEE Advanced Mentorship</strong> — Multi-Concept IIT Strategy</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-mentorship/droppers" className="scp-topic-link">
              <span><strong>JEE Droppers Mentorship</strong> — Repeater Recovery Plan</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-mentorship/1-to-1" className="scp-topic-link">
              <span><strong>1-on-1 JEE Mentorship</strong> — Private Individual Mentor</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-mentorship/iitian-mentor" className="scp-topic-link">
              <span><strong>IITian Mentors</strong> — Mentorship by IIT Roorkee Rankers</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-mentorship/test-analysis" className="scp-topic-link">
              <span><strong>Mock Test Analysis</strong> — Question Error Tracking</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-mentorship/class-11" className="scp-topic-link">
              <span><strong>Class 11 Mentorship</strong> — Foundation & Slump Prevention</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-mentorship/class-12" className="scp-topic-link">
              <span><strong>Class 12 Mentorship</strong> — Boards + JEE Main Balance</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-preparation/study-plan" className="scp-topic-link">
              <span><strong>JEE Study Plan & Timetable</strong> — Daily & Weekly Schedules</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-preparation/backlog" className="scp-topic-link">
              <span><strong>JEE Backlog Strategy</strong> — 70-30 Rule to Clear Syllabus</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-preparation/strategy" className="scp-topic-link">
              <span><strong>JEE Preparation Strategy</strong> — Toppers Roadmap & Playbook</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-preparation" className="scp-topic-link">
              <span><strong>JEE Preparation Hub</strong> — Comprehensive Guides & Roadmaps</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Conversion CTA Block */}
        <ClusterPricing
          planKey="mentor-jee-2027-6m"
          exam="Till JEE Mains"
          sublabel="Till JEE Mains 2027"
        />

        <ClusterFounders />

        {/* FAQs */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Frequently Asked Questions</span>
            <h2 className="scp-h2">Everything You Need to Know About JEE Mentorship</h2>
          </div>
          <ClusterFaq items={faqs} />
        </section>


      </main>
    </div>
  );
}

