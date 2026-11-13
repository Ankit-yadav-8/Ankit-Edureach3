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
        titlePrefix="Personalized"
        accentWord="JEE Mentorship"
        titleSuffix="by Verified IITians"
        description="Stop getting lost in giant batches. Get paired 1-on-1 with an IIT Roorkee mentor who designs your daily study schedule, analyzes every mock test error, clears backlogs, and guides your step-by-step strategy for JEE Main & JEE Advanced."
        planKey="mentor-jee-2027-6m"
      />

      <ClusterNav currentPath={currentPath} />

      <main className="scp-container" id="details">
        {/* Core Pillars Section */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Why 1-to-1 Guidance Outperforms Coaching Batches</span>
            <h2 className="scp-h2">6 Core Pillars of JEE Mentorship</h2>
            <p className="scp-section-sub">
              Large coaching institutes deliver lectures to 200+ students at once, but nobody checks if you understood the concepts, completed homework, or why your test score dropped. Here is how our personalized JEE mentorship program fixes the preparation gap.
            </p>
          </div>

          <div className="scp-grid-3">
            <div className="scp-card">
              <div className="scp-card-icon brand">
                <UserCheck size={22} />
              </div>
              <h3 className="scp-card-h3">1. Dedicated Personal IITian Mentor</h3>
              <p className="scp-card-p">
                You are paired 1-on-1 with an IIT Roorkee or top IIT ranker who has successfully cracked JEE Advanced with an elite rank. They mentor you through weekly video calls and continuous daily WhatsApp check-ins.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Individualized pace & subject focus</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Authentic strategies from proven toppers</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon emerald">
                <Calendar size={22} />
              </div>
              <h3 className="scp-card-h3">2. Customized Daily Study Timetables</h3>
              <p className="scp-card-p">
                No more wondering what chapter to study next. Your mentor creates realistic daily task lists balancing Physics, Chemistry, and Mathematics according to your current school or coaching hours.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Daily chapter & question targets</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Live study streaks & accountability</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon violet">
                <BarChart3 size={22} />
              </div>
              <h3 className="scp-card-h3">3. Question-Level Test Analysis</h3>
              <p className="scp-card-p">
                Giving mock tests without in-depth post-exam review is useless. Our system evaluates time-spent-per-question, accuracy, negative-marking leakages, and converts mistakes into an actionable fix list.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Silly mistake vs conceptual gap detection</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Weekly remedial practice modules</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon amber">
                <Flame size={22} />
              </div>
              <h3 className="scp-card-h3">4. Backlog Eradication System</h3>
              <p className="scp-card-p">
                Backlogs cause panic and destroy motivation. We deploy our proven 70-30 backlog formula: 70% of study time protects ongoing syllabus, while 30% methodically clears high-weightage pending chapters.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> High-yield chapter triage</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Weekend accelerated catch-up sprints</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon brand">
                <Sparkles size={22} />
              </div>
              <h3 className="scp-card-h3">5. Exam Temperament & Strategy</h3>
              <p className="scp-card-p">
                Cracking JEE requires more than memorizing formulas. Your mentor teaches time management, question filtering, multi-pass paper solving, and stress control during high-pressure shifts.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> 3-pass exam execution technique</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Avoiding trap questions & negative marks</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon emerald">
                <Award size={22} />
              </div>
              <h3 className="scp-card-h3">6. Weekly Parent Progress Reports</h3>
              <p className="scp-card-p">
                Parents stay informed without micromanaging. We send automated weekly audit summaries detailing hours logged, mock scores, completed syllabus percentage, and mentor remarks.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Complete transparency on study habits</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Objective score improvement trends</li>
              </ul>
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
          exam="JEE Main & Advanced 2027"
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

        {/* Related Links */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Next Steps</span>
            <h2 className="scp-h2">Recommended Reading for Serious Aspirants</h2>
          </div>
          <ClusterRelated
            currentPath={currentPath}
            selectedPaths={[
              "/jee-mentorship/1-to-1",
              "/jee-mentorship/test-analysis",
              "/jee-preparation/study-plan",
              "/jee-preparation/backlog"
            ]}
          />
        </section>
      </main>
    </div>
  );
}

