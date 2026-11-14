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
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart,
  Flame,
  Layers,
  ArrowRight
} from "lucide-react";

export default function JeePrepStudyPlan() {
  const currentPath = "/jee-preparation/study-plan";

  const faqs = [
    {
      q: "How many hours should I study daily for JEE Main and Advanced?",
      a: "Top rankers consistently study 8 to 10 focused hours on non-school/coaching days, and 4 to 6 focused hours on regular school/coaching days. Rather than studying 14 exhausting hours, high efficiency in 2-hour deep work blocks with active problem solving is what produces top percentile results."
    },
    {
      q: "What is the best subject allocation ratio per day?",
      a: "Our mentors recommend the 40:30:30 rule: 40% of daily self-study time dedicated to your weakest or most challenging subject (typically Mathematics or Physics), and 30% each to the remaining two subjects, ensuring no subject is neglected for more than 48 hours."
    },
    {
      q: "How does spaced repetition work in a JEE study plan?",
      a: "To prevent forgetting formulas, our study plans use a 1-7-21 revision schedule: Review a newly completed chapter 24 hours later (15 mins), 7 days later (30 mins solving 10 hard PYQs), and 21 days later (timed 45-min sectional test)."
    },
    {
      q: "Can my IITian mentor customize this timetable for my coaching timings?",
      a: "Yes! Every student receives a fully customized timetable calibrated to their specific school hours, coaching institute schedule, and natural circadian rhythm (morning person vs night owl)."
    }
  ];

  const jsonLd = [
    getOrganizationSchema(),
    getArticleSchema({
      headline: "Personalized JEE Study Plan & Daily Timetable",
      description: "Master your JEE preparation with a personalized study plan and timetable. Daily routines, weekly progress reviews, spaced repetition revision, and mentor accountability.",
      path: "/jee-preparation/study-plan"
    }),
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Personalized JEE Study Plan & Timetable Strategy",
      "description": "Comprehensive daily, weekly, and monthly JEE study timetables, spaced repetition revision frameworks, and mentor accountability.",
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

  const keywords = SEO_KEYWORD_MAP["/jee-preparation/study-plan"].targetKeywords;

  return (
    <div className="seo-cluster-page">
      <Seo
        title="JEE Study Plan & Timetable | Daily, Weekly & Monthly Schedules"
        description="Master your JEE preparation with a personalized study plan and timetable. Daily routines, weekly progress reviews, spaced repetition revision, and mentor accountability."
        path={currentPath}
        keywords={keywords}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "JEE Preparation", path: "/jee-preparation" },
          { name: "Study Plan", path: currentPath }
        ]}
        jsonLd={jsonLd}
      />

      <ClusterHero
        line1="Strategic Daily Schedules"
        line1Squiggle="Schedules"
        line2Lead="for your"
        line2Box="JEE Study Plan."
        description="Master your JEE preparation with personalized hourly timetables, 1-7-21 spaced repetition, and 1-on-1 IITian mentor tracking."
        planKey="mentor-jee-2027-6m"
      />

      <ClusterNav currentPath={currentPath} />

      <InteractiveJourneyRoadmap
        title="JEE Study Plan Roadmap"
        subtitle="6 strategic milestones built by IITians to prepare smart and track progress."
        planKey="mentor-jee-2027-6m"
        targetExam="JEE Main 2027"
      />

      <main className="scp-container" id="details">
        {/* Daily Schedule Structure */}
        <section className="scp-section" id="daily-schedule">
          <div className="scp-section-header">
            <span className="scp-kicker">High-Performance Routine</span>
            <h2 className="scp-h2">Master 8-Hour Daily Schedule</h2>
            <p className="scp-section-sub">
              This routine is built around ultradian focus rhythms (90-120 minute deep work sprints) to maximize problem-solving retention without mental exhaustion:
            </p>
          </div>

          <div className="scp-table-wrapper">
            <table className="scp-table">
              <thead>
                <tr>
                  <th>Block & Time</th>
                  <th>Core Activity</th>
                  <th>Best Practice Guidance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Slot 1 (06:30 – 08:30 AM)</strong></td>
                  <td>Chemistry NCERT & Memory Block</td>
                  <td>Brain is fresh: read Inorganic NCERT, memorize Organic name reactions, or review formula sheets.</td>
                </tr>
                <tr>
                  <td><strong>Slot 2 (09:30 – 12:00 PM)</strong></td>
                  <td>Physics Heavy Numerical Sprint</td>
                  <td>Solve 25-30 timed problems in Mechanics, Electromagnetism, or Thermodynamics.</td>
                </tr>
                <tr>
                  <td><strong>Slot 3 (02:00 – 04:30 PM)</strong></td>
                  <td>Mathematics Problem Solving</td>
                  <td>Tackle 15-20 challenging Calculus or Coordinate Geometry problems without looking at answer keys.</td>
                </tr>
                <tr>
                  <td><strong>Slot 4 (05:30 – 07:30 PM)</strong></td>
                  <td>Classroom / Coaching Lecture Review</td>
                  <td>Synthesize coaching notes, clarify doubts, solve assigned homework sets.</td>
                </tr>
                <tr>
                  <td><strong>Slot 5 (08:30 – 10:00 PM)</strong></td>
                  <td>Backlog & Spaced Revision Block</td>
                  <td>Review Day-7 and Day-21 flagged questions; complete 10 backlog questions.</td>
                </tr>
                <tr>
                  <td><strong>Night Check-in (10:15 PM)</strong></td>
                  <td>Mentor Accountability Log</td>
                  <td>Submit completed question count and hours to your IITian mentor on the portal.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3 Core Rules of Top Scorers */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Habits of Toppers</span>
            <h2 className="scp-h2">3 Golden Rules for Study Plans</h2>
            <p className="scp-section-sub">
              Why the best timetable fails if these behavioral systems are not in place:
            </p>
          </div>

          <div className="jmh-grid">
            {/* Rule 1 */}
            <div className="jmh-card">
              <div className="jmh-card-top">
                <div className="jmh-card-icon" style={{ background: "rgba(255, 105, 61, 0.08)", color: "#FF693D" }}>
                  <Clock size={22} />
                </div>
                <span className="jmh-card-badge">LIVE</span>
              </div>
              <h3 className="jmh-card-title">Output-Based Metrics</h3>
              <p className="jmh-card-desc">
                Track pen-on-paper problem quotas rather than passive study hours to ensure genuine test-readiness.
              </p>
              <ul className="jmh-card-bullets">
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Daily quota: 60–80 high-yield questions</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Timed stopwatch sprints per problem deck</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" />
                  <span>Verified study streak submissions nightly</span>
                </li>
              </ul>
              <Link to="/jee-mentorship/1-to-1" className="jmh-card-action">
                <span>View daily quota tracker</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Rule 2 */}
            <div className="jmh-card">
              <div className="jmh-card-top">
                <div className="jmh-card-icon" style={{ background: "rgba(16, 185, 129, 0.08)", color: "#10B981" }}>
                  <Layers size={22} />
                </div>
                <span className="jmh-card-badge">LIVE</span>
              </div>
              <h3 className="jmh-card-title">1-7-21 Spaced Engine</h3>
              <p className="jmh-card-desc">
                Methodical revision at 24 hours, 7 days, and 21 days locks formulas permanently into long-term recall.
              </p>
              <ul className="jmh-card-bullets">
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" style={{ background: "#10B981" }} />
                  <span>Zero last-minute exam month panic</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" style={{ background: "#10B981" }} />
                  <span>Immediate formula recall during mock tests</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" style={{ background: "#10B981" }} />
                  <span>Automated revision queue managed by mentor</span>
                </li>
              </ul>
              <Link to="/jee-preparation/strategy" className="jmh-card-action">
                <span>See repetition methodology</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Rule 3 */}
            <div className="jmh-card">
              <div className="jmh-card-top">
                <div className="jmh-card-icon" style={{ background: "rgba(99, 102, 241, 0.08)", color: "#6366F1" }}>
                  <Flame size={22} />
                </div>
                <span className="jmh-card-badge">LIVE</span>
              </div>
              <h3 className="jmh-card-title">Backlog Guardrails</h3>
              <p className="jmh-card-desc">
                Strict separation of ongoing coaching topics from backlogs to protect current academic momentum.
              </p>
              <ul className="jmh-card-bullets">
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" style={{ background: "#6366F1" }} />
                  <span>70% study time locked on ongoing coaching syllabus</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" style={{ background: "#6366F1" }} />
                  <span>30% evening block dedicated to high-weightage backlogs</span>
                </li>
                <li className="jmh-card-bullet">
                  <span className="jmh-bullet-dot" style={{ background: "#6366F1" }} />
                  <span>Zero spillover into daily sleep schedule</span>
                </li>
              </ul>
              <Link to="/jee-preparation/backlog" className="jmh-card-action">
                <span>Explore 70-30 formula</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <ClusterPricing
          planKey="mentor-jee-2027-6m"
          exam="JEE Study Plan & Mentorship"
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
            <h2 className="scp-h2">Explore Preparation Strategies</h2>
          </div>
          <ClusterRelated
            currentPath={currentPath}
            selectedPaths={[
              "/jee-preparation",
              "/jee-preparation/backlog",
              "/jee-preparation/strategy",
              "/jee-mentorship/1-to-1"
            ]}
          />
        </section>
      </main>
    </div>
  );
}

